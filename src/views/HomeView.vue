<template>
  <div :data-bs-theme="currentTheme" class="inicio-page">

    <!-- Hero Section - Carrusel -->
    <section class="hero-section">
      <div class="hero-bg-wrapper" @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
        <transition name="fade-slide">
          <img :key="flayerIndex" :src="currentFlayer" alt="Flayer" class="hero-bg" />
        </transition>
        <div class="hero-overlay"></div>
        <button class="carousel-control prev" @click.prevent="prevFlayer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="carousel-control next" @click.prevent="nextFlayer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="carousel-indicators">
          <button
            v-for="(f, i) in flayers"
            :key="i"
            :class="['indicator', { active: i === flayerIndex }]"
            @click="goToFlayer(i)"
          ></button>
        </div>
      </div>
    </section>

    <!-- Texto institucional -->
    <section class="intro-text-section">
      <div class="container">
        <div class="intro-wrapper" data-aos="fade-up">
          <div class="intro-eyebrow">Desde 2011</div>
          <div class="intro-quote-mark">"</div>
          <p class="intro-text">
            <strong>SENA</strong> es el proveedor pionero de ensayos de aptitud en México acreditado bajo la norma <strong>ISO/IEC 17043</strong>
            y hemos cruzado fronteras en varios países. En <strong>SENA</strong> apoyamos a los laboratorios de ensayos y calibración para demostrar la competencia
            técnica y excelencia de su laboratorio a través de ensayos de aptitud y comparaciones interlaboratorio.
            Proporcionamos programas de ensayos con antelación, diseñados con estricto rigor de trazabilidad metrológica.
            <strong>15 años</strong> hemos liderado el sector y seguimos contando, transformamos la complejidad técnica en certeza, garantizando imparcialidad,
            confidencialidad y el cumplimiento normativo indispensable para proyectar la calidad de sus mediciones hacia los mercados globales.
          </p>
          <div class="intro-footer">
            <div class="intro-signature">
              <span class="signature-line"></span>
              <span class="signature-text">Excelencia SENA</span>
            </div>
            <div class="intro-actions">
              <router-link to="/contacto" class="btn contact-btn" @click.prevent="goToContact">
                Contactar ahora
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
              <div class="service-icon">
                <img :src="currentTheme === 'dark' ? (service.iconWhite || service.icon) : service.icon" alt="" class="service-icon-img" />
              </div>
            </div>
            <span class="service-name">{{ service.name }}</span>
          </button>
        </div>

        <div class="services-row" data-aos="fade-up" data-aos-delay="100">
          <button v-for="service in servicesRow2" :key="service.id" class="service-btn" @click="goToService(service.id)">
            <div class="service-icon-wrap">
              <div class="service-icon">
                <img :src="currentTheme === 'dark' ? (service.iconWhite || service.icon) : service.icon" alt="" class="service-icon-img" />
              </div>
            </div>
            <span class="service-name">{{ service.name }}</span>
          </button>
        </div>

        <div class="services-footer" data-aos="fade-up" data-aos-delay="200">
          <router-link to="/ensayos" class="contact-btn view-ensayos-btn">
            Ver ensayos
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Por qué elegirnos -->
    <section class="why-us-section py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
            <div class="why-us-image">
              <div class="image-overlay"></div>
              <div class="image-stats">
                <div class="stat-pill">
                  <span class="stat-number">15+</span>
                  <span class="stat-label">Años de experiencia</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-number">ISO</span>
                  <span class="stat-label">17043 Acreditado</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <span class="section-eyebrow light">Nuestra diferencia</span>
            <h2 class="section-title mb-4">¿Por qué elegir SENA?</h2>
            <div class="title-underline mb-4"></div>

            <div class="features-list">
              <div class="feature-item" v-for="feature in features" :key="feature.id">
                <div class="feature-icon">
                  <i :class="feature.icon"></i>
                </div>
                <div class="feature-content">
                  <h5>{{ feature.title }}</h5>
                  <p class="mb-0">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <div class="trust-badges mt-4">
              <div class="trust-badge">
                <i class="bi bi-shield-check"></i>
                <span>100% Confiable</span>
              </div>
              <div class="trust-badge">
                <i class="bi bi-clock-history"></i>
                <span>Entrega oportuna</span>
              </div>
              <div class="trust-badge">
                <i class="bi bi-headset"></i>
                <span>Soporte técnico</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Acreditaciones -->
    <section class="accreditations-section">
      <div class="accreditations-bg-pattern"></div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-4" data-aos="fade-right">
            <div class="accreditation-logo text-center">
              <img v-if="emaLogo" :src="emaLogo" alt="EMA" />
              <div v-else class="logo-placeholder">EMA</div>
            </div>
          </div>

          <div class="col-md-8" data-aos="fade-left">
            <div class="section-header" >
              <span class="section-eyebrow light">Reconocimientos</span>
              <h2 class="section-title text-white">Acreditaciones</h2>
              <div class="title-underline"></div>
              <p class="section-subtitle mt-2 text-white">Certificaciones que respaldan nuestro trabajo</p>
            </div>

            <div class="accreditations-wrapper mt-4">
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
    <FooterComponent :current-theme="currentTheme" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE } from '@/config/api'
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

interface Feature {
  id: number
  title: string
  description: string
  icon: string
}

interface Accreditation {
  id: number
  title: string
  description: string
  icon: string
}

const router = useRouter()
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

const servicesRow1: Service[] = [
  { id: 1, name: 'Agua', icon: new URL('../image/icons/Servicios/Black/Agua.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Agua-White.svg', import.meta.url).href, route: '/servicios/agua' },
  { id: 2, name: 'Alimentos', icon: new URL('../image/icons/Servicios/Black/Alimentos.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Alimentos-White.svg', import.meta.url).href, route: '/servicios/alimentos' },
  { id: 3, name: 'Masa', icon: new URL('../image/icons/Servicios/Black/Masa.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Masa-White.svg', import.meta.url).href, route: '/servicios/masa' },
  { id: 4, name: 'Temperatura', icon: new URL('../image/icons/Servicios/Black/Temperatura.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Temperatura-White.svg', import.meta.url).href, route: '/servicios/temperatura' },
  { id: 5, name: 'Presión', icon: new URL('../image/icons/Servicios/Black/Presion.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Presion-White.svg', import.meta.url).href, route: '/servicios/presion' },
  { id: 6, name: 'Volumen', icon: new URL('../image/icons/Servicios/Black/Volumen.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Volumen-White.svg', import.meta.url).href, route: '/servicios/volumen' }
]

const servicesRow2: Service[] = [
  { id: 7, name: 'Densidad', icon: new URL('../image/icons/Servicios/Black/Densidad.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Densidad-White.svg', import.meta.url).href, route: '/servicios/densidad' },
  { id: 8, name: 'Eléctrica', icon: new URL('../image/icons/Servicios/Black/Electrica.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Electrica-White.svg', import.meta.url).href, route: '/servicios/electrica' },
  { id: 9, name: 'Dimensional', icon: new URL('../image/icons/Servicios/Black/Dimensional.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Dimensional-White.svg', import.meta.url).href, route: '/servicios/dimensional' },
  { id: 10, name: 'Humedad', icon: new URL('../image/icons/Servicios/Black/Humedad.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Humedad-White.svg', import.meta.url).href, route: '/servicios/humedad' },
  { id: 11, name: 'Flujo', icon: new URL('../image/icons/Servicios/Black/Flujos.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Flujos-White.svg', import.meta.url).href, route: '/servicios/flujo' },
  { id: 12, name: 'Mediciones Especiales', icon: new URL('../image/icons/Servicios/Black/Especiales.svg', import.meta.url).href, iconWhite: new URL('../image/icons/Servicios/White/Especiales-White.svg', import.meta.url).href, route: '/servicios/mediciones-especiales' }
]

const goToService = (serviceId: number) => {
  const service = [...servicesRow1, ...servicesRow2].find(s => s.id === serviceId)
  if (service) {
    // Redirige a la vista pública `EnsayoDetalle` y pasa el servicio como query
    router.push({ name: 'ensayo-detalle', query: { service: service.name } })
  }
}

const goToContact = () => {
  try {
    router.push('/contacto')
  } catch (e) {
    window.location.href = '/contacto'
  }
}

const features: Feature[] = [
  { id: 1, title: 'Acreditación ISO/IEC 17043', description: 'Certificados bajo la norma internacional, reconocida mundialmente.', icon: 'bi bi-award-fill' },
  { id: 2, title: '15 Años de Experiencia', description: 'Pioneros en ensayos de aptitud en México y Latinoamérica.', icon: 'bi bi-clock-history' },
  { id: 3, title: 'Infraestructura de Vanguardia', description: 'Tecnología metrológica de última generación.', icon: 'bi bi-cpu-fill' },
  { id: 4, title: 'Trazabilidad Garantizada', description: 'Todas las mediciones trazables a patrones internacionales.', icon: 'bi bi-shield-check' },
  { id: 5, title: 'Equipo de Expertos', description: 'Especialistas altamente capacitados en cada disciplina.', icon: 'bi bi-people-fill' },
  { id: 6, title: 'Atención Personalizada', description: 'Soporte adaptado a las necesidades de su laboratorio.', icon: 'bi bi-headset' }
]

const accreditations: Accreditation[] = [
  { id: 1, title: 'ISO/IEC 17043:2023', description: 'Proveedor de ensayos de aptitud', icon: 'bi bi-file-earmark-check' },
  { id: 2, title: 'Reconocimiento EMA', description: 'Entidad Mexicana de Acreditación', icon: 'bi bi-building-check' }
]

import { ref as vueRef } from 'vue'
const flayers = vueRef<string[]>([])
const flayerIndex = ref(0)
const isPaused = ref(false)
let carouselTimer: number | null = null

const currentFlayer = computed(() => flayers.value[flayerIndex.value] || '')

const fetchCarrusel = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/paginas/home/carrusel`)
    if (!resp.ok) return
    const body = await resp.json()
    // Mantener las ubicaciones tal cual el backend las devuelve (pueden ser absolutas o protocol-relative)
    flayers.value = (body.data || []).map((i: any) => i.ubicacion)
  } catch (e) {
    console.error('fetchCarrusel error', e)
  }
}

const startCarousel = (interval = 5000) => {
  stopCarousel()
  carouselTimer = window.setInterval(() => {
    if (!isPaused.value && flayers.value.length > 1) {
      flayerIndex.value = (flayerIndex.value + 1) % flayers.value.length
    }
  }, interval)
}

const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

const pauseCarousel = () => { isPaused.value = true }
const resumeCarousel = () => { isPaused.value = false }
const nextFlayer = () => { flayerIndex.value = (flayerIndex.value + 1) % flayers.value.length }
const prevFlayer = () => { flayerIndex.value = (flayerIndex.value - 1 + flayers.value.length) % flayers.value.length }
const goToFlayer = (i: number) => { flayerIndex.value = i }

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  ;(async () => {
    await fetchCarrusel()
    // Forzar intervalo fijo de 5 segundos
    startCarousel(5000)
  })()
})

onUnmounted(() => {
  stopCarousel()
})
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

.inicio-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .inicio-page {
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
   HERO CAROUSEL
   ============================================================ */
.hero-section {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 41.67%;
  overflow: hidden;
  background: var(--sena-forest);
}

.hero-bg-wrapper {
  position: absolute;
  inset: 0;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  z-index: 1;
}

/* cross-fade transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
  position: absolute;
  inset: 0;
  z-index: 5; /* asegurar que el slide entrante quede encima del overlay */
}
.fade-slide-enter-from { opacity: 0; transform: scale(1.025); }
.fade-slide-leave-to   { opacity: 0; }
.fade-slide-enter-to,
.fade-slide-leave-from { opacity: 1; transform: scale(1); }

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
    rgba(10,20,6,0.08) 0%,
    rgba(10,20,6,0.0) 60%,
    rgba(10,20,6,0.28) 100%);
  pointer-events: none;
  z-index: 2;
  transition: background 0.36s ease, opacity 0.36s ease;
}

/* Reducir intensidad del overlay en modo claro para no ocultar la animación */
[data-bs-theme="light"] .hero-overlay {
  background: linear-gradient(to bottom,
    rgba(255,255,255,0.02) 0%,
    rgba(255,255,255,0.0) 60%,
    rgba(255,255,255,0.04) 100%);
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  color: white;
  border: 1px solid rgba(255,255,255,0.22);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: var(--transition);
}
.carousel-control svg { width: 18px; height: 18px; }
.carousel-control:hover {
  background: rgba(93,138,47,0.75);
  border-color: transparent;
  transform: translateY(-50%) scale(1.06);
}
.carousel-control.prev { left: 20px; }
.carousel-control.next { right: 20px; }

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 0; right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
}
.indicator {
  width: 32px; height: 3px;
  border-radius: 2px;
  background: rgba(255,255,255,0.35);
  border: none;
  cursor: pointer;
  transition: var(--transition);
}
.indicator.active {
  background: var(--sena-green-light);
  width: 52px;
}

@media (max-width: 768px) {
  .hero-section { padding-bottom: 56.25%; }
}

/* ============================================================
   INTRO TEXT
   ============================================================ */
.intro-text-section {
  padding: 4rem 0 3.5rem;
  background: #fafaf8;
}
[data-bs-theme="dark"] .intro-text-section { background: #0c0f0a; }

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

.intro-eyebrow {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  background: var(--sena-green-pale);
  padding: 0.28rem 0.9rem;
  border-radius: 20px;
  margin-bottom: 1.1rem;
}
[data-bs-theme="dark"] .intro-eyebrow { background: rgba(93,138,47,0.18); }

.intro-quote-mark {
  font-family: var(--font-display);
  font-size: 6rem;
  color: var(--sena-green-light);
  opacity: 0.12;
  position: absolute;
  top: 1rem;
  left: 2.25rem;
  line-height: 1;
  pointer-events: none;
}

.intro-text {
  font-size: 1rem;
  line-height: 1.75;
  color: #3a4a30;
  text-align: justify;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
}
[data-bs-theme="dark"] .intro-text { color: #c8d8be; }

.intro-text strong {
  color: var(--sena-green);
  font-weight: 600;
}
[data-bs-theme="dark"] .intro-text strong { color: var(--sena-green-light); }

.intro-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--sena-border);
  flex-wrap: wrap;
  gap: 1rem;
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

/* Mejor contraste y tamaño para la línea de firma en tema claro */
.inicio-page[data-bs-theme="light"] .signature-line {
  background: linear-gradient(90deg, #2f5a19 0%, #4a7b22 100%);
  height: 3px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
}
.signature-text {
  font-size: 0.7rem;
  color: var(--sena-green);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
}

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
.btn-arrow {
  width: 16px; height: 16px;
  transition: transform 0.22s ease;
}
.contact-btn:hover .btn-arrow { transform: translateX(3px); }

/* Forzar color del SVG y mejor contraste en modo claro */
.contact-btn svg, .contact-btn .btn-arrow {
  stroke: currentColor !important;
  fill: none !important;
}

/* Refuerzo específico para tema claro por si hay superposición del hero */
.inicio-page[data-bs-theme="light"] .contact-btn {
  color: #ffffff !important;
  background: linear-gradient(180deg, #3f6b1f 0%, #5d8a2f 100%) !important;
  box-shadow: 0 12px 44px rgba(37, 59, 21, 0.18);
  border: 1px solid rgba(0,0,0,0.08);
  z-index: 90;
}

.inicio-page[data-bs-theme="light"] .contact-btn:focus {
  outline: 3px solid rgba(122,171,61,0.16);
  outline-offset: 2px;
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
   WHY US
   ============================================================ */
.why-us-section {
  background: #fafaf8;
}
[data-bs-theme="dark"] .why-us-section { background: #0c0f0a; }

.why-us-image {
  height: 520px;
  border-radius: 20px;
  background:
    linear-gradient(rgba(10,22,6,0.45), rgba(10,22,6,0.45)),
    url('../image/Home/elegirSena.png');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}
.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(93,138,47,0.12) 0%,
    transparent 60%,
    rgba(10,22,6,0.3) 100%);
  border-radius: 20px;
}
.image-stats {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 0.75rem;
}
.stat-pill {
  flex: 1;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  text-align: center;
}
.stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}
.stat-label {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.5px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: var(--transition);
  border: 1px solid transparent;
}
.feature-item:hover {
  background: var(--sena-green-pale);
  border-color: var(--sena-border);
}
[data-bs-theme="dark"] .feature-item:hover {
  background: rgba(93,138,47,0.1);
  border-color: rgba(122,171,61,0.14);
}

.feature-icon {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* Overrides para asegurar iconos visibles en 'Por qué elegirnos' (modo claro) */
.inicio-page[data-bs-theme="light"] .why-us-section .feature-icon {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light)) !important;
  color: var(--sena-text) !important;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06) !important;
  border: 1px solid rgba(0,0,0,0.06) !important;
}
.inicio-page[data-bs-theme="light"] .why-us-section .feature-icon > i[class^="bi"],
.inicio-page[data-bs-theme="light"] .why-us-section .feature-icon > i[class*="bi-"] {
  display: inline-block !important;
  color: var(--sena-text) !important;
  fill: currentColor !important;
  stroke: currentColor !important;
  font-size: 1.3rem !important;
  -webkit-font-smoothing: antialiased !important;
  text-rendering: optimizeLegibility !important;
}
.inicio-page[data-bs-theme="light"] .why-us-section .feature-icon > i::before {
  color: var(--sena-text) !important;
}

.feature-content h5 {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 0.22rem;
}
[data-bs-theme="dark"] .feature-content h5 { color: #e0ecd6; }
.feature-content p {
  color: var(--sena-muted);
  font-size: 0.82rem;
  margin: 0;
  line-height: 1.5;
}

.trust-badges {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.trust-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: var(--sena-green-pale);
  border-radius: 50px;
  border: 1px solid var(--sena-border);
  color: var(--sena-green);
  font-weight: 500;
  font-size: 0.78rem;
  transition: var(--transition);
}
.trust-badge:hover {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: white;
  border-color: transparent;
}
[data-bs-theme="dark"] .trust-badge {
  background: rgba(93,138,47,0.12);
  border-color: rgba(122,171,61,0.18);
  color: var(--sena-green-light);
}

/* Evitar efecto de "desaparición" al hacer hover: forzar color y sombra en modo claro */
.inicio-page[data-bs-theme="light"] .trust-badge:hover {
  color: #ffffff !important;
}
.inicio-page[data-bs-theme="light"] .trust-badge:hover i,
.inicio-page[data-bs-theme="light"] .trust-badge:hover span {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.22) !important;
}
.inicio-page[data-bs-theme="light"] .trust-badge i {
  fill: currentColor !important;
  stroke: currentColor !important;
}

/* Más fuerza: forzar color y visibilidad incluso si AOS o animaciones añaden reglas */
.inicio-page[data-bs-theme="light"] .trust-badges .trust-badge i[class^="bi"],
.inicio-page[data-bs-theme="light"] .trust-badges .trust-badge i[class*="bi-"] {
  color: currentColor !important;
  opacity: 1 !important;
  -webkit-font-smoothing: antialiased !important;
  text-rendering: optimizeLegibility !important;
}
.inicio-page[data-bs-theme="light"] .trust-badges .trust-badge i::before {
  color: currentColor !important;
  opacity: 1 !important;
}
.inicio-page[data-bs-theme="light"] .trust-badges .trust-badge.aos-animate,
.inicio-page[data-bs-theme="light"] .trust-badges .trust-badge.aos-animate * {
  opacity: 1 !important;
  color: inherit !important;
}
.inicio-page[data-bs-theme="light"] .trust-badges .trust-badge:hover i,
.inicio-page[data-bs-theme="light"] .trust-badges .trust-badge:hover i::before,
.inicio-page[data-bs-theme="light"] .trust-badges .trust-badge:hover span {
  color: #ffffff !important;
  opacity: 1 !important;
}

/* Desactivar animaciones y cambios visuales en modo claro: mantener estado estático */
.inicio-page[data-bs-theme="light"] .trust-badge {
  transition: none !important;
  transform: none !important;
}
.inicio-page[data-bs-theme="light"] .trust-badge:hover {
  background: var(--sena-green-pale) !important;
  color: var(--sena-green) !important;
  box-shadow: none !important;
}
.inicio-page[data-bs-theme="light"] .trust-badge i,
.inicio-page[data-bs-theme="light"] .trust-badge span {
  color: var(--sena-green) !important;
  opacity: 1 !important;
  text-shadow: none !important;
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
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .section-title { font-size: 1.9rem; }
  .intro-wrapper { padding: 1.75rem 1.5rem; }
  .intro-quote-mark { font-size: 3.5rem; }
  .services-row { gap: 0.7rem; }
  .service-btn { min-width: 80px; padding: 0.9rem 0.7rem; }
  .service-icon-wrap { width: 46px; height: 46px; }
  .service-icon { font-size: 1.3rem; }
  .service-name { font-size: 0.68rem; }
  .accreditations-wrapper { flex-direction: column; }
  .accreditation-badge { width: 100%; }
  .why-us-image { height: 300px; }
  .image-stats { flex-direction: row; }
}
/* Acreditaciones footer button */
.accreditations-footer {
  margin-top: 1rem;
  text-align: center;
}
.accreditations-footer .view-accreditaciones-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
}
@media (max-width: 768px) {
  .accreditations-footer { text-align: center; }
}
@media (max-width: 480px) {
  .service-btn { min-width: 68px; padding: 0.7rem 0.5rem; }
  .service-icon-wrap { width: 40px; height: 40px; }
  .service-icon { font-size: 1.1rem; }
  .service-name { font-size: 0.6rem; }
  .trust-badges { gap: 0.4rem; }
}
</style>
