const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

let stripeRetrieveCalls = []
let ghlShouldFail = false

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_sensor_homeowner: 6999,
  price_bundle_homeowner: 17999,
  price_mini_hvac_t1: 7167,
  price_mini_hvac_t2: 6500,
  price_mini_hvac_t3: 5800,
  price_sensor_hvac_t1: 5017,
  price_sensor_hvac_t2: 4550,
  price_sensor_hvac_t3: 4060,
  price_bundle_hvac_t1: 12900,
  price_bundle_hvac_t2: 11700,
  price_bundle_hvac_t3: 10400,
  price_mini_pm_t1: 6450,
  price_mini_pm_t2: 5850,
  price_mini_pm_t3: 5220,
  price_sensor_pm_t1: 4515,
  price_sensor_pm_t2: 4095,
  price_sensor_pm_t3: 3654,
  price_bundle_pm_t1: 11610,
  price_bundle_pm_t2: 10530,
  price_bundle_pm_t3: 9360,
}

function installStubs() {
  Module._load = function stubbedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => {
            stripeRetrieveCalls.push(priceId)
            if (!priceAmounts[priceId]) {
              const error = new Error(`No such price: ${priceId}`)
              error.type = 'StripeInvalidRequestError'
              error.code = 'resource_missing'
              throw error
            }
            return { id: priceId, unit_amount: priceAmounts[priceId], currency: 'usd' }
          },
        },
      })
    }

    if (request === '@netlify/blobs') {
      return {
        getStore: () => ({
          get: async () => null,
          setJSON: async () => {},
          set: async () => {},
        }),
      }
    }

    if (request.endsWith('/utils/rate-limiter') || request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({
          allowed: true,
          remaining: 99,
          limit: 100,
          resetTime: Date.now() + 60000,
          retryAfter: 0,
        }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '203.0.113.10',
      }
    }

    if (request.endsWith('/utils/security-logger') || request === './utils/security-logger') {
      const noop = () => {}
      return {
        logAPIAccess: noop,
        logRateLimit: noop,
        logFormSubmission: noop,
        logBotDetected: noop,
        logRecaptcha: noop,
        logInjectionAttempt: noop,
        EVENT_TYPES: {},
      }
    }

    if (request.endsWith('/utils/cors-config') || request === './utils/cors-config') {
      return { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }
    }

    if (request.endsWith('/utils/request-fingerprint') || request === './utils/request-fingerprint') {
      return { validateRequestFingerprint: () => ({ isBot: false }) }
    }

    if (request.endsWith('/utils/ip-reputation') || request === './utils/ip-reputation') {
      return {
        validateIP: async () => ({ allowed: true }),
        addToBlacklist: async () => {},
      }
    }

    if (request.endsWith('/utils/behavioral-analysis') || request === './utils/behavioral-analysis') {
      return { validateSubmissionBehavior: async () => ({ allowed: true }) }
    }

    if (request.endsWith('/utils/email-domain-validator') || request === './utils/email-domain-validator') {
      return { validateEmailDomain: async () => ({ valid: true }) }
    }

    if (request.endsWith('/utils/blobs-store') || request === './utils/blobs-store') {
      return {
        initBlobsStores: () => ({ initialized: true }),
        getUnsubscribeStore: () => ({
          set: async () => {},
        }),
      }
    }

    if (request.endsWith('/utils/ghl-client') || request === './utils/ghl-client') {
      return {
        submitForm: async () => {
          if (ghlShouldFail) {
            const error = new Error('simulated GHL outage')
            error.status = 503
            throw error
          }
          return { contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] }
        },
      }
    }

    return originalLoad.call(this, request, parent, isMain)
  }
}

function loadFunction(file) {
  const fullPath = path.join(functionsDir, file)
  delete require.cache[require.resolve(fullPath)]
  return require(fullPath)
}

function postEvent(body, overrides = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      'content-type': 'application/x-www-form-urlencoded',
      ...overrides.headers,
    },
    body: new URLSearchParams(body).toString(),
    ...overrides,
  }
}

function jsonPostEvent(body, overrides = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/get-price-id',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/cart',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      'content-type': 'application/json',
      ...overrides.headers,
    },
    body: JSON.stringify(body),
    ...overrides,
  }
}

async function expectPurchasingDisabled(file, body) {
  stripeRetrieveCalls = []
  const { handler } = loadFunction(file)
  const response = await handler(jsonPostEvent(body, { path: `/.netlify/functions/${file.replace(/\.js$/, '')}` }), {})
  assert.strictEqual(response.statusCode, 503, `${file} should be disabled when purchasing is off`)
  assert.strictEqual(stripeRetrieveCalls.length, 0, `${file} should not call Stripe when purchasing is off`)
}

async function run() {
  installStubs()

  Object.assign(process.env, {
    STRIPE_SECRET_KEY: 'sk_test_stub',
    STRIPE_PRICE_MINI_HOMEOWNER: 'price_mini_homeowner',
    STRIPE_PRICE_SENSOR_HOMEOWNER: 'price_sensor_homeowner',
    STRIPE_PRICE_BUNDLE_HOMEOWNER: 'price_bundle_homeowner',
    STRIPE_PRICE_MINI_HVAC_T1: 'price_mini_hvac_t1',
    STRIPE_PRICE_MINI_HVAC_T2: 'price_mini_hvac_t2',
    STRIPE_PRICE_MINI_HVAC_T3: 'price_mini_hvac_t3',
    STRIPE_PRICE_SENSOR_HVAC_T1: 'price_sensor_hvac_t1',
    STRIPE_PRICE_SENSOR_HVAC_T2: 'price_sensor_hvac_t2',
    STRIPE_PRICE_SENSOR_HVAC_T3: 'price_sensor_hvac_t3',
    STRIPE_PRICE_BUNDLE_HVAC_T1: 'price_bundle_hvac_t1',
    STRIPE_PRICE_BUNDLE_HVAC_T2: 'price_bundle_hvac_t2',
    STRIPE_PRICE_BUNDLE_HVAC_T3: 'price_bundle_hvac_t3',
    STRIPE_PRICE_MINI_PM_T1: 'price_mini_pm_t1',
    STRIPE_PRICE_MINI_PM_T2: 'price_mini_pm_t2',
    STRIPE_PRICE_MINI_PM_T3: 'price_mini_pm_t3',
    STRIPE_PRICE_SENSOR_PM_T1: 'price_sensor_pm_t1',
    STRIPE_PRICE_SENSOR_PM_T2: 'price_sensor_pm_t2',
    STRIPE_PRICE_SENSOR_PM_T3: 'price_sensor_pm_t3',
    STRIPE_PRICE_BUNDLE_PM_T1: 'price_bundle_pm_t1',
    STRIPE_PRICE_BUNDLE_PM_T2: 'price_bundle_pm_t2',
    STRIPE_PRICE_BUNDLE_PM_T3: 'price_bundle_pm_t3',
  })

  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  await expectPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' })
  await expectPurchasingDisabled('create-checkout.js', {
    product: 'mini',
    quantity: 1,
    priceId: 'price_mini_homeowner',
    isGuest: true,
    shippingAddress: { city: 'Boise', state: 'ID', country: 'US' },
  })
  await expectPurchasingDisabled('create-payment-intent.js', {
    product: 'mini',
    quantity: 1,
    priceId: 'price_mini_homeowner',
    shippingAddress: {
      name: 'Test User',
      line1: '1 Main St',
      city: 'Boise',
      state: 'ID',
      zip: '83702',
      country: 'US',
      email: 'test@example.com',
    },
  })
  await expectPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_123',
    product: 'mini',
    quantity: 1,
    priceId: 'price_mini_homeowner',
    shippingAddress: {
      name: 'Test User',
      line1: '1 Main St',
      city: 'Boise',
      state: 'ID',
      zip: '83702',
      country: 'US',
      email: 'test@example.com',
    },
  })

  process.env.PURCHASING_ENABLED = 'true'
  stripeRetrieveCalls = []
  const { handler: getPriceId } = loadFunction('get-price-id.js')

  const miniResponse = await getPriceId(jsonPostEvent({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }, { path: '/.netlify/functions/get-price-id' }), {})
  assert.strictEqual(miniResponse.statusCode, 200, miniResponse.body)
  const miniBody = JSON.parse(miniResponse.body)
  assert.strictEqual(miniBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(miniBody.tier, 'msrp')
  assert.strictEqual(miniBody.unitPrice, 49.99)

  const sensorTierResponse = await getPriceId(jsonPostEvent({
    product: 'sensor',
    quantity: 25,
    role: 'hvac_pro',
  }, { path: '/.netlify/functions/get-price-id' }), {})
  assert.strictEqual(sensorTierResponse.statusCode, 200, sensorTierResponse.body)
  const sensorTierBody = JSON.parse(sensorTierResponse.body)
  assert.strictEqual(sensorTierBody.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(sensorTierBody.tier, 'tier_2')

  const sensorCapResponse = await getPriceId(jsonPostEvent({
    product: 'sensor',
    quantity: 600,
    role: 'hvac_pro',
  }, { path: '/.netlify/functions/get-price-id' }), {})
  assert.strictEqual(sensorCapResponse.statusCode, 400, sensorCapResponse.body)
  assert.strictEqual(JSON.parse(sensorCapResponse.body).requiresContact, true)

  ghlShouldFail = true
  const { handler: validateForm } = loadFunction('validate-form-submission.js')
  const formFailure = await validateForm(postEvent({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
  }), {})
  assert.strictEqual(formFailure.statusCode, 502, formFailure.body)
  assert.strictEqual(JSON.parse(formFailure.body).success, false)

  const { handler: validateUnsubscribe } = loadFunction('validate-unsubscribe.js')
  const unsubscribeFailure = await validateUnsubscribe(postEvent({
    email: 'ada@example.com',
    reason: 'too-many-emails',
  }, { path: '/.netlify/functions/validate-unsubscribe' }), {})
  assert.strictEqual(unsubscribeFailure.statusCode, 502, unsubscribeFailure.body)
  assert.strictEqual(JSON.parse(unsubscribeFailure.body).success, false)

  Module._load = originalLoad
  console.log('Critical regression tests passed')
}

run().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
