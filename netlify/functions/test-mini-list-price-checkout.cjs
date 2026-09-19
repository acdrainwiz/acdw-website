const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

function loadHandlerWithMocks() {
  const stripeRetrieveCalls = []

  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => ({
        prices: {
          retrieve: async (priceId) => {
            stripeRetrieveCalls.push(priceId)
            return { unit_amount: 4999, currency: 'usd' }
          },
        },
      })
    }

    if (request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true, remaining: 29, limit: 30, resetTime: Date.now(), retryAfter: 0 }),
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

    return originalLoad(request, parent, isMain)
  }

  delete require.cache[require.resolve('./get-price-id.js')]
  const { handler } = require('./get-price-id.js')

  return { handler, stripeRetrieveCalls }
}

async function callGetPriceId(handler, body) {
  return handler(
    {
      httpMethod: 'POST',
      headers: { 'user-agent': 'test' },
      body: JSON.stringify(body),
    },
    {},
  )
}

async function run() {
  process.env.STRIPE_SECRET_KEY = 'sk_test_123'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
  process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

  const { handler, stripeRetrieveCalls } = loadHandlerWithMocks()

  const hvacMini = await callGetPriceId(handler, {
    product: 'mini',
    quantity: 10,
    role: 'hvac_pro',
  })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(JSON.parse(hvacMini.body).priceId, 'price_mini_homeowner')
  assert.strictEqual(JSON.parse(hvacMini.body).tier, 'msrp')

  const largePmMini = await callGetPriceId(handler, {
    product: 'mini',
    quantity: 600,
    role: 'property_manager',
  })
  assert.strictEqual(largePmMini.statusCode, 200)
  assert.strictEqual(JSON.parse(largePmMini.body).priceId, 'price_mini_homeowner')
  assert.strictEqual(JSON.parse(largePmMini.body).quantity, 600)

  const largeSensor = await callGetPriceId(handler, {
    product: 'sensor',
    quantity: 600,
    role: 'hvac_pro',
  })
  assert.strictEqual(largeSensor.statusCode, 400)
  assert.strictEqual(JSON.parse(largeSensor.body).requiresContact, true)

  assert.deepStrictEqual(stripeRetrieveCalls, ['price_mini_homeowner', 'price_mini_homeowner'])
}

run()
  .then(() => {
    Module._load = originalLoad
    console.log('mini list-price checkout regression tests passed')
  })
  .catch((error) => {
    Module._load = originalLoad
    console.error(error)
    process.exit(1)
  })
