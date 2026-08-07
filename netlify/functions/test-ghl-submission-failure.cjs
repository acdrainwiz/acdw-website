const assert = require('assert')
const path = require('path')

const root = path.resolve(__dirname, '../..')

function mockModule(relativePath, exports) {
  const filename = path.join(root, relativePath)
  require.cache[require.resolve(filename)] = {
    id: filename,
    filename,
    loaded: true,
    exports,
  }
}

mockModule('netlify/functions/utils/rate-limiter.js', {
  checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9 }),
  getRateLimitHeaders: () => ({}),
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
})

mockModule('netlify/functions/utils/ghl-client.js', {
  submitForm: async () => {
    const error = new Error('simulated GHL outage')
    error.status = 503
    error.traceId = 'trace-1'
    throw error
  },
})

process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = 'secret-access-token'
delete process.env.RECAPTCHA_SECRET_KEY

const { handler } = require('./validate-form-submission.js')

async function run() {
  const body = new URLSearchParams({
    'form-name': 'complimentary-mini-request',
    'form-type': 'complimentary-mini-request',
    access: 'secret-access-token',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '(555) 123-4567',
    contactType: 'Mechanical Inspector',
    street: '1 Main St',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
    consent: 'yes',
    'form-load-time': String(Date.now() - 10_000),
  }).toString()

  const response = await handler(
    {
      httpMethod: 'POST',
      headers: {
        origin: 'https://www.acdrainwiz.com',
        'user-agent': 'Mozilla/5.0 Chrome/120',
      },
      path: '/.netlify/functions/validate-form-submission',
      body,
    },
    {},
  )

  assert.strictEqual(response.statusCode, 502)
  const responseBody = JSON.parse(response.body)
  assert.strictEqual(responseBody.success, false)
  assert.match(responseBody.message, /could not save/i)

  console.log('GHL submission failure is surfaced to the frontend')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
