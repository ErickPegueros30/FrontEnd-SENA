<template>
  <div :data-bs-theme="currentTheme" class="blog-admin-page">
    <!-- Header con breadcrumb -->
    <header class="admin-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="Ruta de navegación">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
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
      <div class="container-fluid main-container">
        <div class="blog-admin-grid" :class="{ 'focus-mode': isFocusActive }">
          <!-- ============ Columna izquierda: Lista de artículos ============ -->
          <div class="articles-column">
            <div class="panel-card">
              <div class="panel-header">
                <div class="panel-title-row">
                  <h3 class="panel-title">
                    <i class="bi bi-list-ul me-2"></i>Artículos
                    <span class="panel-count">{{ filteredArticles.length }}</span>
                  </h3>
                  <div class="panel-actions">
                    <button
                      class="btn btn-sm btn-outline-secondary"
                      :disabled="loading"
                      title="Recargar lista"
                      aria-label="Recargar lista de artículos"
                      @click="refreshArticles"
                    >
                      <i class="bi bi-arrow-clockwise" :class="{ 'spin': loading }"></i>
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
                      placeholder="Buscar por título, autor o etiqueta..."
                      aria-label="Buscar artículos"
                    >
                    <button
                      v-if="searchQuery"
                      class="clear-search"
                      aria-label="Limpiar búsqueda"
                      @click="searchQuery = ''"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>

                  <div class="filter-buttons" role="group" aria-label="Filtrar por estado">
                    <button
                      v-for="filter in statusFilters"
                      :key="filter.value"
                      class="filter-btn"
                      :class="{ 'active': selectedStatus === filter.value }"
                      :aria-pressed="selectedStatus === filter.value"
                      @click="selectedStatus = filter.value"
                    >
                      <i :class="filter.icon"></i>
                      {{ filter.label }}
                      <span class="filter-count">{{ statusCounts[filter.value] }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="panel-body">
                <div class="articles-list">
                  <!-- Cargando (primera carga) -->
                  <template v-if="loading && articles.length === 0">
                    <div v-for="n in 3" :key="`sk-${n}`" class="skeleton-item" aria-hidden="true">
                      <div class="skeleton-thumb"></div>
                      <div class="skeleton-body">
                        <div class="skeleton-line w-75"></div>
                        <div class="skeleton-line w-50"></div>
                        <div class="skeleton-line w-100"></div>
                      </div>
                    </div>
                  </template>

                  <!-- Sin resultados por filtros -->
                  <div v-else-if="filteredArticles.length === 0 && hasActiveFilters" class="empty-state">
                    <i class="bi bi-funnel empty-icon"></i>
                    <h5>Sin resultados</h5>
                    <p class="text-muted">
                      Ningún artículo coincide con la búsqueda o el filtro seleccionado.
                    </p>
                    <button class="btn btn-outline-secondary" @click="clearFilters">
                      <i class="bi bi-x-circle me-1"></i>Limpiar filtros
                    </button>
                  </div>

                  <!-- Sin artículos -->
                  <div v-else-if="filteredArticles.length === 0" class="empty-state">
                    <i class="bi bi-file-text empty-icon"></i>
                    <h5>No hay artículos</h5>
                    <p class="text-muted">Comienza creando tu primer artículo</p>
                    <button class="btn btn-primary" @click="showNewArticleModal">
                      <i class="bi bi-plus-lg me-1"></i>Crear primer artículo
                    </button>
                  </div>

                  <!-- Lista paginada -->
                  <div
                    v-for="article in paginatedArticles"
                    v-else
                    :key="article.id"
                    class="article-item"
                    :class="{ 'active': selectedArticle?.id === article.id }"
                    role="button"
                    tabindex="0"
                    :aria-current="selectedArticle?.id === article.id ? 'true' : undefined"
                    @click="requestSelectArticle(article)"
                    @keydown.enter.self="requestSelectArticle(article)"
                  >
                    <div class="article-preview">
                      <div class="article-thumbnail">
                        <img
                          v-if="article.thumbnail"
                          :src="article.thumbnail"
                          :alt="article.title"
                          class="thumbnail-img"
                          loading="lazy"
                        >
                        <div v-else class="thumbnail-placeholder">
                          <i class="bi bi-image"></i>
                        </div>
                      </div>

                      <div class="article-info">
                        <div class="article-header">
                          <h6 class="article-title">
                            <span
                              v-if="selectedArticle?.id === article.id && isDirty"
                              class="unsaved-dot"
                              title="Cambios sin guardar"
                            ></span>
                            {{ article.title }}
                          </h6>
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

                        <div v-if="article.excerpt" class="article-excerpt">
                          {{ truncateText(article.excerpt, 100) }}
                        </div>
                        <div v-else class="article-excerpt fst-italic">Sin extracto</div>

                        <div v-if="article.tags.length" class="article-tags">
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
                        title="Editar"
                        aria-label="Editar artículo"
                        @click.stop="editArticle(article)"
                      >
                        <i class="bi bi-pencil"></i>
                        <span class="action-label">Editar</span>
                      </button>
                      <button
                        class="btn btn-sm"
                        :class="article.status === 'published' ? 'btn-outline-secondary' : 'btn-outline-success'"
                        :disabled="togglingId === article.id"
                        :title="article.status === 'published' ? 'Pasar a borrador' : 'Publicar ahora'"
                        @click.stop="togglePublish(article)"
                      >
                        <span v-if="togglingId === article.id" class="spinner-border spinner-border-sm"></span>
                        <i v-else :class="article.status === 'published' ? 'bi bi-eye-slash' : 'bi bi-send'"></i>
                        <span class="action-label">
                          {{ article.status === 'published' ? 'Despublicar' : 'Publicar' }}
                        </span>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        title="Eliminar"
                        aria-label="Eliminar artículo"
                        @click.stop="confirmDelete(article)"
                      >
                        <i class="bi bi-trash"></i>
                        <span class="action-label">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Paginación -->
                <div v-if="filteredArticles.length > 0" class="pagination-container">
                  <div class="pagination-info">
                    Mostrando {{ startItem }}–{{ endItem }} de {{ filteredArticles.length }}
                  </div>

                  <nav v-if="totalPages > 1" class="pagination" aria-label="Paginación">
                    <button
                      class="pagination-btn"
                      :disabled="currentPage === 1"
                      aria-label="Página anterior"
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
                        :aria-current="pageNum === currentPage ? 'page' : undefined"
                        @click="currentPage = pageNum"
                      >
                        {{ pageNum }}
                      </button>
                    </div>

                    <button
                      class="pagination-btn"
                      :disabled="currentPage === totalPages"
                      aria-label="Página siguiente"
                      @click="nextPage"
                    >
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <!-- ============ Columna derecha: Editor ============ -->
          <div ref="editorColumn" class="editor-column">
            <div v-if="selectedArticle" class="panel-card editor-panel">
              <div class="panel-header editor-header">
                <div class="panel-title-row mb-0">
                  <div class="editor-heading">
                    <span class="editor-eyebrow">
                      <i class="bi bi-pencil-square me-1"></i>Editando
                      <span class="article-status ms-2" :class="getStatusClass(editingArticle.status ?? selectedArticle.status)">
                        {{ getStatusText(editingArticle.status ?? selectedArticle.status) }}
                      </span>
                    </span>
                    <h2 class="editor-title" :title="editingArticle.title">
                      {{ editingArticle.title?.trim() || 'Artículo sin título' }}
                    </h2>
                    <span class="save-state" :class="{ dirty: isDirty }" aria-live="polite">
                      <span class="dot"></span>
                      {{ isDirty ? 'Cambios sin guardar' : 'Todo guardado' }}
                    </span>
                  </div>
                  <div class="panel-actions">
                    <button
                      class="btn btn-sm btn-outline-secondary d-none d-xl-inline-flex align-items-center"
                      :title="focusMode ? 'Mostrar la lista de artículos' : 'Ocultar la lista y ampliar el editor'"
                      :aria-pressed="focusMode"
                      @click="toggleFocusMode"
                    >
                      <i :class="focusMode ? 'bi bi-layout-sidebar-inset' : 'bi bi-arrows-angle-expand'" class="me-1"></i>
                      {{ focusMode ? 'Mostrar lista' : 'Ampliar editor' }}
                    </button>
                    <button
                      class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
                      title="Abre la versión guardada en una pestaña nueva"
                      @click="previewArticle"
                    >
                      <i class="bi bi-box-arrow-up-right me-1"></i>Ver en el sitio
                    </button>
                  </div>
                </div>
              </div>

              <div class="panel-body editor-body">
                <form class="article-form" @submit.prevent="saveArticle">
                  <!-- ── Sección: Información básica ── -->
                  <fieldset class="form-section">
                    <legend class="form-section-title">Información básica</legend>

                    <!-- Título -->
                    <div class="form-group">
                      <label class="form-label" for="article-title">
                        <i class="bi bi-type me-1"></i>Título del artículo <span class="required">*</span>
                      </label>
                      <input
                        id="article-title"
                        v-model="editingArticle.title"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': showValidation && !editingArticle.title?.trim() }"
                        placeholder="Ingresa el título del artículo"
                        required
                      >
                      <div class="invalid-feedback">El título es obligatorio.</div>
                    </div>

                    <!-- Slug -->
                    <div class="form-group">
                      <label class="form-label" for="article-slug">
                        <i class="bi bi-link-45deg me-1"></i>URL amigable (slug)
                      </label>
                      <div class="input-group">
                        <span class="input-group-text">/blog/</span>
                        <input
                          id="article-slug"
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
                          <label class="form-label" for="article-author">
                            <i class="bi bi-person me-1"></i>Autor <span class="required">*</span>
                          </label>
                          <input
                            id="article-author"
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
                          <label class="form-label" for="article-published-at">
                            <i class="bi bi-calendar3 me-1"></i>Fecha de publicación
                          </label>
                          <input
                            id="article-published-at"
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
                          <label class="form-label" for="article-category">
                            <i class="bi bi-folder me-1"></i>Categoría
                          </label>
                          <select id="article-category" v-model="editingArticle.categoryId" class="form-select">
                            <option :value="null">Sin categoría</option>
                            <option
                              v-for="category in categories"
                              :key="category.id"
                              :value="category.id"
                            >
                              {{ category.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label" for="article-status">
                            <i class="bi bi-toggle-on me-1"></i>Estado
                          </label>
                          <select id="article-status" v-model="editingArticle.status" class="form-select">
                            <option v-for="s in STATUS_SELECT_ORDER" :key="s" :value="s">
                              {{ STATUS_META[s].label }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <!-- ── Sección: Presentación ── -->
                  <fieldset class="form-section">
                    <legend class="form-section-title">Presentación en listados</legend>

                    <!-- Miniatura -->
                    <div class="form-group">
                      <label class="form-label">
                        <i class="bi bi-image me-1"></i>Miniatura del artículo
                      </label>

                      <div class="thumbnail-upload">
                        <div v-if="editingArticle.thumbnail" class="thumbnail-preview">
                          <img :src="editingArticle.thumbnail" :alt="editingArticle.title" class="preview-img">
                          <div class="thumbnail-actions">
                            <button type="button" class="thumb-action" @click="triggerThumbnailUpload">
                              <i class="bi bi-arrow-repeat me-1"></i>Cambiar
                            </button>
                            <button
                              type="button"
                              class="thumb-action danger"
                              aria-label="Quitar miniatura"
                              @click="removeThumbnail"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>

                        <div
                          v-else
                          class="upload-area"
                          role="button"
                          tabindex="0"
                          @click="triggerThumbnailUpload"
                          @keydown.enter="triggerThumbnailUpload"
                        >
                          <div class="upload-content">
                            <i class="bi bi-cloud-upload upload-icon"></i>
                            <p class="upload-text">Haz clic para subir una miniatura</p>
                            <small class="text-muted">Recomendado: 1200x630px, máximo 2MB</small>
                          </div>
                        </div>

                        <!-- Input único: sirve tanto para subir como para cambiar -->
                        <input
                          ref="thumbnailInput"
                          type="file"
                          accept="image/*"
                          class="d-none"
                          @change="handleThumbnailUpload"
                        >
                      </div>
                    </div>

                    <!-- Extracto -->
                    <div class="form-group">
                      <label class="form-label" for="article-excerpt">
                        <i class="bi bi-text-paragraph me-1"></i>Extracto (descripción corta)
                      </label>
                      <textarea
                        id="article-excerpt"
                        v-model="editingArticle.excerpt"
                        class="form-control"
                        rows="3"
                        placeholder="Breve descripción del artículo que aparecerá en listados"
                        :maxlength="LIMITS.excerpt"
                      ></textarea>
                      <div class="field-footer">
                        <small class="text-muted">Aparece en las tarjetas del blog.</small>
                        <small :class="counterClass(editingArticle.excerpt, LIMITS.excerpt)">
                          {{ editingArticle.excerpt?.length ?? 0 }}/{{ LIMITS.excerpt }}
                        </small>
                      </div>
                    </div>

                    <!-- Etiquetas -->
                    <div class="form-group">
                      <label class="form-label" for="article-new-tag">
                        <i class="bi bi-tags me-1"></i>Etiquetas
                      </label>
                      <div class="tags-input">
                        <div v-if="editingArticle.tags?.length" class="tags-container">
                          <span
                            v-for="(tag, index) in editingArticle.tags"
                            :key="`${tag}-${index}`"
                            class="tag-badge"
                          >
                            {{ tag }}
                            <button
                              type="button"
                              class="tag-remove"
                              :aria-label="`Quitar etiqueta ${tag}`"
                              @click="removeTag(index)"
                            >
                              <i class="bi bi-x"></i>
                            </button>
                          </span>
                        </div>
                        <div class="tags-input-group">
                          <input
                            id="article-new-tag"
                            v-model="newTag"
                            type="text"
                            class="form-control"
                            placeholder="Escribe una etiqueta y presiona Enter"
                            @keydown.enter.prevent="addTag"
                          >
                          <button
                            type="button"
                            class="btn btn-outline-secondary"
                            :disabled="!newTag.trim()"
                            aria-label="Agregar etiqueta"
                            @click="addTag"
                          >
                            <i class="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <!-- ── Sección: Contenido ── -->
                  <fieldset class="form-section">
                    <legend class="form-section-title">Contenido</legend>

                    <div class="form-group">
                      <label class="form-label" for="article-content">
                        <i class="bi bi-file-text me-1"></i>Contenido del artículo <span class="required">*</span>
                      </label>
                      <div class="editor-toolbar" role="toolbar" aria-label="Formato de texto">
                        <div class="toolbar-buttons">
                          <button
                            v-for="tool in TOOLBAR"
                            :key="tool.command"
                            type="button"
                            class="toolbar-btn"
                            :title="tool.title"
                            :aria-label="tool.title"
                            @click="runToolbar(tool.command)"
                          >
                            <i :class="tool.icon"></i>
                          </button>
                        </div>
                        <small class="toolbar-hint">Selecciona texto y aplica un formato</small>
                      </div>
                      <textarea
                        id="article-content"
                        ref="contentEditor"
                        v-model="editingArticle.content"
                        class="form-control editor-textarea"
                        :class="{ 'is-invalid': showValidation && !editingArticle.content?.trim() }"
                        rows="20"
                        placeholder="Escribe el contenido del artículo aquí..."
                        :maxlength="LIMITS.content"
                        required
                      ></textarea>
                      <div class="invalid-feedback">El contenido es obligatorio.</div>
                      <div class="field-footer">
                        <small class="text-muted">Admite formato Markdown.</small>
                        <small :class="counterClass(editingArticle.content, LIMITS.content)">
                          {{ editingArticle.content?.length ?? 0 }}/{{ LIMITS.content }}
                        </small>
                      </div>
                    </div>
                  </fieldset>

                  <!-- ── Sección: SEO ── -->
                  <div class="form-group">
                    <div id="seoAccordion" class="accordion">
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
                              <label class="form-label" for="article-meta-title">Meta título</label>
                              <input
                                id="article-meta-title"
                                v-model="editingArticle.metaTitle"
                                type="text"
                                class="form-control"
                                :maxlength="LIMITS.metaTitle"
                                placeholder="Título para resultados de búsqueda"
                              >
                              <div class="field-footer">
                                <small class="text-muted">Si lo dejas vacío se usa el título.</small>
                                <small :class="counterClass(editingArticle.metaTitle, LIMITS.metaTitle)">
                                  {{ editingArticle.metaTitle?.length || 0 }}/{{ LIMITS.metaTitle }}
                                </small>
                              </div>
                            </div>

                            <div class="form-group">
                              <label class="form-label" for="article-meta-desc">Meta descripción</label>
                              <textarea
                                id="article-meta-desc"
                                v-model="editingArticle.metaDescription"
                                class="form-control"
                                rows="3"
                                :maxlength="LIMITS.metaDescription"
                                placeholder="Descripción para resultados de búsqueda"
                              ></textarea>
                              <div class="field-footer">
                                <small class="text-muted">Si la dejas vacía se usa el extracto.</small>
                                <small :class="counterClass(editingArticle.metaDescription, LIMITS.metaDescription)">
                                  {{ editingArticle.metaDescription?.length || 0 }}/{{ LIMITS.metaDescription }}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <!-- Barra de guardado siempre visible -->
              <div class="editor-footer">
                <small class="keyboard-hint d-none d-md-inline">
                  <kbd>Ctrl</kbd> + <kbd>S</kbd> para guardar
                </small>
                <div class="editor-footer-actions">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    :disabled="!isDirty || saving"
                    @click="discardChanges"
                  >
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Descartar
                  </button>
                  <button
                    type="button"
                    class="btn btn-success"
                    :disabled="!isDirty || saving"
                    @click="saveArticle"
                  >
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi bi-save me-1"></i>
                    {{ saving ? 'Guardando...' : 'Guardar cambios' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado vacío del editor -->
            <div v-else class="panel-card empty-editor">
              <div class="empty-editor-content">
                <i class="bi bi-pencil-square empty-editor-icon"></i>
                <h4>Selecciona un artículo</h4>
                <p class="text-muted">
                  Elige un artículo de la lista para editarlo o crea uno nuevo
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

    <!-- ============ Modal: nuevo artículo ============ -->
    <template v-if="showNewModal">
      <div class="modal-backdrop show" @click="closeNewModal"></div>
      <div class="modal show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="newArticleTitle">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 id="newArticleTitle" class="modal-title">
                <i class="bi bi-plus-circle me-2"></i>¿Qué tipo de artículo quieres crear?
              </h5>
              <button type="button" class="btn-close" aria-label="Cerrar" @click="closeNewModal"></button>
            </div>
            <div class="modal-body">
              <div class="row" :class="{ 'is-locked': creatingType }">
                <div v-for="option in NEW_ARTICLE_OPTIONS" :key="option.type" class="col-md-6 mb-3">
                  <div
                    class="new-option"
                    :class="{ 'is-busy': creatingType === option.type }"
                    role="button"
                    tabindex="0"
                    @click="createArticle(option)"
                    @keydown.enter="createArticle(option)"
                  >
                    <div class="option-icon">
                      <span v-if="creatingType === option.type" class="spinner-border spinner-border-sm"></span>
                      <i v-else :class="option.icon"></i>
                    </div>
                    <h6>{{ option.label }}</h6>
                    <p class="text-muted">{{ option.description }}</p>
                  </div>
                </div>
              </div>
              <p class="text-muted small mb-0">
                Se creará como <strong>borrador</strong>; podrás editarlo antes de publicarlo.
              </p>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-secondary" @click="closeNewModal">
                <i class="bi bi-x-lg me-1"></i>Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ============ Modal: confirmar eliminación ============ -->
    <template v-if="articleToDelete">
      <div class="modal-backdrop show" @click="cancelDelete"></div>
      <div class="modal show d-block" tabindex="-1" role="alertdialog" aria-modal="true" aria-labelledby="deleteTitle">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 id="deleteTitle" class="modal-title">
                <i class="bi bi-exclamation-triangle text-danger me-2"></i>
                Confirmar eliminación
              </h5>
              <button type="button" class="btn-close" aria-label="Cerrar" @click="cancelDelete"></button>
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

              <p class="mt-3 mb-0">
                ¿Seguro que deseas eliminar permanentemente este artículo?
                Se perderán todas las visitas y comentarios asociados.
              </p>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-secondary" :disabled="deleting" @click="cancelDelete">
                <i class="bi bi-x-lg me-1"></i>Cancelar
              </button>
              <button type="button" class="btn btn-danger" :disabled="deleting" @click="deleteArticle">
                <span v-if="deleting" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-trash me-1"></i>
                {{ deleting ? 'Eliminando...' : 'Sí, eliminar artículo' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ============ Modal: cambios sin guardar ============ -->
    <template v-if="pendingAction">
      <div class="modal-backdrop show" @click="cancelDiscard"></div>
      <div class="modal show d-block" tabindex="-1" role="alertdialog" aria-modal="true" aria-labelledby="unsavedTitle">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 id="unsavedTitle" class="modal-title">
                <i class="bi bi-exclamation-circle text-warning me-2"></i>Tienes cambios sin guardar
              </h5>
              <button type="button" class="btn-close" aria-label="Cerrar" @click="cancelDiscard"></button>
            </div>
            <div class="modal-body">
              Si continúas, se perderán los cambios hechos en
              <strong>"{{ editingArticle.title || 'este artículo' }}"</strong>.
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-outline-secondary" @click="cancelDiscard">
                Seguir editando
              </button>
              <button type="button" class="btn btn-outline-danger" @click="confirmDiscard">
                Descartar cambios
              </button>
              <button type="button" class="btn btn-success" :disabled="saving" @click="saveAndContinue">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                Guardar y continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Toast para notificaciones -->
    <BaseToast ref="toastRef" toast-id="blogToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { API_BASE, getAuthHeaders } from '@/config/api'
import BaseToast from '@/components/UI/BaseToast.vue'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'

/* ============================================================
   Tipos
   ============================================================ */
type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived'
type StatusFilterValue = ArticleStatus | 'all'
type NewArticleType = 'text' | 'news' | 'tutorial' | 'event'
type ToolbarCommand = 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'h2' | 'h3' | 'list'

interface Article {
  id: number
  title: string
  slug: string
  author: string
  excerpt: string
  content: string
  thumbnail?: string
  category: string
  categoryId?: number | null
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
  value: StatusFilterValue
  label: string
  icon: string
}

interface NewArticleOption {
  type: NewArticleType
  icon: string
  label: string
  description: string
  defaultTitle: string
  defaultTag: string
  categoryName: string
}

/* ============================================================
   Configuración (fuente única de verdad)
   ============================================================ */
const STATUS_META: Record<ArticleStatus, { label: string; plural: string; icon: string; badgeClass: string }> = {
  draft:     { label: 'Borrador',   plural: 'Borradores',  icon: 'bi bi-file-earmark', badgeClass: 'bg-secondary' },
  published: { label: 'Publicado',  plural: 'Publicados',  icon: 'bi bi-eye',          badgeClass: 'bg-success' },
  // text-dark: el amarillo con texto blanco no era legible
  scheduled: { label: 'Programado', plural: 'Programados', icon: 'bi bi-clock',        badgeClass: 'bg-warning text-dark' },
  archived:  { label: 'Archivado',  plural: 'Archivados',  icon: 'bi bi-archive',      badgeClass: 'bg-danger' }
}

const STATUS_FILTER_ORDER: ArticleStatus[] = ['published', 'draft', 'scheduled', 'archived']
const STATUS_SELECT_ORDER: ArticleStatus[] = ['draft', 'published', 'scheduled', 'archived']

const statusFilters: StatusFilter[] = [
  { value: 'all', label: 'Todos', icon: 'bi bi-grid-3x3' },
  ...STATUS_FILTER_ORDER.map(s => ({ value: s, label: STATUS_META[s].plural, icon: STATUS_META[s].icon }))
]

const NEW_ARTICLE_OPTIONS: NewArticleOption[] = [
  { type: 'text',     icon: 'bi bi-file-text',      label: 'Artículo de texto', description: 'Artículo estándar con texto y imágenes', defaultTitle: 'Nuevo artículo', defaultTag: 'nuevo',    categoryName: 'Tutoriales' },
  { type: 'news',     icon: 'bi bi-newspaper',      label: 'Noticia/anuncio',   description: 'Para anuncios o noticias importantes',  defaultTitle: 'Nueva noticia',  defaultTag: 'noticia',  categoryName: 'Eventos' },
  { type: 'tutorial', icon: 'bi bi-mortarboard',    label: 'Tutorial/guía',     description: 'Artículo paso a paso o instructivo',    defaultTitle: 'Nuevo tutorial', defaultTag: 'tutorial', categoryName: 'Tutoriales' },
  { type: 'event',    icon: 'bi bi-calendar-event', label: 'Evento',            description: 'Para anunciar eventos o actividades',   defaultTitle: 'Nuevo evento',   defaultTag: 'evento',   categoryName: 'Eventos' }
]

const TOOLBAR: { command: ToolbarCommand; icon: string; title: string }[] = [
  { command: 'bold',      icon: 'bi bi-type-bold',      title: 'Negrita' },
  { command: 'italic',    icon: 'bi bi-type-italic',    title: 'Itálica' },
  { command: 'underline', icon: 'bi bi-type-underline', title: 'Subrayado' },
  { command: 'link',      icon: 'bi bi-link-45deg',     title: 'Insertar enlace' },
  { command: 'image',     icon: 'bi bi-image',          title: 'Insertar imagen' },
  { command: 'h2',        icon: 'bi bi-type-h2',        title: 'Título 2' },
  { command: 'h3',        icon: 'bi bi-type-h3',        title: 'Título 3' },
  { command: 'list',      icon: 'bi bi-list-ul',        title: 'Lista' }
]

const LIMITS = {
  excerpt: 200,
  content: 10000,
  metaTitle: 60,
  metaDescription: 160
} as const

const MAX_THUMBNAIL_BYTES = 2 * 1024 * 1024

/* ============================================================
   Composables
   ============================================================ */
const { toastRef, showToast } = useToast()
const { currentTheme } = useTheme()

/* ============================================================
   Estado
   ============================================================ */
const articles = ref<Article[]>([])
const categories = ref<Category[]>([])

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const creatingType = ref<NewArticleType | null>(null)
const togglingId = ref<number | null>(null)

const searchQuery = ref('')
const selectedStatus = ref<StatusFilterValue>('all')
const selectedArticle = ref<Article | null>(null)
const editingArticle = ref<Partial<Article>>({})
const editingSnapshot = ref('')
const showValidation = ref(false)

const showNewModal = ref(false)
const articleToDelete = ref<Article | null>(null)
const pendingAction = ref<(() => void) | null>(null)

const newTag = ref('')

const contentEditor = ref<HTMLTextAreaElement | null>(null)
const thumbnailInput = ref<HTMLInputElement | null>(null)
const editorColumn = ref<HTMLElement | null>(null)

const currentPage = ref(1)
const itemsPerPage = ref(10)

/* ------------------------------------------------------------
   Modo enfoque: oculta la lista y da todo el ancho al editor.
   Se recuerda entre visitas (preferencia de interfaz, no datos).
   ------------------------------------------------------------ */
const FOCUS_MODE_KEY = 'blogAdmin:focusMode'

const readFocusMode = (): boolean => {
  try { return localStorage.getItem(FOCUS_MODE_KEY) === '1' } catch { return false }
}

const focusMode = ref(readFocusMode())

// Sin artículo abierto la lista siempre se muestra: si no, no habría cómo elegir uno
const isFocusActive = computed(() => focusMode.value && !!selectedArticle.value)

const toggleFocusMode = () => {
  focusMode.value = !focusMode.value
  try { localStorage.setItem(FOCUS_MODE_KEY, focusMode.value ? '1' : '0') } catch { /* modo privado */ }
  if (focusMode.value) scrollToEditor()
}

/* ============================================================
   API
   ============================================================ */
const fetchArticles = async () => {
  try {
    loading.value = true
    const resp = await fetch(`${API_BASE}/api/blogs?all=1&limit=200`, {
      headers: { ...getAuthHeaders() }
    })
    const json = await resp.json()
    if (json.ok) {
      articles.value = json.data.map((a: any): Article => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        author: a.author || 'Sin autor',
        excerpt: a.excerpt || '',
        content: a.content || '',
        thumbnail: a.thumbnail || a.image || undefined,
        category: a.category || '',
        categoryId: a.categoryId != null ? Number(a.categoryId) : null,
        tags: a.tags || [],
        status: a.status as ArticleStatus,
        views: a.views || 0,
        likes: a.likes || 0,
        comments: a.comments || 0,
        createdAt: a.createdAt || new Date().toISOString(),
        updatedAt: a.updatedAt || new Date().toISOString(),
        publishedAt: a.publishedAt || undefined,
        metaTitle: a.metaTitle || undefined,
        metaDescription: a.metaDescription || undefined
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
      categories.value = json.data.map((c: any): Category => ({
        id: Number(c.id),
        name: c.name,
        color: c.color || '#1E9E4A',
        count: c.count || 0
      }))
    }
  } catch (err) {
    console.error('Error cargando categorías', err)
  }
}

/* ============================================================
   Listado: filtros, conteos y paginación
   ============================================================ */
const filteredArticles = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return articles.value.filter(article => {
    const matchesSearch = !query ||
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))

    const matchesStatus = selectedStatus.value === 'all' || article.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const statusCounts = computed<Record<StatusFilterValue, number>>(() => {
  const counts: Record<StatusFilterValue, number> = { all: articles.value.length, draft: 0, published: 0, scheduled: 0, archived: 0 }
  for (const a of articles.value) counts[a.status] = (counts[a.status] ?? 0) + 1
  return counts
})

const hasActiveFilters = computed(() => !!searchQuery.value.trim() || selectedStatus.value !== 'all')

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredArticles.value.length / itemsPerPage.value))
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredArticles.value.slice(start, start + itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredArticles.value.length)
)

// Estadísticas
const totalArticles = computed(() => articles.value.length)
const publishedArticles = computed(() => statusCounts.value.published)
const totalViews = computed(() => articles.value.reduce((sum, article) => sum + article.views, 0))

// Cualquier cambio de búsqueda o filtro vuelve a la página 1 (incluye el botón "x")
watch([searchQuery, selectedStatus], () => { currentPage.value = 1 })

// Si la lista se reduce (p. ej. al eliminar), no quedarse en una página vacía
watch(totalPages, (total) => {
  if (currentPage.value > total) currentPage.value = total
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
}

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

/* ============================================================
   Edición: copia de trabajo y detección de cambios
   ============================================================ */

// Convierte ISO -> formato que entiende <input type="datetime-local">
const toLocalInput = (iso?: string): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Copia profunda de lo editable: el array tags ya no se comparte con la lista
const cloneForEdit = (article: Article): Partial<Article> => ({
  ...article,
  tags: [...(article.tags || [])],
  publishedAt: toLocalInput(article.publishedAt),
  categoryId: article.categoryId ?? categories.value.find(c => c.name === article.category)?.id ?? null
})

const serialize = (a: Partial<Article>) => JSON.stringify(a)

const setEditing = (article: Article) => {
  editingArticle.value = cloneForEdit(article)
  editingSnapshot.value = serialize(editingArticle.value)
  showValidation.value = false
  newTag.value = ''
}

const isDirty = computed(() =>
  !!selectedArticle.value && serialize(editingArticle.value) !== editingSnapshot.value
)

const selectArticle = (article: Article) => {
  selectedArticle.value = article
  setEditing(article)
}

/**
 * Lleva al usuario al editor después de elegir un artículo.
 * - Una columna (≤1200px): el editor está debajo de la lista, se baja hasta él.
 * - Dos columnas: se alinea el área de trabajo con la parte superior de la
 *   ventana para que el editor la llene y la barra de guardado quede visible.
 *   Solo se desplaza si el header aún ocupa pantalla (evita saltos innecesarios).
 */
const scrollToEditor = () => {
  nextTick(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth'

    if (window.matchMedia('(max-width: 1200px)').matches) {
      editorColumn.value?.scrollIntoView({ behavior, block: 'start' })
      return
    }

    const grid = editorColumn.value?.parentElement
    if (grid && grid.getBoundingClientRect().top > 24) {
      grid.scrollIntoView({ behavior, block: 'start' })
    }
  })
}

// Ejecuta una acción, pidiendo confirmación si hay cambios sin guardar
const guardUnsaved = (action: () => void) => {
  if (isDirty.value) pendingAction.value = action
  else action()
}

const requestSelectArticle = (article: Article) => {
  if (selectedArticle.value?.id === article.id) {
    scrollToEditor()
    return
  }
  guardUnsaved(() => {
    selectArticle(article)
    scrollToEditor()
  })
}

const editArticle = (article: Article) => requestSelectArticle(article)

const confirmDiscard = () => {
  const action = pendingAction.value
  pendingAction.value = null
  action?.()
}

const cancelDiscard = () => { pendingAction.value = null }

const saveAndContinue = async () => {
  const ok = await saveArticle()
  if (ok) confirmDiscard()
}

const discardChanges = () => {
  if (!selectedArticle.value) return
  setEditing(selectedArticle.value)
  showToast('Cambios descartados', 'info')
}

/* ============================================================
   Acciones CRUD
   ============================================================ */
const refreshArticles = async () => {
  await Promise.all([fetchArticles(), fetchCategories()])
  showToast('Artículos actualizados', 'success', 'Actualización')
}

const showNewArticleModal = () => {
  guardUnsaved(() => { showNewModal.value = true })
}

const closeNewModal = () => {
  if (creatingType.value) return
  showNewModal.value = false
}

const createArticle = async (option: NewArticleOption) => {
  if (creatingType.value) return
  creatingType.value = option.type

  try {
    const matchCat = categories.value.find(c => c.name === option.categoryName)

    const body = {
      title: option.defaultTitle,
      excerpt: '',
      content: '',
      categoryId: matchCat?.id || null,
      tags: [option.defaultTag],
      status: 'draft'
    }

    const resp = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body)
    })
    const json = await resp.json()
    if (!json.ok) { showToast(json.message || 'Error', 'error'); return }

    // Limpiar filtros para que el nuevo borrador sea visible en la lista
    clearFilters()
    await fetchArticles()
    const created = articles.value.find(a => a.id === json.data.id)
    if (created) {
      selectArticle(created)
      scrollToEditor()
      nextTick(() => document.getElementById('article-title')?.focus())
    }
    showNewModal.value = false
    showToast('Borrador creado. Completa los datos y guarda.', 'success', 'Nuevo artículo')
  } catch (err) {
    console.error(err)
    showToast('Error creando artículo', 'error')
  } finally {
    creatingType.value = null
  }
}

const togglePublish = async (article: Article) => {
  if (togglingId.value) return
  const newStatus: ArticleStatus = article.status === 'published' ? 'draft' : 'published'
  togglingId.value = article.id

  try {
    const resp = await fetch(`${API_BASE}/api/blogs/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status: newStatus })
    })
    const json = await resp.json()
    if (!json.ok) { showToast(json.message || 'Error', 'error'); return }

    await fetchArticles()

    // Mantener el editor sincronizado si es el artículo abierto, sin perder ediciones
    if (selectedArticle.value?.id === article.id) {
      const fresh = articles.value.find(a => a.id === article.id)
      if (fresh) {
        selectedArticle.value = fresh
        if (isDirty.value) {
          editingArticle.value.status = newStatus
          const snap = JSON.parse(editingSnapshot.value)
          snap.status = newStatus
          editingSnapshot.value = JSON.stringify(snap)
        } else {
          setEditing(fresh)
        }
      }
    }

    const action = newStatus === 'published' ? 'publicado' : 'pasado a borrador'
    showToast(`Artículo ${action}`, 'success', 'Estado actualizado')
  } catch (err) {
    console.error(err)
    showToast('Error actualizando estado', 'error')
  } finally {
    togglingId.value = null
  }
}

const confirmDelete = (article: Article) => { articleToDelete.value = article }

const cancelDelete = () => {
  if (deleting.value) return
  articleToDelete.value = null
}

const deleteArticle = async () => {
  if (!articleToDelete.value || deleting.value) return
  deleting.value = true
  const target = articleToDelete.value

  try {
    const resp = await fetch(`${API_BASE}/api/blogs/${target.id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    })
    const json = await resp.json()
    if (!json.ok) { showToast(json.message || 'Error', 'error'); return }

    if (selectedArticle.value?.id === target.id) {
      selectedArticle.value = null
      editingArticle.value = {}
      editingSnapshot.value = ''
    }
    showToast(`"${target.title}" eliminado`, 'success', 'Artículo eliminado')
    articleToDelete.value = null
    await fetchArticles()
  } catch (err) {
    console.error(err)
    showToast('Error eliminando artículo', 'error')
  } finally {
    deleting.value = false
  }
}

// Devuelve true si se guardó correctamente (lo usa "Guardar y continuar")
const saveArticle = async (): Promise<boolean> => {
  if (saving.value || !editingArticle.value.id) return false

  if (!editingArticle.value.title?.trim() || !editingArticle.value.content?.trim()) {
    showValidation.value = true
    showToast('Completa título y contenido', 'warning', 'Campos requeridos')
    return false
  }

  saving.value = true
  try {
    const body: Record<string, unknown> = {
      title: editingArticle.value.title,
      excerpt: editingArticle.value.excerpt,
      content: editingArticle.value.content,
      categoryId: editingArticle.value.categoryId || null,
      status: editingArticle.value.status,
      tags: editingArticle.value.tags,
      metaTitle: editingArticle.value.metaTitle,
      metaDescription: editingArticle.value.metaDescription
    }

    // Si el thumbnail es un data URL (nuevo upload), enviarlo
    if (editingArticle.value.thumbnail?.startsWith('data:')) {
      body.thumbnailDataUrl = editingArticle.value.thumbnail
    }

    const resp = await fetch(`${API_BASE}/api/blogs/${editingArticle.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body)
    })
    const json = await resp.json()
    if (!json.ok) { showToast(json.message || 'Error', 'error'); return false }

    const savedId = editingArticle.value.id
    await fetchArticles()
    const updated = articles.value.find(a => a.id === savedId)
    if (updated) selectArticle(updated)

    showToast('Artículo guardado', 'success', 'Guardado exitoso')
    return true
  } catch (err) {
    console.error(err)
    showToast('Error guardando artículo', 'error')
    return false
  } finally {
    saving.value = false
  }
}

const previewArticle = () => {
  if (!selectedArticle.value) return
  if (isDirty.value) {
    showToast('La vista previa muestra la última versión guardada', 'info')
  }
  window.open(`/blog/${selectedArticle.value.id}`, '_blank')
}

/* ============================================================
   Helpers de presentación
   ============================================================ */
const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

const getStatusClass = (status: ArticleStatus): string =>
  STATUS_META[status]?.badgeClass ?? 'bg-light text-dark'

const getStatusText = (status: ArticleStatus): string =>
  STATUS_META[status]?.label ?? 'Desconocido'

const truncateText = (text: string, maxLength: number): string =>
  text.length <= maxLength ? text : text.substring(0, maxLength) + '...'

// Contador en ámbar al 90% y en rojo al llegar al límite
const counterClass = (value: string | undefined, max: number): string => {
  const len = value?.length ?? 0
  if (len >= max) return 'text-danger fw-semibold'
  if (len >= max * 0.9) return 'text-warning fw-semibold'
  return 'text-muted'
}

/* ============================================================
   Miniatura
   ============================================================ */
const triggerThumbnailUpload = () => { thumbnailInput.value?.click() }

const handleThumbnailUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    if (file.size > MAX_THUMBNAIL_BYTES) {
      showToast('La imagen debe ser menor a 2MB', 'warning', 'Tamaño excedido')
    } else if (!file.type.startsWith('image/')) {
      showToast('Solo se permiten imágenes', 'warning', 'Tipo inválido')
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        editingArticle.value.thumbnail = e.target?.result as string
        showToast('Miniatura lista. Guarda para aplicarla.', 'success', 'Imagen cargada')
      }
      reader.readAsDataURL(file)
    }
  }

  // Limpiar input para permitir volver a elegir el mismo archivo
  input.value = ''
}

const removeThumbnail = () => { editingArticle.value.thumbnail = undefined }

/* ============================================================
   Etiquetas
   ============================================================ */
const addTag = () => {
  const tag = newTag.value.trim()
  if (!tag) return

  if (!editingArticle.value.tags) editingArticle.value.tags = []

  if (editingArticle.value.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
    showToast(`La etiqueta "${tag}" ya existe`, 'info')
  } else {
    editingArticle.value.tags.push(tag)
  }
  newTag.value = ''
}

const removeTag = (index: number) => {
  editingArticle.value.tags?.splice(index, 1)
}

/* ============================================================
   Barra de formato del editor
   ============================================================ */
const WRAPPERS: Partial<Record<ToolbarCommand, (t: string) => string>> = {
  bold: t => `**${t}**`,
  italic: t => `*${t}*`,
  underline: t => `<u>${t}</u>`,
  h2: t => `## ${t}`,
  h3: t => `### ${t}`,
  list: t => `- ${t}`
}

/**
 * Reemplaza la selección actual del textarea con el resultado de `build`.
 * Si no hay selección usa `placeholder` y lo deja seleccionado para que
 * el usuario escriba encima (antes se insertaba "****" vacío).
 */
const replaceSelection = (build: (selected: string) => string, placeholder = '') => {
  const textarea = contentEditor.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const current = editingArticle.value.content ?? ''
  const hadSelection = start !== end
  const selected = hadSelection ? current.substring(start, end) : placeholder
  const inserted = build(selected)

  editingArticle.value.content = current.substring(0, start) + inserted + current.substring(end)

  nextTick(() => {
    textarea.focus()
    const offset = inserted.indexOf(selected)
    if (!hadSelection && selected && offset >= 0) {
      textarea.setSelectionRange(start + offset, start + offset + selected.length)
    } else {
      textarea.setSelectionRange(start, start + inserted.length)
    }
  })
}

const insertLink = () => {
  const textarea = contentEditor.value
  const selected = textarea ? textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) : ''
  const url = prompt('Ingresa la URL del enlace:', 'https://')
  if (!url) return
  const text = prompt('Texto del enlace:', selected || 'Enlace')
  if (!text) return
  replaceSelection(() => `[${text}](${url})`)
}

const insertImage = () => {
  const url = prompt('Ingresa la URL de la imagen:', 'https://')
  if (!url) return
  const alt = prompt('Texto alternativo:', 'Imagen')
  if (!alt) return
  replaceSelection(() => `![${alt}](${url})`)
}

const runToolbar = (command: ToolbarCommand) => {
  if (command === 'link') return insertLink()
  if (command === 'image') return insertImage()
  const wrap = WRAPPERS[command]
  if (wrap) replaceSelection(wrap, 'texto')
}

/* ============================================================
   Teclado y protección de salida
   ============================================================ */
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + S -> guardar
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    if (selectedArticle.value) {
      e.preventDefault()
      if (isDirty.value) saveArticle()
    }
    return
  }

  // Escape -> cerrar el modal superior
  if (e.key === 'Escape') {
    if (pendingAction.value) cancelDiscard()
    else if (articleToDelete.value) cancelDelete()
    else if (showNewModal.value) closeNewModal()
  }
}

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onBeforeRouteLeave(() => {
  if (isDirty.value && !window.confirm('Tienes cambios sin guardar. ¿Salir de todos modos?')) {
    return false
  }
})

/* ============================================================
   Ciclo de vida
   ============================================================ */
onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('beforeunload', handleBeforeUnload)

  await Promise.all([fetchArticles(), fetchCategories()])

  // Seleccionar primer artículo por defecto
  const first = articles.value[0]
  if (first) selectArticle(first)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('beforeunload', handleBeforeUnload)
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

/* Más ancho que .container (1320px): el editor aprovecha monitores grandes */
.main-container {
  max-width: 1680px;
  padding-inline: clamp(1rem, 2vw, 2rem);
}

/*
 * La lista tiene un ancho acotado (sus tarjetas no ganan nada al crecer)
 * y todo el espacio restante es para el editor.
 * La altura ocupa casi todo el viewport: al hacer scroll más allá del
 * header, el editor llena la pantalla.
 */
.blog-admin-grid {
  display: grid;
  grid-template-columns: minmax(320px, 400px) minmax(0, 1fr);
  gap: 1.5rem;
  height: calc(100vh - 1.5rem);
  min-height: 640px;
  scroll-margin-top: 0.75rem;
}

/* Modo enfoque: solo el editor, a todo el ancho */
@media (min-width: 1201px) {
  .blog-admin-grid.focus-mode {
    grid-template-columns: minmax(0, 1fr);
  }

  .blog-admin-grid.focus-mode .articles-column {
    display: none;
  }

  /* Con todo el ancho, el formulario se centra con un ancho cómodo de lectura */
  .blog-admin-grid.focus-mode .article-form {
    max-width: 1040px;
    width: 100%;
    margin-inline: auto;
  }
}

@media (max-width: 1200px) {
  .blog-admin-grid {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 0;
  }

  /* En una columna el editor no tiene caja fija: crece con su contenido */
  .editor-panel {
    height: auto;
  }

  .editor-panel .editor-body {
    overflow: visible;
  }

  /* La barra de guardado queda pegada abajo mientras se hace scroll */
  .editor-panel .editor-footer {
    position: sticky;
    bottom: 0;
    z-index: 5;
    box-shadow: 0 -6px 18px rgba(0, 0, 0, 0.08);
  }
}

/* Panel de artículos */
.articles-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  container-type: inline-size;
  container-name: articles;
}

/* Columna angosta: tarjetas más compactas, acciones solo con ícono */
@container articles (max-width: 420px) {
  .article-item { padding: 0.85rem; }
  .article-thumbnail { width: 64px; height: 48px; }
  .article-excerpt { -webkit-line-clamp: 1; }
  .article-meta { gap: 0.6rem; font-size: 0.8rem; }
  .action-label { display: none; }
}

.panel-card {
  background: var(--card-bg, white);
  border-radius: 16px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.03) 100%));
  border-radius: 16px 16px 0 0;
}

.panel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.panel-title {
  display: flex;
  align-items: center;
  margin: 0;
}

.panel-count {
  margin-left: 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  background: rgba(30, 158, 74, 0.12);
  color: var(--color-primary, #1E9E4A);
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
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

.search-input:focus {
  outline: none;
  border-color: var(--color-primary, #1E9E4A);
  box-shadow: 0 0 0 0.2rem rgba(30, 158, 74, 0.2);
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

.filter-count {
  min-width: 1.4rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.4rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.06);
}

[data-bs-theme="dark"] .filter-count {
  background: rgba(255, 255, 255, 0.1);
}

.filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.25);
}

.panel-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  min-height: 0;
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

.empty-icon {
  font-size: 2.5rem;
  color: var(--color-gray, #6C757D);
  opacity: 0.5;
  display: block;
  margin-bottom: 0.75rem;
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

.article-item:focus-visible {
  outline: 3px solid rgba(30, 158, 74, 0.35);
  outline-offset: 2px;
}

.article-item.active {
  border-color: var(--color-primary, #1E9E4A);
  border-left-width: 4px;
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

.unsaved-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e0a100;
  margin-right: 0.4rem;
  vertical-align: middle;
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

.article-actions .btn {
  display: inline-flex;
  align-items: center;
}

.action-label {
  margin-left: 0.35rem;
}

@media (max-width: 576px) {
  .action-label { display: none; }
}

/* Skeleton de carga */
.skeleton-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  border-radius: 12px;
}

.skeleton-body { flex: 1; }

.skeleton-thumb {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  flex-shrink: 0;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  margin-bottom: 0.6rem;
}

.skeleton-thumb,
.skeleton-line {
  background: linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.12) 37%, rgba(0,0,0,0.06) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

[data-bs-theme="dark"] .skeleton-thumb,
[data-bs-theme="dark"] .skeleton-line {
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.05) 63%);
  background-size: 400% 100%;
}

@keyframes shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

.spin { display: inline-block; animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Paginación */
.pagination-container {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination-info {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
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
  min-height: 0;
  scroll-margin-top: 1rem;
}

.editor-body {
  overflow-y: auto;
  padding: 2rem clamp(1.25rem, 2.5vw, 2.5rem);
}

/* Panel del editor: acento superior para marcarlo como área principal */
.editor-panel {
  border-top: 4px solid var(--color-primary, #1E9E4A);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.editor-header {
  padding: 1.25rem clamp(1.25rem, 2.5vw, 2.5rem);
  border-radius: 12px 12px 0 0;
}

.editor-header .panel-title-row {
  align-items: flex-start;
}

.editor-heading {
  min-width: 0;
  flex: 1;
}

.editor-eyebrow {
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0.35rem;
}

.editor-eyebrow .article-status {
  margin-left: 0;
}

.editor-title {
  font-size: clamp(1.25rem, 1.6vw, 1.6rem);
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-dark, #212529);
  margin: 0 0 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-bs-theme="dark"] .editor-title {
  color: var(--color-dark, #F8F9FA);
}

.editor-header .panel-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* Área de contenido: el campo más importante, el más grande */
.editor-textarea {
  min-height: 460px;
  font-size: 1rem;
  line-height: 1.7;
  resize: vertical;
}

.editor-toolbar .toolbar-btn {
  min-width: 36px;
  min-height: 36px;
}

.editor-panel .editor-footer {
  padding: 1rem clamp(1.25rem, 2.5vw, 2.5rem);
}

/* Campos principales un poco más grandes */
.editor-panel #article-title {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Estado vacío del editor con presencia */
.empty-editor {
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--color-gray-light, #E9ECEF);
  box-shadow: none;
}

.empty-editor-content {
  text-align: center;
  max-width: 420px;
  padding: 3rem 1.5rem;
}

.empty-editor-icon {
  display: block;
  font-size: 3rem;
  color: var(--color-primary, #1E9E4A);
  opacity: 0.6;
  margin-bottom: 1rem;
}

.save-state {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.35rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-primary, #1E9E4A);
}

.save-state .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.save-state.dirty {
  color: #b87900;
}

[data-bs-theme="dark"] .save-state.dirty {
  color: #f0b429;
}

.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 0;
  margin: 0;
  padding: 0;
}

.form-section + .form-section {
  padding-top: 1.5rem;
  border-top: 1px dashed var(--color-gray-light, #E9ECEF);
}

.form-section-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-gray, #6C757D);
  margin-bottom: 0;
  float: none;
  width: auto;
}

.form-label {
  font-weight: 600;
  color: var(--color-dark, #212529);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.required {
  color: #dc3545;
  margin-left: 0.2rem;
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

.form-control.is-invalid {
  border-color: #dc3545;
}

.field-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.35rem;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.toolbar-hint {
  color: var(--color-gray, #6C757D);
  font-size: 0.78rem;
}

.thumbnail-upload {
  margin-top: 0.5rem;
}

.thumbnail-preview {
  position: relative;
  width: 240px;
  height: 126px; /* 1200x630 a escala */
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--color-gray-light, #E9ECEF);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-actions {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.65), transparent);
}

.thumb-action {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.92);
  color: #212529;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.thumb-action:hover {
  background: #ffffff;
}

.thumb-action.danger {
  color: #dc3545;
}

.upload-area:focus-visible {
  outline: 3px solid rgba(30, 158, 74, 0.35);
  outline-offset: 2px;
}

/* Barra inferior de guardado */
.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  background: var(--card-bg, white);
  border-radius: 0 0 16px 16px;
}

.editor-footer-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.keyboard-hint {
  color: var(--color-gray, #6C757D);
}

.keyboard-hint kbd {
  font-size: 0.72rem;
  padding: 0.1rem 0.35rem;
  background: rgba(0, 0, 0, 0.08);
  color: inherit;
  border-radius: 4px;
}

[data-bs-theme="dark"] .keyboard-hint kbd {
  background: rgba(255, 255, 255, 0.12);
}

/* Modales */
.modal-backdrop.show { background: rgba(0,0,0,0.45); }

.new-option.is-busy {
  opacity: 0.7;
}

.is-locked .new-option {
  pointer-events: none;
}

.is-locked .new-option:not(.is-busy) {
  opacity: 0.45;
}

.new-option:focus-visible {
  outline: 3px solid rgba(30, 158, 74, 0.35);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-thumb,
  .skeleton-line,
  .spin { animation: none; }
  .article-item:hover { transform: none; }
}
</style>
