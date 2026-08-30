const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname

function clearFunctionCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(functionsDir)) {
      delete require.cache[key]
    }
  }
}

function withMocks(mocks, run) {
  const originalLoad = Module._load
  Module._load = function mockedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return originalLoad.call(this, request, parent, isMain)
  }

  try {
    clearFunctionCache()
    return run()
  } finally {
    Module._load = originalLoad
    clearFunctionCache()
  }
}

function loadFunction(file, mocks) {
  return withMocks(mocks, () => require(path.join(functionsDir, file)))
}

const noopLogger = {
  EVENT_TYPES: {},
  logAPIAccess() {},
  logRateLimit() {},
  logFormSubmission() {},
  logBotDetected() {},
  logRecaptcha() {},
  logInjectionAttempt() {},
}

const allowRateLimit = {
  checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99 }),
  getRateLimitHeaders: () => ({ 'X-RateLimit-Remaining': '99' }),
  getClientIP: () => '203.0.113.10',
}

const allowRequestChecks = {
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
}

function stripeMock() {
  const calls = []
  const stripeFactory = () => ({
    prices: {
      retrieve: async (priceId) => {
        calls.push(priceId)
        return {
          unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 12345,
          currency: 'usd',
        }
      },
    },
  })
  stripeFactory.calls = calls
  return stripeFactory
}

async function testPurchasingDisabledBlocksPaymentFunctions() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  for (const file of [
    'get-price-id.js',
    'create-checkout.js',
    'create-payment-intent.js',
    'update-payment-intent.js',
  ]) {
    const stripe = stripeMock()
    const { handler } = loadFunction(file, {
      stripe,
      './utils/rate-limiter': allowRateLimit,
      './utils/security-logger': noopLogger,
      './utils/shipping-calculator.cjs': {
        calculateShipping: async () => ({ cost: 15 }),
        parseProducts: () => ({}),
      },
    })

    const response = await handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ product: 'mini', quantity: 1, priceId: 'price_mini_homeowner' }),
    }, {})

    assert.equal(response.statusCode, 503, `${file} should reject while purchasing is disabled`)
    assert.equal(stripe.calls.length, 0, `${file} should not touch Stripe while disabled`)
  }
}

async function testMiniContractorPricingPinsToMsrp() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_contractor_tier'

  const { handler } = loadFunction('get-price-id.js', {
    stripe: stripeMock(),
    './utils/rate-limiter': allowRateLimit,
    './utils/security-logger': noopLogger,
  })

  const response = await handler({
    httpMethod: 'POST',
    headers: { 'user-agent': 'Mozilla/5.0' },
    body: JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }),
  }, {})

  assert.equal(response.statusCode, 200)
  const body = JSON.parse(response.body)
  assert.equal(body.priceId, 'price_mini_homeowner')
  assert.equal(body.tier, 'msrp')
  assert.equal(body.unitPrice, 49.99)
}

async function testFormSubmissionFailsClosedWhenGhlFails() {
  const { handler } = loadFunction('validate-form-submission.js', {
    './utils/rate-limiter': allowRateLimit,
    './utils/security-logger': noopLogger,
    './utils/input-sanitizer': {
      sanitizeFormData: (data) => data,
    },
    './utils/cors-config': {
      getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
    },
    './utils/blobs-store': {
      initBlobsStores: () => {},
    },
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('GHL unavailable')
      },
    },
    ...allowRequestChecks,
  })

  const form = new URLSearchParams({
    'form-name': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  })

  const response = await handler({
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: { origin: 'https://www.acdrainwiz.com', 'user-agent': 'Mozilla/5.0' },
    body: form.toString(),
  }, {})

  assert.equal(response.statusCode, 502)
  assert.equal(JSON.parse(response.body).success, false)
}

async function testUnsubscribeInvalidCsrfBlocksBeforeGhl() {
  let ghlCalled = false
  const { handler } = loadFunction('validate-unsubscribe.js', {
    './utils/rate-limiter': allowRateLimit,
    './utils/security-logger': noopLogger,
    './utils/input-sanitizer': {
      sanitizeFormData: (data) => data,
    },
    './utils/cors-config': {
      getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
    },
    './utils/blobs-store': {
      initBlobsStores: () => {},
      getUnsubscribeStore: () => null,
    },
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({
        valid: false,
        reason: 'Invalid CSRF token',
        details: { message: 'Security token is invalid or expired' },
      }),
    },
    './utils/ghl-client': {
      submitForm: async () => {
        ghlCalled = true
      },
    },
    ...allowRequestChecks,
  })

  const response = await handler({
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-unsubscribe',
    headers: { origin: 'https://www.acdrainwiz.com', 'user-agent': 'Mozilla/5.0' },
    body: new URLSearchParams({
      email: 'ada@example.com',
      reason: 'not-relevant',
      'csrf-token': 'bad-token',
    }).toString(),
  }, {})

  assert.equal(response.statusCode, 400)
  assert.equal(ghlCalled, false)
}

async function testUnsubscribeFailsClosedWhenGhlFails() {
  const { handler } = loadFunction('validate-unsubscribe.js', {
    './utils/rate-limiter': allowRateLimit,
    './utils/security-logger': noopLogger,
    './utils/input-sanitizer': {
      sanitizeFormData: (data) => data,
    },
    './utils/cors-config': {
      getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
    },
    './utils/blobs-store': {
      initBlobsStores: () => {},
      getUnsubscribeStore: () => null,
    },
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({ valid: true }),
    },
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('GHL unavailable')
      },
    },
    ...allowRequestChecks,
  })

  const response = await handler({
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-unsubscribe',
    headers: { origin: 'https://www.acdrainwiz.com', 'user-agent': 'Mozilla/5.0' },
    body: new URLSearchParams({
      email: 'ada@example.com',
      reason: 'not-relevant',
      'csrf-token': 'valid-token',
    }).toString(),
  }, {})

  assert.equal(response.statusCode, 502)
  assert.equal(JSON.parse(response.body).success, false)
}

async function run() {
  await testPurchasingDisabledBlocksPaymentFunctions()
  await testMiniContractorPricingPinsToMsrp()
  await testFormSubmissionFailsClosedWhenGhlFails()
  await testUnsubscribeInvalidCsrfBlocksBeforeGhl()
  await testUnsubscribeFailsClosedWhenGhlFails()
  console.log('Critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
