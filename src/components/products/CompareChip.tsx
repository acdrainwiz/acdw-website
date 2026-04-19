import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useCompare } from '@/contexts/CompareContext'
import {
  LINEUP_COLUMN_META,
  type LineupColumnKey,
} from './lineupCompareData'

export type CompareChipProps = {
  variant: LineupColumnKey
  className?: string
  /**
   * `'pill'` — rounded pill for use near CTAs and card headers.
   * `'link'` — underlined text link for dense column headers.
   */
  style?: 'pill' | 'link'
  /** Optional shorter label override for tight spaces. */
  shortLabel?: boolean
}

/**
 * Toggle button that adds/removes a variant from the persistent Compare tray.
 * Falls back to disabled state when the max (3) is already selected.
 */
export function CompareChip({
  variant,
  className,
  style = 'pill',
  shortLabel,
}: CompareChipProps) {
  const { isSelected, toggle, canAddMore } = useCompare()
  const selected = isSelected(variant)
  const disabled = !selected && !canAddMore

  const meta = LINEUP_COLUMN_META[variant]
  const readableName = meta?.title ?? variant
  const label = selected
    ? shortLabel
      ? 'Added'
      : 'Added to compare'
    : shortLabel
      ? 'Compare'
      : 'Add to compare'

  const ariaLabel = selected
    ? `Remove ${readableName} from compare`
    : disabled
      ? `Compare full — remove a variant before adding ${readableName}`
      : `Add ${readableName} to compare`

  if (style === 'link') {
    return (
      <button
        type="button"
        onClick={() => toggle(variant)}
        disabled={disabled}
        aria-pressed={selected}
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center gap-1 text-xs font-semibold transition',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 rounded',
          selected
            ? 'text-sky-700 hover:text-sky-800'
            : disabled
              ? 'cursor-not-allowed text-slate-400'
              : 'text-slate-600 hover:text-sky-700',
          className
        )}
      >
        {selected ? (
          <CheckIcon className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <PlusIcon className="h-3.5 w-3.5" aria-hidden />
        )}
        <span>{label}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => toggle(variant)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1',
        selected
          ? 'border-sky-600 bg-sky-50 text-sky-700 hover:bg-sky-100'
          : disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
            : 'border-slate-300 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-700',
        className
      )}
    >
      {selected ? (
        <CheckIcon className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <PlusIcon className="h-3.5 w-3.5" aria-hidden />
      )}
      <span>{label}</span>
    </button>
  )
}
