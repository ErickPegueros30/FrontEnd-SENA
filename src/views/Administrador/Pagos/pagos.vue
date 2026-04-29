<template>
  <div :data-bs-theme="currentTheme" class="admin-pagos-page">
    <!-- Header con breadcrumb -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-credit-card"></i> Gestión de Pagos
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-credit-card-fill me-2"></i>Gestión de Pagos
            </h1>
            <p class="page-subtitle">
              Gestione pagos de clientes, envíe notificaciones y administre recibos
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-wallet2"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">${{ formatNumber(totalIngresos) }}</span>
                  <span class="stat-label">Ingresos totales</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon pendiente">
                  <i class="bi bi-hourglass-split"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">${{ formatNumber(totalPendiente) }}</span>
                  <span class="stat-label">Pendientes</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon este-mes">
                  <i class="bi bi-calendar-month"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">${{ formatNumber(ingresosEsteMes) }}</span>
                  <span class="stat-label">Este mes</span>
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
                    placeholder="Buscar por cliente, concepto, folio..."
                  >
                </div>
              </div>

              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-filter-circle me-1"></i>Estado
                </label>
                <div class="status-filters">
                  <button
                    v-for="status in statusOptions"
                    :key="status.value"
                    class="status-filter-btn"
                    :class="{ active: selectedStatus === status.value }"
                    @click="toggleStatusFilter(status.value)"
                  >
                    <i :class="status.icon"></i>
                    {{ status.label }}
                    <span class="status-count">{{ getStatusCount(status.value) }}</span>
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
                  <i class="bi bi-lightning me-1"></i>Acciones rápidas
                </label>
                <div class="action-buttons">
                  <button class="btn btn-outline-secondary" @click="clearFilters">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar
                  </button>
                  <button class="btn btn-primary" @click="exportPagos">
                    <i class="bi bi-download me-1"></i>Exportar
                  </button>
                  <button class="btn btn-success" @click="openSolicitarPagoModal">
                    <i class="bi bi-plus-lg me-1"></i>Solicitar pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de pagos -->
    <main class="main-content">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">
                <i class="bi bi-table me-2"></i>Registro de Pagos
              </h4>
              <p class="table-subtitle">
                Mostrando {{ filteredPagos.length }} de {{ pagos.length }} registros
              </p>
            </div>
            <div class="table-actions">
              <div class="pagination-info">
                <span class="text-muted">Registros por página:</span>
                <select v-model="itemsPerPage" class="form-select form-select-sm ms-2" style="width: auto;">
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="pagos-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Concepto</th>
                  <th>Folio / Referencia</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pago in paginatedPagos" :key="pago.id">
                  <td class="cliente-cell">
                    <div class="cliente-info">
                      <div class="cliente-nombre">{{ pago.cliente_nombre || pago.cliente }}</div>
                      <div class="cliente-email">{{ pago.cliente_email }}</div>
                    </div>
                  </td>
                  <td class="concepto-cell">
                    <strong>{{ pago.concepto }}</strong>
                    <div class="concepto-detalle" v-if="pago.detalle">
                      {{ truncateText(pago.detalle, 40) }}
                    </div>
                  </td>
                  <td class="folio-cell">
                    <span class="folio-number">#{{ pago.folio || pago.id }}</span>
                    <div class="folio-ref" v-if="pago.referencia">
                      <small>{{ pago.referencia }}</small>
                    </div>
                  </td>
                  <td class="fecha-cell">
                    {{ formatDate(pago.fecha_pago || pago.fecha_solicitud || pago.createdAt) }}
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
                  <td class="estado-cell">
                    <span class="estado-badge" :class="getEstadoClass(pago.estado)">
                      <i :class="getEstadoIcon(pago.estado)"></i>
                      {{ getEstadoLabel(pago.estado) }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button class="btn-action view" @click="verDetalle(pago)" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button
                        v-if="pago.estado === 'pendiente'"
                        class="btn-action edit"
                        @click="editarPago(pago)"
                        title="Editar"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        v-if="pago.estado === 'pendiente'"
                        class="btn-action send"
                        @click="enviarNotificacion(pago)"
                        title="Enviar notificación"
                      >
                        <i class="bi bi-envelope"></i>
                      </button>
                      <button
                        v-if="pago.estado === 'pendiente'"
                        class="btn-action success"
                        @click="registrarPago(pago)"
                        title="Registrar pago"
                      >
                        <i class="bi bi-check-circle"></i>
                      </button>
                      <button
                        v-if="pago.estado === 'completado'"
                        class="btn-action download"
                        @click="descargarRecibo(pago)"
                        title="Descargar recibo"
                      >
                        <i class="bi bi-download"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredPagos.length === 0">
                  <td colspan="8" class="empty-state">
                    <div class="empty-content">
                      <i class="bi bi-receipt empty-icon"></i>
                      <h5>No hay pagos registrados</h5>
                      <p class="text-muted">No se encontraron pagos que coincidan con los filtros</p>
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
          <div class="table-footer" v-if="filteredPagos.length > 0">
            <div class="pagination-controls">
              <nav aria-label="Paginación">
                <ul class="pagination">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="currentPage = 1">
                      <i class="bi bi-chevron-double-left"></i>
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="prevPage">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                    <button class="page-link" @click="currentPage = page">{{ page }}</button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="nextPage">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="currentPage = totalPages">
                      <i class="bi bi-chevron-double-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
              <div class="pagination-info">
                Página {{ currentPage }} de {{ totalPages }} •
                Mostrando {{ startItem }}-{{ endItem }} de {{ filteredPagos.length }} registros
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal: Solicitar pago al cliente -->
    <div v-if="showSolicitarModal" class="modal-backdrop show" @click="closeSolicitarModal"></div>
    <div v-if="showSolicitarModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-send me-2"></i>Solicitar Pago a Cliente
            </h5>
            <button type="button" class="btn-close" @click="closeSolicitarModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitSolicitarPago">
              <div class="form-group">
                <label class="form-label required">Cliente</label>
                <select v-model="nuevaSolicitud.cliente_id" class="form-select" required>
                  <option value="">Seleccione un cliente</option>
                  <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                    {{ cliente.nombre }} {{ cliente.apellido }} - {{ cliente.email }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Concepto</label>
                <input v-model="nuevaSolicitud.concepto" type="text" class="form-control" required>
              </div>

              <div class="form-group">
                <label class="form-label">Detalle</label>
                <textarea v-model="nuevaSolicitud.detalle" class="form-control" rows="2"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Monto</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input v-model.number="nuevaSolicitud.monto" type="number" class="form-control" step="0.01" min="1" required>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Fecha límite</label>
                  <input v-model="nuevaSolicitud.fecha_limite" type="date" class="form-control" :min="minDate">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Métodos de pago aceptados</label>
                <div class="metodos-grid">
                  <label v-for="metodo in metodosPago" :key="metodo.value" class="metodo-checkbox">
                    <input type="checkbox" :value="metodo.value" v-model="nuevaSolicitud.metodos_aceptados">
                    <i :class="metodo.icon"></i>
                    {{ metodo.label }}
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Notas adicionales</label>
                <textarea v-model="nuevaSolicitud.notas" class="form-control" rows="2" placeholder="Instrucciones para el pago..."></textarea>
              </div>

              <div class="alert alert-info mt-3">
                <i class="bi bi-envelope-fill me-2"></i>
                Se enviará una notificación por correo electrónico al cliente con los detalles del pago solicitado.
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeSolicitarModal">Cancelar</button>
            <button class="btn btn-primary" @click="submitSolicitarPago" :disabled="submitting">
              <i v-if="!submitting" class="bi bi-send me-1"></i>
              <i v-else class="bi bi-hourglass-split me-1"></i>
              {{ submitting ? 'Enviando...' : 'Enviar solicitud' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Registrar pago -->
    <div v-if="showRegistrarModal" class="modal-backdrop show" @click="closeRegistrarModal"></div>
    <div v-if="showRegistrarModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-check-circle me-2"></i>Registrar Pago
            </h5>
            <button type="button" class="btn-close" @click="closeRegistrarModal"></button>
          </div>
          <div class="modal-body">
            <div class="pago-resumen">
              <div class="resumen-row">
                <span>Cliente:</span>
                <strong>{{ pagoSeleccionado?.cliente_nombre || pagoSeleccionado?.cliente }}</strong>
              </div>
              <div class="resumen-row">
                <span>Concepto:</span>
                <strong>{{ pagoSeleccionado?.concepto }}</strong>
              </div>
              <div class="resumen-row">
                <span>Monto:</span>
                <strong class="monto">${{ formatNumber(pagoSeleccionado?.monto) }}</strong>
              </div>
            </div>

            <form @submit.prevent="submitRegistrarPago">
              <div class="form-group">
                <label class="form-label required">Método de pago</label>
                <select v-model="registroPago.metodo_pago" class="form-select" required>
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Referencia / Número de operación</label>
                <input v-model="registroPago.referencia" type="text" class="form-control">
              </div>

              <div class="form-group">
                <label class="form-label">Fecha de pago</label>
                <input v-model="registroPago.fecha_pago" type="date" class="form-control" :max="maxDate">
              </div>

              <div class="form-group">
                <label class="form-label">Notas internas</label>
                <textarea v-model="registroPago.notas" class="form-control" rows="2"></textarea>
              </div>

              <div class="form-check mt-2">
                <input type="checkbox" id="enviarRecibo" v-model="registroPago.enviar_recibo" class="form-check-input">
                <label for="enviarRecibo" class="form-check-label">
                  Enviar recibo por correo electrónico al cliente
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeRegistrarModal">Cancelar</button>
            <button class="btn btn-success" @click="submitRegistrarPago" :disabled="submitting">
              <i v-if="!submitting" class="bi bi-check-circle me-1"></i>
              <i v-else class="bi bi-hourglass-split me-1"></i>
              {{ submitting ? 'Procesando...' : 'Registrar pago' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Ver/Editar detalle -->
    <div v-if="showDetalleModal" class="modal-backdrop show" @click="closeDetalleModal"></div>
    <div v-if="showDetalleModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-receipt me-2"></i>Detalle del Pago
            </h5>
            <button type="button" class="btn-close" @click="closeDetalleModal"></button>
          </div>
          <div class="modal-body" v-if="pagoSeleccionado">
            <div class="detalle-header">
              <div>
                <span class="folio-label">Folio</span>
                <span class="folio-number">#{{ pagoSeleccionado.folio || pagoSeleccionado.id }}</span>
              </div>
              <span class="estado-badge" :class="getEstadoClass(pagoSeleccionado.estado)">
                {{ getEstadoLabel(pagoSeleccionado.estado) }}
              </span>
            </div>

            <div class="detalle-grid">
              <div class="detalle-section">
                <h4><i class="bi bi-person"></i> Cliente</h4>
                <p><strong>Nombre:</strong> {{ pagoSeleccionado.cliente_nombre || pagoSeleccionado.cliente }}</p>
                <p><strong>Email:</strong> {{ pagoSeleccionado.cliente_email }}</p>
                <p v-if="pagoSeleccionado.cliente_telefono"><strong>Teléfono:</strong> {{ pagoSeleccionado.cliente_telefono }}</p>
              </div>

              <div class="detalle-section">
                <h4><i class="bi bi-info-circle"></i> Concepto</h4>
                <p><strong>Concepto:</strong> {{ pagoSeleccionado.concepto }}</p>
                <p v-if="pagoSeleccionado.detalle"><strong>Detalle:</strong> {{ pagoSeleccionado.detalle }}</p>
                <p><strong>Monto:</strong> <span class="monto">${{ formatNumber(pagoSeleccionado.monto) }}</span></p>
              </div>

              <div class="detalle-section">
                <h4><i class="bi bi-calendar"></i> Fechas</h4>
                <p><strong>Solicitado:</strong> {{ formatFullDate(pagoSeleccionado.fecha_solicitud || pagoSeleccionado.createdAt) }}</p>
                <p v-if="pagoSeleccionado.fecha_limite"><strong>Límite:</strong> {{ formatFullDate(pagoSeleccionado.fecha_limite) }}</p>
                <p v-if="pagoSeleccionado.fecha_pago"><strong>Pagado:</strong> {{ formatFullDate(pagoSeleccionado.fecha_pago) }}</p>
              </div>

              <div class="detalle-section" v-if="pagoSeleccionado.metodo_pago">
                <h4><i class="bi bi-credit-card"></i> Pago</h4>
                <p><strong>Método:</strong> {{ getMetodoLabel(pagoSeleccionado.metodo_pago) }}</p>
                <p v-if="pagoSeleccionado.referencia"><strong>Referencia:</strong> {{ pagoSeleccionado.referencia }}</p>
              </div>

              <div class="detalle-section" v-if="pagoSeleccionado.notas">
                <h4><i class="bi bi-chat-text"></i> Notas</h4>
                <p>{{ pagoSeleccionado.notas }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDetalleModal">Cerrar</button>
            <button v-if="pagoSeleccionado?.estado === 'completado'" class="btn btn-primary" @click="descargarRecibo(pagoSeleccionado)">
              <i class="bi bi-download me-1"></i> Descargar recibo
            </button>
            <button v-if="pagoSeleccionado?.estado === 'pendiente'" class="btn btn-success" @click="registrarPago(pagoSeleccionado)">
              <i class="bi bi-check-circle me-1"></i> Registrar pago
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Enviar notificación -->
    <div v-if="showNotificacionModal" class="modal-backdrop show" @click="closeNotificacionModal"></div>
    <div v-if="showNotificacionModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-envelope me-2"></i>Enviar Notificación
            </h5>
            <button type="button" class="btn-close" @click="closeNotificacionModal"></button>
          </div>
          <div class="modal-body">
            <div class="notificacion-preview">
              <div class="preview-header">
                <i class="bi bi-envelope-fill"></i>
                <span>Notificación de pago pendiente</span>
              </div>
              <div class="preview-body">
                <p><strong>Para:</strong> {{ pagoSeleccionado?.cliente_nombre || pagoSeleccionado?.cliente }}</p>
                <p><strong>Email:</strong> {{ pagoSeleccionado?.cliente_email }}</p>
                <p><strong>Asunto:</strong> Recordatorio de pago pendiente</p>
                <hr>
                <p>Estimado(a) {{ pagoSeleccionado?.cliente_nombre?.split(' ')[0] || 'cliente' }},</p>
                <p>Le recordamos que tiene un pago pendiente por el concepto:</p>
                <p><strong>{{ pagoSeleccionado?.concepto }}</strong></p>
                <p>Monto: <strong>${{ formatNumber(pagoSeleccionado?.monto) }}</strong></p>
                <p v-if="pagoSeleccionado?.fecha_limite">Fecha límite: <strong>{{ formatDate(pagoSeleccionado.fecha_limite) }}</strong></p>
                <p>Por favor realice su pago a la brevedad para continuar con el servicio.</p>
                <hr>
                <p>Atentamente,<br>Equipo SENA Laboratorios</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeNotificacionModal">Cancelar</button>
            <button class="btn btn-primary" @click="submitEnviarNotificacion" :disabled="submitting">
              <i v-if="!submitting" class="bi bi-send me-1"></i>
              <i v-else class="bi bi-hourglass-split me-1"></i>
              {{ submitting ? 'Enviando...' : 'Enviar notificación' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div id="adminToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="toastEl">
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto"><i :class="toastIcon"></i> {{ toastTitle }}</strong>
          <small>Ahora mismo</small>
          <button type="button" class="btn-close" :class="toastType === 'success' ? 'btn-close-white' : ''" data-bs-dismiss="toast"></button>
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
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import type { Toast } from 'bootstrap'

type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado
const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modales
const showSolicitarModal = ref(false)
const showRegistrarModal = ref(false)
const showDetalleModal = ref(false)
const showNotificacionModal = ref(false)
const pagoSeleccionado = ref<any>(null)
const submitting = ref(false)

// Datos
const pagos = ref<any[]>([])
const clientes = ref<any[]>([])

// Nueva solicitud de pago
const nuevaSolicitud = ref({
  cliente_id: '',
  concepto: '',
  detalle: '',
  monto: null as number | null,
  fecha_limite: '',
  metodos_aceptados: [] as string[],
  notas: ''
})

// Registro de pago
const registroPago = ref({
  metodo_pago: 'transferencia',
  referencia: '',
  fecha_pago: '',
  notas: '',
  enviar_recibo: true
})

// Opciones
const statusOptions = [
  { value: 'pendiente', label: 'Pendiente', icon: 'bi bi-clock' },
  { value: 'completado', label: 'Completado', icon: 'bi bi-check-circle' },
  { value: 'cancelado', label: 'Cancelado', icon: 'bi bi-x-circle' },
  { value: 'reembolsado', label: 'Reembolsado', icon: 'bi bi-arrow-return-left' }
]

const metodosPago = [
  { value: 'tarjeta', label: 'Tarjeta', icon: 'bi bi-credit-card' },
  { value: 'transferencia', label: 'Transferencia', icon: 'bi bi-bank2' },
  { value: 'efectivo', label: 'Efectivo', icon: 'bi bi-cash' },
  { value: 'cheque', label: 'Cheque', icon: 'bi bi-receipt' }
]

// Computed
const totalIngresos = computed(() => {
  return pagos.value
    .filter(p => p.estado === 'completado')
    .reduce((sum, p) => sum + (p.monto || 0), 0)
})

const totalPendiente = computed(() => {
  return pagos.value
    .filter(p => p.estado === 'pendiente')
    .reduce((sum, p) => sum + (p.monto || 0), 0)
})

const ingresosEsteMes = computed(() => {
  const now = new Date()
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
  return pagos.value
    .filter(p => p.estado === 'completado' && new Date(p.fecha_pago) >= inicioMes)
    .reduce((sum, p) => sum + (p.monto || 0), 0)
})

const filteredPagos = computed(() => {
  let result = [...pagos.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      (p.concepto && p.concepto.toLowerCase().includes(q)) ||
      (p.cliente_nombre && p.cliente_nombre.toLowerCase().includes(q)) ||
      (p.cliente_email && p.cliente_email.toLowerCase().includes(q)) ||
      (p.folio && p.folio.toLowerCase().includes(q))
    )
  }

  if (selectedStatus.value) {
    result = result.filter(p => p.estado === selectedStatus.value)
  }

  if (dateFrom.value) {
    result = result.filter(p => {
      const fecha = new Date(p.fecha_solicitud || p.createdAt || p.fecha_pago)
      return fecha >= new Date(dateFrom.value)
    })
  }

  if (dateTo.value) {
    result = result.filter(p => {
      const fecha = new Date(p.fecha_solicitud || p.createdAt || p.fecha_pago)
      return fecha <= new Date(dateTo.value)
    })
  }

  result.sort((a, b) => {
    const dateA = new Date(a.fecha_solicitud || a.createdAt || a.fecha_pago)
    const dateB = new Date(b.fecha_solicitud || b.createdAt || b.fecha_pago)
    return dateB.getTime() - dateA.getTime()
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredPagos.value.length / itemsPerPage.value))
const paginatedPagos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredPagos.value.slice(start, start + itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredPagos.value.length))
const minDate = computed(() => new Date().toISOString().split('T')[0])
const maxDate = computed(() => new Date().toISOString().split('T')[0])

// Métodos de ayuda
const formatNumber = (value: number) => value?.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
const formatFullDate = (date: string) => date ? new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''
const truncateText = (text: string, max: number) => text?.length > max ? text.substring(0, max) + '...' : text || ''

const getEstadoLabel = (status: string) => ({ pendiente: 'Pendiente', completado: 'Completado', cancelado: 'Cancelado', reembolsado: 'Reembolsado' }[status] || status)
const getEstadoClass = (status: string) => ({ pendiente: 'status-pending', completado: 'status-completed', cancelado: 'status-cancelled', reembolsado: 'status-refunded' }[status] || 'status-pending')
const getEstadoIcon = (status: string) => ({ pendiente: 'bi bi-clock', completado: 'bi bi-check-circle', cancelado: 'bi bi-x-circle', reembolsado: 'bi bi-arrow-return-left' }[status] || 'bi bi-clock')

const getMetodoLabel = (metodo: string) => ({ tarjeta: 'Tarjeta', transferencia: 'Transferencia', efectivo: 'Efectivo', cheque: 'Cheque' }[metodo] || metodo)
const getMetodoClass = (metodo: string) => ({ tarjeta: 'metodo-tarjeta', transferencia: 'metodo-transferencia', efectivo: 'metodo-efectivo', cheque: 'metodo-cheque' }[metodo] || '')
const getMetodoIcon = (metodo: string) => ({ tarjeta: 'bi bi-credit-card', transferencia: 'bi bi-bank2', efectivo: 'bi bi-cash', cheque: 'bi bi-receipt' }[metodo] || 'bi bi-credit-card')

const getStatusCount = (status: string) => pagos.value.filter(p => p.estado === status).length

// Filtros
const toggleStatusFilter = (status: string) => { selectedStatus.value = selectedStatus.value === status ? null : status; currentPage.value = 1 }
const clearFilters = () => { searchQuery.value = ''; selectedStatus.value = null; dateFrom.value = ''; dateTo.value = ''; currentPage.value = 1 }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// Acciones
const verDetalle = (pago: any) => { pagoSeleccionado.value = pago; showDetalleModal.value = true }
const closeDetalleModal = () => { showDetalleModal.value = false; pagoSeleccionado.value = null }
const editarPago = (pago: any) => { showToast('Funcionalidad de edición próximamente', 'info', 'En desarrollo') }

const openSolicitarPagoModal = () => {
  nuevaSolicitud.value = { cliente_id: '', concepto: '', detalle: '', monto: null, fecha_limite: '', metodos_aceptados: [], notas: '' }
  showSolicitarModal.value = true
}
const closeSolicitarModal = () => { showSolicitarModal.value = false }

const submitSolicitarPago = async () => {
  if (!nuevaSolicitud.value.cliente_id || !nuevaSolicitud.value.concepto || !nuevaSolicitud.value.monto) {
    showToast('Complete los campos requeridos', 'warning')
    return
  }
  submitting.value = true
  setTimeout(() => {
    const cliente = clientes.value.find(c => c.id == nuevaSolicitud.value.cliente_id)
    const nuevoPago = {
      id: Date.now(),
      folio: `PAG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      cliente_id: nuevaSolicitud.value.cliente_id,
      cliente: `${cliente?.nombre} ${cliente?.apellido}`,
      cliente_nombre: `${cliente?.nombre} ${cliente?.apellido}`,
      cliente_email: cliente?.email,
      cliente_telefono: cliente?.telefono,
      concepto: nuevaSolicitud.value.concepto,
      detalle: nuevaSolicitud.value.detalle,
      monto: nuevaSolicitud.value.monto,
      fecha_limite: nuevaSolicitud.value.fecha_limite,
      fecha_solicitud: new Date().toISOString(),
      metodos_aceptados: nuevaSolicitud.value.metodos_aceptados,
      notas: nuevaSolicitud.value.notas,
      estado: 'pendiente',
      created_at: new Date().toISOString()
    }
    pagos.value.unshift(nuevoPago)
    guardarEnLocalStorage()
    showToast(`Solicitud de pago enviada a ${cliente?.nombre}`, 'success', 'Solicitud enviada')
    closeSolicitarModal()
    submitting.value = false
  }, 1000)
}

const registrarPago = (pago: any) => {
  pagoSeleccionado.value = pago
  registroPago.value = { metodo_pago: 'transferencia', referencia: '', fecha_pago: new Date().toISOString().split('T')[0], notas: '', enviar_recibo: true }
  showRegistrarModal.value = true
}
const closeRegistrarModal = () => { showRegistrarModal.value = false; pagoSeleccionado.value = null }

const submitRegistrarPago = async () => {
  if (!pagoSeleccionado.value) return
  submitting.value = true
  setTimeout(() => {
    const index = pagos.value.findIndex(p => p.id === pagoSeleccionado.value.id)
    if (index !== -1) {
      pagos.value[index] = {
        ...pagos.value[index],
        estado: 'completado',
        metodo_pago: registroPago.value.metodo_pago,
        referencia: registroPago.value.referencia,
        fecha_pago: registroPago.value.fecha_pago,
        notas_internas: registroPago.value.notas
      }
      guardarEnLocalStorage()
      showToast(`Pago de $${formatNumber(pagoSeleccionado.value.monto)} registrado`, 'success', 'Pago registrado')
      if (registroPago.value.enviar_recibo) {
        setTimeout(() => showToast('Recibo enviado al correo del cliente', 'info', 'Correo enviado'), 500)
      }
    }
    closeRegistrarModal()
    submitting.value = false
  }, 1000)
}

const enviarNotificacion = (pago: any) => {
  pagoSeleccionado.value = pago
  showNotificacionModal.value = true
}
const closeNotificacionModal = () => { showNotificacionModal.value = false; pagoSeleccionado.value = null }

const submitEnviarNotificacion = async () => {
  submitting.value = true
  setTimeout(() => {
    showToast(`Notificación enviada a ${pagoSeleccionado.value.cliente_nombre}`, 'success', 'Notificación enviada')
    closeNotificacionModal()
    submitting.value = false
  }, 1000)
}

const descargarRecibo = (pago: any) => {
  showToast(`Descargando recibo #${pago.folio || pago.id}...`, 'success', 'Descargando')
  const contenido = generarRecibo(pago)
  const blob = new Blob([contenido], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Recibo_${pago.folio || pago.id}_${new Date().toISOString().split('T')[0]}.pdf`
  link.click()
  URL.revokeObjectURL(url)
  setTimeout(() => showToast('Recibo descargado correctamente', 'success', 'Descarga completada'), 1000)
}

const generarRecibo = (pago: any) => `RECIBO DE PAGO OFICIAL - SENA LABORATORIOS

Folio: ${pago.folio || pago.id}
Cliente: ${pago.cliente_nombre || pago.cliente}
Concepto: ${pago.concepto}
Monto: $${formatNumber(pago.monto)}
Fecha de pago: ${formatFullDate(pago.fecha_pago)}
Método de pago: ${getMetodoLabel(pago.metodo_pago)}
Referencia: ${pago.referencia || 'N/A'}

Este documento es un comprobante oficial de pago.
Gracias por su preferencia.

${new Date().toLocaleDateString('es-ES')}`

const exportPagos = () => {
  const headers = ['Folio', 'Cliente', 'Email', 'Concepto', 'Monto', 'Estado', 'Fecha solicitud', 'Fecha pago']
  const rows = filteredPagos.value.map(p => [
    p.folio || p.id, p.cliente_nombre || p.cliente, p.cliente_email, p.concepto, p.monto,
    getEstadoLabel(p.estado), formatDate(p.fecha_solicitud || p.createdAt), formatDate(p.fecha_pago)
  ])
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `pagos-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast('Exportación completada', 'success')
}

const guardarEnLocalStorage = () => {
  const data = localStorage.getItem('mock_admin_data')
  const mockData = data ? JSON.parse(data) : {}
  mockData.pagos = pagos.value
  localStorage.setItem('mock_admin_data', JSON.stringify(mockData))
  // También actualizar datos del cliente
  const clientData = localStorage.getItem('mock_cliente_data')
  if (clientData) {
    const clienteMock = JSON.parse(clientData)
    clienteMock.pagos = pagos.value.filter(p => p.estado === 'completado')
    localStorage.setItem('mock_cliente_data', JSON.stringify(clienteMock))
  }
}

const cargarDatos = () => {
  const adminData = localStorage.getItem('mock_admin_data')
  if (adminData) {
    const data = JSON.parse(adminData)
    if (data.pagos?.length) pagos.value = data.pagos
    else cargarPagosMock()
  } else {
    cargarPagosMock()
  }

  const clientesData = localStorage.getItem('clientes_mock')
  if (clientesData) {
    clientes.value = JSON.parse(clientesData)
  } else {
    clientes.value = [
      { id: 1, nombre: 'Ana', apellido: 'Pérez', email: 'ana.perez@example.com', telefono: '555-1234' },
      { id: 2, nombre: 'Carlos', apellido: 'Gómez', email: 'carlos.gomez@example.com', telefono: '555-5678' },
      { id: 3, nombre: 'María', apellido: 'González', email: 'maria.gonzalez@example.com', telefono: '555-9012' }
    ]
    localStorage.setItem('clientes_mock', JSON.stringify(clientes.value))
  }
}

const cargarPagosMock = () => {
  pagos.value = [
    { id: 1, folio: 'PAG-2024-0001', cliente_id: 1, cliente: 'Ana Pérez', cliente_nombre: 'Ana Pérez', cliente_email: 'ana.perez@example.com', concepto: 'Análisis Químico - Lote 2024-001', detalle: 'Análisis de 5 muestras de agua', monto: 12500, estado: 'completado', metodo_pago: 'transferencia', referencia: 'REF-123456', fecha_solicitud: '2024-01-10', fecha_pago: '2024-01-15' },
    { id: 2, folio: 'PAG-2024-0002', cliente_id: 2, cliente: 'Carlos Gómez', cliente_nombre: 'Carlos Gómez', cliente_email: 'carlos.gomez@example.com', concepto: 'Calibración de Equipos', detalle: 'Calibración de 3 balanzas', monto: 8500, estado: 'pendiente', fecha_solicitud: '2024-01-20', fecha_limite: '2024-02-10' },
    { id: 3, folio: 'PAG-2024-0003', cliente_id: 1, cliente: 'Ana Pérez', cliente_nombre: 'Ana Pérez', cliente_email: 'ana.perez@example.com', concepto: 'Análisis Microbiológico', monto: 5000, estado: 'completado', metodo_pago: 'tarjeta', referencia: 'REF-789012', fecha_solicitud: '2024-01-25', fecha_pago: '2024-01-28' }
  ]
}

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

const showToast = (message: string, type: ToastType = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title || type.charAt(0).toUpperCase() + type.slice(1)
  toastType.value = type
  if (toastInstance) toastInstance.hide()
  if (toastEl.value) {
    import('bootstrap').then(bootstrap => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 3000 })
      toastInstance.show()
    })
  }
}

const toastClass = computed(() => ({ success: 'bg-success text-white border-0', info: 'bg-info text-white border-0', warning: 'bg-warning text-dark border-0', error: 'bg-danger text-white border-0' }[toastType.value] || 'bg-info text-white border-0'))
const toastIcon = computed(() => ({ success: 'bi bi-check-circle', info: 'bi bi-info-circle', warning: 'bi bi-exclamation-triangle', error: 'bi bi-x-circle' }[toastType.value] || 'bi bi-info-circle'))
const toastBodyIcon = computed(() => ({ success: 'bi bi-check-circle-fill text-success', info: 'bi bi-info-circle-fill text-info', warning: 'bi bi-exclamation-triangle-fill text-warning', error: 'bi bi-x-circle-fill text-danger' }[toastType.value] || 'bi bi-info-circle-fill text-info'))

watch([searchQuery, selectedStatus, dateFrom, dateTo], () => { currentPage.value = 1 })

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  cargarDatos()
})
</script>

<style scoped>
/* Estilos - mantener consistencia con el diseño anterior */
.admin-pagos-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}
[data-bs-theme="dark"] .admin-pagos-page { background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%)); }

/* Header */
.page-header { background: var(--color-light, white); border-bottom: 1px solid var(--color-gray-light, #E9ECEF); padding: 1.5rem 0; box-shadow: 0 2px 15px var(--shadow-color, rgba(0, 0, 0, 0.08)); }
[data-bs-theme="dark"] .page-header { background: var(--color-light, #121212); border-bottom: 1px solid var(--color-gray-light, #2d2d2d); }
.breadcrumb { margin-bottom: 1rem; }
.breadcrumb-list { display: flex; align-items: center; gap: 0.5rem; padding: 0; margin: 0; list-style: none; flex-wrap: wrap; }
.breadcrumb-item { display: flex; align-items: center; gap: 0.25rem; font-size: 0.9rem; }
.breadcrumb-item.active { color: var(--color-primary, #1E9E4A); font-weight: 500; }
.breadcrumb-link { color: var(--color-gray, #6C757D); text-decoration: none; transition: color 0.3s ease; }
.breadcrumb-link:hover { color: var(--color-primary, #1E9E4A); }
.header-content { display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
.page-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--color-dark, #212529); margin: 0 0 0.5rem 0; display: flex; align-items: center; }
[data-bs-theme="dark"] .page-title { color: var(--color-dark, #F8F9FA); }
.page-subtitle { color: var(--color-gray, #6C757D); margin: 0; }

/* Quick Stats */
.quick-stats { display: flex; gap: 1rem; }
.stat-card { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.25rem; background: var(--card-bg, white); border-radius: 12px; border: 1px solid var(--color-gray-light, #E9ECEF); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); min-width: 140px; transition: transform 0.3s ease; }
[data-bs-theme="dark"] .stat-card { background: var(--card-bg, #2d2d2d); border-color: var(--color-gray-light, #2d2d2d); }
.stat-card:hover { transform: translateY(-2px); }
.stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem; }
.stat-icon.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.pendiente { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-icon.este-mes { background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%)); }
.stat-info { display: flex; flex-direction: column; }
.stat-number { font-size: 1.25rem; font-weight: 700; color: var(--color-dark, #212529); line-height: 1; }
.stat-label { font-size: 0.8rem; color: var(--color-gray, #6C757D); margin-top: 0.25rem; }

/* Panel de control */
.control-panel { padding: 2rem 0 1rem; }
.panel-card { background: var(--card-bg, white); border-radius: 16px; border: 1px solid var(--color-gray-light, #E9ECEF); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); overflow: hidden; }
.panel-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-gray-light, #E9ECEF); background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%); }
.panel-title { font-size: 1.1rem; font-weight: 600; margin: 0; color: var(--color-dark, #212529); display: flex; align-items: center; }
.panel-body { padding: 1.5rem; }
.filters-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1.5rem; }
@media (max-width: 1200px) { .filters-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .filters-grid { grid-template-columns: 1fr; } }
.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-label { font-weight: 600; font-size: 0.85rem; color: var(--color-dark, #212529); }
.search-box { position: relative; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-gray, #6C757D); }
.search-input { width: 100%; padding: 0.625rem 2rem 0.625rem 2.25rem; border: 2px solid var(--color-gray-light, #E9ECEF); border-radius: 10px; background: var(--card-bg, white); color: var(--color-dark, #212529); }
.search-input:focus { outline: none; border-color: var(--color-primary, #1E9E4A); }
.status-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.status-filter-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.75rem; border: 2px solid var(--color-gray-light, #E9ECEF); border-radius: 8px; background: var(--card-bg, white); color: var(--color-gray, #6C757D); font-size: 0.8rem; cursor: pointer; transition: all 0.3s ease; }
.status-filter-btn:hover { border-color: var(--color-primary, #1E9E4A); color: var(--color-primary, #1E9E4A); }
.status-filter-btn.active { background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%)); border-color: transparent; color: white; }
.status-count { background: rgba(0, 0, 0, 0.1); border-radius: 20px; padding: 0.125rem 0.375rem; font-size: 0.7rem; }
.date-range { display: flex; align-items: center; gap: 0.5rem; }
.date-range .form-control { flex: 1; padding: 0.625rem; border: 2px solid var(--color-gray-light, #E9ECEF); border-radius: 10px; background: var(--card-bg, white); }
.action-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }

/* Tabla */
.main-content { padding: 1rem 0 3rem; }
.table-card { background: var(--card-bg, white); border-radius: 16px; border: 1px solid var(--color-gray-light, #E9ECEF); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); overflow: hidden; }
.table-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-gray-light, #E9ECEF); display: flex; justify-content: space-between; align-items: center; }
.table-title { font-size: 1.1rem; font-weight: 600; margin: 0 0 0.25rem 0; color: var(--color-dark, #212529); display: flex; align-items: center; }
.table-subtitle { font-size: 0.8rem; color: var(--color-gray, #6C757D); margin: 0; }
.table-actions { display: flex; align-items: center; gap: 1rem; }
.pagination-info { display: flex; align-items: center; gap: 0.5rem; color: var(--color-gray, #6C757D); font-size: 0.9rem; }
.table-responsive { overflow-x: auto; }
.pagos-table { width: 100%; border-collapse: collapse; }
.pagos-table th { text-align: left; padding: 1rem; background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%); font-weight: 600; font-size: 0.85rem; color: var(--color-gray-dark, #495057); border-bottom: 1px solid var(--color-gray-light, #E9ECEF); }
.pagos-table td { padding: 1rem; border-bottom: 1px solid var(--color-gray-light, #E9ECEF); vertical-align: middle; }
.pagos-table tr:hover { background: rgba(30, 158, 74, 0.03); }
.cliente-nombre { font-weight: 600; color: var(--color-dark, #212529); }
.cliente-email { font-size: 0.75rem; color: var(--color-gray, #6C757D); }
.concepto-detalle { font-size: 0.75rem; color: var(--color-gray, #6C757D); margin-top: 0.25rem; }
.folio-number { font-weight: 700; color: var(--color-primary, #1E9E4A); font-size: 0.85rem; }
.folio-ref small { font-size: 0.7rem; color: var(--color-gray, #6C757D); }
.monto-valor { font-weight: 700; color: var(--color-primary, #1E9E4A); }
.metodo-badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.625rem; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
.metodo-tarjeta { background: #cfe2ff; color: #084298; }
.metodo-transferencia { background: #d4edda; color: #155724; }
.metodo-efectivo { background: #fff3cd; color: #856404; }
.metodo-cheque { background: #cff4fc; color: #055160; }
.estado-badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.625rem; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
.status-pending { background: #fff3cd; color: #856404; }
.status-completed { background: #d4edda; color: #155724; }
.status-cancelled { background: #f8d7da; color: #721c24; }
.status-refunded { background: #cff4fc; color: #055160; }
.btn-action { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid var(--color-gray-light, #E9ECEF); background: var(--card-bg, white); color: var(--color-gray, #6C757D); cursor: pointer; transition: all 0.3s ease; }
.btn-action.view:hover { border-color: var(--color-primary, #1E9E4A); color: var(--color-primary, #1E9E4A); }
.btn-action.edit:hover { border-color: #ffc107; color: #ffc107; }
.btn-action.send:hover { border-color: #17a2b8; color: #17a2b8; }
.btn-action.success:hover { border-color: #28a745; color: #28a745; }
.btn-action.download:hover { border-color: #17a2b8; color: #17a2b8; }

/* Paginación */
.table-footer { padding: 1.25rem 1.5rem; border-top: 1px solid var(--color-gray-light, #E9ECEF); }
.pagination-controls { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.pagination { margin: 0; }
.page-link { color: var(--color-primary, #1E9E4A); border: 1px solid var(--color-gray-light, #E9ECEF); background: var(--card-bg, white); padding: 0.5rem 0.75rem; transition: all 0.3s ease; }
.page-link:hover { background: rgba(30, 158, 74, 0.1); border-color: var(--color-primary, #1E9E4A); }
.page-item.active .page-link { background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%)); border-color: transparent; color: white; }

/* Modales */
.modal-backdrop { opacity: 0.5; }
.modal-content { border-radius: 16px; }
.form-group { margin-bottom: 1rem; }
.form-label { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.25rem; display: block; }
.form-label.required::after { content: '*'; color: #dc3545; margin-left: 0.25rem; }
.form-control, .form-select { width: 100%; padding: 0.625rem; border: 2px solid var(--color-gray-light, #E9ECEF); border-radius: 10px; background: var(--card-bg, white); color: var(--color-dark, #212529); }
.form-control:focus, .form-select:focus { outline: none; border-color: var(--color-primary, #1E9E4A); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.input-group { display: flex; align-items: center; }
.input-group-text { padding: 0.625rem; background: var(--color-gray-light, #E9ECEF); border: 2px solid var(--color-gray-light, #E9ECEF); border-radius: 10px 0 0 10px; }
.metodos-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
.metodo-checkbox { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
.pago-resumen { background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%)); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
.resumen-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--color-gray-light, #E9ECEF); }
.resumen-row .monto { color: var(--color-primary, #1E9E4A); font-size: 1.1rem; }
.detalle-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-gray-light, #E9ECEF); }
.detalle-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.detalle-section { padding: 1rem; background: rgba(76, 175, 80, 0.03); border-radius: 12px; }
.detalle-section h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--color-primary, #1E9E4A); }
.detalle-section p { margin: 0.25rem 0; font-size: 0.85rem; }
.detalle-section .monto { font-weight: 700; color: var(--color-primary, #1E9E4A); }
.notificacion-preview { border: 1px solid var(--color-gray-light, #E9ECEF); border-radius: 12px; overflow: hidden; }
.preview-header { background: var(--color-primary, #1E9E4A); color: white; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; }
.preview-body { padding: 1rem; background: var(--card-bg, white); }
.empty-state { padding: 4rem 2rem; text-align: center; }
.empty-icon { font-size: 4rem; color: var(--color-gray-light, #E9ECEF); margin-bottom: 1rem; }
.btn-primary { background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%)); border: none; padding: 0.625rem 1.25rem; border-radius: 10px; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3); }
.btn-success { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border: none; }
.btn-outline-primary { border: 2px solid var(--color-primary, #1E9E4A); color: var(--color-primary, #1E9E4A); background: transparent; }
.toast { border-radius: 10px; box-shadow: 0 8px 24px rgba(12, 18, 30, 0.08); }

@media (max-width: 992px) {
  .detalle-grid { grid-template-columns: 1fr; }
  .pagos-table th:nth-child(4), .pagos-table td:nth-child(4) { display: none; }
}
@media (max-width: 768px) {
  .header-content { flex-direction: column; align-items: flex-start; }
  .page-title { font-size: 1.5rem; }
  .quick-stats { width: 100%; overflow-x: auto; }
  .table-header { flex-direction: column; gap: 1rem; }
  .pagination-controls { flex-direction: column; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
