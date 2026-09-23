const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
let stripeMock = {}

Module._load = function loadWithMocks(request, parent, isMain) {
  if (request === 'stripe') {
    return () => stripeMock
  }
  return originalLoad.call(this, request, parent, isMain)
}

function setMock(request, exports) {
  const resolved = require.resolve(request)
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  }
}

function clearModule(request) {
  delete require.cache[require.resolve(request)]
}

function installCommonMocks(overrides = {}) {
  setMock('./utils/rate-limiter', {
    checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
    getRateLimitHeaders: () => ({ 'X-RateLimit-Remaining': '99' }),
    getClientIP: () => '127.0.0.1',
    ...(overrides.rateLimiter || {}),
  })
  setMock('./utils/security-logger', {
    logAPIAccess: () => {},
    logRateLimit: () => {},
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
    ...(overrides.securityLogger || {}),
  })
  setMock('./utils/shipping-calculator.cjs', {
    calculateShipping: async () => ({ cost: 15 }),
    parseProducts: (products) => products,
    ...(overrides.shippingCalculator || {}),
  })
  setMock('./utils/input-sanitizer', {
    sanitizeFormData: (data) => data,
    ...(overrides.inputSanitizer || {}),
  })
  setMock('./utils/cors-config', {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
    ...(overrides.corsConfig || {}),
  })
  setMock('./utils/request-fingerprint', {
    validateRequestFingerprint: () => ({ isBot: false }),
    ...(overrides.requestFingerprint || {}),
  })
  setMock('./utils/ip-reputation', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
    ...(overrides.ipReputation || {}),
  })
  setMock('./utils/behavioral-analysis', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
    ...(overrides.behavioralAnalysis || {}),
  })
  setMock('./utils/email-domain-validator', {
    validateEmailDomain: async () => ({ valid: true }),
    ...(overrides.emailDomainValidator || {}),
  })
  setMock('./utils/blobs-store', {
    initBlobsStores: () => {},
    getUnsubscribeStore: () => null,
    ...(overrides.blobsStore || {}),
  })
  setMock('./utils/csrf-validator', {
    validateCSRFToken: async () => ({ valid: true }),
    ...(overrides.csrfValidator || {}),
  })
  setMock('./utils/ghl-client', {
    submitForm: async () => ({
      contactId: 'contact_123',
      isNew: false,
      traceId: 'trace_123',
      warnings: [],
    }),
    ...(overrides.ghlClient || {}),
  })
}

function postEvent(body, extra = {}) {
  return {
    httpMethod: 'POST',
    path: extra.path || '/test',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/test',
      'user-agent': 'Mozilla/5.0 Critical Regression Test',
      ...(extra.headers || {}),
    },
    body,
  }
}

async function testPurchasingApisDefaultClosed() {
  installCommonMocks()
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  stripeMock = {
    prices: {
      retrieve: async () => {
        throw new Error('Stripe should not be called when purchasing is disabled')
      },
    },
  }

  for (const handlerPath of [
    './get-price-id.js',
    './create-checkout.js',
    './create-payment-intent.js',
    './update-payment-intent.js',
  ]) {
    clearModule(handlerPath)
    const { handler } = require(handlerPath)
    const response = await handler(postEvent(JSON.stringify({ product: 'mini', quantity: 1, priceId: 'price_123', paymentIntentId: 'pi_123', shippingAddress: {} })), {})
    assert.strictEqual(response.statusCode, 503, `${handlerPath} must default closed when purchasing is disabled`)
    assert.strictEqual(JSON.parse(response.body).purchasingDisabled, true)
  }
}

async function testMiniAlwaysUsesListPrice() {
  installCommonMocks()
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_msrp'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_discounted'
  stripeMock = {
    prices: {
      retrieve: async (priceId) => ({ id: priceId, unit_amount: 4999, currency: 'usd' }),
    },
  }

  clearModule('./get-price-id.js')
  const { handler } = require('./get-price-id.js')
  const response = await handler(postEvent(JSON.stringify({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  })), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_msrp')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.quantity, 600)
}

async function testFormGhlFailureReturns502() {
  installCommonMocks({
    ghlClient: {
      submitForm: async () => {
        throw new Error('GHL unavailable')
      },
    },
  })
  clearModule('./validate-form-submission.js')

  const { handler } = require('./validate-form-submission.js')
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 10000),
  }).toString()
  const response = await handler(postEvent(body, { path: '/contact' }), {})
  const parsed = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(parsed.success, false)
}

async function testUnsubscribeGhlFailureReturns502() {
  installCommonMocks({
    ghlClient: {
      submitForm: async () => {
        throw new Error('GHL unavailable')
      },
    },
  })
  clearModule('./validate-unsubscribe.js')

  const { handler } = require('./validate-unsubscribe.js')
  const body = new URLSearchParams({
    email: 'customer@example.com',
    reason: 'not-relevant',
    'csrf-token': 'csrf-valid',
    'form-load-time': String(Date.now() - 10000),
  }).toString()
  const response = await handler(postEvent(body, { path: '/unsubscribe' }), {})
  const parsed = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(parsed.success, false)
}

async function testUnsubscribeInvalidCsrfBlocksBeforeGhl() {
  let ghlCalled = false
  installCommonMocks({
    csrfValidator: {
      validateCSRFToken: async () => ({ valid: false, reason: 'Invalid CSRF token' }),
    },
    ghlClient: {
      submitForm: async () => {
        ghlCalled = true
      },
    },
  })
  clearModule('./validate-unsubscribe.js')

  const { handler } = require('./validate-unsubscribe.js')
  const body = new URLSearchParams({
    email: 'customer@example.com',
    reason: 'not-relevant',
    'csrf-token': 'csrf-invalid',
    'form-load-time': String(Date.now() - 10000),
  }).toString()
  const response = await handler(postEvent(body, { path: '/unsubscribe' }), {})

  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(ghlCalled, false)
}

async function run() {
  const tests = [
    testPurchasingApisDefaultClosed,
    testMiniAlwaysUsesListPrice,
    testFormGhlFailureReturns502,
    testUnsubscribeGhlFailureReturns502,
    testUnsubscribeInvalidCsrfBlocksBeforeGhl,
  ]

  for (const test of tests) {
    await test()
    console.log(`ok - ${test.name}`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
