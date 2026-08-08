const assert = require('assert/strict')

const handlerPath = require.resolve('./validate-form-submission.js')
const ghlClientPath = require.resolve('./utils/ghl-client')
const rateLimiterPath = require.resolve('./utils/rate-limiter')
const ipReputationPath = require.resolve('./utils/ip-reputation')
const emailDomainValidatorPath = require.resolve('./utils/email-domain-validator')

function mockModule(modulePath, exports) {
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports,
  }
}

function loadHandler({ submitForm, addToBlacklist }) {
  delete require.cache[handlerPath]

  mockModule(ghlClientPath, { submitForm })
  mockModule(rateLimiterPath, {
    checkRateLimit: async () => ({
      allowed: true,
      remaining: 9,
      limit: 10,
      resetTime: Date.now() + 60_000,
      retryAfter: 0,
    }),
    getRateLimitHeaders: () => ({}),
    getClientIP: (event) => event.headers['x-forwarded-for'] || '203.0.113.10',
  })
  mockModule(ipReputationPath, {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: addToBlacklist || (async () => {}),
  })
  mockModule(emailDomainValidatorPath, {
    validateEmailDomain: async () => ({ valid: true }),
  })

  return require('./validate-form-submission.js').handler
}

function buildTrashTheFloatBody(overrides = {}) {
  return new URLSearchParams({
    'form-name': 'trash-the-float-story',
    'form-type': 'trash-the-float-story',
    firstName: 'Ada',
    lastName: 'Lovelace',
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '555-010-1234',
    cityState: 'Tampa, FL',
    city: 'Tampa, FL',
    instagramHandle: '@ada_lovelace',
    audience: 'Contractor',
    storyBody: 'A float switch failed and caused a ceiling leak before service could arrive.',
    message: 'A float switch failed and caused a ceiling leak before service could arrive.',
    damageImpact: 'Ceiling damage',
    mediaUrl: '',
    consent: 'yes',
    rulesConsent: 'yes',
    'form-load-time': String(Date.now() - 3_000),
    'bot-field': '',
    'honeypot-1': '',
    'honeypot-2': '',
    ...overrides,
  }).toString()
}

function buildEvent(body) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/trash-the-float',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'x-forwarded-for': '203.0.113.10',
    },
    body,
  }
}

async function testGhlFailureIsNotReportedAsSuccess() {
  let submitCalls = 0
  const handler = loadHandler({
    submitForm: async () => {
      submitCalls += 1
      throw new Error('GHL unavailable')
    },
  })

  const response = await handler(buildEvent(buildTrashTheFloatBody()), {})
  const body = JSON.parse(response.body)

  assert.equal(submitCalls, 1)
  assert.equal(response.statusCode, 502)
  assert.equal(body.success, false)
  assert.equal(body.error, 'Submission service unavailable')
}

async function testExpiredTrashTheFloatFormIsRejected() {
  let submitCalls = 0
  let blacklistCalls = 0
  const handler = loadHandler({
    submitForm: async () => {
      submitCalls += 1
      return { contactId: 'contact-1', isNew: false, traceId: 'trace-1', warnings: [] }
    },
    addToBlacklist: async () => {
      blacklistCalls += 1
    },
  })

  const staleLoadTime = Date.now() - 16 * 60 * 1000
  const response = await handler(
    buildEvent(buildTrashTheFloatBody({ 'form-load-time': String(staleLoadTime) })),
    {},
  )
  const body = JSON.parse(response.body)

  assert.equal(submitCalls, 0)
  assert.equal(blacklistCalls, 0)
  assert.equal(response.statusCode, 400)
  assert.equal(body.success, false)
  assert.match(body.message, /refresh the page/i)
}

function testTrashTheFloatMediaUrlIsNotTruncatedAt500Chars() {
  const { sanitizeFormData } = require('./utils/input-sanitizer')
  const longMediaUrl = `https://storage.leadconnectorhq.com/media/${'a'.repeat(1200)}.jpg`
  const sanitized = sanitizeFormData({ mediaUrl: longMediaUrl }, 'trash-the-float-story')

  assert.equal(sanitized.mediaUrl, longMediaUrl)
}

async function run() {
  await testGhlFailureIsNotReportedAsSuccess()
  await testExpiredTrashTheFloatFormIsRejected()
  testTrashTheFloatMediaUrlIsNotTruncatedAt500Chars()
  console.log('Critical form submission regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
