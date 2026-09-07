// ============================================================================
//  Rutas para las 3 vistas de Ensayos
//  Agrega estos objetos al array `routes` de tu router (src/router/index.ts)
//  Ajusta las rutas de import (@/views/...) según dónde guardes los .vue
// ============================================================================

const ensayosRoutes = [
  {
    // VISTA 2 — Detalle de un ensayo (código, datos, PDFs e integrantes)
    path: '/admin/ensayos/:id',
    name: 'admin-ensayo-detalle',
    component: () => import('@/views/Administrador/Servicios/Ensayos/EnsayoDetalle.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Detalle del Ensayo' }
  },
  {
    // VISTA 3 — Detalle de un integrante (documentos que va subiendo)
    path: '/admin/ensayos/:ensayoId/integrantes/:integranteId',
    name: 'admin-integrante-detalle',
    component: () => import('@/views/Administrador/Servicios/Ensayos/IntegranteDetalle.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Documentos del Integrante' }
  }
]

export default ensayosRoutes

// ---------------------------------------------------------------------------
// Ejemplo de integración en src/router/index.ts:
//
// import { createRouter, createWebHistory } from 'vue-router'
// import ensayosRoutes from './rutas-ensayos'
//
// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     // ...tus otras rutas
//     ...ensayosRoutes
//   ]
// })
//
// export default router
// ---------------------------------------------------------------------------
