// Search metadata for AboutPage, decoupled from the page module.
// Kept in a sibling file so the page no longer exports PAGE_SEARCH_META.
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-about',
  kind: 'site',
  title: 'About AC Drain Wiz',
  body: 'Built for the line and the people who service it. Permanent condensate drain access and overflow protection so technicians work faster and see what is happening in the line. Company story: one-time installed solutions, faster cleanouts with Mini, Mini plus Standard Sensor Switch combo, overflow protection with Sensor. Our Values: contractor-first, clarity, permanence in practice, readiness before emergencies. Alan Riddle founder story, attic flooding and condensate line service. Miami HEAT partnership. Who we serve: HVAC contractors, property managers, homeowners. ICC code compliant, professional grade, made in USA. Contact and leadership information.',
  tags: ['about', 'company', 'mission', 'founder', 'story', 'values', 'miami heat', 'partnership'],
  href: '/about',
}
