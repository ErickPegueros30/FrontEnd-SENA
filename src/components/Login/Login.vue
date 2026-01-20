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
                Accede a tu cuenta para gestionar tus análisis,
                consultar resultados y administrar tus servicios.
              </p>

              <div class="features-list">
                <div class="feature-item">
                  <i class="bi bi-shield-check"></i>
                  <div>
                    <h5>Seguridad garantizada</h5>
                    <p>Tus datos están protegidos con encriptación de última generación</p>
                  </div>
                </div>

                <div class="feature-item">
                  <i class="bi bi-speedometer2"></i>
                  <div>
                    <h5>Acceso rápido</h5>
                    <p>Consulta tus resultados en tiempo real desde cualquier dispositivo</p>
                  </div>
                </div>

                <div class="feature-item">
                  <i class="bi bi-headset"></i>
                  <div>
                    <h5>Soporte 24/7</h5>
                    <p>Nuestro equipo está disponible para resolver tus dudas</p>
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
import { useRouter } from 'vue-router'
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

  // Mostrar notificación
  showToast(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

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
  if (!validateForm()) {
    showToast('Por favor, corrige los errores en el formulario', 'warning')
    return
  }

  isLoading.value = true

  try {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Aquí iría la lógica real de autenticación
    // const response = await authApi.login(form.value)

    // Guardar token si se seleccionó "Recordar sesión"
    if (form.value.remember) {
      localStorage.setItem('auth_token', 'simulated_token')
      localStorage.setItem('user_email', form.value.email)
    } else {
      sessionStorage.setItem('auth_token', 'simulated_token')
      sessionStorage.setItem('user_email', form.value.email)
    }

    showToast('¡Inicio de sesión exitoso! Redirigiendo...', 'success')

    // Redirigir al dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)

  } catch (error: any) {
    // Manejo de errores
    const errorMessage = error?.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
    errors.value.email = errorMessage
    errors.value.password = errorMessage
    showToast(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}

const loginWithGoogle = () => {
  showToast('Inicio de sesión con Google (simulado)', 'info')
  // Implementar OAuth con Google
}

const loginWithMicrosoft = () => {
  showToast('Inicio de sesión con Microsoft (simulado)', 'info')
  // Implementar OAuth con Microsoft
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

// Cargar email guardado si existe
const loadSavedEmail = () => {
  const savedEmail = localStorage.getItem('user_email')
  if (savedEmail) {
    form.value.email = savedEmail
    form.value.remember = true
  }
}

onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Detectar tema del sistema
  detectSystemTheme()

  // Cargar email guardado
  loadSavedEmail()

  // Escuchar cambios del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = e.matches ? 'dark' : 'light'
    }
  })
})
</script>

<style scoped>
.login-page {
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
  padding-top: 0; /* use app's --navbar-height on #app-view */
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .login-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */
.login-header {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 2px 10px var(--shadow-color, rgba(0, 0, 0, 0.05));
  position: sticky;
  top: 0;
  z-index: 100;
}

[data-bs-theme="dark"] .login-header {
  background: var(--color-light, #121212);
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.brand-logo {
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.theme-toggle-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border: 1px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-dark, #212529);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

[data-bs-theme="dark"] .theme-toggle-btn {
  border: 1px solid var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

theme-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary, #a6b828);
}

/* Main Container */
.login-container {
  min-height: calc(100vh - var(--navbar-height, 72px));
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0; /* full-bleed layout */
  width: 100%;
}

.login-wrapper {
  display: flex;
  width: 100%;
  max-width: none;    /* allow full width */
  min-height: calc(100vh - var(--navbar-height, 72px));
  background: var(--color-light, white);
  border-radius: 0;   /* full-bleed */
  overflow: auto;     /* allow internal scroll when needed */
  box-shadow: none;   /* optional: remove heavy shadow for full-screen */
}

[data-bs-theme="dark"] .login-wrapper {
  background: var(--color-light, #121212);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Image Section */
.login-image-section {
  flex: 1;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: white;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.8) 0%, rgba(166, 184, 40, 0.6) 100%);
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
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  line-height: 1.6;
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
  gap: 1.5rem;
  animation: fadeInUp 0.8s ease-out;
}

.feature-item i {
  font-size: 2rem;
  color: #FFD700;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.feature-item h5 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.feature-item p {
  opacity: 0.8;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.testimonial {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  animation: fadeInUp 1.2s ease-out;
}

.testimonial-content i {
  font-size: 2.5rem;
  color: #FFD700;
  opacity: 0.5;
  margin-bottom: 1rem;
  display: block;
}

.testimonial-content p {
  font-style: italic;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
}

.testimonial-author strong {
  color: white;
  font-size: 1rem;
}

.testimonial-author span {
  opacity: 0.8;
  font-size: 0.9rem;
}

/* Form Section */
.login-form-section {
  flex: 1;
  padding: 4rem;
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
  margin-bottom: 3rem;
}

.form-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-bs-theme="dark"] .form-title {
  color: var(--color-dark, #F8F9FA);
}

.form-subtitle {
  color: var(--color-gray, #6C757D);
  font-size: 1rem;
}

[data-bs-theme="dark"] .form-subtitle {
  color: var(--color-gray, #6C757D);
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
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .form-label {
  color: var(--color-dark, #F8F9FA);
}

.form-label i {
  color: var(--color-primary, #a6b828);
}

.input-group {
  border-radius: 10px;
  overflow: hidden;
}

.form-control {
  padding: 0.875rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  font-size: 1rem;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .form-control {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.form-control:focus {
  border-color: var(--color-primary, #a6b828);
  box-shadow: 0 0 0 0.25rem rgba(166, 184, 40, 0.25);
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .form-control:focus {
  background: var(--card-bg, #2d2d2d);
}

.input-group-text {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-left: none;
  color: var(--color-primary, #a6b828);
  padding: 0 1rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.form-check-input:checked {
  background-color: var(--color-primary, #a6b828);
  border-color: var(--color-primary, #a6b828);
}

.form-check-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  cursor: pointer;
}

.forgot-link {
  color: var(--color-primary, #a6b828);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: var(--color-primary-dark, #a6b828);
  text-decoration: underline;
}

/* Login Button */
.btn-login {
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border: none;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(166, 184, 40, 0.3);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: var(--color-gray, #6C757D);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.divider span {
  padding: 0 1rem;
  font-size: 0.9rem;
}

/* Social Login */
.social-login {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-outline-google,
.btn-outline-microsoft {
  flex: 1;
  padding: 0.875rem;
  border-radius: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.btn-outline-google {
  border: 2px solid #DB4437;
  color: #DB4437;
}

.btn-outline-google:hover {
  background: #DB4437;
  color: white;
  transform: translateY(-2px);
}

.btn-outline-microsoft {
  border: 2px solid #00A4EF;
  color: #00A4EF;
}

.btn-outline-microsoft:hover {
  background: #00A4EF;
  color: white;
  transform: translateY(-2px);
}

/* Register Section */
.register-section {
  text-align: center;
  margin: 2rem 0;
}

.register-text {
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  margin: 0;
}

.register-link {
  color: var(--color-primary, #a6b828);
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: var(--color-primary-dark, #a6b828);
  text-decoration: underline;
}

/* Security Info */
.security-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
}

.security-item i {
  color: var(--color-primary, #a6b828);
  font-size: 1rem;
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

  .social-login {
    flex-direction: column;
  }

  .security-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .login-header .container {
    padding: 0 1rem;
  }

  .brand-name {
    font-size: 1.25rem;
  }

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

/* Tablet Landscape Optimizations */
@media (min-width: 768px) and (max-width: 1199px) and (orientation: landscape) {
  .login-container {
    padding: 1rem;
  }

  .login-wrapper {
    height: 550px;
  }

  .login-image-section {
    padding: 2rem;
  }

  .login-form-section {
    padding: 2rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .features-list {
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .feature-item {
    gap: 1rem;
  }

  .feature-item i {
    font-size: 1.5rem;
  }

  .testimonial {
    padding: 1.5rem;
  }
}
</style>
