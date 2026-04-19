import type { Hotspot } from './ProductHotspots'

/**
 * Hotspot positions for the AC Drain Wiz Mini product image
 * (public/images/acdw-mini-product-parts.png).
 *
 * xPct/yPct are percentages of the rendered image box. Positions were
 * calibrated against the live image via the `?calibrate=hotspots` dev
 * overlay. Re-run that flow if the image ever changes.
 *
 * Copy derives from src/config/acdwKnowledge.ts and existing Mini product
 * data on ProductsPage.tsx. No invented specs, per acdw-knowledge rule.
 */
export const miniHotspots: Hotspot[] = [
  {
    id: 'bayonet-port',
    label: 'Snap-to-lock bayonet port',
    description:
      'Every service connects here — flush, air, vacuum, or a Sensor Switch. Quarter-turn in, quarter-turn out, perfect seal every time.',
    xPct: 42.7,
    yPct: 50.2,
    align: 'right',
  },
  {
    id: 'bidirectional-valve',
    label: 'Bi-directional valve',
    description:
      'One valve, two directions. Push water out to flush or pull debris in with a vacuum — without swapping any fittings.',
    xPct: 42.8,
    yPct: 65.1,
    align: 'right',
  },
  {
    id: 'clear-body',
    label: 'Transparent T-manifold',
    description:
      'See inside the line at a glance. Confirm a clean flush, spot biofilm early, and catch rising water before it backs up.',
    xPct: 25.9,
    yPct: 76.7,
    align: 'left',
  },
  {
    id: 'pvc-connection',
    label: '3/4" PVC connection',
    description:
      'Installs once, serves the life of the system. Fits standard 3/4" PVC residential condensate lines.',
    xPct: 6.4,
    yPct: 66.4,
    align: 'left',
  },
  {
    id: 'service-attachments',
    label: 'Flush · Air · Vacuum attachments',
    description:
      'Swap between water, air, and vacuum on the same port. Never cut PVC for service again.',
    xPct: 85.5,
    yPct: 35,
    align: 'left',
  },
]
