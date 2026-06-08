// Search metadata for the Products page, split out from the page module
// so the page no longer exports anything but its component.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-products',
  kind: 'site',
  title: 'Products — AC Drain Wiz lineup',
  body:
    'Products overview: AC Drain Wiz Mini compact maintenance manifold with bayonet port and bi-directional valve; flush, compressed air, vacuum on 3/4 inch PVC condensate lines. AC Drain Wiz Standard Sensor Switch (Non-WiFi) and WiFi Sensor Switch—capacitive overflow protection; WiFi adds remote monitoring and alerts on 2.4 GHz Wi-Fi. Mini plus Sensor bundle. Comparison: Standard vs WiFi Sensor vs Mini plus Sensor—Wi-Fi, alerts, install time, IMC examples. Specifications, contractor-focused catalog, FAQs.',
  tags: ['products', 'mini', 'sensor', 'combo', 'catalog', 'specs', 'IMC'],
  searchTerms: ['solutions', 'lineup', 'ACDW'],
  href: '/products',
}
