import type { Hotspot } from './ProductHotspots'

/**
 * Hotspot positions for the AC Drain Wiz Mini full-stack studio image
 * (public/images/acdw-mini-hero-full-stack.png).
 *
 * xPct/yPct are percentages of the rendered image box. Positions were
 * Dev calibration (home page anatomy band):
 *   1. Run `npm run dev`
 *   2. Open `http://localhost:5173/?calibrate=hotspots` (scrolls to diagram)
 *   3. Drag fuchsia dots · Copy JSON from toolbar · paste xPct/yPct here
 *
 * Copy derives from miniHotspots.ts and acdwKnowledge — no invented specs.
 */
export const miniFullStackHotspots: Hotspot[] = [
  {
    id: 'storage-cap',
    label: 'Storage cap',
    description:
      'Quarter-turn cap seals the bayonet port between service visits—keeps the line closed when no attachment is connected.',
    xPct: 41.1,
    yPct: 61.4,
    align: 'bottom',
  },
  {
    id: 'bayonet-port',
    label: 'Snap-to-lock bayonet port',
    description:
      'Every service connects here — flush, air, vacuum, or a Sensor Switch. Quarter-turn in, quarter-turn out, perfect seal every time.',
    xPct: 59.3,
    yPct: 75.1,
    align: 'right',
  },
  {
    id: 'bidirectional-valve',
    label: 'Bi-directional valve',
    description:
      'One valve, two directions. Push water out to flush or pull debris in with a vacuum — without swapping any fittings.',
    xPct: 59.4,
    yPct: 46.2,
    align: 'right',
  },
  {
    id: 'clear-body',
    label: 'Transparent T-manifold',
    description:
      'See inside the line at a glance. Confirm a clean flush, spot biofilm early, and catch rising water before it backs up.',
    xPct: 59.6,
    yPct: 86.7,
    align: 'right',
  },
  {
    id: 'pvc-connection',
    label: '3/4" PVC connection',
    description:
      'Solvent-weld into standard 3/4" PVC once. Permanent access to the condensate line for the life of the system.',
    xPct: 26,
    yPct: 84.3,
    align: 'right',
  },
  {
    id: 'water-hose-adapter',
    label: 'Water hose adapter',
    description:
      'Connect a garden hose on the bayonet port to flush the condensate line through the Mini—without opening or cutting PVC.',
    xPct: 38.1,
    yPct: 29.9,
    align: 'left',
  },
  {
    id: 'schrader-air-adapter',
    label: 'Schrader air adapter',
    description:
      'Connect compressed air on the same port to blow out stubborn clogs and push debris through the line.',
    xPct: 59.7,
    yPct: 12.3,
    align: 'bottom',
  },
]
