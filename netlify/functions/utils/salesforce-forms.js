/**
 * Form submission orchestration. Replaces submitForm() in ghl-client.js.
 * Ported from the Azure rebuild's api/src/lib/salesforce-forms.ts.
 *
 * Reads a form's config from salesforce-field-map and performs the writes it describes. The
 * contract with the handlers: one call in, { contactId, isNew, warnings } out.
 *
 * The governing rule, carried over from the GoHighLevel client: the person's record lands
 * first, and every write after it is best-effort. A Case or Opportunity failure becomes a
 * warning, never a failed submission — the visitor's details are already saved.
 *
 * People submit more than once, so the person's record and the submission are kept apart. The
 * Lead or Contact is found by email and updated in place: latest answers, tags added to the
 * set, and the form that first brought them in left alone. What they said goes on a completed
 * Task logged against them — one per submission — so a second submission can't erase the
 * first. On a Lead form that Task is the only copy of the message, so it is the one write after
 * the person's record that is not best-effort: if it fails, the submission fails (and the
 * handler logs the full sanitized data), and a retry is safe because everything before it was
 * an update in place.
 */

const {
  createRecord,
  query,
  soqlString,
  updateRecord,
  upsertRecord,
  SalesforceApiError,
} = require('./salesforce-client')
const { isContentDocumentId, linkFileToRecord } = require('./salesforce-media')
const {
  getFieldMaxLength,
  getFieldType,
  getFormConfig,
  resolveLeadCompany,
  stageIsAdvance,
  EXTERNAL_ID_FIELD,
  LEAD_TO_CONTACT_FIELD,
  SOURCE_FIELD,
  TAGS_FIELD,
} = require('./salesforce-field-map')

// Opportunities require a CloseDate. Nothing on these forms implies one, so use a horizon far
// enough out that a card isn't born overdue.
const OPPORTUNITY_CLOSE_DATE_DAYS = 90

// Opportunity.Name holds 120 characters. The templates put the visitor's name after a prefix,
// so a long name would otherwise make the create fail.
const OPPORTUNITY_NAME_MAX = 120

// Task.Description holds 32,000 characters. The longest form, a story with every answer
// listed, stays far below it; the cap is for the pathological case.
const TASK_DESCRIPTION_MAX = 32000

// A Contact created with no Account is a private record — visible only to its owner, which is
// the integration user. Attaching every form Contact to one shared Account makes submitters
// visible to whoever can see that Account.
const DEFAULT_ACCOUNT_NAME = 'Website Submissions'

// The id is stable for the life of the org, so resolve it once per warm instance rather than
// paying a SOQL query per submission.
let defaultAccountCache = { id: null, resolved: false }

function resetDefaultAccountCache() {
  defaultAccountCache = { id: null, resolved: false }
}

function defaultAccountName() {
  return process.env.SF_DEFAULT_ACCOUNT_NAME || DEFAULT_ACCOUNT_NAME
}

// Returns null when the Account doesn't exist. That is not fatal: the Contact still saves, it
// is just private until someone creates the Account, and the caller records a warning.
async function resolveDefaultAccountId(options) {
  if (defaultAccountCache.resolved) return defaultAccountCache.id

  const rows = await query(
    `SELECT Id FROM Account WHERE Name = ${soqlString(defaultAccountName())} LIMIT 1`,
    options
  )
  defaultAccountCache = { id: (rows[0] && rows[0].Id) || null, resolved: true }
  return defaultAccountCache.id
}

function toWarning(stage, error) {
  if (error instanceof SalesforceApiError) {
    return {
      stage,
      message: error.message,
      errorCode: error.errorCode,
      fields: error.fields.length ? error.fields : undefined,
      status: error.status,
    }
  }
  return { stage, message: (error && error.message) || String(error) }
}

function asString(value) {
  return value === undefined || value === null ? '' : String(value)
}

// Salesforce takes typed JSON, so values are shaped rather than stringified. Returns undefined
// for anything that shouldn't be sent at all — an absent value must not overwrite a stored one.
// maxLength (this port only) truncates text rather than letting Salesforce reject the record.
function shapeValue(raw, type, maxLength) {
  if (raw === undefined || raw === null || raw === '') return undefined

  if (type === 'multipicklist') {
    // Checkbox groups arrive comma-joined from this site's forms.
    const parts = Array.isArray(raw)
      ? raw.map((v) => String(v).trim())
      : String(raw).split(',').map((v) => v.trim())
    const values = parts.filter(Boolean)
    // Salesforce delimits multi-select values with semicolons, not commas.
    return values.length ? values.join(';') : undefined
  }

  const str = String(raw).trim()
  if (!str) return undefined

  switch (type) {
    case 'number': {
      const num = Number(str)
      return Number.isFinite(num) ? num : undefined
    }
    case 'checkbox':
      return str.toLowerCase() === 'yes' || str.toLowerCase() === 'true' || str === '1'
    case 'date':
      // The native date input posts YYYY-MM-DD, which is what Salesforce wants. Anything else
      // is dropped rather than guessed at — a misparsed date is worse than a blank one.
      return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : undefined
    default:
      return maxLength && str.length > maxLength ? str.slice(0, maxLength) : str
  }
}

function buildFields(pairs, data) {
  const out = {}
  for (const [sfField, formKey] of pairs) {
    const shaped = shapeValue(data[formKey], getFieldType(sfField), getFieldMaxLength(sfField))
    if (shaped !== undefined) out[sfField] = shaped
  }
  return out
}

// sourceTags, conditionalTags and valueTags collapse into one multi-select written with the
// record. In GoHighLevel each of these needed its own API call.
function buildTags(config, data) {
  const tags = new Set(config.sourceTags || [])

  for (const rule of config.conditionalTags || []) {
    if (asString(data[rule.when]).trim() === rule.equals) tags.add(rule.tag)
  }
  for (const rule of config.valueTags || []) {
    const value = asString(data[rule.formKey]).trim().toLowerCase()
    const mapped = rule.map[value]
    if (mapped) tags.add(mapped)
  }

  return tags.size ? [...tags].join(';') : undefined
}

// The form's message plus any appended answers. Goes on the submission's Task and on the Case
// or Opportunity it opens.
function buildDescription(config, data) {
  const sourceKey = config.descriptionSourceKey || 'message'
  const parts = []

  const body = asString(data[sourceKey]).trim()
  if (body) parts.push(body)

  for (const field of config.descriptionAppendFields || []) {
    const value = asString(data[field.formKey]).trim()
    if (value) parts.push(`${field.label}: ${value}`)
  }

  return parts.length ? parts.join('\n\n') : undefined
}

function normalizedEmail(data) {
  return asString(data.email).trim().toLowerCase()
}

function renderTemplate(template, data) {
  return template.replace(/\{(\w+)\}/g, (_, key) => asString(data[key]).trim()).trim()
}

function closeDate() {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + OPPORTUNITY_CLOSE_DATE_DAYS)
  return date.toISOString().slice(0, 10)
}

// Case.Priority is a native picklist of High/Medium/Low; the form posts low/medium/high.
function toCasePriority(raw) {
  const value = asString(raw).trim().toLowerCase()
  if (!value) return undefined
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// The Lead or Contact a submission belongs to, matched on the normalized email.
async function findByEmail(sobject, select, email, options) {
  const rows = await query(
    `SELECT ${select} FROM ${sobject} WHERE ${EXTERNAL_ID_FIELD} = ${soqlString(email)} LIMIT 1`,
    options
  )
  return rows[0] || null
}

// A new record is stamped with the form that brought the person in. A known one (`match`) keeps
// that — the source stays the first touch — and gains this form's tags on top of the ones it
// already carries: Website_Tags__c is a multi-select, and writing one replaces every value.
function applyTagsAndSource(fields, config, data, match) {
  const incoming = buildTags(config, data)
  if (!match) {
    if (incoming) fields[TAGS_FIELD] = incoming
    fields[SOURCE_FIELD] = config.sourceAttribution
    return
  }
  if (!incoming) return
  const tags = new Set(asString(match.Website_Tags__c).split(';').filter(Boolean))
  for (const tag of incoming.split(';')) tags.add(tag)
  fields[TAGS_FIELD] = [...tags].join(';')
}

function toContactFields(leadFields) {
  const out = {}
  for (const [field, value] of Object.entries(leadFields)) {
    const contactField = LEAD_TO_CONTACT_FIELD[field]
    if (contactField) out[contactField] = value
  }
  return out
}

// 'SMS_Consent_IP__c' → 'SMS Consent IP', 'MailingPostalCode' → 'Mailing Postal Code'.
function fieldLabel(apiName) {
  return apiName.replace(/__c$/, '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
}

// Logs the submission as a completed Task on the person: the message, then every answer the
// form wrote, labelled by field. The person's record only ever holds the latest answers; the
// Task keeps each submission as it was sent, including the SMS consent proof that came with it.
// whatId ties the Task to the Case or Opportunity the submission opened — Salesforce allows that
// only when whoId is a Contact, which it always is on those forms.
async function logSubmission(whoId, whatId, config, data, answers, options) {
  const answerLines = Object.entries(answers).map(([field, value]) => `${fieldLabel(field)}: ${String(value)}`)
  const description = [buildDescription(config, data), answerLines.join('\n')].filter(Boolean).join('\n\n')

  const task = {
    WhoId: whoId,
    Subject: config.sourceAttribution,
    Status: 'Completed',
    ActivityDate: new Date().toISOString().slice(0, 10),
    Description: description.slice(0, TASK_DESCRIPTION_MAX),
  }
  if (whatId) task.WhatId = whatId

  return createRecord('Task', task, options)
}

// --- Per-target flows ---------------------------------------------------------------------

async function submitLead(config, data, options) {
  const email = normalizedEmail(data)
  const fields = buildFields(config.fields, data)
  const answers = { ...fields }

  const match = await findByEmail(
    'Lead',
    `Id, ${TAGS_FIELD}, IsConverted, ConvertedContactId, ConvertedContact.${TAGS_FIELD}`,
    email,
    options
  )

  let personId
  let isNew = false

  if (match && match.IsConverted && match.ConvertedContactId) {
    // Salesforce makes a converted Lead read-only, so writing to it fails. The person lives on
    // as the Contact it became, and that is where the submission goes.
    personId = match.ConvertedContactId
    const contactFields = toContactFields(fields)
    applyTagsAndSource(contactFields, config, data, match.ConvertedContact || {})
    await updateRecord('Contact', personId, contactFields, options)
  } else if (match) {
    personId = match.Id
    applyTagsAndSource(fields, config, data, match)
    await updateRecord('Lead', personId, fields, options)
  } else {
    applyTagsAndSource(fields, config, data, null)
    // Company is required on Lead but optional (or absent) on several of these forms. Only a
    // new Lead gets the fallback: on a known one it would overwrite a company typed earlier.
    fields.Company = shapeValue(resolveLeadCompany(data), 'text', getFieldMaxLength('Company'))
    fields.LeadSource = 'Web'
    // An upsert rather than a create: if a concurrent submission created this Lead since the
    // lookup, the write lands on that record instead of failing on the unique email.
    const result = await upsertRecord('Lead', EXTERNAL_ID_FIELD, email, fields, options)
    personId = result.id || ''
    isNew = result.created || false
  }

  await logSubmission(personId, null, config, data, answers, options)

  return { contactId: personId, caseId: null, opportunityId: null, isNew, warnings: [] }
}

async function upsertContact(contactFields, config, data, combineIntoStreet, options) {
  const email = normalizedEmail(data)
  const fields = buildFields(contactFields, data)
  const warnings = []

  if (combineIntoStreet) {
    const street = combineIntoStreet
      .map((key) => asString(data[key]).trim())
      .filter(Boolean)
      .join(' ')
    if (street) fields.MailingStreet = shapeValue(street, 'text', getFieldMaxLength('MailingStreet'))
  }
  const answers = { ...fields }

  const match = await findByEmail('Contact', `Id, AccountId, ${TAGS_FIELD}`, email, options)
  applyTagsAndSource(fields, config, data, match)

  // Resolved before the write so the Contact is shared from the moment it exists. A lookup
  // failure must not cost the submission — the Contact saves either way. A Contact someone has
  // already filed under a real Account stays there.
  if (!(match && match.AccountId)) {
    try {
      const accountId = await resolveDefaultAccountId(options)
      if (accountId) {
        fields.AccountId = accountId
      } else {
        warnings.push({
          stage: 'default-account',
          message: `No Account named '${defaultAccountName()}' — this Contact is a private record until one exists`,
        })
      }
    } catch (error) {
      warnings.push(toWarning('default-account', error))
    }
  }

  if (match) {
    await updateRecord('Contact', match.Id, fields, options)
    return { id: match.Id, isNew: false, warnings, answers }
  }

  // Upsert for the same reason as a new Lead: a concurrent submission may have just created it.
  const result = await upsertRecord('Contact', EXTERNAL_ID_FIELD, email, fields, options)
  return { id: result.id || '', isNew: result.created || false, warnings, answers }
}

async function submitCase(config, data, options) {
  const contact = await upsertContact(config.contactFields, config, data, undefined, options)
  const warnings = [...contact.warnings]
  let caseId = null
  const caseAnswers = buildFields(config.caseFields, data)

  try {
    const caseFields = { ...caseAnswers }
    const priority = toCasePriority(data.priority)
    if (priority) caseFields.Priority = priority

    caseFields.ContactId = contact.id
    caseFields.Origin = 'Web'
    caseFields.Subject = renderTemplate('Support Request: {firstName} {lastName}', data)
    caseFields[SOURCE_FIELD] = config.sourceAttribution

    const description = buildDescription(config, data)
    if (description) caseFields.Description = description

    caseId = await createRecord('Case', caseFields, options)
  } catch (error) {
    // The Contact is saved; a Case failure must not fail the submission.
    warnings.push(toWarning('case', error))
  }

  // Best-effort here, unlike on a Lead form: the Case carries the message too.
  try {
    await logSubmission(contact.id, caseId, config, data, { ...contact.answers, ...caseAnswers }, options)
  } catch (error) {
    warnings.push(toWarning('task', error))
  }

  return { contactId: contact.id, caseId, opportunityId: null, isNew: contact.isNew, warnings }
}

// Finds the contact's open Opportunity, if any, via the contact-role junction.
async function findOpenOpportunity(contactId, options) {
  const rows = await query(
    `SELECT OpportunityId, Opportunity.StageName FROM OpportunityContactRole ` +
      `WHERE ContactId = ${soqlString(contactId)} AND Opportunity.IsClosed = false ` +
      `ORDER BY Opportunity.CreatedDate DESC LIMIT 1`,
    options
  )
  const row = rows[0]
  if (!row || !row.OpportunityId) return null
  return { id: row.OpportunityId, stageName: (row.Opportunity && row.Opportunity.StageName) || '' }
}

async function submitOpportunity(config, data, options) {
  const contact = await upsertContact(
    config.contactFields,
    config,
    data,
    config.combineIntoStreet,
    options
  )
  const warnings = [...contact.warnings]
  let opportunityId = null
  const opportunityAnswers = buildFields(config.opportunityFields, data)

  try {
    const existing = config.dedupeOpportunityByContact
      ? await findOpenOpportunity(contact.id, options)
      : null

    if (existing) {
      opportunityId = existing.id
      // Advance-only. A resubmission may move a card forward but must never drag an
      // already-shipped sample back to an earlier stage.
      if (stageIsAdvance(existing.stageName, config.stageName)) {
        await updateRecord('Opportunity', existing.id, { StageName: config.stageName }, options)
      }
    } else {
      const oppFields = { ...opportunityAnswers }
      oppFields.Name = renderTemplate(config.opportunityNameTemplate, data).slice(0, OPPORTUNITY_NAME_MAX)
      oppFields.StageName = config.stageName
      oppFields.CloseDate = closeDate()
      oppFields[SOURCE_FIELD] = config.sourceAttribution

      const description = buildDescription(config, data)
      if (description) oppFields.Description = description

      opportunityId = await createRecord('Opportunity', oppFields, options)

      // Opportunity has no ContactId; the link is the contact-role junction.
      try {
        await createRecord(
          'OpportunityContactRole',
          { OpportunityId: opportunityId, ContactId: contact.id, IsPrimary: true, Role: 'Decision Maker' },
          options
        )
      } catch (error) {
        warnings.push(toWarning('opportunity-contact-role', error))
      }

      // Put the uploaded photo in the record's Files related list. The upload already happened
      // (upload-image function), before this record existed, so the link can only be made now.
      for (const key of config.attachFileFromKeys || []) {
        const documentId = data[key]
        if (!isContentDocumentId(documentId)) continue
        try {
          await linkFileToRecord(documentId, opportunityId, options)
        } catch (error) {
          warnings.push(toWarning('attach-file', error))
        }
      }
    }
  } catch (error) {
    warnings.push(toWarning('opportunity', error))
  }

  // Best-effort, as on the Case forms. When the submission only advanced an existing
  // Opportunity, this Task is where its answers are kept.
  try {
    await logSubmission(
      contact.id,
      opportunityId,
      config,
      data,
      { ...contact.answers, ...opportunityAnswers },
      options
    )
  } catch (error) {
    warnings.push(toWarning('task', error))
  }

  return { contactId: contact.id, caseId: null, opportunityId, isNew: contact.isNew, warnings }
}

// Updates an existing Lead or Contact matched by email, and creates nothing. Used by the
// unsubscribe and email-preferences flows, where a record the visitor never had should not be
// conjured into existence.
//
// Attribution and tags are left alone — an opt-out is not where the person came from — and any
// feedback is appended beneath the existing description rather than replacing it.
async function submitUpdateByEmail(config, data, options) {
  const email = normalizedEmail(data)
  const warnings = []
  let updatedId = ''

  // Contact first: a known customer is the more likely match, and the more important one to
  // honour an opt-out on.
  for (const sobject of ['Contact', 'Lead']) {
    const select =
      sobject === 'Lead'
        ? 'Id, Description, IsConverted, ConvertedContactId, ConvertedContact.Description'
        : 'Id, Description'
    const match = await findByEmail(sobject, select, email, options)
    if (!match || !match.Id) continue

    // A converted Lead is read-only, and an opt-out written to it would fail. The person is now
    // the Contact it became, so that is the record that has to carry the opt-out.
    const convertedTo = match.IsConverted ? match.ConvertedContactId : null
    const target = convertedTo
      ? {
          sobject: 'Contact',
          id: convertedTo,
          description: match.ConvertedContact && match.ConvertedContact.Description,
        }
      : { sobject, id: match.Id, description: match.Description }

    const fields = buildFields(config.fields, data)
    if (config.setEmailOptOut) fields.HasOptedOutOfEmail = true

    if (config.descriptionField) {
      const addition = buildDescription(config, data)
      if (addition) {
        const existing = asString(target.description).trim()
        const entry = `${config.sourceAttribution}: ${addition}`
        fields[config.descriptionField] = existing ? `${existing}\n\n${entry}` : entry
      }
    }

    try {
      await updateRecord(target.sobject, target.id, fields, options)
      updatedId = target.id
      break
    } catch (error) {
      warnings.push(toWarning(`update-${target.sobject.toLowerCase()}`, error))
    }
  }

  if (!updatedId) {
    // Not an error. Someone unsubscribing an address that was never in the CRM has got what
    // they asked for, and the form should say so.
    warnings.push({ stage: 'match', message: 'No Contact or Lead matched that email address' })
  }

  return { contactId: updatedId, caseId: null, opportunityId: null, isNew: false, warnings }
}

// --- Entry point ---------------------------------------------------------------------------

class SalesforceFormError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SalesforceFormError'
  }
}

async function submitForm(formType, data, options) {
  const config = getFormConfig(formType)
  if (!config) throw new SalesforceFormError(`No Salesforce config for form type '${formType}'`)

  switch (config.target) {
    case 'lead':
      return submitLead(config, data, options)
    case 'contact+case':
      return submitCase(config, data, options)
    case 'contact+opportunity':
      return submitOpportunity(config, data, options)
    case 'update-by-email':
      return submitUpdateByEmail(config, data, options)
    default:
      throw new SalesforceFormError(`Unknown Salesforce target '${config.target}' for '${formType}'`)
  }
}

module.exports = {
  submitForm,
  shapeValue,
  buildTags,
  buildDescription,
  resetDefaultAccountCache,
  SalesforceFormError,
}
