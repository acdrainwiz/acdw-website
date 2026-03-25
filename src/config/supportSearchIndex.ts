import { FAQ, MONITORING } from './acdwKnowledge'
import { SITE_PAGE_SEARCH_ENTRIES } from './siteSearchRegistry'
import type { PageSearchMeta } from './siteSearchTypes'

/** Result category shown on Support Hub search hits. */
export type SupportSearchKind = 'faq' | 'how-to' | 'product-info' | 'site'

export const SUPPORT_SEARCH_KIND_LABEL: Record<SupportSearchKind, string> = {
  faq: 'FAQ',
  'how-to': 'How-to',
  'product-info': 'Product information',
  site: 'Site page',
}

export type SupportSearchEntry =
  | {
      id: string
      kind: 'faq'
      title: string
      body: string
      tags?: string[]
      /** Extra match tokens (not shown in UI); see `installationSearchTerms.ts`. */
      searchTerms?: string[]
      faqId: string
    }
  | {
      id: string
      kind: 'how-to' | 'product-info' | 'site'
      title: string
      body: string
      tags?: string[]
      searchTerms?: string[]
      href: string
    }

function faqEntries(): SupportSearchEntry[] {
  return FAQ.map((f) => ({
    id: `faq-${f.id}`,
    kind: 'faq' as const,
    title: f.question,
    body: `${f.question} ${f.answer} ${f.tags.join(' ')}`,
    tags: [...f.tags],
    faqId: f.id,
  }))
}

/** Entries not tied to a single page module (e.g. external monitoring URL). */
const CONFIG_SEARCH_ENTRIES: SupportSearchEntry[] = [
  {
    id: 'monitoring-portal',
    kind: 'product-info',
    title: 'Sensor monitoring portal (login)',
    body: `${MONITORING.applicationName}. Log in to monitor WiFi sensors, contractor accounts, customer properties, alerts, and dashboard at monitor.acdrainwiz.com.`,
    tags: ['monitoring', 'portal', 'login', 'wifi', 'dashboard', 'contractor'],
    href: MONITORING.portalUrl,
  },
]

function sitePageEntries(): SupportSearchEntry[] {
  return SITE_PAGE_SEARCH_ENTRIES.map((e: PageSearchMeta) => ({
    id: e.id,
    kind: e.kind,
    title: e.title,
    body: e.body,
    tags: e.tags,
    searchTerms: e.searchTerms,
    href: e.href,
  }))
}

export const SUPPORT_SEARCH_INDEX: SupportSearchEntry[] = [
  ...faqEntries(),
  ...CONFIG_SEARCH_ENTRIES,
  ...sitePageEntries(),
]
