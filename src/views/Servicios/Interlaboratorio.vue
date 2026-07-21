<template>
  <div :data-bs-theme="currentTheme" class="interlaboratorio-page">
    <!-- Hero Section -->
    <section class="inter-hero" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.42)), url(${heroInterlaboratorio})` }">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Comparaciones Interlaboratorio</h1>
              <p class="hero-subtitle">
                Programas de comparación interlaboratorio diseñados para evaluar y mejorar
                el desempeño de sus laboratorios bajo la norma <strong>ISO/IEC 17043:2023</strong>.
              </p>
              <div class="hero-badges">
                <span class="badge-item">
                  <i class="bi bi-award-fill"></i>
                  <span>Acreditado</span>
                </span>
                <span class="badge-item">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Mejora Continua</span>
                </span>
                <span class="badge-item">
                  <i class="bi bi-shield-check"></i>
                  <span>Validación de Métodos</span>
                </span>
              </div>
              <div class="hero-actions blurred">
                <button class="contact-btn" @click="openBilateralModal(null)">
                  Solicitar programa
                  <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-card">
              <div class="hero-card-icon">
                <i class="bi bi-clipboard-data"></i>
              </div>
              <h4>¿Por qué participar?</h4>
              <ul class="card-list">
                <li>Validar la competencia técnica</li>
                <li>Cumplir con requisitos de acreditación</li>
                <li>Identificar áreas de mejora</li>
                <li>Comparar resultados con pares</li>
              </ul>
              <div class="card-accreditation">
                <i class="bi bi-check-circle-fill"></i>
                <span>Acreditado ISO 17043</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PDF Modal (solo lectura: sin descarga ni impresion) -->
    <PdfViewerModal
      v-model="showPdfModal"
      :src="selectedDocument?.url || selectedDocument?.downloadUrl"
      :title="selectedDocument?.title"
    />

    <!-- Modal Carrito (Solicitud de Cotización) -->
    <div v-if="showCarritoModal" class="modal-overlay" role="dialog" aria-modal="true" @click="closeCarritoModal">
      <div class="modal-content modal-carrito" tabindex="-1" @click.stop>
        <div class="modal-header">
          <h3>Solicitar Cotización</h3>
          <button class="modal-close" aria-label="Cerrar modal" @click="closeCarritoModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="carrito-detalle" v-if="selectedPrograma">
            <p><strong>Código:</strong> {{ selectedPrograma.referencia || selectedPrograma.codigo }}</p>
            <p><strong>Fecha de inicio:</strong> {{ selectedPrograma.fechaInicioInterlaboratorio || selectedPrograma.fechaInicio || '-' }}</p>
            <p><strong>Descripción:</strong></p>
            <h6>{{ selectedPrograma.descripcion }}</h6>
          </div>

          <div class="cotizacion-form mt-3">
            <div class="form-group">
              <label>Nombre completo *</label>
              <input v-model="cotForm.nombre" class="form-control-custom" placeholder="Nombre completo" />
            </div>
            <div class="form-group">
              <label>Laboratorio *</label>
              <input v-model="cotForm.laboratorio" class="form-control-custom" placeholder="Nombre del laboratorio" />
            </div>
            <div class="form-group">
              <label>Correo electrónico *</label>
              <input v-model="cotForm.email" class="form-control-custom" placeholder="correo@dominio.com" />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="cotForm.telefono" class="form-control-custom" placeholder="Teléfono" />
            </div>
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

    <!-- Modal Bilateral -->
    <div v-if="showBilateralModal" class="modal-overlay" role="dialog" aria-modal="true" @click="closeBilateralModal">
      <div class="modal-content modal-bilateral" tabindex="-1" @click.stop>
        <div class="modal-header">
          <h3>Comparaciones Bilaterales</h3>
          <button class="modal-close" aria-label="Cerrar modal" @click="closeBilateralModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-text">
            Las comparaciones bilaterales son programas personalizados diseñados específicamente para las necesidades de su laboratorio.
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

    <!-- Video promocional -->
    <section class="video-section">
      <div class="container">
        <div class="video-card" data-aos="fade-up">
          <div class="video-thumbnail" @click="openVideo" role="button" tabindex="0" @keyup.enter="openVideo" aria-label="Reproducir video promocional">
            <div class="video-overlay">
              <div class="play-btn" aria-hidden="true">
                <i class="bi bi-play-fill"></i>
              </div>
            </div>
          </div>
          <div class="video-card-body">
            <h3>Ciclo de Comparaciones</h3>
            <p class="small">Conoce cómo diseñamos y ejecutamos nuestros programas de comparación interlaboratorio.</p>
            <h5 class="small"><strong>¿Quieres asegurar la validez de tus resultados?</strong></h5>
            <p class="small">No dejes la política de ensayos en la banca, que juegue para tu equipo y anota el gol participando en intercomparaciones.</p>
            <button class="outline-btn" @click="openVideo">Ver video</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Modal -->
    <Teleport to="body">
      <div v-if="showVideoModal" class="video-modal-overlay" role="dialog" aria-modal="true" @click.self="closeVideo">
        <div class="video-modal-container" data-aos="zoom-in">
          <button class="modal-close video-modal-close" aria-label="Cerrar video" @click="closeVideo"><i class="bi bi-x-lg"></i></button>
          <div class="video-embed">
            <video ref="videoEl" :src="videoSrc" :poster="videoPoster" controls playsinline></video>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Solicitud desde Bilateral -->
    <Teleport to="body">
      <div v-if="showBilateralFormModal" class="modal-overlay" role="dialog" aria-modal="true" @click.self="closeBilateralFormModal">
        <div class="modal-content" tabindex="-1" @click.stop>
          <div class="modal-header">
            <h3>Solicitar Información - Bilateral</h3>
            <button class="modal-close" aria-label="Cerrar modal" @click="closeBilateralFormModal"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitBilateralForm">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Nombre</label>
                  <input v-model="bilateralForm.nombre" type="text" class="form-control" />
                  <div v-if="bilateralErrors.nombre" class="text-danger small">{{ bilateralErrors.nombre }}</div>
                </div>
                <div class="col-12">
                  <label class="form-label">Laboratorio / Empresa</label>
                  <input v-model="bilateralForm.laboratorio" type="text" class="form-control" />
                  <div v-if="bilateralErrors.laboratorio" class="text-danger small">{{ bilateralErrors.laboratorio }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Correo</label>
                  <input v-model="bilateralForm.email" type="email" class="form-control" />
                  <div v-if="bilateralErrors.email" class="text-danger small">{{ bilateralErrors.email }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input v-model="bilateralForm.telefono" type="tel" class="form-control" />
                  <div v-if="bilateralErrors.telefono" class="text-danger small">{{ bilateralErrors.telefono }}</div>
                </div>
                <div class="col-12">
                  <label class="form-label">Programa</label>
                  <select v-model="bilateralForm.programaId" class="form-select">
                    <option v-for="p in interlaboratorios" :key="p.id" :value="p.id">{{ p.referencia || p.descripcion || p.id }}</option>
                  </select>
                  <div v-if="bilateralErrors.programaId" class="text-danger small">{{ bilateralErrors.programaId }}</div>
                </div>
                <div class="col-12 d-flex gap-2 justify-content-end">
                  <button type="button" class="btn-cancelar" @click="closeBilateralFormModal">Cancelar</button>
                  <button type="submit" class="btn-confirmar">Enviar solicitud</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Tabla pública de programas -->
    <section class="public-table-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Programas</span>
          <h2 class="section-title">Programas disponibles</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Consulta los programas abiertos y agrégalos al carrito de solicitudes.</p>
        </div>

        <div class="table-card" data-aos="fade-up">
          <div class="table-header d-flex align-items-center justify-content-between mb-3">
            <div class="table-title-group">
              <h4 class="table-title">Listado de Programas</h4>
              <span class="table-subtext">Elige un programa disponible para solicitar o diseñar un bilateral</span>
            </div>
            <div>
              <button class="btn-bilateral" @click="openBilateralModal(null)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
                </svg>
                <span>Solicitar Bilateral</span>
              </button>
            </div>
          </div>
          <div class="table-responsive">
            <table class="interlab-table" style="min-width:700px;">
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Descripción</th>
                  <th>Periodo Inscripción</th>
                  <th>Fecha Inicio</th>
                  <th>Estado</th>
                  <th>Carrito</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in interlaboratorios" :key="p.id">
                  <td><code class="referencia-text">{{ p.referencia }}</code></td>
                  <td><div class="descripcion-cell"><span class="descripcion-text">{{ p.descripcion }}</span></div></td>
                  <td>
                    <div class="fecha-cell">
                      <span class="fecha-label">Inicio:</span>
                      <span>{{ p.inscripcionInicio || p.inscripcion_inicio || '-' }}</span>
                      <span class="fecha-label">Fin:</span>
                      <span>{{ p.inscripcionFin || p.inscripcion_fin || '-' }}</span>
                    </div>
                  </td>
                  <td>{{ p.fechaInicioInterlaboratorio || p.fecha_inicio_interlaboratorio || '-' }}</td>
                  <td>
                    <span :class="['status-text', (p.disponible ? 'abierto' : 'cerrado')]">{{ p.disponible ? 'Abierto' : 'Cerrado' }}</span>
                  </td>
                  <td>
                    <button v-if="p.disponible" class="action-btn" @click="addToCart(p)">
                      <i class="bi bi-cart-plus"></i>
                      <span>Agregar</span>
                    </button>
                    <span v-else class="small text-muted">No disponible</span>
                  </td>
                </tr>
                <tr v-if="interlaboratorios.length === 0">
                  <td colspan="6" class="empty-row">No hay programas disponibles</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- PDF del Programa de Comparaciones -->
    <section class="pdf-program-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Documento</span>
          <h2 class="section-title">Programa de Comparaciones</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Visualiza el programa de comparaciones interlaboratorio</p>
        </div>

        <div class="program-card-list" data-aos="fade-up">
          <div class="programa-feature-card" v-for="(doc, idx) in programaDocuments" :key="doc.id" :data-aos-delay="idx * 80">
            <div class="programa-feature-icon-wrap">
              <img :src="currentTheme === 'dark' ? (doc.iconWhite || doc.icon) : doc.icon" alt="" class="programa-feature-icon-img" />
            </div>
            <div class="programa-feature-body">
              <h4 class="programa-feature-title">{{ doc.title }}</h4>
              <p class="programa-feature-desc">{{ doc.description }}</p>
              <div class="programa-card-actions">
                <button class="programa-feature-btn" @click="openPdfModal(doc)">
                  <i class="bi bi-eye-fill"></i>
                  Ver Documento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="benefits-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
            <div class="benefits-image">
              <div class="image-overlay"></div>
              <div class="benefits-image-icon">
                <img src="../../image/IMAGEN 5.png" alt="Beneficios de participar en interlaboratorio" />
              </div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <span class="section-eyebrow">Beneficios</span>
            <h2 class="section-title">Beneficios de Participar</h2>
            <div class="title-underline mb-4"></div>

            <div class="benefits-list">
              <div class="benefit-item" v-for="benefit in benefitsList" :key="benefit.title">
                <div class="benefit-icon-wrap">
                  <i :class="benefit.icon"></i>
                </div>
                <div class="benefit-content">
                  <h5>{{ benefit.title }}</h5>
                  <p>{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

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
            :class="{ 'expanded': faq.open }"
          >
            <button class="faq-header" @click="toggleFaq(faq)">
              <div class="faq-question">
                <i class="bi bi-question-circle-fill"></i>
                <span>{{ faq.pregunta }}</span>
              </div>
              <div class="faq-toggle">
                <i :class="faq.open ? 'bi bi-dash-lg' : 'bi bi-plus-lg'"></i>
              </div>
            </button>
            <div class="faq-body" :class="{ 'show': faq.open }">
              <p>{{ faq.respuesta }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterComponent :current-theme="currentTheme" />

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="interlabToast" class="toast" role="alert" ref="toastEl">
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto"><i :class="toastIcon"></i> Notificación</strong>
          <small>Ahora</small>
          <button type="button" class="btn-close" :class="toastType === 'success' ? 'btn-close-white' : ''" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body d-flex align-items-center">
          <i :class="toastBodyIcon" class="fs-5 me-2"></i>
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import FooterComponent from '@/components/Footer/Footer.vue'
import heroInterlaboratorio from '@/image/Acreditaciones.png'
import type { Toast } from 'bootstrap'

type ToastType = 'success' | 'info' | 'warning' | 'error'

interface Area {
  id: number
  name: string
  icon: string
}

interface Document {
  id: number
  title: string
  code?: string
  description: string
  version?: string
  date?: string
  pages?: number
  size?: string
  url?: string
  downloadUrl?: string
  icon?: string
  iconWhite?: string
}

interface FAQ {
  id: number
  pregunta: string
  respuesta: string
  open: boolean
}

interface FormData {
  nombre: string
  empresa: string
  email: string
  telefono: string
  area: number | null
  parametros: string
  requerimientos: string
  privacidad: boolean
}

interface FormErrors {
  nombre?: string
  empresa?: string
  email?: string
  telefono?: string
  area?: string
  requerimientos?: string
  privacidad?: string
}

const { currentTheme } = useTheme()

const form = ref<FormData>({
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  area: null,
  parametros: '',
  requerimientos: '',
  privacidad: false
})

const errors = ref<FormErrors>({})
const isSubmitting = ref(false)
const contactForm = ref<HTMLElement | null>(null)

// Video modal state
import { nextTick } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { API_BASE } from '@/config/api'
import PdfViewerModal from '@/components/UI/PdfViewerModal.vue'
const showVideoModal = ref(false)
const videoSrc = '/video/Comparación.mp4'
const videoPoster = '/video/image.png'
const videoEl = ref<HTMLVideoElement | null>(null)

const openVideo = async () => {
  showVideoModal.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  try { await videoEl.value?.play() } catch (e) { /* autoplay may be blocked */ }
}

const closeVideo = () => {
  showVideoModal.value = false
  if (videoEl.value) {
    try { videoEl.value.pause() } catch (e) {}
    try { videoEl.value.currentTime = 0 } catch (e) {}
  }
  document.body.style.overflow = ''
}

// API
const interlaboratorios = ref<any[]>([])
const cart = ref<number[]>([])

// Carrito modal (solicitar cotización)
const showCarritoModal = ref(false)
const cotForm = ref({ nombre: '', laboratorio: '', email: '', telefono: '' })

const openCarritoModal = async (p: any) => {
  selectedPrograma.value = p
  showCarritoModal.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  const el = document.querySelector('.modal-carrito .form-control-custom') as HTMLInputElement | null
  if (el) el.focus()
}

const closeCarritoModal = () => {
  showCarritoModal.value = false
  selectedPrograma.value = null
  document.body.style.overflow = ''
}

const solicitarCotizacion = async () => {
  if (!cotForm.value.nombre || !cotForm.value.email || !cotForm.value.laboratorio) { showToast('Completa nombre, laboratorio y correo', 'warning'); return }
  if (!selectedPrograma.value) { showToast('Selecciona un programa', 'warning'); return }
  try {
    const payload = {
      nombre: cotForm.value.nombre,
      laboratorio: cotForm.value.laboratorio,
      email: cotForm.value.email,
      telefono: cotForm.value.telefono,
      programa: {
        referencia: selectedPrograma.value.referencia || selectedPrograma.value.codigo || String(selectedPrograma.value.id),
        descripcion: selectedPrograma.value.descripcion || ''
      }
    }

    const res = await fetch(`${API_BASE}/api/comparaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      console.error('Error solicitando cotizacion:', body)
      showToast('Error al enviar la solicitud', 'error')
      return
    }

    showToast('Solicitud enviada. Gracias.', 'success')
    cotForm.value = { nombre: '', laboratorio: '', email: '', telefono: '' }
    closeCarritoModal()
  } catch (e) {
    console.error('solicitarCotizacion error', e)
    showToast('Error al enviar la solicitud', 'error')
  }
}

const fetchInterlaboratorios = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/interlaboratorio?limit=1000&page=1`)
    if (!resp.ok) return
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : (body.data || body)
    interlaboratorios.value = rows.map((r: any) => ({
      id: r.id_interlaboratorio || r.id,
      referencia: r.referencia || '',
      descripcion: r.descripcion || '',
      anio: r.anio || null,
      inscripcionInicio: r.inscripcion_inicio || r.inscripcionInicio || '',
      inscripcionFin: r.inscripcion_fin || r.inscripcionFin || '',
      fechaInicioInterlaboratorio: r.fecha_inicio_interlaboratorio || r.fechaInicioInterlaboratorio || '',
      fechaDetalle: r.fecha_detalle || r.fechaDetalle || '',
      disponible: typeof r.disponible !== 'undefined' ? !!r.disponible : true,
    }))
  } catch (e) {
    console.error('Error fetching interlaboratorios', e)
  }
}

const addToCart = (p: any) => {
  if (!p.disponible) { showToast('El programa no está abierto', 'warning'); return }
  openCarritoModal(p)
}

// Bilateral modal
const showBilateralModal = ref(false)
const selectedPrograma = ref<any | null>(null)

const openBilateralModal = (p: any) => {
  selectedPrograma.value = p
  showBilateralModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeBilateralModal = () => {
  showBilateralModal.value = false
  selectedPrograma.value = null
  document.body.style.overflow = ''
}

// Nuevo: formulario de solicitud desde modal bilateral (soporta varios programas)
const showBilateralFormModal = ref(false)
const bilateralForm = ref({ nombre: '', laboratorio: '', email: '', telefono: '', programaIds: [] as number[] })
const bilateralErrors = ref<any>({})

const openInfoModal = () => {
  // preservar selección actual antes de cerrar el modal bilateral
  const preId = selectedPrograma.value ? selectedPrograma.value.id : null
  closeBilateralModal()
  // preseleccionar programa(s) si viene desde un programa específico
  bilateralForm.value = { nombre: '', laboratorio: '', email: '', telefono: '', programaIds: preId ? [preId] : (interlaboratorios.value[0]?.id ? [interlaboratorios.value[0].id] : []) }
  bilateralErrors.value = {}
  showBilateralFormModal.value = true
  window.document.body.style.overflow = 'hidden'
}

const closeBilateralFormModal = () => {
  showBilateralFormModal.value = false
  bilateralForm.value = { nombre: '', laboratorio: '', email: '', telefono: '', programaIds: [] }
  bilateralErrors.value = {}
  window.document.body.style.overflow = ''
}

const validateBilateralForm = () => {
  bilateralErrors.value = {}
  let ok = true
  if (!bilateralForm.value.nombre || !bilateralForm.value.nombre.trim()) { bilateralErrors.value.nombre = 'Nombre requerido'; ok = false }
  if (!bilateralForm.value.laboratorio || !bilateralForm.value.laboratorio.trim()) { bilateralErrors.value.laboratorio = 'Laboratorio requerido'; ok = false }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!bilateralForm.value.email || !emailRegex.test(bilateralForm.value.email)) { bilateralErrors.value.email = 'Email inválido'; ok = false }
  if (!bilateralForm.value.telefono || bilateralForm.value.telefono.trim().length < 7) { bilateralErrors.value.telefono = 'Teléfono inválido'; ok = false }
  if (!bilateralForm.value.programaIds || bilateralForm.value.programaIds.length === 0) { bilateralErrors.value.programaIds = 'Selecciona al menos un programa'; ok = false }
  return ok
}

const submitBilateralForm = async () => {
  if (!validateBilateralForm()) { showToast('Corrige los errores del formulario', 'warning'); return }
  try {
    // construir payload con datos del/los programas seleccionados
    const selectedIds = bilateralForm.value.programaIds || []
    const programas = interlaboratorios.value
      .filter((p: any) => selectedIds.includes(p.id))
      .map((p: any) => ({ id: p.id, referencia: p.referencia || p.codigo || '', descripcion: p.descripcion || '' }))

    const payload = {
      nombre: bilateralForm.value.nombre,
      laboratorio: bilateralForm.value.laboratorio,
      email: bilateralForm.value.email,
      telefono: bilateralForm.value.telefono,
      notas: bilateralForm.value.notas || '',
      programaIds: selectedIds,
      programas,
    }

    const res = await fetch(`${API_BASE}/api/comparaciones-bilateral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      console.error('Error enviando comparacion:', body)
      showToast('Error al enviar la solicitud', 'error')
      return
    }

    showToast('Solicitud enviada. Gracias por tu interés.', 'success')
    closeBilateralFormModal()
  } catch (e) {
    console.error('submitBilateralForm error', e)
    showToast('Error al enviar la solicitud', 'error')
  }
}

const programaDocuments = ref<Document[]>([
  {
    id: 300,
    title: 'Programa de Comparaciones Interlaboratorio SENA 2026',
    description: 'Programa general de comparaciones interlaboratorio y cronograma.',
    url: '/pdf/Comparaciones/Comparaciones 2026.pdf',
    downloadUrl: '/pdf/Comparaciones/Comparaciones 2026.pdf',
    icon: new URL('../../image/icons/Servicios/Black/Especiales.svg', import.meta.url).href,
    iconWhite: new URL('../../image/icons/Servicios/White/Especiales-White.svg', import.meta.url).href
  }
])

const showPdfModal = ref(false)
const selectedDocument = ref<Document | null>(null)

const openPdfModal = (doc: Document) => {
  selectedDocument.value = doc
  showPdfModal.value = true
  window.document.body.style.overflow = 'hidden'
}

const closePdfModal = () => {
  showPdfModal.value = false
  selectedDocument.value = null
  window.document.body.style.overflow = ''
}

const faqs = ref<FAQ[]>([
  { id: 1, pregunta: '¿Cuál es el costo de participación en los programas?', respuesta: 'Los costos varían según el tipo de programa, número de parámetros y frecuencia. Contáctanos para una cotización personalizada.', open: true },
  { id: 2, pregunta: '¿Qué documentos recibo al participar?', respuesta: 'Recibirás certificado de participación, reporte estadístico detallado, gráficos de comparación, evaluación de resultados y recomendaciones técnicas.', open: false },
  { id: 3, pregunta: '¿Cuánto tiempo toma recibir los resultados?', respuesta: 'Los resultados preliminares se entregan en 15 días hábiles después del cierre de la ronda. El reporte final completo en 30 días hábiles.', open: false },
  { id: 4, pregunta: '¿Puedo participar en múltiples programas?', respuesta: 'Sí, ofrecemos descuentos por volumen para laboratorios que participan en múltiples programas o parámetros.', open: false },
  { id: 5, pregunta: '¿Los programas son reconocidos internacionalmente?', respuesta: 'Sí, todos nuestros programas están diseñados bajo la norma ISO/IEC 17043:2023 y son reconocidos por organismos de acreditación nacionales e internacionales.', open: false }
])

const processSteps = [
  { title: 'Inscripción', description: 'Completa el formulario de inscripción especificando los parámetros de interés y fechas requeridas.' },
  { title: 'Recepción de Material', description: 'Enviamos las muestras o materiales de prueba a tu laboratorio con instrucciones detalladas de análisis.' },
  { title: 'Análisis y Reporte', description: 'Realiza los análisis según protocolo establecido y reporta los resultados a través de nuestra plataforma.' },
  { title: 'Evaluación y Reporte Final', description: 'Procesamos estadísticamente los resultados y te enviamos un reporte comparativo detallado con gráficos y análisis.' }
]

const benefitsList = [
  { icon: 'bi bi-clipboard-check', title: 'Validación de Competencia', description: 'Demuestra la competencia técnica de tu laboratorio ante autoridades de acreditación y clientes.' },
  { icon: 'bi bi-graph-up', title: 'Mejora Continua', description: 'Identifica desviaciones y áreas de oportunidad para implementar acciones correctivas y preventivas.' },
  { icon: 'bi bi-shield-check', title: 'Conformidad Normativa', description: 'Cumple con los requisitos de normas internacionales como ISO/IEC 17025:2017 para evaluación externa.' },
  { icon: 'bi bi-trophy', title: 'Ventaja Competitiva', description: 'Diferenciate en el mercado con certificados de participación y buenos resultados en comparaciones interlaboratorio.' }
]

const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

const toastClass = computed(() => {
  const classes: Record<ToastType, string> = { success: 'bg-success text-white', info: 'bg-info text-white', warning: 'bg-warning text-dark', error: 'bg-danger text-white' }
  return classes[toastType.value] || 'bg-info text-white'
})

const toastIcon = computed(() => {
  const icons: Record<ToastType, string> = { success: 'bi bi-check-circle', info: 'bi bi-info-circle', warning: 'bi bi-exclamation-triangle', error: 'bi bi-x-circle' }
  return icons[toastType.value] || 'bi bi-info-circle'
})

const toastBodyIcon = computed(() => {
  const icons: Record<ToastType, string> = { success: 'bi bi-check-circle-fill text-success', info: 'bi bi-info-circle-fill text-info', warning: 'bi bi-exclamation-triangle-fill text-warning', error: 'bi bi-x-circle-fill text-danger' }
  return icons[toastType.value] || 'bi bi-info-circle-fill text-info'
})

const scrollToForm = () => {
  contactForm.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const toggleFaq = (faq: FAQ) => {
  faq.open = !faq.open
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true
  if (!form.value.nombre.trim()) { errors.value.nombre = 'El nombre es requerido'; isValid = false }
  if (!form.value.empresa.trim()) { errors.value.empresa = 'El nombre de la empresa es requerido'; isValid = false }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) { errors.value.email = 'El email es requerido'; isValid = false }
  else if (!emailRegex.test(form.value.email)) { errors.value.email = 'Ingresa un email válido'; isValid = false }
  if (!form.value.telefono) { errors.value.telefono = 'El teléfono es requerido'; isValid = false }
  else if (!/^[\d\s\-\+\(\)]+$/.test(form.value.telefono)) { errors.value.telefono = 'Ingresa un teléfono válido'; isValid = false }
  if (!form.value.area) { errors.value.area = 'Selecciona un área de interés'; isValid = false }
  if (!form.value.requerimientos.trim()) { errors.value.requerimientos = 'Los requerimientos son obligatorios'; isValid = false }
  else if (form.value.requerimientos.length < 20) { errors.value.requerimientos = 'Describe con más detalle tus requerimientos'; isValid = false }
  if (!form.value.privacidad) { errors.value.privacidad = 'Debes aceptar la política de privacidad'; isValid = false }
  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    showToast('Por favor, corrige los errores en el formulario', 'warning')
    return
  }
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    form.value = { nombre: '', empresa: '', email: '', telefono: '', area: null, parametros: '', requerimientos: '', privacidad: false }
    showToast('¡Solicitud enviada con éxito! Un especialista se pondrá en contacto contigo.', 'success')
  } catch (error) {
    showToast('Error al enviar la solicitud. Por favor, inténtalo de nuevo.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const showToast = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type
  if (toastInstance) toastInstance.hide()
  if (toastEl.value) {
    import('bootstrap').then((bootstrap) => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 4000 })
      toastInstance.show()
    })
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme')) {
    currentTheme.value = 'dark'
    localStorage.setItem('theme', 'dark')
  }
  fetchInterlaboratorios()
})
</script>

<style scoped>

:root {
  --radius-card: 20px;
  --shadow-sm: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
}

.interlaboratorio-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
  transition: background 0.3s ease, color 0.3s ease;
}

[data-bs-theme="dark"] .interlaboratorio-page {
  background: #0c0f0a;
  color: #e8ede3;
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122,171,61,0.16);
  --sena-green-pale: rgba(93,138,47,0.12);
}

/* Shared */
.section-subtitle {
  font-size: 0.88rem;
  color: var(--sena-muted);
  margin-top: 0.75rem;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: rgba(93,138,47,0.95);
  color: #ffffff;
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: var(--shadow-green);
  transition: var(--transition);
  border: none;
  cursor: pointer;
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
  color: #ffffff;
}

.outline-btn {
  border: 1.5px solid var(--sena-green);
  color: var(--sena-green);
  background: transparent;
  padding: 0.65rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
}
.outline-btn:hover {
  background: var(--sena-green-pale);
  color: var(--sena-text);
}

/* Hero */
.inter-hero {
  min-height: 58vh;
  background-size: cover;
  background-position: center center;
  color: white;
  padding: 5rem 0 4rem;
  position: relative;
  display: flex;
  align-items: center;
}
.inter-hero .hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(93,138,47,0.08) 100%);
  pointer-events: none;
}
.inter-hero .hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem 0;
}
.hero-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1.25rem;
  line-height: 1.1;
}
.hero-subtitle {
  font-size: 1.08rem;
  color: rgba(255,255,255,0.9);
  margin-bottom: 1.75rem;
  max-width: 580px;
  line-height: 1.65;
}
.hero-subtitle strong { color: #ffffff; font-weight: 700; }
.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1.75rem;
}
.badge-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  border: none;
  border-radius: 50px;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.badge-item i { color: #ffffff65; font-size: 0.85rem; }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

.hero-card {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-card);
  padding: 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
}
.hero-card-icon {
  width: 70px;
  height: 70px;
  background: rgba(122,171,61,0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 2rem;
  color: #a8d46a;
}
.hero-card h4 {
  color: #ffffff !important;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.card-list { list-style: none; padding: 0; margin: 0 0 1.5rem; text-align: left; }
.card-list li {
  padding-left: 1.6rem;
  position: relative;
  margin-bottom: 0.55rem;
  font-size: 0.87rem;
  color: rgba(255,255,255,0.88);
}
.card-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 9px;
  height: 9px;
  background: linear-gradient(135deg, #7aab3d, #a8d46a);
  border-radius: 50%;
}
.card-accreditation {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(122,171,61,0.2);
  border: 1px solid rgba(122,171,61,0.35);
  border-radius: 20px;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  color: #a8d46a;
}

/* Programs */
.programs-section {
  padding: 4rem 0;
  background: #fafaf8;
}
[data-bs-theme="dark"] .programs-section { background: #0c0f0a; }
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.program-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
[data-bs-theme="dark"] .program-card { background: #131a0e; }
.program-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(93,138,47,0.14);
  border-color: rgba(93,138,47,0.28);
}
.program-icon-wrap {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(93,138,47,0.1), rgba(122,171,61,0.06));
  border: 2px solid rgba(93,138,47,0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--sena-green);
  margin-bottom: 1.2rem;
  transition: var(--transition);
}
.program-card:hover .program-icon-wrap {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  border-color: transparent;
  color: #ffffff;
}
.program-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
.program-description { font-size: 0.85rem; color: var(--sena-muted); margin-bottom: 1rem; }
.program-features { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.feature-tag {
  background: var(--sena-green-pale);
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.7rem;
  color: var(--sena-green);
  font-weight: 500;
}
.program-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--sena-muted); }
.program-meta i { color: var(--sena-green); }

/* Process */
.process-section {
  padding: 4.5rem 0;
  background: #ffffff;
}
[data-bs-theme="dark"] .process-section { background: #0e1509; }
.process-timeline {
  max-width: 680px;
  margin: 0 auto;
}
.process-item {
  display: flex;
  gap: 1.75rem;
  padding-bottom: 2.5rem;
  position: relative;
}
.process-item:last-child { padding-bottom: 0; }
.process-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 27px;
  top: 56px;
  width: 2px;
  height: calc(100% - 36px);
  background: linear-gradient(180deg, rgba(93,138,47,0.35) 0%, rgba(93,138,47,0.04) 100%);
}
.process-number {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #5d8a2f, #7aab3d);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.88rem;
  color: #ffffff;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 16px rgba(93,138,47,0.3);
}
.process-content {
  padding-top: 0.65rem;
}
.process-content h4 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.35rem;
}
[data-bs-theme="dark"] .process-content h4 { color: #e0ecd6; }
.process-content p { font-size: 0.85rem; color: var(--sena-muted); margin: 0; line-height: 1.62; }

/* Benefits */
.benefits-section {
  padding: 4rem 0;
  background: #fafaf8;
}
[data-bs-theme="dark"] .benefits-section { background: #0c0f0a; }
.benefits-image {
  height: 360px;
  border-radius: 24px;
  background: linear-gradient(145deg, #152d0a 0%, #0d2208 55%, #061604 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.benefits-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 25% 35%, rgba(93,138,47,0.2) 0%, transparent 55%),
    radial-gradient(circle at 75% 70%, rgba(122,171,61,0.1) 0%, transparent 50%);
  pointer-events: none;
}
.image-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    rgba(255,255,255,0.018) 0px,
    rgba(255,255,255,0.018) 1px,
    transparent 1px,
    transparent 38px
  );
  z-index: 1;
}
.benefits-image-icon {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.benefits-image-icon img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 24px;
}
.benefits-list { display: flex; flex-direction: column; gap: 1.5rem; }
.benefit-item { display: flex; gap: 1rem; }
.benefit-icon-wrap {
  width: 48px;
  height: 48px;
  background: var(--sena-green-pale);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sena-green);
  font-size: 1.2rem;
  flex-shrink: 0;
}
.benefit-content h5 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem; }
.benefit-content p { font-size: 0.82rem; color: var(--sena-muted); margin: 0; }

/* Contact Form */
.contact-form-section {
  padding: 4rem 0;
  background: #fafaf8;
}
[data-bs-theme="dark"] .contact-form-section { background: #0c0f0a; }
.form-wrapper {
  background: #ffffff;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--sena-border);
}
[data-bs-theme="dark"] .form-wrapper { background: #131a0e; }
.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}
.area-option {
  background: #fcfdfb;
  border: 1.5px solid var(--sena-border);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}
[data-bs-theme="dark"] .area-option { background: #1a2413; }
.area-option:hover { border-color: var(--sena-green-light); }
.area-option.selected {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: white;
  border-color: transparent;
}
.area-option i { font-size: 1.5rem; margin-bottom: 0.25rem; display: block; }
.area-option span { font-size: 0.8rem; }

/* FAQ Section */
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

/* Video Card + Modal */
.video-section { padding: 3.5rem 0; }
.video-card {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  background: #ffffff;
  border-radius: 18px;
  padding: 1.25rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
}
[data-bs-theme="dark"] .video-card { background: #11180b; }
.video-thumbnail {
  width: 420px;
  max-width: 45%;
  height: 250px;
  border-radius: 14px;
  background-image: url('/video/image.png');
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.04);
}
.video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.18));
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-btn {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.6rem;
  box-shadow: 0 8px 28px rgba(93,138,47,0.28);
  transform: scale(1);
  transition: var(--transition);
}
.video-thumbnail:hover .play-btn { transform: scale(1.06); }
.video-card-body h3 { margin: 0 0 0.25rem; font-size: 1.25rem; }
.video-card-body p.small { margin: 0 0 0.75rem; color: var(--sena-muted); }

.video-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.64);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.video-modal-container {
  width: min(1100px, 95%);
  max-width: 1100px;
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  position: relative;
  padding: 14px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-modal-close {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 4;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-embed {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: calc(100vh - 120px);
  background: #000;
  border-radius: 10px;
  overflow: hidden;
}
.video-embed video,
.video-embed iframe {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  border: 0;
}

/* Tabla pública de interlaboratorio */
.table-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 1.5rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  margin-top: 1rem;
}
[data-bs-theme="dark"] .table-card { background: #131a0e; }

.table-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}
.table-subtext {
  font-size: 0.82rem;
  color: var(--sena-muted);
}
.btn-bilateral {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: rgba(69, 129, 9, 0.8);
  color: #ffffff;
  padding: 0.65rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  box-shadow: var(--shadow-green);
  transition: var(--transition);
  cursor: pointer;
}
.btn-bilateral:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
  color: #ffffff;
}
.btn-bilateral svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.interlab-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  color: var(--sena-text);
}
.interlab-table thead th {
  text-align: left;
  padding: 0.9rem 0.9rem;
  background: linear-gradient(90deg, rgba(122,171,61,0.06), rgba(122,171,61,0.02));
  color: var(--sena-text);
  font-weight: 700;
  border-bottom: 2px solid var(--sena-border);
}
.interlab-table tbody td {
  padding: 0.85rem 0.9rem;
  vertical-align: middle;
  color: var(--sena-muted);
  border-bottom: 1px solid var(--sena-border);
}
.referencia-text {
  display: inline-block;
  background: rgba(69, 129, 9, 0.8);
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
}
.descripcion-cell {
  max-width: none;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  word-break: break-word;
}
.fecha-cell { display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem; color: var(--sena-muted); }
.fecha-label { font-weight: 600; color: var(--sena-text); margin-right: 6px; }
.status-text {
  padding: 6px 10px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-block;
}
.status-text.abierto {
  background: rgba(122,171,61,0.12);
  color: var(--sena-green);
  border: 1px solid rgba(122,171,61,0.12);
}
.status-text.cerrado {
  background: rgba(204,62,47,0.12);
  color: #c0392b;
  border: 1px solid rgba(204,62,47,0.12);
}
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 10px;
  border-radius: 10px;
  border: none;
  background: rgba(69, 129, 9, 0.8);
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
  transition: var(--transition);
}
.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 67, 0, 0.592);
}
.action-btn i { font-size: 1rem; }
.action-btn:disabled { opacity: 0.55; cursor: not-allowed; background: #e9ecef; color: #6c757d; }
.interlab-table tbody tr:hover {
  background: rgba(93,138,47,0.04);
}
[data-bs-theme="dark"] .interlab-table tbody tr:hover {
  background: rgba(122,171,61,0.06);
}
.empty-row { text-align: center; padding: 1rem; color: var(--sena-muted); }

/* ============================================================
   MODALES - COMPLETAMENTE OPTIMIZADOS
   ============================================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeInOverlay 0.25s ease;
}

@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content,
.modal-container {
  background: #ffffff;
  border-radius: var(--radius-card);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
  animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-bs-theme="dark"] .modal-content,
[data-bs-theme="dark"] .modal-container {
  background: #131a0e;
  border: 1px solid rgba(122, 171, 61, 0.12);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal específico para PDF (más grande) */
.modal-pdf {
  max-width: 900px;
  max-height: 92vh;
}

.modal-pdf .modal-body {
  padding: 0;
  height: calc(92vh - 80px);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--sena-border);
  background: transparent;
  flex-shrink: 0;
}

[data-bs-theme="light"] .modal-header {
  border-bottom-color: #e0e8d8;
}

.modal-header h3,
.modal-header .modal-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
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
  flex-shrink: 0;
}

[data-bs-theme="dark"] .modal-close {
  background: rgba(93, 138, 47, 0.15);
  color: #e8ede3;
}

[data-bs-theme="light"] .modal-close {
  background: #e8f0d8;
  color: #1c2b14;
}

.modal-close:hover {
  background: #e74c3c;
  color: #ffffff;
  transform: rotate(90deg);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

/* PDF Viewer */
.pdf-viewer {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.pdf-embed {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: none;
  border-radius: 8px;
}

.pdf-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--sena-muted);
}

.pdf-placeholder i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--sena-green);
}

/* Carrito Modal */
.modal-carrito .modal-content {
  max-width: 500px;
}

.carrito-detalle {
  background: var(--sena-green-pale);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

[data-bs-theme="dark"] .carrito-detalle {
  background: rgba(93, 138, 47, 0.08);
}

[data-bs-theme="light"] .carrito-detalle {
  background: #e8f0d8;
}

.carrito-detalle p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: var(--sena-muted);
}

.carrito-detalle strong {
  color: var(--sena-text);
}

.carrito-detalle h6 {
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  color: var(--sena-text);
}

/* Formulario dentro del modal */
.cotizacion-form .form-group {
  margin-bottom: 1rem;
}

.cotizacion-form label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--sena-text);
  margin-bottom: 0.25rem;
}

.form-control-custom {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1.5px solid var(--sena-border);
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: var(--font-body);
  background: #fcfdfb;
  color: var(--sena-text);
  transition: var(--transition);
}

[data-bs-theme="dark"] .form-control-custom {
  background: #1a2413;
  border-color: rgba(122, 171, 61, 0.2);
  color: #e8ede3;
}

.form-control-custom:focus {
  outline: none;
  border-color: var(--sena-green);
  box-shadow: 0 0 0 3px rgba(93, 138, 47, 0.12);
}

.carrito-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-cancelar {
  flex: 1;
  padding: 0.7rem 1rem;
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
  background: rgba(255, 255, 255, 0.05);
}

.btn-confirmar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  background: rgba(69, 129, 9, 0.8);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-confirmar:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-green);
}

.btn-confirmar svg {
  width: 18px;
  height: 18px;
}

/* Bilateral Modal */
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
  background: rgba(93, 138, 47, 0.08);
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
  background: rgba(69, 129, 9, 0.8);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
  justify-content: center;
}

.btn-contactar-bilateral:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-green);
}

.btn-contactar-bilateral svg {
  width: 18px;
  height: 18px;
}

/* PDF Program Section */
.pdf-program-section {
  padding: 4rem 0;
  background: #fafaf8;
}

[data-bs-theme="dark"] .pdf-program-section {
  background: #0c0f0a;
}

.program-card-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.programa-feature-card {
  position: relative;
  background: #ffffff;
  border: 1px solid var(--sena-border);
  border-radius: 20px;
  padding: 2rem 2rem 2rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.programa-feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 56px rgba(93, 138, 47, 0.14);
}

[data-bs-theme="dark"] .programa-feature-card {
  background: #131a0e;
  border-color: rgba(122, 171, 61, 0.12);
}

[data-bs-theme="dark"] .programa-feature-card:hover {
  border-color: rgba(122, 171, 61, 0.3);
}

.programa-feature-icon-wrap {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(93, 138, 47, 0.07), rgba(122, 171, 61, 0.05));
  border: 2px solid rgba(93, 138, 47, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.programa-feature-card:hover .programa-feature-icon-wrap {
  background: linear-gradient(135deg, rgba(93, 138, 47, 0.14), rgba(122, 171, 61, 0.09));
  border-color: rgba(93, 138, 47, 0.22);
}

.programa-feature-icon-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.programa-feature-body {
  flex: 1;
}

.programa-feature-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .programa-feature-title {
  color: #e8ede3;
}

.programa-feature-desc {
  font-size: 0.88rem;
  color: var(--sena-muted);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.programa-card-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.programa-feature-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.4rem;
  background: rgba(69, 129, 9, 0.8);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
}

.programa-feature-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(93, 138, 47, 0.3);
  background: rgba(69, 129, 9, 0.9);
}

.programa-feature-btn i {
  font-size: 1rem;
}

/* ============================================
   MEJORAS PARA MODO CLARO
   ============================================ */
[data-bs-theme="light"] .program-card,
[data-bs-theme="light"] .video-card,
[data-bs-theme="light"] .form-wrapper,
[data-bs-theme="light"] .cta-wrapper,
[data-bs-theme="light"] .table-card {
  border-color: rgba(93, 138, 47, 0.25) !important;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08), 0 1px 6px rgba(0, 0, 0, 0.04) !important;
}

[data-bs-theme="light"] .interlab-table thead th {
  background: rgba(93, 138, 47, 0.06);
  border-bottom: 2px solid rgba(93, 138, 47, 0.15);
}

[data-bs-theme="light"] .interlab-table tbody td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

[data-bs-theme="light"] .hero-card {
  background: rgba(255, 255, 255, 0.466) !important;
  backdrop-filter: blur(1px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

[data-bs-theme="light"] .hero-card h4,
[data-bs-theme="light"] .hero-card .card-list li,
[data-bs-theme="light"] .hero-card .card-accreditation {
  color: var(--sena-text) !important;
}

[data-bs-theme="light"] .hero-card .card-list li::before {
  background: var(--sena-green);
}

[data-bs-theme="light"] .hero-card .card-accreditation {
  background: rgba(93, 138, 47, 0.08);
  border-color: rgba(93, 138, 47, 0.2);
  color: var(--sena-green);
}

[data-bs-theme="light"] .hero-card .hero-card-icon {
  background: rgba(93, 138, 47, 0.12);
  color: var(--sena-green);
}

[data-bs-theme="light"] .program-description,
[data-bs-theme="light"] .benefit-content p,
[data-bs-theme="light"] .faq-answer,
[data-bs-theme="light"] .modal-text,
[data-bs-theme="light"] .video-card-body p.small {
  color: #2d3d24;
}

[data-bs-theme="light"] .outline-btn {
  border-color: var(--sena-green);
  color: var(--sena-green);
  background: rgba(255, 255, 255, 0.7);
}

[data-bs-theme="light"] .outline-btn:hover {
  background: var(--sena-green-pale);
  color: var(--sena-text);
}

[data-bs-theme="light"] .modal-content,
[data-bs-theme="light"] .modal-container {
  background: #ffffff;
  border: 1px solid rgba(93, 138, 47, 0.2);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
}

[data-bs-theme="light"] .area-option {
  background: #fcfdfb;
}

[data-bs-theme="light"] .area-option:hover {
  background: #f0f5ea;
}

[data-bs-theme="light"] .feature-tag {
  background: #edf4e3;
}

[data-bs-theme="light"] .program-icon-wrap {
  background: linear-gradient(135deg, rgba(93, 138, 47, 0.08), rgba(122, 171, 61, 0.04));
}

[data-bs-theme="light"] .status-text.abierto {
  background: rgba(93, 138, 47, 0.1);
  color: #4a7a20;
}

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

[data-bs-theme="light"] .programa-feature-card {
  background: #ffffff;
}

[data-bs-theme="light"] .programa-feature-card:hover {
  border-color: rgba(93, 138, 47, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title { font-size: 2.2rem; }
  .section-title { font-size: 2rem; }
  .form-wrapper { padding: 2rem 1.5rem; }
  .cta-wrapper { flex-direction: column; text-align: center; }
  .benefits-image { height: 260px; }

  .modal-content,
  .modal-container {
    max-width: 95%;
    margin: 0.5rem;
  }

  .modal-pdf {
    max-width: 98%;
  }

  .modal-pdf .modal-body {
    height: calc(85vh - 70px);
  }

  .modal-header {
    padding: 1rem 1.25rem;
  }

  .modal-header h3,
  .modal-header .modal-title {
    font-size: 1.1rem;
  }

  .modal-body {
    padding: 1.25rem;
  }

  .programa-feature-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .programa-card-actions {
    justify-content: center;
  }

  .carrito-actions {
    flex-direction: column;
  }
}

@media (max-width: 992px) {
  .video-card { flex-direction: column; }
  .video-thumbnail { width: 100%; max-width: 100%; height: 220px; }
  .interlab-table thead th:nth-child(2),
  .interlab-table td:nth-child(2) { display: none; }
  .interlab-table thead th:nth-child(3),
  .interlab-table td:nth-child(3) { display: none; }
  .interlab-table { font-size: 0.92rem; }

  .modal-pdf {
    max-width: 98%;
  }
}

@media (max-width: 576px) {
  .hero-actions { flex-direction: column; }
  .hero-actions .outline-btn { text-align: center; }
  .programs-grid { grid-template-columns: 1fr; }
  .areas-grid { grid-template-columns: repeat(2, 1fr); }
  .bilateral-features { grid-template-columns: 1fr; }
  .table-header { flex-direction: column; align-items: flex-start !important; gap: 0.75rem; }

  .modal-content,
  .modal-container {
    max-width: 98%;
    max-height: 95vh;
  }

  .modal-body {
    padding: 1rem;
    max-height: calc(95vh - 70px);
  }

  .modal-pdf .modal-body {
    height: calc(80vh - 60px);
    min-height: 300px;
  }

  .pdf-embed {
    min-height: 300px;
  }

  .programa-feature-icon-wrap {
    width: 64px;
    height: 64px;
  }

  .programa-feature-icon-img {
    width: 36px;
    height: 36px;
  }
}

/* Scrollbar personalizado para modales */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--sena-border);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--sena-green);
}
</style>
