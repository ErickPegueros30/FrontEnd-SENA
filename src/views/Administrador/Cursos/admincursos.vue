<template>
  <div :data-bs-theme="currentTheme" class="admin-cursos-page">
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
              <i class="bi bi-mortarboard"></i> Gestión de Cursos
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-mortarboard-fill me-2"></i>Administración de Cursos
            </h1>
            <p class="page-subtitle">
              Administra y organiza todos los cursos, capacitaciones y programas de formación
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-book"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalCursos }}</span>
                  <span class="stat-label">Total Cursos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-play-circle"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ activeCursos }}</span>
                  <span class="stat-label">Activos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon upcoming">
                  <i class="bi bi-calendar-plus"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ upcomingCursos }}</span>
                  <span class="stat-label">Próximos</span>
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
                  <i class="bi bi-search me-1"></i>Buscar curso
                </label>
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Buscar por título, descripción o instructor..."
                    @input="filterCursos"
                  >
                  <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por nivel -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-bar-chart me-1"></i>Filtrar por nivel
                </label>
                <div class="nivel-filters">
                  <button
                    v-for="nivel in niveles"
                    :key="nivel.value"
                    class="nivel-filter-btn"
                    :class="{ 'active': selectedNivel === nivel.value }"
                    @click="toggleNivelFilter(nivel.value)"
                  >
                    <i :class="nivel.icon"></i>
                    {{ nivel.label }}
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

              <!-- Acciones -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-lightning me-1"></i>Acciones rápidas
                </label>
                <div class="action-buttons">
                  <button class="btn btn-outline-secondary" @click="clearFilters">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                  </button>
                  <button class="btn btn-primary" @click="exportCursos">
                    <i class="bi bi-download me-1"></i>Exportar
                  </button>
                  <button class="btn btn-success" @click="showCreateCursoModal">
                    <i class="bi bi-plus-lg me-1"></i>Nuevo curso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid de Cursos -->
    <main class="main-content">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">
                <i class="bi bi-mortarboard me-2"></i>Cursos del sistema
              </h4>
              <p class="table-subtitle">
                Mostrando {{ filteredCursos.length }} de {{ cursos.length }} cursos
              </p>
            </div>

            <div class="table-actions">
              <div class="pagination-info">
                <span class="text-muted">Cursos por página:</span>
                <select v-model="itemsPerPage" class="form-select form-select-sm ms-2" style="width: auto;">
                  <option :value="8">8</option>
                  <option :value="12">12</option>
                  <option :value="16">16</option>
                  <option :value="20">20</option>
                </select>
              </div>
            </div>
          </div>

          <div class="table-body">
            <div class="row g-4">
              <div
                v-for="curso in paginatedCursos"
                :key="curso.id"
                class="col-xl-3 col-lg-4 col-md-6"
              >
                <div class="curso-card" @click="viewCurso(curso)">
                  <div class="card-image">
                    <template v-if="curso.thumbnailUrl">
                      <img :src="curso.thumbnailUrl" :alt="curso.title" class="curso-thumb">
                    </template>
                    <template v-else>
                      <div class="image-placeholder" :style="{ background: getNivelColor(curso.nivel) }">
                        <i :class="getNivelIcon(curso.nivel)" class="placeholder-icon"></i>
                      </div>
                    </template>

                    <div class="card-badge" :class="getEstadoClass(curso.status)">
                      {{ getEstadoText(curso.status) }}
                    </div>

                    <div v-if="curso.featured" class="featured-badge">
                      <i class="bi bi-star-fill"></i>
                    </div>

                    <div class="duracion-badge">
                      <i class="bi bi-clock"></i>
                      {{ curso.duracion }}
                    </div>
                  </div>

                  <div class="card-body">
                    <h5 class="card-title">{{ curso.title }}</h5>
                    <p class="card-description">{{ truncateDescription(curso.description) }}</p>

                    <div class="card-meta">
                      <div class="meta-item">
                        <i class="bi bi-calendar"></i>
                        <span>{{ formatDate(curso.fechaInicio) }}</span>
                      </div>
                      <div class="meta-item">
                        <i class="bi bi-calendar-check"></i>
                        <span>{{ formatDate(curso.fechaFin) }}</span>
                      </div>
                      <div class="meta-item">
                        <i class="bi" :class="getModalidadIcon(curso.modalidad)"></i>
                        <span>{{ capitalize(curso.modalidad) }}</span>
                      </div>
                    </div>

                    <div class="instructor-info">
                      <template v-if="curso.instructor?.avatar">
                        <div class="avatar-img-wrapper">
                          <img :src="curso.instructor.avatar" alt="Instructor" class="avatar-img" />
                        </div>
                      </template>
                      <template v-else>
                        <div class="avatar-initials" :style="{ background: getInstructorColor(curso.instructor) }">
                          {{ getInitials(curso.instructor?.name) }}
                        </div>
                      </template>
                      <div class="instructor-details">
                        <span class="instructor-name">{{ curso.instructor?.name }}</span>
                        <span class="instructor-role">Instructor</span>
                      </div>
                    </div>

                    <div class="card-stats">
                      <div class="stat">
                        <i class="bi bi-people"></i>
                        <div class="stat-info">
                          <span class="stat-number">{{ curso.estudiantes?.length || 0 }}</span>
                          <span class="stat-label">Inscritos</span>
                        </div>
                      </div>
                      <div class="stat">
                        <i class="bi bi-trophy"></i>
                        <div class="stat-info">
                          <span class="stat-number">{{ curso.aprobados || 0 }}</span>
                          <span class="stat-label">Aprobados</span>
                        </div>
                      </div>
                    </div>

                    <div class="progress-container">
                      <div class="progress-info">
                        <span>Capacidad</span>
                        <span>{{ Math.round(((curso.estudiantes?.length || 0) / curso.capacidad) * 100) || 0 }}%</span>
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar"
                          :class="getProgressClass((curso.estudiantes?.length || 0) / curso.capacidad)"
                          :style="{ width: `${Math.round(((curso.estudiantes?.length || 0) / curso.capacidad) * 100) || 0}%` }"
                        ></div>
                      </div>
                    </div>

                    <div class="nivel-tag" :style="{ background: getNivelColor(curso.nivel) + '20', color: getNivelColor(curso.nivel) }">
                      <i :class="getNivelIcon(curso.nivel)" class="me-1"></i>
                      {{ getNivelText(curso.nivel) }}
                    </div>
                  </div>

                  <div class="card-footer">
                    <div class="footer-actions">
                      <button class="btn btn-sm btn-outline-primary" @click.stop="editCurso(curso)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-info" @click.stop="toggleFeatured(curso)">
                        <i class="bi" :class="curso.featured ? 'bi-star-fill' : 'bi-star'"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click.stop="deleteCurso(curso)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="filteredCursos.length === 0" class="empty-state">
              <div class="empty-content">
                <i class="bi bi-book empty-icon"></i>
                <h5>No se encontraron cursos</h5>
                <p class="text-muted">
                  No hay cursos que coincidan con los filtros aplicados
                </p>
                <button class="btn btn-outline-primary" @click="clearFilters">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
                </button>
              </div>
            </div>

            <!-- Paginación -->
            <div v-if="filteredCursos.length > 0" class="table-footer">
              <div class="pagination-controls">
                <nav aria-label="Paginación de cursos">
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
                    Mostrando {{ startItem }}-{{ endItem }} de {{ filteredCursos.length }} cursos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista de Calendario -->
        <div class="calendar-section mt-4">
          <div class="table-card">
            <div class="table-header">
              <div class="table-info">
                <h4 class="table-title">
                  <i class="bi bi-calendar-week me-2"></i>Calendario de Cursos
                </h4>
                <p class="table-subtitle">
                  {{ calendarTitle }} • {{ cursos.length }} cursos programados
                </p>
              </div>

              <div class="calendar-controls">
                <div class="btn-group me-3">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    :class="{ 'active': calendarView === 'month' }"
                    @click="calendarView = 'month'"
                  >
                    Mes
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    :class="{ 'active': calendarView === 'week' }"
                    @click="calendarView = 'week'"
                  >
                    Semana
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    :class="{ 'active': calendarView === 'day' }"
                    @click="calendarView = 'day'"
                  >
                    Día
                  </button>
                </div>

                <div class="calendar-nav">
                  <button class="btn btn-sm btn-outline-secondary" @click="prevPeriod">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <h6 class="calendar-title mx-3 mb-0">{{ calendarTitle }}</h6>
                  <button class="btn btn-sm btn-outline-secondary" @click="nextPeriod">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>

                <button class="btn btn-sm btn-primary" @click="today">
                  <i class="bi bi-calendar-check me-1"></i>Hoy
                </button>
              </div>
            </div>

            <div class="table-body">
              <!-- Leyenda del calendario -->
              <div class="calendar-legend mb-3">
                <div v-for="nivel in niveles" :key="nivel.value" class="legend-item">
                  <span class="legend-dot" :style="{ background: nivel.color }"></span>
                  <small>{{ nivel.label }}</small>
                </div>
              </div>

              <!-- Grid del calendario -->
              <div class="calendar-grid">
                <div class="calendar-header">
                  <div class="calendar-cell" v-for="day in calendarDays" :key="day">
                    {{ day }}
                  </div>
                </div>

                <div class="calendar-body">
                  <div
                    v-for="week in calendarWeeks"
                    :key="week.number"
                    class="calendar-week"
                  >
                    <div
                      v-for="day in week.days"
                      :key="day.date"
                      class="calendar-day"
                      :class="{
                        'today': day.isToday,
                        'selected': day.isSelected,
                        'other-month': !day.isCurrentMonth
                      }"
                      @click="selectDay(day)"
                    >
                      <div class="day-header">
                        <span class="day-number">{{ day.day }}</span>
                      </div>
                      <div class="day-events">
                        <div
                          v-for="curso in day.cursos"
                          :key="curso.id"
                          class="calendar-event"
                          :class="`nivel-${curso.nivel}`"
                          @click.stop="viewCurso(curso)"
                        >
                          <div class="event-chip">
                            <span class="event-dot" :style="{ background: getNivelColor(curso.nivel) }"></span>
                            <div class="event-body">
                              <div class="event-time">{{ curso.horaInicio || 'Todo el día' }}</div>
                              <div class="event-title">{{ truncateTitle(curso.title) }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación (idéntico al de usuarios) -->
    <div v-if="cursoToDelete" class="modal-backdrop show" @click="cancelDelete"></div>
    <div v-if="cursoToDelete" class="modal show d-block" tabindex="-1">
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

            <div class="curso-preview">
              <div class="preview-icon" :style="{ background: getNivelColor(cursoToDelete.nivel) }">
                <i :class="getNivelIcon(cursoToDelete.nivel)"></i>
              </div>
              <div class="preview-info">
                <h6>{{ cursoToDelete.title }}</h6>
                <p class="text-muted mb-1">{{ formatDate(cursoToDelete.fechaInicio) }} - {{ formatDate(cursoToDelete.fechaFin) }}</p>
                <p class="mb-0">
                  <span class="badge" :class="getEstadoClass(cursoToDelete.status)">
                    {{ getEstadoText(cursoToDelete.status) }}
                  </span>
                  <span class="ms-2">{{ cursoToDelete.estudiantes?.length || 0 }} inscritos</span>
                </p>
              </div>
            </div>

            <p class="mt-3">
              ¿Estás seguro de que deseas eliminar permanentemente este curso?
              Se perderán todos los datos asociados, incluyendo las inscripciones y calificaciones.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              <i class="bi bi-trash me-1"></i>Sí, eliminar curso
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalle de Curso (CORREGIDO con mismo estilo que usuarios) -->
    <div v-if="showDetailModal" class="modal-backdrop show" @click="closeDetailModal"></div>
    <div v-if="showDetailModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i :class="getNivelIcon(selectedCurso?.nivel)" class="me-2"></i>
              Detalle del Curso
            </h5>
            <button type="button" class="btn-close" @click="closeDetailModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-4">
              <div class="col-md-5">
                <div class="detail-image">
                  <div v-if="selectedCurso?.thumbnailUrl" class="detail-thumb">
                    <img :src="selectedCurso.thumbnailUrl" :alt="selectedCurso.title" class="img-fluid rounded-3">
                  </div>
                  <div v-else class="detail-placeholder" :style="{ background: getNivelColor(selectedCurso?.nivel) }">
                    <i :class="getNivelIcon(selectedCurso?.nivel)" class="placeholder-icon-large"></i>
                  </div>
                </div>

                <div class="detail-badges mt-3">
                  <span class="badge-detail" :class="getEstadoClass(selectedCurso?.status)">
                    <i :class="getEstadoIcon(selectedCurso?.status)" class="me-1"></i>
                    {{ getEstadoText(selectedCurso?.status) }}
                  </span>
                  <span v-if="selectedCurso?.featured" class="badge-detail bg-warning text-dark">
                    <i class="bi bi-star-fill me-1"></i>Destacado
                  </span>
                </div>
              </div>

              <div class="col-md-7">
                <h4 class="detail-title">{{ selectedCurso?.title }}</h4>
                <p class="detail-description">{{ selectedCurso?.description }}</p>

                <div class="detail-info-grid">
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-calendar"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Fecha de inicio</span>
                      <span class="info-value">{{ formatDate(selectedCurso?.fechaInicio) }}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-calendar-check"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Fecha de fin</span>
                      <span class="info-value">{{ formatDate(selectedCurso?.fechaFin) }}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-clock"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Horario</span>
                      <span class="info-value">{{ selectedCurso?.horaInicio || '09:00' }} - {{ selectedCurso?.horaFin || '13:00' }}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-geo-alt"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Modalidad</span>
                      <span class="info-value">{{ capitalize(selectedCurso?.modalidad) }}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-person-badge"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Nivel</span>
                      <span class="info-value">{{ getNivelText(selectedCurso?.nivel) }}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <i class="bi bi-people"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Capacidad</span>
                      <span class="info-value">{{ selectedCurso?.capacidad }} personas</span>
                    </div>
                  </div>
                </div>

                <div class="instructor-detail mt-4">
                  <h6 class="detail-subtitle">Instructor</h6>
                  <div class="instructor-card">
                      <template v-if="selectedCurso?.instructor?.avatar">
                        <div class="avatar-img-wrapper-large">
                          <img :src="selectedCurso.instructor.avatar" alt="Instructor" class="avatar-img-large" />
                        </div>
                      </template>
                      <template v-else>
                        <div class="avatar-initials-large" :style="{ background: getInstructorColor(selectedCurso?.instructor) }">
                          {{ getInitials(selectedCurso?.instructor?.name) }}
                        </div>
                      </template>
                    <div class="instructor-card-info">
                      <span class="instructor-card-name">{{ selectedCurso?.instructor?.name }}</span>
                      <span class="instructor-card-email">{{ selectedCurso?.instructor?.email }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedCurso?.temario?.length" class="temario-section mt-4">
                  <h6 class="detail-subtitle">Temario</h6>
                  <ul class="temario-list">
                    <li v-for="(item, index) in selectedCurso.temario" :key="index">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <div class="stats-detail mt-4">
                  <div class="stat-detail-card">
                    <div class="stat-detail-number">{{ selectedCurso?.estudiantes?.length || 0 }}</div>
                    <div class="stat-detail-label">Inscritos</div>
                  </div>
                  <div class="stat-detail-card">
                    <div class="stat-detail-number">{{ selectedCurso?.aprobados || 0 }}</div>
                    <div class="stat-detail-label">Aprobados</div>
                  </div>
                  <div class="stat-detail-card">
                    <div class="stat-detail-number">{{ selectedCurso?.capacidad - (selectedCurso?.estudiantes?.length || 0) }}</div>
                    <div class="stat-detail-label">Disponibles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="closeDetailModal">
              <i class="bi bi-x-lg me-1"></i>Cerrar
            </button>
            <button type="button" class="btn btn-primary" @click="openEditFromDetail">
              <i class="bi bi-pencil me-1"></i>Editar curso
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Curso (Crear/Editar) -->
    <CursoModal
      v-if="showCursoModal"
      :curso="selectedCurso"
      :mode="modalMode"
      @save="handleSaveCurso"
      @close="closeCursoModal"
    />

    <!-- Toast para notificaciones (idéntico al de usuarios) -->
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
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Toast } from 'bootstrap'
import CursoModal from '@/views/Administrador/Cursos/CursoModal.vue'

// Tipos (igual que antes)
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'
type CalendarView = 'month' | 'week' | 'day'
type CursoStatus = 'activo' | 'proximo' | 'finalizado' | 'cancelado'
type CursoNivel = 'basico' | 'intermedio' | 'avanzado' | 'especializacion'
type Modalidad = 'presencial' | 'virtual' | 'hibrido'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

interface Curso {
  id: number
  title: string
  description: string
  nivel: CursoNivel
  nivelLabel: string
  fechaInicio: string
  fechaFin: string
  horaInicio?: string
  horaFin?: string
  duracion: string
  status: CursoStatus
  statusLabel: string
  modalidad: Modalidad
  instructor: User
  estudiantes: User[]
  capacidad: number
  aprobados?: number
  featured?: boolean
  thumbnailUrl?: string
  temario?: string[]
  requisitos?: string[]
  createdAt: string
  updatedAt: string
}

interface Nivel {
  value: CursoNivel
  label: string
  icon: string
  color: string
}

interface Estado {
  value: CursoStatus
  label: string
  icon: string
  color: string
}

interface CalendarDay {
  date: string
  day: number
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
  cursos: Curso[]
}

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// API base
import { API_BASE } from '@/config/api'

// Datos de ejemplo (igual que antes)
const cursos = ref<Curso[]>([
  {
    id: 1,
    title: 'Introducción a la Seguridad en Laboratorios',
    description: 'Curso fundamental sobre normas de seguridad, manejo de sustancias y equipos de protección personal',
    nivel: 'basico',
    nivelLabel: 'Básico',
    fechaInicio: '2024-03-15',
    fechaFin: '2024-04-15',
    horaInicio: '09:00',
    horaFin: '13:00',
    duracion: '40 horas',
    status: 'activo',
    statusLabel: 'Activo',
    modalidad: 'presencial',
    instructor: {
      id: 1,
      name: 'Ana Pérez',
      email: 'ana.perez@sena.com',
      role: 'Instructora'
    },
    estudiantes: Array(18).fill(null).map((_, i) => ({
      id: i + 100,
      name: `Estudiante ${i + 1}`,
      email: `estudiante${i + 1}@email.com`,
      role: 'Estudiante'
    })),
    capacidad: 25,
    aprobados: 0,
    featured: true,
    temario: ['Módulo 1: Normas básicas', 'Módulo 2: EPP', 'Módulo 3: Manejo de sustancias'],
    requisitos: ['Conocimientos básicos de química'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Análisis de Aguas Residuales Avanzado',
    description: 'Técnicas especializadas para el análisis de parámetros físico-químicos y microbiológicos',
    nivel: 'avanzado',
    nivelLabel: 'Avanzado',
    fechaInicio: '2024-03-20',
    fechaFin: '2024-04-20',
    horaInicio: '14:00',
    horaFin: '18:00',
    duracion: '60 horas',
    status: 'activo',
    statusLabel: 'Activo',
    modalidad: 'hibrido',
    instructor: {
      id: 2,
      name: 'Carlos Gómez',
      email: 'carlos.gomez@sena.com',
      role: 'Instructor'
    },
    estudiantes: Array(12).fill(null).map((_, i) => ({
      id: i + 200,
      name: `Estudiante ${i + 1}`,
      email: `estudiante${i + 1}@email.com`,
      role: 'Estudiante'
    })),
    capacidad: 20,
    aprobados: 0,
    featured: false,
    temario: ['Módulo 1: Parámetros físico-químicos', 'Módulo 2: Análisis microbiológico'],
    requisitos: ['Curso básico de análisis de aguas'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 3,
    title: 'Cromatografía de Gases: Fundamentos y Aplicaciones',
    description: 'Curso teórico-práctico sobre cromatografía de gases y sus aplicaciones en laboratorio',
    nivel: 'intermedio',
    nivelLabel: 'Intermedio',
    fechaInicio: '2024-04-05',
    fechaFin: '2024-05-05',
    horaInicio: '09:00',
    horaFin: '12:00',
    duracion: '45 horas',
    status: 'proximo',
    statusLabel: 'Próximo',
    modalidad: 'presencial',
    instructor: {
      id: 3,
      name: 'María González',
      email: 'maria.gonzalez@sena.com',
      role: 'Instructora'
    },
    estudiantes: Array(8).fill(null).map((_, i) => ({
      id: i + 300,
      name: `Estudiante ${i + 1}`,
      email: `estudiante${i + 1}@email.com`,
      role: 'Estudiante'
    })),
    capacidad: 15,
    aprobados: 0,
    featured: true,
    temario: ['Módulo 1: Principios básicos', 'Módulo 2: Componentes del equipo', 'Módulo 3: Aplicaciones'],
    requisitos: ['Conocimientos de química analítica'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: 4,
    title: 'Buenas Prácticas de Laboratorio (BPL)',
    description: 'Curso sobre implementación de BPL según normas internacionales ISO/IEC 17025',
    nivel: 'basico',
    nivelLabel: 'Básico',
    fechaInicio: '2024-02-01',
    fechaFin: '2024-03-01',
    horaInicio: '10:00',
    horaFin: '12:00',
    duracion: '30 horas',
    status: 'finalizado',
    statusLabel: 'Finalizado',
    modalidad: 'virtual',
    instructor: {
      id: 1,
      name: 'Ana Pérez',
      email: 'ana.perez@sena.com',
      role: 'Instructora'
    },
    estudiantes: Array(22).fill(null).map((_, i) => ({
      id: i + 400,
      name: `Estudiante ${i + 1}`,
      email: `estudiante${i + 1}@email.com`,
      role: 'Estudiante'
    })),
    capacidad: 30,
    aprobados: 18,
    featured: false,
    temario: ['Módulo 1: Introducción a BPL', 'Módulo 2: Documentación', 'Módulo 3: Auditorías'],
    requisitos: [],
    createdAt: '2024-01-10',
    updatedAt: '2024-03-02'
  },
  {
    id: 5,
    title: 'Espectrometría de Masas Aplicada',
    description: 'Curso especializado en técnicas de espectrometría de masas para análisis de compuestos',
    nivel: 'especializacion',
    nivelLabel: 'Especialización',
    fechaInicio: '2024-05-10',
    fechaFin: '2024-06-20',
    horaInicio: '15:00',
    horaFin: '19:00',
    duracion: '80 horas',
    status: 'proximo',
    statusLabel: 'Próximo',
    modalidad: 'hibrido',
    instructor: {
      id: 4,
      name: 'Roberto Sánchez',
      email: 'roberto.sanchez@sena.com',
      role: 'Instructor'
    },
    estudiantes: Array(5).fill(null).map((_, i) => ({
      id: i + 500,
      name: `Estudiante ${i + 1}`,
      email: `estudiante${i + 1}@email.com`,
      role: 'Estudiante'
    })),
    capacidad: 10,
    aprobados: 0,
    featured: true,
    temario: ['Módulo 1: Fundamentos', 'Módulo 2: Técnicas de ionización', 'Módulo 3: Análisis de datos'],
    requisitos: ['Curso de cromatografía', 'Química orgánica avanzada'],
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15'
  },
  {
    id: 6,
    title: 'Calibración de Equipos de Medición',
    description: 'Curso práctico sobre calibración y verificación de equipos de laboratorio',
    nivel: 'intermedio',
    nivelLabel: 'Intermedio',
    fechaInicio: '2024-04-15',
    fechaFin: '2024-05-15',
    horaInicio: '08:00',
    horaFin: '12:00',
    duracion: '50 horas',
    status: 'proximo',
    statusLabel: 'Próximo',
    modalidad: 'presencial',
    instructor: {
      id: 5,
      name: 'Lucía Martínez',
      email: 'lucia.martinez@sena.com',
      role: 'Instructora'
    },
    estudiantes: Array(10).fill(null).map((_, i) => ({
      id: i + 600,
      name: `Estudiante ${i + 1}`,
      email: `estudiante${i + 1}@email.com`,
      role: 'Estudiante'
    })),
    capacidad: 12,
    aprobados: 0,
    featured: false,
    temario: ['Módulo 1: Metrología básica', 'Módulo 2: Procedimientos de calibración', 'Módulo 3: Certificación'],
    requisitos: ['Conocimientos de física básica'],
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20'
  }
])

// Niveles y estados disponibles
const niveles: Nivel[] = [
  { value: 'basico', label: 'Básico', icon: 'bi bi-arrow-up-right-circle', color: '#4CAF50' },
  { value: 'intermedio', label: 'Intermedio', icon: 'bi bi-arrow-up-right-circle-fill', color: '#2196F3' },
  { value: 'avanzado', label: 'Avanzado', icon: 'bi bi-graph-up', color: '#FF9800' },
  { value: 'especializacion', label: 'Especialización', icon: 'bi bi-award', color: '#9C27B0' }
]

const estados: Estado[] = [
  { value: 'activo', label: 'Activo', icon: 'bi bi-play-circle', color: 'success' },
  { value: 'proximo', label: 'Próximo', icon: 'bi bi-clock', color: 'warning' },
  { value: 'finalizado', label: 'Finalizado', icon: 'bi bi-check-circle', color: 'info' },
  { value: 'cancelado', label: 'Cancelado', icon: 'bi bi-x-circle', color: 'danger' }
]

// Filtros
const searchQuery = ref('')
const selectedNivel = ref<CursoNivel | null>(null)
const selectedEstado = ref<CursoStatus | null>(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Estado para modales
const showCursoModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const selectedCurso = ref<Curso | null>(null)
const cursoToDelete = ref<Curso | null>(null)
const showDetailModal = ref(false)

// Estado del calendario
const calendarView = ref<CalendarView>('month')
const currentDate = ref(new Date())

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed (igual que antes)
const totalCursos = computed(() => cursos.value.length)
const activeCursos = computed(() => cursos.value.filter(c => c.status === 'activo').length)
const upcomingCursos = computed(() => cursos.value.filter(c => c.status === 'proximo').length)

const filteredCursos = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return cursos.value.filter(curso => {
    const instructorName = (curso.instructor && curso.instructor.name) ? String(curso.instructor.name).toLowerCase() : ''
    const matchesSearch = !query ||
      (curso.title && String(curso.title).toLowerCase().includes(query)) ||
      (curso.description && String(curso.description).toLowerCase().includes(query)) ||
      instructorName.includes(query)

    const matchesNivel = !selectedNivel.value || curso.nivel === selectedNivel.value
    const matchesEstado = !selectedEstado.value || curso.status === selectedEstado.value

    return matchesSearch && matchesNivel && matchesEstado
  }).sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCursos.value.length / itemsPerPage.value))
)

const paginatedCursos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCursos.value.slice(start, end)
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
  Math.min(currentPage.value * itemsPerPage.value, filteredCursos.value.length)
)

// Calendario
const calendarDays = computed(() => {
  return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
})

const calendarTitle = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }
  return currentDate.value.toLocaleDateString('es-ES', options)
})

const calendarWeeks = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const weeks: { number: number; days: CalendarDay[] }[] = []
  let currentWeek: CalendarDay[] = []
  let weekNumber = 1

  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

  for (let i = startOffset; i > 0; i--) {
    const date = new Date(year, month, -i + 1)
    currentWeek.push(createCalendarDay(date, false))
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    currentWeek.push(createCalendarDay(date, true))

    if (currentWeek.length === 7) {
      weeks.push({ number: weekNumber++, days: currentWeek })
      currentWeek = []
    }
  }

  const nextMonthDays = 7 - currentWeek.length
  for (let day = 1; day <= nextMonthDays; day++) {
    const date = new Date(year, month + 1, day)
    currentWeek.push(createCalendarDay(date, false))
  }

  if (currentWeek.length > 0) {
    weeks.push({ number: weekNumber, days: currentWeek })
  }

  return weeks
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

const toastBodyIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle-fill text-success',
    'info': 'bi bi-info-circle-fill text-info',
    'warning': 'bi bi-exclamation-triangle-fill text-warning',
    'error': 'bi bi-x-circle-fill text-danger'
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill text-info'
})

// Métodos de utilidad
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const truncateDescription = (desc: string, maxLength: number = 80): string => {
  if (desc.length <= maxLength) return desc
  return desc.substring(0, maxLength) + '...'
}

const truncateTitle = (title: string, maxLength: number = 20): string => {
  if (title.length <= maxLength) return title
  return title.substring(0, maxLength) + '...'
}

const capitalize = (str?: string | null): string => {
  if (!str) return ''
  const s = String(str)
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

const getInitials = (name?: string): string => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(part => part[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const getNivelColor = (nivel?: CursoNivel): string => {
  if (!nivel) return '#1E9E4A'
  const colorMap: Record<CursoNivel, string> = {
    'basico': '#4CAF50',
    'intermedio': '#2196F3',
    'avanzado': '#FF9800',
    'especializacion': '#9C27B0'
  }
  return colorMap[nivel] || '#1E9E4A'
}

const getNivelIcon = (nivel?: CursoNivel): string => {
  if (!nivel) return 'bi bi-mortarboard'
  const iconMap: Record<CursoNivel, string> = {
    'basico': 'bi bi-arrow-up-right-circle',
    'intermedio': 'bi bi-arrow-up-right-circle-fill',
    'avanzado': 'bi bi-graph-up',
    'especializacion': 'bi bi-award'
  }
  return iconMap[nivel] || 'bi bi-mortarboard'
}

const getNivelText = (nivel?: CursoNivel): string => {
  if (!nivel) return ''
  const textMap: Record<CursoNivel, string> = {
    'basico': 'Básico',
    'intermedio': 'Intermedio',
    'avanzado': 'Avanzado',
    'especializacion': 'Especialización'
  }
  return textMap[nivel] || nivel
}

const getModalidadIcon = (modalidad?: Modalidad): string => {
  if (!modalidad) return 'bi bi-question-circle'
  const iconMap: Record<Modalidad, string> = {
    'presencial': 'bi bi-geo-alt',
    'virtual': 'bi bi-laptop',
    'hibrido': 'bi bi-laptop-fill'
  }
  return iconMap[modalidad] || 'bi bi-question-circle'
}

const getEstadoClass = (status?: CursoStatus): string => {
  if (!status) return ''
  const classMap: Record<CursoStatus, string> = {
    'activo': 'estado-activo',
    'proximo': 'estado-proximo',
    'finalizado': 'estado-finalizado',
    'cancelado': 'estado-cancelado'
  }
  return classMap[status] || ''
}

const getEstadoText = (status?: CursoStatus): string => {
  if (!status) return ''
  const textMap: Record<CursoStatus, string> = {
    'activo': 'Activo',
    'proximo': 'Próximo',
    'finalizado': 'Finalizado',
    'cancelado': 'Cancelado'
  }
  return textMap[status] || status
}

const getEstadoIcon = (status?: CursoStatus): string => {
  if (!status) return 'bi bi-question-circle'
  const iconMap: Record<CursoStatus, string> = {
    'activo': 'bi bi-play-circle',
    'proximo': 'bi bi-clock',
    'finalizado': 'bi bi-check-circle',
    'cancelado': 'bi bi-x-circle'
  }
  return iconMap[status] || 'bi bi-question-circle'
}

const getProgressClass = (ratio: number): string => {
  if (ratio >= 0.9) return 'bg-danger'
  if (ratio >= 0.7) return 'bg-warning'
  return 'bg-success'
}

const getInstructorColor = (instructor?: User | null): string => {
  if (!instructor || !instructor.name) return '#607D8B'
  const colors = ['#1E9E4A', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#607D8B']
  let hash = 0
  for (let i = 0; i < instructor.name.length; i++) {
    hash = instructor.name.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0
  }
  return colors[Math.abs(hash) % colors.length]
}

const isDateInRange = (start: string, end: string, dateIso: string): boolean => {
  if (!start || !end) return false
  const startDate = new Date(start)
  const endDate = new Date(end)
  const checkDate = new Date(dateIso)
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || isNaN(checkDate.getTime())) return false
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate >= startDate && checkDate <= endDate
}

const createCalendarDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const iso = date.toISOString().split('T')[0]

  return {
    date: iso,
    day: date.getDate(),
    isToday,
    isSelected: false,
    isCurrentMonth,
    cursos: cursos.value.filter(curso => isDateInRange(curso.fechaInicio, curso.fechaFin, iso))
  }
}

// Métodos de filtrado
const filterCursos = () => {
  currentPage.value = 1
}

const toggleNivelFilter = (nivel: CursoNivel) => {
  selectedNivel.value = selectedNivel.value === nivel ? null : nivel
  currentPage.value = 1
}

const toggleEstadoFilter = (estado: CursoStatus) => {
  selectedEstado.value = selectedEstado.value === estado ? null : estado
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedNivel.value = null
  selectedEstado.value = null
  currentPage.value = 1
}

// Paginación
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Métodos de cursos
const viewCurso = (curso: Curso) => {
  selectedCurso.value = { ...curso }
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedCurso.value = null
}

const openEditFromDetail = () => {
  if (!selectedCurso.value) return
  modalMode.value = 'edit'
  selectedCurso.value = { ...selectedCurso.value }
  showCursoModal.value = true
  showDetailModal.value = false
}

const showCreateCursoModal = () => {
  selectedCurso.value = null
  modalMode.value = 'create'
  showCursoModal.value = true
}

const editCurso = (curso: Curso) => {
  selectedCurso.value = { ...curso }
  modalMode.value = 'edit'
  showCursoModal.value = true
}

const closeCursoModal = () => {
  showCursoModal.value = false
  selectedCurso.value = null
}

const handleSaveCurso = async (cursoData: any) => {
  try {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    // Mapir campos del formulario al payload esperado por el backend
    const payload: any = {
      title: cursoData.title,
      description: cursoData.description,
      modalidad: cursoData.modality || cursoData.modalidad,
      tipo: cursoData.nivel,
      inicio_fecha: cursoData.startDate,
      fin_fecha: cursoData.endDate,
      max_participants: cursoData.capacidad,
      featured: !!cursoData.featured,
      thumbnailDataUrl: cursoData.thumbnailDataUrl,
      temario: cursoData.temario || [],
      instructorId: cursoData.instructorId || cursoData.organizador_id,
      organizador_id: cursoData.instructorId || cursoData.organizador_id
    }

    let saved: any = null
    if (modalMode.value === 'create') {
      const res = await fetch(`${API_BASE}/cursos`, { method: 'POST', headers, body: JSON.stringify(payload) })
      if (res.ok) saved = await res.json()
    } else {
      const id = cursoData.id
      const res = await fetch(`${API_BASE}/cursos/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
      if (res.ok) saved = await res.json()
    }

    if (saved) {
      // Actualizar lista reactiva
      // Preferir recargar desde el servidor para mantener sincronía completa
      try {
        await loadCursos()
        // al crear, llevar a la primera página para que el nuevo curso sea visible
        if (modalMode.value === 'create') currentPage.value = 1
      } catch (e) {
        // Fallback: actualizar localmente si loadCursos falla
        if (modalMode.value === 'create') cursos.value.unshift(saved)
        else {
          const idx = cursos.value.findIndex(c => c.id === saved.id)
          if (idx >= 0) cursos.value.splice(idx, 1, saved)
        }
      }
      showToast('Curso guardado exitosamente', 'success', 'Éxito')
    } else {
      // Fallback local
      if (modalMode.value === 'create') {
        const fakeId = Math.max(0, ...cursos.value.map(c => c.id || 0)) + 1
        cursos.value.unshift({ ...cursoData, id: fakeId })
      } else {
        const idx = cursos.value.findIndex(c => c.id === cursoData.id)
        if (idx >= 0) cursos.value.splice(idx, 1, { ...cursos.value[idx], ...cursoData })
      }
      showToast('Curso guardado (offline)', 'info', 'Información')
    }

    closeCursoModal()
  } catch (err) {
    console.error('save curso error', err)
    showToast('Error al guardar curso', 'error', 'Error')
  }
}

const deleteCurso = (curso: Curso) => {
  cursoToDelete.value = curso
}

const cancelDelete = () => {
  cursoToDelete.value = null
}

const confirmDelete = () => {
  if (!cursoToDelete.value) return
  cursos.value = cursos.value.filter(c => c.id !== cursoToDelete.value!.id)
  showToast('Curso eliminado exitosamente', 'success', 'Eliminación')
  cursoToDelete.value = null
}

const toggleFeatured = async (curso: Curso) => {
  curso.featured = !curso.featured
  showToast(curso.featured ? 'Curso destacado' : 'Curso no destacado', 'success', 'Actualización')
}

const exportCursos = () => {
  const headers = ['ID', 'Título', 'Nivel', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Modalidad', 'Instructor', 'Inscritos', 'Capacidad', 'Aprobados']

  const csvData = filteredCursos.value.map(curso => [
    curso.id,
    curso.title,
    getNivelText(curso.nivel),
    formatDate(curso.fechaInicio),
    formatDate(curso.fechaFin),
    getEstadoText(curso.status),
    capitalize(curso.modalidad),
    curso.instructor.name,
    curso.estudiantes?.length || 0,
    curso.capacidad,
    curso.aprobados || 0
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cursos-sena-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Archivo CSV generado y descargado', 'success', 'Exportación')
}

// Métodos de calendario
const prevPeriod = () => {
  if (calendarView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  }
}

const nextPeriod = () => {
  if (calendarView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  }
}

const today = () => {
  currentDate.value = new Date()
}

const selectDay = (day: CalendarDay) => {
  console.log('Día seleccionado:', day.date)
}

// Toast
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

const loadCursos = async () => {
  try {
    const res = await fetch(`${API_BASE}/cursos`)
    if (!res.ok) {
      console.warn('No se pudieron cargar los cursos desde el backend')
      return
    }
    const data = await res.json()
    if (Array.isArray(data)) cursos.value = data
  } catch (err) {
    console.error('loadCursos error', err)
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadCursos()
})
</script>

<style scoped>
/* ESTILOS IDÉNTICOS A USUARIOS - SOLO CAMBIOS DE COLORES */

.admin-cursos-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-cursos-page {
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

.stat-icon.upcoming {
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

.nivel-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nivel-filter-btn {
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

[data-bs-theme="dark"] .nivel-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray, #6C757D);
}

.nivel-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.nivel-filter-btn.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

.status-filters {
  display: flex;
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
  flex: 1;
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

.table-body {
  padding: 2rem;
}

/* Curso Cards */
.curso-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

[data-bs-theme="dark"] .curso-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.curso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary, #1E9E4A);
}

.card-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.curso-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 3rem;
  color: white;
  opacity: 0.8;
}

.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.duracion-badge {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.estado-activo {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
}

.estado-proximo {
  background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
  color: #333;
}

.estado-finalizado {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.estado-cancelado {
  background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
  color: white;
}

.featured-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

[data-bs-theme="dark"] .card-title {
  color: var(--color-dark, #F8F9FA);
}

.card-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.meta-item i {
  width: 16px;
  text-align: center;
  color: var(--color-primary, #1E9E4A);
}

.instructor-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.avatar-initials {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.avatar-img-wrapper { display: inline-flex; }

.instructor-details {
  display: flex;
  flex-direction: column;
}

.instructor-name {
  font-weight: 600;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .instructor-name {
  color: var(--color-dark, #F8F9FA);
}

.instructor-role {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

.card-stats {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 8px;
}

[data-bs-theme="dark"] .card-stats {
  background: var(--lab-bg, #1a1a1a);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat i {
  font-size: 1.25rem;
  color: var(--color-primary, #1E9E4A);
  margin-bottom: 0.25rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-weight: 700;
  color: var(--color-dark, #212529);
  font-size: 1rem;
  line-height: 1;
}

[data-bs-theme="dark"] .stat-number {
  color: var(--color-dark, #F8F9FA);
}

.stat-label {
  font-size: 0.65rem;
  color: var(--color-gray, #6C757D);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.progress-container {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

.progress {
  height: 6px;
  background: var(--color-gray-light, #E9ECEF);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.bg-success {
  background: var(--color-success, #28a745);
}

.bg-warning {
  background: var(--color-warning, #ffc107);
}

.bg-danger {
  background: var(--color-danger, #dc3545);
}

.nivel-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .card-footer {
  background: var(--lab-bg, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.footer-actions .btn {
  padding: 0.45rem 0.6rem;
  font-size: 0.92rem;
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
  margin-top: 2rem;
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

/* Calendario (nuevos estilos) */
.calendar-section {
  margin-top: 2rem;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.calendar-nav {
  display: flex;
  align-items: center;
}

.calendar-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
}

[data-bs-theme="dark"] .calendar-title {
  color: var(--color-dark, #F8F9FA);
}

.calendar-legend {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--lab-bg, #f8f9fa);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .calendar-header {
  background: var(--lab-bg, #1a1a1a);
}

.calendar-cell {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  border-right: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .calendar-cell {
  color: var(--color-gray-dark, #ADB5BD);
}

.calendar-cell:last-child {
  border-right: none;
}

.calendar-body {
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .calendar-body {
  background: var(--card-bg, #2d2d2d);
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.calendar-week:last-child {
  border-bottom: none;
}

.calendar-day {
  min-height: 120px;
  padding: 0.75rem;
  border-right: 1px solid var(--color-gray-light, #E9ECEF);
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

.calendar-day.today {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.1) 0%, rgba(52, 181, 101, 0.05) 100%);
}

.calendar-day.selected {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.2) 0%, rgba(52, 181, 101, 0.1) 100%);
  border: 2px solid var(--color-primary, #1E9E4A);
}

.calendar-day.other-month {
  background: var(--color-lighter, #f8f9fa);
  color: var(--color-gray, #6C757D);
}

[data-bs-theme="dark"] .calendar-day.other-month {
  background: var(--color-lighter, #2d2d2d);
}

.calendar-day:last-child {
  border-right: none;
}

.day-header {
  margin-bottom: 0.5rem;
}

.day-number {
  font-weight: 600;
  color: var(--color-dark, #212529);
  font-size: 1rem;
}

[data-bs-theme="dark"] .day-number {
  color: var(--color-dark, #F8F9FA);
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.calendar-event {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--color-primary, #1E9E4A);
}

.calendar-event:hover {
  transform: translateX(2px);
}

.calendar-event.nivel-basico {
  background: #4CAF50;
}

.calendar-event.nivel-intermedio {
  background: #2196F3;
}

.calendar-event.nivel-avanzado {
  background: #FF9800;
}

.calendar-event.nivel-especializacion {
  background: #9C27B0;
}

.event-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  opacity: 0.8;
}

.event-body {
  overflow: hidden;
}

.event-time {
  font-size: 0.65rem;
  opacity: 0.9;
}

.event-title {
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

/* MODAL DETALLE CORREGIDO (estilo usuarios) */
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
  border-radius: 16px;
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

/* Elementos del modal detalle */
.detail-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.detail-thumb img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.detail-placeholder {
  width: 100%;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon-large {
  font-size: 5rem;
  color: white;
  opacity: 0.8;
}

.detail-badges {
  display: flex;
  gap: 0.75rem;
}

.badge-detail {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-detail.estado-activo {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
}

.badge-detail.estado-proximo {
  background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
  color: #333;
}

.badge-detail.estado-finalizado {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.badge-detail.estado-cancelado {
  background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
  color: white;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .detail-title {
  color: var(--color-dark, #F8F9FA);
}

.detail-description {
  color: var(--color-gray, #6C757D);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: var(--lab-bg, #f8f9fa);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
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

.detail-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .detail-subtitle {
  color: var(--color-dark, #F8F9FA);
}

.instructor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 12px;
}

[data-bs-theme="dark"] .instructor-card {
  background: var(--lab-bg, #1a1a1a);
}

.avatar-initials-large {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.avatar-img-large {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}
.avatar-img-wrapper-large { display: inline-flex; }

.instructor-card-info {
  display: flex;
  flex-direction: column;
}

.instructor-card-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .instructor-card-name {
  color: var(--color-dark, #F8F9FA);
}

.instructor-card-email {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.temario-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.temario-list li {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .temario-list li {
  color: var(--color-dark, #F8F9FA);
}

.stats-detail {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
}

.stat-detail-card {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border: 1px solid rgba(30, 158, 74, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

[data-bs-theme="dark"] .stat-detail-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.stat-detail-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-detail-label {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

/* Modal preview (delete) */
.curso-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 12px;
  margin: 1rem 0;
}

[data-bs-theme="dark"] .curso-preview {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.preview-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
}

.preview-info h6 {
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .preview-info h6 {
  color: var(--color-dark, #F8F9FA);
}

/* Toast */
.toast-container {
  z-index: 1060;
}

.toast {
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(12, 18, 30, 0.08);
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

  .calendar-controls {
    width: 100%;
    justify-content: center;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .detail-info-grid {
    grid-template-columns: 1fr;
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

  .nivel-filters,
  .status-filters {
    flex-wrap: wrap;
  }

  .calendar-grid {
    font-size: 0.9rem;
  }

  .calendar-day {
    min-height: 80px;
    padding: 0.5rem;
  }

  .calendar-event {
    font-size: 0.7rem;
    padding: 0.15rem 0.3rem;
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
  .table-body,
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

  .calendar-header {
    display: none;
  }

  .calendar-week {
    grid-template-columns: 1fr;
    border-bottom: none;
  }

  .calendar-day {
    border-right: none;
    border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  }

  .calendar-day:last-child {
    border-bottom: none;
  }

  .modal-body {
    padding: 1rem;
  }

  .detail-info-grid {
    padding: 1rem;
  }

  .stats-detail {
    grid-template-columns: 1fr;
  }
}

/* Animaciones */
.stat-card,
.panel-card,
.table-card,
.curso-card {
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
[data-bs-theme="dark"] .curso-card,
[data-bs-theme="dark"] .stat-card {
  background: rgba(24, 24, 26, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
