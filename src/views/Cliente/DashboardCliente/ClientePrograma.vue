<template>
  <div :data-bs-theme="currentTheme" class="programa-detalle">
    <!-- Breadcrumb -->
    <section class="breadcrumb-section">
      <div class="container">
        <nav class="custom-breadcrumb">
          <router-link to="/cliente" class="breadcrumb-link">
            <i class="bi bi-arrow-left"></i> Panel del Cliente
          </router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ program?.title }}</span>
        </nav>
      </div>
    </section>

    <!-- Header del Programa -->
    <section class="program-header">
      <div class="container">
        <div class="header-card" data-aos="fade-up">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <span class="section-eyebrow">Programa</span>
              <h1 class="program-title">{{ program?.title }}</h1>
              <p class="program-description">{{ program?.description }}</p>
              <div class="program-meta">
                <span><i class="bi bi-calendar3"></i> {{ program?.startDate }} - {{ program?.endDate }}</span>
                <span><i class="bi bi-person"></i> Coordinador: {{ program?.coordinator }}</span>
              </div>
            </div>
            <div class="col-lg-4 text-lg-end">
              <span class="status-badge" :class="program?.status">
                {{ program?.status === 'active' ? 'Activo' : 'Completado' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentos -->
    <section class="documents-section">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-eyebrow">Recursos</span>
          <h2 class="section-title">Documentos del Programa</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Accede a todos los documentos técnicos, protocolos y guías</p>
        </div>

        <div class="documents-grid">
          <div
            v-for="(doc, idx) in programDocuments"
            :key="doc.id"
            class="document-card"
            data-aos="fade-up"
            :data-aos-delay="idx * 50"
          >
            <div class="doc-icon-wrap">
              <i :class="doc.icon"></i>
            </div>
            <div class="doc-content">
              <h4 class="doc-title">{{ doc.title }}</h4>
              <p class="doc-description">{{ doc.description }}</p>
              <div class="doc-meta">
                <span><i class="bi bi-file-earmark"></i> {{ doc.type }}</span>
                <span><i class="bi bi-hdd"></i> {{ doc.size }}</span>
                <span><i class="bi bi-calendar-check"></i> {{ doc.date }}</span>
              </div>
            </div>
            <div class="doc-actions">
              <button class="preview-btn" @click="previewDocument(doc)">
                <i class="bi bi-eye"></i>
              </button>
              <button class="download-doc-btn" @click="downloadDocument(doc)">
                <i class="bi bi-download"></i>
                Descargar
              </button>
            </div>
          </div>
        </div>

        <!-- Categorías de documentos -->
        <div class="doc-categories">
          <div class="category-card" data-aos="fade-up">
            <div class="category-icon">
              <i class="bi bi-file-earmark-text"></i>
            </div>
            <h4>Protocolos</h4>
            <p>Documentos con los procedimientos y metodologías a seguir</p>
            <span class="category-count">{{ protocolsCount }} documentos</span>
          </div>
          <div class="category-card" data-aos="fade-up" data-aos-delay="100">
            <div class="category-icon">
              <i class="bi bi-file-earmark-bar-graph"></i>
            </div>
            <h4>Reportes</h4>
            <p>Resultados y análisis estadísticos de las rondas</p>
            <span class="category-count">{{ reportsCount }} documentos</span>
          </div>
          <div class="category-card" data-aos="fade-up" data-aos-delay="200">
            <div class="category-icon">
              <i class="bi bi-file-earmark-check"></i>
            </div>
            <h4>Certificados</h4>
            <p>Certificados de participación y conformidad</p>
            <span class="category-count">{{ certificatesCount }} documentos</span>
          </div>
          <div class="category-card" data-aos="fade-up" data-aos-delay="300">
            <div class="category-icon">
              <i class="bi bi-file-earmark-arrow-down"></i>
            </div>
            <h4>Formatos</h4>
            <p>Plantillas y formatos para reporte de resultados</p>
            <span class="category-count">{{ formatsCount }} documentos</span>
          </div>
        </div>
      </div>
    </section>

    <!-- PDF Modal -->
    <Teleport to="body">
      <div v-if="showPdfModal" class="modal-overlay" @click.self="closePdfModal">
        <div class="modal-container">
          <div class="modal-header">
            <h5>{{ selectedDocument?.title }}</h5>
            <button class="modal-close" @click="closePdfModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <embed
              v-if="selectedDocument?.url"
              :src="selectedDocument.url"
              type="application/pdf"
              class="pdf-embed"
            />
          </div>
        </div>
      </div>
    </Teleport>

    <FooterComponent :current-theme="currentTheme" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTheme = ref((localStorage.getItem('theme') as 'light' | 'dark') || 'light')
const showPdfModal = ref(false)
const selectedDocument = ref<any>(null)

// Datos del programa
const program = ref({
  id: Number(route.params.id),
  title: 'Análisis de Agua Potable',
  description: 'Programa de ensayos de aptitud para análisis fisicoquímicos y microbiológicos en agua potable y residual.',
  startDate: '15 Ene 2026',
  endDate: '15 Dic 2026',
  status: 'active',
  coordinator: 'Ing. María García López'
})

// Documentos del programa
const programDocuments = ref([
  { id: 1, title: 'Protocolo de Análisis Fisicoquímico', description: 'Procedimiento detallado para análisis de parámetros fisicoquímicos', type: 'PDF', size: '1.2 MB', date: '15/01/2026', icon: 'bi bi-file-earmark-pdf', url: '/docs/protocolo-fisicoquimico.pdf' },
  { id: 2, title: 'Guía de Muestreo de Agua', description: 'Lineamientos para la toma y preservación de muestras', type: 'PDF', size: '856 KB', date: '20/01/2026', icon: 'bi bi-file-earmark-pdf', url: '/docs/guia-muestreo.pdf' },
  { id: 3, title: 'Reporte Trimestral Q1 2026', description: 'Resultados y análisis estadístico del primer trimestre', type: 'PDF', size: '2.1 MB', date: '31/03/2026', icon: 'bi bi-file-earmark-bar-graph', url: '/docs/reporte-q1.pdf' },
  { id: 4, title: 'Certificado de Participación', description: 'Certificado oficial de participación en el programa', type: 'PDF', size: '345 KB', date: '15/01/2026', icon: 'bi bi-file-earmark-check', url: '/docs/certificado.pdf' },
  { id: 5, title: 'Formato de Reporte de Resultados', description: 'Plantilla para reportar resultados de análisis', type: 'XLSX', size: '234 KB', date: '10/01/2026', icon: 'bi bi-file-earmark-excel', url: '/docs/formato-reporte.xlsx' },
  { id: 6, title: 'Instructivo de Análisis Microbiológico', description: 'Guía para análisis de coliformes y bacterias', type: 'PDF', size: '1.5 MB', date: '01/02/2026', icon: 'bi bi-file-earmark-pdf', url: '/docs/instructivo-micro.pdf' },
  { id: 7, title: 'Tabla de Parámetros de Referencia', description: 'Valores de referencia para cada parámetro analizado', type: 'XLSX', size: '189 KB', date: '05/01/2026', icon: 'bi bi-file-earmark-excel', url: '/docs/parametros-referencia.xlsx' },
  { id: 8, title: 'Manual de Buenas Prácticas', description: 'Recomendaciones para asegurar la calidad de los análisis', type: 'PDF', size: '3.4 MB', date: '01/01/2026', icon: 'bi bi-file-earmark-pdf', url: '/docs/manual-bp.pdf' },
  { id: 9, title: 'Calendario de Rondas 2026', description: 'Fechas programadas para cada ronda del programa', type: 'PDF', size: '456 KB', date: '01/01/2026', icon: 'bi bi-file-earmark-pdf', url: '/docs/calendario-2026.pdf' },
  { id: 10, title: 'Guía de Interpretación de Resultados', description: 'Cómo interpretar los resultados estadísticos', type: 'PDF', size: '987 KB', date: '15/02/2026', icon: 'bi bi-file-earmark-pdf', url: '/docs/guia-interpretacion.pdf' },
  { id: 11, title: 'Lista de Verificación de Equipos', description: 'Checklist para verificar equipos antes del análisis', type: 'PDF', size: '234 KB', date: '10/01/2026', icon: 'bi bi-file-earmark-check', url: '/docs/checklist-equipos.pdf' },
  { id: 12, title: 'Procedimiento de Control de Calidad', description: 'Protocolo para aseguramiento de calidad interno', type: 'PDF', size: '1.8 MB', date: '20/01/2026', icon: 'bi bi-file-earmark-text', url: '/docs/procedimiento-cc.pdf' }
])

// Computed
const protocolsCount = computed(() => programDocuments.value.filter(d => d.icon === 'bi bi-file-earmark-pdf' || d.icon === 'bi bi-file-earmark-text').length)
const reportsCount = computed(() => programDocuments.value.filter(d => d.icon === 'bi bi-file-earmark-bar-graph').length)
const certificatesCount = computed(() => programDocuments.value.filter(d => d.icon === 'bi bi-file-earmark-check').length)
const formatsCount = computed(() => programDocuments.value.filter(d => d.icon === 'bi bi-file-earmark-excel').length)

// Methods
const previewDocument = (doc: any) => {
  selectedDocument.value = doc
  showPdfModal.value = true
  document.body.style.overflow = 'hidden'
}

const closePdfModal = () => {
  showPdfModal.value = false
  selectedDocument.value = null
  document.body.style.overflow = ''
}

const downloadDocument = (doc: any) => {
  if (doc.url) {
    window.open(doc.url, '_blank')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-text: #1c2b14;
  --sena-muted: #5a6a52;
  --sena-border: rgba(93, 138, 47, 0.14);
  --radius-card: 20px;
  --shadow-sm: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
}

.programa-detalle {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .programa-detalle {
  background: #0c0f0a;
  color: #e8ede3;
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122,171,61,0.16);
  --sena-green-pale: rgba(93,138,47,0.12);
}

/* Breadcrumb */
.breadcrumb-section {
  padding: 1.5rem 0;
  background: #ffffff;
  border-bottom: 1px solid var(--sena-border);
}
[data-bs-theme="dark"] .breadcrumb-section { background: #0e1509; }
.custom-breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
.breadcrumb-link { color: var(--sena-green); text-decoration: none; display: flex; align-items: center; gap: 0.4rem; }
.breadcrumb-link:hover { color: var(--sena-green-light); }
.breadcrumb-separator { color: var(--sena-muted); }
.breadcrumb-current { color: var(--sena-muted); font-weight: 500; }

/* Program Header */
.program-header {
  padding: 3rem 0;
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
}
.header-card { position: relative; z-index: 1; }
.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(122,171,61,0.85);
  background: rgba(122,171,61,0.15);
  padding: 0.28rem 0.9rem;
  border-radius: 20px;
  margin-bottom: 0.6rem;
}
.program-title {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
}
.program-description { color: rgba(255,255,255,0.75); font-size: 1rem; margin-bottom: 1rem; }
.program-meta { display: flex; flex-wrap: wrap; gap: 1.5rem; color: rgba(255,255,255,0.6); font-size: 0.85rem; }
.program-meta i { margin-right: 0.4rem; color: var(--sena-green-light); }
.status-badge {
  padding: 0.4rem 1.25rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.85rem;
}
.status-badge.active { background: rgba(93,138,47,0.3); color: #fff; border: 1px solid rgba(122,171,61,0.4); }
.status-badge.completed { background: rgba(108,117,125,0.3); color: #fff; }

/* Documents */
.documents-section {
  padding: 4rem 0;
}
.section-header { text-align: center; margin-bottom: 3rem; }
.section-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--sena-text);
}
.section-subtitle { color: var(--sena-muted); margin-top: 0.75rem; }
.title-underline {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
}
.title-underline.centered { margin: 0.6rem auto 0; }

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}
.document-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--sena-border);
  display: flex;
  gap: 1rem;
  transition: var(--transition);
}
[data-bs-theme="dark"] .document-card { background: #131a0e; }
.document-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--sena-green-light);
}
.doc-icon-wrap {
  width: 52px;
  height: 52px;
  background: var(--sena-green-pale);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--sena-green);
  flex-shrink: 0;
}
.doc-content { flex: 1; min-width: 0; }
.doc-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.3rem; }
.doc-description { font-size: 0.78rem; color: var(--sena-muted); margin-bottom: 0.5rem; }
.doc-meta { display: flex; gap: 1rem; font-size: 0.7rem; color: var(--sena-muted); }
.doc-actions { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; }
.preview-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--sena-border);
  background: transparent;
  color: var(--sena-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}
.preview-btn:hover { border-color: var(--sena-green); color: var(--sena-green); }
.download-doc-btn {
  padding: 0.4rem 0.9rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: var(--transition);
}
.download-doc-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(93,138,47,0.3); }

/* Categories */
.doc-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}
.category-card {
  background: #ffffff;
  border-radius: var(--radius-card);
  padding: 2rem;
  text-align: center;
  border: 1px solid var(--sena-border);
  transition: var(--transition);
}
[data-bs-theme="dark"] .category-card { background: #131a0e; }
.category-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(93,138,47,0.1); }
.category-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem;
  background: var(--sena-green-pale);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--sena-green);
}
.category-card h4 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
.category-card p { font-size: 0.8rem; color: var(--sena-muted); margin-bottom: 1rem; }
.category-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--sena-green);
}

/* Modal */
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
}
[data-bs-theme="dark"] .modal-container { background: #1a2412; }
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--sena-border);
}
.modal-header h5 { font-weight: 600; margin: 0; }
.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--sena-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-body { flex: 1; overflow: hidden; }
.pdf-embed { width: 100%; height: 75vh; border: none; }

@media (max-width: 768px) {
  .program-title { font-size: 2rem; }
  .documents-grid { grid-template-columns: 1fr; }
}
</style>
