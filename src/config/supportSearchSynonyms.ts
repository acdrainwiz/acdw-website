/**
 * Synonym groups and common typo corrections for Support Hub search (slice 3).
 * Tokens are matched case-insensitively; keep entries lowercase.
 */

/** If the user types a token in a group, also score matches for sibling terms (avoid overly broad groups). */
export const SUPPORT_SEARCH_SYNONYM_GROUPS: string[][] = [
  ['wifi', 'wi-fi', 'wi fi', 'wireless'],
  ['non-wifi', 'non wifi', 'nonwifi'],
  ['install', 'installation'],
  ['setup', 'guide'],
  ['monitor', 'monitoring'],
  ['portal', 'dashboard'],
  ['sensor', 'sensors'],
  ['warranty', 'return', 'returns'],
]

/** Single-token typo / shorthand → canonical token for matching (not shown to users). */
export const SUPPORT_SEARCH_TYPO_MAP: Record<string, string> = {
  drane: 'drain',
  senser: 'sensor',
  sensers: 'sensors',
  instal: 'install',
  intall: 'install',
  wirless: 'wireless',
  wif: 'wifi',
  plumming: 'plumbing',
  plumging: 'plumbing',
}
