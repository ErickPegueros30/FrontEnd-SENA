<template>
  <div :data-bs-theme="currentTheme" class="ensayos-page">

    <!-- Hero Section -->
    <section class="ensayos-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Programa de Ensayos de Aptitud 2026</h1>
          <div class="hero-line"></div>
        </div>
      </div>
      <div class="hero-decoration"></div>
    </section>

    <!-- Área y Subáreas -->
    <section class="area-section">
      <div class="container">
        <div class="area-header">
          <h2 class="area-title">{{ areaTitle }}</h2>
          <div class="title-underline"></div>
        </div>

        <!-- Subáreas Menu -->
        <div class="subareas-menu" v-if="displaySubareas.length > 0">
          <button
            v-for="subarea in displaySubareas"
            :key="subarea.id"
            :class="['subarea-btn', { active: activeSubarea === subarea.id }]"
            @click="activeSubarea = subarea.id"
          >
            <div class="subarea-icon">
              <i :class="subarea.icon"></i>
            </div>
            <span class="subarea-name">{{ subarea.name }}</span>
          </button>
        </div>

        <!-- Tabla de Ensayos -->
        <div class="ensayos-table-wrapper">
          <div class="table-header">
            <div class="table-title-group">
              <h3 class="table-title">{{ currentSubareaName }}</h3>
              <span class="table-badge">{{ currentSubareaPrograms.length }} programas</span>
            </div>
            <button class="btn-bilateral" @click="openBilateralModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
              </svg>
              Bilateral
            </button>
          </div>

          <div class="table-responsive">
            <table class="ensayos-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Descripción del elemento de ensayo</th>
                  <th>Periodo de inscripción</th>
                  <th>Fecha de inicio del ensayo de aptitud</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="currentSubareaPrograms.length === 0">
                  <td colspan="6" style="text-align:center; padding:2rem; color:var(--sena-muted);">No hay ensayos propuestos</td>
                </tr>
                <tr v-else v-for="(programa, index) in currentSubareaPrograms" :key="programa.codigo || index">
                  <td>
                    <span class="ciclo-badge">{{ programa.codigo }}</span>
                  </td>
                  <td>
                    <div class="descripcion-cell">
                      <span class="descripcion-text">{{ programa.descripcion }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="fecha-cell">
                      <span class="fecha-label">Inicio:</span>
                      <span>{{ programa.inscripcionInicio }}</span>
                      <span class="fecha-label">Fin:</span>
                      <span>{{ programa.inscripcionFin }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="fecha-cell">
                      <span>{{ programa.fechaInicio }}</span>
                      <span class="fecha-detalle">{{ programa.fechaDetalle }}</span>
                    </div>
                  </td>
                  <td>
                    <span v-if="programa.disponible" class="estado-abierto">Abierto</span>
                    <span v-else class="estado-cerrado">Cerrado</span>
                  </td>
                  <td>
                    <button
                      v-if="programa.disponible"
                      class="btn-carrito"
                      @click="openCarritoModal(programa)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                      </svg>
                      <span>Comprar</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Bilateral -->
    <div v-if="showBilateralModal" class="modal-overlay" @click="closeBilateralModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ensayos Bilaterales</h3>
          <button class="modal-close" @click="closeBilateralModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-text">
            Los ensayos bilaterales son programas personalizados diseñados específicamente para las necesidades de su laboratorio.
          </p>
          <div class="bilateral-features">
            <div class="bilateral-feature">
              <i class="bi bi-calendar-check"></i>
              <span>Fechas flexibles</span>
            </div>
            <div class="bilateral-feature">
              <i class="bi bi-shield-check"></i>
              <span>Certificación garantizada</span>
            </div>
            <div class="bilateral-feature">
              <i class="bi bi-people"></i>
              <span>Acompañamiento personalizado</span>
            </div>
          </div>
          <button class="btn-contactar-bilateral" @click="goToContact">
            Solicitar información
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Carrito -->
    <div v-if="showCarritoModal" class="modal-overlay" @click="closeCarritoModal">
      <div class="modal-content carrito-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Compra</h3>
          <button class="modal-close" @click="closeCarritoModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="carrito-detalle" v-if="selectedPrograma">
            <h4>{{ selectedPrograma.descripcion }}</h4>
            <p><strong>Código:</strong> {{ selectedPrograma.codigo }}</p>
            <p><strong>Ciclo:</strong> {{ selectedPrograma.ciclo }}</p>
            <p><strong>Fecha de inicio:</strong> {{ selectedPrograma.fechaInicio }}</p>
            <p><strong>Precio:</strong> <span class="precio-destacado">${{ selectedPrograma.precio || 'Consultar' }}</span></p>
          </div>
          <div class="carrito-actions">
            <button class="btn-cancelar" @click="closeCarritoModal">Cancelar</button>
            <button class="btn-confirmar" @click="confirmarCompra">
              Confirmar compra
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow">Ayuda</span>
          <h2 class="section-title">Preguntas Frecuentes</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Resolvemos tus dudas más comunes</p>
        </div>

        <div class="faq-grid">
          <div
            v-for="faq in faqs"
            :key="faq.id"
            class="faq-card"
            :class="{ 'expanded': expandedFaq === faq.id }"
          >
            <button class="faq-header" @click="toggleFaq(faq.id)">
              <div class="faq-question">
                <i class="bi bi-question-circle-fill"></i>
                <span>{{ faq.question }}</span>
              </div>
              <div class="faq-toggle">
                <i :class="expandedFaq === faq.id ? 'bi bi-dash-lg' : 'bi bi-plus-lg'"></i>
              </div>
            </button>
            <div class="faq-body" :class="{ 'show': expandedFaq === faq.id }">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>

        <div class="text-center mt-5">
          <p class="faq-footer-text">¿No encontraste lo que buscabas?</p>
          <button class="doc-btn">
            <i class="bi bi-chat-left-text"></i>
            <span>Contactar soporte</span>
          </button>
        </div>
      </div>
    </section>

    <FooterComponent :current-theme="currentTheme" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FooterComponent from '@/components/Footer.vue/Footer.vue'

type Theme = 'light' | 'dark'

interface Programa {
  ciclo: string
  descripcion: string
  codigo: string
  inscripcionInicio: string
  inscripcionFin: string
  fechaInicio: string
  fechaDetalle: string
  disponible: boolean
  precio?: string
  area?: string
  subarea?: string
  rama?: string
  areaId?: number
  subareaId?: number
  ramaId?: number
  subramaId?: number
}

interface Subarea {
  id: string
  name: string
  icon: string
}

const router = useRouter()
const API_BASE = (import.meta.env?.VITE_API_BASE as string) || 'http://localhost:3000'
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')
const activeSubarea = ref<string | null>(null)
const serviceFilter = ref<string | null>(null)
const showBilateralModal = ref(false)
const showCarritoModal = ref(false)
const selectedPrograma = ref<Programa | null>(null)
const expandedFaq = ref<number | null>(1)

// Nota: se eliminó el listado dummy de subáreas; ahora dependemos del catálogo del backend

// Mapas dinámicos: subáreas por área, subramas por rama (claves como strings)
const subareasMap = ref<Record<string, any[]>>({})
const subramasMap = ref<Record<string, any[]>>({})

const fetchSubareasForArea = async (areaId: number) => {
  try {
    const resp = await fetch(`${API_BASE}/api/areas/${areaId}/subareas`)
    if (!resp.ok) return
    const data = await resp.json()
    subareasMap.value[String(areaId)] = Array.isArray(data) ? data : (data.data || [])
  } catch (e) {
    console.error('fetchSubareasForArea', e)
  }
}

const fetchSubramasForRama = async (ramaId: number) => {
  try {
    const resp = await fetch(`${API_BASE}/api/ramas/${ramaId}/subramas`)
    if (!resp.ok) return
    const data = await resp.json()
    subramasMap.value[String(ramaId)] = Array.isArray(data) ? data : (data.data || [])
  } catch (e) {
    console.error('fetchSubramasForRama', e)
  }
}

// Ensayos cargados desde API y agrupados por subárea/rama/área
const ensayos = ref<Programa[]>([])
const areasList = ref<any[]>([])
const ramasList = ref<any[]>([])

const fetchEnsayos = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/ensayos`)
    if (!resp.ok) {
      console.warn('fetchEnsayos: respuesta no ok', resp.status)
      return
    }
    const data = await resp.json()
    console.debug('fetchEnsayos raw:', data)
    // data puede ser array de ensayos
    const rows = Array.isArray(data) ? data : (data.data || [])
    ensayos.value = rows.map((r: any) => ({
      ciclo: r.ciclo || '',
      descripcion: r.descripcion || '',
      codigo: r.codigo || '',
      inscripcionInicio: r.inscripcionInicio || r.inscripcion_inicio || '',
      inscripcionFin: r.inscripcionFin || r.inscripcion_fin || '',
      fechaInicio: r.fechaInicio || r.fecha_inicio || r.fechaInicioEnsayo || r.fecha_inicio_ensayo || '',
      fechaDetalle: r.fechaDetalle || r.fecha_detalle || '',
      disponible: typeof r.disponible === 'boolean' ? r.disponible : (r.disponible === 't' || r.disponible === 'true'),
      area: r.area || r.nombre_area || r.area_name || '',
      subarea: r.subarea || r.nombre_subarea || r.subarea_name || '',
      rama: r.rama || r.nombre_rama || r.rama_name || '',
      areaId: r.areaId || r.area_id || r.areaId_fk || null,
      subareaId: r.subareaId || r.subarea_id || r.subareaId_fk || null,
      ramaId: r.ramaId || r.rama_id || r.ramaId_fk || null,
      subramaId: r.subramaId || r.subrama_id || r.subramaId_fk || null
    }))
  } catch (err) {
    console.error('Error fetching ensayos', err)
  }
}

const fetchAreas = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/areas`)
    if (!resp.ok) return
    const data = await resp.json()
    areasList.value = Array.isArray(data) ? data : (data.data || [])
  } catch (e) {
    console.error('fetchAreas', e)
  }
}

const fetchRamas = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/ramas`)
    if (!resp.ok) return
    const data = await resp.json()
    ramasList.value = Array.isArray(data) ? data : (data.data || [])
  } catch (e) {
    console.error('fetchRamas', e)
  }
}

// displaySubareas: si el filtro es un área, mostrar sus subáreas; si el filtro es una rama, mostrar sus subramas; si no, usar el fallback
const displaySubareas = computed(() => {
  if (serviceFilter.value) {
    const svc = String(serviceFilter.value).toLowerCase()
    const areaMatch = areasList.value.find((a: any) => ((a.nombre || a.name) || '').toLowerCase() === svc || ((a.nombre || a.name) || '').toLowerCase().includes(svc))
    if (areaMatch && subareasMap.value[String(areaMatch.id)]) {
      return subareasMap.value[String(areaMatch.id)].map((s: any) => ({ id: String(s.id), name: s.nombre || s.name, icon: s.icon || 'bi bi-grid' }))
    }
    const ramaMatch = ramasList.value.find((r: any) => ((r.nombre || r.name) || '').toLowerCase() === svc || ((r.nombre || r.name) || '').toLowerCase().includes(svc))
    if (ramaMatch && subramasMap.value[String(ramaMatch.id)]) {
      return subramasMap.value[String(ramaMatch.id)].map((s: any) => ({ id: String(s.id), name: s.nombre || s.name, icon: s.icon || 'bi bi-grid' }))
    }
  }
  return []
})

const faqs = [
  {
    id: 1,
    question: '¿Cuál es el tiempo de respuesta para solicitudes de cotización?',
    answer: 'Normalmente respondemos a las solicitudes de cotización en un plazo máximo de 24 horas hábiles. Para casos urgentes, puede contactarnos directamente por teléfono.'
  },
  {
    id: 2,
    question: '¿Qué información necesito proporcionar para solicitar un servicio?',
    answer: 'Requerimos datos básicos de contacto, información sobre el tipo de servicio requerido, especificaciones técnicas del material o equipo a analizar, y cualquier requisito especial que tenga.'
  },
  {
    id: 3,
    question: '¿Ofrecen servicio de recolección de muestras?',
    answer: 'Sí, contamos con servicio de recolección de muestras en la zona metropolitana. Para otras localidades, podemos coordinar el envío a través de paquetería especializada.'
  },
  {
    id: 4,
    question: '¿Cuál es el tiempo estimado para la entrega de resultados?',
    answer: 'El tiempo varía según el tipo de análisis. Los ensayos de rutina generalmente se entregan en 3-5 días hábiles, mientras que análisis especializados pueden tomar de 7 a 10 días hábiles.'
  }
]

const toggleFaq = (id: number) => {
  expandedFaq.value = expandedFaq.value === id ? null : id
}

const currentSubareaName = computed(() => {
  const subarea = displaySubareas.value.find(s => s.id === activeSubarea.value)
  return subarea ? `${subarea.name}` : ''
})

const areaTitle = computed(() => {
  if (serviceFilter.value) return `Ensayos de Aptitud - ${serviceFilter.value}`
  const subarea = displaySubareas.value.find(s => s.id === activeSubarea.value)
  return subarea ? `Ensayos de Aptitud - ${subarea.name}` : 'Ensayos de Aptitud'
})

const currentSubareaPrograms = computed(() => {
  // Si se pasó un servicio en la query, filtrar por ese servicio (coincidencia parcial case-insensitive)
  if (serviceFilter.value) {
    const svc = String(serviceFilter.value).toLowerCase()
    // try to find area/rama ids from catalog
    const areaMatch = areasList.value.find((a: any) => ((a.nombre || a.name) || '').toLowerCase() === svc || ((a.nombre || a.name) || '').toLowerCase().includes(svc))
    const ramaMatch = ramasList.value.find((r: any) => ((r.nombre || r.name) || '').toLowerCase() === svc || ((r.nombre || r.name) || '').toLowerCase().includes(svc))
    const areaId = areaMatch ? areaMatch.id : null
    const ramaId = ramaMatch ? ramaMatch.id : null
    const activeId = activeSubarea.value
    return ensayos.value.filter(e => {
      // if a specific subarea/subrama is selected, restrict to that id only
      if (activeId) {
        const matchBySub = (e.subareaId || e.subareaId === 0) && String(e.subareaId) === String(activeId)
        const matchBySubrama = (e.subramaId || e.subramaId === 0) && String(e.subramaId) === String(activeId)
        if (matchBySub || matchBySubrama) return true
        return false
      }
      // Prefer id-based matching when available
      if (areaId && (e.areaId || e.areaId === 0)) {
        if (Number(e.areaId) === Number(areaId)) return true
      }
      if (ramaId && (e.ramaId || e.ramaId === 0)) {
        if (Number(e.ramaId) === Number(ramaId)) return true
      }
      if (e.subareaId || e.subareaId === 0) {
        const sid = String(e.subareaId)
        if (displaySubareas.value.some((s: any) => s.id === sid && s.name.toLowerCase().includes(svc))) return true
      }
      if (e.subramaId || e.subramaId === 0) {
        const sr = String(e.subramaId)
        if (Object.values(subramasMap.value).flat().some((s: any) => String(s.id) === sr && (s.nombre || s.name || '').toLowerCase().includes(svc))) return true
      }
      // fallback to name-based matching
      const areaNameMatch = (e.area || '').toLowerCase().includes(svc)
      const subareaNameMatch = (e.subarea || '').toLowerCase().includes(svc)
      const ramaNameMatch = (e.rama || '').toLowerCase().includes(svc)
      return areaNameMatch || subareaNameMatch || ramaNameMatch
    })
  }

  const sub = displaySubareas.value.find(s => s.id === activeSubarea.value)
  // si no hay catálogo/subáreas disponibles, devolver todos los ensayos (fallback)
  if (!sub) return ensayos.value
  const name = sub.name
  // Prefer id-based filtering when ensayos include ids
  const filtered = ensayos.value.filter(e => {
    if (e.subareaId || e.subareaId === 0) {
      if (String(e.subareaId) === sub.id) return true
    }
    if (e.subramaId || e.subramaId === 0) {
      if (String(e.subramaId) === sub.id) return true
    }
    // fallback to name match
    const areaMatch = e.area && e.area.toLowerCase() === name.toLowerCase()
    const subareaMatch = e.subarea && e.subarea.toLowerCase() === name.toLowerCase()
    const ramaMatch = e.rama && e.rama.toLowerCase() === name.toLowerCase()
    return areaMatch || subareaMatch || ramaMatch
  })
  return filtered
})

const openBilateralModal = () => {
  showBilateralModal.value = true
  document.body.style.overflow = 'hidden'
}

// Debug: log filtered programs when activeSubarea or ensayos change
watch([activeSubarea, ensayos], () => {
  try {
    const codes = currentSubareaPrograms.value.map((p: any) => p.codigo || p.descripcion || 'n/a')
    console.debug('currentSubareaPrograms count:', codes.length, 'codes:', codes)
  } catch (e) {
    console.debug('watch currentSubareaPrograms error', e)
  }
})

onMounted(() => {
  const route = useRoute()
  const svc = route.query.service
  if (svc) serviceFilter.value = String(svc)
  // Cargar catálogos y ensayos; los catálogos permiten mapear el nombre de servicio
  ;(async () => {
    await Promise.all([fetchAreas(), fetchRamas(), fetchEnsayos()])
    // Si se pasó un servicio, intentar normalizarlo a nombres canónicos del catálogo
    if (serviceFilter.value) {
      const svcLower = serviceFilter.value.toLowerCase()
      const areaMatch = areasList.value.find((a: any) => ((a.nombre || a.name) || '').toLowerCase().includes(svcLower))
      const ramaMatch = ramasList.value.find((r: any) => ((r.nombre || r.name) || '').toLowerCase().includes(svcLower))
      if (areaMatch) {
        serviceFilter.value = (areaMatch.nombre || areaMatch.name)
        await fetchSubareasForArea(areaMatch.id)
        const subs = subareasMap.value[String(areaMatch.id)] || []
        if (subs.length) activeSubarea.value = String(subs[0].id)
      } else if (ramaMatch) {
        serviceFilter.value = (ramaMatch.nombre || ramaMatch.name)
        await fetchSubramasForRama(ramaMatch.id)
        const srs = subramasMap.value[String(ramaMatch.id)] || []
        if (srs.length) activeSubarea.value = String(srs[0].id)
      }
    }
  })()
})

// React to query changes when navigating from HomeView
const route = useRoute()
watch(() => route.query.service, async (v) => {
  serviceFilter.value = v ? String(v) : null
  if (!serviceFilter.value) return
  const svcLower = serviceFilter.value.toLowerCase()
  const areaMatch = areasList.value.find((a: any) => ((a.nombre || a.name) || '').toLowerCase().includes(svcLower))
  const ramaMatch = ramasList.value.find((r: any) => ((r.nombre || r.name) || '').toLowerCase().includes(svcLower))
  if (areaMatch) {
    await fetchSubareasForArea(areaMatch.id)
    const subs = subareasMap.value[String(areaMatch.id)] || []
    if (subs.length) activeSubarea.value = String(subs[0].id)
  } else if (ramaMatch) {
    await fetchSubramasForRama(ramaMatch.id)
    const srs = subramasMap.value[String(ramaMatch.id)] || []
    if (srs.length) activeSubarea.value = String(srs[0].id)
  }
})

const closeBilateralModal = () => {
  showBilateralModal.value = false
  document.body.style.overflow = ''
}

const openCarritoModal = (programa: Programa) => {
  selectedPrograma.value = programa
  showCarritoModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeCarritoModal = () => {
  showCarritoModal.value = false
  selectedPrograma.value = null
  document.body.style.overflow = ''
}

const confirmarCompra = () => {
  if (selectedPrograma.value) {
    alert(`¡Compra confirmada para: ${selectedPrograma.value.descripcion}!`)
    closeCarritoModal()
    router.push('/checkout')
  }
}

const goToContact = () => {
  closeBilateralModal()
  router.push('/contacto')
}
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-dark: #1a2612;
  --sena-forest: #0f1e09;
  --sena-text: #1c2b14;
  --sena-muted: #5a6a52;
  --sena-border: rgba(93, 138, 47, 0.14);
  --radius-card: 20px;
  --radius-sm: 10px;
  --shadow-sm: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  --shadow-green: 0 8px 28px rgba(93,138,47,0.22);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
}

.ensayos-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .ensayos-page {
  background: #0c0f0a;
  color: #e8ede3;
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122,171,61,0.16);
  --sena-green-pale: rgba(93,138,47,0.12);
}

/* ============================================================
   HERO
   ============================================================ */
.ensayos-hero {
  background: linear-gradient(135deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  padding: 5rem 0 4rem;
  position: relative;
  overflow: hidden;
}

[data-bs-theme="light"] .ensayos-hero {
  background: linear-gradient(135deg, #2a5a15 0%, #1a3d0c 60%, #0d2208 100%);
}

.hero-decoration {
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(93,138,47,0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-title {
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.2);
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
}

.hero-line {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green-light), var(--sena-green));
  margin: 0 auto;
  border-radius: 2px;
}

/* ============================================================
   ÁREA SECTION
   ============================================================ */
.area-section {
  padding: 4rem 0 5rem;
  background: #fafaf8;
}

[data-bs-theme="dark"] .area-section {
  background: #0c0f0a;
}

.area-header {
  text-align: center;
  margin-bottom: 3rem;
}

.area-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  background: var(--sena-green-pale);
  padding: 0.28rem 0.9rem;
  border-radius: 20px;
  margin-bottom: 0.6rem;
}

[data-bs-theme="light"] .area-badge {
  background: #e8f0d8;
  color: #4a7a20;
}

.area-title {
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}

.title-underline {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
  margin: 0.35rem auto 0;
}

/* ============================================================
   SUBÁREAS MENU
   ============================================================ */
.subareas-menu {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.subarea-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.5rem;
  background: #ffffff;
  border: 2px solid var(--sena-border);
  border-radius: 50px;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--sena-text);
  position: relative;
  z-index: 1;
}

[data-bs-theme="dark"] .subarea-btn {
  background: #131a0e;
  border-color: rgba(122,171,61,0.14);
  color: #e8ede3;
}

.subarea-btn:hover {
  border-color: var(--sena-green-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.subarea-btn.active {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
  box-shadow: var(--shadow-green);
}

[data-bs-theme="light"] .subarea-btn.active {
  background: linear-gradient(135deg, #4a7a20, #5d8a2f);
  color: #ffffff;
}

.subarea-icon {
  font-size: 1.2rem;
  color: inherit;
}

.subarea-name {
  font-size: 0.9rem;
  font-weight: 500;
}

/* ============================================================
   TABLA
   ============================================================ */
.ensayos-table-wrapper {
  background: #ffffff;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--sena-border);
}

[data-bs-theme="dark"] .ensayos-table-wrapper {
  background: #131a0e;
  border-color: rgba(122,171,61,0.1);
}

[data-bs-theme="light"] .ensayos-table-wrapper {
  background: #ffffff;
  border-color: #dce5d4;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--sena-border);
  flex-wrap: wrap;
  gap: 1rem;
}

[data-bs-theme="light"] .table-header {
  border-bottom-color: #e0e8d8;
  background: #f8faf6;
}

.table-title-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.table-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--sena-text);
  margin: 0;
}

.table-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
}

[data-bs-theme="light"] .table-badge {
  background: linear-gradient(135deg, #4a7a20, #5d8a2f);
}

.btn-bilateral {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--sena-green);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  z-index: 1;
}

[data-bs-theme="dark"] .btn-bilateral {
  background: rgba(93,138,47,0.12);
  border-color: rgba(122,171,61,0.18);
  color: var(--sena-green-light);
}

[data-bs-theme="light"] .btn-bilateral {
  background: #e8f0d8;
  border-color: #b8c8a8;
  color: #3a6a18;
}

.btn-bilateral:hover {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: var(--shadow-green);
}

.btn-bilateral svg {
  width: 18px;
  height: 18px;
}

.table-responsive {
  overflow-x: auto;
  padding: 0 2rem 2rem;
}

.ensayos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.ensayos-table thead {
  background: #f8faf6;
}

[data-bs-theme="dark"] .ensayos-table thead {
  background: #0f160a;
}

[data-bs-theme="light"] .ensayos-table thead {
  background: #f2f6ee;
}

.ensayos-table thead th {
  text-align: left;
  padding: 1rem 0.8rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--sena-muted);
  border-bottom: 2px solid var(--sena-border);
}

[data-bs-theme="light"] .ensayos-table thead th {
  color: #3a4a30;
  border-bottom-color: #d0dcc8;
}

.ensayos-table tbody td {
  padding: 1rem 0.8rem;
  border-bottom: 1px solid var(--sena-border);
  vertical-align: middle;
}

[data-bs-theme="light"] .ensayos-table tbody td {
  border-bottom-color: #e8eee0;
}

.ensayos-table tbody tr:hover {
  background: var(--sena-green-pale);
}

[data-bs-theme="dark"] .ensayos-table tbody tr:hover {
  background: rgba(93,138,47,0.06);
}

[data-bs-theme="light"] .ensayos-table tbody tr:hover {
  background: #f0f6ea;
}

.ciclo-badge {
  display: inline-block;
  padding: 0.25rem 0.8rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

[data-bs-theme="light"] .ciclo-badge {
  background: linear-gradient(135deg, #4a7a20, #5d8a2f);
}

.descripcion-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.descripcion-text {
  font-weight: 500;
  color: var(--sena-text);
}

.descripcion-code {
  font-size: 0.7rem;
  color: var(--sena-muted);
  font-family: 'Courier New', monospace;
}

[data-bs-theme="light"] .descripcion-code {
  color: #6a7a62;
}

.fecha-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.85rem;
}

.fecha-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--sena-muted);
  text-transform: uppercase;
}

[data-bs-theme="light"] .fecha-label {
  color: #6a7a62;
}

.fecha-detalle {
  font-size: 0.7rem;
  color: var(--sena-muted);
}

/* ============================================================
   BOTÓN CARRITO
   ============================================================ */
.btn-carrito {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  z-index: 1;
}

[data-bs-theme="light"] .btn-carrito {
  background: linear-gradient(135deg, #4a7a20, #5d8a2f);
}

.btn-carrito:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(93,138,47,0.3);
}

.btn-carrito svg {
  width: 16px;
  height: 16px;
}

.estado-cerrado {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: #f1f3f0;
  color: #8a9a82;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

[data-bs-theme="dark"] .estado-cerrado {
  background: rgba(255,255,255,0.05);
  color: #6a7a62;
}

[data-bs-theme="light"] .estado-cerrado {
  background: #ecefe8;
  color: #7a8a72;
}

.estado-cerrado svg {
  width: 16px;
  height: 16px;
}

.estado-abierto {
  display: inline-block;
  padding: 0.45rem 0.9rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* ============================================================
   MODALES
   ============================================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #ffffff;
  border-radius: var(--radius-card);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: modalSlideIn 0.3s ease;
}

[data-bs-theme="dark"] .modal-content {
  background: #131a0e;
  border: 1px solid rgba(122,171,61,0.1);
}

[data-bs-theme="light"] .modal-content {
  background: #ffffff;
  border: 1px solid #dce5d4;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--sena-border);
}

[data-bs-theme="light"] .modal-header {
  border-bottom-color: #e0e8d8;
}

.modal-header h3 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--sena-text);
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--sena-green-pale);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

[data-bs-theme="dark"] .modal-close {
  background: rgba(93,138,47,0.12);
}

[data-bs-theme="light"] .modal-close {
  background: #e8f0d8;
}

.modal-close:hover {
  background: #e74c3c;
  color: #ffffff;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 2rem;
}

.modal-text {
  color: var(--sena-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

[data-bs-theme="light"] .modal-text {
  color: #4a5a42;
}

.bilateral-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.bilateral-feature {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  background: var(--sena-green-pale);
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.85rem;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .bilateral-feature {
  background: rgba(93,138,47,0.08);
  color: #e8ede3;
}

[data-bs-theme="light"] .bilateral-feature {
  background: #e8f0d8;
  color: #2a4a18;
}

.bilateral-feature i {
  font-size: 1.2rem;
  color: var(--sena-green);
}

.btn-contactar-bilateral {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.8rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
  justify-content: center;
  position: relative;
  z-index: 1;
}

[data-bs-theme="light"] .btn-contactar-bilateral {
  background: linear-gradient(135deg, #4a7a20, #5d8a2f);
}

.btn-contactar-bilateral:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-green);
}

.btn-contactar-bilateral svg {
  width: 18px;
  height: 18px;
}

/* Carrito Modal */
.carrito-modal .modal-content {
  max-width: 500px;
}

.carrito-detalle {
  background: var(--sena-green-pale);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

[data-bs-theme="dark"] .carrito-detalle {
  background: rgba(93,138,47,0.08);
}

[data-bs-theme="light"] .carrito-detalle {
  background: #e8f0d8;
}

.carrito-detalle h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}

.carrito-detalle p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: var(--sena-muted);
}

.carrito-detalle strong {
  color: var(--sena-text);
}

.precio-destacado {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--sena-green);
}

.carrito-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancelar {
  flex: 1;
  padding: 0.7rem;
  border: 2px solid var(--sena-border);
  background: transparent;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--sena-muted);
  cursor: pointer;
  transition: var(--transition);
}

[data-bs-theme="light"] .btn-cancelar {
  border-color: #c0d0b8;
  color: #4a5a42;
}

.btn-cancelar:hover {
  background: #f1f3f0;
  border-color: var(--sena-muted);
}

[data-bs-theme="dark"] .btn-cancelar:hover {
  background: rgba(255,255,255,0.05);
}

.btn-confirmar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  z-index: 1;
}

[data-bs-theme="light"] .btn-confirmar {
  background: linear-gradient(135deg, #4a7a20, #5d8a2f);
}

.btn-confirmar:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-green);
}

.btn-confirmar svg {
  width: 18px;
  height: 18px;
}

/* ============================================================
   FAQ SECTION
   ============================================================ */
.faq-section {
  padding: 5rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .faq-section { background: #0e1509; }

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-card {
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: var(--transition);
}

[data-bs-theme="dark"] .faq-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.faq-card:hover {
  border-color: rgba(93,138,47,0.3);
}

.faq-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  transition: var(--transition);
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  flex: 1;
}

.faq-question i {
  font-size: 1.1rem;
  color: var(--sena-green);
  flex-shrink: 0;
}

[data-bs-theme="dark"] .faq-question i { color: var(--sena-green-light); }

.faq-question span {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .faq-question span { color: #e0ecd6; }

.faq-toggle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--sena-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--sena-green);
  transition: var(--transition);
}

[data-bs-theme="dark"] .faq-toggle {
  border-color: rgba(122,171,61,0.2);
  color: var(--sena-green-light);
}

.faq-card.expanded .faq-toggle {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
}

.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.35s ease;
  padding: 0 1.5rem;
}

.faq-body.show {
  max-height: 500px;
  padding: 0 1.5rem 1.25rem;
}

.faq-body p {
  font-size: 0.88rem;
  color: var(--sena-muted);
  line-height: 1.7;
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid var(--sena-border);
}

.faq-footer-text {
  color: var(--sena-muted);
  margin-bottom: 1rem;
}

.doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  background: transparent;
  border: 2px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
}

[data-bs-theme="dark"] .doc-btn {
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

.doc-btn:hover {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .area-title {
    font-size: 2rem;
  }

  .subarea-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .subarea-icon {
    font-size: 1rem;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .table-title-group {
    justify-content: center;
  }

  .btn-bilateral {
    justify-content: center;
  }

  .table-responsive {
    padding: 0 1rem 1rem;
  }

  .ensayos-table {
    font-size: 0.8rem;
  }

  .ensayos-table thead th,
  .ensayos-table tbody td {
    padding: 0.6rem 0.4rem;
    min-width: 120px;
  }

  .modal-content {
    margin: 1rem;
    max-height: 80vh;
  }

  .carrito-actions {
    flex-direction: column;
  }

  .bilateral-features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .subareas-menu {
    gap: 0.5rem;
  }

  .subarea-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }

  .subarea-name {
    display: none;
  }

  .subarea-icon {
    font-size: 1.2rem;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1.5rem;
  }
}
</style>
