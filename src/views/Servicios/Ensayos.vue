<template>
  <div :data-bs-theme="currentTheme" class="ensayos-aptitud-page">

    <!-- Hero Section (copiado de Acreditamiento.vue, adaptado a Ensayos) -->
    <section class="acreditaciones-hero events-hero" :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${heroEnsayos})` }">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row align-items-center min-vh-60">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Ensayos de Aptitud</h1>
              <p class="hero-subtitle">
                Evaluación objetiva de la competencia técnica de laboratorios mediante programas
                organizados bajo la norma <strong>ISO/IEC 17043:2023</strong>
              </p>
              <div class="hero-badges">
                <span class="badge-item">
                  <i class="bi bi-award-fill"></i>
                  <span>Acreditado ISO/IEC 17043</span>
                </span>
                <span class="badge-item">
                  <i class="bi bi-globe2"></i>
                  <span>Reconocimiento Internacional</span>
                </span>
                <span class="badge-item">
                  <i class="bi bi-people-fill"></i>
                  <span>Soporte Técnico</span>
                </span>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-card">
              <div class="hero-card-icon">
                <i class="bi bi-clipboard-data"></i>
              </div>
              <h4>Programas y Resultados</h4>
              <p>Accede a programas, resultados y documentación técnica relacionada con nuestros ensayos de aptitud.</p>
              <div class="hero-card-stats">
                <div class="hero-stat">
                  <span class="hero-stat-number">Programa </span>
                  <span class="hero-stat-label">Anual</span>
                </div>
                <div class="hero-stat">
                  <span class="hero-stat-number">Internacional </span>
                  <span class="hero-stat-label">Alcance</span>
                </div>
                <div class="hero-stat">
                  <span class="hero-stat-number">Soporte</span>
                  <span class="hero-stat-label">Técnico</span>
                </div>
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
          <span class="section-eyebrow light">Especialización</span>
          <h2 class="section-title">Ensayos de Aptitud</h2>
          <div class="title-underline"></div>
        </div>

        <div class="services-row" data-aos="fade-up">
          <button v-for="service in servicesRow1" :key="service.id" class="service-btn" @click="goToService(service.id)">
            <div class="service-icon-wrap">
              <div class="service-icon"><img :src="currentTheme === 'dark' ? (service.iconWhite || service.icon) : service.icon" alt="" class="service-icon-img" /></div>
            </div>
            <span class="service-name">{{ service.name }}</span>
          </button>
        </div>

        <div class="services-row" data-aos="fade-up" data-aos-delay="100">
          <button v-for="service in servicesRow2" :key="service.id" class="service-btn" @click="goToService(service.id)">
            <div class="service-icon-wrap">
              <div class="service-icon"><img :src="currentTheme === 'dark' ? (service.iconWhite || service.icon) : service.icon" alt="" class="service-icon-img" /></div>
            </div>
            <span class="service-name">{{ service.name }}</span>
          </button>
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

        <div class="country-cards-grid">
          <!-- México -->
          <div class="country-doc-card country-doc-card--mexico" data-aos="fade-right">
            <div class="country-doc-bg"></div>
            <div class="country-doc-overlay-pattern"></div>
            <div class="country-doc-content">
              <div class="country-doc-header">
                <img src="https://flagcdn.com/w80/mx.png" alt="México" class="country-flag-large" />
                <span class="country-doc-badge">SENA 2026</span>
              </div>
              <h3 class="country-doc-title">Programa Nacional México</h3>
              <p class="country-doc-description">Documento oficial con el programa nacional de actividades y lineamientos SENA México 2026.</p>
              <div class="country-doc-meta">
                <span><i class="bi bi-file-earmark-text"></i> 12 páginas</span>
                <span><i class="bi bi-hdd"></i> 1.2 MB</span>
                <span><i class="bi bi-calendar3"></i> 2026</span>
              </div>
              <button class="country-doc-btn" @click="openPdfModal(mexicoDoc)">
                <i class="bi bi-eye-fill"></i>
                Vista previa
              </button>
            </div>
          </div>

          <!-- Colombia -->
          <div class="country-doc-card country-doc-card--colombia" data-aos="fade-left">
            <div class="country-doc-bg"></div>
            <div class="country-doc-overlay-pattern"></div>
            <div class="country-doc-content">
              <div class="country-doc-header">
                <img src="https://flagcdn.com/w80/co.png" alt="Colombia" class="country-flag-large" />
                <span class="country-doc-badge">SENA 2026</span>
              </div>
              <h3 class="country-doc-title">Programa Nacional Colombia</h3>
              <p class="country-doc-description">Documento oficial con el programa nacional SENA Colombia 2026.</p>
              <div class="country-doc-meta">
                <span><i class="bi bi-file-earmark-text"></i> 10 páginas</span>
                <span><i class="bi bi-hdd"></i> 1.0 MB</span>
                <span><i class="bi bi-calendar3"></i> 2026</span>
              </div>
              <button class="country-doc-btn" @click="openPdfModal(colombiaDoc)">
                <i class="bi bi-eye-fill"></i>
                Vista previa
              </button>
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

        <div class="programa-feature-list">
          <div
            v-for="(doc, idx) in programaDocuments"
            :key="doc.id"
            class="programa-feature-card"
            data-aos="fade-up"
            :data-aos-delay="idx * 120"
          >
            <div class="programa-feature-accent"></div>
            <div class="programa-feature-icon-wrap">
              <img :src="currentTheme === 'dark' ? (doc.iconWhite || doc.icon) : doc.icon" alt="" class="programa-feature-icon-img" />
              <div class="programa-feature-number">{{ String(idx + 1).padStart(2, '0') }}</div>
            </div>
            <div class="programa-feature-body">
              <h4 class="programa-feature-title">{{ doc.title }}</h4>
              <p class="programa-feature-desc">{{ doc.description }}</p>
              <button class="programa-feature-btn" @click="openPdfModal(doc)">
                <i class="bi bi-eye-fill"></i>
                Ver Programa
                <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
            <div class="programa-feature-visual">
              <div class="programa-feature-glow"></div>
            </div>
          </div>
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
            <router-link
              to="/contacto"
              :class="['contact-btn', currentTheme === 'light' ? 'contact-btn--light' : 'contact-btn--dark']"
            >
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
import heroEnsayos from '@/image/Ensayos.png'

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
  iconWhite?: string
}

interface Service {
  id: number
  name: string
  icon: string
  iconWhite?: string
  route: string
}

const router = useRouter()
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')
const activeTab = ref('mexico')
const showPdfModal = ref(false)
const selectedDocument = ref<Document | null>(null)

const servicesRow1: Service[] = [
  { id: 1, name: 'Agua', icon: new URL('../../image/icons/Servicios/Black/Agua.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Agua-White.svg', import.meta.url).href, route: '/servicios/agua' },
  { id: 2, name: 'Alimentos', icon: new URL('../../image/icons/Servicios/Black/Alimentos.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Alimentos-White.svg', import.meta.url).href, route: '/servicios/alimentos' },
  { id: 3, name: 'Masa', icon: new URL('../../image/icons/Servicios/Black/Masa.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Masa-White.svg', import.meta.url).href, route: '/servicios/masa' },
  { id: 4, name: 'Temperatura', icon: new URL('../../image/icons/Servicios/Black/Temperatura.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Temperatura-White.svg', import.meta.url).href, route: '/servicios/temperatura' },
  { id: 5, name: 'Presión', icon: new URL('../../image/icons/Servicios/Black/Presion.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Presion-White.svg', import.meta.url).href, route: '/servicios/presion' },
  { id: 6, name: 'Volumen', icon: new URL('../../image/icons/Servicios/Black/Volumen.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Volumen-White.svg', import.meta.url).href, route: '/servicios/volumen' }
]

const servicesRow2: Service[] = [
  { id: 7, name: 'Densidad', icon: new URL('../../image/icons/Servicios/Black/Densidad.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Densidad-White.svg', import.meta.url).href, route: '/servicios/densidad' },
  { id: 8, name: 'Eléctrica', icon: new URL('../../image/icons/Servicios/Black/Electrica.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Electrica-White.svg', import.meta.url).href, route: '/servicios/electrica' },
  { id: 9, name: 'Dimensional', icon: new URL('../../image/icons/Servicios/Black/Dimensional.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Dimensional-White.svg', import.meta.url).href, route: '/servicios/dimensional' },
  { id: 10, name: 'Humedad', icon: new URL('../../image/icons/Servicios/Black/Humedad.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Humedad-White.svg', import.meta.url).href, route: '/servicios/humedad' },
  { id: 11, name: 'Flujo', icon: new URL('../../image/icons/Servicios/Black/Flujos.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Flujos-White.svg', import.meta.url).href, route: '/servicios/flujo' },
  { id: 12, name: 'Mediciones Especiales', icon: new URL('../../image/icons/Servicios/Black/Especiales.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Especiales-White.svg', import.meta.url).href, route: '/servicios/mediciones-especiales' }
]

const goToService = (serviceId: number) => {
  const service = [...servicesRow1, ...servicesRow2].find(s => s.id === serviceId)
  if (service) {
    // Redirige a la vista pública `EnsayoDetalle` y pasa el servicio como query
    router.push({ name: 'ensayo-detalle', query: { service: service.name } })
  }
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
  url: '/pdf/PROGRAMA NACIONAL MEXICO SENA 2026.pdf',
  downloadUrl: '/pdf/PROGRAMA NACIONAL MEXICO SENA 2026.pdf',
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
  url: '/pdf/PROGRAMA COLOMBIA SENA 2025.pdf',
  downloadUrl: '/pdf/PROGRAMA COLOMBIA SENA 2025.pdf',
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
    url: '/pdf/PROGRAMA AGUA SENA 2026.pdf',
    downloadUrl: '/pdf/PROGRAMA AGUA SENA 2026.pdf',
    icon: new URL('../../image/icons/Servicios/Black/Agua.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Agua-White.svg', import.meta.url).href
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
    url: '/pdf/PROGRAMA ALIM SENA 2026.pdf',
    downloadUrl: '/pdf/PROGRAMA ALIM SENA 2026.pdf',
    icon: new URL('../../image/icons/Servicios/Black/Alimentos.svg', import.meta.url).href, iconWhite: new URL('../../image/icons/Servicios/White/Alimentos-White.svg', import.meta.url).href
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
  /* ============================================================
     HERO SECTION - estilo igual a Acreditamiento.vue
     ============================================================ */
  .service-hero {
    min-height: 60vh;
    background-image: linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url('/src/image/Ensayos.png');
    background-size: cover;
    background-position: center center;
    color: white;
    padding: 5rem 0 4rem;
    position: relative;
    overflow: hidden;
  }

  .service-hero .hero-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.12) 0%, rgba(167,183,41,0.12) 100%);
    pointer-events: none;
  }

  .service-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(93,138,47,0.12) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(122,171,61,0.08) 0%, transparent 40%);
  }

  /* events-hero: copia del diseño de Nosotros.vue (usa inline background desde template) */
  .events-hero {
    min-height: 30vh;
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
    color: #ffffff;
  }
  .events-hero .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.95;
    max-width: 600px;
    color: #ffffff !important;
  }
  .events-hero .hero-stats {
    display: flex;
    gap: 3rem;
    margin-top: 2rem;
  }
  .events-hero .stat-item { display: flex; flex-direction: column; }
  .events-hero .stat-number {
    font-family: var(--font-display);
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

  /* Fondo combinable verde para outline-btn dentro del hero */
  .events-hero .outline-btn {
    background: rgba(101, 176, 9, 0.336);
    border-color: rgba(255,255,255,0.48);
    color: #ffffff !important;
  }
  .events-hero .outline-btn:hover {
    background: rgba(98, 152, 33, 0.18);
    border-color: rgba(255,255,255,0.9);
  }

  /* Asegurar que los iconos/SVG dentro del botón hereden el color blanco */
  .events-hero .outline-btn svg,
  .events-hero .outline-btn .btn-arrow {
    stroke: currentColor !important;
    fill: none !important;
    color: inherit !important;
  }

  @media (max-width: 991.98px) {
    .events-hero { padding: 4rem 0; min-height: 70vh; }
    .events-hero .hero-title { font-size: 2.5rem; }
  }

  @media (max-width: 768px) {
    .events-hero .hero-title { font-size: 2rem; }
    .events-hero .hero-subtitle { font-size: 1.1rem; }
    .events-hero .hero-stats { flex-direction: column; gap: 1.5rem; }
  }

  /* Hero actions and visual (copiado de Nosotros.vue) */
  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

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

  .outline-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.75rem;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 50px;
    color: rgba(255,255,255,0.85);
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    transition: var(--transition);
  }

  .outline-btn:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.4);
    color: #ffffff;
  }

  .hero-visual {
    position: relative;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-circle {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    animation: float 4s ease-in-out infinite;
  }

  .floating-badge {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    transition: var(--transition);
  }

  .floating-badge:hover { transform: translateY(-4px); background: rgba(255,255,255,0.1); }
  .badge-top { top: 20px; right: 10px; }
  .badge-bottom { bottom: 20px; left: 10px; }

  .badge-icon-wrap {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: rgba(122,171,61,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: var(--sena-green-light);
    flex-shrink: 0;
  }

  .badge-text { display: flex; flex-direction: column; }
  .badge-label { font-size: 0.78rem; font-weight: 600; color: #ffffff; }

  /* Hero card - estilos copiados de Acreditamiento.vue para coincidir en diseño */
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
    color: #ffffff !important;
    font-size: 1.15rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .hero-card p {
    color: rgba(255,255,255,0.9) !important;
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
    font-size: 1rem;
    font-weight: 700;
    color: #a8d46a;
  }

  .hero-stat-label {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.85) !important;
    letter-spacing: 0.5px;
  }

  /* Asegurar textos blancos en hero cuando se use overlay */
  .events-hero .hero-title,
  .events-hero .hero-subtitle,
  .events-hero .badge-item,
  .events-hero .hero-card h4,
  .events-hero .hero-card p,
  .events-hero .hero-stat-label {
    color: #ffffff !important;
  }
  .badge-detail { font-size: 0.65rem; color: rgba(255,255,255,0.55); }

/* ============================================================
   BASE
   ============================================================ */
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
  gap: 0.9rem;
}

.badge-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50px;
  color: rgba(255,255,255,0.85);
  font-size: 0.78rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
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
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-card);
  padding: 1.6rem;
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0,0,0,0.32);
  color: rgba(255,255,255,0.5);

/* Center the hero card column and constrain hero content width for better layout */
.acreditaciones-hero .col-lg-4 {
  display: flex;
  align-items: center;
  justify-content: center;
}
.acreditaciones-hero .hero-content {
  max-width: 680px;
}

/* Slightly increase title weight and tighten spacing for visual match */
.events-hero .hero-title {
  font-size: 3.2rem;
  line-height: 1.08;
}

.events-hero .hero-subtitle {
  max-width: 560px;
}
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
  background: #ffffff; /* usar blanco claro en modo claro para mejor contraste */
  position: relative;
  z-index: 60; /* elevar para garantizar visibilidad por encima del hero */
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
  background: #fcfdfb; /* ligero tono para evitar 'blanco puro' que se pierde con animaciones */
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
  background: rgba(38, 69, 0, 0.06);
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

/* Forzar color y relleno en iconos SVG/I para evitar desaparición durante animación */
.service-icon, .service-icon i, .service-icon svg {
  color: var(--sena-green) !important;
  fill: var(--sena-green) !important;
}

.service-icon img, .service-icon-img {
  width: 28px;
  height: 28px;
  display: block;
  object-fit: contain;
}

.service-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #000400; /* color más oscuro para mejor legibilidad en claro */
  letter-spacing: 0.2px;
  transition: var(--transition);
}
.service-btn:hover .service-name { color: var(--sena-green); }
[data-bs-theme="dark"] .service-name { color: #8fa87e; }
[data-bs-theme="dark"] .service-btn:hover .service-name { color: var(--sena-green-light); }

/* Footer del bloque de servicios: botón centrado siguiendo diseño existente */
.services-footer {
  text-align: center;
  margin-top: 1.4rem;
}
.services-footer .view-ensayos-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.4rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
}
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
  color: #006b00;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50px;
  color: rgba(1, 72, 14, 0.85);
  font-size: 0.78rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  transition: var(--transition);
}

/* Fondo verde para los badges dentro del hero */
.events-hero .hero-badges .badge-item {
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  border: none;
  color: #ffffff !important;
  box-shadow: 0 8px 28px rgba(0,0,0,0.18);
}
.events-hero .hero-badges .badge-item i { color: #ffffff !important; }
[data-bs-theme="dark"] .feature-check i { color: var(--sena-green-light); }

.feature-item span {
  font-size: 0.88rem;
  color: var(--sena-text);
  font-weight: 500;
}

[data-bs-theme="dark"] .feature-item span { color: #c8d8be; }

/* ============================================================
   COUNTRY DOC CARDS SECTION
   ============================================================ */
.documents-section {
  padding: 4.5rem 0;
  background: #f2f5ef;
}

[data-bs-theme="dark"] .documents-section { background: #0a0d08; }

.country-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.country-doc-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  transition: transform 0.32s ease, box-shadow 0.32s ease;
  box-shadow: 0 10px 40px rgba(0,0,0,0.18);
}

.country-doc-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 28px 72px rgba(0,0,0,0.26);
}

.country-doc-card--mexico {
  background: linear-gradient(150deg, #005c39 0%, #007a4d 40%, #a50018 100%);
}

.country-doc-card--colombia {
  background: linear-gradient(150deg, #001f6b 0%, #003da8 40%, #b50012 72%, #e8b800 100%);
}

.country-doc-bg {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.44);
}

.country-doc-overlay-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.04) 0%, transparent 40%);
  pointer-events: none;
}

.country-doc-content {
  position: relative;
  z-index: 2;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0.9rem;
}

.country-doc-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.country-flag-large {
  width: 76px;
  height: 54px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  border: 2px solid rgba(255,255,255,0.35);
}

.country-doc-badge {
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  padding: 0.35rem 0.9rem;
  border-radius: 50px;
}

.country-doc-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.18;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.country-doc-description {
  font-size: 0.88rem;
  color: rgba(255,255,255,0.82);
  line-height: 1.65;
  margin: 0;
  flex: 1;
}

.country-doc-meta {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 0.85rem 0;
  border-top: 1px solid rgba(255,255,255,0.14);
  border-bottom: 1px solid rgba(255,255,255,0.14);
}

.country-doc-meta span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  color: rgba(255,255,255,0.72);
}

.country-doc-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.72rem 1.55rem;
  background: rgba(255,255,255,0.14);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.38);
  color: #ffffff;
  border-radius: 50px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  width: fit-content;
  margin-top: 0.2rem;
}

.country-doc-btn:hover {
  background: rgba(255,255,255,0.26);
  border-color: rgba(255,255,255,0.65);
  transform: translateX(4px);
}

/* ============================================================
   PROGRAMA FEATURE LIST SECTION
   ============================================================ */
.water-food-section {
  padding: 4.5rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .water-food-section { background: #0c0f0a; }

.programa-feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.programa-feature-card {
  position: relative;
  background: #ffffff;
  border: 1px solid var(--sena-border);
  border-radius: 20px;
  padding: 2rem 2rem 2rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.programa-feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 56px rgba(93,138,47,0.14);
}

[data-bs-theme="dark"] .programa-feature-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

[data-bs-theme="dark"] .programa-feature-card:hover {
  border-color: rgba(122,171,61,0.3);
}

.programa-feature-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  border-radius: 4px 0 0 4px;
}

.programa-feature-icon-wrap {
  flex-shrink: 0;
  width: 92px;
  height: 92px;
  background: linear-gradient(135deg, rgba(93,138,47,0.07), rgba(122,171,61,0.05));
  border: 2px solid rgba(93,138,47,0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: var(--transition);
}

.programa-feature-card:hover .programa-feature-icon-wrap {
  background: linear-gradient(135deg, rgba(93,138,47,0.14), rgba(122,171,61,0.09));
  border-color: rgba(93,138,47,0.22);
}

[data-bs-theme="dark"] .programa-feature-icon-wrap {
  background: rgba(93,138,47,0.12);
  border-color: rgba(122,171,61,0.18);
}

.programa-feature-icon-img {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.programa-feature-number {
  position: absolute;
  top: -9px;
  right: -9px;
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  font-size: 0.63rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(93,138,47,0.4);
}

.programa-feature-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.programa-feature-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--sena-text);
  margin: 0;
}

[data-bs-theme="dark"] .programa-feature-title { color: #e0ecd6; }

.programa-feature-desc {
  font-size: 0.87rem;
  color: var(--sena-muted);
  line-height: 1.58;
  margin: 0;
}

.programa-feature-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.25rem;
  background: transparent;
  border: 1.5px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  width: fit-content;
  margin-top: 0.35rem;
}

.programa-feature-btn:hover {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border-color: transparent;
}

.programa-feature-btn:hover .btn-arrow { transform: translateX(3px); }
.programa-feature-btn .btn-arrow { width: 14px; height: 14px; transition: transform 0.22s ease; }

[data-bs-theme="dark"] .programa-feature-btn {
  border-color: var(--sena-green-light);
  color: var(--sena-green-light);
}

.programa-feature-visual {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.programa-feature-glow {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(93,138,47,0.12) 0%, transparent 70%);
  border: 1px solid rgba(93,138,47,0.12);
  transition: var(--transition);
}

.programa-feature-card:hover .programa-feature-glow {
  background: radial-gradient(circle, rgba(93,138,47,0.2) 0%, transparent 70%);
  border-color: rgba(93,138,47,0.22);
  transform: scale(1.15);
}

@media (max-width: 600px) {
  .programa-feature-card { flex-wrap: wrap; gap: 1rem; padding: 1.5rem 1.5rem 1.5rem 1.75rem; }
  .programa-feature-visual { display: none; }
  .programa-feature-icon-wrap { width: 72px; height: 72px; }
  .programa-feature-icon-img { width: 42px; height: 42px; }
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

/* Theme-specific utility classes to ensure button adapts even without ancestor selectors */
.contact-btn--light {
  color: #ffffff !important;
  background: linear-gradient(180deg, #3f6b1f 0%, #5d8a2f 100%) !important;
  box-shadow: 0 8px 28px rgba(93, 138, 47, 0.28) !important;
  border: 1px solid rgba(0,0,0,0.08) !important;
  z-index: 90;
}
.contact-btn--light:focus {
  outline: 3px solid rgba(122,171,61,0.16) !important;
  outline-offset: 2px !important;
}
.contact-btn--light:hover {
  box-shadow: 0 14px 40px rgba(93, 138, 47, 0.38) !important;
}

.contact-btn--dark {
  /* dark variant: rely on existing defaults, ensure good contrast */
  color: #ffffff !important;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%) !important;
}

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
  color: #6abe17d8;
  font-weight: 700;
}

[data-bs-theme="light"] .badge-item {
  background: #ffffff;
  border: 1px solid rgba(93, 138, 47, 0.2);
  color: #5d8a2f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

[data-bs-theme="light"] .badge-item:hover {
  background: #2f7a0a5c;
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
  background: #ffffff;
  border: 1px solid rgba(93, 138, 47, 0.1);
}

[data-bs-theme="light"] .service-name {
  color: #000000;
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

/* Documents (country cards) en modo claro */
[data-bs-theme="light"] .documents-section {
  background: #edf1e7;
}

[data-bs-theme="light"] .country-doc-card {
  box-shadow: 0 14px 52px rgba(0,0,0,0.22);
}

[data-bs-theme="light"] .country-doc-card:hover {
  box-shadow: 0 32px 80px rgba(0,0,0,0.3);
}

/* Water & Food (programa feature) en modo claro */
[data-bs-theme="light"] .water-food-section {
  background: #ffffff;
}

[data-bs-theme="light"] .programa-feature-card {
  background: #ffffff;
  border-color: #dfe5d8;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

[data-bs-theme="light"] .programa-feature-card:hover {
  border-color: rgba(93,138,47,0.28);
  box-shadow: 0 20px 56px rgba(93,138,47,0.13);
}

[data-bs-theme="light"] .programa-feature-icon-wrap {
  background: #eef3e7;
  border-color: rgba(93,138,47,0.14);
}

[data-bs-theme="light"] .programa-feature-title {
  color: #1a2612;
}

[data-bs-theme="light"] .programa-feature-desc {
  color: #6b7a60;
}

[data-bs-theme="light"] .programa-feature-btn {
  border-color: #5d8a2f;
  color: #5d8a2f;
}

[data-bs-theme="light"] .programa-feature-glow {
  background: radial-gradient(circle, rgba(93,138,47,0.08) 0%, transparent 70%);
  border-color: rgba(93,138,47,0.1);
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
  .hero-image { margin-top: 2rem; }
  .image-wrapper { width: 140px; height: 140px; font-size: 3rem; }
  .cta-wrapper { padding: 2rem 1.5rem; flex-direction: column; text-align: center; }
  .cta-description { max-width: 100%; }
  .cta-features { justify-content: center; }
  .tab-btn { padding: 0.65rem 1.25rem; font-size: 0.82rem; }
  .hero-card { margin-top: 2rem; }
}

@media (max-width: 480px) {
  .benefits-grid { grid-template-columns: 1fr; }
  .hero-badges { flex-direction: column; align-items: flex-start; }
  .hero-card-stats { flex-direction: column; gap: 0.75rem; }
}
</style>
