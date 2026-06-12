// Search metadata for ShippingPolicyPage, decoupled from the page module.
// Consumed by the central site search registry.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-shipping-policy',
  kind: 'site',
  title: 'Shipping Policy',
  body:
    'Shipping and delivery: Mini orders ship direct to US and Canada customers from acdrainwiz.com; shipping calculated at checkout. Distributor bulk shipping; tracking.',
  tags: ['shipping', 'delivery', 'distributor', 'tracking'],
  href: '/shipping-policy',
}
