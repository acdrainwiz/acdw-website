function isPurchasingEnabled() {
  const configuredValue = process.env.PURCHASING_ENABLED ?? process.env.VITE_PURCHASING_ENABLED
  return String(configuredValue).toLowerCase() === 'true'
}

function getPurchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Purchasing is currently disabled',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  getPurchasingDisabledResponse,
}
