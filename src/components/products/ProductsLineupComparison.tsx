import { Link } from 'react-router-dom'
import { ArrowRightIcon, InformationCircleIcon, MinusIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { PRODUCT_NAMES, SENSOR_STANDARD_SHORT, SENSOR_WIFI_SHORT } from '@/config/acdwKnowledge'
import { CompareChip } from './CompareChip'
import {
  LINEUP_COLUMN_META,
  LINEUP_COLUMN_ORDER,
  LINEUP_COMPARISON_ROWS,
  type LineupColumnKey,
} from './lineupCompareData'

function CellValue({ text }: { text: string }) {
  const trimmed = text.trim()
  if (trimmed === '—') {
    return (
      <span className="inline-flex items-center gap-1 text-slate-400" aria-label="Not applicable">
        <MinusIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
        <span className="sr-only">Not applicable</span>
      </span>
    )
  }
  return <span className="text-slate-700">{text}</span>
}

function RowLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <span className="inline-flex max-w-[13rem] items-start gap-1.5 sm:max-w-none">
      <span className="min-w-0 leading-snug">{label}</span>
      {hint ? (
        <InformationCircleIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
          aria-hidden
          title={hint}
        />
      ) : null}
    </span>
  )
}

export function ProductsLineupComparison({ className }: { className?: string }) {
  return (
    <div className={cn('products-lineup-comparison', className)}>
      {/* Desktop / tablet: table */}
      <div className="products-lineup-comparison-table-wrap hidden overflow-x-auto md:block">
        <table className="products-lineup-comparison-table w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Comparison of {SENSOR_STANDARD_SHORT}, {SENSOR_WIFI_SHORT}, and {PRODUCT_NAMES.bundle}
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="products-lineup-comparison-th products-lineup-comparison-th--feature w-[28%] rounded-tl-xl"
              >
                <span className="sr-only">Feature</span>
              </th>
              {LINEUP_COLUMN_ORDER.map((key) => {
                const col = LINEUP_COLUMN_META[key]
                return (
                  <th
                    key={key}
                    scope="col"
                    className={cn(
                      'products-lineup-comparison-th w-[24%] px-4 py-4 align-bottom',
                      col.highlight && 'products-lineup-comparison-th--pop',
                      key === 'combo' && 'rounded-tr-xl'
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold leading-tight text-slate-900">{col.title}</span>
                        <span className="text-xs font-medium leading-snug text-slate-500">
                          {col.subtitle}
                        </span>
                      </div>
                      <CompareChip variant={key} shortLabel />
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {LINEUP_COMPARISON_ROWS.map((row) => (
              <tr key={row.id} className="products-lineup-comparison-tr">
                <th
                  scope="row"
                  className="products-lineup-comparison-rowhead px-4 py-3 font-semibold text-slate-800"
                  {...(row.hint ? { 'aria-describedby': `products-lineup-hint-${row.id}` } : {})}
                >
                  <RowLabel label={row.label} hint={row.hint} />
                </th>
                {LINEUP_COLUMN_ORDER.map((key) => (
                  <td
                    key={key}
                    className={cn(
                      'products-lineup-comparison-td px-4 py-3 align-top',
                      LINEUP_COLUMN_META[key].highlight && 'products-lineup-comparison-td--pop'
                    )}
                  >
                    <CellValue text={row.cells[key]} />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="products-lineup-comparison-tr products-lineup-comparison-tr--cta">
              <th
                scope="row"
                className="products-lineup-comparison-rowhead rounded-bl-xl px-4 py-4 font-semibold text-slate-800"
              >
                Next step
              </th>
              {LINEUP_COLUMN_ORDER.map((key, colIdx) => {
                const col = LINEUP_COLUMN_META[key]
                const isLast = colIdx === 2
                return (
                  <td
                    key={key}
                    className={cn(
                      'products-lineup-comparison-td px-4 py-4 align-top',
                      col.highlight && 'products-lineup-comparison-td--pop',
                      isLast && 'rounded-br-xl'
                    )}
                  >
                    <Link
                      to={col.href}
                      className="products-lineup-comparison-cta inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition"
                    >
                      {col.cta}
                      <ArrowRightIcon className="h-4 w-4" aria-hidden />
                    </Link>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {LINEUP_COLUMN_ORDER.map((key) => {
          const col = LINEUP_COLUMN_META[key]
          return (
            <div
              key={key}
              className={cn(
                'products-lineup-comparison-card rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm',
                col.highlight && 'products-lineup-comparison-card--pop ring-2 ring-sky-500/25'
              )}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-slate-900">{col.title}</h3>
                  <p className="mt-1 text-xs leading-snug text-slate-500">{col.subtitle}</p>
                </div>
                <CompareChip variant={key} shortLabel className="shrink-0" />
              </div>
              <ul className="mt-3 space-y-3">
                {LINEUP_COMPARISON_ROWS.map((row) => (
                  <li key={row.id}>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {row.label}
                      {row.hint ? (
                        <span className="sr-only"> — {row.hint}</span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-sm">
                      <CellValue text={row.cells[key]} />
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                to={col.href}
                className="products-lineup-comparison-cta mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition"
              >
                {col.cta}
                <ArrowRightIcon className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="sr-only">
        {LINEUP_COMPARISON_ROWS.filter((r) => r.hint).map((row) => (
          <span key={`lineup-hint-${row.id}`} id={`products-lineup-hint-${row.id}`}>
            {row.hint}
          </span>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Contractor-only lineup. Wi‑Fi features apply to the WiFi Sensor Switch only. Connectivity is 2.4 GHz Wi‑Fi; 5
        GHz is not supported.
      </p>
    </div>
  )
}

export type { LineupColumnKey }
