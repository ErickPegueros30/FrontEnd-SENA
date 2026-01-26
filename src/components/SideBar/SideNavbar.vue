<template>
  <aside v-if="shouldRender" class="side-navbar top-header" :class="{ collapsed: isCollapsed }" :style="headerStyle" role="navigation" aria-label="Barra lateral de acciones">
    <div class="seam" aria-hidden="true"></div>
    <div class="controls">
      <!-- Botón de idioma: versión tipo navbar (dropdown con bandera) -->
      <div class="dropdown language-dropdown-wrapper" @click.stop>
        <button
          class="language-selector nav-btn dropdown-toggle"
          type="button"
          :aria-expanded="showLang"
          @click="toggleLanguage"
          title="Idioma"
        >
          <img class="language-flag" :src="getFlag(currentLanguage.code)" alt="" />
          <span v-if="!isCollapsed" class="label">{{ currentLanguage.name }}</span>
        </button>

        <ul v-if="showLang" class="dropdown-menu lang-menu show language-dropdown" style="right:0; top: calc(100% + 6px);">
          <li v-for="lang in languages" :key="lang.code">
            <button class="dropdown-item lang-item" @click="selectLanguage(lang)">
              <img class="language-flag" :src="getFlag(lang.code)" alt="" style="width:20px; height:14px; margin-right:8px;"/>
              {{ lang.name }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Botón de modo (después del usuario) -->
      <button class="nav-btn theme-btn" @click="toggleTheme" :title="theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'">
        <i class="bi" :class="theme === 'light' ? 'bi-moon' : 'bi-sun'"></i>
        <span v-if="!isCollapsed" class="label">{{ theme === 'light' ? 'Modo Oscuro' : 'Modo Claro' }}</span>
      </button>

      <!-- Botón Ir a Página Principal -->
      <button class="btn-go-home" @click="goToHome">
        <i class="bi bi-house-door"></i>
        <span>Ir a Página</span>
      </button>

      <!-- Área de usuario con dropdown/submenu (después del idioma) -->
      <div class="user-area-wrapper" @click.stop>
        <div class="user-area" @click="toggleProfileMenu" :aria-expanded="showProfileMenu">
          <div class="avatar">
            <img v-if="user.avatar" :src="user.avatar" :alt="user.name"/>
            <div v-else class="initials">{{ initials }}</div>
            <div class="status" :class="{ online: user.online }"></div>
          </div>
          <div class="user-meta" v-if="!isCollapsed">
            <div class="name">{{ user.name }}</div>
            <div class="role">{{ user.role }}</div>
          </div>
          <i class="bi bi-chevron-down profile-caret" v-if="!isCollapsed"></i>
        </div>

        <div v-if="showProfileMenu" class="profile-dropdown-side">
          <router-link to="/admin/profile" class="dropdown-item"> <i class="bi bi-person"></i> <span>Mi Perfil</span> </router-link>
          <button class="dropdown-item" @click="goToRolePage"> <i class="bi bi-box-arrow-up-right"></i> <span>Ir a mi sección</span> </button>
          <router-link to="/admin/settings" class="dropdown-item"> <i class="bi bi-gear"></i> <span>Configuración</span> </router-link>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" @click="logout"> <i class="bi bi-box-arrow-right"></i> <span>Cerrar Sesión</span> </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/compasable/useAuthStore'
import useUiStore from '@/compasable/useUiStore'

const router = useRouter()
const auth = useAuthStore()

// reactive state using central UI store
const ui = useUiStore()
const isCollapsed = computed(() => ui.state.sidebarCollapsed)
const theme = computed(() => ui.state.theme)
const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' }
]
const currentLanguage = computed(() => languages.find(l => l.code === (ui.state.language || 'es')) || languages[0])
const showLang = ref(false)

const getFlag = (code: string) => {
  const map: Record<string, string> = { es: 'mx', en: 'us', fr: 'fr' }
  const c = (map[code.toLowerCase()] || 'us')
  return `https://flagcdn.com/w20/${c}.png`
}
const menuItems = ref<any[]>([])
const activeTop = ref<string>('')

// user fallback (mirrors sidebar.vue mock users)
const user = ref<any>({ id: 0, name: 'Usuario', role: '', avatar: '', online: false })


// mock users copied from sidebar to provide fallback menu mapping
const mockUsers = [
  {
    id: 1,
    name: 'Administrador',
    role: 'Administrador',
    roleCode: 'A',
    avatar: 'https://ui-avatars.com/api/?name=Administrador&background=1E9E4A&color=fff',
    online: true,
    menu: [
      { id: 'dashboard', title: 'Inicio', icon: 'bi-speedometer2', path: '/AdminDashboard' },
      { id: 'categorias', title: 'Categorías', icon: 'bi-tags', path: '/AdminCategorias' },
      { id: 'usuarios', title: 'Usuarios', icon: 'bi-people', path: '/AdminUsuarios' }
    ]
  },
  {
    id: 2,
    name: 'Empleado',
    role: 'Empleado',
    roleCode: 'E',
    avatar: 'https://ui-avatars.com/api/?name=Empleado&background=667eea&color=fff',
    online: true,
    menu: [
      { id: 'dashboard', title: 'Inicio', icon: 'bi-speedometer2', path: '/EmpleadosDashboard' },
      { id: 'pagos', title: 'Pagos', icon: 'bi-credit-card', path: '/AdminPagosGestion' }
    ]
  },
  {
    id: 3,
    name: 'Cliente',
    role: 'Cliente',
    roleCode: 'C',
    avatar: 'https://ui-avatars.com/api/?name=Cliente&background=764ba2&color=fff',
    online: true,
    menu: [
      { id: 'dashboard', title: 'Inicio', icon: 'bi-speedometer2', path: '/ClientesDashboard' },
      { id: 'cursos', title: 'Cursos', icon: 'bi-mortarboard', path: '/AlumnoDashboard' }
    ]
  }
]

const initials = computed(() => {
  return (user.value.name || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const showProfileMenu = ref(false)

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showLang.value = false
}

const logout = () => {
  // preferir usar la store si está disponible
  try { auth.logout() } catch (e) { /* fallback */ }
  router.push('/login').catch(() => {})
}

const goToRolePage = () => {
  const au = (auth.user as any) || null
  const role = au?.rol || user.value.roleCode
  if (role === 'A') router.push('/Seccion_Admin')
  else if (role === 'E') router.push('/EmpleadosDashboard')
  else if (role === 'C') router.push('/ClientesDashboard')
  else router.push('/')
  showProfileMenu.value = false
}

const shouldRender = computed(() => !!(ui.state.sidebarVisible && !ui.state.navbarVisible))

const headerStyle = computed(() => {
  const left = ui.state.sidebarCollapsed ? '70px' : '280px'
  return {
    position: 'fixed',
    top: '0px',
    left,
    right: '0px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    background: 'var(--card-bg, var(--color-light, #fff))',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    borderBottom: '1px solid var(--color-gray-light, #E9ECEF)',
    zIndex: 1060,
    borderRadius: '0'
  }
})

const toggleTheme = () => {
  ui.toggleTheme()
}

const toggleLanguage = () => {
  showLang.value = !showLang.value
}

const selectLanguage = (lang: { code: string; name: string }) => {
  ui.setLanguage(lang.code)
  showLang.value = false
}

const goHome = () => {
  router.push('/').catch(() => {})
}

const navigateTo = (item: any) => {
  activeTop.value = item.id
  if (item.path) router.push(item.path)
}

const goToProfile = () => {
  router.push('/admin/profile').catch(() => {})
}

// load user/menu from auth store or fallback to mockUsers/localStorage
const loadState = () => {
  auth.loadUser()
  const au = (auth.user as any) || null
  if (au) {
    user.value = {
      id: au.id || 0,
      name: `${au.nombre || au.name || 'Usuario'}`,
      role: au.rol === 'A' ? 'Administrador' : au.rol === 'E' ? 'Empleado' : au.rol === 'C' ? 'Cliente' : (au.rol || 'Usuario'),
      avatar: au.foto_perfil || au.foto || '' ,
      online: true
    }
    // set menu by role
    if (au.rol === 'A') menuItems.value = mockUsers[0].menu
    else if (au.rol === 'E') menuItems.value = mockUsers[1].menu
    else if (au.rol === 'C') menuItems.value = mockUsers[2].menu
    else menuItems.value = mockUsers[0].menu
  } else {
    // fallback using localStorage activeUserId
    const saved = localStorage.getItem('activeUserId')
    const id = saved ? Number(saved) : 1
    const found = mockUsers.find(m => m.id === id) || mockUsers[0]
    user.value = { ...found }
    menuItems.value = found.menu
  }
  if (menuItems.value.length) activeTop.value = menuItems.value[0].id
}

onMounted(() => {
  loadState()
  const savedLang = localStorage.getItem('language')
  if (savedLang) {
    const f = languages.find(l => l.code === savedLang)
    if (f) currentLanguage.value = f
  }
  // sync with UI store
  // if needed, ensure UI store initialized by App
  // nothing to attach: we read from ui.state directly
})

onUnmounted(() => {
  window.removeEventListener('sidebar-visibility', handleSidebarVisibility)
  window.removeEventListener('navbar-visibility', handleNavbarVisibility)
})
</script>

<style scoped>
.side-navbar {
  position: fixed;
  top: 12px;
  right: 12px; /* now anchored to the right */
  z-index: 1050;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  pointer-events: auto;
  background: transparent;
}

.side-navbar.collapsed { right: 12px; }

.controls { display:flex; align-items:center; gap:0.5rem; }

.nav-btn { display:flex; align-items:center; gap:0.5rem; padding: 0.45rem 0.6rem; border-radius:8px; background: var(--color-light, white); border:1px solid var(--color-gray-light,#E9ECEF); cursor:pointer }
.nav-btn i { font-size:1.05rem }
.label { font-weight:600 }
.lang-menu { position:absolute; right: 100%; top: calc(100% + 6px); background:var(--color-light,#fff); border:1px solid var(--color-gray-light,#E9ECEF); border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.12); z-index:1300 }
.lang-item { display:block; padding:0.45rem 0.75rem; border:none; background:none; cursor:pointer }

.language-selector { display:flex; align-items:center; gap:0.5rem; padding: 0.35rem 0.6rem }
.language-flag { width:20px; height:14px; object-fit:cover; border-radius:2px }

.user-area-wrapper { position: relative }
.user-area { display:flex; align-items:center; gap:0.5rem; padding: 0.35rem 0.5rem; border-radius:8px; cursor:pointer; background: transparent }
.avatar { position: relative; width: 40px; height: 40px; flex-shrink: 0 }
.avatar img { width:100%; height:100%; border-radius:50%; object-fit:cover }
.initials { width:100%; height:100%; border-radius:50%; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg,#667eea,#764ba2); color:#fff; font-weight:700 }
.status { position:absolute; right:-2px; bottom:-2px; width:10px; height:10px; border-radius:50%; border:2px solid var(--color-light,#fff); background:#dc3545 }
.status.online { background:#28a745 }
.user-meta .name { font-weight:700 }
.user-meta .role { font-size:0.82rem; color:var(--color-gray,#6C757D) }
.profile-caret { margin-left:6px; font-size:0.9rem; color:var(--color-gray,#6C757D) }

.profile-dropdown-side { position:absolute; right:0; top: calc(100% + 8px); background:var(--color-light,#fff); border:1px solid var(--color-gray-light,#E9ECEF); border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.12); z-index:1350; min-width:200px; overflow:hidden }
.profile-dropdown-side .dropdown-item { display:flex; gap:0.6rem; align-items:center; padding:0.6rem 0.9rem; background:none; border:none; width:100%; text-align:left; cursor:pointer }
.profile-dropdown-side .dropdown-divider { height:1px; background:var(--color-gray-light,#E9ECEF); margin:0.35rem 0 }

/* When collapsed show only icons */
.side-navbar.collapsed .label,
.side-navbar.collapsed .user-meta { display:none }

@media (max-width: 991px) { .side-navbar { display:none } }
</style>

<style scoped>
/* Top header appearance when connected to sidebar */
.side-navbar.top-header {
  position: fixed;
  top: 0;
  height: 64px;
  align-items: center;
  padding: 8px 12px;
  display: flex;
  gap: 0.6rem;
  background: var(--card-bg, var(--color-light, #fff));
  border-bottom: 1px solid var(--color-gray-light,#E9ECEF);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  border-radius: 0;
  left: auto; /* left is set inline via headerStyle */
  right: 0; /* ensure full width to the edge */
}

.side-navbar.top-header .seam {
  position: absolute;
  left: 0; /* sits exactly at header's left edge which matches sidebar's right */
  top: 0;
  bottom: 0;
  width: 8px;
  pointer-events: none;
  z-index: 1061;
  background: linear-gradient(90deg, rgba(30,158,74,0.0) 0%, rgba(30,158,74,0.06) 30%, rgba(30,158,74,0.12) 50%, rgba(30,158,74,0.06) 70%, rgba(30,158,74,0.0) 100%);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  backdrop-filter: blur(4px);
}

.side-navbar.top-header .controls { display:flex; align-items:center; gap:0.6rem; margin-left: auto; justify-content: flex-end }
.side-navbar.top-header .user-area .avatar { width:36px; height:36px }
.side-navbar.top-header .btn-go-home, .side-navbar.top-header .nav-btn { padding:6px 10px }

/* ensure page content below header has space (document-level CSS used by app) */
@media (min-width: 0px) {
  :root { --app-header-height: 64px }
}

@media (max-width: 991px) { .side-navbar.top-header { left: 0; right: 0; border-radius: 0 } }
</style>

<style scoped>
/* Enhanced visual parity with the sidebar: buttons, user area and interactions */
.side-navbar.top-header { background: var(--color-light, #ffffff); }
.side-navbar.top-header[data-bs-theme="dark"] { background: var(--color-dark, #0f1416); }

.side-navbar.top-header .controls { gap: 0.6rem; }

/* Nav buttons use same card/button style as sidebar controls */
.side-navbar.top-header .nav-btn,
.side-navbar.top-header .btn-go-home,
.side-navbar.top-header .theme-btn,
.side-navbar.top-header .language {
  display:flex;
  align-items:center;
  gap:0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius:10px;
  background: linear-gradient(180deg, rgba(255,255,255,0.99), rgba(250,250,250,0.95));
  border: 1px solid var(--color-gray-light,#E9ECEF);
  color: var(--color-gray-dark,#495057);
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
}

.side-navbar.top-header[data-bs-theme="dark"] .nav-btn,
.side-navbar.top-header[data-bs-theme="dark"] .btn-go-home,
.side-navbar.top-header[data-bs-theme="dark"] .theme-btn,
.side-navbar.top-header[data-bs-theme="dark"] .language {
  background: linear-gradient(180deg, rgba(20,20,20,0.9), rgba(18,18,18,0.95));
  border: 1px solid rgba(255,255,255,0.04);
  color: var(--color-gray-dark,#ADB5BD);
}

.side-navbar.top-header .nav-btn:hover,
.side-navbar.top-header .theme-btn:hover,
.side-navbar.top-header .btn-go-home:hover,
.side-navbar.top-header .language:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary,#1E9E4A);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  color: var(--color-primary,#1E9E4A);
}

/* Make icons a consistent size and weight */
.side-navbar.top-header .nav-btn i,
.side-navbar.top-header .theme-btn i,
.side-navbar.top-header .btn-go-home i,
.side-navbar.top-header .language i { font-size:1.05rem }

/* User area styling to match sidebar profile */
.side-navbar.top-header .user-area { padding:0.25rem 0.5rem; background: transparent; border-radius: 8px; transition: transform .12s ease, box-shadow .12s ease }
.side-navbar.top-header .user-area:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,0.06) }
.side-navbar.top-header .user-meta { display:flex; flex-direction:column; align-items:flex-start }
.side-navbar.top-header .name { font-weight:700; font-size:0.95rem }
.side-navbar.top-header .role { font-size:0.8rem; color:var(--color-gray,#6C757D) }

/* Profile dropdown matches sidebar dropdown */
.side-navbar.top-header .profile-dropdown-side { top: calc(100% + 6px); right: 0; min-width:220px }
.side-navbar.top-header .profile-dropdown-side .dropdown-item { padding:0.6rem 0.9rem }

/* Language menu aligned to right and styled */
.side-navbar.top-header .lang-menu { right: 0; top: calc(100% + 6px); min-width:150px }
.side-navbar.top-header .lang-item { padding:0.5rem 0.75rem }

/* Button subtle glass effect */
.side-navbar.top-header .nav-btn,
.side-navbar.top-header .btn-go-home,
.side-navbar.top-header .theme-btn,
.side-navbar.top-header .language {
  background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(250,250,250,0.7));
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}
.side-navbar.top-header[data-bs-theme="dark"] .nav-btn,
.side-navbar.top-header[data-bs-theme="dark"] .btn-go-home,
.side-navbar.top-header[data-bs-theme="dark"] .theme-btn,
.side-navbar.top-header[data-bs-theme="dark"] .language {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
}

/* Compact: when collapsed show only icons */
.side-navbar.top-header.collapsed .label { display:none }
.side-navbar.top-header.collapsed .user-meta { display:none }

/* Small screens: compact spacing */
@media (max-width: 992px) {
  .side-navbar.top-header { height:56px }
  .side-navbar.top-header .nav-btn, .side-navbar.top-header .btn-go-home { padding:6px }
}
</style>
