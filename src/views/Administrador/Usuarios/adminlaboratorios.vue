<template>
  <div :data-bs-theme="currentTheme" class="admin-labs-page">
    <!-- Encabezado -->
    <header class="admin-header">
      <div class="container">
        <nav class="breadcrumb-nav" aria-label="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item active"><i class="bi bi-building"></i> Laboratorios</li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <span class="section-eyebrow">Administración</span>
            <h1 class="page-title">Gestión de Laboratorios</h1>
            <p class="page-subtitle">Consulta los laboratorios registrados y los miembros de cada uno</p>
          </div>

          <div class="header-stats">
            <div v-for="s in stats" :key="s.label" class="stat-card">
              <div class="stat-icon" :class="s.tone"><i :class="s.icon"></i></div>
              <div class="stat-info">
                <span class="stat-number">{{ s.value }}</span>
                <span class="stat-label">{{ s.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Filtros -->
    <section class="control-section">
      <div class="container">
        <div class="control-card">
          <div class="control-body">
            <div class="search-box">
              <i class="bi bi-search search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="Buscar por nombre, ID, correo, municipio o estado..."
                aria-label="Buscar laboratorios"
              />
              <button v-if="searchQuery" type="button" class="clear-btn" aria-label="Limpiar búsqueda" @click="searchQuery = ''">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="filter-chips" role="group" aria-label="Filtrar por acreditación">
              <button
                v-for="opt in ACREDITADO_FILTERS"
                :key="opt.value"
                type="button"
                class="filter-chip"
                :class="{ active: selectedAcred === opt.value }"
                :aria-pressed="selectedAcred === opt.value"
                @click="selectedAcred = selectedAcred === opt.value ? null : opt.value"
              >
                <i :class="opt.icon"></i>
                <span>{{ opt.label }}</span>
                <span class="chip-count">{{ acredCount(opt.value) }}</span>
              </button>
            </div>

            <div class="actions-group">
              <button type="button" class="action-btn secondary" :disabled="!hasActiveFilters" @click="clearFilters">
                <i class="bi bi-arrow-counterclockwise"></i><span>Limpiar</span>
              </button>
              <button type="button" class="action-btn secondary" :disabled="!filteredLabs.length" @click="exportData">
                <i class="bi bi-download"></i><span>Exportar</span>
              </button>
              <button type="button" class="action-btn primary" :disabled="loading" @click="loadLabs">
                <i class="bi bi-arrow-clockwise"></i><span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Listado -->
    <main class="list-section">
      <div class="container">
        <div class="list-card">
          <div class="list-header">
            <div>
              <h4 class="list-title">Laboratorios registrados</h4>
              <p class="list-subtitle">
                Mostrando {{ paginatedLabs.length }} de {{ filteredLabs.length }} laboratorios
                <span v-if="filteredLabs.length !== labs.length">(filtrado de {{ labs.length }})</span>
              </p>
            </div>
            <div class="list-controls">
              <select v-model="sortKey" class="per-page-select" aria-label="Ordenar por">
                <option value="nombre">Ordenar: Nombre</option>
                <option value="id">Ordenar: ID</option>
                <option value="miembros">Ordenar: Miembros</option>
              </select>
              <select v-model.number="itemsPerPage" class="per-page-select" aria-label="Laboratorios por página">
                <option :value="10">10 por página</option>
                <option :value="25">25 por página</option>
                <option :value="50">50 por página</option>
              </select>
            </div>
          </div>

          <!-- Cargando -->
          <div v-if="loading" class="state-box" role="status">
            <span class="spinner"></span>
            <p>Cargando laboratorios...</p>
          </div>

          <!-- Error -->
          <div v-else-if="loadError" class="state-box">
            <i class="bi bi-exclamation-triangle state-icon warn"></i>
            <h5>No se pudieron cargar los laboratorios</h5>
            <p>{{ loadError }}</p>
            <button type="button" class="action-btn primary" @click="loadLabs">
              <i class="bi bi-arrow-clockwise"></i><span>Reintentar</span>
            </button>
          </div>

          <!-- Vacío -->
          <div v-else-if="!filteredLabs.length" class="state-box">
            <i class="bi bi-building state-icon"></i>
            <h5>{{ labs.length ? 'No se encontraron laboratorios' : 'Aún no hay laboratorios registrados' }}</h5>
            <p>{{ labs.length ? 'Ningún laboratorio coincide con los filtros aplicados.' : 'Cuando se registre uno aparecerá aquí.' }}</p>
            <button v-if="labs.length" type="button" class="action-btn secondary" @click="clearFilters">
              <i class="bi bi-arrow-counterclockwise"></i><span>Limpiar filtros</span>
            </button>
          </div>

          <!-- Laboratorios -->
          <ul v-else class="lab-list">
            <li v-for="l in paginatedLabs" :key="l.laboratorio_id" class="lab-item" :class="{ open: isOpen(l) }">
              <div class="lab-row">
                <div class="lab-avatar" :style="{ background: avatarColor(l.laboratorio_id) }">{{ initials(l.nombre) }}</div>

                <div class="lab-main lab-main-clickable" role="button" tabindex="0" @click="openLab(l)" @keydown.enter="openLab(l)" @keydown.space.prevent="openLab(l)">
                  <div class="lab-name-line">
                    <h5 class="lab-name">{{ l.nombre }}</h5>
                    <span class="acred-pill" :class="`ac-${acredKey(l.acreditado)}`">
                      <i class="bi bi-patch-check"></i> {{ acredLabel(l.acreditado) }}
                    </span>
                  </div>
                  <div class="lab-meta">
                    <span class="meta-id mono" title="ID del laboratorio"><i class="bi bi-hash"></i>{{ l.laboratorio_id }}</span>
                    <a v-if="l.correo_1" :href="`mailto:${l.correo_1}`" class="meta-link"><i class="bi bi-envelope"></i> {{ l.correo_1 }}</a>
                    <span v-if="location(l)" class="meta-item"><i class="bi bi-geo-alt"></i> {{ location(l) }}</span>
                    <span v-if="l.tel_tecnico" class="meta-item"><i class="bi bi-telephone"></i> {{ l.tel_tecnico }}</span>
                  </div>
                </div>

                <button
                  type="button"
                  class="members-toggle"
                  :aria-expanded="isOpen(l)"
                  :aria-controls="`members-${l.laboratorio_id}`"
                  @click="toggle(l)"
                >
                  <i class="bi bi-people"></i>
                  <span>{{ memberCountLabel(l) }}</span>
                  <i class="bi bi-chevron-down chevron"></i>
                </button>
              </div>

              <!-- Miembros -->
              <div v-if="isOpen(l)" :id="`members-${l.laboratorio_id}`" class="members-panel">
                <div v-if="membersState[l.laboratorio_id]?.loading" class="members-state" role="status">
                  <span class="spinner sm"></span> Cargando miembros...
                </div>

                <div v-else-if="membersState[l.laboratorio_id]?.error" class="members-state error">
                  <i class="bi bi-exclamation-triangle"></i>
                  <span>{{ membersState[l.laboratorio_id]?.error }}</span>
                  <button type="button" class="link-btn" @click="loadMembers(l, true)">Reintentar</button>
                </div>

                <div v-else-if="!membersOf(l).length" class="members-state">
                  <i class="bi bi-person-x"></i> Este laboratorio aún no tiene miembros.
                </div>

                <ul v-else class="member-grid">
                  <li v-for="m in membersOf(l)" :key="m.usuario_id" class="member-card">
                    <div class="member-avatar" :style="{ background: avatarColor(m.usuario_id) }">{{ initials(m.fullName) }}</div>
                    <div class="member-info">
                      <strong class="member-name">{{ m.fullName }}</strong>
                      <a v-if="m.correo" :href="`mailto:${m.correo}`" class="member-email">{{ m.correo }}</a>
                      <span v-else class="member-email muted">Sin correo</span>
                    </div>
                    <span class="role-pill" :class="`role-${roleKey(m.rol_equipo)}`">
                      <i :class="roleMeta(m.rol_equipo).icon"></i> {{ roleMeta(m.rol_equipo).label }}
                    </span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          <!-- Paginación -->
          <div v-if="!loading && !loadError && filteredLabs.length" class="list-footer">
            <div class="pagination-wrapper">
              <button type="button" class="page-btn" :disabled="currentPage === 1" title="Anterior" @click="currentPage--">
                <i class="bi bi-chevron-left"></i>
              </button>
              <template v-for="p in visiblePages" :key="p">
                <button
                  v-if="p !== '...'"
                  type="button"
                  class="page-btn"
                  :class="{ active: p === currentPage }"
                  @click="currentPage = p as number"
                >{{ p }}</button>
                <span v-else class="page-ellipsis">...</span>
              </template>
              <button type="button" class="page-btn" :disabled="currentPage === totalPages" title="Siguiente" @click="currentPage++">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
            <div class="page-info">Página {{ currentPage }} de {{ totalPages }}</div>
          </div>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <Transition name="admin-lab-modal">
        <div v-if="showLabModal" class="admin-lab-overlay" @click.self="closeLabModal">
          <div class="admin-lab-modal" :class="{ 'theme-dark': currentTheme === 'dark' }" role="dialog" aria-modal="true" aria-labelledby="admin-lab-modal-title">
            <header class="admin-lab-modal-header">
              <div class="lab-avatar modal-avatar" :style="{ background: selectedLab ? avatarColor(selectedLab.laboratorio_id) : undefined }">
                {{ selectedLab ? initials(selectedLab.nombre) : '' }}
              </div>
              <div>
                <span class="section-eyebrow">Información del laboratorio</span>
                <h2 id="admin-lab-modal-title">{{ selectedLab?.nombre || 'Laboratorio' }}</h2>
                <span class="modal-lab-id">ID {{ selectedLab?.laboratorio_id }}</span>
              </div>
              <button type="button" class="modal-close" aria-label="Cerrar" @click="closeLabModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </header>

            <div v-if="labDetailLoading" class="modal-state">
              <span class="spinner"></span>
              <p>Cargando información...</p>
            </div>
            <div v-else-if="labDetailError" class="modal-state error">
              <i class="bi bi-exclamation-triangle"></i>
              <p>{{ labDetailError }}</p>
              <button type="button" class="action-btn primary" @click="selectedLab && openLab(selectedLab)">
                <i class="bi bi-arrow-clockwise"></i> Reintentar
              </button>
            </div>
            <div v-else class="admin-lab-modal-body">
              <section class="detail-section">
                <div class="detail-section-title"><i class="bi bi-person-lines-fill"></i><h3>Contacto</h3></div>
                <dl class="detail-grid">
                  <div><dt>Correo principal</dt><dd>{{ detailValue(labDetail?.laboratorio?.correo_1) }}</dd></div>
                  <div><dt>Correo alterno</dt><dd>{{ detailValue(labDetail?.laboratorio?.correo_2) }}</dd></div>
                  <div><dt>Teléfono técnico</dt><dd>{{ detailValue(labDetail?.laboratorio?.tel_tecnico) }}</dd></div>
                  <div><dt>Teléfono fijo</dt><dd>{{ detailValue(labDetail?.laboratorio?.tel_fijo) }}</dd></div>
                  <div class="detail-wide"><dt>Dirección</dt><dd>{{ labAddress(labDetail?.laboratorio) }}</dd></div>
                </dl>
              </section>

              <section class="detail-section">
                <div class="detail-section-title"><i class="bi bi-receipt"></i><h3>Facturación</h3></div>
                <dl class="detail-grid">
                  <div><dt>Razón social</dt><dd>{{ detailValue(labDetail?.facturacion?.razon_social) }}</dd></div>
                  <div><dt>RFC</dt><dd class="mono">{{ detailValue(labDetail?.facturacion?.rfc) }}</dd></div>
                  <div><dt>Régimen fiscal</dt><dd>{{ detailValue(labDetail?.facturacion?.regimen_fiscal) }}</dd></div>
                  <div><dt>Uso del CFDI</dt><dd>{{ detailValue(labDetail?.facturacion?.cfdi) }}</dd></div>
                  <div><dt>Método de pago</dt><dd>{{ detailValue(labDetail?.facturacion?.metodo_pago) }}</dd></div>
                  <div><dt>Forma de pago</dt><dd>{{ detailValue(labDetail?.facturacion?.forma_pago) }}</dd></div>
                  <div><dt>Institución bancaria</dt><dd>{{ detailValue(labDetail?.facturacion?.institucion_bancaria) }}</dd></div>
                  <div><dt>Cuenta o CLABE</dt><dd class="mono">{{ detailValue(labDetail?.facturacion?.cuenta_clabe) }}</dd></div>
                  <div><dt>Correo de facturación</dt><dd>{{ detailValue(labDetail?.facturacion?.correo_1) }}</dd></div>
                  <div><dt>Teléfono de facturación</dt><dd>{{ detailValue(labDetail?.facturacion?.tel_tecnico || labDetail?.facturacion?.tel_fijo) }}</dd></div>
                </dl>
              </section>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <BaseToast ref="toastRef" toast-id="adminLaboratoriosToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import useApiBase from '@/composables/useApiBase'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import BaseToast from '@/components/UI/BaseToast.vue'

/* ============================================================
   Tipos
   ============================================================ */
interface Laboratorio {
  laboratorio_id: number
  nombre: string
  correo_1?: string
  tel_tecnico?: string
  municipio?: string
  estado?: string
  acreditado?: string
  total_miembros?: number
}

interface LabDetail {
  laboratorio: Laboratorio & Record<string, string | number | null | undefined>
  facturacion: Record<string, string | number | null | undefined> | null
}

interface Miembro {
  usuario_id: string
  rol_equipo?: string
  correo?: string
  fullName: string
}

interface MembersState {
  loading: boolean
  loaded: boolean
  error: string
  list: Miembro[]
}

/* ============================================================
   Constantes
   ============================================================ */
const ROLES: Record<string, { label: string; icon: string }> = {
  admin: { label: 'Administrador', icon: 'bi bi-shield-check' },
  tecnico: { label: 'Técnico', icon: 'bi bi-tools' },
  contacto: { label: 'Contacto', icon: 'bi bi-person-lines-fill' },
  miembro: { label: 'Miembro', icon: 'bi bi-person' },
  pendiente: { label: 'Solicitud pendiente', icon: 'bi bi-hourglass-split' }
}
const ROLES_PENDIENTES = ['pendiente', 'solicitante', 'solicitud']

const ACREDITADO_FILTERS = [
  { value: 'si', label: 'Acreditados', icon: 'bi bi-patch-check' },
  { value: 'en_proceso', label: 'En proceso', icon: 'bi bi-hourglass-split' },
  { value: 'no', label: 'No acreditados', icon: 'bi bi-x-circle' }
]
const ACREDITADO_LABELS: Record<string, string> = { si: 'Acreditado', en_proceso: 'En proceso', no: 'No acreditado' }

const AVATAR_COLORS = ['#5d8a2f', '#4a7b22', '#6b8a4a', '#7a9a5a', '#4f7a3a', '#8a9e7c']

/* ============================================================
   Estado
   ============================================================ */
const { api, authHeaders } = useApiBase()
const { currentTheme } = useTheme()
const { toastRef, showToast } = useToast()

const loading = ref(true)
const loadError = ref('')
const labs = ref<Laboratorio[]>([])

const searchQuery = ref('')
const selectedAcred = ref<string | null>(null)
const sortKey = ref<'nombre' | 'id' | 'miembros'>('nombre')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const openId = ref<number | null>(null)
const showLabModal = ref(false)
const labDetailLoading = ref(false)
const labDetailError = ref('')
const selectedLab = ref<Laboratorio | null>(null)
const labDetail = ref<LabDetail | null>(null)
// Miembros por laboratorio: se piden solo al expandir y se guardan para no repetir la petición
const membersState = reactive<Record<number, MembersState>>({})

/* ============================================================
   Utilidades
   ============================================================ */
const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

const requestJson = async (url: string, init: RequestInit = {}) => {
  const resp = await fetch(url, init)
  const body = await resp.json().catch(() => ({}))
  if (resp.status === 401 || resp.status === 403) throw new Error('Tu sesión expiró o no tienes permiso para ver esta información.')
  if (!resp.ok) throw new Error(body?.message || `No se pudo completar la operación (HTTP ${resp.status})`)
  return body
}

const initials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

// Color estable por id (mismo laboratorio o persona = mismo color siempre)
const avatarColor = (seed: string | number) => {
  const s = String(seed)
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

const roleKey = (rol?: string) => {
  const r = String(rol || 'miembro').toLowerCase()
  if (ROLES_PENDIENTES.includes(r)) return 'pendiente'
  return ROLES[r] ? r : 'miembro'
}
const roleMeta = (rol?: string) => ROLES[roleKey(rol)]

const acredKey = (v?: string) => (v && ACREDITADO_LABELS[v] ? v : 'no')
const acredLabel = (v?: string) => ACREDITADO_LABELS[acredKey(v)]
const location = (l: Laboratorio) => [l.municipio, l.estado].filter(Boolean).join(', ')
const detailValue = (value: unknown) => value === null || value === undefined || String(value).trim() === '' ? '—' : String(value)
const labAddress = (lab?: Record<string, any> | null) => {
  if (!lab) return '—'
  return [
    lab.calle,
    lab.no_ext && `No. ${lab.no_ext}`,
    lab.no_int && `Int. ${lab.no_int}`,
    lab.colonia,
    lab.municipio,
    lab.delegacion,
    lab.estado,
    lab.cp
  ].filter(Boolean).join(', ') || '—'
}

/* ============================================================
   Miembros
   ============================================================ */
const membersOf = (l: Laboratorio) => (membersState[l.laboratorio_id]?.list ?? []).filter(m => roleKey(m.rol_equipo) !== 'pendiente')

const memberCount = (l: Laboratorio): number | null => {
  const st = membersState[l.laboratorio_id]
  if (st?.loaded) return membersOf(l).length
  return typeof l.total_miembros === 'number' ? l.total_miembros : null
}

const memberCountLabel = (l: Laboratorio) => {
  const n = memberCount(l)
  if (n === null) return 'Ver miembros'
  return `${n} ${n === 1 ? 'miembro' : 'miembros'}`
}

const loadMembers = async (l: Laboratorio, force = false) => {
  const id = l.laboratorio_id
  const st = membersState[id] ?? (membersState[id] = { loading: false, loaded: false, error: '', list: [] })
  if (st.loading || (st.loaded && !force)) return
  st.loading = true
  st.error = ''
  try {
    const body = await requestJson(`${api.value}/api/laboratorios/${id}/miembros`, { headers: { ...authHeaders() } })
    st.list = (Array.isArray(body.data) ? body.data : []).map((m: any) => ({
      ...m,
      fullName: `${m.nombre || ''} ${m.primer_apellido || ''} ${m.segundo_apellido || ''}`.trim() || 'Miembro del laboratorio'
    })) as Miembro[]
    st.loaded = true
  } catch (err) {
    st.error = errorMessage(err)
  } finally {
    st.loading = false
  }
}

const isOpen = (l: Laboratorio) => openId.value === l.laboratorio_id

const toggle = (l: Laboratorio) => {
  if (isOpen(l)) {
    openId.value = null
    return
  }
  openId.value = l.laboratorio_id
  void loadMembers(l)
}

const closeLabModal = () => {
  if (labDetailLoading.value) return
  showLabModal.value = false
  selectedLab.value = null
  labDetail.value = null
  labDetailError.value = ''
}

const openLab = async (lab: Laboratorio) => {
  selectedLab.value = lab
  showLabModal.value = true
  labDetailLoading.value = true
  labDetailError.value = ''
  try {
    const body = await requestJson(`${api.value}/api/laboratorios/${lab.laboratorio_id}`, {
      headers: { ...authHeaders() }
    })
    labDetail.value = body.data || null
  } catch (err) {
    labDetail.value = null
    labDetailError.value = errorMessage(err)
  } finally {
    labDetailLoading.value = false
  }
}

/* ============================================================
   Carga
   ============================================================ */
const loadLabs = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const body = await requestJson(`${api.value}/api/laboratorios`, { headers: { ...authHeaders() } })
    const rows = Array.isArray(body.data) ? body.data : Array.isArray(body) ? body : []
    labs.value = rows.map((lab: Laboratorio) => ({
      ...lab,
      total_miembros: lab.total_miembros === undefined ? undefined : Number(lab.total_miembros)
    }))
  } catch (err) {
    labs.value = []
    loadError.value = errorMessage(err)
  } finally {
    loading.value = false
  }
}

/* ============================================================
   Filtros, orden y paginación
   ============================================================ */
const hasActiveFilters = computed(() => !!(searchQuery.value || selectedAcred.value))
const acredCount = (value: string) => labs.value.filter(l => acredKey(l.acreditado) === value).length

const stats = computed(() => [
  { label: 'Laboratorios', value: labs.value.length, icon: 'bi bi-building', tone: 'labs' },
  { label: 'Acreditados', value: acredCount('si'), icon: 'bi bi-patch-check-fill', tone: 'ok' },
  { label: 'En proceso', value: acredCount('en_proceso'), icon: 'bi bi-hourglass-split', tone: 'pending' }
])

const filteredLabs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const list = labs.value.filter(l => {
    const matchesSearch =
      !q ||
      [l.nombre, String(l.laboratorio_id), l.correo_1, l.municipio, l.estado].some(v => String(v ?? '').toLowerCase().includes(q))
    const matchesAcred = !selectedAcred.value || acredKey(l.acreditado) === selectedAcred.value
    return matchesSearch && matchesAcred
  })

  return [...list].sort((a, b) => {
    if (sortKey.value === 'id') return a.laboratorio_id - b.laboratorio_id
    if (sortKey.value === 'miembros') return (memberCount(b) ?? -1) - (memberCount(a) ?? -1)
    return (a.nombre || '').localeCompare(b.nombre || '', 'es')
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredLabs.value.length / itemsPerPage.value)))

const paginatedLabs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredLabs.value.slice(start, start + itemsPerPage.value)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  const start = Math.max(2, currentPage.value - 2)
  const end = Math.min(total - 1, currentPage.value + 2)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)
  return pages
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedAcred.value = null
}

// Cualquier cambio de filtro, orden o tamaño vuelve a la primera página y cierra el detalle abierto
watch([searchQuery, selectedAcred, sortKey, itemsPerPage], () => {
  currentPage.value = 1
  openId.value = null
})
watch(currentPage, () => {
  openId.value = null
})

/* ============================================================
   Exportar (CSV con los laboratorios filtrados; incluye miembros ya cargados)
   ============================================================ */
const exportData = () => {
  const headers = ['ID', 'Laboratorio', 'Correo', 'Teléfono', 'Municipio', 'Estado', 'Acreditación', 'Miembros']
  const rows = filteredLabs.value.map(l => [
    l.laboratorio_id,
    l.nombre,
    l.correo_1 || '',
    l.tel_tecnico || '',
    l.municipio || '',
    l.estado || '',
    acredLabel(l.acreditado),
    membersState[l.laboratorio_id]?.loaded
      ? membersOf(l).map(m => `${m.fullName} (${roleMeta(m.rol_equipo).label})`).join('; ')
      : memberCount(l) ?? ''
  ])
  const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `laboratorios-sena-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast('Archivo CSV exportado correctamente', 'success', 'Exportado')
}

/* ============================================================
   Ciclo de vida
   ============================================================ */
watch(currentTheme, t => document.documentElement.setAttribute('data-bs-theme', t))

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  void loadLabs()
})
</script>

<style scoped>
/* ============================================================
   TOKENS (usan las variables globales de SENA con respaldo)
   ============================================================ */
.admin-labs-page {
  --al-green: var(--sena-green, #5d8a2f);
  --al-green-light: var(--sena-green-light, #7aab3d);
  --al-green-pale: var(--sena-green-pale, #edf4e3);
  --al-text: var(--sena-text, #1f2a14);
  --al-muted: var(--sena-muted, #6b7a5c);
  --al-border: var(--sena-border, #e2e8da);
  --al-surface: #ffffff;
  --al-surface-alt: #f6f8f2;
  --al-radius: 16px;
  --al-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  --al-transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  font-family: var(--font-body, 'DM Sans', 'Segoe UI', sans-serif);
  background: #fafaf8;
  color: var(--al-text);
  /* Sin 100vh ni overflow: solo hace scroll el navegador */
  padding-bottom: 2rem;
}

[data-bs-theme="dark"] .admin-labs-page {
  --al-green-pale: rgba(93, 138, 47, 0.18);
  --al-text: #e8ede3;
  --al-muted: #9fb08f;
  --al-border: rgba(122, 171, 61, 0.14);
  --al-surface: #0e1509;
  --al-surface-alt: #131a0e;
  --al-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  background: #0c0f0a;
}

.mono { font-family: var(--font-mono, ui-monospace, 'SFMono-Regular', Menlo, monospace); }

/* ============================================================
   ENCABEZADO
   ============================================================ */
.admin-header {
  background: var(--al-surface);
  border-bottom: 1px solid var(--al-border);
  padding: 2rem 0 1.5rem;
}

.breadcrumb-nav { margin-bottom: 1.5rem; }

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.82rem;
}

.breadcrumb-item { display: flex; align-items: center; gap: 0.35rem; color: var(--al-muted); }
.breadcrumb-item.active { color: var(--al-green); font-weight: 600; }
.breadcrumb-link { display: flex; align-items: center; gap: 0.35rem; color: var(--al-muted); text-decoration: none; transition: var(--al-transition); }
.breadcrumb-link:hover { color: var(--al-green); }
.breadcrumb-separator { color: #c0c8b8; font-size: 0.65rem; }

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 2rem;
}

.section-eyebrow {
  display: inline-block;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: var(--al-green-pale);
  color: var(--al-green-light);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.page-title {
  margin: 0.25rem 0 0.35rem;
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  font-weight: 700;
  color: var(--al-text);
}

.page-subtitle { margin: 0; font-size: 0.9rem; color: var(--al-muted); }

.header-stats { display: flex; flex-wrap: wrap; gap: 0.75rem; }

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 160px;
  padding: 1rem 1.25rem;
  background: var(--al-surface-alt);
  border: 1px solid var(--al-border);
  border-radius: var(--al-radius);
  box-shadow: var(--al-shadow);
}

.stat-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  font-size: 1.15rem;
}

.stat-icon.labs { background: linear-gradient(135deg, #6b7b5a, #5d8a2f); }
.stat-icon.ok { background: linear-gradient(135deg, #5d8a2f, #7aab3d); }
.stat-icon.pending { background: linear-gradient(135deg, #b8860b, #e0a82e); }

.stat-info { display: flex; flex-direction: column; }
.stat-number { font-size: 1.4rem; font-weight: 700; line-height: 1; color: var(--al-text); }
.stat-label { margin-top: 0.2rem; font-size: 0.78rem; color: var(--al-muted); }

/* ============================================================
   FILTROS
   ============================================================ */
.control-section { padding: 1.5rem 0 0.5rem; }

.control-card {
  background: var(--al-surface);
  border: 1px solid var(--al-border);
  border-radius: 20px;
  box-shadow: var(--al-shadow);
}

.control-body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
}

.search-box { position: relative; flex: 1 1 280px; }

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--al-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.7rem 2.5rem 0.7rem 2.6rem;
  border: 1.5px solid var(--al-border);
  border-radius: 12px;
  background: var(--al-surface-alt);
  color: var(--al-text);
  font: inherit;
  font-size: 0.9rem;
  transition: var(--al-transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--al-green-light);
  box-shadow: 0 0 0 3px rgba(122, 171, 61, 0.2);
}

.clear-btn {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--al-muted);
  cursor: pointer;
}

.clear-btn:hover { background: var(--al-border); }

.filter-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.9rem;
  border: 1.5px solid var(--al-border);
  border-radius: 999px;
  background: transparent;
  color: var(--al-muted);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--al-transition);
}

.filter-chip:hover { border-color: var(--al-green-light); color: var(--al-text); }
.filter-chip.active { background: var(--al-green); border-color: var(--al-green); color: #fff; }

.chip-count {
  min-width: 20px;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: rgba(128, 128, 128, 0.18);
  font-size: 0.72rem;
  text-align: center;
}

.filter-chip.active .chip-count { background: rgba(255, 255, 255, 0.25); }

.actions-group { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-left: auto; }

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border: 1.5px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--al-transition);
}

.action-btn.primary { background: var(--al-green); color: #fff; }
.action-btn.primary:hover:not(:disabled) { filter: brightness(1.1); }
.action-btn.secondary { background: transparent; border-color: var(--al-border); color: var(--al-text); }
.action-btn.secondary:hover:not(:disabled) { border-color: var(--al-green-light); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn:focus-visible,
.filter-chip:focus-visible,
.members-toggle:focus-visible,
.page-btn:focus-visible,
.link-btn:focus-visible {
  outline: 3px solid rgba(122, 171, 61, 0.45);
  outline-offset: 2px;
}

/* ============================================================
   LISTADO
   ============================================================ */
.list-section { padding-top: 1rem; }

.list-card {
  background: var(--al-surface);
  border: 1px solid var(--al-border);
  border-radius: 20px;
  box-shadow: var(--al-shadow);
  overflow: hidden;
}

.list-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--al-border);
}

.list-title { margin: 0; font-size: 1.05rem; font-weight: 700; }
.list-subtitle { margin: 0.2rem 0 0; font-size: 0.8rem; color: var(--al-muted); }
.list-controls { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.per-page-select {
  padding: 0.5rem 0.8rem;
  border: 1.5px solid var(--al-border);
  border-radius: 10px;
  background: var(--al-surface-alt);
  color: var(--al-text);
  font: inherit;
  font-size: 0.82rem;
}

.lab-list { margin: 0; padding: 0; list-style: none; }
.lab-item + .lab-item { border-top: 1px solid var(--al-border); }
.lab-item.open { background: var(--al-surface-alt); }

.lab-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
}

.lab-avatar,
.member-avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: #fff;
  font-weight: 700;
}

.lab-avatar { width: 52px; height: 52px; font-size: 1.05rem; }
.member-avatar { width: 40px; height: 40px; border-radius: 50%; font-size: 0.85rem; }

.lab-main { flex: 1; min-width: 0; }
.lab-main-clickable { cursor: pointer; }
.lab-main-clickable:focus-visible { outline: 3px solid rgba(122, 171, 61, 0.45); outline-offset: 4px; border-radius: 8px; }

.lab-name-line { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; }

.lab-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.lab-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.1rem;
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: var(--al-muted);
}

.meta-id {
  padding: 0.05rem 0.5rem;
  border-radius: 6px;
  background: var(--al-green-pale);
  color: var(--al-green);
  font-weight: 700;
}

.meta-link { color: var(--al-muted); text-decoration: none; }
.meta-link:hover { color: var(--al-green); text-decoration: underline; }
.meta-item i,
.meta-link i { margin-right: 0.25rem; }

.acred-pill,
.role-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.ac-si { background: rgba(93, 138, 47, 0.14); color: var(--al-green); }
.ac-en_proceso { background: rgba(224, 168, 46, 0.18); color: #9a6b00; }
.ac-no { background: rgba(128, 128, 128, 0.14); color: var(--al-muted); }
[data-bs-theme="dark"] .ac-en_proceso { color: #e0b44a; }

.role-admin { background: rgba(93, 138, 47, 0.14); color: var(--al-green); }
.role-tecnico { background: rgba(13, 110, 253, 0.1); color: #0b5ed7; }
.role-contacto { background: rgba(224, 168, 46, 0.18); color: #9a6b00; }
.role-miembro { background: rgba(128, 128, 128, 0.14); color: var(--al-muted); }
[data-bs-theme="dark"] .role-tecnico { color: #6ea8fe; }
[data-bs-theme="dark"] .role-contacto { color: #e0b44a; }

.members-toggle {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.95rem;
  border: 1.5px solid var(--al-border);
  border-radius: 12px;
  background: var(--al-surface);
  color: var(--al-text);
  font: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--al-transition);
}

.members-toggle:hover { border-color: var(--al-green-light); }
.lab-item.open .members-toggle { background: var(--al-green); border-color: var(--al-green); color: #fff; }
.chevron { font-size: 0.7rem; transition: transform 0.25s ease; }
.lab-item.open .chevron { transform: rotate(180deg); }

/* Miembros */
.members-panel { padding: 0 1.5rem 1.4rem; }

.members-state {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 1.1rem;
  border: 1px dashed var(--al-border);
  border-radius: 12px;
  color: var(--al-muted);
  font-size: 0.88rem;
}

.members-state.error { color: #b02a37; border-color: rgba(220, 53, 69, 0.4); }

.link-btn {
  border: 0;
  background: none;
  color: var(--al-green);
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  padding: 0.8rem 0.95rem;
  background: var(--al-surface);
  border: 1px solid var(--al-border);
  border-radius: 14px;
}

.member-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.member-name { font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.member-email {
  font-size: 0.78rem;
  color: var(--al-muted);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

a.member-email:hover { color: var(--al-green); text-decoration: underline; }
.member-email.muted { font-style: italic; }

/* Modal de detalle */
.admin-lab-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(8, 14, 5, 0.58);
  backdrop-filter: blur(4px);
}
.admin-lab-modal {
  --al-surface: #ffffff;
  --al-surface-alt: #f6f8f2;
  --al-text: #1f2a14;
  --al-muted: #6b7a5c;
  --al-border: #e2e8da;
  width: min(820px, 100%);
  max-height: calc(100vh - 2.5rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--al-surface);
  color: var(--al-text);
  border: 1px solid var(--al-border);
  border-radius: 20px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
}
.admin-lab-modal.theme-dark {
  --al-surface: #0e1509;
  --al-surface-alt: #131a0e;
  --al-text: #e8ede3;
  --al-muted: #9fb08f;
  --al-border: rgba(122, 171, 61, 0.14);
}
.admin-lab-modal-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.15rem 1.35rem;
  border-bottom: 1px solid var(--al-border);
  background: var(--al-surface-alt);
}
.modal-avatar { width: 48px; height: 48px; border-radius: 14px; }
.admin-lab-modal-header h2 { margin: 0.15rem 0 0; font-size: 1.25rem; }
.modal-lab-id { color: var(--al-muted); font-size: 0.75rem; }
.modal-close {
  margin-left: auto;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--al-muted);
  cursor: pointer;
}
.modal-close:hover { background: var(--al-border); color: var(--al-text); }
.admin-lab-modal-body { overflow-y: auto; padding: 1.35rem; }
.modal-state { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; padding: 3rem 1.5rem; color: var(--al-muted); }
.modal-state p { margin: 0; }
.modal-state.error { color: #b02a37; }
.detail-section + .detail-section { margin-top: 1.35rem; padding-top: 1.35rem; border-top: 1px dashed var(--al-border); }
.detail-section-title { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.85rem; color: var(--al-green); }
.detail-section-title h3 { margin: 0; color: var(--al-text); font-size: 1rem; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; margin: 0; }
.detail-grid > div { min-width: 0; padding: 0.75rem 0.85rem; border-radius: 10px; background: var(--al-surface-alt); }
.detail-grid dt { color: var(--al-muted); font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.detail-grid dd { margin: 0.25rem 0 0; overflow-wrap: anywhere; font-size: 0.84rem; }
.detail-wide { grid-column: 1 / -1; }
.admin-lab-modal-enter-active,
.admin-lab-modal-leave-active { transition: opacity 0.18s ease; }
.admin-lab-modal-enter-from,
.admin-lab-modal-leave-to { opacity: 0; }

/* Estados */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3.5rem 1.5rem;
  text-align: center;
  color: var(--al-muted);
}

.state-box h5 { margin: 0.25rem 0 0; color: var(--al-text); font-size: 1.05rem; }
.state-box p { margin: 0 0 0.5rem; font-size: 0.9rem; }
.state-icon { font-size: 2.6rem; color: var(--al-green-light); opacity: 0.7; }
.state-icon.warn { color: #e0a82e; }

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--al-border);
  border-top-color: var(--al-green);
  border-radius: 50%;
  animation: al-spin 0.8s linear infinite;
}

.spinner.sm { width: 16px; height: 16px; border-width: 2px; }

@keyframes al-spin { to { transform: rotate(360deg); } }

/* Paginación */
.list-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--al-border);
  background: var(--al-surface-alt);
}

.pagination-wrapper { display: flex; flex-wrap: wrap; gap: 0.35rem; }

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 0.6rem;
  border: 1.5px solid var(--al-border);
  border-radius: 10px;
  background: var(--al-surface);
  color: var(--al-text);
  font: inherit;
  font-size: 0.84rem;
  cursor: pointer;
  transition: var(--al-transition);
}

.page-btn:hover:not(:disabled) { border-color: var(--al-green-light); }
.page-btn.active { background: var(--al-green); border-color: var(--al-green); color: #fff; }
.page-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.page-ellipsis { align-self: center; padding: 0 0.3rem; color: var(--al-muted); }
.page-info { font-size: 0.82rem; color: var(--al-muted); }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .lab-row { flex-wrap: wrap; padding: 1rem; }
  .lab-main { flex-basis: calc(100% - 70px); }
  .members-toggle { width: 100%; justify-content: center; }
  .members-panel { padding: 0 1rem 1.2rem; }
  .actions-group { margin-left: 0; width: 100%; }
  .actions-group .action-btn { flex: 1; justify-content: center; }
  .list-header, .control-body, .list-footer { padding-left: 1rem; padding-right: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  .spinner { animation-duration: 2s; }
  .chevron, .filter-chip, .members-toggle, .page-btn { transition: none; }
}
</style>
