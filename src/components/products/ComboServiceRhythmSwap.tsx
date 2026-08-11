import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'
import {
  COMBO_SERVICE_RHYTHM,
  type ComboServiceRhythmMode,
} from '@/config/comboNarrative'
import { PRODUCT_NAMES } from '@/config/acdwKnowledge'

export type ComboServiceRhythmSwapProps = {
  className?: string
}

const BEATS = COMBO_SERVICE_RHYTHM.beats
const BEAT_COUNT = BEATS.length

function wrapIndex(index: number): number {
  return ((index % BEAT_COUNT) + BEAT_COUNT) % BEAT_COUNT
}

function imageForMode(mode: ComboServiceRhythmMode) {
  return BEATS.find((beat) => beat.mode === mode)?.image ?? BEATS[0].image
}

/**
 * Interactive "One port, two modes" swap for the combo workflow band.
 * Auto-advances through the service rhythm; crossfades protect vs service visuals per beat.
 */
export function ComboServiceRhythmSwap({ className }: ComboServiceRhythmSwapProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(!reduceMotion)

  const activeBeat = BEATS[activeIndex]
  const activeMode = activeBeat.mode
  const activeImage = activeBeat.image
  const modeLabel = COMBO_SERVICE_RHYTHM.modeLabels[activeMode]

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
    if (document.hidden || !isPlaying) return
    setActiveIndex((current) => wrapIndex(current + 1))
  }, [isPlaying])

  const startAutoAdvance = useCallback(() => {
    if (reduceMotion || !isPlaying) return
    clearAutoInterval()
    autoIntervalRef.current = window.setInterval(advanceAuto, COMBO_SERVICE_RHYTHM.autoAdvanceMs)
  }, [advanceAuto, clearAutoInterval, isPlaying, reduceMotion])

  const pauseAutoAdvance = useCallback(() => {
    if (reduceMotion) return
    clearAutoInterval()
    clearResumeTimeout()
    if (!isPlaying) return
    resumeTimeoutRef.current = window.setTimeout(() => {
      resumeTimeoutRef.current = null
      startAutoAdvance()
    }, COMBO_SERVICE_RHYTHM.autoResumeMs)
  }, [clearAutoInterval, clearResumeTimeout, isPlaying, reduceMotion, startAutoAdvance])

  const goTo = useCallback(
    (index: number) => {
      pauseAutoAdvance()
      setActiveIndex(wrapIndex(index))
    },
    [pauseAutoAdvance]
  )

  const togglePlayback = useCallback(() => {
    setIsPlaying((playing) => !playing)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setIsPlaying(false)
      clearAutoInterval()
      clearResumeTimeout()
      return
    }
    startAutoAdvance()
    return () => {
      clearAutoInterval()
      clearResumeTimeout()
    }
  }, [
    clearAutoInterval,
    clearResumeTimeout,
    isPlaying,
    reduceMotion,
    startAutoAdvance,
  ])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        clearAutoInterval()
        return
      }
      if (!resumeTimeoutRef.current && isPlaying && !reduceMotion) {
        startAutoAdvance()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [clearAutoInterval, isPlaying, reduceMotion, startAutoAdvance])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (!root.contains(document.activeElement)) return

      event.preventDefault()
      pauseAutoAdvance()
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => wrapIndex(current - 1))
      } else {
        setActiveIndex((current) => wrapIndex(current + 1))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pauseAutoAdvance])

  const protectImage = imageForMode('protect')
  const serviceBeats = BEATS.filter((beat) => beat.mode === 'service')

  return (
    <div
      ref={rootRef}
      className={cn('combo-service-rhythm-swap', className)}
      role="region"
      aria-label={`${PRODUCT_NAMES.mini} and ${PRODUCT_NAMES.sensor} service rhythm demo`}
      aria-roledescription="carousel"
    >
      <div className="combo-service-rhythm-swap-layout">
        <div className="combo-service-rhythm-swap-stage-wrap">
          <div className="combo-service-rhythm-swap-stage" aria-live="polite">
            <span
              className={cn(
                'combo-service-rhythm-swap-mode-chip',
                activeMode === 'service'
                  ? 'combo-service-rhythm-swap-mode-chip--service'
                  : 'combo-service-rhythm-swap-mode-chip--protect'
              )}
            >
              {modeLabel}
            </span>
            <div className="combo-service-rhythm-swap-images">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeBeat.id}
                  src={activeImage.src}
                  alt={activeImage.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="combo-service-rhythm-swap-image"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.01 }
                      : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                  }
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="combo-service-rhythm-swap-thumbs" aria-hidden>
            <img
              src={protectImage.src}
              alt=""
              className={cn(
                'combo-service-rhythm-swap-thumb',
                activeMode === 'protect' && 'combo-service-rhythm-swap-thumb--active'
              )}
              loading="lazy"
              decoding="async"
            />
            {serviceBeats.map((beat) => (
              <img
                key={beat.id}
                src={beat.image.src}
                alt=""
                className={cn(
                  'combo-service-rhythm-swap-thumb',
                  activeBeat.id === beat.id && 'combo-service-rhythm-swap-thumb--active'
                )}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>

        <div className="combo-service-rhythm-swap-controls">
          <ol
            className="combo-service-rhythm-swap-stepper"
            aria-label="Service rhythm steps"
          >
            {BEATS.map((beat, index) => {
              const isActive = index === activeIndex
              const stepNumber = index + 1
              return (
                <li
                  key={beat.id}
                  className={cn(
                    'combo-service-rhythm-swap-timeline-item',
                    isActive && 'combo-service-rhythm-swap-timeline-item--active'
                  )}
                >
                  <button
                    type="button"
                    className={cn(
                      'combo-service-rhythm-swap-timeline-row',
                      isActive && 'combo-service-rhythm-swap-timeline-row--active'
                    )}
                    aria-current={isActive ? 'step' : undefined}
                    aria-expanded={isActive}
                    aria-controls={`combo-rhythm-panel-${beat.id}`}
                    id={`combo-rhythm-step-${beat.id}`}
                    onClick={() => goTo(index)}
                    onFocus={pauseAutoAdvance}
                    onMouseEnter={pauseAutoAdvance}
                  >
                    <span className="combo-service-rhythm-swap-timeline-dot" aria-hidden>
                      {stepNumber}
                    </span>
                    <span className="combo-service-rhythm-swap-timeline-title">{beat.title}</span>
                  </button>
                  <motion.div
                    id={`combo-rhythm-panel-${beat.id}`}
                    role="region"
                    aria-labelledby={`combo-rhythm-step-${beat.id}`}
                    className="combo-service-rhythm-swap-timeline-panel"
                    initial={false}
                    animate={
                      isActive
                        ? { height: 'auto', opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0.01 }
                        : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                    }
                    aria-hidden={!isActive}
                  >
                    <p className="combo-service-rhythm-swap-timeline-benefit">{beat.benefit}</p>
                  </motion.div>
                </li>
              )
            })}
          </ol>

          <div className="combo-service-rhythm-swap-playback">
            {!reduceMotion ? (
              <button
                type="button"
                className="combo-service-rhythm-swap-play-btn"
                onClick={togglePlayback}
                aria-pressed={isPlaying}
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="combo-service-rhythm-swap-play-icon" aria-hidden />
                    Pause demo
                  </>
                ) : (
                  <>
                    <PlayIcon className="combo-service-rhythm-swap-play-icon" aria-hidden />
                    Play demo
                  </>
                )}
              </button>
            ) : (
              <p className="combo-service-rhythm-swap-reduced-note">
                Animation disabled to respect reduced-motion preference.
              </p>
            )}
          </div>

          <p className="combo-service-rhythm-swap-footnote">
            {COMBO_SERVICE_RHYTHM.wifiFootnote.prefix}{' '}
            <a
              href={`#${COMBO_SERVICE_RHYTHM.wifiFootnote.fleetSectionId}`}
              className="combo-service-rhythm-swap-footnote-link"
            >
              {COMBO_SERVICE_RHYTHM.wifiFootnote.fleetLinkLabel}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComboServiceRhythmSwap
