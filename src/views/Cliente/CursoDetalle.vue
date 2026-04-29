<template>
  <div :data-bs-theme="currentTheme" class="cursos-catalogo-page">
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
              <i class="bi bi-mortarboard"></i> Catálogo de Cursos
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-mortarboard-fill me-2"></i>Catálogo de Cursos
            </h1>
            <p class="page-subtitle">
              Capacitación y formación continua para profesionales del laboratorio
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Panel de filtros y búsqueda -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-card">
          <div class="filters-header">
            <h3 class="filters-title">
              <i class="bi bi-funnel me-2"></i>Filtros
            </h3>
            <button v-if="hasActiveFilters" class="btn-clear-filters" @click="clearFilters">
              <i class="bi bi-x-circle"></i> Limpiar filtros
            </button>
          </div>

          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-search me-1"></i>Buscar curso
              </label>
              <div class="search-box">
                <i class="bi bi-search search-icon"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="search-input"
                  placeholder="Buscar por título, instructor o descripción..."
                  @input="handleSearch"
                >
                <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-tags me-1"></i>Categoría
              </label>
              <div class="category-filters">
                <button
                  v-for="cat in categorias"
                  :key="cat.value"
                  class="category-filter-btn"
                  :class="{ active: selectedCategoria === cat.value }"
                  @click="toggleCategoriaFilter(cat.value)"
                >
                  <i :class="cat.icon"></i>
                  {{ cat.label }}
                </button>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-currency-dollar me-1"></i>Precio
              </label>
              <div class="price-filters">
                <button
                  class="price-filter-btn"
                  :class="{ active: selectedPrecio === 'todos' }"
                  @click="selectedPrecio = 'todos'"
                >
                  Todos
                </button>
                <button
                  class="price-filter-btn"
                  :class="{ active: selectedPrecio === 'gratis' }"
                  @click="selectedPrecio = 'gratis'"
                >
                  <i class="bi bi-gift"></i> Gratis
                </button>
                <button
                  class="price-filter-btn"
                  :class="{ active: selectedPrecio === 'pago' }"
                  @click="selectedPrecio = 'pago'"
                >
                  <i class="bi bi-credit-card"></i> De pago
                </button>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="bi bi-clock me-1"></i>Duración
              </label>
              <select v-model="selectedDuracion" class="form-select">
                <option value="">Todas las duraciones</option>
                <option value="corta">Corta (1-5 horas)</option>
                <option value="media">Media (6-20 horas)</option>
                <option value="larga">Larga (21+ horas)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Resultados -->
    <main class="main-content">
      <div class="container">
        <div class="results-header">
          <div class="results-info">
            <h3 class="results-title">
              <i class="bi bi-grid-3x3-gap-fill me-2"></i>Cursos Disponibles
            </h3>
            <p class="results-count">
              {{ filteredCursos.length }} curso{{ filteredCursos.length !== 1 ? 's' : '' }} encontrado{{ filteredCursos.length !== 1 ? 's' : '' }}
            </p>
          </div>
          <div class="sort-options">
            <label class="sort-label">Ordenar por:</label>
            <select v-model="sortBy" class="form-select form-select-sm">
              <option value="relevancia">Relevancia</option>
              <option value="titulo">Título (A-Z)</option>
              <option value="precio_asc">Precio (menor a mayor)</option>
              <option value="precio_desc">Precio (mayor a menor)</option>
              <option value="duracion">Duración</option>
            </select>
          </div>
        </div>

        <!-- Grid de cursos -->
        <div v-if="filteredCursos.length === 0" class="empty-state">
          <div class="empty-content">
            <i class="bi bi-book empty-icon"></i>
            <h5>No se encontraron cursos</h5>
            <p class="text-muted">
              No hay cursos que coincidan con los filtros seleccionados
            </p>
            <button class="btn btn-outline-primary" @click="clearFilters">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros
            </button>
          </div>
        </div>

        <div v-else class="cursos-grid">
          <div
            v-for="curso in paginatedCursos"
            :key="curso.id"
            class="curso-card"
            :class="{ 'curso-destacado': curso.destacado }"
          >
            <div v-if="curso.destacado" class="destacado-badge">
              <i class="bi bi-star-fill"></i> Destacado
            </div>

            <div class="curso-imagen" :style="{ backgroundImage: `url(${curso.imagen || getDefaultImage()})` }">
              <div class="curso-categoria">
                <i :class="getCategoriaIcon(curso.categoria)"></i>
                {{ getCategoriaLabel(curso.categoria) }}
              </div>
              <div v-if="curso.precio === 0" class="curso-gratis-badge">
                <i class="bi bi-gift-fill"></i> GRATIS
              </div>
            </div>

            <div class="curso-contenido">
              <h3 class="curso-titulo">{{ curso.titulo }}</h3>
              <p class="curso-descripcion">{{ truncateText(curso.descripcion, 100) }}</p>

              <div class="curso-meta">
                <div class="meta-item">
                  <i class="bi bi-clock"></i>
                  <span>{{ curso.duracion }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-person-badge"></i>
                  <span>{{ curso.instructor }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-bar-chart"></i>
                  <span>{{ curso.nivel }}</span>
                </div>
              </div>

              <div class="curso-footer">
                <div class="curso-precio">
                  <span v-if="curso.precio === 0" class="precio-gratis">Gratis</span>
                  <span v-else class="precio-pago">${{ formatNumber(curso.precio) }} MXN</span>
                </div>
                <button class="btn-ver-detalle" @click="verDetalleCurso(curso)">
                  Ver detalles <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="filteredCursos.length > 0" class="pagination-container">
          <div class="pagination-info">
            Mostrando {{ startItem }} - {{ endItem }} de {{ filteredCursos.length }} cursos
          </div>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1">
              <i class="bi bi-chevron-double-left"></i>
            </button>
            <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
              <i class="bi bi-chevron-right"></i>
            </button>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
              <i class="bi bi-chevron-double-right"></i>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de detalle del curso -->
    <div v-if="showDetalleModal" class="modal-backdrop show" @click="closeDetalleModal"></div>
    <div v-if="showDetalleModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-book me-2"></i>Detalle del Curso
            </h5>
            <button type="button" class="btn-close" @click="closeDetalleModal"></button>
          </div>
          <div class="modal-body" v-if="cursoSeleccionado">
            <div class="detalle-header">
              <div class="detalle-categoria">
                <i :class="getCategoriaIcon(cursoSeleccionado.categoria)"></i>
                {{ getCategoriaLabel(cursoSeleccionado.categoria) }}
              </div>
              <div v-if="cursoSeleccionado.destacado" class="detalle-destacado">
                <i class="bi bi-star-fill"></i> Curso Destacado
              </div>
            </div>

            <h2 class="detalle-titulo">{{ cursoSeleccionado.titulo }}</h2>

            <div class="detalle-meta">
              <div class="meta-item">
                <i class="bi bi-clock"></i>
                <span>Duración: {{ cursoSeleccionado.duracion }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-person-badge"></i>
                <span>Instructor: {{ cursoSeleccionado.instructor }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-bar-chart"></i>
                <span>Nivel: {{ cursoSeleccionado.nivel }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-people"></i>
                <span>Estudiantes: {{ cursoSeleccionado.estudiantes || '+' }}+</span>
              </div>
            </div>

            <div class="detalle-descripcion">
              <h4><i class="bi bi-info-circle"></i> Descripción</h4>
              <p>{{ cursoSeleccionado.descripcion }}</p>
            </div>

            <div class="detalle-contenido" v-if="cursoSeleccionado.contenido">
              <h4><i class="bi bi-list-check"></i> Contenido del curso</h4>
              <ul>
                <li v-for="(item, idx) in cursoSeleccionado.contenido" :key="idx">
                  <i class="bi bi-check-circle-fill"></i> {{ item }}
                </li>
              </ul>
            </div>

            <div class="detalle-objetivos" v-if="cursoSeleccionado.objetivos">
              <h4><i class="bi bi-bullseye"></i> Objetivos de aprendizaje</h4>
              <ul>
                <li v-for="(obj, idx) in cursoSeleccionado.objetivos" :key="idx">
                  <i class="bi bi-arrow-right-circle-fill"></i> {{ obj }}
                </li>
              </ul>
            </div>

            <div class="detalle-requisitos" v-if="cursoSeleccionado.requisitos">
              <h4><i class="bi bi-clipboard-check"></i> Requisitos previos</h4>
              <ul>
                <li v-for="(req, idx) in cursoSeleccionado.requisitos" :key="idx">
                  <i class="bi bi-check-lg"></i> {{ req }}
                </li>
              </ul>
            </div>

            <div class="detalle-precio">
              <div class="precio-info">
                <span class="precio-label">Inversión:</span>
                <span v-if="cursoSeleccionado.precio === 0" class="precio-gratis">Curso Gratuito</span>
                <span v-else class="precio-pago">${{ formatNumber(cursoSeleccionado.precio) }} MXN</span>
              </div>
              <button class="btn-solicitar" @click="solicitarCurso(cursoSeleccionado)">
                <i class="bi bi-envelope-paper"></i> Solicitar información
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDetalleModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de solicitud de información -->
    <div v-if="showSolicitudModal" class="modal-backdrop show" @click="closeSolicitudModal"></div>
    <div v-if="showSolicitudModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-envelope-paper me-2"></i>Solicitar información
            </h5>
            <button type="button" class="btn-close" @click="closeSolicitudModal"></button>
          </div>
          <div class="modal-body">
            <div class="curso-info-solicitud">
              <strong>Curso:</strong> {{ cursoSolicitud?.titulo }}
            </div>
            <div class="alert alert-info mt-3">
              <i class="bi bi-info-circle-fill me-2"></i>
              Un asesor se comunicará con usted en un plazo máximo de 24 horas para proporcionarle más información sobre este curso.
            </div>
            <form @submit.prevent="enviarSolicitud">
              <div class="form-group">
                <label class="form-label">Nombre completo</label>
                <input v-model="solicitudForm.nombre" type="text" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">Correo electrónico</label>
                <input v-model="solicitudForm.email" type="email" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input v-model="solicitudForm.telefono" type="tel" class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Mensaje (opcional)</label>
                <textarea v-model="solicitudForm.mensaje" class="form-control" rows="3" placeholder="¿Alguna pregunta específica sobre el curso?"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeSolicitudModal">Cancelar</button>
            <button class="btn btn-primary" @click="enviarSolicitud" :disabled="enviando">
              <i v-if="!enviando" class="bi bi-send me-1"></i>
              <i v-else class="bi bi-hourglass-split me-1"></i>
              {{ enviando ? 'Enviando...' : 'Enviar solicitud' }}
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
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Filtros
const searchQuery = ref('')
const selectedCategoria = ref<string | null>(null)
const selectedPrecio = ref('todos')
const selectedDuracion = ref('')
const sortBy = ref('relevancia')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Modales
const showDetalleModal = ref(false)
const showSolicitudModal = ref(false)
const cursoSeleccionado = ref<any>(null)
const cursoSolicitud = ref<any>(null)
const enviando = ref(false)

// Formulario de solicitud
const solicitudForm = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
})

// Datos
const cursos = ref<any[]>([])

// Categorías
const categorias = [
  { value: 'calidad', label: 'Calidad', icon: 'bi bi-trophy' },
  { value: 'seguridad', label: 'Seguridad', icon: 'bi bi-shield-check' },
  { value: 'analisis', label: 'Análisis', icon: 'bi bi-flask' },
  { value: 'instrumentacion', label: 'Instrumentación', icon: 'bi bi-motherboard' },
  { value: 'gestion', label: 'Gestión', icon: 'bi bi-clipboard-data' },
  { value: 'normativa', label: 'Normativa', icon: 'bi bi-file-text' }
]

// Computed
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedCategoria.value || selectedPrecio.value !== 'todos' || selectedDuracion.value)
})

const getCategoriaLabel = (value: string) => {
  const cat = categorias.find(c => c.value === value)
  return cat ? cat.label : value
}

const getCategoriaIcon = (value: string) => {
  const cat = categorias.find(c => c.value === value)
  return cat ? cat.icon : 'bi bi-book'
}

const filteredCursos = computed(() => {
  let result = [...cursos.value]

  // Búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.titulo.toLowerCase().includes(query) ||
      c.descripcion.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query)
    )
  }

  // Categoría
  if (selectedCategoria.value) {
    result = result.filter(c => c.categoria === selectedCategoria.value)
  }

  // Precio
  if (selectedPrecio.value === 'gratis') {
    result = result.filter(c => c.precio === 0)
  } else if (selectedPrecio.value === 'pago') {
    result = result.filter(c => c.precio > 0)
  }

  // Duración
  if (selectedDuracion.value) {
    result = result.filter(c => {
      const horas = parseInt(c.duracion) || 0
      if (selectedDuracion.value === 'corta') return horas <= 5
      if (selectedDuracion.value === 'media') return horas > 5 && horas <= 20
      if (selectedDuracion.value === 'larga') return horas > 20
      return true
    })
  }

  // Ordenamiento
  switch (sortBy.value) {
    case 'titulo':
      result.sort((a, b) => a.titulo.localeCompare(b.titulo))
      break
    case 'precio_asc':
      result.sort((a, b) => a.precio - b.precio)
      break
    case 'precio_desc':
      result.sort((a, b) => b.precio - a.precio)
      break
    case 'duracion':
      result.sort((a, b) => {
        const durA = parseInt(a.duracion) || 0
        const durB = parseInt(b.duracion) || 0
        return durA - durB
      })
      break
    default:
      // Relevancia: destacados primero, luego por fecha
      result.sort((a, b) => {
        if (a.destacado && !b.destacado) return -1
        if (!a.destacado && b.destacado) return 1
        return 0
      })
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredCursos.value.length / itemsPerPage.value))
const paginatedCursos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCursos.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredCursos.value.length))

// Métodos
const formatNumber = (value: number) => {
  return value.toLocaleString('es-MX')
}

const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getDefaultImage = () => {
  return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

const handleSearch = () => {
  currentPage.value = 1
}

const toggleCategoriaFilter = (categoria: string) => {
  selectedCategoria.value = selectedCategoria.value === categoria ? null : categoria
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategoria.value = null
  selectedPrecio.value = 'todos'
  selectedDuracion.value = ''
  sortBy.value = 'relevancia'
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const verDetalleCurso = (curso: any) => {
  cursoSeleccionado.value = curso
  showDetalleModal.value = true
}

const closeDetalleModal = () => {
  showDetalleModal.value = false
  cursoSeleccionado.value = null
}

const solicitarCurso = (curso: any) => {
  cursoSolicitud.value = curso
  solicitudForm.value = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  }
  showSolicitudModal.value = true
  closeDetalleModal()
}

const closeSolicitudModal = () => {
  showSolicitudModal.value = false
  cursoSolicitud.value = null
}

const enviarSolicitud = async () => {
  if (!solicitudForm.value.nombre || !solicitudForm.value.email) {
    showToast('Por favor complete su nombre y correo electrónico', 'warning', 'Campos incompletos')
    return
  }

  enviando.value = true

  // Simular envío
  setTimeout(() => {
    // Guardar solicitud en localStorage
    const storedData = localStorage.getItem('mock_cliente_data')
    const solicitud = {
      id: Date.now(),
      curso: cursoSolicitud.value.titulo,
      curso_id: cursoSolicitud.value.id,
      nombre: solicitudForm.value.nombre,
      email: solicitudForm.value.email,
      telefono: solicitudForm.value.telefono,
      mensaje: solicitudForm.value.mensaje,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    }

    if (storedData) {
      const mockData = JSON.parse(storedData)
      if (!mockData.solicitudes_cursos) mockData.solicitudes_cursos = []
      mockData.solicitudes_cursos.push(solicitud)
      localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
    }

    showToast('Solicitud enviada correctamente. Un asesor se comunicará con usted.', 'success', 'Solicitud enviada')
    closeSolicitudModal()
    enviando.value = false
  }, 1500)
}

// Cargar cursos desde localStorage
const loadCursos = () => {
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    try {
      const mockData = JSON.parse(storedData)
      if (mockData.cursos && mockData.cursos.length > 0) {
        cursos.value = mockData.cursos
      } else {
        loadMockCursos()
      }
    } catch (e) {
      console.error('Error loading cursos:', e)
      loadMockCursos()
    }
  } else {
    loadMockCursos()
  }
}

// Cargar cursos mock
const loadMockCursos = () => {
  cursos.value = [
    {
      id: 1,
      titulo: 'Fundamentos de Calidad en Laboratorios',
      descripcion: 'Aprende los principios básicos de la gestión de calidad aplicada a laboratorios de análisis. ISO 17025 y buenas prácticas de laboratorio.',
      duracion: '20 horas',
      precio: 2500,
      instructor: 'Dra. Ana María Pérez',
      nivel: 'Básico',
      categoria: 'calidad',
      destacado: true,
      estudiantes: 156,
      contenido: [
        'Introducción a la calidad en laboratorios',
        'Requisitos de ISO 17025',
        'Documentación del sistema de calidad',
        'Gestión de no conformidades',
        'Auditorías internas',
        'Mejora continua'
      ],
      objetivos: [
        'Comprender los fundamentos de la calidad en laboratorios',
        'Implementar un sistema de gestión de calidad',
        'Realizar auditorías internas efectivas',
        'Documentar procedimientos correctamente'
      ],
      requisitos: [
        'Conocimientos básicos de laboratorio',
        'Acceso a computadora con internet'
      ]
    },
    {
      id: 2,
      titulo: 'Seguridad en el Laboratorio',
      descripcion: 'Capacitación completa sobre normas de seguridad, manejo de sustancias peligrosas y respuesta a emergencias en laboratorios.',
      duracion: '15 horas',
      precio: 1800,
      instructor: 'Ing. Carlos Ramírez',
      nivel: 'Básico',
      categoria: 'seguridad',
      destacado: true,
      estudiantes: 234,
      contenido: [
        'Normas de seguridad generales',
        'Identificación de riesgos',
        'Manejo de sustancias químicas',
        'Equipo de protección personal',
        'Procedimientos de emergencia',
        'Almacenamiento de materiales peligrosos'
      ],
      objetivos: [
        'Identificar riesgos en el laboratorio',
        'Aplicar medidas de prevención',
        'Responder adecuadamente ante emergencias',
        'Manejar correctamente sustancias peligrosas'
      ],
      requisitos: [
        'Deseable experiencia en laboratorio',
        'Ropa adecuada para prácticas'
      ]
    },
    {
      id: 3,
      titulo: 'Técnicas Avanzadas de Cromatografía',
      descripcion: 'Domina las técnicas cromatográficas más utilizadas en laboratorios de análisis: HPLC, GC y LC-MS/MS.',
      duracion: '30 horas',
      precio: 4200,
      instructor: 'Dr. Roberto Sánchez',
      nivel: 'Avanzado',
      categoria: 'analisis',
      destacado: false,
      estudiantes: 89,
      contenido: [
        'Principios de cromatografía',
        'Cromatografía de líquidos (HPLC)',
        'Cromatografía de gases (GC)',
        'Espectrometría de masas',
        'Preparación de muestras',
        'Validación de métodos'
      ],
      objetivos: [
        'Operar equipos cromatográficos',
        'Interpretar cromatogramas',
        'Desarrollar métodos analíticos',
        'Validar resultados'
      ],
      requisitos: [
        'Conocimientos previos de química analítica',
        'Experiencia básica en laboratorio'
      ]
    },
    {
      id: 4,
      titulo: 'Calibración de Equipos de Laboratorio',
      descripcion: 'Aprende a calibrar correctamente balanzas, pHmetros, espectrofotómetros y otros equipos esenciales.',
      duracion: '12 horas',
      precio: 1500,
      instructor: 'Ing. Laura Martínez',
      nivel: 'Intermedio',
      categoria: 'instrumentacion',
      destacado: false,
      estudiantes: 167,
      contenido: [
        'Fundamentos de metrología',
        'Calibración de balanzas',
        'Calibración de pHmetros',
        'Calibración de espectrofotómetros',
        'Interpretación de certificados',
        'Trazabilidad e incertidumbre'
      ],
      objetivos: [
        'Realizar calibraciones internas',
        'Interpretar certificados de calibración',
        'Mantener la trazabilidad',
        'Calcular incertidumbre'
      ],
      requisitos: [
        'Conocimientos básicos de matemáticas',
        'Equipos para prácticas'
      ]
    },
    {
      id: 5,
      titulo: 'Gestión de Residuos Peligrosos',
      descripcion: 'Curso especializado en manejo, tratamiento y disposición final de residuos peligrosos generados en laboratorios.',
      duracion: '10 horas',
      precio: 1200,
      instructor: 'Dra. Sofía Herrera',
      nivel: 'Intermedio',
      categoria: 'gestion',
      destacado: false,
      estudiantes: 112,
      contenido: [
        'Clasificación de residuos',
        'Normatividad aplicable',
        'Manejo y almacenamiento',
        'Tratamiento de residuos',
        'Disposición final',
        'Bitácoras y reportes'
      ],
      objetivos: [
        'Clasificar correctamente los residuos',
        'Aplicar la normativa vigente',
        'Implementar planes de manejo',
        'Reducir impacto ambiental'
      ],
      requisitos: [
        'Ninguno'
      ]
    },
    {
      id: 6,
      titulo: 'Introducción a ISO 9001:2015',
      descripcion: 'Conoce los fundamentos del sistema de gestión de calidad ISO 9001 y su implementación en laboratorios.',
      duracion: '8 horas',
      precio: 0,
      instructor: 'Mtro. Jorge Castillo',
      nivel: 'Básico',
      categoria: 'normativa',
      destacado: true,
      estudiantes: 342,
      contenido: [
        'Contexto de la organización',
        'Liderazgo y compromiso',
        'Planificación del SGC',
        'Apoyo y operación',
        'Evaluación del desempeño',
        'Mejora continua'
      ],
      objetivos: [
        'Comprender los requisitos de ISO 9001',
        'Identificar oportunidades de mejora',
        'Participar en auditorías internas'
      ],
      requisitos: [
        'Ninguno'
      ]
    },
    {
      id: 7,
      titulo: 'Microbiología Aplicada a Alimentos',
      descripcion: 'Técnicas microbiológicas para análisis de alimentos: detección de patógenos y microorganismos indicadores.',
      duracion: '25 horas',
      precio: 3500,
      instructor: 'Dra. Elena Vargas',
      nivel: 'Avanzado',
      categoria: 'analisis',
      destacado: false,
      estudiantes: 78,
      contenido: [
        'Microbiología de alimentos',
        'Técnicas de muestreo',
        'Cultivo y aislamiento',
        'Identificación de patógenos',
        'Control de calidad microbiológico',
        'Interpretación de resultados'
      ],
      objetivos: [
        'Aplicar técnicas microbiológicas',
        'Identificar patógenos alimentarios',
        'Interpretar resultados analíticos'
      ],
      requisitos: [
        'Conocimientos básicos de microbiología',
        'Experiencia en laboratorio'
      ]
    },
    {
      id: 8,
      titulo: 'Validación de Métodos Analíticos',
      descripcion: 'Curso práctico sobre validación de métodos según guías internacionales y requerimientos de acreditación.',
      duracion: '18 horas',
      precio: 2800,
      instructor: 'Dr. Miguel Ángel López',
      nivel: 'Avanzado',
      categoria: 'calidad',
      destacado: true,
      estudiantes: 95,
      contenido: [
        'Conceptos básicos de validación',
        'Parámetros de desempeño',
        'Protocolos de validación',
        'Estadística aplicada',
        'Documentación y reportes',
        'Revalidación de métodos'
      ],
      objetivos: [
        'Diseñar protocolos de validación',
        'Evaluar parámetros de desempeño',
        'Interpretar resultados estadísticos',
        'Documentar validaciones'
      ],
      requisitos: [
        'Conocimientos de estadística básica',
        'Experiencia en métodos analíticos'
      ]
    }
  ]

  // Guardar en localStorage
  const storedData = localStorage.getItem('mock_cliente_data')
  if (storedData) {
    const mockData = JSON.parse(storedData)
    mockData.cursos = cursos.value
    localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
  } else {
    const mockData = { cursos: cursos.value }
    localStorage.setItem('mock_cliente_data', JSON.stringify(mockData))
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

watch([searchQuery, selectedCategoria, selectedPrecio, selectedDuracion, sortBy], () => {
  currentPage.value = 1
})

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadCursos()
})
</script>

<style scoped>
.cursos-catalogo-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #F5F7FA 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .cursos-catalogo-page {
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

/* Filters Section */
.filters-section {
  padding: 1.5rem 0;
}

.filters-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1.5rem;
}

[data-bs-theme="dark"] .filters-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.filters-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-dark, #212529);
}

.btn-clear-filters {
  background: none;
  border: none;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-dark, #212529);
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray, #6C757D);
}

.search-input {
  width: 100%;
  padding: 0.625rem 2rem 0.625rem 2.25rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .search-input {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-gray, #6C757D);
  cursor: pointer;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.category-filter-btn.active {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border-color: transparent;
  color: white;
}

.price-filters {
  display: flex;
  gap: 0.5rem;
}

.price-filter-btn {
  padding: 0.375rem 0.75rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.price-filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.price-filter-btn.active {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border-color: transparent;
  color: white;
}

.form-select {
  padding: 0.625rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .form-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

/* Results Header */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-dark, #212529);
}

.results-count {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  margin: 0;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.form-select-sm {
  width: auto;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.85rem;
}

/* Cursos Grid */
.main-content {
  padding: 0 0 3rem;
}

.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.curso-card {
  background: var(--card-bg, white);
  border-radius: 20px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

[data-bs-theme="dark"] .curso-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.curso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.curso-card.curso-destacado {
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 4px 15px rgba(30, 158, 74, 0.15);
}

.destacado-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 10;
}

.curso-imagen {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
}

.curso-categoria {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.curso-gratis-badge {
  background: #dc3545;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.curso-contenido {
  padding: 1.25rem;
}

.curso-titulo {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .curso-titulo {
  color: var(--color-dark, #F8F9FA);
}

.curso-descripcion {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  line-height: 1.4;
  margin-bottom: 1rem;
}

.curso-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
}

.meta-item i {
  font-size: 0.8rem;
}

.curso-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .curso-footer {
  border-top-color: var(--color-gray-light, #2d2d2d);
}

.curso-precio {
  font-size: 1.1rem;
  font-weight: 700;
}

.precio-gratis {
  color: #28a745;
}

.precio-pago {
  color: var(--color-primary, #1E9E4A);
}

.btn-ver-detalle {
  background: none;
  border: none;
  color: var(--color-primary, #1E9E4A);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-ver-detalle:hover {
  gap: 0.75rem;
}

/* Pagination */
.pagination-container {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
}

.pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.page-btn.active {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border-color: transparent;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: var(--color-gray-light, #E9ECEF);
  margin-bottom: 1rem;
}

/* Modal Detalle */
.modal-backdrop {
  opacity: 0.5;
}

.modal-content {
  border-radius: 16px;
}

.detalle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detalle-categoria {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--color-primary, #1E9E4A);
}

.detalle-destacado {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
}

.detalle-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .detalle-titulo {
  color: var(--color-dark, #F8F9FA);
}

.detalle-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.detalle-descripcion,
.detalle-contenido,
.detalle-objetivos,
.detalle-requisitos {
  margin-bottom: 1.5rem;
}

.detalle-descripcion h4,
.detalle-contenido h4,
.detalle-objetivos h4,
.detalle-requisitos h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-primary, #1E9E4A);
}

.detalle-descripcion p {
  font-size: 0.9rem;
  color: var(--color-gray, #6C757D);
  line-height: 1.5;
}

.detalle-contenido ul,
.detalle-objetivos ul,
.detalle-requisitos ul {
  margin: 0;
  padding-left: 1.25rem;
}

.detalle-contenido li,
.detalle-objetivos li,
.detalle-requisitos li {
  font-size: 0.85rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.5rem;
}

.detalle-contenido li i,
.detalle-objetivos li i,
.detalle-requisitos li i {
  color: var(--color-primary, #1E9E4A);
  margin-right: 0.5rem;
}

.detalle-precio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border-radius: 12px;
  color: white;
}

.precio-info {
  display: flex;
  flex-direction: column;
}

.precio-label {
  font-size: 0.8rem;
  opacity: 0.9;
}

.precio-gratis {
  font-size: 1.25rem;
  font-weight: 700;
}

.precio-pago {
  font-size: 1.5rem;
  font-weight: 700;
}

.btn-solicitar {
  background: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  color: var(--color-primary, #1E9E4A);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-solicitar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Formulario solicitud */
.curso-info-solicitud {
  padding: 0.75rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 10px;
}

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

.form-control {
  width: 100%;
  padding: 0.625rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .form-control {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
}

/* Buttons */
.btn-primary {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #4CAF50 100%));
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 158, 74, 0.3);
}

.btn-outline-primary {
  border: 2px solid var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
  background: transparent;
}

.btn-outline-primary:hover {
  background: var(--color-primary, #1E9E4A);
  color: white;
}

/* Toast */
.toast {
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(12, 18, 30, 0.08);
}

/* Responsive */
@media (max-width: 1200px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .cursos-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }

  .detalle-precio {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding: 1rem 0;
  }

  .cursos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
