<template>
  <span :class="['icon-glyph']" ref="wrapper">
    <!-- SVG raw provided in icon value -->
    <span v-if="isSvg" v-html="icon" class="icon-svg" aria-hidden="true"></span>

    <!-- Emoji / plain text icon (no font dependency) -->
    <span v-else-if="isTextIcon" class="icon-text" aria-hidden="true">{{ icon }}</span>

    <!-- Font icon (bootstrap-icons class) -->
    <i v-else-if="!showFallback" :class="icon" ref="iconEl" aria-hidden="true"></i>
    <span v-else class="icon-fallback" aria-hidden="true" v-html="fallbackHtml"></span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
const props = defineProps<{ icon: string, label?: string, class?: string }>()
const icon = computed(() => props.icon || '')
const label = computed(() => props.label || '')
const customClass = computed(() => props.class || '')

const showFallback = ref(false)
const iconEl = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)

function isSvgString(s: string) { return String(s || '').trim().startsWith('<svg') }
function isTextIconString(s: string) { return /^[^\s\w<>].*/.test(String(s || '')) || Array.from(String(s || '')).length <= 2 }

async function computeFallback(retries = 3, delay = 150) {
  if (isSvgString(icon.value) || isTextIconString(icon.value)) { showFallback.value = false; return }
  if (!iconEl.value) return
  for (let i = 0; i < retries; i++) {
    await nextTick()
    // wait for fonts to be ready when available
    if ((document as any).fonts && (document as any).fonts.ready) {
      try { await (document as any).fonts.ready } catch (_) {}
    }
    const el = iconEl.value as HTMLElement
    const w = el.offsetWidth
    const fontFamily = getComputedStyle(el).fontFamily || ''
    const hasBootstrap = /bootstrap-icons/i.test(fontFamily)
    if (w > 0 && hasBootstrap) { showFallback.value = false; return }
    // if width > 0 but font not bootstrap-icons, still show fallback
    if (w > 0 && !hasBootstrap) { showFallback.value = true; return }
    // otherwise wait and retry
    await new Promise(r => setTimeout(r, delay))
  }
  // final check
  const el = iconEl.value as HTMLElement
  const w = el ? el.offsetWidth : 0
  showFallback.value = w === 0
}

onMounted(async () => {
  await nextTick()
  computeFallback()
})

watch(icon, async () => {
  await nextTick()
  computeFallback()
})

const fallbackHtml = computed(() => {
  const hay = (label.value || icon.value || '')
  if (/flask|beaker|test|tube|pipette|lab|microscope|atom|molecule|dna|pipette|flask/i.test(hay)) return '<span class="chem-emoji">🧪</span>'
  // generic SVG question mark circle fallback (inline to avoid font dependency)
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14z"/>
      <path d="M5.255 5.786a.237.237 0 0 1 .241-.247c.79-.03 1.57-.01 2.24.14.645.143 1.085.52 1.285 1.07.193.534.086 1.17-.353 1.67-.39.45-.98.784-1.72 1.01v.518a.375.375 0 0 1-.75 0v-.57c-.743-.188-1.356-.52-1.8-.99-.467-.497-.64-1.11-.47-1.77.18-.707.686-1.2 1.62-1.42z"/>
      <circle cx="8" cy="11" r="1" />
    </svg>
  `
})

const isSvg = computed(() => isSvgString(icon.value))
const isTextIcon = computed(() => isTextIconString(icon.value))
</script>

<style scoped>
.icon-glyph { display: inline-flex; align-items: center; justify-content: center; }
.icon-glyph i { font-size: 1em; line-height: 1; }
.icon-fallback { font-size: 1em; display: inline-block; width: 1em; text-align: center; }
</style>
