const assert = require('assert')
const path = require('path')
const Module = require('module')

const functionsDir = __dirname
const originalLoad = Module._load

let stripeRetrieveCalls = []

function functionPath(file) {
  return path.join(functionsDir, file)
}

function utilPath(file) {
  return path.join(functionsDir, 'utils', file)
}

function purgeFunctionModules() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(functionsDir)) {
      delete require.cache[key]
    }
  }
}

function stubModule(filePath, exportsValue) {
  require.cache[filePath] = {
    id: filePath,
    filename: filePath,
    loaded: true,
    exports: exportsValue,
  }
}

function installStripeStub() {
  stripeRetrieveCalls = []
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return function createStripeClient() {
        return {
          prices: {
            retrieve: async (priceId) => {
              stripeRetrieveCalls.push(priceId)
              return { id: priceId, unit_amount: 4999, currency: 'usd' }
            },
          },
          paymentIntents: {
            retrieve: async () => ({ id: 'pi_test' }),
          },
          tax: {
            calculations: {
              create: async () => ({ tax_amount_exclusive: 0, line_items: { data: [] } }),
            },
          },
        }
      }
    }
    if (request === '@netlify/blobs') {
      return {
        getStore: () => {
          throw new Error('Blobs unavailable in focused regression test')
        },
      }
    }
    return originalLoad(request, parent, isMain)
  }
}

function restoreLoad() {
  Module._load = originalLoad
}

function makeEvent(body, overrides = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
    ...overrides,
  }
}

function installCommonValidationStubs({ ghlSubmitForm }) {
  stubModule(utilPath('rate-limiter.js'), {
    checkRateLimit: async () => ({ allowed: true, limit: 30, remaining: 29, resetTime: Date.now() + 60000, retryAfter: 0 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
  })
  stubModule(utilPath('security-logger.js'), {
    logAPIAccess: () => {},
    logRateLimit: () => {},
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  })
  stubModule(utilPath('request-fingerprint.js'), {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  stubModule(utilPath('ip-reputation.js'), {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  stubModule(utilPath('behavioral-analysis.js'), {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  stubModule(utilPath('email-domain-validator.js'), {
    validateEmailDomain: async () => ({ valid: true }),
  })
  stubModule(utilPath('blobs-store.js'), {
    initBlobsStores: () => ({ initialized: false }),
    getUnsubscribeStore: () => null,
    getCsrfTokenStore: () => null,
    isBlobsAvailable: () => false,
  })
  stubModule(utilPath('csrf-validator.js'), {
    validateCSRFToken: async () => ({ valid: true }),
  })
  stubModule(utilPath('ghl-client.js'), {
    submitForm: ghlSubmitForm,
  })
}

async function testPurchasingDisabledBlocksStripeFunctions() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  process.env.STRIPE_SECRET_KEY = 'sk_test_critical'

  installStripeStub()
  try {
    for (const file of [
      'get-price-id.js',
      'create-checkout.js',
      'create-payment-intent.js',
      'update-payment-intent.js',
    ]) {
      purgeFunctionModules()
      const { handler } = require(functionPath(file))
      const response = await handler(makeEvent('{}'), {})
      assert.strictEqual(response.statusCode, 503, `${file} should be disabled when purchasing flag is off`)
    }
    assert.deepStrictEqual(stripeRetrieveCalls, [], 'Disabled purchasing should return before Stripe calls')
  } finally {
    restoreLoad()
  }
}

async function testMiniContractorPricingUsesMsrpAtHighQuantity() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_SECRET_KEY = 'sk_test_critical'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_msrp'

  purgeFunctionModules()
  installStripeStub()
  try {
    const { handler } = require(functionPath('get-price-id.js'))
    const response = await handler(makeEvent(JSON.stringify({
      product: 'mini',
      quantity: 600,
      role: 'hvac_pro',
    })), {})
    const body = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(body.priceId, 'price_mini_msrp')
    assert.strictEqual(body.tier, 'msrp')
    assert.strictEqual(body.role, 'hvac_pro')
    assert.deepStrictEqual(stripeRetrieveCalls, ['price_mini_msrp'])
  } finally {
    restoreLoad()
    delete process.env.PURCHASING_ENABLED
  }
}

async function testContactFormGhlFailureReturns502() {
  purgeFunctionModules()
  installCommonValidationStubs({
    ghlSubmitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })

  const { handler } = require(functionPath('validate-form-submission.js'))
  const form = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz products.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  })

  const response = await handler(makeEvent(form.toString()), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(body.success, false)
}

async function testUnsubscribeGhlFailureReturns502() {
  purgeFunctionModules()
  installCommonValidationStubs({
    ghlSubmitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })

  const { handler } = require(functionPath('validate-unsubscribe.js'))
  const form = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    feedback: 'No longer needed',
    'csrf-token': 'token',
  })

  const response = await handler(makeEvent(form.toString(), {
    path: '/.netlify/functions/validate-unsubscribe',
  }), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(body.success, false)
}

async function run() {
  await testPurchasingDisabledBlocksStripeFunctions()
  await testMiniContractorPricingUsesMsrpAtHighQuantity()
  await testContactFormGhlFailureReturns502()
  await testUnsubscribeGhlFailureReturns502()
  console.log('Critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
