// Search metadata for SensorSetupPage, decoupled from the page module.
// Keeps the page component free of site-search registry concerns.
import type { PageSearchMeta } from '../config/siteSearchTypes'
import {
  SENSOR_SETUP_MODEL_CHOICE_HREF,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
  PRODUCT_NAMES,
  buildSensorSetupHref,
} from '../config/acdwKnowledge'
import {
  mergeSearchTermLists,
  SENSOR_STANDARD_SETUP_SEARCH_TERMS,
  SENSOR_WIFI_SETUP_SEARCH_TERMS,
} from '../config/installationSearchTerms'

export const SENSOR_SETUP_SEARCH_ENTRIES: PageSearchMeta[] = [
  {
    id: 'guide-sensor-setup',
    kind: 'how-to',
    title: 'Sensor setup guide',
    body: `How to install the ${PRODUCT_NAMES.sensor}, ${SENSOR_STANDARD_SHORT}, and ${SENSOR_WIFI_SHORT}. Start from Installation & Setup to choose your model, then open the step-by-step wizard. Transparent T manifold, bayonet port. ${SENSOR_WIFI_SHORT} includes a backup battery in the box; the guided steps cover battery door, polarity, 24V cable, and power before Wi‑Fi pairing. WiFi Sensor uses the monitoring dashboard; Wi-Fi requires a 2.4 GHz network. Create account, assign customer, on-site install steps.`,
    tags: [
      'sensor',
      'install',
      'installation',
      'wifi',
      'wi-fi',
      'setup',
      'how to',
      'pairing',
      'monitoring',
      'manifold',
      'battery',
      'backup battery',
      'power',
    ],
    searchTerms: mergeSearchTermLists(SENSOR_STANDARD_SETUP_SEARCH_TERMS, SENSOR_WIFI_SETUP_SEARCH_TERMS),
    href: SENSOR_SETUP_MODEL_CHOICE_HREF,
  },
  {
    id: 'guide-wifi-sensor-setup',
    kind: 'how-to',
    title: `${SENSOR_WIFI_SHORT} — setup guide`,
    body: `${SENSOR_WIFI_SHORT} installation wizard: unboxing (24V cable, backup battery), lithium-ion backup ~2 years with low-battery warning in the monitoring platform, battery door and polarity, 24V or battery power, LED when awaiting Wi‑Fi, WPS or manual pairing, 2.4 GHz Wi‑Fi only, contractor account, dashboard, assign sensor to customer.`,
    tags: [
      'battery',
      'backup battery',
      'wifi',
      'wi-fi',
      'sensor',
      'install',
      'pairing',
      'portal',
      'monitoring',
    ],
    searchTerms: SENSOR_WIFI_SETUP_SEARCH_TERMS,
    href: buildSensorSetupHref({ model: 'wifi', step: 1 }),
  },
  {
    id: 'guide-standard-sensor-setup',
    kind: 'how-to',
    title: `${SENSOR_STANDARD_SHORT} — setup guide`,
    body: `${SENSOR_STANDARD_SHORT} wizard: Transparent T manifold measure, primer and cement on the condensate line only then into the horizontal openings, cure, leak test, sensor power and LED check, mount and lock sensor—no home Wi‑Fi step in this guide.`,
    tags: ['sensor', 'standard', 'non-wifi', 'install', 'manifold'],
    searchTerms: SENSOR_STANDARD_SETUP_SEARCH_TERMS,
    href: buildSensorSetupHref({ model: 'standard', step: 1 }),
  },
]
