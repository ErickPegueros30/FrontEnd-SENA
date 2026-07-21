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
                        <i class="bi bi-person-fill me-1"></i>Nombre(s)
                      </label>
                      <input
                        v-model="form.cliente.nombre"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.clienteNombre }"
                        placeholder="Nombre(s)"
                        required
                      >
                      <div v-if="errors.clienteNombre" class="invalid-feedback">
                        {{ errors.clienteNombre }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-3">
                    <div class="form-group">
                      <label class="form-label required">Primer Apellido</label>
                      <input v-model="form.cliente.primer_apellido" type="text" class="form-control" placeholder="Primer apellido" required>
                    </div>
                  </div>

                  <div class="col-md-3">
                    <div class="form-group">
                      <label class="form-label">Segundo Apellido</label>
                      <input v-model="form.cliente.segundo_apellido" type="text" class="form-control" placeholder="Segundo apellido (opcional)">
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
                  <div class="col-12">
                    <div class="form-group form-check">
                      <div class="d-flex gap-3 align-items-center">
                        <div>
                          <input v-model="clienteRegistrado" class="form-check-input me-2" type="checkbox" id="clienteRegistrado">
                          <label class="form-check-label" for="clienteRegistrado">Cliente registrado</label>
                        </div>
                        <div>
                          <input v-model="registerClient" class="form-check-input me-2" type="checkbox" id="registerClient">
                          <label class="form-check-label" for="registerClient">Registrar este cliente como usuario (rol C) y crear acceso automático</label>
                        </div>
                      </div>
                    </div>
                    <div v-if="clienteRegistrado" class="mt-3">
                      <label class="form-label">Seleccionar cliente registrado</label>
                      <div class="input-group">
                        <select v-model="selectedClienteId" class="form-select" @change="() => { const c = clientesRegistrados.find(x => String(x.id_usuario || x.id) === String(selectedClienteId)); if (c) { form.cliente.nombre = c.nombre || ''; form.cliente.primer_apellido = c.primer_apellido || ''; form.cliente.segundo_apellido = c.segundo_apellido || ''; form.cliente.email = c.correo || ''; } }">
                          <option value="">-- Buscar cliente --</option>
                          <option v-for="c in clientesRegistrados" :key="c.id_usuario || c.id" :value="c.id_usuario || c.id">{{ (c.nombre || c.razon_social) + ' <' + (c.correo || c.email || '') + '>' }}</option>
                        </select>
                        <button type="button" class="btn btn-outline-secondary" @click="fetchRegisteredClients">Actualizar</button>
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
                            <label class="form-label required">Origen</label>
                            <select v-model="item.source" class="form-select">
                              <option value="manual">Servicios internos</option>
                              <option value="catalog">Catálogo (área / rama)</option>
                            </select>
                          </div>

                          <div v-if="item.source === 'manual'" class="mt-2">
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

                          <div v-else class="mt-2">
                            <div class="form-group">
                              <label class="form-label required">Tipo</label>
                              <select v-model="item.precioTipo" class="form-select" @change="() => { item.precioId = null }">
                                <option value="">Seleccionar tipo</option>
                                <option value="area">Área</option>
                                <option value="rama">Rama</option>
                              </select>
                            </div>

                            <div class="form-group mt-2">
                              <label class="form-label required">Elemento</label>
                              <select v-model="item.precioId" class="form-select" @change="onSelectCatalog(index)">
                                <option value="">Seleccionar</option>
                                <option v-for="a in (item.precioTipo === 'area' ? areas : ramas)" :key="a.id || a.id_cotizacion_area || a.id_cotizacion_rama" :value="a.id || a.id_cotizacion_area || a.id_cotizacion_rama">
                                  {{ (a.referencia || a.descripcion || a.id) }} - ${{ formatCurrency(a.precio_unitario || a.precio_unitario_usd || a.precio_bilateral || 0) }}
                                </option>
                              </select>
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
                          <strong>${{ formatCurrency(subtotal) }}</strong>
                        </div>
                        <div class="summary-item">
                          <span>IVA (16%):</span>
                          <strong>${{ formatCurrency(iva) }}</strong>
                        </div>
                        <div class="summary-item total">
                          <span>Total:</span>
                          <strong>${{ formatCurrency(total) }}</strong>
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
                              <td>{{ item.source === 'catalog' ? (item.descripcion || 'Catálogo') : getServiceName(item.servicioId) }}</td>
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
                              <span>${{ formatCurrency(subtotal) }}</span>
                            </div>
                            <div class="total-row">
                              <span>IVA (16%):</span>
                              <span>${{ formatCurrency(iva) }}</span>
                            </div>
                            <div class="total-row total">
                              <span>Total:</span>
                              <span>${{ formatCurrency(total) }}</span>
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
import { reactive, ref, computed, onMounted } from 'vue'
import { openTemplateAndPrint } from './pdfGenerator'

type Cliente = {
  nombre: string
  email: string
  primer_apellido?: string
  segundo_apellido?: string
  telefono: string
  empresa?: string
  direccion: string
}

type Item = {
  uid: string
  servicioId: number
  descripcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  // source: 'manual' | 'catalog'
  source?: 'manual' | 'catalog'
  // if catalog
  precioTipo?: 'area' | 'rama'
  precioId?: number
}

type FormState = {
  id?: number
  cliente: Cliente
  fecha: string
  vencimiento: string
  estado: string
  condicionesPago: string
  items: Item[]
  notas?: string
  terminos?: string
}

// Props y emits
const props = withDefaults(defineProps<{ cotizacion?: any; isEditing?: boolean }>(), { cotizacion: undefined, isEditing: false })
const emit = defineEmits<{
  (e: 'save', cotizacion: FormState): void
  (e: 'cancel'): void
}>()

const currentStep = ref(1)
const isSubmitting = ref(false)
const errors = reactive<Record<string, string>>({})

const servicios = ref([
  { id: 1, nombre: 'Análisis de Agua Potable', precio: 2500 },
  { id: 2, nombre: 'Análisis Microbiológico', precio: 3500 },
  { id: 3, nombre: 'Calibración de Balanzas', precio: 1200 },
  { id: 4, nombre: 'Verificación de Termómetros', precio: 800 },
  { id: 5, nombre: 'Ensayo de Aptitud', precio: 5000 },
  { id: 6, nombre: 'Análisis de Metales Pesados', precio: 4200 }
])

// catálogo
import { API_BASE } from '@/config/api'
const areas = ref<any[]>([])
const ramas = ref<any[]>([])
const registerClient = ref(false)

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null
}

async function fetchAreas() {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/precios/areas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const body = await resp.json().catch(() => ({}))
    areas.value = Array.isArray(body) ? body : (body.data || body || [])
  } catch (e) { console.warn('fetchAreas', e) }
}

async function fetchRamas() {
  try {
    const token = getAuthToken()
    const resp = await fetch(`${API_BASE}/api/precios/ramas`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!resp.ok) return
    const body = await resp.json().catch(() => ({}))
    ramas.value = Array.isArray(body) ? body : (body.data || body || [])
  } catch (e) { console.warn('fetchRamas', e) }
}

const nowIso = (d = new Date()) => d.toISOString().split('T')[0]

// Flags y datos para clientes registrados
const clienteRegistrado = ref(false)
const clientesRegistrados = ref<any[]>([])
const selectedClienteId = ref<string | null>(null)

async function fetchRegisteredClients() {
  try {
    const token = getAuthToken()
    const headers: any = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const resp = await fetch(`${API_BASE}/api/users`, { headers })
    if (!resp.ok) return
    const body = await resp.json().catch(() => ({}))
    const rows = Array.isArray(body) ? body : (body.data || body || [])
    clientesRegistrados.value = rows
  } catch (e) { console.warn('fetchRegisteredClients', e) }
}

const form = reactive<FormState>({
  cliente: { nombre: '', primer_apellido: '', segundo_apellido: '', email: '', telefono: '', empresa: '', direccion: '' },
  fecha: nowIso(),
  vencimiento: nowIso(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
  estado: 'pendiente',
  condicionesPago: '30dias',
  items: [],
  notas: '',
  terminos: ''
})

/**
 * Plantillas rapidas de terminos y condiciones.
 *
 * Los tres botones "Estandar / Urgente / Personalizado" del formulario ya
 * llamaban a esta funcion, pero NO estaba definida: pulsarlos lanzaba un
 * TypeError en tiempo de ejecucion. Se implementa aqui rellenando el campo
 * form.terminos, que es lo que la vista previa del PDF muestra.
 */
type TermPreset = 'estandar' | 'urgente' | 'personalizado'

const TERM_PRESETS: Record<TermPreset, string> = {
  estandar: [
    'Vigencia de la cotizacion: 30 dias naturales a partir de la fecha de emision.',
    'Forma de pago: 50% de anticipo y 50% contra entrega de resultados.',
    'Los precios no incluyen IVA.',
    'El tiempo de entrega comienza a partir de la recepcion de las muestras.'
  ].join('\n'),
  urgente: [
    'Vigencia de la cotizacion: 10 dias naturales a partir de la fecha de emision.',
    'Servicio urgente: aplica un recargo sobre la tarifa ordinaria.',
    'Forma de pago: 100% de anticipo.',
    'Los precios no incluyen IVA.',
    'Sujeto a disponibilidad de agenda del laboratorio.'
  ].join('\n'),
  personalizado: ''
}

const applyTermPreset = (preset: TermPreset) => {
  form.terminos = TERM_PRESETS[preset] ?? ''
}

const steps = [ { label: 'Cliente' }, { label: 'Servicios' }, { label: 'Configuración' } ]

const createUid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`

const subtotal = computed(() => form.items.reduce((s, it) => s + (Number(it.subtotal) || 0), 0))
const iva = computed(() => +(subtotal.value * 0.16))
const total = computed(() => +(subtotal.value + iva.value))

function formatCurrency(amount: number): string {
  return Number(amount || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

function formatDate(date: string | Date) {
  try {
    const d = new Date(date)
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) { return String(date) }
}

function getEstadoText(estado: string) {
  const map: Record<string,string> = { pendiente: 'Pendiente', aprobada: 'Aprobada', rechazada: 'Rechazada', vencida: 'Vencida' }
  return map[estado] || estado
}

function getCondicionesText(code: string) {
  const map: Record<string,string> = { contado: 'Pago de contado', '30dias': '30 días', '60dias': '60 días', personalizado: 'Personalizado' }
  return map[code] || code
}

function getServiceName(id: number) {
  const s = servicios.value.find(x => x.id === id)
  return s ? s.nombre : 'Servicio no encontrado'
}

function addItem() {
  form.items.push({ uid: createUid(), servicioId: 0, descripcion: '', cantidad: 1, precioUnitario: 0, subtotal: 0, source: 'manual' })
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

function updateItemService(index: number) {
  const servicio = servicios.value.find(s => s.id === form.items[index].servicioId)
  if (servicio) {
    form.items[index].precioUnitario = servicio.precio
    form.items[index].descripcion = `Servicio: ${servicio.nombre}`
    updateItemTotal(index)
  }
}

function onSelectCatalog(index: number) {
  const it = form.items[index]
  if (!it.precioTipo || !it.precioId) return
  const list = it.precioTipo === 'area' ? areas.value : ramas.value
  const sel = list.find((x: any) => Number(x.id) === Number(it.precioId) || Number(x.id_cotizacion_area || x.id_cotizacion_rama) === Number(it.precioId))
  if (!sel) return
  // Prefer precio_unitario field
  const price = sel.precio_unitario ?? sel.precio_unitario_usd ?? sel.precio_bilateral ?? sel.precio_usd ?? 0
  it.precioUnitario = Number(price || 0)
  it.descripcion = sel.descripcion || sel.referencia || it.descripcion
  updateItemTotal(index)
}

function updateItemTotal(index: number) {
  const it = form.items[index]
  it.cantidad = Number(it.cantidad) || 0
  it.precioUnitario = Number(it.precioUnitario) || 0
  it.subtotal = +(it.cantidad * it.precioUnitario)
}

function validateStep(step: number) {
  Object.keys(errors).forEach(k => delete errors[k])

  if (step === 1) {
    if (!form.cliente.nombre.trim()) errors.clienteNombre = 'El nombre del cliente es requerido'
    if (!form.cliente.email.trim()) errors.clienteEmail = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.cliente.email)) errors.clienteEmail = 'Ingresa un email válido'
    if (!form.cliente.telefono.trim()) errors.clienteTelefono = 'El teléfono es requerido'
    if (!form.cliente.direccion.trim()) errors.clienteDireccion = 'La dirección es requerida'
  }

  if (step === 2) {
    if (form.items.length === 0) errors.items = 'Debes agregar al menos un servicio'
    form.items.forEach((item, i) => {
      if (item.source === 'manual') {
        if (!item.servicioId) errors[`itemServicio${i}`] = 'Selecciona un servicio'
      } else {
        if (!item.precioTipo) errors[`itemServicio${i}`] = 'Selecciona tipo (area/rama)'
        if (!item.precioId) errors[`itemPrecioId${i}`] = 'Selecciona un elemento del catálogo'
      }
      if (!item.cantidad || item.cantidad < 1) errors[`itemCantidad${i}`] = 'Ingresa una cantidad válida'
      if (item.precioUnitario < 0) errors[`itemPrecio${i}`] = 'Ingresa un precio válido'
    })
  }

  if (step === 3) {
    if (!form.fecha) errors.fecha = 'La fecha es requerida'
    if (!form.vencimiento) errors.vencimiento = 'La fecha de vencimiento es requerida'
    else if (new Date(form.vencimiento) < new Date(form.fecha)) errors.vencimiento = 'La fecha de vencimiento debe ser posterior a la fecha de emisión'
  }

  return Object.keys(errors).length === 0
}

function nextStep() { if (validateStep(currentStep.value)) currentStep.value++ }
function prevStep() { if (currentStep.value > 1) currentStep.value-- }
function goToStep(step: number) { if (step < currentStep.value) currentStep.value = step }

async function handleSubmit() {
  if (!validateStep(currentStep.value)) return
  isSubmitting.value = true
  try {
    // Pre-calculate totals for the emitted object
    form.items.forEach((_, i) => updateItemTotal(i))
    const payload = {
      ...form,
      subtotal: subtotal.value,
      iva: iva.value,
      total: total.value
    }

    // Emit to parent so existing flows keep working
    emit('save', JSON.parse(JSON.stringify(payload)))

    // Build API payload expected by backend
    const apiItems = form.items.map(it => {
      if (it.source === 'catalog') {
        return { tipo: it.precioTipo, precio_id: Number(it.precioId), cantidad: Number(it.cantidad) }
      }
      // manual items: send as tipo 'manual' with precioUnitario and descripcion
      return { tipo: 'manual', descripcion: it.descripcion || '', precioUnitario: Number(it.precioUnitario), cantidad: Number(it.cantidad) }
    })

    // Determine usuarioId and token
    let token = getAuthToken()
    let usuarioId: string | undefined = undefined

    // If user selected a registered client, use that id directly
    if (clienteRegistrado.value && selectedClienteId.value) {
      // prefer numeric id when possible
      const sid = selectedClienteId.value
      if (/^\d+$/.test(String(sid))) usuarioId = String(Number(sid))
      else usuarioId = String(sid)
    }

    try {
      // If user requested registration, register then login to get token
      if (registerClient.value) {
        const pwd = Math.random().toString(36).slice(2, 10) + 'A1!'
        const regResp = await fetch(`${API_BASE}/api/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: form.cliente.nombre, primer_apellido: '', segundo_apellido: '', id_rol: 'C', correo: form.cliente.email, contrasena: pwd })
        })
        if (regResp.ok) {
          // auto-login
          const loginResp = await fetch(`${API_BASE}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.cliente.email, password: pwd }) })
          if (loginResp.ok) {
            const body = await loginResp.json()
            token = body.data?.token || token
            usuarioId = body.data?.user?.id_usuario || body.data?.user?.id || undefined
            // persist token locally for subsequent requests
            if (token) localStorage.setItem('auth_token', token)
          }
        }
      }

      // If we already have a token, try to decode user id from stored user (if available)
      if (!usuarioId && token) {
        const stored = sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user')
        if (stored) {
          try { const u = JSON.parse(stored); usuarioId = u.id_usuario || u.id || undefined } catch(e){}
        }
      }

      // If still no usuarioId, fallback to a placeholder (backend requires string)
      if (!usuarioId) usuarioId = 'external'

      // perform API call to create cotizacion (requires token)
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      // Build request body, omitting null fields so Zod optional string validators accept them
      const reqBody: any = {
        usuarioId,
        nombre_cliente: form.cliente.nombre,
        correo: form.cliente.email,
        telefono: form.cliente.telefono,
        items: apiItems
      }
      if (form.cliente.empresa) reqBody.empresa = form.cliente.empresa
      if (form.cliente.direccion) reqBody.direccion = form.cliente.direccion
      if (form.notas) reqBody.notas = form.notas
      if (form.vencimiento) reqBody.vencimiento = form.vencimiento

      const resp = await fetch(`${API_BASE}/api/cotizaciones`, {
        method: 'POST', headers, body: JSON.stringify(reqBody)
      })

      if (resp && resp.ok) {
        const body = await resp.json().catch(() => ({}))
        // Try to fetch the full cotizacion (including items) before printing
        try {
          const cotId = body.id_cotizacion || body.id || (body.data && body.data.id)
          let full = body
          if (cotId) {
            const getResp = await fetch(`${API_BASE}/api/cotizaciones/${cotId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
            if (getResp.ok) full = await getResp.json().catch(() => full)
          }
          openTemplateAndPrint(full)
        } catch (e) {
          console.warn('print failed', e)
        }
      } else {
        // Read JSON or text for clearer debug info
        let b: any = null
        try { b = await resp.json() } catch (_) { try { b = await resp.text() } catch(e){ b = { error: 'unable to read response' } } }
        console.error('create cotizacion failed', resp.status, b)
        // show validation errors to user when available
        if (b && Array.isArray(b.errors)) {
          console.error('validation errors:', b.errors)
          const msg = b.errors.map((x: any) => `${x.path || ''}: ${x.message || x}`).join('\n')
          alert(`No se pudo crear la cotización:\n${msg}`)
        } else if (b && b.message) {
          alert(`No se pudo crear la cotización: ${b.message}`)
        } else {
          alert(`No se pudo crear la cotización (status ${resp.status})`)
        }
      }
    } catch (e) {
      console.error('handleSubmit api flow error', e)
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (props.cotizacion) {
    // populate form with minimal safe mapping
    const c = props.cotizacion
    form.cliente = { nombre: c.cliente?.nombre || '', email: c.cliente?.email || '', telefono: c.cliente?.telefono || '', empresa: c.cliente?.empresa || '', direccion: c.cliente?.direccion || '' }
    form.fecha = c.fecha ? new Date(c.fecha).toISOString().split('T')[0] : form.fecha
    form.vencimiento = c.vencimiento ? new Date(c.vencimiento).toISOString().split('T')[0] : form.vencimiento
    form.estado = c.estado || form.estado
    form.items = (c.items || []).map((it: any) => ({ uid: createUid(), servicioId: Number(it.servicioId || 0), descripcion: it.descripcion || '', cantidad: Number(it.cantidad || 1), precioUnitario: Number(it.precioUnitario || 0), subtotal: Number(it.subtotal || 0) }))
  }
  if (form.items.length === 0) addItem()
  // fetch catalog data for selection
  fetchAreas()
  fetchRamas()
  // fetch registered clients for dropdown (optional)
  fetchRegisteredClients()
})
</script>

<style scoped>
/* Modal styles from admin usuarios */

.modal-body {
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
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

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0;
  display: flex;
  align-items: center;
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
