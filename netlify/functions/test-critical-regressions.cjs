const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const originalEnv = { ...process.env }

function clearFunctionCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes('/netlify/functions/')) {
      delete require.cache[key]
    }
  }
}

function withMocks(mocks, fn) {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return originalLoad.call(this, request, parent, isMain)
  }

  clearFunctionCache()

  return Promise.resolve()
    .then(fn)
    .finally(() => {
      Module._load = originalLoad
      clearFunctionCache()
      process.env = { ...originalEnv }
    })
}

const stripeMock = () => () => ({
  prices: {
    retrieve: async () => ({ unit_amount: 4999, currency: 'usd' }),
  },
  checkout: {
    sessions: {
      create: async () => {
        throw new Error('checkout should not be created while purchasing is disabled')
      },
    },
  },
  paymentIntents: {
    retrieve: async () => ({ id: 'pi_test', metadata: {} }),
    create: async () => {
      throw new Error('payment intent should not be created while purchasing is disabled')
    },
    update: async () => {
      throw new Error('payment intent should not be updated while purchasing is disabled')
    },
  },
  tax: {
    calculations: {
      create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
    },
  },
})

const securityLoggerMock = {
  logAPIAccess: () => {},
  logRateLimit: () => {},
  logFormSubmission: () => {},
  logBotDetected: () => {},
  logRecaptcha: () => {},
  logInjectionAttempt: () => {},
  EVENT_TYPES: {},
}

const baseUtilityMocks = {
  './utils/rate-limiter': {
    checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '127.0.0.1',
  },
  './utils/security-logger': securityLoggerMock,
}

const formUtilityMocks = {
  ...baseUtilityMocks,
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
    initBlobsStores: async () => {},
    getUnsubscribeStore: () => ({ set: async () => {} }),
  },
  './utils/csrf-validator': {
    validateCSRFToken: async () => ({ valid: true }),
  },
}

function jsonEvent(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 regression test',
      origin: 'https://www.acdrainwiz.com',
    },
    body: JSON.stringify(body),
  }
}

function formEvent(params) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0 regression test',
      origin: 'https://www.acdrainwiz.com',
    },
    body: new URLSearchParams(params).toString(),
  }
}

async function testPurchasingDisabledGuards() {
  await withMocks({ ...baseUtilityMocks, stripe: stripeMock() }, async () => {
    delete process.env.PURCHASING_ENABLED
    delete process.env.VITE_PURCHASING_ENABLED

    const cases = [
      {
        name: 'get-price-id',
        handler: require('./get-price-id').handler,
        event: jsonEvent({ product: 'mini', quantity: 1, role: 'homeowner' }),
      },
      {
        name: 'create-checkout',
        handler: require('./create-checkout').handler,
        event: jsonEvent({ priceId: 'price_test', quantity: 1, product: 'mini' }),
      },
      {
        name: 'create-payment-intent',
        handler: require('./create-payment-intent').handler,
        event: jsonEvent({
          priceId: 'price_test',
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
        }),
      },
      {
        name: 'update-payment-intent',
        handler: require('./update-payment-intent').handler,
        event: jsonEvent({
          paymentIntentId: 'pi_test',
          priceId: 'price_test',
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
        }),
      },
    ]

    for (const testCase of cases) {
      const response = await testCase.handler(testCase.event, {})
      assert.strictEqual(response.statusCode, 503, `${testCase.name} should fail closed`)
      assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
    }
  })
}

async function testMiniUsesListPriceForContractors() {
  await withMocks({ ...baseUtilityMocks, stripe: stripeMock() }, async () => {
    process.env.PURCHASING_ENABLED = 'true'
    process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
    process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_contractor_tier'

    const response = await require('./get-price-id').handler(
      jsonEvent({ product: 'mini', quantity: 600, role: 'hvac_pro' }),
      {}
    )
    const body = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(body.priceId, 'price_mini_homeowner')
    assert.strictEqual(body.tier, 'msrp')
    assert.strictEqual(body.quantity, 600)
  })
}

async function testGhlFailureIsNotReportedAsSuccess() {
  await withMocks(
    {
      ...formUtilityMocks,
      './utils/ghl-client': {
        submitForm: async () => {
          throw new Error('GHL unavailable')
        },
      },
    },
    async () => {
      delete process.env.RECAPTCHA_SECRET_KEY

      const contactResponse = await require('./validate-form-submission').handler(
        formEvent({
          'form-name': 'contact-general',
          'form-type': 'contact-general',
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          message: 'Please contact me.',
          consent: 'yes',
        }),
        {}
      )
      assert.strictEqual(contactResponse.statusCode, 502)
      assert.strictEqual(JSON.parse(contactResponse.body).success, false)

      const unsubscribeResponse = await require('./validate-unsubscribe').handler(
        formEvent({
          email: 'ada@example.com',
          reason: 'too-many-emails',
          'csrf-token': 'csrf_test',
        }),
        {}
      )
      assert.strictEqual(unsubscribeResponse.statusCode, 502)
      assert.strictEqual(JSON.parse(unsubscribeResponse.body).success, false)
    }
  )
}

async function main() {
  await testPurchasingDisabledGuards()
  await testMiniUsesListPriceForContractors()
  await testGhlFailureIsNotReportedAsSuccess()
  console.log('critical regressions passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
