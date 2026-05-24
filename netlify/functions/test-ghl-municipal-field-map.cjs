const assert = require('node:assert/strict')

const {
  customFieldTypes,
  getFormConfig,
} = require('./utils/ghl-field-map')
const {
  invalidateContactFieldCache,
  invalidateOpportunityFieldCache,
  submitOpportunityForm,
} = require('./utils/ghl-client')

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  }
}

async function testMunicipalOpportunityKeysUseGhlSlugs() {
  const config = getFormConfig('municipal-intake')
  const opportunityKeys = config.opportunityCustomFields.map(([key]) => key)
  const expectedSluggedKeys = [
    'parish__county',
    'primary_contact_title__role',
    'secondary_contact_title__role',
    'number_of_facilities__buildings',
    'existing_drain__overflow_monitoring_systems',
    'attended_boaf_or_coaa_event',
    'notes__special_requirements',
  ]

  for (const key of expectedSluggedKeys) {
    assert.ok(opportunityKeys.includes(key), `${key} must be submitted to GHL`)
    assert.ok(customFieldTypes[key], `${key} must have a configured field type`)
  }

  assert.ok(!opportunityKeys.includes('parish_county'))
  assert.ok(!opportunityKeys.includes('attended_boafncoaa_event'))
}

async function testPartialOpportunityResolutionAddsFallbackNote() {
  invalidateContactFieldCache()
  invalidateOpportunityFieldCache()

  process.env.GHL_PIT_TOKEN = 'test-token'
  process.env.GHL_LOCATION_ID = 'test-location'
  process.env.GHL_MUNI_PIPELINE_ID = 'pipeline-1'
  process.env.GHL_MUNI_PIPELINE_STAGE_ID = 'stage-1'

  const calls = []
  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options })

    if (url.includes('/customFields?model=contact')) {
      return jsonResponse({ customFields: [] })
    }
    if (url.includes('/contacts/upsert')) {
      return jsonResponse({ contact: { id: 'contact-1' }, new: true })
    }
    if (url.includes('/contacts/contact-1/tags')) {
      return jsonResponse({})
    }
    if (url.includes('/customFields?model=opportunity')) {
      return jsonResponse({
        customFields: [
          { fieldKey: 'opportunity.municipality_name', id: 'field-municipality' },
        ],
      })
    }
    if (url.includes('/contacts/contact-1/notes')) {
      return jsonResponse({ note: { id: 'note-1' } })
    }
    if (url.includes('/opportunities/')) {
      return jsonResponse({ opportunity: { id: 'opportunity-1' } })
    }

    throw new Error(`Unexpected request: ${url}`)
  }

  const config = getFormConfig('municipal-intake')
  const result = await submitOpportunityForm('municipal-intake', {
    firstName: 'Mina',
    lastName: 'Lead',
    email: 'mina@example.com',
    phone: '5555551212',
    municipalityName: 'Sample City',
    parishCounty: 'Orange',
  }, config)

  assert.equal(result.opportunityId, 'opportunity-1')
  assert.ok(
    result.warnings.some((warning) => warning.stage === 'missingOpportunityCustomFields'),
    'partial Opportunity field resolution should warn and write a fallback note'
  )

  const noteCall = calls.find((call) => call.url.includes('/contacts/contact-1/notes'))
  assert.ok(noteCall, 'fallback note should be written')
  const notePayload = JSON.parse(noteCall.options.body)
  assert.match(notePayload.body, /municipality_name: Sample City/)
  assert.match(notePayload.body, /parish__county: Orange/)

  const opportunityCall = calls.find((call) => call.url.includes('/opportunities/'))
  assert.ok(opportunityCall, 'Opportunity should still be created with resolved fields')
  const opportunityPayload = JSON.parse(opportunityCall.options.body)
  assert.deepEqual(opportunityPayload.customFields, [
    { id: 'field-municipality', field_value: 'Sample City' },
  ])
}

async function run() {
  await testMunicipalOpportunityKeysUseGhlSlugs()
  await testPartialOpportunityResolutionAddsFallbackNote()
  console.log('GHL municipal field-map tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
