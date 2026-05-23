/**
 * Central copy + configuration for the "Trash the Float. Smart Tech's the GOAT." campaign.
 *
 * Edit this file to update strings, images, CTAs, or storage keys in one place
 * without touching component JSX.
 *
 * Claim guardrails (see CLAUDE.md / acdw-knowledge.mdc):
 *  - Do NOT claim ACDW prevents all clogs or guarantees no water damage.
 *  - Do NOT claim float switches always fail.
 *  - Prefer: "helps reduce risk", "monitors water-level conditions",
 *            "supports proactive maintenance", "automatic AC shutoff when properly wired",
 *            "no mechanical float", "remote monitoring available with WiFi Sensor Switch".
 */

import { TRASH_THE_FLOAT_OFFICIAL_RULES_HREF } from './trashTheFloatOfficialRules'

export type CampaignPrizeTickerItem = {
  label: string
  detail: string
  accent?: 'orange' | 'sky' | 'navy'
}

export type CampaignCardBullet = {
  text: string
}

export type CampaignCard = {
  title: string
  badge: string
  bullets: CampaignCardBullet[]
}

export type CampaignCta = {
  label: string
  href: string
}

export type CampaignHowItWorksStep = {
  title: string
  body: string
}

export type CampaignFaqItem = {
  question: string
  answer: string
}

export type CampaignEligibilityItem = {
  label: string
  detail: string
}

/** Hall of Fame placeholder — shows expected card layout before API stories exist */
export type CampaignHallOfFamePreviewStory = {
  id: string
  firstName: string
  instagramHandle: string
  audience: string
  region: string
  storyTitle: string
  excerpt: string
  imageKey: 'storyDamage1' | 'storyDamage2' | 'floatSwitchTrans'
  imageAlt: string
  layoutNote: string
}

export const TRASH_THE_FLOAT = {
  /** Anchor path for all Official Rules links site-wide */
  officialRulesHref: TRASH_THE_FLOAT_OFFICIAL_RULES_HREF,

  // Storage key version-bumped so we can re-show the overlay later if copy changes materially.
  /** Bump when dismiss semantics change so prior test keys do not block the overlay. */
  storageKey: 'acdw.trashTheFloat.overlay.dismissed.v2',

  // Delay before the overlay opens, so the hero gets to paint first.
  showDelayMs: 600,

  // TODO: replace with a live count from the campaign backend once the submissions endpoint exists.
  storiesCount: 0,

  /** Hide the live counter in the overlay until at least this many stories exist. */
  storiesCountMinDisplay: 10,

  /**
   * Instagram — live monthly drawing visibility + follow verification for prize entry.
   * Stories are submitted on-site; Instagram is not the submission channel.
   */
  instagram: {
    handle: '@ACDrainWiz',
    profileUrl: 'https://www.instagram.com/acdrainwiz/',
  },

  // Image paths — drop assets into /public/images/ (see paths below).
  images: {
    floatOld: '/images/float-switch-old.png',
    sensorStandard: '/images/acdw-standard-sensor.png',
    /** Campaign iPad prize — transparent PNG so the spotlight halo shows through behind it. */
    ipadPrize: '/images/campaign/trash-the-float-ipad-prize-trans.png',
    /** Hero flair — Instagram app icon (live monthly drawing). */
    instagramIcon: '/images/campaign/ttf-instagram-icon.png',
    floatSwitchTrans: '/images/campaign/ttf-float-switch-old-trans.png',
    /** Hero lockup — Standard Sensor on T-manifold (transparent PNG). */
    sensorOnManifold: '/images/acdw-sensor-standard-on-manifold.png',
    /** Story-context thumbnails (modal) — overflow / backup damage, anonymized. */
    storyDamage1: '/images/campaign/ttf-damage-ceiling-stain.png',
    storyDamage2: '/images/campaign/ttf-damage-drain-pan.png',
  },

  // Overlay copy — poster lockup (modal uses `overlay`; landing keeps `landing.heroHeadline`)
  headline: 'Trash the Float. Smart Tech’s the GOAT!',

  campaignKicker: 'Enter to win',

  overlay: {
    headlineLead: 'Trash the Float.',
    headlineLeadBefore: 'Trash the ',
    headlineLeadFloat: 'Float',
    headlineLeadAfter: '.',
    headlinePunchBefore: 'Smart Tech’s the ',
    headlinePunchHighlight: 'GOAT!',
    offerLine: 'Share your story — monthly Instagram drawing.',
    prizeLabel: 'iPad · Latest model',
    prizeCallout: {
      headlineBefore: 'You could win a ',
      headlineHighlight: 'FREE iPad!',
      footnote: 'Latest model · approved entries · live drawing on Instagram',
      /**
       * Modal prize ticker — excitement-first; legal/eligibility lives in disclaimer + FAQ.
       * Storage spec omitted here (see landing prize chips + Official Rules).
       */
      ticker: [
        { label: 'Win', detail: 'A brand-new iPad', accent: 'orange' },
        { label: 'Share it', detail: 'Submit your float-switch story here', accent: 'sky' },
        { label: 'Every month', detail: 'Live drawing on Instagram', accent: 'navy' },
        { label: 'Hall of Fame', detail: 'Standout stories featured', accent: 'orange' },
        { label: 'Real damage', detail: 'Stains, backups, emergency visits', accent: 'sky' },
        { label: 'Enter now', detail: 'Form below — follow us on Instagram', accent: 'navy' },
      ] satisfies CampaignPrizeTickerItem[],
    },
    ipadPrizeAlt: 'Apple iPad (latest available model) — Trash the Float campaign prize',
    storyContext: {
      kicker: 'WE WANT TO HEAR YOUR FAILED FLOAT STORIES!',
      body: 'Callbacks, ceiling stains, and drain-line backups — the kind of damage float-switch failures leave behind.',
      caption: 'Representative damage for illustration — not customer homes.',
      photos: [
        {
          srcKey: 'storyDamage1' as const,
          alt: 'Water stain on a ceiling from condensate line backup',
          label: 'Ceiling stain',
        },
        {
          srcKey: 'storyDamage2' as const,
          alt: 'Water overflow in an AC drain pan',
          label: 'Drain pan backup',
        },
      ],
    },
    disclaimer:
      'Stories are reviewed before publication. No purchase necessary where applicable. See Official Rules on the campaign page.',
    closeLabel: 'Close',
  },

  /** @deprecated Modal no longer renders these — kept for reference / future A-B tests */
  prizeHeadline: 'Enter to win an iPad',
  prizeDetail:
    'Tell us your worst float-switch story — the callback, the ceiling stain, the emergency visit — and you could take home a new iPad.',

  subheadline:
    'We’re collecting real stories from contractors, homeowners, and property managers about float-switch failures and what they cost.',
  supportingCopy:
    'Stuck floats. No early warning. Water where it shouldn’t be. If you’ve lived it, share your story on the campaign page — approved entries are entered into our monthly drawing, with the live winner selection on Instagram.',

  leftCard: {
    title: 'Old Float Switch',
    badge: 'Reactive',
    bullets: [
      { text: 'Waits for water to rise' },
      { text: 'Mechanical float can stick or clog' },
      { text: 'No visibility into developing issues' },
      { text: 'No smart story to tell the customer' },
    ],
  } satisfies CampaignCard,

  rightCard: {
    title: 'AC Drain Wiz Standard Sensor Switch',
    badge: 'Smart Protection',
    bullets: [
      { text: 'Monitors water-level conditions' },
      { text: 'No mechanical float' },
      { text: 'Automatic AC shutoff when properly wired' },
      { text: 'Built for cleaner, more proactive service' },
    ],
  } satisfies CampaignCard,

  // Overlay modal CTA — single path to landing hero (contest story, not straight to form).
  cta: {
    primary: {
      label: 'Give us your Best of the Worst',
      href: '/trash-the-float',
    } satisfies CampaignCta,
  },

  bottomCta: {
    text: 'Got a callback, ceiling stain, emergency visit, or float-switch failure story? Submit it below — approved entries are eligible for our monthly iPad drawing (live on Instagram).',
    button: { label: 'Enter & Share My Story', href: '/trash-the-float#submit-story' } satisfies CampaignCta,
  },

  disclaimer:
    'Stories are reviewed before publication. Individual results vary. No purchase necessary for prize entry where applicable. See Official Rules on the campaign page for eligibility.',

  // Homepage teaser section
  teaser: {
    title: 'The old way waits. The smart way watches.',
    body:
      'Traditional float switches are reactive by design. AC Drain Wiz helps contractors move toward smarter drain protection with water-level monitoring, automatic shutoff capability when properly wired, and a cleaner path to proactive service.',
    ctaPrimary: { label: 'Join the Campaign', href: '/trash-the-float' } satisfies CampaignCta,
    ctaSecondary: {
      label: 'Compare the Technology',
      href: '/trash-the-float#comparison',
    } satisfies CampaignCta,
  },

  // Landing-page copy
  landing: {
    heroEyebrow: 'Share your story',
    heroFlair: {
      monthlyDrawingsPill: 'Monthly Drawings',
      monthlyIpadsPill: 'Win a Free Ipad',
    },
    heroHeadline: 'Trash the Float. Smart Tech’s the GOAT.',
    heroSub:
      'Real stories. Real callbacks. Real reasons the industry is ready for smarter drain protection. Submit here — follow us on Instagram to watch the monthly live drawing.',
    heroCtaPrimary: {
      label: 'Submit Your Story',
      href: '#submit-story',
    } satisfies CampaignCta,

    heroVisuals: {
      floatSwitchAlt: 'Traditional mechanical float switch',
      sensorOnManifoldAlt: 'AC Drain Wiz Standard Sensor Switch on transparent T-manifold',
      versusAriaLabel:
        'Traditional mechanical float switch compared with AC Drain Wiz Standard Sensor Switch on T-manifold',
    },

    counterLabelSuffix: 'stories submitted',

    prize: {
      eyebrow: 'What you can win',
      title: 'Tell your story. Win an iPad.',
      body:
        'Each approved entry is entered into our monthly drawing. One eligible winner takes home a new iPad (latest available model). The live random drawing is broadcast on Instagram — follow us there so you do not miss it.',
      chips: [
        { label: 'iPad', detail: 'Latest model' },
        { label: 'Monthly drawing', detail: 'Live on Instagram' },
        { label: 'Open to all', detail: 'Follow + approved entry' },
      ],
      legalNote: 'No purchase necessary where applicable. See Official Rules for eligibility.',
      ctaLabel: 'Enter & Share My Story',
      ctaHref: '#submit-story',
    },

    comparisonIntro: {
      eyebrow: 'Side by side',
      title: 'Two ways to handle a drain pan. One is built for today.',
      body:
        'The mechanical float is unchanged from a generation ago. The AC Drain Wiz Standard Sensor Switch is built around water-level sensing, no moving float, and automatic AC shutoff capability when properly wired.',
    },

    sectionEyebrows: {
      howItWorks: 'How it works',
      faq: 'FAQ & eligibility',
      submission: 'Your turn',
      hallOfShame: 'Impact spotlight',
      winners: 'Winners',
    },

    howItWorks: {
      eyebrow: 'How it works',
      title: 'Share it. Get reviewed. Enter to win.',
      body:
        'Three steps from float-switch story to monthly prize entry. Submit on this page, follow us on Instagram, and watch the live drawing each month — no purchase necessary where applicable.',
      steps: [
        {
          title: 'Share your story',
          body:
            'Tell us about the callback, ceiling stain, emergency visit, or stuck float using the form below. Include your Instagram handle so we can confirm you follow @ACDrainWiz before your entry is eligible.',
        },
        {
          title: 'We review it',
          body:
            'Our team verifies eligibility — including your Instagram follow — protects privacy, and may edit for length or clarity. Standout stories may be featured in the Float Switch Story Hall of Fame — never without your permission.',
        },
        {
          title: 'Watch the live drawing',
          body:
            'Each approved entry is entered into our monthly random drawing. The winner is selected during a live drawing on Instagram. We also post winner announcements on this page.',
        },
      ] satisfies CampaignHowItWorksStep[],
      cta: {
        label: 'Submit Your Story',
        href: '#submit-story',
      } satisfies CampaignCta,
    },

    faq: {
      eyebrow: 'FAQ & eligibility',
      title: 'Common questions before you enter',
      body:
        'Quick answers on who can participate, what makes a story eligible, and how the monthly iPad drawing works on Instagram. See Official Rules below for full contest details.',
      eligibilityTitle: 'At a glance',
      eligibilityItems: [
        {
          label: 'Who can enter',
          detail: 'Contractors, homeowners, property managers, and distributors with a real float-switch story.',
        },
        {
          label: 'How to enter',
          detail: 'Submit the story form on this page — not on Instagram.',
        },
        {
          label: 'Instagram follow',
          detail: 'Follow @ACDrainWiz on Instagram and provide your handle on the form so we can verify eligibility.',
        },
        {
          label: 'Purchase required',
          detail: 'No — no purchase necessary for prize entry where applicable.',
        },
        {
          label: 'Prize',
          detail: 'One iPad (latest available model) per monthly drawing from approved entries.',
        },
        {
          label: 'Live drawing',
          detail: 'Monthly random drawing broadcast live on Instagram.',
        },
        {
          label: 'Review',
          detail: 'Every submission is reviewed before publication or prize entry.',
        },
      ] satisfies CampaignEligibilityItem[],
      items: [
        {
          question: 'Who is eligible to enter?',
          answer:
            'The campaign is open to contractors, homeowners, property managers, and distributors who can share a true story about a mechanical float-switch experience — a callback, ceiling stain, drain pan backup, emergency visit, or similar. Void where prohibited. Additional eligibility requirements may apply; see Official Rules.',
        },
        {
          question: 'Do I need to purchase AC Drain Wiz products to enter?',
          answer:
            'No. No purchase is necessary to enter or win where applicable. Buying a product does not improve your chances of winning.',
        },
        {
          question: 'What kind of story qualifies?',
          answer:
            'We are looking for real experiences with traditional mechanical float switches — stuck floats, late shutoffs, water damage, repeat callbacks, or jobs where early warning would have helped. Stories must be truthful to the best of your knowledge. Submissions may be edited for length, clarity, or to remove identifying details.',
        },
        {
          question: 'Will my story be published?',
          answer:
            'All submissions are reviewed first. We do not publish identifying details without your approval. Approved stories may appear in the Float Switch Story Hall of Fame or in campaign marketing — always with privacy in mind.',
        },
        {
          question: 'What is the prize?',
          answer:
            'Each month, one eligible approved entry is selected to receive a new Apple iPad (latest available model). Prize details and approximate retail value are subject to the Official Rules.',
        },
        {
          question: 'How are winners selected?',
          answer:
            'Eligible approved entries from the monthly entry period are entered into a random drawing. The drawing is conducted live on Instagram so entrants can watch in real time. Winner announcements are also posted on this campaign page.',
        },
        {
          question: 'Why do you need my Instagram handle?',
          answer:
            'Stories are submitted on this website, not on Instagram. We use your Instagram handle to confirm you follow @ACDrainWiz on Instagram before your entry is eligible for the monthly prize drawing. The live drawing itself is broadcast on Instagram each month.',
        },
        {
          question: 'Can I submit more than once?',
          answer:
            'Please limit entries to one submission per person per story experience. Duplicate or incomplete submissions may be disqualified. See Official Rules for entry limits and drawing periods.',
        },
        {
          question: 'Can I include photos or video?',
          answer:
            'Optional photo or video uploads are welcome if they help illustrate your story. Do not include identifying information about customers or property residents without permission. All uploads are reviewed with your submission.',
        },
        {
          question: 'How will my contact information be used?',
          answer:
            'We use your name, email, phone, city, and Instagram handle to verify eligibility, confirm your Instagram follow, follow up during review, and contact winners. We do not sell your information. See our Privacy Policy at the bottom of this page.',
        },
      ] satisfies CampaignFaqItem[],
      footerNote:
        'Still have questions about the campaign or your submission? Reach out through our support channels — we are happy to help.',
    },

    submissionTitle: 'Tell us your float-switch story',
    submissionIntro:
      'Callbacks. Ceiling stains. Emergency visits. Stuck floats. Submit your story here — then follow us on Instagram to catch the monthly live drawing.',
    submissionReassurance:
      'Your name, city, and Instagram handle help us verify eligibility. We never publish identifying details without your approval.',
    moderationNote:
      'Submissions are reviewed before publication to protect privacy, remove inappropriate language, verify your Instagram follow, and confirm campaign eligibility.',

    form: {
      instagramHandle: {
        label: 'Instagram handle',
        hint: 'Required — we use this to confirm you follow @ACDrainWiz on Instagram before your entry is eligible for the monthly drawing.',
        placeholder: '@yourhandle',
        followPromptBefore: 'Follow ',
        followPromptAfter: ' on Instagram before you submit.',
      },
    },

    /** Compact examples above optional photo upload — photos/caption from overlay.storyContext */
    uploadExamples: {
      title: 'Examples of helpful photos',
      hint: 'Stains, backups, drain pans, or on-site damage—optional, and no identifying details.',
      uploadLabel: 'Upload photo',
      uploadOptionalNote: 'Video upload coming soon.',
    },

    hallOfShame: {
      title: 'The Float Switch Story Hall of Fame',
      intro:
        'The callbacks that left a mark — ceiling stains, drain pan floods, emergency visits, and repair bills. We feature approved stories that best show why floats fail when it matters most. Featured for impact; separate from our monthly iPad drawing.',
      comingSoonLabel: 'Coming soon',
      /** Example layouts shown until approved stories load from the API */
      previewStories: [
        {
          id: 'preview-callback',
          firstName: 'Marcus',
          instagramHandle: '@fl_hvac_pro',
          audience: 'Contractor',
          region: 'South Florida',
          storyTitle: 'The 10 p.m. callback',
          excerpt:
            'Float switch never tripped. Pan overflowed before anyone noticed — second emergency visit that month.',
          imageKey: 'storyDamage2',
          imageAlt: 'Water overflow in an AC drain pan',
          layoutNote: 'Example layout · not a submission',
        },
        {
          id: 'preview-ceiling',
          firstName: 'Elena',
          instagramHandle: '@texas_home_fix',
          audience: 'Homeowner',
          region: 'Central Texas',
          storyTitle: 'Stain above the living room',
          excerpt:
            'By the time the float worked, condensate had already reached the ceiling. Drywall repair followed.',
          imageKey: 'storyDamage1',
          imageAlt: 'Water stain on a ceiling from condensate line backup',
          layoutNote: 'Example layout · not a submission',
        },
        {
          id: 'preview-stuck-float',
          firstName: 'Jordan',
          instagramHandle: '@atl_property_ops',
          audience: 'Property Manager',
          region: 'Metro Atlanta',
          storyTitle: 'Same float, third visit',
          excerpt:
            'Mechanical float looked fine on the last service call — until it did not. Another stuck-float callback.',
          imageKey: 'floatSwitchTrans',
          imageAlt: 'Traditional mechanical float switch',
          layoutNote: 'Example layout · not a submission',
        },
      ] satisfies readonly CampaignHallOfFamePreviewStory[],
    },

    winners: {
      title: 'Monthly Winners',
      body:
        'One eligible approved entry wins an iPad (latest available model) each month. After our first drawing, the winner announcement and live drawing replay will be posted here — watch the selection live on Instagram.',
      comingSoonLabel: 'First drawing — coming soon',
    },

    legal: {
      title: 'Important notes',
      productDisclaimer:
        'Individual results vary. AC Drain Wiz supports proactive drain maintenance and helps reduce risk; it is not a substitute for code-required devices in jurisdictions that mandate them.',
      contestNoteBefore: 'The Trash the Float promotion is governed by the ',
      contestNoteAfter: '.',
    },
  },
} as const

export type TrashTheFloatCopy = typeof TRASH_THE_FLOAT
