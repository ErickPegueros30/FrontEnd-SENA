<template>
  <div :data-bs-theme="currentTheme" class="app-container">
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

    <!-- Indicadores flotantes con banderas: México y Colombia (móvil y web) -->
    <div class="floating-country">
      <div class="country-contact">
        <button ref="mxBtn" class="bubble flag-bubble mexico" @click.stop="toggleMx" :aria-expanded="isMxOpen" title="México">
          <img src="https://flagcdn.com/w40/mx.png" alt="México" class="flag-img" />
        </button>
        <div v-if="isMxOpen" ref="mxPanel" class="country-expanded" :style="mxPanelStyle">
          <div class="country-scroll-content">
            <a href="tel:+524421982279" class="contact-link" title="Llamar +52 (442) 198 2279">
              <i class="bi bi-telephone-fill"></i>
              <span class="contact-text">+52 442 198 2279</span>
            </a>
            <a href="tel:+524422241245" class="contact-link" title="Llamar +52 (442) 224 1245">
              <i class="bi bi-telephone"></i>
              <span class="contact-text">+52 442 224 1245</span>
            </a>
            <a href="https://wa.me/524421982279" class="contact-link whatsapp-link" title="WhatsApp: Manda mensaje" target="_blank" rel="noreferrer">
              <i class="bi bi-whatsapp"></i>
              <span class="contact-text">Manda mensaje</span>
            </a>
          </div>
        </div>
      </div>

        <div class="country-contact">
        <button ref="coBtn" class="bubble flag-bubble colombia" @click.stop="toggleCo" :aria-expanded="isCoOpen" title="Colombia">
          <img src="https://flagcdn.com/w40/co.png" alt="Colombia" class="flag-img" />
        </button>
        <div v-if="isCoOpen" ref="coPanel" class="country-expanded" :style="coPanelStyle">
          <div class="country-scroll-content">
            <a href="tel:+573161595252" class="contact-link" title="Llamar +57 316 159 5252">
              <i class="bi bi-telephone-fill"></i>
              <span class="contact-text">+57 316 159 5252</span>
            </a>
            <a href="https://wa.me/573161595252" class="contact-link whatsapp-link" title="WhatsApp: Manda mensaje" target="_blank" rel="noreferrer">
              <i class="bi bi-whatsapp"></i>
              <span class="contact-text">Manda mensaje</span>
            </a>
          </div>
        </div>
      </div>
    </div>
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
      isMxOpen.value = false
      isCoOpen.value = false
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

// Floating country contacts (Mexico & Colombia)
const isMxOpen = ref(false)
const isCoOpen = ref(false)

// Refs to buttons and panels for positioning
const mxBtn = ref<HTMLElement | null>(null)
const coBtn = ref<HTMLElement | null>(null)
const mxPanel = ref<HTMLElement | null>(null)
const coPanel = ref<HTMLElement | null>(null)

const mxPanelStyle = ref<Record<string, string>>({})
const coPanelStyle = ref<Record<string, string>>({})

// no custom panel scroller logic — modals use native scroll appearance

const computePanelPosition = (btnEl: HTMLElement | null, panelEl: HTMLElement | null): Record<string, string> => {
  if (!btnEl || !panelEl) return {}
  const vw = window.innerWidth
  // On very small screens, let CSS handle fixed layout
  if (vw <= 480) return {}

  const btnRect = btnEl.getBoundingClientRect()
  const panelWidth = Math.min(240, vw - 90)

  const style: Record<string, string> = { position: 'fixed' }

  // Prefer to position panel so it does not overflow right; compute left and clamp within viewport
  const desiredLeft = Math.floor(btnRect.right) - panelWidth
  const minLeft = 14
  const maxLeft = Math.max(minLeft, vw - panelWidth - 14)
  let left = Math.min(Math.max(desiredLeft, minLeft), maxLeft)

  // Ensure panel does NOT cover the button: keep panel's right edge left of button's left minus gap
  const gap = 8
  const allowedMaxLeft = Math.floor(btnRect.left - gap - panelWidth)
  if (!Number.isNaN(allowedMaxLeft) && allowedMaxLeft >= minLeft) {
    left = Math.min(left, allowedMaxLeft)
  } else {
    // if we cannot place panel left of button, fallback to aligning from right edge
    delete style.left
    style.right = '14px'
  }
  if (!style.right) style.left = `${left}px`

  // ensure width fits
  style.width = `${panelWidth}px`
  style.maxWidth = `calc(100vw - 90px)`


  // vertical placement: align near button top but keep within viewport
  const panelHeight = panelEl.offsetHeight || 160
  let top = Math.floor(btnRect.top)
  const minTop = 8
  const maxTop = Math.max(minTop, window.innerHeight - panelHeight - 20)
  top = Math.min(Math.max(top, minTop), maxTop)
  style.top = `${top}px`

  // ensure very high stacking on complex pages
  style.zIndex = '99999'

  return style
}

const toggleMx = async (): Promise<void> => {
  isMxOpen.value = !isMxOpen.value
  if (isMxOpen.value) {
    isCoOpen.value = false
    await nextTick()
    mxPanelStyle.value = computePanelPosition(mxBtn.value, mxPanel.value)
  } else {
    mxPanelStyle.value = {}
    detachCustomScroll(mxPanel.value)
  }
}

const toggleCo = async (): Promise<void> => {
  isCoOpen.value = !isCoOpen.value
  if (isCoOpen.value) {
    isMxOpen.value = false
    await nextTick()
    coPanelStyle.value = computePanelPosition(coBtn.value, coPanel.value)
  } else {
    coPanelStyle.value = {}
    detachCustomScroll(coPanel.value)
  }
}

// Recompute positions on resize when open
window.addEventListener('resize', () => {
  if (isMxOpen.value) mxPanelStyle.value = computePanelPosition(mxBtn.value, mxPanel.value)
  if (isCoOpen.value) coPanelStyle.value = computePanelPosition(coBtn.value, coPanel.value)
  // nothing extra to update for panels; they use native scroll
})
</script>

<style>
/* Variables CSS adicionales */

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

/* Modern, ShineX-like scrollbar in green tones (global) */
html {
  scrollbar-width: thin;
  scrollbar-color: #7aab3d rgba(122,171,61,0.04);
}

/* WebKit: thin, frosted track + glowing thumb with subtle pulse */
html::-webkit-scrollbar { width: 6px; height: 6px; }
html::-webkit-scrollbar-track {
  background: linear-gradient(180deg, rgba(122,171,61,0.02), rgba(122,171,61,0.005));
  border-radius: 999px;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.06);
  backdrop-filter: blur(6px);
}
html::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(143,192,90,0.98) 0%, rgba(93,138,47,0.98) 55%);
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.03);
  background-clip: padding-box;
  box-shadow: 0 8px 28px rgba(93,138,47,0.18), inset 0 -6px 14px rgba(0,0,0,0.12);
  transition: transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms ease, opacity 140ms ease;
  opacity: 0.98;
  animation: thumbPulse 6s ease-in-out infinite;
}
html::-webkit-scrollbar-thumb:hover {
  transform: scale(1.06);
  box-shadow: 0 16px 48px rgba(93,138,47,0.28), inset 0 -6px 18px rgba(0,0,0,0.18);
}
html::-webkit-scrollbar-corner { background: transparent; }

@keyframes thumbPulse {
  0% { box-shadow: 0 6px 20px rgba(93,138,47,0.12); }
  50% { box-shadow: 0 12px 34px rgba(93,138,47,0.18); }
  100% { box-shadow: 0 6px 20px rgba(93,138,47,0.12); }
}

/* Dark theme variant */
[data-bs-theme="dark"] html { scrollbar-color: #8fc05a rgba(12,15,10,0.04); }
[data-bs-theme="dark"] html::-webkit-scrollbar-track { background: rgba(0,0,0,0.08); }
[data-bs-theme="dark"] html::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(128,191,74,0.98) 0%, rgba(78,122,40,0.95) 55%);
  box-shadow: 0 10px 30px rgba(78,122,40,0.16), inset 0 -4px 10px rgba(0,0,0,0.4);
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
  background: var(--gradient-bg);
}

.theme-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary, #5d8a2f) 0%, var(--color-primary-light, #7aab3d) 100%);
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
  color: var(--color-primary);
  font-size: 1.1rem;
}

/* Country floating indicators */
.floating-country {
  position: fixed;
  right: 14px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2000;
}

.country-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.flag-bubble {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  cursor: pointer;
  padding: 4px;
}

.flag-bubble.mexico { color: #006341; }
.flag-bubble.colombia { color: #d52b1e; }

.country-expanded {
  position: absolute;
  right: 62px;
  top: 6px;
  width: 240px;
  max-width: calc(100vw - 90px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  align-items: stretch;
  background: rgba(255,255,255,0.98);
  border-radius: 12px;
  padding: 0.6rem;
  box-shadow: 0 12px 40px rgba(15, 23, 12, 0.18);
  border: 1px solid rgba(0,0,0,0.06);
  z-index: 2500;
  transform-origin: right center;
  animation: popIn 180ms ease-out;
  /* allow scrolling when content overflows so custom scrollbar appears */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* limit height so scrollbar can show on desktop */
  max-height: 320px;
  /* restore normal padding */
  padding-right: 0.6rem;
}

/* Decorative, always-visible futuristic scrollline inside the panel */
/* Ensure modals (country-expanded) keep native/neutral scroll appearance */
.country-expanded {
  scrollbar-width: auto;
  scrollbar-color: rgba(0,0,0,0.12) rgba(255,255,255,0.98);
}
.country-expanded::-webkit-scrollbar { width: 8px; }
.country-expanded::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 999px; }
.country-expanded::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 999px; }

.country-expanded::before {
  content: '';
  position: absolute;
  right: -8px;
  top: 18px;
  width: 0; height: 0;
  border-left: 8px solid rgba(255,255,255,0.98);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

  /* No custom visible scrollline inside modals */

.flag-bubble svg {
  width: 28px;
  height: 20px;
  display: block;
  border-radius: 4px;
}

.flag-bubble .flag-img {
  width: 28px;
  height: 20px;
  display: block;
  border-radius: 4px;
  object-fit: cover;
}

/* Contact link inside expanded country panel */
.country-expanded .contact-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  background: transparent;
  color: #213322;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background 160ms ease, transform 160ms ease;
}

.country-expanded .contact-link:hover {
  background: rgba(93,138,47,0.06);
  transform: translateX(-4px);
}

.country-expanded .contact-link i {
  font-size: 1.05rem;
  color: inherit;
}

.country-expanded .contact-text {
  display: inline-block;
  line-height: 1;
  white-space: normal;
  word-break: break-word;
}

/* WhatsApp styled link */
.country-expanded .whatsapp-link {
  background: linear-gradient(135deg, #25D366 0%, #1fae4b 100%);
  color: #ffffff !important;
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.18);
}
.country-expanded .whatsapp-link i {
  color: #ffffff !important;
  background: rgba(255,255,255,0.08);
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

/* Dark mode adjustments */
[data-bs-theme="dark"] .country-expanded .contact-link {
  background: #131a0e;
  color: #dfece0;
  box-shadow: none;
  border: 1px solid rgba(122,171,61,0.08);
}
[data-bs-theme="dark"] .country-expanded .whatsapp-link {
  background: linear-gradient(135deg, #1d8f46 0%, #17863f 100%);
  color: #ffffff !important;
  box-shadow: 0 8px 20px rgba(21, 110, 55, 0.16);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.96) translateX(6px); }
  to { opacity: 1; transform: scale(1) translateX(0); }
}

/* Responsive: fixed panel on narrow screens to avoid overflow */
@media (max-width: 480px) {
  .country-expanded {
    position: fixed !important;
    right: 14px !important;
    bottom: 84px !important;
    top: auto !important;
    width: calc(100vw - 28px) !important;
    max-width: calc(100vw - 28px) !important;
    border-radius: 12px;
    padding: 0.6rem;
  }
  .country-expanded::before { display: none; }
  .country-expanded .contact-link { justify-content: flex-start; }
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
