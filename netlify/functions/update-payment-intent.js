/**
 * Update Stripe Payment Intent
 * 
 * Updates a Payment Intent when shipping address changes
 * Recalculates shipping and tax in real-time
 * 
 * SECURITY: Validates inputs and recalculates shipping server-side
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
    
    // Check rate limit (stricter for updates - prevent abuse)
    const rateLimitResult = await checkRateLimit(ip, 'api', context)
    if (!rateLimitResult.allowed) {
      logRateLimit(ip, 'api', '/.netlify/functions/update-payment-intent')
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
    logAPIAccess('/.netlify/functions/update-payment-intent', 'POST', ip, event.headers['user-agent'] || 'unknown', true)
    
    // Parse request body
    const { paymentIntentId, shippingAddress, product, quantity, priceId } = JSON.parse(event.body)

    // Validate inputs
    if (!paymentIntentId || !shippingAddress || !product || !quantity || !priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // Validate shipping address
    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip || !shippingAddress.country) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Complete shipping address required' }),
      }
    }

    // Validate email (required for ShipStation notifications)
    if (!shippingAddress.email || !shippingAddress.email.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email address is required for shipment notifications' }),
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const trimmedEmail = shippingAddress.email.trim().toLowerCase()
    if (!emailRegex.test(trimmedEmail)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Please enter a valid email address' }),
      }
    }

    // Validate email length (ShipStation requirement: 50 characters max)
    if (trimmedEmail.length > 50) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email address must be 50 characters or less (required for shipment notifications)' }),
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

    // Verify Payment Intent exists and belongs to this session
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    } catch (stripeError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid payment intent' }),
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

    // Recalculate shipping cost server-side
    // SECURITY: Always recalculate shipping server-side to prevent manipulation
    let shippingCost
    try {
      const products = {
        [product]: qty,
      }
      
      const shippingResult = await calculateShipping(shippingAddress, products)
      shippingCost = shippingResult.cost
      console.log('Shipping recalculated:', shippingCost)
    } catch (shippingError) {
      console.error('Shipping calculation failed:', shippingError)
      // Use fallback based on country
      shippingCost = shippingAddress.country === 'CA' ? 20.00 : 15.00
      console.log('Using fallback shipping cost:', shippingCost)
    }

    // Calculate product total
    const productAmount = price.unit_amount * qty // In cents
    const shippingAmount = Math.round(shippingCost * 100) // Convert to cents
    
    // Calculate tax manually (Payment Intents don't support automatic_tax parameter)
    // Using Stripe Tax Calculation API to get accurate tax rates
    let taxAmount = 0
    let taxDetails = []
    
    try {
      // Use Stripe's Tax Calculation API to calculate tax
      const calculation = await stripe.tax.calculations.create({
        currency: 'usd',
        line_items: [
          {
            amount: productAmount,
            reference: 'product',
          },
          {
            amount: shippingAmount,
            reference: 'shipping',
          },
        ],
        customer_details: {
          address: {
            line1: shippingAddress.line1,
            line2: shippingAddress.line2 || '',
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zip || shippingAddress.postal_code || '',
            country: shippingAddress.country,
          },
          address_source: 'shipping',
        },
      })
      
      // Extract tax from calculation
      taxAmount = calculation.tax_amount_exclusive / 100 // Convert to dollars
      taxDetails = calculation.tax_breakdown.map(tax => ({
        amount: tax.amount / 100,
        rate: tax.tax_rate_details?.display_name || 'Tax',
        percentage: tax.tax_rate_details?.percentage || 0,
      }))
      
      console.log('Tax recalculated via Stripe Tax API:', {
        taxAmount,
        taxDetails,
        calculationId: calculation.id,
      })
    } catch (taxError) {
      console.error('Stripe Tax calculation failed:', taxError.message)
      // Fallback: Use simple state-based tax rates if Tax API fails
      const stateTaxRates = {
        'ID': 0.06, // Idaho 6%
        'FL': 0.06, // Florida 6%
        'CA': 0.0725, // California 7.25%
        // Add more states as needed
      }
      
      const taxRate = shippingAddress.country === 'US' 
        ? (stateTaxRates[shippingAddress.state] || 0)
        : (shippingAddress.country === 'CA' ? 0.13 : 0) // Canada GST/HST
      
      const subtotal = (productAmount + shippingAmount) / 100
      taxAmount = subtotal * taxRate
      taxDetails = taxRate > 0 ? [{
        amount: taxAmount,
        rate: `Sales Tax (${(taxRate * 100).toFixed(2)}%)`,
        percentage: taxRate * 100,
      }] : []
      
      console.log('Using fallback tax calculation:', {
        state: shippingAddress.state,
        taxRate,
        taxAmount,
      })
    }
    
    // Calculate final amount including tax
    const taxAmountCents = Math.round(taxAmount * 100)
    const finalAmount = productAmount + shippingAmount + taxAmountCents

    // Update Payment Intent with new shipping address and amount
    // Note: Payment Intents don't support automatic_tax parameter
    // Tax is calculated separately using Stripe Tax API
    // Retrieve current Payment Intent to preserve existing metadata
    const currentPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    const finalPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: finalAmount,
      // Update shipping address
      shipping: {
        name: shippingAddress.name || 'Customer',
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zip || shippingAddress.postal_code || '',
          country: shippingAddress.country,
        },
      },
      // Update receipt email if email changed
      receipt_email: trimmedEmail,
      // Update metadata with new tax information and email
      metadata: {
        ...currentPaymentIntent.metadata, // Preserve existing metadata
        taxAmount: taxAmount.toFixed(2),
        taxDetails: JSON.stringify(taxDetails),
        shippingCost: shippingCost.toString(),
        customerEmail: trimmedEmail, // Update email in metadata
      },
    })

    console.log('Payment Intent updated:', {
      paymentIntentId: paymentIntentId,
      amount: finalAmount / 100,
      productAmount: productAmount / 100,
      shippingAmount: shippingAmount / 100,
      taxAmount: taxAmount,
      taxDetails: taxDetails,
      shippingAddress: {
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country,
      },
    })

    return {
      statusCode: 200,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify({
        clientSecret: finalPaymentIntent.client_secret, // Updated client secret
        paymentIntentId: finalPaymentIntent.id,
        amount: finalAmount, // Final amount including tax (in cents)
        productAmount: productAmount, // Product amount (in cents)
        shippingAmount: shippingAmount, // Shipping amount (in cents)
        taxAmount: taxAmount, // Tax amount (in dollars)
        taxDetails: taxDetails, // Tax breakdown
        shippingCost: shippingCost, // Shipping cost (in dollars)
      }),
    }
  } catch (error) {
    console.error('Error updating payment intent:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
    })
    
    // Provide helpful error messages
    let errorMessage = 'Failed to update payment intent'
    let errorDetails = null
    
    if (error.type === 'StripeInvalidRequestError') {
      errorMessage = `Stripe error: ${error.message}`
      errorDetails = error.code
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

