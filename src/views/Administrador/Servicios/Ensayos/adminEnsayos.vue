<template>
  <div :data-bs-theme="currentTheme" class="admin-ensayos-page">
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
              <i class="bi bi-clipboard-data"></i> Gestión de Ensayos
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <span class="section-eyebrow">Administración</span>
            <h1 class="page-title">Programa de Ensayos de Aptitud 2026</h1>
            <p class="page-subtitle">Gestiona los programas de ensayos por área, fechas y disponibilidad</p>
          </div>

          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-icon total">
                <i class="bi bi-grid-3x3-gap-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ totalEnsayos }}</span>
                <span class="stat-label">Total Ensayos</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon abierto">
                <i class="bi bi-cart-check-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ ensayosAbiertos }}</span>
                <span class="stat-label">Disponibles</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon cerrado">
                <i class="bi bi-lock-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ ensayosCerrados }}</span>
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
                    placeholder="Buscar por ciclo, descripción, código..."
                    @input="handleSearch"
                  />
                  <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''; handleSearch()">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por Área (incluye servicios) -->
              <div class="filter-group">
                <div class="filter-chips">
                  <button
                    v-for="area in allowedAreas"
                    :key="area"
                    class="filter-chip"
                    :class="{ 'active': selectedArea === area || selectedRama === area }"
                    @click="handleFilterClick(area)"
                  >
                    <img v-if="servicesByName.get(area)" :src="currentTheme === 'dark' ? servicesByName.get(area).iconWhite : servicesByName.get(area).icon" class="service-icon" alt="" />
                    <span>{{ area }}</span>
                    <span class="chip-count">{{ servicesByName.get(area) ? getServiceCount(servicesByName.get(area)) : getAreaCount(area) }}</span>
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
                    <span class="chip-count">{{ ensayosAbiertos }}</span>
                  </button>
                  <button
                    class="filter-chip"
                    :class="{ 'active': selectedStatus === 'cerrado' }"
                    @click="toggleStatusFilter('cerrado')"
                  >
                    <i class="bi bi-lock"></i>
                    <span>Cerrados</span>
                    <span class="chip-count">{{ ensayosCerrados }}</span>
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
                  <span>Nuevo Ensayo</span>
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
              <span v-if="selectedArea" class="active-filter-tag">
                Área: {{ selectedArea }}
                <button @click="selectedArea = null; handleSearch()"><i class="bi bi-x"></i></button>
              </span>
              <span v-if="selectedRama" class="active-filter-tag">
                Rama: {{ selectedRama }}
                <button @click="selectedRama = null; handleSearch()"><i class="bi bi-x"></i></button>
              </span>
              <span v-if="selectedStatus" class="active-filter-tag">
                Estado: {{ selectedStatus === 'abierto' ? 'Abiertos' : 'Cerrados' }}
                <button @click="selectedStatus = null; handleSearch()"><i class="bi bi-x"></i></button>
              </span>
              <!-- services are treated as areas now; selected service appears under Área -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de ensayos -->
    <main class="table-section">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">Programas de Ensayos</h4>
              <p class="table-subtitle">
                Mostrando {{ paginatedEnsayos.length }} de {{ filteredEnsayos.length }} ensayos
                <span v-if="filteredEnsayos.length !== ensayos.length">
                  (filtrado de {{ ensayos.length }})
                </span>
              </p>
            </div>

            <div class="table-controls">
              <div class="bulk-actions" v-if="selectedEnsayos.length > 0">
                <span class="selected-count">{{ selectedEnsayos.length }} seleccionados</span>
                <button class="action-btn secondary" @click="bulkOpen">
                  <i class="bi bi-cart-check"></i> Abrir
                </button>
                <button class="action-btn secondary" @click="bulkClose">
                  <i class="bi bi-lock"></i> Cerrar
                </button>
                <button class="action-btn danger-outline" @click="bulkDelete">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </div>
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
              <table class="ensayos-table">
                <thead>
                  <tr>
                    <th class="col-codigo">Código</th>
                    <th class="col-area">Área</th>
                    <th class="col-subarea">Subárea</th>
                    <th class="col-descripcion">Descripción</th>
                    <th class="col-fechas">Periodo</th>
                    <th class="col-inicio">Inicio</th>
                    <th class="col-estado">Estado</th>
                    <th class="col-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ensayo in paginatedEnsayos" :key="ensayo.id" :class="{ 'selected': isSelected(ensayo) }">
                    <td>
                      <code class="codigo-text">{{ ensayo.codigo }}</code>
                    </td>
                    <td>
                      <div>
                        <span v-if="ensayo.area" class="area-badge">{{ ensayo.area }}</span>
                        <span v-if="ensayo.rama" class="rama-badge" style="margin-left:0.5rem">{{ ensayo.rama }}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span v-if="ensayo.subarea" class="subarea-badge">{{ ensayo.subarea }}</span>
                        <span v-else-if="ensayo.subrama" class="subrama-badge">{{ ensayo.subrama }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="descripcion-cell">
                        <span class="descripcion-text">{{ ensayo.descripcion }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="fecha-cell">
                        <span class="fecha-label">Inicio:</span>
                        <span>{{ ensayo.inscripcionInicio }}</span>
                        <span class="fecha-label">Fin:</span>
                        <span>{{ ensayo.inscripcionFin }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="fecha-cell">
                        <span>{{ ensayo.fechaInicio }}</span>
                        <span class="fecha-detalle">{{ ensayo.fechaDetalle }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="status-toggle">
                        <button
                          class="toggle-btn"
                          :class="{ 'active': ensayo.disponible }"
                          @click="toggleEnsayoStatus(ensayo)"
                          :disabled="ensayo.updating"
                          :title="ensayo.disponible ? 'Cerrar ensayo' : 'Abrir ensayo'"
                        >
                          <span class="toggle-dot"></span>
                        </button>
                        <span class="status-text" :class="ensayo.disponible ? 'abierto' : 'cerrado'">
                          {{ ensayo.disponible ? 'Abierto' : 'Cerrado' }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="icon-btn" @click="viewEnsayo(ensayo)" title="Ver detalles">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button class="icon-btn" @click="openEditModal(ensayo)" title="Editar ensayo">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="icon-btn danger" @click="confirmDelete(ensayo)" title="Eliminar ensayo">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Estado vacío -->
                  <tr v-if="filteredEnsayos.length === 0">
                    <td colspan="10" class="empty-row">
                      <div class="empty-content">
                        <i class="bi bi-clipboard-data empty-icon"></i>
                        <h5 v-if="ensayos.length === 0">No hay ensayos propuestos</h5>
                          <h5 v-else>No se encontraron ensayos</h5>
                          <p v-if="ensayos.length === 0">Aún no existen ensayos registrados en la base de datos.</p>
                          <p v-else>No hay ensayos que coincidan con los filtros aplicados</p>
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
            <div v-for="ensayo in paginatedEnsayos" :key="ensayo.id" class="ensayo-card" :class="{ 'selected': isSelected(ensayo) }">
              <div class="card-header">
                <input
                  type="checkbox"
                  :checked="isSelected(ensayo)"
                  @change="toggleSelectEnsayo(ensayo)"
                  class="table-checkbox"
                />
                <div class="card-info" @click="viewEnsayo(ensayo)">
                  <span class="ciclo-badge">{{ ensayo.ciclo }}</span>
                  <h5>{{ ensayo.descripcion }}</h5>
                  <span class="codigo-text">{{ ensayo.codigo }}</span>
                </div>
                <div class="card-actions">
                  <button class="icon-btn" @click="openEditModal(ensayo)" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="icon-btn danger" @click="confirmDelete(ensayo)" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <span class="info-label">Área</span>
                  <span class="info-value">
                    <span v-if="ensayo.area">{{ ensayo.area }}</span>
                    <span v-if="ensayo.rama" style="display:inline-block;margin-left:0.5rem;color:var(--sena-muted);font-weight:600">{{ ensayo.rama }}</span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Subárea</span>
                  <span class="info-value">
                    <span v-if="ensayo.subarea">{{ ensayo.subarea }}</span>
                    <span v-else-if="ensayo.subrama" style="color:var(--sena-muted);font-weight:600">{{ ensayo.subrama }}</span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Inscripción</span>
                  <span class="info-value">{{ ensayo.inscripcionInicio }} - {{ ensayo.inscripcionFin }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Inicio ensayo</span>
                  <span class="info-value">{{ ensayo.fechaInicio }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Estado</span>
                  <div class="status-toggle">
                    <button
                      class="toggle-btn"
                      :class="{ 'active': ensayo.disponible }"
                      @click="toggleEnsayoStatus(ensayo)"
                      :disabled="ensayo.updating"
                    >
                      <span class="toggle-dot"></span>
                    </button>
                    <span class="status-text" :class="ensayo.disponible ? 'abierto' : 'cerrado'">
                      {{ ensayo.disponible ? 'Abierto' : 'Cerrado' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío móvil -->
            <div v-if="filteredEnsayos.length === 0" class="empty-card">
              <div class="empty-icon">
                <i class="bi bi-clipboard-data"></i>
              </div>
              <h5 v-if="ensayos.length === 0">No hay ensayos propuestos</h5>
              <h5 v-else>No se encontraron ensayos</h5>
              <p v-if="ensayos.length === 0">Aún no existen ensayos registrados en la base de datos.</p>
              <p v-else>No hay ensayos que coincidan con los filtros aplicados</p>
              <button class="action-btn secondary" @click="clearFilters">
                <i class="bi bi-arrow-counterclockwise"></i>
                <span>Limpiar filtros</span>
              </button>
            </div>
          </div>

          <!-- Paginación -->
          <div class="table-footer">
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
              <span>{{ startItem }}-{{ endItem }} de {{ filteredEnsayos.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <Teleport to="body">
      <div v-if="ensayoToDelete" class="modal-overlay" @click.self="cancelDelete">
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
                <h6>{{ ensayoToDelete.descripcion }}</h6>
                <p>Código: {{ ensayoToDelete.codigo }}</p>
                <span class="ciclo-badge">{{ ensayoToDelete.ciclo }}</span>
                <span v-if="ensayoToDelete.area" class="area-badge" style="margin-left: 0.5rem;">{{ ensayoToDelete.area }}</span>
                <span v-if="ensayoToDelete.rama" class="rama-badge" style="margin-left: 0.5rem;">{{ ensayoToDelete.rama }}</span>
              </div>
            </div>
            <p class="delete-message">
              ¿Estás seguro de que deseas eliminar permanentemente el ensayo <strong>{{ ensayoToDelete.descripcion }}</strong>?
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
              @click="deleteEnsayo"
              :disabled="deleteConfirmationRequired && deleteConfirmText !== 'ELIMINAR'"
            >
              <i class="bi bi-trash"></i>
              Eliminar Ensayo
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de eliminación masiva -->
    <Teleport to="body">
      <div v-if="showBulkDeleteModal" class="modal-overlay" @click.self="showBulkDeleteModal = false">
        <div class="modal-container">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
              Eliminar Ensayos Seleccionados
            </h5>
            <button class="modal-close-btn" @click="showBulkDeleteModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="warning-box">
              <i class="bi bi-exclamation-circle-fill"></i>
              <span>Estás a punto de eliminar {{ selectedEnsayos.length }} ensayos. Esta acción no se puede deshacer.</span>
            </div>
            <div class="bulk-delete-list">
              <div v-for="ensayo in selectedEnsayosData" :key="ensayo.id" class="bulk-delete-item">
                <span>{{ ensayo.descripcion }}</span>
                <span class="text-muted">{{ ensayo.codigo }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="showBulkDeleteModal = false">
              Cancelar
            </button>
            <button class="modal-btn danger" @click="confirmBulkDelete">
              <i class="bi bi-trash"></i>
              Eliminar {{ selectedEnsayos.length }} Ensayos
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Crear/Editar Ensayo -->
    <Teleport to="body">
      <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click.self="closeModals">
        <div class="modal-container form-modal">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="showCreateModal ? 'bi bi-plus-circle-fill' : 'bi bi-pencil-square'"></i>
              {{ showCreateModal ? 'Crear Nuevo Ensayo' : 'Editar Ensayo' }}
            </h5>
            <button class="modal-close-btn" @click="closeModals">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Ciclo *</label>
                <input
                  v-model="createEditForm.ciclo"
                  type="text"
                  class="form-input"
                  placeholder="Ej: Micro 01"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Código *</label>
                <input
                  v-model="createEditForm.codigo"
                  type="text"
                  class="form-input"
                  placeholder="Ej: VOL-PIP-MIC-001"
                  required
                />
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Descripción *</label>
                <input
                  v-model="createEditForm.descripcion"
                  type="text"
                  class="form-input"
                  placeholder="Ej: Micropipeta de volumen fijo"
                  required
                />
              </div>
              <div class="form-group" v-if="!createEditForm.ramaId">
                <label class="form-label">Área *</label>
                <select v-model="createEditForm.areaId" class="form-select" @change="onAreaChange" :required="!createEditForm.ramaId">
                  <option :value="null">Seleccionar área...</option>
                  <option v-for="a in areasList" :key="a.id" :value="a.id">{{ a.nombre || a.name }}</option>
                </select>
              </div>

              <div class="form-group" v-if="!createEditForm.areaId">
                <label class="form-label">Rama</label>
                <select v-model="createEditForm.ramaId" class="form-select" @change="onRamaChange">
                  <option :value="null">Seleccionar rama...</option>
                  <option v-for="r in ramasList" :key="r.id" :value="r.id">{{ r.nombre || r.name }}</option>
                </select>
              </div>

              <div class="form-group" v-if="!createEditForm.ramaId">
                <label class="form-label">Subárea *</label>
                <select v-model="createEditForm.subareaId" class="form-select" :required="!createEditForm.ramaId">
                  <option :value="null">Seleccionar subárea...</option>
                  <option v-for="s in currentSubareas" :key="s.id" :value="s.id">{{ s.nombre || s.name }}</option>
                </select>
              </div>

              <div class="form-group" v-if="!createEditForm.areaId">
                <label class="form-label">Subrama</label>
                <select v-model="createEditForm.subramaId" class="form-select">
                  <option :value="null">Seleccionar subrama...</option>
                  <option v-for="sr in currentSubramas" :key="sr.id" :value="sr.id">{{ sr.nombre || sr.name }}</option>
                </select>
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
                <label class="form-label">Fecha de Inicio del Ensayo *</label>
                <input
                  v-model="createEditForm.fechaInicio"
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
                <!-- Precio removido del modal según petición -->
              </div>
              <div class="form-group row-type-state">
                <div v-if="createEditForm.ramaId" class="left">
                  <label class="form-label">Tipo</label>
                  <select v-model="createEditForm.tipo" class="form-select select-match">
                    <option value="principal">Principal</option>
                    <option value="secundario">Secundario</option>
                  </select>
                </div>
                <div class="right">
                  <label class="form-label">Estado</label>
                  <select v-model="createEditForm.disponible" class="form-select right-select">
                    <option :value="true">Abierto (Disponible)</option>
                    <option :value="false">Cerrado (No disponible)</option>
                  </select>
                </div>
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
              {{ showCreateModal ? 'Crear Ensayo' : 'Guardar Cambios' }}
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
import { useRouter } from 'vue-router'


interface Ensayo {
  id: number | string
  ciclo: string
  descripcion: string
  codigo: string
  area: string
  subarea: string
  inscripcionInicio: string
  inscripcionFin: string
  fechaInicio: string
  fechaDetalle: string
  disponible: boolean
  precio?: string
  updating?: boolean
  backendId?: number | string
}

const router = useRouter()
const { currentTheme } = useTheme()

// Estado de filtros
const searchQuery = ref('')
const selectedArea = ref<string | null>(null)
const selectedRama = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)
const showFilters = ref(true)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Selección múltiple
const selectedEnsayos = ref<Set<number | string>>(new Set())
const showBulkDeleteModal = ref(false)
const deleteConfirmationRequired = ref(true)
const deleteConfirmText = ref('')

// Estado para eliminar individual
const ensayoToDelete = ref<Ensayo | null>(null)

// Modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingEnsayoId = ref<string | number | null>(null)

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType = ref('info')
let toastTimer: ReturnType<typeof setTimeout> | null = null

// Formulario (usamos IDs para area/subarea)
const createEditForm = ref({
  ciclo: '',
  descripcion: '',
  codigo: '',
  areaId: null as number | null,
  subareaId: null as number | null,
  ramaId: null as number | null,
  subramaId: null as number | null,
  inscripcionInicio: '',
  inscripcionFin: '',
  fechaInicio: '',
  fechaDetalle: '',
  disponible: true,
  tipo: 'principal'
})

// Catálogos cargados desde API
const areasList = ref<any[]>([])
const subareasMap = ref<Record<number, any[]>>({})
const currentSubareas = computed(() => {
  const aid = createEditForm.value.areaId
  if (!aid) return []
  return subareasMap.value[aid] || []
})

const fetchAreas = async () => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/areas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const data = await resp.json()
    areasList.value = Array.isArray(data) ? data : (data.data || [])
    // prefetch subareas for each area
    for (const a of areasList.value) {
      await fetchSubareas(a.id)
    }
  } catch (err) {
    console.error('Error fetching areas', err)
  }
}

const fetchSubareas = async (areaId: number) => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/areas/${areaId}/subareas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const data = await resp.json()
    subareasMap.value[areaId] = Array.isArray(data) ? data : (data.data || [])
  } catch (err) {
    console.error('Error fetching subareas for', areaId, err)
  }
}

// Ramas
const ramasList = ref<any[]>([])
const ramasSubramasMap = ref<Record<number, any[]>>({})
const fetchRamas = async () => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/ramas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const data = await resp.json()
    ramasList.value = Array.isArray(data) ? data : (data.data || [])
    // prefetch subramas for each rama so UI can resolve subrama names
    try {
      await Promise.all(ramasList.value.map((r: any) => fetchSubramasForRama(r.id)))
    } catch (e) {
      console.error('Error prefetching subramas', e)
    }
  } catch (err) {
    console.error('Error fetching ramas', err)
  }
}

const fetchSubramasForRama = async (ramaId: number) => {
  try {
    if (!ramaId) return
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/ramas/${ramaId}/subramas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const data = await resp.json()
    ramasSubramasMap.value[ramaId] = Array.isArray(data) ? data : (data.data || [])
  } catch (err) {
    console.error('Error fetching subramas for rama', ramaId, err)
  }
}

const currentSubramas = computed(() => {
  const rid = createEditForm.value.ramaId
  if (!rid) return []
  return ramasSubramasMap.value[rid] || []
})

const onRamaChange = () => {
  const rid = createEditForm.value.ramaId
  // when selecting a rama, clear area/subarea to allow switching between flows
  createEditForm.value.subramaId = null
  createEditForm.value.areaId = null
  createEditForm.value.subareaId = null
  // reset tipo when rama is cleared
  if (!rid) createEditForm.value.tipo = 'principal'
  if (rid) fetchSubramasForRama(rid)
}

const onAreaChange = () => {
  const aid = createEditForm.value.areaId
  // when selecting an area, clear rama/subrama to allow switching between flows
  createEditForm.value.subareaId = null
  createEditForm.value.ramaId = null
  createEditForm.value.subramaId = null
  // reset tipo when switching to area flow
  createEditForm.value.tipo = 'principal'
  if (aid) fetchSubareas(aid)
}

// Datos de áreas/subáreas provistos por backend
// `areasList` y `subareasMap` se cargan desde API; derive listas de nombres para la UI
const availableAreas = computed(() => areasList.value.map(a => a.nombre || a.name).filter(Boolean))
const availableSubareas = computed(() => {
  const names = new Set<string>()
  for (const key of Object.keys(subareasMap.value)) {
    const arr = subareasMap.value[Number(key)] || []
    for (const s of arr) names.add(s.nombre || s.name || '')
  }
  return Array.from(names).filter(Boolean)
})

const availableRamas = computed(() => ramasList.value.map(r => r.nombre || r.name).filter(Boolean))

// Servicios (iconos) para el filtro — provistos por el usuario
interface Service {
  id: number
  name: string
  icon: string
  iconWhite: string
  route?: string
}

const servicesRow1: Service[] = [
  { id: 1, name: 'Agua', icon: new URL('../../../../image/icons/Servicios/Black/Agua.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Agua-White.svg', import.meta.url).href, route: '/servicios/agua' },
  { id: 2, name: 'Alimentos', icon: new URL('../../../../image/icons/Servicios/Black/Alimentos.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Alimentos-White.svg', import.meta.url).href, route: '/servicios/alimentos' },
  { id: 3, name: 'Masa', icon: new URL('../../../../image/icons/Servicios/Black/Masa.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Masa-White.svg', import.meta.url).href, route: '/servicios/masa' },
  { id: 4, name: 'Temperatura', icon: new URL('../../../../image/icons/Servicios/Black/Temperatura.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Temperatura-White.svg', import.meta.url).href, route: '/servicios/temperatura' },
  { id: 5, name: 'Presión', icon: new URL('../../../../image/icons/Servicios/Black/Presion.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Presion-White.svg', import.meta.url).href, route: '/servicios/presion' },
  { id: 6, name: 'Volumen', icon: new URL('../../../../image/icons/Servicios/Black/Volumen.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Volumen-White.svg', import.meta.url).href, route: '/servicios/volumen' }
]

const servicesRow2: Service[] = [
  { id: 7, name: 'Densidad', icon: new URL('../../../../image/icons/Servicios/Black/Densidad.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Densidad-White.svg', import.meta.url).href, route: '/servicios/densidad' },
  { id: 8, name: 'Eléctrica', icon: new URL('../../../../image/icons/Servicios/Black/Electrica.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Electrica-White.svg', import.meta.url).href, route: '/servicios/electrica' },
  { id: 9, name: 'Dimensional', icon: new URL('../../../../image/icons/Servicios/Black/Dimensional.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Dimensional-White.svg', import.meta.url).href, route: '/servicios/dimensional' },
  { id: 10, name: 'Humedad', icon: new URL('../../../../image/icons/Servicios/Black/Humedad.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Humedad-White.svg', import.meta.url).href, route: '/servicios/humedad' },
  { id: 11, name: 'Flujo', icon: new URL('../../../../image/icons/Servicios/Black/Flujos.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Flujos-White.svg', import.meta.url).href, route: '/servicios/flujo' },
  { id: 12, name: 'Mediciones Especiales', icon: new URL('../../../../image/icons/Servicios/Black/Especiales.svg', import.meta.url).href, iconWhite: new URL('../../../../image/icons/Servicios/White/Especiales-White.svg', import.meta.url).href, route: '/servicios/mediciones-especiales' }
]

// servicesRow1 and servicesRow2 are used as area-like chips in the UI

const servicesCombined = [...servicesRow1, ...servicesRow2]
const servicesByName = new Map<string, Service>(servicesCombined.map(s => [s.name, s]))
// Mostrar en el filtro las áreas representadas por los servicios (asegura Agua/Alimentos visibles)
const allowedAreas = computed(() => {
  // Priorizar la lista de servicios (puede incluir elementos no presentes en availableAreas)
  const svcNames = servicesCombined.map(s => s.name)
  // Mantener el orden de servicesCombined pero garantizar unicidad
  return Array.from(new Set(svcNames))
})

// Datos de ensayos (se cargan desde backend)
const ensayos = ref<Ensayo[]>([])

// Computed
const totalEnsayos = computed(() => ensayos.value.length)
const ensayosAbiertos = computed(() => ensayos.value.filter(e => e.disponible).length)
const ensayosCerrados = computed(() => ensayos.value.filter(e => !e.disponible).length)

const hasActiveFilters = computed(() => !!(searchQuery.value || selectedArea.value || selectedRama.value || selectedStatus.value))

const filteredEnsayos = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return ensayos.value.filter(e => {
    const matchesSearch = !query ||
      e.ciclo.toLowerCase().includes(query) ||
      e.descripcion.toLowerCase().includes(query) ||
      e.codigo.toLowerCase().includes(query) ||
      e.area.toLowerCase().includes(query) ||
      e.subarea.toLowerCase().includes(query)
    const matchesArea = !selectedArea.value || e.area === selectedArea.value
    const matchesRama = !selectedRama.value || e.rama === selectedRama.value
    const matchesStatus = !selectedStatus.value ||
      (selectedStatus.value === 'abierto' && e.disponible) ||
      (selectedStatus.value === 'cerrado' && !e.disponible)

    return matchesSearch && matchesArea && matchesRama && matchesStatus
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEnsayos.value.length / itemsPerPage.value)))

const paginatedEnsayos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredEnsayos.value.slice(start, start + itemsPerPage.value)
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
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredEnsayos.value.length))

// Selección
const isSelected = (ensayo: Ensayo) => selectedEnsayos.value.has(ensayo.id)
const isAllSelected = computed(() => {
  return paginatedEnsayos.value.length > 0 && paginatedEnsayos.value.every(e => selectedEnsayos.value.has(e.id))
})

const selectedEnsayosData = computed(() => {
  return ensayos.value.filter(e => selectedEnsayos.value.has(e.id))
})

const toggleSelectEnsayo = (ensayo: Ensayo) => {
  const newSet = new Set(selectedEnsayos.value)
  if (newSet.has(ensayo.id)) newSet.delete(ensayo.id)
  else newSet.add(ensayo.id)
  selectedEnsayos.value = newSet
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const newSet = new Set(selectedEnsayos.value)
    paginatedEnsayos.value.forEach(e => newSet.delete(e.id))
    selectedEnsayos.value = newSet
  } else {
    const newSet = new Set(selectedEnsayos.value)
    paginatedEnsayos.value.forEach(e => newSet.add(e.id))
    selectedEnsayos.value = newSet
  }
}

// Filtros
const toggleAreaFilter = (area: string) => {
  selectedArea.value = selectedArea.value === area ? null : area
  currentPage.value = 1
  selectedEnsayos.value = new Set()
}

const toggleRamaFilter = (rama: string) => {
  selectedRama.value = selectedRama.value === rama ? null : rama
  currentPage.value = 1
  selectedEnsayos.value = new Set()
}

const toggleStatusFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status
  currentPage.value = 1
  selectedEnsayos.value = new Set()
}

// Maneja clics en chips que pueden representar áreas o ramas (ej. Agua/Alimentos son ramas)
const handleFilterClick = (name: string) => {
  if (availableRamas.value.includes(name)) {
    toggleRamaFilter(name)
  } else {
    toggleAreaFilter(name)
  }
}

const getAreaCount = (area: string) => ensayos.value.filter(e => e.area === area).length
const getSubareaCount = (subarea: string) => ensayos.value.filter(e => e.subarea === subarea).length
const getRamaCount = (rama: string) => ensayos.value.filter(e => e.rama === rama).length

// Contador de ensayos asociados a un servicio (tolerante a distintos esquemas)
const getServiceCount = (s: Service) => {
  const norm = (v: any) => {
    if (v === null || v === undefined) return ''
    try {
      const s0 = String(v).normalize('NFD').replace(/\p{Diacritic}/gu, '')
      return s0.toLowerCase().trim()
    } catch (e) {
      return String(v).toLowerCase().trim()
    }
  }
  const target = norm(s.name)
  const matches = ensayos.value.filter(e => {
    const anyE: any = e as any
    // fields to check
    const fields = [anyE.area, anyE.subarea, anyE.rama, anyE.subrama, anyE.servicio]
    // check direct name/id matches
    if (anyE.ramaId && String(anyE.ramaId) === String(s.id)) return true
    if (anyE.subramaId && String(anyE.subramaId) === String(s.id)) return true
    if (anyE.servicioId && String(anyE.servicioId) === String(s.id)) return true

    for (const f of fields) {
      const v = norm(f)
      if (!v) continue
      if (v === target) return true
      if (v.includes(target)) return true
    }

    if (Array.isArray(anyE.servicios)) {
      for (const item of anyE.servicios) {
        const iv = typeof item === 'object' ? (item.name || item.nombre || item.id) : item
        const v = norm(iv)
        if (!v) continue
        if (v === target || v.includes(target)) return true
      }
    }

    return false
  })
  // console.debug(`service ${s.name} -> ${matches.length}`)
  return matches.length
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedArea.value = null
  selectedRama.value = null
  selectedStatus.value = null
  currentPage.value = 1
  selectedEnsayos.value = new Set()
}

const handleSearch = () => {
  currentPage.value = 1
  selectedEnsayos.value = new Set()
}

// Paginación
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// CRUD
const toggleEnsayoStatus = async (ensayo: Ensayo) => {
  ensayo.updating = true
  const prevState = ensayo.disponible

  try {
    const token = getAuthToken()
    const idToUse = (ensayo as any).backendId || ensayo.id

    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${idToUse}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ disponible: !ensayo.disponible })
      })
      if (resp.ok) {
        const body = await resp.json().catch(() => ({}))
        const updated = body.data || body
        if (updated && typeof updated.disponible !== 'undefined') ensayo.disponible = !!updated.disponible
        else ensayo.disponible = !ensayo.disponible
      } else {
        throw new Error('API error')
      }
    } else {
      ensayo.disponible = !ensayo.disponible
    }
    showToast(`Ensayo ${ensayo.disponible ? 'abierto' : 'cerrado'} correctamente`, 'success', 'Actualizado')
  } catch (err) {
    ensayo.disponible = prevState
    showToast('Error al actualizar el estado', 'error', 'Error')
  } finally {
    ensayo.updating = false
  }
}

const viewEnsayo = (ensayo: Ensayo) => {
  const id = (ensayo as any).backendId || ensayo.id
  router.push(`/admin/ensayos/${id}`)
}

const confirmDelete = (ensayo: Ensayo) => {
  ensayoToDelete.value = { ...ensayo }
  deleteConfirmText.value = ''
}

const cancelDelete = () => {
  ensayoToDelete.value = null
  deleteConfirmText.value = ''
}

const deleteEnsayo = async () => {
  if (!ensayoToDelete.value) return
  if (deleteConfirmationRequired.value && deleteConfirmText.value !== 'ELIMINAR') return

  try {
    const token = getAuthToken()
    const idToUse = (ensayoToDelete.value as any).backendId || ensayoToDelete.value.id

    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${idToUse}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!resp.ok) throw new Error('API error')
    }

    ensayos.value = ensayos.value.filter(e => ((e as any).backendId || e.id) !== idToUse)
    selectedEnsayos.value.delete(idToUse)
    showToast(`Ensayo "${ensayoToDelete.value.descripcion}" eliminado correctamente`, 'success', 'Eliminado')
  } catch (err) {
    showToast('Error al eliminar el ensayo', 'error', 'Error')
  } finally {
    ensayoToDelete.value = null
    deleteConfirmText.value = ''
  }
}

// Acciones masivas
const bulkOpen = async () => {
  try {
    const token = getAuthToken()
    for (const ensayoId of selectedEnsayos.value) {
      const ensayo = ensayos.value.find(e => e.id === ensayoId)
      if (ensayo && !ensayo.disponible) {
        const idToUse = (ensayo as any).backendId || ensayo.id
        if (token) {
          await fetch(`${API_BASE}/api/ensayos/${idToUse}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ disponible: true })
          })
        }
        ensayo.disponible = true
      }
    }
    showToast(`${selectedEnsayos.value.size} ensayos abiertos`, 'success', 'Apertura Masiva')
    selectedEnsayos.value = new Set()
  } catch (err) {
    showToast('Error en la apertura masiva', 'error', 'Error')
  }
}

const bulkClose = async () => {
  try {
    const token = getAuthToken()
    for (const ensayoId of selectedEnsayos.value) {
      const ensayo = ensayos.value.find(e => e.id === ensayoId)
      if (ensayo && ensayo.disponible) {
        const idToUse = (ensayo as any).backendId || ensayo.id
        if (token) {
          await fetch(`${API_BASE}/api/ensayos/${idToUse}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ disponible: false })
          })
        }
        ensayo.disponible = false
      }
    }
    showToast(`${selectedEnsayos.value.size} ensayos cerrados`, 'success', 'Cierre Masivo')
    selectedEnsayos.value = new Set()
  } catch (err) {
    showToast('Error en el cierre masivo', 'error', 'Error')
  }
}

const bulkDelete = () => {
  if (selectedEnsayos.value.size > 0) {
    showBulkDeleteModal.value = true
  }
}

const confirmBulkDelete = async () => {
  try {
    const token = getAuthToken()
    for (const ensayoId of selectedEnsayos.value) {
      const ensayo = ensayos.value.find(e => e.id === ensayoId)
      const idToUse = (ensayo as any)?.backendId || ensayoId
      if (token) {
        await fetch(`${API_BASE}/api/ensayos/${idToUse}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    }
    ensayos.value = ensayos.value.filter(e => !selectedEnsayos.value.has(e.id))
    const count = selectedEnsayos.value.size
    selectedEnsayos.value = new Set()
    showBulkDeleteModal.value = false
    showToast(`${count} ensayos eliminados`, 'success', 'Eliminación Masiva')
  } catch (err) {
    showToast('Error en la eliminación masiva', 'error', 'Error')
  }
}

// Formulario
const isFormValid = computed(() => {
  const f = createEditForm.value
  if (!f.ciclo || !f.descripcion || !f.codigo) return false
  // require either (area + subarea) or rama
  const hasAreaPair = !!(f.areaId && f.subareaId)
  const hasRama = !!f.ramaId
  if (!hasAreaPair && !hasRama) return false
  if (!f.inscripcionInicio || !f.inscripcionFin || !f.fechaInicio) return false
  return true
})

const openCreateModal = () => {
  createEditForm.value = {
    ciclo: '',
    descripcion: '',
    codigo: '',
    areaId: null,
    subareaId: null,
    ramaId: null,
    subramaId: null,
    inscripcionInicio: '',
    inscripcionFin: '',
    fechaInicio: '',
    fechaDetalle: '',
    disponible: true,
    // precio removido
  }
  showCreateModal.value = true
  showEditModal.value = false
  editingEnsayoId.value = null
}

const openEditModal = (ensayo: Ensayo) => {
  // try to map area/subarea ids when present
  let areaId = (ensayo as any).areaId || null
  let subareaId = (ensayo as any).subareaId || null
  if (!areaId && ensayo.area) {
    const a = areasList.value.find(x => (x.nombre || x.name) === ensayo.area)
    if (a) areaId = a.id
  }
  if (!subareaId && subareasMap.value[areaId || 0]) {
    const s = subareasMap.value[areaId || 0].find((x: any) => (x.nombre || x.name) === ensayo.subarea)
    if (s) subareaId = s.id
  }

  createEditForm.value = {
    ciclo: ensayo.ciclo,
    descripcion: ensayo.descripcion,
    codigo: ensayo.codigo,
    areaId: areaId,
    subareaId: subareaId,
    ramaId: (ensayo as any).ramaId || null,
    subramaId: (ensayo as any).subramaId || null,
    inscripcionInicio: ensayo.inscripcionInicio,
    inscripcionFin: ensayo.inscripcionFin,
    fechaInicio: ensayo.fechaInicio,
    fechaDetalle: ensayo.fechaDetalle || '',
    disponible: ensayo.disponible,
    tipo: (ensayo as any).tipo || 'principal'
  }
  // fetch subramas for selected rama so select options appear
  if (createEditForm.value.ramaId) fetchSubramasForRama(createEditForm.value.ramaId)
  if (createEditForm.value.areaId) fetchSubareas(createEditForm.value.areaId)
  editingEnsayoId.value = (ensayo as any).backendId || ensayo.id
  showEditModal.value = true
  showCreateModal.value = false
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingEnsayoId.value = null
}

const submitForm = async () => {
  if (!isFormValid.value) return

  try {
    const token = getAuthToken()

    if (showCreateModal.value) {
      const payload = { ...createEditForm.value }
      // ensure `anio` is set (DB requires not-null). Derive from fechaInicio if missing.
      if (!payload.anio) {
        if (payload.fechaInicio) {
          const d = new Date(payload.fechaInicio)
          if (!isNaN(d.getTime())) payload.anio = d.getFullYear()
        }
        if (!payload.anio) payload.anio = new Date().getFullYear()
      }
      // map frontend field names to backend expected names
      if (payload.fechaInicio) {
        payload.fechaInicioEnsayo = payload.fechaInicio
        delete payload.fechaInicio
      }

      if (token) {
        const resp = await fetch(`${API_BASE}/api/ensayos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}))
          throw new Error(body.message || 'Error del servidor')
        }
        await fetchEnsayosFromApi()
      } else {
        // offline fallback
        ensayos.value.push({ id: Date.now(), ...payload })
      }
      showToast('Ensayo creado correctamente', 'success', 'Creado')
    } else if (showEditModal.value && editingEnsayoId.value) {
      const payload = { ...createEditForm.value }
      if (!payload.anio) {
        if (payload.fechaInicio) {
          const d = new Date(payload.fechaInicio)
          if (!isNaN(d.getTime())) payload.anio = d.getFullYear()
        }
        if (!payload.anio) payload.anio = new Date().getFullYear()
      }
      // map frontend field names to backend expected names
      if (payload.fechaInicio) {
        payload.fechaInicioEnsayo = payload.fechaInicio
        delete payload.fechaInicio
      }

      if (token) {
        const resp = await fetch(`${API_BASE}/api/ensayos/${editingEnsayoId.value}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}))
          throw new Error(body.message || 'Error del servidor')
        }
        await fetchEnsayosFromApi()
      } else {
        const idx = ensayos.value.findIndex(e => ((e as any).backendId || e.id) === editingEnsayoId.value)
        if (idx !== -1) {
          ensayos.value[idx] = { ...ensayos.value[idx], ...payload }
        }
      }
      showToast('Ensayo actualizado correctamente', 'success', 'Actualizado')
    }
    closeModals()
  } catch (err: any) {
    showToast(err.message || 'Error al procesar la solicitud', 'error', 'Error')
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

// Exportar
const exportData = () => {
  const headers = ['ID', 'Ciclo', 'Descripción', 'Código', 'Área', 'Subárea', 'Inicio Inscripción', 'Fin Inscripción', 'Fecha Inicio', 'Estado', 'Precio']
  const data = ensayos.value.map(e => [
    e.id,
    e.ciclo,
    e.descripcion,
    e.codigo,
    e.area,
    e.subarea,
    e.inscripcionInicio,
    e.inscripcionFin,
    e.fechaInicio,
    e.disponible ? 'Abierto' : 'Cerrado',
    e.precio || ''
  ])

  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ensayos-sena-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast('Archivo CSV exportado correctamente', 'success', 'Exportado')
}

// Toast
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

// API fetch
const fetchEnsayosFromApi = async () => {
  try {
    const token = getAuthToken()
    if (!token) return
    const resp = await fetch(`${API_BASE}/api/ensayos?limit=1000&page=1`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!resp.ok) return
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : (body.data || [])
    if (rows.length > 0) {
      ensayos.value = rows.map((r: any) => {
        const areaId = r.areaId || r.area_id || null
        const subareaId = r.subareaId || r.id_subarea || null
        const ramaId = r.ramaId || r.rama_id || null
        const subramaId = r.subramaId || r.subrama_id || null
        const areaName = r.area || (areaId ? (areasList.value.find(a => a.id === areaId)?.nombre || '') : '')
        let subareaName = r.subarea || ''
        if (!subareaName && subareaId) {
          if (areaId) {
            subareaName = subareasMap.value[areaId]?.find((s: any) => s.id === subareaId)?.nombre || ''
          }
          if (!subareaName) {
            for (const k of Object.keys(subareasMap.value)) {
              const arr = subareasMap.value[Number(k)] || []
              const s = arr.find((x: any) => x.id === subareaId)
              if (s) { subareaName = s.nombre || s.name || ''; break }
            }
          }
        }
        // derive rama name from subarea/rama mapping if available
        const ramaName = r.rama || (() => {
          // try to find rama via subareasMap: subarea objects might have rama info
          if (subareaId && areaId) {
            const s = subareasMap.value[areaId]?.find((x: any) => x.id === subareaId)
            if (s && s.rama_nombre) return s.rama_nombre
          }
          // fallback: try to match by rama id/name in ramasList
          if (r.ramaId) return ramasList.value.find(rr => rr.id === r.ramaId)?.nombre || ''
          return ''
        })()
        // derive subrama name from ramasSubramasMap when possible
        const subramaName = r.subrama || (() => {
          if (subramaId && ramaId) {
            const arr = ramasSubramasMap.value[ramaId] || []
            const s = arr.find((x: any) => x.id === subramaId)
            if (s) return s.nombre || s.name || ''
          }
          // try lookup by id across all ramasSubramasMap as fallback
          for (const key of Object.keys(ramasSubramasMap.value)) {
            const arr = ramasSubramasMap.value[Number(key)] || []
            const s = arr.find((x: any) => x.id === subramaId)
            if (s) return s.nombre || s.name || ''
          }
          return ''
        })()
        return {
          id: r.id_ensayo || r.id || Date.now(),
          ciclo: r.ciclo || '',
          descripcion: r.descripcion || '',
          codigo: r.codigo || '',
          area: areaName,
          subarea: subareaName,
          areaId: areaId,
          subareaId: subareaId,
          ramaId: ramaId,
          subramaId: subramaId,
          rama: ramaName,
          subrama: subramaName,
          inscripcionInicio: r.inscripcionInicio || r.inscripcion_inicio || '',
          inscripcionFin: r.inscripcionFin || r.inscripcion_fin || '',
          fechaInicio: r.fechaInicio || r.fecha_inicio || r.fechaInicioEnsayo || r.fecha_inicio_ensayo || '',
          fechaDetalle: r.fechaDetalle || r.fecha_detalle || '',
          disponible: r.disponible !== undefined ? !!r.disponible : true,
          tipo: r.tipo || 'principal',
          precio: r.precio || '',
          backendId: r.id_ensayo || r.id
        }
      })
      console.debug('ensayos loaded', ensayos.value.slice(0,20))
    }
  } catch (err) {
    console.error('Error fetching ensayos:', err)
  }
}

onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  await fetchAreas()
  await fetchRamas()
  await fetchEnsayosFromApi()
})

// Watch para tema
import { watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { API_BASE } from '@/config/api'
watch(currentTheme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-bs-theme', newTheme)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ============================================================
   DESIGN TOKENS — global a propósito.
   El componente escribe data-bs-theme tanto en su div raíz como en
   <html> (ver onMounted/watch en el script), así que definir el tema
   aquí, sobre :root, garantiza que tanto el contenido normal como los
   modales/toast (teletransportados a <body>) reciban el mismo color.
   ============================================================ */
:root {
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Superficie */

  /* Texto */

  /* Acento (marca) */

  /* Semántico */

  /* Escala */
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --shadow-sm: 0 1px 3px rgba(20, 24, 16, 0.06), 0 1px 2px rgba(20,24,16,0.04);
  --shadow-md: 0 6px 20px rgba(20, 24, 16, 0.08);
  --shadow-lg: 0 16px 40px rgba(20, 24, 16, 0.14);
  --transition: all 0.15s ease;
}

[data-bs-theme="dark"] {
  --bg: #0e100d;
  --surface: #161a13;
  --surface-sunken: #12150f;
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);

  --text: #eaeee4;
  --text-secondary: #99a38e;
  --text-tertiary: #6c7563;

  --brand: #7cbb55;
  --brand-hover: #8fc96b;
  --brand-soft: rgba(124,187,85,0.14);
  --brand-soft-border: rgba(124,187,85,0.3);

  --danger: #e2696a;
  --danger-soft: rgba(226,105,106,0.12);
  --warning: #dcaa4c;
  --warning-soft: rgba(220,170,76,0.12);
  --neutral-soft: rgba(255,255,255,0.05);
}
</style>

<style scoped>
/* Los tokens de color (--bg, --surface, --brand, etc.) viven ahora en
   un <style> global al final del archivo. Es imprescindible: Vue no
   puede "scopear" un selector :root (es el <html>, no un nodo de este
   componente) y los modales/toast se teletransportan fuera de este
   componente hacia <body>, así que si las variables solo existieran
   aquí dentro, ni el :root funcionaría ni los modales las heredarían. */

/* ============================================================
   BASE
   ============================================================ */
.admin-ensayos-page {
  font-family: var(--font-body);
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

.admin-ensayos-page .container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.75rem;
}

/* ============================================================
   HEADER
   ============================================================ */
.admin-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1.5rem 0 1.75rem;
}

.breadcrumb-nav { margin-bottom: 1.25rem; }
.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 0.78rem;
}
.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--text-tertiary);
}
.breadcrumb-item.active {
  color: var(--text-secondary);
  font-weight: 600;
}
.breadcrumb-link {
  color: var(--text-tertiary);
  text-decoration: none;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.breadcrumb-link:hover { color: var(--brand); }
.breadcrumb-separator {
  color: var(--border-strong);
  font-size: 0.6rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  flex-wrap: wrap;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 0.4rem;
}

.page-title {
  font-family: var(--font-body);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  margin: 0 0 0.3rem;
  line-height: 1.25;
}
.page-subtitle {
  color: var(--text-secondary);
  font-size: 0.86rem;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  min-width: 148px;
  transition: var(--transition);
}
.stat-card:hover {
  border-color: var(--border-strong);
}

.stat-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}
.stat-icon.total { background: var(--neutral-soft); color: var(--text-secondary); }
.stat-icon.abierto { background: var(--brand-soft); color: var(--brand); }
.stat-icon.cerrado { background: var(--neutral-soft); color: var(--text-tertiary); }

.stat-info { display: flex; flex-direction: column; line-height: 1.2; }
.stat-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}
.stat-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 0.1rem;
}

/* ============================================================
   CONTROL SECTION
   ============================================================ */
.control-section {
  padding: 1.25rem 0 0;
}
.control-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}
.control-header {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.control-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.btn-collapse {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.75rem;
}
.btn-collapse:hover {
  background: var(--surface-sunken);
  border-color: var(--border-strong);
  color: var(--text);
}

.control-body {
  padding: 1.1rem 1.25rem;
}
.filters-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
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
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  font-size: 0.85rem;
}
.search-input {
  width: 100%;
  padding: 0.55rem 0.75rem 0.55rem 2.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--text);
  font-size: 0.84rem;
  font-family: var(--font-body);
  transition: var(--transition);
}
.search-input::placeholder { color: var(--text-tertiary); }
.search-input:focus {
  outline: none;
  border-color: var(--brand);
  background: var(--surface);
  box-shadow: 0 0 0 3px var(--brand-soft);
}
.clear-btn {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;
  transition: var(--transition);
  display: flex;
}
.clear-btn:hover { color: var(--text); background: var(--neutral-soft); }

.filter-chips {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
}
.filter-chip:hover {
  border-color: var(--border-strong);
  color: var(--text);
  background: var(--surface);
}
.filter-chip.active {
  background: var(--brand-soft);
  border-color: var(--brand-soft-border);
  color: var(--brand);
  font-weight: 600;
}
.chip-count {
  background: rgba(0,0,0,0.06);
  padding: 0.05rem 0.4rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.filter-chip.active .chip-count {
  background: rgba(63,122,42,0.14);
}
[data-bs-theme="dark"] .chip-count { background: rgba(255,255,255,0.08); }

.actions-group {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.service-icon {
  width: 15px;
  height: 15px;
  object-fit: contain;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
  font-family: var(--font-body);
  white-space: nowrap;
}
.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.action-btn.primary {
  background: var(--brand);
  color: #ffffff;
  border-color: var(--brand);
}
.action-btn.primary:hover:not(:disabled) {
  background: var(--brand-hover);
  border-color: var(--brand-hover);
}
.action-btn.primary i,
.action-btn.primary span { color: #ffffff; }

.action-btn.secondary {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text);
}
.action-btn.secondary:hover:not(:disabled) {
  background: var(--surface-sunken);
  border-color: var(--border-strong);
}
.action-btn.danger-outline {
  background: var(--danger-soft);
  border-color: var(--danger-soft);
  color: var(--danger);
}
.action-btn.danger-outline:hover:not(:disabled) {
  background: var(--danger);
  color: #ffffff;
  border-color: var(--danger);
}

.active-filters {
  margin-top: 0.9rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}
.active-filters-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}
.active-filter-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.22rem 0.6rem;
  background: var(--brand-soft);
  border: 1px solid var(--brand-soft-border);
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  color: var(--brand);
}
.active-filter-tag button {
  background: none;
  border: none;
  color: currentColor;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
}
.active-filter-tag button:hover { opacity: 1; }

/* ============================================================
   TABLE SECTION
   ============================================================ */
.table-section {
  padding: 1rem 0 3rem;
}
.table-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}

.table-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.table-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.15rem;
}
.table-subtitle {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}
.table-controls {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}
.bulk-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: var(--brand-soft);
  border: 1px solid var(--brand-soft-border);
  border-radius: var(--radius-sm);
}
.selected-count {
  font-size: 0.76rem;
  color: var(--brand);
  font-weight: 600;
  padding-left: 0.25rem;
}
.per-page-select {
  padding: 0.4rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--text);
  font-size: 0.78rem;
  font-family: var(--font-body);
  cursor: pointer;
}

.table-responsive {
  overflow-x: auto;
}
.ensayos-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1100px;
}
.ensayos-table thead th {
  padding: 0.65rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.ensayos-table tbody td {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.ensayos-table tbody tr {
  transition: var(--transition);
}
.ensayos-table tbody tr:last-child td { border-bottom: none; }
.ensayos-table tbody tr:hover {
  background: var(--surface-sunken);
}
.ensayos-table tbody tr.selected {
  background: var(--brand-soft);
}

.col-check { width: 40px; text-align: center; }
.col-ciclo { min-width: 100px; }
.col-descripcion { min-width: 220px; }
.col-codigo { min-width: 130px; }
.col-area { min-width: 110px; }
.col-subarea { min-width: 110px; }
.col-fechas { min-width: 150px; }
.col-inicio { min-width: 120px; }
.col-estado { min-width: 120px; }
.col-actions { min-width: 110px; text-align: right; }

.table-checkbox {
  width: 15px;
  height: 15px;
  accent-color: var(--brand);
  cursor: pointer;
}

.ciclo-badge {
  display: inline-block;
  padding: 0.18rem 0.6rem;
  background: var(--brand);
  color: #ffffff;
  border-radius: var(--radius-xs);
  font-size: 0.7rem;
  font-weight: 600;
}
.area-badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  background: var(--brand-soft);
  color: var(--brand);
  border-radius: var(--radius-xs);
  font-size: 0.7rem;
  font-weight: 600;
}
.subarea-badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  background: var(--neutral-soft);
  color: var(--text-secondary);
  border-radius: var(--radius-xs);
  font-size: 0.7rem;
  font-weight: 500;
}
.rama-badge {
  display: inline-block;
  padding: 0.12rem 0.5rem;
  background: transparent;
  border: 1px solid var(--brand-soft-border);
  color: var(--brand);
  border-radius: var(--radius-xs);
  font-size: 0.68rem;
  font-weight: 600;
}
.subrama-badge {
  display: inline-block;
  padding: 0.12rem 0.5rem;
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--text-secondary);
  border-radius: var(--radius-xs);
  font-size: 0.68rem;
  font-weight: 600;
}

.codigo-text {
  font-family: 'SF Mono', 'Courier New', monospace;
  font-size: 0.74rem;
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-xs);
  color: var(--text-secondary);
}

.descripcion-cell {
  display: flex;
  flex-direction: column;
}
.descripcion-text {
  font-weight: 500;
  color: var(--text);
}

.fecha-cell {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.78rem;
  color: var(--text);
}
.fecha-label {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.fecha-detalle {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
.toggle-btn {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: var(--neutral-soft);
  border: 1px solid var(--border);
  cursor: pointer;
  position: relative;
  transition: var(--transition);
  padding: 0;
  flex-shrink: 0;
}
.toggle-btn.active {
  background: var(--brand);
  border-color: var(--brand);
}
.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.toggle-btn:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
.toggle-dot {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  transition: var(--transition);
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.toggle-btn.active .toggle-dot {
  left: 17px;
}
.status-text {
  font-size: 0.78rem;
  font-weight: 500;
}
.status-text.abierto { color: var(--brand); }
.status-text.cerrado { color: var(--text-tertiary); }

.action-buttons {
  display: flex;
  gap: 0.3rem;
  justify-content: flex-end;
}
.icon-btn {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.8rem;
}
.icon-btn:hover {
  background: var(--surface-sunken);
  border-color: var(--border-strong);
  color: var(--text);
}
.icon-btn.danger:hover {
  background: var(--danger-soft);
  border-color: var(--danger);
  color: var(--danger);
}

.empty-row { padding: 3rem 1.5rem; text-align: center; }
.empty-content { padding: 1rem; }
.empty-icon {
  font-size: 2.4rem;
  color: var(--border-strong);
  margin-bottom: 0.85rem;
}
.empty-content h5 {
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.empty-content p {
  color: var(--text-secondary);
  font-size: 0.82rem;
  margin-bottom: 1.25rem;
}

/* ============================================================
   MOBILE CARDS
   ============================================================ */
.mobile-cards { display: none; }

/* ============================================================
   TABLE FOOTER
   ============================================================ */
.table-footer {
  padding: 0.85rem 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.pagination-wrapper {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
.page-btn {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.76rem;
  font-weight: 500;
}
.page-btn:hover:not(:disabled) {
  background: var(--surface-sunken);
  border-color: var(--border-strong);
  color: var(--text);
}
.page-btn.active {
  background: var(--brand);
  border-color: var(--brand);
  color: #ffffff;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-ellipsis {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}
.page-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}
.page-info-separator {
  color: var(--border-strong);
}

/* ============================================================
   MODALS
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 18, 12, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}
.modal-container {
  background: var(--surface);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
}
.form-modal {
  max-width: 620px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.35rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--surface);
  z-index: 1;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}
.modal-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-close-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.8rem;
}
.modal-close-btn:hover {
  background: var(--surface-sunken);
  color: var(--text);
}

.modal-body {
  padding: 1.1rem 1.35rem;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 0.9rem 1.35rem;
  border-top: 1px solid var(--border);
  position: sticky;
  bottom: 0;
  background: var(--surface);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

.warning-icon { color: var(--warning); }
.warning-box {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.7rem 0.9rem;
  background: var(--warning-soft);
  border: 1px solid var(--warning);
  border-radius: var(--radius-sm);
  color: var(--warning);
  font-size: 0.8rem;
  margin-bottom: 0.9rem;
  line-height: 1.45;
}

.delete-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: 0.9rem;
}
.preview-info h6 {
  margin: 0 0 0.2rem;
  color: var(--text);
  font-weight: 600;
  font-size: 0.86rem;
}
.preview-info p {
  margin: 0 0 0.45rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
}
.delete-message {
  color: var(--text-secondary);
  font-size: 0.86rem;
  line-height: 1.55;
  margin-bottom: 0.9rem;
}
.delete-message strong { color: var(--text); }
.delete-confirm-input { margin-top: 0.9rem; }

.bulk-delete-list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.bulk-delete-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.8rem;
}
.bulk-delete-item:last-child { border-bottom: none; }

.modal-btn {
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
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
  background: var(--brand);
  color: #ffffff;
}
.modal-btn.primary:hover:not(:disabled) {
  background: var(--brand-hover);
}
.modal-btn.secondary {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text);
}
.modal-btn.secondary:hover {
  background: var(--surface-sunken);
  border-color: var(--border-strong);
}
.modal-btn.danger {
  background: var(--danger);
  color: #ffffff;
}
.modal-btn.danger:hover:not(:disabled) {
  filter: brightness(0.92);
}

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-group:last-child:nth-child(odd) {
  grid-column: span 2;
}
.form-label {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-input,
.form-select {
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--text);
  font-size: 0.85rem;
  font-family: var(--font-body);
  transition: var(--transition);
}
.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--brand);
  background: var(--surface);
  box-shadow: 0 0 0 3px var(--brand-soft);
}
.form-input.is-invalid {
  border-color: var(--danger);
}
.form-error {
  font-size: 0.72rem;
  color: var(--danger);
  margin-top: 0.2rem;
}

/* Layout for Tipo + Estado row */
.row-type-state {
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  gap: 0.9rem;
}
.row-type-state .left {
  justify-self: start;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.row-type-state .right {
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
}
.row-type-state .right .form-select,
.row-type-state .right-select {
  text-align: left;
}

.form-input,
.form-select,
.select-match,
.right-select {
  height: 40px;
  min-height: 40px;
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 0.55rem 0.75rem;
  font-size: 0.85rem;
  line-height: 1.2;
}

.row-type-state .right .form-select {
  padding-right: 0.75rem;
}

.row-type-state .left .form-select,
.row-type-state .left .select-match,
.row-type-state .right .form-select,
.row-type-state .right .select-match,
.row-type-state .right .right-select {
  width: 100%;
}

.full-width-state {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .row-type-state {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 0.7rem;
  }
  .row-type-state .right {
    align-items: stretch;
  }
  .row-type-state .right .form-select,
  .row-type-state .left .form-select {
    text-align: left;
  }
  .row-type-state .left,
  .row-type-state .right {
    justify-self: stretch;
    width: 100%;
  }
}

/* Toast */
.toast-notification {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.9rem 1.1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10000;
  max-width: 380px;
  animation: slideInRight 0.22s ease;
  border-left: 3px solid var(--brand);
}
.toast-notification.success { border-left-color: var(--brand); }
.toast-notification.error { border-left-color: var(--danger); }
.toast-notification.warning { border-left-color: var(--warning); }

.toast-notification > i {
  font-size: 1.05rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}
.toast-notification.success > i { color: var(--brand); }
.toast-notification.error > i { color: var(--danger); }
.toast-notification.warning > i { color: var(--warning); }

.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.toast-content strong {
  font-size: 0.82rem;
  color: var(--text);
}
.toast-content span {
  font-size: 0.78rem;
  color: var(--text-secondary);
}
.toast-close {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;
  transition: var(--transition);
  flex-shrink: 0;
}
.toast-close:hover { color: var(--text); background: var(--surface-sunken); }

@keyframes slideInRight {
  from { transform: translateX(12px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1200px) {
  .header-content { flex-direction: column; align-items: flex-start; }
  .header-stats { width: 100%; }
  .stat-card { flex: 1; min-width: 130px; }
}
@media (max-width: 992px) {
  .filters-grid { flex-direction: column; align-items: stretch; }
  .actions-group { margin-left: 0; justify-content: flex-end; }
  .search-group { min-width: 100%; }
}
@media (max-width: 768px) {
  .desktop-table { display: none; }
  .mobile-cards { display: block; padding: 0.75rem; }

  .ensayo-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.9rem;
    margin-bottom: 0.6rem;
    transition: var(--transition);
  }
  .ensayo-card.selected {
    background: var(--brand-soft);
    border-color: var(--brand-soft-border);
  }
  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    margin-bottom: 0.65rem;
  }
  .card-info {
    flex: 1;
    min-width: 0;
    cursor: pointer;
  }
  .card-info h5 {
    margin: 0.25rem 0;
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--text);
  }
  .card-info .codigo-text {
    display: inline-block;
    margin-top: 0.2rem;
  }
  .card-actions {
    display: flex;
    gap: 0.3rem;
  }
  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .info-label {
    font-size: 0.72rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
  .info-value {
    font-size: 0.8rem;
    color: var(--text);
  }

  .empty-card {
    text-align: center;
    padding: 2rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }

  .form-grid { grid-template-columns: 1fr; }
  .form-group:last-child:nth-child(odd) { grid-column: span 1; }

  .table-header { flex-direction: column; align-items: stretch; }
  .table-controls { justify-content: space-between; }
  .bulk-actions { flex-wrap: wrap; }
}

@media (max-width: 480px) {
  .admin-header { padding: 1.1rem 0 0.9rem; }
  .page-title { font-size: 1.25rem; }
  .header-stats { gap: 0.5rem; }
  .stat-card { padding: 0.6rem 0.8rem; min-width: 96px; }
  .stat-number { font-size: 1.05rem; }
  .control-body { padding: 0.9rem; }
  .table-footer { flex-direction: column; align-items: center; }
  .page-info { justify-content: center; }
  .actions-group { flex-wrap: wrap; }
  .action-btn { flex: 1; min-width: 100px; justify-content: center; }
  .modal-container { max-width: 95vw; }
}

/* Respeta preferencia de reducción de movimiento */
@media (prefers-reduced-motion: reduce) {
  .toast-notification { animation: none; }
  * { transition-duration: 0.01ms !important; }
}
</style>

<!-- Global styles for teleported modals (must be unscoped so Teleport target gets them) -->
<style>
  .modal-btn {
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .modal-btn.primary {
    background: #3f7a2a !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }
  .modal-btn.primary:hover:not(:disabled) {
    background: #356822 !important;
  }
  .modal-btn.primary i,
  .modal-btn.primary span {
    color: #ffffff !important;
  }

  /* Global modal form styles (apply to teleported modal content) */
  .modal-container .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.9rem;
  }
  .modal-container .form-group { display: flex; flex-direction: column; gap: 0.3rem; }

  .modal-container .form-input,
  .modal-container .form-select,
  .modal-container .select-match,
  .modal-container .right-select {
    height: 40px;
    min-height: 40px;
    padding: 0.55rem 0.75rem;
    font-size: 0.85rem;
    line-height: 1.2;
    box-sizing: border-box;
    width: 100%;
    border-radius: 8px;
    border: 1px solid #e6e8e2;
    background: #fafbf9;
    color: #1b201a;
  }
  [data-bs-theme="dark"] .modal-container .form-input,
  [data-bs-theme="dark"] .modal-container .form-select,
  [data-bs-theme="dark"] .modal-container .select-match,
  [data-bs-theme="dark"] .modal-container .right-select {
    background: #12150f;
    border-color: rgba(255,255,255,0.08);
    color: #eaeee4;
  }

  .modal-container .row-type-state {
    grid-column: span 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: end;
    gap: 0.9rem;
  }
  .modal-container .row-type-state .left { justify-self: start; }
  .modal-container .row-type-state .right { justify-self: end; display:flex; flex-direction:column; align-items:flex-end; }

  @media (max-width: 768px) {
    .modal-container .form-grid { grid-template-columns: 1fr; }
    .modal-container .row-type-state { grid-template-columns: 1fr; gap: 0.7rem; align-items: stretch; }
    .modal-container .row-type-state .right { align-items: stretch; }
  }
</style>
