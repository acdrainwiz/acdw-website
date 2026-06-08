/**
 * Get Display Price
 *
 * Returns the current homeowner/MSRP unit price for a product straight from
 * Stripe, so on-page pricing is driven by the Stripe Price (single source of
 * truth) instead of a hardcoded constant. Change the price in Stripe and the
 * site reflects it within the cache TTL — no redeploy needed.
 *
 * Display only. The actual charge is always re-validated server-side at
 * checkout (create-payment-intent / get-price-id).
 *
 * GET /.netlify/functions/get-display-price?product=mini
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Public display prices use the homeowner (MSRP) Price ID for each product.
const PRICE_ID_ENV = {
  mini: 'STRIPE_PRICE_MINI_HOMEOWNER',
  sensor: 'STRIPE_PRICE_SENSOR_HOMEOWNER',
  bundle: 'STRIPE_PRICE_BUNDLE_HOMEOWNER',
}

// In-memory cache per warm function instance. Combined with the CDN Cache-Control
// below, this keeps Stripe API calls rare even under heavy browsing traffic.
const TTL_MS = 5 * 60 * 1000
const cache = {}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    // Cache at the browser + Netlify CDN for 5 minutes (matches the in-memory TTL).
    'Cache-Control': 'public, max-age=300, s-maxage=300',
    'X-Content-Type-Options': 'nosniff',
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const product = (event.queryStringParameters?.product || 'mini').toLowerCase()
  const envKey = PRICE_ID_ENV[product]
  if (!envKey) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid product' }) }
  }

  const priceId = process.env[envKey]
  if (!priceId) {
    // Price ID not configured yet — let the client fall back to its constant.
    return { statusCode: 503, headers, body: JSON.stringify({ error: `${envKey} not configured` }) }
  }

  const now = Date.now()
  const cached = cache[product]
  if (cached && cached.expires > now) {
    return { statusCode: 200, headers, body: JSON.stringify(cached.data) }
  }

  try {
    const price = await stripe.prices.retrieve(priceId)
    const data = {
      product,
      unitPrice: price.unit_amount / 100,
      currency: price.currency,
    }
    cache[product] = { data, expires: now + TTL_MS }
    return { statusCode: 200, headers, body: JSON.stringify(data) }
  } catch (err) {
    console.error('get-display-price: Stripe retrieve failed', { product, priceId, message: err.message })
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Failed to retrieve price' }) }
  }
}
