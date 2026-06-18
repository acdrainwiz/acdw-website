const assert = require('node:assert/strict')
const Module = require('node:module')

const stripeCalls = {
  priceRetrieve: 0,
  checkoutSessionCreate: 0,
  taxCreate: 0,
  paymentIntentCreate: 0,
  paymentIntentRetrieve: 0,
  paymentIntentUpdate: 0,
}

const originalLoad = Module._load
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'stripe') {
    return () => ({
      prices: {
        retrieve: async () => {
          stripeCalls.priceRetrieve += 1
          return { unit_amount: 9999, currency: 'usd' }
        },
      },
      checkout: {
        sessions: {
          create: async () => {
            stripeCalls.checkoutSessionCreate += 1
            return { id: 'cs_test', url: 'https://checkout.stripe.test/session' }
          },
        },
      },
      tax: {
        calculations: {
          create: async () => {
            stripeCalls.taxCreate += 1
            return { tax_amount_exclusive: 0, tax_breakdown: [] }
          },
        },
      },
      paymentIntents: {
        create: async () => {
          stripeCalls.paymentIntentCreate += 1
          return { id: 'pi_test', client_secret: 'pi_test_secret' }
        },
        retrieve: async () => {
          stripeCalls.paymentIntentRetrieve += 1
          return { id: 'pi_test', metadata: {} }
        },
        update: async () => {
          stripeCalls.paymentIntentUpdate += 1
          return { id: 'pi_test', client_secret: 'pi_test_secret' }
        },
      },
    })
  }

  return originalLoad.call(this, request, parent, isMain)
}

process.env.VITE_PURCHASING_ENABLED = ''

const { handler: getPriceId } = require('./get-price-id.js')
const { handler: createCheckout } = require('./create-checkout.js')
const { handler: createPaymentIntent } = require('./create-payment-intent.js')
const { handler: updatePaymentIntent } = require('./update-payment-intent.js')
const { isPurchasingEnabled } = require('./utils/purchasing-enabled.cjs')

async function assertPurchasingDisabled(handler, event) {
  const response = await handler(event, {})
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 503)
  assert.equal(body.purchasingEnabled, false)
  assert.match(body.error, /coming soon/i)
  assert.equal(response.headers['Cache-Control'], 'no-store')
}

const shippingAddress = {
  name: 'Test Customer',
  email: 'customer@example.com',
  line1: '123 Main St',
  city: 'Boca Raton',
  state: 'FL',
  zip: '33486',
  country: 'US',
}

async function runTests() {
  assert.equal(isPurchasingEnabled(), false)

  await assertPurchasingDisabled(getPriceId, {
    httpMethod: 'POST',
    headers: { 'user-agent': 'test' },
    body: JSON.stringify({
      product: 'mini',
      quantity: 1,
      role: 'homeowner',
    }),
  })

  await assertPurchasingDisabled(createCheckout, {
    httpMethod: 'POST',
    headers: { 'user-agent': 'test' },
    body: JSON.stringify({
      priceId: 'price_test',
      quantity: 1,
      product: 'mini',
      isGuest: true,
      shippingAddress,
    }),
  })

  await assertPurchasingDisabled(createPaymentIntent, {
    httpMethod: 'POST',
    headers: { 'user-agent': 'test' },
    body: JSON.stringify({
      priceId: 'price_test',
      quantity: 1,
      product: 'mini',
      shippingAddress,
    }),
  })

  await assertPurchasingDisabled(updatePaymentIntent, {
    httpMethod: 'POST',
    headers: { 'user-agent': 'test' },
    body: JSON.stringify({
      paymentIntentId: 'pi_test',
      priceId: 'price_test',
      quantity: 1,
      product: 'mini',
      shippingAddress,
    }),
  })

  assert.deepEqual(stripeCalls, {
    priceRetrieve: 0,
    checkoutSessionCreate: 0,
    taxCreate: 0,
    paymentIntentCreate: 0,
    paymentIntentRetrieve: 0,
    paymentIntentUpdate: 0,
  })

  process.env.VITE_PURCHASING_ENABLED = 'true'
  assert.equal(isPurchasingEnabled(), true)

  console.log('purchasing kill-switch tests passed')
}

runTests()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    Module._load = originalLoad
  })
