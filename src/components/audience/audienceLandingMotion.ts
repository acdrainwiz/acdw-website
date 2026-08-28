import { useEffect, useState } from 'react'
import { useReducedMotion, type Variants } from 'framer-motion'

export const AUDIENCE_MH_EASE = [0.16, 1, 0.3, 1] as const
export const AUDIENCE_MH_VIEWPORT = {
  once: true,
  amount: 0.22,
  margin: '-96px 0px -148px 0px',
} as const

/** Sequential spotlight used on Mini How It Works (`data-mini-how-step-pulse`). */
export function useMiniHowStepPulse(count: number) {
  const reduceMotion = useReducedMotion()
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    if (reduceMotion || count <= 1) return undefined
    let intervalId: ReturnType<typeof setInterval> | undefined

    const start = () => {
      intervalId = setInterval(() => {
        setPulse((i) => (i + 1) % count)
      }, 3600)
    }

    start()

    const onVis = () => {
      if (intervalId) clearInterval(intervalId)
      intervalId = undefined
      if (!document.hidden) start()
    }

    document.addEventListener('visibilitychange', onVis)
    return () => {
      if (intervalId) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduceMotion, count])

  return (index: number) =>
    reduceMotion || count <= 1 ? undefined : (index - pulse + count) % count
}

export function useAudienceLandingMotion() {
  const reduceMotion = useReducedMotion()
  const tr = (dur: number, delay = 0) =>
    reduceMotion
      ? ({ duration: 0.22 } as const)
      : ({ duration: dur, delay, ease: AUDIENCE_MH_EASE } as const)

  const stepContainer: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0, delayChildren: 0 },
        },
      }
    : {
        hidden: { opacity: 0, y: 36 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.75,
            ease: AUDIENCE_MH_EASE,
            staggerChildren: 0.12,
            delayChildren: 0.05,
            when: 'beforeChildren',
          },
        },
      }

  const stepBadgeVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, scale: 1 }, visible: { opacity: 1, scale: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.45 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { type: 'spring', stiffness: 400, damping: 26 },
        },
      }

  const stepIconVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0, rotate: 0 }, visible: { opacity: 1, y: 0, rotate: 0 } }
    : {
        hidden: { opacity: 0, y: 22, rotate: -8 },
        visible: {
          opacity: 1,
          y: 0,
          rotate: 0,
          transition: { duration: 0.78, ease: AUDIENCE_MH_EASE },
        },
      }

  const stepChild: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.62, ease: AUDIENCE_MH_EASE },
        },
      }

  return {
    reduceMotion,
    tr,
    stepContainer,
    stepBadgeVariants,
    stepIconVariants,
    stepChild,
    mhViewport: AUDIENCE_MH_VIEWPORT,
  }
}
