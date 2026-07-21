<template>
  <nav v-if="totalPages > 1" aria-label="Paginación">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: isFirst }">
        <button class="page-link" type="button" :disabled="isFirst" aria-label="Primera página" @click="go(1)">
          <i class="bi bi-chevron-double-left" aria-hidden="true"></i>
        </button>
      </li>
      <li class="page-item" :class="{ disabled: isFirst }">
        <button class="page-link" type="button" :disabled="isFirst" aria-label="Página anterior" @click="go(page - 1)">
          <i class="bi bi-chevron-left" aria-hidden="true"></i>
        </button>
      </li>

      <li
        v-for="p in visiblePages"
        :key="p"
        class="page-item"
        :class="{ active: p === page }"
      >
        <button
          class="page-link"
          type="button"
          :aria-current="p === page ? 'page' : undefined"
          @click="go(p)"
        >
          {{ p }}
        </button>
      </li>

      <li class="page-item" :class="{ disabled: isLast }">
        <button class="page-link" type="button" :disabled="isLast" aria-label="Página siguiente" @click="go(page + 1)">
          <i class="bi bi-chevron-right" aria-hidden="true"></i>
        </button>
      </li>
      <li class="page-item" :class="{ disabled: isLast }">
        <button class="page-link" type="button" :disabled="isLast" aria-label="Última página" @click="go(totalPages)">
          <i class="bi bi-chevron-double-right" aria-hidden="true"></i>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
/**
 * Controles de paginación. El mismo bloque estaba en 19 vistas, cada una con
 * su propio cálculo de páginas visibles.
 *
 *   <BasePagination v-model:page="currentPage" :total-pages="totalPages" />
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    totalPages: number
    /** cuántos números mostrar a la vez */
    window?: number
  }>(),
  { window: 5 }
)

const emit = defineEmits<{ 'update:page': [value: number] }>()

const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= props.totalPages)

const visiblePages = computed(() => {
  const total = props.totalPages
  const size = Math.min(props.window, total)
  let start = Math.max(1, props.page - Math.floor(size / 2))
  if (start + size - 1 > total) start = Math.max(1, total - size + 1)
  return Array.from({ length: size }, (_, i) => start + i)
})

function go(p: number) {
  const target = Math.min(Math.max(1, p), props.totalPages)
  if (target !== props.page) emit('update:page', target)
}
</script>
