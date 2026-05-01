/**
 * Animated mesh layer for the Mini product hero (Phase 1 hero v2).
 * Purely decorative; paired with `.mini-hero-v2-mesh*` styles in index.css.
 */

export function MiniHeroV2MeshBackground() {
  return (
    <div className="mini-hero-v2-mesh" aria-hidden>
      <span className="mini-hero-v2-mesh-blob mini-hero-v2-mesh-blob--a" />
      <span className="mini-hero-v2-mesh-blob mini-hero-v2-mesh-blob--b" />
      <span className="mini-hero-v2-mesh-blob mini-hero-v2-mesh-blob--c" />
      <span className="mini-hero-v2-mesh-blob mini-hero-v2-mesh-blob--d" />
      <span className="mini-hero-v2-mesh-grid" />
    </div>
  )
}
