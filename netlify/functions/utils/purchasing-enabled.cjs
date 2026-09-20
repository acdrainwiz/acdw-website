function isPurchasingEnabled(env = process.env) {
  return env.PURCHASING_ENABLED === 'true' || env.VITE_PURCHASING_ENABLED === 'true'
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
