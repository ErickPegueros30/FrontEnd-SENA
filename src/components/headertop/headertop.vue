<template>
  <div
    class="header-top"
    :class="{ 'hidden': isHeaderHidden }"
    id="headerTop"
  >
    <div class="header-container">
      <!-- Información de contacto -->
      <div class="header-info">
        <div class="info-item">
          <div class="info-icon">
            <i class="bi bi-telephone"></i>
          </div>
          <div class="info-text">
            <span class="info-label">Llámanos</span>
            <div class="phone-numbers">
              <a class="info-value phone" href="tel:+524421982279">+52 (442) 198 2279</a>
              <a class="info-value phone" href="tel:+524422241245">+52 (442) 224 1245</a>
            </div>
          </div>
        </div>

        <a href="mailto:info@ecotech.com" class="info-item hide-on-mobile">
          <div class="info-icon">
            <i class="bi bi-envelope"></i>
          </div>
          <div class="info-text">
            <span class="info-label">Email</span>
            <span class="info-value">ventas@senasc.mx</span>
          </div>
        </a>

        <div class="info-item hide-on-mobile">
          <div class="info-icon">
            <i class="bi bi-geo-alt"></i>
          </div>
          <div class="info-text">
            <span class="info-label">Dirección</span>
            <span class="info-value">Senda inmortal #24, Fracc. Milenio III  |  Santiago de Querétaro, Qro.</span>
          </div>
        </div>
      </div>

      <!-- Acciones del header -->
      <div class="header-actions">
        <!-- Toggle de tema -->
        <button class="theme-toggle" @click="$emit('toggle-theme')">
          <div class="theme-icon">
            <i class="bi bi-sun sun"></i>
            <i class="bi bi-moon moon"></i>
          </div>
          <span>{{ currentTheme === 'light' ? 'Modo Oscuro' : 'Modo Claro' }}</span>
        </button>

        <!-- Redes sociales
        <div class="social-links">
          <a href="#" class="social-link facebook" title="Facebook">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="#" class="social-link twitter" title="Twitter">
            <i class="bi bi-twitter"></i>
          </a>
          <a href="#" class="social-link instagram" title="Instagram">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="#" class="social-link linkedin" title="LinkedIn">
            <i class="bi bi-linkedin"></i>
          </a>
        </div> -->
          <!-- Redes sociales eliminadas para versión compacta -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface Props {
  currentTheme: 'light' | 'dark'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'toggle-theme': []
}>()

const isHeaderHidden: Ref<boolean> = ref(false)
let lastScrollTop = 0

const handleScroll = (): void => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollDirection = scrollTop > lastScrollTop

  if (scrollDirection && scrollTop > 100) {
    isHeaderHidden.value = true
  } else {
    isHeaderHidden.value = false
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Los estilos se mantienen igual que en la versión anterior */
.header-top {
  background: linear-gradient(135deg, #FFFFFF 0%, #F0F7F1 100%);
  border-bottom: 1px solid #E9ECEF;
  padding: 0.35rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: fadeInDown 0.45s ease-out;
}

[data-bs-theme="dark"] .header-top {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.06) 0%, rgba(166, 184, 40, 0.12) 100%);
  border-bottom: 1px solid #2D2D2D;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
}

.header-top.hidden {
  transform: translateY(-100%);
  opacity: 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 0.72rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  padding: 0.12rem 0.2rem;
}

.info-item + .info-item {
  border-left: 1px solid rgba(0,0,0,0.06);
  padding-left: 0.8rem;
  margin-left: 0.4rem;
}

[data-bs-theme="dark"] .info-item + .info-item {
  border-left-color: rgba(255,255,255,0.04);
}

[data-bs-theme="dark"] .info-item {
  color: #ADB5BD;
}

.info-item:hover {
  color: #a6b828;
  transform: translateY(-2px);
}

.info-icon {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a6b828;
  border: 1px solid rgba(166, 184, 40, 0.12);
  font-size: 0.8rem;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.58rem;
  color: #6C757D;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

[data-bs-theme="dark"] .info-label {
  color: #6C757D;
}

.info-value {
  font-weight: 500;
  font-size: 0.75rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.28rem 0.6rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%);
  border: 1px solid #E9ECEF;
  color: #212529;
  font-weight: 500;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .theme-toggle {
  border: 1px solid #2D2D2D;
  color: #F8F9FA;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.03) 0%, rgba(166, 184, 40, 0.02) 100%);
}

.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #a6b828;
}

.theme-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .theme-icon .sun {
  display: none;
}

[data-bs-theme="dark"] .theme-icon .moon {
  display: block;
}

[data-bs-theme="light"] .theme-icon .sun {
  display: block;
}

[data-bs-theme="light"] .theme-icon .moon {
  display: none;
}

.phone-numbers {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  margin-top: 1px;
  flex-direction: column;
}

@media (min-width: 992px) {
  .phone-numbers {
    flex-direction: row;
    gap: 0.4rem;
  }
}

.phone {
  color: inherit;
  text-decoration: none;
}

.phone:hover {
  text-decoration: underline;
}

[data-bs-theme="dark"] .social-link {
  background: #1E1E1E;
  border: 1px solid #2D2D2D;
}

.social-link:hover {
  background: #a6b828;
  color: white;
  transform: translateY(-3px);
  border-color: #a6b828;
  box-shadow: 0 6px 15px rgba(166, 184, 40, 0.2);
}

.social-link.facebook:hover { background: #1877F2; border-color: #1877F2; }
.social-link.twitter:hover { background: #1DA1F2; border-color: #1DA1F2; }
.social-link.instagram:hover { background: #E4405F; border-color: #E4405F; }
.social-link.linkedin:hover { background: #0A66C2; border-color: #0A66C2; }

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 991.98px) {
  /* Móvil: header compacto con solo teléfonos y botón de modo */
  .header-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.35rem 1rem;
  }

  /* ocultar elementos no deseados en móvil */
  .hide-on-mobile {
    display: none !important;
  }

  .header-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .phones-only .phone-numbers {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .header-actions {
    display: flex;
    align-items: center;
  }

  .theme-toggle {
    font-size: 0.7rem;
    padding: 0.22rem 0.45rem;
  }
}

/* Ocultar header-top en móviles: usamos el navbar para mostrar acciones móviles */
@media (max-width: 991.98px) {
  .header-top {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
  }
}
</style>
