<template>
  <div :data-bs-theme="currentTheme" class="blog-admin-page">
    <!-- Header con breadcrumb -->
    <header class="admin-header">
      <div class="container">
        <nav class="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-newspaper"></i> Gestión de Blog
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <i class="bi bi-newspaper me-2"></i>Administración del Blog
            </h1>
            <p class="page-subtitle">
              Gestiona artículos, publicaciones y contenido del blog
            </p>
          </div>

          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-icon total">
                  <i class="bi bi-file-text"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalArticles }}</span>
                  <span class="stat-label">Artículos</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon published">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ publishedArticles }}</span>
                  <span class="stat-label">Publicados</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon views">
                  <i class="bi bi-eye"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalViews.toLocaleString() }}</span>
                  <span class="stat-label">Visitas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Panel principal de dos columnas -->
    <main class="main-content">
      <div class="container">
        <div class="blog-admin-grid">
          <!-- Columna izquierda: Lista de artículos -->
          <div class="articles-column">
            <div class="panel-card">
              <div class="panel-header">
                <div class="panel-title-row">
                  <h3 class="panel-title">
                    <i class="bi bi-list-ul me-2"></i>Artículos
                  </h3>
                  <div class="panel-actions">
                    <button class="btn btn-sm btn-outline-secondary" @click="refreshArticles">
                      <i class="bi bi-arrow-clockwise"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" @click="showNewArticleModal">
                      <i class="bi bi-plus-lg me-1"></i>Nuevo
                    </button>
                  </div>
                </div>

                <div class="filters-row">
                  <div class="search-box">
                    <i class="bi bi-search search-icon"></i>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="search-input"
                      placeholder="Buscar artículos..."
                      @input="handleSearch"
                    >
                    <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>

                  <div class="filter-buttons">
                    <button
                      v-for="filter in statusFilters"
                      :key="filter.value"
                      class="filter-btn"
                      :class="{ 'active': selectedStatus === filter.value }"
                      @click="toggleStatusFilter(filter.value)"
                    >
                      <i :class="filter.icon"></i>
                      {{ filter.label }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="panel-body">
                <div class="articles-list">
                  <div v-if="filteredArticles.length === 0" class="empty-state">
                    <i class="bi bi-file-text empty-icon"></i>
                    <h5>No hay artículos</h5>
                    <p class="text-muted">
                      {{ searchQuery ? 'No se encontraron artículos con esa búsqueda' : 'Comienza creando tu primer artículo' }}
                    </p>
                    <button class="btn btn-primary" @click="showNewArticleModal">
                      <i class="bi bi-plus-lg me-1"></i>Crear primer artículo
                    </button>
                  </div>

                  <div
                    v-for="article in filteredArticles"
                    :key="article.id"
                    class="article-item"
                    :class="{ 'active': selectedArticle?.id === article.id }"
                    @click="selectArticle(article)"
                  >
                    <div class="article-preview">
                      <div class="article-thumbnail">
                        <img
                          v-if="article.thumbnail"
                          :src="article.thumbnail"
                          :alt="article.title"
                          class="thumbnail-img"
                        >
                        <div v-else class="thumbnail-placeholder">
                          <i class="bi bi-image"></i>
                        </div>
                      </div>

                      <div class="article-info">
                        <div class="article-header">
                          <h6 class="article-title">{{ article.title }}</h6>
                          <span class="article-status" :class="getStatusClass(article.status)">
                            {{ getStatusText(article.status) }}
                          </span>
                        </div>

                        <div class="article-meta">
                          <span class="meta-item">
                            <i class="bi bi-calendar3"></i>
                            {{ formatDate(article.createdAt) }}
                          </span>
                          <span class="meta-item">
                            <i class="bi bi-person"></i>
                            {{ article.author }}
                          </span>
                          <span class="meta-item">
                            <i class="bi bi-eye"></i>
                            {{ article.views.toLocaleString() }}
                          </span>
                        </div>

                        <div class="article-excerpt">
                          {{ truncateText(article.excerpt, 100) }}
                        </div>

                        <div class="article-tags">
                          <span
                            v-for="tag in article.tags.slice(0, 3)"
                            :key="tag"
                            class="tag-badge"
                          >
                            {{ tag }}
                          </span>
                          <span v-if="article.tags.length > 3" class="tag-more">
                            +{{ article.tags.length - 3 }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="article-actions">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click.stop="editArticle(article)"
                        title="Editar"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-success"
                        @click.stop="togglePublish(article)"
                        :title="article.status === 'published' ? 'Despublicar' : 'Publicar'"
                      >
                        <i :class="article.status === 'published' ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click.stop="confirmDelete(article)"
                        title="Eliminar"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Paginación -->
                <div v-if="filteredArticles.length > 0" class="pagination-container">
                  <div class="pagination-info">
                    Mostrando {{ startItem }}-{{ endItem }} de {{ filteredArticles.length }} artículos
                  </div>

                  <nav class="pagination">
                    <button
                      class="pagination-btn"
                      :disabled="currentPage === 1"
                      @click="prevPage"
                    >
                      <i class="bi bi-chevron-left"></i>
                    </button>

                    <div class="page-numbers">
                      <button
                        v-for="pageNum in visiblePages"
                        :key="pageNum"
                        class="page-number"
                        :class="{ active: pageNum === currentPage }"
                        @click="currentPage = pageNum"
                      >
                        {{ pageNum }}
                      </button>
                    </div>

                    <button
                      class="pagination-btn"
                      :disabled="currentPage === totalPages"
                      @click="nextPage"
                    >
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Editor/Previsualización -->
          <div class="editor-column">
            <div v-if="selectedArticle" class="panel-card">
              <div class="panel-header">
                <div class="panel-title-row">
                  <h3 class="panel-title">
                    <i class="bi bi-pencil me-2"></i>Editar Artículo
                  </h3>
                  <div class="panel-actions">
                    <button class="btn btn-sm btn-outline-secondary" @click="previewArticle">
                      <i class="bi bi-eye me-1"></i>Previsualizar
                    </button>
                    <button class="btn btn-sm btn-success" @click="saveArticle">
                      <i class="bi bi-save me-1"></i>Guardar
                    </button>
                  </div>
                </div>
              </div>

              <div class="panel-body editor-body">
                <form @submit.prevent="saveArticle" class="article-form">
                  <!-- Título -->
                  <div class="form-group">
                    <label class="form-label">
                      <i class="bi bi-type me-1"></i>Título del artículo *
                    </label>
                    <input
                      v-model="editingArticle.title"
                      type="text"
                      class="form-control"
                      placeholder="Ingresa el título del artículo"
                      required
                    >
                  </div>

                  <!-- Slug -->
                  <div class="form-group">
                    <label class="form-label">
                      <i class="bi bi-link-45deg me-1"></i>URL amigable (slug)
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">/blog/</span>
                      <input
                        v-model="editingArticle.slug"
                        type="text"
                        class="form-control"
                        placeholder="url-amigable-del-articulo"
                      >
                    </div>
                  </div>

                  <!-- Autor y fecha -->
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label">
                          <i class="bi bi-person me-1"></i>Autor *
                        </label>
                        <input
                          v-model="editingArticle.author"
                          type="text"
                          class="form-control"
                          placeholder="Nombre del autor"
                          required
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label">
                          <i class="bi bi-calendar3 me-1"></i>Fecha de publicación
                        </label>
                        <input
                          v-model="editingArticle.publishedAt"
                          type="datetime-local"
                          class="form-control"
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Categoría y estado -->
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label">
                          <i class="bi bi-folder me-1"></i>Categoría
                        </label>
                        <select v-model="editingArticle.category" class="form-select">
                          <option value="">Seleccionar categoría</option>
                          <option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.name"
                          >
                            {{ category.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label">
                          <i class="bi bi-toggle-on me-1"></i>Estado
                        </label>
                        <select v-model="editingArticle.status" class="form-select">
                          <option value="draft">Borrador</option>
                          <option value="published">Publicado</option>
                          <option value="scheduled">Programado</option>
                          <option value="archived">Archivado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Miniatura -->
                  <div class="form-group">
                    <label class="form-label">
                      <i class="bi bi-image me-1"></i>Miniatura del artículo
                    </label>

                    <div class="thumbnail-upload">
                      <div v-if="editingArticle.thumbnail" class="thumbnail-preview">
                        <img :src="editingArticle.thumbnail" :alt="editingArticle.title" class="preview-img">
                        <button type="button" class="btn-remove-thumbnail" @click="removeThumbnail">
                          <i class="bi bi-x"></i>
                        </button>
                      </div>

                      <div v-else class="upload-area" @click="triggerThumbnailUpload">
                        <div class="upload-content">
                          <i class="bi bi-cloud-upload upload-icon"></i>
                          <p class="upload-text">Haz clic para subir una miniatura</p>
                          <small class="text-muted">Recomendado: 1200x630px, máximo 2MB</small>
                        </div>
                        <input
                          ref="thumbnailInput"
                          type="file"
                          accept="image/*"
                          class="d-none"
                          @change="handleThumbnailUpload"
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Extracto -->
                  <div class="form-group">
                    <label class="form-label">
                      <i class="bi bi-text-paragraph me-1"></i>Extracto (descripción corta)
                    </label>
                    <textarea
                      v-model="editingArticle.excerpt"
                      class="form-control"
                      rows="3"
                      placeholder="Breve descripción del artículo que aparecerá en listados"
                      maxlength="200"
                    ></textarea>
                    <div class="text-end mt-1">
                      <small class="text-muted">{{ editingArticle.excerpt?.length ?? 0 }}/200 caracteres</small>
                    </div>
                  </div>

                  <!-- Etiquetas -->
                  <div class="form-group">
                    <label class="form-label">
                      <i class="bi bi-tags me-1"></i>Etiquetas
                    </label>
                    <div class="tags-input">
                      <div class="tags-container">
                        <span
                          v-for="(tag, index) in editingArticle.tags"
                          :key="index"
                          class="tag-badge"
                        >
                          {{ tag }}
                          <button type="button" class="tag-remove" @click="removeTag(index)">
                            <i class="bi bi-x"></i>
                          </button>
                        </span>
                      </div>
                      <div class="tags-input-group">
                        <input
                          v-model="newTag"
                          type="text"
                          class="form-control"
                          placeholder="Escribe una etiqueta y presiona Enter"
                          @keydown.enter.prevent="addTag"
                        >
                        <button type="button" class="btn btn-outline-secondary" @click="addTag">
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Contenido -->
                  <div class="form-group">
                    <label class="form-label">
                      <i class="bi bi-file-text me-1"></i>Contenido del artículo *
                    </label>
                    <div class="editor-toolbar">
                      <div class="toolbar-buttons">
                        <button type="button" class="toolbar-btn" @click="formatText('bold')" title="Negrita">
                          <i class="bi bi-type-bold"></i>
                        </button>
                        <button type="button" class="toolbar-btn" @click="formatText('italic')" title="Itálica">
                          <i class="bi bi-type-italic"></i>
                        </button>
                        <button type="button" class="toolbar-btn" @click="formatText('underline')" title="Subrayado">
                          <i class="bi bi-type-underline"></i>
                        </button>
                        <button type="button" class="toolbar-btn" @click="insertLink" title="Insertar enlace">
                          <i class="bi bi-link-45deg"></i>
                        </button>
                        <button type="button" class="toolbar-btn" @click="insertImage" title="Insertar imagen">
                          <i class="bi bi-image"></i>
                        </button>
                        <button type="button" class="toolbar-btn" @click="formatText('h2')" title="Título 2">
                          <i class="bi bi-type-h2"></i>
                        </button>
                        <button type="button" class="toolbar-btn" @click="formatText('h3')" title="Título 3">
                          <i class="bi bi-type-h3"></i>
                        </button>
                        <button type="button" class="toolbar-btn" @click="formatText('list')" title="Lista">
                          <i class="bi bi-list-ul"></i>
                        </button>
                      </div>
                    </div>
                    <textarea
                      ref="contentEditor"
                      v-model="editingArticle.content"
                      class="form-control editor-textarea"
                      rows="15"
                      placeholder="Escribe el contenido del artículo aquí..."
                      required
                    ></textarea>
                    <div class="text-end mt-1">
                      <small class="text-muted">{{ editingArticle.content?.length ?? 0 }}/10000 caracteres</small>
                    </div>
                  </div>

                  <!-- SEO -->
                  <div class="form-group">
                    <div class="accordion" id="seoAccordion">
                      <div class="accordion-item">
                        <h3 class="accordion-header">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#seoCollapse"
                            aria-expanded="false"
                            aria-controls="seoCollapse"
                          >
                            <i class="bi bi-search me-2"></i>Optimización SEO (Opcional)
                          </button>
                        </h3>
                        <div id="seoCollapse" class="accordion-collapse collapse" data-bs-parent="#seoAccordion">
                          <div class="accordion-body">
                            <div class="form-group mb-3">
                              <label class="form-label">Meta título</label>
                              <input
                                v-model="editingArticle.metaTitle"
                                type="text"
                                class="form-control"
                                :maxlength="60"
                                placeholder="Título para resultados de búsqueda (máx. 60 caracteres)"
                              >
                              <div class="text-end mt-1">
                                <small class="text-muted">{{ editingArticle.metaTitle?.length || 0 }}/60 caracteres</small>
                              </div>
                            </div>

                            <div class="form-group">
                              <label class="form-label">Meta descripción</label>
                              <textarea
                                v-model="editingArticle.metaDescription"
                                class="form-control"
                                rows="3"
                                :maxlength="160"
                                placeholder="Descripción para resultados de búsqueda (máx. 160 caracteres)"
                              ></textarea>
                              <div class="text-end mt-1">
                                <small class="text-muted">{{ editingArticle.metaDescription?.length || 0 }}/160 caracteres</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <!-- Estado vacío del editor -->
            <div v-else class="panel-card empty-editor">
              <div class="empty-editor-content">
                <i class="bi bi-pencil-square empty-editor-icon"></i>
                <h4>Selecciona un artículo</h4>
                <p class="text-muted">
                  Selecciona un artículo de la lista para editarlo o crea uno nuevo
                </p>
                <button class="btn btn-primary" @click="showNewArticleModal">
                  <i class="bi bi-plus-lg me-1"></i>Crear nuevo artículo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de nuevo artículo -->
    <div v-if="showNewModal" class="modal-backdrop show" @click="closeNewModal"></div>
    <div v-if="showNewModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>Crear nuevo artículo
            </h5>
            <button type="button" class="btn-close" @click="closeNewModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="new-option" @click="createArticle('text')">
                  <div class="option-icon">
                    <i class="bi bi-file-text"></i>
                  </div>
                  <h6>Artículo de texto</h6>
                  <p class="text-muted">Artículo estándar con texto y imágenes</p>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="new-option" @click="createArticle('news')">
                  <div class="option-icon">
                    <i class="bi bi-newspaper"></i>
                  </div>
                  <h6>Noticia/anuncio</h6>
                  <p class="text-muted">Para anuncios o noticias importantes</p>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="new-option" @click="createArticle('tutorial')">
                  <div class="option-icon">
                    <i class="bi bi-mortarboard"></i>
                  </div>
                  <h6>Tutorial/guía</h6>
                  <p class="text-muted">Artículo paso a paso o instructivo</p>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="new-option" @click="createArticle('event')">
                  <div class="option-icon">
                    <i class="bi bi-calendar-event"></i>
                  </div>
                  <h6>Evento</h6>
                  <p class="text-muted">Para anunciar eventos o actividades</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="closeNewModal">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="articleToDelete" class="modal-backdrop show" @click="cancelDelete"></div>
    <div v-if="articleToDelete" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-danger me-2"></i>
              Confirmar eliminación
            </h5>
            <button type="button" class="btn-close" @click="cancelDelete"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              Esta acción no se puede deshacer
            </div>

            <div class="article-preview-modal">
              <div class="preview-thumbnail">
                <img
                  v-if="articleToDelete.thumbnail"
                  :src="articleToDelete.thumbnail"
                  :alt="articleToDelete.title"
                >
                <div v-else class="thumbnail-placeholder">
                  <i class="bi bi-image"></i>
                </div>
              </div>
              <div class="preview-info">
                <h6>{{ articleToDelete.title }}</h6>
                <p class="text-muted mb-1">Por {{ articleToDelete.author }} • {{ formatDate(articleToDelete.createdAt) }}</p>
                <p class="mb-0">
                  <span class="badge" :class="getStatusClass(articleToDelete.status)">
                    {{ getStatusText(articleToDelete.status) }}
                  </span>
                </p>
              </div>
            </div>

            <p class="mt-3">
              ¿Estás seguro de que deseas eliminar permanentemente este artículo?
              Se perderán todas las visitas y comentarios asociados.
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteArticle">
              <i class="bi bi-trash me-1"></i>Sí, eliminar artículo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <BaseToast ref="toastRef" toast-id="blogToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// Tipos
type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived'

interface Article {
  id: number
  title: string
  slug: string
  author: string
  excerpt: string
  content: string
  thumbnail?: string
  category: string
  categoryId?: number
  tags: string[]
  status: ArticleStatus
  views: number
  likes: number
  comments: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  metaTitle?: string
  metaDescription?: string
}

interface Category {
  id: number
  name: string
  color: string
  count: number
}

interface StatusFilter {
  value: ArticleStatus | 'all'
  label: string
  icon: string
}

// API
import { API_BASE, getAuthHeaders } from '@/config/api'
import BaseToast from '@/components/UI/BaseToast.vue'
import { useToast, type ToastType } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'


const { toastRef, showToast } = useToast()
// Router
const router = useRouter()

// Estado del tema
const { currentTheme } = useTheme()

// Loading
const loading = ref(false)

// Estado de datos
const articles = ref<Article[]>([])
const categories = ref<Category[]>([])

// ── Funciones de carga desde API ──
const fetchArticles = async () => {
  try {
    loading.value = true
    const resp = await fetch(`${API_BASE}/api/blogs?all=1&limit=200`, {
      headers: { ...getAuthHeaders() }
    })
    const json = await resp.json()
    if (json.ok) {
      articles.value = json.data.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        author: a.author || 'Sin autor',
        excerpt: a.excerpt || '',
        content: a.content || '',
        thumbnail: a.thumbnail || a.image || undefined,
        category: a.category || '',
        categoryId: a.categoryId,
        tags: a.tags || [],
        status: a.status as ArticleStatus,
        views: a.views || 0,
        likes: a.likes || 0,
        comments: a.comments || 0,
        createdAt: a.createdAt || new Date().toISOString(),
        updatedAt: a.updatedAt || new Date().toISOString(),
        publishedAt: a.publishedAt || undefined,
        metaTitle: a.metaTitle || undefined,
        metaDescription: a.metaDescription || undefined,
      }))
    }
  } catch (err) {
    console.error('Error cargando artículos', err)
    showToast('Error al cargar artículos', 'error', 'Error')
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/blogs/categories`)
    const json = await resp.json()
    if (json.ok) {
      categories.value = json.data.map((c: any) => ({
        id: c.id,
        name: c.name,
        color: c.color || '#1E9E4A',
        count: c.count || 0,
      }))
    }
  } catch (err) {
    console.error('Error cargando categorías', err)
  }
}

const statusFilters: StatusFilter[] = [
  { value: 'all', label: 'Todos', icon: 'bi bi-grid-3x3' },
  { value: 'published', label: 'Publicados', icon: 'bi bi-eye' },
  { value: 'draft', label: 'Borradores', icon: 'bi bi-file-earmark' },
  { value: 'scheduled', label: 'Programados', icon: 'bi bi-clock' },
  { value: 'archived', label: 'Archivados', icon: 'bi bi-archive' }
]

// Estado de UI
const searchQuery = ref('')
const selectedStatus = ref<ArticleStatus | 'all'>('all')
const selectedArticle = ref<Article | null>(null)
const editingArticle = ref<Partial<Article>>({})
const showNewModal = ref(false)
const articleToDelete = ref<Article | null>(null)

// Estado para etiquetas
const newTag = ref('')

// Referencias
const contentEditor = ref<HTMLTextAreaElement | null>(null)
const thumbnailInput = ref<HTMLInputElement | null>(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Toast

// Computed
const filteredArticles = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return articles.value.filter(article => {
    // Filtro por búsqueda
    const matchesSearch = !query ||
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))

    // Filtro por estado
    const matchesStatus = selectedStatus.value === 'all' || article.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredArticles.value.length / itemsPerPage.value))
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredArticles.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Estadísticas
const totalArticles = computed(() => articles.value.length)
const publishedArticles = computed(() => articles.value.filter(a => a.status === 'published').length)
const totalViews = computed(() => articles.value.reduce((sum, article) => sum + article.views, 0))

// Paginación helpers
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredArticles.value.length)
)

// Toast helpers



// Métodos
const handleSearch = () => {
  currentPage.value = 1
}

const toggleStatusFilter = (status: ArticleStatus | 'all') => {
  selectedStatus.value = status
  currentPage.value = 1
}

const selectArticle = (article: Article) => {
  selectedArticle.value = article
  editingArticle.value = { ...article }
}

const refreshArticles = async () => {
  await fetchArticles()
  await fetchCategories()
  showToast('Artículos actualizados', 'success', 'Actualización')
}

const showNewArticleModal = () => {
  showNewModal.value = true
}

const closeNewModal = () => {
  showNewModal.value = false
}

const createArticle = async (type: string) => {
  try {
    const catMap: Record<string, string> = {
      text: 'Tutoriales',
      news: 'Eventos',
      tutorial: 'Tutoriales',
      event: 'Eventos',
    }
    const catName = catMap[type] || 'Tutoriales'
    const matchCat = categories.value.find(c => c.name === catName)

    const body: any = {
      title: type === 'text' ? 'Nuevo artículo' :
             type === 'news' ? 'Nueva noticia' :
             type === 'tutorial' ? 'Nuevo tutorial' : 'Nuevo evento',
      excerpt: '',
      content: '',
      categoryId: matchCat?.id || null,
      tags: type === 'text' ? ['nuevo'] :
            type === 'news' ? ['noticia'] :
            type === 'tutorial' ? ['tutorial'] : ['evento'],
      status: 'draft',
    }

    const resp = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body),
    })
    const json = await resp.json()
    if (!json.ok) { showToast(json.message || 'Error', 'error'); return }

    await fetchArticles()
    const created = articles.value.find(a => a.id === json.data.id)
    if (created) { selectArticle(created) }
    showNewModal.value = false
    showToast('Artículo creado', 'success', 'Nuevo artículo')
  } catch (err) {
    console.error(err)
    showToast('Error creando artículo', 'error')
  }
}

const editArticle = (article: Article) => {
  selectArticle(article)
}

const togglePublish = async (article: Article) => {
  const newStatus = article.status === 'published' ? 'draft' : 'published'
  try {
    const resp = await fetch(`${API_BASE}/api/blogs/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status: newStatus }),
    })
    const json = await resp.json()
    if (!json.ok) { showToast(json.message || 'Error', 'error'); return }
    await fetchArticles()
    const action = newStatus === 'published' ? 'publicado' : 'despublicado'
    showToast(`Artículo ${action}`, 'success', 'Estado actualizado')
  } catch (err) {
    console.error(err)
    showToast('Error actualizando estado', 'error')
  }
}

const confirmDelete = (article: Article) => {
  articleToDelete.value = article
}

const cancelDelete = () => {
  articleToDelete.value = null
}

const deleteArticle = async () => {
  if (articleToDelete.value) {
    try {
      const resp = await fetch(`${API_BASE}/api/blogs/${articleToDelete.value.id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      })
      const json = await resp.json()
      if (!json.ok) { showToast(json.message || 'Error', 'error'); return }

      if (selectedArticle.value?.id === articleToDelete.value.id) {
        selectedArticle.value = null
        editingArticle.value = {}
      }
      showToast(`"${articleToDelete.value.title}" eliminado`, 'success', 'Artículo eliminado')
      articleToDelete.value = null
      await fetchArticles()
    } catch (err) {
      console.error(err)
      showToast('Error eliminando artículo', 'error')
    }
  }
}

const saveArticle = async () => {
  if (!editingArticle.value.title || !editingArticle.value.content) {
    showToast('Complete título y contenido', 'warning', 'Campos requeridos')
    return
  }

  try {
    const body: any = {
      title: editingArticle.value.title,
      excerpt: editingArticle.value.excerpt,
      content: editingArticle.value.content,
      categoryId: editingArticle.value.categoryId || null,
      status: editingArticle.value.status,
      tags: editingArticle.value.tags,
      metaTitle: editingArticle.value.metaTitle,
      metaDescription: editingArticle.value.metaDescription,
    }

    // Si el thumbnail es un data URL (nuevo upload), enviarlo
    if (editingArticle.value.thumbnail && editingArticle.value.thumbnail.startsWith('data:')) {
      body.thumbnailDataUrl = editingArticle.value.thumbnail
    }

    const resp = await fetch(`${API_BASE}/api/blogs/${editingArticle.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body),
    })
    const json = await resp.json()
    if (!json.ok) { showToast(json.message || 'Error', 'error'); return }

    await fetchArticles()
    const updated = articles.value.find(a => a.id === editingArticle.value.id)
    if (updated) {
      selectedArticle.value = updated
      editingArticle.value = { ...updated }
    }
    showToast('Artículo guardado', 'success', 'Guardado exitoso')
  } catch (err) {
    console.error(err)
    showToast('Error guardando artículo', 'error')
  }
}

const previewArticle = () => {
  if (selectedArticle.value) {
    const url = `/blog/${selectedArticle.value.id}`
    window.open(url, '_blank')
  }
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusClass = (status: ArticleStatus): string => {
  const classes: Record<ArticleStatus, string> = {
    'draft': 'bg-secondary',
    'published': 'bg-success',
    'scheduled': 'bg-warning',
    'archived': 'bg-danger'
  }
  return classes[status] || 'bg-light text-dark'
}

const getStatusText = (status: ArticleStatus): string => {
  const texts: Record<ArticleStatus, string> = {
    'draft': 'Borrador',
    'published': 'Publicado',
    'scheduled': 'Programado',
    'archived': 'Archivado'
  }
  return texts[status] || 'Desconocido'
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const triggerThumbnailUpload = () => {
  thumbnailInput.value?.click()
}

const handleThumbnailUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      showToast('La imagen debe ser menor a 2MB', 'warning', 'Tamaño excedido')
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      showToast('Solo se permiten imágenes', 'warning', 'Tipo inválido')
      return
    }

    // Crear URL para previsualización
    const reader = new FileReader()
    reader.onload = (e) => {
      editingArticle.value.thumbnail = e.target?.result as string
    }
    reader.readAsDataURL(file)

    showToast('Miniatura cargada', 'success', 'Imagen subida')
  }

  // Limpiar input
  input.value = ''
}

const removeThumbnail = () => {
  editingArticle.value.thumbnail = undefined
}

const addTag = () => {
  if (newTag.value.trim()) {
    if (!editingArticle.value.tags) {
      editingArticle.value.tags = []
    }

    const tag = newTag.value.trim()
    if (!editingArticle.value.tags.includes(tag)) {
      editingArticle.value.tags.push(tag)
    }

    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  if (editingArticle.value.tags) {
    editingArticle.value.tags.splice(index, 1)
  }
}

const formatText = (command: string) => {
  if (!contentEditor.value) return

  const textarea = contentEditor.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  let formattedText = selectedText

  switch (command) {
    case 'bold':
      formattedText = `**${selectedText}**`
      break
    case 'italic':
      formattedText = `*${selectedText}*`
      break
    case 'underline':
      formattedText = `<u>${selectedText}</u>`
      break
    case 'h2':
      formattedText = `## ${selectedText}`
      break
    case 'h3':
      formattedText = `### ${selectedText}`
      break
    case 'list':
      formattedText = `- ${selectedText}`
      break
  }

  const newText = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end)
  editingArticle.value.content = newText

  // Restaurar el foco y selección
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start, start + formattedText.length)
  })
}

const insertLink = () => {
  const url = prompt('Ingresa la URL del enlace:', 'https://')
  if (url) {
    const text = prompt('Texto del enlace:', 'Enlace')
    if (text) {
      formatText('link')
      const linkText = `[${text}](${url})`
      const textarea = contentEditor.value
      if (textarea) {
        const start = textarea.selectionStart
        const newText = textarea.value.substring(0, start) + linkText + textarea.value.substring(textarea.selectionEnd)
        editingArticle.value.content = newText
      }
    }
  }
}

const insertImage = () => {
  const url = prompt('Ingresa la URL de la imagen:', 'https://')
  if (url) {
    const alt = prompt('Texto alternativo:', 'Imagen')
    if (alt) {
      const imageText = `![${alt}](${url})`
      const textarea = contentEditor.value
      if (textarea) {
        const start = textarea.selectionStart
        const newText = textarea.value.substring(0, start) + imageText + textarea.value.substring(textarea.selectionEnd)
        editingArticle.value.content = newText
      }
    }
  }
}


onMounted(async () => {
  // Aplicar tema inicial
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)

  // Cargar datos del API
  await Promise.all([fetchArticles(), fetchCategories()])

  // Seleccionar primer artículo por defecto
  if (articles.value.length > 0 && articles.value[0]) {
    selectArticle(articles.value[0])
  }
})
</script>

<style scoped>
.blog-admin-page {
  font-family: 'Montserrat', sans-serif;
  background: var(--gradient-bg, linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%));
  min-height: 100vh;
}

[data-bs-theme="dark"] .blog-admin-page {
  background: var(--gradient-bg, linear-gradient(135deg, #121212 0%, #1A1A1A 100%));
}

/* Header */

.stat-icon.published {
  background: var(--gradient-primary);
}

.stat-icon.views {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Grid principal */
.main-content {
  padding: 2rem 0;
}

.blog-admin-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  height: calc(100vh - 200px);
}

@media (max-width: 1200px) {
  .blog-admin-grid {
    grid-template-columns: 1fr;
    height: auto;
  }
}

/* Panel de artículos */
.articles-column {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

.panel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
}

.filters-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .filter-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-gray, #6C757D);
}

.filter-btn:hover {
  border-color: var(--color-primary, #1E9E4A);
  color: var(--color-primary, #1E9E4A);
}

.filter-btn.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

.panel-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.article-item {
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--card-bg, white);
}

[data-bs-theme="dark"] .article-item {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary, #1E9E4A);
}

.article-item.active {
  border-color: var(--color-primary, #1E9E4A);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
}

[data-bs-theme="dark"] .article-item.active {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%);
}

.article-preview {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.article-thumbnail {
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background: var(--lab-bg, #f8f9fa);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-light, #E9ECEF);
  font-size: 1.5rem;
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.article-title {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-bs-theme="dark"] .article-title {
  color: var(--color-dark, #F8F9FA);
}

.article-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: white;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.meta-item {
  color: var(--color-gray, #6C757D);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.article-excerpt {
  font-size: 0.9rem;
  color: var(--color-gray, #6C757D);
  line-height: 1.5;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag-badge {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #1E9E4A);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(30, 158, 74, 0.2);
}

[data-bs-theme="dark"] .tag-badge {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
  color: var(--color-primary-light, #34B565);
}

.tag-more {
  font-size: 0.75rem;
  color: var(--color-gray, #6C757D);
  margin-left: 0.25rem;
}

.article-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  padding-top: 1rem;
}

/* Paginación */
.pagination-container {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-primary, #1E9E4A);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .pagination-btn {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  min-width: 36px;
  height: 36px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 8px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .page-number {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
  color: var(--color-dark, #F8F9FA);
}

.page-number:hover {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  border-color: var(--color-primary, #1E9E4A);
}

.page-number.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

/* Editor */
.editor-column {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-body {
  overflow-y: auto;
}

.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.form-control,
.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-gray-light, #E9ECEF);
  border-radius: 10px;
  background: var(--card-bg, white);
  color: var(--color-dark, #212529);
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 0 0 0.25rem rgba(30, 158, 74, 0.25);
}

.thumbnail-upload {
  margin-top: 0.5rem;
}

.thumbnail-preview {
  position: relative;
  width: 200px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--color-gray-light, #E9ECEF);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-thumbnail {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background .15s ease;
}

.btn-remove-thumbnail:hover {
  background: rgba(0,0,0,0.8);
}

/* Misc final spacing */
.modal-backdrop.show { background: rgba(0,0,0,0.45); }

</style>
