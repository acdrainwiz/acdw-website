const assert = require('assert')
const path = require('path')
const Module = require('module')

const functionsDir = __dirname
const originalLoad = Module._load

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async () => ({ unit_amount: 4999, currency: 'usd' }),
      },
      checkout: {
        sessions: {
          create: async () => ({ id: 'cs_test', url: 'https://checkout.example/session' }),
        },
      },
      paymentIntents: {
        retrieve: async () => ({ id: 'pi_test', metadata: {} }),
        create: async () => ({
          id: 'pi_test',
          client_secret: 'pi_secret',
        }),
        update: async () => ({
          id: 'pi_test',
          client_secret: 'pi_secret_updated',
        }),
      },
      tax: {
        calculations: {
          create: async () => ({ id: 'taxcalc_test', tax_amount_exclusive: 0, tax_breakdown: [] }),
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return { getStore: () => null }
  }

  return originalLoad(request, parent, isMain)
}

function setModuleStub(relativePath, exports) {
  const filename = path.join(functionsDir, relativePath)
  require.cache[filename] = {
    id: filename,
    filename,
    loaded: true,
    exports,
  }
}

function clearFunctionModule(relativePath) {
  const filename = path.join(functionsDir, relativePath)
  delete require.cache[filename]
}

function installValidationStubs({ csrfValid = true, ghlSubmit } = {}) {
  setModuleStub('utils/request-fingerprint.js', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  setModuleStub('utils/ip-reputation.js', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  setModuleStub('utils/behavioral-analysis.js', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  setModuleStub('utils/email-domain-validator.js', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  setModuleStub('utils/blobs-store.js', {
    initBlobsStores: () => ({ initialized: false }),
    getUnsubscribeStore: () => null,
    getCsrfTokenStore: () => null,
    isBlobsAvailable: () => false,
  })
  setModuleStub('utils/csrf-validator.js', {
    validateCSRFToken: async () => (
      csrfValid
        ? { valid: true }
        : { valid: false, reason: 'Invalid CSRF token', details: { message: 'Security token is invalid or expired' } }
    ),
  })
  setModuleStub('utils/ghl-client.js', {
    submitForm: ghlSubmit || (async () => ({ contactId: 'contact_test', isNew: false, traceId: 'trace_test', warnings: [] })),
  })
}

function resetPurchasingEnv() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
}

function postEvent(body, overrides = {}) {
  return {
    httpMethod: 'POST',
    path: '/test',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      origin: 'https://www.acdrainwiz.com',
      'x-forwarded-for': '203.0.113.10',
      ...overrides.headers,
    },
    body,
    ...overrides,
  }
}

async function assertDisabledPurchasing(functionFile) {
  resetPurchasingEnv()
  clearFunctionModule(functionFile)
  const { handler } = require(path.join(functionsDir, functionFile))
  const response = await handler(postEvent('{}', {
    headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0' },
  }), {})

  assert.strictEqual(response.statusCode, 503, `${functionFile} should reject disabled purchasing`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
}

async function testPurchasingDefaultClosed() {
  await assertDisabledPurchasing('get-price-id.js')
  await assertDisabledPurchasing('create-checkout.js')
  await assertDisabledPurchasing('create-payment-intent.js')
  await assertDisabledPurchasing('update-payment-intent.js')
}

async function testMiniUsesListPriceForContractorQuantities() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'

  clearFunctionModule('get-price-id.js')
  const { handler } = require(path.join(functionsDir, 'get-price-id.js'))
  const response = await handler(postEvent(JSON.stringify({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }), {
    headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0' },
  }), {})

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.body)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.quantity, 600)
}

async function testContactFormFailsWhenGhlFails() {
  installValidationStubs({
    ghlSubmit: async () => {
      throw new Error('GHL unavailable')
    },
  })
  clearFunctionModule('validate-form-submission.js')

  const { handler } = require(path.join(functionsDir, 'validate-form-submission.js'))
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@acdrainwiz.com',
    message: 'Please contact me.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(postEvent(body), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function testUnsubscribeFailsWhenGhlFails() {
  installValidationStubs({
    csrfValid: true,
    ghlSubmit: async () => {
      throw new Error('GHL unavailable')
    },
  })
  clearFunctionModule('validate-unsubscribe.js')

  const { handler } = require(path.join(functionsDir, 'validate-unsubscribe.js'))
  const body = new URLSearchParams({
    email: 'ada@acdrainwiz.com',
    reason: 'not-relevant',
    'csrf-token': 'csrf_test',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(postEvent(body), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function testUnsubscribeRejectsInvalidCsrf() {
  installValidationStubs({ csrfValid: false })
  clearFunctionModule('validate-unsubscribe.js')

  const { handler } = require(path.join(functionsDir, 'validate-unsubscribe.js'))
  const body = new URLSearchParams({
    email: 'ada@acdrainwiz.com',
    reason: 'not-relevant',
    'csrf-token': 'bad_csrf',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(postEvent(body), {})

  assert.strictEqual(response.statusCode, 400)
  assert.match(JSON.parse(response.body).error, /CSRF/i)
}

async function main() {
  await testPurchasingDefaultClosed()
  await testMiniUsesListPriceForContractorQuantities()
  await testContactFormFailsWhenGhlFails()
  await testUnsubscribeFailsWhenGhlFails()
  await testUnsubscribeRejectsInvalidCsrf()
  console.log('Critical regression tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
}).finally(() => {
  Module._load = originalLoad
})
