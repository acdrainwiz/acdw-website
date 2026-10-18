const assert = require('node:assert/strict')
const Module = require('node:module')

const stripeCalls = {
  priceRetrieve: 0,
  taxCreate: 0,
  paymentIntentCreate: 0,
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
      },
    })
  }

  return originalLoad.call(this, request, parent, isMain)
}

process.env.VITE_PURCHASING_ENABLED = ''

const { handler: getPriceId } = require('./get-price-id.js')
const { handler: createPaymentIntent } = require('./create-payment-intent.js')
const { isPurchasingEnabled } = require('./utils/purchasing-enabled.cjs')

async function assertPurchasingDisabled(handler, event) {
  const response = await handler(event, {})
  const body = JSON.parse(response.body)

  assert.equal(response.statusCode, 503)
  assert.equal(body.purchasingEnabled, false)
  assert.match(body.error, /coming soon/i)
  assert.equal(response.headers['Cache-Control'], 'no-store')
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

  await assertPurchasingDisabled(createPaymentIntent, {
    httpMethod: 'POST',
    headers: { 'user-agent': 'test' },
    body: JSON.stringify({
      priceId: 'price_test',
      quantity: 1,
      product: 'mini',
      shippingAddress: {
        name: 'Test Customer',
        email: 'customer@example.com',
        line1: '123 Main St',
        city: 'Boca Raton',
        state: 'FL',
        zip: '33486',
        country: 'US',
      },
    }),
  })

  assert.deepEqual(stripeCalls, {
    priceRetrieve: 0,
    taxCreate: 0,
    paymentIntentCreate: 0,
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
