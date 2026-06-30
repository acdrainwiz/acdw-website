const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_mini_hvac_t1: 7167,
  price_mini_pm_t1: 6450,
  price_sensor_hvac_t2: 4550,
}

Module._load = function mockedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          if (!priceAmounts[priceId]) {
            const error = new Error(`No such price: ${priceId}`)
            error.type = 'StripeInvalidRequestError'
            error.code = 'resource_missing'
            throw error
          }

          return {
            id: priceId,
            unit_amount: priceAmounts[priceId],
            currency: 'usd',
          }
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => {
        throw new Error('No Netlify Blobs in focused unit test')
      },
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'

const { handler } = require('./get-price-id.js')

function event(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'x-forwarded-for': `203.0.113.${Math.floor(Math.random() * 200) + 1}`,
      'user-agent': 'mini-list-price-test',
    },
    body: JSON.stringify(body),
  }
}

async function invoke(body) {
  const response = await handler(event(body), {})
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body),
  }
}

async function run() {
  const hvacMini = await invoke({ product: 'mini', quantity: 10, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.body.tier, 'msrp')
  assert.strictEqual(hvacMini.body.unitPrice, 49.99)

  const largePropertyManagerMini = await invoke({ product: 'mini', quantity: 600, role: 'property_manager' })
  assert.strictEqual(largePropertyManagerMini.statusCode, 200)
  assert.strictEqual(largePropertyManagerMini.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(largePropertyManagerMini.body.tier, 'msrp')

  const hvacSensor = await invoke({ product: 'sensor', quantity: 50, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(hvacSensor.body.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensor.body.tier, 'tier_2')

  const largeHvacSensor = await invoke({ product: 'sensor', quantity: 600, role: 'hvac_pro' })
  assert.strictEqual(largeHvacSensor.statusCode, 400)
  assert.strictEqual(largeHvacSensor.body.requiresContact, true)

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
