const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname

function loadHandler(fileName, mocks = {}) {
  const filePath = path.join(functionsDir, fileName)
  delete require.cache[require.resolve(filePath)]

  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => {
            if (mocks.invalidPrice) throw new Error('invalid price')
            return { id: priceId, unit_amount: 4999, currency: 'usd' }
          },
        },
      })
    }

    if (request.endsWith('/rate-limiter')) {
      return {
        checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
        getRateLimitHeaders: () => ({ 'X-RateLimit-Remaining': '99' }),
        getClientIP: () => '203.0.113.10',
      }
    }

    if (request.endsWith('/security-logger')) {
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

    if (request.endsWith('/shipping-calculator.cjs')) {
      return {
        calculateShipping: async () => ({ cost: 0 }),
        parseProducts: () => ({}),
      }
    }

    if (request.endsWith('/input-sanitizer')) {
      return {
        sanitizeFormData: (data) => ({ ...data }),
      }
    }

    if (request.endsWith('/cors-config')) {
      return {
        getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
      }
    }

    if (request.endsWith('/request-fingerprint')) {
      return {
        validateRequestFingerprint: () => ({ isBot: false }),
      }
    }

    if (request.endsWith('/ip-reputation')) {
      return {
        validateIP: async () => ({ allowed: true }),
        addToBlacklist: async () => {},
      }
    }

    if (request.endsWith('/behavioral-analysis')) {
      return {
        validateSubmissionBehavior: async () => ({ allowed: true }),
      }
    }

    if (request.endsWith('/email-domain-validator')) {
      return {
        validateEmailDomain: async () => ({ valid: true }),
      }
    }

    if (request.endsWith('/blobs-store')) {
      return {
        initBlobsStores: () => {},
        getUnsubscribeStore: () => null,
      }
    }

    if (request.endsWith('/csrf-validator')) {
      return {
        validateCSRFToken: async () => ({ valid: true }),
      }
    }

    if (request.endsWith('/ghl-client')) {
      return {
        submitForm: async () => {
          if (mocks.ghlFails) throw Object.assign(new Error('GHL unavailable'), { status: 503 })
          return { contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] }
        },
      }
    }

    return originalLoad.apply(this, arguments)
  }

  try {
    return require(filePath).handler
  } finally {
    Module._load = originalLoad
  }
}

async function post(handler, body, headers = {}) {
  return handler({
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      ...headers,
    },
    path: '/.netlify/functions/validate-form-submission',
    body,
  }, {})
}

async function assertPurchasingDisabled(fileName) {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  const handler = loadHandler(fileName)
  const response = await post(handler, JSON.stringify({
    product: 'mini',
    quantity: 1,
    priceId: 'price_test',
    shippingAddress: {
      line1: '123 Main St',
      city: 'Tampa',
      state: 'FL',
      zip: '33602',
      country: 'US',
      email: 'buyer@example.com',
    },
    paymentIntentId: 'pi_test',
  }))

  assert.strictEqual(response.statusCode, 503, `${fileName} should default closed when purchasing is disabled`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function testPurchasingGuard() {
  await assertPurchasingDisabled('get-price-id.js')
  await assertPurchasingDisabled('create-checkout.js')
  await assertPurchasingDisabled('create-payment-intent.js')
  await assertPurchasingDisabled('update-payment-intent.js')
}

async function testMiniPinsToListPriceForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_list'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_contractor'

  const handler = loadHandler('get-price-id.js')
  const response = await post(handler, JSON.stringify({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }))

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.body)
  assert.strictEqual(body.priceId, 'price_mini_list')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.unitPrice, 49.99)
}

async function testFormGhlFailureReturns502() {
  const handler = loadHandler('validate-form-submission.js', { ghlFails: true })
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ava',
    lastName: 'Example',
    email: 'ava@example.com',
    message: 'Need help with an installation.',
    consent: 'yes',
    'form-load-time': '10000',
  }).toString()

  const response = await post(handler, body)
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function testUnsubscribeGhlFailureReturns502() {
  const handler = loadHandler('validate-unsubscribe.js', { ghlFails: true })
  const body = new URLSearchParams({
    email: 'ava@example.com',
    reason: 'not-relevant',
    'csrf-token': 'token',
  }).toString()

  const response = await post(handler, body, { referer: 'https://www.acdrainwiz.com/unsubscribe' })
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function main() {
  await testPurchasingGuard()
  await testMiniPinsToListPriceForContractors()
  await testFormGhlFailureReturns502()
  await testUnsubscribeGhlFailureReturns502()
  console.log('Critical regression tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
