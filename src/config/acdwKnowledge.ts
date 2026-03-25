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
  /** Public support inbox for customer-facing contact links (e.g. Support Hub search). */
  supportEmail: 'support@acdrainwiz.com',
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

/** URL query value for `/sensor-setup?model=` (Standard vs WiFi install guides). */
export type SensorSetupModelSlug = 'standard' | 'wifi'

/** Choose Standard vs WiFi on Installation & Setup before opening the guided `/sensor-setup` wizard. */
export const SENSOR_SETUP_MODEL_CHOICE_HREF = '/support/installation-setup#install-sensor-models' as const

export function buildSensorSetupHref(options: { model: SensorSetupModelSlug; step?: number }): string {
  const step = options.step ?? 1
  const params = new URLSearchParams({ step: String(step), model: options.model })
  return `/sensor-setup?${params.toString()}`
}

export function parseSensorSetupModelParam(value: string | null): SensorSetupModelSlug | null {
  if (value === 'standard' || value === 'wifi') return value
  return null
}

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

/** Model-specific intro copy for the "What do the sensor lights mean?" FAQ. Use the variant that matches the user's selected sensor view. */
export const SENSOR_LED_ANSWER: Record<SensorVariantFilter, string> = {
  all: 'Sensor LED meanings depend on your model. Use the guides below for the Standard Sensor Switch (Non-WiFi) and the WiFi Sensor Switch.',
  standard:
    'For the Standard Sensor Switch: no light means no power, green means monitoring active, flashing red means testing mode, and solid red means 95% water level detected and AC shutdown triggered.',
  wifi: 'For the WiFi Sensor Switch: no light means no power, flashing red means awaiting WiFi connection, green means connected to the monitoring platform, and solid red means 95% water level detected and AC shutdown triggered.',
} as const

// ─── FAQ (approved answers; use for support pages and structured data) ─────
/** Tab(s) where this FAQ appears on Product Support: mini | sensor */
export type ProductSupportTab = 'mini' | 'sensor'

/** When on Sensor tab: 'wifi' = WiFi-only FAQ, 'standard' = Standard-only; unset = both */
export type SensorVariantFilter = 'all' | 'wifi' | 'standard'

export const FAQ = [
  {
    id: 'mini_what_and_relation',
    question: 'What does the Mini do, and how does it relate to the Sensor?',
    answer:
      'The Mini is the drain line maintenance device. It gives technicians a permanent access point to flush with water, clear clogs with compressed air, and vacuum sludge without cutting PVC—no cutting or reattaching pipe. The clear body gives you a direct view into the drain line so you can verify that cleaning was successful and spot biofilm or high water before it becomes a backup. The Sensor Switch is a separate product for overflow protection: it monitors water level in the drain line and automatically shuts down the AC at 95%. The WiFi Sensor Switch adds remote monitoring, email and SMS alerts, and configurable service alerts; the Standard Sensor Switch (Non-WiFi) does not. You can use the Mini on its own for maintenance; adding a Sensor is optional for overflow protection and monitoring.',
    tags: ['mini', 'products', 'comparison'],
    tabs: ['mini'] as const,
  },
  {
    id: 'mini_without_sensor',
    question: 'Can I use the Mini without a Sensor?',
    answer:
      'Yes. The Mini is the maintenance device and works on its own. It provides permanent access for flush, air, and vacuum so you can clean the drain line without cutting PVC. The Sensor is optional and adds overflow protection and, with the WiFi model, remote monitoring and alerts. Many users start with the Mini and add a Sensor later if they want automatic shutdown and monitoring. Homeowners can also visually inspect the Mini to see if water levels or biofilm are building up and call their AC technician to clean the line before a backup.',
    tags: ['mini', 'support'],
    tabs: ['mini'] as const,
  },
  {
    id: 'compatibility',
    question: 'Is AC Drain Wiz compatible with my system?',
    answer:
      'AC Drain Wiz works with 3/4 inch condensate drain lines and is installed on the main condensate drain line between the condensate pan and exterior drain outlet. It works seamlessly with most residential AC units and is adaptable for various setups, including transfer pumps. If you have questions about your specific system or setup, contact support.',
    tags: ['compatibility', 'installation'],
    tabs: ['mini'] as const,
  },
  {
    id: 'mini_how_it_works',
    question: 'How does the Mini work?',
    answer:
      'The Mini is the drain line maintenance device. It gives technicians a permanent access point to flush with water, clear clogs with compressed air, and vacuum sludge without cutting PVC. The transparent design lets you see inside the line to confirm the clean-out worked and to spot rising water or algae before it causes a clog. Installation is a one-time PVC solvent weld; no specialized tools required.',
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
    id: 'sensor_what_and_mini',
    question: 'What does the Sensor do, and do I need the Mini?',
    answer:
      'The Sensor monitors water level in the drain line and automatically shuts down the AC at 95% to prevent overflow. The Standard Sensor Switch (Non-WiFi) provides that protection with no connectivity. The WiFi Sensor Switch adds remote monitoring, email and SMS alerts, and configurable service alerts. You do not need the Mini to install a Sensor—both sensor models include their own Transparent T Manifold. If you already have a Mini, the Sensor installs in the same bayonet port; for service, you can remove the Sensor, use the Mini valve for cleaning, then reinstall the Sensor.',
    tags: ['sensor', 'products', 'support'],
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
