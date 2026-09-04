export function getCertificateToken(key) {
  return sessionStorage.getItem(key) || ''
}

export function setCertificateToken(key, token) {
  sessionStorage.setItem(key, token)
}

export function removeCertificateToken(key) {
  sessionStorage.removeItem(key)
}

export function isCertificateTokenExpired(error) {
  const response = error && error.response
  const data = (response && response.data) || (error && error.data)
  const code = data && data.code
  return Boolean(
    (response && response.status === 401) ||
    code === 401 ||
    code === '401' ||
    (error && error.tokenExpired)
  )
}

export function throwIfCertificateTokenExpired(response) {
  const data = response && response.data
  const code = data && data.code
  if ((response && response.status === 401) || code === 401 || code === '401') {
    const error = new Error('证书系统登录状态已过期')
    error.tokenExpired = true
    throw error
  }
}
