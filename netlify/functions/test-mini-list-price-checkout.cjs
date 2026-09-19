const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load
const retrievedPriceIds = []

const PRICE_AMOUNTS = {
  price_mini_homeowner: 4999,
  price_mini_hvac_t1: 7167,
  price_mini_pm_t3: 5220,
  price_sensor_hvac_t2: 4550,
}

Module._load = function mockLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          retrievedPriceIds.push(priceId)
          if (!PRICE_AMOUNTS[priceId]) {
            const error = new Error(`No such price: ${priceId}`)
            error.type = 'StripeInvalidRequestError'
            error.code = 'resource_missing'
            throw error
          }
          return { unit_amount: PRICE_AMOUNTS[priceId], currency: 'usd' }
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => null,
    }
  }

  return originalLoad(request, parent, isMain)
}

process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'

const { handler } = require('./get-price-id.js')

function event(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'x-forwarded-for': '203.0.113.10',
      'user-agent': 'mini-price-test',
    },
    body: JSON.stringify(body),
  }
}

async function call(body) {
  const response = await handler(event(body), {})
  return {
    ...response,
    json: JSON.parse(response.body),
  }
}

async function run() {
  let response = await call({ product: 'mini', quantity: 1, role: 'hvac_pro' })
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(response.json.unitPrice, 49.99)
  assert.strictEqual(response.json.role, 'hvac_pro')
  assert.strictEqual(response.json.tier, 'msrp')

  response = await call({ product: 'mini', quantity: 600, role: 'property_manager' })
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(response.json.unitPrice, 49.99)
  assert.strictEqual(response.json.role, 'property_manager')
  assert.strictEqual(response.json.tier, 'msrp')

  response = await call({ product: 'sensor', quantity: 21, role: 'hvac_pro' })
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.json.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(response.json.unitPrice, 45.5)
  assert.strictEqual(response.json.tier, 'tier_2')

  response = await call({ product: 'sensor', quantity: 600, role: 'hvac_pro' })
  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(response.json.requiresContact, true)

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
