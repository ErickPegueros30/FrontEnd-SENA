<template>
  <div :data-bs-theme="currentTheme" class="acreditaciones-page">
    <!-- Hero Section -->
    <section class="acreditaciones-hero">
      <div class="container">
        <div class="row align-items-center min-vh-60">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Acreditaciones y Certificaciones</h1>
              <p class="hero-subtitle">
                SENA Laboratorios cuenta con reconocimientos nacionales e internacionales
                que avalan la calidad y confiabilidad de nuestros servicios de ensayos de aptitud.
              </p>
              <div class="hero-badges">
                <div class="badge-item">
                  <i class="bi bi-award-fill"></i>
                  <span>Acreditado ISO/IEC 17043:2010</span>
                </div>
                <div class="badge-item">
                  <i class="bi bi-globe2"></i>
                  <span>Reconocimiento Internacional</span>
                </div>
                <div class="badge-item">
                  <i class="bi bi-shield-check"></i>
                  <span>12+ Años de Excelencia</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="certification-card">
              <div class="cert-icon">
                <i class="bi bi-file-earmark-text-fill"></i>
              </div>
              <h4>Documentación Oficial</h4>
              <p class="mb-3">
                Consulta y descarga nuestros documentos oficiales de acreditación,
                dictámenes y reconocimientos.
              </p>
              <div class="download-stats">
                <div class="stat">
                  <span class="number">6</span>
                  <span class="label">Documentos</span>
                </div>
                <div class="stat">
                  <span class="number">PDF</span>
                  <span class="label">Formato</span>
                </div>
                <div class="stat">
                  <span class="number">100%</span>
                  <span class="label">Oficiales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Acreditaciones -->
    <section class="document-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Acreditaciones Oficiales</h2>
          <p class="section-subtitle">
            Documentos que certifican nuestro cumplimiento con los estándares internacionales de calidad
          </p>

          <!-- Filtros eliminados: se muestran todas las acreditaciones -->
        </div>

        <div class="row g-4">
          <div
            v-for="(doc, index) in acreditaciones"
            :key="doc.id"
            class="col-md-6"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="index * 100"
          >
            <DocumentCard
              :document="doc"
              :current-theme="currentTheme"
              @download="handleDownload"
              @preview="handlePreview"
            />
          </div>
        </div>

        <div class="info-box mt-5" data-aos="fade-up">
          <div class="info-content">
            <i class="bi bi-info-circle-fill"></i>
            <div>
              <h5>Información sobre las acreditaciones</h5>
              <p class="mb-0">
                Nuestras acreditaciones están vigentes y son renovadas periódicamente conforme a los
                procesos de auditoría establecidos por los organismos certificadores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dictámenes -->
    <section class="document-section py-5 bg-light">
      <div class="container">
        <div class="section-header text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Dictámenes Técnicos</h2>
          <p class="section-subtitle">
            Evaluaciones y resoluciones técnicas que respaldan nuestras capacidades
          </p>
        </div>

        <div class="row g-4">
          <div
            v-for="(doc, index) in dictamenes"
            :key="doc.id"
            class="col-md-6"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="index * 100"
          >
            <DocumentCard
              :document="doc"
              :current-theme="currentTheme"
              @download="handleDownload"
              @preview="handlePreview"
            />
          </div>
        </div>

        <div class="info-box mt-5" data-aos="fade-up">
          <div class="info-content">
            <i class="bi bi-file-earmark-check-fill"></i>
            <div>
              <h5>Sobre los dictámenes técnicos</h5>
              <p class="mb-0">
                Estos documentos validan nuestras metodologías, equipos y procedimientos,
                garantizando la exactitud y confiabilidad de todos nuestros ensayos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reconocimientos -->
    <section class="document-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Reconocimientos</h2>
          <p class="section-subtitle">
            Distinciones y reconocimientos otorgados por organismos nacionales e internacionales
          </p>
        </div>

        <div class="row g-4">
          <div
            v-for="(doc, index) in reconocimientos"
            :key="doc.id"
            class="col-md-6"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="index * 100"
          >
            <DocumentCard
              :document="doc"
              :current-theme="currentTheme"
              @download="handleDownload"
              @preview="handlePreview"
            />
          </div>
        </div>

        <div class="info-box mt-5" data-aos="fade-up">
          <div class="info-content">
            <i class="bi bi-trophy-fill"></i>
            <div>
              <h5>Sobre los reconocimientos</h5>
              <p class="mb-0">
                Estos reconocimientos destacan nuestra trayectoria, innovación y contribución
                al desarrollo de la metrología y los ensayos de aptitud en la región.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center" data-aos="fade-up">
            <h2 class="cta-title mb-4">¿Necesitas más información?</h2>
            <p class="cta-subtitle mb-4">
              Si requieres documentos adicionales o certificaciones específicas,
              nuestro equipo está disponible para asistirte.
            </p>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <router-link to="/contacto" class="btn btn-primary btn-lg">
                <i class="bi bi-envelope me-2"></i>Solicitar documentos
              </router-link>
              <a href="tel:+1234567890" class="btn btn-outline-primary btn-lg">
                <i class="bi bi-telephone me-2"></i>Llamar para consultas
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterComponent :current-theme="currentTheme" />

    <!-- Modal de Vista Previa -->
    <div class="modal fade" id="previewModal" tabindex="-1" aria-hidden="true" ref="previewModal">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ previewDocument?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="previewDocument" class="pdf-preview">
              <div class="pdf-container">
                <div class="pdf-viewer">
                  <embed v-if="previewDocument.fileUrl" :src="previewDocument.fileUrl" type="application/pdf" class="pdf-embed" />
                  <div v-else class="pdf-placeholder">
                    <div class="placeholder-content">
                      <i class="bi bi-file-earmark-pdf"></i>
                      <h6>Vista previa de PDF</h6>
                      <p class="mb-3">{{ previewDocument.title }}</p>
                      <p class="small text-muted">Para ver el documento completo, descarga el archivo PDF.</p>
                      <button class="btn btn-primary" @click="handleDownload(previewDocument)">
                        <i class="bi bi-download me-2"></i>Descargar PDF
                      </button>
                    </div>
                  </div>
                </div>

                <div class="document-info">
                  <div class="info-section">
                    <div class="info-grid">
                      <div class="info-item">
                        <strong>Fecha de emisión:</strong>
                        <span>{{ previewDocument.fecha }}</span>
                      </div>
                      <div class="info-item">
                        <strong>Organismo emisor:</strong>
                        <span>{{ previewDocument.emisor }}</span>
                      </div>
                      <div class="info-item">
                        <strong>Tamaño del archivo:</strong>
                        <span>{{ previewDocument.size }}</span>
                      </div>
                      <div class="info-item">
                        <strong>Número de páginas:</strong>
                        <span>{{ previewDocument.paginas }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="previewDocument && handleDownload(previewDocument)"
            >
              <i class="bi bi-download me-2"></i>Descargar documento
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        id="acreditacionesToast"
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
import DocumentCard from '@/views/Acrediciones/Acreditamientos/DocumentCard.vue'
import type { Toast } from 'bootstrap'
import type { Modal } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'
type DocumentType = 'acreditacion' | 'dictamen' | 'reconocimiento'

interface Document {
  id: number
  title: string
  description: string
  type: DocumentType
  fileName: string
  fileUrl: string
  size: string
  paginas: number
  fecha: string
  emisor: string
  categoria: string
  icon: string
}

interface TimelineEvent {
  year: string
  title: string
  description: string
  docs?: number
}

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del modal
const previewModal = ref<HTMLDivElement | null>(null)
let modalInstance: Modal | null = null

// Estado del documento en vista previa
const previewDocument = ref<Document | null>(null)

// Datos de documentos
const acreditaciones: Document[] = [
  {
  id: 1,
  title: 'Acreditación como Proveedor de Ensayos de Aptitud ISO/IEC 17043:2023',
  description: 'Acreditación otorgada a SENA, Servicios de Ensayos de Aptitud, S.C. como Proveedor de Ensayos de Aptitud conforme a la norma ISO/IEC 17043:2023 para ensayos en agua y alimentos.',
  type: 'acreditacion',
  fileName: 'ACREDITAMIENTO PEA-ENS-05.pdf',
  fileUrl: '/src/pdf/Acreditamientos/ACREDITAMIENTO PEA-ENS-05.pdf',
  size: null,
  paginas: 4,
  fecha: '05/09/2011',
  emisor: 'Entidad Mexicana de Acreditación (EMA)',
  categoria: 'Proveedor de Ensayos de Aptitud',
  icon: 'bi bi-award-fill'
},
  {
  id: 2,
  title: 'Acreditación PEA CAL-01',
  description: 'Acreditación emitida por la Entidad Mexicana de Acreditación (EMA) como Proveedor de Ensayos de Aptitud en el área de calibración.',
  type: 'acreditacion',
  fileName: 'ACREDITAMIENTO PEA CAL-01.pdf',
  fileUrl: '/src/pdf/Acreditamientos/ACREDITAMIENTO PEA CAL-01.pdf',
  size: null,
  paginas: null,
  fecha: null,
  emisor: 'Entidad Mexicana de Acreditación (EMA)',
  categoria: 'Proveedor de Ensayos de Aptitud',
  icon: 'bi bi-award-fill'
}
]

const dictamenes: Document[] = [
  {
    id: 3,
    title: 'Dictamen EMA PEA-ENS-05',
    description: 'Dictamen técnico para ensayos en las magnitudes de masa y temperatura',
    type: 'dictamen',
    fileName: 'dictamen-tecnico-ema-2023-045.pdf',
    fileUrl: '/src/pdf/Dictamen/DICTAMEN EMA PEA-ENS-05.pdf',
    size: '3.2 MB',
    paginas: 18,
    fecha: '10/07/2023',
    emisor: 'Entidad Mexicana de Acreditación',
    categoria: 'Dictamen Técnico',
    icon: 'bi bi-file-earmark-check-fill'
  },
  {
    id: 4,
    title: 'Dictamen EMA PEA CAL-01',
    description: 'Dictamen para ampliación de alcance en mediciones dimensionales',
    type: 'dictamen',
    fileName: 'dictamen-ema-pea-cal-01.pdf',
    fileUrl: '/src/pdf/Dictamen/DICTAMEN EMA PEA-CAL-01.pdf',
    size: '2.1 MB',
    paginas: 14,
    fecha: '05/05/2023',
    emisor: 'Comité Técnico de Acreditación',
    categoria: 'Ampliación de Alcance',
    icon: 'bi bi-rulers'
  }
]

const reconocimientos: Document[] = [
  {
    id: 5,
    title: 'Laboratorios de Calibración',
    description: 'Reconocimiento por trayectoria y calidad en la prestación de servicios de calibración',
    type: 'reconocimiento',
    fileName: 'reconocimiento-laboratorios-calibracion-2023.pdf',
    fileUrl: '/src/pdf/Reconocimientos/24EA0068_SENA_Diploma (2) (1 Firma).pdf',
    size: '1.5 MB',
    paginas: 8,
    fecha: '20/11/2023',
    emisor: 'EMA',
    categoria: 'Reconocimiento',
    icon: 'bi bi-trophy-fill'
  },
  {
    id: 6,
    title: 'SENA Servicios de Ensayos de Aptitud',
    description: 'Reconocimiento por trayectoria y calidad en la prestación de servicios de ensayos de aptitud',
    type: 'reconocimiento',
    fileName: 'reconocimiento-calidad-calibra-2023.pdf',
    fileUrl: '/src/pdf/Reconocimientos/24EA0067_SENA_Diploma (2) (1 Firma).pdf',
    size: '1.2 MB',
    paginas: 6,
    fecha: '30/08/2023',
    emisor: 'EMA',
    categoria: 'Reconocimiento por Calidad',
    icon: 'bi bi-shield-check'
  }
]

// (Se eliminó el filtrado por tomos; se usan las listas completas)

const timeline: TimelineEvent[] = [
  {
    year: '2011',
    title: 'Primera Acreditación',
    description: 'Obtención de la primera acreditación como proveedor de ensayos de aptitud',
    docs: 2
  },
  {
    year: '2013',
    title: 'Ampliación a Masa y Temperatura',
    description: 'Ampliación del alcance de acreditación para las magnitudes de masa y temperatura'
  },
  {
    year: '2015',
    title: 'Reconocimiento Internacional',
    description: 'Incorporación al acuerdo de reconocimiento mutuo ILAC MRA'
  },
  {
    year: '2018',
    title: 'Expansión Multidisciplinaria',
    description: 'Ampliación a 8 áreas de especialización diferentes',
    docs: 3
  },
  {
    year: '2021',
    title: 'Renovación Completa',
    description: 'Renovación y actualización de todas las acreditaciones vigentes'
  },
  {
    year: '2023',
    title: 'Excelencia Certificada',
    description: 'Obtención de reconocimientos por calidad y trayectoria',
    docs: 2
  }
]

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed
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

// Métodos
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)

  showToast(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

const handleDownload = async (document: Document) => {
  try {
    // Simular descarga
    showToast(`Iniciando descarga: ${document.title}`, 'info')

    // En producción, esto sería una descarga real
    const link = document.createElement('a')
    link.href = document.fileUrl
    link.download = document.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Simular tiempo de descarga
    await new Promise(resolve => setTimeout(resolve, 1500))

    showToast(`Documento "${document.title}" descargado exitosamente`, 'success')

    // Cerrar modal si está abierto
    if (modalInstance) {
      modalInstance.hide()
    }

  } catch (error) {
    showToast('Error al descargar el documento. Por favor, inténtalo de nuevo.', 'error')
  }
}

const handlePreview = (document: Document) => {
  previewDocument.value = document

  if (previewModal.value) {
    import('bootstrap').then((bootstrap) => {
      modalInstance = new bootstrap.Modal(previewModal.value!)
      modalInstance.show()
    })
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
.acreditaciones-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .acreditaciones-page {
  background: var(--gradient-bg);
}

/* Hero Section (estilo compartido con Cursos) */
.acreditaciones-hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  padding: calc(var(--navbar-height, 80px) + 20px) 0 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
              url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  position: relative;
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
  color: white;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.badge-item i {
  color: #FFD700;
  font-size: 1.25rem;
}

.badge-item span {
  font-weight: 500;
}

.certification-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  color: white;
}

.cert-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.5rem;
  color: #FFD700;
}

.certification-card h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.certification-card p {
  opacity: 0.9;
  line-height: 1.6;
}

.download-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat .number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFD700;
}

.stat .label {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}

/* Document Sections */
.document-section {
  position: relative;
}

.section-header {
  margin-bottom: 3rem;
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

.section-subtitle {
  font-size: 1.1rem;
  color: var(--color-gray, #6C757D);
  max-width: 600px;
  margin: 0 auto;
}

/* Reglas de filtros/tomos eliminadas (UI removida) */


[data-bs-theme="dark"] .section-subtitle {
  color: var(--color-gray, #6C757D);
}

.bg-light {
  background: var(--lab-bg, #f8f9fa) !important;
}

[data-bs-theme="dark"] .bg-light {
  background: var(--lab-bg, #1a1a1a) !important;
}

/* Info Box */
.info-box {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border: 1px solid rgba(30, 158, 74, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

[data-bs-theme="dark"] .info-box {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.info-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-content i {
  color: var(--color-primary, #a7b729);
  font-size: 1.5rem;
  margin-top: 0.25rem;
}

.info-content h5 {
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.info-content p {
  color: var(--color-gray, #6C757D);
  margin: 0;
  line-height: 1.6;
}

[data-bs-theme="dark"] .info-content h5 {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .info-content p {
  color: var(--color-gray, #6C757D);
}

/* Timeline */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-primary));
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  width: 100%;
}

.timeline-item:nth-child(odd) {
  flex-direction: row;
}

.timeline-item:nth-child(even) {
  flex-direction: row-reverse;
}

.timeline-year {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.12);
  z-index: 2;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0 2rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
}

[data-bs-theme="dark"] .timeline-content {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.timeline-item:nth-child(odd) .timeline-content {
  margin-left: 2rem;
  margin-right: 0;
}

.timeline-item:nth-child(even) .timeline-content {
  margin-right: 2rem;
  margin-left: 0;
}

.timeline-content h5 {
  color: var(--color-dark, #212529);
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.timeline-content p {
  color: var(--color-gray, #6C757D);
  margin-bottom: 0;
  line-height: 1.6;
}

[data-bs-theme="dark"] .timeline-content h5 {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .timeline-content p {
  color: var(--color-gray, #6C757D);
}

.timeline-docs .badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.1) 0%, rgba(52, 181, 101, 0.05) 100%);
}

.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.1rem;
  color: var(--color-gray, #6C757D);
  max-width: 600px;
  margin: 0 auto;
}

[data-bs-theme="dark"] .cta-title {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .cta-subtitle {
  color: var(--color-gray, #6C757D);
}

/* Modal Styles */
.pdf-preview {
  min-height: 400px;
}

.pdf-placeholder {
  height: 400px;
  background: var(--lab-bg, #f8f9fa);
  border-radius: 10px;
  border: 2px dashed var(--color-gray-light, #E9ECEF);
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-bs-theme="dark"] .pdf-placeholder {
  background: var(--lab-bg, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.placeholder-content {
  text-align: center;
  padding: 2rem;
}

.placeholder-content i {
  font-size: 4rem;
  color: #FF6B6B;
  margin-bottom: 1rem;
}

.placeholder-content h6 {
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

[data-bs-theme="dark"] .placeholder-content h6 {
  color: var(--color-dark, #F8F9FA);
}

.pdf-info {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-radius: 10px;
  padding: 1.5rem;
}

/* PDF viewer layout (consistent with Ensayos) */
.pdf-container { display:flex; gap:1.5rem }
.pdf-viewer { flex: 1 1 65%; min-height: 70vh }
.pdf-embed { width: 100%; height: 70vh; border: 0 }
.document-info { flex: 1 1 35% }

[data-bs-theme="dark"] .pdf-placeholder {
  background: var(--lab-bg, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

[data-bs-theme="dark"] .pdf-info {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.info-item {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(30, 158, 74, 0.1);
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-item strong {
  color: var(--color-dark, #212529);
  font-weight: 600;
}

.info-item span {
  color: var(--color-gray, #6C757D);
}

[data-bs-theme="dark"] .info-item strong {
  color: var(--color-dark, #F8F9FA);
}

[data-bs-theme="dark"] .info-item span {
  color: var(--color-gray, #6C757D);
}

/* Responsive */
@media (max-width: 991.98px) {
  .acreditaciones-hero {
    padding-top: 140px;
    min-height: 70vh;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-badges {
    flex-direction: column;
    align-items: flex-start;
  }

  .timeline::before {
    left: 30px;
  }

  .timeline-item {
    flex-direction: row !important;
    padding-left: 60px;
  }

  .timeline-year {
    position: absolute;
    left: 0;
    width: 60px;
    height: 60px;
    font-size: 1.25rem;
  }

  .timeline-content {
    margin: 0 !important;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-title {
    font-size: 2rem;
  }

  .certification-card {
    margin-top: 2rem;
  }
}

@media (max-width: 576px) {
  .acreditaciones-hero {
    padding-top: 120px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .timeline-year {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }

  .pdf-placeholder {
    height: 300px;
  }

  .cta-section .btn-lg {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
