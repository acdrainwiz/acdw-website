const assert = require('node:assert/strict')
const Module = require('node:module')
const { URLSearchParams } = require('node:url')

const originalLoad = Module._load

let submitFormImpl
let logFormSubmissionCalls

function installMocks() {
  submitFormImpl = async () => ({
    contactId: 'contact_123',
    isNew: true,
    traceId: 'trace_123',
    warnings: [],
  })
  logFormSubmissionCalls = []

  Module._load = function mockedLoad(request, parent, isMain) {
    if (request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9, resetTime: Date.now() + 60000 }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '203.0.113.10',
      }
    }
    if (request === './utils/input-sanitizer') {
      return {
        sanitizeFormData: (data) => ({ ...data }),
      }
    }
    if (request === './utils/cors-config') {
      return {
        getSecurityHeaders: () => ({ 'content-type': 'application/json' }),
      }
    }
    if (request === './utils/security-logger') {
      return {
        logFormSubmission: (...args) => logFormSubmissionCalls.push(args),
        logBotDetected: () => {},
        logRecaptcha: () => {},
        logRateLimit: () => {},
        logInjectionAttempt: () => {},
        EVENT_TYPES: {},
      }
    }
    if (request === './utils/request-fingerprint') {
      return {
        validateRequestFingerprint: () => ({ isBot: false }),
      }
    }
    if (request === './utils/ip-reputation') {
      return {
        validateIP: async () => ({ allowed: true }),
        addToBlacklist: async () => {},
      }
    }
    if (request === './utils/behavioral-analysis') {
      return {
        validateSubmissionBehavior: async () => ({ allowed: true }),
      }
    }
    if (request === './utils/email-domain-validator') {
      return {
        validateEmailDomain: async () => ({ valid: true }),
      }
    }
    if (request === './utils/blobs-store') {
      return {
        initBlobsStores: () => ({ initialized: true }),
      }
    }
    if (request === './utils/ghl-client') {
      return {
        submitForm: (...args) => submitFormImpl(...args),
      }
    }
    return originalLoad.call(this, request, parent, isMain)
  }
}

function uninstallMocks() {
  Module._load = originalLoad
}

function loadHandler() {
  const handlerPath = require.resolve('./validate-form-submission.js')
  delete require.cache[handlerPath]
  return require(handlerPath).handler
}

function makeTrashTheFloatEvent() {
  const body = new URLSearchParams({
    'form-name': 'trash-the-float-story',
    'form-type': 'trash-the-float-story',
    firstName: 'Ada',
    lastName: 'Lovelace',
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '(555) 123-4567',
    cityState: 'Miami, FL',
    city: 'Miami, FL',
    instagramHandle: '@ada_test',
    audience: 'Contractor',
    storyBody: 'A float switch failed during a clogged drain service call and caused a callback.',
    message: 'A float switch failed during a clogged drain service call and caused a callback.',
    damageImpact: '$500 ceiling repair',
    mediaUrl: '',
    consent: 'yes',
    rulesConsent: 'yes',
    'form-load-time': String(Date.now() - 30000),
    'recaptcha-token': '',
    'bot-field': '',
    'honeypot-1': '',
    'honeypot-2': '',
  }).toString()

  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0 regression-test',
    },
    body,
    isBase64Encoded: false,
  }
}

async function runTests() {
  installMocks()
  try {
    const handler = loadHandler()

    submitFormImpl = async () => {
      const error = new Error('GHL outage')
      error.status = 503
      throw error
    }

    const failureResponse = await handler(makeTrashTheFloatEvent(), {})
    const failureBody = JSON.parse(failureResponse.body)

    assert.equal(failureResponse.statusCode, 502)
    assert.equal(failureBody.success, false)
    assert.match(failureBody.message, /could not save/i)
    assert.equal(logFormSubmissionCalls.at(-1)?.[4], false)

    submitFormImpl = async () => ({
      contactId: 'contact_456',
      isNew: false,
      traceId: 'trace_456',
      warnings: [],
    })

    const successResponse = await handler(makeTrashTheFloatEvent(), {})
    const successBody = JSON.parse(successResponse.body)

    assert.equal(successResponse.statusCode, 200)
    assert.equal(successBody.success, true)
    assert.equal(logFormSubmissionCalls.at(-1)?.[4], true)

    console.log('GHL submission failure handling tests passed')
  } finally {
    uninstallMocks()
  }
}

runTests().catch((error) => {
  uninstallMocks()
  console.error(error)
  process.exitCode = 1
})
