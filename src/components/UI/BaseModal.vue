<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div
        v-if="modelValue"
        class="app-modal-overlay"
        @click.self="onOverlayClick"
      >
        <div
          ref="dialogEl"
          class="app-modal"
          :class="[`app-modal--${size}`, { 'app-modal--flush': flush }]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          @keydown="onKeydown"
        >
          <header v-if="!hideHeader" class="app-modal__header">
            <div class="app-modal__heading">
              <h2 :id="titleId" class="app-modal__title">
                <slot name="title">{{ title }}</slot>
              </h2>
              <p v-if="subtitle || $slots.subtitle" class="app-modal__subtitle">
                <slot name="subtitle">{{ subtitle }}</slot>
              </p>
            </div>

            <div class="app-modal__actions">
              <slot name="actions" />
              <button
                type="button"
                class="app-modal__close"
                aria-label="Cerrar"
                @click="close"
              >
                <i class="bi bi-x-lg" aria-hidden="true"></i>
              </button>
            </div>
          </header>

          <div class="app-modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="app-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Modal base de la aplicación.
 *
 * Unifica el diseño de los ~32 modales que antes cada vista implementaba a
 * mano, y añade lo que a la mayoría le faltaba:
 *   - cierre con la tecla Escape
 *   - bloqueo del scroll del fondo mientras está abierto
 *   - foco atrapado dentro del diálogo (Tab no se escapa al fondo)
 *   - devolución del foco al elemento que lo abrió al cerrar
 *   - role="dialog" + aria-modal + aria-labelledby
 *
 * Uso:
 *   <BaseModal v-model="showModal" title="Editar usuario" size="lg">
 *     ...contenido...
 *     <template #footer>
 *       <button class="app-btn app-btn--ghost" @click="showModal = false">Cancelar</button>
 *       <button class="app-btn app-btn--primary" @click="guardar">Guardar</button>
 *     </template>
 *   </BaseModal>
 */
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    subtitle?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    /** cerrar al hacer clic fuera del diálogo */
    closeOnOverlay?: boolean
    /** cerrar con la tecla Escape */
    closeOnEsc?: boolean
    /** ocultar la cabecera por completo */
    hideHeader?: boolean
    /** quitar el padding del cuerpo (útil para visores a sangre) */
    flush?: boolean
  }>(),
  {
    size: 'md',
    closeOnOverlay: true,
    closeOnEsc: true,
    hideHeader: false,
    flush: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const titleId = `app-modal-title-${useId()}`
const dialogEl = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onOverlayClick() {
  if (props.closeOnOverlay) close()
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc) {
    e.stopPropagation()
    close()
    return
  }
  if (e.key !== 'Tab' || !dialogEl.value) return

  const items = Array.from(dialogEl.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null
  )
  if (items.length === 0) return

  const first = items[0]!
  const last = items[items.length - 1]!
  const active = document.activeElement

  if (e.shiftKey && active === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      lastFocused = document.activeElement as HTMLElement | null
      document.body.classList.add('app-modal-open')
      await nextTick()
      const target =
        dialogEl.value?.querySelector<HTMLElement>(FOCUSABLE) ?? dialogEl.value ?? null
      target?.focus?.()
    } else {
      document.body.classList.remove('app-modal-open')
      lastFocused?.focus?.()
    }
  }
)

onBeforeUnmount(() => document.body.classList.remove('app-modal-open'))
</script>
