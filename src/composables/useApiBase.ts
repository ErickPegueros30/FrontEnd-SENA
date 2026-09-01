import { computed } from 'vue'

export function useApiBase() {
  const raw = (import.meta.env.VITE_API_BASE as string) || ''
  // During local development, if VITE_API_BASE is not set, default to backend dev port
  const defaultDev = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE_DEV as string) || 'http://localhost:3000' : ''
  const effectiveRaw = raw || defaultDev
  // Normalizar: aceptar formatos como 'http://localhost:3000' o 'http://host/api'
  const api = computed(() => {
    if (!effectiveRaw) return ''
    return effectiveRaw.replace(/\/+$/, '')
  })

  const authHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  return { api, authHeaders }
}

export default useApiBase
