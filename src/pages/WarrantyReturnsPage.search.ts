// Search metadata for the Warranty & Returns page.
// Decoupled from the page module so the page no longer exports it.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-warranty-returns',
  kind: 'product-info',
  title: 'Warranty & returns',
  body:
    'Warranty coverage details, return policy, how to file a claim, and manufacturer warranty information for AC Drain Wiz products.',
  tags: ['warranty', 'return', 'claim', 'policy'],
  href: '/support/warranty-returns',
}
