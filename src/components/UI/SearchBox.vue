<template>
  <div class="search-box">
    <i class="bi bi-search search-icon" aria-hidden="true"></i>
    <input
      :value="modelValue"
      type="search"
      class="search-input"
      :placeholder="placeholder"
      :aria-label="placeholder"
      @input="onInput"
    >
    <button
      v-if="modelValue"
      class="clear-search"
      type="button"
      aria-label="Limpiar búsqueda"
      @click="clear"
    >
      <i class="bi bi-x" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Campo de búsqueda con icono y botón de limpiar. Repetido en 17 vistas.
 *
 * Novedad frente a las copias originales: `debounce` opcional. Varias vistas
 * filtraban en cada pulsación sobre listas de cientos de filas.
 *
 *   <SearchBox v-model="searchQuery" placeholder="Buscar..." :debounce="250" />
 */
import { onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    /** milisegundos de espera antes de emitir; 0 = inmediato */
    debounce?: number
  }>(),
  { placeholder: 'Buscar...', debounce: 0 }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

let timer: ReturnType<typeof setTimeout> | undefined

function emitValue(value: string) {
  emit('update:modelValue', value)
  emit('search', value)
}

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  if (!props.debounce) {
    emitValue(value)
    return
  }
  clearTimeout(timer)
  timer = setTimeout(() => emitValue(value), props.debounce)
}

function clear() {
  clearTimeout(timer)
  emitValue('')
}

onBeforeUnmount(() => clearTimeout(timer))
</script>
