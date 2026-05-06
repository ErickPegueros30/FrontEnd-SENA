<template>
  <div :data-bs-theme="currentTheme" class="blog-article-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="container text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando artículo...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="container text-center py-5">
        <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
        <h2>Artículo no encontrado</h2>
        <p class="text-muted mb-4">El artículo que buscas no existe o ha sido eliminado.</p>
        <router-link to="/blog" class="btn btn-primary">
          <i class="bi bi-arrow-left me-2"></i>Volver al blog
        </router-link>
      </div>
    </div>

    <!-- Article Content -->
    <template v-else-if="article">
      <!-- Hero / Header del artículo -->
      <section class="article-hero">
        <div class="container">
          <!-- Breadcrumb -->
          <nav aria-label="breadcrumb" class="article-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/"><i class="bi bi-house-door"></i> Inicio</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/blog">Blog</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">{{ article.title }}</li>
            </ol>
          </nav>

          <!-- Category Badge -->
          <div class="article-category-badge" v-if="article.category">
            <span class="category-pill">
              <i class="bi bi-folder me-1"></i>{{ article.category }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="article-hero-title">{{ article.title }}</h1>

          <!-- Excerpt -->
          <p v-if="article.excerpt" class="article-hero-excerpt">{{ article.excerpt }}</p>

          <!-- Meta Info -->
          <div class="article-hero-meta">
            <div class="author-info">
              <div class="author-avatar">
                <img v-if="article.authorAvatar && article.authorAvatar.startsWith('http')"
                     :src="article.authorAvatar" :alt="article.author" />
                <span v-else class="avatar-initials">
                  {{ getInitials(article.author) }}
                </span>
              </div>
              <div class="author-details">
                <span class="author-name">{{ article.author }}</span>
              </div>
            </div>

            <div class="meta-items">
              <span class="meta-item">
                <i class="bi bi-calendar3"></i>
                {{ formatDate(article.publishedAt || article.createdAt) }}
              </span>
              <span v-if="article.readingTime" class="meta-item">
                <i class="bi bi-clock"></i>
                {{ article.readingTime }} min de lectura
              </span>
              <span class="meta-item">
                <i class="bi bi-eye"></i>
                {{ article.views.toLocaleString() }} vistas
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Image -->
      <section v-if="article.thumbnail" class="article-featured-image">
        <div class="container">
          <div class="featured-image-wrapper">
            <img :src="article.thumbnail" :alt="article.title" class="featured-img" />
          </div>
        </div>
      </section>

      <!-- Main Content Area -->
      <main class="article-main">
        <div class="container">
          <div class="row">
            <!-- Article Body -->
            <div class="col-lg-8">
              <article class="article-body">
                <!-- Rendered content (Markdown-like or HTML) -->
                <div class="article-content-rendered" v-html="renderedContent"></div>

                <!-- Tags -->
                <div v-if="article.tags && article.tags.length" class="article-tags-section">
                  <h6 class="tags-label">
                    <i class="bi bi-tags me-2"></i>Etiquetas
                  </h6>
                  <div class="tags-list">
                    <router-link
                      v-for="tag in article.tags"
                      :key="tag"
                      :to="`/blog?tag=${encodeURIComponent(tag)}`"
                      class="tag-pill"
                    >
                      {{ tag }}
                    </router-link>
                  </div>
                </div>

                <!-- Share / Actions -->
                <div class="article-actions">
                  <div class="action-group">
                    <button class="action-btn" @click="likeArticle" :class="{ liked: hasLiked }">
                      <i :class="hasLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                      <span>{{ article.likes }}</span>
                    </button>
                  </div>
                  <div class="share-group">
                    <span class="share-label">Compartir:</span>
                    <button class="share-btn" @click="shareOn('twitter')" title="Compartir en Twitter">
                      <i class="bi bi-twitter"></i>
                    </button>
                    <button class="share-btn" @click="shareOn('linkedin')" title="Compartir en LinkedIn">
                      <i class="bi bi-linkedin"></i>
                    </button>
                    <button class="share-btn" @click="shareOn('facebook')" title="Compartir en Facebook">
                      <i class="bi bi-facebook"></i>
                    </button>
                    <button class="share-btn" @click="copyLink" title="Copiar enlace">
                      <i class="bi bi-link-45deg"></i>
                    </button>
                  </div>
                </div>

                <!-- Author Card -->
                <div class="author-card">
                  <div class="author-card-avatar">
                    <img v-if="article.authorAvatar && article.authorAvatar.startsWith('http')"
                         :src="article.authorAvatar" :alt="article.author" />
                    <span v-else class="avatar-initials large">
                      {{ getInitials(article.author) }}
                    </span>
                  </div>
                  <div class="author-card-info">
                    <h5 class="author-card-name">{{ article.author }}</h5>
                    <p  class="author-card-title"></p>
                    <p class="author-card-bio">
                      Autor y colaborador del blog de SENA. Especialista en metrología y calidad.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <!-- Sidebar -->
            <div class="col-lg-4">
              <aside class="article-sidebar">
                <!-- Table of Contents -->
                <div v-if="tableOfContents.length > 0" class="sidebar-widget toc-widget">
                  <h4 class="widget-title">
                    <i class="bi bi-list-nested me-2"></i>Contenido
                  </h4>
                  <nav class="toc-nav">
                    <a
                      v-for="(heading, idx) in tableOfContents"
                      :key="idx"
                      :href="`#${heading.id}`"
                      class="toc-link"
                      :class="`toc-level-${heading.level}`"
                    >
                      {{ heading.text }}
                    </a>
                  </nav>
                </div>

                <!-- Related Articles -->
                <div v-if="relatedArticles.length > 0" class="sidebar-widget">
                  <h4 class="widget-title">
                    <i class="bi bi-journal-text me-2"></i>Artículos relacionados
                  </h4>
                  <div class="related-articles">
                    <div
                      v-for="related in relatedArticles"
                      :key="related.id"
                      class="related-article"
                      @click="goToArticle(related.id)"
                    >
                      <div v-if="related.thumbnail" class="related-image">
                        <img :src="related.thumbnail" :alt="related.title" />
                      </div>
                      <div class="related-info">
                        <h6 class="related-title">{{ related.title }}</h6>
                        <span class="related-date">
                          <i class="bi bi-calendar3 me-1"></i>
                          {{ formatDate(related.publishedAt || related.createdAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Back to Blog -->
                <div class="sidebar-widget cta-widget">
                  <div class="cta-content">
                    <i class="bi bi-arrow-left-circle display-4 text-primary"></i>
                    <h5 class="mt-3">Explorar más artículos</h5>
                    <p class="text-muted">Descubre más contenido en nuestro blog.</p>
                    <router-link to="/blog" class="btn btn-primary w-100">
                      <i class="bi bi-grid me-2"></i>Ver todos los artículos
                    </router-link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <!-- Navigation between articles -->
      <section v-if="prevArticle || nextArticle" class="article-navigation">
        <div class="container">
          <div class="nav-grid">
            <div v-if="prevArticle" class="nav-card prev" @click="goToArticle(prevArticle.id)">
              <span class="nav-label"><i class="bi bi-arrow-left me-2"></i>Anterior</span>
              <h6 class="nav-title">{{ prevArticle.title }}</h6>
            </div>
            <div v-else class="nav-card empty"></div>

            <div v-if="nextArticle" class="nav-card next" @click="goToArticle(nextArticle.id)">
              <span class="nav-label">Siguiente<i class="bi bi-arrow-right ms-2"></i></span>
              <h6 class="nav-title">{{ nextArticle.title }}</h6>
            </div>
            <div v-else class="nav-card empty"></div>
          </div>
        </div>
      </section>
    </template>

    <!-- Footer -->
    <FooterComponent :current-theme="currentTheme" />

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
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
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body bg-body border border-opacity-25 rounded-bottom" :class="`border-${toastType}`">
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FooterComponent from '@/components/Footer.vue/Footer.vue'
import type { Toast } from 'bootstrap'

// Types
type Theme = 'light' | 'dark'
type ToastType = 'success' | 'info' | 'warning' | 'error'

interface Article {
  id: number
  title: string
  slug: string
  author: string
  authorAvatar: string | null
  excerpt: string
  content: string
  thumbnail: string | null
  category: string
  categoryId: number | null
  tags: string[]
  status: string
  featured: boolean
  views: number
  likes: number
  comments: number
  readingTime: number
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

interface TOCHeading {
  id: string
  text: string
  level: number
}

// API
import { API_BASE } from '@/config/api'

// Router / Route
const route = useRoute()
const router = useRouter()

// Theme
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// State
const loading = ref(true)
const error = ref(false)
const article = ref<Article | null>(null)
const relatedArticles = ref<Article[]>([])
const allArticles = ref<Article[]>([])
const hasLiked = ref(false)

// Toast
const toastMessage = ref('')
const toastType: Ref<ToastType> = ref('info')
const toastEl = ref<HTMLDivElement | null>(null)
let toastInstance: Toast | null = null

// ── Fetch article ──
const fetchArticle = async (id: string | number) => {
  loading.value = true
  error.value = false
  try {
    const resp = await fetch(`${API_BASE}/api/blogs/${id}`)
    if (!resp.ok) { error.value = true; return }
    const json = await resp.json()
    if (!json.ok) { error.value = true; return }
    const a = json.data
    article.value = {
      id: a.id,
      title: a.title,
      slug: a.slug,
      author: a.author || 'Sin autor',
      authorAvatar: a.authorAvatar || null,
      authorTitle: a.authorTitle || '',
      excerpt: a.excerpt || '',
      content: a.content || '',
      thumbnail: a.thumbnail || a.image || null,
      category: a.category || '',
      categoryId: a.categoryId || null,
      tags: a.tags || [],
      status: a.status,
      featured: a.featured || false,
      views: a.views || 0,
      likes: a.likes || 0,
      comments: a.comments || 0,
      readingTime: a.readingTime || 0,
      metaTitle: a.metaTitle || null,
      metaDescription: a.metaDescription || null,
      createdAt: a.createdAt || '',
      updatedAt: a.updatedAt || '',
      publishedAt: a.publishedAt || null,
    }
    // Update document title
    document.title = `${article.value.title} — Blog SENA`
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

// ── Fetch all articles (for related / prev-next) ──
const fetchAllArticles = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/blogs?limit=200`)
    const json = await resp.json()
    if (json.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allArticles.value = json.data.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        author: a.author || 'Sin autor',
        authorAvatar: a.authorAvatar || null,
        authorTitle: a.authorTitle || '',
        excerpt: a.excerpt || '',
        content: '',
        thumbnail: a.thumbnail || a.image || null,
        category: a.category || '',
        categoryId: a.categoryId || null,
        tags: a.tags || [],
        status: a.status,
        featured: a.featured || false,
        views: a.views || 0,
        likes: a.likes || 0,
        comments: a.comments || 0,
        readingTime: a.readingTime || 0,
        metaTitle: null,
        metaDescription: null,
        createdAt: a.createdAt || '',
        updatedAt: a.updatedAt || '',
        publishedAt: a.publishedAt || null,
      }))
    }
  } catch { /* silent */ }
}

// ── Computed ──

/** Simple Markdown → HTML renderer for the content field */
const renderedContent = computed(() => {
  if (!article.value) return ''
  let html = article.value.content

  // Convert markdown headings (## / ###) to HTML with IDs for TOC
  html = html.replace(/^### (.+)$/gm, (_m: string, t: string) => {
    const id = slugify(t)
    return `<h3 id="${id}">${escapeHtml(t)}</h3>`
  })
  html = html.replace(/^## (.+)$/gm, (_m: string, t: string) => {
    const id = slugify(t)
    return `<h2 id="${id}">${escapeHtml(t)}</h2>`
  })

  // Bold / italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  // Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="content-image" loading="lazy" />')

  // Underline: <u>text</u> (already HTML, keep as-is)
  // Lists (- item)
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match: string) => `<ul>${match}</ul>`)

  // Paragraphs: wrap remaining lines
  html = html.replace(/^(?!<[huliao])((?!<).+)$/gm, '<p>$1</p>')

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')

  return html
})

const tableOfContents = computed<TOCHeading[]>(() => {
  if (!article.value) return []
  const headings: TOCHeading[] = []
  const regex = /^(#{2,3}) (.+)$/gm
  let match: RegExpExecArray | null
  while ((match = regex.exec(article.value.content)) !== null) {
    const hashes = match[1] ?? '##'
    const text = match[2] ?? ''
    headings.push({
      id: slugify(text),
      text,
      level: hashes.length,
    })
  }
  return headings
})

const currentIndex = computed(() => {
  if (!article.value) return -1
  return allArticles.value.findIndex(a => a.id === article.value!.id)
})
const prevArticle = computed(() => {
  if (currentIndex.value <= 0) return null
  return allArticles.value[currentIndex.value - 1]
})

const nextArticle = computed(() => {
  if (currentIndex.value < 0 || currentIndex.value >= allArticles.value.length - 1) return null
  return allArticles.value[currentIndex.value + 1]
})

const toastClass = computed(() => {
  const map: Record<ToastType, string> = {
    success: 'bg-success text-white border-0',
    info: 'bg-info text-white border-0',
    warning: 'bg-warning text-dark border-0',
    error: 'bg-danger text-white border-0',
  }
  return map[toastType.value]
})
const toastIcon = computed(() => {
  const map: Record<ToastType, string> = {
    success: 'bi bi-check-circle', info: 'bi bi-info-circle',
    warning: 'bi bi-exclamation-triangle', error: 'bi bi-x-circle',
  }
  return map[toastType.value]
})

// ── Methods ──
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

const getInitials = (name: string) => {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
}

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const escapeHtml = (text: string) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// Helper to escape but keep some inline HTML we generate already safe
const escapeHtmlRawInline = (text: string) => {
  return escapeHtml(text)
}

const goToArticle = (id: number) => {
  router.push(`/blog/${id}`)
}

const likeArticle = () => {
  if (!article.value || hasLiked.value) return
  hasLiked.value = true
  article.value.likes++
  showToast('¡Gracias por tu like!', 'success')
}

const shareOn = (platform: string) => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(article.value?.title || '')
  let shareUrl = ''
  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
      break
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      break
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      break
  }
  if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    showToast('Enlace copiado al portapapeles', 'success')
  } catch {
    showToast('No se pudo copiar el enlace', 'warning')
  }
}

const showToast = (message: string, type: ToastType = 'info') => {
  toastMessage.value = message
  toastType.value = type
  if (toastInstance) toastInstance.hide()
  if (toastEl.value) {
    import('bootstrap').then((bs) => {
      toastInstance = new bs.Toast(toastEl.value!, { delay: 3000 })
      toastInstance.show()
    })
  }
}

// ── Lifecycle ──
const loadArticle = async () => {
  const id = route.params.id as string
  if (!id) { error.value = true; loading.value = false; return }
  await Promise.all([fetchArticle(id), fetchAllArticles()])
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadArticle()
})

// Watch route changes (navigating between articles)
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchArticle(newId as string)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<style scoped>
.blog-article-page {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  min-height: 100vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .blog-article-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* ── Loading / Error ── */
.loading-state,
.error-state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Article Hero ── */
.article-hero {
  padding: 4rem 0 3rem;
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.08) 0%, rgba(52, 181, 101, 0.04) 100%);
}

[data-bs-theme="dark"] .article-hero {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.15) 0%, rgba(52, 181, 101, 0.08) 100%);
}

.article-breadcrumb .breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 1.5rem;
}

.article-breadcrumb .breadcrumb-item a {
  color: var(--color-primary, #1E9E4A);
  text-decoration: none;
  font-weight: 500;
}

.article-breadcrumb .breadcrumb-item.active {
  color: var(--color-gray, #6C757D);
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-category-badge {
  margin-bottom: 1rem;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #34B565 100%));
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.article-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  line-height: 1.2;
  margin-bottom: 1rem;
  max-width: 800px;
}

[data-bs-theme="dark"] .article-hero-title {
  color: var(--color-dark, #F8F9FA);
}

.article-hero-excerpt {
  font-size: 1.15rem;
  color: var(--color-gray, #6C757D);
  line-height: 1.6;
  max-width: 700px;
  margin-bottom: 2rem;
}

.article-hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--color-primary, #1E9E4A);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #34B565 100%));
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.avatar-initials.large {
  font-size: 1.5rem;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--color-dark, #212529);
  font-size: 0.95rem;
}

[data-bs-theme="dark"] .author-name {
  color: var(--color-dark, #F8F9FA);
}

.author-title {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

.meta-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.meta-item i {
  color: var(--color-primary, #1E9E4A);
}

/* ── Featured Image ── */
.article-featured-image {
  padding: 0 0 2rem;
  margin-top: -1rem;
}

.featured-image-wrapper {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  max-height: 500px;
}

.featured-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-height: 500px;
}

/* ── Article Main ── */
.article-main {
  padding: 3rem 0 4rem;
}

/* ── Article Body ── */
.article-body {
  background: var(--color-light, white);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

[data-bs-theme="dark"] .article-body {
  background: var(--color-light, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.article-content-rendered {
  font-size: 1.05rem;
  line-height: 1.85;
  color: var(--color-dark, #333);
}

[data-bs-theme="dark"] .article-content-rendered {
  color: var(--color-dark, #ddd);
}

.article-content-rendered :deep(h2) {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(30, 158, 74, 0.2);
}

[data-bs-theme="dark"] .article-content-rendered :deep(h2) {
  color: var(--color-dark, #F8F9FA);
}

.article-content-rendered :deep(h3) {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 2rem 0 0.75rem;
}

[data-bs-theme="dark"] .article-content-rendered :deep(h3) {
  color: var(--color-dark, #F8F9FA);
}

.article-content-rendered :deep(p) {
  margin-bottom: 1.25rem;
}

.article-content-rendered :deep(ul) {
  margin: 1rem 0 1.5rem 1.5rem;
  padding: 0;
}

.article-content-rendered :deep(li) {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.article-content-rendered :deep(a) {
  color: var(--color-primary, #1E9E4A);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px dashed rgba(30, 158, 74, 0.4);
  transition: all 0.2s ease;
}

.article-content-rendered :deep(a:hover) {
  color: #157a38;
  border-bottom-style: solid;
}

.article-content-rendered :deep(img.content-image) {
  max-width: 100%;
  border-radius: 12px;
  margin: 1.5rem 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

/* Código */
.article-content-rendered :deep(pre.code-block) {
  background: var(--color-light, #0f1724);
  color: var(--color-dark, #e6eef8);
  padding: 1rem;
  border-radius: 12px;
  overflow: auto;
  margin: 1rem 0;
  box-shadow: 0 6px 24px rgba(2,6,23,0.35);
}
.article-content-rendered :deep(pre.code-block) code {
  background: transparent;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Source Code Pro', monospace;
  font-size: 0.92rem;
  line-height: 1.5;
}
.article-content-rendered :deep(code.inline-code) {
  background: rgba(0,0,0,0.06);
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
  font-size: 0.92rem;
}

.article-content-rendered :deep(strong) {
  color: var(--color-dark, #212529);
}

[data-bs-theme="dark"] .article-content-rendered :deep(strong) {
  color: var(--color-dark, #F8F9FA);
}

/* ── Tags Section ── */
.article-tags-section {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.tags-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .tags-label {
  color: var(--color-dark, #F8F9FA);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  padding: 0.4rem 0.85rem;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
  border: 1px solid rgba(30, 158, 74, 0.2);
  border-radius: 20px;
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.tag-pill:hover {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #34B565 100%));
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
}

/* ── Actions ── */
.article-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: transparent;
  color: var(--color-gray, #6C757D);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover,
.action-btn.liked {
  border-color: #e74c3c;
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.05);
}

.action-btn.liked i {
  color: #e74c3c;
}

.share-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.share-label {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  font-weight: 500;
}

.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  background: transparent;
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.share-btn:hover {
  background: var(--gradient-primary, linear-gradient(135deg, #1E9E4A 0%, #34B565 100%));
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
}

/* ── Author Card ── */
.author-card {
  margin-top: 2.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.06) 0%, rgba(52, 181, 101, 0.03) 100%);
  border: 1px solid rgba(30, 158, 74, 0.15);
  border-radius: 16px;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

[data-bs-theme="dark"] .author-card {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.12) 0%, rgba(52, 181, 101, 0.06) 100%);
  border-color: rgba(30, 158, 74, 0.25);
}

.author-card-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid var(--color-primary, #1E9E4A);
}

.author-card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-card-avatar .avatar-initials {
  width: 100%;
  height: 100%;
}

.author-card-name {
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin: 0 0 0.25rem;
}

[data-bs-theme="dark"] .author-card-name {
  color: var(--color-dark, #F8F9FA);
}

.author-card-title {
  color: var(--color-primary, #1E9E4A);
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.author-card-bio {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

/* ── Sidebar ── */
.article-sidebar {
  position: sticky;
  top: calc(var(--navbar-height, 72px) + 2rem);
}

.sidebar-widget {
  background: var(--color-light, white);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] .sidebar-widget {
  background: var(--color-light, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.widget-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-dark, #212529);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .widget-title {
  color: var(--color-dark, #F8F9FA);
}

.widget-title i {
  color: var(--color-primary, #1E9E4A);
}

/* TOC */
.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toc-link {
  padding: 0.4rem 0.75rem;
  color: var(--color-gray, #6C757D);
  text-decoration: none;
  font-size: 0.9rem;
  border-left: 3px solid transparent;
  border-radius: 0 6px 6px 0;
  transition: all 0.2s ease;
}

.toc-link:hover {
  color: var(--color-primary, #1E9E4A);
  background: rgba(30, 158, 74, 0.05);
  border-left-color: var(--color-primary, #1E9E4A);
}

.toc-level-3 {
  padding-left: 1.5rem;
  font-size: 0.85rem;
}

/* Related Articles */
.related-articles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-article {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.related-article:hover {
  background: rgba(30, 158, 74, 0.05);
  border-color: rgba(30, 158, 74, 0.15);
  transform: translateX(4px);
}

.related-image {
  width: 70px;
  height: 55px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0 0 0.25rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

[data-bs-theme="dark"] .related-title {
  color: var(--color-dark, #F8F9FA);
}

.related-date {
  font-size: 0.8rem;
  color: var(--color-gray, #6C757D);
}

/* CTA Widget */
.cta-widget {
  text-align: center;
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.08) 0%, rgba(52, 181, 101, 0.04) 100%);
  border-color: rgba(30, 158, 74, 0.15);
}

[data-bs-theme="dark"] .cta-widget {
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.15) 0%, rgba(52, 181, 101, 0.08) 100%);
}

/* ── Article Navigation ── */
.article-navigation {
  padding: 0 0 4rem;
}

.nav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.nav-card {
  background: var(--color-light, white);
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .nav-card {
  background: var(--color-light, #1a1a1a);
  border-color: var(--color-gray-light, #2d2d2d);
}

.nav-card:hover {
  border-color: var(--color-primary, #1E9E4A);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.nav-card.empty {
  visibility: hidden;
}

.nav-card.next {
  text-align: right;
}

.nav-label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-primary, #1E9E4A);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0;
  line-height: 1.4;
}

[data-bs-theme="dark"] .nav-title {
  color: var(--color-dark, #F8F9FA);
}

/* ── Responsive ── */
@media (max-width: 991.98px) {
  .article-hero {
    margin-top: 140px;
    padding: 3rem 0 2rem;
  }

  .article-hero-title {
    font-size: 2.25rem;
  }

  .article-body {
    padding: 1.75rem;
  }

  .article-sidebar {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  .article-hero {
    margin-top: 120px;
    padding: 2rem 0 1.5rem;
  }

  .article-hero-title {
    font-size: 1.75rem;
  }

  .article-hero-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .article-body {
    padding: 1.25rem;
  }

  .author-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .nav-grid {
    grid-template-columns: 1fr;
  }

  .nav-card.empty {
    display: none;
  }

  .article-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .featured-image-wrapper {
    max-height: 300px;
  }
}

@media (max-width: 576px) {
  .article-hero-title {
    font-size: 1.5rem;
  }

  .article-hero-excerpt {
    font-size: 1rem;
  }

  .share-group {
    flex-wrap: wrap;
  }
}
</style>
