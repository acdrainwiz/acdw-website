const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const functionPath = path.join(__dirname, '..', 'validate-form-submission.js')
const source = fs.readFileSync(functionPath, 'utf8')

function loadHandler({ submitForm }) {
  const module = { exports: {} }
  const sandbox = {
    Buffer,
    URLSearchParams,
    console,
    process: {
      env: {},
    },
    module,
    exports: module.exports,
    require(request) {
      const stubs = {
        './utils/rate-limiter': {
          checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9 }),
          getRateLimitHeaders: () => ({}),
          getClientIP: () => '203.0.113.10',
        },
        './utils/input-sanitizer': {
          sanitizeFormData: (data) => data,
        },
        './utils/cors-config': {
          getSecurityHeaders: () => ({ 'content-type': 'application/json' }),
        },
        './utils/security-logger': {
          logFormSubmission: () => {},
          logBotDetected: () => {},
          logRecaptcha: () => {},
          logRateLimit: () => {},
          logInjectionAttempt: () => {},
          EVENT_TYPES: {},
        },
        './utils/request-fingerprint': {
          validateRequestFingerprint: () => ({ isBot: false }),
        },
        './utils/ip-reputation': {
          validateIP: async () => ({ allowed: true }),
          addToBlacklist: async () => {},
        },
        './utils/behavioral-analysis': {
          validateSubmissionBehavior: async () => ({ allowed: true }),
        },
        './utils/email-domain-validator': {
          validateEmailDomain: async () => ({ valid: true }),
        },
        './utils/blobs-store': {
          initBlobsStores: () => ({ initialized: true }),
        },
        './utils/ghl-client': {
          submitForm,
        },
      }

      if (!stubs[request]) {
        throw new Error(`Unexpected require: ${request}`)
      }
      return stubs[request]
    },
  }

  vm.runInNewContext(source, sandbox, { filename: functionPath })
  return module.exports.handler
}

async function testGhlFailureReturnsError() {
  const handler = loadHandler({
    submitForm: async () => {
      const err = new Error('GHL POST /contacts/upsert failed: HTTP 503')
      err.status = 503
      throw err
    },
  })

  const body = new URLSearchParams({
    'form-name': 'contact-general',
    'form-type': 'contact-general',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Please contact me.',
    consent: 'yes',
    'form-load-time': String(Date.now() - 5000),
  }).toString()

  const response = await handler(
    {
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-form-submission',
      headers: {
        origin: 'https://www.acdrainwiz.com',
        'user-agent': 'Mozilla/5.0 regression test',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    },
    {}
  )

  assert.equal(response.statusCode, 502)
  assert.deepEqual(JSON.parse(response.body), {
    success: false,
    error: 'Submission failed',
    message: 'We could not process your submission. Please try again.',
  })
}

async function main() {
  await testGhlFailureReturnsError()
  console.log('validate-form-submission tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
