<template>
  <div :data-bs-theme="currentTheme" class="blog-page">
    <!-- Hero Section del Blog -->
    <section class="blog-hero">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <router-link to="/">Inicio</router-link>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">Blog</li>
                </ol>
              </nav>
              
              <h1 class="hero-title">Blog de Metrología y Calidad</h1>
              <p class="hero-subtitle">
                Artículos técnicos, noticias y recursos sobre ensayos de aptitud, 
                metrología, normativas de calidad y mejores prácticas en laboratorios.
              </p>
              
              <div class="search-bar">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control"
                    placeholder="Buscar artículos..."
                    @keyup.enter="performSearch"
                  >
                  <button class="btn btn-primary" @click="performSearch">
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-stats">
              <div class="stat-card">
                <i class="bi bi-file-text"></i>
                <div>
                  <h3>{{ totalArticles }}</h3>
                  <p>Artículos publicados</p>
                </div>
              </div>
              <div class="stat-card">
                <i class="bi bi-tags"></i>
                <div>
                  <h3>{{ categories.length }}</h3>
                  <p>Categorías</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="blog-main">
      <div class="container">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-lg-4" data-aos="fade-right">
            <aside class="blog-sidebar">
              <!-- Categories -->
              <div class="sidebar-widget">
                <h3 class="widget-title">
                  <i class="bi bi-tags me-2"></i>Categorías
                </h3>
                <div class="categories-list">
                  <button
                    v-for="category in categories"
                    :key="category.id"
                    class="category-item"
                    :class="{ 'active': activeCategory === category.id }"
                    @click="filterByCategory(category.id)"
                  >
                    <span class="category-name">{{ category.name }}</span>
                    <span class="category-count">{{ category.count }}</span>
                  </button>
                  <button
                    class="category-item"
                    :class="{ 'active': activeCategory === 'all' }"
                    @click="filterByCategory('all')"
                  >
                    <span class="category-name">Todos los artículos</span>
                    <span class="category-count">{{ totalArticles }}</span>
                  </button>
                </div>
              </div>

              <!-- Featured Articles -->
              <div class="sidebar-widget">
                <h3 class="widget-title">
                  <i class="bi bi-star me-2"></i>Destacados
                </h3>
                <div class="featured-articles">
                  <article
                    v-for="article in featuredArticles"
                    :key="article.id"
                    class="featured-article"
                    @click="viewArticle(article)"
                  >
                    <div class="featured-image">
                      <img :src="article.image" :alt="article.title" />
                    </div>
                    <div class="featured-content">
                      <h5 class="featured-title">{{ article.title }}</h5>
                      <div class="article-meta">
                        <span class="date">
                          <i class="bi bi-calendar"></i>
                          {{ formatDate(article.publishedAt) }}
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>

              <!-- Tags -->
              <div class="sidebar-widget">
                <h3 class="widget-title">
                  <i class="bi bi-hash me-2"></i>Etiquetas
                </h3>
                <div class="tags-cloud">
                  <span
                    v-for="tag in popularTags"
                    :key="tag"
                    class="tag"
                    :class="{ 'active': activeTag === tag }"
                    @click="filterByTag(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Newsletter -->
              <div class="sidebar-widget newsletter-widget">
                <div class="newsletter-content">
                  <i class="bi bi-envelope-paper"></i>
                  <h4>Suscríbete al newsletter</h4>
                  <p>Recibe los últimos artículos y novedades en tu correo</p>
                  <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
                    <input
                      v-model="newsletterEmail"
                      type="email"
                      class="form-control"
                      placeholder="Tu correo electrónico"
                      required
                    />
                    <button type="submit" class="btn btn-primary w-100 mt-2">
                      Suscribirme
                    </button>
                  </form>
                  <small class="text-muted">
                    Sin spam. Puedes darte de baja en cualquier momento.
                  </small>
                </div>
              </div>

              <!-- Social Media -->
              <div class="sidebar-widget">
                <h3 class="widget-title">
                  <i class="bi bi-share me-2"></i>Síguenos
                </h3>
                <div class="social-widget">
                  <a href="#" class="social-link linkedin">
                    <i class="bi bi-linkedin"></i>
                    <span>LinkedIn</span>
                  </a>
                  <a href="#" class="social-link twitter">
                    <i class="bi bi-twitter"></i>
                    <span>Twitter</span>
                  </a>
                  <a href="#" class="social-link youtube">
                    <i class="bi bi-youtube"></i>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>

          <!-- Articles Grid -->
          <div class="col-lg-8" data-aos="fade-left">
            <!-- Filter Bar -->
            <div class="filter-bar mb-4">
              <div class="d-flex flex-wrap justify-content-between align-items-center">
                <div class="filter-info">
                  <h4 class="mb-0">Artículos Recientes</h4>
                  <small class="text-muted">
                    {{ filteredArticles.length }} artículos encontrados
                  </small>
                </div>
                <div class="filter-controls">
                  <select v-model="sortBy" class="form-select form-select-sm">
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="popular">Más populares</option>
                  </select>
                </div>
              </div>
              
              <!-- Active Filters -->
              <div v-if="activeFilters.length > 0" class="active-filters mt-3">
                <span class="filter-label">Filtros activos:</span>
                <div class="filters-list">
                  <span
                    v-for="filter in activeFilters"
                    :key="filter"
                    class="badge bg-primary"
                  >
                    {{ filter }}
                    <button @click="removeFilter(filter)" class="btn-close-filter">
                      <i class="bi bi-x"></i>
                    </button>
                  </span>
                  <button @click="clearFilters" class="btn-clear-filters">
                    Limpiar todos
                  </button>
                </div>
              </div>
            </div>

            <!-- Articles Grid -->
            <div v-if="filteredArticles.length > 0" class="articles-grid">
              <div
                v-for="article in paginatedArticles"
                :key="article.id"
                class="article-card"
                :class="{ 'featured': article.featured }"
                @click="viewArticle(article)"
              >
                <!-- Featured Badge -->
                <div v-if="article.featured" class="featured-badge">
                  <i class="bi bi-star-fill"></i> Destacado
                </div>
                
                <!-- Article Image -->
                <div class="article-image">
                  <img :src="article.image" :alt="article.title" />
                  <div class="image-overlay"></div>
                  <div class="article-category">
                    {{ getCategoryName(article.categoryId) }}
                  </div>
                </div>
                
                <!-- Article Content -->
                <div class="article-content">
                  <div class="article-meta">
                    <span class="author">
                      <i class="bi bi-person"></i>
                      {{ article.author }}
                    </span>
                    <span class="date">
                      <i class="bi bi-calendar"></i>
                      {{ formatDate(article.publishedAt) }}
                    </span>
                    <span class="reading-time">
                      <i class="bi bi-clock"></i>
                      {{ article.readingTime }} min
                    </span>
                  </div>
                  
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-excerpt">{{ article.excerpt }}</p>
                  
                  <div class="article-footer">
                    <div class="article-tags">
                      <span
                        v-for="tag in article.tags.slice(0, 3)"
                        :key="tag"
                        class="tag"
                        @click.stop="filterByTag(tag)"
                      >
                        {{ tag }}
                      </span>
                      <span v-if="article.tags.length > 3" class="tag-more">
                        +{{ article.tags.length - 3 }}
                      </span>
                    </div>
                    
                    <div class="article-stats">
                      <span class="stat">
                        <i class="bi bi-eye"></i>
                        {{ article.views }}
                      </span>
                      <span class="stat">
                        <i class="bi bi-chat"></i>
                        {{ article.comments }}
                      </span>
                      <span class="stat">
                        <i class="bi bi-heart"></i>
                        {{ article.likes }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div v-else class="no-results text-center py-5">
              <i class="bi bi-search display-1 text-muted mb-4"></i>
              <h3>No se encontraron artículos</h3>
              <p class="text-muted">
                Intenta con otros términos de búsqueda o filtra por otra categoría.
              </p>
              <button @click="clearFilters" class="btn btn-primary">
                Ver todos los artículos
              </button>
            </div>

            <!-- Pagination -->
            <div v-if="filteredArticles.length > itemsPerPage" class="pagination-container">
              <nav aria-label="Paginación de artículos">
                <ul class="pagination justify-content-center">
                  <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  <li
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ 'active': page === currentPage }"
                  >
                    <button class="page-link" @click="changePage(page)">
                      {{ page }}
                    </button>
                  </li>
                  
                  <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
              
              <div class="pagination-info text-center text-muted mt-2">
                Mostrando {{ startItem }}-{{ endItem }} de {{ filteredArticles.length }} artículos
              </div>
            </div>

            <!-- CTA Section -->
            <div class="blog-cta mt-5">
              <div class="cta-content text-center">
                <i class="bi bi-pencil-square display-1 text-primary mb-4"></i>
                <h3>¿Quieres contribuir con un artículo?</h3>
                <p class="mb-4">
                  Si eres experto en metrología, calidad o análisis de laboratorio, 
                  considera escribir para nuestro blog y compartir tu conocimiento.
                </p>
                <button class="btn btn-outline-primary">
                  <i class="bi bi-envelope me-2"></i>Contactar al editor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <FooterComponent :current-theme="currentTheme" />

    <!-- Toast para notificaciones -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div 
        id="blogToast" 
        class="toast" 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        ref="toastEl"
      >
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto">
            <i :class="toastIcon"></i> Notificación
          </strong>
          <small>Ahora mismo</small>
          <button 
            type="button" 
            class="btn-close" 
            :class="toastType === 'success' ? 'btn-close-white' : ''"
            data-bs-dismiss="toast" 
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body bg-body border border-opacity-25 rounded-bottom" :class="`border-${toastType}`">
          <div class="d-flex align-items-center">
            <i :class="toastBodyIcon" class="fs-5 me-2"></i>
            <span>{{ toastMessage }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import type { Toast } from 'bootstrap'

// Tipos
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning'

interface Category {
  id: number
  name: string
  description: string
  count: number
  icon: string
}

interface Article {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  categoryId: number
  author: string
  authorAvatar: string
  authorTitle: string
  publishedAt: string
  readingTime: number
  views: number
  comments: number
  likes: number
  tags: string[]
  featured: boolean
}

type SortOption = 'newest' | 'oldest' | 'popular'

// Router
const router = useRouter()

// Estado del tema
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Estado del blog
const searchQuery = ref('')
const activeCategory = ref<number | 'all'>('all')
const activeTag = ref<string | null>(null)
const sortBy = ref<SortOption>('newest')
const currentPage = ref(1)
const itemsPerPage = 6
const newsletterEmail = ref('')

// Datos del blog
const categories: Category[] = [
  { id: 1, name: 'Metrología', description: 'Medición y calibración', count: 12, icon: 'bi-rulers' },
  { id: 2, name: 'Calidad', description: 'Normas y estándares', count: 8, icon: 'bi-award' },
  { id: 3, name: 'Laboratorio', description: 'Prácticas y técnicas', count: 15, icon: 'bi-microscope' },
  { id: 4, name: 'Acreditación', description: 'Certificaciones', count: 6, icon: 'bi-file-earmark-check' },
  { id: 5, name: 'Normativas', description: 'Regulaciones y leyes', count: 7, icon: 'bi-journal-text' },
  { id: 6, name: 'Tecnología', description: 'Innovación en laboratorios', count: 9, icon: 'bi-cpu' }
]

const articles: Article[] = [
  {
    id: 1,
    title: 'ISO/IEC 17025:2017 - Guía completa de implementación',
    excerpt: 'Descubre los pasos clave para implementar exitosamente la norma ISO/IEC 17025:2017 en tu laboratorio y asegurar la acreditación.',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 4,
    author: 'Dr. Alejandro Torres',
    authorAvatar: 'AT',
    authorTitle: 'Consultor en Acreditación',
    publishedAt: '2024-01-15',
    readingTime: 8,
    views: 1250,
    comments: 24,
    likes: 89,
    tags: ['ISO17025', 'Acreditación', 'Calidad', 'Laboratorio'],
    featured: true
  },
  {
    id: 2,
    title: 'Mejores prácticas en calibración de instrumentos de medición',
    excerpt: 'Consejos prácticos y técnicas avanzadas para garantizar la precisión en la calibración de tus equipos de medición.',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 1,
    author: 'Ing. María Fernández',
    authorAvatar: 'MF',
    authorTitle: 'Especialista en Metrología',
    publishedAt: '2024-01-10',
    readingTime: 6,
    views: 980,
    comments: 18,
    likes: 67,
    tags: ['Calibración', 'Metrología', 'Precisión', 'Instrumentación'],
    featured: false
  },
  {
    id: 3,
    title: 'Control estadístico de procesos en laboratorios químicos',
    excerpt: 'Aprende a aplicar técnicas de control estadístico para mejorar la confiabilidad de tus análisis químicos.',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 3,
    author: 'Mtra. Laura Gómez',
    authorAvatar: 'LG',
    authorTitle: 'Estadística Aplicada',
    publishedAt: '2024-01-05',
    readingTime: 10,
    views: 1540,
    comments: 32,
    likes: 112,
    tags: ['Estadística', 'Control de Calidad', 'Química', 'Análisis'],
    featured: true
  },
  {
    id: 4,
    title: 'Implementación de sistemas LIMS en laboratorios modernos',
    excerpt: 'Guía para seleccionar e implementar sistemas de gestión de información de laboratorio (LIMS).',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 6,
    author: 'Ing. Carlos Ruiz',
    authorAvatar: 'CR',
    authorTitle: 'Especialista en TI',
    publishedAt: '2023-12-20',
    readingTime: 7,
    views: 890,
    comments: 15,
    likes: 54,
    tags: ['LIMS', 'Tecnología', 'Digitalización', 'Gestión'],
    featured: false
  },
  {
    id: 5,
    title: 'Requisitos de la EMA para laboratorios de ensayos',
    excerpt: 'Todo lo que necesitas saber sobre los requisitos de la Entidad Mexicana de Acreditación.',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 4,
    author: 'Lic. Ana Vargas',
    authorAvatar: 'AV',
    authorTitle: 'Consultora EMA',
    publishedAt: '2023-12-15',
    readingTime: 9,
    views: 1120,
    comments: 21,
    likes: 78,
    tags: ['EMA', 'Acreditación', 'México', 'Regulaciones'],
    featured: false
  },
  {
    id: 6,
    title: 'Gestión de incertidumbre en mediciones químicas',
    excerpt: 'Metodologías para calcular y reportar incertidumbre en análisis químicos según la guía GUM.',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 1,
    author: 'Dr. Roberto Sánchez',
    authorAvatar: 'RS',
    authorTitle: 'Físico Químico',
    publishedAt: '2023-12-10',
    readingTime: 11,
    views: 1350,
    comments: 28,
    likes: 95,
    tags: ['Incertidumbre', 'GUM', 'Metrología', 'Química'],
    featured: true
  },
  {
    id: 7,
    title: 'ISO 9001 vs ISO/IEC 17025: Diferencias clave',
    excerpt: 'Comparativa detallada entre los sistemas de gestión de calidad para empresas y laboratorios.',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 2,
    author: 'Ing. Jorge Mendoza',
    authorAvatar: 'JM',
    authorTitle: 'Consultor en Calidad',
    publishedAt: '2023-12-05',
    readingTime: 8,
    views: 1020,
    comments: 19,
    likes: 71,
    tags: ['ISO9001', 'ISO17025', 'Comparativa', 'Gestión'],
    featured: false
  },
  {
    id: 8,
    title: 'Validación de métodos analíticos según ICH Q2(R1)',
    excerpt: 'Guía práctica para la validación de métodos analíticos en la industria farmacéutica.',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 3,
    author: 'QFB. Patricia López',
    authorAvatar: 'PL',
    authorTitle: 'Validación Analítica',
    publishedAt: '2023-11-30',
    readingTime: 9,
    views: 980,
    comments: 17,
    likes: 63,
    tags: ['Validación', 'ICH', 'Farmacéutica', 'Métodos'],
    featured: false
  },
  {
    id: 9,
    title: 'Trazabilidad metrológica: Conceptos fundamentales',
    excerpt: 'Comprende la importancia de la trazabilidad en las mediciones y su impacto en los resultados.',
    content: 'Contenido completo del artículo...',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    categoryId: 1,
    author: 'Dr. Miguel Ángel Cruz',
    authorAvatar: 'MAC',
    authorTitle: 'Metrólogo Senior',
    publishedAt: '2023-11-25',
    readingTime: 7,
    views: 1150,
    comments: 23,
    likes: 82,
    tags: ['Trazabilidad', 'Metrología', 'Fundamentos', 'Medición'],
    featured: false
  }
]

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed Properties
const totalArticles = computed(() => articles.length)

const featuredArticles = computed(() => 
  articles.filter(article => article.featured).slice(0, 3)
)

const popularTags = computed(() => {
  const allTags = articles.flatMap(article => article.tags)
  const tagCounts: Record<string, number> = {}
  
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1
  })
  
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag)
})

const filteredArticles = computed(() => {
  let filtered = [...articles]

  // Filtrar por categoría
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(article => article.categoryId === activeCategory.value)
  }

  // Filtrar por tag
  if (activeTag.value) {
    filtered = filtered.filter(article => 
      article.tags.some(tag => 
        tag.toLowerCase().includes(activeTag.value!.toLowerCase())
      )
    )
  }

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Ordenar
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
      break
    case 'popular':
      filtered.sort((a, b) => b.views - a.views)
      break
  }

  return filtered
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredArticles.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredArticles.value.length / itemsPerPage)
)

const startItem = computed(() => 
  (currentPage.value - 1) * itemsPerPage + 1
)

const endItem = computed(() => 
  Math.min(currentPage.value * itemsPerPage, filteredArticles.value.length)
)

const activeFilters = computed(() => {
  const filters: string[] = []
  
  if (activeCategory.value !== 'all') {
    const category = categories.find(c => c.id === activeCategory.value)
    if (category) filters.push(category.name)
  }
  
  if (activeTag.value) {
    filters.push(`#${activeTag.value}`)
  }
  
  if (searchQuery.value) {
    filters.push(`"${searchQuery.value}"`)
  }
  
  return filters
})

const toastClass = computed(() => {
  const classes: Record<ToastType, string> = {
    'success': 'bg-success text-white border-0',
    'info': 'bg-info text-white border-0',
    'warning': 'bg-warning border-0'
  }
  return classes[toastType.value] || 'bg-info text-white border-0'
})

const toastIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle',
    'info': 'bi bi-info-circle',
    'warning': 'bi bi-exclamation-triangle'
  }
  return icons[toastType.value] || 'bi bi-info-circle'
})

const toastBodyIcon = computed(() => {
  const icons: Record<ToastType, string> = {
    'success': 'bi bi-check-circle-fill text-success',
    'info': 'bi bi-info-circle-fill text-info',
    'warning': 'bi bi-exclamation-triangle-fill text-warning'
  }
  return icons[toastType.value] || 'bi bi-info-circle-fill text-info'
})

// Métodos
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme.value)
  
  showToast(
    currentTheme.value === 'light' ? '🌞 Cambiado a tema claro' : '🌙 Cambiado a tema oscuro',
    'info'
  )
}

const getCategoryName = (categoryId: number) => {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : 'Sin categoría'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const filterByCategory = (categoryId: number | 'all') => {
  activeCategory.value = categoryId
  activeTag.value = null
  currentPage.value = 1
}

const filterByTag = (tag: string) => {
  activeTag.value = tag === activeTag.value ? null : tag
  currentPage.value = 1
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    currentPage.value = 1
    showToast(`Buscando: "${searchQuery.value}"`, 'info')
  }
}

const removeFilter = (filter: string) => {
  if (filter.startsWith('#')) {
    // Es un tag
    activeTag.value = null
  } else if (filter.startsWith('"')) {
    // Es una búsqueda
    searchQuery.value = ''
  } else {
    // Es una categoría
    activeCategory.value = 'all'
  }
}

const clearFilters = () => {
  activeCategory.value = 'all'
  activeTag.value = null
  searchQuery.value = ''
  currentPage.value = 1
  showToast('Filtros limpiados', 'info')
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const viewArticle = (article: Article) => {
  router.push(`/blog/${article.id}`)
  // En una implementación real, esto navegaría a la página del artículo
  // showToast(`Redirigiendo a: ${article.title}`, 'info')
}

const subscribeNewsletter = () => {
  if (newsletterEmail.value) {
    // Simular suscripción
    setTimeout(() => {
      showToast(`¡Gracias por suscribirte con: ${newsletterEmail.value}!`, 'success')
      newsletterEmail.value = ''
    }, 1000)
  }
}

const showToast = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type
  
  if (toastInstance) {
    toastInstance.hide()
  }
  
  if (toastEl.value) {
    import('bootstrap').then((bootstrap) => {
      toastInstance = new bootstrap.Toast(toastEl.value!, { delay: 3000 })
      toastInstance.show()
    })
  }
}

const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = 'dark'
      localStorage.setItem('theme', 'dark')
    }
  }
}

const setNavbarHeight = () => {
  // Measure common navbar/header elements and set CSS variable
  const navbar = document.querySelector('nav.navbar') || document.querySelector('header') || document.querySelector('.navbar')
  const height = navbar ? (navbar as HTMLElement).offsetHeight : 72
  document.documentElement.style.setProperty('--navbar-height', `${height}px`)
}

onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  
  // Detectar tema del sistema
  detectSystemTheme()
  // Ensure hero sits exactly below the navbar
  setNavbarHeight()
  window.addEventListener('resize', setNavbarHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', setNavbarHeight)
})
</script>

<style scoped>
.blog-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .blog-page {
  background: linear-gradient(135deg, #121212 0%, #1A1A1A 100%);
}

/* Hero Section */
.blog-hero {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.1) 0%, rgba(52, 181, 101, 0.05) 100%);
  padding: 6rem 0 4rem;
  /* Sitúa el hero inmediatamente debajo del header/navbar usando la variable del layout */
  margin-top: var(--navbar-height, 72px);
}

[data-bs-theme="dark"] .blog-hero {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.15) 0%, rgba(52, 181, 101, 0.1) 100%);
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 1.5rem;
}

.breadcrumb-item a {
  color: var(--color-primary, #1E9E4A);
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-item.active {
  color: var(--color-gray, #6C757D);
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .hero-title {
  color: var(--color-dark, #F8F9FA);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--color-gray, #6C757D);
  margin-bottom: 2rem;
  max-width: 600px;
}

.search-bar {
  max-width: 500px;
  margin-top: 2rem;
}

.search-bar .input-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-bar .input-group-text {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-right: none;
  color: var(--color-primary, #1E9E4A);
  padding: 0 1.25rem;
}

.search-bar .form-control {
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-left: none;
  border-right: none;
  background: var(--color-light, white);
  color: var(--color-dark, #212529);
  padding: 0.875rem 1rem;
  font-size: 1rem;
}

[data-bs-theme="dark"] .search-bar .form-control {
  background: var(--color-light, #121212);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.search-bar .btn {
  padding: 0.875rem 1.5rem;
  font-weight: 600;
}

.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-card {
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .stat-card {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.stat-card i {
  font-size: 2.5rem;
  color: var(--color-primary, #1E9E4A);
}

.stat-card h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-dark, #212529);
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-bs-theme="dark"] .stat-card h3 {
  color: var(--color-dark, #F8F9FA);
}

.stat-card p {
  color: var(--color-gray, #6C757D);
  margin: 0;
  font-size: 0.9rem;
}

/* Main Content */
.blog-main {
  padding: 4rem 0;
}

/* Sidebar */
.blog-sidebar {
  position: sticky;
  top: 200px;
}

.sidebar-widget {
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] .sidebar-widget {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.widget-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .widget-title {
  color: var(--color-dark, #F8F9FA);
}

.widget-title i {
  color: var(--color-primary, #1E9E4A);
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  color: var(--color-gray-dark, #495057);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

[data-bs-theme="dark"] .category-item {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.07) 100%);
  border: 1px solid var(--color-gray-light, #2d2d2d);
  color: var(--color-gray-dark, #ADB5BD);
}

.category-item:hover {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.1) 0%, rgba(52, 181, 101, 0.05) 100%);
  border-color: var(--color-primary, #1E9E4A);
  transform: translateX(5px);
}

.category-item.active {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-color: transparent;
  color: white;
}

.category-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.category-item.active .category-count {
  background: rgba(255, 255, 255, 0.3);
}

.featured-articles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.featured-article {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border: 1px solid var(--color-gray-light, #E9ECEF);
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .featured-article {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.07) 100%);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.featured-article:hover {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.1) 0%, rgba(52, 181, 101, 0.05) 100%);
  border-color: var(--color-primary, #1E9E4A);
  transform: translateX(5px);
}

.featured-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

[data-bs-theme="dark"] .featured-title {
  color: var(--color-dark, #F8F9FA);
}

.article-meta .date {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.article-meta i {
  font-size: 0.9rem;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.5rem 0.75rem;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 20px;
  color: var(--color-gray-dark, #495057);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .tag {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
  border: 1px solid var(--color-gray-light, #2d2d2d);
  color: var(--color-gray-dark, #ADB5BD);
}

.tag:hover {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
}

.tag.active {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-color: transparent;
  color: white;
}

.newsletter-widget {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  color: white;
  border: none;
}

.newsletter-content {
  text-align: center;
}

.newsletter-content i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  color: rgba(255, 255, 255, 0.9);
}

.newsletter-content h4 {
  color: white;
  margin-bottom: 0.5rem;
}

.newsletter-content p {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.newsletter-form .form-control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
}

.newsletter-form .form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-form .btn {
  background: white;
  color: #1E9E4A;
  font-weight: 600;
  border: none;
}

.newsletter-form .btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

.newsletter-content small {
  display: block;
  margin-top: 1rem;
  opacity: 0.8;
}

.social-widget {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border: 1px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-gray-dark, #495057);
  text-decoration: none;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .social-link {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.07) 100%);
  border: 1px solid var(--color-gray-light, #2d2d2d);
  color: var(--color-gray-dark, #ADB5BD);
}

.social-link:hover {
  transform: translateX(5px);
  text-decoration: none;
}

.social-link i {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.social-link.linkedin:hover {
  background: #0077B5;
  border-color: #0077B5;
  color: white;
}

.social-link.twitter:hover {
  background: #1DA1F2;
  border-color: #1DA1F2;
  color: white;
}

.social-link.youtube:hover {
  background: #FF0000;
  border-color: #FF0000;
  color: white;
}

/* Filter Bar */
.filter-bar {
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .filter-bar {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.filter-info h4 {
  color: var(--color-dark, #212529);
  font-weight: 600;
}

[data-bs-theme="dark"] .filter-info h4 {
  color: var(--color-dark, #F8F9FA);
}

.filter-controls .form-select {
  background: var(--card-bg, white);
  border: 2px solid var(--color-gray-light, #E9ECEF);
  color: var(--color-dark, #212529);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  min-width: 160px;
}

[data-bs-theme="dark"] .filter-controls .form-select {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.active-filters {
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.filter-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
}

.filters-list .badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-close-filter {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.btn-close-filter:hover {
  opacity: 1;
}

.btn-clear-filters {
  background: none;
  border: none;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: none;
}

.btn-clear-filters:hover {
  text-decoration: underline;
}

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.article-card {
  background: var(--color-light, white);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

[data-bs-theme="dark"] .article-card {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary, #1E9E4A);
}

.article-card.featured {
  border: 2px solid #FFD700;
}

.featured-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
}

.article-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.7));
}

.article-category {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.article-content {
  padding: 1.5rem;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.article-meta i {
  color: var(--color-primary, #1E9E4A);
}

.article-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
  line-height: 1.3;
}

[data-bs-theme="dark"] .article-title {
  color: var(--color-dark, #F8F9FA);
}

.article-excerpt {
  color: var(--color-gray, #6C757D);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.article-tags .tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
}

.tag-more {
  color: var(--color-primary, #1E9E4A);
  font-size: 0.8rem;
  font-weight: 500;
}

.article-stats {
  display: flex;
  gap: 1rem;
}

.article-stats .stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.article-stats i {
  color: var(--color-primary, #1E9E4A);
}

/* No Results */
.no-results {
  background: var(--color-light, white);
  border-radius: 12px;
  padding: 4rem 2rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
}

[data-bs-theme="dark"] .no-results {
  background: var(--color-light, #121212);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.no-results h3 {
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .no-results h3 {
  color: var(--color-dark, #F8F9FA);
}

/* Pagination */
.pagination-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.pagination {
  gap: 0.5rem;
}

.page-item .page-link {
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--color-light, white);
  color: var(--color-dark, #212529);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .page-item .page-link {
  background: var(--color-light, #121212);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.page-item .page-link:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-color: transparent;
  color: white;
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

/* CTA Section */
.blog-cta {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(30, 158, 74, 0.2);
}

[data-bs-theme="dark"] .blog-cta {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
}

.cta-content i {
  color: var(--color-primary, #1E9E4A);
}

.cta-content h3 {
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
}

[data-bs-theme="dark"] .cta-content h3 {
  color: var(--color-dark, #F8F9FA);
}

.cta-content p {
  color: var(--color-gray, #6C757D);
  max-width: 600px;
  margin: 0 auto 2rem;
}

/* Responsive */
@media (max-width: 991.98px) {
  .blog-hero {
    margin-top: 140px;
    padding: 4rem 0 3rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .blog-main {
    padding: 3rem 0;
  }
  
  .blog-sidebar {
    position: static;
    margin-bottom: 3rem;
  }
}

@media (max-width: 768px) {
  .blog-hero {
    margin-top: 120px;
    padding: 3rem 0 2rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .filter-bar {
    padding: 1rem;
  }
  
  .filter-info h4 {
    font-size: 1.25rem;
  }
  
  .article-card {
    margin-bottom: 1.5rem;
  }
  
  .article-image {
    height: 180px;
  }
  
  .article-content {
    padding: 1.25rem;
  }
  
  .article-title {
    font-size: 1.25rem;
  }
  
  .blog-cta {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-card h3 {
    font-size: 1.5rem;
  }
  
  .sidebar-widget {
    padding: 1.25rem;
  }
  
  .featured-article {
    flex-direction: column;
  }
  
  .featured-image {
    width: 100%;
    height: 120px;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>