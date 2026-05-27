import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  buildTtfConfettiPieces,
  getTtfConfettiContinuousOffset,
  getTtfConfettiCycleEndS,
  type BuildTtfConfettiOptions,
} from '@/components/campaign/ttfConfetti'

type TtfConfettiRainProps = {
  className?: string
  animBaseVar?: string
  options?: BuildTtfConfettiOptions
  /** Steady shower — each piece loops with staggered offsets (no batch recycle). */
  continuous?: boolean
  /** Seconds of quiet after the last piece falls before the shower restarts. */
  recyclePauseS?: number
}

/**
 * Campaign confetti shower — used in modal prize frame and landing prize section.
 * Restarts after `recyclePauseS` once the slowest piece has finished falling,
 * unless `continuous` is enabled.
 */
export function TtfConfettiRain({
  className,
  animBaseVar = '--ttf-anim-base',
  options,
  continuous = false,
  recyclePauseS = 15,
}: TtfConfettiRainProps) {
  const reduceMotion = useReducedMotion()
  const [cycle, setCycle] = useState(0)

  const pieces = useMemo(() => buildTtfConfettiPieces(options), [options])
  const cycleEndS = useMemo(() => getTtfConfettiCycleEndS(pieces), [pieces])

  const cycleMs = useMemo(() => {
    if (continuous) return 0
    return Math.round((cycleEndS + recyclePauseS) * 1000)
  }, [continuous, cycleEndS, recyclePauseS])

  useEffect(() => {
    if (continuous || reduceMotion || cycleMs <= 0) return
    const id = window.setInterval(() => {
      setCycle((current) => current + 1)
    }, cycleMs)
    return () => window.clearInterval(id)
  }, [continuous, cycleMs, reduceMotion])

  if (reduceMotion) return null

  return (
    <div
      key={continuous ? 'continuous' : cycle}
      className={cn('ttf-confetti-rain', continuous && 'ttf-confetti-rain--continuous', className)}
      aria-hidden
    >
      {pieces.map((piece, i) => (
        <span
          key={i}
          className={cn(
            'ttf-confetti-rain-piece',
            piece.round && 'ttf-confetti-rain-piece--round',
          )}
          style={
            {
              left: piece.left,
              width: `${piece.w}px`,
              height: `${piece.h}px`,
              backgroundColor: piece.color,
              animationDelay: continuous
                ? `calc(var(${animBaseVar}, 0s) + ${getTtfConfettiContinuousOffset(piece, i, pieces.length, cycleEndS).toFixed(2)}s)`
                : `calc(var(${animBaseVar}, 0s) + ${piece.delay.toFixed(2)}s)`,
              '--ttf-fall-duration': `${piece.duration.toFixed(2)}s`,
              '--ttf-fall-ease': piece.ease,
              '--ttf-start-y': `${piece.startY.toFixed(2)}rem`,
              '--ttf-dx': `${piece.dx}px`,
              '--ttf-dx-mid': `${piece.dxMid}px`,
              '--ttf-rot': `${piece.rot}deg`,
              '--ttf-rot-mid': `${piece.rotMid}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
