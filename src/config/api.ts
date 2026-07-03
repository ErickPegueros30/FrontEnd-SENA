// Keep the provided VITE_API_BASE as-is so paths like `/api` are preserved.
// Default to localhost including the `/api` prefix used by the backend.
export const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'

export function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default API_BASE
