<template>
  <BaseModal
    :model-value="modelValue"
    size="full"
    flush
    :title="title"
    :subtitle="subtitle"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div
      class="pdf-view"
      @contextmenu.prevent
      @dragstart.prevent
    >
      <template v-if="src">
        <div v-if="loading" class="pdf-view__status" role="status">
          <span class="pdf-view__spinner" aria-hidden="true"></span>
          <p>Cargando documento...</p>
        </div>

        <iframe
          :key="protectedSrc"
          :src="protectedSrc"
          class="pdf-view__frame"
          :title="title || 'Documento PDF'"
          @load="loading = false"
          @error="onError"
        ></iframe>

        <div v-if="failed" class="pdf-view__status pdf-view__status--error">
          <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
          <p>No se pudo mostrar el documento en el navegador.</p>
        </div>
      </template>

      <div v-else class="pdf-view__empty">
        <i class="bi bi-file-earmark-pdf" aria-hidden="true"></i>
        <p>Vista previa no disponible</p>
      </div>

      <p class="pdf-view__notice">
        <i class="bi bi-shield-lock" aria-hidden="true"></i>
        Documento de consulta. No está permitida su descarga ni su impresión.
      </p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
/**
 * Visor de PDF en modal, en modo solo lectura.
 *
 * ------------------------------------------------------------------
 * ALCANCE REAL DE LA PROTECCIÓN — leer antes de confiar en esto
 * ------------------------------------------------------------------
 * Estas medidas DISUADEN al usuario normal, pero NO impiden de forma
 * efectiva que alguien obtenga el archivo. El navegador tiene que
 * descargar el PDF para poder mostrarlo, así que la URL sigue siendo
 * visible en la pestaña de red de las herramientas de desarrollo, y
 * cualquiera puede abrirla directamente.
 *
 * Si el requisito es que estos documentos NO puedan guardarse, la única
 * solución sólida es del lado del servidor:
 *   1. servir el PDF con una URL firmada y de un solo uso, o
 *   2. rasterizar el documento a imágenes en el servidor y enviar solo
 *      esas imágenes con marca de agua, o
 *   3. aplicar DRM real (p. ej. permisos del propio PDF + visor propio).
 * Lo que hace este componente es la capa de disuasión del cliente.
 *
 * Qué sí hace:
 *   - oculta la barra de herramientas nativa del PDF (los botones de
 *     descargar e imprimir del visor de Chrome/Edge/Firefox)
 *   - bloquea el menú contextual y el arrastrar-soltar
 *   - intercepta Ctrl/Cmd+P y Ctrl/Cmd+S mientras el modal está abierto
 *   - oculta el contenido al imprimir (@media print)
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  modelValue: boolean
  /** URL del PDF */
  src?: string | null
  title?: string
  subtitle?: string
}>()

defineEmits<{ 'update:modelValue': [value: boolean] }>()

/**
 * Parámetros del visor nativo: ocultan barra de herramientas, panel de
 * navegación y barra de estado, que es donde viven los botones de
 * descarga e impresión.
 */
const loading = ref(false)
const failed = ref(false)

function onError() {
  loading.value = false
  failed.value = true
}

const protectedSrc = computed(() => {
  if (!props.src) return ''
  // Quitar cualquier fragmento previo para no duplicar parametros.
  const raw = props.src.split('#')[0] ?? ''
  // Varios PDF del proyecto tienen espacios y parentesis en el nombre
  // ("PROGRAMA NACIONAL MEXICO SENA 2026.pdf"). Sin codificar, el navegador
  // puede cortar la URL al llegar al fragmento. Se evita doble codificacion
  // comprobando si ya venia codificada.
  const base = raw.includes('%') ? raw : encodeURI(raw)
  return `${base}#toolbar=0&navpanes=0&statusbar=0&scrollbar=1&view=FitH`
})

function blockShortcuts(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  const combo = e.ctrlKey || e.metaKey
  if (combo && (key === 'p' || key === 's')) {
    e.preventDefault()
    e.stopPropagation()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      loading.value = Boolean(props.src)
      failed.value = false
      document.addEventListener('keydown', blockShortcuts, true)
      document.body.classList.add('pdf-view-open')
    } else {
      document.removeEventListener('keydown', blockShortcuts, true)
      document.body.classList.remove('pdf-view-open')
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', blockShortcuts, true)
  document.body.classList.remove('pdf-view-open')
})
</script>

<style scoped>
.pdf-view {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  /* respaldo por si el contenedor no propaga la altura */
  height: 100%;
  background: #525659;
  user-select: none;
}

.pdf-view__frame {
  flex: 1 1 auto;
  width: 100%;
  border: 0;
  min-height: 0;
}

.pdf-view__empty {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #e8ebe4;
}

.pdf-view__empty i {
  font-size: 3rem;
  opacity: 0.7;
}

.pdf-view__status {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #e8ebe4;
  background: #525659;
  pointer-events: none;
}

.pdf-view__status--error { pointer-events: auto; }
.pdf-view__status i { font-size: 2.5rem; }

.pdf-view__spinner {
  width: 34px;
  height: 34px;
  border: 3px solid rgba(255, 255, 255, 0.28);
  border-top-color: #fff;
  border-radius: 50%;
  animation: pdf-view-spin 0.8s linear infinite;
}

@keyframes pdf-view-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .pdf-view__spinner { animation: none; }
}

.pdf-view__notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.6rem 1rem;
  background: #2e3329;
  color: #dfe5d7;          /* 10.9:1 sobre el fondo */
  font-size: 0.84rem;
}
</style>
