const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

function loadFormHandlerWithGhl(submitForm) {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true, remaining: 9, limit: 10, resetTime: Date.now(), retryAfter: 0 }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '127.0.0.1',
      }
    }

    if (request === './utils/input-sanitizer') {
      return { sanitizeFormData: (data) => ({ ...data }) }
    }

    if (request === './utils/cors-config') {
      return { getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }) }
    }

    if (request === './utils/security-logger') {
      return {
        logFormSubmission: () => {},
        logBotDetected: () => {},
        logRecaptcha: () => {},
        logRateLimit: () => {},
        logInjectionAttempt: () => {},
        EVENT_TYPES: {},
      }
    }

    if (request === './utils/request-fingerprint') {
      return { validateRequestFingerprint: async () => ({ valid: true }) }
    }

    if (request === './utils/ip-reputation') {
      return {
        validateIP: async () => ({ valid: true }),
        addToBlacklist: async () => {},
      }
    }

    if (request === './utils/behavioral-analysis') {
      return { validateSubmissionBehavior: async () => ({ allowed: true }) }
    }

    if (request === './utils/email-domain-validator') {
      return { validateEmailDomain: async () => ({ valid: true }) }
    }

    if (request === './utils/blobs-store') {
      return { initBlobsStores: () => ({ initialized: false }) }
    }

    if (request === './utils/ghl-client') {
      return { submitForm }
    }

    return originalLoad(request, parent, isMain)
  }

  delete require.cache[require.resolve('./validate-form-submission.js')]
  return require('./validate-form-submission.js').handler
}

function eventFor(params) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
    },
    body: new URLSearchParams(params).toString(),
  }
}

async function runContactGhlFailureTest() {
  const handler = loadFormHandlerWithGhl(async () => {
    const error = new Error('GHL unavailable')
    error.status = 503
    throw error
  })

  const response = await handler(eventFor({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz products.',
    consent: 'yes',
  }), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function runComplimentaryMiniServerTokenTest() {
  process.env.COMPLIMENTARY_MINI_ACCESS_TOKEN = 'server-only-token'
  delete process.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN

  let submittedType = null
  const handler = loadFormHandlerWithGhl(async (formType) => {
    submittedType = formType
    return { contactId: 'contact_123', isNew: true, traceId: 'trace_123', warnings: [] }
  })

  const response = await handler(eventFor({
    'form-name': 'complimentary-mini-request',
    'form-type': 'complimentary-mini-request',
    access: 'server-only-token',
    firstName: 'Grace',
    lastName: 'Hopper',
    email: 'grace@example.com',
    phone: '3055551212',
    contactType: 'Mechanical Inspector',
    street: '123 Main St',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
    consent: 'yes',
  }), {})

  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(JSON.parse(response.body).success, true)
  assert.strictEqual(submittedType, 'complimentary-mini-request')
}

async function run() {
  await runContactGhlFailureTest()
  await runComplimentaryMiniServerTokenTest()
}

run()
  .then(() => {
    Module._load = originalLoad
    console.log('form submission critical regression tests passed')
  })
  .catch((error) => {
    Module._load = originalLoad
    console.error(error)
    process.exit(1)
  })
