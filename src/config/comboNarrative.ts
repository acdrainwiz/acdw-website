/**
 * Combo (Mini + Sensor Bundle) narrative zones — edit copy here first; pages import, never invent inline.
 */
import {
  MINI_MANIFOLD_DIMENSIONS_LHD,
  PRODUCT_NAMES,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
  WIFI_REQUIREMENT,
} from './acdwKnowledge'

export const COMBO_HERO_HEADLINES = [
  'Access Plus Overflow Protection',
  'Service Faster. Monitor Continuously.',
  'One Bayonet Workflow for Pros',
  'Build Lasting Service Relationships',
] as const

/** Product hero — pain + promise; comparison and workflow own the detail. */
export const COMBO_PRODUCT_HERO = {
  subtitle: `${PRODUCT_NAMES.mini} gives permanent drain-line access. Pair it with a Sensor Switch for automatic overflow protection—and, with the WiFi model, contractor monitoring and alerts on ${WIFI_REQUIREMENT} Wi‑Fi.`,
  trustLine: 'Contractor & property-manager focused · Professional installation',
} as const

export const COMBO_NARRATIVE_ZONES = {
  compare: {
    eyebrow: 'Why the complete system',
    title: 'Mini, Sensor, or both?',
    dek: 'The Mini streamlines maintenance access. Sensors protect against overflow—with or without remote tools. Together they give contractors a full service-and-protection workflow on one bayonet port.',
  },
  workflow: {
    eyebrow: 'How they work together',
    title: 'One port for service and protection',
    dek: 'Remove the Sensor, run a full flush, air, and vacuum clean-out through the Mini bayonet, then reinstall the Sensor—same port, no cutting PVC.',
  },
  audience: {
    eyebrow: 'Who it’s for',
    title: 'Built for contractors and property teams',
    dek: 'Position premium drain-line protection as an ongoing service relationship—not a one-time clean-out.',
  },
  fleet: {
    eyebrow: 'Fleet & service tools',
    title: 'Manage installs from one dashboard',
    dek: `With the ${SENSOR_WIFI_SHORT}, monitor sites, review alerts, and create service calls from the contractor dashboard. ${SENSOR_STANDARD_SHORT} installs stay ideal when remote monitoring is not required.`,
  },
  install: {
    eyebrow: 'Installation',
    title: 'Ready to install?',
    dek: 'Follow the step-by-step guides for Mini and Sensor setup. Dual drain-line unit? Compare Good, Better & Best port assignments before you start.',
  },
  specs: {
    eyebrow: 'Specs at a glance',
    title: 'Mini + Sensor specifications',
    dek: 'Mini manifold dimensions and Sensor model basics below. For full Standard vs WiFi Sensor details, see the Sensor product page.',
  },
  faq: {
    eyebrow: 'Need-to-know',
    title: 'Frequently Asked Questions',
    dek: 'Answers contractors and property managers ask first about the Mini + Sensor bundle.',
  },
  finalCta: {
    title: 'Ready to differentiate your HVAC business?',
    dek: `Join contractors building lasting customer relationships with the ${PRODUCT_NAMES.bundle}.`,
  },
} as const

export type ComboCompareCell = boolean | string

export type ComboCompareRow = {
  feature: string
  mini: ComboCompareCell
  sensor: ComboCompareCell
  combo: ComboCompareCell
}

/** Mini vs Sensor vs Combo — knowledge-safe comparison rows. */
export const COMBO_COMPARISON_ROWS: readonly ComboCompareRow[] = [
  {
    feature: 'Transparent T-Manifold included',
    mini: true,
    sensor: true,
    combo: true,
  },
  {
    feature: 'Permanent service access (flush / air / vacuum)',
    mini: true,
    sensor: false,
    combo: true,
  },
  {
    feature: 'Visual inspection (clear manifold)',
    mini: true,
    sensor: true,
    combo: true,
  },
  {
    feature: 'Overflow shutdown at ~80% water',
    mini: false,
    sensor: true,
    combo: true,
  },
  {
    feature: 'Remote monitoring & email/SMS alerts',
    mini: false,
    sensor: 'WiFi model',
    combo: 'WiFi model',
  },
  {
    feature: 'Fleet dashboard & service workflows',
    mini: false,
    sensor: 'WiFi model',
    combo: 'WiFi model',
  },
  {
    feature: 'Bayonet service rhythm (Sensor ↔ Mini valve)',
    mini: 'Valve only',
    sensor: 'Sensor only',
    combo: 'Best',
  },
  {
    feature: 'Service contract value',
    mini: 'Good',
    sensor: 'Better',
    combo: 'Premium',
  },
  {
    feature: 'Complete access + protection',
    mini: false,
    sensor: false,
    combo: true,
  },
] as const

export const COMBO_AUDIENCE_CARDS = [
  {
    id: 'contractor',
    title: 'HVAC contractors',
    description:
      'Offer permanent access plus overflow protection as a premium service. Stay connected year-round with WiFi monitoring—you control customer communication and scheduling.',
    points: [
      'Touchpoints beyond seasonal tune-ups',
      'Pre-visit diagnostics for faster service calls',
      'Upsell monitoring after a Mini-only install',
      'Fleet tools for multi-customer routes',
    ],
  },
  {
    id: 'property_manager',
    title: 'Property managers',
    description:
      'Partner with your HVAC contractor to protect multiple properties. Reduce emergency calls with proactive maintenance and clear system-health visibility.',
    points: [
      'Contractor-led alerts and service scheduling',
      'Fewer tenant disruptions from drain backups',
      'Scheduled maintenance instead of emergencies',
      'Digital records for property reporting',
    ],
  },
] as const

export const COMBO_FLEET_FEATURES = [
  {
    id: 'overview',
    title: 'Fleet overview',
    description:
      'Real-time status of WiFi Sensor installs with color-coded indicators. Filter by customer, property, or service area.',
  },
  {
    id: 'alerts',
    title: 'Alert management',
    description:
      'View active alerts and history. Configure who receives email/SMS notifications. Annotate alerts with service notes.',
  },
  {
    id: 'service',
    title: 'Service call workflow',
    description:
      'Manually create service calls from alerts. Contact customers to schedule. Assign technicians. Track completion.',
  },
  {
    id: 'customers',
    title: 'Customer management',
    description:
      'Store contacts, service history, and multiple properties per customer. Track maintenance schedules.',
  },
] as const

export const COMBO_MINI_SPECS = [
  { label: 'Dimensions', value: MINI_MANIFOLD_DIMENSIONS_LHD },
  { label: 'Material', value: 'UV-resistant clear PVC' },
  { label: 'Connection', value: '3/4" nominal PVC drain line' },
  { label: 'Bayonet port', value: 'Snap-to-lock service port' },
  { label: 'Typical install', value: '~5–10 minutes' },
  { label: 'Compliance', value: 'IMC 307.2.5, 307.2.2, 307.2.1.1' },
] as const

export const COMBO_SENSOR_SPECS = [
  { label: 'Dimensions', value: '2" × 3" × 1.5"' },
  { label: 'Technology', value: 'Capacitive water-level detection' },
  {
    label: 'Power',
    value: '24V HVAC recommended; Li-ion backup (~2 years); battery-only supported',
  },
  {
    label: 'Connectivity',
    value: `${SENSOR_WIFI_SHORT}: Wi‑Fi (${WIFI_REQUIREMENT} only). ${SENSOR_STANDARD_SHORT}: local only.`,
  },
  {
    label: 'Alerts',
    value: 'WiFi: email/SMS and service alerts (50–79%); both models shut down at ~80%',
  },
  { label: 'Manifold', value: 'Same Transparent T-Manifold as Mini (included with Sensor)' },
  { label: 'Typical install', value: '~15–20 minutes (model and site dependent)' },
  { label: 'Compliance', value: 'IMC 307.2.3' },
] as const

export const COMBO_FAQS = [
  {
    question: 'Do service calls get created automatically?',
    answer:
      'No. You control all customer communication. When a WiFi Sensor alert occurs, you receive a notification in your dashboard. You then contact your customer to schedule a service visit and assign a technician.',
  },
  {
    question: 'Can I install just the Mini now and add a Sensor later?',
    answer: `Yes. ${PRODUCT_NAMES.mini} is a standalone product. A Sensor Switch can be added later on the Mini’s bayonet port (remove the valve/cap, mount the Sensor). Sensors also ship with their own Transparent T-Manifold—you do not need the Mini first to install a Sensor.`,
  },
  {
    question: 'Does the Sensor require the Mini?',
    answer: `No. ${SENSOR_STANDARD_SHORT} and ${SENSOR_WIFI_SHORT} each include the same Transparent T-Manifold used with the Mini. The Mini is for permanent flush, air, and vacuum access. Pairing both unlocks the shared bayonet service rhythm.`,
  },
  {
    question: 'How do I position this to my customers?',
    answer:
      'Position it as premium drain-line protection: permanent service access plus overflow shutdown—and, with WiFi, proactive monitoring so you can schedule maintenance before a backup. Homeowners respond to clear, practical benefits over tech jargon.',
  },
  {
    question: 'Can property managers access the dashboard?',
    answer:
      'You control dashboard access. You can provide property managers view-only access to their properties if desired, while you maintain the contractor relationship and handle service scheduling.',
  },
  {
    question: 'What if the customer doesn’t have Wi‑Fi?',
    answer: `Install ${PRODUCT_NAMES.mini} for maintenance access, and/or ${SENSOR_STANDARD_SHORT} for local overflow protection without remote monitoring. The ${SENSOR_WIFI_SHORT} requires a ${WIFI_REQUIREMENT} Wi‑Fi network (5 GHz is not supported).`,
  },
  {
    question: 'How long does the battery last?',
    answer:
      'The WiFi Sensor lithium-ion backup lasts about two years under normal use. The monitoring platform can warn when battery is low. 24V HVAC power is strongly recommended for consistent LED feedback and reliable operation; battery-only is supported with limited LED visibility.',
  },
  {
    question: 'Can I include this in my service contracts?',
    answer:
      'Yes. Many contractors include Mini access and Sensor protection—with optional WiFi monitoring—in premium service contracts. That differentiates your offering and supports ongoing customer relationships.',
  },
  {
    question: 'What training is provided?',
    answer:
      'Installation and setup guides, product support FAQs, and phone support are available. For larger contractor rollouts, contact sales about training options.',
  },
  {
    question: 'Can customers see their own dashboard?',
    answer:
      'You decide. View-only customer access is optional. Most contractors prefer to own the monitoring relationship and contact customers when service is needed.',
  },
  {
    question: 'What happens if I get an alert while I’m on another job?',
    answer:
      'Alerts remain in your dashboard until addressed. Prioritize by severity and schedule visits accordingly. Many alerts indicate developing drainage issues—not always an immediate emergency.',
  },
] as const

/** Interactive service-rhythm swap — combo workflow section. */
export type ComboServiceRhythmMode = 'protect' | 'service'

export type ComboServiceRhythmBeat = {
  id: string
  stepLabel: string
  title: string
  benefit: string
  mode: ComboServiceRhythmMode
  image: {
    src: string
    alt: string
  }
}

export const COMBO_SERVICE_RHYTHM = {
  autoAdvanceMs: 6_000,
  autoResumeMs: 10_000,
  modeLabels: {
    protect: 'Protect mode',
    service: 'Service mode',
  } as const satisfies Record<ComboServiceRhythmMode, string>,
  beats: [
    {
      id: 'remove-sensor',
      stepLabel: 'Step 1',
      title: 'Remove the Sensor',
      benefit: `Sensor monitors the line between visits—automatic AC shutoff at ~80% water while it is installed.`,
      mode: 'protect',
      image: {
        src: '/images/acdw-sensor-standard-on-manifold-darkbg.png',
        alt: `${PRODUCT_NAMES.sensor} mounted on the Transparent T-Manifold with green LED indicating normal monitoring`,
      },
    },
    {
      id: 'service-valve',
      stepLabel: 'Step 2',
      title: 'Install the bi-directional valve',
      benefit: `Snap the valve onto the bayonet port—permanent access for flush, compressed air, or vacuum with no cut-and-reattach.`,
      mode: 'service',
      image: {
        src: '/images/acdw-mini-hero-bi-directional.png',
        alt: `${PRODUCT_NAMES.mini} bi-directional valve on the bayonet port, held for field service`,
      },
    },
    {
      id: 'flush-hose',
      stepLabel: 'Step 3',
      title: 'Flush with the water hose adapter',
      benefit: `Connect a garden hose and push water through the line to clear slime and buildup—without opening PVC.`,
      mode: 'service',
      image: {
        src: '/images/acdw-mini-hero-background.png',
        alt: `${PRODUCT_NAMES.mini} with water hose adapter on a condensate drain line, held by a gloved hand`,
      },
    },
    {
      id: 'clear-air',
      stepLabel: 'Step 4',
      title: 'Break clogs with compressed air',
      benefit: `Swap to the Schrader air adapter when water alone will not clear a stubborn blockage—35% faster clean-outs.`,
      mode: 'service',
      image: {
        src: '/images/acdw-mini-hero-schrader.png',
        alt: `${PRODUCT_NAMES.mini} with Schrader air adapter on the bayonet port`,
      },
    },
    {
      id: 'vacuum-line',
      stepLabel: 'Step 5',
      title: 'Vacuum with the reversed valve',
      benefit: `Flip the bi-directional valve and pull remaining sludge with a shop vac—complete clean-out on the same bayonet, no cutting PVC.`,
      mode: 'service',
      image: {
        src: '/images/acdw-mini-hero-bi-directional-rev.png',
        alt: `${PRODUCT_NAMES.mini} bi-directional valve reversed for vacuum service on the bayonet port`,
      },
    },
    {
      id: 'reinstall-sensor',
      stepLabel: 'Step 6',
      title: 'Reinstall the Sensor',
      benefit: `Mount the Sensor back on the bayonet when the line is ready—overflow protection and monitoring resume on the same port.`,
      mode: 'protect',
      image: {
        src: '/images/acdw-sensor-standard-on-manifold-darkbg.png',
        alt: `${PRODUCT_NAMES.sensor} reinstalled on the Transparent T-Manifold after service`,
      },
    },
  ] as const satisfies readonly ComboServiceRhythmBeat[],
  wifiFootnote: {
    prefix: `With the ${SENSOR_WIFI_SHORT}, contractor alerts between ~50–79% water on ${WIFI_REQUIREMENT} Wi‑Fi (5 GHz not supported).`,
    fleetLinkLabel: 'Explore fleet & dashboard tools',
    fleetSectionId: 'combo-fleet-heading',
  },
} as const

export const COMBO_TRUST_INDICATORS = [
  'IMC code compliant',
  'Made in USA',
  'Professional support',
  '2.4 GHz Wi‑Fi for monitoring',
] as const
