<template>
  <div :data-bs-theme="currentTheme" class="admin-catalogs-page">
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
              <i class="bi bi-diagram-3"></i> Catálogos del Sistema
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-diagram-3-fill me-2"></i>Catálogos: Áreas y Ramas
            </h1>
            <p class="page-subtitle">
              Gestiona áreas, subáreas, ramas y subramas del sistema de calibración
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-layers"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalAreas }}</span>
                  <span class="stat-label">Áreas</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-diagram-3"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalRamas }}</span>
                  <span class="stat-label">Ramas</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon admin">
                  <i class="bi bi-list-nested"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalSubareas }}</span>
                  <span class="stat-label">Subáreas</span>
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
                  <i class="bi bi-search me-1"></i>Buscar catálogos
                </label>
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Buscar por nombre de área o rama..."
                    @input="handleSearch"
                  >
                  <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por tipo -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-filter me-1"></i>Filtrar por tipo
                </label>
                <div class="type-filters">
                  <button
                    class="type-filter-btn"
                    :class="{ 'active': selectedType === 'areas' }"
                    @click="toggleTypeFilter('areas')"
                  >
                    <i class="bi bi-layers"></i>
                    Áreas
                  </button>
                  <button
                    class="type-filter-btn"
                    :class="{ 'active': selectedType === 'ramas' }"
                    @click="toggleTypeFilter('ramas')"
                  >
                    <i class="bi bi-diagram-3"></i>
                    Ramas
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
                  <div class="btn-group">
                    <button class="btn btn-success" @click="openCreateModal('area')">
                      <i class="bi bi-plus-lg me-1"></i>Nueva Área
                    </button>
                    <button class="btn btn-success" @click="openCreateModal('rama')">
                      <i class="bi bi-plus-lg me-1"></i>Nueva Rama
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de catálogos -->
    <main class="main-content">
      <div class="container">
        <div class="row g-4">
          <!-- Columnas lado a lado -->
          <div class="col-xl-6">
            <div class="table-card">
              <div class="table-header">
                <div class="table-info">
                  <h4 class="table-title">
                    <i class="bi bi-layers me-2"></i>Áreas del Sistema
                  </h4>
                  <p class="table-subtitle">
                    {{ filteredAreas.length }} áreas registradas
                  </p>
                </div>

                <div class="table-actions">
                  <div class="pagination-info">
                    <span class="text-muted">Mostrando {{ paginatedAreas.length }} de {{ filteredAreas.length }}</span>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="catalogs-table">
                  <thead>
                    <tr>
                      <th class="nombre-column">Área</th>
                      <th class="subitems-column">Subáreas</th>
                      <th class="actions-column">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="area in paginatedAreas" :key="area.id">
                      <!-- Nombre del área -->
                      <td class="nombre-cell">
                        <div class="area-info">
                          <div class="area-nombre">
                            <IconGlyph :icon="area.icon || 'bi bi-layers text-primary'" :label="area.nombre" class="me-2" />
                            <a href="#" class="name-link" @click.prevent="viewCatalogo(area, 'area')"><strong>{{ area.nombre }}</strong></a>
                          </div>
                          <!-- no description field -->
                        </div>
                      </td>

                      <!-- Subáreas: mostrar solo contador + botón para abrir modal -->
                      <td class="subitems-cell">
                        <div class="subitems-compact d-flex align-items-center gap-2">
                          <span class="badge" :class="getSubareasCountClass(area.subareas?.length || 0)">
                            {{ area.subareas?.length || 0 }}
                          </span>
                        </div>
                      </td>

                      <!-- Acciones -->
                      <td class="actions-cell">
                        <div class="action-buttons">
                          <!-- Ver se abre desde el nombre/icono; mantener sólo editar/eliminar aquí -->
                          <button
                            class="btn btn-sm btn-outline-warning"
                            @click="openEditModal(area, 'area')"
                            title="Editar área"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDelete(area, 'area')"
                            title="Eliminar área"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- Estado vacío -->
                    <tr v-if="filteredAreas.length === 0">
                      <td colspan="3" class="empty-state">
                        <div class="empty-content">
                          <i class="bi bi-layers empty-icon"></i>
                          <h5>No se encontraron áreas</h5>
                          <p class="text-muted">
                            No hay áreas que coincidan con los filtros aplicados
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
            </div>
          </div>

          <div class="col-xl-6">
            <div class="table-card">
              <div class="table-header">
                <div class="table-info">
                  <h4 class="table-title">
                    <i class="bi bi-diagram-3 me-2"></i>Ramas del Sistema
                  </h4>
                  <p class="table-subtitle">
                    {{ filteredRamas.length }} ramas registradas
                  </p>
                </div>

                <div class="table-actions">
                  <div class="pagination-info">
                    <span class="text-muted">Mostrando {{ paginatedRamas.length }} de {{ filteredRamas.length }}</span>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="catalogs-table">
                  <thead>
                    <tr>
                      <th class="nombre-column">Rama</th>
                      <th class="subitems-column">Subramas</th>
                      <th class="actions-column">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="rama in paginatedRamas" :key="rama.id">
                      <!-- Nombre de la rama -->
                      <td class="nombre-cell">
                        <div class="rama-info">
                          <div class="rama-nombre">
                            <IconGlyph :icon="rama.icon || 'bi bi-diagram-3 text-success'" :label="rama.nombre" class="me-2" />
                            <a href="#" class="name-link" @click.prevent="viewCatalogo(rama, 'rama')"><strong>{{ rama.nombre }}</strong></a>
                          </div>
                          <!-- no description field -->
                        </div>
                      </td>

                      <!-- Subramas: mostrar solo contador + botón para abrir modal -->
                      <td class="subitems-cell">
                        <div class="subitems-compact d-flex align-items-center gap-2">
                          <span class="badge" :class="getSubramasCountClass(rama.subramas?.length || 0)">
                            {{ rama.subramas?.length || 0 }}
                          </span>
                        </div>
                      </td>

                      <!-- Acciones -->
                      <td class="actions-cell">
                        <div class="action-buttons">
                          <!-- Ver se abre desde el nombre/icono; mantener sólo editar/eliminar aquí -->
                          <button
                            class="btn btn-sm btn-outline-warning"
                            @click="openEditModal(rama, 'rama')"
                            title="Editar rama"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDelete(rama, 'rama')"
                            title="Eliminar rama"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- Estado vacío -->
                    <tr v-if="filteredRamas.length === 0">
                      <td colspan="3" class="empty-state">
                        <div class="empty-content">
                          <i class="bi bi-diagram-3 empty-icon"></i>
                          <h5>No se encontraron ramas</h5>
                          <p class="text-muted">
                            No hay ramas que coincidan con los filtros aplicados
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
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="catalogoToDelete" class="modal-backdrop show" @click="cancelDelete"></div>
    <div v-if="catalogoToDelete" class="modal show d-block" tabindex="-1">
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

            <div class="catalogo-preview">
            <div class="preview-icon">
              <IconGlyph :icon="(catalogoToDelete && (catalogoToDelete as any).icon) ? ((catalogoToDelete as any).icon) : (deleteType === 'area' ? 'bi bi-layers text-primary' : 'bi bi-diagram-3 text-success')" style="font-size: 3rem;" />
            </div>
              <div class="preview-info">
                <h6>{{ catalogoToDelete.nombre }}</h6>
                <p class="text-muted mb-1">
                  {{ deleteType === 'area' ? 'Área' : 'Rama' }} del sistema
                </p>
                <p class="mb-0">
                  <span class="badge" :class="deleteType === 'area' ? 'bg-primary' : 'bg-success'">
                    {{ deleteType === 'area' ? `${catalogoToDelete.subareas?.length || 0} subáreas` : `${catalogoToDelete.subramas?.length || 0} subramas` }}
                  </span>
                </p>
              </div>
            </div>

            <p class="mt-3">
              ¿Estás seguro de que deseas eliminar permanentemente este {{ deleteType === 'area' ? 'área' : 'rama' }}?
              Se perderán todos los datos asociados.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCatalogo">
              <i class="bi bi-trash me-1"></i>Sí, eliminar {{ deleteType === 'area' ? 'área' : 'rama' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar Catálogo -->
    <div v-if="showCatalogoModal" class="modal-backdrop show" @click="showCatalogoModal = false"></div>
    <div v-if="showCatalogoModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i :class="modalType === 'area' ? 'bi bi-layers me-2' : 'bi bi-diagram-3 me-2'"></i>
              {{ isEditing ? 'Editar' : 'Nuevo' }} {{ modalType === 'area' ? 'Área' : 'Rama' }}
            </h5>
            <button type="button" class="btn-close" @click="showCatalogoModal = false"></button>
          </div>
          <div class="modal-body">
            <!-- Formulario con stepper -->
            <div class="stepper mb-4">
              <div class="stepper-progress">
                <div class="stepper-bar" :style="{ width: `${(currentStep / steps.length) * 100}%` }"></div>
              </div>
              <div class="stepper-steps">
                <div
                  v-for="(step, index) in steps"
                  :key="index"
                  class="stepper-step"
                  :class="{ 'active': index + 1 === currentStep, 'completed': index + 1 < currentStep }"
                >
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-label">{{ step.label }}</div>
                </div>
              </div>
            </div>

            <!-- Paso 1: Información básica -->
            <div v-if="currentStep === 1" class="step-content">
              <h6 class="step-title mb-4">
                <i class="bi bi-info-circle me-2"></i>
                Información Básica
              </h6>

              <div class="row g-3">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label required">
                      <i class="bi bi-tag me-1"></i>
                      Nombre del {{ modalType === 'area' ? 'Área' : 'Rama' }}
                    </label>
                    <input
                      v-model="catalogoForm.nombre"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.nombre }"
                      :placeholder="`Ingresa el nombre del ${modalType === 'area' ? 'área' : 'rama'}`"
                      required
                    >
                    <div v-if="errors.nombre" class="invalid-feedback">
                      {{ errors.nombre }}
                    </div>
                  </div>
                </div>

                <!-- no description field required -->

                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">
                      <i class="bi bi-palette me-1"></i>
                      Icono (Opcional)
                    </label>
                    <div class="d-flex align-items-center gap-2">
                      <div class="icon-catalog w-100">
                        <input v-model="iconSearch" class="form-control form-control-sm mb-2" placeholder="Buscar iconos (ej. 'layers' o 'bi-layers')" />
                        <div class="icon-grid d-flex flex-wrap gap-2" style="max-height:200px; overflow:auto;">
                          <button
                            v-for="ic in filteredIcons"
                            :key="ic.value"
                            type="button"
                            class="icon-option btn btn-light"
                            :class="{ 'border-primary': ic.value === catalogoForm.icon }"
                            @click.prevent="catalogoForm.icon = ic.value"
                            :title="ic.label"
                          >
                              <IconGlyph :icon="ic.value" :label="ic.label" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paso 2: Subitems -->
            <div v-else-if="currentStep === 2" class="step-content">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h6 class="step-title mb-0">
                  <i class="bi bi-list-check me-2"></i>
                  {{ modalType === 'area' ? 'Subáreas' : 'Subramas' }}
                </h6>
                <button type="button" class="btn btn-sm btn-primary" @click="addSubitem">
                  <i class="bi bi-plus me-1"></i>
                  Agregar {{ modalType === 'area' ? 'Subárea' : 'Subrama' }}
                </button>
              </div>

              <div class="subitems-list">
                <div v-for="(item, index) in catalogoForm.subitems" :key="index" class="subitem-item panel-card mb-3">
                  <div class="panel-body">
                    <div class="row g-3 align-items-center">
                      <div class="col-md-10">
                        <div class="form-group">
                          <label class="form-label required">
                            {{ modalType === 'area' ? 'Subárea' : 'Subrama' }} #{{ index + 1 }}
                          </label>
                          <input
                            v-model="item.nombre"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': errors[`subitem${index}`] }"
                            :placeholder="`Nombre de la ${modalType === 'area' ? 'subárea' : 'subrama'}`"
                            required
                          >
                          <div v-if="errors[`subitem${index}`]" class="invalid-feedback">
                            {{ errors[`subitem${index}`] }}
                          </div>
                        </div>
                      </div>

                      <div class="col-md-2 text-end">
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeSubitem(index)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="alert alert-info mt-3">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Ejemplos de {{ modalType === 'area' ? 'subáreas' : 'subramas' }}:</strong><br>
                <template v-if="modalType === 'area'">
                  • Instrumentos para pesar de Funcionamiento No Automático (IPFNA)<br>
                  • Calibración de Pesas<br>
                  • Termómetros de lectura directa (TLD)<br>
                  • Recipientes volumétricos
                </template>
                <template v-else>
                  • Espectrofotometría de Absorción Atómica<br>
                  • Espectrofotométricos UV/VIS/IR<br>
                  • Mediciones Directas y Fisicoquímicos<br>
                  • Espectrofotometría de emisión por plasma
                </template>
              </div>
            </div>

            <!-- Navegación -->
            <div class="step-navigation mt-4">
              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary" @click="prevStep" :disabled="currentStep === 1">
                  <i class="bi bi-arrow-left me-1"></i>Anterior
                </button>

                <div>
                  <button v-if="currentStep < steps.length" type="button" class="btn btn-primary" @click="nextStep">
                    Siguiente <i class="bi bi-arrow-right ms-1"></i>
                  </button>
                  <button v-else type="button" class="btn btn-success" @click="submitCatalogo" :disabled="isSubmitting">
                    <template v-if="isSubmitting">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Guardando...
                    </template>
                    <template v-else>
                      <i class="bi bi-check-circle me-2"></i>
                      {{ isEditing ? 'Actualizar' : 'Crear' }} {{ modalType === 'area' ? 'Área' : 'Rama' }}
                    </template>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Detalles -->
    <div v-if="showViewModal" class="modal-backdrop show" @click="showViewModal = false"></div>
    <div v-if="showViewModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title">
                <IconGlyph :icon="(viewCatalogoData && viewCatalogoData.icon) ? viewCatalogoData.icon : (viewType === 'area' ? 'bi bi-layers text-primary' : 'bi bi-diagram-3 text-success')" class="me-2" :label="viewCatalogoData.nombre" />
                Detalles: {{ viewCatalogoData.nombre }}
              </h5>
            <button type="button" class="btn-close" @click="showViewModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="catalogo-detail">
              <div class="detail-header">
                <h6>Información General</h6>
              </div>

              <div class="detail-subitems">
                <h6>
                  <i class="bi bi-list-check me-2"></i>
                  {{ viewType === 'area' ? 'Subáreas' : 'Subramas' }}
                  <span class="badge" :class="viewType === 'area' ? 'bg-primary' : 'bg-success'">
                    {{ viewCatalogoData.subitems?.length || 0 }}
                  </span>
                </h6>

                <div class="subitems-grid">
                  <div v-for="(item, index) in viewCatalogoData.subitems" :key="index" class="subitem-card">
                    <div class="subitem-content">
                      <div class="subitem-number">{{ index + 1 }}</div>
                      <div class="subitem-text">{{ item.nombre }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="showViewModal = false">
              <i class="bi bi-x-lg me-1"></i>Cerrar
            </button>
            <button type="button" class="btn btn-primary" @click="openEditModal(viewCatalogoData, viewType)">
              <i class="bi bi-pencil me-1"></i>Editar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <BaseToast ref="toastRef" toast-id="adminToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import ICON_CATALOG from '../../../utils/iconCatalog'
import IconGlyph from '../../../components/UI/IconGlyph.vue'
import { useRouter } from 'vue-router'

// Tipos
type Theme = 'light' | 'dark'
type CatalogoType = 'area' | 'rama'

interface Subitem {
  id?: number
  nombre: string
}

interface Catalogo {
  id: number
  nombre: string
  descripcion?: string
  icon?: string
  subareas?: Subitem[]
  subramas?: Subitem[]
}

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// API base (asegurar prefijo /api)
import { API_BASE } from '@/config/api'
import BaseToast from '@/components/UI/BaseToast.vue'
import { useToast, type ToastType } from '@/composables/useToast'

const { toastRef, showToast } = useToast()

// Datos de ejemplo
const areas = ref<Catalogo[]>([
  {
    id: 1,
    nombre: 'Masa',
    descripcion: 'Instrumentos y equipos para medición de masa',
    icon: 'bi bi-basket-fill text-primary',
    subareas: [
      { id: 1, nombre: 'Instrumentos para pesar de Funcionamiento No Automático (IPFNA)' },
      { id: 2, nombre: 'Calibración de Pesas' },
      { id: 3, nombre: 'Objeto sólido no normalizado' },
      { id: 4, nombre: 'Instrumentos para pesar de funcionamiento no automático (alto alcance)' }
    ]
  },
  {
    id: 2,
    nombre: 'Temperatura',
    descripcion: 'Equipos para medición de temperatura',
    subareas: [
      { id: 5, nombre: 'Termómetros de lectura directa (TLD)' },
      { id: 6, nombre: 'Termómetros de resistencia (TRP)' },
      { id: 7, nombre: 'Termómetro de radiación' },
      { id: 8, nombre: 'Fuente radiante' },
      { id: 9, nombre: 'Termómetros de liquido en vidrio (TLV)' }
    ]
  },
  {
    id: 3,
    nombre: 'Volumen',
    descripcion: 'Equipos para medición de volumen',
    subareas: [
      { id: 10, nombre: 'Recipientes volumétricos' },
      { id: 11, nombre: 'Medidas Volumétricas' },
      { id: 12, nombre: 'Tanques cilíndricos horizontales' },
      { id: 13, nombre: 'Autotanques y Carrotanques' },
      { id: 14, nombre: 'Tanques fijos horizontales y verticales' }
    ]
  },
  {
    id: 4,
    nombre: 'Densidad',
    descripcion: 'Equipos para medición de densidad',
    subareas: [
      { id: 15, nombre: 'Densímetros de inmersión' },
      { id: 16, nombre: 'Determinación de densidad de líquidos' }
    ]
  },
  {
    id: 5,
    nombre: 'Presión',
    descripcion: 'Equipos para medición de presión',
    subareas: [
      { id: 17, nombre: 'Manómetros' },
      { id: 18, nombre: 'Vacuómetros' }
    ]
  },
  {
    id: 6,
    nombre: 'Dimensional',
    descripcion: 'Equipos para mediciones dimensionales',
    subareas: [
      { id: 19, nombre: 'Calibración de trasmisores' },
      { id: 20, nombre: 'Cintas graduadas y flexómetros' },
      { id: 21, nombre: 'Reglas graduadas' },
      { id: 22, nombre: 'Indicador de tipo palanca' },
      { id: 23, nombre: 'Indicador de vástago recto' },
      { id: 24, nombre: 'Micrómetro de exteriores con bloques patrón' },
      { id: 25, nombre: 'Calibrador con bloques patrón' },
      { id: 26, nombre: 'Micrómetro de profundidad con bloques patrón' },
      { id: 27, nombre: 'Calibrador de profundidad (medidor de profundidad)' },
      { id: 28, nombre: 'Calibrador de altura (medidor de alturas)' },
      { id: 29, nombre: 'Medidor de Altura' },
      { id: 30, nombre: 'Mesa de planitud' },
      { id: 31, nombre: 'Medidor automático de nivel (tipo radar, radar de onda guiada, flotador, laser, ultrasonidos, magnetostrictivos)' },
      { id: 32, nombre: 'Estación total calibrada como teodolito' }
    ]
  },
  {
    id: 7,
    nombre: 'Eléctrica',
    descripcion: 'Equipos para mediciones eléctricas',
    subareas: [
      { id: 33, nombre: 'Multímetros de 4 1/2 y 5 1/2 dígitos' },
      { id: 34, nombre: 'Calibradores, simulación RTD por resistencia de eléctrica' },
      { id: 35, nombre: 'Multímetro digital (magnitud: Capacitancia)' },
      { id: 36, nombre: 'Medidor de potencia eléctrica monofásico (magnitud: potencia eléctrica alterna reactiva)' },
      { id: 37, nombre: 'Medidor de Energía eléctrica monofásico (magnitud: energía eléctrica activa)' },
      { id: 38, nombre: 'Indicadores, registradores simulación de termopares por tensión eléctrica' },
      { id: 39, nombre: 'Sensores de humedad (Termo hidrógeno)' }
    ]
  },
  {
    id: 8,
    nombre: 'Flujo',
    descripcion: 'Equipos para medición de flujo',
    subareas: [
      { id: 40, nombre: 'Medidores de flujo de líquidos de desplazamiento positivo' },
      { id: 41, nombre: 'Medidores de flujo de líquidos (tipo Coriolis)' },
      { id: 42, nombre: 'Medidor de flujo de gas tipo masico' },
      { id: 43, nombre: 'Medidor de gas tipo diafragma' },
      { id: 44, nombre: 'Fugas patrón' }
    ]
  },
  {
    id: 9,
    nombre: 'Mediciones especiales',
    descripcion: 'Equipos para mediciones especiales',
    subareas: [
      { id: 45, nombre: 'Medidor de potencial de hidrógeno' },
      { id: 46, nombre: 'Medidor de conductividad electrolítica' },
      { id: 47, nombre: 'Medios Isotermos (horno de pozo seco)' },
      { id: 48, nombre: 'Cámara climática sin carga' },
      { id: 49, nombre: 'Cámara climática con carga' },
      { id: 50, nombre: 'Baños líquidos' }
    ]
  }
])

const ramas = ref<Catalogo[]>([
  {
    id: 1,
    nombre: 'Agua',
    descripcion: 'Análisis y mediciones en agua',
    icon: 'bi bi-droplet-fill text-info',
    subramas: [
      { id: 1, nombre: 'Espectrofotometría de Absorción Atómica' },
      { id: 2, nombre: 'Espectrofotométricos UV/VIS/IR' },
      { id: 3, nombre: 'Mediciones Directas y Fisicoquímicos en agua residual' },
      { id: 4, nombre: 'Espectrofotometría de emisión por plasma' }
    ]
  },
  {
    id: 2,
    nombre: 'Alimentos',
    descripcion: 'Análisis y mediciones en alimentos',
    subramas: [
      { id: 5, nombre: 'Espectrofotometría de Absorción Atómica' },
      { id: 6, nombre: 'Espectrofotométricos UV/VIS/IR' },
      { id: 7, nombre: 'Fisicoquímicos' },
      { id: 8, nombre: 'Espectrofotometría de emisión por plasma' }
    ]
  }
])

// Filtros y búsqueda
const searchQuery = ref('')
const selectedType = ref<'areas' | 'ramas' | null>(null)

// Modal estados
const showCatalogoModal = ref(false)
const showViewModal = ref(false)
const isEditing = ref(false)
const modalType = ref<CatalogoType>('area')
const viewType = ref<CatalogoType>('area')
const viewCatalogoData = ref<any>(null)

// Formulario
const currentStep = ref(1)
const steps = [
  { label: 'Información' },
  { label: 'Subitems' }
]
const catalogoForm = ref({
  id: null as number | null,
  nombre: '',
  icon: '',
  subitems: [] as Subitem[]
})
const iconSearch = ref('')
const iconList = ref(ICON_CATALOG)
const filteredIcons = computed(() => {
  const q = String(iconSearch.value || '').toLowerCase().trim()
  if (!q) return iconList.value
  return iconList.value.filter(i => i.label.toLowerCase().includes(q) || i.value.toLowerCase().includes(q))
})
const errors = ref<Record<string, string>>({})

// Eliminación
const catalogoToDelete = ref<Catalogo | null>(null)
const deleteType = ref<CatalogoType>('area')

// Toast

// Estados
const isSubmitting = ref(false)

// Computed
const totalAreas = computed(() => areas.value.length)
const totalRamas = computed(() => ramas.value.length)
const totalSubareas = computed(() => areas.value.reduce((total, area) => total + (area.subareas?.length || 0), 0))

const filteredAreas = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  if (selectedType.value === 'ramas') return []

  return areas.value.filter(area => {
    const matchesSearch = !query ||
      area.nombre.toLowerCase().includes(query) ||
      area.subareas?.some(subarea => subarea.nombre.toLowerCase().includes(query))

    return matchesSearch
  })
})

const filteredRamas = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  if (selectedType.value === 'areas') return []

  return ramas.value.filter(rama => {
    const matchesSearch = !query ||
      rama.nombre.toLowerCase().includes(query) ||
      rama.subramas?.some(subrama => subrama.nombre.toLowerCase().includes(query))

    return matchesSearch
  })
})

const paginatedAreas = computed(() => filteredAreas.value)
const paginatedRamas = computed(() => filteredRamas.value)

// Toast helpers



// Métodos
const handleSearch = () => {
  // Implementar si se agrega paginación
}

const toggleTypeFilter = (type: 'areas' | 'ramas') => {
  selectedType.value = selectedType.value === type ? null : type
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = null
}

const getSubareasCountClass = (count: number) => {
  if (count === 0) return 'bg-secondary'
  if (count <= 5) return 'bg-success'
  if (count <= 10) return 'bg-warning'
  return 'bg-danger'
}

const getSubramasCountClass = (count: number) => {
  if (count === 0) return 'bg-secondary'
  if (count <= 3) return 'bg-success'
  if (count <= 6) return 'bg-warning'
  return 'bg-danger'
}

const getFirstSubareas = (subareas: Subitem[]) => {
  return subareas.slice(0, 2).map(s => s.nombre).join(', ')
}

const getFirstSubramas = (subramas: Subitem[]) => {
  return subramas.slice(0, 2).map(s => s.nombre).join(', ')
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

const fetchCatalogsFromApi = async () => {
  try {
    const token = getAuthToken()
    // Obtener listas básicas
    const [areasRes, ramasRes] = await Promise.all([
      fetch(`${API_BASE}/api/areas`),
      fetch(`${API_BASE}/api/ramas`)
    ])
    if (!areasRes.ok || !ramasRes.ok) throw new Error('Error fetching lists')
    const areasList = await areasRes.json()
    const ramasList = await ramasRes.json()

    // Para cada área/ rama, obtener sus subitems (detalle)
    const areasDetailed = await Promise.all(areasList.map(async (a: any) => {
      try {
        const r = await fetch(`${API_BASE}/api/areas/${a.id}`)
        if (r.ok) return await r.json()
      } catch (e) { /* ignore */ }
      return { ...a, subareas: [] }
    }))

    const ramasDetailed = await Promise.all(ramasList.map(async (r: any) => {
      try {
        const res = await fetch(`${API_BASE}/api/ramas/${r.id}`)
        if (res.ok) return await res.json()
      } catch (e) { /* ignore */ }
      return { ...r, subramas: [] }
    }))

    areas.value = areasDetailed
    ramas.value = ramasDetailed
  } catch (err) {
    console.error('Error fetching catalogs:', err)
    showToast('Error conectando con el servidor', 'error', 'Error')
  }
}

const viewCatalogo = (catalogo: Catalogo, type: CatalogoType) => {
  viewType.value = type
  viewCatalogoData.value = {
    ...catalogo,
    subitems: type === 'area' ? catalogo.subareas : catalogo.subramas
  }
  showViewModal.value = true
}

const openCreateModal = (type: CatalogoType) => {
  isEditing.value = false
  modalType.value = type
  catalogoForm.value = {
    id: null,
    nombre: '',
    icon: '',
    subitems: []
  }
  currentStep.value = 1
  errors.value = {}
  showCatalogoModal.value = true
}

const openEditModal = (catalogo: Catalogo, type: CatalogoType) => {
  isEditing.value = true
  modalType.value = type
  catalogoForm.value = {
    id: catalogo.id,
    nombre: catalogo.nombre,
    icon: (catalogo as any).icon || '',
    subitems: type === 'area' ? catalogo.subareas || [] : catalogo.subramas || []
  }
  currentStep.value = 1
  errors.value = {}
  showCatalogoModal.value = true
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const validateStep = (step: number): boolean => {
  errors.value = {}

  if (step === 1) {
    if (!catalogoForm.value.nombre.trim()) {
      errors.value.nombre = 'El nombre es requerido'
    }
  }

  if (step === 2) {
    catalogoForm.value.subitems.forEach((item, index) => {
      if (!item.nombre.trim()) {
        errors.value[`subitem${index}`] = 'El nombre es requerido'
      }
    })
  }

  return Object.keys(errors.value).length === 0
}

const addSubitem = () => {
  catalogoForm.value.subitems.push({ nombre: '' })
}

const removeSubitem = async (index: number) => {
  const item = catalogoForm.value.subitems[index]

  // Si el subitem tiene id y estamos editando, pedir al backend que lo elimine
  if (item && (item as any).id && isEditing.value) {
    try {
      const token = getAuthToken()
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      if (modalType.value === 'area') {
        const res = await fetch(`${API_BASE}/api/areas/subareas/${(item as any).id}`, { method: 'DELETE', headers })
        if (!res.ok) throw new Error('Error eliminando subárea')

        // actualizar estado local de areas
        if (catalogoForm.value.id) {
          const areaIndex = areas.value.findIndex(a => a.id === catalogoForm.value.id)
          if (areaIndex !== -1) {
            areas.value[areaIndex].subareas = (areas.value[areaIndex].subareas || []).filter((s:any) => s.id !== (item as any).id)
          }
        }
        showToast('Subárea eliminada', 'success', 'Eliminado')
      } else {
          const res = await fetch(`${API_BASE}/api/ramas/subramas/${(item as any).id}`, { method: 'DELETE', headers })
        if (!res.ok) throw new Error('Error eliminando subrama')

        if (catalogoForm.value.id) {
          const ramaIndex = ramas.value.findIndex(r => r.id === catalogoForm.value.id)
          if (ramaIndex !== -1) {
            ramas.value[ramaIndex].subramas = (ramas.value[ramaIndex].subramas || []).filter((s:any) => s.id !== (item as any).id)
          }
        }
        showToast('Subrama eliminada', 'success', 'Eliminado')
      }
    } catch (err) {
      console.error('Error eliminando subitem:', err)
      showToast('No se pudo eliminar el subitem', 'error', 'Error')
      return
    }
  }

  // Remover del formulario (local)
  catalogoForm.value.subitems.splice(index, 1)
}

const submitCatalogo = async () => {
  if (!validateStep(currentStep.value)) {
    return
  }

  isSubmitting.value = true

    try {
      const token = getAuthToken()
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      if (modalType.value === 'area') {
        // Create or update area
        let areaId = catalogoForm.value.id
        if (isEditing.value && areaId) {
          await fetch(`${API_BASE}/api/areas/${areaId}`, { method: 'PUT', headers, body: JSON.stringify({ nombre: catalogoForm.value.nombre, icon: catalogoForm.value.icon }) })
        } else {
          const res = await fetch(`${API_BASE}/api/areas`, { method: 'POST', headers, body: JSON.stringify({ nombre: catalogoForm.value.nombre, icon: catalogoForm.value.icon }) })
          if (!res.ok) throw new Error('Error creando área')
          const created = await res.json()
          areaId = created.id
        }

        // Sync subareas: create/update/delete
        const existing = (areas.value.find(a => a.id === areaId)?.subareas || []).map((s:any) => s.id).filter(Boolean)
        const formIds = catalogoForm.value.subitems.map((s:any) => s.id).filter(Boolean)

        // delete removed
        for (const idToDel of existing.filter((id:any) => !formIds.includes(id))) {
          await fetch(`${API_BASE}/api/areas/subareas/${idToDel}`, { method: 'DELETE', headers })
        }

        // create or update
        for (const item of catalogoForm.value.subitems) {
          if (item.id) {
            await fetch(`${API_BASE}/api/areas/subareas/${item.id}`, { method: 'PUT', headers, body: JSON.stringify({ nombre: item.nombre }) })
          } else {
            await fetch(`${API_BASE}/api/areas/${areaId}/subareas`, { method: 'POST', headers, body: JSON.stringify({ nombre: item.nombre }) })
          }
        }

        showToast(isEditing.value ? 'Área actualizada exitosamente' : 'Área creada exitosamente', 'success', 'Área')
      } else {
        // Rama
        let ramaId = catalogoForm.value.id
        if (isEditing.value && ramaId) {
          await fetch(`${API_BASE}/api/ramas/${ramaId}`, { method: 'PUT', headers, body: JSON.stringify({ nombre: catalogoForm.value.nombre, icon: catalogoForm.value.icon }) })
        } else {
          const res = await fetch(`${API_BASE}/api/ramas`, { method: 'POST', headers, body: JSON.stringify({ nombre: catalogoForm.value.nombre, icon: catalogoForm.value.icon }) })
          if (!res.ok) throw new Error('Error creando rama')
          const created = await res.json()
          ramaId = created.id
        }

        const existing = (ramas.value.find(r => r.id === ramaId)?.subramas || []).map((s:any) => s.id).filter(Boolean)
        const formIds = catalogoForm.value.subitems.map((s:any) => s.id).filter(Boolean)

        for (const idToDel of existing.filter((id:any) => !formIds.includes(id))) {
          await fetch(`${API_BASE}/api/ramas/subramas/${idToDel}`, { method: 'DELETE', headers })
        }

        for (const item of catalogoForm.value.subitems) {
          if (item.id) {
            await fetch(`${API_BASE}/api/ramas/subramas/${item.id}`, { method: 'PUT', headers, body: JSON.stringify({ nombre: item.nombre }) })
          } else {
            await fetch(`${API_BASE}/api/ramas/${ramaId}/subramas`, { method: 'POST', headers, body: JSON.stringify({ nombre: item.nombre }) })
          }
        }

        showToast(isEditing.value ? 'Rama actualizada exitosamente' : 'Rama creada exitosamente', 'success', 'Rama')
      }

      // refresh lists
      await fetchCatalogsFromApi()
      showCatalogoModal.value = false
    } catch (err) {
      console.error('Error al guardar catálogo:', err)
      showToast('Error al guardar catálogo', 'error', 'Error')
    } finally {
      isSubmitting.value = false
    }
}

const confirmDelete = (catalogo: Catalogo, type: CatalogoType) => {
  catalogoToDelete.value = catalogo
  deleteType.value = type
}

const cancelDelete = () => {
  catalogoToDelete.value = null
}

const deleteCatalogo = async () => {
  if (!catalogoToDelete.value) return

  try {
    const token = getAuthToken()
    const headers: any = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    if (deleteType.value === 'area') {
      const res = await fetch(`${API_BASE}/api/areas/${catalogoToDelete.value.id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Error eliminando área')
      showToast('Área eliminada exitosamente', 'success', 'Área eliminada')
    } else {
      const res = await fetch(`${API_BASE}/api/ramas/${catalogoToDelete.value.id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Error eliminando rama')
      showToast('Rama eliminada exitosamente', 'success', 'Rama eliminada')
    }

    await fetchCatalogsFromApi()
    catalogoToDelete.value = null
  } catch (err) {
    console.error('Error al eliminar catálogo:', err)
    showToast('Error al eliminar catálogo', 'error', 'Error')
  }
}

const exportData = () => {
  const headers = ['Tipo', 'Nombre', 'Subitems']
  const csvData = [
    ...areas.value.map(area => [
      'Área',
      area.nombre,
      area.subareas?.map(s => s.nombre).join('; ') || ''
    ]),
    ...ramas.value.map(rama => [
      'Rama',
      rama.nombre,
      rama.subramas?.map(s => s.nombre).join('; ') || ''
    ])
  ]

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `catalogos-sena-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('Archivo CSV generado y descargado', 'success', 'Exportación completada')
}


onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Cargar datos
  fetchCatalogsFromApi()
})
</script>

<style scoped>
.admin-catalogs-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-catalogs-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header (mismo que usuarios) */

.stat-icon.active {
  background: var(--gradient-primary);
}

.stat-icon.admin {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Panel de control (mismo que usuarios) */

.type-filters {
  display: flex;
  gap: 0.5rem;
}

.type-filter-btn {
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

[data-bs-theme="dark"] .type-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray, #6C757D);
}

.type-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.type-filter-btn.active {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

[data-bs-theme="dark"] .type-filter-btn.active {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-buttons .btn-group {
  display: flex;
  gap: 0.5rem;
}

/* Tablas lado a lado */

.table-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  flex-shrink: 0;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

/* Tablas de catálogos */
.catalogs-table {
  width: 100%;
  /* use separate so rows have vertical spacing like cards */
  border-collapse: separate;
  border-spacing: 0 0.6rem; /* vertical gap between rows */
}

.catalogs-table thead tr {
  background: var(--lab-bg, #f8f9fa);
  border-bottom: none;
}

[data-bs-theme="dark"] .catalogs-table thead tr {
  background: var(--lab-bg, #1a1a1a);
}

.catalogs-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

[data-bs-theme="dark"] .catalogs-table th {
  color: var(--color-gray-dark, #ADB5BD);
}

.catalogs-table tbody tr {
  background: var(--card-bg, white);
  box-shadow: 0 8px 20px rgba(16,24,40,0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  border: none;
}

.catalogs-table tbody tr:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 34px rgba(16,24,40,0.08);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(129, 199, 132, 0.02) 100%));
}

.catalogs-table td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
}

/* Rounded corners on row cells to look like cards */
.catalogs-table tbody tr td:first-child { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
.catalogs-table tbody tr td:last-child { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }

/* Thin divider between header and rows */
.catalogs-table thead tr th { border-bottom: 1px solid var(--color-gray-light, #E9ECEF); }

/* Celdas específicas */
.nombre-cell {
  min-width: 200px;
}

.area-info, .rama-info {
  display: flex;
  flex-direction: column;
}

.area-nombre, .rama-nombre {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .area-nombre,
[data-bs-theme="dark"] .rama-nombre {
  color: var(--color-dark, #F8F9FA);
}

.area-desc, .rama-desc {
  font-size: 0.85rem;
}

/* Clickable name link and icon sizing */
.name-link {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.name-link:hover { text-decoration: underline; }
.area-nombre i, .rama-nombre i { font-size: 1.25rem; line-height: 1; }

/* Icon picker button */
.icon-picker .icon-option {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0;
}
.icon-picker .icon-option i { font-size: 1.1rem; }

.icon-catalog .icon-grid { display: flex; gap: 0.5rem; }
.icon-catalog .icon-option { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; padding: 0; }
.icon-catalog .icon-option i { font-size: 1.1rem; }

.subitems-cell {
  min-width: 150px;
}

.subitems-count {
  margin-bottom: 0.25rem;
}

.subitems-list {
  font-size: 0.85rem;
}

.actions-cell {
  min-width: 150px;
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
.action-buttons .btn-outline-danger { background: linear-gradient(90deg,#ef4444,#dc2626); color: white; border:0 }

/* Estado vacío */
.empty-state {
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
}

/* Modal styles */

.modal-body {
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

/* Stepper */
.stepper {
  position: relative;
  margin-bottom: 2rem;
}

.stepper-progress {
  height: 2px;
  background: var(--color-gray-light, #E9ECEF);
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 1;
}

.stepper-bar {
  height: 100%;
  background: var(--color-primary, #1E9E4A);
  transition: width 0.3s ease;
}

.stepper-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-gray-light, #E9ECEF);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray, #6C757D);
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  font-weight: 500;
  text-align: center;
}

.stepper-step.active .step-number {
  background: var(--color-primary, #1E9E4A);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.stepper-step.active .step-label {
  color: var(--color-primary, #1E9E4A);
  font-weight: 600;
}

.stepper-step.completed .step-number {
  background: var(--color-success, #28a745);
  color: white;
}

.stepper-step.completed .step-label {
  color: var(--color-success, #28a745);
}

/* Step Content */
.step-content {
  animation: fadeIn 0.3s ease;
}

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

.step-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .step-title {
  color: var(--color-dark, #F8F9FA);
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  display: block;
  display: flex;
  align-items: center;
}

.form-label.required::after {
  content: ' *';
  color: #dc3545;
}

.form-control, .form-select {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 0 0 0.25rem rgba(30, 158, 74, 0.25);
  outline: none;
}

.invalid-feedback {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Subitems List */
.subitem-item.panel-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  overflow: hidden;
}

[data-bs-theme="dark"] .subitem-item.panel-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

/* Alert */
.alert {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 1rem;
}

.alert-info {
  background: rgba(13, 110, 253, 0.1);
  border-color: rgba(13, 110, 253, 0.2);
  color: #0a58ca;
}

[data-bs-theme="dark"] .alert-info {
  background: rgba(13, 110, 253, 0.2);
  border-color: rgba(13, 110, 253, 0.3);
  color: #8bb9fe;
}

/* Step Navigation */
.step-navigation {
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

/* Catálogo Preview en modal view */
.catalogo-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-header h6 {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .detail-header h6 {
  color: var(--color-dark, #F8F9FA);
}

.detail-subitems h6 {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

[data-bs-theme="dark"] .detail-subitems h6 {
  color: var(--color-dark, #F8F9FA);
}

.subitems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.subitem-card {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .subitem-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.07) 100%);
  border-color: var(--color-gray-light, #2d2d2d);
}

.subitem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.subitem-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.subitem-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary, #1E9E4A);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.subitem-text {
  flex: 1;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .subitem-text {
  color: var(--color-dark, #F8F9FA);
}

/* Responsive */

@media (max-width: 992px) {

  .subitems-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {

  .stepper-steps {
    flex-direction: column;
    gap: 1.5rem;
  }

  .stepper-progress {
    display: none;
  }

  .stepper-step {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
  }

  .step-number {
    margin-bottom: 0;
  }

  /* Responsive: transform table rows into stacked cards on small screens */
  .catalogs-table thead { display: none; }
  .catalogs-table, .catalogs-table tbody, .catalogs-table tr { display: block; width: 100%; }
  .catalogs-table tbody tr { margin-bottom: 0.6rem; padding: 0.75rem; }
  .catalogs-table td { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; }
  .catalogs-table td .area-nombre, .catalogs-table td .rama-nombre { font-size: 1rem; }
  .catalogs-table td .area-desc, .catalogs-table td .rama-desc { display: none; }
  .subitems-cell, .actions-cell { width: auto; }
  .nombre-cell { margin-bottom: 0.25rem; }
}

@media (max-width: 576px) {

  .panel-body,
  .catalogs-table td,
  .catalogs-table th {
    padding: 1rem 1.25rem;
  }

  .action-buttons {
    justify-content: center;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .subitems-grid {
    grid-template-columns: 1fr;
  }
}
</style>
