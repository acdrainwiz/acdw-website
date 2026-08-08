const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

let ghlShouldThrow = false

const fakeStripe = {
  prices: {
    retrieve: async (priceId) => ({
      id: priceId,
      unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999,
      currency: 'usd',
    }),
  },
  checkout: {
    sessions: {
      create: async () => ({ id: 'cs_test', url: 'https://checkout.example/session' }),
    },
  },
  paymentIntents: {
    retrieve: async (id) => ({ id, metadata: {} }),
    create: async () => ({ id: 'pi_test', client_secret: 'pi_secret' }),
    update: async (id) => ({ id, client_secret: 'pi_secret_updated' }),
  },
  tax: {
    calculations: {
      create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
    },
  },
}

const stubs = {
  './utils/rate-limiter': {
    checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
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
    calculateShipping: async () => ({ cost: 15, method: 'test', carrier: 'test' }),
    parseProducts: () => ({}),
  },
  './utils/input-sanitizer': {
    sanitizeFormData: (data) => ({ ...data }),
  },
  './utils/cors-config': {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
  },
  './utils/blobs-store': {
    initBlobsStores: () => ({}),
    getUnsubscribeStore: () => ({ set: async () => {} }),
    getBotBlacklistStore: () => null,
    getBehavioralPatternsStore: () => null,
    isBlobsAvailable: () => false,
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
  './utils/csrf-validator': {
    validateCSRFToken: async () => ({ valid: true }),
  },
  './utils/ghl-client': {
    submitForm: async () => {
      if (ghlShouldThrow) {
        const error = new Error('GHL unavailable')
        error.status = 503
        throw error
      }
      return { contactId: 'contact_test', isNew: false, traceId: 'trace_test', warnings: [] }
    },
  },
}

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => fakeStripe
  }
  if (Object.prototype.hasOwnProperty.call(stubs, request)) {
    return stubs[request]
  }
  return originalLoad.call(this, request, parent, isMain)
}

function loadFresh(relativePath) {
  const resolved = require.resolve(relativePath)
  delete require.cache[resolved]
  return require(relativePath)
}

function postEvent(body, path) {
  return {
    httpMethod: 'POST',
    path,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'x-csrf-token': 'csrf_test',
    },
    body,
  }
}

function jsonBody(response) {
  return JSON.parse(response.body)
}

async function assertPurchasingDisabled() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  const endpoints = [
    ['./get-price-id.js', '/.netlify/functions/get-price-id'],
    ['./create-checkout.js', '/.netlify/functions/create-checkout'],
    ['./create-payment-intent.js', '/.netlify/functions/create-payment-intent'],
    ['./update-payment-intent.js', '/.netlify/functions/update-payment-intent'],
  ]

  for (const [modulePath, path] of endpoints) {
    const { handler } = loadFresh(modulePath)
    const response = await handler(postEvent(JSON.stringify({}), path), {})
    assert.strictEqual(response.statusCode, 503, `${modulePath} should default closed when purchasing is disabled`)
    assert.strictEqual(jsonBody(response).purchasingEnabled, false)
  }
}

async function assertMiniPricingNormalization() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_SECRET_KEY = 'sk_test'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T1 = 'price_sensor_hvac_t1'

  const { handler } = loadFresh('./get-price-id.js')
  const miniResponse = await handler(
    postEvent(JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }), '/.netlify/functions/get-price-id'),
    {}
  )
  assert.strictEqual(miniResponse.statusCode, 200)
  assert.deepStrictEqual(
    {
      priceId: jsonBody(miniResponse).priceId,
      tier: jsonBody(miniResponse).tier,
      role: jsonBody(miniResponse).role,
    },
    { priceId: 'price_mini_homeowner', tier: 'msrp', role: 'hvac_pro' }
  )

  const sensorResponse = await handler(
    postEvent(JSON.stringify({ product: 'sensor', quantity: 600, role: 'hvac_pro' }), '/.netlify/functions/get-price-id'),
    {}
  )
  assert.strictEqual(sensorResponse.statusCode, 400)
  assert.strictEqual(jsonBody(sensorResponse).requiresContact, true)
}

async function assertCrmFailuresReturnErrors() {
  ghlShouldThrow = true

  const formLoadTime = String(Date.now() - 5000)
  const contactBody = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me.',
    consent: 'yes',
    'form-load-time': formLoadTime,
  }).toString()

  const contactHandler = loadFresh('./validate-form-submission.js').handler
  const contactResponse = await contactHandler(
    postEvent(contactBody, '/.netlify/functions/validate-form-submission'),
    {}
  )
  assert.strictEqual(contactResponse.statusCode, 502)
  assert.strictEqual(jsonBody(contactResponse).success, false)

  const unsubscribeBody = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    feedback: 'No longer needed',
    'form-load-time': formLoadTime,
    'csrf-token': 'csrf_test',
  }).toString()

  const unsubscribeHandler = loadFresh('./validate-unsubscribe.js').handler
  const unsubscribeResponse = await unsubscribeHandler(
    postEvent(unsubscribeBody, '/.netlify/functions/validate-unsubscribe'),
    {}
  )
  assert.strictEqual(unsubscribeResponse.statusCode, 502)
  assert.strictEqual(jsonBody(unsubscribeResponse).success, false)

  ghlShouldThrow = false
}

async function run() {
  await assertPurchasingDisabled()
  await assertMiniPricingNormalization()
  await assertCrmFailuresReturnErrors()
  console.log('Critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
