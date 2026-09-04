function isPurchasingEnabled(env = process.env) {
  const rawValue = env.PURCHASING_ENABLED ?? env.VITE_PURCHASING_ENABLED
  return String(rawValue).toLowerCase() === 'true'
}

function purchasingDisabledResponse(headers) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Purchasing is not currently available',
      purchasingEnabled: false,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
