const assert = require('assert')

process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_disabled_purchase_guard'
delete process.env.PURCHASING_ENABLED
delete process.env.VITE_PURCHASING_ENABLED

const functions = [
  {
    name: 'get-price-id',
    handler: require('./get-price-id').handler,
    body: {
      product: 'mini',
      quantity: 1,
      role: 'homeowner',
    },
  },
  {
    name: 'create-checkout',
    handler: require('./create-checkout').handler,
    body: {
      priceId: 'price_test',
      quantity: 1,
      product: 'mini',
      isGuest: true,
      shippingAddress: {
        city: 'Miami',
        state: 'FL',
        country: 'US',
      },
    },
  },
  {
    name: 'create-payment-intent',
    handler: require('./create-payment-intent').handler,
    body: {
      priceId: 'price_test',
      quantity: 1,
      product: 'mini',
      shippingAddress: {
        name: 'Test Customer',
        line1: '123 Main St',
        city: 'Miami',
        state: 'FL',
        zip: '33101',
        country: 'US',
        email: 'test@example.com',
      },
    },
  },
  {
    name: 'update-payment-intent',
    handler: require('./update-payment-intent').handler,
    body: {
      paymentIntentId: 'pi_test',
      priceId: 'price_test',
      quantity: 1,
      product: 'mini',
      shippingAddress: {
        name: 'Test Customer',
        line1: '123 Main St',
        city: 'Miami',
        state: 'FL',
        zip: '33101',
        country: 'US',
        email: 'test@example.com',
      },
    },
  },
]

async function run() {
  for (const fn of functions) {
    const response = await fn.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify(fn.body),
    }, {})

    assert.strictEqual(response.statusCode, 503, `${fn.name} should fail closed when purchasing is disabled`)

    const body = JSON.parse(response.body)
    assert.strictEqual(body.purchasingEnabled, false, `${fn.name} should report disabled purchasing`)
  }

  console.log('Purchasing kill switch regression test passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
