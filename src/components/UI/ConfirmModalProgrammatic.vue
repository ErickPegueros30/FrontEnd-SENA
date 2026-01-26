<template>
  <div v-if="visible" class="confirm-backdrop" @click.self="handleCancel">
    <div class="confirm-card" :class="typeClass" role="dialog" aria-modal="true">
      <div class="confirm-header" :class="headerClass">
        <div class="header-content">
          <div class="header-icon"><i :class="iconClass"></i></div>
          <div class="header-text">
            <h3 class="confirm-title">{{ title }}</h3>
            <p v-if="subtitle" class="confirm-subtitle">{{ subtitle }}</p>
          </div>
        </div>
        <button class="btn-close-modal" @click="handleCancel"><i class="bi bi-x-lg"></i></button>
      </div>

      <div class="confirm-body" :style="{ 'max-height': maxHeight }">
        <div class="content-main">
          <p v-if="message" class="confirm-message">{{ message }}</p>
          <div v-if="html" class="confirm-html" v-html="html"></div>
        </div>
      </div>

      <div class="confirm-footer">
        <button v-if="showCancel" class="btn btn-modal-secondary" @click="handleCancel">{{ cancelLabel }}</button>
        <button class="btn btn-modal-primary" :disabled="confirmDisabled || loading" @click="handleConfirm">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"/>{{ loading ? loadingLabel : confirmLabel }}
        </button>
        <button v-if="showAlt" class="btn btn-modal-alt" @click="handleAlt">{{ altLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type ModalType = 'info' | 'success' | 'warning' | 'danger' | 'primary'

const visible = ref(false)
const title = ref('')
const subtitle = ref('')
const message = ref('')
const html = ref('')
const type = ref<ModalType>('primary')
const confirmLabel = ref('Confirmar')
const cancelLabel = ref('Cancelar')
const altLabel = ref('')
const confirmDisabled = ref(false)
const showCancel = ref(true)
const showAlt = ref(false)
const loading = ref(false)
const loadingLabel = ref('Procesando...')
const maxHeight = ref('400px')
let onConfirmCb: Function | null = null
let onCancelCb: Function | null = null
let onAltCb: Function | null = null

function show(opts: any = {}) {
  title.value = opts.title || 'Confirmar'
  subtitle.value = opts.subtitle || ''
  message.value = opts.message || ''
  html.value = opts.html || ''
  type.value = opts.type || 'primary'
  confirmLabel.value = opts.confirmLabel || 'Confirmar'
  cancelLabel.value = opts.cancelLabel || 'Cancelar'
  altLabel.value = opts.altLabel || ''
  confirmDisabled.value = !!opts.confirmDisabled
  showCancel.value = opts.showCancel !== undefined ? !!opts.showCancel : true
  showAlt.value = !!opts.showAlt
  loading.value = !!opts.loading
  loadingLabel.value = opts.loadingLabel || 'Procesando...'
  maxHeight.value = opts.maxHeight || '400px'
  onConfirmCb = typeof opts.onConfirm === 'function' ? opts.onConfirm : null
  onCancelCb = typeof opts.onCancel === 'function' ? opts.onCancel : null
  onAltCb = typeof opts.onAlt === 'function' ? opts.onAlt : null
  visible.value = true
}

function showConfirm(messageText: string, onOk?: Function, options: any = {}) {
  show(Object.assign({ message: messageText, showCancel: true, onConfirm: onOk }, options))
}

function close() {
  visible.value = false
  // clear callbacks after short delay
  setTimeout(() => { onConfirmCb = onCancelCb = onAltCb = null }, 250)
}

function handleConfirm() {
  if (onConfirmCb) {
    try { onConfirmCb() } catch (e) { console.error(e) }
  }
  close()
}

function handleCancel() {
  if (onCancelCb) {
    try { onCancelCb() } catch (e) { console.error(e) }
  }
  close()
}

function handleAlt() {
  if (onAltCb) {
    try { onAltCb() } catch (e) { console.error(e) }
  }
  close()
}

const iconClass = computed(() => {
  const map: Record<string,string> = {
    info: 'bi bi-info-circle',
    success: 'bi bi-check-circle',
    warning: 'bi bi-exclamation-triangle',
    danger: 'bi bi-x-circle',
    primary: 'bi bi-question-circle'
  }
  return map[type.value] || map['primary']
})

const headerClass = computed(() => `gradient-${type.value}`)
const typeClass = computed(() => `confirm-${type.value}`)

defineExpose({ show, showConfirm, close })
</script>

<style scoped>
.confirm-backdrop{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);z-index:3000}
.confirm-card{width:520px;max-width:calc(100% - 2rem);border-radius:16px;overflow:hidden;background:var(--color-light,#fff);box-shadow:0 30px 60px rgba(0,0,0,0.35);}
.confirm-header{padding:1.5rem 1.75rem;background:var(--primary-gradient);color:#fff;display:flex;align-items:center;justify-content:space-between}
.header-content{display:flex;gap:1rem;align-items:center}
.header-icon{width:56px;height:56px;border-radius:12px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center}
.header-icon i{font-size:1.5rem}
.confirm-title{margin:0;font-weight:700}
.confirm-subtitle{margin:0.25rem 0 0;font-size:0.95rem;opacity:0.9}
.btn-close-modal{background:transparent;border:none;color:inherit;font-size:1.1rem}
.confirm-body{padding:1.5rem;max-height:400px;overflow:auto}
.confirm-message{margin:0 0 1rem;color:var(--color-gray,#6c757d)}
.confirm-footer{padding:1rem 1.5rem;display:flex;gap:0.75rem;justify-content:flex-end;border-top:1px solid rgba(0,0,0,0.04)}
.btn-modal-primary{background:var(--color-primary,#a6b828);color:#fff;border:none;padding:.6rem 1.25rem;border-radius:10px;font-weight:600}
.btn-modal-secondary{background:#fff;border:1px solid #e9ecef;padding:.55rem 1rem;border-radius:10px}
.btn-modal-alt{background:transparent;border:1px solid var(--color-primary,#a6b828);color:var(--color-primary,#a6b828);padding:.55rem 1rem;border-radius:10px}
.btn-modal-primary:disabled{opacity:0.6}
.gradient-primary{background:linear-gradient(135deg,#a6b828 0%,#a6b828 100%)}
.gradient-success{background:linear-gradient(135deg,#20c997 0%,#2fbf8a 100%)}
.gradient-warning{background:linear-gradient(135deg,#ffc107 0%,#ffca2c 100%);color:#212529}
.gradient-danger{background:linear-gradient(135deg,#dc3545 0%,#fd7e14 100%)}
.gradient-info{background:linear-gradient(135deg,#0dcaf0 0%,#31d2f2 100%)}
</style>
