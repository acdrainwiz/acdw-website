/** True when running the Vite dev server or local hostname (form simulate path). */
export function isLocalDevEnvironment(): boolean {
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') return true
  if (typeof window === 'undefined') return false
  const { hostname, port } = window.location
  return hostname === 'localhost' || hostname === '127.0.0.1' || port === '5173'
}
