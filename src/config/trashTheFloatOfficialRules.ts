/**
 * Trash the Float — Official Rules
 *
 * Structured copy for the campaign sweepstakes. Single source of truth for
 * Official Rules content on the site (#official-rules on /trash-the-float).
 */

import { SUPPORT_CONTACT } from './acdwKnowledge'

/** In-page anchor + path for all Official Rules links */
export const TRASH_THE_FLOAT_OFFICIAL_RULES_HREF = '/trash-the-float#official-rules'

/** Instagram handle used for follow verification and live drawings */
export const TRASH_THE_FLOAT_INSTAGRAM_HANDLE = '@ACDrainWiz'

export type OfficialRulesBlock = {
  id: string
  title: string
  paragraphs: readonly string[]
  bullets?: readonly string[]
}

export const TRASH_THE_FLOAT_OFFICIAL_RULES = {
  href: TRASH_THE_FLOAT_OFFICIAL_RULES_HREF,

  title: 'Trash the Float — Official Rules',
  subtitle: 'Story Submission Promotion & Monthly Prize Drawing',
  effectiveDateLabel: 'Effective date: June 1, 2026',
  lastUpdatedLabel: 'Last updated: May 22, 2026',

  sponsor: {
    name: '50 50 Holdings, Inc. (d/b/a AC Drain Wiz)',
    addressLines: ['240 W Palmetto Park Rd, Suite 110', 'Boca Raton, FL 33432'],
    email: SUPPORT_CONTACT.supportEmail,
    phoneDisplay: SUPPORT_CONTACT.phoneDisplay,
    telHref: SUPPORT_CONTACT.telHref,
  },

  /** Mail-in alternate method of entry (AMOE) — same location as Sponsor */
  amoeMailingAddress: {
    attention: 'Trash the Float AMOE',
    lines: ['50 50 Holdings, Inc.', '240 W Palmetto Park Rd, Suite 110', 'Boca Raton, FL 33432'],
  },

  intro: [
    'NO PURCHASE NECESSARY TO ENTER OR WIN. A PURCHASE WILL NOT INCREASE YOUR CHANCES OF WINNING. Void where prohibited by law and in jurisdictions where registration or bonding is required but has not been obtained.',
    'These Official Rules govern the "Trash the Float" story submission promotion and associated monthly random prize drawing (the "Promotion") operated by the Sponsor. By submitting a story or otherwise participating, you agree to these Official Rules, our Privacy Policy, and all decisions of the Sponsor, which are final and binding.',
  ],

  quickNav: [
    { id: 'sponsor', label: '1. Sponsor' },
    { id: 'promotion-period', label: '2. Promotion Period' },
    { id: 'eligibility', label: '3. Eligibility' },
    { id: 'how-to-enter', label: '4. How to Enter' },
    { id: 'no-purchase', label: '5. No Purchase Necessary' },
    { id: 'submission-requirements', label: '6. Submission Requirements' },
    { id: 'review-publication', label: '7. Review & Publication' },
    { id: 'drawing', label: '8. Monthly Drawing' },
    { id: 'prize', label: '9. Prize' },
    { id: 'winner-notification', label: '10. Winner Notification' },
    { id: 'taxes', label: '11. Taxes' },
    { id: 'publicity', label: '12. Publicity Release' },
    { id: 'general-conditions', label: '13. General Conditions' },
    { id: 'privacy', label: '14. Privacy' },
    { id: 'disputes', label: '15. Disputes' },
    { id: 'hall-of-fame', label: '16. Hall of Fame' },
  ] as const,

  sections: [
    {
      id: 'sponsor',
      title: '1. Sponsor & Administrator',
      paragraphs: [
        'The Promotion is sponsored and administered by 50 50 Holdings, Inc., doing business as AC Drain Wiz ("Sponsor"), at the address listed above.',
      ],
    },
    {
      id: 'promotion-period',
      title: '2. Promotion Period & Entry Periods',
      paragraphs: [
        'The Promotion begins on June 1, 2026 at 12:00:01 a.m. Eastern Time ("ET") and ends on May 31, 2027 at 11:59:59 p.m. ET, or until terminated earlier by the Sponsor (the "Promotion Period").',
        'Monthly entry periods and corresponding random drawings run on a calendar-month basis. Each monthly entry period begins at 12:00:01 a.m. ET on the first day of the calendar month and ends at 11:59:59 p.m. ET on the last day of that calendar month. The first entry period is June 1, 2026 through June 30, 2026. The final entry period is May 1, 2027 through May 31, 2027.',
        'Sponsor\'s computer is the official time-keeping device for the Promotion.',
      ],
    },
    {
      id: 'eligibility',
      title: '3. Eligibility',
      paragraphs: [
        'The Promotion is open to legal residents of the fifty (50) United States and the District of Columbia who are at least eighteen (18) years old at the time of entry. Residents of U.S. territories and possessions are not eligible.',
      ],
      bullets: [
        'Eligible participants include contractors, homeowners, property managers, and distributors who can share a genuine story about a mechanical float-switch experience (for example: a callback, ceiling stain, drain pan backup, or emergency service visit).',
        'Employees, officers, directors, agents, and immediate family members (spouse, parents, children, siblings, regardless of residence) of the Sponsor, its affiliates, advertising/promotion agencies, and prize suppliers are not eligible.',
        'Void where prohibited or restricted by law.',
      ],
    },
    {
      id: 'how-to-enter',
      title: '4. How to Enter',
      paragraphs: [
        'During an entry period, complete and submit the official story submission form on the Trash the Float campaign page at acdrainwiz.com/trash-the-float with all required fields, including a valid Instagram handle. Stories are not submitted via Instagram; the form on the campaign page is the sole official online entry method unless an Alternate Method of Entry (AMOE) is used as described in Section 5.',
        `To be eligible for the monthly prize drawing, you must follow the Sponsor on Instagram at ${TRASH_THE_FLOAT_INSTAGRAM_HANDLE} at the time of submission and through winner verification. Sponsor will use the Instagram handle you provide to confirm your follow status before approving your entry for the drawing.`,
        'Limit: one (1) entry per person per distinct story experience per entry period unless Sponsor expressly permits otherwise in writing. Duplicate, incomplete, or fraudulent submissions may be disqualified at Sponsor\'s sole discretion.',
      ],
    },
    {
      id: 'no-purchase',
      title: '5. No Purchase Necessary; Alternate Method of Entry',
      paragraphs: [
        'NO PURCHASE NECESSARY TO ENTER OR WIN. Buying AC Drain Wiz products does not improve your odds of winning.',
        'To enter without using the online submission form, hand-print the following on a plain 3" × 5" card: your full name, mailing address, email address, phone number, city and state, Instagram handle, story title, and story (minimum thirty (30) words describing your mechanical float-switch experience). Place the card in a hand-addressed #10 envelope with sufficient postage and mail to the address below.',
      ],
      bullets: [
        'Trash the Float AMOE, 50 50 Holdings, Inc., 240 W Palmetto Park Rd, Suite 110, Boca Raton, FL 33432.',
        'Mail-in entries must be postmarked by the last day of the applicable monthly entry period and received within seven (7) days after the end of that period to be eligible for that period\'s drawing.',
        'Limit one (1) mail-in entry per outer envelope per monthly entry period. Mail-in entries must include a legible email address and Instagram handle.',
        `You must follow ${TRASH_THE_FLOAT_INSTAGRAM_HANDLE} on Instagram before your mail-in entry can be approved for the monthly prize drawing, subject to the same verification process as online entries.`,
        'Mail-in entries will be treated equally to online entries in the random drawing for the applicable entry period, subject to verification of eligibility.',
      ],
    },
    {
      id: 'submission-requirements',
      title: '6. Story Submission Requirements',
      paragraphs: [
        'By submitting, you represent that your story is true to the best of your knowledge and that you have the right to submit the content and any media you provide.',
      ],
      bullets: [
        'Stories must relate to a real mechanical float-switch experience. Sponsor may reject entries that appear fabricated, incomplete, off-topic, or inappropriate.',
        `You must provide a valid Instagram handle on the submission form and follow the Sponsor on Instagram at ${TRASH_THE_FLOAT_INSTAGRAM_HANDLE} before your entry can be approved for the monthly prize drawing. Sponsor may verify follow status at submission and again before a drawing.`,
        'Do not include customer, tenant, or resident identifying information without permission. Sponsor may redact identifying details before publication.',
        'Uploaded media must not contain unlawful, defamatory, obscene, or infringing material. Sponsor may remove or reject submissions at its discretion.',
        'You must check the consent boxes on the submission form confirming truthfulness and agreement to these Official Rules and the Privacy Policy.',
      ],
    },
    {
      id: 'review-publication',
      title: '7. Review, Moderation & Publication',
      paragraphs: [
        'All submissions are reviewed before they are approved for publication or included in a monthly drawing. Approval for publication is not guaranteed.',
        'Sponsor may edit submissions for length, clarity, or to remove identifying details. Sponsor will not publish identifying details without your approval where such approval is required by these Rules or applicable law.',
        'Approved stories may appear in the Float Switch Story Hall of Fame (impact spotlight), on the campaign page, in marketing materials, or in winner-selection content. Publication in the Hall of Fame is separate from selection as a monthly prize winner.',
      ],
    },
    {
      id: 'drawing',
      title: '8. Monthly Random Drawing & Odds',
      paragraphs: [
        'On or about the fifth (5th) business day of the month following each entry period (for example, entries received during June 2026 are entered into the drawing conducted on or about the fifth business day of July 2026), Sponsor will conduct a random drawing from all eligible entries received and approved during the applicable monthly entry period.',
        `The drawing will be conducted live on the Sponsor's designated Instagram account (${TRASH_THE_FLOAT_INSTAGRAM_HANDLE}) so entrants and the public may observe the selection in real time. Sponsor may also post recordings or announcements on the campaign page.`,
        'Odds of winning depend on the number of eligible entries received during that period. Potential winners are subject to verification of eligibility — including Instagram follow status — and compliance with these Official Rules. Sponsor\'s decisions are final.',
      ],
    },
    {
      id: 'prize',
      title: '9. Prize Description & Approximate Retail Value',
      paragraphs: [
        'One (1) prize per monthly drawing: one (1) Apple iPad in the latest available model as determined by the Sponsor at the time of award (specific model, storage capacity, and color based on availability).',
        'Approximate Retail Value ("ARV"): $399 USD per prize. Total ARV of all prizes depends on the number of monthly drawings conducted during the Promotion Period.',
        'Prize is awarded "as is" with no warranty beyond manufacturer warranty (if any). No cash alternative, substitution, or transfer except at Sponsor\'s sole discretion due to unavailability, in which case a prize of equal or greater ARV may be awarded.',
      ],
    },
    {
      id: 'winner-notification',
      title: '10. Winner Notification, Verification & Forfeiture',
      paragraphs: [
        'Potential winners will be notified by email and/or phone using the contact information provided at entry within approximately seven (7) business days after the drawing.',
        'Potential winners may be required to sign and return an affidavit of eligibility, liability/publicity release, and any tax forms within ten (10) days of notification. Failure to respond, return documents, or meet eligibility requirements may result in forfeiture and selection of an alternate winner.',
        'Unclaimed prizes may be forfeited and awarded to an alternate winner or not awarded, at Sponsor\'s discretion, subject to applicable law.',
      ],
    },
    {
      id: 'taxes',
      title: '11. Taxes',
      paragraphs: [
        'Winners are responsible for all federal, state, and local taxes, filings, and assessments associated with acceptance and use of a prize. Sponsor does not gross up or withhold taxes on prizes. Sponsor may issue IRS Form 1099 (or equivalent) as required by law for prizes at or above applicable reporting thresholds.',
      ],
    },
    {
      id: 'publicity',
      title: '12. Publicity Release',
      paragraphs: [
        'Except where prohibited by law, acceptance of a prize constitutes permission for Sponsor to use winner\'s name, city/state, likeness, and story excerpts for advertising and promotional purposes without additional compensation, unless restricted by law.',
        'For Hall of Fame or marketing features outside of winner announcements, Sponsor will obtain appropriate consent before publishing identifying details as described in Section 7.',
      ],
    },
    {
      id: 'general-conditions',
      title: '13. General Conditions & Limitations of Liability',
      paragraphs: [
        'Sponsor may cancel, suspend, or modify the Promotion if fraud, technical failures, or any factor beyond Sponsor\'s reasonable control impairs the integrity of the Promotion, subject to applicable law.',
        'By participating, you release Sponsor and its affiliates, suppliers, and agencies from liability for claims arising from participation, acceptance/use/misuse of a prize, or publication of submitted content except where prohibited by law.',
        'Individual results from AC Drain Wiz products vary. AC Drain Wiz supports proactive drain maintenance and helps reduce risk; it is not a substitute for code-required devices in jurisdictions that mandate them.',
      ],
    },
    {
      id: 'privacy',
      title: '14. Privacy',
      paragraphs: [
        'Information collected in connection with the Promotion is used to administer the Promotion, review submissions, verify Instagram follow status, contact potential winners, and as described in the AC Drain Wiz Privacy Policy at acdrainwiz.com/privacy-policy. Sponsor will not sell your personal information.',
      ],
    },
    {
      id: 'disputes',
      title: '15. Disputes & Governing Law',
      paragraphs: [
        'Except where prohibited by applicable sweepstakes or consumer protection law, disputes arising from or relating to this Promotion shall be resolved through binding arbitration on an individual basis in the State of Florida under applicable commercial arbitration rules, consistent with the AC Drain Wiz Site Terms of Use. You waive any right to participate in a class, collective, or representative action.',
        'Where arbitration is not permitted, these Official Rules are governed by the laws of the State of Florida, without regard to conflict-of-law rules. Any disputes not subject to arbitration shall be brought exclusively in the state or federal courts located in Florida.',
      ],
    },
    {
      id: 'hall-of-fame',
      title: '16. Float Switch Story Hall of Fame (Impact Spotlight)',
      paragraphs: [
        'The Hall of Fame highlights standout approved stories for educational and marketing purposes. Selection for the Hall of Fame is at Sponsor\'s discretion and is separate from the monthly random prize drawing. Hall of Fame features do not entitle participants to additional prizes unless expressly stated in writing by Sponsor.',
      ],
    },
  ] satisfies readonly OfficialRulesBlock[],

  footerNote:
    'For questions about these Official Rules or the Promotion, contact the Sponsor using the information in Section 1. For privacy-related requests, see the Privacy Policy.',
} as const

export type TrashTheFloatOfficialRules = typeof TRASH_THE_FLOAT_OFFICIAL_RULES
