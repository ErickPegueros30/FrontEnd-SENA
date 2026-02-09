<template>
  <div :data-bs-theme="currentTheme" class="admin-users-page">
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
              <i class="bi bi-people"></i> Gestión de Usuarios
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-people-fill me-2"></i>Administración de Usuarios
            </h1>
            <p class="page-subtitle">
              Gestiona usuarios, roles, permisos y estado de la plataforma
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-people"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalUsers }}</span>
                  <span class="stat-label">Usuarios</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ activeUsers }}</span>
                  <span class="stat-label">Activos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon admin">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ admins }}</span>
                  <span class="stat-label">Administradores</span>
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
                  <i class="bi bi-search me-1"></i>Buscar usuario
                </label>
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Buscar por nombre, email, usuario o empresa..."
                    @input="handleSearch"
                  >
                  <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por rol -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-person-badge me-1"></i>Filtrar por rol
                </label>
                <div class="role-filters">
                  <button
                    v-for="role in roles"
                    :key="role.value"
                    class="role-filter-btn"
                    :class="{ 'active': selectedRole === role.value }"
                    @click="toggleRoleFilter(role.value)"
                  >
                    <i :class="role.icon"></i>
                    {{ role.label }}
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
                    :class="{ 'active': selectedStatus === 'active' }"
                    @click="toggleStatusFilter('active')"
                  >
                    <i class="bi bi-check-circle"></i>
                    Activos
                  </button>
                  <button
                    class="status-filter-btn"
                    :class="{ 'active': selectedStatus === 'inactive' }"
                    @click="toggleStatusFilter('inactive')"
                  >
                    <i class="bi bi-x-circle"></i>
                    Inactivos
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
                    <i class="bi bi-plus-lg me-1"></i>Nuevo usuario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de usuarios -->
    <main class="main-content">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">
                <i class="bi bi-table me-2"></i>Usuarios del sistema
              </h4>
              <p class="table-subtitle">
                Mostrando {{ filteredUsers.length }} de {{ users.length }} usuarios
              </p>
            </div>

            <div class="table-actions">
              <div class="pagination-info">
                <span class="text-muted">Usuarios por página:</span>
                <select v-model="itemsPerPage" class="form-select form-select-sm ms-2" style="width: auto;">
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>

              <div class="view-options">
                <button class="btn btn-sm btn-outline-secondary" title="Vista compacta">
                  <i class="bi bi-list"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" title="Vista detallada">
                  <i class="bi bi-grid-3x3-gap"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="users-table">
              <thead>
                <tr>
                  <th class="user-column">Usuario</th>
                  <th class="email-column">Correo electrónico</th>
                  <th class="role-column">Rol</th>
                  <th class="date-column">Última actividad</th>
                  <th class="status-column">Estado</th>
                  <th class="actions-column">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id">
                  <!-- Información del usuario -->
                  <td class="user-cell">
                    <div class="user-avatar">
                      <div v-if="user.avatar" class="avatar-image">
                          <img :src="getAvatarSrc(user)" :alt="user.name" @error="onAvatarError(user)">
                        </div>
                      <div v-else class="avatar-initials" :style="{ background: user.color }">
                        {{ getInitials(user.name) }}
                      </div>
                      <div class="user-status-indicator" :class="user.active ? 'online' : 'offline'"></div>
                    </div>
                    <div class="user-info">
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-meta">
                        <span class="meta-item">
                          <i class="bi bi-person-badge me-1"></i>{{ user.username }}
                        </span>
                        <span v-if="user.company" class="meta-item">
                          <i class="bi bi-building me-1"></i>{{ user.company }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Email -->
                  <td class="email-cell">
                    <a :href="`mailto:${user.email}`" class="email-link">
                      <i class="bi bi-envelope me-1"></i>{{ user.email }}
                    </a>
                  </td>

                  <!-- Rol -->
                  <td class="role-cell">
                    <span class="role-badge" :class="getRoleClass(user.role)">
                      <i :class="getRoleIcon(user.role)"></i>
                      {{ user.role }}
                    </span>
                    <div v-if="user.permissions" class="permissions">
                      <small class="text-muted">{{ user.permissions }}</small>
                    </div>
                  </td>

                  <!-- Última actividad -->
                  <td class="date-cell">
                    <div class="last-activity">
                      <i class="bi bi-clock-history me-1"></i>
                      <span>{{ formatLastActivity(user.lastActivity) }}</span>
                    </div>
                    <div v-if="user.loginCount" class="login-count">
                      <small class="text-muted">{{ user.loginCount }} logins</small>
                    </div>
                  </td>

                  <!-- Estado -->
                  <td class="status-cell">
                    <div class="status-toggle">
                      <div class="form-check form-switch">
                        <input
                          :id="`status-toggle-${user.id}`"
                          v-model="user.active"
                          type="checkbox"
                          class="form-check-input"
                          :disabled="user.updating"
                          @change="toggleUserStatus(user)"
                        >
                        <label :for="`status-toggle-${user.id}`" class="form-check-label">
                          <span class="status-label" :class="user.active ? 'active' : 'inactive'">
                            {{ user.active ? 'Activo' : 'Inactivo' }}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div v-if="user.lastLogin" class="last-login">
                      <small class="text-muted">
                        Último login: {{ formatDate(user.lastLogin) }}
                      </small>
                    </div>
                  </td>

                  <!-- Acciones -->
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="viewUser(user)"
                        title="Ver detalles"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-warning"
                        @click="openEditModal(user)"
                        title="Editar usuario"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <!-- impersonate button removed -->
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="confirmDelete(user)"
                        title="Eliminar usuario"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Estado vacío -->
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="empty-state">
                    <div class="empty-content">
                      <i class="bi bi-people empty-icon"></i>
                      <h5>No se encontraron usuarios</h5>
                      <p class="text-muted">
                        No hay usuarios que coincidan con los filtros aplicados
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
              <nav aria-label="Paginación de usuarios">
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
                  Mostrando {{ startItem }}-{{ endItem }} de {{ filteredUsers.length }} usuarios
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="userToDelete" class="modal-backdrop show" @click="cancelDelete"></div>
    <div v-if="userToDelete" class="modal show d-block" tabindex="-1">
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

            <div class="user-preview">
              <div class="preview-avatar">
                <div v-if="userToDelete.avatar" class="avatar-image">
                  <img :src="getAvatarSrc(userToDelete)" :alt="userToDelete.name" @error="onAvatarError(userToDelete)">
                </div>
                <div v-else class="avatar-initials" :style="{ background: userToDelete.color }">
                  {{ getInitials(userToDelete.name) }}
                </div>
              </div>
              <div class="preview-info">
                <h6>{{ userToDelete.name }}</h6>
                <p class="text-muted mb-1">{{ userToDelete.email }}</p>
                <p class="mb-0">
                  <span class="badge" :class="getRoleClass(userToDelete.role)">
                    {{ userToDelete.role }}
                  </span>
                </p>
              </div>
            </div>

            <p class="mt-3">
              ¿Estás seguro de que deseas eliminar permanentemente este usuario?
              Se perderán todos los datos asociados.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteUser">
              <i class="bi bi-trash me-1"></i>Sí, eliminar usuario
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Usuario -->
    <div v-if="showCreateModal" class="modal-backdrop show" @click="showCreateModal = false"></div>
    <div v-if="showCreateModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-person-plus me-2"></i>Crear usuario</h5>
            <button type="button" class="btn-close" @click="showCreateModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Nombre</label>
              <input v-model="createForm.nombre" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Primer apellido</label>
              <input v-model="createForm.primer_apellido" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Segundo apellido</label>
              <input v-model="createForm.segundo_apellido" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Rol</label>
              <select v-model="createForm.id_rol" class="form-select">
                <option value="A">Administrador</option>
                <option value="E">Empleado</option>
                <option value="C">Cliente</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">Correo</label>
              <input v-model="createForm.correo" type="email" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Contraseña</label>
              <input v-model="createForm.contrasena" type="password" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showCreateModal = false">Cancelar</button>
            <button class="btn btn-primary" @click="submitCreate">Crear</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Usuario -->
    <div v-if="showEditModal" class="modal-backdrop show" @click="showEditModal = false"></div>
    <div v-if="showEditModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Editar usuario</h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Nombre</label>
              <input v-model="editForm.nombre" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Primer apellido</label>
              <input v-model="editForm.primer_apellido" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Segundo apellido</label>
              <input v-model="editForm.segundo_apellido" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Rol</label>
              <select v-model="editForm.id_rol" class="form-select">
                <option value="A">Administrador</option>
                <option value="E">Empleado</option>
                <option value="C">Cliente</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">Correo</label>
              <input v-model="editForm.correo" type="email" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showEditModal = false">Cancelar</button>
            <button class="btn btn-primary" @click="submitEdit">Guardar cambios</button>
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

interface User {
  id: number
  name: string
  username: string
  email: string
  role: string
  permissions?: string
  active: boolean
  avatar?: string
  color: string
  company?: string
  lastActivity?: string | null
  lastLogin?: string
  loginCount?: number
  createdAt: string
}

interface Role {
  value: string
  label: string
  icon: string
  color: string
}

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// API base
const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'

// Estado de datos
const users = ref<User[]>([
  {
    id: 1,
    name: 'Ana Pérez',
    username: 'ana.perez',
    email: 'ana.perez@sena.com',
    role: 'Administrador',
    permissions: 'Acceso completo',
    active: true,
    color: '#1E9E4A',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-15T09:12:00',
    lastLogin: '2024-01-15T08:30:00',
    loginCount: 128,
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    name: 'Carlos Gómez',
    username: 'carlos.gomez',
    email: 'carlos.gomez@sena.com',
    role: 'Técnico Senior',
    permissions: 'Análisis, Reportes',
    active: true,
    color: '#4CAF50',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-14T17:01:00',
    lastLogin: '2024-01-14T16:45:00',
    loginCount: 95,
    createdAt: '2023-03-20'
  },
  {
    id: 3,
    name: 'Lucía Martínez',
    username: 'lucia.martinez',
    email: 'lucia.martinez@cliente.com',
    role: 'Cliente Premium',
    permissions: 'Consulta resultados',
    active: false,
    color: '#FF9800',
    company: 'Laboratorio Químico Avanzado',
    lastActivity: '2024-01-13T14:30:00',
    lastLogin: '2024-01-12T10:15:00',
    loginCount: 42,
    createdAt: '2023-06-10'
  },
  {
    id: 4,
    name: 'Diego Ramírez',
    username: 'diego.ramirez',
    email: 'diego.ramirez@sena.com',
    role: 'Técnico Junior',
    permissions: 'Análisis básicos',
    active: true,
    color: '#2196F3',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-15T08:40:00',
    lastLogin: '2024-01-15T08:00:00',
    loginCount: 67,
    createdAt: '2023-09-05'
  },
  {
    id: 5,
    name: 'Valeria Ruiz',
    username: 'valeria.ruiz',
    email: 'valeria.ruiz@empresa.com',
    role: 'Cliente',
    permissions: 'Consulta básica',
    active: true,
    color: '#9C27B0',
    company: 'Empresa Analítica S.A.',
    lastActivity: '2024-01-12T16:20:00',
    lastLogin: '2024-01-12T16:00:00',
    loginCount: 23,
    createdAt: '2023-11-20'
  },
  {
    id: 6,
    name: 'Roberto Sánchez',
    username: 'roberto.sanchez',
    email: 'roberto.sanchez@institucion.edu',
    role: 'Investigador',
    permissions: 'Consulta avanzada, Descarga',
    active: true,
    color: '#607D8B',
    company: 'Universidad Nacional',
    lastActivity: '2024-01-14T11:45:00',
    lastLogin: '2024-01-14T11:30:00',
    loginCount: 56,
    createdAt: '2023-08-15'
  },
  {
    id: 7,
    name: 'María González',
    username: 'maria.gonzalez',
    email: 'maria.gonzalez@sena.com',
    role: 'Administrador',
    permissions: 'Acceso completo',
    active: true,
    color: '#1E9E4A',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-15T10:30:00',
    lastLogin: '2024-01-15T09:45:00',
    loginCount: 112,
    createdAt: '2022-12-01'
  }
])

// Filtros y búsqueda
const searchQuery = ref('')
const selectedRole = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)

// Roles disponibles (según base de datos: id_rol => label)
const roles: Role[] = [
  { value: 'A', label: 'Administrador', icon: 'bi bi-shield-check', color: 'bg-success' },
  { value: 'E', label: 'Empleado', icon: 'bi bi-person-badge', color: 'bg-primary' },
  { value: 'C', label: 'Cliente', icon: 'bi bi-people', color: 'bg-warning' }
]

const roleLabelFromId = (id: string | null) => {
  if (!id) return ''
  const r = roles.find(x => x.value === id)
  return r ? r.label : id
}

const roleIdFromLabel = (label: string) => {
  const r = roles.find(x => x.label === label)
  return r ? r.value : label
}

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Estado para eliminar usuario
const userToDelete = ref<User | null>(null)

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const roleCounts = computed(() => {
  const map: Record<string, number> = {}
  users.value.forEach(u => {
    const k = (u as any).roleId || roleIdFromLabel(u.role) || 'unknown'
    map[k] = (map[k] || 0) + 1
  })
  return map
})

const hasActiveFilters = computed(() => !!(searchQuery.value || selectedRole.value || selectedStatus.value))

const matchesRole = (user: any, roleId: string | null) => {
  if (!roleId) return true
  if (user.roleId) return user.roleId === roleId
  // fallback: compare label
  return user.role === roleLabelFromId(roleId)
}

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return users.value.filter(user => {
    // Filtro por búsqueda
    const matchesSearch = !query ||
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.company && user.company.toLowerCase().includes(query))

    // Filtro por rol (use roleId when available)
    const matchesRoleRes = matchesRole(user, selectedRole.value)

    // Filtro por estado
    const matchesStatus = !selectedStatus.value ||
      (selectedStatus.value === 'active' && user.active) ||
      (selectedStatus.value === 'inactive' && !user.active)

    return matchesSearch && matchesRoleRes && matchesStatus
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage.value))
)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
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

// Estadísticas
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.active).length)
const admins = computed(() => users.value.filter(u => u.role === 'Administrador').length)

// Paginación helpers
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length)
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

// Métodos
const handleSearch = () => {
  currentPage.value = 1
}

const toggleRoleFilter = (role: string) => {
  selectedRole.value = selectedRole.value === role ? null : role
  currentPage.value = 1
}

const toggleStatusFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedRole.value = null
  selectedStatus.value = null
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const getRoleClass = (role: string): string => {
  const roleMap: Record<string, string> = {
    'Administrador': 'bg-success text-white',
    'Técnico Senior': 'bg-primary text-white',
    'Técnico Junior': 'bg-info text-white',
    'Investigador': 'bg-secondary text-white',
    'Cliente Premium': 'bg-warning text-dark',
    'Cliente': 'bg-warning text-dark'
  }
  return roleMap[role] || 'bg-light text-dark'
}

const getRoleIcon = (role: string): string => {
  const iconMap: Record<string, string> = {
    'Administrador': 'bi bi-shield-check',
    'Técnico Senior': 'bi bi-person-badge',
    'Técnico Junior': 'bi bi-person',
    'Investigador': 'bi bi-mortarboard',
    'Cliente Premium': 'bi bi-star-fill',
    'Cliente': 'bi bi-people'
  }
  return iconMap[role] || 'bi bi-person'
}

const formatLastActivity = (dateString: string): string => {
  if (!dateString) return 'Sin actividad'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return `Hace ${diffMins} min`
  } else if (diffHours < 24) {
    return `Hace ${diffHours} h`
  } else if (diffDays < 7) {
    return `Hace ${diffDays} d`
  } else {
    return date.toLocaleDateString('es-ES')
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

const getAvatarSrc = (u: any) => {
  // Helper: generate SVG data URL with initials
  const createInitialsDataUrl = (name: string | undefined | null, size = 128, bg = '#a7b729', color = '#FFFFFF') => {
    const initialsText = (name || 'U').toString().trim().split(' ').filter(Boolean).map(s => s[0]).join('').toUpperCase().substring(0,2) || 'U'
    const fontSize = Math.floor(size * 0.45)
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>` +
      `<rect width='100%' height='100%' fill='${bg}' rx='${Math.floor(size*0.12)}'/>` +
      `<text x='50%' y='50%' dy='0.35em' font-family='Inter, system-ui, Arial, sans-serif' font-size='${fontSize}' fill='${color}' text-anchor='middle' dominant-baseline='middle' font-weight='700'>${initialsText}</text>` +
      `</svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  if (!u) return createInitialsDataUrl('U')
  const name = u.name || u.nombre || ''
  // If explicit avatar provided, normalize path
  if (u.avatar) {
    try {
      if (u.avatar.startsWith('/')) return `${API_BASE}${u.avatar}`
    } catch (e) { /* ignore */ }
    return u.avatar
  }
  // No avatar -> return initials image data URL
  return createInitialsDataUrl(name)
}

const onAvatarError = (u: any) => {
  // When image fails to load, clear external avatar so UI falls back to initials image
  if (!u) return
  try { u.avatar = undefined } catch (e) { /* ignore */ }
}

const fetchUsersFromApi = async () => {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/users`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (!resp.ok) {
      const b = await resp.json().catch(() => ({}))
      showToast(b.message || 'Error al obtener usuarios', 'error', 'Error')
      return
    }
    const body = await resp.json()
    const rows = body.data || []
    users.value = rows.map((r: any, idx: number) => ({
      id: r.id_usuario || r.id_credencial || idx + 1,
      name: `${r.nombre || ''} ${r.primer_apellido || ''} ${r.segundo_apellido || ''}`.trim(),
      username: r.id_usuario || r.correo || '',
      email: r.correo || r.email || '',
      roleId: r.id_rol || null,
      role: roleLabelFromId(r.id_rol) || r.role || 'Usuario',
      permissions: '',
      // backend may return `active` (mapped server-side) or raw `activo` from SQL
      active: (r.active !== undefined) ? !!r.active : (r.activo !== undefined ? !!r.activo : true),
      backendId: r.id_usuario || null,
      updating: false,
      color: '#6c757d',
      // Map backend profile photo to avatar (may be stored as /uploads/avatars/..)
      avatar: r.foto_perfil ?? r.avatarUrl ?? r.fotoPerfil ?? undefined,
      company: r.empresa || r.company || '',
      lastActivity: r.ultima_actividad ? String(r.ultima_actividad) : null,
      lastLogin: r.ultima_actividad ? String(r.ultima_actividad) : undefined,
      loginCount: 0,
      createdAt: ''
    }))
  } catch (err) {
    console.error('fetchUsersFromApi error', err)
    showToast('Error conectando con el servidor', 'error', 'Error')
  }
}

const toggleUserStatus = async (user: User) => {
  const token = getAuthToken()
  if (!token) {
    showToast('No autenticado. Por favor inicia sesión.', 'warning', 'Autenticación')
    // revert UI if it was toggled
    user.active = !user.active
    return
  }

  const prevState = !user.active // because v-model already toggled it
  const newState = user.active
  const idToUse = (user as any).backendId || user.id || user.username

  ;(user as any).updating = true
  try {
    const resp = await fetch(`${API_BASE}/api/users/${idToUse}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ active: newState })
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      showToast(body.message || 'No se pudo actualizar el estado', 'error', 'Error')
      // revert toggle locally
      user.active = prevState
      return
    }

    // Use server-confirmed state when available
    if (body && body.data && typeof body.data.active !== 'undefined') {
      user.active = !!body.data.active
    } else {
      user.active = !!newState
    }

    showToast('Estado actualizado', 'success', 'Estado actualizado')
  } catch (err) {
    console.error('toggleUserStatus error', err)
    user.active = prevState
    showToast('Error conectando con el servidor', 'error', 'Error')
  } finally {
    ;(user as any).updating = false
  }
}

const viewUser = (user: any) => {
  const id = user.backendId || user.id
  router.push(`/admin/usuarios/${id}`)
}

const editUser = (user: any) => {
  const id = user.backendId || user.id
  router.push(`/admin/usuarios/${id}/editar`)
}

// impersonateUser removed

const confirmDelete = (user: User) => {
  userToDelete.value = user
}

const cancelDelete = () => {
  userToDelete.value = null
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  const token = getAuthToken()
  if (!token) {
    showToast('No autenticado. Por favor inicia sesión.', 'warning', 'Autenticación')
    return
  }
  try {
    const idToUse = (userToDelete.value as any).backendId || userToDelete.value.id || userToDelete.value.username
    const resp = await fetch(`${API_BASE}/api/users/${idToUse}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      showToast(body.message || 'No se pudo eliminar el usuario', 'error', 'Error')
      return
    }
    users.value = users.value.filter(u => ((u as any).backendId || u.id) !== (userToDelete.value!.backendId || userToDelete.value!.id))
    showToast(`Usuario "${userToDelete.value.name}" eliminado`, 'success', 'Usuario eliminado')
    userToDelete.value = null
  } catch (err) {
    console.error('deleteUser error', err)
    showToast('Error conectando con el servidor', 'error', 'Error')
  }
}

// Create / Edit modals state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const createForm = ref({
  nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  id_rol: 'C',
  correo: '',
  contrasena: ''
})
const editForm = ref({
  id: '',
  nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  id_rol: '',
  correo: ''
})

const openCreateModal = () => {
  createForm.value = { nombre: '', primer_apellido: '', segundo_apellido: '', id_rol: 'C', correo: '', contrasena: '' }
  showCreateModal.value = true
}

const submitCreate = async () => {
  const token = getAuthToken()
  if (!token) { showToast('No autenticado.', 'warning'); return }
  try {
    const resp = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(createForm.value)
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) { showToast(body.message || 'Error creando usuario', 'error'); return }
    showToast('Usuario creado', 'success', 'Creación')
    showCreateModal.value = false
    await fetchUsersFromApi()
  } catch (err) { console.error('submitCreate error', err); showToast('Error conectando con el servidor', 'error') }
}

const openEditModal = async (u: User) => {
  const token = getAuthToken()
  if (!token) { showToast('No autenticado.', 'warning'); return }
  try {
    const idToUse = (u as any).backendId || u.id || u.username
    const resp = await fetch(`${API_BASE}/api/users/${idToUse}`, { headers: { Authorization: `Bearer ${token}` } })
    if (!resp.ok) { showToast('No se pudo cargar el usuario', 'error'); return }
    const body = await resp.json()
    const r = body.data
    editForm.value = {
      id: r.id_usuario || u.id,
      nombre: r.nombre || '',
      primer_apellido: r.primer_apellido || '',
      segundo_apellido: r.segundo_apellido || '',
      id_rol: r.id_rol || '',
      correo: r.correo || ''
    }
    showEditModal.value = true
  } catch (err) { console.error('openEditModal error', err); showToast('Error conectando con el servidor', 'error') }
}

const submitEdit = async () => {
  const token = getAuthToken()
  if (!token) { showToast('No autenticado.', 'warning'); return }
  try {
    const resp = await fetch(`${API_BASE}/api/users/${editForm.value.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editForm.value)
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) { showToast(body.message || 'Error actualizando usuario', 'error'); return }
    showToast('Usuario actualizado', 'success', 'Edición')
    showEditModal.value = false
    await fetchUsersFromApi()
  } catch (err) { console.error('submitEdit error', err); showToast('Error conectando con el servidor', 'error') }
}

const goCreate = () => {
  router.push('/admin/usuarios/nuevo')
}

const exportData = () => {
  const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Empresa', 'Última actividad']
  const csvData = users.value.map(user => [
    user.id,
    user.name,
    user.email,
    user.role,
    user.active ? 'Activo' : 'Inactivo',
    user.company || '',
    user.lastActivity
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `usuarios-sena-${new Date().toISOString().split('T')[0]}.csv`
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
  // Cargar usuarios desde la API
  fetchUsersFromApi()
})
</script>

<style scoped>
.admin-users-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .admin-users-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */
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

.role-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-filter-btn {
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

[data-bs-theme="dark"] .role-filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray, #6C757D);
}

.role-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.role-filter-btn.active {
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
}

/* Tabla principal */
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

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

/* Tabla de usuarios */
.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead tr {
  background: var(--lab-bg, #f8f9fa);
  border-bottom: 2px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .users-table thead tr {
  background: var(--lab-bg, #1a1a1a);
  border-bottom: 2px solid var(--color-gray-light, #2d2d2d);
}

.users-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-gray-dark, #495057);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

[data-bs-theme="dark"] .users-table th {
  color: var(--color-gray-dark, #ADB5BD);
}

.users-table tbody tr {
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  transition: background-color 0.3s ease;
}

.users-table tbody tr:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .users-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.users-table td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
}

/* Celdas específicas */
.user-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 250px;
}

.user-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-light, white);
}

.user-status-indicator.online {
  background: var(--color-success, #28a745);
}

.user-status-indicator.offline {
  background: var(--color-gray, #6c757d);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-bs-theme="dark"] .user-name {
  color: var(--color-dark, #F8F9FA);
}

.user-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.meta-item {
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.email-cell {
  min-width: 200px;
}

.email-link {
  color: var(--color-primary, #1E9E4A);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.3s ease;
}

.email-link:hover {
  color: var(--color-primary-dark, #0A8F3A);
  text-decoration: underline;
}

.role-cell {
  min-width: 150px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.permissions {
  margin-top: 0.25rem;
}

.date-cell {
  min-width: 150px;
}

.last-activity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .last-activity {
  color: var(--color-dark, #F8F9FA);
}

.login-count {
  margin-top: 0.25rem;
}

.status-cell {
  min-width: 150px;
}

.status-toggle {
  display: flex;
  align-items: center;
}

.form-check-input:checked {
  background-color: var(--color-primary, #1E9E4A);
  border-color: var(--color-primary, #1E9E4A);
}

.status-label {
  font-weight: 500;
  font-size: 0.9rem;
}

.status-label.active {
  color: var(--color-success, #28a745);
}

.status-label.inactive {
  color: var(--color-gray, #6c757d);
}

.last-login {
  margin-top: 0.25rem;
}

.actions-cell {
  min-width: 200px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Estado vacío */
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

/* Pie de tabla */
.table-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
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

.page-item.disabled .page-link {
  color: var(--color-gray, #6C757D);
  background: var(--lab-bg, #f8f9fa);
  border-color: var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .page-item.disabled .page-link {
  background: var(--lab-bg, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

/* Modal */
.modal-backdrop {
  opacity: 0.5;
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

.user-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 12px;
  margin: 1rem 0;
}

[data-bs-theme="dark"] .user-preview {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.preview-avatar {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.preview-avatar .avatar-image,
.preview-avatar .avatar-initials {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.preview-info h6 {
  margin: 0 0 0.25rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .preview-info h6 {
  color: var(--color-dark, #F8F9FA);
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

  .users-table {
    min-width: 1000px;
  }

  .table-responsive {
    overflow-x: auto;
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

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .user-meta {
    flex-direction: column;
    gap: 0.25rem;
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
  .users-table td,
  .users-table th,
  .table-footer {
    padding: 1rem 1.25rem;
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

  .action-buttons {
    justify-content: center;
  }
}
/* Final visual polish: improved spacing, card rows on mobile, stronger action colors */
.action-buttons .btn {
  border-radius: 10px;
  padding: 0.45rem 0.6rem;
  font-size: 0.92rem;
}

.action-buttons .btn i { margin: 0; }

.action-buttons .btn-outline-primary { border-color: rgba(16,24,40,0.06); color: #0f172a }
.action-buttons .btn-outline-warning { background: linear-gradient(90deg,#f59e0b,#f97316); color: white; border:0 }
.action-buttons .btn-outline-danger { background: linear-gradient(90deg,#ef4444,#dc2626); color: white; border:0 }

/* Make table rows look like cards on smaller screens */
@media (max-width: 992px) {
  .users-table thead { display: none }
  .users-table, .users-table tbody, .users-table tr, .users-table td { display: block; width: 100% }
  .users-table tr { background: rgba(255,255,255,0.85); margin-bottom: 12px; border-radius: 12px; padding: 12px; box-shadow: 0 8px 24px rgba(12,18,30,0.06); border: 1px solid rgba(10,15,30,0.04) }
  .users-table td { padding: 0.5rem 0; display: flex; align-items: center; gap: 0.75rem }
  .user-cell { min-width: 0 }
  .actions-cell { display:flex; justify-content:flex-end }
}

/* Modal polish */
.modal-backdrop.show { backdrop-filter: blur(3px); background: rgba(0,0,0,0.35) }
.modal-content { background: rgba(255,255,255,0.9); border: 0; border-radius: 14px }
.modal-header { border-bottom: 1px solid rgba(10,15,30,0.04) }

/* Toast improvements */
.toast { border-radius: 10px; box-shadow: 0 8px 24px rgba(12,18,30,0.08) }

/* subtle animated accents */
.stat-card, .panel-card, .table-card { transition: transform .18s ease, box-shadow .18s ease }
.stat-card:hover, .panel-card:hover, .table-card:hover { transform: translateY(-4px); box-shadow: 0 18px 38px rgba(12,18,30,0.08) }

/* Improve contrast for dark mode overrides */
[data-bs-theme="dark"] .panel-card,
[data-bs-theme="dark"] .table-card,
[data-bs-theme="dark"] .stat-card { background: rgba(24,24,26,0.55); border: 1px solid rgba(255,255,255,0.04) }

</style>
