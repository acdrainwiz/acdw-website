function isPurchasingEnabled(env = process.env) {
  return String(env.PURCHASING_ENABLED || env.VITE_PURCHASING_ENABLED || '').toLowerCase() === 'true'
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
