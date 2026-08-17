const assert = require('assert')
const Module = require('module')
const path = require('path')

const FUNCTIONS_DIR = __dirname

function clearFunctionCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(FUNCTIONS_DIR)) {
      delete require.cache[key]
    }
  }
}

function withMocks(mocks, fn) {
  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return originalLoad.apply(this, arguments)
  }

  clearFunctionCache()
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      Module._load = originalLoad
      clearFunctionCache()
    })
}

const rateLimiterMock = {
  checkRateLimit: async () => ({
    allowed: true,
    remaining: 29,
    limit: 30,
    resetTime: Date.now() + 60000,
    retryAfter: 0,
  }),
  getRateLimitHeaders: () => ({}),
  getClientIP: (event) => event.headers['x-forwarded-for'] || '127.0.0.1',
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

const commonUtilityMocks = {
  './utils/rate-limiter': rateLimiterMock,
  './utils/security-logger': securityLoggerMock,
  './utils/input-sanitizer': {
    sanitizeFormData: (data) => ({ ...data }),
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
    getUnsubscribeStore: () => null,
  },
  './utils/csrf-validator': {
    validateCSRFToken: async () => ({ valid: true }),
  },
}

function makeStripeMock() {
  const stripeApi = {
    prices: {
      retrieve: async (priceId) => ({
        id: priceId,
        unit_amount: 4999,
        currency: 'usd',
      }),
    },
    checkout: {
      sessions: {
        create: async () => {
          throw new Error('Stripe checkout should not be called while purchasing is disabled')
        },
      },
    },
    paymentIntents: {
      create: async () => {
        throw new Error('Stripe payment intent should not be called while purchasing is disabled')
      },
      retrieve: async () => ({ metadata: {} }),
      update: async () => {
        throw new Error('Stripe payment intent update should not be called while purchasing is disabled')
      },
    },
    tax: {
      calculations: {
        create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
      },
    },
  }
  return () => stripeApi
}

function postEvent(body, overrides = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/test',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0',
      origin: 'https://www.acdrainwiz.com',
      'x-forwarded-for': '203.0.113.10',
      ...overrides.headers,
    },
    body: typeof body === 'string' ? body : new URLSearchParams(body).toString(),
    ...overrides,
  }
}

async function testPurchasingDisabledBlocksPaymentFunctions() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  await withMocks(
    {
      ...commonUtilityMocks,
      stripe: makeStripeMock(),
      './utils/shipping-calculator.cjs': {
        calculateShipping: async () => ({ cost: 10 }),
        parseProducts: () => ({}),
      },
    },
    async () => {
      const cases = [
        ['get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' }],
        ['create-checkout.js', { priceId: 'price_test', product: 'mini', quantity: 1 }],
        ['create-payment-intent.js', { priceId: 'price_test', product: 'mini', quantity: 1 }],
        ['update-payment-intent.js', {
          paymentIntentId: 'pi_test',
          priceId: 'price_test',
          product: 'mini',
          quantity: 1,
          shippingAddress: {
            line1: '123 Main St',
            city: 'Boca Raton',
            state: 'FL',
            zip: '33431',
            country: 'US',
            email: 'buyer@example.com',
          },
        }],
      ]

      for (const [file, body] of cases) {
        const { handler } = require(path.join(FUNCTIONS_DIR, file))
        const response = await handler(postEvent(JSON.stringify(body), {
          headers: { 'content-type': 'application/json' },
        }), {})
        assert.strictEqual(response.statusCode, 503, `${file} should be disabled by default`)
      }
    }
  )
}

async function testMiniUsesListPriceForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_list'

  await withMocks(
    {
      ...commonUtilityMocks,
      stripe: makeStripeMock(),
    },
    async () => {
      const { handler } = require(path.join(FUNCTIONS_DIR, 'get-price-id.js'))
      const miniResponse = await handler(postEvent(JSON.stringify({
        product: 'mini',
        quantity: 600,
        role: 'hvac_pro',
      }), {
        headers: { 'content-type': 'application/json' },
      }), {})

      assert.strictEqual(miniResponse.statusCode, 200)
      const miniBody = JSON.parse(miniResponse.body)
      assert.strictEqual(miniBody.priceId, 'price_mini_list')
      assert.strictEqual(miniBody.tier, 'msrp')
      assert.strictEqual(miniBody.quantity, 600)

      const sensorResponse = await handler(postEvent(JSON.stringify({
        product: 'sensor',
        quantity: 600,
        role: 'hvac_pro',
      }), {
        headers: { 'content-type': 'application/json' },
      }), {})

      assert.strictEqual(sensorResponse.statusCode, 400)
      assert.strictEqual(JSON.parse(sensorResponse.body).requiresContact, true)
    }
  )
}

async function testFormGhlFailureReturns502() {
  await withMocks(
    {
      ...commonUtilityMocks,
      './utils/ghl-client': {
        submitForm: async () => {
          throw new Error('GHL unavailable')
        },
      },
    },
    async () => {
      const { handler } = require(path.join(FUNCTIONS_DIR, 'validate-form-submission.js'))
      const response = await handler(postEvent({
        'form-name': 'contact-general',
        'form-type': 'contact-general',
        email: 'lead@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
        message: 'I need help with an AC Drain Wiz installation.',
        consent: 'yes',
      }), {})

      assert.strictEqual(response.statusCode, 502)
      assert.strictEqual(JSON.parse(response.body).success, false)
    }
  )
}

async function testUnsubscribeGhlFailureReturns502() {
  await withMocks(
    {
      ...commonUtilityMocks,
      './utils/ghl-client': {
        submitForm: async () => {
          throw new Error('GHL unavailable')
        },
      },
    },
    async () => {
      const { handler } = require(path.join(FUNCTIONS_DIR, 'validate-unsubscribe.js'))
      const response = await handler(postEvent({
        email: 'customer@example.com',
        reason: 'not-relevant',
        feedback: '',
        'csrf-token': 'csrf_test',
      }), {})

      assert.strictEqual(response.statusCode, 502)
      assert.strictEqual(JSON.parse(response.body).success, false)
    }
  )
}

async function run() {
  await testPurchasingDisabledBlocksPaymentFunctions()
  await testMiniUsesListPriceForContractors()
  await testFormGhlFailureReturns502()
  await testUnsubscribeGhlFailureReturns502()
  console.log('Critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
