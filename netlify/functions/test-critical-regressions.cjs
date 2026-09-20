const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const originalEnv = { ...process.env }

const functionPaths = [
  './get-price-id.js',
  './create-payment-intent.js',
  './update-payment-intent.js',
  './create-checkout.js',
  './validate-form-submission.js',
  './validate-unsubscribe.js',
  './utils/purchasing-enabled.cjs',
  './utils/ghl-client.js',
]

function resetEnv() {
  for (const key of Object.keys(process.env)) {
    delete process.env[key]
  }
  Object.assign(process.env, originalEnv)
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  delete process.env.RECAPTCHA_SECRET_KEY
  delete process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN
  delete process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN
}

function clearFunctionCache() {
  for (const path of functionPaths) {
    try {
      delete require.cache[require.resolve(path)]
    } catch (_) {}
  }
}

function installMocks({ ghlSubmitForm } = {}) {
  const stripeCalls = {
    pricesRetrieve: [],
    paymentIntentsCreate: 0,
    paymentIntentsUpdate: 0,
    checkoutCreate: 0,
  }

  Module._load = function mockLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => {
            stripeCalls.pricesRetrieve.push(priceId)
            return { id: priceId, unit_amount: 4999, currency: 'usd' }
          },
        },
        paymentIntents: {
          create: async () => {
            stripeCalls.paymentIntentsCreate += 1
            return { id: 'pi_test', client_secret: 'secret' }
          },
          retrieve: async () => ({ id: 'pi_test', metadata: {} }),
          update: async () => {
            stripeCalls.paymentIntentsUpdate += 1
            return { id: 'pi_test', client_secret: 'secret' }
          },
        },
        checkout: {
          sessions: {
            create: async () => {
              stripeCalls.checkoutCreate += 1
              return { id: 'cs_test', url: 'https://checkout.test' }
            },
          },
        },
        tax: {
          calculations: {
            create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
          },
        },
      })
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
        initBlobsStores: () => {},
        getUnsubscribeStore: () => ({ set: async () => {} }),
      }
    }

    if (request === './utils/cors-config') {
      return {
        getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
      }
    }

    if (request === './utils/ghl-client' && ghlSubmitForm) {
      return { submitForm: ghlSubmitForm }
    }

    return originalLoad.call(this, request, parent, isMain)
  }

  return stripeCalls
}

function restoreMocks() {
  Module._load = originalLoad
}

function paymentEvent(body) {
  return {
    httpMethod: 'POST',
    headers: { 'user-agent': 'Mozilla/5.0' },
    body: JSON.stringify(body),
  }
}

function formEvent(params, path = '/.netlify/functions/validate-form-submission') {
  return {
    httpMethod: 'POST',
    path,
    headers: {
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  }
}

async function testPurchasingKillSwitch() {
  resetEnv()
  clearFunctionCache()
  const stripeCalls = installMocks()

  for (const [path, body] of [
    ['./get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' }],
    ['./create-payment-intent.js', {
      priceId: 'price_mini_homeowner',
      quantity: 1,
      product: 'mini',
      shippingAddress: {
        line1: '1 Main St',
        city: 'Boise',
        state: 'ID',
        zip: '83702',
        country: 'US',
        email: 'buyer@example.com',
      },
    }],
    ['./update-payment-intent.js', {
      paymentIntentId: 'pi_test',
      priceId: 'price_mini_homeowner',
      quantity: 1,
      product: 'mini',
      shippingAddress: {
        line1: '1 Main St',
        city: 'Boise',
        state: 'ID',
        zip: '83702',
        country: 'US',
        email: 'buyer@example.com',
      },
    }],
    ['./create-checkout.js', {
      priceId: 'price_mini_homeowner',
      quantity: 1,
      product: 'mini',
      isGuest: true,
      shippingAddress: { state: 'ID', country: 'US', city: 'Boise' },
    }],
  ]) {
    const { handler } = require(path)
    const response = await handler(paymentEvent(body), {})
    assert.strictEqual(response.statusCode, 503, `${path} should fail closed`)
    assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
  }

  assert.deepStrictEqual(stripeCalls.pricesRetrieve, [])
  assert.strictEqual(stripeCalls.paymentIntentsCreate, 0)
  assert.strictEqual(stripeCalls.paymentIntentsUpdate, 0)
  assert.strictEqual(stripeCalls.checkoutCreate, 0)
  restoreMocks()
}

async function testMiniListPriceResolution() {
  resetEnv()
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'
  clearFunctionCache()
  const stripeCalls = installMocks()

  const { handler } = require('./get-price-id.js')
  const miniResponse = await handler(paymentEvent({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }), {})
  assert.strictEqual(miniResponse.statusCode, 200)
  const miniBody = JSON.parse(miniResponse.body)
  assert.strictEqual(miniBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(miniBody.tier, 'msrp')
  assert.deepStrictEqual(stripeCalls.pricesRetrieve, ['price_mini_homeowner'])

  const sensorResponse = await handler(paymentEvent({
    product: 'sensor',
    quantity: 600,
    role: 'hvac_pro',
  }), {})
  assert.strictEqual(sensorResponse.statusCode, 400)
  assert.strictEqual(JSON.parse(sensorResponse.body).requiresContact, true)
  restoreMocks()
}

async function testGhlFailureResponsesAndComplimentaryToken() {
  resetEnv()
  clearFunctionCache()
  installMocks({
    ghlSubmitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })

  let { handler } = require('./validate-form-submission.js')
  const failedForm = await handler(formEvent({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 10000),
  }), {})
  assert.strictEqual(failedForm.statusCode, 502)
  assert.strictEqual(JSON.parse(failedForm.body).success, false)

  ;({ handler } = require('./validate-unsubscribe.js'))
  const failedUnsubscribe = await handler(formEvent({
    email: 'ada@example.com',
    reason: 'not-relevant',
    'form-load-time': String(Date.now() - 10000),
  }, '/.netlify/functions/validate-unsubscribe'), {})
  assert.strictEqual(failedUnsubscribe.statusCode, 502)
  assert.strictEqual(JSON.parse(failedUnsubscribe.body).success, false)
  restoreMocks()

  resetEnv()
  process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = 'server-token'
  clearFunctionCache()
  installMocks({
    ghlSubmitForm: async () => ({ contactId: 'contact_123', isNew: true, traceId: 'trace', warnings: [] }),
  })

  ;({ handler } = require('./validate-form-submission.js'))
  const complimentaryResponse = await handler(formEvent({
    'form-name': 'complimentary-mini-request',
    'form-type': 'complimentary-mini-request',
    access: 'server-token',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '555-555-1212',
    contactType: 'Mechanical Inspector',
    street: '1 Main St',
    city: 'Boise',
    state: 'ID',
    zip: '83702',
    consent: 'yes',
    'form-load-time': String(Date.now() - 10000),
  }), {})
  assert.strictEqual(complimentaryResponse.statusCode, 200)
  restoreMocks()
}

function testPartialOpportunityFieldDetection() {
  resetEnv()
  clearFunctionCache()
  installMocks()
  const { findMissingPopulatedCustomFields } = require('./utils/ghl-client.js')
  const missing = findMissingPopulatedCustomFields(
    [
      ['resolved_field', 'resolvedAnswer'],
      ['empty_missing_field', 'emptyAnswer'],
      ['missing_field', 'missingAnswer'],
    ],
    {
      resolvedAnswer: 'yes',
      emptyAnswer: '',
      missingAnswer: 'Submitted detail',
    },
    (key) => (key === 'resolved_field' ? 'field-id' : '')
  )
  assert.deepStrictEqual(missing, [{ ghlKey: 'missing_field', formKey: 'missingAnswer' }])
  restoreMocks()
}

async function main() {
  try {
    await testPurchasingKillSwitch()
    await testMiniListPriceResolution()
    await testGhlFailureResponsesAndComplimentaryToken()
    testPartialOpportunityFieldDetection()
    console.log('critical regression tests passed')
  } finally {
    restoreMocks()
    resetEnv()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
