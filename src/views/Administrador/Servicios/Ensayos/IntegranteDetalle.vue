<template>
  <div :data-bs-theme="currentTheme" class="integrante-detalle-page">
    <!-- Header -->
    <header class="detalle-header">
      <div class="container">
        <nav class="breadcrumb-nav" aria-label="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item"><router-link to="/admin" class="breadcrumb-link"><i class="bi bi-house-door"></i> Dashboard</router-link></li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item"><router-link to="/admin/ensayos" class="breadcrumb-link"><i class="bi bi-clipboard-data"></i> Ensayos</router-link></li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item"><router-link :to="`/admin/ensayos/${ensayoId}`" class="breadcrumb-link">{{ ensayoCodigo || 'Ensayo' }}</router-link></li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item active"><i class="bi bi-person"></i> {{ integrante?.nombre || 'Integrante' }}</li>
          </ol>
        </nav>

        <button class="back-btn" @click="goBack"><i class="bi bi-arrow-left"></i> Volver al ensayo</button>

        <div v-if="loading" class="hero-skeleton">
          <div class="sk sk-title"></div>
          <div class="sk sk-sub"></div>
        </div>

        <div v-else-if="integrante" class="hero">
          <div class="hero-id">
            <span class="avatar-lg">{{ getInitials(integrante.nombre) }}</span>
            <div class="hero-id-text">
              <span class="section-eyebrow">Integrante del ensayo</span>
              <h1 class="hero-name">{{ integrante.nombre }}</h1>
              <div class="hero-contact">
                <a v-if="integrante.correo" :href="`mailto:${integrante.correo}`" class="contact-item"><i class="bi bi-envelope"></i> {{ integrante.correo }}</a>
                <span v-if="integrante.telefono" class="contact-item"><i class="bi bi-telephone"></i> {{ integrante.telefono }}</span>
                <span v-if="integrante.laboratorio" class="contact-item"><i class="bi bi-building"></i> {{ integrante.laboratorio }}</span>
              </div>
            </div>
          </div>

          <div class="hero-progress-card">
            <svg class="ring" viewBox="0 0 80 80">
              <circle class="ring-bg" cx="40" cy="40" r="34" />
              <circle class="ring-fill" :class="progresoClass(progresoGeneral)" cx="40" cy="40" r="34"
                :stroke-dasharray="ringCircumference" :stroke-dashoffset="ringOffset" />
            </svg>
            <div class="ring-center">
              <span class="ring-pct">{{ progresoGeneral }}%</span>
              <span class="ring-label">completado</span>
            </div>
          </div>
        </div>

        <div v-else class="hero-error"><i class="bi bi-exclamation-circle"></i><span>No se encontró el integrante solicitado.</span></div>
      </div>
    </header>

    <main v-if="integrante" class="detalle-main">
      <div class="container">
        <!-- Resumen de estados -->
        <section class="summary-row">
          <div class="summary-card">
            <span class="summary-dot d-total"></span>
            <div class="summary-info"><span class="summary-number">{{ documentos.length }}</span><span class="summary-label">Total requeridos</span></div>
          </div>
          <div class="summary-card">
            <span class="summary-dot d-ok"></span>
            <div class="summary-info"><span class="summary-number">{{ countByEstado('revisado') }}</span><span class="summary-label">Revisados</span></div>
          </div>
          <div class="summary-card">
            <span class="summary-dot d-up"></span>
            <div class="summary-info"><span class="summary-number">{{ countByEstado('subido') }}</span><span class="summary-label">Subidos</span></div>
          </div>
          <div class="summary-card">
            <span class="summary-dot d-pend"></span>
            <div class="summary-info"><span class="summary-number">{{ countByEstado('pendiente') }}</span><span class="summary-label">Pendientes</span></div>
          </div>
          <div class="summary-card">
            <span class="summary-dot d-rej"></span>
            <div class="summary-info"><span class="summary-number">{{ countByEstado('rechazado') }}</span><span class="summary-label">Rechazados</span></div>
          </div>
        </section>

        <!-- Documentos del integrante -->
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="bi bi-folder2-open"></i> Documentos del integrante</h3>
            <div class="panel-tools">
              <div class="filter-pills">
                <button class="pill" :class="{ active: estadoFiltro === null }" @click="estadoFiltro = null">Todos</button>
                <button class="pill" :class="{ active: estadoFiltro === 'pendiente' }" @click="estadoFiltro = 'pendiente'">Pendientes</button>
                <button class="pill" :class="{ active: estadoFiltro === 'subido' }" @click="estadoFiltro = 'subido'">Subidos</button>
                <button class="pill" :class="{ active: estadoFiltro === 'revisado' }" @click="estadoFiltro = 'revisado'">Revisados</button>
                <button class="pill" :class="{ active: estadoFiltro === 'rechazado' }" @click="estadoFiltro = 'rechazado'">Rechazados</button>
              </div>
            </div>
          </div>

          <div class="panel-body no-pad">
            <div v-if="labDocuments.length > 0" style="padding:0 1rem 1rem;">
              <h4 style="margin:0 0 0.6rem 0;">Documentos del laboratorio</h4>
              <div class="docs-grid">
                <button v-for="d in labDocuments" :key="d.id" class="doc-card" @click="openPdf(d)">
                  <div class="doc-icon" :class="docIconClass(d)"><i :class="docIcon(d)"></i></div>
                  <div class="doc-meta">
                    <span class="doc-name">{{ d.nombre }}</span>
                    <span class="doc-sub">{{ d.tipo || '' }} <template v-if="d.fecha"> · {{ d.fecha }}</template></span>
                  </div>
                  <i class="bi bi-eye doc-open"></i>
                </button>
              </div>
            </div>
            <div v-if="documentos.length === 0" class="empty-mini pad">
              <i class="bi bi-inbox"></i>
              <span>Este integrante aún no tiene documentos asignados.</span>
            </div>

            <div v-else class="table-responsive">
              <table class="docs-table">
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th class="col-act">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doc in filteredDocumentos" :key="doc.id">
                    <td>
                      <div class="doc-cell">
                        <span class="doc-mini-icon" :class="doc.estado === 'pendiente' ? 'muted' : ''"><i class="bi bi-file-earmark-pdf-fill"></i></span>
                        <span class="doc-name">{{ doc.nombre }}</span>
                      </div>
                    </td>
                    <td><span class="cell-muted">{{ doc.tipo || '—' }}</span></td>
                    <td>
                      <span class="estado-badge" :class="'e-' + doc.estado">
                        <i :class="estadoIcon(doc.estado)"></i>{{ estadoLabel(doc.estado) }}
                      </span>
                    </td>
                    <td><span class="cell-muted">{{ doc.fecha || '—' }}</span></td>
                    <td class="col-act">
                      <button v-if="doc.estado !== 'pendiente'" class="row-btn" @click="openPdf(doc)" title="Ver documento"><i class="bi bi-eye"></i></button>
                      <span v-else class="waiting-label">En espera</span>
                    </td>
                  </tr>
                  <tr v-if="filteredDocumentos.length === 0">
                    <td colspan="5" class="empty-inline">No hay documentos con ese estado.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p class="admin-note">
          <i class="bi bi-info-circle"></i>
          Los documentos se generan desde administración; el integrante los va subiendo y su progreso se actualiza automáticamente.
        </p>
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

type EstadoDoc = 'pendiente' | 'subido' | 'revisado' | 'rechazado'
interface Integrante { id: number | string; nombre: string; correo: string; laboratorio?: string; telefono?: string }
interface DocIntegrante { id: number | string; nombre: string; tipo?: string; estado: EstadoDoc; fecha?: string; url?: string }

const route = useRoute()
const router = useRouter()
const { currentTheme } = useTheme()

const ensayoId = computed(() => route.params.ensayoId as string)
const integranteId = computed(() => route.params.integranteId as string)
const ensayoCodigo = ref('')
const loading = ref(true)
const integrante = ref<Integrante | null>(null)
const documentos = ref<DocIntegrante[]>([])
const labDocuments = ref<DocIntegrante[]>([])
const estadoFiltro = ref<EstadoDoc | null>(null)

const labIdFromQuery = computed(() => {
  const q = route.query.labId
  if (!q) return null
  return String(q)
})

const getAuthToken = (): string | null => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null

const getInitials = (name: string) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
}
const progresoClass = (v: number) => v >= 100 ? 'complete' : v >= 50 ? 'mid' : 'low'

// Progreso: cuenta subidos + revisados como "completados"
const progresoGeneral = computed(() => {
  if (documentos.value.length === 0) return 0
  const done = documentos.value.filter(d => d.estado === 'subido' || d.estado === 'revisado').length
  return Math.round((done / documentos.value.length) * 100)
})

const ringCircumference = 2 * Math.PI * 34
const ringOffset = computed(() => ringCircumference - (progresoGeneral.value / 100) * ringCircumference)

const countByEstado = (e: EstadoDoc) => documentos.value.filter(d => d.estado === e).length

const filteredDocumentos = computed(() => {
  if (!estadoFiltro.value) return documentos.value
  return documentos.value.filter(d => d.estado === estadoFiltro.value)
})

const estadoLabel = (e: EstadoDoc) => ({ pendiente: 'Pendiente', subido: 'Subido', revisado: 'Revisado', rechazado: 'Rechazado' }[e] || e)
const estadoIcon = (e: EstadoDoc) => ({
  pendiente: 'bi bi-hourglass-split', subido: 'bi bi-cloud-arrow-up-fill',
  revisado: 'bi bi-check-circle-fill', rechazado: 'bi bi-x-circle-fill'
}[e] || 'bi bi-file-earmark')

// ---- Carga ----
const fetchEnsayoCodigo = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) { const body = await resp.json(); const r = body.data || body; ensayoCodigo.value = r.codigo || ''; return }
    }
  } catch (err) { console.error(err) }
  ensayoCodigo.value = 'VOL-PIP-MIC-001'
}

const fetchIntegrante = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/integrantes/${integranteId.value}`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) {
        const body = await resp.json(); const p = body.data || body
        integrante.value = {
          id: p.id || p.id_cliente || integranteId.value,
          nombre: p.nombre || `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Sin nombre',
          correo: p.correo || p.email || '', laboratorio: p.laboratorio || p.lab || '', telefono: p.telefono || p.phone || ''
        }
        return
      }
    }
  } catch (err) { console.error('Error fetching integrante', err) }
  integrante.value = demoIntegrante()
}

const fetchDocumentos = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/integrantes/${integranteId.value}/documentos`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) {
        const body = await resp.json()
        const rows = Array.isArray(body) ? body : (body.data || [])
        documentos.value = rows.map((d: any, i: number) => ({
          id: d.id || d.id_documento || i,
          nombre: d.nombre || d.name || `Documento ${i + 1}`,
          tipo: d.tipo || 'PDF',
          estado: (d.estado || 'pendiente') as EstadoDoc,
          fecha: d.fecha || d.updatedAt || '',
          url: d.url || d.pdfUrl || (d.id ? `${API_BASE}/api/ensayos/${ensayoId.value}/integrantes/${integranteId.value}/documentos/${d.id}.pdf` : '')
        }))
        return
      }
    }
  } catch (err) { console.error('Error fetching documentos integrante', err) }
  documentos.value = demoDocumentos()
}

const fetchLabDocuments = async (labId: string | number | null) => {
  if (!labId) { labDocuments.value = []; return }
  const token = getAuthToken()
  try {
    if (!token) return
    const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/laboratorios/${labId}/documentos`, { headers: { Authorization: `Bearer ${token}` } })
    if (!resp.ok) return
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : (body.data || [])
    labDocuments.value = rows.map((d: any, i: number) => ({ id: d.id || d.id_documento || i, nombre: d.nombre || d.name || `Documento ${i + 1}`, tipo: d.tipo || '', estado: (d.estado || 'subido') as EstadoDoc, fecha: d.createdAt || d.created_at || d.fecha || '', url: d.url || d.ruta || '' }))
    return
  } catch (err) {
    console.error('Error fetching lab documents', err)
  }
  labDocuments.value = []
}

const demoIntegrante = (): Integrante => ({
  id: integranteId.value, nombre: 'María González Ruiz', correo: 'maria.gonzalez@lab.mx',
  laboratorio: 'Lab Metrología Norte', telefono: '+52 442 123 4567'
})
const demoDocumentos = (): DocIntegrante[] => ([
  { id: 1, nombre: 'Carta de inscripción firmada', tipo: 'Formato', estado: 'revisado', fecha: '2026-01-12', url: '' },
  { id: 2, nombre: 'Certificado de calibración del equipo', tipo: 'Certificado', estado: 'revisado', fecha: '2026-01-14', url: '' },
  { id: 3, nombre: 'Hoja de resultados del ensayo', tipo: 'Resultados', estado: 'subido', fecha: '2026-01-20', url: '' },
  { id: 4, nombre: 'Reporte de incertidumbre', tipo: 'Reporte', estado: 'pendiente', fecha: '', url: '' },
  { id: 5, nombre: 'Evidencia fotográfica del montaje', tipo: 'Evidencia', estado: 'rechazado', fecha: '2026-01-18', url: '' }
])

const goBack = () => router.push(`/admin/ensayos/${ensayoId.value}`)

// ---- Visor PDF ----
const showPdfModal = ref(false)
const currentPdfUrl = ref<string | null>(null)
const originalPdfUrl = ref<string | null>(null)
const currentPdfBlobUrl = ref<string | null>(null)
const pdfFetchError = ref<string | null>(null)
const currentDocName = ref('')
const pdfSrc = computed(() => currentPdfBlobUrl.value || currentPdfUrl.value || '')

const openPdf = async (doc: DocIntegrante) => {
  currentDocName.value = doc.nombre
  showPdfModal.value = true
  pdfFetchError.value = null; currentPdfUrl.value = null; currentPdfBlobUrl.value = null; originalPdfUrl.value = doc.url || null
  document.body.style.overflow = 'hidden'
  if (!doc.url) { pdfFetchError.value = 'Documento sin URL disponible (demo)'; return }
  try {
    const resp = await fetch(doc.url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const ct = resp.headers.get('content-type') || ''
    if (!ct.includes('pdf')) { currentPdfUrl.value = doc.url; return }
    const blob = await resp.blob()
    currentPdfBlobUrl.value = URL.createObjectURL(blob)
  } catch (err: any) { pdfFetchError.value = String(err?.message || err); currentPdfUrl.value = doc.url }
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
  await Promise.all([fetchEnsayoCodigo(), fetchIntegrante(), fetchDocumentos()])
  // Si la ruta trae labId (desde el modal), cargar documentos del laboratorio
  if (labIdFromQuery.value) await fetchLabDocuments(labIdFromQuery.value)
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
  --info: #3a7ab8; --info-soft: rgba(58,122,184,0.12);
  --radius-xs: 6px; --radius-sm: 8px; --radius-md: 10px; --radius-lg: 12px; --radius-xl: 16px;
  --shadow-sm: 0 1px 3px rgba(20,24,16,0.06), 0 1px 2px rgba(20,24,16,0.04); --shadow-md: 0 6px 20px rgba(20,24,16,0.08); --shadow-lg: 0 16px 40px rgba(20,24,16,0.14);
  --transition: all 0.15s ease;
}
[data-bs-theme="dark"] {
  --bg: #0e100d; --surface: #161a13; --surface-sunken: #12150f; --border: rgba(255,255,255,0.08); --border-strong: rgba(255,255,255,0.14);
  --text: #eaeee4; --text-secondary: #99a38e; --text-tertiary: #6c7563;
  --brand: #7cbb55; --brand-hover: #8fc96b; --brand-soft: rgba(124,187,85,0.14); --brand-soft-border: rgba(124,187,85,0.3);
  --danger: #e2696a; --danger-soft: rgba(226,105,106,0.12); --warning: #dcaa4c; --warning-soft: rgba(220,170,76,0.12); --neutral-soft: rgba(255,255,255,0.05);
  --info: #6aa9db; --info-soft: rgba(106,169,219,0.14);
}
</style>

<style scoped>
.integrante-detalle-page { font-family: var(--font-body); background: var(--bg); min-height: 100vh; color: var(--text); font-size: 14px; -webkit-font-smoothing: antialiased; }
.integrante-detalle-page .container { max-width: 1200px; margin: 0 auto; padding: 0 1.75rem; }

.detalle-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1.5rem 0 1.75rem; position: relative; overflow: hidden; }
.detalle-header::after { content: ''; position: absolute; top: -45%; right: -6%; width: 360px; height: 360px; background: radial-gradient(circle, var(--brand-soft) 0%, transparent 68%); pointer-events: none; }
.breadcrumb-nav { margin-bottom: 1rem; position: relative; z-index: 1; }
.breadcrumb-list { display: flex; align-items: center; gap: 0.4rem; padding: 0; margin: 0; list-style: none; font-size: 0.78rem; flex-wrap: wrap; }
.breadcrumb-item { display: flex; align-items: center; gap: 0.3rem; color: var(--text-tertiary); }
.breadcrumb-item.active { color: var(--text-secondary); font-weight: 600; }
.breadcrumb-link { color: var(--text-tertiary); text-decoration: none; transition: var(--transition); display: flex; align-items: center; gap: 0.3rem; }
.breadcrumb-link:hover { color: var(--brand); }
.breadcrumb-separator { color: var(--border-strong); font-size: 0.6rem; }

.back-btn { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--surface-sunken); border: 1px solid var(--border); color: var(--text-secondary); padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: var(--transition); margin-bottom: 1.25rem; position: relative; z-index: 1; }
.back-btn:hover { color: var(--brand); border-color: var(--brand-soft-border); transform: translateX(-2px); }

.hero { display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; position: relative; z-index: 1; }
.hero-id { display: flex; align-items: center; gap: 1.1rem; min-width: 0; }
.avatar-lg { width: 64px; height: 64px; border-radius: 50%; background: var(--brand-soft); color: var(--brand); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800; flex-shrink: 0; border: 1px solid var(--brand-soft-border); }
.hero-id-text { min-width: 0; }
.section-eyebrow { display: inline-block; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brand); margin-bottom: 0.3rem; }
.hero-name { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); margin: 0 0 0.5rem; }
.hero-contact { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.contact-item { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--text-secondary); text-decoration: none; transition: var(--transition); }
a.contact-item:hover { color: var(--brand); }
.contact-item i { color: var(--text-tertiary); }

.hero-progress-card { position: relative; width: 92px; height: 92px; flex-shrink: 0; }
.ring { width: 92px; height: 92px; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: var(--neutral-soft); stroke-width: 8; }
.ring-fill { fill: none; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
.ring-fill.low { stroke: var(--danger); }
.ring-fill.mid { stroke: var(--warning); }
.ring-fill.complete { stroke: var(--brand); }
.ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-pct { font-size: 1.15rem; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; line-height: 1; }
.ring-label { font-size: 0.58rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 0.15rem; }

.hero-error { display: flex; align-items: center; gap: 0.6rem; color: var(--danger); font-weight: 600; position: relative; z-index: 1; }
.hero-skeleton { position: relative; z-index: 1; }
.sk { background: linear-gradient(90deg, var(--surface-sunken) 25%, var(--neutral-soft) 37%, var(--surface-sunken) 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; border-radius: var(--radius-sm); }
.sk-title { width: 280px; height: 30px; margin-bottom: 0.7rem; }
.sk-sub { width: 380px; max-width: 80%; height: 16px; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

.detalle-main { padding: 1.5rem 0 3rem; }

.summary-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
.summary-card { display: flex; align-items: center; gap: 0.7rem; padding: 0.85rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); transition: var(--transition); }
.summary-card:hover { border-color: var(--border-strong); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.summary-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.summary-dot.d-total { background: var(--text-tertiary); }
.summary-dot.d-ok { background: var(--brand); }
.summary-dot.d-up { background: var(--info); }
.summary-dot.d-pend { background: var(--warning); }
.summary-dot.d-rej { background: var(--danger); }
.summary-info { display: flex; flex-direction: column; }
.summary-number { font-size: 1.15rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; line-height: 1.1; }
.summary-label { font-size: 0.68rem; color: var(--text-secondary); }

.panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.9rem 1.15rem; border-bottom: 1px solid var(--border); background: var(--surface-sunken); flex-wrap: wrap; }
.panel-title { font-size: 0.86rem; font-weight: 700; color: var(--text); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.panel-title i { color: var(--brand); }
.panel-body { padding: 1.15rem; }
.panel-body.no-pad { padding: 0; }

.filter-pills { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.pill { padding: 0.32rem 0.7rem; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); color: var(--text-secondary); font-size: 0.74rem; font-weight: 600; cursor: pointer; transition: var(--transition); font-family: var(--font-body); }
.pill:hover { border-color: var(--border-strong); color: var(--text); }
.pill.active { background: var(--brand-soft); border-color: var(--brand-soft-border); color: var(--brand); }

.empty-mini { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; padding: 1.5rem 1rem; color: var(--text-secondary); text-align: center; font-size: 0.82rem; }
.empty-mini.pad { padding: 2.5rem 1rem; }
.empty-mini i { font-size: 1.8rem; color: var(--border-strong); }

.table-responsive { overflow-x: auto; }
.docs-table { width: 100%; border-collapse: collapse; min-width: 640px; }
.docs-table thead th { padding: 0.7rem 1.15rem; text-align: left; font-weight: 600; font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); background: var(--surface-sunken); border-bottom: 1px solid var(--border); white-space: nowrap; }
.docs-table tbody td { padding: 0.8rem 1.15rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
.docs-table tbody tr:last-child td { border-bottom: none; }
.docs-table tbody tr { transition: var(--transition); }
.docs-table tbody tr:hover { background: var(--surface-sunken); }
.col-act { width: 90px; text-align: right; }

.doc-cell { display: flex; align-items: center; gap: 0.65rem; }
.doc-mini-icon { width: 30px; height: 30px; border-radius: var(--radius-sm); background: var(--danger-soft); color: var(--danger); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
.doc-mini-icon.muted { background: var(--neutral-soft); color: var(--text-tertiary); }
.doc-name { font-size: 0.83rem; font-weight: 600; color: var(--text); }
.cell-muted { font-size: 0.8rem; color: var(--text-secondary); }

.estado-badge { display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.22rem 0.6rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; }
.estado-badge.e-pendiente { background: var(--warning-soft); color: var(--warning); }
.estado-badge.e-subido { background: var(--info-soft); color: var(--info); }
.estado-badge.e-revisado { background: var(--brand-soft); color: var(--brand); }
.estado-badge.e-rechazado { background: var(--danger-soft); color: var(--danger); }

.row-btn { width: 30px; height: 30px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.78rem; }
.row-btn:hover { color: var(--brand); border-color: var(--brand-soft-border); background: var(--brand-soft); }
.waiting-label { font-size: 0.72rem; color: var(--text-tertiary); font-style: italic; }
.empty-inline { text-align: center; color: var(--text-secondary); padding: 1.5rem !important; font-size: 0.82rem; }

.admin-note { display: flex; align-items: center; gap: 0.5rem; margin: 1rem 0 0; padding: 0.75rem 1rem; background: var(--info-soft); border: 1px solid var(--info); border-radius: var(--radius-md); color: var(--info); font-size: 0.8rem; }

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
@media (max-width: 900px) { .summary-row { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) {
  .hero { flex-direction: column; align-items: flex-start; }
  .hero-name { font-size: 1.35rem; }
  .panel-header { flex-direction: column; align-items: stretch; }
}
@media (max-width: 560px) { .summary-row { grid-template-columns: repeat(2, 1fr); } .integrante-detalle-page .container { padding: 0 1rem; } }
@media (prefers-reduced-motion: reduce) { .sk, .ring-fill { animation: none; transition: none; } * { transition-duration: 0.01ms !important; } }
</style>
