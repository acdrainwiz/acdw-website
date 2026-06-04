import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IMaskInput } from 'react-imask'
import { cn } from '@/lib/utils'
import { TtfOfficialRulesLink } from '@/components/campaign/TtfOfficialRulesLink'
import { TtfStoryPhotoExamples } from '@/components/campaign/TtfStoryPhotoExamples'
import { TRASH_THE_FLOAT } from '@/config/trashTheFloatCopy'
import {
  TRASH_THE_FLOAT_FORM_NAME,
  TRASH_THE_FLOAT_FORM_TYPE,
  TRASH_THE_FLOAT_RECAPTCHA_ACTION,
} from '@/config/trashTheFloatSubmission'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { submitTrashTheFloatStory, normalizeInstagramHandle } from '@/services/submitTrashTheFloatStory'
import { isLocalDevEnvironment } from '@/utils/isLocalDevEnvironment'

const AUDIENCE_OPTIONS = [
  'Contractor',
  'Homeowner',
  'Property Manager',
  'Distributor',
  'Other',
] as const

const TTF_ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'] as const

function normalizeHandleKey(raw: string): string {
  return raw.trim().replace(/^@+/, '').toLowerCase()
}

const VALIDATION_ERROR_FIELD_ORDER: (keyof StoryFormValues)[] = [
  'fullName',
  'email',
  'phone',
  'cityState',
  'instagramHandle',
  'audience',
  'storyBody',
  'damageImpact',
  'consent',
  'rules',
]

function firstValidationErrorMessage(errors: FieldErrors<StoryFormValues>): string {
  for (const key of VALIDATION_ERROR_FIELD_ORDER) {
    const message = errors[key]?.message
    if (typeof message === 'string' && message.length > 0) return message
  }
  return 'Please review the required fields above and try again.'
}

function createStorySchema(usedInstagramHandles: string[]) {
  const usedKeys = new Set(usedInstagramHandles.map(normalizeHandleKey))

  return z.object({
    fullName: z.string().min(2, 'Please enter your full name'),
    email: z.string().email('Enter a valid email address'),
    phone: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((value) => {
        if (!value || value.trim() === '') return true
        return value.replace(/\D/g, '').length >= 10
      }, 'Please enter a valid phone number'),
    cityState: z.string().min(2, 'City and state help us verify eligibility'),
    instagramHandle: z
      .string()
      .min(1, 'Instagram handle is required')
      .max(31, 'Keep your handle under 30 characters')
      .refine((value) => {
        const handle = value.trim().replace(/^@+/, '')
        return /^[a-zA-Z0-9._]{1,30}$/.test(handle)
      }, 'Enter a valid Instagram handle (letters, numbers, periods, underscores)')
      .refine((value) => !usedKeys.has(normalizeHandleKey(value)), {
        message:
          'Each story needs its own Instagram handle. Use a different handle than your previous submission.',
      }),
    audience: z.enum(AUDIENCE_OPTIONS, {
      message: 'Pick the option that best describes you',
    }),
    storyBody: z.string().min(30, 'Tell us a bit more — at least 30 characters'),
    damageImpact: z
      .string()
      .max(500, 'Keep this under 500 characters')
      .optional()
      .or(z.literal('')),
    consent: z.literal(true, {
      message: 'Please confirm your story is true and you give us permission to review it',
    }),
    rules: z.literal(true, {
      message: 'Please agree to the Official Rules and Privacy Policy',
    }),
  })
}

type StoryFormValues = z.infer<ReturnType<typeof createStorySchema>>

/**
 * Trash the Float story submission form.
 *
 * Submits via `submitTrashTheFloatStory` → `/.netlify/functions/validate-form-submission`
 * (same pipeline as Contact, Municipal Quick Intake, Core Upgrade).
 */
type StorySubmissionFormProps = {
  /** Light theme for the cream #submit-story editorial plate on the landing page. */
  theme?: 'dark' | 'light'
  /** Handles already used this session — blocks duplicate entries on re-submit. */
  usedInstagramHandles?: string[]
  /** When true, show callout above Instagram field (after re-entry gate). */
  showInstagramReuseHint?: boolean
  onSuccess?: (instagramHandle: string) => void
}

export function StorySubmissionForm({
  theme = 'dark',
  usedInstagramHandles = [],
  showInstagramReuseHint = false,
  onSuccess,
}: StorySubmissionFormProps) {
  const isLight = theme === 'light'
  const storySchema = useMemo(
    () => createStorySchema(usedInstagramHandles),
    [usedInstagramHandles],
  )
  const { getRecaptchaToken } = useRecaptcha()
  const [formError, setFormError] = useState('')
  const formErrorRef = useRef<HTMLParagraphElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [formLoadTime] = useState(() => Date.now())
  const botFieldRef = useRef<HTMLInputElement>(null)
  const honeypot1Ref = useRef<HTMLInputElement>(null)
  const honeypot2Ref = useRef<HTMLInputElement>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      cityState: '',
      instagramHandle: '',
      storyBody: '',
      damageImpact: '',
    },
  })

  const showFormError = (message: string) => {
    setFormError(message)
    requestAnimationFrame(() => {
      formErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  const onInvalid = (fieldErrors: FieldErrors<StoryFormValues>) => {
    showFormError(firstValidationErrorMessage(fieldErrors))
  }

  const onSubmit = async (values: StoryFormValues) => {
    setFormError('')

    let recaptchaToken = ''
    if (!isLocalDevEnvironment()) {
      const recaptchaResult = await getRecaptchaToken(TRASH_THE_FLOAT_RECAPTCHA_ACTION)
      if (!recaptchaResult.success) {
        showFormError(recaptchaResult.error)
        return
      }
      recaptchaToken = recaptchaResult.token
    }

    const result = await submitTrashTheFloatStory({
      ...values,
      formLoadTime,
      recaptchaToken,
      honeypot: {
        botField: botFieldRef.current?.value ?? '',
        honeypot1: honeypot1Ref.current?.value ?? '',
        honeypot2: honeypot2Ref.current?.value ?? '',
      },
      mediaFile,
    })

    if (!result.ok) {
      showFormError(result.error)
      return
    }

    onSuccess?.(normalizeInstagramHandle(values.instagramHandle))
    reset()
    setFileName(null)
    setMediaFile(null)
    setFormError('')
  }

  useEffect(() => {
    if (!formError) return
    if (Object.keys(errors).length === 0) setFormError('')
  }, [errors, formError])

  useEffect(() => {
    const subscription = watch(() => {
      if (!formError) return
      if (Object.keys(errors).length > 0) return
      setFormError('')
    })
    return () => subscription.unsubscribe()
  }, [watch, errors, formError])

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      name={TRASH_THE_FLOAT_FORM_NAME}
      data-netlify-honeypot="bot-field"
      className={isLight ? 'ttf-form-card' : 'campaign-card p-5 sm:p-7 text-white'}
    >
      <input type="hidden" name="form-name" value={TRASH_THE_FLOAT_FORM_NAME} />
      <input type="hidden" name="form-type" value={TRASH_THE_FLOAT_FORM_TYPE} />

      <div style={{ display: 'none' }} aria-hidden="true">
        <input ref={botFieldRef} type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
        <input ref={honeypot1Ref} type="text" name="honeypot-1" tabIndex={-1} autoComplete="off" />
        <input ref={honeypot2Ref} type="text" name="honeypot-2" tabIndex={-1} autoComplete="off" />
      </div>

      {isLight ? <p className="ttf-form-kicker">Step 1 of 1 — Your story</p> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={errors.fullName?.message} htmlFor="ttf-fullName">
          <input
            id="ttf-fullName"
            type="text"
            autoComplete="name"
            aria-required
            aria-invalid={Boolean(errors.fullName)}
            {...register('fullName')}
            className={inputClass(Boolean(errors.fullName))}
          />
        </Field>

        <Field label="Email" required error={errors.email?.message} htmlFor="ttf-email">
          <input
            id="ttf-email"
            type="email"
            autoComplete="email"
            aria-required
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
            className={inputClass(Boolean(errors.email))}
          />
        </Field>

        <Field label="Phone" error={errors.phone?.message} htmlFor="ttf-phone">
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <IMaskInput
                mask="(000) 000-0000"
                type="tel"
                id="ttf-phone"
                name="phone"
                autoComplete="tel"
                inputRef={ref}
                value={value ?? ''}
                onAccept={(maskedValue) => onChange(maskedValue)}
                onBlur={onBlur}
                placeholder="(555) 123-4567"
                aria-invalid={Boolean(errors.phone)}
                className={inputClass(Boolean(errors.phone))}
                unmask={false}
              />
            )}
          />
        </Field>

        <Field
          label="City / State"
          required
          error={errors.cityState?.message}
          htmlFor="ttf-cityState"
        >
          <input
            id="ttf-cityState"
            type="text"
            autoComplete="address-level2"
            placeholder="Miami, FL"
            aria-required
            aria-invalid={Boolean(errors.cityState)}
            {...register('cityState')}
            className={inputClass(Boolean(errors.cityState))}
          />
        </Field>
      </div>

      <div className="mt-4">
        {showInstagramReuseHint && usedInstagramHandles.length > 0 ? (
          <div className="ttf-form-instagram-reuse-hint" role="note">
            <p>{TRASH_THE_FLOAT.landing.sectionSuccess.instagramReuseHint}</p>
            <p className="ttf-form-instagram-reuse-handles">
              Already used: {usedInstagramHandles.join(', ')}
            </p>
          </div>
        ) : null}
        <Field
          label={TRASH_THE_FLOAT.landing.form.instagramHandle.label}
          required
          hint={TRASH_THE_FLOAT.landing.form.instagramHandle.hint}
          error={errors.instagramHandle?.message}
          htmlFor="ttf-instagramHandle"
        >
          <input
            id="ttf-instagramHandle"
            type="text"
            autoComplete="off"
            inputMode="text"
            spellCheck={false}
            placeholder={TRASH_THE_FLOAT.landing.form.instagramHandle.placeholder}
            aria-required
            aria-invalid={Boolean(errors.instagramHandle)}
            {...register('instagramHandle')}
            className={inputClass(Boolean(errors.instagramHandle))}
          />
        </Field>
        <p className="ttf-form-hint mt-2">
          {TRASH_THE_FLOAT.landing.form.instagramHandle.followPromptBefore}
          <a
            href={TRASH_THE_FLOAT.instagram.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'font-semibold underline underline-offset-2',
              isLight ? 'text-primary-700 hover:text-primary-800' : 'text-[var(--acdw-orange)] hover:text-white',
            )}
          >
            {TRASH_THE_FLOAT.instagram.handle}
          </a>
          {TRASH_THE_FLOAT.landing.form.instagramHandle.followPromptAfter}
        </p>
      </div>

      <fieldset className="mt-5">
        <legend className="ttf-form-label">I am a</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {AUDIENCE_OPTIONS.map((opt) => (
            <label key={opt} className="ttf-form-audience-chip">
              <input type="radio" value={opt} {...register('audience')} className="sr-only" />
              {opt}
            </label>
          ))}
        </div>
        {errors.audience?.message ? (
          <p className="campaign-field-error">{errors.audience.message}</p>
        ) : null}
      </fieldset>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <Field
          label="Tell us what happened"
          required
          featured
          error={errors.storyBody?.message}
          htmlFor="ttf-body"
        >
          <textarea
            id="ttf-body"
            rows={6}
            placeholder="What did the float do — or fail to do? Walk us through what you found, what it took to resolve, and what it cost in time, callbacks, or trust."
            aria-required
            aria-invalid={Boolean(errors.storyBody)}
            {...register('storyBody')}
            className={cn(
              inputClass(Boolean(errors.storyBody)),
              'ttf-form-input--textarea',
              'ttf-form-input--story',
            )}
          />
        </Field>

        <Field
          label="Estimated damage or impact"
          optional
          hint="Dollars, callbacks, hours, customer churn, etc."
          error={errors.damageImpact?.message}
          htmlFor="ttf-impact"
        >
          <input
            id="ttf-impact"
            type="text"
            placeholder="e.g., $2,400 ceiling repair + 2 follow-up visits"
            aria-invalid={Boolean(errors.damageImpact)}
            {...register('damageImpact')}
            className={inputClass(Boolean(errors.damageImpact))}
          />
        </Field>

        <div>
          <label htmlFor="ttf-upload" className="ttf-form-label">
            {TRASH_THE_FLOAT.landing.uploadExamples.uploadLabel}{' '}
            <span className="ttf-form-label-optional">(optional)</span>
          </label>

          <TtfStoryPhotoExamples
            variant="form"
            title={TRASH_THE_FLOAT.landing.uploadExamples.title}
            hint={TRASH_THE_FLOAT.landing.uploadExamples.hint}
            photos={TRASH_THE_FLOAT.overlay.storyContext.photos}
            caption={TRASH_THE_FLOAT.overlay.storyContext.caption}
          />

          <input
            id="ttf-upload"
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            aria-invalid={Boolean(formError)}
            aria-describedby={formError ? 'ttf-form-error' : undefined}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              if (
                file &&
                !TTF_ACCEPTED_IMAGE_TYPES.includes(
                  file.type as (typeof TTF_ACCEPTED_IMAGE_TYPES)[number],
                )
              ) {
                showFormError('Please choose a JPEG or PNG image.')
                e.target.value = ''
                setMediaFile(null)
                setFileName(null)
                return
              }
              setFormError('')
              setMediaFile(file)
              setFileName(file?.name ?? null)
            }}
            className={cn('ttf-form-upload', formError && 'ttf-form-upload--error')}
          />
          {formError ? (
            <p
              id="ttf-form-error"
              ref={formErrorRef}
              role="alert"
              className="campaign-field-error mt-1"
            >
              {formError}
            </p>
          ) : null}
          {fileName ? (
            <p className="ttf-form-filename">Selected: {fileName}</p>
          ) : (
            <p className="ttf-form-upload-hint">
              {TRASH_THE_FLOAT.landing.uploadExamples.acceptedFormats}{' '}
              {TRASH_THE_FLOAT.landing.uploadExamples.uploadOptionalNote}{' '}
              We'll never publish identifying details without your approval.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Checkbox id="ttf-consent" error={errors.consent?.message} {...register('consent')}>
          I confirm this story is true to the best of my knowledge and give AC Drain Wiz permission
          to review and publish my submission.
        </Checkbox>

        <Checkbox id="ttf-rules" error={errors.rules?.message} {...register('rules')}>
          I agree to the{' '}
          <TtfOfficialRulesLink
            className={cn(
              'underline underline-offset-2',
              isLight
                ? 'decoration-primary-600/50 hover:text-primary-700'
                : 'decoration-[var(--acdw-orange)]/60 hover:text-[var(--acdw-orange)]',
            )}
          />{' '}
          and{' '}
          <a
            href="/privacy-policy"
            className={cn(
              'underline underline-offset-2',
              isLight
                ? 'decoration-primary-600/50 hover:text-primary-700'
                : 'decoration-[var(--acdw-orange)]/60 hover:text-[var(--acdw-orange)]',
            )}
          >
            Privacy Policy
          </a>
          .
        </Checkbox>
      </div>

      <div className="ttf-form-submit-band">
        <div className="ttf-form-footer">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'campaign-cta-primary rounded-xl px-6 py-3 text-sm sm:text-base',
              isLight && 'font-semibold',
              !isLight && 'px-5',
            )}
          >
            {isSubmitting ? 'Submitting…' : 'Submit My Story'}
          </button>
          <p
            className={cn(
              'text-xs',
              isLight ? 'text-[rgba(0,26,53,0.55)]' : 'text-white/50',
            )}
          >
            We'll never sell your contact info. See our{' '}
            <a
              href="/privacy-policy"
              className={cn(
                'underline underline-offset-2',
                isLight ? 'hover:text-[var(--acdw-navy)]' : 'hover:text-white/80',
              )}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </form>
  )
}

function inputClass(hasError: boolean) {
  return cn('ttf-form-input', hasError && 'ttf-form-input--error')
}

interface FieldProps {
  label: string
  htmlFor: string
  required?: boolean
  optional?: boolean
  featured?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}

function Field({ label, htmlFor, required, optional, featured, hint, error, children }: FieldProps) {
  return (
    <div className={cn(featured && 'ttf-form-story-field')}>
      <label htmlFor={htmlFor} className="ttf-form-label">
        {label}
        {required ? <span className="ttf-form-label-required">*</span> : null}
        {optional ? <span className="ttf-form-label-optional"> (optional)</span> : null}
      </label>
      {hint ? <p className="ttf-form-hint">{hint}</p> : null}
      {children}
      {error ? <p className="campaign-field-error">{error}</p> : null}
    </div>
  )
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  error?: string
  children: React.ReactNode
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, error, children, ...rest },
  ref,
) {
  return (
    <div>
      <label htmlFor={id} className="ttf-form-checkbox-label">
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className="ttf-form-checkbox"
          {...rest}
        />
        <span>{children}</span>
      </label>
      {error ? <p className="campaign-field-error ml-7">{error}</p> : null}
    </div>
  )
})
