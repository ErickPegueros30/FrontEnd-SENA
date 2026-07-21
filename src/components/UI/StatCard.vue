<template>
  <div class="stat-card">
    <div class="stat-icon" :class="variant">
      <i :class="`bi ${icon}`" aria-hidden="true"></i>
    </div>
    <div class="stat-info">
      <span class="stat-number">{{ value }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Tarjeta de estadística (icono + número + etiqueta).
 * Repetida en 14 vistas. Mantiene las clases originales.
 */
withDefaults(
  defineProps<{
    icon: string
    value: string | number
    label: string
    /** clase de color del icono: total, active, pending, warning... */
    variant?: string
  }>(),
  { variant: 'total' }
)
</script>
