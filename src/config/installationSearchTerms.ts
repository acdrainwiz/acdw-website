/**
 * Extra search tokens for Support Hub (how-to flows). These extend matching beyond
 * title/body on `supportSearchIndex` entries without duplicating full instructional copy.
 *
 * Keep terms aligned with on-wizard and product language; do not invent specs.
 * Add or trim lists here as setup copy evolves — no new index row per keyword.
 */

/** Dedupe when combining lists (Standard/WiFi share many terms). */
export function mergeSearchTermLists(...lists: string[][]): string[] {
  return [...new Set(lists.flat())]
}

/** Mini setup wizard — drain line, PVC, service access */
export const MINI_SETUP_SEARCH_TERMS: string[] = [
  'mini',
  '3/4',
  'pvc',
  'solvent weld',
  'cement',
  'oatey',
  'horizontal',
  'cure',
  'leak test',
  'flush',
  'compressed air',
  'vacuum',
  'bi-directional valve',
  't-manifold',
  'manifold cap',
  'condensate',
  'drain line',
  'p-trap',
  'p trap',
  'water seal',
  'maintenance',
  'transparent',
  'measure',
  'cut',
  'primer',
]

/** Sensor setup — shared Standard / WiFi (manifold, line, mounting) */
export const SENSOR_SHARED_SETUP_SEARCH_TERMS: string[] = [
  'sensor',
  'transparent t',
  't manifold',
  'manifold',
  'bayonet',
  '3/4',
  'pvc',
  'drain line',
  'condensate',
  'install',
  'mount',
  'lock',
  'twist',
  '24v',
  '24 v',
  'cable',
  'air handler',
  'float switch',
  'led',
  'green',
  'red',
  'blinking',
  'testing',
  'shutdown',
  '80%',
  'overflow',
]

/** Standard Sensor Switch — non-WiFi guided flow */
export const SENSOR_STANDARD_SETUP_SEARCH_TERMS: string[] = [
  ...SENSOR_SHARED_SETUP_SEARCH_TERMS,
  'standard',
  'non-wifi',
  'non wifi',
  'capacitive',
  'no wi-fi',
  'no wifi',
]

/** WiFi Sensor Switch — account, Wi-Fi, portal, battery */
export const SENSOR_WIFI_SETUP_SEARCH_TERMS: string[] = [
  ...SENSOR_SHARED_SETUP_SEARCH_TERMS,
  'wifi',
  'wi-fi',
  'wi fi',
  '2.4',
  'ghz',
  '5 ghz',
  'not supported',
  'wps',
  'pairing',
  'pair',
  'network',
  'password',
  'router',
  'captive portal',
  'monitoring',
  'portal',
  'dashboard',
  'account',
  'sign up',
  'login',
  'contractor',
  'customer',
  'assign',
  'alert',
  'sms',
  'email',
  'battery',
  'backup battery',
  'lithium',
  'unbox',
  'battery door',
  'polarity',
  'low battery',
  'power',
]
