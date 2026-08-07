function isPurchasingEnabled() {
  const rawValue = process.env.PURCHASING_ENABLED ?? process.env.VITE_PURCHASING_ENABLED ?? ''
  return String(rawValue).trim().toLowerCase() === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Purchasing is currently unavailable',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
