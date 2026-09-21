function isPurchasingEnabled() {
  const flag = process.env.PURCHASING_ENABLED ?? process.env.VITE_PURCHASING_ENABLED
  return String(flag || '').trim().toLowerCase() === 'true'
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
