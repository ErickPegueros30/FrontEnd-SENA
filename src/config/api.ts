// Normalize VITE_API_BASE to a host root (no trailing `/api`),
// because many modules append `/api/...` themselves.
const rawBase = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'
// Remove any trailing `/api` (with or without slash) and any leftover trailing slashes
const API_BASE_NORMALIZED = rawBase.replace(/\/api\/?$/i, '').replace(/\/+$/, '')
export const API_BASE = API_BASE_NORMALIZED

export function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default API_BASE
