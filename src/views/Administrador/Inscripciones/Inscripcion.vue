<template>
  <div :data-bs-theme="currentTheme" class="admin-inscripciones-page">
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
              <i class="bi bi-person-vcard"></i> Gestión de Inscripciones
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-person-vcard-fill me-2"></i>Administración de Inscripciones
            </h1>
            <p class="page-subtitle">
              Gestiona inscripciones a cursos y eventos, asiste participantes y genera constancias
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-people"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalInscripciones }}</span>
                  <span class="stat-label">Inscripciones</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-mortarboard"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ cursos.length }}</span>
                  <span class="stat-label">Cursos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon admin">
                  <i class="bi bi-calendar-event"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ eventos.length }}</span>
                  <span class="stat-label">Eventos</span>
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
              <i class="bi bi-funnel me-2"></i>Filtros y Navegación
            </h3>
          </div>

          <div class="panel-body">
            <div class="filters-grid">
              <!-- Pestañas de navegación -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-tags me-1"></i>Tipo
                </label>
                <div class="type-filters">
                  <button
                    class="type-filter-btn"
                    :class="{ 'active': tipoActivo === 'cursos' }"
                    @click="tipoActivo = 'cursos'"
                  >
                    <i class="bi bi-mortarboard me-2"></i>Cursos
                  </button>
                  <button
                    class="type-filter-btn"
                    :class="{ 'active': tipoActivo === 'eventos' }"
                    @click="tipoActivo = 'eventos'"
                  >
                    <i class="bi bi-calendar-event me-2"></i>Eventos
                  </button>
                </div>
              </div>

              <!-- Búsqueda -->
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
                    :placeholder="`Buscar ${tipoActivo === 'cursos' ? 'curso' : 'evento'}...`"
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
                    class="status-filter-btn"
                    :class="{ 'active': filtroEstado === 'activo' }"
                    @click="toggleEstadoFilter('activo')"
                  >
                    <i class="bi bi-check-circle"></i>
                    Activos
                  </button>
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': filtroEstado === 'finalizado' }"
                    @click="toggleEstadoFilter('finalizado')"
                  >
                    <i class="bi bi-check-circle-fill"></i>
                    Finalizados
                  </button>
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': filtroEstado === 'proximos' }"
                    @click="toggleEstadoFilter('proximos')"
                  >
                    <i class="bi bi-clock"></i>
                    Próximos
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
                  <button class="btn btn-primary" @click="exportData">
                    <i class="bi bi-download me-1"></i>Exportar
                  </button>
                  <button class="btn btn-success" @click="openCreateModal">
                    <i class="bi bi-plus-lg me-1"></i>Nuevo {{ tipoActivo === 'cursos' ? 'curso' : 'evento' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenido principal - Grid de cards -->
    <main class="main-content">
      <div class="container">
        <div class="content-header">
          <div class="header-info">
            <h4 class="content-title">
              <i class="bi" :class="tipoActivo === 'cursos' ? 'bi-mortarboard' : 'bi-calendar-event'"></i>
              {{ tipoActivo === 'cursos' ? 'Cursos Disponibles' : 'Eventos Programados' }}
            </h4>
            <p class="content-subtitle">
              Mostrando {{ itemsFiltrados.length }} de {{ totalItems }} {{ tipoActivo === 'cursos' ? 'cursos' : 'eventos' }}
            </p>
          </div>

          <div class="view-options">
            <div class="sort-options">
              <span class="text-muted">Ordenar por:</span>
              <select v-model="ordenSeleccionado" class="form-select form-select-sm ms-2" style="width: auto;">
                <option value="fecha">Fecha más cercana</option>
                <option value="nombre">Nombre (A-Z)</option>
                <option value="inscritos">Más inscritos</option>
                <option value="capacidad">Disponibilidad</option>
              </select>
            </div>

            <div class="view-toggle">
              <button class="btn btn-sm btn-outline-secondary" :class="{ 'active': vista === 'grid' }" @click="vista = 'grid'" title="Vista de cuadrícula">
                <i class="bi bi-grid-3x3-gap"></i>
              </button>
              <button class="btn btn-sm btn-outline-secondary" :class="{ 'active': vista === 'list' }" @click="vista = 'list'" title="Vista de lista">
                <i class="bi bi-list"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Vista de Grid -->
        <div v-if="vista === 'grid'" class="items-grid">
          <div class="row g-4">
            <div
              v-for="item in itemsPaginados"
              :key="item.id"
              class="col-xl-3 col-lg-4 col-md-6"
            >
              <div class="item-card" @click="viewInscritos(item)">
                <div class="card-image">
                  <div class="image-placeholder" :style="{ background: item.color }">
                    <i :class="item.icono" class="placeholder-icon"></i>
                  </div>
                  <div class="card-badge" :class="getEstadoClass(item.estado)">
                    {{ getEstadoText(item.estado) }}
                  </div>
                </div>

                <div class="card-body">
                  <h5 class="card-title">{{ item.nombre }}</h5>
                  <p class="card-description">{{ item.descripcion }}</p>
                  
                  <div class="card-meta">
                    <div class="meta-item">
                      <i class="bi bi-calendar"></i>
                      <span>{{ formatFecha(item.fechaInicio) }}</span>
                    </div>
                    <div class="meta-item">
                      <i class="bi bi-clock"></i>
                      <span>{{ item.duracion }}</span>
                    </div>
                    <div class="meta-item">
                      <i class="bi bi-geo-alt"></i>
                      <span>{{ item.modalidad }}</span>
                    </div>
                  </div>

                  <div class="card-stats">
                    <div class="stat">
                      <i class="bi bi-people"></i>
                      <div class="stat-info">
                        <span class="stat-number">{{ item.inscritos }}</span>
                        <span class="stat-label">Inscritos</span>
                      </div>
                    </div>
                    <div class="stat">
                      <i class="bi bi-person-check"></i>
                      <div class="stat-info">
                        <span class="stat-number">{{ item.asistieron }}</span>
                        <span class="stat-label">Asistieron</span>
                      </div>
                    </div>
                    <div class="stat">
                      <i class="bi bi-person-x"></i>
                      <div class="stat-info">
                        <span class="stat-number">{{ item.capacidad - item.inscritos }}</span>
                        <span class="stat-label">Disponibles</span>
                      </div>
                    </div>
                  </div>

                  <div class="progress-container">
                    <div class="progress-info">
                      <span>Capacidad</span>
                      <span>{{ Math.round((item.inscritos / item.capacidad) * 100) }}%</span>
                    </div>
                    <div class="progress">
                      <div
                        class="progress-bar"
                        :class="getProgressClass(item.inscritos / item.capacidad)"
                        :style="{ width: `${(item.inscritos / item.capacidad) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="card-footer">
                  <div class="footer-actions">
                    <button class="btn btn-sm btn-outline-primary" @click.stop="viewInscritos(item)">
                      <i class="bi bi-people"></i> Ver inscritos
                    </button>
                    <button class="btn btn-sm btn-outline-info" @click.stop="generarConstancias(item)">
                      <i class="bi bi-file-text"></i> Constancias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista de Lista -->
        <div v-else class="items-table">
          <div class="table-card">
            <div class="table-responsive">
              <table class="items-list-table">
                <thead>
                  <tr>
                    <th class="name-column">Nombre</th>
                    <th class="date-column">Fecha</th>
                    <th class="modalidad-column">Modalidad</th>
                    <th class="inscritos-column">Inscritos</th>
                    <th class="asistencia-column">Asistencia</th>
                    <th class="estado-column">Estado</th>
                    <th class="actions-column">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in itemsPaginados" :key="item.id">
                    <td class="name-cell">
                      <div class="item-info">
                        <div class="item-icon" :style="{ background: item.color }">
                          <i :class="item.icono"></i>
                        </div>
                        <div>
                          <h6 class="item-name">{{ item.nombre }}</h6>
                          <p class="item-description">{{ item.descripcion }}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td class="date-cell">
                      <div class="date-info">
                        <div class="date-start">
                          <i class="bi bi-calendar me-1"></i>
                          {{ formatFecha(item.fechaInicio) }}
                        </div>
                        <div class="date-end" v-if="item.fechaFin">
                          <small class="text-muted">
                            <i class="bi bi-arrow-right me-1"></i>
                            {{ formatFecha(item.fechaFin) }}
                          </small>
                        </div>
                      </div>
                    </td>
                    
                    <td class="modalidad-cell">
                      <span class="modalidad-badge">
                        <i class="bi" :class="getModalidadIcon(item.modalidad)"></i>
                        {{ item.modalidad }}
                      </span>
                    </td>
                    
                    <td class="inscritos-cell">
                      <div class="inscritos-info">
                        <div class="inscritos-count">
                          <span class="count-number">{{ item.inscritos }}</span>
                          <span class="count-label">/{{ item.capacidad }}</span>
                        </div>
                        <div class="inscritos-progress">
                          <div class="progress" style="height: 4px; width: 80px;">
                            <div
                              class="progress-bar"
                              :class="getProgressClass(item.inscritos / item.capacidad)"
                              :style="{ width: `${(item.inscritos / item.capacidad) * 100}%` }"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td class="asistencia-cell">
                      <div class="asistencia-info">
                        <div class="asistencia-rate">
                          <span class="rate-number">{{ Math.round((item.asistieron / item.inscritos) * 100) || 0 }}%</span>
                        </div>
                        <div class="asistencia-stats">
                          <small class="text-muted">{{ item.asistieron }} de {{ item.inscritos }}</small>
                        </div>
                      </div>
                    </td>
                    
                    <td class="estado-cell">
                      <span class="estado-badge" :class="getEstadoClass(item.estado)">
                        {{ getEstadoText(item.estado) }}
                      </span>
                    </td>
                    
                    <td class="actions-cell">
                      <div class="action-buttons">
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="viewInscritos(item)"
                          title="Ver inscritos"
                        >
                          <i class="bi bi-people"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-warning"
                          @click="editItem(item)"
                          title="Editar"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-info"
                          @click="generarConstancias(item)"
                          title="Generar constancias"
                        >
                          <i class="bi bi-file-text"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteItem(item)"
                          title="Eliminar"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div class="pagination-section" v-if="itemsFiltrados.length > 0">
          <div class="pagination-controls">
            <nav aria-label="Paginación">
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
                Mostrando {{ startItem }}-{{ endItem }} de {{ itemsFiltrados.length }} {{ tipoActivo === 'cursos' ? 'cursos' : 'eventos' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="itemsFiltrados.length === 0" class="empty-state">
          <div class="empty-content">
            <i class="bi bi-mortarboard empty-icon" v-if="tipoActivo === 'cursos'"></i>
            <i class="bi bi-calendar-event empty-icon" v-else></i>
            <h5>No se encontraron {{ tipoActivo === 'cursos' ? 'cursos' : 'eventos' }}</h5>
            <p class="text-muted">
              No hay {{ tipoActivo === 'cursos' ? 'cursos' : 'eventos' }} que coincidan con los filtros aplicados
            </p>
            <button class="btn btn-outline-primary" @click="clearFilters">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Crear Curso/Evento -->
    <div v-if="showCreateModal" class="modal-backdrop show" @click="showCreateModal = false"></div>
    <div v-if="showCreateModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-lg me-2"></i>
              Nuevo {{ tipoActivo === 'cursos' ? 'Curso' : 'Evento' }}
            </h5>
            <button type="button" class="btn-close" @click="showCreateModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Nombre</label>
                <input v-model="createForm.nombre" class="form-control" placeholder="Ingresa el nombre" />
              </div>
              <div class="col-md-12">
                <label class="form-label">Descripción</label>
                <textarea v-model="createForm.descripcion" class="form-control" rows="3" placeholder="Descripción detallada"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha de inicio</label>
                <input v-model="createForm.fechaInicio" type="date" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha de fin</label>
                <input v-model="createForm.fechaFin" type="date" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Modalidad</label>
                <select v-model="createForm.modalidad" class="form-select">
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Capacidad máxima</label>
                <input v-model="createForm.capacidad" type="number" class="form-control" min="1" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showCreateModal = false">Cancelar</button>
            <button class="btn btn-primary" @click="submitCreate">Crear</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="itemToDelete" class="modal-backdrop show" @click="cancelDelete"></div>
    <div v-if="itemToDelete" class="modal show d-block" tabindex="-1">
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

            <div class="item-preview">
              <div class="preview-icon">
                <i :class="itemToDelete.icono" class="text-primary" style="font-size: 3rem;"></i>
              </div>
              <div class="preview-info">
                <h6>{{ itemToDelete.nombre }}</h6>
                <p class="text-muted mb-1">{{ itemToDelete.descripcion }}</p>
                <p class="mb-0">
                  <span class="badge" :class="getEstadoClass(itemToDelete.estado)">
                    {{ getEstadoText(itemToDelete.estado) }}
                  </span>
                  <span class="ms-2">{{ itemToDelete.inscritos }} inscritos</span>
                </p>
              </div>
            </div>

            <p class="mt-3">
              ¿Estás seguro de que deseas eliminar este {{ tipoActivo === 'cursos' ? 'curso' : 'evento' }}?
              Se perderán todos los datos asociados, incluyendo las inscripciones.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteItemConfirm">
              <i class="bi bi-trash me-1"></i>Sí, eliminar
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
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'
type TipoItem = 'cursos' | 'eventos'
type EstadoItem = 'activo' | 'finalizado' | 'proximos' | 'cancelado'
type Modalidad = 'Presencial' | 'Virtual' | 'Híbrido'
type Vista = 'grid' | 'list'
type Orden = 'fecha' | 'nombre' | 'inscritos' | 'capacidad'

interface Item {
  id: number
  tipo: TipoItem
  nombre: string
  descripcion: string
  fechaInicio: string
  fechaFin?: string
  duracion: string
  modalidad: Modalidad
  capacidad: number
  inscritos: number
  asistieron: number
  estado: EstadoItem
  color: string
  icono: string
}

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado de datos
const cursos = ref<Item[]>([
  {
    id: 1,
    tipo: 'cursos',
    nombre: 'Introducción a la Seguridad en el Laboratorio',
    descripcion: 'Curso completo sobre protocolos de seguridad y manejo de materiales peligrosos',
    fechaInicio: '2024-03-15',
    fechaFin: '2024-03-20',
    duracion: '40 horas',
    modalidad: 'Presencial',
    capacidad: 30,
    inscritos: 28,
    asistieron: 25,
    estado: 'activo',
    color: '#1E9E4A',
    icono: 'bi bi-shield-check'
  },
  {
    id: 2,
    tipo: 'cursos',
    nombre: 'Análisis de Aguas Residuales',
    descripcion: 'Técnicas avanzadas para el análisis de parámetros físico-químicos en aguas',
    fechaInicio: '2024-03-10',
    fechaFin: '2024-03-25',
    duracion: '60 horas',
    modalidad: 'Híbrido',
    capacidad: 25,
    inscritos: 22,
    asistieron: 20,
    estado: 'activo',
    color: '#2196F3',
    icono: 'bi bi-droplet'
  },
  {
    id: 3,
    tipo: 'cursos',
    nombre: 'Calibración de Instrumentos de Medición',
    descripcion: 'Metrología y calibración de equipos de laboratorio según normas internacionales',
    fechaInicio: '2024-02-20',
    fechaFin: '2024-03-05',
    duracion: '45 horas',
    modalidad: 'Presencial',
    capacidad: 20,
    inscritos: 20,
    asistieron: 18,
    estado: 'finalizado',
    color: '#FF9800',
    icono: 'bi bi-speedometer2'
  },
  {
    id: 4,
    tipo: 'cursos',
    nombre: 'Buenas Prácticas de Manufactura (BPM)',
    descripcion: 'Implementación de BPM en laboratorios de control de calidad',
    fechaInicio: '2024-04-01',
    duracion: '35 horas',
    modalidad: 'Virtual',
    capacidad: 50,
    inscritos: 15,
    asistieron: 0,
    estado: 'proximos',
    color: '#9C27B0',
    icono: 'bi bi-clipboard-check'
  },
  {
    id: 5,
    tipo: 'cursos',
    nombre: 'Microbiología Aplicada a Alimentos',
    descripcion: 'Técnicas microbiológicas para el análisis de alimentos',
    fechaInicio: '2024-03-25',
    fechaFin: '2024-04-05',
    duracion: '50 horas',
    modalidad: 'Presencial',
    capacidad: 15,
    inscritos: 12,
    asistieron: 0,
    estado: 'proximos',
    color: '#E91E63',
    icono: 'bi bi-bug'
  },
  {
    id: 6,
    tipo: 'cursos',
    nombre: 'Gestión de Residuos Peligrosos',
    descripcion: 'Manejo, almacenamiento y disposición de residuos peligrosos en laboratorios',
    fechaInicio: '2024-01-15',
    fechaFin: '2024-01-25',
    duracion: '30 horas',
    modalidad: 'Virtual',
    capacidad: 40,
    inscritos: 35,
    asistieron: 32,
    estado: 'finalizado',
    color: '#607D8B',
    icono: 'bi bi-trash'
  }
])

const eventos = ref<Item[]>([
  {
    id: 7,
    tipo: 'eventos',
    nombre: 'Simposio Internacional de Química Analítica',
    descripcion: 'Encuentro con expertos internacionales sobre las últimas tendencias en química analítica',
    fechaInicio: '2024-04-15',
    fechaFin: '2024-04-17',
    duracion: '3 días',
    modalidad: 'Híbrido',
    capacidad: 200,
    inscritos: 185,
    asistieron: 0,
    estado: 'proximos',
    color: '#1E9E4A',
    icono: 'bi bi-people-fill'
  },
  {
    id: 8,
    tipo: 'eventos',
    nombre: 'Taller de Cromatografía Líquida',
    descripcion: 'Taller práctico sobre técnicas avanzadas de cromatografía líquida de alta resolución',
    fechaInicio: '2024-03-05',
    duracion: '8 horas',
    modalidad: 'Presencial',
    capacidad: 25,
    inscritos: 25,
    asistieron: 23,
    estado: 'finalizado',
    color: '#2196F3',
    icono: 'bi bi-filter-circle'
  },
  {
    id: 9,
    tipo: 'eventos',
    nombre: 'Webinar: Inteligencia Artificial en Laboratorios',
    descripcion: 'Aplicaciones de IA y machine learning en análisis de datos de laboratorio',
    fechaInicio: '2024-03-20',
    duracion: '3 horas',
    modalidad: 'Virtual',
    capacidad: 500,
    inscritos: 423,
    asistieron: 380,
    estado: 'finalizado',
    color: '#FF9800',
    icono: 'bi bi-cpu'
  },
  {
    id: 10,
    tipo: 'eventos',
    nombre: 'Feria de Empleo Sector Químico',
    descripcion: 'Convocatoria de empresas del sector químico y farmacéutico',
    fechaInicio: '2024-04-10',
    duracion: '6 horas',
    modalidad: 'Presencial',
    capacidad: 300,
    inscritos: 150,
    asistieron: 0,
    estado: 'proximos',
    color: '#9C27B0',
    icono: 'bi bi-briefcase'
  },
  {
    id: 11,
    tipo: 'eventos',
    nombre: 'Demostración de Espectrometría de Masas',
    descripcion: 'Demostración práctica de equipos de espectrometría de masas de última generación',
    fechaInicio: '2024-03-12',
    duracion: '4 horas',
    modalidad: 'Presencial',
    capacidad: 20,
    inscritos: 20,
    asistieron: 19,
    estado: 'finalizado',
    color: '#E91E63',
    icono: 'bi bi-graph-up'
  },
  {
    id: 12,
    tipo: 'eventos',
    nombre: 'Certificación en Sistemas de Gestión de Calidad',
    descripcion: 'Preparación para certificación ISO 9001:2015 para laboratorios',
    fechaInicio: '2024-04-05',
    fechaFin: '2024-04-12',
    duracion: '40 horas',
    modalidad: 'Virtual',
    capacidad: 100,
    inscritos: 65,
    asistieron: 0,
    estado: 'proximos',
    color: '#607D8B',
    icono: 'bi bi-award'
  }
])

// Filtros y estado
const tipoActivo = ref<TipoItem>('cursos')
const searchQuery = ref('')
const filtroEstado = ref<string | null>(null)
const vista = ref<Vista>('grid')
const ordenSeleccionado = ref<Orden>('fecha')

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Modal state
const showCreateModal = ref(false)
const itemToDelete = ref<Item | null>(null)
const createForm = ref({
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  modalidad: 'Presencial' as Modalidad,
  capacidad: 20
})

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const totalInscripciones = computed(() => {
  return [...cursos.value, ...eventos.value].reduce((total, item) => total + item.inscritos, 0)
})

const itemsActivos = computed(() => {
  return tipoActivo.value === 'cursos' ? cursos.value : eventos.value
})

const itemsFiltrados = computed(() => {
  let items = [...itemsActivos.value]
  
  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.nombre.toLowerCase().includes(query) ||
      item.descripcion.toLowerCase().includes(query) ||
      item.modalidad.toLowerCase().includes(query)
    )
  }
  
  // Filtro por estado
  if (filtroEstado.value) {
    items = items.filter(item => {
      if (filtroEstado.value === 'activo') return item.estado === 'activo'
      if (filtroEstado.value === 'finalizado') return item.estado === 'finalizado'
      if (filtroEstado.value === 'proximos') return item.estado === 'proximos'
      return true
    })
  }
  
  // Ordenar
  items.sort((a, b) => {
    switch (ordenSeleccionado.value) {
      case 'nombre':
        return a.nombre.localeCompare(b.nombre)
      case 'inscritos':
        return b.inscritos - a.inscritos
      case 'capacidad':
        return (b.capacidad - b.inscritos) - (a.capacidad - a.inscritos)
      case 'fecha':
      default:
        return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    }
  })
  
  return items
})

const totalItems = computed(() => itemsFiltrados.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

const itemsPaginados = computed(() => {
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
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))

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

const toggleEstadoFilter = (estado: string) => {
  filtroEstado.value = filtroEstado.value === estado ? null : estado
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  filtroEstado.value = null
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const formatFecha = (fecha: string): string => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getEstadoClass = (estado: EstadoItem): string => {
  const classMap: Record<EstadoItem, string> = {
    'activo': 'estado-activo',
    'finalizado': 'estado-finalizado',
    'proximos': 'estado-proximos',
    'cancelado': 'estado-cancelado'
  }
  return classMap[estado] || ''
}

const getEstadoText = (estado: EstadoItem): string => {
  const textMap: Record<EstadoItem, string> = {
    'activo': 'Activo',
    'finalizado': 'Finalizado',
    'proximos': 'Próximo',
    'cancelado': 'Cancelado'
  }
  return textMap[estado] || estado
}

const getProgressClass = (ratio: number): string => {
  if (ratio >= 0.9) return 'bg-danger'
  if (ratio >= 0.7) return 'bg-warning'
  return 'bg-success'
}

const getModalidadIcon = (modalidad: Modalidad): string => {
  const iconMap: Record<Modalidad, string> = {
    'Presencial': 'bi-geo-alt',
    'Virtual': 'bi-laptop',
    'Híbrido': 'bi-laptop-fill'
  }
  return iconMap[modalidad] || 'bi-question-circle'
}

const viewInscritos = (item: Item) => {
  router.push(`/admin/inscripciones/${item.tipo}/${item.id}`)
}

const editItem = (item: Item) => {
  showCreateModal.value = true
  createForm.value = {
    nombre: item.nombre,
    descripcion: item.descripcion,
    fechaInicio: item.fechaInicio,
    fechaFin: item.fechaFin || '',
    modalidad: item.modalidad,
    capacidad: item.capacidad
  }
}

const deleteItem = (item: Item) => {
  itemToDelete.value = item
}

const cancelDelete = () => {
  itemToDelete.value = null
}

const deleteItemConfirm = () => {
  if (!itemToDelete.value) return
  
  if (tipoActivo.value === 'cursos') {
    cursos.value = cursos.value.filter(c => c.id !== itemToDelete.value!.id)
  } else {
    eventos.value = eventos.value.filter(e => e.id !== itemToDelete.value!.id)
  }
  
  showToast(`${tipoActivo.value === 'cursos' ? 'Curso' : 'Evento'} eliminado`, 'success', 'Eliminación')
  itemToDelete.value = null
}

const openCreateModal = () => {
  createForm.value = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    modalidad: 'Presencial',
    capacidad: 20
  }
  showCreateModal.value = true
}

const submitCreate = () => {
  const nuevoItem: Item = {
    id: tipoActivo.value === 'cursos' ? Math.max(...cursos.value.map(c => c.id), 0) + 1 : Math.max(...eventos.value.map(e => e.id), 0) + 1,
    tipo: tipoActivo.value,
    nombre: createForm.value.nombre,
    descripcion: createForm.value.descripcion,
    fechaInicio: createForm.value.fechaInicio,
    fechaFin: createForm.value.fechaFin || undefined,
    duracion: tipoActivo.value === 'cursos' ? '40 horas' : '8 horas',
    modalidad: createForm.value.modalidad,
    capacidad: createForm.value.capacidad,
    inscritos: 0,
    asistieron: 0,
    estado: new Date(createForm.value.fechaInicio) > new Date() ? 'proximos' : 'activo',
    color: tipoActivo.value === 'cursos' ? '#1E9E4A' : '#2196F3',
    icono: tipoActivo.value === 'cursos' ? 'bi bi-mortarboard' : 'bi bi-calendar-event'
  }
  
  if (tipoActivo.value === 'cursos') {
    cursos.value.unshift(nuevoItem)
  } else {
    eventos.value.unshift(nuevoItem)
  }
  
  showCreateModal.value = false
  showToast(`${tipoActivo.value === 'cursos' ? 'Curso' : 'Evento'} creado`, 'success', 'Creación')
}

const generarConstancias = (item: Item) => {
  showToast('Generando constancias...', 'info', 'Procesando')
  // En producción, aquí se generaría el PDF
  setTimeout(() => {
    showToast('Constancias generadas exitosamente', 'success', 'Constancias')
  }, 2000)
}

const exportData = () => {
  const items = tipoActivo.value === 'cursos' ? cursos.value : eventos.value
  const headers = ['ID', 'Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Modalidad', 'Capacidad', 'Inscritos', 'Asistieron', 'Estado']
  
  const csvData = items.map(item => [
    item.id,
    item.nombre,
    item.descripcion,
    item.fechaInicio,
    item.fechaFin || '',
    item.modalidad,
    item.capacidad,
    item.inscritos,
    item.asistieron,
    getEstadoText(item.estado)
  ])
  
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${tipoActivo.value}-sena-${new Date().toISOString().split('T')[0]}.csv`
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
})
</script>

<style scoped>
.admin-inscripciones-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-inscripciones-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header - Mismo estilo que usuarios */
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

/* Type filters */
.type-filters {
  display: flex;
  gap: 0.5rem;
}

.type-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

[data-bs-theme="dark"] .type-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.type-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.type-filter-btn.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

/* Search box */
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

/* Status filters */
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

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Main content */
.main-content {
  padding: 1rem 0 3rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.content-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .content-title {
  color: var(--color-dark, #F8F9FA);
}

.content-subtitle {
  color: var(--color-gray, #6C757D);
  margin: 0;
  font-size: 0.95rem;
}

.view-options {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
}

.view-toggle .btn {
  padding: 0.375rem 0.75rem;
}

.view-toggle .btn.active {
  background: var(--color-primary, #1E9E4A);
  color: white;
  border-color: var(--color-primary, #1E9E4A);
}

/* Items Grid */
.items-grid {
  margin-bottom: 2rem;
}

.item-card {
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

[data-bs-theme="dark"] .item-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary, #1E9E4A);
}

.card-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary, #1E9E4A) 0%, var(--color-primary-dark, #0A8F3A) 100%);
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

.estado-activo {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
}

.estado-finalizado {
  background: linear-gradient(135deg, #9E9E9E 0%, #616161 100%);
  color: white;
}

.estado-proximos {
  background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
  color: #333;
}

.estado-cancelado {
  background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
  color: white;
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
}

.card-stats {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
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
  font-size: 1.1rem;
  line-height: 1;
}

[data-bs-theme="dark"] .stat-number {
  color: var(--color-dark, #F8F9FA);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.progress-container {
  margin-top: auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
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
}

.footer-actions .btn {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.85rem;
}

/* Items Table */
.items-table {
  margin-bottom: 2rem;
}

.items-list-table {
  width: 100%;
  border-collapse: collapse;
}

.items-list-table thead tr {
  background: var(--lab-bg, #f8f9fa);
  border-bottom: 2px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .items-list-table thead tr {
  background: var(--lab-bg, #1a1a1a);
  border-bottom: 2px solid var(--color-gray-light, #2d2d2d);
}

.items-list-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

[data-bs-theme="dark"] .items-list-table th {
  color: var(--color-gray-dark, #ADB5BD);
}

.items-list-table tbody tr {
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  transition: background-color 0.3s ease;
}

.items-list-table tbody tr:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .items-list-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.items-list-table td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
}

/* Table cells */
.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.item-name {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .item-name {
  color: var(--color-dark, #F8F9FA);
}

.item-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
  margin: 0;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-start {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .date-start {
  color: var(--color-dark, #F8F9FA);
}

.modalidad-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  background: var(--lab-bg, #f8f9fa);
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
  font-weight: 500;
}

[data-bs-theme="dark"] .modalidad-badge {
  background: var(--lab-bg, #1a1a1a);
}

.inscritos-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.inscritos-count {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.count-number {
  font-weight: 700;
  color: var(--color-dark, #212529);
  font-size: 1.1rem;
}

[data-bs-theme="dark"] .count-number {
  color: var(--color-dark, #F8F9FA);
}

.count-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
}

.asistencia-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.asistencia-rate {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rate-number {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
  font-size: 1.1rem;
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

/* Empty state */
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

/* Pagination */
.pagination-section {
  padding: 1.5rem 0;
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

/* Modal */
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

.item-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 12px;
  margin: 1rem 0;
}

[data-bs-theme="dark"] .item-preview {
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
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .view-options {
    width: 100%;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .sort-options {
    flex: 1;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
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

  .card-stats {
    flex-wrap: wrap;
  }

  .stat {
    min-width: 80px;
  }

  .items-list-table thead {
    display: none;
  }

  .items-list-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid var(--color-gray-light, #E9ECEF);
    border-radius: 8px;
    padding: 1rem;
  }

  .items-list-table td {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border: none;
  }

  .items-list-table td::before {
    content: attr(data-label);
    font-weight: 600;
    width: 100px;
    flex-shrink: 0;
    color: var(--color-gray, #6C757D);
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

  .panel-body {
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

  .footer-actions {
    flex-direction: column;
  }

  .footer-actions .btn {
    width: 100%;
  }
}
</style>