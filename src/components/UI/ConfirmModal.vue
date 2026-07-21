<template>
  <div ref="el" class="modal fade sena-modal" tabindex="-1" aria-hidden="true" data-bs-theme="currentTheme">
    <div :class="['modal-dialog', 'modal-dialog-centered', sizeClass]">
      <div class="modal-content">
        <!-- Header con gradiente SENA -->
        <div class="modal-header" :class="headerClass">
          <div class="header-content">
            <div class="header-icon">
              <i :class="iconClass"></i>
            </div>
            <div class="header-text">
              <h3 class="modal-title">{{ title }}</h3>
              <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
            </div>
          </div>
          <button type="button" class="btn-close-modal" @click="close" aria-label="Cerrar">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Body con animación -->
        <div class="modal-body" :style="{ 'max-height': maxHeight }">
          <div class="modal-scroll-content">
            <!-- Icono decorativo flotante -->
            <div class="floating-icon" :class="type">
              <i :class="iconClass"></i>
            </div>

            <!-- Slot principal -->
            <div class="content-main">
              <slot />
            </div>

            <!-- Contenido adicional si existe -->
            <div v-if="$slots.extra" class="content-extra">
              <slot name="extra" />
            </div>
          </div>
        </div>

        <!-- Footer mejorado -->
        <div class="modal-footer">
          <!-- Botón secundario -->
          <button
            v-if="showCancel"
            type="button"
            class="btn btn-modal-secondary"
            @click="close"
            :style="{ 'order': cancelPosition === 'left' ? 1 : 2 }"
          >
            <i class="bi bi-x-circle me-2"></i>
            {{ cancelLabel }}
          </button>

          <!-- Botón primario -->
          <button
            type="button"
            class="btn btn-modal-primary"
            :class="{ 'btn-loading': loading }"
            :disabled="confirmDisabled || loading"
            @click="onConfirm"
            :style="{ 'order': cancelPosition === 'left' ? 2 : 1 }"
          >
            <template v-if="loading">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ loadingLabel }}
            </template>
            <template v-else>
              <i :class="confirmIconClass" class="me-2"></i>
              {{ confirmLabel }}
            </template>
          </button>

          <!-- Botón alternativo -->
          <button
            v-if="showAlt"
            type="button"
            class="btn btn-modal-alt"
            @click="onAlt"
          >
            <i :class="altIconClass" class="me-2"></i>
            {{ altLabel }}
          </button>
        </div>

        <!-- Pie decorativo -->
        <div class="modal-footer-decorative">
          <div class="decorative-line"></div>
          <div class="security-badge">
            <i class="bi bi-shield-check"></i>
            <span>Acción segura</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'

// Tipos
type Theme = 'light' | 'dark'
type ModalType = 'info' | 'success' | 'warning' | 'danger' | 'primary'
type ModalSize = '' | 'sm' | 'lg' | 'xl' | 'fullscreen'
type ButtonPosition = 'left' | 'right'

interface Props {
  title: string
  subtitle?: string
  confirmLabel?: string
  cancelLabel?: string
  altLabel?: string
  confirmDisabled?: boolean
  size?: ModalSize
  type?: ModalType
  showCancel?: boolean
  showAlt?: boolean
  loading?: boolean
  loadingLabel?: string
  cancelPosition?: ButtonPosition
  maxHeight?: string
  icon?: string // Icono personalizado
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar',
  subtitle: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  altLabel: 'Alternativa',
  confirmDisabled: false,
  size: '',
  type: 'primary',
  showCancel: true,
  showAlt: false,
  loading: false,
  loadingLabel: 'Procesando...',
  cancelPosition: 'left',
  maxHeight: '400px',
  icon: ''
})

const emit = defineEmits(['confirm', 'open', 'close', 'alt'])

const el = ref<HTMLElement | null>(null)
const { currentTheme } = useTheme()
let modalInstance: any = null

// Computed
const sizeClass = computed(() => {
  const classes: Record<ModalSize, string> = {
    '': '',
    'sm': 'modal-sm',
    'lg': 'modal-lg',
    'xl': 'modal-xl',
    'fullscreen': 'modal-fullscreen'
  }
  return classes[props.size] || ''
})

const headerClass = computed(() => {
  const base = 'modal-header-' + props.type
  return `gradient-${props.type} ${base}`
})

const iconClass = computed(() => {
  if (props.icon) return props.icon

  const icons: Record<ModalType, string> = {
    'info': 'bi bi-info-circle',
    'success': 'bi bi-check-circle',
    'warning': 'bi bi-exclamation-triangle',
    'danger': 'bi bi-x-circle',
    'primary': 'bi bi-question-circle'
  }
  return icons[props.type] || 'bi bi-question-circle'
})

const confirmIconClass = computed(() => {
  const icons: Record<ModalType, string> = {
    'info': 'bi bi-check-lg',
    'success': 'bi bi-check-lg',
    'warning': 'bi bi-exclamation-lg',
    'danger': 'bi bi-exclamation-lg',
    'primary': 'bi bi-check-lg'
  }
  return icons[props.type] || 'bi bi-check-lg'
})

const altIconClass = computed(() => {
  const icons: Record<ModalType, string> = {
    'info': 'bi bi-arrow-clockwise',
    'success': 'bi bi-arrow-repeat',
    'warning': 'bi bi-arrow-counterclockwise',
    'danger': 'bi bi-arrow-counterclockwise',
    'primary': 'bi bi-arrow-clockwise'
  }
  return icons[props.type] || 'bi bi-arrow-clockwise'
})

// Lifecycle
onMounted(async () => {
  // Obtener tema actual
  currentTheme.value = (localStorage.getItem('theme') as Theme) || 'light'

  // Inicializar modal de Bootstrap
  const bs = await import('bootstrap')
  if (el.value) {
    modalInstance = new bs.Modal(el.value, {
      backdrop: 'static',
      keyboard: true,
      focus: true
    })
  }

  // Escuchar cambios de tema
  watchTheme()
})

onBeforeUnmount(() => {
  try {
    modalInstance?.dispose()
  } catch (e) {
    console.error('Error disposing modal:', e)
  }
})

// Methods
function open() {
  modalInstance?.show()
  emit('open')

  // Añadir clase de animación
  setTimeout(() => {
    if (el.value) {
      el.value.classList.add('modal-shown')
    }
  }, 50)
}

function close() {
  // Animación de salida
  if (el.value) {
    el.value.classList.remove('modal-shown')
    el.value.classList.add('modal-hiding')

    setTimeout(() => {
      try {
        modalInstance?.hide()
      } catch (e) {
        console.error('Error hiding modal:', e)
      }

      // Remover clase de animación
      if (el.value) {
        el.value.classList.remove('modal-hiding')
      }

      emit('close')
    }, 300)
  }
}

function onConfirm() {
  if (props.loading) return

  // Animación de confirmación
  const confirmBtn = el.value?.querySelector('.btn-modal-primary')
  if (confirmBtn) {
    confirmBtn.classList.add('btn-confirming')
    setTimeout(() => {
      confirmBtn.classList.remove('btn-confirming')
    }, 300)
  }

  emit('confirm')

  // Cerrar modal después de confirmar (a menos que loading esté activo)
  if (!props.loading) {
    close()
  }
}

function onAlt() {
  emit('alt')
}

function watchTheme() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-bs-theme') {
        currentTheme.value = document.documentElement.getAttribute('data-bs-theme') as Theme
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-bs-theme']
  })

  return observer
}

defineExpose({ open, close })
</script>

<style scoped>
.sena-modal {
  --modal-border-radius: 16px;
  --modal-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --modal-transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --color-primary: #5d8a2f;
  --color-primary-dark: #47721f;
  --primary-gradient: linear-gradient(135deg, var(--color-primary) 0%, #7aab3d 100%);
  --info-gradient: linear-gradient(135deg, #0dcaf0 0%, #31d2f2 100%);
  --success-gradient: linear-gradient(135deg, #20c997 0%, #2fbf8a 100%);
  --warning-gradient: linear-gradient(135deg, #ffc107 0%, #ffca2c 100%);
  --danger-gradient: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
}

.sena-modal .modal-dialog {
  transition: var(--modal-transition);
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.sena-modal.modal-shown .modal-dialog {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.sena-modal.modal-hiding .modal-dialog {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.sena-modal .modal-content {
  border-radius: var(--modal-border-radius);
  border: none;
  overflow: hidden;
  box-shadow: var(--modal-shadow);
  background: var(--color-light, #FFFFFF);
  color: var(--color-dark, #212529);
  transition: var(--modal-transition);
}

[data-bs-theme="dark"] .sena-modal .modal-content {
  background: var(--color-light, #121212);
  color: var(--color-dark, #F8F9FA);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Header Styles */
.modal-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: none;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0.3;
}

.modal-header-primary::before { background: var(--primary-gradient); }
.modal-header-info::before { background: var(--info-gradient); }
.modal-header-success::before { background: var(--success-gradient); }
.modal-header-warning::before { background: var(--warning-gradient); }
.modal-header-danger::before { background: var(--danger-gradient); }

.gradient-primary {
  background: var(--primary-gradient);
  color: white;
}

.gradient-info {
  background: var(--info-gradient);
  color: white;
}

.gradient-success {
  background: var(--success-gradient);
  color: white;
}

.gradient-warning {
  background: var(--warning-gradient);
  color: #212529;
}

.gradient-danger {
  background: var(--danger-gradient);
  color: white;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  width: 100%;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.gradient-warning .header-icon {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.header-icon i {
  font-size: 1.75rem;
}

.header-text {
  flex: 1;
}

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0.5rem 0 0;
  font-weight: 400;
}

.btn-close-modal {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  padding: 0;
  margin: 0;
}

.gradient-warning .btn-close-modal {
  color: #212529;
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-close-modal:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg) scale(1.1);
}

.btn-close-modal:active {
  transform: rotate(90deg) scale(0.95);
}

/* Body Styles */
.modal-body {
  padding: 2rem;
  position: relative;
  overflow: hidden;
  max-height: v-bind(maxHeight);
}

[data-bs-theme="dark"] .modal-body {
  background: var(--color-light, #121212);
}

.modal-scroll-content {
  max-height: 100%;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Scrollbar personalizado */
.modal-scroll-content::-webkit-scrollbar {
  width: 6px;
}

.modal-scroll-content::-webkit-scrollbar-track {
  background: var(--color-lighter, #F8F9FA);
  border-radius: 3px;
}

[data-bs-theme="dark"] .modal-scroll-content::-webkit-scrollbar-track {
  background: var(--color-lighter, #1E1E1E);
}

.modal-scroll-content::-webkit-scrollbar-thumb {
  background: var(--color-primary, #1E9E4A);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.modal-scroll-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark, #0A8F3A);
}

.floating-icon {
  position: absolute;
  top: 50%;
  right: -30px;
  transform: translateY(-50%);
  font-size: 8rem;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
}

.floating-icon.primary { color: var(--color-primary, #1E9E4A); }
.floating-icon.info { color: #0dcaf0; }
.floating-icon.success { color: #198754; }
.floating-icon.warning { color: #ffc107; }
.floating-icon.danger { color: #dc3545; }

.content-main {
  position: relative;
  z-index: 1;
}

.content-extra {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .content-extra {
  border-top-color: var(--color-gray-light, #2D2D2D);
}

/* Footer Styles */
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--color-lighter, #F8F9FA);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

[data-bs-theme="dark"] .modal-footer {
  background: var(--color-lighter, #1E1E1E);
  border-top-color: var(--color-gray-light, #2D2D2D);
}

.btn-modal-secondary,
.btn-modal-primary,
.btn-modal-alt {
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  border: 2px solid transparent;
}

.btn-modal-secondary {
  background: transparent;
  color: var(--color-primary, #a7b729);
  border-color: var(--color-primary, #a7b729);
}

[data-bs-theme="dark"] .btn-modal-secondary {
  background: rgba(255,255,255,0.03);
  color: var(--color-primary, #a7b729);
  border-color: rgba(167,183,41,0.18);
}

.btn-modal-secondary:hover:not(:disabled) {
  background: rgba(167,183,41,0.08);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

[data-bs-theme="dark"] .btn-modal-secondary:hover:not(:disabled) {
  background: rgba(167,183,41,0.12);
}

.btn-modal-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(30, 158, 74, 0.3);
}

.btn-modal-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 158, 74, 0.4);
}

.btn-modal-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-modal-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-modal-primary.btn-confirming {
  animation: confirmPulse 0.3s ease;
}

.btn-modal-alt {
  background: transparent;
  color: var(--color-primary, #1E9E4A);
  border: 2px solid var(--color-primary, #1E9E4A);
}

.btn-modal-alt:hover:not(:disabled) {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 158, 74, 0.2);
}

[data-bs-theme="dark"] .btn-modal-alt:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.btn-loading {
  position: relative;
  color: transparent !important;
}

.btn-loading::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

.gradient-warning .btn-loading::after {
  border-top-color: #212529;
}

.modal-footer-decorative {
  padding: 0 2rem 1.5rem;
  background: var(--color-lighter, #F8F9FA);
}

[data-bs-theme="dark"] .modal-footer-decorative {
  background: var(--color-lighter, #1E1E1E);
}

.decorative-line {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--color-primary, #1E9E4A) 50%,
    transparent 100%);
  margin-bottom: 1rem;
  opacity: 0.3;
}

.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
  font-weight: 500;
}

.security-badge i {
  color: var(--color-primary, #1E9E4A);
}

/* Animations */
@keyframes confirmPulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Responsive */
@media (max-width: 576px) {
  .modal-header {
    padding: 1.5rem 1.5rem 1.25rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1.25rem 1.5rem;
    flex-direction: column;
  }

  .btn-modal-secondary,
  .btn-modal-primary,
  .btn-modal-alt {
    width: 100%;
    justify-content: center;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
  }

  .header-icon i {
    font-size: 1.5rem;
  }

  .btn-close-modal {
    top: 1.25rem;
    right: 1.25rem;
    width: 36px;
    height: 36px;
  }

  .floating-icon {
    font-size: 6rem;
    right: -20px;
  }
}
</style>
