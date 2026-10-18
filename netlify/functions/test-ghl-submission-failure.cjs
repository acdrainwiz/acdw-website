const assert = require('node:assert/strict')
const path = require('node:path')

const functionsDir = __dirname

function mockModule(relativePath, exports) {
  const modulePath = path.join(functionsDir, relativePath)
  const resolved = require.resolve(modulePath)
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  }
}

function loadHandlerWithGhlSubmit(submitForm) {
  const handlerPath = path.join(functionsDir, 'validate-form-submission.js')
  delete require.cache[require.resolve(handlerPath)]

  mockModule('utils/ghl-client.js', { submitForm })
  mockModule('utils/rate-limiter.js', {
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
  mockModule('utils/request-fingerprint.js', {
    validateRequestFingerprint: () => ({ isBot: false, reason: 'test' }),
  })
  mockModule('utils/ip-reputation.js', {
    validateIP: async () => ({ allowed: true, reason: 'test' }),
    addToBlacklist: async () => ({ success: true }),
  })
  mockModule('utils/behavioral-analysis.js', {
    validateSubmissionBehavior: async () => ({ allowed: true, reason: 'test' }),
  })
  mockModule('utils/email-domain-validator.js', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  mockModule('utils/blobs-store.js', {
    initBlobsStores: () => ({ initialized: false }),
  })
  mockModule('utils/security-logger.js', {
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logRateLimit: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  })

  return require(handlerPath).handler
}

function buildValidContactEvent() {
  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Avery',
    lastName: 'Tester',
    email: 'avery@example.com',
    message: 'Please follow up about my AC Drain Wiz question.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/contact',
      'user-agent': 'Mozilla/5.0 Test Browser',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'content-type': 'application/x-www-form-urlencoded',
      'x-forwarded-for': '127.0.0.1',
    },
    body,
  }
}

async function main() {
  delete process.env.RECAPTCHA_SECRET_KEY

  const handler = loadHandlerWithGhlSubmit(async () => {
    throw Object.assign(new Error('GHL unavailable'), {
      name: 'GhlApiError',
      status: 503,
      traceId: 'trace-123',
    })
  })

  const response = await handler(buildValidContactEvent(), {})
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 502)
  assert.equal(body.success, false)
  assert.match(body.message, /could not save/i)
}

main()
  .then(() => {
    console.log('GHL submission failure regression test passed')
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
