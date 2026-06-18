const assert = require('assert')

function testStaleFormLoadTimeIsAllowed() {
  const { validateFormLoadTime } = require('./utils/behavioral-analysis')
  const realNow = Date.now
  const now = 1_800_000_000_000

  try {
    Date.now = () => now

    const staleResult = validateFormLoadTime(String(now - 20 * 60 * 1000))
    assert.strictEqual(
      staleResult.suspicious,
      false,
      'stale form-load-time should not silently drop legitimate long-session submissions'
    )

    const tooFastResult = validateFormLoadTime(String(now - 500))
    assert.strictEqual(
      tooFastResult.suspicious,
      true,
      'too-fast submissions should still be flagged'
    )
  } finally {
    Date.now = realNow
  }
}

function clearHandlerModuleCache() {
  for (const modulePath of [
    './validate-form-submission',
    './utils/rate-limiter',
    './utils/email-domain-validator',
    './utils/ip-reputation',
    './utils/ghl-client',
  ]) {
    delete require.cache[require.resolve(modulePath)]
  }
}

function buildTrashTheFloatEvent() {
  const body = new URLSearchParams({
    'form-name': 'trash-the-float-story',
    'form-type': 'trash-the-float-story',
    firstName: 'Test',
    lastName: 'Submitter',
    fullName: 'Test Submitter',
    email: 'test@example.com',
    phone: '555-555-5555',
    cityState: 'Miami, FL',
    city: 'Miami, FL',
    instagramHandle: '@testsubmitter',
    audience: 'Contractor',
    storyBody: 'This is a regression test story with enough detail to pass validation.',
    message: 'This is a regression test story with enough detail to pass validation.',
    damageImpact: '',
    mediaUrl: '',
    consent: 'yes',
    rulesConsent: 'yes',
    'form-load-time': String(Date.now() - 5_000),
    'recaptcha-token': '',
    'bot-field': '',
    'honeypot-1': '',
    'honeypot-2': '',
  })

  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/trash-the-float',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'x-forwarded-for': '203.0.113.10',
    },
    body: body.toString(),
  }
}

async function testGhlFailureReturnsFailureResponse() {
  clearHandlerModuleCache()

  const rateLimiter = require('./utils/rate-limiter')
  rateLimiter.checkRateLimit = async () => ({
    allowed: true,
    remaining: 9,
    limit: 10,
    resetTime: Date.now() + 60_000,
    retryAfter: 0,
  })

  const emailDomainValidator = require('./utils/email-domain-validator')
  emailDomainValidator.validateEmailDomain = async () => ({ valid: true })

  const ipReputation = require('./utils/ip-reputation')
  ipReputation.validateIP = async () => ({ allowed: true })
  ipReputation.addToBlacklist = async () => ({ success: true })

  let submittedType = null
  const ghlClient = require('./utils/ghl-client')
  ghlClient.submitForm = async (formType) => {
    submittedType = formType
    throw new Error('simulated GHL outage')
  }

  const { handler } = require('./validate-form-submission')
  const response = await handler(buildTrashTheFloatEvent(), {})
  const parsed = JSON.parse(response.body)

  assert.strictEqual(submittedType, 'trash-the-float-story')
  assert.strictEqual(response.statusCode, 502)
  assert.strictEqual(parsed.success, false)
  assert.match(parsed.message, /could not save/i)
}

async function run() {
  testStaleFormLoadTimeIsAllowed()
  await testGhlFailureReturnsFailureResponse()
  console.log('Critical form submission regression tests passed.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
