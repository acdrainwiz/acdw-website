// Search metadata for PrivacyPolicyPage, decoupled from the page module.
// Consumed by the site search registry; keep in sync with the page content.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-privacy-policy',
  kind: 'site',
  title: 'Privacy Policy',
  body:
    'Privacy policy: how AC Drain Wiz collects, uses, and protects personal information. Data protection, your rights, cookies, contact for privacy questions, California and regional disclosures where applicable.',
  tags: ['privacy', 'data', 'cookies', 'rights'],
  href: '/privacy-policy',
}
