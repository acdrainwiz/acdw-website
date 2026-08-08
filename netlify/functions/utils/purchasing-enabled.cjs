function isPurchasingEnabled(env = process.env) {
  const value = env.PURCHASING_ENABLED || env.VITE_PURCHASING_ENABLED || ''
  return String(value).trim().toLowerCase() === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Online purchasing is temporarily unavailable',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
