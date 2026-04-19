import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import {
  ArrowRightIcon,
  InformationCircleIcon,
  MinusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useCompare } from '@/contexts/CompareContext'
import {
  LINEUP_COLUMN_META,
  LINEUP_COMPARISON_ROWS,
  type LineupColumnKey,
} from './lineupCompareData'

/**
 * Right-side drawer that renders a focused side-by-side view of the variants
 * the visitor has added via CompareChip. Uses the same shared data set as the
 * on-page "Which one do I need?" table so copy stays in lockstep.
 */
export function CompareDrawer() {
  const { items, isDrawerOpen, closeDrawer, remove, clear } = useCompare()

  return (
    <Dialog
      open={isDrawerOpen}
      onClose={closeDrawer}
      className="relative z-[110]"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          transition
          className={cn(
            'flex h-full w-full flex-col bg-white shadow-2xl transition',
            'data-[closed]:translate-x-full',
            'data-[enter]:duration-250 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in',
            'sm:max-w-xl md:max-w-3xl lg:max-w-4xl'
          )}
        >
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                Compare your lineup
              </DialogTitle>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Side-by-side on the metrics that drive the install decision. Copy stays aligned with
                the full "Which one do I need?" table.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {items.length > 0 ? (
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  Clear all
                </button>
              ) : null}
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close compare drawer"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            {items.length === 0 ? (
              <EmptyState onClose={closeDrawer} />
            ) : (
              <CompareContent items={items} onRemove={remove} />
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="rounded-full bg-slate-100 p-3 text-slate-500">
        <InformationCircleIcon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">Nothing to compare yet</h3>
      <p className="max-w-sm text-xs text-slate-500">
        Tap <strong>Add to compare</strong> on the Standard, WiFi, or Bundle variant to pin it here.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        Close
      </button>
    </div>
  )
}

function CellValue({ text }: { text: string }) {
  const trimmed = text.trim()
  if (trimmed === '—') {
    return (
      <span
        className="inline-flex items-center gap-1 text-slate-400"
        aria-label="Not applicable"
      >
        <MinusIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
        <span className="sr-only">Not applicable</span>
      </span>
    )
  }
  return <span className="text-slate-700">{text}</span>
}

function CompareContent({
  items,
  onRemove,
}: {
  items: LineupColumnKey[]
  onRemove: (key: LineupColumnKey) => void
}) {
  return (
    <div className="space-y-4">
      {/* Column headers */}
      <div
        className={cn(
          'grid gap-3',
          items.length === 1 && 'grid-cols-[minmax(0,1fr)]',
          items.length === 2 && 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
          items.length === 3 && 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]'
        )}
      >
        {items.map((key) => {
          const meta = LINEUP_COLUMN_META[key]
          return (
            <div
              key={key}
              className={cn(
                'relative rounded-xl border bg-white p-3 shadow-sm',
                meta.highlight
                  ? 'border-sky-300 ring-2 ring-sky-200'
                  : 'border-slate-200'
              )}
            >
              <button
                type="button"
                onClick={() => onRemove(key)}
                className="absolute right-1.5 top-1.5 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label={`Remove ${meta.title} from compare`}
              >
                <XMarkIcon className="h-4 w-4" aria-hidden />
              </button>
              <h3 className="pr-6 text-sm font-bold leading-snug text-slate-900">
                {meta.title}
              </h3>
              <p className="mt-1 text-xs leading-snug text-slate-500">
                {meta.subtitle}
              </p>
            </div>
          )
        })}
      </div>

      {/* Rows */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <dl>
          {LINEUP_COMPARISON_ROWS.map((row, rowIdx) => (
            <div
              key={row.id}
              className={cn(
                'grid gap-3 border-t border-slate-200 px-3 py-3 sm:px-4',
                rowIdx === 0 && 'border-t-0',
                'grid-cols-1',
                items.length === 1 && 'sm:grid-cols-[160px_minmax(0,1fr)]',
                items.length === 2 && 'sm:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)]',
                items.length === 3 &&
                  'sm:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]'
              )}
            >
              <dt className="flex items-start gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal sm:text-slate-800">
                <span className="min-w-0 leading-snug">{row.label}</span>
                {row.hint ? (
                  <InformationCircleIcon
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden
                    title={row.hint}
                  />
                ) : null}
              </dt>
              {items.map((key) => (
                <dd
                  key={key}
                  className="text-sm leading-snug text-slate-700"
                  aria-label={`${row.label} for ${LINEUP_COLUMN_META[key].title}`}
                >
                  <span className="block sm:hidden text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {LINEUP_COLUMN_META[key].title}
                  </span>
                  <CellValue text={row.cells[key]} />
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </div>

      {/* CTAs */}
      <div
        className={cn(
          'grid gap-3',
          items.length === 1 && 'grid-cols-1',
          items.length === 2 && 'grid-cols-1 sm:grid-cols-2',
          items.length === 3 && 'grid-cols-1 sm:grid-cols-3'
        )}
      >
        {items.map((key) => {
          const meta = LINEUP_COLUMN_META[key]
          return (
            <Link
              key={key}
              to={meta.href}
              onClick={() => {
                /* leave drawer open so the user can return to it via route back */
              }}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                meta.highlight
                  ? 'bg-sky-600 text-white hover:bg-sky-500'
                  : 'bg-slate-900 text-white hover:bg-slate-800',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2'
              )}
            >
              {meta.cta}
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </Link>
          )
        })}
      </div>

      <p className="text-center text-xs text-slate-500">
        Need the full spec table? Scroll to "Which one do I need?" on the Products page.
      </p>
    </div>
  )
}
