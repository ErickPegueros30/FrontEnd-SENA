<template>
  <div class="toast-container position-fixed p-3" :class="positionClass">
    <div
      :id="toastId"
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
      <div
        class="toast-body bg-body border border-opacity-25 rounded-bottom"
        :class="`border-${toastType}`"
      >
        <div class="d-flex align-items-center">
          <i :class="toastBodyIcon" class="fs-5 me-2"></i>
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Notificación toast reutilizable.
 *
 * Sustituye a las implementaciones duplicadas que existían en cada vista.
 * El markup, las clases de Bootstrap y los iconos son exactamente los mismos
 * que tenían los componentes originales, por lo que el resultado visual no
 * cambia.
 *
 * Uso:
 *   <BaseToast ref="toastRef" toast-id="adminToast" />
 *
 *   const toastRef = ref<InstanceType<typeof BaseToast> | null>(null)
 *   const showToast = (m: string, t: ToastType = 'info', title = '') =>
 *     toastRef.value?.show(m, t, title)
 */
import { computed, ref } from 'vue'
import type { Toast } from 'bootstrap'
import type { ToastType } from '@/composables/useToast'

const props = withDefaults(
  defineProps<{
    /** id del elemento, se conserva por compatibilidad con estilos/tests existentes */
    toastId?: string
    /** esquina donde se ancla el contenedor */
    position?: 'top-end' | 'bottom-end' | 'top-start' | 'bottom-start'
    /** duración en milisegundos */
    delay?: number
  }>(),
  { toastId: 'appToast', position: 'top-end', delay: 3000 }
)

const positionClass = computed(
  () =>
    ({
      'top-end': 'top-0 end-0',
      'bottom-end': 'bottom-0 end-0',
      'top-start': 'top-0 start-0',
      'bottom-start': 'bottom-0 start-0'
    })[props.position]
)

const toastMessage = ref('')
const toastTitle = ref('')
const toastType = ref<ToastType>('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

function show(message: string, type: ToastType = 'info', title: string = '') {
  toastMessage.value = message
  toastTitle.value = title || type.charAt(0).toUpperCase() + type.slice(1)
  toastType.value = type

  if (toastInstance) toastInstance.hide()

  if (toastEl.value) {
    import('bootstrap').then((bootstrap) => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: props.delay })
      toastInstance.show()
    })
  }
}

function hide() {
  toastInstance?.hide()
}

const toastClass = computed(() => {
  const classes: Record<ToastType, string> = {
    success: 'bg-success text-white border-0',
    info: 'bg-info text-white border-0',
    warning: 'bg-warning text-dark border-0',
    error: 'bg-danger text-white border-0'
  }
  return classes[toastType.value] || 'bg-info text-white border-0'
})

const toastIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    success: 'bi bi-check-circle',
    info: 'bi bi-info-circle',
    warning: 'bi bi-exclamation-triangle',
    error: 'bi bi-x-circle'
  }
  return icons[toastType.value] || 'bi bi-info-circle'
})

const toastBodyIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    success: 'bi bi-check-circle-fill text-success',
    info: 'bi bi-info-circle-fill text-info',
    warning: 'bi bi-exclamation-triangle-fill text-warning',
    error: 'bi bi-x-circle-fill text-danger'
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill text-info'
})

defineExpose({ show, hide })
</script>
