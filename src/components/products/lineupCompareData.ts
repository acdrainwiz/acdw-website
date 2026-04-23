import {
  PRODUCT_NAMES,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
} from '@/config/acdwKnowledge'

/**
 * Shared lineup comparison data. Consumed by:
 *  - `ProductsLineupComparison` (the "Which one do I need?" table/cards)
 *  - `CompareDrawer` (persistent side-by-side compare tray)
 *
 * Keep this file free of React so it can be imported anywhere.
 */

export type LineupColumnKey = 'standard' | 'wifi' | 'combo'

export type LineupRow = {
  id: string
  label: string
  /** Screen-reader hint (also shown as tooltip on row label icon) */
  hint?: string
  cells: Record<LineupColumnKey, string>
}

export type LineupColumnMeta = {
  title: string
  subtitle: string
  cta: string
  href: string
  highlight?: boolean
}

const IMC_STANDARD = 'IMC 307.2.3'
const IMC_COMBO = 'IMC 307.2.5, 307.2.2, 307.2.1.1, 307.2.3'

export const LINEUP_COMPARISON_ROWS: LineupRow[] = [
  {
    id: 'role',
    label: 'Best for',
    cells: {
      standard: 'Local overflow protection without Wi‑Fi',
      wifi: 'Protection plus remote monitoring and contractor alerts',
      combo: 'Permanent drain access and Sensor protection on one bayonet workflow',
    },
  },
  {
    id: 'wifi',
    label: 'Wi‑Fi / connectivity',
    hint: 'WiFi Sensor requires a 2.4 GHz network; 5 GHz is not supported.',
    cells: {
      standard: 'Not required — fully local',
      wifi: '2.4 GHz Wi‑Fi for dashboard and alerts (5 GHz not supported)',
      combo: 'Wi‑Fi only if you choose WiFi Sensor; Standard Sensor stays local',
    },
  },
  {
    id: 'alerts',
    label: 'Remote service alerts',
    hint: 'WiFi model: alerts roughly between fifty and ninety percent fill; shutdown near ninety-five percent.',
    cells: {
      standard: '—',
      wifi: 'Contractor app, email, and SMS — roughly 50–79% fill band',
      combo: 'Same as WiFi path when a WiFi Sensor is in the bundle',
    },
  },
  {
    id: 'shutdown',
    label: 'Protective AC shutoff',
    cells: {
      standard: 'Automatic near ~80% water in the T‑manifold',
      wifi: 'Automatic near ~80% water in the T‑manifold',
      combo: 'Same ~80% shutdown via the Sensor in the bundle',
    },
  },
  {
    id: 'power',
    label: 'Power',
    hint: 'WiFi Sensor: 24V HVAC is strongly recommended for reliable LEDs and operation; battery-only is supported with limited LED visibility.',
    cells: {
      standard: 'Wired power for local sensing and shutdown (no Wi‑Fi)',
      wifi: '24V HVAC strongly recommended; battery backup supported (LED visibility varies on battery only)',
      combo: 'Matches the Sensor model in your bundle',
    },
  },
  {
    id: 'mini-access',
    label: 'Mini maintenance access',
    cells: {
      standard: 'Optional — add Mini on the line separately if desired',
      wifi: 'Optional — add Mini on the line separately if desired',
      combo: 'Included — Mini stays on the drain line for flush, air, and vacuum',
    },
  },
  {
    id: 'install',
    label: 'Typical install time',
    cells: {
      standard: 'About 15 minutes',
      wifi: 'About 15 minutes',
      combo: 'About 45 minutes total (coordinated Mini + Sensor)',
    },
  },
  {
    id: 'imc',
    label: 'IMC references (examples)',
    hint: 'Examples cited on this site; verify with your AHJ.',
    cells: {
      standard: IMC_STANDARD,
      wifi: IMC_STANDARD,
      combo: IMC_COMBO,
    },
  },
]

export const LINEUP_COLUMN_META: Record<LineupColumnKey, LineupColumnMeta> = {
  standard: {
    title: SENSOR_STANDARD_SHORT,
    subtitle: 'Non‑WiFi overflow protection',
    cta: 'View Standard variant',
    href: '/products/sensor#sensor-variant-standard',
  },
  wifi: {
    title: SENSOR_WIFI_SHORT,
    subtitle: 'Adds monitoring on 2.4 GHz Wi‑Fi',
    cta: 'View WiFi variant',
    href: '/products/sensor#sensor-variant-wifi',
    highlight: true,
  },
  combo: {
    title: PRODUCT_NAMES.bundle,
    subtitle: 'Permanent access + Sensor on one bayonet workflow',
    cta: 'View bundle',
    href: '/products/combo',
  },
}

export const LINEUP_COLUMN_ORDER: LineupColumnKey[] = ['standard', 'wifi', 'combo']
