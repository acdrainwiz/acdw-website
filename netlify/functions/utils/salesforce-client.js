/**
 * Salesforce REST API transport — portable (no Netlify-specific imports).
 * Uses Node global fetch. Ported from the Azure rebuild's api/src/lib/salesforce-client.ts.
 *
 * Wraps every call with token handling, URL construction, retry on 429/5xx, re-auth on 401,
 * and Salesforce's array-shaped error format. Names no objects and no fields — call sites pass
 * a resource path like 'sobjects/Lead'.
 */

const {
  getAccessToken,
  getSalesforceConfig,
  invalidateSalesforceToken,
  SalesforceAuthError,
} = require('./salesforce-auth')

const RETRY_BACKOFF_MS = 500

// Salesforce holds a row lock for up to 10 seconds; give the competing transaction a moment.
const LOCK_RETRY_BACKOFF_MS = 1000

// A hung Salesforce call must not hold the function (and the visitor) open indefinitely. Long
// enough for a 5 MB ContentVersion upload; a timed-out call is handled like a network error.
const REQUEST_TIMEOUT_MS = 30000

// Quotes a value for a SOQL string literal. Salesforce's REST query endpoint has no bind
// variables, so every interpolated value must be escaped: backslash first (so the escapes
// added for quotes aren't themselves doubled), then single quotes.
function soqlString(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

class SalesforceApiError extends Error {
  constructor(message, status, errorCode, fields, responseBody) {
    super(message)
    this.name = 'SalesforceApiError'
    this.status = status
    this.errorCode = errorCode
    this.fields = fields
    this.responseBody = responseBody
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

// Salesforce errors arrive as [{ errorCode, message, fields }]. Single-object and bare-string
// bodies also turn up on some endpoints, so handle all three rather than assuming the array.
function toErrorDetails(data) {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    if (data.errorCode || data.message) return [data]
    if (data.error) return [{ errorCode: data.error, message: data.error_description || data.error }]
  }
  return []
}

function describeErrors(details, status) {
  if (!details.length) return `HTTP ${status}`
  return details
    .map((d) => {
      const code = d.errorCode ? `${d.errorCode}: ` : ''
      const fields = d.fields && d.fields.length ? ` [${d.fields.join(', ')}]` : ''
      return `${code}${d.message || 'unknown error'}${fields}`
    })
    .join('; ')
}

// Options:
//   retry     — retry once on 429/5xx or a network error. Defaults to true for idempotent
//               methods and false for POST: Salesforce can commit a create and still return a
//               5xx, so retrying a POST risks a duplicate Case, Opportunity or file.
//   reauth    — re-authenticate and retry once on 401 (the token expired mid-flight).
//   lockRetry — retry once on UNABLE_TO_LOCK_ROW. Internal: the retried call passes false.
//
// `path` is relative to the versioned data endpoint, e.g. 'sobjects/Lead' or
// "query/?q=SELECT+Id+FROM+Contact". Pass an absolute path starting with '/services/' to
// bypass versioning.
async function salesforceRequest(method, path, body, { retry, reauth = true, lockRetry = true } = {}) {
  // PATCH-upsert and GET are safe to repeat; POST is not.
  const shouldRetry = retry === undefined ? method.toUpperCase() !== 'POST' : retry
  const cfg = getSalesforceConfig()
  const token = await getAccessToken()

  const url = path.startsWith('/services/')
    ? `${token.instanceUrl}${path}`
    : `${token.instanceUrl}/services/data/v${cfg.apiVersion}/${path.replace(/^\/+/, '')}`

  const headers = {
    Authorization: `Bearer ${token.accessToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // Salesforce's standard duplicate rules fuzzy-match on name, company and phone. The org has
  // them set to Alert rather than Block — save the record, flag it for the team. The UI honours
  // that; the API does not, and without this header an alert comes back as DUPLICATES_DETECTED
  // and the write fails. allowSave only saves where the rule itself permits it: a rule set to
  // Block still blocks.
  if (method.toUpperCase() !== 'GET') {
    headers['Sforce-Duplicate-Rule-Header'] = 'allowSave=true'
  }

  const options = { method, headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body)
  }

  let response
  let data
  try {
    response = await fetch(url, options)
    data = await parseResponse(response)
  } catch (networkErr) {
    if (shouldRetry) {
      await sleep(RETRY_BACKOFF_MS)
      return salesforceRequest(method, path, body, { retry: false, reauth })
    }
    throw new SalesforceApiError(
      `Salesforce ${method} ${path} network error: ${networkErr && networkErr.message}`,
      0,
      null,
      [],
      null
    )
  }

  if (!response.ok) {
    // The token died mid-flight. Client credentials issues no refresh token, so the only
    // recovery is to discard the cached token and mint a new one.
    if (reauth && response.status === 401) {
      invalidateSalesforceToken()
      // A 401 means nothing was committed, so re-sending is safe even for a POST.
      return salesforceRequest(method, path, body, { retry, reauth: false })
    }

    if (shouldRetry && isRetriable(response.status)) {
      await sleep(RETRY_BACKOFF_MS)
      return salesforceRequest(method, path, body, { retry: false, reauth })
    }

    const details = toErrorDetails(data)

    // Salesforce documents a row-lock timeout as temporary ("No corrective action is needed"),
    // and a write that couldn't take its lock committed nothing, so one retry is safe even for
    // a POST. Every form Contact shares the default Account, which makes these likelier.
    if (lockRetry && details.some((d) => d.errorCode === 'UNABLE_TO_LOCK_ROW')) {
      await sleep(LOCK_RETRY_BACKOFF_MS)
      return salesforceRequest(method, path, body, { retry, reauth, lockRetry: false })
    }

    throw new SalesforceApiError(
      `Salesforce ${method} ${path} failed: ${describeErrors(details, response.status)}`,
      response.status,
      (details[0] && details[0].errorCode) || null,
      details.flatMap((d) => d.fields || []),
      data
    )
  }

  return data
}

// Creates one record. Returns the new record's id.
async function createRecord(sobject, fields, options) {
  const result = await salesforceRequest('POST', `sobjects/${sobject}`, fields, options)
  if (!result || !result.id) {
    throw new SalesforceApiError(`Salesforce create ${sobject} returned no record id`, 0, null, [], result)
  }
  return result.id
}

// Updates one record by id. Salesforce answers 204 with no body on success.
async function updateRecord(sobject, recordId, fields, options) {
  await salesforceRequest('PATCH', `sobjects/${sobject}/${recordId}`, fields, options)
}

// Upserts by external id field — the Salesforce equivalent of GHL's contacts/upsert, and the
// reason the external id field has to be marked External ID + Unique on the object.
async function upsertRecord(sobject, externalIdField, externalId, fields, options) {
  // The external ID travels in the URL only. Salesforce rejects it in the body — even when the
  // values match — with "INVALID_FIELD: The <field> field should not be specified in the sobject
  // data". Stripping it here means no caller can reintroduce the bug.
  const body = { ...fields }
  delete body[externalIdField]
  const result = await salesforceRequest(
    'PATCH',
    `sobjects/${sobject}/${externalIdField}/${encodeURIComponent(externalId)}`,
    body,
    options
  )
  // Create returns 201 with created: true. Update returns 200 with created: false from v46
  // onward, and 204 with no body before that — the fallback covers the older shape.
  return result || { success: true, created: false }
}

async function query(soql, options) {
  const result = await salesforceRequest('GET', `query/?q=${encodeURIComponent(soql)}`, undefined, options)
  return (result && result.records) || []
}

module.exports = {
  salesforceRequest,
  createRecord,
  updateRecord,
  upsertRecord,
  query,
  soqlString,
  SalesforceApiError,
  // Re-exported so call sites can catch either failure without importing both modules.
  SalesforceAuthError,
}
