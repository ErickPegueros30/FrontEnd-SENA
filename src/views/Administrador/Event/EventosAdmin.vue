<template>
  <div :data-bs-theme="currentTheme" class="admin-eventos-page">
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
              <i class="bi bi-calendar-event"></i> Gestión de Eventos
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-calendar-event-fill me-2"></i>Administración de Eventos
            </h1>
            <p class="page-subtitle">
              Administra y organiza todos los eventos, capacitaciones y actividades del sistema
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-calendar-check"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalEvents }}</span>
                  <span class="stat-label">Total Eventos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-calendar-plus"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ activeEvents }}</span>
                  <span class="stat-label">Activos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon upcoming">
                  <i class="bi bi-calendar-date"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ upcomingEvents }}</span>
                  <span class="stat-label">Próximos</span>
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
              <i class="bi bi-funnel me-2"></i>Filtros y Búsqueda
            </h3>
          </div>

          <div class="panel-body">
            <div class="filters-grid">
              <!-- Búsqueda -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-search me-1"></i>Buscar evento
                </label>
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Buscar por título, descripción o ubicación..."
                    @input="filterEvents"
                  >
                  <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por tipo -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-tags me-1"></i>Filtrar por tipo
                </label>
                <div class="type-filters">
                  <button
                    v-for="tipo in tipos"
                    :key="tipo.value"
                    class="type-filter-btn"
                    :class="{ 'active': selectedTipo === tipo.value }"
                    @click="toggleTipoFilter(tipo.value)"
                  >
                    <i :class="tipo.icon"></i>
                    {{ tipo.label }}
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
                    :class="{ 'active': selectedEstado === estado.value }"
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
                  <button class="btn btn-primary" @click="exportEvents">
                    <i class="bi bi-download me-1"></i>Exportar
                  </button>
                  <button class="btn btn-success" @click="showCreateEventModal">
                    <i class="bi bi-plus-lg me-1"></i>Nuevo evento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid de Eventos -->
    <main class="main-content">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">
                <i class="bi bi-calendar-event me-2"></i>Eventos del sistema
              </h4>
              <p class="table-subtitle">
                Mostrando {{ filteredEvents.length }} de {{ events.length }} eventos
              </p>
            </div>

            <div class="table-actions">
              <div class="pagination-info">
                <span class="text-muted">Eventos por página:</span>
                <select v-model="itemsPerPage" class="form-select form-select-sm ms-2" style="width: auto;">
                  <option :value="8">8</option>
                  <option :value="12">12</option>
                  <option :value="16">16</option>
                  <option :value="20">20</option>
                </select>
              </div>
            </div>
          </div>

          <div class="table-body">
            <div class="row g-4">
              <div
                v-for="event in paginatedEvents"
                :key="event.id"
                class="col-xl-3 col-lg-4 col-md-6"
              >
                <div class="event-card" @click="viewEvent(event)">
                  <div class="card-image">
                    <template v-if="event.thumbnailUrl">
                      <img :src="event.thumbnailUrl" :alt="event.title" class="event-thumb">
                    </template>
                    <template v-else>
                      <div class="image-placeholder" :style="{ background: getEventColor(event.type) }">
                        <i :class="getEventIcon(event.type)" class="placeholder-icon"></i>
                      </div>
                    </template>

                    <div class="card-badge" :class="getEstadoClass(event.status)">
                      {{ getEstadoText(event.status) }}
                    </div>

                    <div v-if="event.featured" class="featured-badge">
                      <i class="bi bi-star-fill"></i>
                    </div>
                  </div>

                  <div class="card-body">
                    <h5 class="card-title">{{ event.title }}</h5>
                    <p class="card-description">{{ truncateDescription(event.description) }}</p>

                    <div class="card-meta">
                      <div class="meta-item">
                        <i class="bi bi-calendar"></i>
                        <span>{{ formatDate(event.startDate) }}</span>
                      </div>
                      <div class="meta-item">
                        <i class="bi bi-clock"></i>
                        <span>{{ event.startTime }} - {{ event.endTime }}</span>
                      </div>
                      <div class="meta-item">
                        <i class="bi" :class="getModalidadIcon(event.modality)"></i>
                        <span>{{ capitalize(event.modality) }}</span>
                      </div>
                      <div v-if="event.location" class="meta-item">
                        <i class="bi bi-geo-alt"></i>
                        <span>{{ event.location }}</span>
                      </div>
                    </div>

                    <div class="card-stats">
                      <div class="stat">
                        <i class="bi bi-people"></i>
                        <div class="stat-info">
                          <span class="stat-number">{{ event.participants?.length || 0 }}</span>
                          <span class="stat-label">Inscritos</span>
                        </div>
                      </div>
                      <div class="stat">
                        <i class="bi bi-person-plus"></i>
                        <div class="stat-info">
                          <span class="stat-number">{{ event.maxParticipants - (event.participants?.length || 0) }}</span>
                          <span class="stat-label">Disponibles</span>
                        </div>
                      </div>
                    </div>

                    <div class="progress-container">
                      <div class="progress-info">
                        <span>Capacidad</span>
                        <span>{{ Math.round(((event.participants?.length || 0) / event.maxParticipants) * 100) || 0 }}%</span>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar"
                          :class="getProgressClass((event.participants?.length || 0) / event.maxParticipants)"
                          :style="{ width: `${Math.round(((event.participants?.length || 0) / event.maxParticipants) * 100) || 0}%` }"
                        ></div>
                      </div>
                    </div>

                    <div class="organizer-info">
                      <div class="avatar-initials" :style="{ background: getOrganizerColor(event.organizer) }">
                        {{ getInitials(event.organizer?.name) }}
                      </div>
                      <div class="organizer-details">
                        <span class="organizer-name">{{ event.organizer?.name }}</span>
                        <span class="organizer-role">Organizador</span>
                      </div>
                    </div>
                  </div>

                  <div class="card-footer">
                    <div class="footer-actions">
                      <button class="btn btn-sm btn-outline-primary" @click.stop="editEvent(event)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-info" @click.stop="toggleFeatured(event)">
                        <i class="bi" :class="event.featured ? 'bi-star-fill' : 'bi-star'"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click.stop="deleteEvent(event)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="filteredEvents.length === 0" class="empty-state">
              <div class="empty-content">
                <i class="bi bi-calendar-x empty-icon"></i>
                <h5>No se encontraron eventos</h5>
                <p class="text-muted">
                  No hay eventos que coincidan con los filtros aplicados
                </p>
                <button class="btn btn-outline-primary" @click="clearFilters">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                </button>
              </div>
            </div>

            <!-- Paginación -->
            <div v-if="filteredEvents.length > 0" class="table-footer">
              <div class="pagination-controls">
                <nav aria-label="Paginación de eventos">
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
                    Mostrando {{ startItem }}-{{ endItem }} de {{ filteredEvents.length }} eventos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista de Calendario -->
        <div class="calendar-section mt-4">
          <div class="table-card">
            <div class="table-header">
              <div class="table-info">
                <h4 class="table-title">
                  <i class="bi bi-calendar-week me-2"></i>Calendario de Eventos
                </h4>
                <p class="table-subtitle">
                  {{ calendarTitle }} • {{ events.length }} eventos programados
                </p>
              </div>

              <div class="calendar-controls">
                <div class="btn-group me-3">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    :class="{ 'active': calendarView === 'month' }"
                    @click="calendarView = 'month'"
                  >
                    Mes
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    :class="{ 'active': calendarView === 'week' }"
                    @click="calendarView = 'week'"
                  >
                    Semana
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    :class="{ 'active': calendarView === 'day' }"
                    @click="calendarView = 'day'"
                  >
                    Día
                  </button>
                </div>

                <div class="calendar-nav">
                  <button class="btn btn-sm btn-outline-secondary" @click="prevPeriod">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <h6 class="calendar-title mx-3 mb-0">{{ calendarTitle }}</h6>
                  <button class="btn btn-sm btn-outline-secondary" @click="nextPeriod">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>

                <button class="btn btn-sm btn-primary" @click="today">
                  <i class="bi bi-calendar-check me-1"></i>Hoy
                </button>
              </div>
            </div>

            <div class="table-body">
              <!-- Leyenda del calendario -->
              <div class="calendar-legend mb-3">
                <div v-for="tipo in tipos" :key="tipo.value" class="legend-item">
                  <span class="legend-dot" :style="{ background: tipo.color }"></span>
                  <small>{{ tipo.label }}</small>
                </div>
              </div>

              <!-- Grid del calendario -->
              <div class="calendar-grid">
                <div class="calendar-header">
                  <div class="calendar-cell" v-for="day in calendarDays" :key="day">
                    {{ day }}
                  </div>
                </div>

                <div class="calendar-body">
                  <div
                    v-for="week in calendarWeeks"
                    :key="week.number"
                    class="calendar-week"
                  >
                    <div
                      v-for="day in week.days"
                      :key="day.date"
                      class="calendar-day"
                      :class="{
                        'today': day.isToday,
                        'selected': day.isSelected,
                        'other-month': !day.isCurrentMonth
                      }"
                      @click="selectDay(day)"
                    >
                      <div class="day-header">
                        <span class="day-number">{{ day.day }}</span>
                      </div>
                      <div class="day-events">
                        <div
                          v-for="event in day.events"
                          :key="event.id"
                          class="calendar-event"
                          :class="`event-${event.type}`"
                          @click.stop="viewEvent(event)"
                        >
                          <div class="event-chip">
                            <span class="event-dot" :style="{ background: getEventColor(event.type) }"></span>
                            <div class="event-body">
                              <div class="event-time">{{ event.startTime }}</div>
                              <div class="event-title">{{ truncateTitle(event.title) }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="eventToDelete" class="modal-backdrop show" @click="cancelDelete"></div>
    <div v-if="eventToDelete" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-danger me-2"></i>
              Confirmar eliminación
            </h5>
            <button type="button" class="btn-close" @click="cancelDelete"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              Esta acción no se puede deshacer
            </div>

            <div class="event-preview">
              <div class="preview-icon" :style="{ background: getEventColor(eventToDelete.type) }">
                <i :class="getEventIcon(eventToDelete.type)"></i>
              </div>
              <div class="preview-info">
                <h6>{{ eventToDelete.title }}</h6>
                <p class="text-muted mb-1">{{ formatDate(eventToDelete.startDate) }} • {{ eventToDelete.startTime }}</p>
                <p class="mb-0">
                  <span class="badge" :class="getEstadoClass(eventToDelete.status)">
                    {{ getEstadoText(eventToDelete.status) }}
                  </span>
                  <span class="ms-2">{{ eventToDelete.participants?.length || 0 }} inscritos</span>
                </p>
              </div>
            </div>

            <p class="mt-3">
              ¿Estás seguro de que deseas eliminar permanentemente este evento?
              Se perderán todos los datos asociados, incluyendo las inscripciones.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              <i class="bi bi-trash me-1"></i>Sí, eliminar evento
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Evento (importado) -->
    <EventModal
      v-if="showEventModal"
      :event="selectedEvent"
      :mode="modalMode"
      @save="handleSaveEvent"
      @close="closeEventModal"
    />

    <!-- Toast para notificaciones -->
    <BaseToast ref="toastRef" toast-id="adminToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EventModal from '@/views/Administrador/Event/EventModal.vue'

// Tipos
type CalendarView = 'month' | 'week' | 'day'
type EventStatus = 'activo' | 'proximo' | 'completado' | 'cancelado'
type EventType = 'training' | 'maintenance' | 'calibration' | 'meeting' | 'other'
type Modality = 'presencial' | 'virtual' | 'hibrido'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

interface Event {
  id: number
  title: string
  description: string
  type: EventType
  typeLabel: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  status: EventStatus
  statusLabel: string
  location: string
  modality: Modality
  organizer: User
  participants: User[]
  maxParticipants: number
  featured?: boolean
  thumbnailUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Tipo {
  value: EventType
  label: string
  icon: string
  color: string
}

interface Estado {
  value: EventStatus
  label: string
  icon: string
  color: string
}

interface CalendarDay {
  date: string
  day: number
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
  events: Event[]
}

// Router
const router = useRouter()

// Estado del tema
const { currentTheme } = useTheme()

// API base (normalize to include /api by default)
import { API_BASE } from '@/config/api'
import BaseToast from '@/components/UI/BaseToast.vue'
import { useToast, type ToastType } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'

const { toastRef, showToast } = useToast()

// Eventos cargados desde la API
const events = ref<Event[]>([])

const loadEvents = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/events?limit=1000&page=1`)
    if (!res.ok) throw new Error('Error cargando eventos')
    const data = await res.json()
    events.value = data
  } catch (err) {
    console.error('loadEvents error', err)
    showToast('No se pudieron cargar los eventos desde la API', 'error', 'Carga')
  }
}

// Tipos y estados disponibles
const tipos: Tipo[] = [
  { value: 'training', label: 'Capacitación', icon: 'bi bi-mortarboard', color: '#4CAF50' },
  { value: 'maintenance', label: 'Mantenimiento', icon: 'bi bi-tools', color: '#2196F3' },
  { value: 'calibration', label: 'Calibración', icon: 'bi bi-speedometer2', color: '#FF9800' },
  { value: 'meeting', label: 'Reunión', icon: 'bi bi-people', color: '#9C27B0' },
  { value: 'other', label: 'Otro', icon: 'bi bi-calendar-plus', color: '#607D8B' }
]

const estados: Estado[] = [
  { value: 'activo', label: 'Activo', icon: 'bi bi-play-circle', color: 'success' },
  { value: 'proximo', label: 'Próximo', icon: 'bi bi-clock', color: 'warning' },
  { value: 'completado', label: 'Completado', icon: 'bi bi-check-circle', color: 'info' },
  { value: 'cancelado', label: 'Cancelado', icon: 'bi bi-x-circle', color: 'danger' }
]

// Filtros
const searchQuery = ref('')
const selectedTipo = ref<EventType | null>(null)
const selectedEstado = ref<EventStatus | null>(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Estado para modales
const showEventModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const selectedEvent = ref<Event | null>(null)
const eventToDelete = ref<Event | null>(null)

// Estado del calendario
const calendarView = ref<CalendarView>('month')
const currentDate = ref(new Date())

// Toast

// Computed
const totalEvents = computed(() => events.value.length)
const activeEvents = computed(() => events.value.filter(e => e.status === 'activo').length)
const upcomingEvents = computed(() => events.value.filter(e => e.status === 'proximo').length)
const completedEvents = computed(() => events.value.filter(e => e.status === 'completado').length)

const filteredEvents = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return events.value.filter(event => {
    const matchesSearch = !query ||
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query)

    const matchesTipo = !selectedTipo.value || event.type === selectedTipo.value
    const matchesEstado = !selectedEstado.value || event.status === selectedEstado.value

    return matchesSearch && matchesTipo && matchesEstado
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEvents.value.length / itemsPerPage.value))
)

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEvents.value.slice(start, end)
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
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredEvents.value.length)
)

// Calendario
const calendarDays = computed(() => {
  return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
})

const calendarTitle = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }
  return currentDate.value.toLocaleDateString('es-ES', options)
})

const calendarWeeks = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const weeks: { number: number; days: CalendarDay[] }[] = []
  let currentWeek: CalendarDay[] = []
  let weekNumber = 1

  // Ajustar para que la semana empiece en lunes
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

  // Días del mes anterior
  for (let i = startOffset; i > 0; i--) {
    const date = new Date(year, month, -i + 1)
    currentWeek.push(createCalendarDay(date, false))
  }

  // Días del mes actual
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    currentWeek.push(createCalendarDay(date, true))

    if (currentWeek.length === 7) {
      weeks.push({ number: weekNumber++, days: currentWeek })
      currentWeek = []
    }
  }

  // Días del mes siguiente
  const nextMonthDays = 7 - currentWeek.length
  for (let day = 1; day <= nextMonthDays; day++) {
    const date = new Date(year, month + 1, day)
    currentWeek.push(createCalendarDay(date, false))
  }

  if (currentWeek.length > 0) {
    weeks.push({ number: weekNumber, days: currentWeek })
  }

  return weeks
})

// Toast helpers



// Métodos de utilidad
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
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

const truncateTitle = (title: string, maxLength: number = 20): string => {
  if (title.length <= maxLength) return title
  return title.substring(0, maxLength) + '...'
}

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const getInitials = (name: string): string => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(part => part[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const getEventColor = (type: EventType): string => {
  const colorMap: Record<EventType, string> = {
    'training': '#4CAF50',
    'maintenance': '#2196F3',
    'calibration': '#FF9800',
    'meeting': '#9C27B0',
    'other': '#607D8B'
  }
  return colorMap[type] || '#1E9E4A'
}

const getEventIcon = (type: EventType): string => {
  const iconMap: Record<EventType, string> = {
    'training': 'bi bi-mortarboard',
    'maintenance': 'bi bi-tools',
    'calibration': 'bi bi-speedometer2',
    'meeting': 'bi bi-people',
    'other': 'bi bi-calendar-plus'
  }
  return iconMap[type] || 'bi bi-calendar-event'
}

const getModalidadIcon = (modality: Modality): string => {
  const iconMap: Record<Modality, string> = {
    'presencial': 'bi bi-geo-alt',
    'virtual': 'bi bi-laptop',
    'hibrido': 'bi bi-laptop-fill'
  }
  return iconMap[modality] || 'bi bi-question-circle'
}

const getEstadoClass = (status: EventStatus): string => {
  const classMap: Record<EventStatus, string> = {
    'activo': 'estado-activo',
    'proximo': 'estado-proximo',
    'completado': 'estado-completado',
    'cancelado': 'estado-cancelado'
  }
  return classMap[status] || ''
}

const getEstadoText = (status: EventStatus): string => {
  const textMap: Record<EventStatus, string> = {
    'activo': 'Activo',
    'proximo': 'Próximo',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
  }
  return textMap[status] || status
}

const getProgressClass = (ratio: number): string => {
  if (ratio >= 0.9) return 'bg-danger'
  if (ratio >= 0.7) return 'bg-warning'
  return 'bg-success'
}

const getOrganizerColor = (organizer?: User | null): string => {
  const defaultColor = '#607D8B'
  const colors = ['#1E9E4A', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', defaultColor]
  if (!organizer || !organizer.name) return defaultColor
  let hash = 0
  for (let i = 0; i < organizer.name.length; i++) {
    hash = organizer.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const isDateInRange = (start: string, end: string | undefined, dateIso: string): boolean => {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : startDate
  const checkDate = new Date(dateIso)

  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)
  checkDate.setHours(0, 0, 0, 0)

  return checkDate >= startDate && checkDate <= endDate
}

const createCalendarDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const iso = date.toISOString().split('T')[0]

  return {
    date: iso,
    day: date.getDate(),
    isToday,
    isSelected: false,
    isCurrentMonth,
    events: events.value.filter(event => isDateInRange(event.startDate, event.endDate, iso))
  }
}

// Métodos de filtrado
const filterEvents = () => {
  currentPage.value = 1
}

const toggleTipoFilter = (tipo: EventType) => {
  selectedTipo.value = selectedTipo.value === tipo ? null : tipo
  currentPage.value = 1
}

const toggleEstadoFilter = (estado: EventStatus) => {
  selectedEstado.value = selectedEstado.value === estado ? null : estado
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTipo.value = null
  selectedEstado.value = null
  currentPage.value = 1
}

// Paginación
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Métodos de eventos
const viewEvent = (event: Event) => {
  router.push(`/admin/eventos/${event.id}`)
}

const showCreateEventModal = () => {
  selectedEvent.value = null
  modalMode.value = 'create'
  showEventModal.value = true
}

const editEvent = (event: Event) => {
  selectedEvent.value = { ...event }
  modalMode.value = 'edit'
  showEventModal.value = true
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

const handleSaveEvent = async (eventData: any) => {
  try {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    if (modalMode.value === 'create') {
        const body = {
        title: eventData.title,
        description: eventData.description,
        type: eventData.type,
        location: eventData.location,
        startDate: eventData.startDate || null,
        endDate: eventData.endDate || null,
        startTime: eventData.startTime || null,
        endTime: eventData.endTime || null,
        maxParticipants: eventData.maxParticipants || 0,
        notes: eventData.notes || null,
        organizerId: eventData.organizerId || null,
        status: eventData.status || 'proximo',
          modality: eventData.modality || 'virtual',
        featured: eventData.featured || false,
        thumbnailDataUrl: eventData.thumbnailDataUrl || null
      }
      const resp = await fetch(`${API_BASE}/api/events`, { method: 'POST', headers, body: JSON.stringify(body) })
      if (!resp.ok) throw new Error('Error creando evento')
      const created = await resp.json()
      events.value.unshift(created)
      showToast('Evento creado exitosamente', 'success', 'Creación')
    } else {
      const body = {
        title: eventData.title,
        description: eventData.description,
        type: eventData.type,
        location: eventData.location,
        startDate: eventData.startDate || null,
        endDate: eventData.endDate || null,
        startTime: eventData.startTime || null,
        endTime: eventData.endTime || null,
        maxParticipants: eventData.maxParticipants || 0,
        notes: eventData.notes || null,
        status: eventData.status || null,
        modality: eventData.modality || null,
        featured: eventData.featured != null ? eventData.featured : null,
        thumbnailDataUrl: eventData.thumbnailDataUrl || null
      }
      const resp = await fetch(`${API_BASE}/api/events/${eventData.id}`, { method: 'PUT', headers, body: JSON.stringify(body) })
      if (!resp.ok) throw new Error('Error actualizando evento')
      const updated = await resp.json()
      const idx = events.value.findIndex(e => e.id === updated.id)
      if (idx !== -1) events.value[idx] = updated
      showToast('Evento actualizado exitosamente', 'success', 'Actualización')
    }
    closeEventModal()
  } catch (err) {
    console.error('Error al guardar evento:', err)
    showToast('Error al guardar el evento', 'error', 'Error')
  }
}

const deleteEvent = (event: Event) => {
  eventToDelete.value = event
}

const cancelDelete = () => {
  eventToDelete.value = null
}

const confirmDelete = async () => {
  if (!eventToDelete.value) return
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  try {
    const resp = await fetch(`${API_BASE}/api/events/${eventToDelete.value.id}`, { method: 'DELETE', headers })
    if (!resp.ok) throw new Error('Error eliminando evento')
    events.value = events.value.filter(e => e.id !== eventToDelete.value!.id)
    showToast('Evento eliminado exitosamente', 'success', 'Eliminación')
    eventToDelete.value = null
  } catch (err) {
    console.error('confirmDelete error', err)
    showToast('No se pudo eliminar el evento', 'error', 'Error')
  }
}

const toggleFeatured = async (event: Event) => {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  try {
    const resp = await fetch(`${API_BASE}/api/events/${event.id}`, { method: 'PUT', headers, body: JSON.stringify({ featured: !event.featured }) })
    if (!resp.ok) throw new Error('Error actualizando destacado')
    const updated = await resp.json()
    const idx = events.value.findIndex(e => e.id === updated.id)
    if (idx !== -1) events.value[idx] = updated
    showToast(updated.featured ? 'Evento destacado' : 'Evento no destacado', 'success', 'Actualización')
  } catch (err) {
    console.error('toggleFeatured error', err)
    showToast('No se pudo actualizar el estado destacado', 'error', 'Error')
  }
}

const exportEvents = () => {
  const headers = ['ID', 'Título', 'Tipo', 'Fecha', 'Estado', 'Ubicación', 'Inscritos', 'Capacidad']

  const csvData = filteredEvents.value.map(event => [
    event.id,
    event.title,
    event.typeLabel,
    formatDate(event.startDate),
    getEstadoText(event.status),
    event.location,
    event.participants?.length || 0,
    event.maxParticipants
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `eventos-sena-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Archivo CSV generado y descargado', 'success', 'Exportación')
}

// Métodos de calendario
const prevPeriod = () => {
  if (calendarView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  }
}

const nextPeriod = () => {
  if (calendarView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  }
}

const today = () => {
  currentDate.value = new Date()
}

const selectDay = (day: CalendarDay) => {
}

// Toast

onMounted(async () => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  // Cargar eventos desde la API
  await loadEvents()
})
</script>

<style scoped>
.admin-eventos-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-eventos-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */

.stat-icon.active {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.stat-icon.upcoming {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
}

/* Panel de control */

.type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.type-filter-btn {
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

[data-bs-theme="dark"] .type-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray, #6C757D);
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

.status-filters {
  display: flex;
  gap: 0.5rem;
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
  flex: 1;
}

[data-bs-theme="dark"] .status-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray, #6C757D);
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
}

/* Content Section */
.content-section {
  padding: 1rem 0 3rem;
}

/* View Selector */
.view-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  margin-bottom: 1.5rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-toggle-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .view-toggle-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.view-toggle-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.view-toggle-btn.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.calendar-nav {
  display: flex;
  align-items: center;
}

.calendar-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
}

[data-bs-theme="dark"] .calendar-title {
  color: var(--color-dark, #F8F9FA);
}

/* Table Card */
.table-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

.table-body {
  padding: 2rem;
}

/* Event Cards */
.event-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

[data-bs-theme="dark"] .event-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary, #1E9E4A);
}

.card-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.event-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.estado-proximo {
  background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
  color: #333;
}

.estado-completado {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.estado-cancelado {
  background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
  color: white;
}

.featured-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.card-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.meta-item i {
  width: 16px;
  text-align: center;
  color: var(--color-primary, #1E9E4A);
}

.card-stats {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 8px;
}

[data-bs-theme="dark"] .card-stats {
  background: var(--lab-bg, #1a1a1a);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat i {
  font-size: 1.25rem;
  color: var(--color-primary, #1E9E4A);
  margin-bottom: 0.25rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-weight: 700;
  color: var(--color-dark, #212529);
  font-size: 1.1rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.progress-container {
  margin-top: auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
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

.bg-success {
  background: var(--color-success, #28a745);
}

.bg-warning {
  background: var(--color-warning, #ffc107);
}

.bg-danger {
  background: var(--color-danger, #dc3545);
}

.organizer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.avatar-initials {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.organizer-details {
  display: flex;
  flex-direction: column;
}

.organizer-name {
  font-weight: 600;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .organizer-name {
  color: var(--color-dark, #F8F9FA);
}

.organizer-role {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

.card-footer {
  padding: 1rem 1.5rem;
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
  justify-content: flex-end;
}

.footer-actions .btn {
  padding: 0.45rem 0.6rem;
  font-size: 0.92rem;
}

.footer-actions .btn-outline-primary {
  border-color: rgba(16, 24, 40, 0.06);
  color: #0f172a;
}

.footer-actions .btn-outline-danger {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  color: white;
  border: 0;
}

/* Calendar Styles */
.calendar-legend {
  display: flex;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.event-training {
  background: #4CAF50;
}

.event-maintenance {
  background: #2196F3;
}

.event-calibration {
  background: #FF9800;
}

.event-meeting {
  background: #9C27B0;
}

.event-other {
  background: #607D8B;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--lab-bg, #f8f9fa);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .calendar-header {
  background: var(--lab-bg, #1a1a1a);
}

.calendar-cell {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  border-right: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .calendar-cell {
  color: var(--color-gray-dark, #ADB5BD);
}

.calendar-cell:last-child {
  border-right: none;
}

.calendar-body {
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .calendar-body {
  background: var(--card-bg, #2d2d2d);
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.calendar-week:last-child {
  border-bottom: none;
}

.calendar-day {
  min-height: 120px;
  padding: 0.75rem;
  border-right: 1px solid var(--color-gray-light, #E9ECEF);
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

.calendar-day.today {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.1) 0%, rgba(52, 181, 101, 0.05) 100%);
}

.calendar-day.selected {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.2) 0%, rgba(52, 181, 101, 0.1) 100%);
  border: 2px solid var(--color-primary, #1E9E4A);
}

.calendar-day.other-month {
  background: var(--color-lighter, #f8f9fa);
  color: var(--color-gray, #6C757D);
}

[data-bs-theme="dark"] .calendar-day.other-month {
  background: var(--color-lighter, #2d2d2d);
}

.calendar-day:last-child {
  border-right: none;
}

.day-header {
  margin-bottom: 0.5rem;
}

.day-number {
  font-weight: 600;
  color: var(--color-dark, #212529);
  font-size: 1rem;
}

[data-bs-theme="dark"] .day-number {
  color: var(--color-dark, #F8F9FA);
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.calendar-event {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-event:hover {
  transform: translateX(2px);
}

.event-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  opacity: 0.8;
}

.event-body {
  overflow: hidden;
}

.event-time {
  font-size: 0.65rem;
  opacity: 0.9;
}

.event-title {
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

/* Empty State */

/* Table Footer */
.table-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.page-link {
  color: var(--color-primary, #1E9E4A);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  padding: 0.5rem 0.75rem;
  transition: all 0.3s ease;
}

.page-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
}

[data-bs-theme="dark"] .page-link:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

/* Modal */
.modal-backdrop {
  opacity: 0.5;
  z-index: 1040;
}

.modal.show {
  display: block;
  z-index: 1050;
}

.event-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 12px;
  margin: 1rem 0;
}

[data-bs-theme="dark"] .event-preview {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.preview-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
}

.preview-info h6 {
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .preview-info h6 {
  color: var(--color-dark, #F8F9FA);
}

/* Toast */

/* Responsive */

@media (max-width: 992px) {

  .view-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .calendar-controls {
    width: 100%;
    flex-wrap: wrap;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 768px) {

  .filters-grid {
    gap: 1rem;
  }

  .type-filters,
  .status-filters {
    flex-wrap: wrap;
  }

  .calendar-grid {
    font-size: 0.9rem;
  }

  .calendar-day {
    min-height: 80px;
    padding: 0.5rem;
  }

  .calendar-event {
    font-size: 0.7rem;
    padding: 0.15rem 0.3rem;
  }
}

@media (max-width: 576px) {

  .panel-body,
  .table-body,
  .table-footer {
    padding: 1rem;
  }

  .calendar-header {
    display: none;
  }

  .calendar-week {
    grid-template-columns: 1fr;
    border-bottom: none;
  }

  .calendar-day {
    border-right: none;
    border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  }

  .calendar-day:last-child {
    border-bottom: none;
  }
}

/* Animations */
.stat-card,
.panel-card,
.table-card,
.event-card {
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
[data-bs-theme="dark"] .event-card,
[data-bs-theme="dark"] .stat-card {
  background: rgba(24, 24, 26, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
