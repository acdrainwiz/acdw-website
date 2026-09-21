const assert = require('assert')
const fs = require('fs')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname

function loadHandler(fileName, mocks = {}) {
  const filePath = path.join(functionsDir, fileName)
  const code = fs.readFileSync(filePath, 'utf8')
  const mod = new Module(filePath, module)
  mod.filename = filePath
  mod.paths = Module._nodeModulePaths(path.dirname(filePath))
  mod.require = function mockedRequire(request) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return Module._load(request, mod)
  }
  mod._compile(code, filePath)
  return mod.exports
}

const noopLogger = {
  logAPIAccess() {},
  logRateLimit() {},
  logFormSubmission() {},
  logBotDetected() {},
  logRecaptcha() {},
  logInjectionAttempt() {},
  EVENT_TYPES: {},
}

const rateLimiterMock = {
  checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
  getRateLimitHeaders: () => ({}),
  getClientIP: () => '203.0.113.10',
}

function stripeMock() {
  return {
    prices: {
      retrieve: async (priceId) => ({
        id: priceId,
        unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999,
        currency: 'usd',
      }),
    },
    paymentIntents: {
      retrieve: async () => ({ id: 'pi_test' }),
    },
  }
}

function paymentMocks() {
  return {
    stripe: stripeMock,
    './utils/rate-limiter': rateLimiterMock,
    './utils/security-logger': noopLogger,
    './utils/shipping-calculator.cjs': {
      calculateShipping: async () => ({ cost: 15 }),
      parseProducts: (products) => products,
    },
  }
}

function formMocks({ ghlClient }) {
  return {
    './utils/rate-limiter': rateLimiterMock,
    './utils/input-sanitizer': { sanitizeFormData: (data) => data },
    './utils/cors-config': { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) },
    './utils/security-logger': noopLogger,
    './utils/request-fingerprint': { validateRequestFingerprint: () => ({ isBot: false }) },
    './utils/ip-reputation': {
      validateIP: async () => ({ allowed: true }),
      addToBlacklist: async () => {},
    },
    './utils/behavioral-analysis': { validateSubmissionBehavior: async () => ({ allowed: true }) },
    './utils/email-domain-validator': { validateEmailDomain: async () => ({ valid: true }) },
    './utils/blobs-store': {
      initBlobsStores: () => {},
      getUnsubscribeStore: () => ({ set: async () => {} }),
    },
    './utils/csrf-validator': { validateCSRFToken: async () => ({ valid: true }) },
    './utils/ghl-client': ghlClient,
  }
}

function post(body, headers = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 regression-test',
      'content-type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    body: body instanceof URLSearchParams ? body.toString() : JSON.stringify(body),
    path: '/contact',
  }
}

async function assertPurchasingDisabled() {
  process.env.PURCHASING_ENABLED = 'false'
  delete process.env.VITE_PURCHASING_ENABLED

  for (const fileName of [
    'get-price-id.js',
    'create-checkout.js',
    'create-payment-intent.js',
    'update-payment-intent.js',
  ]) {
    const { handler } = loadHandler(fileName, paymentMocks())
    const response = await handler(post({
      product: 'mini',
      quantity: 1,
      priceId: 'price_mini_homeowner',
      paymentIntentId: 'pi_test',
      shippingAddress: {
        name: 'Test User',
        email: 'test@example.com',
        line1: '1 Main St',
        city: 'Boise',
        state: 'ID',
        zip: '83702',
        country: 'US',
      },
    }), {})
    assert.strictEqual(response.statusCode, 503, `${fileName} must block checkout when purchasing is disabled`)
  }
}

async function assertMiniUsesMsrpForProtectedRoles() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

  const { handler } = loadHandler('get-price-id.js', paymentMocks())
  const miniResponse = await handler(post({ product: 'mini', quantity: 600, role: 'hvac_pro' }), {})
  assert.strictEqual(miniResponse.statusCode, 200)
  const miniBody = JSON.parse(miniResponse.body)
  assert.strictEqual(miniBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(miniBody.role, 'homeowner')
  assert.strictEqual(miniBody.tier, 'msrp')

  const sensorResponse = await handler(post({ product: 'sensor', quantity: 600, role: 'hvac_pro' }), {})
  assert.strictEqual(sensorResponse.statusCode, 400)
  assert.strictEqual(JSON.parse(sensorResponse.body).requiresContact, true)
}

async function assertFormGhlFailureReturns502() {
  const { handler } = loadHandler('validate-form-submission.js', formMocks({
    ghlClient: {
      submitForm: async () => {
        throw Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_123' })
      },
    },
  }))
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me.',
    consent: 'yes',
  })

  const response = await handler(post(body), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function assertUnsubscribeGhlFailureReturns502() {
  const { handler } = loadHandler('validate-unsubscribe.js', formMocks({
    ghlClient: {
      submitForm: async () => {
        throw Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_unsub' })
      },
    },
  }))
  const body = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'too-many-emails',
    'csrf-token': 'valid-token',
  })

  const event = post(body, { referer: 'https://www.acdrainwiz.com/unsubscribe' })
  event.path = '/unsubscribe'
  const response = await handler(event, {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function run() {
  await assertPurchasingDisabled()
  await assertMiniUsesMsrpForProtectedRoles()
  await assertFormGhlFailureReturns502()
  await assertUnsubscribeGhlFailureReturns502()
  console.log('Critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
