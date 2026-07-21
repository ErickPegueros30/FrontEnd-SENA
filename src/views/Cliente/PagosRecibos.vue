<template>
  <div :data-bs-theme="currentTheme" class="pagos-recibos-page">
    <!-- Header con breadcrumb -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Inicio
              </router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/cliente/dashboard" class="breadcrumb-link">
                <i class="bi bi-speedometer2"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-receipt"></i> Mis Pagos y Recibos
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-receipt-fill me-2"></i>Mis Pagos y Recibos
            </h1>
            <p class="page-subtitle">
              Consulte el historial de sus pagos y descargue sus recibos
            </p>
          </div>

          <div class="header-actions">
            <button class="btn btn-outline-primary" @click="exportPagos">
              <i class="bi bi-download me-1"></i> Exportar historial
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Resumen de pagos -->
    <section class="resumen-section">
      <div class="container">
        <div class="resumen-grid">
          <div class="resumen-card">
            <div class="resumen-icon total">
              <i class="bi bi-wallet2"></i>
            </div>
            <div class="resumen-info">
              <span class="resumen-label">Total Pagado</span>
              <span class="resumen-value">${{ formatNumber(totalPagado) }}</span>
            </div>
          </div>
          <div class="resumen-card">
            <div class="resumen-icon pagos">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="resumen-info">
              <span class="resumen-label">Pagos Realizados</span>
              <span class="resumen-value">{{ pagosCompletados }}</span>
            </div>
          </div>
          <div class="resumen-card">
            <div class="resumen-icon promedio">
              <i class="bi bi-graph-up"></i>
            </div>
            <div class="resumen-info">
              <span class="resumen-label">Pago Promedio</span>
              <span class="resumen-value">${{ formatNumber(pagoPromedio) }}</span>
            </div>
          </div>
          <div class="resumen-card">
            <div class="resumen-icon ultimo">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="resumen-info">
              <span class="resumen-label">Último Pago</span>
              <span class="resumen-value">{{ ultimoPagoFecha }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Panel de filtros -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-card">
          <div class="filters-header">
            <h3 class="filters-title">
              <i class="bi bi-funnel me-2"></i>Filtros
            </h3>
            <button v-if="hasActiveFilters" class="btn-clear-filters" @click="clearFilters">
              <i class="bi bi-x-circle"></i> Limpiar filtros
            </button>
          </div>

          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-search me-1"></i>Buscar
              </label>
              <div class="search-box">
                <i class="bi bi-search search-icon"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="search-input"
                  placeholder="Buscar por concepto, folio o referencia..."
                  @input="handleSearch"
                >
                <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-calendar-range me-1"></i>Período
              </label>
              <div class="date-range">
                <input type="date" v-model="dateFrom" class="form-control" placeholder="Desde">
                <span>a</span>
                <input type="date" v-model="dateTo" class="form-control" placeholder="Hasta">
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-credit-card me-1"></i>Método de pago
              </label>
              <select v-model="selectedMetodo" class="form-select">
                <option value="">Todos</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lista de pagos -->
    <main class="main-content">
      <div class="container">
        <div class="pagos-card">
          <div class="card-header-custom">
            <div class="card-info">
              <h4 class="card-title">
                <i class="bi bi-clock-history me-2"></i>Historial de Pagos
              </h4>
              <p class="card-subtitle">
                Mostrando {{ filteredPagos.length }} de {{ pagos.length }} pagos realizados
              </p>
            </div>

            <div class="card-actions">
              <div class="view-options">
                <button
                  class="view-btn"
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                  title="Vista de lista"
                >
                  <i class="bi bi-list-ul"></i>
                </button>
                <button
                  class="view-btn"
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                  title="Vista de tarjetas"
                >
                  <i class="bi bi-grid-3x3-gap"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Vista de lista -->
          <div v-if="viewMode === 'list'" class="pagos-list">
            <div v-if="filteredPagos.length === 0" class="empty-state">
              <div class="empty-content">
                <i class="bi bi-receipt empty-icon"></i>
                <h5>No hay pagos registrados</h5>
                <p class="text-muted">
                  Aún no se han registrado pagos en su cuenta.
                  Los pagos aparecerán aquí una vez que sean procesados.
                </p>
                <button class="btn btn-outline-primary" @click="clearFilters">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                </button>
              </div>
            </div>

            <div v-else class="pagos-table-container">
              <table class="pagos-table">
                <thead>
                  <tr>
                    <th>Folio / Referencia</th>
                    <th>Concepto</th>
                    <th>Fecha de pago</th>
                    <th>Monto</th>
                    <th>Método de pago</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pago in paginatedPagos" :key="pago.id">
                    <td class="folio-cell">
                      <span class="folio-number">#{{ pago.folio || pago.id }}</span>
                      <div class="folio-ref" v-if="pago.referencia">
                        <small>Ref: {{ pago.referencia }}</small>
                      </div>
                    </td>
                    <td class="concepto-cell">
                      <div class="concepto-info">
                        <strong>{{ pago.concepto }}</strong>
                        <div class="concepto-detalle" v-if="pago.detalle">
                          {{ truncateText(pago.detalle, 50) }}
                        </div>
                      </div>
                    </td>
                    <td class="fecha-cell">
                      <div class="fecha-info">
                        <i class="bi bi-calendar3"></i>
                        <span>{{ formatDate(pago.fecha_pago || pago.fecha) }}</span>
                      </div>
                    </td>
                    <td class="monto-cell">
                      <span class="monto-valor">${{ formatNumber(pago.monto) }}</span>
                    </td>
                    <td class="metodo-cell">
                      <span class="metodo-badge" :class="getMetodoClass(pago.metodo_pago)">
                        <i :class="getMetodoIcon(pago.metodo_pago)"></i>
                        {{ getMetodoLabel(pago.metodo_pago) }}
                      </span>
                    </td>
                    <td class="actions-cell">
                      <div class="action-buttons">
                        <button
                          class="btn-action view"
                          @click="viewDetallePago(pago)"
                          title="Ver detalles"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        <button
                          class="btn-action download"
                          @click="descargarRecibo(pago)"
                          title="Descargar recibo"
                        >
                          <i class="bi bi-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div v-if="filteredPagos.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ startItem }} - {{ endItem }} de {{ filteredPagos.length }} pagos
              </div>
              <div class="pagination-controls">
                <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1">
                  <i class="bi bi-chevron-double-left"></i>
                </button>
                <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-btn"
                  :class="{ active: page === currentPage }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
                <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
                  <i class="bi bi-chevron-right"></i>
                </button>
                <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Vista de cuadrícula -->
          <div v-else class="pagos-grid">
            <div v-if="filteredPagos.length === 0" class="empty-state">
              <div class="empty-content">
                <i class="bi bi-receipt empty-icon"></i>
                <h5>No hay pagos registrados</h5>
                <p class="text-muted">
                  Aún no se han registrado pagos en su cuenta.
                  Los pagos aparecerán aquí una vez que sean procesados.
                </p>
                <button class="btn btn-outline-primary" @click="clearFilters">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                </button>
              </div>
            </div>

            <div v-else class="grid-container">
              <div v-for="pago in paginatedPagos" :key="pago.id" class="pago-card">
                <div class="pago-card-header">
                  <div class="folio-info">
                    <span class="folio-label">Folio</span>
                    <span class="folio-number">#{{ pago.folio || pago.id }}</span>
                  </div>
                  <div class="metodo-badge" :class="getMetodoClass(pago.metodo_pago)">
                    <i :class="getMetodoIcon(pago.metodo_pago)"></i>
                    {{ getMetodoLabel(pago.metodo_pago) }}
                  </div>
                </div>

                <div class="pago-card-body">
                  <div class="concepto-section">
                    <h4>{{ pago.concepto }}</h4>
                    <p v-if="pago.detalle">{{ truncateText(pago.detalle, 60) }}</p>
                  </div>

                  <div class="pago-details">
                    <div class="detail-row">
                      <i class="bi bi-calendar3"></i>
                      <span>{{ formatDate(pago.fecha_pago || pago.fecha) }}</span>
                    </div>
                    <div class="detail-row" v-if="pago.referencia">
                      <i class="bi bi-upc-scan"></i>
                      <span>Ref: {{ pago.referencia }}</span>
                    </div>
                  </div>

                  <div class="monto-section">
                    <span class="monto-label">Monto pagado</span>
                    <span class="monto-value">${{ formatNumber(pago.monto) }}</span>
                  </div>
                </div>

                <div class="pago-card-footer">
                  <button
                    class="btn-action view"
                    @click="viewDetallePago(pago)"
                    title="Ver detalles"
                  >
                    <i class="bi bi-eye"></i> Detalles
                  </button>
                  <button
                    class="btn-action download"
                    @click="descargarRecibo(pago)"
                    title="Descargar recibo"
                  >
                    <i class="bi bi-download"></i> Recibo
                  </button>
                </div>
              </div>
            </div>

            <!-- Paginación para grid -->
            <div v-if="filteredPagos.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ startItem }} - {{ endItem }} de {{ filteredPagos.length }} pagos
              </div>
              <div class="pagination-controls">
                <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1">
                  <i class="bi bi-chevron-double-left"></i>
                </button>
                <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-btn"
                  :class="{ active: page === currentPage }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
                <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
                  <i class="bi bi-chevron-right"></i>
                </button>
                <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de detalles del pago -->
    <div v-if="showDetailsModal" class="modal-backdrop show" @click="closeDetailsModal"></div>
    <div v-if="showDetailsModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-receipt me-2"></i>Detalle del Pago
            </h5>
            <button type="button" class="btn-close" @click="closeDetailsModal"></button>
          </div>
          <div class="modal-body" v-if="selectedPago">
            <div class="detalle-header">
              <div class="folio-section">
                <span class="folio-label">Folio</span>
                <span class="folio-number">#{{ selectedPago.folio || selectedPago.id }}</span>
              </div>
              <span class="estado-badge status-completed">
                <i class="bi bi-check-circle"></i> Completado
              </span>
            </div>

            <div class="detalle-grid">
              <div class="detalle-section">
                <h4><i class="bi bi-info-circle"></i> Información General</h4>
                <div class="detalle-row">
                  <span class="detalle-label">Concepto:</span>
                  <span class="detalle-value">{{ selectedPago.concepto }}</span>
                </div>
                <div class="detalle-row" v-if="selectedPago.detalle">
                  <span class="detalle-label">Detalle:</span>
                  <span class="detalle-value">{{ selectedPago.detalle }}</span>
                </div>
                <div class="detalle-row">
                  <span class="detalle-label">Fecha de pago:</span>
                  <span class="detalle-value">{{ formatFullDate(selectedPago.fecha_pago || selectedPago.fecha) }}</span>
                </div>
                <div class="detalle-row">
                  <span class="detalle-label">Monto:</span>
                  <span class="detalle-value monto">${{ formatNumber(selectedPago.monto) }}</span>
                </div>
              </div>

              <div class="detalle-section">
                <h4><i class="bi bi-credit-card"></i> Información de Pago</h4>
                <div class="detalle-row">
                  <span class="detalle-label">Método de pago:</span>
                  <span class="detalle-value">{{ getMetodoLabel(selectedPago.metodo_pago) }}</span>
                </div>
                <div class="detalle-row" v-if="selectedPago.referencia">
                  <span class="detalle-label">Referencia:</span>
                  <span class="detalle-value">{{ selectedPago.referencia }}</span>
                </div>
                <div class="detalle-row" v-if="selectedPago.numero_autorizacion">
                  <span class="detalle-label">Autorización:</span>
                  <span class="detalle-value">{{ selectedPago.numero_autorizacion }}</span>
                </div>
                <div class="detalle-row" v-if="selectedPago.banco">
                  <span class="detalle-label">Banco:</span>
                  <span class="detalle-value">{{ selectedPago.banco }}</span>
                </div>
              </div>

              <div class="detalle-section" v-if="selectedPago.servicios?.length">
                <h4><i class="bi bi-list-check"></i> Servicios Incluidos</h4>
                <ul class="servicios-list">
                  <li v-for="(servicio, idx) in selectedPago.servicios" :key="idx">
                    {{ servicio }}
                  </li>
                </ul>
              </div>

              <div class="detalle-section" v-if="selectedPago.notas">
                <h4><i class="bi bi-chat-text"></i> Notas</h4>
                <p>{{ selectedPago.notas }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDetailsModal">Cerrar</button>
            <button class="btn btn-primary" @click="descargarRecibo(selectedPago)">
              <i class="bi bi-download me-1"></i> Descargar Recibo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <BaseToast ref="toastRef" toast-id="clientToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import BaseToast from '@/components/UI/BaseToast.vue'
import { useToast, type ToastType } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'


const { toastRef, showToast } = useToast()
// Tipos

// Estado del tema
const { currentTheme } = useTheme()

// Vista
const viewMode = ref<'list' | 'grid'>('list')

// Filtros
const searchQuery = ref('')
const selectedMetodo = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modales
const showDetailsModal = ref(false)
const selectedPago = ref<any>(null)

// Datos
const pagos = ref<any[]>([])

// Computed para resumen
const totalPagado = computed(() => {
  return pagos.value.reduce((sum, p) => sum + (p.monto || 0), 0)
})

const pagosCompletados = computed(() => pagos.value.length)

const pagoPromedio = computed(() => {
  if (pagos.value.length === 0) return 0
  return totalPagado.value / pagos.value.length
})

const ultimoPagoFecha = computed(() => {
  if (pagos.value.length === 0) return '---'
  const ultimo = pagos.value[0]
  return formatDate(ultimo.fecha_pago || ultimo.fecha)
})

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedMetodo.value || dateFrom.value || dateTo.value)
})

const filteredPagos = computed(() => {
  let result = [...pagos.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      (p.concepto && p.concepto.toLowerCase().includes(query)) ||
      (p.folio && p.folio.toLowerCase().includes(query)) ||
      (p.referencia && p.referencia.toLowerCase().includes(query)) ||
      (p.detalle && p.detalle.toLowerCase().includes(query))
    )
  }

  if (selectedMetodo.value) {
    result = result.filter(p => p.metodo_pago === selectedMetodo.value)
  }

  if (dateFrom.value) {
    result = result.filter(p => {
      const fecha = new Date(p.fecha_pago || p.fecha)
      return fecha >= new Date(dateFrom.value)
    })
  }

  if (dateTo.value) {
    result = result.filter(p => {
      const fecha = new Date(p.fecha_pago || p.fecha)
      return fecha <= new Date(dateTo.value)
    })
  }

  // Ordenar por fecha descendente (más reciente primero)
  result.sort((a, b) => {
    const dateA = new Date(a.fecha_pago || a.fecha)
    const dateB = new Date(b.fecha_pago || b.fecha)
    return dateB.getTime() - dateA.getTime()
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredPagos.value.length / itemsPerPage.value))
const paginatedPagos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPagos.value.slice(start, end)
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

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredPagos.value.length))

// Métodos de ayuda
const formatNumber = (value: number) => {
  if (!value) return '0'
  return value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatFullDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getMetodoLabel = (metodo: string) => {
  const labels: Record<string, string> = {
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    efectivo: 'Efectivo',
    cheque: 'Cheque'
  }
  return labels[metodo] || metodo
}

const getMetodoClass = (metodo: string) => {
  const classes: Record<string, string> = {
    tarjeta: 'metodo-tarjeta',
    transferencia: 'metodo-transferencia',
    efectivo: 'metodo-efectivo',
    cheque: 'metodo-cheque'
  }
  return classes[metodo] || 'metodo-other'
}

const getMetodoIcon = (metodo: string) => {
  const icons: Record<string, string> = {
    tarjeta: 'bi bi-credit-card',
    transferencia: 'bi bi-bank2',
    efectivo: 'bi bi-cash',
    cheque: 'bi bi-receipt'
  }
  return icons[metodo] || 'bi bi-credit-card'
}

// Filtros
const handleSearch = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedMetodo.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Acciones de pago
const viewDetallePago = (pago: any) => {
  selectedPago.value = pago
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedPago.value = null
}

const descargarRecibo = (pago: any) => {
  showToast(`Descargando recibo #${pago.folio || pago.id}...`, 'success', 'Descargando')

  // Generar contenido del recibo (mock)
  const reciboContent = generateReciboContent(pago)
  const blob = new Blob([reciboContent], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Recibo_${pago.folio || pago.id}_${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  setTimeout(() => {
    showToast('Recibo descargado correctamente', 'success', 'Descarga completada')
  }, 1000)
}

const generateReciboContent = (pago: any): string => {
  return `RECIBO DE PAGO OFICIAL
================================

DATOS DEL PAGO
--------------------------------
Folio: ${pago.folio || pago.id}
Concepto: ${pago.concepto}
Fecha: ${formatFullDate(pago.fecha_pago || pago.fecha)}
Monto: $${formatNumber(pago.monto)}

DATOS DEL PAGO
--------------------------------
Método de pago: ${getMetodoLabel(pago.metodo_pago)}
Referencia: ${pago.referencia || 'N/A'}

SERVICIOS INCLUIDOS
--------------------------------
${pago.servicios?.map((s: string) => `- ${s}`).join('\n') || 'No especificado'}

Este documento es un comprobante oficial de pago.
Gracias por su preferencia.

SENA Laboratorios
${new Date().toLocaleDateString('es-ES')}
`
}

// Exportar pagos
const exportPagos = () => {
  const headers = ['Folio', 'Concepto', 'Fecha', 'Monto', 'Método de Pago', 'Referencia']
  const csvData = filteredPagos.value.map(p => [
    p.folio || p.id,
    p.concepto,
    formatDate(p.fecha_pago || p.fecha),
    p.monto,
    getMetodoLabel(p.metodo_pago),
    p.referencia || ''
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `historial-pagos-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Historial exportado correctamente', 'success', 'Exportación completada')
}

// Cargar datos desde localStorage
const loadPagos = () => {
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    try {
      const mockData = JSON.parse(storedData)
      if (mockData.pagos && mockData.pagos.length > 0) {
        // Solo mostrar pagos completados
        pagos.value = mockData.pagos.filter((p: any) => p.estado === 'completado')
      } else {
        loadMockPagos()
      }
    } catch (e) {
      console.error('Error loading pagos:', e)
      loadMockPagos()
    }
  } else {
    loadMockPagos()
  }
}

// Cargar pagos mock (solo completados)
const loadMockPagos = () => {
  pagos.value = [
    {
      id: 1,
      folio: 'REC-2024-0001',
      concepto: 'Análisis Químico - Lote 2024-001',
      detalle: 'Análisis de composición química para 5 muestras de agua residual',
      monto: 12500,
      metodo_pago: 'transferencia',
      referencia: 'REF-1234567890',
      estado: 'completado',
      fecha_pago: '2024-01-15T10:30:00',
      servicios: ['Análisis de pH', 'Metales pesados', 'Compuestos orgánicos'],
      banco: 'BBVA',
      numero_autorizacion: 'AUT-12345'
    },
    {
      id: 2,
      folio: 'REC-2024-0002',
      concepto: 'Calibración de Equipos',
      detalle: 'Calibración de balanzas analíticas y pHmetros',
      monto: 8500,
      metodo_pago: 'tarjeta',
      referencia: 'REF-2345678901',
      estado: 'completado',
      fecha_pago: '2024-01-20T14:15:00',
      servicios: ['Calibración balanzas', 'Calibración pHmetros'],
      banco: 'Santander',
      numero_autorizacion: 'AUT-23456'
    },
    {
      id: 4,
      folio: 'REC-2024-0004',
      concepto: 'Análisis Microbiológico',
      detalle: 'Detección de bacterias patógenas en alimentos',
      monto: 5000,
      metodo_pago: 'efectivo',
      referencia: 'REF-4567890123',
      estado: 'completado',
      fecha_pago: '2024-01-25T09:00:00',
      servicios: ['Recuento de bacterias', 'Hongos y levaduras'],
      banco: 'N/A',
      numero_autorizacion: 'AUT-34567'
    },
    {
      id: 5,
      folio: 'REC-2024-0006',
      concepto: 'Análisis Físico - Materiales Construcción',
      detalle: 'Pruebas de resistencia y dureza para 8 muestras',
      monto: 7200,
      metodo_pago: 'transferencia',
      referencia: 'REF-6789012345',
      estado: 'completado',
      fecha_pago: '2024-02-01T11:45:00',
      servicios: ['Resistencia a compresión', 'Dureza', 'Densidad'],
      banco: 'BBVA',
      numero_autorizacion: 'AUT-45678'
    },
    {
      id: 6,
      folio: 'REC-2024-0007',
      concepto: 'Consultoría Ambiental',
      detalle: 'Asesoría para gestión de residuos peligrosos',
      monto: 9800,
      metodo_pago: 'tarjeta',
      referencia: 'REF-7890123456',
      estado: 'completado',
      fecha_pago: '2024-02-10T10:00:00',
      servicios: ['Diagnóstico inicial', 'Plan de manejo', 'Capacitación'],
      banco: 'Santander',
      numero_autorizacion: 'AUT-56789'
    }
  ]

  // Guardar en localStorage
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    const mockData = JSON.parse(storedData)
    mockData.pagos = pagos.value
    localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
  }
}

// Toast





watch([searchQuery, selectedMetodo, dateFrom, dateTo], () => {
  currentPage.value = 1
})

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadPagos()
})
</script>

<style scoped>
/* Mantener consistencia con el diseño anterior - estilos similares a componentes previos */
.pagos-recibos-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .pagos-recibos-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */

/* Resumen Section */
.resumen-section {
  padding: 2rem 0 1rem;
}

.resumen-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.resumen-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .resumen-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.resumen-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.resumen-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.resumen-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.resumen-icon.pagos {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
}

.resumen-icon.promedio {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
}

.resumen-icon.ultimo {
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
}

.resumen-info {
  flex: 1;
}

.resumen-label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.25rem;
}

.resumen-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .resumen-value {
  color: var(--color-dark, #F8F9FA);
}

/* Filters Section */
.filters-section {
  padding: 0 0 1rem;
}

.filters-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem;
}

[data-bs-theme="dark"] .filters-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.filters-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-dark, #212529);
}

.btn-clear-filters {
  background: none;
  border: none;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray, #6C757D);
}

.search-input {
  width: 100%;
  padding: 0.625rem 2rem 0.625rem 2.25rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-gray, #6C757D);
  cursor: pointer;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-range .form-control {
  flex: 1;
  padding: 0.625rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

.form-select {
  padding: 0.625rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .form-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

/* Main Content */
.main-content {
  padding: 0 0 3rem;
}

.pagos-card {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  overflow: hidden;
}

[data-bs-theme="dark"] .pagos-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.card-header-custom {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

.card-subtitle {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin: 0;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn.active {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

/* Table Styles */
.pagos-table-container {
  overflow-x: auto;
}

.pagos-table {
  width: 100%;
  border-collapse: collapse;
}

.pagos-table th {
  text-align: left;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-gray-dark, #495057);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.pagos-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  vertical-align: middle;
}

.pagos-table tr:hover {
  background: rgba(30, 158, 74, 0.03);
}

.folio-number {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
}

.folio-ref small {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

.concepto-info strong {
  display: block;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .concepto-info strong {
  color: var(--color-dark, #F8F9FA);
}

.concepto-detalle {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
  margin-top: 0.25rem;
}

.fecha-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

.monto-valor {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
}

.metodo-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.metodo-tarjeta {
  background: #cfe2ff;
  color: #084298;
}

.metodo-transferencia {
  background: #d4edda;
  color: #155724;
}

.metodo-efectivo {
  background: #fff3cd;
  color: #856404;
}

.metodo-cheque {
  background: #cff4fc;
  color: #055160;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action.view:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.btn-action.download:hover {
  border-color: #17a2b8;
  color: #17a2b8;
}

/* Grid View */
.pagos-grid {
  padding: 1.5rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.pago-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .pago-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.pago-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.pago-card-header {
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.folio-info {
  display: flex;
  flex-direction: column;
}

.folio-label {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

.pago-card-body {
  padding: 1rem;
}

.concepto-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--color-dark, #212529);
}

.concepto-section p {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin: 0;
}

.pago-details {
  margin: 1rem 0;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 10px;
}

[data-bs-theme="dark"] .pago-details {
  background: rgba(255, 255, 255, 0.03);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.25rem;
}

.monto-section {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.monto-label {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

.monto-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
}

.pago-card-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Pagination */
.pagination-container {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.page-btn.active {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border-color: transparent;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
}

/* Modal Details */
.detalle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.detalle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.detalle-section {
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(129, 199, 132, 0.01) 100%));
  border-radius: 12px;
}

.detalle-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-primary, #1E9E4A);
}

.detalle-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  font-size: 0.85rem;
}

.detalle-label {
  font-weight: 500;
  color: var(--color-gray, #6C757D);
}

.detalle-value {
  color: var(--color-dark, #212529);
}

.detalle-value.monto {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #d4edda;
  color: #155724;
}

.servicios-list {
  margin: 0;
  padding-left: 1.25rem;
}

.servicios-list li {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.25rem;
}

/* Buttons */
.btn-primary {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
}

.btn-outline-primary {
  border: 2px solid var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  background: transparent;
}

.btn-outline-primary:hover {
  background: var(--color-primary, #1E9E4A);
  color: white;
}

/* Toast */

/* Responsive */
@media (max-width: 1200px) {
  .resumen-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {

  .detalle-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {

  .resumen-grid {
    grid-template-columns: 1fr;
  }

  .card-header-custom {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }

  .pagos-table th:nth-child(3),
  .pagos-table td:nth-child(3) {
    display: none;
  }
}
</style>
