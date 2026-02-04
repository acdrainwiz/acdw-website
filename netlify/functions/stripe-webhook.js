/**
 * Stripe Webhook Handler
 * 
 * SECURITY: Verifies webhook signature before processing
 * 
 * Handles Stripe webhook events (payment success, failure, etc.)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// SKU Mapping for ShipStation (matches create-shipstation-order.js)
const SKU_MAPPING = {
  'price_1SZe5X60dq6nGBAfwo2hsNxK': { sku: 'ACDW-MINI', name: 'AC Drain Wiz Mini' },
  'price_1SZebe60dq6nGBAfutAtD9re': { sku: 'ACDW-MINI-PRO-T1', name: 'AC Drain Wiz Mini' },
  'price_1SZeiH60dq6nGBAf2o2ypICU': { sku: 'ACDW-MINI-PRO-T2', name: 'AC Drain Wiz Mini' },
  'price_1SZekg60dq6nGBAfTQ8c630l': { sku: 'ACDW-MINI-PRO-T3', name: 'AC Drain Wiz Mini' },
  'price_1SZenc60dq6nGBAfvTu9zjFI': { sku: 'ACDW-SENSOR-PRO-T1', name: 'AC Drain Wiz Sensor' },
  'price_1SZf1t60dq6nGBAfe36Q57Bp': { sku: 'ACDW-SENSOR-PRO-T2', name: 'AC Drain Wiz Sensor' },
  'price_1SZf5i60dq6nGBAfa1p0ruWp': { sku: 'ACDW-SENSOR-PRO-T3', name: 'AC Drain Wiz Sensor' },
  'price_1SZf9f60dq6nGBAfmqSXnqbY': { sku: 'ACDW-BUNDLE-PRO-T1', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfAh60dq6nGBAfAsho4TuM': { sku: 'ACDW-BUNDLE-PRO-T2', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfD360dq6nGBAfwElA3YTM': { sku: 'ACDW-BUNDLE-PRO-T3', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfHZ60dq6nGBAfVcHud4Fa': { sku: 'ACDW-MINI-PM-T1', name: 'AC Drain Wiz Mini' },
  'price_1SZfJH60dq6nGBAfgPDGJLVs': { sku: 'ACDW-MINI-PM-T2', name: 'AC Drain Wiz Mini' },
  'price_1SZfLW60dq6nGBAf7vNkpTVd': { sku: 'ACDW-MINI-PM-T3', name: 'AC Drain Wiz Mini' },
  'price_1SZfMZ60dq6nGBAfglTItYiC': { sku: 'ACDW-SENSOR-PM-T1', name: 'AC Drain Wiz Sensor' },
  'price_1SZfNQ60dq6nGBAf3ULHuQf5': { sku: 'ACDW-SENSOR-PM-T2', name: 'AC Drain Wiz Sensor' },
  'price_1SZfUL60dq6nGBAfVIhk1Q4F': { sku: 'ACDW-SENSOR-PM-T3', name: 'AC Drain Wiz Sensor' },
  'price_1SZfVA60dq6nGBAfPahshH8Z': { sku: 'ACDW-BUNDLE-PM-T1', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfWA60dq6nGBAf2qwsKsgi': { sku: 'ACDW-BUNDLE-PM-T2', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfWm60dq6nGBAfDDdadlnM': { sku: 'ACDW-BUNDLE-PM-T3', name: 'AC Drain Wiz Mini + Sensor Bundle' },
}

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let stripeEvent

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    }
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object
      
      // Payment was successful
      console.log('Payment successful:', session.id)
      
      // Fetch full session details including line items
      // Note: shipping_details is already included and cannot be expanded
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'customer', 'payment_intent']
      })
      
      // Get customer email from session (for guest checkout, this is collected during checkout)
      const customerEmail = fullSession.customer_email || fullSession.customer_details?.email
      
      // Check if this is a guest checkout (no userId in metadata means guest)
      const isGuest = fullSession.metadata?.isGuest === 'true' || !fullSession.metadata?.userId
      
      // Get payment intent ID (could be string or expanded object)
      const paymentIntentId = typeof fullSession.payment_intent === 'string' 
        ? fullSession.payment_intent 
        : fullSession.payment_intent?.id
      
      // CRITICAL: Set receipt_email on PaymentIntent for guest checkout
      // For logged-in users, receipt_email is already set in create-checkout.js
      // For guest checkout, we need to set it here because we don't have the email until checkout completes
      if (customerEmail && paymentIntentId && isGuest) {
        try {
          // Retrieve payment intent to check current receipt_email
          const paymentIntent = typeof fullSession.payment_intent === 'object' && fullSession.payment_intent.id
            ? fullSession.payment_intent
            : await stripe.paymentIntents.retrieve(paymentIntentId)
          
          // If receipt_email is not set, set it now
          // This ensures Stripe sends the receipt email
          // NOTE: Stripe does NOT send real receipt emails in Test Mode - only in Live Mode
          if (!paymentIntent.receipt_email) {
            await stripe.paymentIntents.update(paymentIntentId, {
              receipt_email: customerEmail,
            })
            console.log('✅ Set receipt_email on PaymentIntent for guest checkout:', customerEmail.substring(0, 3) + '***@' + customerEmail.split('@')[1])
            console.log('   → Stripe will send receipt email automatically (Live Mode only)')
            console.log('   ⚠️  NOTE: Test Mode does NOT send real emails - test in Live Mode to verify')
          } else {
            console.log('✅ receipt_email already set on PaymentIntent:', paymentIntent.receipt_email.substring(0, 3) + '***@' + paymentIntent.receipt_email.split('@')[1])
            console.log('   → Stripe will send receipt email automatically (Live Mode only)')
            console.log('   ⚠️  NOTE: Test Mode does NOT send real emails - test in Live Mode to verify')
          }
        } catch (emailError) {
          console.error('❌ Failed to set receipt_email on PaymentIntent:', emailError.message)
          // Don't fail the webhook - order processing should continue
        }
      } else if (customerEmail && !isGuest) {
        console.log('✅ Logged-in user - receipt_email already set in checkout session')
        console.log('   → Stripe will send receipt email automatically')
      } else if (!customerEmail) {
        console.warn('⚠️ No customer email found for session:', session.id)
        console.warn('   Receipt email cannot be sent without email address')
      }
      
      // Create order in ShipStation
      try {
        
        // Get line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product']
        })
        
        // Extract shipping address
        const shipping = fullSession.shipping_details || fullSession.shipping
        if (!shipping || !shipping.address) {
          console.warn('No shipping address found for session:', session.id)
          break
        }
        
        // Build order items for ShipStation
        const orderItems = lineItems.data.map(item => {
          const priceId = item.price?.id
          const mapping = SKU_MAPPING[priceId]
          
          return {
            sku: mapping?.sku || `UNKNOWN-${priceId}`,
            name: mapping?.name || item.description || item.price?.product?.name || 'Product',
            quantity: item.quantity || 1,
            unitPrice: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          }
        })
        
        // Build order data for ShipStation
        const orderData = {
          orderNumber: session.id, // Use Stripe session ID as order number
          orderDate: new Date().toISOString(),
          customerName: shipping.name || fullSession.customer_details?.name || 'Customer',
          customerEmail: fullSession.customer_email || fullSession.customer_details?.email || '',
          customerPhone: fullSession.customer_details?.phone || '',
          shippingAddress: {
            name: shipping.name || 'Customer',
            street1: shipping.address.line1 || '',
            street2: shipping.address.line2 || '',
            city: shipping.address.city || '',
            state: shipping.address.state || '',
            postalCode: shipping.address.postal_code || '',
            country: shipping.address.country || 'US',
          },
          items: orderItems,
          orderTotal: session.amount_total ? session.amount_total / 100 : 0,
          // Extract tax from Stripe Tax (handles multiple tax types: sales tax, VAT, GST, etc.)
          // Stripe Tax stores taxes in total_details.breakdown.taxes array
          taxAmount: (() => {
            const taxBreakdown = session.total_details?.breakdown?.taxes || []
            if (taxBreakdown.length > 0) {
              // Sum all taxes (handles multiple tax types)
              return taxBreakdown.reduce((sum, tax) => sum + (tax.amount / 100), 0)
            }
            // Fallback to legacy amount_tax field
            return session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : 0
          })(),
          shippingAmount: session.shipping_cost?.amount_total ? session.shipping_cost.amount_total / 100 : 0,
        }
        
        // Call ShipStation function to create order
        // Use internal function call (same Netlify environment)
        const shipstationFunction = require('./create-shipstation-order')
        const shipstationEvent = {
          httpMethod: 'POST',
          body: JSON.stringify(orderData),
          headers: event.headers,
        }
        
        const shipstationResult = await shipstationFunction.handler(shipstationEvent, context)
        
        // Check if ShipStation order was created successfully
        if (shipstationResult.statusCode === 200) {
          const result = JSON.parse(shipstationResult.body)
          console.log('Order created in ShipStation:', result)
        } else {
          const error = JSON.parse(shipstationResult.body)
          console.error('Failed to create ShipStation order:', error)
          // Don't throw - we still want to acknowledge the webhook
          // The error notification email will be sent by create-shipstation-order
        }
      } catch (error) {
        console.error('Error processing ShipStation order creation:', {
          message: error.message,
          stack: error.stack,
          sessionId: session.id
        })
        // Don't throw - we still want to acknowledge the webhook
        // Log the error for manual review
      }
      
      break

    case 'payment_intent.succeeded':
      const paymentIntent = stripeEvent.data.object
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      
      // Handle Payment Intent from Payment Element (not Checkout Session)
      // This is for the new embedded Payment Element flow
      try {
        // Retrieve full Payment Intent with shipping details
        const fullPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id, {
          expand: ['customer', 'payment_method'],
        })
        
        // Get customer email
        // Email should always be in receipt_email (set from checkout form)
        // Fallback to metadata if receipt_email not set (legacy support)
        const customerEmail = fullPaymentIntent.receipt_email || 
                             fullPaymentIntent.metadata?.customerEmail ||
                             (fullPaymentIntent.customer && typeof fullPaymentIntent.customer === 'object' 
                               ? fullPaymentIntent.customer.email 
                               : null) ||
                             null
        
        // Validate email is present (should always be present now)
        if (!customerEmail || customerEmail.trim() === '') {
          console.error('No customer email found for PaymentIntent:', paymentIntent.id)
          console.error('PaymentIntent receipt_email:', fullPaymentIntent.receipt_email)
          console.error('PaymentIntent metadata:', fullPaymentIntent.metadata)
          // Don't break - continue with order creation, but log error
        }
        
        // Check if this is a guest checkout (no userId in metadata means guest)
        const isGuest = fullPaymentIntent.metadata?.isGuest === 'true' || !fullPaymentIntent.metadata?.userId
        
        // Extract shipping address
        const shipping = fullPaymentIntent.shipping
        if (!shipping || !shipping.address) {
          console.warn('No shipping address found for PaymentIntent:', paymentIntent.id)
          console.warn('PaymentIntent shipping:', shipping)
          console.warn('PaymentIntent metadata:', fullPaymentIntent.metadata)
          break
        }
        
        // Validate shipping address has required fields
        if (!shipping.address.line1 || !shipping.address.city || 
            !shipping.address.state || !shipping.address.postal_code) {
          console.error('Incomplete shipping address for PaymentIntent:', paymentIntent.id)
          console.error('Shipping address:', shipping.address)
          break
        }
        
        // Extract product information from metadata
        const product = fullPaymentIntent.metadata?.product || 'unknown'
        const quantity = parseInt(fullPaymentIntent.metadata?.quantity || '1')
        const shippingCost = parseFloat(fullPaymentIntent.metadata?.shippingCost || '0')
        
        // Get price ID from metadata or try to extract from amount
        // Note: With Payment Element, we don't have line items, so we use metadata
        const priceId = fullPaymentIntent.metadata?.priceId || null
        
        // Build order items for ShipStation
        const orderItems = []
        if (priceId && SKU_MAPPING[priceId]) {
          const mapping = SKU_MAPPING[priceId]
          orderItems.push({
            sku: mapping.sku,
            name: mapping.name,
            quantity: quantity,
            unitPrice: fullPaymentIntent.amount ? (fullPaymentIntent.amount / 100) / quantity : 0, // Approximate unit price
          })
        } else {
          // Fallback: use product name from metadata
          orderItems.push({
            sku: `UNKNOWN-${product.toUpperCase()}`,
            name: product,
            quantity: quantity,
            unitPrice: fullPaymentIntent.amount ? (fullPaymentIntent.amount / 100) / quantity : 0,
          })
        }
        
        // Extract tax information
        // Since we calculate tax manually, it's stored in metadata
        let taxAmount = 0
        if (fullPaymentIntent.metadata?.taxAmount) {
          taxAmount = parseFloat(fullPaymentIntent.metadata.taxAmount) || 0
        } else {
          // Fallback: Try to extract from amount_details (if automatic tax was used)
          const taxBreakdown = fullPaymentIntent.amount_details?.breakdown?.taxes || []
          taxAmount = taxBreakdown.length > 0
            ? taxBreakdown.reduce((sum, tax) => sum + (tax.amount / 100), 0)
            : (fullPaymentIntent.amount_details?.amount_tax ? fullPaymentIntent.amount_details.amount_tax / 100 : 0)
        }
        
        // Build order data for ShipStation
        const orderData = {
          orderNumber: paymentIntent.id, // Use Payment Intent ID as order number
          orderDate: new Date().toISOString(),
          customerName: shipping.name || 'Customer',
          customerEmail: customerEmail || '',
          customerPhone: '', // Payment Intent doesn't include phone
          shippingAddress: {
            name: shipping.name || 'Customer',
            street1: shipping.address.line1 || '',
            street2: shipping.address.line2 || '',
            city: shipping.address.city || '',
            state: shipping.address.state || '',
            postalCode: shipping.address.postal_code || '',
            country: shipping.address.country || 'US',
          },
          items: orderItems,
          orderTotal: fullPaymentIntent.amount ? fullPaymentIntent.amount / 100 : 0,
          taxAmount: taxAmount,
          shippingAmount: shippingCost,
        }
        
        // Call ShipStation function to create order
        const shipstationFunction = require('./create-shipstation-order')
        const shipstationEvent = {
          httpMethod: 'POST',
          body: JSON.stringify(orderData),
          headers: event.headers,
        }
        
        const shipstationResult = await shipstationFunction.handler(shipstationEvent, context)
        
        // Check if ShipStation order was created successfully
        if (shipstationResult.statusCode === 200) {
          const result = JSON.parse(shipstationResult.body)
          console.log('Order created in ShipStation from PaymentIntent:', result)
        } else {
          const error = JSON.parse(shipstationResult.body)
          console.error('Failed to create ShipStation order from PaymentIntent:', error)
          // Don't throw - we still want to acknowledge the webhook
        }
      } catch (error) {
        console.error('Error processing PaymentIntent order creation:', {
          message: error.message,
          stack: error.stack,
          paymentIntentId: paymentIntent.id
        })
        // Don't throw - we still want to acknowledge the webhook
      }
      
      break

    case 'payment_intent.payment_failed':
      const failedPayment = stripeEvent.data.object
      console.log('Payment failed:', failedPayment.id)
      
      // TODO: Notify user, log failure, etc.
      
      break

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`)
  }

  // Return a response to acknowledge receipt of the event
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  }
}

