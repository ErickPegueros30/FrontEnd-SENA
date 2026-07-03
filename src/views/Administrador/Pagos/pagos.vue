<template>
  <div :data-bs-theme="currentTheme" class="admin-pagos-page">

    <!-- Header con breadcrumb -->
    <header class="page-header">
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
              <i class="bi bi-credit-card"></i> Gestión de Pagos
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <span class="section-eyebrow">Administración</span>
            <h1 class="page-title">Gestión de Pagos</h1>
            <p class="page-subtitle">Gestione pagos de clientes, envíe notificaciones y administre recibos</p>
          </div>

          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-icon ingresos">
                <i class="bi bi-wallet2"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">${{ formatNumber(totalIngresos) }}</span>
                <span class="stat-label">Ingresos Totales</span>
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
              <div class="stat-icon mensual">
                <i class="bi bi-calendar-month"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">${{ formatNumber(ingresosEsteMes) }}</span>
                <span class="stat-label">Este Mes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Panel de Filtros -->
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
                    placeholder="Buscar por cliente, concepto, folio..."
                    @input="currentPage = 1"
                  />
                  <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''; currentPage = 1">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por estado -->
              <div class="filter-group">
                <div class="filter-chips">
                  <button
                    v-for="status in statusOptions"
                    :key="status.value"
                    class="filter-chip"
                    :class="{ 'active': selectedStatus === status.value }"
                    @click="toggleStatusFilter(status.value)"
                  >
                    <i :class="status.icon"></i>
                    <span>{{ status.label }}</span>
                    <span class="chip-count">{{ getStatusCount(status.value) }}</span>
                  </button>
                </div>
              </div>

              <!-- Filtro por fecha -->
              <div class="filter-group date-group">
                <div class="date-range">
                  <input
                    v-model="dateFrom"
                    type="date"
                    class="date-input"
                    placeholder="Desde"
                    @change="currentPage = 1"
                  />
                  <span class="date-separator">—</span>
                  <input
                    v-model="dateTo"
                    type="date"
                    class="date-input"
                    placeholder="Hasta"
                    @change="currentPage = 1"
                  />
                </div>
              </div>

              <!-- Acciones -->
              <div class="filter-group actions-group">
                <button class="action-btn secondary" @click="clearFilters" :disabled="!hasActiveFilters">
                  <i class="bi bi-arrow-counterclockwise"></i>
                  <span>Limpiar</span>
                </button>
                <button class="action-btn secondary" @click="exportPagos">
                  <i class="bi bi-download"></i>
                  <span>Exportar</span>
                </button>
                <button class="action-btn primary" @click="openSolicitarPagoModal">
                  <i class="bi bi-plus-lg"></i>
                  <span>Solicitar Pago</span>
                </button>
              </div>
            </div>

            <!-- Filtros activos -->
            <div class="active-filters" v-if="hasActiveFilters">
              <span class="active-filters-label">Filtros activos:</span>
              <span v-if="searchQuery" class="active-filter-tag">
                Búsqueda: "{{ searchQuery }}"
                <button @click="searchQuery = ''; currentPage = 1"><i class="bi bi-x"></i></button>
              </span>
              <span v-if="selectedStatus" class="active-filter-tag">
                Estado: {{ getEstadoLabel(selectedStatus) }}
                <button @click="selectedStatus = null; currentPage = 1"><i class="bi bi-x"></i></button>
              </span>
              <span v-if="dateFrom" class="active-filter-tag">
                Desde: {{ formatDate(dateFrom) }}
                <button @click="dateFrom = ''; currentPage = 1"><i class="bi bi-x"></i></button>
              </span>
              <span v-if="dateTo" class="active-filter-tag">
                Hasta: {{ formatDate(dateTo) }}
                <button @click="dateTo = ''; currentPage = 1"><i class="bi bi-x"></i></button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de Pagos -->
    <main class="table-section">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">Registro de Pagos</h4>
              <p class="table-subtitle">
                Mostrando {{ paginatedPagos.length }} de {{ filteredPagos.length }} registros
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
              <table class="pagos-table">
                <thead>
                  <tr>
                    <th class="col-cliente">Cliente</th>
                    <th class="col-concepto">Concepto</th>
                    <th class="col-folio">Folio / Referencia</th>
                    <th class="col-fecha">Fecha</th>
                    <th class="col-monto">Monto</th>
                    <th class="col-metodo">Método</th>
                    <th class="col-estado">Estado</th>
                    <th class="col-acciones">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pago in paginatedPagos" :key="pago.id">
                    <td>
                      <div class="cliente-cell">
                        <div class="cliente-avatar" :style="{ background: getClienteColor(pago.cliente_id) }">
                          {{ getClienteIniciales(pago) }}
                        </div>
                        <div class="cliente-info">
                          <span class="cliente-nombre">{{ pago.cliente_nombre || pago.cliente }}</span>
                          <span class="cliente-email">{{ pago.cliente_email }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="concepto-cell">
                        <strong>{{ pago.concepto }}</strong>
                        <div class="concepto-detalle" v-if="pago.detalle">
                          {{ truncateText(pago.detalle, 40) }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="folio-number">#{{ pago.folio || pago.id }}</span>
                      <div class="folio-ref" v-if="pago.referencia">
                        <small>{{ pago.referencia }}</small>
                      </div>
                    </td>
                    <td>
                      <div class="fecha-info">
                        <span class="fecha-text">{{ formatDate(pago.fecha_solicitud || pago.createdAt) }}</span>
                        <span v-if="pago.fecha_pago" class="fecha-pago">
                          Pagado: {{ formatDate(pago.fecha_pago) }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span class="monto-valor">${{ formatNumber(pago.monto) }}</span>
                    </td>
                    <td>
                      <span v-if="pago.metodo_pago" class="metodo-badge" :class="getMetodoClass(pago.metodo_pago)">
                        <i :class="getMetodoIcon(pago.metodo_pago)"></i>
                        {{ getMetodoLabel(pago.metodo_pago) }}
                      </span>
                      <span v-else class="text-muted">—</span>
                    </td>
                    <td>
                      <span class="estado-badge" :class="getEstadoClass(pago.estado)">
                        <i :class="getEstadoIcon(pago.estado)"></i>
                        {{ getEstadoLabel(pago.estado) }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="icon-btn" @click="verDetalle(pago)" title="Ver detalles">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button
                          v-if="pago.estado === 'pendiente'"
                          class="icon-btn"
                          @click="enviarNotificacion(pago)"
                          title="Enviar notificación"
                        >
                          <i class="bi bi-envelope"></i>
                        </button>
                        <button
                          v-if="pago.estado === 'pendiente'"
                          class="icon-btn success"
                          @click="registrarPago(pago)"
                          title="Registrar pago"
                        >
                          <i class="bi bi-check-circle"></i>
                        </button>
                        <button
                          v-if="pago.estado === 'completado'"
                          class="icon-btn download"
                          @click="descargarRecibo(pago)"
                          title="Descargar recibo"
                        >
                          <i class="bi bi-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Estado vacío -->
                  <tr v-if="filteredPagos.length === 0">
                    <td colspan="8" class="empty-row">
                      <div class="empty-content">
                        <i class="bi bi-receipt empty-icon"></i>
                        <h5>No se encontraron pagos</h5>
                        <p>No hay registros que coincidan con los filtros aplicados</p>
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
            <div v-for="pago in paginatedPagos" :key="pago.id" class="pago-card">
              <div class="card-header">
                <div class="cliente-section">
                  <div class="cliente-avatar" :style="{ background: getClienteColor(pago.cliente_id) }">
                    {{ getClienteIniciales(pago) }}
                  </div>
                  <div class="cliente-details">
                    <h5>{{ pago.cliente_nombre || pago.cliente }}</h5>
                    <span class="cliente-email">{{ pago.cliente_email }}</span>
                  </div>
                </div>
                <span class="estado-badge" :class="getEstadoClass(pago.estado)">
                  {{ getEstadoLabel(pago.estado) }}
                </span>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <span class="info-label">Concepto</span>
                  <span class="info-value">{{ pago.concepto }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Folio</span>
                  <span class="info-value folio-number">#{{ pago.folio || pago.id }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Monto</span>
                  <span class="info-value monto-valor">${{ formatNumber(pago.monto) }}</span>
                </div>
                <div class="info-row" v-if="pago.metodo_pago">
                  <span class="info-label">Método</span>
                  <span class="info-value">{{ getMetodoLabel(pago.metodo_pago) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Fecha</span>
                  <span class="info-value">{{ formatDate(pago.fecha_solicitud || pago.createdAt) }}</span>
                </div>
              </div>
              <div class="card-footer">
                <button class="icon-btn" @click="verDetalle(pago)" title="Ver detalles">
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  v-if="pago.estado === 'pendiente'"
                  class="icon-btn"
                  @click="enviarNotificacion(pago)"
                  title="Enviar notificación"
                >
                  <i class="bi bi-envelope"></i>
                </button>
                <button
                  v-if="pago.estado === 'pendiente'"
                  class="icon-btn success"
                  @click="registrarPago(pago)"
                  title="Registrar pago"
                >
                  <i class="bi bi-check-circle"></i>
                </button>
                <button
                  v-if="pago.estado === 'completado'"
                  class="icon-btn download"
                  @click="descargarRecibo(pago)"
                  title="Descargar recibo"
                >
                  <i class="bi bi-download"></i>
                </button>
              </div>
            </div>

            <!-- Estado vacío móvil -->
            <div v-if="filteredPagos.length === 0" class="empty-card">
              <div class="empty-icon">
                <i class="bi bi-receipt"></i>
              </div>
              <h5>No se encontraron pagos</h5>
              <p>No hay registros que coincidan con los filtros aplicados</p>
              <button class="action-btn secondary" @click="clearFilters">
                <i class="bi bi-arrow-counterclockwise"></i>
                <span>Limpiar filtros</span>
              </button>
            </div>
          </div>

          <!-- Paginación -->
          <div class="table-footer" v-if="filteredPagos.length > 0">
            <div class="pagination-wrapper">
              <button
                class="page-btn"
                :disabled="currentPage === 1"
                @click="currentPage = 1"
                title="Primera página"
              >
                <i class="bi bi-chevron-double-left"></i>
              </button>
              <button
                class="page-btn"
                :disabled="currentPage === 1"
                @click="prevPage"
                title="Anterior"
              >
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

              <button
                class="page-btn"
                :disabled="currentPage === totalPages"
                @click="nextPage"
                title="Siguiente"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
              <button
                class="page-btn"
                :disabled="currentPage === totalPages"
                @click="currentPage = totalPages"
                title="Última página"
              >
                <i class="bi bi-chevron-double-right"></i>
              </button>
            </div>
            <div class="page-info">
              <span>Página {{ currentPage }} de {{ totalPages }}</span>
              <span class="page-info-separator">•</span>
              <span>{{ startItem }}-{{ endItem }} de {{ filteredPagos.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal: Solicitar Pago -->
    <Teleport to="body">
      <div v-if="showSolicitarModal" class="modal-overlay" @click.self="closeSolicitarModal">
        <div class="modal-container form-modal">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-send-fill"></i>
              Solicitar Pago a Cliente
            </h5>
            <button class="modal-close-btn" @click="closeSolicitarModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitSolicitarPago">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label">Cliente *</label>
                  <select v-model="nuevaSolicitud.cliente_id" class="form-select" required>
                    <option value="">Seleccione un cliente</option>
                    <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                      {{ cliente.nombre }} {{ cliente.apellido }} - {{ cliente.email }}
                    </option>
                  </select>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Concepto *</label>
                  <input v-model="nuevaSolicitud.concepto" type="text" class="form-input" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Monto *</label>
                  <div class="input-with-prefix">
                    <span class="input-prefix">$</span>
                    <input v-model.number="nuevaSolicitud.monto" type="number" class="form-input" step="0.01" min="1" required>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Fecha Límite</label>
                  <input v-model="nuevaSolicitud.fecha_limite" type="date" class="form-input" :min="minDate">
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Detalle</label>
                  <textarea v-model="nuevaSolicitud.detalle" class="form-input" rows="2"></textarea>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Métodos de Pago Aceptados</label>
                  <div class="metodos-grid">
                    <label v-for="metodo in metodosPago" :key="metodo.value" class="metodo-checkbox">
                      <input type="checkbox" :value="metodo.value" v-model="nuevaSolicitud.metodos_aceptados">
                      <i :class="metodo.icon"></i>
                      {{ metodo.label }}
                    </label>
                  </div>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Notas Adicionales</label>
                  <textarea v-model="nuevaSolicitud.notas" class="form-input" rows="2" placeholder="Instrucciones para el pago..."></textarea>
                </div>
              </div>

              <div class="info-box">
                <i class="bi bi-info-circle-fill"></i>
                <span>Se enviará una notificación por correo electrónico al cliente con los detalles del pago solicitado.</span>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="closeSolicitarModal">Cancelar</button>
            <button class="modal-btn primary" @click="submitSolicitarPago" :disabled="submitting || !isSolicitudValid">
              <i v-if="submitting" class="bi bi-hourglass-split"></i>
              <i v-else class="bi bi-send"></i>
              {{ submitting ? 'Enviando...' : 'Enviar Solicitud' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Registrar Pago -->
    <Teleport to="body">
      <div v-if="showRegistrarModal" class="modal-overlay" @click.self="closeRegistrarModal">
        <div class="modal-container">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-check-circle-fill"></i>
              Registrar Pago
            </h5>
            <button class="modal-close-btn" @click="closeRegistrarModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="pago-resumen" v-if="pagoSeleccionado">
              <div class="resumen-row">
                <span>Cliente:</span>
                <strong>{{ pagoSeleccionado.cliente_nombre || pagoSeleccionado.cliente }}</strong>
              </div>
              <div class="resumen-row">
                <span>Concepto:</span>
                <strong>{{ pagoSeleccionado.concepto }}</strong>
              </div>
              <div class="resumen-row">
                <span>Monto:</span>
                <strong class="monto-highlight">${{ formatNumber(pagoSeleccionado.monto) }}</strong>
              </div>
            </div>

            <form @submit.prevent="submitRegistrarPago">
              <div class="form-group">
                <label class="form-label">Método de Pago *</label>
                <select v-model="registroPago.metodo_pago" class="form-select" required>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Referencia / Número de Operación</label>
                <input v-model="registroPago.referencia" type="text" class="form-input">
              </div>

              <div class="form-group">
                <label class="form-label">Fecha de Pago</label>
                <input v-model="registroPago.fecha_pago" type="date" class="form-input" :max="maxDate">
              </div>

              <div class="form-group">
                <label class="form-label">Notas Internas</label>
                <textarea v-model="registroPago.notas" class="form-input" rows="2"></textarea>
              </div>

              <div class="form-check-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="registroPago.enviar_recibo">
                  <span>Enviar recibo por correo electrónico al cliente</span>
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="closeRegistrarModal">Cancelar</button>
            <button class="modal-btn primary" @click="submitRegistrarPago" :disabled="submitting">
              <i v-if="submitting" class="bi bi-hourglass-split"></i>
              <i v-else class="bi bi-check-circle"></i>
              {{ submitting ? 'Procesando...' : 'Registrar Pago' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Detalle del Pago -->
    <Teleport to="body">
      <div v-if="showDetalleModal" class="modal-overlay" @click.self="closeDetalleModal">
        <div class="modal-container detail-modal">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-receipt"></i>
              Detalle del Pago
            </h5>
            <button class="modal-close-btn" @click="closeDetalleModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body" v-if="pagoSeleccionado">
            <div class="detalle-header">
              <div class="folio-section">
                <span class="folio-label">Folio</span>
                <span class="folio-number">#{{ pagoSeleccionado.folio || pagoSeleccionado.id }}</span>
              </div>
              <span class="estado-badge" :class="getEstadoClass(pagoSeleccionado.estado)">
                {{ getEstadoLabel(pagoSeleccionado.estado) }}
              </span>
            </div>

            <div class="detalle-grid">
              <div class="detalle-section">
                <h6 class="detalle-section-title"><i class="bi bi-person"></i> Cliente</h6>
                <div class="detalle-item">
                  <span class="detalle-label">Nombre</span>
                  <span class="detalle-value">{{ pagoSeleccionado.cliente_nombre || pagoSeleccionado.cliente }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Email</span>
                  <span class="detalle-value">{{ pagoSeleccionado.cliente_email }}</span>
                </div>
                <div class="detalle-item" v-if="pagoSeleccionado.cliente_telefono">
                  <span class="detalle-label">Teléfono</span>
                  <span class="detalle-value">{{ pagoSeleccionado.cliente_telefono }}</span>
                </div>
              </div>

              <div class="detalle-section">
                <h6 class="detalle-section-title"><i class="bi bi-info-circle"></i> Concepto</h6>
                <div class="detalle-item">
                  <span class="detalle-label">Concepto</span>
                  <span class="detalle-value">{{ pagoSeleccionado.concepto }}</span>
                </div>
                <div class="detalle-item" v-if="pagoSeleccionado.detalle">
                  <span class="detalle-label">Detalle</span>
                  <span class="detalle-value">{{ pagoSeleccionado.detalle }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Monto</span>
                  <span class="detalle-value monto-highlight">${{ formatNumber(pagoSeleccionado.monto) }}</span>
                </div>
              </div>

              <div class="detalle-section">
                <h6 class="detalle-section-title"><i class="bi bi-calendar"></i> Fechas</h6>
                <div class="detalle-item">
                  <span class="detalle-label">Solicitado</span>
                  <span class="detalle-value">{{ formatFullDate(pagoSeleccionado.fecha_solicitud || pagoSeleccionado.createdAt) }}</span>
                </div>
                <div class="detalle-item" v-if="pagoSeleccionado.fecha_limite">
                  <span class="detalle-label">Límite</span>
                  <span class="detalle-value">{{ formatFullDate(pagoSeleccionado.fecha_limite) }}</span>
                </div>
                <div class="detalle-item" v-if="pagoSeleccionado.fecha_pago">
                  <span class="detalle-label">Pagado</span>
                  <span class="detalle-value">{{ formatFullDate(pagoSeleccionado.fecha_pago) }}</span>
                </div>
              </div>

              <div class="detalle-section" v-if="pagoSeleccionado.metodo_pago">
                <h6 class="detalle-section-title"><i class="bi bi-credit-card"></i> Pago</h6>
                <div class="detalle-item">
                  <span class="detalle-label">Método</span>
                  <span class="detalle-value">{{ getMetodoLabel(pagoSeleccionado.metodo_pago) }}</span>
                </div>
                <div class="detalle-item" v-if="pagoSeleccionado.referencia">
                  <span class="detalle-label">Referencia</span>
                  <span class="detalle-value">{{ pagoSeleccionado.referencia }}</span>
                </div>
              </div>
            </div>

            <div class="detalle-section full-width mt-3" v-if="pagoSeleccionado.notas">
              <h6 class="detalle-section-title"><i class="bi bi-chat-text"></i> Notas</h6>
              <p class="detalle-notas">{{ pagoSeleccionado.notas }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="closeDetalleModal">Cerrar</button>
            <button
              v-if="pagoSeleccionado?.estado === 'completado'"
              class="modal-btn primary"
              @click="descargarRecibo(pagoSeleccionado)"
            >
              <i class="bi bi-download"></i> Descargar Recibo
            </button>
            <button
              v-if="pagoSeleccionado?.estado === 'pendiente'"
              class="modal-btn primary"
              @click="registrarPago(pagoSeleccionado)"
            >
              <i class="bi bi-check-circle"></i> Registrar Pago
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Enviar Notificación -->
    <Teleport to="body">
      <div v-if="showNotificacionModal" class="modal-overlay" @click.self="closeNotificacionModal">
        <div class="modal-container">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-envelope-fill"></i>
              Enviar Notificación
            </h5>
            <button class="modal-close-btn" @click="closeNotificacionModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="notificacion-preview">
              <div class="preview-header">
                <i class="bi bi-envelope-fill"></i>
                <span>Recordatorio de Pago Pendiente</span>
              </div>
              <div class="preview-body">
                <div class="preview-row">
                  <span>Para:</span>
                  <strong>{{ pagoSeleccionado?.cliente_nombre || pagoSeleccionado?.cliente }}</strong>
                </div>
                <div class="preview-row">
                  <span>Email:</span>
                  <strong>{{ pagoSeleccionado?.cliente_email }}</strong>
                </div>
                <div class="preview-divider"></div>
                <p>Estimado(a) {{ pagoSeleccionado?.cliente_nombre?.split(' ')[0] || 'cliente' }},</p>
                <p>Le recordamos que tiene un pago pendiente:</p>
                <div class="preview-highlight">
                  <strong>{{ pagoSeleccionado?.concepto }}</strong>
                  <span class="preview-monto">${{ formatNumber(pagoSeleccionado?.monto) }}</span>
                </div>
                <p v-if="pagoSeleccionado?.fecha_limite">
                  Fecha límite: <strong>{{ formatDate(pagoSeleccionado.fecha_limite) }}</strong>
                </p>
                <p>Por favor realice su pago a la brevedad.</p>
                <div class="preview-divider"></div>
                <p class="preview-footer-text">Atentamente,<br>Equipo SENA Laboratorios</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="closeNotificacionModal">Cancelar</button>
            <button class="modal-btn primary" @click="submitEnviarNotificacion" :disabled="submitting">
              <i v-if="submitting" class="bi bi-hourglass-split"></i>
              <i v-else class="bi bi-send"></i>
              {{ submitting ? 'Enviando...' : 'Enviar Notificación' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast de Notificaciones -->
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
import { ref, computed, onMounted, type Ref } from 'vue'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'error' | 'warning' | 'info'

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado de filtros
const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)
const dateFrom = ref('')
const dateTo = ref('')
const showFilters = ref(true)

// Paginación
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

// Formulario solicitar pago
const nuevaSolicitud = ref({
  cliente_id: '',
  concepto: '',
  detalle: '',
  monto: null as number | null,
  fecha_limite: '',
  metodos_aceptados: [] as string[],
  notas: ''
})

// Formulario registrar pago
const registroPago = ref({
  metodo_pago: 'transferencia',
  referencia: '',
  fecha_pago: new Date().toISOString().split('T')[0],
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
const hasActiveFilters = computed(() => !!(searchQuery.value || selectedStatus.value || dateFrom.value || dateTo.value))

const totalIngresos = computed(() =>
  pagos.value.filter(p => p.estado === 'completado').reduce((sum, p) => sum + (p.monto || 0), 0)
)

const totalPendiente = computed(() =>
  pagos.value.filter(p => p.estado === 'pendiente').reduce((sum, p) => sum + (p.monto || 0), 0)
)

const ingresosEsteMes = computed(() => {
  const now = new Date()
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
  return pagos.value
    .filter(p => p.estado === 'completado' && new Date(p.fecha_pago) >= inicioMes)
    .reduce((sum, p) => sum + (p.monto || 0), 0)
})

const isSolicitudValid = computed(() => {
  return nuevaSolicitud.value.cliente_id &&
    nuevaSolicitud.value.concepto &&
    nuevaSolicitud.value.monto &&
    nuevaSolicitud.value.monto > 0
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
    const dateA = new Date(a.fecha_solicitud || a.createdAt || a.fecha_pago).getTime()
    const dateB = new Date(b.fecha_solicitud || b.createdAt || b.fecha_pago).getTime()
    return dateB - dateA
  })

  return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPagos.value.length / itemsPerPage.value)))

const paginatedPagos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredPagos.value.slice(start, start + itemsPerPage.value)
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
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredPagos.value.length))
const minDate = computed(() => new Date().toISOString().split('T')[0])
const maxDate = computed(() => new Date().toISOString().split('T')[0])

// Métodos de ayuda
const formatNumber = (value: number) =>
  value?.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'

const formatDate = (date: string) =>
  date ? new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

const formatFullDate = (date: string) =>
  date ? new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''

const truncateText = (text: string, max: number) =>
  text?.length > max ? text.substring(0, max) + '...' : text || ''

const getEstadoLabel = (status: string) => {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    completado: 'Completado',
    cancelado: 'Cancelado',
    reembolsado: 'Reembolsado'
  }
  return labels[status] || status
}

const getEstadoClass = (status: string) => {
  const classes: Record<string, string> = {
    pendiente: 'status-pending',
    completado: 'status-completed',
    cancelado: 'status-cancelled',
    reembolsado: 'status-refunded'
  }
  return classes[status] || 'status-pending'
}

const getEstadoIcon = (status: string) => {
  const icons: Record<string, string> = {
    pendiente: 'bi bi-clock',
    completado: 'bi bi-check-circle',
    cancelado: 'bi bi-x-circle',
    reembolsado: 'bi bi-arrow-return-left'
  }
  return icons[status] || 'bi bi-clock'
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
  return classes[metodo] || ''
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

const getStatusCount = (status: string) =>
  pagos.value.filter(p => p.estado === status).length

const getClienteColor = (clienteId: number) => {
  const colors = ['#5d8a2f', '#4a7b22', '#8a9e7c', '#6b8a4a', '#7a9a5a']
  return colors[clienteId % colors.length]
}

const getClienteIniciales = (pago: any) => {
  const nombre = pago.cliente_nombre || pago.cliente || ''
  return nombre.split(' ').map((p: string) => p[0] || '').slice(0, 2).join('').toUpperCase()
}

// Filtros y paginación
const toggleStatusFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = null
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// Acciones de modales
const verDetalle = (pago: any) => {
  pagoSeleccionado.value = pago
  showDetalleModal.value = true
}

const closeDetalleModal = () => {
  showDetalleModal.value = false
  pagoSeleccionado.value = null
}

const openSolicitarPagoModal = () => {
  nuevaSolicitud.value = {
    cliente_id: '',
    concepto: '',
    detalle: '',
    monto: null,
    fecha_limite: '',
    metodos_aceptados: [],
    notas: ''
  }
  showSolicitarModal.value = true
}

const closeSolicitarModal = () => {
  showSolicitarModal.value = false
}

const submitSolicitarPago = () => {
  if (!isSolicitudValid.value) {
    showToast('Complete los campos requeridos', 'warning', 'Validación')
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
    showToast(`Solicitud enviada a ${cliente?.nombre}`, 'success', 'Solicitud Enviada')
    closeSolicitarModal()
    submitting.value = false
  }, 1000)
}

const registrarPago = (pago: any) => {
  pagoSeleccionado.value = pago
  registroPago.value = {
    metodo_pago: 'transferencia',
    referencia: '',
    fecha_pago: new Date().toISOString().split('T')[0],
    notas: '',
    enviar_recibo: true
  }
  showRegistrarModal.value = true
}

const closeRegistrarModal = () => {
  showRegistrarModal.value = false
  pagoSeleccionado.value = null
}

const submitRegistrarPago = () => {
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
      showToast(`Pago de $${formatNumber(pagoSeleccionado.value.monto)} registrado`, 'success', 'Pago Registrado')
      if (registroPago.value.enviar_recibo) {
        setTimeout(() => showToast('Recibo enviado al correo del cliente', 'info', 'Correo Enviado'), 500)
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

const closeNotificacionModal = () => {
  showNotificacionModal.value = false
  pagoSeleccionado.value = null
}

const submitEnviarNotificacion = () => {
  submitting.value = true
  setTimeout(() => {
    showToast(`Notificación enviada a ${pagoSeleccionado.value.cliente_nombre}`, 'success', 'Notificación Enviada')
    closeNotificacionModal()
    submitting.value = false
  }, 1000)
}

const descargarRecibo = (pago: any) => {
  const contenido = `RECIBO DE PAGO OFICIAL - SENA LABORATORIOS

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

  const blob = new Blob([contenido], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Recibo_${pago.folio || pago.id}_${new Date().toISOString().split('T')[0]}.pdf`
  link.click()
  URL.revokeObjectURL(url)
  showToast('Recibo descargado correctamente', 'success', 'Descarga Completada')
}

const exportPagos = () => {
  const headers = ['Folio', 'Cliente', 'Email', 'Concepto', 'Monto', 'Estado', 'Fecha Solicitud', 'Fecha Pago']
  const rows = filteredPagos.value.map(p => [
    p.folio || p.id,
    p.cliente_nombre || p.cliente,
    p.cliente_email,
    p.concepto,
    p.monto,
    getEstadoLabel(p.estado),
    formatDate(p.fecha_solicitud || p.createdAt),
    formatDate(p.fecha_pago)
  ])
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `pagos-sena-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast('Exportación completada', 'success', 'Exportado')
}

// Almacenamiento local
const guardarEnLocalStorage = () => {
  const data = localStorage.getItem('mock_admin_data')
  const mockData = data ? JSON.parse(data) : {}
  mockData.pagos = pagos.value
  localStorage.setItem('mock_admin_data', JSON.stringify(mockData))
}

const cargarDatos = () => {
  const adminData = localStorage.getItem('mock_admin_data')
  if (adminData) {
    const data = JSON.parse(adminData)
    if (data.pagos?.length) {
      pagos.value = data.pagos
    } else {
      cargarPagosMock()
    }
  } else {
    cargarPagosMock()
  }

  const clientesData = localStorage.getItem('clientes_mock')
  if (clientesData) {
    clientes.value = JSON.parse(clientesData)
  } else {
    clientes.value = [
      { id: 1, nombre: 'Ana', apellido: 'Pérez García', email: 'ana.perez@sena.com', telefono: '555-1234' },
      { id: 2, nombre: 'Carlos', apellido: 'Gómez López', email: 'carlos.gomez@sena.com', telefono: '555-5678' },
      { id: 3, nombre: 'María', apellido: 'González Hernández', email: 'maria.gonzalez@cliente.com', telefono: '555-9012' },
      { id: 4, nombre: 'Roberto', apellido: 'Sánchez Díaz', email: 'roberto.sanchez@institucion.edu', telefono: '555-3456' }
    ]
    localStorage.setItem('clientes_mock', JSON.stringify(clientes.value))
  }
}

const cargarPagosMock = () => {
  pagos.value = [
    {
      id: 1,
      folio: 'PAG-2024-0001',
      cliente_id: 1,
      cliente: 'Ana Pérez García',
      cliente_nombre: 'Ana Pérez García',
      cliente_email: 'ana.perez@sena.com',
      concepto: 'Análisis Químico - Lote 2024-001',
      detalle: 'Análisis de 5 muestras de agua potable',
      monto: 12500,
      estado: 'completado',
      metodo_pago: 'transferencia',
      referencia: 'REF-123456',
      fecha_solicitud: '2024-01-10',
      fecha_pago: '2024-01-15'
    },
    {
      id: 2,
      folio: 'PAG-2024-0002',
      cliente_id: 2,
      cliente: 'Carlos Gómez López',
      cliente_nombre: 'Carlos Gómez López',
      cliente_email: 'carlos.gomez@sena.com',
      concepto: 'Calibración de Equipos',
      detalle: 'Calibración de 3 balanzas analíticas',
      monto: 8500,
      estado: 'pendiente',
      fecha_solicitud: '2024-01-20',
      fecha_limite: '2024-02-10'
    },
    {
      id: 3,
      folio: 'PAG-2024-0003',
      cliente_id: 3,
      cliente: 'María González Hernández',
      cliente_nombre: 'María González Hernández',
      cliente_email: 'maria.gonzalez@cliente.com',
      concepto: 'Análisis Microbiológico',
      detalle: 'Análisis de 10 muestras de alimentos',
      monto: 15000,
      estado: 'completado',
      metodo_pago: 'tarjeta',
      referencia: 'REF-789012',
      fecha_solicitud: '2024-01-25',
      fecha_pago: '2024-01-28'
    },
    {
      id: 4,
      folio: 'PAG-2024-0004',
      cliente_id: 4,
      cliente: 'Roberto Sánchez Díaz',
      cliente_nombre: 'Roberto Sánchez Díaz',
      cliente_email: 'roberto.sanchez@institucion.edu',
      concepto: 'Ensayo de Aptitud - Dimensional',
      detalle: 'Programa de medición dimensional básica',
      monto: 6200,
      estado: 'pendiente',
      fecha_solicitud: '2024-02-01',
      fecha_limite: '2024-02-20'
    },
    {
      id: 5,
      folio: 'PAG-2024-0005',
      cliente_id: 1,
      cliente: 'Ana Pérez García',
      cliente_nombre: 'Ana Pérez García',
      cliente_email: 'ana.perez@sena.com',
      concepto: 'Análisis de Agua Residual',
      detalle: 'Muestreo y análisis de 3 puntos',
      monto: 9800,
      estado: 'completado',
      metodo_pago: 'transferencia',
      referencia: 'REF-345678',
      fecha_solicitud: '2024-02-05',
      fecha_pago: '2024-02-08'
    }
  ]
}

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: ToastType = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title || type.charAt(0).toUpperCase() + type.slice(1)
  toastType.value = type
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 4000)
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

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  cargarDatos()
})
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-text: #1c2b14;
  --sena-muted: #5a6a52;
  --sena-border: rgba(93, 138, 47, 0.14);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
}

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ============================================================
   BASE
   ============================================================ */
.admin-pagos-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .admin-pagos-page {
  background: #0c0f0a;
  color: #e8ede3;
}

/* ============================================================
   HEADER
   ============================================================ */
.page-header {
  background: #ffffff;
  border-bottom: 1px solid var(--sena-border);
  padding: 2rem 0 1.5rem;
}

[data-bs-theme="dark"] .page-header {
  background: #0e1509;
  border-bottom-color: rgba(122,171,61,0.12);
}

.breadcrumb-nav { margin-bottom: 1.5rem; }

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 0.82rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--sena-muted);
}

.breadcrumb-item.active {
  color: var(--sena-green);
  font-weight: 600;
}

.breadcrumb-link {
  color: var(--sena-muted);
  text-decoration: none;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.breadcrumb-link:hover { color: var(--sena-green); }

.breadcrumb-separator {
  color: #c0c8b8;
  font-size: 0.65rem;
}

[data-bs-theme="dark"] .breadcrumb-separator { color: #4a5a40; }

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  flex-wrap: wrap;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  background: var(--sena-green-pale);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .section-eyebrow {
  background: rgba(93,138,47,0.18);
  color: var(--sena-green-light);
}

.page-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--sena-text);
  margin: 0.25rem 0 0.35rem;
}

[data-bs-theme="dark"] .page-title { color: #f0f5ea; }

.page-subtitle {
  color: var(--sena-muted);
  font-size: 0.9rem;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.25rem;
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-lg);
  min-width: 160px;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

[data-bs-theme="dark"] .stat-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  color: #ffffff;
}

.stat-icon.ingresos { background: linear-gradient(135deg, #5d8a2f, #7aab3d); }
.stat-icon.pendiente { background: linear-gradient(135deg, #e6a817, #f0c040); }
.stat-icon.mensual { background: linear-gradient(135deg, #4a6b22, #5d8a2f); }

.stat-info { display: flex; flex-direction: column; }
.stat-number {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--sena-text);
  line-height: 1;
}

[data-bs-theme="dark"] .stat-number { color: #e0ecd6; }

.stat-label {
  font-size: 0.78rem;
  color: var(--sena-muted);
  margin-top: 0.2rem;
}

/* ============================================================
   CONTROL SECTION
   ============================================================ */
.control-section {
  padding: 1.5rem 0 0.5rem;
}

.control-card {
  background: #ffffff;
  border-radius: var(--radius-xl);
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

[data-bs-theme="dark"] .control-card {
  background: #0e1509;
  border-color: rgba(122,171,61,0.12);
}

.control-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--sena-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--sena-text);
  margin: 0;
}

[data-bs-theme="dark"] .control-title { color: #e0ecd6; }

.btn-collapse {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1.5px solid #e0e5da;
  background: #fcfdfb;
  color: var(--sena-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

[data-bs-theme="dark"] .btn-collapse {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
}

.btn-collapse:hover {
  background: var(--sena-green-pale);
  color: var(--sena-green);
}

.control-body {
  padding: 1.25rem 1.5rem;
}

.filters-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-group { display: flex; align-items: center; }
.search-group { flex: 1; min-width: 220px; }

.search-box {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--sena-muted);
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 0.65rem 0.85rem 0.65rem 2.5rem;
  border: 1.5px solid #e0e5da;
  border-radius: var(--radius-md);
  background: #fcfdfb;
  color: var(--sena-text);
  font-size: 0.88rem;
  font-family: var(--font-body);
  transition: var(--transition);
}

[data-bs-theme="dark"] .search-input {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #e0ecd6;
}

.search-input:focus {
  outline: none;
  border-color: var(--sena-green);
  box-shadow: 0 0 0 3px rgba(93,138,47,0.1);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--sena-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: var(--transition);
}

.clear-btn:hover { color: var(--sena-text); background: var(--sena-green-pale); }

.filter-chips {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border: 1.5px solid #e0e5da;
  border-radius: 50px;
  background: #fcfdfb;
  color: var(--sena-muted);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
}

[data-bs-theme="dark"] .filter-chip {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #8a9e7c;
}

.filter-chip:hover {
  border-color: var(--sena-green-light);
  color: var(--sena-text);
}

[data-bs-theme="dark"] .filter-chip:hover { color: #c8d8be; }

.filter-chip.active {
  background: var(--sena-green-pale);
  border-color: var(--sena-green);
  color: var(--sena-green);
  font-weight: 600;
}

[data-bs-theme="dark"] .filter-chip.active {
  background: rgba(93,138,47,0.2);
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

.chip-count {
  background: rgba(93,138,47,0.1);
  padding: 0.1rem 0.45rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
}

.date-group { gap: 0.5rem; }

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-input {
  padding: 0.55rem 0.85rem;
  border: 1.5px solid #e0e5da;
  border-radius: var(--radius-md);
  background: #fcfdfb;
  color: var(--sena-text);
  font-size: 0.85rem;
  font-family: var(--font-body);
  transition: var(--transition);
}

[data-bs-theme="dark"] .date-input {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #e0ecd6;
}

.date-input:focus {
  outline: none;
  border-color: var(--sena-green);
}

.date-separator {
  color: var(--sena-muted);
  font-size: 0.85rem;
}

.actions-group {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 1.5px solid transparent;
  font-family: var(--font-body);
  white-space: nowrap;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(93,138,47,0.25);
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(93,138,47,0.35);
}

.action-btn.secondary {
  background: #fcfdfb;
  border-color: #e0e5da;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .action-btn.secondary {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #c8d8be;
}

.action-btn.secondary:hover:not(:disabled) {
  background: var(--sena-green-pale);
  border-color: var(--sena-green);
}

/* Active filters */
.active-filters {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--sena-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.active-filters-label {
  font-size: 0.78rem;
  color: var(--sena-muted);
  font-weight: 500;
}

.active-filter-tag {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  border-radius: 50px;
  font-size: 0.75rem;
  color: var(--sena-green);
}

.active-filter-tag button {
  background: none;
  border: none;
  color: var(--sena-muted);
  cursor: pointer;
  padding: 0;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
}

.active-filter-tag button:hover { color: var(--sena-text); }

/* ============================================================
   TABLE SECTION
   ============================================================ */
.table-section {
  padding: 1rem 0 3rem;
}

.table-card {
  background: #ffffff;
  border-radius: var(--radius-xl);
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

[data-bs-theme="dark"] .table-card {
  background: #0e1509;
  border-color: rgba(122,171,61,0.12);
}

.table-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--sena-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.table-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--sena-text);
  margin: 0 0 0.2rem;
}

[data-bs-theme="dark"] .table-title { color: #e0ecd6; }

.table-subtitle {
  font-size: 0.78rem;
  color: var(--sena-muted);
  margin: 0;
}

.table-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.per-page-select {
  padding: 0.45rem 0.75rem;
  border: 1.5px solid #e0e5da;
  border-radius: var(--radius-sm);
  background: #fcfdfb;
  color: var(--sena-text);
  font-size: 0.8rem;
  font-family: var(--font-body);
  cursor: pointer;
}

[data-bs-theme="dark"] .per-page-select {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #e0ecd6;
}

/* Desktop Table */
.table-responsive { overflow-x: auto; }

.pagos-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.pagos-table thead th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--sena-muted);
  background: #f8faf7;
  border-bottom: 1.5px solid var(--sena-border);
  white-space: nowrap;
}

[data-bs-theme="dark"] .pagos-table thead th {
  background: #0a0d06;
  color: #8a9e7c;
}

.pagos-table tbody td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(93,138,47,0.06);
  vertical-align: middle;
}

.pagos-table tbody tr {
  transition: var(--transition);
}

.pagos-table tbody tr:hover {
  background: #f8faf7;
}

[data-bs-theme="dark"] .pagos-table tbody tr:hover {
  background: rgba(122,171,61,0.04);
}

.cliente-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cliente-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.cliente-info {
  display: flex;
  flex-direction: column;
}

.cliente-nombre {
  font-weight: 600;
  color: var(--sena-text);
  font-size: 0.9rem;
}

.cliente-email {
  font-size: 0.75rem;
  color: var(--sena-muted);
}

.concepto-cell strong {
  color: var(--sena-text);
  font-size: 0.88rem;
}

.concepto-detalle {
  font-size: 0.75rem;
  color: var(--sena-muted);
  margin-top: 0.2rem;
}

.folio-number {
  font-weight: 700;
  color: var(--sena-green);
  font-size: 0.85rem;
}

.folio-ref small {
  font-size: 0.72rem;
  color: var(--sena-muted);
}

.fecha-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.fecha-text {
  font-size: 0.85rem;
  color: var(--sena-muted);
}

.fecha-pago {
  font-size: 0.72rem;
  color: var(--sena-green);
}

.monto-valor {
  font-weight: 700;
  color: var(--sena-green);
  font-size: 0.95rem;
}

.metodo-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
}

.metodo-tarjeta { background: #e8f0fe; color: #1a56db; }
.metodo-transferencia { background: #e6f4ea; color: #137333; }
.metodo-efectivo { background: #fef7e0; color: #b06000; }
.metodo-cheque { background: #e0f2fe; color: #0c5460; }

[data-bs-theme="dark"] .metodo-tarjeta { background: rgba(26,86,219,0.15); color: #7baaf7; }
[data-bs-theme="dark"] .metodo-transferencia { background: rgba(19,115,51,0.15); color: #81c995; }
[data-bs-theme="dark"] .metodo-efectivo { background: rgba(176,96,0,0.15); color: #f5c26b; }
[data-bs-theme="dark"] .metodo-cheque { background: rgba(12,84,96,0.15); color: #7dd8e6; }

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-completed { background: #d4edda; color: #155724; }
.status-cancelled { background: #f8d7da; color: #721c24; }
.status-refunded { background: #cff4fc; color: #055160; }

[data-bs-theme="dark"] .status-pending { background: rgba(133,100,4,0.2); color: #ffd700; }
[data-bs-theme="dark"] .status-completed { background: rgba(21,87,36,0.2); color: #81c995; }
[data-bs-theme="dark"] .status-cancelled { background: rgba(114,28,36,0.2); color: #f5a0a0; }
[data-bs-theme="dark"] .status-refunded { background: rgba(5,81,96,0.2); color: #7dd8e6; }

.action-buttons {
  display: flex;
  gap: 0.35rem;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  border: 1.5px solid #e0e5da;
  background: #fcfdfb;
  color: var(--sena-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.85rem;
}

[data-bs-theme="dark"] .icon-btn {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #8a9e7c;
}

.icon-btn:hover {
  background: var(--sena-green-pale);
  border-color: var(--sena-green);
  color: var(--sena-green);
}

.icon-btn.success:hover {
  background: #e6f4ea;
  border-color: #28a745;
  color: #28a745;
}

.icon-btn.download:hover {
  background: #e8f0fe;
  border-color: #1a56db;
  color: #1a56db;
}

/* Mobile Cards */
.mobile-cards { display: none; }

.empty-row {
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-content {
  padding: 1rem;
}

.empty-icon {
  font-size: 3rem;
  color: #c0c8b8;
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .empty-icon { color: #4a5a40; }

.empty-content h5 {
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}

.empty-content p {
  color: var(--sena-muted);
  margin-bottom: 1.5rem;
}

/* Table Footer */
.table-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--sena-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-wrapper {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1.5px solid #e0e5da;
  background: #fcfdfb;
  color: var(--sena-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.8rem;
  font-weight: 500;
}

[data-bs-theme="dark"] .page-btn {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #c8d8be;
}

.page-btn:hover:not(:disabled) {
  background: var(--sena-green-pale);
  border-color: var(--sena-green);
}

.page-btn.active {
  background: var(--sena-green);
  border-color: var(--sena-green);
  color: #ffffff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-ellipsis {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sena-muted);
  font-size: 0.9rem;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--sena-muted);
}

.page-info-separator {
  color: #c0c8b8;
}

/* ============================================================
   MODALS
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: #ffffff;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.form-modal { max-width: 600px; }
.detail-modal { max-width: 700px; }

[data-bs-theme="dark"] .modal-container {
  background: #1a2412;
  border: 1px solid rgba(122,171,61,0.12);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--sena-border);
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 1;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.modal-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--sena-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

[data-bs-theme="dark"] .modal-title { color: #e0ecd6; }

.modal-close-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid #e0e5da;
  background: #fcfdfb;
  color: var(--sena-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

[data-bs-theme="dark"] .modal-close-btn {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
}

.modal-close-btn:hover {
  background: var(--sena-green-pale);
  color: var(--sena-text);
}

.modal-body {
  padding: 1.25rem 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--sena-border);
  position: sticky;
  bottom: 0;
  background: inherit;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

.modal-btn {
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 1.5px solid transparent;
  font-family: var(--font-body);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-btn.primary {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
}

.modal-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(93,138,47,0.3);
}

.modal-btn.secondary {
  background: #fcfdfb;
  border-color: #e0e5da;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .modal-btn.secondary {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #c8d8be;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group.full-width { grid-column: span 2; }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .form-label { color: #e0ecd6; }

.form-input,
.form-select {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e0e5da;
  border-radius: var(--radius-sm);
  background: #fcfdfb;
  color: var(--sena-text);
  font-size: 0.88rem;
  font-family: var(--font-body);
  transition: var(--transition);
}

[data-bs-theme="dark"] .form-input,
[data-bs-theme="dark"] .form-select {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #e0ecd6;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--sena-green);
  box-shadow: 0 0 0 3px rgba(93,138,47,0.1);
}

.input-with-prefix {
  display: flex;
  align-items: center;
}

.input-prefix {
  padding: 0.6rem 0.75rem;
  background: #f0f4ea;
  border: 1.5px solid #e0e5da;
  border-right: none;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  color: var(--sena-green);
  font-weight: 600;
}

.input-with-prefix .form-input {
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.metodos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.metodo-checkbox {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--sena-text);
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: #f0f4ea;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-md);
  color: var(--sena-text);
  font-size: 0.82rem;
  margin-top: 1rem;
}

.info-box i { color: var(--sena-green); flex-shrink: 0; margin-top: 0.1rem; }

[data-bs-theme="dark"] .info-box {
  background: rgba(93,138,47,0.1);
  border-color: rgba(122,171,61,0.16);
  color: #c8d8be;
}

.form-check-group {
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--sena-text);
}

.pago-resumen {
  background: #f8faf7;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(93,138,47,0.08);
  font-size: 0.88rem;
}

.resumen-row:last-child { border-bottom: none; }

.monto-highlight {
  color: var(--sena-green);
  font-size: 1.05rem;
}

.detalle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--sena-border);
}

.folio-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.folio-label {
  font-size: 0.8rem;
  color: var(--sena-muted);
}

.detalle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detalle-section {
  padding: 1rem;
  background: #f8faf7;
  border-radius: var(--radius-md);
  border: 1px solid var(--sena-border);
}

[data-bs-theme="dark"] .detalle-section {
  background: rgba(122,171,61,0.04);
}

.detalle-section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--sena-green);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
}

.detalle-label {
  font-size: 0.8rem;
  color: var(--sena-muted);
}

.detalle-value {
  font-size: 0.85rem;
  color: var(--sena-text);
  font-weight: 500;
}

.detalle-notas {
  font-size: 0.85rem;
  color: var(--sena-muted);
  margin: 0;
  line-height: 1.6;
}

.notificacion-preview {
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.preview-header {
  background: var(--sena-green);
  color: #ffffff;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.88rem;
}

.preview-body {
  padding: 1rem;
  font-size: 0.85rem;
  color: var(--sena-text);
}

.preview-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.preview-divider {
  height: 1px;
  background: var(--sena-border);
  margin: 0.75rem 0;
}

.preview-highlight {
  background: #f0f4ea;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  display: flex;
  justify-content: space-between;
  margin: 0.75rem 0;
}

.preview-monto {
  color: var(--sena-green);
  font-weight: 700;
}

.preview-footer-text {
  color: var(--sena-muted);
  font-size: 0.82rem;
}

/* ============================================================
   TOAST
   ============================================================ */
.toast-notification {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10000;
  max-width: 400px;
  animation: slideInRight 0.3s ease;
  border-left: 4px solid var(--sena-green);
}

[data-bs-theme="dark"] .toast-notification {
  background: #1a2412;
  border-left-color: #7aab3d;
}

.toast-notification.success { border-left-color: var(--sena-green); }
.toast-notification.error { border-left-color: #dc3545; }
.toast-notification.warning { border-left-color: #e6a817; }

.toast-notification > i {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-notification.success > i { color: var(--sena-green); }
.toast-notification.error > i { color: #dc3545; }
.toast-notification.warning > i { color: #e6a817; }

.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.toast-content strong {
  font-size: 0.85rem;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .toast-content strong { color: #e0ecd6; }

.toast-content span {
  font-size: 0.8rem;
  color: var(--sena-muted);
}

.toast-close {
  background: none;
  border: none;
  color: var(--sena-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: var(--transition);
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--sena-text);
  background: var(--sena-green-pale);
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1200px) {
  .header-content { flex-direction: column; align-items: flex-start; }
  .header-stats { width: 100%; }
  .stat-card { flex: 1; min-width: 140px; }
}

@media (max-width: 992px) {
  .filters-grid { flex-direction: column; align-items: stretch; }
  .actions-group { margin-left: 0; justify-content: flex-end; }
  .search-group { min-width: 100%; }
  .detalle-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .form-group.full-width { grid-column: span 1; }
}

@media (max-width: 768px) {
  .desktop-table { display: none; }
  .mobile-cards { display: block; }

  .pago-card {
    background: #fcfdfb;
    border: 1px solid var(--sena-border);
    border-radius: var(--radius-lg);
    padding: 1rem;
    margin-bottom: 0.75rem;
    transition: var(--transition);
  }

  [data-bs-theme="dark"] .pago-card {
    background: #131a0e;
    border-color: rgba(122,171,61,0.12);
  }

  .pago-card .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .cliente-section {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .cliente-details h5 {
    margin: 0;
    font-size: 0.9rem;
    color: var(--sena-text);
  }

  .cliente-details .cliente-email {
    font-size: 0.72rem;
    color: var(--sena-muted);
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem 0;
    border-top: 1px solid var(--sena-border);
    border-bottom: 1px solid var(--sena-border);
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info-label {
    font-size: 0.75rem;
    color: var(--sena-muted);
    font-weight: 500;
  }

  .info-value {
    font-size: 0.82rem;
    color: var(--sena-text);
    font-weight: 500;
  }

  .card-footer {
    display: flex;
    gap: 0.35rem;
    justify-content: flex-end;
    padding-top: 0.75rem;
  }

  .empty-card {
    text-align: center;
    padding: 2rem;
    background: #fcfdfb;
    border: 1px solid var(--sena-border);
    border-radius: var(--radius-lg);
  }

  [data-bs-theme="dark"] .empty-card {
    background: #131a0e;
  }

  .table-header { flex-direction: column; align-items: stretch; }
  .table-controls { justify-content: flex-end; }
}

@media (max-width: 480px) {
  .page-header { padding: 1.25rem 0 1rem; }
  .page-title { font-size: 1.6rem; }
  .header-stats { gap: 0.5rem; }
  .stat-card { padding: 0.75rem 1rem; min-width: 100px; }
  .stat-number { font-size: 1.2rem; }
  .control-body { padding: 1rem; }
  .table-footer { flex-direction: column; align-items: center; }
  .page-info { justify-content: center; }
  .actions-group { flex-wrap: wrap; }
  .action-btn { flex: 1; min-width: 100px; justify-content: center; }
  .modal-container { max-width: 95vw; }
  .date-range { flex-direction: column; align-items: stretch; }
  .date-separator { display: none; }
}
</style>
