const assert = require('assert')
const Module = require('module')

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_mini_hvac_t2'
process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_SENSOR_HOMEOWNER = 'price_sensor_homeowner'
process.env.STRIPE_PRICE_SENSOR_HVAC_T1 = 'price_sensor_hvac_t1'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_mini_hvac_t1: 7167,
  price_mini_hvac_t2: 6500,
  price_mini_hvac_t3: 5800,
  price_mini_pm_t1: 6450,
  price_sensor_hvac_t1: 5017,
  price_sensor_hvac_t2: 4550,
  price_sensor_hvac_t3: 4060,
}

const originalLoad = Module._load
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          if (!priceAmounts[priceId]) {
            throw new Error(`Unexpected Stripe price id: ${priceId}`)
          }
          return { unit_amount: priceAmounts[priceId], currency: 'usd' }
        },
      },
    })
  }

  if (request.endsWith('/utils/rate-limiter') || request === './utils/rate-limiter') {
    return {
      checkRateLimit: async () => ({ allowed: true, remaining: 29, limit: 30, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    }
  }

  if (request.endsWith('/utils/security-logger') || request === './utils/security-logger') {
    return {
      logAPIAccess: () => {},
      logRateLimit: () => {},
      EVENT_TYPES: {},
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

const { handler } = require('./get-price-id')

function post(body) {
  return handler({
    httpMethod: 'POST',
    headers: { 'user-agent': 'mini-list-price-test' },
    body: JSON.stringify(body),
  }, {})
}

async function run() {
  const hvacMini = await post({ product: 'mini', quantity: 750, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  const hvacMiniBody = JSON.parse(hvacMini.body)
  assert.strictEqual(hvacMiniBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMiniBody.role, 'hvac_pro')
  assert.strictEqual(hvacMiniBody.pricingRole, 'homeowner')
  assert.strictEqual(hvacMiniBody.tier, 'msrp')
  assert.strictEqual(hvacMiniBody.unitPrice, 49.99)

  const pmMini = await post({ product: 'mini', quantity: 1, role: 'property_manager' })
  assert.strictEqual(pmMini.statusCode, 200)
  const pmMiniBody = JSON.parse(pmMini.body)
  assert.strictEqual(pmMiniBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(pmMiniBody.pricingRole, 'homeowner')
  assert.strictEqual(pmMiniBody.unitPrice, 49.99)

  const hvacSensor = await post({ product: 'sensor', quantity: 21, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  const hvacSensorBody = JSON.parse(hvacSensor.body)
  assert.strictEqual(hvacSensorBody.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensorBody.role, 'hvac_pro')
  assert.strictEqual(hvacSensorBody.pricingRole, 'hvac_pro')
  assert.strictEqual(hvacSensorBody.tier, 'tier_2')
  assert.strictEqual(hvacSensorBody.unitPrice, 45.5)

  console.log('Mini list-price checkout regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
}).finally(() => {
  Module._load = originalLoad
})
