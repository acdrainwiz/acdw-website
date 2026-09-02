const assert = require('assert')
const path = require('path')

const FUNCTIONS_DIR = __dirname

function modulePath(relativePath) {
  return path.join(FUNCTIONS_DIR, relativePath)
}

function setMock(relativePath, exportsValue) {
  const resolved = require.resolve(modulePath(relativePath))
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: exportsValue,
  }
}

function clearFunction(relativePath) {
  delete require.cache[require.resolve(modulePath(relativePath))]
}

function mockCommonUtilities({ ghlSubmitForm } = {}) {
  setMock('utils/rate-limiter.js', {
    checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
  })
  setMock('utils/security-logger.js', {
    logAPIAccess: () => {},
    logRateLimit: () => {},
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  })
  setMock('utils/cors-config.js', {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
  })
  setMock('utils/input-sanitizer.js', {
    sanitizeFormData: (data) => data,
    detectInjection: () => ({ detected: false }),
  })
  setMock('utils/request-fingerprint.js', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  setMock('utils/ip-reputation.js', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  setMock('utils/behavioral-analysis.js', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  setMock('utils/email-domain-validator.js', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  setMock('utils/blobs-store.js', {
    initBlobsStores: () => ({ initialized: true }),
    getUnsubscribeStore: () => ({ set: async () => {} }),
    getCsrfTokenStore: () => ({
      get: async () => ({
        used: false,
        createdAt: Date.now(),
        expires: Date.now() + 60_000,
      }),
      set: async () => {},
      delete: async () => {},
    }),
    isBlobsAvailable: () => true,
  })
  setMock('utils/ghl-client.js', {
    submitForm: ghlSubmitForm || (async () => ({ contactId: 'contact_123', isNew: false, traceId: 'trace_123', warnings: [] })),
  })
}

function mockStripe() {
  const resolved = require.resolve('stripe')
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: () => ({
      prices: {
        retrieve: async (priceId) => ({
          id: priceId,
          unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999,
          currency: 'usd',
        }),
      },
    }),
  }
}

function postEvent(body, headers = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0 regression-test',
      origin: 'https://www.acdrainwiz.com',
      'content-type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    path: '/.netlify/functions/validate-form-submission',
    body,
  }
}

async function expectPurchasingDisabled(relativePath) {
  clearFunction(relativePath)
  const { handler } = require(modulePath(relativePath))
  const result = await handler(postEvent('{}'), {})
  const body = JSON.parse(result.body)
  assert.strictEqual(result.statusCode, 503, `${relativePath} should be disabled`)
  assert.strictEqual(body.purchasingEnabled, false)
}

async function testPurchasingKillSwitch() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  mockCommonUtilities()
  mockStripe()

  await expectPurchasingDisabled('get-price-id.js')
  await expectPurchasingDisabled('create-checkout.js')
  await expectPurchasingDisabled('create-payment-intent.js')
  await expectPurchasingDisabled('update-payment-intent.js')
}

async function testMiniContractorUsesListPrice() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  mockCommonUtilities()
  mockStripe()
  clearFunction('get-price-id.js')

  const { handler } = require(modulePath('get-price-id.js'))
  const result = await handler(
    postEvent(JSON.stringify({ product: 'mini', quantity: 600, role: 'hvac_pro' }), {
      'content-type': 'application/json',
    }),
    {}
  )
  const body = JSON.parse(result.body)

  assert.strictEqual(result.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.role, 'hvac_pro')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.unitPrice, 49.99)
}

async function testFormGhlFailureReturns502() {
  mockCommonUtilities({
    ghlSubmitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })
  clearFunction('validate-form-submission.js')

  const { handler } = require(modulePath('validate-form-submission.js'))
  const formData = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
  })
  const result = await handler(postEvent(formData.toString()), {})
  const body = JSON.parse(result.body)

  assert.strictEqual(result.statusCode, 502)
  assert.strictEqual(body.success, false)
}

async function testUnsubscribeGuards() {
  mockCommonUtilities({
    ghlSubmitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })
  clearFunction('validate-unsubscribe.js')

  const { handler } = require(modulePath('validate-unsubscribe.js'))

  const missingCsrf = await handler(
    postEvent(new URLSearchParams({ email: 'ada@example.com' }).toString(), {
      'content-type': 'application/x-www-form-urlencoded',
    }),
    {}
  )
  assert.strictEqual(missingCsrf.statusCode, 400)

  const validData = new URLSearchParams({
    email: 'ada@example.com',
    reason: 'not-relevant',
    'csrf-token': 'csrf_valid_token',
  })
  const ghlFailure = await handler(postEvent(validData.toString()), {})
  const body = JSON.parse(ghlFailure.body)
  assert.strictEqual(ghlFailure.statusCode, 502)
  assert.strictEqual(body.success, false)
}

async function run() {
  await testPurchasingKillSwitch()
  await testMiniContractorUsesListPrice()
  await testFormGhlFailureReturns502()
  await testUnsubscribeGuards()
  console.log('critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
