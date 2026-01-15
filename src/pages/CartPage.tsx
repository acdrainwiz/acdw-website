import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { 
  TrashIcon,
  TruckIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  TagIcon
} from '@heroicons/react/24/outline'

export function CartPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getCartTotal, 
    promoCode,
    applyPromoCode,
    removePromoCode,
    promoDiscount
  } = useCart()

  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  // Shipping will be calculated at checkout based on address
  const total = getCartTotal()

  // Get product detail page URL based on productId
  const getProductUrl = (productId: string): string => {
    const productUrls: Record<string, string> = {
      'mini': '/products/mini',
      'sensor': '/products/sensor',
      'combo': '/products/combo'
    }
    return productUrls[productId] || '/products'
  }

  const handleApplyPromo = async () => {
    setPromoError('')
    setIsApplyingPromo(true)

    const success = await applyPromoCode(promoInput)

    if (success) {
      setShowPromoInput(false)
      setPromoInput('')
    } else {
      setPromoError('Invalid promo code')
    }

    setIsApplyingPromo(false)
  }

  const handleCheckout = async () => {
    setCheckoutError('')
    setIsCheckingOut(true)

    try {
      // Currently only Mini is purchasable, get the Mini item from cart
      const miniItem = items.find(item => item.productId === 'mini')
      
      if (!miniItem) {
        setCheckoutError('No purchasable items in cart')
        setIsCheckingOut(false)
        return
      }

      // Get user role (default to homeowner for guests)
      const userRole = user?.role || 'homeowner'

      // Check if running in development mode
      const isDevelopment = window.location.hostname === 'localhost' || window.location.port === '5173'

      if (isDevelopment) {
        // Development mode - skip API call and use mock data
        console.warn('⚠️ DEVELOPMENT MODE: Using mock checkout. Use "netlify dev" for full testing.')
        const mockPriceId = 'price_DEV_mock_mini'
        const mockUnitPrice = 99.99
        
        navigate(
          `/checkout?product=mini&productName=${encodeURIComponent(miniItem.name)}&quantity=${miniItem.quantity}&priceId=${mockPriceId}&unitPrice=${mockUnitPrice}`
        )
      } else {
        // Production - get price ID from server
        const priceResponse = await fetch('/.netlify/functions/get-price-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: 'mini',
            quantity: miniItem.quantity,
            role: userRole,
          }),
        })

        if (!priceResponse.ok) {
          const errorData = await priceResponse.json()
          throw new Error(errorData.error || 'Failed to get pricing')
        }

        const priceData = await priceResponse.json()

        // Navigate to checkout with pricing data
        navigate(
          `/checkout?product=mini&productName=${encodeURIComponent(miniItem.name)}&quantity=${miniItem.quantity}&priceId=${priceData.priceId}&unitPrice=${priceData.unitPrice}`
        )
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setCheckoutError(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.')
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-page-empty">
        <div className="cart-empty-content">
          <h1 className="cart-empty-title">Your cart is empty</h1>
          <p className="cart-empty-subtitle">
            Add products to your cart to get started.
          </p>
          <Link to="/products" className="cart-empty-cta">
            Shop Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        {/* Left side - Cart Items */}
        <div className="cart-items-section">
          <h1 className="cart-page-title">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </h1>

          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <Link 
                  to={getProductUrl(item.productId)} 
                  className="cart-item-image-wrapper"
                  aria-label={`View ${item.name} details`}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="cart-item-image"
                  />
                </Link>

                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <div>
                      <Link 
                        to={getProductUrl(item.productId)}
                        className="cart-item-name-link"
                      >
                        <h3 className="cart-item-name">{item.name}</h3>
                      </Link>
                      {item.variant && (
                        <p className="cart-item-variant">{item.variant}</p>
                      )}
                    </div>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Availability & Delivery Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-info-row">
                      <TruckIcon className="cart-item-info-icon" />
                      <span>Est. delivery: 3-5 business days</span>
                    </div>
                    <div className="cart-item-info-row">
                      <MapPinIcon className="cart-item-info-icon" />
                      <span>Ships from Florida, USA</span>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="cart-item-actions">
                    <div className="cart-item-quantity">
                      <label htmlFor={`quantity-${item.id}`} className="cart-item-quantity-label">
                        Quantity:
                      </label>
                      <select
                        id={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="cart-item-quantity-select"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="cart-item-remove"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Order Summary */}
        <div className="cart-summary-section">
          <div className="cart-summary-sticky">
            <h2 className="cart-summary-title">Order summary</h2>

            <div className="cart-summary-details">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              {!promoCode ? (
                showPromoInput ? (
                  <div className="cart-promo-input-wrapper">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="cart-promo-input"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoInput || isApplyingPromo}
                      className="cart-promo-apply"
                    >
                      Apply
                    </button>
                    {promoError && (
                      <p className="cart-promo-error">{promoError}</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="cart-promo-link"
                  >
                    Add promo code
                  </button>
                )
              ) : (
                <div className="cart-promo-applied">
                  <div className="cart-promo-applied-content">
                    <TagIcon className="cart-promo-applied-icon" />
                    <span className="cart-promo-applied-code">{promoCode}</span>
                    <button
                      onClick={removePromoCode}
                      className="cart-promo-remove"
                      aria-label="Remove promo code"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="cart-promo-discount">-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="cart-summary-row">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {checkoutError && (
              <div className="cart-checkout-error">
                <p>{checkoutError}</p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="cart-checkout-button"
            >
              {isCheckingOut ? (
                <div className="cart-checkout-loading">
                  <div className="cart-checkout-spinner"></div>
                  Processing...
                </div>
              ) : (
                'Checkout'
              )}
            </button>

            {/* Trust Indicators */}
            <div className="cart-trust-indicators">
              <div className="cart-trust-item">
                <TruckIcon className="cart-trust-icon" />
                <span>Fast shipping</span>
              </div>
              <div className="cart-trust-item">
                <ArrowPathIcon className="cart-trust-icon" />
                <span>Easy returns</span>
              </div>
              <div className="cart-trust-item">
                <ShieldCheckIcon className="cart-trust-icon" />
                <span>2-year warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

