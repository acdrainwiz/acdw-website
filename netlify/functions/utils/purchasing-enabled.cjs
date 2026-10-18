function isPurchasingEnabled() {
  return process.env.VITE_PURCHASING_ENABLED === 'true'
}

function purchasingDisabledResponse(headers) {
  return {
    statusCode: 503,
    headers: {
      ...headers,
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({
      error: 'Online purchasing is coming soon.',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
