function isPurchasingEnabled(env = process.env) {
  const value = env.PURCHASING_ENABLED ?? env.VITE_PURCHASING_ENABLED ?? ''
  return ['true', '1', 'yes', 'on'].includes(String(value).trim().toLowerCase())
}

function getPurchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Online purchasing is currently unavailable',
      purchasingDisabled: true,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  getPurchasingDisabledResponse,
}
