// One-shot diagnostic: GET /.netlify/functions/ghl-field-discovery?secret=<GHL_DISCOVERY_SECRET>
// Returns all GHL custom fields + a paste-ready customFieldIds snippet. Delete after migration.

const { ghlRequest, GhlConfigError, GhlApiError } = require('./utils/ghl-client')
const { customFieldIds } = require('./utils/ghl-field-map')

function slugToSnake(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const providedSecret = (event.queryStringParameters && event.queryStringParameters.secret) || ''
  const expectedSecret = process.env.GHL_DISCOVERY_SECRET || ''
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Forbidden' }),
    }
  }

  const locationId = process.env.GHL_LOCATION_ID || ''
  if (!locationId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'GHL_LOCATION_ID not set' }),
    }
  }

  try {
    const data = await ghlRequest('GET', `/locations/${locationId}/customFields?model=all`)

    const rawFields = (data && data.customFields) || []
    const simplified = rawFields.map((f) => ({
      id: f.id,
      name: f.name,
      fieldKey: f.fieldKey,
      dataType: f.dataType,
      model: f.model,
    }))

    // Build a guess: match each field name (slug'd) against keys we expect.
    const expectedKeys = Object.keys(customFieldIds)
    const guessedMap = {}
    for (const key of expectedKeys) {
      guessedMap[key] = ''
    }

    for (const f of rawFields) {
      const nameSlug = slugToSnake(f.name)
      const keySlug = slugToSnake(f.fieldKey || '')

      for (const key of expectedKeys) {
        if (key === nameSlug || key === keySlug || f.fieldKey === key) {
          guessedMap[key] = f.id
          break
        }
      }
    }

    const snippet = [
      'const customFieldIds = {',
      ...expectedKeys.map((k) => `  ${k}: ${JSON.stringify(guessedMap[k])},`),
      '}',
    ].join('\n')

    const unmatchedExpected = expectedKeys.filter((k) => !guessedMap[k])
    const unmatchedGhl = rawFields
      .filter((f) => !Object.values(guessedMap).includes(f.id))
      .map((f) => ({ id: f.id, name: f.name, fieldKey: f.fieldKey }))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          locationId,
          totalFields: rawFields.length,
          fields: simplified,
          suggestedMap: guessedMap,
          pasteSnippet: snippet,
          diagnostics: {
            expectedKeysWithoutMatch: unmatchedExpected,
            ghlFieldsWithoutMatch: unmatchedGhl,
            hint:
              unmatchedExpected.length > 0
                ? 'For each unmatched expected key, find it manually in `fields[]` above and paste its `id` into pasteSnippet.'
                : 'All expected keys were auto-matched. Copy pasteSnippet into netlify/functions/utils/ghl-field-map.js.',
          },
        },
        null,
        2
      ),
    }
  } catch (err) {
    if (err instanceof GhlConfigError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration', message: err.message }),
      }
    }
    if (err instanceof GhlApiError) {
      return {
        statusCode: err.status || 502,
        headers,
        body: JSON.stringify({
          error: 'GHL API error',
          message: err.message,
          status: err.status,
          traceId: err.traceId,
          responseBody: err.responseBody,
        }),
      }
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', message: err && err.message }),
    }
  }
}
