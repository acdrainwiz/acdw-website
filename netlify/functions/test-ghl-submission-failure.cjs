const assert = require('assert')

process.env.RECAPTCHA_SECRET_KEY = ''

const emailDomainValidator = require('./utils/email-domain-validator')
const ghlClient = require('./utils/ghl-client')

emailDomainValidator.validateEmailDomain = async () => ({ valid: true })

const originalSubmitForm = ghlClient.submitForm
ghlClient.submitForm = async () => {
  throw new Error('simulated GHL outage')
}

const { handler } = require('./validate-form-submission')

function buildEvent() {
  const body = new URLSearchParams({
    'form-name': 'trash-the-float-story',
    'form-type': 'trash-the-float-story',
    firstName: 'Taylor',
    lastName: 'Contractor',
    email: 'taylor@example.com',
    phone: '(555) 123-4567',
    cityState: 'Miami, FL',
    city: 'Miami, FL',
    instagramHandle: '@taylorhvac',
    audience: 'Contractor',
    storyBody:
      'A float switch failed during peak season and caused a callback with ceiling damage.',
    damageImpact: '$2,400 repair and two callbacks',
    mediaUrl: '',
    consent: 'yes',
    rulesConsent: 'yes',
    'form-load-time': String(Date.now() - 10_000),
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
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'x-forwarded-for': '198.51.100.25',
    },
    body,
  }
}

async function run() {
  try {
    const response = await handler(buildEvent(), {})
    const parsed = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(parsed.success, false)
    assert.match(parsed.message, /could not submit/i)

    console.log('PASS: GHL submission failures are returned as user-visible failures')
  } finally {
    ghlClient.submitForm = originalSubmitForm
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
