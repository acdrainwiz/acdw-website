/**
 * Search metadata for the AC Drain Wiz Mini product page.
 *
 * Split out of MiniProductPage.tsx so the page module exports only its
 * component — this keeps the search registry (siteSearchRegistry.ts) from
 * pulling the full page (and its dependency tree) into the main bundle, and
 * satisfies the react-refresh/only-export-components rule.
 */
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { PRODUCT_NAMES } from '../config/acdwKnowledge'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'product-mini',
  kind: 'product-info',
  title: PRODUCT_NAMES.mini,
  body:
    'Drain line maintenance access device. Permanent service port on 3/4 inch condensate drain for flush, compressed air, and vacuum. Transparent body, one-time PVC install, horizontal installation. Product overview and specifications.',
  tags: ['mini', 'product', 'drain', 'pvc', 'maintenance'],
  href: '/products/mini',
}
