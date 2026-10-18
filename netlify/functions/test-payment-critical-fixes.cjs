const assert = require('node:assert/strict')
const Module = require('node:module')

const originalLoad = Module._load
const stripeRetrieveCalls = []

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_mini_hvac_t1: 7167,
  price_mini_pm_t1: 6450,
  price_sensor_hvac_t2: 4550,
}

Module._load = function mockLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return function stripeFactory() {
      return {
        prices: {
          retrieve: async (priceId) => {
            stripeRetrieveCalls.push(priceId)
            return {
              id: priceId,
              unit_amount: priceAmounts[priceId] || 9999,
              currency: 'usd',
            }
          },
        },
      }
    }
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => {
        throw new Error('Netlify Blobs unavailable in focused unit test')
      },
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

function clearFunctionCache(relativePath) {
  delete require.cache[require.resolve(relativePath)]
}

function loadHandler(relativePath) {
  clearFunctionCache(relativePath)
  return require(relativePath).handler
}

function postEvent(body = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      'x-forwarded-for': '203.0.113.10',
      'user-agent': 'payment-critical-test',
    },
    body: JSON.stringify(body),
  }
}

async function assertPurchasingDisabled(relativePath) {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  const handler = loadHandler(relativePath)
  const response = await handler(postEvent(), {})
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 503, `${relativePath} should default closed`)
  assert.equal(body.purchasingEnabled, false)
}

async function run() {
  await assertPurchasingDisabled('./get-price-id.js')
  await assertPurchasingDisabled('./create-checkout.js')
  await assertPurchasingDisabled('./create-payment-intent.js')
  await assertPurchasingDisabled('./update-payment-intent.js')

  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
  process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'

  const getPriceId = loadHandler('./get-price-id.js')

  const hvacMini = await getPriceId(postEvent({
    product: 'mini',
    quantity: 25,
    role: 'hvac_pro',
  }), {})
  assert.equal(hvacMini.statusCode, 200)
  assert.deepEqual(JSON.parse(hvacMini.body), {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 25,
    role: 'hvac_pro',
    tier: 'msrp',
    unitPrice: 49.99,
    currency: 'usd',
  })

  const propertyManagerBulkMini = await getPriceId(postEvent({
    product: 'mini',
    quantity: 600,
    role: 'property_manager',
  }), {})
  assert.equal(propertyManagerBulkMini.statusCode, 200)
  assert.equal(JSON.parse(propertyManagerBulkMini.body).priceId, 'price_mini_homeowner')

  const hvacSensor = await getPriceId(postEvent({
    product: 'sensor',
    quantity: 25,
    role: 'hvac_pro',
  }), {})
  assert.equal(hvacSensor.statusCode, 200)
  assert.equal(JSON.parse(hvacSensor.body).priceId, 'price_sensor_hvac_t2')
  assert.equal(JSON.parse(hvacSensor.body).tier, 'tier_2')

  const hvacSensorOverLimit = await getPriceId(postEvent({
    product: 'sensor',
    quantity: 501,
    role: 'hvac_pro',
  }), {})
  assert.equal(hvacSensorOverLimit.statusCode, 400)
  assert.equal(JSON.parse(hvacSensorOverLimit.body).requiresContact, true)

  assert.deepEqual(stripeRetrieveCalls, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t2',
  ])

  console.log('Payment critical regression tests passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
