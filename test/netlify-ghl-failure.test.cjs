const assert = require('node:assert/strict')
const path = require('node:path')
const test = require('node:test')

const repoRoot = path.resolve(__dirname, '..')
const functionPath = path.join(repoRoot, 'netlify/functions/validate-form-submission.js')

function mockModule(relativePath, exports) {
  const modulePath = path.join(repoRoot, relativePath)
  const resolved = require.resolve(modulePath)
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  }
}

function clearFunctionModules() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes('/netlify/functions/')) {
      delete require.cache[key]
    }
  }
}

function loadHandlerWithGhlSubmit(submitForm) {
  clearFunctionModules()

  mockModule('netlify/functions/utils/rate-limiter.js', {
    checkRateLimit: async () => ({
      allowed: true,
      remaining: 9,
      limit: 10,
      resetTime: Date.now() + 60000,
      retryAfter: 0,
    }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
  })
  mockModule('netlify/functions/utils/request-fingerprint.js', {
    validateRequestFingerprint: () => ({ isBot: false, reason: 'test' }),
  })
  mockModule('netlify/functions/utils/ip-reputation.js', {
    validateIP: async () => ({ allowed: true, reason: 'test' }),
    addToBlacklist: async () => {},
  })
  mockModule('netlify/functions/utils/behavioral-analysis.js', {
    validateSubmissionBehavior: async () => ({ allowed: true, reason: 'test' }),
  })
  mockModule('netlify/functions/utils/email-domain-validator.js', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  mockModule('netlify/functions/utils/blobs-store.js', {
    initBlobsStores: () => ({ initialized: false }),
  })
  mockModule('netlify/functions/utils/ghl-client.js', { submitForm })

  return require(functionPath).handler
}

function validContactEvent() {
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  })

  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0 Test Browser',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
    },
    body: body.toString(),
  }
}

test('returns a visible failure when GHL cannot persist a valid submission', async () => {
  let submitCalls = 0
  const handler = loadHandlerWithGhlSubmit(async () => {
    submitCalls += 1
    const err = new Error('GHL POST /contacts/upsert failed: HTTP 500')
    err.status = 500
    err.traceId = 'trace-123'
    throw err
  })

  const response = await handler(validContactEvent(), {})
  const body = JSON.parse(response.body)

  assert.equal(submitCalls, 1)
  assert.equal(response.statusCode, 502)
  assert.equal(body.success, false)
  assert.match(body.message, /try again/i)
})

test('continues to return success after GHL persists a valid submission', async () => {
  const handler = loadHandlerWithGhlSubmit(async () => ({
    contactId: 'contact-123',
    isNew: true,
    traceId: 'trace-456',
    warnings: [],
  }))

  const response = await handler(validContactEvent(), {})
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 200)
  assert.equal(body.success, true)
})
