<template>
  <div :data-bs-theme="currentTheme" class="article-page">
    <!-- Header Superior -->
    <HeaderTop
      :current-theme="currentTheme"
      @toggle-theme="toggleTheme"
    />

    <!-- Navbar Principal -->
    <NavbarMain
      :current-theme="currentTheme"
      @toggle-theme="toggleTheme"
    />

    <!-- Article Hero -->
    <section class="article-hero">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Inicio</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/blog">Blog</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ article.title }}</li>
          </ol>
        </nav>

        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="article-header">
              <div class="article-category">{{ getCategoryName(article.categoryId) }}</div>
              <h1 class="article-title">{{ article.title }}</h1>
              <div class="article-meta">
                <div class="author-info">
                  <div class="author-avatar">{{ article.authorAvatar }}</div>
                  <div>
                    <h6>{{ article.author }}</h6>
                    <small>{{ article.authorTitle }}</small>
                  </div>
                </div>
                <div class="meta-info">
                  <span class="date">
                    <i class="bi bi-calendar"></i>
                    {{ formatDate(article.publishedAt) }}
                  </span>
                  <span class="reading-time">
                    <i class="bi bi-clock"></i>
                    {{ article.readingTime }} min de lectura
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Article Content -->
    <article class="article-content-section">
      <div class="container">
        <div class="row">
          <!-- Main Content -->
          <div class="col-lg-8">
            <div class="article-content">
              <!-- Featured Image -->
              <div class="featured-image">
                <img :src="article.image" :alt="article.title" />
              </div>

              <!-- Article Body -->
              <div class="article-body">
                <!-- Aquí iría el contenido completo del artículo -->
                <!-- Por ahora usaremos un placeholder -->
                <p>{{ article.excerpt }}</p>

                <h2>Introducción</h2>
                <p>La implementación de sistemas de gestión de calidad en laboratorios es fundamental para garantizar la confiabilidad de los resultados analíticos. En este artículo exploraremos las mejores prácticas y consideraciones clave.</p>

                <h3>Beneficios clave</h3>
                <ul>
                  <li>Mejora en la precisión de las mediciones</li>
                  <li>Reducción de errores y reprocesos</li>
                  <li>Mayor confianza de los clientes</li>
                  <li>Cumplimiento regulatorio</li>
                </ul>

                <h3>Consideraciones prácticas</h3>
                <p>La implementación exitosa requiere un enfoque sistemático que involucre a todo el personal del laboratorio.</p>

                <blockquote class="blockquote">
                  <p>"La calidad nunca es un accidente; siempre es el resultado de un esfuerzo inteligente."</p>
                  <footer class="blockquote-footer">John Ruskin</footer>
                </blockquote>

                <h2>Conclusión</h2>
                <p>La implementación de sistemas de calidad es una inversión que genera beneficios significativos a corto, mediano y largo plazo.</p>
              </div>

              <!-- Article Tags -->
              <div class="article-tags">
                <h5>Etiquetas:</h5>
                <div class="tags-list">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Share Buttons -->
              <div class="share-section">
                <h5>Compartir:</h5>
                <div class="share-buttons">
                  <button class="btn btn-outline-primary">
                    <i class="bi bi-facebook"></i> Facebook
                  </button>
                  <button class="btn btn-outline-info">
                    <i class="bi bi-twitter"></i> Twitter
                  </button>
                  <button class="btn btn-outline-linkedin">
                    <i class="bi bi-linkedin"></i> LinkedIn
                  </button>
                  <button class="btn btn-outline-secondary">
                    <i class="bi bi-link-45deg"></i> Copiar enlace
                  </button>
                </div>
              </div>

              <!-- Author Bio -->
              <div class="author-bio">
                <div class="author-image">
                  <div class="avatar">{{ article.authorAvatar }}</div>
                </div>
                <div class="author-details">
                  <h4>{{ article.author }}</h4>
                  <p class="author-title">{{ article.authorTitle }}</p>
                  <p class="bio">Especialista con más de 15 años de experiencia en implementación de sistemas de calidad en laboratorios. Ha colaborado con más de 50 organizaciones en procesos de acreditación.</p>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="comments-section">
              <h3 class="section-title">Comentarios ({{ article.comments }})</h3>
              <!-- Aquí irían los comentarios -->
              <div class="no-comments text-center py-4">
                <i class="bi bi-chat-text display-4 text-muted mb-3"></i>
                <h5>No hay comentarios aún</h5>
                <p>Sé el primero en comentar este artículo</p>
              </div>
            </div>

            <!-- Related Articles -->
            <div class="related-articles">
              <h3 class="section-title">Artículos relacionados</h3>
              <div class="row">
                <div
                  v-for="related in relatedArticles"
                  :key="related.id"
                  class="col-md-6 mb-4"
                >
                  <div class="related-card" @click="viewArticle(related)">
                    <div class="related-image">
                      <img :src="related.image" :alt="related.title" />
                    </div>
                    <div class="related-content">
                      <h5>{{ related.title }}</h5>
                      <div class="related-meta">
                        <small>{{ formatDate(related.publishedAt) }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Same sidebar as blog page -->
            <!-- Puedes reutilizar el componente sidebar -->
          </div>
        </div>
      </div>
    </article>

    <!-- Footer -->
    <FooterComponent :current-theme="currentTheme" />
  </div>
</template>

<script setup lang="ts">
// Implementación similar a BlogPage.vue para la página individual
</script>

<style scoped>
/* Estilos específicos para la página de artículo */
</style>
