const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load
const mockState = {
  stripePriceId: 'price_mini_homeowner',
  ghlShouldThrow: false,
  csrfValid: true,
}

function loadFunction(relativePath) {
  const fullPath = path.join(functionsDir, relativePath)
  delete require.cache[require.resolve(fullPath)]
  return require(fullPath)
}

function installMocks() {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => ({
            id: priceId,
            unit_amount: priceId === mockState.stripePriceId ? 4999 : 6999,
            currency: 'usd',
          }),
        },
        checkout: { sessions: { create: async () => ({ id: 'cs_test', url: 'https://stripe.test/checkout' }) } },
        paymentIntents: {
          create: async () => ({ id: 'pi_test', client_secret: 'pi_secret' }),
          retrieve: async () => ({ id: 'pi_test', metadata: {} }),
          update: async () => ({ id: 'pi_test', client_secret: 'pi_secret_updated' }),
        },
        tax: { calculations: { create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }) } },
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
          remaining: 29,
          limit: 30,
          resetTime: Date.now() + 60000,
          retryAfter: 0,
        }),
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
        initBlobsStores: () => {},
        getUnsubscribeStore: () => null,
      }
    }

    if (request.endsWith('/utils/cors-config') || request === './utils/cors-config') {
      return { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }
    }

    if (request.endsWith('/utils/csrf-validator') || request === './utils/csrf-validator') {
      return {
        validateCSRFToken: async () => (
          mockState.csrfValid
            ? { valid: true }
            : { valid: false, reason: 'Security token required', details: { message: 'Refresh and retry' } }
        ),
      }
    }

    if (request.endsWith('/utils/shipping-calculator.cjs') || request === './utils/shipping-calculator.cjs') {
      return {
        calculateShipping: async () => ({ cost: 15 }),
        parseProducts: () => ({}),
      }
    }

    if (request.endsWith('/utils/ghl-client') || request === './utils/ghl-client') {
      return {
        submitForm: async () => {
          if (mockState.ghlShouldThrow) {
            const error = new Error('GHL unavailable')
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

function restoreMocks() {
  Module._load = originalLoad
}

function postEvent(body, headers = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
      ...headers,
    },
    body,
    path: '/test',
  }
}

async function run() {
  installMocks()
  try {
    delete process.env.PURCHASING_ENABLED
    delete process.env.VITE_PURCHASING_ENABLED
    process.env.STRIPE_PRICE_MINI_HOMEOWNER = mockState.stripePriceId
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'

    for (const functionName of ['get-price-id', 'create-checkout', 'create-payment-intent', 'update-payment-intent']) {
      const { handler } = loadFunction(`${functionName}.js`)
      const response = await handler(postEvent(JSON.stringify({
        priceId: 'price_any',
        quantity: 1,
        product: 'mini',
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
      })), {})

      assert.strictEqual(response.statusCode, 503, `${functionName} must default closed when purchasing is disabled`)
      assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
    }

    process.env.PURCHASING_ENABLED = 'true'
    {
      const { handler } = loadFunction('get-price-id.js')
      const response = await handler(postEvent(JSON.stringify({
        product: 'mini',
        quantity: 600,
        role: 'hvac_pro',
      })), {})
      const body = JSON.parse(response.body)

      assert.strictEqual(response.statusCode, 200)
      assert.strictEqual(body.priceId, mockState.stripePriceId)
      assert.strictEqual(body.tier, 'msrp')
      assert.strictEqual(body.unitPrice, 49.99)
    }

    mockState.ghlShouldThrow = true
    {
      const { handler } = loadFunction('validate-form-submission.js')
      const form = new URLSearchParams({
        'form-name': 'contact-general',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        message: 'Please contact me about AC Drain Wiz products.',
        consent: 'yes',
        'form-load-time': String(Date.now() - 5000),
      })
      const response = await handler(postEvent(form.toString()), {})
      const body = JSON.parse(response.body)

      assert.strictEqual(response.statusCode, 502)
      assert.strictEqual(body.success, false)
    }

    {
      const { handler } = loadFunction('validate-unsubscribe.js')
      const form = new URLSearchParams({
        email: 'ada@example.com',
        reason: 'too-many-emails',
        'csrf-token': 'valid-token',
        'form-load-time': String(Date.now() - 5000),
      })
      const response = await handler(postEvent(form.toString()), {})
      const body = JSON.parse(response.body)

      assert.strictEqual(response.statusCode, 502)
      assert.strictEqual(body.success, false)
    }

    mockState.ghlShouldThrow = false
    mockState.csrfValid = false
    {
      const { handler } = loadFunction('validate-unsubscribe.js')
      const form = new URLSearchParams({
        email: 'ada@example.com',
        reason: 'too-many-emails',
        'csrf-token': 'invalid-token',
        'form-load-time': String(Date.now() - 5000),
      })
      const response = await handler(postEvent(form.toString()), {})

      assert.strictEqual(response.statusCode, 400)
      assert.match(JSON.parse(response.body).error, /Security token required/)
    }

    console.log('critical regression tests passed')
  } finally {
    restoreMocks()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
