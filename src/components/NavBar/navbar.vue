<template>
  <nav
    class="navbar-main"
    id="mainNavbar"
    :class="{ 'scrolled': isNavbarScrolled }"
  >
    <div class="nav-inner">

      <!-- Logo -->
      <a class="navbar-brand" href="/">
        <div class="brand-logo">
          <img :src="logoUrl" alt="SENA" class="brand-img" />
        </div>
      </a>

      <!-- Links desktop -->
      <ul class="nav-links d-none d-lg-flex">
        <li>
          <a class="nav-link-main" :class="{ active: activeLink === 'inicio' }" href="/" @click="setActiveLink('inicio')">
            Inicio
          </a>
        </li>

        <li class="nav-dropdown-wrap">
          <button class="nav-link-main dropdown-trigger">
            Servicios
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown">
            <a class="dropdown-row" href="/ensayos">
              <span class="dropdown-icon"><i class="bi bi-tools"></i></span>
              <span class="dropdown-label">Ensayos</span>
            </a>
            <a class="dropdown-row" href="/cursos">
              <span class="dropdown-icon"><i class="bi bi-gear-fill"></i></span>
              <span class="dropdown-label">Cursos</span>
            </a>
            <a class="dropdown-row" href="/interlaboratorio">
              <span class="dropdown-icon"><i class="bi bi-shield-check"></i></span>
              <span class="dropdown-label">Interlaboratorio</span>
            </a>
          </div>
        </li>

        <li><a class="nav-link-main" :class="{ active: activeLink === 'nosotros' }" href="/nosotros" @click="setActiveLink('nosotros')">Nosotros</a></li>
        <li><a class="nav-link-main" :class="{ active: activeLink === 'blog' }" href="/blog" @click="setActiveLink('blog')">Blog</a></li>
        <!-- <li><a class="nav-link-main" :class="{ active: activeLink === 'eventos' }" href="/eventos" @click="setActiveLink('eventos')">Eventos</a></li> -->
        <li><a class="nav-link-main" :class="{ active: activeLink === 'acreditaciones' }" href="/acreditaciones" @click="setActiveLink('acreditaciones')">Acreditaciones</a></li>
        <li><a class="nav-link-main" :class="{ active: activeLink === 'contacto' }" href="/contacto" @click="setActiveLink('contacto')">Contacto</a></li>
      </ul>

      <!-- Acciones desktop -->
      <div class="nav-actions d-none d-lg-flex">
        <!-- Idioma -->
        <div class="lang-wrap nav-dropdown-wrap">
          <button class="lang-btn dropdown-trigger">
            <img :src="currentLanguage.flag" class="flag" :alt="currentLanguage.name" />
            <span class="lang-code">{{ currentLanguage.code }}</span>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown lang-dropdown">
            <a
              v-for="lang in languages"
              :key="lang.code"
              class="dropdown-row"
              href="#"
              @click.prevent="changeLanguage(lang, $event)"
            >
              <img :src="lang.flag" class="flag" :alt="lang.name" />
              <span class="dropdown-label">{{ lang.name }}</span>
            </a>
          </div>
        </div>

        <!-- CTA -->
        <button class="cta-btn" @click="goToLogin">
          <i class="bi bi-box-arrow-in-right"></i>
          <span>{{ ctaLabel }}</span>
        </button>
      </div>

      <!-- Hamburguesa -->
      <button
        class="hamburger d-lg-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileMenu"
        aria-controls="mobileMenu"
      >
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Barra de progreso scroll -->
    <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>
  </nav>

  <!-- Offcanvas móvil -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
    <div class="offcanvas-header">
      <div class="brand-logo offcanvas-logo">
        <img :src="logoUrl" alt="SENA" class="brand-img" />
      </div>
      <div class="offcanvas-controls">
        <button class="icon-btn" @click="$emit('toggle-theme')" title="Tema">
          <i class="bi" :class="currentTheme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'"></i>
        </button>
        <button type="button" class="icon-btn" data-bs-dismiss="offcanvas" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
    <div class="offcanvas-body">
      <nav class="mobile-nav">
        <template v-for="(item, idx) in menuItems" :key="item.key + '-' + idx">
          <template v-if="item.children">
            <div class="mobile-section">
              <button
                class="mobile-link mobile-parent"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#mobile-sub-' + idx"
              >
                <span>{{ item.label }}</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="collapse mobile-sub" :id="'mobile-sub-' + idx">
                <a
                  v-for="(child, cidx) in item.children"
                  :key="child.key + '-' + cidx"
                  class="mobile-sub-link"
                  :href="child.href || '#'"
                  @click.prevent="navigateMobile(child.href || '#', child.key)"
                >{{ child.label }}</a>
              </div>
            </div>
          </template>
          <template v-else>
            <a
              class="mobile-link"
              :class="{ active: activeLink === item.key }"
              :href="item.href || '#'"
              @click.prevent="navigateMobile(item.href || '#', item.key)"
            >{{ item.label }}</a>
          </template>
        </template>
      </nav>

      <!-- Idioma en móvil -->
      <div class="mobile-lang-row">
        <span class="mobile-section-label">Idioma</span>
        <div class="mobile-flags">
          <button
            v-for="lang in languages"
            :key="lang.code"
            class="flag-btn"
            :class="{ active: currentLanguage.code === lang.code }"
            @click="changeLanguage(lang)"
          >
            <img :src="lang.flag" class="flag" :alt="lang.name" />
            <span>{{ lang.code }}</span>
          </button>
        </div>
      </div>

      <!-- Contacto rápido -->
      <div class="mobile-contact-row">
        <a href="tel:+524421982279" class="contact-chip">
          <i class="bi bi-telephone-fill"></i>
          <span>Llamar</span>
        </a>
        <a href="https://wa.me/524421982279" target="_blank" class="contact-chip whatsapp">
          <i class="bi bi-whatsapp"></i>
          <span>WhatsApp</span>
        </a>
      </div>

      <!-- CTA móvil -->
      <button class="cta-btn w-100 mt-3" @click="goToLogin">
        <i class="bi bi-box-arrow-in-right"></i>
        <span>{{ ctaLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

interface Language { code: string; name: string; flag: string }
type Theme = 'light' | 'dark'
type ActiveLink = string
interface Props { currentTheme: Theme }
interface Emits { (e: 'toggle-theme'): void }

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const route = useRoute()
const activeLink: Ref<ActiveLink> = ref('inicio')
const isNavbarScrolled: Ref<boolean> = ref(false)
const scrollProgress = ref(0)

const languages: Language[] = reactive([
  { code: 'ES', name: 'Español', flag: 'https://flagcdn.com/w40/mx.png' },
  { code: 'EN', name: 'English', flag: 'https://flagcdn.com/w40/us.png' }
])
const currentLanguage: Ref<Language> = ref(languages[0])
const logoLight = new URL('../../image/Logo SENA.svg', import.meta.url).href
const logoDark = new URL('../../image/Logo-blanco.svg', import.meta.url).href
const logoUrl = computed(() => props.currentTheme === 'dark' ? logoDark : logoLight)

const menuItems = reactive([
  { label: 'Inicio', key: 'inicio', href: '/' },
  { label: 'Servicios', key: 'servicios', children: [
    { label: 'Ensayos', key: 'ensayos', href: '/ensayos' },
    { label: 'Cursos', key: 'cursos', href: '/cursos' },
    { label: 'Interlaboratorio', key: 'interlaboratorio', href: '/interlaboratorio' }
  ]},
  { label: 'Nosotros', key: 'nosotros', href: '/nosotros' },
  { label: 'Blog', key: 'blog', href: '/blog' },
  //{ label: 'Eventos', key: 'eventos', href: '/eventos' },
  { label: 'Acreditaciones', key: 'acreditaciones', href: '/acreditaciones' },
  { label: 'Contacto', key: 'contacto', href: '/contacto' }
])

const setActiveLink = (link: ActiveLink): void => { activeLink.value = link }

const determineActiveFromPath = (path: string): void => {
  if (!path) { activeLink.value = 'inicio'; return }
  // try to match top-level items
  for (const item of menuItems) {
    if (item.href && item.href === path) { activeLink.value = item.key; return }
    if (item.children) {
      for (const child of item.children) {
        if (child.href && (child.href === path || path.startsWith(child.href))) {
          activeLink.value = child.key; return
        }
      }
    }
    // allow matching by prefix (e.g., /acreditaciones/*)
    if (item.href && path.startsWith(item.href) && item.href !== '/') { activeLink.value = item.key; return }
  }
  // fallback
  activeLink.value = path === '/' ? 'inicio' : activeLink.value || 'inicio'
}

const changeLanguage = async (lang: Language, ev?: Event): Promise<void> => {
  currentLanguage.value = lang
  try {
    const bootstrap = await import('bootstrap')
    const Dropdown = (bootstrap as any).Dropdown
    document.querySelectorAll('.dropdown-toggle').forEach((el) => {
      try { const inst = Dropdown.getInstance(el); if (inst) inst.hide() } catch (e) {}
    })
  } catch (e) {}
}

const handleScroll = (): void => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  isNavbarScrolled.value = scrollTop > 40
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

const adjustNavbarTop = (): void => {
  const headerEl = document.getElementById('headerTop')
  const navbarEl = document.getElementById('mainNavbar')
  if (!navbarEl) return
  navbarEl.style.top = headerEl && !headerEl.classList.contains('hidden') ? `${headerEl.offsetHeight}px` : '0px'
}

let removeAfterEach: (() => void) | null = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('scroll', adjustNavbarTop, { passive: true })
  window.addEventListener('resize', adjustNavbarTop)
  adjustNavbarTop()
  import('bootstrap').then((bootstrap) => {
    const Dropdown = (bootstrap as any).Dropdown
    document.querySelectorAll('.dropdown-toggle').forEach((el) => {
      try { Dropdown.getOrCreateInstance(el) } catch (e) {}
    })
  }).catch(() => {})
  determineActiveFromPath(route.path)
  removeAfterEach = router.afterEach((to) => {
    determineActiveFromPath(to.path)
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
})

const navigateMobile = (href: string, key: string): void => {
  setActiveLink(key)
  closeMobileOffcanvas().then(() => {
    if (!href || href === '#') return
    if (href.startsWith('#')) { document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); return }
    if (href.startsWith('http')) { window.location.href = href; return }
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
  } catch (e) {}
  await new Promise((res) => setTimeout(res, 260))
  document.querySelectorAll('.offcanvas-backdrop').forEach((b) => b.remove())
  document.body.classList.remove('offcanvas-open')
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

const getStoredToken = () => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
const getStoredRole  = () => localStorage.getItem('user_role')  || sessionStorage.getItem('user_role')  || null
const roleToLabel = (r: string | null) => ({ A: 'Admin', E: 'Empleado', C: 'Cliente' }[r ?? ''] ?? 'Entrar')
const roleToPath  = (r: string | null) => ({ A: '/admin', E: '/empleado', C: '/cliente' }[r ?? ''] ?? '/dashboard')
const isAuthenticated = computed(() => !!getStoredToken())
const userRole = computed(() => getStoredRole())
const ctaLabel = computed(() => isAuthenticated.value ? roleToLabel(userRole.value) : 'Entrar')

function goToLogin() {
  const token = getStoredToken()
  const role = getStoredRole()
  router.push(token ? roleToPath(role) : '/login').catch(() => {})
}
</script>

<style scoped>
/* ============================================================
   TOKENS
   ============================================================ */
.navbar-main {
  --g-green:      #5d8a2f;
  --g-green-lt:   #7aab3d;
  --g-green-pale: #edf4e3;
  --g-text:       #1c2b14;
  --g-muted:      #5a6a52;
  --g-border:     rgba(93,138,47,0.14);
  --g-bg:         rgba(255,255,255,0.96);
  --g-shadow:     0 2px 24px rgba(0,0,0,0.08);
  --g-radius:     10px;
  --g-trans:      all 0.24s cubic-bezier(0.4,0,0.2,1);
  --font-body:    'DM Sans', 'Segoe UI', sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
}
/* ============================================================
   NAV SHELL
   ============================================================ */
.navbar-main {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 3000;
  background: var(--g-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--g-border);
  box-shadow: var(--g-shadow);
  transition: var(--g-trans);
  font-family: var(--font-body);
}

[data-bs-theme="dark"] .navbar-main {
  --g-bg:     rgba(10,15,7,0.96);
  --g-text:   #e8ede3;
  --g-muted:  #8a9e7c;
  --g-border: rgba(122,171,61,0.14);
  --g-shadow: 0 2px 24px rgba(0,0,0,0.4);
}

.navbar-main.scrolled {
  box-shadow: 0 4px 32px rgba(0,0,0,0.12);
}
[data-bs-theme="dark"] .navbar-main.scrolled {
  box-shadow: 0 4px 32px rgba(0,0,0,0.5);
}

/* scroll progress bar */
.scroll-progress {
  position: absolute;
  bottom: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--g-green), var(--g-green-lt));
  transition: width 0.1s linear;
  pointer-events: none;
}

/* ============================================================
   INNER LAYOUT
   ============================================================ */
.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* ============================================================
   BRAND
   ============================================================ */
.navbar-brand {
  text-decoration: none;
  flex-shrink: 0;
}

.brand-logo {
  width: 56px; height: 56px;
  display: flex; align-items: center; justify-content: center;
  transform: scale(1.8);
  transform-origin: left center;
}

.brand-img { width: 100%; height: 100%; object-fit: contain; }

/* ============================================================
   NAV LINKS (desktop)
   ============================================================ */
.nav-links {
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  align-items: center;
  gap: 0.15rem;
  flex: 1;
  justify-content: center;
}

.nav-link-main {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--g-muted);
  text-decoration: none;
  padding: 0.45rem 0.8rem;
  border-radius: 8px;
  border: none;
  background: none;
  cursor: pointer;
  transition: var(--g-trans);
  position: relative;
  white-space: nowrap;
}
.nav-link-main:hover { color: var(--g-green); background: var(--g-green-pale); }
.nav-link-main.active { color: var(--g-green); font-weight: 700; }
.nav-link-main.active::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 50%; transform: translateX(-50%);
  width: 18px; height: 2px;
  background: var(--g-green);
  border-radius: 2px;
}

[data-bs-theme="dark"] .nav-link-main { color: #8a9e7c; }
[data-bs-theme="dark"] .nav-link-main:hover { color: var(--g-green-lt); background: rgba(93,138,47,0.12); }
[data-bs-theme="dark"] .nav-link-main.active { color: var(--g-green-lt); }
[data-bs-theme="dark"] .nav-link-main.active::after { background: var(--g-green-lt); }

.chevron {
  width: 12px; height: 12px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

/* ============================================================
   DROPDOWN (hover)
   ============================================================ */
.nav-dropdown-wrap {
  position: relative;
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  background: #ffffff;
  border: 1px solid var(--g-border);
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  padding: 0.5rem;
  min-width: 190px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 100;
}
[data-bs-theme="dark"] .nav-dropdown {
  background: #131a0e;
  border-color: rgba(122,171,61,0.14);
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
}

.nav-dropdown-wrap:hover .nav-dropdown,
.nav-dropdown-wrap:focus-within .nav-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.nav-dropdown-wrap:hover .chevron { transform: rotate(180deg); }

.dropdown-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 9px;
  color: var(--g-text);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: var(--g-trans);
}
.dropdown-row:hover {
  background: var(--g-green-pale);
  color: var(--g-green);
  transform: translateX(3px);
}
[data-bs-theme="dark"] .dropdown-row { color: #c8d8be; }
[data-bs-theme="dark"] .dropdown-row:hover { background: rgba(93,138,47,0.14); color: var(--g-green-lt); }

.dropdown-icon {
  width: 30px; height: 30px;
  background: var(--g-green-pale);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  color: var(--g-green);
  font-size: 0.85rem;
  flex-shrink: 0;
  transition: var(--g-trans);
}
.dropdown-row:hover .dropdown-icon {
  background: linear-gradient(135deg, var(--g-green), var(--g-green-lt));
  color: white;
}
[data-bs-theme="dark"] .dropdown-icon { background: rgba(93,138,47,0.18); color: var(--g-green-lt); }

.dropdown-label { font-weight: 500; }

/* ============================================================
   ACTIONS (desktop)
   ============================================================ */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Language button */
.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.38rem 0.7rem;
  background: none;
  border: 1px solid var(--g-border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--g-muted);
  transition: var(--g-trans);
}
.lang-btn:hover { border-color: var(--g-green); color: var(--g-green); background: var(--g-green-pale); }
[data-bs-theme="dark"] .lang-btn { color: #8a9e7c; border-color: rgba(122,171,61,0.18); }
[data-bs-theme="dark"] .lang-btn:hover { color: var(--g-green-lt); background: rgba(93,138,47,0.1); border-color: var(--g-green-lt); }
.lang-dropdown { left: auto; right: 0; transform: translateX(0) translateY(6px); }
.nav-dropdown-wrap:hover .lang-dropdown { transform: translateX(0) translateY(0); }

.flag {
  width: 22px; height: 15px;
  border-radius: 3px;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.lang-code { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; }

/* Icon button (theme toggle) */
.icon-btn {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: none;
  border: 1px solid var(--g-border);
  color: var(--g-muted);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--g-trans);
}
.icon-btn:hover { border-color: var(--g-green); color: var(--g-green); background: var(--g-green-pale); }
[data-bs-theme="dark"] .icon-btn { color: #8a9e7c; border-color: rgba(122,171,61,0.18); }
[data-bs-theme="dark"] .icon-btn:hover { color: #ffd700; border-color: rgba(255,215,0,0.3); background: rgba(255,215,0,0.06); }

/* CTA button */
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  background: linear-gradient(135deg, var(--g-green) 0%, var(--g-green-lt) 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(93,138,47,0.28);
  transition: var(--g-trans);
  white-space: nowrap;
  justify-content: center;
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(93,138,47,0.38); }
.cta-btn:active { transform: translateY(0); }

/* ============================================================
   HAMBURGER
   ============================================================ */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 38px; height: 38px;
  padding: 0.4rem;
  background: none;
  border: 1px solid var(--g-border);
  border-radius: 8px;
  cursor: pointer;
  transition: var(--g-trans);
  margin-left: auto;
}
.hamburger span {
  display: block;
  height: 2px;
  background: var(--g-muted);
  border-radius: 2px;
  transition: var(--g-trans);
}
.hamburger:hover { border-color: var(--g-green); background: var(--g-green-pale); }
.hamburger:hover span { background: var(--g-green); }
.hamburger span:nth-child(1) { width: 20px; }
.hamburger span:nth-child(2) { width: 14px; }
.hamburger span:nth-child(3) { width: 17px; }
[data-bs-theme="dark"] .hamburger span { background: #8a9e7c; }

/* ============================================================
   OFFCANVAS
   ============================================================ */
.offcanvas.offcanvas-end {
  width: 300px;
  max-width: 88vw;
  background: #ffffff;
  border-left: 1px solid var(--g-border) !important;
  z-index: 4000 !important;
}
[data-bs-theme="dark"] .offcanvas.offcanvas-end {
  background: #0d130a;
  border-left-color: rgba(122,171,61,0.12) !important;
}

.offcanvas-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--g-border);
}
.offcanvas-logo { width: 48px; height: 48px; transform: scale(1.6); transform-origin: left center; }
.offcanvas-controls { display: flex; gap: 0.4rem; }

.offcanvas-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.25rem; }

/* Mobile nav */
.mobile-nav { display: flex; flex-direction: column; gap: 0.2rem; margin-bottom: 1rem; }

.mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0.9rem;
  border-radius: 10px;
  color: var(--g-text);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: var(--g-trans);
}
.mobile-link:hover, .mobile-link.active {
  background: var(--g-green-pale);
  color: var(--g-green);
}
[data-bs-theme="dark"] .mobile-link { color: #c8d8be; }
[data-bs-theme="dark"] .mobile-link:hover,
[data-bs-theme="dark"] .mobile-link.active { background: rgba(93,138,47,0.12); color: var(--g-green-lt); }

.mobile-parent .chevron { width: 14px; height: 14px; }
.mobile-sub { padding-left: 0.75rem; display: flex; flex-direction: column; gap: 0.1rem; }
.mobile-sub-link {
  display: block;
  padding: 0.55rem 0.8rem;
  border-radius: 8px;
  color: var(--g-muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: var(--g-trans);
  border-left: 2px solid transparent;
}
.mobile-sub-link:hover { color: var(--g-green); border-left-color: var(--g-green); background: var(--g-green-pale); }
[data-bs-theme="dark"] .mobile-sub-link { color: #8a9e7c; }
[data-bs-theme="dark"] .mobile-sub-link:hover { color: var(--g-green-lt); border-left-color: var(--g-green-lt); background: rgba(93,138,47,0.1); }

/* Language row */
.mobile-lang-row {
  padding: 0.9rem;
  background: var(--g-green-pale);
  border-radius: 12px;
  margin-bottom: 0.5rem;
}
[data-bs-theme="dark"] .mobile-lang-row { background: rgba(93,138,47,0.1); }

.mobile-section-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--g-muted);
  margin-bottom: 0.6rem;
}

.mobile-flags { display: flex; gap: 0.5rem; }
.flag-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  border-radius: 7px;
  border: 1px solid var(--g-border);
  background: white;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--g-muted);
  cursor: pointer;
  transition: var(--g-trans);
}
.flag-btn:hover, .flag-btn.active { border-color: var(--g-green); color: var(--g-green); background: var(--g-green-pale); }
[data-bs-theme="dark"] .flag-btn { background: rgba(255,255,255,0.05); color: #8a9e7c; border-color: rgba(122,171,61,0.18); }
[data-bs-theme="dark"] .flag-btn.active { color: var(--g-green-lt); border-color: var(--g-green-lt); }

/* Contact chips */
.mobile-contact-row { display: flex; gap: 0.5rem; margin-bottom: 0.25rem; }
.contact-chip {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0.65rem;
  border-radius: 10px;
  border: 1px solid var(--g-border);
  background: none;
  color: var(--g-green);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--g-trans);
}
.contact-chip:hover { background: var(--g-green-pale); border-color: var(--g-green); }
.contact-chip.whatsapp { background: #25D366; color: white; border-color: #25D366; }
.contact-chip.whatsapp:hover { background: #1db955; border-color: #1db955; }
[data-bs-theme="dark"] .contact-chip { color: var(--g-green-lt); border-color: rgba(122,171,61,0.2); }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 991.98px) {
  .nav-inner { height: 58px; padding: 0 1rem; }
  .brand-logo { width: 48px; height: 48px; transform: scale(1.5); }
}

@media (max-width: 576px) {
  .nav-inner { height: 54px; padding: 0 0.75rem; }
}
</style>
