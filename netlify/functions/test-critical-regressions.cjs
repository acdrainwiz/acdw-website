const assert = require('assert')
const Module = require('module')
const path = require('path')

const FUNCTIONS_DIR = __dirname

function clearFunction(moduleName) {
  delete require.cache[require.resolve(path.join(FUNCTIONS_DIR, moduleName))]
}

async function withMocks(mocks, fn) {
  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    for (const [matcher, mock] of mocks) {
      if (matcher(request)) return mock
    }
    return originalLoad.call(this, request, parent, isMain)
  }

  try {
    return await fn()
  } finally {
    Module._load = originalLoad
  }
}

function requestEndsWith(suffix) {
  return (request) => request.endsWith(suffix)
}

const rateLimiterMock = {
  checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9, resetTime: Date.now() + 1000 }),
  getRateLimitHeaders: () => ({}),
  getClientIP: () => '203.0.113.10',
}

const securityLoggerMock = {
  logAPIAccess: () => {},
  logRateLimit: () => {},
  logFormSubmission: () => {},
  logBotDetected: () => {},
  logRecaptcha: () => {},
  logInjectionAttempt: () => {},
  EVENT_TYPES: {},
}

const stripeMock = () => ({
  prices: {
    retrieve: async (priceId) => ({ id: priceId, unit_amount: 4999, currency: 'usd' }),
  },
  paymentIntents: {
    create: async () => ({ id: 'pi_test', client_secret: 'secret_test' }),
    retrieve: async () => ({ id: 'pi_test', metadata: {} }),
    update: async () => ({ id: 'pi_test', client_secret: 'secret_test' }),
  },
  checkout: {
    sessions: {
      create: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test/session' }),
    },
  },
  tax: {
    calculations: {
      create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [], id: 'taxcalc_test' }),
    },
  },
})

const commonMocks = [
  [(request) => request === 'stripe', stripeMock],
  [requestEndsWith('utils/rate-limiter'), rateLimiterMock],
  [requestEndsWith('utils/security-logger'), securityLoggerMock],
  [requestEndsWith('utils/shipping-calculator.cjs'), {
    calculateShipping: async () => ({ cost: 15 }),
    parseProducts: () => ({}),
  }],
]

function postEvent(body, extraHeaders = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/test',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0 regression-test',
      ...extraHeaders,
    },
    body,
  }
}

async function testPurchasingDefaultsClosed() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  clearFunction('create-payment-intent.js')

  await withMocks(commonMocks, async () => {
    const { handler } = require('./create-payment-intent')
    const response = await handler(postEvent(JSON.stringify({})), {})
    assert.strictEqual(response.statusCode, 503)
    assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
  })
}

async function testMiniUsesListPriceForContractors() {
  process.env.VITE_PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  delete process.env.STRIPE_PRICE_MINI_HVAC_T3
  clearFunction('get-price-id.js')

  await withMocks(commonMocks, async () => {
    const { handler } = require('./get-price-id')
    const response = await handler(
      postEvent(JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }), {
        'content-type': 'application/json',
      }),
      {}
    )
    const body = JSON.parse(response.body)
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(body.priceId, 'price_mini_homeowner')
    assert.strictEqual(body.tier, 'msrp')
    assert.strictEqual(body.unitPrice, 49.99)
  })
}

async function testUnsubscribeRejectsInvalidCsrf() {
  clearFunction('validate-unsubscribe.js')

  await withMocks([
    ...commonMocks,
    [requestEndsWith('utils/input-sanitizer'), { sanitizeFormData: (data) => data }],
    [requestEndsWith('utils/request-fingerprint'), { validateRequestFingerprint: () => ({ isBot: false }) }],
    [requestEndsWith('utils/ip-reputation'), { validateIP: async () => ({ allowed: true }), addToBlacklist: async () => {} }],
    [requestEndsWith('utils/behavioral-analysis'), { validateSubmissionBehavior: async () => ({ allowed: true }) }],
    [requestEndsWith('utils/email-domain-validator'), { validateEmailDomain: async () => ({ valid: true }) }],
    [requestEndsWith('utils/blobs-store'), { initBlobsStores: () => ({}), getUnsubscribeStore: () => null }],
    [requestEndsWith('utils/cors-config'), { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }],
    [requestEndsWith('utils/csrf-validator'), { validateCSRFToken: async () => ({ valid: false, reason: 'Security token required' }) }],
    [requestEndsWith('utils/ghl-client'), { submitForm: async () => { throw new Error('should not submit') } }],
  ], async () => {
    const { handler } = require('./validate-unsubscribe')
    const response = await handler(postEvent('email=test%40example.com&reason=other'), {})
    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(JSON.parse(response.body).error, 'Security token required')
  })
}

async function testFormSubmissionFailsWhenGhlFails() {
  clearFunction('validate-form-submission.js')

  await withMocks([
    ...commonMocks,
    [requestEndsWith('utils/input-sanitizer'), {
      sanitizeFormData: (data) => ({ ...data }),
    }],
    [requestEndsWith('utils/cors-config'), { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }],
    [requestEndsWith('utils/request-fingerprint'), { validateRequestFingerprint: () => ({ isBot: false }) }],
    [requestEndsWith('utils/ip-reputation'), { validateIP: async () => ({ allowed: true }), addToBlacklist: async () => {} }],
    [requestEndsWith('utils/behavioral-analysis'), { validateSubmissionBehavior: async () => ({ allowed: true }) }],
    [requestEndsWith('utils/email-domain-validator'), { validateEmailDomain: async () => ({ valid: true }) }],
    [requestEndsWith('utils/blobs-store'), { initBlobsStores: () => ({ initialized: true }) }],
    [requestEndsWith('utils/ghl-client'), { submitForm: async () => { throw new Error('GHL unavailable') } }],
  ], async () => {
    const { handler } = require('./validate-form-submission')
    const response = await handler(
      postEvent(
        'form-name=contact-general&form-type=contact&firstName=Ada&lastName=Lovelace&email=ada%40example.com&message=Need%20help&consent=yes&form-load-time=10000'
      ),
      {}
    )
    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(JSON.parse(response.body).success, false)
  })
}

async function run() {
  await testPurchasingDefaultsClosed()
  await testMiniUsesListPriceForContractors()
  await testUnsubscribeRejectsInvalidCsrf()
  await testFormSubmissionFailsWhenGhlFails()
  console.log('critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
