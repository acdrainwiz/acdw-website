import { useReducedMotion } from 'framer-motion'

/** Shared scroll choreography for `/products/mini` and related sections. */
export const MINI_PAGE_SCROLL_EASE = [0.16, 1, 0.3, 1] as const

export const MINI_PAGE_SCROLL_VIEWPORT = {
  once: true,
  amount: 0.22,
  margin: '-96px 0px -148px 0px',
} as const

export function useMiniPageScrollMotion() {
  const reduceMotion = useReducedMotion()

  const tr = (dur: number, delay = 0) =>
    reduceMotion
      ? ({ duration: 0.22 } as const)
      : ({ duration: dur, delay, ease: MINI_PAGE_SCROLL_EASE } as const)

  return {
    reduceMotion: !!reduceMotion,
    tr,
    viewport: MINI_PAGE_SCROLL_VIEWPORT,
    ease: MINI_PAGE_SCROLL_EASE,
  }
}
