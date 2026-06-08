// Search metadata for UnsubscribePage, decoupled from the page module.
// Consumed by the site search registry.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-unsubscribe',
  kind: 'site',
  title: 'Unsubscribe',
  body:
    'Unsubscribe from AC Drain Wiz marketing and notification emails. Confirm email address and submit request.',
  tags: ['unsubscribe', 'email', 'opt out', 'marketing'],
  href: '/unsubscribe',
}
