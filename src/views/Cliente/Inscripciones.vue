<template>
  <div :data-bs-theme="currentTheme" class="inscripciones-page">
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
              <i class="bi bi-mortarboard"></i> Mis Inscripciones
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-mortarboard-fill me-2"></i>Mis Inscripciones
            </h1>
            <p class="page-subtitle">
              Gestione sus cursos y capacitaciones. Consulte su progreso y certificados.
            </p>
          </div>

          <div class="header-actions">
            <button class="btn btn-outline-primary" @click="exportInscripciones">
              <i class="bi bi-download me-1"></i> Exportar
            </button>
            <router-link to="/cliente/cursos" class="btn btn-primary">
              <i class="bi bi-plus-lg me-1"></i> Explorar Cursos
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Resumen de inscripciones -->
    <section class="resumen-section">
      <div class="container">
        <div class="resumen-grid">
          <div class="resumen-card">
            <div class="resumen-icon total">
              <i class="bi bi-book"></i>
            </div>
            <div class="resumen-info">
              <span class="resumen-label">Total Inscripciones</span>
              <span class="resumen-value">{{ totalInscripciones }}</span>
            </div>
          </div>
          <div class="resumen-card">
            <div class="resumen-icon activos">
              <i class="bi bi-play-circle"></i>
            </div>
            <div class="resumen-info">
              <span class="resumen-label">En Progreso</span>
              <span class="resumen-value">{{ inscripcionesActivas }}</span>
            </div>
          </div>
          <div class="resumen-card">
            <div class="resumen-icon completados">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="resumen-info">
              <span class="resumen-label">Completados</span>
              <span class="resumen-value">{{ inscripcionesCompletadas }}</span>
            </div>
          </div>
          <div class="resumen-card">
            <div class="resumen-icon promedio">
              <i class="bi bi-star"></i>
            </div>
            <div class="resumen-info">
              <span class="resumen-label">Promedio Progreso</span>
              <span class="resumen-value">{{ promedioProgreso }}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

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
                  placeholder="Buscar por nombre del curso..."
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
                <i class="bi bi-calendar-range me-1"></i>Fecha de inscripción
              </label>
              <div class="date-range">
                <input type="date" v-model="dateFrom" class="form-control" placeholder="Desde">
                <span>a</span>
                <input type="date" v-model="dateTo" class="form-control" placeholder="Hasta">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lista de inscripciones -->
    <main class="main-content">
      <div class="container">
        <div class="inscripciones-card">
          <div class="card-header-custom">
            <div class="card-info">
              <h4 class="card-title">
                <i class="bi bi-list-ul me-2"></i>Mis Cursos
              </h4>
              <p class="card-subtitle">
                Mostrando {{ filteredInscripciones.length }} de {{ inscripciones.length }} cursos
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
                  title="Vista de tarjetas"
                >
                  <i class="bi bi-grid-3x3-gap"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Vista de lista -->
          <div v-if="viewMode === 'list'" class="inscripciones-list">
            <div v-if="filteredInscripciones.length === 0" class="empty-state">
              <div class="empty-content">
                <i class="bi bi-journal-bookmark-fill empty-icon"></i>
                <h5>No hay inscripciones</h5>
                <p class="text-muted">
                  Aún no te has inscrito a ningún curso.
                  Explora nuestros cursos y comienza a aprender.
                </p>
                <router-link to="/cliente/cursos" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-lg me-1"></i>Explorar Cursos
                </router-link>
              </div>
            </div>

            <div v-else class="inscripciones-table-container">
              <table class="inscripciones-table">
                <thead>
                  <tr>
                    <th>Curso</th>
                    <th>Fecha Inscripción</th>
                    <th>Progreso</th>
                    <th>Estado</th>
                    <th>Certificado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="inscripcion in paginatedInscripciones" :key="inscripcion.id">
                    <td class="curso-cell">
                      <div class="curso-info">
                        <div class="curso-icon" :style="{ background: inscripcion.color || '#1E9E4A' }">
                          <i :class="inscripcion.icon || 'bi bi-book'"></i>
                        </div>
                        <div class="curso-detalle">
                          <strong>{{ inscripcion.curso_nombre }}</strong>
                          <div class="curso-meta">
                            <span class="meta-item">
                              <i class="bi bi-clock"></i> {{ inscripcion.duracion || 'N/A' }}
                            </span>
                            <span class="meta-item">
                              <i class="bi bi-person"></i> {{ inscripcion.instructor || 'Instructor' }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="fecha-cell">
                      <div class="fecha-info">
                        <i class="bi bi-calendar3"></i>
                        <span>{{ formatDate(inscripcion.fecha_inscripcion) }}</span>
                      </div>
                      <div class="fecha-info" v-if="inscripcion.fecha_completado">
                        <i class="bi bi-check-circle"></i>
                        <span>Completado: {{ formatDate(inscripcion.fecha_completado) }}</span>
                      </div>
                    </td>
                    <td class="progreso-cell">
                      <div class="progreso-info">
                        <div class="progress-bar-container">
                          <div class="progress-bar" :style="{ width: `${inscripcion.progreso || 0}%` }"></div>
                        </div>
                        <span class="progreso-porcentaje">{{ inscripcion.progreso || 0 }}%</span>
                      </div>
                    </td>
                    <td class="estado-cell">
                      <span class="estado-badge" :class="getEstadoClass(inscripcion.estado)">
                        <i :class="getEstadoIcon(inscripcion.estado)"></i>
                        {{ getEstadoLabel(inscripcion.estado) }}
                      </span>
                    </td>
                    <td class="certificado-cell">
                      <button
                        v-if="inscripcion.estado === 'completado' && inscripcion.certificado_disponible"
                        class="btn-certificado"
                        @click="descargarCertificado(inscripcion)"
                        title="Descargar certificado"
                      >
                        <i class="bi bi-file-pdf"></i> Certificado
                      </button>
                      <span v-else class="certificado-no-disponible">
                        <i class="bi bi-lock"></i> No disponible
                      </span>
                    </td>
                    <td class="actions-cell">
                      <div class="action-buttons">
                        <button
                          class="btn-action view"
                          @click="viewDetalleCurso(inscripcion)"
                          title="Ver detalles"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        <button
                          v-if="inscripcion.estado === 'activo'"
                          class="btn-action continue"
                          @click="continuarCurso(inscripcion)"
                          title="Continuar curso"
                        >
                          <i class="bi bi-play-fill"></i>
                        </button>
                        <button
                          v-if="inscripcion.estado === 'pendiente'"
                          class="btn-action cancel"
                          @click="cancelarInscripcion(inscripcion)"
                          title="Cancelar inscripción"
                        >
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div v-if="filteredInscripciones.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ startItem }} - {{ endItem }} de {{ filteredInscripciones.length }} cursos
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

          <!-- Vista de cuadrícula -->
          <div v-else class="inscripciones-grid">
            <div v-if="filteredInscripciones.length === 0" class="empty-state">
              <div class="empty-content">
                <i class="bi bi-journal-bookmark-fill empty-icon"></i>
                <h5>No hay inscripciones</h5>
                <p class="text-muted">
                  Aún no te has inscrito a ningún curso.
                  Explora nuestros cursos y comienza a aprender.
                </p>
                <router-link to="/cliente/cursos" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-lg me-1"></i>Explorar Cursos
                </router-link>
              </div>
            </div>

            <div v-else class="grid-container">
              <div v-for="inscripcion in paginatedInscripciones" :key="inscripcion.id" class="curso-card">
                <div class="curso-card-header" :style="{ background: inscripcion.color || 'linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%)' }">
                  <div class="curso-icon-large">
                    <i :class="inscripcion.icon || 'bi bi-book'"></i>
                  </div>
                  <span class="estado-badge" :class="getEstadoClass(inscripcion.estado)">
                    {{ getEstadoLabel(inscripcion.estado) }}
                  </span>
                </div>

                <div class="curso-card-body">
                  <h3 class="curso-nombre">{{ inscripcion.curso_nombre }}</h3>
                  <div class="curso-meta-grid">
                    <div class="meta-item">
                      <i class="bi bi-clock"></i>
                      <span>{{ inscripcion.duracion || 'N/A' }}</span>
                    </div>
                    <div class="meta-item">
                      <i class="bi bi-person"></i>
                      <span>{{ inscripcion.instructor || 'Instructor' }}</span>
                    </div>
                    <div class="meta-item">
                      <i class="bi bi-calendar3"></i>
                      <span>{{ formatDate(inscripcion.fecha_inscripcion) }}</span>
                    </div>
                  </div>

                  <div class="progreso-section">
                    <div class="progreso-header">
                      <span class="progreso-label">Progreso</span>
                      <span class="progreso-porcentaje">{{ inscripcion.progreso || 0 }}%</span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-bar" :style="{ width: `${inscripcion.progreso || 0}%` }"></div>
                    </div>
                  </div>

                  <div class="curso-descripcion" v-if="inscripcion.descripcion">
                    {{ truncateText(inscripcion.descripcion, 80) }}
                  </div>
                </div>

                <div class="curso-card-footer">
                  <button
                    v-if="inscripcion.estado === 'activo'"
                    class="btn-continuar"
                    @click="continuarCurso(inscripcion)"
                  >
                    <i class="bi bi-play-fill"></i> Continuar curso
                  </button>
                  <button
                    v-if="inscripcion.estado === 'completado' && inscripcion.certificado_disponible"
                    class="btn-certificado-card"
                    @click="descargarCertificado(inscripcion)"
                  >
                    <i class="bi bi-file-pdf"></i> Certificado
                  </button>
                  <button
                    v-if="inscripcion.estado === 'pendiente'"
                    class="btn-cancelar"
                    @click="cancelarInscripcion(inscripcion)"
                  >
                    <i class="bi bi-x-lg"></i> Cancelar
                  </button>
                  <button
                    class="btn-detalle"
                    @click="viewDetalleCurso(inscripcion)"
                  >
                    <i class="bi bi-eye"></i> Detalles
                  </button>
                </div>
              </div>
            </div>

            <!-- Paginación para grid -->
            <div v-if="filteredInscripciones.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ startItem }} - {{ endItem }} de {{ filteredInscripciones.length }} cursos
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

    <!-- Modal de detalles del curso -->
    <div v-if="showDetailsModal" class="modal-backdrop show" @click="closeDetailsModal"></div>
    <div v-if="showDetailsModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>Detalles del Curso
            </h5>
            <button type="button" class="btn-close" @click="closeDetailsModal"></button>
          </div>
          <div class="modal-body" v-if="selectedCurso">
            <div class="detalle-header">
              <div class="curso-icon-large" :style="{ background: selectedCurso.color || '#1E9E4A' }">
                <i :class="selectedCurso.icon || 'bi bi-book'"></i>
              </div>
              <div class="curso-titulo">
                <h3>{{ selectedCurso.curso_nombre }}</h3>
                <span class="estado-badge" :class="getEstadoClass(selectedCurso.estado)">
                  {{ getEstadoLabel(selectedCurso.estado) }}
                </span>
              </div>
            </div>

            <div class="detalle-grid">
              <div class="detalle-section">
                <h4><i class="bi bi-info-circle"></i> Información General</h4>
                <div class="detalle-row">
                  <span class="detalle-label">Instructor:</span>
                  <span class="detalle-value">{{ selectedCurso.instructor || 'No especificado' }}</span>
                </div>
                <div class="detalle-row">
                  <span class="detalle-label">Duración:</span>
                  <span class="detalle-value">{{ selectedCurso.duracion || 'N/A' }}</span>
                </div>
                <div class="detalle-row">
                  <span class="detalle-label">Fecha inscripción:</span>
                  <span class="detalle-value">{{ formatFullDate(selectedCurso.fecha_inscripcion) }}</span>
                </div>
                <div class="detalle-row" v-if="selectedCurso.fecha_completado">
                  <span class="detalle-label">Fecha completado:</span>
                  <span class="detalle-value">{{ formatFullDate(selectedCurso.fecha_completado) }}</span>
                </div>
              </div>

              <div class="detalle-section">
                <h4><i class="bi bi-graph-up"></i> Progreso</h4>
                <div class="progreso-detalle">
                  <div class="progress-bar-container large">
                    <div class="progress-bar" :style="{ width: `${selectedCurso.progreso || 0}%` }"></div>
                  </div>
                  <span class="progreso-porcentaje large">{{ selectedCurso.progreso || 0 }}% completado</span>
                </div>
                <div class="detalle-row" v-if="selectedCurso.modulos_completados">
                  <span class="detalle-label">Módulos completados:</span>
                  <span class="detalle-value">{{ selectedCurso.modulos_completados }} / {{ selectedCurso.total_modulos }}</span>
                </div>
              </div>

              <div class="detalle-section full-width" v-if="selectedCurso.descripcion">
                <h4><i class="bi bi-file-text"></i> Descripción</h4>
                <p>{{ selectedCurso.descripcion }}</p>
              </div>

              <div class="detalle-section full-width" v-if="selectedCurso.temario?.length">
                <h4><i class="bi bi-list-check"></i> Temario</h4>
                <ul class="temario-list">
                  <li v-for="(tema, idx) in selectedCurso.temario" :key="idx">
                    <i class="bi bi-check-circle-fill" v-if="tema.completado"></i>
                    <i class="bi bi-circle" v-else></i>
                    {{ tema.nombre }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDetailsModal">Cerrar</button>
            <button
              v-if="selectedCurso?.estado === 'activo'"
              class="btn btn-primary"
              @click="continuarCurso(selectedCurso)"
            >
              <i class="bi bi-play-fill me-1"></i> Continuar curso
            </button>
            <button
              v-if="selectedCurso?.estado === 'completado' && selectedCurso?.certificado_disponible"
              class="btn btn-success"
              @click="descargarCertificado(selectedCurso)"
            >
              <i class="bi bi-file-pdf me-1"></i> Descargar certificado
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de cancelación -->
    <div v-if="showCancelModal" class="modal-backdrop show" @click="closeCancelModal"></div>
    <div v-if="showCancelModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-warning me-2"></i>
              Cancelar Inscripción
            </h5>
            <button type="button" class="btn-close" @click="closeCancelModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              ¿Estás seguro de que deseas cancelar esta inscripción?
            </div>
            <p><strong>Curso:</strong> {{ inscripcionToCancel?.curso_nombre }}</p>
            <p><strong>Fecha inscripción:</strong> {{ formatDate(inscripcionToCancel?.fecha_inscripcion) }}</p>
            <p class="text-muted small">
              Al cancelar, perderás el progreso guardado y deberás volver a inscribirte para acceder al curso.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button class="btn btn-secondary" @click="closeCancelModal">
              <i class="bi bi-x-lg me-1"></i>No, mantener
            </button>
            <button class="btn btn-danger" @click="confirmarCancelacion">
              <i class="bi bi-trash me-1"></i>Sí, cancelar inscripción
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

// Vista
const viewMode = ref<'list' | 'grid'>('list')

// Filtros
const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modales
const showDetailsModal = ref(false)
const showCancelModal = ref(false)
const selectedCurso = ref<any>(null)
const inscripcionToCancel = ref<any>(null)

// Datos
const inscripciones = ref<any[]>([])

// Opciones de estado
const statusOptions = [
  { value: 'activo', label: 'En Progreso', icon: 'bi bi-play-circle' },
  { value: 'pendiente', label: 'Pendiente', icon: 'bi bi-clock' },
  { value: 'completado', label: 'Completado', icon: 'bi bi-check-circle' },
  { value: 'cancelado', label: 'Cancelado', icon: 'bi bi-x-circle' }
]

// Computed para resumen
const totalInscripciones = computed(() => inscripciones.value.length)
const inscripcionesActivas = computed(() => inscripciones.value.filter(i => i.estado === 'activo').length)
const inscripcionesCompletadas = computed(() => inscripciones.value.filter(i => i.estado === 'completado').length)
const promedioProgreso = computed(() => {
  if (inscripciones.value.length === 0) return 0
  const suma = inscripciones.value.reduce((acc, i) => acc + (i.progreso || 0), 0)
  return Math.round(suma / inscripciones.value.length)
})

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedStatus.value || dateFrom.value || dateTo.value)
})

const filteredInscripciones = computed(() => {
  let result = [...inscripciones.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(i =>
      i.curso_nombre.toLowerCase().includes(query) ||
      (i.instructor && i.instructor.toLowerCase().includes(query))
    )
  }

  if (selectedStatus.value) {
    result = result.filter(i => i.estado === selectedStatus.value)
  }

  if (dateFrom.value) {
    result = result.filter(i => {
      const fecha = new Date(i.fecha_inscripcion)
      return fecha >= new Date(dateFrom.value)
    })
  }

  if (dateTo.value) {
    result = result.filter(i => {
      const fecha = new Date(i.fecha_inscripcion)
      return fecha <= new Date(dateTo.value)
    })
  }

  // Ordenar por fecha descendente
  result.sort((a, b) => {
    const dateA = new Date(a.fecha_inscripcion)
    const dateB = new Date(b.fecha_inscripcion)
    return dateB.getTime() - dateA.getTime()
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredInscripciones.value.length / itemsPerPage.value))
const paginatedInscripciones = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInscripciones.value.slice(start, end)
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
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredInscripciones.value.length))

// Métodos de ayuda
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatFullDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getEstadoLabel = (status: string) => {
  const labels: Record<string, string> = {
    activo: 'En Progreso',
    pendiente: 'Pendiente',
    completado: 'Completado',
    cancelado: 'Cancelado'
  }
  return labels[status] || status
}

const getEstadoClass = (status: string) => {
  const classes: Record<string, string> = {
    activo: 'status-active',
    pendiente: 'status-pending',
    completado: 'status-completed',
    cancelado: 'status-cancelled'
  }
  return classes[status] || 'status-pending'
}

const getEstadoIcon = (status: string) => {
  const icons: Record<string, string> = {
    activo: 'bi bi-play-circle',
    pendiente: 'bi bi-clock',
    completado: 'bi bi-check-circle',
    cancelado: 'bi bi-x-circle'
  }
  return icons[status] || 'bi bi-clock'
}

const getStatusCount = (status: string) => {
  return inscripciones.value.filter(i => i.estado === status).length
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
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Acciones
const viewDetalleCurso = (inscripcion: any) => {
  selectedCurso.value = inscripcion
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedCurso.value = null
}

const continuarCurso = (inscripcion: any) => {
  showToast(`Redirigiendo al curso "${inscripcion.curso_nombre}"...`, 'info', 'Cargando')
  // Redirigir al detalle del curso o a la plataforma de aprendizaje
  setTimeout(() => {
    router.push(`/cliente/cursos/${inscripcion.curso_id || inscripcion.id}`)
  }, 1000)
}

const descargarCertificado = (inscripcion: any) => {
  showToast(`Descargando certificado del curso "${inscripcion.curso_nombre}"...`, 'success', 'Descargando')

  // Generar contenido del certificado (mock)
  const certificadoContent = generateCertificadoContent(inscripcion)
  const blob = new Blob([certificadoContent], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Certificado_${inscripcion.curso_nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  setTimeout(() => {
    showToast('Certificado descargado correctamente', 'success', 'Descarga completada')
  }, 1000)
}

const generateCertificadoContent = (inscripcion: any): string => {
  return `CERTIFICADO DE FINALIZACIÓN

Otorgado a: ${inscripcion.cliente_nombre || 'Cliente'}
Por haber completado satisfactoriamente el curso:

"${inscripcion.curso_nombre}"

Duración: ${inscripcion.duracion || 'N/A'}
Fecha de finalización: ${formatFullDate(inscripcion.fecha_completado || new Date().toISOString())}

Este certificado acredita la participación y aprobación del curso
impartido por ${inscripcion.instructor || 'SENA Laboratorios'}.

SENA Laboratorios
${new Date().toLocaleDateString('es-ES')}
`
}

const cancelarInscripcion = (inscripcion: any) => {
  inscripcionToCancel.value = inscripcion
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  inscripcionToCancel.value = null
}

const confirmarCancelacion = () => {
  if (inscripcionToCancel.value) {
    const index = inscripciones.value.findIndex(i => i.id === inscripcionToCancel.value.id)
    if (index !== -1) {
      inscripciones.value[index].estado = 'cancelado'

      // Actualizar localStorage
      const storedData = localStorage.getItem('mock_cliente_data')
      if (storedData) {
        const mockData = JSON.parse(storedData)
        if (mockData.inscripciones) {
          mockData.inscripciones = inscripciones.value
          localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
        }
      }

      showToast(`Inscripción cancelada: "${inscripcionToCancel.value.curso_nombre}"`, 'success', 'Cancelación exitosa')
    }
  }
  closeCancelModal()
}

// Exportar inscripciones
const exportInscripciones = () => {
  const headers = ['Curso', 'Instructor', 'Fecha Inscripción', 'Progreso', 'Estado', 'Fecha Completado']
  const csvData = filteredInscripciones.value.map(i => [
    i.curso_nombre,
    i.instructor || '',
    formatDate(i.fecha_inscripcion),
    `${i.progreso || 0}%`,
    getEstadoLabel(i.estado),
    i.fecha_completado ? formatDate(i.fecha_completado) : ''
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `mis-inscripciones-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Lista de inscripciones exportada correctamente', 'success', 'Exportación completada')
}

// Cargar datos desde localStorage
const loadInscripciones = () => {
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    try {
      const mockData = JSON.parse(storedData)
      if (mockData.inscripciones && mockData.inscripciones.length > 0) {
        inscripciones.value = mockData.inscripciones
      } else {
        loadMockInscripciones()
      }
    } catch (e) {
      console.error('Error loading inscripciones:', e)
      loadMockInscripciones()
    }
  } else {
    loadMockInscripciones()
  }
}

// Cargar inscripciones mock
const loadMockInscripciones = () => {
  inscripciones.value = [
    {
      id: 1,
      curso_id: 101,
      curso_nombre: 'Fundamentos de Análisis Químico',
      instructor: 'Dra. Ana Pérez',
      duracion: '40 horas',
      descripcion: 'Aprende los fundamentos del análisis químico, técnicas de laboratorio y buenas prácticas.',
      progreso: 75,
      estado: 'activo',
      fecha_inscripcion: '2024-01-10T10:00:00',
      certificado_disponible: false,
      color: 'linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%)',
      icon: 'bi bi-flask',
      temario: [
        { nombre: 'Introducción al laboratorio', completado: true },
        { nombre: 'Técnicas de medición', completado: true },
        { nombre: 'Análisis volumétrico', completado: false },
        { nombre: 'Espectrofotometría', completado: false }
      ],
      modulos_completados: 2,
      total_modulos: 4
    },
    {
      id: 2,
      curso_id: 102,
      curso_nombre: 'Buenas Prácticas de Laboratorio (BPL)',
      instructor: 'Dr. Carlos Gómez',
      duracion: '20 horas',
      descripcion: 'Capacitación sobre las Buenas Prácticas de Laboratorio según normativa ISO/IEC 17025.',
      progreso: 100,
      estado: 'completado',
      fecha_inscripcion: '2023-11-15T09:30:00',
      fecha_completado: '2023-12-10T15:00:00',
      certificado_disponible: true,
      color: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)',
      icon: 'bi bi-shield-check',
      temario: [
        { nombre: 'Documentación y registros', completado: true },
        { nombre: 'Equipos y calibración', completado: true },
        { nombre: 'Manejo de muestras', completado: true },
        { nombre: 'Seguridad en el laboratorio', completado: true }
      ],
      modulos_completados: 4,
      total_modulos: 4
    },
    {
      id: 3,
      curso_id: 103,
      curso_nombre: 'Microbiología para Laboratorios',
      instructor: 'Dra. Laura Martínez',
      duracion: '35 horas',
      descripcion: 'Técnicas de análisis microbiológico, identificación de microorganismos y control de calidad.',
      progreso: 30,
      estado: 'activo',
      fecha_inscripcion: '2024-01-20T14:00:00',
      certificado_disponible: false,
      color: 'linear-gradient(135deg, #9C27B0 0%, #E040FB 100%)',
      icon: 'bi bi-virus',
      temario: [
        { nombre: 'Introducción a la microbiología', completado: true },
        { nombre: 'Técnicas de siembra', completado: false },
        { nombre: 'Identificación de bacterias', completado: false },
        { nombre: 'Control de calidad', completado: false }
      ],
      modulos_completados: 1,
      total_modulos: 4
    },
    {
      id: 4,
      curso_id: 104,
      curso_nombre: 'Gestión de Calidad ISO 9001:2015',
      instructor: 'Ing. Roberto Sánchez',
      duracion: '30 horas',
      descripcion: 'Implementación y auditoría de sistemas de gestión de calidad según ISO 9001.',
      progreso: 0,
      estado: 'pendiente',
      fecha_inscripcion: '2024-02-01T11:00:00',
      certificado_disponible: false,
      color: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
      icon: 'bi bi-bar-chart',
      temario: [
        { nombre: 'Contexto de la organización', completado: false },
        { nombre: 'Planificación', completado: false },
        { nombre: 'Soporte', completado: false },
        { nombre: 'Operación', completado: false }
      ],
      modulos_completados: 0,
      total_modulos: 4
    }
  ]

  // Guardar en localStorage
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    const mockData = JSON.parse(storedData)
    mockData.inscripciones = inscripciones.value
    localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
  }
}

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

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

watch([searchQuery, selectedStatus, dateFrom, dateTo], () => {
  currentPage.value = 1
})

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadInscripciones()
})
</script>

<style scoped>
/* Mantener consistencia con el diseño anterior - estilos similares a componentes previos */
.inscripciones-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .inscripciones-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */
.page-header {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem 0;
  box-shadow: 0 2px 15px var(--shadow-color, rgba(0, 0, 0, 0.08));
}

[data-bs-theme="dark"] .page-header {
  background: var(--color-light, #121212);
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.breadcrumb {
  margin-bottom: 1rem;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.breadcrumb-item.active {
  color: var(--color-primary, #1E9E4A);
  font-weight: 500;
}

.breadcrumb-link {
  color: var(--color-gray, #6C757D);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--color-primary, #1E9E4A);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .page-title {
  color: var(--color-dark, #F8F9FA);
}

.page-subtitle {
  color: var(--color-gray, #6C757D);
  margin: 0;
}

/* Resumen Section */
.resumen-section {
  padding: 2rem 0 1rem;
}

.resumen-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.resumen-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .resumen-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.resumen-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.resumen-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.resumen-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.resumen-icon.activos {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
}

.resumen-icon.completados {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
}

.resumen-icon.promedio {
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
}

.resumen-info {
  flex: 1;
}

.resumen-label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.25rem;
}

.resumen-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .resumen-value {
  color: var(--color-dark, #F8F9FA);
}

/* Filters Section */
.filters-section {
  padding: 0 0 1rem;
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
  grid-template-columns: 1fr 1fr 1fr;
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

[data-bs-theme="dark"] .search-input {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
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

.status-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
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

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-range .form-control {
  flex: 1;
  padding: 0.625rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

/* Main Content */
.main-content {
  padding: 0 0 3rem;
}

.inscripciones-card {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  overflow: hidden;
}

[data-bs-theme="dark"] .inscripciones-card {
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

.view-btn.active {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

/* Table Styles */
.inscripciones-table-container {
  overflow-x: auto;
}

.inscripciones-table {
  width: 100%;
  border-collapse: collapse;
}

.inscripciones-table th {
  text-align: left;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-gray-dark, #495057);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.inscripciones-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  vertical-align: middle;
}

.inscripciones-table tr:hover {
  background: rgba(30, 158, 74, 0.03);
}

.curso-cell {
  min-width: 250px;
}

.curso-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.curso-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.curso-detalle strong {
  display: block;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .curso-detalle strong {
  color: var(--color-dark, #F8F9FA);
}

.curso-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

.fecha-cell {
  min-width: 150px;
}

.fecha-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .fecha-info {
  color: var(--color-dark, #F8F9FA);
}

.progreso-cell {
  min-width: 150px;
}

.progreso-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar-container {
  flex: 1;
  height: 8px;
  background: var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  overflow: hidden;
}

[data-bs-theme="dark"] .progress-bar-container {
  background: var(--color-gray-light, #2d2d2d);
}

.progress-bar {
  height: 100%;
  background: var(--gradient-primary, linear-gradient(90deg, #1E9E4A 0%, #4CAF50 100%));
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progreso-porcentaje {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary, #1E9E4A);
  min-width: 45px;
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active {
  background: #cff4fc;
  color: #055160;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.btn-certificado {
  background: none;
  border: none;
  color: var(--color-primary, #1E9E4A);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-certificado:hover {
  background: rgba(30, 158, 74, 0.1);
}

.certificado-no-disponible {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
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
}

.btn-action.view:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.btn-action.continue:hover {
  border-color: #28a745;
  color: #28a745;
}

.btn-action.cancel:hover {
  border-color: #dc3545;
  color: #dc3545;
}

/* Grid View */
.inscripciones-grid {
  padding: 1.5rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.curso-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .curso-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.curso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.curso-card-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.curso-icon-large {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.curso-card-body {
  padding: 1.25rem;
}

.curso-nombre {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .curso-nombre {
  color: var(--color-dark, #F8F9FA);
}

.curso-meta-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.progreso-section {
  margin-bottom: 1rem;
}

.progreso-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progreso-label {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

.curso-descripcion {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  line-height: 1.4;
}

.curso-card-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-continuar {
  flex: 1;
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-continuar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.btn-certificado-card {
  flex: 1;
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-certificado-card:hover {
  transform: translateY(-2px);
}

.btn-cancelar {
  flex: 1;
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-detalle {
  flex: 1;
  background: var(--color-gray-light, #E9ECEF);
  color: var(--color-dark, #212529);
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .btn-detalle {
  background: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.btn-detalle:hover {
  background: var(--color-gray, #6C757D);
  color: white;
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
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
}

/* Modal Details */
.detalle-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.curso-titulo {
  flex: 1;
}

.curso-titulo h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .curso-titulo h3 {
  color: var(--color-dark, #F8F9FA);
}

.detalle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.detalle-section {
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(129, 199, 132, 0.01) 100%));
  border-radius: 12px;
}

.detalle-section.full-width {
  grid-column: span 2;
}

.detalle-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-primary, #1E9E4A);
}

.detalle-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  font-size: 0.85rem;
}

.detalle-label {
  font-weight: 500;
  color: var(--color-gray, #6C757D);
}

.detalle-value {
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .detalle-value {
  color: var(--color-dark, #F8F9FA);
}

.progreso-detalle {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar-container.large {
  height: 12px;
}

.progreso-porcentaje.large {
  font-size: 1rem;
}

.temario-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.temario-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .temario-list li {
  color: var(--color-dark, #F8F9FA);
}

.temario-list li i {
  color: var(--color-primary, #1E9E4A);
}

/* Buttons */
.btn-primary {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.btn-outline-primary {
  border: 2px solid var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  background: transparent;
}

.btn-outline-primary:hover {
  background: var(--color-primary, #1E9E4A);
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
}

/* Toast */
.toast {
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(12, 18, 30, 0.08);
}

/* Responsive */
@media (max-width: 1200px) {
  .resumen-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .detalle-grid {
    grid-template-columns: 1fr;
  }

  .detalle-section.full-width {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .resumen-grid {
    grid-template-columns: 1fr;
  }

  .card-header-custom {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }

  .inscripciones-table th:nth-child(3),
  .inscripciones-table td:nth-child(3) {
    display: none;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding: 1rem 0;
  }

  .curso-info {
    flex-direction: column;
    text-align: center;
  }

  .curso-meta {
    justify-content: center;
  }
}
</style>
