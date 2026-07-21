<template>
  <div :data-bs-theme="currentTheme" class="contacto-page">

    <!-- Hero Section -->
      <section class="contact-hero">
        <div class="contact-hero__bg" :style="heroBgStyle" aria-hidden="true"></div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Contáctanos</h1>
              <p class="hero-subtitle">
                Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo de expertos para
                resolver tus dudas o solicitar cotizaciones.
              </p>
              <div class="hero-features">
                <div class="hero-feature-item">
                  <div class="hero-feature-icon">
                    <i class="bi bi-clock-fill"></i>
                  </div>
                  <span>Respuesta en menos de 24 horas</span>
                </div>
                <div class="hero-feature-item">
                  <div class="hero-feature-icon">
                    <i class="bi bi-headset"></i>
                  </div>
                  <span>Atención personalizada</span>
                </div>
                <div class="hero-feature-item">
                  <div class="hero-feature-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <span>Confidencialidad garantizada</span>
                </div>
              </div>
            </div>
          </div>
            <div class="col-lg-5" data-aos="fade-left">
              <div class="contact-card">
              <div class="card-header-custom">
                <div class="card-icon-wrap">
                  <i class="bi bi-envelope-paper"></i>
                </div>
                <h5>Contacto Rápido</h5>
              </div>
              <div class="card-body-custom">
                <div class="contact-info-item">
                  <div class="contact-icon-box">
                    <i class="bi bi-telephone-fill"></i>
                  </div>
                  <div class="contact-details contact-phones">
                    <div class="phone-col phone-col--co">
                      <span class="phone-country">Colombia</span>
                      <a href="tel:+573161595252" class="phone-number">+57 316 159 5252</a>
                    </div>
                    <div class="phone-col phone-col--mx">
                      <span class="phone-country">México</span>
                      <a href="tel:+524421982279" class="phone-number">+52 (442) 198 2279</a>
                      <a href="tel:+524422241245" class="phone-number">+52 (442) 224 1245</a>
                      <a href="tel:+524426044818" class="phone-number">+52 (442) 604 4818</a>
                    </div>
                  </div>
                </div>
                <div class="contact-info-item">
                  <div class="contact-icon-box">
                    <i class="bi bi-envelope-fill"></i>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Atención a Clientes</span>
                    <div class="email-list">
                      <div class="email-item email-item--left">
                        <span class="email-role"></span>
                        <a href="mailto:ventas@senasc.mx" class="contact-email">ventas@senasc.mx</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="contact-info-item">
                  <div class="contact-icon-box">
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Dirección</span>
                    <p>Senda inmortal #24, Fracc. Milenio III</p>
                    <p>Santiago de Querétaro, Qro.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Modal -->
    <Teleport to="body">
      <div v-if="supportModalOpen" class="support-modal-backdrop" @click.self="closeSupportModal">
        <div class="support-modal">
          <div class="support-modal-header">
            <h5>Contactar Soporte</h5>
            <button class="modal-close" @click="closeSupportModal"><i class="bi bi-x"></i></button>
          </div>
          <div class="support-modal-body">
            <div class="support-phones">
              <h6>Números disponibles</h6>
              <ul>
                <li><a href="tel:+524421982279" class="support-phone">Ventas (MX): <span>+52 (442) 198 2279</span></a></li>
                <li><a href="tel:+524422241245" class="support-phone">Soporte (MX): <span>+52 (442) 224 1245</span></a></li>
                <li><a href="tel:+573161595252" class="support-phone">Ventas (CO): <span>+57 316 159 5252</span></a></li>
              </ul>
            </div>
            <div class="support-form">
              <label>Nombre</label>
              <input v-model="supportForm.nombre" class="form-control-custom" placeholder="Nombre completo" />
              <label class="mt-2">Correo</label>
              <input v-model="supportForm.email" class="form-control-custom" placeholder="correo@dominio.com" />
              <label class="mt-2">Teléfono (opcional)</label>
              <input v-model="supportForm.telefono" class="form-control-custom" placeholder="Teléfono" />
              <label class="mt-2">Motivo</label>
              <textarea v-model="supportForm.motivo" class="form-control-custom" rows="4" placeholder="Describe tu solicitud"></textarea>
            </div>
          </div>
          <div class="support-modal-footer">
            <button class="submit-btn" @click="submitSupport">Enviar solicitud</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Formulario de Contacto -->
    <section class="contact-form-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="form-wrapper" data-aos="fade-up">
              <div class="section-header text-center">
                <span class="section-eyebrow">Escríbenos</span>
                <h2 class="section-title">Envíanos un mensaje</h2>
                <div class="title-underline centered"></div>
                <p class="section-subtitle">Completa el formulario y nos pondremos en contacto contigo a la brevedad</p>
              </div>

              <form @submit.prevent="submitForm" class="contact-form">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="nombre" class="form-label-custom">
                        Nombre completo <span class="required">*</span>
                      </label>
                      <input
                        v-model="formData.nombre"
                        type="text"
                        id="nombre"
                        class="form-control-custom"
                        :class="{ 'is-invalid': errors.nombre }"
                        placeholder="Ingresa tu nombre completo"
                        required
                      >
                      <div v-if="errors.nombre" class="invalid-feedback-custom">
                        <i class="bi bi-exclamation-circle"></i> {{ errors.nombre }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="empresa" class="form-label-custom">
                        Empresa / Organización
                      </label>
                      <input
                        v-model="formData.empresa"
                        type="text"
                        id="empresa"
                        class="form-control-custom"
                        placeholder="Nombre de tu empresa"
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email" class="form-label-custom">
                        Correo electrónico <span class="required">*</span>
                      </label>
                      <input
                        v-model="formData.email"
                        type="email"
                        id="email"
                        class="form-control-custom"
                        :class="{ 'is-invalid': errors.email }"
                        placeholder="ejemplo@dominio.com"
                        required
                      >
                      <div v-if="errors.email" class="invalid-feedback-custom">
                        <i class="bi bi-exclamation-circle"></i> {{ errors.email }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="telefono" class="form-label-custom">
                        Teléfono <span class="required">*</span>
                      </label>
                      <input
                        v-model="formData.telefono"
                        type="tel"
                        id="telefono"
                        class="form-control-custom"
                        :class="{ 'is-invalid': errors.telefono }"
                        placeholder="+52 (XXX) XXX-XXXX"
                        required
                      >
                      <div v-if="errors.telefono" class="invalid-feedback-custom">
                        <i class="bi bi-exclamation-circle"></i> {{ errors.telefono }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-group">
                      <label class="form-label-custom">
                        Tipo de servicio (opcional, puede seleccionar varios)
                      </label>
                      <div class="services-grid">
                        <div
                          v-for="service in servicios"
                          :key="service.id"
                          class="service-option"
                          :class="{ 'selected': formData.servicio.includes(service.id) }"
                          @click="toggleService(service.id)"
                        >
                          <div class="service-option-icon">
                            <img v-if="isIconUrl(getIcon(service))" :src="getIcon(service)" :alt="service.name" />
                            <i v-else :class="getIcon(service)"></i>
                          </div>
                          <span>{{ service.name }}</span>
                        </div>
                      </div>
                      <div v-if="errors.servicio" class="invalid-feedback-custom d-block mt-2">
                        <i class="bi bi-exclamation-circle"></i> {{ errors.servicio }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-group">
                      <label for="mensaje" class="form-label-custom">
                        Mensaje <span class="required">*</span>
                      </label>
                      <textarea
                        v-model="formData.mensaje"
                        id="mensaje"
                        class="form-control-custom"
                        :class="{ 'is-invalid': errors.mensaje }"
                        rows="5"
                        placeholder="Describe tu requerimiento o pregunta..."
                        required
                      ></textarea>
                      <div class="character-count">
                        <small :class="mensajeLengthClass">
                          {{ formData.mensaje.length }}/500 caracteres
                        </small>
                      </div>
                      <div v-if="errors.mensaje" class="invalid-feedback-custom">
                        <i class="bi bi-exclamation-circle"></i> {{ errors.mensaje }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="privacy-check">
                      <input
                        v-model="formData.privacidad"
                        type="checkbox"
                        id="privacidad"
                        class="form-check-input-custom"
                        :class="{ 'is-invalid': errors.privacidad }"
                        required
                      >
                      <label for="privacidad" class="privacy-label">
                        Acepto la <a href="#" class="privacy-link" @click.prevent="showPrivacy = true">política de privacidad</a> y autorizo el tratamiento de mis datos personales <span class="required">*</span>
                      </label>
                      <div v-if="errors.privacidad" class="invalid-feedback-custom d-block">
                        <i class="bi bi-exclamation-circle"></i> {{ errors.privacidad }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <button
                      type="submit"
                      class="submit-btn"
                      :disabled="isSubmitting"
                    >
                      <template v-if="isSubmitting">
                        <span class="spinner"></span>
                        <span>Enviando...</span>
                      </template>
                      <template v-else>
                        <i class="bi bi-send-fill"></i>
                        <span>Enviar mensaje</span>
                        <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </template>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Información de Contacto -->
    <section class="contact-info-section">
      <div class="container">
        <div class="info-grid">
          <div class="info-card" data-aos="fade-up">
            <div class="info-icon-wrap">
              <i class="bi bi-geo-alt-fill"></i>
            </div>
            <h5 class="info-title">Ubicación</h5>
            <p class="info-text">
              Senda inmortal #24, Fracc. Milenio III<br>
              Santiago de Querétaro, Qro.
            </p>
            <a
              class="info-link"
              href="https://www.google.com.mx/maps/place/Senda+Inmortal+24,+Milenio+III,+76060+Santiago+de+Quer%C3%A9taro,+Qro./@20.5981534,-100.3471119,16.92z/data=!4m6!3m5!1s0x85d35ca95bdbd239:0x44a861fff652c76!8m2!3d20.5981767!4d-100.3451088!16s%2Fg%2F11csfg31h3?entry=ttu&g_ep=EgoyMDI2MDcwNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="bi bi-map"></i>
              <span>Ver en mapa</span>
            </a>
          </div>

          <div class="info-card" data-aos="fade-up" data-aos-delay="100">
            <div class="info-icon-wrap">
              <i class="bi bi-telephone-fill"></i>
            </div>
            <h5 class="info-title">Teléfonos</h5>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Ventas (MX):</span>
                <a href="tel:+524421982279" class="info-value">+52 (442) 198 2279</a>
              </div>
              <div class="info-item">
                <span class="info-label">Soporte (MX):</span>
                <a href="tel:+524422241245" class="info-value">+52 (442) 224 1245</a>
              </div>
              <div class="info-item">
                <span class="info-label">Ventas (CO):</span>
                <a href="tel:+573161595252" class="info-value">+57 316 159 5252</a>
              </div>
            </div>
          </div>

          <div class="info-card" data-aos="fade-up" data-aos-delay="200">
            <div class="info-icon-wrap">
              <i class="bi bi-clock-fill"></i>
            </div>
            <h5 class="info-title">Horarios</h5>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Lunes a Viernes:</span>
                <span class="info-value">8:00 - 18:00 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow">Ayuda</span>
          <h2 class="section-title">Preguntas Frecuentes</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Resolvemos tus dudas más comunes</p>
        </div>

        <div class="faq-grid">
          <div
            v-for="faq in faqs"
            :key="faq.id"
            class="faq-card"
            :class="{ 'expanded': expandedFaq === faq.id }"
          >
            <button class="faq-header" @click="toggleFaq(faq.id)">
              <div class="faq-question">
                <i class="bi bi-question-circle-fill"></i>
                <span>{{ faq.question }}</span>
              </div>
              <div class="faq-toggle">
                <i :class="expandedFaq === faq.id ? 'bi bi-dash-lg' : 'bi bi-plus-lg'"></i>
              </div>
            </button>
            <div class="faq-body" :class="{ 'show': expandedFaq === faq.id }">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>

        <div class="text-center mt-5">
          <p class="faq-footer-text">¿No encontraste lo que buscabas?</p>
          <button class="doc-btn" @click="openSupportModal">
            <i class="bi bi-chat-left-text"></i>
            <span>Contactar soporte</span>
          </button>
        </div>
      </div>
    </section>

    <FooterComponent :current-theme="currentTheme" />
    <PrivacyModal v-model:modelValue="showPrivacy" />
    <!-- Toast de notificaciones -->
    <Teleport to="body">
      <div v-if="showToast" class="toast-notification" :class="toastType">
        <div class="toast-icon">
          <i :class="toastIconClass"></i>
        </div>
        <div class="toast-content">
          <p>{{ toastMessage }}</p>
        </div>
        <button class="toast-close" @click="showToast = false">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import PrivacyModal from '@/components/PrivacyModal.vue'
import FooterComponent from '@/components/Footer/Footer.vue'
import { API_BASE } from '@/config/api'
import heroImg from '@/image/Home/elegirSena.png'

type ToastType = 'success' | 'warning' | 'info'

interface FormData {
  nombre: string
  empresa: string
  email: string
  telefono: string
  servicio: number[]
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

const { currentTheme } = useTheme()

const formData = ref<FormData>({
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  servicio: [],
  mensaje: '',
  archivos: [],
  privacidad: false
})

const errors = ref<FormErrors>({})
const isSubmitting = ref(false)
const expandedFaq = ref<number | null>(1)

const showToast = ref(false)
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
// Support modal
const supportModalOpen = ref(false)
const showPrivacy = ref(false)
const supportForm = ref({
  nombre: '',
  email: '',
  telefono: '',
  motivo: ''
})
const openSupportModal = () => {
  supportModalOpen.value = true
}
const closeSupportModal = () => {
  supportModalOpen.value = false
}

const servicios = [
  { id: 1, name: 'Agua', icon: new URL('../image/icons/Servicios/Black/Agua.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Agua-White.svg', import.meta.url).href },
  { id: 2, name: 'Alimentos', icon: new URL('../image/icons/Servicios/Black/Alimentos.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Alimentos-White.svg', import.meta.url).href },
  { id: 3, name: 'Masa', icon: new URL('../image/icons/Servicios/Black/Masa.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Masa-White.svg', import.meta.url).href },
  { id: 4, name: 'Temperatura', icon: new URL('../image/icons/Servicios/Black/Temperatura.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Temperatura-White.svg', import.meta.url).href },
  { id: 5, name: 'Presión', icon: new URL('../image/icons/Servicios/Black/Presion.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Presion-White.svg', import.meta.url).href },
  { id: 6, name: 'Volumen', icon: new URL('../image/icons/Servicios/Black/Volumen.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Volumen-White.svg', import.meta.url).href },
  { id: 7, name: 'Densidad', icon: new URL('../image/icons/Servicios/Black/Densidad.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Densidad-White.svg', import.meta.url).href },
  { id: 8, name: 'Eléctrica', icon: new URL('../image/icons/Servicios/Black/Electrica.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Electrica-White.svg', import.meta.url).href },
  { id: 9, name: 'Dimensional', icon: new URL('../image/icons/Servicios/Black/Dimensional.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Dimensional-White.svg', import.meta.url).href },
  { id: 10, name: 'Humedad', icon: new URL('../image/icons/Servicios/Black/Humedad.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Humedad-White.svg', import.meta.url).href },
  { id: 11, name: 'Flujo', icon: new URL('../image/icons/Servicios/Black/Flujos.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Flujos-White.svg', import.meta.url).href },
  { id: 12, name: 'Mediciones Especiales', icon: new URL('../image/icons/Servicios/Black/Especiales.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Especiales-White.svg', import.meta.url).href }
]

import { faqs } from '@/data/faqs'
import { useTheme } from '@/composables/useTheme'

const mensajeLengthClass = computed(() => {
  const length = formData.value.mensaje.length
  if (length > 500) return 'text-danger'
  if (length > 450) return 'text-warning'
  return ''
})

const toggleFaq = (id: number) => {
  expandedFaq.value = expandedFaq.value === id ? null : id
}

const toggleService = (id: number) => {
  const idx = formData.value.servicio.indexOf(id)
  if (idx === -1) formData.value.servicio.push(id)
  else formData.value.servicio.splice(idx, 1)
}

const isIconUrl = (icon: any) => {
  if (!icon || typeof icon !== 'string') return false
  return (
    icon.startsWith('http') ||
    icon.startsWith('/') ||
    icon.endsWith('.svg') ||
    icon.startsWith('data:') ||
    icon.includes('/image/')
  )
}

const getIcon = (service: any) => {
  if (!service) return ''
  // Prefer white icon in dark mode when available
  if (currentTheme.value === 'dark' && service.iconWhite) return service.iconWhite
  return service.icon || ''
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

  // servicio es opcional y puede ser múltiple; no se valida como obligatorio

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
    // Map selected service ids to names (send names, not ids)
    const servicioNombres = servicios
      .filter(s => formData.value.servicio.includes(s.id))
      .map(s => s.name)

    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.value.nombre,
        empresa: formData.value.empresa,
        email: formData.value.email,
        telefono: formData.value.telefono,
        servicio: servicioNombres,
        mensaje: formData.value.mensaje,
      }),
    })
    const body = await res.json()
    if (res.ok && body.ok) {
      formData.value = {
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        servicio: [],
        mensaje: '',
        archivos: [],
        privacidad: false
      }
      showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success')
    } else {
      console.error('Error backend contacto:', body)
      showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'warning')
    }
  } catch (error) {
    console.error('Error enviando contacto:', error)
    showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'warning')
  } finally {
    isSubmitting.value = false
  }
}

const showNotification = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const submitSupport = async () => {
  if (!supportForm.value.nombre || !supportForm.value.email || !supportForm.value.motivo) {
    showNotification('Por favor completa nombre, correo y motivo', 'warning')
    return
  }
  try {
    const res = await fetch(`${API_BASE}/api/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: supportForm.value.nombre,
        email: supportForm.value.email,
        telefono: supportForm.value.telefono,
        motivo: supportForm.value.motivo
      })
    })
    const body = await res.json()
    if (res.ok && body.ok) {
      showNotification('Solicitud enviada. Te contactaremos pronto.', 'success')
      supportForm.value = { nombre: '', email: '', telefono: '', motivo: '' }
      closeSupportModal()
    } else {
      console.error('Error support send:', body)
      showNotification('Error al enviar la solicitud. Intenta de nuevo.', 'warning')
    }
  } catch (err) {
    console.error('Error support send:', err)
    showNotification('Error al enviar la solicitud. Intenta de nuevo.', 'warning')
  }
}

const toastIconClass = computed(() => {
  const icons: Record<ToastType, string> = {
    success: 'bi bi-check-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill',
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill'
})

const heroBgStyle = computed(() => ({
  backgroundImage: `linear-gradient(rgba(10,16,6,0.28), rgba(10,16,6,0.18)), url(${heroImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center'
}))

// expose privacy modal state to template
;
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --radius-card:      20px;
  --radius-sm:        10px;
  --shadow-sm:        0 2px 12px rgba(0,0,0,0.06);
  --shadow-md:        0 8px 32px rgba(0,0,0,0.10);
  --transition:       all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-body:        'DM Sans', 'Segoe UI', sans-serif;
}

/* ============================================================
   BASE
   ============================================================ */
.contacto-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .contacto-page {
  background: #0c0f0a;
  color: #e8ede3;
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122,171,61,0.16);
  --sena-green-pale: rgba(93,138,47,0.12);
}

/* ============================================================
   SHARED ELEMENTS
   ============================================================ */

/* ============================================================
   HERO SECTION
   ============================================================ */
.contact-hero {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
}

.contact-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(93,138,47,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(122,171,61,0.08) 0%, transparent 40%);
  pointer-events: none;
  z-index: 1;
}

.contact-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%);
  mix-blend-mode: multiply;
  transition: opacity 0.35s ease;
}

[data-bs-theme="dark"] .contact-hero::after {
  background: radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.65) 100%);
}

.hero-content { position: relative; z-index: 4; }

.hero-content .section-eyebrow {
  color: rgba(122,171,61,0.85);
  background: rgba(122,171,61,0.15);
  padding: 0.28rem 0.9rem;
  border-radius: 20px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 1rem 0;
  line-height: 1.15;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: rgb(255, 255, 255);
  line-height: 1.65;
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.hero-feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255,255,255,0.95);
  font-size: 0.9rem;
  font-weight: 500;
}

.hero-feature-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hero-feature-icon i {
  font-size: 0.75rem;
  color: var(--sena-green-light);
}

/* Contact Card en Hero */
.contact-card {
  background: rgba(255,255,255,0.10);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-card);
  overflow: hidden;
  position: relative;
  z-index: 4;
}

/* Hero background image (cover with subtle overlay) */
.contact-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-size: cover;
  background-position: center center;
  filter: saturate(1.02) contrast(1.03) brightness(0.9);
  transform-origin: center;
  transition: transform 0.6s ease, filter 0.35s ease;
}

[data-bs-theme="dark"] .contact-hero__bg {
  filter: brightness(0.65) saturate(0.95) contrast(1.02);
}

.card-header-custom {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.card-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(122,171,61,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  font-size: 1.5rem;
  color: var(--sena-green-light);
}

.card-header-custom h5 {
  color: #ffffff;
  font-weight: 600;
  margin: 0;
  font-size: 0.95rem;
}

.card-body-custom {
  padding: 1.5rem;
}

.contact-info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.contact-info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.contact-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(122,171,61,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon-box i {
  font-size: 0.85rem;
  color: var(--sena-green-light);
}

.contact-details {
  flex: 1;
}

.contact-phones {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
}

.phone-col {
  min-width: 120px;
}

.phone-country {
  display: block;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
}

.phone-number {
  display: block;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.25;
  margin-bottom: 0.25rem;
  text-decoration: none;
}

.contact-email {
  display: inline-block;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.25;
  margin-right: 0.5rem;
  text-decoration: none;
}

/* Evitar subrayado en enlaces dentro de la sección de contacto */
a.info-value,
.contact-email,
.phone-number {
  text-decoration: none !important;
}

.email-role {
  display: block;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.68);
  margin-bottom: 0.2rem;
}

.email-item { margin-bottom: 0.45rem; }

.email-list {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.email-item { flex: 1; }

@media (max-width: 768px) {
  .email-list { flex-direction: column; gap: 0.45rem; }
}

@media (max-width: 768px) {
  .contact-phones { flex-direction: column; gap: 0.5rem; }
}

.contact-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 0.25rem;
}

.contact-details p {
  color: #ffffff;
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
}

/* ============================================================
   FORM SECTION
   ============================================================ */
.contact-form-section {
  padding: 5rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .contact-form-section { background: #0e1509; }

.section-header { margin-bottom: 3rem; }

.form-wrapper {
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 3rem;
  box-shadow: var(--shadow-md);
}

[data-bs-theme="dark"] .form-wrapper {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
  box-shadow: 0 4px 40px rgba(0,0,0,0.3);
}

.form-label-custom {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .form-label-custom { color: #e0ecd6; }

.required {
  color: #dc3545;
  margin-left: 2px;
}

.form-control-custom {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e0e5da;
  border-radius: 10px;
  background: #ffffff;
  color: var(--sena-text);
  font-size: 0.9rem;
  font-family: var(--font-body);
  transition: var(--transition);
  outline: none;
}

[data-bs-theme="dark"] .form-control-custom {
  background: #1a2412;
  border-color: rgba(122,171,61,0.2);
  color: #e0ecd6;
}

.form-control-custom:focus {
  border-color: var(--sena-green-light);
  box-shadow: 0 0 0 3px rgba(93,138,47,0.1);
}

.form-control-custom.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback-custom {
  font-size: 0.78rem;
  color: #dc3545;
  margin-top: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

textarea.form-control-custom {
  resize: vertical;
  min-height: 130px;
}

.character-count {
  text-align: right;
  margin-top: 0.35rem;
}

.character-count small {
  font-size: 0.75rem;
  color: var(--sena-muted);
}

.character-count .text-danger { color: #dc3545 !important; }
.character-count .text-warning { color: #f5b31a !important; }

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.service-option {
  background: #ffffff;
  border: 1.5px solid #e0e5da;
  border-radius: 12px;
  padding: 0.9rem 0.6rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

[data-bs-theme="dark"] .service-option {
  background: #1a2412;
  border-color: rgba(122,171,61,0.2);
}

.service-option:hover {
  border-color: var(--sena-green-light);
  transform: translateY(-2px);
}

.service-option.selected {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  border-color: transparent;
}

.service-option-icon {
  font-size: 1.3rem;
  color: var(--sena-green);
  transition: var(--transition);
}

.service-option-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: block;
}

[data-bs-theme="dark"] .service-option-icon { color: var(--sena-green-light); }

.service-option.selected .service-option-icon {
  color: #ffffff;
}

.service-option span {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--sena-text);
  line-height: 1.2;
}

[data-bs-theme="dark"] .service-option span { color: #c8d8be; }

.service-option.selected span {
  color: #ffffff;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #e0e5da;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  background: #ffffff;
}

[data-bs-theme="dark"] .file-upload-area {
  background: #1a2412;
  border-color: rgba(122,171,61,0.2);
}

.file-upload-area:hover {
  border-color: var(--sena-green-light);
  background: var(--sena-green-pale);
}

[data-bs-theme="dark"] .file-upload-area:hover {
  background: rgba(93,138,47,0.08);
}

.upload-icon {
  font-size: 2.5rem;
  color: var(--sena-green);
  margin-bottom: 0.75rem;
}

[data-bs-theme="dark"] .upload-icon { color: var(--sena-green-light); }

.upload-content p {
  color: var(--sena-text);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .upload-content p { color: #c8d8be; }

.upload-content small {
  color: var(--sena-muted);
  font-size: 0.78rem;
}

/* File List */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  border-radius: 10px;
}

[data-bs-theme="dark"] .file-item {
  background: rgba(93,138,47,0.1);
  border-color: rgba(122,171,61,0.16);
}

.file-icon {
  font-size: 1.2rem;
  color: var(--sena-green);
}

[data-bs-theme="dark"] .file-icon { color: var(--sena-green-light); }

.file-info {
  flex: 1;
}

.file-name {
  display: block;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .file-name { color: #e0ecd6; }

.file-size {
  font-size: 0.72rem;
  color: var(--sena-muted);
}

.btn-remove-file {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--sena-border);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--sena-muted);
  transition: var(--transition);
  flex-shrink: 0;
}

[data-bs-theme="dark"] .btn-remove-file {
  background: #1a2412;
  border-color: rgba(122,171,61,0.2);
}

.btn-remove-file:hover {
  background: #dc3545;
  color: #ffffff;
  border-color: #dc3545;
}

/* Privacy Check */
.privacy-check {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.form-check-input-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #e0e5da;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: var(--sena-green);
}

[data-bs-theme="dark"] .form-check-input-custom {
  border-color: rgba(122,171,61,0.3);
  background: #1a2412;
}

.privacy-label {
  font-size: 0.82rem;
  color: var(--sena-muted);
  line-height: 1.5;
}

.privacy-link {
  color: var(--sena-green);
  text-decoration: underline;
}

[data-bs-theme="dark"] .privacy-link { color: var(--sena-green-light); }

/* Submit Button */
.submit-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  color: #ffffff;
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: var(--shadow-green);
  transition: var(--transition);
  font-family: var(--font-body);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
  background: linear-gradient(135deg, #4a7b22 0%, #5d8a2f 100%);
  color: #ffffff;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) .btn-arrow { transform: translateX(3px); }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   CONTACT INFO SECTION
   ============================================================ */
.contact-info-section {
  padding: 4rem 0;
  background: #fafaf8;
}

[data-bs-theme="dark"] .contact-info-section { background: #0c0f0a; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.info-card {
  background: #ffffff;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 2rem;
  text-align: center;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

[data-bs-theme="dark"] .info-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.1);
  border-color: rgba(93,138,47,0.3);
}

.info-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--sena-green-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 1.6rem;
  color: var(--sena-green);
  transition: var(--transition);
}

[data-bs-theme="dark"] .info-icon-wrap {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.info-card:hover .info-icon-wrap {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
}

.info-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .info-title { color: #e0ecd6; }

.info-text {
  font-size: 0.88rem;
  color: var(--sena-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.info-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
}

[data-bs-theme="dark"] .info-link {
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

.info-link:hover {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 0.82rem;
  color: var(--sena-muted);
}

.info-value {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .info-value { color: #c8d8be; }

/* ============================================================
   FAQ SECTION
   ============================================================ */
.faq-section {
  padding: 5rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .faq-section { background: #0e1509; }

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-card {
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: var(--transition);
}

[data-bs-theme="dark"] .faq-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.faq-card:hover {
  border-color: rgba(93,138,47,0.3);
}

.faq-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  transition: var(--transition);
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  flex: 1;
}

.faq-question i {
  font-size: 1.1rem;
  color: var(--sena-green);
  flex-shrink: 0;
}

[data-bs-theme="dark"] .faq-question i { color: var(--sena-green-light); }

.faq-question span {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .faq-question span { color: #e0ecd6; }

.faq-toggle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--sena-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--sena-green);
  transition: var(--transition);
}

[data-bs-theme="dark"] .faq-toggle {
  border-color: rgba(122,171,61,0.2);
  color: var(--sena-green-light);
}

.faq-card.expanded .faq-toggle {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
}

.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.35s ease;
  padding: 0 1.5rem;
}

.faq-body.show {
  max-height: 500px;
  padding: 0 1.5rem 1.25rem;
}

.faq-body p {
  font-size: 0.88rem;
  color: var(--sena-muted);
  line-height: 1.7;
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid var(--sena-border);
}

.faq-footer-text {
  color: var(--sena-muted);
  margin-bottom: 1rem;
}

.doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  background: transparent;
  border: 2px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
}

[data-bs-theme="dark"] .doc-btn {
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

.doc-btn:hover {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  z-index: 9999;
  border-left: 4px solid;
  animation: slideIn 0.3s ease-out;
}

[data-bs-theme="dark"] .toast-notification {
  background: #1a2412;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}

.toast-notification.success { border-left-color: #5d8a2f; }
.toast-notification.warning { border-left-color: #f5b31a; }
.toast-notification.info { border-left-color: #7aab3d; }

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex: 1;
}

.toast-content i {
  font-size: 1.2rem;
}

.toast-notification.success .toast-content i { color: #5d8a2f; }
.toast-notification.warning .toast-content i { color: #f5b31a; }
.toast-notification.info .toast-content i { color: #7aab3d; }

.toast-content span {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .toast-content span { color: #e0ecd6; }

.toast-close {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--sena-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--sena-muted);
  transition: var(--transition);
  flex-shrink: 0;
}

.toast-close:hover {
  background: var(--sena-green-pale);
  color: var(--sena-text);
}

[data-bs-theme="dark"] .toast-close:hover {
  background: rgba(122,171,61,0.12);
  color: #e0ecd6;
}

/* Support modal styles */
.support-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.support-modal {
  width: 92%;
  max-width: 760px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}
[data-bs-theme="dark"] .support-modal { background: #121710; }
.support-modal-header {
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--sena-border);
}
.support-modal-body { display: flex; gap: 1rem; padding: 1rem 1.25rem; }
.support-phones { flex: 0 0 40%; }
.support-phones ul { padding-left: 1rem; margin: 0; }
.support-form { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.support-modal-footer { padding: 1rem 1.25rem; border-top: 1px solid var(--sena-border); display:flex; justify-content:flex-end }
.modal-close { background: transparent; border: none; cursor: pointer; }

@media (max-width: 768px) {
  .support-modal-body { flex-direction: column; }
  .support-phones { flex-basis: auto }
}

/* Phone styles */
.phone-number {
  display: block;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  margin-bottom: 0.25rem;
}

[data-bs-theme="light"] .phone-number {
  color: var(--sena-text);
}

.support-phones h6 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
}
.support-phones .support-phone {
  display: inline-block;
  margin-left: 0.5rem;
  font-weight: 700;
}
.support-phones a.support-phone {
  color: var(--sena-text);
  text-decoration: none;
  display: block;
  margin: 0.35rem 0;
}
[data-bs-theme="dark"] .support-phones a.support-phone { color: #e6f0da }

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* ============================================================
   MODO CLARO MEJORADO - CORRECCIONES COMPLETAS
   ============================================================ */
[data-bs-theme="light"] .section-eyebrow {
  color: #5d8a2f !important;
  font-weight: 700;
}

[data-bs-theme="light"] .section-title {
  color: #1a2612 !important;
}

[data-bs-theme="light"] .section-subtitle {
  color: #6b7a60 !important;
}

/* Formulario en modo claro */
[data-bs-theme="light"] .form-wrapper {
  background: #ffffff !important;
  border: 2px solid #e0e5da !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important;
}

[data-bs-theme="light"] .form-label-custom {
  color: #1a2612 !important;
}

[data-bs-theme="light"] .form-control-custom {
  border: 2px solid #d0d5ca !important;
  background: #fafaf8 !important;
  color: #1a2612 !important;
}

[data-bs-theme="light"] .form-control-custom:focus {
  border-color: #5d8a2f !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 4px rgba(93,138,47,0.08) !important;
}

[data-bs-theme="light"] .form-control-custom::placeholder {
  color: #8a9a7e !important;
}

/* Servicios en modo claro */
[data-bs-theme="light"] .service-option {
  background: #fafaf8 !important;
  border: 2px solid #d0d5ca !important;
}

[data-bs-theme="light"] .service-option:hover {
  border-color: #5d8a2f !important;
  background: #f0f4ea !important;
}

[data-bs-theme="light"] .service-option-icon {
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .service-option span {
  color: #1a2612 !important;
}

[data-bs-theme="light"] .service-option.selected {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d) !important;
}

[data-bs-theme="light"] .service-option.selected .service-option-icon,
[data-bs-theme="light"] .service-option.selected span {
  color: #ffffff !important;
}

/* Upload en modo claro */
[data-bs-theme="light"] .file-upload-area {
  background: #fafaf8 !important;
  border: 2px dashed #d0d5ca !important;
}

[data-bs-theme="light"] .file-upload-area:hover {
  background: #f0f4ea !important;
  border-color: #5d8a2f !important;
}

[data-bs-theme="light"] .upload-icon {
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .upload-content p {
  color: #1a2612 !important;
}

/* Botones en modo claro - CORREGIDO */
[data-bs-theme="light"] .submit-btn {
  background: linear-gradient(135deg, #5d8a2f 0%, #7aab3d 100%) !important;
  color: #ffffff !important;
}

[data-bs-theme="light"] .submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4a7b22 0%, #5d8a2f 100%) !important;
  color: #ffffff !important;
}

[data-bs-theme="light"] .info-link {
  border: 2px solid #5d8a2f !important;
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .info-link:hover {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d) !important;
  color: #ffffff !important;
}

[data-bs-theme="light"] .doc-btn {
  border: 2px solid #5d8a2f !important;
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .doc-btn:hover {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d) !important;
  color: #ffffff !important;
}

/* Tarjetas en modo claro */
[data-bs-theme="light"] .info-card {
  background: #ffffff !important;
  border: 2px solid #e0e5da !important;
}

[data-bs-theme="light"] .info-card:hover {
  border-color: #5d8a2f !important;
}

[data-bs-theme="light"] .info-icon-wrap {
  background: #f0f4ea !important;
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .info-card:hover .info-icon-wrap {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d) !important;
  color: #ffffff !important;
}

[data-bs-theme="light"] .info-title {
  color: #1a2612 !important;
}

[data-bs-theme="light"] .info-text,
[data-bs-theme="light"] .info-label {
  color: #5a6a52 !important;
}

[data-bs-theme="light"] .info-value {
  color: #1a2612 !important;
}

/* FAQ en modo claro */
[data-bs-theme="light"] .faq-card {
  background: #ffffff !important;
  border: 2px solid #e0e5da !important;
}

[data-bs-theme="light"] .faq-card:hover {
  border-color: #5d8a2f !important;
}

[data-bs-theme="light"] .faq-question i {
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .faq-question span {
  color: #1a2612 !important;
}

[data-bs-theme="light"] .faq-toggle {
  border: 2px solid #d0d5ca !important;
  color: #5d8a2f !important;
}

[data-bs-theme="light"] .faq-body p {
  color: #5a6a52 !important;
}

/* File items en modo claro */
[data-bs-theme="light"] .file-item {
  background: #f0f4ea !important;
  border: 1px solid #d0d5ca !important;
}

[data-bs-theme="light"] .file-name {
  color: #1a2612 !important;
}

/* Checkbox en modo claro */
[data-bs-theme="light"] .privacy-label {
  color: #5a6a52 !important;
}

[data-bs-theme="light"] .privacy-link {
  color: #5d8a2f !important;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .hero-title { font-size: 2.4rem; }
  .section-title { font-size: 2rem; }
  .contact-card { margin-top: 2rem; }
}

@media (max-width: 768px) {
  .contact-hero { padding: 3rem 0; }
  .form-wrapper { padding: 2rem 1.5rem; }
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .info-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .hero-features { gap: 0.65rem; }
  .hero-feature-item { font-size: 0.82rem; }
  .services-grid { grid-template-columns: 1fr; }
  .form-wrapper { padding: 1.5rem 1rem; }
  .toast-notification { left: 1rem; right: 1rem; bottom: 1rem; }
}

/* FORZAR FONDOS OSCUROS EN TARJETAS (modo dark) */
[data-bs-theme="dark"] .contact-card,
[data-bs-theme="dark"] .info-card,
[data-bs-theme="dark"] .faq-card,
[data-bs-theme="dark"] .form-wrapper,
[data-bs-theme="dark"] .file-item,
[data-bs-theme="dark"] .service-option {
  background: #121710 !important;
  border-color: rgba(122,171,61,0.10) !important;
  box-shadow: none !important;
  color: #e6f0da !important;
}

[data-bs-theme="dark"] .contact-card .card-header-custom h5,
[data-bs-theme="dark"] .contact-card .card-body-custom,
[data-bs-theme="dark"] .info-card .info-title,
[data-bs-theme="dark"] .faq-card .faq-question span,
[data-bs-theme="dark"] .form-wrapper .form-label-custom {
  color: #e6f0da !important;
}

[data-bs-theme="dark"] .service-option.selected {
  background: linear-gradient(135deg, #3f6220, #5d8a2f) !important;
}

/* Hacer blancos y estáticos SOLO los números dentro de la tarjeta de contacto (hero) */
.contact-card .phone-number {
  color: #ffffff !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent !important;
}
.contact-card .phone-number:hover,
.contact-card .phone-number:active,
.contact-card .phone-number:focus {
  color: #ffffff !important;
  text-decoration: none !important;
  outline: none !important;
}
</style>
