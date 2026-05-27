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
  effectiveDateLabel: 'Effective date: May 27, 2026',
  lastUpdatedLabel: 'Last updated: May 27, 2026',

  sponsor: {
    name: '50 50 Holdings, Inc. (d/b/a AC Drain Wiz)',
    addressLines: ['240 W Palmetto Park Rd, Suite 110', 'Boca Raton, FL 33432'],
    email: SUPPORT_CONTACT.supportEmail,
    phoneDisplay: SUPPORT_CONTACT.phoneDisplay,
    telHref: SUPPORT_CONTACT.telHref,
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
    { id: 'drawing', label: '8. Monthly Drawing, Minimum Entries & Odds' },
    { id: 'prize', label: '9. Prize' },
    { id: 'winner-notification', label: '10. Winner Notification, Verification & Forfeiture' },
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
        'The Promotion begins on May 27, 2026 at 12:00:01 a.m. Eastern Time ("ET"). The final monthly entry period ends on May 31, 2027 at 11:59:59 p.m. ET, and the final monthly drawing is conducted on or about June 1, 2027, after which the Promotion concludes (collectively, the "Promotion Period").',
        'Monthly entry periods run on a calendar-month basis. Each entry is placed only in the drawing for the entry period during which it is received (as determined by Sponsor\'s computer time) and cannot be applied to, transferred to, or held over for any other monthly entry period, except for entries that roll forward under the two-entry minimum described in Section 8. Except as expressly provided in this Section 2, each monthly entry period begins at 12:00:01 a.m. ET on the first day of the calendar month and ends at 11:59:59 p.m. ET on the last day of that calendar month. As a one-time launch exception, the first entry period is extended to begin at 12:00:01 a.m. ET on May 27, 2026 and to run continuously through 11:59:59 p.m. ET on June 30, 2026; all eligible entries received during this combined May 27 – June 30, 2026 launch window will be placed in the first drawing held on or about July 1, 2026. After the first entry period, all subsequent monthly entry periods follow the standard calendar-month schedule. The final entry period is May 1, 2027 through May 31, 2027.',
        'Sponsor reserves the right to end the Promotion before the originally scheduled conclusion of the Promotion Period at any time and in its sole discretion (an "Early Termination"), subject to applicable law. Notwithstanding any Early Termination, any monthly entry period that has already satisfied the two (2)-eligible-entry minimum described in Section 8 as of the date Sponsor publicly announces the Early Termination will not be cancelled: Sponsor will still conduct that period\'s random drawing on the originally scheduled drawing date (or as soon as reasonably practicable thereafter) and will award that period\'s prize in accordance with these Official Rules. Monthly entry periods that have not yet satisfied the two-entry minimum as of the Early Termination announcement may be cancelled by Sponsor; entries received during such cancelled periods will not be carried forward to any subsequent period and no prize will be awarded for those cancelled periods, except as Sponsor may otherwise determine in its discretion and subject to applicable law.',
        'Sponsor\'s computer is the official time-keeping device for the Promotion.',
      ],
    },
    {
      id: 'eligibility',
      title: '3. Eligibility',
      paragraphs: [
        'The Promotion is open to legal residents of the fifty (50) United States and the District of Columbia who are at least eighteen (18) years old at the time of entry. Residents of U.S. territories and possessions (including Puerto Rico, the U.S. Virgin Islands, Guam, American Samoa, and the Northern Mariana Islands) are not eligible.',
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
        'During an entry period, complete and submit the official story submission form on the Trash the Float campaign page at acdrainwiz.com/trash-the-float with all required fields, including a valid Instagram handle. The online submission form is the sole and exclusive method of entry. Stories submitted directly through Instagram, by email, by telephone, by mail, or through any other channel will not be considered entries and will be disregarded.',
        `To be eligible for the monthly prize drawing, you must follow the Sponsor on Instagram at ${TRASH_THE_FLOAT_INSTAGRAM_HANDLE} at the time of submission and through winner verification. Sponsor will use the Instagram handle you provide to confirm your follow status before approving your entry for the drawing. An Instagram account is free to create at instagram.com.`,
        `Entry limits: (a) one (1) entry per Instagram account per monthly entry period; (b) one (1) entry per person per distinct story experience per entry period; and (c) the Instagram handle provided on each entry form must be a unique, active, individual Instagram account that the entrant personally controls and that is following the Sponsor at ${TRASH_THE_FLOAT_INSTAGRAM_HANDLE} at the time of submission and through winner verification. Each entry must cite the entrant's own Instagram handle on the entry form; entries that omit the handle, cite an inaccurate handle, or cite an account that is not following the Sponsor at the time of submission and through verification are not eligible. Multiple Instagram accounts controlled or substantially controlled by the same individual or household — including accounts created primarily to circumvent these entry limits — will be deemed a single entrant at Sponsor's discretion, and additional submissions from such accounts may be disqualified. Duplicate, incomplete, fraudulent, or circumvention-related submissions may be disqualified at Sponsor's sole discretion.`,
      ],
    },
    {
      id: 'no-purchase',
      title: '5. No Purchase Necessary',
      paragraphs: [
        'NO PURCHASE NECESSARY TO ENTER OR WIN. The Promotion does not require any monetary payment, purchase, or other monetary consideration to enter or to be eligible to win. Buying AC Drain Wiz products does not improve your odds of winning.',
        `Following the Sponsor on Instagram at ${TRASH_THE_FLOAT_INSTAGRAM_HANDLE} is free, takes only a moment, and does not constitute a purchase, payment, or other monetary consideration. An Instagram account can be created at no cost at instagram.com. Sponsor does not accept mail-in, email, telephone, or in-person entries; the online story submission form on the Trash the Float campaign page is the sole and exclusive method of entry.`,
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
        `You must provide a valid, unique, active Instagram handle that you personally control on the submission form, and that account must be following the Sponsor at ${TRASH_THE_FLOAT_INSTAGRAM_HANDLE} before your entry can be approved for the monthly prize drawing. One (1) entry per Instagram account per monthly entry period. Sponsor may verify follow status, account authenticity, and account ownership at the time of submission and again before any drawing.`,
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
        'Sponsor may edit submissions for length, clarity, or to remove identifying details. Except as permitted by Section 12 for prize winners or where you have separately provided written consent, Sponsor will not publish identifying details about an entrant (such as full name, image, or contact information) without that entrant\'s approval.',
        'Approved stories may appear in the Float Switch Story Hall of Fame (impact spotlight), on the campaign page, in marketing materials, or in winner-selection content. Publication in the Hall of Fame is separate from selection as a monthly prize winner.',
      ],
    },
    {
      id: 'drawing',
      title: '8. Monthly Random Drawing, Minimum Entries & Odds',
      paragraphs: [
        'On or about the first (1st) day of the calendar month immediately following each monthly entry period — or, if the first day falls on a Saturday, Sunday, or U.S. federal holiday, on the next business day — Sponsor will conduct a random drawing from all eligible entries received and approved during the applicable monthly entry period. The first drawing will be held on or about July 1, 2026 for entries received during the extended first entry period (May 27, 2026 – June 30, 2026).',
        `The drawing will be conducted live on the Sponsor's designated Instagram account (${TRASH_THE_FLOAT_INSTAGRAM_HANDLE}) so entrants and the public may observe the selection in real time. Sponsor may also post recordings or announcements on the campaign page. This Promotion is in no way sponsored, endorsed, administered by, or associated with Instagram, LLC or Meta Platforms, Inc. Entrants release Instagram and Meta from any and all liability related to the Promotion.`,
        'A minimum of two (2) eligible entries is required for Sponsor to conduct a drawing for any given monthly entry period. If fewer than two (2) eligible entries are received during a monthly entry period, no drawing will be held for that period and the iPad prize allocated for that period will be forfeited and will not be awarded. All eligible entries received during such an under-minimum period will, however, roll forward and be added to the next monthly entry period\'s entry pool for the next scheduled drawing (the prize itself does not roll forward; each drawing awards a maximum of one (1) iPad). Eligible entries continue to roll forward in this manner until they are included in a drawing in which the two-entry minimum is satisfied or until the end of the Promotion Period, after which Sponsor may, in its sole discretion and subject to applicable law, conduct a final make-up drawing for any such rolled-forward entries, but Sponsor is under no obligation to do so.',
        'Odds of winning depend on the size of the eligible drawing pool for the applicable drawing, which may include eligible entries rolled forward from one or more prior monthly entry periods that did not satisfy the two-entry minimum. Potential winners are subject to verification of eligibility — including Instagram follow status, the entry limits in Section 4, and the one-prize-per-Promotion-Period limit in Section 9 — and compliance with these Official Rules. Sponsor\'s decisions are final and binding.',
      ],
    },
    {
      id: 'prize',
      title: '9. Prize Description & Approximate Retail Value',
      paragraphs: [
        'One (1) prize per monthly drawing: one (1) Apple iPad in the latest available model as determined by the Sponsor at the time of award (specific model, storage capacity, and color based on availability).',
        'Approximate Retail Value ("ARV"): $399 USD per prize. Total ARV of all prizes across the twelve (12) potential monthly drawings during the Promotion Period: $4,788 USD. ARV is based on the manufacturer\'s suggested retail price at the time these Official Rules were drafted and excludes any applicable federal, state, and local sales/use taxes, shipping, delivery, or activation charges, all of which are the responsibility of the winner. Fewer than twelve (12) prizes may be awarded; specifically, the iPad prize allocated to any monthly entry period that does not satisfy the two-entry minimum described in Section 8 will be forfeited and will not be awarded (only the eligible entries from such period roll forward; the prize does not). Additional prizes may be unawarded if drawings are not held for other reasons permitted by these Official Rules.',
        'Prize is awarded "as is" with no warranty beyond manufacturer warranty (if any). No cash alternative, substitution, or transfer except at Sponsor\'s sole discretion due to unavailability, in which case a prize of equal or greater ARV may be awarded.',
        'Prize award limit. A maximum of one (1) prize will be awarded per person and per Instagram account during the entire Promotion Period (May 27, 2026 through June 1, 2027). If an individual or Instagram account that has previously been awarded a prize during the Promotion Period is selected in any subsequent monthly drawing, that subsequent selection will be disregarded and an alternate winner will be selected from the same drawing pool in accordance with these Official Rules. Continued submission of entries by a previously-awarded entrant is permitted (for example, for Hall of Fame consideration), but such entries are not eligible to win an additional prize.',
      ],
    },
    {
      id: 'winner-notification',
      title: '10. Winner Notification, Verification & Forfeiture',
      paragraphs: [
        'Potential winners will be notified by email and/or phone using the contact information provided at entry within approximately seven (7) business days after the drawing. Before confirming a winner, Sponsor will verify, among other things, that the potential winner (a) satisfies all eligibility requirements in Section 3, (b) complies with the entry limits and Instagram requirements in Section 4, and (c) has not previously been awarded a prize during the Promotion Period (as restricted by Section 9). If verification fails for any reason, the selection will be disregarded and an alternate winner will be selected from the same drawing pool.',
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
        'Except where prohibited by law, acceptance of a prize constitutes permission for Sponsor to use winner\'s name, city, state, or Eligible U.S. jurisdiction, likeness, and story excerpts for advertising and promotional purposes without additional compensation, unless restricted by law.',
        'For Hall of Fame or marketing features outside of winner announcements, Sponsor will obtain appropriate consent before publishing identifying details as described in Section 7.',
      ],
    },
    {
      id: 'general-conditions',
      title: '13. General Conditions & Limitations of Liability',
      paragraphs: [
        'Sponsor may cancel, suspend, or modify the Promotion if fraud, technical failures, or any factor beyond Sponsor\'s reasonable control impairs the integrity of the Promotion, and may otherwise exercise its Early Termination right as described in Section 2, in each case subject to applicable law. Any monthly entry period that has already satisfied the two (2)-eligible-entry minimum as of the date Sponsor announces such cancellation, suspension, modification, or Early Termination will still be completed (drawing held and prize awarded) in accordance with these Official Rules.',
        'By participating, you release Sponsor and its affiliates, suppliers, and agencies from any and all liability for claims arising from or in any way related to participation in the Promotion, acceptance, use, or misuse of a prize, or publication of submitted content, INCLUDING WITHOUT LIMITATION ANY CLAIMS BASED ON NEGLIGENCE, except where such a release is prohibited by applicable law.',
        'Individual results from AC Drain Wiz products vary. AC Drain Wiz supports proactive drain maintenance and helps reduce risk; it is not a substitute for code-required devices in jurisdictions that mandate them.',
      ],
    },
    {
      id: 'privacy',
      title: '14. Privacy',
      paragraphs: [
        'Information collected in connection with the Promotion is used solely to administer the Promotion, review submissions, verify Instagram follow status, and notify potential winners. Sponsor will not use entrants\' email addresses or telephone numbers to send marketing, promotional, newsletter, SMS, or other non-Promotion communications unless the entrant has given separate, express opt-in consent (for example, by checking an optional marketing opt-in box at submission or by separately subscribing). Sponsor will not sell your personal information. For additional information about how Sponsor handles personal data, see the AC Drain Wiz Privacy Policy at acdrainwiz.com/privacy-policy.',
      ],
    },
    {
      id: 'disputes',
      title: '15. Disputes & Governing Law',
      paragraphs: [
        'Except where prohibited by applicable sweepstakes or consumer protection law, disputes arising from or relating to this Promotion shall be resolved through binding arbitration on an individual basis administered by the American Arbitration Association ("AAA") under its Commercial Arbitration Rules then in effect, with the seat of arbitration in the State of Florida, consistent with the AC Drain Wiz Site Terms of Use. This arbitration agreement is governed by the Federal Arbitration Act ("FAA"), 9 U.S.C. §§ 1 et seq., and evidences a transaction involving interstate commerce. You waive any right to participate in a class, collective, or representative action.',
        'Arbitration opt-out. You may opt out of this arbitration agreement by sending written notice of your decision to opt out to the Sponsor at the address in Section 1 within thirty (30) days of the date you first submitted an entry to the Promotion. The notice must include your full name, mailing address, email address, Instagram handle, and a clear statement that you wish to opt out of arbitration of disputes relating to the Promotion. Opting out will not affect your eligibility to participate in the Promotion or any other rights under these Official Rules.',
        'Where arbitration is not permitted (or where an entrant has timely opted out under the preceding paragraph), these Official Rules are governed by the laws of the State of Florida, without regard to conflict-of-law rules. Any disputes not subject to arbitration shall be brought exclusively in the state or federal courts located in Florida.',
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
