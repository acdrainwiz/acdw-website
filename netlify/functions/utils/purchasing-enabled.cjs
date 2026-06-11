function isPurchasingEnabled() {
  const rawValue = process.env.PURCHASING_ENABLED || process.env.VITE_PURCHASING_ENABLED || ''
  return String(rawValue).toLowerCase() === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Online purchasing is not available yet',
      purchasingEnabled: false,
    }),
  }
}

function rejectWhenPurchasingDisabled(headers = {}) {
  return isPurchasingEnabled() ? null : purchasingDisabledResponse(headers)
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
  rejectWhenPurchasingDisabled,
}
