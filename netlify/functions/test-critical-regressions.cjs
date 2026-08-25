const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

function installMocks({ ghlSubmitForm, validateCSRFToken } = {}) {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => ({
            id: priceId,
            unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999,
            currency: 'usd',
          }),
        },
        checkout: {
          sessions: {
            create: async () => ({ id: 'cs_test', url: 'https://checkout.example/test' }),
          },
        },
        paymentIntents: {
          retrieve: async (id) => ({ id, metadata: {} }),
          create: async () => ({ id: 'pi_test', client_secret: 'pi_test_secret' }),
          update: async (id) => ({ id, client_secret: `${id}_secret` }),
        },
        tax: {
          calculations: {
            create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
          },
        },
      })
    }

    if (request.endsWith('/utils/rate-limiter') || request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '127.0.0.1',
      }
    }

    if (request.endsWith('/utils/security-logger') || request === './utils/security-logger') {
      return {
        logAPIAccess: () => {},
        logRateLimit: () => {},
        logFormSubmission: () => {},
        logBotDetected: () => {},
        logRecaptcha: () => {},
        logInjectionAttempt: () => {},
        EVENT_TYPES: {},
      }
    }

    if (request.endsWith('/utils/shipping-calculator.cjs') || request === './utils/shipping-calculator.cjs') {
      return {
        calculateShipping: async () => ({ cost: 15 }),
        parseProducts: () => ({}),
      }
    }

    if (request.endsWith('/utils/input-sanitizer') || request === './utils/input-sanitizer') {
      return {
        sanitizeFormData: (data) => ({ ...data }),
      }
    }

    if (request.endsWith('/utils/cors-config') || request === './utils/cors-config') {
      return {
        getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
      }
    }

    if (request.endsWith('/utils/request-fingerprint') || request === './utils/request-fingerprint') {
      return {
        validateRequestFingerprint: () => ({ isBot: false }),
      }
    }

    if (request.endsWith('/utils/ip-reputation') || request === './utils/ip-reputation') {
      return {
        validateIP: async () => ({ allowed: true }),
        addToBlacklist: async () => {},
      }
    }

    if (request.endsWith('/utils/behavioral-analysis') || request === './utils/behavioral-analysis') {
      return {
        validateSubmissionBehavior: async () => ({ allowed: true }),
      }
    }

    if (request.endsWith('/utils/email-domain-validator') || request === './utils/email-domain-validator') {
      return {
        validateEmailDomain: async () => ({ valid: true }),
      }
    }

    if (request.endsWith('/utils/blobs-store') || request === './utils/blobs-store') {
      return {
        initBlobsStores: () => ({ initialized: true }),
        getUnsubscribeStore: () => ({ set: async () => {} }),
      }
    }

    if (request.endsWith('/utils/ghl-client') || request === './utils/ghl-client') {
      return {
        submitForm: ghlSubmitForm || (async () => ({ contactId: 'contact_1', isNew: false, traceId: 'trace_1', warnings: [] })),
      }
    }

    if (request.endsWith('/utils/csrf-validator') || request === './utils/csrf-validator') {
      return {
        validateCSRFToken: validateCSRFToken || (async () => ({ valid: true })),
      }
    }

    return originalLoad.apply(this, arguments)
  }
}

function resetFunctionModule(modulePath) {
  delete require.cache[require.resolve(modulePath)]
  return require(modulePath)
}

function jsonEvent(body, overrides = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0',
      origin: 'https://www.acdrainwiz.com',
    },
    body: JSON.stringify(body),
    path: '/.netlify/functions/test',
    ...overrides,
  }
}

function formEvent(params, overrides = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0',
      origin: 'https://www.acdrainwiz.com',
    },
    body: new URLSearchParams(params).toString(),
    path: '/.netlify/functions/validate-form-submission',
    ...overrides,
  }
}

async function withEnv(env, fn) {
  const previous = {}
  for (const key of Object.keys(env)) {
    previous[key] = process.env[key]
    if (env[key] === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = env[key]
    }
  }

  try {
    await fn()
  } finally {
    for (const key of Object.keys(env)) {
      if (previous[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = previous[key]
      }
    }
  }
}

async function testPurchasingDisabled() {
  installMocks()
  await withEnv(
    {
      PURCHASING_ENABLED: undefined,
      VITE_PURCHASING_ENABLED: undefined,
      STRIPE_SECRET_KEY: 'sk_test_mock',
    },
    async () => {
      const functionNames = ['get-price-id', 'create-checkout', 'create-payment-intent', 'update-payment-intent']
      for (const name of functionNames) {
        const { handler } = resetFunctionModule(`./${name}.js`)
        const response = await handler(jsonEvent({
          priceId: 'price_mini_homeowner',
          quantity: 1,
          product: 'mini',
          paymentIntentId: 'pi_test',
          shippingAddress: {
            name: 'Test Customer',
            email: 'test@example.com',
            line1: '1 Main St',
            city: 'Boca Raton',
            state: 'FL',
            zip: '33486',
            country: 'US',
          },
        }), {})
        assert.strictEqual(response.statusCode, 503, `${name} should fail closed while purchasing is disabled`)
      }
    }
  )
}

async function testMiniUsesListPriceForContractors() {
  installMocks()
  await withEnv(
    {
      PURCHASING_ENABLED: 'true',
      STRIPE_SECRET_KEY: 'sk_test_mock',
      STRIPE_PRICE_MINI_HOMEOWNER: 'price_mini_homeowner',
    },
    async () => {
      const { handler } = resetFunctionModule('./get-price-id.js')
      const response = await handler(jsonEvent({
        product: 'mini',
        quantity: 600,
        role: 'hvac_pro',
      }), {})
      const body = JSON.parse(response.body)
      assert.strictEqual(response.statusCode, 200)
      assert.strictEqual(body.priceId, 'price_mini_homeowner')
      assert.strictEqual(body.tier, 'msrp')
      assert.strictEqual(body.unitPrice, 49.99)
    }
  )
}

async function testSensorStillRequiresContactAboveCap() {
  installMocks()
  await withEnv(
    {
      PURCHASING_ENABLED: 'true',
      STRIPE_SECRET_KEY: 'sk_test_mock',
      STRIPE_PRICE_SENSOR_HVAC_T3: 'price_sensor_hvac_t3',
    },
    async () => {
      const { handler } = resetFunctionModule('./get-price-id.js')
      const response = await handler(jsonEvent({
        product: 'sensor',
        quantity: 501,
        role: 'hvac_pro',
      }), {})
      const body = JSON.parse(response.body)
      assert.strictEqual(response.statusCode, 400)
      assert.strictEqual(body.requiresContact, true)
    }
  )
}

async function testContactFormGhlFailureReturns502() {
  installMocks({
    ghlSubmitForm: async () => {
      throw Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_fail' })
    },
  })
  const { handler } = resetFunctionModule('./validate-form-submission.js')
  const response = await handler(formEvent({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    message: 'I need help with my condensate drain line.',
    consent: 'yes',
  }), {})
  const body = JSON.parse(response.body)
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(body.success, false)
}

async function testUnsubscribeGhlFailureReturns502() {
  installMocks({
    ghlSubmitForm: async () => {
      throw Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_fail' })
    },
    validateCSRFToken: async () => ({ valid: true }),
  })
  const { handler } = resetFunctionModule('./validate-unsubscribe.js')
  const response = await handler(formEvent({
    email: 'test@example.com',
    reason: 'not-relevant',
    'csrf-token': 'csrf_test',
  }, { path: '/.netlify/functions/validate-unsubscribe' }), {})
  const body = JSON.parse(response.body)
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(body.success, false)
}

async function testUnsubscribeRejectsInvalidCsrf() {
  installMocks({
    validateCSRFToken: async () => ({
      valid: false,
      reason: 'Invalid CSRF token',
      details: { message: 'Security token is invalid or expired' },
    }),
  })
  const { handler } = resetFunctionModule('./validate-unsubscribe.js')
  const response = await handler(formEvent({
    email: 'test@example.com',
    reason: 'not-relevant',
    'csrf-token': 'bad_csrf',
  }, { path: '/.netlify/functions/validate-unsubscribe' }), {})
  assert.strictEqual(response.statusCode, 400)
}

async function run() {
  try {
    await testPurchasingDisabled()
    await testMiniUsesListPriceForContractors()
    await testSensorStillRequiresContactAboveCap()
    await testContactFormGhlFailureReturns502()
    await testUnsubscribeGhlFailureReturns502()
    await testUnsubscribeRejectsInvalidCsrf()
    console.log('critical regression tests passed')
  } finally {
    Module._load = originalLoad
  }
}

run().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
