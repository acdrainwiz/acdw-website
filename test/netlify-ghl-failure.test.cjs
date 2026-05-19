const assert = require('node:assert/strict')
const fs = require('node:fs')
const Module = require('node:module')
const path = require('node:path')

const functionPath = path.join(__dirname, '..', 'netlify', 'functions', 'validate-form-submission.js')

function loadHandler({ submitForm }) {
  const source = fs.readFileSync(functionPath, 'utf8')
  const originalLoad = Module._load

  Module._load = function patchedLoad(request, parent, isMain) {
    const stubs = {
      './utils/rate-limiter': {
        checkRateLimit: async () => ({ allowed: true, limit: 10, remaining: 9 }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '203.0.113.10',
      },
      './utils/input-sanitizer': {
        sanitizeFormData: (data) => ({ ...data }),
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

    if (Object.prototype.hasOwnProperty.call(stubs, request)) {
      return stubs[request]
    }
    return originalLoad.call(this, request, parent, isMain)
  }

  try {
    const mod = new Module(functionPath, module.parent)
    mod.filename = functionPath
    mod.paths = Module._nodeModulePaths(path.dirname(functionPath))
    mod._compile(source, functionPath)
    return mod.exports.handler
  } finally {
    Module._load = originalLoad
  }
}

function validContactEvent() {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      'user-agent': 'Mozilla/5.0',
    },
    body: new URLSearchParams({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      message: 'Please contact me.',
      consent: 'yes',
      'form-load-time': String(Date.now() - 5000),
    }).toString(),
  }
}

async function testGhlFailureReturnsError() {
  const handler = loadHandler({
    submitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })

  const response = await handler(validContactEvent(), {})
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 502)
  assert.equal(body.success, false)
  assert.equal(body.error, 'Submission failed')
}

async function testGhlSuccessReturnsSuccess() {
  const handler = loadHandler({
    submitForm: async () => ({
      contactId: 'contact_123',
      isNew: true,
      traceId: 'trace_123',
      warnings: [],
    }),
  })

  const response = await handler(validContactEvent(), {})
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 200)
  assert.equal(body.success, true)
}

async function run() {
  await testGhlFailureReturnsError()
  await testGhlSuccessReturnsSuccess()
  console.log('netlify-ghl-failure tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
