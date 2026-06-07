<template>
  <div :data-bs-theme="currentTheme" class="servicios-page">

    <!-- Hero Section -->
    <section class="service-hero">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7" data-aos="fade-right">
            <div class="hero-content">
              <span class="section-eyebrow">Servicios</span>
              <h1 class="hero-title">Nuestros Servicios</h1>
              <p class="hero-subtitle">
                Más de 15 años de experiencia en ensayos de aptitud y análisis de calidad.
                Ofrecemos servicios acreditados bajo la norma <strong>ISO/IEC 17043:2023</strong>
                para garantizar la máxima precisión y confiabilidad.
              </p>
              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-number">8</span>
                  <span class="stat-label">Áreas de especialización</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">50+</span>
                  <span class="stat-label">Tipos de ensayos</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">100%</span>
                  <span class="stat-label">Resultados confiables</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-5" data-aos="fade-left">
            <div class="hero-image">
              <div class="image-wrapper">
                <i class="bi bi-gear-wide-connected"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios Destacados -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Destacados</span>
          <h2 class="section-title">Servicios Principales</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Accede rápidamente a la información completa sobre nuestros principales servicios</p>
        </div>

        <div class="featured-grid">
          <div class="featured-card" data-aos="fade-up" data-aos-delay="0">
            <div class="featured-icon-wrap">
              <i class="bi bi-mortarboard-fill"></i>
            </div>
            <h5>Capacitación y Cursos</h5>
            <p>Programas de formación en metrología, capacitación presencial y online adaptados a tus necesidades.</p>
            <router-link to="/cursos" class="featured-link">
              Ver detalles
              <svg class="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </router-link>
          </div>

          <div class="featured-card" data-aos="fade-up" data-aos-delay="100">
            <div class="featured-icon-wrap">
              <i class="bi bi-file-earmark-text-fill"></i>
            </div>
            <h5>Ensayos de Aptitud</h5>
            <p>Programas de ensayos de aptitud acreditados para evaluar la competencia técnica de laboratorios.</p>
            <router-link to="/ensayos" class="featured-link">
              Ver detalles
              <svg class="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </router-link>
          </div>

          <div class="featured-card" data-aos="fade-up" data-aos-delay="200">
            <div class="featured-icon-wrap">
              <i class="bi bi-people-fill"></i>
            </div>
            <h5>Interlaboratorio</h5>
            <p>Programas interlaboratorio para comparaciones externas y aseguramiento de la calidad.</p>
            <router-link to="/interlaboratorio" class="featured-link">
              Ver detalles
              <svg class="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Categorías de Servicios -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow">Especialización</span>
          <h2 class="section-title">Categorías de Servicios</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle">Selecciona una categoría para explorar nuestros servicios especializados</p>
        </div>

        <div class="categories-grid">
          <div
            v-for="(category, index) in categories"
            :key="category.id"
            class="category-card"
            :class="{ 'active': activeCategory === category.id }"
            @click="setActiveCategory(category.id)"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 80"
          >
            <div class="category-icon-wrap">
              <i :class="category.icon"></i>
            </div>
            <h4 class="category-title">{{ category.title }}</h4>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-badge">
              <span>{{ category.services.length }} servicios</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Proceso de Trabajo -->
    <section class="process-section">
      <div class="process-bg-pattern"></div>
      <div class="container">
        <div class="section-header text-center" data-aos="fade-up">
          <span class="section-eyebrow light">Metodología</span>
          <h2 class="section-title text-white">Nuestro Proceso de Trabajo</h2>
          <div class="title-underline centered"></div>
          <p class="section-subtitle text-white-50">Garantizamos excelencia en cada etapa del proceso</p>
        </div>

        <div class="process-grid">
          <div
            v-for="(step, index) in processSteps"
            :key="step.id"
            class="process-card"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="process-number">{{ step.id }}</div>
            <div class="process-icon-wrap">
              <i :class="step.icon"></i>
            </div>
            <h5 class="process-title">{{ step.title }}</h5>
            <p class="process-description">{{ step.description }}</p>
            <ul class="process-features">
              <li v-for="feature in step.features" :key="feature">
                <i class="bi bi-check-lg"></i> {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-wrapper" data-aos="fade-up">
          <div class="cta-content">
            <h2 class="cta-title">¿Necesitas un servicio específico?</h2>
            <p class="cta-description">
              Contamos con soluciones personalizadas para tus necesidades.
              Nuestro equipo de expertos está listo para asesorarte.
            </p>
            <div class="cta-features">
              <div class="cta-feature">
                <i class="bi bi-check-circle-fill"></i>
                <span>Cotización sin costo</span>
              </div>
              <div class="cta-feature">
                <i class="bi bi-check-circle-fill"></i>
                <span>Asesoría técnica especializada</span>
              </div>
              <div class="cta-feature">
                <i class="bi bi-check-circle-fill"></i>
                <span>Resultados garantizados</span>
              </div>
            </div>
          </div>
          <div class="cta-action">
            <router-link to="/contacto" class="contact-btn">
              Solicitar Cotización
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
import FooterComponent from '@/components/Footer.vue/Footer.vue'

type Theme = 'light' | 'dark'

interface Category {
  id: number
  title: string
  description: string
  icon: string
  services: number[]
}

interface ProcessStep {
  id: number
  title: string
  description: string
  icon: string
  features: string[]
}

const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')
const activeCategory = ref<number | null>(null)

const categories: Category[] = [
  {
    id: 1,
    title: 'Agua y Alimentos',
    description: 'Análisis microbiológicos y químicos para garantizar calidad y seguridad',
    icon: 'bi bi-droplet-fill',
    services: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 2,
    title: 'Masa y Temperatura',
    description: 'Calibración y verificación de instrumentos de medición',
    icon: 'bi bi-thermometer-sun',
    services: [7, 8, 9, 10, 11]
  },
  {
    id: 3,
    title: 'Volumen y Presión',
    description: 'Medición y control de variables en procesos industriales',
    icon: 'bi bi-speedometer2',
    services: [12, 13, 14, 15, 16]
  },
  {
    id: 4,
    title: 'Dimensional',
    description: 'Mediciones exactas con tecnología de punta',
    icon: 'bi bi-bounding-box-circles',
    services: [17, 18, 19, 20]
  },
  {
    id: 5,
    title: 'Humedad',
    description: 'Control de condiciones ambientales para procesos específicos',
    icon: 'bi bi-cloud-rain-fill',
    services: [21, 22, 23]
  },
  {
    id: 6,
    title: 'Eléctrica',
    description: 'Pruebas y mediciones eléctricas para garantizar seguridad',
    icon: 'bi bi-lightning-charge-fill',
    services: [24, 25, 26, 27]
  },
  {
    id: 7,
    title: 'Densidad',
    description: 'Análisis de materiales y sustancias con precisión',
    icon: 'bi bi-water',
    services: [28, 29, 30]
  },
  {
    id: 8,
    title: 'Metrología Avanzada',
    description: 'Tecnología de punta en medición y calibración',
    icon: 'bi bi-cpu-fill',
    services: [31, 32, 33, 34]
  }
]

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Consulta y Evaluación',
    description: 'Analizamos tus necesidades y requerimientos específicos',
    icon: 'bi bi-chat-left-text-fill',
    features: ['Diagnóstico inicial', 'Propuesta técnica', 'Cotización detallada']
  },
  {
    id: 2,
    title: 'Planificación',
    description: 'Desarrollamos un plan de trabajo personalizado',
    icon: 'bi bi-calendar-check-fill',
    features: ['Cronograma detallado', 'Asignación de recursos', 'Protocolos de trabajo']
  },
  {
    id: 3,
    title: 'Ejecución',
    description: 'Realizamos los análisis con equipos certificados',
    icon: 'bi bi-gear-fill',
    features: ['Procedimientos acreditados', 'Control de calidad', 'Documentación en tiempo real']
  },
  {
    id: 4,
    title: 'Validación',
    description: 'Verificamos la precisión y confiabilidad de los resultados',
    icon: 'bi bi-check-circle-fill',
    features: ['Revisión por pares', 'Validación estadística', 'Garantía de calidad']
  },
  {
    id: 5,
    title: 'Entrega',
    description: 'Proporcionamos resultados certificados y asesoría post-servicio',
    icon: 'bi bi-file-earmark-text-fill',
    features: ['Informe detallado', 'Certificado de análisis', 'Soporte técnico']
  }
]

const setActiveCategory = (categoryId: number) => {
  activeCategory.value = activeCategory.value === categoryId ? null : categoryId
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

.servicios-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .servicios-page {
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
.section-eyebrow.light { color: rgba(122,171,61,0.85); }

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

.section-header { margin-bottom: 3rem; }

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
  margin-bottom: 2rem;
  max-width: 540px;
}

.hero-subtitle strong { color: #ffffff; font-weight: 600; }

.hero-stats {
  display: flex;
  gap: 2.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.stat-label {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.6);
  margin-top: 0.4rem;
  font-weight: 500;
}

.hero-image {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.image-wrapper {
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4.5rem;
  color: rgba(255,255,255,0.4);
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* ============================================================
   FEATURED SECTION
   ============================================================ */
.featured-section {
  padding: 5rem 0;
  background: #ffffff;
}

[data-bs-theme="dark"] .featured-section { background: #0e1509; }

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.featured-card {
  background: #fcfdfb;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 2rem;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

[data-bs-theme="dark"] .featured-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.1);
  border-color: rgba(93,138,47,0.3);
}

.featured-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--sena-green-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--sena-green);
  margin-bottom: 1.25rem;
  transition: var(--transition);
}

[data-bs-theme="dark"] .featured-icon-wrap {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.featured-card:hover .featured-icon-wrap {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
}

.featured-card h5 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.6rem;
}

[data-bs-theme="dark"] .featured-card h5 { color: #e0ecd6; }

.featured-card p {
  font-size: 0.85rem;
  color: var(--sena-muted);
  line-height: 1.6;
  flex: 1;
  margin-bottom: 1.25rem;
}

.featured-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--sena-green);
  text-decoration: none;
  transition: var(--transition);
}

[data-bs-theme="dark"] .featured-link { color: var(--sena-green-light); }

.featured-link:hover { gap: 0.65rem; }

.link-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.22s ease;
}

.featured-link:hover .link-arrow { transform: translateX(2px); }

/* ============================================================
   CATEGORIES SECTION
   ============================================================ */
.categories-section {
  padding: 5rem 0;
  background: #fafaf8;
}

[data-bs-theme="dark"] .categories-section { background: #0c0f0a; }

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.category-card {
  background: #ffffff;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  position: relative;
}

[data-bs-theme="dark"] .category-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.1);
  border-color: rgba(93,138,47,0.3);
}

.category-card.active {
  border-color: var(--sena-green);
  background: #f8faf7;
}

[data-bs-theme="dark"] .category-card.active {
  background: #18210f;
  border-color: var(--sena-green-light);
}

.category-icon-wrap {
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

[data-bs-theme="dark"] .category-icon-wrap {
  background: rgba(93,138,47,0.15);
  color: var(--sena-green-light);
}

.category-card:hover .category-icon-wrap,
.category-card.active .category-icon-wrap {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .category-title { color: #e0ecd6; }

.category-description {
  font-size: 0.85rem;
  color: var(--sena-muted);
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.category-badge {
  padding-top: 0.75rem;
  border-top: 1px solid var(--sena-border);
}

.category-badge span {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--sena-green);
  background: var(--sena-green-pale);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
}

[data-bs-theme="dark"] .category-badge span {
  color: var(--sena-green-light);
  background: rgba(93,138,47,0.15);
}

/* ============================================================
   PROCESS SECTION
   ============================================================ */
.process-section {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
}

.process-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(93,138,47,0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(122,171,61,0.08) 0%, transparent 40%);
  pointer-events: none;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.process-card {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: var(--radius-card);
  padding: 1.75rem;
  text-align: center;
  transition: var(--transition);
  position: relative;
}

.process-card:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(122,171,61,0.3);
  transform: translateY(-3px);
}

.process-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: var(--sena-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  z-index: 2;
}

.process-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(122,171,61,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.75rem auto 1rem;
  font-size: 1.3rem;
  color: var(--sena-green-light);
}

.process-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.process-description {
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.process-features {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.process-features li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255,255,255,0.55);
  font-size: 0.75rem;
  margin-bottom: 0.35rem;
}

.process-features li i {
  color: var(--sena-green-light);
  font-size: 0.7rem;
  flex-shrink: 0;
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
   MODO CLARO - OVERRIDES
   ============================================================ */
[data-bs-theme="light"] .section-eyebrow { color: #5d8a2f; font-weight: 700; }
[data-bs-theme="light"] .section-title { color: #1a2612; }
[data-bs-theme="light"] .section-subtitle { color: #6b7a60; font-weight: 500; }

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

[data-bs-theme="light"] .hero-title { color: #1a2612; }
[data-bs-theme="light"] .hero-subtitle { color: #4a5a40; font-weight: 500; }
[data-bs-theme="light"] .hero-subtitle strong { color: #5d8a2f; font-weight: 700; }
[data-bs-theme="light"] .stat-number { color: #1a2612; }
[data-bs-theme="light"] .stat-label { color: #5a6a52; }

[data-bs-theme="light"] .image-wrapper {
  background: linear-gradient(135deg, rgba(93, 138, 47, 0.08), rgba(122, 171, 61, 0.05));
  border: 2px solid rgba(93, 138, 47, 0.15);
  color: rgba(93, 138, 47, 0.3);
}

[data-bs-theme="light"] .featured-section { background: #ffffff; }
[data-bs-theme="light"] .featured-card {
  background: #ffffff;
  border: 1.5px solid #e0e5da;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="light"] .featured-card:hover { border-color: #5d8a2f; }
[data-bs-theme="light"] .featured-icon-wrap {
  background: #f0f4ea;
  border: 2px solid rgba(93, 138, 47, 0.15);
}

[data-bs-theme="light"] .featured-link { color: #5d8a2f; }

[data-bs-theme="light"] .categories-section { background: #f5f7f2; }
[data-bs-theme="light"] .category-card {
  background: #ffffff;
  border: 1.5px solid #e0e5da;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="light"] .category-card:hover { border-color: #5d8a2f; }
[data-bs-theme="light"] .category-card.active {
  border-color: #5d8a2f;
  background: #f8faf7;
}

[data-bs-theme="light"] .category-icon-wrap {
  background: #f0f4ea;
  border: 2px solid rgba(93, 138, 47, 0.15);
}

[data-bs-theme="light"] .category-badge span {
  color: #5d8a2f;
  background: #f0f4ea;
}

[data-bs-theme="light"] .process-section {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
}

[data-bs-theme="light"] .cta-wrapper {
  border: 2px solid #e0e5da;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 3rem;
}

[data-bs-theme="light"] .cta-title { font-size: 2rem; }
[data-bs-theme="light"] .cta-description { font-size: 1.05rem; line-height: 1.7; }
[data-bs-theme="light"] .contact-btn {
  font-size: 1rem;
  padding: 0.85rem 2rem;
  box-shadow: 0 8px 24px rgba(93, 138, 47, 0.25);
}

[data-bs-theme="light"] .contact-btn:hover {
  box-shadow: 0 12px 36px rgba(93, 138, 47, 0.35);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .hero-title { font-size: 2.4rem; }
  .section-title { font-size: 2rem; }
  .hero-stats { gap: 1.5rem; }
  .image-wrapper { width: 160px; height: 160px; font-size: 3.5rem; }
}

@media (max-width: 768px) {
  .service-hero { padding: 3rem 0 2.5rem; }
  .hero-title { font-size: 2rem; }
  .hero-image { margin-top: 2rem; }
  .hero-stats { flex-direction: column; gap: 1rem; }
  .cta-wrapper { padding: 2rem 1.5rem; flex-direction: column; text-align: center; }
  .cta-description { max-width: 100%; }
  .cta-features { justify-content: center; }
  .process-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
}

@media (max-width: 480px) {
  .featured-grid { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: 1fr; }
  .process-grid { grid-template-columns: 1fr; }
}
</style>
