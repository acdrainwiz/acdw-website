const assert = require('assert')

const handlerPath = require.resolve('./validate-form-submission.js')
const ghlClientPath = require.resolve('./utils/ghl-client')

function stubModule(relativePath, exportsValue) {
  const resolved = require.resolve(relativePath)
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: exportsValue,
  }
}

function loadHandlerWithGhlMock(ghlMock) {
  delete require.cache[handlerPath]
  delete require.cache[ghlClientPath]

  stubModule('./utils/rate-limiter', {
    checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9, resetTime: Date.now() + 60000 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: (event) => event.headers['x-forwarded-for'] || '198.51.100.10',
  })
  stubModule('./utils/security-logger', {
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logRateLimit: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  })
  stubModule('./utils/request-fingerprint', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  stubModule('./utils/ip-reputation', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  stubModule('./utils/behavioral-analysis', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  stubModule('./utils/email-domain-validator', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  stubModule('./utils/blobs-store', {
    initBlobsStores: () => ({ initialized: true }),
  })
  stubModule('./utils/cors-config', {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
  })
  stubModule('./utils/ghl-client', ghlMock)

  return require('./validate-form-submission.js').handler
}

function makeEvent(bodyParams) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
      'content-type': 'application/x-www-form-urlencoded',
      'x-forwarded-for': '198.51.100.10',
    },
    body: new URLSearchParams({
      ...bodyParams,
      'form-load-time': String(Date.now() - 5000),
    }).toString(),
  }
}

async function testGhlFailureReturnsFailure() {
  let submitted = false
  const handler = loadHandlerWithGhlMock({
    submitForm: async () => {
      submitted = true
      const error = new Error('GHL unavailable')
      error.status = 503
      throw error
    },
  })

  const response = await handler(makeEvent({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
  }), {})

  assert.strictEqual(submitted, true, 'expected handler to attempt the GHL submission')
  assert.strictEqual(response.statusCode, 502)
  const body = JSON.parse(response.body)
  assert.strictEqual(body.success, false)
  assert.match(body.message, /could not save/i)
}

async function testComplimentaryMiniServerSecretFallback() {
  const previousServerToken = process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN
  const previousViteToken = process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN
  process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = 'server-secret'
  delete process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN

  let submittedFormType = null
  try {
    const handler = loadHandlerWithGhlMock({
      submitForm: async (formType) => {
        submittedFormType = formType
        return { contactId: 'contact-123', isNew: true, traceId: 'trace-123', warnings: [] }
      },
    })

    const response = await handler(makeEvent({
      'form-name': 'complimentary-mini-request',
      'form-type': 'complimentary-mini-request',
      access: 'server-secret',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '555-123-4567',
      contactType: 'Code Official',
      street: '123 Main St',
      city: 'Orlando',
      state: 'FL',
      zip: '32801',
      consent: 'yes',
    }), {})

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(JSON.parse(response.body).success, true)
    assert.strictEqual(submittedFormType, 'complimentary-mini-request')
  } finally {
    if (previousServerToken === undefined) {
      delete process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN
    } else {
      process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = previousServerToken
    }
    if (previousViteToken === undefined) {
      delete process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN
    } else {
      process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN = previousViteToken
    }
  }
}

async function run() {
  await testGhlFailureReturnsFailure()
  await testComplimentaryMiniServerSecretFallback()
  console.log('Critical form submission tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
