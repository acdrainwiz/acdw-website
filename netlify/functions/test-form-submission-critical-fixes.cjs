const assert = require('node:assert/strict')
const path = require('node:path')

const functionDir = __dirname
const handlerPath = path.join(functionDir, 'validate-form-submission.js')
const ghlClientPath = path.join(functionDir, 'utils', 'ghl-client.js')
const emailValidatorPath = path.join(functionDir, 'utils', 'email-domain-validator.js')
const ipReputationPath = path.join(functionDir, 'utils', 'ip-reputation.js')

function clearHandlerModules() {
  for (const modulePath of [handlerPath, ghlClientPath, emailValidatorPath, ipReputationPath]) {
    delete require.cache[require.resolve(modulePath)]
  }
}

function loadHandler({
  submitForm = async () => ({ contactId: 'contact-123', isNew: false, traceId: 'trace-123', warnings: [] }),
  addToBlacklist = async () => ({ success: true }),
} = {}) {
  clearHandlerModules()

  require.cache[require.resolve(ghlClientPath)] = {
    id: ghlClientPath,
    filename: ghlClientPath,
    loaded: true,
    exports: { submitForm },
  }
  require.cache[require.resolve(emailValidatorPath)] = {
    id: emailValidatorPath,
    filename: emailValidatorPath,
    loaded: true,
    exports: {
      validateEmailDomain: async () => ({ valid: true }),
    },
  }
  require.cache[require.resolve(ipReputationPath)] = {
    id: ipReputationPath,
    filename: ipReputationPath,
    loaded: true,
    exports: {
      validateIP: async () => ({ allowed: true }),
      addToBlacklist,
    },
  }

  return require(handlerPath).handler
}

function buildTrashTheFloatBody(overrides = {}) {
  const fields = {
    'form-name': 'trash-the-float-story',
    'form-type': 'trash-the-float-story',
    firstName: 'Casey',
    lastName: 'Rivera',
    fullName: 'Casey Rivera',
    email: 'casey@example.com',
    phone: '(555) 123-4567',
    cityState: 'Miami, FL',
    city: 'Miami, FL',
    instagramHandle: '@caseyrivera',
    audience: 'Homeowner',
    storyBody: 'A clogged float switch caused a real cleanup problem before I found a better maintenance path.',
    message: 'A clogged float switch caused a real cleanup problem before I found a better maintenance path.',
    damageImpact: 'Ceiling stain and an emergency service call.',
    mediaUrl: '',
    consent: 'yes',
    rulesConsent: 'yes',
    'form-load-time': String(Date.now() - 30_000),
    'recaptcha-token': '',
    'bot-field': '',
    'honeypot-1': '',
    'honeypot-2': '',
    ...overrides,
  }

  return new URLSearchParams(fields).toString()
}

function buildEvent(body, ip = '203.0.113.10') {
  return {
    httpMethod: 'POST',
    path: '/.netlify/functions/validate-form-submission',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://www.acdrainwiz.com',
      referer: 'https://www.acdrainwiz.com/trash-the-float',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'x-forwarded-for': ip,
    },
    body,
  }
}

async function testGhlFailureIsNotReportedAsSuccess() {
  const handler = loadHandler({
    submitForm: async () => {
      throw new Error('GHL unavailable')
    },
  })

  const response = await handler(buildEvent(buildTrashTheFloatBody()), {})
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 502)
  assert.equal(body.success, false)
  assert.match(body.message, /could not save/i)
}

async function testExpiredFormLoadTimeIsUserVisibleAndDoesNotBlacklist() {
  let blacklistCalls = 0
  let submitCalls = 0
  const handler = loadHandler({
    submitForm: async () => {
      submitCalls += 1
      return { contactId: 'contact-123', isNew: false, traceId: 'trace-123', warnings: [] }
    },
    addToBlacklist: async () => {
      blacklistCalls += 1
      return { success: true }
    },
  })

  const expiredLoadTime = String(Date.now() - 16 * 60 * 1000)
  const response = await handler(
    buildEvent(buildTrashTheFloatBody({ 'form-load-time': expiredLoadTime }), '203.0.113.11'),
    {},
  )
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 400)
  assert.equal(body.success, false)
  assert.match(body.message, /refresh/i)
  assert.equal(submitCalls, 0)
  assert.equal(blacklistCalls, 0)
}

async function run() {
  await testGhlFailureIsNotReportedAsSuccess()
  await testExpiredFormLoadTimeIsUserVisibleAndDoesNotBlacklist()
  clearHandlerModules()
  console.log('critical form submission regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
