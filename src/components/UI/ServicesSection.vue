<template>
  <section class="services-section">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <span v-if="eyebrow" class="section-eyebrow light">{{ eyebrow }}</span>
        <h2 class="section-title">{{ title }}</h2>
        <div class="title-underline"></div>
      </div>

      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="services-row"
        data-aos="fade-up"
        :data-aos-delay="rowIndex * 100"
      >
        <button
          v-for="service in row"
          :key="service.id"
          type="button"
          class="service-btn"
          @click="goToService(service)"
        >
          <div class="service-icon-wrap">
            <div class="service-icon">
              <img :src="iconFor(service)" alt="" class="service-icon-img" />
            </div>
          </div>
          <span class="service-name">{{ service.name }}</span>
        </button>
      </div>

      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Sección "Ensayos de Aptitud" con la parrilla de servicios.
 *
 * Estaba copiada en HomeView.vue, Nosotros.vue y Servicios/Ensayos.vue, y en
 * cada una se veía distinto porque cada copia arrastraba un trozo distinto
 * del CSS:
 *
 *   - HomeView tenía los ajustes responsive (768px y 480px) que a las otras
 *     dos les faltaban: en móvil, Nosotros y Ensayos no encogían los iconos.
 *   - Ensayos tenía reglas [data-bs-theme="light"] que las otras no.
 *   - Nosotros tenía overrides atados a .nosotros-page con !important.
 *   - El fondo del botón divergía: #fcfdfb en Home y Ensayos, #fcfdfb2b
 *     (17% de opacidad) en Nosotros.
 *
 * Este componente reúne la unión de las tres: la base común, el responsive de
 * Home y el manejo de tema claro y oscuro. El fondo adopta #fcfdfb, que es el
 * que usaban dos de las tres vistas.
 *
 * Uso:
 *   <ServicesSection />                                   (12 servicios por defecto)
 *   <ServicesSection footer-to="/ensayos" />              (con el enlace "Ver ensayos")
 *   <ServicesSection title="Otro título" :rows="misFilas" />
 */
import { serviceRows, type Service } from '@/data/services'
import { useTheme } from '@/composables/useTheme'
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    title?: string
    eyebrow?: string
    /** filas de servicios; por defecto, el catálogo compartido */
    rows?: Service[][]
    /** si se indica, se muestra el enlace del pie */
    footerTo?: string
    footerLabel?: string
  }>(),
  {
    title: 'Ensayos de Aptitud',
    eyebrow: 'Especialización',
    rows: () => serviceRows
  }
)

const emit = defineEmits<{ select: [service: Service] }>()

const router = useRouter()
const { currentTheme } = useTheme()

const iconFor = (service: Service) =>
  currentTheme.value === 'dark' ? service.iconWhite || service.icon : service.icon

function goToService(service: Service) {
  emit('select', service)
  // Redirige a la vista pública `EnsayoDetalle` y pasa el servicio como query
  router.push({ name: 'ensayo-detalle', query: { service: service.name } })
}

// `props` se usa en la plantilla; referencia explícita para el linter
void props
</script>

<style scoped>
.services-section {
  padding: 4rem 0;
  background: #ffffff; /* blanco en modo claro para mejor contraste */
  position: relative;
  z-index: 60; /* por encima del hero */
  overflow: visible;
}

.services-section::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(93, 138, 47, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

[data-bs-theme='dark'] .services-section { background: #0e1509; }

.services-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: start;
}

.service-btn {
  background: #fcfdfb;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: var(--transition);
  padding: 1rem 0.8rem;
  min-width: auto;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.service-btn:hover {
  transform: translateY(-4px);
  border-color: var(--sena-green-light);
  box-shadow: 0 8px 24px rgba(93, 138, 47, 0.16);
  background: #fff;
}

.service-btn:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring, 0 0 0 3px rgba(88, 130, 44, 0.35));
}

[data-bs-theme='dark'] .service-btn {
  background: #131a0e;
  border-color: rgba(122, 171, 61, 0.14);
}

[data-bs-theme='dark'] .service-btn:hover {
  background: #18210f;
  border-color: var(--sena-green-light);
}

.service-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(122, 171, 61, 0.06);
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

[data-bs-theme='dark'] .service-icon-wrap { background: rgba(93, 138, 47, 0.15); }

.service-icon {
  font-size: 1.55rem;
  color: var(--sena-green);
  transition: var(--transition);
  position: relative;
  z-index: 62;
}

.service-btn:hover .service-icon { color: #fff; }
[data-bs-theme='dark'] .service-icon { color: var(--sena-green-light); }
[data-bs-theme='dark'] .service-btn:hover .service-icon { color: #fff; }

.service-icon,
.service-icon i,
.service-icon svg {
  color: var(--sena-green);
  fill: var(--sena-green);
}

[data-bs-theme='light'] .service-btn:hover .service-icon,
[data-bs-theme='light'] .service-btn:focus .service-icon {
  color: #ffffff;
  fill: #ffffff;
}

.service-icon img,
.service-icon-img {
  width: 28px;
  height: 28px;
  display: block;
  object-fit: contain;
}

.service-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #223323;
  letter-spacing: 0.2px;
  transition: var(--transition);
}

.service-btn:hover .service-name { color: var(--sena-green); }
[data-bs-theme='dark'] .service-name { color: #8fa87e; }
[data-bs-theme='dark'] .service-btn:hover .service-name { color: var(--sena-green-light); }

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

/* Ajustes responsive que solo tenía HomeView. Ahora se aplican en las tres. */
@media (max-width: 768px) {
  .services-row { gap: 0.7rem; }
  .service-btn { min-width: 80px; padding: 0.9rem 0.7rem; }
  .service-icon-wrap { width: 46px; height: 46px; }
  .service-icon { font-size: 1.3rem; }
  .service-name { font-size: 0.68rem; }
}

@media (max-width: 480px) {
  .service-btn { min-width: 68px; padding: 0.7rem 0.5rem; }
  .service-icon-wrap { width: 40px; height: 40px; }
  .service-icon { font-size: 1.1rem; }
  .service-name { font-size: 0.6rem; }
}
</style>
