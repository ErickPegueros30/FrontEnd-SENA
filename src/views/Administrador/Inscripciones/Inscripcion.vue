<template>
  <div :data-bs-theme="currentTheme" class="admin-inscripciones-page">
    <!-- Header con breadcrumb -->
    <header class="admin-header">
      <div class="container">
        <nav class="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-person-vcard"></i> Gestión de Inscripciones
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-person-vcard-fill me-2"></i>Administración de Inscripciones
            </h1>
            <p class="page-subtitle">
              Gestiona inscripciones a cursos y eventos
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-people"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalInscripciones }}</span>
                  <span class="stat-label">Inscripciones</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon cursos">
                  <i class="bi bi-mortarboard"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ cursos.length }}</span>
                  <span class="stat-label">Cursos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon eventos">
                  <i class="bi bi-calendar-event"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ eventos.length }}</span>
                  <span class="stat-label">Eventos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Panel de control -->
    <section class="control-panel">
      <div class="container">
        <div class="panel-card">
          <div class="panel-header">
            <h3 class="panel-title">
              <i class="bi bi-funnel me-2"></i>Filtros y Navegación
            </h3>
          </div>

          <div class="panel-body">
            <div class="filters-grid">
              <!-- Pestañas de navegación -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-tags me-1"></i>Tipo
                </label>
                <div class="type-filters">
                  <button
                    class="type-filter-btn"
                    :class="{ 'active': tipoActivo === 'cursos' }"
                    @click="tipoActivo = 'cursos'"
                  >
                    <i class="bi bi-mortarboard me-2"></i>Cursos
                  </button>
                  <button
                    class="type-filter-btn"
                    :class="{ 'active': tipoActivo === 'eventos' }"
                    @click="tipoActivo = 'eventos'"
                  >
                    <i class="bi bi-calendar-event me-2"></i>Eventos
                  </button>
                </div>
              </div>

              <!-- Búsqueda -->
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
                    :placeholder="`Buscar ${tipoActivo === 'cursos' ? 'curso' : 'evento'}...`"
                    @input="handleSearch"
                  >
                  <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por estado -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-toggle-on me-1"></i>Filtrar por estado
                </label>
                <div class="status-filters">
                  <button
                    v-for="estado in estados"
                    :key="estado.value"
                    class="status-filter-btn"
                    :class="{ 'active': filtroEstado === estado.value }"
                    @click="toggleEstadoFilter(estado.value)"
                  >
                    <i :class="estado.icon"></i>
                    {{ estado.label }}
                  </button>
                </div>
              </div>

              <!-- Acciones -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-lightning me-1"></i>Acciones rápidas
                </label>
                <div class="action-buttons">
                  <button class="btn btn-outline-secondary" @click="clearFilters">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                  </button>
                  <button class="btn btn-primary" @click="exportData">
                    <i class="bi bi-download me-1"></i>Exportar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid de Cursos/Eventos -->
    <main class="main-content">
      <div class="container">
        <div class="content-header">
          <div class="header-info">
            <h4 class="content-title">
              <i :class="tipoActivo === 'cursos' ? 'bi-mortarboard' : 'bi-calendar-event'"></i>
              {{ tipoActivo === 'cursos' ? 'Cursos Disponibles' : 'Eventos Programados' }}
            </h4>
            <p class="content-subtitle">
              Mostrando {{ itemsFiltrados.length }} de {{ totalItems }}
            </p>
          </div>

          <div class="view-options">
            <div class="sort-options">
              <span class="text-muted">Ordenar por:</span>
              <select v-model="ordenSeleccionado" class="form-select form-select-sm ms-2" style="width: auto;">
                <option value="fecha">Fecha más cercana</option>
                <option value="nombre">Nombre (A-Z)</option>
                <option value="inscritos">Más inscritos</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Grid de Cards -->
        <div class="items-grid">
          <div class="row g-4">
            <div
              v-for="item in itemsPaginados"
              :key="item.id"
              class="col-xl-3 col-lg-4 col-md-6"
            >
              <div class="item-card">
                <div class="card-image">
                      <template v-if="item.thumbnailUrl">
                        <img :src="item.thumbnailUrl" alt="miniatura" class="card-image-img" />
                      </template>
                      <template v-else>
                        <div class="image-placeholder" :style="{ background: item.color }">
                          <i :class="item.icono" class="placeholder-icon"></i>
                        </div>
                      </template>

                      <div class="instructor-overlay" v-if="item.instructor || item.instructorAvatar">
                        <img v-if="item.instructorAvatar" :src="item.instructorAvatar" alt="instructor" class="instructor-avatar" />
                        <div v-else class="instructor-initials">{{ getInitials(item.instructor) }}</div>
                      </div>

                      <div class="card-badge" :class="getEstadoClass(item.estado)">
                        {{ getEstadoText(item.estado) }}
                      </div>
                    </div>

                <div class="card-body">
                  <h5 class="card-title">{{ item.nombre }}</h5>
                  <p class="card-description">{{ truncateDescription(item.descripcion) }}</p>

                  <div class="card-meta">
                    <div class="meta-item">
                      <i class="bi bi-calendar"></i>
                      <span>{{ formatFecha(item.fechaInicio) }}</span>
                    </div>
                    <div class="meta-item" v-if="item.fechaFin">
                      <i class="bi bi-calendar-check"></i>
                      <span>{{ formatFecha(item.fechaFin) }}</span>
                    </div>
                    <div class="meta-item">
                      <i class="bi" :class="getModalidadIcon(item.modalidad)"></i>
                      <span>{{ item.modalidad }}</span>
                    </div>
                  </div>

                  <div class="card-stats">
                    <div class="stat">
                      <i class="bi bi-people"></i>
                      <div class="stat-info">
                        <span class="stat-number">{{ item.inscritos }}</span>
                        <span class="stat-label">Inscritos</span>
                      </div>
                    </div>
                    <div class="stat">
                      <i class="bi bi-check-circle"></i>
                      <div class="stat-info">
                        <span class="stat-number">{{ item.asistieron }}</span>
                        <span class="stat-label">Asistieron</span>
                      </div>
                    </div>
                  </div>

                  <div class="progress-container">
                    <div class="progress-info">
                      <span>Capacidad</span>
                      <span>{{ Math.round((item.inscritos / item.capacidad) * 100) }}%</span>
                    </div>
                    <div class="progress">
                      <div
                        class="progress-bar"
                        :class="getProgressClass(item.inscritos / item.capacidad)"
                        :style="{ width: `${(item.inscritos / item.capacidad) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="card-footer">
                  <div class="footer-actions">
                    <!-- Ver inscritos - Navega a otra vista -->
                    <button class="btn btn-sm btn-primary" @click.stop="verInscritos(item)">
                      <i class="bi bi-people me-1"></i> Ver inscritos
                    </button>
                    <!-- Constancias - Abre modal -->
                    <button class="btn btn-sm btn-outline-info" @click.stop="abrirModalConstancias(item)">
                      <i class="bi bi-file-pdf me-1"></i> Constancias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="itemsFiltrados.length === 0" class="empty-state">
          <div class="empty-content">
            <i :class="tipoActivo === 'cursos' ? 'bi-mortarboard' : 'bi-calendar-event'" class="empty-icon"></i>
            <h5>No se encontraron {{ tipoActivo === 'cursos' ? 'cursos' : 'eventos' }}</h5>
            <p class="text-muted">
              No hay {{ tipoActivo === 'cursos' ? 'cursos' : 'eventos' }} que coincidan con los filtros
            </p>
            <button class="btn btn-outline-primary" @click="clearFilters">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="itemsFiltrados.length > 0" class="pagination-section">
          <div class="pagination-controls">
            <nav aria-label="Paginación">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="currentPage = 1" :disabled="currentPage === 1">
                    <i class="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="prevPage" :disabled="currentPage === 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>

                <li v-for="pageNum in visiblePages" :key="pageNum" class="page-item" :class="{ active: pageNum === currentPage }">
                  <button class="page-link" @click="currentPage = pageNum">
                    {{ pageNum }}
                  </button>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="currentPage = totalPages" :disabled="currentPage === totalPages">
                    <i class="bi bi-chevron-double-right"></i>
                  </button>
                </li>
              </ul>
            </nav>

            <div class="pagination-info">
              <span class="text-muted">
                Página {{ currentPage }} de {{ totalPages }} •
                Mostrando {{ startItem }}-{{ endItem }} de {{ itemsFiltrados.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Constancias en PDF -->
    <div v-if="showConstanciasModal" class="modal-backdrop show" @click="showConstanciasModal = false"></div>
    <div v-if="showConstanciasModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-file-pdf text-danger me-2"></i>
              Constancias - {{ itemSeleccionado?.nombre }}
            </h5>
            <button type="button" class="btn-close" @click="showConstanciasModal = false"></button>
          </div>
          <div class="modal-body p-0">
            <!-- Tabs para diferentes constancias -->
            <div class="constancias-tabs">
              <div class="tabs-header">
                <button
                  v-for="(tab, index) in constanciasTabs"
                  :key="index"
                  class="tab-btn"
                  :class="{ 'active': tabActivo === index }"
                  @click="tabActivo = index"
                >
                  <i class="bi bi-file-pdf me-2"></i>
                  {{ tab.nombre }}
                </button>
              </div>

              <div class="tab-content">
                <!-- Visor de PDF -->
                <div class="pdf-viewer-container">
                  <div class="pdf-toolbar">
                    <div class="toolbar-left">
                      <button class="btn btn-sm btn-outline-secondary" title="Guardar">
                        <i class="bi bi-save"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" title="Imprimir">
                        <i class="bi bi-printer"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" title="Descargar" @click="descargarConstanciaActual">
                        <i class="bi bi-download"></i>
                      </button>
                      <div class="toolbar-divider"></div>
                      <button class="btn btn-sm btn-outline-secondary" title="Acercar">
                        <i class="bi bi-zoom-in"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" title="Alejar">
                        <i class="bi bi-zoom-out"></i>
                      </button>
                      <span class="toolbar-text">100%</span>
                    </div>
                    <div class="toolbar-right">
                      <span class="toolbar-text">{{ constanciasTabs[tabActivo]?.nombre }} - Página 1 de 1</span>
                    </div>
                  </div>

                  <!-- Vista previa del PDF -->
                  <div class="pdf-preview-container">
                    <div class="pdf-page">
                      <!-- Plantilla de constancia SENA -->
                      <div class="constancia-template">
                        <!-- Header SENA -->
                        <div class="constancia-header">
                          <div class="constancia-logo">
                            <i class="bi bi-microscope"></i>
                            <div>
                              <h2>SENA Laboratorios</h2>
                              <p>Sistema de Gestión de Laboratorios - Acreditación ISO 17025</p>
                            </div>
                          </div>
                          <div class="constancia-titulo">
                            <h1>CONSTANCIA DE PARTICIPACIÓN</h1>
                          </div>
                        </div>

                        <!-- Cuerpo -->
                        <div class="constancia-body">
                          <p class="constancia-texto">
                            El Sistema de Gestión de Laboratorios del SENA certifica que:
                          </p>

                          <div class="constancia-nombre-destacado">
                            {{ constanciasTabs[tabActivo]?.participante }}
                          </div>

                          <p class="constancia-texto">
                            Participó en el {{ tipoActivo === 'cursos' ? 'curso' : 'evento' }}:
                          </p>

                          <div class="constancia-evento">
                            <h3>{{ itemSeleccionado?.nombre }}</h3>
                            <p>{{ itemSeleccionado?.descripcion }}</p>
                          </div>

                          <div class="constancia-detalles">
                            <div class="detalle-item">
                              <i class="bi bi-calendar"></i>
                              <span>Fecha: {{ formatFecha(itemSeleccionado?.fechaInicio) }} {{ itemSeleccionado?.fechaFin ? ' - ' + formatFecha(itemSeleccionado.fechaFin) : '' }}</span>
                            </div>
                            <div class="detalle-item">
                              <i class="bi bi-clock"></i>
                              <span>Duración: {{ itemSeleccionado?.duracion }}</span>
                            </div>
                            <div class="detalle-item">
                              <i class="bi bi-person-badge"></i>
                              <span>Instructor: {{ itemSeleccionado?.instructor || 'Equipo SENA' }}</span>
                            </div>
                            <div class="detalle-item">
                              <i class="bi bi-hourglass-split"></i>
                              <span>Calificación: {{ constanciasTabs[tabActivo]?.calificacion || 'Aprobado' }}</span>
                            </div>
                          </div>

                          <p class="constancia-texto constancia-legal">
                            Esta constancia se expide para los fines que al interesado convengan, en la ciudad de Bogotá D.C.,
                            a los {{ formatFecha(new Date()) }}.
                          </p>
                        </div>

                        <!-- Firmas -->
                        <div class="constancia-firmas">
                          <div class="firma-item">
                            <div class="firma-linea"></div>
                            <p class="firma-nombre">Ing. Ana Pérez</p>
                            <p class="firma-cargo">Coordinadora de Laboratorios</p>
                          </div>
                          <div class="firma-item">
                            <div class="firma-linea"></div>
                            <p class="firma-nombre">Dr. Carlos Gómez</p>
                            <p class="firma-cargo">Director Técnico</p>
                          </div>
                        </div>

                        <!-- Footer con código de verificación -->
                        <div class="constancia-footer">
                          <p>Código de verificación: {{ constanciasTabs[tabActivo]?.codigo }}</p>
                          <p>Este documento es válido electrónicamente - SENA Laboratorios</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="showConstanciasModal = false">
              <i class="bi bi-x-lg me-1"></i>Cerrar
            </button>
            <button type="button" class="btn btn-danger" @click="descargarTodasConstancias">
              <i class="bi bi-file-pdf me-1"></i>Descargar todas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        id="adminToast"
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
type TipoItem = 'cursos' | 'eventos'
type EstadoItem = 'activo' | 'finalizado' | 'proximos' | 'cancelado'
type Modalidad = 'Presencial' | 'Virtual' | 'Híbrido'
type Orden = 'fecha' | 'nombre' | 'inscritos'

interface Item {
  id: number
  tipo: TipoItem
  nombre: string
  descripcion: string
  fechaInicio: string
  fechaFin?: string
  duracion: string
  modalidad: Modalidad
  capacidad: number
  inscritos: number
  asistieron: number
  estado: EstadoItem
  color: string
  icono: string
  instructor?: string
  thumbnailUrl?: string
  instructorAvatar?: string
  ubicacion?: string
}

interface ConstanciaTab {
  id: number
  nombre: string
  participante: string
  codigo: string
  calificacion?: string
}

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Datos de cursos y eventos (serán cargados desde la API)
import { API_BASE } from '@/config/api'

const cursos = ref<Item[]>([])
const eventos = ref<Item[]>([])

const mapCourseToItem = (c: any): Item => {
  return {
    id: c.id || c.id_curso,
    tipo: 'cursos',
    nombre: c.title || c.titulo || c.name || '',
    descripcion: c.description || c.descripcion || c.notes || '',
    fechaInicio: c.startDate || c.fechaInicio || c.inicio_fecha || c.start_date || '',
    fechaFin: c.endDate || c.fechaFin || c.fin_fecha || c.end_date || '',
    duracion: c.duracion || c.duration || '',
    modalidad: (c.modality || c.modalidad || 'Presencial').charAt(0).toUpperCase() + (c.modality || c.modalidad || 'Presencial').slice(1),
    capacidad: c.capacidad || c.maxParticipants || c.max_participants || 0,
    inscritos: c.inscritos || c.registered || 0,
    asistieron: c.asistieron || c.attended || 0,
    estado: (c.status || c.estado || 'activo') as EstadoItem,
    color: c.color || '#1E9E4A',
    icono: c.icono || 'bi bi-mortarboard',
    instructor: c.instructor?.name || (c.instructor || null) || null,
    thumbnailUrl: c.thumbnailUrl || c.miniatura || null,
    instructorAvatar: c.instructor?.avatar || c.org_foto || c.avatar || null,
    ubicacion: c.location || c.ubicacion || null
  }
}

const mapEventToItem = (e: any): Item => {
  return {
    id: e.id || e.id_evento,
    tipo: 'eventos',
    nombre: e.title || e.titulo || e.name || '',
    descripcion: e.description || e.descripcion || e.notes || '',
    fechaInicio: e.startDate || e.startDate || e.fechaInicio || e.inicio_fecha || '',
    fechaFin: e.endDate || e.endDate || e.fechaFin || e.fin_fecha || '',
    duracion: e.duracion || e.duration || '',
    modalidad: (e.modality || e.modalidad || 'Virtual').charAt(0).toUpperCase() + (e.modality || e.modalidad || 'Virtual').slice(1),
    capacidad: e.capacidad || e.maxParticipants || e.max_participants || 0,
    inscritos: e.inscritos || e.registered || 0,
    asistieron: e.asistieron || e.attended || 0,
    estado: (e.status || e.estado || 'proximos') as EstadoItem,
    color: e.color || '#FF9800',
    icono: e.icono || 'bi bi-calendar-event',
    instructor: e.organizer?.name || e.instructor?.name || null,
    thumbnailUrl: e.thumbnailUrl || e.miniatura || null,
    instructorAvatar: e.organizer?.avatar || e.instructor?.avatar || e.org_foto || null,
    ubicacion: e.location || e.ubicacion || null
  }
}

const loadCursos = async () => {
  try {
    const res = await fetch(`${API_BASE}/cursos`)
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    cursos.value = Array.isArray(data) ? data.map(mapCourseToItem) : []
  } catch (e: any) {
    showToast('Error cargando cursos: ' + (e.message || String(e)), 'error', 'Error')
  }
}

const loadEventos = async () => {
  try {
    const res = await fetch(`${API_BASE}/events`)
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    eventos.value = Array.isArray(data) ? data.map(mapEventToItem) : []
  } catch (e: any) {
    showToast('Error cargando eventos: ' + (e.message || String(e)), 'error', 'Error')
  }
}

// Estados disponibles
const estados = [
  { value: 'activo', label: 'Activos', icon: 'bi bi-play-circle' },
  { value: 'proximos', label: 'Próximos', icon: 'bi bi-clock' },
  { value: 'finalizado', label: 'Finalizados', icon: 'bi bi-check-circle' }
]

// Filtros y estado
const tipoActivo = ref<TipoItem>('cursos')
const searchQuery = ref('')
const filtroEstado = ref<string | null>(null)
const ordenSeleccionado = ref<Orden>('fecha')

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(8)

// Modales
const showConstanciasModal = ref(false)
const itemSeleccionado = ref<Item | null>(null)
const tabActivo = ref(0)
const constanciasTabs = ref<ConstanciaTab[]>([])

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const totalInscripciones = computed(() => {
  return [...cursos.value, ...eventos.value].reduce((total, item) => total + item.inscritos, 0)
})

const itemsActivos = computed(() => {
  return tipoActivo.value === 'cursos' ? cursos.value : eventos.value
})

const itemsFiltrados = computed(() => {
  let items = [...itemsActivos.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.nombre.toLowerCase().includes(query) ||
      item.descripcion.toLowerCase().includes(query) ||
      (item.instructor && item.instructor.toLowerCase().includes(query))
    )
  }

  if (filtroEstado.value) {
    items = items.filter(item => item.estado === filtroEstado.value)
  }

  items.sort((a, b) => {
    switch (ordenSeleccionado.value) {
      case 'nombre':
        return a.nombre.localeCompare(b.nombre)
      case 'inscritos':
        return b.inscritos - a.inscritos
      case 'fecha':
      default:
        return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    }
  })

  return items
})

const totalItems = computed(() => itemsFiltrados.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

const itemsPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return itemsFiltrados.value.slice(start, end)
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
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))

// Toast helpers
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
const handleSearch = () => {
  currentPage.value = 1
}

const toggleEstadoFilter = (estado: string) => {
  filtroEstado.value = filtroEstado.value === estado ? null : estado
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  filtroEstado.value = null
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const formatFecha = (fecha?: string | Date): string => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const truncateDescription = (desc: string, maxLength: number = 80): string => {
  if (desc.length <= maxLength) return desc
  return desc.substring(0, maxLength) + '...'
}

const getEstadoClass = (estado: EstadoItem): string => {
  const classMap: Record<EstadoItem, string> = {
    'activo': 'estado-activo',
    'finalizado': 'estado-finalizado',
    'proximos': 'estado-proximos',
    'cancelado': 'estado-cancelado'
  }
  return classMap[estado] || ''
}

const getEstadoText = (estado: EstadoItem): string => {
  const textMap: Record<EstadoItem, string> = {
    'activo': 'Activo',
    'finalizado': 'Finalizado',
    'proximos': 'Próximo',
    'cancelado': 'Cancelado'
  }
  return textMap[estado] || estado
}

const getProgressClass = (ratio: number): string => {
  if (ratio >= 0.9) return 'bg-danger'
  if (ratio >= 0.7) return 'bg-warning'
  return 'bg-success'
}

const getModalidadIcon = (modalidad: Modalidad): string => {
  const iconMap: Record<Modalidad, string> = {
    'Presencial': 'bi-geo-alt',
    'Virtual': 'bi-laptop',
    'Híbrido': 'bi-laptop-fill'
  }
  return iconMap[modalidad] || 'bi-question-circle'
}

const getInitials = (name?: string) => {
  if (!name) return ''
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}

// Navegación a vista de participantes
const verInscritos = (item: Item) => {
  // Guardar el item en sessionStorage para recuperarlo en la vista de participantes
  sessionStorage.setItem('itemSeleccionado', JSON.stringify(item))
  // Navegar a la vista de participantes
  router.push(`/admin/inscripciones/${item.tipo}/${item.id}/participantes`)
}

// Abrir modal de constancias
const abrirModalConstancias = (item: Item) => {
  itemSeleccionado.value = item

  // Generar tabs de constancias para cada participante que asistió
  const tabs: ConstanciaTab[] = []
  for (let i = 0; i < item.asistieron; i++) {
    tabs.push({
      id: i + 1,
      nombre: `Constancia_${i + 1}.pdf`,
      participante: `Participante ${i + 1}`,
      codigo: `SENA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      calificacion: i % 2 === 0 ? 'Aprobado' : 'Sobresaliente'
    })
  }

  // Si no hay asistentes, crear un tab de ejemplo
  if (tabs.length === 0) {
    tabs.push({
      id: 1,
      nombre: 'Constancia_Ejemplo.pdf',
      participante: 'María Fernanda López',
      codigo: `SENA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      calificacion: 'Aprobado'
    })
  }

  constanciasTabs.value = tabs
  tabActivo.value = 0
  showConstanciasModal.value = true
}

const descargarConstanciaActual = () => {
  const tab = constanciasTabs.value[tabActivo.value]
  showToast(`Descargando ${tab.nombre}`, 'success', 'Descarga')
}

const descargarTodasConstancias = () => {
  showToast(`Descargando ${constanciasTabs.value.length} constancias`, 'success', 'Descarga masiva')
}

const exportData = () => {
  const items = tipoActivo.value === 'cursos' ? cursos.value : eventos.value
  const headers = ['ID', 'Nombre', 'Fecha Inicio', 'Fecha Fin', 'Modalidad', 'Capacidad', 'Inscritos', 'Asistieron', 'Estado']

  const csvData = items.map(item => [
    item.id,
    item.nombre,
    item.fechaInicio,
    item.fechaFin || '',
    item.modalidad,
    item.capacidad,
    item.inscritos,
    item.asistieron,
    getEstadoText(item.estado)
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${tipoActivo.value}-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Archivo CSV exportado', 'success', 'Exportación')
}

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

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  // Cargar datos reales desde la API
  loadCursos()
  loadEventos()
})
</script>

<style scoped>
/* Estilos (mantener todos los estilos que ya teníamos) */
.admin-inscripciones-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-inscripciones-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */
.admin-header {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem 0;
  box-shadow: 0 2px 15px var(--shadow-color, rgba(0, 0, 0, 0.08));
}

[data-bs-theme="dark"] .admin-header {
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

.quick-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--card-bg, white);
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-width: 160px;
  transition: transform 0.3s ease;
}

[data-bs-theme="dark"] .stat-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.cursos {
  background: linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%);
}

.stat-icon.eventos {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  line-height: 1;
}

[data-bs-theme="dark"] .stat-number {
  color: var(--color-dark, #F8F9FA);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  margin-top: 0.25rem;
}

/* Panel de control */
.control-panel {
  padding: 2rem 0 1rem;
}

.panel-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

[data-bs-theme="dark"] .panel-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.panel-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .panel-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .panel-title {
  color: var(--color-dark, #F8F9FA);
}

.panel-body {
  padding: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 992px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

[data-bs-theme="dark"] .filter-label {
  color: var(--color-dark, #F8F9FA);
}

.type-filters {
  display: flex;
  gap: 0.5rem;
}

.type-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

[data-bs-theme="dark"] .type-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.type-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.type-filter-btn.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-gray, #6C757D);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .search-input {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 0 0 0.25rem rgba(30, 158, 74, 0.25);
}

.clear-search {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.clear-search:hover {
  color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.1);
}

.status-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .status-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.status-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.status-filter-btn.active {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

[data-bs-theme="dark"] .status-filter-btn.active {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.main-content {
  padding: 1rem 0 3rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.content-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .content-title {
  color: var(--color-dark, #F8F9FA);
}

.content-subtitle {
  color: var(--color-gray, #6C757D);
  margin: 0;
  font-size: 0.95rem;
}

.view-options {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.items-grid {
  margin-bottom: 2rem;
}

.item-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

[data-bs-theme="dark"] .item-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary, #1E9E4A);
}

.card-image {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.card-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.instructor-overlay {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.instructor-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.9);
}

.instructor-initials {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 3rem;
  color: white;
  opacity: 0.8;
}

.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.estado-activo {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
}

.estado-proximos {
  background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
  color: #333;
}

.estado-finalizado {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

[data-bs-theme="dark"] .card-title {
  color: var(--color-dark, #F8F9FA);
}

.card-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
}

.meta-item i {
  width: 16px;
  color: var(--color-primary, #1E9E4A);
}

.card-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 8px;
}

[data-bs-theme="dark"] .card-stats {
  background: var(--lab-bg, #1a1a1a);
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat i {
  font-size: 1.25rem;
  color: var(--color-primary, #1E9E4A);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-weight: 700;
  color: var(--color-dark, #212529);
  font-size: 1rem;
  line-height: 1;
}

[data-bs-theme="dark"] .stat-number {
  color: var(--color-dark, #F8F9FA);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

.progress-container {
  margin-top: auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

.progress {
  height: 6px;
  background: var(--color-gray-light, #E9ECEF);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.card-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .card-footer {
  background: var(--lab-bg, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
}

.footer-actions .btn {
  flex: 1;
  font-size: 0.8rem;
  padding: 0.4rem;
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-content {
  max-width: 300px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 3rem;
  color: var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
}

.empty-state h5 {
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.5rem;
}

.pagination-section {
  padding: 1.5rem 0;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination {
  margin: 0;
}

.page-link {
  color: var(--color-primary, #1E9E4A);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  padding: 0.5rem 0.75rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .page-link {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.page-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
}

[data-bs-theme="dark"] .page-link:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.page-item.active .page-link {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

/* Modal Styles */
.modal-backdrop {
  opacity: 0.5;
  z-index: 1040;
}

.modal.show {
  display: block;
  z-index: 1050;
}

.modal-content {
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

[data-bs-theme="dark"] .modal-content {
  border: 1px solid var(--color-gray-light, #2d2d2d);
  background: var(--color-light, #121212);
}

.modal-header {
  padding: 1.5rem 2rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .modal-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.modal-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .modal-title {
  color: var(--color-dark, #F8F9FA);
}

.modal-body {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .modal-footer {
  background: var(--lab-bg, #1a1a1a);
}

/* Constancias Tabs */
.constancias-tabs {
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--lab-bg, #f8f9fa);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  overflow-x: auto;
}

[data-bs-theme="dark"] .tabs-header {
  background: var(--lab-bg, #1a1a1a);
}

.tab-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

[data-bs-theme="dark"] .tab-btn {
  background: var(--card-bg, #2d2d2d);
}

.tab-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.tab-btn.active {
  background: var(--color-primary, #1E9E4A);
  border-color: var(--color-primary, #1E9E4A);
  color: white;
}

/* PDF Viewer */
.pdf-viewer-container {
  background: #f5f5f5;
}

[data-bs-theme="dark"] .pdf-viewer-container {
  background: #2d2d2d;
}

.pdf-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: var(--card-bg, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .pdf-toolbar {
  background: var(--card-bg, #2d2d2d);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--color-gray-light, #E9ECEF);
  margin: 0 0.5rem;
}

[data-bs-theme="dark"] .toolbar-divider {
  background: var(--color-gray-light, #2d2d2d);
}

.toolbar-text {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.pdf-preview-container {
  padding: 2rem;
  min-height: 500px;
  display: flex;
  justify-content: center;
  background: #e0e0e0;
}

[data-bs-theme="dark"] .pdf-preview-container {
  background: #1a1a1a;
}

.pdf-page {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 2.5rem;
}

/* Constancia Template */
.constancia-template {
  font-family: 'Times New Roman', serif;
  color: #333;
}

.constancia-header {
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-primary, #1E9E4A);
  padding-bottom: 1rem;
}

.constancia-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.constancia-logo i {
  font-size: 3rem;
  color: var(--color-primary, #1E9E4A);
}

.constancia-logo h2 {
  margin: 0;
  color: var(--color-primary, #1E9E4A);
  font-weight: 700;
}

.constancia-logo p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.constancia-titulo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.constancia-body {
  margin-bottom: 2rem;
}

.constancia-texto {
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: justify;
  margin-bottom: 1rem;
}

.constancia-nombre-destacado {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  border: 2px dashed var(--color-primary, #1E9E4A);
  border-radius: 8px;
  color: var(--color-primary, #1E9E4A);
}

.constancia-evento {
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.constancia-evento h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.constancia-detalles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.detalle-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
}

.detalle-item i {
  color: var(--color-primary, #1E9E4A);
}

.constancia-legal {
  font-size: 0.95rem;
  font-style: italic;
}

.constancia-firmas {
  display: flex;
  justify-content: space-around;
  margin: 3rem 0;
}

.firma-item {
  text-align: center;
}

.firma-linea {
  width: 200px;
  height: 1px;
  background: #333;
  margin-bottom: 0.5rem;
}

.firma-nombre {
  font-weight: 600;
  margin: 0;
}

.firma-cargo {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.constancia-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  font-size: 0.8rem;
  color: #666;
}

/* Toast */
.toast-container {
  z-index: 1060;
}

.toast {
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(12, 18, 30, 0.08);
}

/* Responsive */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .quick-stats {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}

@media (max-width: 992px) {
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .constancia-detalles {
    grid-template-columns: 1fr;
  }

  .firma-linea {
    width: 120px;
  }
}

@media (max-width: 768px) {
  .panel-body {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .action-buttons .btn {
    flex: 1;
    min-width: 120px;
  }

  .type-filters {
    flex-direction: column;
  }

  .card-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat {
    justify-content: space-between;
  }

  .footer-actions {
    flex-direction: column;
  }

  .footer-actions .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .admin-header {
    padding: 1rem 0;
  }

  .panel-header {
    padding: 1rem 1.25rem;
  }

  .panel-body {
    padding: 1rem;
  }

  .stat-card {
    min-width: 140px;
    padding: 0.75rem 1rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .pdf-page {
    padding: 1rem;
  }

  .constancia-nombre-destacado {
    font-size: 1.5rem;
  }
}

/* Animations */
.stat-card,
.panel-card,
.table-card,
.item-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.stat-card:hover,
.panel-card:hover,
.table-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(12, 18, 30, 0.08);
}

/* Dark mode overrides */
[data-bs-theme="dark"] .panel-card,
[data-bs-theme="dark"] .table-card,
[data-bs-theme="dark"] .item-card,
[data-bs-theme="dark"] .stat-card {
  background: rgba(24, 24, 26, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

[data-bs-theme="dark"] .constancia-evento,
[data-bs-theme="dark"] .constancia-detalles {
  background: rgba(24, 24, 26, 0.55);
}

[data-bs-theme="dark"] .constancia-nombre-destacado {
  background: rgba(30, 158, 74, 0.1);
}
</style>
