<template>
  <article class="event-list-item-card">
    <div class="thumb" :style="{ backgroundImage: `url(${event.image})` }"></div>
    <div class="content">
      <h3 class="title">{{ event.title }}</h3>
      <div class="meta">
        <span class="date"><i class="bi bi-calendar-event"></i> {{ formatDate(event.date) }} · {{ event.time }}</span>
        <span class="location"><i class="bi bi-geo-alt"></i> {{ event.location }}</span>
      </div>
      <p class="short">{{ event.shortDescription || event.description }}</p>
      <div class="actions">
        <button class="btn btn-outline-primary btn-sm" @click="$emit('view-details', event)">Ver detalles</button>
        <button class="btn btn-primary btn-sm" @click="$emit('register', event)">Inscribirme</button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Event } from '@/types/events'
import { defineProps } from 'vue'

const props = defineProps<{ event: Event }>()

const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString() } catch { return d }
}
</script>

<style scoped>
.event-list-item-card { display:flex; gap:1rem; background:var(--card-bg,#fff); padding:0.75rem; border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,0.04); }
.event-list-item-card .thumb { width:140px; height:100px; background-size:cover; background-position:center; border-radius:8px; flex-shrink:0 }
.event-list-item-card .content { flex:1 }
.event-list-item-card .title { margin:0 0 0.35rem 0; font-size:1.05rem }
.event-list-item-card .meta { display:flex; gap:1rem; font-size:0.9rem; color:var(--color-gray,#6C757D); margin-bottom:0.5rem }
.event-list-item-card .short { margin:0 0 0.6rem 0; color:var(--color-gray,#6C757D) }
.event-list-item-card .actions { display:flex; gap:0.6rem }
</style>
