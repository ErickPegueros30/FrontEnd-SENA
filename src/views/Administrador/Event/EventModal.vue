<template>
  <div class="modal-backdrop" @click.self="close" ref="backdropRef">
    <div class="modal-container" :class="`modal-${size}`" ref="containerRef">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="bi" :class="modalIcon"></i>
          {{ modalTitle }}
        </h5>
        <button class="btn-close" @click="close"></button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="save">
          <div class="row g-3">
            <div class="col-12">
              <div class="form-section p-3 rounded">
                <label class="form-label fw-600">Título del Evento *</label>
                <input
                  v-model="formData.title"
                  type="text"
                  class="form-control input-enhanced"
                  :class="{ 'is-invalid': errors.title }"
                  placeholder="Ej: Capacitación en Normas ISO"
                  required
                >
                <div v-if="errors.title" class="invalid-feedback">
                  {{ errors.title }}
                </div>

                <label class="form-label mt-3">Descripción</label>
                <textarea
                  v-model="formData.description"
                  class="form-control input-enhanced"
                  rows="3"
                  placeholder="Descripción detallada del evento..."
                ></textarea>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Tipo de Evento *</label>
                <select
                  v-model="formData.type"
                  class="form-select input-enhanced"
                  :class="{ 'is-invalid': errors.type }"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="training">Capacitación</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="calibration">Calibración</option>
                  <option value="meeting">Reunión</option>
                  <option value="other">Otro</option>
                </select>
                <div v-if="errors.type" class="invalid-feedback">
                  {{ errors.type }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Estado *</label>
                <select
                  v-model="formData.status"
                  class="form-select input-enhanced"
                  :class="{ 'is-invalid': errors.status }"
                  required
                >
                  <option value="">Seleccionar estado</option>
                  <option value="activo">Activo</option>
                  <option value="proximo">Próximo</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <div v-if="errors.status" class="invalid-feedback">
                  {{ errors.status }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Fecha de Inicio *</label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  class="form-control input-enhanced"
                  :class="{ 'is-invalid': errors.startDate }"
                  required
                >
                <div v-if="errors.startDate" class="invalid-feedback">
                  {{ errors.startDate }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Fecha de Fin *</label>
                <input
                  v-model="formData.endDate"
                  type="date"
                  class="form-control input-enhanced"
                  :class="{ 'is-invalid': errors.endDate }"
                  required
                >
                <div v-if="errors.endDate" class="invalid-feedback">
                  {{ errors.endDate }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Hora de Inicio *</label>
                <input
                  v-model="formData.startTime"
                  type="time"
                  class="form-control input-enhanced"
                  :class="{ 'is-invalid': errors.startTime }"
                  required
                >
                <div v-if="errors.startTime" class="invalid-feedback">
                  {{ errors.startTime }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Hora de Fin *</label>
                <input
                  v-model="formData.endTime"
                  type="time"
                  class="form-control input-enhanced"
                  :class="{ 'is-invalid': errors.endTime }"
                  required
                >
                <div v-if="errors.endTime" class="invalid-feedback">
                  {{ errors.endTime }}
                </div>
              </div>
            </div>

            <div class="col-md-8" v-if="formData.modality !== 'virtual'">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Ubicación *</label>
                <input
                  v-model="formData.location"
                  type="text"
                  class="form-control input-enhanced"
                  :class="{ 'is-invalid': errors.location }"
                  placeholder="Ej: Sala de Conferencias A"
                  required
                >
                <div v-if="errors.location" class="invalid-feedback">
                  {{ errors.location }}
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Máx. Participantes</label>
                <input
                  v-model="formData.maxParticipants"
                  type="number"
                  class="form-control input-enhanced"
                  min="1"
                  max="100"
                >
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Modalidad *</label>
                <select v-model="formData.modality" class="form-select input-enhanced">
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section p-3 rounded h-100">
                <label class="form-label">Miniatura</label>
                <div
                  class="file-drop mt-2"
                  @drop.prevent="onThumbDrop"
                  @dragover.prevent
                  @click="thumbInput && thumbInput.click && thumbInput.click()"
                >
                  <input ref="thumbInput" type="file" accept="image/*" class="d-none" @change="onThumbChange">
                  <div class="file-drop-content">
                    <i class="bi bi-image" style="font-size:1.5rem;color:rgba(0,0,0,0.5)"></i>
                    <div class="mt-2">Arrastra aquí o haz clic para seleccionar una imagen</div>
                    <small class="text-muted">JPG/PNG hasta 2MB (se comprimirá automáticamente)</small>
                  </div>
                </div>
                <div v-if="thumbPreview" class="mt-3 thumb-preview d-flex align-items-start gap-2">
                  <img :src="thumbPreview" alt="miniatura" />
                  <div class="d-flex flex-column align-items-start">
                    <button class="btn btn-sm btn-outline-secondary mb-2" @click="removeThumb">
                      <i class="bi bi-x-circle me-1"></i>Quitar imagen
                    </button>
                    <small class="text-muted">Previsualización — haz clic en Guardar para aplicar</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="form-section p-3 rounded">
                <label class="form-label">Notas Adicionales</label>
                <textarea
                  v-model="formData.notes"
                  class="form-control input-enhanced"
                  rows="2"
                  placeholder="Información adicional, requisitos, materiales necesarios..."
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">
          Cancelar
        </button>
        <button class="btn btn-primary" @click="save" :disabled="loading">
          <template v-if="loading">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Guardando...
          </template>
          <template v-else>
            <i class="bi bi-check-circle me-2"></i>
            {{ mode === 'create' ? 'Crear Evento' : 'Actualizar Evento' }}
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'

interface Props {
  event?: any
  mode: 'create' | 'edit'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

interface Emits {
  (e: 'save', event: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg'
})

const emit = defineEmits<Emits>()

// Form state
const formData = ref({
  id: 0,
  title: '',
  description: '',
  type: '',
  status: '',
  modality: 'virtual',
  thumbnailDataUrl: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  location: '',
  maxParticipants: 20,
  notes: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const thumbInput = ref<HTMLInputElement | null>(null)
const thumbPreview = ref<string | null>(null)

// Refs for forcing inline styles to avoid external translucency/backdrop filters
const backdropRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

// Computed
const modalTitle = computed(() => {
  return props.mode === 'create' ? 'Crear Nuevo Evento' : 'Editar Evento'
})

const modalIcon = computed(() => {
  return props.mode === 'create' ? 'bi-calendar-plus' : 'bi-calendar-check'
})

// Methods
const validate = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.title.trim()) {
    errors.value.title = 'El título es requerido'
    isValid = false
  }

  if (!formData.value.type) {
    errors.value.type = 'El tipo de evento es requerido'
    isValid = false
  }

  if (!formData.value.status) {
    errors.value.status = 'El estado es requerido'
    isValid = false
  }

  if (!formData.value.startDate) {
    errors.value.startDate = 'La fecha de inicio es requerida'
    isValid = false
  }

  if (!formData.value.endDate) {
    errors.value.endDate = 'La fecha de fin es requerida'
    isValid = false
  } else if (formData.value.startDate && formData.value.endDate < formData.value.startDate) {
    errors.value.endDate = 'La fecha de fin no puede ser anterior a la fecha de inicio'
    isValid = false
  }

  if (!formData.value.startTime) {
    errors.value.startTime = 'La hora de inicio es requerida'
    isValid = false
  }

  if (!formData.value.endTime) {
    errors.value.endTime = 'La hora de fin es requerida'
    isValid = false
  } else if (formData.value.startTime && formData.value.endTime <= formData.value.startTime) {
    errors.value.endTime = 'La hora de fin debe ser posterior a la hora de inicio'
    isValid = false
  }

  if (formData.value.modality !== 'virtual') {
    if (!formData.value.location || !formData.value.location.trim()) {
      errors.value.location = 'La ubicación es requerida'
      isValid = false
    }
  }

  return isValid
}

// Clear location when modality becomes virtual
watch(() => formData.value.modality, (m) => {
  if (m === 'virtual') formData.value.location = ''
})

const save = async () => {
  if (!validate()) return

  loading.value = true

  try {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Preparar datos para enviar
    const eventData = {
      ...formData.value,
      typeLabel: getTypeLabel(formData.value.type),
      statusLabel: getStatusLabel(formData.value.status),
      organizer: { id: 1, name: 'Admin SENA', email: 'admin@sena.com', role: 'Administrador' },
      participants: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    // include thumbnailDataUrl if present
    if (thumbPreview.value && !formData.value.thumbnailDataUrl) {
      eventData.thumbnailDataUrl = thumbPreview.value
      formData.value.thumbnailDataUrl = thumbPreview.value
    }
    emit('save', eventData)
  } catch (error) {
    console.error('Error al guardar el evento:', error)
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('close')
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    training: 'Capacitación',
    maintenance: 'Mantenimiento',
    calibration: 'Calibración',
    meeting: 'Reunión',
    other: 'Otro'
  }
  return labels[type] || type
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    activo: 'Activo',
    proximo: 'Próximo',
    completado: 'Completado',
    cancelado: 'Cancelado'
  }
  return labels[status] || status
}

// Watch for prop changes
watch(() => props.event, (newEvent) => {
  if (newEvent) {
    formData.value = {
      id: newEvent.id || 0,
      title: newEvent.title || '',
      description: newEvent.description || '',
      type: newEvent.type || '',
      status: newEvent.status || '',
      modality: newEvent.modality || 'virtual',
      thumbnailDataUrl: newEvent.thumbnailUrl || '',
      startDate: newEvent.startDate || '',
      endDate: newEvent.endDate || '',
      startTime: newEvent.startTime || '',
      endTime: newEvent.endTime || '',
      location: newEvent.location || '',
      maxParticipants: newEvent.maxParticipants || 20,
      notes: newEvent.notes || ''
    }
    thumbPreview.value = newEvent.thumbnailUrl || null
  } else {
    // Reset form for new event
    const today = new Date().toISOString().split('T')[0]
    formData.value = {
      id: 0,
      title: '',
      description: '',
      type: '',
        status: 'proximo',
      modality: 'virtual',
      startDate: today,
      endDate: today,
      startTime: '09:00',
      endTime: '13:00',
      location: '',
      maxParticipants: 20,
      notes: ''
    }
  }
}, { immediate: true })

// Handle escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }

  document.addEventListener('keydown', handleEscape)

  // Force inline styles after render to override any external stylesheet or extension rules
  const forceOpaque = () => {
    const setImportant = (el: HTMLElement | null, isBackdrop = false) => {
      if (!el) return
      try {
        // Backdrop specific
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

        // Force styles on all descendants
        const descendants = el.querySelectorAll<HTMLElement>('*')
        descendants.forEach(d => {
          d.style.setProperty('opacity', '1', 'important')
          d.style.setProperty('mix-blend-mode', 'normal', 'important')
          d.style.setProperty('backdrop-filter', 'none', 'important')
          d.style.setProperty('-webkit-backdrop-filter', 'none', 'important')
        })
      } catch (e) {
        // defensive: ignore failures in strict environments
      }
    }

    setImportant(backdropRef.value, true)
    setImportant(containerRef.value, false)
  }

  nextTick(() => {
    forceOpaque()
    // re-run shortly in case something overrides after mount
    setTimeout(forceOpaque, 120)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

const processFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const maxW = 800
      const maxH = 600
      let w = img.width
      let h = img.height
      const ratio = w / h
      if (w > maxW) { w = maxW; h = Math.round(w / ratio) }
      if (h > maxH) { h = maxH; w = Math.round(h * ratio) }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, w, h)
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        thumbPreview.value = dataUrl
        formData.value.thumbnailDataUrl = dataUrl
      } catch (err) {
        thumbPreview.value = reader.result as string
        formData.value.thumbnailDataUrl = reader.result as string
      }
    }
    img.src = reader.result as string
  }
  reader.readAsDataURL(file)
}

const onThumbChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

const onThumbDrop = (e: DragEvent) => {
  const dt = e.dataTransfer
  if (!dt) return
  const file = dt.files && dt.files[0]
  if (file) processFile(file)
}

const removeThumb = () => {
  thumbPreview.value = null
  formData.value.thumbnailDataUrl = ''
  // also clear file input if available
  if (thumbInput && (thumbInput as any).value) (thumbInput as any).value.value = null
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647 !important;
  padding: 1rem;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

.modal-container {
  background-color: var(--color-light, #ffffff) !important;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
  opacity: 1 !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  background-clip: padding-box;
  position: relative !important;
  z-index: 2147483648 !important;
  mix-blend-mode: normal !important;
}

[data-bs-theme="dark"] .modal-container {
  background-color: var(--modal-bg-dark, #0b0b0b) !important;
  color: var(--color-light, #f8f9fa) !important;
  border: 1px solid rgba(255,255,255,0.06) !important;
}

.modal-sm {
  width: 400px;
  max-width: 100%;
}

.modal-md {
  width: 600px;
  max-width: 100%;
}

.modal-lg {
  width: 800px;
  max-width: 100%;
}

.modal-xl {
  width: 1000px;
  max-width: 100%;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-weight: 600;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .modal-title {
  color: var(--color-dark, #f8f9fa);
}

.modal-title i {
  color: var(--color-primary, #1E9E4A);
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: var(--color-gray-light, #e9ecef);
  color: var(--color-dark, #212529);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-gray-light, #e9ecef);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Enhanced form & controls */
.form-section { background: rgba(250,252,251,1); }
.modal-container .form-section { padding: 1rem; }

[data-bs-theme="dark"] .form-section { background: rgba(22,22,22,1); }

.input-enhanced {
  background-color: #fff !important;
  color: #212529 !important;
  border: 1px solid #e6e6e6 !important;
}

[data-bs-theme="dark"] .input-enhanced {
  background-color: #121212 !important;
  color: #f1f1f1 !important;
  border: 1px solid rgba(255,255,255,0.06) !important;
}

/* Force full opacity for modal and all its children to avoid transparency */
.modal-container, .modal-container * {
  opacity: 1 !important;
  background-clip: padding-box !important;
  mix-blend-mode: normal !important;
}

.btn-close {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

[data-bs-theme="dark"] .btn-close { color: #ddd }

.modal-backdrop {
  align-items: flex-start;
  padding-top: 4vh;
}

/* Ensure modal sizes are responsive */
.modal-sm { width: 420px }
.modal-md { width: 680px }
.modal-lg { width: 900px }
.modal-xl { width: 1100px }

@media (max-width: 992px) {
  .modal-md, .modal-lg, .modal-xl { width: 92vw }
}
.input-enhanced:focus { box-shadow: 0 6px 20px rgba(16,24,40,0.06); border-color: var(--color-primary, #a7b729); outline: none; }
.form-label.fw-600 { font-weight: 700; }

.file-drop {
  border: 1px dashed rgba(16,24,40,0.08);
  border-radius: 8px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(250,250,250,1) 100%);
}
.file-drop:hover { border-color: rgba(167,183,41,0.18); box-shadow: 0 8px 18px rgba(16,24,40,0.04); }
.file-drop-content { display:flex; flex-direction:column; align-items:center; }
.thumb-preview img { max-width: 160px; border-radius: 8px; box-shadow: 0 8px 24px rgba(16,24,40,0.08); }

/* Buttons */
.btn-primary { background: var(--color-primary, #a7b729); border: none; box-shadow: 0 10px 30px rgba(167,183,41,0.12); color: white; }
.btn-secondary { background: transparent; color: var(--color-primary, #a7b729); border: 1px solid var(--color-primary, #a7b729); }
.btn-secondary:hover { background: rgba(167,183,41,0.08); }

/* small hover reveal for card description */
.event-card .card-body { transition: max-height 240ms ease, padding 220ms ease; }
.event-card:hover .card-text { white-space: normal; }

/* tooltip-ish organizer name on hover */
.organizer-name { position: relative; }
.organizer-name:hover::after { content: attr(data-full); position: absolute; left: 0; top: -30px; background: rgba(0,0,0,0.75); color: white; padding: 6px 8px; border-radius: 6px; font-size: 0.75rem; white-space: nowrap; }

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .modal-backdrop {
    padding: 0.5rem;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>
