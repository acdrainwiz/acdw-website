const assert = require('node:assert/strict')
const Module = require('node:module')
const test = require('node:test')

const FORM_HANDLER = '../netlify/functions/validate-form-submission.js'
const UNSUBSCRIBE_HANDLER = '../netlify/functions/validate-unsubscribe.js'

function loadHandlerWithGhlFailure(handlerPath) {
  const originalLoad = Module._load
  Module._load = function mockedLoad(request, parent, isMain) {
    if (request === './utils/ghl-client') {
      return {
        submitForm: async () => {
          throw Object.assign(new Error('GHL unavailable'), {
            name: 'GhlApiError',
            status: 503,
            traceId: 'trace-test',
          })
        },
      }
    }

    if (request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({
          allowed: true,
          remaining: 9,
          limit: 10,
          resetTime: Date.now() + 60000,
          retryAfter: 0,
        }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '203.0.113.10',
      }
    }

    if (request === './utils/input-sanitizer') {
      return { sanitizeFormData: (data) => data }
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
      return { validateRequestFingerprint: () => ({ isBot: false }) }
    }

    if (request === './utils/ip-reputation') {
      return {
        validateIP: async () => ({ allowed: true }),
        addToBlacklist: async () => {},
      }
    }

    if (request === './utils/behavioral-analysis') {
      return { validateSubmissionBehavior: async () => ({ allowed: true }) }
    }

    if (request === './utils/email-domain-validator') {
      return { validateEmailDomain: async () => ({ valid: true }) }
    }

    if (request === './utils/csrf-validator') {
      return { validateCSRFToken: async () => ({ valid: true }) }
    }

    if (request === './utils/blobs-store') {
      return {
        initBlobsStores: () => ({ initialized: true }),
        getUnsubscribeStore: () => null,
      }
    }

    return originalLoad.call(this, request, parent, isMain)
  }

  try {
    const resolved = require.resolve(handlerPath)
    delete require.cache[resolved]
    return require(handlerPath).handler
  } finally {
    Module._load = originalLoad
  }
}

function makeEvent(body) {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0',
      origin: 'https://www.acdrainwiz.com',
    },
    body: new URLSearchParams(body).toString(),
  }
}

test('contact form returns a visible failure when GHL submission fails', async () => {
  delete process.env.RECAPTCHA_SECRET_KEY
  const handler = loadHandlerWithGhlFailure(FORM_HANDLER)

  const response = await handler(makeEvent({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me.',
    consent: 'yes',
  }), {})

  assert.equal(response.statusCode, 502)
  assert.equal(JSON.parse(response.body).success, false)
})

test('unsubscribe returns a visible failure when GHL opt-out fails', async () => {
  delete process.env.RECAPTCHA_SECRET_KEY
  const handler = loadHandlerWithGhlFailure(UNSUBSCRIBE_HANDLER)

  const response = await handler({
    ...makeEvent({
      email: 'ada@example.com',
      reason: 'too-many-emails',
      feedback: '',
      'form-load-time': String(Date.now() - 10000),
      'csrf-token': 'csrf-test',
    }),
    path: '/.netlify/functions/validate-unsubscribe',
  }, {})

  assert.equal(response.statusCode, 502)
  assert.equal(JSON.parse(response.body).success, false)
})
