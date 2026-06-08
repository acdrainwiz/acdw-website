// Search metadata for the Mini + Sensor Combo product page.
// Decoupled from ComboProductPage.tsx so the page module no longer exports it.
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { PRODUCT_NAMES } from '../config/acdwKnowledge'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'product-combo',
  kind: 'product-info',
  title: PRODUCT_NAMES.bundle,
  body:
    'Mini and Sensor bundle. Combined drain line maintenance access and overflow protection. Product overview.',
  tags: ['bundle', 'combo', 'mini', 'sensor', 'product'],
  href: '/products/combo',
}
