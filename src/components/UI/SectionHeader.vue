<template>
  <div class="section-header" :class="[{ 'text-center': centered }, headerClass]" v-bind="$attrs">
    <span v-if="eyebrow" class="section-eyebrow" :class="{ light }">{{ eyebrow }}</span>

    <h2 class="section-title" :class="{ 'text-white': light }">
      <slot name="title">{{ title }}</slot>
    </h2>

    <div v-if="underline" class="title-underline" :class="{ centered }"></div>

    <p v-if="subtitle || $slots.subtitle" class="section-subtitle" :class="{ 'text-white-50': light }">
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>

    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Cabecera de sección: antetítulo, título, subrayado y subtítulo.
 *
 * Este bloque aparece 33 veces en el proyecto, casi siempre con la misma
 * combinación (eyebrow + title + underline). Reutiliza las clases originales,
 * así que no cambia nada visualmente.
 *
 * `light` aplica las variantes sobre fondo oscuro (text-white / text-white-50),
 * que las secciones con fondo de color ya usaban a mano.
 *
 *   <SectionHeader
 *     eyebrow="Metodología"
 *     title="Nuestro Proceso de Trabajo"
 *     subtitle="Garantizamos excelencia en cada etapa"
 *     centered light data-aos="fade-up"
 *   />
 */
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    title?: string
    eyebrow?: string
    subtitle?: string
    /** centra el texto y el subrayado */
    centered?: boolean
    /** variante para fondos oscuros */
    light?: boolean
    /** mostrar el subrayado bajo el título */
    underline?: boolean
    headerClass?: string
  }>(),
  { centered: false, light: false, underline: true }
)
</script>
