<template>
  <div :data-bs-theme="currentTheme" class="admin-profile-page admin-dashboard">
    <div class="admin-layout">
      <!-- Contenido Principal -->
      <main :class="['main-content','admin-content', { 'expanded': ui.state.sidebarCollapsed }]">
      <div class="container-fluid">

        <!-- Header del Perfil -->
        <div class="profile-header mb-4" data-aos="fade-up">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="page-title mb-2">
                <i class="bi bi-person-circle me-3"></i>Mi Perfil
              </h1>
              <p class="page-subtitle text-muted">
                Administra tu información personal y configuración de cuenta
              </p>
            </div>
            <div class="col-md-4 text-md-end">
              <div class="d-flex gap-2 justify-content-md-end">
                <button class="btn btn-outline-primary" @click="resetForm">
                  <i class="bi bi-arrow-clockwise"></i> Restablecer
                </button>
                <button class="btn btn-primary" @click="saveProfile" :disabled="isSaving">
                  <template v-if="isSaving">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </template>
                  <template v-else>
                    <i class="bi bi-save me-2"></i> Guardar Cambios
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Columna Principal (ancho completo) - Información Personal -->
          <div class="col-lg-12" data-aos="fade-right">
            <div class="card profile-card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-person-badge me-2"></i>Información Personal
                </h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <!-- Avatar -->
                  <div class="col-12 mb-4">
                    <div class="avatar-section">
                      <div class="avatar-wrapper">
                        <div class="avatar-display">
                          <img v-if="form.avatar" :src="form.avatar" alt="Avatar" class="avatar-img">
                          <div v-else class="avatar-placeholder">
                            {{ avatarInitials }}
                          </div>
                          <div class="avatar-status" :class="`status-${user.status}`">
                            <i class="bi bi-circle-fill"></i>
                          </div>
                        </div>
                        <div class="role-badge mt-3" :class="`role-${form.role}`">
                          <i :class="roleIcon"></i>
                          <span>{{ roleLabel }}</span>
                        </div>

                        <div class="avatar-actions">
                          <button class="btn btn-sm btn-outline-primary" @click="triggerAvatarUpload">
                            <i class="bi bi-camera"></i> Cambiar
                          </button>
                          <input
                            ref="avatarInput"
                            type="file"
                            accept="image/*"
                            class="d-none"
                            @change="handleAvatarUpload"
                          >
                          <button v-if="form.avatar" class="btn btn-sm btn-outline-danger" @click="removeAvatar">
                            <i class="bi bi-trash"></i> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Nombre Completo -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-person me-1"></i>Nombre(s)
                      </label>
                      <input
                        v-model="form.firstName"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.firstName }"
                        placeholder="Ingresa tu nombre"
                      >
                      <div v-if="errors.firstName" class="invalid-feedback">
                        {{ errors.firstName }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-person me-1"></i>Apellido(s)
                      </label>
                      <input
                        v-model="form.lastName"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.lastName }"
                        placeholder="Ingresa tu apellido"
                      >
                      <div v-if="errors.lastName" class="invalid-feedback">
                        {{ errors.lastName }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="bi bi-person me-1"></i>Segundo Apellido
                      </label>
                      <input
                        v-model="form.secondLastName"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.secondLastName }"
                        placeholder="Ingresa tu segundo apellido (opcional)"
                      >
                      <div v-if="errors.secondLastName" class="invalid-feedback">
                        {{ errors.secondLastName }}
                      </div>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-envelope me-1"></i>Correo Electrónico
                      </label>
                      <div class="input-group">
                        <input
                          v-model="form.email"
                          type="email"
                          class="form-control"
                          :class="{ 'is-invalid': errors.email }"
                          placeholder="correo@ejemplo.com"
                          :readonly="!canEditEmail"
                        >
                        <button v-if="!canEditEmail" class="btn btn-outline-secondary" @click="enableEmailEdit">
                          <i class="bi bi-pencil"></i>
                        </button>
                      </div>
                      <div v-if="errors.email" class="invalid-feedback">
                        {{ errors.email }}
                      </div>
                    </div>
                  </div>

                  <!-- Teléfono -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-telephone me-1"></i>Teléfono
                      </label>
                      <input
                        v-model="form.phone"
                        type="tel"
                        class="form-control"
                        :class="{ 'is-invalid': errors.phone }"
                        placeholder="+52 (XXX) XXX-XXXX"
                      >
                      <div v-if="errors.phone" class="invalid-feedback">
                        {{ errors.phone }}
                      </div>
                    </div>
                  </div>

                  <!-- Rol moved next to avatar; Departamento removed -->

                  <!-- Biografía removed -->
                </div>
              </div>
            </div>

            <!-- Seguridad -->
            <div class="card security-card mt-4" data-aos="fade-up" data-aos-delay="100">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-shield-lock me-2"></i>Seguridad
                </h5>
              </div>
              <div class="card-body">
                <div class="security-items">
                  <div class="security-item">
                    <div class="security-info">
                      <i class="bi bi-key"></i>
                      <div>
                        <h6>Contraseña</h6>
                        <p class="mb-0">Último cambio: {{ lastPasswordChange }}</p>
                      </div>
                    </div>
                    <button class="btn btn-outline-primary btn-sm" @click="showPasswordModal = true">
                      <i class="bi bi-pencil"></i> Cambiar
                    </button>
                  </div>

                  <div class="security-item">
                    <div class="security-info">
                      <i class="bi bi-shield-check"></i>
                      <div>
                        <h6>Autenticación de Dos Factores</h6>
                        <p class="mb-0" v-if="form.twoFactorEnabled">
                          <span class="text-success">
                            <i class="bi bi-check-circle-fill"></i> Activado
                          </span>
                        </p>
                        <p class="mb-0" v-else>
                          <span class="text-danger">
                            <i class="bi bi-x-circle-fill"></i> Desactivado
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="form-check form-switch">
                      <input
                        v-model="form.twoFactorEnabled"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                      >
                    </div>
                  </div>

                  <div class="security-item">
                    <div class="security-info">
                      <i class="bi bi-clock-history"></i>
                      <div>
                        <h6>Sesiones Activas</h6>
                        <p class="mb-0">{{ activeSessions }} sesión(es) activa(s)</p>
                      </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" @click="showSessionsModal = true">
                      <i class="bi bi-eye"></i> Ver todas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column removed: Información de Cuenta (removed) -->
        </div>
      </div>
      </main>
    </div>

    <!-- Modal para Cambiar Contraseña -->
    <div class="modal fade" id="passwordModal" tabindex="-1" aria-hidden="true" ref="passwordModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-key me-2"></i>Cambiar Contraseña
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label class="form-label required">Contraseña Actual</label>
                <div class="input-group">
                  <input
                    v-model="passwordForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.currentPassword }"
                    placeholder="Ingresa tu contraseña actual"
                  >
                  <button class="btn btn-outline-secondary" type="button" @click="showCurrentPassword = !showCurrentPassword">
                    <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="passwordErrors.currentPassword" class="invalid-feedback d-block">
                  {{ passwordErrors.currentPassword }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label required">Nueva Contraseña</label>
                <div class="input-group">
                  <input
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.newPassword }"
                    placeholder="Ingresa la nueva contraseña"
                  >
                  <button class="btn btn-outline-secondary" type="button" @click="showNewPassword = !showNewPassword">
                    <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="passwordErrors.newPassword" class="invalid-feedback d-block">
                  {{ passwordErrors.newPassword }}
                </div>
                <small class="text-muted">Mínimo 8 caracteres, con mayúsculas, minúsculas y números</small>
              </div>

              <div class="mb-4">
                <label class="form-label required">Confirmar Contraseña</label>
                <div class="input-group">
                  <input
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.confirmPassword }"
                    placeholder="Repite la nueva contraseña"
                  >
                  <button class="btn btn-outline-secondary" type="button" @click="showConfirmPassword = !showConfirmPassword">
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="passwordErrors.confirmPassword" class="invalid-feedback d-block">
                  {{ passwordErrors.confirmPassword }}
                </div>
              </div>

              <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isChangingPassword">
                  <template v-if="isChangingPassword">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cambiando...
                  </template>
                  <template v-else>
                    <i class="bi bi-check-circle me-2"></i>Cambiar Contraseña
                  </template>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Sesiones Activas -->
    <div class="modal fade" id="sessionsModal" tabindex="-1" aria-hidden="true" ref="sessionsModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-clock-history me-2"></i>Sesiones Activas
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="sessions.length === 0" class="text-center py-4 text-muted">No hay sesiones activas registradas.</div>
            <ul class="list-group" v-else>
              <li class="list-group-item d-flex justify-content-between align-items-center" v-for="s in sessions" :key="s.id">
                <div>
                  <strong>{{ s.device || s.agent || 'Desconocido' }}</strong>
                  <div class="small text-muted">{{ formatRelativeTime(s.lastActive || s.createdAt) }}</div>
                </div>
                <div class="d-flex gap-2 align-items-center">
                  <span class="small text-muted">{{ s.ip || '' }}</span>
                  <button class="btn btn-sm btn-outline-danger" @click="revokeSession(s.id)">Revocar</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        id="profileToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastEl"
      >
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto">
            <i :class="toastIcon"></i> Notificación
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
import { ref, computed, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import useUiStore from '@/compasable/useUiStore'
import type { Modal } from 'bootstrap'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'
type UserRole = 'admin' | 'superadmin' | 'manager' | 'technical' | 'support'
type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  secondLastName?: string | null
  email: string
  phone: string
  role: UserRole
  department: string
  bio: string
  avatar: string | null
  status: UserStatus
  twoFactorEnabled: boolean
  // notifications removed — handled elsewhere
  createdAt: string
  lastActivity: string
  lastPasswordChange: string
}

// UserStats removed — statistics UI was removed per request

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del formulario principal
const form = ref<UserProfile>({
  id: 'ADM-001',
  firstName: 'Juan Carlos',
  lastName: 'Martínez',
  secondLastName: 'López',
  email: 'admin@sena.com',
  phone: '+52 (55) 1234 5678',
  role: 'superadmin',
  department: 'admin',
  bio: 'Administrador principal del sistema SENA Laboratorios. Especializado en gestión de calidad y procesos de acreditación.',
  avatar: null,
  status: 'active',
  twoFactorEnabled: true,
  // notifications removed from local profile
  createdAt: '2022-01-15T10:00:00Z',
  lastActivity: new Date().toISOString(),
  lastPasswordChange: '2023-10-15T14:30:00Z'
})

const errors = ref<Record<string, string>>({})
const isSaving = ref(false)
const canEditEmail = ref(false)

// Valores mínimos (estadísticas UI removidas)
const activeSessions = ref(3)

// Estado de contraseña
const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref<Record<string, string>>({})
const isChangingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Modales
const showPasswordModal = ref(false)
const showSessionsModal = ref(false)
const passwordModal = ref<HTMLDivElement | null>(null)
const sessionsModal = ref<HTMLDivElement | null>(null)
let modalInstance: Modal | null = null
let sessionsModalInstance: Modal | null = null

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Refs
const avatarInput = ref<HTMLInputElement | null>(null)
const sessions = ref<Array<any>>([])

// Base API path (adjust if your backend uses another prefix)
import { API_BASE } from '@/config/api'

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

// Layout: actualizar variables CSS globales para integrar navbar/sidebar
const ui = useUiStore()
const setLayoutVars = () => {
  const root = document.documentElement
  const computedRoot = getComputedStyle(root)

  // Try existing CSS var first (may be set by App.vue)
  const existingSidebarVar = computedRoot.getPropertyValue('--sidebar-width').trim()
  if (existingSidebarVar) {
    root.style.setProperty('--sidebar-width', existingSidebarVar)
  }

  // Detect sidebar element by several common selectors used in the app
  const sidebarSelectors = ['.admin-sidebar', '.admin-sidebar.collapsed', '.sidebar', '.app-sidebar', '#sidebar']
  for (const sel of sidebarSelectors) {
    const el = document.querySelector(sel) as HTMLElement | null
    if (el && el.offsetWidth) {
      root.style.setProperty('--sidebar-width', `${el.offsetWidth}px`)
      break
    }
  }

  // If still not set, derive from store collapsed state or sensible defaults
  const currentSidebar = root.style.getPropertyValue('--sidebar-width').trim()
  if (!currentSidebar) {
    const fallbackWidth = ui?.state?.sidebarCollapsed ? 70 : 250
    root.style.setProperty('--sidebar-width', `${fallbackWidth}px`)
  }

  // Navbar height: try common header selectors then fallback
  const navbarSelectors = ['.admin-header', '.navbar', '.header', '#header']
  let foundNav = false
  for (const sel of navbarSelectors) {
    const el = document.querySelector(sel) as HTMLElement | null
    if (el && el.offsetHeight) {
      root.style.setProperty('--navbar-height', `${el.offsetHeight}px`)
      foundNav = true
      break
    }
  }
  if (!foundNav) {
    const existingNavbarVar = computedRoot.getPropertyValue('--navbar-height').trim()
    if (existingNavbarVar) root.style.setProperty('--navbar-height', existingNavbarVar)
    else root.style.setProperty('--navbar-height', '72px')
  }
}

// Computed
const user = computed(() => form.value)

const avatarInitials = computed(() => {
  const first = form.value.firstName.charAt(0)
  const last = form.value.lastName.charAt(0)
  return `${first}${last}`.toUpperCase()
})

const roleLabel = computed(() => {
  const labels: Record<UserRole, string> = {
    admin: 'Administrador',
    superadmin: 'Super Administrador',
    manager: 'Gerente',
    technical: 'Técnico',
    support: 'Soporte'
  }
  return labels[form.value.role] || form.value.role
})

const roleIcon = computed(() => {
  const icons: Record<UserRole, string> = {
    admin: 'bi bi-shield-check',
    superadmin: 'bi bi-shield-lock',
    manager: 'bi bi-person-badge',
    technical: 'bi bi-tools',
    support: 'bi bi-headset'
  }
  return icons[form.value.role] || 'bi bi-person'
})

const bioLengthClass = computed(() => {
  const length = form.value.bio.length
  if (length > 500) return 'text-danger'
  if (length > 450) return 'text-warning'
  return 'text-muted'
})

const lastPasswordChange = computed(() => {
  const date = new Date(form.value.lastPasswordChange)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

// activeSessions is a simple ref defined above (was previously part of `stats`)

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
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)

  showToast(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'El nombre es requerido'
    isValid = false
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'El apellido es requerido'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = 'El correo electrónico es requerido'
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Ingresa un correo electrónico válido'
    isValid = false
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!form.value.phone.trim()) {
    errors.value.phone = 'El teléfono es requerido'
    isValid = false
  } else if (!phoneRegex.test(form.value.phone)) {
    errors.value.phone = 'Ingresa un teléfono válido'
    isValid = false
  }

  return isValid
}

const validatePassword = (): boolean => {
  passwordErrors.value = {}
  let isValid = true

  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'La contraseña actual es requerida'
    isValid = false
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'La nueva contraseña es requerida'
    isValid = false
  } else if (!passwordRegex.test(passwordForm.value.newPassword)) {
    passwordErrors.value.newPassword = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número'
    isValid = false
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Confirma tu nueva contraseña'
    isValid = false
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  return isValid
}

const saveProfile = async () => {
  if (!validateForm()) {
    showToast('Por favor, corrige los errores en el formulario', 'warning')
    return
  }

  isSaving.value = true

  try {
    // Enviar cambios al servidor (mapear a los campos que espera la API)
    const payload = {
      nombre: form.value.firstName,
      primer_apellido: form.value.lastName,
      segundo_apellido: form.value.secondLastName,
      telefono: form.value.phone,
      correo: form.value.email
    }
    const token = getAuthToken()
    const headers: Record<string,string> = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Error al guardar el perfil')
    }
    // Actualizar última actividad localmente
    form.value.lastActivity = new Date().toISOString()
    showToast('¡Perfil actualizado correctamente!', 'success')
  } catch (error: any) {
    showToast(error?.message || 'Error al guardar el perfil', 'error')
  } finally {
    isSaving.value = false
  }
}

const changePassword = async () => {
  if (!validatePassword()) {
    showToast('Por favor, corrige los errores en el formulario de contraseña', 'warning')
    return
  }

  isChangingPassword.value = true

  try {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Actualizar fecha de cambio de contraseña
    form.value.lastPasswordChange = new Date().toISOString()

    // Resetear formulario
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    // Cerrar modal
    if (modalInstance) {
      modalInstance.hide()
    }

    showToast('¡Contraseña cambiada exitosamente!', 'success')
  } catch (error: any) {
    showToast(error?.message || 'Error al cambiar la contraseña', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

const resetForm = () => {
  // Resetear a valores originales (simulado)
  form.value.bio = 'Administrador principal del sistema SENA Laboratorios. Especializado en gestión de calidad y procesos de acreditación.'
  form.value.department = 'admin'
  // notifications removed — no-op

  showToast('Formulario restablecido a valores originales', 'info')
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showToast('Solo se permiten archivos de imagen', 'warning')
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no debe superar los 5MB', 'warning')
      return
    }

    // Leer como base64 y enviar JSON
    // Compress/resize the image in-browser to avoid large payloads (server 413)
    const compressAndResizeImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.8): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Error leyendo el archivo'))
        reader.onload = () => {
          const img = new Image()
          img.onload = () => {
            let { width, height } = img
            // calculate new size preserving aspect ratio
            const aspect = width / height
            if (width > maxWidth) {
              width = maxWidth
              height = Math.round(width / aspect)
            }
            if (height > maxHeight) {
              height = maxHeight
              width = Math.round(height * aspect)
            }

            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (!ctx) return reject(new Error('Canvas no soportado'))
            // draw the image into canvas
            ctx.drawImage(img, 0, 0, width, height)

            // Prefer jpeg for smaller payloads, fallback to original type if needed
            const mime = 'image/jpeg'
            try {
              const dataUrl = canvas.toDataURL(mime, quality)
              resolve(dataUrl)
            } catch (err) {
              // last resort: return original data URL
              resolve(reader.result as string)
            }
          }
          img.onerror = () => reject(new Error('Error cargando la imagen para procesamiento'))
          img.src = reader.result as string
        }
        reader.readAsDataURL(file)
      })
    }

    ;(async () => {
      try {
        showToast('Procesando imagen...', 'info')
        const compressedDataUrl = await compressAndResizeImage(file, 1024, 1024, 0.8)

        // Convert dataURL to Blob
        const dataPart = compressedDataUrl.split(',')[1] || ''
        const byteString = atob(dataPart)
        const mimeMatch = compressedDataUrl.match(/^data:(image\/\w+);base64,/) || []
        const mime = mimeMatch[1] || 'image/jpeg'
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
        const blob = new Blob([ab], { type: mime })

        // Quick size check and warn if still too large
        const approxBytes = blob.size
        const maxBytes = 5 * 1024 * 1024 // 5MB
        if (approxBytes > maxBytes) {
          showToast('La imagen sigue siendo muy grande después de la compresión. Intenta una imagen más pequeña.', 'warning')
          return
        }

        showToast('Subiendo imagen...', 'info')
        const token = getAuthToken()

        // The backend expects a JSON payload with avatar as a data URL string
        const payload = { avatar: compressedDataUrl }

        const headers: Record<string,string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        if (token) headers.Authorization = `Bearer ${token}`

        console.debug('Uploading avatar (dataURL) to', `${API_BASE}/api/profile/avatar`)

        const res = await fetch(`${API_BASE}/api/profile/avatar`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          console.error('Avatar upload failed', res.status, text)
          throw new Error(text || `Error al subir la imagen (status ${res.status})`)
        }
        const data = await res.json().catch(() => ({}))
        form.value.avatar = data.avatarUrl || compressedDataUrl
        showToast('Imagen de perfil actualizada', 'success')
      } catch (err: any) {
        showToast(err?.message || 'Error al subir la imagen', 'error')
      }
    })()
  }
}

const removeAvatar = () => {
  // Eliminar en servidor
  (async () => {
    try {
      const token = getAuthToken()
      const headers: Record<string,string> = {}
      if (token) headers.Authorization = `Bearer ${token}`
      const res = await fetch(`${API_BASE}/api/profile/avatar`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Error al eliminar la imagen')
      form.value.avatar = null
      showToast('Imagen de perfil eliminada', 'info')
    } catch (err: any) {
      showToast(err?.message || 'Error al eliminar la imagen', 'error')
    }
  })()
}

const enableEmailEdit = () => {
  canEditEmail.value = true
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Hace unos segundos'
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`

  return formatDate(dateString)
}

const formatHours = (hours: number): string => {
  return hours.toFixed(1)
}

// formatStorage removed (account info was removed)

const showToast = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
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

const fetchProfile = async () => {
  try {
    const token = getAuthToken()
    const headers: Record<string,string> = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/profile`, { headers })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('fetchProfile failed', res.status, text)
      throw new Error('No se pudo obtener el perfil')
    }
    const data = await res.json()
    // API responses sometimes wrap payload as { ok: true, data: {...} }
    const payload = (data && data.data) ? data.data : data
    console.debug('fetchProfile success payload', payload)
    // Map server fields into form; accept both English and Spanish keys
    form.value.firstName = payload.firstName ?? payload.nombre ?? form.value.firstName
    form.value.lastName = payload.lastName ?? payload.primer_apellido ?? form.value.lastName
    form.value.secondLastName = payload.secondLastName ?? payload.segundo_apellido ?? payload.middleName ?? form.value.secondLastName
    form.value.email = payload.email ?? payload.correo ?? form.value.email
    form.value.phone = payload.phone ?? payload.telefono ?? form.value.phone
    form.value.avatar = payload.avatarUrl ?? payload.foto_perfil ?? payload.avatar ?? form.value.avatar
    form.value.role = payload.role ?? form.value.role
    form.value.lastActivity = payload.ultima_actividad ?? payload.lastActivity ?? form.value.lastActivity
    form.value.lastPasswordChange = payload.lastPasswordChange ?? form.value.lastPasswordChange
  } catch (err: any) {
    showToast(err?.message || 'Error cargando datos de perfil', 'warning')
  }
}

const fetchSessions = async () => {
  try {
    const token = getAuthToken()
    const headers: Record<string,string> = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/profile/sessions`, { headers })
    if (!res.ok) throw new Error('No se pudieron obtener las sesiones')
    const data = await res.json()
    sessions.value = Array.isArray(data) ? data : data.sessions || []
  } catch (err: any) {
    showToast(err?.message || 'Error cargando sesiones', 'warning')
  }
}

const revokeSession = async (id: string) => {
  try {
    const token = getAuthToken()
    const headers: Record<string,string> = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/profile/sessions/${id}`, { method: 'DELETE', headers })
    if (!res.ok) throw new Error('No se pudo revocar la sesión')
    // actualizar lista
    await fetchSessions()
    showToast('Sesión revocada', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Error al revocar sesión', 'error')
  }
}

// Observar cambios en el modal de contraseña
const watchPasswordModal = () => {
  if (showPasswordModal.value && passwordModal.value) {
    import('bootstrap').then((bootstrap) => {
      modalInstance = new bootstrap.Modal(passwordModal.value!)
      modalInstance.show()

      passwordModal.value?.addEventListener('hidden.bs.modal', () => {
        showPasswordModal.value = false
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        passwordErrors.value = {}
      })
    })
  }
}

// Observador para el modal de sesiones
const watchSessionsModal = () => {
  if (showSessionsModal.value && sessionsModal.value) {
    import('bootstrap').then((bootstrap) => {
      sessionsModalInstance = new bootstrap.Modal(sessionsModal.value!)
      sessionsModalInstance.show()

      sessionsModal.value?.addEventListener('hidden.bs.modal', () => {
        showSessionsModal.value = false
      })
    })
  }
}

onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Observar cambios en el modal
  watchPasswordModal()
  // fetch profile and sessions
  fetchProfile()
  fetchSessions()
  // Inicializar y mantener actualizadas las variables de layout
  setLayoutVars()
  window.addEventListener('resize', setLayoutVars)
  // Re-run when sidebar collapsed state changes in the UI store
  watch(() => ui.state.sidebarCollapsed, () => setLayoutVars())
})

onBeforeUnmount(() => {
  // Limpiar listener para evitar fugas
  window.removeEventListener('resize', setLayoutVars)
  // hide/destroy modals
  if (modalInstance) modalInstance.hide()
  if (sessionsModalInstance) sessionsModalInstance.hide()
})

// Watch para el modal
watch(() => showPasswordModal.value, watchPasswordModal)
watch(() => showSessionsModal.value, watchSessionsModal)
</script>

<style scoped>
.admin-profile-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--lab-bg, #f8f9fa);
  /* avoid forcing viewport-sized container to prevent nested scrollbars */
  min-height: auto;
  overflow: visible;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .admin-profile-page {
  background: var(--lab-bg, #1a1a1a);
}

/* Layout */
.main-content {
  /* Prefer an app-level left margin if provided (App.vue), otherwise no forced margin.
     This avoids double-offsetting when the page is already inside a sidebar-layout. */
  margin-left: var(--app-left-margin, 0);
  width: calc(100% - var(--app-left-margin, 0));
  /* start content as close as possible to navbar: subtract a small buffer */
  padding-top: max(0px, calc(var(--navbar-height, 72px) - 16px));
  /* avoid forcing a full-viewport height here to prevent nested scrollbars */
  min-height: auto;
  transition: margin-left 0.3s ease, padding-top 0.2s ease, width 0.3s ease;
}

/* When using the admin layout classes from EventosAdmin, avoid double offsets
   and let the global admin styles control spacing. */
.main-content.admin-content {
  margin-left: 0;
  width: 100%;
}

@media (max-width: 992px) {
  .main-content {
    margin-left: 0;
  }
}

/* Breadcrumb */
.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 1rem;
}

.breadcrumb-item a {
  color: var(--color-primary, #1E9E4A);
  font-weight: 500;
}

.breadcrumb-item.active {
  color: var(--color-gray, #6C757D);
}

/* Profile Header */
.profile-header {
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 0;
}

  .main-content > .container-fluid {
  padding-top: 0;
}

[data-bs-theme="dark"] .profile-header {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin: 0;
}

.page-subtitle {
  font-size: 0.95rem;
  margin: 0;
}

/* Cards */
.profile-card,
.security-card,
.account-card {
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 0;
}

[data-bs-theme="dark"] .profile-card,
[data-bs-theme="dark"] .security-card,
[data-bs-theme="dark"] .account-card {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.card-header {
  background: var(--color-lighter, #F8F9FA);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.25rem 1.5rem;
}

[data-bs-theme="dark"] .card-header {
  background: var(--color-lighter, #1E1E1E);
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.card-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.card-body {
  padding: 1.25rem;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  justify-content: center;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-display {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-gray-light, #E9ECEF);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  border: 4px solid var(--color-gray-light, #E9ECEF);
}

.avatar-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--color-light, white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-light, white);
}

.status-active i {
  color: #34B565;
}

.status-inactive i {
  color: #6C757D;
}

.status-pending i {
  color: #FFC107;
}

.status-suspended i {
  color: #DC3545;
}

.avatar-actions {
  display: flex;
  gap: 0.5rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.form-label.required::after {
  content: ' *';
  color: #DC3545;
}

.form-control,
.form-select {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.25rem rgba(167,183,41,0.25);
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .form-control:focus,
[data-bs-theme="dark"] .form-select:focus {
  background: var(--card-bg, #2d2d2d);
}

/* Role Badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.role-superadmin {
  background: linear-gradient(135deg, rgba(167,183,41,0.12) 0%, rgba(167,183,41,0.06) 100%);
  color: var(--color-primary);
  border: 1px solid rgba(167,183,41,0.18);
}

.role-admin {
  background: linear-gradient(135deg, rgba(167,183,41,0.12) 0%, rgba(167,183,41,0.06) 100%);
  color: var(--color-primary);
  border: 1px solid rgba(167,183,41,0.18);
}

.role-manager {
  background: linear-gradient(135deg, rgba(251, 188, 5, 0.15) 0%, rgba(249, 168, 37, 0.1) 100%);
  color: #FBBC05;
  border: 1px solid rgba(251, 188, 5, 0.2);
}

/* Security */
.security-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 8px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .security-item {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.security-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.security-info i {
  font-size: 1.5rem;
  color: var(--color-primary, #1E9E4A);
}

.security-info h6 {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

[data-bs-theme="dark"] .security-info h6 {
  color: var(--color-dark, #F8F9FA);
}

.security-info p {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  margin: 0;
}

/* Stats and Notifications styles removed (UI removed) */

.form-check-input:checked {
  background-color: var(--color-primary, #1E9E4A);
  border-color: var(--color-primary, #1E9E4A);
}

.form-check-label {
  color: var(--color-dark, #212529);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

[data-bs-theme="dark"] .form-check-label {
  color: var(--color-dark, #F8F9FA);
}

/* Account-related styles removed (account card was deleted) */

/* Modal */
.modal-header {
  background: var(--gradient-primary, linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%));
  color: white;
}

.modal-title {
  color: white;
}

.modal-content {
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .modal-content {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

/* Toast */

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding-top: var(--navbar-height, 72px);
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .profile-header {
    padding: 1rem;
  }

  /* stats-grid removed */

  .card-body {
    padding: 1rem;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .security-info {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .main-content {
    padding-top: var(--navbar-height, 72px);
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .avatar-display {
    width: 100px;
    height: 100px;
  }

  .form-label {
    font-size: 0.9rem;
  }

  /* stat-value removed */
}

/* Temporary: prevent nested/duplicate scrollbars by ensuring only the document/body scrolls.
   If layout still requires a fixed-height container, we'll adjust precisely after inspecting the DOM. */
/* Disable page scrolling as requested: hide scrollbars and prevent page scroll */
html, body, #app {
  height: 100% !important;
  overflow: hidden !important;
}
.admin-layout, .main-content {
  height: auto !important;
  overflow: hidden !important;
}
</style>
