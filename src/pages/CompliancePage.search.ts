// Search metadata for CompliancePage, decoupled from the page module.
// Consumed by the central site search registry.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-compliance',
  kind: 'product-info',
  title: 'Compliance resources',
  body:
    'Documentation and compliance resources for code officials and approvals. AC Drain Wiz regulatory and installation documentation.',
  tags: ['compliance', 'code', 'official', 'documentation', 'approval'],
  href: '/compliance',
}
