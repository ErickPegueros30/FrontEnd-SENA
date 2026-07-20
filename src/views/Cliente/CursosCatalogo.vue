<template>
  <div :data-bs-theme="currentTheme" class="curso-detalle-page">
    <!-- Header con breadcrumb -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Inicio
              </router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/cliente/dashboard" class="breadcrumb-link">
                <i class="bi bi-speedometer2"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/cliente/cursos" class="breadcrumb-link">
                <i class="bi bi-mortarboard"></i> Catálogo de Cursos
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-book"></i> {{ curso?.titulo || 'Detalle del Curso' }}
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-book-fill me-2"></i>{{ curso?.titulo || 'Cargando...' }}
            </h1>
            <p class="page-subtitle" v-if="curso">
              {{ curso.descripcion_corta || curso.descripcion?.substring(0, 120) + '...' }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content" v-if="curso">
      <div class="container">
        <div class="row g-4">
          <!-- Columna principal - Información del curso -->
          <div class="col-lg-8">
            <!-- Galería / Imagen principal -->
            <div class="info-card imagen-card">
              <div class="curso-imagen-principal" :style="{ backgroundImage: `url(${curso.imagen || getDefaultImage()})` }">
                <div class="imagen-overlay">
                  <span class="curso-categoria-badge">
                    <i :class="getCategoriaIcon(curso.categoria)"></i>
                    {{ getCategoriaLabel(curso.categoria) }}
                  </span>
                  <span v-if="curso.destacado" class="curso-destacado-badge">
                    <i class="bi bi-star-fill"></i> Destacado
                  </span>
                </div>
              </div>
            </div>

            <!-- Descripción -->
            <div class="info-card">
              <h3 class="card-title">
                <i class="bi bi-info-circle me-2"></i>Descripción del Curso
              </h3>
              <div class="card-content">
                <p>{{ curso.descripcion }}</p>
              </div>
            </div>

            <!-- Temario / Contenido -->
            <div class="info-card">
              <h3 class="card-title">
                <i class="bi bi-list-check me-2"></i>Temario del Curso
              </h3>
              <div class="card-content">
                <div class="temario-accordion">
                  <div
                    v-for="(modulo, index) in curso.contenido"
                    :key="index"
                    class="temario-modulo"
                  >
                    <div
                      class="modulo-header"
                      @click="toggleModulo(index)"
                    >
                      <i class="bi" :class="modulosAbiertos[index] ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                      <span class="modulo-titulo">{{ modulo.titulo || modulo }}</span>
                      <span class="modulo-duracion" v-if="modulo.duracion">
                        <i class="bi bi-clock"></i> {{ modulo.duracion }}
                      </span>
                    </div>
                    <div v-if="modulosAbiertos[index]" class="modulo-contenido">
                      <ul v-if="modulo.temas">
                        <li v-for="(tema, idx) in modulo.temas" :key="idx">
                          <i class="bi bi-check-circle-fill"></i>
                          <span>{{ tema }}</span>
                        </li>
                      </ul>
                      <p v-else-if="typeof modulo === 'string'">{{ modulo }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Objetivos de aprendizaje -->
            <div class="info-card" v-if="curso.objetivos?.length">
              <h3 class="card-title">
                <i class="bi bi-bullseye me-2"></i>Objetivos de Aprendizaje
              </h3>
              <div class="card-content">
                <ul class="objetivos-list">
                  <li v-for="(obj, index) in curso.objetivos" :key="index">
                    <i class="bi bi-arrow-right-circle-fill"></i>
                    <span>{{ obj }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Requisitos previos -->
            <div class="info-card" v-if="curso.requisitos?.length">
              <h3 class="card-title">
                <i class="bi bi-clipboard-check me-2"></i>Requisitos Previos
              </h3>
              <div class="card-content">
                <ul class="requisitos-list">
                  <li v-for="(req, index) in curso.requisitos" :key="index">
                    <i class="bi bi-check-lg"></i>
                    <span>{{ req }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Opiniones / Testimonios -->
            <div class="info-card" v-if="curso.testimonios?.length">
              <h3 class="card-title">
                <i class="bi bi-chat-quote me-2"></i>Lo que dicen nuestros alumnos
              </h3>
              <div class="card-content">
                <div class="testimonios-grid">
                  <div v-for="(test, index) in curso.testimonios" :key="index" class="testimonio-card">
                    <div class="testimonio-estrellas">
                      <i v-for="star in 5" :key="star" class="bi" :class="star <= test.calificacion ? 'bi-star-fill' : 'bi-star'"></i>
                    </div>
                    <p class="testimonio-texto">"{{ test.comentario }}"</p>
                    <div class="testimonio-autor">
                      <strong>{{ test.autor }}</strong>
                      <span>{{ test.cargo }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna lateral - Información de inscripción -->
          <div class="col-lg-4">
            <div class="sidebar-card">
              <div class="precio-section">
                <span class="precio-label">Inversión</span>
                <div class="precio-valor">
                  <span v-if="curso.precio === 0" class="gratis">GRATIS</span>
                  <template v-else>
                    <span class="moneda">$</span>
                    <span class="valor">{{ formatNumber(curso.precio) }}</span>
                    <span class="impuesto">MXN + IVA</span>
                  </template>
                </div>
              </div>

              <div class="info-section">
                <div class="info-item">
                  <i class="bi bi-clock-history"></i>
                  <div class="info-text">
                    <strong>Duración</strong>
                    <span>{{ curso.duracion }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <i class="bi bi-person-badge"></i>
                  <div class="info-text">
                    <strong>Instructor</strong>
                    <span>{{ curso.instructor }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <i class="bi bi-bar-chart"></i>
                  <div class="info-text">
                    <strong>Nivel</strong>
                    <span>{{ curso.nivel }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <i class="bi bi-people"></i>
                  <div class="info-text">
                    <strong>Estudiantes</strong>
                    <span>{{ curso.estudiantes || '+' }}+ inscritos</span>
                  </div>
                </div>
                <div class="info-item">
                  <i class="bi bi-globe2"></i>
                  <div class="info-text">
                    <strong>Modalidad</strong>
                    <span>{{ curso.modalidad || 'En línea' }}</span>
                  </div>
                </div>
                <div class="info-item" v-if="curso.certificado">
                  <i class="bi bi-award"></i>
                  <div class="info-text">
                    <strong>Certificado</strong>
                    <span>Con valor curricular</span>
                  </div>
                </div>
              </div>

              <div class="action-buttons">
                <button class="btn-inscribir" @click="inscribirseCurso">
                  <i class="bi bi-pencil-square"></i>
                  Inscribirme ahora
                </button>
                <button class="btn-info" @click="solicitarInfo">
                  <i class="bi bi-chat-dots"></i>
                  Solicitar información
                </button>
              </div>

              <div class="metodos-pago" v-if="curso.precio > 0">
                <p class="metodos-titulo">
                  <i class="bi bi-credit-card"></i> Aceptamos
                </p>
                <div class="metodos-iconos">
                  <i class="bi bi-credit-card" title="Tarjeta de crédito/débito"></i>
                  <i class="bi bi-bank2" title="Transferencia bancaria"></i>
                  <i class="bi bi-cash" title="Efectivo"></i>
                  <i class="bi bi-paypal" title="PayPal"></i>
                </div>
              </div>
            </div>

            <!-- Próximas fechas -->
            <div class="sidebar-card" v-if="curso.fechas?.length">
              <h4 class="sidebar-title">
                <i class="bi bi-calendar-event"></i> Próximas fechas
              </h4>
              <div class="fechas-list">
                <div v-for="(fecha, index) in curso.fechas" :key="index" class="fecha-item">
                  <div class="fecha-dia">{{ formatDateShort(fecha.fecha) }}</div>
                  <div class="fecha-horario">{{ fecha.horario }}</div>
                  <div class="fecha-disponibles" :class="{ limitado: fecha.disponibles < 10 }">
                    {{ fecha.disponibles }} cupos disponibles
                  </div>
                </div>
              </div>
            </div>

            <!-- Preguntas frecuentes -->
            <div class="sidebar-card" v-if="curso.faq?.length">
              <h4 class="sidebar-title">
                <i class="bi bi-question-circle"></i> Preguntas frecuentes
              </h4>
              <div class="faq-list">
                <div v-for="(item, index) in curso.faq" :key="index" class="faq-item">
                  <div class="faq-pregunta" @click="toggleFaq(index)">
                    <i class="bi" :class="faqAbiertos[index] ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                    <span>{{ item.pregunta }}</span>
                  </div>
                  <div v-if="faqAbiertos[index]" class="faq-respuesta">
                    {{ item.respuesta }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de inscripción -->
    <div v-if="showInscripcionModal" class="modal-backdrop show" @click="closeInscripcionModal"></div>
    <div v-if="showInscripcionModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square text-success me-2"></i>
              Confirmar inscripción
            </h5>
            <button type="button" class="btn-close" @click="closeInscripcionModal"></button>
          </div>
          <div class="modal-body">
            <div class="curso-resumen">
              <h6>{{ curso?.titulo }}</h6>
              <div class="resumen-detalles">
                <span><i class="bi bi-clock"></i> {{ curso?.duracion }}</span>
                <span><i class="bi bi-person-badge"></i> {{ curso?.instructor }}</span>
              </div>
              <div class="resumen-precio">
                <strong>Total a pagar:</strong>
                <span v-if="curso?.precio === 0" class="gratis">Gratuito</span>
                <span v-else class="precio">${{ formatNumber(curso?.precio) }} MXN</span>
              </div>
            </div>

            <div class="alert alert-info mt-3">
              <i class="bi bi-info-circle-fill me-2"></i>
              Al confirmar tu inscripción, recibirás un correo con los detalles de acceso al curso.
            </div>

            <div class="form-group mt-3">
              <label class="form-label">¿Cómo te enteraste de este curso?</label>
              <select v-model="inscripcionForm.referencia" class="form-select">
                <option value="">Selecciona una opción</option>
                <option value="web">Búsqueda en web</option>
                <option value="redes">Redes sociales</option>
                <option value="recomendacion">Recomendación</option>
                <option value="email">Correo electrónico</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button class="btn btn-secondary" @click="closeInscripcionModal">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button class="btn btn-success" @click="confirmarInscripcion" :disabled="inscribiendo">
              <i v-if="!inscribiendo" class="bi bi-check-circle me-1"></i>
              <i v-else class="bi bi-hourglass-split me-1"></i>
              {{ inscribiendo ? 'Procesando...' : 'Confirmar inscripción' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de solicitud de información -->
    <div v-if="showInfoModal" class="modal-backdrop show" @click="closeInfoModal"></div>
    <div v-if="showInfoModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-chat-dots me-2"></i>Solicitar información
            </h5>
            <button type="button" class="btn-close" @click="closeInfoModal"></button>
          </div>
          <div class="modal-body">
            <div class="curso-info-solicitud">
              <strong>Curso:</strong> {{ curso?.titulo }}
            </div>
            <form @submit.prevent="enviarSolicitud">
              <div class="form-group mt-3">
                <label class="form-label">Nombre completo *</label>
                <input v-model="solicitudForm.nombre" type="text" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">Correo electrónico *</label>
                <input v-model="solicitudForm.email" type="email" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input v-model="solicitudForm.telefono" type="tel" class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Mensaje</label>
                <textarea v-model="solicitudForm.mensaje" class="form-control" rows="3" placeholder="¿Tienes alguna pregunta específica sobre el curso?"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeInfoModal">Cancelar</button>
            <button class="btn btn-primary" @click="enviarSolicitud" :disabled="enviando">
              <i v-if="!enviando" class="bi bi-send me-1"></i>
              <i v-else class="bi bi-hourglass-split me-1"></i>
              {{ enviando ? 'Enviando...' : 'Enviar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        id="clientToast"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastEl"
      >
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto">
            <i :class="toastIcon"></i> {{ toastTitle }}
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
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

// Router
const route = useRoute()
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado
const curso = ref<any>(null)
const cursoId = ref<string | null>(null)
const loading = ref(true)

// Modales
const showInscripcionModal = ref(false)
const showInfoModal = ref(false)
const inscribiendo = ref(false)
const enviando = ref(false)

// Estado de acordeones
const modulosAbiertos = ref<Record<number, boolean>>({})
const faqAbiertos = ref<Record<number, boolean>>({})

// Formularios
const inscripcionForm = ref({
  referencia: ''
})

const solicitudForm = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
})

// Métodos
const getCategoriaLabel = (value: string) => {
  const categorias: Record<string, string> = {
    calidad: 'Calidad',
    seguridad: 'Seguridad',
    analisis: 'Análisis',
    instrumentacion: 'Instrumentación',
    gestion: 'Gestión',
    normativa: 'Normativa'
  }
  return categorias[value] || value
}

const getCategoriaIcon = (value: string) => {
  const icons: Record<string, string> = {
    calidad: 'bi bi-trophy',
    seguridad: 'bi bi-shield-check',
    analisis: 'bi bi-flask',
    instrumentacion: 'bi bi-motherboard',
    gestion: 'bi bi-clipboard-data',
    normativa: 'bi bi-file-text'
  }
  return icons[value] || 'bi bi-book'
}

const getDefaultImage = () => {
  return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

const formatNumber = (value: number) => {
  return value.toLocaleString('es-MX')
}

const formatDateShort = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

const toggleModulo = (index: number) => {
  modulosAbiertos.value[index] = !modulosAbiertos.value[index]
}

const toggleFaq = (index: number) => {
  faqAbiertos.value[index] = !faqAbiertos.value[index]
}

const inscribirseCurso = () => {
  showInscripcionModal.value = true
}

const closeInscripcionModal = () => {
  showInscripcionModal.value = false
  inscripcionForm.value.referencia = ''
}

const confirmarInscripcion = async () => {
  inscribiendo.value = true

  setTimeout(() => {
    // Crear registro de inscripción
    const inscripcion = {
      id: Date.now(),
      curso_id: curso.value.id,
      curso_titulo: curso.value.titulo,
      curso_precio: curso.value.precio,
      fecha_inscripcion: new Date().toISOString(),
      referencia: inscripcionForm.value.referencia || 'web',
      estado: 'pendiente'
    }

    // Guardar en localStorage
    const storedData = localStorage.getItem('mock_cliente_data')
    if (storedData) {
      const mockData = JSON.parse(storedData)
      if (!mockData.inscripciones) mockData.inscripciones = []
      mockData.inscripciones.push(inscripcion)
      localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
    } else {
      const mockData = { inscripciones: [inscripcion] }
      localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
    }

    showToast('¡Inscripción exitosa! Redirigiendo a tus cursos...', 'success', 'Inscripción confirmada')
    closeInscripcionModal()
    inscribiendo.value = false

    // Redirigir a la página de inscripciones/mis cursos
    setTimeout(() => {
      router.push('/cliente/inscripciones')
    }, 2000)
  }, 1500)
}

const solicitarInfo = () => {
  solicitudForm.value = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  }
  showInfoModal.value = true
}

const closeInfoModal = () => {
  showInfoModal.value = false
}

const enviarSolicitud = async () => {
  if (!solicitudForm.value.nombre || !solicitudForm.value.email) {
    showToast('Por favor complete su nombre y correo electrónico', 'warning', 'Campos incompletos')
    return
  }

  enviando.value = true

  setTimeout(() => {
    const solicitud = {
      id: Date.now(),
      curso_id: curso.value.id,
      curso_titulo: curso.value.titulo,
      nombre: solicitudForm.value.nombre,
      email: solicitudForm.value.email,
      telefono: solicitudForm.value.telefono,
      mensaje: solicitudForm.value.mensaje,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    }

    const storedData = localStorage.getItem('mock_cliente_data')
    if (storedData) {
      const mockData = JSON.parse(storedData)
      if (!mockData.solicitudes_cursos) mockData.solicitudes_cursos = []
      mockData.solicitudes_cursos.push(solicitud)
      localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
    }

    showToast('Solicitud enviada. Un asesor se comunicará con usted.', 'success', 'Solicitud enviada')
    closeInfoModal()
    enviando.value = false
  }, 1000)
}

// Cargar curso por ID
const loadCurso = () => {
  const id = route.params.id
  cursoId.value = id as string

  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    try {
      const mockData = JSON.parse(storedData)
      if (mockData.cursos) {
        const found = mockData.cursos.find((c: any) => c.id == id)
        if (found) {
          curso.value = found
          // Inicializar acordeones
          if (curso.value.contenido) {
            curso.value.contenido.forEach((_: any, idx: number) => {
              modulosAbiertos.value[idx] = idx === 0
            })
          }
          if (curso.value.faq) {
            curso.value.faq.forEach((_: any, idx: number) => {
              faqAbiertos.value[idx] = false
            })
          }
        } else {
          loadMockCursoById(id as string)
        }
      } else {
        loadMockCursoById(id as string)
      }
    } catch (e) {
      console.error('Error loading curso:', e)
      loadMockCursoById(id as string)
    }
  } else {
    loadMockCursoById(id as string)
  }
}

const loadMockCursoById = (id: string) => {
  // Cursos mock completos
  const cursosMock: Record<string, any> = {
    '1': {
      id: 1,
      titulo: 'Fundamentos de Calidad en Laboratorios',
      descripcion_corta: 'Aprende los principios básicos de la gestión de calidad aplicada a laboratorios de análisis.',
      descripcion: 'Este curso proporciona los conocimientos fundamentales para implementar y mantener un sistema de gestión de calidad en laboratorios de análisis. Basado en la norma ISO 17025, aprenderás los requisitos esenciales, documentación necesaria y mejores prácticas para asegurar la calidad de los resultados analíticos.',
      duracion: '20 horas',
      precio: 2500,
      instructor: 'Dra. Ana María Pérez',
      nivel: 'Básico',
      categoria: 'calidad',
      destacado: true,
      estudiantes: 156,
      modalidad: 'En línea',
      certificado: true,
      contenido: [
        {
          titulo: 'Módulo 1: Introducción a la Calidad en Laboratorios',
          duracion: '4 horas',
          temas: [
            'Conceptos básicos de calidad',
            'Importancia de la acreditación',
            'Normas aplicables a laboratorios',
            'Estructura de ISO 17025'
          ]
        },
        {
          titulo: 'Módulo 2: Requisitos de Gestión',
          duracion: '6 horas',
          temas: [
            'Organización y responsabilidades',
            'Sistema de gestión documentado',
            'Control de documentos y registros',
            'Revisión por la dirección'
          ]
        },
        {
          titulo: 'Módulo 3: Requisitos Técnicos',
          duracion: '6 horas',
          temas: [
            'Personal y competencia',
            'Instalaciones y condiciones ambientales',
            'Métodos y validación',
            'Equipos y trazabilidad'
          ]
        },
        {
          titulo: 'Módulo 4: Mejora Continua',
          duracion: '4 horas',
          temas: [
            'Auditorías internas',
            'Acciones correctivas y preventivas',
            'No conformidades',
            'Mejora del sistema'
          ]
        }
      ],
      objetivos: [
        'Comprender los fundamentos de la calidad en laboratorios',
        'Implementar un sistema de gestión de calidad según ISO 17025',
        'Realizar auditorías internas efectivas',
        'Documentar procedimientos correctamente',
        'Identificar oportunidades de mejora'
      ],
      requisitos: [
        'Conocimientos básicos de laboratorio',
        'Acceso a computadora con internet',
        'Deseable experiencia en laboratorio'
      ],
      fechas: [
        { fecha: '2024-03-15', horario: 'Lunes y Miércoles 18:00-20:00', disponibles: 15 },
        { fecha: '2024-04-10', horario: 'Martes y Jueves 19:00-21:00', disponibles: 8 },
        { fecha: '2024-05-05', horario: 'Sábados 09:00-13:00', disponibles: 20 }
      ],
      faq: [
        { pregunta: '¿El curso incluye material descargable?', respuesta: 'Sí, todos los módulos incluyen presentaciones, guías y ejercicios prácticos descargables.' },
        { pregunta: '¿Otorgan certificado?', respuesta: 'Sí, al completar el curso y aprobar la evaluación final se otorga un certificado con valor curricular.' },
        { pregunta: '¿Puedo acceder al curso después de terminado?', respuesta: 'Sí, tendrás acceso al contenido por 3 meses después de finalizar el curso.' }
      ],
      testimonios: [
        { autor: 'María González', cargo: 'Química', calificacion: 5, comentario: 'Excelente curso, muy completo y práctico. La instructora explica muy bien los conceptos.' },
        { autor: 'Carlos López', cargo: 'Técnico de laboratorio', calificacion: 5, comentario: 'Me ayudó mucho a entender los requisitos de ISO 17025. Muy recomendable.' }
      ]
    },
    '2': {
      id: 2,
      titulo: 'Seguridad en el Laboratorio',
      descripcion_corta: 'Capacitación completa sobre normas de seguridad y manejo de sustancias peligrosas.',
      descripcion: 'Curso integral sobre seguridad en laboratorios que cubre identificación de riesgos, manejo de sustancias peligrosas, uso de equipo de protección personal y procedimientos de respuesta a emergencias.',
      duracion: '15 horas',
      precio: 1800,
      instructor: 'Ing. Carlos Ramírez',
      nivel: 'Básico',
      categoria: 'seguridad',
      destacado: true,
      estudiantes: 234,
      modalidad: 'En línea',
      certificado: true,
      contenido: [
        {
          titulo: 'Módulo 1: Fundamentos de Seguridad',
          duracion: '3 horas',
          temas: [
            'Normas de seguridad generales',
            'Señalización y códigos de colores',
            'Identificación de riesgos',
            'Evaluación de riesgos'
          ]
        },
        {
          titulo: 'Módulo 2: Sustancias Químicas',
          duracion: '4 horas',
          temas: [
            'Clasificación de sustancias peligrosas',
            'Hoja de datos de seguridad (SDS)',
            'Almacenamiento seguro',
            'Manejo y transporte'
          ]
        },
        {
          titulo: 'Módulo 3: Equipo de Protección',
          duracion: '3 horas',
          temas: [
            'Tipos de EPP',
            'Selección y uso correcto',
            'Mantenimiento y limpieza',
            'Campanas de extracción'
          ]
        },
        {
          titulo: 'Módulo 4: Emergencias',
          duracion: '5 horas',
          temas: [
            'Procedimientos de emergencia',
            'Derrames químicos',
            'Primeros auxilios',
            'Equipos de emergencia'
          ]
        }
      ],
      objetivos: [
        'Identificar riesgos en el laboratorio',
        'Aplicar medidas de prevención',
        'Responder adecuadamente ante emergencias',
        'Manejar correctamente sustancias peligrosas',
        'Seleccionar el EPP adecuado'
      ],
      requisitos: [
        'Deseable experiencia en laboratorio',
        'Ropa adecuada para prácticas'
      ]
    }
  }

  const found = cursosMock[id]
  if (found) {
    curso.value = found
    if (curso.value.contenido) {
      curso.value.contenido.forEach((_: any, idx: number) => {
        modulosAbiertos.value[idx] = idx === 0
      })
    }
    if (curso.value.faq) {
      curso.value.faq.forEach((_: any, idx: number) => {
        faqAbiertos.value[idx] = false
      })
    }
  } else {
    // Si no se encuentra, mostrar error y redirigir
    showToast('Curso no encontrado', 'error', 'Error')
    setTimeout(() => {
      router.push('/cliente/cursos')
    }, 2000)
  }
}

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

const showToast = (message: string, type: ToastType = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title || type.charAt(0).toUpperCase() + type.slice(1)
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

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadCurso()
})
</script>

<style scoped>
.curso-detalle-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .curso-detalle-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */

/* Main Content */
.main-content {
  padding: 2rem 0 3rem;
}

/* Info Cards */
.info-card {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

[data-bs-theme="dark"] .info-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
  margin: 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .card-title {
  border-bottom-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.card-content {
  padding: 1.5rem;
}

/* Imagen Principal */
.imagen-card {
  padding: 0;
  overflow: hidden;
}

.curso-imagen-principal {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.imagen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
}

.curso-categoria-badge {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 0.375rem 1rem;
  border-radius: 30px;
  font-size: 0.8rem;
  color: white;
}

.curso-destacado-badge {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
  padding: 0.375rem 1rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

/* Temario */
.temario-modulo {
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
}

[data-bs-theme="dark"] .temario-modulo {
  border-color: var(--color-gray-light, #2d2d2d);
}

.modulo-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  cursor: pointer;
  transition: background 0.3s ease;
}

.modulo-header:hover {
  background: rgba(76, 175, 80, 0.1);
}

.modulo-titulo {
  flex: 1;
  font-weight: 600;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .modulo-titulo {
  color: var(--color-dark, #F8F9FA);
}

.modulo-duracion {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

.modulo-contenido {
  padding: 1rem;
}

.modulo-contenido ul {
  margin: 0;
  padding-left: 1.5rem;
}

.modulo-contenido li {
  margin-bottom: 0.5rem;
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modulo-contenido li i {
  color: var(--color-primary, #1E9E4A);
  font-size: 0.8rem;
}

/* Objetivos y Requisitos */
.objetivos-list,
.requisitos-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.objetivos-list li,
.requisitos-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .objetivos-list li,
[data-bs-theme="dark"] .requisitos-list li {
  border-bottom-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.objetivos-list li i,
.requisitos-list li i {
  color: var(--color-primary, #1E9E4A);
  font-size: 1.1rem;
}

/* Testimonios */
.testimonios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.testimonio-card {
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(129, 199, 132, 0.01) 100%));
  border-radius: 12px;
}

.testimonio-estrellas {
  margin-bottom: 0.5rem;
  color: #ffc107;
}

.testimonio-texto {
  font-size: 0.9rem;
  color: var(--color-gray, #6C757D);
  font-style: italic;
  margin-bottom: 0.75rem;
}

.testimonio-autor {
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  padding-top: 0.5rem;
}

.testimonio-autor strong {
  display: block;
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

.testimonio-autor span {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

/* Sidebar */
.sidebar-card {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

[data-bs-theme="dark"] .sidebar-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.precio-section {
  text-align: center;
  padding: 1.5rem;
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  color: white;
}

.precio-label {
  display: block;
  font-size: 0.85rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.precio-valor {
  font-size: 2rem;
  font-weight: 700;
}

.precio-valor .gratis {
  font-size: 1.5rem;
}

.precio-valor .moneda {
  font-size: 1.25rem;
}

.precio-valor .valor {
  font-size: 2.5rem;
}

.precio-valor .impuesto {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-left: 0.25rem;
}

.info-section {
  padding: 1.25rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item i {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-radius: 10px;
  color: var(--color-primary, #1E9E4A);
  font-size: 1rem;
}

.info-text {
  flex: 1;
}

.info-text strong {
  display: block;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

.info-text span {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .info-text span {
  color: var(--color-dark, #F8F9FA);
}

.action-buttons {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-inscribir {
  width: 100%;
  padding: 0.875rem;
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-inscribir:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.btn-info {
  width: 100%;
  padding: 0.875rem;
  background: transparent;
  border: 2px solid var(--color-primary, #1E9E4A);
  border-radius: 12px;
  color: var(--color-primary, #1E9E4A);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-info:hover {
  background: var(--color-primary, #1E9E4A);
  color: white;
}

.metodos-pago {
  padding: 1.25rem;
  text-align: center;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.metodos-titulo {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.75rem;
}

.metodos-iconos {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 1.5rem;
  color: var(--color-gray, #6C757D);
}

/* Fechas */
.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 1.25rem;
  margin: 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-dark, #212529);
}

.fechas-list {
  padding: 1rem;
}

.fecha-item {
  padding: 0.75rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.fecha-dia {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
}

.fecha-horario {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin: 0.25rem 0;
}

.fecha-disponibles {
  font-size: 0.7rem;
  color: #28a745;
}

.fecha-disponibles.limitado {
  color: #dc3545;
}

/* FAQ */
.faq-list {
  padding: 0.5rem;
}

.faq-item {
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.faq-pregunta {
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-dark, #212529);
}

.faq-pregunta:hover {
  background: rgba(0, 0, 0, 0.02);
}

.faq-respuesta {
  padding: 0.75rem;
  padding-top: 0;
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

/* Modal */

.modal-content {
  border-radius: 16px;
}

.curso-resumen {
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 12px;
  text-align: center;
}

.curso-resumen h6 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-dark, #212529);
}

.resumen-detalles {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.5rem;
}

.resumen-precio {
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.resumen-precio .gratis {
  color: #28a745;
  font-weight: 700;
}

.resumen-precio .precio {
  color: var(--color-primary, #1E9E4A);
  font-weight: 700;
}

.curso-info-solicitud {
  padding: 0.75rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 10px;
}

/* Form */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  color: var(--color-dark, #212529);
}

.form-control,
.form-select {
  width: 100%;
  padding: 0.625rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
}

/* Buttons */
.btn-secondary {
  background: var(--color-gray-light, #E9ECEF);
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  color: var(--color-dark, #212529);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  color: white;
}

.btn-primary {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  color: white;
}

/* Toast */

/* Responsive */
@media (max-width: 992px) {
  .testimonios-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {

  .curso-imagen-principal {
    height: 200px;
  }

  .precio-valor {
    font-size: 1.5rem;
  }

  .precio-valor .valor {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {

  .card-title {
    font-size: 1.1rem;
    padding: 1rem;
  }

  .card-content {
    padding: 1rem;
  }

  .modulo-header {
    flex-wrap: wrap;
  }

  .modulo-duracion {
    margin-left: auto;
  }
}
</style>
