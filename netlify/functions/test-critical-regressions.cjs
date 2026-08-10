const assert = require('assert')
const Module = require('module')
const path = require('path')

const originalLoad = Module._load
const functionDir = __dirname

function clearFunctionCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(functionDir)) {
      delete require.cache[key]
    }
  }
}

function withMocks(mocks, run) {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return originalLoad.apply(this, arguments)
  }

  try {
    clearFunctionCache()
    return run()
  } finally {
    Module._load = originalLoad
    clearFunctionCache()
  }
}

function baseMocks(overrides = {}) {
  const noop = () => {}
  return {
    '@netlify/blobs': {
      getStore: () => null,
    },
    stripe: () => ({
      prices: {
        retrieve: async (priceId) => ({ id: priceId, unit_amount: 4999, currency: 'usd' }),
      },
      checkout: {
        sessions: {
          create: async () => ({ id: 'cs_test', url: 'https://checkout.test' }),
        },
      },
      paymentIntents: {
        retrieve: async () => ({ id: 'pi_test', metadata: {} }),
        create: async () => ({ id: 'pi_test', client_secret: 'secret' }),
        update: async () => ({ id: 'pi_test', client_secret: 'secret' }),
      },
      tax: {
        calculations: {
          create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
        },
      },
    }),
    './utils/rate-limiter': {
      checkRateLimit: async () => ({ allowed: true, limit: 30, remaining: 29, resetTime: Date.now() + 60000, retryAfter: 0 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    },
    './utils/security-logger': {
      logAPIAccess: noop,
      logRateLimit: noop,
      logFormSubmission: noop,
      logBotDetected: noop,
      logRecaptcha: noop,
      logInjectionAttempt: noop,
      EVENT_TYPES: {},
    },
    './utils/shipping-calculator.cjs': {
      calculateShipping: async () => ({ cost: 15 }),
      parseProducts: () => ({}),
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
      getCsrfTokenStore: () => null,
      isBlobsAvailable: () => false,
    },
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({ valid: true }),
    },
    './utils/ghl-client': {
      submitForm: async () => ({ contactId: 'contact_1', isNew: false, traceId: 'trace_1', warnings: [] }),
    },
    ...overrides,
  }
}

function event(body = {}, extra = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
      'content-type': 'application/x-www-form-urlencoded',
      ...extra.headers,
    },
    path: extra.path || '/.netlify/functions/validate-form-submission',
    body: typeof body === 'string' ? body : new URLSearchParams(body).toString(),
  }
}

async function testPurchasingApisDefaultClosed() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  const functions = [
    'get-price-id.js',
    'create-checkout.js',
    'create-payment-intent.js',
    'update-payment-intent.js',
  ]

  await withMocks(baseMocks(), async () => {
    for (const file of functions) {
      const { handler } = require(path.join(functionDir, file))
      const response = await handler(event({ product: 'mini', quantity: '1', priceId: 'price_test', paymentIntentId: 'pi_test', shippingAddress: '{}' }), {})
      assert.strictEqual(response.statusCode, 503, `${file} should be default-closed when purchasing is disabled`)
      assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
    }
  })
}

async function testMiniContractorUsesHomeownerPriceAtHighQuantity() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_contractor'

  const retrieved = []
  await withMocks(baseMocks({
    stripe: () => ({
      prices: {
        retrieve: async (priceId) => {
          retrieved.push(priceId)
          return { id: priceId, unit_amount: 4999, currency: 'usd' }
        },
      },
    }),
  }), async () => {
    const { handler } = require(path.join(functionDir, 'get-price-id.js'))
    const response = await handler(event({ product: 'mini', quantity: '600', role: 'hvac_pro' }), {})
    const body = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(body.priceId, 'price_mini_homeowner')
    assert.strictEqual(body.tier, 'msrp')
    assert.deepStrictEqual(retrieved, ['price_mini_homeowner'])
  })
}

async function testFormGhlFailureReturns502() {
  await withMocks(baseMocks({
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('GHL unavailable')
      },
    },
  }), async () => {
    const { handler } = require(path.join(functionDir, 'validate-form-submission.js'))
    const response = await handler(event({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      message: 'Please contact me about AC Drain Wiz products.',
      consent: 'yes',
    }), {})
    const body = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(body.success, false)
  })
}

async function testUnsubscribeGhlFailureReturns502() {
  await withMocks(baseMocks({
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('GHL unavailable')
      },
    },
  }), async () => {
    const { handler } = require(path.join(functionDir, 'validate-unsubscribe.js'))
    const response = await handler(event({
      email: 'ada@example.com',
      reason: 'too-many-emails',
      'csrf-token': 'csrf_ok',
    }, { path: '/.netlify/functions/validate-unsubscribe' }), {})
    const body = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(body.success, false)
  })
}

async function testUnsubscribeInvalidCsrfBlocksBeforeGhl() {
  let submitCalled = false
  await withMocks(baseMocks({
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({
        valid: false,
        reason: 'Invalid CSRF token',
        details: { message: 'Security token is invalid or expired' },
      }),
    },
    './utils/ghl-client': {
      submitForm: async () => {
        submitCalled = true
      },
    },
  }), async () => {
    const { handler } = require(path.join(functionDir, 'validate-unsubscribe.js'))
    const response = await handler(event({
      email: 'ada@example.com',
      reason: 'too-many-emails',
      'csrf-token': 'csrf_bad',
    }, { path: '/.netlify/functions/validate-unsubscribe' }), {})

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(submitCalled, false)
  })
}

async function main() {
  await testPurchasingApisDefaultClosed()
  await testMiniContractorUsesHomeownerPriceAtHighQuantity()
  await testFormGhlFailureReturns502()
  await testUnsubscribeGhlFailureReturns502()
  await testUnsubscribeInvalidCsrfBlocksBeforeGhl()
  console.log('critical regression tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
