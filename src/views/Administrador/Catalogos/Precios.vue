<template>
  <div :data-bs-theme="currentTheme" class="admin-catalogo-precios-page">
    <PageHeader
      icon="bi-tag-fill"
      title="Catálogo de Precios"
      :subtitle="`Gestión de precios por áreas y ramas • Actualización ${fechaActualizacion}`"
      :breadcrumb="[
        { label: 'Dashboard', to: '/admin', icon: 'bi-house-door' },
        { label: 'Catálogo de Precios', icon: 'bi-tag' }
      ]"
    >
      <template #actions>
        <div class="quick-stats">
          <StatCard icon="bi-diagram-3" variant="total" :value="totalAreas" label="Áreas" />
          <StatCard icon="bi-diagram-2" variant="active" :value="totalRamas" label="Ramas" />
          <StatCard icon="bi-calculator" variant="upcoming" :value="totalItems" label="Precios Activos" />
        </div>
      </template>
    </PageHeader>

    <!-- Panel de control con menú interno -->
    <section class="control-panel">
      <div class="container">
        <div class="panel-card">
          <div class="panel-header">
            <h3 class="panel-title">
              <i class="bi bi-menu-button-wide me-2"></i>Navegación
            </h3>
          </div>

          <div class="panel-body">
            <div class="filters-grid">
              <!-- Menú de navegación interno -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-grid-3x3-gap-fill me-1"></i>Seleccionar Catálogo
                </label>
                <div class="nav-tabs">
                  <button
                    class="nav-tab-btn"
                    :class="{ 'active': catalogoActivo === 'areas' }"
                    @click="switchCatalog('areas')"
                  >
                    <i class="bi bi-diagram-3 me-2"></i>
                    Áreas
                    <span class="badge-count">{{ totalAreas }}</span>
                  </button>
                  <button
                    class="nav-tab-btn"
                    :class="{ 'active': catalogoActivo === 'ramas' }"
                    @click="switchCatalog('ramas')"
                  >
                    <i class="bi bi-diagram-2 me-2"></i>
                    Ramas
                    <span class="badge-count">{{ totalRamas }}</span>
                  </button>
                </div>
              </div>

              <!-- Búsqueda -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-search me-1"></i>Buscar
                </label>
                <SearchBox
                  v-model="searchQuery"
                  placeholder="Buscar por referencia, descripción o año..."
                  :debounce="250"
                  @search="handleSearch"
                />
              </div>

              <!-- Filtro por año -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-calendar me-1"></i>Filtrar por año
                </label>
                <div class="year-filters">
                  <select v-model="filtroAnio" class="form-select">
                    <option :value="null">Todos los años</option>
                    <option v-for="anio in aniosDisponibles" :key="anio" :value="anio">
                      {{ anio }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Filtro por Área / Rama -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-filter-square me-1"></i>Filtrar por Área / Rama
                </label>
                <div>
                  <div v-if="catalogoActivo === 'areas'">
                    <select v-model="filtroAreaId" class="form-select" @change="onFilterChange">
                      <option :value="null">Todas las áreas</option>
                      <option v-for="a in availableAreas" :key="a.id" :value="a.id">{{ a.nombre }}</option>
                    </select>
                  </div>
                  <div v-else>
                    <select v-model="filtroRamaId" class="form-select" @change="onFilterChange">
                      <option :value="null">Todas las ramas</option>
                      <option v-for="r in availableRamas" :key="r.id" :value="r.id">{{ r.nombre }}</option>
                    </select>
                  </div>
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
                  <button class="btn btn-primary" @click="exportData">
                    <i class="bi bi-download me-1"></i>Exportar
                  </button>
                  <button class="btn btn-success" @click="openCreateModal">
                    <i class="bi bi-plus-lg me-1"></i>Nuevo precio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de precios -->
    <main class="main-content">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">
                <i :class="catalogoActivo === 'areas' ? 'bi-diagram-3' : 'bi-diagram-2'" class="me-2"></i>
                Catálogo de Precios - {{ catalogoActivo === 'areas' ? 'Áreas' : 'Ramas' }}
              </h4>
              <p class="table-subtitle">
                Mostrando {{ itemsFiltrados.length }} de {{ totalItems }} registros
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

              <div class="view-options">
                <button class="btn btn-sm btn-outline-secondary" @click="toggleVistaCompacta" title="Vista compacta">
                  <i class="bi bi-list"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <!-- Tabla para ÁREAS (con todas sus columnas) -->
            <table v-if="catalogoActivo === 'areas'" class="precios-table">
              <thead>
                <tr>
                  <th class="id-column">ID</th>
                  <th class="ref-column">Referencia</th>
                  <th class="anio-column">Año</th>
                  <th class="desc-column">Descripción</th>
                  <th class="precio-column">Precio Unitario</th>
                  <th class="precio-column">Precio Desc. 13%</th>
                  <th class="precio-column">Precio Ensayo Bilateral</th>
                  <th class="precio-column">Precio Desc. 16%</th>
                  <th class="precio-column">Precio Desc. 19%</th>
                  <th class="precio-column">Precio USD</th>
                  <th class="precio-column">Precio USD Desc. 19%</th>
                  <th class="actions-column">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsPaginados" :key="item.id">
                  <td class="id-cell">
                    <span class="id-badge">#{{ item.id_cotizacion_area || item.id }}</span>
                  </td>
                  <td class="ref-cell">
                    <div class="ref-info">
                      <i class="bi bi-upc-scan"></i>
                      <span>{{ item.referencia || 'N/A' }}</span>
                    </div>
                  </td>
                  <td class="anio-cell">
                    <span class="anio-badge">{{ item.anio || '-' }}</span>
                  </td>
                  <td class="desc-cell">
                    <div class="desc-text" :title="item.descripcion">
                      {{ truncateText(item.descripcion, 60) || '-' }}
                    </div>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value principal">
                      <span class="currency">$</span>{{ formatPrice(item.precio_unitario) }}
                    </div>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value" v-if="item.precio_desc_13 != null">
                      <span class="currency">$</span>{{ formatPrice(item.precio_desc_13) }}
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value" v-if="item.precio_ensayo_bilateral != null">
                      <span class="currency">$</span>{{ formatPrice(item.precio_ensayo_bilateral) }}
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value" v-if="item.precio_desc_16 != null">
                      <span class="currency">$</span>{{ formatPrice(item.precio_desc_16) }}
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value" v-if="item.precio_desc_19 != null">
                      <span class="currency">$</span>{{ formatPrice(item.precio_desc_19) }}
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value usd" v-if="item.precio_usd != null">
                      <span class="currency">USD</span> {{ formatPrice(item.precio_usd) }}
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value usd" v-if="item.precio_usd_desc_19 != null">
                      <span class="currency">USD</span> {{ formatPrice(item.precio_usd_desc_19) }}
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button class="btn-icon btn-primary" @click="verDetalle(item)" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn-icon btn-warning" @click="editarItem(item)" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn-icon btn-danger" @click="eliminarItem(item)" title="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="itemsFiltrados.length === 0">
                  <td colspan="12" class="empty-state">
                    <EmptyState
                        icon="bi-tag"
                        title="No se encontraron registros"
                        message="No hay precios que coincidan con los filtros aplicados"
                        action-label="Limpiar filtros"
                        @action="clearFilters"
                      />
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Tabla para RAMAS (con todas sus columnas) -->
            <table v-else class="precios-table">
              <thead>
                <tr>
                  <th class="id-column">ID</th>
                  <th class="ref-column">Referencia</th>
                  <th class="anio-column">Año</th>
                  <th class="desc-column">Descripción</th>
                  <th class="precio-column">Precio Unitario</th>
                  <th class="precio-column">Precio Bilateral</th>
                  <th class="precio-column">Precio USD</th>
                  <th class="actions-column">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsPaginados" :key="item.id">
                  <td class="id-cell">
                    <span class="id-badge">#{{ item.id_cotizacion_rama || item.id }}</span>
                  </td>
                  <td class="ref-cell">
                    <div class="ref-info">
                      <i class="bi bi-upc-scan"></i>
                      <span>{{ item.referencia || 'N/A' }}</span>
                    </div>
                  </td>
                  <td class="anio-cell">
                    <span class="anio-badge">{{ item.anio || '-' }}</span>
                  </td>
                  <td class="desc-cell">
                    <div class="desc-text" :title="item.descripcion">
                      {{ truncateText(item.descripcion, 60) || '-' }}
                    </div>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value principal">
                      <span class="currency">$</span>{{ formatPrice(item.precio_unitario) }}
                    </div>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value" v-if="item.precio_bilateral != null">
                      <span class="currency">$</span>{{ formatPrice(item.precio_bilateral) }}
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="precio-cell">
                    <div class="precio-value usd" v-if="item.precio_unitario_usd != null">
                      <span class="currency">USD</span> {{ formatPrice(item.precio_unitario_usd) }}
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button class="btn-icon btn-primary" @click="verDetalle(item)" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn-icon btn-warning" @click="editarItem(item)" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn-icon btn-danger" @click="eliminarItem(item)" title="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="itemsFiltrados.length === 0">
                  <td colspan="8" class="empty-state">
                    <EmptyState
                        icon="bi-tag"
                        title="No se encontraron registros"
                        message="No hay precios que coincidan con los filtros aplicados"
                        action-label="Limpiar filtros"
                        @action="clearFilters"
                      />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div class="table-footer" v-if="itemsFiltrados.length > 0">
            <div class="pagination-controls">
              <BasePagination v-model:page="currentPage" :total-pages="totalPages" />

              <div class="pagination-info">
                <span class="text-muted">
                  Página {{ currentPage }} de {{ totalPages }} •
                  Mostrando {{ startItem }}-{{ endItem }} de {{ itemsFiltrados.length }} registros
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Detalle -->
    <div v-if="showDetailModal" class="modal-backdrop show" @click="showDetailModal = false"></div>
    <div v-if="showDetailModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i>
              Detalle del Precio - {{ catalogoActivo === 'areas' ? 'Área' : 'Rama' }}
            </h5>
            <button type="button" class="btn-close" @click="showDetailModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="detail-info-grid" v-if="itemSeleccionado">
              <div class="info-item">
                <div class="info-icon">
                  <i class="bi bi-upc-scan"></i>
                </div>
                <div class="info-content">
                  <span class="info-label">Referencia</span>
                  <span class="info-value">{{ itemSeleccionado.referencia || 'N/A' }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon">
                  <i class="bi bi-calendar"></i>
                </div>
                <div class="info-content">
                  <span class="info-label">Año</span>
                  <span class="info-value">{{ itemSeleccionado.anio || '-' }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon">
                  <i class="bi bi-file-text"></i>
                </div>
                <div class="info-content">
                  <span class="info-label">Descripción</span>
                  <span class="info-value">{{ itemSeleccionado.descripcion || 'Sin descripción' }}</span>
                </div>
              </div>

              <!-- Campos específicos de Área -->
              <template v-if="catalogoActivo === 'areas'">
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-calculator"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio Unitario</span>
                    <span class="info-value">${{ formatPrice(itemSeleccionado.precio_unitario) }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-percent"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio Desc. 13%</span>
                    <span class="info-value">${{ formatPrice(itemSeleccionado.precio_desc_13) || '-' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-arrow-left-right"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio Ensayo Bilateral</span>
                    <span class="info-value">${{ formatPrice(itemSeleccionado.precio_ensayo_bilateral) || '-' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-percent"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio Desc. 16%</span>
                    <span class="info-value">${{ formatPrice(itemSeleccionado.precio_desc_16) || '-' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-percent"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio Desc. 19%</span>
                    <span class="info-value">${{ formatPrice(itemSeleccionado.precio_desc_19) || '-' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-currency-dollar"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio USD</span>
                    <span class="info-value">USD {{ formatPrice(itemSeleccionado.precio_usd) || '-' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-currency-dollar"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio USD Desc. 19%</span>
                    <span class="info-value">USD {{ formatPrice(itemSeleccionado.precio_usd_desc_19) || '-' }}</span>
                  </div>
                </div>
              </template>

              <!-- Campos específicos de Rama -->
              <template v-else>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-calculator"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio Unitario</span>
                    <span class="info-value">${{ formatPrice(itemSeleccionado.precio_unitario) }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-arrow-left-right"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio Bilateral</span>
                    <span class="info-value">${{ formatPrice(itemSeleccionado.precio_bilateral) || '-' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-currency-dollar"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Precio USD</span>
                    <span class="info-value">USD {{ formatPrice(itemSeleccionado.precio_unitario_usd) || '-' }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="showDetailModal = false">
              <i class="bi bi-x-lg me-1"></i>Cerrar
            </button>
            <button type="button" class="btn btn-primary" @click="editarItem(itemSeleccionado)">
              <i class="bi bi-pencil me-1"></i>Editar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showFormModal" class="modal-backdrop show" @click="showFormModal = false"></div>
    <div v-if="showFormModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="catalogoActivo === 'areas' ? 'bi-diagram-3' : 'bi-diagram-2'" class="me-2"></i>
              {{ modoFormulario === 'create' ? 'Nuevo' : 'Editar' }} Precio - {{ catalogoActivo === 'areas' ? 'Área' : 'Rama' }}
            </h5>
            <button type="button" class="btn-close" @click="showFormModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label required">Referencia</label>
                <input v-model="formData.referencia" type="text" class="form-control" placeholder="Código de referencia" required>
              </div>
              <div class="col-md-3">
                <label class="form-label required">Año</label>
                <input v-model.number="formData.anio" type="number" class="form-control" placeholder="YYYY" required>
              </div>
              <div class="col-md-3">
                <label class="form-label required">Precio Unitario</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input v-model.number="formData.precio_unitario" type="number" step="0.01" class="form-control" required>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea v-model="formData.descripcion" class="form-control" rows="2" placeholder="Descripción detallada del servicio"></textarea>
              </div>

              <!-- Campos específicos de Área -->
              <template v-if="catalogoActivo === 'areas'">
                <div class="col-md-4">
                  <label class="form-label">Precio Desc. 13%</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input v-model.number="formData.precio_desc_13" type="number" step="0.01" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Precio Ensayo Bilateral</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input v-model.number="formData.precio_ensayo_bilateral" type="number" step="0.01" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Precio Desc. 16%</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input v-model.number="formData.precio_desc_16" type="number" step="0.01" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Precio Desc. 19%</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input v-model.number="formData.precio_desc_19" type="number" step="0.01" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Precio USD</label>
                  <div class="input-group">
                    <span class="input-group-text">USD</span>
                    <input v-model.number="formData.precio_usd" type="number" step="0.01" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Precio USD Desc. 19%</label>
                  <div class="input-group">
                    <span class="input-group-text">USD</span>
                    <input v-model.number="formData.precio_usd_desc_19" type="number" step="0.01" class="form-control">
                  </div>
                </div>
              </template>

              <!-- Campos específicos de Rama -->
              <template v-else>
                <div class="col-md-6">
                  <label class="form-label">Precio Bilateral</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input v-model.number="formData.precio_bilateral" type="number" step="0.01" class="form-control">
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Precio USD</label>
                  <div class="input-group">
                    <span class="input-group-text">USD</span>
                    <input v-model.number="formData.precio_unitario_usd" type="number" step="0.01" class="form-control">
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showFormModal = false">Cancelar</button>
            <button class="btn btn-primary" @click="guardarItem">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmación Eliminar -->
    <div v-if="itemToDelete" class="modal-backdrop show" @click="itemToDelete = null"></div>
    <div v-if="itemToDelete" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-danger me-2"></i>
              Confirmar eliminación
            </h5>
            <button type="button" class="btn-close" @click="itemToDelete = null"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              Esta acción no se puede deshacer
            </div>
            <div class="item-preview">
              <div class="preview-info">
                <h6>{{ itemToDelete.referencia || 'Sin referencia' }}</h6>
                <p class="text-muted mb-1">Año: {{ itemToDelete.anio }}</p>
                <p class="mb-0">Precio: ${{ formatPrice(itemToDelete.precio_unitario) }}</p>
              </div>
            </div>
            <p class="mt-3">¿Estás seguro de que deseas eliminar este precio?</p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="itemToDelete = null">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="confirmarEliminacion">
              <i class="bi bi-trash me-1"></i>Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div id="adminToast" class="toast" role="alert" ref="toastEl">
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto"><i :class="toastIcon"></i> {{ toastTitle }}</strong>
          <small>Ahora mismo</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">{{ toastMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import type { Toast } from 'bootstrap'

type ToastType = 'success' | 'info' | 'warning' | 'error'

interface PrecioArea {
  id_cotizacion_area?: number
  id?: number
  idareacoti?: number
  referencia: string | null
  anio: number | null
  descripcion?: string | null
  precio_unitario: number
  precio_desc_13?: number | null
  precio_ensayo_bilateral?: number | null
  precio_desc_16?: number | null
  precio_desc_19?: number | null
  precio_usd?: number | null
  precio_usd_desc_19?: number | null
}

/**
 * Las dos tablas de la vista (areas y ramas) recorren el mismo computed
 * `itemsPaginados`, por lo que su tipo es la union de ambas formas. Este
 * alias declara los campos exclusivos de cada una como opcionales, que es
 * exactamente lo que la plantilla ya comprueba con `v-if="... != null"`.
 * No cambia nada en tiempo de ejecucion.
 */
interface PrecioRama {
  id_cotizacion_rama?: number
  id?: number
  idramacoti?: number
  referencia: string | null
  anio: number | null
  descripcion?: string | null
  precio_unitario: number
  precio_bilateral?: number | null
  precio_unitario_usd?: number | null
}

type PrecioItem = Partial<PrecioArea> & Partial<PrecioRama>

const { currentTheme } = useTheme()
import { API_BASE } from '@/config/api'
import { useTheme } from '@/composables/useTheme'
import PageHeader from '@/components/UI/PageHeader.vue'
import StatCard from '@/components/UI/StatCard.vue'
import SearchBox from '@/components/UI/SearchBox.vue'
import EmptyState from '@/components/UI/EmptyState.vue'
import BasePagination from '@/components/UI/BasePagination.vue'

// Estado
const catalogoActivo = ref<'areas' | 'ramas'>('areas')
const searchQuery = ref('')
const filtroAnio = ref<number | null>(null)
const filtroAreaId = ref<number | null>(null)
const filtroRamaId = ref<number | null>(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const vistaCompacta = ref(false)

// Datos
const areas = ref<PrecioArea[]>([])
const ramas = ref<PrecioRama[]>([])
const serverTotalAreas = ref<number | null>(null)
const serverTotalRamas = ref<number | null>(null)
const availableAreas = ref<Array<{ id: number; nombre: string }>>([])
const availableRamas = ref<Array<{ id: number; nombre: string }>>([])
const showDetailModal = ref(false)
const showFormModal = ref(false)
const modoFormulario = ref<'create' | 'edit'>('create')
const itemSeleccionado = ref<any>(null)
const itemToDelete = ref<any>(null)
const formData = ref<any>({})

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const totalAreas = computed(() => serverTotalAreas.value != null ? serverTotalAreas.value : areas.value.length)
const totalRamas = computed(() => serverTotalRamas.value != null ? serverTotalRamas.value : ramas.value.length)
const totalItems = computed(() => catalogoActivo.value === 'areas' ? areas.value.length : ramas.value.length)

const itemsActivos = computed(() => catalogoActivo.value === 'areas' ? areas.value : ramas.value)

const aniosDisponibles = computed(() => {
  const anios = new Set<number>()
  itemsActivos.value.forEach(item => {
    if (item.anio) anios.add(item.anio)
  })
  return Array.from(anios).sort((a, b) => b - a)
})

const itemsFiltrados = computed(() => {
  let items = [...itemsActivos.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      (item.referencia && item.referencia.toLowerCase().includes(query)) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(query))
    )
  }

  if (filtroAnio.value) {
    items = items.filter(item => item.anio === filtroAnio.value)
  }

  return items
})

const totalPages = computed(() => Math.max(1, Math.ceil(itemsFiltrados.value.length / itemsPerPage.value)))

const itemsPaginados = computed<PrecioItem[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return itemsFiltrados.value.slice(start, end)
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
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, itemsFiltrados.value.length))

const fechaActualizacion = computed(() => {
  return new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
})

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

// Métodos
const handleSearch = () => { currentPage.value = 1 }
const clearFilters = () => {
  searchQuery.value = ''
  filtroAnio.value = null
  currentPage.value = 1
}
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const toggleVistaCompacta = () => { vistaCompacta.value = !vistaCompacta.value }

const formatPrice = (v: number | null | undefined): string => {
  if (v == null) return '-'
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

// API Calls
const fetchAreas = async () => {
  try {
    const qs: string[] = []
    if (filtroAnio.value) qs.push(`anio=${filtroAnio.value}`)
    if (filtroAreaId.value) qs.push(`areaId=${filtroAreaId.value}`)
    const url = `${API_BASE}/precios/areas${qs.length ? '?' + qs.join('&') : ''}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Error fetching areas')
    const data = await res.json()
    // read total count header when provided by server
    const headerTotal = res.headers.get('X-Total-Count')
    serverTotalAreas.value = headerTotal != null ? Number(headerTotal) : null
    areas.value = data
  } catch (err) {
    console.error('fetchAreas', err)
    showToast('Error cargando precios de áreas', 'error')
  }
}

const fetchRamas = async () => {
  try {
    const qs: string[] = []
    if (filtroAnio.value) qs.push(`anio=${filtroAnio.value}`)
    if (filtroRamaId.value) qs.push(`ramaId=${filtroRamaId.value}`)
    const url = `${API_BASE}/precios/ramas${qs.length ? '?' + qs.join('&') : ''}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Error fetching ramas')
    const data = await res.json()
    const headerTotal = res.headers.get('X-Total-Count')
    serverTotalRamas.value = headerTotal != null ? Number(headerTotal) : null
    ramas.value = data
  } catch (err) {
    console.error('fetchRamas', err)
    showToast('Error cargando precios de ramas', 'error')
  }
}

const fetchAvailableAreas = async () => {
  try {
    const res = await fetch(`${API_BASE}/areas`)
    if (!res.ok) throw new Error('Error fetching available areas')
    availableAreas.value = await res.json()
  } catch (err) {
    console.error('fetchAvailableAreas', err)
  }
}

const fetchAvailableRamas = async () => {
  try {
    const res = await fetch(`${API_BASE}/ramas`)
    if (!res.ok) throw new Error('Error fetching available ramas')
    availableRamas.value = await res.json()
  } catch (err) {
    console.error('fetchAvailableRamas', err)
  }
}

const onFilterChange = () => {
  currentPage.value = 1
  if (catalogoActivo.value === 'areas') fetchAreas()
  else fetchRamas()
}

const switchCatalog = (which: 'areas' | 'ramas') => {
  catalogoActivo.value = which
  currentPage.value = 1
  // ensure available lists loaded
  if (!availableAreas.value.length) fetchAvailableAreas()
  if (!availableRamas.value.length) fetchAvailableRamas()
  if (which === 'areas') fetchAreas()
  else fetchRamas()
}

const openCreateModal = () => {
  modoFormulario.value = 'create'
  formData.value = {
    referencia: '',
    anio: new Date().getFullYear(),
    descripcion: '',
    precio_unitario: 0
  }
  showFormModal.value = true
}

const editarItem = (item: any) => {
  modoFormulario.value = 'edit'
  formData.value = { ...item }
  showFormModal.value = true
  if (showDetailModal.value) showDetailModal.value = false
}

const verDetalle = (item: any) => {
  itemSeleccionado.value = item
  showDetailModal.value = true
}

const guardarItem = async () => {
  const token = getAuthToken()
  const endpoint = catalogoActivo.value === 'areas' ? 'areas' : 'ramas'
  const method = modoFormulario.value === 'create' ? 'POST' : 'PUT'
  const url = modoFormulario.value === 'create'
    ? `${API_BASE}/precios/${endpoint}`
    : `${API_BASE}/precios/${endpoint}/${formData.value.id || formData.value.id_cotizacion_area || formData.value.id_cotizacion_rama}`

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(formData.value)
    })
    if (!res.ok) throw new Error('Error guardando')

    showToast('Precio guardado exitosamente', 'success')
    showFormModal.value = false
    if (catalogoActivo.value === 'areas') await fetchAreas()
    else await fetchRamas()
  } catch (err) {
    console.error('guardarItem', err)
    showToast('Error al guardar el precio', 'error')
  }
}

const eliminarItem = (item: any) => {
  itemToDelete.value = item
}

const confirmarEliminacion = async () => {
  if (!itemToDelete.value) return
  const token = getAuthToken()
  const endpoint = catalogoActivo.value === 'areas' ? 'areas' : 'ramas'
  const id = itemToDelete.value.id_cotizacion_area || itemToDelete.value.id_cotizacion_rama || itemToDelete.value.id

  try {
    const res = await fetch(`${API_BASE}/precios/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (!res.ok) throw new Error('Error eliminando')

    showToast('Precio eliminado exitosamente', 'success')
    itemToDelete.value = null
    if (catalogoActivo.value === 'areas') await fetchAreas()
    else await fetchRamas()
  } catch (err) {
    console.error('confirmarEliminacion', err)
    showToast('Error al eliminar el precio', 'error')
  }
}

const exportData = () => {
  const items = itemsFiltrados.value
  const headers = catalogoActivo.value === 'areas'
    ? ['ID', 'Referencia', 'Año', 'Descripción', 'Precio Unitario', 'Precio Desc 13%', 'Precio Ensayo Bilateral', 'Precio Desc 16%', 'Precio Desc 19%', 'Precio USD', 'Precio USD Desc 19%']
    : ['ID', 'Referencia', 'Año', 'Descripción', 'Precio Unitario', 'Precio Bilateral', 'Precio USD']

  const csvData = items.map(item => {
    if (catalogoActivo.value === 'areas') {
      const a = item as PrecioArea
      return [
        a.id_cotizacion_area || a.id,
        a.referencia || '',
        a.anio || '',
        a.descripcion || '',
        a.precio_unitario,
        a.precio_desc_13 != null ? a.precio_desc_13 : '',
        a.precio_ensayo_bilateral != null ? a.precio_ensayo_bilateral : '',
        a.precio_desc_16 != null ? a.precio_desc_16 : '',
        a.precio_desc_19 != null ? a.precio_desc_19 : '',
        a.precio_usd != null ? a.precio_usd : '',
        a.precio_usd_desc_19 != null ? a.precio_usd_desc_19 : ''
      ]
    } else {
      const r = item as PrecioRama
      return [
        r.id_cotizacion_rama || r.id,
        r.referencia || '',
        r.anio || '',
        r.descripcion || '',
        r.precio_unitario,
        r.precio_bilateral != null ? r.precio_bilateral : '',
        r.precio_unitario_usd != null ? r.precio_unitario_usd : ''
      ]
    }
  })

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `catalogo_precios_${catalogoActivo.value}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)

  showToast('Archivo CSV exportado', 'success', 'Exportación')
}

const showToast = (message: string, type: ToastType = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title || type.charAt(0).toUpperCase() + type.slice(1)
  toastType.value = type

  if (toastInstance) toastInstance.hide()
  if (toastEl.value) {
    import('bootstrap').then((bootstrap) => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 3000 })
      toastInstance.show()
    })
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  // load options and initial data
  fetchAvailableAreas()
  fetchAvailableRamas()
  fetchAreas()
  fetchRamas()
})
</script>

<style scoped>
/* Estilos completos iguales al diseño de usuarios */
.admin-catalogo-precios-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-catalogo-precios-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */

.stat-icon.active {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.stat-icon.upcoming {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
}

/* Panel de control */

/* Navegación tipo pestañas */
.nav-tabs {
  display: flex;
  gap: 0.5rem;
}

.nav-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

[data-bs-theme="dark"] .nav-tab-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.nav-tab-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  transform: translateY(-2px);
}

.nav-tab-btn.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.badge-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.nav-tab-btn.active .badge-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Search box */

.year-filters select {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .year-filters select {
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

.table-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

.table-responsive {
  overflow-x: auto;
}

/* Tabla de precios */
.precios-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.precios-table thead tr {
  background: var(--lab-bg, #f8f9fa);
  border-bottom: 2px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .precios-table thead tr {
  background: var(--lab-bg, #1a1a1a);
  border-bottom: 2px solid var(--color-gray-light, #2d2d2d);
}

.precios-table th {
  padding: 1rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

[data-bs-theme="dark"] .precios-table th {
  color: var(--color-gray-dark, #ADB5BD);
}

.precios-table td {
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.precios-table tbody tr:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .precios-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

/* Columnas */
.id-column, .id-cell { min-width: 70px; }
.ref-column, .ref-cell { min-width: 150px; }
.anio-column, .anio-cell { min-width: 80px; }
.desc-column, .desc-cell { min-width: 200px; }
.precio-column, .precio-cell { min-width: 120px; }
.actions-column, .actions-cell { min-width: 120px; }

.id-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-gray, #6C757D);
}

[data-bs-theme="dark"] .id-badge {
  background: rgba(255, 255, 255, 0.05);
}

.ref-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .ref-info {
  color: var(--color-dark, #F8F9FA);
}

.ref-info i {
  color: var(--color-primary, #1E9E4A);
  font-size: 1rem;
}

.anio-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary, #1E9E4A);
}

.desc-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.precio-value {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .precio-value {
  color: var(--color-dark, #F8F9FA);
}

.precio-value.principal {
  color: var(--color-primary, #1E9E4A);
  font-size: 1rem;
}

.precio-value.usd {
  color: var(--color-warning, #FF9800);
}

.currency {
  font-size: 0.75rem;
  font-weight: 400;
  margin-right: 0.15rem;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 0.35rem;
  justify-content: flex-start;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-icon.btn-primary:hover {
  background: var(--color-primary, #1E9E4A);
  color: white;
  border-color: var(--color-primary, #1E9E4A);
}

.btn-icon.btn-warning:hover {
  background: var(--color-warning, #ffc107);
  color: #333;
  border-color: var(--color-warning, #ffc107);
}

.btn-icon.btn-danger:hover {
  background: var(--color-danger, #dc3545);
  color: white;
  border-color: var(--color-danger, #dc3545);
}

/* Empty State */

/* Pagination */
.table-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-link {
  color: var(--color-primary, #1E9E4A);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  padding: 0.5rem 0.75rem;
  transition: all 0.3s ease;
}

.page-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
}

/* Modal */
.modal-backdrop {
  opacity: 0.5;
  z-index: 1040;
}

.modal.show {
  display: block;
  z-index: 1050;
}

.modal-body {
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

/* Detail Info Grid */
.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: var(--lab-bg, #f8f9fa);
  padding: 1.5rem;
  border-radius: 12px;
}

[data-bs-theme="dark"] .detail-info-grid {
  background: var(--lab-bg, #1a1a1a);
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

.item-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 12px;
  margin: 1rem 0;
}

/* Toast */

/* Responsive */

@media (max-width: 992px) {

  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {

  .nav-tabs {
    flex-direction: column;
  }

  .detail-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {

  .panel-body,
  .table-footer {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }
}

/* Animations */
.stat-card,
.panel-card,
.table-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.stat-card:hover,
.panel-card:hover,
.table-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(12, 18, 30, 0.08);
}

/* Dark mode overrides */
[data-bs-theme="dark"] .panel-card,
[data-bs-theme="dark"] .table-card,
[data-bs-theme="dark"] .stat-card {
  background: rgba(24, 24, 26, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
