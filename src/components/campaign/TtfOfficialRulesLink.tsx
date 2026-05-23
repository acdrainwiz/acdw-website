import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TRASH_THE_FLOAT_OFFICIAL_RULES_HREF } from '@/config/trashTheFloatOfficialRules'
import { cn } from '@/lib/utils'
import {
  scrollToHashTargetWithRetries,
  TRASH_THE_FLOAT_OFFICIAL_RULES_ID,
} from '@/utils/scrollToHashTarget'

type TtfOfficialRulesLinkProps = {
  className?: string
}

const OFFICIAL_RULES_PATH = '/trash-the-float'
const OFFICIAL_RULES_HASH = `#${TRASH_THE_FLOAT_OFFICIAL_RULES_ID}`

/** Inline link to Trash the Float Official Rules — scrolls reliably on same page and across routes. */
export function TtfOfficialRulesLink({ className }: TtfOfficialRulesLinkProps) {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const onCampaignPage = pathname === OFFICIAL_RULES_PATH

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation()

    if (!onCampaignPage) return

    event.preventDefault()

    if (hash !== OFFICIAL_RULES_HASH) {
      navigate({ pathname: OFFICIAL_RULES_PATH, hash: OFFICIAL_RULES_HASH })
    }

    scrollToHashTargetWithRetries(TRASH_THE_FLOAT_OFFICIAL_RULES_ID)
  }

  return (
    <Link
      to={{ pathname: OFFICIAL_RULES_PATH, hash: OFFICIAL_RULES_HASH }}
      className={cn(className)}
      onClick={handleClick}
    >
      Official Rules
    </Link>
  )
}

/** Re-export for consumers that need the canonical href string (e.g. meta, docs). */
export { TRASH_THE_FLOAT_OFFICIAL_RULES_HREF }
