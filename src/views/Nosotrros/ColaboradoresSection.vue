<template>
  <section class="colaboradores-section py-5" data-aos="fade-up">
    <div class="container">
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 class="section-title mb-1">COLABORADORES TÉCNICOS</h2>
          <p class="section-subtitle text-muted mb-0">Nuestro equipo de expertos técnicos garantiza la excelencia y precisión en cada análisis</p>
        </div>
        <div class="d-none d-md-block">
          <div class="results-counter">
            <i class="bi bi-people-fill me-2"></i>
            Mostrando {{ filteredColaboradores.length }} de {{ colaboradores.length }}
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Left: filtros + lista compacta -->
        <aside class="col-lg-4 mb-4">
          <div class="filter-panel mb-3">
            <input v-model="search" class="form-control search-input" placeholder="Buscar por nombre o especialidad..." />
          </div>

          <div class="filter-container mb-3" data-aos="fade-up" data-aos-delay="80">
            <h6 class="filter-title mb-2">Especialidades</h6>
            <div class="d-flex flex-wrap gap-2">
              <button v-for="specialty in specialties" :key="specialty" class="filter-btn" :class="{ 'active': activeFilter === specialty }" @click="setActiveFilter(specialty)">{{ specialty }}</button>
              <button class="filter-btn" :class="{ 'active': activeFilter === 'todos' }" @click="setActiveFilter('todos')">Todos</button>
            </div>
          </div>

          <div class="list-avatars" data-aos="fade-up" data-aos-delay="160">
            <div v-for="col in filteredColaboradores" :key="col.id" class="avatar-item" :class="{ 'active': selectedId === col.id }" @click="select(col.id)">
              <div class="avatar" :style="{ background: avatarColorFor(col.id) }">{{ getInitials(col.nombre) }}</div>
              <div class="avatar-meta d-none d-md-block">
                <div class="name">{{ col.nombre }}</div>
                <div class="small text-muted">{{ col.titulo }}</div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right: detalle seleccionado o grid en móvil -->
        <div class="col-lg-8">
          <div v-if="selectedColaborador" class="detail-panel" data-aos="fade-left">
            <ColaboradorCard :colaborador="selectedColaborador" :current-theme="currentTheme" />
          </div>

          <div class="d-block d-md-none mt-4">
            <!-- Mobile: show compact carousel/grid -->
            <div class="row g-3">
              <div v-for="col in filteredColaboradores" :key="col.id" class="col-12">
                <ColaboradorCard :colaborador="col" :current-theme="currentTheme" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import ColaboradorCard from './ColaboradorCard.vue'

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
  currentTheme: Theme
}

// Props
const props = defineProps<Props>()

// Estado
const colaboradores: Colaborador[] = [
  {
    id: 1,
    nombre: 'Ing. Jorge Nava Martínez',
    titulo: 'Ingeniero Industrial Mecánico',
    especialidad: ['Masa'],
    descripcion: 'Experto Técnico en: Masa',
    experiencia: 'Más de 15 años de experiencia en metrología de masa y densidad.',
    formacion: 'Egresado del Instituto Tecnológico de Celaya, Gto. México.',
    certificaciones: ['Sartorius AG (Alemania)', 'NIST (EUA)', 'PTB (Alemania)', 'BIPM (Francia)'],
    destacado: true
  },
  {
    id: 2,
    nombre: 'Dr. Victor Martínez Fuentes',
    titulo: 'Doctor en Tecnología Avanzada',
    especialidad: ['Temperatura', 'Humedad', 'Estadística'],
    descripcion: 'Experto Técnico en: Temperatura, Humedad y Estadística',
    experiencia: '12 años como colaborador técnico en SENA.',
    formacion: 'CICATA-IPN, Profesor Investigador de Ingeniería Mecatrónica UPQ.',
    certificaciones: ['NIST (EUA)', 'KRISS (Corea del sur)', 'CENAM'],
  },
  {
    id: 3,
    nombre: 'M. en C. Mario Dagoberto Díaz Orgaz',
    titulo: 'Maestría en Metrología',
    especialidad: ['Dimensional'],
    descripcion: 'Experto Técnico en: Dimensional',
    experiencia: 'Especialista en metrología mecánica, dimensional y analizadores específicos.',
    formacion: 'Maestría en metrología.',
    certificaciones: ['Evaluador técnico EMA', 'Entrenamiento para evaluador líder'],
  },
  {
    id: 4,
    nombre: 'M. en C. Mariano Botello',
    titulo: 'Maestría en Ingeniería Eléctrica',
    especialidad: ['Eléctrica'],
    descripcion: 'Experto Técnico en: Eléctrica',
    experiencia: '18 años de experiencia en desarrollo de patrones y sistemas de referencia.',
    formacion: 'CINVESTAV-IPN',
    certificaciones: ['CENAM - Mediciones Electromagnéticas', 'CENAM - Radiofrecuencias'],
  },
  {
    id: 5,
    nombre: 'Ing. Adrián Reyes del Valle',
    titulo: 'Ingeniero en Instrumentación',
    especialidad: ['Mediciones analíticas'],
    descripcion: 'Experto Técnico en: Mediciones analíticas',
    experiencia: 'Consultor internacional en certificación de materiales de referencia.',
    formacion: 'UNAM con especialidad en Instrumentación',
    certificaciones: ['CENAM', 'UNAM', 'ININ', 'CIDESI'],
  },
  {
    id: 6,
    nombre: 'Mtra. Marilyn López Pino',
    titulo: 'Maestría en Ingeniería Industrial',
    especialidad: ['Volumen'],
    descripcion: 'Experto Técnico en: Volumen',
    experiencia: 'Más de 25 años como especialista en volumen y flujo.',
    formacion: 'Maestría en Ingeniería Industrial y diplomado en calidad.',
    certificaciones: ['EMA Evaluadora', 'Red Conocer EC0913', 'ISO/IEC 17025', 'ISO 9001'],
  },
  {
    id: 7,
    nombre: 'Ing. Juan Carlos Jiménez Arias',
    titulo: 'Ingeniero Industrial',
    especialidad: ['Presión', 'Volumen'],
    descripcion: 'Experto Técnico en: Presión y Volumen',
    experiencia: '27 años de experiencia en metrología.',
    formacion: 'Universidad UNIVER',
    certificaciones: ['EMA Experto Técnico', 'Premio Compromiso con la acreditación 2016-2019'],
    destacado: true
  },
  {
    id: 8,
    nombre: 'M. en C. Alejandro Navarro Nateras',
    titulo: 'Maestría en Ciencias en Materiales',
    especialidad: ['Flujo de gas', 'Presión'],
    descripcion: 'Experto Técnico en: Flujo de gas y Presión',
    experiencia: '20 años de experiencia en metrología de presión y vacío.',
    formacion: 'Instituto Tecnológico de Morelia',
    certificaciones: ['CENAM', 'NIST'],
  },
  {
    id: 9,
    nombre: 'Lic. Alejandro Oharriz Calderón',
    titulo: 'Licenciado en Física',
    especialidad: ['Flujo de líquidos'],
    descripcion: 'Experto Técnico en: Flujo de líquidos',
    experiencia: 'Consultor independiente para acreditación de laboratorios.',
    formacion: 'Universidad de La Habana',
    certificaciones: ['ISO 17025', 'INIMET (Cuba)'],
  },
  {
    id: 10,
    nombre: 'Ing. Alfredo Sánchez',
    titulo: 'Ingeniero Industrial',
    especialidad: ['Masa'],
    descripcion: 'Experto Técnico en: Masa',
    experiencia: '31 años en CIDESI, actual director de Alianza Metrológica de Querétaro.',
    formacion: 'Instituto Tecnológico de Aguascalientes',
    certificaciones: ['INIMET (Cuba)', 'CENAM', 'EMA Evaluador desde 1999'],
  },
  {
    id: 11,
    nombre: 'M. en I. Juan Benjamín Soriano Cardona',
    titulo: 'Maestría en Ingeniería Eléctrica',
    especialidad: ['Densidad'],
    descripcion: 'Experto Técnico en: Densidad',
    experiencia: 'Coordinador del área de masa, densidad y volumen en Metas.',
    formacion: 'Maestría en Ingeniería Eléctrica',
    certificaciones: ['Autor y ponente internacional', 'Comité directivo de Metas'],
  }
]

const activeFilter: Ref<string> = ref('todos')
const search: Ref<string> = ref('')
const selectedId: Ref<number | null> = ref(colaboradores.length ? colaboradores[0].id : null)

// Computed
const specialties = computed(() => {
  const allSpecialties = new Set<string>()
  colaboradores.forEach(col => {
    col.especialidad.forEach(spec => allSpecialties.add(spec))
  })
  return Array.from(allSpecialties).sort()
})

const filteredColaboradores = computed(() => {
  const term = search.value.trim().toLowerCase()
  let list = colaboradores
  if (activeFilter.value !== 'todos') {
    list = list.filter(col => col.especialidad.some(spec => spec === activeFilter.value))
  }
  if (term) {
    list = list.filter(col => {
      return (
        col.nombre.toLowerCase().includes(term) ||
        col.titulo.toLowerCase().includes(term) ||
        col.especialidad.join(' ').toLowerCase().includes(term)
      )
    })
  }
  return list
})

const selectedColaborador = computed(() => colaboradores.find(c => c.id === selectedId.value) || null)

// Métodos
const setActiveFilter = (filter: string) => {
  activeFilter.value = filter
  // reset selection to first of filtered
  const next = filteredColaboradores.value[0]
  selectedId.value = next ? next.id : null
}

const select = (id: number) => {
  selectedId.value = id
}

const avatarColorFor = (id: number) => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ]
  return colors[id % colors.length]
}

const getInitials = (nombre: string) => {
  return nombre
    .split(' ')
    .map(word => word[0] || '')
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
</script>

<style scoped>
.colaboradores-section {
  background: linear-gradient(180deg, rgba(248,249,250,0.6), rgba(255,255,255,0.6));
  border-radius: var(--border-radius, 14px);
  padding: 4rem 0;
}

[data-bs-theme="dark"] .colaboradores-section {
  background: linear-gradient(180deg, rgba(20,20,20,0.6), rgba(12,12,12,0.55));
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.filter-container {
  background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.45));
  border-radius: var(--border-radius, 12px);
  padding: 1.25rem;
  border: 1px solid rgba(30,30,30,0.04);
  box-shadow: 0 8px 30px rgba(16,24,40,0.06);
}

[data-bs-theme="dark"] .filter-container {
  background: linear-gradient(180deg, rgba(30,30,30,0.55), rgba(20,20,20,0.5));
  border: 1px solid rgba(255,255,255,0.03);
}

.filter-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
}

[data-bs-theme="dark"] .filter-title {
  color: var(--color-dark, #F8F9FA);
}

.filter-btn {
  padding: 0.45rem 1rem;
  border: none;
  border-radius: 999px;
  background: rgba(30,30,30,0.04);
  color: rgba(30,30,30,0.75);
  font-weight: 600;
  transition: transform .18s ease, background .18s ease;
  cursor: pointer;
}

.filter-btn:hover { transform: translateY(-3px); background: rgba(30,158,74,0.08); color: var(--color-primary, #1E9E4A); }

.filter-btn.active { background: linear-gradient(90deg,#1E9E4A,#34B565); color: #fff; box-shadow: 0 8px 20px rgba(30,158,74,0.14); }

[data-bs-theme="dark"] .filter-btn {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2D2D2D);
  color: var(--color-gray-dark, #ADB5BD);
}

.results-counter {
  padding: .75rem 1rem;
  background: linear-gradient(90deg, rgba(30,158,74,0.08), rgba(52,181,101,0.06));
  border-radius: 10px;
  border: 1px solid rgba(30,158,74,0.12);
  color: rgba(30,30,30,0.75);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

/* New layout styles */
.filter-panel .search-input { border-radius: 10px; padding: .6rem .8rem; }
.list-avatars { display:flex; flex-direction:column; gap:.6rem; max-height: 58vh; overflow:auto; padding-right:.25rem }
.avatar-item { display:flex; align-items:center; gap:.75rem; padding:.5rem; border-radius:10px; cursor:pointer; transition:all .16s ease }
.avatar-item:hover { transform:translateY(-3px); background: rgba(30,30,30,0.03) }
.avatar-item.active { background: linear-gradient(90deg,#1E9E4A22,#34B56511); box-shadow:0 8px 20px rgba(30,158,74,0.06) }
.avatar-item .avatar { width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; border:2px solid rgba(255,255,255,0.08) }
.avatar-meta .name { font-weight:700; font-size:.95rem }

.detail-panel { transition: all .28s cubic-bezier(.2,.9,.3,1) }

@media (max-width: 767.98px) {
  .list-avatars { flex-direction:row; gap:.6rem; overflow-x:auto; max-height:none }
  .avatar-item { min-width:110px; flex-direction:column; padding:.6rem; text-align:center }
  .avatar-meta.d-none.d-md-block { display:block!important }
}

[data-bs-theme="dark"] .results-counter { color: rgba(255,255,255,0.9); background: linear-gradient(90deg, rgba(30,158,74,0.06), rgba(30,158,74,0.04)); }

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .colaboradores-section {
    padding: 3rem 0;
  }
}

@media (max-width: 576px) {
  .section-title {
    font-size: 1.75rem;
  }

  .filter-container {
    padding: 1rem;
  }
}
</style>
