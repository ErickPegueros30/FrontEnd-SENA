<template>
  <div class="page">
    <h2>Reportes y Resultados</h2>
    <ul>
      <li v-for="r in reportes" :key="r.id" class="rep-item">
        <div>
          <strong>{{ r.title }}</strong>
          <div class="muted">Emitido: {{ formatDate(r.fecha) }}</div>
        </div>
        <div>
          <a :href="r.url" target="_blank" v-if="r.url">Ver PDF</a>
        </div>
      </li>
      <li v-if="reportes.length===0">Aún no hay reportes.</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const reportes = ref<Array<any>>([])
onMounted(()=>{ const store = JSON.parse(localStorage.getItem('mock_cliente_data')||'{}'); reportes.value = store.reportes || [] })
function formatDate(d?:string){ if(!d) return ''; return new Date(d).toLocaleString() }
</script>

<style scoped>
.page{ padding:16px }
.rep-item{ display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid var(--color-border) }
.muted{ color:var(--color-text); opacity:0.7 }
</style>
