const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { getSecurityHeaders } = require('./utils/cors-config')

// GHL Media Library config — same PIT/location used by every other GHL call in this project.
const GHL_BASE_URL = process.env.GHL_API_BASE_URL || 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'
const GHL_PIT_TOKEN = process.env.GHL_PIT_TOKEN
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID

// Optional per-form folder routing — values are GHL Media folder IDs (parentId in /medias).
// Add more env vars here as new forms get their own folder.
const FORM_FOLDER_ENV = {
  'trash-the-float-story': 'GHL_TTF_MEDIA_FOLDER_ID',
  'core-upgrade': 'GHL_CORE_UPGRADE_MEDIA_FOLDER_ID',
}

function resolveFolderId(formType) {
  const envVar = FORM_FOLDER_ENV[formType]
  if (!envVar) return ''
  return process.env[envVar] || ''
}

function extensionFromMime(mime) {
  if (!mime) return 'bin'
  const sub = mime.split('/')[1] || 'bin'
  if (sub === 'jpeg') return 'jpg'
  return sub.replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'bin'
}

exports.handler = async (event, context) => {
  const headers = getSecurityHeaders(event)

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const ip = getClientIP(event)
  const rateLimitResult = await checkRateLimit(ip, 'form', context)
  if (!rateLimitResult.allowed) {
    return {
      statusCode: 429,
      headers: { ...headers, ...getRateLimitHeaders(rateLimitResult) },
      body: JSON.stringify({
        error: 'Too many form submissions. Please wait and try again.',
        retryAfter: rateLimitResult.retryAfter,
      }),
    }
  }

  try {
    if (!GHL_PIT_TOKEN || !GHL_LOCATION_ID) {
      console.error('❌ GHL credentials missing — set GHL_PIT_TOKEN and GHL_LOCATION_ID')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Image upload service not configured',
          message: 'Please contact support',
        }),
      }
    }

    const body = JSON.parse(event.body || '{}')
    const { imageData, formType } = body

    if (!imageData || typeof imageData !== 'string' || !imageData.startsWith('data:image/')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid image format. Expected data URL.' }),
      }
    }

    const commaIdx = imageData.indexOf(',')
    const meta = imageData.slice(5, commaIdx) // strip "data:" + everything before ","
    const base64Data = imageData.slice(commaIdx + 1)
    const mimeMatch = /^([a-z]+\/[a-z0-9.+-]+)/i.exec(meta)
    const mime = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg'

    let imageBuffer
    try {
      imageBuffer = Buffer.from(base64Data, 'base64')
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid base64 image data' }),
      }
    }

    const maxSize = 5 * 1024 * 1024
    if (imageBuffer.length > maxSize) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'File size exceeds 5MB limit' }),
      }
    }

    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).slice(2, 8)
    const FILENAME_PREFIXES = {
      'trash-the-float-story': 'ttf-story',
      'core-upgrade': 'core-upgrade',
    }
    const prefix = FILENAME_PREFIXES[formType] || 'upload'
    const filename = `${prefix}-${timestamp}-${randomStr}.${extensionFromMime(mime)}`

    const folderId = resolveFolderId(formType)

    const form = new FormData()
    form.append('hosted', 'false')
    form.append('name', filename)
    if (folderId) form.append('parentId', folderId)
    form.append('file', new Blob([imageBuffer], { type: mime }), filename)

    let uploadResponse
    try {
      uploadResponse = await fetch(`${GHL_BASE_URL}/medias/upload-file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GHL_PIT_TOKEN}`,
          Version: GHL_API_VERSION,
        },
        body: form,
      })
    } catch (fetchError) {
      console.error('❌ Fetch error calling GHL Media:', {
        message: fetchError.message,
        name: fetchError.name,
      })
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Image upload failed',
          message: 'Network error connecting to media service',
        }),
      }
    }

    const responseText = await uploadResponse.text()
    let uploadResult
    try {
      uploadResult = JSON.parse(responseText)
    } catch {
      console.error('❌ Failed to parse GHL Media response:', {
        status: uploadResponse.status,
        responseText: responseText.slice(0, 500),
      })
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Image upload failed',
          message: 'Invalid response from media service',
        }),
      }
    }

    if (!uploadResponse.ok || !uploadResult.url) {
      console.error('❌ GHL Media upload error:', {
        status: uploadResponse.status,
        responseBody: uploadResult,
      })
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Image upload failed',
          message: uploadResult.message || uploadResult.error || 'Failed to upload image',
        }),
      }
    }

    console.log('📸 Image uploaded to GHL Media:', {
      fileId: uploadResult.fileId,
      url: uploadResult.url,
      formType: formType || '(none)',
      folderId: folderId || '(root)',
      size: imageBuffer.length,
      mime,
      ip,
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageUrl: uploadResult.url,
        fileId: uploadResult.fileId,
        size: imageBuffer.length,
      }),
    }
  } catch (error) {
    console.error('❌ Image upload error (catch):', {
      message: error.message,
      name: error.name,
    })
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Image upload failed',
        message: 'An error occurred processing your image',
      }),
    }
  }
}
