import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'aos/dist/aos.css'
import AOS from 'aos'
// Bootstrap JS for offcanvas, dropdowns, collapse, etc.
import 'bootstrap/dist/js/bootstrap.bundle'

// Importar Google Fonts
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'
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

