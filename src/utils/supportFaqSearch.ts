import { FAQ, type ProductSupportTab, type SensorVariantFilter } from '../config/acdwKnowledge'
import {
  SUPPORT_SEARCH_SYNONYM_GROUPS,
  SUPPORT_SEARCH_TYPO_MAP,
} from '../config/supportSearchSynonyms'
import {
  type SupportSearchEntry,
  SUPPORT_SEARCH_INDEX,
} from '../config/supportSearchIndex'

export type SupportSearchResult = {
  entry: SupportSearchEntry
  score: number
  snippet: string
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

function tokenize(q: string): string[] {
  return normalize(q)
    .split(/\s+/)
    .filter((t) => t.length > 0)
}

/** Tokens used for scoring: query tokens + typo fixes + synonym group siblings. */
function expandQueryTokens(q: string): string[] {
  const base = tokenize(q)
  const out = new Set<string>()
  for (const t of base) {
    const low = t.toLowerCase()
    out.add(low)
    const typo = SUPPORT_SEARCH_TYPO_MAP[low]
    if (typo) out.add(typo.toLowerCase())
    for (const group of SUPPORT_SEARCH_SYNONYM_GROUPS) {
      const gl = group.map((g) => g.toLowerCase())
      if (gl.includes(low)) {
        gl.forEach((x) => out.add(x))
      }
    }
  }
  return [...out]
}

function applyTypoCorrectionToQuery(q: string): string {
  const parts = tokenize(q).map((t) => SUPPORT_SEARCH_TYPO_MAP[t.toLowerCase()] ?? t)
  return parts.join(' ')
}

/**
 * Terms for UI highlighting (original + typo + synonym expansions), longest first.
 */
export function getHighlightTermsForQuery(query: string): string[] {
  const combined = new Set<string>()
  for (const t of tokenize(query)) {
    const low = t.toLowerCase()
    combined.add(low)
    const typo = SUPPORT_SEARCH_TYPO_MAP[low]
    if (typo) combined.add(typo.toLowerCase())
    for (const group of SUPPORT_SEARCH_SYNONYM_GROUPS) {
      const gl = group.map((g) => g.toLowerCase())
      if (gl.includes(low)) {
        gl.forEach((x) => combined.add(x))
      }
    }
  }
  return [...combined].filter((t) => t.length >= 2).sort((a, b) => b.length - a.length)
}

function runSearch(query: string): SupportSearchResult[] {
  const full = normalize(query)
  if (full.length < 2) return []
  const tokens = expandQueryTokens(query)

  const results: SupportSearchResult[] = []

  for (const entry of SUPPORT_SEARCH_INDEX) {
    const titleLower = entry.title.toLowerCase()
    const bodyLower = entry.body.toLowerCase()
    const tagsLower = (entry.tags ?? []).join(' ').toLowerCase()
    const termsLower = (entry.searchTerms ?? []).join(' ').toLowerCase()

    let score = 0
    if (full.length >= 2) {
      if (titleLower.includes(full)) score += 100
      else if (bodyLower.includes(full)) score += 45
      else if (termsLower.includes(full)) score += 40
    }

    for (const t of tokens) {
      if (titleLower.includes(t)) score += 18
      if (bodyLower.includes(t)) score += 6
      if (tagsLower.includes(t)) score += 12
      if (termsLower.includes(t)) score += 10
    }

    if (score === 0) continue

    results.push({
      entry,
      score,
      snippet: snippetForEntry(entry, tokens, full),
    })
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 25)
}

function snippetForEntry(
  entry: SupportSearchEntry,
  tokens: string[],
  fullQuery: string,
): string {
  const bodyLower = entry.body.toLowerCase()
  const matchedInBody =
    tokens.some((t) => bodyLower.includes(t)) ||
    (fullQuery.length >= 2 && bodyLower.includes(fullQuery))
  if (matchedInBody) {
    return makeSnippet(entry.body, tokens, fullQuery)
  }
  const terms = (entry.searchTerms ?? []).join(' ').toLowerCase()
  const matchedInTerms =
    tokens.some((t) => terms.includes(t)) ||
    (fullQuery.length >= 2 && terms.includes(fullQuery))
  if (matchedInTerms) {
    const ell = entry.body.length > 200 ? `${entry.body.slice(0, 197)}…` : entry.body
    return `${entry.title}. ${ell}`
  }
  return makeSnippet(entry.body, tokens, fullQuery)
}

function makeSnippet(answer: string, tokens: string[], fullQuery: string): string {
  const lower = answer.toLowerCase()
  let idx = -1
  if (fullQuery.length >= 2) {
    idx = lower.indexOf(fullQuery)
  }
  if (idx < 0) {
    for (const t of tokens) {
      const i = lower.indexOf(t)
      if (i >= 0) {
        idx = i
        break
      }
    }
  }
  if (idx < 0) {
    return answer.length > 200 ? `${answer.slice(0, 197)}…` : answer
  }
  const start = Math.max(0, idx - 48)
  const end = Math.min(answer.length, idx + 170)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < answer.length ? '…' : ''
  return `${prefix}${answer.slice(start, end).trim()}${suffix}`
}

/**
 * Client-side search over FAQs, curated guides, product pages, and site pages (`SUPPORT_SEARCH_INDEX`).
 * Applies synonym expansion and typo correction; if still empty, retries with per-token typo corrections.
 */
export function searchSupport(query: string): SupportSearchResult[] {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  let results = runSearch(trimmed)
  if (results.length === 0 && trimmed.length >= 3) {
    const corrected = applyTypoCorrectionToQuery(trimmed)
    if (normalize(corrected) !== normalize(trimmed)) {
      results = runSearch(corrected)
    }
  }
  return results
}

export function buildSupportSearchHref(entry: SupportSearchEntry): string {
  if ('faqId' in entry) return buildProductSupportFaqHref(entry.faqId)
  return entry.href
}

export function getFaqDeepLinkState(
  faqId: string,
): { tab: ProductSupportTab; variant: SensorVariantFilter } | null {
  const item = FAQ.find((f) => f.id === faqId)
  if (!item) return null
  const tab = item.tabs[0]
  if (tab === 'mini') return { tab: 'mini', variant: 'all' }
  const sv = 'sensorVariant' in item ? item.sensorVariant : undefined
  if (sv === 'wifi') return { tab: 'sensor', variant: 'wifi' }
  if (sv === 'standard') return { tab: 'sensor', variant: 'standard' }
  return { tab: 'sensor', variant: 'all' }
}

export function buildProductSupportFaqHref(faqId: string): string {
  const meta = getFaqDeepLinkState(faqId)
  if (!meta) return '/support/product-support'
  const params = new URLSearchParams()
  params.set('tab', meta.tab)
  if (meta.tab === 'sensor' && meta.variant !== 'all') {
    params.set('variant', meta.variant)
  }
  params.set('faq', faqId)
  return `/support/product-support?${params.toString()}`
}

/** Deep link to Product Support hub tabs (no specific FAQ). */
export function buildProductSupportHubHref(
  tab: ProductSupportTab,
  variant: SensorVariantFilter = 'all',
): string {
  const params = new URLSearchParams()
  params.set('tab', tab)
  if (tab === 'sensor' && variant !== 'all') {
    params.set('variant', variant)
  }
  return `/support/product-support?${params.toString()}`
}

export function parseProductSupportUrl(sp: URLSearchParams): {
  tab: ProductSupportTab | null
  variant: SensorVariantFilter | null
  faqId: string | null
} {
  const faqId = sp.get('faq')
  const tabParam = sp.get('tab')
  const variantParam = sp.get('variant')

  let tab: ProductSupportTab | null = tabParam === 'mini' || tabParam === 'sensor' ? tabParam : null
  let variant: SensorVariantFilter | null =
    variantParam === 'all' || variantParam === 'wifi' || variantParam === 'standard' ? variantParam : null

  if (faqId) {
    const fromFaq = getFaqDeepLinkState(faqId)
    if (fromFaq) {
      if (!tab) tab = fromFaq.tab
      if (fromFaq.variant !== 'all') {
        variant = fromFaq.variant
      } else if (variant === null && tab === 'sensor') {
        variant = 'all'
      }
    }
  }

  return { tab, variant, faqId }
}
