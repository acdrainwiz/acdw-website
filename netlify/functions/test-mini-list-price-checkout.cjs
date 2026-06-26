const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const stripeRetrievals = []

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          stripeRetrievals.push(priceId)
          const amounts = {
            price_mini_homeowner: 4999,
            price_mini_hvac_t1: 7167,
            price_mini_hvac_t2: 6500,
            price_mini_hvac_t3: 5800,
            price_mini_pm_t1: 6450,
            price_mini_pm_t2: 5850,
            price_mini_pm_t3: 5220,
            price_sensor_hvac_t2: 4550,
          }
          if (!amounts[priceId]) {
            const error = new Error(`No such price: ${priceId}`)
            error.type = 'StripeInvalidRequestError'
            error.code = 'resource_missing'
            throw error
          }
          return { unit_amount: amounts[priceId], currency: 'usd' }
        },
      },
    })
  }

  if (request === './utils/rate-limiter') {
    return {
      checkRateLimit: async () => ({ allowed: true }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    }
  }

  if (request === './utils/security-logger') {
    return {
      logAPIAccess: () => {},
      logRateLimit: () => {},
      EVENT_TYPES: {},
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

process.env.STRIPE_SECRET_KEY = 'sk_test_mini_list_price'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_mini_hvac_t2'
process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'

const { handler } = require('./get-price-id.js')

function event(body) {
  return {
    httpMethod: 'POST',
    headers: { 'user-agent': 'mini-list-price-test' },
    body: JSON.stringify(body),
  }
}

async function post(body) {
  const response = await handler(event(body), {})
  return {
    ...response,
    json: JSON.parse(response.body),
  }
}

async function run() {
  const hvacMini = await post({ product: 'mini', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.json.tier, 'msrp')
  assert.strictEqual(hvacMini.json.role, 'hvac_pro')
  assert.strictEqual(hvacMini.json.unitPrice, 49.99)

  const pmMiniHighQuantity = await post({ product: 'mini', quantity: 750, role: 'property_manager' })
  assert.strictEqual(pmMiniHighQuantity.statusCode, 200)
  assert.strictEqual(pmMiniHighQuantity.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(pmMiniHighQuantity.json.tier, 'msrp')
  assert.strictEqual(pmMiniHighQuantity.json.role, 'property_manager')
  assert.strictEqual(pmMiniHighQuantity.json.unitPrice, 49.99)

  const hvacSensor = await post({ product: 'sensor', quantity: 25, role: 'hvac_pro' })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(hvacSensor.json.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensor.json.tier, 'tier_2')
  assert.strictEqual(hvacSensor.json.unitPrice, 45.5)

  const highQuantitySensor = await post({ product: 'sensor', quantity: 501, role: 'hvac_pro' })
  assert.strictEqual(highQuantitySensor.statusCode, 400)
  assert.strictEqual(highQuantitySensor.json.requiresContact, true)

  assert.deepStrictEqual(stripeRetrievals, [
    'price_mini_homeowner',
    'price_mini_homeowner',
    'price_sensor_hvac_t2',
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
