<template>
  <div class="document-card" :class="{ 'featured': document.featured }">
    <!-- Badge de categoría -->
    <div class="category-badge">
      {{ document.categoria }}
    </div>
    
    <div class="card-content">
      <!-- Icono del documento -->
      <div class="doc-icon" :style="{ background: iconColor }">
        <i :class="document.icon"></i>
      </div>
      
      <!-- Información del documento -->
      <div class="doc-info">
        <h4 class="doc-title">{{ document.title }}</h4>
        <p class="doc-description">{{ document.description }}</p>
        
        <div class="doc-meta">
          <div class="meta-item">
            <i class="bi bi-calendar"></i>
            <span>{{ document.fecha }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-building"></i>
            <span>{{ document.emisor }}</span>
          </div>
        </div>
        
        <div class="doc-stats">
          <div class="stat">
            <i class="bi bi-file-text"></i>
            <span>{{ document.paginas }} páginas</span>
          </div>
          <div class="stat">
            <i class="bi bi-hdd"></i>
            <span>{{ document.size }}</span>
          </div>
          <div class="stat">
            <i class="bi bi-filetype-pdf"></i>
            <span>PDF</span>
          </div>
        </div>
      </div>
      
      <!-- Acciones -->
      <div class="doc-actions">
        <button class="btn btn-preview" @click="$emit('preview', document)">
          <i class="bi bi-eye"></i>
          <span>Vista previa</span>
        </button>
        
        <button class="btn btn-download" @click="$emit('download', document)">
          <i class="bi bi-download"></i>
          <span>Descargar</span>
        </button>
      </div>
    </div>
    
    <!-- Indicador de tipo -->
    <div class="type-indicator" :class="document.type"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Document {
  id: number
  title: string
  description: string
  type: 'acreditacion' | 'dictamen' | 'reconocimiento'
  fileName: string
  fileUrl: string
  size: string
  paginas: number
  fecha: string
  emisor: string
  categoria: string
  icon: string
  featured?: boolean
}

interface Props {
  document: Document
  currentTheme: 'light' | 'dark'
}

const props = defineProps<Props>()
defineEmits(['download', 'preview'])

const iconColor = computed(() => {
  const colors = {
    acreditacion: 'linear-gradient(135deg, #1E9E4A 0%, #34B565 100%)',
    dictamen: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
    reconocimiento: 'linear-gradient(135deg, #FF9E00 0%, #FF6B00 100%)'
  }
  return colors[props.document.type] || colors.acreditacion
})
</script>

<style scoped>
.document-card {
  background: var(--card-bg, white);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  height: 100%;
}

[data-bs-theme="dark"] .document-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.document-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-light, #34B565);
}

.document-card.featured {
  border: 2px solid #FFD700;
  background: linear-gradient(135deg, var(--card-bg, white) 0%, rgba(255, 215, 0, 0.05) 100%);
}

[data-bs-theme="dark"] .document-card.featured {
  background: linear-gradient(135deg, var(--card-bg, #2d2d2d) 0%, rgba(255, 215, 0, 0.1) 100%);
}

/* Category Badge */
.category-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #1E9E4A);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(30, 158, 74, 0.2);
}

[data-bs-theme="dark"] .category-badge {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
  color: var(--color-primary-light, #34B565);
}

/* Card Content */
.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.doc-icon {
  width: 70px;
  height: 70px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.doc-info {
  flex: 1;
  margin-bottom: 1.5rem;
}

.doc-title {
  color: var(--color-dark, #212529);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

[data-bs-theme="dark"] .doc-title {
  color: var(--color-dark, #F8F9FA);
}

.doc-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

[data-bs-theme="dark"] .doc-description {
  color: var(--color-gray, #6C757D);
}

/* Meta Information */
.doc-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.meta-item i {
  color: var(--color-primary, #1E9E4A);
  width: 16px;
}

.meta-item span {
  color: var(--color-gray-dark, #495057);
}

[data-bs-theme="dark"] .meta-item span {
  color: var(--color-gray-dark, #ADB5BD);
}

/* Document Stats */
.doc-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.stat i {
  color: var(--color-primary, #1E9E4A);
}

.stat span {
  color: var(--color-gray, #6C757D);
}

/* Actions */
.doc-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.btn-preview,
.btn-download {
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-preview {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #1E9E4A);
}

.btn-preview:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(129, 199, 132, 0.1) 100%);
  border-color: var(--color-primary, #1E9E4A);
  transform: translateY(-2px);
}

.btn-download {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  color: white;
}

.btn-download:hover {
  box-shadow: 0 4px 15px rgba(30, 158, 74, 0.3);
  transform: translateY(-2px);
}

/* Type Indicator */
.type-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.type-indicator.acreditacion {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
}

.type-indicator.dictamen {
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
}

.type-indicator.reconocimiento {
  background: linear-gradient(135deg, #FF9E00 0%, #FF6B00 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .document-card {
    padding: 1.5rem;
  }
  
  .doc-icon {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
  }
  
  .doc-title {
    font-size: 1.1rem;
  }
  
  .doc-stats {
    gap: 1rem;
  }
  
  .stat {
    font-size: 0.8rem;
  }
  
  .doc-actions {
    flex-direction: column;
  }
}
</style>