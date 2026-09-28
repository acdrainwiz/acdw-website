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
  SOURCE_FIELD,
  TAGS_FIELD,
} = require('./salesforce-field-map')

// Opportunities require a CloseDate. Nothing on these forms implies one, so use a horizon far
// enough out that a card isn't born overdue.
const OPPORTUNITY_CLOSE_DATE_DAYS = 90

// Opportunity.Name holds 120 characters. The templates put the visitor's name after a prefix,
// so a long name would otherwise make the create fail.
const OPPORTUNITY_NAME_MAX = 120

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
// maxLength truncates text rather than letting Salesforce reject the whole record.
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

// In GoHighLevel the message was a separate Notes API call. Here it is a field on the record,
// so it costs no extra request.
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

// Applies the shared decorations a NEW record carries: the upsert key, the tag multi-select, the
// message, and which form it came from. Never use it on an update — see submitUpdateByEmail.
function decorate(fields, config, data) {
  const email = normalizedEmail(data)
  if (email) fields[EXTERNAL_ID_FIELD] = email

  const tags = buildTags(config, data)
  if (tags) fields[TAGS_FIELD] = tags

  fields[SOURCE_FIELD] = config.sourceAttribution

  if (config.descriptionField) {
    const description = buildDescription(config, data)
    if (description) fields[config.descriptionField] = description
  }

  return fields
}

// --- Per-target flows ---------------------------------------------------------------------

async function submitLead(config, data, options) {
  const fields = decorate(buildFields(config.fields, data), config, data)

  // Company is required on Lead but optional (or absent) on several of these forms.
  fields.Company = shapeValue(resolveLeadCompany(data), 'text', getFieldMaxLength('Company'))
  fields.LeadSource = 'Web'

  const email = normalizedEmail(data)
  const result = await upsertRecord('Lead', EXTERNAL_ID_FIELD, email, fields, options)

  return {
    contactId: result.id || '',
    caseId: null,
    opportunityId: null,
    // created is false when the upsert matched an existing record and updated it in place.
    isNew: result.created || false,
    warnings: [],
  }
}

async function upsertContact(contactFields, config, data, combineIntoStreet, options) {
  const fields = decorate(buildFields(contactFields, data), config, data)
  const warnings = []

  if (combineIntoStreet) {
    const street = combineIntoStreet
      .map((key) => asString(data[key]).trim())
      .filter(Boolean)
      .join(' ')
    if (street) fields.MailingStreet = shapeValue(street, 'text', getFieldMaxLength('MailingStreet'))
  }

  // Resolved before the write so the Contact is shared from the moment it exists. A lookup
  // failure must not cost the submission — the Contact saves either way.
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

  const email = normalizedEmail(data)
  const result = await upsertRecord('Contact', EXTERNAL_ID_FIELD, email, fields, options)
  return { id: result.id || '', isNew: result.created || false, warnings }
}

async function submitCase(config, data, options) {
  const contact = await upsertContact(config.contactFields, config, data, undefined, options)
  const warnings = [...contact.warnings]
  let caseId = null

  try {
    const caseFields = buildFields(config.caseFields, data)
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
      const oppFields = buildFields(config.opportunityFields, data)
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

  return { contactId: contact.id, caseId: null, opportunityId, isNew: contact.isNew, warnings }
}

// Updates an existing Lead or Contact matched by email, and creates nothing. Used by the
// unsubscribe and email-preferences flows, where a record the visitor never had should not be
// conjured into existence.
//
// Deliberately does NOT use decorate(). That step is for creating a record: it stamps
// Website_Source__c and writes Description outright. On an update both are destructive — the
// Lead would claim it came from the unsubscribe form, and the customer's original enquiry
// would be overwritten by their opt-out feedback. So attribution and tags are left alone, and
// any feedback is appended beneath what is already there.
async function submitUpdateByEmail(config, data, options) {
  const email = normalizedEmail(data)
  const warnings = []
  let updatedId = ''

  // Contact first: a known customer is the more likely match, and the more important one to
  // honour an opt-out on.
  for (const sobject of ['Contact', 'Lead']) {
    const rows = await query(
      `SELECT Id, Description FROM ${sobject} WHERE ${EXTERNAL_ID_FIELD} = ${soqlString(email)} LIMIT 1`,
      options
    )
    const match = rows[0]
    if (!match || !match.Id) continue
    const id = match.Id

    const fields = buildFields(config.fields, data)
    if (config.setEmailOptOut) fields.HasOptedOutOfEmail = true

    if (config.descriptionField) {
      const addition = buildDescription(config, data)
      if (addition) {
        const existing = asString(match.Description).trim()
        const entry = `${config.sourceAttribution}: ${addition}`
        fields[config.descriptionField] = existing ? `${existing}\n\n${entry}` : entry
      }
    }

    try {
      await updateRecord(sobject, id, fields, options)
      updatedId = id
      break
    } catch (error) {
      warnings.push(toWarning(`update-${sobject.toLowerCase()}`, error))
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
