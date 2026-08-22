const assert = require('assert')
const fs = require('fs')
const Module = require('module')
const path = require('path')

const FUNCTIONS_DIR = __dirname

function loadFunction(relativePath, overrides = {}) {
  const filename = path.join(FUNCTIONS_DIR, relativePath)
  const source = fs.readFileSync(filename, 'utf8')
  const mod = new Module(filename, module)
  mod.filename = filename
  mod.paths = Module._nodeModulePaths(path.dirname(filename))

  const stubs = {
    stripe: () => ({
      prices: {
        retrieve: async (priceId) => ({
          id: priceId,
          unit_amount: priceId === process.env.STRIPE_PRICE_MINI_HOMEOWNER ? 4999 : 6999,
          currency: 'usd',
        }),
      },
      checkout: {
        sessions: {
          create: async () => {
            throw new Error('Stripe checkout should not be called when purchasing is disabled')
          },
        },
      },
      paymentIntents: {
        create: async () => {
          throw new Error('Stripe payment intent should not be created when purchasing is disabled')
        },
        retrieve: async () => ({ metadata: {} }),
        update: async () => {
          throw new Error('Stripe payment intent should not be updated when purchasing is disabled')
        },
      },
      tax: {
        calculations: {
          create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
        },
      },
    }),
    './utils/rate-limiter': {
      checkRateLimit: async () => ({ allowed: true, remaining: 9, limit: 10, retryAfter: 0 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '203.0.113.10',
    },
    './utils/security-logger': {
      logAPIAccess: () => {},
      logRateLimit: () => {},
      logFormSubmission: () => {},
      logBotDetected: () => {},
      logRecaptcha: () => {},
      logInjectionAttempt: () => {},
      EVENT_TYPES: {},
    },
    './utils/shipping-calculator.cjs': {
      calculateShipping: async () => ({ cost: 15 }),
      parseProducts: () => ({}),
    },
    './utils/input-sanitizer': {
      sanitizeFormData: (data) => ({ ...data }),
    },
    './utils/cors-config': {
      getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
    },
    './utils/request-fingerprint': {
      validateRequestFingerprint: () => ({ isBot: false }),
    },
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
      getUnsubscribeStore: () => ({ set: async () => {} }),
    },
    './utils/ghl-client': {
      submitForm: async () => ({ contactId: 'contact_123', isNew: true, traceId: 'trace_123', warnings: [] }),
    },
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({ valid: true }),
    },
    ...overrides,
  }

  const originalRequire = mod.require.bind(mod)
  mod.require = (request) => {
    if (Object.prototype.hasOwnProperty.call(stubs, request)) {
      return stubs[request]
    }
    return originalRequire(request)
  }

  mod._compile(source, filename)
  return mod.exports
}

function postEvent(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
    },
    path: '/.netlify/functions/test',
    body,
  }
}

async function assertPurchasingDisabled(relativePath, body) {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  const { handler } = loadFunction(relativePath)
  const response = await handler(postEvent(JSON.stringify(body)), {})
  assert.strictEqual(response.statusCode, 503, `${relativePath} must fail closed when purchasing is disabled`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function testPurchasingGate() {
  await assertPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' })
  await assertPurchasingDisabled('create-checkout.js', { priceId: 'price_123', quantity: 1, product: 'mini' })
  await assertPurchasingDisabled('create-payment-intent.js', {
    priceId: 'price_123',
    quantity: 1,
    product: 'mini',
    shippingAddress: {
      line1: '1 Test St',
      city: 'Boca Raton',
      state: 'FL',
      zip: '33431',
      country: 'US',
      email: 'buyer@example.com',
    },
  })
  await assertPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_123',
    priceId: 'price_123',
    quantity: 1,
    product: 'mini',
    shippingAddress: {
      line1: '1 Test St',
      city: 'Boca Raton',
      state: 'FL',
      zip: '33431',
      country: 'US',
      email: 'buyer@example.com',
    },
  })
}

async function testMiniUsesMsrpForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_msrp'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_discount'

  const { handler } = loadFunction('get-price-id.js')
  const response = await handler(
    postEvent(JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' })),
    {}
  )
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_msrp')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.unitPrice, 49.99)
}

async function testFormGhlFailureReturns502() {
  const failingGhl = {
    submitForm: async () => {
      throw Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_fail' })
    },
  }
  const { handler } = loadFunction('validate-form-submission.js', {
    './utils/ghl-client': failingGhl,
  })
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz products.',
    consent: 'yes',
  }).toString()

  const response = await handler(postEvent(body), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function testUnsubscribeCsrfAndGhlFailures() {
  const invalidCsrf = {
    validateCSRFToken: async () => ({
      valid: false,
      reason: 'CSRF token required',
      details: { message: 'Security token is required for form submission' },
    }),
  }
  const invalidCsrfHandler = loadFunction('validate-unsubscribe.js', {
    './utils/csrf-validator': invalidCsrf,
  }).handler

  const unsubscribeBody = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
  }).toString()
  const invalidCsrfResponse = await invalidCsrfHandler(postEvent(unsubscribeBody), {})
  assert.strictEqual(invalidCsrfResponse.statusCode, 400)
  assert.match(JSON.parse(invalidCsrfResponse.body).error, /CSRF/)

  const failingGhlHandler = loadFunction('validate-unsubscribe.js', {
    './utils/ghl-client': {
      submitForm: async () => {
        throw Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_fail' })
      },
    },
  }).handler
  const ghlFailureResponse = await failingGhlHandler(postEvent(unsubscribeBody), {})
  assert.strictEqual(ghlFailureResponse.statusCode, 502)
  assert.strictEqual(JSON.parse(ghlFailureResponse.body).success, false)
}

async function main() {
  await testPurchasingGate()
  await testMiniUsesMsrpForContractors()
  await testFormGhlFailureReturns502()
  await testUnsubscribeCsrfAndGhlFailures()
  console.log('critical regression tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
