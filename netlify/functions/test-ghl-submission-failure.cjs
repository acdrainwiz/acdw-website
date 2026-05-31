const assert = require('assert')
const path = require('path')

function stub(relativePath, exports) {
  const resolved = require.resolve(path.join(__dirname, relativePath))
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  }
}

let submitCalls = 0

stub('./utils/rate-limiter', {
  checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9 }),
  getRateLimitHeaders: () => ({}),
  getClientIP: () => '203.0.113.10',
})

stub('./utils/security-logger', {
  logFormSubmission: () => {},
  logBotDetected: () => {},
  logRecaptcha: () => {},
  logRateLimit: () => {},
  logInjectionAttempt: () => {},
  EVENT_TYPES: {},
})

stub('./utils/request-fingerprint', {
  validateRequestFingerprint: () => ({ isBot: false }),
})

stub('./utils/ip-reputation', {
  validateIP: async () => ({ allowed: true }),
  addToBlacklist: async () => {},
})

stub('./utils/behavioral-analysis', {
  validateSubmissionBehavior: async () => ({ allowed: true }),
})

stub('./utils/email-domain-validator', {
  validateEmailDomain: async () => ({ valid: true }),
})

stub('./utils/blobs-store', {
  initBlobsStores: () => ({ initialized: true }),
})

stub('./utils/ghl-client', {
  submitForm: async () => {
    submitCalls += 1
    throw new Error('simulated GHL outage')
  },
})

const { handler } = require('./validate-form-submission')

function buildTrashTheFloatBody() {
  return new URLSearchParams({
    'form-name': 'trash-the-float-story',
    'form-type': 'trash-the-float-story',
    firstName: 'Alex',
    lastName: 'Rivera',
    fullName: 'Alex Rivera',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    cityState: 'Miami, FL',
    city: 'Miami, FL',
    instagramHandle: '@alexhvac',
    audience: 'Contractor',
    storyBody: 'This float switch failure caused a real callback and water damage.',
    message: 'This float switch failure caused a real callback and water damage.',
    damageImpact: '$1,200 ceiling repair',
    consent: 'yes',
    rulesConsent: 'yes',
    mediaUrl: '',
    'form-load-time': String(Date.now() - 3000),
    'bot-field': '',
    'honeypot-1': '',
    'honeypot-2': '',
  }).toString()
}

async function run() {
  const response = await handler(
    {
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-form-submission',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://www.acdrainwiz.com',
        'user-agent': 'Mozilla/5.0 regression-test',
      },
      body: buildTrashTheFloatBody(),
    },
    {},
  )

  const body = JSON.parse(response.body)

  assert.strictEqual(submitCalls, 1, 'expected the validated form to reach GHL submission')
  assert.strictEqual(response.statusCode, 502, 'GHL failures must not return HTTP 200')
  assert.strictEqual(body.success, false, 'GHL failures must not be reported as success')
  assert.match(body.message, /could not save/i)
}

run()
  .then(() => {
    console.log('✅ GHL submission failure regression passed')
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
