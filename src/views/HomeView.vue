<template>
  <div class="demo-content">
    <h2 class="section-title">Toggle Claro/Oscuro Completo</h2>

    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="content-card">
          <h3 class="mb-4">Sistema Dual de Temas</h3>
          <p>Este diseño incluye <strong>ambos temas (claro y oscuro)</strong> con un toggle que cambia todo el diseño en tiempo real.</p>

          <div class="theme-demo">
            <h5 class="text-primary mb-3">🔄 Cambio de Tema en Tiempo Real</h5>
            <p class="mb-3">Puedes cambiar entre temas usando:</p>
            <ul>
              <li>El botón de toggle en el header superior ☀️/🌙</li>
              <li>El botón en el menú móvil</li>
              <li>El indicador flotante en la esquina inferior derecha</li>
            </ul>
          </div>

          <div class="row mt-4">
            <div class="col-md-6">
              <div class="d-flex align-items-start mb-3">
                <div class="icon-circle bg-success bg-opacity-10 p-2 rounded-circle me-3">
                  <i class="bi bi-sun text-warning"></i>
                </div>
                <div>
                  <h6 class="mb-1">Tema Claro</h6>
                  <p class="text-muted small mb-0">Perfecto para luz diurna y reducción de fatiga visual</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-start mb-3">
                <div class="icon-circle bg-success bg-opacity-10 p-2 rounded-circle me-3">
                  <i class="bi bi-moon text-primary"></i>
                </div>
                <div>
                  <h6 class="mb-1">Tema Oscuro</h6>
                  <p class="text-muted small mb-0">Ideal para uso nocturno y ahorro de batería</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-top">
            <h5 class="text-success mb-3">Controles de Demostración:</h5>
            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-outline-success" @click="toggleHeader">
                <i class="bi bi-eye-slash me-1"></i>Alternar Header
              </button>
              <button class="btn btn-outline-primary" @click="changeLanguage">
                <i class="bi bi-translate me-1"></i>Cambiar Idioma
              </button>
              <button class="btn btn-warning" @click="$emit('toggle-theme')">
                <i class="bi bi-arrow-left-right me-1"></i>Alternar Tema
              </button>
              <button class="btn btn-success" @click="showNotification">
                <i class="bi bi-bell me-1"></i>Notificación
              </button>
            </div>
          </div>
        </div>

        <div class="content-card mt-4">
          <h4 class="mb-3">Características del Sistema Dual</h4>
          <div class="row g-3">
            <div class="col-md-6">
              <div class="border rounded p-3 h-100">
                <h6 class="text-success"><i class="bi bi-palette2 me-2"></i>Variables CSS</h6>
                <p class="small mb-0">Usa variables CSS para cambiar todos los colores de manera eficiente.</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="border rounded p-3 h-100">
                <h6 class="text-success"><i class="bi bi-lightning me-2"></i>Cambio Instantáneo</h6>
                <p class="small mb-0">Transición suave sin recargar la página.</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="border rounded p-3 h-100">
                <h6 class="text-success"><i class="bi bi-device-ssd me-2"></i>Persistencia</h6>
                <p class="small mb-0">Recuerda tu preferencia entre sesiones.</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="border rounded p-3 h-100">
                <h6 class="text-success"><i class="bi bi-phone me-2"></i>Multiplataforma</h6>
                <p class="small mb-0">Funciona en desktop, tablet y móvil.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="content-card mt-4">
          <h4 class="mb-3">Comparativa de Temas</h4>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Característica</th>
                  <th class="text-center">🌞 Claro</th>
                  <th class="text-center">🌙 Oscuro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fondo Principal</td>
                  <td class="text-center">Blanco puro</td>
                  <td class="text-center">Negro profundo</td>
                </tr>
                <tr>
                  <td>Color de Texto</td>
                  <td class="text-center">Gris oscuro</td>
                  <td class="text-center">Blanco</td>
                </tr>
                <tr>
                  <td>Consumo de Batería</td>
                  <td class="text-center">Normal</td>
                  <td class="text-center">Reducido (OLED)</td>
                </tr>
                <tr>
                  <td>Uso Recomendado</td>
                  <td class="text-center">Día / Oficina</td>
                  <td class="text-center">Noche / Descanso</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Espacio adicional para probar scroll -->
    <div class="mt-5 pt-4 text-center">
      <p class="text-muted mb-2"><i class="bi bi-arrow-down me-1"></i> Desplázate para probar el efecto</p>
      <div class="scroll-indicator">
        <i class="bi bi-chevron-down fs-4 text-success"></i>
      </div>
    </div>
    <div style="height: 800px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface Props {
  currentTheme: 'light' | 'dark'
}

interface Emits {
  (e: 'toggle-theme'): void
  (e: 'show-notification', message: string, type?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isHeaderHidden: Ref<boolean> = ref(false)

// Funciones de demostración
const toggleHeader = (): void => {
  const headerTop = document.getElementById('headerTop')
  if (headerTop) {
    if (headerTop.classList.contains('hidden')) {
      headerTop.classList.remove('hidden')
      emit('show-notification', 'Header mostrado', 'success')
    } else {
      headerTop.classList.add('hidden')
      emit('show-notification', 'Header ocultado', 'info')
    }
  }
}

const changeLanguage = (): void => {
  const flags = [
    {src: 'https://flagcdn.com/w40/es.png', text: 'ES'},
    {src: 'https://flagcdn.com/w40/gb.png', text: 'EN'},
    {src: 'https://flagcdn.com/w40/fr.png', text: 'FR'}
  ]
  const randomFlag = flags[Math.floor(Math.random() * flags.length)]

  const selector = document.querySelector('.language-selector')
  if (selector) {
    const img = selector.querySelector('img')
    const textSpan = selector.querySelector('.language-text')

    if (img) img.setAttribute('src', randomFlag.src)
    if (textSpan) textSpan.textContent = randomFlag.text
  }

  const langNames: Record<string, string> = {
    'ES': 'Español',
    'EN': 'Inglés',
    'FR': 'Francés'
  }

  emit('show-notification', `Idioma cambiado a ${langNames[randomFlag.text]}`, 'info')
}

const showNotification = (): void => {
  const messages = [
    '¡Operación completada con éxito!',
    'Configuración guardada correctamente',
    'Mensaje enviado exitosamente',
    'Datos actualizados correctamente'
  ]
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]
  emit('show-notification', randomMessage, 'success')
}

// Animación del scroll indicator
let animationInterval: number | null = null

onMounted(() => {
  const scrollIndicator = document.querySelector('.scroll-indicator i')
  if (scrollIndicator) {
    animationInterval = setInterval(() => {
      scrollIndicator.setAttribute('style', 'transform: translateY(5px); transition: transform 0.5s;')
      setTimeout(() => {
        scrollIndicator.setAttribute('style', 'transform: translateY(0); transition: transform 0.5s;')
      }, 500)
    }, 1500)
  }
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})
</script>

<style scoped>
.demo-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
}

.content-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #E9ECEF;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

[data-bs-theme="dark"] .content-card {
  background: #121212;
  border: 1px solid #2D2D2D;
}

.content-card:hover {
  transform: translateY(-5px);
  border-color: #34B565;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.theme-demo {
  padding: 1.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
  border: 2px dashed #34B565;
  margin: 1.5rem 0;
}

[data-bs-theme="dark"] .theme-demo {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.icon-circle {
  background: rgba(25, 135, 84, 0.1);
}

[data-bs-theme="dark"] .icon-circle {
  background: rgba(25, 135, 84, 0.2);
}

.scroll-indicator {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}

@media (max-width: 768px) {
  .demo-content {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .content-card {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .content-card {
    padding: 1.25rem;
  }

  .section-title {
    font-size: 1.75rem;
  }
}
</style>
