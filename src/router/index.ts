import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Nosotros from '@/views/Nosotrros/Nosotros.vue'
import Servicios from '@/views/Servicios.vue'
import Contacto from '@/views/Contacto.vue'
import Login from '@/components/Login/Login.vue'
import Register from '@/components/Login/Register.vue'
import RecoverPassword from '@/components/Login/RecoverPassword.vue'
import VerifyEmail from '@/components/Login/Verificar.vue'
import Blog from '@/views/Blog.vue'
import BlogVisualizado from '@/views/BlogVisualizado.vue'
import Eventos from '@/views/eventos.vue'

import Fabricacion from '@/components/Fabricacion/fabricacion.vue'

// Imports de las vistas de servicios
import Ensayos from '@/views/Servicios/Ensayos.vue'
import Interlaboratorio from '@/views/Servicios/Interlaboratorio.vue'
import Cursos from '@/views/Servicios/Cursos.vue'

// Import de las vistas de Acreditaciones
import Acreditaciones from '@/views/Acrediciones/Acreditamientos/Acreditamiento.vue'

// Import momentaneos
import useUiStore from '@/compasable/useUiStore'

// Import de Administrador
import AdminInicio from '@/views/Administrador/Inicio/inicio.vue'
import AdminUsuarios from '@/views/Administrador/Usuarios/adminusuarios.vue'
import BlogAdmin from '@/views/Administrador/Blog/BlogAdmin.vue'
import EventosAdmin from '@/views/Administrador/Event/EventosAdmin.vue'
import Perfil from '@/components/perfil/perfil.vue'
import Cotizacion from '@/views/Administrador/Cotizaciones/CotizacionesPage.vue'
import Catalogos from '@/views/Administrador/Catalogos/AreasRamas.vue'
import Precios from '@/views/Administrador/Catalogos/Precios.vue'
import Inscripciones from '@/views/Administrador/Inscripciones/Inscripcion.vue'
import ParticipantesView from '@/views/Administrador/Inscripciones/ParticipantesView.vue'
import AdminCursos from '@/views/Administrador/Cursos/admincursos.vue'
import AdminPagos from '@/views/Administrador/Pagos/pagos.vue'

// Import de Empleado
import Empleado from '@/views/Empleado/empleado.vue'

// Import de Clientes
import Clientes from '@/views/Cliente/DashboardCliente/DashboardCliente.vue'
import AgendaSesiones from '@/views/Cliente/AgendaSesiones.vue'
import CursoDetalle from '@/views/Cliente/CursoDetalle.vue'
//import CursosCatalogo from '@/views/Cliente/CursosCatalogo.vue'
import ClienteInscripciones from '@/views/Cliente/Inscripciones.vue'
import MisCotizaciones from '@/views/Cliente/MisCotizaciones.vue'
import PagosRecibos from '@/views/Cliente/PagosRecibos.vue'
//import ReportesCliente from '@/views/Cliente/Reportes.vue'
import SolicitarCotizacion from '@/views/Cliente/SolicitarCotizacion.vue'

// Rutas agrupadas por layout: las que usan el `Navbar` y las que usarán `Sidebar`.
const navbarRoutes = [
  { path: '/', name: 'home', component: HomeView, meta: { layout: 'navbar' } },
  { path: '/nosotros', name: 'nosotros', component: Nosotros, meta: { layout: 'navbar' } },
  { path: '/servicios', name: 'servicios', component: Servicios, meta: { layout: 'navbar' } },
  { path: '/contacto', name: 'contacto', component: Contacto, meta: { layout: 'navbar' } },
  { path: '/blog', name: 'blog', component: Blog, meta: { layout: 'navbar' } },
  { path: '/blog/:id', name: 'blog-article', component: BlogVisualizado, meta: { layout: 'navbar' }, props: true },
  { path: '/eventos', name: 'eventos', component: Eventos, meta: { layout: 'navbar' } },

  // Rutas de Login y Registro
  { path: '/login', name: 'login', component: Login, meta: { layout: 'navbar' } },
  { path: '/registro', name: 'registro', component: Register, meta: { layout: 'navbar' } },
  { path: '/recuperar-contrasena', name: 'recuperar-contrasena', component: RecoverPassword, meta: { layout: 'navbar' } },
  { path: '/verificar', name: 'verificar', component: VerifyEmail, meta: { layout: 'navbar' } }, // Reutilizando el componente para la verificación de email

  // Rutas de Servicios
  { path: '/ensayos', name: 'ensayos', component: Ensayos, meta: { layout: 'navbar' } },
  { path: '/interlaboratorio', name: 'interlaboratorio', component: Interlaboratorio, meta: { layout: 'navbar' } },
  { path: '/cursos', name: 'cursos', component: Cursos, meta: { layout: 'navbar' } },

  // Rutas de Acreditaciones
  { path: '/acreditaciones', name: 'acreditaciones', component: Acreditaciones, meta: { layout: 'navbar' } }
]

// Rutas administrativas que usarán el sidebar
const sidebarRoutes = [
  // Administrador
  { path: '/admin', name: 'admin-inicio', component: AdminInicio, meta: { layout: 'sidebar' } },
  { path: '/adminusuarios', name: 'admin-usuarios', component: AdminUsuarios, meta: { layout: 'sidebar' } },
  { path: '/adminblog', name: 'admin-blog', component: BlogAdmin, meta: { layout: 'sidebar' } },
  { path: '/admineventos', name: 'admin-eventos', component: EventosAdmin, meta: { layout: 'sidebar' } },
  { path: '/adminperfil', name: 'admin-perfil', component: Perfil, meta: { layout: 'sidebar' } },
  { path: '/admincatalogos', name: 'admin-catalogos', component: Catalogos, meta: { layout: 'sidebar' } }, //pendiente
  { path: '/adminprecios', name: 'admin-precios', component: Precios, meta: { layout: 'sidebar' } }, //pendiente
  { path: '/admincursos', name: 'admin-cursos', component: AdminCursos, meta: { layout: 'sidebar' } },
  { path: '/admininscripciones', name: 'admin-inscripciones', component: Inscripciones, meta: { layout: 'sidebar' } },
  { path: '/adminpagos', name: 'admin-pagos', component: AdminPagos, meta: { layout: 'sidebar' } },
  { path: '/admincotizaciones', name: 'admin-cotizaciones', component: Cotizacion, meta: { layout: 'sidebar' } },

  // Empleado
  { path: '/empleado', name: 'empleado-inicio', component: Empleado, meta: { layout: 'sidebar' } },

  // Cliente
  { path: '/Cliente', name: 'cliente-inicio', component: Clientes, meta: { layout: 'sidebar' } },
  { path: '/ClienteAgendaSesiones', name: 'cliente-agenda-sesiones', component: AgendaSesiones, meta: { layout: 'sidebar' } },
  { path: '/ClienteCursoDetalle', name: 'cliente-curso-detalle', component: CursoDetalle, meta: { layout: 'sidebar' }, props: true },
  { path: '/ClienteCotizaciones', name: 'cliente-mis-cotizaciones', component: MisCotizaciones, meta: { layout: 'sidebar' } },
  { path: '/ClienteInscripciones', name: 'cliente-inscripciones', component: ClienteInscripciones, meta: { layout: 'sidebar' } },
  { path: '/ClientePagosRecibos', name: 'cliente-pagos-recibos', component: PagosRecibos, meta: { layout: 'sidebar' } },
  { path: '/ClienteSolicitarCotizacion', name: 'cliente-solicitar-cotizacion', component: SolicitarCotizacion, meta: { layout: 'sidebar' } },
  // En tu router
  { path: '/admin/inscripciones/:tipo/:id/participantes', name: 'participantes', component: ParticipantesView, meta: { layout: 'sidebar' }, props: true },
  { path: '/fabricacion', name: 'fabricacion', component: Fabricacion, meta: { layout: 'sidebar' } }

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
