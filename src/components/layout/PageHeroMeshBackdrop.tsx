/**
 * Decorative mesh + grid for marketing heroes (support, policies, About,
 * Products lineup, audience landings). Uses `.page-hero-mesh*` in `index.css`,
 * tuned to match `.mini-hero-v2-mesh*` on the Mini product hero (sky / cyan /
 * orange / indigo blobs + centered cyan core + slate grid). Not used on
 * full-bleed Sensor/Combo heroes.
 */

export function PageHeroMeshBackdrop() {
  return (
    <div className="page-hero-mesh" aria-hidden>
      <span className="page-hero-mesh-blob page-hero-mesh-blob--a" />
      <span className="page-hero-mesh-blob page-hero-mesh-blob--b" />
      <span className="page-hero-mesh-blob page-hero-mesh-blob--c" />
      <span className="page-hero-mesh-blob page-hero-mesh-blob--d" />
      <span className="page-hero-mesh-blob page-hero-mesh-blob--e" />
      <span className="page-hero-mesh-grid" />
    </div>
  )
}
