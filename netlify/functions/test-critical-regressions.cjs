const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionDir = __dirname
const originalLoad = Module._load

let ghlShouldThrow = false
let lastStripePriceId = null

function installMocks() {
  Module._load = function mockedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => {
            lastStripePriceId = priceId
            return { id: priceId, unit_amount: 4999, currency: 'usd' }
          },
        },
        paymentIntents: {
          retrieve: async (id) => ({ id, status: 'requires_payment_method' }),
          create: async () => ({ id: 'pi_test', client_secret: 'pi_test_secret' }),
          update: async () => ({ id: 'pi_test', client_secret: 'pi_test_secret' }),
        },
        checkout: {
          sessions: {
            create: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test/session' }),
          },
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
          set: async () => {},
          setJSON: async () => {},
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
        getClientIP: () => '203.0.113.10',
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
        initBlobsStores: () => {},
        getUnsubscribeStore: () => ({
          set: async () => {},
        }),
      }
    }

    if (request.endsWith('/utils/cors-config') || request === './utils/cors-config') {
      return {
        getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
      }
    }

    if (request.endsWith('/utils/csrf-validator') || request === './utils/csrf-validator') {
      return {
        validateCSRFToken: async () => ({ valid: true }),
      }
    }

    if (request.endsWith('/utils/ghl-client') || request === './utils/ghl-client') {
      return {
        submitForm: async () => {
          if (ghlShouldThrow) {
            const error = new Error('GHL unavailable')
            error.status = 503
            throw error
          }
          return { contactId: 'contact_test', isNew: true, traceId: 'trace_test', warnings: [] }
        },
      }
    }

    if (request.endsWith('/utils/shipping-calculator.cjs') || request === './utils/shipping-calculator.cjs') {
      return {
        calculateShipping: async () => ({ cost: 0 }),
        parseProducts: () => ({}),
      }
    }

    return originalLoad.call(this, request, parent, isMain)
  }
}

function restoreMocks() {
  Module._load = originalLoad
}

function clearFunctionCache(file) {
  const resolved = path.join(functionDir, file)
  delete require.cache[require.resolve(resolved)]
}

function loadHandler(file) {
  clearFunctionCache(file)
  return require(path.join(functionDir, file)).handler
}

function postEvent(body, extraHeaders = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/test',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      'content-type': 'application/x-www-form-urlencoded',
      ...extraHeaders,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }
}

async function assertPurchasingDisabled(file, body) {
  process.env.PURCHASING_ENABLED = ''
  process.env.VITE_PURCHASING_ENABLED = ''
  const handler = loadHandler(file)
  const response = await handler(postEvent(body), {})
  assert.strictEqual(response.statusCode, 503, `${file} should default closed when purchasing is disabled`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function testPurchasingGuard() {
  await assertPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' })
  await assertPurchasingDisabled('create-checkout.js', { priceId: 'price_any', quantity: 1, product: 'mini' })
  await assertPurchasingDisabled('create-payment-intent.js', { priceId: 'price_any', quantity: 1, product: 'mini' })
  await assertPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_any',
    priceId: 'price_any',
    quantity: 1,
    product: 'mini',
    shippingAddress: {},
  })
}

async function testMiniUsesHomeownerPriceForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
  lastStripePriceId = null

  const handler = loadHandler('get-price-id.js')
  const response = await handler(postEvent({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 200, response.body)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(lastStripePriceId, 'price_mini_homeowner')
}

async function testFormGhlFailureReturns502() {
  ghlShouldThrow = true
  const form = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me.',
    'form-load-time': String(Date.now() - 10000),
  })

  const handler = loadHandler('validate-form-submission.js')
  const response = await handler(postEvent(form.toString()), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502, response.body)
  assert.strictEqual(body.success, false)
  ghlShouldThrow = false
}

async function testUnsubscribeGhlFailureReturns502() {
  ghlShouldThrow = true
  const form = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    feedback: 'No longer needed',
    'csrf-token': 'csrf_test',
    'form-load-time': String(Date.now() - 10000),
  })

  const handler = loadHandler('validate-unsubscribe.js')
  const response = await handler(postEvent(form.toString()), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502, response.body)
  assert.strictEqual(body.success, false)
  ghlShouldThrow = false
}

async function main() {
  installMocks()
  try {
    await testPurchasingGuard()
    await testMiniUsesHomeownerPriceForContractors()
    await testFormGhlFailureReturns502()
    await testUnsubscribeGhlFailureReturns502()
  } finally {
    restoreMocks()
  }
  console.log('critical regression tests passed')
}

main().catch((error) => {
  restoreMocks()
  console.error(error)
  process.exit(1)
})
