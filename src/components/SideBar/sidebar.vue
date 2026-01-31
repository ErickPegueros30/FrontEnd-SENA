<template>
  <div v-if="showSidebar" class="admin-sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- Menú Principal -->
    <nav class="sidebar-nav">
      <ul class="nav-menu">
        <li
          v-for="item in menuItems"
          :key="item.id"
          class="nav-item"
          :class="{ 'active': activeMenu === item.id, 'has-submenu': item.children }"
        >
          <router-link
            v-if="!item.children"
            :to="item.path"
            class="nav-link"
            @click="setActiveMenu(item.id)"
          >
            <i class="bi" :class="item.icon"></i>
            <span class="nav-text" v-if="!isCollapsed">{{ item.title }}</span>
            <span v-if="item.badge && !isCollapsed" class="nav-badge">{{ item.badge }}</span>
          </router-link>

          <div
            v-else
            class="nav-link submenu-toggle"
            @click="toggleSubmenu(item.id)"
          >
            <div class="submenu-header">
              <i class="bi" :class="item.icon"></i>
              <span class="nav-text" v-if="!isCollapsed">{{ item.title }}</span>
              <span v-if="item.badge && !isCollapsed" class="nav-badge">{{ item.badge }}</span>
            </div>
            <i
              class="bi submenu-arrow"
              :class="expandedSubmenus.includes(item.id) ? 'bi-chevron-down' : 'bi-chevron-right'"
            ></i>
          </div>

          <!-- Submenú -->
          <ul
            v-if="item.children && expandedSubmenus.includes(item.id) && !isCollapsed"
            class="submenu"
          >
            <li
              v-for="child in item.children"
              :key="child.id"
              class="submenu-item"
              :class="{ 'active': activeMenu === child.id }"
            >
              <router-link
                :to="child.path"
                class="submenu-link"
                @click="setActiveMenu(child.id)"
              >
                <i class="bi" :class="child.icon"></i>
                <span>{{ child.title }}</span>
                <span v-if="child.badge" class="submenu-badge">{{ child.badge }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Footer del Sidebar -->
    <div class="sidebar-footer" v-if="!isCollapsed">
      <!-- Información del Sistema -->
      <div class="system-info">
        <div class="info-item">
          <i class="bi bi-server"></i>
          <span>Online</span>
        </div>
        <div class="info-item">
          <i class="bi bi-clock"></i>
          <span>{{ currentTime }}</span>
        </div>
      </div>
      </div>

  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/compasable/useAuthStore'
import useUiStore from '@/compasable/useUiStore'
import useSidebarAcademia from './sidebar'
import Logo from '@/assets/logo.svg'

// Tipos
type Theme = 'light' | 'dark'
type Language = {
  code: string
  name: string
  flag: string
}

interface MenuItem {
  id: string
  title: string
  icon: string
  path?: string
  badge?: string | number
  children?: MenuItem[]
}

interface User {
  id: number
  name: string
  email: string
  role: string
  roleCode?: string
  avatar?: string
  online: boolean
  menu?: MenuItem[]
}

// Router
const router = useRouter()

// Estado
const ui = useUiStore()
const isCollapsed = computed(() => ui.state.sidebarCollapsed)
const expandedSubmenus: Ref<string[]> = ref([])
const navbarVisible: Ref<boolean> = ref(true)
const showProfileMenu: Ref<boolean> = ref(false)
const showLanguageMenu: Ref<boolean> = ref(false)
const currentTime: Ref<string> = ref('')
// show/hide this sidebar based on the central UI store flag and authentication
const showSidebar = computed(() => ui.state.sidebarVisible && auth.isAuthenticated.value)
const auth = useAuthStore()

// Shared sidebar composable (provides menuItems, active, navigation helpers)
const sidebarApi = useSidebarAcademia()
const menuItems = sidebarApi.menuItems
const activeMenu = sidebarApi.active

// Datos del usuario
const user: Ref<User> = ref({
  id: 1,
  name: 'Admin SENA',
  email: 'admin@sena.com',
  role: 'Administrador',
  // Avatar por defecto (puedes reemplazar por tu propia ruta local)
  avatar: 'https://ui-avatars.com/api/?name=Admin+SENA&background=a7b729&color=fff',
  online: true
})

// Usuarios de prueba: Administrador (A), Empleado (E), Cliente (C)
const mockUsers: Ref<User[]> = ref([
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@ejemplo.com',
    role: 'Administrador',
    roleCode: 'A',
    avatar: 'https://ui-avatars.com/api/?name=Administrador&background=a7b729&color=fff',
    online: true,
    // Menú para administrador (coincide con useSidebarAcademia adminMenuItems)
    menu: [
      { id: 'dashboard', title: 'Inicio', icon: 'bi-speedometer2', path: '/AdminDashboard' },
      { id: 'categorias', title: 'Categorías', icon: 'bi-tags', path: '/AdminCategorias' },
      { id: 'usuarios', title: 'Usuarios', icon: 'bi-people', path: '/AdminUsuarios' },
      { id: 'documentos', title: 'Documentos', icon: 'bi-file-earmark-text', path: '/AdminDocumentos' },
      { id: 'configuracion', title: 'Configuración', icon: 'bi-gear', path: '/ConfiguracionAcademia' }
    ]
  },
  {
    id: 2,
    name: 'Empleado',
    email: 'empleado@ejemplo.com',
    role: 'Empleado',
    roleCode: 'E',
    avatar: 'https://ui-avatars.com/api/?name=Empleado&background=a7b729&color=fff',
    online: true,
    // Menú para empleado (ruta principal de empleado + herramientas)
    menu: [
      { id: 'dashboard', title: 'Inicio', icon: 'bi-speedometer2', path: '/EmpleadosDashboard' },
      { id: 'pagos', title: 'Pagos', icon: 'bi-credit-card', path: '/AdminPagosGestion' },
      { id: 'configuracion', title: 'Configuración', icon: 'bi-gear', path: '/ConfiguracionAcademia' }
    ]
  },
  {
    id: 3,
    name: 'Cliente',
    email: 'cliente@ejemplo.com',
    role: 'Cliente',
    roleCode: 'C',
    avatar: 'https://ui-avatars.com/api/?name=Cliente&background=a7b729&color=fff',
    online: true,
    // Menú simplificado para cliente
    menu: [
      { id: 'dashboard', title: 'Inicio', icon: 'bi-speedometer2', path: '/ClientesDashboard' },
      { id: 'cursos', title: 'Cursos', icon: 'bi-mortarboard', path: '/AlumnoDashboard' },
      { id: 'inscripciones', title: 'Mis Inscripciones', icon: 'bi-people', path: '/admin/inscripciones' }
    ]
  }
])

const selectUser = (u: User) => {
  user.value = { ...u }
  // Persist the active user selection; the shared composable controls the menu
  localStorage.setItem('activeUserId', String(u.id))
  showProfileMenu.value = false
}

const getRouteByRoleCode = (code?: string) => {
  switch (code) {
    case 'A':
      return '/Seccion_Admin'
    case 'E':
      return '/EmpleadosDashboard'
    case 'C':
      return '/ClientesDashboard'
    default:
      return '/Home'
  }
}

const goToRolePage = () => {
  const route = getRouteByRoleCode(user.value.roleCode)
  router.push(route)
  showProfileMenu.value = false
}

// Tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Idioma
const languages: Language[] = [
  { code: 'es', name: 'Español', flag: 'bi bi-flag' },
  { code: 'en', name: 'English', flag: 'bi bi-flag-fill' },
  { code: 'fr', name: 'Français', flag: 'bi bi-flag' }
]

const currentLanguage: Ref<Language> = ref(languages[0])

// Menu is provided by the shared composable (no local default)

// Menú rápido (modo colapsado)
const quickMenuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: 'bi-speedometer2' },
  { id: 'cursos', title: 'Cursos', icon: 'bi-mortarboard' },
  { id: 'inscripciones', title: 'Inscripciones', icon: 'bi-people' },
  { id: 'reportes', title: 'Reportes', icon: 'bi-graph-up' },
  { id: 'configuracion', title: 'Configuración', icon: 'bi-gear' }
]

// Computed
const currentThemeText = computed(() => {
  return currentTheme.value === 'light' ? 'Modo Oscuro' : 'Modo Claro'
})

// Métodos
const toggleSidebar = () => {
  ui.toggleSidebar()
  // emit updated visibility for other components
  window.dispatchEvent(new CustomEvent('sidebar-visibility', { detail: { visible: !ui.state.sidebarCollapsed, collapsed: ui.state.sidebarCollapsed } }))
}

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: currentTheme.value } }))
}

const setActiveMenu = (menuId: string) => {
  try { sidebarApi.setActive(menuId) } catch (e) { /* fallback */ }
  showProfileMenu.value = false
  showLanguageMenu.value = false
}

const toggleSubmenu = (menuId: string) => {
  const index = expandedSubmenus.value.indexOf(menuId)
  if (index === -1) {
    expandedSubmenus.value.push(menuId)
  } else {
    expandedSubmenus.value.splice(index, 1)
  }
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showLanguageMenu.value = false
}

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
  showProfileMenu.value = false
}

const changeLanguage = (lang: Language) => {
  currentLanguage.value = lang
  localStorage.setItem('language', lang.code)
  showLanguageMenu.value = false

  // Aquí puedes implementar la lógica de cambio de idioma
  // Por ejemplo, usar i18n
}

const goToProfile = () => {
  router.push('/admin/profile')
}

const goToHome = () => {
  router.push('/')
}

const logout = () => {
  try {
    auth.logout()
  } catch (e) {
    // fallback
    localStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_token')
    router.push('/login')
  }
}

const handleQuickAction = (actionId: string) => {
  const item = menuItems.find(item => item.id === actionId)
  if (item) {
    if (item.path) {
      router.push(item.path)
    } else if (item.children && item.children.length > 0) {
      router.push(item.children[0].path!)
    }
  }
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar estado guardado
const loadSavedState = () => {
  const savedCollapsed = localStorage.getItem('sidebarCollapsed')
  if (savedCollapsed) {
    isCollapsed.value = JSON.parse(savedCollapsed)
  }

  const savedTheme = localStorage.getItem('theme') as Theme
  if (savedTheme) {
    currentTheme.value = savedTheme
    document.documentElement.setAttribute('data-bs-theme', savedTheme)
  }

  const savedLang = localStorage.getItem('language')
  if (savedLang) {
    const lang = languages.find(l => l.code === savedLang)
    if (lang) {
      currentLanguage.value = lang
    }
  }

  // Restaurar usuario activo (si se guardó)
  const savedUserId = localStorage.getItem('activeUserId')
  if (savedUserId) {
    const uid = Number(savedUserId)
    const found = mockUsers.value.find(m => m.id === uid)
    if (found) {
      user.value = { ...found }
    }
  }
}

onMounted(() => {
  loadSavedState()
  // Emitir estado inicial del sidebar para que App.vue oculte Header/Navbar si corresponde
  // Ensure auth state is loaded from storage / API before rendering
  try { auth.loadUser() } catch (e) { /* ignore */ }
  window.dispatchEvent(new CustomEvent('sidebar-visibility', { detail: { visible: !ui.state.sidebarCollapsed, collapsed: ui.state.sidebarCollapsed } }))
  // Integrar con la store de autenticación: si hay sesión, usar ese usuario y su rol
  auth.loadUser()
  if (auth.isAuthenticated.value && auth.user) {
    const au = (auth.user as any).value
    if (au) {
      user.value = {
        id: au.id || 0,
        name: `${au.nombre || ''}${au.apellido ? ' ' + au.apellido : ''}`.trim() || 'Usuario',
        email: au.correo || au.email || '',
        role: au.rol === 'A' ? 'Administrador' : au.rol === 'E' ? 'Empleado' : au.rol === 'C' ? 'Cliente' : (au.rol || 'Usuario'),
        roleCode: au.rol,
        avatar: au.foto_perfil || user.value.avatar,
        online: true
      }
    }
  }
  updateCurrentTime()

  // Actualizar la hora cada minuto
  const timer = setInterval(updateCurrentTime, 60000)

  // Cerrar menús al hacer clic fuera
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-profile')) {
      showProfileMenu.value = false
    }
    if (!target.closest('.language-selector')) {
      showLanguageMenu.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  // escuchar visibilidad del navbar para ocultar el sidebar cuando corresponda
  const handleNavbarVisibility = (e: Event) => {
    const ev = e as CustomEvent
    const detail = ev.detail || {}
    navbarVisible.value = !!detail.visible
  }
  window.addEventListener('navbar-visibility', handleNavbarVisibility)

  // Escuchar cambios de tema del sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleThemeChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = e.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
    }
  }

  mediaQuery.addEventListener('change', handleThemeChange)

  // Limpiar
  onUnmounted(() => {
    clearInterval(timer)
    document.removeEventListener('click', handleClickOutside)
    mediaQuery.removeEventListener('change', handleThemeChange)
    window.removeEventListener('navbar-visibility', handleNavbarVisibility)
  })
})
</script>

<style scoped>
.admin-sidebar {
  width: 280px;
  height: calc(100vh - var(--app-header-height, 64px));
  background: var(--color-light, white);
  border-right: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  left: 0;
  top: var(--app-header-height, 64px);
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
}

[data-bs-theme="dark"] .admin-sidebar {
  background: var(--color-light, #121212);
  border-right: 1px solid var(--color-gray-light, #2d2d2d);
}

.admin-sidebar.collapsed {
  width: 70px;
}

/* Header */
.sidebar-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

[data-bs-theme="dark"] .sidebar-header {
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.brand-logo:hover {
  transform: rotate(15deg);
}

.brand-text {
  flex: 1;
}

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
  letter-spacing: 0.5px;
}

.sidebar-toggle {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--color-light, white);
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

[data-bs-theme="dark"] .sidebar-toggle {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.sidebar-toggle:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  transform: translateX(-2px);
}

/* Logo debajo del header */
.logo-under-navbar {
  display:flex;
  align-items:center;
  gap:0.75rem;
  padding: 0.6rem 1rem;
  margin-top: calc(var(--app-header-height, 64px) - 12px);
  transition: all 0.2s ease;
}
.logo-under-navbar.collapsed { justify-content: center; padding: 0.4rem }
.logo-under-navbar .logo-image { height: 36px; width: 36px }
.logo-under-navbar .logo-label { font-weight:700; color:var(--color-dark,#212529) }

/* User Profile */
.user-profile {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

[data-bs-theme="dark"] .user-profile {
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.profile-image {
  position: relative;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  cursor: pointer;
}

.profile-image img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #dc3545;
  border: 2px solid var(--color-light, white);
}

[data-bs-theme="dark"] .online-status {
  border-color: var(--color-light, #121212);
}

.online-status.online {
  background: #28a745;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  color: var(--color-dark, #212529);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-bs-theme="dark"] .user-name {
  color: var(--color-dark, #F8F9FA);
}

.user-role {
  display: inline-block;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #1E9E4A);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-email {
  display: block;
  color: var(--color-gray, #6C757D);
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-profile-menu {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--color-light, white);
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

[data-bs-theme="dark"] .btn-profile-menu {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.btn-profile-menu:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 1.5rem;
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1001;
  overflow: hidden;
}

.user-switch-list {
  max-height: 220px;
  overflow-y: auto;
}

.user-switch {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.user-switch:hover {
  background: var(--color-lighter, #F1F6F3);
}

.switch-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.switch-info {
  flex: 1;
  min-width: 0;
}

.switch-name {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.switch-role {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

.user-switch.active-user {
  background: var(--gradient-primary);
  color: white;
}


[data-bs-theme="dark"] .profile-dropdown {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-dark, #212529);
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .dropdown-item {
  color: var(--color-dark, #F8F9FA);
}

.dropdown-item:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #1E9E4A);
}

[data-bs-theme="dark"] .dropdown-item:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.dropdown-item i {
  width: 20px;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-gray-light, #E9ECEF);
  margin: 0.5rem 0;
}

[data-bs-theme="dark"] .dropdown-divider {
  background: var(--color-gray-light, #2d2d2d);
}

/* Navigation Menu */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  color: var(--color-gray-dark, #495057);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

[data-bs-theme="dark"] .nav-link {
  color: var(--color-gray-dark, #ADB5BD);
}

.nav-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #1E9E4A);
}

[data-bs-theme="dark"] .nav-link:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

 .nav-item.active .nav-link {
  background: var(--color-primary, #a7b729);
  color: var(--color-light, white);
  position: relative;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  z-index: 1;
  font-weight: 700;
}

.nav-item.active .nav-link i {
  color: white;
}

.nav-item.active .nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  background: var(--color-primary, #a7b729);
  border-radius: 2px;
}

/* Ensure active indicator is visible when sidebar is collapsed */
.admin-sidebar.collapsed .nav-item.active .nav-link::before {
  left: 50%;
  top: 50%;
  bottom: auto;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* Make sure icon and badge contrast on active */
.nav-item.active .nav-link i,
.nav-item.active .nav-badge {
  color: var(--color-light, white);
}

.nav-link i {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  color: var(--color-gray, #6C757D);
  transition: all 0.3s ease;
}

.nav-item.active .nav-link i,
.nav-link:hover i {
  color: inherit;
}

.nav-text {
  flex: 1;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.admin-sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
}

.nav-badge {
  background: var(--color-primary, #1E9E4A);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.nav-item.active .nav-badge {
  background: white;
  color: var(--color-primary, #1E9E4A);
}

/* Submenu */
.submenu-toggle {
  justify-content: space-between;
}

.submenu-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.submenu-arrow {
  font-size: 0.875rem;
  transition: transform 0.3s ease;
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: var(--color-lighter, #F8F9FA);
  overflow: hidden;
}

[data-bs-theme="dark"] .submenu {
  background: var(--color-lighter, #1E1E1E);
}

.submenu-item {
  position: relative;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem 0.75rem 3.5rem;
  color: var(--color-gray, #6C757D);
  text-decoration: none;
  transition: all 0.3s ease;
}

.submenu-link:hover {
  color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.05);
}

.submenu-item.active .submenu-link {
  color: var(--color-primary, #1E9E4A);
  font-weight: 600;
  background: rgba(30, 158, 74, 0.1);
}

.submenu-link i {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.submenu-badge {
  background: var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: auto;
}

[data-bs-theme="dark"] .submenu-badge {
  background: var(--color-gray-light, #2d2d2d);
}

/* Quick Controls (collapsed mode) */
.quick-controls {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quick-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--color-light, white);
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .quick-btn {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.quick-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  transform: scale(1.1);
}

/* Compact vertical action menu shown when sidebar is collapsed */
.side-action-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
}

.side-action-menu .action-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--color-light, white);
  color: var(--color-primary, #1E9E4A);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

[data-bs-theme="dark"] .side-action-menu .action-btn {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
  color: var(--color-gray-dark, #ADB5BD);
}

.side-action-menu .action-btn:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary, #1E9E4A);
}

/* Mostrar etiquetas cuando el sidebar está expandido */
.admin-sidebar:not(.collapsed) .side-action-menu {
  flex-direction: row;
  justify-content: space-around;
  padding: 0.5rem 1rem;
}

.admin-sidebar:not(.collapsed) .side-action-menu .action-btn {
  width: auto;
  min-width: 120px;
  height: 40px;
  padding: 0 0.75rem;
  gap: 0.6rem;
  justify-content: flex-start;
}

.action-label {
  margin-left: 0.5rem;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
}

[data-bs-theme="dark"] .action-label { color: var(--color-gray-dark, #ADB5BD); }

.language-action { position: relative; }
.language-dropdown-mini {
  position: absolute;
  left: 52px;
  top: -6px;
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  padding: 0.25rem;
  z-index: 1200;
}

.lang-item {
  padding: 0.45rem 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.lang-item:hover { background: rgba(30,158,74,0.06); }

/* Sidebar Footer */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .sidebar-footer {
  border-top: 1px solid var(--color-gray-light, #2d2d2d);
}

.theme-toggle,
.language-selector,
.btn-go-home {
  margin-bottom: 1rem;
}

.theme-btn,
.language-btn,
.btn-go-home {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--color-light, white);
  color: var(--color-gray-dark, #495057);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .theme-btn,
[data-bs-theme="dark"] .language-btn,
[data-bs-theme="dark"] .btn-go-home {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
  color: var(--color-gray-dark, #ADB5BD);
}

.theme-btn:hover,
.language-btn:hover,
.btn-go-home:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .theme-btn:hover,
[data-bs-theme="dark"] .language-btn:hover,
[data-bs-theme="dark"] .btn-go-home:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

.system-info {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.system-info .info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.system-info .info-item i {
  width: 20px;
  text-align: center;
  color: var(--color-gray, #6C757D);
}

.admin-sidebar.collapsed .sidebar-footer {
  display: none;
}

/* Layout wrapper so sidebar and independent navbar sit together */
.sidebar-layout {
  position: relative;
}

/* Independent side navbar placed right to the sidebar */
.side-navbar {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 72px; /* collapsed width */
  background: transparent;
  display: flex;
  align-items: center;
  z-index: 999;
  transition: all 0.25s ease;
}

.side-navbar .side-navbar-inner {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
  background: var(--color-light, rgba(255,255,255,0.01));
  border-radius: 8px;
}

.side-navbar .nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem;
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  color: var(--color-primary, #1E9E4A);
  cursor: pointer;
}

.side-navbar .nav-btn i { font-size: 1.1rem; }
.side-navbar .nav-label { font-weight: 600; margin-left: 0.25rem; }

.side-navbar.collapsed { width: 72px; }
.side-navbar:not(.collapsed) { width: 180px; }

.language-dropdown-side {
  position: absolute;
  left: 100%;
  top: 8px;
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 1250;
}

.lang-side-item { display: block; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }

[data-bs-theme="dark"] .side-navbar .nav-btn { background: var(--color-light, #121212); border: 1px solid var(--color-gray-light, #2d2d2d); color: var(--color-gray-dark, #ADB5BD); }


</style>
