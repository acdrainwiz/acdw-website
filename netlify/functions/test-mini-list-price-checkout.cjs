const assert = require('node:assert/strict')
const Module = require('node:module')

const originalLoad = Module._load
const retrievedPriceIds = []

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return function stripeMock() {
      return {
        prices: {
          retrieve: async (priceId) => {
            retrievedPriceIds.push(priceId)
            return {
              id: priceId,
              unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 4550,
              currency: 'usd',
            }
          },
        },
      }
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'

const { handler } = require('./get-price-id.js')

async function requestPrice(body) {
  const response = await handler(
    {
      httpMethod: 'POST',
      headers: {
        'x-forwarded-for': `198.51.100.${retrievedPriceIds.length + 1}`,
        'user-agent': 'mini-list-price-test',
      },
      body: JSON.stringify(body),
    },
    null
  )

  return {
    ...response,
    json: JSON.parse(response.body),
  }
}

async function run() {
  try {
    const hvacMini = await requestPrice({
      product: 'mini',
      quantity: 25,
      role: 'hvac_pro',
    })

    assert.equal(hvacMini.statusCode, 200)
    assert.equal(hvacMini.json.priceId, 'price_mini_homeowner')
    assert.equal(hvacMini.json.tier, 'msrp')
    assert.equal(hvacMini.json.unitPrice, 49.99)

    const pmBulkMini = await requestPrice({
      product: 'mini',
      quantity: 750,
      role: 'property_manager',
    })

    assert.equal(pmBulkMini.statusCode, 200)
    assert.equal(pmBulkMini.json.priceId, 'price_mini_homeowner')
    assert.equal(pmBulkMini.json.tier, 'msrp')

    const hvacSensor = await requestPrice({
      product: 'sensor',
      quantity: 25,
      role: 'hvac_pro',
    })

    assert.equal(hvacSensor.statusCode, 200)
    assert.equal(hvacSensor.json.priceId, 'price_sensor_hvac_t2')
    assert.equal(hvacSensor.json.tier, 'tier_2')

    assert.deepEqual(retrievedPriceIds, [
      'price_mini_homeowner',
      'price_mini_homeowner',
      'price_sensor_hvac_t2',
    ])

    console.log('Mini list-price checkout tests passed')
  } finally {
    Module._load = originalLoad
  }
}

run().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
