<template>
  <div :data-bs-theme="currentTheme" class="admin-dashboard">
    <div class="admin-layout">
      <!-- Main Content -->
      <main class="admin-content" :class="{ 'expanded': sidebarCollapsed }">
        <div class="container-fluid py-4">
          <!-- Page Header -->
          <div class="page-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="page-title">Gestión de Eventos</h1>
                <p class="page-subtitle">Administra y organiza todos los eventos del sistema</p>
              </div>
              <button class="btn btn-primary" @click="showCreateEventModal">
                <i class="bi bi-plus-circle me-2"></i>Crear Evento
              </button>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-calendar-check"></i>
                </div>
                <div class="stat-content">
                  <h3>{{ totalEvents }}</h3>
                  <p>Total de Eventos</p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-calendar-plus"></i>
                </div>
                <div class="stat-content">
                  <h3>{{ activeEvents }}</h3>
                  <p>Eventos Activos</p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="stat-card">
                <div class="stat-icon upcoming">
                  <i class="bi bi-calendar-date"></i>
                </div>
                <div class="stat-content">
                  <h3>{{ upcomingEvents }}</h3>
                  <p>Próximos Eventos</p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="stat-card">
                <div class="stat-icon completed">
                  <i class="bi bi-calendar-check-fill"></i>
                </div>
                <div class="stat-content">
                  <h3>{{ completedEvents }}</h3>
                  <p>Eventos Completados</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters and Search -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-search"></i>
                    </span>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="form-control"
                      placeholder="Buscar eventos..."
                      @input="filterEvents"
                    >
                  </div>
                </div>

                <div class="col-md-3">
                  <select v-model="statusFilter" class="form-select" @change="filterEvents">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activos</option>
                    <option value="proximo">Próximos</option>
                    <option value="completado">Completados</option>
                    <option value="cancelado">Cancelados</option>
                  </select>
                </div>

                <div class="col-md-3">
                  <select v-model="typeFilter" class="form-select" @change="filterEvents">
                    <option value="">Todos los tipos</option>
                    <option value="training">Capacitación</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="calibration">Calibración</option>
                    <option value="meeting">Reunión</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Events Table -->
          <div class="card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Lista de Eventos</h5>
                <div class="table-actions">
                  <button class="btn btn-sm btn-outline-secondary" @click="refreshEvents">
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary" @click="exportEvents">
                    <i class="bi bi-download"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="row g-3">
                <div v-if="filteredEvents.length === 0" class="col-12 text-center py-4">
                  <div class="empty-state">
                    <i class="bi bi-calendar-x" style="font-size:48px"></i>
                    <h5>No se encontraron eventos</h5>
                    <p class="text-muted">Intenta con otros filtros o crea un nuevo evento</p>
                  </div>
                </div>

                <div v-for="event in paginatedEvents" :key="event.id" class="col-12 col-md-6 col-lg-4">
                  <div class="card event-card h-100 shadow-sm">
                    <div class="card-ribbon">{{ event.typeLabel }}</div>
                    <div class="image-wrap">
                      <template v-if="event.thumbnailUrl">
                        <img :src="event.thumbnailUrl" class="card-img-top event-thumb" :alt="event.title" />
                      </template>
                      <template v-else>
                        <div class="event-thumb placeholder d-flex align-items-center justify-content-center">Sin imagen</div>
                      </template>

                      <div class="image-overlay p-3 d-flex flex-column justify-content-end">
                        <div class="overlay-title text-truncate">{{ event.title }}</div>
                        <div class="overlay-meta d-flex align-items-center justify-content-between mt-1">
                          <small class="text-white opacity-85">{{ formatDate(event.startDate) }}</small>
                          <div class="d-flex align-items-center">
                            <div class="avatar-sm custom-avatar">{{ getInitials(event.organizer?.name || '') }}</div>
                            <small class="ms-2 text-white organizer-name text-truncate">{{ event.organizer?.name || 'Organizador' }}</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="card-body d-flex flex-column pt-3">
                      <p class="card-text text-truncate mb-2">{{ event.description }}</p>

                      <div class="event-meta mt-2 d-flex flex-wrap gap-2 align-items-center">
                        <span class="badge" :class="`badge-${event.status}`">{{ event.statusLabel }}</span>
                        <span class="badge" :class="`badge-${event.type}`">{{ event.typeLabel }}</span>
                        <small class="text-muted ms-auto">{{ event.modality === 'virtual' ? 'Virtual' : 'Presencial' }}</small>
                      </div>

                        <div class="mt-auto d-flex justify-content-between align-items-center pt-3">
                        <small class="text-muted">{{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}</small>
                        <div class="d-flex gap-2 align-items-center">
                          <button class="action-btn" :title="event.featured ? 'Quitar destaque' : 'Destacar'" @click="toggleFeatured(event)">
                            <i :class="event.featured ? 'bi bi-star-fill text-warning' : 'bi bi-star'"></i>
                          </button>
                          <button class="action-btn" title="Editar" @click="editEvent(event)"><i class="bi bi-pencil"></i></button>
                          <button class="action-btn" title="Ver" @click="viewEvent(event)"><i class="bi bi-eye"></i></button>
                          <button class="action-btn danger" title="Eliminar" @click="deleteEvent(event)"><i class="bi bi-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="text-muted">
                  Mostrando {{ showingFrom }} a {{ showingTo }} de {{ filteredEvents.length }} eventos
                </div>
                <nav>
                  <ul class="pagination mb-0">
                    <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                      <button class="page-link" @click="prevPage">
                        <i class="bi bi-chevron-left"></i>
                      </button>
                    </li>

                    <li
                      v-for="page in totalPages"
                      :key="page"
                      class="page-item"
                      :class="{ 'active': page === currentPage }"
                    >
                      <button class="page-link" @click="goToPage(page)">
                        {{ page }}
                      </button>
                    </li>

                    <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                      <button class="page-link" @click="nextPage">
                        <i class="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <!-- Calendar View -->
          <div class="card mt-4">
            <div class="card-header">
              <h5 class="card-title mb-0">Vista de Calendario</h5>
            </div>
            <div class="card-body">
              <div class="calendar-toolbar mb-3">
                <div class="btn-group">
                  <button class="btn btn-outline-secondary" @click="changeCalendarView('month')">
                    Mes
                  </button>
                  <button class="btn btn-outline-secondary" @click="changeCalendarView('week')">
                    Semana
                  </button>
                  <button class="btn btn-outline-secondary" @click="changeCalendarView('day')">
                    Día
                  </button>
                </div>
                <div class="calendar-nav">
                  <button class="btn btn-outline-secondary" @click="prevPeriod">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <h6 class="calendar-title mx-3 mb-0">{{ calendarTitle }}</h6>
                  <button class="btn btn-outline-secondary" @click="nextPeriod">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <div class="calendar-legend d-flex align-items-center gap-2">
                    <div class="legend-item d-flex align-items-center gap-2">
                      <span class="legend-dot event-training"></span>
                      <small>Capacitación</small>
                    </div>
                    <div class="legend-item d-flex align-items-center gap-2">
                      <span class="legend-dot event-maintenance"></span>
                      <small>Mantenimiento</small>
                    </div>
                    <div class="legend-item d-flex align-items-center gap-2">
                      <span class="legend-dot event-meeting"></span>
                      <small>Reunión</small>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-today" @click="today">Hoy</button>
                </div>
              </div>

              <div class="calendar-view">
                <!-- Calendar Grid -->
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
                          <small class="day-label">{{ day.label }}</small>
                        </div>
                        <div class="day-events">
                          <div
                            v-for="event in day.events"
                            :key="event.id"
                            class="calendar-event"
                            :class="`event-${event.type}`"
                            @click.stop="viewEvent(event)"
                          >
                            <div class="event-chip d-flex align-items-center">
                              <span class="event-dot"></span>
                              <div class="event-body">
                                <div class="event-time">{{ event.time }}</div>
                                <div class="event-title text-truncate">{{ event.title }}</div>
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
    </div>

    <!-- Event Modal -->
    <EventModal
      v-if="showEventModal"
      :event="selectedEvent"
      :mode="modalMode"
      @save="handleSaveEvent"
      @close="closeEventModal"
    />

    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import EventModal from '@/views/Administrador/Event/EventModal.vue'
import SideNavbar from '@/components/SideBar/SideNavbar.vue'
import AppSidebar from '@/components/SideBar/sidebar.vue'
import useUiStore from '@/compasable/useUiStore'

const API_BASE = (import.meta.env?.VITE_API_BASE as string) || 'http://localhost:3000'

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

// Types
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
  type: string
  typeLabel: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  status: string
  statusLabel: string
  location: string
  organizer: User
  participants: User[]
  maxParticipants: number
  featured?: boolean
  thumbnailUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface CalendarDay {
  date: string
  day: number
  label: string
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
  events: Event[]
}

interface Notification {
  id: number
  type: string
  message: string
  time: string
  read: boolean
  icon: string
}

// Router
const router = useRouter()

// State
const ui = useUiStore()
const currentTheme = ref<'light' | 'dark'>(ui.state.theme as 'light' | 'dark')
const sidebarCollapsed = computed(() => ui.state.sidebarCollapsed)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const selectedEvents = ref<number[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = 10
const showEventModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const selectedEvent = ref<Event | null>(null)
const calendarView = ref<'month' | 'week' | 'day'>('month')
const currentDate = ref(new Date())

// Mock Data
const currentUser = reactive<User>({
  id: 1,
  name: 'Admin SENA',
  email: 'admin@sena.com',
  role: 'Administrador'
})

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'event',
    message: 'Nuevo evento de calibración programado',
    time: 'Hace 5 minutos',
    read: false,
    icon: 'bi-calendar-plus'
  },
  {
    id: 2,
    type: 'user',
    message: 'Nuevo usuario registrado: Juan Pérez',
    time: 'Hace 1 hora',
    read: false,
    icon: 'bi-person-plus'
  },
  {
    id: 3,
    type: 'system',
    message: 'Actualización del sistema completada',
    time: 'Hace 3 horas',
    read: true,
    icon: 'bi-gear'
  }
])

const events = ref<Event[]>([])

// Computed
const userInitials = computed(() => {
  return currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const totalEvents = computed(() => events.value.length)
const activeEvents = computed(() => events.value.filter(e => e.status === 'activo').length)
const upcomingEvents = computed(() => events.value.filter(e => e.status === 'proximo').length)
const completedEvents = computed(() => events.value.filter(e => e.status === 'completado').length)
const totalUsers = computed(() => 42) // Mock

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = searchQuery.value === '' ||
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = statusFilter.value === '' || event.status === statusFilter.value
    const matchesType = typeFilter.value === '' || event.type === typeFilter.value

    return matchesSearch && matchesStatus && matchesType
  })
})

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredEvents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / pageSize)
})

const showingFrom = computed(() => {
  return (currentPage.value - 1) * pageSize + 1
})

const showingTo = computed(() => {
  const end = currentPage.value * pageSize
  return end > filteredEvents.value.length ? filteredEvents.value.length : end
})

const systemStatus = computed(() => 'online')

const calendarTitle = computed(() => {
  const options = { month: 'long', year: 'numeric' }
  return currentDate.value.toLocaleDateString('es-ES', options as any)
})

const calendarDays = computed(() => {
  return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
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

// Methods
const isDateInRange = (start: string | undefined, end: string | undefined, dateIso: string) => {
  if (!start) return false
  const parseDateLocal = (v?: string | undefined) => {
    if (!v) return null
    // if YYYY-MM-DD, construct local date to avoid TZ shift
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    const dt = new Date(v)
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds())
  }

  const s = parseDateLocal(start) as Date | null
  const e = parseDateLocal(end) as Date | null || s
  const d = parseDateLocal(dateIso) as Date | null
  if (!s || !d) return false
  s.setHours(0,0,0,0)
  e.setHours(23,59,59,999)
  // compare
  return d.getTime() >= s.getTime() && d.getTime() <= e.getTime()
}

const formatDateIsoFromDate = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const createCalendarDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const iso = formatDateIsoFromDate(date)

  return {
    date: iso,
    day: date.getDate(),
    label: calendarDays.value[date.getDay()],
    isToday,
    isSelected: false,
    isCurrentMonth,
    events: events.value.filter(event => isDateInRange(event.startDate, event.endDate, iso))
  }
}

const toggleSidebar = () => {
  ui.toggleSidebar()
}

const toggleTheme = () => {
  ui.toggleTheme()
  currentTheme.value = ui.state.theme as 'light' | 'dark'
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const logout = () => {
  localStorage.removeItem('auth_token')
  router.push('/login')
}

const filterEvents = () => {
  currentPage.value = 1
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedEvents.value = paginatedEvents.value.map(e => e.id)
  } else {
    selectedEvents.value = []
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const refreshEvents = async () => {
  await fetchEvents()
}

const exportEvents = () => {
  // Lógica para exportar eventos
  console.log('Exportando eventos...')
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

const viewEvent = (event: Event) => {
  router.push(`/admin/events/${event.id}`)
}

const deleteEvent = async (event: Event) => {
  if (!confirm(`¿Estás seguro de eliminar el evento "${event.title}"?`)) return
  try {
    const token = getAuthToken()
    const headers: Record<string,string> = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/events/${event.id}`, { method: 'DELETE', headers })
    if (!res.ok) throw new Error('Error eliminando evento')
    events.value = events.value.filter(e => e.id !== event.id)
  } catch (err) {
    console.error('deleteEvent error', err)
    alert('No se pudo eliminar el evento')
  }
}

const toggleFeatured = async (event: Event) => {
  try {
    const token = getAuthToken()
    const headers: Record<string,string> = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    const payload = { featured: !event.featured }
    const res = await fetch(`${API_BASE}/api/events/${event.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
    const body = await res.text()
    let json: any = null
    try { json = JSON.parse(body) } catch (e) { /* not json */ }
    if (!res.ok) {
      console.error('Toggle featured failed', res.status, json || body)
      throw new Error((json && json.message) ? json.message : `Error actualizando evento (${res.status})`)
    }
    const updated = json || null
    if (updated && updated.id) {
      events.value = events.value.map(e => e.id === updated.id ? updated : e)
    } else {
      // server returned no JSON; apply optimistic toggle locally
      events.value = events.value.map(e => e.id === event.id ? { ...e, featured: !e.featured } : e)
    }
  } catch (err) {
    console.error('toggleFeatured error', err)
    alert('No se pudo actualizar el destaque del evento')
  }
}

const handleSaveEvent = async (eventData: any) => {
  // Build payload. For edits, only include changed fields so backend COALESCE keeps unchanged values.
  let payload: any = {}
  if (modalMode.value === 'create') {
    payload = {
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      location: eventData.location,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      maxParticipants: eventData.maxParticipants,
      notes: eventData.notes,
      status: eventData.status || 'proximo',
      modality: eventData.modality || 'presencial'
    }
    if (eventData.thumbnailDataUrl) payload.thumbnailDataUrl = eventData.thumbnailDataUrl
  } else {
    // edit: send only changed fields compared to selectedEvent
    const original = selectedEvent.value || {}
    const keys = ['title','description','type','location','startDate','endDate','startTime','endTime','maxParticipants','notes','status','modality']
    keys.forEach(k => {
      const newVal = (eventData as any)[k]
      const oldVal = (original as any)[k]
      // treat undefined and empty strings: if different, include; otherwise skip
      if (newVal !== oldVal) {
        // avoid sending empty location for virtual events
        if (k === 'location' && eventData.modality === 'virtual') return
        (payload as any)[k] = newVal
      }
    })
    if (eventData.thumbnailDataUrl && eventData.thumbnailDataUrl !== original.thumbnailUrl) payload.thumbnailDataUrl = eventData.thumbnailDataUrl
  }

  const token = getAuthToken()
  const headers: Record<string,string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    if (modalMode.value === 'create') {
      console.debug('Creating event payload:', payload)
      const res = await fetch(`${API_BASE}/api/events`, { method: 'POST', headers, body: JSON.stringify(payload) })
      const body = await res.text()
      let json: any = null
      try { json = JSON.parse(body) } catch (e) { /* not json */ }
      if (!res.ok) {
        console.error('Create event failed', res.status, json || body)
        throw new Error((json && json.message) ? json.message : `Error creando evento (${res.status})`)
      }
      const created = json || {}
      events.value.unshift(created)
    } else if (modalMode.value === 'edit' && eventData.id) {
      console.debug('Updating event payload:', payload)
      const res = await fetch(`${API_BASE}/api/events/${eventData.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
      const body = await res.text()
      let json: any = null
      try { json = JSON.parse(body) } catch (e) { /* not json */ }
      if (!res.ok) {
        console.error('Update event failed', res.status, json || body)
        throw new Error((json && json.message) ? json.message : `Error actualizando evento (${res.status})`)
      }
      const updated = json || {}
      events.value = events.value.map(e => e.id === updated.id ? updated : e)
    }
    closeEventModal()
  } catch (err) {
    console.error('handleSaveEvent error', err)
    alert('No se pudo guardar el evento')
  }
}

const fetchEvents = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/events`)
    if (!res.ok) throw new Error('Error cargando eventos')
    const data = await res.json()
    events.value = data.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      type: r.type,
      // Force Spanish label based on `type` (ignore server-provided label)
      typeLabel: getTypeLabel(r.type),
      startDate: r.startDate,
      endDate: r.endDate,
      startTime: r.startTime,
      endTime: r.endTime,
      status: r.status,
      // Force Spanish label based on `status` (ignore server-provided label)
      statusLabel: getStatusLabel(r.status),
      location: r.location,
      organizer: r.organizer,
      participants: r.participants || [],
      maxParticipants: r.maxParticipants,
      notes: r.notes,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      featured: !!r.featured,
      modality: r.modality || r.modality,
        thumbnailUrl: r.thumbnailUrl || r.thumbnailUrl
    }))
  } catch (err) {
    console.error('fetchEvents error', err)
  }
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  // parse local to avoid timezone shifting (YYYY-MM-DD)
  const m = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  let d: Date
  if (m) d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  else d = new Date(dateString)
  return d.toLocaleDateString('es-ES')
}

const formatTime = (timeString: string) => {
  return timeString
}

// Label mappings (mostrar en español)
const typeLabelsMap: Record<string,string> = {
  training: 'Capacitación',
  maintenance: 'Mantenimiento',
  calibration: 'Calibración',
  meeting: 'Reunión',
  other: 'Otro'
}

const statusLabelsMap: Record<string,string> = {
  activo: 'Activo',
  proximo: 'Próximo',
  completado: 'Completado',
  cancelado: 'Cancelado'
}

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

const getTypeLabel = (type: string) => {
  if (!type) return ''
  return typeLabelsMap[type] || capitalize(type)
}

const getStatusLabel = (status: string) => {
  if (!status) return ''
  return statusLabelsMap[status] || capitalize(status)
}

const getInitials = (name: string) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(n => n[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const changeCalendarView = (view: 'month' | 'week' | 'day') => {
  calendarView.value = view
}

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
  // Implementar selección de día
  console.log('Día seleccionado:', day.date)
}

const showCreateUserModal = () => {
  console.log('Mostrar modal de creación de usuario')
}

const exportData = () => {
  console.log('Exportar datos del sistema')
}

// Lifecycle
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
  if (savedTheme) {
    currentTheme.value = savedTheme
    document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  }
  // Load events from API
  fetchEvents()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--lab-bg, #f5f7fa);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .admin-dashboard {
  background: var(--lab-bg, #121212);
}

/* Header Styles */
.admin-header {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #e9ecef);
  position: sticky;
  top: 0;
  z-index: 1030;
  box-shadow: 0 2px 10px var(--shadow-color, rgba(0, 0, 0, 0.05));
}

[data-bs-theme="dark"] .admin-header {
  background: var(--color-light, #1a1a1a);
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.sidebar-toggle {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #e9ecef);
  background: var(--color-light, white);
  color: var(--color-dark, #495057);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(167,183,41,0.08) 0%, rgba(167,183,41,0.04) 100%));
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #e9ecef);
  background: var(--color-light, white);
  color: var(--color-dark, #495057);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .btn-icon {
  background: var(--color-light, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #f8f9fa);
}

.btn-icon:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  color: white;
  font-size: 0.7rem;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.notification-dropdown {
  min-width: 320px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-light, #e9ecef);
  transition: all 0.3s ease;
}

.notification-item.unread {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

.notification-item:hover {
  background: var(--color-lighter, #f8f9fa);
}

[data-bs-theme="dark"] .notification-item:hover {
  background: var(--color-lighter, #2d2d2d);
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: 1px solid var(--color-gray-light, #e9ecef);
  border-radius: 10px;
  background: var(--color-light, white);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .user-avatar {
  background: var(--color-light, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.user-avatar:hover {
  border-color: var(--color-primary, #1E9E4A);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
}

.avatar-initials {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 600;
  color: var(--color-dark, #495057);
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .user-name {
  color: var(--color-dark, #f8f9fa);
}

.user-role {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

/* Sidebar Styles */
.admin-layout {
  display: flex;
  min-height: calc(100vh - 72px);
}

.admin-sidebar {
  width: 250px;
  background: var(--color-light, white);
  border-right: 1px solid var(--color-gray-light, #e9ecef);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

[data-bs-theme="dark"] .admin-sidebar {
  background: var(--color-light, #1a1a1a);
  border-right: 1px solid var(--color-gray-light, #2d2d2d);
}

.admin-sidebar.collapsed {
  width: 70px;
}

.admin-sidebar.collapsed .sidebar-nav span:not(.badge),
.admin-sidebar.collapsed .sidebar-header h6,
.admin-sidebar.collapsed .quick-actions .btn span,
.admin-sidebar.collapsed .sidebar-footer small {
  display: none;
}

.admin-sidebar.collapsed .sidebar-nav .badge {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.6rem;
  padding: 0.15rem 0.3rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.sidebar-header {
  padding: 1rem 1.5rem 0.5rem;
}

.sidebar-header h6 {
  color: var(--color-gray, #6C757D);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: var(--color-gray-dark, #495057);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

[data-bs-theme="dark"] .nav-link {
  color: var(--color-gray-dark, #adb5bd);
}

.nav-link i {
  color: var(--color-gray, #6C757D);
  font-size: 1.1rem;
  min-width: 24px;
}

.nav-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #1E9E4A);
}

.nav-link:hover i {
  color: var(--color-primary, #1E9E4A);
}

.nav-link.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  color: white;
  border-right: 3px solid #FFD700;
}

.nav-link.active i {
  color: white;
}

.nav-link.active .badge {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.sidebar-divider {
  height: 1px;
  background: var(--color-gray-light, #e9ecef);
  margin: 1rem 1.5rem;
}

.quick-actions {
  padding: 0 1.5rem 1rem;
}

.quick-actions .btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-gray-light, #e9ecef);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #28a745;
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
}

.status-indicator.offline {
  background: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

/* Main Content */
.admin-content {
  flex: 1;
  transition: all 0.3s ease;
  /* layout shifts are controlled globally via CSS variables set in App.vue
     and the #app-view margin; individual views should not re-adjust the
     horizontal offset. Keep zero margin here so the global margin applies. */
  margin-left: 0;
}

.admin-content.expanded {
  /* keep same layout when sidebar toggles; App.vue updates --app-left-margin */
  margin-left: 0;
}

.page-header {
  background: var(--color-light, white);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #e9ecef);
}

[data-bs-theme="dark"] .page-header {
  background: var(--color-light, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .page-title {
  color: var(--color-dark, #f8f9fa);
}

.page-subtitle {
  color: var(--color-gray, #6C757D);
  margin: 0;
}

/* Stat Cards */
.stat-card {
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #e9ecef);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .stat-card {
  background: var(--color-light, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.active {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.stat-icon.upcoming {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #9C27B0 0%, #673AB7 100%);
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin: 0;
  line-height: 1;
}

[data-bs-theme="dark"] .stat-content h3 {
  color: var(--color-dark, #f8f9fa);
}

.stat-content p {
  color: var(--color-gray, #6C757D);
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
}

/* Table Styles */
.table-actions {
  display: flex;
  gap: 0.5rem;
}

.table th {
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  border-bottom: 2px solid var(--color-gray-light, #e9ecef);
  white-space: nowrap;
}

.table td {
  vertical-align: middle;
  border-color: var(--color-gray-light, #e9ecef);
}

.event-info {
  max-width: 300px;
}

.date-info {
  white-space: nowrap;
}

.badge {
  font-weight: 500;
  padding: 0.35rem 0.75rem;
}

.badge-training {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
}

.badge-maintenance {
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
  color: white;
}

.badge-calibration {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
  color: white;
}

.badge-meeting {
  background: linear-gradient(135deg, #9C27B0 0%, #673AB7 100%);
  color: white;
}

.badge-other {
  background: linear-gradient(135deg, #607D8B 0%, #78909C 100%);
  color: white;
}

.badge-active {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
}

.badge-upcoming {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
  color: white;
}

.badge-completed {
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
  color: white;
}

.badge-cancelled {
  background: linear-gradient(135deg, #F44336 0%, #EF5350 100%);
  color: white;
}

.avatar-group {
  display: flex;
}

.avatar-sm {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  border: 2px solid var(--color-light, white);
}

[data-bs-theme="dark"] .avatar-sm {
  border-color: var(--color-light, #1a1a1a);
}

.avatar-sm:first-child {
  margin-left: 0;
}

.avatar-more {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-gray-light, #e9ecef);
  color: var(--color-gray, #6C757D);
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  border: 2px solid var(--color-light, white);
}

[data-bs-theme="dark"] .avatar-more {
  background: var(--color-gray-light, #2d2d2d);
  border-color: var(--color-light, #1a1a1a);
  color: var(--color-gray-dark, #adb5bd);
}

.empty-state {
  padding: 2rem;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  color: var(--color-gray-light, #dee2e6);
  margin-bottom: 1rem;
}

.empty-state h5 {
  color: var(--color-gray-dark, #495057);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .empty-state h5 {
  color: var(--color-gray-dark, #adb5bd);
}

/* Calendar Styles */
.calendar-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
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
  color: var(--color-dark, #f8f9fa);
}

.calendar-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray-light, #e9ecef);
  border-radius: 8px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--color-lighter, #f8f9fa);
  border-bottom: 1px solid var(--color-gray-light, #e9ecef);
}

[data-bs-theme="dark"] .calendar-header {
  background: var(--color-lighter, #2d2d2d);
}

.calendar-cell {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  border-right: 1px solid var(--color-gray-light, #e9ecef);
}

[data-bs-theme="dark"] .calendar-cell {
  color: var(--color-gray-dark, #adb5bd);
}

.calendar-cell:last-child {
  border-right: none;
}

.calendar-body {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .calendar-body {
  background: var(--color-light, #1a1a1a);
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--color-gray-light, #e9ecef);
}

.calendar-week:last-child {
  border-bottom: none;
}

.calendar-day {
  min-height: 120px;
  padding: 0.75rem;
  border-right: 1px solid var(--color-gray-light, #e9ecef);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
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
  color: var(--color-gray, #6C757D);
}

.calendar-day:last-child {
  border-right: none;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.day-number {
  font-weight: 600;
  color: var(--color-dark, #212529);
  font-size: 1.1rem;
}

[data-bs-theme="dark"] .day-number {
  color: var(--color-dark, #f8f9fa);
}

.day-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.8rem;
}

.calendar-event {
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: white;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.calendar-event:hover {
  transform: translateX(5px);
}

.event-training {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.event-maintenance {
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
}

.event-calibration {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
}

.event-meeting {
  background: linear-gradient(135deg, #9C27B0 0%, #673AB7 100%);
}

.event-other {
  background: linear-gradient(135deg, #607D8B 0%, #78909C 100%);
}

/* Calendar visual improvements */
.calendar-legend { gap: 12px; }
.legend-item small { font-size: 0.8rem; color: var(--color-gray, #6C757D); }
.legend-dot { width: 12px; height: 12px; border-radius: 4px; display: inline-block; margin-right: 6px; }
.calendar-legend .event-training { box-shadow: inset 0 0 0 4px rgba(0,0,0,0.08); }

.calendar-day { background: transparent; border-radius: 8px; transition: background 180ms ease, transform 180ms ease; }
.calendar-day:hover { background: rgba(30,158,74,0.03); transform: translateY(-2px); }

.calendar-event { margin-bottom: 6px; padding: 4px; border-radius: 8px; color: white; cursor: pointer; display: block; }
.calendar-event .event-chip { gap: 8px; }
.event-chip { padding: 6px 8px; background: rgba(0,0,0,0.06); border-radius: 8px; display: flex; align-items: center; }
.event-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; flex-shrink: 0; }
.event-time { font-size: 0.72rem; color: rgba(0,0,0,0.6); }
.event-title { font-size: 0.78rem; font-weight: 600; color: rgba(0,0,0,0.85); max-width: 140px; }

.calendar-event.event-training .event-dot { background: linear-gradient(135deg,#4CAF50 0%,#8BC34A 100%); }
.calendar-event.event-maintenance .event-dot { background: linear-gradient(135deg,#2196F3 0%,#03A9F4 100%); }
.calendar-event.event-calibration .event-dot { background: linear-gradient(135deg,#FF9800 0%,#FFC107 100%); }
.calendar-event.event-meeting .event-dot { background: linear-gradient(135deg,#9C27B0 0%,#673AB7 100%); }
.calendar-event.event-other .event-dot { background: linear-gradient(135deg,#607D8B 0%,#78909C 100%); }

/* Primary button gradient */
.btn-primary {
  background: linear-gradient(135deg,var(--color-primary) 0%,var(--color-primary) 100%);
  border: none;
  box-shadow: 0 6px 18px rgba(167,183,41,0.12);
}
.btn-primary.btn-today { padding: 0.5rem 0.9rem; }

/* Page header refinement */
.page-header { background: linear-gradient(180deg,#ffffff 0%, #f6fbf7 100%); border: none; box-shadow: 0 6px 20px rgba(16,24,40,0.04); }
.page-subtitle { color: #6b7280; }

@media (max-width: 768px) {
  .event-title { max-width: 110px; }
}

/* Responsive */
@media (max-width: 1199px) {
  .admin-sidebar {
    width: 70px;
  }

  .admin-sidebar:not(.collapsed) {
    width: 250px;
    position: fixed;
    height: calc(100vh - 72px);
    z-index: 1020;
    box-shadow: 3px 0 15px rgba(0, 0, 0, 0.1);
  }

  .admin-content.expanded {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .admin-header .container-fluid {
    padding: 0 1rem;
  }

  .user-info {
    display: none;
  }

  .calendar-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .calendar-nav {
    order: -1;
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
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
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
    border-bottom: 1px solid var(--color-gray-light, #e9ecef);
  }

  .calendar-day:last-child {
    border-bottom: none;
  }
}

/* Event card styles */
.event-card {
  border-radius: 12px;
  overflow: hidden;
}
.event-thumb {
  height: 180px;
  object-fit: cover;
  width: 100%;
}
.event-thumb.placeholder {
  height: 180px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  color: #6c757d;
}

/* Ribbon */
.card-ribbon {
  position: absolute;
  left: 12px;
  top: 12px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 6px 10px;
  font-size: 0.75rem;
  border-radius: 999px;
  font-weight: 700;
  text-transform: capitalize;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  z-index: 5;
}

/* Pagination tweaks */
.pagination .page-item .page-link { border-radius: 8px; margin: 0 4px; min-width: 40px; }
.pagination .page-item.active .page-link { background: linear-gradient(135deg,var(--color-primary) 0%,var(--color-primary) 100%); color: white; border: none; }

/* Calendar cell polish */
.calendar-day { padding: 0.75rem; border-radius: 10px; }
.calendar-day .day-header { margin-bottom: 0.5rem; }
.calendar-body { padding: 12px; }

/* Visual Improvements */
.event-card {
  transition: transform 220ms ease, box-shadow 220ms ease;
  border: none;
}
.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(16,24,40,0.12);
}
.image-wrap { position: relative; overflow: hidden; }
.image-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
  color: white;
}
.overlay-title {
  font-weight: 700;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.overlay-meta small { color: rgba(255,255,255,0.9); }
.custom-avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  border: 2px solid rgba(255,255,255,0.12);
  font-size: 0.8rem;
}
.organizer-name { max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(33,37,41,0.08);
  background: white;
  color: #343a40;
  transition: all 140ms ease;
}
.action-btn i { font-size: 0.95rem; }
.action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(16,24,40,0.08); }
.action-btn.danger { background: linear-gradient(135deg,#ff6b6b 0%,#ff8e53 100%); color: white; border: none; }

/* Tweak badges for more contrast */
.badge { padding: 0.35rem 0.7rem; border-radius: 999px; font-size: 0.8rem; }
.badge-active { background: linear-gradient(135deg,var(--color-primary) 0%,var(--color-primary) 100%); }
.badge-upcoming { background: linear-gradient(135deg,#ffb020 0%,#ff7a18 100%); }
.badge-completed { background: linear-gradient(135deg,#3b82f6 0%,#2563eb 100%); }
.badge-cancelled { background: linear-gradient(135deg,#ff595e 0%,#ff3b30 100%); }

@media (max-width: 768px) {
  .event-thumb { height: 150px; }
  .organizer-name { display: none; }
}
</style>
