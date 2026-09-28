const assert = require('assert')

function mockModule(modulePath, exports) {
  require.cache[require.resolve(modulePath)] = {
    id: require.resolve(modulePath),
    filename: require.resolve(modulePath),
    loaded: true,
    exports,
  }
}

function clearModule(modulePath) {
  delete require.cache[require.resolve(modulePath)]
}

function installCommonMocks({ ghlSubmitForm, rateLimitCalls }) {
  mockModule('./utils/rate-limiter', {
    checkRateLimit: async (_ip, type) => {
      rateLimitCalls.push(type)
      return {
        allowed: true,
        remaining: 9,
        limit: 10,
        resetTime: Date.now() + 60000,
        retryAfter: 0,
      }
    },
    getRateLimitHeaders: (result) => ({
      'X-RateLimit-Limit': String(result.limit),
      'X-RateLimit-Remaining': String(result.remaining),
      'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    }),
    getClientIP: () => '203.0.113.10',
  })
  mockModule('./utils/input-sanitizer', {
    sanitizeFormData: (data) => data,
  })
  mockModule('./utils/cors-config', {
    getSecurityHeaders: () => ({ 'Access-Control-Allow-Origin': 'https://www.acdrainwiz.com' }),
  })
  mockModule('./utils/security-logger', {
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logRateLimit: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  })
  mockModule('./utils/request-fingerprint', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  mockModule('./utils/ip-reputation', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  mockModule('./utils/behavioral-analysis', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  mockModule('./utils/email-domain-validator', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  mockModule('./utils/blobs-store', {
    initBlobsStores: () => ({ initialized: true }),
    getUnsubscribeStore: () => null,
  })
  mockModule('./utils/ghl-client', {
    submitForm: ghlSubmitForm,
  })
}

function formEvent(body) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
    },
    body: new URLSearchParams(body).toString(),
  }
}

async function testFormSubmissionFailsClosedWhenGhlFails() {
  const rateLimitCalls = []
  delete process.env.RECAPTCHA_SECRET_KEY
  installCommonMocks({
    rateLimitCalls,
    ghlSubmitForm: async () => {
      const error = new Error('GHL unavailable')
      error.status = 503
      throw error
    },
  })
  clearModule('./validate-form-submission.js')
  const { handler } = require('./validate-form-submission.js')

  const response = await handler(formEvent({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 10000),
  }), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
  assert.deepStrictEqual(rateLimitCalls, ['form'])
}

async function testUnsubscribeFailsClosedWhenGhlFails() {
  const rateLimitCalls = []
  delete process.env.RECAPTCHA_SECRET_KEY
  installCommonMocks({
    rateLimitCalls,
    ghlSubmitForm: async () => {
      const error = new Error('GHL unavailable')
      error.status = 503
      throw error
    },
  })
  clearModule('./validate-unsubscribe.js')
  const { handler } = require('./validate-unsubscribe.js')

  const response = await handler(formEvent({
    email: 'ada@example.com',
    reason: 'not-relevant',
    feedback: 'No longer needed',
    'form-load-time': String(Date.now() - 10000),
  }), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
  assert.deepStrictEqual(rateLimitCalls, ['strict'])
}

async function testUploadUsesUploadRateLimitBucket() {
  const rateLimitCalls = []
  mockModule('./utils/rate-limiter', {
    checkRateLimit: async (_ip, type) => {
      rateLimitCalls.push(type)
      return {
        allowed: false,
        remaining: 0,
        limit: 10,
        resetTime: Date.now() + 60000,
        retryAfter: 60,
      }
    },
    getRateLimitHeaders: (result) => ({
      'X-RateLimit-Limit': String(result.limit),
      'X-RateLimit-Remaining': String(result.remaining),
      'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
      'Retry-After': String(result.retryAfter),
    }),
    getClientIP: () => '203.0.113.10',
  })
  mockModule('./utils/cors-config', {
    getSecurityHeaders: () => ({ 'Access-Control-Allow-Origin': 'https://www.acdrainwiz.com' }),
  })
  clearModule('./upload-image.js')
  const { handler } = require('./upload-image.js')

  const response = await handler({
    httpMethod: 'POST',
    headers: { origin: 'https://www.acdrainwiz.com' },
    body: '{}',
  }, {})

  assert.strictEqual(response.statusCode, 429)
  assert.deepStrictEqual(rateLimitCalls, ['upload'])
  assert.match(JSON.parse(response.body).error, /image uploads/i)
}

async function run() {
  await testFormSubmissionFailsClosedWhenGhlFails()
  await testUnsubscribeFailsClosedWhenGhlFails()
  await testUploadUsesUploadRateLimitBucket()
  console.log('form/GHL failure regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
