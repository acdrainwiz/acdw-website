function isPurchasingEnabled() {
  const flag = process.env.PURCHASING_ENABLED ?? process.env.VITE_PURCHASING_ENABLED
  return flag === 'true'
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
