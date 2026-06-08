import { isLocalDevEnvironment } from './isLocalDevEnvironment'

/** Must match `accessGate.queryParam` in complimentaryMiniRequestCopy.ts */
const ACCESS_QUERY_PARAM = 'access'

const STORAGE_KEY = 'complimentary-mini-access-token'
const SUBMISSION_COMPLETE_KEY = 'complimentary-mini-submission-complete'

const EXPECTED_ACCESS_TOKEN = (
  import.meta.env.VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN as string | undefined
)?.trim()

function tokensMatch(submitted: string, expected: string): boolean {
  if (!submitted || !expected || submitted.length !== expected.length) return false

  let mismatch = 0
  for (let i = 0; i < submitted.length; i += 1) {
    mismatch |= submitted.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}

export function getComplimentaryMiniAccessQueryParam(): string {
  return ACCESS_QUERY_PARAM
}

export function persistComplimentaryMiniAccessToken(token: string): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(STORAGE_KEY, token)
}

export function getStoredComplimentaryMiniAccessToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  const stored = sessionStorage.getItem(STORAGE_KEY)?.trim()
  return stored || null
}

export function clearComplimentaryMiniAccessToken(): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}

export function markComplimentaryMiniSubmissionComplete(): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(SUBMISSION_COMPLETE_KEY, '1')
}

export function isComplimentaryMiniSubmissionComplete(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(SUBMISSION_COMPLETE_KEY) === '1'
}

export function finalizeComplimentaryMiniSubmission(): void {
  clearComplimentaryMiniAccessToken()
  markComplimentaryMiniSubmissionComplete()
}

export function resolveComplimentaryMiniAccess(searchParams: URLSearchParams): {
  granted: boolean
  token: string | null
} {
  if (!EXPECTED_ACCESS_TOKEN) {
    if (isLocalDevEnvironment()) {
      console.warn(
        '[DEV] VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN is not set — complimentary Mini page access gate is open locally only.',
      )
      return { granted: true, token: null }
    }
    return { granted: false, token: null }
  }

  const fromUrl = searchParams.get(ACCESS_QUERY_PARAM)?.trim() || ''
  if (fromUrl && tokensMatch(fromUrl, EXPECTED_ACCESS_TOKEN)) {
    persistComplimentaryMiniAccessToken(fromUrl)
    return { granted: true, token: fromUrl }
  }

  const stored = getStoredComplimentaryMiniAccessToken()
  if (stored && tokensMatch(stored, EXPECTED_ACCESS_TOKEN)) {
    return { granted: true, token: stored }
  }

  return { granted: false, token: null }
}

export function applyComplimentaryMiniPageSeo(pageTitle: string): () => void {
  if (typeof document === 'undefined') return () => {}

  const previousTitle = document.title
  document.title = pageTitle

  let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  const createdRobotsMeta = !robotsMeta
  const previousRobotsContent = robotsMeta?.getAttribute('content') ?? null

  if (!robotsMeta) {
    robotsMeta = document.createElement('meta')
    robotsMeta.setAttribute('name', 'robots')
    document.head.appendChild(robotsMeta)
  }
  robotsMeta.setAttribute('content', 'noindex, nofollow')

  return () => {
    document.title = previousTitle
    if (!robotsMeta) return
    if (createdRobotsMeta) {
      robotsMeta.remove()
    } else if (previousRobotsContent !== null) {
      robotsMeta.setAttribute('content', previousRobotsContent)
    } else {
      robotsMeta.removeAttribute('content')
    }
  }
}
