import { reactive, readonly, watch } from 'vue'

type Theme = 'light' | 'dark'

const state = reactive({
  sidebarVisible: true,
  sidebarCollapsed: false,
  navbarVisible: false,
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  language: localStorage.getItem('language') || 'es'
})

function init() {
  // initialize persisted values
  const savedSidebar = localStorage.getItem('sidebarCollapsed')
  if (savedSidebar !== null) state.sidebarCollapsed = JSON.parse(savedSidebar)
  state.sidebarVisible = true
  const savedLang = localStorage.getItem('language')
  if (savedLang) state.language = savedLang
  const savedTheme = localStorage.getItem('theme') as Theme | null
  if (savedTheme) state.theme = savedTheme

  // apply theme to document
  try { document.documentElement.setAttribute('data-bs-theme', state.theme) } catch(e) {}

  // ensure mutual exclusivity: navbarVisible is inverse of sidebarVisible
  state.navbarVisible = !state.sidebarVisible
}

function setSidebarVisible(v: boolean) {
  state.sidebarVisible = v
  state.navbarVisible = !v
  if (!v) state.sidebarCollapsed = false
}
function setSidebarCollapsed(v: boolean) {
  state.sidebarCollapsed = v
  localStorage.setItem('sidebarCollapsed', JSON.stringify(v))
  state.sidebarVisible = true
  state.navbarVisible = false
}
function toggleSidebar() {
  const newCollapsed = !state.sidebarCollapsed
  setSidebarCollapsed(newCollapsed)
}

function setNavbarVisible(v: boolean) {
  state.navbarVisible = v
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', state.theme)
  try { document.documentElement.setAttribute('data-bs-theme', state.theme) } catch(e) {}
}

function setTheme(v: Theme) {
  state.theme = v
  localStorage.setItem('theme', v)
  try { document.documentElement.setAttribute('data-bs-theme', v) } catch(e) {}
}

function setLanguage(code: string) {
  state.language = code
  localStorage.setItem('language', code)
}

// persist sidebarCollapsed and theme automatically
watch(() => state.sidebarCollapsed, (v) => localStorage.setItem('sidebarCollapsed', JSON.stringify(v)))
watch(() => state.theme, (v) => localStorage.setItem('theme', v))
watch(() => state.language, (v) => localStorage.setItem('language', v))

export default function useUiStore() {
  return {
    state: readonly(state),
    init,
    setSidebarVisible,
    setSidebarCollapsed,
    toggleSidebar,
    setNavbarVisible,
    toggleTheme,
    setTheme,
    setLanguage
  }
}
