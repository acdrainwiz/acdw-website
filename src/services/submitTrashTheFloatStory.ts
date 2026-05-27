import {
  TRASH_THE_FLOAT_FORM_NAME,
  TRASH_THE_FLOAT_FORM_TYPE,
  TRASH_THE_FLOAT_RECAPTCHA_ACTION,
  TRASH_THE_FLOAT_SUBMIT_ENDPOINT,
  TRASH_THE_FLOAT_UPLOAD_ENDPOINT,
  type TrashTheFloatHoneypotValues,
  type TrashTheFloatStoryPayload,
} from '@/config/trashTheFloatSubmission'
import { isLocalDevEnvironment } from '@/utils/isLocalDevEnvironment'

export type SubmitTrashTheFloatStoryInput = TrashTheFloatStoryPayload & {
  formLoadTime: number
  recaptchaToken: string
  honeypot: TrashTheFloatHoneypotValues
  mediaFile?: File | null
}

export type SubmitTrashTheFloatStoryResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: string[] }

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim()
  const space = trimmed.indexOf(' ')
  if (space === -1) return { firstName: trimmed, lastName: '.' }
  return {
    firstName: trimmed.slice(0, space),
    lastName: trimmed.slice(space + 1).trim() || '.',
  }
}

function isHoneypotTripped(honeypot: TrashTheFloatHoneypotValues): boolean {
  return Boolean(honeypot.botField || honeypot.honeypot1 || honeypot.honeypot2)
}

async function uploadStoryImage(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!file.type.startsWith('image/')) {
    return {
      ok: false,
      error: 'Video upload is not supported yet. Please attach a photo, or submit without media for now.',
    }
  }

  const base64DataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

  try {
    const response = await fetch(TRASH_THE_FLOAT_UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData: base64DataUrl, formType: TRASH_THE_FLOAT_FORM_TYPE }),
    })
    const data = (await response.json()) as { success?: boolean; imageUrl?: string; error?: string; message?: string }

    if (!response.ok || !data.success || !data.imageUrl) {
      return {
        ok: false,
        error: data.error || data.message || 'Failed to upload image. Please try again.',
      }
    }

    return { ok: true, url: data.imageUrl }
  } catch {
    return { ok: false, error: 'Network error during image upload. Please try again.' }
  }
}

function normalizeInstagramHandle(raw: string): string {
  const handle = raw.trim().replace(/^@+/, '')
  return handle ? `@${handle}` : ''
}

function buildSubmissionBody(
  input: SubmitTrashTheFloatStoryInput,
  mediaUrl: string,
): Record<string, string> {
  const { firstName, lastName } = splitFullName(input.fullName)

  return {
    'form-name': TRASH_THE_FLOAT_FORM_NAME,
    'form-type': TRASH_THE_FLOAT_FORM_TYPE,
    firstName,
    lastName,
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || '',
    cityState: input.cityState.trim(),
    city: input.cityState.trim(),
    instagramHandle: normalizeInstagramHandle(input.instagramHandle),
    audience: input.audience,
    storyBody: input.storyBody.trim(),
    message: input.storyBody.trim(),
    damageImpact: input.damageImpact?.trim() || '',
    mediaUrl,
    consent: input.consent ? 'yes' : 'no',
    rulesConsent: input.rules ? 'yes' : 'no',
    'form-load-time': String(input.formLoadTime),
    'recaptcha-token': input.recaptchaToken,
    'bot-field': input.honeypot.botField,
    'honeypot-1': input.honeypot.honeypot1,
    'honeypot-2': input.honeypot.honeypot2,
  }
}

/**
 * Submit a Trash the Float story through the shared Netlify validation function.
 * Matches Contact / Municipal Quick Intake / Core Upgrade routing.
 */
export async function submitTrashTheFloatStory(
  input: SubmitTrashTheFloatStoryInput,
): Promise<SubmitTrashTheFloatStoryResult> {
  if (isHoneypotTripped(input.honeypot)) {
    console.warn('[trash-the-float] honeypot tripped')
    return { ok: false, error: 'Invalid submission detected.' }
  }

  let mediaUrl = ''
  if (input.mediaFile) {
    const upload = await uploadStoryImage(input.mediaFile)
    if (!upload.ok) return { ok: false, error: upload.error }
    mediaUrl = upload.url
  }

  const submissionData = buildSubmissionBody(input, mediaUrl)

  if (isLocalDevEnvironment()) {
    console.log('[DEV MODE] Trash the Float story submission simulated:', {
      ...submissionData,
      recaptchaAction: TRASH_THE_FLOAT_RECAPTCHA_ACTION,
      mediaUrl: mediaUrl || '(none)',
    })
    await new Promise((r) => setTimeout(r, 800))
    return { ok: true }
  }

  try {
    const response = await fetch(TRASH_THE_FLOAT_SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(submissionData).toString(),
    })

    const responseData = (await response.json()) as {
      success?: boolean
      message?: string
      error?: string
      errors?: string[]
    }

    if (response.ok && responseData.success) {
      return { ok: true }
    }

    const fieldErrors = Array.isArray(responseData.errors) ? responseData.errors : undefined
    return {
      ok: false,
      error:
        responseData.message ||
        responseData.error ||
        fieldErrors?.[0] ||
        'Failed to submit your story. Please try again.',
      fieldErrors,
    }
  } catch (error) {
    console.error('[trash-the-float] submission error:', error)
    return { ok: false, error: 'Network error. Please check your connection and try again.' }
  }
}
