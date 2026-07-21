<template>
  <div :data-bs-theme="currentTheme" class="cursos-page">
    <!-- Hero Section -->
    <section class="cursos-hero">
      <div class="container">
        <div class="row align-items-center min-vh-60">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Cursos y Asesoría en Metrología</h1>
              <p class="hero-subtitle">
                Capacitación especializada impartida por expertos en metrología.
                Ofrecemos programas y asesoría en modalidades adaptadas a tus necesidades
                para cubrir los objetivos de cada participante.
              </p>

              <div class="hero-features">
                <div class="feature-item">
                  <i class="bi bi-person-check"></i>
                  <span>Capacitación personalizada</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-book"></i>
                  <span>Contenido práctico y teórico</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-award"></i>
                  <span>Constancia SENA</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-card">
              <div class="card-header">
                <i class="bi bi-layers"></i>
                <h5>Modalidades Disponibles</h5>
              </div>
              <div class="card-body">
                <div class="modality-snapshot">
                  <div class="snapshot-item mb-3">
                    <h6>Capacitación Presencial</h6>
                    <p class="mb-2 small">Formación in-company o en nuestras instalaciones, con sesiones prácticas y evaluación.</p>
                  </div>

                  <div class="dropdown-divider"></div>

                  <div class="snapshot-item mt-3">
                    <h6>Capacitación Online</h6>
                    <p class="mb-2 small">Sesiones en vivo y material digital accesible desde cualquier lugar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Introducción -->
    <section class="introduction-section py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6" data-aos="fade-right">
            <div class="intro-image">
              <img src="../../image/IMAGEN 5.png"
                   alt="Capacitación en metrología"
                   class="img-fluid rounded">
              <div class="image-badge">
                <i class="bi bi-people"></i>
                <span>+500 profesionales capacitados</span>
              </div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <div class="intro-content">
              <h2 class="section-title mb-4">Capacitación Especializada en Metrología</h2>
              <p class="lead mb-4">
                SENA ofrece <strong>cursos y asesoría en metrología</strong> en modalidades adaptadas a tus
                necesidades, diseñadas para cubrir los objetivos de formación de cada participante.
              </p>
              <p class="mb-4">
                Nuestros servicios de capacitación se adecuan a las necesidades de nuestros asistentes.
                Previamente investigamos la finalidad del curso o asesoría para cada participante,
                asegurando que todos cubran sus expectativas con respecto a los objetivos y contenidos impartidos.
              </p>

              <div class="key-points">
                <div class="key-point">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Contenido personalizado según necesidades</span>
                </div>
                <div class="key-point">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Instructores con experiencia certificada</span>
                </div>
                <div class="key-point">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Material didáctico de apoyo incluido</span>
                </div>
                <div class="key-point">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Constancia con valor curricular</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modalidades -->
    <section class="modalities-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Modalidades de Capacitación</h2>
          <p class="section-subtitle">
            Ofrecemos diferentes formatos para adaptarnos a tus necesidades de aprendizaje
          </p>
        </div>

        <div class="row g-4">
          <div class="col-md-6" data-aos="fade-up">
            <div class="modality-card">
              <div class="modality-header">
                <div class="modality-icon">
                  <i class="bi bi-building"></i>
                </div>
                <h3 class="modality-title">Capacitación Presencial</h3>
                <span class="modality-badge">Empresas y Grupos</span>
              </div>
              <div class="modality-body">
                <p>
                  <strong>Capacitación in-company</strong> diseñada a la medida para tu organización.
                  Adaptamos contenidos, cronograma y ejercicios a tus procesos.
                </p>
                <ul class="modality-features">
                  <li><i class="bi bi-check"></i> Contenido personalizado</li>
                  <li><i class="bi bi-check"></i> Horarios flexibles</li>
                  <li><i class="bi bi-check"></i> Sesiones en tus instalaciones</li>
                  <li><i class="bi bi-check"></i> Material de trabajo incluido</li>
                </ul>
              </div>
              <div class="modality-footer">
                <button type="button" class="btn btn-success" @click="openRequestModal('presencial')">
                  <i class="bi bi-chat-left-text me-2"></i>Solicitar Cotización
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="modality-card">
              <div class="modality-header">
                <div class="modality-icon">
                  <i class="bi bi-laptop"></i>
                </div>
                <h3 class="modality-title">Capacitación Online</h3>
                <span class="modality-badge">En línea</span>
              </div>
              <div class="modality-body">
                <p>
                  <strong>Formación en línea</strong> con sesiones sincrónicas y materiales accesibles
                  desde cualquier lugar. Ideal para actualización individual o equipos distribuidos.
                </p>
                <ul class="modality-features">
                  <li><i class="bi bi-check"></i> Sesiones en vivo y grabadas</li>
                  <li><i class="bi bi-check"></i> Acceso a materiales digitales</li>
                  <li><i class="bi bi-check"></i> Interacción con instructores</li>
                  <li><i class="bi bi-check"></i> Modalidades mixtas disponibles</li>
                </ul>
              </div>
              <div class="modality-footer">
                <button type="button" class="btn btn-success" @click="openRequestModal('virtual')">
                  <i class="bi bi-envelope-paper me-2"></i>Solicitar Cotización
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Metodología -->
    <section class="methodology-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Nuestra Metodología</h2>
          <p class="section-subtitle">
            Proceso estructurado para garantizar el éxito de tu capacitación
          </p>
        </div>

        <div class="methodology-steps">
          <div class="step" v-for="step in methodologySteps" :key="step.id" data-aos="fade-up">
            <div class="step-number">{{ step.id }}</div>
            <div class="step-icon">
              <i :class="step.icon"></i>
            </div>
            <div class="step-content">
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>
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
            <h2 class="cta-title">¿Necesitas un curso personalizado?</h2>
            <p class="cta-subtitle mb-4">
              Contáctanos para desarrollar un programa de capacitación específico
              para las necesidades de tu organización.
            </p>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <button type="button" class="btn btn-success btn-lg" @click="openRequestModal('')">
                <i class="bi bi-chat-left-text me-2"></i>Solicitar información
              </button>
              <a href="tel:+1234567890" class="btn btn-outline-light btn-lg">
                <i class="bi bi-telephone me-2"></i>Llamar ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <!-- Modal de Solicitar Cotización (overlay estilo EnsayoDetalle) -->
    <div v-if="showCotizacionModal" class="modal-overlay" @click="closeRequestModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Solicitar Cotización de Curso</h3>
          <button class="modal-close" @click="closeRequestModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitRegistration">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre</label>
                <input v-model="registrationForm.nombre" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Laboratorio / Empresa</label>
                <input v-model="registrationForm.empresa" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Correo</label>
                <input v-model="registrationForm.email" type="email" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Teléfono</label>
                <input v-model="registrationForm.telefono" type="tel" class="form-control" required />
              </div>
              <div class="col-12">
                <label class="form-label">Modalidad</label>
                <select v-model="registrationForm.modalidad" class="form-select">
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Descripción del curso a solicitar</label>
                <textarea v-model="registrationForm.mensaje" class="form-control" rows="4" placeholder="Describa el tipo de curso, objetivos, número de participantes, etc."></textarea>
              </div>
            </div>

            <div class="carrito-actions mt-3 d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="closeRequestModal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">Enviar solicitud</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <FooterComponent :current-theme="currentTheme" />

    <!-- Modal de Detalle del Curso -->
    <CourseModal
      v-if="selectedCourse"
      :course="selectedCourse"
      :show="showCourseModal"
      @close="closeCourseModal"
      @register="scrollToForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { defineComponent } from 'vue'
import FooterComponent from '@/components/Footer/Footer.vue'
// CourseCard and InstructorCard removed per request
import type { Toast } from 'bootstrap'
import { useTheme } from '@/composables/useTheme'

// Tipos
type ToastType = 'success' | 'info' | 'warning'

interface Course {
  id: number
  title: string
  description: string
  category: string
  level: 'básico' | 'intermedio' | 'avanzado'
  features: string[]
  instructor: string
  image?: string
}

interface Instructor {
  id: number
  name: string
  title: string
  specialty: string[]
  experience: string
  bio: string
  image?: string
}

interface RegistrationForm {
  nombre: string
  empresa: string
  email: string
  telefono: string
  curso: number | null
  modalidad: string
  mensaje: string
  privacidad: boolean
}

// Estado del tema
const { currentTheme } = useTheme()

// Estado del formulario
const registrationForm = ref<RegistrationForm>({
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  curso: null,
  modalidad: '',
  mensaje: '',
  privacidad: false
})

const registrationErrors = ref<Partial<Record<keyof RegistrationForm, string>>>({})
const isSubmitting = ref(false)

// Toast (notificación) state
const toastMessage = ref('')
const toastType = ref<ToastType>('info')
const toastEl = ref<HTMLElement | null>(null)
let toastInstance: Toast | null = null

// Estado del filtro
const activeFilter = ref<string>('all')
const coursesPerPage = 6
const visibleCourses = ref(coursesPerPage)

// Datos
const categories = [
  { id: 'all', name: 'Todos', icon: 'bi-grid' },
  { id: 'dimensional', name: 'Dimensional', icon: 'bi-rulers' },
  { id: 'masa', name: 'Masa', icon: 'bi-scale' },
  { id: 'temperatura', name: 'Temperatura', icon: 'bi-thermometer-half' },
  { id: 'electrica', name: 'Eléctrica', icon: 'bi-lightning-charge' },
  { id: 'presion', name: 'Presión', icon: 'bi-speedometer2' }
]

const courses: Course[] = [
  {
    id: 1,
    title: 'Metrología Dimensional Básica',
    description: 'Introducción a las mediciones dimensionales y uso de instrumentos básicos.',
    category: 'dimensional',
    level: 'básico',
    features: ['Calibradores', 'Micrómetros', 'Comparadores', 'Bloques patrón'],
    instructor: 'Ing. Mario Díaz'
  },
  {
    id: 2,
    title: 'Calibración de Balanzas',
    description: 'Procedimientos de calibración y verificación de instrumentos de pesaje.',
    category: 'masa',
    level: 'intermedio',
    features: ['Pesas patrón', 'Procedimientos', 'Cálculo de incertidumbre', 'Normativas'],
    instructor: 'Ing. Jorge Nava'
  },
  {
    id: 3,
    title: 'Termometría Industrial',
    description: 'Medición de temperatura en procesos industriales y calibración de termómetros.',
    category: 'temperatura',
    level: 'avanzado',
    features: ['Termopares', 'RTDs', 'Pirómetros', 'Baños de calibración'],
    instructor: 'Dr. Víctor Martínez'
  },
  {
    id: 4,
    title: 'Metrología Eléctrica',
    description: 'Fundamentos de mediciones eléctricas y calibración de instrumentos.',
    category: 'electrica',
    level: 'intermedio',
    features: ['Multímetros', 'Fuentes', 'Osciloscopios', 'Analizadores'],
    instructor: 'M. en C. Mariano Botello'
  },
  {
    id: 5,
    title: 'Calibración de Manómetros',
    description: 'Técnicas de calibración de instrumentos de presión y vacío.',
    category: 'presion',
    level: 'intermedio',
    features: ['Bombas de presión', 'Comparadores', 'Calibradores digitales', 'Normas'],
    instructor: 'M. en C. Alejandro Navarro'
  },
  {
    id: 6,
    title: 'Gestión de la Calidad en Metrología',
    description: 'Implementación de sistemas de gestión de la calidad en laboratorios.',
    category: 'all',
    level: 'avanzado',
    features: ['ISO 17025', 'Auditorías', 'Documentación', 'Mejora continua'],
    instructor: 'Mtra. Marilyn López'
  },
  {
    id: 7,
    title: 'Metrología de Flujo',
    description: 'Medición y calibración de medidores de flujo de líquidos y gases.',
    category: 'presion',
    level: 'avanzado',
    features: ['Turbinas', 'Vórtex', 'Ultrasonido', 'Procedimientos'],
    instructor: 'Lic. Alejandro Oharriz'
  },
  {
    id: 8,
    title: 'Cálculo de Incertidumbre de Medición',
    description: 'Métodos para estimar y reportar incertidumbre en mediciones.',
    category: 'all',
    level: 'avanzado',
    features: ['GUM', 'MCM', 'Software', 'Casos prácticos'],
    instructor: 'Dr. Víctor Martínez'
  },
  {
    id: 9,
    title: 'Metrología para No Metrólogos',
    description: 'Introducción a la metrología para personal no especializado.',
    category: 'all',
    level: 'básico',
    features: ['Conceptos básicos', 'Importancia', 'Aplicaciones', 'Ejercicios'],
    instructor: 'Ing. Adrián Reyes'
  }
]

// instructors list removed per request

const methodologySteps = [
  {
    id: 1,
    icon: 'bi bi-search',
    title: 'Diagnóstico de Necesidades',
    description: 'Analizamos los requerimientos específicos de los participantes para adaptar el contenido.'
  },
  {
    id: 2,
    icon: 'bi bi-pencil',
    title: 'Diseño del Programa',
    description: 'Desarrollamos el contenido teórico y práctico según los objetivos establecidos.'
  },
  {
    id: 3,
    icon: 'bi bi-people',
    title: 'Implementación',
    description: 'Impartición del curso con metodologías activas y participación constante.'
  },
  {
    id: 4,
    icon: 'bi bi-graph-up',
    title: 'Evaluación',
    description: 'Medición del aprendizaje y retroalimentación para mejora continua.'
  },
  {
    id: 5,
    icon: 'bi bi-award',
    title: 'Constancia',
    description: 'Entrega de constancias con valor curricular y reportes de desempeño.'
  }
]

// Modal
const selectedCourse = ref<Course | null>(null)
const showCourseModal = ref(false)

// Placeholder CourseModal (si no existe componente independiente)
const CourseModal = defineComponent({
  name: 'CourseModal',
  props: { course: Object, show: { type: Boolean, default: false } },
  emits: ['close', 'register'],
  setup() { return () => null }
})

// Modal de cotización (overlay)
const showCotizacionModal = ref(false)

const openRequestModal = (type: string) => {
  registrationForm.value.modalidad = type || ''
  // debug
  // eslint-disable-next-line no-console
  showCotizacionModal.value = true
}

const closeRequestModal = () => {
  showCotizacionModal.value = false
}

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
  showToast('Tema cambiado', 'info')
}

const setActiveFilter = (filterId: string) => {
  activeFilter.value = filterId
  visibleCourses.value = coursesPerPage
}

const loadMoreCourses = () => {
  visibleCourses.value += coursesPerPage
}

const openCourseModal = (course: Course) => {
  selectedCourse.value = course
  showCourseModal.value = true
}

const closeCourseModal = () => {
  showCourseModal.value = false
  selectedCourse.value = null
}

const openContactModal = (type: string) => {
  // Store the modality as provided (e.g. 'presencial', 'online')
  registrationForm.value.modalidad = type || ''
  scrollToForm()
}

const scrollToForm = () => {
  const element = document.getElementById('inscripcion-form')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const submitRegistration = async () => {
  isSubmitting.value = true

  try {
    const payload = {
      nombre: registrationForm.value.nombre,
      empresa: registrationForm.value.empresa,
      email: registrationForm.value.email,
      telefono: registrationForm.value.telefono,
      curso: registrationForm.value.curso,
      modalidad: registrationForm.value.modalidad,
      mensaje: registrationForm.value.mensaje
    }

    const base = import.meta.env.DEV ? 'http://localhost:3000' : ''
    const res = await fetch(`${base}/api/cursos/solicitar-cotizacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    let data = null
    try {
      // some error responses may not be JSON
      data = await res.json()
    } catch (e) {
      data = null
    }

    if (!res.ok || !data || data.ok === false) {
      const msg = data && data.message ? data.message : 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.'
      showToast(msg, 'warning')
      return
    }

    // Resetear formulario
    registrationForm.value = {
      nombre: '',
      empresa: '',
      email: '',
      telefono: '',
      curso: null,
      modalidad: '',
      mensaje: '',
      privacidad: false
    }

    showToast('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.', 'success')
    showCotizacionModal.value = false
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('submitRegistration error', error)
    showToast('Error al enviar la solicitud. Por favor, inténtalo de nuevo.', 'warning')
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
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 3000 })
      toastInstance.show()
    })
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
})
</script>

<style scoped>
.cursos-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .cursos-page {
  background: var(--gradient-bg);
}

/* Hero Section */
.cursos-hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  padding: calc(var(--navbar-height, 80px) + 20px) 0 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.284), rgba(0, 0, 0, 0.8)),
              url('../../image/Home/elegirSena.png');
  background-size: cover;
  background-position: center;
  color: white;
}

.breadcrumb-nav {
  margin-bottom: 2rem;
}

.breadcrumb {
  background: transparent;
  padding: 0;
}

.breadcrumb-item a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-item a:hover {
  color: white;
}

.breadcrumb-item.active {
  color: white;
  font-weight: 600;
}

.breadcrumb-item + .breadcrumb-item::before {
  color: rgba(255, 255, 255, 0.5);
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
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
  gap: 2rem;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
}

.feature-item i {
  font-size: 1.5rem;
  color: #059934c5;
}

.hero-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background: rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header i {
  font-size: 2.5rem;
  color: #0264059d;
  margin-bottom: 1rem;
}

.card-header h5 {
  color: white;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.next-course {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.next-course:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.course-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.course-date .day {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFD700;
  line-height: 1;
}

.course-date .month {
  font-size: 0.85rem;
  opacity: 0.8;
}

.course-info h6 {
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.course-info small {
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.1);
}

/* Introduction Section */
.introduction-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .introduction-section {
  background: var(--color-light, #121212);
}

.intro-image {
  position: relative;
}

.intro-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.image-badge {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  box-shadow: 0 5px 20px rgba(166, 184, 40, 0.3);
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.key-points {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
}

.key-point {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.key-point i {
  color: var(--color-primary, #a7b729);
  font-size: 1.25rem;
}

.key-point span {
  color: var(--color-gray-dark, #495057);
}

[data-bs-theme="dark"] .key-point span {
  color: var(--color-gray-dark, #ADB5BD);
}

/* Modalities Section */
.modalities-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .modalities-section {
  background: var(--lab-bg, #1a1a1a);
}

.modality-card {
  background: var(--color-light, white);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  height: 100%;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .modality-card {
  background: var(--color-light, #121212);
  border-color: var(--color-gray-light, #2d2d2d);
}

.modality-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.modality-header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  position: relative;
}

.modality-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.modality-title {
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

[data-bs-theme="dark"] .modality-title {
  color: var(--color-dark, #F8F9FA);
}

.modality-badge {
  display: inline-block;
  padding: 0.25rem 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #a7b729);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(166, 184, 40, 0.2);
}

.modality-body {
  padding: 2rem;
}

.modality-body p {
  color: var(--color-gray, #6C757D);
  margin-bottom: 1.5rem;
}

.modality-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modality-features li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: var(--color-gray-dark, #495057);
}

.modality-features li i {
  color: var(--color-primary, #a7b729);
  margin-top: 0.25rem;
}

[data-bs-theme="dark"] .modality-features li {
  color: var(--color-gray-dark, #ADB5BD);
}

.modality-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

/* Catalog Section */
.catalog-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .catalog-section {
  background: var(--color-light, #121212);
}

.filters-container {
  background: var(--card-bg, white);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .filters-container {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.filter-label {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-bottom: 1rem;
  display: block;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1.25rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--color-light, white);
  color: var(--color-gray, #6C757D);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

[data-bs-theme="dark"] .filter-btn {
  background: var(--color-light, #121212);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray-dark, #ADB5BD);
}

.filter-btn:hover {
  border-color: var(--color-primary, #a7b729);
  color: var(--color-primary, #a7b729);
}

.filter-btn.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border-color: transparent;
  color: white;
}

.filter-btn.active i {
  color: white;
}

/* Methodology Section */
.methodology-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .methodology-section {
  background: var(--lab-bg, #1a1a1a);
}

.methodology-steps {
  max-width: 800px;
  margin: 0 auto;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.step:last-child {
  border-bottom: none;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.step-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary, #a7b729);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.step-content p {
  color: var(--color-gray, #6C757D);
  margin: 0;
}

[data-bs-theme="dark"] .step-content h4 {
  color: var(--color-dark, #F8F9FA);
}

/* Instructors Section */
.instructors-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .instructors-section {
  background: var(--color-light, #121212);
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
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .testimonial-item {
  background: var(--color-light, #121212);
}

.testimonial-content {
  position: relative;
  margin-bottom: 2rem;
}

.testimonial-content i {
  position: absolute;
  top: -20px;
  left: -20px;
  font-size: 4rem;
  color: var(--color-primary, #a7b729);
  opacity: 0.2;
}

.testimonial-text {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--color-gray-dark, #495057);
  line-height: 1.6;
  margin: 0;
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
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
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

.author-rating {
  color: #FFD700;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

[data-bs-theme="dark"] .author-info h6 {
  color: var(--color-dark, #F8F9FA);
}

/* Registration Section */
.registration-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .registration-section {
  background: var(--color-light, #121212);
}

.registration-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .registration-card {
  background: var(--card-bg, #2d2d2d);
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
}

.card-subtitle {
  color: var(--color-gray, #6C757D);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.registration-form .form-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .registration-form .form-label {
  color: var(--color-dark, #F8F9FA);
}

.registration-form .form-control,
.registration-form .form-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .registration-form .form-control,
[data-bs-theme="dark"] .registration-form .form-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.registration-form .form-control:focus,
.registration-form .form-select:focus {
  border-color: var(--color-primary, #a7b729);
  box-shadow: 0 0 0 0.25rem rgba(167, 183, 41, 0.25);
}

.modalidad-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.modalidad-options .form-check {
  padding: 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modalidad-options .form-check:hover {
  border-color: var(--color-primary, #a7b729);
}

.modalidad-options .form-check-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.modalidad-options .form-check-label i {
  color: var(--color-primary, #a7b729);
  font-size: 1.25rem;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--color-primary, #a7b729) 0%, var(--color-primary, #a7b729) 100%);
  color: white;
}

.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.cta-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 991.98px) {
  .cursos-hero {
    padding: calc(var(--navbar-height, 70px) + 16px) 0 40px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .methodology-steps {
    max-width: 100%;
  }

  .step {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-features {
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .step {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .step-icon {
    margin: 0 auto;
  }

  .registration-card {
    padding: 2rem;
  }

  .card-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 576px) {
  .cursos-hero {
    padding: calc(var(--navbar-height, 64px) + 12px) 0 40px;
    min-height: 70vh;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .filter-buttons {
    justify-content: center;
  }

  .modalidad-options {
    flex-direction: column;
  }

  .cta-title {
    font-size: 2rem;
  }
}
.modal-content {
  background: var(--color-light, #fff);
  width: 100%;
  max-width: 920px;
  border-radius: 14px;
  box-shadow: 0 30px 80px rgba(12, 20, 30, 0.45);
  overflow: hidden;
  transform-origin: center;
  animation: modalIn 220ms cubic-bezier(.2,.9,.2,1) both;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(12px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(90deg, var(--color-primary, #a7b729), #6aa23a);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.modal-close {
  background: rgba(255,255,255,0.12);
  border: 0;
  color: white;
  width: 38px;
  height: 38px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  cursor: pointer;
  transition: background .15s ease, transform .12s ease;
}

.modal-close:hover { background: rgba(255,255,255,0.18); transform: scale(1.03); }

.modal-body {
  padding: 1.5rem;
  max-height: 78vh;
  overflow: auto;
  background: var(--card-bg, #fff);
}

/* Inputs y selects dentro del modal */
.modal-body .form-control,
.modal-body .form-select,
.modal-body textarea {
  border-radius: 10px;
  padding: .65rem .9rem;
  border: 1px solid rgba(34,41,47,0.08);
  box-shadow: none;
  transition: box-shadow .12s ease, border-color .12s ease;
}

.modal-body .form-control:focus,
.modal-body .form-select:focus,
.modal-body textarea:focus {
  outline: none;
  border-color: rgba(167,183,41,0.9);
  box-shadow: 0 6px 24px rgba(167,183,41,0.08);
}

.carrito-actions .btn-cancelar,
.carrito-actions .btn-confirmar,
.carrito-actions .btn,
.modal-footer .btn {
  border-radius: 10px;
}

.btn-primary {
  background: linear-gradient(90deg, var(--color-primary, #a7b729), #6aa23a);
  border: none;
  color: white;
  padding: .55rem 1rem;
}

.btn-secondary {
  background: #f1f3f5;
  color: #222;
  border: 1px solid rgba(34,41,47,0.06);
}

/* overlay modal (estilo EnsayoDetalle) */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6,10,12,0.45);
  backdrop-filter: blur(4px) saturate(1.05);
  z-index: 20050;
}
</style>

<!-- Global overrides to ensure modal stacks above component elements -->
<style>
.modal { z-index: 20000 !important; }
.modal-backdrop { z-index: 19999 !important; }
</style>
