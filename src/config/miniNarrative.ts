/**
 * Mini narrative zones — edit copy here first; pages import, never invent inline.
 *
 * Zone ownership:
 * - problem / mechanism / outcome → home only (miniHomeCopy, miniConfigSlides)
 * - proof → shared anatomy band (miniAnatomyStory + context patches below)
 * - process / contrast → product page sections
 */
import { MINI_HOME_INTRO, MINI_HOME_CARD } from './miniHomeCopy'
import {
  MINI_ANATOMY_INTRO,
  MINI_ANATOMY_STORY_BEATS,
  type MiniAnatomyStoryBeat,
} from './miniAnatomyStory'

export type MiniPageContext = 'home' | 'product'

export const MINI_NARRATIVE_ZONES = {
  problem: MINI_HOME_INTRO.subtitle,
  mechanism: 'Home marquee — see miniConfigSlides.ts (MINI_MARQUEE_SLIDES)',
  outcome: MINI_HOME_CARD.body,
  proof: MINI_ANATOMY_INTRO,
  process: {
    eyebrow: 'How it installs',
    title: 'Install once. Inspect anytime. Clean in seconds.',
    dek: 'No cutting required for maintenance — ever.',
    /** Hidden legacy subtitle for `.product-how-it-works-subtitle` (Mini page CSS) */
    legacySubtitle: 'Install once. Inspect anytime. Clean in seconds — no cutting required.',
  },
  contrast: {
    eyebrow: 'Why the Mini',
    title: 'The old way vs. the Mini',
  },
} as const

/** Product hero — pain + promise only; part-level detail lives in anatomy band. */
export const MINI_PRODUCT_HERO = {
  subtitle:
    'AC drain clogs cause thousands in water damage. Install permanent access on standard 3/4" PVC in about five minutes—then service the line without cutting pipe again.',
} as const

/** Product how-it-works — process verbs only; anatomy band owns part descriptions. */
export const MINI_PRODUCT_HOW_STEPS = [
  {
    number: 1,
    title: 'Install in 5 minutes',
    description:
      'Solvent-weld once on standard 3/4" PVC. Cut the line at install—never for maintenance again.',
  },
  {
    number: 2,
    title: 'Inspect anytime',
    description: 'Use the clear manifold to verify the line before or after service.',
  },
  {
    number: 3,
    title: 'Clean when needed',
    description: 'Swap attachments on the bayonet port when the line needs attention.',
  },
] as const

const ANATOMY_BEAT_PATCHES: Record<MiniPageContext, Partial<Record<string, string>>> = {
  home: {},
  product: {
    'schrader-air':
      'Connect compressed air on the bayonet port to break stubborn clogs—the same quarter-turn swap you use for every attachment.',
  },
}

const ANATOMY_BRIDGE: Record<MiniPageContext, string> = {
  home: MINI_ANATOMY_INTRO.bridge,
  product: 'Tap a hotspot to explore each part of the stack.',
}

export function getMiniAnatomyBridge(context: MiniPageContext): string {
  return ANATOMY_BRIDGE[context]
}

export function getMiniAnatomyBeats(context: MiniPageContext): MiniAnatomyStoryBeat[] {
  const patches = ANATOMY_BEAT_PATCHES[context]
  return MINI_ANATOMY_STORY_BEATS.map((beat) => ({
    ...beat,
    description: patches[beat.id] ?? beat.description,
  }))
}

export function getMiniAnatomyHeadingId(context: MiniPageContext): string {
  return context === 'product' ? 'mini-product-anatomy-heading' : 'mini-anatomy-heading'
}

export function getMiniAnatomyHotspotsId(context: MiniPageContext): string {
  return context === 'product' ? 'mini-product-anatomy-hotspots' : 'mini-anatomy-hotspots'
}
