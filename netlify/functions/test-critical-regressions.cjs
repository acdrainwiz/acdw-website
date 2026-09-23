const assert = require('assert')
const Module = require('module')
const path = require('path')

const ROOT = path.resolve(__dirname)
const originalLoad = Module._load

function installMocks({ ghlShouldFail = false } = {}) {
  Module._load = function mockedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => ({
            id: priceId,
            unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999,
            currency: 'usd',
          }),
        },
        checkout: {
          sessions: {
            create: async () => ({ id: 'cs_test', url: 'https://stripe.test/session' }),
          },
        },
        paymentIntents: {
          retrieve: async () => ({ id: 'pi_test', metadata: {}, client_secret: 'secret' }),
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

    if (request.endsWith('/utils/rate-limiter') || request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99 }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '127.0.0.1',
      }
    }

    if (request.endsWith('/utils/security-logger') || request === './utils/security-logger') {
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

    if (request.endsWith('/utils/shipping-calculator.cjs') || request === './utils/shipping-calculator.cjs') {
      return {
        calculateShipping: async () => ({ cost: 15 }),
        parseProducts: () => ({}),
      }
    }

    if (request.endsWith('/utils/input-sanitizer') || request === './utils/input-sanitizer') {
      return {
        sanitizeFormData: (data) => data,
      }
    }

    if (request.endsWith('/utils/cors-config') || request === './utils/cors-config') {
      return {
        getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
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
        getUnsubscribeStore: () => ({ set: async () => {} }),
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
          if (ghlShouldFail) {
            throw new Error('simulated GHL outage')
          }
          return { contactId: 'contact_123', isNew: false, traceId: 'trace', warnings: [] }
        },
      }
    }

    return originalLoad.apply(this, arguments)
  }
}

function restoreMocks() {
  Module._load = originalLoad
}

function clearFunction(name) {
  delete require.cache[require.resolve(path.join(ROOT, name))]
}

function postEvent(body, pathName = '/.netlify/functions/test') {
  return {
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/support',
      'user-agent': 'Mozilla/5.0',
      'content-type': 'application/x-www-form-urlencoded',
    },
    path: pathName,
    body,
  }
}

async function testPurchasingGuardDefaultsClosed() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'

  installMocks()
  try {
    for (const functionName of [
      'get-price-id.js',
      'create-checkout.js',
      'create-payment-intent.js',
      'update-payment-intent.js',
    ]) {
      clearFunction(functionName)
      const { handler } = require(path.join(ROOT, functionName))
      const result = await handler(postEvent(JSON.stringify({ product: 'mini', quantity: 1 })), {})
      assert.strictEqual(result.statusCode, 503, `${functionName} should default closed when purchasing is disabled`)
      assert.strictEqual(JSON.parse(result.body).purchasingDisabled, true)
    }
  } finally {
    restoreMocks()
  }
}

async function testMiniAlwaysUsesListPrice() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'

  installMocks()
  try {
    clearFunction('get-price-id.js')
    const { handler } = require(path.join(ROOT, 'get-price-id.js'))
    const result = await handler(
      postEvent(JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }), '/.netlify/functions/get-price-id'),
      {},
    )

    assert.strictEqual(result.statusCode, 200)
    const body = JSON.parse(result.body)
    assert.strictEqual(body.priceId, 'price_mini_homeowner')
    assert.strictEqual(body.tier, 'msrp')
    assert.strictEqual(body.unitPrice, 49.99)
  } finally {
    restoreMocks()
  }
}

async function testGhlFailuresAreNotReportedAsSuccess() {
  delete process.env.RECAPTCHA_SECRET_KEY
  installMocks({ ghlShouldFail: true })
  try {
    clearFunction('validate-form-submission.js')
    const { handler: formHandler } = require(path.join(ROOT, 'validate-form-submission.js'))
    const formBody = new URLSearchParams({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      message: 'Please contact me.',
      consent: 'yes',
    }).toString()
    const formResult = await formHandler(postEvent(formBody, '/.netlify/functions/validate-form-submission'), {})
    assert.strictEqual(formResult.statusCode, 502)
    assert.strictEqual(JSON.parse(formResult.body).success, false)

    clearFunction('validate-unsubscribe.js')
    const { handler: unsubscribeHandler } = require(path.join(ROOT, 'validate-unsubscribe.js'))
    const unsubscribeBody = new URLSearchParams({
      email: 'ada@example.com',
      reason: 'too-many-emails',
      'csrf-token': 'token',
    }).toString()
    const unsubscribeResult = await unsubscribeHandler(
      postEvent(unsubscribeBody, '/.netlify/functions/validate-unsubscribe'),
      {},
    )
    assert.strictEqual(unsubscribeResult.statusCode, 502)
    assert.strictEqual(JSON.parse(unsubscribeResult.body).success, false)
  } finally {
    restoreMocks()
  }
}

async function main() {
  await testPurchasingGuardDefaultsClosed()
  await testMiniAlwaysUsesListPrice()
  await testGhlFailuresAreNotReportedAsSuccess()
  console.log('critical regression tests passed')
}

main().catch((error) => {
  restoreMocks()
  console.error(error)
  process.exit(1)
})
