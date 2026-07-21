<template>
  <div :data-bs-theme="currentTheme" class="verify-page">
    <div class="verify-container">
      <div class="verify-wrapper">
        <!-- Image Section -->
        <div class="verify-image-section">
          <div class="image-overlay"></div>
          <div class="image-content">
            <div class="content-wrapper">
              <div class="image-eyebrow">SENA</div>
              <h2 class="welcome-title">Verificación</h2>
              <p class="welcome-subtitle">
                Confirma tu dirección de correo electrónico para activar tu cuenta
                y acceder a todos nuestros servicios de ensayos de aptitud.
              </p>

              <div class="features-list">
                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-envelope-check"></i>
                  </div>
                  <div>
                    <h5>Confirmación Segura</h5>
                    <p>Verificamos tu identidad para proteger tu cuenta y tus datos.</p>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-shield-lock"></i>
                  </div>
                  <div>
                    <h5>Acceso Protegido</h5>
                    <p>Solo tú podrás acceder a tus resultados e informes confidenciales.</p>
                  </div>
                </div>

                <div class="feature-item">
                  <div class="feature-icon-circle">
                    <i class="bi bi-rocket-takeoff"></i>
                  </div>
                  <div>
                    <h5>Activación Inmediata</h5>
                    <p>Una vez verificado, podrás comenzar a usar nuestros servicios.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="verify-form-section">
          <div class="form-container">
            <!-- Estado: Verificando -->
            <div v-if="status === 'verifying'" class="status-card">
              <div class="status-icon verifying">
                <span class="spinner-large"></span>
              </div>
              <div class="form-header">
                <span class="section-eyebrow">Procesando</span>
                <h1 class="form-title">Verificando Cuenta</h1>
                <div class="title-underline centered"></div>
              </div>
              <p class="status-message">
                Estamos verificando tu dirección de correo electrónico.
                <br>Por favor, espera un momento...
              </p>
              <div class="status-progress">
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
              </div>
            </div>

            <!-- Estado: Éxito -->
            <div v-else-if="status === 'success'" class="status-card">
              <div class="status-icon success">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div class="form-header">
                <span class="section-eyebrow">¡Completado!</span>
                <h1 class="form-title">Correo Verificado</h1>
                <div class="title-underline centered"></div>
              </div>
              <p class="status-message">
                Tu dirección de correo electrónico ha sido verificada exitosamente.
                <br>Tu cuenta ya está activa y lista para usar.
              </p>
              <div class="status-details" v-if="userEmail">
                <div class="detail-item">
                  <i class="bi bi-envelope-check"></i>
                  <span>{{ userEmail }}</span>
                </div>
              </div>
              <router-link to="/login" class="btn-action">
                <span>Iniciar Sesión</span>
                <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </router-link>
            </div>

            <!-- Estado: Error -->
            <div v-else-if="status === 'error'" class="status-card">
              <div class="status-icon error">
                <i class="bi bi-x-circle-fill"></i>
              </div>
              <div class="form-header">
                <span class="section-eyebrow">Error</span>
                <h1 class="form-title">Verificación Fallida</h1>
                <div class="title-underline centered"></div>
              </div>
              <p class="status-message">
                {{ errorMessage || 'No se pudo verificar tu correo electrónico. El enlace puede haber expirado o ser inválido.' }}
              </p>
              <div class="action-buttons">
                <button class="btn-action secondary" @click="resendVerification">
                  <i class="bi bi-envelope-arrow-up"></i>
                  <span>Reenviar correo</span>
                </button>
                <router-link to="/login" class="btn-action secondary">
                  <i class="bi bi-box-arrow-in-right"></i>
                  <span>Ir al inicio de sesión</span>
                </router-link>
              </div>
            </div>

            <!-- Estado: Ya verificado -->
            <div v-else-if="status === 'already-verified'" class="status-card">
              <div class="status-icon info">
                <i class="bi bi-info-circle-fill"></i>
              </div>
              <div class="form-header">
                <span class="section-eyebrow">Información</span>
                <h1 class="form-title">Cuenta Ya Verificada</h1>
                <div class="title-underline centered"></div>
              </div>
              <p class="status-message">
                Esta cuenta ya ha sido verificada anteriormente.
                <br>Puedes iniciar sesión para acceder a tus servicios.
              </p>
              <router-link to="/login" class="btn-action">
                <span>Iniciar Sesión</span>
                <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </router-link>
            </div>

            <!-- Estado: Reenviado -->
            <div v-else-if="status === 'resent'" class="status-card">
              <div class="status-icon success">
                <i class="bi bi-envelope-paper"></i>
              </div>
              <div class="form-header">
                <span class="section-eyebrow">Correo Enviado</span>
                <h1 class="form-title">Revisa tu Bandeja</h1>
                <div class="title-underline centered"></div>
              </div>
              <p class="status-message">
                Hemos enviado un nuevo enlace de verificación a tu correo electrónico.
                <br>Revisa tu bandeja de entrada y también la carpeta de spam.
              </p>
              <p class="status-hint">
                Si no recibes el correo en los próximos minutos, intenta de nuevo o contacta a soporte.
              </p>
              <button class="btn-action secondary" @click="resendVerification">
                <i class="bi bi-arrow-repeat"></i>
                <span>Intentar de nuevo</span>
              </button>
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
import { ref, onMounted, computed, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

type ToastType = 'success' | 'info' | 'warning' | 'error'
type VerifyStatus = 'verifying' | 'success' | 'error' | 'already-verified' | 'resent'

const route = useRoute()
const { currentTheme } = useTheme()
const status = ref<VerifyStatus>('verifying')
const errorMessage = ref('')
const userEmail = ref('')

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
let toastTimer: number | null = null

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'

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

const verifyEmail = async (token: string) => {
  status.value = 'verifying'

  try {
    const resp = await fetch(`${API_BASE}/api/verify-email?token=${encodeURIComponent(token)}`)
    const data = await resp.json().catch(() => ({}))

    if (resp.ok) {
      status.value = 'success'
      userEmail.value = data.email || data.data?.email || ''
      displayToast('Correo verificado exitosamente', 'success')
    } else if (resp.status === 409 || data.message?.includes('ya')) {
      status.value = 'already-verified'
      displayToast('Esta cuenta ya fue verificada', 'info')
    } else {
      status.value = 'error'
      errorMessage.value = data.message || 'Error al verificar el correo'
      displayToast(errorMessage.value, 'error')
    }
  } catch (e) {
    status.value = 'error'
    errorMessage.value = 'Error de conexión. Verifica tu conexión a internet.'
    displayToast(errorMessage.value, 'error')
  }
}

const resendVerification = async () => {
  const email = route.query.email as string || userEmail.value

  if (!email) {
    displayToast('No se pudo determinar el correo para reenviar', 'error')
    return
  }

  status.value = 'verifying'

  try {
    const resp = await fetch(`${API_BASE}/api/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (resp.ok) {
      status.value = 'resent'
      displayToast('Correo de verificación reenviado', 'success')
    } else {
      const data = await resp.json().catch(() => ({}))
      status.value = 'error'
      errorMessage.value = data.message || 'Error al reenviar el correo'
      displayToast(errorMessage.value, 'error')
    }
  } catch (e) {
    status.value = 'error'
    errorMessage.value = 'Error de conexión al reenviar'
    displayToast(errorMessage.value, 'error')
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  const token = route.query.token as string
  const email = route.query.email as string

  if (email) {
    userEmail.value = email
  }

  if (token) {
    // Pequeño retraso para mostrar la animación de carga
    setTimeout(() => verifyEmail(token), 1500)
  } else {
    status.value = 'error'
    errorMessage.value = 'No se proporcionó un token de verificación válido'
  }
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
.verify-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

[data-bs-theme="dark"] .verify-page {
  background: #0c0f0a;
}

.verify-container {
  width: 100%;
  max-width: none;
  padding: 0;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.verify-wrapper {
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

[data-bs-theme="dark"] .verify-wrapper {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
  box-shadow: 0 4px 40px rgba(0,0,0,0.3);
}

/* ============================================================
   IMAGE SECTION
   ============================================================ */
.verify-image-section {
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
  max-width: 420px;
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
.verify-form-section {
  flex: 1;
  padding: 2rem 2rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 420px;
}

/* ============================================================
   STATUS CARD
   ============================================================ */
.status-card {
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

.form-header {
  margin-bottom: 1.5rem;
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

/* ============================================================
   STATUS ICONS
   ============================================================ */
.status-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.status-icon i {
  font-size: 4rem;
}

.status-icon.verifying i,
.status-icon.verifying {
  color: var(--sena-green);
}

[data-bs-theme="dark"] .status-icon.verifying i,
[data-bs-theme="dark"] .status-icon.verifying {
  color: var(--sena-green-light);
}

.status-icon.success i { color: #16a34a; }
.status-icon.error i { color: #dc2626; }
.status-icon.info i { color: #2563eb; }

.spinner-large {
  display: inline-block;
  width: 64px;
  height: 64px;
  border: 3px solid var(--sena-green-pale);
  border-top-color: var(--sena-green);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

[data-bs-theme="dark"] .spinner-large {
  border-color: rgba(93,138,47,0.2);
  border-top-color: var(--sena-green-light);
}

/* ============================================================
   STATUS MESSAGE
   ============================================================ */
.status-message {
  font-size: 0.95rem;
  color: var(--sena-muted);
  line-height: 1.65;
  margin-bottom: 0.5rem;
}

.status-hint {
  font-size: 0.82rem;
  color: var(--sena-muted);
  font-style: italic;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

/* ============================================================
   PROGRESS BAR
   ============================================================ */
.status-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--sena-green-pale);
  border-radius: 2px;
  overflow: hidden;
}

[data-bs-theme="dark"] .progress-bar {
  background: rgba(93,138,47,0.15);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
  animation: progress 2s ease-in-out infinite;
  width: 60%;
}

@keyframes progress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

/* ============================================================
   STATUS DETAILS
   ============================================================ */
.status-details {
  background: #f8faf7;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  margin: 1.25rem 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

[data-bs-theme="dark"] .status-details {
  background: rgba(93,138,47,0.08);
  border-color: rgba(122,171,61,0.15);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .detail-item { color: #e0ecd6; }

.detail-item i {
  color: var(--sena-green);
  font-size: 1rem;
}

[data-bs-theme="dark"] .detail-item i { color: var(--sena-green-light); }

/* ============================================================
   ACTION BUTTONS (match Login button styles)
   ============================================================ */
.btn-action {
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
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
  box-shadow: var(--shadow-green);
  margin-top: 1.25rem;
}

.btn-action:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
  color: #ffffff;
}

.btn-action:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.btn-action.secondary {
  background: transparent;
  color: var(--sena-green);
  border: 1.5px solid var(--sena-green);
  box-shadow: none;
  border-radius: 50px;
  padding: 0.75rem 1rem;
  font-weight: 600;
}

[data-bs-theme="dark"] .btn-action.secondary {
  color: var(--sena-green-light);
  border-color: var(--sena-green-light);
}

.btn-action.secondary:hover {
  background: var(--sena-green-pale);
  color: var(--sena-green);
}

[data-bs-theme="dark"] .btn-action.secondary:hover {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

/* Forzar contraste en modo claro similar a Login */
.verify-page[data-bs-theme="light"] .btn-action,
.verify-page[data-bs-theme="light"] .btn.btn-action,
[data-bs-theme="light"] .verify-page .btn-action,
[data-bs-theme="light"] .verify-page .btn.btn-action {
  background: linear-gradient(135deg, #3e6b1f 0%, #6b8f2e 100%) !important;
  color: #ffffff !important;
  border: 1px solid rgba(0,0,0,0.06) !important;
  box-shadow: 0 10px 30px rgba(93,138,47,0.16) !important;
  z-index: 2;
}

[data-bs-theme="light"] .verify-page .btn-action.secondary,
[data-bs-theme="light"] .verify-page .btn.btn-action.secondary,
.verify-page[data-bs-theme="light"] .btn-action.secondary,
.verify-page[data-bs-theme="light"] .btn.btn-action.secondary {
  background: transparent !important;
  color: var(--sena-green) !important;
  border: 1.5px solid var(--sena-green) !important;
  box-shadow: none !important;
}

[data-bs-theme="light"] .verify-page .btn-action:hover:not(:disabled) {
  box-shadow: 0 14px 40px rgba(93,138,47,0.22) !important;
}

.btn-action:focus {
  outline: none;
  box-shadow: 0 0 0 0.28rem rgba(93,138,47,0.12);
}

.btn-action:hover .btn-arrow {
  transform: translateX(3px);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

/* Full-width on small screens to match Login behavior */
@media (max-width: 576px) {
  .btn-action { width: 100%; }
}

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

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .verify-wrapper {
    flex-direction: column;
    min-height: auto;
  }

  .verify-image-section {
    padding: 2.5rem 2rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .features-list {
    gap: 1.25rem;
  }

  .verify-form-section {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 768px) {
  .verify-container {
    padding: 0;
  }

  .verify-wrapper {
    border-radius: 0;
    min-height: 100vh;
  }

  .verify-image-section {
    padding: 2rem 1.5rem;
  }

  .verify-form-section {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .status-icon i {
    font-size: 3rem;
  }

  .spinner-large {
    width: 48px;
    height: 48px;
  }

  .toast-notification {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .verify-form-section {
    padding: 1.5rem 1rem;
  }

  .status-message {
    font-size: 0.88rem;
  }
}
</style>
