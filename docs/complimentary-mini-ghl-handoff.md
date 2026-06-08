# Complimentary Mini Form — GHL Handoff Brief

Handoff for configuring GoHighLevel after the `/complimentary-mini` invitation form ships on acdrainwiz.com.

---

## Purpose

Post–conference / post–event follow-up form. Attendees use a **private invitation link** to confirm **mailing address** for a complimentary **AC Drain Wiz Mini**. This is **not** a general contact or sales form.

**Public URLs (unlisted, noindex):**

| URL | Purpose |
|-----|---------|
| `/complimentary-mini?access=TOKEN` | Invitation form (requires access token) |
| `/complimentary-mini/confirmed` | Terminal success page (after submit, same browser session) |

---

## What the website sends to GHL

Submissions POST to Netlify `validate-form-submission` → GHL client form type **`complimentary-mini-request`**.

### Flow (automatic)

1. **Upsert Contact** by email (updates existing contact if email already in location).
2. **Apply Contact tags:** `event-attendee`, `complimentary-mini`, `warm lead`
3. **Create Opportunity** in pipeline from env vars:
   - `GHL_QUICK_PIPELINE_ID`
   - `GHL_QUICK_PIPELINE_STAGE_ID`
   - Opportunity name: `{firstName} {lastName} — Complimentary Mini`
4. **Source attribution:** `acdrainwiz.com: complimentary-mini-request`

### Contact standard fields mapped

| Form field | GHL field |
|------------|-----------|
| firstName | First name |
| lastName | Last name |
| email | Email |
| phone | Phone |
| company (organization) | Company name |
| street | Address line 1 |
| city | City |
| state | State |
| zip | Postal code |

### Contact custom fields mapped

| Form field | GHL custom field key |
|------------|----------------------|
| contactType | `contact_type` |
| smsTransactional | `sms_transactional_consent` (`yes` / `no`) |
| smsMarketing | `sms_marketing_consent` (`yes` / `no`) |
| smsConsentTimestamp | `sms_consent_timestamp` (when SMS opted in) |
| smsConsentSourceUrl | `sms_consent_source_url` |
| smsConsentIp | `sms_consent_ip` |

### Contact Type dropdown values (case-sensitive)

Must match GHL `contact_type` options exactly:

- `Building Inspector,` *(note trailing comma)*
- `Mechanical Inspector`
- `Plans Examiner`
- `Code Official`
- `Fire/Building Dept.`
- `Property Maintenance Official`
- `Other`

### Note on contact (when message empty)

Appends:

- **Event:** `Conference / event follow-up` (static from form)

---

## What the website does **not** do (GHL owns this)

- Verify submitter email is on the **email campaign / event list**
- Send official confirmation or rejection emails
- Trigger fulfillment / shipping
- Block duplicate submissions by email (recommended GHL workflow)
- One-time token burn per recipient (shared campaign token today)

---

## Required Netlify environment variables

Set before production use:

| Variable | Purpose |
|----------|---------|
| `VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN` | Build-time: gates form UI (`?access=` query param) |
| `COMPLIMENTARY_MINI_ACCESS_TOKEN` | Functions: validates `access` on every submission |
| `GHL_QUICK_PIPELINE_ID` | Opportunity pipeline for Mini requests |
| `GHL_QUICK_PIPELINE_STAGE_ID` | Initial stage (e.g. “Mailing address received”) |
| `GHL_PIT_TOKEN` | GHL API |
| `GHL_LOCATION_ID` | GHL location |

**Invitation link format for campaign emails:**

`https://acdrainwiz.com/complimentary-mini?access=YOUR_SECRET_TOKEN`

Use the same secret in both token env vars. Rotate if the link leaks.

---

## Recommended GHL automations

### Trigger

Use **Contact tag applied: `complimentary-mini`** and/or **Opportunity created** in the Complimentary Mini pipeline.

### Workflow A — Eligible (email on campaign list)

**If** contact email exists in the event/campaign audience (or has your pre-event tag, e.g. `coaa-2026-invited`):

1. Add tag: `mini-mailing-confirmed` *(suggested — create in GHL)*
2. Update custom field, e.g. `mini_mailing_confirmed` = Yes + timestamp
3. Move opportunity to stage: **Verified — awaiting ship**
4. Send email: “We received your mailing address” (official confirmation from GHL, not the website)
5. Internal notification to fulfillment team
6. Optional: SMS only if `sms_transactional_consent` = yes

### Workflow B — Not eligible (email not on list)

**If** email **not** in campaign / missing invite tag:

1. Add tag: `complimentary-mini-unverified`
2. Move opportunity to stage: **Review — not on list**
3. Send email: “We couldn’t verify your invitation” (no ship promise)
4. **Do not** auto-fulfill

### Workflow C — Duplicate submission

**If** contact already has `mini-mailing-confirmed` or opportunity already in Verified stage:

1. Skip fulfillment automation
2. Optional: send “We already have your information” email

---

## Suggested pipeline stages

| Stage | Meaning |
|-------|---------|
| Mailing address received | Default from website (`GHL_QUICK_PIPELINE_STAGE_ID`) |
| Verified — awaiting ship | Email matched campaign; ready for ops |
| Review — not on list | Failed campaign email match |
| Shipped | Fulfillment complete |
| Closed — ineligible | Denied / duplicate / abuse |

Adjust names to match your GHL setup.

---

## Campaign email checklist

- [ ] Send invitation only to **campaign contacts** (people you met + captured at event)
- [ ] Include personalized invitation link with `?access=` token
- [ ] Copy: confirm mailing address for complimentary Mini; link is personal
- [ ] Do not link form from website nav, footer, or public pages
- [ ] Confirmation email comes from **GHL workflow**, not website success page

---

## Website post-submit behavior (for context)

After successful submit:

1. User redirected to `/complimentary-mini/confirmed` (URL stripped of `?access=`)
2. Access token cleared from browser session — form cannot be resubmitted in same flow without a fresh invitation link
3. Success copy sets expectation: **verification required** before shipping; do not share link
4. Success page is minimal (no product hero) to reduce screenshot sharing

GHL should treat the website success message as **acknowledgment only**; your workflow email is the system of record.

---

## Code references (for debugging)

| Item | Location |
|------|----------|
| Form UI + success flow | `src/pages/ComplimentaryMiniRequestPage.tsx` |
| Copy / field labels | `src/config/complimentaryMiniRequestCopy.ts` |
| GHL field map | `netlify/functions/utils/ghl-field-map.js` → `complimentary-mini-request` |
| Server validation | `netlify/functions/validate-form-submission.js` → `complimentary-mini-request` |
| Access token gate | `src/utils/complimentaryMiniAccess.ts` |

---

## Open items / optional hardening (not in scope)

- Per-recipient one-time tokens in GHL merge fields
- Server-side reject duplicate email before GHL upsert
- Dedicated pipeline separate from `GHL_QUICK_PIPELINE_ID` if municipal quick intake shares it today

Confirm with dev whether Quick Intake and Complimentary Mini should use **separate pipelines** before go-live.

---

## Campaign invitation email (GHL)

HTML template for the pre-form invitation (secure link to `/complimentary-mini`):

**File:** [`docs/emails/complimentary-mini-invitation.html`](../emails/complimentary-mini-invitation.html)

### GHL setup (required before send)

1. **Settings → Custom Values** → create:
   - **Key:** `complimentary_mini_invite_url`
   - **Value:** `https://acdrainwiz.com/complimentary-mini?access=YOUR_SECRET_TOKEN`
   - Use the same token as `COMPLIMENTARY_MINI_ACCESS_TOKEN` / `VITE_COMPLIMENTARY_MINI_ACCESS_TOKEN`.

2. **Email template:** paste HTML from the file above into a GHL code/HTML email (or workflow email action).

3. **Subject line (suggested):** `Confirm your mailing address for your complimentary AC Drain Wiz Mini`

4. **Send only to** contacts on your event/campaign list. The website verifies the access token; **GHL workflow should still verify email eligibility** before fulfillment (see Workflow A/B above).

### Merge fields used in template

| Merge field | Purpose |
|-------------|---------|
| `{{contact.first_name}}` | Personal greeting |
| `{{custom_values.complimentary_mini_invite_url}}` | Full secure CTA + fallback link |

Alternative per-contact tokens are documented in comments at the top of the HTML file.
