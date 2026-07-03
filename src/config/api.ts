// Keep the provided VITE_API_BASE as-is so paths like `/api` are preserved.
// Default to localhost including the `/api` prefix used by the backend.
const rawBase = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3002/api'
// Normalize: remove trailing slashes, ensure it ends with '/api'
const normalized = rawBase.replace(/\/+$/, '')
export const API_BASE = normalized.endsWith('/api') ? normalized : `${normalized}/api`

export function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default API_BASE
