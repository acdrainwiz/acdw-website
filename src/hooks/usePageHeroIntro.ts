import { useMemo } from 'react'
import { useReducedMotion, type Variants } from 'framer-motion'

/**
 * Shared hero intro motion — stagger + fade-up with prefers-reduced-motion fallbacks.
 */

export function usePageHeroIntro() {
  const reduceMotion = useReducedMotion()

  return useMemo(() => {
    const easeOut = [0.22, 1, 0.36, 1] as const

    const fadeUp: Variants = reduceMotion
      ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.35 } } }
      : {
          hidden: { opacity: 0, y: 18 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: easeOut },
          },
        }

    const introStagger: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.09,
          delayChildren: reduceMotion ? 0 : 0.14,
        },
      },
    }

    return { introStagger, fadeUp }
  }, [reduceMotion])
}
