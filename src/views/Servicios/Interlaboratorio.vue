<template>
  <div :data-bs-theme="currentTheme" class="interlaboratorio-page">
    <!-- Hero Section -->
    <section class="interlaboratorio-hero">
      <div class="container">
        <div class="row align-items-center min-vh-60">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">
                Servicios de
                <span class="hero-highlight">Interlaboratorio</span>
              </h1>
              <p class="hero-subtitle">
                Programas de comparación interlaboratorio diseñados para evaluar y mejorar
                el desempeño de sus laboratorios bajo la norma <strong>ISO/IEC 17043:2023</strong>.
              </p>

              <div class="hero-features">
                <div class="feature-item">
                  <i class="bi bi-award"></i>
                  <span>Acreditación internacional</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Mejora continua</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-shield-check"></i>
                  <span>Validación de métodos</span>
                </div>
              </div>

              <div class="hero-cta">
                <button class="btn btn-success btn-lg me-3" @click="scrollToForm">
                  <i class="bi bi-clipboard-check me-2"></i>Solicitar programa
                </button>
                <router-link to="/contacto" class="btn btn-outline-light btn-lg">
                  <i class="bi bi-headset me-2"></i>Consultar especialista
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-card">
              <div class="card-icon">
                <i class="bi bi-clipboard-data"></i>
              </div>
              <h5>¿Por qué participar?</h5>
              <ul class="card-list">
                <li>Validar la competencia técnica</li>
                <li>Cumplir con requisitos de acreditación</li>
                <li>Identificar áreas de mejora</li>
                <li>Comparar resultados con pares</li>
              </ul>
              <div class="card-badge">
                <i class="bi bi-check-circle"></i>
                <span>Acreditado ISO 17043</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Estadísticas -->
    <section class="stats-section py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-3 col-6" data-aos="fade-up">
            <div class="stat-card">
              <div class="stat-number">12+</div>
              <div class="stat-label">Años de experiencia</div>
            </div>
          </div>
          <div class="col-md-3 col-6" data-aos="fade-up" data-aos-delay="100">
            <div class="stat-card">
              <div class="stat-number">200+</div>
              <div class="stat-label">Laboratorios participantes</div>
            </div>
          </div>
          <div class="col-md-3 col-6" data-aos="fade-up" data-aos-delay="200">
            <div class="stat-card">
              <div class="stat-number">98%</div>
              <div class="stat-label">Satisfacción de clientes</div>
            </div>
          </div>
          <div class="col-md-3 col-6" data-aos="fade-up" data-aos-delay="300">
            <div class="stat-card">
              <div class="stat-number">15+</div>
              <div class="stat-label">Países participantes</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios de Interlaboratorio -->
    <section class="services-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Nuestros Programas de Interlaboratorio</h2>
          <p class="section-subtitle">
            Diseñamos programas específicos para cada disciplina de ensayo y calibración
          </p>
        </div>

        <div class="row g-4">
          <div
            v-for="(program, index) in programs"
            :key="program.id"
            class="col-md-6 col-lg-4"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="index * 100"
          >
            <ProgramCard :program="program" :current-theme="currentTheme" />
          </div>
        </div>
      </div>
    </section>

    <!-- Proceso de Participación -->
    <section class="process-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Proceso de Participación</h2>
          <p class="section-subtitle">
            Sigue estos pasos para unirte a nuestros programas de interlaboratorio
          </p>
        </div>

        <div class="process-timeline">
          <div class="process-item" data-aos="fade-up">
            <div class="process-number">01</div>
            <div class="process-content">
              <h4>Inscripción</h4>
              <p>
                Completa el formulario de inscripción especificando
                los parámetros de interés y fechas requeridas.
              </p>
            </div>
          </div>

          <div class="process-item" data-aos="fade-up" data-aos-delay="100">
            <div class="process-number">02</div>
            <div class="process-content">
              <h4>Recepción de Material</h4>
              <p>
                Enviamos las muestras o materiales de prueba a tu laboratorio
                con instrucciones detalladas de análisis.
              </p>
            </div>
          </div>

          <div class="process-item" data-aos="fade-up" data-aos-delay="200">
            <div class="process-number">03</div>
            <div class="process-content">
              <h4>Análisis y Reporte</h4>
              <p>
                Realiza los análisis según protocolo establecido
                y reporta los resultados a través de nuestra plataforma.
              </p>
            </div>
          </div>

          <div class="process-item" data-aos="fade-up" data-aos-delay="300">
            <div class="process-number">04</div>
            <div class="process-content">
              <h4>Evaluación y Reporte Final</h4>
              <p>
                Procesamos estadísticamente los resultados y te enviamos
                un reporte comparativo detallado con gráficos y análisis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="benefits-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
            <div class="benefits-image">
              <div class="image-overlay"></div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <h2 class="section-title mb-4">Beneficios de Participar</h2>

            <div class="benefits-list">
              <div class="benefit-item">
                <div class="benefit-icon">
                  <i class="bi bi-clipboard-check"></i>
                </div>
                <div class="benefit-content">
                  <h5>Validación de Competencia</h5>
                  <p>
                    Demuestra la competencia técnica de tu laboratorio ante
                    autoridades de acreditación y clientes.
                  </p>
                </div>
              </div>

              <div class="benefit-item">
                <div class="benefit-icon">
                  <i class="bi bi-graph-up"></i>
                </div>
                <div class="benefit-content">
                  <h5>Mejora Continua</h5>
                  <p>
                    Identifica desviaciones y áreas de oportunidad para
                    implementar acciones correctivas y preventivas.
                  </p>
                </div>
              </div>

              <div class="benefit-item">
                <div class="benefit-icon">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div class="benefit-content">
                  <h5>Conformidad Normativa</h5>
                  <p>
                    Cumple con los requisitos de normas internacionales
                    como ISO/IEC 17025:2017 para evaluación externa.
                  </p>
                </div>
              </div>

              <div class="benefit-item">
                <div class="benefit-icon">
                  <i class="bi bi-trophy"></i>
                </div>
                <div class="benefit-content">
                  <h5>Ventaja Competitiva</h5>
                  <p>
                    Diferenciate en el mercado con certificados de participación
                    y buenos resultados en comparaciones interlaboratorio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Casos de Éxito -->
    <section class="case-studies-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Casos de Éxito</h2>
          <p class="section-subtitle">
            Laboratorios que han mejorado sus procesos con nuestros programas
          </p>
        </div>

        <div class="row g-4">
          <div class="col-lg-4" data-aos="fade-right">
            <div class="case-study-card">
              <div class="case-header">
                <div class="case-logo">LQA</div>
                <div class="case-info">
                  <h5>Laboratorio Químico Avanzado</h5>
                  <span class="case-tag">Análisis de Aguas</span>
                </div>
              </div>
              <div class="case-body">
                <p class="case-text">
                  "Participamos en el programa de interlaboratorio para metales pesados en agua.
                  Los resultados nos ayudaron a ajustar nuestros métodos y mejorar la incertidumbre
                  en un 15%."
                </p>
                <div class="case-metrics">
                  <div class="metric">
                    <span class="metric-value">95%</span>
                    <span class="metric-label">Conformidad</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">12</span>
                    <span class="metric-label">Meses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4" data-aos="fade-up">
            <div class="case-study-card">
              <div class="case-header">
                <div class="case-logo">CMM</div>
                <div class="case-info">
                  <h5>Centro de Metrología Mexicana</h5>
                  <span class="case-tag">Calibración Dimensional</span>
                </div>
              </div>
              <div class="case-body">
                <p class="case-text">
                  "La participación en programas de interlaboratorio nos permitió validar
                  nuestros patrones de calibración y obtener reconocimiento internacional
                  para nuestras mediciones."
                </p>
                <div class="case-metrics">
                  <div class="metric">
                    <span class="metric-value">98%</span>
                    <span class="metric-label">Consistencia</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">8</span>
                    <span class="metric-label">Rondas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4" data-aos="fade-left">
            <div class="case-study-card">
              <div class="case-header">
                <div class="case-logo">FARMA</div>
                <div class="case-info">
                  <h5>Laboratorios Farmacéuticos S.A.</h5>
                  <span class="case-tag">Control de Calidad</span>
                </div>
              </div>
              <div class="case-body">
                <p class="case-text">
                  "Los programas de interlaboratorio fueron clave para cumplir con los
                  requisitos de la FDA y mantener nuestra certificación GMP.
                  La retroalimentación estadística fue invaluable."
                </p>
                <div class="case-metrics">
                  <div class="metric">
                    <span class="metric-value">100%</span>
                    <span class="metric-label">Auditorías</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">24</span>
                    <span class="metric-label">Parámetros</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Formulario de Contacto -->
    <section class="contact-form-section py-5" id="contact-form" ref="contactForm">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="form-container" data-aos="fade-up">
              <div class="form-header text-center mb-5">
                <h2 class="form-title">Solicita Información</h2>
                <p class="form-subtitle">
                  Completa el formulario y nos pondremos en contacto para diseñar
                  un programa de interlaboratorio adaptado a tus necesidades
                </p>
              </div>

              <form @submit.prevent="submitForm" class="interlaboratorio-form">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="nombre" class="form-label">
                        <i class="bi bi-person me-1"></i>Nombre completo *
                      </label>
                      <input
                        v-model="form.nombre"
                        type="text"
                        id="nombre"
                        class="form-control"
                        :class="{ 'is-invalid': errors.nombre }"
                        placeholder="Ingresa tu nombre"
                        required
                      >
                      <div v-if="errors.nombre" class="invalid-feedback">
                        {{ errors.nombre }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="empresa" class="form-label">
                        <i class="bi bi-building me-1"></i>Laboratorio / Empresa *
                      </label>
                      <input
                        v-model="form.empresa"
                        type="text"
                        id="empresa"
                        class="form-control"
                        :class="{ 'is-invalid': errors.empresa }"
                        placeholder="Nombre de tu organización"
                        required
                      >
                      <div v-if="errors.empresa" class="invalid-feedback">
                        {{ errors.empresa }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email" class="form-label">
                        <i class="bi bi-envelope me-1"></i>Correo electrónico *
                      </label>
                      <input
                        v-model="form.email"
                        type="email"
                        id="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        placeholder="correo@laboratorio.com"
                        required
                      >
                      <div v-if="errors.email" class="invalid-feedback">
                        {{ errors.email }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="telefono" class="form-label">
                        <i class="bi bi-telephone me-1"></i>Teléfono *
                      </label>
                      <input
                        v-model="form.telefono"
                        type="tel"
                        id="telefono"
                        class="form-control"
                        :class="{ 'is-invalid': errors.telefono }"
                        placeholder="+52 (XXX) XXX-XXXX"
                        required
                      >
                      <div v-if="errors.telefono" class="invalid-feedback">
                        {{ errors.telefono }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="bi bi-list-check me-1"></i>Área de interés *
                      </label>
                      <div class="areas-grid">
                        <div
                          v-for="area in areas"
                          :key="area.id"
                          class="area-option"
                          :class="{ 'selected': form.area === area.id }"
                          @click="form.area = area.id"
                        >
                          <i :class="area.icon"></i>
                          <span>{{ area.name }}</span>
                        </div>
                      </div>
                      <div v-if="errors.area" class="text-danger small mt-2">
                        {{ errors.area }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-group">
                      <label for="parametros" class="form-label">
                        <i class="bi bi-clipboard-data me-1"></i>Parámetros específicos
                      </label>
                      <textarea
                        v-model="form.parametros"
                        id="parametros"
                        class="form-control"
                        rows="3"
                        placeholder="Describe los parámetros o ensayos de interés..."
                      ></textarea>
                      <small class="text-muted">
                        Ej: pH, conductividad, metales pesados, microbiología, etc.
                      </small>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-group">
                      <label for="requerimientos" class="form-label">
                        <i class="bi bi-chat-left-text me-1"></i>Requerimientos específicos *
                      </label>
                      <textarea
                        v-model="form.requerimientos"
                        id="requerimientos"
                        class="form-control"
                        :class="{ 'is-invalid': errors.requerimientos }"
                        rows="4"
                        placeholder="Describe tus necesidades o requerimientos particulares..."
                        required
                      ></textarea>
                      <div v-if="errors.requerimientos" class="invalid-feedback">
                        {{ errors.requerimientos }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-check">
                      <input
                        v-model="form.privacidad"
                        type="checkbox"
                        id="privacidad"
                        class="form-check-input"
                        :class="{ 'is-invalid': errors.privacidad }"
                        required
                      >
                      <label for="privacidad" class="form-check-label">
                        Acepto la <a href="#" class="text-primary">política de privacidad</a> y
                        autorizo el tratamiento de mis datos personales *
                      </label>
                      <div v-if="errors.privacidad" class="invalid-feedback d-block">
                        {{ errors.privacidad }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="d-grid">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg"
                        :disabled="isSubmitting"
                      >
                        <template v-if="isSubmitting">
                          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Enviando...
                        </template>
                        <template v-else>
                          <i class="bi bi-send me-2"></i>Solicitar programa
                        </template>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Preguntas frecuentes</h2>
          <p class="section-subtitle">Resolvemos tus dudas sobre programas de interlaboratorio</p>
        </div>

        <div class="row">
          <div class="col-lg-10 mx-auto">
            <div class="accordion" id="interlabFAQ">
              <div
                v-for="(faq, index) in faqs"
                :key="faq.id"
                class="accordion-item"
                :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
                :data-aos-delay="index * 100"
              >
                <h3 class="accordion-header">
                  <button
                    class="accordion-button"
                    :class="{ 'collapsed': index !== 0 }"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="`#faq${faq.id}`"
                    :aria-expanded="index === 0 ? 'true' : 'false'"
                    :aria-controls="`faq${faq.id}`"
                  >
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    {{ faq.pregunta }}
                  </button>
                </h3>
                <div
                  :id="`faq${faq.id}`"
                  class="accordion-collapse collapse"
                  :class="{ 'show': index === 0 }"
                  data-bs-parent="#interlabFAQ"
                >
                  <div class="accordion-body">
                    {{ faq.respuesta }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section py-5">
      <div class="container">
        <div class="cta-card">
          <div class="row align-items-center">
            <div class="col-lg-8 mb-4 mb-lg-0" data-aos="fade-right">
              <h3 class="cta-title">¿Listo para mejorar la calidad de tus análisis?</h3>
              <p class="cta-text">
                Únete a nuestros programas de interlaboratorio y garantiza la confiabilidad
                de tus resultados. Más de 200 laboratorios ya confían en nosotros.
              </p>
            </div>
            <div class="col-lg-4 text-lg-end" data-aos="fade-left">
              <button class="btn btn-light btn-lg" @click="scrollToForm">
                <i class="bi bi-clipboard-check me-2"></i>Solicitar información
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterComponent :current-theme="currentTheme" />

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        id="interlabToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastEl"
      >
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto">
            <i :class="toastIcon"></i> Notificación
          </strong>
          <small>Ahora mismo</small>
          <button
            type="button"
            class="btn-close"
            :class="toastType === 'success' ? 'btn-close-white' : ''"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body bg-body border border-opacity-25 rounded-bottom" :class="`border-${toastType}`">
          <div class="d-flex align-items-center">
            <i :class="toastBodyIcon" class="fs-5 me-2"></i>
            <span>{{ toastMessage }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import HeaderTop from '@/components/headertop/headertop.vue'
import NavbarMain from '@/components/NavBar/navbar.vue'
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import ProgramCard from '@/components/Servicios/ProgramCard.vue'
import type { Toast } from 'bootstrap'

// Tipos
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

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del formulario
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

// Datos
const programs: Program[] = [
  {
    id: 1,
    title: 'Agua y Alimentos',
    description: 'Programas para análisis microbiológicos, químicos y físicos en agua potable, residual y alimentos.',
    icon: 'bi bi-droplet',
    features: ['Metales pesados', 'Microbiología', 'Parámetros físico-químicos', 'Plaguicidas'],
    norma: 'ISO/IEC 17043:2023',
    frecuencia: 'Trimestral'
  },
  {
    id: 2,
    title: 'Calibración Dimensional',
    description: 'Comparación de mediciones dimensionales con trazabilidad internacional.',
    icon: 'bi bi-rulers',
    features: ['Longitud', 'Ángulo', 'Rugosidad', 'Geometría'],
    norma: 'ISO/IEC 17043:2023',
    frecuencia: 'Semestral'
  },
  {
    id: 3,
    title: 'Metrología Eléctrica',
    description: 'Programas para calibración de instrumentos eléctricos y electrónicos.',
    icon: 'bi bi-lightning-charge',
    features: ['Resistencia', 'Voltaje', 'Corriente', 'Frecuencia'],
    norma: 'ISO/IEC 17043:2023',
    frecuencia: 'Trimestral'
  },
  {
    id: 4,
    title: 'Análisis Ambiental',
    description: 'Comparación de resultados en muestras ambientales y emisiones.',
    icon: 'bi bi-cloud-sun',
    features: ['Aire', 'Suelo', 'Ruido', 'Vibraciones'],
    norma: 'ISO/IEC 17043:2023',
    frecuencia: 'Semestral'
  },
  {
    id: 5,
    title: 'Control de Calidad',
    description: 'Programas específicos para industrias farmacéutica, alimentaria y manufacturera.',
    icon: 'bi bi-clipboard-check',
    features: ['Validación métodos', 'Control estadístico', 'Auditorías internas'],
    norma: 'ISO/IEC 17043:2023',
    frecuencia: 'Anual'
  },
  {
    id: 6,
    title: 'Programas Personalizados',
    description: 'Diseñamos programas a medida según las necesidades específicas de tu laboratorio.',
    icon: 'bi bi-gear',
    features: ['Diseño personalizado', 'Soporte técnico', 'Consultoría especializada'],
    norma: 'ISO/IEC 17043:2023',
    frecuencia: 'A convenir'
  }
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

const faqs: FAQ[] = [
  {
    id: 1,
    pregunta: '¿Cuál es el costo de participación en los programas?',
    respuesta: 'Los costos varían según el tipo de programa, número de parámetros y frecuencia. Contáctanos para una cotización personalizada basada en tus necesidades específicas.'
  },
  {
    id: 2,
    pregunta: '¿Qué documentos recibo al participar?',
    respuesta: 'Recibirás: certificado de participación, reporte estadístico detallado, gráficos de comparación, evaluación de resultados y recomendaciones técnicas para mejora.'
  },
  {
    id: 3,
    pregunta: '¿Cuánto tiempo toma recibir los resultados?',
    respuesta: 'Los resultados preliminares se entregan en 15 días hábiles después del cierre de la ronda. El reporte final completo se entrega en 30 días hábiles.'
  },
  {
    id: 4,
    pregunta: '¿Puedo participar en múltiples programas?',
    respuesta: 'Sí, ofrecemos descuentos por volumen para laboratorios que participan en múltiples programas o parámetros.'
  },
  {
    id: 5,
    pregunta: '¿Los programas son reconocidos internacionalmente?',
    respuesta: 'Sí, todos nuestros programas están diseñados bajo la norma ISO/IEC 17043:2023 y son reconocidos por organismos de acreditación nacionales e internacionales.'
  }
]

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const toastClass = computed(() => {
  const classes: Record<ToastType, string> = {
    'success': 'bg-success text-white border-0',
    'info': 'bg-info text-white border-0',
    'warning': 'bg-warning text-dark border-0',
    'error': 'bg-danger text-white border-0'
  }
  return classes[toastType.value] || 'bg-info text-white border-0'
})

const toastIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle',
    'info': 'bi bi-info-circle',
    'warning': 'bi bi-exclamation-triangle',
    'error': 'bi bi-x-circle'
  }
  return icons[toastType.value] || 'bi bi-info-circle'
})

const toastBodyIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle-fill text-success',
    'info': 'bi bi-info-circle-fill text-info',
    'warning': 'bi bi-exclamation-triangle-fill text-warning',
    'error': 'bi bi-x-circle-fill text-danger'
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill text-info'
})

// Métodos
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)

  showToast(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

const scrollToForm = () => {
  contactForm.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!form.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es requerido'
    isValid = false
  }

  if (!form.value.empresa.trim()) {
    errors.value.empresa = 'El nombre de la empresa es requerido'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    errors.value.email = 'El email es requerido'
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Ingresa un email válido'
    isValid = false
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!form.value.telefono) {
    errors.value.telefono = 'El teléfono es requerido'
    isValid = false
  } else if (!phoneRegex.test(form.value.telefono)) {
    errors.value.telefono = 'Ingresa un teléfono válido'
    isValid = false
  }

  if (!form.value.area) {
    errors.value.area = 'Selecciona un área de interés'
    isValid = false
  }

  if (!form.value.requerimientos.trim()) {
    errors.value.requerimientos = 'Los requerimientos son obligatorios'
    isValid = false
  } else if (form.value.requerimientos.length < 20) {
    errors.value.requerimientos = 'Por favor, describe con más detalle tus requerimientos'
    isValid = false
  }

  if (!form.value.privacidad) {
    errors.value.privacidad = 'Debes aceptar la política de privacidad'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    showToast('Por favor, corrige los errores en el formulario', 'warning')
    return
  }

  isSubmitting.value = true

  try {
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Resetear formulario
    form.value = {
      nombre: '',
      empresa: '',
      email: '',
      telefono: '',
      area: null,
      parametros: '',
      requerimientos: '',
      privacidad: false
    }

    showToast('¡Solicitud enviada con éxito! Un especialista se pondrá en contacto contigo en menos de 24 horas.', 'success')
  } catch (error) {
    showToast('Error al enviar la solicitud. Por favor, inténtalo de nuevo.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const showToast = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type

  if (toastInstance) {
    toastInstance.hide()
  }

  if (toastEl.value) {
    import('bootstrap').then((bootstrap) => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 4000 })
      toastInstance.show()
    })
  }
}

const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = 'dark'
      localStorage.setItem('theme', 'dark')
    }
  }
}

onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Detectar tema del sistema
  detectSystemTheme()
})
</script>

<style scoped>
.interlaboratorio-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .interlaboratorio-page {
  background: linear-gradient(135deg, #121212 0%, #1A1A1A 100%);
}

/* Hero Section */
.interlaboratorio-hero {
  /* Fill the viewport minus the fixed navbar and vertically center content */
  min-height: calc(100vh - var(--navbar-height));
  display: flex;
  align-items: center;
  padding: 2.5rem 0;
  background: linear-gradient(rgba(166, 184, 40, 0.9), rgba(166, 184, 40, 0.9)),
              url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  color: white;
}

.breadcrumb-nav {
  margin-bottom: 2rem;
}

.breadcrumb {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin: 0;
}

.breadcrumb-item a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
}

.breadcrumb-item.active {
  color: white;
  font-weight: 500;
}

.breadcrumb-item + .breadcrumb-item::before {
  color: rgba(255, 255, 255, 0.5);
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-highlight {
  color: #FFD700;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
}

.hero-features {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
}

.feature-item i {
  font-size: 1.25rem;
  color: #FFD700;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  color: white;
}

.card-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: #FFD700;
}

.hero-card h5 {
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.card-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.card-list li {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.card-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #FFD700;
  font-weight: bold;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid #FFD700;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #FFD700;
  font-weight: 500;
}

/* Stats Section */
.stats-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .stats-section {
  background: var(--lab-bg, #1a1a1a);
}

.stat-card {
  text-align: center;
  padding: 2rem 1rem;
  background: var(--color-light, white);
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .stat-card {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  font-weight: 500;
}

/* Services Section */
.services-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .services-section {
  background: var(--color-light, #121212);
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--color-gray, #6C757D);
  max-width: 600px;
  margin: 0 auto;
}

[data-bs-theme="dark"] .section-subtitle {
  color: var(--color-gray, #6C757D);
}

/* Process Section */
.process-section {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.05) 0%, rgba(166, 184, 40, 0.03) 100%);
}

.process-timeline {
  max-width: 800px;
  margin: 0 auto;
}

.process-item {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;
}

.process-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 35px;
  top: 70px;
  bottom: -3rem;
  width: 2px;
  background: var(--color-primary, #a6b828);
  opacity: 0.3;
}

.process-number {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.process-content {
  flex: 1;
  padding-top: 0.5rem;
}

.process-content h4 {
  color: var(--color-dark, #212529);
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.process-content p {
  color: var(--color-gray, #6C757D);
  margin: 0;
  line-height: 1.6;
}

[data-bs-theme="dark"] .process-content h4 {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .process-content p {
  color: var(--color-gray, #6C757D);
}

/* Benefits Section */
.benefits-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .benefits-section {
  background: var(--lab-bg, #1a1a1a);
}

.benefits-image {
  height: 500px;
  border-radius: 12px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.3) 0%, rgba(166, 184, 40, 0.2) 100%);
  border-radius: 12px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.benefit-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.benefit-content h5 {
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.benefit-content p {
  color: var(--color-gray, #6C757D);
  margin: 0;
  line-height: 1.6;
}

[data-bs-theme="dark"] .benefit-content h5 {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .benefit-content p {
  color: var(--color-gray, #6C757D);
}

/* Case Studies */
.case-studies-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .case-studies-section {
  background: var(--color-light, #121212);
}

.case-study-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .case-study-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.case-study-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.case-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.case-logo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.case-info {
  flex: 1;
}

.case-info h5 {
  color: var(--color-dark, #212529);
  margin: 0 0 0.25rem 0;
  font-weight: 600;
}

.case-tag {
  display: inline-block;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%));
  color: var(--color-primary, #a6b828);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

[data-bs-theme="dark"] .case-info h5 {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .case-tag {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.15) 0%, rgba(166, 184, 40, 0.1) 100%);
  color: var(--color-primary-light, #a6b828);
}

.case-body {
  display: flex;
  flex-direction: column;
  height: calc(100% - 70px);
}

.case-text {
  color: var(--color-gray, #6C757D);
  line-height: 1.6;
  flex: 1;
  margin-bottom: 1.5rem;
}

.case-metrics {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary, #a6b828);
  line-height: 1;
}

.metric-label {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  margin-top: 0.25rem;
}

/* Contact Form */
.contact-form-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .contact-form-section {
  background: var(--lab-bg, #1a1a1a);
}

.form-container {
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .form-container {
  background: var(--color-light, #121212);
}

.form-header {
  margin-bottom: 2rem;
}

.form-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
}

.form-subtitle {
  color: var(--color-gray, #6C757D);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

[data-bs-theme="dark"] .form-title {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .form-subtitle {
  color: var(--color-gray, #6C757D);
}

.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.area-option {
  background: var(--card-bg, white);
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

[data-bs-theme="dark"] .area-option {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.area-option:hover {
  border-color: var(--color-primary, #a6b828);
  transform: translateY(-2px);
}

.area-option.selected {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-color: transparent;
  color: white;
}

.area-option i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.area-option.selected i {
  color: white;
}

.area-option span {
  font-size: 0.85rem;
  font-weight: 500;
}

/* FAQ Section */
.faq-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .faq-section {
  background: var(--color-light, #121212);
}

.accordion-item {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

[data-bs-theme="dark"] .accordion-item {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.accordion-button {
  background: var(--color-light, white);
  color: var(--color-dark, #212529);
  font-weight: 600;
  padding: 1.25rem 1.5rem;
  border: none;
  box-shadow: none;
}

[data-bs-theme="dark"] .accordion-button {
  background: var(--color-light, #121212);
  color: var(--color-dark, #F8F9FA);
}

.accordion-button:not(.collapsed) {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  color: white;
}

.accordion-button:not(.collapsed) i {
  color: white;
}

.accordion-body {
  padding: 1.5rem;
  color: var(--color-gray, #6C757D);
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
}

.cta-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 3rem;
  color: white;
}

.cta-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 991.98px) {
  .interlaboratorio-hero {
    min-height: calc(100vh - var(--navbar-height));
    padding: 2rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .form-container {
    padding: 2rem;
  }

  .process-item {
    flex-direction: column;
    gap: 1rem;
  }

  .process-item:not(:last-child)::after {
    left: 35px;
    top: 70px;
    bottom: -3rem;
    height: calc(100% + 3rem);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .form-title {
    font-size: 2rem;
  }

  .areas-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-card {
    padding: 2rem;
  }

  .cta-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .interlaboratorio-hero {
    min-height: calc(100vh - var(--navbar-height));
    padding: 1.5rem 0;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .areas-grid {
    grid-template-columns: 1fr;
  }

  .hero-features {
    flex-direction: column;
    gap: 1rem;
  }

  .hero-cta {
    flex-direction: column;
  }

  .hero-cta .btn {
    width: 100%;
  }

  .cta-card {
    padding: 1.5rem;
  }

  .cta-section .btn {
    width: 100%;
  }
}
</style>
