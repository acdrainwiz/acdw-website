const assert = require('assert')
const Module = require('module')

const originalLoad = Module._load

function clearFunctionModules() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes('/netlify/functions/')) {
      delete require.cache[key]
    }
  }
}

async function withMockedStripe(mockStripe, run) {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => mockStripe
    }
    return originalLoad.call(this, request, parent, isMain)
  }

  clearFunctionModules()
  try {
    await run()
  } finally {
    Module._load = originalLoad
    clearFunctionModules()
  }
}

function jsonEvent(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0',
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify(body),
  }
}

function browserFormHeaders(ip) {
  return {
    accept: 'application/json',
    'accept-language': 'en-US,en;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'content-type': 'application/x-www-form-urlencoded',
    origin: 'https://www.acdrainwiz.com',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'x-forwarded-for': ip,
  }
}

async function testPurchasingDisabledShortCircuitsPaymentFunctions() {
  const previousPurchasing = process.env.PURCHASING_ENABLED
  const previousVitePurchasing = process.env.VITE_PURCHASING_ENABLED
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  let stripeTouched = false
  const stripe = {
    prices: {
      retrieve: async () => {
        stripeTouched = true
        return { unit_amount: 4999, currency: 'usd' }
      },
    },
    paymentIntents: {
      retrieve: async () => {
        stripeTouched = true
        return { metadata: {} }
      },
      create: async () => {
        stripeTouched = true
        return {}
      },
      update: async () => {
        stripeTouched = true
        return {}
      },
    },
  }

  try {
    await withMockedStripe(stripe, async () => {
      const getPrice = require('./get-price-id')
      const createCheckout = require('./create-checkout')
      const createPaymentIntent = require('./create-payment-intent')
      const updatePaymentIntent = require('./update-payment-intent')

      const requests = [
        getPrice.handler(jsonEvent({ product: 'mini', quantity: 1, role: 'homeowner' }), {}),
        createCheckout.handler(jsonEvent({
          priceId: 'price_any',
          quantity: 1,
          product: 'mini',
          isGuest: true,
          shippingAddress: { city: 'Miami', state: 'FL', country: 'US' },
        }), {}),
        createPaymentIntent.handler(jsonEvent({
          priceId: 'price_any',
          quantity: 1,
          product: 'mini',
          shippingAddress: {
            name: 'Test User',
            email: 'test@example.com',
            line1: '1 Main St',
            city: 'Miami',
            state: 'FL',
            zip: '33101',
            country: 'US',
          },
        }), {}),
        updatePaymentIntent.handler(jsonEvent({
          paymentIntentId: 'pi_123',
          priceId: 'price_any',
          quantity: 1,
          product: 'mini',
          shippingAddress: {
            name: 'Test User',
            email: 'test@example.com',
            line1: '1 Main St',
            city: 'Miami',
            state: 'FL',
            zip: '33101',
            country: 'US',
          },
        }), {}),
      ]

      const responses = await Promise.all(requests)
      for (const response of responses) {
        assert.strictEqual(response.statusCode, 503)
        assert.strictEqual(JSON.parse(response.body).purchasingDisabled, true)
      }
      assert.strictEqual(stripeTouched, false, 'disabled purchasing must return before Stripe is touched')
    })
  } finally {
    if (previousPurchasing === undefined) delete process.env.PURCHASING_ENABLED
    else process.env.PURCHASING_ENABLED = previousPurchasing
    if (previousVitePurchasing === undefined) delete process.env.VITE_PURCHASING_ENABLED
    else process.env.VITE_PURCHASING_ENABLED = previousVitePurchasing
  }
}

async function testMiniAlwaysUsesHomeownerPrice() {
  const previousPurchasing = process.env.PURCHASING_ENABLED
  const previousMiniHomeownerPrice = process.env.STRIPE_PRICE_MINI_HOMEOWNER
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'

  const retrievedPriceIds = []
  const stripe = {
    prices: {
      retrieve: async (priceId) => {
        retrievedPriceIds.push(priceId)
        return { unit_amount: 4999, currency: 'usd' }
      },
    },
  }

  try {
    await withMockedStripe(stripe, async () => {
      const { handler } = require('./get-price-id')

      const hvacMini = await handler(jsonEvent({ product: 'mini', quantity: 10, role: 'hvac_pro' }), {})
      assert.strictEqual(hvacMini.statusCode, 200)
      assert.deepStrictEqual(JSON.parse(hvacMini.body), {
        priceId: 'price_mini_homeowner',
        product: 'mini',
        quantity: 10,
        role: 'hvac_pro',
        tier: 'msrp',
        unitPrice: 49.99,
        currency: 'usd',
      })

      const propertyManagerMini = await handler(jsonEvent({ product: 'mini', quantity: 600, role: 'property_manager' }), {})
      assert.strictEqual(propertyManagerMini.statusCode, 200)
      assert.strictEqual(JSON.parse(propertyManagerMini.body).priceId, 'price_mini_homeowner')

      const sensorOverCap = await handler(jsonEvent({ product: 'sensor', quantity: 600, role: 'hvac_pro' }), {})
      assert.strictEqual(sensorOverCap.statusCode, 400)
      assert.strictEqual(JSON.parse(sensorOverCap.body).requiresContact, true)

      assert.deepStrictEqual(retrievedPriceIds, ['price_mini_homeowner', 'price_mini_homeowner'])
    })
  } finally {
    if (previousPurchasing === undefined) delete process.env.PURCHASING_ENABLED
    else process.env.PURCHASING_ENABLED = previousPurchasing
    if (previousMiniHomeownerPrice === undefined) delete process.env.STRIPE_PRICE_MINI_HOMEOWNER
    else process.env.STRIPE_PRICE_MINI_HOMEOWNER = previousMiniHomeownerPrice
  }
}

async function testGhlFormFailureReturns502() {
  clearFunctionModules()
  const ghlClient = require('./utils/ghl-client')
  const originalSubmitForm = ghlClient.submitForm
  ghlClient.submitForm = async () => {
    throw new Error('GHL unavailable')
  }

  try {
    const { handler } = require('./validate-form-submission')
    const form = new URLSearchParams({
      'form-name': 'contact-general',
      'form-type': 'contact-general',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      message: 'Please contact me about AC Drain Wiz.',
      consent: 'yes',
      'form-load-time': String(Date.now() - 5000),
    })

    const response = await handler({
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-form-submission',
      headers: browserFormHeaders('203.0.113.20'),
      body: form.toString(),
    }, {})

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(JSON.parse(response.body).success, false)
  } finally {
    ghlClient.submitForm = originalSubmitForm
    clearFunctionModules()
  }
}

async function testGhlUnsubscribeFailureReturns502() {
  clearFunctionModules()
  const ghlClient = require('./utils/ghl-client')
  const originalSubmitForm = ghlClient.submitForm
  ghlClient.submitForm = async () => {
    throw new Error('GHL unavailable')
  }

  try {
    const { handler } = require('./validate-unsubscribe')
    const form = new URLSearchParams({
      email: 'unsubscribe@example.com',
      reason: 'not-relevant',
      'form-load-time': String(Date.now() - 5000),
    })

    const response = await handler({
      httpMethod: 'POST',
      path: '/.netlify/functions/validate-unsubscribe',
      headers: browserFormHeaders('203.0.113.21'),
      body: form.toString(),
    }, {})

    assert.strictEqual(response.statusCode, 502)
    assert.strictEqual(JSON.parse(response.body).success, false)
  } finally {
    ghlClient.submitForm = originalSubmitForm
    clearFunctionModules()
  }
}

async function run() {
  await testPurchasingDisabledShortCircuitsPaymentFunctions()
  await testMiniAlwaysUsesHomeownerPrice()
  await testGhlFormFailureReturns502()
  await testGhlUnsubscribeFailureReturns502()
  console.log('Critical regression tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
