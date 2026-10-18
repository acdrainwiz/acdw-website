const assert = require('assert')

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
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

const stripeModulePath = require.resolve('stripe')
require.cache[stripeModulePath] = {
  id: stripeModulePath,
  filename: stripeModulePath,
  loaded: true,
  exports: () => ({
    prices: {
      retrieve: async (priceId) => ({
        id: priceId,
        unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 5017,
        currency: 'usd',
      }),
    },
  }),
}

const { handler } = require('./get-price-id.js')

function makeEvent(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'user-agent': 'mini-price-regression-test',
      'x-forwarded-for': '203.0.113.10',
    },
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
  const hvacMini = await requestPrice({ product: 'mini', quantity: 2, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.body.unitPrice, 49.99)

  const pmMini = await requestPrice({ product: 'mini', quantity: 100, role: 'property_manager' })
  assert.strictEqual(pmMini.statusCode, 200)
  assert.strictEqual(pmMini.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(pmMini.body.unitPrice, 49.99)

  const hvacSensor = await requestPrice({ product: 'sensor', quantity: 21, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(hvacSensor.body.priceId, 'price_sensor_hvac_t2')

  console.log('Mini list-price checkout regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
