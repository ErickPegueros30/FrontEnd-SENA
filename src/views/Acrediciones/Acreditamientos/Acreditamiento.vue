<template>
  <div :data-bs-theme="currentTheme" class="acreditaciones-page">

    <!-- Hero Section -->
    <section class="acreditaciones-hero events-hero">
      <div class="hero-overlay"></div>
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
                <span class="badge-item">
                  <i class="bi bi-award-fill"></i>
                  <span>Acreditado ISO/IEC 17043:2010</span>
                </span>
                <span class="badge-item">
                  <i class="bi bi-globe2"></i>
                  <span>Reconocimiento Internacional</span>
                </span>
                <span class="badge-item">
                  <i class="bi bi-shield-check"></i>
                  <span>15+ Años de Excelencia</span>
                </span>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-card">
              <div class="hero-card-icon">
                <i class="bi bi-file-earmark-text-fill"></i>
              </div>
              <h4>Documentación Oficial</h4>
              <p>Consulta y descarga nuestros documentos oficiales de acreditación, dictámenes y reconocimientos.</p>
              <div class="hero-card-stats">
                <div class="hero-stat">
                  <span class="hero-stat-number">6</span>
                  <span class="hero-stat-label">Documentos</span>
                </div>
                <div class="hero-stat">
                  <span class="hero-stat-number">PDF</span>
                  <span class="hero-stat-label">Formato</span>
                </div>
                <div class="hero-stat">
                  <span class="hero-stat-number">100%</span>
                  <span class="hero-stat-label">Oficiales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Texto institucional (sin logo) -->
    <section class="intro-section">
      <div class="container">
        <div class="row">
          <div class="col-12" data-aos="fade-up">
            <div class="intro-wrapper">
              <div class="intro-quote-mark">"</div>
              <p class="intro-text">
                Nuestras <strong>acreditaciones</strong> son el respaldo que garantiza la competencia técnica
                de <strong>SENA</strong> como proveedor de ensayos de aptitud. Cada certificación representa
                nuestro compromiso con la <strong>excelencia, imparcialidad y confiabilidad</strong>,
                cumpliendo con los más estrictos estándares internacionales.
              </p>
              <div class="intro-footer">
                <div class="intro-signature">
                  <span class="signature-line"></span>
                  <span class="signature-text">Calidad Certificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reconocimientos Acreditación -->
    <section class="documents-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Distinciones</span>
          <h2 class="section-title">Acreditamientos Oficiales</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Distinciones y reconocimientos otorgados por organismos nacionales e internacionales</p>
        </div>

        <div class="documents-grid">
          <div
            v-for="(doc, index) in reconocimientos"
            :key="doc.id"
            class="document-card"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="doc-icon-wrap">
              <i :class="doc.icon"></i>
            </div>
            <div class="doc-content">
              <h5 class="doc-title">{{ doc.title }}</h5>
              <p class="doc-description">{{ doc.description }}</p>
              <div class="doc-meta">
                <span class="doc-meta-item">
                  <i class="bi bi-building"></i>
                  {{ doc.emisor }}
                </span>
                <span class="doc-meta-item" v-if="doc.fecha">
                  <i class="bi bi-calendar3"></i>
                  {{ doc.fecha }}
                </span>
              </div>
              <div class="doc-actions">
                <button class="doc-btn doc-btn-preview" @click="handlePreview(doc)">
                  <i class="bi bi-eye"></i>
                  <span>Vista previa</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="info-box" data-aos="fade-up">
          <div class="info-content">
            <i class="bi bi-trophy-fill"></i>
            <div>
              <h5>Sobre los reconocimientos</h5>
              <p>
                Estos reconocimientos destacan nuestra trayectoria, innovación y contribución
                al desarrollo de la metrología y los ensayos de aptitud en la región.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Acreditaciones Oficiales (Alcance)-->
    <section class="documents-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Certificaciones</span>
          <h2 class="section-title">Alcance</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Documentos que certifican nuestro cumplimiento con los estándares internacionales de calidad</p>
        </div>

        <div class="documents-grid">
          <div
            v-for="(doc, index) in acreditaciones"
            :key="doc.id"
            class="document-card"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="doc-icon-wrap">
              <i :class="doc.icon"></i>
            </div>
            <div class="doc-content">
              <h5 class="doc-title">{{ doc.title }}</h5>
              <p class="doc-description">{{ doc.description }}</p>
              <div class="doc-meta">
                <span class="doc-meta-item">
                  <i class="bi bi-building"></i>
                  {{ doc.emisor }}
                </span>
                <span class="doc-meta-item" v-if="doc.fecha">
                  <i class="bi bi-calendar3"></i>
                  {{ doc.fecha }}
                </span>
              </div>
              <div class="doc-actions">
                <button class="doc-btn doc-btn-preview" @click="handlePreview(doc)">
                  <i class="bi bi-eye"></i>
                  <span>Vista previa</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="info-box" data-aos="fade-up">
          <div class="info-content">
            <i class="bi bi-info-circle-fill"></i>
            <div>
              <h5>Información sobre las acreditaciones</h5>
              <p>
                Nuestras acreditaciones están vigentes y son renovadas periódicamente conforme a los
                procesos de auditoría establecidos por los organismos certificadores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dictámenes Técnicos -->
    <section class="documents-section-alt">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Evaluaciones</span>
          <h2 class="section-title">Dictámenes</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Evaluaciones y resoluciones técnicas que respaldan nuestras capacidades</p>
        </div>

        <div class="documents-grid">
          <div
            v-for="(doc, index) in dictamenes"
            :key="doc.id"
            class="document-card"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="doc-icon-wrap">
              <i :class="doc.icon"></i>
            </div>
            <div class="doc-content">
              <h5 class="doc-title">{{ doc.title }}</h5>
              <p class="doc-description">{{ doc.description }}</p>
              <div class="doc-meta">
                <span class="doc-meta-item">
                  <i class="bi bi-building"></i>
                  {{ doc.emisor }}
                </span>
                <span class="doc-meta-item" v-if="doc.fecha">
                  <i class="bi bi-calendar3"></i>
                  {{ doc.fecha }}
                </span>
              </div>
              <div class="doc-actions">
                <button class="doc-btn doc-btn-preview" @click="handlePreview(doc)">
                  <i class="bi bi-eye"></i>
                  <span>Vista previa</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="info-box" data-aos="fade-up">
          <div class="info-content">
            <i class="bi bi-file-earmark-check-fill"></i>
            <div>
              <h5>Sobre los dictámenes técnicos</h5>
              <p>
                Estos documentos validan nuestras metodologías, equipos y procedimientos,
                garantizando la exactitud y confiabilidad de todos nuestros ensayos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-wrapper" data-aos="fade-up">
          <div class="cta-content">
            <h2 class="cta-title">¿Necesitas más información?</h2>
            <p class="cta-description">
              Si requieres documentos adicionales o certificaciones específicas,
              nuestro equipo está disponible para asistirte.
            </p>
          </div>
            <div class="cta-action">
              <button class="contact-btn" @click="openRequestModal">
                Solicitar Documentos
                <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
        </div>
      </div>
    </section>

    <FooterComponent :current-theme="currentTheme" />

      <!-- Notificación (toast) -->
      <Teleport to="body">
        <div v-if="notification.show" :class="['app-toast', `app-toast--${notification.type}`]" role="status">
          <div class="app-toast-body">{{ notification.message }}</div>
        </div>
      </Teleport>

    <!-- PDF Modal -->
    <Teleport to="body">
      <div v-if="showPdfModal" class="modal-overlay" @click.self="closePdfModal">
        <div class="modal-container modal-pdf">
          <div class="modal-header">
            <div>
              <h5 class="modal-title">{{ previewDocument?.title }}</h5>
              <div class="modal-meta">
                <small v-if="previewDocument?.emisor">{{ previewDocument.emisor }}</small>
                <small v-if="previewDocument?.fecha"> · {{ previewDocument.fecha }}</small>
                <small v-if="previewDocument?.paginas"> · {{ previewDocument.paginas }} páginas</small>
                <small v-if="previewDocument?.size"> · {{ previewDocument.size }}</small>
              </div>
            </div>
            <div class="modal-actions">
              <a v-if="previewDocument?.fileUrl" :href="previewDocument.fileUrl" class="action-btn" target="_blank" rel="noopener" @click.stop>
                <i class="bi bi-box-arrow-up-right"></i>
                <span>Abrir</span>
              </a>
              <a v-if="previewDocument?.fileUrl" :href="previewDocument.fileUrl" download class="action-btn" @click.stop>
                <i class="bi bi-download"></i>
                <span>Descargar</span>
              </a>
              <button class="modal-close" @click="closePdfModal" aria-label="Cerrar">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <div class="modal-body">
            <div class="pdf-viewer">
              <div v-if="previewDocument && previewDocument.fileUrl" class="pdf-frame">
                <embed
                  :src="pdfSrc"
                  type="application/pdf"
                  class="pdf-embed"
                />
              </div>
              <div v-else class="pdf-placeholder">
                <i class="bi bi-file-earmark-pdf"></i>
                <p>Vista previa no disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <!-- Solicitar Documentos Modal -->
    <Teleport to="body">
      <div v-if="showRequestModal" class="modal-overlay request-modal-overlay" @click.self="closeRequestModal">
        <div class="modal-container request-modal-container">
          <div class="modal-header">
            <h5 class="modal-title">Solicitar Documentos</h5>
            <button class="modal-close" @click="closeRequestModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="request-body">
              <div class="request-row">
                <div class="request-field">
                  <label class="form-label">Nombre</label>
                  <input v-model="requesterName" class="form-control request-input" placeholder="Su nombre completo" />
                </div>
                <div class="request-field">
                  <label class="form-label">Correo electrónico</label>
                  <input v-model="requesterEmail" type="email" class="form-control request-input" placeholder="ejemplo@dominio.com" />
                </div>
                <div class="request-field">
                  <label class="form-label">Teléfono</label>
                  <input v-model="requesterPhone" type="tel" class="form-control request-input" placeholder="+57 300 000 0000" />
                </div>
              </div>

              <label class="form-label">¿Por qué necesita estos documentos?</label>
              <textarea v-model="requestReason" class="form-control request-textarea" rows="4" placeholder="Escriba el motivo..." />

              <div class="request-list">
                <label class="list-title">Seleccione los documentos:</label>
                <div v-for="doc in allDocuments" :key="doc.uid" class="request-item-card">
                  <label class="checkbox-wrapper">
                      <input type="checkbox" :value="doc.uid" v-model="selectedIds" />
                      <span class="checkbox-custom"></span>
                  </label>
                  <div class="request-item-content">
                    <div class="request-item-title">{{ doc.title }}</div>
                    <div class="request-item-meta">
                      <span class="emisor">{{ doc.emisor }}</span>
                      <span v-if="doc.fecha" class="fecha"> · {{ doc.fecha }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="doc-btn doc-btn-preview" @click="closeRequestModal">Cancelar</button>
            <button class="doc-btn doc-btn-download" :disabled="!canSubmit" @click="submitRequest">Enviar solicitud</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch, onUnmounted, computed } from 'vue'
import FooterComponent from '@/components/Footer.vue/Footer.vue'

type Theme = 'light' | 'dark'
type DocumentType = 'acreditacion' | 'dictamen' | 'reconocimiento'

interface Document {
  id: number
  title: string
  description: string
  type: DocumentType
  fileName: string
  fileUrl: string
  size: string | null
  paginas: number | null
  fecha: string | null
  emisor: string
  categoria: string
  icon: string
}

const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')
const showPdfModal = ref(false)
const previewDocument = ref<Document | null>(null)

const pdfSrc = computed(() => {
  const url = previewDocument.value?.fileUrl || ''
  if (!url) return ''
  return url.includes('#') ? url : `${url}#toolbar=0`
})

// Nota: el manejador de teclado (Escape para cerrar y bloqueo Ctrl+P/Ctrl+S)
// se registra tras la definición de `closePdfModal` más abajo.

const acreditaciones: Document[] = [ // Alcance
  {
    id: 1,
    title: 'Acreditación como Proveedor de Ensayos de Aptitud ISO/IEC 17043:2023',
    description: 'Ha sido acreditado como Proveedor de Ensayos de Aptitud de Ensayos bajo la norma ISO/IEC 17043:2023. Requisitos generales para los ensayos de aptitud para Laboratorios de Ensayos',
    type: 'acreditacion',
    fileName: 'ACREDITAMIENTO PEA-ENS-05.pdf',
    fileUrl: '/src/pdf/Acreditamientos/ACREDITAMIENTO PEA-ENS-05.pdf',
    size: null,
    paginas: 4,
    fecha: '21/01/2025',
    emisor: 'Entidad Mexicana de Acreditación (EMA)',
    categoria: 'Proveedor de Ensayos de Aptitud',
    icon: 'bi bi-award-fill'
  },
  {
    id: 2,
    title: 'Acreditación como Proveedor de Ensayos de Aptitud de CalibraciónISO/IEC 17043:2023',
    description: 'Ha sido acreditado como Proveedor de Ensayos de Aptitud de Calibración bajo la norma ISO/IEC 17043:2023. Requisitos generales para los ensayos de aptitud para Laboratorios de Calibración ',
    type: 'acreditacion',
    fileName: 'ACREDITAMIENTO PEA CAL-01.pdf',
    fileUrl: '/src/pdf/Acreditamientos/ACREDITAMIENTO PEA CAL-01.pdf',
    size: null,
    paginas: 21,
    fecha: '21/01/2025',
    emisor: 'Entidad Mexicana de Acreditación (EMA)',
    categoria: 'Proveedor de Ensayos de Aptitud',
    icon: 'bi bi-award-fill'
  }
]

const dictamenes: Document[] = [
  {
    id: 3,
    title: 'EMA PEA-ENS-05',
    description: 'Confirma que la acreditación PEA-ENS-05 continuará vigente.',
    type: 'dictamen',
    fileName: 'dictamen-tecnico-ema-2023-045.pdf',
    fileUrl: '/src/pdf/Dictamen/DICTAMEN EMA PEA-ENS-05.pdf',
    size: '3.2 MB',
    paginas: 1,
    fecha: '21/01/2025',
    emisor: 'Entidad Mexicana de Acreditación (EMA)',
    categoria: 'Dictamen Técnico',
    icon: 'bi bi-file-earmark-check-fill'
  },
  {
    id: 4,
    title: 'EMA PEA-CAL-01',
    description: 'Confirma que la acreditación PEA-CAL-01 continuará vigente.',
    type: 'dictamen',
    fileName: 'dictamen-ema-pea-cal-01.pdf',
    fileUrl: '/src/pdf/Dictamen/DICTAMEN EMA PEA-CAL-01.pdf',
    size: '2.1 MB',
    paginas: 1,
    fecha: '21/01/2025',
    emisor: 'Entidad Mexicana de Acreditación (EMA)',
    categoria: 'Dictamen Técnico',
    icon: 'bi bi-rulers'
  }
]

const reconocimientos: Document[] = [
  {
    id: 5,
    title: 'Laboratorios de Ensayos',
    description: 'El cumplimiento de los requisitos de la Norma ISO/IEC 17043:2023 por parte de un proveedor de ensayos de aptitud significa que el proveedor cumple tanto los requisitos de competencia técnica como los requisitos del sistema de gestión necesarios para que pueda entregar de forma consistente resultados técnicamente válidos.',
    type: 'reconocimiento',
    fileName: 'reconocimiento-laboratorios-calibracion-2023.pdf',
    fileUrl: '/src/pdf/Reconocimientos/24EA0068_SENA_Diploma (2) (1 Firma).pdf',
    size: '1.5 MB',
    paginas: 8,
    fecha: '05/09/2011',
    emisor: 'Entidad Mexicana de Acreditación (EMA)',
    categoria: 'Reconocimiento',
    icon: 'bi bi-trophy-fill'
  },
  {
    id: 6,
    title: 'Laboratorios de Calibración',
    description: 'El cumplimiento de los requisitos de la Norma ISO/IEC 17025:2023 por parte de un proveedor de calibración significa que el proveedor cumple tanto los requisitos de competencia técnica como los requisitos del sistema de gestión necesarios para que pueda entregar de forma consistente resultados técnicamente válidos.',
    type: 'reconocimiento',
    fileName: 'reconocimiento-calidad-calibra-2023.pdf',
    fileUrl: '/src/pdf/Reconocimientos/24EA0067_SENA_Diploma (2) (1 Firma).pdf',
    size: '1.2 MB',
    paginas: 6,
    fecha: '10/12/2013',
    emisor: 'Entidad Mexicana de Acreditación (EMA)',
    categoria: 'Reconocimiento',
    icon: 'bi bi-shield-check'
  }
]

const handlePreview = (doc: Document) => {
  previewDocument.value = doc
  showPdfModal.value = true
  window.document.body.style.overflow = 'hidden'
}

const closePdfModal = () => {
  showPdfModal.value = false
  previewDocument.value = null
  window.document.body.style.overflow = ''
}

// Manejador de teclado: Escape para cerrar, bloquear Ctrl/Cmd+P y Ctrl/Cmd+S cuando el modal PDF está abierto
const keyHandler = (e: KeyboardEvent) => {
  if (!showPdfModal.value) return
  const key = String(e.key || '').toLowerCase()
  if (key === 'escape') {
    closePdfModal()
    return
  }
  if ((e.ctrlKey || e.metaKey) && (key === 'p' || key === 's')) {
    e.preventDefault()
    e.stopPropagation()
  }
}

watch(showPdfModal, (val) => {
  if (val) window.addEventListener('keydown', keyHandler)
  else window.removeEventListener('keydown', keyHandler)
})

onUnmounted(() => window.removeEventListener('keydown', keyHandler))

// Solicitar documentos modal
const showRequestModal = ref(false)
const requestReason = ref('')
const selectedIds = ref<string[]>([])
const requesterName = ref('')
const requesterEmail = ref('')
const requesterPhone = ref('')

const allDocuments = computed(() => {
  const map = (d: Document) => ({ uid: `${d.type}-${d.id}`, id: d.id, title: d.title, type: d.type, emisor: d.emisor, fecha: d.fecha })
  return [...acreditaciones.map(map), ...dictamenes.map(map), ...reconocimientos.map(map)]
})

const openRequestModal = () => { showRequestModal.value = true }
const closeRequestModal = () => { showRequestModal.value = false }

const canSubmit = computed(() => {
  const emailOk = /^\S+@\S+\.\S+$/.test(requesterEmail.value)
  const phoneDigits = requesterPhone.value.replace(/\D/g, '')
  const phoneOk = phoneDigits.length >= 7
  return (
    selectedIds.value.length > 0 &&
    requestReason.value.trim().length > 6 &&
    requesterName.value.trim().length > 2 &&
    emailOk &&
    phoneOk
  )
})

const isSubmitting = ref(false)

// Notification (toast)
interface Notification { show: boolean; type: 'success' | 'error' | 'info'; message: string }
const notification = ref<Notification>({ show: false, type: 'info', message: '' })
const showNotification = (type: 'success' | 'error' | 'info', message: string, ms = 4000) => {
  notification.value = { show: true, type, message }
  setTimeout(() => { notification.value.show = false }, ms)
}

const submitRequest = async () => {
  if (!canSubmit.value || isSubmitting.value) return
  isSubmitting.value = true
  const chosen = allDocuments.value.filter(d => selectedIds.value.includes(d.uid as any))
  try {
    const res = await fetch('http://localhost:3000/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: requesterName.value,
        email: requesterEmail.value,
        phone: requesterPhone.value,
        reason: requestReason.value,
        selected: chosen,
      }),
    })
    const body = await res.json()
    if (res.ok && body.ok) {
      showNotification('success', 'Solicitud enviada. Nuestro equipo le contactará pronto.')
      // reset
      requesterName.value = ''
      requesterEmail.value = ''
      requesterPhone.value = ''
      requestReason.value = ''
      selectedIds.value = []
      closeRequestModal()
    } else {
      console.error('Error backend:', body)
      showNotification('error', 'No fue posible enviar la solicitud. Intente más tarde.')
    }
  } catch (err) {
    console.error('Error enviando solicitud:', err)
    showNotification('error', 'Error de red al enviar la solicitud.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --sena-green:       #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale:  #edf4e3;
  --sena-dark:        #1a2612;
  --sena-forest:      #0f1e09;
  --sena-text:        #1c2b14;
  --sena-muted:       #5a6a52;
  --sena-border:      rgba(93, 138, 47, 0.14);
  --radius-card:      20px;
  --radius-sm:        10px;
  --shadow-sm:        0 2px 12px rgba(0,0,0,0.06);
  --shadow-md:        0 8px 32px rgba(0,0,0,0.10);
  --shadow-green:     0 8px 28px rgba(93,138,47,0.22);
  --transition:       all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-display:     'Playfair Display', Georgia, serif;
  --font-body:        'DM Sans', 'Segoe UI', sans-serif;
}

/* ============================================================
   BASE
   ============================================================ */
.acreditaciones-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .acreditaciones-page {
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
.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  margin-bottom: 0.6rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
  line-height: 1.18;
}

[data-bs-theme="dark"] .section-title { color: #f0f5ea; }

.section-subtitle {
  font-size: 0.88rem;
  color: var(--sena-muted);
  letter-spacing: 0.5px;
  margin-top: 0.75rem;
}

.title-underline {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
  margin-top: 0.35rem;
}
.title-underline.centered { margin: 0.6rem auto 0; }

/* ============================================================
   HERO SECTION
   ============================================================ */
.acreditaciones-hero {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  padding: 5rem 0 4rem;
  position: relative;
  overflow: hidden;
}

.acreditaciones-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-content { position: relative; z-index: 2; }

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
  color: rgba(235, 254, 232, 0.968);
  line-height: 1.65;
  margin-bottom: 1.5rem;
  max-width: 540px;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50px;
  color: rgba(255,255,255,0.85);
  font-size: 0.78rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  transition: var(--transition);
}

.badge-item:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(122,171,61,0.3);
}

.badge-item i {
  font-size: 0.85rem;
  color: var(--sena-green-light);
}

/* Hero card - siempre visible con colores sólidos */
.hero-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(1px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-card);
  padding: 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-card-icon {
  width: 70px;
  height: 70px;
  background: rgba(122,171,61,0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 2rem;
  color: #a8d46a;
}

.hero-card h4 {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.hero-card p {
  color: rgba(255,255,255,0.7);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.hero-card-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.15);
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.hero-stat-number {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: #a8d46a;
}

.hero-stat-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.5px;
}

/* Copied hero styles from eventos.vue to match design */
.events-hero {
  min-height: 60vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('/src/image/Acreditaciones.png');
  background-size: cover, cover;
  background-position: center center;
  color: white;
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.events-hero .hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.12) 0%, rgba(167,183,41,0.12) 100%);
}
.events-hero .hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem 0;
}
.events-hero .hero-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
}
.events-hero .hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  max-width: 600px;
}
.events-hero .hero-stats {
  display: flex;
  gap: 3rem;
  margin-top: 2rem;
}
.events-hero .stat-item { display: flex; flex-direction: column; }
.events-hero .stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.events-hero .stat-label { font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem; }
.events-hero .hero-highlights { display: flex; flex-direction: column; gap: 1rem; }
.events-hero .highlight-card {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.events-hero .highlight-card i { font-size: 1.5rem; color: #FFD700; flex-shrink: 0; }

@media (max-width: 991.98px) {
  .events-hero { padding: 4rem 0; min-height: 70vh; }
  .events-hero .hero-title { font-size: 2.5rem; }
}

@media (max-width: 768px) {
  .events-hero .hero-title { font-size: 2rem; }
  .events-hero .hero-subtitle { font-size: 1.1rem; }
  .events-hero .hero-stats { flex-direction: column; gap: 1.5rem; }
}

/* ============================================================
   INTRO TEXT
   ============================================================ */
.intro-section {
  padding: 3.5rem 0 3rem;
}

/* EMA logo styles for intro section */
.ema-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.ema-logo {
  width: 280px;
  height: auto;
  display: inline-block;
}
.logo-placeholder {
  color: #1c2b14;
  font-weight: 700;

.request-row { display:flex; gap:0.8rem; }
.request-field { flex:1; display:flex; flex-direction:column; gap:0.4rem; }
.request-input { padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid rgba(30,30,30,0.06); }
.request-input:focus { outline: none; box-shadow: 0 6px 18px rgba(93,138,47,0.12); border-color: var(--sena-green); }
.form-label { font-size: 0.85rem; color: var(--sena-muted); font-weight: 600; }
.request-input[type="email"] { background: linear-gradient(180deg,#fff,#fbfff6); }
.request-input[type="tel"] { background: linear-gradient(180deg,#fff,#fbfff6); }
.input-hint { font-size: 0.78rem; color: #7a8b71; margin-top: 0.25rem; }

@media (max-width: 768px) {
  .request-row { flex-direction: column; }
}

  font-size: 1.1rem;
}
@media (max-width: 768px) {
  .ema-logo { width: 84px; }
}

.intro-wrapper {
  max-width: 1020px;
  margin: 0 auto;
  position: relative;
  padding: 2.5rem 3rem;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 4px 40px rgba(0,0,0,0.055);
}

[data-bs-theme="dark"] .intro-wrapper {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
  box-shadow: 0 4px 40px rgba(0,0,0,0.3);
}

.intro-quote-mark {
  font-family: var(--font-display);
  font-size: 5rem;
  color: var(--sena-green-light);
  opacity: 0.1;
  position: absolute;
  top: 0.5rem;
  left: 2rem;
  line-height: 1;
  pointer-events: none;
}

.intro-text {
  font-size: 1rem;
  line-height: 1.75;
  color: #3a4a30;
  text-align: justify;
  position: relative;
  z-index: 1;
}

[data-bs-theme="dark"] .intro-text { color: #c8d8be; }

.intro-text strong {
  color: #1c2b14;
  font-weight: 600;
}

[data-bs-theme="dark"] .intro-text strong { color: #e0ecd6; }

.intro-footer {
  display: flex;
  align-items: center;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(0,0,0,0.06);
}

[data-bs-theme="dark"] .intro-footer { border-top-color: rgba(122,171,61,0.12); }

.intro-signature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.signature-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #5d8a2f, #7aab3d);
}

.signature-text {
  font-size: 0.7rem;
  color: #5a6a52;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
}

[data-bs-theme="dark"] .signature-text { color: #8a9e7c; }

/* ============================================================
   DOCUMENTS SECTION
   ============================================================ */
.documents-section {
  padding: 4rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .documents-section { background: #0e1509; }

.documents-section-alt {
  padding: 4rem 0;
  background: #f5f7f2;
}

[data-bs-theme="dark"] .documents-section-alt { background: #0c0f0a; }

.section-header { margin-bottom: 3rem; }

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.document-card {
  background: #ffffff;
  border: 1px solid #e0e0d8;
  border-radius: var(--radius-card);
  padding: 2rem;
  transition: var(--transition);
  display: flex;
  gap: 1.25rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
}

[data-bs-theme="dark"] .document-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.document-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.1);
  border-color: rgba(93,138,47,0.3);
}

.doc-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #edf4e3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.4rem;
  color: #5d8a2f;
  transition: var(--transition);
}

[data-bs-theme="dark"] .doc-icon-wrap {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.document-card:hover .doc-icon-wrap {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d);
  color: #ffffff;
}

.doc-content { flex: 1; }

.doc-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1c2b14;
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .doc-title { color: #e0ecd6; }

.doc-description {
  font-size: 0.85rem;
  color: #5a6a52;
  line-height: 1.5;
  margin-bottom: 0.85rem;
}

[data-bs-theme="dark"] .doc-description { color: #8a9e7c; }

.doc-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.doc-meta-item {
  font-size: 0.72rem;
  color: #6b7a60;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.doc-meta-item i {
  font-size: 0.75rem;
  color: #5d8a2f;
}

[data-bs-theme="dark"] .doc-meta-item { color: #8a9e7c; }
[data-bs-theme="dark"] .doc-meta-item i { color: var(--sena-green-light); }

.doc-actions {
  display: flex;
  gap: 0.5rem;
}

.doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  border: none;
}

.doc-btn-preview {
  background: transparent;
  border: 1.5px solid #5d8a2f;
  color: #5d8a2f;
}

.doc-btn-preview:hover {
  background: #5d8a2f;
  color: #ffffff;
  border-color: #5d8a2f;
}

.doc-btn-download {
  background: linear-gradient(135deg, #5d8a2f, #7aab3d);
  color: #ffffff;
  border: 1.5px solid transparent;
}

.doc-btn-download:hover {
  box-shadow: 0 6px 20px rgba(93,138,47,0.25);
  transform: translateY(-1px);
}

[data-bs-theme="dark"] .doc-btn-preview {
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

[data-bs-theme="dark"] .doc-btn-preview:hover {
  background: var(--sena-green-light);
  color: #0c0f0a;
}

/* ============================================================
   INFO BOX
   ============================================================ */
.info-box {
  background: #f0f4ea;
  border: 1px solid #d5dcc9;
  border-radius: var(--radius-sm);
  padding: 1.5rem;
  margin-top: 3rem;
}

[data-bs-theme="dark"] .info-box {
  background: rgba(93,138,47,0.08);
  border-color: rgba(122,171,61,0.12);
}

.info-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-content i {
  color: #5d8a2f;
  font-size: 1.4rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

[data-bs-theme="dark"] .info-content i { color: var(--sena-green-light); }

.info-content h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1c2b14;
  margin-bottom: 0.35rem;
}

[data-bs-theme="dark"] .info-content h5 { color: #e0ecd6; }

.info-content p {
  font-size: 0.85rem;
  color: #5a6a52;
  margin: 0;
  line-height: 1.5;
}

[data-bs-theme="dark"] .info-content p { color: #8a9e7c; }

/* ============================================================
   CTA SECTION
   ============================================================ */
.cta-section {
  padding: 4rem 0;
}

.cta-wrapper {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #e0e0d8;
  padding: 2.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  box-shadow: 0 4px 32px rgba(0,0,0,0.06);
}

[data-bs-theme="dark"] .cta-wrapper {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
  box-shadow: 0 4px 40px rgba(0,0,0,0.3);
}

.cta-content { flex: 1; }

.cta-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: #1c2b14;
  margin-bottom: 0.75rem;
}

[data-bs-theme="dark"] .cta-title { color: #f0f5ea; }

.cta-description {
  font-size: 0.95rem;
  color: #5a6a52;
  line-height: 1.6;
  margin-bottom: 0;
  max-width: 500px;
}

[data-bs-theme="dark"] .cta-description { color: #8a9e7c; }

.cta-action { flex-shrink: 0; }

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: linear-gradient(135deg, #5d8a2f 0%, #7aab3d 100%);
  color: #ffffff !important;
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: 0 8px 28px rgba(93,138,47,0.22);
  transition: var(--transition);
  border: none;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
  color: #ffffff !important;
}

.btn-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.22s ease;
}

.contact-btn:hover .btn-arrow { transform: translateX(3px); }

/* ============================================================
   PDF MODAL
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
}

.modal-container {
  background: #ffffff;
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

[data-bs-theme="dark"] .modal-container {
  background: #1a2412;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e0e0d8;
}

[data-bs-theme="dark"] .modal-header { border-bottom-color: rgba(122,171,61,0.12); }

.modal-title {
  font-weight: 600;
  color: #1c2b14;
  margin: 0;
  font-size: 1rem;
}

[data-bs-theme="dark"] .modal-title { color: #e0ecd6; }

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d5dcc9;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5a6a52;
  transition: var(--transition);
}

[data-bs-theme="dark"] .modal-close {
  background: transparent;
  border-color: rgba(122,171,61,0.16);
  color: #8a9e7c;
}

.modal-close:hover {
  background: #f0f4ea;
  color: #1c2b14;
}

[data-bs-theme="dark"] .modal-close:hover {
  background: rgba(122,171,61,0.12);
  color: #e0ecd6;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.pdf-viewer {
  height: 75vh;
}

.pdf-embed {
  width: 100%;
  height: 100%;
  border: none;
}

/* Contenedor y capa que bloquea interacciones con el visor PDF */
.pdf-frame {
  position: relative;
  height: 100%;
}

/* pdf-blocker removed to allow interaction; right-click still prevented on embed */

.pdf-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #5a6a52;
  gap: 1rem;
}

.pdf-placeholder i { font-size: 4rem; }

/* PDF modal specific tweaks */
.modal-pdf .modal-header { padding: 1rem 1.25rem; gap: 1rem; }
.modal-meta { margin-top: 6px; display:flex; gap:0.5rem; color:var(--sena-muted); font-size:0.8rem }
.modal-actions { display:flex; align-items:center; gap:0.5rem }
.modal-actions .action-btn { display:inline-flex; align-items:center; gap:0.5rem; padding:0.45rem 0.8rem; border-radius:999px; background:transparent; border:1px solid rgba(0,0,0,0.06); color:var(--sena-text); font-weight:600; text-decoration:none }
.modal-actions .action-btn i { font-size:1rem }
.modal-actions .action-btn:hover { background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light)); color:#fff; border-color:transparent }


/* Solicitar documentos modal styles */
.request-body { display: flex; flex-direction: column; gap: 1rem; }

/* Request modal inputs */
.request-textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(30,30,30,0.06);
  background: #ffffff;
  box-shadow: 0 6px 30px rgba(0,0,0,0.04);
  font-family: var(--font-body);
  color: var(--sena-text);
  resize: vertical;
}
.request-list { margin-top: 0.75rem; max-height: 240px; overflow:auto; padding-right: 0.25rem; }
.request-list .list-title { display: block; margin-bottom: 0.5rem; font-weight: 700; color: var(--sena-text); }
.request-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.45rem 0; border-bottom: 1px solid rgba(0,0,0,0.04); }
.request-item:last-child { border-bottom: none; }
.request-item input { width: 18px; height: 18px; accent-color: var(--sena-green); }
/* Card style for items */
.request-item-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(245,247,242,1), rgba(255,255,255,1));
  border: 1px solid rgba(0,0,0,0.04);
  margin-bottom: 0.6rem;
  box-shadow: 0 6px 18px rgba(11,21,9,0.03);
}
.checkbox-wrapper { display:flex; align-items:center; position:relative; }
.checkbox-wrapper input { position:absolute; opacity:0; width:0; height:0; }
.checkbox-custom { width:22px; height:22px; border-radius:6px; display:inline-block; border: 2px solid rgba(93,138,47,0.28); background: white; }
.checkbox-wrapper input:checked + .checkbox-custom { background: linear-gradient(135deg,#5d8a2f,#7aab3d); border-color: transparent; }
.request-item-content { flex:1; }
.request-item-title { font-weight:700; color:var(--sena-text); margin-bottom:0.25rem; }
.request-item-meta { font-size:0.85rem; color:var(--sena-muted); }
.request-item-card:hover { transform: translateY(-4px); }

.doc-btn.doc-btn-download {
  background: linear-gradient(135deg,#4c9a2b,#7aab3d);
  padding: 0.65rem 1.25rem;
}
.doc-btn.doc-btn-preview {
  background: transparent; border: 1.5px solid rgba(0,0,0,0.06); color: var(--sena-text); padding: 0.6rem 1rem;
}

.modal-footer { display:flex; gap:0.75rem; padding: 1rem 1.5rem; border-top: 1px solid rgba(0,0,0,0.06); justify-content: flex-end; }
.modal-footer .doc-btn[disabled] { opacity: 0.5; cursor: not-allowed }

/* Request modal specific tweaks */
.request-modal-container { max-width: 760px; padding: 0; }
.request-modal-container .modal-body { padding: 1.25rem 1.5rem; }
.request-modal-container .modal-header { padding: 1rem 1.5rem; }
.request-modal-container .modal-title { font-size: 1.05rem; }
.request-modal-container .modal-close { border-color: rgba(30,30,30,0.06); }
.request-modal-overlay { backdrop-filter: blur(6px); }

/* Mejoras responsivas específicas para el modal de solicitud */
@media (max-width: 992px) {
  .request-modal-container { max-width: 92vw; margin: 0 4vw; }
  .request-modal-container .modal-body { padding: 1rem; }
  .request-row { flex-direction: column; gap: 0.75rem; }
  .request-field { width: 100%; }
  .request-input, .request-textarea { width: 100%; }
  .request-list { max-height: 360px; }
  .request-item-card { flex-direction: column; align-items: flex-start; }
  .request-item-card .request-item-content { width: 100%; }
  .checkbox-custom { width: 26px; height: 26px; }
}

@media (max-width: 576px) {
  .request-modal-container { max-width: 96vw; margin: 0 2vw; border-radius: 12px; }
  .request-modal-container .modal-body { padding: 0.75rem; }
  .request-row { gap: 0.6rem; }
  .request-item-card { padding: 0.6rem; }
  .request-list { max-height: 300px; }
  .modal-footer { flex-direction: column-reverse; gap: 0.6rem; padding: 0.8rem; }
  .modal-footer .doc-btn { width: 100%; padding: 0.75rem; }
  .modal-footer .doc-btn.doc-btn-preview { order: 2; }
  .modal-footer .doc-btn.doc-btn-download { order: 1; }
}

/* Asegurar que el modal permite scroll interno cuando el contenido es alto */
.request-modal-container .modal-body { max-height: calc(90vh - 140px); overflow-y: auto; }

/* ============================================================
   MODO CLARO - REFUERZOS ESPECÍFICOS
   ============================================================ */
.acreditaciones-page .section-eyebrow {
  color: #5d8a2f !important;
}

[data-bs-theme="dark"] .acreditaciones-page .section-eyebrow {
  color: #7aab3d !important;
}

.acreditaciones-page .section-title {
  color: #1a2612 !important;
}

.acreditaciones-page .section-subtitle {
  color: #6b7a60 !important;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .hero-title { font-size: 2.4rem; }
  .section-title { font-size: 2rem; }
  .documents-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .acreditaciones-hero { padding: 3rem 0 2.5rem; }
  .hero-title { font-size: 2rem; }
  .hero-card { margin-top: 2rem; }
  .intro-wrapper { padding: 1.75rem 1.5rem; }
  .intro-quote-mark { font-size: 3.5rem; }
  .cta-wrapper { padding: 2rem 1.5rem; flex-direction: column; text-align: center; }
  .cta-description { max-width: 100%; }
  .document-card { flex-direction: column; text-align: center; }
  .doc-icon-wrap { margin: 0 auto; }
  .doc-meta { justify-content: center; }
  .doc-actions { justify-content: center; }
}

@media (max-width: 480px) {
  .hero-badges { flex-direction: column; align-items: flex-start; }
  .hero-card-stats { flex-direction: column; gap: 0.75rem; }
}

/* Toast notification */
.app-toast {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  min-width: 300px;
  max-width: 420px;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.18);
  color: #fff;
  z-index: 12000;
  display: flex;
  align-items: center;
}
.app-toast--success { background: linear-gradient(90deg,#4caf50,#2e7d32); }
.app-toast--error { background: linear-gradient(90deg,#e53935,#b71c1c); }
.app-toast--info { background: linear-gradient(90deg,#2196f3,#1565c0); }
.app-toast-body { font-weight: 600; font-size: 0.95rem; padding: 0.25rem 0.5rem; }
</style>
