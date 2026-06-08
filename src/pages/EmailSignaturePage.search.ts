// Search metadata for EmailSignaturePage, decoupled from the page module.
// Consumed by the site search registry; keep in sync with the page's content.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-email-signature',
  kind: 'site',
  title: 'Contractor email signature generator',
  body:
    'Generate AC Drain Wiz branded email signature for Outlook desktop and Outlook on the web. Miami HEAT partnership badge option, copy to clipboard, step-by-step setup guides.',
  tags: ['email signature', 'Outlook', 'contractor', 'branding'],
  href: '/email-signature',
}
