<template>
  <div :data-bs-theme="currentTheme" class="agenda-sesiones-page">
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
              <i class="bi bi-calendar-week"></i> Agenda de Sesiones
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-calendar-week-fill me-2"></i>Agenda de Sesiones
            </h1>
            <p class="page-subtitle">
              Gestione y dé seguimiento a sus sesiones programadas
            </p>
          </div>

          <div class="header-actions">
            <button class="btn btn-outline-primary" @click="exportAgenda">
              <i class="bi bi-download me-1"></i> Exportar
            </button>
            <button class="btn btn-primary" @click="openRequestModal">
              <i class="bi bi-plus-lg me-1"></i> Solicitar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Vista de calendario / lista -->
    <section class="view-toggle-section">
      <div class="container">
        <div class="view-toggle-card">
          <div class="view-buttons">
            <button
              class="view-toggle-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="bi bi-list-ul"></i> Vista de Lista
            </button>
            <button
              class="view-toggle-btn"
              :class="{ active: viewMode === 'calendar' }"
              @click="viewMode = 'calendar'"
            >
              <i class="bi bi-calendar3"></i> Vista de Calendario
            </button>
            <button
              class="view-toggle-btn"
              :class="{ active: viewMode === 'month' }"
              @click="viewMode = 'month'"
            >
              <i class="bi bi-grid-3x3"></i> Vista Mensual
            </button>
          </div>

          <div class="date-navigation" v-if="viewMode !== 'list'">
            <button class="nav-btn" @click="previousPeriod">
              <i class="bi bi-chevron-left"></i>
            </button>
            <span class="current-period">{{ currentPeriodLabel }}</span>
            <button class="nav-btn" @click="nextPeriod">
              <i class="bi bi-chevron-right"></i>
            </button>
            <button class="nav-btn today-btn" @click="goToToday">
              Hoy
            </button>
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
                  placeholder="Buscar por título, técnico o notas..."
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
                <i class="bi bi-person-badge me-1"></i>Técnico
              </label>
              <select v-model="selectedTeacher" class="form-select">
                <option value="">Todos los técnicos</option>
                <option v-for="teacher in uniqueTeachers" :key="teacher" :value="teacher">
                  {{ teacher }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vista de Lista -->
    <main class="main-content" v-if="viewMode === 'list'">
      <div class="container">
        <div class="sessions-card">
          <div class="card-header-custom">
            <div class="card-info">
              <h4 class="card-title">
                <i class="bi bi-list-ul me-2"></i>Mis Sesiones
              </h4>
              <p class="card-subtitle">
                Mostrando {{ filteredSessions.length }} de {{ sessions.length }} sesiones
              </p>
            </div>
          </div>

          <div v-if="filteredSessions.length === 0" class="empty-state">
            <div class="empty-content">
              <i class="bi bi-calendar-x empty-icon"></i>
              <h5>No hay sesiones programadas</h5>
              <p class="text-muted">
                No se encontraron sesiones que coincidan con los filtros aplicados
              </p>
              <button class="btn btn-outline-primary" @click="clearFilters">
                <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
              </button>
              <button class="btn btn-primary mt-2" @click="openRequestModal">
                <i class="bi bi-plus-lg me-1"></i>Solicitar nueva sesión
              </button>
            </div>
          </div>

          <div v-else class="sessions-list">
            <div
              v-for="session in paginatedSessions"
              :key="session.id"
              class="session-item"
              :class="{ 'session-cancelled': session.estado === 'cancelada' }"
            >
              <div class="session-date-box">
                <div class="session-day">{{ getDayNumber(session.fecha) }}</div>
                <div class="session-month">{{ getMonthName(session.fecha) }}</div>
                <div class="session-year">{{ getYear(session.fecha) }}</div>
              </div>

              <div class="session-info">
                <div class="session-header">
                  <h3 class="session-title">{{ session.titulo }}</h3>
                  <span class="session-status" :class="getStatusClass(session.estado)">
                    <i :class="getStatusIcon(session.estado)"></i>
                    {{ getStatusLabel(session.estado) }}
                  </span>
                </div>

                <div class="session-details">
                  <div class="detail-item">
                    <i class="bi bi-clock"></i>
                    <span>{{ formatTime(session.hora_inicio) }} - {{ formatTime(session.hora_fin) }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="bi bi-person-badge"></i>
                    <span>{{ session.tecnico }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="bi bi-geo-alt"></i>
                    <span>{{ session.ubicacion || 'Laboratorio SENA' }}</span>
                  </div>
                  <div class="detail-item" v-if="session.tipo">
                    <i class="bi bi-tag"></i>
                    <span>{{ session.tipo }}</span>
                  </div>
                </div>

                <div class="session-notes" v-if="session.notas">
                  <i class="bi bi-chat-text"></i>
                  <p>{{ session.notas }}</p>
                </div>

                <div class="session-materials" v-if="session.materiales && session.materiales.length">
                  <i class="bi bi-paperclip"></i>
                  <span>Materiales: {{ session.materiales.join(', ') }}</span>
                </div>
              </div>

              <div class="session-actions">
                <button
                  class="btn-action view"
                  @click="viewSessionDetails(session)"
                  title="Ver detalles"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  v-if="session.estado === 'programada'"
                  class="btn-action edit"
                  @click="editSession(session)"
                  title="Editar sesión"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  v-if="session.estado === 'programada'"
                  class="btn-action cancel"
                  @click="confirmCancel(session)"
                  title="Cancelar sesión"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
                <button
                  v-if="session.enlace_video"
                  class="btn-action video"
                  @click="joinVideoCall(session)"
                  title="Unirse a videollamada"
                >
                  <i class="bi bi-camera-video"></i>
                </button>
              </div>
            </div>

            <!-- Paginación -->
            <div v-if="filteredSessions.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ startItem }} - {{ endItem }} de {{ filteredSessions.length }} sesiones
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

    <!-- Vista de Calendario (semanal) -->
    <main class="main-content" v-if="viewMode === 'calendar'">
      <div class="container">
        <div class="sessions-card">
          <div class="calendar-view">
            <div class="calendar-header">
              <div class="calendar-weekdays">
                <div v-for="day in weekDays" :key="day.index" class="weekday">
                  {{ day.name }}
                </div>
              </div>
            </div>
            <div class="calendar-grid">
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                class="calendar-day"
                :class="{ 'calendar-day-today': isToday(day.date), 'calendar-day-other': !isCurrentMonth(day.date) }"
              >
                <div class="day-number">{{ day.dayNumber }}</div>
                <div class="day-sessions">
                  <div
                    v-for="session in getSessionsForDate(day.date)"
                    :key="session.id"
                    class="calendar-session"
                    :class="getStatusClass(session.estado)"
                    @click="viewSessionDetails(session)"
                  >
                    <span class="session-time">{{ formatTime(session.hora_inicio) }}</span>
                    <span class="session-title">{{ session.titulo }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Vista Mensual -->
    <main class="main-content" v-if="viewMode === 'month'">
      <div class="container">
        <div class="sessions-card">
          <div class="month-view">
            <div class="month-header">
              <div class="month-weekdays">
                <div v-for="day in weekDaysShort" :key="day" class="month-weekday">{{ day }}</div>
              </div>
            </div>
            <div class="month-grid">
              <div
                v-for="(day, index) in monthDays"
                :key="index"
                class="month-day"
                :class="{ 'month-day-today': isToday(day.date), 'month-day-other': !isCurrentMonth(day.date) }"
              >
                <div class="month-day-number">{{ day.dayNumber }}</div>
                <div class="month-day-sessions">
                  <div
                    v-for="session in getSessionsForDate(day.date)"
                    :key="session.id"
                    class="month-session"
                    :class="getStatusClass(session.estado)"
                    @click="viewSessionDetails(session)"
                  >
                    {{ session.titulo }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de detalles de sesión -->
    <div v-if="showDetailsModal" class="modal-backdrop show" @click="closeDetailsModal"></div>
    <div v-if="showDetailsModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-calendar-event me-2"></i>Detalles de la Sesión
            </h5>
            <button type="button" class="btn-close" @click="closeDetailsModal"></button>
          </div>
          <div class="modal-body">
            <div class="session-detail-header">
              <h3>{{ selectedSession?.titulo }}</h3>
              <span class="session-status" :class="getStatusClass(selectedSession?.estado)">
                {{ getStatusLabel(selectedSession?.estado) }}
              </span>
            </div>

            <div class="session-detail-grid">
              <div class="detail-section">
                <h4><i class="bi bi-calendar3"></i> Fecha y Hora</h4>
                <p><strong>Fecha:</strong> {{ formatFullDate(selectedSession?.fecha) }}</p>
                <p><strong>Hora:</strong> {{ formatTime(selectedSession?.hora_inicio) }} - {{ formatTime(selectedSession?.hora_fin) }}</p>
                <p><strong>Duración:</strong> {{ calculateDuration(selectedSession?.hora_inicio, selectedSession?.hora_fin) }}</p>
              </div>

              <div class="detail-section">
                <h4><i class="bi bi-person-badge"></i> Responsable</h4>
                <p><strong>Técnico:</strong> {{ selectedSession?.tecnico }}</p>
                <p><strong>Email:</strong> {{ selectedSession?.tecnico_email || 'tecnico@sena.com' }}</p>
                <p><strong>Teléfono:</strong> {{ selectedSession?.tecnico_telefono || '(55) 1234-5678' }}</p>
              </div>

              <div class="detail-section">
                <h4><i class="bi bi-geo-alt"></i> Ubicación</h4>
                <p>{{ selectedSession?.ubicacion || 'Laboratorio SENA' }}</p>
                <p v-if="selectedSession?.enlace_video">
                  <strong>Enlace videollamada:</strong>
                  <a :href="selectedSession.enlace_video" target="_blank" class="video-link">
                    <i class="bi bi-camera-video"></i> Unirse a la reunión
                  </a>
                </p>
              </div>

              <div class="detail-section" v-if="selectedSession?.notas">
                <h4><i class="bi bi-chat-text"></i> Notas</h4>
                <p>{{ selectedSession.notas }}</p>
              </div>

              <div class="detail-section" v-if="selectedSession?.materiales?.length">
                <h4><i class="bi bi-paperclip"></i> Materiales Necesarios</h4>
                <ul>
                  <li v-for="material in selectedSession.materiales" :key="material">{{ material }}</li>
                </ul>
              </div>

              <div class="detail-section" v-if="selectedSession?.objetivos">
                <h4><i class="bi bi-bullseye"></i> Objetivos</h4>
                <p>{{ selectedSession.objetivos }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDetailsModal">Cerrar</button>
            <button v-if="selectedSession?.estado === 'programada'" class="btn btn-danger" @click="cancelFromModal">
              Cancelar sesión
            </button>
            <button v-if="selectedSession?.enlace_video" class="btn btn-primary" @click="joinVideoCall(selectedSession)">
              <i class="bi bi-camera-video"></i> Unirse a videollamada
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de cancelación -->
    <div v-if="showCancelModal" class="modal-backdrop show" @click="closeCancelModal"></div>
    <div v-if="showCancelModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-warning me-2"></i>
              Cancelar Sesión
            </h5>
            <button type="button" class="btn-close" @click="closeCancelModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              ¿Estás seguro de que deseas cancelar esta sesión?
            </div>
            <p><strong>Sesión:</strong> {{ sessionToCancel?.titulo }}</p>
            <p><strong>Fecha:</strong> {{ formatFullDate(sessionToCancel?.fecha) }}</p>
            <p><strong>Hora:</strong> {{ formatTime(sessionToCancel?.hora_inicio) }} - {{ formatTime(sessionToCancel?.hora_fin) }}</p>
            <div class="mt-3">
              <label class="form-label">Motivo de cancelación (opcional)</label>
              <textarea v-model="cancelReason" class="form-control" rows="2" placeholder="Ingrese el motivo de la cancelación..."></textarea>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="closeCancelModal">
              <i class="bi bi-x-lg me-1"></i>No, mantener
            </button>
            <button type="button" class="btn btn-danger" @click="cancelSession">
              <i class="bi bi-calendar-x me-1"></i>Sí, cancelar sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de solicitud de sesión -->
    <div v-if="showRequestModal" class="modal-backdrop show" @click="closeRequestModal"></div>
    <div v-if="showRequestModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>Solicitar Nueva Sesión
            </h5>
            <button type="button" class="btn-close" @click="closeRequestModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitSessionRequest">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label required">Título de la sesión</label>
                  <input v-model="newSession.titulo" type="text" class="form-control" required>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Fecha</label>
                    <input v-model="newSession.fecha" type="date" class="form-control" :min="minDate" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Hora de inicio</label>
                    <input v-model="newSession.hora_inicio" type="time" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Hora de fin</label>
                    <input v-model="newSession.hora_fin" type="time" class="form-control" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Tipo de sesión</label>
                    <select v-model="newSession.tipo" class="form-select">
                      <option value="Análisis">Análisis de muestras</option>
                      <option value="Consultoría">Consultoría</option>
                      <option value="Capacitación">Capacitación</option>
                      <option value="Revisión">Revisión de resultados</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Modalidad</label>
                    <select v-model="newSession.modalidad" class="form-select">
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Notas / Descripción</label>
                  <textarea v-model="newSession.notas" class="form-control" rows="3" placeholder="Describa el propósito de la sesión..."></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Materiales necesarios</label>
                  <div class="materials-input">
                    <input v-model="materialInput" type="text" class="form-control" placeholder="Agregar material" @keyup.enter="addMaterial">
                    <button type="button" class="btn btn-outline-primary" @click="addMaterial">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <div class="materials-list" v-if="newSession.materiales.length">
                    <span v-for="(material, idx) in newSession.materiales" :key="idx" class="material-tag">
                      {{ material }}
                      <button type="button" @click="removeMaterial(idx)">&times;</button>
                    </span>
                  </div>
                </div>
              </div>

              <div class="alert alert-info mt-3">
                <i class="bi bi-info-circle-fill me-2"></i>
                Su solicitud será revisada por nuestro equipo. Le confirmaremos la disponibilidad en un plazo máximo de 24 horas.
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeRequestModal">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="submitting">
                  <i v-if="!submitting" class="bi bi-send me-1"></i>
                  <i v-else class="bi bi-hourglass-split me-1"></i>
                  {{ submitting ? 'Enviando...' : 'Enviar solicitud' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <BaseToast ref="toastRef" toast-id="clientToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import BaseToast from '@/components/UI/BaseToast.vue'
import { useToast, type ToastType } from '@/composables/useToast'


const { toastRef, showToast } = useToast()
// Tipos
type Theme = 'light' | 'dark'

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Vista
const viewMode = ref<'list' | 'calendar' | 'month'>('list')
const currentDate = ref(new Date())

// Filtros
const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)
const selectedTeacher = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modales
const showDetailsModal = ref(false)
const showCancelModal = ref(false)
const showRequestModal = ref(false)
const selectedSession = ref<any>(null)
const sessionToCancel = ref<any>(null)
const cancelReason = ref('')
const submitting = ref(false)

// Nueva sesión
const materialInput = ref('')
const newSession = ref({
  titulo: '',
  fecha: '',
  hora_inicio: '',
  hora_fin: '',
  tipo: 'Análisis',
  modalidad: 'presencial',
  notas: '',
  materiales: [] as string[]
})

// Datos
const sessions = ref<any[]>([])

// Opciones de estado
const statusOptions = [
  { value: 'programada', label: 'Programada', icon: 'bi bi-calendar-check' },
  { value: 'en_progreso', label: 'En Progreso', icon: 'bi bi-play-circle' },
  { value: 'completada', label: 'Completada', icon: 'bi bi-check-circle' },
  { value: 'cancelada', label: 'Cancelada', icon: 'bi bi-x-circle' }
]

// Computed para filtros
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedStatus.value || selectedTeacher.value)
})

const uniqueTeachers = computed(() => {
  const teachers = new Set(sessions.value.map(s => s.tecnico))
  return Array.from(teachers)
})

const filteredSessions = computed(() => {
  let result = [...sessions.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      s.titulo.toLowerCase().includes(query) ||
      s.tecnico.toLowerCase().includes(query) ||
      (s.notas && s.notas.toLowerCase().includes(query))
    )
  }

  if (selectedStatus.value) {
    result = result.filter(s => s.estado === selectedStatus.value)
  }

  if (selectedTeacher.value) {
    result = result.filter(s => s.tecnico === selectedTeacher.value)
  }

  // Ordenar por fecha
  result.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  return result
})

const totalPages = computed(() => Math.ceil(filteredSessions.value.length / itemsPerPage.value))
const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSessions.value.slice(start, end)
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
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredSessions.value.length))

// Calendario
const weekDays = [
  { name: 'Lunes', index: 1 },
  { name: 'Martes', index: 2 },
  { name: 'Miércoles', index: 3 },
  { name: 'Jueves', index: 4 },
  { name: 'Viernes', index: 5 },
  { name: 'Sábado', index: 6 },
  { name: 'Domingo', index: 0 }
]

const weekDaysShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const currentPeriodLabel = computed(() => {
  if (viewMode.value === 'calendar') {
    const start = getWeekStart(currentDate.value)
    const end = getWeekEnd(currentDate.value)
    return `${formatMonthDay(start)} - ${formatMonthDay(end)}`
  } else {
    return currentDate.value.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }
})

const calendarDays = computed(() => {
  const start = getWeekStart(currentDate.value)
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === currentDate.value.getMonth()
    })
  }
  return days
})

const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay()
  const days = []

  const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  const startDate = new Date(year, month, 1 - startOffset)

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    days.push({
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month
    })
  }
  return days
})

// Métodos de ayuda
const getDayNumber = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).getDate()
}

const getMonthName = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
}

const getYear = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

const formatTime = (timeString: string) => {
  if (!timeString) return ''
  return timeString.substring(0, 5)
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

const formatMonthDay = (date: Date) => {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const getWeekStart = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

const getWeekEnd = (date: Date) => {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return end
}

const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isCurrentMonth = (date: Date) => {
  return date.getMonth() === currentDate.value.getMonth()
}

const getSessionsForDate = (date: Date) => {
  return sessions.value.filter(s => {
    const sessionDate = new Date(s.fecha)
    return sessionDate.toDateString() === date.toDateString() && s.estado !== 'cancelada'
  })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    programada: 'Programada',
    en_progreso: 'En Progreso',
    completada: 'Completada',
    cancelada: 'Cancelada'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    programada: 'status-scheduled',
    en_progreso: 'status-progress',
    completada: 'status-completed',
    cancelada: 'status-cancelled'
  }
  return classes[status] || 'status-scheduled'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    programada: 'bi bi-calendar-check',
    en_progreso: 'bi bi-play-circle',
    completada: 'bi bi-check-circle',
    cancelada: 'bi bi-x-circle'
  }
  return icons[status] || 'bi bi-calendar-check'
}

const getStatusCount = (status: string) => {
  return sessions.value.filter(s => s.estado === status).length
}

const calculateDuration = (start: string, end: string) => {
  if (!start || !end) return ''
  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)
  let hours = endH - startH
  let minutes = endM - startM
  if (minutes < 0) {
    hours--
    minutes += 60
  }
  return `${hours} hora${hours !== 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`
}

// Navegación de calendario
const previousPeriod = () => {
  if (viewMode.value === 'calendar') {
    const newDate = new Date(currentDate.value)
    newDate.setDate(currentDate.value.getDate() - 7)
    currentDate.value = newDate
  } else {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(currentDate.value.getMonth() - 1)
    currentDate.value = newDate
  }
}

const nextPeriod = () => {
  if (viewMode.value === 'calendar') {
    const newDate = new Date(currentDate.value)
    newDate.setDate(currentDate.value.getDate() + 7)
    currentDate.value = newDate
  } else {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(currentDate.value.getMonth() + 1)
    currentDate.value = newDate
  }
}

const goToToday = () => {
  currentDate.value = new Date()
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
  selectedTeacher.value = ''
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Acciones de sesión
const viewSessionDetails = (session: any) => {
  selectedSession.value = session
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedSession.value = null
}

const editSession = (session: any) => {
  showToast('Funcionalidad de edición próximamente', 'info', 'En desarrollo')
}

const confirmCancel = (session: any) => {
  sessionToCancel.value = session
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  sessionToCancel.value = null
  cancelReason.value = ''
}

const cancelSession = () => {
  if (sessionToCancel.value) {
    const index = sessions.value.findIndex(s => s.id === sessionToCancel.value.id)
    if (index !== -1) {
      sessions.value[index].estado = 'cancelada'
      if (cancelReason.value) {
        sessions.value[index].notas = `[CANCELADA] ${cancelReason.value}`
      }

      // Actualizar localStorage
      const storedData = localStorage.getItem('mock_cliente_data')
      if (storedData) {
        const mockData = JSON.parse(storedData)
        if (mockData.sessions) {
          mockData.sessions = sessions.value
          localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
        }
      }

      showToast(`Sesión "${sessionToCancel.value.titulo}" cancelada`, 'success', 'Sesión cancelada')
    }
  }
  closeCancelModal()
}

const cancelFromModal = () => {
  closeDetailsModal()
  confirmCancel(selectedSession.value)
}

const joinVideoCall = (session: any) => {
  if (session.enlace_video) {
    window.open(session.enlace_video, '_blank')
    showToast('Abriendo videollamada...', 'info', 'Redirigiendo')
  }
}

// Materiales
const addMaterial = () => {
  if (materialInput.value.trim()) {
    newSession.value.materiales.push(materialInput.value.trim())
    materialInput.value = ''
  }
}

const removeMaterial = (index: number) => {
  newSession.value.materiales.splice(index, 1)
}

// Solicitar sesión
const openRequestModal = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  newSession.value = {
    titulo: '',
    fecha: tomorrow.toISOString().split('T')[0],
    hora_inicio: '09:00',
    hora_fin: '10:00',
    tipo: 'Análisis',
    modalidad: 'presencial',
    notas: '',
    materiales: []
  }
  showRequestModal.value = true
}

const closeRequestModal = () => {
  showRequestModal.value = false
}

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const submitSessionRequest = async () => {
  if (!newSession.value.titulo || !newSession.value.fecha || !newSession.value.hora_inicio || !newSession.value.hora_fin) {
    showToast('Por favor complete todos los campos requeridos', 'warning', 'Campos incompletos')
    return
  }

  submitting.value = true

  setTimeout(() => {
    const newSessionData = {
      id: Date.now(),
      ...newSession.value,
      tecnico: 'Por asignar',
      estado: 'programada',
      ubicacion: newSession.value.modalidad === 'presencial' ? 'Laboratorio SENA' : 'Virtual',
      created_at: new Date().toISOString()
    }

    sessions.value.unshift(newSessionData)

    // Actualizar localStorage
    const storedData = localStorage.getItem('mock_cliente_data')
    if (storedData) {
      const mockData = JSON.parse(storedData)
      if (!mockData.sessions) mockData.sessions = []
      mockData.sessions = sessions.value
      localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
    }

    showToast('Solicitud de sesión enviada correctamente', 'success', 'Solicitud enviada')
    closeRequestModal()
    submitting.value = false
  }, 1000)
}

// Exportar agenda
const exportAgenda = () => {
  const headers = ['ID', 'Título', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Técnico', 'Estado', 'Ubicación', 'Notas']
  const csvData = filteredSessions.value.map(s => [
    s.id,
    s.titulo,
    s.fecha,
    s.hora_inicio,
    s.hora_fin,
    s.tecnico,
    getStatusLabel(s.estado),
    s.ubicacion || 'Laboratorio SENA',
    s.notas || ''
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `agenda-sesiones-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Agenda exportada correctamente', 'success', 'Exportación completada')
}

// Cargar datos
const loadSessions = () => {
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    try {
      const mockData = JSON.parse(storedData)
      if (mockData.sessions && mockData.sessions.length > 0) {
        sessions.value = mockData.sessions
      } else {
        loadMockSessions()
      }
    } catch (e) {
      console.error('Error loading sessions:', e)
      loadMockSessions()
    }
  } else {
    loadMockSessions()
  }
}

const loadMockSessions = () => {
  sessions.value = [
    {
      id: 1,
      titulo: 'Análisis de Muestras - Lote 2024-001',
      fecha: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
      hora_inicio: '10:00',
      hora_fin: '12:00',
      tecnico: 'Dr. Carlos Gómez',
      tecnico_email: 'carlos.gomez@sena.com',
      tecnico_telefono: '(55) 1234-5678',
      estado: 'programada',
      ubicacion: 'Laboratorio Químico - Planta Baja',
      notas: 'Análisis de metales pesados y compuestos orgánicos. Traer las muestras debidamente etiquetadas.',
      materiales: ['Muestras', 'Formulario de solicitud', 'EPP'],
      tipo: 'Análisis',
      enlace_video: null
    },
    {
      id: 2,
      titulo: 'Revisión de Resultados - Proyecto Calidad',
      fecha: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
      hora_inicio: '14:00',
      hora_fin: '15:30',
      tecnico: 'Dra. Ana Pérez',
      tecnico_email: 'ana.perez@sena.com',
      tecnico_telefono: '(55) 2345-6789',
      estado: 'programada',
      ubicacion: 'Sala de Juntas 2',
      notas: 'Revisión de resultados preliminares y plan de acción.',
      materiales: ['Reportes preliminares', 'Laptop'],
      tipo: 'Revisión',
      enlace_video: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 3,
      titulo: 'Capacitación: Nuevos Protocolos de Seguridad',
      fecha: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
      hora_inicio: '09:00',
      hora_fin: '13:00',
      tecnico: 'Ing. Roberto Sánchez',
      tecnico_email: 'roberto.sanchez@sena.com',
      tecnico_telefono: '(55) 3456-7890',
      estado: 'completada',
      ubicacion: 'Auditorio Principal',
      notas: 'Capacitación sobre nuevos protocolos de seguridad en el laboratorio.',
      materiales: ['Manual de procedimientos'],
      tipo: 'Capacitación',
      enlace_video: null
    },
    {
      id: 4,
      titulo: 'Consultoría: Implementación ISO 17025',
      fecha: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      hora_inicio: '11:00',
      hora_fin: '13:00',
      tecnico: 'Dra. Laura Martínez',
      tecnico_email: 'laura.martinez@sena.com',
      tecnico_telefono: '(55) 4567-8901',
      estado: 'programada',
      ubicacion: 'Virtual',
      notas: 'Asesoría para implementación del sistema de gestión de calidad.',
      materiales: ['Documentación actual'],
      tipo: 'Consultoría',
      enlace_video: 'https://meet.google.com/xyz-abcd-efg'
    },
    {
      id: 5,
      titulo: 'Entrega de Resultados - Lote 2023-089',
      fecha: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
      hora_inicio: '10:30',
      hora_fin: '11:30',
      tecnico: 'Dr. Carlos Gómez',
      tecnico_email: 'carlos.gomez@sena.com',
      tecnico_telefono: '(55) 1234-5678',
      estado: 'completada',
      ubicacion: 'Laboratorio Químico',
      notas: 'Entrega de resultados finales del análisis.',
      materiales: ['Certificados'],
      tipo: 'Análisis',
      enlace_video: null
    }
  ]

  // Guardar en localStorage
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    const mockData = JSON.parse(storedData)
    mockData.sessions = sessions.value
    localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
  }
}

// Toast





watch([searchQuery, selectedStatus, selectedTeacher], () => {
  currentPage.value = 1
})

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadSessions()
})
</script>

<style scoped>
/* Mantener consistencia con el diseño anterior - estilos similares a los componentes previos */
.agenda-sesiones-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .agenda-sesiones-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */

/* View Toggle */
.view-toggle-section {
  padding: 1rem 0;
}

.view-toggle-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

[data-bs-theme="dark"] .view-toggle-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.view-buttons {
  display: flex;
  gap: 0.5rem;
}

.view-toggle-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .view-toggle-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.view-toggle-btn.active {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border-color: transparent;
  color: white;
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .nav-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.nav-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.current-period {
  font-weight: 600;
  min-width: 180px;
  text-align: center;
  color: var(--color-dark, #212529);
}

.today-btn {
  width: auto;
  padding: 0 0.75rem;
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

.form-select {
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

.sessions-card {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  overflow: hidden;
}

[data-bs-theme="dark"] .sessions-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.card-header-custom {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
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

/* Session List */
.sessions-list {
  padding: 1rem;
}

.session-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(129, 199, 132, 0.01) 100%));
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .session-item {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(129, 199, 132, 0.04) 100%);
  border-color: var(--color-gray-light, #2d2d2d);
}

.session-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.session-item.session-cancelled {
  opacity: 0.7;
  background: rgba(220, 53, 69, 0.05);
}

.session-date-box {
  text-align: center;
  min-width: 80px;
  padding: 0.75rem;
  background: var(--color-primary, #1E9E4A);
  border-radius: 12px;
  color: white;
}

.session-day {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.session-month {
  font-size: 0.75rem;
  text-transform: uppercase;
}

.session-year {
  font-size: 0.7rem;
  opacity: 0.8;
}

.session-info {
  flex: 1;
}

.session-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.session-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .session-title {
  color: var(--color-dark, #F8F9FA);
}

.session-status {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
}

.status-scheduled {
  background: #cfe2ff;
  color: #084298;
}

.status-progress {
  background: #cff4fc;
  color: #055160;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.session-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.session-notes {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  margin-top: 0.5rem;
}

[data-bs-theme="dark"] .session-notes {
  background: rgba(255, 255, 255, 0.03);
}

.session-notes i {
  color: var(--color-primary, #1E9E4A);
}

.session-notes p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.session-materials {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

.session-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-action {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
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

.btn-action.edit:hover {
  border-color: #ffc107;
  color: #ffc107;
}

.btn-action.cancel:hover {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-action.video:hover {
  border-color: #17a2b8;
  color: #17a2b8;
}

/* Calendar View */
.calendar-view {
  padding: 1rem;
}

.calendar-header {
  margin-bottom: 1rem;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.weekday {
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 10px;
  color: var(--color-dark, #212529);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  min-height: 120px;
  padding: 0.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .calendar-day {
  border-color: var(--color-gray-light, #2d2d2d);
  background: var(--card-bg, #2d2d2d);
}

.calendar-day-today {
  border-color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.05);
}

.calendar-day-other {
  opacity: 0.5;
}

.day-number {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-dark, #212529);
}

.day-sessions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.calendar-session {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.calendar-session.status-scheduled {
  background: #cfe2ff;
  color: #084298;
}

.calendar-session.status-progress {
  background: #cff4fc;
  color: #055160;
}

.calendar-session:hover {
  transform: translateX(2px);
}

.session-time {
  font-weight: 600;
}

/* Month View */
.month-view {
  padding: 1rem;
}

.month-header {
  margin-bottom: 1rem;
}

.month-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.month-weekday {
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 10px;
  color: var(--color-dark, #212529);
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.month-day {
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .month-day {
  border-color: var(--color-gray-light, #2d2d2d);
  background: var(--card-bg, #2d2d2d);
}

.month-day-today {
  border-color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.05);
}

.month-day-other {
  opacity: 0.5;
}

.month-day-number {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-dark, #212529);
}

.month-day-sessions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.month-session {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.month-session.status-scheduled {
  background: #cfe2ff;
  color: #084298;
}

.month-session:hover {
  transform: translateX(2px);
}

/* Modal */

.modal-content {
  border-radius: 16px;
}

.session-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.session-detail-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.session-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.detail-section {
  padding: 0.75rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(129, 199, 132, 0.01) 100%));
  border-radius: 12px;
}

.detail-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-primary, #1E9E4A);
}

.detail-section p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

.video-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary, #1E9E4A);
  text-decoration: none;
}

/* Form */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.85rem;
}

.form-label.required::after {
  content: '*';
  color: #dc3545;
  margin-left: 0.25rem;
}

.materials-input {
  display: flex;
  gap: 0.5rem;
}

.materials-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.material-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary, #1E9E4A);
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
}

.material-tag button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
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

/* Buttons */
.btn-primary {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
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

/* Responsive */
@media (max-width: 992px) {

  .session-item {
    flex-direction: column;
  }

  .session-date-box {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: auto;
  }

  .session-day {
    font-size: 1.5rem;
  }

  .session-actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .session-detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {

  .view-toggle-card {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .calendar-weekdays,
  .calendar-grid {
    font-size: 0.7rem;
  }

  .calendar-day {
    min-height: 80px;
  }

  .calendar-session {
    display: none;
  }

  .month-weekday {
    font-size: 0.7rem;
  }

  .month-session {
    display: none;
  }
}

@media (max-width: 576px) {

  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
