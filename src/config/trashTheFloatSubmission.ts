/**
 * Trash the Float — story form submission constants.
 *
 * Routed through `/.netlify/functions/validate-form-submission` like Contact,
 * Municipal Quick Intake, and Core Upgrade forms. Backend team: see
 * `netlify/functions/utils/ghl-field-map.js` → `trash-the-float-story`.
 */

export const TRASH_THE_FLOAT_FORM_NAME = 'trash-the-float-story' as const
export const TRASH_THE_FLOAT_FORM_TYPE = 'trash-the-float-story' as const

/** reCAPTCHA v3 action — must match server expectation (`form-type` with `-` → `_`). */
export const TRASH_THE_FLOAT_RECAPTCHA_ACTION = 'trash_the_float_story' as const

export const TRASH_THE_FLOAT_SUBMIT_ENDPOINT = '/.netlify/functions/validate-form-submission' as const
export const TRASH_THE_FLOAT_UPLOAD_ENDPOINT = '/.netlify/functions/upload-image' as const

export type TrashTheFloatStoryPayload = {
  fullName: string
  email: string
  phone?: string
  cityState: string
  instagramHandle: string
  audience: string
  storyTitle: string
  storyBody: string
  damageImpact?: string
  consent: true
  rules: true
}

export type TrashTheFloatHoneypotValues = {
  botField: string
  honeypot1: string
  honeypot2: string
}
