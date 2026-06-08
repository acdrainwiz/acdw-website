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

// =============================================================================
// Pipeline stage-position cache (cached per cold-start, 1h TTL). Used to make
// opportunity-stage moves "advance-only" so a resubmit never drags a card that's
// already further along (e.g. an already-mailed sample) backward.
// =============================================================================
let pipelineStageCache = { map: null, fetchedAt: 0 }

// Returns { [pipelineId]: { [stageId]: position } } for the configured location.
async function fetchPipelineStageMap() {
  const cfg = getConfig()
  if (!cfg.locationId) {
    throw new GhlConfigError('GHL_LOCATION_ID must be set to look up pipelines')
  }
  const data = await ghlRequest(
    'GET',
    `/opportunities/pipelines?locationId=${encodeURIComponent(cfg.locationId)}`
  )
  const pipelines = (data && data.pipelines) || []
  const map = {}
  for (const p of pipelines) {
    if (!p || !p.id) continue
    const stages = {}
    for (const s of p.stages || []) {
      if (s && s.id) stages[s.id] = typeof s.position === 'number' ? s.position : 0
    }
    map[p.id] = stages
  }
  return map
}

async function ensurePipelineStageMap() {
  const now = Date.now()
  if (
    pipelineStageCache.map &&
    now - pipelineStageCache.fetchedAt < OPPORTUNITY_FIELD_CACHE_TTL_MS
  ) {
    return pipelineStageCache.map
  }
  const map = await fetchPipelineStageMap()
  pipelineStageCache = { map, fetchedAt: now }
  return map
}

function invalidatePipelineStageCache() {
  pipelineStageCache = { map: null, fetchedAt: 0 }
}

// =============================================================================
// Contact custom field ID auto-lookup (cached per cold-start, 1h TTL)
// =============================================================================
let contactFieldCache = { idMap: null, fetchedAt: 0 }

async function fetchContactFieldIdMap() {
  const cfg = getConfig()
  if (!cfg.locationId) {
    throw new GhlConfigError('GHL_LOCATION_ID must be set to look up Contact custom fields')
  }
  const data = await ghlRequest(
    'GET',
    `/locations/${cfg.locationId}/customFields?model=contact`
  )
  const fields = (data && data.customFields) || []
  const map = {}
  for (const f of fields) {
    if (!f || !f.fieldKey || !f.id) continue
    const shortKey = String(f.fieldKey).replace(/^contact\./, '')
    map[shortKey] = f.id
  }
  return map
}

async function ensureContactFieldIds() {
  const now = Date.now()
  if (
    contactFieldCache.idMap &&
    now - contactFieldCache.fetchedAt < OPPORTUNITY_FIELD_CACHE_TTL_MS
  ) {
    return contactFieldCache.idMap
  }
  const idMap = await fetchContactFieldIdMap()
  contactFieldCache = { idMap, fetchedAt: now }
  return idMap
}

function invalidateContactFieldCache() {
  contactFieldCache = { idMap: null, fetchedAt: 0 }
}

// Runtime-resolved IDs win; falls back to the hand-maintained customFieldIds
// dict so legacy fields keep working if the API call fails.
function makeContactIdLookup(contactIdMap) {
  return (key) => (contactIdMap && contactIdMap[key]) || getCustomFieldId(key) || ''
}

// Never includes `tags` — tag writes are additive via POST /contacts/{id}/tags.
// `contactIdLookup` is an optional resolver for contact custom field IDs (defaults
// to the static dict for backward compat). Pass a runtime-resolved lookup when
// the caller has already awaited ensureContactFieldIds().
function buildUpsertPayload(formType, sanitizedData, contactIdLookup = getCustomFieldId) {
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

  const customFields = buildCustomFieldsArray(formConfig.customFields || [], sanitizedData, contactIdLookup)
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

  const warnings = []

  let contactIdMap = null
  try {
    contactIdMap = await ensureContactFieldIds()
  } catch (lookupErr) {
    warnings.push({
      stage: 'fetchContactFieldIds',
      error: lookupErr.message,
      status: lookupErr.status,
      traceId: lookupErr.traceId || null,
    })
  }
  const contactIdLookup = makeContactIdLookup(contactIdMap)

  const payload = buildUpsertPayload(formType, sanitizedData, contactIdLookup)
  const upsertResult = await upsertContact(payload)

  const contactId = upsertResult.contactId
  if (!contactId) {
    const err = new Error('GHL upsert returned no contactId')
    err.raw = upsertResult.raw
    throw err
  }

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

  // Optionally create a "light" Opportunity in a pipeline tied to this form. Used by
  // contact-* and core-upgrade forms to land leads as pipeline cards (Website Leads,
  // Support Requests, etc.) — distinct from the heavy municipal-intake flow which
  // sets `target: 'opportunity'` and runs through submitOpportunityForm instead.
  // Contact tags + notes are already attached above; this only adds the pipeline card.
  let opportunityId = null
  if (formConfig.opportunityPipelineEnvVar) {
    const pipelineId = process.env[formConfig.opportunityPipelineEnvVar]
    const stageId = formConfig.opportunityStageEnvVar
      ? process.env[formConfig.opportunityStageEnvVar]
      : ''
    if (!pipelineId || !stageId) {
      warnings.push({
        stage: 'opportunityPipelineNotConfigured',
        message: `${formConfig.opportunityPipelineEnvVar} or ${formConfig.opportunityStageEnvVar} not set; Opportunity not created.`,
      })
    } else {
      const cfg = getConfig()
      const opportunityPayload = {
        pipelineId,
        locationId: cfg.locationId,
        pipelineStageId: stageId,
        name: renderOpportunityName(formConfig.opportunityNameTemplate, sanitizedData),
        status: 'open',
        contactId,
        source: formConfig.sourceAttribution,
      }
      try {
        const oppResult = await createOpportunity(opportunityPayload)
        opportunityId = oppResult.opportunityId || null
        if (!opportunityId) {
          warnings.push({
            stage: 'createOpportunity',
            error: 'No opportunityId returned',
            raw: oppResult.raw,
          })
        }
      } catch (oppErr) {
        // Contact has already landed — don't fail the submission over a pipeline-card miss.
        warnings.push({
          stage: 'createOpportunity',
          error: oppErr.message,
          status: oppErr.status,
          traceId: oppErr.traceId || null,
          responseBody: oppErr.responseBody,
        })
      }
    }
  }

  return {
    contactId,
    opportunityId,
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

// Find a contact's opportunities, optionally scoped to one pipeline. NOTE: the search
// endpoint expects snake_case query params (location_id / contact_id / pipeline_id);
// the camelCase variants return HTTP 422.
async function searchOpportunitiesByContact(contactId, pipelineId) {
  const cfg = getConfig()
  const params = new URLSearchParams({ location_id: cfg.locationId, contact_id: contactId })
  if (pipelineId) params.set('pipeline_id', pipelineId)
  const data = await ghlRequest('GET', `/opportunities/search?${params.toString()}`)
  return (data && data.opportunities) || []
}

// Move an existing opportunity to a different stage. Passes the existing name through so
// the card isn't renamed, and keeps it open.
async function updateOpportunityStage(opportunityId, { pipelineId, pipelineStageId, name }) {
  const body = { pipelineId, pipelineStageId, status: 'open' }
  if (name) body.name = name
  const data = await ghlRequest('PUT', `/opportunities/${opportunityId}`, body)
  return {
    opportunityId: (data && (data.opportunity?.id || data.id)) || opportunityId,
    raw: data,
    traceId: data && (data.traceId || data.trace_id),
  }
}

function buildContactUpsertPayloadForOpportunity(formConfig, sanitizedData, contactIdLookup = getCustomFieldId) {
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

  const customFields = buildCustomFieldsArray(formConfig.contactCustomFields || [], sanitizedData, contactIdLookup)
  if (customFields.length > 0) {
    payload.customFields = customFields
  }

  return payload
}

// Fallback when the Opportunity flow can't create a card (pipeline env vars
// missing, custom fields unresolved, or createOpportunity threw). Dumps all
// field values into a structured Note attached to the Contact so nothing is lost.
function buildOpportunityFallbackNote(formType, formConfig, sanitizedData, opportunityName) {
  const idVar = formConfig.pipelineIdEnvVar || '<pipelineIdEnvVar>'
  const stageVar = formConfig.pipelineStageIdEnvVar || '<pipelineStageIdEnvVar>'
  const lines = [
    `FALLBACK NOTE — ${formType}`,
    `Opportunity Name: ${opportunityName}`,
    ``,
    `An Opportunity card could not be created for this submission. Please`,
    `create it manually in GHL using the values below, or set ${idVar} +`,
    `${stageVar} env vars and resubmit to enable automatic creation.`,
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

  // 0. Resolve Contact custom field IDs from GHL (cached). Falls back to the
  //    static dict if the lookup fails — legacy hardcoded IDs still work.
  let contactIdMap = null
  try {
    contactIdMap = await ensureContactFieldIds()
  } catch (lookupErr) {
    warnings.push({
      stage: 'fetchContactFieldIds',
      error: lookupErr.message,
      status: lookupErr.status,
      traceId: lookupErr.traceId || null,
    })
  }
  const contactIdLookup = makeContactIdLookup(contactIdMap)

  // 1. Upsert the Contact (name/email/phone/address + custom fields like contact_type).
  const contactPayload = buildContactUpsertPayloadForOpportunity(formConfig, sanitizedData, contactIdLookup)
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
    const idVar = formConfig.pipelineIdEnvVar || '<pipelineIdEnvVar>'
    const stageVar = formConfig.pipelineStageIdEnvVar || '<pipelineStageIdEnvVar>'
    warnings.push({
      stage: 'pipelineNotConfigured',
      message: `Set ${idVar} and ${stageVar} env vars to enable Opportunity creation. Field values written to Contact Note as fallback.`,
    })
    const noteBody = buildOpportunityFallbackNote(formType, formConfig, sanitizedData, opportunityName)
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

  // 4a-dedupe. If configured, find the contact's existing OPEN card in this pipeline and
  // advance it to the target stage instead of creating a duplicate. Picks the lowest-stage
  // open card (the one most likely sitting at stage 0) and only moves it forward — a card
  // already at or past the target stage is left untouched, so a resubmit never drags an
  // already-mailed sample backward. Any search/move failure falls through to creating a
  // fresh card so a lead is never dropped.
  if (formConfig.dedupeOpportunityByContact) {
    try {
      const openCards = (await searchOpportunitiesByContact(contactId, pipelineId)).filter(
        (o) => o && o.status === 'open'
      )
      if (openCards.length > 0) {
        let positions = {}
        try {
          const stageMap = await ensurePipelineStageMap()
          positions = stageMap[pipelineId] || {}
        } catch (posErr) {
          warnings.push({ stage: 'pipelineStagePositions', error: posErr.message })
        }
        const posOf = (id) =>
          typeof positions[id] === 'number' ? positions[id] : Number.MAX_SAFE_INTEGER
        // Lowest current stage first; on a tie prefer a card this form created.
        openCards.sort((a, b) => {
          const d = posOf(a.pipelineStageId) - posOf(b.pipelineStageId)
          if (d !== 0) return d
          const aMine = a.source === formConfig.sourceAttribution ? 0 : 1
          const bMine = b.source === formConfig.sourceAttribution ? 0 : 1
          return aMine - bMine
        })
        const target = openCards[0]
        const currentPos = posOf(target.pipelineStageId)
        const targetPos = posOf(pipelineStageId)
        // Advance only. When positions can't be resolved, fall back to "move if not already there".
        const positionsKnown =
          currentPos !== Number.MAX_SAFE_INTEGER && targetPos !== Number.MAX_SAFE_INTEGER
        const shouldMove = positionsKnown
          ? currentPos < targetPos
          : target.pipelineStageId !== pipelineStageId
        if (shouldMove) {
          try {
            await updateOpportunityStage(target.id, {
              pipelineId,
              pipelineStageId,
              name: target.name,
            })
          } catch (updErr) {
            warnings.push({
              stage: 'updateOpportunityStage',
              error: updErr.message,
              status: updErr.status,
              traceId: updErr.traceId || null,
              responseBody: updErr.responseBody,
            })
          }
        }
        return {
          contactId,
          opportunityId: target.id,
          isNew: contactResult.isNew,
          traceId: contactResult.traceId,
          warnings,
          deduped: true,
          movedToStage: shouldMove ? pipelineStageId : target.pipelineStageId,
          payload: { contact: contactPayload },
        }
      }
    } catch (searchErr) {
      warnings.push({
        stage: 'searchOpportunities',
        error: searchErr.message,
        status: searchErr.status,
        traceId: searchErr.traceId || null,
      })
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
    const noteBody = buildOpportunityFallbackNote(formType, formConfig, sanitizedData, opportunityName)
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
    const noteBody = buildOpportunityFallbackNote(formType, formConfig, sanitizedData, opportunityName)
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
  searchOpportunitiesByContact,
  updateOpportunityStage,
  fetchPipelineStageMap,
  ensurePipelineStageMap,
  invalidatePipelineStageCache,
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
  fetchContactFieldIdMap,
  ensureContactFieldIds,
  invalidateContactFieldCache,
  makeContactIdLookup,
  GhlApiError,
  GhlConfigError,
}
