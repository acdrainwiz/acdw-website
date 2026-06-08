import { useEffect, useState } from 'react'
import { MSRP_PRICES, type ProductType } from '../config/pricing'

export interface ProductPriceState {
  /** Unit price to display: the price from the server once loaded, else the constant. */
  price: number
  currency: string
  /** True once a price has loaded from the server (false while loading or on fallback). */
  isLive: boolean
  isLoading: boolean
}

/**
 * Resolves a product's display price from the get-display-price function, which
 * returns the live Stripe price (single source of truth) and, if Stripe is
 * unreachable, the last real price it served (persisted in Netlify Blobs). The
 * MSRP_PRICES constant is only used here as a last resort while loading or if the
 * function itself can't be reached (e.g. local Vite dev with no functions).
 *
 * Display only — checkout always re-validates the price server-side.
 */
export function useProductPrice(product: ProductType): ProductPriceState {
  const [state, setState] = useState<ProductPriceState>({
    price: MSRP_PRICES[product],
    currency: 'usd',
    isLive: false,
    isLoading: true,
  })

  useEffect(() => {
    let cancelled = false

    // Reset to the constant fallback whenever the product changes.
    setState({ price: MSRP_PRICES[product], currency: 'usd', isLive: false, isLoading: true })

    fetch(`/.netlify/functions/get-display-price?product=${encodeURIComponent(product)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (cancelled || typeof data?.unitPrice !== 'number') return
        setState({
          price: data.unitPrice,
          currency: typeof data.currency === 'string' ? data.currency : 'usd',
          isLive: true,
          isLoading: false,
        })
      })
      .catch(() => {
        // Keep the constant fallback already in state; just mark loading complete.
        if (!cancelled) setState((s) => ({ ...s, isLoading: false }))
      })

    return () => {
      cancelled = true
    }
  }, [product])

  return state
}
