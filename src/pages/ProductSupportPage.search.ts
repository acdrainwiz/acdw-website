// Search metadata for ProductSupportPage, decoupled from the page module.
// Consumed by the central site search registry.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-product-support',
  kind: 'product-info',
  title: 'Product Support — FAQs and troubleshooting',
  body:
    'Product Support hub: common questions, troubleshooting, LED guides for Standard and WiFi Sensor, Mini FAQs, and technical help for AC Drain Wiz products.',
  tags: ['faq', 'troubleshooting', 'help', 'sensor', 'mini', 'led'],
  href: '/support/product-support',
}
