/**
 * AC Drain Wiz knowledge config – single source of truth for product, support, and copy.
 * Sourced from acdw_cursor_knowledge_package (custom GPT export). Update when approved sources change.
 */

export const PACKAGE_META = {
  version: '1.1.0',
  generatedOn: '2026-04-02',
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
  /** Vanity / marketing form (e.g. phone badges, “Call …” lines). */
  phoneDisplay: '83-DRAINWIZ',
  /** Numeric form for dialers and secondary line in two-line layouts. */
  phoneNumeric: '(833) 724-6949',
  phonePlain: '8337246949',
  telHref: 'tel:+18337246949',
} as const

// ─── Monitoring portal (approved) ────────────────────────────────────────
export const MONITORING = {
  applicationName: 'ACDW Sensor Monitoring Web Application',
  portalUrl: 'https://monitor.acdrainwiz.com/login',
  signUpUrl: 'https://monitor.acdrainwiz.com/sign-up',
  portalUrlStatus: 'approved' as const,
} as const

// ─── Miami HEAT partnership (approved marks; files under public/images/miami-heat-sponsorship/) ─
export const MIAMI_HEAT_PARTNERSHIP = {
  /** Full URL for email HTML and external references */
  signatureBadgeUrl:
    'https://acdrainwiz.com/images/miami-heat-sponsorship/signature-badge-color.png',
  /** Site-relative path for in-app UI (Vite `public/`) — full color */
  signatureBadgePath: '/images/miami-heat-sponsorship/signature-badge-color.png',
  /** Full URL for grayscale badge (e.g. footer on dark background) */
  signatureBadgeBwUrl:
    'https://acdrainwiz.com/images/miami-heat-sponsorship/signature-badge-bw.png',
  /** Site-relative path — grayscale / B&W variant */
  signatureBadgeBwPath: '/images/miami-heat-sponsorship/signature-badge-bw.png',
  /** Official Miami HEAT red for “HEAT” wordmark accents in UI */
  officialRed: '#98002E',
  /** About page anchor for partnership context (header/footer lockups link here) */
  aboutPartnershipHref: '/about#miami-heat-partnership',
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

/** WiFi model: use 24V when possible; battery-only is supported with different LED behavior. */
export const SENSOR_WIFI_POWER_RECOMMENDATION =
  '24V HVAC power is strongly recommended for the WiFi Sensor Switch for consistent LED feedback and reliable operation. Battery-only operation is supported; LED visibility is limited, and a fully depleted battery may trigger protective HVAC shutdown.' as const

/**
 * Sensor install: if the line was cleared with air via the Mini bi-directional valve before final sensor bayonet mount.
 * Wording aligned with Mini setup completion (`Step3MiniCompletion` service step 1 — air / P-trap / water seal).
 */
export const SENSOR_INSTALL_P_TRAP_AFTER_MINI_AIR_FLUSH =
  'If you used the AC Drain Wiz Mini bi-directional valve to clear the line with compressed air before finishing this install, check for the presence of a P-trap in the condensate line; after the air flush is complete, refill the P-trap with water to reestablish the required water seal—then complete the sensor bayonet mount.' as const

// ─── LED status indicators (aligned with ACDW KB Sensor LED Indicator Guide v1.1) ─
export const SENSOR_LED_STANDARD = {
  noLight: { label: 'No light', description: 'No power — check wiring and system power' },
  green: {
    label: 'Green',
    description: 'Normal operation — water level is below the shutoff threshold',
  },
  solidRedTest: {
    label: 'Solid red',
    description:
      'Installation test: pressing the green PCB simulates high water → AC shutdown (expected)',
  },
  solidRedShutdown: {
    label: 'Solid red',
    description: 'High water detected (~95%) — HVAC shuts down to help prevent overflow',
  },
} as const

/** WiFi on 24V (recommended). */
export const SENSOR_LED_WIFI = {
  noLight: { label: 'No light', description: 'No power — verify 24V connection' },
  flashingRed: {
    label: 'Flashing red',
    description: 'Waiting for WiFi setup',
  },
  flashingGreen: {
    label: 'Flashing green',
    description: 'Setup in progress — mobile device connected to the sensor',
  },
  solidGreen: {
    label: 'Solid green',
    description: 'Connected and operating normally',
  },
  solidRed: {
    label: 'Solid red',
    description: 'High water detected (~95%) — HVAC shuts down to help prevent overflow',
  },
} as const

/** WiFi on battery-only — LED visibility is limited; solid red for high water matches 24V when the LED is active. */
export const SENSOR_LED_WIFI_BATTERY_ONLY = {
  startupGreen: {
    label: 'Solid green (brief)',
    description: 'May appear briefly after setup, then the light turns off — normal; conserves battery',
  },
  noLight: {
    label: 'No light',
    description: 'After startup: monitoring can continue — no light does not indicate failure in battery-only mode',
  },
  solidRed: {
    label: 'Solid red',
    description: 'High water detected (~95%) — HVAC shuts down to help prevent overflow',
  },
} as const

/** Model-specific intro copy for the "What do the sensor lights mean?" FAQ. Use the variant that matches the user's selected sensor view. */
export const SENSOR_LED_ANSWER: Record<SensorVariantFilter, string> = {
  all: 'Sensor LED meanings depend on your model and power source. Use the guides below: Standard (Non-WiFi), WiFi on 24V (recommended), and WiFi on battery-only (limited LED visibility).',
  standard:
    'Standard Sensor Switch: no light means no power (check wiring). Green means normal operation with water below the shutoff threshold. Solid red means high water (~95%) and protective AC shutdown. During installation, solid red can also appear during the PCB touch test—that simulates high water and is expected.',
  wifi:
    'WiFi Sensor Switch: when powered by 24V, use the first WiFi table below. Battery-only mode limits LED visibility—use the battery-only section; after startup, no light may be normal while monitoring continues.',
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
      'The Sensor monitors water level in the drain line and automatically shuts down the AC at 95% to help prevent overflow. It is a monitoring and safety device—not a drain-cleaning substitute; regular HVAC maintenance is still required. The Standard Sensor Switch (Non-WiFi) provides that protection with no connectivity. The WiFi Sensor Switch adds remote monitoring, email and SMS alerts, and configurable service alerts. You do not need the Mini to install a Sensor—both sensor models include their own Transparent T Manifold. If you already have a Mini, the Sensor installs in the same bayonet port; for service, you can remove the Sensor, use the Mini valve for cleaning, then reinstall the Sensor.',
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
    id: 'sensor_ac_shut_off',
    question: 'Why did my AC shut off?',
    answer:
      'The sensor detected high water in the condensate drain line and shut down the HVAC system to help prevent overflow. This is protective operation.',
    tags: ['sensor', 'support', 'shutdown'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'sensor_solid_red',
    question: 'The sensor shows red—is something wrong?',
    answer:
      'A solid red light means high water in the drain line. This is normal protective operation: the system shuts down to reduce the risk of overflow.',
    tags: ['sensor', 'support', 'leds'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'sensor_no_light',
    question: 'There is no light—is the sensor broken?',
    answer:
      'It depends on configuration. With 24V power (Standard or WiFi), no light usually means no power—check wiring and connections. On a WiFi model running on battery only, no light after startup can be normal while the sensor is still monitoring. See the LED guides on this page for the WiFi battery-only note.',
    tags: ['sensor', 'support', 'leds'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'sensor_prevents_all_backups',
    question: 'Does the sensor prevent all drain backups?',
    answer:
      'No. The sensor helps monitor high water in the drain line and can shut down the HVAC at high levels, but it does not replace routine HVAC maintenance or guarantee prevention of all drain line issues.',
    tags: ['sensor', 'support'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'sensor_role_maintenance',
    question: 'Is the sensor a drain-cleaning solution?',
    answer:
      'No. The sensor is a monitoring and safety device for the condensate line, not a substitute for drain cleaning. Regular HVAC maintenance is still required. For the WiFi Sensor Switch, 24V HVAC power is strongly recommended for consistent LED feedback and reliable operation; battery-only operation is supported but LED visibility is limited.',
    tags: ['sensor', 'support', 'maintenance'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'sensor_leds',
    question: 'How do I know what the sensor light means?',
    answer:
      'Standard Sensor Switch (Non-WiFi): No light means no power (check wiring). Green means normal operation with water below the shutoff threshold. Solid red means high water (~95%) and protective AC shutdown, or during installation the PCB touch test can trigger the same shutdown (expected). WiFi Sensor Switch on 24V: No light means no power—verify 24V. Flashing red means waiting for WiFi; flashing green means setup in progress; solid green means connected and operating normally; solid red means high water (~95%) and protective shutdown. WiFi on battery-only: LED visibility is limited—a brief green at startup then no light may be normal while monitoring continues; when the LED is visible, solid red still means high water (~95%) and protective shutdown. A fully depleted battery means no power to the LED (no separate “battery depleted” light). See the LED tables on this page for details.',
    tags: ['sensor', 'support', 'leds'],
    tabs: ['sensor'] as const,
  },
  {
    id: 'sensor_no_alert_before',
    question: 'The sensor didn’t alert me before a problem.',
    answer:
      'The sensor responds to high water in the drain line. Remote monitoring and service alerts (WiFi model) depend on proper installation, power configuration, and connectivity. If the WiFi sensor is offline or misconfigured, alerts may not arrive. Regular HVAC maintenance is still required—the sensor does not replace routine line cleaning.',
    tags: ['sensor', 'support', 'wifi', 'alerts'],
    tabs: ['sensor'] as const,
    sensorVariant: 'wifi' as const,
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
      'We recommend checking your drain line every 3–6 months. If you have the WiFi Sensor Switch, remote alerts and dashboard status can help flag issues—regular HVAC maintenance is still required. The Standard Sensor Switch (Non-WiFi) does not send remote alerts; it provides local overflow protection and shutdown at high water.',
    tags: ['maintenance', 'support', 'sensor'],
    tabs: ['mini'] as const,
  },
  {
    id: 'alert_notifications',
    question: 'Why am I not receiving Sensor alert notifications?',
    answer:
      'Sensor alerts are delivered by email and SMS only—there is no dedicated mobile app. Use the AC Drain Wiz monitoring web application in your browser and sign in to the dashboard. Under account settings, confirm that SMS and email alerts are enabled and that your phone number and email address on file are correct. If the WiFi sensor shows as offline on the monitoring site, alerts cannot be sent until it is online—verify connectivity on site (sensor power, 2.4 GHz Wi‑Fi, signal strength at the unit, and router or network issues). Check spam or junk folders for email alerts.',
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
      'Installation is a simple, one-time setup in under 30 minutes with no specialized tools required. The Mini uses PVC solvent weld installation with Oatey All-Purpose Cement and must be installed horizontally. Apply primer and all-purpose cement only to the AC condensate drain line—the two cut pipe ends—then fit and slide those ends into the T manifold horizontal openings. Do not apply primer or cement to the T manifold openings or the vertical bayonet port.',
    tags: ['installation', 'contractor'],
    tabs: ['mini'] as const,
  },
] as const

// ─── WiFi requirement (approved) ───────────────────────────────────────────
/** WiFi Sensor requires 2.4 GHz; 5 GHz is not supported. */
export const WIFI_REQUIREMENT = '2.4 GHz' as const

/**
 * PVC solvent weld: primer and cement on condensate line only—then into T manifold horizontal openings.
 * Not on manifold openings or bayonet (Mini and Sensor Transparent T manifolds).
 */
export const PVC_SOLVENT_WELD_PLACEMENT =
  'Apply PVC primer and all-purpose cement only to the AC condensate drain line—the two cut pipe ends. Then fit and slide those pipe ends into the T manifold horizontal openings. Do not apply primer or cement to the T manifold horizontal openings, the vertical bayonet port, threads, or other manifold surfaces.' as const

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
