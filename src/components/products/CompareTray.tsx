import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ScaleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useCompare } from '@/contexts/CompareContext'
import {
  LINEUP_COLUMN_META,
  type LineupColumnKey,
} from './lineupCompareData'

/**
 * Persistent floating tray. Appears when at least one lineup variant has been
 * added to compare. Shows quick removal chips, a clear button, and an "Open
 * compare" CTA that launches the CompareDrawer.
 */
export function CompareTray() {
  const { items, remove, clear, openDrawer, isDrawerOpen } = useCompare()
  const reduceMotion = useReducedMotion()

  const shouldShow = items.length > 0 && !isDrawerOpen

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-3 pb-3 sm:justify-end sm:px-6 sm:pb-6"
      aria-live="polite"
    >
      <AnimatePresence>
        {shouldShow ? (
          <motion.div
            key="compare-tray"
            role="region"
            aria-label="Compare selections"
            initial={reduceMotion ? false : { y: 24, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-3 py-2.5 shadow-2xl ring-1 ring-black/20 backdrop-blur sm:max-w-lg sm:px-4 sm:py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/20 ring-1 ring-sky-400/40">
              <ScaleIcon className="h-4 w-4 text-sky-300" aria-hidden />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span>Compare</span>
                <span className="text-slate-500">
                  {items.length} / 3
                </span>
              </div>
              <ul className="flex flex-wrap items-center gap-1.5">
                {items.map((k) => (
                  <CompareTrayItem key={k} variant={k} onRemove={remove} />
                ))}
              </ul>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={clear}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="Clear all compare selections"
                title="Clear all"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={openDrawer}
                disabled={items.length < 2}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
                  items.length < 2
                    ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                    : 'bg-sky-500 text-white hover:bg-sky-400'
                )}
                aria-label={
                  items.length < 2
                    ? 'Add at least two variants to open the compare drawer'
                    : 'Open compare drawer'
                }
              >
                {items.length < 2 ? 'Add another' : 'Compare'}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function CompareTrayItem({
  variant,
  onRemove,
}: {
  variant: LineupColumnKey
  onRemove: (key: LineupColumnKey) => void
}) {
  const meta = LINEUP_COLUMN_META[variant]
  return (
    <li className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 py-0.5 pl-2 pr-1 text-[11px] font-medium text-slate-100">
      <span className="truncate max-w-[9rem]">{meta.title}</span>
      <button
        type="button"
        onClick={() => onRemove(variant)}
        className="rounded-full p-0.5 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        aria-label={`Remove ${meta.title} from compare`}
      >
        <XMarkIcon className="h-3 w-3" aria-hidden />
      </button>
    </li>
  )
}
