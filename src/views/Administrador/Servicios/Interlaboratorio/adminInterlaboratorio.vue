<template>
  <div :data-bs-theme="currentTheme" class="admin-interlab-page">
    <!-- Header con breadcrumb -->
    <header class="admin-header">
      <div class="container">
        <nav class="breadcrumb-nav" aria-label="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-separator">
              <i class="bi bi-chevron-right"></i>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-clipboard-data"></i> Gestión Interlaboratorio
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <span class="section-eyebrow">Administración</span>
            <h1 class="page-title">Programas de Interlaboratorio</h1>
            <p class="page-subtitle">Gestiona los programas de comparación interlaboratorio, fechas y disponibilidad</p>
          </div>

          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-icon total">
                <i class="bi bi-grid-3x3-gap-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ totalInterlab }}</span>
                <span class="stat-label">Total Programas</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon abierto">
                <i class="bi bi-cart-check-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ interlabAbiertos }}</span>
                <span class="stat-label">Disponibles</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon cerrado">
                <i class="bi bi-lock-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ interlabCerrados }}</span>
                <span class="stat-label">Cerrados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Panel de control -->
    <section class="control-section">
      <div class="container">
        <div class="control-card">
          <div class="control-header">
            <h3 class="control-title">Filtros y Búsqueda</h3>
            <button class="btn-collapse" @click="showFilters = !showFilters">
              <i :class="showFilters ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
            </button>
          </div>

          <div class="control-body" v-show="showFilters">
            <div class="filters-grid">
              <!-- Búsqueda -->
              <div class="filter-group search-group">
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Buscar por referencia o descripción..."
                    @input="handleSearch"
                  />
                  <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''; handleSearch()">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por Estado -->
              <div class="filter-group">
                <div class="filter-chips">
                  <button
                    class="filter-chip"
                    :class="{ 'active': selectedStatus === 'abierto' }"
                    @click="toggleStatusFilter('abierto')"
                  >
                    <i class="bi bi-cart-check"></i>
                    <span>Abiertos</span>
                    <span class="chip-count">{{ interlabAbiertos }}</span>
                  </button>
                  <button
                    class="filter-chip"
                    :class="{ 'active': selectedStatus === 'cerrado' }"
                    @click="toggleStatusFilter('cerrado')"
                  >
                    <i class="bi bi-lock"></i>
                    <span>Cerrados</span>
                    <span class="chip-count">{{ interlabCerrados }}</span>
                  </button>
                </div>
              </div>

              <!-- Acciones -->
              <div class="filter-group actions-group">
                <button class="action-btn secondary" @click="clearFilters" :disabled="!hasActiveFilters">
                  <i class="bi bi-arrow-counterclockwise"></i>
                  <span>Limpiar</span>
                </button>
                <button class="action-btn secondary" @click="exportData">
                  <i class="bi bi-download"></i>
                  <span>Exportar</span>
                </button>
                <button class="action-btn primary" @click="openCreateModal">
                  <i class="bi bi-plus-lg"></i>
                  <span>Nuevo Programa</span>
                </button>
              </div>
            </div>

            <!-- Filtros activos -->
            <div class="active-filters" v-if="hasActiveFilters">
              <span class="active-filters-label">Filtros activos:</span>
              <span v-if="searchQuery" class="active-filter-tag">
                Búsqueda: "{{ searchQuery }}"
                <button @click="searchQuery = ''; handleSearch()"><i class="bi bi-x"></i></button>
              </span>
              <span v-if="selectedStatus" class="active-filter-tag">
                Estado: {{ selectedStatus === 'abierto' ? 'Abiertos' : 'Cerrados' }}
                <button @click="selectedStatus = null; handleSearch()"><i class="bi bi-x"></i></button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de programas -->
    <main class="table-section">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">Programas de Interlaboratorio</h4>
              <p class="table-subtitle">
                Mostrando {{ paginatedInterlab.length }} de {{ filteredInterlab.length }} programas
                <span v-if="filteredInterlab.length !== interlaboratorios.length">
                  (filtrado de {{ interlaboratorios.length }})
                </span>
              </p>
            </div>

            <div class="table-controls">
              <select v-model="itemsPerPage" class="per-page-select" @change="currentPage = 1">
                <option :value="10">10 por página</option>
                <option :value="25">25 por página</option>
                <option :value="50">50 por página</option>
                <option :value="100">100 por página</option>
              </select>
            </div>
          </div>

          <!-- Vista desktop: Tabla -->
          <div class="desktop-table">
            <div class="table-responsive">
              <table class="interlab-table">
                <thead>
                  <tr>
                    <th class="col-referencia">Referencia</th>
                    <th class="col-descripcion">Descripción</th>
                    <th class="col-anio">Año</th>
                    <th class="col-fechas">Periodo Inscripción</th>
                    <th class="col-inicio">Fecha Inicio</th>
                    <th class="col-estado">Estado</th>
                    <th class="col-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in paginatedInterlab" :key="item.id">
                    <td>
                      <code class="referencia-text">{{ item.referencia }}</code>
                    </td>
                    <td>
                      <div class="descripcion-cell">
                        <span class="descripcion-text">{{ item.descripcion }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="anio-badge">{{ item.anio }}</span>
                    </td>
                    <td>
                      <div class="fecha-cell">
                        <span class="fecha-label">Inicio:</span>
                        <span>{{ item.inscripcionInicio }}</span>
                        <span class="fecha-label">Fin:</span>
                        <span>{{ item.inscripcionFin }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="fecha-cell">
                        <span>{{ item.fechaInicioInterlaboratorio }}</span>
                        <span v-if="item.fechaDetalle" class="fecha-detalle">{{ item.fechaDetalle }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="status-toggle">
                        <button
                          class="toggle-btn"
                          :class="{ 'active': item.disponible }"
                          @click="toggleDisponible(item)"
                          :disabled="item.updating"
                          :title="item.disponible ? 'Cerrar programa' : 'Abrir programa'"
                        >
                          <span class="toggle-dot"></span>
                        </button>
                        <span class="status-text" :class="item.disponible ? 'abierto' : 'cerrado'">
                          {{ item.disponible ? 'Abierto' : 'Cerrado' }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="icon-btn" @click="openEditModal(item)" title="Editar programa">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="icon-btn danger" @click="confirmDelete(item)" title="Eliminar programa">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Estado vacío -->
                  <tr v-if="filteredInterlab.length === 0">
                    <td colspan="7" class="empty-row">
                      <div class="empty-content">
                        <i class="bi bi-clipboard-data empty-icon"></i>
                        <h5 v-if="interlaboratorios.length === 0">No hay programas registrados</h5>
                        <h5 v-else>No se encontraron programas</h5>
                        <p v-if="interlaboratorios.length === 0">Aún no existen programas de interlaboratorio.</p>
                        <p v-else>No hay programas que coincidan con los filtros aplicados.</p>
                        <button class="action-btn secondary" @click="clearFilters">
                          <i class="bi bi-arrow-counterclockwise"></i>
                          <span>Limpiar filtros</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Vista móvil: Cards -->
          <div class="mobile-cards">
            <div v-for="item in paginatedInterlab" :key="item.id" class="interlab-card">
              <div class="card-header">
                <div class="card-info" @click="openEditModal(item)">
                  <span class="referencia-badge">{{ item.referencia }}</span>
                  <h5>{{ item.descripcion }}</h5>
                  <span class="anio-badge">{{ item.anio }}</span>
                </div>
                <div class="card-actions">
                  <button class="icon-btn" @click="openEditModal(item)" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="icon-btn danger" @click="confirmDelete(item)" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <span class="info-label">Inscripción</span>
                  <span class="info-value">{{ item.inscripcionInicio }} - {{ item.inscripcionFin }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Inicio programa</span>
                  <span class="info-value">{{ item.fechaInicioInterlaboratorio }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Estado</span>
                  <div class="status-toggle">
                    <button
                      class="toggle-btn"
                      :class="{ 'active': item.disponible }"
                      @click="toggleDisponible(item)"
                      :disabled="item.updating"
                    >
                      <span class="toggle-dot"></span>
                    </button>
                    <span class="status-text" :class="item.disponible ? 'abierto' : 'cerrado'">
                      {{ item.disponible ? 'Abierto' : 'Cerrado' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío móvil -->
            <div v-if="filteredInterlab.length === 0" class="empty-card">
              <div class="empty-icon">
                <i class="bi bi-clipboard-data"></i>
              </div>
              <h5 v-if="interlaboratorios.length === 0">No hay programas registrados</h5>
              <h5 v-else>No se encontraron programas</h5>
              <p v-if="interlaboratorios.length === 0">Aún no existen programas de interlaboratorio.</p>
              <p v-else>No hay programas que coincidan con los filtros aplicados.</p>
              <button class="action-btn secondary" @click="clearFilters">
                <i class="bi bi-arrow-counterclockwise"></i>
                <span>Limpiar filtros</span>
              </button>
            </div>
          </div>

          <!-- Paginación -->
          <div class="table-footer" v-if="totalPages > 1">
            <div class="pagination-wrapper">
              <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1" title="Primera página">
                <i class="bi bi-chevron-double-left"></i>
              </button>
              <button class="page-btn" :disabled="currentPage === 1" @click="prevPage" title="Anterior">
                <i class="bi bi-chevron-left"></i>
              </button>

              <template v-for="pageNum in visiblePages" :key="pageNum">
                <button
                  v-if="pageNum !== '...'"
                  class="page-btn"
                  :class="{ 'active': pageNum === currentPage }"
                  @click="currentPage = pageNum as number"
                >
                  {{ pageNum }}
                </button>
                <span v-else class="page-ellipsis">...</span>
              </template>

              <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage" title="Siguiente">
                <i class="bi bi-chevron-right"></i>
              </button>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages" title="Última página">
                <i class="bi bi-chevron-double-right"></i>
              </button>
            </div>
            <div class="page-info">
              <span>Página {{ currentPage }} de {{ totalPages }}</span>
              <span class="page-info-separator">•</span>
              <span>{{ startItem }}-{{ endItem }} de {{ filteredInterlab.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <Teleport to="body">
      <div v-if="itemToDelete" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal-container">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
              Confirmar Eliminación
            </h5>
            <button class="modal-close-btn" @click="cancelDelete">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="warning-box">
              <i class="bi bi-exclamation-circle-fill"></i>
              <span>Esta acción no se puede deshacer. Todos los datos asociados serán eliminados permanentemente.</span>
            </div>
            <div class="delete-preview">
              <div class="preview-info">
                <h6>{{ itemToDelete.descripcion }}</h6>
                <p>Referencia: {{ itemToDelete.referencia }} | Año: {{ itemToDelete.anio }}</p>
              </div>
            </div>
            <p class="delete-message">
              ¿Estás seguro de que deseas eliminar permanentemente el programa <strong>{{ itemToDelete.referencia }}</strong>?
            </p>
            <div class="delete-confirm-input" v-if="deleteConfirmationRequired">
              <label class="form-label">Escribe "ELIMINAR" para confirmar:</label>
              <input
                v-model="deleteConfirmText"
                type="text"
                class="form-input"
                placeholder="ELIMINAR"
                @input="deleteConfirmText = deleteConfirmText.toUpperCase()"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="cancelDelete">
              Cancelar
            </button>
            <button
              class="modal-btn danger"
              @click="deleteItem"
              :disabled="deleteConfirmationRequired && deleteConfirmText !== 'ELIMINAR'"
            >
              <i class="bi bi-trash"></i>
              Eliminar Programa
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Crear/Editar -->
    <Teleport to="body">
      <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click.self="closeModals">
        <div class="modal-container form-modal">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="showCreateModal ? 'bi bi-plus-circle-fill' : 'bi bi-pencil-square'"></i>
              {{ showCreateModal ? 'Crear Nuevo Programa' : 'Editar Programa' }}
            </h5>
            <button class="modal-close-btn" @click="closeModals">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Referencia *</label>
                <input
                  v-model="createEditForm.referencia"
                  type="text"
                  class="form-input"
                  placeholder="Ej: INTERLAB-2026-01"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Año *</label>
                <input
                  v-model.number="createEditForm.anio"
                  type="number"
                  class="form-input"
                  placeholder="Ej: 2026"
                  required
                />
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Descripción *</label>
                <textarea
                  v-model="createEditForm.descripcion"
                  class="form-input"
                  rows="3"
                  placeholder="Describe el programa de interlaboratorio..."
                  required
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Inicio de Inscripción *</label>
                <input
                  v-model="createEditForm.inscripcionInicio"
                  type="date"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Fin de Inscripción *</label>
                <input
                  v-model="createEditForm.inscripcionFin"
                  type="date"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Fecha de Inicio del Programa *</label>
                <input
                  v-model="createEditForm.fechaInicioInterlaboratorio"
                  type="date"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Detalle de Duración</label>
                <input
                  v-model="createEditForm.fechaDetalle"
                  type="text"
                  class="form-input"
                  placeholder="Ej: Duración: 30 días"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select v-model="createEditForm.disponible" class="form-select">
                  <option :value="true">Abierto (Disponible)</option>
                  <option :value="false">Cerrado (No disponible)</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="closeModals">
              Cancelar
            </button>
            <button
              class="modal-btn primary"
              @click="submitForm"
              :disabled="!isFormValid"
            >
              <i class="bi bi-check-lg"></i>
              {{ showCreateModal ? 'Crear Programa' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast de notificaciones -->
    <Teleport to="body">
      <div v-if="toastVisible" class="toast-notification" :class="toastType">
        <i :class="toastIcon"></i>
        <div class="toast-content">
          <strong>{{ toastTitle }}</strong>
          <span>{{ toastMessage }}</span>
        </div>
        <button class="toast-close" @click="toastVisible = false">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'


interface Interlaboratorio {
  id: number | string
  referencia: string
  descripcion: string
  anio: number
  inscripcionInicio: string
  inscripcionFin: string
  fechaInicioInterlaboratorio: string
  fechaDetalle: string
  disponible: boolean
  updating?: boolean
  backendId?: number | string
}

const { currentTheme } = useTheme()
const API_BASE = (import.meta.env?.VITE_API_BASE as string) || 'http://localhost:3000'

// Estado de filtros
const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)
const showFilters = ref(true)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Estado para eliminar
const itemToDelete = ref<Interlaboratorio | null>(null)
const deleteConfirmationRequired = ref(true)
const deleteConfirmText = ref('')

// Modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingId = ref<string | number | null>(null)

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType = ref('info')
let toastTimer: ReturnType<typeof setTimeout> | null = null

// Formulario
const createEditForm = ref({
  referencia: '',
  descripcion: '',
  anio: new Date().getFullYear(),
  inscripcionInicio: '',
  inscripcionFin: '',
  fechaInicioInterlaboratorio: '',
  fechaDetalle: '',
  disponible: true
})

// Datos
const interlaboratorios = ref<Interlaboratorio[]>([])

// Computed
const totalInterlab = computed(() => interlaboratorios.value.length)
const interlabAbiertos = computed(() => interlaboratorios.value.filter(i => i.disponible).length)
const interlabCerrados = computed(() => interlaboratorios.value.filter(i => !i.disponible).length)

const hasActiveFilters = computed(() => !!(searchQuery.value || selectedStatus.value))

const filteredInterlab = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return interlaboratorios.value.filter(item => {
    const matchesSearch = !query ||
      item.referencia.toLowerCase().includes(query) ||
      item.descripcion.toLowerCase().includes(query)
    const matchesStatus = !selectedStatus.value ||
      (selectedStatus.value === 'abierto' && item.disponible) ||
      (selectedStatus.value === 'cerrado' && !item.disponible)
    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredInterlab.value.length / itemsPerPage.value)))

const paginatedInterlab = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredInterlab.value.slice(start, start + itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 7
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    pages.push(1)
    let start = Math.max(2, currentPage.value - 2)
    let end = Math.min(totalPages.value - 1, currentPage.value + 2)
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages.value - 1) pages.push('...')
    pages.push(totalPages.value)
  }
  return pages
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredInterlab.value.length))

const isFormValid = computed(() => {
  const f = createEditForm.value
  return f.referencia.trim() && f.descripcion.trim() && f.anio && f.inscripcionInicio && f.inscripcionFin && f.fechaInicioInterlaboratorio
})

// Métodos de filtros
const toggleStatusFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = null
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

// Paginación
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// CRUD
const fetchInterlaboratorios = async () => {
  try {
    const token = getAuthToken()
    const headers: any = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const resp = await fetch(`${API_BASE}/api/interlaboratorio?limit=1000&page=1`, { headers })
    if (!resp.ok) return
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : (body.data || [])
    interlaboratorios.value = rows.map((r: any) => ({
      id: r.id_interlaboratorio || r.id,
      referencia: r.referencia || '',
      descripcion: r.descripcion || '',
      anio: r.anio || new Date().getFullYear(),
      inscripcionInicio: r.inscripcion_inicio || r.inscripcionInicio || '',
      inscripcionFin: r.inscripcion_fin || r.inscripcionFin || '',
      fechaInicioInterlaboratorio: r.fecha_inicio_interlaboratorio || r.fechaInicioInterlaboratorio || '',
      fechaDetalle: r.fecha_detalle || r.fechaDetalle || '',
      disponible: r.disponible !== undefined ? !!r.disponible : true,
      backendId: r.id_interlaboratorio || r.id
    }))
  } catch (err) {
    console.error('Error fetching interlaboratorio:', err)
  }
}

const toggleDisponible = async (item: Interlaboratorio) => {
  item.updating = true
  const prevState = item.disponible
  try {
    const token = getAuthToken()
    const idToUse = item.backendId || item.id
    if (token) {
      const resp = await fetch(`${API_BASE}/api/interlaboratorio/${idToUse}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ disponible: !item.disponible })
      })
      if (resp.ok) {
        const body = await resp.json().catch(() => ({}))
        const updated = body.data || body
        if (updated && typeof updated.disponible !== 'undefined') item.disponible = !!updated.disponible
        else item.disponible = !item.disponible
      } else {
        throw new Error('API error')
      }
    } else {
      item.disponible = !item.disponible
    }
    showToast(`Programa ${item.disponible ? 'abierto' : 'cerrado'} correctamente`, 'success', 'Actualizado')
  } catch (err) {
    item.disponible = prevState
    showToast('Error al actualizar el estado', 'error', 'Error')
  } finally {
    item.updating = false
  }
}

const confirmDelete = (item: Interlaboratorio) => {
  itemToDelete.value = { ...item }
  deleteConfirmText.value = ''
}

const cancelDelete = () => {
  itemToDelete.value = null
  deleteConfirmText.value = ''
}

const deleteItem = async () => {
  if (!itemToDelete.value) return
  if (deleteConfirmationRequired.value && deleteConfirmText.value !== 'ELIMINAR') return

  try {
    const token = getAuthToken()
    const idToUse = itemToDelete.value.backendId || itemToDelete.value.id
    if (token) {
      const resp = await fetch(`${API_BASE}/api/interlaboratorio/${idToUse}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!resp.ok) throw new Error('API error')
    }
    interlaboratorios.value = interlaboratorios.value.filter(i => (i.backendId || i.id) !== idToUse)
    showToast(`Programa "${itemToDelete.value.referencia}" eliminado`, 'success', 'Eliminado')
  } catch (err) {
    showToast('Error al eliminar el programa', 'error', 'Error')
  } finally {
    itemToDelete.value = null
    deleteConfirmText.value = ''
  }
}

const openCreateModal = () => {
  createEditForm.value = {
    referencia: '',
    descripcion: '',
    anio: new Date().getFullYear(),
    inscripcionInicio: '',
    inscripcionFin: '',
    fechaInicioInterlaboratorio: '',
    fechaDetalle: '',
    disponible: true
  }
  showCreateModal.value = true
  showEditModal.value = false
  editingId.value = null
}

const openEditModal = (item: Interlaboratorio) => {
  createEditForm.value = {
    referencia: item.referencia,
    descripcion: item.descripcion,
    anio: item.anio,
    inscripcionInicio: item.inscripcionInicio,
    inscripcionFin: item.inscripcionFin,
    fechaInicioInterlaboratorio: item.fechaInicioInterlaboratorio,
    fechaDetalle: item.fechaDetalle || '',
    disponible: item.disponible
  }
  editingId.value = item.backendId || item.id
  showEditModal.value = true
  showCreateModal.value = false
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingId.value = null
}

const submitForm = async () => {
  if (!isFormValid.value) return

  const payload = {
    referencia: createEditForm.value.referencia.trim(),
    descripcion: createEditForm.value.descripcion.trim(),
    anio: createEditForm.value.anio,
    inscripcion_inicio: createEditForm.value.inscripcionInicio,
    inscripcion_fin: createEditForm.value.inscripcionFin,
    fecha_inicio_interlaboratorio: createEditForm.value.fechaInicioInterlaboratorio,
    fecha_detalle: createEditForm.value.fechaDetalle || null,
    disponible: createEditForm.value.disponible
  }

  try {
    const token = getAuthToken()
    if (showCreateModal.value) {
      if (token) {
        const resp = await fetch(`${API_BASE}/api/interlaboratorio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}))
          throw new Error(body.message || 'Error del servidor')
        }
        await fetchInterlaboratorios()
      } else {
        interlaboratorios.value.push({ id: Date.now(), ...payload, inscripcionInicio: payload.inscripcion_inicio, inscripcionFin: payload.inscripcion_fin, fechaInicioInterlaboratorio: payload.fecha_inicio_interlaboratorio, fechaDetalle: payload.fecha_detalle || '', updating: false })
      }
      showToast('Programa creado correctamente', 'success', 'Creado')
    } else if (showEditModal.value && editingId.value) {
      if (token) {
        const resp = await fetch(`${API_BASE}/api/interlaboratorio/${editingId.value}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}))
          throw new Error(body.message || 'Error del servidor')
        }
        await fetchInterlaboratorios()
      } else {
        const idx = interlaboratorios.value.findIndex(i => (i.backendId || i.id) === editingId.value)
        if (idx !== -1) {
          interlaboratorios.value[idx] = { ...interlaboratorios.value[idx], ...payload, inscripcionInicio: payload.inscripcion_inicio, inscripcionFin: payload.inscripcion_fin, fechaInicioInterlaboratorio: payload.fecha_inicio_interlaboratorio, fechaDetalle: payload.fecha_detalle || '' }
        }
      }
      showToast('Programa actualizado correctamente', 'success', 'Actualizado')
    }
    closeModals()
  } catch (err: any) {
    showToast(err.message || 'Error al procesar la solicitud', 'error', 'Error')
  }
}

const exportData = () => {
  const headers = ['Referencia', 'Descripción', 'Año', 'Inicio Inscripción', 'Fin Inscripción', 'Fecha Inicio', 'Detalle', 'Estado']
  const data = interlaboratorios.value.map(i => [
    i.referencia, i.descripcion, i.anio, i.inscripcionInicio, i.inscripcionFin, i.fechaInicioInterlaboratorio, i.fechaDetalle || '', i.disponible ? 'Abierto' : 'Cerrado'
  ])
  const csvContent = [headers.join(','), ...data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `interlaboratorio-sena-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast('Archivo CSV exportado correctamente', 'success', 'Exportado')
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

const showToast = (message: string, type: string = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title
  toastType.value = type
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 4000)
}

const toastIcon = computed(() => {
  const icons: Record<string, string> = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-x-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return icons[toastType.value] || icons.info
})

onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  await fetchInterlaboratorios()
})

import { watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
watch(currentTheme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-bs-theme', newTheme)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

/* Tokens */
:root {
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
}

.admin-interlab-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}
[data-bs-theme="dark"] .admin-interlab-page {
  background: #0c0f0a;
  color: #e8ede3;
}

/* Header */
.admin-header {
  background: #ffffff;
  border-bottom: 1px solid var(--sena-border);
  padding: 2rem 0 1.5rem;
}
[data-bs-theme="dark"] .admin-header {
  background: #0e1509;
  border-bottom-color: rgba(122,171,61,0.12);
}
.breadcrumb-nav { margin-bottom: 1.5rem; }
.breadcrumb-list { display: flex; align-items: center; gap: 0.5rem; padding: 0; margin: 0; list-style: none; font-size: 0.82rem; }
.breadcrumb-item { display: flex; align-items: center; gap: 0.35rem; color: var(--sena-muted); }
.breadcrumb-item.active { color: var(--sena-green); font-weight: 600; }
.breadcrumb-link { color: var(--sena-muted); text-decoration: none; transition: var(--transition); display: flex; align-items: center; gap: 0.35rem; }
.breadcrumb-link:hover { color: var(--sena-green); }
.breadcrumb-separator { color: #c0c8b8; font-size: 0.65rem; }
.header-content { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; flex-wrap: wrap; }
.section-eyebrow { display: inline-block; font-size: 0.65rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--sena-green-light); background: var(--sena-green-pale); padding: 0.25rem 0.75rem; border-radius: 20px; margin-bottom: 0.5rem; }
.page-title { font-family: var(--font-display); font-size: 2.2rem; font-weight: 700; color: var(--sena-text); margin: 0.25rem 0 0.35rem; }
[data-bs-theme="dark"] .page-title { color: #f0f5ea; }
.page-subtitle { color: var(--sena-muted); font-size: 0.9rem; margin: 0; }
.header-stats { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.stat-card { display: flex; align-items: center; gap: 0.85rem; padding: 1rem 1.25rem; background: #fcfdfb; border: 1px solid var(--sena-border); border-radius: var(--radius-lg); min-width: 160px; transition: var(--transition); box-shadow: var(--shadow-sm); }
[data-bs-theme="dark"] .stat-card { background: #131a0e; border-color: rgba(122,171,61,0.12); }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.stat-icon { width: 42px; height: 42px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; color: #ffffff; }
.stat-icon.total { background: linear-gradient(135deg, #6b7b5a, #5d8a2f); }
.stat-icon.abierto { background: linear-gradient(135deg, #5d8a2f, #7aab3d); }
.stat-icon.cerrado { background: linear-gradient(135deg, #8a7a6a, #b0a090); }
.stat-number { font-size: 1.4rem; font-weight: 700; color: var(--sena-text); line-height: 1; }
[data-bs-theme="dark"] .stat-number { color: #e0ecd6; }
.stat-label { font-size: 0.78rem; color: var(--sena-muted); margin-top: 0.2rem; }

/* Control */
.control-section { padding: 1.5rem 0 0.5rem; }
.control-card { background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--sena-border); box-shadow: var(--shadow-sm); overflow: hidden; }
[data-bs-theme="dark"] .control-card { background: #0e1509; border-color: rgba(122,171,61,0.12); }
.control-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--sena-border); display: flex; justify-content: space-between; align-items: center; }
.control-title { font-size: 0.95rem; font-weight: 600; color: var(--sena-text); margin: 0; }
.btn-collapse { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1.5px solid #e0e5da; background: #fcfdfb; color: var(--sena-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
.btn-collapse:hover { background: var(--sena-green-pale); color: var(--sena-green); }
.control-body { padding: 1.25rem 1.5rem; }
.filters-grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
.filter-group { display: flex; align-items: center; }
.search-group { flex: 1; min-width: 220px; }
.search-box { position: relative; width: 100%; }
.search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: var(--sena-muted); font-size: 0.9rem; }
.search-input { width: 100%; padding: 0.65rem 0.85rem 0.65rem 2.5rem; border: 1.5px solid #e0e5da; border-radius: var(--radius-md); background: #fcfdfb; color: var(--sena-text); font-size: 0.88rem; font-family: var(--font-body); transition: var(--transition); }
[data-bs-theme="dark"] .search-input { background: #131a0e; border-color: rgba(122,171,61,0.16); color: #e0ecd6; }
.search-input:focus { outline: none; border-color: var(--sena-green); box-shadow: 0 0 0 3px rgba(93,138,47,0.1); }
.clear-btn { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--sena-muted); cursor: pointer; padding: 0.25rem; border-radius: 50%; transition: var(--transition); }
.clear-btn:hover { color: var(--sena-text); background: var(--sena-green-pale); }
.filter-chips { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.filter-chip { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.85rem; border: 1.5px solid #e0e5da; border-radius: 50px; background: #fcfdfb; color: var(--sena-muted); font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: var(--transition); font-family: var(--font-body); }
[data-bs-theme="dark"] .filter-chip { background: #131a0e; border-color: rgba(122,171,61,0.16); color: #8a9e7c; }
.filter-chip:hover { border-color: var(--sena-green-light); color: var(--sena-text); }
.filter-chip.active { background: var(--sena-green-pale); border-color: var(--sena-green); color: var(--sena-green); font-weight: 600; }
[data-bs-theme="dark"] .filter-chip.active { background: rgba(93,138,47,0.2); border-color: var(--sena-green-light); color: var(--sena-green-light); }
.chip-count { background: rgba(93,138,47,0.1); padding: 0.1rem 0.45rem; border-radius: 10px; font-size: 0.7rem; font-weight: 700; }
.actions-group { display: flex; gap: 0.5rem; margin-left: auto; }
.action-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem; border-radius: 50px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: var(--transition); border: 1.5px solid transparent; font-family: var(--font-body); white-space: nowrap; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn.primary { background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light)); color: #ffffff; box-shadow: 0 4px 12px rgba(93,138,47,0.25); }
.action-btn.primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(93,138,47,0.35); }
.action-btn.secondary { background: #fcfdfb; border-color: #e0e5da; color: var(--sena-text); }
[data-bs-theme="dark"] .action-btn.secondary { background: #131a0e; border-color: rgba(122,171,61,0.16); color: #c8d8be; }
.action-btn.secondary:hover:not(:disabled) { background: var(--sena-green-pale); border-color: var(--sena-green); }
.active-filters { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--sena-border); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.active-filters-label { font-size: 0.78rem; color: var(--sena-muted); font-weight: 500; }
.active-filter-tag { display: flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; background: var(--sena-green-pale); border: 1px solid var(--sena-border); border-radius: 50px; font-size: 0.75rem; color: var(--sena-green); }
.active-filter-tag button { background: none; border: none; color: var(--sena-muted); cursor: pointer; padding: 0; font-size: 0.7rem; display: flex; align-items: center; }
.active-filter-tag button:hover { color: var(--sena-text); }

/* Table */
.table-section { padding: 1rem 0 3rem; }
.table-card { background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--sena-border); box-shadow: var(--shadow-sm); overflow: hidden; }
[data-bs-theme="dark"] .table-card { background: #0e1509; border-color: rgba(122,171,61,0.12); }
.table-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--sena-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.table-title { font-size: 1rem; font-weight: 600; color: var(--sena-text); margin: 0 0 0.2rem; }
[data-bs-theme="dark"] .table-title { color: #e0ecd6; }
.table-subtitle { font-size: 0.78rem; color: var(--sena-muted); margin: 0; }
.table-controls { display: flex; align-items: center; gap: 1rem; }
.per-page-select { padding: 0.45rem 0.75rem; border: 1.5px solid #e0e5da; border-radius: var(--radius-sm); background: #fcfdfb; color: var(--sena-text); font-size: 0.8rem; font-family: var(--font-body); cursor: pointer; }
[data-bs-theme="dark"] .per-page-select { background: #131a0e; border-color: rgba(122,171,61,0.16); color: #e0ecd6; }
.table-responsive { overflow-x: auto; }
.interlab-table { width: 100%; border-collapse: collapse; min-width: 900px; }
.interlab-table thead th { padding: 0.85rem 1rem; text-align: left; font-weight: 600; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--sena-muted); background: #f8faf7; border-bottom: 1.5px solid var(--sena-border); white-space: nowrap; }
[data-bs-theme="dark"] .interlab-table thead th { background: #0a0d06; color: #8a9e7c; }
.interlab-table tbody td { padding: 0.85rem 1rem; border-bottom: 1px solid rgba(93,138,47,0.06); vertical-align: middle; }
[data-bs-theme="dark"] .interlab-table tbody td { border-bottom-color: rgba(122,171,61,0.06); }
.interlab-table tbody tr { transition: var(--transition); }
.interlab-table tbody tr:hover { background: #f8faf7; }
[data-bs-theme="dark"] .interlab-table tbody tr:hover { background: rgba(122,171,61,0.04); }

.referencia-text { font-family: 'Courier New', monospace; font-size: 0.8rem; background: #f0f4ea; padding: 0.15rem 0.5rem; border-radius: 4px; color: #3a5a2a; font-weight: 600; }
[data-bs-theme="dark"] .referencia-text { background: rgba(122,171,61,0.1); color: #9ac07a; }
.anio-badge { display: inline-block; padding: 0.2rem 0.7rem; background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light)); color: #ffffff; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.descripcion-cell { max-width: 250px; }
.descripcion-text { font-weight: 500; color: var(--sena-text); }
.fecha-cell { display: flex; flex-direction: column; gap: 0.15rem; font-size: 0.8rem; }
.fecha-label { font-size: 0.65rem; font-weight: 600; color: var(--sena-muted); text-transform: uppercase; }
.fecha-detalle { font-size: 0.7rem; color: var(--sena-muted); }
.status-toggle { display: flex; align-items: center; gap: 0.6rem; }
.toggle-btn { width: 44px; height: 24px; border-radius: 12px; background: #d0d8c8; border: none; cursor: pointer; position: relative; transition: var(--transition); padding: 0; flex-shrink: 0; }
.toggle-btn.active { background: #5d8a2f; }
.toggle-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.toggle-dot { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; transition: var(--transition); box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
.toggle-btn.active .toggle-dot { left: 22px; }
.status-text { font-size: 0.8rem; font-weight: 500; }
.status-text.abierto { color: #5d8a2f; }
.status-text.cerrado { color: #a0a898; }
.action-buttons { display: flex; gap: 0.35rem; justify-content: flex-end; }
.icon-btn { width: 34px; height: 34px; border-radius: var(--radius-sm); border: 1.5px solid #e0e5da; background: #fcfdfb; color: var(--sena-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.85rem; }
[data-bs-theme="dark"] .icon-btn { background: #131a0e; border-color: rgba(122,171,61,0.16); color: #8a9e7c; }
.icon-btn:hover { background: var(--sena-green-pale); border-color: var(--sena-green); color: var(--sena-green); }
.icon-btn.danger:hover { background: #fff0f0; border-color: #dc3545; color: #dc3545; }
.empty-row { padding: 3rem 1.5rem; text-align: center; }
.empty-content { padding: 1rem; }
.empty-icon { font-size: 3rem; color: #c0c8b8; margin-bottom: 1rem; }

/* Mobile cards */
.mobile-cards { display: none; }
@media (max-width: 768px) {
  .desktop-table { display: none; }
  .mobile-cards { display: block; }
  .interlab-card { background: #fcfdfb; border: 1px solid var(--sena-border); border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 0.75rem; }
  .card-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
  .card-info { flex: 1; cursor: pointer; }
  .card-info h5 { margin: 0.2rem 0; font-size: 0.9rem; color: var(--sena-text); }
  .card-actions { display: flex; gap: 0.3rem; }
  .card-body { display: flex; flex-direction: column; gap: 0.6rem; }
  .info-row { display: flex; justify-content: space-between; align-items: center; }
  .info-label { font-size: 0.75rem; color: var(--sena-muted); font-weight: 500; }
  .info-value { font-size: 0.82rem; color: var(--sena-text); }
  .empty-card { text-align: center; padding: 2rem; background: #fcfdfb; border: 1px solid var(--sena-border); border-radius: var(--radius-lg); }
}

/* Footer */
.table-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--sena-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.pagination-wrapper { display: flex; gap: 0.3rem; align-items: center; }
.page-btn { width: 36px; height: 36px; border-radius: var(--radius-sm); border: 1.5px solid #e0e5da; background: #fcfdfb; color: var(--sena-text); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.8rem; font-weight: 500; }
.page-btn:hover:not(:disabled) { background: var(--sena-green-pale); border-color: var(--sena-green); }
.page-btn.active { background: var(--sena-green); border-color: var(--sena-green); color: #ffffff; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-ellipsis { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--sena-muted); }
.page-info { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--sena-muted); }

/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; }
.modal-container { background: #ffffff; border-radius: var(--radius-xl); width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); }
.form-modal { max-width: 640px; }
[data-bs-theme="dark"] .modal-container { background: #1a2412; border: 1px solid rgba(122,171,61,0.12); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--sena-border); position: sticky; top: 0; background: inherit; z-index: 1; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
.modal-title { font-size: 1.05rem; font-weight: 600; color: var(--sena-text); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.modal-close-btn { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid #e0e5da; background: #fcfdfb; color: var(--sena-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
.modal-close-btn:hover { background: var(--sena-green-pale); color: var(--sena-text); }
.modal-body { padding: 1.25rem 1.5rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid var(--sena-border); position: sticky; bottom: 0; background: inherit; border-radius: 0 0 var(--radius-xl) var(--radius-xl); }
.warning-icon { color: #e6a817; }
.warning-box { display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.75rem 1rem; background: #fff8e6; border: 1px solid #f0d060; border-radius: var(--radius-md); color: #8a6d10; font-size: 0.85rem; margin-bottom: 1rem; }
.delete-preview { padding: 1rem; background: #f8faf7; border-radius: var(--radius-md); margin-bottom: 1rem; }
.preview-info h6 { margin: 0 0 0.2rem; color: var(--sena-text); }
.preview-info p { margin: 0; font-size: 0.82rem; color: var(--sena-muted); }
.delete-message { color: var(--sena-muted); font-size: 0.9rem; margin-bottom: 1rem; }
.delete-confirm-input { margin-top: 1rem; }
.modal-btn { padding: 0.6rem 1.25rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: var(--transition); border: 1.5px solid transparent; font-family: var(--font-body); display: flex; align-items: center; gap: 0.4rem; }
.modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.modal-btn.primary { background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light)); color: #ffffff; }
.modal-btn.primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(93,138,47,0.3); }
.modal-btn.secondary { background: #fcfdfb; border-color: #e0e5da; color: var(--sena-text); }
.modal-btn.danger { background: #dc3545; color: #ffffff; }
.modal-btn.danger:hover:not(:disabled) { background: #c82333; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-group:last-child:nth-child(odd) { grid-column: span 2; }
.form-label { font-size: 0.8rem; font-weight: 600; color: var(--sena-text); }
.form-input, .form-select { padding: 0.6rem 0.85rem; border: 1.5px solid #e0e5da; border-radius: var(--radius-sm); background: #fcfdfb; color: var(--sena-text); font-size: 0.88rem; font-family: var(--font-body); transition: var(--transition); }
[data-bs-theme="dark"] .form-input, [data-bs-theme="dark"] .form-select { background: #131a0e; border-color: rgba(122,171,61,0.16); color: #e0ecd6; }
.form-input:focus, .form-select:focus { outline: none; border-color: var(--sena-green); box-shadow: 0 0 0 3px rgba(93,138,47,0.1); }

/* Toast */
.toast-notification { position: fixed; top: 1.5rem; right: 1.5rem; display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem 1.25rem; background: #ffffff; border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 10000; max-width: 400px; animation: slideInRight 0.3s ease; border-left: 4px solid #5d8a2f; }
.toast-notification.success { border-left-color: #5d8a2f; }
.toast-notification.error { border-left-color: #dc3545; }
.toast-notification > i { font-size: 1.2rem; flex-shrink: 0; }
.toast-notification.success > i { color: #5d8a2f; }
.toast-notification.error > i { color: #dc3545; }
.toast-content { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
.toast-content strong { font-size: 0.85rem; color: var(--sena-text); }
.toast-content span { font-size: 0.8rem; color: var(--sena-muted); }
.toast-close { background: none; border: none; color: var(--sena-muted); cursor: pointer; padding: 0.25rem; border-radius: 50%; }
.toast-close:hover { color: var(--sena-text); background: var(--sena-green-pale); }
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 992px) { .filters-grid { flex-direction: column; align-items: stretch; } .actions-group { margin-left: 0; justify-content: flex-end; } }
@media (max-width: 480px) { .page-title { font-size: 1.6rem; } .form-grid { grid-template-columns: 1fr; } .form-group:last-child:nth-child(odd) { grid-column: span 1; } }
</style>
