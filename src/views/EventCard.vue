<template>
  <div class="event-card" @mouseenter="hover = true" @mouseleave="hover = false">
    <!-- Badge de categoría -->
    <div class="category-badge" :style="{ background: categoryColor }">
      <i :class="categoryIcon"></i>
      <span>{{ categoryName }}</span>
    </div>

    <!-- Imagen del evento -->
    <div class="event-image" :style="{ backgroundImage: `url(${event.image})` }">
      <div class="image-overlay"></div>
      <div class="event-status" :class="statusClass">
        {{ statusText }}
      </div>
      <div v-if="event.featured" class="featured-badge">
        <i class="bi bi-star-fill"></i> Destacado
      </div>
    </div>

    <!-- Contenido del card -->
    <div class="event-content">
      <!-- Fecha y hora -->
      <div class="event-meta">
        <div class="meta-item">
          <i class="bi bi-calendar"></i>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="meta-item">
          <i class="bi bi-clock"></i>
          <span>{{ event.time }}</span>
        </div>
        <div class="meta-item">
          <i class="bi" :class="modalityIcon"></i>
          <span>{{ modalityText }}</span>
        </div>
      </div>

      <!-- Título y descripción -->
      <h3 class="event-title">{{ event.title }}</h3>
      <p class="event-description">{{ event.shortDescription }}</p>

      <!-- Ponentes -->
      <div v-if="eventSpeakers.length > 0" class="event-speakers">
        <div class="speakers-label">
          <i class="bi bi-person-badge"></i>
          <span>Ponentes:</span>
        </div>
        <div class="speakers-list">
          <div
            v-for="speaker in eventSpeakers"
            :key="speaker.id"
            class="speaker-item"
            :title="speaker.name"
          >
            <div class="speaker-avatar" :style="{ background: getAvatarColor(speaker.id) }">
              {{ speaker.avatar }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="event.tags.length > 0" class="event-tags">
        <span
          v-for="tag in event.tags"
          :key="tag"
          class="event-tag"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Footer del card -->
      <div class="event-footer">
        <div class="event-info">
          <div class="price">
            <template v-if="event.price > 0">
              <span class="price-amount">${{ event.price.toLocaleString() }}</span>
              <span class="price-label">MXN</span>
            </template>
            <template v-else>
              <span class="price-free">Gratuito</span>
            </template>
          </div>
          <div class="capacity">
            <i class="bi bi-people"></i>
            <span>{{ event.registered }}/{{ event.capacity }}</span>
          </div>
        </div>

        <div class="event-actions">
          <button
            class="btn btn-details"
            @click="$emit('view-details', event)"
            :disabled="event.registered >= event.capacity && canonicalStatus === 'proximo'"
          >
            <i class="bi bi-info-circle"></i>
            <span>Detalles</span>
          </button>
          <button
            class="btn btn-register"
            :class="{ 'btn-success': event.registered < event.capacity, 'btn-secondary': event.registered >= event.capacity }"
            @click="$emit('register', event)"
            :disabled="event.registered >= event.capacity || canonicalStatus === 'completado' || canonicalStatus === 'cancelado'"
          >
            <template v-if="event.registered >= event.capacity && canonicalStatus === 'proximo'">
              <i class="bi bi-x-circle"></i>
              <span>Completo</span>
            </template>
            <template v-else-if="canonicalStatus === 'completado'">
              <i class="bi bi-clock-history"></i>
              <span>Finalizado</span>
            </template>
            <template v-else>
              <i class="bi bi-pencil-square"></i>
              <span>Inscribirse</span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay de hover -->
    <div class="hover-overlay" :class="{ 'active': hover }">
      <div class="hover-content">
        <h4>Información adicional</h4>
        <p>{{ event.description }}</p>
        <div class="hover-actions">
          <button class="btn btn-outline-light btn-sm" @click="$emit('view-details', event)">
            <i class="bi bi-info-circle me-1"></i>Más información
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Event, Speaker } from '@/types/events'

interface Props {
  event: Event
  currentTheme: 'light' | 'dark'
  speakers?: Speaker[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'register': [event: Event]
  'view-details': [event: Event]
}>()

const hover = ref(false)

// Computed
const categoryName = computed(() => {
  const categories: Record<string, string> = {
    'capacitacion': 'Capacitación',
    'webinar': 'Webinar',
    'taller': 'Taller',
    'conferencia': 'Conferencia',
    'simposio': 'Simposio'
  }
  return categories[props.event.category] || props.event.category
})

const categoryColor = computed(() => {
  const colors: Record<string, string> = {
    'capacitacion': 'var(--color-primary)',
    'webinar': '#0d6efd',
    'taller': '#fd7e14',
    'conferencia': '#6f42c1',
    'simposio': '#dc3545'
  }
  return colors[props.event.category] || '#6c757d'
})

const categoryIcon = computed(() => {
  const icons: Record<string, string> = {
    'capacitacion': 'bi bi-mortarboard',
    'webinar': 'bi bi-camera-video',
    'taller': 'bi bi-tools',
    'conferencia': 'bi bi-megaphone',
    'simposio': 'bi bi-people'
  }
  return icons[props.event.category] || 'bi bi-calendar'
})

const formattedDate = computed(() => {
  const date = new Date(props.event.date)
  return date.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
})

const modalityText = computed(() => {
  const modalities: Record<string, string> = {
    'presential': 'Presencial',
    'virtual': 'Virtual',
    'hybrid': 'Híbrido'
  }
  return modalities[props.event.modality] || props.event.modality
})

const modalityIcon = computed(() => {
  const icons: Record<string, string> = {
    'presential': 'bi-geo-alt',
    'virtual': 'bi-camera-video',
    'hybrid': 'bi-laptop'
  }
  return icons[props.event.modality] || 'bi-calendar'
})

// Normalize incoming status strings to the canonical set:
// 'proximo', 'activo', 'completado', 'cancelado'
const normalizeStatus = (s?: string | null) => {
  const raw = String(s || '').toLowerCase().trim()
  if (!raw) return ''
  const map: Record<string, string> = {
    // upcoming variants
    'upcoming': 'proximo', 'next': 'proximo', 'próximo': 'proximo', 'proximo': 'proximo',
    // active variants
    'active': 'activo', 'in progress': 'activo', 'en curso': 'activo', 'activo': 'activo',
    // completed variants
    'completed': 'completado', 'past': 'completado', 'finalizado': 'completado', 'completado': 'completado',
    // cancelled variants
    'cancelled': 'cancelado', 'canceled': 'cancelado', 'cancelado': 'cancelado'
  }
  return map[raw] || raw
}

const canonicalStatus = computed(() => {
  // Prefer explicit normalized event.status; otherwise derive from dates/capacity
  const explicit = normalizeStatus(props.event.status)
  if (explicit) return explicit

  const now = new Date()
  const start = props.event.startDate ? new Date(props.event.startDate) : (props.event.date ? new Date(props.event.date) : null)
  const end = props.event.endDate ? new Date(props.event.endDate) : (props.event.date ? new Date(props.event.date) : null)
  if (end) end.setHours(23,59,59,999)

  if (end && end.getTime && end.getTime() < now.getTime()) return 'completado'
  if (start && start.getTime && start.getTime() > now.getTime()) return 'proximo'
  if (start && end && start.getTime && end.getTime && start.getTime() <= now.getTime() && end.getTime() >= now.getTime()) return 'activo'
  if (props.event.registered >= props.event.capacity) return 'completado'

  return 'proximo'
})

const statusText = computed(() => {
  const map: Record<string, string> = {
    'proximo': 'Próximo',
    'activo': 'En curso',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
  }
  return map[canonicalStatus.value] || ''
})

const statusClass = computed(() => {
  switch (canonicalStatus.value) {
    case 'activo': return 'status-activo'
    case 'completado': return 'status-completado'
    case 'cancelado': return 'status-cancelado'
    case 'proximo':
    default:
      return 'status-proximo'
  }
})

const eventSpeakers = computed(() => {
  return props.speakers?.filter(speaker =>
    props.event.speakers.includes(speaker.id)
  ) || []
})

// Métodos
const getAvatarColor = (id: number) => {
  const colors = [
    'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ]
  return colors[id % colors.length]
}
</script>

<style scoped>
.event-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

[data-bs-theme="dark"] .event-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary-light, var(--color-primary));
}

/* Category Badge */
.category-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--color-primary);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Event Image */
.event-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
}

.event-status {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
  border: 1px solid rgba(0,0,0,0.06);
}
.status-completado { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: #fff; }
.status-activo { background: linear-gradient(135deg, var(--color-primary, #a7b729) 0%, #8bac3b 100%); color: #fff; }
.status-proximo { background: linear-gradient(135deg, #ffc107 0%, #ffcd39 100%); color: #212529; }
.status-cancelado { background: linear-gradient(135deg, #b02a37 0%, #7a1720 100%); color: #fff; }

.featured-badge {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
}

/* Event Content */
.event-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
}

.meta-item i {
  color: var(--color-primary, #a7b729);
  font-size: 0.9rem;
}

.event-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.75rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

[data-bs-theme="dark"] .event-title {
  color: var(--color-dark, #F8F9FA);
}

.event-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Event Speakers */
.event-speakers {
  margin-bottom: 1rem;
}

.speakers-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.speakers-label i {
  color: var(--color-primary, #a7b729);
}

.speakers-list {
  display: flex;
  gap: 8px;
}

.speaker-item {
  cursor: help;
}

.speaker-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  border: 2px solid var(--color-light, white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .speaker-avatar {
  border: 2px solid var(--color-light, #121212);
}

/* Event Tags */
.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1.5rem;
}

.event-tag {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(167,183,41,0.08) 0%, rgba(167,183,41,0.04) 100%));
  color: var(--color-primary, #a7b729);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(167,183,41,0.18);
}

[data-bs-theme="dark"] .event-tag {
  background: linear-gradient(135deg, rgba(167,183,41,0.12) 0%, rgba(167,183,41,0.06) 100%);
  color: var(--color-primary-light, var(--color-primary));
}

/* Event Footer */
.event-footer {
  margin-top: auto;
}

.event-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-right: 4px;
}

[data-bs-theme="dark"] .price-amount {
  color: var(--color-dark, #F8F9FA);
}

.price-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.price-free {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-success, #198754);
}

.capacity {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.capacity i {
  color: var(--color-primary, #1E9E4A);
}

.event-actions {
  display: flex;
  gap: 10px;
}

.btn-details {
  flex: 1;
  background: transparent;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-details:hover:not(:disabled) {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  transform: translateY(-2px);
}

.btn-register {
  flex: 1;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-register:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

/* Hover Overlay */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(167,183,41,0.95) 0%, rgba(167,183,41,0.9) 100%);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 3;
}

.hover-overlay.active {
  opacity: 1;
  visibility: visible;
}

.hover-content {
  color: white;
}

.hover-content h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.hover-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hover-actions {
  display: flex;
  gap: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .event-image {
    background: linear-gradient(135deg, rgba(167,183,41,0.08) 0%, rgba(167,183,41,0.04) 100%);
  }

  .event-content {
    padding: 1.25rem;
  }

  .event-title {
    font-size: 1.1rem;
  }

  .event-actions {
    flex-direction: column;
  }

  .btn-details,
  .btn-register {
    padding: 10px;
  }
}
</style>
