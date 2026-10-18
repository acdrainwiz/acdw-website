const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const stripeCalls = []

Module._load = function mockLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          stripeCalls.push(priceId)
          const amounts = {
            price_mini_homeowner: 4999,
            price_mini_hvac_t1: 7167,
            price_mini_pm_t2: 5850,
            price_sensor_hvac_t1: 5017,
          }
          return {
            id: priceId,
            unit_amount: amounts[priceId],
            currency: 'usd',
          }
        },
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

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
process.env.STRIPE_PRICE_SENSOR_HVAC_T1 = 'price_sensor_hvac_t1'

const { handler } = require('./get-price-id.js')

function event(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'x-forwarded-for': `127.0.0.${stripeCalls.length + 1}`,
      'user-agent': 'mini-list-price-test',
    },
    body: JSON.stringify(body),
  }
}

async function requestPrice(body) {
  const response = await handler(event(body), {})
  const payload = JSON.parse(response.body)
  return { response, payload }
}

async function run() {
  const hvacMini = await requestPrice({ product: 'mini', quantity: 1, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.response.statusCode, 200)
  assert.strictEqual(hvacMini.payload.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.payload.role, 'homeowner')
  assert.strictEqual(hvacMini.payload.tier, 'msrp')
  assert.strictEqual(hvacMini.payload.unitPrice, 49.99)

  const pmMini = await requestPrice({ product: 'mini', quantity: 600, role: 'property_manager' })
  assert.strictEqual(pmMini.response.statusCode, 200)
  assert.strictEqual(pmMini.payload.priceId, 'price_mini_homeowner')
  assert.strictEqual(pmMini.payload.role, 'homeowner')
  assert.strictEqual(pmMini.payload.tier, 'msrp')

  const hvacSensor = await requestPrice({ product: 'sensor', quantity: 20, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.response.statusCode, 200)
  assert.strictEqual(hvacSensor.payload.priceId, 'price_sensor_hvac_t1')
  assert.strictEqual(hvacSensor.payload.role, 'hvac_pro')
  assert.strictEqual(hvacSensor.payload.tier, 'tier_1')

  assert.deepStrictEqual(stripeCalls, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t1',
  ])

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
