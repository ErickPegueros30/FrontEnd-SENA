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
          <button class="btn-contactar-bilateral" @click="openInfoModal">
            Solicitar información
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Carrito (Solicitud de Cotización) -->
    <div v-if="showCarritoModal" class="modal-overlay" @click="closeCarritoModal">
      <div class="modal-content carrito-modal" @click.stop>
        <div class="modal-header">
          <h3>Solicitar Cotización</h3>
          <button class="modal-close" @click="closeCarritoModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="carrito-detalle" v-if="selectedPrograma">
            <p><strong>Código:</strong> {{ selectedPrograma.codigo }}</p>
            <p><strong>Fecha de inicio:</strong> {{ selectedPrograma.fechaInicio }}</p>
            <p><strong>Descripción:</strong></p><h6>{{ selectedPrograma.descripcion }}</h6>
          </div>

          <div class="cotizacion-form mt-3">
            <label>Nombre</label>
            <input v-model="cotForm.nombre" class="form-control-custom" placeholder="Nombre completo" />
            <label class="mt-2">Correo</label>
            <input v-model="cotForm.email" class="form-control-custom" placeholder="correo@dominio.com" />
            <label class="mt-2">Teléfono</label>
            <input v-model="cotForm.telefono" class="form-control-custom" placeholder="Teléfono" />
          </div>

          <div class="carrito-actions mt-3">
            <button class="btn-cancelar" @click="closeCarritoModal">Cancelar</button>
            <button class="btn-confirmar" @click="solicitarCotizacion">
              Enviar solicitud
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
          <button class="doc-btn" @click="openSupportModal">
            <i class="bi bi-chat-left-text"></i>
            <span>Contactar soporte</span>
          </button>
        </div>
      </div>
    </section>

    <FooterComponent :current-theme="currentTheme" />

      <!-- Support Modal + Toast -->
      <Teleport to="body">
          <!-- Info Request Modal -->
          <div v-if="infoModalOpen" class="support-modal-backdrop" @click.self="closeInfoModal">
            <div class="support-modal">
              <div class="support-modal-header">
                <h5>Solicitar información</h5>
                <button class="modal-close" @click="closeInfoModal"><i class="bi bi-x"></i></button>
              </div>
              <div class="support-modal-body">
                <div class="support-form">
                    <label>Nombre</label>
                    <input v-model="infoForm.nombre" class="form-control-custom" placeholder="Nombre completo" />
                    <label class="mt-2">Correo</label>
                    <input v-model="infoForm.email" class="form-control-custom" placeholder="correo@dominio.com" />
                    <label class="mt-2">Teléfono</label>
                    <input v-model="infoForm.telefono" class="form-control-custom" placeholder="Teléfono" />

                    <div class="mt-3">
                      <h6>Ensayos cerrados</h6>
                      <ul class="closed-list">
                        <li v-for="e in filteredClosedEnsayos" :key="e.codigo" :class="{ 'selected-ensayo': selectedEnsayos.includes(e.codigo) }" @click="toggleSelectEnsayo(e.codigo)">
                          <input type="checkbox" :checked="selectedEnsayos.includes(e.codigo)" readonly />
                          <span class="closed-code">{{ e.codigo }}</span>
                          <span class="closed-desc">— {{ e.descripcion }}</span>
                        </li>
                        <li v-if="filteredClosedEnsayos.length===0" style="color:var(--sena-muted)">No hay ensayos cerrados para la selección</li>
                      </ul>
                    </div>
                  </div>
                  <div class="services-column">
                    <h6>Servicios</h6>
                    <div class="areas-grid services-grid">
                      <button
                        v-for="s in servicesRow1"
                        :key="'svc-'+s.id"
                        :class="['area-item', { selected: selectedType==='service' && String(selectedId)===String(s.id) }]"
                        @click="selectService(s)"
                        :aria-pressed="selectedType==='service' && String(selectedId)===String(s.id)"
                      >
                        <img :src="s.icon" alt="" />
                        <span>{{ s.name }}</span>
                      </button>
                    </div>
                    <div class="areas-grid services-grid mt-2">
                      <button
                        v-for="s in servicesRow2"
                        :key="'svc2-'+s.id"
                        :class="['area-item', { selected: selectedType==='service' && String(selectedId)===String(s.id) }]"
                        @click="selectService(s)"
                        :aria-pressed="selectedType==='service' && String(selectedId)===String(s.id)"
                      >
                        <img :src="s.icon" alt="" />
                        <span>{{ s.name }}</span>
                      </button>
                    </div>
                  </div>
              </div>
              <div class="support-modal-footer">
                <button class="submit-btn" @click="submitInfoRequest">Enviar solicitud</button>
              </div>
            </div>
          </div>
        <div v-if="supportModalOpen" class="support-modal-backdrop" @click.self="closeSupportModal">
          <div class="support-modal">
            <div class="support-modal-header">
              <h5>Contactar Soporte</h5>
              <button class="modal-close" @click="closeSupportModal"><i class="bi bi-x"></i></button>
            </div>
            <div class="support-modal-body">
              <div class="support-phones">
                <h6>Números disponibles</h6>
                <ul>
                  <li><a href="tel:+524421982279" class="support-phone">Ventas (MX): <span>+52 (442) 198 2279</span></a></li>
                  <li><a href="tel:+524422241245" class="support-phone">Soporte (MX): <span>+52 (442) 224 1245</span></a></li>
                  <li><a href="tel:+573161595252" class="support-phone">Ventas (CO): <span>+57 316 159 5252</span></a></li>
                </ul>
              </div>
              <div class="support-form">
                <label>Nombre</label>
                <input v-model="supportForm.nombre" class="form-control-custom" placeholder="Nombre completo" />
                <label class="mt-2">Correo</label>
                <input v-model="supportForm.email" class="form-control-custom" placeholder="correo@dominio.com" />
                <label class="mt-2">Teléfono (opcional)</label>
                <input v-model="supportForm.telefono" class="form-control-custom" placeholder="Teléfono" />
                <label class="mt-2">Motivo</label>
                <textarea v-model="supportForm.motivo" class="form-control-custom" rows="4" placeholder="Describe tu solicitud"></textarea>
              </div>
            </div>
            <div class="support-modal-footer">
              <button class="submit-btn" @click="submitSupport">Enviar solicitud</button>
            </div>
          </div>
        </div>
        <div v-if="showToast" class="toast-notification" :class="toastType">
          <div class="toast-icon">
            <i :class="toastIconClass"></i>
          </div>
          <div class="toast-content">
            <p>{{ toastMessage }}</p>
          </div>
          <button class="toast-close" @click="showToast = false">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import { faqs } from '@/data/faqs'

type Theme = 'light' | 'dark'
type ToastType = 'success' | 'warning' | 'info'

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

// Helpers
const isIconUrl = (v: any) => {
  if (!v || typeof v !== 'string') return false
  // Consider as URL when starts with protocol, slash, data:, or contains a file extension or path
  if (/^(https?:\/\/|data:|\/)/i.test(v)) return true
  if (/\.(svg|png|jpe?g|gif|webp)(\?.*)?$/i.test(v)) return true
  if (v.includes('/')) return true
  return false
}

const getIcon = (item: any) => {
  if (!item) return ''
  const fields = ['icon', 'icono', 'imagen', 'image', 'img', 'svg', 'logo']
  for (const f of fields) {
    const val = item[f]
    if (val && typeof val === 'string') return val
  }
  return ''
}

const resolveIconPath = (iconPath: string) => {
  if (!iconPath) return ''
  // If absolute or data URL, return as-is
  if (/^(https?:\/\/|data:|\/)/i.test(iconPath)) return iconPath
  try {
    // Try to resolve via Vite bundler (supports /src paths and relative paths)
    return new URL(iconPath, import.meta.url).href
  } catch (e) {
    // Fallback: prefix with BASE_URL
    const base = (import.meta.env.BASE_URL || '/')
    return base.replace(/\/$/, '') + '/' + iconPath.replace(/^\/+/, '')
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

// FAQs imported from shared data file

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

// (moved) Clear selected ensayos when changing selection — declared later

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

// Formulario de cotización desde el modal carrito
const cotForm = ref({ nombre: '', email: '', telefono: '' })

const solicitarCotizacion = async () => {
  if (!cotForm.value.nombre || !cotForm.value.email) {
    showNotification('Por favor completa nombre y correo', 'warning')
    return
  }
  if (!selectedPrograma.value) {
    showNotification('No hay programa seleccionado', 'warning')
    return
  }

  try {
    const items = [{ tipo: 'manual', descripcion: selectedPrograma.value.descripcion || selectedPrograma.value.codigo || 'Item', cantidad: 1, precioUnitario: Number(selectedPrograma.value.precio) || 0 }]
    const body = {
      nombre_cliente: cotForm.value.nombre,
      correo: cotForm.value.email,
      telefono: cotForm.value.telefono || null,
      items
    }
    const res = await fetch(`${API_BASE}/api/cotizaciones`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const j = await res.json()
    if (!res.ok) {
      console.error('Error solicitando cotizacion', j)
      showNotification('Error al enviar la solicitud de cotización', 'warning')
    }

    // Intentar enviar también un correo con los datos del ensayo
    try {
      const mailBody = {
        nombre: cotForm.value.nombre,
        email: cotForm.value.email,
        telefono: cotForm.value.telefono || null,
        codigo: selectedPrograma.value.codigo,
        fechaInicio: selectedPrograma.value.fechaInicio || null
      }
      const em = await fetch(`${API_BASE}/api/ensayo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mailBody) })
      const ej = await em.json()
      if (em.ok && ej.ok !== false) {
        showNotification('Solicitud de cotización enviada y correo notificado. Gracias.', 'success')
      } else {
        console.error('Error enviando correo de ensayo', ej)
        showNotification('Cotización registrada. Error notificando por correo.', 'warning')
      }
    } catch (mailErr) {
      console.error('Error enviando correo de ensayo', mailErr)
      showNotification('Cotización registrada. Error notificando por correo.', 'warning')
    }

    // limpiar y cerrar modal
    cotForm.value = { nombre: '', email: '', telefono: '' }
    closeCarritoModal()
  } catch (err) {
    console.error('Error solicitando cotizacion', err)
    showNotification('Error al enviar la solicitud de cotización', 'warning')
  }
}

const goToContact = () => {
  closeBilateralModal()
  router.push('/contacto')
}

// Info modal (Solicitar información)
const infoModalOpen = ref(false)
const infoForm = ref({ nombre: '', email: '', telefono: '' })
const selectedType = ref<'area'|'rama'|'service'|null>(null)
const selectedId = ref<number|string|null>(null)
const selectedServiceName = ref<string | null>(null)

interface Service { id: number; name: string; icon: string; iconWhite?: string; route?: string }

const servicesRow1: Service[] = [
  { id: 1, name: 'Agua', icon: new URL('../../image/icons/Servicios/Black/Agua.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Agua-White.svg', import.meta.url).href, route: '/servicios/agua' },
  { id: 2, name: 'Alimentos', icon: new URL('../../image/icons/Servicios/Black/Alimentos.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Alimentos-White.svg', import.meta.url).href, route: '/servicios/alimentos' },
  { id: 3, name: 'Masa', icon: new URL('../../image/icons/Servicios/Black/Masa.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Masa-White.svg', import.meta.url).href, route: '/servicios/masa' },
  { id: 4, name: 'Temperatura', icon: new URL('../../image/icons/Servicios/Black/Temperatura.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Temperatura-White.svg', import.meta.url).href, route: '/servicios/temperatura' },
  { id: 5, name: 'Presión', icon: new URL('../../image/icons/Servicios/Black/Presion.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Presion-White.svg', import.meta.url).href, route: '/servicios/presion' },
  { id: 6, name: 'Volumen', icon: new URL('../../image/icons/Servicios/Black/Volumen.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Volumen-White.svg', import.meta.url).href, route: '/servicios/volumen' }
]

const servicesRow2: Service[] = [
  { id: 7, name: 'Densidad', icon: new URL('../../image/icons/Servicios/Black/Densidad.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Densidad-White.svg', import.meta.url).href, route: '/servicios/densidad' },
  { id: 8, name: 'Eléctrica', icon: new URL('../../image/icons/Servicios/Black/Electrica.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Electrica-White.svg', import.meta.url).href, route: '/servicios/electrica' },
  { id: 9, name: 'Dimensional', icon: new URL('../../image/icons/Servicios/Black/Dimensional.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Dimensional-White.svg', import.meta.url).href, route: '/servicios/dimensional' },
  { id: 10, name: 'Humedad', icon: new URL('../../image/icons/Servicios/Black/Humedad.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Humedad-White.svg', import.meta.url).href, route: '/servicios/humedad' },
  { id: 11, name: 'Flujo', icon: new URL('../../image/icons/Servicios/Black/Flujos.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Flujos-White.svg', import.meta.url).href, route: '/servicios/flujo' },
  { id: 12, name: 'Mediciones Especiales', icon: new URL('../../image/icons/Servicios/Black/Especiales.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Especiales-White.svg', import.meta.url).href, route: '/servicios/mediciones-especiales' }
]
const selectArea = (type: 'area'|'rama', id: number|string, name: string) => {
  // Toggle selection: deselect if same item clicked
  if (selectedType.value === type && String(selectedId.value) === String(id)) {
    selectedType.value = null
    selectedId.value = null
    return
  }
  selectedType.value = type
  selectedId.value = id
}

const selectService = (s: Service) => {
  if (selectedType.value === 'service' && String(selectedId.value) === String(s.id)) {
    selectedType.value = null
    selectedId.value = null
    selectedServiceName.value = null
    return
  }
  selectedType.value = 'service'
  selectedId.value = s.id
  selectedServiceName.value = s.name
  // Debug: log counts for diagnosis
  try {
    const name = s.name.toLowerCase()
    const total = ensayos.value.length
    const closed = ensayos.value.filter(e => !e.disponible).length
    const matchName = ensayos.value.filter(e => (
      (e.area||'').toLowerCase().includes(name) ||
      (e.subarea||'').toLowerCase().includes(name) ||
      (e.rama||'').toLowerCase().includes(name) ||
      (e.subrama||'').toLowerCase().includes(name)
    )).length
    const matchClosed = ensayos.value.filter(e => !e.disponible && (
      (e.area||'').toLowerCase().includes(name) ||
      (e.subarea||'').toLowerCase().includes(name) ||
      (e.rama||'').toLowerCase().includes(name) ||
      (e.subrama||'').toLowerCase().includes(name)
    )).length
    console.debug('selectService debug', { service: s.name, total, closed, matchName, matchClosed, sampleFirst: ensayos.value[0] })
  } catch (e) { console.debug('selectService debug fail', e) }
}

const closeInfoModal = () => { infoModalOpen.value = false }
const openInfoModal = () => { infoModalOpen.value = true }

const filteredClosedEnsayos = computed(() => {
  try { console.debug('filteredClosedEnsayos computing', { selectedType: selectedType.value, selectedId: selectedId.value, selectedServiceName: selectedServiceName.value }) } catch(e){}
  if (!selectedType.value || !selectedId.value) return []
  const sid = String(selectedId.value)
  if (selectedType.value === 'service') {
    const name = selectedServiceName.value || ''
    if (!name) return []
    const lower = name.toLowerCase()
    const res = ensayos.value.filter(e => {
      if (e.disponible) return false
      const areaMatch = (e.area || '').toLowerCase().includes(lower)
      const subareaMatch = (e.subarea || '').toLowerCase().includes(lower)
      const ramaMatch = (e.rama || '').toLowerCase().includes(lower)
      const subramaMatch = (e.subrama || '').toLowerCase().includes(lower)
      const codigoMatch = (e.codigo || '').toLowerCase().includes(lower)
      const descMatch = (e.descripcion || '').toLowerCase().includes(lower)
      const servicioMatch = ((e.servicio || e.service || e.categoria || e.tipo) || '').toLowerCase().includes(lower)
      return areaMatch || subareaMatch || ramaMatch || subramaMatch || codigoMatch || descMatch || servicioMatch
    })
    try { console.debug('filteredClosedEnsayos result count', res.length, res.slice(0,5)) } catch(e){}
    return res
  }
  if (selectedType.value === 'area') {
    const areaItem = areasList.value.find(a => String(a.id) === sid) || {}
    const areaName = (areaItem.nombre || areaItem.name || '').toLowerCase()
    const res = ensayos.value.filter(e => {
      const idMatch = (e.areaId || e.areaId === 0) && String(e.areaId) === sid
      const subareaIdMatch = (e.subareaId || e.subareaId === 0) && String(e.subareaId) === sid
      const ramaIdMatch = (e.ramaId || e.ramaId === 0) && String(e.ramaId) === sid
      const subramaIdMatch = (e.subramaId || e.subramaId === 0) && String(e.subramaId) === sid
      const nameMatch = areaName && (
        (e.area || '').toLowerCase().includes(areaName) ||
        (e.subarea || '').toLowerCase().includes(areaName) ||
        (e.rama || '').toLowerCase().includes(areaName) ||
        (e.subrama || '').toLowerCase().includes(areaName)
      )
      return !e.disponible && (idMatch || subareaIdMatch || ramaIdMatch || subramaIdMatch || nameMatch)
    })
    try { console.debug('filteredClosedEnsayos area result', sid, areaName, res.length) } catch(e){}
    return res
  }
  // rama
  const ramaItem = ramasList.value.find(r => String(r.id) === sid) || {}
  const ramaName = (ramaItem.nombre || ramaItem.name || '').toLowerCase()
  const res = ensayos.value.filter(e => {
    const idMatch = (e.ramaId || e.ramaId === 0) && String(e.ramaId) === sid
    const subramaIdMatch = (e.subramaId || e.subramaId === 0) && String(e.subramaId) === sid
    const nameMatch = ramaName && (
      (e.rama || '').toLowerCase().includes(ramaName) ||
      (e.subrama || '').toLowerCase().includes(ramaName) ||
      (e.area || '').toLowerCase().includes(ramaName) ||
      (e.subarea || '').toLowerCase().includes(ramaName)
    )
    return !e.disponible && (idMatch || subramaIdMatch || nameMatch)
  })
  try { console.debug('filteredClosedEnsayos rama result', sid, ramaName, res.length) } catch(e){}
  return res
})

const submitInfoRequest = async () => {
  if (!infoForm.value.nombre || !infoForm.value.email) {
    showNotification('Completa nombre y correo', 'warning')
    return
  }
  if ((selectedType.value === 'service' || selectedType.value === 'area' || selectedType.value === 'rama') && selectedEnsayos.value.length === 0) {
    showNotification('Selecciona al menos un ensayo cerrado', 'warning')
    return
  }
  try {
    // determine area name for the email
    let areaName = ''
    if (selectedType.value === 'service' && selectedServiceName.value) areaName = selectedServiceName.value
    else if (selectedType.value === 'area') {
      const a = areasList.value.find(ar => String(ar.id) === String(selectedId.value))
      areaName = (a && (a.nombre || a.name)) || ''
    } else if (selectedType.value === 'rama') {
      const r = ramasList.value.find(rr => String(rr.id) === String(selectedId.value))
      areaName = (r && (r.nombre || r.name)) || ''
    }

    const body = {
      nombre: infoForm.value.nombre,
      email: infoForm.value.email,
      telefono: infoForm.value.telefono,
      area: areaName,
      ensayos: selectedEnsayos.value
    }

    const res = await fetch(`${API_BASE}/api/ensayobilateral`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const j = await res.json()
    if (res.ok && j.ok) {
      showNotification('Solicitud enviada. Gracias.', 'success')
      infoForm.value = { nombre: '', email: '', telefono: '' }
      selectedId.value = null
      selectedType.value = null
      closeInfoModal()
    } else {
      console.error('Error info request:', j)
      showNotification('Error al enviar la solicitud', 'warning')
    }
  } catch (err) {
    console.error('Error info request:', err)
    showNotification('Error al enviar la solicitud', 'warning')
  }
}

// Toasts & Support modal (mismo comportamiento que Contacto.vue)
const showToast = ref(false)
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
// Support modal
const supportModalOpen = ref(false)
const supportForm = ref({
  nombre: '',
  email: '',
  telefono: '',
  motivo: ''
})
const openSupportModal = () => { supportModalOpen.value = true }
const closeSupportModal = () => { supportModalOpen.value = false }

const showNotification = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const submitSupport = async () => {
  if (!supportForm.value.nombre || !supportForm.value.email || !supportForm.value.motivo) {
    showNotification('Por favor completa nombre, correo y motivo', 'warning')
    return
  }
  try {
    const res = await fetch(`${API_BASE}/api/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: supportForm.value.nombre,
        email: supportForm.value.email,
        telefono: supportForm.value.telefono,
        motivo: supportForm.value.motivo
      })
    })
    const body = await res.json()
    if (res.ok && body.ok) {
      showNotification('Solicitud enviada. Te contactaremos pronto.', 'success')
      supportForm.value = { nombre: '', email: '', telefono: '', motivo: '' }
      closeSupportModal()
    } else {
      console.error('Error support send:', body)
      showNotification('Error al enviar la solicitud. Intenta de nuevo.', 'warning')
    }
  } catch (err) {
    console.error('Error support send:', err)
    showNotification('Error al enviar la solicitud. Intenta de nuevo.', 'warning')
  }
}

const toastIconClass = computed(() => {
  const icons: Record<ToastType, string> = {
    success: 'bi bi-check-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill',
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill'
})

// selection of closed ensayos in info modal
const selectedEnsayos = ref<string[]>([])
const toggleSelectEnsayo = (codigo: string) => {
  const idx = selectedEnsayos.value.indexOf(codigo)
  if (idx >= 0) selectedEnsayos.value.splice(idx, 1)
  else selectedEnsayos.value.push(codigo)
}

// Clear selected ensayos when changing selection
watch([selectedType, selectedId], () => {
  selectedEnsayos.value = []
  if (selectedType.value !== 'service') selectedServiceName.value = null
})
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-red: #cc3e2f;
  --sena-red-dark: #962e22;
  --sena-red-pale: rgba(204,62,47,0.08);
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

.title-underline.centered { margin: 0.6rem auto 0; }

/* Section header styles (copiado desde Contacto.vue para paridad visual) */
.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  margin-bottom: 0.6rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
  line-height: 1.18;
}

[data-bs-theme="dark"] .section-title { color: #f0f5ea; }

.section-subtitle {
  font-size: 0.88rem;
  color: var(--sena-muted);
  letter-spacing: 0.5px;
  margin-top: 0.75rem;
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

/* High-specificity explicit styles to ensure badges show correct colors even with scoped CSS */
.ensayos-table .estado-cerrado {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: linear-gradient(135deg, #cc3e2f, #962e22) !important;
  color: #ffffff !important;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

[data-bs-theme="dark"] .estado-cerrado {
  background: linear-gradient(135deg, var(--sena-red-dark), rgba(122,31,20,0.12));
  color: #ffffff;
}

[data-bs-theme="light"] .estado-cerrado {
  background: linear-gradient(135deg, var(--sena-red), var(--sena-red-dark));
  color: #ffffff;
}

.estado-cerrado svg {
  width: 16px;
  height: 16px;
}

.ensayos-table .estado-abierto {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: linear-gradient(135deg, #5d8a2f, #7aab3d) !important;
  color: #ffffff !important;
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

/* FAQ en modo claro: copiar ajustes desde Contacto.vue para coincidencia exacta */
[data-bs-theme="light"] .faq-card {
  background: #ffffff !important;
  border: 2px solid #e0e5da !important;
}

[data-bs-theme="light"] .faq-card:hover {
  border-color: #5d8a2f !important;
}

[data-bs-theme="light"] .faq-question i {
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .faq-question span {
  color: #1a2612 !important;
}

[data-bs-theme="light"] .faq-toggle {
  border: 2px solid #d0d5ca !important;
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .faq-body p {
  color: #5a6a52 !important;
}

/* ============================================================
   MODO CLARO MEJORADO - CORRECCIONES COMPLETAS (encabezados)
   ============================================================ */
[data-bs-theme="light"] .section-eyebrow {
  color: #5d8a2f !important;
  font-weight: 700;
}

[data-bs-theme="light"] .section-title {
  color: #1a2612 !important;
}

[data-bs-theme="light"] .section-subtitle {
  color: #6b7a60 !important;
}

[data-bs-theme="light"] .doc-btn {
  border: 2px solid #5d8a2f !important;
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .doc-btn:hover {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d) !important;
  color: #ffffff !important;
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

@media (max-width: 900px) {
  .areas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .area-item img {
    width: 34px;
    height: 34px;
  }
  .support-modal { max-width: 92%; }
}

@media (max-width: 768px) {
  .support-modal-body {
    display: flex !important;
    flex-direction: column !important;
    overflow: visible;
    gap: 1rem;
    padding: 1rem 1rem;
  }
  .support-modal {
    max-height: 95vh;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .services-column {
    max-width: 100%;
    padding-left: 0;
    border-left: none;
    margin-top: 1.5rem;
    padding-top: 0.75rem;
    order: 2;
    max-height: none;
    overflow: visible;
  }
  .services-grid {
    max-height: none;
    overflow: visible;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  .support-form { max-height: 60vh; order: 1; flex: 0 0 auto; overflow-y: auto }
  .support-form input, .support-form textarea { min-height: 36px }
  .services-column .area-item { min-height: 56px }
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

/* ============================================================
   TOAST NOTIFICATION + SUPPORT MODAL (copiado de Contacto.vue)
   ============================================================ */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  z-index: 9999;
  border-left: 4px solid;
  animation: slideIn 0.3s ease-out;
}

[data-bs-theme="dark"] .toast-notification {
  background: #1a2412;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}

.toast-notification.success { border-left-color: #5d8a2f; }
.toast-notification.warning { border-left-color: #f5b31a; }
.toast-notification.info { border-left-color: #7aab3d; }

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex: 1;
}

.toast-content i {
  font-size: 1.2rem;
}

.toast-notification.success .toast-content i { color: #5d8a2f; }
.toast-notification.warning .toast-content i { color: #f5b31a; }
.toast-notification.info .toast-content i { color: #7aab3d; }

.toast-content span {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .toast-content span { color: #e0ecd6; }

.toast-close {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--sena-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--sena-muted);
  transition: var(--transition);
  flex-shrink: 0;
}

.toast-close:hover {
  background: var(--sena-green-pale);
  color: var(--sena-text);
}

[data-bs-theme="dark"] .toast-close:hover {
  background: rgba(122,171,61,0.12);
  color: #e0ecd6;
}

/* Support modal styles */
.support-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.support-modal {
  width: 94%;
  max-width: 920px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}
[data-bs-theme="dark"] .support-modal { background: #121710; }
.support-modal-header {
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--sena-border);
}
.support-modal-body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  align-items: start;
  flex: 1 1 auto;
  overflow: hidden;
}
.support-phones { flex: 0 0 auto; }
.support-phones ul { padding-left: 1rem; margin: 0; }
.support-form { display: flex; flex-direction: column; gap: 0.75rem; max-height: calc(80vh - 200px); overflow-y: auto; padding-right: 0.5rem }
.support-form label { margin: 0; font-weight: 600; color: var(--sena-text) }
.support-form .form-control-custom { font-size: 0.95rem }

.services-column {
  flex: 0 0 auto;
  max-width: 320px;
  padding-left: 0.75rem;
  border-left: 1px solid rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.services-column h6 { margin: 0; font-size: 1rem; font-weight: 700 }
.services-grid { max-height: calc(70vh - 160px); overflow-y: auto; padding-right: 0.25rem }
.services-grid .area-item { padding: 0.5rem; min-height: 64px }
.services-grid .area-item span { font-size: 0.85rem }

.support-modal-footer { padding: 1rem 1.25rem; border-top: 1px solid var(--sena-border); display:flex; justify-content:flex-end; flex-shrink:0; position: sticky; bottom: 0; background: linear-gradient(transparent, rgba(255,255,255,0.9)); z-index: 10 }
[data-bs-theme="dark"] .support-modal-footer { background: linear-gradient(transparent, rgba(18,23,16,0.9)); }
.support-modal-footer { padding: 1rem 1.25rem; border-top: 1px solid var(--sena-border); display:flex; justify-content:flex-end; flex-shrink:0; position: sticky; bottom: 0; background: inherit; z-index: 10 }
.modal-close { background: transparent; border: none; cursor: pointer; }

@media (max-width: 768px) {
  .support-modal-body { grid-template-columns: 1fr; flex: 1 1 auto; overflow: auto }
  .support-phones { flex-basis: auto }
}

.support-phones h6 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
}
.support-phones .support-phone {
  display: inline-block;
  margin-left: 0.5rem;
  font-weight: 700;
}
.support-phones a.support-phone {
  color: var(--sena-text);
  text-decoration: none;
  display: block;
  margin: 0.35rem 0;
}
[data-bs-theme="dark"] .support-phones a.support-phone { color: #e6f0da }

/* Form controls copied from Contacto.vue for consistent modal design */
.form-control-custom {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e0e5da;
  border-radius: 10px;
  background: #ffffff;
  color: var(--sena-text);
  font-size: 0.9rem;
  font-family: var(--font-body);
  transition: var(--transition);
  outline: none;
}

[data-bs-theme="dark"] .form-control-custom {
  background: #1a2412;
  border-color: rgba(122,171,61,0.2);
  color: #e0ecd6;
}

.form-control-custom:focus {
  border-color: var(--sena-green-light);
  box-shadow: 0 0 0 3px rgba(93,138,47,0.1);
}

.form-control-custom.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback-custom {
  font-size: 0.78rem;
  color: #dc3545;
  margin-top: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

textarea.form-control-custom {
  resize: vertical;
  min-height: 130px;
}

.character-count {
  text-align: right;
  margin-top: 0.35rem;
}

.character-count small {
  font-size: 0.75rem;
  color: var(--sena-muted);
}

.character-count .text-danger { color: #dc3545 !important; }
.character-count .text-warning { color: #f5b31a !important; }

/* Submit button style */
.submit-btn {
  background: linear-gradient(135deg, #5d8a2f 0%, #7aab3d 100%);
  color: #ffffff;
  border: none;
  padding: 0.7rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(93,138,47,0.18);
}

/* Services / Areas grid inside support modal */
.areas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  align-items: stretch;
}
.area-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0.5rem;
  background: #ffffff;
  border: 1px solid var(--sena-border);
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
  min-height: 84px;
}

[data-bs-theme="dark"] .area-item {
  background: #0f160a;
  border-color: rgba(122,171,61,0.08);
  color: #e8ede3;
}

.area-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-sm);
}

.area-item img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  display: block;
}

.area-item i {
  font-size: 22px;
}

.area-item span {
  font-size: 0.9rem;
  font-weight: 600;
}

.area-item.selected {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
  box-shadow: var(--shadow-green);
}

[data-bs-theme="light"] .area-item.selected {
  background: linear-gradient(135deg, #4a7a20, #5d8a2f);
}

@media (max-width: 480px) {
  .area-item img { width: 22px; height: 22px }
  .area-item { min-height: 58px }
  .areas-grid { grid-template-columns: repeat(3, 1fr) }
  .services-column { padding-left: 0.25rem }
}

@media (max-width: 340px) {
  .areas-grid { grid-template-columns: repeat(2, 1fr) }
}

.closed-list {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.closed-list {
  max-height: 44vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}
.closed-list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
}
.closed-list li:hover { background: rgba(0,0,0,0.03) }
.closed-list li input { width: 16px; height: 16px }
.closed-list li .closed-code { font-weight: 700; min-width: 80px }
.closed-list li .closed-desc { color: var(--sena-muted); font-size: 0.95rem }
.closed-list li.selected-ensayo {
  background: linear-gradient(135deg, rgba(93,138,47,0.12), rgba(122,171,61,0.06));
  border-color: rgba(93,138,47,0.12);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
