<template>
  <div :data-bs-theme="currentTheme" class="recover-page">
    <div class="recover-container">
      <div class="recover-wrapper">
        <!-- Image Section -->
        <div class="recover-image-section">
          <div class="image-overlay"></div>
          <div class="image-content">
            <div class="content-wrapper">
              <div class="image-eyebrow">SENA</div>
              <h2 class="welcome-title">Recuperar Contraseña</h2>
              <p class="welcome-subtitle">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña de forma segura.
              </p>

              <div class="features-list">
                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <h5>Proceso Seguro</h5>
                    <p>Tu información está protegida con encriptación de extremo a extremo.</p>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-clock-history"></i>
                  </div>
                  <div>
                    <h5>Rápido y Sencillo</h5>
                    <p>Recupera tu acceso en menos de 2 minutos desde cualquier dispositivo.</p>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-headset"></i>
                  </div>
                  <div>
                    <h5>Soporte Técnico</h5>
                    <p>Si tienes problemas, nuestro equipo está disponible para ayudarte.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="recover-form-section">
          <div class="form-container">
            <div class="form-header">
              <span class="section-eyebrow">Recuperación</span>
              <h1 class="form-title">Restablecer Contraseña</h1>
              <div class="title-underline centered"></div>
              <p class="form-subtitle">
                Ingresa tu correo electrónico registrado para recibir un enlace de recuperación
              </p>
            </div>

            <!-- Paso 1: Solicitar enlace -->
            <form v-if="!emailSent" @submit.prevent="handleRecover" class="recover-form">
              <div class="form-group">
                <label for="email" class="form-label">
                  <i class="bi bi-envelope"></i>
                  <span>Correo electrónico</span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  class="form-input"
                  :class="{ 'input-error': error }"
                  placeholder="correo@ejemplo.com"
                  autocomplete="email"
                  required
                  @input="clearError"
                >
                <div v-if="error" class="error-message">
                  <i class="bi bi-exclamation-circle"></i>
                  {{ error }}
                </div>
              </div>

              <button
                type="submit"
                class="btn-submit"
                :disabled="isLoading"
              >
                <template v-if="isLoading">
                  <span class="spinner"></span>
                  Enviando enlace...
                </template>
                <template v-else>
                  <span>Enviar Enlace de Recuperación</span>
                  <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </template>
              </button>

              <div class="back-section">
                <router-link to="/login" class="back-link">
                  <i class="bi bi-arrow-left"></i>
                  Volver al inicio de sesión
                </router-link>
              </div>
            </form>

            <!-- Paso 2: Confirmación de envío -->
            <div v-else class="success-state">
              <div class="success-icon">
                <i class="bi bi-envelope-check"></i>
              </div>
              <h3 class="success-title">¡Enlace Enviado!</h3>
              <p class="success-message">
                Hemos enviado un enlace de recuperación a <strong>{{ email }}</strong>.
                Por favor revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
              <p class="success-note">
                Si no encuentras el correo, revisa tu carpeta de spam o solicita uno nuevo.
              </p>

              <div class="success-actions">
                <button class="btn-resend" @click="handleRecover" :disabled="isLoading">
                  <i class="bi bi-arrow-repeat"></i>
                  Reenviar enlace
                </button>
                <router-link to="/login" class="back-link-secondary">
                  <i class="bi bi-arrow-left"></i>
                  Volver al inicio de sesión
                </router-link>
              </div>
            </div>

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
import { ref, computed, type Ref } from 'vue'

type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

const email = ref('')
const error = ref('')
const isLoading = ref(false)
const emailSent = ref(false)

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

const displayToast = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const clearError = () => {
  if (error.value) error.value = ''
}

const validate = (): boolean => {
  error.value = ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.value.trim()) {
    error.value = 'El correo electrónico es requerido'
    return false
  }

  if (!emailRegex.test(email.value)) {
    error.value = 'Ingresa un correo electrónico válido'
    return false
  }

  return true
}

const handleRecover = async () => {
  if (!validate()) {
    displayToast('Por favor, corrige el correo electrónico', 'warning')
    return
  }

  isLoading.value = true

  try {
    // Simulación de envío - Reemplazar con llamada real a la API
    await new Promise(resolve => setTimeout(resolve, 1500))

    emailSent.value = true
    displayToast('Enlace de recuperación enviado exitosamente', 'success')

  } catch (e) {
    displayToast('Error al enviar el enlace. Intenta nuevamente más tarde.', 'error')
  } finally {
    isLoading.value = false
  }
}
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
.recover-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  width: 100%;
}

[data-bs-theme="dark"] .recover-page {
  background: #0c0f0a;
}

.recover-container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

.recover-wrapper {
  display: flex;
  background: #ffffff;
  border-radius: 0;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--sena-border);
  min-height: 100vh;
  width: 100%;
}

[data-bs-theme="dark"] .recover-wrapper {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
  box-shadow: 0 4px 40px rgba(0,0,0,0.3);
}

/* ============================================================
   IMAGE SECTION
   ============================================================ */
.recover-image-section {
  flex: 1 1 50%;
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
  width: 100%;
  max-width: 400px;
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
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
  line-height: 1.15;
}

.welcome-subtitle {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.feature-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
  color: var(--sena-green-light);
  backdrop-filter: blur(8px);
}

.feature-item h5 {
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.feature-item p {
  color: rgba(255,255,255,0.6);
  font-size: 0.78rem;
  line-height: 1.4;
  margin: 0;
}

/* ============================================================
   FORM SECTION
   ============================================================ */
.recover-form-section {
  flex: 1 1 50%;
  padding: 2rem 2rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 380px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  background: var(--sena-green-pale);
  padding: 0.25rem 0.8rem;
  border-radius: 20px;
  margin-bottom: 0.6rem;
}

[data-bs-theme="dark"] .section-eyebrow {
  background: rgba(93,138,47,0.18);
}

.form-title {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.4rem;
}

[data-bs-theme="dark"] .form-title { color: #f0f5ea; }

.title-underline {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
}
.title-underline.centered { margin: 0.5rem auto 0; }

.form-subtitle {
  font-size: 0.82rem;
  color: var(--sena-muted);
  margin-top: 0.6rem;
  line-height: 1.5;
}

/* ============================================================
   FORM STYLES
   ============================================================ */
.recover-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
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

.error-message {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.2rem;
}

.error-message i { font-size: 0.8rem; }

/* ============================================================
   SUBMIT BUTTON
   ============================================================ */
.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-green);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Forzar contraste en modo claro para el botón de envío */
.recover-page[data-bs-theme="light"] .btn-submit,
.recover-page[data-bs-theme="light"] .btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #3e6b1f 0%, #6b8f2e 100%);
  color: #ffffff !important;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 30px rgba(93,138,47,0.16);
  z-index: 2;
}

.recover-page[data-bs-theme="light"] .btn-submit:focus {
  outline: none;
  box-shadow: 0 0 0 0.28rem rgba(93,138,47,0.12);
}

.btn-arrow {
  width: 15px;
  height: 15px;
  transition: transform 0.22s ease;
}

.btn-submit:hover:not(:disabled) .btn-arrow {
  transform: translateX(3px);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   BACK LINK
   ============================================================ */
.back-section {
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--sena-green);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

[data-bs-theme="dark"] .back-link { color: var(--sena-green-light); }

.back-link:hover {
  text-decoration: underline;
}

/* ============================================================
   SUCCESS STATE
   ============================================================ */
.success-state {
  text-align: center;
  animation: fadeInUp 0.5s ease-out;
}

.success-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--sena-green-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 2.2rem;
  color: var(--sena-green);
}

[data-bs-theme="dark"] .success-icon {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.success-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.75rem;
}

[data-bs-theme="dark"] .success-title { color: #f0f5ea; }

.success-message {
  font-size: 0.85rem;
  color: var(--sena-muted);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.success-message strong {
  color: var(--sena-text);
  font-weight: 600;
}

[data-bs-theme="dark"] .success-message strong { color: #e0ecd6; }

.success-note {
  font-size: 0.78rem;
  color: var(--sena-muted);
  opacity: 0.7;
  margin-bottom: 1.25rem;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  align-items: center;
}

.btn-resend {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.25rem;
  background: transparent;
  border: 1.5px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

[data-bs-theme="dark"] .btn-resend {
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

.btn-resend:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
}

.btn-resend:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-link-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--sena-muted);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.back-link-secondary:hover {
  color: var(--sena-green);
  text-decoration: underline;
}

[data-bs-theme="dark"] .back-link-secondary:hover { color: var(--sena-green-light); }

/* ============================================================
   SECURITY INFO
   ============================================================ */
.security-info {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--sena-border);
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  color: var(--sena-muted);
  font-weight: 500;
}

.security-item i {
  color: var(--sena-green);
  font-size: 0.8rem;
}

[data-bs-theme="dark"] .security-item i { color: var(--sena-green-light); }

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
.toast-notification {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: #ffffff;
  border-radius: var(--radius-sm);
  padding: 0.85rem 1.1rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  border: 1px solid var(--sena-border);
  z-index: 9999;
  animation: slideInUp 0.35s ease-out;
  max-width: 380px;
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
  font-size: 1.3rem;
  flex-shrink: 0;
}

.toast-notification.success .toast-icon { color: #16a34a; }
.toast-notification.info .toast-icon { color: #2563eb; }
.toast-notification.warning .toast-icon { color: #d97706; }
.toast-notification.error .toast-icon { color: #dc2626; }

.toast-content p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--sena-text);
  line-height: 1.4;
}

[data-bs-theme="dark"] .toast-content p { color: #e8ede3; }

.toast-close {
  background: transparent;
  border: none;
  color: var(--sena-muted);
  cursor: pointer;
  padding: 0.2rem;
  font-size: 1rem;
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
  .recover-wrapper {
    flex-direction: column;
    min-height: auto;
    max-height: none;
  }

  .recover-image-section {
    padding: 2rem 1.5rem;
  }

  .welcome-title {
    font-size: 1.8rem;
  }

  .features-list {
    gap: 1rem;
  }

  .recover-form-section {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.7rem;
  }
}

@media (max-width: 768px) {
  .recover-page {
    padding: 0;
    align-items: flex-start;
  }

  .recover-wrapper {
    border-radius: 0;
    min-height: 100vh;
  }

  .recover-image-section {
    padding: 1.75rem 1.25rem;
  }

  .welcome-title {
    font-size: 1.6rem;
  }

  .welcome-subtitle {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }

  .feature-item h5 {
    font-size: 0.8rem;
  }

  .feature-item p {
    font-size: 0.75rem;
  }

  .recover-form-section {
    padding: 1.75rem 1.25rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .security-info {
    gap: 1rem;
  }

  .toast-notification {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .recover-image-section {
    padding: 1.5rem 1rem;
  }

  .welcome-title {
    font-size: 1.4rem;
  }

  .recover-form-section {
    padding: 1.5rem 1rem;
  }

  .form-container {
    max-width: 100%;
  }

  .form-title {
    font-size: 1.3rem;
  }

  .btn-submit {
    font-size: 0.85rem;
    padding: 0.7rem 1rem;
  }

  .success-actions {
    width: 100%;
  }

  .btn-resend {
    width: 100%;
    justify-content: center;
  }

  .security-info {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>
