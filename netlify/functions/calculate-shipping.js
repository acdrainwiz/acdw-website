/**
 * Calculate Shipping Cost
 * 
 * SECURITY: Rate limited, input sanitized, proper validation
 * Called from CheckoutPage before creating Stripe session
 */

const { calculateShipping } = require('./utils/shipping-calculator.cjs')
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { logAPIAccess, logRateLimit, logSecurityEvent, EVENT_TYPES } = require('./utils/security-logger')
const { sanitizeString, sanitizeAddress } = require('./utils/input-sanitizer')

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
    
    // Check rate limit - more generous for shipping calculation (10 per minute)
    const rateLimitResult = await checkRateLimit(ip, 'api', context)
    if (!rateLimitResult.allowed) {
      logRateLimit(ip, 'api', '/.netlify/functions/calculate-shipping')
      return {
        statusCode: 429,
        headers: {
          ...headers,
          ...getRateLimitHeaders(rateLimitResult)
        },
        body: JSON.stringify({ 
          error: 'Too many requests. Please wait a moment and try again.',
          retryAfter: rateLimitResult.retryAfter
        }),
      }
    }
    
    // Log API access
    logAPIAccess('/.netlify/functions/calculate-shipping', 'POST', ip, event.headers['user-agent'] || 'unknown', true)
    
    // Parse request body
    const { address, products } = JSON.parse(event.body)

    // Validate required fields
    if (!address || !products) {
      logSecurityEvent(EVENT_TYPES.VALIDATION_FAILED, 'Missing address or products', {
        ip,
        hasAddress: !!address,
        hasProducts: !!products,
      })
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing address or products' }),
      }
    }
    
    // Sanitize address inputs
    const sanitizedAddress = {
      name: sanitizeString(address.name || ''),
      line1: sanitizeAddress(address.line1 || ''),
      line2: sanitizeAddress(address.line2 || ''),
      city: sanitizeString(address.city || ''),
      state: sanitizeString(address.state || '').toUpperCase().substring(0, 2),
      postal_code: sanitizeString(address.postal_code || ''),
      country: sanitizeString(address.country || 'US').toUpperCase().substring(0, 2),
    }
    
    // Validate address fields
    if (!sanitizedAddress.city || !sanitizedAddress.state || !sanitizedAddress.postal_code) {
      logSecurityEvent(EVENT_TYPES.VALIDATION_FAILED, 'Incomplete address', {
        ip,
        city: !!sanitizedAddress.city,
        state: !!sanitizedAddress.state,
        postalCode: !!sanitizedAddress.postal_code,
      })
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Incomplete address. City, state, and postal code required.' }),
      }
    }
    
    // Validate products object
    if (typeof products !== 'object' || Object.keys(products).length === 0) {
      logSecurityEvent(EVENT_TYPES.VALIDATION_FAILED, 'Invalid products', {
        ip,
        productsType: typeof products,
      })
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid products' }),
      }
    }
    
    // Validate product quantities
    // No business cap on quantity (any amount can be purchased at list price);
    // upper bound is Stripe's per-line-item maximum (999,999) as a defensive guard.
    for (const [productType, quantity] of Object.entries(products)) {
      const qty = parseInt(quantity)
      if (isNaN(qty) || qty < 1 || qty > 999999) {
        logSecurityEvent(EVENT_TYPES.VALIDATION_FAILED, 'Invalid product quantity', {
          ip,
          productType,
          quantity,
        })
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid product quantity' }),
        }
      }
    }
    
    console.log('Calculating shipping for:', {
      address: `${sanitizedAddress.city}, ${sanitizedAddress.state} ${sanitizedAddress.postal_code}`,
      products,
      ip,
    })

    // Calculate shipping cost with sanitized address
    const shippingResult = await calculateShipping(sanitizedAddress, products)
    
    console.log('Shipping calculation result:', {
      cost: shippingResult.cost,
      method: shippingResult.method,
      carrier: shippingResult.carrier,
      ip,
    })

    return {
      statusCode: 200,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify({
        cost: shippingResult.cost,
        method: shippingResult.method,
        carrier: shippingResult.carrier,
        zone: sanitizedAddress.state,
      }),
    }
  } catch (error) {
    console.error('Error calculating shipping:', {
      message: error.message,
      stack: error.stack,
      ip,
    })
    
    logSecurityEvent(EVENT_TYPES.ERROR, 'Shipping calculation error', {
      ip,
      error: error.message,
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to calculate shipping' }),
    }
  }
}

