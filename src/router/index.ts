import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Nosotros from '@/views/Nosotrros/Nosotros.vue'
import Servicios from '@/views/Servicios.vue'
import Contacto from '@/views/Contacto.vue'
import Login from '@/components/Login/Login.vue'

// Imports de las vistas de servicios
import Ensayos from '@/views/Servicios/Ensayos.vue'
import Interlaboratorio from '@/views/Servicios/Interlaboratorio.vue'
import Cursos from '@/views/Servicios/Cursos.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/nosotros',
      name: 'nosotros',
      component: Nosotros,
    }
    ,
    {
      path: '/servicios',
      name: 'servicios',
      component: Servicios,
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: Contacto,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },

    // Rutas de Servicios
    {
      path: '/ensayos',
      name: 'ensayos',
      component: Ensayos,
    },
    {
      path: '/interlaboratorio',
      name: 'interlaboratorio',
      component: Interlaboratorio,
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: Cursos,
    }
  ],
})

export default router
