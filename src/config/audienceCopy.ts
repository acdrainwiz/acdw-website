/**
 * Audience selector + landing-page copy.
 * Pages import from here. Do not invent claims; do not reprint homepage Mini/Sensor
 * how-it-works, SKU tables, /compliance body, or Sensor fleet bands.
 */
import {
  FAQ,
  MONITORING,
  PVC_SOLVENT_WELD_PLACEMENT,
  SENSOR_STANDARD_SHORT,
  SENSOR_WIFI_SHORT,
  SUPPORT_CONTACT,
  WARRANTY_RETURNS,
  WIFI_REQUIREMENT,
} from './acdwKnowledge'

export const AUDIENCE_DO_NOT_REPEAT = [
  'MINI_HOME_CARD headline (See the line. Service the line.)',
  'Homepage Install / Clean / Monitor steps',
  'Homepage Why Choose band (IMC, 5-minute, water damage, Made in USA)',
  'Homepage SKU comparison table',
  'Mini anatomy hotspot band',
  'Sensor Standard vs WiFi spec grid and fleet UI',
  '/compliance IMC body paragraphs',
] as const

function faqById(id: string): { question: string; answer: string } {
  const item = FAQ.find((entry) => entry.id === id)
  if (!item) {
    throw new Error(`audienceCopy: unknown FAQ id ${id}`)
  }
  return { question: item.question, answer: item.answer }
}

export const AUDIENCE_SELECTOR = {
  eyebrow: 'Who it is for',
  title: 'Who AC Drain Wiz is for',
    dek: 'Pick the path that matches how you work.',
  homeowner: {
    href: '/homeowner',
    kicker: 'Homeowners',
    headline: 'DIY install, or partner with a pro.',
    dek: 'For people who want to flush the line themselves, or find a pro to install it.',
    go: 'Install it yourself',
    imageSrc: '/images/audience/homeowner-wide.jpg',
    imageAlt: 'Miami condo at sunset with an open air-handler closet and AC Drain Wiz Mini on the condensate drain',
  },
  hvac: {
    href: '/hvac-pros',
    kicker: 'HVAC professionals',
    headline: 'Contractor pricing and professional tools.',
    dek: 'For techs and owners who want fewer callbacks, and a reason to come back only when there is real work.',
    go: 'Contractor options',
    imageSrc: '/images/audience/hvac-wide.jpg',
    imageAlt:
      'South Florida mechanical closet with AC Drain Wiz Mini on a condensate drain and contractor stock nearby',
  },
  property: {
    href: '/property-manager',
    kicker: 'Property managers',
    headline: 'Protect your portfolio from costly water damage.',
    dek: 'For portfolios that need one place to know which air handler needs service.',
    go: 'Portfolio monitoring',
    imageSrc: '/images/audience/property-wide.jpg',
    imageAlt:
      'Multifamily corridor with an open utility closet and AC Drain Wiz Sensor Switch on the drain',
  },
  code: {
    href: '/code-officials',
    kicker: 'Code officials',
    headline: 'IMC-approved maintenance access.',
    dek: 'For AHJs who need a clear maintenance point, not a product catalog.',
    go: 'Verify on sight',
    imageSrc: '/images/audience/code-wide.jpg',
    imageAlt:
      'Mechanical room with an AC Drain Wiz Sensor Switch (green LED) on a clear T-manifold, clipboard and flashlight on a work table',
  },
} as const

export const AUDIENCE_HOMEOWNER = {
  hero: {
    eyebrow: 'For homeowners',
    title: 'Install once. Service the line yourself.',
    dek: 'The Mini is a permanent service port on standard 3/4" PVC. Put it in yourself in about five minutes, or have a technician solvent-weld it. After that, flush, air, or vacuum through the bayonet — no cutting pipe again.',
    imageSrc: '/images/acdw-mini-hero2-product.png',
    imageAlt: 'AC Drain Wiz Mini clear T-manifold on a condensate drain line',
  },
  contrast: {
    eyebrow: 'Why the Mini',
    title: 'The old way vs. a port on the line',
    withoutLabel: 'Without it',
    without: [
      'Cut PVC when the drain backs up',
      'Wait on a service call for a routine flush',
      'Guess whether the line is actually clear',
    ],
    withLabel: 'With the Mini',
    with: [
      'Service through the port — not through new joints',
      'See biofilm and water level in the clear manifold',
      'Flush, air, or vacuum when you need to',
    ],
  },
  diyVsPro: {
    eyebrow: 'How you install',
    title: 'Do it yourself, or hire it out.',
    dek: 'Same Mini. Same one-time solvent-weld on 3/4" PVC, installed horizontally. Pick the path that matches your tools.',
    diy: {
      kicker: 'Do it yourself',
      title: 'Install in about five minutes',
      body: 'PVC cutter, primer, and Oatey all-purpose cement. Primer and cement go on the cut pipe ends only, then into the manifold. Typical install is 5 minutes or less once the line is dry-fitted.',
      cta: 'Step-by-step installation guide',
      href: '/mini-setup?step=1',
    },
    pro: {
      kicker: 'Hire it out',
      title: 'Let a technician own the joint',
      body: 'Ask your HVAC contractor, or we will connect you with an installer. You still get a clear body on the line and a port for every flush after that.',
      cta: 'Find an installer',
      href: '/contact?type=installer',
    },
  },
  afterInstall: {
    eyebrow: 'After it is in',
    title: 'See the line. Service it. Mini does not shut the AC off.',
    dek: 'The Mini is access, not a float switch. You still maintain the line — you just stop cutting pipe to do it. If a garden hose will not reach, a transfer pump can push clean water through the port.',
    steps: [
      {
        number: 1,
        title: 'Inspect anytime',
        description:
          'Look through the clear T-manifold to spot biofilm or rising water before a backup.',
      },
      {
        number: 2,
        title: 'Clean when needed',
        description:
          'Snap on a hose, air, or vacuum attachment at the bayonet. No opening PVC for service.',
      },
      {
        number: 3,
        title: 'Add a Sensor only if you want shutdown',
        description:
          'Mini does not shut the AC off. A Sensor Switch is separate overflow protection — and it does not require Mini first.',
      },
    ],
    productHref: '/products/mini',
    productCta: 'See how the Mini works',
    pumpHref: '/support/installation-setup',
    pumpCta: 'Installation and setup',
  },
  quotes: {
    eyebrow: 'From homeowners',
    title: 'Real installs. Real results.',
    items: [
      {
        name: 'Charles C.',
        role: 'Homeowner',
        initials: 'CC',
        text: 'I highly recommend AC Drain Wiz. It is such an amazing product. I\'m surprised no one thought of it before. Thank you, AC Drain Wiz. It is comforting not to have sleepless, hot nights anymore.',
      },
      {
        name: 'Jaclyn S.',
        role: 'Homeowner',
        initials: 'JS',
        text: 'The AC DRAIN WIZ is an amazing addition to my AC unit and has completely changed the unit which was becoming backed up almost every 3 months! The AC DRAIN WIZ really transformed the unit and it\'s now functioning better than ever!',
      },
      {
        name: 'Jeff B.',
        role: 'Homeowner',
        initials: 'JB',
        text: 'I had no way of vacuuming it out without taking apart a big section of the pvc, and I never would dare to try to flush it out with a water hose. Now, with AC Drain Wiz, I can quickly and easily hook up a hose and flush out the whole line.',
      },
    ],
  },
  faqs: [
    faqById('compatibility'),
    {
      question: 'What tools do I need to install the Mini?',
      answer:
        'A PVC pipe cutter (or hacksaw), PVC primer, and Oatey all-purpose cement. Install horizontally. ' +
        PVC_SOLVENT_WELD_PLACEMENT,
    },
    faqById('mini_buy_online'),
    {
      question: 'How do returns work if I order on this site?',
      answer: WARRANTY_RETURNS.returns.safeCopy,
    },
  ],
  finalCta: {
    kicker: 'Shop online',
    title: 'Get your AC Drain Wiz Mini',
    dek: 'Buy the Mini at list price on the product page — secure checkout, shipping, and tracking. Prefer a technician for the joint? We can connect you with an installer.',
    shopCta: 'Shop Mini',
    installerCta: 'Find an installer',
    installerHref: '/contact?type=installer',
  },
} as const

export const AUDIENCE_HVAC = {
  hero: {
    eyebrow: 'For HVAC professionals',
    title: 'Permanent access. Overflow protection on the same bayonet.',
    dek: 'Stock Mini for flush, air, and vacuum on 3/4" PVC. Add a Sensor Switch when the customer wants shutdown at 80% — sensors include their own T-manifold, so you do not need Mini first. Volume pricing is through sales.',
    imageSrc: '/images/acdw-combo-hero2-product.png',
    imageAlt: 'AC Drain Wiz Mini and Sensor Switch complete system',
  },
  contrast: {
    eyebrow: 'The callback',
    title: 'The line does not stay clear just because you opened it once.',
    withoutLabel: 'Without a port',
    without: [
      'Cut and reattach PVC when the same line clogs again',
      'Eat the trip for a routine clean-out',
      'The customer never sees the work',
    ],
    withLabel: 'With Mini on the line',
    with: [
      'The next visit is a port, not a cut-and-reattach',
      'Clean-outs run 35% faster when the port is already on the line',
      'Show the customer the clear body before you leave',
    ],
  },
  joey: {
    eyebrow: 'From the field',
    title: 'From a technician who installed it.',
    name: 'Joey',
    role: 'AC Technician',
    text: 'I love the AC DRAIN WIZ! After installing it and using it in one of my customers homes and seeing how much sludge came out after I did my service the normal way I was shocked! I would recommend the AC DRAIN to every homeowner out there!',
    image: '/images/testimonials/joey-testimonial.jpg',
  },
  offer: {
    eyebrow: 'What to stock',
    title: 'Mini on the truck. Sensor when they want shutdown.',
    dek: 'Volume is through sales. Product detail stays on the Mini, Sensor, and Combo pages.',
    mini: {
      kicker: 'On the truck',
      title: 'AC Drain Wiz Mini',
      body: 'Permanent access for flush, air, and vacuum on 3/4" PVC. One solvent-weld. Service through the bayonet after that.',
      href: '/products/mini',
      cta: 'Mini product page',
    },
    combo: {
      kicker: 'When they want shutdown',
      title: 'Mini + Sensor',
      body: 'When the customer wants overflow shutdown at 80% plus optional WiFi alerts. Sensors include their own T-manifold. You do not need Mini first to install a Sensor.',
      href: '/products/combo',
      cta: 'Complete system',
    },
    scenariosHref: '/support/installation-scenarios',
    scenariosCta: 'Installation scenarios',
  },
  dashboard: {
    eyebrow: 'After the install',
    title: 'WiFi alerts become scheduled service, not a mystery subscription.',
    dek: `WiFi Sensor Switch can send email and SMS and show sites in the contractor dashboard, so you schedule from water level instead of a callback. Standard Sensor Switch stays local. ${WIFI_REQUIREMENT} Wi-Fi only.`,
    steps: [
      {
        number: 1,
        title: 'Email and SMS',
        description:
          'Email and SMS notifications go to the contractor account, so the shop hears about water level without waiting on the homeowner.',
      },
      {
        number: 2,
        title: 'Schedule from the dashboard',
        description:
          'Contractor account monitoring shows water level by site, so you dispatch the next visit from the platform.',
      },
      {
        number: 3,
        title: 'Service alerts before shutdown',
        description:
          'WiFi Sensor Switch can send service alerts between 50% and 79% water level, so you schedule preventative maintenance before shutdown at 80%.',
      },
    ],
    portalUrl: MONITORING.portalUrl,
    portalCta: 'Monitoring login',
    sensorHref: '/products/sensor',
    sensorCta: 'Sensor models',
  },
  faqs: [
    faqById('mini_list_price'),
    faqById('wifi_vs_nonwifi'),
    faqById('mini_required_before_sensor'),
    faqById('portal_login'),
  ],
  faqTitle: 'Contractor questions',
  finalCta: {
    kicker: 'Volume pricing',
    title: 'Ask sales for contractor pricing.',
    dek: `Call ${SUPPORT_CONTACT.phoneDisplay} or send the sales form. Product detail stays on the Mini, Sensor, and Combo pages.`,
    salesCta: 'Contact sales',
    salesHref: '/contact?type=sales',
    callCta: `Call ${SUPPORT_CONTACT.phoneDisplay}`,
    callHref: SUPPORT_CONTACT.telHref,
  },
} as const

export const AUDIENCE_PROPERTY = {
  hero: {
    eyebrow: 'For property managers',
    title: 'Overflow in a vacant unit does not stay in that unit.',
    dek: 'When a mechanical float fails to shut the AC down on a clogged condensate line, water can travel down walls and into units below — while nobody is home. An AC Drain Wiz Sensor Switch shuts the system down at 80% water with no moving parts, with or without monitoring.',
    imageSrc: '/images/acdw-sensor-hero2-product.png',
    imageAlt: 'AC Drain Wiz Sensor Switch mounted in a transparent T-manifold',
  },
  story: {
    eyebrow: 'What overflow actually costs',
    title: 'One vacant condo. Damage that does not stop at the door.',
    dek: 'In a condominium, overflow in an unoccupied unit is not a single-unit problem. The office, the association, and the people below inherit it.',
    cards: [
      {
        number: 1,
        title: 'Nobody is home',
        description:
          'Unoccupied condo or seasonal unit. No tenant call. The air handler can keep running into a backed-up line.',
      },
      {
        number: 2,
        title: 'Water does not stay in that unit',
        description:
          'When a mechanical float fails to shut the AC down in time, water can travel down walls and into units below.',
      },
      {
        number: 3,
        title: 'Then the office inherits it',
        description:
          'Restoration, insurance claims, and owners who are not on site. Costly for the association, occupants below, and the management office.',
      },
    ],
  },
  contrast: {
    eyebrow: 'Replace the float',
    title: 'Moving parts, or capacitive shutdown.',
    withoutLabel: 'Mechanical float',
    without: [
      'Moving parts that can fail to trip when the line backs up',
      'The AC keeps running into a clogged condensate line',
      'You find out from a downstairs complaint or a restoration invoice',
    ],
    withLabel: 'AC Drain Wiz Sensor',
    with: [
      'Capacitive sensing, no moving parts, shutdown at 80% water',
      'Fail-safe shutdown if power is lost',
      'Standard or WiFi — both shut the unit down',
    ],
  },
  path: {
    eyebrow: 'The smart choice',
    title: 'Replace the float. Monitoring is optional.',
    dek: `Both models include their own T-manifold — you do not need Mini first. ${SENSOR_WIFI_SHORT} needs a ${WIFI_REQUIREMENT} network.`,
    standard: {
      kicker: 'Local protection',
      title: SENSOR_STANDARD_SHORT,
      body: 'Capacitive sensing, automatic shutdown at 80%, no moving parts, fail-safe on power loss. Overflow protection without a dashboard — the right call when you want shutdown, not a portal.',
      href: '/products/sensor',
      cta: 'See Sensor models',
    },
    wifi: {
      kicker: 'When the unit is empty',
      title: SENSOR_WIFI_SHORT,
      body: 'The same 80% shutdown, plus email and SMS and water level by site so the office hears about a vacant unit before a downstairs neighbor does.',
      href: '/products/sensor',
      cta: 'See Sensor models',
    },
    miniHref: '/products/mini',
    onSite:
      'If Mini is on that line, techs flush, air, or vacuum through the bayonet without cutting PVC. Sensors include their own T-manifold; Mini is the service port, not required first. If only a Sensor is installed, it comes off the bayonet for service, then goes back on.',
  },
  rollout: {
    eyebrow: 'Rollout',
    title: 'Assess. Install with your contractor. Watch the dashboard.',
    steps: [
      {
        number: 1,
        title: 'Assess',
        description:
          'Tell sales how many air handlers and whether you want Standard (local shutdown) or WiFi (remote eyes on vacant units).',
      },
      {
        number: 2,
        title: 'Install',
        description: 'Your HVAC contractor installs Sensor (and Mini where you want a service port).',
      },
      {
        number: 3,
        title: 'Monitor',
        description: `Register WiFi units at ${MONITORING.portalUrl.replace('https://', '').replace(/\/$/, '')}. The office then sees water level by unit.`,
      },
    ],
  },
  finalCta: {
    kicker: 'Portfolio pricing',
    title: 'Talk to sales about the portfolio.',
    dek: `Both Sensor models are a smart replacement for a mechanical float. Call ${SUPPORT_CONTACT.phoneDisplay} or use the sales form. We do not publish volume prices on this page.`,
    salesCta: 'Contact sales',
    salesHref: '/contact?type=sales',
    callCta: `Call ${SUPPORT_CONTACT.phoneDisplay}`,
    callHref: SUPPORT_CONTACT.telHref,
  },
} as const

export const AUDIENCE_CODE = {
  hero: {
    eyebrow: 'For code officials',
    title: 'Maintenance access you can verify on sight.',
    dek: 'A transparent T-manifold on 3/4" PVC. You can see the line. The contractor services it through a bayonet port instead of cutting and recapping on every visit. City-owned buildings use the same access point. Full IMC citations live on the compliance page.',
    imageSrc: '/images/acdw-mini-hero-full-stack.png',
    imageAlt: 'AC Drain Wiz Mini full vertically stacked components on a transparent T-manifold',
  },
  contrast: {
    eyebrow: 'On the job',
    title: 'Cutting and recapping, or a port you can see.',
    withoutLabel: 'Without dedicated access',
    without: [
      'The contractor cuts and recaps the line on every visit',
      'There is no obvious maintenance point to confirm on a walk-through',
    ],
    withLabel: 'With the manifold on the line',
    with: [
      'A transparent T-manifold on 3/4" PVC you can verify on sight',
      'Service through a bayonet port instead of opening the pipe again',
      'Look at line condition through the clear body',
    ],
  },
  inspect: {
    eyebrow: 'What you see. What they do.',
    title: 'Inspector and contractor, same access point.',
    dek: 'Full IMC citations live on the compliance page. This page is what you can confirm in the field.',
    inspector: {
      kicker: 'Inspector',
      title: 'A clear body on the condensate line.',
      body: 'You can confirm a dedicated access point is present, look at line condition through the manifold, and see that service does not require opening the pipe again.',
    },
    contractor: {
      kicker: 'Contractor',
      title: 'Service through the port.',
      body: 'Flush, air, or vacuum on Mini. Sensor models use the same style of manifold for overflow protection and can come off the bayonet when the line needs cleaning.',
    },
  },
  city: {
    eyebrow: 'City buildings',
    title: 'Keep government sites in service.',
    dek: 'The same products you verify on a walk-through help a small facilities crew cover city hall, schools, libraries, and shops. They help prevent overflow — they do not guarantee a facility never closes.',
    cards: [
      {
        number: 1,
        title: 'A backed-up drain can take a building offline',
        description:
          'Overflow in a city hall, school, library, or shop can force an unplanned closure. A Sensor Switch shuts the AC down at 80% water to help prevent overflow. It does not catch every clog or promise a building never goes offline.',
      },
      {
        number: 2,
        title: 'Small crews cannot be in every mechanical room',
        description:
          'Fewer people covering more sites. Mini is a one-time service port on 3/4" PVC: flush, air, or vacuum without cutting the line again. Mini does not shut the AC off — it makes on-site maintenance faster for the crew that is there.',
      },
      {
        number: 3,
        title: 'Respond before water is on the floor',
        description: `${SENSOR_WIFI_SHORT} can send email and SMS and service alerts between 50% and 79% water, so a small crew can get there before shutdown at 80%. ${SENSOR_STANDARD_SHORT} still shuts the unit down locally when monitoring is not in scope.`,
      },
    ],
    status: {
      eyebrow: 'On a tour. Across the campus.',
      title: 'A light you can read, and alerts for the sites you cannot stand in.',
      dek: `Sensor uses red and green LEDs only. 24V HVAC power is strongly recommended for ${SENSOR_WIFI_SHORT} so the LED is readable on a walk-through. ${WIFI_REQUIREMENT} Wi-Fi only.`,
      walkthrough: {
        kicker: 'Walk-through',
        title: 'Green and red you can confirm on sight.',
        body: 'Mechanical floats have moving parts and no equivalent status light. On Standard, green means water is below shutoff; no light means no power; solid red means about 80% water and protective shutdown. On 24V WiFi, solid green means connected and operating normally; solid red is the same high-water shutdown. Battery-only WiFi can run with the light off — that is not a failure.',
      },
      campus: {
        kicker: 'Campus monitoring',
        title: 'See government locations without standing in every closet.',
        body: `${SENSOR_WIFI_SHORT} can send email and SMS and show water level by site, so a facilities team covering city hall, schools, and shops can dispatch from the dashboard. Service alerts between 50% and 79% come before shutdown at 80%. ${WIFI_REQUIREMENT} Wi-Fi only — not Bluetooth.`,
      },
    },
  },
  specify: {
    eyebrow: 'What to specify',
    title: 'Name the job, then pick the product.',
    dek: 'Point to the compliance page for citation notes. Do not treat this landing as the code text.',
    items: [
      {
        number: 1,
        title: 'Ready maintenance access',
        description:
          'AC Drain Wiz Mini. Aligns with IMC 307.2.5 (maintenance access) and 307.2.2 (disposal location). Details on the compliance page.',
      },
      {
        number: 2,
        title: 'Non-contact level detection and shutoff',
        description:
          'AC Drain Wiz Sensor Switch (Standard or WiFi). IMC 307.2.1.1 is the non-contact detection reference. Sensors include their own manifold.',
      },
    ],
    disclaimer:
      'These products are designed to meet the cited IMC sections. They do not replace every code-required device in every jurisdiction. Always confirm with the authority having jurisdiction.',
    complianceHref: '/compliance',
    complianceCta: 'Full compliance documentation',
  },
  faqs: [
    {
      question: 'What documentation can we get for an approval packet?',
      answer: `We provide technical specifications, installation instructions, and IMC compliance documentation. Call ${SUPPORT_CONTACT.phoneDisplay} or use the contact form. Reference letters from other jurisdictions are available upon request. We do not claim approval in every municipality.`,
    },
    {
      question: 'How does Mini relate to IMC 307.2.5?',
      answer:
        'Mini provides a permanent access point for condensate drain maintenance and cleaning without disassembling the line. Read the full citation notes on the compliance page rather than treating this page as the code text.',
    },
    {
      question: 'Can this be specified for new construction?',
      answer:
        'Yes, it can be specified. That is not the same as a requirement. Local amendments still govern.',
    },
    {
      question: 'Can the same products cover city-owned buildings?',
      answer: `Yes. Mini is a permanent service port so a small facilities crew can flush, air, or vacuum without cutting PVC on every visit. Sensor Switch shuts the AC down at 80% water to help prevent overflow — it does not guarantee a facility never closes. ${SENSOR_WIFI_SHORT} can add email, SMS, and service alerts between 50% and 79% for crews who cover more than one site. Sensors include their own T-manifold; Mini is not required first.`,
    },
    {
      question: 'How is a Sensor LED different from a mechanical float on a walk-through?',
      answer: `Mechanical floats have moving parts and no status light. Sensor uses red and green LEDs only. On ${SENSOR_STANDARD_SHORT}, green means normal monitoring with water below shutoff; solid red means about 80% water and protective shutdown. On 24V ${SENSOR_WIFI_SHORT}, solid green means connected and operating normally. 24V is strongly recommended so the LED is readable on a tour. Battery-only WiFi can show no light while still monitoring — that is not a failure.`,
    },
  ],
  faqTitle: 'For the authority having jurisdiction',
  finalCta: {
    kicker: 'For the AHJ',
    title: 'Documentation, or a municipal conversation.',
    dek: 'Compliance page for citations. Contact us for an approval packet, a municipal program, or a conversation about city-owned buildings and facilities crews.',
    complianceCta: 'Compliance documentation',
    complianceHref: '/compliance',
    municipalHref: '/contact',
    municipalCta: 'Request a packet',
  },
} as const
