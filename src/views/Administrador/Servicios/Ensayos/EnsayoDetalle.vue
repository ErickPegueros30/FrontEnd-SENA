<template>
  <div :data-bs-theme="currentTheme" class="ensayo-detalle-page">
    <!-- Header -->
    <header class="detalle-header">
      <div class="container">
        <nav class="breadcrumb-nav" aria-label="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item"><router-link to="/admin" class="breadcrumb-link"><i class="bi bi-house-door"></i> Dashboard</router-link></li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item"><router-link to="/admin/ensayos" class="breadcrumb-link"><i class="bi bi-clipboard-data"></i> Ensayos</router-link></li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item active"><i class="bi bi-file-earmark-text"></i> {{ ensayo?.codigo || 'Detalle' }}</li>
          </ol>
        </nav>

        <button class="back-btn" @click="goBack"><i class="bi bi-arrow-left"></i> Volver a ensayos</button>

        <!-- Skeleton mientras carga -->
        <div v-if="loading" class="hero-skeleton">
          <div class="sk sk-title"></div>
          <div class="sk sk-sub"></div>
          <div class="sk sk-chips"></div>
        </div>

        <!-- Hero -->
        <div v-else-if="ensayo" class="hero">
          <div class="hero-main">
            <span class="section-eyebrow">Ensayo de Aptitud</span>
            <div class="hero-code-row">
              <h1 class="hero-code">{{ ensayo.codigo }}</h1>
              <span class="status-pill" :class="ensayo.disponible ? 'abierto' : 'cerrado'">
                <i :class="ensayo.disponible ? 'bi bi-unlock-fill' : 'bi bi-lock-fill'"></i>
                {{ ensayo.disponible ? 'Abierto' : 'Cerrado' }}
              </span>
            </div>
            <p class="hero-desc">{{ ensayo.descripcion }}</p>
            <div class="hero-chips">
              <span v-if="ensayo.ciclo" class="ciclo-badge">{{ ensayo.ciclo }}</span>
              <span v-if="ensayo.area" class="area-badge">{{ ensayo.area }}</span>
              <span v-if="ensayo.rama" class="rama-badge">{{ ensayo.rama }}</span>
              <span v-if="ensayo.subarea" class="subarea-badge">{{ ensayo.subarea }}</span>
              <span v-if="ensayo.subrama" class="subrama-badge">{{ ensayo.subrama }}</span>
              <span class="flag-chip">
                <img :src="getFlagUrl(ensayo.nacionalidad)" :alt="ensayo.nacionalidad || 'mexico'" />
                {{ ensayo.nacionalidad || 'mexico' }}
              </span>
            </div>
          </div>

          <div class="hero-actions">
            <button class="action-btn secondary" @click="toggleEstado" :disabled="updatingEstado">
              <i :class="ensayo.disponible ? 'bi bi-lock' : 'bi bi-unlock'"></i>
              <span>{{ ensayo.disponible ? 'Cerrar' : 'Abrir' }}</span>
            </button>
            <button class="action-btn secondary" @click="goEdit"><i class="bi bi-pencil"></i><span>Editar</span></button>
          </div>
        </div>

        <div v-else class="hero-error">
          <i class="bi bi-exclamation-circle"></i>
          <span>No se encontró el ensayo solicitado.</span>
        </div>
      </div>
    </header>

    <main v-if="ensayo" class="detalle-main">
      <div class="container">
        <!-- Métricas rápidas -->
        <section class="metrics-row">
          <div class="metric-card">
            <div class="metric-icon i-people"><i class="bi bi-people-fill"></i></div>
            <div class="metric-info"><span class="metric-number">{{ integrantes.length }}</span><span class="metric-label">Integrantes</span></div>
          </div>
          <div class="metric-card">
            <div class="metric-icon i-docs"><i class="bi bi-file-earmark-pdf-fill"></i></div>
            <div class="metric-info"><span class="metric-number">{{ documentos.length }}</span><span class="metric-label">Documentos</span></div>
          </div>
          <div class="metric-card">
            <div class="metric-icon i-progress"><i class="bi bi-graph-up-arrow"></i></div>
            <div class="metric-info"><span class="metric-number">{{ progresoPromedio }}%</span><span class="metric-label">Progreso promedio</span></div>
          </div>
          <div class="metric-card">
            <div class="metric-icon i-cal"><i class="bi bi-calendar-event-fill"></i></div>
            <div class="metric-info"><span class="metric-number">{{ ensayo.fechaInicio || '—' }}</span><span class="metric-label">Inicio del ensayo</span></div>
          </div>
        </section>

        <div class="detalle-grid">
          <!-- Columna izquierda -->
          <div class="col-left">
            <!-- Info general -->
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title"><i class="bi bi-info-circle"></i> Información general</h3>
              </div>
              <div class="panel-body">
                <div class="data-grid">
                  <div class="data-item"><span class="data-label">Ciclo</span><span class="data-value">{{ ensayo.ciclo || '—' }}</span></div>
                  <div class="data-item"><span class="data-label">Código</span><span class="data-value"><code class="codigo-text">{{ ensayo.codigo }}</code></span></div>
                  <div class="data-item"><span class="data-label">Área / Rama</span><span class="data-value">
                    <span v-if="ensayo.area" class="area-badge">{{ ensayo.area }}</span>
                    <span v-if="ensayo.rama" class="rama-badge">{{ ensayo.rama }}</span>
                    <span v-if="!ensayo.area && !ensayo.rama">—</span>
                  </span></div>
                  <div class="data-item"><span class="data-label">Subárea / Subrama</span><span class="data-value">
                    <span v-if="ensayo.subarea" class="subarea-badge">{{ ensayo.subarea }}</span>
                    <span v-else-if="ensayo.subrama" class="subrama-badge">{{ ensayo.subrama }}</span>
                    <span v-else>—</span>
                  </span></div>
                  <div class="data-item"><span class="data-label">Nacionalidad</span><span class="data-value flag-value">
                    <img :src="getFlagUrl(ensayo.nacionalidad)" :alt="ensayo.nacionalidad || 'mexico'" /> {{ ensayo.nacionalidad || 'mexico' }}
                  </span></div>
                  <div class="data-item"><span class="data-label">Tipo</span><span class="data-value">{{ ensayo.tipo || 'principal' }}</span></div>
                  <div class="data-item"><span class="data-label">Inscripción</span><span class="data-value">{{ ensayo.inscripcionInicio || '—' }} → {{ ensayo.inscripcionFin || '—' }}</span></div>
                  <div class="data-item"><span class="data-label">Inicio del ensayo</span><span class="data-value">{{ ensayo.fechaInicio || '—' }}</span></div>
                  <div class="data-item full"><span class="data-label">Detalle de duración</span><span class="data-value">{{ ensayo.fechaDetalle || '—' }}</span></div>
                </div>
              </div>
            </div>

            <!-- Documentos / PDFs -->
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title"><i class="bi bi-folder2-open"></i> Documentos del ensayo</h3>
                <span class="panel-count">{{ documentos.length }}</span>
              </div>
              <div class="panel-body">
                <div v-if="documentos.length === 0" class="empty-mini">
                  <i class="bi bi-file-earmark-x"></i>
                  <span>Aún no hay documentos cargados para este ensayo.</span>
                </div>
                <div v-else class="docs-grid">
                  <button v-for="doc in documentos" :key="doc.id" class="doc-card" @click="openPdf(doc)">
                    <div class="doc-icon"><i class="bi bi-file-earmark-pdf-fill"></i></div>
                    <div class="doc-meta">
                      <span class="doc-name">{{ doc.nombre }}</span>
                      <span class="doc-sub">{{ doc.tipo || 'PDF' }}<template v-if="doc.fecha"> · {{ doc.fecha }}</template></span>
                    </div>
                    <i class="bi bi-eye doc-open"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha: integrantes -->
          <div class="col-right">
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title"><i class="bi bi-people"></i> Integrantes</h3>
                <div class="panel-tools">
                  <div class="mini-search">
                    <i class="bi bi-search"></i>
                    <input v-model="searchIntegrante" type="text" placeholder="Buscar integrante..." />
                  </div>
                  <span class="panel-count">{{ filteredIntegrantes.length }}</span>
                </div>
              </div>

              <div class="panel-body no-pad">
                <div v-if="integrantes.length === 0" class="empty-mini pad">
                  <i class="bi bi-person-x"></i>
                  <span>No hay integrantes registrados en este ensayo todavía.</span>
                </div>

                <div v-else class="table-responsive">
                  <table class="integrantes-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Laboratorio</th>
                        <th>Teléfono</th>
                        <th class="col-prog">Progreso</th>
                        <th class="col-act"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="p in filteredIntegrantes" :key="p.id" @click="goIntegrante(p)" class="clickable-row">
                        <td>
                          <div class="person-cell">
                            <span class="avatar">{{ getInitials(p.nombre) }}</span>
                            <span class="person-name">{{ p.nombre }}</span>
                          </div>
                        </td>
                        <td><span class="cell-muted">{{ p.correo }}</span></td>
                        <td><span class="lab-badge">{{ p.laboratorio || '—' }}</span></td>
                        <td><span class="cell-muted">{{ p.telefono || '—' }}</span></td>
                        <td class="col-prog">
                          <div class="progress-cell">
                            <div class="progress-track">
                              <div class="progress-fill" :class="progresoClass(p.progreso)" :style="{ width: p.progreso + '%' }"></div>
                            </div>
                            <span class="progress-pct">{{ p.progreso }}%</span>
                          </div>
                          <span class="progress-docs">{{ p.docsSubidos }}/{{ p.docsTotal }} docs</span>
                        </td>
                        <td class="col-act">
                          <button class="row-btn" @click.stop="goIntegrante(p)" title="Ver documentos"><i class="bi bi-folder2-open"></i></button>
                        </td>
                      </tr>
                      <tr v-if="filteredIntegrantes.length === 0">
                        <td colspan="6" class="empty-inline">No hay integrantes que coincidan con la búsqueda.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal PDF -->
    <Teleport to="body">
      <div v-if="showPdfModal" class="modal-overlay pdf-viewer-overlay" @click.self="closePdf">
        <div class="modal-container pdf-viewer">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-file-earmark-pdf-fill"></i> {{ currentDocName || 'Documento' }}</h5>
            <button class="modal-close-btn" @click="closePdf"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body pdf-body">
            <div v-if="pdfSrc" class="pdf-embed-wrapper"><iframe :src="pdfSrc + '#view=FitH'" frameborder="0" class="pdf-iframe"></iframe></div>
            <div v-else class="empty-pdf-note">No se pudo cargar el PDF.</div>
            <div v-if="pdfFetchError" class="empty-pdf-note" style="margin-top:0.5rem;color:var(--danger)">Error cargando PDF: {{ pdfFetchError }}.</div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="closePdf">Cerrar</button>
            <a v-if="originalPdfUrl" :href="originalPdfUrl" class="modal-btn primary" target="_blank" rel="noopener">Abrir en nueva pestaña</a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { API_BASE } from '@/config/api'

interface Ensayo {
  id: number | string; backendId?: number | string; ciclo: string; descripcion: string; codigo: string
  area: string; subarea: string; rama?: string; subrama?: string
  inscripcionInicio: string; inscripcionFin: string; fechaInicio: string; fechaDetalle: string
  disponible: boolean; tipo?: string; nacionalidad?: string
  generalidades?: string | null; generalidadesUrl?: string | null
}
interface Documento { id: number | string; nombre: string; tipo?: string; fecha?: string; url?: string; ensayoId?: number | string }
interface Integrante {
  id: number | string; nombre: string; correo: string; laboratorio?: string; telefono?: string
  progreso: number; docsSubidos: number; docsTotal: number
}

const route = useRoute()
const router = useRouter()
const { currentTheme } = useTheme()

const ensayoId = computed(() => route.params.id as string)
const loading = ref(true)
const ensayo = ref<Ensayo | null>(null)
const documentos = ref<Documento[]>([])
const integrantes = ref<Integrante[]>([])
const updatingEstado = ref(false)
const searchIntegrante = ref('')

const getAuthToken = (): string | null => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null

const getFlagUrl = (code?: string | null) => {
  if (!code) return 'https://flagcdn.com/w20/mx.png'
  const c = String(code).toLowerCase()
  if (c === 'colombia' || c === 'co') return 'https://flagcdn.com/w20/co.png'
  return 'https://flagcdn.com/w20/mx.png'
}
const getInitials = (name: string) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
}
const progresoClass = (v: number) => v >= 100 ? 'complete' : v >= 50 ? 'mid' : 'low'

const filteredIntegrantes = computed(() => {
  const q = searchIntegrante.value.toLowerCase().trim()
  if (!q) return integrantes.value
  return integrantes.value.filter(p =>
    (p.nombre || '').toLowerCase().includes(q) ||
    (p.correo || '').toLowerCase().includes(q) ||
    (p.laboratorio || '').toLowerCase().includes(q)
  )
})

const progresoPromedio = computed(() => {
  if (integrantes.value.length === 0) return 0
  const sum = integrantes.value.reduce((a, p) => a + (p.progreso || 0), 0)
  return Math.round(sum / integrantes.value.length)
})

// ---- Carga del ensayo ----
const fetchEnsayo = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) {
        const body = await resp.json()
        const r = body.data || body
        ensayo.value = mapEnsayo(r)
        return
      }
    }
  } catch (err) { console.error('Error fetching ensayo', err) }
  // Fallback demo para poder ver la interfaz sin backend aún
  ensayo.value = demoEnsayo()
}

const mapEnsayo = (r: any): Ensayo => ({
  id: r.id_ensayo || r.id, backendId: r.id_ensayo || r.id,
  ciclo: r.ciclo || '', descripcion: r.descripcion || '', codigo: r.codigo || '',
  area: r.area || '', subarea: r.subarea || '', rama: r.rama || '', subrama: r.subrama || '',
  inscripcionInicio: r.inscripcionInicio || r.inscripcion_inicio || '',
  inscripcionFin: r.inscripcionFin || r.inscripcion_fin || '',
  fechaInicio: r.fechaInicio || r.fecha_inicio || r.fechaInicioEnsayo || r.fecha_inicio_ensayo || '',
  fechaDetalle: r.fechaDetalle || r.fecha_detalle || '',
  disponible: r.disponible !== undefined ? !!r.disponible : true,
  tipo: r.tipo || 'principal', nacionalidad: r.nacionalidad || 'mexico',
  generalidades: r.generalidades || null, generalidadesUrl: r.generalidadesUrl || null
})

const demoEnsayo = (): Ensayo => ({
  id: ensayoId.value, backendId: ensayoId.value,
  ciclo: 'Micro 01', descripcion: 'Micropipeta de volumen fijo', codigo: 'VOL-PIP-MIC-001',
  area: 'Volumen', subarea: 'Micropipetas', rama: '', subrama: '',
  inscripcionInicio: '2026-01-10', inscripcionFin: '2026-02-10', fechaInicio: '2026-03-01',
  fechaDetalle: 'Duración: 30 días', disponible: true, tipo: 'principal', nacionalidad: 'mexico',
  generalidades: 'generalidades.pdf', generalidadesUrl: null
})

// ---- Documentos del ensayo ----
const fetchDocumentos = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/documentos`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) {
        const body = await resp.json()
        const rows = Array.isArray(body) ? body : (body.data || [])
        documentos.value = rows.map((d: any, i: number) => ({
          id: d.id || d.id_documento || i,
          nombre: d.nombre || d.name || `Documento ${i + 1}`,
          tipo: d.tipo || 'PDF',
          fecha: d.fecha || d.createdAt || '',
          url: d.url || d.pdfUrl || (d.id ? `${API_BASE}/api/ensayos/${ensayoId.value}/documentos/${d.id}.pdf` : '')
        }))
        // añadir generalidades como primer documento si existe
        prependGeneralidades()
        return
      }
    }
  } catch (err) { console.error('Error fetching documentos', err) }
  // Fallback: al menos generalidades + demo
  documentos.value = []
  prependGeneralidades()
  if (documentos.value.length === 0) {
    documentos.value = [
      { id: 'gen', nombre: 'Generalidades del ensayo', tipo: 'Generalidades', fecha: '2026-01-05', url: '' },
      { id: 'inst', nombre: 'Instrucciones técnicas', tipo: 'Instructivo', fecha: '2026-01-06', url: '' }
    ]
  }
}

const prependGeneralidades = () => {
  if (!ensayo.value) return
  if (ensayo.value.generalidades || ensayo.value.generalidadesUrl) {
    const url = `${API_BASE}/api/ensayos/${ensayoId.value}/generalidades.pdf`
    const exists = documentos.value.some(d => d.id === 'gen')
    if (!exists) {
      documentos.value.unshift({ id: 'gen', nombre: 'Generalidades del ensayo', tipo: 'Generalidades', fecha: '', url })
    }
  }
}

// ---- Integrantes ----
const fetchIntegrantes = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/integrantes`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) {
        const body = await resp.json()
        const rows = Array.isArray(body) ? body : (body.data || [])
        integrantes.value = rows.map((p: any, i: number) => {
          const total = p.docsTotal ?? p.documentosRequeridos ?? 0
          const subidos = p.docsSubidos ?? p.documentosSubidos ?? 0
          const prog = p.progreso != null ? Math.round(p.progreso) : (total > 0 ? Math.round((subidos / total) * 100) : 0)
          return {
            id: p.id || p.id_cliente || p.id_integrante || i,
            nombre: p.nombre || `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Sin nombre',
            correo: p.correo || p.email || '',
            laboratorio: p.laboratorio || p.lab || '',
            telefono: p.telefono || p.phone || '',
            progreso: prog, docsSubidos: subidos, docsTotal: total
          }
        })
        return
      }
    }
  } catch (err) { console.error('Error fetching integrantes', err) }
  // Fallback demo
  integrantes.value = demoIntegrantes()
}

const demoIntegrantes = (): Integrante[] => ([
  { id: 1, nombre: 'María González Ruiz', correo: 'maria.gonzalez@lab.mx', laboratorio: 'Lab Metrología Norte', telefono: '+52 442 123 4567', progreso: 100, docsSubidos: 5, docsTotal: 5 },
  { id: 2, nombre: 'Carlos Hernández', correo: 'c.hernandez@calibra.mx', laboratorio: 'Calibra S.A.', telefono: '+52 55 8899 2211', progreso: 60, docsSubidos: 3, docsTotal: 5 },
  { id: 3, nombre: 'Ana Torres Vega', correo: 'ana.torres@precision.co', laboratorio: 'Precisión Andina', telefono: '+57 1 456 7890', progreso: 20, docsSubidos: 1, docsTotal: 5 },
  { id: 4, nombre: 'Luis Martínez', correo: 'lmartinez@ensayoslab.mx', laboratorio: 'Ensayos Lab', telefono: '+52 33 2211 5566', progreso: 80, docsSubidos: 4, docsTotal: 5 }
])

const toggleEstado = async () => {
  if (!ensayo.value) return
  updatingEstado.value = true
  const prev = ensayo.value.disponible
  try {
    const token = getAuthToken()
    const idToUse = ensayo.value.backendId || ensayo.value.id
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${idToUse}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ disponible: !ensayo.value.disponible })
      })
      if (!resp.ok) throw new Error('API error')
    }
    ensayo.value.disponible = !ensayo.value.disponible
  } catch (err) { ensayo.value.disponible = prev }
  finally { updatingEstado.value = false }
}

const goBack = () => router.push('/admin/ensayos')
const goEdit = () => router.push({ path: '/admin/ensayos', query: { edit: String(ensayoId.value) } })
const goIntegrante = (p: Integrante) => router.push(`/admin/ensayos/${ensayoId.value}/integrantes/${p.id}`)

// ---- Visor PDF ----
const showPdfModal = ref(false)
const currentPdfUrl = ref<string | null>(null)
const originalPdfUrl = ref<string | null>(null)
const currentPdfBlobUrl = ref<string | null>(null)
const pdfFetchError = ref<string | null>(null)
const currentDocName = ref('')
const pdfSrc = computed(() => currentPdfBlobUrl.value || currentPdfUrl.value || '')

const openPdf = async (doc: Documento) => {
  const url = doc.url || (doc.id === 'gen' ? `${API_BASE}/api/ensayos/${ensayoId.value}/generalidades.pdf` : '')
  currentDocName.value = doc.nombre
  showPdfModal.value = true
  pdfFetchError.value = null; currentPdfUrl.value = null; currentPdfBlobUrl.value = null; originalPdfUrl.value = url || null
  document.body.style.overflow = 'hidden'
  if (!url) { pdfFetchError.value = 'Documento sin URL disponible'; return }
  try {
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const ct = resp.headers.get('content-type') || ''
    if (!ct.includes('pdf')) { currentPdfUrl.value = url; return }
    const blob = await resp.blob()
    currentPdfBlobUrl.value = URL.createObjectURL(blob)
  } catch (err: any) { pdfFetchError.value = String(err?.message || err); currentPdfUrl.value = url }
}
const closePdf = () => {
  showPdfModal.value = false
  if (currentPdfBlobUrl.value) { try { URL.revokeObjectURL(currentPdfBlobUrl.value) } catch (e) {} }
  currentPdfBlobUrl.value = null; currentPdfUrl.value = null; originalPdfUrl.value = null; pdfFetchError.value = null; currentDocName.value = ''
  document.body.style.overflow = ''
}

onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loading.value = true
  await fetchEnsayo()
  await Promise.all([fetchDocumentos(), fetchIntegrantes()])
  loading.value = false
})

watch(currentTheme, (t) => { document.documentElement.setAttribute('data-bs-theme', t) })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
:root {
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --bg: #f5f7f2; --surface: #ffffff; --surface-sunken: #fafbf9; --border: #e6e8e2; --border-strong: #c4cbba;
  --text: #1b201a; --text-secondary: #556052; --text-tertiary: #8a9382;
  --brand: #3f7a2a; --brand-hover: #356822; --brand-soft: rgba(63,122,42,0.10); --brand-soft-border: rgba(63,122,42,0.28);
  --danger: #d64545; --danger-soft: rgba(214,69,69,0.10); --warning: #c98a1e; --warning-soft: rgba(201,138,30,0.12); --neutral-soft: rgba(0,0,0,0.04);
  --radius-xs: 6px; --radius-sm: 8px; --radius-md: 10px; --radius-lg: 12px; --radius-xl: 16px;
  --shadow-sm: 0 1px 3px rgba(20,24,16,0.06), 0 1px 2px rgba(20,24,16,0.04); --shadow-md: 0 6px 20px rgba(20,24,16,0.08); --shadow-lg: 0 16px 40px rgba(20,24,16,0.14);
  --transition: all 0.15s ease;
}
[data-bs-theme="dark"] {
  --bg: #0e100d; --surface: #161a13; --surface-sunken: #12150f; --border: rgba(255,255,255,0.08); --border-strong: rgba(255,255,255,0.14);
  --text: #eaeee4; --text-secondary: #99a38e; --text-tertiary: #6c7563;
  --brand: #7cbb55; --brand-hover: #8fc96b; --brand-soft: rgba(124,187,85,0.14); --brand-soft-border: rgba(124,187,85,0.3);
  --danger: #e2696a; --danger-soft: rgba(226,105,106,0.12); --warning: #dcaa4c; --warning-soft: rgba(220,170,76,0.12); --neutral-soft: rgba(255,255,255,0.05);
}
</style>

<style scoped>
.ensayo-detalle-page { font-family: var(--font-body); background: var(--bg); min-height: 100vh; color: var(--text); font-size: 14px; -webkit-font-smoothing: antialiased; }
.ensayo-detalle-page .container { max-width: 1360px; margin: 0 auto; padding: 0 1.75rem; }

/* HEADER */
.detalle-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1.5rem 0 1.75rem; position: relative; overflow: hidden; }
.detalle-header::after { content: ''; position: absolute; top: -40%; right: -6%; width: 380px; height: 380px; background: radial-gradient(circle, var(--brand-soft) 0%, transparent 68%); pointer-events: none; }
.breadcrumb-nav { margin-bottom: 1rem; position: relative; z-index: 1; }
.breadcrumb-list { display: flex; align-items: center; gap: 0.4rem; padding: 0; margin: 0; list-style: none; font-size: 0.78rem; flex-wrap: wrap; }
.breadcrumb-item { display: flex; align-items: center; gap: 0.3rem; color: var(--text-tertiary); }
.breadcrumb-item.active { color: var(--text-secondary); font-weight: 600; }
.breadcrumb-link { color: var(--text-tertiary); text-decoration: none; transition: var(--transition); display: flex; align-items: center; gap: 0.3rem; }
.breadcrumb-link:hover { color: var(--brand); }
.breadcrumb-separator { color: var(--border-strong); font-size: 0.6rem; }

.back-btn { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--surface-sunken); border: 1px solid var(--border); color: var(--text-secondary); padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: var(--transition); margin-bottom: 1.25rem; position: relative; z-index: 1; }
.back-btn:hover { color: var(--brand); border-color: var(--brand-soft-border); transform: translateX(-2px); }

.hero { display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap; position: relative; z-index: 1; }
.hero-main { flex: 1; min-width: 0; }
.section-eyebrow { display: inline-block; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brand); margin-bottom: 0.5rem; }
.hero-code-row { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
.hero-code { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); margin: 0; font-family: 'SF Mono', 'Courier New', monospace; }
.hero-desc { color: var(--text-secondary); font-size: 1rem; margin: 0.5rem 0 0.9rem; line-height: 1.5; max-width: 60ch; }
.status-pill { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.28rem 0.7rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; }
.status-pill.abierto { background: var(--brand-soft); color: var(--brand); border: 1px solid var(--brand-soft-border); }
.status-pill.cerrado { background: var(--neutral-soft); color: var(--text-tertiary); border: 1px solid var(--border); }

.hero-chips { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.ciclo-badge { display: inline-block; padding: 0.2rem 0.65rem; background: var(--brand); color: #fff; border-radius: var(--radius-xs); font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
.area-badge { display: inline-block; padding: 0.18rem 0.6rem; background: var(--brand-soft); color: var(--brand); border-radius: var(--radius-xs); font-size: 0.72rem; font-weight: 600; }
.rama-badge { display: inline-block; padding: 0.16rem 0.55rem; background: transparent; border: 1px solid var(--brand-soft-border); color: var(--brand); border-radius: var(--radius-xs); font-size: 0.7rem; font-weight: 600; }
.subarea-badge { display: inline-block; padding: 0.18rem 0.6rem; background: var(--neutral-soft); color: var(--text-secondary); border-radius: var(--radius-xs); font-size: 0.72rem; font-weight: 500; }
.subrama-badge { display: inline-block; padding: 0.16rem 0.55rem; background: transparent; border: 1px solid var(--border-strong); color: var(--text-secondary); border-radius: var(--radius-xs); font-size: 0.7rem; font-weight: 600; }
.flag-chip { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.16rem 0.55rem; background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-xs); font-size: 0.72rem; font-weight: 500; text-transform: capitalize; color: var(--text-secondary); }
.flag-chip img { width: 18px; height: 12px; object-fit: cover; border-radius: 2px; }

.hero-actions { display: flex; gap: 0.5rem; flex-shrink: 0; flex-wrap: wrap; }
.action-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: var(--transition); border: 1px solid var(--border); font-family: var(--font-body); background: var(--surface); color: var(--text); white-space: nowrap; }
.action-btn:hover:not(:disabled) { background: var(--surface-sunken); border-color: var(--border-strong); transform: translateY(-1px); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn.primary { background: var(--brand); color: #fff; border-color: var(--brand); }
.action-btn.primary:hover:not(:disabled) { background: var(--brand-hover); }

.hero-error { display: flex; align-items: center; gap: 0.6rem; color: var(--danger); font-weight: 600; position: relative; z-index: 1; }

/* Skeleton */
.hero-skeleton { position: relative; z-index: 1; }
.sk { background: linear-gradient(90deg, var(--surface-sunken) 25%, var(--neutral-soft) 37%, var(--surface-sunken) 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; border-radius: var(--radius-sm); }
.sk-title { width: 280px; height: 34px; margin-bottom: 0.75rem; }
.sk-sub { width: 420px; max-width: 80%; height: 18px; margin-bottom: 0.9rem; }
.sk-chips { width: 340px; height: 26px; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

/* MAIN */
.detalle-main { padding: 1.5rem 0 3rem; }
.metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.85rem; margin-bottom: 1.25rem; }
.metric-card { display: flex; align-items: center; gap: 0.85rem; padding: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); transition: var(--transition); }
.metric-card:hover { border-color: var(--border-strong); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.metric-icon { width: 42px; height: 42px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.metric-icon.i-people { background: var(--brand-soft); color: var(--brand); }
.metric-icon.i-docs { background: var(--danger-soft); color: var(--danger); }
.metric-icon.i-progress { background: var(--warning-soft); color: var(--warning); }
.metric-icon.i-cal { background: var(--neutral-soft); color: var(--text-secondary); }
.metric-info { display: flex; flex-direction: column; min-width: 0; }
.metric-number { font-size: 1.15rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.metric-label { font-size: 0.7rem; color: var(--text-secondary); }

.detalle-grid { display: grid; grid-template-columns: 1fr 1.35fr; gap: 1.25rem; align-items: start; }
.col-left, .col-right { display: flex; flex-direction: column; gap: 1.25rem; }

.panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.9rem 1.15rem; border-bottom: 1px solid var(--border); background: var(--surface-sunken); flex-wrap: wrap; }
.panel-title { font-size: 0.86rem; font-weight: 700; color: var(--text); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.panel-title i { color: var(--brand); }
.panel-count { font-size: 0.72rem; font-weight: 700; color: var(--brand); background: var(--brand-soft); border: 1px solid var(--brand-soft-border); padding: 0.1rem 0.5rem; border-radius: 999px; font-variant-numeric: tabular-nums; }
.panel-tools { display: flex; align-items: center; gap: 0.6rem; }
.panel-body { padding: 1.15rem; }
.panel-body.no-pad { padding: 0; }

.data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem 1.25rem; }
.data-item { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.data-item.full { grid-column: span 2; }
.data-label { font-size: 0.66rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-tertiary); }
.data-value { font-size: 0.85rem; color: var(--text); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.data-value.flag-value { text-transform: capitalize; }
.data-value.flag-value img { width: 18px; height: 12px; object-fit: cover; border-radius: 2px; }
.codigo-text { font-family: 'SF Mono', 'Courier New', monospace; font-size: 0.74rem; background: var(--surface-sunken); border: 1px solid var(--border); padding: 0.1rem 0.45rem; border-radius: var(--radius-xs); color: var(--text-secondary); }

.empty-mini { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; padding: 1.5rem 1rem; color: var(--text-secondary); text-align: center; font-size: 0.82rem; }
.empty-mini.pad { padding: 2rem 1rem; }
.empty-mini i { font-size: 1.6rem; color: var(--border-strong); }

.docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; }
.doc-card { display: flex; align-items: center; gap: 0.7rem; padding: 0.75rem 0.85rem; background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); text-align: left; font-family: var(--font-body); }
.doc-card:hover { border-color: var(--brand-soft-border); background: var(--surface); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.doc-icon { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--danger-soft); color: var(--danger); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.doc-meta { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; flex: 1; }
.doc-name { font-size: 0.8rem; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-sub { font-size: 0.68rem; color: var(--text-tertiary); }
.doc-open { color: var(--text-tertiary); font-size: 0.85rem; flex-shrink: 0; }
.doc-card:hover .doc-open { color: var(--brand); }

.mini-search { position: relative; display: flex; align-items: center; }
.mini-search i { position: absolute; left: 0.6rem; color: var(--text-tertiary); font-size: 0.78rem; }
.mini-search input { padding: 0.4rem 0.6rem 0.4rem 1.9rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text); font-size: 0.78rem; font-family: var(--font-body); width: 190px; transition: var(--transition); }
.mini-search input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-soft); }

.table-responsive { overflow-x: auto; }
.integrantes-table { width: 100%; border-collapse: collapse; min-width: 720px; }
.integrantes-table thead th { padding: 0.7rem 1rem; text-align: left; font-weight: 600; font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); background: var(--surface-sunken); border-bottom: 1px solid var(--border); white-space: nowrap; }
.integrantes-table tbody td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
.integrantes-table tbody tr:last-child td { border-bottom: none; }
.clickable-row { cursor: pointer; transition: var(--transition); }
.clickable-row:hover { background: var(--surface-sunken); }
.col-prog { min-width: 160px; }
.col-act { width: 46px; text-align: right; }

.person-cell { display: flex; align-items: center; gap: 0.6rem; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--brand-soft); color: var(--brand); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0; border: 1px solid var(--brand-soft-border); }
.person-name { font-size: 0.83rem; font-weight: 600; color: var(--text); }
.cell-muted { font-size: 0.8rem; color: var(--text-secondary); }
.lab-badge { display: inline-block; padding: 0.15rem 0.55rem; background: var(--neutral-soft); color: var(--text-secondary); border-radius: var(--radius-xs); font-size: 0.72rem; font-weight: 500; }

.progress-cell { display: flex; align-items: center; gap: 0.5rem; }
.progress-track { flex: 1; height: 7px; border-radius: 999px; background: var(--neutral-soft); overflow: hidden; min-width: 70px; }
.progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
.progress-fill.low { background: var(--danger); }
.progress-fill.mid { background: var(--warning); }
.progress-fill.complete { background: var(--brand); }
.progress-pct { font-size: 0.74rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; min-width: 34px; text-align: right; }
.progress-docs { display: block; font-size: 0.66rem; color: var(--text-tertiary); margin-top: 0.2rem; }

.row-btn { width: 30px; height: 30px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.78rem; }
.row-btn:hover { color: var(--brand); border-color: var(--brand-soft-border); background: var(--brand-soft); }
.empty-inline { text-align: center; color: var(--text-secondary); padding: 1.5rem !important; font-size: 0.82rem; }

/* Modal PDF */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,18,12,0.5); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; animation: overlayIn 0.15s ease; }
@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
.modal-container { background: var(--surface); border-radius: var(--radius-xl); width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); border: 1px solid var(--border); animation: modalIn 0.2s ease; }
@keyframes modalIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.pdf-viewer { max-width: 900px; width: calc(100% - 2rem); max-height: 92vh; }
.pdf-viewer .pdf-body { padding: 0.5rem 1rem 1rem; min-height: 60vh; display: flex; align-items: stretch; flex-direction: column; }
.pdf-embed-wrapper { flex: 1; display: flex; }
.pdf-iframe { width: 100%; height: 100%; border: none; min-height: 55vh; }
.empty-pdf-note { color: var(--text-secondary); padding: 1rem; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.35rem; border-bottom: 1px solid var(--border); background: var(--surface); border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
.modal-title { font-size: 0.95rem; font-weight: 600; color: var(--text); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.modal-title i { color: var(--danger); }
.modal-close-btn { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.8rem; }
.modal-close-btn:hover { background: var(--surface-sunken); color: var(--text); }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.6rem; padding: 0.9rem 1.35rem; border-top: 1px solid var(--border); background: var(--surface); border-radius: 0 0 var(--radius-xl) var(--radius-xl); }
.modal-btn { padding: 0.55rem 1.1rem; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: var(--transition); border: 1px solid transparent; font-family: var(--font-body); display: flex; align-items: center; gap: 0.4rem; text-decoration: none; }
.modal-btn.primary { background: var(--brand); color: #fff; }
.modal-btn.primary:hover { background: var(--brand-hover); }
.modal-btn.secondary { background: var(--surface); border-color: var(--border); color: var(--text); }
.modal-btn.secondary:hover { background: var(--surface-sunken); border-color: var(--border-strong); }

/* RESPONSIVE */
@media (max-width: 1100px) { .detalle-grid { grid-template-columns: 1fr; } .metrics-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .hero-code { font-size: 1.55rem; }
  .hero { flex-direction: column; }
  .hero-actions { width: 100%; }
  .hero-actions .action-btn { flex: 1; justify-content: center; }
  .data-grid { grid-template-columns: 1fr; }
  .data-item.full { grid-column: span 1; }
  .mini-search input { width: 140px; }
}
@media (max-width: 480px) { .metrics-row { grid-template-columns: 1fr; } .ensayo-detalle-page .container { padding: 0 1rem; } }
@media (prefers-reduced-motion: reduce) { .sk { animation: none; } * { transition-duration: 0.01ms !important; } }
</style>
