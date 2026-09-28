/**
 * Salesforce OAuth 2.0 Client Credentials flow — portable (no Netlify-specific imports).
 * Uses Node global fetch. Ported from the Azure rebuild's api/src/lib/salesforce-auth.ts.
 *
 * This flow issues no refresh token — renewal means requesting a new access token. Tokens are
 * cached in module scope so each warm instance pays the token request once per token lifetime
 * rather than once per form submission.
 */

const TOKEN_PATH = '/services/oauth2/token'

// Treat a token as expired this long before its stated expiry, so a request that starts just
// under the wire doesn't land just over it.
const EXPIRY_SKEW_MS = 60 * 1000

// Salesforce omits expires_in on some editions; fall back to a conservative lifetime rather
// than caching indefinitely.
const DEFAULT_TOKEN_TTL_MS = 30 * 60 * 1000

// A hung token request must not hold the function open; it fails like a network error.
const TOKEN_TIMEOUT_MS = 10000

class SalesforceConfigError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SalesforceConfigError'
  }
}

class SalesforceAuthError extends Error {
  constructor(message, status, errorCode, responseBody) {
    super(message)
    this.name = 'SalesforceAuthError'
    this.status = status
    this.errorCode = errorCode
    this.responseBody = responseBody
  }
}

// A trailing slash on SF_INSTANCE_URL produces '//services/...' paths, which Salesforce answers
// with a bare 404. Normalize rather than trusting the env var to be clean.
function normalizeInstanceUrl(raw) {
  return String(raw || '').trim().replace(/\/+$/, '')
}

function getSalesforceConfig() {
  const clientId = (process.env.SF_CLIENT_ID || '').trim()
  const clientSecret = (process.env.SF_CLIENT_SECRET || '').trim()
  const instanceUrl = normalizeInstanceUrl(process.env.SF_INSTANCE_URL)
  // The client builds URLs as /services/data/v{apiVersion}/, so a value of 'v67.0' would
  // produce '/vv67.0/' and 404 every call. Strip a leading v rather than requiring whoever
  // sets the variable to know which form is wanted.
  const apiVersion = (process.env.SF_API_VERSION || '').trim().replace(/^v/i, '')

  const missing = []
  if (!clientId) missing.push('SF_CLIENT_ID')
  if (!clientSecret) missing.push('SF_CLIENT_SECRET')
  if (!instanceUrl) missing.push('SF_INSTANCE_URL')
  if (!apiVersion) missing.push('SF_API_VERSION')
  if (missing.length) {
    throw new SalesforceConfigError(`${missing.join(', ')} must be set`)
  }

  // Salesforce versions are NN.0. Catching a malformed value here beats a 404 on every call
  // with a URL nobody thinks to look at.
  if (!/^\d{2,3}\.0$/.test(apiVersion)) {
    throw new SalesforceConfigError(`SF_API_VERSION must look like 67.0, got '${apiVersion}'`)
  }

  // The client credentials flow only works against the org's My Domain host. Pointed at
  // login.salesforce.com it fails with invalid_client_id, which reads like a bad consumer key
  // and sends you looking in the wrong place.
  if (/^https?:\/\/(login|test)\.salesforce\.com/i.test(instanceUrl)) {
    throw new SalesforceConfigError(
      'SF_INSTANCE_URL must be the org My Domain host (e.g. https://acdrainwiz.my.salesforce.com), ' +
        'not login.salesforce.com — the client credentials flow rejects the generic login host'
    )
  }

  return { clientId, clientSecret, instanceUrl, apiVersion }
}

// Concurrent submissions on one warm instance share a single token request rather than
// racing to mint several.
let tokenCache = { token: null, expiresAt: 0, inFlight: null }

function invalidateSalesforceToken() {
  tokenCache = { token: null, expiresAt: 0, inFlight: null }
}

async function requestToken(cfg) {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  })

  let response
  let text
  try {
    response = await fetch(`${cfg.instanceUrl}${TOKEN_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
      signal: AbortSignal.timeout(TOKEN_TIMEOUT_MS),
    })
    text = await response.text()
  } catch (networkErr) {
    throw new SalesforceAuthError(
      `Salesforce token request network error: ${networkErr && networkErr.message}`,
      0,
      null,
      null
    )
  }

  // Parsing is deliberately outside the fetch try. A proxy or WAF returning an HTML error page
  // makes JSON.parse throw, and if that shared the catch above it would be reported as a
  // network error with status 0 — hiding the real status, which is the diagnostic.
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch (_) {
    throw new SalesforceAuthError(
      `Salesforce token request returned a non-JSON response (HTTP ${response.status})`,
      response.status,
      null,
      text.slice(0, 500)
    )
  }

  if (!response.ok || !data || !data.access_token) {
    // The useful part is error_description; the status is almost always a bare 400 and says
    // nothing about which link in the auth chain is broken.
    const code = (data && data.error) || null
    const detail = (data && (data.error_description || data.error)) || `HTTP ${response.status}`
    throw new SalesforceAuthError(`Salesforce token request failed: ${detail}`, response.status, code, data)
  }

  const ttlMs =
    typeof data.expires_in === 'number' && data.expires_in > 0
      ? data.expires_in * 1000
      : DEFAULT_TOKEN_TTL_MS

  return {
    token: {
      accessToken: data.access_token,
      // The instance_url returned with the token is authoritative — Salesforce can hand back a
      // different host than the one the token was requested from, and API calls must use it.
      instanceUrl: normalizeInstanceUrl(data.instance_url || cfg.instanceUrl),
    },
    ttlMs,
  }
}

// Returns the cached token while it is still valid, otherwise mints a new one. Pass
// { force: true } to bypass the cache — that is the 401 recovery path in salesforce-client.
async function getAccessToken({ force = false } = {}) {
  if (force) invalidateSalesforceToken()

  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token
  }
  if (tokenCache.inFlight) {
    return tokenCache.inFlight
  }

  const cfg = getSalesforceConfig()
  const pending = requestToken(cfg)
    .then(({ token, ttlMs }) => {
      tokenCache = {
        token,
        expiresAt: Date.now() + Math.max(ttlMs - EXPIRY_SKEW_MS, 0),
        inFlight: null,
      }
      return token
    })
    .catch((err) => {
      // Never cache a failure; the next submission should retry cleanly.
      tokenCache = { token: null, expiresAt: 0, inFlight: null }
      throw err
    })

  tokenCache.inFlight = pending
  return pending
}

module.exports = {
  getSalesforceConfig,
  getAccessToken,
  invalidateSalesforceToken,
  SalesforceConfigError,
  SalesforceAuthError,
}
