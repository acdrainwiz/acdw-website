const assert = require('assert')
const fs = require('fs')
const Module = require('module')
const path = require('path')

const functionsDir = __dirname
const originalLoad = Module._load

function clearFunctionCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(functionsDir)) {
      delete require.cache[key]
    }
  }
}

function withStripeMock(mock, callback) {
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'stripe') {
      return () => mock
    }
    return originalLoad.call(this, request, parent, isMain)
  }

  try {
    return callback()
  } finally {
    Module._load = originalLoad
  }
}

function event(body) {
  return {
    httpMethod: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0 critical-regression-test',
      'x-forwarded-for': '127.0.0.1',
    },
    body: JSON.stringify(body),
  }
}

async function testPurchasingDisabledDefaultClosed() {
  delete process.env.PURCHASING_ENABLED
  delete process.env.VITE_PURCHASING_ENABLED

  const functionNames = [
    'get-price-id',
    'create-checkout',
    'create-payment-intent',
    'update-payment-intent',
  ]

  for (const name of functionNames) {
    clearFunctionCache()
    let stripeTouched = false
    await withStripeMock(
      {
        prices: {
          retrieve: async () => {
            stripeTouched = true
            throw new Error('disabled purchasing should not touch Stripe prices')
          },
        },
        paymentIntents: {
          retrieve: async () => {
            stripeTouched = true
            throw new Error('disabled purchasing should not touch Stripe payment intents')
          },
        },
      },
      async () => {
        const { handler } = require(path.join(functionsDir, `${name}.js`))
        const response = await handler(event({ product: 'mini', quantity: 1, priceId: 'price_mini', paymentIntentId: 'pi_test', shippingAddress: {} }), {})
        assert.strictEqual(response.statusCode, 503, `${name} must default-close when purchasing is disabled`)
        assert.strictEqual(JSON.parse(response.body).purchasingEnabled, false)
      }
    )
    assert.strictEqual(stripeTouched, false, `${name} should return before Stripe when purchasing is disabled`)
  }
}

async function testMiniAlwaysUsesListPriceForContractors() {
  process.env.PURCHASING_ENABLED = 'true'
  process.env.STRIPE_PRICE_MINI_HOMEOWNER = 'price_mini_homeowner'
  process.env.STRIPE_PRICE_MINI_HVAC_T3 = 'price_wrong_discount'

  clearFunctionCache()
  await withStripeMock(
    {
      prices: {
        retrieve: async (priceId) => {
          assert.strictEqual(priceId, 'price_mini_homeowner')
          return { unit_amount: 4999, currency: 'usd' }
        },
      },
    },
    async () => {
      const { handler } = require(path.join(functionsDir, 'get-price-id.js'))
      const response = await handler(event({ product: 'mini', quantity: 600, role: 'hvac_pro' }), {})
      assert.strictEqual(response.statusCode, 200)
      const body = JSON.parse(response.body)
      assert.strictEqual(body.priceId, 'price_mini_homeowner')
      assert.strictEqual(body.tier, 'msrp')
      assert.strictEqual(body.unitPrice, 49.99)
    }
  )
}

function testCrmFailuresDoNotReturnFalseSuccess() {
  const formHandler = fs.readFileSync(path.join(functionsDir, 'validate-form-submission.js'), 'utf8')
  assert.match(formHandler, /statusCode:\s*502[\s\S]*Form delivery failed/)

  const unsubscribeHandler = fs.readFileSync(path.join(functionsDir, 'validate-unsubscribe.js'), 'utf8')
  assert.match(unsubscribeHandler, /validateCSRFToken/)
  assert.match(unsubscribeHandler, /statusCode:\s*502[\s\S]*Unsubscribe delivery failed/)
}

async function main() {
  await testPurchasingDisabledDefaultClosed()
  await testMiniAlwaysUsesListPriceForContractors()
  testCrmFailuresDoNotReturnFalseSuccess()
  console.log('critical regressions: ok')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
