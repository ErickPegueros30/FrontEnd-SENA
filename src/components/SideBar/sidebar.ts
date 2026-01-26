// composables/useSidebarAcademia.ts
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import logoSrc from '@/assets/resources/Logo SIGOL.svg';
import useAuthStore from '@/compasable/useAuthStore';

export default function useSidebarAcademia() {
  const router = useRouter();
  const route = useRoute();
  const { isAuthenticated, userName, userRole, logout } = useAuthStore();

  const isMenuOpen = ref(false);
  const active = ref('dashboard');

  // Menú para ADMINISTRADOR (A)
  const adminMenuItems = [
    { name: 'dashboard', label: 'Inicio', path: '/AdminDashboard', icon: 'dashboard' },
    { name: 'categorias', label: 'Categorías', path: '/AdminCategorias', icon: 'category' },
    { name: 'usuarios', label: 'Usuarios', path: '/AdminUsuarios', icon: 'group' },
    { name: 'documentos', label: 'Documentos', path: '/AdminDocumentos', icon: 'description' },
    { name: 'configuracion', label: 'Configuración', icon: 'settings', path: '/ConfiguracionAcademia' }
  ];

  // Menú para EMPLEADO (E)
  const empleadoMenuItems = [
    { name: 'dashboard', label: 'Inicio', path: '/EmpleadoDashboard', icon: 'dashboard' },
    { name: 'gestion', label: 'Gestión de Pagos', path: '/EmpleadoGestion', icon: 'payment' },
    { name: 'reportes', label: 'Reportes de Pagos', path: '/EmpleadoReportes', icon: 'assessment' },
    { name: 'configuracion', label: 'Configuración', icon: 'settings', path: '/ConfiguracionAcademia' }
  ];

  // Menú para CLIENTE (C)
  const clienteMenuItems = [
    { name: 'dashboard', label: 'Inicio', path: '/ClienteDashboard', icon: 'dashboard' },
//    { name: 'students', label: 'Mis Alumnos', path: '/ClienteStudents', icon: 'group' },
    { name: 'attendance', label: 'Asistencia', path: '/ClienteAttendance', icon: 'check_circle' },
    { name: 'configuracion', label: 'Configuración', path: '/ConfiguracionAcademia', icon: 'settings' }
  ];

  const guestMenuItems = [
    { name: 'inicio', label: 'Inicio', icon: 'dashboard', path: '/Home' },

  ];

  // Menú dinámico según el rol
  const menuItems = computed(() => {
    switch (userRole.value) {
      case 'A':
        return adminMenuItems;
      case 'E':
        return empleadoMenuItems;
      case 'C':
        return clienteMenuItems;
      default:
        return adminMenuItems; // Por defecto
    }
  });

  // Título del sidebar según el rol
  const sidebarTitle = computed(() => {
    const titles: Record<string, string> = {
      A: 'Portal Administrador',
      E: 'Portal Instructor',
      C: 'Portal Cliente'
    };
    return titles[userRole.value || ''] || 'SENA';
  });

  // Detectar ruta activa automáticamente
  watch(
    () => route.path,
    (newPath) => {
      const currentMenuItems = menuItems.value;
      const activeItem = currentMenuItems.find((item) => item.path === newPath);
      if (activeItem) {
        active.value = activeItem.name;
      }
    },
    { immediate: true }
  );

  // Función para navegar
  const navigateTo = (path: string, name: string) => {
    if (path === '#') return; // No navegar si es placeholder
    active.value = name;
    isMenuOpen.value = false;
    router.push(path);
  };

  const setActive = (name: string) => {
    active.value = name;
    isMenuOpen.value = false;
  };

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  // 🔴 Logout SIN confirm() del navegador ni alerts
  const handleLogout = async () => {
    try {
      logout();     // limpia store / token
      closeMenu();  // cierra menú móvil si estaba abierto
    } catch (error) {
      console.error('Error interno en logout:', error);
      // No mostramos err.message al usuario para evitar "localhost..."
    }
  };

  // Función para obtener la ruta de Torneo según el rol
  const getTorneoRoute = () => {
    return userRole.value === 'AP' ? '/AdminPagosDashboardTorneo' : '/Dashboard_Admin';
  };

  // Clases para links del sidebar desktop
  const navLinkClass = (name: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition group cursor-pointer
    ${
      active.value === name
        ? 'bg-blue-900/40 text-blue-400 font-bold'
        : 'hover:bg-blue-900/30 hover:text-blue-400'
    }`;

  // Clases para links del menú móvil
  const mobileNavLinkClass = (name: string) =>
    `flex items-center gap-2 text-lg font-semibold transition cursor-pointer
    ${active.value === name ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'}`;

  return {
    Logo: logoSrc,
    isMenuOpen,
    active,
    isAuthenticated,
    userName,
    userRole,
    menuItems,
    sidebarTitle,
    navigateTo,
    setActive,
    toggleMenu,
    closeMenu,
    handleLogout,
    navLinkClass,
    mobileNavLinkClass,
    getTorneoRoute
  };
}
