const assert = require('assert')
const fs = require('fs')
const Module = require('module')
const path = require('path')
const vm = require('vm')

const functionsDir = __dirname

function loadCommonJs(relativePath, mocks = {}) {
  const filename = path.join(functionsDir, relativePath)
  const code = fs.readFileSync(filename, 'utf8')
  const module = { exports: {} }
  const nativeRequire = Module.createRequire(filename)
  const localRequire = (request) => {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }
    return nativeRequire(request)
  }

  const wrapper = vm.runInNewContext(
    `(function(require, module, exports, process, console, Buffer) {\n${code}\n})`,
    { URLSearchParams }
  )
  wrapper(localRequire, module, module.exports, process, console, Buffer)
  return module.exports
}

function paymentMocks(stripeMock = {}) {
  return {
    stripe: () => stripeMock,
    './utils/rate-limiter': {
      checkRateLimit: async () => ({ allowed: true, limit: 100, remaining: 99, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '203.0.113.10',
    },
    './utils/security-logger': {
      logAPIAccess: () => {},
      logRateLimit: () => {},
      EVENT_TYPES: {},
    },
    './utils/shipping-calculator.cjs': {
      calculateShipping: async () => ({ cost: 15, method: 'test', carrier: 'test' }),
      parseProducts: () => ({}),
    },
  }
}

async function invoke(handler, body) {
  return handler({
    httpMethod: 'POST',
    headers: { 'user-agent': 'critical-regression-test' },
    body: JSON.stringify(body),
  }, {})
}

async function testPurchasingDisabled() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  for (const file of ['get-price-id.js', 'create-checkout.js', 'create-payment-intent.js', 'update-payment-intent.js']) {
    const { handler } = loadCommonJs(file, paymentMocks({
      prices: { retrieve: async () => { throw new Error('Stripe should not be called while purchasing is disabled') } },
      paymentIntents: { retrieve: async () => { throw new Error('Stripe should not be called while purchasing is disabled') } },
      tax: { calculations: { create: async () => { throw new Error('Stripe should not be called while purchasing is disabled') } } },
    }))

    const response = await invoke(handler, { product: 'mini', quantity: 1, priceId: 'price_test' })
    assert.strictEqual(response.statusCode, 503, `${file} should fail closed when purchasing is disabled`)
    assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
  }
}

async function testMiniListPriceForAuthenticatedRoles() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_discount'

  const { handler } = loadCommonJs('get-price-id.js', paymentMocks({
    prices: {
      retrieve: async (priceId) => {
        assert.strictEqual(priceId, 'price_mini_homeowner')
        return { unit_amount: 4999, currency: 'usd' }
      },
    },
  }))

  const response = await invoke(handler, { product: 'mini', quantity: 600, role: 'hvac_pro' })
  const body = JSON.parse(response.body)
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.unitPrice, 49.99)
}

async function testSensorVolumeStillRequiresSales() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

  const { handler } = loadCommonJs('get-price-id.js', paymentMocks({
    prices: {
      retrieve: async () => {
        throw new Error('Stripe should not be called for over-cap Sensor quantity')
      },
    },
  }))

  const response = await invoke(handler, { product: 'sensor', quantity: 501, role: 'hvac_pro' })
  const body = JSON.parse(response.body)
  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(body.requiresContact, true)
}

function testCrmFailureResponsesAreVisible() {
  const formSource = fs.readFileSync(path.join(functionsDir, 'validate-form-submission.js'), 'utf8')
  assert.match(formSource, /GHL submission failed[\s\S]*statusCode:\s*502/)
  assert.match(formSource, /success:\s*false/)

  const unsubscribeSource = fs.readFileSync(path.join(functionsDir, 'validate-unsubscribe.js'), 'utf8')
  assert.match(unsubscribeSource, /validateCSRFToken\s*}\s*=\s*require\('\.\/utils\/csrf-validator'\)/)
  assert.match(unsubscribeSource, /Unsubscribe GHL submission failed[\s\S]*statusCode:\s*502/)
  assert.match(unsubscribeSource, /success:\s*false/)
}

async function run() {
  await testPurchasingDisabled()
  await testMiniListPriceForAuthenticatedRoles()
  await testSensorVolumeStillRequiresSales()
  testCrmFailureResponsesAreVisible()
  console.log('critical regressions passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
