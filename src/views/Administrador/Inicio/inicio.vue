<template>
  <div class="admin-page" :class="{ 'content-ready': sidenavReady }">
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUiStore from '@/composables/useUiStore'

const ui = useUiStore()
const router = useRouter()

onMounted(() => {
  // asegurar que esta vista use el layout del sidebar
  try {
    ui.setSidebarVisible(true)
    ui.setNavbarVisible(false)
  } catch (e) {
    // noop
  }
})

// The layout margin is handled globally by App.vue (CSS var --app-left-margin / #app-view style)

// Wait until sidenavbar transition finishes to start view entrance animation
const sidenavReady = ref(false)
const onSidenavReady = () => {
  if (!sidenavReady.value) sidenavReady.value = true
}

let fallbackTimer: number | null = null
onMounted(() => {
  window.addEventListener('sidenav-ready', onSidenavReady)
  // If there's no sidenav or it's not visible, mark ready immediately
  if (!ui.state.sidebarVisible || ui.state.navbarVisible) {
    sidenavReady.value = true
    return
  }
  // fallback: if no event arrives, show content after 400ms
  fallbackTimer = window.setTimeout(() => {
    onSidenavReady()
    fallbackTimer = null
  }, 400)
})

onUnmounted(() => {
  window.removeEventListener('sidenav-ready', onSidenavReady)
  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
})
</script>

<style scoped>
.admin-page { min-height: 100vh; padding-top: var(--navbar-height, 0px); box-sizing: border-box; }
.page-header { padding: 1.25rem 0; background: transparent; border-bottom: 1px solid rgba(0,0,0,0.04); }
.page-title { margin: 0; font-size: 1.4rem; font-weight: 700; }
.breadcrumb { margin-top: 6px; color: #6c757d }

.page-body { padding: 1.25rem 0 3rem 0; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem }
.stat-card { padding: 1rem; border-radius: 8px; background: var(--card-bg, #fff); box-shadow: 0 6px 18px rgba(0,0,0,0.04); text-align: left }
.stat-value { font-size: 1.5rem; font-weight: 800 }
.stat-label { font-size: 0.85rem; color: #6c757d }

.layout-rows { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem }
.panel { background: var(--card-bg, #fff); border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.04); overflow: hidden }
.panel-header { padding: 0.85rem 1rem; border-bottom: 1px solid rgba(0,0,0,0.04) }
.panel-body { padding: 1rem }
.table { width: 100%; border-collapse: collapse }
.table th, .table td { padding: 0.5rem 0.75rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.04) }

.shortcut-list { display:flex; flex-direction:column; gap:0.6rem }

@media (max-width: 991px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr) }
  .layout-rows { grid-template-columns: 1fr; }
  .admin-page { margin-left: 0 !important }
}

/* entrance animation delayed until sidenav is ready */
.admin-page { opacity: 0; transform: translateY(8px); transition: opacity .35s ease, transform .35s ease }
.admin-page.content-ready { opacity: 1; transform: none }
</style>
