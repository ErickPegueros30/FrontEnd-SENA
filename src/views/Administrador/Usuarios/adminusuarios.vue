<template>
  <div :data-bs-theme="currentTheme" class="admin-users-page">
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
              <i class="bi bi-people"></i> Gestión de Usuarios
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <span class="section-eyebrow">Administración</span>
            <h1 class="page-title">Gestión de Usuarios</h1>
            <p class="page-subtitle">Administra usuarios, roles y permisos del sistema</p>
          </div>

          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-icon users">
                <i class="bi bi-people-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ totalUsers }}</span>
                <span class="stat-label">Total Usuarios</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon active">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ activeUsers }}</span>
                <span class="stat-label">Activos</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon admin">
                <span class="icon-glyph" aria-hidden="true">✔</span>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ admins }}</span>
                <span class="stat-label">Administradores</span>
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
                    placeholder="Buscar por nombre, email, usuario o empresa..."
                    @input="handleSearch"
                  />
                  <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''; handleSearch()">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>

              <!-- Filtro por rol -->
              <div class="filter-group">
                <div class="filter-chips">
                  <button
                    v-for="role in roles"
                    :key="role.value"
                    class="filter-chip"
                    :class="{ 'active': selectedRole === role.value }"
                    @click="toggleRoleFilter(role.value)"
                  >
                    <i :class="role.icon"></i>
                    <span>{{ role.label }}</span>
                    <span class="chip-count">{{ getRoleCount(role.value) }}</span>
                  </button>
                </div>
              </div>

              <!-- Filtro por estado -->
              <div class="filter-group">
                <div class="filter-chips">
                  <button
                    class="filter-chip"
                    :class="{ 'active': selectedStatus === 'active' }"
                    @click="toggleStatusFilter('active')"
                  >
                    <i class="bi bi-check-circle"></i>
                    <span>Activos</span>
                    <span class="chip-count">{{ activeUsersCount }}</span>
                  </button>
                  <button
                    class="filter-chip"
                    :class="{ 'active': selectedStatus === 'inactive' }"
                    @click="toggleStatusFilter('inactive')"
                  >
                    <i class="bi bi-x-circle"></i>
                    <span>Inactivos</span>
                    <span class="chip-count">{{ inactiveUsersCount }}</span>
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
                  <span>Nuevo Usuario</span>
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
              <span v-if="selectedRole" class="active-filter-tag">
                Rol: {{ getRoleLabel(selectedRole) }}
                <button @click="selectedRole = null; handleSearch()"><i class="bi bi-x"></i></button>
              </span>
              <span v-if="selectedStatus" class="active-filter-tag">
                Estado: {{ selectedStatus === 'active' ? 'Activos' : 'Inactivos' }}
                <button @click="selectedStatus = null; handleSearch()"><i class="bi bi-x"></i></button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de usuarios -->
    <main class="table-section">
      <div class="container">
        <div class="table-card">
          <div class="table-header">
            <div class="table-info">
              <h4 class="table-title">Usuarios del Sistema</h4>
              <p class="table-subtitle">
                Mostrando {{ paginatedUsers.length }} de {{ filteredUsers.length }} usuarios
                <span v-if="filteredUsers.length !== users.length">
                  (filtrado de {{ users.length }})
                </span>
              </p>
            </div>

            <div class="table-controls">
              <div class="bulk-actions" v-if="selectedUsers.length > 0">
                <span class="selected-count">{{ selectedUsers.length }} seleccionados</span>
                <button class="action-btn secondary" @click="bulkActivate">
                  <i class="bi bi-check-circle"></i> Activar
                </button>
                <button class="action-btn secondary" @click="bulkDeactivate">
                  <i class="bi bi-x-circle"></i> Desactivar
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
              <table class="users-table">
                <thead>
                  <tr>
                    <th class="col-user">Usuario</th>
                    <th class="col-email">Email</th>
                    <th class="col-role">Rol</th>
                    <th class="col-activity">Última Actividad</th>
                    <th class="col-status">Estado</th>
                    <th class="col-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in paginatedUsers" :key="user.id" :class="{ 'selected': isSelected(user) }">
                    <td>
                      <div class="user-cell" @click="viewUser(user)" style="cursor: pointer;">
                        <div class="user-avatar">
                          <div v-if="user.avatar" class="avatar-img">
                            <img :src="getAvatarSrc(user)" :alt="user.name" @error="onAvatarError(user)" />
                          </div>
                          <div v-else class="avatar-initials" :style="{ background: user.color || getRoleColor(user.role) }">
                            {{ getInitials(user.name) }}
                          </div>
                          <div class="status-dot" :class="user.active ? 'online' : 'offline'"></div>
                        </div>
                        <div class="user-info">
                          <span class="user-name">{{ user.name }}</span>
                          <span class="user-username">@{{ user.username }}</span>
                          <span v-if="user.company" class="user-company">{{ user.company }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a :href="`mailto:${user.email}`" class="email-link">
                        <i class="bi bi-envelope"></i> {{ user.email }}
                      </a>
                    </td>
                    <td>
                      <span class="role-badge" :class="getRoleBadgeClass(user.role)">
                        <i :class="getRoleIcon(user.role)"></i>
                        {{ user.role }}
                      </span>
                    </td>
                    <td>
                      <div class="activity-info">
                        <span class="activity-text">{{ formatLastActivity(user.lastActivity) }}</span>
                        <span v-if="user.lastLogin" class="activity-detail">
                          Último login: {{ formatDate(user.lastLogin) }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="status-toggle">
                        <button
                          class="toggle-btn"
                          :class="{ 'active': user.active }"
                          @click="toggleUserStatus(user)"
                          :disabled="user.updating"
                          :title="user.active ? 'Desactivar usuario' : 'Activar usuario'"
                        >
                          <span class="toggle-dot"></span>
                        </button>
                        <span class="status-text" :class="user.active ? 'active' : 'inactive'">
                          {{ user.active ? 'Activo' : 'Inactivo' }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="icon-btn" @click="viewUser(user)" title="Ver detalles">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button class="icon-btn" @click="openEditModal(user)" title="Editar usuario">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="icon-btn danger" @click="confirmDelete(user)" title="Eliminar usuario">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Estado vacío -->
                  <tr v-if="filteredUsers.length === 0">
                    <td colspan="7" class="empty-row">
                      <div class="empty-content">
                        <i class="bi bi-people empty-icon"></i>
                        <h5>No se encontraron usuarios</h5>
                        <p>No hay usuarios que coincidan con los filtros aplicados</p>
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
            <div v-for="user in paginatedUsers" :key="user.id" class="user-card" :class="{ 'selected': isSelected(user) }">
              <div class="card-header">
                <input
                  type="checkbox"
                  :checked="isSelected(user)"
                  @change="toggleSelectUser(user)"
                  class="table-checkbox"
                />
                <div class="user-avatar" @click="viewUser(user)">
                  <div v-if="user.avatar" class="avatar-img">
                    <img :src="getAvatarSrc(user)" :alt="user.name" @error="onAvatarError(user)" />
                  </div>
                  <div v-else class="avatar-initials" :style="{ background: user.color || getRoleColor(user.role) }">
                    {{ getInitials(user.name) }}
                  </div>
                  <div class="status-dot" :class="user.active ? 'online' : 'offline'"></div>
                </div>
                <div class="user-details" @click="viewUser(user)">
                  <h5>{{ user.name }}</h5>
                  <span class="user-email">{{ user.email }}</span>
                </div>
                <div class="card-actions">
                  <button class="icon-btn" @click="viewUser(user)" title="Ver detalles">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="icon-btn" @click="openEditModal(user)" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="icon-btn danger" @click="confirmDelete(user)" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <span class="info-label">Usuario</span>
                  <span class="info-value">@{{ user.username }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Rol</span>
                  <span class="role-badge" :class="getRoleBadgeClass(user.role)">{{ user.role }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Estado</span>
                  <div class="status-toggle">
                    <button
                      class="toggle-btn"
                      :class="{ 'active': user.active }"
                      @click="toggleUserStatus(user)"
                      :disabled="user.updating"
                    >
                      <span class="toggle-dot"></span>
                    </button>
                    <span class="status-text" :class="user.active ? 'active' : 'inactive'">
                      {{ user.active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
                <div class="info-row" v-if="user.company">
                  <span class="info-label">Empresa</span>
                  <span class="info-value">{{ user.company }}</span>
                </div>
                <div class="info-row" v-if="user.lastActivity">
                  <span class="info-label">Última actividad</span>
                  <span class="info-value">{{ formatLastActivity(user.lastActivity) }}</span>
                </div>
              </div>
            </div>

            <!-- Estado vacío móvil -->
            <div v-if="filteredUsers.length === 0" class="empty-card">
              <div class="empty-icon">
                <i class="bi bi-people"></i>
              </div>
              <h5>No se encontraron usuarios</h5>
              <p>No hay usuarios que coincidan con los filtros aplicados</p>
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
              <span>{{ startItem }}-{{ endItem }} de {{ filteredUsers.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <Teleport to="body">
      <div v-if="userToDelete" class="modal-overlay" @click.self="cancelDelete">
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
              <div class="preview-avatar">
                <div v-if="userToDelete.avatar" class="avatar-img">
                  <img :src="getAvatarSrc(userToDelete)" :alt="userToDelete.name" />
                </div>
                <div v-else class="avatar-initials" :style="{ background: userToDelete.color || getRoleColor(userToDelete.role) }">
                  {{ getInitials(userToDelete.name) }}
                </div>
              </div>
              <div class="preview-info">
                <h6>{{ userToDelete.name }}</h6>
                <p>{{ userToDelete.email }}</p>
                <span class="role-badge" :class="getRoleBadgeClass(userToDelete.role)">
                  {{ userToDelete.role }}
                </span>
              </div>
            </div>
            <p class="delete-message">
              ¿Estás seguro de que deseas eliminar permanentemente a <strong>{{ userToDelete.name }}</strong>?
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
              @click="deleteUser"
              :disabled="deleteConfirmationRequired && deleteConfirmText !== 'ELIMINAR'"
            >
              <i class="bi bi-trash"></i>
              Eliminar Usuario
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
              Eliminar Usuarios Seleccionados
            </h5>
            <button class="modal-close-btn" @click="showBulkDeleteModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="warning-box">
              <i class="bi bi-exclamation-circle-fill"></i>
              <span>Estás a punto de eliminar {{ selectedUsers.length }} usuarios. Esta acción no se puede deshacer.</span>
            </div>
            <div class="bulk-delete-list">
              <div v-for="user in selectedUsersData" :key="user.id" class="bulk-delete-item">
                <span>{{ user.name }}</span>
                <span class="text-muted">{{ user.email }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="showBulkDeleteModal = false">
              Cancelar
            </button>
            <button class="modal-btn danger" @click="confirmBulkDelete">
              <i class="bi bi-trash"></i>
              Eliminar {{ selectedUsers.length }} Usuarios
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Crear/Editar Usuario -->
    <Teleport to="body">
      <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click.self="closeModals">
        <div class="modal-container form-modal">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="showCreateModal ? 'bi bi-person-plus-fill' : 'bi bi-pencil-square'"></i>
              {{ showCreateModal ? 'Crear Nuevo Usuario' : 'Editar Usuario' }}
            </h5>
            <button class="modal-close-btn" @click="closeModals">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre *</label>
                <input
                  v-model="createEditForm.nombre"
                  type="text"
                  class="form-input"
                  placeholder="Nombre"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Primer Apellido *</label>
                <input
                  v-model="createEditForm.primer_apellido"
                  type="text"
                  class="form-input"
                  placeholder="Primer apellido"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Segundo Apellido</label>
                <input
                  v-model="createEditForm.segundo_apellido"
                  type="text"
                  class="form-input"
                  placeholder="Segundo apellido"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Rol *</label>
                <select v-model="createEditForm.id_rol" class="form-select" required>
                  <option value="">Seleccionar rol...</option>
                  <option value="A">Administrador</option>
                  <option value="E">Empleado</option>
                  <option value="C">Cliente</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Correo Electrónico *</label>
                <input
                  v-model="createEditForm.correo"
                  type="email"
                  class="form-input"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div class="form-group" v-if="showCreateModal">
                <label class="form-label">Contraseña *</label>
                <div class="password-input-wrapper">
                  <input
                    v-model="createEditForm.contrasena"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Contraseña segura"
                    required
                  />
                  <button class="password-toggle" @click="showPassword = !showPassword" type="button">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div class="password-strength" v-if="createEditForm.contrasena">
                  <div class="strength-bar">
                    <div class="strength-fill" :style="{ width: passwordStrength + '%' }" :class="strengthClass"></div>
                  </div>
                  <span class="strength-text" :class="strengthClass">{{ strengthLabel }}</span>
                </div>
              </div>
              <div class="form-group" v-if="showCreateModal">
                <label class="form-label">Confirmar Contraseña *</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-input"
                  :class="{ 'is-invalid': confirmPassword && createEditForm.contrasena !== confirmPassword }"
                  placeholder="Repetir contraseña"
                  required
                />
                <span v-if="confirmPassword && createEditForm.contrasena !== confirmPassword" class="form-error">
                  Las contraseñas no coinciden
                </span>
              </div>
              <div class="form-group">
                <label class="form-label">Empresa</label>
                <input
                  v-model="createEditForm.empresa"
                  type="text"
                  class="form-input"
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input
                  v-model="createEditForm.telefono"
                  type="tel"
                  class="form-input"
                  placeholder="+52 555 123 4567"
                />
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
              <i :class="showCreateModal ? 'bi bi-check-lg' : 'bi bi-check-lg'"></i>
              {{ showCreateModal ? 'Crear Usuario' : 'Guardar Cambios' }}
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
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'

// Tipos
type Theme = 'light' | 'dark'

interface User {
  id: number | string
  name: string
  username: string
  email: string
  role: string
  permissions?: string
  active: boolean
  avatar?: string
  color?: string
  company?: string
  lastActivity?: string | null
  lastLogin?: string
  loginCount?: number
  createdAt: string
  updating?: boolean
  backendId?: number | string
  roleId?: string
  telefono?: string
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
import { API_BASE } from '@/config/api'

// Estado de filtros
const searchQuery = ref('')
const selectedRole = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)
const showFilters = ref(true)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Selección múltiple
const selectedUsers = ref<Set<number | string>>(new Set())
const showBulkDeleteModal = ref(false)
const deleteConfirmationRequired = ref(true)
const deleteConfirmText = ref('')

// Estado para eliminar usuario individual
const userToDelete = ref<User | null>(null)

// Modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingUserId = ref<string | number | null>(null)
const showPassword = ref(false)
const confirmPassword = ref('')

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType = ref('info')
let toastTimer: ReturnType<typeof setTimeout> | null = null

// Formulario crear/editar
const createEditForm = ref({
  nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  id_rol: '',
  correo: '',
  contrasena: '',
  empresa: '',
  telefono: ''
})

// Roles
const roles: Role[] = [
  { value: 'A', label: 'Administrador', icon: 'bi bi-shield-check', color: '#5d8a2f' },
  { value: 'E', label: 'Empleado', icon: 'bi bi-person-badge', color: '#4a7b22' },
  { value: 'C', label: 'Cliente', icon: 'bi bi-people', color: '#8a9e7c' }
]

const roleLabelFromId = (id: string | null): string => {
  if (!id) return ''
  const r = roles.find(x => x.value === id)
  return r ? r.label : id
}

const roleIdFromLabel = (label: string): string => {
  const r = roles.find(x => x.label === label)
  return r ? r.value : label
}

// Datos de usuarios
const users = ref<User[]>([
  {
    id: 1,
    name: 'Ana Pérez García',
    username: 'ana.perez',
    email: 'ana.perez@sena.com',
    role: 'Administrador',
    permissions: 'Acceso completo',
    active: true,
    color: '#5d8a2f',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-15T09:12:00',
    lastLogin: '2024-01-15T08:30:00',
    loginCount: 128,
    createdAt: '2023-01-15',
    roleId: 'A'
  },
  {
    id: 2,
    name: 'Carlos Gómez López',
    username: 'carlos.gomez',
    email: 'carlos.gomez@sena.com',
    role: 'Empleado',
    permissions: 'Análisis, Reportes',
    active: true,
    color: '#4a7b22',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-14T17:01:00',
    lastLogin: '2024-01-14T16:45:00',
    loginCount: 95,
    createdAt: '2023-03-20',
    roleId: 'E'
  },
  {
    id: 3,
    name: 'Lucía Martínez Ruiz',
    username: 'lucia.martinez',
    email: 'lucia.martinez@cliente.com',
    role: 'Cliente',
    permissions: 'Consulta resultados',
    active: false,
    color: '#8a9e7c',
    company: 'Laboratorio Químico Avanzado',
    lastActivity: '2024-01-13T14:30:00',
    lastLogin: '2024-01-12T10:15:00',
    loginCount: 42,
    createdAt: '2023-06-10',
    roleId: 'C'
  },
  {
    id: 4,
    name: 'Diego Ramírez Torres',
    username: 'diego.ramirez',
    email: 'diego.ramirez@sena.com',
    role: 'Empleado',
    permissions: 'Análisis básicos',
    active: true,
    color: '#6b8a4a',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-15T08:40:00',
    lastLogin: '2024-01-15T08:00:00',
    loginCount: 67,
    createdAt: '2023-09-05',
    roleId: 'E'
  },
  {
    id: 5,
    name: 'Valeria Ruiz Medina',
    username: 'valeria.ruiz',
    email: 'valeria.ruiz@empresa.com',
    role: 'Cliente',
    permissions: 'Consulta básica',
    active: true,
    color: '#7a9a5a',
    company: 'Empresa Analítica S.A.',
    lastActivity: '2024-01-12T16:20:00',
    lastLogin: '2024-01-12T16:00:00',
    loginCount: 23,
    createdAt: '2023-11-20',
    roleId: 'C'
  },
  {
    id: 6,
    name: 'Roberto Sánchez Díaz',
    username: 'roberto.sanchez',
    email: 'roberto.sanchez@institucion.edu',
    role: 'Cliente',
    permissions: 'Consulta avanzada, Descarga',
    active: true,
    color: '#607D8B',
    company: 'Universidad Nacional',
    lastActivity: '2024-01-14T11:45:00',
    lastLogin: '2024-01-14T11:30:00',
    loginCount: 56,
    createdAt: '2023-08-15',
    roleId: 'C'
  },
  {
    id: 7,
    name: 'María González Hernández',
    username: 'maria.gonzalez',
    email: 'maria.gonzalez@sena.com',
    role: 'Administrador',
    permissions: 'Acceso completo',
    active: true,
    color: '#5d8a2f',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-15T10:30:00',
    lastLogin: '2024-01-15T09:45:00',
    loginCount: 112,
    createdAt: '2022-12-01',
    roleId: 'A'
  },
  {
    id: 8,
    name: 'Fernando López Vega',
    username: 'fernando.lopez',
    email: 'fernando.lopez@empresa.com',
    role: 'Cliente',
    permissions: 'Consulta básica',
    active: false,
    color: '#9E9E9E',
    company: 'Industrias Metálicas S.A.',
    lastActivity: '2024-01-10T09:00:00',
    lastLogin: '2024-01-09T15:30:00',
    loginCount: 15,
    createdAt: '2024-01-05',
    roleId: 'C'
  },
  {
    id: 9,
    name: 'Patricia Mendoza Castro',
    username: 'patricia.mendoza',
    email: 'patricia.mendoza@sena.com',
    role: 'Empleado',
    permissions: 'Análisis, Reportes',
    active: true,
    color: '#4a7b22',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-15T11:00:00',
    lastLogin: '2024-01-15T10:30:00',
    loginCount: 78,
    createdAt: '2023-05-20',
    roleId: 'E'
  },
  {
    id: 10,
    name: 'Jorge Castillo Rojas',
    username: 'jorge.castillo',
    email: 'jorge.castillo@cliente.com',
    role: 'Cliente',
    permissions: 'Consulta avanzada',
    active: true,
    color: '#8a9e7c',
    company: 'Laboratorio Central',
    lastActivity: '2024-01-14T15:00:00',
    lastLogin: '2024-01-14T14:45:00',
    loginCount: 34,
    createdAt: '2023-10-01',
    roleId: 'C'
  },
  {
    id: 11,
    name: 'Adriana Vega Morales',
    username: 'adriana.vega',
    email: 'adriana.vega@sena.com',
    role: 'Administrador',
    permissions: 'Acceso completo',
    active: true,
    color: '#5d8a2f',
    company: 'SENA Laboratorios',
    lastActivity: '2024-01-15T07:30:00',
    lastLogin: '2024-01-14T18:00:00',
    loginCount: 145,
    createdAt: '2022-06-15',
    roleId: 'A'
  },
  {
    id: 12,
    name: 'Oscar Núñez Paz',
    username: 'oscar.nunez',
    email: 'oscar.nunez@institucion.edu',
    role: 'Cliente',
    permissions: 'Consulta básica',
    active: false,
    color: '#9E9E9E',
    company: 'Instituto de Investigación',
    lastActivity: '2024-01-08T12:00:00',
    lastLogin: '2024-01-07T09:00:00',
    loginCount: 8,
    createdAt: '2024-01-02',
    roleId: 'C'
  }
])

// Computed
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.active).length)
const admins = computed(() => users.value.filter(u => u.roleId === 'A' || u.role === 'Administrador').length)
const activeUsersCount = computed(() => users.value.filter(u => u.active).length)
const inactiveUsersCount = computed(() => users.value.filter(u => !u.active).length)
const hasActiveFilters = computed(() => !!(searchQuery.value || selectedRole.value || selectedStatus.value))

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return users.value.filter(user => {
    const matchesSearch = !query ||
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.company && user.company.toLowerCase().includes(query))

    const roleId = user.roleId || roleIdFromLabel(user.role)
    const matchesRole = !selectedRole.value || roleId === selectedRole.value

    const matchesStatus = !selectedStatus.value ||
      (selectedStatus.value === 'active' && user.active) ||
      (selectedStatus.value === 'inactive' && !user.active)

    return matchesSearch && matchesRole && matchesStatus
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage.value)))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredUsers.value.slice(start, start + itemsPerPage.value)
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
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length))

// Selección múltiple
const isSelected = (user: User) => selectedUsers.value.has(user.id)
const isAllSelected = computed(() => {
  return paginatedUsers.value.length > 0 && paginatedUsers.value.every(u => selectedUsers.value.has(u.id))
})

const selectedUsersData = computed(() => {
  return users.value.filter(u => selectedUsers.value.has(u.id))
})

const toggleSelectUser = (user: User) => {
  const newSet = new Set(selectedUsers.value)
  if (newSet.has(user.id)) {
    newSet.delete(user.id)
  } else {
    newSet.add(user.id)
  }
  selectedUsers.value = newSet
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const newSet = new Set(selectedUsers.value)
    paginatedUsers.value.forEach(u => newSet.delete(u.id))
    selectedUsers.value = newSet
  } else {
    const newSet = new Set(selectedUsers.value)
    paginatedUsers.value.forEach(u => newSet.add(u.id))
    selectedUsers.value = newSet
  }
}

// Validación de formulario
const isFormValid = computed(() => {
  const f = createEditForm.value
  if (!f.nombre || !f.primer_apellido || !f.id_rol || !f.correo) return false
  if (showCreateModal.value) {
    if (!f.contrasena || f.contrasena.length < 6) return false
    if (confirmPassword.value && f.contrasena !== confirmPassword.value) return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(f.correo)) return false
  return true
})

// Fortaleza de contraseña
const passwordStrength = computed(() => {
  const p = createEditForm.value.contrasena
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score += 25
  if (/[A-Z]/.test(p)) score += 25
  if (/[0-9]/.test(p)) score += 25
  if (/[^A-Za-z0-9]/.test(p)) score += 25
  return score
})

const strengthClass = computed(() => {
  if (passwordStrength.value <= 25) return 'weak'
  if (passwordStrength.value <= 50) return 'medium'
  if (passwordStrength.value <= 75) return 'good'
  return 'strong'
})

const strengthLabel = computed(() => {
  if (!createEditForm.value.contrasena) return ''
  if (passwordStrength.value <= 25) return 'Débil'
  if (passwordStrength.value <= 50) return 'Media'
  if (passwordStrength.value <= 75) return 'Buena'
  return 'Fuerte'
})

// Toast icon
const toastIcon = computed(() => {
  const icons: Record<string, string> = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-x-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return icons[toastType.value] || icons.info
})

// Métodos
const handleSearch = () => {
  currentPage.value = 1
  selectedUsers.value = new Set()
}

const toggleRoleFilter = (role: string) => {
  selectedRole.value = selectedRole.value === role ? null : role
  currentPage.value = 1
  selectedUsers.value = new Set()
}

const toggleStatusFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status
  currentPage.value = 1
  selectedUsers.value = new Set()
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedRole.value = null
  selectedStatus.value = null
  currentPage.value = 1
  selectedUsers.value = new Set()
}

const getRoleCount = (role: string): number => {
  return users.value.filter(u => (u.roleId || roleIdFromLabel(u.role)) === role).length
}

const getRoleLabel = (role: string): string => {
  return roleLabelFromId(role) || role
}

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

const getInitials = (name: string): string => {
  return name.split(' ').map(p => p[0] || '').slice(0, 2).join('').toUpperCase()
}

const getRoleBadgeClass = (role: string): string => {
  if (role === 'Administrador') return 'admin'
  if (role === 'Empleado') return 'employee'
  return 'client'
}

const getRoleIcon = (role: string): string => {
  if (role === 'Administrador') return 'bi bi-shield-check'
  if (role === 'Empleado') return 'bi bi-person-badge'
  return 'bi bi-people'
}

const getRoleColor = (role: string): string => {
  if (role === 'Administrador') return '#5d8a2f'
  if (role === 'Empleado') return '#4a7b22'
  return '#8a9e7c'
}

const formatLastActivity = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Sin actividad'
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Hace ${days} d`
  return date.toLocaleDateString('es-ES')
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getAvatarSrc = (u: any): string => {
  if (u?.avatar) {
    if (u.avatar.startsWith('http')) return u.avatar
    if (u.avatar.startsWith('/')) return `${API_BASE}${u.avatar}`
    return u.avatar
  }
  return ''
}

const onAvatarError = (u: any) => {
  if (u) u.avatar = undefined
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

const toggleUserStatus = async (user: User) => {
  user.updating = true
  const prevState = user.active

  try {
    const token = getAuthToken()
    const idToUse = (user as any).backendId || user.id

    if (token) {
      const resp = await fetch(`${API_BASE}/api/users/${idToUse}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active: !user.active })
      })
      if (resp.ok) {
        user.active = !user.active
        const body = await resp.json().catch(() => ({}))
        if (body?.data?.active !== undefined) user.active = !!body.data.active
      } else {
        throw new Error('API error')
      }
    } else {
      // Modo offline
      user.active = !user.active
    }
    showToast(`Usuario ${user.active ? 'activado' : 'desactivado'} correctamente`, 'success', 'Actualizado')
  } catch (err) {
    user.active = prevState
    showToast('Error al actualizar el estado', 'error', 'Error')
  } finally {
    user.updating = false
  }
}

const viewUser = (user: User) => {
  const id = (user as any).backendId || user.id
  router.push(`/admin/usuarios/${id}`)
}

const confirmDelete = (user: User) => {
  userToDelete.value = { ...user }
  deleteConfirmText.value = ''
}

const cancelDelete = () => {
  userToDelete.value = null
  deleteConfirmText.value = ''
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  if (deleteConfirmationRequired.value && deleteConfirmText.value !== 'ELIMINAR') return

  try {
    const token = getAuthToken()
    const idToUse = (userToDelete.value as any).backendId || userToDelete.value.id

    if (token) {
      const resp = await fetch(`${API_BASE}/api/users/${idToUse}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!resp.ok) throw new Error('API error')
    }

    users.value = users.value.filter(u => ((u as any).backendId || u.id) !== idToUse)
    selectedUsers.value.delete(idToUse)
    showToast(`Usuario "${userToDelete.value.name}" eliminado correctamente`, 'success', 'Eliminado')
  } catch (err) {
    showToast('Error al eliminar el usuario', 'error', 'Error')
  } finally {
    userToDelete.value = null
    deleteConfirmText.value = ''
  }
}

const bulkActivate = async () => {
  try {
    const token = getAuthToken()
    for (const userId of selectedUsers.value) {
      const user = users.value.find(u => u.id === userId)
      if (user && !user.active) {
        if (token) {
          await fetch(`${API_BASE}/api/users/${userId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ active: true })
          })
        }
        user.active = true
      }
    }
    showToast(`${selectedUsers.value.size} usuarios activados`, 'success', 'Activación Masiva')
    selectedUsers.value = new Set()
  } catch (err) {
    showToast('Error en la activación masiva', 'error', 'Error')
  }
}

const bulkDeactivate = async () => {
  try {
    const token = getAuthToken()
    for (const userId of selectedUsers.value) {
      const user = users.value.find(u => u.id === userId)
      if (user && user.active) {
        if (token) {
          await fetch(`${API_BASE}/api/users/${userId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ active: false })
          })
        }
        user.active = false
      }
    }
    showToast(`${selectedUsers.value.size} usuarios desactivados`, 'success', 'Desactivación Masiva')
    selectedUsers.value = new Set()
  } catch (err) {
    showToast('Error en la desactivación masiva', 'error', 'Error')
  }
}

const bulkDelete = () => {
  if (selectedUsers.value.size > 0) {
    showBulkDeleteModal.value = true
  }
}

const confirmBulkDelete = async () => {
  try {
    const token = getAuthToken()
    for (const userId of selectedUsers.value) {
      if (token) {
        await fetch(`${API_BASE}/api/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    }
    users.value = users.value.filter(u => !selectedUsers.value.has(u.id))
    const count = selectedUsers.value.size
    selectedUsers.value = new Set()
    showBulkDeleteModal.value = false
    showToast(`${count} usuarios eliminados`, 'success', 'Eliminación Masiva')
  } catch (err) {
    showToast('Error en la eliminación masiva', 'error', 'Error')
  }
}

const openCreateModal = () => {
  createEditForm.value = {
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    id_rol: '',
    correo: '',
    contrasena: '',
    empresa: '',
    telefono: ''
  }
  confirmPassword.value = ''
  showPassword.value = false
  showCreateModal.value = true
  showEditModal.value = false
  editingUserId.value = null
}

const openEditModal = (user: User) => {
  const nameParts = user.name.split(' ')
  createEditForm.value = {
    nombre: nameParts[0] || '',
    primer_apellido: nameParts[1] || '',
    segundo_apellido: nameParts.slice(2).join(' ') || '',
    id_rol: user.roleId || roleIdFromLabel(user.role),
    correo: user.email,
    contrasena: '',
    empresa: user.company || '',
    telefono: user.telefono || ''
  }
  editingUserId.value = (user as any).backendId || user.id
  showEditModal.value = true
  showCreateModal.value = false
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingUserId.value = null
}

const submitForm = async () => {
  if (!isFormValid.value) return

  try {
    const token = getAuthToken()

    if (showCreateModal.value) {
      const payload = {
        nombre: createEditForm.value.nombre,
        primer_apellido: createEditForm.value.primer_apellido,
        segundo_apellido: createEditForm.value.segundo_apellido,
        id_rol: createEditForm.value.id_rol,
        correo: createEditForm.value.correo,
        contrasena: createEditForm.value.contrasena,
        empresa: createEditForm.value.empresa,
        telefono: createEditForm.value.telefono
      }

      if (token) {
        const resp = await fetch(`${API_BASE}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}))
          throw new Error(body.message || 'Error del servidor')
        }
        const body = await resp.json()
        const newUser = body.data || body
        users.value.push({
          id: newUser.id_usuario || Date.now(),
          name: `${createEditForm.value.nombre} ${createEditForm.value.primer_apellido} ${createEditForm.value.segundo_apellido}`.trim(),
          username: createEditForm.value.correo.split('@')[0],
          email: createEditForm.value.correo,
          role: roleLabelFromId(createEditForm.value.id_rol),
          active: true,
          color: getRoleColor(roleLabelFromId(createEditForm.value.id_rol)),
          company: createEditForm.value.empresa,
          createdAt: new Date().toISOString(),
          roleId: createEditForm.value.id_rol,
          lastActivity: new Date().toISOString()
        })
      } else {
        // Modo offline
        users.value.push({
          id: Date.now(),
          name: `${createEditForm.value.nombre} ${createEditForm.value.primer_apellido} ${createEditForm.value.segundo_apellido}`.trim(),
          username: createEditForm.value.correo.split('@')[0],
          email: createEditForm.value.correo,
          role: roleLabelFromId(createEditForm.value.id_rol),
          active: true,
          color: getRoleColor(roleLabelFromId(createEditForm.value.id_rol)),
          company: createEditForm.value.empresa,
          createdAt: new Date().toISOString(),
          roleId: createEditForm.value.id_rol,
          lastActivity: new Date().toISOString()
        })
      }
      showToast('Usuario creado correctamente', 'success', 'Creado')
    } else if (showEditModal.value && editingUserId.value) {
      const payload = {
        nombre: createEditForm.value.nombre,
        primer_apellido: createEditForm.value.primer_apellido,
        segundo_apellido: createEditForm.value.segundo_apellido,
        id_rol: createEditForm.value.id_rol,
        correo: createEditForm.value.correo,
        empresa: createEditForm.value.empresa,
        telefono: createEditForm.value.telefono
      }

      if (token) {
        const resp = await fetch(`${API_BASE}/api/users/${editingUserId.value}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}))
          throw new Error(body.message || 'Error del servidor')
        }
      }

      const idx = users.value.findIndex(u => ((u as any).backendId || u.id) === editingUserId.value)
      if (idx !== -1) {
        users.value[idx].name = `${createEditForm.value.nombre} ${createEditForm.value.primer_apellido} ${createEditForm.value.segundo_apellido}`.trim()
        users.value[idx].email = createEditForm.value.correo
        users.value[idx].role = roleLabelFromId(createEditForm.value.id_rol)
        users.value[idx].roleId = createEditForm.value.id_rol
        users.value[idx].company = createEditForm.value.empresa
        users.value[idx].telefono = createEditForm.value.telefono
      }
      showToast('Usuario actualizado correctamente', 'success', 'Actualizado')
    }
    closeModals()
  } catch (err: any) {
    showToast(err.message || 'Error al procesar la solicitud', 'error', 'Error')
  }
}

const exportData = () => {
  const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Empresa', 'Última Actividad']
  const data = users.value.map(user => [
    user.id,
    user.name,
    user.email,
    user.role,
    user.active ? 'Activo' : 'Inactivo',
    user.company || '',
    user.lastActivity || ''
  ])

  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `usuarios-sena-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast('Archivo CSV exportado correctamente', 'success', 'Exportado')
}

const showToast = (message: string, type: string = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title
  toastType.value = type
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 4000)
}

// API
const fetchUsersFromApi = async () => {
  try {
    const token = getAuthToken()
    if (!token) return
    const resp = await fetch(`${API_BASE}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!resp.ok) return
    const body = await resp.json()
    const rows = body.data || []
    if (rows.length > 0) {
      users.value = rows.map((r: any) => ({
        id: r.id_usuario || r.id || Date.now(),
        name: `${r.nombre || ''} ${r.primer_apellido || ''} ${r.segundo_apellido || ''}`.trim(),
        username: r.correo?.split('@')[0] || '',
        email: r.correo || r.email || '',
        role: roleLabelFromId(r.id_rol) || 'Usuario',
        active: r.activo !== undefined ? !!r.activo : true,
        color: getRoleColor(roleLabelFromId(r.id_rol)),
        avatar: r.foto_perfil || r.avatarUrl || undefined,
        company: r.empresa || '',
        roleId: r.id_rol,
        lastActivity: r.ultima_actividad || new Date().toISOString(),
        lastLogin: r.ultimo_login,
        createdAt: r.fecha_creacion || new Date().toISOString(),
        backendId: r.id_usuario || r.id
      }))
    }
  } catch (err) {
    console.error('Error fetching users:', err)
  }
}

// Watch para tema
watch(currentTheme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-bs-theme', newTheme)
})

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  fetchUsersFromApi()
})
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
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
.admin-users-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .admin-users-page {
  background: #0c0f0a;
  color: #e8ede3;
}

/* ============================================================
   HEADER
   ============================================================ */
.admin-header {
  background: #ffffff;
  border-bottom: 1px solid var(--sena-border);
  padding: 2rem 0 1.5rem;
}

[data-bs-theme="dark"] .admin-header {
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

.stat-icon.users { background: linear-gradient(135deg, #6b7b5a, #5d8a2f); }
.stat-icon.active { background: linear-gradient(135deg, #5d8a2f, #7aab3d); }
.stat-icon.admin { background: linear-gradient(135deg, #4a6b22, #5d8a2f); }

/* Forzar visibilidad del ícono dentro de stat-icon.admin */
.stat-icon.admin i,
.stat-icon.admin svg {
  color: #ffffff !important;
  fill: #ffffff !important;
  font-size: 1.15rem !important;
}
[data-bs-theme="light"] .stat-icon.admin {
  background: linear-gradient(135deg, #4a6b22, #5d8a2f) !important;
}
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

/* Estilos para el glifo inline utilizado cuando las fuentes de iconos fallan */
.stat-icon .icon-glyph {
  color: #ffffff;
  font-size: 1.05rem;
  line-height: 1;
  display: inline-block;
  transform: translateY(-1px);
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

[data-bs-theme="dark"] .chip-count {
  background: rgba(122,171,61,0.15);
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

[data-bs-theme="dark"] .action-btn.secondary:hover:not(:disabled) {
  background: rgba(93,138,47,0.12);
  border-color: var(--sena-green-light);
}

.action-btn.danger-outline {
  background: #fff5f5;
  border-color: #f5c6cb;
  color: #dc3545;
}

[data-bs-theme="dark"] .action-btn.danger-outline {
  background: rgba(220,53,69,0.1);
  border-color: rgba(220,53,69,0.3);
  color: #f5a0a0;
}

.action-btn.danger-outline:hover:not(:disabled) {
  background: #dc3545;
  color: #ffffff;
  border-color: #dc3545;
}

/* Refuerzo para asegurar visibilidad en tema claro */
.action-btn.primary i { color: #ffffff !important; }
.action-btn.primary span { color: #ffffff !important; }
.filter-group.actions-group .action-btn.primary,
.control-body .actions-group .action-btn.primary,
.actions-group .action-btn.primary {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d) !important;
  color: #ffffff !important;
  border: 1px solid #3f6b1d !important;
  box-shadow: 0 8px 24px rgba(93,138,47,0.22) !important;
  padding: 0.6rem 1.1rem !important;
  min-height: 44px !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}
[data-bs-theme="light"] .filter-group.actions-group .action-btn.primary,
[data-bs-theme="light"] .control-body .actions-group .action-btn.primary {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d) !important;
}
.action-btn.primary:focus {
  outline: 3px solid rgba(122,171,61,0.18) !important;
  outline-offset: 2px !important;
}
.action-btn.primary { color: #ffffff !important; }

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
  flex-wrap: wrap;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selected-count {
  font-size: 0.8rem;
  color: var(--sena-green);
  font-weight: 600;
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
.table-responsive {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.users-table thead th {
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

[data-bs-theme="dark"] .users-table thead th {
  background: #0a0d06;
  color: #8a9e7c;
}

.users-table tbody td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(93,138,47,0.06);
  vertical-align: middle;
}

[data-bs-theme="dark"] .users-table tbody td {
  border-bottom-color: rgba(122,171,61,0.06);
}

.users-table tbody tr {
  transition: var(--transition);
}

.users-table tbody tr:hover {
  background: #f8faf7;
}

[data-bs-theme="dark"] .users-table tbody tr:hover {
  background: rgba(122,171,61,0.04);
}

.users-table tbody tr.selected {
  background: var(--sena-green-pale);
}

[data-bs-theme="dark"] .users-table tbody tr.selected {
  background: rgba(93,138,47,0.12);
}

.col-check { width: 40px; text-align: center; }
.col-user { min-width: 200px; }
.col-email { min-width: 180px; }
.col-role { min-width: 120px; }
.col-activity { min-width: 140px; }
.col-status { min-width: 120px; }
.col-actions { min-width: 120px; text-align: right; }

.table-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--sena-green);
  cursor: pointer;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: var(--font-display);
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.status-dot.online { background: #5d8a2f; }
.status-dot.offline { background: #b0b8a8; }

[data-bs-theme="dark"] .status-dot {
  border-color: #0e1509;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--sena-text);
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .user-name { color: #e0ecd6; }

.user-username {
  font-size: 0.75rem;
  color: var(--sena-muted);
}

.user-company {
  font-size: 0.72rem;
  color: var(--sena-muted);
  margin-top: 0.1rem;
}

.email-link {
  color: var(--sena-green);
  text-decoration: none;
  font-size: 0.85rem;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.email-link:hover { text-decoration: underline; }

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-badge.admin {
  background: #edf4e3;
  color: #5d8a2f;
}

.role-badge.employee {
  background: #f0f4ea;
  color: #4a7b22;
}

.role-badge.client {
  background: #f5f7f2;
  color: #6b8a4a;
}

[data-bs-theme="dark"] .role-badge.admin {
  background: rgba(93,138,47,0.2);
  color: #7aab3d;
}

[data-bs-theme="dark"] .role-badge.employee {
  background: rgba(93,138,47,0.15);
  color: #8aab5d;
}

[data-bs-theme="dark"] .role-badge.client {
  background: rgba(93,138,47,0.1);
  color: #9abb7d;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.activity-text {
  font-size: 0.85rem;
  color: var(--sena-muted);
}

.activity-detail {
  font-size: 0.72rem;
  color: #a0a898;
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.toggle-btn {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #d0d8c8;
  border: none;
  cursor: pointer;
  position: relative;
  transition: var(--transition);
  padding: 0;
  flex-shrink: 0;
}

.toggle-btn.active {
  background: #5d8a2f;
}

.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  transition: var(--transition);
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.toggle-btn.active .toggle-dot {
  left: 22px;
}

.status-text {
  font-size: 0.8rem;
  font-weight: 500;
}

.status-text.active { color: #5d8a2f; }
.status-text.inactive { color: #a0a898; }

[data-bs-theme="dark"] .status-text.active { color: #7aab3d; }

.action-buttons {
  display: flex;
  gap: 0.35rem;
  justify-content: flex-end;
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

[data-bs-theme="dark"] .icon-btn:hover {
  background: rgba(93,138,47,0.15);
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

.icon-btn.danger:hover {
  background: #fff0f0;
  border-color: #dc3545;
  color: #dc3545;
}

[data-bs-theme="dark"] .icon-btn.danger:hover {
  background: rgba(220,53,69,0.15);
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

[data-bs-theme="dark"] .page-btn:hover:not(:disabled) {
  background: rgba(93,138,47,0.12);
  border-color: var(--sena-green-light);
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

.form-modal {
  max-width: 600px;
}

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

.warning-icon { color: #e6a817; }

.warning-box {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: #fff8e6;
  border: 1px solid #f0d060;
  border-radius: var(--radius-md);
  color: #8a6d10;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .warning-box {
  background: rgba(230,168,23,0.1);
  border-color: rgba(230,168,23,0.3);
  color: #e6a817;
}

.delete-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8faf7;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .delete-preview {
  background: rgba(122,171,61,0.05);
}

.preview-avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.preview-info h6 {
  margin: 0 0 0.2rem;
  color: var(--sena-text);
}

.preview-info p {
  margin: 0 0 0.4rem;
  font-size: 0.82rem;
  color: var(--sena-muted);
}

.delete-message {
  color: var(--sena-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.delete-confirm-input {
  margin-top: 1rem;
}

.bulk-delete-list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 1rem;
}

.bulk-delete-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(93,138,47,0.06);
  font-size: 0.85rem;
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

.modal-btn.danger {
  background: #dc3545;
  color: #ffffff;
}

.modal-btn.danger:hover:not(:disabled) {
  background: #c82333;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group:last-child:nth-child(odd) {
  grid-column: span 2;
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

.form-input.is-invalid {
  border-color: #dc3545;
}

.form-error {
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.2rem;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--sena-muted);
  cursor: pointer;
  padding: 0.25rem;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e0e5da;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak { background: #dc3545; }
.strength-fill.medium { background: #e6a817; }
.strength-fill.good { background: #4a9eff; }
.strength-fill.strong { background: #5d8a2f; }

.strength-text {
  font-size: 0.7rem;
  font-weight: 600;
}

.strength-text.weak { color: #dc3545; }
.strength-text.medium { color: #e6a817; }
.strength-text.good { color: #4a9eff; }
.strength-text.strong { color: #5d8a2f; }

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
  border-left: 4px solid #5d8a2f;
}

[data-bs-theme="dark"] .toast-notification {
  background: #1a2412;
  border-left-color: #7aab3d;
}

.toast-notification.success { border-left-color: #5d8a2f; }
.toast-notification.error { border-left-color: #dc3545; }
.toast-notification.warning { border-left-color: #e6a817; }

.toast-notification > i {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-notification.success > i { color: #5d8a2f; }
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

.toast-close:hover { color: var(--sena-text); background: var(--sena-green-pale); }

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
}

@media (max-width: 768px) {
  .desktop-table { display: none; }
  .mobile-cards { display: block; }

  .user-card {
    background: #fcfdfb;
    border: 1px solid var(--sena-border);
    border-radius: var(--radius-lg);
    padding: 1rem;
    margin-bottom: 0.75rem;
    transition: var(--transition);
  }

  .user-card.selected {
    background: var(--sena-green-pale);
    border-color: var(--sena-green);
  }

  [data-bs-theme="dark"] .user-card {
    background: #131a0e;
    border-color: rgba(122,171,61,0.12);
  }

  [data-bs-theme="dark"] .user-card.selected {
    background: rgba(93,138,47,0.12);
    border-color: var(--sena-green-light);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .card-header .user-avatar { width: 44px; height: 44px; cursor: pointer; }
  .card-header .user-details { flex: 1; min-width: 0; cursor: pointer; }
  .card-header .user-details h5 { margin: 0; font-size: 0.9rem; color: var(--sena-text); }
  .card-header .user-details .user-email { font-size: 0.75rem; color: var(--sena-muted); display: block; }

  [data-bs-theme="dark"] .card-header .user-details h5 { color: #e0ecd6; }

  .card-actions {
    display: flex;
    gap: 0.3rem;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
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
  }

  [data-bs-theme="dark"] .info-value { color: #c8d8be; }

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

  .form-grid { grid-template-columns: 1fr; }
  .form-group:last-child:nth-child(odd) { grid-column: span 1; }

  .table-header { flex-direction: column; align-items: stretch; }
  .table-controls { justify-content: space-between; }
  .bulk-actions { flex-wrap: wrap; }
}

@media (max-width: 480px) {
  .admin-header { padding: 1.25rem 0 1rem; }
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
}
</style>
