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
}

const user = ref<User | null>(null);
const token = ref<string | null>(null);
const mustUploadIne = ref(false); // indicador del modal

function evaluateMustUploadIne(u: User | null) {
  mustUploadIne.value = !!u && u.ruta_identificacion === '/uploads/pendiente.pdf';
}

function getRouteByRole(rol: string): string {
  const roleRoutes: Record<string, string> = {
    'A': '/Seccion_Admin',
    'E': '/EmpleadosDashboard',
    'C': '/ClientesDashboard'
  };
  return roleRoutes[rol] || '/Home';
}

export default function useAuthStore() {
  const router = useRouter();
  const loadUser = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      token.value = savedToken;
      try {
        const parsed: User = JSON.parse(savedUser);
        user.value = parsed;
        evaluateMustUploadIne(parsed);
      } catch {
        user.value = null;
        token.value = null;
        mustUploadIne.value = false;
      }
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
    user.value = userData;
    token.value = authToken;
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    evaluateMustUploadIne(userData);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    mustUploadIne.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasRole = (roles: string | string[]) => {
    if (!user.value) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(user.value.rol);
  };

  const updateUser = (newUser: User) => {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
    evaluateMustUploadIne(newUser);
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
    updateUser
  }
};
