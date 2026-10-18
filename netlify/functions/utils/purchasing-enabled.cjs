function isPurchasingEnabled() {
  const value = process.env.PURCHASING_ENABLED ?? process.env.VITE_PURCHASING_ENABLED
  return typeof value === 'string' && value.toLowerCase() === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Purchasing is not currently available',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
