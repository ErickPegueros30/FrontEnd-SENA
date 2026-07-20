<template>
  <div :data-bs-theme="currentTheme" class="cliente-dashboard">
    <!-- Header con breadcrumb -->
    <header class="dashboard-header">
      <div class="container">
        <nav class="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Inicio
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-speedometer2"></i> Mi Dashboard
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-speedometer2 me-2"></i>Panel de Control
            </h1>
            <p class="page-subtitle">
              Bienvenido/a, {{ userData.nombre }} {{ userData.primer_apellido }}. Gestiona tus cotizaciones, agenda y reportes.
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card" v-for="stat in quickStats" :key="stat.label">
                <div class="stat-icon" :class="stat.iconClass">
                  <i :class="stat.icon"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ stat.value }}</span>
                  <span class="stat-label">{{ stat.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Tarjetas de conteos rápidos -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card-large" v-for="stat in statsCards" :key="stat.title">
            <div class="stat-card-icon" :style="{ background: stat.gradient }">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-card-content">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-title">{{ stat.title }}</span>
              <span class="stat-trend" :class="stat.trendClass">
                <i :class="stat.trendIcon"></i> {{ stat.trend }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Accesos rápidos -->
    <section class="quick-access-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="bi bi-lightning-charge me-2"></i>Accesos Rápidos
          </h2>
          <p class="section-subtitle">Accede directamente a las funcionalidades más utilizadas</p>
        </div>

        <div class="quick-access-grid">
          <div
            v-for="action in quickAccess"
            :key="action.name"
            class="quick-access-card"
            @click="navigateTo(action.route)"
          >
            <div class="quick-access-icon" :style="{ background: action.gradient }">
              <i :class="action.icon"></i>
            </div>
            <div class="quick-access-info">
              <h4>{{ action.name }}</h4>
              <p>{{ action.description }}</p>
            </div>
            <div class="quick-access-arrow">
              <i class="bi bi-arrow-right-circle"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Actividad Reciente y Próximas Sesiones -->
    <section class="activity-section">
      <div class="container">
        <div class="row g-4">
          <!-- Próximas sesiones -->
          <div class="col-lg-6">
            <div class="info-card">
              <div class="card-header-custom">
                <h3 class="card-title">
                  <i class="bi bi-calendar-event me-2"></i>Próximas Sesiones
                </h3>
                <router-link to="/cliente/agenda" class="view-all-link">
                  Ver todas <i class="bi bi-chevron-right"></i>
                </router-link>
              </div>
              <div class="card-body-custom">
                <div v-if="upcomingSessions.length === 0" class="empty-state-small">
                  <i class="bi bi-calendar-x"></i>
                  <p>No hay sesiones programadas</p>
                </div>
                <div v-else class="sessions-list">
                  <div v-for="session in upcomingSessions" :key="session.id" class="session-item">
                    <div class="session-date">
                      <span class="date-day">{{ session.day }}</span>
                      <span class="date-month">{{ session.month }}</span>
                    </div>
                    <div class="session-info">
                      <h4>{{ session.title }}</h4>
                      <p><i class="bi bi-clock"></i> {{ session.time }}</p>
                      <p><i class="bi bi-person"></i> {{ session.teacher }}</p>
                    </div>
                    <div class="session-status" :class="session.statusClass">
                      {{ session.status }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actividad reciente -->
          <div class="col-lg-6">
            <div class="info-card">
              <div class="card-header-custom">
                <h3 class="card-title">
                  <i class="bi bi-activity me-2"></i>Actividad Reciente
                </h3>
                <router-link to="/cliente/cotizaciones" class="view-all-link">
                  Ver todas <i class="bi bi-chevron-right"></i>
                </router-link>
              </div>
              <div class="card-body-custom">
                <div v-if="recentActivity.length === 0" class="empty-state-small">
                  <i class="bi bi-inbox"></i>
                  <p>No hay actividad reciente</p>
                </div>
                <div v-else class="activity-list">
                  <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                    <div class="activity-icon" :class="activity.iconClass">
                      <i :class="activity.icon"></i>
                    </div>
                    <div class="activity-info">
                      <p class="activity-description">{{ activity.description }}</p>
                      <span class="activity-time">{{ activity.timeAgo }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reportes y documentos recientes -->
    <section class="reports-section">
      <div class="container">
        <div class="info-card">
          <div class="card-header-custom">
            <h3 class="card-title">
              <i class="bi bi-file-text me-2"></i>Reportes y Documentos Recientes
            </h3>
            <router-link to="/cliente/reportes" class="view-all-link">
              Ver todos <i class="bi bi-chevron-right"></i>
            </router-link>
          </div>
          <div class="card-body-custom">
            <div v-if="recentReports.length === 0" class="empty-state-small">
              <i class="bi bi-file-earmark-text"></i>
              <p>No hay reportes disponibles</p>
            </div>
            <div v-else class="reports-grid">
              <div v-for="report in recentReports" :key="report.id" class="report-item">
                <div class="report-icon" :class="report.typeClass">
                  <i :class="report.icon"></i>
                </div>
                <div class="report-info">
                  <h4>{{ report.title }}</h4>
                  <p>{{ report.date }}</p>
                </div>
                <button class="btn-download" @click="downloadReport(report)">
                  <i class="bi bi-download"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        id="clientToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastEl"
      >
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto">
            <i :class="toastIcon"></i> {{ toastTitle }}
          </strong>
          <small>Ahora mismo</small>
          <button
            type="button"
            class="btn-close"
            :class="toastType === 'success' ? 'btn-close-white' : ''"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body bg-body border border-opacity-25 rounded-bottom" :class="`border-${toastType}`">
          <div class="d-flex align-items-center">
            <i :class="toastBodyIcon" class="fs-5 me-2"></i>
            <span>{{ toastMessage }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Datos del usuario (mock desde localStorage o valores por defecto)
interface UserData {
  id: number
  nombre: string
  primer_apellido: string
  segundo_apellido: string
  email: string
  telefono: string
}

const userData = ref<UserData>({
  id: 1,
  nombre: 'María',
  primer_apellido: 'González',
  segundo_apellido: 'Pérez',
  email: 'maria.gonzalez@example.com',
  telefono: '+52 555 123 4567'
})

// Datos mock del cliente (cargados desde localStorage)
interface DashboardData {
  cotizaciones: {
    total: number
    pendientes: number
    aprobadas: number
    rechazadas: number
  }
  sesiones: {
    proximas: number
    completadas: number
    canceladas: number
  }
  reportes: {
    total: number
    nuevos: number
  }
  pagos: {
    pendientes: number
    realizados: number
    totalPagado: number
  }
  ultimaActividad: string
}

const dashboardData = ref<DashboardData>({
  cotizaciones: { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 },
  sesiones: { proximas: 0, completadas: 0, canceladas: 0 },
  reportes: { total: 0, nuevos: 0 },
  pagos: { pendientes: 0, realizados: 0, totalPagado: 0 },
  ultimaActividad: ''
})

// Próximas sesiones
interface Session {
  id: number
  title: string
  day: string
  month: string
  time: string
  teacher: string
  status: string
  statusClass: string
}

const upcomingSessions = ref<Session[]>([])

// Actividad reciente
interface Activity {
  id: number
  description: string
  timeAgo: string
  icon: string
  iconClass: string
}

const recentActivity = ref<Activity[]>([])

// Reportes recientes
interface Report {
  id: number
  title: string
  date: string
  type: string
  icon: string
  typeClass: string
  url?: string
}

const recentReports = ref<Report[]>([])

// Computed: Estadísticas rápidas (header)
const quickStats = computed(() => [
  {
    label: 'Cotizaciones',
    value: dashboardData.value.cotizaciones.total,
    icon: 'bi bi-file-text',
    iconClass: 'total'
  },
  {
    label: 'Próximas Sesiones',
    value: dashboardData.value.sesiones.proximas,
    icon: 'bi bi-calendar-check',
    iconClass: 'active'
  },
  {
    label: 'Reportes',
    value: dashboardData.value.reportes.total,
    icon: 'bi bi-bar-chart',
    iconClass: 'admin'
  }
])

// Tarjetas de estadísticas principales
const statsCards = computed(() => [
  {
    title: 'Cotizaciones Pendientes',
    value: dashboardData.value.cotizaciones.pendientes,
    icon: 'bi bi-hourglass-split',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    trend: '+12% vs mes anterior',
    trendClass: 'trend-up',
    trendIcon: 'bi bi-arrow-up'
  },
  {
    title: 'Sesiones Completadas',
    value: dashboardData.value.sesiones.completadas,
    icon: 'bi bi-check-circle',
    gradient: 'linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%)',
    trend: '+8% vs mes anterior',
    trendClass: 'trend-up',
    trendIcon: 'bi bi-arrow-up'
  },
  {
    title: 'Reportes Generados',
    value: dashboardData.value.reportes.total,
    icon: 'bi bi-file-earmark-bar-graph',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
    trend: '+5 nuevos',
    trendClass: 'trend-up',
    trendIcon: 'bi bi-arrow-up'
  },
  {
    title: 'Pagos Realizados',
    value: `$${dashboardData.value.pagos.totalPagado.toLocaleString()}`,
    icon: 'bi bi-credit-card',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)',
    trend: `${dashboardData.value.pagos.realizados} transacciones`,
    trendClass: 'trend-neutral',
    trendIcon: 'bi bi-dot'
  }
])

// Accesos rápidos
const quickAccess = ref([
  {
    name: 'Solicitar Cotización',
    description: 'Solicita una nueva cotización para tus análisis',
    icon: 'bi bi-plus-circle',
    gradient: 'linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%)',
    route: '/cliente/cotizaciones/nueva'
  },
  {
    name: 'Mis Cotizaciones',
    description: 'Consulta el estado de tus cotizaciones',
    icon: 'bi bi-file-earmark-text',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: '/cliente/cotizaciones'
  },
  {
    name: 'Mi Agenda',
    description: 'Gestiona tus sesiones programadas',
    icon: 'bi bi-calendar-week',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
    route: '/cliente/agenda'
  },
  {
    name: 'Mis Reportes',
    description: 'Accede a tus reportes y resultados',
    icon: 'bi bi-bar-chart-steps',
    gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
    route: '/cliente/reportes'
  },
  {
    name: 'Cursos y Capacitación',
    description: 'Accede a los cursos disponibles',
    icon: 'bi bi-mortarboard',
    gradient: 'linear-gradient(135deg, #607D8B 0%, #9E9E9E 100%)',
    route: '/cliente/cursos'
  }
])

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed toast
const toastClass = computed(() => {
  const classes: Record<ToastType, string> = {
    'success': 'bg-success text-white border-0',
    'info': 'bg-info text-white border-0',
    'warning': 'bg-warning text-dark border-0',
    'error': 'bg-danger text-white border-0'
  }
  return classes[toastType.value] || 'bg-info text-white border-0'
})

const toastIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle',
    'info': 'bi bi-info-circle',
    'warning': 'bi bi-exclamation-triangle',
    'error': 'bi bi-x-circle'
  }
  return icons[toastType.value] || 'bi bi-info-circle'
})

const toastBodyIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle-fill text-success',
    'info': 'bi bi-info-circle-fill text-info',
    'warning': 'bi bi-exclamation-triangle-fill text-warning',
    'error': 'bi bi-x-circle-fill text-danger'
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill text-info'
})

// Métodos
const showToast = (message: string, type: ToastType = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title || type.charAt(0).toUpperCase() + type.slice(1)
  toastType.value = type

  if (toastInstance) {
    toastInstance.hide()
  }

  if (toastEl.value) {
    import('bootstrap').then((bootstrap) => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 3000 })
      toastInstance.show()
    })
  }
}

const navigateTo = (route: string) => {
  router.push(route)
}

const downloadReport = (report: Report) => {
  showToast(`Descargando "${report.title}"...`, 'success', 'Descarga iniciada')
  // Simular descarga
  setTimeout(() => {
    showToast(`Reporte "${report.title}" descargado correctamente`, 'success', 'Descarga completada')
  }, 1000)
}

// Cargar datos mock desde localStorage
const loadMockData = () => {
  const storedData = localStorage.getItem('mock_cliente_data')

  if (storedData) {
    try {
      const parsed = JSON.parse(storedData)

      // Actualizar dashboard data
      if (parsed.dashboardData) {
        dashboardData.value = { ...dashboardData.value, ...parsed.dashboardData }
      }

      // Actualizar sesiones
      if (parsed.upcomingSessions) {
        upcomingSessions.value = parsed.upcomingSessions
      }

      // Actualizar actividad reciente
      if (parsed.recentActivity) {
        recentActivity.value = parsed.recentActivity
      }

      // Actualizar reportes
      if (parsed.recentReports) {
        recentReports.value = parsed.recentReports
      }

      // Actualizar datos del usuario
      if (parsed.userData) {
        userData.value = { ...userData.value, ...parsed.userData }
      }

      showToast('Datos cargados correctamente', 'success', 'Dashboard actualizado')
    } catch (e) {
      console.error('Error parsing mock data:', e)
      loadDefaultMockData()
    }
  } else {
    loadDefaultMockData()
  }
}

// Cargar datos mock por defecto
const loadDefaultMockData = () => {
  // Datos por defecto
  dashboardData.value = {
    cotizaciones: {
      total: 12,
      pendientes: 3,
      aprobadas: 8,
      rechazadas: 1
    },
    sesiones: {
      proximas: 4,
      completadas: 18,
      canceladas: 2
    },
    reportes: {
      total: 15,
      nuevos: 3
    },
    pagos: {
      pendientes: 2,
      realizados: 10,
      totalPagado: 4850
    },
    ultimaActividad: new Date().toISOString()
  }

  upcomingSessions.value = [
    {
      id: 1,
      title: 'Análisis de Muestras - Lote 2024-001',
      day: '15',
      month: 'ENE',
      time: '10:00 AM - 12:00 PM',
      teacher: 'Dr. Carlos Gómez',
      status: 'Confirmada',
      statusClass: 'confirmed'
    },
    {
      id: 2,
      title: 'Revisión de Resultados',
      day: '18',
      month: 'ENE',
      time: '2:00 PM - 3:30 PM',
      teacher: 'Dra. Ana Pérez',
      status: 'Pendiente',
      statusClass: 'pending'
    },
    {
      id: 3,
      title: 'Capacitación: Nuevos Protocolos',
      day: '22',
      month: 'ENE',
      time: '11:00 AM - 1:00 PM',
      teacher: 'Ing. Roberto Sánchez',
      status: 'Confirmada',
      statusClass: 'confirmed'
    }
  ]

  recentActivity.value = [
    {
      id: 1,
      description: 'Se generó un nuevo reporte de análisis para el lote 2024-015',
      timeAgo: 'Hace 2 horas',
      icon: 'bi bi-file-earmark-text',
      iconClass: 'report'
    },
    {
      id: 2,
      description: 'Cotización #COT-2024-0042 ha sido aprobada',
      timeAgo: 'Hace 5 horas',
      icon: 'bi bi-check-circle',
      iconClass: 'success'
    },
    {
      id: 3,
      description: 'Nueva sesión agendada para el 22 de enero',
      timeAgo: 'Ayer',
      icon: 'bi bi-calendar-plus',
      iconClass: 'calendar'
    },
    {
      id: 4,
      description: 'Pago realizado por $1,250.00 - Factura #FAC-2024-008',
      timeAgo: 'Ayer',
      icon: 'bi bi-credit-card',
      iconClass: 'payment'
    }
  ]

  recentReports.value = [
    {
      id: 1,
      title: 'Reporte de Análisis - Lote 2024-015',
      date: '15 de enero, 2024',
      type: 'PDF',
      icon: 'bi bi-file-pdf',
      typeClass: 'pdf',
      url: '#'
    },
    {
      id: 2,
      title: 'Resultados de Laboratorio - Dic 2024',
      date: '10 de enero, 2024',
      type: 'PDF',
      icon: 'bi bi-file-pdf',
      typeClass: 'pdf',
      url: '#'
    },
    {
      id: 3,
      title: 'Certificado de Análisis - Lote 2024-008',
      date: '5 de enero, 2024',
      type: 'PDF',
      icon: 'bi bi-file-pdf',
      typeClass: 'pdf',
      url: '#'
    },
    {
      id: 4,
      title: 'Resumen de Actividades Dic 2024',
      date: '2 de enero, 2024',
      type: 'EXCEL',
      icon: 'bi bi-file-excel',
      typeClass: 'excel',
      url: '#'
    }
  ]

  // Guardar datos por defecto en localStorage
  const defaultData = {
    dashboardData: dashboardData.value,
    upcomingSessions: upcomingSessions.value,
    recentActivity: recentActivity.value,
    recentReports: recentReports.value,
    userData: userData.value
  }

  localStorage.setItem('mock_cliente_data', JSON.stringify(defaultData))
}

// Guardar datos en localStorage (para pruebas)
const saveMockData = () => {
  const dataToSave = {
    dashboardData: dashboardData.value,
    upcomingSessions: upcomingSessions.value,
    recentActivity: recentActivity.value,
    recentReports: recentReports.value,
    userData: userData.value
  }
  localStorage.setItem('mock_cliente_data', JSON.stringify(dataToSave))
}

onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Cargar datos mock
  loadMockData()
})
</script>

<style scoped>
.cliente-dashboard {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .cliente-dashboard {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */
.dashboard-header {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem 0;
  box-shadow: 0 2px 15px var(--shadow-color, rgba(0, 0, 0, 0.08));
}

[data-bs-theme="dark"] .dashboard-header {
  background: var(--color-light, #121212);
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: var(--card-bg, white);
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-width: 140px;
  transition: transform 0.3s ease;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.stat-icon.active {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
}

.stat-icon.admin {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin-top: 0.25rem;
}

/* Stats Section */
.stats-section {
  padding: 2rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card-large {
  background: var(--card-bg, white);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .stat-card-large {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.stat-card-large:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.stat-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
}

.stat-card-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  display: block;
  line-height: 1.2;
}

[data-bs-theme="dark"] .stat-value {
  color: var(--color-dark, #F8F9FA);
}

.stat-title {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  display: block;
  margin: 0.25rem 0;
}

.stat-trend {
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] .stat-trend {
  background: rgba(255, 255, 255, 0.1);
}

.stat-trend.trend-up {
  color: #28a745;
}

.stat-trend.trend-down {
  color: #dc3545;
}

.stat-trend.trend-neutral {
  color: var(--color-gray, #6C757D);
}

/* Quick Access Section */
.quick-access-section {
  padding: 1rem 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .section-title {
  color: var(--color-dark, #F8F9FA);
}

.section-subtitle {
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.quick-access-card {
  background: var(--card-bg, white);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  position: relative;
  overflow: hidden;
}

[data-bs-theme="dark"] .quick-access-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.quick-access-card:hover {
  transform: translateX(8px);
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.quick-access-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.quick-access-info {
  flex: 1;
}

.quick-access-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .quick-access-info h4 {
  color: var(--color-dark, #F8F9FA);
}

.quick-access-info p {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin: 0;
}

.quick-access-arrow {
  color: var(--color-primary, #1E9E4A);
  font-size: 1.25rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.quick-access-card:hover .quick-access-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Activity Section */
.activity-section,
.reports-section {
  padding: 1rem 0;
}

.info-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
}

[data-bs-theme="dark"] .info-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.card-header-custom {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.03) 0%, rgba(76, 175, 80, 0.01) 100%);
}

[data-bs-theme="dark"] .card-header-custom {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.08) 0%, rgba(76, 175, 80, 0.04) 100%);
}

.card-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-dark, #212529);
  display: flex;
  align-items: center;
}

.view-all-link {
  font-size: 0.85rem;
  color: var(--color-primary, #1E9E4A);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap 0.3s ease;
}

.view-all-link:hover {
  gap: 0.5rem;
}

.card-body-custom {
  padding: 1.25rem 1.5rem;
}

/* Sessions List */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(129, 199, 132, 0.01) 100%));
  border-radius: 12px;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .session-item {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(129, 199, 132, 0.04) 100%);
}

.session-item:hover {
  transform: translateX(4px);
}

.session-date {
  text-align: center;
  min-width: 60px;
  padding: 0.5rem;
  background: var(--color-primary, #1E9E4A);
  border-radius: 10px;
  color: white;
}

.date-day {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.session-info {
  flex: 1;
}

.session-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .session-info h4 {
  color: var(--color-dark, #F8F9FA);
}

.session-info p {
  font-size: 0.75rem;
  margin: 0;
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.session-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
}

.session-status.confirmed {
  background: #d4edda;
  color: #155724;
}

[data-bs-theme="dark"] .session-status.confirmed {
  background: rgba(40, 167, 69, 0.2);
  color: #4cae4c;
}

.session-status.pending {
  background: #fff3cd;
  color: #856404;
}

[data-bs-theme="dark"] .session-status.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.activity-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

[data-bs-theme="dark"] .activity-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.activity-icon.report {
  background: #e3f2fd;
  color: #1976d2;
}

[data-bs-theme="dark"] .activity-icon.report {
  background: rgba(25, 118, 210, 0.2);
  color: #42a5f5;
}

.activity-icon.success {
  background: #d4edda;
  color: #155724;
}

[data-bs-theme="dark"] .activity-icon.success {
  background: rgba(40, 167, 69, 0.2);
  color: #4cae4c;
}

.activity-icon.calendar {
  background: #fff3cd;
  color: #856404;
}

[data-bs-theme="dark"] .activity-icon.calendar {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.activity-icon.payment {
  background: #e8eaf6;
  color: #3949ab;
}

[data-bs-theme="dark"] .activity-icon.payment {
  background: rgba(57, 73, 171, 0.2);
  color: #7986cb;
}

.activity-info {
  flex: 1;
}

.activity-description {
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .activity-description {
  color: var(--color-dark, #F8F9FA);
}

.activity-time {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

/* Reports Grid */
.reports-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.report-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.report-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

[data-bs-theme="dark"] .report-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.report-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.report-icon.pdf {
  background: #ffebee;
  color: #dc3545;
}

[data-bs-theme="dark"] .report-icon.pdf {
  background: rgba(220, 53, 69, 0.2);
  color: #ef5350;
}

.report-icon.excel {
  background: #e8f5e9;
  color: #2e7d32;
}

[data-bs-theme="dark"] .report-icon.excel {
  background: rgba(46, 125, 50, 0.2);
  color: #66bb6a;
}

.report-info {
  flex: 1;
}

.report-info h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .report-info h4 {
  color: var(--color-dark, #F8F9FA);
}

.report-info p {
  font-size: 0.7rem;
  margin: 0;
  color: var(--color-gray, #6C757D);
}

.btn-download {
  background: none;
  border: none;
  color: var(--color-primary, #1E9E4A);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-download:hover {
  background: rgba(30, 158, 74, 0.1);
  transform: scale(1.1);
}

/* Empty State */
.empty-state-small {
  text-align: center;
  padding: 2rem;
  color: var(--color-gray, #6C757D);
}

.empty-state-small i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.empty-state-small p {
  margin: 0;
  font-size: 0.85rem;
}

/* Toast */

/* Responsive */

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-access-grid {
    grid-template-columns: 1fr;
  }

  .stat-card-large {
    padding: 1rem;
  }

  .stat-card-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .session-item {
    flex-wrap: wrap;
  }

  .session-status {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .dashboard-header {
    padding: 1rem 0;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .card-header-custom,
  .card-body-custom {
    padding: 1rem;
  }

  .session-date {
    min-width: 50px;
  }

  .date-day {
    font-size: 1.25rem;
  }
}
</style>
