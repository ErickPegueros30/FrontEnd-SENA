<template>
  <div class="featured-card">
    <div class="image" :style="{ backgroundImage: `url(${event.image})` }"></div>
    <div class="info">
      <div class="top">
        <span class="tag" :style="{ background: tagColor }">{{ categoryName }}</span>
        <span class="price" v-if="event.price">{{ formatPrice(event.price) }}</span>
        <span class="event-status" :class="statusClass">{{ statusText }}</span>
      </div>
      <h3 class="title">{{ event.title }}</h3>
      <p class="desc">{{ event.shortDescription }}</p>
      <div class="foot">
        <div class="when"><i class="bi bi-calendar3"></i> {{ formatDate(event.date) }}</div>
        <button class="btn btn-primary btn-sm" @click="$emit('register', event)" :disabled="canonicalStatus === 'completado' || canonicalStatus === 'cancelado' || event.registered >= event.capacity">Inscribirme</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '@/types/events'
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps<{ event: Event }>()

const categoryName = computed(() => props.event.category || '')
const tagColor = computed(() => 'var(--color-primary)')

const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString() } catch { return d }
}

const formatPrice = (p: number) => p === 0 ? 'Gratis' : `$ ${p.toLocaleString()}`

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
.featured-card { display:flex; flex-direction:column; background:var(--card-bg,#fff); border-radius:12px; overflow:hidden; box-shadow:0 14px 40px rgba(0,0,0,0.08) }
.featured-card .image { height:180px; background-size:cover; background-position:center }
.featured-card .info { padding:1rem }
.featured-card .top { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem }
.featured-card .tag { color:white; padding:0.25rem 0.6rem; border-radius:999px; font-weight:700; font-size:0.8rem }
.featured-card .title { margin:0 0 0.4rem 0; font-size:1.15rem }
.featured-card .desc { margin:0 0 0.9rem 0; color:var(--color-gray,#6C757D) }
.featured-card .foot { display:flex; justify-content:space-between; align-items:center }
.featured-card .foot .btn.btn-primary {
  background: var(--color-primary, #a7b729);
  border-color: var(--color-primary, #a7b729);
  color: white;
}
.featured-card .tag { background: var(--color-primary, #a7b729); }
.featured-card .when { color:var(--color-gray,#6C757D) }

/* Status badge */
.featured-card .event-status { margin-left:8px; padding:4px 8px; border-radius:12px; font-weight:700; font-size:0.8rem }
.featured-card .status-proximo { background: linear-gradient(135deg,#ffc107 0%,#ffcd39 100%); color:#212529; box-shadow:0 6px 18px rgba(0,0,0,0.12)}
.featured-card .status-activo { background: linear-gradient(135deg,var(--color-primary,#a7b729) 0%,#8bac3b 100%); color:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.12)}
.featured-card .status-completado { background: linear-gradient(135deg,#b02a37 0%,#7a1720 100%); color:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.12)}
.featured-card .status-cancelado { background: linear-gradient(135deg,#b02a37 0%,#7a1720 100%); color:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.12)}
</style>
