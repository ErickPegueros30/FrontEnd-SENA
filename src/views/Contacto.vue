<template>
  <div :data-bs-theme="currentTheme" class="contacto-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="container">
        <div class="row align-items-center min-vh-60">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Contáctanos</h1>
              <p class="hero-subtitle">
                Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo de expertos para
                resolver tus dudas, solicitar cotizaciones o programar una visita.
              </p>
              <div class="hero-features">
                <div class="feature-item">
                  <i class="bi bi-clock"></i>
                  <span>Respuesta en menos de 24 horas</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-headset"></i>
                  <span>Atención personalizada</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-shield-check"></i>
                  <span>Confidencialidad garantizada</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="contact-card">
              <div class="card-header">
                <i class="bi bi-envelope-paper"></i>
                <h5>Contacto Rápido</h5>
              </div>
              <div class="card-body">
                <div class="contact-info-item">
                  <i class="bi bi-telephone"></i>
                  <div>
                    <small>Teléfono</small>
                    <p>+52 (442) 198 2279</p>
                    <p>+52 (442) 224 1245</p>
                  </div>
                </div>
                <div class="contact-info-item">
                  <i class="bi bi-envelope"></i>
                  <div>
                    <small>Email</small>
                    <p>ventas@sena.mx</p>
                  </div>
                </div>
                <div class="contact-info-item">
                  <i class="bi bi-geo-alt"></i>
                  <div>
                    <small>Dirección</small>
                    <p>Senda inmortal #24, Fracc. Milenio III | Santiago de Querétaro, Qro.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Formulario de Contacto -->
    <section class="contact-form-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="form-container" data-aos="fade-up">
              <div class="form-header text-center mb-5">
                <h2 class="form-title">Envíanos un mensaje</h2>
                <p class="form-subtitle">
                  Completa el formulario y nos pondremos en contacto contigo a la brevedad
                </p>
              </div>

              <form @submit.prevent="submitForm" class="contact-form">
                <div class="row g-3">
                  <!-- Información Personal -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="nombre" class="form-label">
                        <i class="bi bi-person me-1"></i>Nombre completo *
                      </label>
                      <input
                        v-model="formData.nombre"
                        type="text"
                        id="nombre"
                        class="form-control"
                        :class="{ 'is-invalid': errors.nombre }"
                        placeholder="Ingresa tu nombre completo"
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
                        <i class="bi bi-building me-1"></i>Empresa / Organización
                      </label>
                      <input
                        v-model="formData.empresa"
                        type="text"
                        id="empresa"
                        class="form-control"
                        placeholder="Nombre de tu empresa"
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email" class="form-label">
                        <i class="bi bi-envelope me-1"></i>Correo electrónico *
                      </label>
                      <input
                        v-model="formData.email"
                        type="email"
                        id="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        placeholder="ejemplo@dominio.com"
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
                        v-model="formData.telefono"
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

                  <!-- Tipo de Servicio -->
                  <div class="col-12">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="bi bi-list-check me-1"></i>Tipo de servicio requerido *
                      </label>
                      <div class="services-grid">
                        <div
                          v-for="service in servicios"
                          :key="service.id"
                          class="service-option"
                          :class="{ 'selected': formData.servicio === service.id }"
                          @click="formData.servicio = service.id"
                        >
                          <i :class="service.icon"></i>
                          <span>{{ service.name }}</span>
                        </div>
                      </div>
                      <div v-if="errors.servicio" class="text-danger small mt-2">
                        {{ errors.servicio }}
                      </div>
                    </div>
                  </div>

                  <!-- Mensaje -->
                  <div class="col-12">
                    <div class="form-group">
                      <label for="mensaje" class="form-label">
                        <i class="bi bi-chat-left-text me-1"></i>Mensaje *
                      </label>
                      <textarea
                        v-model="formData.mensaje"
                        id="mensaje"
                        class="form-control"
                        :class="{ 'is-invalid': errors.mensaje }"
                        rows="5"
                        placeholder="Describe tu requerimiento o pregunta..."
                        required
                      ></textarea>
                      <div class="text-end mt-2">
                        <small :class="mensajeLengthClass">
                          {{ formData.mensaje.length }}/500 caracteres
                        </small>
                      </div>
                      <div v-if="errors.mensaje" class="invalid-feedback">
                        {{ errors.mensaje }}
                      </div>
                    </div>
                  </div>

                  <!-- Archivos -->
                  <div class="col-12">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="bi bi-paperclip me-1"></i>Archivos adjuntos
                      </label>
                      <div class="file-upload-area" @click="triggerFileInput">
                        <div class="upload-content">
                          <i class="bi bi-cloud-upload"></i>
                          <p class="mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                          <small class="text-muted">Tamaño máximo: 10MB por archivo</small>
                        </div>
                        <input
                          ref="fileInput"
                          type="file"
                          multiple
                          @change="handleFileUpload"
                          class="d-none"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        >
                      </div>
                      <div v-if="formData.archivos.length > 0" class="mt-3">
                        <div class="file-list">
                          <div
                            v-for="(file, index) in formData.archivos"
                            :key="index"
                            class="file-item"
                          >
                            <i class="bi bi-file-earmark"></i>
                            <div class="file-info">
                              <span class="file-name">{{ file.name }}</span>
                              <small class="file-size">{{ formatFileSize(file.size) }}</small>
                            </div>
                            <button
                              type="button"
                              class="btn-remove-file"
                              @click="removeFile(index)"
                            >
                              <i class="bi bi-x"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Privacy -->
                  <div class="col-12">
                    <div class="form-check">
                      <input
                        v-model="formData.privacidad"
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

                  <!-- Submit -->
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
                          <i class="bi bi-send me-2"></i>Enviar mensaje
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

    <!-- Información de Contacto -->
    <section class="contact-info-section py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4" data-aos="fade-up">
            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <h5 class="info-title">Ubicación</h5>
              <p class="info-text">
                Senda inmortal #24, Fracc. Milenio III | Santiago de Querétaro, Qro.
              </p>
              <button class="btn btn-outline-primary btn-sm">
                <i class="bi bi-map me-1"></i>Ver en mapa
              </button>
            </div>
          </div>

          <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-telephone"></i>
              </div>
              <h5 class="info-title">Teléfonos</h5>
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">Ventas:</span>
                  <span class="info-value">+1 (234) 567-891</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Soporte:</span>
                  <span class="info-value">+1 (234) 567-892</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Administración:</span>
                  <span class="info-value">+1 (234) 567-893</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-clock"></i>
              </div>
              <h5 class="info-title">Horarios</h5>
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">Lunes a Viernes:</span>
                  <span class="info-value">8:00 - 18:00 hrs</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Sábados:</span>
                  <span class="info-value">9:00 - 13:00 hrs</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Domingos:</span>
                  <span class="info-value">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mapa -->
    <section class="map-section">
      <div class="map-container" data-aos="fade-up">
        <div class="map-overlay">
          <div class="map-content">
            <h4 class="mb-3">Nuestras instalaciones</h4>
            <p class="mb-4">
              Visita nuestras instalaciones acreditadas y conoce nuestros laboratorios.
              Agenda una visita guiada con nuestro equipo de ventas.
            </p>
            <button class="btn btn-primary">
              <i class="bi bi-calendar-check me-1"></i>Agendar visita
            </button>
          </div>
        </div>
        <!-- Mapa placeholder - En producción usarías Google Maps API -->
        <div class="map-placeholder">
          <div class="map-marker">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <div class="map-label">
            <h6>SENA Laboratorios</h6>
            <small>Ubicación de nuestras instalaciones</small>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Preguntas frecuentes</h2>
          <p class="section-subtitle">Resolvemos tus dudas más comunes</p>
        </div>

        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="accordion" id="faqAccordion">
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
                    {{ faq.question }}
                  </button>
                </h3>
                <div
                  :id="`faq${faq.id}`"
                  class="accordion-collapse collapse"
                  :class="{ 'show': index === 0 }"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center mt-5" data-aos="fade-up">
              <p class="mb-3">¿No encontraste lo que buscabas?</p>
              <a href="#" class="btn btn-outline-primary">
                <i class="bi bi-chat-left-text me-1"></i>Contactar soporte
              </a>
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
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning'

interface FormData {
  nombre: string
  empresa: string
  email: string
  telefono: string
  servicio: number | null
  mensaje: string
  archivos: File[]
  privacidad: boolean
}

interface FormErrors {
  nombre?: string
  email?: string
  telefono?: string
  servicio?: string
  mensaje?: string
  privacidad?: string
}

interface Service {
  id: number
  name: string
  icon: string
}

interface FAQ {
  id: number
  question: string
  answer: string
}

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del formulario
const formData = ref<FormData>({
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  servicio: null,
  mensaje: '',
  archivos: [],
  privacidad: false
})

const errors = ref<FormErrors>({})
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Datos
const servicios: Service[] = [
  { id: 1, name: 'Agua y Alimentos', icon: 'bi bi-droplet' },
  { id: 2, name: 'Masa y Temperatura', icon: 'bi bi-thermometer-half' },
  { id: 3, name: 'Volumen y Presión', icon: 'bi bi-speedometer2' },
  { id: 4, name: 'Dimensional', icon: 'bi bi-rulers' },
  { id: 5, name: 'Humedad', icon: 'bi bi-moisture' },
  { id: 6, name: 'Eléctrica', icon: 'bi bi-lightning-charge' },
  { id: 7, name: 'Densidad', icon: 'bi bi-water' },
  { id: 8, name: 'Otro servicio', icon: 'bi bi-question-circle' }
]

const faqs: FAQ[] = [
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
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Aceptamos transferencias bancarias, tarjetas de crédito/débito (Visa, MasterCard) y en algunos casos, pagos en efectivo. Todos los pagos son procesados de manera segura.'
  },
  {
    id: 4,
    question: '¿Ofrecen servicio de recolección de muestras?',
    answer: 'Sí, contamos con servicio de recolección de muestras en la zona metropolitana. Para otras localidades, podemos coordinar el envío a través de paquetería especializada.'
  },
  {
    id: 5,
    question: '¿Cuál es el tiempo estimado para la entrega de resultados?',
    answer: 'El tiempo varía según el tipo de análisis. Los ensayos de rutina generalmente se entregan en 3-5 días hábiles, mientras que análisis especializados pueden tomar de 7 a 10 días hábiles.'
  }
]

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const mensajeLengthClass = computed(() => {
  const length = formData.value.mensaje.length
  if (length > 500) return 'text-danger'
  if (length > 450) return 'text-warning'
  return 'text-muted'
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

  showNotification(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es requerido'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email) {
    errors.value.email = 'El email es requerido'
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Ingresa un email válido'
    isValid = false
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!formData.value.telefono) {
    errors.value.telefono = 'El teléfono es requerido'
    isValid = false
  } else if (!phoneRegex.test(formData.value.telefono)) {
    errors.value.telefono = 'Ingresa un teléfono válido'
    isValid = false
  }

  if (!formData.value.servicio) {
    errors.value.servicio = 'Selecciona un tipo de servicio'
    isValid = false
  }

  if (!formData.value.mensaje.trim()) {
    errors.value.mensaje = 'El mensaje es requerido'
    isValid = false
  } else if (formData.value.mensaje.length > 500) {
    errors.value.mensaje = 'El mensaje no puede exceder los 500 caracteres'
    isValid = false
  }

  if (!formData.value.privacidad) {
    errors.value.privacidad = 'Debes aceptar la política de privacidad'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    showNotification('Por favor, corrige los errores en el formulario', 'warning')
    return
  }

  isSubmitting.value = true

  try {
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Resetear formulario
    formData.value = {
      nombre: '',
      empresa: '',
      email: '',
      telefono: '',
      servicio: null,
      mensaje: '',
      archivos: [],
      privacidad: false
    }

    showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success')
  } catch (error) {
    showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'warning')
  } finally {
    isSubmitting.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const newFiles = Array.from(input.files)
    const totalSize = [...formData.value.archivos, ...newFiles].reduce((acc, file) => acc + file.size, 0)

    if (totalSize > 10 * 1024 * 1024) { // 10MB
      showNotification('El tamaño total de los archivos no puede exceder 10MB', 'warning')
      return
    }

    formData.value.archivos = [...formData.value.archivos, ...newFiles]
  }
  // Limpiar input
  input.value = ''
}

const removeFile = (index: number) => {
  formData.value.archivos.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

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
.contacto-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .contacto-page {
  background: linear-gradient(135deg, #121212 0%, #1A1A1A 100%);
}

/* Hero Section */
.contact-hero {
  /* Full viewport minus navbar height so content sits under the fixed navbar and is vertically centered */
  min-height: calc(100vh - var(--navbar-height, 70px));
  display: flex;
  align-items: center;
  background: linear-gradient(rgba(166, 184, 40, 0.9), rgba(166, 184, 40, 0.9)),
              url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding-top: 0;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem 0;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
}

.feature-item i {
  font-size: 1.25rem;
  color: #FFD700;
}

.contact-card {
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
  color: #FFD700;
  margin-bottom: 1rem;
}

.card-header h5 {
  color: white;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.contact-info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.contact-info-item i {
  font-size: 1.5rem;
  color: #FFD700;
  width: 40px;
}

.contact-info-item small {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  display: block;
  margin-bottom: 0.25rem;
}

.contact-info-item p {
  color: white;
  margin: 0;
  font-weight: 500;
}

/* Form Section */
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
}

[data-bs-theme="dark"] .form-title {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .form-subtitle {
  color: var(--color-gray, #6C757D);
}

.contact-form .form-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .contact-form .form-label {
  color: var(--color-dark, #F8F9FA);
}

.contact-form .form-control,
.contact-form .form-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .contact-form .form-control,
[data-bs-theme="dark"] .contact-form .form-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.contact-form .form-control:focus,
.contact-form .form-select:focus {
  border-color: var(--color-primary, #a6b828);
  box-shadow: 0 0 0 0.25rem rgba(166, 184, 40, 0.25);
}

.contact-form textarea {
  resize: vertical;
  min-height: 120px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.service-option {
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

[data-bs-theme="dark"] .service-option {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.service-option:hover {
  border-color: var(--color-primary, #a6b828);
  transform: translateY(-2px);
}

.service-option.selected {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-color: transparent;
  color: white;
}

.service-option i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.service-option.selected i {
  color: white;
}

.service-option span {
  font-size: 0.85rem;
  font-weight: 500;
}

.file-upload-area {
  border: 2px dashed var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .file-upload-area {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.file-upload-area:hover {
  border-color: var(--color-primary, #a6b828);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(166, 184, 40, 0.05) 0%, rgba(166, 184, 40, 0.03) 100%));
}

.file-upload-area i {
  font-size: 3rem;
  color: var(--color-primary, #a6b828);
  margin-bottom: 1rem;
}

.upload-content p {
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.5rem;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-radius: 8px;
  border: 1px solid rgba(166, 184, 40, 0.2);
}

[data-bs-theme="dark"] .file-item {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.file-item i {
  font-size: 1.5rem;
  color: var(--color-primary, #a6b828);
}

.file-info {
  flex: 1;
}

.file-name {
  display: block;
  font-weight: 500;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .file-name {
  color: var(--color-dark, #F8F9FA);
}

.file-size {
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
}

.btn-remove-file {
  background: none;
  border: none;
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-remove-file:hover {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

.form-check-input:checked {
  background-color: var(--color-primary, #a6b828);
  border-color: var(--color-primary, #a6b828);
}

/* Info Cards */
.contact-info-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .contact-info-section {
  background: var(--color-light, #121212);
}

.info-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s ease;
  height: 100%;
}

[data-bs-theme="dark"] .info-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.info-icon {
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
}

.info-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-bottom: 1.5rem;
}

[data-bs-theme="dark"] .info-title {
  color: var(--color-dark, #F8F9FA);
}

.info-text {
  color: var(--color-gray, #6C757D);
  margin-bottom: 1.5rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
}

.info-value {
  color: var(--color-dark, #212529);
  font-weight: 500;
}

[data-bs-theme="dark"] .info-value {
  color: var(--color-dark, #F8F9FA);
}

/* Map Section */
.map-section {
  position: relative;
  height: 400px;
}

.map-container {
  position: relative;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.9) 0%, rgba(166, 184, 40, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.map-content {
  max-width: 400px;
  text-align: center;
  color: white;
}

.map-content h4 {
  color: white;
  font-weight: 600;
}

.map-placeholder {
  position: absolute;
  top: 50%;
  left: 70%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.map-marker {
  width: 60px;
  height: 60px;
  background: #FFD700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.map-label {
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.map-label h6 {
  color: #333;
  margin: 0 0 0.25rem 0;
}

.map-label small {
  color: #666;
}

/* FAQ Section */
.faq-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .faq-section {
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

.accordion-item {
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

[data-bs-theme="dark"] .accordion-item {
  background: var(--color-light, #121212);
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

/* Responsive */
@media (max-width: 991.98px) {
  .contact-hero {
    /* keep centered on medium screens */
    min-height: calc(100vh - var(--navbar-height, 70px));
    padding-top: 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .form-container {
    padding: 2rem;
  }

  .map-placeholder {
    left: 50%;
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

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .contact-hero {
    /* keep centered on small screens */
    min-height: calc(100vh - var(--navbar-height, 70px));
    padding-top: 0;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .file-upload-area {
    padding: 1.5rem;
  }

  .map-overlay {
    padding: 1.5rem;
  }
}
</style>
