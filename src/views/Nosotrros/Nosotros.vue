<template>
  <div :data-bs-theme="currentTheme" class="nosotros-page">

    <!-- Hero Section -->
    <section class="acreditaciones-hero events-hero">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row align-items-center min-vh-60">
          <div class="col-lg-7" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">¿Quiénes Somos?</h1>
              <p class="hero-subtitle ">
                Más de una década de experiencia en ensayos de aptitud y servicios metrológicos.
                Entregamos resultados precisos y trazables, respaldados por un compromiso
                constante con la calidad y la norma <strong>ISO/IEC 17043:2023</strong>.
              </p>

              <div class="hero-actions">
                <router-link to="/contacto" class="contact-btn">
                  Contactar ahora
                  <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-lg-5" data-aos="fade-left">
            <div class="hero-visual">
              <div class="floating-badge badge-top">
                <div class="badge-icon-wrap">
                  <i class="bi bi-award-fill"></i>
                </div>
                <div class="badge-text">
                  <span class="badge-label">Acreditado</span>
                  <span class="badge-detail">ISO/IEC 17043:2023</span>
                </div>
              </div>
              <div class="floating-badge badge-bottom">
                <div class="badge-icon-wrap">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div class="badge-text">
                  <span class="badge-label">Garantía</span>
                  <span class="badge-detail">Resultados confiables</span>
                </div>
              </div>
              <div class="hero-circle"></div>
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
          <p class="intro-text ">
            En <strong>SENA</strong> creemos que la calidad no se improvisa. Desde nuestra fundación,
            hemos construido una cultura de excelencia técnica basada en la trazabilidad metrológica,
            la imparcialidad y el desarrollo continuo de nuestros colaboradores. Cada ensayo que
            realizamos refleja nuestro compromiso con la confiabilidad y el cumplimiento normativo
            que los laboratorios necesitan para proyectar sus mediciones hacia los mercados globales.
          </p>
          <div class="intro-footer">
            <div class="intro-signature">
              <span class="signature-line"></span>
              <span class="signature-text">Excelencia SENA</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nuestra Historia (Timeline) -->
    <section class="timeline-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Trayectoria</span>
          <h2 class="section-title">Nuestra Historia</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Conoce los hitos que han marcado nuestro camino</p>
        </div>

        <div class="timeline-wrapper">
          <div class="timeline">
            <div class="timeline-line"></div>

            <div class="timeline-item" v-for="(event, idx) in timelineEvents" :key="idx"
                 :class="[idx % 2 === 0 ? 'timeline-left' : 'timeline-right']"
                 data-aos="fade-up" :data-aos-delay="idx * 100">
              <div class="timeline-marker">
                <div class="marker-dot"></div>
              </div>
              <div class="timeline-card">
                <div class="timeline-year-badge">{{ event.year }}</div>
                <h4 class="timeline-title">{{ event.title }}</h4>
                <p class="timeline-description">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Misión / Visión / Política -->
    <section class="mission-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Nuestra Esencia</span>
          <h2 class="section-title">Misión, Visión y Política</h2>
          <div class="title-underline centered"></div>
        </div>

        <div class="mission-grid">
          <div class="mission-card" data-aos="fade-up">
            <div class="mission-icon">
              <i class="bi bi-bullseye"></i>
            </div>
            <h3 class="mission-title">Misión</h3>
            <p class="mission-text">Brindamos servicios de ensayos de aptitud y metrología bajo estrictos estándares de calidad, garantizando trazabilidad y confianza en cada resultado.</p>
          </div>

          <div class="mission-card" data-aos="fade-up" data-aos-delay="100">
            <div class="mission-icon">
              <i class="bi bi-eye"></i>
            </div>
            <h3 class="mission-title">Visión</h3>
            <p class="mission-text">Ser un referente nacional e internacional en ensayos de aptitud y servicios metrológicos, promoviendo buenas prácticas y colaboración técnica.</p>
          </div>

          <div class="mission-card" data-aos="fade-up" data-aos-delay="200">
            <div class="mission-icon">
              <i class="bi bi-award"></i>
            </div>
            <h3 class="mission-title">Política de Calidad</h3>
            <p class="mission-text">Mantener y mejorar continuamente la calidad conforme a ISO/IEC 17043:2023, impulsando la mejora permanente en procesos y competencias.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="values-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Principios</span>
          <h2 class="section-title">Nuestros Valores</h2>
          <div class="title-underline centered"></div>
        </div>

        <div class="values-grid">
          <div class="value-card" v-for="(value, idx) in values" :key="idx" data-aos="fade-up" :data-aos-delay="idx * 100">
            <div class="value-icon">
              <i :class="value.icon"></i>
            </div>
            <h4 class="value-title">{{ value.title }}</h4>
            <p class="value-description">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Acreditaciones -->
    <section class="accreditations-section">
      <div class="accreditations-bg-pattern"></div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12" data-aos="fade-left">
            <div class="section-header" >
              <span class="section-eyebrow light">Reconocimientos</span>
              <h2 class="section-title text-white">Acreditaciones</h2>
              <div class="title-underline"></div>
              <p class="section-subtitle mt-2 text-white">Certificaciones que respaldan nuestro trabajo</p>
            </div>

            <div class="accreditations-wrapper mt-4 center-no-logo">
              <div class="accreditation-badge" v-for="(acc, idx) in accreditations" :key="acc.id" data-aos="fade-up" :data-aos-delay="idx * 80">
                <div class="badge-icon"><i :class="acc.icon"></i></div>
                <div class="badge-info">
                  <h4>{{ acc.title }}</h4>
                  <p>{{ acc.description }}</p>
                </div>
              </div>
            </div>

            <div class="accreditations-footer">
              <router-link to="/acreditaciones" class="contact-btn view-accreditaciones-btn">
                Ver acreditaciones
                <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </router-link>
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

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-wrapper" data-aos="fade-up">
          <div class="cta-content">
            <h2 class="cta-title">¿Listo para colaborar con nosotros?</h2>
            <p class="cta-description">
              Solicita información o una cotización y nuestro equipo te acompañará en el proceso.
            </p>
          </div>
          <div class="cta-action">
            <router-link to="/contacto" class="contact-btn">
              Contactar ahora
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
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import emaLogo from '@/image/Logo EMA.svg'

type Theme = 'light' | 'dark'

interface Service {
  id: number
  name: string
  icon: string
  iconWhite?: string
  route: string
}

interface Accreditation {
  id: number
  title: string
  description: string
  icon: string
}

const router = useRouter()

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

const accreditations: Accreditation[] = [
  { id: 1, title: 'ISO/IEC 17043:2023', description: 'Proveedor de ensayos de aptitud', icon: 'bi bi-file-earmark-check' },
  { id: 2, title: 'Reconocimiento EMA', description: 'Entidad Mexicana de Acreditación', icon: 'bi bi-building-check' }
]

const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

const timelineEvents = [
  {
    year: '2011',
    title: 'Fundación y Primer Acreditamiento',
    description: 'SENA inicia operaciones en enero y obtiene su acreditamiento en septiembre del mismo año, comenzando actividades de ensayos de aptitud en agua y alimentos.'
  },
  {
    year: '2012',
    title: 'Expansión de Servicios',
    description: 'Se amplían los tipos de ensayos y se consolidan capacidades técnicas en nuevas sub-ramas químicas y microbiológicas, fortaleciendo nuestra oferta.'
  },
  {
    year: '2014',
    title: 'Ampliación de Capacidades',
    description: 'El alcance del acreditamiento crece significativamente, incluyendo masa, temperatura, volumen y presión, fortaleciendo la trazabilidad metrológica.'
  },
  {
    year: '2018',
    title: 'Consolidación Multidisciplinaria',
    description: 'Se incorporan ensayos dimensionales, de humedad, eléctricos y de densidad, consolidando un laboratorio integral y competente a nivel internacional.'
  }
]

const values = [
  {
    icon: 'bi bi-shield-check',
    title: 'Integridad',
    description: 'Actuamos con transparencia y ética profesional en todos los procesos.'
  },
  {
    icon: 'bi bi-graph-up-arrow',
    title: 'Excelencia',
    description: 'Perseguimos la calidad técnica y la mejora continua en cada entrega.'
  },
  {
    icon: 'bi bi-people-fill',
    title: 'Compromiso',
    description: 'Atendemos las necesidades del cliente con responsabilidad y orientación al servicio.'
  },
  {
    icon: 'bi bi-lightbulb-fill',
    title: 'Innovación',
    description: 'Incorporamos metodologías y tecnologías que mejoran resultados y tiempos.'
  }
]

</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --radius-card:      20px;
  --radius-sm:        10px;
  --shadow-sm:        0 2px 12px rgba(0,0,0,0.06);
  --shadow-md:        0 8px 32px rgba(0,0,0,0.10);
  --transition:       all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-body:        'DM Sans', 'Segoe UI', sans-serif;
}

/* ============================================================
   BASE
   ============================================================ */
.nosotros-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .nosotros-page {
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
.section-eyebrow.light { color: rgba(122,171,61,0.85); }
.title-underline.light-underline {
  background: linear-gradient(90deg, rgba(122,171,61,0.6), rgba(122,171,61,0.9));
}

/* ============================================================
   HERO SECTION (copiado de Acreditamiento.vue para consistencia)
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
  color: white;
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
  background: linear-gradient(135deg, #21904bb7 0%, #0d671795 100%);
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
  max-width: 600px;
}

.hero-subtitle strong { color: #ffffff; font-weight: 600; }

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item { text-align: center; }

.stat-number {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--sena-green-light);
  line-height: 1.1;
}

.stat-label {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

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

/* Hero Visual */
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

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
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

.floating-badge:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.1);
}

.badge-top { top: 20px; right: 10px; }
.badge-bottom { bottom: 20px; left: 10px; }

.badge-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(122,171,61,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--sena-green-light);
  flex-shrink: 0;
}

.badge-text {
  display: flex;
  flex-direction: column;
}

.badge-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #ffffff;
}

.badge-detail {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.55);
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
  background: #fcfdfb2b; /* ligero tono para evitar 'blanco puro' que se pierde con animaciones */
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
  color: #223323; /* color más oscuro para mejor legibilidad en claro */
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
   ACCREDITATIONS
   ============================================================ */
.accreditations-section {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  padding: 4rem 0;
  position: relative;
  overflow: hidden;
}
.accreditations-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(93,138,47,0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(122,171,61,0.08) 0%, transparent 40%);
  pointer-events: none;
}
.accreditations-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}
/* Center layout when logo is removed */
.accreditations-wrapper.center-no-logo {
  justify-content: center;
}
.accreditations-wrapper.center-no-logo .accreditation-badge {
  flex: 0 1 760px;
  max-width: 760px;
}
.accreditation-badge {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.09);
  transition: var(--transition);
}
.accreditation-badge:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(122,171,61,0.3);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .accreditations-wrapper.center-no-logo {
    justify-content: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .accreditations-wrapper.center-no-logo .accreditation-badge {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
.badge-icon {
  width: 52px; height: 52px;
  background: rgba(93,138,47,0.25);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--sena-green-light);
  flex-shrink: 0;
}
.badge-info h4 {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.badge-info p {
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
  margin: 0;
}
.accreditation-logo {
  flex: 0 0 160px;
  text-align: center;
}
.accreditation-logo img {
  max-width: 280px;
  height: auto;
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  display: inline-block;
}
.logo-placeholder {
  background: transparent;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;
  border-radius: 0;
  padding: 0;
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
  border: 1px solid var(--sena-border);
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
  color: var(--sena-text);
  font-weight: 600;
}

[data-bs-theme="dark"] .intro-text strong { color: #e0ecd6; }

.intro-footer {
  display: flex;
  align-items: center;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--sena-border);
}

.intro-signature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.signature-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
}

.signature-text {
  font-size: 0.7rem;
  color: var(--sena-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
}

/* ============================================================
   TIMELINE SECTION - REDISEÑADA
   ============================================================ */
.timeline-section {
  padding: 5rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .timeline-section { background: #0e1509; }

.section-header { margin-bottom: 3rem; }

.timeline-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
}

.timeline {
  position: relative;
  padding: 0;
}

/* Línea central */
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--sena-green-pale) 5%,
    var(--sena-green-light) 30%,
    var(--sena-green) 70%,
    var(--sena-green-pale) 95%,
    transparent 100%
  );
  transform: translateX(-50%);
}

[data-bs-theme="dark"] .timeline-line {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(93,138,47,0.2) 5%,
    var(--sena-green-light) 30%,
    var(--sena-green) 70%,
    rgba(93,138,47,0.2) 95%,
    transparent 100%
  );
}

/* Items del timeline */
.timeline-item {
  position: relative;
  width: 100%;
  margin-bottom: 3rem;
  display: flex;
  align-items: flex-start;
}

.timeline-item:last-child { margin-bottom: 0; }

.timeline-left {
  justify-content: flex-start;
  padding-right: calc(50% + 2rem);
}

.timeline-right {
  justify-content: flex-end;
  padding-left: calc(50% + 2rem);
}

/* Marcadores */
.timeline-marker {
  position: absolute;
  left: 50%;
  top: 1.5rem;
  transform: translateX(-50%);
  z-index: 2;
}

.marker-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  border: 4px solid #ffffff;
  box-shadow: 0 0 0 6px var(--sena-green-pale), 0 4px 12px rgba(93,138,47,0.3);
  transition: var(--transition);
}

[data-bs-theme="dark"] .marker-dot {
  border-color: #0e1509;
  box-shadow: 0 0 0 6px rgba(93,138,47,0.2), 0 4px 12px rgba(0,0,0,0.4);
}

.timeline-item:hover .marker-dot {
  transform: scale(1.3);
  box-shadow: 0 0 0 8px var(--sena-green-pale), 0 6px 20px rgba(93,138,47,0.4);
}

/* Tarjetas */
.timeline-card {
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  position: relative;
  width: 100%;
}

[data-bs-theme="dark"] .timeline-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.timeline-card::before {
  content: '';
  position: absolute;
  top: 1.5rem;
  width: 0;
  height: 0;
  border-style: solid;
}

.timeline-left .timeline-card::before {
  right: -10px;
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent #fcfdfb;
}

.timeline-right .timeline-card::before {
  left: -10px;
  border-width: 10px 10px 10px 0;
  border-color: transparent #fcfdfb transparent transparent;
}

[data-bs-theme="dark"] .timeline-left .timeline-card::before {
  border-color: transparent transparent transparent #131a0e;
}

[data-bs-theme="dark"] .timeline-right .timeline-card::before {
  border-color: transparent #131a0e transparent transparent;
}

.timeline-card:hover {
  transform: translateY(-4px);
  border-color: rgba(93,138,47,0.3);
  box-shadow: 0 12px 36px rgba(93,138,47,0.12);
}

.timeline-year-badge {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--sena-green);
  margin-bottom: 0.6rem;
  background: var(--sena-green-pale);
  padding: 0.2rem 1rem;
  border-radius: 25px;
  letter-spacing: 1px;
}

[data-bs-theme="dark"] .timeline-year-badge {
  color: var(--sena-green-light);
  background: rgba(93,138,47,0.2);
}

.timeline-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

[data-bs-theme="dark"] .timeline-title { color: #e0ecd6; }

.timeline-description {
  font-size: 0.88rem;
  color: var(--sena-muted);
  line-height: 1.65;
  margin: 0;
}

/* ============================================================
   MISSION SECTION
   ============================================================ */
.mission-section {
  padding: 5rem 0;
  background: #fafaf8;
}

[data-bs-theme="dark"] .mission-section { background: #0c0f0a; }

.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.mission-card {
  background: #ffffff;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 2.25rem 2rem;
  text-align: center;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

[data-bs-theme="dark"] .mission-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.mission-card:hover {
  transform: translateY(-6px);
  border-color: rgba(93,138,47,0.3);
  box-shadow: 0 14px 40px rgba(93,138,47,0.12);
}

.mission-icon {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: var(--sena-green-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 1.8rem;
  color: var(--sena-green);
  transition: var(--transition);
}

[data-bs-theme="dark"] .mission-icon {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.mission-card:hover .mission-icon {
  background: linear-gradient(135deg, rgba(254, 254, 254, 0.8), rgba(41, 86, 0, 0.9));
  color: #ffffff;
}

.mission-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.75rem;
  font-family: var(--font-display);
}

[data-bs-theme="dark"] .mission-title { color: #e0ecd6; }

.mission-text {
  font-size: 0.9rem;
  color: var(--sena-muted);
  line-height: 1.7;
  margin: 0;
}

/* ============================================================
   VALUES SECTION
   ============================================================ */
.values-section {
  padding: 5rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .values-section { background: #0e1509; }

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.value-card {
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 2rem 1.75rem;
  text-align: center;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

[data-bs-theme="dark"] .value-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.value-card:hover {
  transform: translateY(-6px);
  border-color: rgba(93,138,47,0.3);
  box-shadow: 0 14px 40px rgba(93,138,47,0.12);
}

.value-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--sena-green-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 1.6rem;
  color: var(--sena-green);
  transition: var(--transition);
}

[data-bs-theme="dark"] .value-icon {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.value-card:hover .value-icon {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
}

.value-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.6rem;
}

[data-bs-theme="dark"] .value-title { color: #e0ecd6; }

.value-description {
  font-size: 0.85rem;
  color: var(--sena-muted);
  line-height: 1.6;
  margin: 0;
}

/* ============================================================
   CTA SECTION
   ============================================================ */
.cta-section {
  padding: 5rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .cta-section { background: #0e1509; }

.cta-wrapper {
  background: #fcfdfb;
  border-radius: 24px;
  border: 1px solid var(--sena-border);
  padding: 3rem;
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
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .cta-title { color: #f0f5ea; }

.cta-description {
  font-size: 1rem;
  color: var(--sena-muted);
  line-height: 1.65;
  margin: 0;
  max-width: 500px;
}

.cta-action { flex-shrink: 0; }

/* ============================================================
   MODO CLARO MEJORADO
   ============================================================ */
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

[data-bs-theme="light"] .hero-subtitle {
  color: #c8d8be;
  font-weight: 400;
}

[data-bs-theme="light"] .hero-subtitle strong {
  color: #ffffff;
  font-weight: 700;
}

[data-bs-theme="light"] .intro-text {
  color: #3a4a30;
  font-weight: 400;
}

[data-bs-theme="light"] .intro-text strong {
  color: #1a2612;
  font-weight: 700;
}

[data-bs-theme="light"] .timeline-card {
  background: #ffffff;
  border: 2px solid #e0e5da;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}

[data-bs-theme="light"] .timeline-card:hover {
  border-color: #5d8a2f;
  box-shadow: 0 12px 36px rgba(93, 138, 47, 0.12);
}

[data-bs-theme="light"] .timeline-left .timeline-card::before {
  border-color: transparent transparent transparent #ffffff;
}

[data-bs-theme="light"] .timeline-right .timeline-card::before {
  border-color: transparent #ffffff transparent transparent;
}

[data-bs-theme="light"] .timeline-line {
  background: linear-gradient(
    180deg,
    transparent 0%,
    #e0e5da 5%,
    #5d8a2f 30%,
    #3d5a1f 70%,
    #e0e5da 95%,
    transparent 100%
  );
}

[data-bs-theme="light"] .marker-dot {
  border-color: #ffffff;
  box-shadow: 0 0 0 6px #edf4e3, 0 4px 16px rgba(93, 138, 47, 0.25);
}

[data-bs-theme="light"] .timeline-year-badge {
  color: #5d8a2f;
  background: #edf4e3;
  font-weight: 700;
}

[data-bs-theme="light"] .timeline-title {
  color: #1a2612;
  font-weight: 700;
}

[data-bs-theme="light"] .timeline-description {
  color: #5a6a52;
}

[data-bs-theme="light"] .mission-card {
  background: #ffffff;
  border: 2px solid #e0e5da;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}

[data-bs-theme="light"] .mission-card:hover {
  border-color: #5d8a2f;
}

[data-bs-theme="light"] .mission-icon {
  background: #f0f4ea;
  border: 2px solid rgba(93, 138, 47, 0.2);
}

/* Asegurar visibilidad de iconos en Misión/Visión/Política (modo claro) */
[data-bs-theme="light"] .mission-icon,
[data-bs-theme="light"] .mission-icon i,
[data-bs-theme="light"] .mission-icon svg {
  color: var(--sena-green) !important;
  fill: var(--sena-green) !important;
  stroke: currentColor !important;
  opacity: 1 !important;
}

[data-bs-theme="light"] .mission-card:hover .mission-icon,
[data-bs-theme="light"] .mission-card:focus .mission-icon {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: currentColor !important;
}

/* Reglas extra para evitar que iconos inside <i> o <svg> se oculten por filtros/animaciones */
[data-bs-theme="light"] .mission-icon i,
[data-bs-theme="light"] .mission-icon svg,
[data-bs-theme="light"] .mission-icon * {
  color: inherit !important;
  fill: inherit !important;
  stroke: inherit !important;
  opacity: 1 !important;
  filter: none !important;
  mix-blend-mode: normal !important;
}

[data-bs-theme="light"] .mission-card:hover .mission-icon i,
[data-bs-theme="light"] .mission-card:hover .mission-icon svg {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: currentColor !important;
  opacity: 1 !important;
}

[data-bs-theme="light"] .mission-title {
  color: #1a2612;
  font-weight: 700;
}

[data-bs-theme="light"] .mission-text {
  color: #5a6a52;
}

[data-bs-theme="light"] .value-card {
  background: #ffffff;
  border: 2px solid #e0e5da;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}

[data-bs-theme="light"] .value-card:hover {
  border-color: #5d8a2f;
}

[data-bs-theme="light"] .value-icon {
  background: #f0f4ea;
  border: 2px solid rgba(93, 138, 47, 0.2);
}

/* Alinear comportamiento de iconos con la sección 'Nuestros Valores' en modo claro:
   - icono inicial en verde
   - al hover (o durante la animación) el icono pasa a blanco sobre fondo degradado */
[data-bs-theme="light"] .service-icon,
[data-bs-theme="light"] .service-icon i,
[data-bs-theme="light"] .service-icon svg {
  color: var(--sena-green) !important;
  fill: var(--sena-green) !important;
}

[data-bs-theme="light"] .service-btn:hover .service-icon,
[data-bs-theme="light"] .service-btn:focus .service-icon {
  color: #ffffff !important;
  fill: #ffffff !important;
}

[data-bs-theme="light"] .value-card:hover .value-icon {
  color: #ffffff !important;
  fill: #ffffff !important;
}

[data-bs-theme="light"] .floating-badge:hover .badge-icon,
[data-bs-theme="light"] .floating-badge:focus .badge-icon {
  color: var(--sena-green-light) !important;
  fill: var(--sena-green-light) !important;
}

[data-bs-theme="light"] .value-title {
  color: #1a2612;
  font-weight: 700;
}

[data-bs-theme="light"] .value-description {
  color: #5a6a52;
}

[data-bs-theme="light"] .area-card {
  background: #ffffff;
  border: 2px solid #e0e5da;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="light"] .area-card:hover {
  border-color: #5d8a2f;
}

[data-bs-theme="light"] .area-icon-wrap {
  background: #f0f4ea;
  border: 1px solid rgba(93, 138, 47, 0.15);
}

[data-bs-theme="light"] .area-name {
  color: #2a3a20;
  font-weight: 600;
}

[data-bs-theme="light"] .cta-wrapper {
  background: #ffffff;
  border: 2px solid #e0e5da;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.08);
}

[data-bs-theme="light"] .cta-title {
  color: #1a2612;
}

[data-bs-theme="light"] .cta-description {
  color: #5a6a52;
  font-size: 1.05rem;
}

[data-bs-theme="light"] .contact-btn {
  box-shadow: 0 8px 28px rgba(93, 138, 47, 0.28);
}

[data-bs-theme="light"] .contact-btn:hover {
  box-shadow: 0 14px 40px rgba(93, 138, 47, 0.38);
}

[data-bs-theme="light"] .outline-btn {
  border-color: rgba(93, 138, 47, 0.3);
  color: #5d8a2f;
  font-weight: 600;
}

[data-bs-theme="light"] .outline-btn:hover {
  background: rgba(93, 138, 47, 0.08);
  border-color: #5d8a2f;
  color: #3d5a1f;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .hero-title { font-size: 2.4rem; }
  .section-title { font-size: 2rem; }
  .hero-visual { height: 260px; margin-top: 2rem; }
  .hero-circle { width: 180px; height: 180px; }
  .floating-badge { padding: 0.75rem; }
  .badge-top { right: 0; }
  .badge-bottom { left: 0; }

  /* Timeline mobile */
  .timeline-line {
    left: 24px;
    transform: none;
  }

  .timeline-left,
  .timeline-right {
    padding-left: 60px;
    padding-right: 0;
    justify-content: flex-start;
  }

  .timeline-marker {
    left: 24px;
    top: 1.5rem;
  }

  .timeline-card::before {
    display: none;
  }
}

@media (max-width: 768px) {
  .about-hero { padding: 3rem 0 2.5rem; }
  .hero-stats { gap: 1.25rem; flex-wrap: wrap; }
  .stat-number { font-size: 1.5rem; }
  .intro-wrapper { padding: 1.75rem 1.5rem; }
  .intro-quote-mark { font-size: 3.5rem; top: 0.25rem; left: 1.25rem; }
  .cta-wrapper { padding: 2rem 1.5rem; flex-direction: column; text-align: center; }
  .cta-description { max-width: 100%; }
  .mission-grid { grid-template-columns: 1fr; }
  .accreditations-grid { grid-template-columns: 1fr; }
  .timeline-wrapper { padding: 1rem 0; }
  .timeline-left,
  .timeline-right {
    padding-left: 52px;
  }
  .timeline-line { left: 20px; }
  .timeline-marker { left: 20px; }
}

@media (max-width: 480px) {
  .hero-actions { flex-direction: column; }
  .hero-actions .outline-btn { text-align: center; justify-content: center; }
  .values-grid { grid-template-columns: 1fr; }
  .areas-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-visual { height: 220px; }
  .hero-circle { width: 150px; height: 150px; }
  .floating-badge { gap: 0.5rem; padding: 0.65rem; }
  .badge-icon-wrap { width: 36px; height: 36px; font-size: 1rem; }
  .badge-label { font-size: 0.7rem; }
  .badge-detail { font-size: 0.6rem; }
  .timeline-card { padding: 1.25rem; }
  .timeline-year-badge { font-size: 1.3rem; padding: 0.15rem 0.75rem; }
}
/* ============================================================
   BUTTON STYLES (copiados de HomeView.vue)
   ============================================================ */
.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  color: #ffffff !important;
  -webkit-font-smoothing: antialiased;
  text-shadow: 0 1px 0 rgba(0,0,0,0.18);
  padding: 0.65rem 1.4rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.88rem;
  border: none;
  box-shadow: var(--shadow-green);
  transition: var(--transition);
  text-decoration: none;
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
}

/* Forzar color del SVG y mejor contraste */
.contact-btn svg, .contact-btn .btn-arrow {
  stroke: currentColor !important;
  fill: none !important;
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

/* Variant styles for light theme within Nosotros page */
.nosotros-page[data-bs-theme="light"] .contact-btn {
  color: #ffffff !important;
  background: linear-gradient(180deg, #3f6b1f 0%, #5d8a2f 100%) !important;
  box-shadow: 0 12px 44px rgba(37, 59, 21, 0.18);
  border: 1px solid rgba(0,0,0,0.08);
  z-index: 90;
}
.nosotros-page[data-bs-theme="light"] .contact-btn:focus {
  outline: 3px solid rgba(122,171,61,0.16);
  outline-offset: 2px;
}

.nosotros-page[data-bs-theme="light"] .contact-btn {
  box-shadow: 0 8px 28px rgba(93, 138, 47, 0.28);
}
.nosotros-page[data-bs-theme="light"] .contact-btn:hover {
  box-shadow: 0 14px 40px rgba(93, 138, 47, 0.38);
}

.nosotros-page[data-bs-theme="light"] .outline-btn {
  border-color: rgba(93, 138, 47, 0.3);
  color: #5d8a2f;
  font-weight: 600;
}
.nosotros-page[data-bs-theme="light"] .outline-btn:hover {
  background: rgba(93, 138, 47, 0.08);
  border-color: #5d8a2f;
  color: #3d5a1f;
}

/* Footer buttons */
.accreditations-footer .view-acreditaciones-btn,
.services-footer .view-ensayos-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.4rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
}

/* Centrar el botón de ver acreditaciones */
.accreditations-footer {
  margin-top: 1rem;
  text-align: center;
}

/* ============================================================
   DARK MODE: asegurar que las "cards" no queden blancas
   ============================================================ */
[data-bs-theme="dark"] .nosotros-page .intro-wrapper,
[data-bs-theme="dark"] .nosotros-page .timeline-card,
[data-bs-theme="dark"] .nosotros-page .mission-card,
[data-bs-theme="dark"] .nosotros-page .value-card,
[data-bs-theme="dark"] .nosotros-page .service-btn,
[data-bs-theme="dark"] .nosotros-page .accreditation-badge,
[data-bs-theme="dark"] .nosotros-page .cta-wrapper,
[data-bs-theme="dark"] .nosotros-page .accreditations-footer .view-acreditaciones-btn,
[data-bs-theme="dark"] .nosotros-page .services-footer .view-ensayos-btn,
[data-bs-theme="dark"] .nosotros-page .services-section {
  background: #131a0e !important;
  border-color: rgba(122,171,61,0.10) !important;
  color: #d7e6c7 !important;
  box-shadow: 0 6px 30px rgba(0,0,0,0.45) !important;
}

[data-bs-theme="dark"] .nosotros-page .service-btn {
  border: 1px solid rgba(122,171,61,0.08) !important;
}

[data-bs-theme="dark"] .nosotros-page .service-icon,
[data-bs-theme="dark"] .nosotros-page .badge-icon,
[data-bs-theme="dark"] .nosotros-page .badge-icon i,
[data-bs-theme="dark"] .nosotros-page .service-icon i {
  color: var(--sena-green-light) !important;
  fill: var(--sena-green-light) !important;
}

[data-bs-theme="dark"] .nosotros-page .timeline-left .timeline-card::before {
  border-color: transparent transparent transparent #131a0e !important;
}
[data-bs-theme="dark"] .nosotros-page .timeline-right .timeline-card::before {
  border-color: transparent #131a0e transparent transparent !important;
}

/* Reglas finales: asegurar que en modo claro los iconos mantengan el color verde
   incluso durante animaciones AOS o hover que pudieran forzar blanco. */
[data-bs-theme="light"] .nosotros-page .service-icon,
[data-bs-theme="light"] .nosotros-page .service-icon i,
[data-bs-theme="light"] .nosotros-page .service-icon svg,
[data-bs-theme="light"] .nosotros-page .badge-icon,
[data-bs-theme="light"] .nosotros-page .badge-icon i,
[data-bs-theme="light"] .nosotros-page .badge-icon svg,
[data-bs-theme="light"] .nosotros-page .value-icon,
[data-bs-theme="light"] .nosotros-page .value-icon i,
[data-bs-theme="light"] .nosotros-page .value-icon svg {
  color: var(--sena-green) !important;
  fill: var(--sena-green) !important;
  stroke: currentColor !important;
  opacity: 1 !important;
}

[data-bs-theme="light"] .nosotros-page .service-btn:hover .service-icon,
[data-bs-theme="light"] .nosotros-page .floating-badge:hover .badge-icon,
[data-bs-theme="light"] .nosotros-page .value-card:hover .value-icon {
  color: var(--sena-green) !important;
  fill: var(--sena-green) !important;
  stroke: currentColor !important;
}

</style>
