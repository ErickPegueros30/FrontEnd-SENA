<template>
  <div class="modal-backdrop" @keydown.esc="$emit('close')" tabindex="-1">
    <div class="modal-card" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h3>Editar Programa</h3>
        <button class="close-btn" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
      </header>

      <section class="modal-body">
        <div class="left">
          <PdfThumbnail v-if="local.program?.fileUrl" :src="srcUrl(local.program.fileUrl)" :height="320" />
          <div v-else class="no-pdf">Sin PDF</div>
        </div>

        <div class="right">
          <label class="field-label">Título</label>
          <input class="field-input" v-model="local.title" />

          <label class="field-label" style="margin-top:8px">Descripción</label>
          <textarea class="field-textarea" rows="5" v-model="local.description"></textarea>

          <div class="row">
            <div style="flex:0 0 120px">
              <label class="field-label">Año</label>
              <input class="field-input" v-model.number="local.year" type="number" />
            </div>
            <div style="flex:1;margin-left:8px">
              <label class="field-label">Tipo</label>
              <select class="field-select" v-model="local.type">
                <option value="programa_anual_mexico">Programa anual México</option>
                <option value="programa_anual_colombia">Programa anual Colombia</option>
                <option value="agua">Agua</option>
                <option value="alimentos">Alimentos</option>
                <option value="intercomparaciones">Intercomparaciones</option>
              </select>
            </div>
          </div>

          <div class="actions">
            <button class="btn primary" @click="onSave"><i class="bi bi-save"></i> Guardar</button>
            <button class="btn" @click="$emit('close')">Cancelar</button>
            <button class="btn danger" @click="onDelete" v-if="local.program?.id"><i class="bi bi-trash"></i> Eliminar</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, watch, computed } from 'vue'
import { useApiBase } from '@/composables/useApiBase'
import { defineAsyncComponent } from 'vue'
const PdfThumbnail = defineAsyncComponent(() => import('./pdfmodal.vue'))

interface Props { program: any }
const props = defineProps<Props>()
const emit = defineEmits(['close', 'save', 'delete'])

const local = reactive({
  program: props.program ? { ...props.program } : null,
  title: props.program?.title || '',
  description: props.program?.description || '',
  year: props.program?.year || new Date().getFullYear(),
  type: props.program?.type || 'programa_anual_mexico'
})

watch(() => props.program, (next) => {
  if (!next) {
    local.program = null
    local.title = ''
    local.description = ''
    local.year = new Date().getFullYear()
    local.type = 'programa_anual_mexico'
    return
  }
  local.program = { ...next }
  local.title = next.title || ''
  local.description = next.description || ''
  local.year = next.year || new Date().getFullYear()
  local.type = next.type || 'programa_anual_mexico'
}, { immediate: true })

const { api } = useApiBase()
const uploadsBase = computed(() => {
  const raw = api.value || ''
  return raw.endsWith('/api') ? raw.slice(0, -4) : raw
})
const srcUrl = (u: string) => {
  if (!u) return ''
  try {
    if (u.startsWith('http')) {
      const p = new URL(u)
      return (uploadsBase.value || '') + p.pathname
    }
  } catch (e) {}
  return (uploadsBase.value || '') + u
}

const onSave = () => {
  emit('save', { id: local.program?.id, title: local.title, description: local.description, year: local.year, type: local.type })
}

const onDelete = () => {
  if (!local.program?.id) return
  if (confirm('¿Eliminar este programa?')) emit('delete', local.program.id)
}
</script>

<style scoped>
.modal-backdrop { position:fixed;inset:0;background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;z-index:3000;padding:16px;backdrop-filter: blur(4px);-webkit-backdrop-filter: blur(4px); }
.modal-card { width:100%;max-width:980px;background-color: rgba(255,255,255,0.99);border-radius:12px;overflow:hidden;box-shadow:0 28px 80px rgba(0,0,0,0.6); }
.modal-body { display:flex;gap:18px;padding:18px }
.modal-body { max-height: calc(100vh - 200px); overflow:auto }
.modal-header { display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #eee }
.modal-header h3 { margin:0;font-size:1.05rem }
.close-btn { background:transparent;border:0;font-size:1.1rem;cursor:pointer }
.left { flex:0 0 360px;min-width:220px }
.no-pdf { width:100%;height:320px;background:#f6f6f6;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#888 }
.right { flex:1;display:flex;flex-direction:column }
.field-label { font-weight:700;font-size:0.85rem;margin-bottom:6px }
.field-input, .field-select, .field-textarea { width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:8px;font-size:0.95rem }
.row { display:flex;gap:8px;margin-top:8px }
.actions { display:flex;gap:8px;justify-content:flex-end;margin-top:12px }
.modal-card { font-family: var(--font-body); }

/* responsive */
@media (max-width: 760px) {
  .modal-card { max-width: 680px }
  .modal-body { flex-direction: column; padding:14px }
  .left { width:100%;flex: none }
  .no-pdf { height:220px }
}

@media (max-width: 420px) {
  .modal-card { margin:12px; border-radius:8px }
  .no-pdf { height:180px }
  .actions { flex-direction:column-reverse; gap:6px }
}

/* dark theme */
[data-bs-theme="dark"] .modal-card { background:#0e1509; color:#e8f0db; border:1px solid rgba(122,171,61,0.08) }
[data-bs-theme="dark"] .modal-header { border-bottom-color: rgba(122,171,61,0.06) }
[data-bs-theme="dark"] .field-input, [data-bs-theme="dark"] .field-select, [data-bs-theme="dark"] .field-textarea { background:#131a0e; border-color: rgba(122,171,61,0.12); color:#e8f0db }
.btn { padding:8px 12px;border-radius:8px;border:1px solid #dcdcdc;background:#fafafa;cursor:pointer }
.btn.primary { background:linear-gradient(135deg,#5d8a2f,#7aab3d);color:#fff;border-color:transparent }
.btn.danger { background:#fff1f1;border-color:#f1c0c0;color:#9b2b2b }
</style>
