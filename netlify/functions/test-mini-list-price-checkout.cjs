const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const retrievedPriceIds = []

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          retrievedPriceIds.push(priceId)
          return { unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 5017, currency: 'usd' }
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

  return originalLoad(request, parent, isMain)
}

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_mini_hvac_t2'
process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
process.env.STRIPE_PRICE_SENSOR_HVAC_T1 = 'price_sensor_hvac_t1'

const { handler } = require('./get-price-id')

function post(body) {
  return handler(
    {
      httpMethod: 'POST',
      headers: {
        'x-forwarded-for': '127.0.0.1',
        'user-agent': 'mini-list-price-test',
      },
      body: JSON.stringify(body),
    },
    {}
  )
}

async function run() {
  const hvacMini = await post({ product: 'mini', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.deepStrictEqual(JSON.parse(hvacMini.body), {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 25,
    role: 'homeowner',
    tier: 'msrp',
    unitPrice: 49.99,
    currency: 'usd',
  })

  const pmMini = await post({ product: 'mini', quantity: 750, role: 'property_manager' })
  assert.strictEqual(pmMini.statusCode, 200)
  assert.strictEqual(JSON.parse(pmMini.body).priceId, 'price_mini_homeowner')

  const hvacSensor = await post({ product: 'sensor', quantity: 20, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(JSON.parse(hvacSensor.body).priceId, 'price_sensor_hvac_t1')

  assert.deepStrictEqual(retrievedPriceIds, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t1',
  ])

  console.log('Mini list-price checkout regression test passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
