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

/** Hall of Fame card badge — monthly iPad winner vs impact spotlight runner-up vs preview sample */
export type HallOfFameStoryBadgeKind = 'monthly-winner' | 'featured-story' | 'sample-story'

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
  badgeKind: HallOfFameStoryBadgeKind
  footerNote: string
}

export const TRASH_THE_FLOAT = {
  /** Anchor path for all Official Rules links site-wide */
  officialRulesHref: TRASH_THE_FLOAT_OFFICIAL_RULES_HREF,

  // Permanent dismiss — localStorage (survives browser restarts).
  /** Bump when permanent dismiss semantics change. */
  storageKey: 'acdw.trashTheFloat.overlay.dismissed.v2',

  /** Session dismiss — sessionStorage (once per browser tab session). */
  sessionStorageKey: 'acdw.trashTheFloat.overlay.session.v1',

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
    handle: '@ac_drain_wiz',
    profileUrl: 'https://www.instagram.com/ac_drain_wiz/',
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
    dontShowAgainLabel: "Don't show again on future visits",
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
      hallOfShame: 'Past winners & standouts',
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
          question: 'When can I enter?',
          answer:
            'Entries open on May 27, 2026 for the first drawing — everything received from May 27 through June 30, 2026 is placed in the July 1, 2026 drawing. After that, each monthly entry period runs from the 1st through the last day of the calendar month, and whichever month you submit in is the month you\'re entered to win. Entries cannot be held over or applied to a different month (except where the two-entry minimum isn\'t met, in which case entries roll forward — see Official Rules).',
        },
        {
          question: 'How are winners selected?',
          answer:
            'Eligible approved entries from the monthly entry period are entered into a random drawing held on or about the 1st of the following month — live on Instagram so entrants can watch in real time. Our first drawing is on or about July 1, 2026 for the extended May 27 – June 30 launch window. Winner announcements are also posted on this campaign page.',
        },
        {
          question: 'What are my odds of winning?',
          answer:
            'Odds of winning vary based on the size of the eligible drawing pool, which may include entries rolled forward from one or more prior months if those months did not meet the minimum-entries threshold. A drawing requires at least two eligible entries to be held; if a given month does not meet that minimum, that month\'s iPad prize is forfeited (not awarded), and only the eligible entries from that month roll forward into the next drawing. Note: you can only win once during the Promotion Period — if you win in an earlier month, your later entries are not eligible to win an additional prize. See Official Rules for full details.',
        },
        {
          question: 'Why do you need my Instagram handle?',
          answer:
            'Stories are submitted on this website, not on Instagram. We use your Instagram handle to confirm you follow @ACDrainWiz on Instagram before your entry is eligible for the monthly prize drawing. The live drawing itself is broadcast on Instagram each month.',
        },
        {
          question: 'Can I submit more than once?',
          answer:
            'One entry per Instagram account per month, and one entry per person per distinct story experience. The Instagram account you cite on the form must be your own, active, and following @ACDrainWiz at the time you submit. Multiple accounts controlled by the same person or household — or accounts created to game the system — will be treated as a single entrant and additional submissions may be disqualified. See Official Rules for full entry limits.',
        },
        {
          question: 'Can I include photos or video?',
          answer:
            'Optional photo or video uploads are welcome if they help illustrate your story. Do not include identifying information about customers or property residents without permission. All uploads are reviewed with your submission.',
        },
        {
          question: 'How will my contact information be used?',
          answer:
            'We use your name, email, phone, city, and Instagram handle solely to verify eligibility, confirm your Instagram follow, and notify potential winners. We will not email, text, or call you with marketing or promotional messages unless you separately opt in. We do not sell your information. See our Privacy Policy at the bottom of this page.',
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

    /** Post-submit #submit-story section — replaces pre-submit header when entry succeeds */
    sectionSuccess: {
      eyebrow: 'Entry received',
      title: 'Story received — nice work trashing the float',
      lead:
        'We got your story. Follow the steps below so we can verify eligibility and move your entry into review.',
      checklist: {
        submittedLabel: 'Story submitted',
        followLabel: 'Follow @ac_drain_wiz on Instagram',
        followHint:
          'Required — we verify your follow with the handle you provided before your entry is eligible for the monthly drawing.',
      },
      nextStepsTitle: 'What happens next',
      nextSteps: [
        {
          title: 'We review your story',
          body:
            'Our team checks privacy, eligibility, and confirms you follow @ac_drain_wiz on Instagram using the handle you submitted.',
        },
        {
          title: 'Approved entries enter the monthly drawing',
          body:
            'Each calendar month is a separate entry period (first day 12:00:01 a.m. ET through last day 11:59:59 p.m. ET). Approved stories from that period are entered into that month\'s random drawing.',
        },
        {
          title: 'Live drawing on Instagram',
          body:
            'On or about the fifth (5th) business day of the month following your entry period, we conduct a random drawing live on @ac_drain_wiz (for example, June entries are drawn on or about the fifth business day of July). Winners are also announced on this page.',
        },
      ] satisfies { title: string; body: string }[],
      primaryCtaLabel: 'Follow @ac_drain_wiz on Instagram',
      hallOfFameLink: 'Explore the Hall of Fame',
      anotherStoryLink: 'Have another float-switch story? Submit another entry',
      reentryGate: {
        eyebrow: 'Additional entry',
        title: 'Before you submit another story',
        lead:
          'Each story counts as a separate entry. Confirm these requirements with your new Instagram account before you continue to the form.',
        bullets: [
          'Use a different Instagram handle than your previous submission(s).',
          'Follow @ac_drain_wiz on Instagram with that new handle — required for drawing eligibility.',
          'One entry per distinct story experience per entry period. See Official Rules for full details.',
        ],
        continueLabel: 'Continue to form',
        cancelLabel: 'Stay on this page',
      },
      instagramReuseHint:
        'Each story needs its own Instagram handle — different from your previous submission(s). Follow @ac_drain_wiz with that account before you submit.',
    },

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
      title: 'Float Switch Story Hall of Fame',
      intro:
        'Real callbacks from contractors, homeowners, and property managers who entered Trash the Float — including monthly drawing winners and runner-up stories we feature for impact. Names and details are published only with permission.',
      badges: {
        monthlyWinner: 'Monthly winner',
        featuredStory: 'Featured story',
        sampleStory: 'Sample story',
      },
      previewFooterNote:
        'Sample layout — real winner stories post after our first drawing',
      liveFooterNoteTemplate: 'Featured with permission · {monthYear}',
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
          badgeKind: 'sample-story',
          footerNote:
            'Sample layout — real winner stories post after our first drawing',
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
          badgeKind: 'sample-story',
          footerNote:
            'Sample layout — real winner stories post after our first drawing',
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
          badgeKind: 'sample-story',
          footerNote:
            'Sample layout — real winner stories post after our first drawing',
        },
      ] satisfies readonly CampaignHallOfFamePreviewStory[],
    },

    winners: {
      title: 'Monthly Winners',
      body:
        'One eligible approved entry wins an iPad (latest available model) each month, provided at least two eligible entries are received during the monthly entry period. Entries are accepted starting May 27, 2026 for our extended launch window — all entries received between May 27 and June 30, 2026 are placed in the first drawing on or about July 1, 2026. After that, the cycle is monthly: entries received during the calendar month are entered into that month\'s drawing held on or about the 1st of the following month, broadcast live on Instagram, with winner announcements and drawing replays posted here.',
      comingSoonLabel: 'First drawing — July 1, 2026 · Live on Instagram',
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
