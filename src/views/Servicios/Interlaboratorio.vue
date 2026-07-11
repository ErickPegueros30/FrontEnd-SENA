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
              <div class="hero-actions">
                <button class="contact-btn" @click="scrollToForm">
                  Solicitar programa
                  <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <router-link to="/contacto" class="outline-btn">
                  Consultar especialista
                </router-link>
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

    <!-- Modal Bilateral -->
    <div v-if="showBilateralModal" class="modal-overlay" @click="closeBilateralModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Programa Bilateral</h3>
          <button class="modal-close" @click="closeBilateralModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-text">
            <strong>{{ selectedPrograma?.referencia || selectedPrograma?.referencia }}</strong>
          </p>
          <p class="modal-text">{{ selectedPrograma?.descripcion || '-' }}</p>
          <div class="bilateral-features">
            <div class="bilateral-feature">
              <i class="bi bi-calendar-check"></i>
              <span>Fechas flexibles</span>
            </div>
            <div class="bilateral-feature">
              <i class="bi bi-shield-check"></i>
              <span>Soporte técnico</span>
            </div>
            <div class="bilateral-feature">
              <i class="bi bi-people"></i>
              <span>Diseño personalizado</span>
            </div>
          </div>
          <button class="btn-contactar-bilateral" @click="() => { closeBilateralModal(); scrollToForm(); }">
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
            <p><strong>Referencia:</strong> {{ selectedPrograma.referencia }}</p>
            <p><strong>Fecha de inicio:</strong> {{ selectedPrograma.fechaInicioInterlaboratorio || selectedPrograma.fecha_inicio_interlaboratorio || '-' }}</p>
            <p><strong>Descripción:</strong></p>
            <h6>{{ selectedPrograma.descripcion }}</h6>
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
      <div v-if="showVideoModal" class="video-modal-overlay" @click.self="closeVideo">
        <div class="video-modal-container" data-aos="zoom-in">
          <button class="modal-close video-modal-close" @click="closeVideo"><i class="bi bi-x-lg"></i></button>
          <div class="video-embed">
            <video ref="videoEl" :src="videoSrc" :poster="videoPoster" controls playsinline></video>
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
            <table class="interlab-table ensayos-table" style="min-width:700px;">
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
                    <span v-if="p.disponible" class="estado-abierto">Abierto</span>
                    <span v-else class="estado-cerrado">Cerrado</span>
                  </td>
                  <td>
                    <template v-if="p.disponible">
                      <button class="btn-carrito" @click="openCarritoModal(p)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="9" cy="21" r="1"/>
                          <circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                        </svg>
                        <span>Comprar</span>
                      </button>
                      <button class="btn-bilateral ms-2" @click="openBilateralModal(p)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
                        </svg>
                        <span>Solicitar</span>
                      </button>
                    </template>
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

    <!-- Programas de Interlaboratorio -->
    <section class="programs-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Programas</span>
          <h2 class="section-title">Nuestros Programas de Interlaboratorio</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Diseñamos programas específicos para cada disciplina de ensayo y calibración</p>
        </div>

        <div class="programs-grid">
          <div v-for="(program, idx) in programs" :key="program.id" class="program-card" data-aos="fade-up" :data-aos-delay="idx * 100">
            <div class="program-icon-wrap">
              <i :class="program.icon"></i>
            </div>
            <h4 class="program-title">{{ program.title }}</h4>
            <p class="program-description">{{ program.description }}</p>
            <div class="program-features">
              <span v-for="feature in program.features" :key="feature" class="feature-tag">{{ feature }}</span>
            </div>
            <div class="program-meta">
              <span><i class="bi bi-file-earmark-check"></i> {{ program.norma }}</span>
              <span><i class="bi bi-calendar-check"></i> {{ program.frecuencia }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Proceso de Participación -->
    <section class="process-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Proceso</span>
          <h2 class="section-title">Proceso de Participación</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Sigue estos pasos para unirte a nuestros programas de interlaboratorio</p>
        </div>

        <div class="process-timeline">
          <div class="process-item" v-for="(step, idx) in processSteps" :key="idx" data-aos="fade-up" :data-aos-delay="idx * 100">
            <div class="process-number">{{ String(idx + 1).padStart(2, '0') }}</div>
            <div class="process-content">
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>
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

    <!-- Formulario de Contacto -->
    <section class="contact-form-section" id="contact-form" ref="contactForm">
      <div class="container">
        <div class="form-wrapper" data-aos="fade-up">
          <div class="section-header text-center mb-4">
            <span class="section-eyebrow">Contacto</span>
            <h2 class="section-title">Solicita Información</h2>
            <div class="title-underline centered"></div>
            <p class="section-subtitle">Completa el formulario y nos pondremos en contacto para diseñar un programa adaptado a tus necesidades</p>
          </div>

          <form @submit.prevent="submitForm" class="interlaboratorio-form">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="nombre" class="form-label">Nombre completo *</label>
                <input v-model="form.nombre" type="text" id="nombre" class="form-control" :class="{ 'is-invalid': errors.nombre }" placeholder="Ingresa tu nombre" required>
                <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
              </div>
              <div class="col-md-6">
                <label for="empresa" class="form-label">Laboratorio / Empresa *</label>
                <input v-model="form.empresa" type="text" id="empresa" class="form-control" :class="{ 'is-invalid': errors.empresa }" placeholder="Nombre de tu organización" required>
                <div v-if="errors.empresa" class="invalid-feedback">{{ errors.empresa }}</div>
              </div>
              <div class="col-md-6">
                <label for="email" class="form-label">Correo electrónico *</label>
                <input v-model="form.email" type="email" id="email" class="form-control" :class="{ 'is-invalid': errors.email }" placeholder="correo@laboratorio.com" required>
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>
              <div class="col-md-6">
                <label for="telefono" class="form-label">Teléfono *</label>
                <input v-model="form.telefono" type="tel" id="telefono" class="form-control" :class="{ 'is-invalid': errors.telefono }" placeholder="+52 (XXX) XXX-XXXX" required>
                <div v-if="errors.telefono" class="invalid-feedback">{{ errors.telefono }}</div>
              </div>
              <div class="col-12">
                <label class="form-label">Área de interés *</label>
                <div class="areas-grid">
                  <div v-for="area in areas" :key="area.id" class="area-option" :class="{ selected: form.area === area.id }" @click="form.area = area.id">
                    <i :class="area.icon"></i>
                    <span>{{ area.name }}</span>
                  </div>
                </div>
                <div v-if="errors.area" class="text-danger small mt-2">{{ errors.area }}</div>
              </div>
              <div class="col-12">
                <label for="parametros" class="form-label">Parámetros específicos</label>
                <textarea v-model="form.parametros" id="parametros" class="form-control" rows="3" placeholder="Describe los parámetros o ensayos de interés..."></textarea>
              </div>
              <div class="col-12">
                <label for="requerimientos" class="form-label">Requerimientos específicos *</label>
                <textarea v-model="form.requerimientos" id="requerimientos" class="form-control" :class="{ 'is-invalid': errors.requerimientos }" rows="4" placeholder="Describe tus necesidades o requerimientos particulares..." required></textarea>
                <div v-if="errors.requerimientos" class="invalid-feedback">{{ errors.requerimientos }}</div>
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input v-model="form.privacidad" type="checkbox" id="privacidad" class="form-check-input" :class="{ 'is-invalid': errors.privacidad }" required>
                  <label for="privacidad" class="form-check-label">Acepto la política de privacidad *</label>
                  <div v-if="errors.privacidad" class="invalid-feedback d-block">{{ errors.privacidad }}</div>
                </div>
              </div>
              <div class="col-12">
                <button type="submit" class="contact-btn w-100" :disabled="isSubmitting">
                  <template v-if="isSubmitting">
                    <span class="spinner-border spinner-border-sm me-2"></span> Enviando...
                  </template>
                  <template v-else>
                    Enviar solicitud
                    <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </template>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">FAQ</span>
          <h2 class="section-title">Preguntas frecuentes</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Resolvemos tus dudas sobre programas de interlaboratorio</p>
        </div>

        <div class="faq-list">
          <div v-for="(faq, idx) in faqs" :key="faq.id" class="faq-item" :class="{ open: faq.open }" data-aos="fade-up" :data-aos-delay="idx * 100">
            <button class="faq-question" @click="toggleFaq(faq)">
              <span>{{ faq.pregunta }}</span>
              <i :class="faq.open ? 'bi bi-dash' : 'bi bi-plus'"></i>
            </button>
            <div v-if="faq.open" class="faq-answer">
              {{ faq.respuesta }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-wrapper" data-aos="fade-up">
          <div class="cta-content">
            <h2 class="cta-title">¿Listo para mejorar la calidad de tus análisis?</h2>
            <p class="cta-description">Únete a nuestros programas de interlaboratorio y garantiza la confiabilidad de tus resultados.</p>
          </div>
          <div class="cta-action">
            <button class="contact-btn" @click="scrollToForm">
              Solicitar información
              <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
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
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import heroInterlaboratorio from '@/image/Acreditaciones.png'
import type { Toast } from 'bootstrap'

type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

interface Program {
  id: number
  title: string
  description: string
  icon: string
  features: string[]
  norma: string
  frecuencia: string
}

interface Area {
  id: number
  name: string
  icon: string
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

const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

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
const API_BASE = (import.meta.env?.VITE_API_BASE as string) || 'http://localhost:3000'
const interlaboratorios = ref<any[]>([])
const cart = ref<number[]>([])

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

// Carrito modal (solicitar cotización)
const showCarritoModal = ref(false)
const selectedPrograma = ref<any | null>(null)
const cotForm = ref({ nombre: '', email: '', telefono: '' })

const openCarritoModal = (p: any) => {
  selectedPrograma.value = p
  showCarritoModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeCarritoModal = () => {
  showCarritoModal.value = false
  selectedPrograma.value = null
  document.body.style.overflow = ''
}

const solicitarCotizacion = async () => {
  if (!cotForm.value.nombre || !cotForm.value.email) { showToast('Completa nombre y correo', 'warning'); return }
  try {
    // Aquí se podría enviar al backend; por ahora simulamos envío
    await new Promise(resolve => setTimeout(resolve, 800))
    showToast('Solicitud enviada. Gracias.', 'success')
    cotForm.value = { nombre: '', email: '', telefono: '' }
    closeCarritoModal()
  } catch (e) {
    showToast('Error al enviar la solicitud', 'error')
  }
}

// Bilateral modal
const showBilateralModal = ref(false)

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

const programs: Program[] = [
  { id: 1, title: 'Agua', description: 'Análisis químicos y físico-químicos en agua potable y residual.', icon: 'bi bi-droplet-fill', features: ['Metales pesados', 'Físico-químicos', 'Turbidez'], norma: 'ISO/IEC 17043:2023', frecuencia: 'Trimestral' },
  { id: 2, title: 'Alimentos', description: 'Análisis microbiológicos y de contaminantes en matrices alimentarias.', icon: 'bi bi-basket-fill', features: ['Microbiología', 'Plaguicidas', 'Aditivos'], norma: 'ISO/IEC 17043:2023', frecuencia: 'Trimestral' },
  { id: 3, title: 'Calibración Dimensional', description: 'Comparación de mediciones dimensionales con trazabilidad internacional.', icon: 'bi bi-rulers', features: ['Longitud', 'Ángulo', 'Rugosidad', 'Geometría'], norma: 'ISO/IEC 17043:2023', frecuencia: 'Semestral' },
  { id: 4, title: 'Metrología Eléctrica', description: 'Programas para calibración de instrumentos eléctricos y electrónicos.', icon: 'bi bi-lightning-charge-fill', features: ['Resistencia', 'Voltaje', 'Corriente', 'Frecuencia'], norma: 'ISO/IEC 17043:2023', frecuencia: 'Trimestral' },
  { id: 5, title: 'Análisis Ambiental', description: 'Comparación de resultados en muestras ambientales y emisiones.', icon: 'bi bi-cloud-sun-fill', features: ['Aire', 'Suelo', 'Ruido', 'Vibraciones'], norma: 'ISO/IEC 17043:2023', frecuencia: 'Semestral' },
  { id: 6, title: 'Control de Calidad', description: 'Programas específicos para industrias farmacéutica, alimentaria y manufacturera.', icon: 'bi bi-clipboard-check', features: ['Validación métodos', 'Control estadístico', 'Auditorías internas'], norma: 'ISO/IEC 17043:2023', frecuencia: 'Anual' },
  { id: 7, title: 'Programas Personalizados', description: 'Diseñamos programas a medida según las necesidades específicas de tu laboratorio.', icon: 'bi bi-gear-fill', features: ['Diseño personalizado', 'Soporte técnico', 'Consultoría especializada'], norma: 'ISO/IEC 17043:2023', frecuencia: 'A convenir' },
  { id: 8, title: 'Consultoría', description: 'Asesoramiento especializado para mejorar la calidad y eficiencia de tu laboratorio.', icon: 'bi bi-person-badge-fill', features: ['Evaluación de procesos', 'Capacitación', 'Optimización de recursos'], norma: 'ISO/IEC 17043:2023', frecuencia: 'A convenir' }
]

const areas: Area[] = [
  { id: 1, name: 'Agua y Alimentos', icon: 'bi bi-droplet' },
  { id: 2, name: 'Calibración', icon: 'bi bi-rulers' },
  { id: 3, name: 'Medio Ambiente', icon: 'bi bi-cloud-sun' },
  { id: 4, name: 'Farmacéutica', icon: 'bi bi-capsule' },
  { id: 5, name: 'Clínica', icon: 'bi bi-heart-pulse' },
  { id: 6, name: 'Industrial', icon: 'bi bi-gear' },
  { id: 7, name: 'Investigación', icon: 'bi bi-search' },
  { id: 8, name: 'Otro', icon: 'bi bi-question-circle' }
]

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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-text: #1c2b14;
  --sena-muted: #5a6a52;
  --sena-border: rgba(93, 138, 47, 0.14);
  --radius-card: 20px;
  --shadow-sm: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  --shadow-green: 0 8px 28px rgba(93,138,47,0.22);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-display: 'Playfair Display', Georgia, serif;
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
  margin-top: 0.75rem;
}
.title-underline {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
  margin-top: 0.35rem;
}
.title-underline.centered { margin: 0.6rem auto 0; }

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
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
.btn-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.22s ease;
}
.contact-btn:hover .btn-arrow { transform: translateX(3px); }

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
.hero-subtitle strong { color: #ffffff35; font-weight: 700; }
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
.badge-item i { color: #ffffff; font-size: 0.85rem; }
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

/* Stats */
.stats-section {
  padding: 3.5rem 0;
  background: linear-gradient(135deg, #152d0a 0%, #0d2208 55%, #061604 100%);
  position: relative;
  overflow: hidden;
}
.stats-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 25% 50%, rgba(93,138,47,0.15) 0%, transparent 55%),
    radial-gradient(circle at 75% 50%, rgba(122,171,61,0.08) 0%, transparent 50%);
  pointer-events: none;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0;
  text-align: center;
  position: relative;
  z-index: 1;
}
.stat-item {
  padding: 1.75rem 1rem;
  border-right: 1px solid rgba(255,255,255,0.08);
}
.stat-item:last-child { border-right: none; }
.stat-number {
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 700;
  color: #a8d46a;
  line-height: 1;
  margin-bottom: 0.4rem;
}
.stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.62); letter-spacing: 0.3px; }

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

/* FAQ */
.faq-section {
  padding: 4rem 0;
  background: #ffffff;
}
[data-bs-theme="dark"] .faq-section { background: #0e1509; }
.faq-list { max-width: 800px; margin: 0 auto; }
.faq-item {
  border-bottom: 1px solid var(--sena-border);
}
.faq-question {
  width: 100%;
  padding: 1rem 0;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--sena-text);
  cursor: pointer;
  font-size: 0.95rem;
}
.faq-question i { font-size: 1.2rem; }
.faq-answer {
  padding: 0 0 1.25rem;
  font-size: 0.85rem;
  color: var(--sena-muted);
  line-height: 1.7;
}

/* CTA */
.cta-section {
  padding: 4rem 0;
  background: #fafaf8;
}
[data-bs-theme="dark"] .cta-section { background: #0c0f0a; }
.cta-wrapper {
  background: #ffffff;
  border-radius: 24px;
  padding: 2.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--sena-border);
}
[data-bs-theme="dark"] .cta-wrapper { background: #131a0e; }
.cta-title { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--sena-text); margin-bottom: 0.5rem; }
.cta-description { color: var(--sena-muted); font-size: 0.95rem; }

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
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
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
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
}
.descripcion-cell { max-width: 420px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  transition: var(--transition);
}
.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(93,138,47,0.25);
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

/* MODALES */
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
.modal-close:hover { background: #e74c3c; color: #fff }
.modal-body { padding: 2rem }
.modal-text { color: var(--sena-muted); line-height: 1.7; margin-bottom: 1rem }
.bilateral-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0
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
  background: rgba(93,138,47,0.15);
}
.bilateral-feature i { font-size: 1.2rem; color: var(--sena-green); }
.btn-contactar-bilateral {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.8rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
  justify-content: center
}
.btn-contactar-bilateral:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-green);
}

/* Carrito / botones de modal (paridad con EnsayoDetalle) */
.carrito-actions { display: flex; gap: 1rem; }
.btn-carrito {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
}
[data-bs-theme="light"] .btn-carrito { background: linear-gradient(135deg, #4a7a20, #5d8a2f); }
.btn-carrito:hover { transform: translateY(-2px); box-shadow: var(--shadow-green); }

.btn-cancelar { flex: 1; padding: 0.7rem; border: 2px solid var(--sena-border); background: transparent; border-radius: 50px; font-weight: 600; font-size: 0.9rem; color: var(--sena-muted); cursor: pointer; transition: var(--transition); }
[data-bs-theme="light"] .btn-cancelar { border-color: #c0d0b8; color: #4a5a42; }
.btn-cancelar:hover { background: #f1f3f0; border-color: var(--sena-muted); }

.btn-confirmar { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.7rem; background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light)); color: #ffffff; border: none; border-radius: 50px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: var(--transition); }
[data-bs-theme="light"] .btn-confirmar { background: linear-gradient(135deg, #4a7a20, #5d8a2f); }
.btn-confirmar:hover { transform: translateY(-2px); box-shadow: var(--shadow-green); }

.estado-abierto { padding: 6px 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; display: inline-block; background: rgba(122,171,61,0.12); color: var(--sena-green); border: 1px solid rgba(122,171,61,0.12); }
.estado-cerrado { padding: 6px 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; display: inline-block; background: rgba(204,62,47,0.12); color: var(--sena-red); border: 1px solid rgba(204,62,47,0.12); }

/* ============================================
   MEJORAS PARA MODO CLARO (contraste y visibilidad)
   ============================================ */
[data-bs-theme="light"] .program-card,
[data-bs-theme="light"] .video-card,
[data-bs-theme="light"] .form-wrapper,
[data-bs-theme="light"] .cta-wrapper,
[data-bs-theme="light"] .table-card {
  border-color: rgba(93, 138, 47, 0.25) !important;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08), 0 1px 6px rgba(0,0,0,0.04) !important;
}

[data-bs-theme="light"] .interlab-table thead th {
  background: rgba(93, 138, 47, 0.06);
  border-bottom: 2px solid rgba(93, 138, 47, 0.15);
}
[data-bs-theme="light"] .interlab-table tbody td {
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

/* Hero-card en modo claro */
[data-bs-theme="light"] .hero-card {
  background: rgba(255,255,255,0.92) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.6);
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
  background: rgba(93,138,47,0.08);
  border-color: rgba(93,138,47,0.2);
  color: var(--sena-green);
}
[data-bs-theme="light"] .hero-card .hero-card-icon {
  background: rgba(93,138,47,0.12);
  color: var(--sena-green);
}

/* Textos con mejor contraste en modo claro */
[data-bs-theme="light"] .program-description,
[data-bs-theme="light"] .benefit-content p,
[data-bs-theme="light"] .faq-answer,
[data-bs-theme="light"] .modal-text,
[data-bs-theme="light"] .video-card-body p.small {
  color: #2d3d24;
}

/* Botón outline en modo claro */
[data-bs-theme="light"] .outline-btn {
  border-color: var(--sena-green);
  color: var(--sena-green);
  background: rgba(255,255,255,0.7);
}
[data-bs-theme="light"] .outline-btn:hover {
  background: var(--sena-green-pale);
  color: var(--sena-text);
}

/* Modal en modo claro */
[data-bs-theme="light"] .modal-content {
  background: #ffffff;
  border: 1px solid rgba(93,138,47,0.2);
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
}
[data-bs-theme="light"] .modal-header {
  border-bottom-color: rgba(93,138,47,0.12);
}
[data-bs-theme="light"] .bilateral-feature {
  background: #f4f9ee;
  color: var(--sena-text);
}
[data-bs-theme="light"] .modal-close {
  background: #f0f5ea;
  color: var(--sena-text);
}
[data-bs-theme="light"] .modal-close:hover {
  background: #e74c3c;
  color: #fff;
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
  background: linear-gradient(135deg, rgba(93,138,47,0.08), rgba(122,171,61,0.04));
}

[data-bs-theme="light"] .status-text.abierto {
  background: rgba(93,138,47,0.1);
  color: #4a7a20;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title { font-size: 2.2rem; }
  .section-title { font-size: 2rem; }
  .form-wrapper { padding: 2rem 1.5rem; }
  .cta-wrapper { flex-direction: column; text-align: center; }
  .benefits-image { height: 260px; }
}

@media (max-width: 992px) {
  .video-card { flex-direction: column; }
  .video-thumbnail { width: 100%; max-width: 100%; height: 220px; }
  .interlab-table thead th:nth-child(2),
  .interlab-table td:nth-child(2) { display: none; }
  .interlab-table thead th:nth-child(3),
  .interlab-table td:nth-child(3) { display: none; }
  .interlab-table { font-size: 0.92rem; }
}

@media (max-width: 576px) {
  .hero-actions { flex-direction: column; }
  .hero-actions .outline-btn { text-align: center; }
  .programs-grid { grid-template-columns: 1fr; }
  .areas-grid { grid-template-columns: repeat(2, 1fr); }
  .bilateral-features { grid-template-columns: 1fr; }
  .table-header { flex-direction: column; align-items: flex-start !important; gap: 0.75rem; }
}
</style>
