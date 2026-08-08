/**
 * Get Stripe Price ID
 * 
 * SECURITY: Server-side price validation
 * Never trust client-side price calculations
 * 
 * Validates user role, calculates tier, and returns correct Stripe Price ID
 */

// Import utilities
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { logAPIAccess, logRateLimit, EVENT_TYPES } = require('./utils/security-logger')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Price ID mapping (set these in Stripe and update here)
const PRICE_IDS = {
  // Homeowner - MSRP
  mini_homeowner: process.env.STRIPE_PRICE_MINI_HOMEOWNER,
  sensor_homeowner: process.env.STRIPE_PRICE_SENSOR_HOMEOWNER,
  bundle_homeowner: process.env.STRIPE_PRICE_BUNDLE_HOMEOWNER,
  
  // HVAC Pro - Tier 1
  mini_hvac_t1: process.env.STRIPE_PRICE_MINI_HVAC_T1,
  sensor_hvac_t1: process.env.STRIPE_PRICE_SENSOR_HVAC_T1,
  bundle_hvac_t1: process.env.STRIPE_PRICE_BUNDLE_HVAC_T1,
  
  // HVAC Pro - Tier 2
  mini_hvac_t2: process.env.STRIPE_PRICE_MINI_HVAC_T2,
  sensor_hvac_t2: process.env.STRIPE_PRICE_SENSOR_HVAC_T2,
  bundle_hvac_t2: process.env.STRIPE_PRICE_BUNDLE_HVAC_T2,
  
  // HVAC Pro - Tier 3
  mini_hvac_t3: process.env.STRIPE_PRICE_MINI_HVAC_T3,
  sensor_hvac_t3: process.env.STRIPE_PRICE_SENSOR_HVAC_T3,
  bundle_hvac_t3: process.env.STRIPE_PRICE_BUNDLE_HVAC_T3,
  
  // Property Manager - Tier 1
  mini_pm_t1: process.env.STRIPE_PRICE_MINI_PM_T1,
  sensor_pm_t1: process.env.STRIPE_PRICE_SENSOR_PM_T1,
  bundle_pm_t1: process.env.STRIPE_PRICE_BUNDLE_PM_T1,
  
  // Property Manager - Tier 2
  mini_pm_t2: process.env.STRIPE_PRICE_MINI_PM_T2,
  sensor_pm_t2: process.env.STRIPE_PRICE_SENSOR_PM_T2,
  bundle_pm_t2: process.env.STRIPE_PRICE_BUNDLE_PM_T2,
  
  // Property Manager - Tier 3
  mini_pm_t3: process.env.STRIPE_PRICE_MINI_PM_T3,
  sensor_pm_t3: process.env.STRIPE_PRICE_SENSOR_PM_T3,
  bundle_pm_t3: process.env.STRIPE_PRICE_BUNDLE_PM_T3,
}

/**
 * Calculate tier based on quantity
 */
function calculateTier(quantity) {
  if (quantity >= 1 && quantity <= 20) return 'tier_1'
  if (quantity >= 21 && quantity <= 100) return 'tier_2'
  if (quantity >= 101 && quantity <= 500) return 'tier_3'
  return null // > 500 requires contact sales
}

/**
 * Get Price ID key based on product, role, and tier
 */
function getPriceIdKey(product, role, tier) {
  if (role === 'homeowner') {
    return `${product}_homeowner`
  }
  
  const rolePrefix = role === 'hvac_pro' ? 'hvac' : 'pm'
  const tierSuffix = tier === 'tier_1' ? 't1' : tier === 'tier_2' ? 't2' : 't3'
  
  return `${product}_${rolePrefix}_${tierSuffix}`
}

exports.handler = async (event, context) => {
  // Security headers
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    // Get client IP
    const ip = getClientIP(event)
    
    // Check rate limit
    const rateLimitResult = await checkRateLimit(ip, 'api', context)
    if (!rateLimitResult.allowed) {
      logRateLimit(ip, 'api', '/.netlify/functions/get-price-id')
      return {
        statusCode: 429,
        headers: {
          ...headers,
          ...getRateLimitHeaders(rateLimitResult)
        },
        body: JSON.stringify({ 
          error: 'Too many requests',
          retryAfter: rateLimitResult.retryAfter
        }),
      }
    }
    
    // Log API access
    logAPIAccess('/.netlify/functions/get-price-id', 'POST', ip, event.headers['user-agent'] || 'unknown', true)
    
    // Parse request body
    const { product, quantity, role } = JSON.parse(event.body)

    // Validate inputs
    if (!product || !quantity) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // Validate product type
    const validProducts = ['mini', 'sensor', 'bundle']
    if (!validProducts.includes(product)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid product' }),
      }
    }

    // Security: Sensor and Bundle require authentication (contractor-only products)
    // Only Mini allows guest checkout (homeowner product)
    if ((product === 'sensor' || product === 'bundle') && !role) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          error: 'Authentication required. Sensor and Bundle products are only available to verified contractors.',
          requiresAuth: true
        }),
      }
    }

    // Default to 'homeowner' role for guest checkout (only for Mini)
    const userRole = role || 'homeowner'

    // Validate role
    const validRoles = ['homeowner', 'hvac_pro', 'property_manager']
    if (!validRoles.includes(userRole)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid role' }),
      }
    }

    // Validate quantity
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty < 1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid quantity' }),
      }
    }

    // Mini is sold online at public/list price for every buyer. Authenticated
    // contractor roles still apply to Sensor and Bundle tiered pricing only.
    const pricingRole = product === 'mini' ? 'homeowner' : userRole

    // Quantity ceiling.
    // Contractor / property-manager pricing tiers top out at 500 units; above that we
    // route to sales for a custom volume quote. Homeowners buy at flat MSRP, so any
    // quantity is allowed online (only Stripe's per-line-item max of 999,999 guards it).
    if (pricingRole !== 'homeowner' && qty > 500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Quantity exceeds automated limit',
          requiresContact: true,
        }),
      }
    }
    if (qty > 999999) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid quantity' }),
      }
    }

    // Calculate tier
    let tier = 'msrp'
    if (pricingRole !== 'homeowner') {
      tier = calculateTier(qty)
      if (!tier) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Quantity requires contact sales',
            requiresContact: true,
          }),
        }
      }
    }

    // Get Price ID
    const priceIdKey = getPriceIdKey(product, pricingRole, tier)
    const priceId = PRICE_IDS[priceIdKey]

    if (!priceId) {
      console.error(`Price ID not found for: ${priceIdKey}`, {
        product,
        role,
        tier,
        quantity: qty,
        availableKeys: Object.keys(PRICE_IDS)
      })
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: `Price configuration error: ${priceIdKey} not found in environment variables`,
          priceIdKey,
          product,
          role,
          tier
        }),
      }
    }

    // Verify Price ID exists in Stripe
    try {
      const price = await stripe.prices.retrieve(priceId)
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          priceId,
          product,
          quantity: qty,
          role: pricingRole,
          tier,
          unitPrice: price.unit_amount / 100, // Convert from cents
          currency: price.currency,
        }),
      }
    } catch (stripeError) {
      console.error('Stripe price verification error:', {
        priceId,
        priceIdKey,
        errorType: stripeError.type,
        errorMessage: stripeError.message,
        errorCode: stripeError.code,
        stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) // Show if it's sk_test_ or sk_live_
      })
      
      // Provide more helpful error messages
      let errorMessage = 'Stripe price verification failed'
      if (stripeError.type === 'StripeInvalidRequestError') {
        if (stripeError.code === 'resource_missing') {
          errorMessage = `Price ID not found in Stripe: ${priceId}. Please verify the Price ID exists in your Stripe account.`
        } else if (stripeError.message?.includes('No such price')) {
          errorMessage = `Price ID does not exist: ${priceId}. Make sure you're using test mode Price IDs with test mode secret key.`
        } else {
          errorMessage = `Stripe error: ${stripeError.message}`
        }
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? stripeError.message : undefined
        }),
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

