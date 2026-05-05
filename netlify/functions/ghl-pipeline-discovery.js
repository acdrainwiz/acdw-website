// One-shot diagnostic: GET /.netlify/functions/ghl-pipeline-discovery?secret=<GHL_DISCOVERY_SECRET>
// Lists every Opportunity pipeline for the configured location with its stages.
// Use this to grab pipeline IDs and stage IDs for env-var configuration
// (e.g. GHL_QUICK_PIPELINE_ID, GHL_QUICK_PIPELINE_STAGE_ID). Delete after migration.

const { ghlRequest, GhlConfigError, GhlApiError } = require('./utils/ghl-client')

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

  // Optional ?pipelineId=<id> filters to a single pipeline.
  const pipelineFilter =
    (event.queryStringParameters && event.queryStringParameters.pipelineId) || ''

  try {
    const data = await ghlRequest(
      'GET',
      `/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`
    )

    const pipelines = (data && data.pipelines) || []
    const simplified = pipelines.map((p) => ({
      id: p.id,
      name: p.name,
      stages: (p.stages || []).map((s) => ({
        id: s.id,
        name: s.name,
        position: s.position,
      })),
    }))

    const filtered = pipelineFilter
      ? simplified.filter((p) => p.id === pipelineFilter)
      : simplified

    // Convenience: paste-ready env-var snippet for each pipeline + stage.
    const envSnippets = []
    for (const p of filtered) {
      for (const s of p.stages) {
        envSnippets.push(
          `# ${p.name} → ${s.name}\nGHL_PIPELINE_ID=${p.id}\nGHL_PIPELINE_STAGE_ID=${s.id}\n`
        )
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        {
          locationId,
          totalPipelines: pipelines.length,
          pipelines: filtered,
          envSnippets,
          hint: pipelineFilter
            ? 'Filtered to ?pipelineId=...; remove it to see all pipelines.'
            : 'Pass ?pipelineId=<id> to filter to a single pipeline.',
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
