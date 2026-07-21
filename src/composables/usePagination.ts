import { computed, ref, watch, type Ref } from 'vue'

/**
 * Paginación de una lista reactiva.
 *
 * 18 vistas repetían este mismo cálculo (currentPage, itemsPerPage,
 * totalPages, slice, nextPage/prevPage) con pequeñas variaciones.
 *
 *   const { currentPage, itemsPerPage, totalPages, paginatedItems } =
 *     usePagination(itemsFiltrados)
 *
 * Incluye algo que a las copias originales les faltaba: si el filtro reduce
 * la lista y la página actual se queda fuera de rango, vuelve a la última
 * página válida en lugar de mostrar una tabla vacía.
 */
export function usePagination<T>(items: Ref<T[]>, perPage = 10) {
  const currentPage = ref(1)
  const itemsPerPage = ref(perPage)

  const totalItems = computed(() => items.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return items.value.slice(start, start + itemsPerPage.value)
  })

  const rangeStart = computed(() =>
    totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
  )
  const rangeEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
  )

  watch([totalPages, itemsPerPage], () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  })

  const goToPage = (p: number) => {
    currentPage.value = Math.min(Math.max(1, p), totalPages.value)
  }
  const nextPage = () => goToPage(currentPage.value + 1)
  const prevPage = () => goToPage(currentPage.value - 1)
  const resetPage = () => { currentPage.value = 1 }

  return {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    paginatedItems,
    rangeStart,
    rangeEnd,
    goToPage,
    nextPage,
    prevPage,
    resetPage
  }
}

export default usePagination
