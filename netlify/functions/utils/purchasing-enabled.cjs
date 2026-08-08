function isPurchasingEnabled() {
  const rawValue = process.env.PURCHASING_ENABLED ?? process.env.VITE_PURCHASING_ENABLED
  return rawValue === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Online purchasing is currently unavailable',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
