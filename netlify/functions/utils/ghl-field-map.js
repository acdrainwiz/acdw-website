// GHL form mappings. After creating custom fields in GHL UI, run
// /.netlify/functions/ghl-field-discovery and paste IDs into customFieldIds below.

const customFieldIds = {
  referral_source: 'Psv6fT4lnwOk3IVwtnbB',
  sms_transactional_consent: 'rOtHmtB27vfSGBuDJujK',
  sms_marketing_consent: '98bqq9VgEUl2LuUDBHyz',
  sms_consent_timestamp: '3e6uSCw2iGf5ykGtohu6',
  sms_consent_source_url: '7FPCWnLYYCKE17WMdHuw',
  sms_consent_ip: 'gMD5M9W6AkC9Ux6t4kue',

  product: '8um1Z810bI4Iyu8vWXst',
  issue_type: 'uQbnZ6UjbCtEhQU0sHhP',

  role: 'hHDD3HvWpUVTsJN7Ya52',
  annual_volume: 'lM54anvfT2kvp9m8G8w1',
  interest: 'fSyljUNZJtwJ0I0HdBB3',

  location: 'WJza3UCnygdHLFV504HP',
  product_to_install: 'FjFBuE7eERmqU98p0PLW',
  preferred_contact: 'J2x4bB54juiTKZe7g1Tw',

  demo_type: 'QdaAcLKl6iHOv3mf0LJ1',
  preferred_date: 'oY7RSTUSLxOFoROaLZPz',
  preferred_time: 'JyNlEpnSuiS01YWAhjoi',
  number_of_attendees: '7Vew3iuHntZCHiNuJImK',
  products_of_interest: 'rgr35ytJoapGudPyHoq1',
  portfolio_size: 'RS7ErBmzdb4g355mPi2F',

  upgrade_photo_url: '7iSBKTD3rkJzKxcKFO1S',

  // Trash the Float campaign — TTF custom fields live on the Opportunity object now,
  // and their IDs are auto-resolved at runtime via ensureOpportunityFieldIds() (like
  // the municipal-intake fields). No paste-in step needed here.

  unsubscribe_reason: 'TQyRoFTSAyBrI27EIatx',

  email_pref_product_updates: 'Va7SJQVFbvTkOVDZ52IS',
  email_pref_promotions: '6NB4WSJGU6j1JzknrH1j',
  email_pref_newsletter: 'txn3JL4fAs18ExAeD1kp',
  email_pref_order_updates: 'zrQJmC3WVoWXrO84SPA7',
  email_pref_support: 'BMSViGCwpKVEPm7ko8xx',

  // Note: Municipal Opportunity custom field IDs are NOT listed here.
  // They are auto-resolved at runtime from GHL via `ensureOpportunityFieldIds()`
  // in ghl-client.js (cached 1h). Field-key-to-type mapping below stays static.
}

// Field types: text | large_text | numeric | multiselect
// (All enumerated/boolean values stored as "text" — values like "yes"/"no"/"high" land verbatim
//  without requiring GHL dropdown options to match form values.)
const customFieldTypes = {
  referral_source: 'text',
  sms_transactional_consent: 'text',
  sms_marketing_consent: 'text',
  sms_consent_timestamp: 'text',
  sms_consent_source_url: 'text',
  sms_consent_ip: 'text',

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

  ttf_audience: 'text',
  ttf_story_body: 'large_text',
  ttf_damage_impact: 'large_text',
  ttf_media_url: 'text',
  ttf_city_state: 'text',
  ttf_instagram_handle: 'text',

  unsubscribe_reason: 'text',

  email_pref_product_updates: 'text',
  email_pref_promotions: 'text',
  email_pref_newsletter: 'text',
  email_pref_order_updates: 'text',
  email_pref_support: 'text',

  // Auto-resolved at runtime via ensureContactFieldIds() — no static ID required.
  contact_type: 'text',

  // Municipal intake (Opportunity object) — keyed by short key (without "opportunity." prefix).
  // IDs auto-resolved at runtime; types are still static (form-data shaping).
  // NOTE: GHL slugifies "/" as DOUBLE underscore, so several keys below have `__`
  // (e.g. parish__county, primary_contact_title__role). Don't "fix" these — they must
  // match the fieldKeys GHL returns, or ID resolution silently drops the value.
  municipality_name: 'text',
  parish__county: 'text',
  state: 'text',
  population_size: 'numeric',
  primary_contact_title__role: 'text',
  secondary_contact_full_name: 'text',
  secondary_contact_title__role: 'text',
  secondary_contact_email: 'text',
  secondary_contact_phone: 'text',
  number_of_facilities__buildings: 'numeric',
  types_of_facilities: 'multiselect',
  existing_drain__overflow_monitoring_systems: 'text',
  attended_boaf_or_coaa_event: 'text',
  interested_in_special_offer: 'text',
  estimated_number_of_units_needed: 'numeric',
  preferred_installation_timeline: 'text',
  agrees_to_purchase_wifi_sensor_switch: 'text',
  eligible_for_free_monitoring: 'text',
  notes__special_requirements: 'text',
  municipal_program_status: 'text',
  number_of_units_installed: 'numeric',
  monitoring_activated: 'text',
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
      ['sms_consent_timestamp', 'smsConsentTimestamp'],
      ['sms_consent_source_url', 'smsConsentSourceUrl'],
      ['sms_consent_ip', 'smsConsentIp'],
    ],
    sourceTags: ['follow-up'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-general',
    writeMessageAsNote: true,
    opportunityPipelineEnvVar: 'GHL_WEBSITE_PIPELINE_ID',
    opportunityStageEnvVar: 'GHL_WEBSITE_PIPELINE_STAGE_ID',
    opportunityNameTemplate: 'General Inquiry: {firstName} {lastName}',
  },

  'contact-support': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName],
    customFields: [
      ['product', 'product'],
      ['issue_type', 'issueType'],
      ['sms_transactional_consent', 'smsTransactional'],
      ['sms_consent_timestamp', 'smsConsentTimestamp'],
      ['sms_consent_source_url', 'smsConsentSourceUrl'],
      ['sms_consent_ip', 'smsConsentIp'],
    ],
    sourceTags: ['follow-up'],
    conditionalTags: [
      { tag: 'high priority', when: 'priority', equals: 'high' },
    ],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-support',
    writeMessageAsNote: true,
    opportunityPipelineEnvVar: 'GHL_SUPPORT_PIPELINE_ID',
    opportunityStageEnvVar: 'GHL_SUPPORT_PIPELINE_STAGE_ID',
    opportunityNameTemplate: 'Support Request: {firstName} {lastName}',
  },

  'contact-sales': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName],
    customFields: [
      ['referral_source', 'referralSource'],
      ['role', 'role'],
      ['annual_volume', 'annualVolume'],
      ['interest', 'interest'],
      ['sms_transactional_consent', 'smsTransactional'],
      ['sms_consent_timestamp', 'smsConsentTimestamp'],
      ['sms_consent_source_url', 'smsConsentSourceUrl'],
      ['sms_consent_ip', 'smsConsentIp'],
    ],
    sourceTags: ['warm lead'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-sales',
    writeMessageAsNote: true,
    opportunityPipelineEnvVar: 'GHL_WEBSITE_PIPELINE_ID',
    opportunityStageEnvVar: 'GHL_WEBSITE_PIPELINE_STAGE_ID',
    opportunityNameTemplate: 'Sales Inquiry: {firstName} {lastName}',
  },

  'contact-installer': {
    standardFields: [STD.firstName, STD.lastName, STD.email, STD.phone],
    customFields: [
      ['location', 'location'],
      ['product_to_install', 'productToInstall'],
      ['preferred_contact', 'preferredContact'],
      ['sms_transactional_consent', 'smsTransactional'],
      ['sms_consent_timestamp', 'smsConsentTimestamp'],
      ['sms_consent_source_url', 'smsConsentSourceUrl'],
      ['sms_consent_ip', 'smsConsentIp'],
    ],
    sourceTags: ['contractor'],
    sourceAttribution: 'acdrainwiz.com: contact-installer',
    writeMessageAsNote: true,
    opportunityPipelineEnvVar: 'GHL_WEBSITE_PIPELINE_ID',
    opportunityStageEnvVar: 'GHL_WEBSITE_PIPELINE_STAGE_ID',
    opportunityNameTemplate: 'Installer Signup: {firstName} {lastName}',
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
      ['sms_consent_timestamp', 'smsConsentTimestamp'],
      ['sms_consent_source_url', 'smsConsentSourceUrl'],
      ['sms_consent_ip', 'smsConsentIp'],
    ],
    sourceTags: ['demo requested'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-demo',
    writeMessageAsNote: true,
    noteAppendFields: [
      { label: 'Demo Focus', formKey: 'demoFocus' },
    ],
    opportunityPipelineEnvVar: 'GHL_WEBSITE_PIPELINE_ID',
    opportunityStageEnvVar: 'GHL_WEBSITE_PIPELINE_STAGE_ID',
    opportunityNameTemplate: 'Demo Request: {firstName} {lastName}',
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
      ['sms_consent_timestamp', 'smsConsentTimestamp'],
      ['sms_consent_source_url', 'smsConsentSourceUrl'],
      ['sms_consent_ip', 'smsConsentIp'],
    ],
    sourceTags: ['follow-up'],
    sourceAttribution: 'acdrainwiz.com: core-upgrade',
    opportunityPipelineEnvVar: 'GHL_WEBSITE_PIPELINE_ID',
    opportunityStageEnvVar: 'GHL_WEBSITE_PIPELINE_STAGE_ID',
    opportunityNameTemplate: 'Core 1.0 Upgrade: {firstName} {lastName}',
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

  // RETIRED — this form is disabled in validate-form-submission.js (submissions are
  // rejected as an unknown form name) and its page is unrouted in src/App.tsx. The
  // GHL_MUNI_PIPELINE_ID / GHL_MUNI_PIPELINE_STAGE_ID env vars have been REASSIGNED to the
  // complimentary-mini-request form below. Config kept for reference / quick re-enable.
  //
  // Municipal intake — targets the Opportunity object.
  // Flow: upsert Contact (name/email/phone) → create Opportunity in pipeline → tag Contact.
  // If GHL_MUNI_PIPELINE_ID is missing, falls back to dumping all 22 fields into a Contact Note.
  'municipal-intake': {
    target: 'opportunity',
    pipelineIdEnvVar: 'GHL_MUNI_PIPELINE_ID',
    pipelineStageIdEnvVar: 'GHL_MUNI_PIPELINE_STAGE_ID',
    opportunityNameTemplate: '{municipalityName} — Municipal Intake',
    // Contact-side: standard fields for the linked Contact + sms_transactional_consent custom field.
    contactStandardFields: [STD.firstName, STD.lastName, STD.email, STD.phone],
    contactCustomFields: [
      ['sms_transactional_consent', 'smsTransactional'],
      ['sms_consent_timestamp', 'smsConsentTimestamp'],
      ['sms_consent_source_url', 'smsConsentSourceUrl'],
      ['sms_consent_ip', 'smsConsentIp'],
    ],
    // Opportunity-side custom fields (form key on the right, GHL custom field key on the left).
    opportunityCustomFields: [
      ['municipality_name', 'municipalityName'],
      ['parish__county', 'parishCounty'],
      ['state', 'state'],
      ['population_size', 'populationSize'],
      ['primary_contact_title__role', 'role'],
      ['secondary_contact_full_name', 'secondaryName'],
      ['secondary_contact_title__role', 'secondaryTitle'],
      ['secondary_contact_email', 'secondaryEmail'],
      ['secondary_contact_phone', 'secondaryPhone'],
      ['number_of_facilities__buildings', 'numberOfFacilities'],
      ['types_of_facilities', 'facilityTypes'],
      ['existing_drain__overflow_monitoring_systems', 'existingMonitoring'],
      ['attended_boaf_or_coaa_event', 'attendedEvent'],
      ['interested_in_special_offer', 'interestedInOffer'],
      ['estimated_number_of_units_needed', 'unitsNeeded'],
      ['preferred_installation_timeline', 'installationTimeline'],
      ['agrees_to_purchase_wifi_sensor_switch', 'agreesToPurchase'],
      ['eligible_for_free_monitoring', 'eligibleFreeMonitoring'],
      ['notes__special_requirements', 'message'],
      ['municipal_program_status', 'municipalProgramStatus'],
      ['number_of_units_installed', 'numberOfUnitsInstalled'],
      ['monitoring_activated', 'monitoringActivated'],
    ],
    sourceTags: ['municipal-intake', 'warm lead'],
    conditionalTags: [
      { tag: 'BOAFNCOAA-attendee', when: 'attendedEvent', equals: 'Yes' },
      { tag: 'agreed-to-purchase', when: 'agreesToPurchase', equals: 'Yes' },
      { tag: 'interested-in-offer', when: 'interestedInOffer', equals: 'Yes' },
    ],
    sourceAttribution: 'acdrainwiz.com: municipal-intake',
  },

  // Lightweight quick-intake form — only collects name/email/address.
  // Reuses the same Opportunity pipeline as 'municipal-intake' so submissions land
  // in the existing BOAA sales workflow.
  'municipal-quick-intake': {
    target: 'opportunity',
    pipelineIdEnvVar: 'GHL_QUICK_PIPELINE_ID',
    pipelineStageIdEnvVar: 'GHL_QUICK_PIPELINE_STAGE_ID',
    opportunityNameTemplate: '{firstName} {lastName} — Quick Intake',
    contactStandardFields: [
      STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName,
      STD.address1, STD.city, STD.state, STD.postalCode,
    ],
    contactCustomFields: [
      ['contact_type', 'contactType'],
    ],
    opportunityCustomFields: [],
    sourceTags: ['municipal-quick-intake', 'warm lead'],
    sourceAttribution: 'acdrainwiz.com: municipal-quick-intake',
  },

  // Complimentary Mini — mailing address confirmation after conference or event.
  // Lands in the complimentary Mini quick-intake pipeline via the documented GHL_QUICK_*
  // env vars. `dedupeOpportunityByContact` moves the contact's
  // existing open card in this pipeline to that stage on submit (advancing it from stage 0)
  // instead of creating a duplicate — and only ever advances, never drags a further-along
  // card backward. A new card is created only when the contact has none.
  'complimentary-mini-request': {
    target: 'opportunity',
    pipelineIdEnvVar: 'GHL_QUICK_PIPELINE_ID',
    pipelineStageIdEnvVar: 'GHL_QUICK_PIPELINE_STAGE_ID',
    dedupeOpportunityByContact: true,
    opportunityNameTemplate: '{firstName} {lastName} — Complimentary Mini',
    contactStandardFields: [
      STD.firstName, STD.lastName, STD.email, STD.phone, STD.companyName,
      STD.address1, STD.city, STD.state, STD.postalCode,
    ],
    contactCustomFields: [
      ['contact_type', 'contactType'],
      ['sms_transactional_consent', 'smsTransactional'],
      ['sms_marketing_consent', 'smsMarketing'],
      ['sms_consent_timestamp', 'smsConsentTimestamp'],
      ['sms_consent_source_url', 'smsConsentSourceUrl'],
      ['sms_consent_ip', 'smsConsentIp'],
    ],
    opportunityCustomFields: [],
    sourceTags: ['event-attendee', 'complimentary-mini', 'warm lead'],
    sourceAttribution: 'acdrainwiz.com: complimentary-mini-request',
    writeMessageAsNote: true,
    noteAppendFields: [
      { label: 'Event', formKey: 'eventName' },
    ],
  },

  // Trash the Float story submissions — Opportunity in the "Trash the Float Campaign"
  // pipeline. Contact gets upserted as the owner of the Opportunity. Submissions land
  // in the "Awaiting review" stage; moderation moves them through Accepted / Denied /
  // Posted to HoF in the GHL UI.
  'trash-the-float-story': {
    target: 'opportunity',
    pipelineIdEnvVar: 'GHL_TTF_PIPELINE_ID',
    pipelineStageIdEnvVar: 'GHL_TTF_PIPELINE_STAGE_ID',
    opportunityNameTemplate: '{firstName} {lastName}',
    contactStandardFields: [STD.firstName, STD.lastName, STD.email, STD.phone, STD.city],
    contactCustomFields: [],
    opportunityCustomFields: [
      ['ttf_audience', 'audience'],
      ['ttf_story_body', 'storyBody'],
      ['ttf_damage_impact', 'damageImpact'],
      ['ttf_media_url', 'mediaUrl'],
      ['ttf_city_state', 'cityState'],
      ['ttf_instagram_handle', 'instagramHandle'],
    ],
    sourceTags: ['trash-the-float', 'campaign-story'],
    sourceAttribution: 'acdrainwiz.com: trash-the-float-story',
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
