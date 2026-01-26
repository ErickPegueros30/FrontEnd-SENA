import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Nosotros from '@/views/Nosotrros/Nosotros.vue'
import Servicios from '@/views/Servicios.vue'
import Contacto from '@/views/Contacto.vue'
import Login from '@/components/Login/Login.vue'
import Register from '@/components/Login/Register.vue'
import RecoverPassword from '@/components/Login/RecoverPassword.vue'
import Blog from '@/views/Blog.vue'

// Imports de las vistas de servicios
import Ensayos from '@/views/Servicios/Ensayos.vue'
import Interlaboratorio from '@/views/Servicios/Interlaboratorio.vue'
import Cursos from '@/views/Servicios/Cursos.vue'

// Import momentaneos
import sidebar from '@/components/SideBar/sidebar.vue'
import useUiStore from '@/compasable/useUiStore'

// Import de Administrador
import AdminInicio from '@/views/Administrador/Inicio/inicio.vue'

// Rutas agrupadas por layout: las que usan el `Navbar` y las que usarán `Sidebar`.
const navbarRoutes = [
  { path: '/', name: 'home', component: HomeView, meta: { layout: 'navbar' } },
  { path: '/nosotros', name: 'nosotros', component: Nosotros, meta: { layout: 'navbar' } },
  { path: '/servicios', name: 'servicios', component: Servicios, meta: { layout: 'navbar' } },
  { path: '/contacto', name: 'contacto', component: Contacto, meta: { layout: 'navbar' } },
  { path: '/blog', name: 'blog', component: Blog, meta: { layout: 'navbar' } },
  { path: '/login', name: 'login', component: Login, meta: { layout: 'navbar' } },
  { path: '/registro', name: 'registro', component: Register, meta: { layout: 'navbar' } },
  { path: '/recuperar-contrasena', name: 'recuperar-contrasena', component: RecoverPassword, meta: { layout: 'navbar' } },

  // Rutas de Servicios (también con Navbar)
  { path: '/ensayos', name: 'ensayos', component: Ensayos, meta: { layout: 'navbar' } },
  { path: '/interlaboratorio', name: 'interlaboratorio', component: Interlaboratorio, meta: { layout: 'navbar' } },
  { path: '/cursos', name: 'cursos', component: Cursos, meta: { layout: 'navbar' } }
]

// Rutas administrativas que usarán el sidebar
const sidebarRoutes = [
  { path: '/admin', name: 'admin-inicio', component: AdminInicio, meta: { layout: 'sidebar' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...navbarRoutes,
    ...sidebarRoutes
  ]
})

// Guard: ajustar la visibilidad del layout según la meta de la ruta
router.beforeEach((to, from, next) => {
  try {
    const ui = useUiStore()
    const layout = (to.meta && (to.meta as any).layout) || 'navbar'
    console.log('[router.beforeEach] to=', to.fullPath, 'layout=', layout)
    if (layout === 'sidebar') {
      ui.setSidebarVisible(true)
      ui.setNavbarVisible(false)
      console.log('[router.beforeEach] set sidebarVisible=true')
    } else {
      ui.setSidebarVisible(false)
      ui.setNavbarVisible(true)
      console.log('[router.beforeEach] set sidebarVisible=false')
    }
    console.log('[router.beforeEach] ui.state=', ui.state)
  } catch (e) {
    // no bloquear la navegación por errores en la store
    console.warn('ui store not ready', e)
  }
  next()
})

export default router
