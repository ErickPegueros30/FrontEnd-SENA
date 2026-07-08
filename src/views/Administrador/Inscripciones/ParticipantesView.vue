<template>
  <div :data-bs-theme="currentTheme" class="admin-participantes-page">
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
            <li class="breadcrumb-item">
              <router-link to="/admin/inscripciones" class="breadcrumb-link">
                <i class="bi bi-person-vcard"></i> Inscripciones
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i :class="itemIcon"></i> {{ itemTitle }}
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i :class="itemIcon" class="me-2"></i>{{ itemTitle }}
            </h1>
            <p class="page-subtitle">
              {{ itemDescription }} • {{ participantes.length }} participantes inscritos
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-people"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ participantes.length }}</span>
                  <span class="stat-label">Inscritos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ asistentes }}</span>
                  <span class="stat-label">Asistieron</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon pending">
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
              <i class="bi bi-funnel me-2"></i>Filtros y Gestión
            </h3>
          </div>

          <div class="panel-body">
            <div class="filters-grid">
              <!-- Búsqueda -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-search me-1"></i>Buscar participante
                </label>
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Buscar por nombre, email o documento..."
                    @input="handleSearch"
                  >
                  <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por asistencia -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-toggle-on me-1"></i>Filtrar por asistencia
                </label>
                <div class="status-filters">
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': filtroAsistencia === 'todos' }"
                    @click="filtroAsistencia = 'todos'"
                  >
                    <i class="bi bi-people"></i>
                    Todos
                  </button>
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': filtroAsistencia === 'asistio' }"
                    @click="filtroAsistencia = 'asistio'"
                  >
                    <i class="bi bi-check-circle"></i>
                    Asistieron
                  </button>
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': filtroAsistencia === 'no-asistio' }"
                    @click="filtroAsistencia = 'no-asistio'"
                  >
                    <i class="bi bi-x-circle"></i>
                    No asistieron
                  </button>
                </div>
              </div>

              <!-- Filtro por constancia -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-file-pdf me-1"></i>Constancias
                </label>
                <div class="status-filters">
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': filtroConstancia === 'todos' }"
                    @click="filtroConstancia = 'todos'"
                  >
                    Todos
                  </button>
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': filtroConstancia === 'generadas' }"
                    @click="filtroConstancia = 'generadas'"
                  >
                    <i class="bi bi-file-check"></i>
                    Generadas
                  </button>
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': filtroConstancia === 'pendientes' }"
                    @click="filtroConstancia = 'pendientes'"
                  >
                    <i class="bi bi-file-x"></i>
                    Pendientes
                  </button>
                </div>
              </div>

              <!-- Filtro por Área / Rama -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-diagram-3 me-1"></i>Área / Rama
                </label>
                <div class="catalog-filters">
                  <button
                    class="catalog-filter-btn"
                    :class="{ 'active': filtroTipoCatalogo === 'none' }"
                    @click="filtroTipoCatalogo = 'none'; selectedAreaId = null; selectedSubareaId = null; selectedRamaId = null; selectedSubramaId = null"
                  >
                    <i class="bi bi-grid"></i>
                    Todos
                  </button>
                  <button
                    class="catalog-filter-btn area"
                    :class="{ 'active': filtroTipoCatalogo === 'area' }"
                    @click="filtroTipoCatalogo = 'area'; selectedRamaId = null; selectedSubramaId = null"
                  >
                    <i class="bi bi-diagram-3"></i>
                    Área
                  </button>
                  <button
                    class="catalog-filter-btn rama"
                    :class="{ 'active': filtroTipoCatalogo === 'rama' }"
                    @click="filtroTipoCatalogo = 'rama'; selectedAreaId = null; selectedSubareaId = null"
                  >
                    <i class="bi bi-diagram-2"></i>
                    Rama
                  </button>
                </div>

                <!-- Selectores dinámicos -->
                <div v-if="filtroTipoCatalogo === 'area'" class="catalog-selectors">
                  <select class="form-select form-select-sm" v-model="selectedAreaId" @change="loadSubitems('area', Number(selectedAreaId))">
                    <option :value="null">Seleccionar Área</option>
                    <option v-for="a in areasList" :key="a.id" :value="a.id">{{ a.nombre }}</option>
                  </select>
                  <select v-if="selectedAreaId && subareasMap[selectedAreaId]?.length" class="form-select form-select-sm" v-model="selectedSubareaId">
                    <option :value="null">Todas las subáreas</option>
                    <option v-for="sa in subareasMap[selectedAreaId]" :key="sa.id" :value="sa.id">{{ sa.nombre }}</option>
                  </select>
                </div>

                <div v-if="filtroTipoCatalogo === 'rama'" class="catalog-selectors">
                  <select class="form-select form-select-sm" v-model="selectedRamaId" @change="loadSubitems('rama', Number(selectedRamaId))">
                    <option :value="null">Seleccionar Rama</option>
                    <option v-for="r in ramasList" :key="r.id" :value="r.id">{{ r.nombre }}</option>
                  </select>
                  <select v-if="selectedRamaId && subramasMap[selectedRamaId]?.length" class="form-select form-select-sm" v-model="selectedSubramaId">
                    <option :value="null">Todas las subramas</option>
                    <option v-for="sr in subramasMap[selectedRamaId]" :key="sr.id" :value="sr.id">{{ sr.nombre }}</option>
                  </select>
                </div>
              </div>

              <!-- Acciones rápidas -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-lightning me-1"></i>Acciones rápidas
                </label>
                <div class="action-buttons">
                  <button class="btn btn-outline-secondary" @click="clearFilters">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                  </button>
                  <button class="btn btn-primary" @click="exportLista">
                    <i class="bi bi-download me-1"></i>Exportar lista
                  </button>
                  <button class="btn btn-success" @click="generarConstanciasMasivas">
                    <i class="bi bi-file-pdf me-1"></i>Constancias masivas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de participantes MEJORADA -->
    <main class="main-content">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">
                <i class="bi bi-people me-2"></i>Lista de Participantes
              </h4>
              <p class="table-subtitle">
                Mostrando {{ participantesFiltrados.length }} de {{ participantes.length }} participantes
              </p>
            </div>

            <div class="table-actions">
              <div class="pagination-info">
                <span class="text-muted">Participantes por página:</span>
                <select v-model="itemsPerPage" class="form-select form-select-sm ms-2" style="width: auto;">
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>

              <div class="view-options">
                <button class="btn btn-sm btn-outline-secondary" @click="marcarTodosAsistencia" title="Marcar todos como asistieron">
                  <i class="bi bi-check-all"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click="toggleView" title="Cambiar vista">
                  <i :class="vistaCompacta ? 'bi-list-ul' : 'bi-grid-3x3-gap-fill'"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="participantes-table" :class="{ 'compact-view': vistaCompacta }">
              <thead>
                <tr>
                  <th class="participante-column">
                    <i class="bi bi-person-circle me-1"></i>
                    Participante
                  </th>
                  <th class="area-column">
                    <i class="bi bi-diagram-3 me-1"></i>
                    Área / Rama
                  </th>
                  <th class="contacto-column">
                    <i class="bi bi-envelope me-1"></i>
                    Contacto
                  </th>
                  <th class="fecha-column">
                    <i class="bi bi-calendar me-1"></i>
                    Inscripción
                  </th>
                  <th class="asistencia-column">
                    <i class="bi bi-check-circle me-1"></i>
                    Asistencia
                  </th>
                  <th class="constancia-column">
                    <i class="bi bi-file-pdf me-1"></i>
                    Constancia
                  </th>
                  <th class="actions-column">
                    <i class="bi bi-gear me-1"></i>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="participante in participantesPaginados" :key="participante.id" class="participante-row">
                  <!-- Información del participante MEJORADA -->
                  <td class="participante-cell">
                    <div class="participante-info">
                      <div class="participante-avatar">
                        <div v-if="participante.avatar" class="avatar-image">
                          <img :src="participante.avatar" :alt="participante.nombre">
                          <div class="avatar-status" :class="{ 'online': participante.asistio }"></div>
                        </div>
                        <div v-else class="avatar-initials" :style="{ background: getAvatarColor(participante.nombre) }">
                          {{ getInitials(participante.nombre) }}
                          <div class="avatar-status" :class="{ 'online': participante.asistio }"></div>
                        </div>
                      </div>
                      <div class="participante-datos">
                        <div class="participante-nombre">{{ participante.nombre }}</div>
                        <div class="participante-documento">
                          <span class="documento-badge">
                            <i class="bi bi-person-badge"></i>
                            {{ participante.tipoDocumento }} {{ participante.documento }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Área / Rama con diseño jerárquico MEJORADO -->
                  <td class="area-cell">
                    <div class="catalogo-info">
                      <!-- Área y Subárea -->
                      <div v-if="participante.area_nombre" class="catalogo-item area">
                        <div class="catalogo-icon">
                          <i class="bi bi-diagram-3"></i>
                        </div>
                        <div class="catalogo-textos">
                          <span class="catalogo-principal">{{ participante.area_nombre }}</span>
                          <span v-if="participante.subarea_nombre" class="catalogo-secundario">
                            <i class="bi bi-arrow-right-short"></i>
                            {{ participante.subarea_nombre }}
                          </span>
                        </div>
                      </div>

                      <!-- Rama y Subrama -->
                      <div v-else-if="participante.rama_nombre" class="catalogo-item rama">
                        <div class="catalogo-icon">
                          <i class="bi bi-diagram-2"></i>
                        </div>
                        <div class="catalogo-textos">
                          <span class="catalogo-principal">{{ participante.rama_nombre }}</span>
                          <span v-if="participante.subrama_nombre" class="catalogo-secundario">
                            <i class="bi bi-arrow-right-short"></i>
                            {{ participante.subrama_nombre }}
                          </span>
                        </div>
                      </div>

                      <!-- Sin asignación -->
                      <div v-else class="catalogo-item sin-asignar">
                        <div class="catalogo-icon">
                          <i class="bi bi-dash-circle"></i>
                        </div>
                        <div class="catalogo-textos">
                          <span class="catalogo-principal">Sin asignar</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Contacto MEJORADO -->
                  <td class="contacto-cell">
                    <div class="contacto-info">
                      <div class="contacto-email">
                        <i class="bi bi-envelope"></i>
                        <a :href="`mailto:${participante.email}`" class="email-link" :title="participante.email">
                          {{ truncateEmail(participante.email) }}
                        </a>
                      </div>
                      <div class="contacto-telefono" v-if="participante.telefono">
                        <i class="bi bi-telephone"></i>
                        <span>{{ participante.telefono }}</span>
                      </div>
                      <div class="contacto-empresa" v-if="participante.empresa">
                        <i class="bi bi-building"></i>
                        <span :title="participante.empresa">{{ truncateText(participante.empresa, 25) }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Fecha inscripción MEJORADA -->
                  <td class="fecha-cell">
                    <div class="fecha-badge">
                      <div class="fecha-icono">
                        <i class="bi bi-calendar-check"></i>
                      </div>
                      <div class="fecha-textos">
                        <span class="fecha-dia">{{ formatDate(participante.fechaInscripcion) }}</span>
                        <span class="fecha-hora">
                          <i class="bi bi-clock"></i>
                          {{ formatTime(participante.fechaInscripcion) }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Asistencia MEJORADA -->
                  <td class="asistencia-cell">
                    <div class="asistencia-control">
                      <label class="asistencia-switch">
                        <input
                          type="checkbox"
                          v-model="participante.asistio"
                          @change="toggleAsistencia(participante)"
                        >
                        <span class="asistencia-slider">
                          <span class="asistencia-texto" :class="{ 'asistio': participante.asistio }">
                            {{ participante.asistio ? 'Asistió' : 'No asistió' }}
                          </span>
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- Constancia MEJORADA -->
                  <td class="constancia-cell">
                    <div class="constancia-estado" :class="{ 'generada': participante.constancia, 'pendiente': !participante.constancia }">
                      <i :class="participante.constancia ? 'bi bi-file-check-fill' : 'bi bi-file-x-fill'"></i>
                      <span>{{ participante.constancia ? 'Generada' : 'Pendiente' }}</span>
                    </div>
                    <small v-if="participante.constancia" class="constancia-fecha">
                      {{ formatDate(participante.constancia.fecha) }}
                    </small>
                  </td>

                  <!-- Acciones MEJORADAS -->
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button
                        class="btn-icon btn-primary"
                        @click="verParticipante(participante)"
                        title="Ver detalles"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <button
                        v-if="participante.asistio"
                        class="btn-icon btn-success"
                        @click="generarConstancia(participante)"
                        title="Generar constancia"
                      >
                        <i class="bi bi-file-pdf"></i>
                      </button>
                      <button
                        v-else
                        class="btn-icon btn-secondary"
                        disabled
                        title="Requiere asistencia"
                      >
                        <i class="bi bi-file-pdf"></i>
                      </button>
                      <button
                        class="btn-icon btn-info"
                        @click="enviarRecordatorio(participante)"
                        title="Enviar recordatorio"
                      >
                        <i class="bi bi-envelope"></i>
                      </button>
                      <button
                        class="btn-icon btn-danger"
                        @click="cancelarInscripcion(participante)"
                        title="Cancelar inscripción"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Estado vacío -->
                <tr v-if="participantesFiltrados.length === 0">
                  <td colspan="7" class="empty-state">
                    <div class="empty-content">
                      <i class="bi bi-people empty-icon"></i>
                      <h5>No se encontraron participantes</h5>
                      <p class="text-muted">
                        No hay participantes que coincidan con los filtros aplicados
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
              <nav aria-label="Paginación de participantes">
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
                  Mostrando {{ startItem }}-{{ endItem }} de {{ participantesFiltrados.length }} participantes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Ver Participante -->
    <div v-if="showParticipanteModal" class="modal-backdrop show" @click="showParticipanteModal = false"></div>
    <div v-if="showParticipanteModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-person-badge me-2"></i>
              Detalle del Participante
            </h5>
            <button type="button" class="btn-close" @click="showParticipanteModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4 text-center">
                <div class="participante-avatar-large">
                  <div v-if="participanteSeleccionado?.avatar" class="avatar-image-large">
                    <img :src="participanteSeleccionado.avatar" :alt="participanteSeleccionado.nombre">
                  </div>
                  <div v-else class="avatar-initials-large" :style="{ background: getAvatarColor(participanteSeleccionado?.nombre) }">
                    {{ getInitials(participanteSeleccionado?.nombre) }}
                  </div>
                </div>
                <h5 class="mt-3">{{ participanteSeleccionado?.nombre }}</h5>
                <p class="text-muted">{{ participanteSeleccionado?.tipoDocumento }}: {{ participanteSeleccionado?.documento }}</p>

                <!-- Área/Rama en modal -->
                <div class="modal-catalogo mt-3">
                  <div v-if="participanteSeleccionado?.area_nombre" class="modal-catalogo-item area">
                    <i class="bi bi-diagram-3"></i>
                    <div>
                      <strong>Área:</strong> {{ participanteSeleccionado.area_nombre }}
                      <span v-if="participanteSeleccionado.subarea_nombre" class="text-muted d-block small">
                        <i class="bi bi-arrow-right-short"></i> {{ participanteSeleccionado.subarea_nombre }}
                      </span>
                    </div>
                  </div>
                  <div v-else-if="participanteSeleccionado?.rama_nombre" class="modal-catalogo-item rama">
                    <i class="bi bi-diagram-2"></i>
                    <div>
                      <strong>Rama:</strong> {{ participanteSeleccionado.rama_nombre }}
                      <span v-if="participanteSeleccionado.subrama_nombre" class="text-muted d-block small">
                        <i class="bi bi-arrow-right-short"></i> {{ participanteSeleccionado.subrama_nombre }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-8">
                <div class="detail-info-grid">
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-envelope"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Email</span>
                      <span class="info-value">{{ participanteSeleccionado?.email }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-telephone"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Teléfono</span>
                      <span class="info-value">{{ participanteSeleccionado?.telefono || 'No registrado' }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-building"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Empresa/Institución</span>
                      <span class="info-value">{{ participanteSeleccionado?.empresa || 'No registrada' }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-calendar"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Fecha inscripción</span>
                      <span class="info-value">{{ formatDate(participanteSeleccionado?.fechaInscripcion) }}</span>
                    </div>
                  </div>
                </div>

                <div class="asistencia-section mt-4">
                  <h6 class="detail-subtitle">Estado de asistencia</h6>
                  <div class="asistencia-card" :class="participanteSeleccionado?.asistio ? 'asistio' : 'no-asistio'">
                    <div class="asistencia-status">
                      <i :class="participanteSeleccionado?.asistio ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                      <span>{{ participanteSeleccionado?.asistio ? 'Asistió al evento' : 'No asistió' }}</span>
                    </div>
                    <div class="asistencia-toggle-large">
                      <button
                        class="btn"
                        :class="participanteSeleccionado?.asistio ? 'btn-outline-warning' : 'btn-outline-success'"
                        @click="toggleAsistenciaModal"
                      >
                        <i :class="participanteSeleccionado?.asistio ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                        {{ participanteSeleccionado?.asistio ? 'Marcar como no asistió' : 'Marcar como asistió' }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="constancia-section mt-4">
                  <h6 class="detail-subtitle">Constancia</h6>
                  <div class="constancia-card">
                    <div v-if="participanteSeleccionado?.constancia" class="constancia-info-detalle">
                      <div class="constancia-icon">
                        <i class="bi bi-file-pdf-fill text-danger"></i>
                      </div>
                      <div class="constancia-datos">
                        <div class="constancia-nombre">{{ participanteSeleccionado.constancia.nombre }}</div>
                        <div class="constancia-fecha">Generada: {{ formatDate(participanteSeleccionado.constancia.fecha) }}</div>
                      </div>
                      <div class="constancia-acciones">
                        <button class="btn btn-sm btn-outline-primary" @click="verConstancia(participanteSeleccionado)">
                          <i class="bi bi-eye"></i> Ver
                        </button>
                        <button class="btn btn-sm btn-outline-success" @click="descargarConstancia(participanteSeleccionado)">
                          <i class="bi bi-download"></i>
                        </button>
                      </div>
                    </div>
                    <div v-else class="constancia-pendiente">
                      <i class="bi bi-file-pdf"></i>
                      <p>No se ha generado constancia para este participante</p>
                      <button
                        class="btn btn-primary"
                        @click="generarConstancia(participanteSeleccionado)"
                        :disabled="!participanteSeleccionado?.asistio"
                      >
                        <i class="bi bi-file-pdf me-2"></i>
                        Generar constancia
                      </button>
                      <small v-if="!participanteSeleccionado?.asistio" class="text-danger d-block mt-2">
                        * Requiere marcar asistencia primero
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="showParticipanteModal = false">
              <i class="bi bi-x-lg me-1"></i>Cerrar
            </button>
            <button type="button" class="btn btn-primary" @click="enviarRecordatorio(participanteSeleccionado)">
              <i class="bi bi-envelope me-1"></i>Enviar recordatorio
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmación Cancelar Inscripción -->
    <div v-if="inscripcionToDelete" class="modal-backdrop show" @click="cancelDelete"></div>
    <div v-if="inscripcionToDelete" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-danger me-2"></i>
              Cancelar inscripción
            </h5>
            <button type="button" class="btn-close" @click="cancelDelete"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              Esta acción no se puede deshacer
            </div>

            <div class="participante-preview">
              <div class="avatar-initials" :style="{ background: getAvatarColor(inscripcionToDelete?.nombre) }">
                {{ getInitials(inscripcionToDelete?.nombre) }}
              </div>
              <div class="preview-info">
                <h6>{{ inscripcionToDelete?.nombre }}</h6>
                <p class="text-muted mb-1">{{ inscripcionToDelete?.email }}</p>
                <p class="mb-0">
                  <span class="badge" :class="inscripcionToDelete?.asistio ? 'bg-success' : 'bg-secondary'">
                    {{ inscripcionToDelete?.asistio ? 'Asistió' : 'No asistió' }}
                  </span>
                </p>
              </div>
            </div>

            <p class="mt-3">
              ¿Estás seguro de que deseas cancelar la inscripción de este participante?
              Se perderá el registro y no podrá acceder al {{ tipoItem === 'cursos' ? 'curso' : 'evento' }}.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              <i class="bi bi-x-lg me-1"></i>No, mantener
            </button>
            <button type="button" class="btn btn-danger" @click="confirmarCancelacion">
              <i class="bi bi-trash me-1"></i>Sí, cancelar inscripción
            </button>
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
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'
type TipoItem = 'cursos' | 'eventos'

interface Participante {
  id: number
  nombre: string
  tipoDocumento: 'CC' | 'CE' | 'Pasaporte'
  documento: string
  email: string
  telefono?: string
  empresa?: string
  avatar?: string
  fechaInscripcion: string
  asistio: boolean
  constancia?: {
    id: string
    nombre: string
    fecha: string
    url?: string
  }
  notas?: string
  area_id?: number | null
  subarea_id?: number | null
  rama_id?: number | null
  subrama_id?: number | null
  area_nombre?: string
  subarea_nombre?: string
  rama_nombre?: string
  subrama_nombre?: string
}

interface ItemSeleccionado {
  id: number
  tipo: TipoItem
  nombre: string
  descripcion: string
  fechaInicio: string
  fechaFin?: string
  duracion: string
  modalidad: string
  capacidad: number
  inscritos: number
  asistieron: number
  estado: string
  instructor?: string
}

// Router
const route = useRoute()
const router = useRouter()

// Obtener parámetros de la ruta
const tipoItem = route.params.tipo as TipoItem
const itemId = route.params.id as string

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Datos del item seleccionado (recuperados de sessionStorage)
const itemSeleccionado = ref<ItemSeleccionado | null>(null)
const itemTitle = ref('')
const itemDescription = ref('')
const itemIcon = computed(() => tipoItem === 'cursos' ? 'bi bi-mortarboard' : 'bi bi-calendar-event')

// Vista compacta opcional
const vistaCompacta = ref(false)

// API base
import { API_BASE } from '@/config/api'

// Datos de participantes (cargados desde API)
const participantes = ref<Participante[]>([
  // Datos de ejemplo con áreas y ramas
  {
    id: 1,
    nombre: 'María Fernanda López',
    tipoDocumento: 'CC',
    documento: '123456789',
    email: 'maria.lopez@email.com',
    telefono: '3001234567',
    empresa: 'Laboratorio Químico Avanzado',
    fechaInscripcion: '2024-02-15T10:30:00',
    asistio: true,
    constancia: {
      id: 'CONST-001',
      nombre: 'constancia_maria_lopez.pdf',
      fecha: '2024-04-21'
    },
    area_id: 1,
    subarea_id: 2,
    area_nombre: 'Química Analítica',
    subarea_nombre: 'Espectroscopía'
  },
  {
    id: 2,
    nombre: 'Juan Carlos Rodríguez',
    tipoDocumento: 'CC',
    documento: '987654321',
    email: 'juan.rodriguez@email.com',
    telefono: '3107654321',
    empresa: 'Hospital General',
    fechaInscripcion: '2024-02-16T14:20:00',
    asistio: true,
    constancia: {
      id: 'CONST-002',
      nombre: 'constancia_juan_rodriguez.pdf',
      fecha: '2024-04-21'
    },
    rama_id: 1,
    subrama_id: 3,
    rama_nombre: 'Microbiología Clínica',
    subrama_nombre: 'Bacteriología'
  },
  {
    id: 3,
    nombre: 'Ana Sofía Martínez',
    tipoDocumento: 'CC',
    documento: '456789123',
    email: 'ana.martinez@email.com',
    telefono: '3159876543',
    empresa: 'Universidad Nacional',
    fechaInscripcion: '2024-02-18T09:15:00',
    asistio: true,
    area_id: 2,
    area_nombre: 'Microbiología',
    subarea_nombre: ''
  },
  {
    id: 4,
    nombre: 'Carlos Eduardo Pérez',
    tipoDocumento: 'CE',
    documento: 'E1234567',
    email: 'carlos.perez@email.com',
    telefono: '3204567890',
    empresa: 'Empresa Alimentaria S.A.',
    fechaInscripcion: '2024-02-20T11:45:00',
    asistio: false,
    rama_id: 2,
    rama_nombre: 'Control de Calidad'
  },
  {
    id: 5,
    nombre: 'Laura Valentina Gómez',
    tipoDocumento: 'CC',
    documento: '789123456',
    email: 'laura.gomez@email.com',
    telefono: '3012345678',
    empresa: 'Instituto de Investigaciones',
    fechaInscripcion: '2024-02-22T16:30:00',
    asistio: true,
    constancia: {
      id: 'CONST-003',
      nombre: 'constancia_laura_gomez.pdf',
      fecha: '2024-04-21'
    }
  },
  {
    id: 6,
    nombre: 'Diego Alejandro Ramírez',
    tipoDocumento: 'CC',
    documento: '321654987',
    email: 'diego.ramirez@email.com',
    telefono: '3134567890',
    empresa: 'Laboratorio Clínico',
    fechaInscripcion: '2024-02-25T08:00:00',
    asistio: false,
    area_id: 3,
    subarea_id: 5,
    area_nombre: 'Bioquímica',
    subarea_nombre: 'Enzimología'
  }
])

// Listas de áreas y ramas para filtros
const areasList = ref<any[]>([
  { id: 1, nombre: 'Química Analítica' },
  { id: 2, nombre: 'Microbiología' },
  { id: 3, nombre: 'Bioquímica' },
  { id: 4, nombre: 'Fisicoquímica' }
])

const ramasList = ref<any[]>([
  { id: 1, nombre: 'Microbiología Clínica' },
  { id: 2, nombre: 'Control de Calidad' },
  { id: 3, nombre: 'Investigación' },
  { id: 4, nombre: 'Desarrollo' }
])

const subareasMap: Record<number, any[]> = {
  1: [
    { id: 1, nombre: 'Cromatografía' },
    { id: 2, nombre: 'Espectroscopía' },
    { id: 3, nombre: 'Espectrometría de Masas' }
  ],
  2: [
    { id: 4, nombre: 'Bacteriología' },
    { id: 5, nombre: 'Micología' },
    { id: 6, nombre: 'Parasitología' }
  ],
  3: [
    { id: 7, nombre: 'Enzimología' },
    { id: 8, nombre: 'Proteómica' },
    { id: 9, nombre: 'Metabolómica' }
  ]
}

const subramasMap: Record<number, any[]> = {
  1: [
    { id: 1, nombre: 'Bacteriología Clínica' },
    { id: 2, nombre: 'Micología Clínica' },
    { id: 3, nombre: 'Virología' }
  ],
  2: [
    { id: 4, nombre: 'Control Microbiológico' },
    { id: 5, nombre: 'Control Físico-Químico' },
    { id: 6, nombre: 'Auditorías' }
  ],
  3: [
    { id: 7, nombre: 'Investigación Básica' },
    { id: 8, nombre: 'Investigación Aplicada' },
    { id: 9, nombre: 'Desarrollo Tecnológico' }
  ]
}

let pollInterval: number | null = null

const mapRowToParticipante = (r: any): Participante => ({
  id: r.id_inscripcion,
  nombre: `${r.nombre} ${r.primer_apellido}${r.segundo_apellido ? ' ' + r.segundo_apellido : ''}`.trim(),
  tipoDocumento: (r.tipo_documento || 'CC') as any,
  documento: r.documento || '',
  email: r.correo,
  telefono: r.telefono || undefined,
  empresa: r.empresa || undefined,
  avatar: r.avatar || undefined,
  fechaInscripcion: r.created_at || new Date().toISOString(),
  asistio: !!r.asistio,
  constancia: r.constancia || undefined,
  notas: r.notas || undefined,
  area_id: r.area_id || null,
  subarea_id: r.subarea_id || null,
  rama_id: r.rama_id || null,
  subrama_id: r.subrama_id || null,
  area_nombre: r.area_nombre || r.area || undefined,
  subarea_nombre: r.subarea_nombre || undefined,
  rama_nombre: r.rama_nombre || r.rama || undefined,
  subrama_nombre: r.subrama_nombre || undefined
})

const loadParticipantes = async () => {
  try {
    const params = new URLSearchParams()
    const tipo = tipoItem === 'cursos' ? 'curso' : 'evento'
    params.set('tipo', tipo)
    if (tipo === 'evento') params.set('evento_id', String(itemId))
    else params.set('curso_id', String(itemId))

    const res = await fetch(`${API_BASE}/api/inscripciones?limit=1000&${params.toString()}`)
    if (!res.ok) {
      console.error('Error cargando inscripciones:', await res.text())
      return
    }
    const rows = await res.json()
    if (Array.isArray(rows)) {
      participantes.value = rows.map(mapRowToParticipante)

      // Enriquecer nombres de área/rama usando catálogos cargados
      for (const p of participantes.value) {
        if (p.area_id) {
          await loadSubitems('area', p.area_id)
          const area = areasList.value.find(a => a.id === p.area_id)
          if (area) p.area_nombre = area.nombre
          const sub = (subareasMap[p.area_id] || []).find(sa => sa.id === p.subarea_id)
          if (sub) p.subarea_nombre = sub.nombre
        }
        if (p.rama_id) {
          await loadSubitems('rama', p.rama_id)
          const rama = ramasList.value.find(r => r.id === p.rama_id)
          if (rama) p.rama_nombre = rama.nombre
          const subr = (subramasMap[p.rama_id] || []).find(sr => sr.id === p.subrama_id)
          if (subr) p.subrama_nombre = subr.nombre
        }
      }
    }
  } catch (err) {
    console.error('loadParticipantes error', err)
  }
}

// Filtros
const searchQuery = ref('')
const filtroAsistencia = ref<'todos' | 'asistio' | 'no-asistio'>('todos')
const filtroConstancia = ref<'todos' | 'generadas' | 'pendientes'>('todos')

// Filtrado por área/rama
const filtroTipoCatalogo = ref<'none' | 'area' | 'rama'>('none')
const selectedAreaId = ref<any>(null)
const selectedSubareaId = ref<any>(null)
const selectedRamaId = ref<any>(null)
const selectedSubramaId = ref<any>(null)

const loadCatalogParents = async () => {
  try {
    const [areasRes, ramasRes] = await Promise.all([
      fetch(`${API_BASE}/api/areas`),
      fetch(`${API_BASE}/api/ramas`)
    ])
    if (areasRes.ok) areasList.value = await areasRes.json()
    if (ramasRes.ok) ramasList.value = await ramasRes.json()
  } catch (err) {
    console.error('Error cargando catálogos (areas/ramas):', err)
  }
}

const loadSubitems = async (type: 'area' | 'rama', parentId: number) => {
  try {
    if (type === 'area') {
      if (subareasMap[parentId]) return subareasMap[parentId]
      const res = await fetch(`${API_BASE}/api/areas/${parentId}/subareas`)
      if (res.ok) subareasMap[parentId] = await res.json()
      return subareasMap[parentId]
    } else {
      if (subramasMap[parentId]) return subramasMap[parentId]
      const res = await fetch(`${API_BASE}/api/ramas/${parentId}/subramas`)
      if (res.ok) subramasMap[parentId] = await res.json()
      return subramasMap[parentId]
    }
  } catch (err) {
    console.error('Error cargando subitems:', err)
    return []
  }
}

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modales
const showParticipanteModal = ref(false)
const participanteSeleccionado = ref<Participante | null>(null)
const inscripcionToDelete = ref<Participante | null>(null)

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const asistentes = computed(() => participantes.value.filter(p => p.asistio).length)
const pendientes = computed(() => participantes.value.filter(p => !p.asistio).length)

const participantesFiltrados = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return participantes.value.filter(p => {
    // Búsqueda
    const matchesSearch = !query ||
      p.nombre.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.documento.includes(query) ||
      (p.empresa && p.empresa.toLowerCase().includes(query))

    // Filtro asistencia
    const matchesAsistencia = filtroAsistencia.value === 'todos' ||
      (filtroAsistencia.value === 'asistio' && p.asistio) ||
      (filtroAsistencia.value === 'no-asistio' && !p.asistio)

    // Filtro constancia
    const matchesConstancia = filtroConstancia.value === 'todos' ||
      (filtroConstancia.value === 'generadas' && p.constancia) ||
      (filtroConstancia.value === 'pendientes' && !p.constancia)

    // Filtro por área/rama
    let matchesCatalog = true
    if (filtroTipoCatalogo.value === 'area') {
      if (selectedAreaId.value != null && selectedAreaId.value !== '' && Number(selectedAreaId.value) !== p.area_id) matchesCatalog = false
      if (selectedSubareaId.value != null && selectedSubareaId.value !== '' && Number(selectedSubareaId.value) !== p.subarea_id) matchesCatalog = false
    } else if (filtroTipoCatalogo.value === 'rama') {
      if (selectedRamaId.value != null && selectedRamaId.value !== '' && Number(selectedRamaId.value) !== p.rama_id) matchesCatalog = false
      if (selectedSubramaId.value != null && selectedSubramaId.value !== '' && Number(selectedSubramaId.value) !== p.subrama_id) matchesCatalog = false
    }

    return matchesSearch && matchesAsistencia && matchesConstancia && matchesCatalog
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(participantesFiltrados.value.length / itemsPerPage.value))
)

const participantesPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return participantesFiltrados.value.slice(start, end)
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
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, participantesFiltrados.value.length)
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

// Métodos de utilidad para textos
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const truncateEmail = (email: string): string => {
  if (!email) return ''
  const [local, domain] = email.split('@')
  if (local.length > 15) {
    return local.substring(0, 12) + '...@' + domain
  }
  return email
}

// Métodos
const handleSearch = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  filtroAsistencia.value = 'todos'
  filtroConstancia.value = 'todos'
  filtroTipoCatalogo.value = 'none'
  selectedAreaId.value = null
  selectedSubareaId.value = null
  selectedRamaId.value = null
  selectedSubramaId.value = null
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const toggleView = () => {
  vistaCompacta.value = !vistaCompacta.value
}

const getInitials = (nombre?: string): string => {
  if (!nombre) return 'U'
  return nombre
    .split(' ')
    .map(part => part[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const getAvatarColor = (nombre?: string): string => {
  if (!nombre) return '#1E9E4A'
  const colors = ['#1E9E4A', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#607D8B']
  let hash = 0
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0
  }
  return colors[Math.abs(hash) % colors.length]
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Métodos de participantes
const verParticipante = (participante: Participante) => {
  participanteSeleccionado.value = participante
  showParticipanteModal.value = true
}

const toggleAsistencia = (participante: Participante) => {
  // Actualizar el contador de asistentes
  if (participante.asistio) {
    if (itemSeleccionado.value) {
      itemSeleccionado.value.asistieron++
    }
  } else {
    if (itemSeleccionado.value && itemSeleccionado.value.asistieron > 0) {
      itemSeleccionado.value.asistieron--
    }
  }

  showToast(
    participante.asistio ? 'Asistencia marcada' : 'Asistencia removida',
    'success',
    'Actualización'
  )
}

const toggleAsistenciaModal = () => {
  if (!participanteSeleccionado.value) return
  participanteSeleccionado.value.asistio = !participanteSeleccionado.value.asistio

  const index = participantes.value.findIndex(p => p.id === participanteSeleccionado.value!.id)
  if (index !== -1) {
    participantes.value[index].asistio = participanteSeleccionado.value.asistio
    toggleAsistencia(participantes.value[index])
  }

  showToast(
    participanteSeleccionado.value.asistio ? 'Asistencia marcada' : 'Asistencia removida',
    'success',
    'Actualización'
  )
}

const marcarTodosAsistencia = () => {
  if (confirm(`¿Marcar a todos los ${participantesFiltrados.value.length} participantes como asistieron?`)) {
    participantesFiltrados.value.forEach(p => {
      const index = participantes.value.findIndex(part => part.id === p.id)
      if (index !== -1) {
        participantes.value[index].asistio = true
      }
    })

    if (itemSeleccionado.value) {
      itemSeleccionado.value.asistieron = participantes.value.filter(p => p.asistio).length
    }

    showToast('Todos marcados como asistieron', 'success', 'Actualización masiva')
  }
}

// Métodos de constancias
const generarConstancia = (participante?: Participante | null) => {
  if (!participante) return

  participante.constancia = {
    id: 'CONST-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    nombre: `constancia_${participante.nombre.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    fecha: new Date().toISOString()
  }

  showToast('Constancia generada exitosamente', 'success', 'Constancia')
}

const generarConstanciasMasivas = () => {
  const asistentesSinConstancia = participantes.value.filter(p => p.asistio && !p.constancia)

  if (asistentesSinConstancia.length === 0) {
    showToast('No hay participantes que requieran constancia', 'info', 'Constancias')
    return
  }

  if (confirm(`Generar constancias para ${asistentesSinConstancia.length} participantes?`)) {
    asistentesSinConstancia.forEach(p => {
      p.constancia = {
        id: 'CONST-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        nombre: `constancia_${p.nombre.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fecha: new Date().toISOString()
      }
    })
    showToast(`${asistentesSinConstancia.length} constancias generadas`, 'success', 'Constancias masivas')
  }
}

const verConstancia = (participante?: Participante | null) => {
  if (!participante?.constancia) return
  showToast(`Visualizando ${participante.constancia.nombre}`, 'info', 'Constancia')
}

const descargarConstancia = (participante?: Participante | null) => {
  if (!participante?.constancia) return
  showToast(`Descargando ${participante.constancia.nombre}`, 'success', 'Descarga')
}

// Otros métodos
const enviarRecordatorio = (participante?: Participante | null) => {
  if (!participante) return
  showToast(`Recordatorio enviado a ${participante.email}`, 'success', 'Correo enviado')
}

const cancelarInscripcion = (participante: Participante) => {
  inscripcionToDelete.value = participante
}

const cancelDelete = () => {
  inscripcionToDelete.value = null
}

const confirmarCancelacion = () => {
  if (!inscripcionToDelete.value) return

  participantes.value = participantes.value.filter(p => p.id !== inscripcionToDelete.value!.id)

  if (itemSeleccionado.value) {
    itemSeleccionado.value.inscritos = participantes.value.length
    itemSeleccionado.value.asistieron = participantes.value.filter(p => p.asistio).length
  }

  showToast('Inscripción cancelada', 'success', 'Cancelación')
  inscripcionToDelete.value = null
}

const exportLista = () => {
  const headers = ['Nombre', 'Documento', 'Email', 'Teléfono', 'Empresa', 'Área/Rama', 'Subárea/Subrama', 'Fecha inscripción', 'Asistió', 'Constancia']

  const csvData = participantesFiltrados.value.map(p => [
    p.nombre,
    `${p.tipoDocumento} ${p.documento}`,
    p.email,
    p.telefono || '',
    p.empresa || '',
    p.area_nombre || p.rama_nombre || '',
    p.subarea_nombre || p.subrama_nombre || '',
    formatDate(p.fechaInscripcion),
    p.asistio ? 'Sí' : 'No',
    p.constancia ? 'Generada' : 'Pendiente'
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `participantes-${tipoItem}-${itemId}-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Lista exportada exitosamente', 'success', 'Exportación')
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

// Cargar datos del item seleccionado
onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  const stored = sessionStorage.getItem('itemSeleccionado')
  if (stored) {
    itemSeleccionado.value = JSON.parse(stored)
    itemTitle.value = itemSeleccionado.value.nombre
    itemDescription.value = itemSeleccionado.value.descripcion
    sessionStorage.removeItem('itemSeleccionado')
  } else {
    router.push('/admin/inscripciones')
  }

  await loadCatalogParents()
  await loadParticipantes()

  pollInterval = window.setInterval(() => loadParticipantes(), 5000)

  const onStorage = (e: StorageEvent) => {
    if (!e.key) return
    if (e.key === 'inscripcion_created') loadParticipantes()
  }
  window.addEventListener('storage', onStorage)

  const onVisibility = () => { if (document.visibilityState === 'visible') loadParticipantes() }
  document.addEventListener('visibilitychange', onVisibility)

  ;(onMounted as any)._onStorage = onStorage
  ;(onMounted as any)._onVisibility = onVisibility
})

onUnmounted(() => {
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
  const s = (onMounted as any)._onStorage as ((e: StorageEvent) => void)
  const v = (onMounted as any)._onVisibility as (() => void)
  if (s) window.removeEventListener('storage', s)
  if (v) document.removeEventListener('visibilitychange', v)
})
</script>

<style scoped>
/* ESTILOS EXISTENTES DEL SISTEMA - se mantienen todos los estilos base */
.admin-participantes-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-participantes-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header - Mismo que usuarios */
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
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
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
  gap: 0.5rem;
  flex-wrap: wrap;
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
  flex: 1;
  justify-content: center;
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

/* Nuevos estilos para filtros de catálogo */
.catalog-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.catalog-filter-btn {
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
  flex: 1;
  justify-content: center;
}

[data-bs-theme="dark"] .catalog-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.catalog-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.catalog-filter-btn.area.active {
  background: linear-gradient(135deg, #1E9E4A 0%, #2E7D32 100%);
  border-color: transparent;
  color: white;
}

.catalog-filter-btn.rama.active {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  border-color: transparent;
  color: white;
}

.catalog-filter-btn.active:not(.area):not(.rama) {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

.catalog-selectors {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.catalog-selectors .form-select {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  font-size: 0.9rem;
  padding: 0.5rem;
}

[data-bs-theme="dark"] .catalog-selectors .form-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Main Content */
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

.table-responsive {
  overflow-x: auto;
  border-radius: 0 0 16px 16px;
}

/* ===== TABLA MEJORADA ===== */
.participantes-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .participantes-table {
  background: var(--card-bg, #2d2d2d);
}

/* Compact view */
.participantes-table.compact-view {
  font-size: 0.85rem;
}

.participantes-table.compact-view .participante-cell {
  padding: 0.75rem;
}

.participantes-table.compact-view .catalogo-item {
  padding: 0.25rem 0.5rem;
}

.participantes-table.compact-view .catalogo-icon {
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
}

.participantes-table.compact-view .btn-icon {
  width: 28px;
  height: 28px;
  font-size: 0.8rem;
}

/* Columnas con anchos específicos */
.participantes-table th {
  padding: 1.25rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: var(--color-gray-dark, #495057);
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(129, 199, 132, 0.04) 100%);
  border-bottom: 2px solid var(--color-primary, #1E9E4A);
  white-space: nowrap;
}

[data-bs-theme="dark"] .participantes-table th {
  color: var(--color-gray-dark, #ADB5BD);
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.participante-column { min-width: 280px; }
.area-column { min-width: 240px; }
.contacto-column { min-width: 260px; }
.fecha-column { min-width: 150px; }
.asistencia-column { min-width: 140px; }
.constancia-column { min-width: 150px; }
.actions-column { min-width: 200px; }

/* Filas */
.participantes-table tbody tr {
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.participantes-table tbody tr:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] .participantes-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.07) 100%);
}

.participantes-table td {
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

/* ===== PARTICIPANTE MEJORADO ===== */
.participante-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.participante-avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  position: relative;
}

.avatar-image, .avatar-initials {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.avatar-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--card-bg, white);
  background: var(--color-gray, #6C757D);
}

.avatar-status.online {
  background: var(--color-success, #28a745);
}

.participante-datos {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.participante-nombre {
  font-weight: 600;
  color: var(--color-dark, #212529);
  font-size: 1rem;
  line-height: 1.3;
}

[data-bs-theme="dark"] .participante-nombre {
  color: var(--color-dark, #F8F9FA);
}

.documento-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  background: var(--lab-bg, #f0f2f5);
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .documento-badge {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.documento-badge i {
  font-size: 0.7rem;
  color: var(--color-primary, #1E9E4A);
}

/* ===== ÁREA / RAMA JERÁRQUICO ===== */
.catalogo-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.catalogo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 12px;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

[data-bs-theme="dark"] .catalogo-item {
  background: rgba(255, 255, 255, 0.03);
}

.catalogo-item.area {
  border-left-color: var(--color-primary, #1E9E4A);
  background: linear-gradient(90deg, rgba(30, 158, 74, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%);
}

.catalogo-item.rama {
  border-left-color: var(--color-warning, #FF9800);
  background: linear-gradient(90deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 193, 7, 0.02) 100%);
}

.catalogo-item.sin-asignar {
  border-left-color: var(--color-gray, #6C757D);
  opacity: 0.7;
}

.catalogo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.catalogo-item.area .catalogo-icon {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.15) 0%, rgba(76, 175, 80, 0.1) 100%);
  color: var(--color-primary, #1E9E4A);
}

.catalogo-item.rama .catalogo-icon {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 193, 7, 0.1) 100%);
  color: var(--color-warning, #FF9800);
}

.catalogo-item.sin-asignar .catalogo-icon {
  background: var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
}

.catalogo-textos {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.catalogo-principal {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-dark, #212529);
  line-height: 1.3;
}

[data-bs-theme="dark"] .catalogo-principal {
  color: var(--color-dark, #F8F9FA);
}

.catalogo-secundario {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.catalogo-secundario i {
  font-size: 0.7rem;
  color: var(--color-primary, #1E9E4A);
}

.catalogo-item.rama .catalogo-secundario i {
  color: var(--color-warning, #FF9800);
}

/* ===== CONTACTO MEJORADO ===== */
.contacto-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contacto-email,
.contacto-telefono,
.contacto-empresa {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

.contacto-email i,
.contacto-telefono i,
.contacto-empresa i {
  width: 16px;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.9rem;
}

.email-link {
  color: var(--color-primary, #1E9E4A);
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px dotted transparent;
}

.email-link:hover {
  color: var(--color-primary-dark, #0A8F3A);
  border-bottom-color: currentColor;
}

.contacto-telefono span {
  color: var(--color-gray-dark, #495057);
}

[data-bs-theme="dark"] .contacto-telefono span {
  color: var(--color-gray-dark, #ADB5BD);
}

.contacto-empresa span {
  font-weight: 500;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .contacto-empresa span {
  color: var(--color-dark, #F8F9FA);
}

/* ===== FECHA MEJORADA ===== */
.fecha-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 12px;
  width: fit-content;
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .fecha-badge {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.fecha-icono {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.15) 0%, rgba(76, 175, 80, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary, #1E9E4A);
  font-size: 1rem;
}

.fecha-textos {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.fecha-dia {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-dark, #212529);
  line-height: 1.2;
}

[data-bs-theme="dark"] .fecha-dia {
  color: var(--color-dark, #F8F9FA);
}

.fecha-hora {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.fecha-hora i {
  font-size: 0.65rem;
}

/* ===== ASISTENCIA SWITCH ===== */
.asistencia-control {
  display: flex;
  align-items: center;
}

.asistencia-switch {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 32px;
  cursor: pointer;
}

.asistencia-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.asistencia-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-gray-light, #E9ECEF);
  border-radius: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .asistencia-slider {
  background: rgba(255, 255, 255, 0.1);
}

input:checked + .asistencia-slider {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.asistencia-texto {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-gray, #6C757D);
  transition: color 0.3s ease;
}

.asistencia-texto.asistio {
  color: white;
}

input:checked + .asistencia-slider .asistencia-texto {
  color: white;
}

/* ===== CONSTANCIA MEJORADA ===== */
.constancia-estado {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.constancia-estado.generada {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(46, 125, 50, 0.1) 100%);
  color: var(--color-success, #28a745);
  border-color: rgba(76, 175, 80, 0.3);
}

.constancia-estado.pendiente {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%);
  color: var(--color-warning, #ff9800);
  border-color: rgba(255, 193, 7, 0.3);
}

.constancia-estado i {
  font-size: 0.9rem;
}

.constancia-fecha {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.65rem;
  color: var(--color-gray, #6C757D);
  text-align: center;
}

/* ===== ACCIONES MEJORADAS ===== */
.action-buttons {
  display: flex;
  gap: 0.35rem;
  justify-content: flex-end;
}

.btn-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--color-gray, #6C757D);
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .btn-icon {
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--color-gray-dark, #ADB5BD);
}

.btn-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.btn-icon.btn-primary:hover {
  background: var(--color-primary, #1E9E4A);
  color: white;
  border-color: var(--color-primary, #1E9E4A);
}

.btn-icon.btn-success:hover {
  background: var(--color-success, #28a745);
  color: white;
  border-color: var(--color-success, #28a745);
}

.btn-icon.btn-info:hover {
  background: var(--color-info, #17a2b8);
  color: white;
  border-color: var(--color-info, #17a2b8);
}

.btn-icon.btn-danger:hover {
  background: var(--color-danger, #dc3545);
  color: white;
  border-color: var(--color-danger, #dc3545);
}

.btn-icon.btn-secondary:hover:not(:disabled) {
  background: var(--color-secondary, #6c757d);
  color: white;
  border-color: var(--color-secondary, #6c757d);
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ===== MODAL MEJORADO ===== */
.modal-backdrop {
  opacity: 0.5;
  z-index: 1040;
}

.modal.show {
  display: block;
  z-index: 1050;
}

.modal-content {
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

[data-bs-theme="dark"] .modal-content {
  border: 1px solid var(--color-gray-light, #2d2d2d);
  background: var(--color-light, #121212);
}

.modal-header {
  padding: 1.5rem 2rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .modal-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.modal-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .modal-title {
  color: var(--color-dark, #F8F9FA);
}

.modal-body {
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .modal-footer {
  background: var(--lab-bg, #1a1a1a);
}

/* Avatar modal */
.participante-avatar-large {
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.avatar-image-large {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.avatar-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials-large {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 3rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Catálogo en modal */
.modal-catalogo {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-catalogo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: var(--lab-bg, #f8f9fa);
  border-left: 4px solid transparent;
}

[data-bs-theme="dark"] .modal-catalogo-item {
  background: rgba(255, 255, 255, 0.03);
}

.modal-catalogo-item.area {
  border-left-color: var(--color-primary, #1E9E4A);
}

.modal-catalogo-item.rama {
  border-left-color: var(--color-warning, #FF9800);
}

.modal-catalogo-item i {
  font-size: 1.5rem;
  color: var(--color-primary, #1E9E4A);
}

.modal-catalogo-item.rama i {
  color: var(--color-warning, #FF9800);
}

.modal-catalogo-item div {
  text-align: left;
}

/* Grid de información en modal */
.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: var(--lab-bg, #f8f9fa);
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .detail-info-grid {
  background: rgba(255, 255, 255, 0.03);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--color-primary, #1E9E4A);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

.info-value {
  font-weight: 600;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .info-value {
  color: var(--color-dark, #F8F9FA);
}

/* Sección de asistencia en modal */
.asistencia-section {
  margin-top: 1.5rem;
}

.detail-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .detail-subtitle {
  color: var(--color-dark, #F8F9FA);
}

.asistencia-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-radius: 16px;
  background: var(--lab-bg, #f8f9fa);
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .asistencia-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.asistencia-card.asistio {
  border-left: 4px solid var(--color-success, #28a745);
}

.asistencia-card.no-asistio {
  border-left: 4px solid var(--color-danger, #dc3545);
}

.asistencia-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
}

.asistencia-status i {
  font-size: 1.5rem;
}

.asistencia-card.asistio i {
  color: var(--color-success, #28a745);
}

.asistencia-card.no-asistio i {
  color: var(--color-danger, #dc3545);
}

.asistencia-toggle-large .btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
}

/* Sección de constancia en modal */
.constancia-card {
  padding: 1.5rem;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .constancia-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.constancia-info-detalle {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.constancia-icon {
  font-size: 2rem;
  line-height: 1;
}

.constancia-datos {
  flex: 1;
  min-width: 150px;
}

.constancia-nombre {
  font-weight: 600;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .constancia-nombre {
  color: var(--color-dark, #F8F9FA);
}

.constancia-fecha {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.constancia-acciones {
  display: flex;
  gap: 0.5rem;
}

.constancia-pendiente {
  text-align: center;
  padding: 2rem;
}

.constancia-pendiente i {
  font-size: 3rem;
  color: var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
}

.constancia-pendiente p {
  margin-bottom: 1rem;
  color: var(--color-gray, #6C757D);
}

/* Preview de participante para eliminación */
.participante-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 16px;
  margin: 1rem 0;
}

[data-bs-theme="dark"] .participante-preview {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

/* Empty State */
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

/* Table Footer */
.table-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .table-footer {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.1);
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
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
  border-radius: 8px;
  margin: 0 2px;
}

[data-bs-theme="dark"] .page-link {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.page-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
  transform: translateY(-1px);
}

[data-bs-theme="dark"] .page-link:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.page-item.active .page-link {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

/* Toast */
.toast-container {
  z-index: 1060;
}

.toast {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(12, 18, 30, 0.15);
  overflow: hidden;
}

/* Tooltips */
[title] {
  position: relative;
}

[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.35rem 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 0.7rem;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 2000;
  margin-bottom: 0.5rem;
  pointer-events: none;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1400px) {
  .participantes-table {
    font-size: 0.9rem;
  }

  .catalogo-item {
    padding: 0.5rem 0.6rem;
  }

  .catalogo-icon {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }

  .participante-column { min-width: 260px; }
  .area-column { min-width: 220px; }
  .contacto-column { min-width: 240px; }
}

@media (max-width: 1200px) {
  .participante-column { min-width: 250px; }
  .area-column { min-width: 210px; }
  .contacto-column { min-width: 230px; }
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

  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-info-grid {
    grid-template-columns: 1fr;
  }

  .participantes-table {
    min-width: 1200px;
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

  .status-filters,
  .catalog-filters {
    flex-wrap: wrap;
  }

  .asistencia-card {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .constancia-info-detalle {
    flex-direction: column;
    text-align: center;
  }

  .constancia-acciones {
    width: 100%;
    justify-content: center;
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
  .table-footer {
    padding: 1rem;
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

  .modal-body {
    padding: 1rem;
  }

  .detail-info-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .participante-avatar-large {
    width: 100px;
    height: 100px;
  }

  .action-buttons {
    gap: 0.25rem;
  }

  .btn-icon {
    width: 30px;
    height: 30px;
    font-size: 0.85rem;
  }
}

/* ===== ANIMACIONES ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.participante-row {
  animation: fadeIn 0.3s ease;
}

.stat-card,
.panel-card,
.table-card,
.catalogo-item,
.btn-icon {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover,
.panel-card:hover,
.table-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

/* Dark mode overrides */
[data-bs-theme="dark"] .panel-card,
[data-bs-theme="dark"] .table-card,
[data-bs-theme="dark"] .stat-card {
  background: rgba(24, 24, 26, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

[data-bs-theme="dark"] .catalogo-item {
  background: rgba(255, 255, 255, 0.02);
}

[data-bs-theme="dark"] .catalogo-item.area {
  background: rgba(30, 158, 74, 0.1);
}

[data-bs-theme="dark"] .catalogo-item.rama {
  background: rgba(255, 152, 0, 0.1);
}

[data-bs-theme="dark"] .fecha-badge,
[data-bs-theme="dark"] .documento-badge {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
