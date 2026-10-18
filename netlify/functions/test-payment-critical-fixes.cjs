const assert = require('assert')
const Module = require('module')
const path = require('path')

const functionDir = __dirname
const originalLoad = Module._load
const originalEnv = { ...process.env }

let stripeRetrieveCalls = []

const stripeClient = {
  prices: {
    retrieve: async (priceId) => {
      stripeRetrieveCalls.push(priceId)
      return {
        id: priceId,
        unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999,
        currency: 'usd',
      }
    },
  },
  checkout: {
    sessions: {
      create: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test/session' }),
    },
  },
  paymentIntents: {
    create: async () => ({ id: 'pi_test', client_secret: 'pi_secret' }),
    retrieve: async () => ({ id: 'pi_test', metadata: {} }),
    update: async () => ({ id: 'pi_test', client_secret: 'pi_secret_updated' }),
  },
  tax: {
    calculations: {
      create: async () => ({ id: 'taxcalc_test', tax_amount_exclusive: 0, tax_breakdown: [] }),
    },
  },
}

Module._load = function mockLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => stripeClient
  }

  if (request.endsWith('/utils/rate-limiter') || request === './utils/rate-limiter') {
    return {
      checkRateLimit: async () => ({ allowed: true, remaining: 10, resetTime: Date.now() + 60000 }),
      getRateLimitHeaders: () => ({}),
      getClientIP: () => '127.0.0.1',
    }
  }

  if (request.endsWith('/utils/security-logger') || request === './utils/security-logger') {
    return {
      logAPIAccess: () => {},
      logRateLimit: () => {},
      EVENT_TYPES: {},
    }
  }

  if (request.endsWith('/utils/shipping-calculator.cjs') || request === './utils/shipping-calculator.cjs') {
    return {
      calculateShipping: async () => ({ cost: 0 }),
      parseProducts: () => ({}),
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

function resetEnv() {
  process.env = { ...originalEnv }
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
  process.env.STRIPE_PRICE_MINI_HVAC_T2 = 'price_mini_hvac_t2'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_mini_hvac_t3'
  process.env.STRIPE_PRICE_MINI_PM_T1 = 'price_mini_pm_t1'
  process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
  process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
  process.env.STRIPE_PRICE_SENSOR_HOMEOWNER = 'price_sensor_homeowner'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T1 = 'price_sensor_hvac_t1'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
  process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'
  process.env.STRIPE_PRICE_SENSOR_PM_T1 = 'price_sensor_pm_t1'
  process.env.STRIPE_PRICE_SENSOR_PM_T2 = 'price_sensor_pm_t2'
  process.env.STRIPE_PRICE_SENSOR_PM_T3 = 'price_sensor_pm_t3'
  process.env.STRIPE_PRICE_BUNDLE_HOMEOWNER = 'price_bundle_homeowner'
  process.env.STRIPE_PRICE_BUNDLE_HVAC_T1 = 'price_bundle_hvac_t1'
  process.env.STRIPE_PRICE_BUNDLE_HVAC_T2 = 'price_bundle_hvac_t2'
  process.env.STRIPE_PRICE_BUNDLE_HVAC_T3 = 'price_bundle_hvac_t3'
  process.env.STRIPE_PRICE_BUNDLE_PM_T1 = 'price_bundle_pm_t1'
  process.env.STRIPE_PRICE_BUNDLE_PM_T2 = 'price_bundle_pm_t2'
  process.env.STRIPE_PRICE_BUNDLE_PM_T3 = 'price_bundle_pm_t3'
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED
  stripeRetrieveCalls = []
}

function freshHandler(fileName) {
  const filePath = path.join(functionDir, fileName)
  delete require.cache[require.resolve(filePath)]
  return require(filePath).handler
}

function postEvent(body) {
  return {
    httpMethod: 'POST',
    headers: { 'user-agent': 'critical-regression-test' },
    body: JSON.stringify(body),
  }
}

async function assertPurchasingDisabled(fileName, body = {}) {
  resetEnv()
  const handler = freshHandler(fileName)
  const response = await handler(postEvent(body), {})
  assert.strictEqual(response.statusCode, 503, `${fileName} should fail closed when purchasing is disabled`)
  assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
  assert.deepStrictEqual(stripeRetrieveCalls, [], `${fileName} should not call Stripe while purchasing is disabled`)
}

async function run() {
  await assertPurchasingDisabled('get-price-id.js', { product: 'mini', quantity: 1 })
  await assertPurchasingDisabled('create-checkout.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    isGuest: true,
    shippingAddress: { city: 'Miami', state: 'FL', country: 'US' },
  })
  await assertPurchasingDisabled('create-payment-intent.js', {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {
      line1: '1 Main St',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'US',
      email: 'buyer@example.com',
    },
  })
  await assertPurchasingDisabled('update-payment-intent.js', {
    paymentIntentId: 'pi_test',
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {
      line1: '1 Main St',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'US',
      email: 'buyer@example.com',
    },
  })

  resetEnv()
  process.env.PURCHASING_ENABLED = 'true'
  let handler = freshHandler('get-price-id.js')
  let response = await handler(postEvent({ product: 'mini', quantity: 600, role: 'property_manager' }), {})
  let body = JSON.parse(response.body)
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.tier, 'msrp')
  assert.strictEqual(body.quantity, 600)

  resetEnv()
  process.env.PURCHASING_ENABLED = 'true'
  handler = freshHandler('get-price-id.js')
  response = await handler(postEvent({ product: 'mini', quantity: 25, role: 'hvac_pro' }), {})
  body = JSON.parse(response.body)
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_mini_homeowner')
  assert.strictEqual(body.tier, 'msrp')

  resetEnv()
  process.env.PURCHASING_ENABLED = 'true'
  handler = freshHandler('get-price-id.js')
  response = await handler(postEvent({ product: 'sensor', quantity: 25, role: 'hvac_pro' }), {})
  body = JSON.parse(response.body)
  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(body.priceId, 'price_sensor_hvac_t2')
  assert.strictEqual(body.tier, 'tier_2')

  resetEnv()
  process.env.PURCHASING_ENABLED = 'true'
  handler = freshHandler('get-price-id.js')
  response = await handler(postEvent({ product: 'sensor', quantity: 501, role: 'property_manager' }), {})
  body = JSON.parse(response.body)
  assert.strictEqual(response.statusCode, 400)
  assert.strictEqual(body.requiresContact, true)

  console.log('Payment critical regression tests passed')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
    process.env = originalEnv
  })
