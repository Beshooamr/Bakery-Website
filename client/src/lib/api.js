const fallbackApiBaseUrl = 'http://localhost:5000'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl
const apiBaseUrl = configuredApiBaseUrl.replace(/\/$/, '')

export function apiUrl(path) {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
}
