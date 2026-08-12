const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

const noopLogger = new Proxy(
  { EVENT_TYPES: {} },
  {
    get(target, prop) {
      if (prop in target) return target[prop]
      return () => {}
    },
  }
)

const mocks = new Map()

function mockModule(requestSuffix, exports) {
  mocks.set(path.normalize(requestSuffix), exports)
}

function installMocks({ ghlShouldFail = false } = {}) {
  mocks.clear()

  mockModule('stripe', () => ({
    prices: {
      retrieve: async () => ({ unit_amount: 4999, currency: 'usd' }),
    },
    checkout: {
      sessions: {
        create: async () => ({ id: 'cs_test', url: 'https://checkout.example/session' }),
      },
    },
    paymentIntents: {
      create: async () => ({
        id: 'pi_test',
        client_secret: 'pi_test_secret',
      }),
      retrieve: async () => ({ id: 'pi_test', metadata: {} }),
      update: async () => ({
        id: 'pi_test',
        client_secret: 'pi_test_secret',
      }),
    },
    tax: {
      calculations: {
        create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
      },
    },
  }))

  mockModule('utils/rate-limiter', {
    checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
  })
  mockModule('utils/security-logger', noopLogger)
  mockModule('utils/shipping-calculator.cjs', {
    calculateShipping: async () => ({ cost: 15 }),
    parseProducts: (products) => products,
  })
  mockModule('utils/input-sanitizer', {
    sanitizeFormData: (data) => ({ ...data }),
  })
  mockModule('utils/cors-config', {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
  })
  mockModule('utils/request-fingerprint', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  mockModule('utils/ip-reputation', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  mockModule('utils/behavioral-analysis', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  mockModule('utils/email-domain-validator', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  mockModule('utils/blobs-store', {
    initBlobsStores: () => ({ initialized: true }),
    getUnsubscribeStore: () => ({ set: async () => {} }),
  })
  mockModule('utils/csrf-validator', {
    validateCSRFToken: async () => ({ valid: true }),
  })
  mockModule('utils/ghl-client', {
    submitForm: async () => {
      if (ghlShouldFail) {
        throw new Error('GHL unavailable')
      }
      return { contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] }
    },
  })

  Module._load = function patchedLoad(request, parent, isMain) {
    if (mocks.has(request)) {
      return mocks.get(request)
    }

    const normalized = path.normalize(request)
    for (const [suffix, exports] of mocks.entries()) {
      if (normalized.endsWith(suffix)) {
        return exports
      }
    }

    return originalLoad.call(this, request, parent, isMain)
  }
}

function clearFunctionModule(relativePath) {
  delete require.cache[require.resolve(path.join(functionsDir, relativePath))]
}

function loadHandler(relativePath) {
  clearFunctionModule(relativePath)
  return require(path.join(functionsDir, relativePath)).handler
}

function postEvent(body, extraHeaders = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/test',
    headers: {
      'user-agent': 'Mozilla/5.0 regression-test',
      origin: 'https://www.acdrainwiz.com',
      'content-type': 'application/x-www-form-urlencoded',
      ...extraHeaders,
    },
    body,
  }
}

async function testPurchasingDisabled(functionFile, body) {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  installMocks()

  const handler = loadHandler(functionFile)
  const response = await handler(postEvent(body, { 'content-type': 'application/json' }), {})
  assert.strictEqual(response.statusCode, 503, `${functionFile} must default-close purchasing`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function testMiniUsesMsrpForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_msrp'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_wrong_tier'
  installMocks()

  const handler = loadHandler('get-price-id.js')
  const response = await handler(
    postEvent(
      JSON.stringify({
        product: 'mini',
        quantity: 600,
        role: 'hvac_pro',
      }),
      { 'content-type': 'application/json' }
    ),
    {}
  )

  assert.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.body)
  assert.strictEqual(payload.priceId, 'price_mini_msrp')
  assert.strictEqual(payload.tier, 'msrp')
  assert.strictEqual(payload.quantity, 600)
}

async function testContactFormGhlFailureReturns502() {
  delete process.env.RECAPTCHA_SECRET_KEY
  installMocks({ ghlShouldFail: true })

  const handler = loadHandler('validate-form-submission.js')
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '5551234567',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(postEvent(body), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function testUnsubscribeGhlFailureReturns502() {
  delete process.env.RECAPTCHA_SECRET_KEY
  installMocks({ ghlShouldFail: true })

  const handler = loadHandler('validate-unsubscribe.js')
  const body = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    feedback: 'No longer needed.',
    'csrf-token': 'csrf-test-token',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(postEvent(body), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function run() {
  await testPurchasingDisabled('get-price-id.js', JSON.stringify({ product: 'mini', quantity: 1 }))
  await testPurchasingDisabled(
    'create-checkout.js',
    JSON.stringify({ priceId: 'price_test', quantity: 1, product: 'mini' })
  )
  await testPurchasingDisabled(
    'create-payment-intent.js',
    JSON.stringify({ priceId: 'price_test', quantity: 1, product: 'mini' })
  )
  await testPurchasingDisabled(
    'update-payment-intent.js',
    JSON.stringify({
      paymentIntentId: 'pi_test',
      priceId: 'price_test',
      quantity: 1,
      product: 'mini',
      shippingAddress: {},
    })
  )
  await testMiniUsesMsrpForContractors()
  await testContactFormGhlFailureReturns502()
  await testUnsubscribeGhlFailureReturns502()
}

run()
  .then(() => {
    Module._load = originalLoad
    console.log('Critical regression tests passed')
  })
  .catch((error) => {
    Module._load = originalLoad
    console.error(error)
    process.exitCode = 1
  })
