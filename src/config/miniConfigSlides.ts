/**
 * AC Drain Wiz Mini configuration content for the home page.
 * Slider: four bayonet attachments in display order.
 * Anatomy: full-stack interactive diagram (separate section below the card).
 */

/** Slide transition presets for the home Mini configuration slider. */
export type MiniConfigSliderTransition = 'slide-soft' | 'slide' | 'fade'

/**
 * Active transition for `MiniConfigShowcase`.
 * - `slide-soft` — gentle horizontal drift + fade (default)
 * - `slide` — full horizontal slide
 * - `fade` — crossfade only
 */
export const MINI_CONFIG_SLIDER_TRANSITION: MiniConfigSliderTransition = 'slide-soft'

/** Auto-advance interval — 6s fits label + caption reading time without feeling sluggish. */
export const MINI_CONFIG_SLIDER_AUTO_MS = 6_000

/** Idle time after manual navigation before auto-advance resumes. */
export const MINI_CONFIG_SLIDER_AUTO_RESUME_MS = 10_000
export type MiniConfigSlide = {
  id: string
  src: string
  alt: string
  label: string
  caption: string
  hasHotspots?: boolean
}

/** Home Mini slider — four configurations in display order. */
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
