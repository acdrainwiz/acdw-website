// Search metadata for WarrantyPolicyPage.
// Decoupled from the page module so the page no longer exports search data.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-warranty-policy',
  kind: 'site',
  title: 'Warranty Policy',
  body:
    'Warranty policy: product quality and reliability, warranty period, terms and conditions, claim process for AC Drain Wiz products.',
  tags: ['warranty', 'claim', 'terms', 'coverage'],
  href: '/warranty-policy',
}
