/**
 * HVAC Pro Catalog Page
 * 
 * Protected page showing HVAC Pro pricing with quantity tiers.
 * Only accessible to users with 'hvac_pro' role.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { StripeCheckout } from '../components/checkout/StripeCheckout'
import { 
  getProductPricingTable, 
  calculateTier, 
  getDisplayPrice,
  MSRP_PRICES,
  HVAC_PRO_PRICING
} from '../config/pricing'
import type { ProductType, PricingTier } from '../config/pricing'

export function HVACProCatalogPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('mini')
  const [quantity, setQuantity] = useState(1)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const pricingTable = getProductPricingTable(selectedProduct, 'hvac_pro')
  const currentTier = calculateTier(quantity) as PricingTier
  const currentPrice = getDisplayPrice(selectedProduct, 'hvac_pro', currentTier)
  const totalPrice = currentPrice * quantity

  // Calculate savings for each product (MSRP vs Tier 1 contractor pricing)
  const getProductSavings = (product: ProductType) => {
    const msrp = MSRP_PRICES[product]
    if (product === 'mini') {
      return { msrp, contractorPrice: msrp, savings: 0, savingsPercent: 0 }
    }

    const contractorPrice = HVAC_PRO_PRICING[product].tier_1
    const savings = msrp - contractorPrice
    const savingsPercent = Math.round((savings / msrp) * 100)
    return { msrp, contractorPrice, savings, savingsPercent }
  }

  const products = [
    { id: 'mini' as ProductType, name: 'AC Drain Wiz Mini' },
    { id: 'sensor' as ProductType, name: 'AC Drain Wiz Sensor' },
    { id: 'bundle' as ProductType, name: 'Mini + Sensor Bundle' },
  ]

  return (
    <ProtectedRoute requiredRole="hvac_pro">
      <div className="hvac-pro-catalog-container">
        <div className="hvac-pro-catalog-wrapper">
          {/* Back to Dashboard Link */}
          <div className="hvac-pro-catalog-back-link">
            <button
              onClick={() => navigate('/dashboard')}
              className="hvac-pro-catalog-back-button"
            >
              <ArrowLeftIcon className="hvac-pro-catalog-back-icon" />
              Back to Dashboard
            </button>
          </div>

          <div className="hvac-pro-catalog-header">
            <h1 className="hvac-pro-catalog-title">HVAC Pro Catalog</h1>
            <p className="hvac-pro-catalog-subtitle">
              Logged in as: <strong>{user?.email}</strong>
            </p>
            <p className="hvac-pro-catalog-role-badge">
              Contractor Pricing Applied
            </p>
          </div>

          {/* Product Selection */}
          <div className="hvac-pro-product-selector">
            {products.map((product) => {
              const { msrp, contractorPrice, savings, savingsPercent } = getProductSavings(product.id)
              const isActive = selectedProduct === product.id
              
              return (
                <div key={product.id} className="hvac-pro-product-button-wrapper">
            <button
                    onClick={() => setSelectedProduct(product.id)}
                    className={`hvac-pro-product-button ${isActive ? 'active' : ''}`}
            >
                    <span className="hvac-pro-product-button-name">{product.name}</span>
            </button>
                  <div className="hvac-pro-product-pricing-info">
                    <div className="hvac-pro-product-msrp">
                      <span className="hvac-pro-product-msrp-label">MSRP:</span>
                      <span className="hvac-pro-product-msrp-price">${msrp.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="hvac-pro-product-savings">
                        <span className="hvac-pro-product-savings-amount">Save ${savings.toFixed(2)}</span>
                        <span className="hvac-pro-product-savings-percent">({savingsPercent}% off)</span>
                      </div>
                    )}
                    <div className="hvac-pro-product-contractor-price">
                      <span className="hvac-pro-product-contractor-price-label">From:</span>
                      <span className="hvac-pro-product-contractor-price-value">${contractorPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pricing Table */}
          <div className="hvac-pro-pricing-section">
            <h2 className="hvac-pro-pricing-title">Quantity-Based Pricing</h2>
            <div className="hvac-pro-pricing-table">
              <table className="hvac-pro-pricing-table-element">
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total (Example)</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingTable.map((row) => (
                    <tr key={row.tier}>
                      <td>{row.quantity} units</td>
                      <td>${row.price.toFixed(2)}</td>
                      <td>${(row.price * (row.tier === 'tier_1' ? 10 : row.tier === 'tier_2' ? 50 : 200)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="hvac-pro-quantity-section">
            <label className="hvac-pro-quantity-label">
              Select Quantity:
            </label>
            
            {/* Quick Select Buttons */}
            <div className="hvac-pro-quantity-quick-select">
              <span className="hvac-pro-quantity-quick-select-label">Quick Select:</span>
              <div className="hvac-pro-quantity-quick-select-buttons">
                {[10, 20, 25, 50, 100, 200, 500].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => {
                      setQuantity(qty)
                      setCheckoutError(null)
                    }}
                    className={`hvac-pro-quantity-quick-select-button ${
                      quantity === qty ? 'active' : ''
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Input */}
            <div className="hvac-pro-quantity-input-wrapper">
              <label className="hvac-pro-quantity-input-label">Or enter custom quantity:</label>
            <input
              type="number"
              min="1"
              max="500"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                setQuantity(Math.max(1, Math.min(500, val)))
                setCheckoutError(null)
              }}
              className="hvac-pro-quantity-input"
            />
            </div>
            
            {quantity > 500 && (
              <p className="hvac-pro-contact-sales">
                For quantities over 500, please contact sales.
              </p>
            )}
          </div>

          {/* Price Display */}
          <div className="hvac-pro-price-display">
            <div className="hvac-pro-price-row">
              <span>Unit Price ({currentTier.replace('_', ' ')}):</span>
              <span className="hvac-pro-price-value">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="hvac-pro-price-row">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="hvac-pro-price-row hvac-pro-price-total">
              <span>Total:</span>
              <span className="hvac-pro-price-value">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout */}
          {quantity <= 500 && (
            <div className="hvac-pro-checkout-section">
              {checkoutError && (
                <div className="hvac-pro-checkout-error">
                  {checkoutError}
                </div>
              )}
              <StripeCheckout
                product={selectedProduct}
                quantity={quantity}
                onError={setCheckoutError}
                allowGuestCheckout={false} // Contractor products require authentication
              />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

