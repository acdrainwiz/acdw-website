import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {
  MINI_CONFIG_SLIDER_AUTO_MS,
  MINI_CONFIG_SLIDER_AUTO_RESUME_MS,
  MINI_CONFIG_SLIDER_TRANSITION,
  MINI_MARQUEE_SLIDES,
  type MiniConfigSliderTransition,
} from '../../config/miniConfigSlides'
import { cn } from '@/lib/utils'

export type MiniConfigShowcaseProps = {
  calibrateHotspots?: boolean
}

const SLIDES = MINI_MARQUEE_SLIDES
const SLIDE_COUNT = SLIDES.length

function wrapIndex(index: number): number {
  return ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT
}

function getDirection(from: number, to: number): 1 | -1 {
  if (from === to) return 1
  const forward = (to - from + SLIDE_COUNT) % SLIDE_COUNT
  const backward = (from - to + SLIDE_COUNT) % SLIDE_COUNT
  return forward <= backward ? 1 : -1
}

function getMotionTransition(
  mode: MiniConfigSliderTransition,
  reduceMotion: boolean | null
): Transition {
  if (reduceMotion) return { duration: 0.01 }

  switch (mode) {
    case 'fade':
      return { duration: 0.42, ease: [0.4, 0, 0.2, 1] }
    case 'slide':
      return { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    case 'slide-soft':
    default:
      return { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
}

function getSlideVariants(
  mode: MiniConfigSliderTransition,
  reduceMotion: boolean | null
): Variants {
  if (reduceMotion) {
    return {
      enter: { opacity: 1 },
      center: { opacity: 1 },
      exit: { opacity: 1 },
    }
  }

  switch (mode) {
    case 'fade':
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    case 'slide':
      return {
        enter: (direction: number) => ({
          x: direction > 0 ? '100%' : '-100%',
          opacity: 1,
        }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({
          x: direction > 0 ? '-100%' : '100%',
          opacity: 1,
        }),
      }
    case 'slide-soft':
    default:
      return {
        enter: (direction: number) => ({
          x: direction > 0 ? 56 : -56,
          opacity: 0,
          scale: 0.985,
        }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (direction: number) => ({
          x: direction > 0 ? -36 : 36,
          opacity: 0,
          scale: 0.985,
        }),
      }
  }
}

export function MiniConfigShowcase(_props: MiniConfigShowcaseProps) {
  const reduceMotion = useReducedMotion()
  const transitionMode = MINI_CONFIG_SLIDER_TRANSITION
  const showcaseRef = useRef<HTMLDivElement>(null)
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const slide = SLIDES[activeIndex]
  const slideVariants = getSlideVariants(transitionMode, reduceMotion)
  const slideTransition = getMotionTransition(transitionMode, reduceMotion)
  const presenceMode = transitionMode === 'fade' ? undefined : 'wait'

  const clearAutoInterval = useCallback(() => {
    if (autoIntervalRef.current) {
      window.clearInterval(autoIntervalRef.current)
      autoIntervalRef.current = null
    }
  }, [])

  const clearResumeTimeout = useCallback(() => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
  }, [])

  const advanceAuto = useCallback(() => {
    if (document.hidden) return
    setDirection(1)
    setActiveIndex((current) => wrapIndex(current + 1))
  }, [])

  const startAutoAdvance = useCallback(() => {
    if (reduceMotion) return
    clearAutoInterval()
    autoIntervalRef.current = window.setInterval(advanceAuto, MINI_CONFIG_SLIDER_AUTO_MS)
  }, [advanceAuto, clearAutoInterval, reduceMotion])

  const pauseAutoAdvance = useCallback(() => {
    if (reduceMotion) return
    clearAutoInterval()
    clearResumeTimeout()
    resumeTimeoutRef.current = window.setTimeout(() => {
      resumeTimeoutRef.current = null
      startAutoAdvance()
    }, MINI_CONFIG_SLIDER_AUTO_RESUME_MS)
  }, [clearAutoInterval, clearResumeTimeout, reduceMotion, startAutoAdvance])

  const goTo = useCallback(
    (index: number) => {
      pauseAutoAdvance()
      setActiveIndex((current) => {
        const next = wrapIndex(index)
        if (next === current) return current
        setDirection(getDirection(current, next))
        return next
      })
    },
    [pauseAutoAdvance]
  )

  const goPrev = useCallback(() => {
    pauseAutoAdvance()
    setDirection(-1)
    setActiveIndex((current) => wrapIndex(current - 1))
  }, [pauseAutoAdvance])

  const goNext = useCallback(() => {
    pauseAutoAdvance()
    setDirection(1)
    setActiveIndex((current) => wrapIndex(current + 1))
  }, [pauseAutoAdvance])

  useEffect(() => {
    startAutoAdvance()
    return () => {
      clearAutoInterval()
      clearResumeTimeout()
    }
  }, [clearAutoInterval, clearResumeTimeout, startAutoAdvance])

  useEffect(() => {
    if (reduceMotion) {
      clearAutoInterval()
      clearResumeTimeout()
    }
  }, [clearAutoInterval, clearResumeTimeout, reduceMotion])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        clearAutoInterval()
        return
      }
      if (!resumeTimeoutRef.current) {
        startAutoAdvance()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [clearAutoInterval, startAutoAdvance])

  useEffect(() => {
    const root = showcaseRef.current
    if (!root) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (!root.contains(document.activeElement)) return

      event.preventDefault()
      if (event.key === 'ArrowLeft') goPrev()
      else goNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev])

  return (
    <div ref={showcaseRef} className="mini-config-showcase mini-config-showcase--slider">
      <div className="mini-config-showcase-controls">
        <div
          className="mini-config-showcase-pills"
          role="tablist"
          aria-label="Mini configuration quick select"
        >
          {SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`mini-config-tab-${item.id}`}
              aria-selected={activeIndex === index}
              aria-controls={`mini-config-panel-${item.id}`}
              className={cn(
                'mini-config-showcase-pill',
                activeIndex === index && 'mini-config-showcase-pill-active'
              )}
              onClick={() => goTo(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mini-config-showcase-media"
        role="region"
        aria-roledescription="carousel"
        aria-label="AC Drain Wiz Mini bayonet configurations"
      >
        <button
          type="button"
          className="mini-config-showcase-nav mini-config-showcase-nav-prev"
          aria-label="Previous configuration"
          onClick={goPrev}
        >
          <ChevronLeftIcon className="mini-config-showcase-nav-icon" aria-hidden />
        </button>

        <div className="mini-config-showcase-stage">
          <AnimatePresence initial={false} custom={direction} mode={presenceMode}>
            <motion.figure
              key={slide.id}
              id={`mini-config-panel-${slide.id}`}
              role="tabpanel"
              aria-labelledby={`mini-config-tab-${slide.id}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="mini-config-showcase-slide"
            >
              <div className="mini-config-showcase-slide-media">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="mini-config-showcase-img"
                  loading={activeIndex <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </div>
              <figcaption className="mini-config-showcase-slide-caption">
                <span className="mini-config-showcase-slide-label">{slide.label}</span>
                <span className="mini-config-showcase-slide-caption-text">{slide.caption}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="mini-config-showcase-nav mini-config-showcase-nav-next"
          aria-label="Next configuration"
          onClick={goNext}
        >
          <ChevronRightIcon className="mini-config-showcase-nav-icon" aria-hidden />
        </button>
      </div>

      <div className="mini-config-showcase-dots" role="tablist" aria-label="Configuration slides">
        {SLIDES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`${item.label}: ${item.caption}`}
            className={cn(
              'mini-config-showcase-dot',
              activeIndex === index && 'mini-config-showcase-dot-active'
            )}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
