<template>
  <div :data-bs-theme="currentTheme" class="eventos-page">

    <!-- Hero Section -->
    <section class="events-hero">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row align-items-center min-vh-60">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Eventos y Capacitaciones</h1>
              <p class="hero-subtitle">
                Participa en nuestros eventos especializados, webinars y capacitaciones
                para mantenerte actualizado en las últimas tendencias de análisis y metrología.
              </p>
              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ upcomingEvents.length }}</span>
                  <span class="stat-label">Próximos eventos</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ totalParticipants }}+</span>
                  <span class="stat-label">Participantes</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ speakers.length }}</span>
                  <span class="stat-label">Expertos</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-highlights">
              <div class="highlight-card">
                <i class="bi bi-calendar-check"></i>
                <div>
                  <h5>Calendario Completo</h5>
                  <p>Consulta todas nuestras actividades programadas</p>
                </div>
              </div>
              <div class="highlight-card">
                <i class="bi bi-camera-reels"></i>
                <div>
                  <h5>Modalidad Híbrida</h5>
                  <p>Presencial y virtual para tu conveniencia</p>
                </div>
              </div>
              <div class="highlight-card">
                <i class="bi bi-award"></i>
                <div>
                  <h5>Certificación</h5>
                  <p>Constancias con valor curricular</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filtros -->
    <section class="filters-section py-4">
      <div class="container">
        <div class="filters-container">
          <div class="row g-3 align-items-center">
            <div class="col-md-6 col-lg-3">
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-funnel"></i>
                  Filtrar por categoría
                </label>
                <select v-model="filters.category" class="form-select filter-select" @change="applyFilters">
                  <option value="all">Todas las categorías</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="col-md-6 col-lg-3">
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-calendar"></i>
                  Filtrar por fecha
                </label>
                <select v-model="filters.date" class="form-select filter-select" @change="applyFilters">
                  <option value="all">Todas las fechas</option>
                  <option value="upcoming">Próximos eventos</option>
                  <option value="past">Eventos pasados</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                </select>
              </div>
            </div>

            <div class="col-md-6 col-lg-3">
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-geo-alt"></i>
                  Modalidad
                </label>
                <select v-model="filters.modality" class="form-select filter-select" @change="applyFilters">
                  <option value="all">Todas las modalidades</option>
                  <option value="presential">Presencial</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </div>
            </div>

            <div class="col-md-6 col-lg-3">
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-sort-down"></i>
                  Ordenar por
                </label>
                <select v-model="filters.sort" class="form-select filter-select" @change="applyFilters">
                  <option value="date_asc">Fecha (próximos primero)</option>
                  <option value="date_desc">Fecha (recientes primero)</option>
                  <option value="name_asc">Nombre (A-Z)</option>
                  <option value="name_desc">Nombre (Z-A)</option>
                  <option value="price_asc">Precio (menor a mayor)</option>
                  <option value="price_desc">Precio (mayor a menor)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-12">
              <div class="search-container">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    v-model="filters.search"
                    type="text"
                    class="form-control"
                    placeholder="Buscar eventos por nombre, descripción o ponente..."
                    @input="debouncedSearch"
                  >
                  <button class="btn btn-outline-secondary" type="button" @click="clearFilters">
                    <i class="bi bi-x-circle"></i> Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid de Eventos -->
    <section class="events-grid-section py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title mb-0" data-aos="fade-up">
            {{ filteredEvents.length }} Eventos Encontrados
          </h2>
          <div class="view-options" data-aos="fade-up">
            <button
              class="btn btn-outline-primary btn-sm"
              :class="{ 'active': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="bi bi-grid"></i>
            </button>
            <button
              class="btn btn-outline-primary btn-sm"
              :class="{ 'active': viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="bi bi-list"></i>
            </button>
          </div>
        </div>

        <!-- Vista de Grid -->
        <div v-if="viewMode === 'grid'" class="row g-4">
          <div
            v-for="event in filteredEvents"
            :key="event.id"
            class="col-xl-4 col-lg-6"
            :data-aos="'fade-up'"
          >
            <EventCard
              :event="event"
              :current-theme="currentTheme"
              @register="openRegistrationModal"
              @view-details="viewEventDetails"
            />
          </div>
        </div>

        <!-- Vista de Lista -->
        <div v-else class="events-list">
          <div
            v-for="event in filteredEvents"
            :key="event.id"
            class="event-list-item"
            :data-aos="'fade-up'"
          >
            <EventListItem
              :event="event"
              :current-theme="currentTheme"
              @register="openRegistrationModal"
              @view-details="viewEventDetails"
            />
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="paginatedEvents.length > 0" class="mt-5">
          <nav aria-label="Paginación de eventos">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <button class="page-link" @click="prevPage">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>

              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ 'active': currentPage === page }"
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

        <!-- Sin resultados -->
        <div v-if="filteredEvents.length === 0" class="no-results text-center py-5" data-aos="fade-up">
          <div class="no-results-icon">
            <i class="bi bi-calendar-x"></i>
          </div>
          <h3 class="mt-4 mb-3">No se encontraron eventos</h3>
          <p class="text-muted mb-4">
            No hay eventos que coincidan con tu búsqueda. Intenta con otros filtros o
            <a href="#" @click.prevent="clearFilters" class="text-primary">limpiar todos los filtros</a>.
          </p>
          <button class="btn btn-primary" @click="clearFilters">
            <i class="bi bi-arrow-clockwise me-2"></i>Ver todos los eventos
          </button>
        </div>
      </div>
    </section>

    <!-- Eventos Destacados -->
    <section class="featured-events-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Eventos Destacados</h2>
          <p class="section-subtitle">No te pierdas nuestros eventos más importantes del mes</p>
        </div>

        <div class="row g-4">
          <div
            v-for="event in featuredEvents"
            :key="event.id"
            class="col-lg-4"
            :data-aos="'fade-up'"
          >
            <FeaturedEventCard
              :event="event"
              :current-theme="currentTheme"
              @register="openRegistrationModal"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Newsletter
    <section class="newsletter-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center" data-aos="fade-up">
            <div class="newsletter-card">
              <div class="newsletter-icon">
                <i class="bi bi-envelope-paper-heart"></i>
              </div>
              <h2 class="newsletter-title">Recibe nuestras novedades</h2>
              <p class="newsletter-subtitle">
                Suscríbete a nuestro newsletter y sé el primero en enterarte de nuevos eventos,
                capacitaciones y promociones especiales.
              </p>

              <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
                <div class="input-group">
                  <input
                    v-model="newsletterEmail"
                    type="email"
                    class="form-control"
                    placeholder="Ingresa tu correo electrónico"
                    required
                  >
                  <button class="btn btn-primary" type="submit" :disabled="isSubscribing">
                    <template v-if="isSubscribing">
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Suscribiendo...
                    </template>
                    <template v-else>
                      Suscribirme
                    </template>
                  </button>
                </div>
                <div class="form-check mt-3">
                  <input
                    v-model="newsletterConsent"
                    type="checkbox"
                    class="form-check-input"
                    id="newsletterConsent"
                    required
                  >
                  <label for="newsletterConsent" class="form-check-label small">
                    Acepto recibir información sobre eventos y promociones. Puedo cancelar mi suscripción en cualquier momento.
                  </label>
                </div>
              </form>

              <div class="newsletter-stats mt-4">
                <div class="stat">
                  <span class="stat-number">2,500+</span>
                  <span class="stat-label">Suscriptores</span>
                </div>
                <div class="stat">
                  <span class="stat-number">98%</span>
                  <span class="stat-label">Satisfacción</span>
                </div>
                <div class="stat">
                  <span class="stat-number">0 Spam</span>
                  <span class="stat-label">Garantizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>-->

    <!-- Footer -->
    <FooterComponent :current-theme="currentTheme" />

    <!-- Modal de Registro -->
    <div
      class="modal fade"
      id="registrationModal"
      tabindex="-1"
      aria-hidden="true"
      ref="registrationModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Inscripción a Evento</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <EventRegistrationForm
              v-if="selectedEvent"
              :event="selectedEvent"
              @submit="handleRegistration"
              @cancel="closeRegistrationModal"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        id="eventsToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastEl"
      >
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto">
            <i :class="toastIcon"></i> Notificación
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
import { Modal } from 'bootstrap'
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import EventCard from '@/views/EventCard.vue'
import EventListItem from '@/views/EventListItem.vue'
import FeaturedEventCard from '@/views/FeaturedEventCard.vue'
import TestimonialCard from '@/views/TestimonialCard.vue'
import EventRegistrationForm from '@/views/EventRegistrationForm.vue'
import type { Event, EventFilters, Category, Speaker, Testimonial } from '@/types/events'
import type { Toast } from 'bootstrap'
import { debounce } from '@/utils/debounce'

import { API_BASE } from '@/config/api'
import { useTheme } from '@/composables/useTheme'

// Tipos
type ToastType = 'success' | 'info' | 'warning' | 'error'
type ViewMode = 'grid' | 'list'

// Estado del tema
const { currentTheme } = useTheme()

// Estado de eventos (se cargarán desde la API)
const events = ref<Event[]>([])

// Normalize common server-provided type values to our category ids (Spanish)
const normalizeTypeId = (t?: string | null) => {
  const raw = String(t || '').toLowerCase().trim()
  if (!raw) return 'capacitacion'
  const map: Record<string,string> = {
    'training': 'capacitacion',
    'capacitacion': 'capacitacion',
    'webinar': 'webinar',
    'workshop': 'taller',
    'taller': 'taller',
    'conference': 'conferencia',
    'conferencia': 'conferencia',
    'symposium': 'simposio',
    'simposio': 'simposio',
    'maintenance': 'mantenimiento',
    'calibration': 'calibracion',
    'meeting': 'meeting',
    'other': 'other'
  }
  return map[raw] || raw
}

// Cargar eventos desde la API (usa la misma ruta que el admin)
const fetchEvents = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/events`)
    if (!res.ok) throw new Error('Error cargando eventos')
    const data = await res.json()
    events.value = data.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description || r.summary || '',
      shortDescription: r.shortDescription || r.summary || r.description || '',
      // prefer explicit start/end dates when present
      startDate: r.startDate || r.start_date || r.date || '',
      endDate: r.endDate || r.end_date || r.date || '',
      date: r.date || r.startDate || r.start_date || '',
      time: r.time || (r.startTime && r.endTime ? `${r.startTime} - ${r.endTime}` : ''),
      modality: r.modality ?? r.type ?? 'presential',
      category: normalizeTypeId(r.category || r.type || 'capacitacion'),
      location: r.location || r.venue || '',
      virtualLink: r.virtualLink || r.virtual_link || null,
      price: r.price ?? r.cost ?? 0,
      capacity: r.maxParticipants || r.capacity || 0,
      registered: Array.isArray(r.participants) ? r.participants.length : (r.registered || 0),
      featured: !!r.featured,
      // keep backend status if provided but we'll normalize below
      status: r.status || '',
      image: r.thumbnailUrl || r.image || '',
      speakers: r.speakers || [],
      tags: r.tags || []
    }))

    // Normalize status based on server value and start/end dates so we only use
    // the canonical keys used in the admin view: 'proximo','activo','completado','cancelado'.
    const now = new Date()
    // set time to end of day when comparing endDate
    events.value.forEach(e => {
      // map common server-provided status strings to canonical keys
      const incoming = String(e.status || '').toLowerCase()
      const mapStatus: Record<string,string> = {
        'upcoming': 'proximo', 'up': 'proximo', 'future': 'proximo',
        'upcoming_event': 'proximo',
        'ongoing': 'activo', 'active': 'activo', 'in-progress': 'activo',
        'running': 'activo',
        'completed': 'completado', 'complete': 'completado', 'finished': 'completado',
        'done': 'completado', 'past': 'completado',
        'cancelled': 'cancelado', 'canceled': 'cancelado', 'cancelado': 'cancelado'
      }
      if (mapStatus[incoming]) e.status = mapStatus[incoming]

      const s = e.startDate ? new Date(e.startDate) : (e.date ? new Date(e.date) : null)
      const en = e.endDate ? new Date(e.endDate) : (e.date ? new Date(e.date) : null)
      if (en) en.setHours(23,59,59,999)

      // If explicitly cancelled keep that status
      if (String(e.status || '').toLowerCase() === 'cancelado') {
        e.status = 'cancelado'
        e.statusLabel = 'Cancelado'
        return
      }

      // If end date passed => completado
      if (en && en.getTime && en.getTime() < now.getTime()) {
        e.status = 'completado'
        e.statusLabel = 'Completado'
      // If start date is in the future => proximo
      } else if (s && s.getTime && s.getTime() > now.getTime()) {
        e.status = 'proximo'
        e.statusLabel = 'Próximo'
      // Otherwise treat as active/in-progress
      } else {
        e.status = 'activo'
        e.statusLabel = 'En curso'
      }
    })
  } catch (err) {
    console.error('fetchEvents error', err)
  }
}

const categories = ref<Category[]>([
  { id: 'capacitacion', name: 'Capacitación', color: '#a7b729', icon: 'bi bi-mortarboard' },
  { id: 'webinar', name: 'Webinar', color: '#0d6efd', icon: 'bi bi-camera-video' },
  { id: 'taller', name: 'Taller', color: '#fd7e14', icon: 'bi bi-tools' },
  { id: 'conferencia', name: 'Conferencia', color: '#6f42c1', icon: 'bi bi-megaphone' },
  { id: 'simposio', name: 'Simposio', color: '#dc3545', icon: 'bi bi-people' }
])

const speakers = ref<Speaker[]>([
  { id: 1, name: 'Dr. Victor Martínez', title: 'Experto en Termometría', avatar: 'VM' },
  { id: 2, name: 'Ing. Jorge Nava', title: 'Especialista en Masa', avatar: 'JN' },
  { id: 3, name: 'Mtra. Marilyn López', title: 'Experta en Volumen', avatar: 'ML' },
  { id: 4, name: 'Ing. Adrián Reyes', title: 'Analista Químico', avatar: 'AR' },
  { id: 5, name: 'Dr. Alejandro Navarro', title: 'Investigador Principal', avatar: 'AN' }
])

const testimonials = ref<Testimonial[]>([
  {
    id: 1,
    name: 'Ing. Carlos Ramírez',
    company: 'Laboratorio Químico Nacional',
    text: 'Los talleres de SENA son excelentes. El contenido es práctico y los instructores son expertos en su campo.',
    rating: 5,
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'Dra. Laura Sánchez',
    company: 'Universidad Tecnológica',
    text: 'He asistido a varios webinars y todos han superado mis expectativas. La calidad de la información es sobresaliente.',
    rating: 5,
    date: '2024-02-10'
  },
  {
    id: 3,
    name: 'Ing. Roberto Torres',
    company: 'Industria Farmacéutica',
    text: 'El simposio internacional fue una experiencia invaluable. Pude conocer las últimas tendencias y hacer networking.',
    rating: 4,
    date: '2023-12-05'
  }
])

// Filtros
const filters = ref<EventFilters>({
  category: 'all',
  date: 'all',
  modality: 'all',
  sort: 'date_asc',
  search: ''
})

const viewMode = ref<ViewMode>('grid')
const currentPage = ref(1)
const itemsPerPage = 6

// Newsletter
const newsletterEmail = ref('')
const newsletterConsent = ref(false)
const isSubscribing = ref(false)

// Modal
const selectedEvent = ref<Event | null>(null)
const registrationModal = ref<HTMLDivElement | null>(null)
let modalInstance: Modal | null = null

// Toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const upcomingEvents = computed(() => {
  return events.value.filter(event => event.status === 'proximo')
})

const featuredEvents = computed(() => {
  // Mostrar cualquier evento marcado como `featured` independientemente
  // del string usado en `status` por el backend.
  return events.value.filter(event => !!event.featured)
})

const totalParticipants = computed(() => {
  return events.value.reduce((total, event) => total + event.registered, 0)
})

const filteredEvents = computed(() => {
  let result = [...events.value]

  // Filtrar por categoría
  if (filters.value.category !== 'all') {
    result = result.filter(event => event.category === filters.value.category)
  }

  // Filtrar por fecha
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (filters.value.date) {
    case 'upcoming':
      result = result.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= today
      })
      break
    case 'past':
      result = result.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate < today
      })
      break
    case 'today':
      result = result.filter(event => {
        const eventDate = new Date(event.date)
        const eventDateStr = eventDate.toDateString()
        const todayStr = today.toDateString()
        return eventDateStr === todayStr
      })
      break
    case 'week':
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      result = result.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= today && eventDate <= nextWeek
      })
      break
    case 'month':
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 1)
      result = result.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= today && eventDate <= nextMonth
      })
      break
  }

  // Filtrar por modalidad
  if (filters.value.modality !== 'all') {
    result = result.filter(event => event.modality === filters.value.modality)
  }

  // Filtrar por búsqueda
  if (filters.value.search.trim()) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Ordenar
  switch (filters.value.sort) {
    case 'date_asc':
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'date_desc':
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'name_asc':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'name_desc':
      result.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
  }

  return result
})

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEvents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage)
})

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
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)
  showToast(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

const applyFilters = () => {
  currentPage.value = 1
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const clearFilters = () => {
  filters.value = {
    category: 'all',
    date: 'all',
    modality: 'all',
    sort: 'date_asc',
    search: ''
  }
  currentPage.value = 1
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

const openRegistrationModal = (event: Event) => {
  selectedEvent.value = event
  if (registrationModal.value) {
    modalInstance = new Modal(registrationModal.value)
    modalInstance.show()
  }
}

const closeRegistrationModal = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
}

const handleRegistration = async (data: any) => {
  try {
    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Actualizar contador de registrados
    const eventIndex = events.value.findIndex(e => e.id === selectedEvent.value?.id)
    if (eventIndex !== -1 && events.value[eventIndex].registered < events.value[eventIndex].capacity) {
      events.value[eventIndex].registered++
    }

    showToast('¡Registro exitoso! Te hemos enviado un correo de confirmación.', 'success')
    closeRegistrationModal()
  } catch (error) {
    showToast('Error al realizar el registro. Intenta nuevamente.', 'error')
  }
}

const viewEventDetails = (event: Event) => {
  // Navegar a la página de detalles del evento
  // router.push(`/eventos/${event.id}`)
  showToast(`Redirigiendo a detalles de: ${event.title}`, 'info')
}

const subscribeNewsletter = async () => {
  if (!newsletterConsent.value) {
    showToast('Debes aceptar los términos para suscribirte', 'warning')
    return
  }

  isSubscribing.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast('¡Suscripción exitosa! Revisa tu correo para confirmar.', 'success')
    newsletterEmail.value = ''
    newsletterConsent.value = false
  } catch (error) {
    showToast('Error al suscribirte. Intenta nuevamente.', 'error')
  } finally {
    isSubscribing.value = false
  }
}

const showToast = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
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

const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = 'dark'
      localStorage.setItem('theme', 'dark')
    }
  }
}

onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Detectar tema del sistema
  detectSystemTheme()

  // Escuchar cambios del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = e.matches ? 'dark' : 'light'
    }
  })
  // Cargar eventos desde la API
  fetchEvents()
})
</script>

<style scoped>
.eventos-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .eventos-page {
  background: var(--gradient-bg);
}

/* Hero Section */
.events-hero {
  min-height: 60vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('./../image/IMAGEN\ 5.png');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(167, 183, 41, 0.8) 0%, rgba(167, 183, 41, 0.6) 100%));
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem 0;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
}

.hero-stats {
  display: flex;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #019419 0%, #045923 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.hero-highlights {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.highlight-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideInRight 0.8s ease-out;
  animation-delay: calc(var(--delay, 0) * 0.2s);
}

.highlight-card i {
  font-size: 2rem;
  color: #06a335ae;
  flex-shrink: 0;
}

.highlight-card h5 {
  color: white;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.highlight-card p {
  opacity: 0.8;
  font-size: 0.9rem;
  margin: 0;
}

/* Filters Section */
.filters-section {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 2px 10px var(--shadow-color, rgba(0, 0, 0, 0.05));
  position: sticky;
  top: 180px;
  z-index: 90;
}

[data-bs-theme="dark"] .filters-section {
  background: var(--color-light, #121212);
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.filters-container {
  background: var(--card-bg, white);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

[data-bs-theme="dark"] .filters-container {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.filter-group {
  margin-bottom: 0;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.filter-label i {
  color: var(--color-primary, #a7b729);
}

.filter-select {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 0.625rem 1rem;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .filter-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.filter-select:focus {
  border-color: var(--color-primary, #a7b729);
  box-shadow: 0 0 0 0.25rem rgba(167, 183, 41, 0.25);
}

.search-container {
  margin-top: 1rem;
}

.search-container .input-group {
  border-radius: 8px;
  overflow: hidden;
}

.search-container .input-group-text {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(167, 183, 41, 0.1) 0%, rgba(167, 183, 41, 0.05) 100%));
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-right: none;
  color: var(--color-primary, #a7b729);
}

.search-container .form-control {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-left: none;
  border-right: none;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  padding: 0.75rem 1rem;
}

[data-bs-theme="dark"] .search-container .form-control {
  background: var(--card-bg, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.search-container .btn {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-left: none;
  padding: 0.75rem 1.5rem;
}

/* Events Grid Section */
.events-grid-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .events-grid-section {
  background: var(--lab-bg, #1a1a1a);
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-options .btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.view-options .btn.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border-color: transparent;
  color: white;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-results {
  padding: 4rem 1rem;
}

.no-results-icon {
  width: 100px;
  height: 100px;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(167,183,41,0.08) 0%, rgba(167,183,41,0.04) 100%));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: var(--color-primary, #a7b729);
  font-size: 3rem;
}

[data-bs-theme="dark"] .no-results-icon {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.pagination .page-link {
  color: var(--color-primary, #a7b729);
  border-color: var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  margin: 0 0.25rem;
  border-radius: 8px;
}

[data-bs-theme="dark"] .pagination .page-link {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-primary-light, var(--color-primary));
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border-color: transparent;
  color: white;
}

/* Featured Events Section */
.featured-events-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .featured-events-section {
  background: var(--color-light, #121212);
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--color-gray, #6C757D);
  max-width: 600px;
  margin: 0 auto;
}

/* Testimonials Section */
.testimonials-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .testimonials-section {
  background: var(--lab-bg, #1a1a1a);
}

/* Newsletter Section */
.newsletter-section {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(167, 183, 41, 0.1) 0%, rgba(167, 183, 41, 0.05) 100%));
}

[data-bs-theme="dark"] .newsletter-section {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(167, 183, 41, 0.15) 0%, rgba(167, 183, 41, 0.1) 100%));
}

.newsletter-card {
  background: var(--color-light, white);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .newsletter-card {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.newsletter-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2.5rem;
}

.newsletter-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .newsletter-title {
  color: var(--color-dark, #F8F9FA);
}

.newsletter-subtitle {
  color: var(--color-gray, #6C757D);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.newsletter-form .input-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.newsletter-form .form-control {
  padding: 1rem 1.5rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-right: none;
  font-size: 1rem;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .newsletter-form .form-control {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.newsletter-form .btn {
  padding: 1rem 2rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border: none;
}

.newsletter-form .form-check-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  line-height: 1.4;
}

.newsletter-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.newsletter-stats .stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.newsletter-stats .stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary, #a7b729);
  margin-bottom: 0.25rem;
}

.newsletter-stats .stat-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

/* Animations */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Status badges */
.badge-completado {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); /* red for completed */
  color: #fff;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
.badge-proximo {
  background: linear-gradient(135deg, #ffc107 0%, #ffcd39 100%); /* yellow for upcoming */
  color: #212529; /* dark text on yellow */
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
.badge-activo {
  background: linear-gradient(135deg, #28a745 0%, #2f8f2f 100%); /* green for in-progress */
  color: #fff;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
.badge-cancelado {
  background: linear-gradient(135deg, #dc3545 0%, #b02a37 100%);
  color: #fff;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 991.98px) {
  .events-hero {
    padding: 4rem 0;
    min-height: 70vh;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-stats {
    gap: 2rem;
  }

  .filters-section {
    top: 140px;
  }
}

@media (max-width: 768px) {

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .filters-container {
    padding: 1rem;
  }

  .highlight-card {
    padding: 1rem;
  }

  .highlight-card i {
    font-size: 1.5rem;
  }

  .newsletter-card {
    padding: 2rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .filters-section {
    top: 120px;
  }

  .view-options {
    display: none;
  }

  .newsletter-stats {
    gap: 1.5rem;
  }

  .newsletter-stats .stat-number {
    font-size: 1.25rem;
  }
}
</style>
