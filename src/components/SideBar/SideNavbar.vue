<template>
  <aside v-if="shouldRender" class="side-navbar top-header" :class="{ collapsed: isCollapsed }" :style="headerStyle" role="navigation" aria-label="Barra lateral de acciones">
    <div class="seam" aria-hidden="true"></div>
    <div class="header-left" :class="{ collapsed: isCollapsed }">
      <div class="brand-logo-left">
        <img :src="logoUrl" alt="SENA" class="brand-img-left" />
      </div>
    </div>
    <div class="controls">
      <!-- Toggle Sidebar -->
      <button class="sidebar-toggle nav-btn" @click="ui.toggleSidebar" title="Alternar barra lateral">
        <i class="bi" :class="ui.state.sidebarCollapsed ? 'bi-list' : 'bi-list'"></i>
        <span v-if="!isCollapsed" class="label">Cerrar</span>
      </button>

      <!-- Notifications -->
      <div class="dropdown notifications-wrapper" @click.stop>
        <button class="nav-btn" type="button" @click="toggleNotifications" title="Notificaciones">
          <i class="bi bi-bell"></i>
          <span v-if="unreadNotifications > 0" class="notification-badge">{{ unreadNotifications }}</span>
          <span v-if="!isCollapsed" class="label">Notificaciones</span>
        </button>

        <div v-if="showNotifications" class="dropdown-menu notifications-dropdown show" style="right:0; top: calc(100% + 6px);">
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
          <div class="dropdown-footer text-center"><router-link to="/admin/notifications">Ver todas</router-link></div>
        </div>
      </div>
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
            <img v-if="avatarSrc" :src="avatarSrc" :alt="displayName" @error="onAvatarError" />
            <div v-else class="initials">{{ initials }}</div>
            <div class="status" :class="{ online: user.online }"></div>
          </div>
          <div class="user-meta" v-if="!isCollapsed">
            <div class="name">{{ displayName }}</div>
            <div class="role">{{ displayRole }}</div>
          </div>
          <i class="bi bi-chevron-down profile-caret" v-if="!isCollapsed"></i>
        </div>

        <div v-if="showProfileMenu" class="profile-dropdown-side">
          <router-link to="/adminperfil" class="dropdown-item"> <i class="bi bi-person"></i> <span>Mi Perfil</span> </router-link>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/compasable/useAuthStore'
import useUiStore from '@/compasable/useUiStore'
import useSidebarAcademia from '@/components/SideBar/sidebar'

const router = useRouter()
const auth = useAuthStore()

// logo
const logoUrl = new URL('../../image/Logo SENA.svg', import.meta.url).href

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
const sidebarApi = useSidebarAcademia()
const menuItems = sidebarApi.menuItems
const activeTop = sidebarApi.active

// user fallback (mirrors sidebar.vue mock users)
const user = ref<any>({ id: 0, name: 'Usuario', role: '', avatar: '', online: false })

// expose auth user data (computed) and derive display values with fallbacks
const authUser = auth.user
const displayName = computed(() => {
  const au: any = authUser?.value || null
  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '')
  const looksLikeEmail = (s: string) => typeof s === 'string' && s.includes('@')

  if (au) {
    const first = au.nombre || au.firstName || ''
    const last = au.apellido || au.lastName || ''
    const fullname = `${first} ${last}`.trim()
    if (fullname && !looksLikeEmail(fullname)) return fullname

    if (au.name && !looksLikeEmail(au.name)) return au.name

    const email = (au.correo || au.email || '') as string
    if (email && email.includes('@')) {
      const local = email.split('@')[0]
      const parts = local.split(/[_\.\-]/).filter(Boolean).map(capitalize)
      if (parts.length) return parts.join(' ')
    }
  }

  if (user.value && user.value.name && !looksLikeEmail(user.value.name)) return user.value.name
  return 'Usuario'
})

const displayRole = computed(() => {
  const au: any = authUser?.value || null
  const code = au?.rol || user.value.roleCode || ''
  if (!code) return 'Usuario'
  if (code === 'A') return 'Administrador'
  if (code === 'E') return 'Empleado'
  if (code === 'C') return 'Cliente'
  return String(code)
})

const showInitials = ref(false)
const API_BASE = (import.meta.env?.VITE_API_BASE as string) || `${window.location.protocol}//${window.location.host}`

// Create an SVG data URL with the user's initials to use as an image fallback
const createInitialsDataUrl = (name: string | undefined | null, size = 128, bg = '#1E9E4A', color = '#FFFFFF') => {
  const initialsText = (name || 'U').toString().trim().split(' ').filter(Boolean).map(s => s[0]).join('').toUpperCase().substring(0,1) || 'U'
  const fontSize = Math.floor(size * 0.55)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>` +
    `<rect width='100%' height='100%' fill='${bg}' rx='${Math.floor(size*0.2)}'/>` +
    `<text x='50%' y='50%' dy='0.35em' font-family='Inter, system-ui, Arial, sans-serif' font-size='${fontSize}' fill='${color}' text-anchor='middle' dominant-baseline='middle' font-weight='700'>${initialsText}</text>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const avatarSrc = computed(() => {
  const au: any = authUser?.value || null
  // Priority: explicit foto_perfil -> avatarUrl -> legacy foto -> direct uploads by id -> local fallback
  const id = au?.id_usuario || au?.id || user.value.id || null
  let a = ''
  if (au) a = au.foto_perfil || au.avatarUrl || au.foto || ''
  if (!a && id) a = `/uploads/avatars/${id}.jpg` // server-side saved avatar filename
  if (!a) a = user.value.avatar || ''

  // If showInitials flag set (image error), or still no avatar, return empty string
  // We will render initials as an HTML element instead of using a data-URL image.
  if (showInitials.value || !a) {
    return ''
  }

  // absolute URL
  if (a.startsWith('http')) return a
  // root-relative path -> prepend API_BASE
  if (a.startsWith('/')) return `${API_BASE}${a}`
  return a
})
// Debug: log and verify the computed avatarSrc so we can see why image fails
watch(avatarSrc, async (val) => {
  try {
    console.debug('[SideNavbar] avatarSrc ->', val)
    if (!val) return
    // Try a HEAD request to check availability (may be blocked by CORS on cross-origin)
    try {
      const res = await fetch(val, { method: 'HEAD', cache: 'no-cache' })
      console.debug('[SideNavbar] avatar HEAD status', res.status)
    } catch (e) {
      console.debug('[SideNavbar] avatar HEAD failed (CORS or network)', e && e.message ? e.message : e)
    }
  } catch (e) { /* ignore */ }
})

// Whether we should attempt to show an <img> element
const showImage = computed(() => {
  const val = avatarSrc.value
  if (!val) return false
  // do not treat data: URLs as server images
  if (val.startsWith('data:')) return false
  return true
})

const initialsDataUrl = (name?: string) => createInitialsDataUrl(name || (displayName.value || 'U'), 128)

const onAvatarError = () => {
  showInitials.value = true
  // remove stored avatar so UI falls back to initials and won't repeatedly try loading a broken src
  try {
    const au = (auth.user as any) || null
    if (au) {
      auth.updateUser({ foto_perfil: null, avatarUrl: null })
    }
  } catch (e) { /* ignore */ }
  try { user.value.avatar = undefined } catch (e) { /* ignore */ }
}

// Reset initials fallback when auth user updates (e.g., after avatar upload)
// Only clear the initials flag when the new auth user actually contains an avatar
watch(() => auth.user && auth.user.value, (nv, ov) => {
  try {
    const au: any = (auth.user as any) && (auth.user as any).value ? (auth.user as any).value : null
    if (au && (au.foto_perfil || au.avatarUrl || au.foto)) {
      showInitials.value = false
    }
  } catch (e) { /* ignore */ }
})

const initials = computed(() => {
  return ((displayName.value || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 1))
})


// mock users copied from sidebar to provide fallback menu mapping
const mockUsers = [
  {
    id: 1,
    name: 'Administrador',
    role: 'Administrador',
    roleCode: 'A',
    avatar: 'https://ui-avatars.com/api/?name=Administrador&background=a7b729&color=fff',
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
    avatar: 'https://ui-avatars.com/api/?name=Empleado&background=a7b729&color=fff',
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
    avatar: 'https://ui-avatars.com/api/?name=Cliente&background=a7b729&color=fff',
    online: true,
    menu: [
      { id: 'dashboard', title: 'Inicio', icon: 'bi-speedometer2', path: '/ClientesDashboard' },
      { id: 'cursos', title: 'Cursos', icon: 'bi-mortarboard', path: '/AlumnoDashboard' }
    ]
  }
]

// (initials computed above from displayName)

const showProfileMenu = ref(false)
const showNotifications = ref(false)

const notificationsList = ref([
  { id: 1, message: 'Nuevo evento de calibración programado', time: 'Hace 5 minutos', read: false, icon: 'bi bi-calendar-plus' },
  { id: 2, message: 'Nuevo usuario registrado: Juan Pérez', time: 'Hace 1 hora', read: false, icon: 'bi bi-person-plus' },
  { id: 3, message: 'Actualización del sistema completada', time: 'Hace 3 horas', read: true, icon: 'bi bi-gear' }
])

const unreadNotifications = computed(() => notificationsList.value.filter(n => !n.read).length)

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

const logout = () => {
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

// Render the top-header side-navbar only when the global navbar is not visible
// and the user is authenticated according to the auth store (validated via API/session)
const shouldRender = computed(() => {
  // Show only when main navbar is hidden and user is authenticated
  return !ui.state.navbarVisible && auth.isAuthenticated.value
})

const headerStyle = computed(() => {
  const topValue = ui.state.navbarVisible ? 'var(--navbar-height, 0px)' : '0px'
  return {
    position: 'fixed',
    // when main navbar is visible, sit below it; otherwise stick to top
    top: topValue,
    // make the side-navbar full width
    left: '0px',
    right: '0px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    background: 'var(--card-bg, var(--color-light, #fff))',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    borderBottom: '1px solid var(--color-gray-light, #E9ECEF)',
    zIndex: 4000,
    borderRadius: '0'
  }
})

const goToHome = () => {
  router.push('/').catch(() => {})
}

onMounted(() => {
  // dispatch a global event when this header's left transition ends
  const el = document.querySelector('.side-navbar.top-header') as HTMLElement | null
  if (!el) return
  const onEnd = (ev: TransitionEvent) => {
    // emit only when left finished (or when propertyName is empty)
    const prop = (ev as any).propertyName || ''
    if (!prop || prop === 'left' || prop === 'all') {
      window.dispatchEvent(new CustomEvent('sidenav-ready'))
      el.removeEventListener('transitionend', onEnd)
    }
  }
  el.addEventListener('transitionend', onEnd)
  // fallback: if transitionend doesn't fire (fast load), fire after 300ms
  const fallback = setTimeout(() => {
    window.dispatchEvent(new CustomEvent('sidenav-ready'))
    el.removeEventListener('transitionend', onEnd)
  }, 350)
  // Ensure a global CSS variable is available so other components
  // (sidebar) can position themselves below this header.
  try {
    // set the header height so the sidebar starts below this side-navbar
    const h = el.offsetHeight || 64
    document.documentElement.style.setProperty('--app-header-height', `${h}px`)
  } catch (e) {
    /* ignore */
  }
  // update height on resize or when UI state may affect layout
  const onResize = () => {
    try {
      const h2 = el.offsetHeight || 64
      document.documentElement.style.setProperty('--app-header-height', `${h2}px`)
    } catch (e) { }
  }
  window.addEventListener('resize', onResize)
  onUnmounted(() => {
    clearTimeout(fallback)
    el.removeEventListener('transitionend', onEnd)
    window.removeEventListener('resize', onResize)
  })
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
  const name = item.id || item.name || item.label || ''
  sidebarApi.navigateTo(item.path || '#', name)
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
      roleCode: au.rol,
      avatar: au.foto_perfil || au.avatarUrl || au.foto || '' ,
      online: true
    }
    // If auth user exists but no foto_perfil in the stored object, try to refresh from server via auth store
    if (auth.token && !au.foto_perfil && !au.avatarUrl) {
      try { (auth as any).refreshProfile?.().catch(() => {}) } catch (e) { /* ignore */ }
    }
  } else {
    // fallback using localStorage activeUserId
    const saved = localStorage.getItem('activeUserId')
    const id = saved ? Number(saved) : 1
    const found = mockUsers.find(m => m.id === id) || mockUsers[0]
    user.value = { ...found }
  }

  // ensure activeTop reflects the composed menu
  if (menuItems.value && menuItems.value.length) {
    const first = menuItems.value[0]
    activeTop.value = first.id || first.name || first.label || ''
  }
}

const refreshProfile = async () => {
  try {
    const t = (auth.token as any)?.value || localStorage.getItem('token') || localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    if (!t) return
    const res = await fetch(`${API_BASE}/api/profile`, { headers: { Authorization: `Bearer ${t}` } })
    if (!res.ok) return
    const body = await res.json().catch(() => null)
    const payload = body && body.data ? body.data : body
    if (!payload) return
    // Normalize foto_perfil and prefer avatarUrl when present
    if (payload.avatarUrl && !payload.foto_perfil) payload.foto_perfil = payload.avatarUrl

    // Push the entire payload to auth store so SideNavbar receives it "as-is"
    try {
      auth.updateUser(payload)
    } catch (e) {
      // fallback: set commonly used fields only
      const updated: any = {}
      if (payload.foto_perfil) updated.foto_perfil = payload.foto_perfil
      if (payload.nombre || payload.firstName) updated.nombre = payload.nombre ?? payload.firstName
      if (payload.primer_apellido || payload.lastName) updated.primer_apellido = payload.primer_apellido ?? payload.lastName
      if (payload.correo || payload.email) updated.correo = payload.correo ?? payload.email
      if (Object.keys(updated).length) auth.updateUser(updated)
    }

    // update local fallback avatar from auth store after update
    const au2 = (auth.user as any) || null
    if (au2) user.value.avatar = au2.foto_perfil || au2.foto || user.value.avatar
  } catch (e) {
    // ignore
  }
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
.initials { width:100%; height:100%; border-radius:50%; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg,var(--color-primary),var(--color-primary)); color:#fff; font-weight:700 }
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

.side-navbar .header-left { display:flex; align-items:center; gap:0.75rem; padding-left:12px }
.side-navbar .brand-logo-left { width:60px; height:60px; display:flex; align-items:center; justify-content:center; border-radius:0; background:transparent; color:#fff }
.side-navbar .brand-img-left { width:100%; height:100%; object-fit:contain; display:block; transform: scale(1.9); transform-origin:center; }
.side-navbar .brand-text-left .brand-name-left { font-weight:700; font-size:1.05rem }
.side-navbar .brand-text-left .brand-role-left { font-size:0.82rem; color:var(--color-gray,#6C757D) }
.side-navbar.top-header .header-left { margin-left: 12px }
.side-navbar.top-header .sidebar-toggle .label { margin-left:0.5rem }

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
