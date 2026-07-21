<template>
  <header class="admin-header">
    <div class="container">
      <nav v-if="breadcrumb.length" class="breadcrumb" aria-label="Ruta de navegación">
        <ol class="breadcrumb-list">
          <li
            v-for="(crumb, i) in breadcrumb"
            :key="i"
            class="breadcrumb-item"
            :class="{ active: i === breadcrumb.length - 1 }"
          >
            <router-link v-if="crumb.to && i !== breadcrumb.length - 1" :to="crumb.to" class="breadcrumb-link">
              <i v-if="crumb.icon" :class="`bi ${crumb.icon}`"></i> {{ crumb.label }}
            </router-link>
            <template v-else>
              <i v-if="crumb.icon" :class="`bi ${crumb.icon}`"></i> {{ crumb.label }}
            </template>
          </li>
        </ol>
      </nav>

      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">
            <i v-if="icon" :class="`bi ${icon} me-2`"></i><slot name="title">{{ title }}</slot>
          </h1>
          <p v-if="subtitle || $slots.subtitle" class="page-subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>

        <div v-if="$slots.actions" class="header-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Cabecera de página con breadcrumb, título y zona de acciones.
 *
 * Este bloque estaba copiado literalmente en 22 vistas. Reutiliza las mismas
 * clases (.admin-header, .breadcrumb, .page-title...) que ya viven en
 * styles/components.css, así que el resultado visual es idéntico.
 *
 * Uso:
 *   <PageHeader
 *     icon="bi-tag-fill"
 *     title="Catálogo de Precios"
 *     :subtitle="`Actualización ${fecha}`"
 *     :breadcrumb="[
 *       { label: 'Dashboard', to: '/admin', icon: 'bi-house-door' },
 *       { label: 'Catálogo de Precios', icon: 'bi-tag' }
 *     ]"
 *   >
 *     <template #actions>...</template>
 *   </PageHeader>
 */
import type { RouteLocationRaw } from 'vue-router'

export interface Crumb {
  label: string
  to?: RouteLocationRaw
  icon?: string
}

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** clase del icono, p. ej. 'bi-tag-fill' */
    icon?: string
    breadcrumb?: Crumb[]
  }>(),
  { breadcrumb: () => [] }
)
</script>
