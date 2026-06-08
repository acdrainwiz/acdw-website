// Search metadata for MiniSetupPage, decoupled from the page module.
// Consumed by the central site search registry.
import { PRODUCT_NAMES } from '../config/acdwKnowledge'
import { MINI_SETUP_SEARCH_TERMS } from '../config/installationSearchTerms'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'guide-mini-setup',
  kind: 'how-to',
  title: 'Mini installation guide (step-by-step)',
  body: `How to install the ${PRODUCT_NAMES.mini}. Permanent service port on a 3/4 inch PVC condensate drain line. PVC solvent weld—primer and cement only on the condensate line, then fit into the T manifold horizontal openings; not on the manifold openings or vertical port. Measure, cure, leak test. Flush, compressed air, vacuum cleaning without cutting pipe. Preparation, installation, completion.`,
  tags: ['mini', 'install', 'installation', 'pvc', 'drain', 'how to', 'setup', 'guide', 'solvent weld'],
  searchTerms: MINI_SETUP_SEARCH_TERMS,
  href: '/mini-setup',
}
