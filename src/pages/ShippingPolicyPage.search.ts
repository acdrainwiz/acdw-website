// Search metadata for ShippingPolicyPage, decoupled from the page module.
// Consumed by the central site search registry.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-shipping-policy',
  kind: 'site',
  title: 'Shipping Policy',
  body:
    'Shipping and delivery: distributor sales model, contact sales for methods and timeframes, tracking, no direct end-customer online shipping from this site.',
  tags: ['shipping', 'delivery', 'distributor', 'tracking'],
  href: '/shipping-policy',
}
