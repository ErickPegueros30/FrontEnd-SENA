// composables/useAuthStore.ts
import { ref, computed } from 'vue';
import {useRouter} from 'vue-router';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  correo: string;
  ruta_identificacion?: string; // añadido
  foto_perfil?: string; // añadido
  habilitado?: boolean; // usuario habilitado/activo
  ultima_actividad?: string | null;
}

const user = ref<User | null>(null);
const token = ref<string | null>(null);
const mustUploadIne = ref(false); // indicador del modal

function evaluateMustUploadIne(u: User | null) {
  mustUploadIne.value = !!u && u.ruta_identificacion === '/uploads/pendiente.pdf';
}

function looksDisabled(v: any) {
  if (v === undefined || v === null) return false
  if (typeof v === 'boolean') return v === false
  if (typeof v === 'number') return v === 0
  const s = String(v).trim().toLowerCase()
  if (!s) return false
  return ['0', 'false', 'inactivo', 'inactive', 'deshabilitado', 'disabled', 'i', 'no', 'n'].includes(s)
}

function isUserDisabled(obj: any) {
  if (!obj) return false
  // common property names returned by different backends
  const candidates = ['habilitado', 'activo', 'enabled', 'status', 'estado', 'estado_usuario', 'estado_cuenta', 'estadoCuenta', 'estadoUsuario', 'enabled_flag']
  for (const k of candidates) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      if (looksDisabled(obj[k])) return true
    }
  }
  return false
}

function getRouteByRole(rol: string): string {
  const roleRoutes: Record<string, string> = {
    'A': '/Seccion_Admin',
    'E': '/EmpleadosDashboard',
    'C': '/ClientesDashboard'
  };
  return roleRoutes[rol] || '/';
}

export default function useAuthStore() {
  const router = useRouter();
  // Refresh profile from server and merge into local user state
  const refreshProfile = async (): Promise<void> => {
    const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'
    const t = token.value || localStorage.getItem('token') || localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    if (!t) return
    try {
      const resp = await fetch(`${API_BASE}/api/profile`, { headers: { Authorization: `Bearer ${t}` } })
      if (!resp.ok) return
      const body = await resp.json().catch(() => null)
      const payload = body && body.data ? body.data : body
      if (!payload) return
      // prefer avatarUrl -> foto_perfil
      if (payload.avatarUrl && !payload.foto_perfil) payload.foto_perfil = payload.avatarUrl
      const merged = { ...(user.value || {}), ...payload }
      if (!merged.ultima_actividad) merged.ultima_actividad = (user.value && user.value.ultima_actividad) || null
      user.value = merged as User
      try { localStorage.setItem('user', JSON.stringify(user.value)) } catch (e) { /* ignore */ }
      evaluateMustUploadIne(user.value)
    } catch (e) {
      // ignore network errors
    }
  }
  const loadUser = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      token.value = savedToken;
      try {
        const parsed: User = JSON.parse(savedUser);
        // If user is explicitly disabled, clear session and notify via a flag
        const disabled = isUserDisabled(parsed)
        if (disabled) {
          // clear any persisted auth and set a reason key so login view can show it
          token.value = null
          user.value = null
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.setItem('auth_blocked_reason', 'disabled')
          // try to redirect to login with blocked indicator
          try { router.push('/login?blocked=disabled') } catch (e) { /* ignore */ }
          mustUploadIne.value = false
          return
        }

        user.value = parsed;
        evaluateMustUploadIne(parsed);
        // ensure ultima_actividad exists as ISO string or null
        if (!user.value.ultima_actividad) user.value.ultima_actividad = null
        // If we have a saved token, refresh profile from server in background to obtain foto_perfil/avatarUrl
        try {
          // do not block loadUser: perform a background refresh using exported refreshProfile
          const savedToken = localStorage.getItem('token')
          if (savedToken) {
            ;(async () => {
              try {
                await refreshProfile()
              } catch (e) { /* ignore */ }
            })()
          }
        } catch (e) { /* ignore */ }
      } catch {
        user.value = null;
        token.value = null;
        mustUploadIne.value = false;
      }
      return
    }

    // Fallback: support legacy storage keys used across the app (auth_token, user_role, user_id, user_email)
    try {
      const legacyToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      const legacyRole = localStorage.getItem('user_role') || sessionStorage.getItem('user_role')
      const legacyId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id')
      const legacyEmail = localStorage.getItem('user_email') || sessionStorage.getItem('user_email')
      if (legacyToken) token.value = legacyToken
      if (legacyRole) {
        // normalize legacy role values to single-letter codes: A | E | C
        const rRaw = String(legacyRole || '').trim()
        const rUp = rRaw.toUpperCase()
        let rolCode = ''
        if (['A', 'E', 'C'].includes(rUp)) rolCode = rUp
        else if (rUp.startsWith('ADMIN') || rUp.startsWith('AD')) rolCode = 'A'
        else if (rUp.startsWith('EMP') || rUp.startsWith('E')) rolCode = 'E'
        else if (rUp.startsWith('CLI') || rUp.startsWith('C')) rolCode = 'C'
        else if (rRaw === '1' || rRaw === '01') rolCode = 'A'
        else if (rRaw === '2') rolCode = 'E'
        else if (rRaw === '3') rolCode = 'C'
        else rolCode = rUp.charAt(0) || ''

        user.value = {
          id: legacyId ? Number(legacyId) : 0,
          nombre: legacyEmail || '',
          apellido: '',
          rol: rolCode,
          correo: legacyEmail || ''
        }
        evaluateMustUploadIne(user.value)
      }
    } catch (e) {
      // ignore malformed values
    }
  };

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.rol || null);
  const userName = computed(() => {
    if (!user.value) return ''
    const firstLast = (user.value as any).apellido || (user.value as any).primer_apellido || ''
    const secondLast = (user.value as any).segundo_apellido || (user.value as any).secondLastName || ''
    return `${(user.value as any).nombre || ''}${firstLast ? ' ' + firstLast : ''}${secondLast ? ' ' + secondLast : ''}`.trim()
  })

  const login = (userData: User, authToken: string) => {
    // If the backend indicates the user is disabled, block login and notify
    const disabled = isUserDisabled(userData)
    if (disabled) {
      // ensure no token saved and set a reason for UI to show
      try { localStorage.removeItem('token'); localStorage.removeItem('user') } catch(e){}
      localStorage.setItem('auth_blocked_reason', 'disabled')
      try { router.push('/login?blocked=disabled') } catch(e){}
      return false
    }

    // set last activity when logging in
    const now = new Date().toISOString()
    const toSave = { ...userData, ultima_actividad: now }
    user.value = toSave as User;
    token.value = authToken;
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(user.value));
    evaluateMustUploadIne(user.value);
    // Refresh profile immediately after login so components receive latest fields (foto_perfil, avatarUrl)
    ;(async () => {
      try {
        await refreshProfile()
      } catch (e) { /* ignore */ }
    })()
    return true
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    mustUploadIne.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also remove legacy/other session keys used elsewhere in the app
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
    } catch (e) {
      // ignore
    }
    try {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_role');
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('user_email');
    } catch (e) {
      // ignore
    }
    // Redirect to login route
    try { router.push('/login') } catch (e) { /* ignore routing errors */ }
  };

  // Update user and persist; used to set ultima_actividad from other parts
  const touchActivity = async (): Promise<boolean> => {
    if (!user.value) return false
    const now = new Date().toISOString()
    user.value.ultima_actividad = now
    try { localStorage.setItem('user', JSON.stringify(user.value)) } catch (e) { /* ignore */ }

    // Try to persist on server if we have a token and user id
    try {
      const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'
      const t = token.value
      const uid = (user.value as any).id || (user.value as any).id_usuario || null
      if (!t || !uid) return true
      await fetch(`${API_BASE}/api/users/${uid}/last-activity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${t}`
        }
      })
      return true
    } catch (e) {
      // ignore network errors but return false to signal failure
      return false
    }
  }

  const hasRole = (roles: string | string[]) => {
    if (!user.value) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(user.value.rol);
  };

  const updateUser = (newUser: User) => {
    // preserve ultima_actividad when updating unless explicitly provided
    const merged = { ...(user.value || {}), ...newUser }
    if (!merged.ultima_actividad) merged.ultima_actividad = (user.value && user.value.ultima_actividad) || null
    user.value = merged as User
    localStorage.setItem('user', JSON.stringify(user.value));
    evaluateMustUploadIne(user.value);
  };

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    userRole,
    userName,
    mustUploadIne: computed(() => mustUploadIne.value),
    loadUser,
    login,
    logout,
    getRouteByRole,
    hasRole,
    updateUser,
    touchActivity
    ,refreshProfile
  }
};
