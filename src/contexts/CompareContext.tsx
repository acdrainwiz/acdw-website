import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  LINEUP_COLUMN_ORDER,
  type LineupColumnKey,
} from '../components/products/lineupCompareData'

/**
 * Persistent lineup-compare selections (Standard / WiFi / Bundle). Backed by
 * sessionStorage so picks survive scrolling and cross-page navigation inside
 * the same tab, but reset on tab close.
 */

const STORAGE_KEY = 'acdw.compareSelections'
const MAX_ITEMS = 3 // we only have three columns today

type CompareContextValue = {
  items: LineupColumnKey[]
  isSelected: (key: LineupColumnKey) => boolean
  toggle: (key: LineupColumnKey) => void
  remove: (key: LineupColumnKey) => void
  clear: () => void
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  canAddMore: boolean
}

const CompareContext = createContext<CompareContextValue | null>(null)

function readFromStorage(): LineupColumnKey[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const allowed = new Set<LineupColumnKey>(LINEUP_COLUMN_ORDER)
    return parsed.filter((v): v is LineupColumnKey =>
      typeof v === 'string' && allowed.has(v as LineupColumnKey)
    )
  } catch {
    return []
  }
}

function writeToStorage(items: LineupColumnKey[]) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore quota / privacy errors
  }
}

/** Keep items in the canonical column order regardless of click order. */
function sortByColumnOrder(items: LineupColumnKey[]): LineupColumnKey[] {
  const index = new Map(LINEUP_COLUMN_ORDER.map((k, i) => [k, i]))
  return [...items].sort((a, b) => (index.get(a) ?? 0) - (index.get(b) ?? 0))
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LineupColumnKey[]>(() => readFromStorage())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    writeToStorage(items)
  }, [items])

  const toggle = useCallback((key: LineupColumnKey) => {
    setItems((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key)
      if (prev.length >= MAX_ITEMS) return prev
      return sortByColumnOrder([...prev, key])
    })
  }, [])

  const remove = useCallback((key: LineupColumnKey) => {
    setItems((prev) => prev.filter((k) => k !== key))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    setIsDrawerOpen(false)
  }, [])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const value = useMemo<CompareContextValue>(
    () => ({
      items,
      isSelected: (key) => items.includes(key),
      toggle,
      remove,
      clear,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      canAddMore: items.length < MAX_ITEMS,
    }),
    [items, isDrawerOpen, toggle, remove, clear, openDrawer, closeDrawer]
  )

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  )
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext)
  if (!ctx) {
    throw new Error('useCompare must be used inside a <CompareProvider>')
  }
  return ctx
}
