import {
  SENSOR_STANDARD_DISPLAY,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_DISPLAY,
  SENSOR_WIFI_SHORT,
} from '@/config/acdwKnowledge'

/** Protective shutdown level — matches product copy sitewide and gauge geometry. */
export const SENSOR_PROTECTION_SHUTDOWN_PCT = 80 as const

/**
 * Configuration for the Sensor water-level gauge demo on the Products page.
 *
 * All copy derives from acdwKnowledge.ts and the acdw-knowledge rule:
 *  - Standard Sensor Switch (Non-WiFi): local overflow protection, green LED
 *    in normal operation, solid red LED at ~80% protective shutdown.
 *  - WiFi Sensor Switch: adds service alerts between 50–79% fill (via the
 *    contractor app / email / SMS on 2.4 GHz Wi-Fi). Shutdown at ~80%.
 *
 * We do not invent LED states. Per the KB, there is no distinct "alert" LED —
 * between 50–79% the LED remains green and an alert is dispatched through the
 * monitoring platform. The gauge reflects that: LED stays green in the
 * alert band and an accompanying badge indicates the remote alert.
 */

export type GaugeVariantId = 'standard' | 'wifi'

export type GaugeStateKey = 'monitoring' | 'alert' | 'shutdown'

export type GaugeLedColor = 'green' | 'red'

export type GaugeState = {
  /** Short status label, ~3 words. */
  label: string
  /** Second line of supporting copy. */
  sublabel: string
  ledColor: GaugeLedColor
  /** When true, the LED has a subtle breathing pulse; false = solid. */
  ledPulse: boolean
  /** Optional badge text (e.g. "Alert sent to contractor app"). */
  badge?: string
}

export type GaugeThresholdTone = 'normal' | 'warn' | 'critical'

export type GaugeThreshold = {
  /** Level percentage (0–100). */
  pct: number
  /** Short label shown next to the tick. */
  label: string
  tone: GaugeThresholdTone
}

export type GaugeCycle = {
  /** Water-level keyframes, 0–100. The animation loops through these. */
  keyframes: number[]
  /** Normalized 0–1 time positions for each keyframe. Length must match keyframes. */
  times: number[]
  durationSec: number
}

export type GaugeVariantConfig = {
  id: GaugeVariantId
  /** Full display name (e.g. "WiFi Sensor Switch"). */
  displayName: string
  /** Short label for tabs (e.g. "WiFi"). */
  tabLabel: string
  /** One-line summary shown under the gauge for this variant. */
  summary: string
  shutdownPct: number
  alertRangeStart?: number
  alertRangeEnd?: number
  thresholds: GaugeThreshold[]
  states: Record<GaugeStateKey, GaugeState>
  cycle: GaugeCycle
}

const STANDARD_CONFIG: GaugeVariantConfig = {
  id: 'standard',
  displayName: SENSOR_STANDARD_DISPLAY,
  tabLabel: SENSOR_STANDARD_SHORT,
  summary:
    'Capacitive sensing on the condensate line with automatic AC shutdown at ~80%. No Wi-Fi required.',
  shutdownPct: SENSOR_PROTECTION_SHUTDOWN_PCT,
  thresholds: [{ pct: SENSOR_PROTECTION_SHUTDOWN_PCT, label: 'Protective shutdown', tone: 'critical' }],
  states: {
    monitoring: {
      label: 'Normal monitoring',
      sublabel: 'All clear · LED solid green',
      ledColor: 'green',
      ledPulse: true,
    },
    // No alert state for Standard — it has no remote alerting path.
    // Kept in the union for typing but unreachable via getStateFromLevel.
    alert: {
      label: 'Normal monitoring',
      sublabel: 'All clear · LED solid green',
      ledColor: 'green',
      ledPulse: true,
    },
    shutdown: {
      label: 'Protective AC shutdown',
      sublabel: 'AC disabled at ~80% · LED solid red',
      ledColor: 'red',
      ledPulse: false,
    },
  },
  cycle: {
    // Rise to shutdown at 80% and reset. Demo never exceeds 80%.
    keyframes: [0, 15, 55, 72, 80, 80, 0],
    times: [0, 0.08, 0.28, 0.5, 0.65, 0.85, 1],
    durationSec: 11,
  },
}

const WIFI_ALERT_RANGE_END = SENSOR_PROTECTION_SHUTDOWN_PCT - 1

const WIFI_CONFIG: GaugeVariantConfig = {
  id: 'wifi',
  displayName: SENSOR_WIFI_DISPLAY,
  tabLabel: SENSOR_WIFI_SHORT,
  summary:
    'Adds remote monitoring and service alerts between 50–79% fill on 2.4 GHz Wi-Fi. Shutdown at ~80%.',
  shutdownPct: SENSOR_PROTECTION_SHUTDOWN_PCT,
  alertRangeStart: 50,
  alertRangeEnd: WIFI_ALERT_RANGE_END,
  thresholds: [
    { pct: 50, label: 'Alert band begins', tone: 'warn' },
    { pct: SENSOR_PROTECTION_SHUTDOWN_PCT, label: 'Protective shutdown', tone: 'critical' },
  ],
  states: {
    monitoring: {
      label: 'Normal monitoring',
      sublabel: 'All clear · LED solid green',
      ledColor: 'green',
      ledPulse: true,
    },
    alert: {
      label: 'Service alert sent',
      sublabel: 'Contractor notified via app, email, and SMS · LED solid green',
      ledColor: 'green',
      ledPulse: true,
      badge: 'Alert sent to contractor',
    },
    shutdown: {
      label: 'Protective AC shutdown',
      sublabel: 'AC disabled at ~80% · LED solid red',
      ledColor: 'red',
      ledPulse: false,
    },
  },
  cycle: {
    // Linger below 80% so alert copy is readable, then hold at shutdown. Never above 80%.
    keyframes: [0, 15, 55, 68, 76, 78, 80, 80, 0],
    times: [0, 0.07, 0.22, 0.36, 0.5, 0.6, 0.72, 0.88, 1],
    durationSec: 13,
  },
}

export const GAUGE_VARIANTS: Record<GaugeVariantId, GaugeVariantConfig> = {
  standard: STANDARD_CONFIG,
  wifi: WIFI_CONFIG,
}

export const GAUGE_VARIANT_IDS: readonly GaugeVariantId[] = ['standard', 'wifi'] as const

/**
 * Map a current water level to the active state key for a given variant.
 * Kept pure so the same logic can drive both the gauge and its aria-live readout.
 */
export function getStateFromLevel(
  level: number,
  variant: GaugeVariantConfig
): GaugeStateKey {
  if (level >= variant.shutdownPct) return 'shutdown'
  if (
    variant.alertRangeStart !== undefined &&
    variant.alertRangeEnd !== undefined &&
    level >= variant.alertRangeStart &&
    level <= variant.alertRangeEnd
  ) {
    return 'alert'
  }
  return 'monitoring'
}
