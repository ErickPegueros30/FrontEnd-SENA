export const API_BASE = ((import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000').replace(/\/api$/, '')

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default API_BASE
