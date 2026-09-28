/**
 * Uploads a data-URL image to Salesforce as a ContentVersion and returns its ContentDocumentId.
 * Ported from the Azure rebuild's api/src/lib/salesforce-media.ts.
 *
 * GoHighLevel returned a public CDN URL; Salesforce stores files as records that are not
 * publicly addressable, so what comes back is an id rather than a link.
 */

const { createRecord, query, soqlString } = require('./salesforce-client')

const MAX_BYTES = 5 * 1024 * 1024

class MediaUploadError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'MediaUploadError'
  }
}

// Raster formats only — the practical set browsers produce for a photo input. SVG is
// deliberately absent: it's a script container, and a file served back to a reviewer could
// execute embedded markup wherever it is rendered.
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// The declared content-type is attacker-controlled; the decoded bytes must carry the
// declared format's signature. WebP needs two checks: "RIFF" at 0 and "WEBP" at 8.
const MAGIC_BYTES = {
  'image/jpeg': [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  'image/png': [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] }],
  'image/webp': [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
  ],
  'image/gif': [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }],
}

function matchesSignature(buffer, mimeType) {
  return MAGIC_BYTES[mimeType].every(({ offset, bytes }) =>
    bytes.every((byte, i) => buffer[offset + i] === byte)
  )
}

// Salesforce record ids are 15 or 18 characters; ContentDocument ids start with 069. Used to
// tell a stored file id apart from any other value that might sit in the same field.
function isContentDocumentId(value) {
  return typeof value === 'string' && /^069[A-Za-z0-9]{12}([A-Za-z0-9]{3})?$/.test(value)
}

async function uploadImage(dataUrl, formType, options) {
  if (typeof dataUrl !== 'string') throw new MediaUploadError('Invalid image data')
  const commaIndex = dataUrl.indexOf(',')
  if (commaIndex < 0) throw new MediaUploadError('Invalid image data')

  const header = dataUrl.slice(0, commaIndex)
  const mimeMatch = header.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64$/)
  // The Hero core-upgrade modal accepts the non-standard 'image/jpg' client-side (this port only).
  const mimeType = mimeMatch && (mimeMatch[1] === 'image/jpg' ? 'image/jpeg' : mimeMatch[1])
  if (!mimeType) throw new MediaUploadError('Invalid image format')
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new MediaUploadError('Unsupported image type. Please upload a JPEG, PNG, WebP, or GIF.')
  }

  // Size-check from the base64 length before decoding — decoding first would allocate the
  // full oversized buffer just to reject it.
  const base64 = dataUrl.slice(commaIndex + 1)
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  const estimatedBytes = Math.floor((base64.length * 3) / 4) - padding
  if (estimatedBytes > MAX_BYTES) throw new MediaUploadError('File size exceeds 5MB limit')

  let buffer
  try {
    buffer = Buffer.from(base64, 'base64')
  } catch (_) {
    throw new MediaUploadError('Invalid base64 image data')
  }
  if (buffer.length === 0) throw new MediaUploadError('Invalid image data')
  if (buffer.length > MAX_BYTES) throw new MediaUploadError('File size exceeds 5MB limit')
  if (!matchesSignature(buffer, mimeType)) {
    throw new MediaUploadError("That file doesn't look like the image type it claims to be.")
  }

  const extension = (mimeType.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
  // formType is caller-supplied; keep only filename-safe characters.
  const prefix = String(formType || 'upload').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'upload'
  const fileName = `${prefix}-${Date.now()}.${extension}`

  // ContentVersion takes the base64 payload directly in VersionData, so this is an ordinary
  // JSON insert — no multipart body, unlike the GoHighLevel media endpoint.
  let versionId
  try {
    versionId = await createRecord(
      'ContentVersion',
      {
        Title: fileName,
        // PathOnClient is what gives Salesforce the file extension, and therefore whether it
        // renders a preview or offers a download.
        PathOnClient: fileName,
        VersionData: base64,
        Origin: 'H',
      },
      options
    )
  } catch (error) {
    // This message is shown to the visitor, so it must not carry Salesforce's error text
    // (object names, permission errors, record ids). The detail rides along as the cause.
    throw new MediaUploadError("We couldn't upload that photo. Please try again.", { cause: error })
  }

  // The ContentDocumentId is assigned by Salesforce when the version is created, and is the
  // durable handle — a later version of the same file keeps it, the version id does not.
  const rows = await query(
    `SELECT ContentDocumentId FROM ContentVersion WHERE Id = ${soqlString(versionId)}`,
    options
  )
  const documentId = rows[0] && rows[0].ContentDocumentId
  if (!documentId) throw new MediaUploadError('Image upload returned no document id')

  return documentId
}

// Attaches an uploaded file to a record so it appears in that record's Files related list.
// Separate from uploadImage because the photo is uploaded before the record exists — there is
// nothing to link to until the Opportunity has been created.
async function linkFileToRecord(contentDocumentId, recordId, options) {
  await createRecord(
    'ContentDocumentLink',
    {
      ContentDocumentId: contentDocumentId,
      LinkedEntityId: recordId,
      // Viewer access, shared with everyone who can see the record.
      ShareType: 'V',
      Visibility: 'AllUsers',
    },
    options
  )
}

module.exports = {
  uploadImage,
  linkFileToRecord,
  isContentDocumentId,
  MediaUploadError,
}
