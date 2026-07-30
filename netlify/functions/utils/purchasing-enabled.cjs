function isPurchasingEnabled() {
  return process.env.PURCHASING_ENABLED === 'true' || process.env.VITE_PURCHASING_ENABLED === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers: {
      ...headers,
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({
      error: 'Purchasing is temporarily unavailable',
      message: 'Online purchasing is temporarily unavailable. Please contact support for assistance.',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
