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

function buildCustomFieldsArray(pairs, sanitizedData) {
  const out = []
  for (const [ghlKey, formKey] of pairs) {
    const id = getCustomFieldId(ghlKey)
    if (!id) continue
    const type = getCustomFieldType(ghlKey)
    const shaped = shapeCustomFieldValue(sanitizedData[formKey], type)
    if (shaped === null) continue
    if (Array.isArray(shaped) && shaped.length === 0) continue
    out.push({ id, field_value: shaped })
  }
  return out
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

// email-preferences: derive add/remove tag lists from prefFoo=yes|no checkboxes.
function buildPrefTagUpdates(sanitizedData) {
  const prefMap = {
    prefProductUpdates: 'pref:product-updates',
    prefPromotions: 'pref:promotions',
    prefNewsletter: 'pref:newsletter',
  }
  const add = []
  const remove = []
  for (const [formKey, tag] of Object.entries(prefMap)) {
    const value = String(sanitizedData[formKey] || '').trim().toLowerCase()
    if (value === 'yes' || value === 'true' || value === '1') {
      add.push(tag)
    } else if (value === 'no' || value === 'false' || value === '0' || value === '') {
      remove.push(tag)
    }
  }
  return { add, remove }
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
  const allSourceTags = [...staticTags, ...conditionalTags]
  if (allSourceTags.length > 0) {
    try {
      await addTags(contactId, allSourceTags)
    } catch (tagErr) {
      warnings.push({ stage: 'addSourceTags', error: tagErr.message, traceId: tagErr.traceId || null })
    }
  }

  if (formConfig.writeMessageAsNote && sanitizedData.message) {
    try {
      await addNote(contactId, sanitizedData.message)
    } catch (noteErr) {
      warnings.push({ stage: 'addNote', error: noteErr.message, traceId: noteErr.traceId || null })
    }
  }

  if (formConfig.dynamicPrefTags) {
    const { add, remove } = buildPrefTagUpdates(sanitizedData)
    if (add.length > 0) {
      try {
        await addTags(contactId, add)
      } catch (tagErr) {
        warnings.push({ stage: 'addPrefTags', error: tagErr.message, traceId: tagErr.traceId || null })
      }
    }
    if (remove.length > 0) {
      try {
        await removeTags(contactId, remove)
      } catch (tagErr) {
        warnings.push({ stage: 'removePrefTags', error: tagErr.message, traceId: tagErr.traceId || null })
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

module.exports = {
  submitForm,
  buildUpsertPayload,
  buildPrefTagUpdates,
  resolveConditionalTags,
  upsertContact,
  addTags,
  removeTags,
  addNote,
  ghlRequest,
  GhlApiError,
  GhlConfigError,
}
