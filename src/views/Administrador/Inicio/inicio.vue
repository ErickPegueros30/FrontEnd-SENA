<template>
  <div class="admin-page" :style="pageStyle">
    <section class="page-header">
      <div class="container">
        <h2 class="page-title">Panel Administrativo</h2>
        <nav class="breadcrumb">
          <span>Inicio</span>
        </nav>
      </div>
    </section>

    <section class="page-body container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">1,248</div>
          <div class="stat-label">Usuarios</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">76</div>
          <div class="stat-label">Cursos activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">3,412</div>
          <div class="stat-label">Inscripciones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">24</div>
          <div class="stat-label">Solicitudes nuevas</div>
        </div>
      </div>

      <div class="layout-rows">
        <div class="panel recent">
          <div class="panel-header">
            <h3>Actividad reciente</h3>
          </div>
          <div class="panel-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Acción</th>
                  <th>Usuario</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in recent" :key="idx">
                  <td>{{ r.time }}</td>
                  <td>{{ r.action }}</td>
                  <td>{{ r.user }}</td>
                  <td>{{ r.detail }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="panel shortcuts">
          <div class="panel-header">
            <h3>Acciones rápidas</h3>
          </div>
          <div class="panel-body">
            <div class="shortcut-list">
              <button class="btn btn-primary" @click="goTo('/admin/dashboard')">Ir a Dashboard</button>
              <button class="btn btn-outline-primary" @click="goTo('/admin/usuarios')">Gestionar Usuarios</button>
              <button class="btn btn-outline-success" @click="goTo('/admin/cursos')">Gestionar Cursos</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUiStore from '@/compasable/useUiStore'

const ui = useUiStore()
const router = useRouter()

// sample recent activity
const recent = ref([
  { time: '09:12', action: 'Inicio de sesión', user: 'Administrador', detail: 'Sesión iniciada desde IP 10.0.0.1' },
  { time: '09:45', action: 'Creación de curso', user: 'Empleado', detail: 'Curso "Vue Básico" creado' },
  { time: '10:20', action: 'Inscripción', user: 'Cliente', detail: 'Usuario 234 ingresado al curso' }
])

onMounted(() => {
  // asegurar que esta vista use el layout del sidebar
  try {
    ui.setSidebarVisible(true)
    ui.setNavbarVisible(false)
  } catch (e) {
    // noop
  }
})

const goTo = (path: string) => {
  router.push(path).catch(() => {})
}

const isCollapsed = computed(() => ui.state.sidebarCollapsed)
const pageStyle = computed(() => {
  if (!ui.state.sidebarVisible) return { marginLeft: '0' }
  return { marginLeft: isCollapsed.value ? '70px' : '280px', transition: 'margin-left 0.25s ease' }
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
</style>
