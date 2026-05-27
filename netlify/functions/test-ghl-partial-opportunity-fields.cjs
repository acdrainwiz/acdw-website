const assert = require('assert')
const fs = require('fs')
const Module = require('module')
const path = require('path')

const utilsDir = path.join(__dirname, 'utils')
const originalJsLoader = Module._extensions['.js']

Module._extensions['.js'] = function loadNetlifyCommonJs(module, filename) {
  if (filename.startsWith(utilsDir)) {
    module._compile(fs.readFileSync(filename, 'utf8'), filename)
    return
  }
  originalJsLoader(module, filename)
}

const ghlClient = require('./utils/ghl-client.js')

async function run() {
  process.env.GHL_PIT_TOKEN = 'test-token'
  process.env.GHL_LOCATION_ID = 'loc-123'
  process.env.GHL_TTF_PIPELINE_ID = 'pipe-ttf'
  process.env.GHL_TTF_PIPELINE_STAGE_ID = 'stage-review'

  ghlClient.invalidateContactFieldCache()
  ghlClient.invalidateOpportunityFieldCache()

  const requests = []
  const notes = []
  const opportunities = []
  const originalFetch = global.fetch

  global.fetch = async (url, options = {}) => {
    const parsed = new URL(url)
    const request = {
      method: options.method,
      path: `${parsed.pathname}${parsed.search}`,
      body: options.body ? JSON.parse(options.body) : null,
    }
    requests.push(request)

    if (request.method === 'GET' && request.path === '/locations/loc-123/customFields?model=contact') {
      return jsonResponse({ customFields: [] })
    }

    if (request.method === 'POST' && request.path === '/contacts/upsert') {
      return jsonResponse({ contact: { id: 'contact-1' }, new: false, traceId: 'trace-contact' })
    }

    if (request.method === 'POST' && request.path === '/contacts/contact-1/tags') {
      return jsonResponse({})
    }

    if (request.method === 'GET' && request.path === '/locations/loc-123/customFields?model=opportunity') {
      return jsonResponse({
        customFields: [
          { fieldKey: 'opportunity.ttf_audience', id: 'field-audience' },
        ],
      })
    }

    if (request.method === 'POST' && request.path === '/contacts/contact-1/notes') {
      notes.push(request.body.body)
      return jsonResponse({})
    }

    if (request.method === 'POST' && request.path === '/opportunities/') {
      opportunities.push(request.body)
      return jsonResponse({ opportunity: { id: 'opp-1' } })
    }

    throw new Error(`Unexpected request: ${request.method} ${request.path}`)
  }

  try {
    const result = await ghlClient.submitForm('trash-the-float-story', {
      firstName: 'Pat',
      lastName: 'Contractor',
      email: 'pat@example.com',
      city: 'Tampa',
      audience: 'Contractor',
      storyBody: 'The old float failed and flooded a hallway.',
      damageImpact: 'Ceiling stain and service call',
      mediaUrl: 'https://example.com/photo.jpg',
      cityState: 'Tampa, FL',
      instagramHandle: '@patcontractor',
    })

    assert.strictEqual(result.opportunityId, 'opp-1')
    assert.strictEqual(notes.length, 1, 'writes a fallback note when submitted fields are missing IDs')
    assert(notes[0].includes('ttf_story_body: The old float failed and flooded a hallway.'))
    assert(notes[0].includes('ttf_damage_impact: Ceiling stain and service call'))
    assert.strictEqual(opportunities.length, 1)
    assert.deepStrictEqual(opportunities[0].customFields, [
      { id: 'field-audience', field_value: 'Contractor' },
    ])
    assert(result.warnings.some((warning) => warning.stage === 'partialOpportunityCustomFieldsResolved'))
    assert(requests.some((request) => request.path === '/contacts/contact-1/notes'))
  } finally {
    global.fetch = originalFetch
    Module._extensions['.js'] = originalJsLoader
  }
}

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  }
}

run()
  .then(() => {
    console.log('✅ partial Opportunity field fallback test passed')
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
