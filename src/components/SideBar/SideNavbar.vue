<template>
  <aside v-if="shouldRender" class="side-navbar top-header" :class="{ collapsed: isCollapsed }" :style="headerStyle" role="navigation" aria-label="Barra lateral de acciones">
    <div class="seam" aria-hidden="true"></div>

    <!-- Mobile hamburger button -->
    <button class="mobile-menu-btn" @click="ui.toggleSidebar" aria-label="Menú">
      <i class="bi bi-list"></i>
    </button>

    <div class="header-left" :class="{ collapsed: isCollapsed }">
      <div class="brand-logo-left">
        <router-link to="/Admin" aria-label="Ir a Admin">
          <img :src="logoUrl" alt="SENA" class="brand-img-left" />
        </router-link>
      </div>
    </div>

    <div class="controls">
      <!-- Toggle Sidebar - desktop -->
      <button class="nav-btn desktop-only" @click="ui.toggleSidebar" title="Alternar barra lateral">
        <i class="bi bi-list"></i>
        <span v-if="!isCollapsed" class="label">Menú</span>
      </button>

      <!-- Notifications
      <div class="dropdown notifications-wrapper" @click.stop>
        <button class="nav-btn" type="button" @click="toggleNotifications" title="Notificaciones">
          <i class="bi bi-bell"></i>
          <span v-if="unreadNotifications > 0" class="notification-badge">{{ unreadNotifications }}</span>
          <span v-if="!isCollapsed" class="label hide-mobile">Notificaciones</span>
        </button>

        <div v-if="showNotifications" class="dropdown-menu notifications-dropdown show">
          <div class="dropdown-header d-flex justify-content-between align-items-center">
            <strong>Notificaciones</strong>
            <button class="btn btn-sm btn-link" @click="markAllAsRead">Marcar todas</button>
          </div>
          <div class="notification-list">
            <div v-for="note in notificationsList" :key="note.id" class="notification-item" :class="{ 'unread': !note.read }">
              <div class="notification-icon"><i :class="note.icon"></i></div>
              <div class="notification-content">
                <p class="mb-0">{{ note.message }}</p>
                <small class="text-muted">{{ note.time }}</small>
              </div>
            </div>
          </div>
          <div class="dropdown-footer text-center">
            <router-link to="/admin/notifications">Ver todas</router-link>
          </div>
        </div>
      </div>-->

      <!-- Language Selector - hide on mobile
      <div class="dropdown language-dropdown-wrapper hide-mobile" @click.stop>
        <button class="nav-btn" type="button" :aria-expanded="showLang" @click="toggleLanguage" title="Idioma">
          <img class="language-flag" :src="getFlag(currentLanguage.code)" alt="" />
          <span v-if="!isCollapsed" class="label">Idioma</span>
        </button>

        <ul v-if="showLang" class="dropdown-menu lang-menu show">
          <li v-for="lang in languages" :key="lang.code">
            <button class="dropdown-item lang-item" @click="selectLanguage(lang)">
              <img class="language-flag" :src="getFlag(lang.code)" alt="" />
              {{ lang.name }}
            </button>
          </li>
        </ul>
      </div>-->

      <!-- Theme Toggle -->
      <button class="nav-btn theme-btn" @click="toggleTheme" :title="theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'">
        <i class="bi" :class="theme === 'light' ? 'bi-moon-stars' : 'bi-sun-fill'"></i>
        <span v-if="!isCollapsed" class="label hide-mobile">{{ theme === 'light' ? 'Oscuro' : 'Claro' }}</span>
      </button>

      <!-- Home Button - hide on mobile -->
      <button class="nav-btn hide-mobile" @click="goToHome">
        <i class="bi bi-house-door"></i>
        <span v-if="!isCollapsed" class="label">Inicio</span>
      </button>

      <!-- User Area -->
      <div class="user-area-wrapper" @click.stop>
        <button class="user-area" @click="toggleProfileMenu" :aria-expanded="showProfileMenu">
          <div class="avatar">
            <img v-if="avatarSrc && !showInitials" :src="avatarSrc" :alt="displayName" @error="onAvatarError" />
            <div v-else class="initials">{{ initials }}</div>
          </div>
          <div class="user-meta hide-mobile" v-if="!isCollapsed">
            <div class="name">{{ displayName }}</div>
            <div class="role">{{ displayRole }}</div>
          </div>
          <i class="bi bi-chevron-down profile-caret hide-mobile" v-if="!isCollapsed"></i>
        </button>

        <div v-if="showProfileMenu" class="profile-dropdown-side">
          <router-link to="/adminperfil" class="dropdown-item">
            <i class="bi bi-person"></i>
            <span>Mi Perfil</span>
          </router-link>
          <button class="dropdown-item" @click="goToRolePage">
            <i class="bi bi-box-arrow-up-right"></i>
            <span>Ir a mi sección</span>
          </button>
          <router-link to="/admin/settings" class="dropdown-item">
            <i class="bi bi-gear"></i>
            <span>Configuración</span>
          </router-link>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout-btn" @click="logout">
            <i class="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/compasable/useAuthStore'
import useUiStore from '@/compasable/useUiStore'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const logoUrl = computed(() => {
  const darkLogo = new URL('../../image/Logo-blanco.svg', import.meta.url).href
  const lightLogo = new URL('../../image/Logo SENA.svg', import.meta.url).href
  return (ui.state.theme === 'dark') ? darkLogo : lightLogo
})

const isCollapsed = computed(() => ui.state.sidebarCollapsed)
const theme = computed(() => ui.state.theme)

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' }
]

const currentLanguage = computed(() => languages.find(l => l.code === (ui.state.language || 'es')) || languages[0])
const showLang = ref(false)
const showProfileMenu = ref(false)
const showNotifications = ref(false)
const showInitials = ref(false)
const isMobile = ref(false)

const notificationsList = ref([
  { id: 1, message: 'Nuevo evento de calibración programado', time: 'Hace 5 minutos', read: false, icon: 'bi bi-calendar-plus' },
  { id: 2, message: 'Nuevo usuario registrado: Juan Pérez', time: 'Hace 1 hora', read: false, icon: 'bi bi-person-plus' },
  { id: 3, message: 'Actualización del sistema completada', time: 'Hace 3 horas', read: true, icon: 'bi bi-gear' }
])

const unreadNotifications = computed(() => notificationsList.value.filter(n => !n.read).length)

const getFlag = (code: string) => {
  const map: Record<string, string> = { es: 'mx', en: 'us', fr: 'fr' }
  const c = (map[code.toLowerCase()] || 'us')
  return `https://flagcdn.com/w20/${c}.png`
}

const authUser = auth.user

const displayName = computed(() => {
  const au: any = authUser?.value || null

  if (au) {
    const first = au.nombre || au.firstName || ''
    const last = au.apellido || au.lastName || ''
    const fullname = `${first} ${last}`.trim()
    if (fullname && !fullname.includes('@')) return fullname
    if (au.name && !au.name.includes('@')) return au.name
  }
  return 'Usuario'
})

const displayRole = computed(() => {
  const au: any = authUser?.value || null
  const code = au?.rol || ''
  if (!code) return 'Usuario'
  if (code === 'A') return 'Administrador'
  if (code === 'E') return 'Empleado'
  if (code === 'C') return 'Cliente'
  return String(code)
})

const initials = computed(() => {
  return ((displayName.value || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 1))
})

const API_BASE = (import.meta.env?.VITE_API_BASE as string) || `${window.location.protocol}//${window.location.host}`

const avatarSrc = computed(() => {
  const au: any = authUser?.value || null
  if (showInitials.value) return ''
  let a = ''
  if (au) a = au.foto_perfil || au.avatarUrl || au.foto || ''
  if (!a) return ''
  if (a.startsWith('http')) return a
  if (a.startsWith('/')) return `${API_BASE}${a}`
  return a
})

const onAvatarError = () => {
  showInitials.value = true
}

const shouldRender = computed(() => {
  return !ui.state.navbarVisible && auth.isAuthenticated.value
})

const headerStyle = computed(() => ({
  position: 'fixed' as const,
  top: ui.state.navbarVisible ? 'var(--navbar-height, 0px)' : '0px',
  left: '0px',
  right: '0px',
  height: isMobile.value ? '56px' : '64px',
  display: 'flex',
  alignItems: 'center',
  padding: isMobile.value ? '4px 8px' : '8px 16px',
  zIndex: 4000
}))

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showLang.value = false
  showProfileMenu.value = false
}

const markAllAsRead = () => {
  notificationsList.value.forEach(n => n.read = true)
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showLang.value = false
}

const toggleLanguage = () => {
  showLang.value = !showLang.value
}

const selectLanguage = (lang: { code: string; name: string }) => {
  ui.setLanguage(lang.code)
  showLang.value = false
}

const toggleTheme = () => {
  ui.toggleTheme()
}

const goToHome = () => {
  router.push('/').catch(() => {})
}

const goToRolePage = () => {
  const au = (auth.user as any) || null
  const role = au?.rol || ''
  if (role === 'A') router.push('/Seccion_Admin')
  else if (role === 'E') router.push('/EmpleadosDashboard')
  else if (role === 'C') router.push('/ClientesDashboard')
  else router.push('/')
  showProfileMenu.value = false
}

const logout = () => {
  try { auth.logout() } catch (e) { /* fallback */ }
  router.push('/login').catch(() => {})
}

onMounted(() => {
  checkMobile()
  document.documentElement.style.setProperty('--app-header-height', isMobile.value ? '56px' : '64px')

  window.addEventListener('resize', () => {
    checkMobile()
    document.documentElement.style.setProperty('--app-header-height', isMobile.value ? '56px' : '64px')
  })
})
</script>

<style scoped>

:root {
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --radius-sm: 10px;
  --shadow-sm: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
}

/* ============================================================
   TOP HEADER - Modo Claro
   ============================================================ */
.side-navbar.top-header {
  font-family: var(--font-body);
  background: #ffffff;
  border-bottom: 1px solid #e0e5da;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.side-navbar.top-header .seam {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  pointer-events: none;
  z-index: 1061;
  background: linear-gradient(90deg, rgba(93,138,47,0.0) 0%, rgba(93,138,47,0.04) 50%, rgba(93,138,47,0.0) 100%);
}

/* ============================================================
   MOBILE MENU BUTTON
   ============================================================ */
.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e0e5da;
  background: #f8faf7;
  color: #5d8a2f;
  font-size: 1.3rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  flex-shrink: 0;
}

.mobile-menu-btn:hover {
  background: #f0f4ea;
  border-color: #5d8a2f;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-left: 12px;
}

.brand-logo-left {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-img-left {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transform: scale(1.9);
  transform-origin: center;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

/* ============================================================
   NAV BUTTONS
   ============================================================ */
.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-sm);
  background: #f8faf7;
  border: 1px solid #e0e5da;
  color: #4a5a40;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.85rem;
  white-space: nowrap;
}

.nav-btn i {
  font-size: 1.1rem;
  color: #5d8a2f;
}

.nav-btn:hover {
  background: #f0f4ea;
  border-color: #5d8a2f;
  color: #1a2612;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(93,138,47,0.08);
}

.nav-btn:hover i {
  color: #5d8a2f;
}

.label {
  font-weight: 500;
  color: #4a5a40;
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications-wrapper {
  position: relative;
}

/* ============================================================
   LANGUAGE SELECTOR
   ============================================================ */
.language-flag {
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.lang-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: #ffffff;
  border: 1px solid #e0e5da;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  z-index: 1300;
  min-width: 180px;
  padding: 0.35rem 0;
}

.lang-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  color: #4a5a40;
  font-size: 0.85rem;
  transition: background 0.2s ease;
}

.lang-item:hover {
  background: #f0f4ea;
  color: #1a2612;
}

/* ============================================================
   USER AREA
   ============================================================ */
.user-area-wrapper {
  position: relative;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  background: #f8faf7;
  border: 1px solid transparent;
  font-family: var(--font-body);
}

.user-area:hover {
  background: #f0f4ea;
  border-color: #e0e5da;
}

.avatar {
  position: relative;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e5da;
}

.initials {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5d8a2f, #7aab3d);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  font-family: var(--font-display);
}

.user-meta .name {
  font-weight: 600;
  color: #1a2612;
  font-size: 0.85rem;
  line-height: 1.2;
}

.user-meta .role {
  font-size: 0.75rem;
  color: #6b7a60;
  font-weight: 500;
}

.profile-caret {
  margin-left: 4px;
  font-size: 0.7rem;
  color: #8a9a7e;
}

/* ============================================================
   PROFILE DROPDOWN
   ============================================================ */
.profile-dropdown-side {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: #ffffff;
  border: 1px solid #e0e5da;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  z-index: 1350;
  min-width: 220px;
  overflow: hidden;
  padding: 0.35rem 0;
}

.profile-dropdown-side .dropdown-item {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  padding: 0.6rem 1rem;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #4a5a40;
  font-size: 0.85rem;
  text-decoration: none;
  transition: background 0.2s ease;
}

.profile-dropdown-side .dropdown-item:hover {
  background: #f0f4ea;
  color: #1a2612;
}

.profile-dropdown-side .dropdown-item i {
  font-size: 1rem;
  color: #5d8a2f;
  width: 20px;
  text-align: center;
}

.profile-dropdown-side .dropdown-divider {
  height: 1px;
  background: #e0e5da;
  margin: 0.35rem 0;
}

.profile-dropdown-side .logout-btn {
  color: #dc3545;
}

.profile-dropdown-side .logout-btn:hover {
  background: #fff5f5;
}

.profile-dropdown-side .logout-btn i {
  color: #dc3545;
}

/* ============================================================
   NOTIFICATIONS DROPDOWN
   ============================================================ */
.notifications-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: #ffffff;
  border: 1px solid #e0e5da;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  z-index: 1300;
  width: 320px;
  max-height: 400px;
  overflow: hidden;
}

.notifications-dropdown .dropdown-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e5da;
  background: #f8faf7;
}

.notifications-dropdown .dropdown-header strong {
  color: #1a2612;
  font-size: 0.9rem;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f4ea;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #f8faf7;
}

.notification-item.unread {
  background: #f0f4ea;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #edf4e3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon i {
  font-size: 0.85rem;
  color: #5d8a2f;
}

.notification-content p {
  font-size: 0.82rem;
  color: #2a3a20;
  line-height: 1.4;
  margin-bottom: 0.2rem;
}

.notification-content small {
  font-size: 0.7rem;
  color: #8a9a7e;
}

.dropdown-footer {
  padding: 0.5rem;
  border-top: 1px solid #e0e5da;
  background: #f8faf7;
}

.dropdown-footer a {
  color: #5d8a2f;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
}

/* ============================================================
   COLLAPSED STATE
   ============================================================ */
.side-navbar.top-header.collapsed .label,
.side-navbar.top-header.collapsed .user-meta,
.side-navbar.top-header.collapsed .profile-caret {
  display: none;
}

.side-navbar.top-header.collapsed .nav-btn {
  padding: 0.45rem 0.5rem;
}

/* ============================================================
   MODO OSCURO
   ============================================================ */
[data-bs-theme="dark"] .side-navbar.top-header {
  background: #131a0e;
  border-bottom: 1px solid rgba(122,171,61,0.12);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

[data-bs-theme="dark"] .mobile-menu-btn {
  background: rgba(122,171,61,0.08);
  border-color: rgba(122,171,61,0.12);
  color: #7aab3d;
}

[data-bs-theme="dark"] .mobile-menu-btn:hover {
  background: rgba(122,171,61,0.12);
  border-color: #7aab3d;
}

[data-bs-theme="dark"] .nav-btn {
  background: rgba(122,171,61,0.08);
  border: 1px solid rgba(122,171,61,0.12);
  color: #c8d8be;
}

[data-bs-theme="dark"] .nav-btn i {
  color: #7aab3d;
}

[data-bs-theme="dark"] .nav-btn:hover {
  background: rgba(122,171,61,0.12);
  border-color: #7aab3d;
  color: #e0ecd6;
  box-shadow: 0 4px 12px rgba(93,138,47,0.15);
}

[data-bs-theme="dark"] .label {
  color: #c8d8be;
}

[data-bs-theme="dark"] .lang-menu,
[data-bs-theme="dark"] .notifications-dropdown,
[data-bs-theme="dark"] .profile-dropdown-side {
  background: #1a2412;
  border: 1px solid rgba(122,171,61,0.12);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

[data-bs-theme="dark"] .lang-item,
[data-bs-theme="dark"] .profile-dropdown-side .dropdown-item {
  color: #c8d8be;
}

[data-bs-theme="dark"] .lang-item:hover,
[data-bs-theme="dark"] .profile-dropdown-side .dropdown-item:hover {
  background: rgba(122,171,61,0.1);
  color: #e0ecd6;
}

[data-bs-theme="dark"] .user-area {
  background: rgba(122,171,61,0.08);
}

[data-bs-theme="dark"] .user-area:hover {
  background: rgba(122,171,61,0.12);
  border-color: rgba(122,171,61,0.2);
}

[data-bs-theme="dark"] .user-meta .name {
  color: #e0ecd6;
}

[data-bs-theme="dark"] .user-meta .role {
  color: #8a9e7c;
}

[data-bs-theme="dark"] .avatar img {
  border-color: rgba(122,171,61,0.2);
}

[data-bs-theme="dark"] .profile-dropdown-side .dropdown-divider,
[data-bs-theme="dark"] .notifications-dropdown .dropdown-header,
[data-bs-theme="dark"] .dropdown-footer {
  border-color: rgba(122,171,61,0.1);
  background: rgba(122,171,61,0.05);
}

[data-bs-theme="dark"] .notification-item {
  border-bottom-color: rgba(122,171,61,0.06);
}

[data-bs-theme="dark"] .notification-item.unread {
  background: rgba(122,171,61,0.08);
}

[data-bs-theme="dark"] .notification-content p {
  color: #c8d8be;
}

[data-bs-theme="dark"] .dropdown-footer a {
  color: #7aab3d;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
/* Tablet and below */
@media (max-width: 991px) {
  .desktop-only {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .hide-mobile {
    display: none !important;
  }

  .controls {
    gap: 0.35rem;
  }

  .nav-btn {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
    min-width: 38px;
    justify-content: center;
  }

  .nav-btn i {
    margin: 0;
  }

  .brand-logo-left {
    width: 44px;
    height: 44px;
  }

  .brand-img-left {
    transform: scale(1.4);
  }

  .notifications-dropdown {
    width: 280px;
    right: -40px;
  }

  .profile-dropdown-side {
    right: -20px;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .side-navbar.top-header {
    padding: 4px 6px;
    gap: 0.25rem;
  }

  .header-left {
    padding-left: 4px;
  }

  .brand-logo-left {
    width: 36px;
    height: 36px;
  }

  .brand-img-left {
    transform: scale(1.1);
  }

  .mobile-menu-btn {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .controls {
    gap: 0.25rem;
  }

  .nav-btn {
    padding: 0.35rem;
    min-width: 34px;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .nav-btn i {
    font-size: 1rem;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }

  .initials {
    font-size: 0.8rem;
  }

  .notifications-dropdown {
    width: 260px;
    right: -60px;
  }

  .profile-dropdown-side {
    min-width: 200px;
    right: -30px;
  }

  .notification-badge {
    width: 16px;
    height: 16px;
    font-size: 0.6rem;
    top: 0px;
    right: 0px;
  }
}

/* Very small devices */
@media (max-width: 380px) {
  .brand-logo-left {
    width: 30px;
    height: 30px;
  }

  .brand-img-left {
    transform: scale(1);
  }

  .nav-btn {
    padding: 0.3rem;
    min-width: 30px;
  }

  .nav-btn i {
    font-size: 0.9rem;
  }

  .mobile-menu-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
