<template>
  <div class="featured-card">
    <div class="image" :style="{ backgroundImage: `url(${event.image})` }"></div>
    <div class="info">
      <div class="top">
        <span class="tag" :style="{ background: tagColor }">{{ categoryName }}</span>
        <span class="price" v-if="event.price">{{ formatPrice(event.price) }}</span>
      </div>
      <h3 class="title">{{ event.title }}</h3>
      <p class="desc">{{ event.shortDescription }}</p>
      <div class="foot">
        <div class="when"><i class="bi bi-calendar3"></i> {{ formatDate(event.date) }}</div>
        <button class="btn btn-primary btn-sm" @click="$emit('register', event)">Inscribirme</button>
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
.featured-card .when { color:var(--color-gray,#6C757D) }
</style>
