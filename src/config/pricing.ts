/**
 * Pricing Configuration
 * 
 * SECURITY NOTE: These are base prices for display only.
 * Actual prices are validated server-side via Stripe Price IDs.
 * Never trust client-side price calculations.
 */

export type UserRole = 'homeowner' | 'hvac_pro' | 'property_manager'
export type ProductType = 'mini' | 'sensor' | 'bundle'
export type PricingTier = 'tier_1' | 'tier_2' | 'tier_3' | 'msrp'

export interface PricingTierRange {
  min: number
  max: number
  label: string
}

export interface ProductPricing {
  msrp: number
  hvac_pro: {
    tier_1: number
    tier_2: number
    tier_3: number
  }
  property_manager: {
    tier_1: number
    tier_2: number
    tier_3: number
  }
}

/** Format a USD amount for display (e.g. $49.99). */
export function formatUsdPrice(amount: number): string {
  return `$${amount.toFixed(2)}`
}

// Base MSRP Prices
export const MSRP_PRICES = {
  mini: 49.99,
  sensor: 69.99,
  bundle: 179.99,
} as const

// Products sold online only at list price. Volume pricing, if available, is
// handled through sales rather than automated role-based checkout tiers.
export const LIST_PRICE_ONLINE_PRODUCTS: readonly ProductType[] = ['mini'] as const

export function isListPriceOnlineProduct(product: ProductType): boolean {
  return LIST_PRICE_ONLINE_PRODUCTS.includes(product)
}

// HVAC Pro Pricing (per product, per tier)
export const HVAC_PRO_PRICING: Record<ProductType, ProductPricing['hvac_pro']> = {
  mini: {
    tier_1: 71.67,
    tier_2: 65.00,
    tier_3: 58.00,
  },
  sensor: {
    tier_1: 50.17,
    tier_2: 45.50,
    tier_3: 40.60,
  },
  bundle: {
    tier_1: 129.00,
    tier_2: 117.00,
    tier_3: 104.00,
  },
}

// Property Manager Pricing (10% lower than HVAC Pro)
export const PROPERTY_MANAGER_PRICING: Record<ProductType, ProductPricing['property_manager']> = {
  mini: {
    tier_1: 64.50,  // 10% off $71.67
    tier_2: 58.50,  // 10% off $65.00
    tier_3: 52.20,  // 10% off $58.00
  },
  sensor: {
    tier_1: 45.15,  // 10% off $50.17
    tier_2: 40.95,  // 10% off $45.50
    tier_3: 36.54,  // 10% off $40.60
  },
  bundle: {
    tier_1: 116.10, // 10% off $129.00
    tier_2: 105.30, // 10% off $117.00
    tier_3: 93.60,  // 10% off $104.00
  },
}

// Quantity Tier Ranges
export const TIER_RANGES: Record<PricingTier, PricingTierRange> = {
  msrp: { min: 1, max: 1, label: 'MSRP' },
  tier_1: { min: 1, max: 20, label: 'Tier 1 (1-20 units)' },
  tier_2: { min: 21, max: 100, label: 'Tier 2 (21-100 units)' },
  tier_3: { min: 101, max: 500, label: 'Tier 3 (101-500 units)' },
}

// Defensive upper bound on quantity for online checkout.
// There is no business cap — any amount can be purchased at list price. This is
// only Stripe's per-line-item maximum (999,999), guarding against overflow/abuse.
export const MAX_AUTOMATED_QUANTITY = 999999

/**
 * Calculate pricing tier based on quantity
 * @param quantity - Number of units
 * @returns Pricing tier or 'contact_sales' if quantity exceeds max
 */
export function calculateTier(quantity: number): PricingTier | 'contact_sales' {
  if (quantity >= 1 && quantity <= 20) return 'tier_1'
  if (quantity >= 21 && quantity <= 100) return 'tier_2'
  if (quantity >= 101 && quantity <= 500) return 'tier_3'
  return 'contact_sales'
}

/**
 * Get price for a product based on role and tier
 * NOTE: This is for display only. Actual prices come from Stripe Price IDs.
 * @param product - Product type
 * @param role - User role
 * @param tier - Pricing tier
 * @returns Price in dollars
 */
export function getDisplayPrice(
  product: ProductType,
  role: UserRole,
  tier: PricingTier
): number {
  if (role === 'homeowner' || tier === 'msrp' || isListPriceOnlineProduct(product)) {
    return MSRP_PRICES[product]
  }

  if (role === 'hvac_pro') {
    return HVAC_PRO_PRICING[product][tier]
  }

  if (role === 'property_manager') {
    return PROPERTY_MANAGER_PRICING[product][tier]
  }

  return MSRP_PRICES[product] // Fallback
}

/**
 * Get all prices for a product across all tiers (for display tables)
 */
export function getProductPricingTable(
  product: ProductType,
  role: UserRole
): Array<{ tier: PricingTier; quantity: string; price: number }> {
  if (role === 'homeowner') {
    return [
      {
        tier: 'msrp',
        quantity: '1',
        price: MSRP_PRICES[product],
      },
    ]
  }

  return [
    {
      tier: 'tier_1',
      quantity: '1-20',
      price: getDisplayPrice(product, role, 'tier_1'),
    },
    {
      tier: 'tier_2',
      quantity: '21-100',
      price: getDisplayPrice(product, role, 'tier_2'),
    },
    {
      tier: 'tier_3',
      quantity: '101-500',
      price: getDisplayPrice(product, role, 'tier_3'),
    },
  ]
}

/**
 * Validate quantity is within allowed range
 */
export function isValidQuantity(quantity: number): boolean {
  return quantity >= 1 && quantity <= MAX_AUTOMATED_QUANTITY
}

