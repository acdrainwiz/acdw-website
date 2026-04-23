import { useEffect, useId, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { BellAlertIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import {
  GAUGE_VARIANTS,
  getStateFromLevel,
  type GaugeStateKey,
  type GaugeThresholdTone,
  type GaugeVariantConfig,
  type GaugeVariantId,
} from './sensorGaugeConfig'

export type SensorWaterGaugeProductImage = {
  src: string
  alt: string
  /** Reserved for future use; not shown in the hero layout. */
  caption?: string
}

export type SensorWaterGaugeProps = {
  autoPlay?: boolean
  productImage: SensorWaterGaugeProductImage
  className?: string
}

/**
 * Human-friendly hooks for CSS overrides, themes, and QA.
 *
 * - **Classes:** `.sensor-water-demo-root`, `.sensor-water-demo-led-panel`, …
 * - **Data:** `[data-sensor-water-demo="manifold-stage"]`
 *
 * Example:
 * ```css
 * .sensor-water-demo-led-panel { border-color: ...; }
 * [data-sensor-water-demo='threshold-callout'][data-threshold-pct='80'] { ... }
 * ```
 */
export const sensorWaterDemoTargets = {
  /** `data-sensor-water-demo="<section>"` on major regions. */
  mark: (section: string) =>
    ({ 'data-sensor-water-demo': section }) as Record<string, string>,
  classNames: {
    root: 'sensor-water-demo-root',
    heroFigure: 'sensor-water-demo-hero-figure',
    heroImage: 'sensor-water-demo-hero-image',
    demoTabGroup: 'sensor-water-demo-demo-tab-group',
    demoTabButton: 'sensor-water-demo-demo-tab-button',
    dialogBackdrop: 'sensor-water-demo-dialog-backdrop',
    dialogPositioner: 'sensor-water-demo-dialog-positioner',
    dialogPanel: 'sensor-water-demo-dialog-panel',
    dialogHeader: 'sensor-water-demo-dialog-header',
    dialogTitle: 'sensor-water-demo-dialog-title',
    dialogCloseButton: 'sensor-water-demo-dialog-close-button',
    dialogScrollBody: 'sensor-water-demo-dialog-scroll-body',
    demoContentRegion: 'sensor-water-demo-content',
    summary: 'sensor-water-demo-summary',
    vizRow: 'sensor-water-demo-viz-row',
    ledPanel: 'sensor-water-demo-led-panel',
    ledPanelTitle: 'sensor-water-demo-led-panel-title',
    ledPanelNote: 'sensor-water-demo-led-panel-note',
    ledPanelOrb: 'sensor-water-demo-led-panel-orb',
    manifoldStage: 'sensor-water-demo-manifold-stage',
    readoutArea: 'sensor-water-demo-readout-area',
    readoutLive: 'sensor-water-demo-readout-live',
    playPauseButton: 'sensor-water-demo-play-pause-button',
    reducedMotionNote: 'sensor-water-demo-reduced-motion-note',
    thresholdCalloutList: 'sensor-water-demo-threshold-callout-list',
    thresholdCalloutItem: 'sensor-water-demo-threshold-callout-item',
    thresholdCalloutRow: 'sensor-water-demo-threshold-callout-row',
    thresholdDot: 'sensor-water-demo-threshold-dot',
    thresholdConnector: 'sensor-water-demo-threshold-connector',
    thresholdCard: 'sensor-water-demo-threshold-card',
    tManifoldSvg: 'sensor-water-demo-t-manifold-svg',
  },
} as const

const sensorWaterLevelDemoTabs: Array<{
  id: GaugeVariantId
  label: string
  ariaLabel: string
}> = [
  {
    id: 'standard',
    label: 'Standard',
    ariaLabel: 'Open Standard Sensor Switch water-level demo in a dialog',
  },
  {
    id: 'wifi',
    label: 'WiFi',
    ariaLabel: 'Open WiFi Sensor Switch water-level demo in a dialog',
  },
]

const sensorWaterLevelInlineTabs: Array<{
  id: GaugeVariantId
  label: string
  ariaLabel: string
}> = [
  {
    id: 'standard',
    label: 'Standard',
    ariaLabel: 'Show Standard Sensor Switch water-level demo',
  },
  {
    id: 'wifi',
    label: 'WiFi',
    ariaLabel: 'Show WiFi Sensor Switch water-level demo',
  },
]

// ─── T-manifold SVG geometry ────────────────────────────────────────────
const SVG_VIEW = { w: 400, h: 200 } as const

/** Horizontal glass body height; vertical riser matches this width at the bayonet. */
const HORIZONTAL_BODY_H = 80
const VERTICAL_STEM_W = HORIZONTAL_BODY_H
const VERTICAL_STEM_CX = 200
const VERTICAL_STEM_LEFT = VERTICAL_STEM_CX - VERTICAL_STEM_W / 2
/** Inner vertical passage (inset ~6 from outer stem, same ratio as previous art). */
const VERT_INNER_L = VERTICAL_STEM_LEFT + 6
const VERT_INNER_R = VERTICAL_STEM_LEFT + VERTICAL_STEM_W - 6
const HORIZ_GLASS = { x: 40, y: 100, w: 320, h: HORIZONTAL_BODY_H } as const
const HORIZ_GLASS_RIGHT = HORIZ_GLASS.x + HORIZ_GLASS.w
/** Inset from left glass edge — anchor for 50% callout on desktop. */
const HORIZ_GLASS_LEFT_CALLOUT = HORIZ_GLASS.x + 10
const VERT_GLASS_RIGHT = VERTICAL_STEM_LEFT + VERTICAL_STEM_W

/** Clip-path / interior bounds (not the same as level→Y mapping below). */
const Y_BOTTOM = 173
const Y_TOP = 48
/** Inner ceiling of the horizontal run (tee — top of the horizontal limb; matches clip path). */
const INTERIOR_HORIZ_TOP = 107

/**
 * Vertical midpoint of the horizontal limb interior (50% fill sits here).
 * SVG y increases downward; this is halfway between the horizontal floor and tee ceiling.
 */
const Y_HORIZONTAL_MID = (INTERIOR_HORIZ_TOP + Y_BOTTOM) / 2

/**
 * Top of the 95–100% segment: water rising into the vertical stem after the horizontal run is full.
 * Demo animation stops at product shutdown (80%) — which sits **below** the tee on this ruler.
 */
const Y_RISER_CAP = 72

/**
 * Horizontal limb uses a fixed **95% = tee** ruler (original art). Product shutdown is **80%**, so the
 * waterline at 80% is **(80−50)/(95−50)** of the way from mid-duct to tee — visibly lower than a full horizontal run.
 * **95–100%** still compresses into the **vertical stem** for the critical overlay band.
 */
const GAUGE_HORIZONTAL_FULL_PCT = 95

/**
 * Map logical fill % → SVG y (downward-positive).
 *
 * **0–50%:** floor → mid horizontal. **50–95%:** mid → tee (`INTERIOR_HORIZ_TOP`) on a linear ruler.
 * **95–100%:** tee → riser cap. Threshold lines, amber/red bands, clipped water, and ripples use this mapping.
 *
 * Larger y ⇒ lower waterline (less fill).
 */
function sensorFillPercentToWaterlineY(lvl: number): number {
  const l = Math.max(0, Math.min(100, lvl))
  if (l <= 50) {
    return Y_BOTTOM + (Y_HORIZONTAL_MID - Y_BOTTOM) * (l / 50)
  }
  if (l <= GAUGE_HORIZONTAL_FULL_PCT) {
    return (
      Y_HORIZONTAL_MID +
      (INTERIOR_HORIZ_TOP - Y_HORIZONTAL_MID) * ((l - 50) / (GAUGE_HORIZONTAL_FULL_PCT - 50))
    )
  }
  return (
    INTERIOR_HORIZ_TOP +
    (Y_RISER_CAP - INTERIOR_HORIZ_TOP) * ((l - GAUGE_HORIZONTAL_FULL_PCT) / (100 - GAUGE_HORIZONTAL_FULL_PCT))
  )
}

type ThresholdCalloutAnchor =
  | {
      layout: 'side'
      xPct: number
      yPct: number
      align: 'left' | 'right'
    }
  | {
      /**
       * Dot sits on the guide at (xPct, yPct); connector drops straight down and
       * the card is centered **below** the dot. Used on narrow viewports for the
       * 50% threshold so it clears other threshold callouts near the tee.
       */
      layout: 'below'
      xPct: number
      yPct: number
    }

/**
 * Anchor for threshold callouts (% of overlay = SVG viewBox space).
 *
 * `'side'` (default) places the card to the left/right of the dot on the waterline.
 * `'below'` (narrow 50%) drops the card vertically so it avoids overlap with the
 * shutdown callout and other markers near the tee on small screens.
 */
function sensorThresholdCalloutAnchor(
  pct: number,
  narrowViewport: boolean
): ThresholdCalloutAnchor {
  const ySvg = sensorFillPercentToWaterlineY(pct)
  const yPct = (ySvg / SVG_VIEW.h) * 100

  if (pct === 50 && narrowViewport) {
    return {
      layout: 'below',
      xPct: (VERTICAL_STEM_CX / SVG_VIEW.w) * 100,
      yPct,
    }
  }

  let align: 'left' | 'right' = 'right'
  let xSvg: number

  if (pct === 50) {
    align = 'left'
    xSvg = HORIZ_GLASS_LEFT_CALLOUT
  } else if (ySvg > INTERIOR_HORIZ_TOP) {
    xSvg = HORIZ_GLASS_RIGHT - 4
  } else {
    xSvg = VERT_GLASS_RIGHT - 2
  }

  return { layout: 'side', xPct: (xSvg / SVG_VIEW.w) * 100, yPct, align }
}

/**
 * Hero Sensor product shot with demo triggers below. Standard / WiFi open the
 * animated T-manifold water-level demo in a modal (full focus trap + Esc).
 */
export function SensorWaterGauge({
  autoPlay = true,
  productImage,
  className,
}: SensorWaterGaugeProps) {
  const [modalVariant, setModalVariant] = useState<GaugeVariantId | null>(null)

  return (
    <div
      {...sensorWaterDemoTargets.mark('root')}
      className={cn(
        sensorWaterDemoTargets.classNames.root,
        'flex h-full min-h-[320px] w-full max-w-none flex-col gap-4 self-stretch sm:min-h-[420px] lg:min-h-[480px]',
        className
      )}
      role="region"
      aria-label={`Sensor Switch product and water-level demos. ${productImage.alt}`}
    >
      <div
        {...sensorWaterDemoTargets.mark('hero-figure')}
        className={cn(
          sensorWaterDemoTargets.classNames.heroFigure,
          'flex min-h-0 w-full flex-1 flex-col items-stretch justify-center'
        )}
      >
        <img
          src={productImage.src}
          alt={productImage.alt}
          loading="lazy"
          decoding="async"
          className={cn(
            sensorWaterDemoTargets.classNames.heroImage,
            'block h-full max-h-[min(72vh,640px)] w-full min-h-[220px] flex-1 select-none object-contain object-center'
          )}
          draggable={false}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div
          {...sensorWaterDemoTargets.mark('demo-tab-group')}
          role="group"
          aria-label="Open a water-level demo"
          className={cn(
            sensorWaterDemoTargets.classNames.demoTabGroup,
            'inline-flex w-full max-w-md justify-center rounded-full bg-slate-800/70 p-1 ring-1 ring-white/10'
          )}
        >
          {sensorWaterLevelDemoTabs.map((t) => {
            const isPressed = modalVariant === t.id
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={isPressed}
                aria-label={t.ariaLabel}
                onClick={() => setModalVariant(t.id)}
                className={cn(
                  sensorWaterDemoTargets.classNames.demoTabButton,
                  'relative z-10 flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
                  isPressed ? 'text-slate-900' : 'text-slate-200 hover:text-white'
                )}
              >
                {isPressed ? (
                  <motion.span
                    layoutId="sensor-water-demo-tab-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white shadow-md"
                    transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                  />
                ) : null}
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <Dialog
        open={modalVariant !== null}
        onClose={() => setModalVariant(null)}
        className="relative z-[100]"
        {...sensorWaterDemoTargets.mark('dialog')}
      >
        <DialogBackdrop
          transition
          {...sensorWaterDemoTargets.mark('dialog-backdrop')}
          className={cn(
            sensorWaterDemoTargets.classNames.dialogBackdrop,
            'fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in'
          )}
        />
        <div
          {...sensorWaterDemoTargets.mark('dialog-positioner')}
          className={cn(
            sensorWaterDemoTargets.classNames.dialogPositioner,
            'fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4'
          )}
        >
          <DialogPanel
            transition
            {...sensorWaterDemoTargets.mark('dialog-panel')}
            className={cn(
              sensorWaterDemoTargets.classNames.dialogPanel,
              'flex max-h-[100dvh] w-full flex-col bg-slate-900 shadow-2xl ring-1 ring-white/15 transition',
              'data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in',
              'sm:max-h-[min(92dvh,880px)] sm:max-w-2xl sm:rounded-2xl sm:data-[closed]:translate-y-0 sm:data-[closed]:scale-95'
            )}
          >
            {modalVariant ? (
              <>
                <div
                  {...sensorWaterDemoTargets.mark('dialog-header')}
                  className={cn(
                    sensorWaterDemoTargets.classNames.dialogHeader,
                    'flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6'
                  )}
                >
                  <DialogTitle
                    className={cn(
                      sensorWaterDemoTargets.classNames.dialogTitle,
                      'text-base font-semibold leading-snug text-white sm:text-lg'
                    )}
                  >
                    {GAUGE_VARIANTS[modalVariant].displayName}
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={() => setModalVariant(null)}
                    className={cn(
                      sensorWaterDemoTargets.classNames.dialogCloseButton,
                      'rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400'
                    )}
                    aria-label="Close demo"
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                <div
                  {...sensorWaterDemoTargets.mark('dialog-body')}
                  className={cn(
                    sensorWaterDemoTargets.classNames.dialogScrollBody,
                    'min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6 sm:pb-8'
                  )}
                >
                  <SensorWaterGaugeModalDemo
                    key={modalVariant}
                    variantId={modalVariant}
                    autoPlay={autoPlay}
                  />
                </div>
              </>
            ) : null}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

/**
 * Inline version of the water-level demo: a Standard / WiFi variant toggle
 * rendered directly above the animated T-manifold (no modal). Intended to live
 * as a full-width section on the Products page so visitors can see the sensor
 * respond to rising water without opening a dialog.
 */
export function SensorWaterGaugeInline({
  autoPlay = true,
  className,
}: {
  autoPlay?: boolean
  className?: string
}) {
  const [variantId, setVariantId] = useState<GaugeVariantId>('standard')

  return (
    <div
      {...sensorWaterDemoTargets.mark('inline-root')}
      className={cn(
        'flex w-full flex-col items-center gap-6',
        className
      )}
    >
      <div
        role="group"
        aria-label="Select a sensor model to preview"
        className="inline-flex w-full max-w-md justify-center rounded-full bg-slate-800/70 p-1 ring-1 ring-white/10"
      >
        {sensorWaterLevelInlineTabs.map((t) => {
          const active = variantId === t.id
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              aria-label={t.ariaLabel}
              onClick={() => setVariantId(t.id)}
              className={cn(
                'relative z-10 flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
                active ? 'text-slate-900' : 'text-slate-200 hover:text-white'
              )}
            >
              {active ? (
                <motion.span
                  layoutId="sensor-water-inline-tab-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-white shadow-md"
                  transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                />
              ) : null}
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="w-full max-w-3xl">
        <SensorWaterGaugeDemoBody
          key={variantId}
          variantId={variantId}
          autoPlay={autoPlay}
        />
      </div>
    </div>
  )
}

function SensorWaterGaugeModalDemo(props: {
  variantId: GaugeVariantId
  autoPlay: boolean
}) {
  return <SensorWaterGaugeDemoBody {...props} />
}

function SensorWaterGaugeDemoBody({
  variantId,
  autoPlay,
}: {
  variantId: GaugeVariantId
  autoPlay: boolean
}) {
  const reduceMotion = useReducedMotion()
  const variant = GAUGE_VARIANTS[variantId]
  const shutdownHold = variant.shutdownPct
  const [isPlaying, setIsPlaying] = useState(autoPlay && !reduceMotion)
  const [level, setLevel] = useState(reduceMotion ? shutdownHold : 0)
  const [stateKey, setStateKey] = useState<GaugeStateKey>(
    reduceMotion ? 'shutdown' : 'monitoring'
  )
  const levelMv = useMotionValue(reduceMotion ? shutdownHold : 0)

  const state = variant.states[stateKey]

  useEffect(() => {
    const unsub = levelMv.on('change', (v) => {
      setLevel(v)
      setStateKey(getStateFromLevel(v, variant))
    })
    return unsub
  }, [levelMv, variant])

  useEffect(() => {
    if (!isPlaying || reduceMotion) return
    const controls = animate(levelMv, variant.cycle.keyframes, {
      duration: variant.cycle.durationSec,
      times: variant.cycle.times,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    })
    return () => controls.stop()
  }, [isPlaying, reduceMotion, variant, levelMv])

  useEffect(() => {
    if (reduceMotion) setIsPlaying(false)
  }, [reduceMotion])

  useEffect(() => {
    levelMv.set(reduceMotion ? shutdownHold : 0)
    setStateKey(getStateFromLevel(reduceMotion ? shutdownHold : 0, variant))
    setIsPlaying(autoPlay && !reduceMotion)
  }, [variantId, reduceMotion, variant, levelMv, autoPlay, shutdownHold])

  const ariaLiveLabel = `Water level ${Math.round(level)} percent. ${state.label}. ${state.sublabel}`

  return (
    <div
      className="flex flex-col gap-5"
      role="region"
      aria-label={`${variant.displayName} demo. ${ariaLiveLabel}`}
    >
      <p className="text-center text-sm text-slate-300">{variant.summary}</p>

      <div className="flex flex-col items-center gap-3 px-1 sm:gap-4">
        {/* LED lives on the real sensor cap; parked here so the demo stays readable. */}
        <div className="flex w-full max-w-[420px] shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-black/20 sm:px-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Led
              color={state.ledColor}
              pulse={state.ledPulse && !reduceMotion}
            />
          </div>
          <div className="flex min-w-0 flex-col text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Status LED
            </span>
            <span className="text-[10px] leading-snug text-slate-500">
              Mounts on the sensor cap in the field; shown here for clarity.
            </span>
          </div>
        </div>

        <div className="relative aspect-[2/1] w-full min-w-0 max-w-[420px] overflow-visible">
          <TManifoldVisual
            variant={variant}
            levelMv={levelMv}
            reduceMotion={!!reduceMotion}
          />
          <GaugeThresholdSpotLabels
            thresholds={variant.thresholds}
            reduceMotion={!!reduceMotion}
          />
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-3 sm:mt-0">
        <div
          className="flex min-h-[72px] w-full flex-col items-center gap-1 text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${variantId}-${stateKey}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="font-mono text-slate-300">
                  {Math.round(level)}%
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-500" aria-hidden />
                <span>{state.label}</span>
              </div>
              <p className="text-xs text-slate-300">{state.sublabel}</p>
              {state.badge ? (
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-medium text-amber-200 ring-1 ring-amber-400/40">
                  <BellAlertIcon className="h-3 w-3" aria-hidden />
                  {state.badge}
                </span>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {!reduceMotion ? (
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {isPlaying ? (
              <>
                <PauseIcon className="h-3.5 w-3.5" aria-hidden />
                Pause demo
              </>
            ) : (
              <>
                <PlayIcon className="h-3.5 w-3.5" aria-hidden />
                Play demo
              </>
            )}
          </button>
        ) : (
          <p className="text-[11px] italic text-slate-400">
            Animation disabled to respect reduced-motion preference.
          </p>
        )}
      </div>
    </div>
  )
}

/** Matches Tailwind `sm:` (640px) — below this, 50% callout uses center anchor to avoid left-edge clipping. */
const GAUGE_CALLOUT_NARROW_MQ = '(max-width: 639px)'

function useGaugeNarrowViewport() {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(GAUGE_CALLOUT_NARROW_MQ).matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia(GAUGE_CALLOUT_NARROW_MQ)
    const apply = () => setNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return narrow
}

function ThresholdPulseDot({
  tone,
  reduceMotion,
  delaySec,
}: {
  tone: GaugeThresholdTone
  reduceMotion: boolean
  delaySec: number
}) {
  return (
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
      {!reduceMotion ? (
        <motion.span
          className={cn(
            'absolute inset-0 rounded-full',
            tone === 'critical' && 'bg-red-400/55',
            tone === 'warn' && 'bg-amber-400/55',
            tone === 'normal' && 'bg-sky-400/55'
          )}
          animate={{ scale: [1, 1.85, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', delay: delaySec }}
        />
      ) : null}
      <span
        className={cn(
          'relative h-3 w-3 rounded-full bg-white shadow-[0_2px_6px_rgba(2,6,23,0.35)] ring-2',
          tone === 'critical' && 'ring-red-400',
          tone === 'warn' && 'ring-amber-400',
          tone === 'normal' && 'ring-sky-400'
        )}
      />
    </span>
  )
}

function ThresholdCard({
  pct,
  label,
  tone,
}: {
  pct: number
  label: string
  tone: GaugeThresholdTone
}) {
  return (
    <div
      className={cn(
        'max-w-[8.5rem] rounded-xl px-2.5 py-2 shadow-[0_14px_36px_-12px_rgba(0,0,0,0.55)] ring-1',
        tone === 'warn' && 'bg-slate-950/90 text-amber-50 ring-amber-400/40',
        tone === 'critical' && 'bg-slate-950/90 text-red-50 ring-red-400/45',
        tone === 'normal' && 'bg-slate-950/90 text-slate-50 ring-white/18'
      )}
    >
      <div className="font-mono text-[11px] font-semibold leading-none tabular-nums">
        {pct}%
      </div>
      <div className="mt-1 text-[10px] leading-snug text-slate-300">{label}</div>
    </div>
  )
}

/** Pulse dot + connector + compact card, positioned like ProductHotspots callouts. */
function GaugeThresholdSpotLabels({
  thresholds,
  reduceMotion,
}: {
  thresholds: GaugeVariantConfig['thresholds']
  reduceMotion: boolean
}) {
  const narrowViewport = useGaugeNarrowViewport()

  return (
    <ol
      className="pointer-events-none absolute inset-0 z-10 m-0 list-none p-0"
      aria-hidden
    >
      {thresholds.map((t, i) => {
        const anchor = sensorThresholdCalloutAnchor(t.pct, narrowViewport)

        if (anchor.layout === 'below') {
          return (
            <li
              key={`spot-${t.pct}`}
              className="absolute left-0 top-0 h-0 w-0"
              style={{ left: `${anchor.xPct}%`, top: `${anchor.yPct}%` }}
            >
              <div
                className="flex flex-col items-center gap-1"
                style={{ transform: 'translate(-50%, 0)' }}
              >
                <ThresholdPulseDot
                  tone={t.tone}
                  reduceMotion={reduceMotion}
                  delaySec={i * 0.16}
                />
                <span
                  className={cn(
                    'h-3 w-px shrink-0',
                    t.tone === 'critical' && 'bg-red-500/90',
                    t.tone === 'warn' && 'bg-amber-400/85',
                    t.tone === 'normal' && 'bg-slate-400/80'
                  )}
                />
                <ThresholdCard pct={t.pct} label={t.label} tone={t.tone} />
              </div>
            </li>
          )
        }

        const { xPct, yPct, align } = anchor
        return (
          <li
            key={`spot-${t.pct}`}
            className="absolute left-0 top-0 h-0 w-0"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            {/*
              Anchor (xPct, yPct) = intersection of dashed guide with manifold edge in SVG space.
              Zero-size li + translateY(-50%) vertically centers the row on that point; horizontal
              offset only where the row extends left/right from the stem (no vertical pixel nudges).
            */}
            <div
              className={cn(
                'flex items-center gap-1',
                align === 'left' && 'flex-row-reverse'
              )}
              style={{
                transform:
                  align === 'right'
                    ? 'translate(0, -50%)'
                    : 'translate(calc(-100%), -50%)',
              }}
            >
              <ThresholdPulseDot
                tone={t.tone}
                reduceMotion={reduceMotion}
                delaySec={i * 0.16}
              />
              <span
                className={cn(
                  'h-px w-2.5 shrink-0',
                  t.tone === 'critical' && 'bg-red-500/90',
                  t.tone === 'warn' && 'bg-amber-400/85',
                  t.tone === 'normal' && 'bg-slate-400/80'
                )}
              />
              <ThresholdCard pct={t.pct} label={t.label} tone={t.tone} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function TManifoldVisual({
  variant,
  levelMv,
  reduceMotion,
}: {
  variant: GaugeVariantConfig
  levelMv: MotionValue<number>
  reduceMotion: boolean
}) {
  const waterTopY = useTransform(levelMv, (v) => sensorFillPercentToWaterlineY(v))

  const clipId = useId()
  const interiorClipId = `${clipId}-interior`
  const waterGradientId = `${clipId}-water`
  const glassGradientId = `${clipId}-glass`

  const interiorPath = `M 47 ${Y_BOTTOM} L 353 ${Y_BOTTOM} L 353 ${INTERIOR_HORIZ_TOP} L ${VERT_INNER_R} ${INTERIOR_HORIZ_TOP} L ${VERT_INNER_R} ${Y_TOP} L ${VERT_INNER_L} ${Y_TOP} L ${VERT_INNER_L} ${INTERIOR_HORIZ_TOP} L 47 ${INTERIOR_HORIZ_TOP} Z`

  return (
    <svg
      viewBox={`0 0 ${SVG_VIEW.w} ${SVG_VIEW.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="block h-full w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <clipPath id={interiorClipId}>
          <path d={interiorPath} />
        </clipPath>
        <linearGradient id={waterGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={glassGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>

      <rect
        x={VERTICAL_STEM_LEFT}
        y="40"
        width={VERTICAL_STEM_W}
        height="70"
        rx="8"
        ry="8"
        fill={`url(#${glassGradientId})`}
        stroke="rgba(148,163,184,0.55)"
        strokeWidth="1.5"
      />
      <ellipse
        cx={VERTICAL_STEM_CX}
        cy="40"
        rx={VERTICAL_STEM_W / 2}
        ry="7"
        fill="rgba(148,163,184,0.3)"
        stroke="rgba(148,163,184,0.55)"
        strokeWidth="1"
      />
      <ellipse
        cx={VERTICAL_STEM_CX}
        cy="40"
        rx={VERTICAL_STEM_W / 2 - 10}
        ry="5"
        fill="rgba(15,23,42,0.45)"
      />
      <rect
        x={HORIZ_GLASS.x}
        y={HORIZ_GLASS.y}
        width={HORIZ_GLASS.w}
        height={HORIZ_GLASS.h}
        rx="12"
        ry="12"
        fill={`url(#${glassGradientId})`}
        stroke="rgba(148,163,184,0.55)"
        strokeWidth="1.5"
      />
      <g>
        <rect
          x="0"
          y="112"
          width="40"
          height="56"
          rx="4"
          ry="4"
          fill="rgba(148,163,184,0.42)"
          stroke="rgba(148,163,184,0.55)"
          strokeWidth="1"
        />
        <g stroke="rgba(51,65,85,0.65)" strokeWidth="0.9">
          <line x1="8" y1="116" x2="8" y2="164" />
          <line x1="16" y1="116" x2="16" y2="164" />
          <line x1="24" y1="116" x2="24" y2="164" />
          <line x1="32" y1="116" x2="32" y2="164" />
        </g>
        <rect
          x="360"
          y="112"
          width="40"
          height="56"
          rx="4"
          ry="4"
          fill="rgba(148,163,184,0.42)"
          stroke="rgba(148,163,184,0.55)"
          strokeWidth="1"
        />
        <g stroke="rgba(51,65,85,0.65)" strokeWidth="0.9">
          <line x1="368" y1="116" x2="368" y2="164" />
          <line x1="376" y1="116" x2="376" y2="164" />
          <line x1="384" y1="116" x2="384" y2="164" />
          <line x1="392" y1="116" x2="392" y2="164" />
        </g>
      </g>

      <g clipPath={`url(#${interiorClipId})`}>
        {variant.alertRangeStart !== undefined &&
        variant.alertRangeEnd !== undefined ? (
          <rect
            x={0}
            y={sensorFillPercentToWaterlineY(variant.alertRangeEnd)}
            width={SVG_VIEW.w}
            height={
              sensorFillPercentToWaterlineY(variant.alertRangeStart) - sensorFillPercentToWaterlineY(variant.alertRangeEnd)
            }
            fill="rgba(251,191,36,0.15)"
          />
        ) : null}

        {/*
          Critical fill: top aligns with the horizontal run (tee ceiling), not the riser cap — same vertical
          extent as the “danger” slice above the shutdown line in the lower T, full width through the clip.
        */}
        <rect
          x={0}
          y={INTERIOR_HORIZ_TOP}
          width={SVG_VIEW.w}
          height={
            sensorFillPercentToWaterlineY(variant.shutdownPct) - INTERIOR_HORIZ_TOP
          }
          fill="rgba(239,68,68,0.22)"
        />

        {variant.thresholds.map((t) => (
          <line
            key={`tl-${t.pct}`}
            x1={0}
            x2={SVG_VIEW.w}
            y1={sensorFillPercentToWaterlineY(t.pct)}
            y2={sensorFillPercentToWaterlineY(t.pct)}
            stroke={
              t.tone === 'critical'
                ? 'rgba(239,68,68,0.85)'
                : t.tone === 'warn'
                  ? 'rgba(251,191,36,0.75)'
                  : 'rgba(148,163,184,0.6)'
            }
            strokeWidth="1"
            strokeDasharray={t.tone === 'critical' ? '0' : '3 3'}
          />
        ))}

        <motion.rect
          x={0}
          width={SVG_VIEW.w}
          y={waterTopY}
          height={SVG_VIEW.h}
          fill={`url(#${waterGradientId})`}
        />

        <motion.rect
          x={0}
          width={SVG_VIEW.w}
          y={waterTopY}
          height={3}
          fill="rgba(186,230,253,0.55)"
        />

        {!reduceMotion ? (
          <motion.g style={{ y: waterTopY }}>
            <motion.path
              d="M -60 0 Q -30 -5 0 0 T 60 0 T 120 0 T 180 0 T 240 0 T 300 0 T 360 0 T 420 0 T 480 0 L 480 10 L -60 10 Z"
              fill="rgba(125,211,252,0.85)"
              animate={{ x: [0, -60, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.path
              d="M -60 2 Q -30 -3 0 2 T 60 2 T 120 2 T 180 2 T 240 2 T 300 2 T 360 2 T 420 2 T 480 2 L 480 10 L -60 10 Z"
              fill="rgba(186,230,253,0.4)"
              animate={{ x: [0, 40, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.g>
        ) : null}
      </g>

      <g fill="none" strokeLinecap="round">
        <path
          d="M 55 108 Q 200 104 345 108"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="1.3"
        />
        <path
          d="M 55 174 Q 200 178 345 174"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.8"
        />
        <path
          d={`M ${VERTICAL_STEM_LEFT + 6} 52 Q ${VERTICAL_STEM_LEFT + 3} 76 ${VERTICAL_STEM_LEFT + 6} 100`}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1"
        />
      </g>
    </svg>
  )
}

function Led({ color, pulse }: { color: 'green' | 'red'; pulse: boolean }) {
  return (
    <div className="relative h-4 w-4 rounded-full bg-slate-900/70 p-[2px] ring-1 ring-white/10">
      <motion.span
        aria-hidden
        className={cn(
          'absolute inset-[2px] rounded-full',
          color === 'red'
            ? 'bg-red-500 shadow-[0_0_16px_3px_rgba(239,68,68,0.65)]'
            : 'bg-emerald-500 shadow-[0_0_14px_3px_rgba(16,185,129,0.55)]'
        )}
        animate={pulse ? { opacity: [1, 0.72, 1] } : { opacity: 1 }}
        transition={
          pulse
            ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
      />
      <span
        aria-hidden
        className="absolute inset-[3px] rounded-full bg-gradient-to-b from-white/60 to-transparent"
      />
    </div>
  )
}

export default SensorWaterGauge
