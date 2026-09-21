const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

function functionPath(file) {
  return path.join(functionsDir, file)
}

function clearFunction(file) {
  delete require.cache[require.resolve(functionPath(file))]
}

function stubModule(relativePath, exports) {
  const resolved = require.resolve(path.join(functionsDir, relativePath))
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  }
}

function installSharedStubs({ ghlSubmitForm } = {}) {
  stubModule('./utils/rate-limiter', {
    checkRateLimit: async () => ({ allowed: true, remaining: 29, limit: 30, resetTime: Date.now() + 60000, retryAfter: 0 }),
    getRateLimitHeaders: () => ({ 'X-RateLimit-Limit': '30' }),
    getClientIP: () => '203.0.113.10',
  })
  stubModule('./utils/security-logger', {
    EVENT_TYPES: {},
    logAPIAccess: () => {},
    logRateLimit: () => {},
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logInjectionAttempt: () => {},
  })
  stubModule('./utils/input-sanitizer', {
    sanitizeFormData: (data) => ({ ...data }),
  })
  stubModule('./utils/cors-config', {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
  })
  stubModule('./utils/request-fingerprint', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  stubModule('./utils/ip-reputation', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  stubModule('./utils/behavioral-analysis', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  stubModule('./utils/email-domain-validator', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  stubModule('./utils/blobs-store', {
    initBlobsStores: () => {},
    getUnsubscribeStore: () => ({ set: async () => {} }),
  })
  stubModule('./utils/csrf-validator', {
    validateCSRFToken: async () => ({ valid: true }),
  })
  stubModule('./utils/ghl-client', {
    submitForm: ghlSubmitForm || (async () => ({ contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] })),
  })
}

function installStripeStub() {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => ({
            id: priceId,
            unit_amount: priceId === 'price_mini_msrp' ? 4999 : 9999,
            currency: 'usd',
          }),
        },
        paymentIntents: {
          retrieve: async () => ({ metadata: {} }),
          create: async () => ({ id: 'pi_123', client_secret: 'secret_123', amount: 1 }),
          update: async () => ({ id: 'pi_123', client_secret: 'secret_123', amount: 1 }),
        },
        tax: {
          calculations: {
            create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
          },
        },
        checkout: {
          sessions: {
            create: async () => ({ id: 'cs_123', url: 'https://checkout.stripe.test/session' }),
          },
        },
      })
    }
    return originalLoad(request, parent, isMain)
  }
}

function restoreStripeStub() {
  Module._load = originalLoad
}

function postEvent(body = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 regression-test',
    },
    path: '/.netlify/functions/validate-form-submission',
    body: new URLSearchParams(body).toString(),
  }
}

function jsonPostEvent(body = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/cart',
      'user-agent': 'Mozilla/5.0 regression-test',
      'content-type': 'application/json',
    },
    path: '/.netlify/functions/get-price-id',
    body: JSON.stringify(body),
  }
}

async function expectPurchasingDisabled(functionFile, body) {
  clearFunction(functionFile)
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  const { handler } = require(functionPath(functionFile))
  const response = await handler(jsonPostEvent(body), {})
  assert.strictEqual(response.statusCode, 503, `${functionFile} must fail closed when purchasing is disabled`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function testPaymentGuardsAndMiniPricing() {
  installSharedStubs()
  installStripeStub()
  try {
    await expectPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: '1' })
    await expectPurchasingDisabled('create-checkout.js', { priceId: 'price_123', product: 'mini', quantity: '1' })
    await expectPurchasingDisabled('create-payment-intent.js', { priceId: 'price_123', product: 'mini', quantity: '1' })
    await expectPurchasingDisabled('update-payment-intent.js', { paymentIntentId: 'pi_123', priceId: 'price_123', product: 'mini', quantity: '1' })

    process.env.PURCHASING_ENABLED = 'true'
    process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_msrp'
    clearFunction('get-price-id.js')
    const { handler } = require(functionPath('get-price-id.js'))
    const response = await handler(jsonPostEvent({ product: 'mini', quantity: '600', role: 'hvac_pro' }), {})
    assert.strictEqual(response.statusCode, 200, 'Mini checkout must allow contractor quantities above 500 at list price')
    const payload = JSON.parse(response.body)
    assert.strictEqual(payload.priceId, 'price_mini_msrp')
    assert.strictEqual(payload.tier, 'msrp')
  } finally {
    restoreStripeStub()
    delete process.env.PURCHASING_ENABLED
    delete process.env.STRIPE_PRICE_MINI_HOMEOWNER
  }
}

async function testFormGhlFailure() {
  installSharedStubs({
    ghlSubmitForm: async () => {
      const error = new Error('GHL unavailable')
      error.status = 503
      throw error
    },
  })
  clearFunction('validate-form-submission.js')
  const { handler } = require(functionPath('validate-form-submission.js'))
  const response = await handler(postEvent({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 10000),
  }), {})
  assert.strictEqual(response.statusCode, 502, 'Contact forms must not return success when GHL delivery fails')
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function testUnsubscribeGhlFailure() {
  installSharedStubs({
    ghlSubmitForm: async () => {
      const error = new Error('GHL unavailable')
      error.status = 503
      throw error
    },
  })
  clearFunction('validate-unsubscribe.js')
  const { handler } = require(functionPath('validate-unsubscribe.js'))
  const response = await handler(postEvent({
    email: 'customer@example.com',
    reason: 'not-relevant',
    'csrf-token': 'token_123',
  }), {})
  assert.strictEqual(response.statusCode, 502, 'Unsubscribe must not return success when GHL opt-out delivery fails')
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function main() {
  await testPaymentGuardsAndMiniPricing()
  await testFormGhlFailure()
  await testUnsubscribeGhlFailure()
  console.log('Critical regression tests passed')
}

main().catch((error) => {
  restoreStripeStub()
  console.error(error)
  process.exit(1)
})
