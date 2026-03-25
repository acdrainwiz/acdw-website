/**
 * Curated searchable text for Support Hub (co-located with pages or config).
 * Keep copy aligned with on-page content and acdwKnowledge; do not invent specs.
 */
export type PageSearchKind = 'how-to' | 'product-info' | 'site'

export type PageSearchMeta = {
  id: string
  kind: PageSearchKind
  title: string
  body: string
  tags?: string[]
  searchTerms?: string[]
  href: string
}
