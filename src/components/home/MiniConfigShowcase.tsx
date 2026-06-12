import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MINI_MARQUEE_SLIDES } from '../../config/miniConfigSlides'
import { cn } from '@/lib/utils'

export type MiniConfigShowcaseProps = {
  calibrateHotspots?: boolean
}

const MARQUEE_SLIDES = [...MINI_MARQUEE_SLIDES, ...MINI_MARQUEE_SLIDES]
const MARQUEE_DURATION_S = 44
const RESUME_AFTER_MS = 10_000

function getTranslateX(el: HTMLElement): number {
  const matrix = new DOMMatrixReadOnly(window.getComputedStyle(el).transform)
  return matrix.m41
}

export function MiniConfigShowcase(_props: MiniConfigShowcaseProps) {
  const reduceMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  const resumeMarquee = useCallback(() => {
    const track = trackRef.current
    if (!track || reduceMotion) return

    const half = track.scrollWidth / 2
    let x = getTranslateX(track)

    while (x > 0) x -= half
    while (x < -half) x += half

    const progress = (x + half) / half
    const elapsed = progress * MARQUEE_DURATION_S

    track.style.transition = ''
    track.style.animation = 'none'
    void track.offsetHeight
    track.style.transform = ''
    track.style.animation = `mini-config-marquee-ltr ${MARQUEE_DURATION_S}s linear infinite`
    track.style.animationDelay = `-${elapsed}s`

    setFocusedIndex(null)
    clearResumeTimer()
  }, [clearResumeTimer, reduceMotion])

  const focusSlide = useCallback(
    (index: number) => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return

      clearResumeTimer()

      if (reduceMotion) {
        itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
        setFocusedIndex(index)
        resumeTimerRef.current = window.setTimeout(() => setFocusedIndex(null), RESUME_AFTER_MS)
        return
      }

      const item = itemRefs.current[index]
      if (!item) return

      const currentX = getTranslateX(track)
      track.style.animation = 'none'
      track.style.transform = `translate3d(${currentX}px, 0, 0)`

      const viewportCenter = viewport.clientWidth / 2
      const targetX = viewportCenter - (item.offsetLeft + item.offsetWidth / 2)

      track.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
      requestAnimationFrame(() => {
        track.style.transform = `translate3d(${targetX}px, 0, 0)`
      })

      setFocusedIndex(index)

      resumeTimerRef.current = window.setTimeout(() => {
        resumeMarquee()
      }, RESUME_AFTER_MS)
    },
    [clearResumeTimer, reduceMotion, resumeMarquee]
  )

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer])

  return (
    <div className="mini-config-showcase mini-config-showcase--marquee">
      <div className="mini-config-marquee-controls">
        <div
          className="mini-config-showcase-pills"
          role="group"
          aria-label="Focus a Mini configuration"
        >
          {MINI_MARQUEE_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={cn(
                'mini-config-showcase-pill',
                focusedIndex === index && 'mini-config-showcase-pill-active'
              )}
              aria-pressed={focusedIndex === index}
              onClick={() => focusSlide(index)}
            >
              {slide.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="mini-config-marquee-viewport"
        aria-label="AC Drain Wiz Mini bayonet configurations scrolling showcase"
      >
        <div
          ref={trackRef}
          className={cn(
            'mini-config-marquee-track',
            reduceMotion && 'mini-config-marquee-track--reduced-motion',
            focusedIndex !== null && 'mini-config-marquee-track--focused'
          )}
        >
          {MARQUEE_SLIDES.map((slide, index) => {
            const setIndex = index % MINI_MARQUEE_SLIDES.length
            const isFirstSet = index < MINI_MARQUEE_SLIDES.length

            return (
              <figure
                key={`${slide.id}-${index}`}
                ref={(el) => {
                  if (isFirstSet) itemRefs.current[setIndex] = el
                }}
                className={cn(
                  'mini-config-marquee-item',
                  focusedIndex === setIndex && 'mini-config-marquee-item--focused'
                )}
                aria-hidden={index >= MINI_MARQUEE_SLIDES.length}
              >
                <div className="mini-config-marquee-item-media">
                  <img
                    src={slide.src}
                    alt={index < MINI_MARQUEE_SLIDES.length ? slide.alt : ''}
                    className="mini-config-marquee-img"
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <figcaption className="mini-config-marquee-caption-wrap">
                  <span className="mini-config-marquee-label">{slide.label}</span>
                  <span className="mini-config-marquee-caption">{slide.caption}</span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </div>
  )
}
