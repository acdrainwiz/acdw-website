const assert = require('assert')
const fs = require('fs')
const Module = require('module')
const path = require('path')

const functionPath = path.join(__dirname, 'get-price-id.js')

const priceAmounts = {
  price_mini_homeowner: 4999,
  price_sensor_hvac_t2: 4550,
}

function setPriceEnv() {
  process.env.STRIPE_SECRET_KEY = 'sk_test_unit'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
  process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_mini_hvac_t2'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
  process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
  process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
  process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
}

function loadHandlerWithMocks() {
  setPriceEnv()

  const source = fs.readFileSync(functionPath, 'utf8')
  const testModule = new Module(functionPath, module)
  testModule.filename = functionPath
  testModule.paths = Module._nodeModulePaths(path.dirname(functionPath))

  const originalLoad = Module._load
  Module._load = function loadMockedDependency(request, parent, isMain) {
    if (request === 'stripe') {
      return function stripeMock() {
        return {
          prices: {
            retrieve: async (priceId) => ({
              id: priceId,
              unit_amount: priceAmounts[priceId] ?? 1000,
              currency: 'usd',
            }),
          },
        }
      }
    }

    if (request === './utils/rate-limiter') {
      return {
        checkRateLimit: async () => ({ allowed: true, remaining: 100, resetTime: Date.now() + 60000 }),
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

  try {
    testModule._compile(source, functionPath)
    return testModule.exports.handler
  } finally {
    Module._load = originalLoad
  }
}

async function post(handler, body) {
  const response = await handler(
    {
      httpMethod: 'POST',
      headers: { 'user-agent': 'mini-list-price-test' },
      body: JSON.stringify(body),
    },
    {}
  )

  return {
    ...response,
    json: JSON.parse(response.body),
  }
}

async function runTests() {
  const handler = loadHandlerWithMocks()

  const hvacMini = await post(handler, {
    product: 'mini',
    quantity: 25,
    role: 'hvac_pro',
  })
  assert.strictEqual(hvacMini.statusCode, 200)
  assert.strictEqual(hvacMini.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(hvacMini.json.role, 'hvac_pro')
  assert.strictEqual(hvacMini.json.tier, 'msrp')
  assert.strictEqual(hvacMini.json.unitPrice, 49.99)

  const pmMiniLargeQuantity = await post(handler, {
    product: 'mini',
    quantity: 750,
    role: 'property_manager',
  })
  assert.strictEqual(pmMiniLargeQuantity.statusCode, 200)
  assert.strictEqual(pmMiniLargeQuantity.json.priceId, 'price_mini_homeowner')
  assert.strictEqual(pmMiniLargeQuantity.json.tier, 'msrp')

  const hvacSensor = await post(handler, {
    product: 'sensor',
    quantity: 25,
    role: 'hvac_pro',
  })
  assert.strictEqual(hvacSensor.statusCode, 200)
  assert.strictEqual(hvacSensor.json.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(hvacSensor.json.tier, 'tier_2')
  assert.strictEqual(hvacSensor.json.unitPrice, 45.5)

  console.log('Mini list-price checkout regression tests passed')
}

runTests().catch((error) => {
  console.error(error)
  process.exit(1)
})
