// Search metadata for InstallationSetupPage, decoupled from the page module.
// Imported centrally by the site search registry.
import type { PageSearchMeta } from '../config/siteSearchTypes'
import {
  mergeSearchTermLists,
  MINI_SETUP_SEARCH_TERMS,
  SENSOR_STANDARD_SETUP_SEARCH_TERMS,
  SENSOR_WIFI_SETUP_SEARCH_TERMS,
} from '../config/installationSearchTerms'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'hub-installation-setup',
  kind: 'how-to',
  title: 'Installation & Setup — choose your product',
  body:
    'Step-by-step guides, video tutorials, and installation scenarios for AC Drain Wiz products. How to install the Mini or Sensor on the condensate drain line. Pick guided installation, mini setup, sensor setup, and recommended installation scenarios.',
  tags: ['installation', 'setup', 'guide', 'how to', 'install', 'drain line'],
  searchTerms: mergeSearchTermLists(
    MINI_SETUP_SEARCH_TERMS,
    SENSOR_STANDARD_SETUP_SEARCH_TERMS,
    SENSOR_WIFI_SETUP_SEARCH_TERMS,
    ['video', 'tutorial', 'scenario', 'choose model', 'sensor model'],
  ),
  href: '/support/installation-setup',
}
