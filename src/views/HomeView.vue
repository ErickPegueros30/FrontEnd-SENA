<template>
  <div :data-bs-theme="currentTheme" class="inicio-page">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">
                <span class="hero-highlight">Excelencia</span> en Ensayos de Aptitud
              </h1>
              <p class="hero-subtitle">
                Más de 12 años como proveedor acreditado de ensayos de aptitud bajo la norma
                <strong>ISO/IEC 17043:2023</strong>. Precisión, confiabilidad e innovación en cada análisis.
              </p>
              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-number">12+</span>
                  <span class="stat-label">Años de experiencia</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">8</span>
                  <span class="stat-label">Áreas de especialización</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">100+</span>
                  <span class="stat-label">Clientes satisfechos</span>
                </div>
              </div>
              <div class="hero-cta">
                <router-link to="/contacto" class="btn btn-primary btn-lg me-3">
                  <i class="bi bi-chat-dots me-2"></i>Solicitar Ensayo
                </router-link>
                <router-link to="/servicios" class="btn btn-outline-light btn-lg">
                  <i class="bi bi-list-check me-2"></i>Ver Servicios
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left" data-aos-delay="200">
            <div class="hero-image">
              <div class="floating-card card-1">
                <i class="bi bi-award-fill"></i>
                <h5>Acreditado</h5>
                <p>ISO/IEC 17043:2023</p>
              </div>
              <div class="floating-card card-2">
                <i class="bi bi-shield-check"></i>
                <h5>Garantía</h5>
                <p>Resultados confiables</p>
              </div>
              <div class="floating-card card-3">
                <i class="bi bi-globe2"></i>
                <h5>Reconocimiento</h5>
                <p>Internacional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios Destacados -->
    <section class="services-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Servicios Especializados</h2>
          <p class="section-subtitle">
            Ofrecemos ensayos de aptitud en múltiples disciplinas con los más altos estándares de calidad
          </p>
        </div>

        <div class="row g-4">
          <div
            v-for="(service, index) in services"
            :key="service.id"
            class="col-md-6 col-lg-4"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="index * 100"
          >
            <ServiceCard :service="service" :current-theme="currentTheme" />
          </div>
        </div>

        <div class="text-center mt-5" data-aos="fade-up">
          <router-link to="/servicios" class="btn btn-outline-primary btn-lg">
            <i class="bi bi-arrow-right me-2"></i>Ver todos los servicios
          </router-link>
        </div>
      </div>
    </section>

    <!-- Por qué elegirnos -->
    <section class="why-us-section py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
            <div class="why-us-image">
              <div class="image-overlay"></div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <h2 class="section-title mb-4">¿Por qué elegir SENA?</h2>

            <div class="features-list">
              <div class="feature-item" v-for="feature in features" :key="feature.id">
                <div class="feature-icon">
                  <i :class="feature.icon"></i>
                </div>
                <div class="feature-content">
                  <h5>{{ feature.title }}</h5>
                  <p class="mb-0">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <div class="d-flex align-items-center gap-3">
                <div class="trust-badge">
                  <i class="bi bi-shield-check"></i>
                  <span>100% Confiable</span>
                </div>
                <div class="trust-badge">
                  <i class="bi bi-clock-history"></i>
                  <span>Entrega oportuna</span>
                </div>
                <div class="trust-badge">
                  <i class="bi bi-headset"></i>
                  <span>Soporte técnico</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Acreditaciones -->
    <section class="accreditations-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title text-white">Acreditaciones y Certificaciones</h2>
          <p class="section-subtitle text-white-50">
            Reconocidos nacional e internacionalmente por nuestros estándares de calidad
          </p>
        </div>

        <div class="accreditations-wrapper">
          <div class="accreditations-left">
            <div class="accreditations-stack w-100">
              <!-- Top card (first accreditation) -->
              <div
                v-if="accreditations[0]"
                class="accreditation-item stacked"
                :data-aos="'fade-up'"
                :data-aos-delay="0"
              >
                <div class="accreditation-icon">
                  <i :class="accreditations[0].icon"></i>
                </div>
                <h5>{{ accreditations[0].title }}</h5>
                <p class="small mb-0">{{ accreditations[0].description }}</p>
              </div>

              <!-- Bottom card (second accreditation) -->
              <div
                v-if="accreditations[1]"
                class="accreditation-item stacked"
                :data-aos="'fade-up'"
                :data-aos-delay="100"
              >
                <div class="accreditation-icon">
                  <i :class="accreditations[1].icon"></i>
                </div>
                <h5>{{ accreditations[1].title }}</h5>
                <p class="small mb-0">{{ accreditations[1].description }}</p>
              </div>
            </div>
          </div>

          <div class="accreditations-right" data-aos="fade-left" data-aos-delay="200">
            <img v-if="emaLogo" :src="emaLogo" alt="Logo EMA" class="accreditation-logo" />
            <div v-else class="accreditation-logo-placeholder">EMA</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="testimonials-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Lo que dicen nuestros clientes</h2>
          <p class="section-subtitle">Clientes satisfechos que confían en nuestros servicios</p>
        </div>

        <div class="testimonials-slider" data-aos="fade-up">
          <div class="testimonial-item">
            <div class="testimonial-content">
              <i class="bi bi-quote"></i>
              <p class="testimonial-text">
                "SENA ha sido nuestro proveedor de ensayos de aptitud por más de 5 años.
                La calidad de sus servicios y la confiabilidad de sus resultados son excepcionales."
              </p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">JL</div>
              <div class="author-info">
                <h6 class="mb-1">Ing. Juan López</h6>
                <p class="small mb-0 text-muted">Laboratorio Químico Avanzado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center" data-aos="fade-up">
            <h2 class="cta-title mb-4">¿Listo para asegurar la calidad de tus análisis?</h2>
            <p class="cta-subtitle mb-4">
              Contáctanos hoy mismo y descubre cómo nuestros ensayos de aptitud pueden mejorar
              la precisión y confiabilidad de tus procesos.
            </p>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <router-link to="/contacto" class="btn btn-primary btn-lg">
                <i class="bi bi-telephone me-2"></i>Contactar ahora
              </router-link>
              <router-link to="/nosotros" class="btn btn-outline-primary btn-lg">
                <i class="bi bi-info-circle me-2"></i>Conócenos más
              </router-link>
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
        id="liveToast"
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
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import ServiceCard from '@/views/servicecard.vue'
// EMA logo (placed in src/image)
import emaLogo from '@/image/Logo EMA.svg'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning'

interface Service {
  id: number
  title: string
  description: string
  icon: string
  features: string[]
}

interface Feature {
  id: number
  title: string
  description: string
  icon: string
}

interface Accreditation {
  id: number
  title: string
  description: string
  icon: string
}

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Datos
const services: Service[] = [
  {
    id: 1,
    categoryId: 10,
    name: 'Agua y Alimentos',
    description: 'Análisis microbiológicos y químicos para garantizar la calidad y seguridad.',
    icon: 'bi bi-droplet',
    industries: [1, 2],
    standards: [17043],
    features: ['Cadmio', 'Cromo hexavalente', 'Cianuros', 'Fluoruros', 'Cloruros'],
    // popularity and certification removed
  },
  {
    id: 2,
    categoryId: 11,
    name: 'Masa y Temperatura',
    description: 'Calibración y verificación de instrumentos con patrones certificados.',
    icon: 'bi bi-thermometer-half',
    industries: [3],
    standards: [17025],
    features: ['Balanzas', 'Termómetros', 'Hornos', 'Baños termostatizados'],
    // popularity and certification removed
  },
  {
    id: 3,
    categoryId: 12,
    name: 'Volumen y Presión',
    description: 'Medición precisa y control de variables críticas en procesos industriales.',
    icon: 'bi bi-speedometer2',
    industries: [4],
    standards: [17025],
    features: ['Manómetros', 'Vacuómetros', 'Pipetas', 'Buretas', 'Probetas'],
    // popularity and certification removed
  },
  {
    id: 4,
    categoryId: 13,
    name: 'Dimensional',
    description: 'Mediciones exactas de dimensiones con tecnología de punta.',
    icon: 'bi bi-rulers',
    industries: [5],
    standards: [17025],
    features: ['Micrómetros', 'Calibradores', 'Bloques patrón', 'Instrumentos ópticos'],
    // popularity and certification removed
  },
  {
    id: 5,
    categoryId: 14,
    name: 'Humedad',
    description: 'Control y medición de condiciones ambientales para procesos específicos.',
    icon: 'bi bi-moisture',
    industries: [6],
    standards: [17043],
    features: ['Higrómetros', 'Analizadores', 'Cámaras climáticas', 'Sensores'],
    // popularity and certification removed
  },
  {
    id: 6,
    categoryId: 15,
    name: 'Eléctrica',
    description: 'Pruebas y mediciones eléctricas para garantizar seguridad y funcionalidad.',
    icon: 'bi bi-lightning-charge',
    industries: [7],
    standards: [17025],
    features: ['Multímetros', 'Fuentes', 'Osciloscopios', 'Analizadores'],
    // popularity and certification removed
  }
]

const features: Feature[] = [
  {
    id: 1,
    title: 'Acreditación Internacional',
    description: 'Certificados bajo la norma ISO/IEC 17043:2023, reconocida mundialmente.',
    icon: 'bi bi-award-fill'
  },
  {
    id: 2,
    title: 'Experiencia Comprobada',
    description: 'Más de 12 años brindando servicios de alta calidad a diversos sectores.',
    icon: 'bi bi-check-circle-fill'
  },
  {
    id: 3,
    title: 'Equipo de Expertos',
    description: 'Contamos con especialistas altamente capacitados en cada disciplina.',
    icon: 'bi bi-people-fill'
  },
  {
    id: 4,
    title: 'Tecnología de Punta',
    description: 'Utilizamos equipos de última generación para garantizar precisión.',
    icon: 'bi bi-cpu-fill'
  },
  {
    id: 5,
    title: 'Resultados Confiables',
    description: 'Garantizamos la trazabilidad e incertidumbre de todas las mediciones.',
    icon: 'bi bi-shield-check'
  },
  {
    id: 6,
    title: 'Servicio Personalizado',
    description: 'Atención especializada adaptada a las necesidades específicas de cada cliente.',
    icon: 'bi bi-headset'
  }
]

const accreditations: Accreditation[] = [
  {
    id: 1,
    title: 'ISO/IEC 17043:2023',
    description: 'Proveedor de ensayos de aptitud',
    icon: 'bi bi-file-earmark-check'
  },
  {
    id: 2,
    title: 'Reconocimiento EMA',
    description: 'Entidad Mexicana de Acreditación',
    icon: 'bi bi-building-check'
  }
]

// `emaLogo` is imported above; template will show placeholder if import fails

// Clases computadas para el toast
const toastClass = computed(() => {
  const classes: Record<ToastType, string> = {
    'success': 'bg-success text-white border-0',
    'info': 'bg-info text-white border-0',
    'warning': 'bg-warning border-0'
  }
  return classes[toastType.value] || 'bg-info text-white border-0'
})

const toastIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle',
    'info': 'bi bi-info-circle',
    'warning': 'bi bi-exclamation-triangle'
  }
  return icons[toastType.value] || 'bi bi-info-circle'
})

const toastBodyIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle-fill text-success',
    'info': 'bi bi-info-circle-fill text-info',
    'warning': 'bi bi-exclamation-triangle-fill text-warning'
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill text-info'
})

// Función para cambiar tema
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)

  // Mostrar notificación
  showNotification(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

// Función para mostrar notificaciones
const showNotification = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type

  if (toastInstance) {
    toastInstance.hide()
  }

  if (toastEl.value) {
    import('bootstrap').then((bootstrap) => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 3000 })
      toastInstance.show()
    })
  }
}

// Detectar preferencia del sistema
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

  // Escuchar cambios del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = e.matches ? 'dark' : 'light'
    }
  })

  // Animación de contadores
  animateCounters()
})

// Animación de contadores
const animateCounters = () => {
  const counters = document.querySelectorAll('.stat-number')
  counters.forEach(counter => {
    const target = parseInt(counter.textContent?.replace('+', '') || '0')
    let current = 0
    const increment = target / 50

    const updateCounter = () => {
      if (current < target) {
        current += increment
        counter.textContent = Math.floor(current) + (target > 100 ? '+' : '')
        setTimeout(updateCounter, 30)
      } else {
        counter.textContent = target + (target > 100 ? '+' : '')
      }
    }

    updateCounter()
  })
}
</script>

<style scoped>
.inicio-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .inicio-page {
  background: var(--gradient-bg);
}

/* Hero Section */
.hero-section {
  min-height: calc(100vh - var(--navbar-height, 0px));
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  position: relative;
  padding-top: calc(var(--navbar-height, 0px) + 20px);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.8) 0%, rgba(166, 184, 40, 0.6) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem 0;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
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

.hero-stats {
  display: flex;
  gap: 3rem;
  margin: 2rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
  margin-top: 0.5rem;
}

.hero-cta {
  margin-top: 2rem;
}

.hero-image {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  width: 180px;
  animation: float 6s ease-in-out infinite;
  top: auto;
  right: auto;
  bottom: auto;
  left: auto;
}

.floating-card i {
  font-size: 2.5rem;
  color: #FFD700;
  margin-bottom: 1rem;
}

.floating-card h5 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.floating-card p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  margin: 0;
}

.floating-card.card-1 { top: 18px; left: 12px; z-index: 30; }
.floating-card.card-2 { top: 18px; right: 12px; z-index: 25; }
.floating-card.card-3 { bottom: 18px; left: 50%; transform: translateX(-50%); z-index: 20; }
/* reduce overlap and ensure visual stacking */
.floating-card.card-1 i, .floating-card.card-2 i, .floating-card.card-3 i { color: #FFD700 }

/* On small screens avoid fixed background (better performance and layout) */
@media (max-width: 768px) {
  .hero-section {
    background-attachment: scroll;
    padding-top: calc(var(--navbar-height, 0px) + 8px);
  }

  /* Stack floating cards vertically on small screens */
  .floating-card {
    position: static;
    width: 100%;
    margin: 0.6rem 0;
    animation: none;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }

  .floating-card i { font-size: 1.8rem; }
}

/* Services Section */
.services-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .services-section {
  background: var(--lab-bg, #1a1a1a);
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

/* Why Us Section */
.why-us-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .why-us-section {
  background: var(--color-light, #121212);
}

.why-us-image {
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

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.feature-content h5 {
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.feature-content p {
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  margin: 0;
}

[data-bs-theme="dark"] .feature-content h5 {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .feature-content p {
  color: var(--color-gray, #6C757D);
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%));
  border-radius: 8px;
  border: 1px solid rgba(166, 184, 40, 0.2);
  color: var(--color-primary, #a6b828);
  font-weight: 500;
}

[data-bs-theme="dark"] .trust-badge {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.15) 0%, rgba(166, 184, 40, 0.1) 100%);
  color: var(--color-primary-light, #a6b828);
}

/* Accreditations Section */
.accreditations-section {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  color: white;
}

/* Ensure the section title is readable on the colored background */
.accreditations-section .section-title {
  background: none !important;
  -webkit-background-clip: initial !important;
  -webkit-text-fill-color: initial !important;
  color: #ffffff !important;
  text-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

.accreditations-grid {
  display: grid;
  /* force 3 columns so items appear 3 arriba / 3 abajo on desktop */
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

/* Responsive: 2 columns on medium, 1 column on small */
@media (max-width: 992px) {
  .accreditations-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 576px) {
  .accreditations-grid { grid-template-columns: 1fr; }
}

.accreditation-item {
  min-height: 120px; /* smaller cards */
}

.accreditation-item {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 1rem; /* reduced padding */
  text-align: center;
  transition: all 0.3s ease;
}

.accreditation-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.accreditation-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.25rem;
}

.accreditation-item h5 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
}

.accreditation-item p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* New layout: stacked accreditations left, EMA logo right */
.accreditations-layout {
  gap: 1.5rem;
  min-height: 320px; /* create vertical space so logo centers between cards */
}
.accreditations-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-between; /* top card at top, bottom card at bottom */
  width: 100%;
}
.accreditation-item.stacked {
  min-height: unset;
  padding: 1.5rem;
}
.accreditation-logo {
  max-width: 420px; /* larger logo */
  width: auto;
  height: auto;
  align-self: center;
  border-radius: 6px;
  background: transparent;
  padding: 0;
  display: block;
}
.accreditation-logo-placeholder {
  display:flex;
  align-items:center;
  justify-content:center;
  width: 220px;
  height: 120px;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  color: white;
  font-weight: 700;
}

@media (max-width: 991.98px) {
  .accreditation-logo, .accreditation-logo-placeholder {
    max-width: 300px;
  }
}

@media (max-width: 576px) {
  .accreditations-layout { display: block; }
  .accreditation-logo, .accreditation-logo-placeholder { margin: 1.5rem auto 0; }
}

/* Force two columns side-by-side from MD breakpoint using flex to avoid bootstrap wrapping issues */
@media (min-width: 768px) {
  .accreditations-layout { display: flex; align-items: center; gap: 1.5rem; }
  .accreditations-layout > .col-md-6, .accreditations-layout > .col-lg-6 { flex: 0 0 50%; max-width: 50%; }
  .accreditations-stack { justify-content: space-between; }
}

/* New wrapper-based layout to ensure stable two-column alignment */
.accreditations-wrapper {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.accreditations-left, .accreditations-right { flex: 1 1 50%; }
.accreditations-right { display: flex; justify-content: center; align-items: center; }

@media (max-width: 767.98px) {
  .accreditations-wrapper { flex-direction: column; }
  .accreditations-right { margin-top: 1rem; }
}

/* Ensure left stacked cards are vertically centered on taller layouts */
@media (min-width: 992px) {
  .accreditations-stack { min-height: 180px; }
}

/* Testimonials Section */
.testimonials-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .testimonials-section {
  background: var(--lab-bg, #1a1a1a);
}

.testimonials-slider {
  max-width: 800px;
  margin: 0 auto;
}

.testimonial-item {
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
}

[data-bs-theme="dark"] .testimonial-item {
  background: var(--color-light, #121212);
}

.testimonial-content {
  position: relative;
}

.testimonial-content i {
  position: absolute;
  top: -20px;
  left: -20px;
  font-size: 4rem;
  color: var(--color-primary, #a6b828);
  opacity: 0.2;
}

.testimonial-text {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--color-gray-dark, #495057);
  line-height: 1.6;
  margin-bottom: 2rem;
}

[data-bs-theme="dark"] .testimonial-text {
  color: var(--color-gray-dark, #ADB5BD);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
}

.author-info h6 {
  color: var(--color-dark, #212529);
  margin: 0;
  font-weight: 600;
}

[data-bs-theme="dark"] .author-info h6 {
  color: var(--color-dark, #F8F9FA);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%);
}

.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.1rem;
  color: var(--color-gray, #6C757D);
  max-width: 600px;
  margin: 0 auto;
}

[data-bs-theme="dark"] .cta-title {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .cta-subtitle {
  color: var(--color-gray, #6C757D);
}

/* Animaciones */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive */
@media (max-width: 991.98px) {
  .hero-section {
    padding-top: 140px;
  }

  .hero-title {
    font-size: 2.8rem;
  }

  .hero-stats {
    gap: 2rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .floating-card {
    width: 150px;
    padding: 1rem;
  }

  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .testimonial-item {
    padding: 1.5rem;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
  }

  .feature-icon {
    margin: 0 auto;
  }
}
</style>
