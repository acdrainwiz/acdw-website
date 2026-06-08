/**
 * Search metadata for the Municipal Intake Form page, split out of
 * MunicipalIntakePage.tsx so the page module exports only its component.
 */
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'municipal-intake',
  kind: 'product-info',
  title: 'Municipal Intake Form (BOAFCOAA)',
  body:
    'Municipal intake form for BOAFCOAA participants and similar leads. Collects municipality information, primary and secondary contacts, infrastructure details, interest and participation, and program enrollment.',
  tags: ['municipal', 'intake', 'BOAFCOAA', 'government'],
  href: '/boafcoaa-muni-intake-form',
}
