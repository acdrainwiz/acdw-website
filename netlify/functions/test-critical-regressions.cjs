const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

function clearFunctionModules() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes('/netlify/functions/')) {
      delete require.cache[key]
    }
  }
}

async function withMocks(mocks, fn) {
  Module._load = function mockedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return originalLoad.apply(this, arguments)
  }

  try {
    clearFunctionModules()
    return await fn()
  } finally {
    Module._load = originalLoad
    clearFunctionModules()
  }
}

function paymentMocks(stripeClient) {
  return {
    stripe: () => stripeClient,
    './utils/rate-limiter': {
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, reset: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '203.0.113.10',
    },
    './utils/security-logger': {
      logAPIAccess: () => {},
      logRateLimit: () => {},
      EVENT_TYPES: {},
    },
  }
}

function formMocks(overrides = {}) {
  const defaultMocks = {
    './utils/rate-limiter': {
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, reset: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '203.0.113.20',
    },
    './utils/input-sanitizer': {
      sanitizeFormData: (data) => ({ ...data }),
    },
    './utils/cors-config': {
      getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
    },
    './utils/security-logger': {
      logFormSubmission: () => {},
      logBotDetected: () => {},
      logRecaptcha: () => {},
      logRateLimit: () => {},
      logInjectionAttempt: () => {},
      EVENT_TYPES: {},
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
      initBlobsStores: () => {},
      getUnsubscribeStore: () => ({ set: async () => {} }),
    },
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({ valid: true }),
    },
    './utils/ghl-client': {
      submitForm: async () => ({ contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] }),
    },
  }

  return { ...defaultMocks, ...overrides }
}

function postEvent(body, headers = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0 regression-test',
      'content-type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    path: '/.netlify/functions/validate-form-submission',
    body: body instanceof URLSearchParams ? body.toString() : body,
  }
}

async function testPurchasingDisabledBlocksStripeFunctions() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  const stripeClient = {
    prices: {
      retrieve: async () => {
        throw new Error('Stripe should not be called when purchasing is disabled')
      },
    },
  }

  const functions = [
    ['get-price-id', { product: 'mini', quantity: 1, role: 'homeowner' }],
    ['create-checkout', { priceId: 'price_mini_homeowner', product: 'mini', quantity: 1, isGuest: true, shippingAddress: { city: 'Boise', state: 'ID', country: 'US' } }],
    ['create-payment-intent', { priceId: 'price_mini_homeowner', product: 'mini', quantity: 1, shippingAddress: { name: 'Jane Doe', email: 'jane@example.com', line1: '1 Main St', city: 'Boise', state: 'ID', zip: '83702', country: 'US' } }],
    ['update-payment-intent', { paymentIntentId: 'pi_123', priceId: 'price_mini_homeowner', product: 'mini', quantity: 1, shippingAddress: { name: 'Jane Doe', email: 'jane@example.com', line1: '1 Main St', city: 'Boise', state: 'ID', zip: '83702', country: 'US' } }],
  ]

  await withMocks(paymentMocks(stripeClient), async () => {
    for (const [name, body] of functions) {
      const { handler } = require(`./${name}.js`)
      const response = await handler({
        httpMethod: 'POST',
        headers: { 'user-agent': 'Mozilla/5.0' },
        body: JSON.stringify(body),
      }, {})
      assert.strictEqual(response.statusCode, 503, `${name} should be unavailable while purchasing is disabled`)
      assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
    }
  })
}

async function testMiniUsesListPriceForAuthenticatedRoles() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

  const retrievedPrices = []
  const stripeClient = {
    prices: {
      retrieve: async (priceId) => {
        retrievedPrices.push(priceId)
        return {
          id: priceId,
          unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 4060,
          currency: 'usd',
        }
      },
    },
  }

  await withMocks(paymentMocks(stripeClient), async () => {
    const { handler } = require('./get-price-id.js')

    const miniResponse = await handler({
      httpMethod: 'POST',
      headers: { 'user-agent': 'Mozilla/5.0' },
      body: JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }),
    }, {})
    const miniBody = JSON.parse(miniResponse.body)

    assert.strictEqual(miniResponse.statusCode, 200)
    assert.strictEqual(miniBody.priceId, 'price_mini_homeowner')
    assert.strictEqual(miniBody.tier, 'msrp')
    assert.strictEqual(miniBody.unitPrice, 49.99)
    assert.deepStrictEqual(retrievedPrices, ['price_mini_homeowner'])

    const sensorResponse = await handler({
      httpMethod: 'POST',
      headers: { 'user-agent': 'Mozilla/5.0' },
      body: JSON.stringify({ product: 'sensor', quantity: 600, role: 'hvac_pro' }),
    }, {})
    const sensorBody = JSON.parse(sensorResponse.body)

    assert.strictEqual(sensorResponse.statusCode, 400)
    assert.strictEqual(sensorBody.requiresContact, true)
  })
}

async function testGhlFormFailureReturnsBadGateway() {
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    message: 'Please contact me.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 10000),
  })

  await withMocks(formMocks({
    './utils/ghl-client': {
      submitForm: async () => {
        const err = new Error('GHL unavailable')
        err.status = 503
        throw err
      },
    },
  }), async () => {
    const { handler } = require('./validate-form-submission.js')
    const response = await handler(postEvent(body), {})
    const responseBody = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(responseBody.success, false)
  })
}

async function testUnsubscribeGhlFailureReturnsBadGateway() {
  const body = new URLSearchParams({
    email: 'jane@example.com',
    reason: 'not-relevant',
    feedback: 'No longer needed',
    'csrf-token': 'csrf_123',
  })

  await withMocks(formMocks({
    './utils/ghl-client': {
      submitForm: async () => {
        const err = new Error('GHL unavailable')
        err.status = 503
        throw err
      },
    },
  }), async () => {
    const { handler } = require('./validate-unsubscribe.js')
    const response = await handler({
      ...postEvent(body),
      path: '/.netlify/functions/validate-unsubscribe',
    }, {})
    const responseBody = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(responseBody.success, false)
  })
}

async function testUnsubscribeRejectsInvalidCsrf() {
  const body = new URLSearchParams({
    email: 'jane@example.com',
    reason: 'not-relevant',
    'csrf-token': 'bad-token',
  })

  await withMocks(formMocks({
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({
        valid: false,
        reason: 'Invalid CSRF token',
        details: { message: 'Security token is invalid or expired' },
      }),
    },
  }), async () => {
    const { handler } = require('./validate-unsubscribe.js')
    const response = await handler({
      ...postEvent(body),
      path: '/.netlify/functions/validate-unsubscribe',
    }, {})
    const responseBody = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(responseBody.error, 'Invalid CSRF token')
  })
}

async function main() {
  await testPurchasingDisabledBlocksStripeFunctions()
  await testMiniUsesListPriceForAuthenticatedRoles()
  await testGhlFormFailureReturnsBadGateway()
  await testUnsubscribeGhlFailureReturnsBadGateway()
  await testUnsubscribeRejectsInvalidCsrf()
  console.log('critical regression tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
