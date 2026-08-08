function isPurchasingEnabled() {
  return process.env.PURCHASING_ENABLED === 'true' || process.env.VITE_PURCHASING_ENABLED === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Online purchasing is not available',
      purchasingEnabled: false,
    }),
  }
}

function ensurePurchasingEnabled(headers = {}) {
  if (isPurchasingEnabled()) return null
  return purchasingDisabledResponse(headers)
}

module.exports = {
  ensurePurchasingEnabled,
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
