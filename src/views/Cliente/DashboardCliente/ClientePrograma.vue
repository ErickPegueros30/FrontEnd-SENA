<template>
  <div :data-bs-theme="currentTheme" class="programa-detalle">
    <!-- Breadcrumb -->
    <section class="breadcrumb-section">
      <div class="container">
        <nav class="custom-breadcrumb" aria-label="Ruta de navegación">
          <router-link to="/cliente" class="breadcrumb-link">
            <i class="bi bi-arrow-left"></i> Panel del cliente
          </router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ program.code || 'Ensayo' }}</span>
        </nav>
      </div>
    </section>

    <!-- Encabezado del programa -->
    <section class="program-header">
      <div class="container">
        <div v-if="loadingEnsayo" class="header-skeleton" aria-hidden="true">
          <div class="sk sk-eyebrow"></div>
          <div class="sk sk-title"></div>
          <div class="sk sk-meta"></div>
        </div>

        <div v-else class="header-card" data-aos="fade-up">
          <div class="header-row">
            <div class="header-main">
              <span class="section-eyebrow">Ensayo de aptitud</span>
              <h1 class="program-title">{{ program.code }}</h1>
              <p v-if="program.description" class="program-description">{{ program.title }}</p>
              <div class="program-meta">
                <span v-if="program.code"><i class="bi bi-upc"></i>{{ program.description }}</span>
                <span><i class="bi bi-calendar3"></i>Inicio: {{ formatDate(program.startDate) || 'Por definir' }}</span>
                <span v-if="program.enrolledAt"><i class="bi bi-check2-circle"></i>Inscrito el {{ formatDate(program.enrolledAt) }}</span>
              </div>
            </div>
            <div class="header-aside">
              <span class="status-badge" :class="program.status">
                <i :class="programStatus(program.status).icon"></i>
                {{ programStatus(program.status).label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="detalle-main">
      <div class="container">
        <!-- ============================================================
             Mis documentos (envío del cliente)
             ============================================================ -->
        <section class="my-docs-section">
          <div class="section-head" data-aos="fade-up">
            <div>
              <span class="eyebrow">Mi expediente</span>
              <h2 class="section-title">Documentos que debes enviar</h2>
              <p class="section-subtitle">Sube cada archivo cuando lo tengas listo. SENA confirmará su recepción.</p>
            </div>
            <div class="progress-summary">
              <div class="progress-numbers">
                <strong>{{ sentCount }}</strong><span>/ {{ DOC_SLOTS.length }} enviados</span>
              </div>
              <div
                class="progress-track"
                role="progressbar"
                :aria-valuenow="sentPercent"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Progreso de documentos enviados"
              >
                <div class="progress-fill" :style="{ width: sentPercent + '%' }"></div>
              </div>
            </div>
          </div>

          <div v-if="docsNotice" class="notice-banner" role="status">
            <i class="bi bi-info-circle-fill"></i>
            <span>{{ docsNotice }}</span>
          </div>

          <div class="slots-grid">
            <article
              v-for="(slot, idx) in DOC_SLOTS"
              :key="slot.key"
              class="slot-card"
              :class="[`is-${slotState[slot.key].estado}`, { 'is-busy': slotState[slot.key].uploading }]"
              data-aos="fade-up"
              :data-aos-delay="idx * 60"
            >
              <header class="slot-head">
                <div class="slot-icon"><i :class="slot.icon"></i></div>
                <div class="slot-meta">
                  <h3 class="slot-title">{{ slot.label }}</h3>
                  <p class="slot-desc">{{ slot.description }}</p>
                </div>
                <span class="status-pill" :class="`st-${slotState[slot.key].estado}`">
                  <i :class="docStatus(slotState[slot.key].estado).icon"></i>
                  {{ docStatus(slotState[slot.key].estado).label }}
                </span>
              </header>

              <!-- Documento ya enviado -->
              <div v-if="slotState[slot.key].doc" class="uploaded-file">
                <div class="file-icon"><i :class="fileIconFor(slotState[slot.key].doc!.nombre)"></i></div>
                <div class="file-meta">
                  <span class="file-name">{{ slotState[slot.key].doc!.nombre }}</span>
                  <span class="file-sub">
                    Enviado {{ formatDate(slotState[slot.key].doc!.fecha) || 'recientemente' }}
                  </span>
                </div>
                <div class="file-actions">
                  <button
                    class="icon-btn"
                    title="Ver documento"
                    aria-label="Ver documento"
                    @click="previewDocument(slotState[slot.key].doc!)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="icon-btn"
                    title="Descargar"
                    aria-label="Descargar documento"
                    @click="downloadDocument(slotState[slot.key].doc!)"
                  >
                    <i class="bi bi-download"></i>
                  </button>
                </div>
              </div>

              <p v-if="slotState[slot.key].motivo" class="slot-reason">
                <i class="bi bi-exclamation-circle-fill"></i>{{ slotState[slot.key].motivo }}
              </p>

              <!-- Archivo seleccionado, listo para enviar -->
              <div v-if="slotState[slot.key].file" class="picked-file">
                <div class="file-icon is-new"><i :class="fileIconFor(slotState[slot.key].file!.name)"></i></div>
                <div class="file-meta">
                  <span class="file-name">{{ slotState[slot.key].file!.name }}</span>
                  <span class="file-sub">{{ formatBytes(slotState[slot.key].file!.size) }}</span>
                </div>
                <button
                  class="icon-btn"
                  title="Quitar"
                  aria-label="Quitar archivo"
                  :disabled="slotState[slot.key].uploading"
                  @click="clearSlot(slot.key)"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>

              <!-- Zona para elegir archivo -->
              <label
                v-if="slotState[slot.key].estado !== 'recibido'"
                class="dropzone"
                :class="{ 'is-dragging': slotState[slot.key].dragging, 'is-invalid': slotState[slot.key].error }"
                @dragover.prevent="slotState[slot.key].dragging = true"
                @dragleave.prevent="slotState[slot.key].dragging = false"
                @drop.prevent="onDrop(slot.key, $event)"
              >
                <input
                  type="file"
                  class="visually-hidden"
                  :accept="slot.accept"
                  :disabled="slotState[slot.key].uploading"
                  @change="onPick(slot.key, $event)"
                />
                <i class="bi bi-cloud-arrow-up dz-icon"></i>
                <span class="dz-title">
                  {{ slotState[slot.key].doc ? 'Reemplazar archivo' : 'Arrastra o' }}
                  <span v-if="!slotState[slot.key].doc" class="link-like">selecciona el archivo</span>
                </span>
                <span class="dz-hint">{{ slot.hint }}</span>
              </label>

              <p v-if="slotState[slot.key].error" class="slot-error">
                <i class="bi bi-exclamation-triangle-fill"></i>{{ slotState[slot.key].error }}
              </p>

              <button
                v-if="slotState[slot.key].estado !== 'recibido'"
                class="btn btn-primary btn-block"
                :disabled="!slotState[slot.key].file || slotState[slot.key].uploading"
                @click="uploadSlot(slot.key)"
              >
                <span v-if="slotState[slot.key].uploading" class="spinner"></span>
                <i v-else class="bi bi-send"></i>
                {{ slotState[slot.key].uploading ? 'Enviando...' : (slotState[slot.key].doc ? 'Reemplazar' : 'Enviar') }}
              </button>
              <p v-else class="slot-done">
                <i class="bi bi-lock-fill"></i> SENA ya recibió este documento
              </p>
            </article>
          </div>
        </section>

        <!-- ============================================================
             Documentos del programa (publicados por SENA)
             ============================================================ -->
        <section class="documents-section">
          <div class="section-head" data-aos="fade-up">
            <div>
              <span class="eyebrow">Recursos</span>
              <h2 class="section-title">Documentos del programa</h2>
              <p class="section-subtitle">Material técnico, protocolos y guías publicados por SENA</p>
            </div>
            <button class="btn btn-secondary btn-sm" :disabled="loadingDocs" @click="fetchProgramDocuments">
              <span v-if="loadingDocs" class="spinner"></span>
              <i v-else class="bi bi-arrow-clockwise"></i>
              Actualizar
            </button>
          </div>

          <!-- Cargando -->
          <div v-if="loadingDocs && programDocuments.length === 0" class="documents-grid" aria-hidden="true">
            <div v-for="n in 3" :key="`skd-${n}`" class="document-card is-skeleton">
              <div class="sk sk-doc-icon"></div>
              <div class="doc-content">
                <div class="sk sk-line w-70"></div>
                <div class="sk sk-line w-50"></div>
              </div>
            </div>
          </div>

          <!-- Vacío -->
          <div v-else-if="programDocuments.length === 0" class="empty-state">
            <i class="bi bi-folder2-open"></i>
            <h4>Todavía no hay documentos publicados</h4>
            <p>Cuando SENA publique el protocolo, las guías o los resultados, aparecerán aquí.</p>
          </div>

          <!-- Lista -->
          <div v-else class="documents-grid">
            <article
              v-for="(doc, idx) in programDocuments"
              :key="doc.id"
              class="document-card"
              data-aos="fade-up"
              :data-aos-delay="idx * 50"
            >
              <div class="doc-icon-wrap"><i :class="fileIconFor(doc.nombre, doc.url)"></i></div>
              <div class="doc-content">
                <h4 class="doc-title">{{ doc.nombre }}</h4>
                <p v-if="doc.descripcion" class="doc-description">{{ doc.descripcion }}</p>
                <div class="doc-meta">
                  <span v-if="doc.tipo"><i class="bi bi-file-earmark"></i>{{ doc.tipo }}</span>
                  <span v-if="doc.fecha"><i class="bi bi-calendar-check"></i>{{ formatDate(doc.fecha) || doc.fecha }}</span>
                </div>
              </div>
              <div class="doc-actions">
                <button class="icon-btn" title="Ver" aria-label="Ver documento" @click="previewDocument(doc)">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-primary btn-sm" @click="downloadDocument(doc)">
                  <i class="bi bi-download"></i> Descargar
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>

    <!-- ============================================================
         Visor de documentos
         ============================================================ -->
    <Teleport to="body">
      <Transition name="pd-modal">
        <div
          v-if="showPdfModal"
          class="modal-overlay"
          :data-bs-theme="currentTheme"
          @click.self="closePdfModal"
        >
          <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="pd-modal-title">
            <div class="modal-header">
              <div class="modal-icon"><i class="bi bi-file-earmark-text-fill"></i></div>
              <h5 id="pd-modal-title" class="modal-title">{{ selectedDocument?.nombre || 'Documento' }}</h5>
              <a
                v-if="selectedUrl"
                :href="selectedUrl"
                class="btn btn-secondary btn-sm"
                target="_blank"
                rel="noopener"
              >
                <i class="bi bi-box-arrow-up-right"></i> Nueva pestaña
              </a>
              <button class="icon-btn" aria-label="Cerrar" @click="closePdfModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="modal-body">
              <iframe
                v-if="selectedUrl"
                :src="selectedUrl"
                class="pdf-embed"
                :title="selectedDocument?.nombre || 'Documento'"
              ></iframe>
              <div v-else class="modal-empty">
                <i class="bi bi-file-earmark-x"></i>
                <span>Este documento no tiene un archivo disponible.</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { API_BASE, getAuthHeaders } from '@/config/api'
import { useTheme } from '@/composables/useTheme'
import FooterComponent from '@/components/Footer/Footer.vue'

/* ============================================================
   Tipos
   ============================================================ */
type ProgramStatus = 'active' | 'completed' | 'pending'
type DocEstado = 'pendiente' | 'enviado' | 'recibido' | 'rechazado'

interface Documento {
  id: number | string
  nombre: string
  descripcion?: string
  tipo?: string
  fecha?: string
  url?: string
}

interface SlotDef {
  key: string
  label: string
  description: string
  icon: string
  accept: string
  extensions: string[]
  hint: string
}

interface SlotState {
  file: File | null
  doc: Documento | null
  estado: DocEstado
  motivo: string
  uploading: boolean
  error: string
  dragging: boolean
}

interface StatusMeta { label: string; icon: string }

/* ============================================================
   Configuración
   ------------------------------------------------------------
   Los documentos que el cliente debe enviar se definen AQUÍ.
   Para agregar o quitar uno, basta con editar este arreglo:
   la interfaz, el contador y las subidas se generan a partir de él.
   `key` es lo que se envía al backend como tipo de documento.
   ============================================================ */
const DOC_SLOTS: SlotDef[] = [
  {
    key: 'cotizacion',
    label: 'Cotización',
    description: 'Cotización del ensayo firmada o aceptada por tu laboratorio.',
    icon: 'bi bi-receipt',
    accept: 'application/pdf,.pdf',
    extensions: ['pdf'],
    hint: 'PDF · máx. 15 MB'
  },
  {
    key: 'sn50-firmado',
    label: 'SN-50 firmado',
    description: 'Formato SN-50 completo y firmado por el responsable.',
    icon: 'bi bi-file-earmark-medical',
    accept: 'application/pdf,.pdf',
    extensions: ['pdf'],
    hint: 'PDF · máx. 15 MB'
  },
  {
    key: 'carta-aceptacion-protocolo',
    label: 'Carta de aceptación del protocolo',
    description: 'Carta donde aceptas las condiciones del protocolo del ensayo.',
    icon: 'bi bi-envelope-paper',
    accept: 'application/pdf,.pdf',
    extensions: ['pdf'],
    hint: 'PDF · máx. 15 MB'
  },
  {
    key: 'protocolo-firmado',
    label: 'Protocolo firmado',
    description: 'Protocolo del ensayo con la firma de tu laboratorio.',
    icon: 'bi bi-file-earmark-check',
    accept: 'application/pdf,.pdf',
    extensions: ['pdf'],
    hint: 'PDF · máx. 15 MB'
  },
  {
    key: 'formato-entrega',
    label: 'Formato de entrega',
    description: 'Formato que acompaña la entrega del ítem de ensayo.',
    icon: 'bi bi-box-arrow-up',
    accept: 'application/pdf,.pdf',
    extensions: ['pdf'],
    hint: 'PDF · máx. 15 MB'
  },
  {
    key: 'formato-recibido',
    label: 'Formato de recibido',
    description: 'Formato firmado al recibir el ítem de ensayo.',
    icon: 'bi bi-box-arrow-in-down',
    accept: 'application/pdf,.pdf',
    extensions: ['pdf'],
    hint: 'PDF · máx. 15 MB'
  },
  {
    key: 'resultados',
    label: 'Resultados',
    description: 'Hoja con los resultados obtenidos en el ítem de ensayo.',
    icon: 'bi bi-table',
    accept: '.xlsx,.xls,.csv,application/pdf,.pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: ['xlsx', 'xls', 'csv', 'pdf'],
    hint: 'Excel, CSV o PDF · máx. 15 MB'
  }
]

const PROGRAM_STATUS: Record<ProgramStatus, StatusMeta> = {
  active: { label: 'En curso', icon: 'bi bi-play-circle-fill' },
  completed: { label: 'Completado', icon: 'bi bi-check-circle-fill' },
  pending: { label: 'Por iniciar', icon: 'bi bi-hourglass-split' }
}

const DOC_STATUS: Record<DocEstado, StatusMeta> = {
  pendiente: { label: 'Pendiente', icon: 'bi bi-dash-circle' },
  enviado: { label: 'Enviado', icon: 'bi bi-send-check-fill' },
  recibido: { label: 'Recibido', icon: 'bi bi-check-circle-fill' },
  rechazado: { label: 'Requiere corrección', icon: 'bi bi-exclamation-circle-fill' }
}

const programStatus = (s: string) => PROGRAM_STATUS[s as ProgramStatus] ?? PROGRAM_STATUS.pending
const docStatus = (s: string) => DOC_STATUS[s as DocEstado] ?? DOC_STATUS.pendiente

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

/*
 * ⚠️ Endpoints del expediente del cliente. Ajusta las rutas a tu backend.
 *    GET  misDocs  -> { ok, data: [{ tipo, nombre, url, estado, fecha, motivo }] }
 *    POST subirDoc -> body { tipo, fileName, fileDataUrl }
 */
const API = {
  ensayo: (id: string | number) => `${API_BASE}/api/ensayos/${id}`,
  ensayoDocs: (id: string | number) => `${API_BASE}/api/ensayos/${id}/documentos`,
  misEnsayos: `${API_BASE}/api/inscripciones/mis-ensayos`,
  misDocs: (id: string | number) => `${API_BASE}/api/inscripciones/mis-ensayos/${id}/documentos`,
  subirDoc: (id: string | number, tipo: string) => `${API_BASE}/api/inscripciones/mis-ensayos/${id}/documentos/${tipo}`
}

/* ============================================================
   Estado
   ============================================================ */
const route = useRoute()
const { currentTheme } = useTheme()

const ensayoId = computed(() => String(route.params.id ?? ''))

const loadingEnsayo = ref(true)
const loadingDocs = ref(true)
const docsNotice = ref('')

const program = reactive({
  id: '' as string | number,
  title: '',
  code: '',
  description: '',
  startDate: '' as string | null,
  enrolledAt: '' as string | null,
  status: 'pending' as ProgramStatus
})

const inscripcionId = ref<string | null>(null)

const programDocuments = ref<Documento[]>([])

const newSlotState = (): SlotState => ({
  file: null,
  doc: null,
  estado: 'pendiente',
  motivo: '',
  uploading: false,
  error: '',
  dragging: false
})

const slotState = reactive<Record<string, SlotState>>(
  Object.fromEntries(DOC_SLOTS.map(s => [s.key, newSlotState()]))
)

const sentCount = computed(() =>
  DOC_SLOTS.filter(s => ['enviado', 'recibido'].includes(slotState[s.key].estado)).length
)
const sentPercent = computed(() => Math.round((sentCount.value / DOC_SLOTS.length) * 100))

/* ============================================================
   Utilidades
   ============================================================ */
const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

const DATE_FMT = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

// 'YYYY-MM-DD' se construye en hora local (new Date('2026-12-20') es UTC y en México saldría 19 dic)
const formatDate = (value?: string | null): string => {
  if (!value) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value)
  return Number.isNaN(d.getTime()) ? '' : DATE_FMT.format(d)
}

const todayYmd = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const fileExt = (name = '') => (name.split('?')[0]?.split('.').pop() || '').toLowerCase()

const fileIconFor = (nombre = '', url = '') => {
  const ext = fileExt(nombre) || fileExt(url)
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'bi bi-file-earmark-spreadsheet-fill'
  if (['doc', 'docx'].includes(ext)) return 'bi bi-file-earmark-word-fill'
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'bi bi-file-earmark-image-fill'
  return 'bi bi-file-earmark-pdf-fill'
}

// Una sola función para resolver rutas (antes solo el preview lo hacía)
const resolveUrl = (url?: string | null): string => {
  if (!url) return ''
  const s = String(url).trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s) || s.startsWith('data:') || s.startsWith('blob:')) return s
  const origin = (API_BASE || '').replace(/\/api\/?$/, '') || window.location.origin
  return origin + (s.startsWith('/') ? s : `/${s}`)
}

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const validateFile = (file: File, extensions: string[]): string => {
  if (!extensions.includes(fileExt(file.name))) {
    return `Formato no permitido. Usa: ${extensions.map(e => `.${e}`).join(', ')}`
  }
  if (file.size > MAX_UPLOAD_BYTES) return 'El archivo supera 15 MB'
  return ''
}

/* ============================================================
   Carga de datos
   ============================================================ */
const fetchEnsayo = async () => {
  loadingEnsayo.value = true
  try {
    const resp = await fetch(API.ensayo(ensayoId.value), { headers: { ...getAuthHeaders() } })
    if (!resp.ok) return
    const body = await resp.json()
    const e = body.data || body
    program.id = e.id ?? ensayoId.value
    program.title = e.descripcion || e.codigo || 'Ensayo de aptitud'
    program.code = e.codigo || ''
    program.description = e.fechaDetalle || ''
    program.startDate = e.fechaInicioEnsayo || null
    program.status = !e.fechaInicioEnsayo
      ? 'pending'
      : e.fechaInicioEnsayo > todayYmd() ? 'pending' : 'active'
  } catch (err) {
    console.error('fetchEnsayo error', err)
  } finally {
    loadingEnsayo.value = false
  }
}

// Fecha de inscripción del usuario en este ensayo
const fetchMiInscripcion = async () => {
  try {
    const resp = await fetch(API.misEnsayos, { headers: { ...getAuthHeaders() } })
    if (!resp.ok) return
    const body = await resp.json()
    const list = Array.isArray(body.data) ? body.data : []
    const mine = list.find((i: any) => String(i?.ensayo?.id) === ensayoId.value)
    if (mine) {
      program.enrolledAt = mine.inscritoEn || null
      inscripcionId.value = mine.inscripcionId ?? null
    }
  } catch (err) {
    console.error('fetchMiInscripcion error', err)
  }
}

const mapDocumento = (d: any, i: number): Documento => ({
  id: d.id ?? d.id_documento ?? d.tipo ?? i,
  nombre: d.nombre || d.name || d.titulo || `Documento ${i + 1}`,
  descripcion: d.descripcion || d.description || '',
  tipo: (d.tipo || fileExt(d.nombre || d.url || d.ruta || '') || '').toString().toUpperCase(),
  fecha: d.fecha || d.createdAt || d.created_at || '',
  // Algunos endpoints devuelven 'ruta' en vez de 'url'
  url: resolveUrl(d.url || d.ruta || d.pdfUrl || d.archivo || '')
})

const fetchProgramDocuments = async () => {
  loadingDocs.value = true
  try {
    const resp = await fetch(API.ensayoDocs(ensayoId.value), { headers: { ...getAuthHeaders() } })
    if (!resp.ok) {
      // Sin documentos publicados (o endpoint aún no disponible): lista vacía, no datos inventados
      programDocuments.value = []
      return
    }
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : body.data || []
    programDocuments.value = rows.map(mapDocumento)
  } catch (err) {
    console.error('fetchProgramDocuments error', err)
    programDocuments.value = []
  } finally {
    loadingDocs.value = false
  }
}

// Normaliza el tipo que devuelve el backend contra las claves de DOC_SLOTS
const matchSlotKey = (tipo: string): string | null => {
  const norm = (v: string) => String(v).toLowerCase().replace(/[\s_]+/g, '-')
  const t = norm(tipo)
  const found = DOC_SLOTS.find(s => norm(s.key) === t)
  return found ? found.key : null
}

const fetchMisDocumentos = async () => {
  try {
    if (!inscripcionId.value) {
      docsNotice.value = 'Aún no estás inscrito en este ensayo. No hay expediente para subir.'
      return
    }
    const resp = await fetch(API.misDocs(inscripcionId.value), { headers: { ...getAuthHeaders() } })
    if (resp.status === 404) {
      docsNotice.value = 'El envío de documentos todavía no está habilitado en el servidor. Podrás subirlos en cuanto se active.'
      return
    }
    if (!resp.ok) return
    docsNotice.value = ''
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : body.data || []
    rows.forEach((d: any, i: number) => {
      const key = matchSlotKey(d.tipo || d.slug || '')
      if (!key) return
      const state = slotState[key]
      if (!state) return
      state.doc = mapDocumento(d, i)
      state.estado = (['pendiente', 'enviado', 'recibido', 'rechazado'].includes(d.estado) ? d.estado : 'enviado') as DocEstado
      state.motivo = d.motivo || d.observaciones || ''
    })
  } catch (err) {
    console.error('fetchMisDocumentos error', err)
  }
}

/* ============================================================
   Subida de documentos
   ============================================================ */
const setSlotFile = (key: string, file: File | null | undefined) => {
  const state = slotState[key]
  const slot = DOC_SLOTS.find(s => s.key === key)
  if (!state || !slot) return
  state.error = ''
  if (!file) return
  const err = validateFile(file, slot.extensions)
  if (err) { state.error = err; return }
  state.file = file
}

const onPick = (key: string, e: Event) => {
  const input = e.target as HTMLInputElement
  setSlotFile(key, input.files?.[0])
  input.value = ''
}

const onDrop = (key: string, e: DragEvent) => {
  const state = slotState[key]
  if (state) state.dragging = false
  setSlotFile(key, e.dataTransfer?.files?.[0])
}

const clearSlot = (key: string) => {
  const state = slotState[key]
  if (!state || state.uploading) return
  state.file = null
  state.error = ''
}

const uploadSlot = async (key: string) => {
  const state = slotState[key]
  const slot = DOC_SLOTS.find(s => s.key === key)
  if (!state || !slot || !state.file || state.uploading) return

  state.uploading = true
  state.error = ''
  try {
    const fileDataUrl = await readAsDataURL(state.file)
    if (!inscripcionId.value) throw new Error('No estás inscrito. No puedes subir documentos.')
    const resp = await fetch(API.subirDoc(inscripcionId.value, key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ tipo: key, fileName: state.file.name, fileDataUrl })
    })
    const body = await resp.json().catch(() => ({}))

    if (resp.status === 401 || resp.status === 403) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
    if (resp.status === 404) throw new Error('El servidor aún no acepta este envío. Avisa a SENA.')
    if (!resp.ok) throw new Error(body.message || `No se pudo enviar (HTTP ${resp.status})`)

    if (resp.status === 409) {
      // Ya existe: el servidor puede devolver el documento existente en data
      const data409 = body.data || body
      state.doc = mapDocumento({ nombre: state.file.name, fecha: new Date().toISOString(), ...(typeof data409 === 'object' ? data409 : {}) }, 0)
      state.estado = (data409 && data409.estado) || 'enviado'
      state.motivo = ''
      state.file = null
      // keep UI but notify
      state.error = ''
    } else {
      const data = body.data || body
      state.doc = mapDocumento({ nombre: state.file.name, fecha: new Date().toISOString(), ...(typeof data === 'object' ? data : {}) }, 0)
      state.estado = (data && data.estado) || 'enviado'
      state.motivo = ''
      state.file = null
    }
    // Refrescar desde servidor para asegurar consistencia y rutas correctas
    fetchMisDocumentos()
  } catch (err) {
    console.error('uploadSlot error', err)
    state.error = errorMessage(err)
  } finally {
    state.uploading = false
  }
}

/* ============================================================
   Visor de documentos
   ============================================================ */
const showPdfModal = ref(false)
const selectedDocument = ref<Documento | null>(null)
const selectedUrl = computed(() => resolveUrl(selectedDocument.value?.url))

const previewDocument = (doc: Documento) => {
  if (!doc) return
  const url = resolveUrl(doc.url)
  if (!url) return

  // Determinar extensión y origen
  const ext = fileExt(doc.nombre) || fileExt(url)
  let sameOrigin = false
  try {
    const u = new URL(url, window.location.href)
    sameOrigin = u.origin === window.location.origin
  } catch (e) {
    sameOrigin = false
  }

  // Si no es el mismo origen, muchos servidores (CDN) envían
  // `X-Frame-Options: sameorigin` y el iframe será bloqueado.
  // En esos casos abrimos el recurso en nueva pestaña en lugar
  // de intentar embeberlo.
  if (!sameOrigin) {
    window.open(url, '_blank', 'noopener')
    return
  }

  // Solo los PDF se ven embebidos; el resto se abre en una pestaña
  if (ext && ext !== 'pdf') {
    window.open(url, '_blank', 'noopener')
    return
  }

  selectedDocument.value = doc
  showPdfModal.value = true
}

const closePdfModal = () => {
  showPdfModal.value = false
  selectedDocument.value = null
}

const downloadDocument = (doc: Documento) => {
  const url = resolveUrl(doc?.url)
  if (url) window.open(url, '_blank', 'noopener')
}

/* ============================================================
   Comportamiento del modal
   ============================================================ */
watch(showPdfModal, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showPdfModal.value) closePdfModal()
}

/* ============================================================
   Ciclo de vida
   ============================================================ */
onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  window.addEventListener('keydown', onKeydown)
  if (!ensayoId.value) {
    loadingEnsayo.value = false
    loadingDocs.value = false
    return
  }
  await fetchEnsayo()
  // Obtener primero la inscripción (necesaria para listar/subir documentos)
  await fetchMiInscripcion()
  await Promise.all([fetchProgramDocuments(), fetchMisDocumentos()])
})

// Si la inscripción llega después (ej. creación en otra pestaña), recargar documentos
watch(inscripcionId, (val) => {
  if (val) fetchMisDocumentos()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

watch(currentTheme, (t) => {
  document.documentElement.setAttribute('data-bs-theme', t)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ============================================================
   TOKENS
   Antes estaban en :root, que en <style scoped> nunca coincide.
   Se aplican a la vista y al modal (que se teletransporta a <body>).
   ============================================================ */
.programa-detalle,
.modal-overlay {
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-text: #1c2b14;
  --sena-muted: #5a6a52;
  --sena-border: rgba(93, 138, 47, 0.14);

  --page-bg: #fafaf8;
  --surface: #ffffff;
  --surface-alt: #f6f9f2;

  --tone-ok: #1e7a3c;      --tone-ok-bg: rgba(25, 135, 84, 0.12);
  --tone-warn: #9a5b00;    --tone-warn-bg: rgba(255, 170, 0, 0.16);
  --tone-danger: #b42318;  --tone-danger-bg: rgba(220, 53, 69, 0.11);
  --tone-info: #0b5ed7;    --tone-info-bg: rgba(13, 110, 253, 0.1);
  --tone-neutral: #55616a; --tone-neutral-bg: rgba(108, 117, 125, 0.12);

  --radius-card: 20px;
  --radius-md: 14px;
  --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.10);
  --shadow-green: 0 8px 28px rgba(93, 138, 47, 0.22);
  --transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
}

.programa-detalle[data-bs-theme="dark"],
[data-bs-theme="dark"] .programa-detalle,
.modal-overlay[data-bs-theme="dark"] {
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122, 171, 61, 0.16);
  --sena-green-pale: rgba(93, 138, 47, 0.14);

  --page-bg: #0c0f0a;
  --surface: #131a0e;
  --surface-alt: #0f150b;

  --tone-ok: #5fd08a;
  --tone-warn: #f0b429;
  --tone-danger: #ff7b72;
  --tone-info: #6ea8fe;
  --tone-neutral: #a3adb5;

  --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.programa-detalle {
  font-family: var(--font-body);
  background: var(--page-bg);
  min-height: 100vh;
  color: var(--sena-text);
}

.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ============================================================
   BOTONES
   ============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
  border: 1.5px solid transparent;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--transition);
}
.btn:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
.btn:focus-visible { outline: 3px solid rgba(122, 171, 61, 0.45); outline-offset: 2px; }
.btn-primary {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  box-shadow: var(--shadow-green);
}
.btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(93, 138, 47, 0.3); }
.btn-secondary { background: transparent; border-color: var(--sena-green); color: var(--sena-green); }
[data-bs-theme="dark"] .btn-secondary { color: var(--sena-green-light); border-color: var(--sena-green-light); }
.btn-secondary:hover:not(:disabled) { background: var(--sena-green); border-color: var(--sena-green); color: #fff; }
.btn-sm { padding: 0.42rem 0.95rem; font-size: 0.78rem; }
.btn-block { width: 100%; margin-top: auto; }

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--sena-border);
  background: transparent;
  color: var(--sena-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  flex-shrink: 0;
}
.icon-btn:hover:not(:disabled) { border-color: var(--sena-green); color: var(--sena-green); }
.icon-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ============================================================
   BREADCRUMB + ENCABEZADO
   ============================================================ */
.breadcrumb-section {
  padding: 1.25rem 0;
  background: var(--surface);
  border-bottom: 1px solid var(--sena-border);
}
.custom-breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; flex-wrap: wrap; }
.breadcrumb-link { color: var(--sena-green); text-decoration: none; display: flex; align-items: center; gap: 0.4rem; font-weight: 600; }
.breadcrumb-link:hover { color: var(--sena-green-light); }
.breadcrumb-separator { color: var(--sena-muted); }
.breadcrumb-current { color: var(--sena-muted); font-weight: 500; }

.program-header {
  padding: 2.75rem 0;
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
}
.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.header-main { flex: 1; min-width: 0; }
.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(122, 171, 61, 0.9);
  background: rgba(122, 171, 61, 0.15);
  padding: 0.28rem 0.9rem;
  border-radius: 20px;
  margin-bottom: 0.7rem;
}
.program-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
}
.program-description { color: rgba(255, 255, 255, 0.78); font-size: 1rem; margin-bottom: 0.9rem; }
.program-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; color: rgba(255, 255, 255, 0.65); font-size: 0.85rem; }
.program-meta span { display: inline-flex; align-items: center; gap: 0.4rem; }
.program-meta i { color: var(--sena-green-light); }

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 1.15rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.82rem;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}
.status-badge.active { background: rgba(93, 138, 47, 0.35); border-color: rgba(122, 171, 61, 0.45); }
.status-badge.completed { background: rgba(108, 117, 125, 0.32); }

.header-skeleton { display: flex; flex-direction: column; gap: 0.75rem; }
.sk {
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.14) 37%, rgba(255,255,255,0.06) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 8px;
}
.sk-eyebrow { width: 130px; height: 22px; border-radius: 20px; }
.sk-title { width: min(460px, 70%); height: 40px; }
.sk-meta { width: min(340px, 60%); height: 18px; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

/* ============================================================
   SECCIONES
   ============================================================ */
.detalle-main { padding: 2.5rem 0 3.5rem; }

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  margin-bottom: 0.35rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--sena-text);
  margin: 0;
}
.section-subtitle { color: var(--sena-muted); font-size: 0.9rem; margin: 0.35rem 0 0; }

.my-docs-section { margin-bottom: 3rem; }

.progress-summary { min-width: 220px; }
.progress-numbers {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  justify-content: flex-end;
  margin-bottom: 0.4rem;
  color: var(--sena-muted);
  font-size: 0.82rem;
}
.progress-numbers strong { font-size: 1.35rem; color: var(--sena-text); font-variant-numeric: tabular-nums; }
.progress-track { height: 8px; border-radius: 999px; background: var(--sena-green-pale); overflow: hidden; }
.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  transition: width 0.5s ease;
}

.notice-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
  border-radius: var(--radius-md);
  background: var(--tone-info-bg);
  border: 1px solid rgba(13, 110, 253, 0.25);
  color: var(--tone-info);
  font-size: 0.86rem;
}
.notice-banner span { color: var(--sena-text); }

/* ============================================================
   TARJETAS DE DOCUMENTOS A ENVIAR
   ============================================================ */
.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.1rem;
}
.slot-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-left: 4px solid var(--tone-neutral);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.slot-card:hover { box-shadow: var(--shadow-md); }
.slot-card.is-enviado { border-left-color: var(--tone-info); }
.slot-card.is-recibido { border-left-color: var(--tone-ok); }
.slot-card.is-rechazado { border-left-color: var(--tone-danger); }
.slot-card.is-busy { opacity: 0.85; }

.slot-head { display: flex; align-items: flex-start; gap: 0.75rem; }
.slot-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--sena-green-pale);
  color: var(--sena-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.slot-meta { flex: 1; min-width: 0; }
.slot-title { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.15rem; color: var(--sena-text); }
.slot-desc { font-size: 0.78rem; line-height: 1.45; color: var(--sena-muted); margin: 0; }

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.24rem 0.6rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}
.st-pendiente { background: var(--tone-neutral-bg); color: var(--tone-neutral); }
.st-enviado { background: var(--tone-info-bg); color: var(--tone-info); }
.st-recibido { background: var(--tone-ok-bg); color: var(--tone-ok); }
.st-rechazado { background: var(--tone-danger-bg); color: var(--tone-danger); }

.uploaded-file,
.picked-file {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.7rem;
  border-radius: 12px;
  background: var(--surface-alt);
  border: 1px solid var(--sena-border);
}
.picked-file { background: var(--sena-green-pale); border-color: rgba(93, 138, 47, 0.3); }
.file-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tone-danger-bg);
  color: var(--tone-danger);
  flex-shrink: 0;
}
.file-icon.is-new { background: var(--surface); color: var(--sena-green); }
.file-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1rem; }
.file-name { font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-sub { font-size: 0.7rem; color: var(--sena-muted); }
.file-actions { display: flex; gap: 0.35rem; }
.file-actions .icon-btn { width: 32px; height: 32px; }

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 1.1rem 0.85rem;
  border: 2px dashed rgba(93, 138, 47, 0.35);
  border-radius: 14px;
  background: var(--surface-alt);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}
.dropzone:hover,
.dropzone.is-dragging { border-color: var(--sena-green); background: var(--sena-green-pale); }
.dropzone.is-invalid { border-color: var(--tone-danger); }
.dropzone:focus-within { outline: 3px solid rgba(122, 171, 61, 0.35); outline-offset: 2px; }
.dz-icon { font-size: 1.35rem; color: var(--sena-green); }
.dz-title { font-size: 0.8rem; font-weight: 600; }
.dz-hint { font-size: 0.7rem; color: var(--sena-muted); }
.link-like { color: var(--sena-green); text-decoration: underline; text-underline-offset: 2px; }

.slot-error,
.slot-reason {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--tone-danger);
  font-weight: 500;
}
.slot-done {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin: auto 0 0;
  padding: 0.6rem;
  border-radius: 12px;
  background: var(--tone-ok-bg);
  color: var(--tone-ok);
  font-size: 0.78rem;
  font-weight: 600;
}

/* ============================================================
   DOCUMENTOS DEL PROGRAMA
   ============================================================ */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1rem;
}
.document-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid var(--sena-border);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: var(--transition);
}
.document-card:hover { box-shadow: var(--shadow-md); border-color: var(--sena-green-light); }
.document-card.is-skeleton { pointer-events: none; }
.doc-icon-wrap {
  width: 48px;
  height: 48px;
  background: var(--sena-green-pale);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  color: var(--sena-green);
  flex-shrink: 0;
}
.doc-content { flex: 1; min-width: 0; }
.doc-title { font-size: 0.92rem; font-weight: 600; margin-bottom: 0.25rem; }
.doc-description { font-size: 0.78rem; color: var(--sena-muted); margin-bottom: 0.45rem; }
.doc-meta { display: flex; flex-wrap: wrap; gap: 0.3rem 1rem; font-size: 0.7rem; color: var(--sena-muted); }
.doc-meta span { display: inline-flex; align-items: center; gap: 0.3rem; }
.doc-actions { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; }

.sk-doc-icon { width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0; }
.sk-line { height: 12px; margin-bottom: 0.6rem; }
.w-70 { width: 70%; }
.w-50 { width: 50%; }
.document-card.is-skeleton .sk {
  background: linear-gradient(90deg, rgba(93,138,47,0.08) 25%, rgba(93,138,47,0.16) 37%, rgba(93,138,47,0.08) 63%);
  background-size: 400% 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--surface);
  border: 2px dashed var(--sena-border);
  border-radius: var(--radius-card);
}
.empty-state i { font-size: 2.6rem; color: var(--sena-muted); display: block; margin-bottom: 0.75rem; opacity: 0.7; }
.empty-state h4 { font-weight: 600; margin-bottom: 0.4rem; font-size: 1.05rem; }
.empty-state p { color: var(--sena-muted); font-size: 0.88rem; margin: 0 auto; max-width: 440px; }

/* ============================================================
   MODAL
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 14, 5, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.25rem;
  font-family: var(--font-body);
  color: var(--sena-text);
}
.modal-container {
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 1040px;
  height: min(88vh, 900px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--sena-border);
  flex-shrink: 0;
}
.modal-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: var(--sena-green-pale);
  color: var(--sena-green);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.modal-title {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  font-size: 0.98rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.modal-body { flex: 1; overflow: hidden; background: var(--surface-alt); display: flex; }
.pdf-embed { flex: 1; width: 100%; height: 100%; border: none; background: #525659; }
.modal-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: var(--sena-muted);
  font-size: 0.9rem;
}
.modal-empty i { font-size: 2.2rem; opacity: 0.6; }

.pd-modal-enter-active,
.pd-modal-leave-active { transition: opacity 0.2s ease; }
.pd-modal-enter-active .modal-container,
.pd-modal-leave-active .modal-container { transition: transform 0.24s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.2s ease; }
.pd-modal-enter-from,
.pd-modal-leave-to { opacity: 0; }
.pd-modal-enter-from .modal-container,
.pd-modal-leave-to .modal-container { transform: translateY(14px) scale(0.98); opacity: 0; }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .program-header { padding: 2rem 0; }
  .section-head { flex-direction: column; align-items: stretch; }
  .progress-summary { min-width: 0; }
  .progress-numbers { justify-content: flex-start; }
  .slots-grid,
  .documents-grid { grid-template-columns: 1fr; }
  .document-card { flex-wrap: wrap; }
  .doc-actions { flex-direction: row; width: 100%; justify-content: flex-end; }
  .modal-overlay { padding: 0; }
  .modal-container { height: 100vh; max-width: none; border-radius: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .sk, .spinner { animation: none; }
  .btn-primary:hover:not(:disabled) { transform: none; }
}
</style>
