/**
 * Light-ground mesh for Trash the Float landing page (Option E).
 * Same blob layout as PageHeroMeshBackdrop / mini-hero-v2-mesh, tuned for `.ttf-page`.
 */

type TtfPageMeshBackdropProps = {
  /** hero = full drift; prize = softer spotlight; section = light drift for lower bands */
  variant?: 'hero' | 'prize' | 'section'
  className?: string
}

export function TtfPageMeshBackdrop({
  variant = 'hero',
  className = '',
}: TtfPageMeshBackdropProps) {
  return (
    <div
      className={`ttf-page-mesh ttf-page-mesh--${variant}${className ? ` ${className}` : ''}`}
      aria-hidden
    >
      <span className="ttf-page-mesh-blob ttf-page-mesh-blob--a" />
      <span className="ttf-page-mesh-blob ttf-page-mesh-blob--b" />
      <span className="ttf-page-mesh-blob ttf-page-mesh-blob--c" />
      <span className="ttf-page-mesh-blob ttf-page-mesh-blob--d" />
      <span className="ttf-page-mesh-blob ttf-page-mesh-blob--e" />
      <span className="ttf-page-mesh-grid" />
    </div>
  )
}
