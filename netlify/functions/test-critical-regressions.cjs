const assert = require('assert')
const Module = require('module')
const path = require('path')

const repoRoot = path.resolve(__dirname, '../..')
const originalLoad = Module._load

let ghlShouldFail = false

const noOpLogger = new Proxy({ EVENT_TYPES: {} }, {
  get(target, prop) {
    return prop in target ? target[prop] : () => {}
  },
})

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => ({
          id: priceId,
          unit_amount: priceId.includes('mini') ? 4999 : 6999,
          currency: 'usd',
        }),
      },
      checkout: {
        sessions: {
          create: async () => ({ id: 'cs_test_123', url: 'https://checkout.stripe.test/session' }),
        },
      },
      paymentIntents: {
        create: async () => ({ id: 'pi_test_123', client_secret: 'pi_secret' }),
        retrieve: async () => ({ id: 'pi_test_123', metadata: {} }),
        update: async () => ({ id: 'pi_test_123', client_secret: 'pi_secret_updated' }),
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
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    }
  }
  if (request.endsWith('/utils/security-logger') || request === './utils/security-logger') return noOpLogger
  if (request.endsWith('/utils/shipping-calculator.cjs') || request === './utils/shipping-calculator.cjs') {
    return { calculateShipping: async () => ({ cost: 10 }), parseProducts: () => ({}) }
  }
  if (request.endsWith('/utils/input-sanitizer') || request === './utils/input-sanitizer') {
    return { sanitizeFormData: (data) => data }
  }
  if (request.endsWith('/utils/cors-config') || request === './utils/cors-config') {
    return { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }
  }
  if (request.endsWith('/utils/request-fingerprint') || request === './utils/request-fingerprint') {
    return { validateRequestFingerprint: () => ({ isBot: false }) }
  }
  if (request.endsWith('/utils/ip-reputation') || request === './utils/ip-reputation') {
    return { validateIP: async () => ({ allowed: true }), addToBlacklist: async () => {} }
  }
  if (request.endsWith('/utils/behavioral-analysis') || request === './utils/behavioral-analysis') {
    return { validateSubmissionBehavior: async () => ({ allowed: true }) }
  }
  if (request.endsWith('/utils/email-domain-validator') || request === './utils/email-domain-validator') {
    return { validateEmailDomain: async () => ({ valid: true }) }
  }
  if (request.endsWith('/utils/blobs-store') || request === './utils/blobs-store') {
    return { initBlobsStores: () => {}, getUnsubscribeStore: () => ({ set: async () => {} }) }
  }
  if (request.endsWith('/utils/csrf-validator') || request === './utils/csrf-validator') {
    return { validateCSRFToken: async () => ({ valid: true }) }
  }
  if (request.endsWith('/utils/ghl-client') || request === './utils/ghl-client') {
    return {
      submitForm: async () => {
        if (ghlShouldFail) throw Object.assign(new Error('GHL unavailable'), { status: 503, traceId: 'trace-test' })
        return { contactId: 'contact-test', isNew: true, traceId: 'trace-test', warnings: [] }
      },
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

function loadFunction(relativePath) {
  const fullPath = path.join(repoRoot, relativePath)
  delete require.cache[require.resolve(fullPath)]
  return require(fullPath)
}

function postEvent(body, extra = {}) {
  return {
    httpMethod: 'POST',
    path: extra.path || '/.netlify/functions/test',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0 regression-test',
      'content-type': 'application/x-www-form-urlencoded',
      ...extra.headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }
}

async function expectPurchasingDisabled(relativePath, body) {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  const { handler } = loadFunction(relativePath)
  const response = await handler(postEvent(body), {})
  assert.strictEqual(response.statusCode, 503, `${relativePath} should default closed when purchasing is disabled`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function run() {
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

  await expectPurchasingDisabled('netlify/functions/get-price-id.js', { product: 'mini', quantity: 1 })
  await expectPurchasingDisabled('netlify/functions/create-checkout.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    isGuest: true,
    shippingAddress: { state: 'FL', country: 'US' },
  })
  await expectPurchasingDisabled('netlify/functions/create-payment-intent.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: { line1: '1 Main', city: 'Boca Raton', state: 'FL', zip: '33431', country: 'US', email: 'buyer@example.com' },
  })
  await expectPurchasingDisabled('netlify/functions/update-payment-intent.js', {
    paymentIntentId: 'pi_test_123',
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: { line1: '1 Main', city: 'Boca Raton', state: 'FL', zip: '33431', country: 'US', email: 'buyer@example.com' },
  })

  process.env.PURCHASING_ENABLED = 'true'
  let { handler: priceHandler } = loadFunction('netlify/functions/get-price-id.js')
  let response = await priceHandler(postEvent({ product: 'mini', quantity: 600, role: 'hvac_pro' }), {})
  assert.strictEqual(response.statusCode, 200)
  let payload = JSON.parse(response.body)
  assert.strictEqual(payload.priceId, 'price_mini_homeowner')
  assert.strictEqual(payload.tier, 'msrp')
  assert.strictEqual(payload.unitPrice, 49.99)

  response = await priceHandler(postEvent({ product: 'sensor', quantity: 600, role: 'hvac_pro' }), {})
  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(JSON.parse(response.body).requiresContact, true)

  ghlShouldFail = true
  const formBody = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
  }).toString()
  const { handler: formHandler } = loadFunction('netlify/functions/validate-form-submission.js')
  response = await formHandler(postEvent(formBody, { path: '/.netlify/functions/validate-form-submission' }), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)

  const unsubscribeBody = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    'csrf-token': 'valid-token',
  }).toString()
  const { handler: unsubscribeHandler } = loadFunction('netlify/functions/validate-unsubscribe.js')
  response = await unsubscribeHandler(postEvent(unsubscribeBody, { path: '/.netlify/functions/validate-unsubscribe' }), {})
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)

  console.log('critical regression tests passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => {
    Module._load = originalLoad
  })
