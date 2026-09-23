#!/usr/bin/env node

const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

const noop = () => {}
const asyncNoop = async () => {}

function installStubs({ ghlError = new Error('GHL unavailable'), csrfResult = { valid: true } } = {}) {
  Module._load = function patchedLoad(request, parent, isMain) {
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
      return {
        sanitizeFormData: (data) => Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, value == null ? '' : String(value)])
        ),
      }
    }
    if (request === './utils/cors-config') {
      return {
        getSecurityHeaders: () => ({ 'Content-Type': 'application/json' }),
      }
    }
    if (request === './utils/security-logger') {
      return {
        logFormSubmission: noop,
        logBotDetected: noop,
        logRecaptcha: noop,
        logRateLimit: noop,
        logInjectionAttempt: noop,
        logAPIAccess: noop,
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
        addToBlacklist: asyncNoop,
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
        initBlobsStores: noop,
        getUnsubscribeStore: () => null,
      }
    }
    if (request === './utils/csrf-validator') {
      return {
        validateCSRFToken: async () => csrfResult,
      }
    }
    if (request === './utils/ghl-client') {
      return {
        submitForm: async () => {
          throw ghlError
        },
      }
    }
    return originalLoad.call(this, request, parent, isMain)
  }
}

function restoreStubs() {
  Module._load = originalLoad
}

function clearHandlerCache() {
  for (const modulePath of [
    require.resolve('./validate-form-submission.js'),
    require.resolve('./validate-unsubscribe.js'),
  ]) {
    delete require.cache[modulePath]
  }
}

function formEvent(body, path) {
  return {
    httpMethod: 'POST',
    path,
    headers: {
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/support',
      'user-agent': 'Mozilla/5.0',
    },
    body: new URLSearchParams(body).toString(),
  }
}

async function loadHandlers(options) {
  restoreStubs()
  clearHandlerCache()
  installStubs(options)
  return {
    validateFormSubmission: require('./validate-form-submission.js').handler,
    validateUnsubscribe: require('./validate-unsubscribe.js').handler,
  }
}

async function assertContactFormCrmFailureReturns502() {
  const { validateFormSubmission } = await loadHandlers()
  const response = await validateFormSubmission(formEvent({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me about AC Drain Wiz.',
    consent: 'yes',
  }, '/.netlify/functions/validate-form-submission'), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function assertUnsubscribeCrmFailureReturns502() {
  const { validateUnsubscribe } = await loadHandlers()
  const response = await validateUnsubscribe(formEvent({
    email: 'customer@example.com',
    reason: 'too-many-emails',
    feedback: 'Please unsubscribe me.',
    'csrf-token': 'valid-token',
  }, '/.netlify/functions/validate-unsubscribe'), {})

  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(JSON.parse(response.body).success, false)
}

async function assertUnsubscribeInvalidCsrfStopsBeforeCrm() {
  let submitCalled = false
  const csrfResult = {
    valid: false,
    reason: 'Invalid CSRF token',
    details: { message: 'Security token is invalid or expired' },
  }

  restoreStubs()
  clearHandlerCache()
  installStubs({ csrfResult })
  const currentLoad = Module._load
  Module._load = function patchedGhlSpy(request, parent, isMain) {
    if (request === './utils/ghl-client') {
      return {
        submitForm: async () => {
          submitCalled = true
          throw new Error('GHL should not be called')
        },
      }
    }
    return currentLoad.call(this, request, parent, isMain)
  }

  const { handler } = require('./validate-unsubscribe.js')
  const response = await handler(formEvent({
    email: 'customer@example.com',
    reason: 'too-many-emails',
    'csrf-token': 'invalid-token',
  }, '/.netlify/functions/validate-unsubscribe'), {})

  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(submitCalled, false)
}

async function main() {
  try {
    await assertContactFormCrmFailureReturns502()
    await assertUnsubscribeCrmFailureReturns502()
    await assertUnsubscribeInvalidCsrfStopsBeforeCrm()
  } finally {
    restoreStubs()
  }
  console.log('critical regression tests passed')
}

main().catch((error) => {
  restoreStubs()
  console.error(error)
  process.exit(1)
})
