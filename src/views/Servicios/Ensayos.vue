<template>
  <div :data-bs-theme="currentTheme" class="ensayos-aptitud-page">
    <!-- Hero Section -->
    <section class="service-hero">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Ensayos de Aptitud</h1>
              <p class="hero-subtitle">
                Evaluación objetiva de la competencia técnica de laboratorios mediante
                programas organizados bajo la norma <strong>ISO/IEC 17043:2023</strong>
              </p>
              <div class="hero-badges">
                <span class="badge bg-primary">
                  <i class="bi bi-award"></i> Acreditado
                </span>
                <span class="badge bg-success">
                  <i class="bi bi-globe2"></i> Internacional
                </span>
                <span class="badge bg-info">
                  <i class="bi bi-people"></i> Soporte Técnico
                </span>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-image">
              <div class="image-wrapper">
                <i class="bi bi-clipboard-data"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="benefits-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Valor Agregado SENA</h2>
          <p class="section-subtitle">
            Ofrecemos más que solo resultados - proporcionamos desarrollo continuo
          </p>
        </div>

        <div class="row g-4">
          <div class="col-md-6" data-aos="fade-right">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="bi bi-chat-left-text"></i>
              </div>
              <div class="benefit-content">
                <h4>Reuniones de Realimentación</h4>
                <p>
                  Al término de cada programa se lleva a cabo una reunión de realimentación,
                  donde los laboratorios participantes pueden interactuar directamente con
                  nuestros colaboradores técnicos de alto nivel.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6" data-aos="fade-left">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="bi bi-person-badge"></i>
              </div>
              <div class="benefit-content">
                <h4>Expertos Internacionales</h4>
                <p>
                  Nuestros colaboradores técnicos se capacitaron en importantes centros de
                  metrología nacionales y a nivel mundial, contando con vasta experiencia
                  en cada una de las áreas de especialización.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6" data-aos="fade-right">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="bi bi-headset"></i>
              </div>
              <div class="benefit-content">
                <h4>Soporte Integral</h4>
                <p>
                  Nuestros colaboradores técnicos brindan apoyo antes, durante y después
                  de cada programa de ensayos, asegurando el éxito en la implementación
                  y aplicación de los resultados.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6" data-aos="fade-left">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="bi bi-graph-up"></i>
              </div>
              <div class="benefit-content">
                <h4>Mejora Continua</h4>
                <p>
                  Los programas están diseñados para identificar oportunidades de mejora
                  y fortalecer las capacidades técnicas de los laboratorios participantes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ensayos Técnicos -->
    <section class="technical-section py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5" data-aos="fade-right">
            <div class="technical-image">
              <div class="image-wrapper">
                <i class="bi bi-gear-wide-connected"></i>
              </div>
            </div>
          </div>
          <div class="col-lg-7" data-aos="fade-left">
            <div class="technical-content">
              <h2 class="section-title mb-4">ENSAYOS DE APTITUD TÉCNICA EN ENSAYOS</h2>
              <p class="lead mb-4">
                Estos ensayos permiten comprobar la competencia técnica así como la
                experiencia de los metrólogos en los laboratorios de ensayos.
              </p>

              <div class="features-list">
                <div class="feature-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Evaluación objetiva de competencias técnicas</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Validación de métodos de ensayo</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Verificación de trazabilidad metrológica</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Evaluación de incertidumbre de medición</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Desarrollo de habilidades técnicas</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Cumplimiento de requisitos normativos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentos por País -->
    <section class="documents-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Documentación Técnica</h2>
          <p class="section-subtitle">
            Accede a los protocolos, guías y documentos técnicos por país
          </p>
        </div>

        <!-- Tabs de Países -->
        <div class="countries-tabs" data-aos="fade-up">
          <ul class="nav nav-tabs justify-content-center" id="countryTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="mexico-tab"
                data-bs-toggle="tab"
                data-bs-target="#mexico"
                type="button"
                role="tab"
              >
                <i class="bi bi-flag me-2"></i>México
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="colombia-tab"
                data-bs-toggle="tab"
                data-bs-target="#colombia"
                type="button"
                role="tab"
              >
                <i class="bi bi-flag me-2"></i>Colombia
              </button>
            </li>
          </ul>

          <div class="tab-content mt-4" id="countryTabsContent">
            <!-- México -->
            <div class="tab-pane fade show active" id="mexico" role="tabpanel">
              <div class="row g-4 justify-content-center">
                <div class="col-md-6" data-aos="fade-up">
                  <div class="card country-card h-100 text-center">
                    <div class="card-body">
                      <div class="flag" aria-hidden="true">🇲🇽</div>
                      <h5 class="card-title mt-3">Programa nacional Mexico Sena 2026</h5>
                      <p class="card-text mb-3">Documento oficial con el programa nacional de actividades y lineamientos SENA México 2026.</p>
                      <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-primary" @click="openPdfModal({ id: 'mx-2026', title: 'Programa nacional Mexico Sena 2026', code: 'PN-MX-2026', version: '1.0', date: '2026-01-01', pages: 12, size: '1.2 MB', url: '/src/pdf/PROGRAMA%20NACIONAL%20MEXICO%20SENA%202026.pdf', downloadUrl: '/src/pdf/PROGRAMA%20NACIONAL%20MEXICO%20SENA%202026.pdf', description: 'Programa nacional Mexico Sena 2026' , icon: 'bi bi-file-earmark-pdf' })">
                          <i class="bi bi-eye me-2"></i>Vista previa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colombia -->
            <div class="tab-pane fade" id="colombia" role="tabpanel">
              <div class="row g-4 justify-content-center">
                <div class="col-md-6" data-aos="fade-up">
                  <div class="card country-card h-100 text-center">
                    <div class="card-body">
                      <div class="flag" aria-hidden="true">🇨🇴</div>
                      <h5 class="card-title mt-3">Programa colombia sena 2026</h5>
                      <p class="card-text mb-3">Documento oficial con el programa nacional SENA Colombia 2026.</p>
                      <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-primary" @click="openPdfModal({ id: 'co-2026', title: 'Programa colombia sena 2025', code: 'PN-CO-2025', version: '1.0', date: '2025-01-01', pages: 10, size: '1.0 MB', url: '/src/pdf/PROGRAMA%20COLOMBIA%20SENA%202025.pdf', downloadUrl: '/src/pdf/PROGRAMA%20COLOMBIA%20SENA%202025.pdf', description: 'Programa colombia sena 2025', icon: 'bi bi-file-earmark-pdf' })">
                          <i class="bi bi-eye me-2"></i>Vista previa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Agua y Alimentos -->
    <section class="water-food-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="section-title">Agua y Alimentos</h2>
          <p class="section-subtitle">
            Programas especializados en análisis microbiológicos y químicos
          </p>
        </div>

        <div class="row g-4">
          <DocumentCard
            v-for="doc in waterFoodDocuments"
            :key="doc.id"
            :document="doc"
            :current-theme="currentTheme"
            @open-modal="openPdfModal"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-5">
      <div class="container">
        <div class="cta-card" data-aos="fade-up">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h2 class="cta-title">¿Listo para participar en nuestros programas?</h2>
              <p class="cta-description">
                Únete a nuestros programas de ensayos de aptitud y fortalece las
                competencias técnicas de tu laboratorio con el respaldo de expertos
                internacionales.
              </p>
              <div class="cta-features">
                <div class="feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Inscripción en línea</span>
                </div>
                <div class="feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Soporte técnico personalizado</span>
                </div>
                <div class="feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Certificación internacional</span>
                </div>
              </div>
            </div>
            <div class="col-lg-4 text-lg-end">
              <router-link to="/contacto" class="btn btn-primary btn-lg">
                <i class="bi bi-calendar-check me-2"></i>Solicitar Información
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterComponent :current-theme="currentTheme" />

    <!-- PDF Modal -->
    <div
      class="modal fade"
      id="pdfModal"
      tabindex="-1"
      aria-labelledby="pdfModalLabel"
      aria-hidden="true"
      ref="pdfModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="pdfModalLabel">{{ selectedDocument?.title }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
                <div v-if="selectedDocument" class="pdf-container">
              <!-- PDF Viewer -->
              <div class="pdf-viewer">
                <div class="pdf-placeholder" v-if="!(selectedDocument.url || selectedDocument.downloadUrl)">
                  <i class="bi bi-file-earmark-pdf"></i>
                  <p>Vista previa no disponible</p>
                </div>
                <embed
                  v-else
                  :src="selectedDocument.url || selectedDocument.downloadUrl"
                  type="application/pdf"
                  class="pdf-embed"
                />
              </div>

              <!-- Document Info -->
              <div class="document-info">
                <div class="info-section">
                  <h6><i class="bi bi-info-circle me-2"></i>Información del Documento</h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Título:</span>
                      <span class="info-value">{{ selectedDocument.title }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Código:</span>
                      <span class="info-value">{{ selectedDocument.code }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Versión:</span>
                      <span class="info-value">{{ selectedDocument.version }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Fecha:</span>
                      <span class="info-value">{{ selectedDocument.date }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Páginas:</span>
                      <span class="info-value">{{ selectedDocument.pages }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Tamaño:</span>
                      <span class="info-value">{{ selectedDocument.size }}</span>
                    </div>
                  </div>
                </div>

                <div class="info-section">
                  <h6><i class="bi bi-file-text me-2"></i>Descripción</h6>
                  <p class="description">{{ selectedDocument.description }}</p>
                </div>

                <!-- Descargas deshabilitadas: solo vista previa en modal según especificación -->
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import DocumentCard from '@/components/Servicios/DocumentCard.vue'
import type { Modal } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type Country = 'mexico' | 'colombia'
type DocumentCategory = 'general' | 'water-food'

interface Document {
  id: number
  title: string
  code: string
  description: string
  category: DocumentCategory
  country: Country
  version: string
  date: string
  pages: number
  size: string
  url?: string
  downloadUrl: string
  icon: string
}

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del modal
const selectedDocument = ref<Document | null>(null)
const pdfModal = ref<HTMLDivElement | null>(null)
let modalInstance: Modal | null = null

// Documentos de México
const mexicoDocuments: Document[] = [
  {
    id: 1,
    title: 'Protocolo de Ensayos de Aptitud - Masa',
    code: 'PEA-MX-001-2024',
    description: 'Protocolo para ensayos de aptitud en masa conforme a normas mexicanas',
    category: 'general',
    country: 'mexico',
    version: '3.2',
    date: '2024-01-15',
    pages: 45,
    size: '2.4 MB',
    downloadUrl: '/documents/mexico/pea-masa-2024.pdf',
    icon: 'bi bi-scale'
  },
  {
    id: 2,
    title: 'Guía Técnica para Laboratorios de Calibración',
    code: 'GT-MX-002-2024',
    description: 'Requisitos y procedimientos para laboratorios de calibración en México',
    category: 'general',
    country: 'mexico',
    version: '2.1',
    date: '2024-02-10',
    pages: 68,
    size: '3.1 MB',
    downloadUrl: '/documents/mexico/guia-calibracion-2024.pdf',
    icon: 'bi bi-gear'
  },
  {
    id: 3,
    title: 'Programa de Ensayos de Aptitud - Temperatura',
    code: 'PEA-MX-003-2024',
    description: 'Programa especializado en ensayos de aptitud para temperatura',
    category: 'general',
    country: 'mexico',
    version: '1.5',
    date: '2024-03-05',
    pages: 52,
    size: '2.8 MB',
    downloadUrl: '/documents/mexico/pea-temperatura-2024.pdf',
    icon: 'bi bi-thermometer'
  },
  {
    id: 4,
    title: 'Manual de Procedimientos EMA',
    code: 'MP-MX-004-2024',
    description: 'Manual de procedimientos según Entidad Mexicana de Acreditación',
    category: 'general',
    country: 'mexico',
    version: '4.0',
    date: '2024-01-30',
    pages: 89,
    size: '4.2 MB',
    downloadUrl: '/documents/mexico/manual-ema-2024.pdf',
    icon: 'bi bi-journal-text'
  }
]

// Documentos de Colombia
const colombiaDocuments: Document[] = [
  {
    id: 5,
    title: 'Protocolo de Ensayos de Aptitud - ONAC',
    code: 'PEA-CO-001-2024',
    description: 'Protocolos aprobados por el Organismo Nacional de Acreditación de Colombia',
    category: 'general',
    country: 'colombia',
    version: '2.3',
    date: '2024-02-20',
    pages: 58,
    size: '2.9 MB',
    downloadUrl: '/documents/colombia/pea-onac-2024.pdf',
    icon: 'bi bi-file-earmark-check'
  },
  {
    id: 6,
    title: 'Guía de Implementación NTC-ISO/IEC 17043:2023',
    code: 'GI-CO-002-2024',
    description: 'Guía para implementación de sistemas de gestión según norma colombiana',
    category: 'general',
    country: 'colombia',
    version: '1.8',
    date: '2024-03-15',
    pages: 72,
    size: '3.5 MB',
    downloadUrl: '/documents/colombia/guia-ntc-17043.pdf',
    icon: 'bi bi-book'
  },
  {
    id: 7,
    title: 'Programa de Evaluación de Competencia Técnica',
    code: 'PECT-CO-003-2024',
    description: 'Programa especial para evaluación de competencia técnica en Colombia',
    category: 'general',
    country: 'colombia',
    version: '1.2',
    date: '2024-01-25',
    pages: 47,
    size: '2.5 MB',
    downloadUrl: '/documents/colombia/pect-2024.pdf',
    icon: 'bi bi-clipboard-check'
  },
  {
    id: 8,
    title: 'Manual de Buenas Prácticas de Laboratorio',
    code: 'MBPL-CO-004-2024',
    description: 'Manual de buenas prácticas para laboratorios en Colombia',
    category: 'general',
    country: 'colombia',
    version: '3.1',
    date: '2024-02-28',
    pages: 81,
    size: '3.8 MB',
    downloadUrl: '/documents/colombia/mbpl-2024.pdf',
    icon: 'bi bi-briefcase'
  }
]

// Documentos de Agua y Alimentos
const waterFoodDocuments: Document[] = [
  {
    id: 9,
    title: 'Protocolo de Ensayos - Análisis de Agua',
    code: 'PEA-AF-001-2024',
    description: 'Protocolo para análisis microbiológicos y químicos en agua potable',
    category: 'water-food',
    country: 'mexico',
    version: '2.4',
    date: '2024-03-10',
    pages: 63,
    size: '3.2 MB',
    downloadUrl: '/documents/water-food/analisis-agua-2024.pdf',
    icon: 'bi bi-droplet'
  },
  {
    id: 10,
    title: 'Guía para Análisis de Alimentos',
    code: 'GAA-AF-002-2024',
    description: 'Guía completa para análisis de alimentos según normas internacionales',
    category: 'water-food',
    country: 'mexico',
    version: '1.9',
    date: '2024-02-15',
    pages: 76,
    size: '3.6 MB',
    downloadUrl: '/documents/water-food/analisis-alimentos-2024.pdf',
    icon: 'bi bi-egg-fried'
  },
  {
    id: 11,
    title: 'Programa de Ensayos de Aptitud - Microbiología',
    code: 'PEA-AF-003-2024',
    description: 'Programa especializado en ensayos de aptitud microbiológica',
    category: 'water-food',
    country: 'colombia',
    version: '1.6',
    date: '2024-03-20',
    pages: 54,
    size: '2.7 MB',
    downloadUrl: '/documents/water-food/microbiologia-2024.pdf',
    icon: 'bi bi-bug'
  },
  {
    id: 12,
    title: 'Manual de Técnicas Analíticas',
    code: 'MTA-AF-004-2024',
    description: 'Manual de técnicas analíticas avanzadas para agua y alimentos',
    category: 'water-food',
    country: 'colombia',
    version: '2.2',
    date: '2024-01-20',
    pages: 92,
    size: '4.5 MB',
    downloadUrl: '/documents/water-food/tecnicas-analiticas-2024.pdf',
    icon: 'bi bi-flask'
  }
]

// Métodos
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)
}

const openPdfModal = (document: Document) => {
  selectedDocument.value = document

  if (pdfModal.value) {
    import('bootstrap').then((bootstrap) => {
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(pdfModal.value!)
      }
      modalInstance.show()
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
.ensayos-aptitud-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .ensayos-aptitud-page {
  background: linear-gradient(135deg, #121212 0%, #1A1A1A 100%);
}

/* Breadcrumb */
.breadcrumb-section {
  background: var(--color-light, white);
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 1rem 0;
  position: sticky;
  top: 120px;
  z-index: 99;
}

[data-bs-theme="dark"] .breadcrumb-section {
  background: var(--color-light, #121212);
  border-color: var(--color-gray-light, #2d2d2d);
}

.breadcrumb {
  margin: 0;
  padding: 0;
  background: transparent;
}

.breadcrumb-item + .breadcrumb-item::before {
  color: var(--color-gray, #6C757D);
}

.breadcrumb-link {
  color: var(--color-primary, #a6b828);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--color-primary-dark, #a6b828);
}

.breadcrumb-item.active {
  color: var(--color-gray, #6C757D);
}

/* Hero Section */
.service-hero {
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  color: white;
  padding: 4rem 0;
  position: relative;
  overflow: hidden;
}

.service-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
}

.hero-subtitle strong {
  color: #FFD700;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero-badges .badge {
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-image {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.image-wrapper {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 5rem;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Benefits Section */
.benefits-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .benefits-section {
  background: var(--color-light, #121212);
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
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

[data-bs-theme="dark"] .section-subtitle {
  color: var(--color-gray, #6C757D);
}

.benefit-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

[data-bs-theme="dark"] .benefit-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary, #a6b828);
}

.benefit-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.benefit-content h4 {
  color: var(--color-dark, #212529);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .benefit-content h4 {
  color: var(--color-dark, #F8F9FA);
}

.benefit-content p {
  color: var(--color-gray, #6C757D);
  line-height: 1.6;
  margin: 0;
}

/* Technical Section */
.technical-section {
  background: var(--lab-bg, #f8f9fa);
}

[data-bs-theme="dark"] .technical-section {
  background: var(--lab-bg, #1a1a1a);
}

.technical-image {
  display: flex;
  justify-content: center;
}

.technical-image .image-wrapper {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #a6b828 0%, #a6b828 100%);
  color: white;
  font-size: 6rem;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.technical-content .lead {
  color: var(--color-gray-dark, #495057);
  font-size: 1.25rem;
  line-height: 1.6;
}

[data-bs-theme="dark"] .technical-content .lead {
  color: var(--color-gray-dark, #ADB5BD);
}

.features-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.feature-item i {
  color: var(--color-primary, #a6b828);
  font-size: 1.1rem;
}

.feature-item span {
  color: var(--color-gray-dark, #495057);
  font-weight: 500;
}

[data-bs-theme="dark"] .feature-item span {
  color: var(--color-gray-dark, #ADB5BD);
}

/* Documents Section */
.documents-section {
  background: var(--color-light, white);
}

[data-bs-theme="dark"] .documents-section {
  background: var(--color-light, #121212);
}

.countries-tabs .nav-tabs {
  border-bottom: 2px solid var(--color-gray-light, #E9ECEF);
}

.countries-tabs .nav-link {
  color: var(--color-gray, #6C757D);
  font-weight: 600;
  padding: 1rem 2rem;
}

/* Country card styles */
.country-card {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.04);
  background: var(--card-bg, #fff);
}
.country-card .flag {
  font-size: 4rem;
  line-height: 1;
  display: block;
  margin: 0 auto;
}
.country-card .card-title {
  font-weight: 700;
}
.country-card .card-text {
  color: var(--color-gray, #6C757D);
}

[data-bs-theme="dark"] .country-card {
  background: #2b2b2b;
  border-color: rgba(255,255,255,0.04);
}

.documents-section .tab-content { padding-top: 1.5rem; }

.pdf-container { display:flex; gap:1.5rem; }
.pdf-viewer { flex: 1 1 65%; min-height: 70vh; }
.pdf-iframe { width: 100%; height: 100%; border: 0; min-height: 480px; }
.pdf-embed { width: 100%; height: 70vh; border: 0; }
.document-info { flex: 1 1 35%; }
.info-grid { display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; }
.info-item .info-label { font-weight:600; color:var(--color-gray, #6C757D); }
.description { color:var(--color-gray-dark, #495057); }

.cta-section .cta-card { background: linear-gradient(135deg, #fff 0%, #f6f8f6 100%); padding:2rem; border-radius:12px; }

@media (max-width: 768px) {
  .pdf-container { flex-direction: column; }
  .document-info { order: 2; }
  .pdf-viewer { order: 1; }
}

</style>
