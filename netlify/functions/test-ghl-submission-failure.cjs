const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
let submitFormImpl = async () => ({ contactId: 'contact-123', isNew: true, traceId: 'trace-123', warnings: [] })

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
      addToBlacklist: async () => ({ success: true }),
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
    return { submitForm: (...args) => submitFormImpl(...args) }
  }

  return originalLoad.apply(this, arguments)
}

const { handler } = require('./validate-form-submission')

function buildEvent(overrides = {}) {
  const form = new URLSearchParams({
    'form-name': 'trash-the-float-story',
    'form-type': 'trash-the-float-story',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '555-555-5555',
    cityState: 'Miami, FL',
    city: 'Miami, FL',
    instagramHandle: '@testuser',
    audience: 'Contractor',
    storyTitle: 'A float switch failure story',
    storyBody: 'This is a detailed enough story about a float switch failure and cleanup.',
    damageImpact: '$500 repair',
    consent: 'yes',
    rulesConsent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  })

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
      ...overrides.headers,
    },
    body: form.toString(),
    isBase64Encoded: false,
    ...overrides,
  }
}

async function run() {
  submitFormImpl = async () => {
    throw new Error('GHL unavailable')
  }

  const failure = await handler(buildEvent(), {})
  assert.strictEqual(failure.statusCode, 502)
  assert.deepStrictEqual(JSON.parse(failure.body), {
    success: false,
    error: 'Submission failed',
    message: 'We could not save your submission. Please try again.',
  })

  submitFormImpl = async () => ({
    contactId: 'contact-123',
    isNew: false,
    traceId: 'trace-123',
    warnings: [],
  })

  const success = await handler(buildEvent(), {})
  assert.strictEqual(success.statusCode, 200)
  assert.strictEqual(JSON.parse(success.body).success, true)

  console.log('GHL submission failure handling tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
}).finally(() => {
  Module._load = originalLoad
})
