const assert = require('assert')
const path = require('path')

const functionDir = __dirname

const PAYMENT_FUNCTIONS = [
  'get-price-id.js',
  'create-checkout.js',
  'create-payment-intent.js',
  'update-payment-intent.js',
]

function loadHandler(fileName) {
  const handlerPath = path.join(functionDir, fileName)
  delete require.cache[require.resolve(handlerPath)]
  return require(handlerPath).handler
}

function postEvent() {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 purchasing-kill-switch-test',
    },
    body: '{}',
  }
}

async function assertPurchasingDisabled(fileName) {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  process.env.STRIPE_SECRET_KEY = 'sk_test_123'

  const handler = loadHandler(fileName)
  const response = await handler(postEvent(), {})
  const body = JSON.parse(response.body)

  assert.strictEqual(response.statusCode, 503, `${fileName} should reject while purchasing is disabled`)
  assert.strictEqual(body.purchasingEnabled, false)
  assert.match(body.error, /not available/i)
}

async function run() {
  for (const fileName of PAYMENT_FUNCTIONS) {
    await assertPurchasingDisabled(fileName)
  }
  console.log('Purchasing kill switch regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
