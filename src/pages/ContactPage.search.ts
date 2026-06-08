// Search metadata for ContactPage, decoupled from the page module.
// Keeps the page free of search-registry exports while staying self-contained.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'contact-support',
  kind: 'product-info',
  title: 'Contact AC Drain Wiz',
  body:
    'Contact forms for general inquiries, technical support, sales, certified installer requests, and product demos. Phone and email, leadership contacts, business hours Eastern Time, privacy acknowledgment and optional SMS preferences.',
  tags: ['contact', 'help', 'support', 'phone', 'email', 'sales', 'demo'],
  searchTerms: ['installer', 'form', 'inquiry'],
  href: '/contact',
}
