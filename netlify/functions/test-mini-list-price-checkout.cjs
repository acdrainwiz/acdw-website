const assert = require('assert')
const Module = require('module')

process.env.STRIPE_SECRET_KEY = 'sk_test_mini_list_price'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_mini_hvac_t2'
process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
process.env.STRIPE_PRICE_SENSOR_HOMEOWNER = 'price_sensor_homeowner'
process.env.STRIPE_PRICE_SENSOR_HVAC_T1 = 'price_sensor_hvac_t1'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'
process.env.STRIPE_PRICE_SENSOR_PM_T1 = 'price_sensor_pm_t1'
process.env.STRIPE_PRICE_SENSOR_PM_T2 = 'price_sensor_pm_t2'
process.env.STRIPE_PRICE_SENSOR_PM_T3 = 'price_sensor_pm_t3'
process.env.STRIPE_PRICE_BUNDLE_HOMEOWNER = 'price_bundle_homeowner'
process.env.STRIPE_PRICE_BUNDLE_HVAC_T1 = 'price_bundle_hvac_t1'
process.env.STRIPE_PRICE_BUNDLE_HVAC_T2 = 'price_bundle_hvac_t2'
process.env.STRIPE_PRICE_BUNDLE_HVAC_T3 = 'price_bundle_hvac_t3'
process.env.STRIPE_PRICE_BUNDLE_PM_T1 = 'price_bundle_pm_t1'
process.env.STRIPE_PRICE_BUNDLE_PM_T2 = 'price_bundle_pm_t2'
process.env.STRIPE_PRICE_BUNDLE_PM_T3 = 'price_bundle_pm_t3'

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_mini_hvac_t1: 7167,
  price_mini_hvac_t2: 6500,
  price_mini_hvac_t3: 5800,
  price_mini_pm_t1: 6450,
  price_mini_pm_t2: 5850,
  price_mini_pm_t3: 5220,
  price_sensor_hvac_t1: 5017,
  price_sensor_hvac_t2: 4550,
  price_sensor_hvac_t3: 4060,
  price_sensor_pm_t1: 4515,
  price_sensor_pm_t2: 4095,
  price_sensor_pm_t3: 3654,
}

const originalLoad = Module._load
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          assert.ok(priceAmounts[priceId], `unexpected Stripe price lookup: ${priceId}`)
          return { id: priceId, unit_amount: priceAmounts[priceId], currency: 'usd' }
        },
      },
    })
  }

  if (request === './utils/rate-limiter') {
    return {
      checkRateLimit: async () => ({ allowed: true, remaining: 99, limit: 100, resetTime: Date.now() + 60000 }),
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

const { handler } = require('./get-price-id')

function makeEvent(body) {
  return {
    httpMethod: 'POST',
    headers: { 'user-agent': 'mini-list-price-test' },
    body: JSON.stringify(body),
  }
}

async function requestPrice(body) {
  const response = await handler(makeEvent(body), {})
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body),
  }
}

async function run() {
  const hvacMini = await requestPrice({ product: 'mini', quantity: 10, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.body.tier, 'msrp')
  assert.strictEqual(hvacMini.body.unitPrice, 49.99)

  const propertyManagerMini = await requestPrice({ product: 'mini', quantity: 600, role: 'property_manager' })
  assert.strictEqual(propertyManagerMini.statusCode, 200)
  assert.strictEqual(propertyManagerMini.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(propertyManagerMini.body.tier, 'msrp')
  assert.strictEqual(propertyManagerMini.body.quantity, 600)

  const hvacSensor = await requestPrice({ product: 'sensor', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(hvacSensor.body.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensor.body.tier, 'tier_2')
  assert.strictEqual(hvacSensor.body.unitPrice, 45.5)

  const largeSensor = await requestPrice({ product: 'sensor', quantity: 600, role: 'property_manager' })
  assert.strictEqual(largeSensor.statusCode, 400)
  assert.strictEqual(largeSensor.body.requiresContact, true)

  console.log('Mini list-price checkout regression test passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => {
    Module._load = originalLoad
  })
