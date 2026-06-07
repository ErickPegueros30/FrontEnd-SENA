<template>
  <div :data-bs-theme="currentTheme" class="acreditaciones-page">

    <!-- Hero Section -->
    <section class="acreditaciones-hero">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7" data-aos="fade-right">
            <div class="hero-content">
              <span class="section-eyebrow">Calidad</span>
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
                  <span>12+ Años de Excelencia</span>
                </span>
              </div>
            </div>
          </div>
          <div class="col-lg-5" data-aos="fade-left">
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

    <!-- Texto institucional -->
    <section class="intro-section">
      <div class="container">
        <div class="intro-wrapper" data-aos="fade-up">
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
    </section>

    <!-- Acreditaciones Oficiales -->
    <section class="documents-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Certificaciones</span>
          <h2 class="section-title">Acreditaciones Oficiales</h2>
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
                <button class="doc-btn doc-btn-download" @click="handleDownload(doc)">
                  <i class="bi bi-download"></i>
                  <span>Descargar</span>
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
          <h2 class="section-title">Dictámenes Técnicos</h2>
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
                <button class="doc-btn doc-btn-download" @click="handleDownload(doc)">
                  <i class="bi bi-download"></i>
                  <span>Descargar</span>
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

    <!-- Reconocimientos -->
    <section class="documents-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Distinciones</span>
          <h2 class="section-title">Reconocimientos</h2>
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
                <button class="doc-btn doc-btn-download" @click="handleDownload(doc)">
                  <i class="bi bi-download"></i>
                  <span>Descargar</span>
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
            <router-link to="/contacto" class="contact-btn">
              Solicitar Documentos
              <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <FooterComponent :current-theme="currentTheme" />

    <!-- PDF Modal -->
    <Teleport to="body">
      <div v-if="showPdfModal" class="modal-overlay" @click.self="closePdfModal">
        <div class="modal-container">
          <div class="modal-header">
            <h5 class="modal-title">{{ previewDocument?.title }}</h5>
            <button class="modal-close" @click="closePdfModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="previewDocument" class="pdf-viewer">
              <embed
                v-if="previewDocument.fileUrl"
                :src="previewDocument.fileUrl"
                type="application/pdf"
                class="pdf-embed"
              />
              <div v-else class="pdf-placeholder">
                <i class="bi bi-file-earmark-pdf"></i>
                <p>Vista previa no disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
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

const handleDownload = (document: Document) => {
  const link = document.createElement('a')
  link.href = document.fileUrl
  link.download = document.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handlePreview = (document: Document) => {
  previewDocument.value = document
  showPdfModal.value = true
  document.body.style.overflow = 'hidden'
}

const closePdfModal = () => {
  showPdfModal.value = false
  previewDocument.value = null
  document.body.style.overflow = ''
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

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
  background-image:
    radial-gradient(circle at 20% 50%, rgba(93,138,47,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(122,171,61,0.08) 0%, transparent 40%);
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
  color: rgba(255,255,255,0.75);
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
  backdrop-filter: blur(12px);
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

/* ============================================================
   INTRO TEXT
   ============================================================ */
.intro-section {
  padding: 3.5rem 0 3rem;
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
</style>
