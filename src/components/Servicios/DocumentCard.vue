<template>
  <div class="document-card card" :data-bs-theme="currentTheme">
    <div class="card-body d-flex gap-3 align-items-start">
      <div class="doc-icon d-flex align-items-center justify-content-center">
        <i :class="document.icon + ' fs-3'"></i>
      </div>

      <div class="doc-meta flex-grow-1">
        <h5 class="card-title mb-1">{{ document.title }}</h5>
        <div class="d-flex gap-2 mb-2 align-items-center">
          <small class="text-muted">{{ document.code }}</small>
          <small class="text-muted">•</small>
          <small class="text-muted">v{{ document.version }}</small>
          <small class="text-muted">•</small>
          <small class="text-muted">{{ document.pages }} páginas</small>
        </div>
        <p class="card-text mb-2 description">{{ shortDescription }}</p>

        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-sm btn-outline-primary" @click="openModal">
            <i class="bi bi-eye me-1"></i>Ver
          </button>
          <a :href="document.downloadUrl" target="_blank" class="btn btn-sm btn-primary">
            <i class="bi bi-download me-1"></i>Descargar
          </a>
          <span class="badge bg-secondary ms-auto">{{ document.country.toUpperCase() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  document: {
    id: number
    title: string
    code: string
    description: string
    category: string
    country: string
    version: string
    date: string
    pages: number
    size: string
    url?: string
    downloadUrl: string
    icon: string
  }
  currentTheme?: 'light' | 'dark'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'open-modal', doc: Props['document']): void
}>()

const shortDescription = computed(() => {
  if (!props.document.description) return ''
  return props.document.description.length > 140
    ? props.document.description.slice(0, 137) + '...'
    : props.document.description
})

const openModal = () => {
  emit('open-modal', props.document)
}
</script>

<style scoped>
.document-card { cursor: default; }
.doc-icon {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background: var(--card-bg, #f8f9fa);
  border: 1px solid rgba(0,0,0,0.04);
  color: var(--color-primary, #1E9E4A);
  flex-shrink: 0;
}
.description { color: var(--color-gray, #6C757D); margin-bottom: .5rem }

@media (max-width: 576px) {
  .doc-icon { width:56px; height:56px }
}
</style>
