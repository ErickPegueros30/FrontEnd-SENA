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
                v.model="formData.company"
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

        <!-- Modalidad de participación -->
        <div class="form-group">
          <label class="form-label">
            <i class="bi bi-laptop"></i> Modalidad de participación *
          </label>
          <div class="participation-options">
            <div
              v-for="option in participationOptions"
              :key="option.value"
              class="participation-option"
              :class="{ 'selected': formData.participationMode === option.value }"
              @click="formData.participationMode = option.value"
            >
              <i :class="option.icon"></i>
              <div>
                <h6>{{ option.label }}</h6>
                <p class="small mb-0">{{ option.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="errors.participationMode" class="text-danger small mt-2">
            {{ errors.participationMode }}
          </div>
        </div>

        <!-- Requerimientos especiales -->
        <div class="form-group">
          <label for="specialRequirements" class="form-label">
            <i class="bi bi-clipboard-check"></i> Requerimientos especiales
          </label>
          <textarea
            v-model="formData.specialRequirements"
            id="specialRequirements"
            class="form-control"
            rows="3"
            placeholder="Alergias, discapacidades, preferencias alimentarias, etc. (opcional)"
          ></textarea>
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
              <span class="summary-label">Modalidad:</span>
              <span class="summary-value">{{ modalityText }} ({{ participationModeText }})</span>
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
import { ref, computed, type Ref } from 'vue'
import type { Event } from '@/types/events'

interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  participationMode: 'presential' | 'virtual' | 'hybrid'
  specialRequirements: string
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
  participationMode?: string
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
  participationMode: 'presential',
  specialRequirements: '',
  heardAbout: '',
  termsAccepted: false,
  newsletterSubscribed: true,
  paymentMethod: 'transfer'
})

const errors = ref<FormErrors>({})

// Datos
const participationOptions = [
  {
    value: 'presential',
    label: 'Presencial',
    description: 'Asistiré en persona a las instalaciones',
    icon: 'bi bi-geo-alt'
  },
  {
    value: 'virtual',
    label: 'Virtual',
    description: 'Participaré a través de la plataforma en línea',
    icon: 'bi bi-laptop'
  },
  {
    value: 'hybrid',
    label: 'Híbrido',
    description: 'Decidiré más cerca de la fecha del evento',
    icon: 'bi bi-phone'
  }
]

const hearAboutOptions = [
  { value: 'website', label: 'Sitio web SENA', icon: 'bi bi-globe' },
  { value: 'social', label: 'Redes sociales', icon: 'bi bi-facebook' },
  { value: 'email', label: 'Email / Newsletter', icon: 'bi bi-envelope' },
  { value: 'colleague', label: 'Colega / Amigo', icon: 'bi bi-people' },
  { value: 'search', label: 'Búsqueda en internet', icon: 'bi bi-search' },
  { value: 'other', label: 'Otro', icon: 'bi bi-three-dots' }
]

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

const participationModeText = computed(() => {
  const options: Record<string, string> = {
    'presential': 'Presencial',
    'virtual': 'Virtual',
    'hybrid': 'Híbrido'
  }
  return options[formData.value.participationMode] || formData.value.participationMode
})

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
      if (!formData.value.participationMode) {
        errors.value.participationMode = 'Selecciona una modalidad de participación'
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
    // Simular envío de formulario
    await new Promise(resolve => setTimeout(resolve, 2000))

    emit('submit', {
      event: props.event,
      registration: formData.value,
      timestamp: new Date().toISOString(),
      registrationId: `REG-${Date.now()}`
    })

  } catch (error) {
    console.error('Error al enviar el formulario:', error)
    // Mostrar error al usuario
  } finally {
    isSubmitting.value = false
  }
}

const openTermsModal = () => {
  // Abrir modal de términos y condiciones
  console.log('Abrir modal de términos y condiciones')
}

const openPrivacyModal = () => {
  // Abrir modal de política de privacidad
  console.log('Abrir modal de política de privacidad')
}
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
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-radius: 12px;
  border: 1px solid rgba(30, 158, 74, 0.2);
}

[data-bs-theme="dark"] .event-preview {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
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

[data-bs-theme="dark"] .form-label {
  color: var(--color-dark, #F8F9FA);
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
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 0 0 0.25rem rgba(30, 158, 74, 0.25);
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
  border-color: var(--color-primary, #1E9E4A);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

.participation-option.selected {
  border-color: var(--color-primary, #1E9E4A);
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.1) 0%, rgba(52, 181, 101, 0.05) 100%);
}

.participation-option i {
  font-size: 1.5rem;
  color: var(--color-primary, #1E9E4A);
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
