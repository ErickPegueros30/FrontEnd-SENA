import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Nosotros from '@/views/Nosotrros/Nosotros.vue'
import Servicios from '@/views/Servicios.vue'
import Contacto from '@/views/Contacto.vue'

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
    }
  ],
})

export default router
