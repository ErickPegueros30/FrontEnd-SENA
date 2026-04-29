<template>
  <div :data-bs-theme="currentTheme" class="servicios-page">
    <!-- Hero Section -->
    <section class="servicios-hero">
      <div class="container">
        <div class="row align-items-center min-vh-70">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Nuestros Servicios</h1>
              <p class="hero-subtitle">
                Más de 12 años de experiencia en ensayos de aptitud y análisis de calidad.
                Ofrecemos servicios acreditados bajo la norma <strong>ISO/IEC 17043:2023</strong>
                para garantizar la máxima precisión y confiabilidad.
              </p>
              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-number">8</span>
                  <span class="stat-label">Áreas de especialización</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">50+</span>
                  <span class="stat-label">Tipos de ensayos</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">100%</span>
                  <span class="stat-label">Resultados confiables</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left" data-aos-delay="200">
            <div class="hero-certification">
              <div class="certification-card">
                <i class="bi bi-award-fill"></i>
                <h4>Acreditación ISO/IEC 17043:2023</h4>
                <p class="mb-0">Proveedor de ensayos de aptitud</p>
                <small>Vigente desde 2011</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios Destacados -->
    <section class="featured-services-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Servicios Destacados</h2>
          <p class="section-subtitle">Accede rápidamente a la información completa sobre nuestros principales servicios</p>
        </div>

        <div class="row g-4">
          <div class="col-md-4" data-aos="fade-up">
            <div class="feature-card h-100">
              <div class="feature-icon"><i class="bi bi-mortarboard"></i></div>
              <h5>Capacitación y Cursos</h5>
              <p class="mb-3">Programas de formación en metrología, capacitación presencial y online adaptados a tus necesidades.</p>
              <router-link to="/cursos" class="stretched-link">Ver detalles</router-link>
            </div>
          </div>

          <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
            <div class="feature-card h-100">
              <div class="feature-icon"><i class="bi bi-file-earmark-text"></i></div>
              <h5>Ensayos de Aptitud</h5>
              <p class="mb-3">Programas de ensayos de aptitud acreditados para evaluar la competencia técnica de laboratorios.</p>
              <router-link to="/ensayos" class="stretched-link">Ver detalles</router-link>
            </div>
          </div>

          <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <div class="feature-card h-100">
              <div class="feature-icon"><i class="bi bi-people-fill"></i></div>
              <h5>Interlaboratorio</h5>
              <p class="mb-3">Programas interlaboratorio para comparaciones externas y aseguramiento de la calidad.</p>
              <router-link to="/interlaboratorio" class="stretched-link">Ver detalles</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categorías de Servicios -->
    <section class="categories-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Categorías de Servicios</h2>
          <p class="section-subtitle">
            Selecciona una categoría para explorar nuestros servicios especializados
          </p>
        </div>

        <div class="categories-grid">
          <div
            v-for="(category, index) in categories"
            :key="category.id"
            class="category-card"
            :class="{ 'active': activeCategory === category.id }"
            @click="setActiveCategory(category.id)"
            :data-aos="getAnimationClass(index)"
            :data-aos-delay="index % 3 * 100"
          >
            <div class="category-icon">
              <i :class="category.icon"></i>
            </div>
            <h4 class="category-title">{{ category.title }}</h4>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-count">
              <span>{{ category.services.length }} servicios</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Proceso de Trabajo -->
    <section class="process-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title text-white">Nuestro Proceso de Trabajo</h2>
          <p class="section-subtitle text-white-50">
            Garantizamos excelencia en cada etapa del proceso
          </p>
        </div>

        <div class="process-timeline">
          <div
            v-for="(step, index) in processSteps"
            :key="step.id"
            class="process-step"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="index * 100"
          >
            <div class="step-number">{{ step.id }}</div>
            <div class="step-content">
              <div class="step-icon">
                <i :class="step.icon"></i>
              </div>
              <h5 class="step-title">{{ step.title }}</h5>
              <p class="step-description">{{ step.description }}</p>
              <ul class="step-features">
                <li v-for="feature in step.features" :key="feature">
                  <i class="bi bi-check-circle"></i> {{ feature }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios de Servicios -->
    <section class="testimonials-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Experiencias de Nuestros Clientes</h2>
          <p class="section-subtitle">Clientes satisfechos con nuestros servicios especializados</p>
        </div>

        <div class="row g-4">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="testimonial.id"
            class="col-md-4"
            :data-aos="getTestimonialAnimation(index)"
            :data-aos-delay="index * 100"
          >
            <TestimonialCard
              :testimonial="testimonial"
              :current-theme="currentTheme"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-5">
      <div class="container">
        <div class="cta-card" data-aos="fade-up">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h2 class="cta-title">¿Necesitas un servicio específico?</h2>
              <p class="cta-description">
                Contamos con soluciones personalizadas para tus necesidades.
                Nuestro equipo de expertos está listo para asesorarte.
              </p>
              <div class="cta-features">
                <div class="feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Cotización sin costo</span>
                </div>
                <div class="feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Asesoría técnica especializada</span>
                </div>
                <div class="feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Resultados garantizados</span>
                </div>
              </div>
            </div>
            <div class="col-lg-4 text-lg-end">
              <router-link to="/contacto" class="btn btn-light btn-lg">
                <i class="bi bi-chat-dots me-2"></i>Solicitar Cotización
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
        id="servicesToast"
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
import ServiceCard from '@/views/servicecard.vue'
import TestimonialCard from '@/views/TestimonioCard.vue'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning'
type ViewMode = 'grid' | 'list'
type SortOption = 'name'

interface Service {
  id: number
  categoryId: number
  name: string
  description: string
  icon: string
  industries: number[]
  standards: number[]
  features: string[]
  // popularity and certification removed
  // price, duration and deliveryTime removed intentionally
}

interface Category {
  id: number
  title: string
  description: string
  icon: string
  services: number[]
}

interface Industry {
  id: number
  name: string
  count: number
}

interface Standard {
  id: number
  name: string
  count: number
}

interface ProcessStep {
  id: number
  title: string
  description: string
  icon: string
  features: string[]
}

interface Testimonial {
  id: number
  name: string
  position: string
  company: string
  service: string
  content: string
  rating: number
  date: string
}

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado de la página
const activeCategory = ref<number | null>(null)
const viewMode = ref<ViewMode>('grid')
const sortBy = ref<SortOption>('name')
const currentPage = ref(1)
const itemsPerPage = ref(8)

// Filtros
const selectedIndustries = ref<number[]>([])
const selectedStandards = ref<number[]>([])

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Datos
const categories: Category[] = [
  {
    id: 1,
    title: 'Agua y Alimentos',
    description: 'Análisis microbiológicos y químicos para garantizar calidad y seguridad',
    icon: 'bi bi-droplet',
    services: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 2,
    title: 'Masa y Temperatura',
    description: 'Calibración y verificación de instrumentos de medición',
    icon: 'bi bi-thermometer-half',
    services: [7, 8, 9, 10, 11]
  },
  {
    id: 3,
    title: 'Volumen y Presión',
    description: 'Medición y control de variables en procesos industriales',
    icon: 'bi bi-speedometer2',
    services: [12, 13, 14, 15, 16]
  },
  {
    id: 4,
    title: 'Dimensional',
    description: 'Mediciones exactas con tecnología de punta',
    icon: 'bi bi-rulers',
    services: [17, 18, 19, 20]
  },
  {
    id: 5,
    title: 'Humedad',
    description: 'Control de condiciones ambientales para procesos específicos',
    icon: 'bi bi-moisture',
    services: [21, 22, 23]
  },
  {
    id: 6,
    title: 'Eléctrica',
    description: 'Pruebas y mediciones eléctricas para garantizar seguridad',
    icon: 'bi bi-lightning-charge',
    services: [24, 25, 26, 27]
  },
  {
    id: 7,
    title: 'Densidad',
    description: 'Análisis de materiales y sustancias con precisión',
    icon: 'bi bi-water',
    services: [28, 29, 30]
  },
  {
    id: 8,
    title: 'Metrología Avanzada',
    description: 'Tecnología de punta en medición y calibración',
    icon: 'bi bi-cpu',
    services: [31, 32, 33, 34]
  }
]

const services: Service[] = [
  // Agua y Alimentos (1-6)
  {
    id: 1,
    categoryId: 1,
    name: 'Análisis de Cadmio en Agua',
    description: 'Determinación de cadmio por espectrofotometría de absorción atómica',
    icon: 'bi bi-droplet',
      industries: [1, 2, 3],
      standards: [1, 2],
    features: ['Límite de detección 0.01 mg/L', 'Acreditado EMA', 'Certificado de calidad']
  },
  {
    id: 2,
    categoryId: 1,
    name: 'Determinación de Cromo Hexavalente',
    description: 'Análisis por cromatografía iónica con detección UV-Vis',
    icon: 'bi bi-droplet',
    industries: [1, 2, 4],
    standards: [1, 3],
    features: ['Límite 0.05 mg/L', 'Validación completa', 'Traza documental']
  },
  {
    id: 3,
    categoryId: 1,
    name: 'Análisis de Cianuros Totales',
    description: 'Determinación por método de destilación y espectrofotometría',
    icon: 'bi bi-droplet',
    industries: [2, 3, 5],
    standards: [1, 4],
    features: ['Rango 0.01-10 mg/L', 'Control de calidad riguroso', 'Informe detallado']
  },
  // ... más servicios (agregar 31 más para completar)
  {
    id: 34,
    categoryId: 8,
    name: 'Calibración de Analizadores de Gases',
    description: 'Calibración de analizadores para control de emisiones',
    icon: 'bi bi-cpu',
    industries: [4, 5, 6],
    standards: [2, 5, 6],
    features: ['Rastreabilidad NIST', 'Certificado de calibración', 'Asesoría técnica']
  }
]

const industries: Industry[] = [
  { id: 1, name: 'Alimentaria', count: 12 },
  { id: 2, name: 'Farmacéutica', count: 8 },
  { id: 3, name: 'Química', count: 15 },
  { id: 4, name: 'Automotriz', count: 7 },
  { id: 5, name: 'Electrónica', count: 6 },
  { id: 6, name: 'Ambiental', count: 10 }
]

const standards: Standard[] = [
  { id: 1, name: 'ISO/IEC 17025', count: 25 },
  { id: 2, name: 'ISO 9001', count: 18 },
  { id: 3, name: 'ISO 14001', count: 12 },
  { id: 4, name: 'ISO 45001', count: 8 },
  { id: 5, name: 'FDA', count: 6 },
  { id: 6, name: 'NOM', count: 20 }
]

const sortOptions = [
  { id: 'name', label: 'Nombre A-Z' }
]

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Consulta y Evaluación',
    description: 'Analizamos tus necesidades y requerimientos específicos',
    icon: 'bi bi-chat-left-text',
    features: ['Diagnóstico inicial', 'Propuesta técnica', 'Cotización detallada']
  },
  {
    id: 2,
    title: 'Planificación',
    description: 'Desarrollamos un plan de trabajo personalizado',
    icon: 'bi bi-calendar-check',
    features: ['Cronograma detallado', 'Asignación de recursos', 'Protocolos de trabajo']
  },
  {
    id: 3,
    title: 'Ejecución',
    description: 'Realizamos los análisis con equipos certificados',
    icon: 'bi bi-gear',
    features: ['Procedimientos acreditados', 'Control de calidad', 'Documentación en tiempo real']
  },
  {
    id: 4,
    title: 'Validación',
    description: 'Verificamos la precisión y confiabilidad de los resultados',
    icon: 'bi bi-check-circle',
    features: ['Revisión por pares', 'Validación estadística', 'Garantía de calidad']
  },
  {
    id: 5,
    title: 'Entrega',
    description: 'Proporcionamos resultados certificados y asesoría post-servicio',
    icon: 'bi bi-file-earmark-text',
    features: ['Informe detallado', 'Certificado de análisis', 'Soporte técnico']
  }
]

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ing. Ricardo Martínez',
    position: 'Director de Calidad',
    company: 'Laboratorios Químicos del Norte',
    service: 'Análisis de Agua',
    content: 'La precisión de los resultados y la rapidez en la entrega han sido excepcionales. SENA es nuestro proveedor confiable desde hace 5 años.',
    rating: 5,
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'Dra. Ana López',
    position: 'Investigadora Principal',
    company: 'Instituto de Biotecnología',
    service: 'Calibración de Equipos',
    content: 'La trazabilidad de las mediciones y la documentación completa nos han permitido publicar nuestros resultados con total confianza.',
    rating: 5,
    date: '2024-02-10'
  },
  {
    id: 3,
    name: 'Mtro. Carlos Rodríguez',
    position: 'Supervisor de Producción',
    company: 'Manufacturas Industriales S.A.',
    service: 'Ensayo de Aptitud',
    content: 'El soporte técnico y la asesoría especializada han mejorado significativamente nuestros procesos de control de calidad.',
    rating: 4,
    date: '2024-03-05'
  }
]

// Computed
const activeCategoryData = computed(() => {
  if (!activeCategory.value) return null
  return categories.find(c => c.id === activeCategory.value)
})

const filteredServices = computed(() => {
  let filtered = services

  // Filtrar por categoría
  if (activeCategory.value) {
    filtered = filtered.filter(s => s.categoryId === activeCategory.value)
  }

  // Filtrar por industria
  if (selectedIndustries.value.length > 0) {
    filtered = filtered.filter(s =>
      s.industries.some(ind => selectedIndustries.value.includes(ind))
    )
  }

  // Filtrar por normas
  if (selectedStandards.value.length > 0) {
    filtered = filtered.filter(s =>
      s.standards.some(std => selectedStandards.value.includes(std))
    )
  }

  // deliveryTime filter removed

  return filtered
})

const sortedServices = computed(() => {
  const sorted = [...filteredServices.value]

  if (sortBy.value === 'name') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }

  return sorted
})

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedServices.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredServices.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5

  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    let start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = end - maxVisible + 1
    }

    for (let i = start; i <= end; i++) pages.push(i)
  }

  return pages
})

const hasActiveFilters = computed(() => {
    return selectedIndustries.value.length > 0 ||
      selectedStandards.value.length > 0
})

const activeFiltersCount = computed(() => {
    return selectedIndustries.value.length +
      selectedStandards.value.length
})

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

// Métodos
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)

  showToast(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

const setActiveCategory = (categoryId: number) => {
  activeCategory.value = activeCategory.value === categoryId ? null : categoryId
  currentPage.value = 1
}

const filterServices = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  selectedIndustries.value = []
  selectedStandards.value = []
  showToast('Filtros limpiados correctamente', 'success')
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getAnimationClass = (index: number): string => {
  const animations = ['fade-up', 'fade-right', 'fade-left', 'zoom-in']
  return animations[index % animations.length]
}

const getTestimonialAnimation = (index: number): string => {
  const animations = ['fade-up', 'fade-right', 'fade-left']
  return animations[index % animations.length]
}

const showToast = (message: string, type: ToastType = 'info') => {
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
})
</script>

<style scoped>
.servicios-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .servicios-page {
  background: var(--gradient-bg);
}

/* Hero Section */
.servicios-hero {
  min-height: 70vh;
  background: linear-gradient(rgba(166, 184, 40, 0.9), rgba(166, 184, 40, 0.9)),
              url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding-top: 180px;
  position: relative;
}

.min-vh-70 {
  min-height: 70vh;
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

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
}

.hero-subtitle strong {
  color: #FFD700;
}

.hero-stats {
  display: flex;
  gap: 3rem;
  margin: 2rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFD700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
  max-width: 120px;
}

.hero-certification {
  position: relative;
  z-index: 2;
}

.certification-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  color: white;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.certification-card i {
  font-size: 3rem;
  color: #FFD700;
  margin-bottom: 1rem;
}

.certification-card h4 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.certification-card p {
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.certification-card small {
  opacity: 0.7;
  font-size: 0.85rem;
}

/* Categories Section */
.categories-section {
  background: var(--color-light, white);
  position: relative;
}

[data-bs-theme="dark"] .categories-section {
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: var(--card-bg, white);
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

[data-bs-theme="dark"] .category-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.category-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary, #a6b828);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.category-card.active {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-color: transparent;
  color: white;
}

.category-card.active .category-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.category-card.active .category-title,
.category-card.active .category-description,
.category-card.active .category-count span {
  color: white;
}

.category-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
  transition: all 0.3s ease;
}

.category-title {
  color: var(--color-dark, #212529);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

[data-bs-theme="dark"] .category-title {
  color: var(--color-dark, #F8F9FA);
}

.category-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

.category-count {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
}

.category-count span {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #a6b828);
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .category-count span {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.15) 0%, rgba(166, 184, 40, 0.1) 100%);
  color: var(--color-primary-light, #a6b828);
}

/* Services Section */
.services-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .services-section {
  background: var(--lab-bg, #1a1a1a);
}

/* Sidebar */
.services-sidebar {
  position: sticky;
  top: 100px;
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] .services-sidebar {
  background: var(--color-light, #121212);
  border-color: var(--color-gray-light, #2d2d2d);
}

.sidebar-title {
  color: var(--color-dark, #212529);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-primary, #a6b828);
}

[data-bs-theme="dark"] .sidebar-title {
  color: var(--color-dark, #F8F9FA);
}

.filter-group {
  margin-bottom: 2rem;
}

.filter-title {
  color: var(--color-dark, #212529);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .filter-title {
  color: var(--color-dark, #F8F9FA);
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.filter-item:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .filter-item:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.07) 100%);
}

.filter-label {
  color: var(--color-gray-dark, #495057);
  font-size: 0.9rem;
  margin-left: 0.5rem;
  flex: 1;
}

[data-bs-theme="dark"] .filter-label {
  color: var(--color-gray-dark, #ADB5BD);
}

.filter-count {
  background: var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  min-width: 24px;
  text-align: center;
}

[data-bs-theme="dark"] .filter-count {
  background: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray, #6C757D);
}

.form-check-input:checked {
  background-color: var(--color-primary, #a6b828);
  border-color: var(--color-primary, #a6b828);
}

.filter-info {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%));
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(166, 184, 40, 0.2);
}

[data-bs-theme="dark"] .filter-info {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.15) 0%, rgba(166, 184, 40, 0.1) 100%);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item i {
  color: var(--color-primary, #a6b828);
  font-size: 1.25rem;
}

.info-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
}

.info-value {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-left: 0.5rem;
}

[data-bs-theme="dark"] .info-value {
  color: var(--color-dark, #F8F9FA);
}

/* Services Header */
.services-header {
  background: var(--color-light, white);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .services-header {
  background: var(--color-light, #121212);
  border-color: var(--color-gray-light, #2d2d2d);
}

.services-category-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .services-category-title {
  color: var(--color-dark, #F8F9FA);
}

.services-category-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  margin: 0;
}

/* Services Grid/List */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.service-card-wrapper {
  height: 100%;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-list-item {
  width: 100%;
}

/* No Results */
.no-results {
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 3rem;
  border: 2px dashed var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .no-results {
  background: var(--color-light, #121212);
  border-color: var(--color-gray-light, #2d2d2d);
}

.no-results-icon {
  width: 80px;
  height: 80px;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--color-primary, #a6b828);
  font-size: 2rem;
}

[data-bs-theme="dark"] .no-results-icon {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

/* Pagination */
.services-pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-color: transparent;
  color: white;
}

.services-pagination .page-link {
  color: var(--color-primary, #a6b828);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  margin: 0 0.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .services-pagination .page-link {
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-primary-light, #a6b828);
}

.services-pagination .page-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #a6b828);
}

[data-bs-theme="dark"] .services-pagination .page-link:hover {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.15) 0%, rgba(166, 184, 40, 0.1) 100%);
}

/* Featured Services */
.featured-services-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .featured-services-section {
  background: var(--color-light, #121212);
}

.feature-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  text-align: left;
  transition: all 0.25s ease;
  position: relative;
}

[data-bs-theme="dark"] .feature-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.08);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card h5 {
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--color-gray, #6C757D);
}

.feature-card .stretched-link {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  color: var(--color-primary, #a6b828);
  font-weight: 700;
}

/* Process Section */
.process-section {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.process-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
}

.process-timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}

.process-timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%);
}

.process-step {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
}

.process-step:nth-child(odd) {
  flex-direction: row;
}

.process-step:nth-child(even) {
  flex-direction: row-reverse;
}

.step-number {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a6b828;
  font-size: 1.5rem;
  font-weight: 700;
  z-index: 2;
  flex-shrink: 0;
  margin: 0 2rem;
}

.step-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
}

.step-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.step-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.step-description {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.step-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.step-features li {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.step-features li i {
  color: #FFD700;
}

/* Testimonials Section */
.testimonials-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .testimonials-section {
  background: var(--color-light, #121212);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%);
}

.cta-card {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 15px;
  padding: 3rem;
  color: white;
  box-shadow: 0 15px 40px rgba(166, 184, 40, 0.2);
}

.cta-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
}

.cta-features {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.cta-features .feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-features .feature i {
  color: #FFD700;
  font-size: 1.25rem;
}

.cta-features .feature span {
  color: white;
  font-weight: 500;
}

.btn-light {
  background: white;
  color: #a6b828;
  font-weight: 600;
  padding: 0.875rem 2rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-light:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 1199px) {
  .process-timeline::before {
    left: 60px;
  }

  .process-step {
    flex-direction: row !important;
  }

  .step-number {
    margin: 0 1rem 0 0;
  }

  .step-content {
    margin-left: 1rem;
  }
}

@media (max-width: 991px) {
  .servicios-hero {
    padding-top: 140px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-stats {
    gap: 2rem;
  }

  .services-sidebar {
    position: static;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .servicios-hero {
    padding-top: 120px;
    min-height: 60vh;
  }

  .hero-title {
    font-size: 2rem;
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

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .cta-card {
    padding: 2rem;
  }

  .cta-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 576px) {
  .servicios-hero {
    padding-top: 100px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .services-header {
    flex-direction: column;
    gap: 1rem;
  }

  .cta-features {
    flex-direction: column;
    gap: 1rem;
  }

  .process-step {
    flex-direction: column !important;
    align-items: flex-start;
  }

  .step-number {
    margin: 0 0 1rem 0;
  }

  .step-content {
    margin-left: 0;
  }
}
</style>
