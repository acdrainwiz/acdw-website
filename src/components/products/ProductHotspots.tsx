import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export type HotspotAlign = 'top' | 'right' | 'bottom' | 'left'

export type Hotspot = {
  id: string
  /** Horizontal center as a percentage of the image width (0–100). */
  xPct: number
  /** Vertical center as a percentage of the image height (0–100). */
  yPct: number
  label: string
  description: string
  /** Inline callout placement relative to the dot. Defaults to 'right'. */
  align?: HotspotAlign
}

export type ProductHotspotsProps = {
  imageSrc: string
  imageAlt: string
  hotspots: Hotspot[]
  className?: string
  imgClassName?: string
  loading?: 'eager' | 'lazy'
  /** Show a brief onboarding chip until the user opens the first hotspot. */
  showHint?: boolean
  /**
   * Dev-only calibration mode. When true, dots become draggable and a
   * toolbar with live coordinates + "Copy JSON" is rendered. Gate this with
   * `import.meta.env.DEV` at the call site so it never ships to production.
   */
  calibrate?: boolean
}

const MOBILE_MAX_PX = 767

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n))
const round1 = (n: number) => Math.round(n * 10) / 10

export function ProductHotspots({
  imageSrc,
  imageAlt,
  hotspots,
  className,
  imgClassName,
  loading = 'lazy',
  showHint = true,
  calibrate = false,
}: ProductHotspotsProps) {
  const reduceMotion = useReducedMotion()
  const baseId = useId()
  const containerRef = useRef<HTMLElement | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)

  // --- Calibration state ---------------------------------------------------
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    Object.fromEntries(hotspots.map((h) => [h.id, { x: h.xPct, y: h.yPct }]))
  )
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [cursorPct, setCursorPct] = useState<{ x: number; y: number } | null>(null)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  // Re-sync local positions if the input hotspots array changes (hot reload / page nav).
  useEffect(() => {
    setPositions(Object.fromEntries(hotspots.map((h) => [h.id, { x: h.xPct, y: h.yPct }])))
  }, [hotspots])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Effective hotspots used for rendering: calibrate mode uses local state, otherwise props.
  const effectiveHotspots = useMemo(
    () =>
      calibrate
        ? hotspots.map((h) => ({
            ...h,
            xPct: positions[h.id]?.x ?? h.xPct,
            yPct: positions[h.id]?.y ?? h.yPct,
          }))
        : hotspots,
    [calibrate, hotspots, positions]
  )

  const activeHotspot = openId ? effectiveHotspots.find((h) => h.id === openId) ?? null : null
  const mobileSheetOpen = !calibrate && Boolean(activeHotspot) && isMobile
  const inlinePopoverEnabled = !calibrate && !isMobile

  // Refs used to (a) restore focus to the originating trigger when the inline
  // popover closes and (b) auto-focus the close button when it opens.
  const lastOpenedById = useRef<string | null>(null)
  const popoverCloseButtonRef = useRef<HTMLButtonElement | null>(null)

  // Track which trigger launched the popover so we can restore focus on close.
  useEffect(() => {
    if (openId) {
      lastOpenedById.current = openId
    }
  }, [openId])

  // Auto-focus close button when the inline popover appears (desktop only).
  useEffect(() => {
    if (!inlinePopoverEnabled || !openId) return
    const raf = window.requestAnimationFrame(() => {
      popoverCloseButtonRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(raf)
  }, [inlinePopoverEnabled, openId])

  // Return focus to the originating dot when the inline popover closes.
  const prevOpenRef = useRef<string | null>(null)
  useEffect(() => {
    if (prevOpenRef.current && !openId && inlinePopoverEnabled) {
      const originator = lastOpenedById.current
      if (originator) {
        const el = containerRef.current?.querySelector<HTMLButtonElement>(
          `[data-hotspot-id="${originator}"]`
        )
        el?.focus()
      }
    }
    prevOpenRef.current = openId
  }, [openId, inlinePopoverEnabled])

  // Dismiss the inline popover on outside click / tap.
  useEffect(() => {
    if (!inlinePopoverEnabled || !openId) return
    const handlePointer = (e: PointerEvent) => {
      const container = containerRef.current
      if (!container) return
      const target = e.target as Node | null
      if (target && !container.contains(target)) {
        setOpenId(null)
      }
    }
    window.addEventListener('pointerdown', handlePointer)
    return () => window.removeEventListener('pointerdown', handlePointer)
  }, [inlinePopoverEnabled, openId])

  const focusSibling = useCallback(
    (currentIndex: number, delta: number) => {
      if (hotspots.length === 0) return
      const next = (currentIndex + delta + hotspots.length) % hotspots.length
      const el = containerRef.current?.querySelector<HTMLButtonElement>(
        `[data-hotspot-index="${next}"]`
      )
      el?.focus()
    },
    [hotspots.length]
  )

  const handleKey = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const { key } = event
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        event.preventDefault()
        focusSibling(index, 1)
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        event.preventDefault()
        focusSibling(index, -1)
      } else if (key === 'Escape') {
        setOpenId(null)
      } else if (key === 'Home') {
        event.preventDefault()
        focusSibling(-1, 1)
      } else if (key === 'End') {
        event.preventDefault()
        focusSibling(hotspots.length, -1)
      }
    },
    [focusSibling, hotspots.length]
  )

  // --- Drag handlers (calibrate only) -------------------------------------
  const computePct = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return null
    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100),
    }
  }, [])

  const handleDotPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>, id: string) => {
      if (!calibrate) return
      e.preventDefault()
      ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
      setDraggingId(id)
    },
    [calibrate]
  )

  const handleDotPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>, id: string) => {
      if (!calibrate || draggingId !== id) return
      const pct = computePct(e.clientX, e.clientY)
      if (!pct) return
      setPositions((prev) => ({ ...prev, [id]: pct }))
    },
    [calibrate, draggingId, computePct]
  )

  const handleDotPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (!calibrate) return
      try {
        ;(e.currentTarget as Element).releasePointerCapture?.(e.pointerId)
      } catch {
        /* ignore */
      }
      setDraggingId(null)
    },
    [calibrate]
  )

  const handleFigurePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!calibrate) return
      const pct = computePct(e.clientX, e.clientY)
      if (pct) setCursorPct(pct)
    },
    [calibrate, computePct]
  )

  const handleFigurePointerLeave = useCallback(() => {
    if (!calibrate) return
    setCursorPct(null)
  }, [calibrate])

  // --- Toolbar actions ----------------------------------------------------
  const buildJsonOutput = useCallback(() => {
    const lines = effectiveHotspots.map((h) => {
      const pieces: string[] = []
      pieces.push(`    id: '${h.id}',`)
      pieces.push(`    label: ${JSON.stringify(h.label)},`)
      pieces.push(`    description: ${JSON.stringify(h.description)},`)
      pieces.push(`    xPct: ${round1(h.xPct)},`)
      pieces.push(`    yPct: ${round1(h.yPct)},`)
      if (h.align) pieces.push(`    align: '${h.align}',`)
      return `  {\n${pieces.join('\n')}\n  },`
    })
    return `[\n${lines.join('\n')}\n]`
  }, [effectiveHotspots])

  const handleCopy = useCallback(async () => {
    const text = buildJsonOutput()
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        throw new Error('Clipboard API unavailable')
      }
      setCopyStatus('copied')
      // Always print to the console as a reliable fallback.
      // eslint-disable-next-line no-console
      console.log('[ProductHotspots] Calibrated positions:\n' + text)
    } catch {
      setCopyStatus('error')
      // eslint-disable-next-line no-console
      console.log('[ProductHotspots] Calibrated positions (copy failed, paste from here):\n' + text)
    }
    window.setTimeout(() => setCopyStatus('idle'), 1800)
  }, [buildJsonOutput])

  const handleReset = useCallback(() => {
    setPositions(Object.fromEntries(hotspots.map((h) => [h.id, { x: h.xPct, y: h.yPct }])))
  }, [hotspots])

  return (
    <figure
      ref={containerRef}
      className={cn('relative inline-block w-full select-none', className)}
      onPointerMove={calibrate ? handleFigurePointerMove : undefined}
      onPointerLeave={calibrate ? handleFigurePointerLeave : undefined}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        loading={loading}
        decoding="async"
        draggable={false}
        className={cn('block h-auto w-full', imgClassName)}
      />

      {/* Calibrate grid overlay (dev-only) */}
      {calibrate ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(56,189,248,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.35) 1px, transparent 1px), linear-gradient(to right, rgba(56,189,248,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.18) 1px, transparent 1px)',
              backgroundSize: '25% 25%, 25% 25%, 5% 5%, 5% 5%',
              backgroundPosition: '0 0, 0 0, 0 0, 0 0',
            }}
          />
          {/* Center crosshairs at 50/50 for sanity */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(244,114,182,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,114,182,0.55) 1px, transparent 1px)',
              backgroundSize: '50% 50%',
              backgroundPosition: '50% 50%',
            }}
          />
          {cursorPct ? (
            <div
              aria-hidden
              className="pointer-events-none absolute z-20 rounded-md bg-slate-900/85 px-2 py-1 text-[11px] font-mono text-white shadow-md"
              style={{
                left: `${cursorPct.x}%`,
                top: `${cursorPct.y}%`,
                transform: 'translate(10px, 10px)',
              }}
            >
              {round1(cursorPct.x)}, {round1(cursorPct.y)}
            </div>
          ) : null}
        </>
      ) : null}

      {!calibrate && showHint && !hintDismissed ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-slate-900/75 px-3 py-1 text-xs font-medium text-white shadow-md backdrop-blur-sm sm:top-4"
          initial={reduceMotion ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.28 }}
        >
          Tap a dot to learn more
        </motion.span>
      ) : null}

      <ol className="pointer-events-none absolute inset-0 m-0 list-none p-0">
        {effectiveHotspots.map((h, i) => {
          const popoverId = `${baseId}-popover-${h.id}`
          const isOpen = openId === h.id
          const align: HotspotAlign = h.align ?? 'right'
          const isDragging = draggingId === h.id
          return (
            <li
              key={h.id}
              className="absolute h-0 w-0"
              style={{ left: `${h.xPct}%`, top: `${h.yPct}%` } as CSSProperties}
            >
              <motion.button
                type="button"
                data-hotspot-index={i}
                data-hotspot-id={h.id}
                aria-label={h.label}
                aria-expanded={calibrate ? undefined : isOpen}
                aria-controls={calibrate ? undefined : popoverId}
                aria-haspopup={calibrate ? undefined : 'dialog'}
                onClick={() => {
                  if (calibrate) return
                  setHintDismissed(true)
                  setOpenId(isOpen ? null : h.id)
                }}
                onKeyDown={calibrate ? undefined : (e) => handleKey(e, i)}
                onPointerDown={(e) => handleDotPointerDown(e, h.id)}
                onPointerMove={(e) => handleDotPointerMove(e, h.id)}
                onPointerUp={handleDotPointerUp}
                onPointerCancel={handleDotPointerUp}
                className={cn(
                  'pointer-events-auto absolute rounded-full bg-transparent p-0',
                  'outline-none focus-visible:ring-4 focus-visible:ring-sky-400/70',
                  calibrate ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'
                )}
                // Let Framer Motion own the full transform (translate + scale) so
                // `whileHover`/`whileTap` can animate `scale` without clobbering the
                // centering offset the way a Tailwind translate class would.
                style={{ x: '-50%', y: '-50%' }}
                initial={false}
                whileHover={calibrate || reduceMotion ? undefined : { scale: 1.12 }}
                whileTap={calibrate || reduceMotion ? undefined : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              >
                <span className="sr-only">
                  {calibrate ? `Drag to reposition: ${h.label}` : `Open details: ${h.label}`}
                </span>
                <span
                  className={cn(
                    'relative flex h-6 w-6 items-center justify-center',
                    isOpen && !calibrate && 'z-10'
                  )}
                  aria-hidden
                >
                  {!calibrate && !reduceMotion ? (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-sky-400/60"
                      animate={{
                        scale: [1, 1.9, 1],
                        opacity: [0.55, 0, 0.55],
                      }}
                      transition={{
                        duration: 1.9,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: i * 0.18,
                      }}
                    />
                  ) : null}
                  <span
                    className={cn(
                      'relative inline-flex h-3.5 w-3.5 rounded-full bg-white shadow-[0_2px_6px_rgba(2,6,23,0.35)]',
                      calibrate
                        ? isDragging
                          ? 'ring-[3px] ring-amber-500'
                          : 'ring-[3px] ring-fuchsia-500'
                        : 'ring-[3px] ring-sky-500'
                    )}
                  />
                </span>
              </motion.button>

              {/* Calibrate coord label next to each dot */}
              {calibrate ? (
                <span
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono text-[10px] shadow-sm',
                    isDragging
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-900/85 text-white'
                  )}
                  style={{
                    transform: 'translate(10px, -140%)',
                  }}
                >
                  {h.id} · {round1(h.xPct)}, {round1(h.yPct)}
                </span>
              ) : null}

              <AnimatePresence>
                {inlinePopoverEnabled && isOpen ? (
                  <motion.div
                    key="popover"
                    id={popoverId}
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby={`${popoverId}-title`}
                    aria-describedby={`${popoverId}-desc`}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.stopPropagation()
                        setOpenId(null)
                      }
                    }}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
                    transition={{
                      duration: reduceMotion ? 0.15 : 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      'pointer-events-auto absolute z-20 w-64 max-w-[80vw] rounded-xl bg-white p-4',
                      'shadow-[0_18px_40px_-12px_rgba(2,6,23,0.35)] ring-1 ring-slate-200',
                      align === 'right' && 'left-6 top-1/2 -translate-y-1/2',
                      align === 'left' && 'right-6 top-1/2 -translate-y-1/2',
                      align === 'top' && 'bottom-6 left-1/2 -translate-x-1/2',
                      align === 'bottom' && 'top-6 left-1/2 -translate-x-1/2'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4
                        id={`${popoverId}-title`}
                        className="text-sm font-semibold leading-tight text-slate-900"
                      >
                        {h.label}
                      </h4>
                      <button
                        ref={popoverCloseButtonRef}
                        type="button"
                        aria-label={`Close ${h.label} details`}
                        className="-m-1 rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        onClick={() => setOpenId(null)}
                      >
                        <XMarkIcon className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <p
                      id={`${popoverId}-desc`}
                      className="mt-2 text-[13px] leading-relaxed text-slate-600"
                    >
                      {h.description}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>

      {/* Calibrate toolbar */}
      {calibrate ? (
        <div className="pointer-events-auto absolute left-1/2 top-3 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-xs font-medium text-white shadow-lg ring-1 ring-white/10 backdrop-blur">
          <span className="rounded-full bg-fuchsia-500/90 px-2 py-0.5 text-[10px] uppercase tracking-wide">
            Calibrate
          </span>
          <span className="hidden sm:inline text-slate-200">
            Drag dots · pink center lines = 50/50
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full bg-white/10 px-3 py-1 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {copyStatus === 'copied'
              ? 'Copied!'
              : copyStatus === 'error'
                ? 'See console'
                : 'Copy JSON'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full bg-white/10 px-3 py-1 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Reset
          </button>
        </div>
      ) : null}

      <Dialog
        open={mobileSheetOpen}
        onClose={() => setOpenId(null)}
        className="relative z-50 md:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <div className="fixed inset-x-0 bottom-0 flex justify-center">
          <DialogPanel
            className={cn(
              'w-full rounded-t-2xl bg-white p-5 pb-8 shadow-2xl ring-1 ring-slate-200',
              'data-[closed]:translate-y-full data-[open]:translate-y-0',
              'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
            )}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" aria-hidden />
            <DialogTitle className="text-base font-semibold text-slate-900">
              {activeHotspot?.label}
            </DialogTitle>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {activeHotspot?.description}
            </p>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
            >
              Close
            </button>
          </DialogPanel>
        </div>
      </Dialog>

      <ol className="sr-only">
        {effectiveHotspots.map((h) => (
          <li key={`${h.id}-sr`}>
            <strong>{h.label}.</strong> {h.description}
          </li>
        ))}
      </ol>
    </figure>
  )
}

export default ProductHotspots
