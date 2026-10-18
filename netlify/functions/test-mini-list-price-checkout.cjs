const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const retrievedPriceIds = []

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_sensor_hvac_t1: 5017,
  price_sensor_hvac_t2: 4550,
  price_sensor_hvac_t3: 4060,
  price_sensor_pm_t1: 4515,
  price_sensor_pm_t2: 4095,
  price_sensor_pm_t3: 3654,
}

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          retrievedPriceIds.push(priceId)
          if (!Object.prototype.hasOwnProperty.call(priceAmounts, priceId)) {
            const err = new Error(`No such price: ${priceId}`)
            err.type = 'StripeInvalidRequestError'
            err.code = 'resource_missing'
            throw err
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
        throw new Error('Netlify Blobs unavailable in local test')
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
process.env.STRIPE_PRICE_SENSOR_HVAC_T1 = 'price_sensor_hvac_t1'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'
process.env.STRIPE_PRICE_SENSOR_PM_T1 = 'price_sensor_pm_t1'
process.env.STRIPE_PRICE_SENSOR_PM_T2 = 'price_sensor_pm_t2'
process.env.STRIPE_PRICE_SENSOR_PM_T3 = 'price_sensor_pm_t3'

const { handler } = require('./get-price-id.js')

function eventFor(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'x-forwarded-for': `203.0.113.${Math.floor(Math.random() * 200) + 1}`,
      'user-agent': 'mini-list-price-test',
    },
    body: JSON.stringify(body),
  }
}

async function parseResponse(response) {
  return {
    ...response,
    json: JSON.parse(response.body),
  }
}

async function run() {
  const hvacMini = await parseResponse(await handler(eventFor({
    product: 'mini',
    quantity: 25,
    role: 'hvac_pro',
  }), {}))

  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.json.tier, 'msrp')
  assert.strictEqual(hvacMini.json.unitPrice, 49.99)

  const pmMiniLargeQuantity = await parseResponse(await handler(eventFor({
    product: 'mini',
    quantity: 750,
    role: 'property_manager',
  }), {}))

  assert.strictEqual(pmMiniLargeQuantity.statusCode, 200)
  assert.strictEqual(pmMiniLargeQuantity.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(pmMiniLargeQuantity.json.tier, 'msrp')

  const hvacSensorTier2 = await parseResponse(await handler(eventFor({
    product: 'sensor',
    quantity: 25,
    role: 'hvac_pro',
  }), {}))

  assert.strictEqual(hvacSensorTier2.statusCode, 200)
  assert.strictEqual(hvacSensorTier2.json.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensorTier2.json.tier, 'tier_2')

  const hvacSensorTooLarge = await parseResponse(await handler(eventFor({
    product: 'sensor',
    quantity: 501,
    role: 'hvac_pro',
  }), {}))

  assert.strictEqual(hvacSensorTooLarge.statusCode, 400)
  assert.strictEqual(hvacSensorTooLarge.json.requiresContact, true)

  assert.deepStrictEqual(retrievedPriceIds, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t2',
  ])

  console.log('mini list-price checkout regression test passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
