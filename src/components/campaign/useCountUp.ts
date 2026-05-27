import { useEffect, useState } from 'react'

/**
 * Animates a number from 0 → target when `active` becomes true.
 * Respects prefers-reduced-motion (jumps to target immediately).
 */
export function useCountUp(target: number, active: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return
    }

    if (target <= 0) {
      setValue(0)
      return
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setValue(target)
      return
    }

    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active, durationMs])

  return value
}
