/** Scroll to an in-page element by id; retries help after route transitions. */
export function scrollToHashTarget(
  id: string,
  behavior: ScrollBehavior = 'smooth',
): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior, block: 'start', inline: 'nearest' })
  return true
}

/** Retry scroll after navigation — DOM may not be ready on the first frame. */
export function scrollToHashTargetWithRetries(
  id: string,
  behavior: ScrollBehavior = 'smooth',
  delaysMs: number[] = [0, 80, 200, 500],
): void {
  for (const delay of delaysMs) {
    if (delay === 0) {
      requestAnimationFrame(() => scrollToHashTarget(id, behavior))
    } else {
      window.setTimeout(() => scrollToHashTarget(id, behavior), delay)
    }
  }
}

export const TRASH_THE_FLOAT_OFFICIAL_RULES_ID = 'official-rules'
