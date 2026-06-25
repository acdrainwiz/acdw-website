const assert = require('node:assert/strict')
const Module = require('node:module')

const originalLoad = Module._load
const retrievedPriceIds = []

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_mini_hvac_t1: 7167,
  price_mini_pm_t1: 6450,
  price_sensor_hvac_t2: 4550,
  price_bundle_pm_t3: 9360,
}

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
process.env.STRIPE_PRICE_BUNDLE_PM_T3 = 'price_bundle_pm_t3'

Module._load = function mockLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          retrievedPriceIds.push(priceId)
          if (!Object.prototype.hasOwnProperty.call(priceAmounts, priceId)) {
            throw new Error(`Unexpected price id: ${priceId}`)
          }
          return { unit_amount: priceAmounts[priceId], currency: 'usd' }
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => {
        throw new Error('Netlify Blobs unavailable in focused test')
      },
    }
  }

  return originalLoad.apply(this, arguments)
}

const { handler } = require('./get-price-id.js')

function post(body) {
  return handler(
    {
      httpMethod: 'POST',
      headers: {
        'x-forwarded-for': '203.0.113.10',
        'user-agent': 'mini-list-price-test',
      },
      body: JSON.stringify(body),
    },
    {}
  )
}

async function run() {
  try {
    const hvacMini = await post({ product: 'mini', quantity: 25, role: 'hvac_pro' })
    assert.equal(hvacMini.statusCode, 200)
    const hvacMiniBody = JSON.parse(hvacMini.body)
    assert.equal(hvacMiniBody.priceId, 'price_mini_homeowner')
    assert.equal(hvacMiniBody.role, 'homeowner')
    assert.equal(hvacMiniBody.tier, 'msrp')
    assert.equal(hvacMiniBody.unitPrice, 49.99)

    const largePmMini = await post({ product: 'mini', quantity: 750, role: 'property_manager' })
    assert.equal(largePmMini.statusCode, 200)
    const largePmMiniBody = JSON.parse(largePmMini.body)
    assert.equal(largePmMiniBody.priceId, 'price_mini_homeowner')
    assert.equal(largePmMiniBody.role, 'homeowner')
    assert.equal(largePmMiniBody.tier, 'msrp')

    const hvacSensor = await post({ product: 'sensor', quantity: 25, role: 'hvac_pro' })
    assert.equal(hvacSensor.statusCode, 200)
    const hvacSensorBody = JSON.parse(hvacSensor.body)
    assert.equal(hvacSensorBody.priceId, 'price_sensor_hvac_t2')
    assert.equal(hvacSensorBody.role, 'hvac_pro')
    assert.equal(hvacSensorBody.tier, 'tier_2')

    const oversizedBundle = await post({ product: 'bundle', quantity: 501, role: 'property_manager' })
    assert.equal(oversizedBundle.statusCode, 400)
    assert.equal(JSON.parse(oversizedBundle.body).requiresContact, true)

    assert.deepEqual(retrievedPriceIds, [
      'price_mini_homeowner',
      'price_mini_homeowner',
      'price_sensor_hvac_t2',
    ])

    console.log('Mini list-price checkout regression test passed')
  } finally {
    Module._load = originalLoad
  }
}

run().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
