/**
 * Checkout Success Page
 * 
 * Displayed after successful Stripe checkout completion
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { CheckCircleIcon, ArrowRightIcon, DocumentTextIcon, TruckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

// Function to save shipping address to user profile
async function saveShippingAddressToProfile(
  shippingDetails: { name: string; address: ShippingAddress },
  userId: string
) {
  try {
    const response = await fetch('/.netlify/functions/save-shipping-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        shippingAddress: {
          name: shippingDetails.name,
          line1: shippingDetails.address.line1,
          line2: shippingDetails.address.line2 || '',
          city: shippingDetails.address.city,
          state: shippingDetails.address.state,
          postalCode: shippingDetails.address.postal_code,
          country: shippingDetails.address.country,
        },
      }),
    })
    
    if (!response.ok) {
      console.warn('Failed to save shipping address to profile:', await response.json())
    } else {
      console.log('Shipping address saved to profile')
    }
  } catch (error) {
    console.warn('Error saving shipping address to profile:', error)
    // Don't show error to user - this is a background operation
  }
}

interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface OrderDetails {
  sessionId?: string
  paymentIntentId?: string
  customerEmail?: string | null
  amountTotal: number
  currency: string
  paymentStatus: string
  subtotal?: number | null
  productAmount?: number | null
  tax: number | null
  shipping: number | null
  shippingDetails: {
    name: string
    address: ShippingAddress
  } | null
  lineItems?: Array<{
    description: string
    quantity: number
    amount: number
  }>
}

export function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)
  
  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    const paymentIntentParam = searchParams.get('payment_intent')
    
    if (sessionIdParam) {
      // Handle Checkout Session (legacy flow)
      setSessionId(sessionIdParam)
      
      // Fetch order details from Stripe
      fetch(`/.netlify/functions/get-checkout-session?session_id=${sessionIdParam}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          if (data.error) {
            console.error('Error fetching order details:', data.error)
            console.error('Full error response:', data)
          } else {
            console.log('Order details fetched:', data)
            setOrderDetails(data)
            
            // Store customer email for account creation offer
            if (data.customerEmail) {
              setCustomerEmail(data.customerEmail)
            }
            
            // Save shipping address to user profile if available
            if (data.shippingDetails && user?.id) {
              saveShippingAddressToProfile(data.shippingDetails, user.id)
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching order details:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (paymentIntentParam) {
      // Handle Payment Intent (new Payment Element flow)
      setPaymentIntentId(paymentIntentParam)
      
      // Fetch order details from Stripe
      fetch(`/.netlify/functions/get-payment-intent?payment_intent=${paymentIntentParam}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          if (data.error) {
            console.error('Error fetching Payment Intent details:', data.error)
            console.error('Full error response:', data)
          } else {
            console.log('Payment Intent details fetched:', data)
            
            // Transform Payment Intent data to match OrderDetails format
            const transformedData: OrderDetails = {
              paymentIntentId: data.paymentIntentId,
              customerEmail: data.customerEmail,
              amountTotal: data.amountTotal,
              currency: data.currency,
              paymentStatus: data.paymentStatus,
              productAmount: data.productAmount,
              tax: data.tax,
              shipping: data.shipping,
              shippingDetails: data.shippingDetails,
            }
            
            setOrderDetails(transformedData)
            
            // Store customer email for account creation offer
            if (data.customerEmail) {
              setCustomerEmail(data.customerEmail)
            }
            
            // Save shipping address to user profile if available
            if (data.shippingDetails && user?.id) {
              saveShippingAddressToProfile(data.shippingDetails, user.id)
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching Payment Intent details:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [searchParams, user])

  if (isLoading) {
    return (
      <div className="checkout-success-page">
        <div className="checkout-success-container">
          <div className="checkout-success-content">
            <div className="checkout-success-icon-wrapper">
              <CheckCircleIcon className="checkout-success-icon" />
            </div>
            <h1 className="checkout-success-title">Loading order details...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-success-page">
      <div className="checkout-success-container">
        <div className="checkout-success-content">
          {/* Success Icon */}
          <div className="checkout-success-icon-wrapper">
            <CheckCircleIcon className="checkout-success-icon" />
          </div>

          {/* Success Message */}
          <h1 className="checkout-success-title">Payment Successful!</h1>
          <p className="checkout-success-message">
            Thank you for your purchase. Your order has been confirmed and you will receive an email confirmation shortly.
          </p>

          {/* Order Details */}
          {(sessionId || paymentIntentId) && (
            <div className="checkout-success-order-info">
              <p className="checkout-success-order-label">Order ID:</p>
              <p className="checkout-success-order-id">{sessionId || paymentIntentId}</p>
              {orderDetails && (
                <div className="checkout-success-order-breakdown" style={{ marginTop: '1rem' }}>
                  {(orderDetails.subtotal !== null || orderDetails.productAmount !== null) && (
                    <>
                      <div className="checkout-success-order-breakdown-row">
                        <span className="checkout-success-order-breakdown-label">Subtotal:</span>
                        <span className="checkout-success-order-breakdown-value">
                          ${(orderDetails.subtotal || orderDetails.productAmount || 0).toFixed(2)}
                        </span>
                      </div>
                      {orderDetails.shipping !== null && orderDetails.shipping > 0 && (
                        <div className="checkout-success-order-breakdown-row">
                          <span className="checkout-success-order-breakdown-label">Shipping:</span>
                          <span className="checkout-success-order-breakdown-value">
                            ${orderDetails.shipping.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {orderDetails.tax !== null && orderDetails.tax > 0 && (
                        <div className="checkout-success-order-breakdown-row">
                          <span className="checkout-success-order-breakdown-label">Tax:</span>
                          <span className="checkout-success-order-breakdown-value">
                            ${orderDetails.tax.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="checkout-success-order-breakdown-row checkout-success-order-breakdown-total">
                        <span className="checkout-success-order-breakdown-label">Total:</span>
                        <span className="checkout-success-order-breakdown-value checkout-success-order-amount">
                          ${orderDetails.amountTotal.toFixed(2)} {orderDetails.currency.toUpperCase()}
                        </span>
                      </div>
                    </>
                  )}
                  {(orderDetails.subtotal === null && orderDetails.productAmount === null) && (
                    <p className="checkout-success-order-amount" style={{ marginTop: '0.5rem' }}>
                      ${orderDetails.amountTotal.toFixed(2)} {orderDetails.currency.toUpperCase()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Shipping Address */}
          {orderDetails?.shippingDetails && (
            <div className="checkout-success-shipping-info">
              <h3 className="checkout-success-shipping-title">
                <TruckIcon className="checkout-success-shipping-icon" />
                Shipping Address
              </h3>
              <div className="checkout-success-shipping-address">
                <p className="checkout-success-shipping-name">{orderDetails.shippingDetails.name}</p>
                <p>{orderDetails.shippingDetails.address.line1}</p>
                {orderDetails.shippingDetails.address.line2 && (
                  <p>{orderDetails.shippingDetails.address.line2}</p>
                )}
                <p>
                  {orderDetails.shippingDetails.address.city}, {orderDetails.shippingDetails.address.state}{' '}
                  {orderDetails.shippingDetails.address.postal_code}
                </p>
                <p>{orderDetails.shippingDetails.address.country}</p>
              </div>
            </div>
          )}

          {/* Account Creation Offer for Guests Only */}
          {/* Hide this section if user is already logged in */}
          {!isAuthenticated && customerEmail && (
            <div className="checkout-success-account-offer">
              <h3 className="checkout-success-account-offer-title">Create an Account</h3>
              <p className="checkout-success-account-offer-message">
                Create a free account to track your order, access support resources, and manage your purchases.
              </p>
              <button
                onClick={() => {
                  // Navigate to signup with pre-filled email
                  navigate(`/auth/signup?email=${encodeURIComponent(customerEmail)}&role=homeowner&redirect=/dashboard`)
                }}
                className="checkout-success-account-offer-button"
              >
                Create Account
                <ArrowRightIcon className="checkout-success-button-icon" />
              </button>
              <p className="checkout-success-account-offer-note">
                Your email ({customerEmail}) will be pre-filled. Takes less than a minute!
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="checkout-success-next-steps">
            <h2 className="checkout-success-next-steps-title">What's Next?</h2>
            <ul className="checkout-success-next-steps-list">
              <li>
                <DocumentTextIcon className="checkout-success-step-icon" />
                <span>Check your email for order confirmation and shipping details</span>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <DocumentTextIcon className="checkout-success-step-icon" />
                    <span>View your order history in your dashboard</span>
                  </li>
                  <li>
                    <DocumentTextIcon className="checkout-success-step-icon" />
                    <span>Access product documentation and support resources</span>
                  </li>
                </>
              ) : (
                <li>
                  <DocumentTextIcon className="checkout-success-step-icon" />
                  <span>Create an account above to track orders and access support</span>
                </li>
              )}
            </ul>
          </div>

          <div className="checkout-success-resources">
            <h3 className="checkout-success-resources-title">Installation resources</h3>
            <p className="checkout-success-resources-text">
              Have a dual drain-line unit? See how to pair your Mini with a Sensor on the second port.
            </p>
            <Link to="/support/installation-scenarios" className="checkout-success-resources-link">
              View recommended installation scenarios
              <ArrowRightIcon className="checkout-success-button-icon" aria-hidden />
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="checkout-success-actions">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="checkout-success-button checkout-success-button-primary"
              >
                Go to Dashboard
                <ArrowRightIcon className="checkout-success-button-icon" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/products')}
                className="checkout-success-button checkout-success-button-primary"
              >
                Continue Shopping
                <ArrowRightIcon className="checkout-success-button-icon" />
              </button>
            )}
            <button
              onClick={() => navigate('/products')}
              className="checkout-success-button checkout-success-button-secondary"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

