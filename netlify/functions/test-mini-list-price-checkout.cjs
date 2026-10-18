const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const retrievedPriceIds = []

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_sensor_hvac_t2: 4550,
}

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          retrievedPriceIds.push(priceId)
          const unit_amount = priceAmounts[priceId]
          if (!unit_amount) {
            const err = new Error(`No such price: ${priceId}`)
            err.type = 'StripeInvalidRequestError'
            err.code = 'resource_missing'
            throw err
          }
          return { unit_amount, currency: 'usd' }
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => {
        throw new Error('Netlify Blobs unavailable in unit test')
      },
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

process.env.STRIPE_SECRET_KEY = 'sk_test_unit'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_mini_hvac_t2'
process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'

const { handler } = require('./get-price-id')

function post(body) {
  return handler(
    {
      httpMethod: 'POST',
      headers: { 'user-agent': 'unit-test' },
      body: JSON.stringify(body),
    },
    {}
  )
}

async function run() {
  const hvacMini = await post({ product: 'mini', quantity: 1, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  const hvacMiniBody = JSON.parse(hvacMini.body)
  assert.strictEqual(hvacMiniBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMiniBody.tier, 'msrp')
  assert.strictEqual(hvacMiniBody.unitPrice, 49.99)

  const pmMiniLargeQuantity = await post({ product: 'mini', quantity: 600, role: 'property_manager' })
  assert.strictEqual(pmMiniLargeQuantity.statusCode, 200)
  const pmMiniLargeQuantityBody = JSON.parse(pmMiniLargeQuantity.body)
  assert.strictEqual(pmMiniLargeQuantityBody.priceId, 'price_mini_homeowner')
  assert.strictEqual(pmMiniLargeQuantityBody.tier, 'msrp')
  assert.strictEqual(pmMiniLargeQuantityBody.quantity, 600)

  const hvacSensorTiered = await post({ product: 'sensor', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacSensorTiered.statusCode, 200)
  const hvacSensorTieredBody = JSON.parse(hvacSensorTiered.body)
  assert.strictEqual(hvacSensorTieredBody.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensorTieredBody.tier, 'tier_2')
  assert.strictEqual(hvacSensorTieredBody.unitPrice, 45.5)

  const hvacSensorTooLarge = await post({ product: 'sensor', quantity: 501, role: 'hvac_pro' })
  assert.strictEqual(hvacSensorTooLarge.statusCode, 400)
  assert.strictEqual(JSON.parse(hvacSensorTooLarge.body).requiresContact, true)

  assert.deepStrictEqual(retrievedPriceIds, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t2',
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
