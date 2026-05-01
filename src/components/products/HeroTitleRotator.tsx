import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export interface HeroTitleRotatorProps {
  /** Lines to cycle through (shown one at a time as the page H1). */
  titles: string[]
  /** Stable id for aria-labelledby on the hero region. */
  headingId: string
  /** Advance interval in ms when motion is allowed. */
  intervalMs?: number
}

export function HeroTitleRotator({
  titles,
  headingId,
  intervalMs = 5200,
}: HeroTitleRotatorProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || titles.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % titles.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, reduceMotion, titles.length])

  if (!titles.length) {
    return null
  }

  if (reduceMotion || titles.length === 1) {
    return (
      <h1
        id={headingId}
        className="mini-hero-v2-title-slot mini-hero-v2-title-slot--static"
      >
        {titles[0]}
      </h1>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.h1
        key={index}
        id={headingId}
        className="mini-hero-v2-title-slot"
        initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {titles[index]}
      </motion.h1>
    </AnimatePresence>
  )
}
