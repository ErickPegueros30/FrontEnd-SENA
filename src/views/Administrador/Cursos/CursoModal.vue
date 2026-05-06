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
            <label class="form-label">Miniatura</label>
            <div class="file-drop" @drop.prevent="onThumbDrop" @dragover.prevent>
              <div class="file-drop-content">
                <div v-if="thumbPreview" class="thumb-preview mb-2">
                  <img :src="thumbPreview" alt="miniatura" />
                  <div class="mt-2">
                    <button type="button" class="btn btn-sm btn-outline-danger me-2" @click="removeThumb">Eliminar</button>
                  </div>
                </div>
                <div v-else class="mb-2">Arrastra una imagen o</div>
                <input ref="thumbInput" type="file" accept="image/*" class="form-control" @change="onThumbChange" />
              </div>
            </div>
          </div>
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
              <label class="form-label">Nivel</label>
              <select v-model="form.nivel" class="form-select input-enhanced">
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="especializacion">Especialización</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Máx participantes</label>
              <input v-model.number="form.capacidad" type="number" class="form-control input-enhanced" min="1" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Instructor</label>
              <div class="d-flex align-items-center gap-2">
                <select v-model="form.instructorId" class="form-select input-enhanced">
                  <option :value="null">Seleccionar instructor</option>
                  <option v-for="u in instructors" :key="u.id" :value="u.id">{{ u.name }} ({{ u.role }})</option>
                </select>
                <div class="instructor-select-preview">
                  <template v-if="selectedInstructor?.avatar">
                    <img :src="selectedInstructor.avatar" alt="Instructor" class="avatar-img" />
                  </template>
                  <template v-else-if="selectedInstructor">
                    <div class="avatar-initials" :style="{ background: getInstructorColor(selectedInstructor) }">{{ getInitials(selectedInstructor.name) }}</div>
                  </template>
                </div>
              </div>
            </div>
            <div class="col-12">
              <label class="form-label">Temario</label>
              <div class="mb-2">
                <div class="d-flex gap-2">
                  <input v-model="newTemarioItem" class="form-control" placeholder="Añadir ítem de temario" @keyup.enter="addTemarioItem" />
                  <button type="button" class="btn btn-primary" @click="addTemarioItem">Añadir</button>
                </div>
              </div>
              <table class="table table-sm">
                <thead><tr><th>Ítem</th><th style="width:90px">Acciones</th></tr></thead>
                <tbody>
                  <tr v-for="(t, idx) in form.temario" :key="idx">
                    <td>
                      <input v-model="form.temario[idx]" class="form-control form-control-sm" />
                    </td>
                    <td>
                      <button type="button" class="btn btn-sm btn-danger" @click="removeTemarioItem(idx)">Eliminar</button>
                    </td>
                  </tr>
                  <tr v-if="!form.temario || form.temario.length === 0"><td colspan="2" class="text-muted">No hay ítems</td></tr>
                </tbody>
              </table>
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
import { ref, watch, onMounted, nextTick, onBeforeUnmount, computed } from 'vue'

const props = withDefaults(defineProps<{ curso?: any; mode: 'create' | 'edit' }>(), { mode: 'create' })
const emit = defineEmits(['save', 'close'])

import { API_BASE } from '@/config/api'

const form = ref({
  id: 0,
  title: '',
  description: '',
  thumbnailDataUrl: '',
  startDate: '',
  endDate: '',
  modality: 'virtual',
  capacidad: 20,
  nivel: 'basico',
  featured: false,
  instructorId: null,
  temario: [] as string[]
})

// Refs to force inline styles like EventModal
const backdropRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

// Thumbnail refs (declarar antes del watch para evitar acceso antes de inicialización)
const thumbInput = ref<HTMLInputElement | null>(null)
const thumbPreview = ref<string | null>(null)
const instructors = ref<Array<{ id: number; name: string; role?: string }>>([])
const newTemarioItem = ref('')

const selectedInstructor = computed(() => {
  return instructors.value.find(i => String(i.id) === String(form.value.instructorId)) || null
})

const getInitials = (name?: string | null) => {
  if (!name) return 'U'
  return String(name).trim().charAt(0).toUpperCase()
}

const getInstructorColor = (instr?: any) => {
  const name = instr && instr.name ? String(instr.name) : ''
  const colors = ['#1E9E4A', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#607D8B']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i)
  return colors[Math.abs(hash) % colors.length]
}

watch(() => props.curso, (c) => {
  if (c) {
    form.value = {
      id: c.id || 0,
      title: c.title || '',
      description: c.description || '',
      thumbnailDataUrl: c.thumbnailUrl || '',
      startDate: c.startDate || '',
      endDate: c.endDate || '',
      modality: c.modality || 'virtual',
      capacidad: c.capacidad || c.maxParticipants || 20,
      nivel: c.nivel || 'basico',
      featured: !!c.featured,
      instructorId: c.instructor?.id || c.organizador_id || null,
      temario: c.temario ? [...c.temario] : (c.temarioString ? String(c.temarioString).split('\n') : [])
    }
    thumbPreview.value = form.value.thumbnailDataUrl || null
  } else {
    const today = new Date().toISOString().split('T')[0]
    form.value = { id: 0, title: '', description: '', thumbnailDataUrl: '', startDate: today, endDate: today, modality: 'virtual', capacidad: 20, nivel: 'basico', featured: false, instructorId: null, temario: [] }
    thumbPreview.value = null
  }
}, { immediate: true })

const save = () => {
  // Ensure temario is trimmed and no empty items
  form.value.temario = (form.value.temario || []).map((s: string) => String(s).trim()).filter(Boolean)
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
          // Usar fondos opacos para evitar transparencias que oculten detalles
          const backdropColor = theme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,1)'
          el.style.setProperty('background-color', backdropColor, 'important')
          el.style.setProperty('pointer-events', 'auto', 'important')
        }
        // Asegurar que el contenedor principal tenga fondo opaco
        el.style.setProperty('background-color', 'var(--color-light, #ffffff)', 'important')
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
          // Forzar fondo sólido en elementos que puedan heredar transparencias
          const bg = window.getComputedStyle(d).backgroundColor
          if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
            d.style.setProperty('background-color', 'transparent', 'important')
          }
        })
      } catch (e) { }
    }
    setImportant(backdropRef.value, true)
    setImportant(containerRef.value, false)
  }

  nextTick(() => { forceOpaque(); setTimeout(forceOpaque, 120) })

  onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))
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
        form.value.thumbnailDataUrl = dataUrl
      } catch (err) {
        thumbPreview.value = reader.result as string
        form.value.thumbnailDataUrl = reader.result as string
      }
    }
    img.src = reader.result as string
  }
  reader.readAsDataURL(file)
}

const onThumbChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) processFile(input.files[0])
}

const onThumbDrop = (e: DragEvent) => {
  const dt = e.dataTransfer
  if (!dt) return
  const file = dt.files && dt.files[0]
  if (file) processFile(file)
}

const removeThumb = () => {
  thumbPreview.value = null
  form.value.thumbnailDataUrl = ''
  if (thumbInput.value) thumbInput.value.value = ''
}

// Temario helpers
const addTemarioItem = () => {
  const v = String(newTemarioItem.value || '').trim()
  if (!v) return
  if (!Array.isArray(form.value.temario)) form.value.temario = []
  form.value.temario.push(v)
  newTemarioItem.value = ''
}
const removeTemarioItem = (idx: number) => {
  if (!Array.isArray(form.value.temario)) return
  form.value.temario.splice(idx, 1)
}

// Load instructors (only admin/empleado roles)
const loadInstructors = async () => {
  try {
    const token = localStorage.getItem('token')
    const headers: Record<string,string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/users/instructors`, { headers })
    if (!res.ok) return
    const body = await res.json()
    const data = Array.isArray(body) ? body : (body && body.data ? body.data : [])
    if (!Array.isArray(data)) return
    const apiRoot = API_BASE.replace(/\/api\/?$/, '')
    instructors.value = data.map((u: any) => {
      const rawAvatar = u.foto_perfil || u.avatar || null
      let avatar = rawAvatar
      if (avatar && !String(avatar).startsWith('http')) {
        avatar = `${apiRoot}${avatar.startsWith('/') ? '' : '/'}${avatar}`
      }
      return {
        id: u.id || u.id_usuario,
        name: u.name || u.nombre || `${u.nombre} ${u.primer_apellido || ''}`.trim(),
        role: u.role || u.id_rol,
        avatar: avatar || null
      }
    })

    // default instructor to current user if possible
    try {
      const meRaw = localStorage.getItem('user')
      if (meRaw) {
        const me = JSON.parse(meRaw)
        if (me && me.id && !form.value.instructorId) {
          const found = instructors.value.find(i => i.id === me.id)
          if (found) form.value.instructorId = found.id
        }
      }
    } catch (e) { }
  } catch (err) { }
}

onMounted(() => {
  loadInstructors()
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

.avatar-initials {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}
.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}
.instructor-select-preview { min-width: 40px }
</style>
