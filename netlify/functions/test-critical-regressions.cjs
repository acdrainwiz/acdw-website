const assert = require('assert')
const fs = require('fs')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

const mockState = {
  stripePrice: { unit_amount: 4999, currency: 'usd' },
  ghlSubmitForm: async () => ({ contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] }),
  csrfValidation: async () => ({ valid: true }),
  ghlCalls: 0,
}

function installMocks() {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async () => mockState.stripePrice,
        },
        paymentIntents: {
          retrieve: async () => ({ id: 'pi_123' }),
          update: async () => ({ id: 'pi_123', amount: 4999 }),
          create: async () => ({ id: 'pi_123', client_secret: 'secret' }),
        },
        tax: {
          calculations: {
            create: async () => ({ tax_amount_exclusive: 0, tax_breakdown: [] }),
          },
        },
        checkout: {
          sessions: {
            create: async () => ({ id: 'cs_123', url: 'https://checkout.example/session' }),
          },
        },
      })
    }

    if (request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99 }),
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

    if (request === './utils/shipping-calculator.cjs') {
      return {
        calculateShipping: async () => ({ cost: 0 }),
        parseProducts: () => ({}),
      }
    }

    if (request === './utils/input-sanitizer') {
      return {
        sanitizeFormData: (data) => ({ ...data }),
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
        getUnsubscribeStore: () => null,
      }
    }

    if (request === './utils/ghl-client') {
      return {
        submitForm: async (...args) => {
          mockState.ghlCalls += 1
          return mockState.ghlSubmitForm(...args)
        },
      }
    }

    if (request === './utils/csrf-validator') {
      return {
        validateCSRFToken: (...args) => mockState.csrfValidation(...args),
      }
    }

    return originalLoad(request, parent, isMain)
  }
}

function loadFunction(fileName) {
  const filePath = path.join(functionsDir, fileName)
  delete require.cache[filePath]

  const mod = new Module(filePath, module)
  mod.filename = filePath
  mod.paths = Module._nodeModulePaths(path.dirname(filePath))
  require.cache[filePath] = mod
  mod._compile(fs.readFileSync(filePath, 'utf8'), filePath)
  return mod.exports
}

function postEvent(body, headers = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      'content-type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    path: '/.netlify/functions/test',
    body,
  }
}

async function testPurchasingDisabled() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  for (const fileName of [
    'get-price-id.js',
    'create-checkout.js',
    'create-payment-intent.js',
    'update-payment-intent.js',
  ]) {
    const { handler } = loadFunction(fileName)
    const response = await handler(postEvent('{}'), {})
    assert.strictEqual(response.statusCode, 503, `${fileName} must fail closed while purchasing is disabled`)
    assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
  }
}

async function testMiniUsesListPriceForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'

  const { handler } = loadFunction('get-price-id.js')
  const response = await handler(
    postEvent(JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }), {
      'content-type': 'application/json',
    }),
    {}
  )
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.role, 'hvac_pro')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.quantity, 600)
}

async function testFormGhlFailureReturns502() {
  mockState.ghlSubmitForm = async () => {
    throw new Error('GHL unavailable')
  }

  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact',
    firstName: 'Alex',
    lastName: 'Tester',
    email: 'alex@example.com',
    message: 'Please contact me.',
    consent: 'yes',
  }).toString()

  const { handler } = loadFunction('validate-form-submission.js')
  const response = await handler(postEvent(body), {})
  const payload = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(payload.success, false)
}

async function testInvalidUnsubscribeCsrfBlocksGhl() {
  mockState.ghlCalls = 0
  mockState.csrfValidation = async () => ({
    valid: false,
    reason: 'Invalid CSRF token',
    details: { message: 'Security token is invalid or expired' },
  })
  mockState.ghlSubmitForm = async () => {
    throw new Error('GHL should not be called')
  }

  const { handler } = loadFunction('validate-unsubscribe.js')
  const response = await handler(
    postEvent(new URLSearchParams({
      email: 'alex@example.com',
      reason: 'spam',
      'csrf-token': 'bad-token',
    }).toString()),
    {}
  )

  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(mockState.ghlCalls, 0)
}

async function testUnsubscribeGhlFailureReturns502() {
  mockState.csrfValidation = async () => ({ valid: true })
  mockState.ghlSubmitForm = async () => {
    throw new Error('GHL unavailable')
  }

  const { handler } = loadFunction('validate-unsubscribe.js')
  const response = await handler(
    postEvent(new URLSearchParams({
      email: 'alex@example.com',
      reason: 'spam',
      'csrf-token': 'valid-token',
    }).toString()),
    {}
  )
  const payload = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(payload.success, false)
}

async function main() {
  installMocks()
  process.env.RECAPTCHA_SECRET_KEY = ''

  await testPurchasingDisabled()
  await testMiniUsesListPriceForContractors()
  await testFormGhlFailureReturns502()
  await testInvalidUnsubscribeCsrfBlocksGhl()
  await testUnsubscribeGhlFailureReturns502()

  Module._load = originalLoad
  console.log('critical regression tests passed')
}

main().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
