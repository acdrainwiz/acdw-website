import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useRecaptcha } from '../hooks/useRecaptcha'
import { validateEmail } from '../utils/emailValidation'

export function EmailPreferencesPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { getRecaptchaToken } = useRecaptcha()

    const searchParams = new URLSearchParams(location.search)
    const emailParam = searchParams.get('email') || ''

    const [email, setEmail] = useState(emailParam)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [preferences, setPreferences] = useState({
        productUpdates: true,
        promotions: true,
        newsletter: true,
        orderUpdates: true,
        supportEmails: true
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [formLoadTime] = useState(Date.now())

    const handlePreferenceChange = (key: keyof typeof preferences) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (emailError) {
            setEmailError(null)
        }
    }

    const handleEmailBlur = () => {
        const error = validateEmail(email)
        setEmailError(error)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError('')
        setEmailError(null)

        const emailValidationError = validateEmail(email)
        if (emailValidationError) {
            setEmailError(emailValidationError)
            setIsSubmitting(false)
            return
        }

        const botField = (document.querySelector('input[name="bot-field"]') as HTMLInputElement)?.value
        const honeypot1 = (document.querySelector('input[name="website"]') as HTMLInputElement)?.value
        const honeypot2 = (document.querySelector('input[name="url"]') as HTMLInputElement)?.value

        if (botField || honeypot1 || honeypot2) {
            console.warn('Bot detected: honeypot fields were filled')
            setSubmitError('Invalid submission detected.')
            setIsSubmitting(false)
            return
        }

        const recaptchaResult = await getRecaptchaToken('email_preferences')
        if (!recaptchaResult.success) {
            setSubmitError(recaptchaResult.error)
            setIsSubmitting(false)
            return
        }

        const submissionData: Record<string, string> = {
            'form-name': 'ep-x7k9m2',
            'form-type': 'ep-x7k9m2',
            email: email.trim(),
            productUpdates: preferences.productUpdates ? 'yes' : 'no',
            promotions: preferences.promotions ? 'yes' : 'no',
            newsletter: preferences.newsletter ? 'yes' : 'no',
            orderUpdates: preferences.orderUpdates ? 'yes' : 'no',
            supportEmails: preferences.supportEmails ? 'yes' : 'no',
            'form-load-time': formLoadTime.toString(),
            'g-recaptcha-response': recaptchaResult.token
        }

        const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'

        try {
            let response: Response

            if (isDevelopment) {
                const emailPrefix = email ? email.substring(0, 3) + '***' : 'none'
                console.log('📝 [DEV MODE] Email preferences update simulated:', {
                    email: emailPrefix,
                    preferences,
                    data: { ...submissionData, email: emailPrefix }
                })
                await new Promise(resolve => setTimeout(resolve, 1000))
                response = new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    statusText: 'OK',
                    headers: { 'Content-Type': 'application/json' }
                })
            } else {
                const submitUrl = window.location.origin + '/.netlify/functions/validate-form-submission'
                response = await fetch(submitUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(submissionData).toString()
                })
            }

            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    setSubmitSuccess(true)
                    setTimeout(() => setSubmitSuccess(false), 5000)
                } else {
                    const errorMessage = result.errors
                        ? result.errors.join(', ')
                        : result.message || 'Something went wrong. Please try again.'
                    setSubmitError(errorMessage)
                    if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('valid')) {
                        setEmailError(errorMessage)
                    }
                }
            } else {
                const errorData = await response.json().catch(() => ({}))
                const errorMessage = errorData.errors
                    ? errorData.errors.join(', ')
                    : errorData.message || 'Something went wrong. Please try again.'
                setSubmitError(errorMessage)
                if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('valid')) {
                    setEmailError(errorMessage)
                }
            }
        } catch (error) {
            console.error('Form submission error:', error)
            setSubmitError('Network error. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUnsubscribeAll = () => {
        navigate(`/unsubscribe?email=${encodeURIComponent(email)}`)
    }

    return (
        <div className="email-preferences-container">
            <div className="email-preferences-wrapper">
                <div className="email-preferences-content">
                    <div className="email-preferences-header">
                        <div className="email-preferences-icon-wrapper">
                            <EnvelopeIcon className="email-preferences-icon" />
                        </div>
                        <h1 className="email-preferences-title">Email Preferences</h1>
                        <p className="email-preferences-subtitle">
                            Manage what emails you receive from AC Drain Wiz
                        </p>
                    </div>

                    <div className="email-preferences-form-container">
                        <form
                            onSubmit={handleSubmit}
                            name="ep-x7k9m2"
                            method="POST"
                            data-netlify="true"
                            netlify-honeypot="bot-field"
                            data-netlify-recaptcha="true"
                            noValidate
                        >
                            <input type="hidden" name="form-name" value="ep-x7k9m2" />
                            <input type="hidden" name="form-type" value="ep-x7k9m2" />
                            <div style={{ display: 'none' }}>
                                <label>
                                    Don't fill this out if you're human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                                </label>
                                <label>
                                    Leave this empty: <input name="website" tabIndex={-1} autoComplete="off" />
                                </label>
                                <label>
                                    Do not fill: <input name="url" tabIndex={-1} autoComplete="off" />
                                </label>
                            </div>

                            <div className="email-preferences-email-field">
                                <label htmlFor="email-preferences-email" className="email-preferences-email-label">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email-preferences-email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={handleEmailBlur}
                                    required
                                    className={`email-preferences-email-input ${emailError ? 'input-error' : ''}`}
                                    placeholder="your.email@example.com"
                                />
                                {emailError ? (
                                    <p className="email-preferences-email-error text-red-600 text-sm mt-1">
                                        {emailError}
                                    </p>
                                ) : (
                                    <p className="email-preferences-email-help">
                                        Enter the email address you used to sign up
                                    </p>
                                )}
                            </div>

                            <div className="email-preferences-selection-section">
                                <h2 className="email-preferences-selection-title">Select Your Preferences</h2>
                                <p className="email-preferences-selection-description">
                                    Choose which types of emails you'd like to receive from us
                                </p>

                                <div className="email-preferences-options-list">
                                    <label className="email-preferences-option email-preferences-option-selectable">
                                        <input
                                            type="checkbox"
                                            name="productUpdates"
                                            checked={preferences.productUpdates}
                                            onChange={() => handlePreferenceChange('productUpdates')}
                                            className="email-preferences-option-checkbox"
                                        />
                                        <div className="email-preferences-option-content">
                                            <div className="email-preferences-option-title">Product Updates</div>
                                            <div className="email-preferences-option-description">New product launches and feature announcements</div>
                                        </div>
                                    </label>

                                    <label className="email-preferences-option email-preferences-option-selectable">
                                        <input
                                            type="checkbox"
                                            name="promotions"
                                            checked={preferences.promotions}
                                            onChange={() => handlePreferenceChange('promotions')}
                                            className="email-preferences-option-checkbox"
                                        />
                                        <div className="email-preferences-option-content">
                                            <div className="email-preferences-option-title">Promotions & Discounts</div>
                                            <div className="email-preferences-option-description">Special offers and exclusive deals</div>
                                        </div>
                                    </label>

                                    <label className="email-preferences-option email-preferences-option-selectable">
                                        <input
                                            type="checkbox"
                                            name="newsletter"
                                            checked={preferences.newsletter}
                                            onChange={() => handlePreferenceChange('newsletter')}
                                            className="email-preferences-option-checkbox"
                                        />
                                        <div className="email-preferences-option-content">
                                            <div className="email-preferences-option-title">Newsletter</div>
                                            <div className="email-preferences-option-description">Tips, guides, and HVAC maintenance advice</div>
                                        </div>
                                    </label>

                                    <label className="email-preferences-option email-preferences-option-required">
                                        <input
                                            type="checkbox"
                                            name="orderUpdates"
                                            checked={preferences.orderUpdates}
                                            onChange={() => handlePreferenceChange('orderUpdates')}
                                            disabled
                                            className="email-preferences-option-checkbox email-preferences-option-checkbox-disabled"
                                        />
                                        <div className="email-preferences-option-content">
                                            <div className="email-preferences-option-title">Order Updates</div>
                                            <div className="email-preferences-option-description">Order confirmations, shipping updates, and receipts (required)</div>
                                        </div>
                                    </label>

                                    <label className="email-preferences-option email-preferences-option-required">
                                        <input
                                            type="checkbox"
                                            name="supportEmails"
                                            checked={preferences.supportEmails}
                                            onChange={() => handlePreferenceChange('supportEmails')}
                                            disabled
                                            className="email-preferences-option-checkbox email-preferences-option-checkbox-disabled"
                                        />
                                        <div className="email-preferences-option-content">
                                            <div className="email-preferences-option-title">Support Communications</div>
                                            <div className="email-preferences-option-description">Responses to your support requests and account updates (required)</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {submitSuccess && (
                                <div className="email-preferences-message email-preferences-message-success">
                                    <CheckCircleIcon className="email-preferences-message-icon" />
                                    <p className="email-preferences-message-text">
                                        Your preferences have been updated successfully!
                                    </p>
                                </div>
                            )}

                            {submitError && (
                                <div className="email-preferences-message email-preferences-message-error">
                                    <XCircleIcon className="email-preferences-message-icon" />
                                    <p className="email-preferences-message-text">{submitError}</p>
                                </div>
                            )}

                            <div className="email-preferences-actions">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="email-preferences-button email-preferences-button-primary"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Preferences'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUnsubscribeAll}
                                    className="email-preferences-button email-preferences-button-secondary"
                                >
                                    Unsubscribe from All
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="email-preferences-privacy">
                        <p className="email-preferences-privacy-text">
                            Your privacy is important to us. View our{' '}
                            <button onClick={() => navigate('/privacy-policy')} className="email-preferences-privacy-link">
                                Privacy Policy
                            </button>
                            {' '}to learn more about how we handle your data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}