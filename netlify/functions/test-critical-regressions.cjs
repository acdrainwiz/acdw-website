const assert = require('assert')
const fs = require('fs')
const Module = require('module')
const path = require('path')

function loadHandler(filePath, mocks) {
  const mod = new Module(filePath, module)
  mod.filename = filePath
  mod.paths = Module._nodeModulePaths(path.dirname(filePath))
  mod.require = (request) => {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return require(request)
  }
  mod._compile(fs.readFileSync(filePath, 'utf8'), filePath)
  return mod.exports.handler
}

function postEvent(body, overrides = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      ...overrides.headers,
    },
    path: overrides.path || '/.netlify/functions/validate-form-submission',
    body,
  }
}

async function testMiniListPriceResolution() {
  const previousEnv = { ...process.env }
  Object.assign(process.env, {
    STRIPE_SECRET_KEY: 'sk_test_fake',
    STRIPE_PRICE_MINI_HOMEOWNER: 'price_mini_homeowner',
    STRIPE_PRICE_MINI_HVAC_T1: 'price_mini_hvac_t1',
    STRIPE_PRICE_MINI_PM_T1: 'price_mini_pm_t1',
    STRIPE_PRICE_SENSOR_HVAC_T2: 'price_sensor_hvac_t2',
  })

  const retrievedPriceIds = []
  const handler = loadHandler(path.join(__dirname, 'get-price-id.js'), {
    './utils/rate-limiter': {
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    },
    './utils/security-logger': {
      logAPIAccess: () => {},
      logRateLimit: () => {},
      EVENT_TYPES: {},
    },
    stripe: () => ({
      prices: {
        retrieve: async (priceId) => {
          retrievedPriceIds.push(priceId)
          return {
            id: priceId,
            unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 4550,
            currency: 'usd',
          }
        },
      },
    }),
  })

  try {
    const hvacMini = await handler(postEvent(JSON.stringify({
      product: 'mini',
      quantity: 600,
      role: 'hvac_pro',
    }), { path: '/.netlify/functions/get-price-id', headers: { 'content-type': 'application/json' } }), {})
    assert.strictEqual(hvacMini.statusCode, 200)
    assert.strictEqual(JSON.parse(hvacMini.body).priceId, 'price_mini_homeowner')
    assert.strictEqual(JSON.parse(hvacMini.body).tier, 'msrp')

    const pmMini = await handler(postEvent(JSON.stringify({
      product: 'mini',
      quantity: 600,
      role: 'property_manager',
    }), { path: '/.netlify/functions/get-price-id', headers: { 'content-type': 'application/json' } }), {})
    assert.strictEqual(pmMini.statusCode, 200)
    assert.strictEqual(JSON.parse(pmMini.body).priceId, 'price_mini_homeowner')

    const sensorTooLarge = await handler(postEvent(JSON.stringify({
      product: 'sensor',
      quantity: 600,
      role: 'hvac_pro',
    }), { path: '/.netlify/functions/get-price-id', headers: { 'content-type': 'application/json' } }), {})
    assert.strictEqual(sensorTooLarge.statusCode, 400)
    assert.strictEqual(JSON.parse(sensorTooLarge.body).requiresContact, true)

    const sensorTier = await handler(postEvent(JSON.stringify({
      product: 'sensor',
      quantity: 50,
      role: 'hvac_pro',
    }), { path: '/.netlify/functions/get-price-id', headers: { 'content-type': 'application/json' } }), {})
    assert.strictEqual(sensorTier.statusCode, 200)
    assert.strictEqual(JSON.parse(sensorTier.body).priceId, 'price_sensor_hvac_t2')
    assert.deepStrictEqual(retrievedPriceIds, [
      'price_mini_homeowner',
      'price_mini_homeowner',
      'price_sensor_hvac_t2',
    ])
  } finally {
    process.env = previousEnv
  }
}

async function testGhlFailureReturnsFailure() {
  const previousEnv = { ...process.env }
  delete process.env.RECAPTCHA_SECRET_KEY

  const handler = loadHandler(path.join(__dirname, 'validate-form-submission.js'), {
    './utils/rate-limiter': {
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    },
    './utils/input-sanitizer': {
      sanitizeFormData: (data) => data,
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
      initBlobsStores: () => ({ initialized: true }),
    },
    './utils/ghl-client': {
      submitForm: async () => {
        throw Object.assign(new Error('GHL outage'), { status: 503, traceId: 'trace_123' })
      },
    },
  })

  try {
    const body = new URLSearchParams({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      message: 'Please contact me about AC Drain Wiz products.',
      consent: 'yes',
    }).toString()

    const response = await handler(postEvent(body), {})
    const payload = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(payload.success, false)
    assert.match(payload.error, /delivery failed/i)
  } finally {
    process.env = previousEnv
  }
}

async function run() {
  await testMiniListPriceResolution()
  await testGhlFailureReturnsFailure()
  console.log('critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
