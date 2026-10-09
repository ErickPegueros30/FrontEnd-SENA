<template>
  <div :data-bs-theme="currentTheme" class="admin-profile-page admin-dashboard">
    <div class="admin-layout">
      <!-- Contenido Principal -->
      <main :class="['main-content','admin-content', { 'expanded': ui.state.sidebarCollapsed }]">
      <div class="container-fluid">

        <!-- Encabezado -->
        <header class="profile-header mb-4" data-aos="fade-up">
          <span class="header-icon"><i class="bi bi-person-circle"></i></span>
          <div>
            <h1 class="page-title">Mi Perfil</h1>
            <p class="page-subtitle">Administra tu información personal y la seguridad de tu cuenta</p>
          </div>
        </header>

        <div class="row g-4">
          <!-- ============================================================
               Columna izquierda: resumen y foto
               ============================================================ -->
          <div class="col-xl-4 col-lg-5" data-aos="fade-right">
            <section class="pp-card summary-card">
              <div class="summary-banner"></div>
              <div class="summary-body">
                <div class="avatar-display">
                  <img v-if="form.avatar" :src="form.avatar" alt="Foto de perfil" class="avatar-img">
                  <div v-else class="avatar-placeholder">{{ avatarInitials }}</div>
                  <div class="avatar-status" :class="`status-${form.status}`">
                    <i class="bi bi-circle-fill"></i>
                  </div>
                </div>

                <template v-if="isLoading">
                  <div class="skeleton skeleton-title"></div>
                  <div class="skeleton skeleton-line"></div>
                </template>
                <template v-else>
                  <h2 class="summary-name">{{ fullName }}</h2>
                  <p class="summary-email">{{ savedProfile.email || 'Sin correo registrado' }}</p>
                  <div class="summary-badges">
                    <span class="role-badge" :class="`role-${form.role}`">
                      <i :class="roleIcon"></i>
                      <span>{{ roleLabel }}</span>
                    </span>
                    <span class="status-chip" :class="`status-${form.status}`">
                      <i class="bi bi-circle-fill"></i> {{ statusLabel }}
                    </span>
                  </div>
                </template>

                <div class="avatar-actions">
                  <button type="button" class="btn btn-sm btn-outline-primary" :disabled="avatarBusy" @click="triggerAvatarUpload">
                    <span v-if="avatarBusy" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-camera me-1"></i> Cambiar foto
                  </button>
                  <input
                    ref="avatarInput"
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="handleAvatarUpload"
                  >
                  <button v-if="form.avatar" type="button" class="btn btn-sm btn-outline-danger" :disabled="avatarBusy" @click="removeAvatar">
                    <i class="bi bi-trash me-1"></i> Eliminar
                  </button>
                </div>
                <p class="summary-hint">Se ajusta automáticamente. Máximo 5 MB.</p>
              </div>
            </section>
          </div>

          <!-- ============================================================
               Columna derecha: datos y seguridad
               ============================================================ -->
          <div class="col-xl-8 col-lg-7" data-aos="fade-up">
            <!-- Información personal -->
            <form class="pp-card" novalidate @submit.prevent="saveProfile">
              <header class="pp-card-head">
                <span class="pp-card-icon"><i class="bi bi-person-badge"></i></span>
                <div>
                  <h2 class="pp-card-title">Información personal</h2>
                  <p class="pp-card-sub">Estos datos identifican tu cuenta en el sistema.</p>
                </div>
              </header>

              <fieldset class="pp-card-body" :disabled="isLoading">
                <h3 class="form-section-title">Nombre</h3>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label required" for="profile-first-name">Nombre(s)</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-person"></i></span>
                      <input
                        id="profile-first-name"
                        v-model="form.firstName"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.firstName }"
                        placeholder="Ingresa tu nombre"
                        autocomplete="given-name"
                      >
                    </div>
                    <div v-if="errors.firstName" class="invalid-feedback d-block">{{ errors.firstName }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label required" for="profile-last-name">Apellido(s)</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-person"></i></span>
                      <input
                        id="profile-last-name"
                        v-model="form.lastName"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.lastName }"
                        placeholder="Ingresa tu apellido"
                        autocomplete="family-name"
                      >
                    </div>
                    <div v-if="errors.lastName" class="invalid-feedback d-block">{{ errors.lastName }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="profile-second-last-name">Segundo apellido</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-person"></i></span>
                      <input
                        id="profile-second-last-name"
                        v-model="form.secondLastName"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.secondLastName }"
                        placeholder="Opcional"
                      >
                    </div>
                    <div v-if="errors.secondLastName" class="invalid-feedback d-block">{{ errors.secondLastName }}</div>
                  </div>
                </div>

                <h3 class="form-section-title">Contacto</h3>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label required" for="profile-email">Correo electrónico</label>
                    <div class="input-group">
                      <span class="input-group-text"><i :class="canEditEmail ? 'bi bi-envelope' : 'bi bi-lock'"></i></span>
                      <input
                        id="profile-email"
                        v-model="form.email"
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        placeholder="correo@ejemplo.com"
                        autocomplete="email"
                        :readonly="!canEditEmail"
                      >
                      <button
                        v-if="!canEditEmail"
                        type="button"
                        class="btn btn-outline-secondary"
                        aria-label="Editar correo electrónico"
                        title="Editar correo"
                        @click="enableEmailEdit"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                    </div>
                    <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
                    <div v-else-if="!canEditEmail" class="form-text">Pulsa el lápiz para modificarlo.</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label required" for="profile-phone">Teléfono</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                      <input
                        id="profile-phone"
                        v-model="form.phone"
                        type="tel"
                        class="form-control"
                        :class="{ 'is-invalid': errors.phone }"
                        placeholder="+52 (XXX) XXX-XXXX"
                        autocomplete="tel"
                      >
                    </div>
                    <div v-if="errors.phone" class="invalid-feedback d-block">{{ errors.phone }}</div>
                  </div>
                </div>
              </fieldset>

              <footer class="pp-card-foot">
                <span v-if="!isLoading" class="save-state" :class="{ dirty: isDirty }" role="status">
                  <i :class="isDirty ? 'bi bi-pencil-fill' : 'bi bi-check-circle-fill'"></i>
                  {{ isDirty ? 'Tienes cambios sin guardar' : 'Todo está guardado' }}
                </span>
                <span v-else></span>
                <div class="foot-actions">
                  <button type="button" class="btn btn-outline-secondary" :disabled="isLoading || isSaving || !isDirty" @click="resetForm">
                    <i class="bi bi-arrow-counterclockwise me-1"></i> Restablecer
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="isLoading || isSaving || !isDirty">
                    <template v-if="isSaving">
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </template>
                    <template v-else>
                      <i class="bi bi-save me-2"></i> Guardar cambios
                    </template>
                  </button>
                </div>
              </footer>
            </form>

            <!-- Seguridad -->
            <section class="pp-card mt-4">
              <header class="pp-card-head">
                <span class="pp-card-icon"><i class="bi bi-shield-lock"></i></span>
                <div>
                  <h2 class="pp-card-title">Seguridad</h2>
                  <p class="pp-card-sub">Protege el acceso a tu cuenta.</p>
                </div>
              </header>

              <ul class="security-list">
                <li class="security-row">
                  <span class="security-icon"><i class="bi bi-key"></i></span>
                  <div class="security-text">
                    <h3>Contraseña</h3>
                    <p>Último cambio: {{ lastPasswordChange }}</p>
                  </div>
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="openPasswordModal">
                    <i class="bi bi-pencil me-1"></i> Cambiar
                  </button>
                </li>
              </ul>
            </section>
          </div>
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
              <i class="bi bi-key"></i>Cambiar contraseña
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label class="form-label required" for="pwd-current">Contraseña actual</label>
                <div class="input-group">
                  <input
                    id="pwd-current"
                    v-model="passwordForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.currentPassword }"
                    placeholder="Ingresa tu contraseña actual"
                    autocomplete="current-password"
                  >
                  <button class="btn btn-outline-secondary" type="button" aria-label="Mostrar u ocultar contraseña" @click="showCurrentPassword = !showCurrentPassword">
                    <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="passwordErrors.currentPassword" class="invalid-feedback d-block">
                  {{ passwordErrors.currentPassword }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label required" for="pwd-new">Nueva contraseña</label>
                <div class="input-group">
                  <input
                    id="pwd-new"
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.newPassword }"
                    placeholder="Ingresa la nueva contraseña"
                    autocomplete="new-password"
                  >
                  <button class="btn btn-outline-secondary" type="button" aria-label="Mostrar u ocultar contraseña" @click="showNewPassword = !showNewPassword">
                    <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="passwordErrors.newPassword" class="invalid-feedback d-block">
                  {{ passwordErrors.newPassword }}
                </div>

                <div class="strength" :data-level="passwordStrength" aria-hidden="true">
                  <span v-for="n in 4" :key="n" :class="{ on: n <= passwordStrength }"></span>
                </div>
                <ul class="rule-list">
                  <li v-for="r in passwordRules" :key="r.key" :class="{ ok: r.ok }">
                    <i :class="r.ok ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i> {{ r.label }}
                  </li>
                </ul>
              </div>

              <div class="mb-4">
                <label class="form-label required" for="pwd-confirm">Confirmar contraseña</label>
                <div class="input-group">
                  <input
                    id="pwd-confirm"
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': passwordErrors.confirmPassword }"
                    placeholder="Repite la nueva contraseña"
                    autocomplete="new-password"
                  >
                  <button class="btn btn-outline-secondary" type="button" aria-label="Mostrar u ocultar contraseña" @click="showConfirmPassword = !showConfirmPassword">
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="passwordErrors.confirmPassword" class="invalid-feedback d-block">
                  {{ passwordErrors.confirmPassword }}
                </div>
                <div v-else-if="passwordForm.confirmPassword" class="form-text" :class="passwordsMatch ? 'text-success' : 'text-danger'">
                  <i :class="passwordsMatch ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                  {{ passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden' }}
                </div>
              </div>

              <div class="d-flex gap-2 justify-content-end">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isChangingPassword">
                  <template v-if="isChangingPassword">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cambiando...
                  </template>
                  <template v-else>
                    <i class="bi bi-check-circle me-2"></i>Cambiar contraseña
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
              <i class="bi bi-clock-history"></i>Sesiones activas
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="sessions.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-laptop fs-2 d-block mb-2"></i>
              No hay sesiones activas registradas.
            </div>
            <ul v-else class="session-list">
              <li class="session-item" v-for="s in sessions" :key="s.id">
                <span class="session-icon"><i :class="sessionIcon(s)"></i></span>
                <div class="session-info">
                  <strong>{{ s.device || s.agent || 'Desconocido' }}</strong>
                  <small>{{ [s.ip, formatRelativeTime(s.lastActive || s.createdAt)].filter(Boolean).join(' · ') }}</small>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" :disabled="revokingId === s.id" @click="revokeSession(s.id)">
                  <span v-if="revokingId === s.id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <template v-else>Revocar</template>
                </button>
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
import type { Modal, Toast } from 'bootstrap'
import useUiStore from '@/composables/useUiStore'
import { useTheme } from '@/composables/useTheme'
import { API_BASE } from '@/config/api'

/* ============================================================
   Tipos
   ============================================================ */
type ToastType = 'success' | 'info' | 'warning' | 'error'
type UserRole = 'admin' | 'superadmin' | 'manager' | 'technical' | 'support'
type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

interface UserProfile {
  firstName: string
  lastName: string
  secondLastName?: string | null
  email: string
  phone: string
  role: UserRole
  avatar: string | null
  status: UserStatus
  twoFactorEnabled: boolean
  lastPasswordChange: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ApiOptions {
  method?: string
  json?: unknown
}

/* ============================================================
   Constantes y estado
   ============================================================ */
const MAX_AVATAR_BYTES = 5 * 1024 * 1024

// Sin datos de ejemplo: lo que se ve siempre viene del servidor
const emptyProfile = (): UserProfile => ({
  firstName: '',
  lastName: '',
  secondLastName: null,
  email: '',
  phone: '',
  role: 'admin',
  avatar: null,
  status: 'active',
  twoFactorEnabled: false,
  lastPasswordChange: ''
})
const emptyPasswordForm = (): PasswordForm => ({ currentPassword: '', newPassword: '', confirmPassword: '' })

const { currentTheme } = useTheme()
const ui = useUiStore()

const form = ref<UserProfile>(emptyProfile())
// Último estado conocido del servidor: sirve para "Restablecer" y para detectar cambios sin guardar
const savedProfile = ref<UserProfile>(emptyProfile())

const errors = ref<Record<string, string>>({})
const isLoading = ref(true)
const isSaving = ref(false)
const avatarBusy = ref(false)
const canEditEmail = ref(false)

const passwordForm = ref<PasswordForm>(emptyPasswordForm())
const passwordErrors = ref<Record<string, string>>({})
const isChangingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Modales
const passwordModal = ref<HTMLDivElement | null>(null)
const sessionsModal = ref<HTMLDivElement | null>(null)
let passwordModalInstance: Modal | null = null
let sessionsModalInstance: Modal | null = null

// Toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)

const avatarInput = ref<HTMLInputElement | null>(null)
const sessions = ref<Array<any>>([])
const revokingId = ref<string | null>(null)
const activeSessions = computed(() => sessions.value.length)

/* ============================================================
   API
   ============================================================ */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

const authHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
  const token = getAuthToken()
  return { Accept: 'application/json', ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

// Una sola función para todas las llamadas: arma headers, lee el JSON y lanza el mensaje del servidor
const apiRequest = async (path: string, { method = 'GET', json }: ApiOptions = {}, fallbackError = 'Error en la solicitud') => {
  const hasBody = json !== undefined
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(hasBody ? { 'Content-Type': 'application/json' } : {}),
    body: hasBody ? JSON.stringify(json) : undefined
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.message || `${fallbackError} (HTTP ${res.status})`)
  return body
}

/* ============================================================
   Layout: actualizar variables CSS globales para integrar navbar/sidebar
   ============================================================ */
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

/* ============================================================
   Computed
   ============================================================ */
// Campos que se guardan con el botón "Guardar cambios" (el 2FA y el avatar tienen su propio flujo)
const editableSnapshot = (p: UserProfile) =>
  JSON.stringify([p.firstName.trim(), p.lastName.trim(), (p.secondLastName ?? '').trim(), p.email.trim(), p.phone.trim()])
const isDirty = computed(() => editableSnapshot(form.value) !== editableSnapshot(savedProfile.value))

const fullName = computed(() => {
  const p = savedProfile.value
  return [p.firstName, p.lastName, p.secondLastName].filter(Boolean).join(' ') || 'Tu perfil'
})

const avatarInitials = computed(() => {
  const first = savedProfile.value.firstName.charAt(0)
  const last = savedProfile.value.lastName.charAt(0)
  return `${first}${last}`.toUpperCase() || '?'
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

const statusLabel = computed(() => {
  const labels: Record<UserStatus, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    suspended: 'Suspendido'
  }
  return labels[form.value.status] || form.value.status
})

const lastPasswordChange = computed(() => {
  const raw = form.value.lastPasswordChange
  const date = new Date(raw)
  if (!raw || Number.isNaN(date.getTime())) return 'Sin registro'
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

// Requisitos de la nueva contraseña (los mismos que valida validatePassword)
const passwordRules = computed(() => {
  const p = passwordForm.value.newPassword
  return [
    { key: 'len', label: 'Mínimo 8 caracteres', ok: p.length >= 8 },
    { key: 'upper', label: 'Una mayúscula', ok: /[A-Z]/.test(p) },
    { key: 'lower', label: 'Una minúscula', ok: /[a-z]/.test(p) },
    { key: 'num', label: 'Un número', ok: /\d/.test(p) }
  ]
})
const passwordStrength = computed(() => passwordRules.value.filter(r => r.ok).length)
const passwordsMatch = computed(() => passwordForm.value.newPassword === passwordForm.value.confirmPassword)

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

/* ============================================================
   Utilidades
   ============================================================ */
const showToast = async (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type
  if (!toastEl.value) return
  // Una sola instancia reutilizada (antes se creaba una nueva en cada aviso)
  const { Toast } = await import('bootstrap')
  const toast: Toast = Toast.getOrCreateInstance(toastEl.value, { delay: 3000 })
  toast.show()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatRelativeTime = (dateString?: string): string => {
  const date = new Date(dateString ?? '')
  if (!dateString || Number.isNaN(date.getTime())) return 'Sin registro'
  const diffMs = Date.now() - date.getTime()
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

const sessionIcon = (s: any) =>
  /mobile|android|iphone|ipad|ios/i.test(String(s.device || s.agent || '')) ? 'bi bi-phone' : 'bi bi-laptop'

/* ============================================================
   Perfil
   ============================================================ */
const fetchProfile = async () => {
  try {
    const data = await apiRequest('/api/profile', {}, 'No se pudo obtener el perfil')
    // API responses sometimes wrap payload as { ok: true, data: {...} }
    const payload = (data && data.data) ? data.data : data
    // Map server fields into form; accept both English and Spanish keys
    form.value.firstName = payload.firstName ?? payload.nombre ?? form.value.firstName
    form.value.lastName = payload.lastName ?? payload.primer_apellido ?? form.value.lastName
    form.value.secondLastName = payload.secondLastName ?? payload.segundo_apellido ?? payload.middleName ?? form.value.secondLastName
    form.value.email = payload.email ?? payload.correo ?? form.value.email
    form.value.phone = payload.phone ?? payload.telefono ?? form.value.phone
    form.value.avatar = payload.avatarUrl ?? payload.foto_perfil ?? payload.avatar ?? form.value.avatar
    form.value.role = payload.role ?? form.value.role
    form.value.twoFactorEnabled = payload.twoFactorEnabled ?? form.value.twoFactorEnabled
    form.value.lastPasswordChange = payload.lastPasswordChange ?? form.value.lastPasswordChange
    savedProfile.value = { ...form.value }
  } catch (err: any) {
    showToast(err?.message || 'Error cargando datos de perfil', 'warning')
  }
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
  } else if (!emailRegex.test(form.value.email.trim())) {
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

const saveProfile = async () => {
  if (isSaving.value || !isDirty.value) return
  if (!validateForm()) {
    showToast('Por favor, corrige los errores en el formulario', 'warning')
    return
  }

  isSaving.value = true

  try {
    // Mapear a los campos que espera la API
    const payload = {
      nombre: form.value.firstName.trim(),
      primer_apellido: form.value.lastName.trim(),
      segundo_apellido: form.value.secondLastName?.trim() ?? null,
      telefono: form.value.phone.trim(),
      correo: form.value.email.trim()
    }
    await apiRequest('/api/profile', { method: 'PUT', json: payload }, 'Error al guardar el perfil')
    savedProfile.value = { ...form.value }
    canEditEmail.value = false
    showToast('¡Perfil actualizado correctamente!', 'success')
  } catch (error: any) {
    showToast(error?.message || 'Error al guardar el perfil', 'error')
  } finally {
    isSaving.value = false
  }
}

// Descarta los cambios sin guardar y vuelve a lo último que tiene el servidor
const resetForm = () => {
  form.value = { ...savedProfile.value }
  errors.value = {}
  canEditEmail.value = false
  showToast('Formulario restablecido a valores originales', 'info')
}

const enableEmailEdit = () => {
  canEditEmail.value = true
}

/* ============================================================
   Avatar
   ============================================================ */
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

// Reduce la imagen en el navegador para evitar payloads grandes (error 413 del servidor)
const compressImage = (file: File, maxSize = 1024, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Error leyendo el archivo'))
    reader.onload = () => {
      const original = reader.result as string
      const img = new Image()
      img.onerror = () => reject(new Error('Error cargando la imagen para procesamiento'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas no soportado'))
        // JPEG no soporta transparencia: sin fondo blanco los PNG se verían negros
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        try {
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch {
          resolve(original)
        }
      }
      img.src = original
    }
    reader.readAsDataURL(file)
  })
}

// Tamaño aproximado en bytes de un data URL en base64
const dataUrlBytes = (dataUrl: string) => Math.round(((dataUrl.split(',')[1] || '').length * 3) / 4)

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  // Limpiar el input permite volver a elegir el mismo archivo (si no, "change" no se dispara)
  input.value = ''
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Solo se permiten archivos de imagen', 'warning')
    return
  }
  if (file.size > MAX_AVATAR_BYTES) {
    showToast('La imagen no debe superar los 5MB', 'warning')
    return
  }

  avatarBusy.value = true
  try {
    showToast('Procesando imagen...', 'info')
    const dataUrl = await compressImage(file)
    if (dataUrlBytes(dataUrl) > MAX_AVATAR_BYTES) {
      showToast('La imagen sigue siendo muy grande después de la compresión. Intenta una imagen más pequeña.', 'warning')
      return
    }

    showToast('Subiendo imagen...', 'info')
    // El backend espera un JSON con el avatar como data URL
    const data = await apiRequest('/api/profile/avatar', { method: 'POST', json: { avatar: dataUrl } }, 'Error al subir la imagen')
    form.value.avatar = data.avatarUrl || dataUrl
    savedProfile.value = { ...savedProfile.value, avatar: form.value.avatar }
    showToast('Imagen de perfil actualizada', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Error al subir la imagen', 'error')
  } finally {
    avatarBusy.value = false
  }
}

const removeAvatar = async () => {
  avatarBusy.value = true
  try {
    await apiRequest('/api/profile/avatar', { method: 'DELETE' }, 'Error al eliminar la imagen')
    form.value.avatar = null
    savedProfile.value = { ...savedProfile.value, avatar: null }
    showToast('Imagen de perfil eliminada', 'info')
  } catch (err: any) {
    showToast(err?.message || 'Error al eliminar la imagen', 'error')
  } finally {
    avatarBusy.value = false
  }
}

/* ============================================================
   Contraseña
   ============================================================ */
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

const changePassword = async () => {
  if (!validatePassword()) {
    showToast('Por favor, corrige los errores en el formulario de contraseña', 'warning')
    return
  }

  isChangingPassword.value = true

  try {
    // TODO: confirmar con el backend la ruta y los nombres de campo (antes esto solo simulaba el cambio)
    await apiRequest('/api/profile/password', {
      method: 'PUT',
      json: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    }, 'Error al cambiar la contraseña')

    form.value.lastPasswordChange = new Date().toISOString()
    savedProfile.value = { ...savedProfile.value, lastPasswordChange: form.value.lastPasswordChange }
    // Al cerrarse, el evento "hidden.bs.modal" limpia el formulario
    passwordModalInstance?.hide()
    showToast('¡Contraseña cambiada exitosamente!', 'success')
  } catch (error: any) {
    showToast(error?.message || 'Error al cambiar la contraseña', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

const resetPasswordForm = () => {
  passwordForm.value = emptyPasswordForm()
  passwordErrors.value = {}
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

/* ============================================================
   Sesiones
   ============================================================ */
const fetchSessions = async () => {
  try {
    const data = await apiRequest('/api/profile/sessions', {}, 'No se pudieron obtener las sesiones')
    sessions.value = Array.isArray(data) ? data : data.sessions ?? data.data ?? []
  } catch (err: any) {
    showToast(err?.message || 'Error cargando sesiones', 'warning')
  }
}

const revokeSession = async (id: string) => {
  if (revokingId.value) return
  revokingId.value = id
  try {
    await apiRequest(`/api/profile/sessions/${id}`, { method: 'DELETE' }, 'No se pudo revocar la sesión')
    await fetchSessions()
    showToast('Sesión revocada', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Error al revocar sesión', 'error')
  } finally {
    revokingId.value = null
  }
}

/* ============================================================
   Modales (una sola instancia por modal; antes se creaba una nueva,
   con su listener, cada vez que se abría)
   ============================================================ */
const getModalInstance = async (el: HTMLElement) => {
  const { Modal } = await import('bootstrap')
  return Modal.getOrCreateInstance(el)
}

const openPasswordModal = async () => {
  if (!passwordModal.value) return
  passwordModalInstance = await getModalInstance(passwordModal.value)
  passwordModalInstance.show()
}

const openSessionsModal = async () => {
  if (!sessionsModal.value) return
  sessionsModalInstance = await getModalInstance(sessionsModal.value)
  sessionsModalInstance.show()
  // Refresca la lista cada vez que se abre
  void fetchSessions()
}

/* ============================================================
   Ciclo de vida
   ============================================================ */
watch(() => ui.state.sidebarCollapsed, () => setLayoutVars())
watch(currentTheme, (t) => {
  document.documentElement.setAttribute('data-bs-theme', t)
})

onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  passwordModal.value?.addEventListener('hidden.bs.modal', resetPasswordForm)
  // Inicializar y mantener actualizadas las variables de layout
  setLayoutVars()
  window.addEventListener('resize', setLayoutVars)
  // Ambas funciones manejan sus propios errores
  await Promise.all([fetchProfile(), fetchSessions()])
  isLoading.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setLayoutVars)
  passwordModal.value?.removeEventListener('hidden.bs.modal', resetPasswordForm)
  passwordModalInstance?.hide()
  sessionsModalInstance?.hide()
})
</script>

<style scoped>
/* ============================================================
   TOKENS (usan las variables globales del tema con respaldo)
   ============================================================ */
.admin-profile-page {
  --pp-primary: var(--color-primary, #1E9E4A);
  --pp-surface: var(--color-light, #ffffff);
  --pp-surface-alt: var(--color-lighter, #f8f9fa);
  --pp-border: var(--color-gray-light, #e9ecef);
  --pp-text: var(--color-dark, #212529);
  --pp-muted: var(--color-gray, #6c757d);
  --pp-radius: 16px;
  --pp-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  --pp-ok: #1e7a3c;
  --bs-border-radius: 10px;

  font-family: 'Montserrat', sans-serif;
  background: var(--lab-bg, #f8f9fa);
  /* avoid forcing viewport-sized container to prevent nested scrollbars */
  min-height: auto;
  overflow: visible;
  transition: background 0.3s ease;
}

[data-bs-theme="dark"] .admin-profile-page {
  --pp-surface: var(--color-light, #121212);
  --pp-surface-alt: var(--color-lighter, #1e1e1e);
  --pp-border: var(--color-gray-light, #2d2d2d);
  --pp-text: var(--color-dark, #f8f9fa);
  --pp-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  --pp-ok: #5fd08a;
  background: var(--lab-bg, #1a1a1a);
}

/* ============================================================
   LAYOUT
   Un solo scroll: el del navegador. Estos contenedores no deben crear el suyo
   (los estilos globales de .admin-layout / .main-content lo hacían y se duplicaba la barra).
   ============================================================ */
.admin-layout,
.main-content {
  height: auto !important;
  min-height: 0 !important;
  overflow: visible !important;
}

.main-content {
  /* Prefer an app-level left margin if provided (App.vue), otherwise no forced margin.
     This avoids double-offsetting when the page is already inside a sidebar-layout. */
  margin-left: var(--app-left-margin, 0);
  width: calc(100% - var(--app-left-margin, 0));
  /* start content as close as possible to navbar: subtract a small buffer */
  padding-top: max(0px, calc(var(--navbar-height, 72px) - 16px));
  padding-bottom: 2rem;
  min-height: auto;
  transition: margin-left 0.3s ease, padding-top 0.2s ease, width 0.3s ease;
}

/* When using the admin layout classes from EventosAdmin, avoid double offsets
   and let the global admin styles control spacing. */
.main-content.admin-content {
  margin-left: 0;
  width: 100%;
}

.main-content > .container-fluid {
  padding-top: 0;
}

@media (max-width: 992px) {
  .main-content {
    margin-left: 0;
  }
}

/* ============================================================
   ENCABEZADO
   ============================================================ */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  font-size: 1.7rem;
  color: var(--pp-primary);
  background: color-mix(in srgb, var(--pp-primary) 12%, transparent);
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  font-weight: 700;
  color: var(--pp-text);
  margin: 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--pp-muted);
  margin: 0.2rem 0 0;
}

/* ============================================================
   TARJETAS
   ============================================================ */
.pp-card {
  background: var(--pp-surface);
  border: 1px solid var(--pp-border);
  border-radius: var(--pp-radius);
  box-shadow: var(--pp-shadow);
  overflow: hidden;
}

.pp-card-head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.15rem 1.5rem;
  background: var(--pp-surface-alt);
  border-bottom: 1px solid var(--pp-border);
}

.pp-card-icon,
.security-icon,
.session-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.15rem;
  color: var(--pp-primary);
  background: color-mix(in srgb, var(--pp-primary) 12%, transparent);
}

.pp-card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--pp-text);
}

.pp-card-sub {
  margin: 0.1rem 0 0;
  font-size: 0.8rem;
  color: var(--pp-muted);
}

.pp-card-body {
  min-width: 0;
  margin: 0;
  padding: 1.5rem;
  border: 0;
}

.pp-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 1.5rem;
  background: var(--pp-surface-alt);
  border-top: 1px solid var(--pp-border);
}

.foot-actions {
  display: flex;
  gap: 0.5rem;
}

.save-state {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--pp-muted);
}

.save-state i { color: #34B565; }
.save-state.dirty { color: var(--pp-text); }
.save-state.dirty i { color: #f0a500; }

/* ============================================================
   RESUMEN (columna izquierda)
   ============================================================ */
.summary-card { text-align: center; }

.summary-banner {
  height: 96px;
  background: linear-gradient(135deg, var(--pp-primary), color-mix(in srgb, var(--pp-primary) 50%, #ffffff));
}

.summary-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1.5rem 1.5rem;
}

.avatar-display {
  position: relative;
  width: 120px;
  height: 120px;
  margin-top: -60px;
}

.avatar-img,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid var(--pp-surface);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.avatar-img { object-fit: cover; }

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--pp-primary), color-mix(in srgb, var(--pp-primary) 55%, #000000));
}

.avatar-status {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--pp-surface);
  border: 2px solid var(--pp-surface);
}

.avatar-status i { font-size: 0.85rem; }

.status-active i { color: #34B565; }
.status-inactive i { color: #6C757D; }
.status-pending i { color: #FFC107; }
.status-suspended i { color: #DC3545; }

.summary-name {
  margin: 0.9rem 0 0;
  font-family: 'Playfair Display', serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--pp-text);
  overflow-wrap: anywhere;
}

.summary-email {
  margin: 0.2rem 0 0;
  font-size: 0.88rem;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.summary-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pp-text);
  background: var(--pp-surface-alt);
  border: 1px solid var(--pp-border);
}

.status-chip i { font-size: 0.55rem; }

.avatar-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.summary-hint {
  margin: 0.85rem 0 0;
  font-size: 0.75rem;
  color: var(--pp-muted);
}

/* Role Badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.8rem;
}

.role-superadmin,
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

/* Estos dos roles existían en el tipo pero no tenían estilo */
.role-technical,
.role-support {
  background: rgba(13, 110, 253, 0.1);
  color: #0b5ed7;
  border: 1px solid rgba(13, 110, 253, 0.2);
}

[data-bs-theme="dark"] .role-technical,
[data-bs-theme="dark"] .role-support {
  color: #6ea8fe;
}

/* ============================================================
   FORMULARIO
   ============================================================ */
.form-section-title {
  margin: 0 0 0.9rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--pp-muted);
}

.form-section-title:not(:first-child) {
  margin-top: 1.6rem;
  padding-top: 1.4rem;
  border-top: 1px dashed var(--pp-border);
}

.form-label {
  margin-bottom: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--pp-text);
}

.form-label.required::after {
  content: ' *';
  color: #DC3545;
}

.form-control {
  border: 2px solid var(--pp-border);
  background: var(--card-bg, var(--pp-surface));
  color: var(--pp-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  border-color: var(--pp-primary);
  box-shadow: 0 0 0 0.25rem color-mix(in srgb, var(--pp-primary) 22%, transparent);
  background: var(--card-bg, var(--pp-surface));
}

.form-control.is-invalid {
  border-color: #DC3545;
}

.form-control[readonly] {
  background: var(--pp-surface-alt);
}

.input-group-text {
  border: 2px solid var(--pp-border);
  background: var(--pp-surface-alt);
  color: var(--pp-muted);
}

.input-group:focus-within .input-group-text {
  border-color: var(--pp-primary);
  color: var(--pp-primary);
}

.input-group > .btn {
  border-width: 2px;
}

.form-text {
  font-size: 0.75rem;
  color: var(--pp-muted);
}

.form-text.text-success { color: var(--pp-ok) !important; }

fieldset:disabled .form-control,
fieldset:disabled .input-group-text {
  opacity: 0.6;
}

/* ============================================================
   SEGURIDAD
   ============================================================ */
.security-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.security-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
}

.security-row + .security-row {
  border-top: 1px solid var(--pp-border);
}

.security-icon {
  width: 46px;
  height: 46px;
  font-size: 1.3rem;
}

.security-text {
  flex: 1 1 200px;
  min-width: 0;
}

.security-text h3 {
  margin: 0 0 0.15rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--pp-text);
}

.security-text p {
  margin: 0;
  font-size: 0.84rem;
  color: var(--pp-muted);
}

.security-text .state-ok { color: var(--pp-ok); font-weight: 600; }
.security-text .state-off { color: #DC3545; font-weight: 600; }

.form-check-input:checked {
  background-color: var(--pp-primary);
  border-color: var(--pp-primary);
}

/* ============================================================
   MODALES
   ============================================================ */
.modal-content {
  background: var(--pp-surface);
  border: 1px solid var(--pp-border);
  border-radius: 18px;
  color: var(--pp-text);
}

.modal-header {
  border-bottom: 1px solid var(--pp-border);
  padding: 1.1rem 1.5rem;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--pp-text);
}

.modal-title i { color: var(--pp-primary); }
.modal-body { padding: 1.5rem; }

/* Medidor y requisitos de contraseña */
.strength {
  display: flex;
  gap: 0.35rem;
  margin: 0.7rem 0 0.55rem;
}

.strength span {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: var(--pp-border);
  transition: background 0.25s ease;
}

.strength[data-level="1"] span.on { background: #DC3545; }
.strength[data-level="2"] span.on { background: #fd7e14; }
.strength[data-level="3"] span.on { background: #FFC107; }
.strength[data-level="4"] span.on { background: #34B565; }

.rule-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.78rem;
  color: var(--pp-muted);
}

.rule-list li.ok { color: var(--pp-ok); }

/* Sesiones */
.session-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--pp-border);
  border-radius: 12px;
  background: var(--pp-surface-alt);
}

.session-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.session-info strong {
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-info small {
  color: var(--pp-muted);
  font-size: 0.78rem;
}

/* ============================================================
   SKELETON
   ============================================================ */
.skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(128,128,128,0.12) 25%, rgba(128,128,128,0.22) 37%, rgba(128,128,128,0.12) 63%);
  background-size: 400% 100%;
  animation: pp-shimmer 1.4s ease infinite;
}

.skeleton-title { width: 60%; height: 22px; margin-top: 0.9rem; }
.skeleton-line { width: 75%; height: 14px; margin-top: 0.55rem; }

@keyframes pp-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .main-content {
    padding-top: var(--navbar-height, 72px);
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 576px) {
  .main-content {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .pp-card-head,
  .pp-card-body,
  .pp-card-foot,
  .security-row {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .foot-actions { width: 100%; }
  .foot-actions .btn { flex: 1; }
  .rule-list { grid-template-columns: 1fr; }
  .avatar-display { width: 104px; height: 104px; margin-top: -52px; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
  .strength span,
  .form-control { transition: none; }
}
</style>
