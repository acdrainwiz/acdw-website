const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

let stripeRetrieveCalls = []
let stripeSessionCreateCalls = []
let stripePaymentIntentCreateCalls = []
let stripePaymentIntentUpdateCalls = []
let ghlShouldThrow = false

function resetCalls() {
  stripeRetrieveCalls = []
  stripeSessionCreateCalls = []
  stripePaymentIntentCreateCalls = []
  stripePaymentIntentUpdateCalls = []
  ghlShouldThrow = false
}

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return function stripeStub() {
      return {
        prices: {
          retrieve: async (priceId) => {
            stripeRetrieveCalls.push(priceId)
            return { id: priceId, unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999, currency: 'usd' }
          },
        },
        checkout: {
          sessions: {
            create: async (config) => {
              stripeSessionCreateCalls.push(config)
              return { id: 'cs_test', url: 'https://checkout.stripe.test/session' }
            },
          },
        },
        tax: {
          calculations: {
            create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
          },
        },
        paymentIntents: {
          create: async (config) => {
            stripePaymentIntentCreateCalls.push(config)
            return { id: 'pi_test', client_secret: 'pi_test_secret' }
          },
          retrieve: async (id) => ({ id, metadata: {} }),
          update: async (id, config) => {
            stripePaymentIntentUpdateCalls.push({ id, config })
            return { id, client_secret: `${id}_secret` }
          },
        },
      }
    }
  }

  if (request.endsWith('/utils/rate-limiter')) {
    return {
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '203.0.113.10',
    }
  }

  if (request.endsWith('/utils/security-logger')) {
    return new Proxy({ EVENT_TYPES: {} }, { get: (target, prop) => target[prop] || (() => {}) })
  }

  if (request.endsWith('/utils/shipping-calculator.cjs')) {
    return {
      calculateShipping: async () => ({ cost: 0, method: 'test', carrier: 'test' }),
      parseProducts: (products) => products,
    }
  }

  if (request.endsWith('/utils/input-sanitizer')) {
    return { sanitizeFormData: (data) => data }
  }

  if (request.endsWith('/utils/cors-config')) {
    return { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }
  }

  if (request.endsWith('/utils/request-fingerprint')) {
    return { validateRequestFingerprint: () => ({ isBot: false }) }
  }

  if (request.endsWith('/utils/ip-reputation')) {
    return {
      validateIP: async () => ({ allowed: true }),
      addToBlacklist: async () => {},
    }
  }

  if (request.endsWith('/utils/behavioral-analysis')) {
    return { validateSubmissionBehavior: async () => ({ allowed: true }) }
  }

  if (request.endsWith('/utils/email-domain-validator')) {
    return { validateEmailDomain: async () => ({ valid: true }) }
  }

  if (request.endsWith('/utils/blobs-store')) {
    return {
      initBlobsStores: () => ({ initialized: true }),
      getUnsubscribeStore: () => ({ set: async () => {} }),
    }
  }

  if (request.endsWith('/utils/csrf-validator')) {
    return { validateCSRFToken: async () => ({ valid: true }) }
  }

  if (request.endsWith('/utils/ghl-client')) {
    return {
      submitForm: async () => {
        if (ghlShouldThrow) {
          throw new Error('simulated GHL outage')
        }
        return { contactId: 'contact_test', isNew: false, traceId: 'trace_test', warnings: [] }
      },
    }
  }

  return originalLoad(request, parent, isMain)
}

function clearHandler(modulePath) {
  delete require.cache[require.resolve(modulePath)]
  return require(modulePath).handler
}

function postEvent(body, path = '/.netlify/functions/test') {
  return {
    httpMethod: 'POST',
    path,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 regression-test',
    },
    body: body instanceof URLSearchParams ? body.toString() : JSON.stringify(body),
  }
}

async function expectPurchasingDisabled(modulePath, body) {
  resetCalls()
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  const handler = clearHandler(modulePath)
  const response = await handler(postEvent(body), {})

  assert.strictEqual(response.statusCode, 503, `${modulePath} should fail closed when purchasing is disabled`)
  assert.strictEqual(stripeRetrieveCalls.length, 0, `${modulePath} should not reach Stripe when disabled`)
  assert.strictEqual(stripeSessionCreateCalls.length, 0, `${modulePath} should not create Stripe Checkout when disabled`)
  assert.strictEqual(stripePaymentIntentCreateCalls.length, 0, `${modulePath} should not create Payment Intents when disabled`)
  assert.strictEqual(stripePaymentIntentUpdateCalls.length, 0, `${modulePath} should not update Payment Intents when disabled`)
}

async function testPurchasingKillSwitch() {
  await expectPurchasingDisabled('./get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' })
  await expectPurchasingDisabled('./create-checkout.js', { priceId: 'price_any', quantity: 1, product: 'mini' })
  await expectPurchasingDisabled('./create-payment-intent.js', { priceId: 'price_any', quantity: 1, product: 'mini' })
  await expectPurchasingDisabled('./update-payment-intent.js', {
    paymentIntentId: 'pi_any',
    priceId: 'price_any',
    quantity: 1,
    product: 'mini',
    shippingAddress: {},
  })
}

async function testMiniAlwaysUsesListPrice() {
  resetCalls()
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_wrong_discount'

  const handler = clearHandler('./get-price-id.js')
  const response = await handler(
    postEvent({ product: 'mini', quantity: 600, role: 'property_manager' }),
    {}
  )
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.unitPrice, 49.99)
  assert.deepStrictEqual(stripeRetrieveCalls, ['price_mini_homeowner'])
}

async function testGhlFailureReturns502() {
  resetCalls()
  ghlShouldThrow = true

  const handler = clearHandler('./validate-form-submission.js')
  const form = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ava',
    lastName: 'Tech',
    email: 'ava@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  })

  const response = await handler(postEvent(form, '/.netlify/functions/validate-form-submission'), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(body.success, false)
}

async function testUnsubscribeGhlFailureReturns502() {
  resetCalls()
  ghlShouldThrow = true

  const handler = clearHandler('./validate-unsubscribe.js')
  const form = new URLSearchParams({
    email: 'ava@example.com',
    reason: 'not-relevant',
    'csrf-token': 'valid-test-token',
    'form-load-time': String(Date.now() - 5000),
  })

  const response = await handler(postEvent(form, '/.netlify/functions/validate-unsubscribe'), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(body.success, false)
}

async function run() {
  try {
    await testPurchasingKillSwitch()
    await testMiniAlwaysUsesListPrice()
    await testGhlFailureReturns502()
    await testUnsubscribeGhlFailureReturns502()
    console.log('Critical regression tests passed')
  } finally {
    Module._load = originalLoad
  }
}

run().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
