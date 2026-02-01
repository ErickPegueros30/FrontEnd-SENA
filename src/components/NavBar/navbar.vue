<template>
  <nav
    class="navbar navbar-main navbar-expand-lg"
    id="mainNavbar"
    :class="{ 'scrolled': isNavbarScrolled }"
  >
    <div class="container">
      <!-- Logo y Marca -->
      <a class="navbar-brand" href="/">
        <div class="brand-section">
          <div class="brand-logo">
            <img :src="logoUrl" alt="SENA" class="brand-img" />
          </div>
        </div>
      </a>

      <!-- Hamburguesa para móviles (abre offcanvas lateral derecho) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileMenu"
        aria-controls="mobileMenu"
      >
        <i class="bi bi-list"></i>
      </button>
      <!-- (Las burbujas flotantes se muestran en la esquina inferior derecha) -->

      <!-- Contenido del Navbar -->
      <div class="collapse navbar-collapse d-none d-lg-flex" id="navbarContent">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a
              class="nav-link-main"
              :class="{ 'active': activeLink === 'inicio' }"
              href="/"
              @click="setActiveLink('inicio')"
            >
              Inicio
            </a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link-main dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              Servicios
            </a>
            <ul class="dropdown-menu dropdown-menu-custom">
              <li>
                <a class="dropdown-item dropdown-item-custom" href="/cursos">
                  <i class="bi bi-gear"></i>Cursos
                </a>
              </li>
              <li>
                <a class="dropdown-item dropdown-item-custom" href="/ensayos">
                  <i class="bi bi-tools"></i>Ensayos
                </a>
              </li>
              <li>
                <a class="dropdown-item dropdown-item-custom" href="/interlaboratorio">
                  <i class="bi bi-shield-check"></i>Interlaboratorio
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a
              class="nav-link-main"
              :class="{ 'active': activeLink === 'nosotros' }"
              href="/nosotros"
              @click="setActiveLink('nosotros')"
            >
              Nosotros
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link-main"
              :class="{ 'active': activeLink === 'blog' }"
              href="/blog"
              @click="setActiveLink('blog')"
            >
              Blog
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link-main"
              :class="{ 'active': activeLink === 'eventos' }"
              href="/eventos"
              @click="setActiveLink('eventos')"
            >
              Eventos
            </a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link-main dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              Acreditaciones
            </a>
            <ul class="dropdown-menu dropdown-menu-custom">
              <li>
                <a class="dropdown-item dropdown-item-custom" href="#">
                  <i class="bi bi-award"></i>Certificaciones
                </a>
              </li>
              <li>
                <a class="dropdown-item dropdown-item-custom" href="#">
                  <i class="bi bi-patch-check"></i>Reconocimientos
                </a>
              </li>
              <li>
                <a class="dropdown-item dropdown-item-custom" href="#">
                  <i class="bi bi-file-earmark-text"></i>Documentación
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a
              class="nav-link-main"
              :class="{ 'active': activeLink === 'contacto' }"
              href="/contacto"
              @click="setActiveLink('contacto')"
            >
              Contacto
            </a>
          </li>
        </ul>

        <!-- Selector de idioma y CTA -->
        <div class="d-flex align-items-center gap-3">
          <!-- Selector de idioma -->
          <div class="dropdown">
            <button
              class="language-selector dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="currentLanguage.flag"
                class="language-flag"
                :alt="currentLanguage.name"
              >
              <span class="language-text">{{ currentLanguage.code }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-custom language-dropdown">
              <li
                v-for="lang in languages"
                :key="lang.code"
              >
                <a
                  class="dropdown-item dropdown-item-custom"
                  href="#"
                  @click.prevent="changeLanguage(lang, $event)"
                >
                  <img :src="lang.flag" class="language-flag" :alt="lang.name">
                  <span>{{ lang.name }}</span>
                </a>
              </li>
            </ul>
          </div>

                  <!-- Botón CTA -->
                  <button type="button" class="cta-button" @click="goToLogin">
                    <i class="bi bi-box-arrow-in-right"></i>
                    <span>{{ ctaLabel }}</span>
                  </button>
        </div>
      </div>
    </div>
     <div class="mobile-actions d-flex d-lg-none w-100 mt-2 justify-content-center gap-2">
        <button class="language-selector btn btn-sm" @click="$emit('toggle-theme')" title="Modo">
          <i class="bi bi-circle-half"></i>
        </button>

        <div class="dropdown">
          <button class="language-selector btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Idioma">
            <img :src="currentLanguage.flag" style="width:18px;height:12px;margin-right:6px"> <span class="mobile-lang-code">{{ currentLanguage.code }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li v-for="lang in languages" :key="lang.code">
              <a class="dropdown-item" href="#" @click.prevent="changeLanguage(lang, $event)">
                <img :src="lang.flag" style="width:18px;height:12px;margin-right:8px">{{ lang.name }}
              </a>
            </li>
          </ul>
        </div>

        <button type="button" class="cta-button btn-sm mobile-entrar" @click="goToLogin">{{ ctaLabel }}</button>
      </div>
  </nav>
  <!-- Offcanvas lateral derecho para móvil: colocado fuera del nav para que no se corte -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="mobileMenuLabel">
        <div class="brand-section">
          <div class="brand-logo">
            <img :src="logoUrl" alt="SENA" class="brand-img" />
          </div>
        </div>
      </h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <ul class="navbar-nav">
        <li
          class="nav-item"
          v-for="(item, idx) in menuItems"
          :key="item.key + '-' + idx"
        >
          <template v-if="item.children">
            <div class="d-flex justify-content-between align-items-center">
              <a
                class="nav-link-main"
                :class="{ 'active': activeLink === item.key }"
                href="#"
                @click.prevent="setActiveLink(item.key)"
              >
                {{ item.label }}
              </a>
              <button
                class="btn btn-sm"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#mobile-sub-' + idx"
                aria-expanded="false"
                :aria-controls="'mobile-sub-' + idx"
              >
                <i class="bi bi-chevron-down"></i>
              </button>
            </div>

            <ul class="collapse list-unstyled ms-3 mt-2" :id="'mobile-sub-' + idx">
              <li v-for="(child, cidx) in item.children" :key="child.key + '-' + cidx">
                <a
                  class="nav-link-main"
                  :class="{ 'active': activeLink === child.key }"
                  :href="child.href || '#'
                  "
                  @click.prevent="navigateMobile(child.href || '#', child.key)"
                >
                  {{ child.label }}
                </a>
              </li>
            </ul>
          </template>
          <template v-else>
            <a
              class="nav-link-main"
              :class="{ 'active': activeLink === item.key }"
              :href="item.href || '#'"
              @click.prevent="navigateMobile(item.href || '#', item.key)"
            >
              {{ item.label }}
            </a>
          </template>
        </li>
      </ul>

      <div class="mt-3 d-flex gap-2">
        <a href="tel:+524421982279" class="btn btn-outline-success w-50">Llamar</a>
        <a href="https://wa.me/524421982279" target="_blank" class="btn btn-success w-50">WhatsApp</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'

// Tipos
interface Language {
  code: string
  name: string
  flag: string
}

type Theme = 'light' | 'dark'
type ActiveLink = string

interface Props {
  currentTheme: Theme
}

interface Emits {
  (e: 'toggle-theme'): void
}

// Props y Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado
const activeLink: Ref<ActiveLink> = ref('inicio')
const isNavbarScrolled: Ref<boolean> = ref(false)
let lastScrollTop = 0

// Idiomas disponibles
const languages: Language[] = reactive([
  { code: 'ES', name: 'Español', flag: 'https://flagcdn.com/w40/mx.png' },
  { code: 'EN', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'FR', name: 'Français', flag: 'https://flagcdn.com/w40/fr.png' }
])

  const currentLanguage: Ref<Language> = ref(languages[0])

  // Logo: usa `src/image/logo.png`. Coloca el archivo ahí o cambia la ruta.
  const logoUrl = new URL('../../image/Logo SENA.svg', import.meta.url).href

// Estructura del menú (soporta submenús) para el offcanvas
const menuItems = reactive([
  { label: 'Inicio', key: 'inicio', href: '/' },
  {
    label: 'Servicios',
    key: 'servicios',
    children: [
      { label: 'Cursos', key: 'cursos', href: '/cursos' },
      { label: 'Ensayos', key: 'ensayos', href: '/ensayos' },
      { label: 'Interlaboratorio', key: 'interlaboratorio', href: '/interlaboratorio' }
    ]
  },
  { label: 'Nosotros', key: 'nosotros', href: '/nosotros' },
  { label: 'Blog', key: 'blog', href: '/blog' },
  { label: 'Eventos', key: 'eventos', href: '/eventos' },
  {
    label: 'Acreditaciones',
    key: 'acreditaciones',
    children: [
      { label: 'Certificaciones', key: 'certificaciones', href: '#certificaciones' },
      { label: 'Reconocimientos', key: 'reconocimientos', href: '#reconocimientos' },
      { label: 'Documentación', key: 'documentacion', href: '#documentacion' }
    ]
  },
  { label: 'Contacto', key: 'contacto', href: '/contacto' }
])

// Funciones
const setActiveLink = (link: ActiveLink): void => {
  activeLink.value = link
  // Cerrar navbar en móviles
  if (window.innerWidth < 992) {
    const navbarCollapse = document.getElementById('navbarContent')
    if (navbarCollapse?.classList.contains('show')) {
      navbarCollapse.classList.remove('show')
    }
  }
}

const changeLanguage = async (lang: Language, ev?: Event): Promise<void> => {
  currentLanguage.value = lang

  // If an event is available, try to close only the related dropdown
  try {
    const bootstrap = await import('bootstrap')
    const Dropdown = (bootstrap as any).Dropdown

    if (ev && ev.currentTarget) {
      const target = ev.currentTarget as HTMLElement
      const dropdownRoot = target.closest('.dropdown') as HTMLElement | null
      const toggleEl = dropdownRoot?.querySelector('.dropdown-toggle') as HTMLElement | null
      if (toggleEl) {
        try {
          const inst = Dropdown.getInstance(toggleEl) || Dropdown.getOrCreateInstance(toggleEl)
          if (inst && typeof inst.hide === 'function') inst.hide()
          return
        } catch (e) {
          // fallthrough to closing all dropdowns
        }
      }
    }

    // fallback: close any dropdown toggle instances
    document.querySelectorAll('.dropdown-toggle').forEach((el) => {
      try {
        const inst = Dropdown.getInstance(el)
        if (inst) inst.hide()
      } catch (e) {
        /* ignore */
      }
    })
  } catch (e) {
    // ignore if bootstrap not available
  }
}

const handleScroll = (): void => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  isNavbarScrolled.value = scrollTop > 50
  lastScrollTop = scrollTop
}

// Floating contact state (móvil)
const isFloatingOpen: Ref<boolean> = ref(false)
const toggleFloating = (): void => {
  isFloatingOpen.value = !isFloatingOpen.value
}

// Ajusta la posición superior del navbar para quedar pegado al header
const adjustNavbarTop = (): void => {
  const headerEl = document.getElementById('headerTop')
  const navbarEl = document.getElementById('mainNavbar')
  if (!navbarEl) return

  if (headerEl && headerEl.classList.contains('hidden')) {
    navbarEl.style.top = '0px'
  } else if (headerEl) {
    const h = headerEl.offsetHeight || 0
    navbarEl.style.top = `${h}px`
  } else {
    // fallback
    navbarEl.style.top = '0px'
  }
}

let removeAfterEach: (() => void) | null = null
let languageDocClickHandler: ((e: Event) => void) | null = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', adjustNavbarTop)
  window.addEventListener('resize', adjustNavbarTop)
  // inicial
  adjustNavbarTop()

  // Inicializar dropdowns de Bootstrap en desktop (asegura comportamiento si la carga de JS es diferida)
  import('bootstrap').then((bootstrap) => {
    const Dropdown = (bootstrap as any).Dropdown
    document.querySelectorAll('.dropdown-toggle').forEach((el) => {
      try { Dropdown.getOrCreateInstance(el) } catch (e) { /* ignore */ }
    })
  }).catch(() => {})

  // Fallback ligero: manejar apertura/cierre del menú de idioma si Bootstrap no responde
  languageDocClickHandler = (ev: Event) => {
    const target = ev.target as HTMLElement
    const toggle = target.closest('.language-selector.dropdown-toggle') as HTMLElement | null

    // If clicked on the language toggle, toggle its menu
    if (toggle) {
      const dropdownRoot = toggle.closest('.dropdown') as HTMLElement | null
      const menu = dropdownRoot?.querySelector('.dropdown-menu') as HTMLElement | null

      // Close other open language menus
      document.querySelectorAll('.language-selector.dropdown-toggle').forEach((otherToggle) => {
        const otherRoot = otherToggle.closest('.dropdown') as HTMLElement | null
        const otherMenu = otherRoot?.querySelector('.dropdown-menu') as HTMLElement | null
        if (otherMenu && otherMenu !== menu && otherMenu.classList.contains('show')) {
          otherMenu.classList.remove('show')
          (otherToggle as HTMLElement).setAttribute('aria-expanded', 'false')
        }
      })

      if (!menu) return
      const isOpen = menu.classList.contains('show')
      if (isOpen) {
        menu.classList.remove('show')
        toggle.setAttribute('aria-expanded', 'false')
      } else {
        menu.classList.add('show')
        toggle.setAttribute('aria-expanded', 'true')
      }

      ev.stopPropagation()
      return
    }

    // Click fuera: close any open language menus
    const openMenus = document.querySelectorAll('.dropdown-menu.show')
    if (openMenus.length) {
      openMenus.forEach((m) => {
        m.classList.remove('show')
        const t = (m.closest('.dropdown')?.querySelector('.dropdown-toggle')) as HTMLElement | null
        if (t) t.setAttribute('aria-expanded', 'false')
      })
    }
  }

  document.addEventListener('click', languageDocClickHandler)

  // Cerrar offcanvas automáticamente cuando la ruta cambia
  removeAfterEach = router.afterEach(() => {
    const offcanvasEl = document.getElementById('mobileMenu')
    if (offcanvasEl) {
      import('bootstrap').then((bootstrap) => {
        const inst = (bootstrap as any).Offcanvas.getInstance(offcanvasEl)
        if (inst) inst.hide()
      })
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('scroll', adjustNavbarTop)
  window.removeEventListener('resize', adjustNavbarTop)
  if (removeAfterEach) removeAfterEach()
  if (languageDocClickHandler) {
    document.removeEventListener('click', languageDocClickHandler)
    languageDocClickHandler = null
  }
})

const router = useRouter()

const navigateMobile = (href: string | undefined, key: string): void => {
  // mark active
  setActiveLink(key)
  // close offcanvas reliably (Bootstrap instance + cleanup of backdrop)
  closeMobileOffcanvas().then(() => {
    // navigate after closed
    if (!href || href === '#') return
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.location.hash = href
      return
    }
    if (href.startsWith('http')) {
      window.location.href = href
      return
    }
    router.push(href).catch(() => {})
  })
}

const closeMobileOffcanvas = async (): Promise<void> => {
  const offcanvasEl = document.getElementById('mobileMenu')
  if (!offcanvasEl) return

  try {
    const bootstrap = await import('bootstrap')
    const Offcanvas = (bootstrap as any).Offcanvas
    const inst = Offcanvas.getInstance(offcanvasEl) || new Offcanvas(offcanvasEl)
    inst.hide()
  } catch (e) {
  }

  await new Promise((res) => setTimeout(res, 260))

  const backdrops = Array.from(document.querySelectorAll('.offcanvas-backdrop'))
  backdrops.forEach((b) => b.remove())

  document.body.classList.remove('offcanvas-open')
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// Helpers to read session and role
const getStoredToken = () => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
const getStoredRole = () => localStorage.getItem('user_role') || sessionStorage.getItem('user_role') || null

const roleToLabel = (r: string | null) => {
  if (!r) return 'Entrar'
  if (r === 'A') return 'Admin'
  if (r === 'E') return 'Empleado'
  if (r === 'C') return 'Cliente'
  return 'Entrar'
}

const roleToPath = (r: string | null) => {
  if (!r) return '/login'
  if (r === 'A') return '/admin'
  if (r === 'E') return '/empleado'
  if (r === 'C') return '/cliente'
  return '/dashboard'
}

import { computed } from 'vue'
const isAuthenticated = computed(() => !!getStoredToken())
const userRole = computed(() => getStoredRole())
const ctaLabel = computed(() => isAuthenticated.value ? roleToLabel(userRole.value) : 'Entrar')

function goToLogin() {
  // If there is a session, route to the role's main page; otherwise go to login
  const token = getStoredToken()
  const role = getStoredRole()
  if (token) {
    const p = roleToPath(role)
    router.push(p).catch(() => {})
    return
  }
  router.push('/login').catch(() => {})
}
</script>

<style scoped>
/* Los estilos se mantienen igual que en la versión anterior (verde unificado) */
  .navbar-main {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid #E9ECEF;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3000;
}

[data-bs-theme="dark"] .navbar-main {
  background: rgba(18, 18, 18, 0.95);
  border-bottom: 1px solid #2D2D2D;
}

.navbar-main.scrolled {
  top: 0;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

[data-bs-theme="dark"] .navbar-main.scrolled {
  background: rgba(18, 18, 18, 0.98);
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0;
}

.brand-logo {
  width: 60px;
  height: 60px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: none;
  box-shadow: none;
  transform: scale(2.5);
  transform-origin: center;
}

.brand-logo:hover {
  transform: scale(2.5);
  box-shadow: none;
}

.brand-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

  .brand-text {
    display: flex;
    flex-direction: column;
  }

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
}

.brand-tagline {
  font-size: 0.62rem;
  color: #6C757D;
  letter-spacing: 1px;
  margin: 0;
  text-transform: uppercase;
  font-weight: 500;
}

[data-bs-theme="dark"] .brand-tagline {
  color: #6C757D;
}

.nav-link-main {
  color: #495057 !important;
  font-weight: 600;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 0.45rem 0.9rem !important;
  margin: 0 0.12rem;
  border-radius: 8px;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

/* Quitar subrayado por defecto en todos los enlaces relevantes */
.nav-link-main,
.nav-link-main:link,
.nav-link-main:visited,
.nav-link-main:hover,
.nav-link-main:active,
.dropdown-item,
.dropdown-item-custom,
.offcanvas .navbar-nav .nav-link-main,
.offcanvas .navbar-nav .nav-link-main:link,
.offcanvas .navbar-nav .nav-link-main:visited,
.offcanvas .navbar-nav .nav-link-main:hover {
  text-decoration: none !important;
}

.navbar-brand {
  text-decoration: none !important;
  display: inline-flex;
  align-items: center;
}

[data-bs-theme="dark"] .nav-link-main {
  color: #ADB5BD !important;
}

.nav-link-main:hover, .nav-link-main:focus {
  color: #a6b828 !important;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%);
}

.nav-link-main.active {
  color: #a6b828 !important;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%);
  font-weight: 700;
}

.nav-link-main.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 3px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 3px;
}

.dropdown-menu-custom {
  background: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 10px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
  padding: 0.55rem;
  min-width: 180px;
  overflow: hidden;
  margin-top: 0.4rem;
  z-index: 2100;
}

@media (min-width: 992px) {
  /* Ensure dropdowns are positioned and visible on hover for desktop */
  /* position relative so the absolute submenu aligns to its parent */
  .nav-item.dropdown { position: relative; }

  .nav-item.dropdown .dropdown-menu-custom {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.18s ease, transform 0.18s ease;
    pointer-events: none;
  }

  .nav-item.dropdown:hover .dropdown-menu-custom {
    display: block;
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

[data-bs-theme="dark"] .dropdown-menu-custom {
  background: #121212;
  border: 1px solid #2D2D2D;
}

.dropdown-item-custom {
  color: #495057;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

/* For light mode ensure dropdown/menu text contrast */
.dropdown-menu-custom { color: #234823; }
.dropdown-item-custom { color: #234823; }

/* Ensure navbar links are readable in dark mode */
[data-bs-theme="dark"] .nav-link-main {
  color: #DFF6E6 !important;
}

[data-bs-theme="dark"] .dropdown-item-custom {
  color: #DFF6E6;
}

[data-bs-theme="dark"] .dropdown-menu-custom {
  background: #151515;
  border: 1px solid rgba(255,255,255,0.04);
  color: #DFF6E6;
}

/* Mobile controls color in dark */
[data-bs-theme="dark"] .mobile-actions .language-selector {
  color: #E6F7EC;
}

[data-bs-theme="dark"] .mobile-actions .language-selector .mobile-lang-code {
  color: #E6F7EC;
}

[data-bs-theme="dark"] .mobile-actions .mobile-entrar {
  color: #fff;
}

/* Offcanvas items global readability */
[data-bs-theme="dark"] .offcanvas .nav-link-main,
[data-bs-theme="dark"] .offcanvas .nav-link-main.active {
  color: #DFF6E6 !important;
}

[data-bs-theme="dark"] .dropdown-item-custom {
  color: #ADB5BD;
}

.dropdown-item-custom:hover {
  color: #a6b828;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%);
  transform: translateX(5px);
}

.dropdown-item-custom i {
  color: #a6b828;
  width: 20px;
  text-align: center;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  background: #FFFFFF;
  border: 1px solid #E9ECEF;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

[data-bs-theme="dark"] .language-selector {
  background: #1E1E1E;
  border: 1px solid #2D2D2D;
}

.language-selector:hover {
  background: #F8F9FA;
  border-color: #a6b828;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .language-selector:hover {
  background: #2D2D2D;
}

.language-flag {
  width: 20px;
  height: 14px;
  border-radius: 2px;
  object-fit: cover;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

  /* Mobile compact language selector */
  .mobile-lang .language-flag {
    width: 20px;
    height: 14px;
  }

  .mobile-lang .language-text {
    font-size: 0.75rem;
    margin-left: 6px;
    font-weight: 600;
  }

  /* Burbujas de contacto móviles */
  .mobile-contact .bubble {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    color: #a6b828;
    font-size: 1rem;
  }

  .mobile-contact .whatsapp-bubble {
    background: #25D366;
    color: white;
  }

  .mobile-actions {
    padding: 0.4rem 0.5rem;
  }

  .mobile-actions .theme-toggle {
    padding: 0.3rem 0.45rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }

  /* Floating contact (bottom-right) */
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

  @media (min-width: 992px) {
    .floating-contact { display: none; }
  }

  /* Offcanvas adjustments to ensure visibility and width */
  .offcanvas.offcanvas-end {
    width: 320px;
    max-width: 90%;
    z-index: 3000 !important;
  }

  /* Asegurar que el backdrop del offcanvas esté por debajo del offcanvas pero sobre otros elementos */
  .offcanvas-backdrop {
    z-index: 2990 !important;
  }

  /* Estética mejorada del offcanvas */
  .offcanvas.offcanvas-end {
    background: linear-gradient(180deg, #FFFFFF 0%, #F7FBF7 100%);
    border-radius: 12px 0 0 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    overflow: hidden;
  }

  .offcanvas .offcanvas-header {
    border-bottom: 1px solid rgba(0,0,0,0.04);
    padding: 1rem 1.25rem;
  }

  .offcanvas .brand-name {
    font-size: 1.25rem;
    margin: 0;
  }

  .offcanvas .offcanvas-body {
    padding: 1rem 1.25rem 1.5rem 1.25rem;
  }

  .offcanvas .navbar-nav .nav-item { width: 100%; }
  .offcanvas .navbar-nav .nav-link-main {
    display: block;
    width: 100%;
    padding: 0.9rem 0.75rem !important;
    margin: 0.35rem 0;
    border-radius: 8px;
    color: #234823 !important;
    background: transparent;
    font-weight: 700;
  }

  .offcanvas .navbar-nav .nav-link-main:hover {
    background: linear-gradient(90deg, rgba(166,184,40,0.08), rgba(166,184,40,0.03));
    color: #a6b828 !important;
    transform: translateX(4px);
  }

  .offcanvas .mt-3 .btn { border-radius: 8px; }

  /* Dark mode: offcanvas adaptado */
  [data-bs-theme="dark"] .offcanvas.offcanvas-end {
    background: linear-gradient(180deg, #0f1112 0%, #141414 100%);
    border: 1px solid rgba(255,255,255,0.03);
    color: #E6F7EC;
  }

  [data-bs-theme="dark"] .offcanvas .offcanvas-header {
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }

  [data-bs-theme="dark"] .offcanvas .offcanvas-body {
    color: #DFF6E6;
    background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent);
  }

  [data-bs-theme="dark"] .offcanvas .nav-link-main {
    color: #DFF6E6 !important;
  }

  /* Reforzar estilos para enlaces dentro del offcanvas (mayor especificidad) */
  [data-bs-theme="dark"] .offcanvas .navbar-nav .nav-link-main {
    color: #DFF6E6 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  /* Asegurar que el contenedor de la lista no tenga fondo claro en dark */
  [data-bs-theme="dark"] .offcanvas .navbar-nav {
    background: transparent !important;
  }

  [data-bs-theme="dark"] .offcanvas .btn-outline-success {
    color: #d4f2d8;
    border-color: rgba(255,255,255,0.06);
  }

  /* Forzar estilos de cualquier 'card' o panel dentro del offcanvas para ambos modos */
  .offcanvas .card,
  .offcanvas .content-card,
  .offcanvas .card-body,
  .offcanvas .content-card .card-body {
    background: transparent !important;
    border: none !important;
    color: inherit !important;
  }

  /* Dark mode: asegurar contraste en cards dentro del offcanvas */
  [data-bs-theme="dark"] .offcanvas .card,
  [data-bs-theme="dark"] .offcanvas .content-card,
  [data-bs-theme="dark"] .offcanvas .card-body {
    background: transparent !important;
    color: #DFF6E6 !important;
    border-color: rgba(255,255,255,0.03) !important;
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

.language-text {
  font-size: 0.85rem;
  font-weight: 600;
}

.language-dropdown {
  min-width: 160px;
}

.cta-button {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.4px;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 3px 10px rgba(166, 184, 40, 0.22);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(166, 184, 40, 0.4);
  color: white;
}

.mobile-header-info {
  display: none;
  padding: 1rem;
  background: #F8F9FA;
  border-top: 1px solid #E9ECEF;
  margin-top: 1rem;
  border-radius: 8px;
}

[data-bs-theme="dark"] .mobile-header-info {
  background: #1E1E1E;
  border-top: 1px solid #2D2D2D;
}

.navbar-toggler {
  border: 1px solid #E9ECEF;
  padding: 0.35rem 0.45rem;
  border-radius: 8px;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  background: #FFFFFF;
  font-size: 0.95rem;
}

[data-bs-theme="dark"] .navbar-toggler {
  border: 1px solid #2D2D2D;
  background: #1E1E1E;
}

.navbar-toggler:hover {
  border-color: #a6b828;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%);
}

@media (max-width: 991.98px) {
  .navbar-main {
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }

  .navbar-nav {
    padding-top: 0.6rem;
  }

  .nav-link-main {
    margin: 0.15rem 0;
    padding: 0.45rem 0.9rem !important;
  }

  .language-selector,
  .theme-toggle {
    margin-top: 0.8rem;
    justify-content: center;
    width: 100%;
  }

  .cta-button {
    margin-top: 0.8rem;
    justify-content: center;
    width: 100%;
    padding: 0.6rem 1rem;
  }

  .mobile-header-info {
    display: block;
  }
}

  /* Mejoras adicionales para móvil: logo centrado y hamburguesa a la derecha, menú claro y espacioso */
@media (max-width: 991.98px) {
  .navbar-main .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  /* Mostrar el nombre junto al logo en móvil, ocultar solo el tagline */
  .brand-text {
    display: flex;
  }
  .brand-tagline { display: none; }

  .brand-logo {
    width: 52px;
    height: 52px;
    transform: scale(2.5);
  }

  .navbar-toggler {
    order: 2;
    margin-left: auto;
  }

  .navbar-brand {
    order: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .collapse.navbar-collapse {
    width: 100%;
    background: transparent;
    margin-top: 0.5rem;
  }

  .navbar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem 0.5rem 1rem 0.5rem;
    background: rgba(248,248,248,0.95);
    border-radius: 12px;
  }

  .nav-link-main {
    padding: 0.9rem 0.75rem !important;
    border-radius: 8px;
    font-size: 1rem;
  }

  /* Mantener visibles en móvil los controles: modo, idioma y entrar */
  .language-selector, .cta-button { display: inline-flex; }

  /* Mejor apariencia de los controles móviles */
  .mobile-actions {
    padding: 0.25rem 0.25rem;
    gap: 0.5rem;
  }

  .mobile-actions .btn {
    padding: 0.45rem 0.6rem;
    border-radius: 8px;
  }

  /* Estilo compacto y consistente para controles móviles (modo + idioma) */
  .mobile-actions .language-selector {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.5rem 0.6rem;
    background: #FFFFFF;
    border: 1px solid #E9ECEF;
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    color: #234823;
    min-width: 78px;
    height: 42px;
    font-weight: 600;
  }

  .mobile-actions .language-selector i {
    font-size: 1rem;
  }

  /* Variación pequeña del CTA para móvil */
  .mobile-entrar {
    padding: 0.45rem 0.9rem;
    font-weight: 700;
    box-shadow: 0 6px 18px rgba(166,184,40,0.15);
    min-width: 110px;
    font-size: 1rem;
  }

  .mobile-lang-code {
    font-size: 0.9rem;
    font-weight: 700;
  }

  /* Dark mode: adaptar los controles móviles para que no queden blancos */
  [data-bs-theme="dark"] .mobile-actions .language-selector {
    background: linear-gradient(135deg, #2a2a2a 0%, #242424 100%);
    border: 1px solid rgba(255,255,255,0.06);
    color: #E6F7EC;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  }

  [data-bs-theme="dark"] .mobile-actions .language-selector:hover {
    background: linear-gradient(135deg, #323232 0%, #2b2b2b 100%);
    transform: translateY(-2px);
  }

  [data-bs-theme="dark"] .mobile-actions .language-selector i,
  [data-bs-theme="dark"] .mobile-actions .language-selector img {
    filter: brightness(1.3) contrast(0.9);
  }

  [data-bs-theme="dark"] .mobile-entrar {
    background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
    color: #fff;
    box-shadow: 0 8px 20px rgba(166,184,40,0.15);
    border: none;
  }

  /* Ajustes para dropdown menu en dark: fondo y color */
  [data-bs-theme="dark"] .dropdown-menu-custom,
  [data-bs-theme="dark"] .dropdown-menu {
    background: #151515;
    border: 1px solid rgba(255,255,255,0.04);
    color: #E6F7EC;
  }

  [data-bs-theme="dark"] .dropdown-item,
  [data-bs-theme="dark"] .dropdown-item-custom {
    color: #DDEFDE;
  }
}

@media (max-width: 768px) {
  .brand-name {
    font-size: 1.25rem;
  }
}

@media (max-width: 576px) {
  .brand-logo {
    width: 48px;
    height: 48px;
    transform: scale(1.3);
  }

  .brand-name {
    font-size: 1.1rem;
  }
}

/* Centrar logo en header del offcanvas */
.offcanvas .brand-section {
  justify-content: center;
  width: 100%;
}
</style>
