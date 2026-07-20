<template>
  <div :data-bs-theme="currentTheme" class="mis-cotizaciones-page">
    <!-- Header con breadcrumb -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Inicio
              </router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/cliente/dashboard" class="breadcrumb-link">
                <i class="bi bi-speedometer2"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-file-text"></i> Mis Cotizaciones
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-file-text-fill me-2"></i>Mis Cotizaciones
            </h1>
            <p class="page-subtitle">
              Gestione y dé seguimiento a sus solicitudes de cotización
            </p>
          </div>

          <div class="header-actions">
            <router-link to="/ClienteSolicitarCotizacion" class="btn btn-primary">
              <i class="bi bi-plus-lg me-1"></i> Nueva Cotización
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Panel de filtros -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-card">
          <div class="filters-header">
            <h3 class="filters-title">
              <i class="bi bi-funnel me-2"></i>Filtros
            </h3>
            <button v-if="hasActiveFilters" class="btn-clear-filters" @click="clearFilters">
              <i class="bi bi-x-circle"></i> Limpiar filtros
            </button>
          </div>

          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-search me-1"></i>Buscar
              </label>
              <div class="search-box">
                <i class="bi bi-search search-icon"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="search-input"
                  placeholder="Buscar por ID o servicio..."
                  @input="handleSearch"
                >
                <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-filter-circle me-1"></i>Estado
              </label>
              <div class="status-filters">
                <button
                  v-for="status in statusOptions"
                  :key="status.value"
                  class="status-filter-btn"
                  :class="{ active: selectedStatus === status.value }"
                  @click="toggleStatusFilter(status.value)"
                >
                  <i :class="status.icon"></i>
                  {{ status.label }}
                  <span class="status-count">{{ getStatusCount(status.value) }}</span>
                </button>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-calendar-range me-1"></i>Fecha
              </label>
              <div class="date-filters">
                <select v-model="dateFilter" class="form-select">
                  <option value="all">Todas las fechas</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                  <option value="custom">Personalizado</option>
                </select>
                <div v-if="dateFilter === 'custom'" class="custom-date-range">
                  <input type="date" v-model="dateFrom" class="form-control" placeholder="Desde">
                  <span>a</span>
                  <input type="date" v-model="dateTo" class="form-control" placeholder="Hasta">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lista de cotizaciones -->
    <main class="main-content">
      <div class="container">
        <div class="quotations-card">
          <div class="card-header-custom">
            <div class="card-info">
              <h4 class="card-title">
                <i class="bi bi-list-ul me-2"></i>Solicitudes de Cotización
              </h4>
              <p class="card-subtitle">
                Mostrando {{ filteredQuotations.length }} de {{ quotations.length }} solicitudes
              </p>
            </div>

            <div class="card-actions">
              <div class="view-options">
                <button
                  class="view-btn"
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                  title="Vista de lista"
                >
                  <i class="bi bi-list-ul"></i>
                </button>
                <button
                  class="view-btn"
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                  title="Vista de cuadrícula"
                >
                  <i class="bi bi-grid-3x3-gap"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Vista de lista -->
          <div v-if="viewMode === 'list'" class="quotations-list">
            <div v-if="filteredQuotations.length === 0" class="empty-state">
              <div class="empty-content">
                <i class="bi bi-inbox empty-icon"></i>
                <h5>No hay solicitudes de cotización</h5>
                <p class="text-muted">
                  No se encontraron solicitudes que coincidan con los filtros aplicados
                </p>
                <button class="btn btn-outline-primary" @click="clearFilters">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                </button>
                <router-link to="/cliente/solicitar-cotizacion" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-lg me-1"></i>Solicitar nueva cotización
                </router-link>
              </div>
            </div>

            <div v-else class="quotations-table-container">
              <table class="quotations-table">
                <thead>
                  <tr>
                    <th>ID Cotización</th>
                    <th>Servicio</th>
                    <th>Fecha Solicitud</th>
                    <th>Fecha Requerida</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Monto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cotizacion in paginatedQuotations" :key="cotizacion.id">
                    <td class="id-cell">
                      <span class="quotation-id">#{{ cotizacion.id_cotizacion || cotizacion.id }}</span>
                    </td>
                    <td class="service-cell">
                      <div class="service-info">
                        <i :class="getServiceIcon(cotizacion.tipo_servicio)"></i>
                        <span>{{ cotizacion.tipo_servicio_label || getServiceLabel(cotizacion.tipo_servicio) }}</span>
                      </div>
                      <div class="service-desc" v-if="cotizacion.descripcion">
                        {{ truncateText(cotizacion.descripcion, 50) }}
                      </div>
                    </td>
                    <td class="date-cell">
                      <div class="date-info">
                        <i class="bi bi-calendar3"></i>
                        <span>{{ formatDate(cotizacion.fecha_solicitud || cotizacion.createdAt) }}</span>
                      </div>
                    </td>
                    <td class="date-cell">
                      <div class="date-info" :class="{ urgent: isUrgent(cotizacion.fecha_requerida) }">
                        <i class="bi bi-calendar-event"></i>
                        <span>{{ formatDate(cotizacion.fecha_requerida) }}</span>
                      </div>
                    </td>
                    <td class="priority-cell">
                      <span class="priority-badge" :class="cotizacion.prioridad || 'normal'">
                        <i :class="getPriorityIcon(cotizacion.prioridad)"></i>
                        {{ getPriorityLabel(cotizacion.prioridad) }}
                      </span>
                    </td>
                    <td class="status-cell">
                      <span class="status-badge" :class="getStatusClass(cotizacion.estado)">
                        <i :class="getStatusIcon(cotizacion.estado)"></i>
                        {{ getStatusLabel(cotizacion.estado) }}
                      </span>
                    </td>
                    <td class="amount-cell">
                      <span class="amount" v-if="cotizacion.monto">
                        ${{ formatNumber(cotizacion.monto) }}
                      </span>
                      <span class="amount-pending" v-else>
                        Por definir
                      </span>
                    </td>
                    <td class="actions-cell">
                      <div class="action-buttons">
                        <router-link
                          :to="`/cliente/cotizaciones/${cotizacion.id}`"
                          class="btn-action view"
                          title="Ver detalles"
                        >
                          <i class="bi bi-eye"></i>
                        </router-link>
                        <button
                          v-if="cotizacion.estado === 'pendiente'"
                          class="btn-action edit"
                          @click="editQuotation(cotizacion)"
                          title="Editar"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          v-if="cotizacion.estado === 'pendiente'"
                          class="btn-action delete"
                          @click="confirmDelete(cotizacion)"
                          title="Cancelar solicitud"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                        <button
                          v-if="cotizacion.estado === 'cotizada'"
                          class="btn-action download"
                          @click="downloadQuotation(cotizacion)"
                          title="Descargar cotización PDF"
                        >
                          <i class="bi bi-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div v-if="filteredQuotations.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ startItem }} - {{ endItem }} de {{ filteredQuotations.length }} solicitudes
              </div>
              <div class="pagination-controls">
                <button
                  class="page-btn"
                  :disabled="currentPage === 1"
                  @click="currentPage = 1"
                >
                  <i class="bi bi-chevron-double-left"></i>
                </button>
                <button
                  class="page-btn"
                  :disabled="currentPage === 1"
                  @click="prevPage"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>

                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-btn"
                  :class="{ active: page === currentPage }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>

                <button
                  class="page-btn"
                  :disabled="currentPage === totalPages"
                  @click="nextPage"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
                <button
                  class="page-btn"
                  :disabled="currentPage === totalPages"
                  @click="currentPage = totalPages"
                >
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Vista de cuadrícula -->
          <div v-else class="quotations-grid">
            <div v-if="filteredQuotations.length === 0" class="empty-state">
              <div class="empty-content">
                <i class="bi bi-inbox empty-icon"></i>
                <h5>No hay solicitudes de cotización</h5>
                <p class="text-muted">
                  No se encontraron solicitudes que coincidan con los filtros aplicados
                </p>
                <button class="btn btn-outline-primary" @click="clearFilters">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                </button>
                <router-link to="/cliente/solicitar-cotizacion" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-lg me-1"></i>Solicitar nueva cotización
                </router-link>
              </div>
            </div>

            <div v-else class="grid-container">
              <div v-for="cotizacion in paginatedQuotations" :key="cotizacion.id" class="quotation-card">
                <div class="quotation-card-header">
                  <div class="quotation-id">#{{ cotizacion.id_cotizacion || cotizacion.id }}</div>
                  <span class="status-badge" :class="getStatusClass(cotizacion.estado)">
                    {{ getStatusLabel(cotizacion.estado) }}
                  </span>
                </div>

                <div class="quotation-card-body">
                  <div class="service-type">
                    <i :class="getServiceIcon(cotizacion.tipo_servicio)"></i>
                    <span>{{ cotizacion.tipo_servicio_label || getServiceLabel(cotizacion.tipo_servicio) }}</span>
                  </div>

                  <div class="quotation-dates">
                    <div class="date-row">
                      <i class="bi bi-calendar3"></i>
                      <span>Solicitud: {{ formatDate(cotizacion.fecha_solicitud || cotizacion.createdAt) }}</span>
                    </div>
                    <div class="date-row" :class="{ urgent: isUrgent(cotizacion.fecha_requerida) }">
                      <i class="bi bi-calendar-event"></i>
                      <span>Requerida: {{ formatDate(cotizacion.fecha_requerida) }}</span>
                    </div>
                  </div>

                  <div class="priority-row">
                    <span class="priority-badge" :class="cotizacion.prioridad || 'normal'">
                      <i :class="getPriorityIcon(cotizacion.prioridad)"></i>
                      {{ getPriorityLabel(cotizacion.prioridad) }}
                    </span>
                  </div>

                  <div class="quotation-desc" v-if="cotizacion.descripcion">
                    {{ truncateText(cotizacion.descripcion, 80) }}
                  </div>
                </div>

                <div class="quotation-card-footer">
                  <div class="amount">
                    <span class="amount-label">Monto:</span>
                    <span class="amount-value" v-if="cotizacion.monto">
                      ${{ formatNumber(cotizacion.monto) }}
                    </span>
                    <span class="amount-pending" v-else>
                      Por definir
                    </span>
                  </div>
                  <div class="card-actions">
                    <router-link
                      :to="`/cliente/cotizaciones/${cotizacion.id}`"
                      class="btn-icon"
                      title="Ver detalles"
                    >
                      <i class="bi bi-eye"></i>
                    </router-link>
                    <button
                      v-if="cotizacion.estado === 'pendiente'"
                      class="btn-icon"
                      @click="editQuotation(cotizacion)"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      v-if="cotizacion.estado === 'cotizada'"
                      class="btn-icon"
                      @click="downloadQuotation(cotizacion)"
                      title="Descargar"
                    >
                      <i class="bi bi-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paginación para grid -->
            <div v-if="filteredQuotations.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ startItem }} - {{ endItem }} de {{ filteredQuotations.length }} solicitudes
              </div>
              <div class="pagination-controls">
                <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1">
                  <i class="bi bi-chevron-double-left"></i>
                </button>
                <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-btn"
                  :class="{ active: page === currentPage }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
                <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
                  <i class="bi bi-chevron-right"></i>
                </button>
                <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de cancelación -->
    <div v-if="showDeleteModal" class="modal-backdrop show" @click="closeDeleteModal"></div>
    <div v-if="showDeleteModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-warning me-2"></i>
              Cancelar solicitud
            </h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              Esta acción no se puede deshacer
            </div>
            <p>
              ¿Estás seguro de que deseas cancelar la solicitud de cotización
              <strong>#{{ quotationToDelete?.id_cotizacion || quotationToDelete?.id }}</strong>?
            </p>
            <p class="text-muted small">
              La solicitud será eliminada permanentemente y no podrá ser recuperada.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">
              <i class="bi bi-x-lg me-1"></i>No, mantener
            </button>
            <button type="button" class="btn btn-danger" @click="deleteQuotation">
              <i class="bi bi-trash me-1"></i>Sí, cancelar solicitud
            </button>
          </div>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado de la vista
const viewMode = ref<'list' | 'grid'>('list')
const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)
const dateFilter = ref('all')
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal de eliminación
const showDeleteModal = ref(false)
const quotationToDelete = ref<any>(null)

// Datos
const quotations = ref<any[]>([])

// Opciones de estado
const statusOptions = [
  { value: 'pendiente', label: 'Pendiente', icon: 'bi bi-clock' },
  { value: 'en_revision', label: 'En Revisión', icon: 'bi bi-arrow-repeat' },
  { value: 'cotizada', label: 'Cotizada', icon: 'bi bi-file-text' },
  { value: 'aprobada', label: 'Aprobada', icon: 'bi bi-check-circle' },
  { value: 'rechazada', label: 'Rechazada', icon: 'bi bi-x-circle' }
]

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedStatus.value || dateFilter.value !== 'all' ||
    (dateFilter.value === 'custom' && (dateFrom.value || dateTo.value)))
})

const filteredQuotations = computed(() => {
  let result = [...quotations.value]

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(q =>
      (q.id_cotizacion && q.id_cotizacion.toLowerCase().includes(query)) ||
      (q.id && q.id.toString().includes(query)) ||
      (q.tipo_servicio_label && q.tipo_servicio_label.toLowerCase().includes(query)) ||
      (q.descripcion && q.descripcion.toLowerCase().includes(query))
    )
  }

  // Filtro por estado
  if (selectedStatus.value) {
    result = result.filter(q => q.estado === selectedStatus.value)
  }

  // Filtro por fecha
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  result = result.filter(q => {
    const date = new Date(q.fecha_solicitud || q.createdAt)
    date.setHours(0, 0, 0, 0)

    switch (dateFilter.value) {
      case 'today':
        return date.getTime() === today.getTime()
      case 'week':
        return date >= startOfWeek
      case 'month':
        return date >= startOfMonth
      case 'custom':
        if (dateFrom.value && date < new Date(dateFrom.value)) return false
        if (dateTo.value && date > new Date(dateTo.value)) return false
        return true
      default:
        return true
    }
  })

  // Ordenar por fecha descendente
  result.sort((a, b) => {
    const dateA = new Date(a.fecha_solicitud || a.createdAt)
    const dateB = new Date(b.fecha_solicitud || b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredQuotations.value.length / itemsPerPage.value))
const paginatedQuotations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredQuotations.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredQuotations.value.length))

// Métodos de ayuda
const getServiceLabel = (value: string) => {
  const services: Record<string, string> = {
    analisis_quimico: 'Análisis Químico',
    analisis_microbiologico: 'Análisis Microbiológico',
    analisis_fisico: 'Análisis Físico',
    calibracion: 'Calibración',
    consultoria: 'Consultoría',
    otros: 'Otros Servicios'
  }
  return services[value] || value
}

const getServiceIcon = (value: string) => {
  const icons: Record<string, string> = {
    analisis_quimico: 'bi bi-flask',
    analisis_microbiologico: 'bi bi-virus',
    analisis_fisico: 'bi bi-rulers',
    calibracion: 'bi bi-speedometer',
    consultoria: 'bi bi-chat-dots',
    otros: 'bi bi-grid'
  }
  return icons[value] || 'bi bi-file-text'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    cotizada: 'Cotizada',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pendiente: 'status-pending',
    en_revision: 'status-review',
    cotizada: 'status-quoted',
    aprobada: 'status-approved',
    rechazada: 'status-rejected'
  }
  return classes[status] || 'status-pending'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pendiente: 'bi bi-clock',
    en_revision: 'bi bi-arrow-repeat',
    cotizada: 'bi bi-file-text',
    aprobada: 'bi bi-check-circle',
    rechazada: 'bi bi-x-circle'
  }
  return icons[status] || 'bi bi-clock'
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    normal: 'Normal',
    urgente: 'Urgente',
    express: 'Express'
  }
  return labels[priority] || 'Normal'
}

const getPriorityIcon = (priority: string) => {
  const icons: Record<string, string> = {
    normal: 'bi bi-flag',
    urgente: 'bi bi-exclamation-triangle',
    express: 'bi bi-lightning-charge'
  }
  return icons[priority] || 'bi bi-flag'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatNumber = (value: number) => {
  return value.toLocaleString('es-MX')
}

const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const isUrgent = (dateString: string) => {
  if (!dateString) return false
  const requiredDate = new Date(dateString)
  const today = new Date()
  const diffDays = Math.ceil((requiredDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays >= 0
}

const getStatusCount = (status: string) => {
  return quotations.value.filter(q => q.estado === status).length
}

// Filtros
const handleSearch = () => {
  currentPage.value = 1
}

const toggleStatusFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = null
  dateFilter.value = 'all'
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}

// Paginación
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Acciones
const editQuotation = (quotation: any) => {
  // Redirigir a edición (podría implementarse)
  showToast('Funcionalidad de edición próximamente', 'info', 'En desarrollo')
}

const downloadQuotation = (quotation: any) => {
  showToast(`Descargando cotización #${quotation.id_cotizacion || quotation.id}...`, 'success', 'Descargando')
  // Simular descarga
  setTimeout(() => {
    showToast('Cotización descargada correctamente', 'success', 'Descarga completada')
  }, 1500)
}

const confirmDelete = (quotation: any) => {
  quotationToDelete.value = quotation
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  quotationToDelete.value = null
}

const deleteQuotation = () => {
  if (quotationToDelete.value) {
    const index = quotations.value.findIndex(q => q.id === quotationToDelete.value.id)
    if (index !== -1) {
      quotations.value.splice(index, 1)

      // Actualizar localStorage
      const storedData = localStorage.getItem('mock_cliente_data')
      if (storedData) {
        const mockData = JSON.parse(storedData)
        if (mockData.cotizaciones) {
          mockData.cotizaciones = quotations.value
          localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
        }
      }

      showToast(`Solicitud #${quotationToDelete.value.id_cotizacion || quotationToDelete.value.id} cancelada`, 'success', 'Cancelada')
    }
  }
  closeDeleteModal()
}

// Cargar cotizaciones
const loadQuotations = () => {
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    try {
      const mockData = JSON.parse(storedData)
      if (mockData.cotizaciones && mockData.cotizaciones.length > 0) {
        quotations.value = mockData.cotizaciones
      } else {
        loadMockQuotations()
      }
    } catch (e) {
      console.error('Error loading quotations:', e)
      loadMockQuotations()
    }
  } else {
    loadMockQuotations()
  }
}

// Cargar cotizaciones mock
const loadMockQuotations = () => {
  quotations.value = [
    {
      id: 1,
      id_cotizacion: 'COT-2024-0001',
      tipo_servicio: 'analisis_quimico',
      tipo_servicio_label: 'Análisis Químico',
      descripcion: 'Análisis de composición química para muestra de agua residual. Se requiere determinar pH, metales pesados y compuestos orgánicos.',
      cantidad: 5,
      unidad: 'muestras',
      fecha_requerida: '2024-02-15',
      prioridad: 'normal',
      estado: 'cotizada',
      monto: 12500,
      fecha_solicitud: '2024-01-10T10:30:00',
      createdAt: '2024-01-10T10:30:00'
    },
    {
      id: 2,
      id_cotizacion: 'COT-2024-0002',
      tipo_servicio: 'analisis_microbiologico',
      tipo_servicio_label: 'Análisis Microbiológico',
      descripcion: 'Detección de bacterias patógenas en muestras de alimentos.',
      cantidad: 10,
      unidad: 'muestras',
      fecha_requerida: '2024-02-20',
      prioridad: 'urgente',
      estado: 'en_revision',
      monto: null,
      fecha_solicitud: '2024-01-15T14:20:00',
      createdAt: '2024-01-15T14:20:00'
    },
    {
      id: 3,
      id_cotizacion: 'COT-2024-0003',
      tipo_servicio: 'calibracion',
      tipo_servicio_label: 'Calibración',
      descripcion: 'Calibración de equipos de laboratorio: balanzas analíticas y pHmetros.',
      cantidad: 3,
      unidad: 'equipos',
      fecha_requerida: '2024-01-30',
      prioridad: 'express',
      estado: 'aprobada',
      monto: 8500,
      fecha_solicitud: '2024-01-05T09:15:00',
      createdAt: '2024-01-05T09:15:00'
    },
    {
      id: 4,
      id_cotizacion: 'COT-2024-0004',
      tipo_servicio: 'consultoria',
      tipo_servicio_label: 'Consultoría',
      descripcion: 'Asesoría para implementación de sistema de calidad ISO 17025.',
      cantidad: 1,
      unidad: 'servicio',
      fecha_requerida: '2024-03-10',
      prioridad: 'normal',
      estado: 'pendiente',
      monto: null,
      fecha_solicitud: '2024-01-18T11:45:00',
      createdAt: '2024-01-18T11:45:00'
    },
    {
      id: 5,
      id_cotizacion: 'COT-2024-0005',
      tipo_servicio: 'analisis_fisico',
      tipo_servicio_label: 'Análisis Físico',
      descripcion: 'Pruebas de resistencia y dureza para materiales de construcción.',
      cantidad: 8,
      unidad: 'muestras',
      fecha_requerida: '2024-02-05',
      prioridad: 'urgente',
      estado: 'rechazada',
      monto: null,
      fecha_solicitud: '2024-01-08T16:00:00',
      createdAt: '2024-01-08T16:00:00'
    }
  ]

  // Guardar en localStorage
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    const mockData = JSON.parse(storedData)
    mockData.cotizaciones = quotations.value
    localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
  }
}

// Toast
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

// Watch para fecha personalizada
watch(dateFilter, (newVal) => {
  if (newVal !== 'custom') {
    dateFrom.value = ''
    dateTo.value = ''
  }
  currentPage.value = 1
})

watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1
})

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadQuotations()
})
</script>

<style scoped>
.mis-cotizaciones-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .mis-cotizaciones-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */

.btn-primary {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
}

/* Filters Section */
.filters-section {
  padding: 1.5rem 0;
}

.filters-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem;
}

[data-bs-theme="dark"] .filters-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.filters-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .filters-title {
  color: var(--color-dark, #F8F9FA);
}

.btn-clear-filters {
  background: none;
  border: none;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray, #6C757D);
}

.search-input {
  width: 100%;
  padding: 0.625rem 2rem 0.625rem 2.25rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-gray, #6C757D);
  cursor: pointer;
}

.status-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .status-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.status-filter-btn.active {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border-color: transparent;
  color: white;
}

.status-count {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 0.125rem 0.375rem;
  font-size: 0.7rem;
}

.date-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-select {
  padding: 0.625rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .form-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.custom-date-range .form-control {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
}

/* Main Content */
.main-content {
  padding: 0 0 3rem;
}

.quotations-card {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  overflow: hidden;
}

[data-bs-theme="dark"] .quotations-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.card-header-custom {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

[data-bs-theme="dark"] .card-header-custom {
  border-bottom-color: var(--color-gray-light, #2d2d2d);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

.card-subtitle {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin: 0;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .view-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.view-btn.active {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

/* Table Styles */
.quotations-table-container {
  overflow-x: auto;
}

.quotations-table {
  width: 100%;
  border-collapse: collapse;
}

.quotations-table th {
  text-align: left;
  padding: 1rem 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-gray-dark, #495057);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .quotations-table th {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
  color: var(--color-gray-dark, #ADB5BD);
}

.quotations-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  vertical-align: middle;
}

[data-bs-theme="dark"] .quotations-table td {
  border-bottom-color: var(--color-gray-light, #2d2d2d);
}

.quotations-table tr:hover {
  background: rgba(30, 158, 74, 0.03);
}

.id-cell .quotation-id {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-info i {
  font-size: 1.1rem;
  color: var(--color-primary, #1E9E4A);
}

.service-desc {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
  margin-top: 0.25rem;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .date-info {
  color: var(--color-dark, #F8F9FA);
}

.date-info.urgent {
  color: #dc3545;
  font-weight: 500;
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-badge.normal {
  background: #d4edda;
  color: #155724;
}

.priority-badge.urgente {
  background: #fff3cd;
  color: #856404;
}

.priority-badge.express {
  background: #f8d7da;
  color: #721c24;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-review {
  background: #cfe2ff;
  color: #084298;
}

.status-quoted {
  background: #cff4fc;
  color: #055160;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.amount {
  font-weight: 600;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .amount {
  color: var(--color-dark, #F8F9FA);
}

.amount-pending {
  color: var(--color-gray, #6C757D);
  font-size: 0.8rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

[data-bs-theme="dark"] .btn-action {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.btn-action.view:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.btn-action.edit:hover {
  border-color: #ffc107;
  color: #ffc107;
}

.btn-action.delete:hover {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-action.download:hover {
  border-color: #17a2b8;
  color: #17a2b8;
}

/* Grid View */
.quotations-grid {
  padding: 1.5rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.quotation-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .quotation-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.quotation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.quotation-card-header {
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .quotation-card-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.quotation-id {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
}

.quotation-card-body {
  padding: 1rem;
}

.service-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.service-type i {
  font-size: 1.25rem;
  color: var(--color-primary, #1E9E4A);
}

.quotation-dates {
  margin-bottom: 0.75rem;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.25rem;
}

.date-row.urgent {
  color: #dc3545;
}

.priority-row {
  margin-bottom: 0.75rem;
}

.quotation-desc {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  line-height: 1.4;
}

.quotation-card-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-label {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

.amount-value {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-icon:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

/* Pagination */
.pagination-container {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.page-btn.active {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border-color: transparent;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
}

/* Modal */

.modal-content {
  border-radius: 16px;
}

/* Responsive */
@media (max-width: 992px) {
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .status-filters {
    flex-wrap: wrap;
  }

  .quotations-table th,
  .quotations-table td {
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {

  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }

  .quotations-table th:nth-child(4),
  .quotations-table td:nth-child(4),
  .quotations-table th:nth-child(5),
  .quotations-table td:nth-child(5) {
    display: none;
  }
}

@media (max-width: 576px) {

  .quotations-table th:nth-child(3),
  .quotations-table td:nth-child(3) {
    display: none;
  }

  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>
