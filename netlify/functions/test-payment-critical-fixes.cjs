const assert = require('node:assert/strict')
const Module = require('node:module')

const originalLoad = Module._load
const stripeCalls = []

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async (priceId) => {
          stripeCalls.push(priceId)
          const unitAmounts = {
            price_mini_homeowner: 4999,
            price_mini_hvac_t1: 7167,
            price_mini_pm_t2: 5850,
            price_sensor_hvac_t2: 4550,
          }

          return {
            id: priceId,
            unit_amount: unitAmounts[priceId] || 1234,
            currency: 'usd',
          }
        },
      },
      checkout: {
        sessions: {
          create: async () => {
            throw new Error('checkout session should not be created while purchasing is disabled')
          },
        },
      },
      paymentIntents: {
        retrieve: async () => {
          throw new Error('payment intent should not be retrieved while purchasing is disabled')
        },
        create: async () => {
          throw new Error('payment intent should not be created while purchasing is disabled')
        },
        update: async () => {
          throw new Error('payment intent should not be updated while purchasing is disabled')
        },
      },
      tax: {
        calculations: {
          create: async () => ({ tax_amount_exclusive: 0, line_items: { data: [] } }),
        },
      },
    })
  }

  if (request === '@netlify/blobs') {
    return {
      getStore: () => {
        throw new Error('No Netlify context in local tests')
      },
    }
  }

  return originalLoad.apply(this, arguments)
}

process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
process.env.STRIPE_PRICE_MINI_HVAC_T1 = 'price_mini_hvac_t1'
process.env.STRIPE_PRICE_MINI_PM_T2 = 'price_mini_pm_t2'
process.env.STRIPE_PRICE_SENSOR_HVAC_T2 = 'price_sensor_hvac_t2'
process.env.STRIPE_SECRET_KEY = 'sk_test_local'

const { handler: getPriceId } = require('./get-price-id.js')
const { handler: createCheckout } = require('./create-checkout.js')
const { handler: createPaymentIntent } = require('./create-payment-intent.js')
const { handler: updatePaymentIntent } = require('./update-payment-intent.js')

function postEvent(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'x-forwarded-for': '127.0.0.1',
      'user-agent': 'payment-critical-test',
    },
    body: JSON.stringify(body),
  }
}

async function expectPurchasingDisabled(handler, body) {
  const beforeCalls = stripeCalls.length
  const response = await handler(postEvent(body), {})
  assert.equal(response.statusCode, 503)
  assert.equal(JSON.parse(response.body).purchasingEnabled, false)
  assert.equal(stripeCalls.length, beforeCalls, 'disabled purchasing must return before Stripe access')
}

async function run() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  await expectPurchasingDisabled(getPriceId, {
    product: 'mini',
    quantity: 1,
    role: 'homeowner',
  })
  await expectPurchasingDisabled(createCheckout, {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
  })
  await expectPurchasingDisabled(createPaymentIntent, {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
  })
  await expectPurchasingDisabled(updatePaymentIntent, {
    paymentIntentId: 'pi_test',
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 1,
    shippingAddress: {},
  })

  process.env.PURCHASING_ENABLED = 'true'
  stripeCalls.length = 0

  const hvacMiniResponse = await getPriceId(postEvent({
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
  }), {})
  assert.equal(hvacMiniResponse.statusCode, 200)
  assert.deepEqual(JSON.parse(hvacMiniResponse.body), {
    priceId: 'price_mini_homeowner',
    product: 'mini',
    quantity: 600,
    role: 'hvac_pro',
    tier: 'msrp',
    unitPrice: 49.99,
    currency: 'usd',
  })

  const pmMiniResponse = await getPriceId(postEvent({
    product: 'mini',
    quantity: 25,
    role: 'property_manager',
  }), {})
  assert.equal(pmMiniResponse.statusCode, 200)
  assert.equal(JSON.parse(pmMiniResponse.body).priceId, 'price_mini_homeowner')

  const sensorContactSalesResponse = await getPriceId(postEvent({
    product: 'sensor',
    quantity: 600,
    role: 'hvac_pro',
  }), {})
  assert.equal(sensorContactSalesResponse.statusCode, 400)
  assert.equal(JSON.parse(sensorContactSalesResponse.body).requiresContact, true)

  const sensorTierResponse = await getPriceId(postEvent({
    product: 'sensor',
    quantity: 25,
    role: 'hvac_pro',
  }), {})
  assert.equal(sensorTierResponse.statusCode, 200)
  assert.equal(JSON.parse(sensorTierResponse.body).priceId, 'price_sensor_hvac_t2')

  assert.deepEqual(stripeCalls, [
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
