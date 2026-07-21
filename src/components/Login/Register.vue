<template>
  <div :data-bs-theme="currentTheme" class="register-page">
    <div class="register-container">
      <div class="register-wrapper">
        <!-- Image Section -->
        <div class="register-image-section">
          <div class="image-overlay"></div>
          <div class="image-content">
            <div class="content-wrapper">
              <div class="image-eyebrow">SENA</div>
              <h2 class="welcome-title">Bienvenido</h2>
              <p class="welcome-subtitle">
                Regístrate para gestionar tus análisis, consultar resultados
                y administrar tus servicios de ensayos de aptitud.
              </p>

              <div class="features-list">
                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <h5>Seguridad Garantizada</h5>
                    <p>Tus datos están protegidos con encriptación de última generación.</p>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-speedometer2"></i>
                  </div>
                  <div>
                    <h5>Acceso Rápido</h5>
                    <p>Consulta tus resultados en tiempo real desde cualquier dispositivo.</p>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-headset"></i>
                  </div>
                  <div>
                    <h5>Soporte Técnico</h5>
                    <p>Nuestro equipo está disponible para resolver tus dudas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="register-form-section">
          <div class="form-container">
            <div class="form-header">
              <span class="section-eyebrow">Registro</span>
              <h1 class="form-title">Crear Cuenta</h1>
              <div class="title-underline centered"></div>
              <p class="form-subtitle">
                Regístrate para acceder a nuestros servicios y gestionar tus ensayos
              </p>
            </div>

            <form @submit.prevent="handleRegister" class="register-form">
              <!-- Nombre -->
              <div class="form-group">
                <label for="name" class="form-label">
                  <i class="bi bi-person"></i>
                  <span>Nombre</span>
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.name }"
                  placeholder="Tu nombre"
                  required
                  @input="clearError('name')"
                >
                <div v-if="errors.name" class="error-message">
                  <i class="bi bi-exclamation-circle"></i>
                  {{ errors.name }}
                </div>
              </div>

              <!-- Primer Apellido -->
              <div class="form-row">
                <div class="form-group">
                  <label for="primer" class="form-label">
                    <i class="bi bi-person-vcard"></i>
                    <span>Primer apellido</span>
                  </label>
                  <input
                    id="primer"
                    v-model="form.primer_apellido"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': errors.primer_apellido }"
                    placeholder="Primer apellido"
                    required
                    @input="clearError('primer_apellido')"
                  >
                  <div v-if="errors.primer_apellido" class="error-message">
                    <i class="bi bi-exclamation-circle"></i>
                    {{ errors.primer_apellido }}
                  </div>
                </div>

                <!-- Segundo Apellido -->
                <div class="form-group">
                  <label for="segundo" class="form-label">
                    <i class="bi bi-person-vcard"></i>
                    <span>Segundo apellido</span>
                  </label>
                  <input
                    id="segundo"
                    v-model="form.segundo_apellido"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': errors.segundo_apellido }"
                    placeholder="Segundo apellido"
                    required
                    @input="clearError('segundo_apellido')"
                  >
                  <div v-if="errors.segundo_apellido" class="error-message">
                    <i class="bi bi-exclamation-circle"></i>
                    {{ errors.segundo_apellido }}
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email" class="form-label">
                  <i class="bi bi-envelope"></i>
                  <span>Correo electrónico</span>
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  :class="{ 'input-error': errors.email }"
                  placeholder="correo@ejemplo.com"
                  autocomplete="email"
                  required
                  @input="clearError('email')"
                >
                <div v-if="form.email && emailValid" class="validation-success">
                  <i class="bi bi-check-circle-fill"></i>
                  Correo con formato válido
                </div>
                <div v-if="form.email && !emailValid" class="validation-hint">
                  <i class="bi bi-info-circle"></i>
                  Formato de correo inválido
                </div>
                <div v-if="errors.email" class="error-message">
                  <i class="bi bi-exclamation-circle"></i>
                  {{ errors.email }}
                </div>
              </div>

              <!-- Contraseña -->
              <div class="form-group">
                <label for="password" class="form-label">
                  <i class="bi bi-lock"></i>
                  <span>Contraseña</span>
                </label>
                <div class="password-wrapper">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    :class="{ 'input-error': errors.password }"
                    placeholder="Ingresa tu contraseña"
                    required
                    @input="clearError('password')"
                  >
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                    tabindex="-1"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>

                <!-- Reglas de contraseña -->
                <div v-if="form.password" class="password-rules">
                  <div :class="['rule-item', { passed: passwordRules.minLen }]">
                    <i :class="passwordRules.minLen ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div :class="['rule-item', { passed: passwordRules.upper }]">
                    <i :class="passwordRules.upper ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    <span>Una mayúscula</span>
                  </div>
                  <div :class="['rule-item', { passed: passwordRules.lower }]">
                    <i :class="passwordRules.lower ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    <span>Una minúscula</span>
                  </div>
                  <div :class="['rule-item', { passed: passwordRules.digit }]">
                    <i :class="passwordRules.digit ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    <span>Un número</span>
                  </div>
                  <div :class="['rule-item', { passed: passwordRules.special }]">
                    <i :class="passwordRules.special ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    <span>Un carácter especial (@ $ ! % * ? & . # -)</span>
                  </div>
                </div>

                <div v-if="errors.password" class="error-message">
                  <i class="bi bi-exclamation-circle"></i>
                  {{ errors.password }}
                </div>
              </div>

              <!-- Confirmar Contraseña -->
              <div class="form-group">
                <label for="confirm" class="form-label">
                  <i class="bi bi-lock-fill"></i>
                  <span>Confirmar contraseña</span>
                </label>
                <input
                  id="confirm"
                  v-model="form.confirmPassword"
                  type="password"
                  class="form-input"
                  :class="{ 'input-error': errors.confirmPassword }"
                  placeholder="Repite la contraseña"
                  required
                  @input="clearError('confirmPassword')"
                >
                <div v-if="errors.confirmPassword" class="error-message">
                  <i class="bi bi-exclamation-circle"></i>
                  {{ errors.confirmPassword }}
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn-register"
                :disabled="isLoading"
              >
                <template v-if="isLoading">
                  <span class="spinner"></span>
                  Registrando...
                </template>
                <template v-else>
                  <span>Crear Cuenta</span>
                  <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </template>
              </button>

              <!-- Login Link -->
              <div class="login-link-section">
                <p class="login-link-text">
                  ¿Ya tienes cuenta?
                  <router-link to="/login" class="login-link">
                    Inicia sesión
                  </router-link>
                </p>
              </div>
            </form>

            <!-- Security Info -->
            <div class="security-info">
              <div class="security-item">
                <i class="bi bi-lock-fill"></i>
                <span>Conexión segura</span>
              </div>
              <div class="security-item">
                <i class="bi bi-shield-fill-check"></i>
                <span>Datos protegidos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificaciones -->
    <Teleport to="body">
      <div v-if="showToast" class="toast-notification" :class="toastType">
        <div class="toast-icon">
          <i :class="toastIconClass"></i>
        </div>
        <div class="toast-content">
          <p>{{ toastMessage }}</p>
        </div>
        <button class="toast-close" @click="showToast = false">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'

type ToastType = 'success' | 'info' | 'warning' | 'error'

interface RegisterForm {
  name: string
  primer_apellido: string
  segundo_apellido: string
  email: string
  password: string
  confirmPassword: string
}

const router = useRouter()
const { currentTheme } = useTheme()

const form = ref<RegisterForm>({
  name: '',
  primer_apellido: '',
  segundo_apellido: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(false)
const showPassword = ref(false)

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
let toastTimer: number | null = null


const toastIconClass = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle-fill',
    'info': 'bi bi-info-circle-fill',
    'warning': 'bi bi-exclamation-triangle-fill',
    'error': 'bi bi-x-circle-fill'
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill'
})

// API base URL (use Vite env variable VITE_API_BASE or fallback)
import { API_BASE } from '@/config/api'
import { useTheme } from '@/composables/useTheme'

// Dynamic field validators
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emailValid = computed(() => emailRegex.test(form.value.email))

const passwordRules = computed(() => {
  const pw = form.value.password || ''
  return {
    minLen: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    special: /[@$!%*?&.#-]/.test(pw),
  }
})

const displayToast = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const clearError = (field: string) => {
  if (errors.value[field]) delete errors.value[field]
}

const validate = (): boolean => {
  errors.value = {}
  let ok = true

  if (!form.value.name.trim()) {
    errors.value.name = 'El nombre es requerido'
    ok = false
  }
  if (!form.value.primer_apellido.trim()) {
    errors.value.primer_apellido = 'El primer apellido es requerido'
    ok = false
  }
  if (!form.value.segundo_apellido.trim()) {
    errors.value.segundo_apellido = 'El segundo apellido es requerido'
    ok = false
  }
  if (!form.value.email.trim()) {
    errors.value.email = 'El correo es requerido'
    ok = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Correo inválido'
    ok = false
  }
  if (!form.value.password) {
    errors.value.password = 'La contraseña es requerida'
    ok = false
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Mínimo 8 caracteres'
    ok = false
  } else if (!Object.values(passwordRules.value).every(Boolean)) {
    errors.value.password = 'La contraseña no cumple todos los requisitos'
    ok = false
  }
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
    ok = false
  }

  return ok
}

const handleRegister = async () => {
  errors.value = {}
  if (!validate()) {
    displayToast('Corrige los errores del formulario', 'warning')
    return
  }

  isLoading.value = true

  try {
    const payload = {
      nombre: form.value.name.trim(),
      primer_apellido: form.value.primer_apellido.trim(),
      segundo_apellido: form.value.segundo_apellido.trim(),
      id_rol: 'C',
      correo: form.value.email.trim().toLowerCase(),
      contrasena: form.value.password,
    }

    const resp = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (resp.ok) {
      displayToast('Usuario creado exitosamente. Redirigiendo...', 'success')
      setTimeout(() => router.push('/login'), 1500)
      return
    }

    const body = await resp.json().catch(() => ({}))

    if (resp.status === 409) {
      errors.value.email = body.message || 'Correo ya registrado'
      displayToast(body.message || 'Correo ya registrado', 'warning')
    } else if (resp.status === 400 && body.errors) {
      body.errors.forEach((it: any) => {
        if (it.path) errors.value[it.path] = it.message
      })
      displayToast('Corrige los errores del formulario', 'warning')
    } else {
      displayToast(body.message || 'Error al registrar. Intenta más tarde.', 'error')
    }
  } catch (e) {
    displayToast('Error de red. Intenta más tarde.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
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

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ============================================================
   BASE
   ============================================================ */
.register-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

[data-bs-theme="dark"] .register-page {
  background: #0c0f0a;
}

.register-container {
  width: 100%;
  max-width: none;
  padding: 0;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.register-wrapper {
  display: flex;
  width: 100%;
  max-width: none;
  background: #ffffff;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  border: 1px solid var(--sena-border);
  min-height: 100vh;
}

[data-bs-theme="dark"] .register-wrapper {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
  box-shadow: 0 4px 40px rgba(0,0,0,0.3);
}

/* ============================================================
   IMAGE SECTION
   ============================================================ */
.register-image-section {
  flex: 1;
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 2rem 1.25rem;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(93,138,47,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(122,171,61,0.08) 0%, transparent 40%);
  pointer-events: none;
}

.image-content {
  position: relative;
  z-index: 2;
  max-width: 440px;
}

.content-wrapper {
  animation: fadeInLeft 0.8s ease-out;
}

.image-eyebrow {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(122,171,61,0.85);
  background: rgba(122,171,61,0.15);
  padding: 0.28rem 0.9rem;
  border-radius: 20px;
  margin-bottom: 1rem;
}

.welcome-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.15;
}

.welcome-subtitle {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.65;
  margin-bottom: 2.5rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.feature-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
  color: var(--sena-green-light);
  backdrop-filter: blur(8px);
}

.feature-item h5 {
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.feature-item p {
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
  line-height: 1.5;
  margin: 0;
}

/* ============================================================
   FORM SECTION
   ============================================================ */
.register-form-section {
  flex: 1;
  padding: 2rem 2rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 440px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  background: var(--sena-green-pale);
  padding: 0.28rem 0.9rem;
  border-radius: 20px;
  margin-bottom: 0.8rem;
}

[data-bs-theme="dark"] .section-eyebrow {
  background: rgba(93,138,47,0.18);
}

.form-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .form-title { color: #f0f5ea; }

.title-underline {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
}

.form-subtitle {
  font-size: 0.88rem;
  color: var(--sena-muted);
  margin-top: 0.75rem;
}

/* ============================================================
   FORM STYLES
   ============================================================ */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .form-label { color: #e0ecd6; }

.form-label i {
  color: var(--sena-green);
  font-size: 0.85rem;
}

[data-bs-theme="dark"] .form-label i { color: var(--sena-green-light); }

.form-input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1.5px solid #e0e5da;
  border-radius: var(--radius-sm);
  background: #fcfdfb;
  color: var(--sena-text);
  font-family: var(--font-body);
  font-size: 0.88rem;
  transition: var(--transition);
  outline: none;
}

[data-bs-theme="dark"] .form-input {
  background: #1a2412;
  border-color: rgba(122,171,61,0.2);
  color: #e8ede3;
}

.form-input:focus {
  border-color: var(--sena-green-light);
  box-shadow: 0 0 0 3px rgba(93,138,47,0.1);
}

.form-input.input-error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--sena-muted);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.1rem;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: var(--sena-green);
}

[data-bs-theme="dark"] .password-toggle:hover { color: var(--sena-green-light); }

.validation-success {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #16a34a;
  margin-top: 0.25rem;
}

.validation-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--sena-muted);
  margin-top: 0.25rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

.error-message i { font-size: 0.85rem; }

/* ============================================================
   PASSWORD RULES
   ============================================================ */
.password-rules {
  background: #f8faf7;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-sm);
  padding: 0.75rem 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

[data-bs-theme="dark"] .password-rules {
  background: rgba(93,138,47,0.08);
  border-color: rgba(122,171,61,0.15);
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--sena-muted);
  transition: var(--transition);
}

.rule-item.passed {
  color: #16a34a;
}

[data-bs-theme="dark"] .rule-item.passed {
  color: #4ade80;
}

.rule-item i {
  font-size: 0.7rem;
  flex-shrink: 0;
}

/* ============================================================
   REGISTER BUTTON
   ============================================================ */
.btn-register {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-green);
  margin-top: 0.5rem;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Forzar contraste en modo claro (sobreescribe clases de Bootstrap si es necesario) */
.register-page[data-bs-theme="light"] .btn-register,
.register-page[data-bs-theme="light"] .btn.btn-primary.btn-register {
  background: linear-gradient(135deg, #3e6b1f 0%, #6b8f2e 100%);
  color: #ffffff !important;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 30px rgba(93,138,47,0.16);
  z-index: 2;
}

.register-page[data-bs-theme="light"] .btn-register:hover:not(:disabled) {
  box-shadow: 0 14px 40px rgba(93,138,47,0.22);
}

.btn-register:hover:not(:disabled) .btn-arrow {
  transform: translateX(3px);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   LOGIN LINK
   ============================================================ */
.login-link-section {
  text-align: center;
}

.login-link-text {
  font-size: 0.88rem;
  color: var(--sena-muted);
  margin: 0;
}

.login-link {
  color: var(--sena-green);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}

[data-bs-theme="dark"] .login-link { color: var(--sena-green-light); }

.login-link:hover {
  text-decoration: underline;
}

/* ============================================================
   SECURITY INFO
   ============================================================ */
.security-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--sena-border);
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--sena-muted);
  font-weight: 500;
}

.security-item i {
  color: var(--sena-green);
  font-size: 0.85rem;
}

[data-bs-theme="dark"] .security-item i { color: var(--sena-green-light); }

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ffffff;
  border-radius: var(--radius-sm);
  padding: 1rem 1.25rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  border: 1px solid var(--sena-border);
  z-index: 9999;
  animation: slideInUp 0.35s ease-out;
  max-width: 420px;
}

[data-bs-theme="dark"] .toast-notification {
  background: #1a2412;
  border-color: rgba(122,171,61,0.2);
}

.toast-notification.success { border-left: 4px solid #16a34a; }
.toast-notification.info { border-left: 4px solid #2563eb; }
.toast-notification.warning { border-left: 4px solid #d97706; }
.toast-notification.error { border-left: 4px solid #dc2626; }

.toast-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.toast-notification.success .toast-icon { color: #16a34a; }
.toast-notification.info .toast-icon { color: #2563eb; }
.toast-notification.warning .toast-icon { color: #d97706; }
.toast-notification.error .toast-icon { color: #dc2626; }

.toast-content p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--sena-text);
  line-height: 1.4;
}

[data-bs-theme="dark"] .toast-content p { color: #e8ede3; }

.toast-close {
  background: transparent;
  border: none;
  color: var(--sena-muted);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.1rem;
  transition: var(--transition);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: var(--sena-text);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .register-wrapper {
    flex-direction: column;
    min-height: auto;
  }

  .register-image-section {
    padding: 2.5rem 2rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .features-list {
    gap: 1.25rem;
  }

  .register-form-section {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 768px) {
  .register-container {
    padding: 0;
  }

  .register-wrapper {
    border-radius: 0;
    min-height: 100vh;
  }

  .register-image-section {
    padding: 2rem 1.5rem;
  }

  .register-form-section {
    padding: 2rem 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .security-info {
    gap: 1.25rem;
  }

  .toast-notification {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .register-form-section {
    padding: 1.5rem 1rem;
  }

  .form-header {
    margin-bottom: 1.5rem;
  }
}
</style>
