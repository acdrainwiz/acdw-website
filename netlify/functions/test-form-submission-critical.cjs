const assert = require('assert')
const path = require('path')

const functionDir = __dirname
const handlerPath = path.join(functionDir, 'validate-form-submission.js')

function installStub(relativePath, exportsValue) {
  const resolved = require.resolve(path.join(functionDir, relativePath))
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: exportsValue,
  }
}

function loadHandlerWithGhl(submitForm) {
  delete require.cache[require.resolve(handlerPath)]

  installStub('./utils/rate-limiter', {
    checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
    getRateLimitHeaders: () => ({}),
    getClientIP: () => '203.0.113.10',
  })
  installStub('./utils/input-sanitizer', {
    sanitizeFormData: (data) => ({ ...data }),
  })
  installStub('./utils/cors-config', {
    getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
  })
  installStub('./utils/security-logger', {
    logFormSubmission: () => {},
    logBotDetected: () => {},
    logRecaptcha: () => {},
    logRateLimit: () => {},
    logInjectionAttempt: () => {},
    EVENT_TYPES: {},
  })
  installStub('./utils/request-fingerprint', {
    validateRequestFingerprint: () => ({ isBot: false }),
  })
  installStub('./utils/ip-reputation', {
    validateIP: async () => ({ allowed: true }),
    addToBlacklist: async () => {},
  })
  installStub('./utils/behavioral-analysis', {
    validateSubmissionBehavior: async () => ({ allowed: true }),
  })
  installStub('./utils/email-domain-validator', {
    validateEmailDomain: async () => ({ valid: true }),
  })
  installStub('./utils/blobs-store', {
    initBlobsStores: () => ({}),
  })
  installStub('./utils/ghl-client', {
    submitForm,
  })

  return require(handlerPath).handler
}

function validComplimentaryMiniBody() {
  return new URLSearchParams({
    'form-name': 'complimentary-mini-request',
    'form-type': 'complimentary-mini-request',
    access: 'server-secret',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: '555-123-4567',
    contactType: 'Building Inspector,',
    street: '123 Main St',
    city: 'Orlando',
    state: 'FL',
    zip: '32801',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  }).toString()
}

function event(body = validComplimentaryMiniBody()) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0 critical-regression-test',
    },
    body,
  }
}

async function testGhlFailureDoesNotReturnSuccess() {
  process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = 'server-secret'
  delete process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN

  const handler = loadHandlerWithGhl(async () => {
    throw Object.assign(new Error('GHL is down'), { status: 503, traceId: 'trace-123' })
  })

  const response = await handler(event(), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(body.success, false)
  assert.match(body.message, /could not save/i)
}

async function testServerOnlyAccessTokenIsAccepted() {
  process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = 'server-secret'
  delete process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN

  let capturedType = null
  let capturedData = null
  const handler = loadHandlerWithGhl(async (formType, sanitizedData) => {
    capturedType = formType
    capturedData = sanitizedData
    return { contactId: 'contact-1', isNew: true, traceId: 'trace-ok', warnings: [] }
  })

  const response = await handler(event(), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.success, true)
  assert.strictEqual(capturedType, 'complimentary-mini-request')
  assert.strictEqual(capturedData.email, 'ada@example.com')
}

function testComplimentaryMiniUsesDocumentedPipelineVars() {
  const { formConfigs } = require('./utils/ghl-field-map')
  const config = formConfigs['complimentary-mini-request']

  assert.strictEqual(config.pipelineIdEnvVar, 'GHL_QUICK_PIPELINE_ID')
  assert.strictEqual(config.pipelineStageIdEnvVar, 'GHL_QUICK_PIPELINE_STAGE_ID')
}

async function run() {
  await testGhlFailureDoesNotReturnSuccess()
  await testServerOnlyAccessTokenIsAccepted()
  testComplimentaryMiniUsesDocumentedPipelineVars()
  console.log('Critical form submission regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
