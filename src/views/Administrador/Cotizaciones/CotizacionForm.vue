<template>
  <div class="modal-backdrop show" @click="$emit('cancel')"></div>
  <div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title">
            <i class="bi bi-file-earmark-text me-2"></i>
            {{ isEditing ? 'Editar Cotización' : 'Nueva Cotización' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('cancel')"></button>
        </div>
        <div class="modal-body">
          <div class="cotizacion-form cotizacion-card">
            <!-- Stepper -->
            <div class="stepper mb-4">
              <div class="stepper-progress">
                <div class="stepper-bar" :style="{ width: `${(currentStep / steps.length) * 100}%` }"></div>
              </div>
              <div class="stepper-steps">
                <div 
                  v-for="(step, index) in steps" 
                  :key="index"
                  class="stepper-step"
                  :class="{ 'active': index + 1 === currentStep, 'completed': index + 1 < currentStep }"
                  @click="goToStep(index + 1)"
                >
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-label">{{ step.label }}</div>
                </div>
              </div>
            </div>

            <!-- Form Steps -->
            <form @submit.prevent="handleSubmit">
              <!-- Step 1: Información del Cliente -->
              <div v-if="currentStep === 1" class="step-content">
                <h5 class="step-title mb-4">
                  <i class="bi bi-person me-2"></i>Información del Cliente
                </h5>
                
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-person-fill me-1"></i>Nombre del Cliente
                      </label>
                      <input
                        v-model="form.cliente.nombre"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.clienteNombre }"
                        placeholder="Ingresa el nombre completo"
                        required
                      >
                      <div v-if="errors.clienteNombre" class="invalid-feedback">
                        {{ errors.clienteNombre }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-envelope-fill me-1"></i>Correo Electrónico
                      </label>
                      <input
                        v-model="form.cliente.email"
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.clienteEmail }"
                        placeholder="correo@ejemplo.com"
                        required
                      >
                      <div v-if="errors.clienteEmail" class="invalid-feedback">
                        {{ errors.clienteEmail }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-telephone-fill me-1"></i>Teléfono
                      </label>
                      <input
                        v-model="form.cliente.telefono"
                        type="tel"
                        class="form-control"
                        :class="{ 'is-invalid': errors.clienteTelefono }"
                        placeholder="+52 (XXX) XXX-XXXX"
                        required
                      >
                      <div v-if="errors.clienteTelefono" class="invalid-feedback">
                        {{ errors.clienteTelefono }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="bi bi-building me-1"></i>Empresa (Opcional)
                      </label>
                      <input
                        v-model="form.cliente.empresa"
                        type="text"
                        class="form-control"
                        placeholder="Nombre de la empresa"
                      >
                    </div>
                  </div>
                  
                  <div class="col-12">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-geo-alt-fill me-1"></i>Dirección
                      </label>
                      <textarea
                        v-model="form.cliente.direccion"
                        class="form-control"
                        :class="{ 'is-invalid': errors.clienteDireccion }"
                        rows="2"
                        placeholder="Dirección completa"
                        required
                      ></textarea>
                      <div v-if="errors.clienteDireccion" class="invalid-feedback">
                        {{ errors.clienteDireccion }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Servicios -->
              <div v-else-if="currentStep === 2" class="step-content">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h5 class="step-title mb-0">
                    <i class="bi bi-list-check me-2"></i>Servicios a Cotizar
                  </h5>
                  <button type="button" class="btn btn-sm btn-primary" @click="addItem">
                    <i class="bi bi-plus me-1"></i>Agregar Servicio
                  </button>
                </div>
                
                <div class="services-list">
                  <div v-for="(item, index) in form.items" :key="index" class="service-item panel-card mb-3">
                    <div class="panel-body">
                      <div class="row g-3">
                        <div class="col-md-5">
                          <div class="form-group">
                            <label class="form-label required">Servicio</label>
                            <select
                              v-model="item.servicioId"
                              class="form-select"
                              :class="{ 'is-invalid': errors[`itemServicio${index}`] }"
                              @change="updateItemService(index)"
                              required
                            >
                              <option value="">Seleccionar servicio</option>
                              <option v-for="service in servicios" :key="service.id" :value="service.id">
                                {{ service.nombre }} - ${{ formatCurrency(service.precio) }}
                              </option>
                            </select>
                            <div v-if="errors[`itemServicio${index}`]" class="invalid-feedback">
                              {{ errors[`itemServicio${index}`] }}
                            </div>
                          </div>
                        </div>
                        
                        <div class="col-md-3">
                          <div class="form-group">
                            <label class="form-label required">Cantidad</label>
                            <input
                              v-model.number="item.cantidad"
                              type="number"
                              min="1"
                              class="form-control"
                              :class="{ 'is-invalid': errors[`itemCantidad${index}`] }"
                              @input="updateItemTotal(index)"
                              required
                            >
                            <div v-if="errors[`itemCantidad${index}`]" class="invalid-feedback">
                              {{ errors[`itemCantidad${index}`] }}
                            </div>
                          </div>
                        </div>
                        
                        <div class="col-md-3">
                          <div class="form-group">
                            <label class="form-label required">Precio Unitario</label>
                            <div class="input-group">
                              <span class="input-group-text">$</span>
                              <input
                                v-model.number="item.precioUnitario"
                                type="number"
                                step="0.01"
                                min="0"
                                class="form-control"
                                :class="{ 'is-invalid': errors[`itemPrecio${index}`] }"
                                @input="updateItemTotal(index)"
                                required
                              >
                            </div>
                            <div v-if="errors[`itemPrecio${index}`]" class="invalid-feedback">
                              {{ errors[`itemPrecio${index}`] }}
                            </div>
                          </div>
                        </div>
                        
                        <div class="col-md-1">
                          <div class="form-group">
                            <label class="form-label">Total</label>
                            <div class="form-control-plaintext">
                              <strong>${{ formatCurrency(item.subtotal) }}</strong>
                            </div>
                          </div>
                        </div>
                        
                        <div class="col-md-12">
                          <div class="form-group">
                            <label class="form-label">
                              <i class="bi bi-text-paragraph me-1"></i>Descripción
                            </label>
                            <textarea
                              v-model="item.descripcion"
                              class="form-control"
                              rows="2"
                              placeholder="Descripción detallada del servicio"
                            ></textarea>
                          </div>
                        </div>
                        
                        <div class="col-12 text-end">
                          <button type="button" class="btn btn-sm btn-outline-danger" @click="removeItem(index)">
                            <i class="bi bi-trash me-1"></i>Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Resumen -->
                <div class="summary-card panel-card mt-4">
                  <div class="panel-body">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="summary-item">
                          <span>Subtotal:</span>
                          <strong>${{ formatCurrency(form.subtotal) }}</strong>
                        </div>
                        <div class="summary-item">
                          <span>IVA (16%):</span>
                          <strong>${{ formatCurrency(form.iva) }}</strong>
                        </div>
                        <div class="summary-item total">
                          <span>Total:</span>
                          <strong>${{ formatCurrency(form.total) }}</strong>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">
                            <i class="bi bi-chat-text me-1"></i>Notas adicionales
                          </label>
                          <textarea
                            v-model="form.notas"
                            class="form-control"
                            rows="3"
                            placeholder="Notas o condiciones especiales..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Configuración -->
              <div v-else-if="currentStep === 3" class="step-content">
                <h5 class="step-title mb-4">
                  <i class="bi bi-gear me-2"></i>Configuración de la Cotización
                </h5>
                
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-calendar-event me-1"></i>Fecha de Emisión
                      </label>
                      <input
                        v-model="form.fecha"
                        type="date"
                        class="form-control"
                        :class="{ 'is-invalid': errors.fecha }"
                        required
                      >
                      <div v-if="errors.fecha" class="invalid-feedback">
                        {{ errors.fecha }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-calendar-check me-1"></i>Válida Hasta
                      </label>
                      <input
                        v-model="form.vencimiento"
                        type="date"
                        class="form-control"
                        :class="{ 'is-invalid': errors.vencimiento }"
                        required
                      >
                      <div v-if="errors.vencimiento" class="invalid-feedback">
                        {{ errors.vencimiento }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label required">
                        <i class="bi bi-toggle-on me-1"></i>Estado
                      </label>
                      <select v-model="form.estado" class="form-select" required>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="bi bi-cash-coin me-1"></i>Condiciones de Pago
                      </label>
                      <select v-model="form.condicionesPago" class="form-select">
                        <option value="contado">Pago de contado</option>
                        <option value="30dias">30 días</option>
                        <option value="60dias">60 días</option>
                        <option value="personalizado">Personalizado</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="col-12">
                    <div class="form-group">
                      <label class="form-label">
                        <i class="bi bi-file-text me-1"></i>Términos y Condiciones
                      </label>
                      <div class="terms-editor">
                        <textarea
                          v-model="form.terminos"
                          class="form-control"
                          rows="4"
                          placeholder="Términos y condiciones específicos para esta cotización..."
                        ></textarea>
                        <div class="terms-presets mt-2">
                          <small>Plantillas rápidas:</small>
                          <div class="preset-buttons">
                            <button type="button" class="btn btn-sm btn-outline-secondary" @click="applyTermPreset('estandar')">
                              Estándar
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" @click="applyTermPreset('urgente')">
                              Urgente
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" @click="applyTermPreset('personalizado')">
                              Personalizado
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Vista Previa PDF -->
                <div class="preview-card panel-card mt-4">
                  <div class="panel-header">
                    <h6 class="panel-title mb-0">
                      <i class="bi bi-file-pdf me-2"></i>Vista Previa del PDF
                    </h6>
                  </div>
                  <div class="panel-body">
                    <div class="pdf-preview">
                      <div class="preview-header">
                        <div class="preview-logo">
                          <i class="bi bi-microscope"></i>
                          <div>
                            <h5>SENA Laboratorios</h5>
                            <small>Laboratorios Acreditados</small>
                          </div>
                        </div>
                        <div class="preview-title">
                          <h4>COTIZACIÓN</h4>
                          <small>#COT-{{ form.id ? form.id.toString().padStart(6, '0') : '000001' }}</small>
                        </div>
                      </div>
                      
                      <div class="preview-info">
                        <div class="row">
                          <div class="col-md-6">
                            <h6>Información del Cliente</h6>
                            <p><strong>{{ form.cliente.nombre || '[Nombre del cliente]' }}</strong></p>
                            <p>{{ form.cliente.empresa || '[Empresa]' }}</p>
                            <p>{{ form.cliente.direccion || '[Dirección]' }}</p>
                            <p>📧 {{ form.cliente.email || '[Email]' }}</p>
                            <p>📞 {{ form.cliente.telefono || '[Teléfono]' }}</p>
                          </div>
                          <div class="col-md-6">
                            <h6>Información de la Cotización</h6>
                            <p><strong>Fecha:</strong> {{ form.fecha ? formatDate(form.fecha) : '[Fecha]' }}</p>
                            <p><strong>Válida hasta:</strong> {{ form.vencimiento ? formatDate(form.vencimiento) : '[Vencimiento]' }}</p>
                            <p><strong>Estado:</strong> {{ getEstadoText(form.estado) }}</p>
                            <p><strong>Condiciones:</strong> {{ getCondicionesText(form.condicionesPago) }}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div class="preview-items">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th>Servicio</th>
                              <th>Descripción</th>
                              <th>Cantidad</th>
                              <th>Precio Unitario</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in form.items" :key="index">
                              <td>{{ getServiceName(item.servicioId) }}</td>
                              <td>{{ item.descripcion || '-' }}</td>
                              <td>{{ item.cantidad }}</td>
                              <td>${{ formatCurrency(item.precioUnitario) }}</td>
                              <td>${{ formatCurrency(item.subtotal) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div class="preview-totals">
                        <div class="row justify-content-end">
                          <div class="col-md-4">
                            <div class="total-row">
                              <span>Subtotal:</span>
                              <span>${{ formatCurrency(form.subtotal) }}</span>
                            </div>
                            <div class="total-row">
                              <span>IVA (16%):</span>
                              <span>${{ formatCurrency(form.iva) }}</span>
                            </div>
                            <div class="total-row total">
                              <span>Total:</span>
                              <span>${{ formatCurrency(form.total) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="preview-footer">
                        <div class="row">
                          <div class="col-md-6">
                            <h6>Notas:</h6>
                            <p>{{ form.notas || '[Sin notas]' }}</p>
                          </div>
                          <div class="col-md-6">
                            <h6>Términos y Condiciones:</h6>
                            <p>{{ form.terminos || '[Términos estándar aplican]' }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation -->
              <div class="step-navigation mt-4">
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary" @click="prevStep" :disabled="currentStep === 1">
                    <i class="bi bi-arrow-left me-1"></i>Anterior
                  </button>
                  
                  <div>
                    <button v-if="currentStep < steps.length" type="button" class="btn btn-primary" @click="nextStep">
                      Siguiente <i class="bi bi-arrow-right ms-1"></i>
                    </button>
                    <button v-else type="submit" class="btn btn-success" :disabled="isSubmitting">
                      <template v-if="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </template>
                      <template v-else>
                        <i class="bi bi-check-circle me-2"></i>
                        {{ isEditing ? 'Actualizar Cotización' : 'Crear Cotización' }}
                      </template>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
            <i class="bi bi-x-lg me-1"></i>Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmit" :disabled="isSubmitting">
            <template v-if="isSubmitting">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Guardando...
            </template>
            <template v-else>
              <i class="bi bi-check-circle me-2"></i>
              {{ isEditing ? 'Guardar cambios' : 'Crear cotización' }}
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// Props
interface Props {
  cotizacion?: any
  isEditing: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cotizacion: null,
  isEditing: false
})

// Emits
const emit = defineEmits<{
  save: [cotizacion: any]
  cancel: []
}>()

// Estado
const currentStep = ref(1)
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

// Servicios disponibles
const servicios = ref([
  { id: 1, nombre: 'Análisis de Agua Potable', precio: 2500 },
  { id: 2, nombre: 'Análisis Microbiológico', precio: 3500 },
  { id: 3, nombre: 'Calibración de Balanzas', precio: 1200 },
  { id: 4, nombre: 'Verificación de Termómetros', precio: 800 },
  { id: 5, nombre: 'Ensayo de Aptitud', precio: 5000 },
  { id: 6, nombre: 'Análisis de Metales Pesados', precio: 4200 }
])

// Formulario
const form = ref({
  id: 0,
  cliente: {
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    direccion: ''
  },
  fecha: new Date().toISOString().split('T')[0],
  vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  estado: 'pendiente',
  condicionesPago: '30dias',
  items: [] as any[],
  subtotal: 0,
  iva: 0,
  total: 0,
  notas: '',
  terminos: ''
})

// Steps
const steps = [
  { label: 'Cliente' },
  { label: 'Servicios' },
  { label: 'Configuración' }
]

// Computed
const getServiceName = (id: number) => {
  const service = servicios.value.find(s => s.id === id)
  return service ? service.nombre : 'Servicio no encontrado'
}

const updateTotals = () => {
  const subtotal = form.value.items.reduce((sum, item) => sum + item.subtotal, 0)
  form.value.subtotal = subtotal
  form.value.iva = subtotal * 0.16
  form.value.total = subtotal + form.value.iva
}

// Métodos
const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const goToStep = (step: number) => {
  if (step < currentStep.value) {
    currentStep.value = step
  }
}

const validateStep = (step: number): boolean => {
  errors.value = {}
  
  if (step === 1) {
    if (!form.value.cliente.nombre.trim()) {
      errors.value.clienteNombre = 'El nombre del cliente es requerido'
    }
    if (!form.value.cliente.email.trim()) {
      errors.value.clienteEmail = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.cliente.email)) {
      errors.value.clienteEmail = 'Ingresa un email válido'
    }
    if (!form.value.cliente.telefono.trim()) {
      errors.value.clienteTelefono = 'El teléfono es requerido'
    }
    if (!form.value.cliente.direccion.trim()) {
      errors.value.clienteDireccion = 'La dirección es requerida'
    }
  }
  
  if (step === 2) {
    if (form.value.items.length === 0) {
      errors.value.items = 'Debes agregar al menos un servicio'
    }
    
    form.value.items.forEach((item, index) => {
      if (!item.servicioId) {
        errors.value[`itemServicio${index}`] = 'Selecciona un servicio'
      }
      if (!item.cantidad || item.cantidad < 1) {
        errors.value[`itemCantidad${index}`] = 'Ingresa una cantidad válida'
      }
      if (!item.precioUnitario || item.precioUnitario < 0) {
        errors.value[`itemPrecio${index}`] = 'Ingresa un precio válido'
      }
    })
  }
  
  if (step === 3) {
    if (!form.value.fecha) {
      errors.value.fecha = 'La fecha es requerida'
    }
    if (!form.value.vencimiento) {
      errors.value.vencimiento = 'La fecha de vencimiento es requerida'
    } else if (new Date(form.value.vencimiento) < new Date(form.value.fecha)) {
      errors.value.vencimiento = 'La fecha de vencimiento debe ser posterior a la fecha de emisión'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const addItem = () => {
  form.value.items.push({
    id: form.value.items.length + 1,
    servicioId: 0,
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
    subtotal: 0
  })
}

const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
  updateTotals()
}

const updateItemService = (index: number) => {
  const servicio = servicios.value.find(s => s.id === form.value.items[index].servicioId)
  if (servicio) {
    form.value.items[index].precioUnitario = servicio.precio
    form.value.items[index].descripcion = `Servicio: ${servicio.nombre}`
    updateItemTotal(index)
  }
}

const updateItemTotal = (index: number) => {
  const item = form.value.items[index]
  item.subtotal = item.cantidad * item.precioUnitario
  updateTotals()
}

const applyTermPreset = (preset: string) => {
  const presets: Record<string, string> = {
    estandar: 'Pago a 30 días. Los precios incluyen IVA. Válida por 30 días naturales.',
    urgente: 'Pago de contado. Servicio prioritario con entrega en 24-48 horas.',
    personalizado: 'Se aplicarán condiciones especiales acordadas con el cliente.'
  }
  form.value.terminos = presets[preset] || ''
}

const formatCurrency = (amount: number): string => {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX')
}

const getEstadoText = (estado: string): string => {
  const estados: Record<string, string> = {
    pendiente: 'Pendiente',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada'
  }
  return estados[estado] || estado
}

const getCondicionesText = (condicion: string): string => {
  const condiciones: Record<string, string> = {
    contado: 'Pago de contado',
    '30dias': '30 días',
    '60dias': '60 días',
    personalizado: 'Personalizado'
  }
  return condiciones[condicion] || condicion
}

const handleSubmit = async () => {
  if (!validateStep(currentStep.value)) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('save', {
      ...form.value,
      fecha: new Date(form.value.fecha),
      vencimiento: new Date(form.value.vencimiento)
    })
  } catch (error) {
    console.error('Error al guardar cotización:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Inicializar con datos existentes si hay
onMounted(() => {
  if (props.cotizacion) {
    form.value = {
      ...props.cotizacion,
      fecha: props.cotizacion.fecha.toISOString().split('T')[0],
      vencimiento: props.cotizacion.vencimiento.toISOString().split('T')[0]
    }
  }
  
  // Agregar un item por defecto si no hay
  if (form.value.items.length === 0) {
    addItem()
  }
})

// Watch para actualizar totales
watch(() => form.value.items, updateTotals, { deep: true })
</script>

<style scoped>
/* Modal styles from admin usuarios */
.modal-backdrop {
  opacity: 0.5;
}

.modal-content {
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

[data-bs-theme="dark"] .modal-content {
  border: 1px solid var(--color-gray-light, #2d2d2d);
  background: var(--color-light, #121212);
}

.modal-header {
  padding: 1.5rem 2rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .modal-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.modal-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .modal-title {
  color: var(--color-dark, #F8F9FA);
}

.modal-body {
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .modal-footer {
  background: var(--lab-bg, #1a1a1a);
}

/* Cotizacion Form Styles */
.cotizacion-form {
  max-height: calc(70vh - 100px);
  overflow-y: auto;
  padding-right: 10px;
}

/* Stepper */
.stepper {
  position: relative;
  margin-bottom: 2rem;
}

.stepper-progress {
  height: 2px;
  background: var(--color-gray-light, #E9ECEF);
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 1;
}

.stepper-bar {
  height: 100%;
  background: var(--color-primary, #1E9E4A);
  transition: width 0.3s ease;
}

.stepper-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-gray-light, #E9ECEF);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray, #6C757D);
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  font-weight: 500;
  text-align: center;
}

.stepper-step.active .step-number {
  background: var(--color-primary, #1E9E4A);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.stepper-step.active .step-label {
  color: var(--color-primary, #1E9E4A);
  font-weight: 600;
}

.stepper-step.completed .step-number {
  background: var(--color-success, #28a745);
  color: white;
}

.stepper-step.completed .step-label {
  color: var(--color-success, #28a745);
}

/* Step Content */
.step-content {
  animation: fadeIn 0.3s ease;
}

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

.step-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .step-title {
  color: var(--color-dark, #F8F9FA);
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  display: block;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .form-label {
  color: var(--color-dark, #F8F9FA);
}

.form-label.required::after {
  content: ' *';
  color: #dc3545;
}

.form-control, .form-select {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  padding: 0.75rem 1rem;
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
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 0 0 0.25rem rgba(30, 158, 74, 0.25);
  outline: none;
}

.input-group-text {
  background: var(--lab-bg, #f8f9fa);
  border: 2px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
}

[data-bs-theme="dark"] .input-group-text {
  background: var(--lab-bg, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.invalid-feedback {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Services List */
.service-item.panel-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  overflow: hidden;
}

[data-bs-theme="dark"] .service-item.panel-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.panel-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] .panel-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.panel-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .panel-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .panel-title {
  color: var(--color-dark, #F8F9FA);
}

.panel-body {
  padding: 1.5rem;
}

/* Summary Card */
.summary-card.panel-card {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border: 1px solid rgba(30, 158, 74, 0.2);
}

[data-bs-theme="dark"] .summary-card.panel-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.07) 100%);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(30, 158, 74, 0.1);
}

.summary-item.total {
  border-bottom: none;
  font-size: 1.25rem;
  color: var(--color-primary, #1E9E4A);
  font-weight: 700;
}

/* Terms Editor */
.terms-editor textarea {
  min-height: 120px;
}

.terms-presets {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
}

/* PDF Preview */
.preview-card.panel-card {
  background: var(--card-bg, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .preview-card.panel-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.pdf-preview {
  background: white;
  color: #333;
  padding: 2rem;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #1E9E4A;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.preview-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.preview-logo i {
  font-size: 2rem;
  color: #1E9E4A;
}

.preview-logo h5 {
  margin: 0;
  color: #1E9E4A;
  font-weight: 700;
}

.preview-logo small {
  color: #666;
  font-size: 0.85rem;
}

.preview-title {
  text-align: right;
}

.preview-title h4 {
  margin: 0;
  color: #333;
  font-weight: 700;
}

.preview-title small {
  color: #666;
  font-size: 0.85rem;
}

.preview-info {
  margin-bottom: 1.5rem;
}

.preview-info h6 {
  color: #1E9E4A;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.preview-items table {
  font-size: 0.9rem;
  border-collapse: collapse;
  width: 100%;
}

.preview-items th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}

.preview-items td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}

.preview-totals {
  margin: 1.5rem 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.total-row.total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1E9E4A;
  border-top: 2px solid #dee2e6;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.preview-footer {
  border-top: 1px solid #dee2e6;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.preview-footer h6 {
  color: #1E9E4A;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Step Navigation */
.step-navigation {
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

/* Buttons */
.btn {
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--color-primary, #1E9E4A);
  border: none;
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark, #0A8F3A);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.btn-success {
  background: var(--color-success, #28a745);
  border: none;
  color: white;
}

.btn-outline-secondary {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
  background: transparent;
}

.btn-outline-secondary:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.btn-outline-danger {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-danger, #dc3545);
  background: transparent;
}

.btn-outline-danger:hover {
  border-color: var(--color-danger, #dc3545);
  background: var(--color-danger, #dc3545);
  color: white;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 992px) {
  .stepper-steps {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .stepper-progress {
    display: none;
  }
  
  .stepper-step {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
  }
  
  .step-number {
    margin-bottom: 0;
  }
  
  .pdf-preview {
    padding: 1rem;
    font-size: 0.9rem;
  }
  
  .preview-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .preview-title {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .step-title {
    font-size: 1.1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
}
</style>