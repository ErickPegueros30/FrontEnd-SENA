<template>
  <div class="colaborador-card" :class="{ 'highlighted': colaborador.destacado }">
    <div class="card-top" :style="{ background: headerGradient }">
      <div class="avatar-block">
        <div class="avatar" :style="{ background: avatarColor }">
          {{ getInitials(colaborador.nombre) }}
        </div>
      </div>
      <div class="meta">
        <h3 class="nombre">{{ colaborador.nombre }}</h3>
        <p class="titulo">{{ colaborador.titulo }}</p>
        <div class="especialidades">
          <span
            v-for="(especialidad, index) in colaborador.especialidad"
            :key="index"
            class="chip"
          >
            {{ especialidad }}
          </span>
        </div>
      </div>
      <div v-if="colaborador.destacado" class="ribbon" aria-hidden>
        <i class="bi bi-star-fill"></i>
      </div>
    </div>

    <div class="card-body">
      <div class="descripcion">
        <h6 class="section-label">
          <i class="bi bi-person-badge me-2"></i>Especialidad
        </h6>
        <p class="mb-0">{{ colaborador.descripcion }}</p>
      </div>

      <div class="meta-row">
        <div>
          <h6 class="section-label small">
            <i class="bi bi-briefcase me-2"></i>Experiencia
          </h6>
          <p class="small mb-0">{{ colaborador.experiencia }}</p>
        </div>

        <div>
          <h6 class="section-label small">
            <i class="bi bi-mortarboard me-2"></i>Formación
          </h6>
          <p class="small mb-0">{{ colaborador.formacion }}</p>
        </div>
      </div>

      <div v-if="colaborador.certificaciones && colaborador.certificaciones.length > 0" class="certificaciones mt-3">
        <h6 class="section-label">
          <i class="bi bi-award me-2"></i>Certificaciones
        </h6>
        <div class="certificaciones-list">
          <span
            v-for="(cert, index) in colaborador.certificaciones"
            :key="index"
            class="certificacion-item"
          >
            <i class="bi bi-check-circle-fill"></i> {{ cert }}
          </span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <button class="btn-contactar" @click="contactarColaborador">
        <i class="bi bi-envelope me-2"></i>Contactar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

// Tipos
interface Colaborador {
  id: number
  nombre: string
  titulo: string
  especialidad: string[]
  descripcion: string
  experiencia: string
  formacion: string
  certificaciones: string[]
  imagen?: string
  destacado?: boolean
}

type Theme = 'light' | 'dark'

interface Props {
  colaborador: Colaborador
  currentTheme: Theme
}

// Props
const props = defineProps<Props>()

// Computed
const headerGradient = computed(() => {
  if (props.colaborador.destacado) {
    return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
  }
  return 'linear-gradient(135deg, #1E9E4A 0%, #34B565 100%)'
})

const avatarColor = computed(() => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ]
  const index = props.colaborador.id % colors.length
  return colors[index]
})

// Métodos
const getInitials = (nombre: string): string => {
  return nombre
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const contactarColaborador = () => {
  // Aquí iría la lógica para contactar al colaborador
  console.log(`Contactando a ${props.colaborador.nombre}`)
  // Podrías emitir un evento o abrir un modal
}
</script>

<style scoped>
.colaborador-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(30,30,30,0.04);
  box-shadow: 0 6px 20px rgba(16,24,40,0.08);
  transition: transform .28s ease, box-shadow .28s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

[data-bs-theme="dark"] .colaborador-card {
  background: linear-gradient(180deg, rgba(30,30,30,0.55), rgba(20,20,20,0.5));
  border: 1px solid rgba(255,255,255,0.04);
  box-shadow: 0 6px 24px rgba(0,0,0,0.5);
}

.colaborador-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 40px rgba(16,24,40,0.14);
}

.colaborador-card.highlighted {
  outline: 3px solid rgba(255,215,0,0.12);
  box-shadow: 0 18px 50px rgba(255,215,0,0.08);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  position: relative;
}

.avatar-block { flex: 0 0 auto; }

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.15rem;
  color: white;
  flex-shrink: 0;
  border: 3px solid rgba(255,255,255,0.18);
  box-shadow: 0 6px 18px rgba(30, 158, 74, 0.12);
}

.meta { flex: 1 1 auto; }
.nombre {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 .2rem 0;
}
.titulo {
  font-size: .9rem;
  margin: 0;
  color: rgba(30,30,30,0.6);
}

[data-bs-theme="dark"] .titulo { color: rgba(255,255,255,0.68); }

.chip {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.95);
  padding: .25rem .6rem;
  border-radius: 999px;
  font-size: .75rem;
  margin-right: .4rem;
  margin-top: .45rem;
}

[data-bs-theme="dark"] .chip { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }

.ribbon {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(45deg,#FFD54A,#FF8A65);
  color: #222;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow: 0 6px 18px rgba(255,170,0,0.12);
}

.card-body {
  padding: 1rem 1.25rem 1.25rem 1.25rem;
  flex: 1 1 auto;
}

.section-label { display:flex; align-items:center; gap:.5rem; color:var(--color-primary, #1E9E4A); font-weight:600; }
[data-bs-theme="dark"] .section-label { color:var(--color-primary-light, #34B565); }

.descripcion p, .meta-row p { color: rgba(30,30,30,0.7); margin:0; }
[data-bs-theme="dark"] .descripcion p, [data-bs-theme="dark"] .meta-row p { color: rgba(255,255,255,0.78); }

.meta-row { display:flex; gap:2rem; margin-top:1rem; flex-wrap:wrap; }
.meta-row > div { flex:1 1 180px; }

.certificaciones-list { display:flex; flex-direction:column; gap:.45rem; margin-top:.5rem; }
.certificacion-item { font-size:.85rem; color:rgba(30,30,30,0.68); display:flex; gap:.5rem; align-items:center; }
[data-bs-theme="dark"] .certificacion-item { color: rgba(255,255,255,0.78); }

.card-footer {
  padding: .85rem 1.25rem;
  border-top: 1px solid rgba(30,30,30,0.04);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
}

[data-bs-theme="dark"] .card-footer { border-top: 1px solid rgba(255,255,255,0.03); }

.btn-contactar {
  width: 100%;
  padding: .65rem;
  background: transparent;
  color: var(--color-primary, #1E9E4A);
  border: 2px solid rgba(30,158,74,0.12);
  border-radius: 10px;
  font-weight:700;
  transition: all .22s ease;
}
.btn-contactar:hover { background: linear-gradient(90deg,#1E9E4A33,#34B56533); color: #fff; transform: translateY(-2px); }

@media (max-width: 768px) {
  .avatar { width:64px; height:64px; }
  .nombre { font-size:1rem }
  .meta-row { gap:1rem }
}

@media (max-width: 576px) {
  .card-top { flex-direction: row; gap: .75rem; }
  .chip { margin-top:.3rem }
}
</style>
