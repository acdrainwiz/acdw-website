import { PRODUCT_NAMES } from './acdwKnowledge'

/** GHL Contact Type options — must match validate-form-submission.js exactly (case-sensitive). */
export const COMPLIMENTARY_MINI_CONTACT_TYPE_OPTIONS = [
  'Building Inspector,',
  'Mechanical Inspector',
  'Plans Examiner',
  'Code Official',
  'Fire/Building Dept.',
  'Property Maintenance Official',
  'Other',
] as const

export const COMPLIMENTARY_MINI_REQUEST = {
  route: '/complimentary-mini',
  confirmedRoute: '/complimentary-mini/confirmed',
  formName: 'complimentary-mini-request',
  formType: 'complimentary-mini-request',
  recaptchaAction: 'complimentary_mini_request',
  pageTitle: 'Complimentary AC Drain Wiz Mini | AC Drain Wiz',
  hero: {
    title: 'Complimentary AC Drain Wiz Mini',
    subtitle:
      'Thank you for connecting with us at a conference or industry event. Confirm your mailing address below and we’ll ship your complimentary AC Drain Wiz Mini—permanent drain line access for faster, cleaner maintenance.',
    badges: ['Conference & Event Attendees', 'Complimentary Mini', 'Mailing Address'],
    productImage: {
      src: '/images/acdw-mini-hero2-product.png',
      srcMobile: '/images/acdw-mini-hero2-product-mobile.png',
      alt: 'AC Drain Wiz Mini transparent T-manifold with bi-directional service valve',
    },
    productRibbon: 'Complimentary',
    productNote: 'Included at no charge — shipped to your door',
  },
  form: {
    title: 'Confirm Your Mailing Address',
    description:
      'Please verify your contact and shipping details. Required fields are marked with *.',
    submitLabel: 'Confirm My Mailing Address',
    shareReminder:
      'This invitation is for you only. Please don’t forward this link or share it with others.',
    successPageTitle: 'Submission received | AC Drain Wiz',
    successTitle: 'You’re all set',
    successLead:
      'We received your shipping details for your complimentary AC Drain Wiz Mini.',
    successBody:
      'This offer is personal to contacts we met at an event and is tied to the email address you entered. Please don’t share this link—additional submissions may not qualify for fulfillment.',
    successNextSteps:
      'We’ll verify your invitation and email you with next steps. Allow a few business days for review and shipping coordination.',
    successPrimaryCta: 'Visit AC Drain Wiz',
    successPrimaryHref: '/',
    successSecondaryCta: 'Learn about the Mini',
    successSecondaryHref: '/products/mini',
  },
  confirmedStale: {
    pageTitle: 'Submission status | AC Drain Wiz',
    title: 'Nothing to do here',
    message:
      'This page is shown after a completed mailing-address submission. If you already submitted the form, check your email for next steps. This link does not provide access to the offer.',
    contactLabel: 'Contact AC Drain Wiz',
    contactHref: '/contact',
  },
  /** GHL campaign-form wording — scoped to Mini shipment, not general contact inquiries. */
  smsProgramDisclosure: {
    lead:
      'If you opt in below, text messages from AC Drain Wiz relate to your complimentary Mini shipment—delivery updates, address verification, and fulfillment coordination.',
    footer:
      'Message frequency varies. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.',
  },
  smsTransactional:
    'By checking this box, I consent to receive non-marketing text messages from AC Drain Wiz about my complimentary Mini shipment, order updates, and related fulfillment coordination. Message frequency varies. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.',
  smsTransactionalOptional: 'Optional. Shipment and fulfillment updates only.',
  smsMarketing:
    'By checking this box, I consent to receive marketing and promotional messages—including special offers, discounts, and new product updates—from AC Drain Wiz at the phone number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.',
  smsMarketingOptional: 'Optional — promotional texts only.',
  productName: PRODUCT_NAMES.mini,
  accessGate: {
    queryParam: 'access',
    deniedPageTitle: 'Page not available | AC Drain Wiz',
    deniedTitle: 'This link is not valid',
    deniedMessage:
      'This page is available only through a direct invitation link from AC Drain Wiz. If you met our team at an event and believe this is an error, please contact us.',
    contactLabel: 'Contact AC Drain Wiz',
    contactHref: '/contact',
  },
} as const
