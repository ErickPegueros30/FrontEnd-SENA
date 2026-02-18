<template>
  <div class="modal-backdrop" @click.self="close" ref="backdropRef">
    <div class="modal-container modal-md" ref="containerRef">
      <div class="modal-header">
        <h5 class="modal-title">{{ props.mode === 'create' ? 'Crear Curso' : 'Editar Curso' }}</h5>
        <button class="btn-close" @click="close"></button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="save">
          <div class="mb-3">
            <label class="form-label">Título *</label>
            <input v-model="form.title" class="form-control input-enhanced" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.description" class="form-control input-enhanced" rows="3"></textarea>
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Fecha inicio *</label>
              <input v-model="form.startDate" type="date" class="form-control input-enhanced" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Fecha fin *</label>
              <input v-model="form.endDate" type="date" class="form-control input-enhanced" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Modalidad</label>
              <select v-model="form.modality" class="form-select input-enhanced">
                <option value="virtual">Virtual</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Máx participantes</label>
              <input v-model.number="form.maxParticipants" type="number" class="form-control input-enhanced" min="1" />
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">Cancelar</button>
        <button class="btn btn-primary" @click="save">{{ props.mode === 'create' ? 'Crear' : 'Guardar' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{ curso?: any; mode: 'create' | 'edit' }>(), { mode: 'create' })
const emit = defineEmits(['save', 'close'])

const form = ref({
  id: 0,
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  modality: 'virtual',
  maxParticipants: 20
})

// Refs to force inline styles like EventModal
const backdropRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

watch(() => props.curso, (c) => {
  if (c) {
    form.value = {
      id: c.id || 0,
      title: c.title || '',
      description: c.description || '',
      startDate: c.startDate || '',
      endDate: c.endDate || '',
      modality: c.modality || 'virtual',
      maxParticipants: c.maxParticipants || 20
    }
  } else {
    const today = new Date().toISOString().split('T')[0]
    form.value = { id: 0, title: '', description: '', startDate: today, endDate: today, modality: 'virtual', maxParticipants: 20 }
  }
}, { immediate: true })

const save = () => {
  emit('save', { ...form.value })
}

const close = () => emit('close')

onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
  document.addEventListener('keydown', handleEscape)

  const forceOpaque = () => {
    const setImportant = (el: HTMLElement | null, isBackdrop = false) => {
      if (!el) return
      try {
        if (isBackdrop) {
          const theme = document.documentElement.getAttribute('data-bs-theme') || 'light'
          const backdropColor = theme === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.85)'
          el.style.setProperty('background-color', backdropColor, 'important')
          el.style.setProperty('pointer-events', 'auto', 'important')
        }
        el.style.setProperty('opacity', '1', 'important')
        el.style.setProperty('mix-blend-mode', 'normal', 'important')
        el.style.setProperty('backdrop-filter', 'none', 'important')
        el.style.setProperty('-webkit-backdrop-filter', 'none', 'important')
        el.style.setProperty('z-index', '2147483648', 'important')
        const descendants = el.querySelectorAll<HTMLElement>('*')
        descendants.forEach(d => {
          d.style.setProperty('opacity', '1', 'important')
          d.style.setProperty('mix-blend-mode', 'normal', 'important')
          d.style.setProperty('backdrop-filter', 'none', 'important')
          d.style.setProperty('-webkit-backdrop-filter', 'none', 'important')
        })
      } catch (e) { }
    }
    setImportant(backdropRef.value, true)
    setImportant(containerRef.value, false)
  }

  nextTick(() => { forceOpaque(); setTimeout(forceOpaque, 120) })

  onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 2147483647 !important;
  padding: 1rem;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
.modal-container {
  background-color: var(--color-light, #ffffff) !important;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  max-height: 90vh; display:flex; flex-direction:column;
  animation: modalSlideIn 0.3s ease-out;
  opacity: 1 !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important;
  background-clip: padding-box; position: relative !important; z-index: 2147483648 !important; mix-blend-mode: normal !important;
  width: 720px; max-width: 96vw;
}
.modal-header, .modal-footer { padding: 1rem; display:flex; align-items:center; justify-content:space-between }
.modal-body { padding: 1rem; overflow-y:auto; flex:1 }
.input-enhanced { background-color: #fff !important; color: #212529 !important; border: 1px solid #e6e6e6 !important }
.modal-container, .modal-container * { opacity: 1 !important; background-clip: padding-box !important; mix-blend-mode: normal !important }
.btn-close { background: none; border: none; font-size: 1.25rem }
@keyframes modalSlideIn { from { opacity:0; transform: translateY(-50px) scale(.95)} to { opacity:1; transform: translateY(0) scale(1)} }
</style>
