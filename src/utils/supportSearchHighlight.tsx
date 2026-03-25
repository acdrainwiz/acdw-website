import { Fragment, type ReactNode } from 'react'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Returns text split into segments with query-related terms wrapped for highlighting.
 * `terms` should be longest-first (see getHighlightTermsForQuery).
 */
export function highlightSearchTerms(text: string, terms: string[]): ReactNode {
  const usable = terms.filter((t) => t.length >= 2).map((t) => t.trim()).filter(Boolean)
  if (usable.length === 0) return text

  const pattern = usable.map(escapeRegExp).join('|')
  if (!pattern) return text

  const re = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(re)

  return (
    <>
      {parts.map((part, i) => {
        const isHit = usable.some((t) => part.toLowerCase() === t.toLowerCase())
        if (!isHit) return <Fragment key={i}>{part}</Fragment>
        return (
          <mark key={i} className="support-hub-search-highlight">
            {part}
          </mark>
        )
      })}
    </>
  )
}
