/** Deterministic 0–1 (stable across renders — no layout shift on re-render). */
export function ttfConfettiRand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

export const TTF_CONFETTI_COLORS = ['#FF4E00', '#FFC300', '#001A35', '#FF6B2C', '#FFE566'] as const

export const TTF_CONFETTI_FALL_EASE = [
  'cubic-bezier(0.42, 0, 0.72, 0.95)',
  'cubic-bezier(0.35, 0.02, 0.6, 0.88)',
  'cubic-bezier(0.5, 0.05, 0.75, 0.9)',
] as const

export type TtfConfettiPiece = {
  left: string
  delay: number
  duration: number
  dx: number
  dxMid: number
  rot: number
  rotMid: number
  startY: number
  w: number
  h: number
  round: boolean
  ease: string
  color: string
}

export type BuildTtfConfettiOptions = {
  count?: number
  prizeStartS?: number
  spawnWindowS?: number
  seedOffset?: number
  /** Min/max fall duration (seconds) — pieces pick a value in range */
  durationMinS?: number
  durationMaxS?: number
}

/** Latest time (seconds) the last piece finishes falling. */
export function getTtfConfettiCycleEndS(pieces: TtfConfettiPiece[]): number {
  if (pieces.length === 0) return 0
  return pieces.reduce((max, piece) => Math.max(max, piece.delay + piece.duration), 0)
}

/** Negative delay offset so infinite-loop pieces stay desynced across the shower cycle. */
export function getTtfConfettiContinuousOffset(
  piece: TtfConfettiPiece,
  index: number,
  count: number,
  cycleEndS: number,
): number {
  const spread = cycleEndS > 0 ? cycleEndS : piece.delay + piece.duration
  return -(((index + 0.5) / count) * spread + piece.delay * 0.12)
}

/** Scattered “rain” confetti — random spawn times, speeds, drift (not burst waves). */
export function buildTtfConfettiPieces({
  count = 60,
  prizeStartS = 1.88,
  spawnWindowS = 4.5,
  seedOffset = 0,
  durationMinS = 6.4,
  durationMaxS = 11.2,
}: BuildTtfConfettiOptions = {}): TtfConfettiPiece[] {
  const durationSpan = Math.max(0.5, durationMaxS - durationMinS)
  return Array.from({ length: count }, (_, i) => {
    const r = (n: number) => ttfConfettiRand((i + seedOffset) * 31 + n)
    const rot = Math.floor(60 + r(1) * 320)
    const dx = (r(2) > 0.5 ? 1 : -1) * (4 + Math.floor(r(3) * 38))
    return {
      left: `${1 + r(0) * 96}%`,
      delay: prizeStartS + r(4) * spawnWindowS,
      duration: durationMinS + r(5) * durationSpan,
      dx,
      dxMid: Math.round(dx * (0.25 + r(6) * 0.35)),
      rot,
      rotMid: Math.round(rot * (0.3 + r(7) * 0.25)),
      startY: -0.4 - r(8) * 2.2,
      w: 3 + Math.floor(r(9) * 4) * 2,
      h: 3 + Math.floor(r(10) * 5) * 2,
      round: r(11) > 0.78,
      ease: TTF_CONFETTI_FALL_EASE[Math.floor(r(12) * TTF_CONFETTI_FALL_EASE.length)]!,
      color: TTF_CONFETTI_COLORS[Math.floor(r(13) * TTF_CONFETTI_COLORS.length)]!,
    }
  })
}
