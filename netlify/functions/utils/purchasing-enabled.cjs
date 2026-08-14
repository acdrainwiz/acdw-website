function readFlag(name) {
  return String(process.env[name] || '').trim().toLowerCase()
}

function isPurchasingEnabled() {
  return readFlag('PURCHASING_ENABLED') === 'true' || readFlag('VITE_PURCHASING_ENABLED') === 'true'
}

function purchasingDisabledResponse(headers = {}) {
  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({
      error: 'Purchasing is currently unavailable',
      purchasingDisabled: true,
    }),
  }
}

module.exports = {
  isPurchasingEnabled,
  purchasingDisabledResponse,
}
