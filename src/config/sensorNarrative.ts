/**
 * Sensor narrative zones — edit copy here first; pages import, never invent inline.
 */
import { WIFI_REQUIREMENT } from './acdwKnowledge'

export const SENSOR_HERO_HEADLINES = [
  'Stop Overflows Before They Start',
  'Detect High Water. Shut Down at 80%.',
  'Install Once—Protect Continuously',
  'Standard or WiFi—Monitor Your Way',
] as const

/** Product hero — pain + promise only; model detail lives in variant-compare band. */
export const SENSOR_PRODUCT_HERO = {
  subtitle: `Capacitive overflow protection shuts down the AC at 80% water level—no moving parts, fail-safe on power loss. Choose local-only protection or add remote monitoring, alerts, and contractor dashboard tools on ${WIFI_REQUIREMENT} Wi‑Fi.`,
  trustLine: 'Professional installation · Standard & WiFi models',
} as const

export const SENSOR_NARRATIVE_ZONES = {
  variantCompare: {
    eyebrow: 'Two models, one manifold',
    title: 'Choose your Sensor model',
    dek: 'Both include a Transparent T Manifold for install—you do not need the AC Drain Wiz Mini first. Pick the model that matches how you want to service and monitor the home.',
  },
  valueProps: {
    eyebrow: "Who it's for",
    title: 'Built for Everyone',
    dek: 'Homeowner, HVAC pro, or property manager—the Sensor family delivers overflow protection, with optional remote monitoring and fleet tools on the WiFi Sensor Switch.',
  },
  visibility: {
    eyebrow: 'Real-time visibility',
    title: "See What's Happening, When It's Happening",
    dek: 'The WiFi Sensor Switch reflects sensor state in the monitoring dashboard in real time. The Standard Sensor Switch (Non-WiFi) focuses on reliable on-site shutdown without remote connectivity.',
  },
  alerts: {
    eyebrow: 'Smart alerts',
    title: 'Stop Problems Before They Start',
    dek: 'On the WiFi Sensor Switch, proactive service alerts help you schedule maintenance before shutdown. Both models protect against overflow with automatic AC shutdown at 80% water level.',
  },
  fleet: {
    eyebrow: 'Fleet monitoring',
    title: 'Manage Every Installation From One Dashboard',
    dek: "WiFi Sensor Switch: turn every install into a recurring touchpoint—monitor sites, schedule service, and review alerts from one dashboard. Standard installs stay ideal when remote monitoring isn't required.",
  },
  service: {
    eyebrow: 'Service operations',
    title: 'Streamline Your Service Operations',
    dek: 'Create service calls from alerts or on a schedule, route them to the right tech, and keep customers informed—all from the WiFi contractor dashboard.',
  },
  maintenance: {
    eyebrow: 'Maintenance optimization',
    title: '35% Faster Service Calls',
    dek: 'Pre-visit diagnostics and visual confirmation tools reduce service time and improve efficiency.',
  },
  howItWorks: {
    eyebrow: 'From install to alerts',
    title: 'Install once. Monitor continuously.',
    dek: 'Bayonet mount on the included T-manifold, then local shutdown or remote fleet tools depending on the model you choose.',
  },
  specs: {
    eyebrow: 'Specs by model',
    title: 'Standard vs WiFi, side by side',
    dek: 'The same overflow protection and included Transparent T-Manifold—choose local shutdown or add remote monitoring and alerts.',
  },
  faq: {
    eyebrow: 'Need-to-know',
    title: 'Frequently Asked Questions',
    dek: 'Answers to the questions homeowners and contractors ask first about the Sensor Switch.',
  },
} as const

/** Variant-compare band — card copy kept out of page JSX for easier tuning. */
export const SENSOR_VARIANT_COMPARE = {
  manifoldConnector: 'Same Transparent T-Manifold',
  specsBridge: 'See full side-by-side specs',
  standard: {
    description:
      'Capacitive overflow protection with automatic AC shutdown at 80% water level—no moving parts, fail-safe on power loss.',
    bullets: [
      'Local shutdown at 80% water level',
      'LED: green = monitoring; solid red = shutdown or touch test',
      'Included Transparent T-Manifold—no Mini purchase required',
      'Capacitive sensing with no moving parts',
    ] as const,
  },
  wifi: {
    plusLead: 'Includes all Standard (Non-WiFi) features, plus:',
    bullets: [
      'Remote monitoring dashboard',
      'Email/SMS and service alerts (50–79%; shutdown at 80%)',
      `Requires ${WIFI_REQUIREMENT} Wi‑Fi for the monitoring dashboard (5 GHz not supported)`,
      'LED pairing/setup states (24V HVAC power strongly recommended)',
      'Connectivity is Wi‑Fi only—no Bluetooth pairing',
    ] as const,
  },
} as const
