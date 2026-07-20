<template>
  <div :data-bs-theme="currentTheme" class="login-page">
    <!-- Main Content -->
    <div class="login-container">
      <div class="login-wrapper">
        <!-- Image Section -->
        <div class="login-image-section">
          <div class="image-overlay"></div>
          <div class="image-content">
            <div class="content-wrapper">
              <h2 class="welcome-title">Bienvenido a SENA</h2>
              <p class="welcome-subtitle">
                Accede a tu cuenta para gestionar tus servicios, consultar tus informes
                y administrar tus ensayos.
              </p>

              <div class="features-list">
                <div class="feature-item">
                  <i class="bi bi-shield-check"></i>
                  <div>
                    <h5>Seguridad garantizada</h5>
                    <p>Tus datos están protegidos con encriptación de última generación.</p>
                  </div>
                </div>

                <div class="feature-item">
                  <i class="bi bi-speedometer2"></i>
                  <div>
                    <h5>Acceso rápido</h5>
                    <p>Gestiona tus servicios, consultar tus informes, resultados y administrar tus ensayos.</p>
                  </div>
                </div>

                <div class="feature-item">
                  <i class="bi bi-headset"></i>
                  <div>
                    <h5>Servicio al cliente</h5>
                    <p>Nuestros principales servicios son los ensayos de aptitud, los cursos, asesorías y auditorias.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="login-form-section">
          <div class="form-container">
            <div class="form-header">
              <h1 class="form-title">Iniciar Sesión</h1>
              <p class="form-subtitle">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
              <div v-if="blockedMessage" class="alert alert-danger d-flex align-items-center" role="alert" style="margin-bottom:1rem">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{{ blockedMessage }}</div>
              </div>
              <!-- Email -->
              <div class="form-group">
                <label for="email" class="form-label">
                  <i class="bi bi-envelope"></i>
                  <span>Correo electrónico *</span>
                </label>
                <div class="input-group">
                  <input
                    v-model="form.email"
                    type="email"
                    id="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="correo@ejemplo.com"
                    autocomplete="email"
                    required
                    @input="clearError('email')"
                  >
                  <span class="input-group-text">
                    <i class="bi bi-at"></i>
                  </span>
                </div>
                <div v-if="errors.email" class="invalid-feedback d-block">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Password -->
              <div class="form-group">
                <label for="password" class="form-label">
                  <i class="bi bi-lock"></i>
                  <span>Contraseña *</span>
                </label>
                <div class="input-group">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Ingresa tu contraseña"
                    autocomplete="current-password"
                    required
                    :disabled="!!blockedMessage"
                    @input="clearError('password')"
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback d-block">
                  {{ errors.password }}
                </div>
              </div>

              <!-- Remember & Forgot -->
              <div class="form-options">
                <div class="form-check">
                  <input
                    v-model="form.remember"
                    type="checkbox"
                    id="remember"
                    class="form-check-input"
                    :disabled="!!blockedMessage"
                  >
                  <label for="remember" class="form-check-label">
                    Recordar sesión
                  </label>
                </div>

                <router-link to="/recuperar-contrasena" class="forgot-link">
                  ¿Olvidaste tu contraseña?
                </router-link>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary btn-login"
                :disabled="isLoading"
              >
                <template v-if="isLoading">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Iniciando sesión...
                </template>
                <template v-else>
                  <i class="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </template>
              </button>

              <!-- Register Link -->
              <div class="register-section">
                <p class="register-text">
                  ¿No tienes una cuenta?
                  <router-link to="/registro" class="register-link">
                    Regístrate aquí
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        id="loginToast"
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
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useAuthStore from '@/compasable/useAuthStore'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

interface FormErrors {
  email?: string
  password?: string
}

// Router
const router = useRouter()
const route = useRoute()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del formulario
const form = ref<LoginForm>({
  email: '',
  password: '',
  remember: false
})

const errors = ref<FormErrors>({})
const isLoading = ref(false)
const showPassword = ref(false)
const blockedMessage = ref<string | null>(null)
const blockedEmail = ref<string | null>(null)

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const toastClass = computed(() => {
  const classes: Record<ToastType, string> = {
    'success': 'bg-success text-white border-0',
    'info': 'bg-info text-white border-0',
    'warning': 'bg-warning text-dark border-0',
    'error': 'bg-danger text-white border-0'
  }
  return classes[toastType.value] || 'bg-info text-white border-0'
})

// API base (use same env var as other components)
import { API_BASE } from '@/config/api'

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
const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = 'El correo electrónico es requerido'
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Ingresa un correo electrónico válido'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'La contraseña es requerida'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  return isValid
}

const clearError = (field: keyof FormErrors) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const handleLogin = async () => {
  if (blockedMessage.value) {
    const tried = form.value.email.trim().toLowerCase()
    if (blockedEmail.value && tried && tried === blockedEmail.value.toLowerCase()) {
      showToast(blockedMessage.value, 'error')
      return
    }
  }
  if (!validateForm()) {
    showToast('Por favor, corrige los errores en el formulario', 'warning')
    return
  }

  isLoading.value = true

  try {
    const payload = { username: form.value.email.trim().toLowerCase(), password: form.value.password }
    const resp = await fetch(`${API_BASE}/api/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })

    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      const msg = body.message || 'Credenciales inválidas'
      if (resp.status === 403 || (msg && /deshabilit/i.test(String(msg)))) {
        blockedMessage.value = 'Tu cuenta ha sido deshabilitada. Contacta al administrador.'
        const blocked = (body.data && body.data.user && (body.data.user.correo || body.data.user.email)) || form.value.email
        blockedEmail.value = blocked ? String(blocked).toLowerCase() : null
        try { localStorage.setItem('auth_blocked_reason', 'disabled'); if (blockedEmail.value) localStorage.setItem('auth_blocked_email', blockedEmail.value) } catch (e) {}
        showToast(blockedMessage.value, 'error')
      } else {
        errors.value.email = msg
        errors.value.password = msg
        showToast(msg, 'error')
      }
      return
    }

    const token = body.data?.token
    const serverUser = body.data?.user || {}

    const mappedUser: any = {
      id: serverUser.id_usuario || serverUser.id || 0,
      nombre: serverUser.nombre || serverUser.firstName || serverUser.name || serverUser.nombre_completo || serverUser.correo || '',
      apellido: serverUser.apellido || serverUser.lastName || '',
      rol: (serverUser.id_rol !== undefined ? String(serverUser.id_rol) : (serverUser.rol || serverUser.role || '') ),
      correo: serverUser.correo || serverUser.email || serverUser.user_email || '' ,
      habilitado: serverUser.habilitado !== undefined ? serverUser.habilitado : (serverUser.activo !== undefined ? serverUser.activo : true)
    }

    const auth = useAuthStore()
    const ok = auth.login({ ...(body.data?.user || {}), ...mappedUser }, token)
    if (!ok) {
      showToast('Tu cuenta está deshabilitada. Contacta al administrador.', 'error')
      return
    }

    const storage = form.value.remember ? localStorage : sessionStorage
    if (token) storage.setItem('auth_token', token)
    if (mappedUser.correo) storage.setItem('user_email', mappedUser.correo)
    if (mappedUser.rol) storage.setItem('user_role', String(mappedUser.rol))
    if (mappedUser.id) storage.setItem('user_id', String(mappedUser.id))

    showToast('¡Inicio de sesión exitoso! Redirigiendo...', 'success')
    setTimeout(() => {
      const role = String(mappedUser.rol)
      if (role === 'A' || role === '1') router.push('/admin')
      else if (role === 'E' || role === '2') router.push('/empleado')
      else if (role === 'C' || role === '3') router.push('/cliente')
      else router.push('/dashboard')
    }, 600)

  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
    errors.value.email = errorMessage
    errors.value.password = errorMessage
    showToast(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}

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

const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = 'dark'
      localStorage.setItem('theme', 'dark')
    }
  }
}

const loadSavedEmail = () => {
  const savedEmail = localStorage.getItem('user_email')
  if (savedEmail) {
    form.value.email = savedEmail
    form.value.remember = true
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  detectSystemTheme()
  loadSavedEmail()

  try {
    const q = String(route.query?.blocked || '')
    const reason = q || (localStorage.getItem('auth_blocked_reason') || '')
    const savedEmail = localStorage.getItem('auth_blocked_email') || ''
    if (reason === 'disabled') {
      blockedMessage.value = 'Tu cuenta ha sido deshabilitada. Contacta al administrador.'
      blockedEmail.value = savedEmail || null
      showToast(blockedMessage.value, 'error')
      try { localStorage.removeItem('auth_blocked_reason') } catch (e) { }
    }
  } catch (e) { }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = e.matches ? 'dark' : 'light'
    }
  })
})
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --radius-card:      20px;
  --radius-sm:        10px;
  --shadow-sm:        0 2px 12px rgba(0,0,0,0.06);
  --shadow-md:        0 8px 32px rgba(0,0,0,0.10);
  --transition:       all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-body:        'DM Sans', 'Segoe UI', sans-serif;
}

/* ============================================================
   BASE
   ============================================================ */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

.login-page {
  font-family: var(--font-body);
  min-height: 100vh;
  padding-top: 0;
  background: #fafaf8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--sena-text);
}

[data-bs-theme="dark"] .login-page {
  background: #0c0f0a;
  color: #e8ede3;
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122,171,61,0.16);
  --sena-green-pale: rgba(93,138,47,0.12);
}

/* Main Container */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  width: 100%;
}

.login-wrapper {
  display: flex;
  width: 100%;
  max-width: none;
  min-height: 100vh;
  background: #ffffff;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
}

[data-bs-theme="dark"] .login-wrapper {
  background: #131a0e;
}

/* Image Section */
.login-image-section {
  flex: 1;
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 2rem 1.25rem;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(93,138,47,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(122,171,61,0.08) 0%, transparent 40%);
}

.image-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
}

.content-wrapper {
  animation: fadeInLeft 1s ease-out;
}

.welcome-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
}

.welcome-subtitle {
  font-size: 1rem;
  opacity: 0.85;
  margin-bottom: 3rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.8);
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  animation: fadeInUp 0.8s ease-out;
}

.feature-item i {
  font-size: 1.6rem;
  color: var(--sena-green-light);
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.feature-item h5 {
  color: #ffffff;
  margin-bottom: 0.35rem;
  font-size: 1rem;
  font-weight: 600;
}

.feature-item p {
  opacity: 0.75;
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.5;
  color: rgba(255,255,255,0.7);
}

/* Form Section */
.login-form-section {
  flex: 1;
  padding: 2rem 2rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 400px;
  animation: fadeInRight 1s ease-out;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .form-title { color: #f0f5ea; }

.form-subtitle {
  color: var(--sena-muted);
  font-size: 0.95rem;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--sena-text);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .form-label { color: #e0ecd6; }

.form-label i {
  color: var(--sena-green);
}

[data-bs-theme="dark"] .form-label i { color: var(--sena-green-light); }

.input-group {
  border-radius: 10px;
  overflow: hidden;
}

.form-control {
  padding: 0.875rem 1rem;
  border: 1.5px solid #e0e5da;
  background: #fcfdfb;
  color: var(--sena-text);
  font-size: 1rem;
  transition: var(--transition);
}

[data-bs-theme="dark"] .form-control {
  background: #1a2412;
  border-color: rgba(122,171,61,0.2);
  color: #e8ede3;
}

.form-control:focus {
  border-color: var(--sena-green-light);
  box-shadow: 0 0 0 0.25rem rgba(93,138,47,0.1);
  background: #ffffff;
}

[data-bs-theme="dark"] .form-control:focus {
  background: #1a2412;
}

.form-control.is-invalid {
  border-color: #dc2626;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 0.25rem rgba(220,38,38,0.1);
}

.input-group-text {
  background: var(--sena-green-pale);
  border: 1.5px solid #e0e5da;
  border-left: none;
  color: var(--sena-green);
  padding: 0 1rem;
}

[data-bs-theme="dark"] .input-group-text {
  background: rgba(93,138,47,0.15);
  border-color: rgba(122,171,61,0.2);
  color: var(--sena-green-light);
}

.invalid-feedback {
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 500;
}

.btn-outline-secondary {
  border: 1.5px solid #e0e5da;
  border-left: none;
  color: var(--sena-muted);
  background: transparent;
}

[data-bs-theme="dark"] .btn-outline-secondary {
  border-color: rgba(122,171,61,0.2);
  color: #8a9e7c;
}

.btn-outline-secondary:hover {
  background: var(--sena-green-pale);
  color: var(--sena-green);
}

[data-bs-theme="dark"] .btn-outline-secondary:hover {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.form-check-input:checked {
  background-color: var(--sena-green);
  border-color: var(--sena-green);
}

.form-check-label {
  color: var(--sena-muted);
  font-size: 0.88rem;
  cursor: pointer;
}

.forgot-link {
  color: var(--sena-green);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  transition: var(--transition);
}

[data-bs-theme="dark"] .forgot-link { color: var(--sena-green-light); }

.forgot-link:hover {
  text-decoration: underline;
}

/* Login Button */
.btn-login {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: auto;
  padding: 0.9rem 1.1rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 50px;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  color: #ffffff;
  border: none;
  transition: var(--transition);
  margin-top: 0.75rem;
  box-shadow: var(--shadow-green);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Mejor contraste y comportamiento en modo oscuro */
[data-bs-theme="dark"] .btn-login {
  background: linear-gradient(135deg, #45702a 0%, #6b8f2e 100%);
  color: #f6fff1;
  box-shadow: 0 8px 28px rgba(46,72,20,0.22);
}

/* Forzar contraste en modo claro y sobreescribir clases de Bootstrap si es necesario */
.login-page[data-bs-theme="light"] .btn-login,
.login-page[data-bs-theme="light"] .btn.btn-primary.btn-login {
  background: linear-gradient(135deg, #3e6b1f 0%, #6b8f2e 100%);
  color: #ffffff !important;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 30px rgba(93,138,47,0.16);
  z-index: 2;
}

.login-page[data-bs-theme="light"] .btn-login:hover:not(:disabled) {
  box-shadow: 0 14px 40px rgba(93,138,47,0.22);
}

.btn-login:focus {
  outline: none;
  box-shadow: 0 0 0 0.28rem rgba(93,138,47,0.18);
}

/* Botón full-width en pantallas pequeñas */
@media (max-width: 576px) {
  .btn-login {
    display: inline-flex;
    width: 100%;
    padding: 0.95rem 1rem;
    font-size: 1rem;
  }
}

/* Register Section */
.register-section {
  text-align: center;
  margin-top: 0.5rem;
}

.register-text {
  color: var(--sena-muted);
  font-size: 0.9rem;
  margin: 0;
}

.register-link {
  color: var(--sena-green);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}

[data-bs-theme="dark"] .register-link { color: var(--sena-green-light); }

.register-link:hover {
  text-decoration: underline;
}

/* Animations */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 992px) {
  .login-wrapper {
    flex-direction: column;
    height: auto;
    max-height: none;
  }

  .login-image-section {
    display: none;
  }

  .login-form-section {
    padding: 3rem 2rem;
  }

  .form-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }

  .login-wrapper {
    border-radius: 15px;
  }

  .login-form-section {
    padding: 2rem 1.5rem;
  }

  .form-container {
    max-width: 100%;
  }

  .form-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 576px) {
  .login-form-section {
    padding: 1.5rem;
  }

  .form-header {
    margin-bottom: 2rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .forgot-link {
    align-self: flex-end;
  }
}
</style>
