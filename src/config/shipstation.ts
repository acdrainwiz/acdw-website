/**
 * ShipStation Configuration
 * 
 * Maps Stripe Price IDs to ShipStation SKUs
 * 
 * SKU Format: ACDW-[PRODUCT]-[TIER]-[ROLE]
 * 
 * Examples:
 * - ACDW-MINI (Homeowner Mini)
 * - ACDW-MINI-PRO-T1 (HVAC Pro Mini Tier 1)
 * - ACDW-SENSOR-PRO-T2 (HVAC Pro Sensor Tier 2)
 * - ACDW-BUNDLE-PM-T3 (Property Manager Bundle Tier 3)
 */

export interface SKUMapping {
  priceId: string
  sku: string
  productName: string
  productType: 'mini' | 'sensor' | 'bundle'
  role: 'homeowner' | 'hvac_pro' | 'property_manager'
  tier?: 'tier_1' | 'tier_2' | 'tier_3'
}

/**
 * SKU Mapping Configuration
 * 
 * TODO: Update with actual Stripe Price IDs once you have them
 * This will be populated from environment variables or a config file
 */
export const SHIPSTATION_SKU_MAPPING: SKUMapping[] = [
  // Homeowner - Mini only
  {
    priceId: 'price_1SZe5X60dq6nGBAfwo2hsNxK',
    sku: 'ACDW-MINI',
    productName: 'AC Drain Wiz Mini',
    productType: 'mini',
    role: 'homeowner',
  },
  
  // HVAC Pro - Mini (3 tiers)
  {
    priceId: 'price_1SZebe60dq6nGBAfutAtD9re',
    sku: 'ACDW-MINI-PRO-T1',
    productName: 'AC Drain Wiz Mini',
    productType: 'mini',
    role: 'hvac_pro',
    tier: 'tier_1',
  },
  {
    priceId: 'price_1SZeiH60dq6nGBAf2o2ypICU',
    sku: 'ACDW-MINI-PRO-T2',
    productName: 'AC Drain Wiz Mini',
    productType: 'mini',
    role: 'hvac_pro',
    tier: 'tier_2',
  },
  {
    priceId: 'price_1SZekg60dq6nGBAfTQ8c630l',
    sku: 'ACDW-MINI-PRO-T3',
    productName: 'AC Drain Wiz Mini',
    productType: 'mini',
    role: 'hvac_pro',
    tier: 'tier_3',
  },
  
  // HVAC Pro - Sensor (3 tiers)
  {
    priceId: 'price_1SZenc60dq6nGBAfvTu9zjFI',
    sku: 'ACDW-SENSOR-PRO-T1',
    productName: 'AC Drain Wiz Sensor',
    productType: 'sensor',
    role: 'hvac_pro',
    tier: 'tier_1',
  },
  {
    priceId: 'price_1SZf1t60dq6nGBAfe36Q57Bp',
    sku: 'ACDW-SENSOR-PRO-T2',
    productName: 'AC Drain Wiz Sensor',
    productType: 'sensor',
    role: 'hvac_pro',
    tier: 'tier_2',
  },
  {
    priceId: 'price_1SZf5i60dq6nGBAfa1p0ruWp',
    sku: 'ACDW-SENSOR-PRO-T3',
    productName: 'AC Drain Wiz Sensor',
    productType: 'sensor',
    role: 'hvac_pro',
    tier: 'tier_3',
  },
  
  // HVAC Pro - Bundle (3 tiers)
  {
    priceId: 'price_1SZf9f60dq6nGBAfmqSXnqbY',
    sku: 'ACDW-BUNDLE-PRO-T1',
    productName: 'AC Drain Wiz Mini + Sensor Bundle',
    productType: 'bundle',
    role: 'hvac_pro',
    tier: 'tier_1',
  },
  {
    priceId: 'price_1SZfAh60dq6nGBAfAsho4TuM',
    sku: 'ACDW-BUNDLE-PRO-T2',
    productName: 'AC Drain Wiz Mini + Sensor Bundle',
    productType: 'bundle',
    role: 'hvac_pro',
    tier: 'tier_2',
  },
  {
    priceId: 'price_1SZfD360dq6nGBAfwElA3YTM',
    sku: 'ACDW-BUNDLE-PRO-T3',
    productName: 'AC Drain Wiz Mini + Sensor Bundle',
    productType: 'bundle',
    role: 'hvac_pro',
    tier: 'tier_3',
  },
  
  // Property Manager - Mini (3 tiers)
  {
    priceId: 'price_1SZfHZ60dq6nGBAfVcHud4Fa',
    sku: 'ACDW-MINI-PM-T1',
    productName: 'AC Drain Wiz Mini',
    productType: 'mini',
    role: 'property_manager',
    tier: 'tier_1',
  },
  {
    priceId: 'price_1SZfJH60dq6nGBAfgPDGJLVs',
    sku: 'ACDW-MINI-PM-T2',
    productName: 'AC Drain Wiz Mini',
    productType: 'mini',
    role: 'property_manager',
    tier: 'tier_2',
  },
  {
    priceId: 'price_1SZfLW60dq6nGBAf7vNkpTVd',
    sku: 'ACDW-MINI-PM-T3',
    productName: 'AC Drain Wiz Mini',
    productType: 'mini',
    role: 'property_manager',
    tier: 'tier_3',
  },
  
  // Property Manager - Sensor (3 tiers)
  {
    priceId: 'price_1SZfMZ60dq6nGBAfglTItYiC',
    sku: 'ACDW-SENSOR-PM-T1',
    productName: 'AC Drain Wiz Sensor',
    productType: 'sensor',
    role: 'property_manager',
    tier: 'tier_1',
  },
  {
    priceId: 'price_1SZfNQ60dq6nGBAf3ULHuQf5',
    sku: 'ACDW-SENSOR-PM-T2',
    productName: 'AC Drain Wiz Sensor',
    productType: 'sensor',
    role: 'property_manager',
    tier: 'tier_2',
  },
  {
    priceId: 'price_1SZfUL60dq6nGBAfVIhk1Q4F',
    sku: 'ACDW-SENSOR-PM-T3',
    productName: 'AC Drain Wiz Sensor',
    productType: 'sensor',
    role: 'property_manager',
    tier: 'tier_3',
  },
  
  // Property Manager - Bundle (3 tiers)
  {
    priceId: 'price_1SZfVA60dq6nGBAfPahshH8Z',
    sku: 'ACDW-BUNDLE-PM-T1',
    productName: 'AC Drain Wiz Mini + Sensor Bundle',
    productType: 'bundle',
    role: 'property_manager',
    tier: 'tier_1',
  },
  {
    priceId: 'price_1SZfWA60dq6nGBAf2qwsKsgi',
    sku: 'ACDW-BUNDLE-PM-T2',
    productName: 'AC Drain Wiz Mini + Sensor Bundle',
    productType: 'bundle',
    role: 'property_manager',
    tier: 'tier_2',
  },
  {
    priceId: 'price_1SZfWm60dq6nGBAfDDdadlnM',
    sku: 'ACDW-BUNDLE-PM-T3',
    productName: 'AC Drain Wiz Mini + Sensor Bundle',
    productType: 'bundle',
    role: 'property_manager',
    tier: 'tier_3',
  },
]

/**
 * Get ShipStation SKU for a Stripe Price ID
 */
export function getSKUForPriceId(priceId: string): string | null {
  const mapping = SHIPSTATION_SKU_MAPPING.find(m => m.priceId === priceId)
  return mapping ? mapping.sku : null
}

/**
 * Get product name for a Stripe Price ID
 */
export function getProductNameForPriceId(priceId: string): string | null {
  const mapping = SHIPSTATION_SKU_MAPPING.find(m => m.priceId === priceId)
  return mapping ? mapping.productName : null
}

