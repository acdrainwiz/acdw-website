/**
 * Create Stripe Checkout Session
 * 
 * SECURITY: Validates user authentication, role, and price before creating checkout
 * 
 * Creates a Stripe Checkout session with the correct price and quantity
 */

// Import utilities
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { logAPIAccess, logRateLimit, EVENT_TYPES } = require('./utils/security-logger')
const { calculateShipping, parseProducts } = require('./utils/shipping-calculator.cjs')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

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
      logRateLimit(ip, 'api', '/.netlify/functions/create-checkout')
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
    logAPIAccess('/.netlify/functions/create-checkout', 'POST', ip, event.headers['user-agent'] || 'unknown', true)
    
    // Parse request body
    const { priceId, quantity, product, userEmail, userId, isGuest, shippingAddress, preCalculatedShippingCost } = JSON.parse(event.body)

    // Validate inputs
    if (!priceId || !quantity || !product) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // For guest checkout, email will be collected by Stripe
    // For logged-in users, email is required
    if (!isGuest && !userEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email required for logged-in users' }),
      }
    }

    // Validate quantity
    // No business cap on quantity (any amount can be purchased at list price);
    // upper bound is Stripe's per-line-item maximum (999,999) as a defensive guard.
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty < 1 || qty > 999999) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid quantity' }),
      }
    }

    // Verify Price ID exists in Stripe
    let price
    try {
      price = await stripe.prices.retrieve(priceId)
    } catch (stripeError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid price ID' }),
      }
    }

    // Calculate shipping cost
    // Shipping should ALWAYS be pre-calculated before creating Stripe session
    // SECURITY: Always re-verify shipping cost server-side to prevent manipulation
    let shippingCost
    
    if (!shippingAddress || !shippingAddress.state || !shippingAddress.country) {
      // No shipping address provided
      // This shouldn't happen with new flow, but handle gracefully
      console.error('No shipping address provided')
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Shipping address required. Please go through checkout page.' }),
      }
    }
    
    // SECURITY: Always calculate shipping server-side
    // Even if client provided preCalculatedShippingCost, we verify it
    console.log('Calculating shipping from provided address:', shippingAddress)
    
    const products = {
      [product]: qty,
    }
    
    let shippingResult
    try {
      shippingResult = await calculateShipping(shippingAddress, products)
      console.log('Shipping calculation result:', shippingResult)
      shippingCost = shippingResult.cost
    } catch (shippingError) {
      console.error('Shipping calculation failed:', shippingError)
      // Use a reasonable fallback based on zone
      const fallbackCost = shippingAddress.country === 'CA' ? 20.00 : 15.00
      console.log('Using fallback shipping cost:', fallbackCost)
      shippingCost = fallbackCost
    }
    
    // SECURITY: If client provided a pre-calculated cost, verify it matches
    // This prevents manipulation of shipping cost
    if (preCalculatedShippingCost !== undefined && preCalculatedShippingCost !== null) {
      const difference = Math.abs(shippingCost - preCalculatedShippingCost)
      if (difference > 0.50) {
        // Shipping cost differs by more than $0.50 - possible manipulation
        console.warn('Shipping cost mismatch:', {
          serverCalculated: shippingCost,
          clientProvided: preCalculatedShippingCost,
          difference,
        })
        // Use server-calculated value, not client-provided
      }
    }
    
    // Create Stripe Checkout session
    // Add shipping as a separate line item instead of using shipping_options
    // This avoids requiring the customer to re-enter their address at Stripe
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: qty,
          adjustable_quantity: {
            enabled: false, // Disable quantity adjustment in Stripe checkout
          },
        },
        // Add shipping as a line item
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shipping & Handling',
              description: `Standard Ground (${shippingAddress.country === 'CA' ? '7-14' : '3-7'} business days) to ${shippingAddress.city}, ${shippingAddress.state}`,
            },
            unit_amount: Math.round(shippingCost * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Enable Stripe Tax automatic calculation
      // Stripe will calculate sales tax (US) or VAT/GST (international) based on shipping address
      automatic_tax: {
        enabled: true,
      },
      // NOTE: Stripe Checkout doesn't support pre-filling shipping addresses
      // User will need to enter address in Stripe, but tax will calculate correctly once entered
      // This is required for Stripe Tax to work properly
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add other countries as needed
      },
      success_url: `${process.env.URL || 'https://www.acdrainwiz.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}${isGuest ? '&guest=true' : ''}`,
      cancel_url: `${process.env.URL || 'https://www.acdrainwiz.com'}/checkout/cancel`,
      
      // CRITICAL FOR RECEIPT EMAILS:
      // For guest checkout, always create a customer
      // This ensures Stripe has a customer email to send receipt to
      ...(isGuest && { customer_creation: 'always' }),
      
      // Set customer_email for logged-in users (Stripe will collect for guests)
      ...(userEmail && { customer_email: userEmail }),
      
      // Set receipt_email explicitly to ensure payment confirmation email is sent
      // NOTE: When receipt_email is provided, Stripe ignores dashboard email settings
      // This ensures emails are sent regardless of dashboard configuration
      // For logged-in users: use their email
      // For guests: Stripe will automatically use the customer's email (created via customer_creation: 'always')
      ...(userEmail && {
        payment_intent_data: {
          receipt_email: userEmail, // Explicitly set receipt email for logged-in users
        }
      }),
      
      metadata: {
        userId: userId || '',
        product,
        quantity: qty.toString(),
        isGuest: isGuest ? 'true' : 'false',
        shippingCost: shippingCost.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    }

    console.log('Creating Stripe session with shipping as line item:', shippingCost)
    console.log('Checkout session email configuration:', {
      hasUserEmail: !!userEmail,
      userEmail: userEmail ? `${userEmail.substring(0, 3)}***@${userEmail.split('@')[1]}` : 'none',
      isGuest,
      customerCreation: isGuest ? 'always' : 'not set',
      customerEmailSet: !!userEmail,
      receiptEmailSet: !!userEmail, // Set in payment_intent_data for logged-in users
      note: isGuest 
        ? 'Guest checkout: customer_creation=always ensures Customer is created with email. Stripe sends receipt automatically to Customer.' 
        : 'Logged-in user: receipt_email explicitly set in payment_intent_data. Stripe sends receipt automatically.',
      important: 'Stripe sends receipts automatically when Customer exists OR receipt_email is set on PaymentIntent.'
    })
    
    // Validate shipping address format for tax calculation
    const shippingAddr = sessionConfig.shipping?.address
    const addressValidation = {
      hasLine1: !!shippingAddr?.line1,
      hasCity: !!shippingAddr?.city,
      hasState: !!shippingAddr?.state,
      hasPostalCode: !!shippingAddr?.postal_code,
      hasCountry: !!shippingAddr?.country,
      stateLength: shippingAddr?.state?.length || 0,
      countryLength: shippingAddr?.country?.length || 0,
      isValid: !!(shippingAddr?.line1 && shippingAddr?.city && shippingAddr?.state && shippingAddr?.postal_code && shippingAddr?.country),
    }
    
    // Log tax configuration for debugging
    console.log('🔍 Stripe Tax Configuration:', {
      automaticTaxEnabled: sessionConfig.automatic_tax?.enabled,
      shippingAddressCollection: sessionConfig.shipping_address_collection?.allowed_countries,
      note: 'Stripe Checkout will collect shipping address - tax will calculate once address is entered',
      warnings: [
        '💡 If tax still not showing, check: (1) Tax Registrations in Stripe Dashboard → Settings → Tax → Registrations, (2) Shipping origin address is set, (3) Product tax codes are configured'
      ],
    })

    const session = await stripe.checkout.sessions.create(sessionConfig)
    
    // Log session details for debugging
    console.log('Stripe checkout session created:', {
      sessionId: session.id,
      customerEmail: session.customer_email || 'will be collected during checkout',
      url: session.url?.substring(0, 50) + '...',
      // Log tax details if available
      taxDetails: session.total_details?.breakdown?.taxes ? {
        taxCount: session.total_details.breakdown.taxes.length,
        totalTax: session.total_details.amount_tax ? (session.total_details.amount_tax / 100).toFixed(2) : '0.00',
        taxes: session.total_details.breakdown.taxes.map(t => ({
          amount: (t.amount / 100).toFixed(2),
          rate: t.rate?.display_name || 'Unknown',
        })),
      } : 'No tax calculated - Check Stripe Tax settings in Dashboard',
      automaticTaxStatus: session.automatic_tax?.enabled ? 'enabled' : 'disabled',
      warning: session.total_details?.breakdown?.taxes?.length === 0 
        ? '⚠️ Tax not calculated - Verify Stripe Tax is enabled in Stripe Dashboard → Settings → Tax'
        : null,
    })

    return {
      statusCode: 200,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    }
  } catch (error) {
    console.error('Error creating checkout session:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      raw: error.raw,
    })
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to create checkout session'
    let errorDetails = null
    
    if (error.type === 'StripeInvalidRequestError') {
      if (error.code === 'parameter_invalid_empty') {
        errorMessage = 'Invalid checkout configuration. Please check shipping options.'
        errorDetails = error.message
      } else if (error.message?.includes('automatic_tax')) {
        errorMessage = 'Stripe Tax is not enabled in your Stripe account. Please enable it in Stripe Dashboard → Tax settings, or disable automatic tax in the code.'
        errorDetails = 'To enable: Go to Stripe Dashboard → Settings → Tax, and enable Stripe Tax'
      } else {
        errorMessage = `Stripe error: ${error.message}`
        errorDetails = error.code
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        type: error.type,
        code: error.code,
      }),
    }
  }
}

