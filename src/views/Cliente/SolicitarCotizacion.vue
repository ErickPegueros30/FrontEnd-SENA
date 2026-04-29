<template>
  <div :data-bs-theme="currentTheme" class="solicitar-cotizacion-page">
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
            <li class="breadcrumb-item active">
              <i class="bi bi-plus-circle"></i> Solicitar Cotización
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-plus-circle-fill me-2"></i>Solicitar Nueva Cotización
            </h1>
            <p class="page-subtitle">
              Complete el formulario para solicitar un análisis o servicio. Un asesor se comunicará con usted.
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Formulario principal -->
    <main class="main-content">
      <div class="container">
        <div class="form-card">
          <div class="form-progress">
            <div class="progress-steps">
              <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
                <div class="step-number">1</div>
                <div class="step-label">Datos del Servicio</div>
              </div>
              <div class="step-line" :class="{ active: currentStep > 1 }"></div>
              <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
                <div class="step-number">2</div>
                <div class="step-label">Detalles Específicos</div>
              </div>
              <div class="step-line" :class="{ active: currentStep > 2 }"></div>
              <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
                <div class="step-number">3</div>
                <div class="step-label">Documentos</div>
              </div>
              <div class="step-line" :class="{ active: currentStep > 3 }"></div>
              <div class="step" :class="{ active: currentStep >= 4, completed: currentStep > 4 }">
                <div class="step-number">4</div>
                <div class="step-label">Confirmación</div>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="cotizacion-form">
            <!-- Paso 1: Datos del Servicio -->
            <div v-show="currentStep === 1" class="form-step">
              <h3 class="step-title">
                <i class="bi bi-info-circle me-2"></i>Información del Servicio
              </h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label required">Tipo de Servicio</label>
                  <div class="service-types">
                    <div
                      v-for="service in serviceTypes"
                      :key="service.value"
                      class="service-option"
                      :class="{ active: formData.tipo_servicio === service.value }"
                      @click="formData.tipo_servicio = service.value"
                    >
                      <i :class="service.icon"></i>
                      <div class="service-info">
                        <strong>{{ service.label }}</strong>
                        <small>{{ service.description }}</small>
                      </div>
                    </div>
                  </div>
                  <div v-if="errors.tipo_servicio" class="error-message">{{ errors.tipo_servicio }}</div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Cantidad / Muestras</label>
                    <input
                      v-model.number="formData.cantidad"
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': errors.cantidad }"
                      placeholder="Ej: 10"
                      min="1"
                    >
                    <small class="form-text text-muted">Número de muestras o unidades a analizar</small>
                    <div v-if="errors.cantidad" class="error-message">{{ errors.cantidad }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Unidad de Medida</label>
                    <select v-model="formData.unidad" class="form-select">
                      <option value="unidades">Unidades</option>
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="g">Gramos (g)</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="l">Litros (l)</option>
                      <option value="muestras">Muestras</option>
                      <option value="lotes">Lotes</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label required">Descripción del Servicio</label>
                  <textarea
                    v-model="formData.descripcion"
                    class="form-control"
                    :class="{ 'is-invalid': errors.descripcion }"
                    rows="4"
                    placeholder="Describa detalladamente el análisis o servicio que necesita..."
                  ></textarea>
                  <small class="form-text text-muted">Incluya información relevante como tipo de muestra, parámetros a analizar, etc.</small>
                  <div v-if="errors.descripcion" class="error-message">{{ errors.descripcion }}</div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">Fecha Requerida</label>
                    <input
                      v-model="formData.fecha_requerida"
                      type="date"
                      class="form-control"
                      :class="{ 'is-invalid': errors.fecha_requerida }"
                      :min="minDate"
                    >
                    <div v-if="errors.fecha_requerida" class="error-message">{{ errors.fecha_requerida }}</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Prioridad</label>
                    <select v-model="formData.prioridad" class="form-select">
                      <option value="normal">Normal (3-5 días hábiles)</option>
                      <option value="urgente">Urgente (1-2 días hábiles) +20%</option>
                      <option value="express">Express (24 horas) +50%</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paso 2: Detalles Específicos -->
            <div v-show="currentStep === 2" class="form-step">
              <h3 class="step-title">
                <i class="bi bi-clipboard-data me-2"></i>Detalles del Análisis
              </h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Método de Análisis Preferido</label>
                  <select v-model="formData.metodo_analisis" class="form-select">
                    <option value="">Seleccione un método</option>
                    <option value="cromatografia">Cromatografía</option>
                    <option value="espectrometria">Espectrometría</option>
                    <option value="microbiologia">Microbiología</option>
                    <option value="fisicoquimico">Fisicoquímico</option>
                    <option value="molecular">Biología Molecular</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Parámetros a Analizar</label>
                  <div class="parameters-list">
                    <div v-for="param in availableParameters" :key="param.value" class="parameter-checkbox">
                      <input
                        type="checkbox"
                        :id="`param-${param.value}`"
                        :value="param.value"
                        v-model="formData.parametros"
                        class="form-check-input"
                      >
                      <label :for="`param-${param.value}`" class="form-check-label">
                        {{ param.label }}
                        <small>({{ param.price }})</small>
                      </label>
                    </div>
                  </div>
                  <small class="form-text text-muted">Seleccione los parámetros que necesita analizar</small>
                </div>

                <div class="form-group">
                  <label class="form-label">Normativa o Estándar de Referencia</label>
                  <input
                    v-model="formData.normativa"
                    type="text"
                    class="form-control"
                    placeholder="Ej: NMX-EC-17025-IMNC-2018, ISO 9001, etc."
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Información Adicional</label>
                  <textarea
                    v-model="formData.informacion_adicional"
                    class="form-control"
                    rows="3"
                    placeholder="Información adicional relevante para la cotización..."
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Presupuesto Estimado (Opcional)</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      v-model.number="formData.presupuesto"
                      type="number"
                      class="form-control"
                      placeholder="Monto estimado"
                      min="0"
                      step="1000"
                    >
                    <span class="input-group-text">MXN</span>
                  </div>
                  <small class="form-text text-muted">Opcional: Indique su presupuesto estimado para esta cotización</small>
                </div>
              </div>
            </div>

            <!-- Paso 3: Documentos -->
            <div v-show="currentStep === 3" class="form-step">
              <h3 class="step-title">
                <i class="bi bi-paperclip me-2"></i>Documentos Adjuntos
              </h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Documentos de Referencia</label>
                  <div class="file-dropzone"
                       @dragover.prevent="isDragging = true"
                       @dragleave.prevent="isDragging = false"
                       @drop.prevent="handleFileDrop"
                       :class="{ dragging: isDragging }">
                    <input
                      type="file"
                      ref="fileInput"
                      @change="handleFileSelect"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                      class="file-input"
                    >
                    <div class="file-dropzone-content">
                      <i class="bi bi-cloud-upload fs-1"></i>
                      <p>Arrastre y suelte archivos aquí o <span class="browse-link">seleccione archivos</span></p>
                      <small>Formatos permitidos: PDF, DOC, XLS, JPG, PNG (máx. 10MB)</small>
                    </div>
                  </div>

                  <div v-if="archivosAdjuntos.length > 0" class="file-list">
                    <div v-for="(file, index) in archivosAdjuntos" :key="index" class="file-item">
                      <i :class="getFileIcon(file.nombre)"></i>
                      <span class="file-name">{{ file.nombre }}</span>
                      <span class="file-size">{{ formatFileSize(file.tamaño) }}</span>
                      <button type="button" class="btn-remove-file" @click="removeFile(index)">
                        <i class="bi bi-x-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Notas Adicionales</label>
                  <textarea
                    v-model="formData.notas"
                    class="form-control"
                    rows="3"
                    placeholder="Notas o instrucciones especiales para el equipo de laboratorio..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Paso 4: Confirmación -->
            <div v-show="currentStep === 4" class="form-step">
              <h3 class="step-title">
                <i class="bi bi-check2-circle me-2"></i>Confirmar Solicitud
              </h3>

              <div class="confirmation-card">
                <div class="confirmation-summary">
                  <h4>Resumen de la Solicitud</h4>

                  <div class="summary-section">
                    <h5>Servicio Solicitado</h5>
                    <div class="summary-item">
                      <span class="summary-label">Tipo de Servicio:</span>
                      <span class="summary-value">{{ getServiceLabel(formData.tipo_servicio) }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">Cantidad:</span>
                      <span class="summary-value">{{ formData.cantidad }} {{ formData.unidad }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">Fecha Requerida:</span>
                      <span class="summary-value">{{ formatDate(formData.fecha_requerida) }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">Prioridad:</span>
                      <span class="summary-value priority-badge" :class="formData.prioridad">
                        {{ getPriorityLabel(formData.prioridad) }}
                      </span>
                    </div>
                  </div>

                  <div class="summary-section" v-if="formData.parametros.length > 0">
                    <h5>Parámetros Seleccionados</h5>
                    <div class="parameters-tags">
                      <span v-for="param in formData.parametros" :key="param" class="parameter-tag">
                        {{ getParameterLabel(param) }}
                      </span>
                    </div>
                  </div>

                  <div class="summary-section">
                    <h5>Descripción</h5>
                    <p class="summary-description">{{ formData.descripcion }}</p>
                  </div>

                  <div class="summary-section" v-if="archivosAdjuntos.length > 0">
                    <h5>Documentos Adjuntos</h5>
                    <ul class="summary-files">
                      <li v-for="(file, index) in archivosAdjuntos" :key="index">
                        <i :class="getFileIcon(file.nombre)"></i> {{ file.nombre }}
                      </li>
                    </ul>
                  </div>

                  <div class="summary-warning">
                    <i class="bi bi-info-circle-fill"></i>
                    <p>Al enviar esta solicitud, acepta que un asesor se comunicará con usted en un plazo máximo de 24 horas hábiles para proporcionar la cotización detallada.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de navegación -->
            <div class="form-actions">
              <button
                v-if="currentStep > 1"
                type="button"
                class="btn btn-secondary"
                @click="prevStep"
              >
                <i class="bi bi-arrow-left me-1"></i> Anterior
              </button>

              <button
                v-if="currentStep < totalSteps"
                type="button"
                class="btn btn-primary"
                @click="nextStep"
              >
                Siguiente <i class="bi bi-arrow-right ms-1"></i>
              </button>

              <button
                v-if="currentStep === totalSteps"
                type="submit"
                class="btn btn-success"
                :disabled="submitting"
              >
                <i v-if="!submitting" class="bi bi-send me-1"></i>
                <i v-else class="bi bi-hourglass-split me-1"></i>
                {{ submitting ? 'Enviando...' : 'Enviar Solicitud' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Cotizaciones recientes -->
        <div class="recent-quotations-section" v-if="recentQuotations.length > 0">
          <div class="section-header">
            <h3 class="section-title">
              <i class="bi bi-clock-history me-2"></i>Mis Solicitudes Recientes
            </h3>
            <router-link to="/cliente/cotizaciones" class="view-all-link">
              Ver todas <i class="bi bi-chevron-right"></i>
            </router-link>
          </div>

          <div class="recent-quotations-list">
            <div v-for="cotizacion in recentQuotations" :key="cotizacion.id" class="quotation-item">
              <div class="quotation-status" :class="getStatusClass(cotizacion.estado)">
                <i :class="getStatusIcon(cotizacion.estado)"></i>
                {{ getStatusLabel(cotizacion.estado) }}
              </div>
              <div class="quotation-info">
                <div class="quotation-id">#{{ cotizacion.id_cotizacion || cotizacion.id }}</div>
                <div class="quotation-service">{{ cotizacion.tipo_servicio_label || getServiceLabel(cotizacion.tipo_servicio) }}</div>
                <div class="quotation-date">{{ formatDate(cotizacion.fecha_solicitud || cotizacion.createdAt) }}</div>
              </div>
              <div class="quotation-actions">
                <router-link :to="`/cliente/cotizaciones/${cotizacion.id}`" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-eye"></i> Ver
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

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
import { ref, reactive, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del formulario
const currentStep = ref(1)
const totalSteps = 4
const submitting = ref(false)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Datos del formulario
interface CotizacionForm {
  tipo_servicio: string
  cantidad: number
  unidad: string
  descripcion: string
  fecha_requerida: string
  prioridad: string
  metodo_analisis: string
  parametros: string[]
  normativa: string
  informacion_adicional: string
  presupuesto: number | null
  notas: string
}

const formData = reactive<CotizacionForm>({
  tipo_servicio: '',
  cantidad: 1,
  unidad: 'muestras',
  descripcion: '',
  fecha_requerida: '',
  prioridad: 'normal',
  metodo_analisis: '',
  parametros: [],
  normativa: '',
  informacion_adicional: '',
  presupuesto: null,
  notas: ''
})

// Archivos adjuntos
interface ArchivoAdjunto {
  nombre: string
  tamaño: number
  tipo: string
  contenido: string // base64 o URL
}

const archivosAdjuntos = ref<ArchivoAdjunto[]>([])

// Errores de validación
const errors = reactive({
  tipo_servicio: '',
  cantidad: '',
  descripcion: '',
  fecha_requerida: ''
})

// Tipos de servicio disponibles
const serviceTypes = [
  { value: 'analisis_quimico', label: 'Análisis Químico', icon: 'bi bi-flask', description: 'Análisis de composición química, pureza, contaminantes' },
  { value: 'analisis_microbiologico', label: 'Análisis Microbiológico', icon: 'bi bi-virus', description: 'Detección de microorganismos, bacterias, hongos' },
  { value: 'analisis_fisico', label: 'Análisis Físico', icon: 'bi bi-rulers', description: 'Propiedades físicas, resistencia, textura' },
  { value: 'calibracion', label: 'Calibración', icon: 'bi bi-speedometer', description: 'Calibración de equipos e instrumentos' },
  { value: 'consultoria', label: 'Consultoría', icon: 'bi bi-chat-dots', description: 'Asesoría técnica y capacitación' },
  { value: 'otros', label: 'Otros Servicios', icon: 'bi bi-grid', description: 'Otros servicios especializados' }
]

// Parámetros disponibles
const availableParameters = [
  { value: 'ph', label: 'pH', price: '$250' },
  { value: 'humedad', label: 'Humedad', price: '$300' },
  { value: 'proteina', label: 'Proteína', price: '$450' },
  { value: 'grasa', label: 'Grasa', price: '$450' },
  { value: 'cenizas', label: 'Cenizas', price: '$350' },
  { value: 'metales_pesados', label: 'Metales Pesados', price: '$800' },
  { value: 'recuento_bacterias', label: 'Recuento de Bacterias', price: '$500' },
  { value: 'hongos_levaduras', label: 'Hongos y Levaduras', price: '$500' },
  { value: 'coliformes', label: 'Coliformes', price: '$400' },
  { value: 'viscosidad', label: 'Viscosidad', price: '$350' },
  { value: 'densidad', label: 'Densidad', price: '$300' }
]

// Cotizaciones recientes
const recentQuotations = ref<any[]>([])

// Toast
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Métodos de ayuda
const getServiceLabel = (value: string) => {
  const service = serviceTypes.find(s => s.value === value)
  return service ? service.label : value
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    normal: 'Normal (3-5 días)',
    urgente: 'Urgente (1-2 días)',
    express: 'Express (24 horas)'
  }
  return labels[priority] || priority
}

const getParameterLabel = (value: string) => {
  const param = availableParameters.find(p => p.value === value)
  return param ? param.label : value
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    cotizada: 'Cotizada',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pendiente: 'status-pending',
    en_revision: 'status-review',
    cotizada: 'status-quoted',
    aprobada: 'status-approved',
    rechazada: 'status-rejected'
  }
  return classes[status] || 'status-pending'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pendiente: 'bi bi-clock',
    en_revision: 'bi bi-arrow-repeat',
    cotizada: 'bi bi-file-text',
    aprobada: 'bi bi-check-circle',
    rechazada: 'bi bi-x-circle'
  }
  return icons[status] || 'bi bi-clock'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    pdf: 'bi bi-file-pdf',
    doc: 'bi bi-file-word',
    docx: 'bi bi-file-word',
    xls: 'bi bi-file-excel',
    xlsx: 'bi bi-file-excel',
    jpg: 'bi bi-file-image',
    jpeg: 'bi bi-file-image',
    png: 'bi bi-file-image'
  }
  return icons[ext || ''] || 'bi bi-file'
}

// Validación
const validateStep1 = () => {
  let isValid = true

  if (!formData.tipo_servicio) {
    errors.tipo_servicio = 'Por favor seleccione un tipo de servicio'
    isValid = false
  } else {
    errors.tipo_servicio = ''
  }

  if (!formData.cantidad || formData.cantidad < 1) {
    errors.cantidad = 'Ingrese una cantidad válida (mínimo 1)'
    isValid = false
  } else {
    errors.cantidad = ''
  }

  if (!formData.descripcion || formData.descripcion.trim().length < 10) {
    errors.descripcion = 'Por favor proporcione una descripción detallada (mínimo 10 caracteres)'
    isValid = false
  } else {
    errors.descripcion = ''
  }

  if (!formData.fecha_requerida) {
    errors.fecha_requerida = 'Por favor seleccione una fecha requerida'
    isValid = false
  } else {
    errors.fecha_requerida = ''
  }

  return isValid
}

// Navegación entre pasos
const nextStep = () => {
  if (currentStep.value === 1 && !validateStep1()) {
    showToast('Por favor complete los campos requeridos', 'warning', 'Campos incompletos')
    return
  }

  if (currentStep.value < totalSteps) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Manejo de archivos
const handleFileDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files) {
    processFiles(files)
  }
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    processFiles(input.files)
  }
}

const processFiles = async (files: FileList) => {
  for (const file of Array.from(files)) {
    if (file.size > 10 * 1024 * 1024) {
      showToast(`El archivo ${file.name} excede el límite de 10MB`, 'warning', 'Archivo muy grande')
      continue
    }

    const reader = new FileReader()
    const contenido = await new Promise<string>((resolve) => {
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })

    archivosAdjuntos.value.push({
      nombre: file.name,
      tamaño: file.size,
      tipo: file.type,
      contenido
    })
  }

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFile = (index: number) => {
  archivosAdjuntos.value.splice(index, 1)
}

// Envío del formulario
const handleSubmit = async () => {
  if (!validateStep1()) {
    currentStep.value = 1
    showToast('Por favor complete los campos requeridos', 'warning', 'Campos incompletos')
    return
  }

  submitting.value = true

  try {
    // Crear nueva cotización
    const newQuotation = {
      id: Date.now(),
      id_cotizacion: `COT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      tipo_servicio: formData.tipo_servicio,
      tipo_servicio_label: getServiceLabel(formData.tipo_servicio),
      cantidad: formData.cantidad,
      unidad: formData.unidad,
      descripcion: formData.descripcion,
      fecha_requerida: formData.fecha_requerida,
      prioridad: formData.prioridad,
      prioridad_label: getPriorityLabel(formData.prioridad),
      metodo_analisis: formData.metodo_analisis,
      parametros: formData.parametros,
      normativa: formData.normativa,
      informacion_adicional: formData.informacion_adicional,
      presupuesto: formData.presupuesto,
      notas: formData.notas,
      archivos: archivosAdjuntos.value.map(f => ({ nombre: f.nombre, tamaño: f.tamaño, tipo: f.tipo })),
      estado: 'pendiente',
      fecha_solicitud: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    // Cargar datos existentes de localStorage
    const storedData = localStorage.getItem('mock_cliente_data')
    let mockData: any = {}

    if (storedData) {
      mockData = JSON.parse(storedData)
    }

    // Inicializar array de cotizaciones si no existe
    if (!mockData.cotizaciones) {
      mockData.cotizaciones = []
    }

    // Agregar nueva cotización
    mockData.cotizaciones.unshift(newQuotation)

    // Guardar en localStorage
    localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))

    // Mostrar mensaje de éxito
    showToast('Solicitud enviada correctamente. Un asesor se comunicará con usted.', 'success', 'Solicitud Enviada')

    // Redirigir a Mis cotizaciones después de 2 segundos
    setTimeout(() => {
      router.push('/cliente/cotizaciones')
    }, 2000)

  } catch (error) {
    console.error('Error al guardar cotización:', error)
    showToast('Error al enviar la solicitud. Por favor intente nuevamente.', 'error', 'Error')
  } finally {
    submitting.value = false
  }
}

// Cargar cotizaciones recientes
const loadRecentQuotations = () => {
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    try {
      const mockData = JSON.parse(storedData)
      if (mockData.cotizaciones && mockData.cotizaciones.length > 0) {
        recentQuotations.value = mockData.cotizaciones.slice(0, 3)
      }
    } catch (e) {
      console.error('Error loading recent quotations:', e)
    }
  }
}

// Toast
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

// Computed para toast
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
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Establecer fecha mínima (hoy + 3 días)
  const minDateObj = new Date()
  minDateObj.setDate(minDateObj.getDate() + 3)
  const defaultDate = minDateObj.toISOString().split('T')[0]
  formData.fecha_requerida = defaultDate

  // Cargar cotizaciones recientes
  loadRecentQuotations()
})
</script>

<style scoped>
.solicitar-cotizacion-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .solicitar-cotizacion-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */
.page-header {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem 0;
  box-shadow: 0 2px 15px var(--shadow-color, rgba(0, 0, 0, 0.08));
}

[data-bs-theme="dark"] .page-header {
  background: var(--color-light, #121212);
  border-bottom: 1px solid var(--color-gray-light, #2d2d2d);
}

.breadcrumb {
  margin-bottom: 1rem;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.breadcrumb-item.active {
  color: var(--color-primary, #1E9E4A);
  font-weight: 500;
}

.breadcrumb-link {
  color: var(--color-gray, #6C757D);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--color-primary, #1E9E4A);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .page-title {
  color: var(--color-dark, #F8F9FA);
}

.page-subtitle {
  color: var(--color-gray, #6C757D);
  margin: 0;
}

/* Form Card */
.main-content {
  padding: 2rem 0 3rem;
}

.form-card {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
}

[data-bs-theme="dark"] .form-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

/* Progress Steps */
.form-progress {
  padding: 2rem 2rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  color: white;
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.step.completed .step-number {
  background: var(--color-success, #28a745);
  color: white;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-gray, #6C757D);
}

.step.active .step-label {
  color: var(--color-primary, #1E9E4A);
  font-weight: 600;
}

.step-line {
  flex: 1;
  height: 2px;
  background: var(--color-gray-light, #E9ECEF);
  margin: 0 0.5rem;
}

.step-line.active {
  background: var(--color-primary, #1E9E4A);
}

/* Form Steps */
.cotizacion-form {
  padding: 2rem;
}

.form-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-primary, #1E9E4A);
  display: inline-block;
}

[data-bs-theme="dark"] .step-title {
  color: var(--color-dark, #F8F9FA);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .form-label {
  color: var(--color-dark, #F8F9FA);
}

.form-label.required::after {
  content: '*';
  color: #dc3545;
  margin-left: 0.25rem;
}

.form-control,
.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .form-control,
[data-bs-theme="dark"] .form-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 0 0 0.25rem rgba(30, 158, 74, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-text {
  font-size: 0.75rem;
}

/* Service Types */
.service-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.service-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .service-option {
  border-color: var(--color-gray-light, #2d2d2d);
}

.service-option:hover {
  border-color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.05);
}

.service-option.active {
  border-color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.1);
}

.service-option i {
  font-size: 2rem;
  color: var(--color-primary, #1E9E4A);
}

.service-info {
  flex: 1;
}

.service-info strong {
  display: block;
  font-size: 1rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .service-info strong {
  color: var(--color-dark, #F8F9FA);
}

.service-info small {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

/* Parameters List */
.parameters-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
}

[data-bs-theme="dark"] .parameters-list {
  border-color: var(--color-gray-light, #2d2d2d);
}

.parameter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.parameter-checkbox:hover {
  background: rgba(0, 0, 0, 0.02);
}

[data-bs-theme="dark"] .parameter-checkbox:hover {
  background: rgba(255, 255, 255, 0.02);
}

.form-check-input {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: var(--color-primary, #1E9E4A);
  border-color: var(--color-primary, #1E9E4A);
}

.form-check-label {
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .form-check-label {
  color: var(--color-dark, #F8F9FA);
}

.form-check-label small {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

/* File Dropzone */
.file-dropzone {
  border: 2px dashed var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

[data-bs-theme="dark"] .file-dropzone {
  border-color: var(--color-gray-light, #2d2d2d);
}

.file-dropzone.dragging {
  border-color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.05);
}

.file-dropzone:hover {
  border-color: var(--color-primary, #1E9E4A);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-dropzone-content i {
  font-size: 2.5rem;
  color: var(--color-primary, #1E9E4A);
  margin-bottom: 0.5rem;
}

.file-dropzone-content p {
  margin: 0.5rem 0;
  color: var(--color-gray, #6C757D);
}

.browse-link {
  color: var(--color-primary, #1E9E4A);
  text-decoration: underline;
  cursor: pointer;
}

.file-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 8px;
}

[data-bs-theme="dark"] .file-item {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.file-item i {
  font-size: 1.25rem;
  color: var(--color-primary, #1E9E4A);
}

.file-name {
  flex: 1;
  font-size: 0.9rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .file-name {
  color: var(--color-dark, #F8F9FA);
}

.file-size {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

.btn-remove-file {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-remove-file:hover {
  transform: scale(1.1);
}

/* Confirmation Card */
.confirmation-card {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 16px;
  padding: 1.5rem;
}

[data-bs-theme="dark"] .confirmation-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.confirmation-summary h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 1.5rem;
}

[data-bs-theme="dark"] .confirmation-summary h4 {
  color: var(--color-dark, #F8F9FA);
}

.summary-section {
  margin-bottom: 1.5rem;
}

.summary-section h5 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary, #1E9E4A);
  margin-bottom: 0.75rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .summary-item {
  border-bottom-color: var(--color-gray-light, #2d2d2d);
}

.summary-label {
  font-weight: 500;
  color: var(--color-gray, #6C757D);
}

.summary-value {
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .summary-value {
  color: var(--color-dark, #F8F9FA);
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.priority-badge.normal {
  background: #d4edda;
  color: #155724;
}

.priority-badge.urgente {
  background: #fff3cd;
  color: #856404;
}

.priority-badge.express {
  background: #f8d7da;
  color: #721c24;
}

.parameters-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.parameter-tag {
  padding: 0.25rem 0.75rem;
  background: var(--color-primary, #1E9E4A);
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
}

.summary-description {
  color: var(--color-gray, #6C757D);
  line-height: 1.5;
  margin: 0;
}

.summary-files {
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-files li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.summary-warning {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 12px;
  margin-top: 1rem;
}

.summary-warning i {
  font-size: 1.5rem;
  color: #ffc107;
}

.summary-warning p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .form-actions {
  border-top-color: var(--color-gray-light, #2d2d2d);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Recent Quotations */
.recent-quotations-section {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem;
}

[data-bs-theme="dark"] .recent-quotations-section {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .section-title {
  color: var(--color-dark, #F8F9FA);
}

.view-all-link {
  color: var(--color-primary, #1E9E4A);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.recent-quotations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quotation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(129, 199, 132, 0.01) 100%));
  border-radius: 12px;
  transition: all 0.3s ease;
}

.quotation-item:hover {
  transform: translateX(4px);
}

.quotation-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-review {
  background: #cfe2ff;
  color: #084298;
}

.status-quoted {
  background: #cff4fc;
  color: #055160;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.quotation-info {
  flex: 1;
}

.quotation-id {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
}

.quotation-service {
  font-size: 0.9rem;
  color: var(--color-dark, #212529);
  margin: 0.25rem 0;
}

[data-bs-theme="dark"] .quotation-service {
  color: var(--color-dark, #F8F9FA);
}

.quotation-date {
  font-size: 0.7rem;
  color: var(--color-gray, #6C757D);
}

/* Toast */
.toast {
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(12, 18, 30, 0.08);
}

/* Responsive */
@media (max-width: 992px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .service-types {
    grid-template-columns: 1fr;
  }

  .parameters-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .cotizacion-form {
    padding: 1.5rem;
  }

  .form-progress {
    padding: 1.5rem 1.5rem 0;
  }

  .step-label {
    display: none;
  }

  .step-line {
    display: none;
  }

  .progress-steps {
    justify-content: center;
  }

  .quotation-item {
    flex-wrap: wrap;
  }

  .quotation-status {
    order: -1;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding: 1rem 0;
  }

  .form-card {
    margin: 1rem;
  }

  .cotizacion-form {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
