function isPurchasingEnabled() {
  const value = process.env.PURCHASING_ENABLED ?? process.env.VITE_PURCHASING_ENABLED
  return value === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Purchasing is temporarily unavailable',
      purchasingDisabled: true,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
