/**
 * AC Drain Wiz knowledge config – single source of truth for product, support, and copy.
 * Sourced from acdw_cursor_knowledge_package (custom GPT export). Update when approved sources change.
 */

export const PACKAGE_META = {
  version: '1.0.0',
  generatedOn: '2026-03-13',
  usageRules: [
    'Do not invent missing specs, URLs, warranty language, or compatibility claims.',
    'Treat Mini and Sensor as complementary but distinct; Sensor does not require Mini for initial install.',
    'Treat WiFi and Standard Sensor as separate variants with different feature sets.',
  ],
} as const

// ─── Support contact (approved: vanity line) ──────────────────────────────
export const SUPPORT_CONTACT = {
  primaryContactName: 'Alan Riddle',
  title: 'Founder & CEO',
  email: 'ariddle@acdrainwiz.com',
  phoneDisplay: '(234) 23 DRAIN',
  phoneNumeric: '(234) 223-7246',
  phonePlain: '2342237246',
  telHref: 'tel:+12342237246',
} as const

// ─── Monitoring portal (approved) ────────────────────────────────────────
export const MONITORING = {
  applicationName: 'ACDW Sensor Monitoring Web Application',
  portalUrl: 'https://monitor.acdrainwiz.com/login',
  signUpUrl: 'https://monitor.acdrainwiz.com/sign-up',
  portalUrlStatus: 'approved' as const,
} as const

// ─── Warranty & returns ───────────────────────────────────────────────────
// Limited Lifetime wording on site is under legal review. Do not add new
// warranty/return claims until legal confirms; use safeCopy when in doubt.
export const WARRANTY_RETURNS = {
  warranty: {
    status: 'under_legal_review' as const,
    value: null as string | null,
    safeCopy:
      'Please contact support for current warranty details.',
  },
  returns: {
    status: 'unstated' as const,
    value: null as string | null,
    safeCopy:
      'For our current return policy, please contact support or your point of purchase.',
  },
} as const

// ─── Product display names ───────────────────────────────────────────────
export const PRODUCT_NAMES = {
  mini: 'AC Drain Wiz Mini',
  sensor: 'AC Drain Wiz Sensor',
  sensorStandard: 'AC Drain Wiz Standard Sensor Switch',
  sensorWifi: 'AC Drain Wiz WiFi Sensor Switch',
  bundle: 'AC Drain Wiz Mini + Sensor Bundle',
} as const

/** Use for UI when distinguishing the non-WiFi variant (full name). */
export const SENSOR_STANDARD_DISPLAY = 'AC Drain Wiz Standard Sensor Switch (Non-WiFi)' as const
/** Use for UI when distinguishing the WiFi variant (full name). */
export const SENSOR_WIFI_DISPLAY = 'AC Drain Wiz WiFi Sensor Switch' as const
/** Shorter label for tight spaces (e.g. card titles). */
export const SENSOR_STANDARD_SHORT = 'Standard Sensor Switch (Non-WiFi)' as const
export const SENSOR_WIFI_SHORT = 'WiFi Sensor Switch' as const

// ─── LED status indicators (from knowledge package) ───────────────────────
export const SENSOR_LED_STANDARD = {
  noLight: { label: 'No light', description: 'No power' },
  green: { label: 'Green', description: 'Monitoring active' },
  flashingRed: { label: 'Flashing red', description: 'Testing mode' },
  solidRed: {
    label: 'Solid red',
    description: '95% water level detected, AC shutdown triggered',
  },
} as const

export const SENSOR_LED_WIFI = {
  noLight: { label: 'No light', description: 'No power' },
  flashingRed: { label: 'Flashing red', description: 'Awaiting WiFi connection' },
  green: { label: 'Green', description: 'Connected to monitoring platform' },
  solidRed: {
    label: 'Solid red',
    description: '95% water level detected, AC shutdown triggered',
  },
} as const

// ─── FAQ (approved answers; use for support pages and structured data) ─────
/** Tab(s) where this FAQ appears on Product Support: mini | sensor | general */
export type ProductSupportTab = 'mini' | 'sensor' | 'general'

/** When on Sensor tab: 'wifi' = WiFi-only FAQ, 'standard' = Standard-only; unset = both */
export type SensorVariantFilter = 'all' | 'wifi' | 'standard'

export const FAQ = [
  {
    id: 'mini_vs_sensor',
    question: 'What is the difference between the AC Drain Wiz Mini and the Sensor Switch?',
    answer:
      'The Mini is the drain line maintenance device. It gives technicians a permanent access point to flush with water, clear clogs with compressed air, and vacuum sludge without cutting PVC. The Sensor Switch is the overflow protection device. It monitors water levels inside the drain line and shuts down the AC at 95% water level. The WiFi Sensor Switch adds remote monitoring, email and SMS alerts, and configurable service alerts before shutdown; the Standard Sensor Switch does not include WiFi or remote alerts.',
    tags: ['products', 'comparison', 'contractor'],
    tabs: ['general'] as const,
  },
  {
    id: 'compatibility',
    question: 'Is AC Drain Wiz compatible with my system?',
    answer:
      'AC Drain Wiz works with 3/4 inch condensate drain lines and is installed on the main condensate drain line between the condensate pan and exterior drain outlet. It works seamlessly with most residential AC units and is adaptable for various setups, including transfer pumps. If you have questions about your specific system or setup, contact support.',
    tags: ['compatibility', 'installation'],
    tabs: ['mini', 'general'] as const,
  },
  {
    id: 'mini_how_it_works',
    question: 'How does the Mini work?',
    answer:
      'The Mini is the drain line maintenance device. It gives technicians a permanent access point to flush with water, clear clogs with compressed air, and vacuum sludge without cutting PVC. Installation is a one-time PVC solvent weld; no specialized tools required.',
    tags: ['mini', 'support'],
    tabs: ['mini'] as const,
  },
  {
    id: 'mini_required_before_sensor',
    question: 'Do I need the Mini before I can install a Sensor Switch?',
    answer:
      'No. Both sensor models include a Transparent T Manifold identical to the ACDW Mini manifold, so contractors do not need to purchase the Mini first to install a Sensor Switch. If service is needed later, the Sensor Switch can be removed, the Mini valve installed temporarily for drain cleaning, and then the Sensor Switch reinstalled.',
    tags: ['sensor', 'mini', 'installation'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'wifi_vs_nonwifi',
    question: 'What is the difference between the WiFi Sensor Switch and the Standard Sensor Switch (Non-WiFi)?',
    answer:
      'The AC Drain Wiz Standard Sensor Switch (Non-WiFi) provides capacitive water sensing, automatic AC shutdown at 95% water level, no moving parts, and fail-safe shutdown if power is lost. The AC Drain Wiz WiFi Sensor Switch adds remote water-level monitoring, contractor account monitoring, email notifications, SMS notifications, and configurable service alerts from 50% to 90% water level so contractors can schedule preventative maintenance before shutdown occurs.',
    tags: ['sensor', 'wifi', 'comparison'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'sensor_leds',
    question: 'How do I know what the sensor light means?',
    answer:
      'For the Standard Sensor Switch: no light means no power, green means monitoring active, flashing red means testing mode, and solid red means 95% water level detected and AC shutdown triggered. For the WiFi Sensor Switch: no light means no power, flashing red means awaiting WiFi connection, green means connected to the monitoring platform, and solid red means 95% water level detected and AC shutdown triggered.',
    tags: ['sensor', 'support', 'leds'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'portal_login',
    question: 'Where do I log in to monitor WiFi sensors?',
    answer:
      'Log in at monitor.acdrainwiz.com. The WiFi Sensor Switch integrates with the ACDW Sensor Monitoring Web Application, where contractors can register company accounts, add customer properties, monitor installed sensors, and receive alerts.',
    tags: ['monitoring', 'wifi', 'support'],
    tabs: ['sensor'] as const,
    sensorVariant: 'wifi' as const,
  },
  {
    id: 'drain_cleaning_frequency',
    question: 'How often do I need to clean my drain line?',
    answer:
      'We recommend checking your drain line every 3–6 months. If you have the Sensor, it monitors the line continuously and will send an alert when maintenance is needed — so you don\'t have to guess or schedule blind.',
    tags: ['maintenance', 'support', 'sensor'],
    tabs: ['mini'] as const,
  },
  {
    id: 'alert_notifications',
    question: 'Why am I not receiving Sensor alert notifications?',
    answer:
      'First, verify that notifications are enabled in your device\'s settings for the monitoring app or browser. Then confirm your alert preferences (SMS, email, push) are configured in the dashboard under account settings. If your Sensor shows as offline, alerts cannot be delivered — resolve connectivity first.',
    tags: ['sensor', 'support', 'wifi'],
    tabs: ['sensor'] as const,
    sensorVariant: 'wifi' as const,
  },
  {
    id: 'maintenance_requirement',
    question: 'What maintenance does AC Drain Wiz require?',
    answer:
      'AC Drain Wiz is described as virtually maintenance-free with occasional visual inspections and no need for frequent part replacements or recalibration. For service work using compressed air, technicians should verify whether a P-trap is present and refill the P-trap with water afterward to restore the required water seal.',
    tags: ['maintenance', 'support'],
    tabs: ['mini'] as const,
  },
  {
    id: 'installation_process',
    question: 'What is the installation process like?',
    answer:
      'Installation is a simple, one-time setup in under 30 minutes with no specialized tools required. The Mini uses PVC solvent weld installation with Oatey All-Purpose Cement and must be installed horizontally.',
    tags: ['installation', 'contractor'],
    tabs: ['mini'] as const,
  },
] as const

// ─── WiFi requirement (approved) ───────────────────────────────────────────
/** WiFi Sensor requires 2.4 GHz; 5 GHz is not supported. */
export const WIFI_REQUIREMENT = '2.4 GHz' as const

// ─── Connectivity (no Bluetooth) ────────────────────────────────────────────
/** Sensor connectivity is Wi-Fi only. Do not claim Bluetooth or pairing via Bluetooth. */
export const CONNECTIVITY_NOTE = 'Wi-Fi only (2.4 GHz for WiFi Sensor); no Bluetooth.' as const

// ─── Do not claim (guardrails for copy) ──────────────────────────────────
export const DO_NOT_CLAIM = [
  'Universal compatibility with all commercial and residential HVAC systems',
  'Any warranty length or return window not explicitly confirmed by legal',
  'Guaranteed prevention of all clogs or all water damage',
  'Medical claims, mold-remediation claims, or health outcome claims',
  'That the product replaces all code-required devices in every jurisdiction',
  'A release date for the industrial-grade Mini',
  'Bluetooth support or pairing via Bluetooth',
  'Blue LED (only red—blinking or solid—and green are used)',
] as const
