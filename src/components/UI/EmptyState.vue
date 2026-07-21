<template>
  <div class="empty-content">
    <i :class="`bi ${icon} empty-icon`" aria-hidden="true"></i>
    <h5>{{ title }}</h5>
    <p v-if="message" class="text-muted">{{ message }}</p>
    <slot>
      <button v-if="actionLabel" class="btn btn-outline-primary" @click="$emit('action')">
        <i v-if="actionIcon" :class="`bi ${actionIcon} me-1`"></i>{{ actionLabel }}
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
/**
 * Estado vacío para tablas y listados. Presente en 14 vistas.
 * El <td colspan> lo pone la vista; este componente es solo el contenido.
 */
withDefaults(
  defineProps<{
    icon?: string
    title?: string
    message?: string
    actionLabel?: string
    actionIcon?: string
  }>(),
  {
    icon: 'bi-inbox',
    title: 'No se encontraron registros',
    actionIcon: 'bi-arrow-counterclockwise'
  }
)

defineEmits<{ action: [] }>()
</script>
