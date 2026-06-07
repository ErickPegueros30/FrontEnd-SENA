<template>
  <div :data-bs-theme="currentTheme" class="ensayos-aptitud-page">

    <!-- Hero Section -->
    <section class="service-hero">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7" data-aos="fade-right">
            <div class="hero-content">
              <span class="section-eyebrow">Servicios</span>
              <h1 class="hero-title">Ensayos de Aptitud</h1>
              <p class="hero-subtitle">
                Evaluación objetiva de la competencia técnica de laboratorios mediante
                programas organizados bajo la norma <strong>ISO/IEC 17043:2023</strong>
              </p>
              <div class="hero-badges">
                <span class="badge-item">
                  <i class="bi bi-award-fill"></i>
                  <span>Acreditado</span>
                </span>
                <span class="badge-item">
                  <i class="bi bi-globe2"></i>
                  <span>Internacional</span>
                </span>
                <span class="badge-item">
                  <i class="bi bi-people-fill"></i>
                  <span>Soporte Técnico</span>
                </span>
              </div>
            </div>
          </div>
          <div class="col-lg-5" data-aos="fade-left">
            <div class="hero-image">
              <div class="image-wrapper">
                <i class="bi bi-clipboard-data"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios -->
    <section class="services-section">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-eyebrow">Especialización</span>
          <h2 class="section-title">Ensayos de Aptitud</h2>
          <div class="title-underline"></div>
        </div>

        <div class="services-row" data-aos="fade-up">
          <button v-for="service in servicesRow1" :key="service.id" class="service-btn" @click="goToService(service.id)">
            <div class="service-icon-wrap">
              <div class="service-icon"><i :class="service.icon"></i></div>
            </div>
            <span class="service-name">{{ service.name }}</span>
          </button>
        </div>

        <div class="services-row" data-aos="fade-up" data-aos-delay="100">
          <button v-for="service in servicesRow2" :key="service.id" class="service-btn" @click="goToService(service.id)">
            <div class="service-icon-wrap">
              <div class="service-icon"><i :class="service.icon"></i></div>
            </div>
            <span class="service-name">{{ service.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="benefits-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Valor Agregado</span>
          <h2 class="section-title">¿Por qué SENA?</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Ofrecemos más que solo resultados - proporcionamos desarrollo continuo</p>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card" v-for="(benefit, idx) in benefits" :key="idx" data-aos="fade-up" :data-aos-delay="idx * 100">
            <div class="benefit-icon-wrap">
              <i :class="benefit.icon"></i>
            </div>
            <div class="benefit-content">
              <h4>{{ benefit.title }}</h4>
              <p>{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ensayos Técnicos -->
    <section class="technical-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5" data-aos="fade-right">
            <div class="technical-image">
              <div class="tech-image-wrapper">
                <i class="bi bi-gear-wide-connected"></i>
              </div>
            </div>
          </div>
          <div class="col-lg-7" data-aos="fade-left">
            <div class="technical-content">
              <span class="section-eyebrow">Enfoque</span>
              <h2 class="section-title">Ensayos de Aptitud Técnica</h2>
              <div class="title-underline"></div>
              <p class="technical-description">
                Estos ensayos permiten comprobar la competencia técnica así como la
                experiencia de los metrólogos en los laboratorios de ensayos.
              </p>

              <div class="features-list">
                <div class="feature-item" v-for="(feature, idx) in technicalFeatures" :key="idx">
                  <div class="feature-check">
                    <i class="bi bi-check-lg"></i>
                  </div>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentos por País -->
    <section class="documents-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Recursos</span>
          <h2 class="section-title">Documentación Técnica</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Accede a los protocolos, guías y documentos técnicos por país</p>
        </div>

        <!-- Tabs de Países -->
        <div class="countries-tabs" data-aos="fade-up">
          <div class="tab-nav">
            <button
              :class="['tab-btn', { active: activeTab === 'mexico' }]"
              @click="activeTab = 'mexico'"
            >
              <i class="bi bi-flag-fill"></i> México
            </button>
            <button
              :class="['tab-btn', { active: activeTab === 'colombia' }]"
              @click="activeTab = 'colombia'"
            >
              <i class="bi bi-flag-fill"></i> Colombia
            </button>
          </div>

          <div class="tab-content mt-4">
            <!-- México -->
            <div v-show="activeTab === 'mexico'" class="documents-grid">
              <div class="document-card" data-aos="fade-up">
                <div class="doc-flag"><img src="https://flagcdn.com/w40/mx.png" alt="México" class="flag-img" /></div>
                <h5 class="doc-title">Programa Nacional México SENA 2026</h5>
                <p class="doc-description">Documento oficial con el programa nacional de actividades y lineamientos SENA México 2026.</p>
                <button class="doc-btn" @click="openPdfModal(mexicoDoc)">
                  <i class="bi bi-eye"></i>
                  <span>Vista previa</span>
                </button>
              </div>
            </div>

            <!-- Colombia -->
            <div v-show="activeTab === 'colombia'" class="documents-grid">
                <div class="document-card" data-aos="fade-up">
                <div class="doc-flag"><img src="https://flagcdn.com/w40/co.png" alt="Colombia" class="flag-img" /></div>
                <h5 class="doc-title">Programa Colombia SENA 2026</h5>
                <p class="doc-description">Documento oficial con el programa nacional SENA Colombia 2026.</p>
                <button class="doc-btn" @click="openPdfModal(colombiaDoc)">
                  <i class="bi bi-eye"></i>
                  <span>Vista previa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Agua y Alimentos -->
    <section class="water-food-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Programas Especializados</span>
          <h2 class="section-title">Agua y Alimentos</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Programas especializados en análisis microbiológicos y químicos</p>
        </div>

        <div class="programs-grid">
          <div v-for="doc in programaDocuments" :key="doc.id" class="program-card" data-aos="fade-up">
            <div class="program-icon">
              <i :class="doc.icon"></i>
            </div>
            <h5 class="program-title">{{ doc.title }}</h5>
            <p class="program-description">{{ doc.description }}</p>
            <button class="doc-btn" @click="openPdfModal(doc)">
              <i class="bi bi-eye"></i>
              <span>Vista previa</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-wrapper" data-aos="fade-up">
          <div class="cta-content">
            <h2 class="cta-title">¿Listo para participar?</h2>
            <p class="cta-description">
              Únete a nuestros programas de ensayos de aptitud y fortalece las
              competencias técnicas de tu laboratorio con el respaldo de expertos internacionales.
            </p>
            <div class="cta-features">
              <div class="cta-feature">
                <i class="bi bi-check-circle-fill"></i>
                <span>Inscripción en línea</span>
              </div>
              <div class="cta-feature">
                <i class="bi bi-check-circle-fill"></i>
                <span>Soporte técnico personalizado</span>
              </div>
              <div class="cta-feature">
                <i class="bi bi-check-circle-fill"></i>
                <span>Certificación internacional</span>
              </div>
            </div>
          </div>
          <div class="cta-action">
            <router-link to="/contacto" class="contact-btn">
              Solicitar Información
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
            <h5 class="modal-title">{{ selectedDocument?.title }}</h5>
            <button class="modal-close" @click="closePdfModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedDocument" class="pdf-viewer">
              <embed
                v-if="selectedDocument.url || selectedDocument.downloadUrl"
                :src="selectedDocument.url || selectedDocument.downloadUrl"
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
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer.vue/Footer.vue'

type Theme = 'light' | 'dark'

interface Document {
  id: number
  title: string
  code: string
  description: string
  version: string
  date: string
  pages: number
  size: string
  url?: string
  downloadUrl?: string
  icon: string
}

interface Service {
  id: number
  name: string
  icon: string
  route: string
}

const router = useRouter()
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')
const activeTab = ref('mexico')
const showPdfModal = ref(false)
const selectedDocument = ref<Document | null>(null)

const servicesRow1: Service[] = [
  { id: 1, name: 'Agua', icon: 'bi bi-droplet-fill', route: '/servicios/agua' },
  { id: 2, name: 'Alimentos', icon: 'bi bi-cup-straw', route: '/servicios/alimentos' },
  { id: 3, name: 'Masa', icon: 'bi bi-bar-chart-steps', route: '/servicios/masa' },
  { id: 4, name: 'Temperatura', icon: 'bi bi-thermometer-sun', route: '/servicios/temperatura' },
  { id: 5, name: 'Presión', icon: 'bi bi-speedometer2', route: '/servicios/presion' },
  { id: 6, name: 'Volumen', icon: 'bi bi-cup', route: '/servicios/volumen' }
]

const servicesRow2: Service[] = [
  { id: 7, name: 'Densidad', icon: 'bi bi-water', route: '/servicios/densidad' },
  { id: 8, name: 'Eléctrica', icon: 'bi bi-lightning-charge-fill', route: '/servicios/electrica' },
  { id: 9, name: 'Dimensional', icon: 'bi bi-bounding-box-circles', route: '/servicios/dimensional' },
  { id: 10, name: 'Humedad', icon: 'bi bi-cloud-rain-fill', route: '/servicios/humedad' },
  { id: 11, name: 'Flujo', icon: 'bi bi-wind', route: '/servicios/flujo' },
  { id: 12, name: 'Mediciones Especiales', icon: 'bi bi-stars', route: '/servicios/mediciones-especiales' }
]

const goToService = (serviceId: number) => {
  const service = [...servicesRow1, ...servicesRow2].find(s => s.id === serviceId)
  if (service) router.push(service.route)
}

const benefits = [
  {
    icon: 'bi bi-chat-left-text-fill',
    title: 'Reuniones de Realimentación',
    description: 'Al término de cada programa se lleva a cabo una reunión de realimentación, donde los laboratorios participantes pueden interactuar directamente con nuestros colaboradores técnicos de alto nivel.'
  },
  {
    icon: 'bi bi-person-badge-fill',
    title: 'Expertos Internacionales',
    description: 'Nuestros colaboradores técnicos se capacitaron en importantes centros de metrología nacionales y a nivel mundial, contando con vasta experiencia en cada una de las áreas de especialización.'
  },
  {
    icon: 'bi bi-headset',
    title: 'Soporte Integral',
    description: 'Nuestros colaboradores técnicos brindan apoyo antes, durante y después de cada programa de ensayos, asegurando el éxito en la implementación y aplicación de los resultados.'
  },
  {
    icon: 'bi bi-graph-up-arrow',
    title: 'Mejora Continua',
    description: 'Los programas están diseñados para identificar oportunidades de mejora y fortalecer las capacidades técnicas de los laboratorios participantes.'
  }
]

const technicalFeatures = [
  'Evaluación objetiva de competencias técnicas',
  'Validación de métodos de ensayo',
  'Verificación de trazabilidad metrológica',
  'Evaluación de incertidumbre de medición',
  'Desarrollo de habilidades técnicas',
  'Cumplimiento de requisitos normativos'
]

const mexicoDoc: Document = {
  id: 1,
  title: 'Programa Nacional México SENA 2026',
  code: 'PN-MX-2026',
  description: 'Documento oficial con el programa nacional de actividades y lineamientos SENA México 2026.',
  version: '1.0',
  date: '2026-01-01',
  pages: 12,
  size: '1.2 MB',
  url: '/src/pdf/PROGRAMA NACIONAL MEXICO SENA 2026.pdf',
  downloadUrl: '/src/pdf/PROGRAMA NACIONAL MEXICO SENA 2026.pdf',
  icon: 'bi bi-file-earmark-pdf'
}

const colombiaDoc: Document = {
  id: 2,
  title: 'Programa Colombia SENA 2026',
  code: 'PN-CO-2026',
  description: 'Documento oficial con el programa nacional SENA Colombia 2026.',
  version: '1.0',
  date: '2026-01-01',
  pages: 10,
  size: '1.0 MB',
  url: '/src/pdf/PROGRAMA COLOMBIA SENA 2025.pdf',
  downloadUrl: '/src/pdf/PROGRAMA COLOMBIA SENA 2025.pdf',
  icon: 'bi bi-file-earmark-pdf'
}

const programaDocuments: Document[] = [
  {
    id: 200,
    title: 'Programa Agua SENA 2026',
    code: 'PROG-AGUA-2026',
    description: 'Programa de ensayos y actividades para agua - SENA 2026',
    version: '1.0',
    date: '2026-01-01',
    pages: 0,
    size: 'N/A',
    url: '/src/pdf/PROGRAMA AGUA SENA 2026.pdf',
    downloadUrl: '/src/pdf/PROGRAMA AGUA SENA 2026.pdf',
    icon: 'bi bi-droplet-fill'
  },
  {
    id: 201,
    title: 'Programa Alimentos SENA 2026',
    code: 'PROG-ALIM-2026',
    description: 'Programa de ensayos y actividades para alimentos - SENA 2026',
    version: '1.0',
    date: '2026-01-01',
    pages: 0,
    size: 'N/A',
    url: '/src/pdf/PROGRAMA ALIM SENA 2026.pdf',
    downloadUrl: '/src/pdf/PROGRAMA ALIM SENA 2026.pdf',
    icon: 'bi bi-egg-fill'
  }
]

const openPdfModal = (document: Document) => {
  selectedDocument.value = document
  showPdfModal.value = true
  document.body.style.overflow = 'hidden'
}

const closePdfModal = () => {
  showPdfModal.value = false
  selectedDocument.value = null
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

.ensayos-aptitud-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .ensayos-aptitud-page {
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
.service-hero {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  padding: 5rem 0 4rem;
  position: relative;
  overflow: hidden;
}

.service-hero::before {
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

.hero-subtitle strong { color: #ffffff; font-weight: 600; }

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

.hero-image {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.image-wrapper {
  width: 180px;
  height: 180px;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: rgba(255,255,255,0.5);
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* ============================================================
   SERVICES
   ============================================================ */
.services-section {
  padding: 4rem 0;
  background: #ffffff;
  position: relative;
  z-index: 60;
  overflow: visible;
}
.services-section::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(93,138,47,0.08) 0%, transparent 70%);
  pointer-events: none;
}
[data-bs-theme="dark"] .services-section { background: #0e1509; }

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.services-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: start;
}

.service-btn {
  background: #fcfdfb;
  border: 1px solid rgba(0,0,0,0.08);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: var(--transition);
  padding: 1rem 0.8rem;
  min-width: auto;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}
.service-btn:hover {
  transform: translateY(-4px);
  border-color: var(--sena-green-light);
  box-shadow: 0 8px 24px rgba(93,138,47,0.16);
  background: #fff;
}
[data-bs-theme="dark"] .service-btn {
  background: #131a0e;
  border-color: rgba(122,171,61,0.14);
}
[data-bs-theme="dark"] .service-btn:hover {
  background: #18210f;
  border-color: var(--sena-green-light);
}

.service-icon-wrap {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: rgba(122,171,61,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: var(--transition);
  position: relative;
  z-index: 62;
}
.service-btn:hover .service-icon-wrap {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
}
[data-bs-theme="dark"] .service-icon-wrap { background: rgba(93,138,47,0.15); }

.service-icon {
  font-size: 1.55rem;
  color: var(--sena-green);
  transition: var(--transition);
  position: relative;
  z-index: 62;
}
.service-btn:hover .service-icon { color: #fff; }
[data-bs-theme="dark"] .service-icon { color: var(--sena-green-light); }
[data-bs-theme="dark"] .service-btn:hover .service-icon { color: #fff; }

.service-icon, .service-icon i, .service-icon svg {
  color: var(--sena-green) !important;
  fill: var(--sena-green) !important;
}

.service-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #223323;
  letter-spacing: 0.2px;
  transition: var(--transition);
}
.service-btn:hover .service-name { color: var(--sena-green); }
[data-bs-theme="dark"] .service-name { color: #8fa87e; }
[data-bs-theme="dark"] .service-btn:hover .service-name { color: var(--sena-green-light); }

/* ============================================================
   BENEFITS SECTION
   ============================================================ */
.benefits-section {
  padding: 4rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .benefits-section { background: #0e1509; }

.section-header { margin-bottom: 3rem; }

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.benefit-card {
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 1.75rem;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

[data-bs-theme="dark"] .benefit-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.benefit-card:hover {
  transform: translateY(-4px);
  border-color: rgba(93,138,47,0.3);
  box-shadow: 0 12px 36px rgba(93,138,47,0.1);
}

.benefit-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--sena-green-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  font-size: 1.6rem;
  color: var(--sena-green);
  transition: var(--transition);
}

[data-bs-theme="dark"] .benefit-icon-wrap {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.benefit-card:hover .benefit-icon-wrap {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
}

.benefit-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.6rem;
}

[data-bs-theme="dark"] .benefit-content h4 { color: #e0ecd6; }

.benefit-content p {
  font-size: 0.85rem;
  color: var(--sena-muted);
  line-height: 1.6;
  margin: 0;
}

/* ============================================================
   TECHNICAL SECTION
   ============================================================ */
.technical-section {
  padding: 5rem 0;
  background: #fafaf8;
}

[data-bs-theme="dark"] .technical-section { background: #0c0f0a; }

.technical-image {
  display: flex;
  justify-content: center;
}

.tech-image-wrapper {
  width: 280px;
  height: 280px;
  background: linear-gradient(135deg, var(--sena-green-pale), rgba(122,171,61,0.08));
  border: 2px solid var(--sena-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  color: var(--sena-green);
  transition: var(--transition);
}

[data-bs-theme="dark"] .tech-image-wrapper {
  background: rgba(93,138,47,0.1);
  border-color: rgba(122,171,61,0.16);
  color: var(--sena-green-light);
}

.technical-content {
  padding: 1rem 0;
}

.technical-description {
  font-size: 1rem;
  color: var(--sena-muted);
  line-height: 1.7;
  margin: 1rem 0 1.5rem;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.feature-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--sena-green-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-check i {
  font-size: 0.7rem;
  color: var(--sena-green);
  font-weight: 700;
}

[data-bs-theme="dark"] .feature-check {
  background: rgba(93,138,47,0.18);
}

[data-bs-theme="dark"] .feature-check i { color: var(--sena-green-light); }

.feature-item span {
  font-size: 0.88rem;
  color: var(--sena-text);
  font-weight: 500;
}

[data-bs-theme="dark"] .feature-item span { color: #c8d8be; }

/* ============================================================
   DOCUMENTS SECTION
   ============================================================ */
.documents-section {
  padding: 4rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .documents-section { background: #0e1509; }

.tab-nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  border-bottom: 2px solid var(--sena-border);
  padding-bottom: 0;
}

.tab-btn {
  padding: 0.75rem 2rem;
  border: none;
  background: transparent;
  color: var(--sena-muted);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  color: var(--sena-text);
}

.tab-btn.active {
  color: var(--sena-green);
  border-bottom-color: var(--sena-green-light);
}

[data-bs-theme="dark"] .tab-btn { color: #8a9e7c; }
[data-bs-theme="dark"] .tab-btn:hover { color: #c8d8be; }
[data-bs-theme="dark"] .tab-btn.active { color: var(--sena-green-light); }

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
  justify-content: center;
}

.document-card {
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 2rem;
  text-align: center;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  max-width: 400px;
  margin: 0 auto;
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

.doc-flag {
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 1rem;
}

.doc-flag .flag-img {
  width: 56px;
  height: 40px;
  display: inline-block;
  object-fit: cover;
  border-radius: 6px;
}

.doc-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.6rem;
}

[data-bs-theme="dark"] .doc-title { color: #e0ecd6; }

.doc-description {
  font-size: 0.85rem;
  color: var(--sena-muted);
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.25rem;
  background: transparent;
  border: 1px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.doc-btn:hover {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
}

[data-bs-theme="dark"] .doc-btn {
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

/* ============================================================
   WATER & FOOD SECTION
   ============================================================ */
.water-food-section {
  padding: 4rem 0;
  background: #fafaf8;
}

[data-bs-theme="dark"] .water-food-section { background: #0c0f0a; }

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
  max-width: 700px;
  margin: 0 auto;
}

.program-card {
  background: #ffffff;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 2rem;
  text-align: center;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

[data-bs-theme="dark"] .program-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.program-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.1);
  border-color: rgba(93,138,47,0.3);
}

.program-icon {
  font-size: 2.5rem;
  color: var(--sena-green);
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .program-icon { color: var(--sena-green-light); }

.program-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.6rem;
}

[data-bs-theme="dark"] .program-title { color: #e0ecd6; }

.program-description {
  font-size: 0.85rem;
  color: var(--sena-muted);
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

/* ============================================================
   CTA SECTION
   ============================================================ */
.cta-section {
  padding: 4rem 0;
}

.cta-wrapper {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid var(--sena-border);
  padding: 2.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  box-shadow: var(--shadow-md);
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
  color: var(--sena-text);
  margin-bottom: 0.75rem;
}

[data-bs-theme="dark"] .cta-title { color: #f0f5ea; }

.cta-description {
  font-size: 0.95rem;
  color: var(--sena-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  max-width: 500px;
}

.cta-features {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--sena-text);
}

.cta-feature i {
  color: var(--sena-green);
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .cta-feature { color: #c8d8be; }
[data-bs-theme="dark"] .cta-feature i { color: var(--sena-green-light); }

.cta-action { flex-shrink: 0; }

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  color: #ffffff;
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: var(--shadow-green);
  transition: var(--transition);
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
  color: #ffffff;
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
  border-bottom: 1px solid var(--sena-border);
}

.modal-title {
  font-weight: 600;
  color: var(--sena-text);
  margin: 0;
  font-size: 1rem;
}

[data-bs-theme="dark"] .modal-title { color: #e0ecd6; }

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--sena-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--sena-muted);
  transition: var(--transition);
}

.modal-close:hover {
  background: var(--sena-green-pale);
  color: var(--sena-text);
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
  color: var(--sena-muted);
  gap: 1rem;
}

.pdf-placeholder i { font-size: 4rem; }

/* ============================================================
   MODO CLARO MEJORADO - OVERRIDES ESPECÍFICOS
   ============================================================ */
[data-bs-theme="light"] .ensayos-aptitud-page {
  --card-bg: #ffffff;
  --card-border: rgba(0, 0, 0, 0.08);
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* Hero en modo claro */
[data-bs-theme="light"] .service-hero {
  background: linear-gradient(135deg, #f8faf7 0%, #ffffff 50%, #edf4e3 100%);
  border-bottom: 1px solid rgba(93, 138, 47, 0.1);
}

[data-bs-theme="light"] .service-hero::before {
  background-image:
    radial-gradient(circle at 20% 50%, rgba(93, 138, 47, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(122, 171, 61, 0.03) 0%, transparent 40%);
}

[data-bs-theme="light"] .hero-content .section-eyebrow {
  color: #5d8a2f;
  background: rgba(93, 138, 47, 0.1);
  font-weight: 700;
}

[data-bs-theme="light"] .hero-title {
  color: #1a2612;
}

[data-bs-theme="light"] .hero-subtitle {
  color: #4a5a40;
  font-weight: 500;
}

[data-bs-theme="light"] .hero-subtitle strong {
  color: #5d8a2f;
  font-weight: 700;
}

[data-bs-theme="light"] .badge-item {
  background: #ffffff;
  border: 1px solid rgba(93, 138, 47, 0.2);
  color: #5d8a2f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

[data-bs-theme="light"] .badge-item:hover {
  background: #f8faf7;
  border-color: rgba(93, 138, 47, 0.4);
  box-shadow: 0 4px 12px rgba(93, 138, 47, 0.1);
}

[data-bs-theme="light"] .badge-item i {
  color: #5d8a2f;
  font-size: 1rem;
}

[data-bs-theme="light"] .image-wrapper {
  background: linear-gradient(135deg, rgba(93, 138, 47, 0.08), rgba(122, 171, 61, 0.05));
  border: 2px solid rgba(93, 138, 47, 0.15);
  color: rgba(93, 138, 47, 0.3);
}

/* Services en modo claro */
[data-bs-theme="light"] .services-section {
  background: #ffffff;
}

[data-bs-theme="light"] .service-btn {
  background: #ffffff;
  border: 1.5px solid #e0e5da;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

[data-bs-theme="light"] .service-btn:hover {
  border-color: #5d8a2f;
  box-shadow: 0 8px 24px rgba(93, 138, 47, 0.12);
  background: #f8faf7;
}

[data-bs-theme="light"] .service-icon-wrap {
  background: #f0f4ea;
  border: 1px solid rgba(93, 138, 47, 0.1);
}

[data-bs-theme="light"] .service-name {
  color: #2a3a20;
  font-weight: 600;
  font-size: 0.8rem;
}

/* Benefits en modo claro */
[data-bs-theme="light"] .benefits-section {
  background: #f5f7f2;
}

[data-bs-theme="light"] .benefit-card {
  background: #ffffff;
  border: 1.5px solid #e0e5da;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="light"] .benefit-card:hover {
  border-color: #5d8a2f;
}

[data-bs-theme="light"] .benefit-icon-wrap {
  background: #f0f4ea;
  border: 2px solid rgba(93, 138, 47, 0.15);
}

[data-bs-theme="light"] .benefit-content h4 {
  color: #1a2612;
  font-size: 1.1rem;
  font-weight: 700;
}

[data-bs-theme="light"] .benefit-content p {
  color: #5a6a52;
  font-size: 0.9rem;
}

/* Technical en modo claro */
[data-bs-theme="light"] .technical-section {
  background: #ffffff;
}

[data-bs-theme="light"] .tech-image-wrapper {
  background: linear-gradient(135deg, #f0f4ea, #ffffff);
  border: 3px solid #e0e5da;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

[data-bs-theme="light"] .technical-description {
  color: #5a6a52;
  font-size: 1.05rem;
}

[data-bs-theme="light"] .feature-check {
  background: #f0f4ea;
  border: 2px solid rgba(93, 138, 47, 0.2);
  width: 24px;
  height: 24px;
}

[data-bs-theme="light"] .feature-item span {
  color: #2a3a20;
}

/* Documents en modo claro */
[data-bs-theme="light"] .documents-section {
  background: #f5f7f2;
}

[data-bs-theme="light"] .tab-nav {
  border-bottom: 2px solid #e0e5da;
}

[data-bs-theme="light"] .tab-btn {
  color: #8a9a7e;
}

[data-bs-theme="light"] .tab-btn:hover {
  color: #5d8a2f;
  background: rgba(93, 138, 47, 0.05);
}

[data-bs-theme="light"] .tab-btn.active {
  color: #5d8a2f;
  font-weight: 700;
}

[data-bs-theme="light"] .document-card {
  background: #ffffff;
  border: 1.5px solid #e0e5da;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="light"] .doc-title {
  color: #1a2612;
  font-size: 1.1rem;
  font-weight: 700;
}

[data-bs-theme="light"] .doc-description {
  color: #6b7a60;
}

[data-bs-theme="light"] .doc-btn {
  border: 2px solid #5d8a2f;
  font-weight: 700;
  padding: 0.65rem 1.5rem;
}

[data-bs-theme="light"] .doc-btn:hover {
  box-shadow: 0 6px 20px rgba(93, 138, 47, 0.2);
}

/* Water & Food en modo claro */
[data-bs-theme="light"] .water-food-section {
  background: #ffffff;
}

[data-bs-theme="light"] .program-card {
  background: #f8faf7;
  border: 1.5px solid #e0e5da;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="light"] .program-card:hover {
  background: #ffffff;
}

[data-bs-theme="light"] .program-title {
  color: #1a2612;
  font-size: 1.1rem;
  font-weight: 700;
}

[data-bs-theme="light"] .program-description {
  color: #6b7a60;
}

/* CTA en modo claro */
[data-bs-theme="light"] .cta-section {
  background: #f5f7f2;
}

[data-bs-theme="light"] .cta-wrapper {
  border: 2px solid #e0e5da;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 3rem;
}

[data-bs-theme="light"] .cta-title {
  font-size: 2rem;
}

[data-bs-theme="light"] .cta-description {
  font-size: 1.05rem;
  line-height: 1.7;
}

[data-bs-theme="light"] .contact-btn {
  font-size: 1rem;
  padding: 0.85rem 2rem;
  box-shadow: 0 8px 24px rgba(93, 138, 47, 0.25);
}

[data-bs-theme="light"] .contact-btn:hover {
  box-shadow: 0 12px 36px rgba(93, 138, 47, 0.35);
}

/* Shared elements en modo claro */
[data-bs-theme="light"] .section-eyebrow {
  color: #5d8a2f;
  font-weight: 700;
}

[data-bs-theme="light"] .section-title {
  color: #1a2612;
}

[data-bs-theme="light"] .section-subtitle {
  color: #6b7a60;
  font-weight: 500;
}

/* Modal en modo claro */
[data-bs-theme="light"] .modal-container {
  border: 2px solid #e0e5da;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

[data-bs-theme="light"] .modal-header {
  background: #f8faf7;
  border-bottom: 1px solid #e0e5da;
}

[data-bs-theme="light"] .modal-close {
  background: #ffffff;
  border: 2px solid #e0e5da;
}

[data-bs-theme="light"] .modal-close:hover {
  background: #f0f4ea;
  border-color: #5d8a2f;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .hero-title { font-size: 2.4rem; }
  .section-title { font-size: 2rem; }
  .features-list { grid-template-columns: 1fr; }
  .tech-image-wrapper { width: 200px; height: 200px; font-size: 3.5rem; }
}

@media (max-width: 768px) {
  .service-hero { padding: 3rem 0 2.5rem; }
  .hero-title { font-size: 2rem; }
  .hero-image { margin-top: 2rem; }
  .image-wrapper { width: 140px; height: 140px; font-size: 3rem; }
  .cta-wrapper { padding: 2rem 1.5rem; flex-direction: column; text-align: center; }
  .cta-description { max-width: 100%; }
  .cta-features { justify-content: center; }
  .tab-btn { padding: 0.65rem 1.25rem; font-size: 0.82rem; }
}

@media (max-width: 480px) {
  .benefits-grid { grid-template-columns: 1fr; }
  .hero-badges { flex-direction: column; align-items: flex-start; }
}
</style>
