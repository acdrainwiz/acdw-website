/**
 * Create ShipStation Order
 * 
 * Creates an order in ShipStation from Stripe checkout session data
 * Called by stripe-webhook.js when payment is successful
 */

// Import utilities
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { logAPIAccess, logRateLimit, EVENT_TYPES } = require('./utils/security-logger')

// SKU Mapping - matches src/config/shipstation.ts
// TODO: This should ideally be shared, but for Netlify Functions we'll duplicate it
const SKU_MAPPING = {
  // Homeowner
  'price_1SZe5X60dq6nGBAfwo2hsNxK': { sku: 'ACDW-MINI', name: 'AC Drain Wiz Mini' },
  
  // HVAC Pro - Mini
  'price_1SZebe60dq6nGBAfutAtD9re': { sku: 'ACDW-MINI-PRO-T1', name: 'AC Drain Wiz Mini' },
  'price_1SZeiH60dq6nGBAf2o2ypICU': { sku: 'ACDW-MINI-PRO-T2', name: 'AC Drain Wiz Mini' },
  'price_1SZekg60dq6nGBAfTQ8c630l': { sku: 'ACDW-MINI-PRO-T3', name: 'AC Drain Wiz Mini' },
  
  // HVAC Pro - Sensor
  'price_1SZenc60dq6nGBAfvTu9zjFI': { sku: 'ACDW-SENSOR-PRO-T1', name: 'AC Drain Wiz Sensor' },
  'price_1SZf1t60dq6nGBAfe36Q57Bp': { sku: 'ACDW-SENSOR-PRO-T2', name: 'AC Drain Wiz Sensor' },
  'price_1SZf5i60dq6nGBAfa1p0ruWp': { sku: 'ACDW-SENSOR-PRO-T3', name: 'AC Drain Wiz Sensor' },
  
  // HVAC Pro - Bundle
  'price_1SZf9f60dq6nGBAfmqSXnqbY': { sku: 'ACDW-BUNDLE-PRO-T1', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfAh60dq6nGBAfAsho4TuM': { sku: 'ACDW-BUNDLE-PRO-T2', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfD360dq6nGBAfwElA3YTM': { sku: 'ACDW-BUNDLE-PRO-T3', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  
  // Property Manager - Mini
  'price_1SZfHZ60dq6nGBAfVcHud4Fa': { sku: 'ACDW-MINI-PM-T1', name: 'AC Drain Wiz Mini' },
  'price_1SZfJH60dq6nGBAfgPDGJLVs': { sku: 'ACDW-MINI-PM-T2', name: 'AC Drain Wiz Mini' },
  'price_1SZfLW60dq6nGBAf7vNkpTVd': { sku: 'ACDW-MINI-PM-T3', name: 'AC Drain Wiz Mini' },
  
  // Property Manager - Sensor
  'price_1SZfMZ60dq6nGBAfglTItYiC': { sku: 'ACDW-SENSOR-PM-T1', name: 'AC Drain Wiz Sensor' },
  'price_1SZfNQ60dq6nGBAf3ULHuQf5': { sku: 'ACDW-SENSOR-PM-T2', name: 'AC Drain Wiz Sensor' },
  'price_1SZfUL60dq6nGBAfVIhk1Q4F': { sku: 'ACDW-SENSOR-PM-T3', name: 'AC Drain Wiz Sensor' },
  
  // Property Manager - Bundle
  'price_1SZfVA60dq6nGBAfPahshH8Z': { sku: 'ACDW-BUNDLE-PM-T1', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfWA60dq6nGBAf2qwsKsgi': { sku: 'ACDW-BUNDLE-PM-T2', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfWm60dq6nGBAfDDdadlnM': { sku: 'ACDW-BUNDLE-PM-T3', name: 'AC Drain Wiz Mini + Sensor Bundle' },
}

/**
 * Send email notification
 */
async function sendEmailNotification(orderData, success, error = null) {
  const notificationEmails = process.env.SHIPSTATION_NOTIFICATION_EMAILS
  if (!notificationEmails) {
    console.log('No notification emails configured')
    return
  }

  const emails = notificationEmails.split(',').map(e => e.trim())
  const subject = success 
    ? `✅ New Order Created in ShipStation: ${orderData.orderNumber}`
    : `❌ Failed to Create ShipStation Order: ${orderData.orderNumber}`

  const body = success
    ? `
New order has been created in ShipStation:

Order Number: ${orderData.orderNumber}
Customer: ${orderData.customerName}
Email: ${orderData.customerEmail}
Total: $${orderData.orderTotal.toFixed(2)}

Items:
${orderData.items.map(item => `  - ${item.name} (${item.quantity}x) - SKU: ${item.sku}`).join('\n')}

Shipping Address:
${orderData.shippingAddress.name}
${orderData.shippingAddress.street1}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}
${orderData.shippingAddress.country}

View in ShipStation: https://ss.shipstation.com/orders
    `.trim()
    : `
Failed to create order in ShipStation:

Order Number: ${orderData.orderNumber}
Customer: ${orderData.customerEmail}
Error: ${error || 'Unknown error'}

Please check ShipStation integration and create order manually if needed.
    `.trim()

  // Use Netlify's built-in email or send via external service
  // For now, we'll log it - you can integrate with SendGrid, Mailgun, etc.
  console.log('📧 Email Notification:', {
    to: emails,
    subject,
    body
  })

  // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
  // For now, this will be handled by Zapier or you can add email service
}

/**
 * Create order in ShipStation
 */
async function createShipStationOrder(orderData) {
  const apiKey = process.env.SHIPSTATION_API_KEY
  const apiSecret = process.env.SHIPSTATION_API_SECRET
  const storeIdEnv = process.env.SHIPSTATION_STORE_ID || null

  if (!apiKey || !apiSecret) {
    throw new Error('ShipStation API credentials not configured')
  }

  // ShipStation API requires storeId to be an integer, not a UUID
  // If storeId is a UUID (contains hyphens), we'll skip it
  // Orders will still be created successfully, just not associated with a specific store
  let storeId = null
  if (storeIdEnv) {
    // Check if it's a numeric ID (integer) or UUID (contains hyphens)
    if (!storeIdEnv.includes('-') && !isNaN(parseInt(storeIdEnv, 10))) {
      storeId = parseInt(storeIdEnv, 10)
    } else {
      console.log('Store ID is a UUID, skipping storeId in request (API requires integer)')
    }
  }

  // Create Basic Auth header
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  // Build ShipStation order payload
  const shipstationOrder = {
    orderNumber: orderData.orderNumber,
    orderDate: orderData.orderDate,
    orderStatus: 'awaiting_shipment',
    customerUsername: orderData.customerEmail,
    customerEmail: orderData.customerEmail,
    billTo: {
      name: orderData.customerName,
      street1: orderData.shippingAddress.street1,
      street2: orderData.shippingAddress.street2 || '',
      city: orderData.shippingAddress.city,
      state: orderData.shippingAddress.state,
      postalCode: orderData.shippingAddress.postalCode,
      country: orderData.shippingAddress.country,
    },
    shipTo: {
      name: orderData.shippingAddress.name,
      street1: orderData.shippingAddress.street1,
      street2: orderData.shippingAddress.street2 || '',
      city: orderData.shippingAddress.city,
      state: orderData.shippingAddress.state,
      postalCode: orderData.shippingAddress.postalCode,
      country: orderData.shippingAddress.country,
    },
    items: orderData.items,
    amountPaid: orderData.orderTotal,
    taxAmount: orderData.taxAmount || 0,
    shippingAmount: orderData.shippingAmount || 0,
    ...(storeId && { advancedOptions: { storeId } }),
  }

  console.log('Creating ShipStation order:', {
    orderNumber: shipstationOrder.orderNumber,
    itemCount: shipstationOrder.items.length,
    total: shipstationOrder.amountPaid
  })

  // Make API call to ShipStation
  const response = await fetch('https://ssapi.shipstation.com/orders/createorder', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shipstationOrder),
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { message: errorText }
    }

    console.error('ShipStation API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    })

    throw new Error(`ShipStation API error: ${response.status} - ${errorData.message || errorText}`)
  }

  const result = await response.json()
  console.log('ShipStation order created successfully:', {
    orderId: result.orderId,
    orderNumber: result.orderNumber
  })

  return result
}

/**
 * Main handler
 */
exports.handler = async (event, context) => {
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
  
  // Rate limiting check (webhook endpoints get higher limits)
  const ip = getClientIP(event)
  const rateLimitResult = await checkRateLimit(ip, 'api', context)
  
  if (!rateLimitResult.allowed) {
    logRateLimit(ip, 'api', rateLimitResult.limit, rateLimitResult.remaining, true)
    
    return {
      statusCode: 429,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify({
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      })
    }
  }

  try {
    // Parse order data from request body
    const orderData = JSON.parse(event.body)

    // Validate required fields
    const missingFields = []
    
    if (!orderData.orderNumber) {
      missingFields.push('orderNumber')
    }
    
    // Validate email is present (should always be present now)
    if (!orderData.customerEmail || orderData.customerEmail.trim() === '') {
      console.error('Missing customer email in order data')
      missingFields.push('customerEmail')
    } else {
      // Validate email length (ShipStation requirement: 50 characters max)
      const trimmedEmail = orderData.customerEmail.trim()
      if (trimmedEmail.length > 50) {
        console.error('Email exceeds ShipStation 50 character limit:', trimmedEmail.length)
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Email address exceeds ShipStation limit',
            details: 'Email must be 50 characters or less for shipment notifications',
            emailLength: trimmedEmail.length,
          }),
        }
      }
      // Use trimmed email
      orderData.customerEmail = trimmedEmail
    }
    
    // Validate shipping address exists and has required fields
    if (!orderData.shippingAddress) {
      missingFields.push('shippingAddress')
    } else {
      // Check for required shipping address fields
      if (!orderData.shippingAddress.street1 || !orderData.shippingAddress.city || 
          !orderData.shippingAddress.state || !orderData.shippingAddress.postalCode) {
        missingFields.push('shippingAddress (incomplete: missing street1, city, state, or postalCode)')
      }
    }
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      console.error('Order data received:', {
        orderNumber: orderData.orderNumber,
        customerEmail: orderData.customerEmail,
        hasShippingAddress: !!orderData.shippingAddress,
        shippingAddress: orderData.shippingAddress,
      })
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: missingFields,
          received: {
            orderNumber: orderData.orderNumber || null,
            customerEmail: orderData.customerEmail || null,
            hasShippingAddress: !!orderData.shippingAddress,
          }
        }),
      }
    }

    // Create order in ShipStation
    const result = await createShipStationOrder(orderData)

    // Send success notification
    await sendEmailNotification(orderData, true)

    return {
      statusCode: 200,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify({ 
        success: true,
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        message: 'Order created in ShipStation successfully'
      }),
    }

  } catch (error) {
    console.error('Error creating ShipStation order:', {
      message: error.message,
      stack: error.stack,
      orderData: event.body ? JSON.parse(event.body) : null
    })

    // Send error notification
    try {
      const orderData = JSON.parse(event.body)
      await sendEmailNotification(orderData, false, error.message)
    } catch {
      // Ignore notification errors
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create ShipStation order',
        message: error.message
      }),
    }
  }
}

