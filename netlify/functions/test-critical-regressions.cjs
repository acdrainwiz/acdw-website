const assert = require('assert')
const Module = require('module')
const path = require('path')

const originalLoad = Module._load

function clearFunctionModules() {
  for (const cacheKey of Object.keys(require.cache)) {
    if (cacheKey.includes(`${path.sep}netlify${path.sep}functions${path.sep}`)) {
      delete require.cache[cacheKey]
    }
  }
}

function withModuleStubs(stubs, fn) {
  Module._load = function patchedLoad(request, parent, isMain) {
    for (const [matcher, value] of stubs) {
      const matches = typeof matcher === 'string'
        ? request === matcher || request.endsWith(matcher)
        : matcher.test(request)
      if (matches) {
        return typeof value === 'function' && value.__factory ? value() : value
      }
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

function factory(fn) {
  fn.__factory = true
  return fn
}

function paymentEvent(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0',
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify(body),
  }
}

const stripeStub = (calls = []) => factory(() => () => ({
  prices: {
    retrieve: async (priceId) => {
      calls.push(priceId)
      return {
        id: priceId,
        unit_amount: priceId === 'price_mini_msrp' ? 4999 : 6999,
        currency: 'usd',
      }
    },
  },
  paymentIntents: {
    retrieve: async () => ({ id: 'pi_test', metadata: {} }),
    create: async () => ({ id: 'pi_test', client_secret: 'secret' }),
    update: async () => ({ id: 'pi_test', client_secret: 'secret' }),
  },
  checkout: {
    sessions: {
      create: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test' }),
    },
  },
  tax: {
    calculations: {
      create: async () => ({ id: 'tax_test', tax_amount_exclusive: 0, tax_breakdown: [] }),
    },
  },
}))

const netlifyBlobsStub = {
  getStore: () => {
    throw new Error('Blobs unavailable in tests')
  },
}

async function testPurchasingKillSwitch() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  process.env.STRIPE_SECRET_KEY = 'sk_test_123'

  const stripeCalls = []
  await withModuleStubs([
    ['stripe', stripeStub(stripeCalls)],
    ['@netlify/blobs', netlifyBlobsStub],
  ], async () => {
    const cases = [
      ['get-price-id.js', { product: 'mini', quantity: 1 }],
      ['create-checkout.js', {
        product: 'mini',
        quantity: 1,
        priceId: 'price_mini_msrp',
        isGuest: true,
        shippingAddress: { city: 'Boise', state: 'ID', country: 'US' },
      }],
      ['create-payment-intent.js', {
        product: 'mini',
        quantity: 1,
        priceId: 'price_mini_msrp',
        shippingAddress: {
          line1: '1 Main St',
          city: 'Boise',
          state: 'ID',
          zip: '83702',
          country: 'US',
          email: 'buyer@example.com',
        },
      }],
      ['update-payment-intent.js', {
        paymentIntentId: 'pi_test',
        product: 'mini',
        quantity: 1,
        priceId: 'price_mini_msrp',
        shippingAddress: {
          line1: '1 Main St',
          city: 'Boise',
          state: 'ID',
          zip: '83702',
          country: 'US',
          email: 'buyer@example.com',
        },
      }],
    ]

    for (const [file, body] of cases) {
      const { handler } = require(path.join(__dirname, file))
      const response = await handler(paymentEvent(body), {})
      assert.strictEqual(response.statusCode, 503, `${file} should close when purchasing is disabled`)
      assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
    }
  })

  assert.deepStrictEqual(stripeCalls, [], 'disabled purchasing should not call Stripe')
}

async function testMiniAlwaysUsesListPrice() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_SECRET_KEY = 'sk_test_123'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_msrp'
  process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
  process.env.STRIPE_PRICE_SENSOR_PM_T3 = 'price_sensor_pm_t3'

  const stripeCalls = []
  await withModuleStubs([
    ['stripe', stripeStub(stripeCalls)],
    ['@netlify/blobs', netlifyBlobsStub],
  ], async () => {
    const { handler } = require(path.join(__dirname, 'get-price-id.js'))
    const response = await handler(paymentEvent({
      product: 'mini',
      quantity: 600,
      role: 'property_manager',
    }), {})

    assert.strictEqual(response.statusCode, 200)
    const body = JSON.parse(response.body)
    assert.strictEqual(body.priceId, 'price_mini_msrp')
    assert.strictEqual(body.tier, 'msrp')
    assert.strictEqual(body.unitPrice, 49.99)

    const cappedSensor = await handler(paymentEvent({
      product: 'sensor',
      quantity: 501,
      role: 'property_manager',
    }), {})
    assert.strictEqual(cappedSensor.statusCode, 400)
    assert.strictEqual(JSON.parse(cappedSensor.body).requiresContact, true)
  })

  assert.deepStrictEqual(stripeCalls, ['price_mini_msrp'])
}

const formStubs = (ghlClient, csrfValidator = null) => [
  ['./utils/rate-limiter', {
    checkRateLimit: async () => ({
      allowed: true,
      remaining: 9,
      limit: 10,
      resetTime: Date.now() + 60000,
      retryAfter: 0,
    }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.20',
  }],
  ['./utils/input-sanitizer', {
    sanitizeFormData: (data) => data,
  }],
  ['./utils/cors-config', {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
  }],
  ['./utils/security-logger', {
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logRateLimit: () => {},
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
    getUnsubscribeStore: () => null,
  }],
  ['./utils/ghl-client', ghlClient],
  ...(csrfValidator ? [['./utils/csrf-validator', csrfValidator]] : []),
]

async function testGhlFormFailureReturns502() {
  await withModuleStubs(formStubs({
    submitForm: async () => {
      throw new Error('GHL unavailable')
    },
  }), async () => {
    const { handler } = require(path.join(__dirname, 'validate-form-submission.js'))
    const body = new URLSearchParams({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      message: 'Please contact me about AC Drain Wiz.',
      consent: 'yes',
      'form-load-time': String(Date.now() - 5000),
    }).toString()

    const response = await handler({
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-form-submission',
      headers: {
        origin: 'https://www.acdrainwiz.com',
        'user-agent': 'Mozilla/5.0',
        'x-forwarded-for': '203.0.113.20',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    }, {})

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(JSON.parse(response.body).success, false)
  })
}

async function testUnsubscribeGhlFailureReturns502AfterCsrfValidation() {
  await withModuleStubs(formStubs(
    {
      submitForm: async () => {
        throw new Error('GHL unavailable')
      },
    },
    {
      validateCSRFToken: async () => ({ valid: true }),
    },
  ), async () => {
    const { handler } = require(path.join(__dirname, 'validate-unsubscribe.js'))
    const body = new URLSearchParams({
      email: 'ada@example.com',
      reason: 'not-relevant',
      feedback: 'No longer needed',
      'csrf-token': 'valid-token',
      'form-load-time': String(Date.now() - 5000),
    }).toString()

    const response = await handler({
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-unsubscribe',
      headers: {
        origin: 'https://www.acdrainwiz.com',
        'user-agent': 'Mozilla/5.0',
        'x-forwarded-for': '203.0.113.20',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    }, {})

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(JSON.parse(response.body).success, false)
  })
}

async function run() {
  await testPurchasingKillSwitch()
  await testMiniAlwaysUsesListPrice()
  await testGhlFormFailureReturns502()
  await testUnsubscribeGhlFailureReturns502AfterCsrfValidation()
  console.log('Critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
