import { useNavigate } from 'react-router-dom'
import { formatUsdPrice } from '../../config/pricing'
import { PURCHASING_ENABLED } from '../../config/features'
import { useProductPrice } from '../../hooks/useProductPrice'

export interface MiniDiscoveryCTAProps {
  className?: string
  /** When true, appends live/fallback list price to the label (only while PURCHASING_ENABLED). */
  showPrice?: boolean
  /** Base label before price (default "Shop Mini"). */
  label?: string
  /** Navigation target (default /products/mini). */
  href?: string
  ariaLabel?: string
}

/**
 * Discovery CTA — routes to the Mini product page with optional live list price.
 * Does not trigger checkout; purchase buttons remain gated by PURCHASING_ENABLED.
 */
export function MiniDiscoveryCTA({
  className = '',
  showPrice = true,
  label = 'Shop Mini',
  href = '/products/mini',
  ariaLabel,
}: MiniDiscoveryCTAProps) {
  const navigate = useNavigate()
  const { price } = useProductPrice('mini')
  const displayLabel = showPrice && PURCHASING_ENABLED ? `${label} — ${formatUsdPrice(price)}` : label

  return (
    <button
      type="button"
      className={className}
      onClick={() => navigate(href)}
      aria-label={ariaLabel ?? displayLabel}
    >
      {displayLabel}
    </button>
  )
}

/** Inline list price for comparison tables and cards ("Coming Soon" until purchasing is live). */
export function MiniPriceText({ className }: { className?: string }) {
  const { price } = useProductPrice('mini')
  if (!PURCHASING_ENABLED) {
    return <span className={className}>Coming Soon</span>
  }
  return (
    <span className={className}>
      {formatUsdPrice(price)} <span className="font-normal not-italic">MSRP</span>
    </span>
  )
}
