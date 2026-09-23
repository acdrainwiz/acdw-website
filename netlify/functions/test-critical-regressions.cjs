const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

const stripeMock = {
  prices: {
    retrieve: async (priceId) => ({
      id: priceId,
      unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999,
      currency: 'usd',
    }),
  },
  checkout: {
    sessions: {
      create: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test/session' }),
    },
  },
  paymentIntents: {
    retrieve: async (id) => ({ id, metadata: {} }),
    create: async () => ({ id: 'pi_test', client_secret: 'secret' }),
    update: async (id) => ({ id, client_secret: 'secret' }),
  },
  tax: {
    calculations: {
      create: async () => ({ id: 'tax_test', tax_amount_exclusive: 0, tax_breakdown: [] }),
    },
  },
}

const mocks = {
  stripe: () => stripeMock,
  './utils/rate-limiter': {
    checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '127.0.0.1',
  },
  './utils/security-logger': {
    logAPIAccess: () => {},
    logRateLimit: () => {},
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  },
  './utils/shipping-calculator.cjs': {
    calculateShipping: async () => ({ cost: 15 }),
    parseProducts: (products) => products,
  },
  './utils/input-sanitizer': {
    sanitizeFormData: (data) => data,
  },
  './utils/cors-config': {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
  },
  './utils/request-fingerprint': {
    validateRequestFingerprint: () => ({ isBot: false }),
  },
  './utils/ip-reputation': {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  },
  './utils/behavioral-analysis': {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  },
  './utils/email-domain-validator': {
    validateEmailDomain: async () => ({ valid: true }),
  },
  './utils/blobs-store': {
    initBlobsStores: () => ({ initialized: true }),
    getUnsubscribeStore: () => ({ set: async () => {} }),
  },
  './utils/csrf-validator': {
    validateCSRFToken: async () => ({ valid: true }),
  },
  './utils/ghl-client': {
    submitForm: async () => {
      throw new Error('GHL unavailable')
    },
  },
}

Module._load = function patchedLoad(request, parent, isMain) {
  if (Object.prototype.hasOwnProperty.call(mocks, request)) {
    return mocks[request]
  }
  return originalLoad.call(this, request, parent, isMain)
}

function loadFunction(fileName) {
  const fullPath = path.join(functionsDir, fileName)
  delete require.cache[require.resolve(fullPath)]
  return require(fullPath)
}

function postEvent(body, extra = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0',
      ...extra.headers,
    },
    path: extra.path || '/test',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }
}

async function assertPurchasingDisabled(fileName, body) {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  const { handler } = loadFunction(fileName)
  const response = await handler(postEvent(body, { headers: { 'content-type': 'application/json' } }), {})
  assert.strictEqual(response.statusCode, 503, `${fileName} should be disabled when purchasing flag is not true`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function run() {
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'

  await assertPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' })
  await assertPurchasingDisabled('create-checkout.js', { priceId: 'price_mini_homeowner', product: 'mini', quantity: 1 })
  await assertPurchasingDisabled('create-payment-intent.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {
      line1: '1 Main St',
      city: 'Boise',
      state: 'ID',
      zip: '83702',
      country: 'US',
      email: 'buyer@example.com',
    },
  })
  await assertPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_test',
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {
      line1: '1 Main St',
      city: 'Boise',
      state: 'ID',
      zip: '83702',
      country: 'US',
      email: 'buyer@example.com',
    },
  })

  process.env.PURCHASING_ENABLED = 'true'
  const { handler: getPriceId } = loadFunction('get-price-id.js')
  const miniContractorResponse = await getPriceId(postEvent({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }, { headers: { 'content-type': 'application/json' } }), {})
  assert.strictEqual(miniContractorResponse.statusCode, 200)
  const miniContractorBody = JSON.parse(miniContractorResponse.body)
  assert.strictEqual(miniContractorBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(miniContractorBody.tier, 'msrp')
  assert.strictEqual(miniContractorBody.unitPrice, 49.99)

  const { handler: validateFormSubmission } = loadFunction('validate-form-submission.js')
  const contactBody = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz products.',
    consent: 'yes',
  }).toString()
  const contactResponse = await validateFormSubmission(postEvent(contactBody, { path: '/contact' }), {})
  assert.strictEqual(contactResponse.statusCode, 502)
  assert.strictEqual(JSON.parse(contactResponse.body).success, false)

  const { handler: validateUnsubscribe } = loadFunction('validate-unsubscribe.js')
  const unsubscribeBody = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    'csrf-token': 'token',
  }).toString()
  const unsubscribeResponse = await validateUnsubscribe(postEvent(unsubscribeBody, { path: '/unsubscribe' }), {})
  assert.strictEqual(unsubscribeResponse.statusCode, 502)
  assert.strictEqual(JSON.parse(unsubscribeResponse.body).success, false)
}

run()
  .then(() => {
    console.log('Critical regression tests passed')
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
