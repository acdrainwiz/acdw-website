/**
 * Trash the Float — read API placeholders (Hall of Fame, winners, live counter).
 *
 * Not wired yet. Backend teammate: implement Netlify functions or CMS endpoints
 * and swap fetch helpers in the landing page components.
 */

export const TRASH_THE_FLOAT_CAMPAIGN_API = {
  /** Approved stories for Float Switch Hall of Fame (#story-spotlight) */
  hallOfFame: '/.netlify/functions/trash-the-float-hall-of-fame',
  /** Monthly winner announcements + selection video metadata */
  winners: '/.netlify/functions/trash-the-float-winners',
  /** Public submission count for counter strip + modal */
  storiesCount: '/.netlify/functions/trash-the-float-stories-count',
} as const

export type TrashTheFloatHallOfFameEntry = {
  id: string
  storyTitle: string
  excerpt: string
  audience: string
  cityState?: string
  publishedAt: string
  mediaUrl?: string
}

export type TrashTheFloatWinnerEntry = {
  id: string
  monthLabel: string
  winnerDisplayName: string
  cityState?: string
  selectionVideoUrl?: string
  announcedAt: string
}

export type TrashTheFloatStoriesCountResponse = {
  count: number
  minDisplay?: number
}
