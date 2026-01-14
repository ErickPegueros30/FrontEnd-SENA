<template>
  <div :data-bs-theme="currentTheme" class="nosotros-page">
      <!-- Contenido Principal -->
      <main class="container py-5">
      <!-- Hero Section -->
      <section class="nosotros-hero fade-in" data-aos="fade-up">
        <h1 class="hero-title">Quiénes Somos</h1>
        <p class="hero-subtitle">
          SENA Laboratorios - Más de una década de excelencia en ensayos de aptitud y análisis de calidad.
          Comprometidos con la precisión, confiabilidad e innovación en cada análisis.
        </p>
        <div class="d-flex flex-wrap gap-3">
          <span class="badge bg-primary py-2 px-3">✓ Acreditado ISO/IEC 17043:2010</span>
          <span class="badge bg-success py-2 px-3">✓ 12+ años de experiencia</span>
          <span class="badge bg-info py-2 px-3">✓ 8 áreas de especialización</span>
        </div>
      </section>

      <!-- Nuestra Historia -->
      <section class="mb-5">
        <h2 class="text-center mb-5" data-aos="fade-up">Nuestra Historia</h2>

        <div class="timeline-section" data-aos="fade-up">
          <div class="timeline-item">
            <div class="timeline-year">2011</div>
            <div class="timeline-content">
              <h4>Fundación y Primer Acreditamiento</h4>
              <p class="mb-0">
                SENA nace en enero del 2011 y obtiene su acreditamiento en septiembre del mismo año.
                Inicialmente sólo se cubrían sub-ramas del agua y alimentos, para ensayos de cadmio,
                sólidos y sales disueltas, cromo hexavalente y cianuros.
              </p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-year">2012</div>
            <div class="timeline-content">
              <h4>Expansión de Servicios</h4>
              <p class="mb-0">
                En marzo del 2012 se ampliaron los servicios ofreciendo más ensayos por sub-rama,
                como fluoruros, cloruros, cobre y fósforo total, entre otros. Estableciendo así
                una base sólida en análisis químicos especializados.
              </p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-year">2013-2014</div>
            <div class="timeline-content">
              <h4>Ampliación de Capacidades</h4>
              <p class="mb-0">
                En 2013 se amplió el acreditamiento para las áreas de masa y temperatura,
                y en 2014 para volumen y presión. Esto permitió diversificar nuestros servicios
                y atender a más industrias con necesidades de calibración y verificación.
              </p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-year">2018</div>
            <div class="timeline-content">
              <h4>Consolidación Multidisciplinaria</h4>
              <p class="mb-0">
                Se amplió el acreditamiento para dimensional, humedad, eléctrica y densidad.
                Esta expansión consolidó a SENA como un laboratorio integral con capacidades
                en múltiples disciplinas de ensayo y medición.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Misión, Visión y Valores -->
      <section class="mission-vision-section" data-aos="fade-up">
        <div class="row">
          <div class="col-lg-4 mb-4" data-aos="fade-right">
            <div class="text-center h-100">
              <div class="card-icon">
                <i class="bi bi-bullseye"></i>
              </div>
              <h3 class="mb-3">Misión</h3>
              <p class="mb-0">
                En SENA nos comprometemos a tener una mejora constante y a mantener en primer lugar
                la <strong>«Satisfacción Total»</strong> de los clientes, ofreciendo servicios oportunos
                y de calidad respaldados por estándares internacionales.
              </p>
            </div>
          </div>

          <div class="col-lg-4 mb-4" data-aos="fade-up">
            <div class="text-center h-100">
              <div class="card-icon">
                <i class="bi bi-eye"></i>
              </div>
              <h3 class="mb-3">Visión</h3>
              <p class="mb-0">
                Liderar los ensayos de aptitud a nivel nacional, contando con una sólida infraestructura
                que nos permita tener acceso a organizar ensayos de aptitud en el extranjero en los próximos
                3 años, expandiendo nuestro alcance global.
              </p>
            </div>
          </div>

          <div class="col-lg-4 mb-4" data-aos="fade-left">
            <div class="text-center h-100">
              <div class="card-icon">
                <i class="bi bi-award"></i>
              </div>
              <h3 class="mb-3">Política de Calidad</h3>
              <p class="mb-0">
                El cumplimiento de nuestro Sistema de Gestión de la Calidad, basado en la Norma
                ISO/IEC 17043:2010, nos compromete a todos los niveles de la organización a buscar
                siempre una mejora continua que contribuya a incrementar los estándares de medición.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Nuestros Valores -->
      <section class="mb-5" data-aos="fade-up">
        <h2 class="text-center mb-5">Nuestros Valores</h2>

        <div class="values-grid">
          <div class="value-card" data-aos="zoom-in">
            <div class="mb-3">
              <i class="bi bi-shield-check fs-1 text-primary"></i>
            </div>
            <h4>Integridad</h4>
            <p class="mb-0">
              Actuamos con honestidad y transparencia en todos nuestros procesos,
              garantizando la confiabilidad de cada resultado.
            </p>
          </div>

          <div class="value-card" data-aos="zoom-in" data-aos-delay="100">
            <div class="mb-3">
              <i class="bi bi-graph-up-arrow fs-1 text-primary"></i>
            </div>
            <h4>Excelencia</h4>
            <p class="mb-0">
              Buscamos la perfección en cada análisis, implementando las mejores prácticas
              y tecnologías disponibles.
            </p>
          </div>

          <div class="value-card" data-aos="zoom-in" data-aos-delay="200">
            <div class="mb-3">
              <i class="bi bi-people fs-1 text-primary"></i>
            </div>
            <h4>Compromiso</h4>
            <p class="mb-0">
              Nos dedicamos completamente a satisfacer las necesidades de nuestros clientes,
              superando expectativas continuamente.
            </p>
          </div>

          <div class="value-card" data-aos="zoom-in" data-aos-delay="300">
            <div class="mb-3">
              <i class="bi bi-lightbulb fs-1 text-primary"></i>
            </div>
            <h4>Innovación</h4>
            <p class="mb-0">
              Constantemente investigamos y adoptamos nuevas metodologías para mejorar
              nuestros servicios y procesos.
            </p>
          </div>
        </div>
      </section>

      <!-- Sección de Colaboradores Técnicos -->
      <ColaboradoresSection :current-theme="currentTheme" />

      <!-- Acreditaciones -->
      <section class="accreditations-section" data-aos="fade-up">
        <h2 class="text-center mb-4 text-white">Acreditaciones y Reconocimientos</h2>
        <p class="text-center mb-5 text-white-50">
          SENA se encuentra acreditada como proveedor de ensayos de acuerdo a los requisitos generales
          para los ensayos de aptitud (ISO/IEC 17043:2010) para laboratorios de ensayo.
        </p>

        <div class="row g-4">
          <div class="col-md-6" data-aos="fade-right">
            <div class="accreditation-badge">
              <div class="badge-icon">
                <i class="bi bi-file-earmark-check"></i>
              </div>
              <div>
                <h5 class="mb-2">ISO/IEC 17043:2010</h5>
                <p class="mb-0 small">
                  Acreditación internacional para proveedores de ensayos de aptitud.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6" data-aos="fade-left">
            <div class="accreditation-badge">
              <div class="badge-icon">
                <i class="bi bi-globe2"></i>
              </div>
              <div>
                <h5 class="mb-2">Reconocimiento Internacional</h5>
                <p class="mb-0 small">
                  Resultados aceptados en más de 20 países a nivel mundial.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6" data-aos="fade-right">
            <div class="accreditation-badge">
              <div class="badge-icon">
                <i class="bi bi-building-check"></i>
              </div>
              <div>
                <h5 class="mb-2">Laboratorios Acreditados</h5>
                <p class="mb-0 small">
                  Instalaciones certificadas bajo los más altos estándares de calidad.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6" data-aos="fade-left">
            <div class="accreditation-badge">
              <div class="badge-icon">
                <i class="bi bi-arrow-repeat"></i>
              </div>
              <div>
                <h5 class="mb-2">Mejora Continua</h5>
                <p class="mb-0 small">
                  Sistema de gestión de calidad con auditorías periódicas de renovación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Áreas de Especialización -->
      <section class="mb-5" data-aos="fade-up">
        <h2 class="text-center mb-5">Áreas de Especialización</h2>

        <div class="row g-4">
          <div class="col-md-3 col-6" data-aos="zoom-in">
            <div class="text-center">
              <div class="mb-3">
                <i class="bi bi-droplet fs-1 text-primary"></i>
              </div>
              <h6>Agua y Alimentos</h6>
              <p class="small mb-0">Análisis microbiológicos y químicos</p>
            </div>
          </div>

          <div class="col-md-3 col-6" data-aos="zoom-in" data-aos-delay="100">
            <div class="text-center">
              <div class="mb-3">
                <i class="bi bi-thermometer-half fs-1 text-primary"></i>
              </div>
              <h6>Masa y Temperatura</h6>
              <p class="small mb-0">Calibración y verificación</p>
            </div>
          </div>

          <div class="col-md-3 col-6" data-aos="zoom-in" data-aos-delay="200">
            <div class="text-center">
              <div class="mb-3">
                <i class="bi bi-speedometer2 fs-1 text-primary"></i>
              </div>
              <h6>Volumen y Presión</h6>
              <p class="small mb-0">Medición y control preciso</p>
            </div>
          </div>

          <div class="col-md-3 col-6" data-aos="zoom-in" data-aos-delay="300">
            <div class="text-center">
              <div class="mb-3">
                <i class="bi bi-rulers fs-1 text-primary"></i>
              </div>
              <h6>Dimensional</h6>
              <p class="small mb-0">Mediciones exactas de dimensiones</p>
            </div>
          </div>

          <div class="col-md-3 col-6" data-aos="zoom-in" data-aos-delay="400">
            <div class="text-center">
              <div class="mb-3">
                <i class="bi bi-moisture fs-1 text-primary"></i>
              </div>
              <h6>Humedad</h6>
              <p class="small mb-0">Control de condiciones ambientales</p>
            </div>
          </div>

          <div class="col-md-3 col-6" data-aos="zoom-in" data-aos-delay="500">
            <div class="text-center">
              <div class="mb-3">
                <i class="bi bi-lightning-charge fs-1 text-primary"></i>
              </div>
              <h6>Eléctrica</h6>
              <p class="small mb-0">Pruebas y mediciones eléctricas</p>
            </div>
          </div>

          <div class="col-md-3 col-6" data-aos="zoom-in" data-aos-delay="600">
            <div class="text-center">
              <div class="mb-3">
                <i class="bi bi-water fs-1 text-primary"></i>
              </div>
              <h6>Densidad</h6>
              <p class="small mb-0">Análisis de materiales y sustancias</p>
            </div>
          </div>

          <div class="col-md-3 col-6" data-aos="zoom-in" data-aos-delay="700">
            <div class="text-center">
              <div class="mb-3">
                <i class="bi bi-cpu fs-1 text-primary"></i>
              </div>
              <h6>Metrología Avanzada</h6>
              <p class="small mb-0">Tecnología de punta en medición</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="contact-section text-center" data-aos="fade-up">
        <h2 class="mb-3">¿Listo para trabajar con nosotros?</h2>
        <p class="mb-4">
          Confía en SENA para tus necesidades de ensayos de aptitud y análisis de calidad.
          Más de 12 años de experiencia respaldan nuestra excelencia.
        </p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <router-link to="/contacto" class="btn btn-light btn-lg">
            <i class="bi bi-envelope me-2"></i>Contactar
          </router-link>
          <router-link to="/servicios" class="btn btn-outline-light btn-lg">
            <i class="bi bi-list-check me-2"></i>Ver Servicios
          </router-link>
        </div>
      </section>
    </main>

    <!-- Footer is provided by App.vue -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import ColaboradoresSection from '@/views/Nosotrros/ColaboradoresSection.vue'
// Tipos
type Theme = 'light' | 'dark'

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Función para cambiar tema
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)
}
// Detectar preferencia del sistema
const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = 'dark'
      localStorage.setItem('theme', 'dark')
    }
  }
}

// Escuchar cambios en la preferencia del sistema
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

  // Animación de entrada para elementos
  const elements = document.querySelectorAll('.fade-in')
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.setAttribute('style', 'opacity: 1; transform: translateY(0)')
    }, index * 200)
  })
})
</script>

<style scoped>
.nosotros-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: auto; /* let App.vue compute viewport offset */
  padding-top: 0; /* let App.vue compute offset */
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .nosotros-page {
  background: linear-gradient(135deg, #121212 0%, #1A1A1A 100%);
}

/* ========== CONTENIDO NOSOTROS ========== */
.nosotros-hero {
  background: linear-gradient(135deg, rgba(76,175,80,0.12) 0%, rgba(129,199,132,0.06) 100%);
  border-radius: var(--border-radius, 14px);
  padding: 3.2rem 1.5rem;
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(16,24,40,0.06);
}

.nosotros-hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  opacity: 0.1;
  border-radius: 50%;
  transform: translate(100px, -100px);
}

[data-bs-theme="dark"] .nosotros-hero {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: .6rem;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--color-gray, #5f6b63);
  max-width: 820px;
  margin-bottom: 1.4rem;
  position: relative;
  z-index: 1;
}

[data-bs-theme="dark"] .hero-subtitle {
  color: var(--color-gray, #6C757D);
}

.timeline-section {
  position: relative;
  padding: 3rem 0;
}

.timeline-item {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 3rem;
}

.timeline-year {
  position: absolute;
  left: 0;
  top: 0;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  box-shadow: 0 4px 15px rgba(30, 158, 74, 0.3);
}

.timeline-content {
  background: var(--card-bg, white);
  border-radius: var(--border-radius, 12px);
  padding: 2rem;
  margin-left: 3rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .timeline-content {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.timeline-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.mission-vision-section {
  background: var(--lab-bg, #f8f9fa);
  border-radius: var(--border-radius, 12px);
  padding: 3rem;
  margin: 3rem 0;
}

[data-bs-theme="dark"] .mission-vision-section {
  background: var(--lab-bg, #1a1a1a);
}

.card-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.value-card {
  background: var(--card-bg, white);
  border-radius: var(--border-radius, 12px);
  padding: 2rem;
  text-align: center;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .value-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.value-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary-light, #34B565);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.accreditations-section {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-radius: var(--border-radius, 12px);
  padding: 3rem;
  margin: 3rem 0;
}

.accreditation-badge {
  background: var(--color-light, white);
  border-radius: var(--border-radius-sm, 8px);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .accreditation-badge {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.accreditation-badge:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.badge-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.contact-section {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  color: white;
  border-radius: var(--border-radius, 12px);
  padding: 3rem;
  margin: 3rem 0;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

@media (max-width: 991.98px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .nosotros-page {
    padding-top: 120px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .timeline-content {
    margin-left: 0;
    margin-top: 1rem;
  }

  .mission-vision-section,
  .accreditations-section {
    padding: 2rem 1rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .contact-section .btn-lg {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .timeline-year {
    width: 60px;
    height: 60px;
    font-size: 1rem;
  }
}
</style>
