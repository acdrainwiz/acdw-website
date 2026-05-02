import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'
import { useId, useMemo } from 'react'

const VIEW_W = 1200
const VIEW_H = 520
const SKY_WAVELENGTH = 308

/**
 * Flowing water wave decoration for Mini product light sections.
 * **Blend:** Slow linear “idle” tiling on each wave (always-on current) plus
 * scroll-driven lateral drift tied to passage through each section (`sectionRef`).
 * `prefers-reduced-motion`: both idle + scroll drift are suppressed.
 */

function sineWavePath(opts: {
  left: number
  right: number
  baseline: number
  amplitude: number
  wavelength: number
  phase: number
  floorY: number
}): string {
  const { left, right, baseline, amplitude, wavelength, phase, floorY } = opts
  const step = wavelength / 42
  const startRad = (left / wavelength) * 2 * Math.PI + phase
  const startY = baseline + amplitude * Math.sin(startRad)

  let d = `M ${left} ${floorY} L ${left} ${startY.toFixed(2)}`
  for (let x = left + step; x <= right + step / 2; x += step) {
    const y = baseline + amplitude * Math.sin((x / wavelength) * 2 * Math.PI + phase)
    d += ` L ${x.toFixed(1)} ${y.toFixed(2)}`
  }
  d += ` L ${right} ${floorY} Z`
  return d
}

type WaveBandProps = {
  d: string
  fill: string
  scrollDriftX: MotionValue<number>
  /** Seamless tiling distance (one wavelength along x) — matches sine period */
  idlePeriodPx: number
  /** Seconds for one idle cycle at full period (slow = calmer alongside scroll) */
  idleDurationSec: number
  /** +1 = idle pushes path toward increasing x */
  idleDirection: 1 | -1
  idleEnabled: boolean
  opacity?: number
}

function WaveBand({
  d,
  fill,
  scrollDriftX,
  idlePeriodPx,
  idleDurationSec,
  idleDirection,
  idleEnabled,
  opacity = 1,
}: WaveBandProps) {
  const idleKeyframes: [number, number] =
    idleDirection === 1 ? [0, idlePeriodPx] : [0, -idlePeriodPx]

  return (
    <motion.g style={{ x: scrollDriftX }}>
      <motion.path
        fill={fill}
        fillOpacity={opacity}
        d={d}
        initial={{ x: 0 }}
        animate={
          idleEnabled
            ? {
                x: idleKeyframes,
              }
            : { x: 0 }
        }
        transition={
          idleEnabled
            ? {
                duration: idleDurationSec,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
              }
            : undefined
        }
      />
    </motion.g>
  )
}

export type MiniFlowWaveBackdropProps = {
  sectionRef: RefObject<HTMLElement | null>
}

export function MiniFlowWaveBackdrop({ sectionRef }: MiniFlowWaveBackdropProps) {
  const reduceMotion = useReducedMotion()
  const rm = Boolean(reduceMotion)
  const uid = useId().replace(/:/g, '')
  /** Idle tiling only when user allows motion (scroll blending still off when rm) */
  const idleEnabled = !rm

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  /** Scroll layer (slightly dialed down so idle + scroll don’t feel frantic) */
  const driftDeep = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [0, -300])
  const driftSky = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [0, 236])
  const driftMist = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [0, -202])

  const layers = useMemo(() => {
    const pad = VIEW_W * 0.88
    const left = -pad
    const right = VIEW_W + pad

    const specs = [
      {
        key: `${uid}-deep`,
        scrollDriftX: driftDeep,
        idleDurationSec: 58,
        idleDirection: -1 as const,
        fill: '#0ea5e9',
        baseline: VIEW_H * 0.615,
        amp: 12,
        wavelength: 396,
        phase: 0,
        opacity: 0.068,
      },
      {
        key: `${uid}-sky`,
        scrollDriftX: driftSky,
        idleDurationSec: 42,
        idleDirection: 1 as const,
        fill: '#38bdf8',
        baseline: VIEW_H * 0.575,
        amp: 8.5,
        wavelength: SKY_WAVELENGTH,
        phase: 1.35,
        opacity: 0.048,
      },
      {
        key: `${uid}-mist`,
        scrollDriftX: driftMist,
        idleDurationSec: 33,
        idleDirection: -1 as const,
        fill: '#7dd3fc',
        baseline: VIEW_H * 0.658,
        amp: 5.5,
        wavelength: 264,
        phase: 2.15,
        opacity: 0.034,
      },
    ] as const

    return specs.map((layer) => {
      const floorY = VIEW_H + 2
      const d = sineWavePath({
        left,
        right,
        baseline: layer.baseline,
        amplitude: layer.amp,
        wavelength: layer.wavelength,
        phase: layer.phase,
        floorY,
      })
      return { ...layer, d, idlePeriodPx: layer.wavelength }
    })
  }, [driftDeep, driftMist, driftSky, uid])

  const crestD = useMemo(() => {
    const pad = VIEW_W * 0.88
    const left = -pad
    const right = VIEW_W + pad
    const baseline = VIEW_H * 0.575
    const amp = 8.5
    const wavelength = SKY_WAVELENGTH
    const phase = 1.35
    const step = wavelength / 28

    let path = `M ${left} ${baseline + amp * Math.sin((left / wavelength) * 2 * Math.PI + phase)}`
    for (let x = left + step; x <= right + step / 2; x += step) {
      const y = baseline + amp * Math.sin((x / wavelength) * 2 * Math.PI + phase)
      path += ` L ${x.toFixed(1)} ${y.toFixed(2)}`
    }
    return path
  }, [])

  return (
    <div className="mini-flow-wave-backdrop" aria-hidden>
      <svg
        className="mini-flow-wave-backdrop-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          {layers.map((layer) => (
            <WaveBand
              key={layer.key}
              d={layer.d}
              fill={layer.fill}
              scrollDriftX={layer.scrollDriftX}
              idlePeriodPx={layer.idlePeriodPx}
              idleDurationSec={layer.idleDurationSec}
              idleDirection={layer.idleDirection}
              idleEnabled={idleEnabled}
              opacity={layer.opacity}
            />
          ))}
        </g>
        <motion.g style={{ x: driftSky }}>
          <motion.path
            d={crestD}
            fill="none"
            stroke="rgba(255,255,255,0.46)"
            strokeWidth={1.15}
            vectorEffect="non-scaling-stroke"
            initial={{ x: 0 }}
            animate={
              idleEnabled
                ? { x: [0, SKY_WAVELENGTH] }
                : { x: 0 }
            }
            transition={
              idleEnabled
                ? {
                    duration: 42,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'linear',
                  }
                : undefined
            }
          />
        </motion.g>
      </svg>
    </div>
  )
}
