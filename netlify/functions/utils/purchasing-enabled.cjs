function isPurchasingEnabled() {
  return process.env.PURCHASING_ENABLED === 'true' || process.env.VITE_PURCHASING_ENABLED === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Online purchasing is not available yet',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
