<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :type="to ? undefined : 'button'"
    class="category-card"
    :class="{ active }"
    :aria-pressed="to ? undefined : active"
  >
    <div class="category-icon-wrap">
      <i :class="icon" aria-hidden="true"></i>
    </div>
    <h4 class="category-title">{{ title }}</h4>
    <p class="category-description">{{ description }}</p>
    <div v-if="count !== undefined" class="category-badge">
      <span>{{ count }} {{ count === 1 ? countLabelSingular : countLabel }}</span>
    </div>
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Tarjeta de categoría de servicio.
 *
 * Antes era un <div> con @click, que no es accesible: no recibe foco ni
 * responde a Enter/Espacio. Ahora se renderiza como <button> (o como
 * <router-link> si se pasa `to`), conservando exactamente las mismas clases
 * y por tanto el mismo aspecto.
 */
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    title: string
    description?: string
    /** clase completa del icono, p. ej. 'bi bi-droplet' */
    icon?: string
    active?: boolean
    count?: number
    countLabel?: string
    countLabelSingular?: string
    to?: RouteLocationRaw
  }>(),
  { countLabel: 'servicios', countLabelSingular: 'servicio' }
)
</script>

<style scoped>
/* El elemento pasa de <div> a <button>: se neutralizan los estilos por
   defecto del navegador para que el aspecto sea idéntico al anterior. */
.category-card {
  display: block;
  width: 100%;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  text-align: inherit;
  text-decoration: none;
  cursor: pointer;
}
</style>
