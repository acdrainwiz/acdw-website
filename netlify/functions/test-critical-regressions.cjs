const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

const stripeState = {
  retrieveCalls: [],
}

let ghlShouldThrow = false
let csrfValid = true

const stubs = new Map([
  ['stripe', () => ({
    prices: {
      retrieve: async (priceId) => {
        stripeState.retrieveCalls.push(priceId)
        return {
          id: priceId,
          unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 12345,
          currency: 'usd',
        }
      },
    },
    paymentIntents: {
      retrieve: async () => ({ metadata: {} }),
      create: async () => ({ id: 'pi_test', client_secret: 'pi_secret' }),
      update: async () => ({ id: 'pi_test', client_secret: 'pi_secret' }),
    },
    checkout: {
      sessions: {
        create: async () => ({ id: 'cs_test', url: 'https://stripe.example/checkout' }),
      },
    },
    tax: {
      calculations: {
        create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
      },
    },
  })],
  ['./utils/rate-limiter', {
    checkRateLimit: async () => ({
      allowed: true,
      remaining: 29,
      limit: 30,
      resetTime: Date.now() + 60000,
      retryAfter: 0,
    }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
  }],
  ['./utils/security-logger', {
    logAPIAccess: () => {},
    logRateLimit: () => {},
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  }],
  ['./utils/request-fingerprint', {
    validateRequestFingerprint: () => ({ isBot: false }),
  }],
  ['./utils/ip-reputation', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  }],
  ['./utils/behavioral-analysis', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  }],
  ['./utils/email-domain-validator', {
    validateEmailDomain: async () => ({ valid: true }),
  }],
  ['./utils/blobs-store', {
    initBlobsStores: () => ({ initialized: true }),
    getUnsubscribeStore: () => ({ set: async () => {} }),
  }],
  ['./utils/csrf-validator', {
    validateCSRFToken: async () => (
      csrfValid
        ? { valid: true }
        : { valid: false, reason: 'Security token required', details: { message: 'Refresh and retry' } }
    ),
  }],
  ['./utils/ghl-client', {
    submitForm: async () => {
      if (ghlShouldThrow) {
        const error = new Error('GHL unavailable')
        error.status = 503
        throw error
      }
      return { contactId: 'contact_123', isNew: true, traceId: 'trace_123', warnings: [] }
    },
  }],
  ['./utils/shipping-calculator.cjs', {
    calculateShipping: async () => ({ cost: 15 }),
    parseProducts: () => ({}),
  }],
])

Module._load = function patchedLoad(request, parent, isMain) {
  if (stubs.has(request)) {
    return stubs.get(request)
  }
  return originalLoad.call(this, request, parent, isMain)
}

function clearFunctionModule(relativePath) {
  delete require.cache[path.join(functionsDir, relativePath)]
}

function loadHandler(relativePath) {
  const fullPath = path.join(functionsDir, relativePath)
  delete require.cache[fullPath]
  return require(fullPath).handler
}

function postJson(body) {
  return {
    httpMethod: 'POST',
    headers: { 'user-agent': 'Mozilla/5.0', origin: 'https://www.acdrainwiz.com' },
    body: JSON.stringify(body),
    path: '/.netlify/functions/test',
  }
}

function postForm(body, functionName) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0',
      origin: 'https://www.acdrainwiz.com',
    },
    body: new URLSearchParams(body).toString(),
    path: `/.netlify/functions/${functionName}`,
  }
}

async function testPurchasingDisabled(handlerPath, body) {
  process.env.PURCHASING_ENABLED = ''
  process.env.VITE_PURCHASING_ENABLED = ''
  stripeState.retrieveCalls = []
  clearFunctionModule(handlerPath)
  const handler = loadHandler(handlerPath)
  const response = await handler(postJson(body), {})
  assert.strictEqual(response.statusCode, 503, `${handlerPath} should fail closed when purchasing is disabled`)
  assert.strictEqual(stripeState.retrieveCalls.length, 0, `${handlerPath} should not call Stripe when disabled`)
}

async function run() {
  await testPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1 })
  await testPurchasingDisabled('create-checkout.js', {
    priceId: 'price_mini_homeowner',
    quantity: 1,
    product: 'mini',
    isGuest: true,
    shippingAddress: { city: 'Boise', state: 'ID', country: 'US' },
  })
  await testPurchasingDisabled('create-payment-intent.js', {
    priceId: 'price_mini_homeowner',
    quantity: 1,
    product: 'mini',
    shippingAddress: {
      line1: '1 Main St',
      city: 'Boise',
      state: 'ID',
      zip: '83702',
      country: 'US',
      email: 'buyer@example.com',
    },
  })
  await testPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_test',
    priceId: 'price_mini_homeowner',
    quantity: 1,
    product: 'mini',
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
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_discount'
  stripeState.retrieveCalls = []
  const getPriceId = loadHandler('get-price-id.js')
  const miniPriceResponse = await getPriceId(postJson({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }), {})
  assert.strictEqual(miniPriceResponse.statusCode, 200)
  const miniPriceBody = JSON.parse(miniPriceResponse.body)
  assert.strictEqual(miniPriceBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(miniPriceBody.tier, 'msrp')
  assert.strictEqual(miniPriceBody.unitPrice, 49.99)

  ghlShouldThrow = true
  const validateForm = loadHandler('validate-form-submission.js')
  const contactResponse = await validateForm(postForm({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz products.',
    consent: 'yes',
  }, 'validate-form-submission'), {})
  assert.strictEqual(contactResponse.statusCode, 502)
  assert.strictEqual(JSON.parse(contactResponse.body).success, false)

  csrfValid = false
  ghlShouldThrow = false
  const validateUnsubscribe = loadHandler('validate-unsubscribe.js')
  const csrfResponse = await validateUnsubscribe(postForm({
    email: 'customer@example.com',
    reason: 'not-relevant',
    'csrf-token': 'bad-token',
  }, 'validate-unsubscribe'), {})
  assert.strictEqual(csrfResponse.statusCode, 400)

  csrfValid = true
  ghlShouldThrow = true
  const unsubscribeResponse = await validateUnsubscribe(postForm({
    email: 'customer@example.com',
    reason: 'not-relevant',
    'csrf-token': 'valid-token',
  }, 'validate-unsubscribe'), {})
  assert.strictEqual(unsubscribeResponse.statusCode, 502)
  assert.strictEqual(JSON.parse(unsubscribeResponse.body).success, false)
}

run()
  .then(() => {
    console.log('critical regression tests passed')
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
