const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { getSecurityHeaders } = require('./utils/cors-config')
const { uploadImage, MediaUploadError } = require('./utils/salesforce-media')

// Stores the photo in Salesforce Files (ContentVersion) and returns its ContentDocumentId.
// The form submission then carries that id as photoUrl / mediaUrl, and salesforce-forms links
// the file to the Opportunity it creates.
//
// The id is returned as `imageUrl` so the existing frontend callers (Hero core-upgrade modal,
// Trash the Float) work unchanged — Salesforce files have no public URL.

// Keeps upload filenames recognisable in Salesforce Files.
const FILENAME_PREFIXES = {
  'trash-the-float-story': 'ttf-story',
  'core-upgrade': 'core-upgrade',
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
    const body = JSON.parse(event.body || '{}')
    const { imageData, formType } = body

    if (!imageData || typeof imageData !== 'string' || !imageData.startsWith('data:image/')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid image format. Expected data URL.' }),
      }
    }

    const prefix = FILENAME_PREFIXES[formType] || 'upload'

    let documentId
    try {
      documentId = await uploadImage(imageData, prefix)
    } catch (uploadError) {
      console.error('❌ Salesforce image upload failed:', {
        name: uploadError && uploadError.name,
        message: uploadError && uploadError.message,
        cause: uploadError && uploadError.cause && uploadError.cause.message,
        formType: formType || '(none)',
      })
      // MediaUploadError messages are written for the visitor; anything else is not.
      const isVisitorFacing = uploadError instanceof MediaUploadError
      return {
        statusCode: isVisitorFacing ? 400 : 500,
        headers,
        body: JSON.stringify({
          error: isVisitorFacing ? uploadError.message : 'Image upload failed',
          message: isVisitorFacing ? uploadError.message : 'Please try again or contact support',
        }),
      }
    }

    console.log('📸 Image uploaded to Salesforce Files:', {
      contentDocumentId: documentId,
      formType: formType || '(none)',
      ip,
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageUrl: documentId,
        fileId: documentId,
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
