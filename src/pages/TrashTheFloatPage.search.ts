/**
 * Search metadata for the Trash the Float campaign page.
 *
 * Split out of TrashTheFloatPage.tsx so the page module exports only its
 * component — this keeps the search registry (siteSearchRegistry.ts) from
 * pulling the full page (and its dependency tree) into the main bundle, and
 * satisfies the react-refresh/only-export-components rule.
 */
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-trash-the-float',
  kind: 'site',
  title: 'Trash the Float — AC Drain Wiz Campaign',
  body:
    "Trash the Float. Smart Tech's the GOAT. Real stories from contractors, homeowners, and property managers about float switch callbacks and the move toward smarter AC drain protection. Submit your story on the campaign page. Monthly iPad drawing live on Instagram. Float Switch Story Hall of Fame.",
  tags: ['campaign', 'trash the float', 'float switch', 'sensor switch', 'smart drain protection', 'hall of fame', 'story spotlight'],
  href: '/trash-the-float',
}
