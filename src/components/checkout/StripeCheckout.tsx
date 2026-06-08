/**
 * Stripe Checkout Component
 * 
 * SECURITY: Never calculates prices client-side
 * Always gets Price ID from server
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { ProductType } from '../../config/pricing'

interface StripeCheckoutProps {
  product: ProductType
  quantity: number
  onError?: (error: string) => void
  buttonText?: string
  className?: string
  allowGuestCheckout?: boolean // If false, requires authentication
}

export function StripeCheckout({ product, quantity, onError, buttonText, className, allowGuestCheckout = true }: StripeCheckoutProps) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    // For products that don't allow guest checkout (Sensor, Bundle), require authentication
    if (!allowGuestCheckout && !isAuthenticated) {
      onError?.('Please sign in to purchase this product. Contractor pricing requires authentication.')
      return
    }

    // Allow guest checkout - use 'homeowner' role for guests
    // Note: Sensor and Bundle should never reach here as guests (they require auth)
    const userRole = user?.role || 'homeowner'

    if (quantity < 1 || quantity > 999999) {
      onError?.('Invalid quantity')
      return
    }

    setIsLoading(true)

    try {
      // DEVELOPMENT MODE: Check if running on localhost
      const isDevelopment = window.location.hostname === 'localhost' || window.location.port === '5173'
      
      let priceId: string
      let unitPrice: number
      let requiresContact = false

      if (isDevelopment) {
        // Development fallback - use mock data
        console.warn('⚠️ DEVELOPMENT MODE: Using mock pricing. Use "netlify dev" for full testing.')
        
        // Mock Price IDs and pricing (these won't work with real Stripe, but allow UI testing)
        priceId = 'price_DEV_mock_' + product
        unitPrice = product === 'mini' ? 99.99 : product === 'sensor' ? 74.99 : 174.99
        
        console.log('Mock checkout data:', { product, quantity, priceId, unitPrice })
      } else {
        // PRODUCTION: Get Price ID from server (validates role and calculates tier)
        const priceResponse = await fetch('/.netlify/functions/get-price-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product,
            quantity,
            role: userRole,
          }),
        })

        if (!priceResponse.ok) {
          const errorData = await priceResponse.json()
          console.error('Price ID lookup failed:', {
            status: priceResponse.status,
            error: errorData,
            request: { product, quantity, role: userRole }
          })
          
          // Handle authentication required error (403)
          if (priceResponse.status === 403 && errorData.requiresAuth) {
            throw new Error('Authentication required. Please sign in to purchase this product.')
          }
          
          throw new Error(errorData.error || `Failed to get price (${priceResponse.status})`)
        }

        const priceData = await priceResponse.json()
        priceId = priceData.priceId
        unitPrice = priceData.unitPrice
        requiresContact = priceData.requiresContact || false

        if (!priceId) {
          console.error('No Price ID returned:', priceData)
          throw new Error('No price ID received from server')
        }
      }

      if (requiresContact) {
        onError?.('For quantities over 500, please contact sales')
        setIsLoading(false)
        return
      }

      // Step 2: Navigate to checkout page with cart data
      // CheckoutPage will collect address, calculate shipping, then create Stripe session
      const productName = product.charAt(0).toUpperCase() + product.slice(1)
      const checkoutParams = new URLSearchParams({
        product,
        productName,
        quantity: quantity.toString(),
        priceId,
        unitPrice: unitPrice.toString(),
      })

      navigate(`/checkout?${checkoutParams.toString()}`)
    } catch (error) {
      console.error('Checkout error:', error)
      onError?.(error instanceof Error ? error.message : 'Checkout failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className || "hvac-pro-checkout-button"}
    >
      {isLoading ? 'Processing...' : (buttonText || 'Proceed to Checkout')}
    </button>
  )
}

