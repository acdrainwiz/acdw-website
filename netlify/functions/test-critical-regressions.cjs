const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname

function clearFunctionCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(functionsDir)) {
      delete require.cache[key]
    }
  }
}

async function withEnv(updates, callback) {
  const previous = {}
  for (const key of Object.keys(updates)) {
    previous[key] = process.env[key]
    if (updates[key] === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = updates[key]
    }
  }

  try {
    return await callback()
  } finally {
    for (const key of Object.keys(updates)) {
      if (previous[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = previous[key]
      }
    }
  }
}

async function withMocks(mocks, callback) {
  const originalLoad = Module._load
  Module._load = function patchedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return originalLoad.call(this, request, parent, isMain)
  }

  try {
    clearFunctionCache()
    return await callback()
  } finally {
    Module._load = originalLoad
    clearFunctionCache()
  }
}

const allowedRateLimit = {
  allowed: true,
  limit: 100,
  remaining: 99,
  resetTime: Date.now() + 60000,
}

const noopSecurityLogger = {
  logAPIAccess() {},
  logRateLimit() {},
  logFormSubmission() {},
  logBotDetected() {},
  logRecaptcha() {},
  logInjectionAttempt() {},
  EVENT_TYPES: {},
}

const commonMocks = {
  stripe: () => ({
    prices: {
      retrieve: async (priceId) => ({
        id: priceId,
        unit_amount: 4999,
        currency: 'usd',
      }),
    },
    checkout: {
      sessions: {
        create: async () => {
          throw new Error('checkout should not be reached while purchasing is disabled')
        },
      },
    },
    paymentIntents: {
      create: async () => {
        throw new Error('payment intent should not be reached while purchasing is disabled')
      },
      retrieve: async () => {
        throw new Error('payment intent retrieval should not be reached while purchasing is disabled')
      },
      update: async () => {
        throw new Error('payment intent update should not be reached while purchasing is disabled')
      },
    },
    tax: {
      calculations: {
        create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
      },
    },
  }),
  './utils/rate-limiter': {
    checkRateLimit: async () => allowedRateLimit,
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
  },
  './utils/security-logger': noopSecurityLogger,
  './utils/shipping-calculator.cjs': {
    calculateShipping: async () => ({ cost: 15 }),
    parseProducts: (products) => products,
  },
}

async function invoke(functionFile, event) {
  const { handler } = require(path.join(functionsDir, functionFile))
  return handler({
    httpMethod: 'POST',
    headers: { 'user-agent': 'Mozilla/5.0', origin: 'https://www.acdrainwiz.com' },
    body: '{}',
    path: `/.netlify/functions/${functionFile.replace(/\.js$/, '')}`,
    ...event,
  }, {})
}

async function testPurchasingApisDefaultClosed() {
  await withEnv({ PURCHASING_ENABLED: undefined, VITE_PURCHASING_ENABLED: undefined }, async () => {
    await withMocks(commonMocks, async () => {
      for (const functionFile of [
        'get-price-id.js',
        'create-checkout.js',
        'create-payment-intent.js',
        'update-payment-intent.js',
      ]) {
        const response = await invoke(functionFile)
        assert.strictEqual(response.statusCode, 503, `${functionFile} should be unavailable when purchasing is disabled`)
        assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
      }
    })
  })
}

async function testMiniUsesListPriceForContractorRoles() {
  await withEnv({
    PURCHASING_ENABLED: 'true',
    STRIPE_PRICE_MINI_HOMEOWNER: 'price_mini_homeowner',
    STRIPE_PRICE_MINI_HVAC_T3: 'price_wrong_contractor_mini',
  }, async () => {
    await withMocks(commonMocks, async () => {
      const response = await invoke('get-price-id.js', {
        body: JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }),
      })
      const body = JSON.parse(response.body)

      assert.strictEqual(response.statusCode, 200)
      assert.strictEqual(body.priceId, 'price_mini_homeowner')
      assert.strictEqual(body.tier, 'msrp')
      assert.strictEqual(body.quantity, 600)
    })
  })
}

async function testSensorStillRequiresContactSalesAboveTierCap() {
  await withEnv({ PURCHASING_ENABLED: 'true' }, async () => {
    await withMocks(commonMocks, async () => {
      const response = await invoke('get-price-id.js', {
        body: JSON.stringify({ product: 'sensor', quantity: 501, role: 'hvac_pro' }),
      })
      const body = JSON.parse(response.body)

      assert.strictEqual(response.statusCode, 400)
      assert.strictEqual(body.requiresContact, true)
    })
  })
}

async function testValidatedContactFormFailsWhenCrmDeliveryFails() {
  await withMocks({
    ...commonMocks,
    './utils/input-sanitizer': { sanitizeFormData: (data) => data },
    './utils/cors-config': { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) },
    './utils/request-fingerprint': { validateRequestFingerprint: () => ({ isBot: false }) },
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
      initBlobsStores: () => {},
    },
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('simulated CRM outage')
      },
    },
  }, async () => {
    const body = new URLSearchParams({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      message: 'Please contact me.',
      consent: 'yes',
    }).toString()

    const response = await invoke('validate-form-submission.js', { body })
    const parsed = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(parsed.success, false)
  })
}

async function testValidatedUnsubscribeFailsWhenCrmDeliveryFails() {
  await withMocks({
    ...commonMocks,
    './utils/input-sanitizer': { sanitizeFormData: (data) => data },
    './utils/cors-config': { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) },
    './utils/request-fingerprint': { validateRequestFingerprint: () => ({ isBot: false }) },
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
      initBlobsStores: () => {},
      getUnsubscribeStore: () => ({ set: async () => {} }),
    },
    './utils/csrf-validator': {
      validateCSRFToken: async () => ({ valid: true }),
    },
    './utils/ghl-client': {
      submitForm: async () => {
        throw new Error('simulated CRM outage')
      },
    },
  }, async () => {
    const body = new URLSearchParams({
      email: 'ada@example.com',
      reason: 'too-many-emails',
      feedback: 'Please stop.',
      'csrf-token': 'valid-token',
    }).toString()

    const response = await invoke('validate-unsubscribe.js', { body })
    const parsed = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(parsed.success, false)
  })
}

async function main() {
  await testPurchasingApisDefaultClosed()
  await testMiniUsesListPriceForContractorRoles()
  await testSensorStillRequiresContactSalesAboveTierCap()
  await testValidatedContactFormFailsWhenCrmDeliveryFails()
  await testValidatedUnsubscribeFailsWhenCrmDeliveryFails()
  console.log('Critical regression tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
