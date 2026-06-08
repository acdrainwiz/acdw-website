/**
 * Get Display Price
 *
 * Returns the current homeowner/MSRP unit price for a product straight from
 * Stripe, so on-page pricing is driven by the Stripe Price (single source of
 * truth). Change the price in Stripe and the site reflects it within the cache
 * window — no redeploy needed.
 *
 * Resilience: every successful fetch is saved to Netlify Blobs as the
 * "last known good" price. If Stripe is ever unreachable, we serve that last
 * real price instead of failing. (The client also keeps a constant fallback for
 * the rare case the function itself can't be reached.)
 *
 * Display only — the actual charge is always re-validated server-side at
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

// In-memory cache per warm instance, on top of the CDN Cache-Control below.
const TTL_MS = 5 * 60 * 1000
const memCache = {}

// Netlify Blobs store for last-known-good prices. getStore uses the function
// context automatically; returns null (graceful) if Blobs isn't available.
function getPriceStore() {
  try {
    const { getStore } = require('@netlify/blobs')
    return getStore('display-prices')
  } catch (err) {
    console.warn('get-display-price: Netlify Blobs unavailable:', err.message)
    return null
  }
}

exports.handler = async (event) => {
  const baseHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
  }
  const freshCache = { ...baseHeaders, 'Cache-Control': 'public, max-age=300, s-maxage=300' }
  // Cache last-known-good responses only briefly so we retry Stripe soon.
  const staleCache = { ...baseHeaders, 'Cache-Control': 'public, max-age=60' }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: baseHeaders, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const product = (event.queryStringParameters?.product || 'mini').toLowerCase()
  const envKey = PRICE_ID_ENV[product]
  if (!envKey) {
    return { statusCode: 400, headers: baseHeaders, body: JSON.stringify({ error: 'Invalid product' }) }
  }

  const now = Date.now()
  const cached = memCache[product]
  if (cached && cached.expires > now) {
    return { statusCode: 200, headers: freshCache, body: JSON.stringify(cached.data) }
  }

  const store = getPriceStore()
  const priceId = process.env[envKey]
  const blobKey = `price:${product}`

  // 1) Try the live Stripe price.
  if (priceId) {
    try {
      const price = await stripe.prices.retrieve(priceId)
      const data = { product, unitPrice: price.unit_amount / 100, currency: price.currency, source: 'live' }
      memCache[product] = { data, expires: now + TTL_MS }
      // Persist last-known-good (best effort — never block the response on this).
      if (store) {
        try {
          await store.setJSON(blobKey, { unitPrice: data.unitPrice, currency: data.currency, capturedAt: new Date().toISOString() })
        } catch (e) {
          console.warn('get-display-price: blob write failed', e.message)
        }
      }
      return { statusCode: 200, headers: freshCache, body: JSON.stringify(data) }
    } catch (stripeErr) {
      console.error('get-display-price: Stripe retrieve failed, falling back to last-known', { product, message: stripeErr.message })
    }
  }

  // 2) Fall back to the last-known-good price saved in Blobs.
  if (store) {
    try {
      const last = await store.get(blobKey, { type: 'json' })
      if (last && typeof last.unitPrice === 'number') {
        const data = { product, unitPrice: last.unitPrice, currency: last.currency || 'usd', source: 'last-known', capturedAt: last.capturedAt }
        return { statusCode: 200, headers: staleCache, body: JSON.stringify(data) }
      }
    } catch (e) {
      console.warn('get-display-price: blob read failed', e.message)
    }
  }

  // 3) Nothing available yet — let the client use its own constant fallback.
  return { statusCode: 503, headers: baseHeaders, body: JSON.stringify({ error: 'Price temporarily unavailable' }) }
}
