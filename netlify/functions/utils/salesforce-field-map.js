/**
 * Salesforce form mappings. Replaces ghl-field-map.js.
 * Ported from the Azure rebuild's api/src/lib/salesforce-field-map.ts — keep the two in sync.
 *
 * Unlike GHL, Salesforce addresses fields by API name, so there is no ID table and no runtime
 * ID resolution — the names below are the names in the org. The org metadata (custom fields,
 * picklist values, stages) lives in the rebuild repo under salesforce/force-app.
 *
 * Config shape:
 *   target: 'lead' | 'contact+case' | 'contact+opportunity' | 'update-by-email'
 *   fields / contactFields / caseFields / opportunityFields: [sfField, formKey] pairs
 *   sourceAttribution: written to Website_Source__c — the same strings GHL recorded, so
 *     reporting stays continuous across the cutover
 *   sourceTags / conditionalTags / valueTags: collapse into the Website_Tags__c multi-select
 *   descriptionSourceKey / descriptionAppendFields: the form's message — the form key it is
 *     read from (default 'message') and extra answers appended beneath it. It goes on the
 *     submission's Task, and on the Case or Opportunity the submission opens — never on the
 *     Lead or Contact, where the next submission would replace it.
 *   descriptionField (update-by-email only): the long-text field feedback is appended to
 *   combineIntoStreet: form keys concatenated into MailingStreet
 *   stageName: Opportunity.StageName — advance-only on a deduped resubmission
 *   attachFileFromKeys: sanitized-data keys holding a ContentDocumentId from
 *     salesforce-media, linked to the new Opportunity so the photo shows in its Files list
 */

// External ID field carrying the normalized email, on both Lead and Contact. This is what
// replaces GHL's native email dedupe on /contacts/upsert. Marked External ID + Unique.
const EXTERNAL_ID_FIELD = 'Website_Email__c'

// Multi-select picklist replacing GHL's separate tags endpoint. Written in the same call as
// the record, so tagging costs no extra API request. Unrestricted in the org.
const TAGS_FIELD = 'Website_Tags__c'

// Carries sourceAttribution — 'acdrainwiz.com: contact-demo' and the like. The standard
// LeadSource picklist is too coarse to say which form a record came from, and only exists on
// Lead; this keeps the per-form reporting GoHighLevel had, on all four objects.
const SOURCE_FIELD = 'Website_Source__c'

// Opportunity stages in the org's value-set order. That order is the sort order, and it is
// what makes an advance-only move meaningful.
const STAGE_ORDER = [
  'Qualification',
  'Needs Analysis',
  'Proposal',
  'Negotiation',
  'Sample Requested',
  'Sample Sent',
  'Sample Installed',
  'Awaiting Review',
  'Story Accepted',
  'Story Posted',
  'Story Denied',
  'Closed Won',
  'Closed Lost',
]

// True when moving from `current` to `next` is forward progress. A resubmitted form must never
// drag an already-mailed sample back to 'Sample Requested'. An unknown current stage is treated
// as not-an-advance: leaving a card where a human put it is the safer failure.
function stageIsAdvance(current, next) {
  const from = STAGE_ORDER.indexOf(current)
  const to = STAGE_ORDER.indexOf(next)
  if (from === -1 || to === -1) return false
  return to > from
}

// Drives value shaping only: text | textarea | number | multipicklist | checkbox | date.
// All enumerated values are stored as text so form values land verbatim without requiring the
// Salesforce picklist options to match exactly.
const fieldTypes = {
  SMS_Transactional_Consent__c: 'text',
  SMS_Marketing_Consent__c: 'text',
  SMS_Consent_Timestamp__c: 'text',
  SMS_Consent_Source_URL__c: 'text',
  SMS_Consent_IP__c: 'text',

  Referral_Source__c: 'text',
  Customer_Type__c: 'text',

  Product__c: 'text',

  Role__c: 'text',
  Annual_Volume__c: 'text',
  Interest__c: 'text',

  Install_Location__c: 'text',
  Product_To_Install__c: 'text',
  Preferred_Contact__c: 'text',

  Demo_Type__c: 'text',
  Preferred_Date__c: 'date',
  Preferred_Time__c: 'text',
  Number_Of_Attendees__c: 'text',
  Products_Of_Interest__c: 'multipicklist',
  Portfolio_Size__c: 'text',

  Upgrade_Photo_Id__c: 'text',

  Contact_Type__c: 'text',
  Event_Name__c: 'text',

  TTF_Audience__c: 'text',
  TTF_Story_Body__c: 'textarea',
  TTF_Damage_Impact__c: 'textarea',
  TTF_Media_Id__c: 'text',
  TTF_City_State__c: 'text',
  TTF_Instagram_Handle__c: 'text',

  Unsubscribe_Reason__c: 'text',
  Email_Pref_Product_Updates__c: 'text',
  Email_Pref_Promotions__c: 'text',
  Email_Pref_Newsletter__c: 'text',
  Email_Pref_Order_Updates__c: 'text',
  Email_Pref_Support__c: 'text',

  [TAGS_FIELD]: 'multipicklist',
  [EXTERNAL_ID_FIELD]: 'text',
  [SOURCE_FIELD]: 'text',
}

// Specific to this Netlify port. The rebuild caps every value at its schema layer; this site's
// validation doesn't, and a single over-length value makes Salesforce reject the whole write
// (STRING_TOO_LONG) — which would lose the submission. Values are truncated to these limits
// instead. Custom lengths come from the org metadata; standard ones are Salesforce's.
// Email is deliberately absent: a truncated address is worse than a rejected one, so the
// handler caps it at 80 during validation instead.
const fieldMaxLengths = {
  // Standard Lead / Contact
  FirstName: 40,
  LastName: 80,
  Phone: 40,
  Company: 255,
  Street: 255,
  City: 40,
  State: 80,
  PostalCode: 20,
  MailingStreet: 255,
  MailingCity: 40,
  MailingState: 80,
  MailingPostalCode: 20,

  // Custom
  SMS_Transactional_Consent__c: 10,
  SMS_Marketing_Consent__c: 10,
  SMS_Consent_Timestamp__c: 40,
  SMS_Consent_Source_URL__c: 255,
  SMS_Consent_IP__c: 45,
  Referral_Source__c: 60,
  Customer_Type__c: 60,
  Product__c: 40,
  Role__c: 60,
  Annual_Volume__c: 20,
  Interest__c: 60,
  Install_Location__c: 160,
  Product_To_Install__c: 40,
  Preferred_Contact__c: 20,
  Demo_Type__c: 40,
  Preferred_Time__c: 40,
  Number_Of_Attendees__c: 20,
  Portfolio_Size__c: 20,
  Upgrade_Photo_Id__c: 18,
  Contact_Type__c: 60,
  Event_Name__c: 120,
  TTF_Audience__c: 40,
  TTF_Story_Body__c: 5000,
  TTF_Damage_Impact__c: 1000,
  TTF_Media_Id__c: 18,
  TTF_City_State__c: 120,
  TTF_Instagram_Handle__c: 31,
  Unsubscribe_Reason__c: 40,
  Email_Pref_Product_Updates__c: 10,
  Email_Pref_Promotions__c: 10,
  Email_Pref_Newsletter__c: 10,
  Email_Pref_Order_Updates__c: 10,
  Email_Pref_Support__c: 10,
  [SOURCE_FIELD]: 80,
}

// Standard Lead fields.
const LEAD = {
  firstName: ['FirstName', 'firstName'],
  lastName: ['LastName', 'lastName'],
  email: ['Email', 'email'],
  phone: ['Phone', 'phone'],
  company: ['Company', 'company'],
  street: ['Street', 'street'],
  city: ['City', 'city'],
  state: ['State', 'state'],
  postalCode: ['PostalCode', 'zip'],
}

// Standard Contact fields. Note the Mailing* prefix — Contact addresses are not named the
// same as Lead addresses, and mixing them up fails as an unknown field.
const CONTACT = {
  firstName: ['FirstName', 'firstName'],
  lastName: ['LastName', 'lastName'],
  email: ['Email', 'email'],
  phone: ['Phone', 'phone'],
  street: ['MailingStreet', 'street'],
  city: ['MailingCity', 'city'],
  state: ['MailingState', 'state'],
  postalCode: ['MailingPostalCode', 'zip'],
}

// Consent metadata is identical across every form that collects it. Every form that shows
// the promotional-texts checkbox must map SMS_Marketing_Consent__c too: the handler stamps the
// consent timestamp and IP whenever either box is ticked, so dropping the flag would record
// proof of consent with no record of what was consented to.
const SMS_CONSENT_WITH_MARKETING = [
  ['SMS_Transactional_Consent__c', 'smsTransactional'],
  ['SMS_Marketing_Consent__c', 'smsMarketing'],
  ['SMS_Consent_Timestamp__c', 'smsConsentTimestamp'],
  ['SMS_Consent_Source_URL__c', 'smsConsentSourceUrl'],
  ['SMS_Consent_IP__c', 'smsConsentIp'],
]

const CUSTOMER_TYPE_TAGS = {
  'homeowner': 'homeowner',
  'hvac-contractor': 'hvac contractor',
  'property-manager': 'property manager',
  'city-official': 'city official',
  // 'other' → no tag
}

const formConfigs = {
  'contact-general': {
    target: 'lead',
    fields: [
      LEAD.firstName, LEAD.lastName, LEAD.email, LEAD.phone, LEAD.company,
      ['Referral_Source__c', 'referralSource'],
      ['Customer_Type__c', 'customerType'],
      ...SMS_CONSENT_WITH_MARKETING,
    ],
    sourceTags: ['follow-up'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-general',
  },

  // The only form that becomes a Case. priority and issueType map onto the native
  // Case.Priority and Case.Type picklists.
  'contact-support': {
    target: 'contact+case',
    contactFields: [
      CONTACT.firstName, CONTACT.lastName, CONTACT.email, CONTACT.phone,
      ['Customer_Type__c', 'customerType'],
      ...SMS_CONSENT_WITH_MARKETING,
    ],
    caseFields: [
      ['Product__c', 'product'],
      ['Type', 'issueType'],
      ['Priority', 'priority'],
    ],
    sourceTags: ['follow-up'],
    conditionalTags: [
      { tag: 'high priority', when: 'priority', equals: 'high' },
    ],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-support',
    // Contact has no Company field — that lives on Account, which these submissions don't
    // create. Appending it to the Case description keeps what the customer typed.
    descriptionAppendFields: [
      { label: 'Company', formKey: 'company' },
    ],
  },

  'contact-sales': {
    target: 'lead',
    fields: [
      LEAD.firstName, LEAD.lastName, LEAD.email, LEAD.phone, LEAD.company,
      ['Referral_Source__c', 'referralSource'],
      ['Customer_Type__c', 'customerType'],
      ['Role__c', 'role'],
      ['Annual_Volume__c', 'annualVolume'],
      ['Interest__c', 'interest'],
      ...SMS_CONSENT_WITH_MARKETING,
    ],
    sourceTags: ['warm lead'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-sales',
  },

  'contact-installer': {
    target: 'lead',
    fields: [
      LEAD.firstName, LEAD.lastName, LEAD.email, LEAD.phone,
      ['Install_Location__c', 'location'],
      ['Product_To_Install__c', 'productToInstall'],
      ['Preferred_Contact__c', 'preferredContact'],
      ...SMS_CONSENT_WITH_MARKETING,
    ],
    sourceTags: ['contractor'],
    sourceAttribution: 'acdrainwiz.com: contact-installer',
  },

  'contact-demo': {
    target: 'lead',
    fields: [
      LEAD.firstName, LEAD.lastName, LEAD.email, LEAD.phone, LEAD.company,
      LEAD.city, LEAD.state, LEAD.postalCode,
      ['Referral_Source__c', 'referralSource'],
      ['Customer_Type__c', 'customerType'],
      ['Demo_Type__c', 'demoType'],
      ['Preferred_Date__c', 'preferredDate'],
      ['Preferred_Time__c', 'preferredTime'],
      ['Number_Of_Attendees__c', 'numberOfAttendees'],
      ['Products_Of_Interest__c', 'productsOfInterest'],
      ['Portfolio_Size__c', 'portfolioSize'],
      ...SMS_CONSENT_WITH_MARKETING,
    ],
    sourceTags: ['demo requested'],
    valueTags: [{ formKey: 'customerType', map: CUSTOMER_TYPE_TAGS }],
    sourceAttribution: 'acdrainwiz.com: contact-demo',
    descriptionAppendFields: [
      { label: 'Demo Focus', formKey: 'demoFocus' },
    ],
  },

  // Existing Core 1.0 owners: a known customer with a review step, payment link and shipping,
  // so Contact + Opportunity rather than a Lead.
  'core-upgrade': {
    target: 'contact+opportunity',
    contactFields: [
      CONTACT.firstName, CONTACT.lastName, CONTACT.email, CONTACT.phone,
      CONTACT.city, CONTACT.state, CONTACT.postalCode,
      ...SMS_CONSENT_WITH_MARKETING,
    ],
    combineIntoStreet: ['street', 'unit'],
    opportunityFields: [
      ['Upgrade_Photo_Id__c', 'photoUrl'],
    ],
    stageName: 'Qualification',
    opportunityNameTemplate: 'Core 1.0 Upgrade: {firstName} {lastName}',
    attachFileFromKeys: ['photoUrl'],
    sourceTags: ['follow-up'],
    sourceAttribution: 'acdrainwiz.com: core-upgrade',
  },

  // Mailing address confirmation after a conference. dedupeOpportunityByContact advances the
  // contact's existing open Opportunity to this stage rather than creating a duplicate, and
  // only ever advances — a resubmission never drags an already-mailed sample backward.
  'complimentary-mini-request': {
    target: 'contact+opportunity',
    contactFields: [
      CONTACT.firstName, CONTACT.lastName, CONTACT.email, CONTACT.phone,
      CONTACT.city, CONTACT.state, CONTACT.postalCode,
      ['Contact_Type__c', 'contactType'],
      ...SMS_CONSENT_WITH_MARKETING,
    ],
    combineIntoStreet: ['street', 'unit'],
    opportunityFields: [
      ['Event_Name__c', 'eventName'],
    ],
    stageName: 'Sample Requested',
    dedupeOpportunityByContact: true,
    opportunityNameTemplate: '{firstName} {lastName} — Complimentary Mini',
    sourceTags: ['event-attendee', 'complimentary-mini', 'warm lead'],
    sourceAttribution: 'acdrainwiz.com: complimentary-mini-request',
    descriptionAppendFields: [
      { label: 'Event', formKey: 'eventName' },
      // This site's form collects an organization; Contact has no Company field, so keep it
      // in the description rather than dropping it (same approach as contact-support).
      { label: 'Company', formKey: 'company' },
    ],
  },

  // Campaign story submissions land in the Awaiting Review stage; moderation moves them
  // through Story Accepted / Story Denied / Story Posted in the Salesforce UI.
  'trash-the-float-story': {
    target: 'contact+opportunity',
    contactFields: [
      CONTACT.firstName, CONTACT.lastName, CONTACT.email, CONTACT.phone, CONTACT.city,
    ],
    opportunityFields: [
      ['TTF_Audience__c', 'audience'],
      ['TTF_Story_Body__c', 'storyBody'],
      ['TTF_Damage_Impact__c', 'damageImpact'],
      ['TTF_Media_Id__c', 'mediaUrl'],
      ['TTF_City_State__c', 'cityState'],
      ['TTF_Instagram_Handle__c', 'instagramHandle'],
    ],
    stageName: 'Awaiting Review',
    opportunityNameTemplate: '{firstName} {lastName}',
    attachFileFromKeys: ['mediaUrl'],
    sourceTags: ['trash-the-float', 'campaign-story'],
    sourceAttribution: 'acdrainwiz.com: trash-the-float-story',
  },

  'unsubscribe': {
    target: 'update-by-email',
    fields: [
      ['Unsubscribe_Reason__c', 'reason'],
    ],
    setEmailOptOut: true,
    sourceAttribution: 'acdrainwiz.com: unsubscribe',
    descriptionField: 'Description',
    descriptionSourceKey: 'feedback',
  },

  'email-preferences': {
    target: 'update-by-email',
    fields: [
      ['Email_Pref_Product_Updates__c', 'productUpdates'],
      ['Email_Pref_Promotions__c', 'promotions'],
      ['Email_Pref_Newsletter__c', 'newsletter'],
      ['Email_Pref_Order_Updates__c', 'orderUpdates'],
      ['Email_Pref_Support__c', 'supportEmails'],
    ],
    sourceAttribution: 'acdrainwiz.com: email-preferences',
  },
}

function getFormConfig(formType) {
  return formConfigs[formType] || null
}

function getFieldType(sfField) {
  return fieldTypes[sfField] || 'text'
}

function getFieldMaxLength(sfField) {
  return fieldMaxLengths[sfField] || null
}

// Lead.Company is required by Salesforce, but contact-general, contact-installer and
// contact-demo collect company as optional (installer not at all). Falling back to the
// person's name is the long-standing convention for consumer leads — it reads correctly in
// list views, where a placeholder like "[Individual]" looks like a data bug.
function resolveLeadCompany(data) {
  const company = String(data.company == null ? '' : data.company).trim()
  if (company) return company
  const first = String(data.firstName == null ? '' : data.firstName).trim()
  const last = String(data.lastName == null ? '' : data.lastName).trim()
  const name = `${first} ${last}`.trim()
  return name || 'Unknown'
}

// Every custom field these configs expect, grouped by the object it must exist on — the build
// checklist for the org. Kept here because LEAD_TO_CONTACT_FIELD is derived from it.
const FIELD_MANIFEST = {
  Lead: [
    EXTERNAL_ID_FIELD,
    TAGS_FIELD,
    SOURCE_FIELD,
    'Referral_Source__c',
    'Customer_Type__c',
    'Role__c',
    'Annual_Volume__c',
    'Interest__c',
    'Install_Location__c',
    'Product_To_Install__c',
    'Preferred_Contact__c',
    'Demo_Type__c',
    'Preferred_Date__c',
    'Preferred_Time__c',
    'Number_Of_Attendees__c',
    'Products_Of_Interest__c',
    'Portfolio_Size__c',
    // Mirrored from Contact: unsubscribe and email-preferences update whichever object matches
    // the address, and most forms create Leads.
    'Unsubscribe_Reason__c',
    'Email_Pref_Product_Updates__c',
    'Email_Pref_Promotions__c',
    'Email_Pref_Newsletter__c',
    'Email_Pref_Order_Updates__c',
    'Email_Pref_Support__c',
    'SMS_Transactional_Consent__c',
    'SMS_Marketing_Consent__c',
    'SMS_Consent_Timestamp__c',
    'SMS_Consent_Source_URL__c',
    'SMS_Consent_IP__c',
  ],
  Contact: [
    EXTERNAL_ID_FIELD,
    TAGS_FIELD,
    SOURCE_FIELD,
    'Customer_Type__c',
    'Contact_Type__c',
    'Unsubscribe_Reason__c',
    'Email_Pref_Product_Updates__c',
    'Email_Pref_Promotions__c',
    'Email_Pref_Newsletter__c',
    'Email_Pref_Order_Updates__c',
    'Email_Pref_Support__c',
    'SMS_Transactional_Consent__c',
    'SMS_Marketing_Consent__c',
    'SMS_Consent_Timestamp__c',
    'SMS_Consent_Source_URL__c',
    'SMS_Consent_IP__c',
  ],
  Case: [
    SOURCE_FIELD,
    'Product__c',
  ],
  Opportunity: [
    SOURCE_FIELD,
    'Upgrade_Photo_Id__c',
    'Event_Name__c',
    'TTF_Audience__c',
    'TTF_Story_Body__c',
    'TTF_Damage_Impact__c',
    'TTF_Media_Id__c',
    'TTF_City_State__c',
    'TTF_Instagram_Handle__c',
  ],
}

// A converted Lead is read-only, so a Lead form submitted by someone already converted lands on
// the Contact they became. These are the Lead fields a Contact can hold, under the Contact's
// names. Company and the Lead-only custom fields have nowhere to go; the submission's Task
// keeps those answers.
const LEAD_TO_CONTACT_FIELD = {
  ...Object.fromEntries(Object.keys(CONTACT).map((key) => [LEAD[key][0], CONTACT[key][0]])),
  ...Object.fromEntries(
    FIELD_MANIFEST.Contact.filter((field) => FIELD_MANIFEST.Lead.includes(field)).map((field) => [field, field])
  ),
}

module.exports = {
  EXTERNAL_ID_FIELD,
  TAGS_FIELD,
  SOURCE_FIELD,
  STAGE_ORDER,
  FIELD_MANIFEST,
  LEAD_TO_CONTACT_FIELD,
  stageIsAdvance,
  fieldTypes,
  fieldMaxLengths,
  formConfigs,
  getFormConfig,
  getFieldType,
  getFieldMaxLength,
  resolveLeadCompany,
}
