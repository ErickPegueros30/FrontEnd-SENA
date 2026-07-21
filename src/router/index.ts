import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import useUiStore from '@/composables/useUiStore'
import { releaseAllBodyScrollLocks } from '@/composables/useBodyScrollLock'

/**
 * Todas las vistas salvo HomeView se cargan de forma diferida.
 * Vite genera un chunk por vista, de modo que un visitante anonimo ya no
 * descarga el panel de administracion completo en la carga inicial.
 * Las rutas, nombres, meta y props son identicos a los anteriores.
 */

const Nosotros = () => import('@/views/Nosotros/Nosotros.vue')
const Servicios = () => import('@/views/Servicios.vue')
const Contacto = () => import('@/views/Contacto.vue')
const Login = () => import('@/components/Login/Login.vue')
const Register = () => import('@/components/Login/Register.vue')
const RecoverPassword = () => import('@/components/Login/RecoverPassword.vue')
const VerifyEmail = () => import('@/components/Login/Verificar.vue')
const Blog = () => import('@/views/Blog.vue')
const BlogVisualizado = () => import('@/views/BlogVisualizado.vue')
const Eventos = () => import('@/views/eventos.vue')
const Fabricacion = () => import('@/components/Fabricacion/fabricacion.vue')
const Ensayos = () => import('@/views/Servicios/Ensayos.vue')
const Interlaboratorio = () => import('@/views/Servicios/Interlaboratorio.vue')
const Cursos = () => import('@/views/Servicios/Cursos.vue')
const Acreditaciones = () => import('@/views/Acreditaciones/Acreditamientos/Acreditamiento.vue')
const AdminInicio = () => import('@/views/Administrador/Inicio/inicio.vue')
const AdminUsuarios = () => import('@/views/Administrador/Usuarios/adminusuarios.vue')
const BlogAdmin = () => import('@/views/Administrador/Blog/BlogAdmin.vue')
const EventosAdmin = () => import('@/views/Administrador/Event/EventosAdmin.vue')
const Perfil = () => import('@/components/perfil/perfil.vue')
const Cotizacion = () => import('@/views/Administrador/Cotizaciones/CotizacionesPage.vue')
const Catalogos = () => import('@/views/Administrador/Catalogos/AreasRamas.vue')
const Precios = () => import('@/views/Administrador/Catalogos/Precios.vue')
const Inscripciones = () => import('@/views/Administrador/Inscripciones/Inscripcion.vue')
const ParticipantesView = () => import('@/views/Administrador/Inscripciones/ParticipantesView.vue')
const AdminCursos = () => import('@/views/Administrador/Cursos/admincursos.vue')
const AdminPagos = () => import('@/views/Administrador/Pagos/pagos.vue')
const Configuracion = () => import('@/views/Administrador/Configuracion/configuracion.vue')
const AdminEnsayos = () => import('@/views/Administrador/Servicios/Ensayos/adminEnsayos.vue')
const AdminInterlaboratorio = () => import('@/views/Administrador/Servicios/Interlaboratorio/adminInterlaboratorio.vue')
const Empleado = () => import('@/views/Empleado/empleado.vue')
const Clientes = () => import('@/views/Cliente/DashboardCliente/DashboardCliente.vue')
const AgendaSesiones = () => import('@/views/Cliente/AgendaSesiones.vue')
const CursoDetalle = () => import('@/views/Cliente/CursoDetalle.vue')
//const CursosCatalogo = () => import('@/views/Cliente/CursosCatalogo.vue')
const ClienteInscripciones = () => import('@/views/Cliente/Inscripciones.vue')
const MisCotizaciones = () => import('@/views/Cliente/MisCotizaciones.vue')
const PagosRecibos = () => import('@/views/Cliente/PagosRecibos.vue')
//const ReportesCliente = () => import('@/views/Cliente/Reportes.vue')
const SolicitarCotizacion = () => import('@/views/Cliente/SolicitarCotizacion.vue')
const EnsayoDetalle = () => import('@/views/Servicios/EnsayoDetalle.vue')

// Rutas agrupadas por layout: las que usan el `Navbar` y las que usarán `Sidebar`.
const navbarRoutes = [
  { path: '/', name: 'home', component: HomeView, meta: { layout: 'navbar' } },
  { path: '/nosotros', name: 'nosotros', component: Nosotros, meta: { layout: 'navbar' } },
  { path: '/servicios', name: 'servicios', component: Servicios, meta: { layout: 'navbar' } },
  { path: '/contacto', name: 'contacto', component: Contacto, meta: { layout: 'navbar' } },
  { path: '/blog', name: 'blog', component: Blog, meta: { layout: 'navbar' } },
  { path: '/blog/:id', name: 'blog-article', component: BlogVisualizado, meta: { layout: 'navbar' }, props: true },
  //{ path: '/eventos', name: 'eventos', component: Eventos, meta: { layout: 'navbar' } },

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
  { path: '/acreditaciones', name: 'acreditaciones', component: Acreditaciones, meta: { layout: 'navbar' } },

  // Rutas temporales
  { path: '/ensayo-detalle', name: 'ensayo-detalle', component: EnsayoDetalle, meta: { layout: 'navbar' } }
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
  { path: '/configuracion', name: 'configuracion', component: Configuracion, meta: { layout: 'sidebar' } },
  { path: '/adminensayos', name: 'admin-ensayos', component: AdminEnsayos, meta: { layout: 'sidebar' } },
  { path: '/admininterlaboratorio', name: 'admin-interlaboratorio', component: AdminInterlaboratorio, meta: { layout: 'sidebar' } },

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
  ],
  scrollBehavior(to, from, savedPosition) {
    // If the browser provides a saved position (back/forward), respect it
    if (savedPosition) return savedPosition

    // If navigating to a hash, scroll the element into view at the start
    if (to.hash) {
      return { el: to.hash, top: 0, behavior: 'smooth' }
    }

    // Default: go to top of the page
    return { left: 0, top: 0 }
  }
})

// Guard: ajustar la visibilidad del layout según la meta de la ruta
router.beforeEach((to, from, next) => {
  // Red de seguridad: si alguna vista deja el scroll bloqueado, al navegar se
  // libera. Evita que la aplicacion quede "congelada" por un modal mal cerrado.
  releaseAllBodyScrollLocks()

  try {
    const ui = useUiStore()
    const layout = (to.meta && (to.meta as { layout?: string }).layout) || 'navbar'
    if (layout === 'sidebar') {
      ui.setSidebarVisible(true)
      ui.setNavbarVisible(false)
    } else {
      ui.setSidebarVisible(false)
      ui.setNavbarVisible(true)
    }
  } catch (e) {
    // no bloquear la navegación por errores en la store
    console.warn('ui store not ready', e)
  }
  next()
})

export default router
