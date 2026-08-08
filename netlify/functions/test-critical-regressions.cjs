const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname

function clearFunctionModules() {
  for (const cacheKey of Object.keys(require.cache)) {
    if (cacheKey.startsWith(functionsDir) && cacheKey !== __filename) {
      delete require.cache[cacheKey]
    }
  }
}

function withMocks(mocks, fn) {
  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return originalLoad.call(this, request, parent, isMain)
  }

  clearFunctionModules()
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      Module._load = originalLoad
      clearFunctionModules()
    })
}

function event(body, pathName = '/.netlify/functions/test') {
  return {
    httpMethod: 'POST',
    path: pathName,
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }
}

const rateLimiterMock = {
  checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
  getRateLimitHeaders: () => ({}),
  getClientIP: () => '203.0.113.10',
}

const loggerMock = {
  logAPIAccess: () => {},
  logRateLimit: () => {},
  logFormSubmission: () => {},
  logBotDetected: () => {},
  logRecaptcha: () => {},
  logInjectionAttempt: () => {},
  EVENT_TYPES: {},
}

const formMocks = {
  './utils/rate-limiter': rateLimiterMock,
  './utils/input-sanitizer': { sanitizeFormData: (data) => data },
  './utils/cors-config': { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) },
  './utils/security-logger': loggerMock,
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
}

async function testPurchasingDisabledBlocksStripeCalls() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  let stripeRetrieveCalls = 0
  await withMocks({
    stripe: () => ({
      prices: {
        retrieve: async () => {
          stripeRetrieveCalls += 1
          return { unit_amount: 4999, currency: 'usd' }
        },
      },
    }),
    './utils/rate-limiter': rateLimiterMock,
    './utils/security-logger': loggerMock,
  }, async () => {
    process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
    const functionNames = [
      'get-price-id',
      'create-checkout',
      'create-payment-intent',
      'update-payment-intent',
    ]

    for (const functionName of functionNames) {
      const { handler } = require(path.join(functionsDir, `${functionName}.js`))
      const response = await handler(event({
        product: 'mini',
        quantity: 1,
        priceId: 'price_mini_homeowner',
        paymentIntentId: 'pi_test',
        shippingAddress: {
          line1: '123 Main St',
          city: 'Boise',
          state: 'ID',
          zip: '83702',
          country: 'US',
          email: 'customer@example.com',
        },
      }), {})
      assert.strictEqual(response.statusCode, 503, `${functionName} should be unavailable when purchasing is disabled`)
    }
  })

  assert.strictEqual(stripeRetrieveCalls, 0, 'disabled purchasing must not call Stripe')
}

async function testMiniUsesListPriceForProRoles() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_hvac_t3'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

  let requestedPriceId = null
  await withMocks({
    stripe: () => ({
      prices: {
        retrieve: async (priceId) => {
          requestedPriceId = priceId
          return { unit_amount: 4999, currency: 'usd' }
        },
      },
    }),
    './utils/rate-limiter': rateLimiterMock,
    './utils/security-logger': loggerMock,
  }, async () => {
    const { handler } = require(path.join(functionsDir, 'get-price-id.js'))
    const miniResponse = await handler(event({
      product: 'mini',
      quantity: 600,
      role: 'hvac_pro',
    }), {})
    assert.strictEqual(miniResponse.statusCode, 200)
    assert.strictEqual(requestedPriceId, 'price_mini_homeowner')

    const miniBody = JSON.parse(miniResponse.body)
    assert.strictEqual(miniBody.priceId, 'price_mini_homeowner')
    assert.strictEqual(miniBody.tier, 'msrp')

    const sensorResponse = await handler(event({
      product: 'sensor',
      quantity: 600,
      role: 'hvac_pro',
    }), {})
    assert.strictEqual(sensorResponse.statusCode, 400)
    assert.strictEqual(JSON.parse(sensorResponse.body).requiresContact, true)
  })
}

async function testFormDeliveryFailureReturns502() {
  await withMocks({
    ...formMocks,
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('GHL outage')
      },
    },
  }, async () => {
    const { handler } = require(path.join(functionsDir, 'validate-form-submission.js'))
    const body = new URLSearchParams({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      message: 'Please contact me about AC Drain Wiz.',
      consent: 'yes',
    })

    const response = await handler(event(body.toString(), '/.netlify/functions/validate-form-submission'), {})
    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(JSON.parse(response.body).success, false)
  })
}

async function testUnsubscribeDeliveryFailureReturns502() {
  await withMocks({
    ...formMocks,
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('GHL outage')
      },
    },
  }, async () => {
    const { handler } = require(path.join(functionsDir, 'validate-unsubscribe.js'))
    const body = new URLSearchParams({
      email: 'ada@example.com',
      reason: 'not-relevant',
      feedback: 'No longer needed',
    })

    const response = await handler(event(body.toString(), '/.netlify/functions/validate-unsubscribe'), {})
    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(JSON.parse(response.body).success, false)
  })
}

async function testUnsubscribeMissingCsrfIsRejected() {
  await withMocks({
    ...formMocks,
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({
        valid: false,
        reason: 'CSRF token required',
        details: { message: 'Security token is required for form submission' },
      }),
    },
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('GHL should not be called without CSRF')
      },
    },
  }, async () => {
    const { handler } = require(path.join(functionsDir, 'validate-unsubscribe.js'))
    const body = new URLSearchParams({
      email: 'ada@example.com',
      reason: 'not-relevant',
    })

    const response = await handler(event(body.toString(), '/.netlify/functions/validate-unsubscribe'), {})
    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(JSON.parse(response.body).error, 'CSRF token required')
  })
}

async function run() {
  await testPurchasingDisabledBlocksStripeCalls()
  await testMiniUsesListPriceForProRoles()
  await testFormDeliveryFailureReturns502()
  await testUnsubscribeDeliveryFailureReturns502()
  await testUnsubscribeMissingCsrfIsRejected()
  console.log('critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
