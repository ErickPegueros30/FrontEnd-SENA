<template>
  <article class="event-list-item-card">
    <div class="thumb" :style="{ backgroundImage: `url(${event.image})` }"></div>
    <div class="content">
        <h3 class="title">{{ event.title }} <span class="event-status" :class="statusClass">{{ statusText }}</span></h3>
      <div class="meta">
        <span class="date"><i class="bi bi-calendar-event"></i> {{ formatDate(event.date) }} · {{ event.time }}</span>
        <span class="location"><i class="bi bi-geo-alt"></i> {{ event.location }}</span>
      </div>
      <p class="short">{{ event.shortDescription || event.description }}</p>
      <div class="actions">
        <button class="btn btn-outline-primary btn-sm" @click="$emit('view-details', event)">Ver detalles</button>
        <button class="btn btn-primary btn-sm" @click="$emit('register', event)" :disabled="canonicalStatus === 'completado' || canonicalStatus === 'cancelado' || event.registered >= event.capacity">Inscribirme</button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Event } from '@/types/events'
import { defineProps, computed } from 'vue'

const props = defineProps<{ event: Event }>()

const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString() } catch { return d }
}

const normalizeStatus = (s?: string | null) => {
  const raw = String(s || '').toLowerCase().trim()
  if (!raw) return ''
  const map: Record<string, string> = {
    'upcoming': 'proximo', 'next': 'proximo', 'próximo': 'proximo', 'proximo': 'proximo',
    'active': 'activo', 'in progress': 'activo', 'en curso': 'activo', 'activo': 'activo',
    'completed': 'completado', 'past': 'completado', 'finalizado': 'completado', 'completado': 'completado',
    'cancelled': 'cancelado', 'canceled': 'cancelado', 'cancelado': 'cancelado'
  }
  return map[raw] || raw
}

const canonicalStatus = computed(() => {
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

const statusText = computed(() => ({ 'proximo':'Próximo','activo':'En curso','completado':'Completado','cancelado':'Cancelado' }[canonicalStatus.value] || ''))

const statusClass = computed(() => ({ 'proximo':'status-proximo','activo':'status-activo','completado':'status-completado','cancelado':'status-cancelado' }[canonicalStatus.value] || 'status-proximo'))
</script>

<style scoped>
.event-list-item-card { display:flex; gap:1rem; background:var(--card-bg,#fff); padding:0.75rem; border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,0.04); }
.event-list-item-card .thumb { width:140px; height:100px; background-size:cover; background-position:center; border-radius:8px; flex-shrink:0 }
.event-list-item-card .content { flex:1 }
.event-list-item-card .title { margin:0 0 0.35rem 0; font-size:1.05rem }
.event-list-item-card .meta { display:flex; gap:1rem; font-size:0.9rem; color:var(--color-gray,#6C757D); margin-bottom:0.5rem }
.event-list-item-card .short { margin:0 0 0.6rem 0; color:var(--color-gray,#6C757D) }
.event-list-item-card .actions { display:flex; gap:0.6rem }
.event-list-item-card .actions .btn.btn-primary {
  background: var(--color-primary, #a7b729);
  border-color: var(--color-primary, #a7b729);
  color: white;
}
.event-list-item-card .actions .btn.btn-primary:hover {
  filter: brightness(0.95);
}
.event-list-item-card .actions .btn.btn-outline-primary {
  border-color: var(--color-primary, #a7b729);
  color: var(--color-primary, #a7b729);
}

/* Status badge */
.event-status {
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight:700;
  display:inline-block;
  vertical-align: middle;
}
.status-proximo { background: linear-gradient(135deg,#ffc107 0%,#ffcd39 100%); color:#212529; box-shadow:0 4px 12px rgba(0,0,0,0.12); }
.status-activo { background: linear-gradient(135deg,var(--color-primary,#a7b729) 0%,#8bac3b 100%); color:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.12); }
.status-completado { background: linear-gradient(135deg,#b02a37 0%,#7a1720 100%); color:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.12); }
.status-cancelado { background: linear-gradient(135deg,#b02a37 0%,#7a1720 100%); color:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.12); }
</style>
