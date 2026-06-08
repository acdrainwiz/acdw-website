// Search metadata for the Email Preferences page.
// Decoupled from the page module so the page no longer exports search data.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-email-preferences',
  kind: 'site',
  title: 'Email preferences',
  body:
    'Manage email preferences: product updates, promotions, newsletter, order updates, support emails. Opt in or out of AC Drain Wiz communications.',
  tags: ['email', 'preferences', 'subscribe', 'unsubscribe', 'marketing'],
  href: '/email-preferences',
}
