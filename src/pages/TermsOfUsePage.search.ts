// Search metadata for TermsOfUsePage, decoupled from the page module.
// Consumed by the central site search registry.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-terms-of-use',
  kind: 'site',
  title: 'Site Terms of Use',
  body:
    'Terms of use for ACDrainWiz.com: user conduct, intellectual property, liability, agreement with Privacy Policy, company legal entity 50 50 Holdings Inc.',
  tags: ['terms', 'legal', 'conditions', 'use'],
  href: '/terms-of-use',
}
