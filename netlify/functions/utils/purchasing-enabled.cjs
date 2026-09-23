function isPurchasingEnabled() {
  return process.env.PURCHASING_ENABLED === 'true' || process.env.VITE_PURCHASING_ENABLED === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      success: false,
      error: 'Online purchasing is temporarily unavailable',
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
