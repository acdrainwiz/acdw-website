// Search metadata for CustomerSelectionPage.
// Decoupled from the page module so the page no longer exports search data.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-customer-selection',
  kind: 'site',
  title: 'Choose your experience',
  body:
    'Choose your experience: personalized paths for homeowners, HVAC professionals, property managers, and city or code officials. Customer type selector and tailored AC Drain Wiz content.',
  tags: ['homeowner', 'HVAC', 'property manager', 'code official', 'path'],
  href: '/customer-selection',
}
