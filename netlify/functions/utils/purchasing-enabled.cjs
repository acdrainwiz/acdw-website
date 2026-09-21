function isPurchasingEnabled(env = process.env) {
  const raw = env.PURCHASING_ENABLED ?? env.VITE_PURCHASING_ENABLED
  return String(raw).toLowerCase() === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Online purchasing is not available',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
