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
  howItWorks: {
    eyebrow: 'From install to alerts',
    title: 'Install once. Monitor continuously.',
    dek: 'Bayonet mount on the included T-manifold, then local shutdown or remote fleet tools depending on the model you choose.',
  },
} as const
