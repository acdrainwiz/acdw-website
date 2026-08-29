const assert = require('assert')
const path = require('path')
const Module = require('module')

const root = path.resolve(__dirname, '../..')

const originalLoad = Module._load
let stripeRetrieveCalls = 0
let ghlFailure = null

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return function stripeStub() {
      return {
        prices: {
          retrieve: async (priceId) => {
            stripeRetrieveCalls += 1
            return {
              id: priceId,
              unit_amount: priceId === process.env.STRIPE_PRICE_MINI_HOMEOWNER ? 4999 : 6999,
              currency: 'usd',
            }
          },
        },
        checkout: {
          sessions: {
            create: async () => ({ id: 'cs_test', url: 'https://stripe.example/checkout' }),
          },
        },
        paymentIntents: {
          create: async () => ({ id: 'pi_test', client_secret: 'secret_test' }),
          retrieve: async () => ({ id: 'pi_test', metadata: {} }),
          update: async () => ({ id: 'pi_test', client_secret: 'secret_test' }),
        },
        tax: {
          calculations: {
            create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
          },
        },
      }
    }
  }

  return originalLoad(request, parent, isMain)
}

function mock(relativePath, exports) {
  const filename = path.join(root, relativePath)
  require.cache[filename] = {
    id: filename,
    filename,
    loaded: true,
    exports,
  }
}

function clearFunction(relativePath) {
  delete require.cache[path.join(root, relativePath)]
}

function setupSharedMocks() {
  const noop = () => {}
  mock('netlify/functions/utils/rate-limiter.js', {
    checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
  })
  mock('netlify/functions/utils/security-logger.js', {
    logAPIAccess: noop,
    logRateLimit: noop,
    logFormSubmission: noop,
    logBotDetected: noop,
    logRecaptcha: noop,
    logInjectionAttempt: noop,
    EVENT_TYPES: {},
  })
  mock('netlify/functions/utils/shipping-calculator.cjs', {
    calculateShipping: async () => ({ cost: 15 }),
    parseProducts: () => ({}),
  })
  mock('netlify/functions/utils/request-fingerprint.js', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  mock('netlify/functions/utils/ip-reputation.js', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  mock('netlify/functions/utils/behavioral-analysis.js', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  mock('netlify/functions/utils/email-domain-validator.js', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  mock('netlify/functions/utils/blobs-store.js', {
    initBlobsStores: noop,
    getUnsubscribeStore: () => ({ set: async () => {} }),
  })
  mock('netlify/functions/utils/csrf-validator.js', {
    validateCSRFToken: async () => ({ valid: true }),
  })
  mock('netlify/functions/utils/ghl-client.js', {
    submitForm: async () => {
      if (ghlFailure) throw ghlFailure
      return { contactId: 'contact_123', isNew: true, traceId: 'trace_123', warnings: [] }
    },
  })
}

function postEvent(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
    },
    path: '/.netlify/functions/validate-form-submission',
    body: body instanceof URLSearchParams ? body.toString() : JSON.stringify(body),
  }
}

async function assertPurchasingApisDefaultClosed() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  process.env.STRIPE_SECRET_KEY = 'sk_test_stub'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_msrp'
  stripeRetrieveCalls = 0

  for (const relativePath of [
    'netlify/functions/get-price-id.js',
    'netlify/functions/create-checkout.js',
    'netlify/functions/create-payment-intent.js',
    'netlify/functions/update-payment-intent.js',
  ]) {
    clearFunction(relativePath)
    const { handler } = require(path.join(root, relativePath))
    const response = await handler(postEvent({
      product: 'mini',
      quantity: 1,
      role: 'homeowner',
      priceId: 'price_mini_msrp',
      paymentIntentId: 'pi_test',
      shippingAddress: {
        name: 'Test User',
        line1: '123 Main St',
        city: 'Boca Raton',
        state: 'FL',
        zip: '33486',
        country: 'US',
        email: 'buyer@example.com',
      },
    }), {})
    assert.strictEqual(response.statusCode, 503, `${relativePath} should default closed`)
    assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
  }

  assert.strictEqual(stripeRetrieveCalls, 0, 'disabled purchasing should stop before Stripe')
}

async function assertMiniUsesMsrpForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_msrp'
  clearFunction('netlify/functions/get-price-id.js')

  const { handler } = require(path.join(root, 'netlify/functions/get-price-id.js'))
  const response = await handler(postEvent({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }), {})

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.body)
  assert.strictEqual(body.priceId, 'price_mini_msrp')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.quantity, 600)
}

async function assertFormGhlFailureReturns502() {
  delete process.env.RECAPTCHA_SECRET_KEY
  clearFunction('netlify/functions/validate-form-submission.js')
  ghlFailure = Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_fail' })

  const { handler } = require(path.join(root, 'netlify/functions/validate-form-submission.js'))
  const form = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
  })
  const response = await handler(postEvent(form), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
  ghlFailure = null
}

async function assertUnsubscribeGhlFailureReturns502() {
  delete process.env.RECAPTCHA_SECRET_KEY
  clearFunction('netlify/functions/validate-unsubscribe.js')
  ghlFailure = Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_fail' })

  const { handler } = require(path.join(root, 'netlify/functions/validate-unsubscribe.js'))
  const form = new URLSearchParams({
    email: 'subscriber@example.com',
    reason: 'too-many-emails',
    'csrf-token': 'valid-token',
  })
  const response = await handler({
    ...postEvent(form),
    path: '/.netlify/functions/validate-unsubscribe',
  }, {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
  ghlFailure = null
}

async function main() {
  setupSharedMocks()
  await assertPurchasingApisDefaultClosed()
  await assertMiniUsesMsrpForContractors()
  await assertFormGhlFailureReturns502()
  await assertUnsubscribeGhlFailureReturns502()
  console.log('critical regression tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
