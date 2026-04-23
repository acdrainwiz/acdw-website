// GHL form mappings. After creating custom fields in GHL UI, run
// /.netlify/functions/ghl-field-discovery and paste IDs into customFieldIds below.

const customFieldIds = {
  referral_source: 'AkB8KPSsP1O7OiP9Z9ng',
  sms_transactional_consent: 'Q9Rc13AlfqEUTTcu2qxI',
  sms_marketing_consent: 'qqVis84MXtdQJJyxDtYy',

  product: 'HefKgAN3Bu7jsPC5ogo1',
  issue_type: 'JvJQhKLJpp7KzkSDjHct',

  role: 'dBHn7sjofi6xd2wjWmzt',
  annual_volume: 'WjhjBvePkaH6UB2oVa8D',
  interest: '3htYTBaSXGnnZaVUp6oU',

  location: 'kPeplx04fEdPXg0CXJ6R',
  product_to_install: 'f1C9zjdDIrAppgAFgrLZ',
  preferred_contact: 'IZKVwVY8ekH3dS7fvWnz',

  demo_type: 'rWQdwlB1Wpo8fU43Uveo',
  preferred_date: '8oXPUTIFLUhYBhjXQCil',
  preferred_time: 'uNMoRYOC4YQHSvjolfoV',
  number_of_attendees: 'k8OerAmm3MwM3QQtsPBW',
  products_of_interest: 'ppB3opnq2jaqDFUD0gqR',
  portfolio_size: 'wl3LKXKtOFhMOiXgF4dy',

  upgrade_photo_url: 'zSydZDTQmgS2OllRKeDr',

  unsubscribe_reason: 'TQyRoFTSAyBrI27EIatx',

  email_pref_product_updates: 'ElhRgC1lGHcbk26Bahmj',
  email_pref_promotions: 'W2XzWoneO3N1ez5T20wP',
  email_pref_newsletter: 'TtlNO0j7868pcbnsUSYW',
  email_pref_order_updates: 'PfXJOHoCccoEtrN2HoKG',
  email_pref_support: 'jzFSRD4dFpbe6OqIoAg9',
}

// Field types: text | large_text | numeric | multiselect
// (All enumerated/boolean values stored as "text" — values like "yes"/"no"/"high" land verbatim
//  without requiring GHL dropdown options to match form values.)
const customFieldTypes = {
  referral_source: 'text',
  sms_transactional_consent: 'text',
  sms_marketing_consent: 'text',

  product: 'text',
  issue_type: 'text',

  role: 'text',
  annual_volume: 'text',
  interest: 'text',

  location: 'text',
  product_to_install: 'text',
  preferred_contact: 'text',

  demo_type: 'text',
  preferred_date: 'text',
  preferred_time: 'text',
  number_of_attendees: 'numeric',
  products_of_interest: 'text',
  portfolio_size: 'text',

  upgrade_photo_url: 'text',

  unsubscribe_reason: 'text',

  email_pref_product_updates: 'text',
  email_pref_promotions: 'text',
  email_pref_newsletter: 'text',
  email_pref_order_updates: 'text',
  email_pref_support: 'text',
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

// writeMessageAsNote: when sanitizedData[noteSourceKey] is present, post as a Note.
// noteSourceKey defaults to 'message'.
// noteAppendFields: [{ label, formKey }] — extra form fields to append to the Note body.
// conditionalTags: [{ tag, when, equals }] — add `tag` when sanitizedData[when] === equals.
// valueTags: [{ formKey, map }] — add tag(s) based on form-value lookup in map.
// combineIntoAddress1: ['street', 'unit'] — concatenate these form fields into address1.

const CUSTOMER_TYPE_TAGS = {
  'homeowner': 'homeowner',
  'hvac-contractor': 'hvac contractor',
  'property-manager': 'property manager',
  'city-official': 'city official',
  // 'other' → no tag
}

const formConfigs = {
  'contact-general': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName],
    customFields: [
      ['referral_source', 'referralSource'],
      ['sms_transactional_consent', 'smsTransactional'],
      ['sms_marketing_consent', 'smsMarketing'],
    ],
    sourceTags: ['follow-up'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-general',
    writeMessageAsNote: true,
  },

  'contact-support': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName],
    customFields: [
      ['product', 'product'],
      ['issue_type', 'issueType'],
      ['sms_transactional_consent', 'smsTransactional'],
    ],
    sourceTags: ['follow-up'],
    conditionalTags: [
      { tag: 'high priority', when: 'priority', equals: 'high' },
    ],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-support',
    writeMessageAsNote: true,
  },

  'contact-sales': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName],
    customFields: [
      ['referral_source', 'referralSource'],
      ['role', 'role'],
      ['annual_volume', 'annualVolume'],
      ['interest', 'interest'],
      ['sms_transactional_consent', 'smsTransactional'],
    ],
    sourceTags: ['warm lead'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-sales',
    writeMessageAsNote: true,
  },

  'contact-installer': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone],
    customFields: [
      ['location', 'location'],
      ['product_to_install', 'productToInstall'],
      ['preferred_contact', 'preferredContact'],
      ['sms_transactional_consent', 'smsTransactional'],
    ],
    sourceTags: ['contractor'],
    sourceAttribution: 'acdrainwiz.com: contact-installer',
    writeMessageAsNote: true,
  },

  'contact-demo': {
    standardFields: [
      STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName,
      STD.city, STD.state, STD.postalCode,
    ],
    customFields: [
      ['referral_source', 'referralSource'],
      ['demo_type', 'demoType'],
      ['preferred_date', 'preferredDate'],
      ['preferred_time', 'preferredTime'],
      ['number_of_attendees', 'numberOfAttendees'],
      ['products_of_interest', 'productsOfInterest'],
      ['portfolio_size', 'portfolioSize'],
      ['sms_transactional_consent', 'smsTransactional'],
    ],
    sourceTags: ['demo requested'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-demo',
    writeMessageAsNote: true,
    noteAppendFields: [
      { label: 'Demo Focus', formKey: 'demoFocus' },
    ],
  },

  'core-upgrade': {
    standardFields: [
      STD.firstName, STD.lastName, STD.email, STD.phone,
      STD.city, STD.state, STD.postalCode,
    ],
    combineIntoAddress1: ['street', 'unit'],
    customFields: [
      ['upgrade_photo_url', 'photoUrl'],
      ['sms_transactional_consent', 'smsTransactional'],
      ['sms_marketing_consent', 'smsMarketing'],
    ],
    sourceTags: ['follow-up'],
    sourceAttribution: 'acdrainwiz.com: core-upgrade',
  },

  'unsubscribe': {
    standardFields: [STD.email],
    customFields: [
      ['unsubscribe_reason', 'reason'],
    ],
    sourceTags: [],
    sourceAttribution: 'acdrainwiz.com: unsubscribe',
    setEmailDnd: true,
    writeMessageAsNote: true,
    noteSourceKey: 'feedback',
  },

  'email-preferences': {
    standardFields: [STD.email],
    customFields: [
      ['email_pref_product_updates', 'productUpdates'],
      ['email_pref_promotions', 'promotions'],
      ['email_pref_newsletter', 'newsletter'],
      ['email_pref_order_updates', 'orderUpdates'],
      ['email_pref_support', 'supportEmails'],
    ],
    sourceTags: [],
    sourceAttribution: 'acdrainwiz.com: email-preferences',
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
