/**
 * Internal button style guide — not linked in site nav.
 * Route: /style-guide
 */
const ROLES = [
  {
    id: 'primary',
    name: 'Primary',
    className: 'btn-primary',
    usage: 'Default site CTA (buy, submit, continue)',
    bg: '#2563EB',
    text: '#FFFFFF',
    hover: '#1D4ED8',
    contrast: '5.17:1 AA',
    surface: 'light' as const,
  },
  {
    id: 'secondary',
    name: 'Secondary',
    className: 'btn-secondary',
    usage: 'Secondary on light surfaces only — never on dark/black (use Inverse outline)',
    bg: 'transparent',
    text: '#2563EB',
    hover: '#EFF6FF',
    contrast: '5.17:1 AA (text)',
    surface: 'light' as const,
  },
  {
    id: 'muted',
    name: 'Muted',
    className: 'btn-muted',
    usage: 'Quiet form / tertiary actions on light UI',
    bg: '#F1F5F9',
    text: '#0F172A',
    hover: '#E2E8F0',
    contrast: '16.3:1 AAA',
    surface: 'light' as const,
  },
  {
    id: 'accent',
    name: 'Accent',
    className: 'btn-accent',
    usage: 'Brand orange CTAs (campaign, homeowner emphasis)',
    bg: '#DF3601',
    text: '#FFFFFF',
    hover: '#C93001',
    contrast: '4.50:1 AA',
    surface: 'light' as const,
  },
  {
    id: 'accent-soft',
    name: 'Accent soft',
    className: 'btn-accent-soft',
    usage: 'Translucent orange on dark campaign/hero only',
    bg: 'rgba(255,78,0,0.12)',
    text: '#FFFFFF',
    hover: 'rgba(255,78,0,0.24)',
    contrast: '~16:1 on navy',
    surface: 'dark' as const,
  },
  {
    id: 'inverse',
    name: 'Inverse',
    className: 'btn-inverse',
    usage: 'Primary action on dark heroes / blue bands',
    bg: '#FFFFFF',
    text: '#1D4ED8',
    hover: '#EFF6FF',
    contrast: '6.70:1 AA',
    surface: 'dark' as const,
  },
  {
    id: 'inverse-outline',
    name: 'Inverse outline',
    className: 'btn-inverse-outline',
    usage: 'Secondary on dark heroes / bands',
    bg: 'transparent',
    text: '#FFFFFF',
    hover: 'rgba(255,255,255,0.10)',
    contrast: 'High on dark',
    surface: 'dark' as const,
  },
  {
    id: 'ghost',
    name: 'Ghost',
    className: 'btn-ghost',
    usage: 'Tertiary text CTA on light surfaces',
    bg: 'none',
    text: '#001A35',
    hover: '#FF4E00',
    contrast: '17.5:1 AA',
    surface: 'light' as const,
  },
  {
    id: 'ghost-on-dark',
    name: 'Ghost on dark',
    className: 'btn-ghost-on-dark',
    usage: 'Tertiary text CTA on dark surfaces',
    bg: 'none',
    text: 'rgba(255,255,255,0.90)',
    hover: '#FFFFFF',
    contrast: 'High on dark',
    surface: 'dark' as const,
  },
  {
    id: 'destructive',
    name: 'Destructive',
    className: 'btn-destructive',
    usage: 'Unsubscribe / sign-out / irreversible',
    bg: '#DC2626',
    text: '#FFFFFF',
    hover: '#B91C1C',
    contrast: '4.83:1 AA',
    surface: 'light' as const,
  },
  {
    id: 'destructive-outline',
    name: 'Destructive outline',
    className: 'btn-destructive-outline',
    usage: 'Softer destructive (cancel destructive)',
    bg: 'transparent',
    text: '#DC2626',
    hover: '#FEF2F2',
    contrast: '4.83:1 AA (text)',
    surface: 'light' as const,
  },
] as const

const SIZES = [
  { id: 'sm', className: 'btn-sm', label: 'sm' },
  { id: 'md', className: 'btn-md', label: 'md' },
  { id: 'lg', className: 'btn-lg', label: 'lg' },
] as const

function Swatch({ color, label }: { color: string; label: string }) {
  const isNone = color === 'none' || color === 'transparent'
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <span
        className="inline-block h-4 w-4 shrink-0 rounded border border-slate-300"
        style={{
          background: isNone
            ? 'repeating-conic-gradient(#e2e8f0 0% 25%, #fff 0% 50%) 50% / 8px 8px'
            : color,
        }}
        aria-hidden
      />
      <span>
        <span className="font-medium text-slate-800">{label}:</span> {color}
      </span>
    </div>
  )
}

export function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            Internal · not in site nav
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Button style guide</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Canonical ACDW button roles. Compose these classes for new UI — do not invent
            new button colors. Full rules live in <code className="text-sm">DESIGN.md</code>.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Sizes</h2>
          <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-6">
            {SIZES.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <button type="button" className={`btn-primary ${s.className}`}>
                  {s.label}
                </button>
                <code className="text-xs text-slate-500">.{s.className}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Disabled state</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-primary btn-md" disabled>
                Disabled primary
              </button>
              <button type="button" className="btn-accent btn-md" disabled>
                Disabled accent
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              All roles: fill <code>#D1D5DB</code>, text <code>#4B5563</code> (5.13:1 AA)
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-semibold text-slate-900">Roles</h2>
          {ROLES.map((role) => (
            <article
              key={role.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{role.name}</h3>
                  <code className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    .{role.className}
                  </code>
                </div>
                <p className="mt-1 text-sm text-slate-600">{role.usage}</p>
              </div>

              <div
                className={`flex flex-wrap items-center gap-3 px-6 py-6 ${
                  role.surface === 'dark' ? 'bg-acdw-navy' : 'bg-slate-50'
                }`}
              >
                <button type="button" className={`${role.className} btn-md`}>
                  Default
                </button>
                <button type="button" className={`${role.className} btn-lg`}>
                  Large
                </button>
                <button type="button" className={`${role.className} btn-sm`}>
                  Small
                </button>
                <button type="button" className={`${role.className} btn-md`} disabled>
                  Disabled
                </button>
              </div>

              <div className="grid gap-2 border-t border-slate-100 px-6 py-4 sm:grid-cols-2">
                <Swatch color={role.bg} label="BG" />
                <Swatch color={role.text} label="Text" />
                <Swatch color={role.hover} label="Hover" />
                <p className="text-xs text-slate-600">
                  <span className="font-medium text-slate-800">Contrast:</span> {role.contrast}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-xl border border-amber-200 bg-amber-50 px-6 py-5">
          <h2 className="text-sm font-semibold text-amber-900">Do not use for button fills</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-amber-900/90">
            <li>
              Brand chrome orange <code>#FF4E00</code> with white text (fails AA) — borders/soft tint only
            </li>
            <li>
              Tailwind <code>orange-500</code> / <code>orange-600</code> — use <code>.btn-accent</code>
            </li>
            <li>
              Sky blues for CTAs — use <code>.btn-primary</code>
            </li>
            <li>
              <code>.btn-secondary</code> (blue outline) on dark/black — use{' '}
              <code>.btn-inverse-outline</code>
            </li>
            <li>
              Yellow <code>#FFC300</code> as label text — focus ring / highlighter only
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
