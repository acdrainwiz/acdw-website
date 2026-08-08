const assert = require('node:assert/strict')
const Module = require('node:module')

const priceUnits = {
  price_mini_homeowner: 4999,
  price_sensor_hvac_t2: 4550,
}

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

const originalLoad = Module._load
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => ({
          unit_amount: priceUnits[priceId] || 9999,
          currency: 'usd',
        }),
      },
    })
  }
  if (request === '@netlify/blobs') {
    return {
      getStore: () => ({
        get: async () => null,
        setJSON: async () => undefined,
      }),
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

const { handler } = require('./get-price-id.js')

function post(body) {
  return handler(
    {
      httpMethod: 'POST',
      headers: {
        'user-agent': 'mini-price-test',
        'x-forwarded-for': '127.0.0.1',
      },
      body: JSON.stringify(body),
    },
    {}
  )
}

async function run() {
  const hvacMini = await post({ product: 'mini', quantity: 25, role: 'hvac_pro' })
  assert.equal(hvacMini.statusCode, 200)
  const hvacMiniBody = JSON.parse(hvacMini.body)
  assert.equal(hvacMiniBody.priceId, 'price_mini_homeowner')
  assert.equal(hvacMiniBody.tier, 'msrp')
  assert.equal(hvacMiniBody.unitPrice, 49.99)

  const pmMiniLarge = await post({ product: 'mini', quantity: 501, role: 'property_manager' })
  assert.equal(pmMiniLarge.statusCode, 200)
  const pmMiniLargeBody = JSON.parse(pmMiniLarge.body)
  assert.equal(pmMiniLargeBody.priceId, 'price_mini_homeowner')
  assert.equal(pmMiniLargeBody.tier, 'msrp')

  const hvacSensor = await post({ product: 'sensor', quantity: 25, role: 'hvac_pro' })
  assert.equal(hvacSensor.statusCode, 200)
  const hvacSensorBody = JSON.parse(hvacSensor.body)
  assert.equal(hvacSensorBody.priceId, 'price_sensor_hvac_t2')
  assert.equal(hvacSensorBody.tier, 'tier_2')
  assert.equal(hvacSensorBody.unitPrice, 45.5)

  const sensorTooLarge = await post({ product: 'sensor', quantity: 501, role: 'hvac_pro' })
  assert.equal(sensorTooLarge.statusCode, 400)
  assert.equal(JSON.parse(sensorTooLarge.body).requiresContact, true)

  console.log('Mini list-price checkout tests passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
