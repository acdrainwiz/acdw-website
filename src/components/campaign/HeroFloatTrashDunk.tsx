import { useEffect, useLayoutEffect, useRef } from 'react'

type HeroFloatTrashDunkProps = {
  floatSrc: string
  floatAlt: string
}

const ANIM_MS = 5500
const CLOSED_HOLD_MS = 8000
const CYCLE_MS = ANIM_MS + CLOSED_HOLD_MS
const START_DELAY_MS = 1100

/** Map elapsed cycle time (ms) to normalized float phase 0–1. */
function floatUFromCycleMs(cycleMs: number): number {
  const t = cycleMs % CYCLE_MS
  const dropEndMs = ANIM_MS * 0.4
  const riseDurationMs = ANIM_MS * 0.52

  if (t <= dropEndMs) {
    return (t / dropEndMs) * 0.4
  }

  if (t <= dropEndMs + CLOSED_HOLD_MS) {
    return 0.44
  }

  const riseT = t - dropEndMs - CLOSED_HOLD_MS
  return 0.48 + (riseT / riseDurationMs) * 0.52
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function easeInCubic(t: number) {
  return t * t * t
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function segment(u: number, start: number, end: number) {
  return clamp((u - start) / (end - start), 0, 1)
}

type FloatMotion = { y: number; scale: number; rotate: number }
type LidMotion = { offsetX: number; offsetY: number; rotate: number }
type FloatDrop = { dropY: number; dropScale: number }

const FLOAT_DROP_DEFAULT: FloatDrop = { dropY: 128, dropScale: 0.2 }

/** Float phase 0–1 within one cycle. */
function floatMotion(u: number, drop: FloatDrop = FLOAT_DROP_DEFAULT): FloatMotion {
  const { dropY, dropScale } = drop

  if (u <= 0.08) return { y: 0, scale: 1, rotate: 0 }

  if (u <= 0.4) {
    const t = easeInCubic(segment(u, 0.08, 0.4))
    return {
      y: lerp(0, dropY, t),
      scale: lerp(1, dropScale, t),
      rotate: lerp(0, -10, t),
    }
  }

  if (u <= 0.48) return { y: dropY, scale: dropScale, rotate: -9 }

  if (u <= 0.82) {
    const t = easeOutCubic(segment(u, 0.48, 0.82))
    return {
      y: lerp(dropY, 0, t),
      scale: lerp(dropScale, 1, t),
      rotate: lerp(-9, 0, t),
    }
  }

  return { y: 0, scale: 1, rotate: 0 }
}

const LID_REST_DEFAULT: LidMotion = { offsetX: 16, offsetY: -44, rotate: 22 }
const LID_CLOSED: LidMotion = { offsetX: 0, offsetY: 0, rotate: -2 }

const FLOAT_REST = floatMotion(0)

function readLidRest(dunkEl: HTMLElement | null): LidMotion {
  if (!dunkEl) return { ...LID_REST_DEFAULT }

  const style = getComputedStyle(dunkEl)
  const x = parseFloat(style.getPropertyValue('--ttf-dunk-lid-rest-x'))
  const y = parseFloat(style.getPropertyValue('--ttf-dunk-lid-rest-y'))
  const rotate = parseFloat(style.getPropertyValue('--ttf-dunk-lid-rest-rotate'))

  return {
    offsetX: Number.isFinite(x) ? x : LID_REST_DEFAULT.offsetX,
    offsetY: Number.isFinite(y) ? y : LID_REST_DEFAULT.offsetY,
    rotate: Number.isFinite(rotate) ? rotate : LID_REST_DEFAULT.rotate,
  }
}

function readFloatDrop(dunkEl: HTMLElement | null): FloatDrop {
  if (!dunkEl) return { ...FLOAT_DROP_DEFAULT }

  const style = getComputedStyle(dunkEl)
  const dropY = parseFloat(style.getPropertyValue('--ttf-dunk-float-drop-y'))
  const dropScale = parseFloat(style.getPropertyValue('--ttf-dunk-float-drop-scale'))

  return {
    dropY: Number.isFinite(dropY) ? dropY : FLOAT_DROP_DEFAULT.dropY,
    dropScale: Number.isFinite(dropScale) ? dropScale : FLOAT_DROP_DEFAULT.dropScale,
  }
}

/**
 * Lid pose locked to float phase. The lid always trails the float on the way
 * down and leads it on the way up so the two never collide:
 *  - Drop: lid stays at rest until the float is well inside the can (depth ≥ 0.55),
 *    then sweeps closed as the float disappears.
 *  - Hold: lid fully closed while the float rests at the bottom.
 *  - Rise: lid opens immediately at the start of the rise (before the float moves),
 *    fully clear by the time the float is on its way up.
 */
function lidMotionFromFloatU(floatU: number, lidRest: LidMotion, drop: FloatDrop = FLOAT_DROP_DEFAULT): LidMotion {
  const { y } = floatMotion(floatU, drop)
  const depth = clamp(y / drop.dropY, 0, 1)

  const dropping = floatU > 0.08 && floatU <= 0.4
  const holding = floatU > 0.4 && floatU <= 0.48
  const rising = floatU > 0.48 && floatU <= 0.82

  const CLOSE_DEPTH_START = 0.55
  const CLOSE_DEPTH_END = 0.95

  let t: number
  if (rising) {
    const riseProgress = segment(floatU, 0.48, 0.82)
    const openLead = clamp(1 - riseProgress / 0.22, 0, 1)
    t = openLead
  } else if (dropping) {
    t = clamp((depth - CLOSE_DEPTH_START) / (CLOSE_DEPTH_END - CLOSE_DEPTH_START), 0, 1)
  } else if (holding) {
    t = 1
  } else {
    t = 0
  }

  return {
    offsetX: lerp(lidRest.offsetX, LID_CLOSED.offsetX, t),
    offsetY: lerp(lidRest.offsetY, LID_CLOSED.offsetY, t),
    rotate: lerp(lidRest.rotate, LID_CLOSED.rotate, t),
  }
}

function floatTransform({ y, scale, rotate }: FloatMotion) {
  return `translateX(-50%) translateY(${y}%) rotate(${rotate}deg) scale(${scale})`
}

function lidTransform({ offsetX, offsetY, rotate }: LidMotion) {
  return `translateX(calc(-50% + ${offsetX}%)) translateY(${offsetY}%) rotate(${rotate}deg)`
}

/**
 * Hero left-side beat: mechanical float dunked into the campaign trash can.
 * Lid is phase-locked to the float (close lead on drop, open lead on rise).
 */
export function HeroFloatTrashDunk({ floatSrc, floatAlt }: HeroFloatTrashDunkProps) {
  const dunkRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const lidRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const dunkEl = dunkRef.current
    const floatEl = floatRef.current
    const lidEl = lidRef.current
    if (!floatEl || !lidEl) return

    const lidRest = readLidRest(dunkEl)
    floatEl.style.transform = floatTransform(FLOAT_REST)
    lidEl.style.transform = lidTransform(lidRest)
  }, [])

  useEffect(() => {
    const dunkEl = dunkRef.current
    const floatEl = floatRef.current
    const lidEl = lidRef.current
    if (!floatEl || !lidEl) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const lidRest = readLidRest(dunkEl)
      const drop = readFloatDrop(dunkEl)
      floatEl.style.transform = floatTransform(floatMotion(0, drop))
      lidEl.style.transform = lidTransform(lidRest)
      return
    }

    let frameId = 0

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const lidRest = readLidRest(dunkEl)
      const drop = readFloatDrop(dunkEl)

      const floatElapsed = elapsed - START_DELAY_MS
      if (floatElapsed < 0) {
        floatEl.style.transform = floatTransform(floatMotion(0, drop))
        lidEl.style.transform = lidTransform(lidRest)
      } else {
        const floatU = floatUFromCycleMs(floatElapsed)
        floatEl.style.transform = floatTransform(floatMotion(floatU, drop))
        lidEl.style.transform = lidTransform(lidMotionFromFloatU(floatU, lidRest, drop))
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div ref={dunkRef} className="ttf-page-hero-dunk" aria-hidden>
      <div
        ref={floatRef}
        className="ttf-page-hero-dunk-float-wrap"
        style={{ transform: floatTransform(FLOAT_REST) }}
      >
        <img
          src={floatSrc}
          alt={floatAlt}
          className="ttf-page-hero-dunk-float"
          width={180}
          height={180}
          decoding="async"
          draggable={false}
        />
      </div>

      <svg
        className="ttf-page-hero-dunk-can"
        viewBox="0 0 32 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          className="ttf-page-hero-dunk-body"
          d="M8 13.5h16v17a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 8 30.5v-17Z"
          fill="#ffffff"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          className="ttf-page-hero-dunk-body-ridges"
          d="M12.5 18.5h7M12.5 22h7M12.5 25.5h5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>

      <div
        ref={lidRef}
        className="ttf-page-hero-dunk-lid-wrap"
        style={{ transform: lidTransform(LID_REST_DEFAULT) }}
      >
        <svg
          className="ttf-page-hero-dunk-lid-svg"
          viewBox="0 0 32 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <g className="ttf-page-hero-dunk-lid">
            <path
              d="M6 13.5 8 10.5h16l2 3H6Z"
              fill="#ffffff"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M13.5 8.25h5a1.25 1.25 0 0 0 0-2.5h-5a1.25 1.25 0 0 0 0 2.5Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
