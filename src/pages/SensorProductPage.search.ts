// Search metadata for the Sensor product page.
// Decoupled from the page module so the page no longer exports search data.
import type { PageSearchMeta } from '../config/siteSearchTypes'
import { PRODUCT_NAMES } from '../config/acdwKnowledge'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'product-sensor',
  kind: 'product-info',
  title: PRODUCT_NAMES.sensor,
  body:
    'Overflow protection and WiFi monitoring options. Standard Sensor Switch non-WiFi and WiFi Sensor Switch. Capacitive sensing, automatic AC shutdown at 80%, monitoring portal and alerts for WiFi model. WiFi Sensor Switch includes lithium-ion backup battery (~2 years) with low-battery warning in the platform. Product overview.',
  tags: ['sensor', 'product', 'wifi', 'overflow', 'monitoring', 'battery', 'backup battery', 'power'],
  href: '/products/sensor',
}
