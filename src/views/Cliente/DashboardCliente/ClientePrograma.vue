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
              <p v-if="program.title" class="program-description">{{ program.title }}</p>
              <div class="program-meta">
                <span v-if="program.description"><i class="bi bi-upc"></i>{{ program.description }}</span>
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
             Expediente del laboratorio
             Se puede subir mientras el documento esté PENDIENTE o RECHAZADO.
             Enviado y recibido quedan bloqueados.
             ============================================================ -->
        <section class="my-docs-section">
          <div class="section-head" data-aos="fade-up">
            <div>
              <span class="eyebrow">Mi expediente</span>
              <h2 class="section-title">Documentos que debes enviar</h2>
              <p class="section-subtitle">
                Sube cada archivo cuando lo tengas listo. Una vez enviado ya no se puede cambiar,
                salvo que SENA lo devuelva para corrección.
              </p>
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
              :class="`is-${slotState[slot.key].estado}`"
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

              <!-- Documento disponible -->
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

              <!-- Archivo elegido, listo para enviar -->
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

              <!-- Zona para elegir archivo: solo si está pendiente o fue rechazado -->
              <label
                v-if="puedeSubir(slot.key) && !slotState[slot.key].file"
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
                  {{ slotState[slot.key].estado === 'rechazado' ? 'Sube el archivo corregido' : 'Arrastra o' }}
                  <span v-if="slotState[slot.key].estado !== 'rechazado'" class="link-like">selecciona el archivo</span>
                </span>
                <span class="dz-hint">{{ slot.hint }}</span>
              </label>

              <p v-if="slotState[slot.key].error" class="slot-error">
                <i class="bi bi-exclamation-triangle-fill"></i>{{ slotState[slot.key].error }}
              </p>

              <button
                v-if="puedeSubir(slot.key)"
                class="btn btn-primary btn-block"
                :disabled="!slotState[slot.key].file || slotState[slot.key].uploading"
                @click="uploadSlot(slot.key)"
              >
                <span v-if="slotState[slot.key].uploading" class="spinner"></span>
                <i v-else class="bi bi-send"></i>
                {{ slotState[slot.key].uploading
                  ? 'Enviando...'
                  : (slotState[slot.key].estado === 'rechazado' ? 'Volver a enviar' : 'Enviar') }}
              </button>

              <p v-else-if="slotState[slot.key].estado === 'recibido'" class="slot-done">
                <i class="bi bi-check2-circle"></i> SENA ya recibió este documento
              </p>
              <p v-else class="slot-locked">
                <i class="bi bi-hourglass-split"></i>
                Enviado y en revisión. Si SENA lo devuelve, podrás subir una corrección.
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
            <button class="btn btn-secondary btn-sm" :disabled="loadingDocs" @click="recargarDocumentos">
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
              :class="['document-card', { 'is-individual': doc.slot || String(doc.tipo || '').toLowerCase() === 'individual' }]"
              data-aos="fade-up"
              :data-aos-delay="idx * 50"
            >
              <div :class="['doc-icon-wrap', { 'is-individual': doc.slot || String(doc.tipo || '').toLowerCase() === 'individual' }]">
                <i :class="fileIconFor(doc.nombre, doc.url)"></i>
              </div>
              <div class="doc-content">
                <h4 class="doc-title">{{ doc.nombre }}</h4>
                <p v-if="doc.descripcion" class="doc-description">{{ doc.descripcion }}</p>
                <div class="doc-meta">
                  <span v-if="doc.slot || String(doc.tipo || '').toLowerCase() === 'individual'" class="tag-individual"><i class="bi bi-person-badge"></i>Solo para tu laboratorio</span>
                  <span v-else-if="doc.tipo"><i class="bi bi-file-earmark"></i>{{ doc.tipo }}</span>
                  <span v-if="doc.fecha"><i class="bi bi-calendar-check"></i>{{ formatDate(doc.fecha) || doc.fecha }}</span>
                </div>
              </div>
              <div class="doc-actions">
                <button class="icon-btn" title="Ver" aria-label="Ver documento" :disabled="!doc.url" @click="previewDocument(doc)">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-primary btn-sm" :disabled="!doc.url" @click="downloadDocument(doc)">
                  <i class="bi bi-download"></i> Descargar
                </button>
              </div>
            </article>
          </div>
        </section>

        <!-- Sección de "Documentos individuales" ocultada: ahora se muestran dentro de "Documentos del programa" para evitar duplicados. -->
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
                v-if="originalUrl"
                :href="originalUrl"
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
              <div v-if="pdfLoading" class="modal-empty">
                <span class="spinner lg"></span>
                <span>Cargando documento...</span>
              </div>
              <iframe
                v-else-if="pdfSrc"
                :src="pdfSrc"
                class="pdf-embed"
                :title="selectedDocument?.nombre || 'Documento'"
              ></iframe>
              <div v-else class="modal-empty">
                <i class="bi bi-file-earmark-x"></i>
                <strong>No se pudo mostrar el documento aquí</strong>
                <span v-if="pdfError">{{ pdfError }}</span>
                <a
                  v-if="originalUrl"
                  :href="originalUrl"
                  class="btn btn-primary btn-sm"
                  target="_blank"
                  rel="noopener"
                >
                  <i class="bi bi-box-arrow-up-right"></i> Abrirlo en una pestaña nueva
                </a>
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
  /** 1, 2 o 3 cuando es uno de los documentos individuales de SENA */
  slot?: number
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
  doc: Documento | null
  estado: DocEstado
  motivo: string
  file: File | null
  uploading: boolean
  error: string
  dragging: boolean
}

interface StatusMeta { label: string; icon: string }

/* ============================================================
   Configuración
   ------------------------------------------------------------
   Documentos del expediente. Esta vista es de SOLO CONSULTA:
   el cliente no sube ni modifica nada desde aquí.
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
    description: 'Carta donde se aceptan las condiciones del protocolo del ensayo.',
    icon: 'bi bi-envelope-paper',
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

/** Estados en los que el cliente todavía puede subir o corregir el archivo */
const ESTADOS_EDITABLES: DocEstado[] = ['pendiente', 'rechazado']

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

const API = {
  ensayo: (id: string | number) => `${API_BASE}/api/ensayos/${id}`,
  ensayoDocs: (id: string | number) => `${API_BASE}/api/ensayos/${id}/documentos`,
  misEnsayos: `${API_BASE}/api/inscripciones/mis-ensayos`,
  inscripcion: (id: string | number) => `${API_BASE}/api/inscripciones/${id}`,
  misDocs: (id: string | number) => `${API_BASE}/api/inscripciones/mis-ensayos/${id}/documentos`,
  labDocs: (ensayoId: string | number, labId: string | number) =>
    `${API_BASE}/api/ensayos/${ensayoId}/laboratorios/${labId}/documentos`,
  subirDoc: (inscripcionId: string | number, tipo: string) =>
    `${API_BASE}/api/inscripciones/mis-ensayos/${inscripcionId}/documentos/${tipo}`
}

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

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
const laboratorioId = ref<string | number | null>(null)

const programDocuments = ref<Documento[]>([])
const documentosIndividuales = ref<Documento[]>([])

const newSlotState = (): SlotState => ({
  doc: null,
  estado: 'pendiente',
  motivo: '',
  file: null,
  uploading: false,
  error: '',
  dragging: false
})

const slotState = reactive<Record<string, SlotState>>(
  Object.fromEntries(DOC_SLOTS.map(s => [s.key, newSlotState()]))
)

/** Pendiente o rechazado: se puede subir. Enviado o recibido: bloqueado. */
const puedeSubir = (key: string) => ESTADOS_EDITABLES.includes(slotState[key].estado)

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

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })

const fileExt = (name = '') => (name.split('?')[0]?.split('.').pop() || '').toLowerCase()

const fileIconFor = (nombre = '', url = '') => {
  const ext = fileExt(nombre) || fileExt(url)
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'bi bi-file-earmark-spreadsheet-fill'
  if (['doc', 'docx'].includes(ext)) return 'bi bi-file-earmark-word-fill'
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'bi bi-file-earmark-image-fill'
  return 'bi bi-file-earmark-pdf-fill'
}

const resolveUrl = (url?: string | null): string => {
  if (!url) return ''
  const s = String(url).trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s) || s.startsWith('data:') || s.startsWith('blob:')) return s
  const origin = (API_BASE || '').replace(/\/api\/?$/, '') || window.location.origin
  return origin + (s.startsWith('/') ? s : `/${s}`)
}

/**
 * Detecta si una fila es uno de los 3 documentos individuales.
 * Acepta: columna `slot`, tipo 'individual-2' / 'documento-2',
 * o la clave url_doc2 / ruta_doc2 que devuelven algunos endpoints.
 */
const detectarSlot = (d: any): number | undefined => {
  const directo = Number(d?.slot ?? d?.posicion ?? d?.numero)
  if (directo >= 1 && directo <= 3) return directo

  // Detect slot from ID patterns like 'ind-123-s2' or 'doc-45-s1'
  try {
    const idStr = String(d?.id || d?.documento_id || d?.id_documento || '')
    const idMatch = /-s([1-3])(?:$|\D)/i.exec(idStr)
    if (idMatch) return Number(idMatch[1])
  } catch (e) { /* ignore */ }

  const porTipo = /(?:individual|documento|doc)[\s_-]*([123])\b/i.exec(String(d?.tipo || ''))
  if (porTipo) return Number(porTipo[1])

  for (const k of Object.keys(d || {})) {
    if (!d[k]) continue
    const m = /^(?:url|ruta|archivo|file)[\s_-]*(?:doc[\s_-]*)?([123])$/i.exec(k)
    if (m) return Number(m[1])
  }
  return undefined
}

const mapDocumento = (d: any, i: number): Documento => ({
  id: d.id ?? d.documento_id ?? d.id_documento ?? d.tipo ?? i,
  // El nombre lo define SENA al subirlo; si aún no tiene, se muestra genérico
  nombre: d.nombre || d.titulo || d.title || d.name || `Documento ${i + 1}`,
  descripcion: d.descripcion || d.description || '',
  tipo: (d.tipo || fileExt(d.nombre || d.url || d.ruta || '') || '').toString().toUpperCase(),
  fecha: d.fecha || d.updated_at || d.createdAt || d.created_at || '',
  url: resolveUrl(d.url || d.ruta || d.ruta_relativa || d.pdfUrl || d.archivo || ''),
  slot: detectarSlot(d)
})

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
    program.title = e.descripcion || ''
    program.code = e.codigo || 'Ensayo'
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

// Inscripción del usuario en este ensayo (fecha, id y laboratorio)
const fetchMiInscripcion = async () => {
  try {
    const resp = await fetch(API.misEnsayos, { headers: { ...getAuthHeaders() } })
    if (!resp.ok) return
    const body = await resp.json()
    const list = Array.isArray(body.data) ? body.data : []
    const mine = list.find((i: any) => String(i?.ensayo?.id) === ensayoId.value)
    if (!mine) return
    program.enrolledAt = mine.inscritoEn || null
    inscripcionId.value = mine.inscripcionId ?? null
    laboratorioId.value = mine.laboratorioId ?? null

    // Si el listado no trae el laboratorio, se consulta la inscripción
    if (!laboratorioId.value && inscripcionId.value) {
      const r = await fetch(API.inscripcion(inscripcionId.value), { headers: { ...getAuthHeaders() } })
      if (r.ok) {
        const b = await r.json()
        const d = b.data || b
        laboratorioId.value = d.laboratorio_id ?? d.laboratorioId ?? null
      }
    }
  } catch (err) {
    console.error('fetchMiInscripcion error', err)
  }
}

const fetchProgramDocuments = async () => {
  try {
    const resp = await fetch(API.ensayoDocs(ensayoId.value), { headers: { ...getAuthHeaders() } })
    if (!resp.ok) {
      programDocuments.value = []
      return
    }
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : body.data || []
    programDocuments.value = rows.map(mapDocumento).filter((d: Documento) => !d.slot)
  } catch (err) {
    console.error('fetchProgramDocuments error', err)
    programDocuments.value = []
  }
}

/** Los 3 documentos que SENA sube para este laboratorio. Solo consulta. */
const fetchDocumentosIndividuales = async () => {
  if (!laboratorioId.value) {
    documentosIndividuales.value = []
    return
  }
  try {
    const resp = await fetch(API.labDocs(ensayoId.value, laboratorioId.value), { headers: { ...getAuthHeaders() } })
    if (!resp.ok) {
      documentosIndividuales.value = []
    } else {
      const body = await resp.json()
      const rows = Array.isArray(body) ? body : body.data || []
      documentosIndividuales.value = rows
        .map(mapDocumento)
        .filter((d: Documento) => !!d.slot && !!d.url)
        .sort((a: Documento, b: Documento) => (a.slot || 0) - (b.slot || 0))
    }

    // If no individual documents were found in the DB, try listing files directly on hosting
    // (useful when upload succeeded but DB insert failed).
    if ((!documentosIndividuales.value || documentosIndividuales.value.length === 0) && laboratorioId.value) {
      try {
        const resp2 = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/laboratorios/${laboratorioId.value}/archivos`, { headers: { ...getAuthHeaders() } })
        if (resp2.ok) {
          const b2 = await resp2.json()
          const files = Array.isArray(b2) ? b2 : b2.data || []
          // Map files to Documento shape; these won't have slot numbers but will be shown as 'individual'
          const mapped = (files || [])
            .map((f: any, idx: number) => ({
              id: f.name || `ftp-${idx}`,
              nombre: f.name || f.filename || f.name || `Archivo ${idx + 1}`,
              descripcion: '',
              tipo: 'individual',
              fecha: f.modifyTime ? new Date(f.modifyTime).toISOString() : undefined,
              url: f.url || f.path || (f.name ? `${(API_BASE || '').replace(/\/api\/$/, '')}${f.url || ''}` : ''),
              slot: undefined
            }))
            // only include those with a usable url
            .filter((x: Documento) => !!x.url)
          // append unique files (avoid duplicates by name)
          const existingNames = new Set(documentosIndividuales.value.map(d => String(d.nombre)))
          for (const m of mapped) {
            if (!existingNames.has(String(m.nombre))) documentosIndividuales.value.push(m)
          }
        }
      } catch (e) {
        console.warn('fetchDocumentosIndividuales: fallback to archivos failed', e)
      }
    }
  } catch (err) {
    console.error('fetchDocumentosIndividuales error', err)
    documentosIndividuales.value = []
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
  if (!inscripcionId.value) {
    docsNotice.value = 'Aún no estás inscrito en este ensayo.'
    return
  }
  try {
    const resp = await fetch(API.misDocs(inscripcionId.value), { headers: { ...getAuthHeaders() } })
    if (resp.status === 404) {
      docsNotice.value = 'El expediente todavía no está habilitado en el servidor.'
      return
    }
    if (!resp.ok) return
    docsNotice.value = ''
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : body.data || []
    // Se parte de cero: un documento devuelto por SENA vuelve a 'rechazado'
    DOC_SLOTS.forEach(slot => {
      const st = slotState[slot.key]
      st.doc = null
      st.estado = 'pendiente'
      st.motivo = ''
    })
    rows.forEach((d: any, i: number) => {
      const key = matchSlotKey(d.tipo || d.slug || '')
      const state = key ? slotState[key] : null
      if (!state) return
      state.doc = mapDocumento(d, i)
      state.estado = (['pendiente', 'enviado', 'recibido', 'rechazado'].includes(d.estado) ? d.estado : 'enviado') as DocEstado
      state.motivo = d.motivo || d.observaciones || ''
    })
  } catch (err) {
    console.error('fetchMisDocumentos error', err)
  }
}

const recargarDocumentos = async () => {
  loadingDocs.value = true
  try {
    await Promise.all([fetchProgramDocuments(), fetchDocumentosIndividuales(), fetchMisDocumentos()])

    // Merge individual documents into the program documents view so the "Documentos del programa"
    // section shows both the public program files and any individual files SENA prepared for this lab.
    try {
      const byId: Record<string, Documento> = {}
      // start with existing program documents (keep order)
      for (const d of programDocuments.value) {
        byId[String(d.id)] = d
      }
      // append individual docs but avoid id collisions; make them visually consistent
      for (const ind of documentosIndividuales.value) {
        const key = String(ind.id || (`ind-${ind.slot}`))
        if (!byId[key]) {
          byId[key] = {
            ...ind,
            // mark type so UI can show a badge if desired
            tipo: ind.tipo || 'individual',
            // prefer a friendly name; if backend left nombre empty, use filename-like fallback
            nombre: ind.nombre || (ind.url ? decodeURIComponent(String(ind.url).split('?')[0].split('/').pop() || '') : `Documento individual ${ind.slot}`)
          }
        }
      }
      // Rebuild programDocuments preserving original order first, then individuals
      const merged: Documento[] = []
      for (const d of programDocuments.value) merged.push(byId[String(d.id)])
      for (const ind of documentosIndividuales.value) {
        const key = String(ind.id || (`ind-${ind.slot}`))
        if (!programDocuments.value.find(pd => String(pd.id) === key)) merged.push(byId[key])
      }
      programDocuments.value = merged
    } catch (e) {
      console.warn('recargarDocumentos: merge individuals into program documents failed', e)
    }
  } finally {
    loadingDocs.value = false
  }
}

/* ============================================================
   Subida de documentos del expediente
   ------------------------------------------------------------
   Solo se permite mientras el documento esté pendiente o
   rechazado; si ya está enviado o recibido, la tarjeta se bloquea.
   ============================================================ */
const validateFile = (file: File, extensions: string[]): string => {
  if (!extensions.includes(fileExt(file.name))) {
    return `Formato no permitido. Usa: ${extensions.map(e => `.${e}`).join(', ')}`
  }
  if (file.size > MAX_UPLOAD_BYTES) return 'El archivo supera 15 MB'
  return ''
}

const setSlotFile = (key: string, file: File | null | undefined) => {
  const state = slotState[key]
  const slot = DOC_SLOTS.find(s => s.key === key)
  if (!state || !slot || !puedeSubir(key)) return
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
  if (!state || !state.file || state.uploading) return
  if (!puedeSubir(key)) {
    state.error = 'Este documento ya fue enviado y no se puede cambiar.'
    return
  }
  if (!inscripcionId.value) {
    state.error = 'No estás inscrito en este ensayo.'
    return
  }

  state.uploading = true
  state.error = ''
  try {
    const fileDataUrl = await readAsDataURL(state.file)
    const resp = await fetch(API.subirDoc(inscripcionId.value, key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ tipo: key, fileName: state.file.name, fileDataUrl })
    })
    const body = await resp.json().catch(() => ({}))

    if (resp.status === 401 || resp.status === 403) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
    if (resp.status === 404) throw new Error('El servidor aún no acepta este envío. Avisa a SENA.')
    if (resp.status === 409) throw new Error('Este documento ya fue enviado y no se puede cambiar.')
    if (!resp.ok) throw new Error(body.message || `No se pudo enviar (HTTP ${resp.status})`)

    const data = body.data || body
    state.doc = mapDocumento(
      { nombre: state.file.name, fecha: new Date().toISOString(), ...(typeof data === 'object' ? data : {}) },
      0
    )
    state.estado = (data && data.estado) || 'enviado'
    state.motivo = ''
    state.file = null
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
const originalUrl = ref('')
const blobUrl = ref('')
const pdfLoading = ref(false)
const pdfError = ref('')
const pdfSrc = computed(() => (blobUrl.value ? `${blobUrl.value}#view=FitH` : ''))

const revokeBlob = () => {
  if (blobUrl.value) {
    try { URL.revokeObjectURL(blobUrl.value) } catch { /* ignorar */ }
  }
  blobUrl.value = ''
}

// Comprueba la firma %PDF: evita mostrar un HTML de error dentro del visor
const isPdfBuffer = (buf: ArrayBuffer): boolean => {
  const b = new Uint8Array(buf, 0, Math.min(4, buf.byteLength))
  return b.length === 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46
}

/**
 * Se descarga con la cabecera de sesión y se muestra desde un blob:
 * así funciona aunque el servidor mande `Content-Disposition: attachment`
 * o `X-Frame-Options`, cosa que un <iframe> directo no sortea.
 */
const previewDocument = async (doc: Documento) => {
  if (!doc) return
  const url = resolveUrl(doc.url)
  const ext = fileExt(doc.nombre) || fileExt(url)

  // Excel y CSV no se embeben: se abren en una pestaña
  if (url && ext && ext !== 'pdf') {
    window.open(url, '_blank', 'noopener')
    return
  }

  revokeBlob()
  selectedDocument.value = doc
  originalUrl.value = url
  pdfError.value = ''
  showPdfModal.value = true

  if (!url) {
    pdfError.value = 'Este documento no tiene un archivo disponible.'
    return
  }

  pdfLoading.value = true
  try {
    const resp = await fetch(url, { headers: { ...getAuthHeaders() } })
    if (!resp.ok) throw new Error(`El servidor respondió ${resp.status}`)
    const buf = await resp.arrayBuffer()
    if (!isPdfBuffer(buf)) throw new Error('El archivo descargado no es un PDF válido.')
    blobUrl.value = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }))
  } catch (err) {
    console.error('previewDocument error', err)
    pdfError.value = `${errorMessage(err)} Puedes abrirlo en una pestaña nueva.`
  } finally {
    pdfLoading.value = false
  }
}

const closePdfModal = () => {
  showPdfModal.value = false
  selectedDocument.value = null
  originalUrl.value = ''
  pdfError.value = ''
  pdfLoading.value = false
  revokeBlob()
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
  // La inscripción da el laboratorio, que hace falta para los individuales
  await fetchMiInscripcion()
  await recargarDocumentos()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  revokeBlob()
})

watch(currentTheme, (t) => {
  document.documentElement.setAttribute('data-bs-theme', t)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ============================================================
   TOKENS
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
.spinner.lg { width: 28px; height: 28px; border-width: 3px; color: var(--sena-green); }
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
.count-pill {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--sena-green);
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
}

.my-docs-section { margin-bottom: 3rem; }
.documents-section + .documents-section { margin-top: 3rem; }

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
   TARJETAS DEL EXPEDIENTE
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
.slot-locked,
.slot-done {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: auto 0 0;
  padding: 0.6rem 0.7rem;
  border-radius: 12px;
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.4;
}
.slot-locked { background: var(--tone-neutral-bg); color: var(--tone-neutral); font-weight: 500; }
.slot-done { background: var(--tone-ok-bg); color: var(--tone-ok); justify-content: center; }

/* ============================================================
   DOCUMENTOS (programa e individuales)
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
.document-card.is-individual { border-left: 4px solid var(--sena-green); }
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
.doc-icon-wrap.is-individual { background: var(--tone-ok-bg); color: var(--tone-ok); }
.doc-content { flex: 1; min-width: 0; }
.doc-title { font-size: 0.92rem; font-weight: 600; margin-bottom: 0.25rem; }
.doc-description { font-size: 0.78rem; color: var(--sena-muted); margin-bottom: 0.45rem; }
.doc-meta { display: flex; flex-wrap: wrap; gap: 0.3rem 1rem; font-size: 0.7rem; color: var(--sena-muted); }
.doc-meta span { display: inline-flex; align-items: center; gap: 0.3rem; }
.tag-individual { color: var(--tone-ok); font-weight: 600; }
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
  text-align: center;
  padding: 1.5rem;
}
.modal-empty i { font-size: 2.2rem; opacity: 0.6; }
.modal-empty strong { color: var(--sena-text); }
.modal-empty .btn { margin-top: 0.4rem; }

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
