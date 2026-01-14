<template>
  <footer class="footer-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="brand-section">
            <div class="brand-logo">
              <i class="bi bi-microscope text-white fs-4"></i>
            </div>
            <div class="brand-text">
              <h1 class="brand-name">SENA</h1>
              <p class="brand-tagline">Laboratorios Acreditados</p>
            </div>
          </div>
          <p class="mt-3 footer-description">
            Más de 12 años proporcionando ensayos de aptitud confiables y servicios
            de análisis de calidad con estándares internacionales.
          </p>
        </div>

        <div class="col-lg-4 mb-4">
          <h5 class="footer-heading mb-4">Contacto</h5>
          <div class="d-flex flex-column gap-3">
            <div class="footer-contact-item">
              <i class="bi bi-geo-alt text-primary"></i>
              <span class="footer-contact-text">Dirección de nuestras instalaciones</span>
            </div>
            <div class="footer-contact-item">
              <i class="bi bi-telephone text-primary"></i>
              <span class="footer-contact-text">+1 (234) 567-890</span>
            </div>
            <div class="footer-contact-item">
              <i class="bi bi-envelope text-primary"></i>
              <span class="footer-contact-text">info@sena.com</span>
            </div>
          </div>
        </div>

        <div class="col-lg-4 mb-4">
          <h5 class="footer-heading mb-4">Enlaces Rápidos</h5>
          <div class="d-flex flex-column gap-2">
            <router-link to="/nosotros" class="footer-link">Quiénes Somos</router-link>
            <router-link to="/servicios" class="footer-link">Nuestros Servicios</router-link>
            <router-link to="/acreditaciones" class="footer-link">Acreditaciones</router-link>
            <router-link to="/contacto" class="footer-link">Contacto</router-link>
          </div>
        </div>
      </div>

      <hr class="footer-divider">

      <div class="row">
        <div class="col-md-6">
          <p class="footer-copyright">
            © {{ currentYear }} SENA Laboratorios. Todos los derechos reservados.
          </p>
        </div>
        <div class="col-md-6 text-md-end">
          <p class="footer-accreditation">
            Acreditado bajo ISO/IEC 17043:2010
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  currentTheme: 'light' | 'dark'
}

const props = defineProps<Props>()

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer-section {
  background: var(--color-light, #212529);
  color: var(--color-dark, #F8F9FA);
  padding: 3rem 0;
  margin-top: 3rem;
}

[data-bs-theme="dark"] .footer-section {
  background: var(--color-light, #121212);
  color: var(--color-dark, #F8F9FA);
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.brand-logo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--color-gray, #ADB5BD);
  letter-spacing: 1px;
  margin: 0;
  text-transform: uppercase;
  font-weight: 500;
}

.footer-description {
  color: var(--color-gray, #ADB5BD);
  font-size: 0.9rem;
}

.footer-heading {
  color: var(--color-dark, #F8F9FA);
  font-weight: 600;
}

.footer-contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-contact-text {
  color: var(--color-gray, #ADB5BD);
}

.footer-link {
  color: var(--color-gray, #ADB5BD);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: var(--color-primary, #1E9E4A);
}

.footer-divider {
  border-color: var(--color-gray-light, #495057);
  margin: 2rem 0;
  opacity: 0.5;
}

.footer-copyright,
.footer-accreditation {
  color: var(--color-gray, #ADB5BD);
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-section {
    padding: 2rem 0;
  }

  .brand-name {
    font-size: 1.25rem;
  }

  .footer-copyright,
  .footer-accreditation {
    text-align: center !important;
    margin-bottom: 0.5rem;
  }
}
</style>
