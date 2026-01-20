<template>
  <div :data-bs-theme="currentTheme" class="nosotros-page">
    <!-- Hero enriquecido -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7" data-aos="fade-right">
            <div class="hero-content">
              <h1 class="hero-title">Quiénes Somos</h1>
              <p class="hero-subtitle">
                En SENA Ensayos de Aptitud, acumulamos más de una década de experiencia en ensayos de aptitud
                y servicios metrológicos. Entregamos resultados precisos y trazables, respaldados por
                un compromiso constante con la calidad.
              </p>

              <div class="hero-stats d-flex gap-4 mt-4">
                <div class="stat-item">
                    <div class="stat-number">12+</div>
                    <div class="stat-label">Años de experiencia</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">8</div>
                    <div class="stat-label">Áreas especializadas</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">100+</div>
                    <div class="stat-label">Clientes satisfechos</div>
                  </div>
              </div>

              <div class="hero-cta mt-4">
                <router-link to="/contacto" class="btn btn-primary btn-lg me-3">Contactar</router-link>
                <router-link to="/servicios" class="btn btn-outline-light btn-lg">Servicios</router-link>
              </div>
            </div>
          </div>

          <div class="col-lg-5" data-aos="fade-left">
            <div class="hero-image">
              <div class="floating-card card-1">
                <i class="bi bi-award-fill"></i>
                <h5>Acreditado</h5>
                <p class="mb-0">ISO/IEC 17043:2023</p>
              </div>
              <div class="floating-card card-2">
                <i class="bi bi-shield-check"></i>
                <h5>Garantía</h5>
                <p class="mb-0">Resultados confiables</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nuestra Historia (timeline) -->
    <section class="timeline-section py-5" data-aos="fade-up" role="region" aria-label="Nuestra Historia">
      <div class="container">
        <h2 class="section-title text-center mb-4">Nuestra Historia</h2>
        <div class="timeline">
          <div class="timeline-item">
            <time datetime="2011" class="timeline-year" aria-hidden="false" aria-label="Año 2011">2011</time>
            <div class="timeline-content" tabindex="0" role="article" aria-labelledby="h-2011">
              <h4 id="h-2011">Fundación y Primer Acreditamiento</h4>
              <p class="mb-0">SENA inicia en enero de 2011 y obtiene su acreditamiento en septiembre del mismo año, iniciando actividades de ensayos de aptitud en agua y alimentos.</p>
            </div>
          </div>

          <div class="timeline-item">
            <time datetime="2012" class="timeline-year" aria-hidden="false" aria-label="Año 2012">2012</time>
            <div class="timeline-content" tabindex="0" role="article" aria-labelledby="h-2012">
              <h4 id="h-2012">Expansión de Servicios</h4>
              <p class="mb-0">Se amplían los tipos de ensayos y consolidan capacidades técnicas en nuevas sub-ramas químicas y microbiológicas.</p>
            </div>
          </div>

          <div class="timeline-item">
            <time datetime="2014" class="timeline-year" aria-hidden="false" aria-label="Año 2014">2014</time>
            <div class="timeline-content" tabindex="0" role="article" aria-labelledby="h-2014">
              <h4 id="h-2014">Ampliación de Capacidades</h4>
              <p class="mb-0">El alcance del acreditamiento crece e incluye masa, temperatura, volumen y presión, fortaleciendo la trazabilidad metrológica.</p>
            </div>
          </div>

          <div class="timeline-item">
            <time datetime="2018" class="timeline-year" aria-hidden="false" aria-label="Año 2018">2018</time>
            <div class="timeline-content" tabindex="0" role="article" aria-labelledby="h-2018">
              <h4 id="h-2018">Consolidación Multidisciplinaria</h4>
              <p class="mb-0">Se incorporan ensayos dimensionales, de humedad, eléctricos y de densidad, consolidando un laboratorio integral y competente.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Misión / Visión / Política -->
    <section class="mission-vision-section py-5">
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-4" data-aos="fade-up">
            <div class="card p-4 h-100">
              <div class="card-icon mb-3"><i class="bi bi-bullseye"></i></div>
              <h3>Misión</h3>
              <p class="mb-0">Brindamos servicios de ensayos de aptitud y metrología bajo estrictos estándares de calidad, garantizando trazabilidad y confianza en cada resultado.</p>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div class="card p-4 h-100">
              <div class="card-icon mb-3"><i class="bi bi-eye"></i></div>
              <h3>Visión</h3>
              <p class="mb-0">Ser un referente nacional e internacional en ensayos de aptitud y servicios metrológicos, promoviendo buenas prácticas y colaboración técnica.</p>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-up" data-aos-delay="200">
            <div class="card p-4 h-100">
              <div class="card-icon mb-3"><i class="bi bi-award"></i></div>
              <h3>Política de Calidad</h3>
              <p class="mb-0">Mantener y mejorar continuamente la calidad conforme a ISO/IEC 17043:2023, impulsando la mejora permanente en procesos y competencias.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Valores (con iconos) -->
    <section class="values-section py-5">
      <div class="container">
        <h2 class="section-title text-center mb-4" data-aos="fade-up">Nuestros Valores</h2>
        <div class="values-grid" data-aos="fade-up">
          <div class="value-card"><i class="bi bi-shield-check fs-3 text-primary mb-2"></i><div><strong>Integridad</strong><p class="small mb-0">Actuamos con transparencia y ética profesional en todos los procesos.</p></div></div>
          <div class="value-card"><i class="bi bi-graph-up-arrow fs-3 text-primary mb-2"></i><div><strong>Excelencia</strong><p class="small mb-0">Perseguimos la calidad técnica y la mejora continua en cada entrega.</p></div></div>
          <div class="value-card"><i class="bi bi-people fs-3 text-primary mb-2"></i><div><strong>Compromiso</strong><p class="small mb-0">Atendemos las necesidades del cliente con responsabilidad y orientación al servicio.</p></div></div>
          <div class="value-card"><i class="bi bi-lightbulb fs-3 text-primary mb-2"></i><div><strong>Innovación</strong><p class="small mb-0">Incorporamos metodologías y tecnologías que mejoran resultados y tiempos.</p></div></div>
        </div>
      </div>
    </section>

    <!-- Acreditaciones (3 columnas en desktop) -->
    <section class="accreditations-section py-5">
      <div class="container">
        <h2 class="section-title text-center text-white mb-3" data-aos="fade-up">Acreditaciones y Reconocimientos</h2>
        <p class="text-center text-white-50 mb-4">Proveedor acreditado de ensayos de aptitud conforme a ISO/IEC 17043:2023.</p>
        <div class="accreditations-grid" data-aos="fade-up">
            <div class="accreditation-item">
            <div class="accreditation-icon"><i class="bi bi-file-earmark-check"></i></div>
            <h5>ISO/IEC 17043:2023</h5>
            <p class="small">Acreditación para proveedores de ensayos de aptitud, que respalda la neutralidad y competencia técnica.</p>
          </div>
            <div class="accreditation-item">
            <div class="accreditation-icon"><i class="bi bi-building-check"></i></div>
            <h5>Laboratorios Acreditados</h5>
            <p class="small">Instalaciones certificadas y operadas bajo controles que garantizan la calidad técnica.</p>
          </div>
            <div class="accreditation-item">
            <div class="accreditation-icon"><i class="bi bi-globe2"></i></div>
            <h5>Reconocimiento Internacional</h5>
            <p class="small">Resultados que cumplen criterios internacionales y son reconocidos por pares en el extranjero.</p>
          </div>
          <div class="accreditation-item">
            <div class="accreditation-icon"><i class="bi bi-check2-circle"></i></div>
            <h5>Certificaciones Técnicas</h5>
            <p class="small">Equipo técnico con formación específica y acreditaciones en metodologías de ensayo.</p>
          </div>
          <div class="accreditation-item">
            <div class="accreditation-icon"><i class="bi bi-star-fill"></i></div>
            <h5>Normas Internacionales</h5>
            <p class="small">Cumplimiento de estándares ISO y buenas prácticas reconocidas internacionalmente.</p>
          </div>
          <div class="accreditation-item">
            <div class="accreditation-icon"><i class="bi bi-arrow-repeat"></i></div>
            <h5>Mejora Continua</h5>
            <p class="small">Procesos auditados y revisiones periódicas para optimizar calidad y eficiencia.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Áreas (grid con iconos) -->
    <section class="areas-section py-5">
      <div class="container">
        <h2 class="section-title text-center mb-4" data-aos="fade-up">Áreas de Especialización</h2>
        <div class="row g-4" data-aos="fade-up">
          <div class="col-6 col-md-3">
            <div class="area-card text-center p-3 h-100"><i class="bi bi-droplet fs-2 mb-2"></i><div>Agua y Alimentos</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="area-card text-center p-3 h-100"><i class="bi bi-thermometer-half fs-2 mb-2"></i><div>Masa y Temperatura</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="area-card text-center p-3 h-100"><i class="bi bi-speedometer2 fs-2 mb-2"></i><div>Volumen y Presión</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="area-card text-center p-3 h-100"><i class="bi bi-rulers fs-2 mb-2"></i><div>Dimensional</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="area-card text-center p-3 h-100"><i class="bi bi-moisture fs-2 mb-2"></i><div>Humedad</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="area-card text-center p-3 h-100"><i class="bi bi-lightning-charge fs-2 mb-2"></i><div>Eléctrica</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="area-card text-center p-3 h-100"><i class="bi bi-water fs-2 mb-2"></i><div>Densidad</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="area-card text-center p-3 h-100"><i class="bi bi-cpu fs-2 mb-2"></i><div>Metrología Avanzada</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section py-5">
      <div class="container text-center" data-aos="fade-up">
        <h3 class="cta-title mb-3">¿Listo para colaborar con nosotros?</h3>
        <p class="cta-subtitle mb-4">Solicita información o una cotización y nuestro equipo te acompañará en el proceso.</p>
        <router-link to="/contacto" class="btn btn-primary btn-lg">Contactar ahora</router-link>
      </div>
    </section>

    <FooterComponent :current-theme="currentTheme" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import FooterComponent from '@/components/Footer.vue/Footer.vue'
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
  min-height: calc(100vh - var(--navbar-height, 0px));
  /* App.vue already applies the top offset on #app-view; avoid double-padding here */
  padding-top: 0;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .nosotros-page {
  background: linear-gradient(135deg, #121212 0%, #1A1A1A 100%);
}

/* Hero (shared with HomeView/Contacto) */
.hero-section {
  min-height: 60vh;
  background: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
              url('https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  position: relative;
}

.hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(166,184,40,0.8), rgba(166,184,40,0.6)); }
.hero-content { position: relative; z-index: 2; padding: 2rem 0; }
.hero-title { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 700; margin-bottom: 0.6rem; }
.hero-subtitle { font-size: 1.05rem; max-width: 720px; opacity: 0.95; }

/* Timeline / Historia */
.timeline-section { padding-top: 2rem; padding-bottom: 2rem }
.timeline { display:block }
.timeline { position: relative; padding: 2rem 0 }
.timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.12); transform: translateX(-50%); }
.timeline-item { position: relative; width: 100%; margin: 2.25rem 0; display: flex; align-items: start; }
.timeline-year { position: absolute; left: 50%; transform: translateX(-50%); top: 0; width: 72px; height: 72px; background: linear-gradient(135deg,#a6b828 0%,#a6b828 100%); border-radius: 50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1.05rem; box-shadow: 0 8px 28px rgba(0,0,0,0.18); z-index: 3 }
.timeline-content { width: 44%; background: var(--card-bg, white); border-radius: 12px; padding: 1.25rem; border: 1px solid var(--color-gray-light, #E9ECEF); box-shadow: 0 6px 20px rgba(16,24,40,0.04); }
[data-bs-theme="dark"] .timeline-content { background: var(--card-bg, #2d2d2d); border-color: rgba(255,255,255,0.04) }
.timeline-content h4 { margin-bottom: 0.5rem }

@media (max-width: 768px) {
  .timeline::before { left: 16px; }
  .timeline-item { display:block; padding-left: 40px }
  .timeline-year { position: absolute; left: 0; transform: none; width: 56px; height: 56px; margin-bottom: 0.75rem }
  .timeline-content { width: auto; margin-left: 72px; }
}

@media (min-width: 769px) {
  .timeline-item:nth-child(odd) .timeline-content { margin-left: 56px; margin-right: auto; }
  .timeline-item:nth-child(even) .timeline-content { margin-left: auto; margin-right: 56px; text-align: right; }
  .timeline-item:nth-child(odd) .timeline-year::after { content: ''; position: absolute; left: 50%; top: 50%; width: 28px; height: 2px; background: rgba(0,0,0,0.06); transform: translateX(36px); }
  .timeline-item:nth-child(even) .timeline-year::after { content: ''; position: absolute; left: 50%; top: 50%; width: 28px; height: 2px; background: rgba(0,0,0,0.06); transform: translateX(-64px); }
}

.hero-image { position: relative; height: 240px; display:flex; align-items:center; justify-content:center }
.floating-card { position: absolute; background: rgba(255,255,255,0.08); backdrop-filter: blur(8px); border-radius: 12px; padding: 1rem; text-align:center; width: 180px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
.floating-card.card-1 { top: 16px; right: 24px; transform: rotate(-3deg); }
.floating-card.card-2 { bottom: 12px; left: 24px; transform: rotate(2deg); }
.floating-card i { font-size: 1.5rem; color: #FFD700; margin-bottom: 0.4rem }

.hero-stats { display:flex; gap:1.75rem; margin-top: 0.5rem }
.stat-item { text-align:center }
.stat-number { font-size:1.6rem; font-weight:700; background: linear-gradient(135deg,#FFD700 0%,#FFA500 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent }
.stat-label { font-size:0.9rem; color: rgba(255,255,255,0.9) }

.mission-vision-section .card { border: none; box-shadow: 0 6px 24px rgba(16,24,40,0.06); border-radius: 12px }
.card-icon { width:56px; height:56px; display:flex; align-items:center; justify-content:center; border-radius:10px; background:linear-gradient(135deg,#a6b828 0%,#a6b828 100%); color:white; font-size:1.25rem }

.values-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap:1rem; }
.value-card { background: var(--card-bg, white); padding:1.2rem; border-radius:10px; text-align:center; border:1px solid rgba(0,0,0,0.04); display:flex; flex-direction:column; align-items:center; gap:0.5rem }

.accreditations-section { background: linear-gradient(135deg,#a6b828 0%, #a6b828 100%); color: white }
.accreditations-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:1.25rem; }
.accreditation-item { background: rgba(255,255,255,0.06); padding:1.6rem; border-radius:12px; text-align:center; transition: transform 0.25s ease, box-shadow 0.25s ease }
.accreditation-item:hover { transform: translateY(-6px); box-shadow: 0 18px 50px rgba(0,0,0,0.18) }
.accreditation-icon { width:64px; height:64px; border-radius:50%; background: rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-size:1.25rem }
.accreditation-item p { opacity: 0.9; margin-top: 0.5rem }

.areas-section .row > div { padding:1rem 0 }
.area-card { background: var(--card-bg, white); border-radius:10px; box-shadow: 0 6px 24px rgba(16,24,40,0.06); border:1px solid rgba(0,0,0,0.04) }
.area-card i { color: var(--color-primary, #a6b828) }

.cta-section { background: linear-gradient(135deg, rgba(166,184,40,0.06) 0%, rgba(166,184,40,0.03) 100%); }
.cta-title { font-family:'Playfair Display', serif; font-size:2rem }

.floating-card { transition: transform 0.6s cubic-bezier(0.2,0.9,0.2,1) }
.floating-card:hover { transform: translateY(-6px) }

@media (max-width: 992px) { .accreditations-grid { grid-template-columns: repeat(2,1fr); } .hero-title { font-size:2.2rem } }
@media (max-width: 576px) { .accreditations-grid { grid-template-columns: 1fr; } .hero-title{ font-size:1.6rem } .hero-stats{ flex-direction:row; gap:1rem } .hero-image{ height:200px } }
</style>
