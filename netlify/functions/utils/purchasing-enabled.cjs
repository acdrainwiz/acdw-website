function normalizeFlag(value) {
  return String(value || '').trim().toLowerCase()
}

function isPurchasingEnabled() {
  return normalizeFlag(process.env.PURCHASING_ENABLED) === 'true' ||
    normalizeFlag(process.env.VITE_PURCHASING_ENABLED) === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Online purchasing is currently unavailable.',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
