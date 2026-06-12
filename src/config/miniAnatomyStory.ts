/**
 * Story beats for the Mini anatomy band (home + /products/mini).
 * Order matches the full-stack diagram hotspots (top → base).
 * Page-specific wording via miniNarrative.ts (getMiniAnatomyBeats).
 */
export type MiniAnatomyStoryBeat = {
  id: string
  /** Matches ProductHotspots id on the full-stack image when present */
  hotspotId?: string
  title: string
  description: string
}

export const MINI_ANATOMY_INTRO = {
  eyebrow: 'How it works',
  title: 'Built into the line, not bolted on',
  description:
    'The Mini solvent-welds into your existing 3/4" PVC condensate line—creating a permanent service point for the life of the system. A clear T-manifold is your window into the line; the bayonet port is the quick-connect interface for every service attachment.',
  bridge:
    'Tap a hotspot to see how each part supports faster, verifiable condensate service.',
} as const

export const MINI_ANATOMY_STORY_BEATS: MiniAnatomyStoryBeat[] = [
  {
    id: 'schrader-air',
    hotspotId: 'schrader-air-adapter',
    title: 'Schrader air adapter',
    description:
      'Connect compressed air on the bayonet port to break stubborn clogs—the same quick-connect swap you saw in the marquee above.',
  },
  {
    id: 'water-hose',
    hotspotId: 'water-hose-adapter',
    title: 'Water hose adapter',
    description:
      'Snap on a garden hose to flush the line through the Mini. Routine maintenance without opening PVC or disassembling fittings.',
  },
  {
    id: 'valve',
    hotspotId: 'bidirectional-valve',
    title: 'Bi-directional valve',
    description:
      'Route flush water out, compressed air through, or vacuum suction in—one valve, two directions, no extra fittings between methods.',
  },
  {
    id: 'cap',
    hotspotId: 'storage-cap',
    title: 'Storage cap',
    description:
      'Seal the bayonet port between visits. Quarter-turn on when the line is idle—swap it off when it is time to flush, air, or vacuum.',
  },
  {
    id: 'bayonet',
    hotspotId: 'bayonet-port',
    title: 'Snap-to-lock bayonet port',
    description:
      'Quarter-turn attachments seal fast. Swap service tools—or a Sensor Switch when used—without temporary fittings or tape.',
  },
  {
    id: 'pvc',
    hotspotId: 'pvc-connection',
    title: 'Permanent 3/4" PVC access',
    description:
      'Solvent-weld the Mini into standard 3/4" nominal PVC once. You get lasting access to the condensate line instead of opening the pipe every time maintenance is due.',
  },
  {
    id: 'manifold',
    hotspotId: 'clear-body',
    title: 'Transparent T-manifold',
    description:
      'See biofilm, debris, and water level before a backup. Confirm the line is clear after service—no guessing from the other end of the run.',
  },
]
