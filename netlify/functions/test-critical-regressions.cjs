const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const functionsDir = __dirname

function loadFunction(relativePath, mocks = {}) {
  const filename = path.join(functionsDir, relativePath)
  const code = fs.readFileSync(filename, 'utf8')
  const module = { exports: {} }
  const dirname = path.dirname(filename)

  function localRequire(request) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }

    if (request.startsWith('./') || request.startsWith('../')) {
      const resolved = require.resolve(path.join(dirname, request))
      if (Object.prototype.hasOwnProperty.call(mocks, resolved)) {
        return mocks[resolved]
      }
      return require(resolved)
    }

    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return require(request)
  }

  const sandbox = {
    Buffer,
    URLSearchParams,
    console,
    exports: module.exports,
    module,
    process,
    require: localRequire,
    setTimeout,
    clearTimeout,
  }

  vm.runInNewContext(code, sandbox, { filename })
  return module.exports
}

function withEnv(env, fn) {
  const previous = {}
  for (const key of Object.keys(env)) {
    previous[key] = process.env[key]
    if (env[key] === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = env[key]
    }
  }

  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const key of Object.keys(env)) {
        if (previous[key] === undefined) {
          delete process.env[key]
        } else {
          process.env[key] = previous[key]
        }
      }
    })
}

const allowedRateLimit = {
  checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99 }),
  getRateLimitHeaders: () => ({}),
  getClientIP: () => '203.0.113.10',
}

const noopSecurityLogger = {
  logAPIAccess: () => {},
  logRateLimit: () => {},
  logFormSubmission: () => {},
  logBotDetected: () => {},
  logRecaptcha: () => {},
  logInjectionAttempt: () => {},
  EVENT_TYPES: {},
}

function paymentMocks(stripeRecorder = {}) {
  return {
    stripe: () => ({
      prices: {
        retrieve: async (priceId) => {
          stripeRecorder.priceId = priceId
          return { unit_amount: 4999, currency: 'usd' }
        },
      },
      checkout: {
        sessions: {
          create: async () => ({ id: 'cs_test_123', url: 'https://checkout.test/session' }),
        },
      },
      paymentIntents: {
        retrieve: async () => ({ id: 'pi_test_123', metadata: {}, client_secret: 'secret' }),
        create: async () => ({ id: 'pi_test_123', client_secret: 'secret' }),
        update: async () => ({ id: 'pi_test_123', client_secret: 'secret' }),
      },
      tax: {
        calculations: {
          create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
        },
      },
    }),
    './utils/rate-limiter': allowedRateLimit,
    './utils/security-logger': noopSecurityLogger,
    './utils/shipping-calculator.cjs': {
      calculateShipping: async () => ({ cost: 0 }),
      parseProducts: () => ({}),
    },
  }
}

function formMocks() {
  return {
    './utils/rate-limiter': allowedRateLimit,
    './utils/input-sanitizer': { sanitizeFormData: (data) => data },
    './utils/cors-config': { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) },
    './utils/security-logger': noopSecurityLogger,
    './utils/request-fingerprint': { validateRequestFingerprint: () => ({ isBot: false }) },
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
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('GHL unavailable')
      },
    },
  }
}

async function assertPurchasingDisabled(functionName, body) {
  const { handler } = loadFunction(functionName, paymentMocks())
  const response = await withEnv(
    {
      PURCHASING_ENABLED: undefined,
      VITE_PURCHASING_ENABLED: undefined,
      STRIPE_PRICE_MINI_HOMEOWNER: 'price_mini_homeowner',
    },
    () => handler({
      httpMethod: 'POST',
      headers: { 'user-agent': 'test' },
      body: JSON.stringify(body),
    }, {})
  )

  assert.strictEqual(response.statusCode, 503, `${functionName} should default closed when purchasing is disabled`)
}

async function run() {
  await assertPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1 })
  await assertPurchasingDisabled('create-checkout.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    isGuest: true,
    shippingAddress: { city: 'Boise', state: 'ID', country: 'US' },
  })
  await assertPurchasingDisabled('create-payment-intent.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {
      line1: '1 Main St',
      city: 'Boise',
      state: 'ID',
      zip: '83702',
      country: 'US',
      email: 'buyer@example.com',
    },
  })
  await assertPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_test_123',
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {
      line1: '1 Main St',
      city: 'Boise',
      state: 'ID',
      zip: '83702',
      country: 'US',
      email: 'buyer@example.com',
    },
  })

  const stripeRecorder = {}
  const miniResponse = await withEnv(
    {
      PURCHASING_ENABLED: 'true',
      VITE_PURCHASING_ENABLED: undefined,
      STRIPE_PRICE_MINI_HOMEOWNER: 'price_mini_homeowner',
      STRIPE_PRICE_MINI_HVAC_T1: 'price_wrong_contractor',
    },
    () => {
      const { handler: getPriceId } = loadFunction('get-price-id.js', paymentMocks(stripeRecorder))
      return getPriceId({
        httpMethod: 'POST',
        headers: { 'user-agent': 'test' },
        body: JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }),
      }, {})
    }
  )
  assert.strictEqual(miniResponse.statusCode, 200)
  assert.strictEqual(stripeRecorder.priceId, 'price_mini_homeowner')
  assert.strictEqual(JSON.parse(miniResponse.body).tier, 'msrp')

  const cappedSensorResponse = await withEnv(
    {
      PURCHASING_ENABLED: 'true',
      STRIPE_PRICE_SENSOR_HVAC_T3: 'price_sensor_hvac_t3',
    },
    () => {
      const { handler: getPriceId } = loadFunction('get-price-id.js', paymentMocks())
      return getPriceId({
        httpMethod: 'POST',
        headers: { 'user-agent': 'test' },
        body: JSON.stringify({ product: 'sensor', quantity: 600, role: 'hvac_pro' }),
      }, {})
    }
  )
  assert.strictEqual(cappedSensorResponse.statusCode, 400)
  assert.strictEqual(JSON.parse(cappedSensorResponse.body).requiresContact, true)

  const { handler: validateForm } = loadFunction('validate-form-submission.js', formMocks())
  const formResponse = await withEnv(
    {
      RECAPTCHA_SECRET_KEY: undefined,
      COMPLIMENTARY_MINI_ACCESS_TOKEN: 'server-token',
      VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN: undefined,
    },
    () => validateForm({
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-form-submission',
      headers: { origin: 'https://www.acdrainwiz.com', 'user-agent': 'Mozilla/5.0' },
      body: new URLSearchParams({
        'form-name': 'contact-general',
        'form-type': 'contact-general',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        message: 'Please contact me.',
        consent: 'yes',
        'form-load-time': String(Date.now() - 5000),
      }).toString(),
    }, {})
  )
  assert.strictEqual(formResponse.statusCode, 502)

  const tokenOnlyFormResponse = await withEnv(
    {
      RECAPTCHA_SECRET_KEY: undefined,
      COMPLIMENTARY_MINI_ACCESS_TOKEN: 'server-token',
      VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN: undefined,
    },
    () => validateForm({
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-form-submission',
      headers: { origin: 'https://www.acdrainwiz.com', 'user-agent': 'Mozilla/5.0' },
      body: new URLSearchParams({
        'form-name': 'complimentary-mini-request',
        'form-type': 'complimentary-mini-request',
        access: 'server-token',
        firstName: 'Grace',
        lastName: 'Hopper',
        email: 'grace@example.com',
        phone: '555-555-5555',
        contactType: 'Mechanical Inspector',
        street: '1 Main St',
        city: 'Boise',
        state: 'ID',
        zip: '83702',
        consent: 'yes',
        'form-load-time': String(Date.now() - 5000),
      }).toString(),
    }, {})
  )
  assert.strictEqual(tokenOnlyFormResponse.statusCode, 502)

  const { handler: validateUnsubscribe } = loadFunction('validate-unsubscribe.js', formMocks())
  const unsubscribeResponse = await withEnv(
    { RECAPTCHA_SECRET_KEY: undefined },
    () => validateUnsubscribe({
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-unsubscribe',
      headers: { origin: 'https://www.acdrainwiz.com', 'user-agent': 'Mozilla/5.0' },
      body: new URLSearchParams({
        email: 'subscriber@example.com',
        reason: 'not-relevant',
        'csrf-token': 'valid-token',
        'form-load-time': String(Date.now() - 5000),
      }).toString(),
    }, {})
  )
  assert.strictEqual(unsubscribeResponse.statusCode, 502)

  console.log('critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
