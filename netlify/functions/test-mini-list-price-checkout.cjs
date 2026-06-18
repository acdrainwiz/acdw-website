const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

function loadGetPriceIdHandler() {
  const functionPath = path.join(__dirname, 'get-price-id.js')
  const source = fs.readFileSync(functionPath, 'utf8')
  const module = { exports: {} }

  const stripeRetrieveCalls = []
  const stripeMock = () => ({
    prices: {
      retrieve: async (priceId) => {
        stripeRetrieveCalls.push(priceId)
        return {
          unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 5017,
          currency: 'usd',
        }
      },
    },
  })

  const requireMock = (request) => {
    if (request === 'stripe') return stripeMock
    if (request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true }),
        getRateLimitHeaders: () => ({}),
        getClientIP: () => '127.0.0.1',
      }
    }
    if (request === './utils/security-logger') {
      return {
        logAPIAccess: () => {},
        logRateLimit: () => {},
        EVENT_TYPES: {},
      }
    }
    throw new Error(`Unexpected require: ${request}`)
  }

  vm.runInNewContext(source, {
    require: requireMock,
    exports: module.exports,
    module,
    process,
    console,
  }, { filename: functionPath })

  return {
    handler: module.exports.handler,
    stripeRetrieveCalls,
  }
}

function post(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'user-agent': 'mini-list-price-test',
    },
    body: JSON.stringify(body),
  }
}

async function expectPriceId(handler, requestBody, expectedPriceId, expectedTier) {
  const response = await handler(post(requestBody), {})
  assert.strictEqual(response.statusCode, 200, response.body)

  const payload = JSON.parse(response.body)
  assert.strictEqual(payload.priceId, expectedPriceId)
  assert.strictEqual(payload.tier, expectedTier)
  return payload
}

async function runTests() {
  process.env.STRIPE_SECRET_KEY = 'sk_test_stub'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_wrong_mini_hvac_t1'
  process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_wrong_mini_hvac_t2'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_mini_hvac_t3'
  process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_wrong_mini_pm_t1'
  process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_wrong_mini_pm_t2'
  process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_wrong_mini_pm_t3'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T1 = 'price_sensor_hvac_t1'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

  const { handler, stripeRetrieveCalls } = loadGetPriceIdHandler()

  const hvacMini = await expectPriceId(
    handler,
    { product: 'mini', quantity: 25, role: 'hvac_pro' },
    'price_mini_homeowner',
    'msrp'
  )
  assert.strictEqual(hvacMini.unitPrice, 49.99)

  await expectPriceId(
    handler,
    { product: 'mini', quantity: 600, role: 'property_manager' },
    'price_mini_homeowner',
    'msrp'
  )

  await expectPriceId(
    handler,
    { product: 'sensor', quantity: 25, role: 'hvac_pro' },
    'price_sensor_hvac_t2',
    'tier_2'
  )

  assert.deepStrictEqual(stripeRetrieveCalls, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t2',
  ])

  console.log('Mini list-price checkout regression tests passed')
}

runTests().catch((error) => {
  console.error(error)
  process.exit(1)
})
