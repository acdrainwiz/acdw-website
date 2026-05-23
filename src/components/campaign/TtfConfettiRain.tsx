import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  buildTtfConfettiPieces,
  getTtfConfettiCycleEndS,
  type BuildTtfConfettiOptions,
} from '@/components/campaign/ttfConfetti'

type TtfConfettiRainProps = {
  className?: string
  animBaseVar?: string
  options?: BuildTtfConfettiOptions
  /** Seconds of quiet after the last piece falls before the shower restarts. */
  recyclePauseS?: number
}

/**
 * Campaign confetti shower — used in modal prize frame and landing prize section.
 * Restarts after `recyclePauseS` once the slowest piece has finished falling.
 */
export function TtfConfettiRain({
  className,
  animBaseVar = '--ttf-anim-base',
  options,
  recyclePauseS = 15,
}: TtfConfettiRainProps) {
  const reduceMotion = useReducedMotion()
  const [cycle, setCycle] = useState(0)

  const pieces = useMemo(() => buildTtfConfettiPieces(options), [options])

  const cycleMs = useMemo(() => {
    const endS = getTtfConfettiCycleEndS(pieces)
    return Math.round((endS + recyclePauseS) * 1000)
  }, [pieces, recyclePauseS])

  useEffect(() => {
    if (reduceMotion || cycleMs <= 0) return
    const id = window.setInterval(() => {
      setCycle((current) => current + 1)
    }, cycleMs)
    return () => window.clearInterval(id)
  }, [cycleMs, reduceMotion])

  if (reduceMotion) return null

  return (
    <div key={cycle} className={cn('ttf-confetti-rain', className)} aria-hidden>
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
              animationDelay: `calc(var(${animBaseVar}, 0s) + ${piece.delay.toFixed(2)}s)`,
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
