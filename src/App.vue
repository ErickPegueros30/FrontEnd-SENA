<template>
  <div :data-bs-theme="currentTheme" class="app-container">
    <!-- Indicador de tema flotante -->
    <div
      class="theme-indicator"
      @click="toggleTheme"
      :title="currentTheme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'"
    >
      {{ currentTheme === 'light' ? '☀️' : '🌙' }}
    </div>

    <!-- Header Superior -->
    <HeaderTop
      v-if="!hideHeaderNav"
      :current-theme="currentTheme"
      @toggle-theme="toggleTheme"
    />

    <!-- Navbar Principal -->
    <Navbar
      v-if="!hideHeaderNav"
      :current-theme="currentTheme"
      @toggle-theme="toggleTheme"
    />

    <!-- Side action navbar: botones rápidos junto al sidebar -->
    <Sidebar />
    <SideNavbar />

    <!-- Aquí se renderizan las vistas del router -->
    <main id="app-view" class="app-view" :style="appViewStyle">
      <router-view />
    </main>

    <!-- Contenido de Demostración eliminado (no existe DemoContent) -->

    <!-- Burbujas flotantes en esquina inferior derecha (móvil) -->
    <div class="floating-contact d-lg-none" @click.stop>
      <button class="bubble main-bubble" :class="{ open: isFloatingOpen }" @click="toggleFloating" aria-label="Contactos">
        <i class="bi" :class="isFloatingOpen ? 'bi-x-lg' : 'bi-telephone-fill'"></i>
      </button>
      <div v-if="isFloatingOpen" class="floating-expanded">
        <a href="tel:+524421982279" class="bubble small-bubble" title="Llamar +52 (442) 198 2279">
          <i class="bi bi-telephone-fill"></i>
        </a>
        <a href="tel:+524422241245" class="bubble small-bubble" title="Llamar +52 (442) 224 1245">
          <i class="bi bi-telephone"></i>
        </a>
        <a href="https://wa.me/524421982279" class="bubble small-bubble whatsapp-bubble" title="WhatsApp" target="_blank">
          <i class="bi bi-whatsapp"></i>
        </a>
      </div>
    </div>
    <!-- debug overlay removed -->
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, type Ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import HeaderTop from './components/headertop/headertop.vue'
import Navbar from './components/NavBar/navbar.vue'
import SideNavbar from './components/SideBar/SideNavbar.vue'
import Sidebar from './components/SideBar/sidebar.vue'
import useUiStore from './compasable/useUiStore'

// Tipos
type Theme = 'light' | 'dark'


// UI store centralizada
const ui = useUiStore()

// Estado del tema ligado al store
const currentTheme: Ref<Theme> = ref(ui.state.theme as Theme)

// ocultar Header/Nav cuando el sidebar está visible (solo eso)
const hideHeaderNav = computed(() => ui.state.sidebarVisible)

// sincronizar visibilidad del navbar en el store (navbar visible = not hideHeaderNav)
watch(hideHeaderNav, (val) => {
  ui.setNavbarVisible(!val)
})

// (notificaciones eliminadas)

// Función para cambiar tema (usa el store)
const toggleTheme = () => {
  ui.toggleTheme()
  currentTheme.value = ui.state.theme as Theme
}

// Detectar preferencia del sistema
const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = 'dark'
      localStorage.setItem('theme', 'dark')
    }
  }
}

// Escuchar cambios en la preferencia del sistema
watch(currentTheme, (newTheme: Theme) => {
  document.documentElement.setAttribute('data-bs-theme', newTheme)
})

const router = useRouter()

// debug snapshots removed

  // Ajustar el padding-top del contenido para que empiece después del navbar
  // Note: we avoid including the side-navbar top-header until it signals readiness
  let _sidenavReady = false
  const updateContentOffset = () => {
    const navbarEl = document.getElementById('mainNavbar')
    const appView = document.getElementById('app-view')
    if (!appView) return
    const headerEl = document.getElementById('headerTop')
    const headerH = headerEl ? headerEl.offsetHeight : 0
    const navbarH = navbarEl ? navbarEl.offsetHeight : 0

    let total = Math.max(0, headerH + navbarH)

    // If a top-header side-navbar exists, compute its bottom coordinate
    // and use it to pin the content immediately beneath it.
    const sideNavbarEl = document.querySelector('.side-navbar.top-header') as HTMLElement | null
    if (sideNavbarEl && getComputedStyle(sideNavbarEl).display !== 'none') {
      const rect = sideNavbarEl.getBoundingClientRect()
      // rect.bottom is distance from viewport top; use that value as padding
      const bottom = Math.ceil(rect.bottom)
      // If bottom is larger than current total, prefer it.
      total = Math.max(total, bottom)
    }

    // set CSS variable so layout and min-height calc can use it
    document.documentElement.style.setProperty('--navbar-height', `${total}px`)
  }

// Computed style so all views adapt to sidebar / sidenavbar state
const appViewStyle = computed(() => {
  // if sidebar is visible (and navbar hidden), offset the content
  if (ui.state.sidebarVisible && !ui.state.navbarVisible) {
    const ml = ui.state.sidebarCollapsed ? '70px' : '280px'
    return { marginLeft: ml, transition: 'margin-left 0.25s ease' }
  }
  return { marginLeft: '0px', transition: 'margin-left 0.25s ease' }
})

onMounted(() => {
  // Inicializar UI store (tema, idioma y estado del sidebar)
  ui.init()
  currentTheme.value = ui.state.theme as Theme

  // Detectar tema del sistema
  detectSystemTheme()

  // Escuchar cambios del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = e.matches ? 'dark' : 'light'
    }
  })

  // Ocultar las burbujas cuando se abre el offcanvas móvil
  const mobileMenu = document.getElementById('mobileMenu')
  if (mobileMenu) {
    mobileMenu.addEventListener('show.bs.offcanvas', () => {
      isFloatingOpen.value = false
    })
  }

  // inicial y en cambios de tamaño (no es necesario en cada scroll)
  // Hacemos un nextTick para asegurar que elementos fijados ya están montados
  nextTick(() => updateContentOffset())
  // Recalculate offsets when the SideNavbar finishes its transition
  const onSidenavReady = () => {
    _sidenavReady = true
    updateContentOffset()
    updateSideNavbarRight()
  }
  window.addEventListener('sidenav-ready', onSidenavReady)
  window.addEventListener('resize', updateContentOffset)

  // set CSS variable for sidebar width so views/CSS can reference it
  const updateSidebarVars = () => {
    const width = ui.state.sidebarCollapsed ? '70px' : '280px'
    document.documentElement.style.setProperty('--sidebar-width', width)
    // also keep app-left-margin in sync (used by some views)
    const ml = ui.state.sidebarVisible && !ui.state.navbarVisible ? width : '0px'
    document.documentElement.style.setProperty('--app-left-margin', ml)
  }

  // compute right margin when a side action bar exists (vertical sidenavbar)
  const updateSideNavbarRight = () => {
    const el = document.querySelector('.side-navbar') as HTMLElement | null
    if (!el) {
      document.documentElement.style.setProperty('--app-right-margin', '0px')
      return
    }
    // decide if this .side-navbar is the vertical right bar (not the top-header)
    const rect = el.getBoundingClientRect()
    const isVerticalRight = rect.top > 10 && rect.left > window.innerWidth / 2
    if (isVerticalRight && rect.width > 20) {
      // add a small buffer (12px) similar to CSS right offsets
      const val = `${Math.ceil(rect.width + 12)}px`
      document.documentElement.style.setProperty('--app-right-margin', val)
    } else {
      document.documentElement.style.setProperty('--app-right-margin', '0px')
    }
  }

  // initial set
  updateSidebarVars()
  updateSideNavbarRight()
  // react to changes
  watch(() => ui.state.sidebarCollapsed, updateSidebarVars)
  watch(() => ui.state.sidebarVisible, updateSidebarVars)
  watch(() => ui.state.sidebarCollapsed, updateSideNavbarRight)
  watch(() => ui.state.sidebarVisible, updateSideNavbarRight)
  watch(() => ui.state.navbarVisible, updateSideNavbarRight)

  // also update when resizing or DOM changes that may affect side-navbar
  window.addEventListener('resize', updateSideNavbarRight)
  // ensure content offset recalculates when sidebar/sidenav visibility changes
  watch(() => ui.state.sidebarVisible, () => { updateContentOffset(); updateSideNavbarRight() })
  watch(() => ui.state.navbarVisible, () => { updateContentOffset(); updateSideNavbarRight() })

  // Recalcular al cambiar la visibilidad del header/navbar
  watch(hideHeaderNav, async () => {
    await nextTick()
    updateContentOffset()
  })

  // Recalcular después de cada navegación (puede cambiar el layout)
  router.afterEach(() => {
    nextTick(() => updateContentOffset())
  })

  // limpiar listeners al desmontar
  onUnmounted(() => {
    window.removeEventListener('resize', updateContentOffset)
    window.removeEventListener('sidenav-ready', onSidenavReady)
  })
})


// Exponer métodos a componentes hijos
defineExpose({
  toggleTheme
})

// Floating contact (global, bottom-right)
const isFloatingOpen = ref(false)
const toggleFloating = (): void => {
  isFloatingOpen.value = !isFloatingOpen.value
}
</script>

<style>
/* Variables CSS adicionales */
:root {
  --card-bg: white;
  --lab-bg: #f8f9fa;
}

[data-bs-theme="dark"] {
  --card-bg: #2d2d2d;
  --lab-bg: #1a1a1a;
}

/* Animaciones para los cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
</style>

<style scoped>
.app-container {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  padding-top: 0; /* moved to app-view via JS to avoid double spacing */
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* El contenido (.app-view) posiciona su padding-top usando la variable --navbar-height */
#app-view {
  padding-top: var(--navbar-height, 0px);
  min-height: calc(100vh - var(--navbar-height, 0px));
  box-sizing: border-box;
}

/* Ensure the main view doesn't create a separate horizontal scroller */
#app-view, .app-container { overflow-x: hidden; }

[data-bs-theme="dark"] .app-container {
  background: linear-gradient(135deg, #121212 0%, #1A1A1A 100%);
}

.theme-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-indicator:hover {
  transform: scale(1.1) rotate(15deg);
}

/* No forzamos padding por media query; usamos JS para calcular el offset real */

/* Ocultar indicador de tema en móvil (usamos botones pequeños en navbar) */
@media (max-width: 991.98px) {
  .theme-indicator { display: none; }
}

/* Estilos para las burbujas flotantes (móvil) */
.floating-contact {
  position: fixed;
  right: 14px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2000;
}

.floating-contact .bubble {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  color: #a6b828;
  font-size: 1.1rem;
}

.floating-contact .whatsapp-bubble {
  background: #25D366;
  color: #fff;
}

.floating-expanded {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.small-bubble {
  width: 40px;
  height: 40px;
  font-size: 0.95rem;
}

.main-bubble.open { transform: rotate(45deg); }

@media (min-width: 992px) {
  .floating-contact { display: none; }
}
</style>
