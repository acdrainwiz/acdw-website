const assert = require('node:assert/strict')
const path = require('node:path')
const test = require('node:test')

const root = path.resolve(__dirname, '..')

function modulePath(relativePath) {
  return path.join(root, relativePath)
}

function mockModule(relativePath, exports) {
  const resolved = require.resolve(modulePath(relativePath))
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  }
}

function clearFunctionModules() {
  for (const relativePath of [
    'netlify/functions/validate-form-submission.js',
    'netlify/functions/validate-unsubscribe.js',
    'netlify/functions/utils/rate-limiter.js',
    'netlify/functions/utils/input-sanitizer.js',
    'netlify/functions/utils/cors-config.js',
    'netlify/functions/utils/security-logger.js',
    'netlify/functions/utils/request-fingerprint.js',
    'netlify/functions/utils/ip-reputation.js',
    'netlify/functions/utils/behavioral-analysis.js',
    'netlify/functions/utils/email-domain-validator.js',
    'netlify/functions/utils/blobs-store.js',
    'netlify/functions/utils/ghl-client.js',
  ]) {
    delete require.cache[require.resolve(modulePath(relativePath))]
  }
}

function installCommonMocks(submitForm) {
  mockModule('netlify/functions/utils/rate-limiter.js', {
    checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9 }),
    getRateLimitHeaders: () => ({ 'x-ratelimit-remaining': '9' }),
    getClientIP: () => '203.0.113.10',
  })
  mockModule('netlify/functions/utils/input-sanitizer.js', {
    sanitizeFormData: (data) => ({ ...data }),
  })
  mockModule('netlify/functions/utils/cors-config.js', {
    getSecurityHeaders: () => ({ 'content-type': 'application/json' }),
  })
  mockModule('netlify/functions/utils/security-logger.js', {
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logRateLimit: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  })
  mockModule('netlify/functions/utils/request-fingerprint.js', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  mockModule('netlify/functions/utils/ip-reputation.js', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  mockModule('netlify/functions/utils/behavioral-analysis.js', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  mockModule('netlify/functions/utils/email-domain-validator.js', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  mockModule('netlify/functions/utils/blobs-store.js', {
    initBlobsStores: () => ({ initialized: true }),
    getUnsubscribeStore: () => ({
      set: async () => {},
    }),
  })
  mockModule('netlify/functions/utils/ghl-client.js', {
    submitForm,
  })
}

function browserEvent(body) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  }
}

test('validate-form-submission returns 502 when GHL write fails', async () => {
  clearFunctionModules()
  installCommonMocks(async () => {
    const err = new Error('GHL unavailable')
    err.status = 503
    throw err
  })

  const { handler } = require(modulePath('netlify/functions/validate-form-submission.js'))
  const response = await handler(
    browserEvent({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '(555) 123-4567',
      message: 'Please contact me.',
      consent: 'yes',
      'form-load-time': String(Date.now() - 10_000),
    }),
    {}
  )
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 502)
  assert.equal(body.success, false)
  assert.match(body.message, /could not process/i)
})

test('validate-form-submission returns success only after GHL write succeeds', async () => {
  clearFunctionModules()
  installCommonMocks(async () => ({
    contactId: 'contact-123',
    isNew: true,
    traceId: 'trace-123',
    warnings: [],
  }))

  const { handler } = require(modulePath('netlify/functions/validate-form-submission.js'))
  const response = await handler(
    browserEvent({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
      phone: '(555) 987-6543',
      message: 'I need support.',
      consent: 'yes',
      'form-load-time': String(Date.now() - 10_000),
    }),
    {}
  )
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 200)
  assert.equal(body.success, true)
})

test('validate-unsubscribe returns 502 when GHL opt-out write fails', async () => {
  clearFunctionModules()
  installCommonMocks(async () => {
    const err = new Error('GHL unavailable')
    err.status = 503
    throw err
  })

  const { handler } = require(modulePath('netlify/functions/validate-unsubscribe.js'))
  const response = await handler(
    {
      ...browserEvent({
        'form-name': 'unsubscribe',
        email: 'optout@example.com',
        reason: 'not-relevant',
        feedback: '',
        'form-load-time': String(Date.now() - 10_000),
      }),
      path: '/.netlify/functions/validate-unsubscribe',
    },
    {}
  )
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 502)
  assert.equal(body.success, false)
  assert.match(body.message, /unsubscribe request/i)
})
