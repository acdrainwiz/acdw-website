import { useEffect, useState } from 'react'
import { MSRP_PRICES, type ProductType } from '../config/pricing'
import priceSnapshot from '../config/priceSnapshot.json'

export interface ProductPriceState {
  /** Unit price to display: the live Stripe price once loaded, else the fallback. */
  price: number
  currency: string
  /** True once the live Stripe price has loaded (false while loading or on fallback). */
  isLive: boolean
  isLoading: boolean
}

/**
 * Fallback price when the live Stripe price can't be fetched: first the snapshot
 * captured from Stripe at the last deploy (src/config/priceSnapshot.json, written
 * by scripts/snapshot-prices.mjs), then the MSRP constant as a last resort.
 */
function fallbackFor(product: ProductType): { price: number; currency: string } {
  const prices = priceSnapshot.prices as Record<string, number | undefined>
  return {
    price: prices[product] ?? MSRP_PRICES[product],
    currency: priceSnapshot.currency || 'usd',
  }
}

/**
 * Resolves a product's display price from Stripe (single source of truth) via the
 * get-display-price function. While the request is in flight, or if it fails (local
 * dev with no functions, Stripe unreachable, or env not configured yet), it falls
 * back to the deploy-time snapshot. Change the price in Stripe → the UI reflects it
 * within the function's cache window, no redeploy required.
 *
 * Display only — checkout always re-validates the price server-side.
 */
export function useProductPrice(product: ProductType): ProductPriceState {
  const [state, setState] = useState<ProductPriceState>(() => {
    const fb = fallbackFor(product)
    return { price: fb.price, currency: fb.currency, isLive: false, isLoading: true }
  })

  useEffect(() => {
    let cancelled = false

    // Reset to the fallback whenever the product changes.
    const fb = fallbackFor(product)
    setState({ price: fb.price, currency: fb.currency, isLive: false, isLoading: true })

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
        // Keep the deploy-snapshot fallback already in state; just mark loading done.
        if (!cancelled) setState((s) => ({ ...s, isLoading: false }))
      })

    return () => {
      cancelled = true
    }
  }, [product])

  return state
}
