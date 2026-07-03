// composables/useSidebarAcademia.ts
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import logoSrc from '@/assets/logo.svg';
import useAuthStore from '@/compasable/useAuthStore';

export default function useSidebarAcademia() {
  const router = useRouter();
  const route = useRoute();
  const { isAuthenticated, userName, userRole, logout, loadUser } = useAuthStore();

  // Ensure we load any persisted session so `userRole` is available
  try {
    if (!isAuthenticated.value) loadUser();
  } catch (e) {
    // ignore
  }

  const isMenuOpen = ref(false);
  const active = ref('dashboard');

  // Menú para ADMINISTRADOR (A)

  const adminMenuItems = [
  { id: 'ensayos', title: 'Ensayos', path: '/AdminEnsayos', icon: 'bi-flask' },
  { id: 'cursos', title: 'Cursos', path: '/AdminCursos', icon: 'bi-mortarboard' },
  { id: 'inscripciones', title: 'Inscripciones', path: '/AdminInscripciones', icon: 'bi-people' },
  { id: 'blog', title: 'Blog', path: '/AdminBlog', icon: 'bi-journal-text' },
  {id: 'eventos', title: 'Eventos', path: '/AdminEventos', icon: 'bi-calendar-event' },
  { id: 'usuarios', title: 'Usuarios', path: '/AdminUsuarios', icon: 'bi-person-lines-fill' },
  { id: 'reportes', title: 'Reportes', path: '/fabricacion', icon: 'bi-graph-up' },
  { id: 'cotizaciones', title: 'Cotizaciones', path: '/fabricacion', icon: 'bi-file-earmark-text' },
  { id: 'pagos', title: 'Pagos', path: '/fabricacion', icon: 'bi-credit-card' },
  { id: 'configuracion', title: 'Configuración', path: '/configuracion', icon: 'bi-gear' }
  ];

  // Menú para EMPLEADO (E)
  const empleadoMenuItems = [
    { id: 'dashboard', title: 'Inicio', path: '/empleado', icon: 'bi-speedometer2' },
    { id: 'gestion', title: 'Gestión de Pagos', path: '/EmpleadoGestion', icon: 'bi-credit-card' },
    { id: 'reportes', title: 'Reportes de Pagos', path: '/EmpleadoReportes', icon: 'bi-graph-up' },
    { id: 'configuracion', title: 'Configuración', icon: 'bi-gear', path: '/ConfiguracionAcademia' }
  ];

  // Menú para CLIENTE (C)
  const clienteMenuItems = [
    { id: 'dashboard', title: 'Inicio', path: '/Cliente', icon: 'bi-speedometer2' },
    { id: 'agenda', title: 'Agenda de Sesiones', path: '/fabricacion', icon: 'bi-calendar3' },
    { id: 'cursos', title: 'Cursos Inscritos', path: '/fabricacion', icon: 'bi-mortarboard' },
    { id: 'cotizaciones', title: 'Mis Cotizaciones', path: '/fabricacion', icon: 'bi-file-earmark-text' },
    { id: 'Inscripciones', title: 'Mis Inscripciones', path:'/fabricacion', icon: 'bi-people' },
    { id: 'pagos', title: 'Pagos y Recibos', path: '/fabricacion', icon: 'bi-credit-card' },
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
        // support different menu shapes (id / name / label)
        // prefer `id`, fallback to `name` or `label`
        // keep `active` in sync with what `setActive` expects (it's passed the id)
        active.value = (activeItem as any).id || (activeItem as any).name || (activeItem as any).label || '';
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
