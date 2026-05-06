<template>
  <div :data-bs-theme="currentTheme" class="admin-cotizaciones-page">
    <!-- Header con breadcrumb -->
    <header class="admin-header">
      <div class="container">
        <nav class="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-file-earmark-text"></i> Gestión de Cotizaciones
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-file-earmark-text-fill me-2"></i>Administración de Cotizaciones
            </h1>
            <p class="page-subtitle">
              Gestiona, genera y realiza seguimiento de cotizaciones para tus clientes
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-file-earmark-text"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalCotizaciones }}</span>
                  <span class="stat-label">Cotizaciones</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ aprobadas }}</span>
                  <span class="stat-label">Aprobadas</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon admin">
                  <i class="bi bi-clock"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ pendientes }}</span>
                  <span class="stat-label">Pendientes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Panel de control -->
    <section class="control-panel">
      <div class="container">
        <div class="panel-card">
          <div class="panel-header">
            <h3 class="panel-title">
              <i class="bi bi-funnel me-2"></i>Filtros y Búsqueda
            </h3>
          </div>

          <div class="panel-body">
            <div class="filters-grid">
              <!-- Búsqueda -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-search me-1"></i>Buscar cotización
                </label>
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Buscar por cliente, número o descripción..."
                    @input="handleSearch"
                  >
                  <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por estado -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-toggle-on me-1"></i>Filtrar por estado
                </label>
                <div class="status-filters">
                  <button
                    v-for="estado in estados"
                    :key="estado.value"
                    class="status-filter-btn"
                    :class="{ 'active': selectedEstado === estado.value }"
                    @click="toggleEstadoFilter(estado.value)"
                  >
                    <i :class="estado.icon"></i>
                    {{ estado.label }}
                  </button>
                </div>
              </div>

              <!-- Filtro por fechas -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-calendar me-1"></i>Rango de fechas
                </label>
                <div class="date-filters">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-calendar"></i>
                    </span>
                    <input
                      v-model="fechaDesde"
                      type="date"
                      class="form-control"
                      placeholder="Desde"
                    >
                    <span class="input-group-text">a</span>
                    <input
                      v-model="fechaHasta"
                      type="date"
                      class="form-control"
                      placeholder="Hasta"
                    >
                  </div>
                </div>
              </div>

              <!-- Acciones -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-lightning me-1"></i>Acciones rápidas
                </label>
                <div class="action-buttons">
                  <button class="btn btn-outline-secondary" @click="clearFilters">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                  </button>
                  <button class="btn btn-primary" @click="exportData">
                    <i class="bi bi-download me-1"></i>Exportar
                  </button>
                  <button class="btn btn-success" @click="openCreateModal">
                    <i class="bi bi-plus-lg me-1"></i>Nueva cotización
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de cotizaciones -->
    <main class="main-content">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">
                <i class="bi bi-table me-2"></i>Cotizaciones del sistema
              </h4>
              <p class="table-subtitle">
                Mostrando {{ filteredCotizaciones.length }} de {{ cotizaciones.length }} cotizaciones
              </p>
            </div>

            <div class="table-actions">
              <div class="pagination-info">
                <span class="text-muted">Cotizaciones por página:</span>
                <select v-model="itemsPerPage" class="form-select form-select-sm ms-2" style="width: auto;">
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>

              <div class="view-options">
                <button class="btn btn-sm btn-outline-secondary" title="Vista compacta">
                  <i class="bi bi-list"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" title="Vista detallada">
                  <i class="bi bi-grid-3x3-gap"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="cotizaciones-table">
              <thead>
                <tr>
                  <th class="numero-column"># Cotización</th>
                  <th class="cliente-column">Cliente</th>
                  <th class="fecha-column">Fecha</th>
                  <th class="monto-column">Total</th>
                  <th class="estado-column">Estado</th>
                  <th class="vencimiento-column">Vencimiento</th>
                  <th class="actions-column">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cotizacion in paginatedCotizaciones" :key="cotizacion.id">
                  <!-- Número de cotización -->
                  <td class="numero-cell">
                    <div class="numero-info">
                      <div class="cotizacion-numero">
                        <strong>COT-{{ formatNumero(cotizacion.id) }}</strong>
                      </div>
                      <div v-if="cotizacion.descripcion" class="cotizacion-desc">
                        <small class="text-muted">{{ cotizacion.descripcion }}</small>
                      </div>
                    </div>
                  </td>

                  <!-- Cliente -->
                  <td class="cliente-cell">
                    <div class="cliente-info">
                      <div class="cliente-nombre">{{ cotizacion.cliente.nombre }}</div>
                      <div class="cliente-meta">
                        <span class="meta-item">
                          <i class="bi bi-envelope me-1"></i>{{ cotizacion.cliente.email }}
                        </span>
                        <span v-if="cotizacion.cliente.empresa" class="meta-item">
                          <i class="bi bi-building me-1"></i>{{ cotizacion.cliente.empresa }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Fecha -->
                  <td class="fecha-cell">
                    <div class="fecha-info">
                      <i class="bi bi-calendar me-1"></i>
                      <span>{{ formatDate(cotizacion.fecha) }}</span>
                    </div>
                    <div v-if="cotizacion.creadoPor" class="creado-por">
                      <small class="text-muted">Por: {{ cotizacion.creadoPor }}</small>
                    </div>
                  </td>

                  <!-- Monto -->
                  <td class="monto-cell">
                    <div class="monto-total">
                      <strong>${{ formatCurrency(cotizacion.total) }}</strong>
                    </div>
                    <div class="monto-detalle">
                      <small class="text-muted">
                        Subtotal: ${{ formatCurrency(cotizacion.subtotal) }}
                      </small>
                    </div>
                  </td>

                  <!-- Estado -->
                  <td class="estado-cell">
                    <span class="estado-badge" :class="getEstadoClass(cotizacion.estado)">
                      <i :class="getEstadoIcon(cotizacion.estado)"></i>
                      {{ getEstadoText(cotizacion.estado) }}
                    </span>
                    <div v-if="cotizacion.notas" class="estado-notas">
                      <small class="text-muted">{{ cotizacion.notas }}</small>
                    </div>
                  </td>

                  <!-- Vencimiento -->
                  <td class="vencimiento-cell">
                    <div class="vencimiento-info">
                      <i class="bi bi-calendar-check me-1"></i>
                      <span :class="{ 'text-danger': isVencida(cotizacion.vencimiento) }">
                        {{ formatDate(cotizacion.vencimiento) }}
                      </span>
                    </div>
                    <div v-if="isVencida(cotizacion.vencimiento)" class="vencido-alert">
                      <small class="text-danger">
                        <i class="bi bi-exclamation-triangle me-1"></i>Vencida
                      </small>
                    </div>
                  </td>

                  <!-- Acciones -->
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="viewCotizacion(cotizacion)"
                        title="Ver detalles"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-warning"
                        @click="openEditModal(cotizacion)"
                        title="Editar cotización"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-info"
                        @click="generatePDF(cotizacion)"
                        title="Generar PDF (jsPDF)"
                      >
                        <i class="bi bi-file-pdf"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="printCotizacion(cotizacion)"
                        title="Imprimir / Generar PDF (plantilla)"
                      >
                        <i class="bi bi-printer"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="confirmDelete(cotizacion)"
                        title="Eliminar cotización"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Estado vacío -->
                <tr v-if="filteredCotizaciones.length === 0">
                  <td colspan="7" class="empty-state">
                    <div class="empty-content">
                      <i class="bi bi-file-earmark-text empty-icon"></i>
                      <h5>No se encontraron cotizaciones</h5>
                      <p class="text-muted">
                        No hay cotizaciones que coincidan con los filtros aplicados
                      </p>
                      <button class="btn btn-outline-primary" @click="clearFilters">
                        <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div class="table-footer">
            <div class="pagination-controls">
              <nav aria-label="Paginación de cotizaciones">
                <ul class="pagination">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="currentPage = 1" :disabled="currentPage === 1">
                      <i class="bi bi-chevron-double-left"></i>
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="prevPage" :disabled="currentPage === 1">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>

                  <li v-for="pageNum in visiblePages" :key="pageNum" class="page-item" :class="{ active: pageNum === currentPage }">
                    <button class="page-link" @click="currentPage = pageNum">
                      {{ pageNum }}
                    </button>
                  </li>

                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="currentPage = totalPages" :disabled="currentPage === totalPages">
                      <i class="bi bi-chevron-double-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>

              <div class="pagination-info">
                <span class="text-muted">
                  Página {{ currentPage }} de {{ totalPages }} •
                  Mostrando {{ startItem }}-{{ endItem }} de {{ filteredCotizaciones.length }} cotizaciones
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="cotizacionToDelete" class="modal-backdrop show" @click="cancelDelete"></div>
    <div v-if="cotizacionToDelete" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-danger me-2"></i>
              Confirmar eliminación
            </h5>
            <button type="button" class="btn-close" @click="cancelDelete"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              Esta acción no se puede deshacer
            </div>

            <div class="cotizacion-preview">
              <div class="preview-icon">
                <i class="bi bi-file-earmark-text text-primary" style="font-size: 3rem;"></i>
              </div>
              <div class="preview-info">
                <h6>COT-{{ formatNumero(cotizacionToDelete.id) }}</h6>
                <p class="text-muted mb-1">{{ cotizacionToDelete.cliente.nombre }}</p>
                <p class="mb-0">
                  <span class="badge" :class="getEstadoClass(cotizacionToDelete.estado)">
                    {{ getEstadoText(cotizacionToDelete.estado) }}
                  </span>
                  <span class="ms-2">Total: ${{ formatCurrency(cotizacionToDelete.total) }}</span>
                </p>
              </div>
            </div>

            <p class="mt-3">
              ¿Estás seguro de que deseas eliminar permanentemente esta cotización?
              Se perderán todos los datos asociados.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCotizacion">
              <i class="bi bi-trash me-1"></i>Sí, eliminar cotización
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Cotización (componente integrado) -->
    <div v-if="showCreateModal" class="modal-backdrop show" @click="showCreateModal = false"></div>
    <div v-if="showCreateModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-file-earmark-plus me-2"></i>Nueva cotización</h5>
            <button type="button" class="btn-close" @click="showCreateModal = false"></button>
          </div>
          <div class="modal-body">
            <CotizacionForm
              :isEditing="false"
              @save="(cot) => { submitCreate && submitCreate(cot); showCreateModal = false }"
              @cancel="() => { showCreateModal = false }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Cotización (componente integrado) -->
    <div v-if="showEditModal" class="modal-backdrop show" @click="showEditModal = false"></div>
    <div v-if="showEditModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Editar cotización</h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <div class="modal-body">
            <CotizacionForm
              :isEditing="true"
              :cotizacion="editingCotizacion"
              @save="(cot) => { submitEdit && submitEdit(cot); showEditModal = false }"
              @cancel="() => { showEditModal = false }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        id="adminToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastEl"
      >
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto">
            <i :class="toastIcon"></i> {{ toastTitle }}
          </strong>
          <small>Ahora mismo</small>
          <button
            type="button"
            class="btn-close"
            :class="toastType === 'success' ? 'btn-close-white' : ''"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body bg-body border border-opacity-25 rounded-bottom" :class="`border-${toastType}`">
          <div class="d-flex align-items-center">
            <i :class="toastBodyIcon" class="fs-5 me-2"></i>
            <span>{{ toastMessage }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CotizacionForm from './CotizacionForm.vue'
import { openTemplateAndPrint } from './pdfGenerator'
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'
type EstadoCotizacion = 'pendiente' | 'aprobada' | 'rechazada' | 'vencida'

interface Cliente {
  id: number
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  direccion?: string
}

interface ItemCotizacion {
  id: number
  servicio: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

interface Cotizacion {
  id: number
  cliente: Cliente
  fecha: string | Date
  vencimiento: string | Date
  estado: EstadoCotizacion
  items: ItemCotizacion[]
  subtotal: number
  iva: number
  total: number
  descripcion?: string
  notas?: string
  creadoPor?: string
}

interface Estado {
  value: EstadoCotizacion
  label: string
  icon: string
  color: string
}

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// API base
import { API_BASE } from '@/config/api'

// Estado de datos
const cotizaciones = ref<Cotizacion[]>([
  {
    id: 1,
    cliente: {
      id: 1,
      nombre: 'Laboratorio Químico Avanzado',
      email: 'contacto@labquimico.com',
      telefono: '+52 55 1234 5678',
      empresa: 'LQA S.A.',
      direccion: 'Av. Tecnológico 123, CDMX'
    },
    fecha: '2024-01-15',
    vencimiento: '2024-02-15',
    estado: 'aprobada',
    items: [
      {
        id: 1,
        servicio: 'Análisis de Agua Potable',
        descripcion: 'Análisis completo de 15 parámetros según NOM-127-SSA1-2021',
        cantidad: 1,
        precioUnitario: 2500,
        subtotal: 2500
      },
      {
        id: 2,
        servicio: 'Pruebas de Calidad de Aire',
        descripcion: 'Medición de partículas PM2.5 y PM10',
        cantidad: 2,
        precioUnitario: 1800,
        subtotal: 3600
      }
    ],
    subtotal: 6100,
    iva: 976,
    total: 7076,
    descripcion: 'Análisis ambiental para certificación',
    notas: 'Muestras a recolectar en sitio por personal especializado',
    creadoPor: 'Ana Pérez'
  },
  {
    id: 2,
    cliente: {
      id: 2,
      nombre: 'Hospital General',
      email: 'compras@hospitalgeneral.mx',
      telefono: '+52 55 9876 5432',
      empresa: 'Hospital General S.A.',
      direccion: 'Calle Salud 456, CDMX'
    },
    fecha: '2024-01-18',
    vencimiento: '2024-02-18',
    estado: 'pendiente',
    items: [
      {
        id: 1,
        servicio: 'Esterilidad de Equipo Médico',
        descripcion: 'Prueba de esterilidad por método de filtración',
        cantidad: 5,
        precioUnitario: 1200,
        subtotal: 6000
      }
    ],
    subtotal: 6000,
    iva: 960,
    total: 6960,
    descripcion: 'Control de calidad para equipos quirúrgicos',
    notas: 'Entregar resultados en 48 horas',
    creadoPor: 'Carlos Gómez'
  },
  {
    id: 3,
    cliente: {
      id: 3,
      nombre: 'Empresa Alimentaria S.A.',
      email: 'calidad@alimentos.mx',
      telefono: '+52 55 5555 1234',
      empresa: 'Alimentos Premium',
      direccion: 'Av. Industrial 789, Edo. Méx'
    },
    fecha: '2024-01-10',
    vencimiento: '2024-01-25',
    estado: 'vencida',
    items: [
      {
        id: 1,
        servicio: 'Análisis Microbiológico',
        descripcion: 'Recuento de bacterias mesófilas',
        cantidad: 10,
        precioUnitario: 800,
        subtotal: 8000
      }
    ],
    subtotal: 8000,
    iva: 1280,
    total: 9280,
    descripcion: 'Control microbiológico de línea de producción',
    creadoPor: 'María González'
  },
  {
    id: 4,
    cliente: {
      id: 4,
      nombre: 'Universidad Nacional',
      email: 'investigacion@unam.mx',
      telefono: '+52 55 4444 3333',
      empresa: 'UNAM',
      direccion: 'Ciudad Universitaria, CDMX'
    },
    fecha: '2024-01-20',
    vencimiento: '2024-02-20',
    estado: 'rechazada',
    items: [
      {
        id: 1,
        servicio: 'Análisis Espectroscópico',
        descripcion: 'Espectroscopía de masas con ICP-MS',
        cantidad: 3,
        precioUnitario: 3500,
        subtotal: 10500
      }
    ],
    subtotal: 10500,
    iva: 1680,
    total: 12180,
    descripcion: 'Proyecto de investigación doctoral',
    notas: 'Presupuesto excede lo asignado',
    creadoPor: 'Diego Ramírez'
  }
])

const clientes = ref<Cliente[]>([
  {
    id: 1,
    nombre: 'Laboratorio Químico Avanzado',
    email: 'contacto@labquimico.com',
    telefono: '+52 55 1234 5678',
    empresa: 'LQA S.A.',
    direccion: 'Av. Tecnológico 123, CDMX'
  },
  {
    id: 2,
    nombre: 'Hospital General',
    email: 'compras@hospitalgeneral.mx',
    telefono: '+52 55 9876 5432',
    empresa: 'Hospital General S.A.',
    direccion: 'Calle Salud 456, CDMX'
  },
  {
    id: 3,
    nombre: 'Empresa Alimentaria S.A.',
    email: 'calidad@alimentos.mx',
    telefono: '+52 55 5555 1234',
    empresa: 'Alimentos Premium',
    direccion: 'Av. Industrial 789, Edo. Méx'
  }
])

const printCotizacion = async (cotizacion: Cotizacion) => {
  try {
    await openTemplateAndPrint(cotizacion)
  } catch (err) {
    showToast('Error al abrir plantilla de impresión', 'error')
  }
}

// Estados disponibles
const estados: Estado[] = [
  { value: 'pendiente', label: 'Pendiente', icon: 'bi bi-clock', color: 'bg-warning' },
  { value: 'aprobada', label: 'Aprobada', icon: 'bi bi-check-circle', color: 'bg-success' },
  { value: 'rechazada', label: 'Rechazada', icon: 'bi bi-x-circle', color: 'bg-danger' },
  { value: 'vencida', label: 'Vencida', icon: 'bi bi-calendar-x', color: 'bg-secondary' }
]

// Filtros y búsqueda
const searchQuery = ref('')
const selectedEstado = ref<EstadoCotizacion | null>(null)
const fechaDesde = ref('')
const fechaHasta = ref('')

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Estado para eliminar cotización
const cotizacionToDelete = ref<Cotizacion | null>(null)

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const createForm = ref({
  clienteId: '',
  vencimiento: '',
  descripcion: ''
})
const editForm = ref({
  id: '',
  clienteId: '',
  vencimiento: '',
  descripcion: '',
  estado: 'pendiente' as EstadoCotizacion
})

// Computed
const hasActiveFilters = computed(() => !!(searchQuery.value || selectedEstado.value || fechaDesde.value || fechaHasta.value))

const filteredCotizaciones = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return cotizaciones.value.filter(cotizacion => {
    // Filtro por búsqueda
    const matchesSearch = !query ||
      (cotizacion.cliente.nombre && cotizacion.cliente.nombre.toLowerCase().includes(query)) ||
      (cotizacion.cliente.email && cotizacion.cliente.email.toLowerCase().includes(query)) ||
      (cotizacion.cliente.empresa && cotizacion.cliente.empresa.toLowerCase().includes(query)) ||
      (cotizacion.descripcion && cotizacion.descripcion.toLowerCase().includes(query)) ||
      `COT-${formatNumero(cotizacion.id)}`.toLowerCase().includes(query)

    // Filtro por estado
    const matchesEstado = !selectedEstado.value || cotizacion.estado === selectedEstado.value

    // Filtro por fecha desde
    const matchesFechaDesde = !fechaDesde.value || new Date(cotizacion.fecha) >= new Date(fechaDesde.value)

    // Filtro por fecha hasta
    const matchesFechaHasta = !fechaHasta.value || new Date(cotizacion.fecha) <= new Date(fechaHasta.value)

    return matchesSearch && matchesEstado && matchesFechaDesde && matchesFechaHasta
  }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCotizaciones.value.length / itemsPerPage.value))
)

const paginatedCotizaciones = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCotizaciones.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Estadísticas
const totalCotizaciones = computed(() => cotizaciones.value.length)
const aprobadas = computed(() => cotizaciones.value.filter(c => c.estado === 'aprobada').length)
const pendientes = computed(() => cotizaciones.value.filter(c => c.estado === 'pendiente').length)
const rechazadas = computed(() => cotizaciones.value.filter(c => c.estado === 'rechazada').length)
const vencidas = computed(() => cotizaciones.value.filter(c => c.estado === 'vencida').length)

// Paginación helpers
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredCotizaciones.value.length)
)

// Toast helpers
const toastClass = computed(() => {
  const classes: Record<ToastType, string> = {
    'success': 'bg-success text-white border-0',
    'info': 'bg-info text-white border-0',
    'warning': 'bg-warning text-dark border-0',
    'error': 'bg-danger text-white border-0'
  }
  return classes[toastType.value] || 'bg-info text-white border-0'
})

const toastIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle',
    'info': 'bi bi-info-circle',
    'warning': 'bi bi-exclamation-triangle',
    'error': 'bi bi-x-circle'
  }
  return icons[toastType.value] || 'bi bi-info-circle'
})

const toastBodyIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle-fill text-success',
    'info': 'bi bi-info-circle-fill text-info',
    'warning': 'bi bi-exclamation-triangle-fill text-warning',
    'error': 'bi bi-x-circle-fill text-danger'
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill text-info'
})

// Métodos
const handleSearch = () => {
  currentPage.value = 1
}

const toggleEstadoFilter = (estado: EstadoCotizacion) => {
  selectedEstado.value = selectedEstado.value === estado ? null : estado
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedEstado.value = null
  fechaDesde.value = ''
  fechaHasta.value = ''
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const formatNumero = (id: number): string => {
  return id.toString().padStart(6, '0')
}

const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number): string => {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const getEstadoClass = (estado: EstadoCotizacion): string => {
  const classMap: Record<EstadoCotizacion, string> = {
    'pendiente': 'pendiente',
    'aprobada': 'aprobada',
    'rechazada': 'rechazada',
    'vencida': 'vencida'
  }
  return classMap[estado] || ''
}

const getEstadoIcon = (estado: EstadoCotizacion): string => {
  const iconMap: Record<EstadoCotizacion, string> = {
    'pendiente': 'bi bi-clock',
    'aprobada': 'bi bi-check-circle',
    'rechazada': 'bi bi-x-circle',
    'vencida': 'bi bi-calendar-x'
  }
  return iconMap[estado] || 'bi bi-question-circle'
}

const getEstadoText = (estado: EstadoCotizacion): string => {
  const textMap: Record<EstadoCotizacion, string> = {
    'pendiente': 'Pendiente',
    'aprobada': 'Aprobada',
    'rechazada': 'Rechazada',
    'vencida': 'Vencida'
  }
  return textMap[estado] || estado
}

const isVencida = (vencimiento: string | Date): boolean => {
  return new Date(vencimiento) < new Date()
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

const fetchCotizacionesFromApi = async () => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/cotizaciones`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (!resp.ok) {
      const b = await resp.json().catch(() => ({}))
      showToast(b.message || 'Error al obtener cotizaciones', 'error', 'Error')
      return
    }
    const body = await resp.json()
    const rows = body.data || []
    cotizaciones.value = rows.map((r: any) => ({
      id: r.id_cotizacion || r.id,
      cliente: {
        id: r.id_cliente || 0,
        nombre: r.cliente_nombre || r.nombre_cliente || 'Cliente',
        email: r.cliente_email || r.email_cliente || '',
        telefono: r.cliente_telefono || '',
        empresa: r.cliente_empresa || '',
        direccion: r.cliente_direccion || ''
      },
      fecha: r.fecha || new Date().toISOString().split('T')[0],
      vencimiento: r.fecha_vencimiento || r.vencimiento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: (r.estado || 'pendiente') as EstadoCotizacion,
      items: r.items || [],
      subtotal: r.subtotal || 0,
      iva: r.iva || 0,
      total: r.total || 0,
      descripcion: r.descripcion || '',
      notas: r.notas || '',
      creadoPor: r.creado_por || r.creadoPor || ''
    }))
  } catch (err) {
    console.error('fetchCotizacionesFromApi error', err)
    showToast('Error conectando con el servidor', 'error', 'Error')
  }
}

const fetchClientesFromApi = async () => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/clientes`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (!resp.ok) {
      // Try fallback to /api/users if /api/clientes is not available
      const status = resp.status
      let msg = 'Error al obtener clientes'
      try { const b = await resp.json(); msg = b.message || msg } catch(_) { try { const t = await resp.text(); if (t) msg = t } catch(_){} }
      console.error(`fetch /api/clientes failed ${status}:`, msg)
      if (status === 404) {
        // fallback
        const resp2 = await fetch(`${API_BASE}/api/users`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (!resp2.ok) {
          const b2 = await resp2.json().catch(() => ({}))
          console.error('Fallback /api/users failed', b2)
          return
        }
        const body2 = await resp2.json()
        const rows2 = Array.isArray(body2) ? body2 : (body2.data || body2 || [])
        clientes.value = rows2.map((r: any) => ({
          id: r.id_usuario || r.id,
          nombre: r.nombre || r.razon_social || 'Cliente',
          email: r.correo || r.email || '',
          telefono: r.telefono || '',
          empresa: r.empresa || r.razon_social || '',
          direccion: r.direccion || ''
        }))
        return
      }
      return
    }
    const body = await resp.json()
    const rows = body.data || []
    clientes.value = rows.map((r: any) => ({
      id: r.id_cliente || r.id,
      nombre: r.nombre || r.razon_social || 'Cliente',
      email: r.correo || r.email || '',
      telefono: r.telefono || '',
      empresa: r.empresa || r.razon_social || '',
      direccion: r.direccion || ''
    }))
  } catch (err) {
    console.error('fetchClientesFromApi error', err)
  }
}

const viewCotizacion = (cotizacion: Cotizacion) => {
  router.push(`/admin/cotizaciones/${cotizacion.id}`)
}

const openCreateModal = () => {
  createForm.value = {
    clienteId: '',
    vencimiento: '',
    descripcion: ''
  }
  showCreateModal.value = true
}

const submitCreate = async () => {
  const token = getAuthToken()
  if (!token) {
    showToast('No autenticado. Por favor inicia sesión.', 'warning', 'Autenticación')
    return
  }

  try {
    const clienteSeleccionado = clientes.value.find(c => (c.id !== undefined && c.id !== null) && String(c.id) === String(createForm.value.clienteId))
    if (!clienteSeleccionado) {
      showToast('Por favor selecciona un cliente', 'warning', 'Validación')
      return
    }

    // Compute a safe next id for local UI (do not rely on possibly-missing ids)
    const maxId = cotizaciones.value.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0)
    const nuevaCotizacion: Cotizacion = {
      id: maxId + 1,
      cliente: clienteSeleccionado,
      fecha: new Date().toISOString().split('T')[0],
      vencimiento: createForm.value.vencimiento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: 'pendiente',
      items: [],
      subtotal: 0,
      iva: 0,
      total: 0,
      descripcion: createForm.value.descripcion || '',
      creadoPor: 'Usuario Actual'
    }

    // En producción, enviar al API. Construir payload esperado por el backend.
    const apiPayload: any = {
      usuarioId: clienteSeleccionado.id,
      nombre_cliente: clienteSeleccionado.nombre,
      correo: clienteSeleccionado.email,
      telefono: clienteSeleccionado.telefono,
      items: []
    }
    if (clienteSeleccionado.empresa) apiPayload.empresa = clienteSeleccionado.empresa
    if (clienteSeleccionado.direccion) apiPayload.direccion = clienteSeleccionado.direccion
    if (createForm.value.vencimiento) apiPayload.vencimiento = createForm.value.vencimiento

    const resp = await fetch(`${API_BASE}/api/cotizaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(apiPayload)
    })

    const body = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      showToast(body.message || 'Error creando cotización', 'error', 'Error')
      return
    }

    // refresh list from server to get canonical data
    showCreateModal.value = false
    showToast('Cotización creada exitosamente', 'success', 'Creación')
    await fetchCotizacionesFromApi()
  } catch (err) {
    console.error('submitCreate error', err)
    showToast('Error conectando con el servidor', 'error', 'Error')
  }
}

const openEditModal = async (cotizacion: Cotizacion) => {
  const token = getAuthToken()
  if (!token) {
    showToast('No autenticado.', 'warning')
    return
  }

  try {
    editForm.value = {
      id: cotizacion.id.toString(),
      clienteId: cotizacion.cliente.id.toString(),
      vencimiento: typeof cotizacion.vencimiento === 'string' ? cotizacion.vencimiento.split('T')[0] : new Date(cotizacion.vencimiento).toISOString().split('T')[0],
      descripcion: cotizacion.descripcion || '',
      estado: cotizacion.estado
    }
    showEditModal.value = true
  } catch (err) {
    console.error('openEditModal error', err)
    showToast('Error cargando cotización', 'error')
  }
}

const submitEdit = async () => {
  const token = getAuthToken()
  if (!token) {
    showToast('No autenticado.', 'warning')
    return
  }

  try {
    const clienteSeleccionado = clientes.value.find(c => c.id.toString() === editForm.value.clienteId)
    if (!clienteSeleccionado) {
      showToast('Por favor selecciona un cliente', 'warning', 'Validación')
      return
    }

    const cotizacionIndex = cotizaciones.value.findIndex(c => c.id.toString() === editForm.value.id)
    if (cotizacionIndex === -1) {
      showToast('Cotización no encontrada', 'error')
      return
    }

    const cotizacionActualizada = {
      ...cotizaciones.value[cotizacionIndex],
      cliente: clienteSeleccionado,
      vencimiento: editForm.value.vencimiento,
      descripcion: editForm.value.descripcion,
      estado: editForm.value.estado
    }

    // En producción, enviar al API
    const resp = await fetch(`${API_BASE}/api/cotizaciones/${editForm.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cotizacionActualizada)
    })

    const body = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      showToast(body.message || 'Error actualizando cotización', 'error', 'Error')
      return
    }

    cotizaciones.value[cotizacionIndex] = cotizacionActualizada
    showEditModal.value = false
    showToast('Cotización actualizada', 'success', 'Edición')
    await fetchCotizacionesFromApi()
  } catch (err) {
    console.error('submitEdit error', err)
    showToast('Error conectando con el servidor', 'error')
  }
}

const confirmDelete = (cotizacion: Cotizacion) => {
  cotizacionToDelete.value = cotizacion
}

const cancelDelete = () => {
  cotizacionToDelete.value = null
}

const deleteCotizacion = async () => {
  if (!cotizacionToDelete.value) return
  const token = getAuthToken()
  if (!token) {
    showToast('No autenticado. Por favor inicia sesión.', 'warning', 'Autenticación')
    return
  }

  try {
    const idToDelete = cotizacionToDelete.value.id
    // En producción, enviar al API
    const resp = await fetch(`${API_BASE}/api/cotizaciones/${idToDelete}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    const body = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      showToast(body.message || 'No se pudo eliminar la cotización', 'error', 'Error')
      return
    }

    cotizaciones.value = cotizaciones.value.filter(c => c.id !== idToDelete)
    showToast(`Cotización "COT-${formatNumero(cotizacionToDelete.value.id)}" eliminada`, 'success', 'Cotización eliminada')
    cotizacionToDelete.value = null
  } catch (err) {
    console.error('deleteCotizacion error', err)
    showToast('Error conectando con el servidor', 'error', 'Error')
  }
}

const generatePDF = async (cotizacion: Cotizacion) => {
  showToast('Generando PDF...', 'info', 'Generación')

  try {
    // Simular generación de PDF
    await new Promise(resolve => setTimeout(resolve, 1500))

    // En producción, usaríamos una librería como jsPDF o PDFKit
    // Por ahora simulamos la descarga
    const link = document.createElement('a')
    link.href = '#'
    link.download = `COT-${formatNumero(cotizacion.id)}.pdf`
    link.click()

    showToast('PDF generado exitosamente', 'success', 'PDF listo')
  } catch (error) {
    showToast('Error al generar PDF', 'error', 'Error')
  }
}

const exportData = () => {
  const headers = ['Número', 'Cliente', 'Fecha', 'Vencimiento', 'Estado', 'Subtotal', 'IVA', 'Total', 'Descripción']
  const csvData = cotizaciones.value.map(cotizacion => [
    `COT-${formatNumero(cotizacion.id)}`,
    cotizacion.cliente.nombre,
    formatDate(cotizacion.fecha),
    formatDate(cotizacion.vencimiento),
    getEstadoText(cotizacion.estado),
    `$${formatCurrency(cotizacion.subtotal)}`,
    `$${formatCurrency(cotizacion.iva)}`,
    `$${formatCurrency(cotizacion.total)}`,
    cotizacion.descripcion || ''
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cotizaciones-sena-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Archivo CSV generado y descargado', 'success', 'Exportación completada')
}

const showToast = (message: string, type: ToastType = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title || type.charAt(0).toUpperCase() + type.slice(1)
  toastType.value = type

  if (toastInstance) {
    toastInstance.hide()
  }

  if (toastEl.value) {
    import('bootstrap').then((bootstrap) => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 3000 })
      toastInstance.show()
    })
  }
}

onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Cargar datos desde la API
  fetchCotizacionesFromApi()
  fetchClientesFromApi()

  // Cargar datos de ejemplo si no hay conexión
  if (cotizaciones.value.length === 0) {
    // Los datos de ejemplo ya están definidos en el array inicial
  }
})
</script>

<style scoped>
.admin-cotizaciones-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-cotizaciones-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */
.admin-header {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem 0;
  box-shadow: 0 2px 15px var(--shadow-color, rgba(0, 0, 0, 0.08));
}

[data-bs-theme="dark"] .admin-header {
  background: var(--color-light, #121212);
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.breadcrumb {
  margin-bottom: 1rem;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.breadcrumb-item.active {
  color: var(--color-primary, #1E9E4A);
  font-weight: 500;
}

.breadcrumb-link {
  color: var(--color-gray, #6C757D);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--color-primary, #1E9E4A);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .page-title {
  color: var(--color-dark, #F8F9FA);
}

.page-subtitle {
  color: var(--color-gray, #6C757D);
  margin: 0;
}

.quick-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--card-bg, white);
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-width: 160px;
  transition: transform 0.3s ease;
}

[data-bs-theme="dark"] .stat-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.active {
  background: var(--gradient-primary);
}

.stat-icon.admin {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  line-height: 1;
}

[data-bs-theme="dark"] .stat-number {
  color: var(--color-dark, #F8F9FA);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  margin-top: 0.25rem;
}

/* Panel de control */
.control-panel {
  padding: 2rem 0 1rem;
}

.panel-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

[data-bs-theme="dark"] .panel-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.panel-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .panel-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .panel-title {
  color: var(--color-dark, #F8F9FA);
}

.panel-body {
  padding: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 992px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

[data-bs-theme="dark"] .filter-label {
  color: var(--color-dark, #F8F9FA);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-gray, #6C757D);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .search-input {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 0 0 0.25rem rgba(30, 158, 74, 0.25);
}

.clear-search {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.clear-search:hover {
  color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.1);
}

.status-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .status-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray, #6C757D);
}

.status-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.status-filter-btn.active {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

[data-bs-theme="dark"] .status-filter-btn.active {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.date-filters .input-group {
  display: flex;
  align-items: center;
}

.date-filters .input-group-text {
  background: var(--card-bg, white);
  border: 2px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
}

[data-bs-theme="dark"] .date-filters .input-group-text {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.date-filters .form-control {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .date-filters .form-control {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

/* Tabla principal */
.main-content {
  padding: 1rem 0 3rem;
}

.table-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

[data-bs-theme="dark"] .table-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.table-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .table-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .table-title {
  color: var(--color-dark, #F8F9FA);
}

.table-subtitle {
  color: var(--color-gray, #6C757D);
  margin: 0;
  font-size: 0.9rem;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

/* Tabla de cotizaciones */
.cotizaciones-table {
  width: 100%;
  border-collapse: collapse;
}

.cotizaciones-table thead tr {
  background: var(--lab-bg, #f8f9fa);
  border-bottom: 2px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .cotizaciones-table thead tr {
  background: var(--lab-bg, #1a1a1a);
  border-bottom: 2px solid var(--color-gray-light, #2d2d2d);
}

.cotizaciones-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

[data-bs-theme="dark"] .cotizaciones-table th {
  color: var(--color-gray-dark, #ADB5BD);
}

.cotizaciones-table tbody tr {
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  transition: background-color 0.3s ease;
}

.cotizaciones-table tbody tr:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .cotizaciones-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.cotizaciones-table td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
}

/* Celdas específicas */
.numero-cell {
  min-width: 150px;
}

.numero-info {
  display: flex;
  flex-direction: column;
}

.cotizacion-numero {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .cotizacion-numero {
  color: var(--color-dark, #F8F9FA);
}

.cotizacion-desc {
  font-size: 0.85rem;
}

.cliente-cell {
  min-width: 200px;
}

.cliente-info {
  display: flex;
  flex-direction: column;
}

.cliente-nombre {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-bs-theme="dark"] .cliente-nombre {
  color: var(--color-dark, #F8F9FA);
}

.cliente-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.meta-item {
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.fecha-cell {
  min-width: 150px;
}

.fecha-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .fecha-info {
  color: var(--color-dark, #F8F9FA);
}

.creado-por {
  margin-top: 0.25rem;
}

.monto-cell {
  min-width: 120px;
}

.monto-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
}

.monto-detalle {
  margin-top: 0.25rem;
}

.estado-cell {
  min-width: 150px;
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.estado-badge.pendiente {
  background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
  color: #333;
}

.estado-badge.aprobada {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
}

.estado-badge.rechazada {
  background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
  color: white;
}

.estado-badge.vencida {
  background: linear-gradient(135deg, #9E9E9E 0%, #616161 100%);
  color: white;
}

.estado-notas {
  margin-top: 0.25rem;
}

.vencimiento-cell {
  min-width: 150px;
}

.vencimiento-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.vencido-alert {
  margin-top: 0.25rem;
}

.actions-cell {
  min-width: 200px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-buttons .btn {
  border-radius: 10px;
  padding: 0.45rem 0.6rem;
  font-size: 0.92rem;
}

.action-buttons .btn-outline-primary { border-color: rgba(16,24,40,0.06); color: #0f172a }
.action-buttons .btn-outline-warning { background: linear-gradient(90deg,#f59e0b,#f97316); color: white; border:0 }
.action-buttons .btn-outline-info { background: linear-gradient(90deg,#0ea5e9,#3b82f6); color: white; border:0 }
.action-buttons .btn-outline-danger { background: linear-gradient(90deg,#ef4444,#dc2626); color: white; border:0 }

/* Estado vacío */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-content {
  max-width: 300px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 3rem;
  color: var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
}

.empty-state h5 {
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.5rem;
}

/* Pie de tabla */
.table-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.pagination {
  margin: 0;
}

.page-link {
  color: var(--color-primary, #1E9E4A);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  padding: 0.5rem 0.75rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .page-link {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.page-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
}

[data-bs-theme="dark"] .page-link:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.page-item.active .page-link {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

.page-item.disabled .page-link {
  color: var(--color-gray, #6C757D);
  background: var(--lab-bg, #f8f9fa);
  border-color: var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .page-item.disabled .page-link {
  background: var(--lab-bg, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

/* Modal */
.modal-backdrop {
  opacity: 0.5;
}

.modal-content {
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

[data-bs-theme="dark"] .modal-content {
  border: 1px solid var(--color-gray-light, #2d2d2d);
  background: var(--color-light, #121212);
}

.cotizacion-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 12px;
  margin: 1rem 0;
}

[data-bs-theme="dark"] .cotizacion-preview {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.preview-icon {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-info h6 {
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .preview-info h6 {
  color: var(--color-dark, #F8F9FA);
}

/* Responsive */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .quick-stats {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}

@media (max-width: 992px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .table-actions {
    width: 100%;
    justify-content: space-between;
  }

  .cotizaciones-table {
    min-width: 1000px;
  }

  .table-responsive {
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .panel-body {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .action-buttons .btn {
    flex: 1;
    min-width: 120px;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .cliente-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 576px) {
  .admin-header {
    padding: 1rem 0;
  }

  .panel-header,
  .table-header {
    padding: 1rem 1.25rem;
  }

  .panel-body,
  .cotizaciones-table td,
  .cotizaciones-table th,
  .table-footer {
    padding: 1rem 1.25rem;
  }

  .stat-card {
    min-width: 140px;
    padding: 0.75rem 1rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .action-buttons {
    justify-content: center;
  }
}

/* Make table rows look like cards on smaller screens */
@media (max-width: 992px) {
  .cotizaciones-table thead { display: none }
  .cotizaciones-table, .cotizaciones-table tbody, .cotizaciones-table tr, .cotizaciones-table td {
    display: block; width: 100%
  }
  .cotizaciones-table tr {
    background: rgba(255,255,255,0.85);
    margin-bottom: 12px;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 8px 24px rgba(12,18,30,0.06);
    border: 1px solid rgba(10,15,30,0.04)
  }
  .cotizaciones-table td {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem
  }
  .actions-cell {
    display:flex;
    justify-content:flex-end
  }
}

/* Modal polish */
.modal-backdrop.show {
  backdrop-filter: blur(3px);
  background: rgba(0,0,0,0.35)
}
.modal-content {
  background: rgba(255,255,255,0.9);
  border: 0;
  border-radius: 14px
}
.modal-header {
  border-bottom: 1px solid rgba(10,15,30,0.04)
}

/* Toast improvements */
.toast {
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(12,18,30,0.08)
}

/* subtle animated accents */
.stat-card, .panel-card, .table-card {
  transition: transform .18s ease, box-shadow .18s ease
}
.stat-card:hover, .panel-card:hover, .table-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(12,18,30,0.08)
}

/* Improve contrast for dark mode overrides */
[data-bs-theme="dark"] .panel-card,
[data-bs-theme="dark"] .table-card,
[data-bs-theme="dark"] .stat-card {
  background: rgba(24,24,26,0.55);
  border: 1px solid rgba(255,255,255,0.04)
}
</style>
