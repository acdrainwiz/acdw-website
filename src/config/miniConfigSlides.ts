/**
 * AC Drain Wiz Mini configuration content for the home page.
 * Marquee: four bayonet attachments in display order.
 * Anatomy: full-stack interactive diagram (separate section below the card).
 */
export type MiniConfigSlide = {
  id: string
  src: string
  alt: string
  label: string
  caption: string
  hasHotspots?: boolean
}

/** Continuous marquee — four configurations, left-to-right. */
export const MINI_MARQUEE_SLIDES: MiniConfigSlide[] = [
  {
    id: 'storage-cap',
    src: '/images/acdw-mini-hero-cap.png',
    alt: 'AC Drain Wiz Mini with storage cap on the bayonet port',
    label: 'Storage Cap',
    caption: 'Seal the port between visits.',
  },
  {
    id: 'bi-directional-valve',
    src: '/images/acdw-mini-hero-bi-directional.png',
    alt: 'AC Drain Wiz Mini with bi-directional valve for flush and vacuum service',
    label: 'Bi-directional Valve',
    caption: 'Push water out or pull sludge in—one valve.',
  },
  {
    id: 'water-hose-adapter',
    src: '/images/acdw-mini-hero-background.png',
    alt: 'AC Drain Wiz Mini with water hose adapter on a condensate drain line, held by a gloved hand',
    label: 'Water Hose Adapter',
    caption: 'Flush the line without opening PVC.',
  },
  {
    id: 'schrader-air-adapter',
    src: '/images/acdw-mini-hero-schrader.png',
    alt: 'AC Drain Wiz Mini with Schrader air adapter on the bayonet port',
    label: 'Schrader Air Adapter',
    caption: 'Break stubborn clogs with compressed air.',
  },
]

/** Full-stack anatomy diagram — featured below the marquee card. */
export const MINI_ANATOMY: MiniConfigSlide = {
  id: 'full-stack',
  src: '/images/acdw-mini-hero-full-stack.png',
  alt: 'AC Drain Wiz Mini full vertically stacked components on a transparent T-manifold',
  label: 'Anatomy',
  caption: 'Tap a dot to explore every part of the stack.',
  hasHotspots: true,
}

/** @deprecated Use MINI_MARQUEE_SLIDES + MINI_ANATOMY */
export const MINI_CONFIG_SLIDES: MiniConfigSlide[] = [...MINI_MARQUEE_SLIDES, MINI_ANATOMY]
