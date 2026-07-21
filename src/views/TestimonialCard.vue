<template>
  <div class="testimonial-card">
    <div class="body">“{{ testimonial.text }}”</div>
    <div class="author">
      <div class="avatar">{{ initials }}</div>
      <div class="meta">
        <div class="name">{{ testimonial.name }}</div>
        <div class="company">{{ testimonial.company }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Testimonial } from '@/types/events'
import { computed } from 'vue'

const props = defineProps<{ testimonial: Testimonial }>()

const initials = computed(() => {
  return (props.testimonial.name || '')
    .split(' ')
    .map(p => p[0] || '')
    .slice(0,2)
    .join('').toUpperCase()
})
</script>

<style scoped>
.testimonial-card { background:var(--card-bg,#fff); padding:1rem 1.1rem; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.06); display:flex; flex-direction:column; gap:0.9rem }
.testimonial-card .body { font-style:italic; color:var(--color-gray,#495057) }
.testimonial-card .author { display:flex; gap:0.75rem; align-items:center }
.testimonial-card .avatar { width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,var(--color-primary),var(--color-primary)); color:white; font-weight:700 }
.testimonial-card .meta .name { font-weight:700 }
.testimonial-card .meta .company { font-size:0.9rem; color:var(--color-gray,#6C757D) }
</style>
