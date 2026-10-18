const assert = require('assert')
const path = require('path')

const FUNCTION_DIR = __dirname

function mockModule(relativePath, exports) {
  const resolved = require.resolve(path.join(FUNCTION_DIR, relativePath))
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  }
}

function loadHandlerWithGhlFailure() {
  const handlerPath = path.join(FUNCTION_DIR, 'validate-form-submission.js')
  delete require.cache[require.resolve(handlerPath)]

  mockModule('./utils/blobs-store', {
    initBlobsStores: () => ({ initialized: false }),
    getBehavioralPatternsStore: () => null,
    isBlobsAvailable: () => false,
  })
  mockModule('./utils/rate-limiter', {
    checkRateLimit: async () => ({
      allowed: true,
      remaining: 9,
      limit: 10,
      resetTime: Date.now() + 60000,
      retryAfter: 0,
    }),
    getRateLimitHeaders: () => ({}),
    getClientIP: (event) => event.headers['x-forwarded-for'] || '127.0.0.1',
  })
  mockModule('./utils/request-fingerprint', {
    validateRequestFingerprint: () => ({ isBot: false, reason: 'test browser' }),
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
  mockModule('./utils/ghl-client', {
    submitForm: async () => {
      const err = new Error('GHL contact upsert returned no contactId')
      err.status = 502
      err.traceId = 'trace-test'
      throw err
    },
  })

  return require(handlerPath).handler
}

function buildEvent() {
  const body = new URLSearchParams({
    'form-name': 'complimentary-mini-request',
    'form-type': 'complimentary-mini-request',
    access: 'test-access-token',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '(555) 123-4567',
    company: 'City Works',
    street: '123 Main St',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
    contactType: 'Code Official',
    eventName: 'Conference / event follow-up',
    consent: 'yes',
    smsTransactional: 'no',
    smsMarketing: 'no',
    'form-load-time': String(Date.now() - 5000),
  })

  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/complimentary-mini?access=test-access-token',
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'x-forwarded-for': '203.0.113.42',
    },
    body: body.toString(),
    isBase64Encoded: false,
  }
}

async function run() {
  process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = 'test-access-token'
  delete process.env.RECAPTCHA_SECRET_KEY

  const handler = loadHandlerWithGhlFailure()
  const response = await handler(buildEvent(), {})
  const payload = JSON.parse(response.body)

  assert.strictEqual(
    response.statusCode,
    502,
    `expected GHL failure to return 502, got ${response.statusCode}: ${response.body}`,
  )
  assert.strictEqual(payload.success, false)
  assert.match(payload.error, /temporarily unavailable|service unavailable/i)

  console.log('GHL submission failure returns a non-success response.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
