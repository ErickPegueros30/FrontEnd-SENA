<template>
  <div :data-bs-theme="currentTheme" class="blog-page">
    <!-- Hero Section del Blog -->
    <section class="blog-hero">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8" data-aos="fade-right">
            <div class="hero-content">

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
                  <button class="btn contact-btn" @click="performSearch">
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="hero-stats">
              <div class="stat-card">
                <i class="bi bi-file-text "></i>
                <div>
                  <h3>{{ totalArticles }}</h3>
                  <p>Artículos publicados</p>
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
                    <button type="submit" class="btn contact-btn w-100 mt-2">
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
                    class="badge filter-badge"
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
              <button @click="clearFilters" class="btn contact-btn">
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
                <button class="btn contact-btn">
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

// API
const API_BASE = ((import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000').replace(/\/api$/, '')

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
const loading = ref(false)

// Datos del blog (se cargan desde API)
const categories = ref<Category[]>([])
const articles = ref<Article[]>([])

// ── Funciones de carga desde API ──
const fetchCategories = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/blogs/categories`)
    const json = await resp.json()
    if (json.ok) {
      categories.value = json.data.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        count: c.count || 0,
        icon: c.icon || 'bi-folder',
      }))
    }
  } catch (err) {
    console.error('Error cargando categorías', err)
  }
}

const fetchArticles = async () => {
  try {
    loading.value = true
    const resp = await fetch(`${API_BASE}/api/blogs?limit=200`)
    const json = await resp.json()
    if (json.ok) {
      articles.value = json.data.map((a: any) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt || '',
        content: a.content || '',
        image: a.image || a.thumbnail || '',
        categoryId: a.categoryId || 0,
        author: a.author || 'Sin autor',
        authorAvatar: a.authorAvatar || (a.author ? a.author.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase() : 'SA'),
        authorTitle: a.authorTitle || '',
        publishedAt: a.publishedAt || a.createdAt || '',
        readingTime: a.readingTime || 0,
        views: a.views || 0,
        comments: a.comments || 0,
        likes: a.likes || 0,
        tags: a.tags || [],
        featured: a.featured || false,
      }))
    }
  } catch (err) {
    console.error('Error cargando artículos', err)
  } finally {
    loading.value = false
  }
}

// Estado del toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// Computed Properties
const totalArticles = computed(() => articles.value.length)

const featuredArticles = computed(() =>
  articles.value.filter(article => article.featured).slice(0, 3)
)

const popularTags = computed(() => {
  const allTags = articles.value.flatMap(article => article.tags)
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
  let filtered = [...articles.value]

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
    const category = categories.value.find(c => c.id === activeCategory.value)
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
  const category = categories.value.find(c => c.id === categoryId)
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
}

const subscribeNewsletter = () => {
  if (newsletterEmail.value) {
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
  const navbar = document.querySelector('nav.navbar') || document.querySelector('header') || document.querySelector('.navbar')
  const height = navbar ? (navbar as HTMLElement).offsetHeight : 72
  document.documentElement.style.setProperty('--navbar-height', `${height}px`)
}

onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  detectSystemTheme()
  setNavbarHeight()
  window.addEventListener('resize', setNavbarHeight)

  await Promise.all([fetchArticles(), fetchCategories()])
})

onUnmounted(() => {
  window.removeEventListener('resize', setNavbarHeight)
})
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS (heredados de inicio-page)
   ============================================================ */
:root {
  --sena-green:       #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale:  #edf4e3;
  --sena-dark:        #1a2612;
  --sena-forest:      #0f1e09;
  --sena-text:        #1c2b14;
  --sena-muted:       #5a6a52;
  --sena-border:      rgba(93, 138, 47, 0.14);
  --radius-card:      20px;
  --radius-sm:        10px;
  --shadow-sm:        0 2px 12px rgba(0,0,0,0.06);
  --shadow-md:        0 8px 32px rgba(0,0,0,0.10);
  --shadow-green:     0 8px 28px rgba(93,138,47,0.22);
  --transition:       all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-display:     'Playfair Display', Georgia, serif;
  --font-body:        'DM Sans', 'Segoe UI', sans-serif;
}

.blog-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .blog-page {
  background: #0c0f0a;
  color: #e8ede3;
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122,171,61,0.16);
  --sena-green-pale: rgba(93,138,47,0.12);
}

/* ============================================================
   SHARED ELEMENTS
   ============================================================ */
.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  margin-bottom: 0.6rem;
}
.section-eyebrow.light { color: rgba(122,171,61,0.85); }

.section-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
  line-height: 1.18;
}

[data-bs-theme="dark"] .section-title { color: #f0f5ea; }

.title-underline {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
  margin-top: 0.35rem;
}

/* ============================================================
   BOTÓN PRINCIPAL (contact-btn)
   ============================================================ */
.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: linear-gradient(135deg, var(--sena-green) 0%, var(--sena-green-light) 100%);
  color: #ffffff !important;
  -webkit-font-smoothing: antialiased;
  text-shadow: 0 1px 0 rgba(0,0,0,0.18);
  padding: 0.65rem 1.4rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.88rem;
  border: none;
  box-shadow: var(--shadow-green);
  transition: var(--transition);
  text-decoration: none;
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.32);
}
.contact-btn .btn-arrow {
  width: 16px; height: 16px;
  transition: transform 0.22s ease;
}
.contact-btn:hover .btn-arrow { transform: translateX(3px); }

[data-bs-theme="light"] .contact-btn {
  color: #ffffff !important;
  background: linear-gradient(180deg, #3f6b1f 0%, #5d8a2f 100%) !important;
  box-shadow: 0 12px 44px rgba(37, 59, 21, 0.18);
  border: 1px solid rgba(0,0,0,0.08);
}
[data-bs-theme="light"] .contact-btn:focus {
  outline: 3px solid rgba(122,171,61,0.16);
  outline-offset: 2px;
}

/* ============================================================
   HERO
   ============================================================ */
.blog-hero {
  background: linear-gradient(135deg, rgba(93,138,47,0.06) 0%, rgba(122,171,61,0.02) 100%);
  padding: 4rem 0 3rem;
  border-bottom: 1px solid var(--sena-border);
}

[data-bs-theme="dark"] .blog-hero {
  background: linear-gradient(135deg, rgba(93,138,47,0.12) 0%, rgba(122,171,61,0.06) 100%);
  border-bottom-color: rgba(122,171,61,0.12);
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 1.5rem;
}
.breadcrumb-item a {
  color: var(--sena-green);
  text-decoration: none;
  font-weight: 500;
}
.breadcrumb-item a:hover { color: var(--sena-green-light); }
.breadcrumb-item.active {
  color: var(--sena-muted);
}

.hero-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 1rem;
}
[data-bs-theme="dark"] .hero-title { color: #e8ede3; }

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--sena-muted);
  margin-bottom: 2rem;
  max-width: 600px;
}

.search-bar {
  max-width: 500px;
  margin-top: 2rem;
}
.search-bar .input-group {
  border-radius: 50px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--sena-border);
  background: #ffffff;
  transition: var(--transition);
}
[data-bs-theme="dark"] .search-bar .input-group {
  background: #131a0e;
  border-color: rgba(122,171,61,0.14);
}
.search-bar .input-group:focus-within {
  box-shadow: var(--shadow-green);
  border-color: var(--sena-green-light);
}
.search-bar .input-group-text {
  background: transparent;
  border: none;
  color: var(--sena-green);
  padding: 0 1.25rem;
}
.search-bar .form-control {
  border: none;
  background: transparent;
  color: var(--sena-text);
  padding: 0.75rem 1rem;
  font-size: 1rem;
}
.search-bar .form-control::placeholder {
  color: var(--sena-muted);
}
.search-bar .contact-btn {
  border-radius: 0 50px 50px 0;
  padding: 0.75rem 1.5rem;
}

.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.stat-card {
  background: #ffffff;
  border-radius: var(--radius-card);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
[data-bs-theme="dark"] .stat-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--sena-green-light);
}
.stat-card i {
  font-size: 2.5rem;
  color: var(--sena-green);
}
.stat-card h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #000000; /* número en negro en tema claro */
}
[data-bs-theme="dark"] .stat-card h3 {
  -webkit-text-fill-color: var(--sena-green-light);
}
.stat-card p {
  color: var(--sena-muted);
  margin: 0;
  font-size: 0.9rem;
}

/* ============================================================
   MAIN LAYOUT
   ============================================================ */
.blog-main {
  padding: 4rem 0;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
.blog-sidebar {
  position: sticky;
  top: calc(var(--navbar-height, 72px) + 2rem);
}

.sidebar-widget {
  background: #ffffff;
  border-radius: var(--radius-card);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
[data-bs-theme="dark"] .sidebar-widget {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}
.sidebar-widget:hover {
  box-shadow: var(--shadow-md);
}

.widget-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--sena-text);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}
.widget-title i {
  color: var(--sena-green);
}

/* Categorías */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1rem;
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-sm);
  color: var(--sena-text);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  width: 100%;
}
[data-bs-theme="dark"] .category-item {
  background: rgba(93,138,47,0.08);
  border-color: rgba(122,171,61,0.12);
  color: #c8d8be;
}
.category-item:hover {
  background: rgba(93,138,47,0.12);
  border-color: var(--sena-green-light);
  transform: translateX(4px);
}
.category-item.active {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  border-color: transparent;
  color: #ffffff;
}
.category-item.active .category-count {
  background: rgba(255,255,255,0.2);
}
.category-count {
  background: rgba(93,138,47,0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Artículos destacados */
.featured-articles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.featured-article {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  cursor: pointer;
  transition: var(--transition);
}
[data-bs-theme="dark"] .featured-article {
  background: rgba(93,138,47,0.06);
  border-color: rgba(122,171,61,0.1);
}
.featured-article:hover {
  background: rgba(93,138,47,0.12);
  border-color: var(--sena-green-light);
  transform: translateX(4px);
}
.featured-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
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
  color: var(--sena-text);
  margin-bottom: 0.3rem;
  line-height: 1.3;
}
[data-bs-theme="dark"] .featured-title { color: #e8ede3; }
.featured-content .article-meta .date {
  font-size: 0.8rem;
  color: var(--sena-muted);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Tags */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag {
  padding: 0.4rem 0.8rem;
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  border-radius: 50px;
  color: var(--sena-text);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}
[data-bs-theme="dark"] .tag {
  background: rgba(93,138,47,0.08);
  border-color: rgba(122,171,61,0.12);
  color: #c8d8be;
}
.tag:hover {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  border-color: transparent;
  color: #ffffff;
  transform: translateY(-2px);
}
.tag.active {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  border-color: transparent;
  color: #ffffff;
}

/* Newsletter */
.newsletter-widget {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  border: none;
}
.newsletter-content {
  text-align: center;
  color: #ffffff;
}
.newsletter-content i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  color: rgba(255,255,255,0.8);
}
.newsletter-content h4 {
  color: #ffffff;
  margin-bottom: 0.5rem;
}
.newsletter-content p {
  opacity: 0.8;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.newsletter-form .form-control {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: #ffffff;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
}
.newsletter-form .form-control::placeholder {
  color: rgba(255,255,255,0.5);
}
.newsletter-form .contact-btn {
  width: 100%;
  background: #ffffff;
  color: var(--sena-green) !important;
  box-shadow: none;
  border: none;
}
.newsletter-form .contact-btn:hover {
  background: rgba(255,255,255,0.9);
}
.newsletter-content small {
  display: block;
  margin-top: 0.8rem;
  opacity: 0.7;
}

/* Social */
.social-widget {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.social-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  color: var(--sena-text);
  text-decoration: none;
  transition: var(--transition);
}
[data-bs-theme="dark"] .social-link {
  background: rgba(93,138,47,0.06);
  border-color: rgba(122,171,61,0.1);
  color: #c8d8be;
}
.social-link:hover {
  transform: translateX(4px);
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
  color: #fff;
}
.social-link.twitter:hover {
  background: #1DA1F2;
  border-color: #1DA1F2;
  color: #fff;
}
.social-link.youtube:hover {
  background: #FF0000;
  border-color: #FF0000;
  color: #fff;
}

/* ============================================================
   FILTER BAR
   ============================================================ */
.filter-bar {
  background: #ffffff;
  border-radius: var(--radius-card);
  padding: 1.5rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
}
[data-bs-theme="dark"] .filter-bar {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}
.filter-info h4 {
  font-family: var(--font-display);
  color: var(--sena-text);
  font-weight: 600;
}
[data-bs-theme="dark"] .filter-info h4 { color: #e8ede3; }

.filter-controls .form-select {
  background: #ffffff;
  border: 1px solid var(--sena-border);
  color: var(--sena-text);
  border-radius: 50px;
  padding: 0.4rem 1.2rem;
  min-width: 160px;
}
[data-bs-theme="dark"] .filter-controls .form-select {
  background: #131a0e;
  border-color: rgba(122,171,61,0.14);
  color: #e8ede3;
}
.active-filters {
  padding-top: 1rem;
  border-top: 1px solid var(--sena-border);
}
.filter-label {
  color: var(--sena-muted);
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
.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  border-radius: 50px;
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
.btn-close-filter:hover { opacity: 1; }
.btn-clear-filters {
  background: none;
  border: none;
  color: var(--sena-green);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0;
}
.btn-clear-filters:hover { text-decoration: underline; }

/* ============================================================
   ARTICLES GRID
   ============================================================ */
.articles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
.article-card {
  background: #ffffff;
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 1px solid var(--sena-border);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
}
[data-bs-theme="dark"] .article-card {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}
.article-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
  border-color: var(--sena-green-light);
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
  padding: 0.4rem 0.9rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 4px 15px rgba(255,165,0,0.3);
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
.article-card:hover .article-image img { transform: scale(1.05); }
.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5));
}
.article-category {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  padding: 0.3rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-content {
  padding: 1.5rem;
}
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.8rem;
  color: var(--sena-muted);
  font-size: 0.85rem;
}
.article-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.article-meta i {
  color: var(--sena-green);
}
.article-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.8rem;
  line-height: 1.3;
}
[data-bs-theme="dark"] .article-title { color: #e8ede3; }
.article-excerpt {
  color: var(--sena-muted);
  margin-bottom: 1.2rem;
  line-height: 1.6;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--sena-border);
}
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}
.article-tags .tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
}
.tag-more {
  color: var(--sena-green);
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
  color: var(--sena-muted);
  font-size: 0.85rem;
}
.article-stats i {
  color: var(--sena-green);
}

/* ============================================================
   NO RESULTS
   ============================================================ */
.no-results {
  background: #ffffff;
  border-radius: var(--radius-card);
  padding: 4rem 2rem;
  border: 1px solid var(--sena-border);
}
[data-bs-theme="dark"] .no-results {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
}
.no-results h3 {
  color: var(--sena-text);
  margin-bottom: 1rem;
}
[data-bs-theme="dark"] .no-results h3 { color: #e8ede3; }

/* ============================================================
   PAGINATION
   ============================================================ */
.pagination-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--sena-border);
}
.pagination {
  gap: 0.5rem;
}
.page-item .page-link {
  border: 1px solid var(--sena-border);
  background: #ffffff;
  color: var(--sena-text);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  transition: var(--transition);
}
[data-bs-theme="dark"] .page-item .page-link {
  background: #131a0e;
  border-color: rgba(122,171,61,0.12);
  color: #c8d8be;
}
.page-item .page-link:hover {
  background: var(--sena-green-pale);
  border-color: var(--sena-green-light);
  color: var(--sena-green);
}
.page-item.active .page-link {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  border-color: transparent;
  color: #ffffff;
}
.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination-info {
  color: var(--sena-muted);
  font-size: 0.9rem;
}

/* ============================================================
   CTA
   ============================================================ */
.blog-cta {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  border-radius: var(--radius-card);
  padding: 3rem 2rem;
  text-align: center;
  color: #ffffff;
}
.cta-content i {
  color: var(--sena-green-light);
}
.cta-content h3 {
  font-family: var(--font-display);
  color: #ffffff;
  margin-bottom: 1rem;
}
.cta-content p {
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto 2rem;
}
.cta-content .contact-btn {
  background: #ffffff;
  color: var(--sena-green) !important;
  box-shadow: none;
}
.cta-content .contact-btn:hover {
  background: rgba(255,255,255,0.9);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 991.98px) {
  .blog-hero { padding: 3rem 0 2rem; }
  .hero-title { font-size: 2.5rem; }
  .blog-main { padding: 3rem 0; }
  .blog-sidebar { position: static; margin-bottom: 3rem; }
}

@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1rem; }
  .filter-bar { padding: 1rem; }
  .filter-info h4 { font-size: 1.25rem; }
  .article-image { height: 180px; }
  .article-content { padding: 1.25rem; }
  .article-title { font-size: 1.25rem; }
  .blog-cta { padding: 2rem 1.5rem; }
}

@media (max-width: 576px) {
  .hero-title { font-size: 1.75rem; }
  .stat-card { padding: 1rem; }
  .stat-card h3 { font-size: 1.5rem; }
  .sidebar-widget { padding: 1.25rem; }
  .featured-article { flex-direction: column; }
  .featured-image { width: 100%; height: 120px; }
  .article-footer { flex-direction: column; align-items: flex-start; }
  .pagination { flex-wrap: wrap; justify-content: center; }
}
</style>
