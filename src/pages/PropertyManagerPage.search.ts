// Search metadata for PropertyManagerPage, decoupled from the page module.
// Keeps the page component free of search-registry concerns.
import type { PageSearchMeta } from '../config/siteSearchTypes';

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-property-managers',
  kind: 'site',
  title: 'Property managers — portfolio AC drain protection',
  body:
    'Property management: protect multi-unit portfolios from costly AC drain line failures. Bulk installation, 24/7 remote monitoring, WiFi sensor alerts, reduce emergency maintenance calls, predictive maintenance, water damage prevention, bulk pricing, professional-grade solutions.',
  tags: ['property manager', 'multi-unit', 'monitoring', 'alerts', 'bulk', 'portfolio'],
  href: '/property-managers',
};
