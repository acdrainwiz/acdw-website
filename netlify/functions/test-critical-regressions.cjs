const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

let ghlShouldFail = false
let stripeRetrieveCalls = []

function jsonEvent(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0',
      origin: 'https://www.acdrainwiz.com',
      'content-type': 'application/x-www-form-urlencoded',
    },
    path: '/.netlify/functions/test',
    body,
  }
}

function clearFunctionModule(relativePath) {
  const resolved = path.join(functionsDir, relativePath)
  delete require.cache[require.resolve(resolved)]
}

function loadFunction(relativePath) {
  clearFunctionModule(relativePath)
  return require(path.join(functionsDir, relativePath))
}

Module._load = function mockLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          stripeRetrieveCalls.push(priceId)
          return {
            id: priceId,
            unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 12999,
            currency: 'usd',
          }
        },
      },
      checkout: {
        sessions: {
          create: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test' }),
        },
      },
      paymentIntents: {
        retrieve: async () => ({ id: 'pi_test', metadata: {} }),
        create: async () => ({ id: 'pi_test', client_secret: 'secret' }),
        update: async () => ({ id: 'pi_test', client_secret: 'secret' }),
      },
      tax: {
        calculations: {
          create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
        },
      },
    })
  }

  if (request.endsWith('/utils/rate-limiter')) {
    return {
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    }
  }

  if (request.endsWith('/utils/security-logger')) {
    return {
      EVENT_TYPES: {},
      logAPIAccess: () => {},
      logRateLimit: () => {},
      logFormSubmission: () => {},
      logBotDetected: () => {},
      logRecaptcha: () => {},
      logInjectionAttempt: () => {},
    }
  }

  if (request.endsWith('/utils/shipping-calculator.cjs')) {
    return {
      calculateShipping: async () => ({ cost: 15 }),
      parseProducts: (products) => products,
    }
  }

  if (request.endsWith('/utils/input-sanitizer')) {
    return {
      sanitizeFormData: (data) => ({ ...data }),
    }
  }

  if (request.endsWith('/utils/cors-config')) {
    return {
      getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
    }
  }

  if (request.endsWith('/utils/request-fingerprint')) {
    return {
      validateRequestFingerprint: () => ({ isBot: false }),
    }
  }

  if (request.endsWith('/utils/ip-reputation')) {
    return {
      validateIP: async () => ({ allowed: true }),
      addToBlacklist: async () => {},
    }
  }

  if (request.endsWith('/utils/behavioral-analysis')) {
    return {
      validateSubmissionBehavior: async () => ({ allowed: true }),
    }
  }

  if (request.endsWith('/utils/email-domain-validator')) {
    return {
      validateEmailDomain: async () => ({ valid: true }),
    }
  }

  if (request.endsWith('/utils/blobs-store')) {
    return {
      initBlobsStores: () => ({ initialized: true }),
      getUnsubscribeStore: () => ({ set: async () => {} }),
    }
  }

  if (request.endsWith('/utils/ghl-client')) {
    return {
      submitForm: async () => {
        if (ghlShouldFail) throw new Error('GHL unavailable')
        return { contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] }
      },
    }
  }

  return originalLoad.apply(this, arguments)
}

async function testPaymentKillSwitch() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  for (const relativePath of [
    'get-price-id.js',
    'create-checkout.js',
    'create-payment-intent.js',
    'update-payment-intent.js',
  ]) {
    stripeRetrieveCalls = []
    const { handler } = loadFunction(relativePath)
    const response = await handler(jsonEvent('{}'), {})
    assert.strictEqual(response.statusCode, 503, `${relativePath} should fail closed when purchasing is disabled`)
    assert.deepStrictEqual(stripeRetrieveCalls, [], `${relativePath} should not touch Stripe when purchasing is disabled`)
  }
}

async function testMiniListPriceForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

  const { handler } = loadFunction('get-price-id.js')
  const miniResponse = await handler(jsonEvent(JSON.stringify({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  })), {})
  assert.strictEqual(miniResponse.statusCode, 200)
  const miniBody = JSON.parse(miniResponse.body)
  assert.strictEqual(miniBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(miniBody.tier, 'msrp')
  assert.strictEqual(miniBody.unitPrice, 49.99)

  const sensorResponse = await handler(jsonEvent(JSON.stringify({
    product: 'sensor',
    quantity: 600,
    role: 'hvac_pro',
  })), {})
  assert.strictEqual(sensorResponse.statusCode, 400)
  assert.strictEqual(JSON.parse(sensorResponse.body).requiresContact, true)
}

async function testGhlFormFailureReturns502() {
  ghlShouldFail = true
  const { handler } = loadFunction('validate-form-submission.js')
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz products.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(jsonEvent(body), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
  ghlShouldFail = false
}

async function testGhlUnsubscribeFailureReturns502() {
  ghlShouldFail = true
  const { handler } = loadFunction('validate-unsubscribe.js')
  const body = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(jsonEvent(body), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
  ghlShouldFail = false
}

async function testComplimentaryMiniServerToken() {
  process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = 'server-token'
  delete process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN
  ghlShouldFail = false

  const { handler } = loadFunction('validate-form-submission.js')
  const body = new URLSearchParams({
    'form-name': 'complimentary-mini-request',
    'form-type': 'complimentary-mini-request',
    access: 'server-token',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '555-555-5555',
    contactType: 'Code Official',
    street: '123 Main St',
    city: 'Orlando',
    state: 'FL',
    zip: '32801',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(jsonEvent(body), {})
  assert.strictEqual(response.statusCode, 200, response.body)
  assert.strictEqual(JSON.parse(response.body).success, true)
}

async function run() {
  try {
    await testPaymentKillSwitch()
    await testMiniListPriceForContractors()
    await testGhlFormFailureReturns502()
    await testGhlUnsubscribeFailureReturns502()
    await testComplimentaryMiniServerToken()
    console.log('critical regression tests passed')
  } finally {
    Module._load = originalLoad
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
