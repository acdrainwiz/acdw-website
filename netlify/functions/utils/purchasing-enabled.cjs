function flagIsEnabled(value) {
  return String(value || '').trim().toLowerCase() === 'true'
}

function isPurchasingEnabled() {
  return flagIsEnabled(process.env.PURCHASING_ENABLED) ||
    flagIsEnabled(process.env.VITE_PURCHASING_ENABLED)
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Purchasing is temporarily unavailable',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
