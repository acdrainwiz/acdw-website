/**
 * GoHighLevel API Client — portable (no Netlify-specific imports).
 * Uses Node global fetch. Lifts-and-shifts to Azure Functions unchanged.
 */

const {
  getFormConfig,
  getCustomFieldId,
  getCustomFieldType,
} = require('./ghl-field-map')

const DEFAULT_BASE_URL = 'https://services.leadconnectorhq.com'
const DEFAULT_API_VERSION = '2021-07-28'
const RETRY_BACKOFF_MS = 500

class GhlConfigError extends Error {
  constructor(message) {
    super(message)
    this.name = 'GhlConfigError'
  }
}

class GhlApiError extends Error {
  constructor(message, status, responseBody, traceId) {
    super(message)
    this.name = 'GhlApiError'
    this.status = status
    this.responseBody = responseBody
    this.traceId = traceId
  }
}

function getConfig() {
  return {
    token: process.env.GHL_PIT_TOKEN || '',
    locationId: process.env.GHL_LOCATION_ID || '',
    baseUrl: process.env.GHL_API_BASE_URL || DEFAULT_BASE_URL,
    apiVersion: process.env.GHL_API_VERSION || DEFAULT_API_VERSION,
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function isRetriable(status) {
  return status === 429 || (status >= 500 && status < 600)
}

async function parseResponse(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch (_) {
    return { raw: text }
  }
}

// One retry on 429/5xx or network error. 500ms backoff.
async function ghlRequest(method, path, body, { retry = true } = {}) {
  const cfg = getConfig()
  if (!cfg.token || !cfg.locationId) {
    throw new GhlConfigError('GHL_PIT_TOKEN and GHL_LOCATION_ID must be set')
  }

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Version: cfg.apiVersion,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body)
  }

  let response
  let data
  try {
    response = await fetch(`${cfg.baseUrl}${path}`, options)
    data = await parseResponse(response)
  } catch (networkErr) {
    if (retry) {
      await sleep(RETRY_BACKOFF_MS)
      return ghlRequest(method, path, body, { retry: false })
    }
    throw new GhlApiError(
      `GHL ${method} ${path} network error: ${networkErr.message}`,
      0,
      null,
      null
    )
  }

  if (!response.ok) {
    if (retry && isRetriable(response.status)) {
      await sleep(RETRY_BACKOFF_MS)
      return ghlRequest(method, path, body, { retry: false })
    }
    const traceId = data && (data.traceId || data.trace_id)
    throw new GhlApiError(
      `GHL ${method} ${path} failed: HTTP ${response.status}`,
      response.status,
      data,
      traceId || null
    )
  }

  return data
}

function shapeCustomFieldValue(rawValue, fieldType) {
  if (rawValue === undefined || rawValue === null || rawValue === '') return null
  const str = String(rawValue).trim()
  if (!str) return null

  switch (fieldType) {
    case 'numeric': {
      const num = Number(str)
      return Number.isFinite(num) ? num : null
    }
    case 'checkbox': {
      const t = str.toLowerCase()
      return t === 'yes' || t === 'true' || t === '1' ? ['yes'] : []
    }
    case 'multiselect':
      return str.split(',').map((s) => s.trim()).filter(Boolean)
    default:
      return str
  }
}

// idLookup defaults to the static getCustomFieldId (Contact custom fields). For
// Opportunity flows, pass a function returning IDs from the dynamic cache.
function buildCustomFieldsArray(pairs, sanitizedData, idLookup = getCustomFieldId) {
  const out = []
  for (const [ghlKey, formKey] of pairs) {
    const id = idLookup(ghlKey)
    if (!id) continue
    const type = getCustomFieldType(ghlKey)
    const shaped = shapeCustomFieldValue(sanitizedData[formKey], type)
    if (shaped === null) continue
    if (Array.isArray(shaped) && shaped.length === 0) continue
    out.push({ id, field_value: shaped })
  }
  return out
}

// =============================================================================
// Opportunity custom field ID auto-lookup (cached per cold-start, 1h TTL)
// =============================================================================
const OPPORTUNITY_FIELD_CACHE_TTL_MS = 60 * 60 * 1000
let opportunityFieldCache = { idMap: null, fetchedAt: 0 }

// Fetch all Opportunity custom fields from GHL and return a map of
// { shortKey: id } where shortKey is the fieldKey with "opportunity." stripped.
async function fetchOpportunityFieldIdMap() {
  const cfg = getConfig()
  if (!cfg.locationId) {
    throw new GhlConfigError('GHL_LOCATION_ID must be set to look up Opportunity custom fields')
  }
  const data = await ghlRequest(
    'GET',
    `/locations/${cfg.locationId}/customFields?model=opportunity`
  )
  const fields = (data && data.customFields) || []
  const map = {}
  for (const f of fields) {
    if (!f || !f.fieldKey || !f.id) continue
    const shortKey = String(f.fieldKey).replace(/^opportunity\./, '')
    map[shortKey] = f.id
  }
  return map
}

async function ensureOpportunityFieldIds() {
  const now = Date.now()
  if (
    opportunityFieldCache.idMap &&
    now - opportunityFieldCache.fetchedAt < OPPORTUNITY_FIELD_CACHE_TTL_MS
  ) {
    return opportunityFieldCache.idMap
  }
  const idMap = await fetchOpportunityFieldIdMap()
  opportunityFieldCache = { idMap, fetchedAt: now }
  return idMap
}

// Test/diagnostic helper: invalidate the cache (useful if you add fields in GHL
// and don't want to wait for the TTL).
function invalidateOpportunityFieldCache() {
  opportunityFieldCache = { idMap: null, fetchedAt: 0 }
}

// Never includes `tags` — tag writes are additive via POST /contacts/{id}/tags.
function buildUpsertPayload(formType, sanitizedData) {
  const cfg = getConfig()
  const formConfig = getFormConfig(formType)
  if (!formConfig) {
    throw new Error(`No GHL configuration for form type: ${formType}`)
  }

  const payload = {
    locationId: cfg.locationId,
    source: formConfig.sourceAttribution,
  }

  for (const [ghlKey, formKey] of formConfig.standardFields) {
    const value = sanitizedData[formKey]
    if (value === undefined || value === null) continue
    const str = String(value).trim()
    if (!str) continue
    payload[ghlKey] = str
  }

  if (formConfig.combineIntoAddress1 && formConfig.combineIntoAddress1.length > 0) {
    const parts = formConfig.combineIntoAddress1
      .map((k) => String(sanitizedData[k] || '').trim())
      .filter(Boolean)
    if (parts.length > 0) {
      payload.address1 = parts.join(' ')
    }
  }

  const customFields = buildCustomFieldsArray(formConfig.customFields || [], sanitizedData)
  if (customFields.length > 0) {
    payload.customFields = customFields
  }

  if (formConfig.setEmailDnd) {
    const today = new Date().toISOString().slice(0, 10)
    payload.dndSettings = {
      Email: {
        status: 'active',
        message: `User unsubscribed via website form on ${today}`,
        code: 'MANUAL',
      },
    }
  }

  return payload
}

async function upsertContact(payload) {
  const data = await ghlRequest('POST', '/contacts/upsert', payload)
  return {
    contactId: data && data.contact && data.contact.id,
    isNew: !!(data && data.new),
    traceId: data && data.traceId,
    raw: data,
  }
}

async function addTags(contactId, tags) {
  if (!contactId || !tags || tags.length === 0) return null
  return ghlRequest('POST', `/contacts/${contactId}/tags`, { tags })
}

async function removeTags(contactId, tags) {
  if (!contactId || !tags || tags.length === 0) return null
  return ghlRequest('DELETE', `/contacts/${contactId}/tags`, { tags })
}

async function addNote(contactId, body) {
  if (!contactId || !body) return null
  return ghlRequest('POST', `/contacts/${contactId}/notes`, { body: String(body) })
}

function resolveConditionalTags(conditionalTags, sanitizedData) {
  if (!conditionalTags || conditionalTags.length === 0) return []
  const out = []
  for (const { tag, when, equals } of conditionalTags) {
    const value = String(sanitizedData[when] || '').trim().toLowerCase()
    if (value === String(equals).toLowerCase()) out.push(tag)
  }
  return out
}

function resolveValueTags(valueTags, sanitizedData) {
  if (!valueTags || valueTags.length === 0) return []
  const out = []
  for (const { formKey, map } of valueTags) {
    const value = String(sanitizedData[formKey] || '').trim().toLowerCase()
    if (value && map && map[value]) out.push(map[value])
  }
  return out
}

/**
 * Upsert contact → add source tags → (optional) pref tag add/remove.
 * Throws on upsert failure. Tag-write failures are swallowed and returned in `warnings`
 * so the contact record is still counted as landed.
 */
async function submitForm(formType, sanitizedData) {
  const formConfig = getFormConfig(formType)
  if (!formConfig) {
    throw new Error(`No GHL configuration for form type: ${formType}`)
  }

  // Dispatch to opportunity flow if configured.
  if (formConfig.target === 'opportunity') {
    return submitOpportunityForm(formType, sanitizedData, formConfig)
  }

  const payload = buildUpsertPayload(formType, sanitizedData)
  const upsertResult = await upsertContact(payload)

  const contactId = upsertResult.contactId
  if (!contactId) {
    const err = new Error('GHL upsert returned no contactId')
    err.raw = upsertResult.raw
    throw err
  }

  const warnings = []

  const staticTags = formConfig.sourceTags || []
  const conditionalTags = resolveConditionalTags(formConfig.conditionalTags, sanitizedData)
  const valueTags = resolveValueTags(formConfig.valueTags, sanitizedData)
  const allSourceTags = [...staticTags, ...conditionalTags, ...valueTags]
  if (allSourceTags.length > 0) {
    try {
      await addTags(contactId, allSourceTags)
    } catch (tagErr) {
      warnings.push({ stage: 'addSourceTags', error: tagErr.message, traceId: tagErr.traceId || null })
    }
  }

  if (formConfig.writeMessageAsNote) {
    const noteKey = formConfig.noteSourceKey || 'message'
    let noteBody = String(sanitizedData[noteKey] || '').trim()
    if (formConfig.noteAppendFields && formConfig.noteAppendFields.length > 0) {
      for (const { label, formKey } of formConfig.noteAppendFields) {
        const v = String(sanitizedData[formKey] || '').trim()
        if (v) noteBody += (noteBody ? '\n\n' : '') + `${label}:\n${v}`
      }
    }
    if (noteBody) {
      try {
        await addNote(contactId, noteBody)
      } catch (noteErr) {
        warnings.push({ stage: 'addNote', error: noteErr.message, traceId: noteErr.traceId || null })
      }
    }
  }

  return {
    contactId,
    isNew: upsertResult.isNew,
    traceId: upsertResult.traceId,
    warnings,
    payload,
  }
}

// =============================================================================
// Opportunity flow
// =============================================================================

function renderOpportunityName(template, sanitizedData) {
  if (!template) return 'New Opportunity'
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = sanitizedData[key]
    return v === undefined || v === null ? '' : String(v).trim()
  }).trim() || 'New Opportunity'
}

async function createOpportunity(payload) {
  const data = await ghlRequest('POST', '/opportunities/', payload)
  return {
    opportunityId: data && (data.opportunity?.id || data.id),
    raw: data,
    traceId: data && (data.traceId || data.trace_id),
  }
}

function buildContactUpsertPayloadForOpportunity(formConfig, sanitizedData) {
  const cfg = getConfig()
  const payload = {
    locationId: cfg.locationId,
    source: formConfig.sourceAttribution,
  }

  for (const [ghlKey, formKey] of formConfig.contactStandardFields || []) {
    const value = sanitizedData[formKey]
    if (value === undefined || value === null) continue
    const str = String(value).trim()
    if (!str) continue
    payload[ghlKey] = str
  }

  const customFields = buildCustomFieldsArray(formConfig.contactCustomFields || [], sanitizedData)
  if (customFields.length > 0) {
    payload.customFields = customFields
  }

  return payload
}

// Fallback when GHL_MUNI_PIPELINE_ID is not yet configured: dump all opportunity
// field values into a structured Note attached to the Contact so nothing is lost.
function buildOpportunityFallbackNote(formConfig, sanitizedData, opportunityName) {
  const lines = [
    `MUNICIPAL INTAKE FORM SUBMISSION (pipeline not yet configured)`,
    `Opportunity Name: ${opportunityName}`,
    ``,
    `Please create this Opportunity manually in GHL with the values below,`,
    `or set GHL_MUNI_PIPELINE_ID + GHL_MUNI_PIPELINE_STAGE_ID env vars and resubmit.`,
    ``,
    `--- Field Values ---`,
  ]
  for (const [ghlKey, formKey] of formConfig.opportunityCustomFields || []) {
    const raw = sanitizedData[formKey]
    if (raw === undefined || raw === null || String(raw).trim() === '') continue
    lines.push(`${ghlKey}: ${String(raw).trim()}`)
  }
  return lines.join('\n')
}

async function submitOpportunityForm(formType, sanitizedData, formConfig) {
  const cfg = getConfig()
  const warnings = []

  // 1. Upsert the Contact (just name/email/phone + sms consent).
  const contactPayload = buildContactUpsertPayloadForOpportunity(formConfig, sanitizedData)
  const contactResult = await upsertContact(contactPayload)
  const contactId = contactResult.contactId
  if (!contactId) {
    const err = new Error('GHL contact upsert returned no contactId')
    err.raw = contactResult.raw
    throw err
  }

  // 2. Add tags to Contact.
  const staticTags = formConfig.sourceTags || []
  const conditionalTags = resolveConditionalTags(formConfig.conditionalTags, sanitizedData)
  const valueTags = resolveValueTags(formConfig.valueTags, sanitizedData)
  const allTags = [...staticTags, ...conditionalTags, ...valueTags]
  if (allTags.length > 0) {
    try {
      await addTags(contactId, allTags)
    } catch (tagErr) {
      warnings.push({ stage: 'addContactTags', error: tagErr.message, traceId: tagErr.traceId || null })
    }
  }

  // 3. Resolve pipeline IDs from env vars.
  const pipelineId = formConfig.pipelineIdEnvVar ? process.env[formConfig.pipelineIdEnvVar] : null
  const pipelineStageId = formConfig.pipelineStageIdEnvVar
    ? process.env[formConfig.pipelineStageIdEnvVar]
    : null

  const opportunityName = renderOpportunityName(
    formConfig.opportunityNameTemplate,
    sanitizedData
  )

  // 4a. Fallback: pipeline not configured → dump fields into a Note on the Contact.
  if (!pipelineId || !pipelineStageId) {
    warnings.push({
      stage: 'pipelineNotConfigured',
      message:
        'Set GHL_MUNI_PIPELINE_ID and GHL_MUNI_PIPELINE_STAGE_ID env vars to enable Opportunity creation. Field values written to Contact Note as fallback.',
    })
    const noteBody = buildOpportunityFallbackNote(formConfig, sanitizedData, opportunityName)
    try {
      await addNote(contactId, noteBody)
    } catch (noteErr) {
      warnings.push({ stage: 'addFallbackNote', error: noteErr.message, traceId: noteErr.traceId || null })
    }
    return {
      contactId,
      opportunityId: null,
      isNew: contactResult.isNew,
      traceId: contactResult.traceId,
      warnings,
      payload: contactPayload,
    }
  }

  // 4b. Create the Opportunity linked to the Contact. Resolve field IDs from the
  // GHL API (cached) so we don't have to hand-maintain IDs in source.
  let opportunityIdMap = null
  try {
    opportunityIdMap = await ensureOpportunityFieldIds()
  } catch (lookupErr) {
    warnings.push({
      stage: 'fetchOpportunityFieldIds',
      error: lookupErr.message,
      status: lookupErr.status,
      traceId: lookupErr.traceId || null,
    })
  }
  const oppIdLookup = (key) => (opportunityIdMap ? opportunityIdMap[key] || '' : '')
  const opportunityCustomFields = buildCustomFieldsArray(
    formConfig.opportunityCustomFields || [],
    sanitizedData,
    oppIdLookup
  )
  const opportunityPayload = {
    pipelineId,
    locationId: cfg.locationId,
    pipelineStageId,
    name: opportunityName,
    status: 'open',
    contactId,
    source: formConfig.sourceAttribution,
  }
  if (opportunityCustomFields.length > 0) {
    opportunityPayload.customFields = opportunityCustomFields
  }

  // Safety net: if we couldn't resolve any custom field IDs (e.g., GHL lookup
  // failed or the fields don't exist yet), drop a Note on the Contact with all
  // 22 form values so nothing is lost while you debug.
  const expectedFieldCount = (formConfig.opportunityCustomFields || []).length
  if (expectedFieldCount > 0 && opportunityCustomFields.length === 0) {
    warnings.push({
      stage: 'noOpportunityCustomFieldsResolved',
      message:
        'No Opportunity custom field IDs resolved from GHL. Falling back to Contact Note. Verify the BOAF & COAA group exists on the Opportunity object.',
    })
    const noteBody = buildOpportunityFallbackNote(formConfig, sanitizedData, opportunityName)
    try {
      await addNote(contactId, noteBody)
    } catch (noteErr) {
      warnings.push({ stage: 'addFallbackNote', error: noteErr.message, traceId: noteErr.traceId || null })
    }
  }

  let opportunityId = null
  try {
    const oppResult = await createOpportunity(opportunityPayload)
    opportunityId = oppResult.opportunityId || null
    if (!opportunityId) {
      warnings.push({ stage: 'createOpportunity', error: 'No opportunityId returned', raw: oppResult.raw })
    }
  } catch (oppErr) {
    // Don't fail the whole submission — Contact already landed. Record the field values
    // in a Note so the team can reconstruct the Opportunity manually.
    warnings.push({
      stage: 'createOpportunity',
      error: oppErr.message,
      status: oppErr.status,
      traceId: oppErr.traceId || null,
      responseBody: oppErr.responseBody,
    })
    const noteBody = buildOpportunityFallbackNote(formConfig, sanitizedData, opportunityName)
    try {
      await addNote(contactId, noteBody)
    } catch (noteErr) {
      warnings.push({ stage: 'addFallbackNote', error: noteErr.message, traceId: noteErr.traceId || null })
    }
  }

  return {
    contactId,
    opportunityId,
    isNew: contactResult.isNew,
    traceId: contactResult.traceId,
    warnings,
    payload: { contact: contactPayload, opportunity: opportunityPayload },
  }
}

module.exports = {
  submitForm,
  submitOpportunityForm,
  createOpportunity,
  renderOpportunityName,
  buildUpsertPayload,
  resolveConditionalTags,
  resolveValueTags,
  upsertContact,
  addTags,
  removeTags,
  addNote,
  ghlRequest,
  fetchOpportunityFieldIdMap,
  ensureOpportunityFieldIds,
  invalidateOpportunityFieldCache,
  GhlApiError,
  GhlConfigError,
}
