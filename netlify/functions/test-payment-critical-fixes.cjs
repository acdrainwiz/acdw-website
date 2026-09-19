const assert = require('node:assert/strict')
const Module = require('node:module')
const path = require('node:path')

const functionDir = __dirname
const functionPaths = {
  getPriceId: path.join(functionDir, 'get-price-id.js'),
  createCheckout: path.join(functionDir, 'create-checkout.js'),
  createPaymentIntent: path.join(functionDir, 'create-payment-intent.js'),
  updatePaymentIntent: path.join(functionDir, 'update-payment-intent.js'),
}

const originalLoad = Module._load
const stripeCalls = {
  retrievePriceIds: [],
}

const stripeMock = {
  prices: {
    async retrieve(priceId) {
      stripeCalls.retrievePriceIds.push(priceId)
      return {
        id: priceId,
        unit_amount: priceId === 'price_mini_homeowner' ? 4999 : 6999,
        currency: 'usd',
      }
    },
  },
  paymentIntents: {
    async retrieve(id) {
      return { id, metadata: {} }
    },
    async create() {
      throw new Error('payment intent creation should not run while purchasing is disabled')
    },
    async update() {
      throw new Error('payment intent update should not run while purchasing is disabled')
    },
  },
  checkout: {
    sessions: {
      async create() {
        throw new Error('checkout session creation should not run while purchasing is disabled')
      },
    },
  },
  tax: {
    calculations: {
      async create() {
        throw new Error('tax calculation should not run while purchasing is disabled')
      },
    },
  },
}

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => stripeMock
  }

  if (request === '@netlify/blobs') {
    return { getStore: () => null }
  }

  return originalLoad.call(this, request, parent, isMain)
}

function resetFunctionCache() {
  for (const filePath of Object.values(functionPaths)) {
    delete require.cache[require.resolve(filePath)]
  }
  delete require.cache[require.resolve(path.join(functionDir, 'utils/purchasing-enabled.cjs'))]
}

function loadHandlers() {
  resetFunctionCache()
  return {
    getPriceId: require(functionPaths.getPriceId).handler,
    createCheckout: require(functionPaths.createCheckout).handler,
    createPaymentIntent: require(functionPaths.createPaymentIntent).handler,
    updatePaymentIntent: require(functionPaths.updatePaymentIntent).handler,
  }
}

function postEvent(body = {}) {
  return {
    httpMethod: 'POST',
    headers: {
      'user-agent': 'payment-critical-test',
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify(body),
  }
}

async function expectPurchasingDisabled(handler, body) {
  const response = await handler(postEvent(body), {})
  assert.equal(response.statusCode, 503)
  assert.deepEqual(JSON.parse(response.body), {
    error: 'Online purchasing is currently unavailable',
    purchasingEnabled: false,
  })
}

async function run() {
  try {
    delete process.env.PURCHASING_ENABLED
    delete process.env.VITE_PURCHASING_ENABLED

    const disabledHandlers = loadHandlers()
    await expectPurchasingDisabled(disabledHandlers.getPriceId, {
      product: 'mini',
      quantity: 1,
      role: 'homeowner',
    })
    await expectPurchasingDisabled(disabledHandlers.createCheckout, {})
    await expectPurchasingDisabled(disabledHandlers.createPaymentIntent, {})
    await expectPurchasingDisabled(disabledHandlers.updatePaymentIntent, {})
    assert.deepEqual(stripeCalls.retrievePriceIds, [], 'disabled purchasing must not reach Stripe')

    process.env.PURCHASING_ENABLED = 'true'
    process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
    process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
    process.env.STRIPE_PRICE_MINI_PM_T3 = 'price_mini_pm_t3'
    process.env.STRIPE_PRICE_SENSOR_HVAC_T3 = 'price_sensor_hvac_t3'

    const enabledHandlers = loadHandlers()
    const miniResponse = await enabledHandlers.getPriceId(postEvent({
      product: 'mini',
      quantity: 600,
      role: 'property_manager',
    }), {})
    assert.equal(miniResponse.statusCode, 200)
    assert.equal(stripeCalls.retrievePriceIds.at(-1), 'price_mini_homeowner')
    assert.deepEqual(JSON.parse(miniResponse.body), {
      priceId: 'price_mini_homeowner',
      product: 'mini',
      quantity: 600,
      role: 'property_manager',
      tier: 'msrp',
      unitPrice: 49.99,
      currency: 'usd',
    })

    const sensorResponse = await enabledHandlers.getPriceId(postEvent({
      product: 'sensor',
      quantity: 501,
      role: 'hvac_pro',
    }), {})
    assert.equal(sensorResponse.statusCode, 400)
    assert.equal(JSON.parse(sensorResponse.body).requiresContact, true)

    console.log('Payment critical fix tests passed')
  } finally {
    Module._load = originalLoad
  }
}

run().catch((error) => {
  Module._load = originalLoad
  console.error(error)
  process.exit(1)
})
