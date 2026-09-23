const assert = require('assert')
const Module = require('module')
const path = require('path')

const originalLoad = Module._load

let submitFormImpl = async () => ({ contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] })

const noopLogger = () => {}
const rateLimitResult = {
  allowed: true,
  remaining: 9,
  limit: 10,
  resetTime: Date.now() + 60000,
  retryAfter: 0,
}

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => ({
          id: priceId,
          unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 10000,
          currency: 'usd',
        }),
      },
      checkout: {
        sessions: {
          create: async () => ({ id: 'cs_test_123', url: 'https://checkout.stripe.test/session' }),
        },
      },
      paymentIntents: {
        create: async () => ({ id: 'pi_test_123', client_secret: 'pi_test_123_secret' }),
        retrieve: async () => ({ id: 'pi_test_123', metadata: {} }),
        update: async () => ({ id: 'pi_test_123', client_secret: 'pi_test_123_secret' }),
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
      getStore: () => null,
    }
  }

  if (request === './utils/rate-limiter') {
    return {
      checkRateLimit: async () => rateLimitResult,
      getRateLimitHeaders: () => ({ 'X-RateLimit-Limit': '10' }),
      getClientIP: () => '203.0.113.10',
    }
  }

  if (request === './utils/security-logger') {
    return {
      logAPIAccess: noopLogger,
      logRateLimit: noopLogger,
      logFormSubmission: noopLogger,
      logBotDetected: noopLogger,
      logRecaptcha: noopLogger,
      logInjectionAttempt: noopLogger,
      EVENT_TYPES: {},
    }
  }

  if (request === './utils/shipping-calculator.cjs') {
    return {
      calculateShipping: async () => ({ cost: 15 }),
      parseProducts: (products) => products,
    }
  }

  if (request === './utils/input-sanitizer') {
    return {
      sanitizeFormData: (data) => data,
    }
  }

  if (request === './utils/cors-config') {
    return {
      getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
    }
  }

  if (request === './utils/request-fingerprint') {
    return {
      validateRequestFingerprint: () => ({ isBot: false }),
    }
  }

  if (request === './utils/ip-reputation') {
    return {
      validateIP: async () => ({ allowed: true }),
      addToBlacklist: async () => {},
    }
  }

  if (request === './utils/behavioral-analysis') {
    return {
      validateSubmissionBehavior: async () => ({ allowed: true }),
    }
  }

  if (request === './utils/email-domain-validator') {
    return {
      validateEmailDomain: async () => ({ valid: true }),
    }
  }

  if (request === './utils/blobs-store') {
    return {
      initBlobsStores: () => {},
      getUnsubscribeStore: () => ({ set: async () => {} }),
    }
  }

  if (request === './utils/csrf-validator') {
    return {
      validateCSRFToken: async () => ({ valid: true }),
    }
  }

  if (request === './utils/ghl-client') {
    return {
      submitForm: (...args) => submitFormImpl(...args),
    }
  }

  return originalLoad(request, parent, isMain)
}

function loadHandler(relativePath) {
  const absolutePath = path.join(__dirname, relativePath)
  delete require.cache[require.resolve(absolutePath)]
  return require(absolutePath).handler
}

function postEvent(body, extra = {}) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/test',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      'x-forwarded-for': '203.0.113.10',
      ...extra.headers,
    },
    body,
    ...extra,
  }
}

async function assertPurchasingDisabled(handlerPath, body) {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  const handler = loadHandler(handlerPath)
  const response = await handler(postEvent(JSON.stringify(body)), {})
  assert.strictEqual(response.statusCode, 503, `${handlerPath} should reject while purchasing is disabled`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function run() {
  await assertPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1, role: 'homeowner' })
  await assertPurchasingDisabled('create-checkout.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    isGuest: true,
    shippingAddress: { city: 'Boca Raton', state: 'FL', country: 'US' },
  })
  await assertPurchasingDisabled('create-payment-intent.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {
      line1: '1489 W. Palmetto Park Rd',
      city: 'Boca Raton',
      state: 'FL',
      zip: '33486',
      country: 'US',
      email: 'buyer@example.com',
    },
  })
  await assertPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_test_123',
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {
      line1: '1489 W. Palmetto Park Rd',
      city: 'Boca Raton',
      state: 'FL',
      zip: '33486',
      country: 'US',
      email: 'buyer@example.com',
    },
  })

  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  const getPriceId = loadHandler('get-price-id.js')
  const miniPriceResponse = await getPriceId(postEvent(JSON.stringify({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  })), {})
  assert.strictEqual(miniPriceResponse.statusCode, 200)
  const miniPriceBody = JSON.parse(miniPriceResponse.body)
  assert.strictEqual(miniPriceBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(miniPriceBody.tier, 'msrp')
  assert.strictEqual(miniPriceBody.unitPrice, 49.99)

  submitFormImpl = async () => {
    throw Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace_fail' })
  }

  const validateForm = loadHandler('validate-form-submission.js')
  const formBody = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 10000),
  }).toString()
  const formResponse = await validateForm(postEvent(formBody, {
    path: '/.netlify/functions/validate-form-submission',
  }), {})
  assert.strictEqual(formResponse.statusCode, 502)
  assert.strictEqual(JSON.parse(formResponse.body).success, false)

  const validateUnsubscribe = loadHandler('validate-unsubscribe.js')
  const unsubscribeBody = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'spam',
    'csrf-token': 'valid-csrf-token',
  }).toString()
  const unsubscribeResponse = await validateUnsubscribe(postEvent(unsubscribeBody, {
    path: '/.netlify/functions/validate-unsubscribe',
  }), {})
  assert.strictEqual(unsubscribeResponse.statusCode, 502)
  assert.strictEqual(JSON.parse(unsubscribeResponse.body).success, false)

  console.log('Critical regression tests passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
