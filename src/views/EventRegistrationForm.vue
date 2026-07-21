<template>
  <div class="registration-form">
    <!-- Header -->
    <div class="form-header">
      <div class="event-preview">
        <div class="preview-image" :style="{ backgroundImage: `url(${event.image})` }"></div>
        <div class="preview-content">
          <h5 class="preview-title">{{ event.title }}</h5>
          <div class="preview-meta">
            <span class="meta-item">
              <i class="bi bi-calendar"></i>
              {{ formattedDate }}
            </span>
            <span class="meta-item">
              <i class="bi bi-clock"></i>
              {{ event.time }}
            </span>
            <span class="meta-item">
              <i class="bi" :class="modalityIcon"></i>
              {{ modalityText }}
            </span>
          </div>
          <div class="preview-price">
            <template v-if="event.price > 0">
              <span class="price-amount">${{ event.price.toLocaleString() }}</span>
              <span class="price-label">MXN</span>
            </template>
            <template v-else>
              <span class="price-free">Gratuito</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="registration-form-content">
      <!-- Paso 1: Información Personal -->
      <div v-if="currentStep === 1" class="form-step">
        <h6 class="step-title">Información Personal</h6>

        <div class="row g-3">
          <div class="col-md-6">
            <div class="form-group">
              <label for="firstName" class="form-label">
                <i class="bi bi-person"></i> Nombre(s) *
              </label>
              <input
                v-model="formData.firstName"
                type="text"
                id="firstName"
                class="form-control"
                :class="{ 'is-invalid': errors.firstName }"
                placeholder="Ingresa tu(s) nombre(s)"
                required
                @input="clearError('firstName')"
              >
              <div v-if="errors.firstName" class="invalid-feedback">
                {{ errors.firstName }}
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label for="lastName" class="form-label">
                <i class="bi bi-person"></i> Apellido(s) *
              </label>
              <input
                v-model="formData.lastName"
                type="text"
                id="lastName"
                class="form-control"
                :class="{ 'is-invalid': errors.lastName }"
                placeholder="Ingresa tu(s) apellido(s)"
                required
                @input="clearError('lastName')"
              >
              <div v-if="errors.lastName" class="invalid-feedback">
                {{ errors.lastName }}
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="bi bi-envelope"></i> Correo electrónico *
              </label>
              <input
                v-model="formData.email"
                type="email"
                id="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                placeholder="correo@ejemplo.com"
                required
                @input="clearError('email')"
              >
              <div v-if="errors.email" class="invalid-feedback">
                {{ errors.email }}
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label for="phone" class="form-label">
                <i class="bi bi-telephone"></i> Teléfono *
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                id="phone"
                class="form-control"
                :class="{ 'is-invalid': errors.phone }"
                placeholder="+52 (XXX) XXX-XXXX"
                required
                @input="clearError('phone')"
              >
              <div v-if="errors.phone" class="invalid-feedback">
                {{ errors.phone }}
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label for="company" class="form-label">
                <i class="bi bi-building"></i> Empresa / Organización
              </label>
              <input
                v-model="formData.company"
                type="text"
                id="company"
                class="form-control"
                placeholder="Nombre de tu empresa (opcional)"
                @input="clearError('company')"
              >
            </div>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label for="position" class="form-label">
                <i class="bi bi-briefcase"></i> Puesto / Cargo
              </label>
              <input
                v-model="formData.position"
                type="text"
                id="position"
                class="form-control"
                placeholder="Tu puesto actual (opcional)"
                @input="clearError('position')"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Paso 2: Información del Evento -->
      <div v-if="currentStep === 2" class="form-step">
        <h6 class="step-title">Información del Evento</h6>

        <!-- Especializaciones: elegir tipo (área/rama), seleccionar padre y escoger subitems -->
        <div class="form-group">
          <label class="form-label">
            <i class="bi bi-grid-1x2"></i> Especializaciones (selecciona tipo, padre y una o más opciones)
          </label>

          <div class="mt-2">
            <label class="form-label small d-block mb-2">Selecciona {{ formData.specializationType === 'area' ? 'Área' : formData.specializationType === 'rama' ? 'Rama' : 'tipo' }}:</label>
            <div class="hear-about-options">
              <div
                v-for="option in specTypeOptions"
                :key="option.value"
                class="hear-about-option"
                :class="{ 'selected': formData.specializationType === option.value }"
                @click="selectSpecType(option.value)"
              >
                <i :class="option.icon"></i>
                <span>{{ option.label }}</span>
              </div>
            </div>
          </div>

          <div v-if="formData.specializationType">
            <div class="mb-2">
              <label class="form-label small">Selecciona {{ formData.specializationType === 'area' ? 'Área' : 'Rama' }}:</label>
              <div class="hear-about-options mt-2">
                <div
                  v-for="p in (formData.specializationType === 'area' ? areasList : ramasList)"
                  :key="p.id"
                  class="hear-about-option"
                  :class="{ 'selected': formData.specializationParentId === p.id }"
                  @click="selectParent(p)"
                >
                  <template v-if="isEmojiIcon(p.icon)">
                    <span class="emoji-icon">{{ p.icon }}</span>
                  </template>
                  <template v-else>
                    <i :class="p.icon || (formData.specializationType === 'area' ? 'bi bi-layers' : 'bi bi-diagram-3')"></i>
                  </template>
                  <span>{{ p.nombre }}</span>
                </div>
              </div>
              <div v-if="(formData.specializationType === 'area' ? areasList : ramasList).length === 0" class="text-muted small mt-2">No hay {{ formData.specializationType === 'area' ? 'áreas' : 'ramas' }} disponibles</div>
            </div>

            <div v-if="availableSpecializations.length">
              <label class="form-label small">Especializaciones disponibles:</label>

              <div class="dropdown" style="position:relative; display:inline-block;">
                <button ref="specBtn" class="btn btn-outline-secondary" type="button" @click="showSpecDropdown = !showSpecDropdown">
                  Seleccionar especializaciones
                  <span class="badge bg-secondary ms-2" v-if="(formData.specializations || []).length">{{ (formData.specializations || []).length }}</span>
                </button>
                <div v-if="showSpecDropdown" ref="specDropdown" class="spec-dropdown p-2" style="min-width: 280px; max-height: 220px; overflow:auto; position:static; margin-top:0.75rem; z-index:1200;">
                  <div class="d-flex flex-wrap gap-2">
                    <div
                      v-for="item in availableSpecializations"
                      :key="item.id"
                      class="hear-about-option spec-option"
                      :class="{ 'selected': isSpecializationSelected(item.id) }"
                      @click="toggleSpecialization(item)"
                    >
                      <template v-if="isEmojiIcon(item.icon)">
                        <span class="emoji-icon">{{ item.icon }}</span>
                      </template>
                      <template v-else>
                        <i :class="item.icon || 'bi bi-tag'"></i>
                      </template>
                      <span>{{ item.nombre }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-muted small">Selecciona un padre para cargar especializaciones</div>
          </div>
          <div v-if="errors.specializations" class="text-danger small mt-2">{{ errors.specializations }}</div>
        </div>

        <!-- ¿Cómo te enteraste? -->
        <div class="form-group">
          <label class="form-label">
            <i class="bi bi-megaphone"></i> ¿Cómo te enteraste del evento? *
          </label>
          <div class="hear-about-options">
            <div
              v-for="option in hearAboutOptions"
              :key="option.value"
              class="hear-about-option"
              :class="{ 'selected': formData.heardAbout === option.value }"
              @click="formData.heardAbout = option.value"
            >
              <i :class="option.icon"></i>
              <span>{{ option.label }}</span>
            </div>
          </div>
          <div v-if="errors.heardAbout" class="text-danger small mt-2">
            {{ errors.heardAbout }}
          </div>
        </div>
      </div>

      <!-- Paso 3: Confirmación y Pago -->
      <div v-if="currentStep === 3" class="form-step">
        <h6 class="step-title">Confirmación y Pago</h6>

        <!-- Resumen -->
        <div class="summary-card">
          <div class="summary-header">
            <h6>Resumen de tu inscripción</h6>
          </div>
          <div class="summary-body">
            <div class="summary-item">
              <span class="summary-label">Evento:</span>
              <span class="summary-value">{{ event.title }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Fecha:</span>
              <span class="summary-value">{{ formattedDate }} - {{ event.time }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Especializaciones:</span>
              <span class="summary-value">
                <template v-if="formData.specializations && formData.specializations.length">
                  {{ (formData.specializations || []).map(s => s.nombre).join(', ') }}
                </template>
                <template v-else>No especificada</template>
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Participante:</span>
              <span class="summary-value">{{ formData.firstName }} {{ formData.lastName }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Email:</span>
              <span class="summary-value">{{ formData.email }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Empresa:</span>
              <span class="summary-value">{{ formData.company || 'No especificada' }}</span>
            </div>

            <hr class="my-3">

            <div class="summary-item total">
              <span class="summary-label">Total a pagar:</span>
              <span class="summary-value price">
                <template v-if="event.price > 0">
                  ${{ event.price.toLocaleString() }} MXN
                </template>
                <template v-else>
                  Gratuito
                </template>
              </span>
            </div>
          </div>
        </div>

        <!-- Términos y condiciones -->
        <div class="form-group">
          <div class="form-check">
            <input
              v-model="formData.termsAccepted"
              type="checkbox"
              id="terms"
              class="form-check-input"
              :class="{ 'is-invalid': errors.termsAccepted }"
              required
            >
            <label for="terms" class="form-check-label">
              Acepto los <a href="#" class="text-primary" @click.prevent="openTermsModal">términos y condiciones</a>
              y la <a href="#" class="text-primary" @click.prevent="openPrivacyModal">política de privacidad</a> *
            </label>
            <div v-if="errors.termsAccepted" class="invalid-feedback d-block">
              {{ errors.termsAccepted }}
            </div>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="form-group">
          <div class="form-check">
            <input
              v-model="formData.newsletterSubscribed"
              type="checkbox"
              id="newsletter"
              class="form-check-input"
            >
            <label for="newsletter" class="form-check-label">
              Deseo recibir información sobre futuros eventos, promociones y novedades de SENA
            </label>
          </div>
        </div>

        <!-- Método de pago (si aplica) -->
        <div v-if="event.price > 0" class="payment-methods">
          <h6 class="mb-3">Método de pago</h6>
          <div class="payment-options">
            <div
              v-for="method in paymentMethods"
              :key="method.value"
              class="payment-option"
              :class="{ 'selected': formData.paymentMethod === method.value }"
              @click="formData.paymentMethod = method.value"
            >
              <i :class="method.icon"></i>
              <span>{{ method.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegación de pasos -->
      <div class="form-navigation">
        <div class="step-indicator">
          <div
            v-for="step in 3"
            :key="step"
            class="step-dot"
            :class="{ 'active': currentStep >= step, 'completed': currentStep > step }"
          ></div>
        </div>

        <div class="navigation-buttons">
          <button
            v-if="currentStep > 1"
            type="button"
            class="btn btn-outline-secondary"
            @click="prevStep"
            :disabled="isSubmitting"
          >
            <i class="bi bi-arrow-left me-2"></i>Atrás
          </button>

          <button
            v-if="currentStep < 3"
            type="button"
            class="btn btn-primary"
            @click="nextStep"
            :disabled="isSubmitting"
          >
            Siguiente <i class="bi bi-arrow-right ms-2"></i>
          </button>

          <button
            v-if="currentStep === 3"
            type="submit"
            class="btn btn-success"
            :disabled="isSubmitting"
          >
            <template v-if="isSubmitting">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Procesando...
            </template>
            <template v-else>
              <i class="bi bi-check-circle me-2"></i>
              {{ event.price > 0 ? 'Pagar e inscribirme' : 'Confirmar inscripción' }}
            </template>
          </button>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="form-footer">
        <div class="alert alert-info mb-0">
          <div class="d-flex align-items-start">
            <i class="bi bi-info-circle me-2 mt-1"></i>
            <div>
              <small>
                Recibirás un correo de confirmación con los detalles del evento.
                Para eventos presenciales, presenta tu identificación oficial al llegar.
              </small>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import type { Event } from '@/types/events'

interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  // Especializaciones: tipo ('area'|'rama'), id del padre seleccionado y lista de subitems seleccionados
  specializationType?: 'area' | 'rama' | ''
  specializationParentId?: number | null
  specializations?: Array<{ id: number, nombre: string }>
  heardAbout: string
  termsAccepted: boolean
  newsletterSubscribed: boolean
  paymentMethod: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  specializations?: string
  heardAbout?: string
  termsAccepted?: string
}

interface Props {
  event: Event
}

interface Emits {
  submit: [data: any]
  cancel: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado
const currentStep = ref(1)
const isSubmitting = ref(false)
const formData = ref<RegistrationFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  specializationType: '',
  specializationParentId: null,
  specializations: [],
  heardAbout: '',
  termsAccepted: false,
  newsletterSubscribed: true,
  paymentMethod: 'transfer'
})

const errors = ref<FormErrors>({})

// Datos
// Catálogos para especializaciones (se cargarán desde API)
const areasList = ref<any[]>([])
const ramasList = ref<any[]>([])
const availableSpecializations = ref<any[]>([])

const showSpecDropdown = ref(false)

// Helper to detect if an icon value is an emoji/text (not a CSS class)
const isEmojiIcon = (val: any) => {
  if (!val) return false
  if (typeof val !== 'string') return false
  // heuristic: if contains space or starts with 'bi' treat as class, otherwise emoji/text
  if (val.includes(' ') || val.startsWith('bi') || val.includes('text-')) return false
  return true
}

// API base (usar variable Vite o fallback con prefijo /api)
import { API_BASE } from '@/config/api'

// Refs para manejar click fuera
const specBtn = ref<HTMLElement | null>(null)
const specDropdown = ref<HTMLElement | null>(null)

const onDocClick = (e: Event) => {
  const target = e.target as Node
  if (!specBtn.value || !specDropdown.value) return
  if (specBtn.value.contains(target) || specDropdown.value.contains(target)) return
  showSpecDropdown.value = false
}

const loadCatalogParents = async () => {
  try {
    const [areasRes, ramasRes] = await Promise.all([
      fetch(`${API_BASE}/areas`),
      fetch(`${API_BASE}/ramas`)
    ])
    if (areasRes.ok) areasList.value = await areasRes.json()
    if (ramasRes.ok) ramasList.value = await ramasRes.json()
  } catch (err) {
    console.error('Error cargando catálogos:', err)
  }
}

const loadSpecializations = async (type: 'area' | 'rama', parentId: number | null) => {
  availableSpecializations.value = []
  if (!parentId) return
  try {
    const url = type === 'area' ? `${API_BASE}/areas/${parentId}/subareas` : `${API_BASE}/ramas/${parentId}/subramas`
    const res = await fetch(url)
    if (res.ok) {
      availableSpecializations.value = await res.json()
    }
  } catch (err) {
    console.error('Error cargando subitems:', err)
  }
}

const onSpecializationTypeChange = () => {
  formData.value.specializationParentId = null
  formData.value.specializations = []
  availableSpecializations.value = []
}

const onParentChange = async () => {
  await loadSpecializations(formData.value.specializationType as 'area' | 'rama', formData.value.specializationParentId as number)
}

const isSpecializationSelected = (id: number) => {
  return (formData.value.specializations || []).some((s:any) => s.id === id)
}

const toggleSpecialization = (item: any) => {
  const list = formData.value.specializations || []
  const idx = list.findIndex((s:any) => s.id === item.id)
  if (idx === -1) list.push({ id: item.id, nombre: item.nombre })
  else list.splice(idx, 1)
  formData.value.specializations = list
}

const selectParent = (p: any) => {
  formData.value.specializationParentId = p.id
  // limpiar selecciones previas y cargar subitems
  formData.value.specializations = []
  loadSpecializations(formData.value.specializationType as 'area' | 'rama', p.id)
}

const hearAboutOptions = [
  { value: 'website', label: 'Sitio web SENA', icon: 'bi bi-globe' },
  { value: 'social', label: 'Redes sociales', icon: 'bi bi-facebook' },
  { value: 'email', label: 'Email / Newsletter', icon: 'bi bi-envelope' },
  { value: 'colleague', label: 'Colega / Amigo', icon: 'bi bi-people' },
  { value: 'search', label: 'Búsqueda en internet', icon: 'bi bi-search' },
  { value: 'other', label: 'Otro', icon: 'bi bi-three-dots' }
]

const specTypeOptions = [
  { value: 'area', label: 'Área', icon: 'bi bi-layers' },
  { value: 'rama', label: 'Rama', icon: 'bi bi-diagram-3' }
]

const selectSpecType = (val: 'area' | 'rama') => {
  formData.value.specializationType = val
  onSpecializationTypeChange()
}

const paymentMethods = [
  { value: 'transfer', label: 'Transferencia bancaria', icon: 'bi bi-bank' },
  { value: 'card', label: 'Tarjeta de crédito/débito', icon: 'bi bi-credit-card' },
  { value: 'paypal', label: 'PayPal', icon: 'bi bi-paypal' },
  { value: 'cash', label: 'Efectivo', icon: 'bi bi-cash' }
]

// Computed
const formattedDate = computed(() => {
  const date = new Date(props.event.date)
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const modalityText = computed(() => {
  const modalities: Record<string, string> = {
    'presential': 'Presencial',
    'virtual': 'Virtual',
    'hybrid': 'Híbrido'
  }
  return modalities[props.event.modality] || props.event.modality
})

const modalityIcon = computed(() => {
  const icons: Record<string, string> = {
    'presential': 'bi-geo-alt',
    'virtual': 'bi-camera-video',
    'hybrid': 'bi-laptop'
  }
  return icons[props.event.modality] || 'bi-calendar'
})

// Removed participation mode text; replaced by especializaciones

// Métodos
const validateStep = (step: number): boolean => {
  errors.value = {}
  let isValid = true

  switch (step) {
    case 1:
      if (!formData.value.firstName.trim()) {
        errors.value.firstName = 'El nombre es requerido'
        isValid = false
      }
      if (!formData.value.lastName.trim()) {
        errors.value.lastName = 'El apellido es requerido'
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
      if (!formData.value.phone) {
        errors.value.phone = 'El teléfono es requerido'
        isValid = false
      } else if (!phoneRegex.test(formData.value.phone)) {
        errors.value.phone = 'Ingresa un teléfono válido'
        isValid = false
      }
      break

    case 2:
      // Validar especializaciones: tipo, padre y al menos una selección
      if (!formData.value.specializationType) {
        errors.value.specializations = 'Selecciona tipo: área o rama'
        isValid = false
      } else if (!formData.value.specializationParentId) {
        errors.value.specializations = 'Selecciona la área o rama padre'
        isValid = false
      } else if (!(formData.value.specializations || []).length) {
        errors.value.specializations = 'Selecciona al menos una especialización'
        isValid = false
      }

      if (!formData.value.heardAbout) {
        errors.value.heardAbout = 'Selecciona cómo te enteraste del evento'
        isValid = false
      }
      break

    case 3:
      if (!formData.value.termsAccepted) {
        errors.value.termsAccepted = 'Debes aceptar los términos y condiciones'
        isValid = false
      }
      break
  }

  return isValid
}

const clearError = (field: keyof FormErrors) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const handleSubmit = async () => {
  if (!validateStep(3)) return

  isSubmitting.value = true

  try {
    // Preparar apellidos: dividir lastName en primer y segundo apellido si contiene espacio
    let primerApellido = (formData.value.lastName || '').trim()
    let segundoApellido: string | undefined = undefined
    if (primerApellido.includes(' ')) {
      const parts = primerApellido.split(/\s+/)
      primerApellido = parts.shift() || primerApellido
      segundoApellido = parts.join(' ') || undefined
    }

    const rawEventoId = props.event.id || (props.event as any).id_evento || null
    const eventoIdNum = rawEventoId ? Number(rawEventoId) : undefined

    const payload: any = {
      nombre: (formData.value.firstName || '').trim(),
      primer_apellido: primerApellido,
      correo: (formData.value.email || '').trim(),
      telefono: (formData.value.phone || '').trim(),
      difusion: formData.value.heardAbout || undefined,
      tipo: 'evento'
    }

    if (segundoApellido) payload.segundo_apellido = segundoApellido
    if (formData.value.company) payload.empresa = formData.value.company
    if (formData.value.position) payload.cargo = formData.value.position
    if (eventoIdNum && !Number.isNaN(eventoIdNum)) payload.evento_id = eventoIdNum

    // Mapear especializaciones: si es area -> area_id + subarea_id (primer seleccionado)
    if (formData.value.specializationType === 'area') {
      if (formData.value.specializationParentId) payload.area_id = Number(formData.value.specializationParentId)
      if (formData.value.specializations && formData.value.specializations.length) payload.subarea_id = Number(formData.value.specializations?.[0].id)
    } else if (formData.value.specializationType === 'rama') {
      if (formData.value.specializationParentId) payload.rama_id = Number(formData.value.specializationParentId)
      if (formData.value.specializations && formData.value.specializations.length) payload.subrama_id = Number(formData.value.specializations?.[0].id)
    }

    const res = await fetch(`${API_BASE}/inscripciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Error registrando inscripción')
    }

    const created = await res.json()

    // Emitir evento de éxito y mostrar confirmación
    emit('submit', { event: props.event, registration: created })
    // Mostrar confirmación simple
    try { alert('Inscripción registrada con éxito') } catch (e) { /* ignore */ }

    // Notify other tabs/pages to refresh participant lists
    try {
      localStorage.setItem('inscripcion_created', JSON.stringify({ tipo: 'evento', evento_id: eventoIdNum || null, curso_id: null, ts: Date.now() }))
    } catch (e) { /* ignore */ }

    // Opcional: resetear formulario o navegar
    currentStep.value = 1
    formData.value.firstName = ''
    formData.value.lastName = ''
    formData.value.email = ''
    formData.value.phone = ''
    formData.value.company = ''
    formData.value.position = ''
    formData.value.specializationType = ''
    formData.value.specializationParentId = null
    formData.value.specializations = []
    formData.value.heardAbout = ''
    formData.value.termsAccepted = false
    formData.value.newsletterSubscribed = true
    formData.value.paymentMethod = 'transfer'

  } catch (error: any) {
    console.error('Error al enviar el formulario:', error)
    try { alert('Error registrando inscripción: ' + (error.message || String(error))) } catch (e) {}
  } finally {
    isSubmitting.value = false
  }
}

const openTermsModal = () => {
  // Abrir modal de términos y condiciones
}

const openPrivacyModal = () => {
  // Abrir modal de política de privacidad
}

onMounted(() => {
  loadCatalogParents()
  document.addEventListener('click', onDocClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
})

</script>

<style scoped>
.registration-form {
  font-family: 'Montserrat', sans-serif;
}

/* Header */
.form-header {
  margin-bottom: 2rem;
}

.event-preview {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(167,183,41,0.08) 0%, rgba(167,183,41,0.04) 100%);
  border-radius: 12px;
  border: 1px solid rgba(167,183,41,0.2);
}

[data-bs-theme="dark"] .event-preview {
  background: linear-gradient(135deg, rgba(167,183,41,0.12) 0%, rgba(167,183,41,0.1) 100%);
}

.preview-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
}

.preview-title {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

[data-bs-theme="dark"] .preview-title {
  color: var(--color-dark, #F8F9FA);
}

.preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
}

.meta-item i {
  color: var(--color-primary, #1E9E4A);
}

.preview-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .price-amount {
  color: var(--color-dark, #F8F9FA);
}

.price-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.price-free {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-success, #198754);
}

/* Form Steps */
.form-step {
  animation: fadeIn 0.3s ease;
}

.step-title {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .step-title {
  color: var(--color-dark, #F8F9FA);
  border-bottom-color: var(--color-gray-light, #2d2d2d);
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
}

.form-label i {
  color: var(--color-primary, #1E9E4A);
}

.form-control {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .form-control {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.form-control:focus {
  border-color: var(--color-primary, #a7b729);
  box-shadow: 0 0 0 0.25rem rgba(167,183,41,0.25);
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .form-control:focus {
  background: var(--card-bg, #2d2d2d);
}

/* Participation Options */
.participation-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.participation-option {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .participation-option {
  border-color: var(--color-gray-light, #2d2d2d);
}

.participation-option:hover {
  border-color: var(--color-primary, #a7b729);
  background: linear-gradient(135deg, rgba(167,183,41,0.05) 0%, rgba(167,183,41,0.03) 100%);
}

.participation-option.selected {
  border-color: var(--color-primary, #a7b729);
  background: linear-gradient(135deg, rgba(167,183,41,0.1) 0%, rgba(167,183,41,0.05) 100%);
}

.participation-option i {
  font-size: 1.5rem;
  color: var(--color-primary, #a7b729);
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.participation-option h6 {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .participation-option h6 {
  color: var(--color-dark, #F8F9FA);
}

.participation-option p {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  margin: 0;
}

/* Hear About Options */
.hear-about-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.hear-about-option {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .hear-about-option {
  border-color: var(--color-gray-light, #2d2d2d);
}

.hear-about-option:hover {
  border-color: var(--color-primary, #1E9E4A);
}

.hear-about-option.selected {
  border-color: var(--color-primary, #1E9E4A);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
}

.hear-about-option i {
  color: var(--color-primary, #1E9E4A);
}

.hear-about-option span {
  font-weight: 500;
  color: var(--color-dark, #212529);
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .hear-about-option span {
  color: var(--color-dark, #F8F9FA);
}

/* Summary Card */
.summary-card {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

[data-bs-theme="dark"] .summary-card {
  border-color: var(--color-gray-light, #2d2d2d);
}

.summary-header {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .summary-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
  border-bottom-color: var(--color-gray-light, #2d2d2d);
}

.summary-header h6 {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0;
}

[data-bs-theme="dark"] .summary-header h6 {
  color: var(--color-dark, #F8F9FA);
}

.summary-body {
  padding: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.summary-item.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.summary-label {
  font-weight: 500;
  color: var(--color-gray, #6C757D);
}

.summary-value {
  font-weight: 500;
  color: var(--color-dark, #212529);
  text-align: right;
}

[data-bs-theme="dark"] .summary-value {
  color: var(--color-dark, #F8F9FA);
}

.summary-value.price {
  font-weight: 700;
  color: var(--color-primary, #1E9E4A);
  font-size: 1.25rem;
}

/* Payment Methods */
.payment-methods {
  margin: 1.5rem 0;
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.payment-option {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .payment-option {
  border-color: var(--color-gray-light, #2d2d2d);
}

.payment-option:hover {
  border-color: var(--color-primary, #1E9E4A);
}

.payment-option.selected {
  border-color: var(--color-primary, #1E9E4A);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
}

.payment-option i {
  font-size: 1.5rem;
  color: var(--color-primary, #1E9E4A);
}

.payment-option span {
  font-weight: 500;
  color: var(--color-dark, #212529);
  font-size: 0.9rem;
  text-align: center;
}

[data-bs-theme="dark"] .payment-option span {
  color: var(--color-dark, #F8F9FA);
}

/* Form Navigation */
.form-navigation {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--color-gray-light, #E9ECEF);
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-gray-light, #E9ECEF);
  transition: all 0.3s ease;
}

.step-dot.active {
  background: var(--color-primary, #1E9E4A);
  transform: scale(1.2);
}

.step-dot.completed {
  background: var(--color-primary, #1E9E4A);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.navigation-buttons .btn {
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}

/* Small variant for specialization buttons inside dropdown */
.spec-option {
  min-width: 140px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.spec-option i {
  font-size: 1rem;
}

.emoji-icon {
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
}

.spec-dropdown {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  padding: 0.5rem;
}

/* Form Footer */
.form-footer {
  margin-top: 1.5rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .event-preview {
    flex-direction: column;
    text-align: center;
  }

  .preview-image {
    width: 80px;
    height: 80px;
  }

  .preview-meta {
    justify-content: center;
  }

  .hear-about-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .payment-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .navigation-buttons .btn {
    width: 100%;
  }
}
</style>
