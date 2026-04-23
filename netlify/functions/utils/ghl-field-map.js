// GHL form mappings. After creating custom fields in GHL UI, run
// /.netlify/functions/ghl-field-discovery and paste IDs into customFieldIds below.

const customFieldIds = {
  customer_type: '',
  sms_transactional_consent: '',
  sms_marketing_consent: '',

  product: '',
  issue_type: '',

  role: '',
  annual_volume: '',
  interest: '',

  location: '',
  product_to_install: '',
  preferred_contact: '',

  demo_type: '',
  preferred_date: '',
  preferred_time: '',
  number_of_attendees: '',
  products_of_interest: '',
  portfolio_size: '',
  demo_focus: '',

  upgrade_photo_url: '',

  unsubscribe_reason: '',
}

// Field types: text | large_text | single_select | radio | numeric | checkbox | multiselect | date
const customFieldTypes = {
  customer_type: 'text',
  sms_transactional_consent: 'checkbox',
  sms_marketing_consent: 'checkbox',

  product: 'single_select',
  issue_type: 'single_select',

  role: 'text',
  annual_volume: 'text',
  interest: 'text',

  location: 'text',
  product_to_install: 'text',
  preferred_contact: 'text',

  demo_type: 'single_select',
  preferred_date: 'text',
  preferred_time: 'text',
  number_of_attendees: 'numeric',
  products_of_interest: 'multiselect',
  portfolio_size: 'text',
  demo_focus: 'large_text',

  upgrade_photo_url: 'text',

  unsubscribe_reason: 'single_select',
}

// [ghlBodyKey, formFieldKey] pairs — standard GHL contact fields.
const STD = {
  firstName:  ['firstName',  'firstName'],
  lastName:   ['lastName',   'lastName'],
  email:      ['email',      'email'],
  phone:      ['phone',      'phone'],
  companyName:['companyName','company'],
  address1:   ['address1',   'street'],
  city:       ['city',       'city'],
  state:      ['state',      'state'],
  postalCode: ['postalCode', 'zip'],
}

// writeMessageAsNote: when sanitizedData.message exists, post as a Note on the contact
// conditionalTags: [{ tag, when, equals }] — add `tag` when sanitizedData[when] === equals
const formConfigs = {
  'contact-general': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName],
    customFields: [
      ['customer_type', 'customerType'],
      ['sms_transactional_consent', 'smsTransactional'],
      ['sms_marketing_consent', 'smsMarketing'],
    ],
    sourceTags: ['source:contact-general', 'follow-up'],
    sourceAttribution: 'acdrainwiz.com: contact-general',
    writeMessageAsNote: true,
  },

  'contact-support': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone],
    customFields: [
      ['customer_type', 'customerType'],
      ['product', 'product'],
      ['issue_type', 'issueType'],
    ],
    sourceTags: ['source:contact-support', 'follow-up'],
    conditionalTags: [
      { tag: 'high priority', when: 'priority', equals: 'high' },
    ],
    sourceAttribution: 'acdrainwiz.com: contact-support',
    writeMessageAsNote: true,
  },

  'contact-sales': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName],
    customFields: [
      ['role', 'role'],
      ['annual_volume', 'annualVolume'],
      ['interest', 'interest'],
    ],
    sourceTags: ['source:contact-sales', 'warm lead'],
    sourceAttribution: 'acdrainwiz.com: contact-sales',
    writeMessageAsNote: true,
  },

  'contact-installer': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone],
    customFields: [
      ['location', 'location'],
      ['product_to_install', 'productToInstall'],
      ['preferred_contact', 'preferredContact'],
    ],
    sourceTags: ['source:contact-installer', 'contractor'],
    sourceAttribution: 'acdrainwiz.com: contact-installer',
    writeMessageAsNote: true,
  },

  'contact-demo': {
    standardFields: [
      STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName,
      STD.city, STD.state, STD.postalCode,
    ],
    customFields: [
      ['demo_type', 'demoType'],
      ['preferred_date', 'preferredDate'],
      ['preferred_time', 'preferredTime'],
      ['number_of_attendees', 'numberOfAttendees'],
      ['products_of_interest', 'productsOfInterest'],
      ['portfolio_size', 'portfolioSize'],
      ['demo_focus', 'demoFocus'],
    ],
    sourceTags: ['source:contact-demo', 'demo requested'],
    sourceAttribution: 'acdrainwiz.com: contact-demo',
    writeMessageAsNote: true,
  },

  'hero-email': {
    standardFields: [STD.email],
    customFields: [],
    sourceTags: ['source:hero-email', 'pref:newsletter'],
    sourceAttribution: 'acdrainwiz.com: hero-email',
  },

  'promo-signup': {
    standardFields: [STD.email],
    customFields: [],
    sourceTags: ['source:promo', 'pref:promotions'],
    sourceAttribution: 'acdrainwiz.com: promo-signup',
  },

  'core-upgrade': {
    standardFields: [
      STD.firstName, STD.lastName, STD.email, STD.phone,
      STD.address1, STD.city, STD.state, STD.postalCode,
    ],
    customFields: [
      ['upgrade_photo_url', 'photoUrl'],
      ['sms_transactional_consent', 'smsTransactional'],
    ],
    sourceTags: ['source:core-upgrade', 'follow-up'],
    sourceAttribution: 'acdrainwiz.com: core-upgrade',
  },

  'unsubscribe': {
    standardFields: [STD.email],
    customFields: [
      ['unsubscribe_reason', 'reason'],
    ],
    sourceTags: ['opted-out:all'],
    sourceAttribution: 'acdrainwiz.com: unsubscribe',
    setEmailDnd: true,
  },

  'email-preferences': {
    standardFields: [STD.email],
    customFields: [],
    sourceTags: [],
    sourceAttribution: 'acdrainwiz.com: email-preferences',
    dynamicPrefTags: true,
  },
}

function getFormConfig(formType) {
  return formConfigs[formType] || null
}

function getCustomFieldId(fieldKey) {
  return customFieldIds[fieldKey] || ''
}

function getCustomFieldType(fieldKey) {
  return customFieldTypes[fieldKey] || 'text'
}

function isConfigured() {
  return Object.values(customFieldIds).every((id) => id && id.length > 0)
}

module.exports = {
  customFieldIds,
  customFieldTypes,
  formConfigs,
  getFormConfig,
  getCustomFieldId,
  getCustomFieldType,
  isConfigured,
}
