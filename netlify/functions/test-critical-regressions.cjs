const assert = require('node:assert/strict')
const Module = require('node:module')

const originalLoad = Module._load
let ghlShouldFail = false
let csrfValidation = { valid: true }
let ghlCalls = 0

function installMocks() {
  Module._load = function mockLoad(request) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => ({ id: priceId, unit_amount: 4999, currency: 'usd' }),
        },
        checkout: {
          sessions: {
            create: async () => ({ id: 'cs_test', url: 'https://checkout.example/session' }),
          },
        },
        paymentIntents: {
          create: async () => ({ id: 'pi_test', client_secret: 'secret' }),
          retrieve: async () => ({ id: 'pi_test', metadata: {} }),
          update: async () => ({ id: 'pi_test', client_secret: 'secret' }),
        },
        tax: {
          calculations: {
            create: async () => ({ id: 'tax_test', tax_amount_exclusive: 0, tax_breakdown: [] }),
          },
        },
      })
    }

    if (request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '127.0.0.1',
      }
    }

    if (request === './utils/security-logger') {
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

    if (request === './utils/shipping-calculator.cjs') {
      return {
        calculateShipping: async () => ({ cost: 0, method: 'test' }),
        parseProducts: () => ({}),
      }
    }

    if (request === './utils/ghl-client') {
      return {
        submitForm: async () => {
          ghlCalls += 1
          if (ghlShouldFail) {
            const error = new Error('GHL unavailable')
            error.status = 503
            throw error
          }
          return { contactId: 'contact_test', isNew: false, traceId: 'trace_test', warnings: [] }
        },
      }
    }

    if (request === './utils/input-sanitizer') {
      return { sanitizeFormData: (data) => data }
    }

    if (request === './utils/request-fingerprint') {
      return { validateRequestFingerprint: () => ({ isBot: false }) }
    }

    if (request === './utils/ip-reputation') {
      return {
        validateIP: async () => ({ allowed: true }),
        addToBlacklist: async () => {},
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
        initBlobsStores: () => ({ initialized: false }),
        getUnsubscribeStore: () => null,
        getCsrfTokenStore: () => null,
        isBlobsAvailable: () => false,
      }
    }

    if (request === './utils/cors-config') {
      return { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }
    }

    if (request === './utils/csrf-validator') {
      return { validateCSRFToken: async () => csrfValidation }
    }

    return originalLoad.apply(this, arguments)
  }
}

function loadHandler(path) {
  const resolved = require.resolve(path)
  delete require.cache[resolved]
  return require(path).handler
}

function postJson(body) {
  return {
    httpMethod: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0' },
    body: JSON.stringify(body),
  }
}

function postForm(path, params) {
  return {
    httpMethod: 'POST',
    path,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0',
      origin: 'https://www.acdrainwiz.com',
    },
    body: new URLSearchParams(params).toString(),
  }
}

async function expectPurchasingDisabled(path, body) {
  process.env.PURCHASING_ENABLED = 'false'
  process.env.VITE_PURCHASING_ENABLED = 'false'
  const response = await loadHandler(path)(postJson(body), {})
  assert.equal(response.statusCode, 503)
  assert.equal(JSON.parse(response.body).purchasingEnabled, false)
}

async function run() {
  installMocks()

  await expectPurchasingDisabled('./get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' })
  await expectPurchasingDisabled('./create-checkout.js', {
    priceId: 'price_test',
    quantity: 1,
    product: 'mini',
    isGuest: true,
    shippingAddress: { state: 'FL', country: 'US' },
  })
  await expectPurchasingDisabled('./create-payment-intent.js', {
    priceId: 'price_test',
    quantity: 1,
    product: 'mini',
    shippingAddress: {
      line1: '1 Main St',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'US',
      email: 'buyer@example.com',
    },
  })
  await expectPurchasingDisabled('./update-payment-intent.js', {
    paymentIntentId: 'pi_test',
    priceId: 'price_test',
    quantity: 1,
    product: 'mini',
    shippingAddress: {
      line1: '1 Main St',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'US',
      email: 'buyer@example.com',
    },
  })

  process.env.PURCHASING_ENABLED = 'true'
  process.env.VITE_PURCHASING_ENABLED = 'false'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_hvac_t3'
  const miniResponse = await loadHandler('./get-price-id.js')(
    postJson({ product: 'mini', quantity: 600, role: 'hvac_pro' }),
    {}
  )
  const miniBody = JSON.parse(miniResponse.body)
  assert.equal(miniResponse.statusCode, 200, miniResponse.body)
  assert.equal(miniBody.priceId, 'price_mini_homeowner')
  assert.equal(miniBody.tier, 'msrp')

  ghlShouldFail = true
  const formResponse = await loadHandler('./validate-form-submission.js')(
    postForm('/.netlify/functions/validate-form-submission', {
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Pat',
      lastName: 'Buyer',
      email: 'pat@example.com',
      message: 'Need help with an order.',
      consent: 'yes',
    }),
    {}
  )
  assert.equal(formResponse.statusCode, 502, formResponse.body)
  assert.equal(JSON.parse(formResponse.body).success, false)

  const unsubscribeHandler = loadHandler('./validate-unsubscribe.js')
  csrfValidation = { valid: false, reason: 'Invalid CSRF token' }
  const invalidCsrfResponse = await unsubscribeHandler(
    postForm('/.netlify/functions/validate-unsubscribe', {
      email: 'pat@example.com',
      reason: 'not-relevant',
      'csrf-token': 'bad-token',
    }),
    {}
  )
  assert.equal(invalidCsrfResponse.statusCode, 400, invalidCsrfResponse.body)
  assert.equal(ghlCalls, 1)

  csrfValidation = { valid: true }
  const unsubscribeResponse = await unsubscribeHandler(
    postForm('/.netlify/functions/validate-unsubscribe', {
      email: 'pat@example.com',
      reason: 'not-relevant',
      'csrf-token': 'good-token',
    }),
    {}
  )
  assert.equal(unsubscribeResponse.statusCode, 502, unsubscribeResponse.body)
  assert.equal(JSON.parse(unsubscribeResponse.body).success, false)

  Module._load = originalLoad
  console.log('critical regression tests passed')
}

run().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
