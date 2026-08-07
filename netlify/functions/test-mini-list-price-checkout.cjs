const assert = require('assert')
const Module = require('module')

process.env.STRIPE_SECRET_KEY = 'sk_test_mini_list_price'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'

const originalLoad = Module._load

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          const prices = {
            price_mini_homeowner: { unit_amount: 4999, currency: 'usd' },
            price_mini_hvac_t1: { unit_amount: 7167, currency: 'usd' },
            price_mini_pm_t1: { unit_amount: 6450, currency: 'usd' },
            price_sensor_hvac_t2: { unit_amount: 4550, currency: 'usd' },
          }

          if (!prices[priceId]) {
            const error = new Error(`No such price: ${priceId}`)
            error.type = 'StripeInvalidRequestError'
            error.code = 'resource_missing'
            throw error
          }

          return prices[priceId]
        },
      },
    })
  }

  if (request === './utils/rate-limiter') {
    return {
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, reset: Date.now() + 60000 }),
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

  return originalLoad(request, parent, isMain)
}

const { handler } = require('./get-price-id.js')

async function invoke(body) {
  const response = await handler(
    {
      httpMethod: 'POST',
      headers: { 'user-agent': 'test' },
      body: JSON.stringify(body),
    },
    {}
  )

  return {
    ...response,
    json: JSON.parse(response.body),
  }
}

async function run() {
  const hvacMini = await invoke({ product: 'mini', quantity: 10, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.json.tier, 'msrp')
  assert.strictEqual(hvacMini.json.unitPrice, 49.99)

  const largePmMini = await invoke({ product: 'mini', quantity: 600, role: 'property_manager' })
  assert.strictEqual(largePmMini.statusCode, 200)
  assert.strictEqual(largePmMini.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(largePmMini.json.quantity, 600)

  const hvacSensor = await invoke({ product: 'sensor', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(hvacSensor.json.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensor.json.tier, 'tier_2')

  const largeSensor = await invoke({ product: 'sensor', quantity: 501, role: 'hvac_pro' })
  assert.strictEqual(largeSensor.statusCode, 400)
  assert.strictEqual(largeSensor.json.requiresContact, true)

  console.log('Mini list-price checkout regression tests passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
