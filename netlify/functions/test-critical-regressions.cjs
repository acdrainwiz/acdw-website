const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

let stripeApiCalls = []
let ghlShouldFail = false
let csrfValidationCalls = 0

const stripeMock = {
  prices: {
    retrieve: async (priceId) => {
      stripeApiCalls.push(['prices.retrieve', priceId])
      return { id: priceId, unit_amount: 4999, currency: 'usd' }
    },
  },
  checkout: {
    sessions: {
      create: async (config) => {
        stripeApiCalls.push(['checkout.sessions.create', config])
        return { id: 'cs_test_123', url: 'https://checkout.stripe.test/session' }
      },
    },
  },
  paymentIntents: {
    create: async (config) => {
      stripeApiCalls.push(['paymentIntents.create', config])
      return { id: 'pi_test_123', client_secret: 'pi_secret' }
    },
    retrieve: async (id) => {
      stripeApiCalls.push(['paymentIntents.retrieve', id])
      return { id, metadata: {} }
    },
    update: async (id, config) => {
      stripeApiCalls.push(['paymentIntents.update', id, config])
      return { id, client_secret: 'pi_secret' }
    },
  },
  tax: {
    calculations: {
      create: async () => {
        stripeApiCalls.push(['tax.calculations.create'])
        return { tax_amount_exclusive: 0, tax_breakdown: [] }
      },
    },
  },
}

function allowedRateLimit() {
  return {
    allowed: true,
    remaining: 29,
    limit: 30,
    resetTime: Date.now() + 60000,
    retryAfter: 0,
  }
}

function installMocks() {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => stripeMock
    }
    if (request.includes('utils/rate-limiter')) {
      return {
        checkRateLimit: async () => allowedRateLimit(),
        checkRateLimitSync: () => allowedRateLimit(),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '203.0.113.10',
      }
    }
    if (request.includes('utils/security-logger')) {
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
    if (request.includes('utils/shipping-calculator.cjs')) {
      return {
        calculateShipping: async () => ({ cost: 15 }),
        parseProducts: (products) => products,
      }
    }
    if (request.includes('utils/input-sanitizer')) {
      return {
        sanitizeFormData: (data) => ({ ...data }),
      }
    }
    if (request.includes('utils/cors-config')) {
      return {
        getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
      }
    }
    if (request.includes('utils/request-fingerprint')) {
      return {
        validateRequestFingerprint: () => ({ isBot: false }),
      }
    }
    if (request.includes('utils/ip-reputation')) {
      return {
        validateIP: async () => ({ allowed: true }),
        addToBlacklist: async () => {},
      }
    }
    if (request.includes('utils/behavioral-analysis')) {
      return {
        validateSubmissionBehavior: async () => ({ allowed: true }),
      }
    }
    if (request.includes('utils/email-domain-validator')) {
      return {
        validateEmailDomain: async () => ({ valid: true }),
      }
    }
    if (request.includes('utils/blobs-store')) {
      return {
        initBlobsStores: () => {},
        getUnsubscribeStore: () => ({ set: async () => {} }),
      }
    }
    if (request.includes('utils/csrf-validator')) {
      return {
        validateCSRFToken: async () => {
          csrfValidationCalls += 1
          return { valid: true }
        },
      }
    }
    if (request.includes('utils/ghl-client')) {
      return {
        submitForm: async () => {
          if (ghlShouldFail) {
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

function resetFunctionModules() {
  for (const modulePath of Object.keys(require.cache)) {
    if (modulePath.startsWith(functionsDir)) {
      delete require.cache[modulePath]
    }
  }
}

function loadHandler(fileName) {
  resetFunctionModules()
  return require(path.join(functionsDir, fileName)).handler
}

function postEvent(body, extra = {}) {
  return {
    httpMethod: 'POST',
    path: extra.path || '/.netlify/functions/test',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      'content-type': 'application/x-www-form-urlencoded',
      ...extra.headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }
}

function setPurchasingEnv(enabled) {
  if (enabled) {
    process.env.PURCHASING_ENABLED = 'true'
  } else {
    delete process.env.PURCHASING_ENABLED
    delete process.env.VITE_PURCHASING_ENABLED
  }
}

async function assertPurchasingDisabled(fileName, body) {
  stripeApiCalls = []
  setPurchasingEnv(false)
  const handler = loadHandler(fileName)
  const response = await handler(postEvent(body), {})
  assert.strictEqual(response.statusCode, 503, `${fileName} should be default-closed`)
  assert.strictEqual(stripeApiCalls.length, 0, `${fileName} should not touch Stripe while disabled`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function testPurchasingGate() {
  await assertPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1 })
  await assertPurchasingDisabled('create-checkout.js', { priceId: 'price_123', product: 'mini', quantity: 1 })
  await assertPurchasingDisabled('create-payment-intent.js', { priceId: 'price_123', product: 'mini', quantity: 1 })
  await assertPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_123',
    priceId: 'price_123',
    product: 'mini',
    quantity: 1,
    shippingAddress: {},
  })
}

async function testMiniUsesListPriceForContractors() {
  stripeApiCalls = []
  setPurchasingEnv(true)
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_list'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_contractor'

  const handler = loadHandler('get-price-id.js')
  const response = await handler(
    postEvent({ product: 'mini', quantity: 600, role: 'hvac_pro' }),
    {},
  )
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_list')
  assert.strictEqual(body.role, 'homeowner')
  assert.strictEqual(body.tier, 'msrp')
  assert.deepStrictEqual(stripeApiCalls[0], ['prices.retrieve', 'price_mini_list'])
}

async function testFormGhlFailureReturns502() {
  ghlShouldFail = true
  const handler = loadHandler('validate-form-submission.js')
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Need help with installation.',
    consent: 'yes',
  }).toString()

  const response = await handler(postEvent(body, { path: '/contact' }), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).error, 'Submission delivery failed')
  ghlShouldFail = false
}

async function testUnsubscribeGhlFailureReturns502AndChecksCsrf() {
  ghlShouldFail = true
  csrfValidationCalls = 0
  const handler = loadHandler('validate-unsubscribe.js')
  const body = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    feedback: 'No longer needed',
    'csrf-token': 'csrf_123',
  }).toString()

  const response = await handler(postEvent(body, { path: '/unsubscribe' }), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).error, 'Unsubscribe delivery failed')
  assert.ok(csrfValidationCalls > 0, 'unsubscribe should validate CSRF token')
  ghlShouldFail = false
}

async function main() {
  installMocks()
  try {
    await testPurchasingGate()
    await testMiniUsesListPriceForContractors()
    await testFormGhlFailureReturns502()
    await testUnsubscribeGhlFailureReturns502AndChecksCsrf()
  } finally {
    Module._load = originalLoad
    setPurchasingEnv(false)
  }
  console.log('Critical regression tests passed')
}

main().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
