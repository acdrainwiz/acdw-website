const assert = require('assert')
const Module = require('module')

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
process.env.STRIPE_PRICE_SENSOR_PM_T3 = 'price_sensor_pm_t3'

const mockUnitAmounts = {
  price_mini_homeowner: 4999,
  price_mini_hvac_t1: 7167,
  price_mini_pm_t1: 6450,
  price_sensor_hvac_t2: 4550,
  price_sensor_pm_t3: 3654,
}

const originalLoad = Module._load
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          if (!Object.prototype.hasOwnProperty.call(mockUnitAmounts, priceId)) {
            const error = new Error(`No such price: ${priceId}`)
            error.type = 'StripeInvalidRequestError'
            error.code = 'resource_missing'
            throw error
          }

          return {
            unit_amount: mockUnitAmounts[priceId],
            currency: 'usd',
          }
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => {
        throw new Error('No Netlify blob store in local unit test')
      },
    }
  }

  return originalLoad.apply(this, arguments)
}

const { handler } = require('./get-price-id.js')

function eventFor(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'x-forwarded-for': '127.0.0.1',
      'user-agent': 'mini-list-price-test',
    },
    body: JSON.stringify(body),
  }
}

async function invoke(body) {
  const response = await handler(eventFor(body), {})
  return {
    ...response,
    json: JSON.parse(response.body),
  }
}

async function run() {
  const hvacMini = await invoke({ product: 'mini', quantity: 1, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.json.tier, 'msrp')
  assert.strictEqual(hvacMini.json.unitPrice, 49.99)

  const propertyManagerBulkMini = await invoke({
    product: 'mini',
    quantity: 600,
    role: 'property_manager',
  })
  assert.strictEqual(propertyManagerBulkMini.statusCode, 200)
  assert.strictEqual(propertyManagerBulkMini.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(propertyManagerBulkMini.json.tier, 'msrp')

  const hvacSensor = await invoke({ product: 'sensor', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(hvacSensor.json.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensor.json.tier, 'tier_2')

  const propertyManagerBulkSensor = await invoke({
    product: 'sensor',
    quantity: 501,
    role: 'property_manager',
  })
  assert.strictEqual(propertyManagerBulkSensor.statusCode, 400)
  assert.strictEqual(propertyManagerBulkSensor.json.requiresContact, true)

  console.log('Mini list-price checkout regression tests passed.')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
