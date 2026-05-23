import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { scrollToHashTargetWithRetries } from '@/utils/scrollToHashTarget'

type TtfHashLinkProps = {
  hash: string
  className?: string
  children: React.ReactNode
  /** Campaign page path when the target lives on /trash-the-float (default). */
  pathname?: string
}

/**
 * Hash link that scrolls reliably on the Trash the Float page.
 * React Router `Link` with a hash string often won't scroll when already on the route.
 */
export function TtfHashLink({
  hash,
  className,
  children,
  pathname = '/trash-the-float',
}: TtfHashLinkProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const normalizedHash = hash.startsWith('#') ? hash : `#${hash}`
  const targetId = normalizedHash.slice(1)
  const onTargetPage = location.pathname === pathname

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onTargetPage) return

    event.preventDefault()

    if (location.hash !== normalizedHash) {
      navigate({ pathname, hash: normalizedHash })
    }

    scrollToHashTargetWithRetries(targetId)
  }

  return (
    <Link
      to={{ pathname, hash: normalizedHash }}
      className={cn(className)}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}
