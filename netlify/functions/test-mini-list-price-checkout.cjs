const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

function loadGetPriceIdHandler() {
  const source = fs.readFileSync(path.join(__dirname, 'get-price-id.js'), 'utf8')
  const retrievedPriceIds = []

  const env = {
    ...process.env,
    STRIPE_SECRET_KEY: 'sk_test_mock',
    STRIPE_PRICE_MINI_HOMEOWNER: 'price_mini_homeowner',
    STRIPE_PRICE_MINI_HVAC_T1: 'price_mini_hvac_t1',
    STRIPE_PRICE_MINI_HVAC_T2: 'price_mini_hvac_t2',
    STRIPE_PRICE_MINI_HVAC_T3: 'price_mini_hvac_t3',
    STRIPE_PRICE_MINI_PM_T1: 'price_mini_pm_t1',
    STRIPE_PRICE_MINI_PM_T2: 'price_mini_pm_t2',
    STRIPE_PRICE_MINI_PM_T3: 'price_mini_pm_t3',
    STRIPE_PRICE_SENSOR_HOMEOWNER: 'price_sensor_homeowner',
    STRIPE_PRICE_SENSOR_HVAC_T1: 'price_sensor_hvac_t1',
    STRIPE_PRICE_SENSOR_HVAC_T2: 'price_sensor_hvac_t2',
    STRIPE_PRICE_SENSOR_HVAC_T3: 'price_sensor_hvac_t3',
  }

  const module = { exports: {} }
  const sandbox = {
    module,
    exports: module.exports,
    process: { env },
    console,
    require: (request) => {
      if (request === 'stripe') {
        return () => ({
          prices: {
            retrieve: async (priceId) => {
              retrievedPriceIds.push(priceId)
              const unitAmounts = {
                price_mini_homeowner: 4999,
                price_mini_hvac_t1: 7167,
                price_mini_hvac_t2: 6500,
                price_mini_hvac_t3: 5800,
                price_mini_pm_t1: 6450,
                price_mini_pm_t2: 5850,
                price_mini_pm_t3: 5220,
                price_sensor_hvac_t2: 4550,
              }
              if (!unitAmounts[priceId]) {
                const err = new Error(`No such price: ${priceId}`)
                err.type = 'StripeInvalidRequestError'
                err.code = 'resource_missing'
                throw err
              }
              return { unit_amount: unitAmounts[priceId], currency: 'usd' }
            },
          },
        })
      }

      if (request === './utils/rate-limiter') {
        return {
          checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
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
    },
  }

  vm.runInNewContext(source, sandbox, { filename: 'get-price-id.js' })
  return { handler: module.exports.handler, retrievedPriceIds }
}

async function post(handler, body) {
  const response = await handler(
    {
      httpMethod: 'POST',
      headers: { 'user-agent': 'mini-price-test' },
      body: JSON.stringify(body),
    },
    {},
  )

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body),
  }
}

async function run() {
  const { handler, retrievedPriceIds } = loadGetPriceIdHandler()

  let response = await post(handler, { product: 'mini', quantity: 10, role: 'hvac_pro' })
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(response.body.role, 'hvac_pro')
  assert.strictEqual(response.body.tier, 'msrp')
  assert.strictEqual(response.body.unitPrice, 49.99)

  response = await post(handler, { product: 'mini', quantity: 750, role: 'property_manager' })
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(response.body.tier, 'msrp')

  response = await post(handler, { product: 'sensor', quantity: 21, role: 'hvac_pro' })
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.body.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(response.body.tier, 'tier_2')

  response = await post(handler, { product: 'sensor', quantity: 501, role: 'hvac_pro' })
  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(response.body.requiresContact, true)

  assert.deepStrictEqual(retrievedPriceIds, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t2',
  ])

  console.log('PASS mini list-price checkout regression')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
