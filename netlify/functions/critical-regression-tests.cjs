const assert = require('node:assert/strict')

function clearModule(modulePath) {
  delete require.cache[require.resolve(modulePath)]
}

async function testExpiredFormLoadTimeStillAttemptsPersistence() {
  const validatePath = './validate-form-submission.js'
  const ghlClientPath = './utils/ghl-client.js'
  const emailValidatorPath = './utils/email-domain-validator.js'

  delete process.env.RECAPTCHA_SECRET_KEY
  clearModule(validatePath)
  clearModule(ghlClientPath)
  clearModule(emailValidatorPath)

  require.cache[require.resolve(ghlClientPath)] = {
    id: require.resolve(ghlClientPath),
    filename: require.resolve(ghlClientPath),
    loaded: true,
    exports: {
      submitForm: async () => {
        throw Object.assign(new Error('simulated persistence outage'), {
          name: 'GhlApiError',
          status: 503,
          traceId: 'test-trace',
        })
      },
    },
  }

  require.cache[require.resolve(emailValidatorPath)] = {
    id: require.resolve(emailValidatorPath),
    filename: require.resolve(emailValidatorPath),
    loaded: true,
    exports: {
      validateEmailDomain: async () => ({ valid: true }),
    },
  }

  const { handler } = require(validatePath)
  const body = new URLSearchParams({
    'form-name': 'trash-the-float-story',
    'form-type': 'trash-the-float-story',
    firstName: 'Jane',
    lastName: 'Tester',
    fullName: 'Jane Tester',
    email: 'jane@acdrainwiz.com',
    cityState: 'Tampa, FL',
    city: 'Tampa, FL',
    instagramHandle: '@janetester',
    audience: 'Contractor',
    storyBody: 'This is a realistic story submission that takes more than thirty characters.',
    message: 'This is a realistic story submission that takes more than thirty characters.',
    mediaUrl: 'https://example.com/story-photo.jpg',
    consent: 'yes',
    rulesConsent: 'yes',
    'form-load-time': String(Date.now() - 16 * 60 * 1000),
  }).toString()

  const response = await handler({
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      origin: 'https://www.acdrainwiz.com',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'x-forwarded-for': '203.0.113.10',
    },
    body,
    isBase64Encoded: false,
  }, {})

  assert.equal(response.statusCode, 502)
  const parsed = JSON.parse(response.body)
  assert.equal(parsed.success, false)
  assert.equal(parsed.error, 'Submission service unavailable')
}

async function testFormLoadTimeAllowsLongLegitimateSessions() {
  const { validateFormLoadTime } = require('./utils/behavioral-analysis.js')
  const result = validateFormLoadTime(String(Date.now() - 16 * 60 * 1000))

  assert.equal(result.suspicious, false)
  assert.ok(result.timeSinceLoad >= 16 * 60 * 1000)
}

async function testUploadRejectsNonJpegPngMimeTypes() {
  process.env.GHL_PIT_TOKEN = 'test-token'
  process.env.GHL_LOCATION_ID = 'test-location'

  const uploadPath = './upload-image.js'
  clearModule(uploadPath)

  const originalFetch = global.fetch
  global.fetch = async () => {
    throw new Error('upload should not call GHL for invalid MIME types')
  }

  try {
    const { handler } = require(uploadPath)
    const response = await handler({
      httpMethod: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        formType: 'trash-the-float-story',
        imageData: `data:image/svg+xml;base64,${Buffer.from('<svg></svg>').toString('base64')}`,
      }),
    }, {})

    assert.equal(response.statusCode, 400)
    assert.match(JSON.parse(response.body).error, /JPEG or PNG/)
  } finally {
    global.fetch = originalFetch
  }
}

async function testUploadRejectsSpoofedPngPayloads() {
  process.env.GHL_PIT_TOKEN = 'test-token'
  process.env.GHL_LOCATION_ID = 'test-location'

  const uploadPath = './upload-image.js'
  clearModule(uploadPath)

  const originalFetch = global.fetch
  global.fetch = async () => {
    throw new Error('upload should not call GHL for invalid image signatures')
  }

  try {
    const { handler } = require(uploadPath)
    const response = await handler({
      httpMethod: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        formType: 'trash-the-float-story',
        imageData: `data:image/png;base64,${Buffer.from('<svg></svg>').toString('base64')}`,
      }),
    }, {})

    assert.equal(response.statusCode, 400)
    assert.match(JSON.parse(response.body).error, /valid JPEG or PNG/)
  } finally {
    global.fetch = originalFetch
  }
}

async function main() {
  await testFormLoadTimeAllowsLongLegitimateSessions()
  await testExpiredFormLoadTimeStillAttemptsPersistence()
  await testUploadRejectsNonJpegPngMimeTypes()
  await testUploadRejectsSpoofedPngPayloads()
  console.log('critical regression tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
