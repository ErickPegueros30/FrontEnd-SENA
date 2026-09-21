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
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
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
              <div class="stat-icon total"><i class="bi bi-grid-3x3-gap-fill"></i></div>
              <div class="stat-info">
                <span class="stat-number">{{ totalEnsayos }}</span>
                <span class="stat-label">Total Ensayos</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon abierto"><i class="bi bi-cart-check-fill"></i></div>
              <div class="stat-info">
                <span class="stat-number">{{ ensayosAbiertos }}</span>
                <span class="stat-label">Disponibles</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon cerrado"><i class="bi bi-lock-fill"></i></div>
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
              <div class="filter-group search-group">
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input v-model="searchQuery" type="text" class="search-input"
                    placeholder="Buscar por referencia o descripción..." @input="handleSearch" />
                  <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''; handleSearch()">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>

              <div class="filter-group">
                <div class="filter-chips">
                  <div class="chips-title">Áreas</div>
                  <button v-for="area in allowedAreas" :key="area" class="filter-chip"
                    :class="{ 'active': selectedArea === area }" @click="handleFilterClick(area)">
                    <span>{{ area }}</span>
                    <span class="chip-count">{{ getAreaCount(area) }}</span>
                  </button>
                </div>
              </div>

              <div class="filter-group">
                <div class="filter-chips">
                  <div class="chips-title">Ramas</div>
                  <button v-for="rama in availableRamas" :key="rama" class="filter-chip"
                    :class="{ 'active': selectedRama === rama }" @click="handleFilterClick(rama)">
                    <span>{{ rama }}</span>
                    <span class="chip-count">{{ getRamaCount(rama) }}</span>
                  </button>
                </div>
              </div>

              <div class="filter-group">
                <div class="filter-chips">
                  <div class="chips-title">Nacionalidad</div>
                  <button class="filter-chip" :class="{ 'active': selectedNacionalidad === 'mexico' }" @click="toggleNacionalidad('mexico')">
                    <img :src="getFlagUrl('mexico')" alt="mx" style="width:16px;height:12px;border-radius:2px;margin-right:0.4rem" />
                    México
                  </button>
                  <button class="filter-chip" :class="{ 'active': selectedNacionalidad === 'colombia' }" @click="toggleNacionalidad('colombia')">
                    <img :src="getFlagUrl('colombia')" alt="co" style="width:16px;height:12px;border-radius:2px;margin-right:0.4rem" />
                    Colombia
                  </button>
                </div>
              </div>

              <div class="filter-group">
                <div class="filter-chips">
                  <button class="filter-chip" :class="{ 'active': selectedStatus === 'abierto' }"
                    @click="toggleStatusFilter('abierto')">
                    <i class="bi bi-cart-check"></i><span>Abiertos</span>
                    <span class="chip-count">{{ ensayosAbiertos }}</span>
                  </button>
                  <button class="filter-chip" :class="{ 'active': selectedStatus === 'cerrado' }"
                    @click="toggleStatusFilter('cerrado')">
                    <i class="bi bi-lock"></i><span>Cerrados</span>
                    <span class="chip-count">{{ ensayosCerrados }}</span>
                  </button>
                </div>
              </div>

              <div class="filter-group actions-group">
                <button class="action-btn secondary" @click="clearFilters" :disabled="!hasActiveFilters">
                  <i class="bi bi-arrow-counterclockwise"></i><span>Limpiar</span>
                </button>
                <button class="action-btn secondary" @click="exportData">
                  <i class="bi bi-download"></i><span>Exportar</span>
                </button>
                <button class="action-btn primary" @click="openCreateModal">
                  <i class="bi bi-plus-lg"></i><span>Nuevo Ensayo</span>
                </button>
              </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de ensayos -->
    <main class="table-section">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">Programas de Ensayos</h4>
              <p class="table-subtitle">
                Mostrando {{ paginatedEnsayos.length }} de {{ filteredEnsayos.length }} ensayos
                <span v-if="filteredEnsayos.length !== ensayos.length">(filtrado de {{ ensayos.length }})</span>
              </p>
            </div>

            <div class="table-controls">
              <div class="bulk-actions" v-if="selectedEnsayos.length > 0">
                <span class="selected-count">{{ selectedEnsayos.length }} seleccionados</span>
                <button class="action-btn secondary" @click="bulkOpen"><i class="bi bi-cart-check"></i> Abrir</button>
                <button class="action-btn secondary" @click="bulkClose"><i class="bi bi-lock"></i> Cerrar</button>
                <button class="action-btn danger-outline" @click="bulkDelete"><i class="bi bi-trash"></i> Eliminar</button>
              </div>
              <select v-model="itemsPerPage" class="per-page-select" @change="currentPage = 1">
                <option :value="10">10 por página</option>
                <option :value="25">25 por página</option>
                <option :value="50">50 por página</option>
                <option :value="100">100 por página</option>
              </select>
            </div>
          </div>

          <div class="cards-grid">
            <div v-if="filteredEnsayos.length === 0" class="empty-row">
              <div class="empty-content">
                <i class="bi bi-clipboard-data empty-icon"></i>
                <h5 v-if="ensayos.length === 0">No hay ensayos propuestos</h5>
                <h5 v-else>No se encontraron ensayos</h5>
                <p v-if="ensayos.length === 0">Aún no existen ensayos registrados en la base de datos.</p>
                <p v-else>No hay ensayos que coincidan con los filtros aplicados</p>
                <button class="action-btn secondary" @click="clearFilters">
                  <i class="bi bi-arrow-counterclockwise"></i><span>Limpiar filtros</span>
                </button>
              </div>
            </div>

            <div v-for="(ensayo, idx) in paginatedEnsayos" :key="ensayo.id" class="ensayo-card"
              :class="{ 'selected': isSelected(ensayo), 'is-cerrado': !ensayo.disponible }"
              :style="{ animationDelay: (idx * 40) + 'ms' }" @click="goToDetail(ensayo)">

              <span class="card-status-pill" :class="ensayo.disponible ? 'abierto' : 'cerrado'">
                <i :class="ensayo.disponible ? 'bi bi-unlock-fill' : 'bi bi-lock-fill'"></i>
                {{ ensayo.disponible ? 'Abierto' : 'Cerrado' }}
              </span>

              <div class="card-header">
                <input type="checkbox" :checked="isSelected(ensayo)" @click.stop
                  @change="toggleSelectEnsayo(ensayo)" class="table-checkbox" title="Seleccionar" />
                <div class="card-info">
                  <span class="ciclo-badge">{{ ensayo.ciclo }}</span>
                  <h5>{{ ensayo.descripcion }}</h5>
                  <code class="codigo-text">{{ ensayo.codigo }}</code>
                </div>
              </div>

              <div class="card-body">
                <div class="info-row">
                  <span class="info-label">Área</span>
                  <span class="info-value">
                    <span v-if="ensayo.area" class="area-badge">{{ ensayo.area }}</span>
                    <span v-if="ensayo.rama" class="rama-badge">{{ ensayo.rama }}</span>
                    <img v-if="ensayo.nacionalidad" :src="getFlagUrl(ensayo.nacionalidad)" :alt="ensayo.nacionalidad" class="nacionalidad-flag" />
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Subárea</span>
                  <span class="info-value">
                    <span v-if="ensayo.subarea" class="subarea-badge">{{ ensayo.subarea }}</span>
                    <span v-else-if="ensayo.subrama" class="subrama-badge">{{ ensayo.subrama }}</span>
                    <span v-else class="info-empty">—</span>
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
                  <span class="info-label">PDF</span>
                  <span class="info-value">
                    <button v-if="hasGeneralPdf(ensayo)" type="button" class="pdf-chip" @click.stop="openPdfModal(ensayo)">
                      <i class="bi bi-file-earmark-pdf-fill"></i><span>Ver</span>
                    </button>
                    <button v-else class="pdf-chip empty" title="Sin PDF" disabled aria-disabled="true">
                      <i class="bi bi-dash-circle"></i>
                    </button>
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="status-toggle" @click.stop>
                  <button class="toggle-btn" :class="{ 'active': ensayo.disponible }"
                    @click="toggleEnsayoStatus(ensayo)" :disabled="ensayo.updating">
                    <span class="toggle-dot"></span>
                  </button>
                  <span class="status-text" :class="ensayo.disponible ? 'abierto' : 'cerrado'">
                    {{ ensayo.disponible ? 'Abierto' : 'Cerrado' }}
                  </span>
                </div>
                <div class="card-actions" @click.stop>
                  <button class="icon-btn" @click="goToDetail(ensayo)" title="Ver detalle"><i class="bi bi-eye"></i></button>
                  <button class="icon-btn" @click="openEditModal(ensayo)" title="Editar"><i class="bi bi-pencil"></i></button>
                  <button class="icon-btn danger" @click="confirmDelete(ensayo)" title="Eliminar"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            </div>
          </div>

          <div class="table-footer">
            <div class="pagination-wrapper">
              <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1" title="Primera página"><i class="bi bi-chevron-double-left"></i></button>
              <button class="page-btn" :disabled="currentPage === 1" @click="prevPage" title="Anterior"><i class="bi bi-chevron-left"></i></button>
              <template v-for="pageNum in visiblePages" :key="pageNum">
                <button v-if="pageNum !== '...'" class="page-btn" :class="{ 'active': pageNum === currentPage }" @click="currentPage = pageNum as number">{{ pageNum }}</button>
                <span v-else class="page-ellipsis">...</span>
              </template>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage" title="Siguiente"><i class="bi bi-chevron-right"></i></button>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages" title="Última página"><i class="bi bi-chevron-double-right"></i></button>
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

    <!-- Modal eliminación individual -->
    <Teleport to="body">
      <div v-if="ensayoToDelete" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal-container">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill warning-icon"></i> Confirmar Eliminación</h5>
            <button class="modal-close-btn" @click="cancelDelete"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body">
            <div class="warning-box"><i class="bi bi-exclamation-circle-fill"></i>
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
            <p class="delete-message">¿Estás seguro de que deseas eliminar permanentemente el ensayo <strong>{{ ensayoToDelete.descripcion }}</strong>?</p>
            <div class="delete-confirm-input" v-if="deleteConfirmationRequired">
              <label class="form-label">Escribe "ELIMINAR" para confirmar:</label>
              <input v-model="deleteConfirmText" type="text" class="form-input" placeholder="ELIMINAR"
                @input="deleteConfirmText = deleteConfirmText.toUpperCase()" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="cancelDelete">Cancelar</button>
            <button class="modal-btn danger" @click="deleteEnsayo" :disabled="deleteConfirmationRequired && deleteConfirmText !== 'ELIMINAR'">
              <i class="bi bi-trash"></i> Eliminar Ensayo
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal eliminación masiva -->
    <Teleport to="body">
      <div v-if="showBulkDeleteModal" class="modal-overlay" @click.self="showBulkDeleteModal = false">
        <div class="modal-container">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill warning-icon"></i> Eliminar Ensayos Seleccionados</h5>
            <button class="modal-close-btn" @click="showBulkDeleteModal = false"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body">
            <div class="warning-box"><i class="bi bi-exclamation-circle-fill"></i>
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
            <button class="modal-btn secondary" @click="showBulkDeleteModal = false">Cancelar</button>
            <button class="modal-btn danger" @click="confirmBulkDelete"><i class="bi bi-trash"></i> Eliminar {{ selectedEnsayos.length }} Ensayos</button>
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
              {{ showCreateModal ? 'Crear Nuevo Ensayo' : 'Editar Ensayo' }}
            </h5>
            <button class="modal-close-btn" @click="closeModals"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Ciclo *</label>
                <input v-model="createEditForm.ciclo" type="text" class="form-input" placeholder="Ej: Micro 01" required />
              </div>
              <div class="form-group">
                <label class="form-label">Código *</label>
                <input v-model="createEditForm.codigo" type="text" class="form-input" placeholder="Ej: VOL-PIP-MIC-001" required />
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Descripción *</label>
                <input v-model="createEditForm.descripcion" type="text" class="form-input" placeholder="Ej: Micropipeta de volumen fijo" required />
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
              <div class="form-group" v-if="createEditForm.areaId">
                <label class="form-label">Nacionalidad</label>
                <select v-model="createEditForm.nacionalidad" class="form-select">
                  <option value="mexico">México</option>
                  <option value="colombia">Colombia</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Inicio de Inscripción *</label>
                <input v-model="createEditForm.inscripcionInicio" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Fin de Inscripción *</label>
                <input v-model="createEditForm.inscripcionFin" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Fecha de Inicio del Ensayo *</label>
                <input v-model="createEditForm.fechaInicio" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Detalle de Duración</label>
                <input v-model="createEditForm.fechaDetalle" type="text" class="form-input" placeholder="Ej: Duración: 30 días" />
              </div>

              <div class="form-group pdf-group" style="grid-column: span 2;">
                <label class="form-label">Generalidades (PDF) <span class="pdf-optional">Opcional</span></label>
                <div class="pdf-dropzone" :class="{ 'has-file': !!pdfFileName, 'dragover': pdfDragging }"
                  role="button" tabindex="0" @click="triggerPdfInput" @keydown.enter.prevent="triggerPdfInput"
                  @keydown.space.prevent="triggerPdfInput" @dragover.prevent="pdfDragging = true"
                  @dragenter.prevent="pdfDragging = true" @dragleave.prevent="pdfDragging = false" @drop.prevent="handlePdfDrop">
                  <input ref="pdfInputRef" type="file" accept="application/pdf" class="pdf-hidden-input" @change="handlePdfSelect" />
                  <template v-if="!pdfFileName">
                    <div class="pdf-dz-icon"><i class="bi bi-cloud-arrow-up"></i></div>
                    <div class="pdf-dz-text"><strong>Haz clic para subir</strong> o arrastra el archivo aquí</div>
                    <div class="pdf-dz-hint">Sólo PDF · máximo 15 MB</div>
                  </template>
                  <template v-else>
                    <div class="pdf-file-row">
                      <div class="pdf-file-icon"><i class="bi bi-file-earmark-pdf-fill"></i></div>
                      <div class="pdf-file-meta">
                        <span class="pdf-file-name">{{ pdfFileName }}</span>
                        <span class="pdf-file-size" v-if="pdfFileSize">{{ pdfFileSize }}</span>
                      </div>
                      <button type="button" class="pdf-remove-btn" @click.stop="removePdf" title="Quitar archivo"><i class="bi bi-x-lg"></i></button>
                    </div>
                  </template>
                </div>
                <a v-if="existingPdfUrl && !pdfFileName" :href="existingPdfUrl" target="_blank" rel="noopener" class="pdf-existing-link">
                  <i class="bi bi-file-earmark-pdf"></i> Ver PDF actual
                </a>
                <p v-if="existingPdfUrl && pdfFileName" class="pdf-replace-note"><i class="bi bi-info-circle"></i> El nuevo PDF reemplazará al actual al guardar.</p>
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
            <button class="modal-btn secondary" @click="closeModals" :disabled="submitting">Cancelar</button>
            <button class="modal-btn primary" @click="submitForm" :disabled="!isFormValid || submitting">
              <template v-if="submitting"><i class="bi bi-arrow-repeat spin"></i> {{ uploadingPdf ? 'Subiendo PDF...' : 'Guardando...' }}</template>
              <template v-else><i class="bi bi-check-lg"></i> {{ showCreateModal ? 'Crear Ensayo' : 'Guardar Cambios' }}</template>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <div v-if="toastVisible" class="toast-notification" :class="toastType">
        <i :class="toastIcon"></i>
        <div class="toast-content"><strong>{{ toastTitle }}</strong><span>{{ toastMessage }}</span></div>
        <button class="toast-close" @click="toastVisible = false"><i class="bi bi-x-lg"></i></button>
      </div>
    </Teleport>

    <!-- Modal PDF -->
    <Teleport to="body">
      <div v-if="showPdfModal" class="modal-overlay pdf-viewer-overlay" @click.self="closePdfModal">
        <div class="modal-container pdf-viewer">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-file-earmark-pdf-fill"></i> Generalidades</h5>
            <button class="modal-close-btn" @click="closePdfModal"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body pdf-body">
            <div v-if="pdfSrc" class="pdf-embed-wrapper"><iframe :src="pdfSrc + '#view=FitH'" frameborder="0" class="pdf-iframe"></iframe></div>
            <div v-else class="empty-pdf-note">No se pudo cargar el PDF.</div>
            <div v-if="pdfFetchError" class="empty-pdf-note" style="margin-top:0.5rem;color:var(--danger)">Error cargando PDF: {{ pdfFetchError }}.</div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="closePdfModal">Cerrar</button>
            <a v-if="originalPdfUrl" :href="originalPdfUrl" class="modal-btn primary" target="_blank" rel="noopener">Abrir en nueva pestaña</a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { API_BASE } from '@/config/api'

interface Ensayo {
  id: number | string; ciclo: string; descripcion: string; codigo: string
  area: string; subarea: string; inscripcionInicio: string; inscripcionFin: string
  fechaInicio: string; fechaDetalle: string; disponible: boolean; precio?: string
  updating?: boolean; backendId?: number | string; rama?: string; subrama?: string
  anio?: number | string; fechaInicioEnsayo?: string; tipo?: string; nacionalidad?: string
  areaId?: number | string | null; subareaId?: number | string | null
  ramaId?: number | string | null; subramaId?: number | string | null
  generalidades?: string | null; generalidadesUrl?: string | null
}

const router = useRouter()
const { currentTheme } = useTheme()

const searchQuery = ref('')
const selectedArea = ref<string | null>(null)
const selectedRama = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)
const selectedNacionalidad = ref<string | null>(null)
const showFilters = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedEnsayos = ref<Set<number | string>>(new Set())
const showBulkDeleteModal = ref(false)
const deleteConfirmationRequired = ref(true)
const deleteConfirmText = ref('')
const ensayoToDelete = ref<Ensayo | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingEnsayoId = ref<string | number | null>(null)
const submitting = ref(false)
const pdfInputRef = ref<HTMLInputElement | null>(null)
const pdfFile = ref<File | null>(null)
const pdfFileName = ref('')
const pdfFileSize = ref('')
const pdfDragging = ref(false)
const uploadingPdf = ref(false)
const existingPdfUrl = ref<string | null>(null)
const toastVisible = ref(false)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType = ref('info')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const createEditForm = ref<Partial<Ensayo> & Record<string, unknown>>({
  ciclo: '', descripcion: '', codigo: '', areaId: null, subareaId: null,
  ramaId: null, subramaId: null, inscripcionInicio: '', inscripcionFin: '',
  fechaInicio: '', fechaDetalle: '', disponible: true, tipo: 'principal'
})

const areasList = ref<any[]>([])
const subareasMap = ref<Record<number, any[]>>({})
const currentSubareas = computed(() => {
  const aid = createEditForm.value.areaId
  if (!aid) return []
  return subareasMap.value[aid as number] || []
})

const fetchAreas = async () => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/areas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const data = await resp.json()
    areasList.value = Array.isArray(data) ? data : (data.data || [])
    for (const a of areasList.value) await fetchSubareas(a.id)
  } catch (err) { console.error('Error fetching areas', err) }
}
const fetchSubareas = async (areaId: number) => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/areas/${areaId}/subareas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const data = await resp.json()
    subareasMap.value[areaId] = Array.isArray(data) ? data : (data.data || [])
  } catch (err) { console.error('Error fetching subareas for', areaId, err) }
}

const ramasList = ref<any[]>([])
const ramasSubramasMap = ref<Record<number, any[]>>({})
const fetchRamas = async () => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/ramas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const data = await resp.json()
    ramasList.value = Array.isArray(data) ? data : (data.data || [])
    try { await Promise.all(ramasList.value.map((r: any) => fetchSubramasForRama(r.id))) } catch (e) { console.error(e) }
  } catch (err) { console.error('Error fetching ramas', err) }
}
const fetchSubramasForRama = async (ramaId: number) => {
  try {
    if (!ramaId) return
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/ramas/${ramaId}/subramas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const data = await resp.json()
    ramasSubramasMap.value[ramaId] = Array.isArray(data) ? data : (data.data || [])
  } catch (err) { console.error('Error fetching subramas for rama', ramaId, err) }
}
const currentSubramas = computed(() => {
  const rid = createEditForm.value.ramaId
  if (!rid) return []
  return ramasSubramasMap.value[rid as number] || []
})

const onRamaChange = () => {
  const rid = createEditForm.value.ramaId
  createEditForm.value.subramaId = null; createEditForm.value.areaId = null; createEditForm.value.subareaId = null
  if (rid) createEditForm.value.nacionalidad = 'mexico'
  if (!rid) createEditForm.value.tipo = 'principal'
  if (rid) fetchSubramasForRama(rid as number)
}
const onAreaChange = () => {
  const aid = createEditForm.value.areaId
  createEditForm.value.subareaId = null; createEditForm.value.ramaId = null; createEditForm.value.subramaId = null
  createEditForm.value.tipo = 'principal'
  if (aid && !createEditForm.value.nacionalidad) createEditForm.value.nacionalidad = 'mexico'
  if (aid) fetchSubareas(aid as number)
}

const availableRamas = computed(() => ramasList.value.map(r => r.nombre || r.name).filter(Boolean))

interface Service { id: number; name: string; icon: string; iconWhite: string; route?: string }
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
const servicesCombined = [...servicesRow1, ...servicesRow2]
const allowedAreas = computed(() => Array.from(new Set(servicesCombined.map(s => s.name))))

const ensayos = ref<Ensayo[]>([])

const normalizeText = (v: any): string => {
  if (v === null || v === undefined) return ''
  try { return String(v).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim() }
  catch (err) { return String(v).toLowerCase().trim() }
}
const ensayoMatchesCategory = (e: Ensayo, name: string): boolean => {
  const target = normalizeText(name)
  if (!target) return false
  return normalizeText(e.area) === target || normalizeText(e.rama) === target
}

const totalEnsayos = computed(() => ensayos.value.length)
const ensayosAbiertos = computed(() => ensayos.value.filter(e => e.disponible).length)
const ensayosCerrados = computed(() => ensayos.value.filter(e => !e.disponible).length)
const hasActiveFilters = computed(() => !!(searchQuery.value || selectedArea.value || selectedRama.value || selectedStatus.value || selectedNacionalidad.value))

const filteredEnsayos = computed(() => {
  const query = (searchQuery.value || '').toString().toLowerCase().trim()
  return ensayos.value.filter(e => {
    const ciclo = (e.ciclo || '').toString().toLowerCase()
    const descripcion = (e.descripcion || '').toString().toLowerCase()
    const codigo = (e.codigo || '').toString().toLowerCase()
    const area = (e.area || '').toString().toLowerCase()
    const subarea = (e.subarea || '').toString().toLowerCase()
    const rama = (e.rama || '').toString().toLowerCase()
    const subrama = (e.subrama || '').toString().toLowerCase()
    const matchesSearch = !query || ciclo.includes(query) || descripcion.includes(query) || codigo.includes(query) || area.includes(query) || subarea.includes(query) || rama.includes(query) || subrama.includes(query)
    const matchesArea = !selectedArea.value || ensayoMatchesCategory(e, selectedArea.value)
    const matchesRama = !selectedRama.value || ensayoMatchesCategory(e, selectedRama.value)
    const matchesStatus = !selectedStatus.value || (selectedStatus.value === 'abierto' && !!e.disponible) || (selectedStatus.value === 'cerrado' && !e.disponible)
    const matchesNacionalidad = !selectedNacionalidad.value || normalizeText((e as any).nacionalidad || 'mexico') === normalizeText(selectedNacionalidad.value)
    return matchesSearch && matchesArea && matchesRama && matchesStatus && matchesNacionalidad
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
  if (totalPages.value <= maxVisible) { for (let i = 1; i <= totalPages.value; i++) pages.push(i) }
  else {
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

const isSelected = (ensayo: Ensayo) => selectedEnsayos.value.has(ensayo.id)
const selectedEnsayosData = computed(() => ensayos.value.filter(e => selectedEnsayos.value.has(e.id)))
const toggleSelectEnsayo = (ensayo: Ensayo) => {
  const s = new Set(selectedEnsayos.value)
  if (s.has(ensayo.id)) s.delete(ensayo.id); else s.add(ensayo.id)
  selectedEnsayos.value = s
}

const toggleAreaFilter = (area: string) => { selectedArea.value = selectedArea.value === area ? null : area; selectedRama.value = null; currentPage.value = 1; selectedEnsayos.value = new Set() }
const toggleRamaFilter = (rama: string) => { selectedRama.value = selectedRama.value === rama ? null : rama; selectedArea.value = null; currentPage.value = 1; selectedEnsayos.value = new Set() }
const toggleStatusFilter = (status: string) => { selectedStatus.value = selectedStatus.value === status ? null : status; currentPage.value = 1; selectedEnsayos.value = new Set() }
const toggleNacionalidad = (n: string | null) => { selectedNacionalidad.value = selectedNacionalidad.value === n ? null : n; currentPage.value = 1; selectedEnsayos.value = new Set() }
const handleFilterClick = (name: string) => { if (availableRamas.value.includes(name)) toggleRamaFilter(name); else toggleAreaFilter(name) }
const getAreaCount = (area: string) => ensayos.value.filter(e => ensayoMatchesCategory(e, area)).length
const getRamaCount = (rama: string) => ensayos.value.filter(e => normalizeText(e.rama) === normalizeText(rama)).length
const clearFilters = () => { searchQuery.value = ''; selectedArea.value = null; selectedRama.value = null; selectedStatus.value = null; selectedNacionalidad.value = null; currentPage.value = 1; selectedEnsayos.value = new Set() }
const handleSearch = () => { currentPage.value = 1; selectedEnsayos.value = new Set() }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

const toggleEnsayoStatus = async (ensayo: Ensayo) => {
  ensayo.updating = true
  const prevState = ensayo.disponible
  try {
    const token = getAuthToken()
    const idToUse = (ensayo as any).backendId || ensayo.id
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${idToUse}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ disponible: !ensayo.disponible })
      })
      if (resp.ok) {
        const body = await resp.json().catch(() => ({}))
        const updated = body.data || body
        if (updated && typeof updated.disponible !== 'undefined') ensayo.disponible = !!updated.disponible
        else ensayo.disponible = !ensayo.disponible
      } else { throw new Error('API error') }
    } else { ensayo.disponible = !ensayo.disponible }
    showToast(`Ensayo ${ensayo.disponible ? 'abierto' : 'cerrado'} correctamente`, 'success', 'Actualizado')
  } catch (err) { ensayo.disponible = prevState; showToast('Error al actualizar el estado', 'error', 'Error') }
  finally { ensayo.updating = false }
}

const goToDetail = (ensayo: Ensayo) => {
  const id = (ensayo as any).backendId || ensayo.id
  router.push(`/admin/ensayos/${id}`)
}

const confirmDelete = (ensayo: Ensayo) => { ensayoToDelete.value = { ...ensayo }; deleteConfirmText.value = '' }
const cancelDelete = () => { ensayoToDelete.value = null; deleteConfirmText.value = '' }
const deleteEnsayo = async () => {
  if (!ensayoToDelete.value) return
  if (deleteConfirmationRequired.value && deleteConfirmText.value !== 'ELIMINAR') return
  try {
    const token = getAuthToken()
    const idToUse = (ensayoToDelete.value as any).backendId || ensayoToDelete.value.id
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${idToUse}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!resp.ok) throw new Error('API error')
    }
    ensayos.value = ensayos.value.filter(e => ((e as any).backendId || e.id) !== idToUse)
    selectedEnsayos.value.delete(idToUse)
    showToast(`Ensayo "${ensayoToDelete.value.descripcion}" eliminado correctamente`, 'success', 'Eliminado')
  } catch (err) { showToast('Error al eliminar el ensayo', 'error', 'Error') }
  finally { ensayoToDelete.value = null; deleteConfirmText.value = '' }
}

const bulkOpen = async () => {
  try {
    const token = getAuthToken()
    for (const ensayoId of selectedEnsayos.value) {
      const ensayo = ensayos.value.find(e => e.id === ensayoId)
      if (ensayo && !ensayo.disponible) {
        const idToUse = (ensayo as any).backendId || ensayo.id
        if (token) await fetch(`${API_BASE}/api/ensayos/${idToUse}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ disponible: true }) })
        ensayo.disponible = true
      }
    }
    showToast(`${selectedEnsayos.value.size} ensayos abiertos`, 'success', 'Apertura Masiva')
    selectedEnsayos.value = new Set()
  } catch (err) { showToast('Error en la apertura masiva', 'error', 'Error') }
}
const bulkClose = async () => {
  try {
    const token = getAuthToken()
    for (const ensayoId of selectedEnsayos.value) {
      const ensayo = ensayos.value.find(e => e.id === ensayoId)
      if (ensayo && ensayo.disponible) {
        const idToUse = (ensayo as any).backendId || ensayo.id
        if (token) await fetch(`${API_BASE}/api/ensayos/${idToUse}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ disponible: false }) })
        ensayo.disponible = false
      }
    }
    showToast(`${selectedEnsayos.value.size} ensayos cerrados`, 'success', 'Cierre Masivo')
    selectedEnsayos.value = new Set()
  } catch (err) { showToast('Error en el cierre masivo', 'error', 'Error') }
}
const bulkDelete = () => { if (selectedEnsayos.value.size > 0) showBulkDeleteModal.value = true }
const confirmBulkDelete = async () => {
  try {
    const token = getAuthToken()
    for (const ensayoId of selectedEnsayos.value) {
      const ensayo = ensayos.value.find(e => e.id === ensayoId)
      const idToUse = (ensayo as any)?.backendId || ensayoId
      if (token) await fetch(`${API_BASE}/api/ensayos/${idToUse}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    }
    ensayos.value = ensayos.value.filter(e => !selectedEnsayos.value.has(e.id))
    const count = selectedEnsayos.value.size
    selectedEnsayos.value = new Set()
    showBulkDeleteModal.value = false
    showToast(`${count} ensayos eliminados`, 'success', 'Eliminación Masiva')
  } catch (err) { showToast('Error en la eliminación masiva', 'error', 'Error') }
}

const triggerPdfInput = () => { pdfInputRef.value?.click() }
const formatBytes = (bytes: number): string => {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
const setPdfFile = (file?: File | null) => {
  if (!file) return
  if (file.type !== 'application/pdf') { showToast('El archivo debe ser un PDF', 'error', 'Formato inválido'); return }
  if (file.size > 15 * 1024 * 1024) { showToast('El PDF no debe superar los 15 MB', 'error', 'Archivo muy grande'); return }
  pdfFile.value = file; pdfFileName.value = file.name; pdfFileSize.value = formatBytes(file.size)
}
const handlePdfSelect = (e: Event) => { const t = e.target as HTMLInputElement; setPdfFile(t.files && t.files[0]) }
const handlePdfDrop = (e: DragEvent) => { pdfDragging.value = false; setPdfFile((e.dataTransfer?.files && e.dataTransfer.files[0]) || null) }
const removePdf = () => { pdfFile.value = null; pdfFileName.value = ''; pdfFileSize.value = ''; if (pdfInputRef.value) pdfInputRef.value.value = '' }
const resetPdfState = () => { removePdf(); existingPdfUrl.value = null; pdfDragging.value = false }
const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = () => reject(new Error('No se pudo leer el archivo')); r.readAsDataURL(file)
})
const uploadPdfForEnsayo = async (ensayoId: string | number) => {
  if (!pdfFile.value || !ensayoId) return
  const token = getAuthToken()
  if (!token) throw new Error('Sesión no válida para subir el PDF')
  uploadingPdf.value = true
  try {
    const dataUrl = await fileToDataUrl(pdfFile.value)
    const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId}/generalidades`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ pdfDataUrl: dataUrl }) })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) throw new Error(body.message || 'Error subiendo el PDF')
    return body
  } finally { uploadingPdf.value = false }
}

const isFormValid = computed(() => {
  const f = createEditForm.value
  if (!f.ciclo || !f.descripcion || !f.codigo) return false
  const hasAreaPair = !!(f.areaId && f.subareaId)
  const hasRama = !!f.ramaId
  if (!hasAreaPair && !hasRama) return false
  if (!f.inscripcionInicio || !f.inscripcionFin || !f.fechaInicio) return false
  return true
})

const openCreateModal = () => {
  createEditForm.value = { ciclo: '', descripcion: '', codigo: '', areaId: null, subareaId: null, ramaId: null, subramaId: null, inscripcionInicio: '', inscripcionFin: '', fechaInicio: '', fechaDetalle: '', disponible: true, tipo: 'principal', nacionalidad: 'mexico' }
  resetPdfState(); showCreateModal.value = true; showEditModal.value = false; editingEnsayoId.value = null
}
const openEditModal = (ensayo: Ensayo) => {
  let areaId = (ensayo as any).areaId || null
  let subareaId = (ensayo as any).subareaId || null
  if (!areaId && ensayo.area) { const a = areasList.value.find(x => (x.nombre || x.name) === ensayo.area); if (a) areaId = a.id }
  if (!subareaId && subareasMap.value[areaId || 0]) { const s = subareasMap.value[areaId || 0].find((x: any) => (x.nombre || x.name) === ensayo.subarea); if (s) subareaId = s.id }
  createEditForm.value = {
    ciclo: ensayo.ciclo, descripcion: ensayo.descripcion, codigo: ensayo.codigo, areaId, subareaId,
    ramaId: (ensayo as any).ramaId || null, subramaId: (ensayo as any).subramaId || null,
    inscripcionInicio: ensayo.inscripcionInicio, inscripcionFin: ensayo.inscripcionFin,
    fechaInicio: ensayo.fechaInicio, fechaDetalle: ensayo.fechaDetalle || '',
    disponible: ensayo.disponible, tipo: (ensayo as any).tipo || 'principal'
  }
  if ((ensayo as any).nacionalidad && areaId) createEditForm.value.nacionalidad = (ensayo as any).nacionalidad
  else if (createEditForm.value.ramaId) createEditForm.value.nacionalidad = 'mexico'
  else createEditForm.value.nacionalidad = 'mexico'
  if (createEditForm.value.ramaId) fetchSubramasForRama(createEditForm.value.ramaId as number)
  if (createEditForm.value.areaId) fetchSubareas(createEditForm.value.areaId as number)
  resetPdfState()
  existingPdfUrl.value = hasGeneralPdf(ensayo) ? getGeneralPdfUrl(ensayo) : null
  editingEnsayoId.value = (ensayo as any).backendId || ensayo.id
  showEditModal.value = true; showCreateModal.value = false
}
const closeModals = () => { if (submitting.value) return; showCreateModal.value = false; showEditModal.value = false; editingEnsayoId.value = null; resetPdfState() }

const submitForm = async () => {
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  try {
    const token = getAuthToken()
    let targetId: string | number | null = null
    if (showCreateModal.value) {
      const payload: Record<string, any> = { ...createEditForm.value }
      if (!payload.anio) { if (payload.fechaInicio) { const d = new Date(payload.fechaInicio); if (!isNaN(d.getTime())) payload.anio = d.getFullYear() } if (!payload.anio) payload.anio = new Date().getFullYear() }
      if (payload.fechaInicio) { payload.fechaInicioEnsayo = payload.fechaInicio; delete payload.fechaInicio }
      if (payload.ramaId) payload.nacionalidad = 'mexico'; else payload.nacionalidad = payload.nacionalidad || 'mexico'
      if (token) {
        const resp = await fetch(`${API_BASE}/api/ensayos`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
        const respBody = await resp.json().catch(() => ({}))
        if (!resp.ok) throw new Error(respBody.message || JSON.stringify(respBody) || 'Error del servidor')
        targetId = respBody.id || respBody.data?.id || null
      } else { ensayos.value.push({ id: Date.now(), ...(payload as any) }) }
      if (pdfFile.value && targetId) { try { await uploadPdfForEnsayo(targetId) } catch (e: any) { showToast(e?.message || 'El ensayo se creó pero el PDF no se pudo subir', 'warning', 'PDF') } }
      if (token) await fetchEnsayosFromApi()
      showToast('Ensayo creado correctamente', 'success', 'Creado')
    } else if (showEditModal.value && editingEnsayoId.value) {
      const payload: Record<string, any> = { ...createEditForm.value }
      if (!payload.anio) { if (payload.fechaInicio) { const d = new Date(payload.fechaInicio); if (!isNaN(d.getTime())) payload.anio = d.getFullYear() } if (!payload.anio) payload.anio = new Date().getFullYear() }
      if (payload.fechaInicio) { payload.fechaInicioEnsayo = payload.fechaInicio; delete payload.fechaInicio }
      if (payload.ramaId) payload.nacionalidad = 'mexico'; else payload.nacionalidad = payload.nacionalidad || 'mexico'
      targetId = editingEnsayoId.value
      if (token) {
        const resp = await fetch(`${API_BASE}/api/ensayos/${editingEnsayoId.value}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
        const respBody = await resp.json().catch(() => ({}))
        if (!resp.ok) throw new Error(respBody.message || JSON.stringify(respBody) || 'Error del servidor')
      } else { const idx = ensayos.value.findIndex(e => ((e as any).backendId || e.id) === editingEnsayoId.value); if (idx !== -1) ensayos.value[idx] = { ...ensayos.value[idx], ...(payload as any) } }
      if (pdfFile.value && targetId) { try { await uploadPdfForEnsayo(targetId) } catch (e: any) { showToast(e?.message || 'El ensayo se actualizó pero el PDF no se pudo subir', 'warning', 'PDF') } }
      if (token) await fetchEnsayosFromApi()
      showToast('Ensayo actualizado correctamente', 'success', 'Actualizado')
    }
    closeModalsForce()
  } catch (err: any) { showToast(err.message || 'Error al procesar la solicitud', 'error', 'Error') }
  finally { submitting.value = false }
}
const closeModalsForce = () => { showCreateModal.value = false; showEditModal.value = false; editingEnsayoId.value = null; resetPdfState() }

const getAuthToken = (): string | null => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null

const exportData = () => {
  const headers = ['ID', 'Ciclo', 'Descripción', 'Código', 'Área', 'Subárea', 'Inicio Inscripción', 'Fin Inscripción', 'Fecha Inicio', 'Estado', 'Precio']
  const data = ensayos.value.map(e => [e.id, e.ciclo, e.descripcion, e.codigo, e.area, e.subarea, e.inscripcionInicio, e.inscripcionFin, e.fechaInicio, e.disponible ? 'Abierto' : 'Cerrado', e.precio || ''])
  const csvContent = [headers.join(','), ...data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = `ensayos-sena-${new Date().toISOString().split('T')[0]}.csv`; link.click()
  URL.revokeObjectURL(url)
  showToast('Archivo CSV exportado correctamente', 'success', 'Exportado')
}

const showToast = (message: string, type: string = 'info', title: string = '') => {
  toastMessage.value = message; toastTitle.value = title; toastType.value = type; toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 4000)
}
const getFlagUrl = (code?: string | null) => {
  if (!code) return ''
  const c = String(code).toLowerCase()
  if (c === 'colombia' || c === 'co') return 'https://flagcdn.com/w20/co.png'
  return 'https://flagcdn.com/w20/mx.png'
}
const getGeneralPdfUrl = (p: any) => {
  if (!p) return ''
  const id = (p as any).backendId || p.id
  if (id && (p.generalidades || p.generalidadesUrl)) return `${API_BASE}/api/ensayos/${id}/generalidades.pdf`
  if (p.generalidadesUrl) return p.generalidadesUrl
  return ''
}
const hasGeneralPdf = (p: any) => { if (!p) return false; return Boolean(p.generalidades || p.generalidadesUrl) }
const toastIcon = computed(() => {
  const icons: Record<string, string> = { success: 'bi bi-check-circle-fill', error: 'bi bi-x-circle-fill', warning: 'bi bi-exclamation-triangle-fill', info: 'bi bi-info-circle-fill' }
  return icons[toastType.value] || icons.info
})

const showPdfModal = ref(false)
const currentPdfUrl = ref<string | null>(null)
const originalPdfUrl = ref<string | null>(null)
const currentPdfBlobUrl = ref<string | null>(null)
const pdfFetchError = ref<string | null>(null)
const pdfSrc = computed(() => currentPdfBlobUrl.value || currentPdfUrl.value || '')
const openPdfModal = async (ensayo: any) => {
  const url = getGeneralPdfUrl(ensayo)
  if (!url) return
  showPdfModal.value = true; pdfFetchError.value = null; currentPdfUrl.value = null; currentPdfBlobUrl.value = null; originalPdfUrl.value = url
  document.body.style.overflow = 'hidden'
  try {
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const ct = resp.headers.get('content-type') || ''
    if (!ct.includes('pdf')) { currentPdfUrl.value = url; return }
    const blob = await resp.blob()
    currentPdfBlobUrl.value = URL.createObjectURL(blob)
  } catch (err: any) { pdfFetchError.value = String(err && err.message ? err.message : err) || 'Error cargando PDF'; currentPdfUrl.value = url }
}
const closePdfModal = () => {
  showPdfModal.value = false
  if (currentPdfBlobUrl.value) { try { URL.revokeObjectURL(currentPdfBlobUrl.value) } catch (e) {} }
  currentPdfBlobUrl.value = null; currentPdfUrl.value = null; originalPdfUrl.value = null; pdfFetchError.value = null
  document.body.style.overflow = ''
}

const fetchEnsayosFromApi = async () => {
  try {
    const token = getAuthToken()
    if (!token) return
    const resp = await fetch(`${API_BASE}/api/ensayos?limit=1000&page=1`, { headers: { Authorization: `Bearer ${token}` } })
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
          if (areaId) subareaName = subareasMap.value[areaId]?.find((s: any) => s.id === subareaId)?.nombre || ''
          if (!subareaName) { for (const k of Object.keys(subareasMap.value)) { const arr = subareasMap.value[Number(k)] || []; const s = arr.find((x: any) => x.id === subareaId); if (s) { subareaName = s.nombre || s.name || ''; break } } }
        }
        const ramaName = r.rama || (() => {
          if (subareaId && areaId) { const s = subareasMap.value[areaId]?.find((x: any) => x.id === subareaId); if (s && s.rama_nombre) return s.rama_nombre }
          if (ramaId) return ramasList.value.find(rr => rr.id === ramaId)?.nombre || ''
          return ''
        })()
        const subramaName = r.subrama || (() => {
          if (subramaId && ramaId) { const arr = ramasSubramasMap.value[ramaId] || []; const s = arr.find((x: any) => x.id === subramaId); if (s) return s.nombre || s.name || '' }
          for (const key of Object.keys(ramasSubramasMap.value)) { const arr = ramasSubramasMap.value[Number(key)] || []; const s = arr.find((x: any) => x.id === subramaId); if (s) return s.nombre || s.name || '' }
          return ''
        })()
        return {
          id: r.id_ensayo || r.id || Date.now(), ciclo: r.ciclo || '', descripcion: r.descripcion || '', codigo: r.codigo || '',
          area: areaName, subarea: subareaName, areaId, subareaId, ramaId, subramaId, rama: ramaName, subrama: subramaName,
          inscripcionInicio: r.inscripcionInicio || r.inscripcion_inicio || '', inscripcionFin: r.inscripcionFin || r.inscripcion_fin || '',
          fechaInicio: r.fechaInicio || r.fecha_inicio || r.fechaInicioEnsayo || r.fecha_inicio_ensayo || '',
          fechaDetalle: r.fechaDetalle || r.fecha_detalle || '', disponible: r.disponible !== undefined ? !!r.disponible : true,
          tipo: r.tipo || 'principal', nacionalidad: r.nacionalidad || r.nacionalidad === '' ? r.nacionalidad : 'mexico', precio: r.precio || '',
          generalidades: r.generalidades || null, generalidadesUrl: r.generalidadesUrl || null, backendId: r.id_ensayo || r.id
        }
      })
    }
  } catch (err) { console.error('Error fetching ensayos:', err) }
}

onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  await fetchAreas(); await fetchRamas(); await fetchEnsayosFromApi()
})
watch(currentTheme, (newTheme) => { localStorage.setItem('theme', newTheme); document.documentElement.setAttribute('data-bs-theme', newTheme) })
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
.admin-ensayos-page { font-family: var(--font-body); background: var(--bg); min-height: 100vh; color: var(--text); font-size: 14px; -webkit-font-smoothing: antialiased; }
.admin-ensayos-page .container { max-width: 1360px; margin: 0 auto; padding: 0 1.75rem; }
.admin-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1.5rem 0 1.75rem; }
.breadcrumb-nav { margin-bottom: 1.25rem; }
.breadcrumb-list { display: flex; align-items: center; gap: 0.4rem; padding: 0; margin: 0; list-style: none; font-size: 0.78rem; }
.breadcrumb-item { display: flex; align-items: center; gap: 0.3rem; color: var(--text-tertiary); }
.breadcrumb-item.active { color: var(--text-secondary); font-weight: 600; }
.breadcrumb-link { color: var(--text-tertiary); text-decoration: none; transition: var(--transition); display: flex; align-items: center; gap: 0.3rem; }
.breadcrumb-link:hover { color: var(--brand); }
.breadcrumb-separator { color: var(--border-strong); font-size: 0.6rem; }
.header-content { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; flex-wrap: wrap; }
.section-eyebrow { display: inline-block; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brand); margin-bottom: 0.4rem; }
.page-title { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.01em; color: var(--text); margin: 0 0 0.3rem; line-height: 1.25; }
.page-subtitle { color: var(--text-secondary); font-size: 0.86rem; margin: 0; }
.header-stats { display: flex; gap: 0.65rem; flex-wrap: wrap; }
.stat-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-md); min-width: 148px; transition: var(--transition); }
.stat-card:hover { border-color: var(--border-strong); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.stat-icon { width: 34px; height: 34px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
.stat-icon.total { background: var(--neutral-soft); color: var(--text-secondary); }
.stat-icon.abierto { background: var(--brand-soft); color: var(--brand); }
.stat-icon.cerrado { background: var(--neutral-soft); color: var(--text-tertiary); }
.stat-info { display: flex; flex-direction: column; line-height: 1.2; }
.stat-number { font-size: 1.2rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
.stat-label { font-size: 0.72rem; color: var(--text-secondary); margin-top: 0.1rem; }
.control-section { padding: 1.25rem 0 0; }
.control-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; }
.control-header { padding: 0.85rem 1.25rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.control-title { font-size: 0.82rem; font-weight: 600; color: var(--text); margin: 0; }
.btn-collapse { width: 28px; height: 28px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: transparent; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.75rem; }
.btn-collapse:hover { background: var(--surface-sunken); border-color: var(--border-strong); color: var(--text); }
.control-body { padding: 1.1rem 1.25rem; }
.filters-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
.filter-group { display: flex; align-items: center; }
.search-group { flex: 1; min-width: 220px; }
.search-box { position: relative; width: 100%; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); font-size: 0.85rem; }
.search-input { width: 100%; padding: 0.55rem 0.75rem 0.55rem 2.25rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-sunken); color: var(--text); font-size: 0.84rem; font-family: var(--font-body); transition: var(--transition); }
.search-input::placeholder { color: var(--text-tertiary); }
.search-input:focus { outline: none; border-color: var(--brand); background: var(--surface); box-shadow: 0 0 0 3px var(--brand-soft); }
.clear-btn { position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.2rem; border-radius: 50%; transition: var(--transition); display: flex; }
.clear-btn:hover { color: var(--text); background: var(--neutral-soft); }
.filter-chips { display: flex; gap: 0.35rem; flex-wrap: wrap; align-items: center; }
.chips-title { font-size: 0.66rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); margin-right: 0.15rem; align-self: center; }
.filter-chip { display: flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-sunken); color: var(--text-secondary); font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: var(--transition); font-family: var(--font-body); }
.filter-chip:hover { border-color: var(--border-strong); color: var(--text); background: var(--surface); transform: translateY(-1px); }
.filter-chip.active { background: var(--brand-soft); border-color: var(--brand-soft-border); color: var(--brand); font-weight: 600; }
.chip-count { background: rgba(0,0,0,0.06); padding: 0.05rem 0.4rem; border-radius: 6px; font-size: 0.68rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.filter-chip.active .chip-count { background: rgba(63,122,42,0.14); }
[data-bs-theme="dark"] .chip-count { background: rgba(255,255,255,0.08); }
.nacionalidad-flag { width:18px; height:12px; object-fit:cover; border-radius:2px }
.actions-group { display: flex; gap: 0.5rem; margin-left: auto; }
.action-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.9rem; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: var(--transition); border: 1px solid transparent; font-family: var(--font-body); white-space: nowrap; }
.action-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.action-btn.primary { background: var(--brand); color: #fff; border-color: var(--brand); }
.action-btn.primary:hover:not(:disabled) { background: var(--brand-hover); border-color: var(--brand-hover); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
.action-btn.primary i, .action-btn.primary span { color: #fff; }
.action-btn.secondary { background: var(--surface); border-color: var(--border); color: var(--text); }
.action-btn.secondary:hover:not(:disabled) { background: var(--surface-sunken); border-color: var(--border-strong); }
.action-btn.danger-outline { background: var(--danger-soft); border-color: var(--danger-soft); color: var(--danger); }
.action-btn.danger-outline:hover:not(:disabled) { background: var(--danger); color: #fff; border-color: var(--danger); }
.active-filters { margin-top: 0.9rem; padding-top: 0.9rem; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; width: 100%; }
.active-filters-label { font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; }
.active-filter-tag { display: flex; align-items: center; gap: 0.3rem; padding: 0.22rem 0.6rem; background: var(--brand-soft); border: 1px solid var(--brand-soft-border); border-radius: var(--radius-sm); font-size: 0.72rem; color: var(--brand); }
.active-filter-tag button { background: none; border: none; color: currentColor; opacity: 0.7; cursor: pointer; padding: 0; font-size: 0.65rem; display: flex; align-items: center; }
.active-filter-tag button:hover { opacity: 1; }
.table-section { padding: 1rem 0 3rem; }
.table-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; }
.table-header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.table-title { font-size: 0.9rem; font-weight: 600; color: var(--text); margin: 0 0 0.15rem; }
.table-subtitle { font-size: 0.75rem; color: var(--text-secondary); margin: 0; }
.table-controls { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
.bulk-actions { display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0.6rem; background: var(--brand-soft); border: 1px solid var(--brand-soft-border); border-radius: var(--radius-sm); }
.selected-count { font-size: 0.76rem; color: var(--brand); font-weight: 600; padding-left: 0.25rem; }
.per-page-select { padding: 0.4rem 0.65rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-sunken); color: var(--text); font-size: 0.78rem; font-family: var(--font-body); cursor: pointer; }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.1rem; padding: 1.25rem; }
.ensayo-card { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; animation: cardIn 0.32s ease both; }
@keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.ensayo-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--brand); opacity: 0.9; transition: var(--transition); }
.ensayo-card.is-cerrado::before { background: var(--border-strong); opacity: 0.7; }
.ensayo-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--brand-soft-border); }
.ensayo-card.selected { border-color: var(--brand-soft-border); box-shadow: 0 0 0 1px var(--brand-soft-border), var(--shadow-sm); }
.ensayo-card.selected::before { opacity: 1; }
.card-status-pill { position: absolute; top: 0.85rem; right: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.18rem 0.55rem; border-radius: 999px; font-size: 0.64rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; z-index: 2; }
.card-status-pill.abierto { background: var(--brand-soft); color: var(--brand); border: 1px solid var(--brand-soft-border); }
.card-status-pill.cerrado { background: var(--neutral-soft); color: var(--text-tertiary); border: 1px solid var(--border); }
.card-header { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1.1rem 1.1rem 0.85rem; border-bottom: 1px solid var(--border); }
.card-header .table-checkbox { margin-top: 0.35rem; }
.table-checkbox { width: 16px; height: 16px; accent-color: var(--brand); cursor: pointer; flex-shrink: 0; }
.card-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.4rem; padding-right: 3.5rem; }
.card-info .ciclo-badge { align-self: flex-start; }
.card-info h5 { margin: 0; font-size: 0.95rem; font-weight: 700; line-height: 1.35; color: var(--text); letter-spacing: -0.01em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.15s ease; }
.ensayo-card:hover .card-info h5 { color: var(--brand); }
.card-info .codigo-text { align-self: flex-start; }
.ciclo-badge { display: inline-block; padding: 0.18rem 0.6rem; background: var(--brand); color: #fff; border-radius: var(--radius-xs); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; }
.area-badge { display: inline-block; padding: 0.15rem 0.55rem; background: var(--brand-soft); color: var(--brand); border-radius: var(--radius-xs); font-size: 0.7rem; font-weight: 600; }
.subarea-badge { display: inline-block; padding: 0.15rem 0.55rem; background: var(--neutral-soft); color: var(--text-secondary); border-radius: var(--radius-xs); font-size: 0.7rem; font-weight: 500; }
.rama-badge { display: inline-block; padding: 0.12rem 0.5rem; background: transparent; border: 1px solid var(--brand-soft-border); color: var(--brand); border-radius: var(--radius-xs); font-size: 0.68rem; font-weight: 600; }
.subrama-badge { display: inline-block; padding: 0.12rem 0.5rem; background: transparent; border: 1px solid var(--border-strong); color: var(--text-secondary); border-radius: var(--radius-xs); font-size: 0.68rem; font-weight: 600; }
.codigo-text { font-family: 'SF Mono', 'Courier New', monospace; font-size: 0.72rem; background: var(--surface-sunken); border: 1px solid var(--border); padding: 0.12rem 0.5rem; border-radius: var(--radius-xs); color: var(--text-secondary); }
.info-empty { color: var(--text-tertiary); }
.card-body { display: flex; flex-direction: column; padding: 0.35rem 1.1rem 0.5rem; }
.info-row { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px dashed var(--border); }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 0.68rem; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
.info-value { font-size: 0.82rem; color: var(--text); text-align: right; display: flex; align-items: center; gap: 0.4rem; justify-content: flex-end; flex-wrap: wrap; min-width: 0; }
.pdf-chip { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-size: 0.72rem; font-weight: 600; text-decoration: none; background: var(--danger); color: #fff; border: 1px solid var(--danger); cursor: pointer; transition: var(--transition); }
.pdf-chip:hover { filter: brightness(0.96); }
.pdf-chip.empty { background: var(--surface-sunken); color: var(--text-tertiary); border-color: transparent; cursor: default; opacity: 0.6; }
.pdf-chip[disabled] { pointer-events: none; }
.card-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; padding: 0.75rem 1.1rem; border-top: 1px solid var(--border); background: var(--surface-sunken); flex-wrap: wrap; }
.status-toggle { display: flex; align-items: center; gap: 0.55rem; }
.toggle-btn { width: 36px; height: 20px; border-radius: 999px; background: var(--neutral-soft); border: 1px solid var(--border-strong); cursor: pointer; position: relative; transition: var(--transition); padding: 0; flex-shrink: 0; }
.toggle-btn.active { background: var(--brand); border-color: var(--brand); }
.toggle-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.toggle-btn:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
.toggle-dot { position: absolute; top: 1px; left: 1px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: var(--transition); box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.toggle-btn.active .toggle-dot { left: 17px; }
.status-text { font-size: 0.78rem; font-weight: 600; }
.status-text.abierto { color: var(--brand); }
.status-text.cerrado { color: var(--text-tertiary); }
.card-actions { display: flex; gap: 0.35rem; }
.icon-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.8rem; }
.icon-btn:hover { background: var(--surface-sunken); border-color: var(--border-strong); color: var(--text); }
.icon-btn.danger:hover { background: var(--danger-soft); border-color: var(--danger); color: var(--danger); }
.card-hover-hint { position: absolute; bottom: 0; left: 0; right: 0; display: flex; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.3rem; font-size: 0.7rem; font-weight: 600; color: #fff; background: var(--brand); transform: translateY(100%); transition: transform 0.2s ease; pointer-events: none; }
.ensayo-card:hover .card-hover-hint { transform: translateY(0); }
.empty-row { padding: 3rem 1.5rem; text-align: center; grid-column: 1 / -1; }
.empty-content { padding: 1rem; }
.empty-icon { font-size: 2.4rem; color: var(--border-strong); margin-bottom: 0.85rem; }
.empty-content h5 { color: var(--text); font-size: 0.95rem; font-weight: 600; margin-bottom: 0.35rem; }
.empty-content p { color: var(--text-secondary); font-size: 0.82rem; margin-bottom: 1.25rem; }
.table-footer { padding: 0.85rem 1.25rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.pagination-wrapper { display: flex; gap: 0.25rem; align-items: center; }
.page-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.76rem; font-weight: 500; }
.page-btn:hover:not(:disabled) { background: var(--surface-sunken); border-color: var(--border-strong); color: var(--text); }
.page-btn.active { background: var(--brand); border-color: var(--brand); color: #fff; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-ellipsis { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: var(--text-tertiary); font-size: 0.85rem; }
.page-info { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
.page-info-separator { color: var(--border-strong); }
.modal-overlay { position: fixed; inset: 0; background: rgba(15,18,12,0.5); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; animation: overlayIn 0.15s ease; }
@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
.modal-container { background: var(--surface); border-radius: var(--radius-xl); width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); border: 1px solid var(--border); animation: modalIn 0.2s ease; }
@keyframes modalIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.form-modal { max-width: 620px; }
.pdf-viewer { max-width: 900px; width: calc(100% - 2rem); max-height: 92vh; }
.pdf-viewer .pdf-body { padding: 0.5rem 1rem 1rem; min-height: 60vh; display: flex; align-items: stretch; }
.pdf-embed-wrapper { flex: 1; display: flex; }
.pdf-iframe { width: 100%; height: 100%; border: none; }
.pdf-viewer .modal-footer { gap: 0.5rem; }
.empty-pdf-note { color: var(--text-secondary); padding: 1rem; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.35rem; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--surface); z-index: 1; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
.modal-title { font-size: 0.95rem; font-weight: 600; color: var(--text); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.modal-close-btn { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.8rem; }
.modal-close-btn:hover { background: var(--surface-sunken); color: var(--text); }
.modal-body { padding: 1.1rem 1.35rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.6rem; padding: 0.9rem 1.35rem; border-top: 1px solid var(--border); position: sticky; bottom: 0; background: var(--surface); border-radius: 0 0 var(--radius-xl) var(--radius-xl); }
.warning-icon { color: var(--warning); }
.warning-box { display: flex; align-items: flex-start; gap: 0.55rem; padding: 0.7rem 0.9rem; background: var(--warning-soft); border: 1px solid var(--warning); border-radius: var(--radius-sm); color: var(--warning); font-size: 0.8rem; margin-bottom: 0.9rem; line-height: 1.45; }
.delete-preview { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 0.9rem; }
.preview-info h6 { margin: 0 0 0.2rem; color: var(--text); font-weight: 600; font-size: 0.86rem; }
.preview-info p { margin: 0 0 0.45rem; font-size: 0.78rem; color: var(--text-secondary); }
.delete-message { color: var(--text-secondary); font-size: 0.86rem; line-height: 1.55; margin-bottom: 0.9rem; }
.delete-message strong { color: var(--text); }
.delete-confirm-input { margin-top: 0.9rem; }
.bulk-delete-list { max-height: 200px; overflow-y: auto; margin-top: 0.9rem; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.bulk-delete-item { display: flex; justify-content: space-between; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); font-size: 0.8rem; }
.bulk-delete-item:last-child { border-bottom: none; }
.modal-btn { padding: 0.55rem 1.1rem; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: var(--transition); border: 1px solid transparent; font-family: var(--font-body); display: flex; align-items: center; gap: 0.4rem; }
.modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.modal-btn.primary { background: var(--brand); color: #fff; }
.modal-btn.primary:hover:not(:disabled) { background: var(--brand-hover); }
.modal-btn.secondary { background: var(--surface); border-color: var(--border); color: var(--text); }
.modal-btn.secondary:hover { background: var(--surface-sunken); border-color: var(--border-strong); }
.modal-btn.danger { background: var(--danger); color: #fff; }
.modal-btn.danger:hover:not(:disabled) { filter: brightness(0.92); }
.spin { display: inline-block; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group:last-child:nth-child(odd) { grid-column: span 2; }
.form-label { font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; gap: 0.4rem; }
.form-input, .form-select { padding: 0.55rem 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-sunken); color: var(--text); font-size: 0.85rem; font-family: var(--font-body); transition: var(--transition); }
.form-input:focus, .form-select:focus { outline: none; border-color: var(--brand); background: var(--surface); box-shadow: 0 0 0 3px var(--brand-soft); }
.pdf-optional { font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-tertiary); background: var(--neutral-soft); padding: 0.05rem 0.4rem; border-radius: 6px; }
.pdf-hidden-input { display: none; }
.pdf-dropzone { position: relative; border: 1.5px dashed var(--border-strong); border-radius: var(--radius-md); background: var(--surface-sunken); padding: 1.1rem 1rem; text-align: center; cursor: pointer; transition: var(--transition); display: flex; flex-direction: column; align-items: center; gap: 0.35rem; min-height: 96px; justify-content: center; }
.pdf-dropzone:hover, .pdf-dropzone:focus-visible { border-color: var(--brand); background: var(--brand-soft); outline: none; }
.pdf-dropzone.dragover { border-color: var(--brand); background: var(--brand-soft); box-shadow: 0 0 0 3px var(--brand-soft); }
.pdf-dropzone.has-file { border-style: solid; border-color: var(--border); background: var(--surface); cursor: default; text-align: left; }
.pdf-dz-icon { font-size: 1.5rem; color: var(--brand); line-height: 1; }
.pdf-dz-text { font-size: 0.82rem; color: var(--text); }
.pdf-dz-text strong { color: var(--brand); }
.pdf-dz-hint { font-size: 0.72rem; color: var(--text-tertiary); }
.pdf-file-row { display: flex; align-items: center; gap: 0.75rem; width: 100%; }
.pdf-file-icon { font-size: 1.6rem; color: var(--danger); flex-shrink: 0; line-height: 1; }
.pdf-file-meta { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; flex: 1; }
.pdf-file-name { font-size: 0.84rem; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pdf-file-size { font-size: 0.72rem; color: var(--text-secondary); }
.pdf-remove-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); flex-shrink: 0; font-size: 0.72rem; }
.pdf-remove-btn:hover { background: var(--danger-soft); border-color: var(--danger); color: var(--danger); }
.pdf-existing-link { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.5rem; font-size: 0.76rem; font-weight: 600; color: var(--brand); text-decoration: none; }
.pdf-existing-link:hover { text-decoration: underline; }
.pdf-replace-note { display: flex; align-items: center; gap: 0.4rem; margin: 0.5rem 0 0; font-size: 0.74rem; color: var(--text-secondary); }
.row-type-state { grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; align-items: end; gap: 0.9rem; }
.row-type-state .left { justify-self: start; display: flex; flex-direction: column; width: 100%; }
.row-type-state .right { justify-self: end; display: flex; flex-direction: column; align-items: flex-end; width: 100%; }
.form-input, .form-select, .select-match, .right-select { height: 40px; min-height: 40px; box-sizing: border-box; display: block; width: 100%; padding: 0.55rem 0.75rem; font-size: 0.85rem; line-height: 1.2; }
@media (max-width: 768px) { .row-type-state { grid-template-columns: 1fr; align-items: stretch; gap: 0.7rem; } .row-type-state .right { align-items: stretch; } .row-type-state .left, .row-type-state .right { justify-self: stretch; width: 100%; } }
.toast-notification { position: fixed; top: 1.25rem; right: 1.25rem; display: flex; align-items: flex-start; gap: 0.7rem; padding: 0.9rem 1.1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 10000; max-width: 380px; animation: slideInRight 0.22s ease; border-left: 3px solid var(--brand); }
.toast-notification.success { border-left-color: var(--brand); }
.toast-notification.error { border-left-color: var(--danger); }
.toast-notification.warning { border-left-color: var(--warning); }
.toast-notification > i { font-size: 1.05rem; flex-shrink: 0; margin-top: 0.1rem; }
.toast-notification.success > i { color: var(--brand); }
.toast-notification.error > i { color: var(--danger); }
.toast-notification.warning > i { color: var(--warning); }
.toast-content { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
.toast-content strong { font-size: 0.82rem; color: var(--text); }
.toast-content span { font-size: 0.78rem; color: var(--text-secondary); }
.toast-close { background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.2rem; border-radius: 50%; transition: var(--transition); flex-shrink: 0; }
.toast-close:hover { color: var(--text); background: var(--surface-sunken); }
@keyframes slideInRight { from { transform: translateX(12px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@media (max-width: 1200px) { .header-content { flex-direction: column; align-items: flex-start; } .header-stats { width: 100%; } .stat-card { flex: 1; min-width: 130px; } }
@media (max-width: 992px) { .filters-grid { flex-direction: column; align-items: stretch; } .actions-group { margin-left: 0; justify-content: flex-end; } .search-group { min-width: 100%; } .cards-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }
@media (max-width: 768px) { .cards-grid { grid-template-columns: 1fr; padding: 0.85rem; gap: 0.85rem; } .card-info h5 { font-size: 0.9rem; } .form-grid { grid-template-columns: 1fr; } .form-group:last-child:nth-child(odd) { grid-column: span 1; } .pdf-group { grid-column: span 1 !important; } .table-header { flex-direction: column; align-items: stretch; } .table-controls { justify-content: space-between; } .bulk-actions { flex-wrap: wrap; } }
@media (max-width: 480px) { .admin-header { padding: 1.1rem 0 0.9rem; } .page-title { font-size: 1.25rem; } .header-stats { gap: 0.5rem; } .stat-card { padding: 0.6rem 0.8rem; min-width: 96px; } .stat-number { font-size: 1.05rem; } .control-body { padding: 0.9rem; } .table-footer { flex-direction: column; align-items: center; } .page-info { justify-content: center; } .actions-group { flex-wrap: wrap; } .action-btn { flex: 1; min-width: 100px; justify-content: center; } .modal-container { max-width: 95vw; } }
@media (prefers-reduced-motion: reduce) { .toast-notification, .spin, .ensayo-card { animation: none; } .ensayo-card:hover { transform: none; } * { transition-duration: 0.01ms !important; } }
</style>

<style>
  .modal-btn { padding: 0.55rem 1.1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; border: 1px solid transparent; display: inline-flex; align-items: center; gap: 0.4rem; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .modal-btn.primary { background: #3f7a2a !important; color: #ffffff !important; border-color: transparent !important; }
  .modal-btn.primary:hover:not(:disabled) { background: #356822 !important; }
  .modal-btn.primary i, .modal-btn.primary span { color: #ffffff !important; }
  .modal-container .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
  .modal-container .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
  .modal-container .form-input, .modal-container .form-select, .modal-container .select-match, .modal-container .right-select { height: 40px; min-height: 40px; padding: 0.55rem 0.75rem; font-size: 0.85rem; line-height: 1.2; box-sizing: border-box; width: 100%; border-radius: 8px; border: 1px solid #e6e8e2; background: #fafbf9; color: #1b201a; }
  [data-bs-theme="dark"] .modal-container .form-input, [data-bs-theme="dark"] .modal-container .form-select, [data-bs-theme="dark"] .modal-container .select-match, [data-bs-theme="dark"] .modal-container .right-select { background: #12150f; border-color: rgba(255,255,255,0.08); color: #eaeee4; }
  .modal-container .row-type-state { grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; align-items: end; gap: 0.9rem; }
  .modal-container .row-type-state .left { justify-self: start; }
  .modal-container .row-type-state .right { justify-self: end; display:flex; flex-direction:column; align-items:flex-end; }
  .modal-container .pdf-group { grid-column: span 2; }
  .modal-container .pdf-hidden-input { display: none; }
  .modal-container .pdf-dropzone { position: relative; border: 1.5px dashed #c4cbba; border-radius: 10px; background: #fafbf9; padding: 1.1rem 1rem; text-align: center; cursor: pointer; transition: all 0.15s ease; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; min-height: 96px; justify-content: center; box-sizing: border-box; }
  .modal-container .pdf-dropzone:hover, .modal-container .pdf-dropzone:focus-visible { border-color: #3f7a2a; background: rgba(63,122,42,0.08); outline: none; }
  .modal-container .pdf-dropzone.dragover { border-color: #3f7a2a; background: rgba(63,122,42,0.12); box-shadow: 0 0 0 3px rgba(63,122,42,0.14); }
  .modal-container .pdf-dropzone.has-file { border-style: solid; border-color: #e6e8e2; background: #ffffff; cursor: default; text-align: left; }
  .modal-container .pdf-dz-icon { font-size: 1.5rem; color: #3f7a2a; line-height: 1; }
  .modal-container .pdf-dz-text { font-size: 0.82rem; color: #1b201a; }
  .modal-container .pdf-dz-text strong { color: #3f7a2a; }
  .modal-container .pdf-dz-hint { font-size: 0.72rem; color: #6c7563; }
  .modal-container .pdf-file-row { display: flex; align-items: center; gap: 0.75rem; width: 100%; }
  .modal-container .pdf-file-icon { font-size: 1.6rem; color: #d64545; flex-shrink: 0; line-height: 1; }
  .modal-container .pdf-file-meta { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; flex: 1; }
  .modal-container .pdf-file-name { font-size: 0.84rem; font-weight: 600; color: #1b201a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .modal-container .pdf-file-size { font-size: 0.72rem; color: #6c7563; }
  .modal-container .pdf-remove-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #e6e8e2; background: #ffffff; color: #6c7563; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0; font-size: 0.72rem; }
  .modal-container .pdf-remove-btn:hover { background: rgba(214,69,69,0.12); border-color: #d64545; color: #d64545; }
  .modal-container .pdf-existing-link { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.5rem; font-size: 0.76rem; font-weight: 600; color: #3f7a2a; text-decoration: none; }
  .modal-container .pdf-existing-link:hover { text-decoration: underline; }
  .modal-container .pdf-replace-note { display: flex; align-items: center; gap: 0.4rem; margin: 0.5rem 0 0; font-size: 0.74rem; color: #6c7563; }
  .modal-container .pdf-optional { font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #6c7563; background: rgba(0,0,0,0.05); padding: 0.05rem 0.4rem; border-radius: 6px; }
  [data-bs-theme="dark"] .modal-container .pdf-dropzone { border-color: rgba(255,255,255,0.14); background: #12150f; }
  [data-bs-theme="dark"] .modal-container .pdf-dropzone:hover, [data-bs-theme="dark"] .modal-container .pdf-dropzone.dragover { border-color: #7cbb55; background: rgba(124,187,85,0.14); }
  [data-bs-theme="dark"] .modal-container .pdf-dropzone.has-file { border-color: rgba(255,255,255,0.08); background: #161a13; }
  [data-bs-theme="dark"] .modal-container .pdf-dz-icon { color: #7cbb55; }
  [data-bs-theme="dark"] .modal-container .pdf-dz-text { color: #eaeee4; }
  [data-bs-theme="dark"] .modal-container .pdf-dz-text strong { color: #7cbb55; }
  [data-bs-theme="dark"] .modal-container .pdf-file-name { color: #eaeee4; }
  [data-bs-theme="dark"] .modal-container .pdf-file-icon { color: #e2696a; }
  [data-bs-theme="dark"] .modal-container .pdf-remove-btn { background: #161a13; border-color: rgba(255,255,255,0.08); color: #99a38e; }
  [data-bs-theme="dark"] .modal-container .pdf-existing-link { color: #7cbb55; }
  [data-bs-theme="dark"] .modal-container .pdf-optional { color: #99a38e; background: rgba(255,255,255,0.06); }
  @media (max-width: 768px) { .modal-container .form-grid { grid-template-columns: 1fr; } .modal-container .pdf-group { grid-column: span 1; } .modal-container .row-type-state { grid-template-columns: 1fr; gap: 0.7rem; align-items: stretch; } .modal-container .row-type-state .right { align-items: stretch; } }
</style>
