import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { PaymentElementWrapper } from '../components/checkout/PaymentElement'
import { validateEmail } from '../utils/emailValidation'

interface ShippingAddress {
  name: string
  email: string
  line1: string
  line2: string
  city: string
  state: string
  zip: string
  country: string
}

interface CartItem {
  product: string
  productName: string
  quantity: number
  priceId: string
  unitPrice: number
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  
  // Cart state
  const [cart, setCart] = useState<CartItem | null>(null)
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    email: user?.email || '', // Pre-fill email for logged-in users
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })
  
  // Form state
  const [shippingCost, setShippingCost] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  // Payment Intent state
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [taxAmount, setTaxAmount] = useState<number>(0)
  const [taxDetails, setTaxDetails] = useState<Array<{ amount: number; rate: string; percentage: number }>>([])
  const [isUpdatingPaymentIntent, setIsUpdatingPaymentIntent] = useState(false)
  
  // Debounce timer for address updates
  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Show loading skeleton for 2 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  // Parse cart data from URL params
  // SECURITY NOTE: These params come from get-price-id (server-side), but validate anyway
  useEffect(() => {
    const product = searchParams.get('product')
    const productName = searchParams.get('productName')
    const quantity = searchParams.get('quantity')
    const priceId = searchParams.get('priceId')
    const unitPrice = searchParams.get('unitPrice')
    
    if (!product || !quantity || !priceId || !unitPrice) {
      // Missing required params, redirect back
      navigate('/products')
      return
    }
    
    // Validate product type
    const validProducts = ['mini', 'sensor', 'bundle']
    if (!validProducts.includes(product)) {
      console.error('Invalid product type:', product)
      navigate('/products')
      return
    }
    
    // Validate quantity
    // No business cap on quantity; upper bound is Stripe's per-line-item maximum.
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty < 1 || qty > 999999) {
      console.error('Invalid quantity:', quantity)
      navigate('/products')
      return
    }
    
    // Validate price ID format (should start with price_)
    if (!priceId.startsWith('price_')) {
      console.error('Invalid price ID format:', priceId)
      navigate('/products')
      return
    }
    
    // Validate unit price
    const price = parseFloat(unitPrice)
    if (isNaN(price) || price < 0 || price > 10000) {
      console.error('Invalid unit price:', unitPrice)
      navigate('/products')
      return
    }
    
    setCart({
      product: sanitizeInput(product),
      productName: sanitizeInput(productName || product.charAt(0).toUpperCase() + product.slice(1)),
      quantity: qty,
      priceId: sanitizeInput(priceId),
      unitPrice: price,
    })
  }, [searchParams, navigate])

  // Auto-calculate shipping when address is complete
  useEffect(() => {
    if (cart && shippingAddress.city && shippingAddress.state && shippingAddress.zip) {
      calculateShipping()
    }
    // calculateShipping is declared later in this component; the real triggers are
    // the address fields + cart listed below, so it is intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress.city, shippingAddress.state, shippingAddress.zip, cart])

  // Create Payment Intent when address is complete and validated
  const createPaymentIntent = useCallback(async () => {
    if (!cart || !shippingCost) return
    
    // Validate address is complete
    if (!shippingAddress.name.trim() || !shippingAddress.email.trim() || 
        !shippingAddress.line1.trim() || !shippingAddress.city.trim() || 
        !shippingAddress.state.trim() || !shippingAddress.zip.trim() || 
        !shippingAddress.country.trim()) {
      return
    }
    
    // Validate email format and length
    const emailError = validateEmail(shippingAddress.email)
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }))
      return
    }
    
    // Validate email length for ShipStation (50 character limit)
    if (shippingAddress.email.length > 50) {
      setErrors(prev => ({ 
        ...prev, 
        email: 'Email must be 50 characters or less (required for shipment notifications)' 
      }))
      return
    }
    
    setIsProcessing(true)
    
    try {
      const sanitizedAddress: ShippingAddress = {
        name: sanitizeInput(shippingAddress.name),
        email: shippingAddress.email.trim().toLowerCase(), // Email doesn't need sanitization, just trim and lowercase
        line1: sanitizeInput(shippingAddress.line1),
        line2: sanitizeInput(shippingAddress.line2),
        city: sanitizeInput(shippingAddress.city),
        state: sanitizeInput(shippingAddress.state),
        zip: sanitizeInput(shippingAddress.zip),
        country: shippingAddress.country,
      }
      
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: cart.priceId,
          quantity: cart.quantity,
          product: cart.product,
          userEmail: user?.email || '',
          userId: user?.id || '',
          shippingAddress: {
            ...sanitizedAddress,
            postal_code: sanitizedAddress.zip,
          },
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setClientSecret(data.clientSecret)
        setPaymentIntentId(data.paymentIntentId)
        setTaxAmount(data.taxAmount || 0)
        setTaxDetails(data.taxDetails || [])
        setShippingCost(data.shippingCost || shippingCost)
        console.log('Payment Intent created:', data.paymentIntentId)
      } else {
        const errorData = await response.json()
        console.error('Failed to create Payment Intent:', errorData)
        alert(`Error: ${errorData.error || 'Failed to initialize payment'}`)
      }
    } catch (error) {
      console.error('Error creating Payment Intent:', error)
      alert('Failed to initialize payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [cart, shippingAddress, shippingCost, user])

  // Update Payment Intent when address changes (debounced)
  const updatePaymentIntent = useCallback(async () => {
    if (!paymentIntentId || !cart || !shippingCost) return
    
    // Validate address is complete
    if (!shippingAddress.name.trim() || !shippingAddress.email.trim() || 
        !shippingAddress.line1.trim() || !shippingAddress.city.trim() || 
        !shippingAddress.state.trim() || !shippingAddress.zip.trim() || 
        !shippingAddress.country.trim()) {
      return
    }
    
    // Validate email format and length
    const emailError = validateEmail(shippingAddress.email)
    if (emailError) {
      // Don't show error on every keystroke, just log it
      console.warn('Email validation failed during update:', emailError)
      return
    }
    
    if (shippingAddress.email.length > 50) {
      // Don't show error on every keystroke, just log it
      console.warn('Email too long during update')
      return
    }
    
    setIsUpdatingPaymentIntent(true)
    
    try {
      const sanitizedAddress: ShippingAddress = {
        name: sanitizeInput(shippingAddress.name),
        email: shippingAddress.email.trim().toLowerCase(), // Email doesn't need sanitization, just trim and lowercase
        line1: sanitizeInput(shippingAddress.line1),
        line2: sanitizeInput(shippingAddress.line2),
        city: sanitizeInput(shippingAddress.city),
        state: sanitizeInput(shippingAddress.state),
        zip: sanitizeInput(shippingAddress.zip),
        country: shippingAddress.country,
      }
      
      const response = await fetch('/.netlify/functions/update-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          shippingAddress: {
            ...sanitizedAddress,
            postal_code: sanitizedAddress.zip,
          },
          product: cart.product,
          quantity: cart.quantity,
          priceId: cart.priceId,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setClientSecret(data.clientSecret) // Update client secret
        setTaxAmount(data.taxAmount || 0)
        setTaxDetails(data.taxDetails || [])
        setShippingCost(data.shippingCost || shippingCost)
        console.log('Payment Intent updated:', paymentIntentId)
      } else {
        const errorData = await response.json()
        console.error('Failed to update Payment Intent:', errorData)
        // Don't show alert on every update - just log
      }
    } catch (error) {
      console.error('Error updating Payment Intent:', error)
      // Don't show alert on every update - just log
    } finally {
      setIsUpdatingPaymentIntent(false)
    }
  }, [paymentIntentId, cart, shippingAddress, shippingCost])

  // Debounced effect: Create Payment Intent when address is complete
  useEffect(() => {
    if (!clientSecret && cart && shippingCost && 
        shippingAddress.name.trim() && shippingAddress.email.trim() && 
        shippingAddress.line1.trim() && shippingAddress.city.trim() && 
        shippingAddress.state.trim() && shippingAddress.zip.trim() && 
        shippingAddress.country.trim()) {
      // Clear any existing timer
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current)
      }
      
      // Wait 500ms after user stops typing before creating Payment Intent
      updateTimerRef.current = setTimeout(() => {
        createPaymentIntent()
      }, 500)
      
      return () => {
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current)
        }
      }
    }
  }, [cart, shippingCost, shippingAddress, clientSecret, createPaymentIntent])

  // Debounced effect: Update Payment Intent when address changes (after initial creation)
  useEffect(() => {
    if (clientSecret && paymentIntentId && cart && shippingCost &&
        shippingAddress.name.trim() && shippingAddress.email.trim() && 
        shippingAddress.line1.trim() && shippingAddress.city.trim() && 
        shippingAddress.state.trim() && shippingAddress.zip.trim() && 
        shippingAddress.country.trim()) {
      // Clear any existing timer
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current)
      }
      
      // Wait 500ms after user stops typing before updating Payment Intent
      updateTimerRef.current = setTimeout(() => {
        updatePaymentIntent()
      }, 500)
      
      return () => {
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current)
        }
      }
    }
  }, [clientSecret, paymentIntentId, cart, shippingCost, shippingAddress, updatePaymentIntent])

  // Basic client-side sanitization to prevent XSS
  // Only sanitize dangerous characters on final submission, not during typing
  const sanitizeInput = (value: string): string => {
    return value
      .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
      .trim() // Only trim on final validation
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    // Don't sanitize during typing - allow all characters including spaces
    // Sanitization will happen on form submission
    // Use functional update to ensure we're working with latest state
    setShippingAddress(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Explicit handler to ensure spacebar works - stops event propagation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow spacebar and all other keys to work normally in input fields
    // Stop propagation to prevent any global handlers from interfering
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      e.stopPropagation()
    }
  }

  const calculateShipping = async () => {
    if (!cart) return
    
    setIsCalculating(true)
    
    try {
      // Call our shipping calculator
      const response = await fetch('/.netlify/functions/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zip,
            country: shippingAddress.country,
          },
          products: {
            [cart.product]: cart.quantity,
          },
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setShippingCost(data.cost)
      } else {
        console.error('Shipping calculation failed')
        setShippingCost(null)
      }
    } catch (error) {
      console.error('Error calculating shipping:', error)
      setShippingCost(null)
    } finally {
      setIsCalculating(false)
    }
  }


  // Handle payment success
  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId)
    // Navigate to success page with Payment Intent ID
    navigate(`/checkout/success?payment_intent=${paymentIntentId}`)
  }

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    alert(`Payment failed: ${error}`)
    setIsProcessing(false)
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  const subtotal = cart.unitPrice * cart.quantity
  const total = shippingCost !== null 
    ? subtotal + shippingCost + taxAmount 
    : subtotal + taxAmount

  return (
    <div className="stripe-checkout-page">
      <div className="stripe-checkout-container">
        {/* Logo/Header */}
        <div className="stripe-checkout-header">
          <button
            onClick={() => navigate(-1)}
            className="stripe-checkout-back-button"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <div className="stripe-checkout-logo">
            <img src="/images/ac-drain-wiz-logo.png" alt="AC Drain Wiz" className="h-8" />
          </div>
        </div>

        <div className="stripe-checkout-layout">
          {/* Order Summary - Left Column (like Stripe) */}
          <div className="stripe-checkout-left">
            <div className="stripe-order-summary">
              <h2 className="stripe-order-title">Pay ACDW</h2>
              <div className="stripe-order-amount">${total.toFixed(2)}</div>
              
              <div className="stripe-order-items">
                {/* Product Line Item */}
                <div className="stripe-line-item">
                  <div className="stripe-line-item-details">
                    <div className="stripe-line-item-name">{cart.productName}</div>
                    <div className="stripe-line-item-description">
                      Compact AC drain line cleaning system for residential and commercial use
                    </div>
                    <div className="stripe-line-item-qty">Qty {cart.quantity}</div>
                  </div>
                  <div className="stripe-line-item-price">${(cart.unitPrice * cart.quantity).toFixed(2)}</div>
                </div>

                {/* Shipping Line Item */}
                {shippingCost !== null && (
                  <div className="stripe-line-item">
                    <div className="stripe-line-item-details">
                      <div className="stripe-line-item-name">Shipping & Handling</div>
                      <div className="stripe-line-item-description">
                        Standard Ground ({shippingAddress.country === 'CA' ? '7-14' : '3-7'} business days) to {shippingAddress.city ? `${shippingAddress.city}, ${shippingAddress.state}` : 'your location'}
                      </div>
                      <div className="stripe-line-item-qty">Qty 1</div>
                    </div>
                    <div className="stripe-line-item-price">${shippingCost.toFixed(2)}</div>
                  </div>
                )}

                {/* Tax Line Item */}
                {taxAmount > 0 && (
                  <div className="stripe-line-item">
                    <div className="stripe-line-item-details">
                      <div className="stripe-line-item-name">
                        {taxDetails.length > 0 
                          ? taxDetails.map(t => t.rate).join(', ')
                          : 'Tax'}
                      </div>
                      <div className="stripe-line-item-description">
                        {taxDetails.length > 0 
                          ? taxDetails.map(t => `${t.rate} (${t.percentage.toFixed(2)}%)`).join(', ')
                          : 'Sales tax'}
                      </div>
                    </div>
                    <div className="stripe-line-item-price">${taxAmount.toFixed(2)}</div>
                  </div>
                )}
                
                {(isCalculating || isUpdatingPaymentIntent) && (
                  <div className="stripe-calculating">
                    <span className="text-sm text-gray-500">
                      {isCalculating ? 'Calculating shipping...' : 'Updating totals...'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Form - Right Column (like Stripe payment form) */}
          <div className="stripe-checkout-right">
            <div className="stripe-form-container">
              {isPageLoading ? (
                /* Skeleton Loading State */
                <div className="space-y-4">
                  <div className="skeleton-field">
                    <div className="skeleton-label"></div>
                    <div className="skeleton-input"></div>
                  </div>
                  <div className="skeleton-field">
                    <div className="skeleton-label"></div>
                    <div className="skeleton-input"></div>
                  </div>
                  <div className="skeleton-field">
                    <div className="skeleton-label"></div>
                    <div className="skeleton-input"></div>
                  </div>
                  <div className="skeleton-field-row">
                    <div className="skeleton-field flex-2">
                      <div className="skeleton-label"></div>
                      <div className="skeleton-input"></div>
                    </div>
                    <div className="skeleton-field flex-1">
                      <div className="skeleton-label"></div>
                      <div className="skeleton-input"></div>
                    </div>
                    <div className="skeleton-field flex-1">
                      <div className="skeleton-label"></div>
                      <div className="skeleton-input"></div>
                    </div>
                  </div>
                  <div className="skeleton-field">
                    <div className="skeleton-label"></div>
                    <div className="skeleton-input"></div>
                  </div>
                  <div className="skeleton-button"></div>
                </div>
              ) : (
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="stripe-form-label">Full Name</label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`stripe-form-input ${errors.name ? 'stripe-form-input-error' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="stripe-form-error">{errors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="stripe-form-label">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`stripe-form-input ${errors.email ? 'stripe-form-input-error' : ''}`}
                    placeholder="your.email@example.com"
                    maxLength={50}
                  />
                  {errors.email && (
                    <p className="stripe-form-error">{errors.email}</p>
                  )}
                  {shippingAddress.email.length > 45 && shippingAddress.email.length <= 50 && !errors.email && (
                    <p className="text-sm text-yellow-600 mt-1">
                      ⚠️ Email is close to the 50 character limit
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Required for shipment notifications
                  </p>
                </div>

                {/* Street Address */}
                <div>
                  <label className="stripe-form-label">Address</label>
                  <input
                    type="text"
                    value={shippingAddress.line1}
                    onChange={(e) => handleInputChange('line1', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`stripe-form-input ${errors.line1 ? 'stripe-form-input-error' : ''}`}
                    placeholder="123 Main St"
                  />
                  {errors.line1 && (
                    <p className="stripe-form-error">{errors.line1}</p>
                  )}
                </div>

                {/* Apartment, Suite, etc. */}
                <div>
                  <label className="stripe-form-label">Apartment, suite, etc. (Optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.line2}
                    onChange={(e) => handleInputChange('line2', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="stripe-form-input"
                    placeholder="Apt 4B"
                  />
                </div>

                {/* City, State, ZIP in a row */}
                <div className="stripe-form-row">
                  <div className="stripe-form-col-2">
                    <label className="stripe-form-label">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={`stripe-form-input ${errors.city ? 'stripe-form-input-error' : ''}`}
                      placeholder="Miami"
                    />
                    {errors.city && (
                      <p className="stripe-form-error">{errors.city}</p>
                    )}
                  </div>

                  <div className="stripe-form-col-1">
                    <label className="stripe-form-label">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                      onKeyDown={handleKeyDown}
                      className={`stripe-form-input ${errors.state ? 'stripe-form-input-error' : ''}`}
                      placeholder="FL"
                      maxLength={2}
                    />
                    {errors.state && (
                      <p className="stripe-form-error">{errors.state}</p>
                    )}
                  </div>

                  <div className="stripe-form-col-1">
                    <label className="stripe-form-label">ZIP</label>
                    <input
                      type="text"
                      value={shippingAddress.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={`stripe-form-input ${errors.zip ? 'stripe-form-input-error' : ''}`}
                      placeholder="33101"
                    />
                    {errors.zip && (
                      <p className="stripe-form-error">{errors.zip}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="stripe-form-label">Country</label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`stripe-form-input ${errors.country ? 'stripe-form-input-error' : ''}`}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                  {errors.country && (
                    <p className="stripe-form-error">{errors.country}</p>
                  )}
                </div>

                {/* Payment Element - Show when Payment Intent is ready */}
                {clientSecret ? (
                  <PaymentElementWrapper
                    clientSecret={clientSecret}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                ) : (
                  <>
                    {/* Show message while waiting for Payment Intent */}
                    {isProcessing ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Initializing payment...</p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">
                          Please complete your shipping address to continue
                        </p>
                      </div>
                    )}
                  </>
                )}

                <p className="stripe-footer-text">
                  Powered by <strong>Stripe</strong>
                </p>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

