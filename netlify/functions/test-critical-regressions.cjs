const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

const mockState = {
  stripeRetrieveCalls: [],
  ghlCalls: [],
  ghlShouldFail: false,
  csrfValid: true,
}

function resetState() {
  mockState.stripeRetrieveCalls = []
  mockState.ghlCalls = []
  mockState.ghlShouldFail = false
  mockState.csrfValid = true
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  delete process.env.RECAPTCHA_SECRET_KEY
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'
}

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          mockState.stripeRetrieveCalls.push(priceId)
          return { id: priceId, unit_amount: priceId.includes('mini') ? 4999 : 6999, currency: 'usd' }
        },
      },
      checkout: {
        sessions: {
          create: async () => ({ id: 'cs_test', url: 'https://checkout.test/session' }),
        },
      },
      paymentIntents: {
        create: async () => ({ id: 'pi_test', client_secret: 'secret' }),
        retrieve: async () => ({ id: 'pi_test', metadata: {} }),
        update: async () => ({ id: 'pi_test', client_secret: 'secret_updated' }),
      },
      tax: {
        calculations: {
          create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => ({
        get: async () => null,
        set: async () => undefined,
        setJSON: async () => undefined,
        delete: async () => undefined,
      }),
    }
  }

  if (request === './utils/rate-limiter') {
    return {
      checkRateLimit: async () => ({
        allowed: true,
        remaining: 29,
        limit: 30,
        resetTime: Date.now() + 60000,
        retryAfter: 0,
      }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '203.0.113.10',
    }
  }

  if (request === './utils/security-logger') {
    return {
      logAPIAccess: () => undefined,
      logRateLimit: () => undefined,
      logFormSubmission: () => undefined,
      logBotDetected: () => undefined,
      logRecaptcha: () => undefined,
      logInjectionAttempt: () => undefined,
      EVENT_TYPES: {},
    }
  }

  if (request === './utils/shipping-calculator.cjs') {
    return {
      calculateShipping: async () => ({ cost: 15 }),
      parseProducts: () => ({}),
    }
  }

  if (request === './utils/input-sanitizer') {
    return { sanitizeFormData: (data) => data }
  }

  if (request === './utils/cors-config') {
    return { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }
  }

  if (request === './utils/request-fingerprint') {
    return { validateRequestFingerprint: () => ({ isBot: false }) }
  }

  if (request === './utils/ip-reputation') {
    return {
      validateIP: async () => ({ allowed: true }),
      addToBlacklist: async () => undefined,
    }
  }

  if (request === './utils/behavioral-analysis') {
    return { validateSubmissionBehavior: async () => ({ allowed: true }) }
  }

  if (request === './utils/email-domain-validator') {
    return { validateEmailDomain: async () => ({ valid: true }) }
  }

  if (request === './utils/blobs-store') {
    return {
      initBlobsStores: () => ({ initialized: true }),
      getUnsubscribeStore: () => ({ set: async () => undefined }),
    }
  }

  if (request === './utils/csrf-validator') {
    return {
      validateCSRFToken: async () => (
        mockState.csrfValid
          ? { valid: true }
          : { valid: false, reason: 'Invalid CSRF token', details: { message: 'Security token is invalid or expired' } }
      ),
    }
  }

  if (request === './utils/ghl-client') {
    return {
      submitForm: async (formType, data) => {
        mockState.ghlCalls.push({ formType, data })
        if (mockState.ghlShouldFail) {
          throw new Error('simulated GHL outage')
        }
        return { contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] }
      },
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

function clearFunctionCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes('/netlify/functions/')) {
      delete require.cache[key]
    }
  }
}

function postEvent(body, headers = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/test',
    headers: {
      'user-agent': 'Mozilla/5.0 CriticalRegressionTest',
      origin: 'https://www.acdrainwiz.com',
      ...headers,
    },
    body,
  }
}

async function testPurchasingDisabledBlocksPaymentFunctions() {
  resetState()
  clearFunctionCache()
  const functions = [
    require('./get-price-id').handler,
    require('./create-checkout').handler,
    require('./create-payment-intent').handler,
    require('./update-payment-intent').handler,
  ]

  for (const handler of functions) {
    const response = await handler(postEvent(JSON.stringify({ product: 'mini', quantity: 1, priceId: 'price_any' })), {})
    assert.strictEqual(response.statusCode, 503)
    assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
  }
  assert.deepStrictEqual(mockState.stripeRetrieveCalls, [])
}

async function testMiniUsesListPriceForContractors() {
  resetState()
  clearFunctionCache()
  process.env.PURCHASING_ENABLED = 'true'
  const { handler } = require('./get-price-id')

  const response = await handler(postEvent(JSON.stringify({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  })), {})

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.body)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.unitPrice, 49.99)
  assert.deepStrictEqual(mockState.stripeRetrieveCalls, ['price_mini_homeowner'])
}

async function testSensorOverCapStillRequiresContact() {
  resetState()
  clearFunctionCache()
  process.env.PURCHASING_ENABLED = 'true'
  const { handler } = require('./get-price-id')

  const response = await handler(postEvent(JSON.stringify({
    product: 'sensor',
    quantity: 501,
    role: 'hvac_pro',
  })), {})

  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(JSON.parse(response.body).requiresContact, true)
}

async function testContactFormGhlFailureIsNotSuccess() {
  resetState()
  clearFunctionCache()
  mockState.ghlShouldFail = true
  const { handler } = require('./validate-form-submission')
  const form = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    email: 'customer@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
  })

  const response = await handler(postEvent(form.toString(), {
    'content-type': 'application/x-www-form-urlencoded',
  }), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function testUnsubscribeGhlFailureIsNotSuccess() {
  resetState()
  clearFunctionCache()
  mockState.ghlShouldFail = true
  const { handler } = require('./validate-unsubscribe')
  const form = new URLSearchParams({
    email: 'customer@example.com',
    reason: 'not-relevant',
    'csrf-token': 'valid-token',
  })

  const response = await handler(postEvent(form.toString(), {
    'content-type': 'application/x-www-form-urlencoded',
  }), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function testInvalidUnsubscribeCsrfStopsBeforeGhl() {
  resetState()
  clearFunctionCache()
  mockState.csrfValid = false
  const { handler } = require('./validate-unsubscribe')
  const form = new URLSearchParams({
    email: 'customer@example.com',
    reason: 'not-relevant',
    'csrf-token': 'bad-token',
  })

  const response = await handler(postEvent(form.toString(), {
    'content-type': 'application/x-www-form-urlencoded',
  }), {})

  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(mockState.ghlCalls.length, 0)
}

async function testMissingUnsubscribeRecaptchaDoesNotCrash() {
  resetState()
  clearFunctionCache()
  process.env.RECAPTCHA_SECRET_KEY = 'configured-secret'
  const { handler } = require('./validate-unsubscribe')
  const form = new URLSearchParams({
    email: 'customer@example.com',
    reason: 'not-relevant',
    'csrf-token': 'valid-token',
  })

  const response = await handler(postEvent(form.toString(), {
    'content-type': 'application/x-www-form-urlencoded',
  }), {})

  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(JSON.parse(response.body).error, 'Security verification required')
}

async function run() {
  await testPurchasingDisabledBlocksPaymentFunctions()
  await testMiniUsesListPriceForContractors()
  await testSensorOverCapStillRequiresContact()
  await testContactFormGhlFailureIsNotSuccess()
  await testUnsubscribeGhlFailureIsNotSuccess()
  await testInvalidUnsubscribeCsrfStopsBeforeGhl()
  await testMissingUnsubscribeRecaptchaDoesNotCrash()
  console.log('Critical regression tests passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
