function flagEnabled(value) {
  return String(value || '').trim().toLowerCase() === 'true'
}

function isPurchasingEnabled() {
  return flagEnabled(process.env.PURCHASING_ENABLED) || flagEnabled(process.env.VITE_PURCHASING_ENABLED)
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      success: false,
      error: 'Online purchasing is temporarily unavailable',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
