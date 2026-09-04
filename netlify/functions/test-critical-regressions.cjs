const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

function event({ body = {}, headers = {}, path: requestPath = '/.netlify/functions/test' } = {}) {
  return {
    httpMethod: 'POST',
    path: requestPath,
    headers: {
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      ...headers,
    },
    body: body instanceof URLSearchParams ? body.toString() : JSON.stringify(body),
  }
}

function formEvent(fields, requestPath = '/.netlify/functions/validate-form-submission') {
  return event({
    path: requestPath,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(fields),
  })
}

function clearFunctionCache() {
  for (const cacheKey of Object.keys(require.cache)) {
    if (cacheKey.startsWith(functionsDir)) {
      delete require.cache[cacheKey]
    }
  }
}

async function withStubs(stubs, callback) {
  Module._load = function patchedLoad(request, parent, isMain) {
    const parentDir = parent?.filename ? path.dirname(parent.filename) : functionsDir
    let resolved
    try {
      resolved = require.resolve(request, { paths: [parentDir] })
    } catch {
      resolved = request
    }

    if (Object.prototype.hasOwnProperty.call(stubs, request)) {
      return stubs[request]
    }

    if (Object.prototype.hasOwnProperty.call(stubs, resolved)) {
      return stubs[resolved]
    }

    return originalLoad.apply(this, arguments)
  }

  try {
    clearFunctionCache()
    return await callback()
  } finally {
    Module._load = originalLoad
    clearFunctionCache()
  }
}

function commonHandlerStubs({ ghlSubmitForm, csrfValidation = { valid: true } } = {}) {
  const noopLogger = {
    EVENT_TYPES: {},
    logAPIAccess() {},
    logRateLimit() {},
    logFormSubmission() {},
    logBotDetected() {},
    logRecaptcha() {},
    logInjectionAttempt() {},
  }

  return {
    './utils/rate-limiter': {
      checkRateLimit: async () => ({ allowed: true, limit: 60, remaining: 59, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    },
    './utils/security-logger': noopLogger,
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
    },
    './utils/csrf-validator': {
      validateCSRFToken: async () => csrfValidation,
    },
    './utils/ghl-client': {
      submitForm: ghlSubmitForm || (async () => ({ contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] })),
    },
  }
}

async function testPurchasingApisDefaultClosed() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  let stripeTouched = false
  const stripeStub = () => ({
    prices: {
      retrieve: async () => {
        stripeTouched = true
        return { unit_amount: 4999, currency: 'usd' }
      },
    },
    checkout: {
      sessions: {
        create: async () => {
          stripeTouched = true
          return { id: 'cs_test', url: 'https://stripe.example/checkout' }
        },
      },
    },
    paymentIntents: {
      retrieve: async () => {
        stripeTouched = true
        return { id: 'pi_test', metadata: {} }
      },
      create: async () => {
        stripeTouched = true
        return { id: 'pi_test', client_secret: 'secret' }
      },
      update: async () => {
        stripeTouched = true
        return { id: 'pi_test', client_secret: 'secret' }
      },
    },
    tax: {
      calculations: {
        create: async () => {
          stripeTouched = true
          return { tax_amount_exclusive: 0, tax_breakdown: [] }
        },
      },
    },
  })

  const stubs = {
    ...commonHandlerStubs(),
    stripe: stripeStub,
    './utils/shipping-calculator.cjs': {
      calculateShipping: async () => ({ cost: 15 }),
      parseProducts: () => ({}),
    },
  }

  const endpoints = [
    ['get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' }],
    ['create-checkout.js', {
      priceId: 'price_known',
      quantity: 1,
      product: 'mini',
      isGuest: true,
      shippingAddress: { city: 'Boise', state: 'ID', country: 'US' },
    }],
    ['create-payment-intent.js', {
      priceId: 'price_known',
      quantity: 1,
      product: 'mini',
      shippingAddress: {
        name: 'Test Customer',
        line1: '1 Main St',
        city: 'Boise',
        state: 'ID',
        zip: '83702',
        country: 'US',
        email: 'test@example.com',
      },
    }],
    ['update-payment-intent.js', {
      paymentIntentId: 'pi_known',
      priceId: 'price_known',
      quantity: 1,
      product: 'mini',
      shippingAddress: {
        name: 'Test Customer',
        line1: '1 Main St',
        city: 'Boise',
        state: 'ID',
        zip: '83702',
        country: 'US',
        email: 'test@example.com',
      },
    }],
  ]

  await withStubs(stubs, async () => {
    for (const [file, body] of endpoints) {
      const { handler } = require(path.join(functionsDir, file))
      const response = await handler(event({ body }), {})
      assert.strictEqual(response.statusCode, 503, `${file} should be closed when purchasing is disabled`)
      assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
    }
  })

  assert.strictEqual(stripeTouched, false, 'disabled purchasing should return before touching Stripe')
}

async function testMiniContractorPricingUsesMsrp() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'

  let retrievedPriceId = null
  const stubs = {
    ...commonHandlerStubs(),
    stripe: () => ({
      prices: {
        retrieve: async (priceId) => {
          retrievedPriceId = priceId
          return { unit_amount: 4999, currency: 'usd' }
        },
      },
    }),
  }

  await withStubs(stubs, async () => {
    const { handler } = require(path.join(functionsDir, 'get-price-id.js'))
    const response = await handler(event({
      body: { product: 'mini', quantity: 600, role: 'hvac_pro' },
    }), {})
    const body = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(retrievedPriceId, 'price_mini_homeowner')
    assert.strictEqual(body.priceId, 'price_mini_homeowner')
    assert.strictEqual(body.tier, 'msrp')
    assert.strictEqual(body.unitPrice, 49.99)
  })
}

async function testSensorOverCapStillRequiresContact() {
  process.env.PURCHASING_ENABLED = 'true'

  const stubs = {
    ...commonHandlerStubs(),
    stripe: () => ({
      prices: {
        retrieve: async () => {
          throw new Error('Stripe should not be called for over-cap Sensor quantity')
        },
      },
    }),
  }

  await withStubs(stubs, async () => {
    const { handler } = require(path.join(functionsDir, 'get-price-id.js'))
    const response = await handler(event({
      body: { product: 'sensor', quantity: 501, role: 'hvac_pro' },
    }), {})
    const body = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(body.requiresContact, true)
  })
}

async function testFormGhlFailureReturns502() {
  const stubs = commonHandlerStubs({
    ghlSubmitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })

  await withStubs(stubs, async () => {
    const { handler } = require(path.join(functionsDir, 'validate-form-submission.js'))
    const response = await handler(formEvent({
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
  const stubs = commonHandlerStubs({
    ghlSubmitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })

  await withStubs(stubs, async () => {
    const { handler } = require(path.join(functionsDir, 'validate-unsubscribe.js'))
    const response = await handler(formEvent({
      email: 'ada@example.com',
      reason: 'not-relevant',
      'csrf-token': 'valid-token',
    }, '/.netlify/functions/validate-unsubscribe'), {})
    const body = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(body.success, false)
  })
}

async function testInvalidUnsubscribeCsrfBlocksBeforeGhl() {
  let ghlCalled = false
  const stubs = commonHandlerStubs({
    csrfValidation: {
      valid: false,
      reason: 'Security token required',
      details: { message: 'Please refresh the page and try again' },
    },
    ghlSubmitForm: async () => {
      ghlCalled = true
      return { contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] }
    },
  })

  await withStubs(stubs, async () => {
    const { handler } = require(path.join(functionsDir, 'validate-unsubscribe.js'))
    const response = await handler(formEvent({
      email: 'ada@example.com',
      reason: 'not-relevant',
      'csrf-token': 'bad-token',
    }, '/.netlify/functions/validate-unsubscribe'), {})

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(ghlCalled, false)
  })
}

async function run() {
  await testPurchasingApisDefaultClosed()
  await testMiniContractorPricingUsesMsrp()
  await testSensorOverCapStillRequiresContact()
  await testFormGhlFailureReturns502()
  await testUnsubscribeGhlFailureReturns502()
  await testInvalidUnsubscribeCsrfBlocksBeforeGhl()
  console.log('critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
