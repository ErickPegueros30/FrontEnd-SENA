// --- Estilos globales ---
// El orden importa: primero las hojas globales, después los componentes.
// Así los <style scoped> de cada SFC siguen ganando por especificidad.
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'aos/dist/aos.css'
import './styles/tokens.css'
import './styles/components.css'
import './styles/modals.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import AOS from 'aos'
// Bootstrap JS for offcanvas, dropdowns, collapse, etc.
import 'bootstrap/dist/js/bootstrap.bundle'

// Importar Google Fonts (Playfair Display + DM Sans)
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

// Inicializar AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
})

createApp(App)
  .use(router)
  .mount('#app')

