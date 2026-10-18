const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const retrievedPriceIds = []

process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_mini_hvac_t2'
process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          retrievedPriceIds.push(priceId)
          return { unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 4550, currency: 'usd' }
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => null,
    }
  }

  return originalLoad.apply(this, arguments)
}

const { handler } = require('./get-price-id.js')

async function lookupPrice(body) {
  const response = await handler(
    {
      httpMethod: 'POST',
      headers: {
        'x-forwarded-for': `${body.product}-${body.role || 'guest'}-${body.quantity}`,
        'user-agent': 'mini-list-price-test',
      },
      body: JSON.stringify(body),
    },
    {}
  )

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body),
  }
}

async function run() {
  const hvacMini = await lookupPrice({ product: 'mini', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.body.role, 'homeowner')
  assert.strictEqual(hvacMini.body.tier, 'msrp')

  const pmLargeMini = await lookupPrice({ product: 'mini', quantity: 501, role: 'property_manager' })
  assert.strictEqual(pmLargeMini.statusCode, 200)
  assert.strictEqual(pmLargeMini.body.priceId, 'price_mini_homeowner')
  assert.strictEqual(pmLargeMini.body.role, 'homeowner')
  assert.strictEqual(pmLargeMini.body.tier, 'msrp')

  const hvacSensor = await lookupPrice({ product: 'sensor', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(hvacSensor.body.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensor.body.role, 'hvac_pro')
  assert.strictEqual(hvacSensor.body.tier, 'tier_2')

  assert.deepStrictEqual(retrievedPriceIds, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t2',
  ])
}

run()
  .then(() => {
    Module._load = originalLoad
    console.log('Mini list-price checkout tests passed')
  })
  .catch((error) => {
    Module._load = originalLoad
    console.error(error)
    process.exit(1)
  })
