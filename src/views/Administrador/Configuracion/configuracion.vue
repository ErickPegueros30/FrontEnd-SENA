<template>
  <div :data-bs-theme="currentTheme" class="admin-config-page">

    <!-- Header con breadcrumb -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumb-nav" aria-label="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-separator">
              <i class="bi bi-chevron-right"></i>
            </li>
            <li class="breadcrumb-item active">
              <i class="bi bi-gear"></i> Configuración del Sitio
            </li>
          </ol>
        </nav>

        <div class="header-content">
          <div class="header-text">
            <span class="section-eyebrow">Administración</span>
            <h1 class="page-title">Configuración del Sitio</h1>
            <p class="page-subtitle">Personaliza y gestiona cada sección de la página web</p>
          </div>

          <div class="header-actions">
            <button class="action-btn primary" @click="saveAllConfig">
              <i class="bi bi-check-lg"></i>
              <span>Guardar Todo</span>
            </button>
            <button class="action-btn secondary" @click="resetConfig">
              <i class="bi bi-arrow-counterclockwise"></i>
              <span>Restaurar Valores</span>
            </button>
            <button class="action-btn secondary" @click="previewSite">
              <i class="bi bi-eye"></i>
              <span>Vista Previa</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navegación de secciones -->
    <section class="sections-nav">
      <div class="container">
        <div class="nav-card">
          <div class="nav-scroll">
            <button
              v-for="section in sections"
              :key="section.id"
              class="nav-btn"
              :class="{ active: activeSection === section.id }"
              @click="scrollToSection(section.id)"
            >
              <i :class="section.icon"></i>
              <span>{{ section.label }}</span>
              <span class="nav-badge" v-if="hasChanges(section.id)">
                <i class="bi bi-pencil-fill"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenido de configuración -->
    <main class="config-content">
      <div class="container">

        <!-- HOME Section -->
        <div class="config-section" id="section-home" ref="sectionHome">
          <div class="section-card">
            <div class="section-header" @click="toggleSection('home')">
              <div class="section-title-wrap">
                <div class="section-icon home">
                  <i class="bi bi-house-fill"></i>
                </div>
                <div>
                  <h2 class="section-title">Home - Página Principal</h2>
                  <p class="section-desc">Configura el carrusel, texto institucional y elementos principales</p>
                </div>
              </div>
              <div class="section-actions">
                <span class="status-badge" :class="hasChanges('home') ? 'modified' : 'saved'">
                  {{ hasChanges('home') ? 'Modificado' : 'Guardado' }}
                </span>
                <i :class="expandedSections.has('home') ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="toggle-icon"></i>
              </div>
            </div>

            <div class="section-body" v-show="expandedSections.has('home')">
              <!-- Carrusel -->
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-images"></i> Carrusel Principal
                </h4>
                <div class="config-grid">
                  <div class="config-field">
                    <label class="field-label">Intervalo del carrusel (segundos)</label>
                    <input type="number" v-model.number="config.home.carouselInterval" class="field-input" min="3" max="10" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Tamaño máximo de imagen (MB)</label>
                    <input type="number" v-model.number="config.home.maxImageSize" class="field-input" min="1" max="10" />
                  </div>
                </div>
                  <div class="config-field mt-3">
                    <label class="field-label">Gestionar imágenes del carrusel</label>
                    <div style="display:flex;gap:0.6rem;align-items:center;">
                      <input type="file" accept="image/*" @change="onCarouselFileChange" />
                      <button class="action-btn secondary" @click="uploadCarouselImage">Subir imagen</button>
                      <button class="action-btn secondary" @click="fetchCarousel">Refrescar</button>
                    </div>
                    <div style="margin-top:0.8rem;display:flex;gap:0.6rem;flex-wrap:wrap;">
                      <div v-for="item in carouselItems" :key="item.id" style="width:120px;text-align:center;border:1px solid var(--sena-border);padding:6px;border-radius:8px;">
                        <img :src="item.ubicacion" alt="carrusel" style="width:100%;height:70px;object-fit:cover;border-radius:6px;" />
                        <div style="margin-top:6px;display:flex;gap:6px;justify-content:center;">
                          <button class="icon-btn danger" @click="deleteCarouselItem(item.id)"><i class="bi bi-trash"></i></button>
                        </div>
                      </div>
                    </div>
                    <div class="field-hint">Las imágenes se suben al servidor y se muestran en la página principal.</div>
                  </div>
                <div class="field-hint">
                  <i class="bi bi-info-circle"></i>
                  Las imágenes del carrusel se gestionan desde la sección de medios
                </div>
              </div>

              <!-- Texto institucional -->
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-blockquote-left"></i> Texto Institucional
                </h4>
                <div class="config-field">
                  <label class="field-label">Texto principal</label>
                  <textarea v-model="config.home.introText" class="field-textarea" rows="5"></textarea>
                </div>
                <div class="config-grid">
                  <div class="config-field">
                    <label class="field-label">Año de fundación</label>
                    <input type="text" v-model="config.home.foundingYear" class="field-input" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Años de experiencia</label>
                    <input type="text" v-model="config.home.experienceYears" class="field-input" />
                  </div>
                </div>
              </div>

              <!-- Sección ¿Por qué elegirnos? -->
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-star-fill"></i> ¿Por qué elegirnos?
                </h4>
                <div class="config-field">
                  <label class="field-label">Título de la sección</label>
                  <input type="text" v-model="config.home.whyUsTitle" class="field-input" />
                </div>
                <div class="features-editor">
                  <div v-for="(feature, idx) in config.home.features" :key="idx" class="feature-item">
                    <div class="feature-header">
                      <span class="feature-number">{{ idx + 1 }}</span>
                      <button class="icon-btn danger" @click="removeFeature(idx)" v-if="config.home.features.length > 1">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                    <div class="config-grid">
                      <div class="config-field">
                        <label class="field-label">Icono (clase Bootstrap)</label>
                        <input type="text" v-model="feature.icon" class="field-input" placeholder="bi bi-award-fill" />
                      </div>
                      <div class="config-field">
                        <label class="field-label">Título</label>
                        <input type="text" v-model="feature.title" class="field-input" />
                      </div>
                    </div>
                    <div class="config-field">
                      <label class="field-label">Descripción</label>
                      <textarea v-model="feature.description" class="field-textarea" rows="2"></textarea>
                    </div>
                  </div>
                  <button class="add-btn" @click="addFeature">
                    <i class="bi bi-plus-lg"></i> Agregar característica
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SERVICIOS Section -->
        <div class="config-section" id="section-servicios" ref="sectionServicios">
          <div class="section-card">
            <div class="section-header" @click="toggleSection('servicios')">
              <div class="section-title-wrap">
                <div class="section-icon servicios">
                  <i class="bi bi-grid-fill"></i>
                </div>
                <div>
                  <h2 class="section-title">Servicios</h2>
                  <p class="section-desc">Configura ensayos, cursos y comparaciones interlaboratorio</p>
                </div>
              </div>
              <div class="section-actions">
                <span class="status-badge" :class="hasChanges('servicios') ? 'modified' : 'saved'">
                  {{ hasChanges('servicios') ? 'Modificado' : 'Guardado' }}
                </span>
                <i :class="expandedSections.has('servicios') ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="toggle-icon"></i>
              </div>
            </div>

            <div class="section-body" v-show="expandedSections.has('servicios')">
              <!-- Ensayos de Aptitud -->
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-clipboard-data"></i> Ensayos de Aptitud
                </h4>
                <div class="config-field">
                  <label class="field-label">Título de la página</label>
                  <input type="text" v-model="config.servicios.ensayos.title" class="field-input" />
                </div>
                <div class="config-field">
                  <label class="field-label">Descripción</label>
                  <textarea v-model="config.servicios.ensayos.description" class="field-textarea" rows="3"></textarea>
                </div>
                <div class="config-grid">
                  <div class="config-field">
                    <label class="field-label">Servicios mostrados por fila</label>
                    <select v-model.number="config.servicios.ensayos.itemsPerRow" class="field-select">
                      <option :value="4">4</option>
                      <option :value="6">6</option>
                      <option :value="8">8</option>
                    </select>
                  </div>
                  <div class="config-field">
                    <label class="field-label">Mostrar precios</label>
                    <div class="toggle-switch">
                      <input type="checkbox" v-model="config.servicios.ensayos.showPrices" id="showPrices" />
                      <label for="showPrices"></label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cursos -->
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-book-fill"></i> Cursos de Capacitación
                </h4>
                <div class="config-field">
                  <label class="field-label">Título de la página</label>
                  <input type="text" v-model="config.servicios.cursos.title" class="field-input" />
                </div>
                <div class="config-field">
                  <label class="field-label">Descripción</label>
                  <textarea v-model="config.servicios.cursos.description" class="field-textarea" rows="3"></textarea>
                </div>
                <div class="config-grid">
                  <div class="config-field">
                    <label class="field-label">Cursos por página</label>
                    <input type="number" v-model.number="config.servicios.cursos.perPage" class="field-input" min="6" max="24" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Modalidad por defecto</label>
                    <select v-model="config.servicios.cursos.defaultMode" class="field-select">
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Comparaciones Interlaboratorio -->
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-arrow-left-right"></i> Comparaciones Interlaboratorio
                </h4>
                <div class="config-field">
                  <label class="field-label">Título de la página</label>
                  <input type="text" v-model="config.servicios.interlab.title" class="field-input" />
                </div>
                <div class="config-field">
                  <label class="field-label">Descripción</label>
                  <textarea v-model="config.servicios.interlab.description" class="field-textarea" rows="3"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- NOSOTROS Section -->
        <div class="config-section" id="section-nosotros" ref="sectionNosotros">
          <div class="section-card">
            <div class="section-header" @click="toggleSection('nosotros')">
              <div class="section-title-wrap">
                <div class="section-icon nosotros">
                  <i class="bi bi-people-fill"></i>
                </div>
                <div>
                  <h2 class="section-title">Nosotros</h2>
                  <p class="section-desc">Información corporativa, historia, misión y visión</p>
                </div>
              </div>
              <div class="section-actions">
                <span class="status-badge" :class="hasChanges('nosotros') ? 'modified' : 'saved'">
                  {{ hasChanges('nosotros') ? 'Modificado' : 'Guardado' }}
                </span>
                <i :class="expandedSections.has('nosotros') ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="toggle-icon"></i>
              </div>
            </div>

            <div class="section-body" v-show="expandedSections.has('nosotros')">
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-info-circle-fill"></i> Información Principal
                </h4>
                <div class="config-grid">
                  <div class="config-field">
                    <label class="field-label">Título de la página</label>
                    <input type="text" v-model="config.nosotros.pageTitle" class="field-input" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Subtítulo</label>
                    <input type="text" v-model="config.nosotros.subtitle" class="field-input" />
                  </div>
                </div>
              </div>

              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-book-fill"></i> Historia
                </h4>
                <div class="config-field">
                  <label class="field-label">Contenido</label>
                  <textarea v-model="config.nosotros.historia" class="field-textarea" rows="4"></textarea>
                </div>
              </div>

              <div class="config-grid">
                <div class="config-group">
                  <h4 class="group-title">
                    <i class="bi bi-bullseye"></i> Misión
                  </h4>
                  <div class="config-field">
                    <textarea v-model="config.nosotros.mision" class="field-textarea" rows="3"></textarea>
                  </div>
                </div>

                <div class="config-group">
                  <h4 class="group-title">
                    <i class="bi bi-eye-fill"></i> Visión
                  </h4>
                  <div class="config-field">
                    <textarea v-model="config.nosotros.vision" class="field-textarea" rows="3"></textarea>
                  </div>
                </div>
              </div>

              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-heart-fill"></i> Valores
                </h4>
                <div class="values-editor">
                  <div v-for="(value, idx) in config.nosotros.valores" :key="idx" class="value-item">
                    <i class="bi bi-grip-vertical drag-handle"></i>
                    <input type="text" v-model="value.text" class="field-input" />
                    <button class="icon-btn danger" @click="removeValue(idx)" v-if="config.nosotros.valores.length > 1">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <button class="add-btn" @click="addValue">
                    <i class="bi bi-plus-lg"></i> Agregar valor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- BLOG Section -->
        <div class="config-section" id="section-blog" ref="sectionBlog">
          <div class="section-card">
            <div class="section-header" @click="toggleSection('blog')">
              <div class="section-title-wrap">
                <div class="section-icon blog">
                  <i class="bi bi-journal-text"></i>
                </div>
                <div>
                  <h2 class="section-title">Blog</h2>
                  <p class="section-desc">Configuración de artículos, categorías y comentarios</p>
                </div>
              </div>
              <div class="section-actions">
                <span class="status-badge" :class="hasChanges('blog') ? 'modified' : 'saved'">
                  {{ hasChanges('blog') ? 'Modificado' : 'Guardado' }}
                </span>
                <i :class="expandedSections.has('blog') ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="toggle-icon"></i>
              </div>
            </div>

            <div class="section-body" v-show="expandedSections.has('blog')">
              <div class="config-grid">
                <div class="config-group">
                  <h4 class="group-title">
                    <i class="bi bi-sliders"></i> General
                  </h4>
                  <div class="config-field">
                    <label class="field-label">Artículos por página</label>
                    <input type="number" v-model.number="config.blog.postsPerPage" class="field-input" min="6" max="24" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Extracto (caracteres)</label>
                    <input type="number" v-model.number="config.blog.excerptLength" class="field-input" min="100" max="500" />
                  </div>
                </div>

                <div class="config-group">
                  <h4 class="group-title">
                    <i class="bi bi-chat-dots-fill"></i> Comentarios
                  </h4>
                  <div class="config-field">
                    <label class="field-label">Permitir comentarios</label>
                    <div class="toggle-switch">
                      <input type="checkbox" v-model="config.blog.allowComments" id="allowComments" />
                      <label for="allowComments"></label>
                    </div>
                  </div>
                  <div class="config-field">
                    <label class="field-label">Moderar comentarios</label>
                    <div class="toggle-switch">
                      <input type="checkbox" v-model="config.blog.moderateComments" id="moderateComments" />
                      <label for="moderateComments"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- EVENTOS Section -->
        <div class="config-section" id="section-eventos" ref="sectionEventos">
          <div class="section-card">
            <div class="section-header" @click="toggleSection('eventos')">
              <div class="section-title-wrap">
                <div class="section-icon eventos">
                  <i class="bi bi-calendar-event-fill"></i>
                </div>
                <div>
                  <h2 class="section-title">Eventos</h2>
                  <p class="section-desc">Gestión de eventos, calendario y notificaciones</p>
                </div>
              </div>
              <div class="section-actions">
                <span class="status-badge" :class="hasChanges('eventos') ? 'modified' : 'saved'">
                  {{ hasChanges('eventos') ? 'Modificado' : 'Guardado' }}
                </span>
                <i :class="expandedSections.has('eventos') ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="toggle-icon"></i>
              </div>
            </div>

            <div class="section-body" v-show="expandedSections.has('eventos')">
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-sliders"></i> Configuración General
                </h4>
                <div class="config-grid">
                  <div class="config-field">
                    <label class="field-label">Eventos por página</label>
                    <input type="number" v-model.number="config.eventos.perPage" class="field-input" min="6" max="24" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Vista predeterminada</label>
                    <select v-model="config.eventos.defaultView" class="field-select">
                      <option value="grid">Cuadrícula</option>
                      <option value="list">Lista</option>
                      <option value="calendar">Calendario</option>
                    </select>
                  </div>
                  <div class="config-field">
                    <label class="field-label">Mostrar eventos pasados</label>
                    <div class="toggle-switch">
                      <input type="checkbox" v-model="config.eventos.showPastEvents" id="showPastEvents" />
                      <label for="showPastEvents"></label>
                    </div>
                  </div>
                  <div class="config-field">
                    <label class="field-label">Permitir registro en línea</label>
                    <div class="toggle-switch">
                      <input type="checkbox" v-model="config.eventos.allowRegistration" id="allowRegistration" />
                      <label for="allowRegistration"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ACREDITACIONES Section -->
        <div class="config-section" id="section-acreditaciones" ref="sectionAcreditaciones">
          <div class="section-card">
            <div class="section-header" @click="toggleSection('acreditaciones')">
              <div class="section-title-wrap">
                <div class="section-icon acreditaciones">
                  <i class="bi bi-patch-check-fill"></i>
                </div>
                <div>
                  <h2 class="section-title">Acreditaciones</h2>
                  <p class="section-desc">Gestión de certificaciones, reconocimientos y logotipos</p>
                </div>
              </div>
              <div class="section-actions">
                <span class="status-badge" :class="hasChanges('acreditaciones') ? 'modified' : 'saved'">
                  {{ hasChanges('acreditaciones') ? 'Modificado' : 'Guardado' }}
                </span>
                <i :class="expandedSections.has('acreditaciones') ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="toggle-icon"></i>
              </div>
            </div>

            <div class="section-body" v-show="expandedSections.has('acreditaciones')">
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-sliders"></i> Configuración
                </h4>
                <div class="config-field">
                  <label class="field-label">Título de la sección</label>
                  <input type="text" v-model="config.acreditaciones.sectionTitle" class="field-input" />
                </div>
                <div class="config-field">
                  <label class="field-label">Descripción</label>
                  <textarea v-model="config.acreditaciones.description" class="field-textarea" rows="3"></textarea>
                </div>
              </div>

              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-file-earmark-check-fill"></i> Certificaciones
                </h4>
                <div class="acreditaciones-editor">
                  <div v-for="(accred, idx) in config.acreditaciones.items" :key="idx" class="acreditacion-item">
                    <div class="acreditacion-header">
                      <span class="feature-number">{{ idx + 1 }}</span>
                      <button class="icon-btn danger" @click="removeAcreditacion(idx)" v-if="config.acreditaciones.items.length > 1">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                    <div class="config-grid">
                      <div class="config-field">
                        <label class="field-label">Título</label>
                        <input type="text" v-model="accred.title" class="field-input" />
                      </div>
                      <div class="config-field">
                        <label class="field-label">Icono</label>
                        <input type="text" v-model="accred.icon" class="field-input" />
                      </div>
                    </div>
                    <div class="config-field">
                      <label class="field-label">Descripción</label>
                      <textarea v-model="accred.description" class="field-textarea" rows="2"></textarea>
                    </div>
                  </div>
                  <button class="add-btn" @click="addAcreditacion">
                    <i class="bi bi-plus-lg"></i> Agregar certificación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTACTO Section -->
        <div class="config-section" id="section-contacto" ref="sectionContacto">
          <div class="section-card">
            <div class="section-header" @click="toggleSection('contacto')">
              <div class="section-title-wrap">
                <div class="section-icon contacto">
                  <i class="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <h2 class="section-title">Contacto</h2>
                  <p class="section-desc">Información de contacto, formularios y ubicación</p>
                </div>
              </div>
              <div class="section-actions">
                <span class="status-badge" :class="hasChanges('contacto') ? 'modified' : 'saved'">
                  {{ hasChanges('contacto') ? 'Modificado' : 'Guardado' }}
                </span>
                <i :class="expandedSections.has('contacto') ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="toggle-icon"></i>
              </div>
            </div>

            <div class="section-body" v-show="expandedSections.has('contacto')">
              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-geo-alt-fill"></i> Información de Contacto
                </h4>
                <div class="config-grid">
                  <div class="config-field">
                    <label class="field-label">Dirección</label>
                    <input type="text" v-model="config.contacto.address" class="field-input" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Teléfono principal</label>
                    <input type="tel" v-model="config.contacto.phone" class="field-input" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Email principal</label>
                    <input type="email" v-model="config.contacto.email" class="field-input" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Horario de atención</label>
                    <input type="text" v-model="config.contacto.schedule" class="field-input" />
                  </div>
                </div>
              </div>

              <div class="config-group">
                <h4 class="group-title">
                  <i class="bi bi-chat-dots-fill"></i> Formulario de Contacto
                </h4>
                <div class="config-grid">
                  <div class="config-field">
                    <label class="field-label">Email destinatario</label>
                    <input type="email" v-model="config.contacto.formEmail" class="field-input" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Asunto predeterminado</label>
                    <input type="text" v-model="config.contacto.formSubject" class="field-input" />
                  </div>
                  <div class="config-field">
                    <label class="field-label">Mostrar mapa</label>
                    <div class="toggle-switch">
                      <input type="checkbox" v-model="config.contacto.showMap" id="showMap" />
                      <label for="showMap"></label>
                    </div>
                  </div>
                  <div class="config-field">
                    <label class="field-label">Mostrar redes sociales</label>
                    <div class="toggle-switch">
                      <input type="checkbox" v-model="config.contacto.showSocial" id="showSocial" />
                      <label for="showSocial"></label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="config-group" v-if="config.contacto.showSocial">
                <h4 class="group-title">
                  <i class="bi bi-share-fill"></i> Redes Sociales
                </h4>
                <div class="social-editor">
                  <div v-for="(social, key) in config.contacto.social" :key="key" class="config-field">
                    <label class="field-label">
                      <i :class="social.icon"></i> {{ social.label }}
                    </label>
                    <input type="url" v-model="social.url" class="field-input" :placeholder="social.placeholder" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Barra de estado flotante -->
    <div class="floating-bar" v-if="hasUnsavedChanges">
      <div class="container">
        <div class="floating-content">
          <div class="floating-info">
            <i class="bi bi-exclamation-circle-fill"></i>
            <span>Tienes cambios sin guardar</span>
          </div>
          <div class="floating-actions">
            <button class="floating-btn secondary" @click="resetConfig">
              <i class="bi bi-x-lg"></i> Descartar
            </button>
            <button class="floating-btn primary" @click="saveAllConfig">
              <i class="bi bi-check-lg"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificaciones -->
    <Teleport to="body">
      <div v-if="toastVisible" class="toast-notification" :class="toastType">
        <i :class="toastIcon"></i>
        <div class="toast-content">
          <strong>{{ toastTitle }}</strong>
          <span>{{ toastMessage }}</span>
        </div>
        <button class="toast-close" @click="toastVisible = false">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, type Ref } from 'vue'
import { useRouter } from 'vue-router'

type Theme = 'light' | 'dark'
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Section {
  id: string
  label: string
  icon: string
}

interface Feature {
  icon: string
  title: string
  description: string
}

interface AccreditationItem {
  title: string
  icon: string
  description: string
}

interface SocialItem {
  icon: string
  label: string
  url: string
  placeholder: string
}

const router = useRouter()
const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')

// Secciones de navegación
const sections: Section[] = [
  { id: 'home', label: 'Home', icon: 'bi bi-house-fill' },
  { id: 'servicios', label: 'Servicios', icon: 'bi bi-grid-fill' },
  { id: 'nosotros', label: 'Nosotros', icon: 'bi bi-people-fill' },
  { id: 'blog', label: 'Blog', icon: 'bi bi-journal-text' },
  { id: 'eventos', label: 'Eventos', icon: 'bi bi-calendar-event-fill' },
  { id: 'acreditaciones', label: 'Acreditaciones', icon: 'bi bi-patch-check-fill' },
  { id: 'contacto', label: 'Contacto', icon: 'bi bi-envelope-fill' }
]

// Sección activa
const activeSection = ref('home')
const expandedSections = ref(new Set<string>(['home']))

// Referencias a elementos
const sectionHome = ref<HTMLElement>()
const sectionServicios = ref<HTMLElement>()
const sectionNosotros = ref<HTMLElement>()
const sectionBlog = ref<HTMLElement>()
const sectionEventos = ref<HTMLElement>()
const sectionAcreditaciones = ref<HTMLElement>()
const sectionContacto = ref<HTMLElement>()

// Configuración por defecto
const defaultConfig = {
  home: {
    carouselInterval: 5,
    maxImageSize: 5,
    introText: 'SENA es el proveedor pionero de ensayos de aptitud en México acreditado bajo la norma ISO/IEC 17043 y hemos cruzado fronteras en varios países.',
    foundingYear: '2011',
    experienceYears: '15',
    whyUsTitle: '¿Por qué elegir SENA?',
    features: [
      { icon: 'bi bi-award-fill', title: 'Acreditación ISO/IEC 17043', description: 'Certificados bajo la norma internacional.' },
      { icon: 'bi bi-clock-history', title: '15 Años de Experiencia', description: 'Pioneros en ensayos de aptitud en México.' },
      { icon: 'bi bi-cpu-fill', title: 'Infraestructura de Vanguardia', description: 'Tecnología metrológica de última generación.' },
      { icon: 'bi bi-shield-check', title: 'Trazabilidad Garantizada', description: 'Mediciones trazables a patrones internacionales.' }
    ] as Feature[]
  },
  servicios: {
    ensayos: {
      title: 'Ensayos de Aptitud',
      description: 'Evaluación objetiva de la competencia técnica de laboratorios.',
      itemsPerRow: 6,
      showPrices: false
    },
    cursos: {
      title: 'Cursos de Capacitación',
      description: 'Formación especializada en metrología y calidad.',
      perPage: 12,
      defaultMode: 'presencial'
    },
    interlab: {
      title: 'Comparaciones Interlaboratorio',
      description: 'Programas de comparación para asegurar la calidad de las mediciones.',
    }
  },
  nosotros: {
    pageTitle: 'Sobre Nosotros',
    subtitle: 'Conoce nuestra historia y compromiso con la calidad',
    historia: 'SENA fue fundada en 2011 con la visión de convertirse en el principal proveedor de ensayos de aptitud en México.',
    mision: 'Proporcionar ensayos de aptitud de la más alta calidad, contribuyendo al desarrollo y mejora continua de los laboratorios.',
    vision: 'Ser reconocidos como líderes internacionales en ensayos de aptitud, expandiendo nuestras operaciones a nuevos mercados.',
    valores: [
      { text: 'Calidad' },
      { text: 'Integridad' },
      { text: 'Innovación' },
      { text: 'Compromiso' },
      { text: 'Excelencia' }
    ]
  },
  blog: {
    postsPerPage: 9,
    excerptLength: 200,
    allowComments: true,
    moderateComments: true
  },
  eventos: {
    perPage: 12,
    defaultView: 'grid',
    showPastEvents: false,
    allowRegistration: true
  },
  acreditaciones: {
    sectionTitle: 'Acreditaciones',
    description: 'Certificaciones que respaldan nuestro trabajo',
    items: [
      { title: 'ISO/IEC 17043:2023', icon: 'bi bi-file-earmark-check', description: 'Proveedor de ensayos de aptitud' },
      { title: 'Reconocimiento EMA', icon: 'bi bi-building-check', description: 'Entidad Mexicana de Acreditación' }
    ] as AccreditationItem[]
  },
  contacto: {
    address: 'Av. de los Laboratorios 123, Col. Centro, CDMX',
    phone: '+52 55 1234 5678',
    email: 'contacto@sena.com',
    schedule: 'Lun-Vie: 9:00 - 18:00',
    formEmail: 'contacto@sena.com',
    formSubject: 'Mensaje desde sitio web',
    showMap: true,
    showSocial: true,
    social: {
      facebook: { icon: 'bi bi-facebook', label: 'Facebook', url: '', placeholder: 'https://facebook.com/sena' },
      twitter: { icon: 'bi bi-twitter-x', label: 'Twitter', url: '', placeholder: 'https://twitter.com/sena' },
      linkedin: { icon: 'bi bi-linkedin', label: 'LinkedIn', url: '', placeholder: 'https://linkedin.com/company/sena' },
      youtube: { icon: 'bi bi-youtube', label: 'YouTube', url: '', placeholder: 'https://youtube.com/@sena' }
    } as Record<string, SocialItem>
  }
}

// Estado de la configuración
const config = reactive(JSON.parse(JSON.stringify(defaultConfig)))
const originalConfig = JSON.parse(JSON.stringify(defaultConfig))

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')
const toastTitle = ref('')
const toastType: Ref<ToastType> = ref('info')
let toastTimer: ReturnType<typeof setTimeout> | null = null

// Computed
const hasUnsavedChanges = computed(() => {
  return JSON.stringify(config) !== JSON.stringify(originalConfig)
})

const hasChanges = (sectionId: string): boolean => {
  const current = JSON.stringify((config as any)[sectionId])
  const original = JSON.stringify((originalConfig as any)[sectionId])
  return current !== original
}

const toastIcon = computed(() => {
  const icons: Record<string, string> = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-x-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return icons[toastType.value] || icons.info
})

// Métodos
const scrollToSection = (sectionId: string) => {
  activeSection.value = sectionId
  expandedSections.value.add(sectionId)

  nextTick(() => {
    const refMap: Record<string, any> = {
      home: sectionHome,
      servicios: sectionServicios,
      nosotros: sectionNosotros,
      blog: sectionBlog,
      eventos: sectionEventos,
      acreditaciones: sectionAcreditaciones,
      contacto: sectionContacto
    }

    const element = refMap[sectionId]?.value
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const toggleSection = (sectionId: string) => {
  if (expandedSections.value.has(sectionId)) {
    expandedSections.value.delete(sectionId)
  } else {
    expandedSections.value.add(sectionId)
  }
}

const addFeature = () => {
  config.home.features.push({
    icon: 'bi bi-star-fill',
    title: 'Nueva característica',
    description: 'Descripción de la característica'
  })
}

const removeFeature = (idx: number) => {
  config.home.features.splice(idx, 1)
}

const addValue = () => {
  config.nosotros.valores.push({ text: 'Nuevo valor' })
}

const removeValue = (idx: number) => {
  config.nosotros.valores.splice(idx, 1)
}

const addAcreditacion = () => {
  config.acreditaciones.items.push({
    title: 'Nueva certificación',
    icon: 'bi bi-file-earmark-check',
    description: 'Descripción de la certificación'
  })
}

const removeAcreditacion = (idx: number) => {
  config.acreditaciones.items.splice(idx, 1)
}

const saveAllConfig = () => {
  // Guardar en localStorage
  localStorage.setItem('site_config', JSON.stringify(config))
  // Actualizar la copia original
  Object.assign(originalConfig, JSON.parse(JSON.stringify(config)))

  showToast('Configuración guardada correctamente', 'success', 'Guardado Exitoso')
}

// Carrusel management (backend)
import { ref as vueRef } from 'vue'
const carouselItems = vueRef([])
let carouselFile: File | null = null

const onCarouselFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  carouselFile = input.files && input.files[0] ? input.files[0] : null
}

const fetchCarousel = async () => {
  try {
    const rawBase = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'
    const apiRoot = rawBase.endsWith('/api') ? rawBase.slice(0, -4) : rawBase
    const resp = await fetch(`${apiRoot}/api/paginas/home/carrusel`)
    if (!resp.ok) return
    const body = await resp.json()
    carouselItems.value = body.data || []
  } catch (e) {
    console.error('fetchCarousel error', e)
  }
}

const ensureHomeAndGetId = async (): Promise<number | null> => {
  try {
    const rawBase = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'
    const apiRoot = rawBase.endsWith('/api') ? apiRoot = rawBase.slice(0, -4) : rawBase
    // obtener lista de home
    const resp = await fetch(`${apiRoot}/api/paginas/home`)
    if (!resp.ok) return null
    const body = await resp.json()
    if (Array.isArray(body.data) && body.data.length > 0) return body.data[0].id
    // crear si no existe
    const token = localStorage.getItem('token')
    const createResp = await fetch(`${apiRoot}/api/paginas/home`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ seccion: 'home' }) })
    if (!createResp.ok) return null
    const created = await createResp.json()
    return created.data?.id || null
  } catch (e) {
    console.error('ensureHomeAndGetId error', e)
    return null
  }
}

const uploadCarouselImage = async () => {
  try {
    if (!carouselFile) { alert('Selecciona una imagen'); return }
    const maxMB = config.home.maxImageSize || 5
    if (carouselFile.size > maxMB * 1024 * 1024) { alert('Imagen excede tamaño máximo'); return }

    const id_home = await ensureHomeAndGetId()
    if (!id_home) { alert('No se pudo obtener o crear la sección home'); return }

    // convertir a dataURL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(carouselFile as File)
    })

    const token = localStorage.getItem('token')
    const rawBase = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'
    const apiRoot = rawBase.endsWith('/api') ? rawBase.slice(0, -4) : rawBase
    const resp = await fetch(`${apiRoot}/api/paginas/home/carrusel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ id_home, imageDataUrl: dataUrl })
    })
    if (!resp.ok) { alert('Error subiendo imagen'); return }
    await fetchCarousel()
    showToast('Imagen subida', 'success')
  } catch (e) {
    console.error('uploadCarouselImage error', e)
    showToast('Error subiendo imagen', 'error')
  }
}

const deleteCarouselItem = async (id: number) => {
  if (!confirm('Eliminar imagen del carrusel?')) return
  try {
    const token = localStorage.getItem('token')
    const rawBase = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000'
    const apiRoot = rawBase.endsWith('/api') ? rawBase.slice(0, -4) : rawBase
    const resp = await fetch(`${apiRoot}/api/paginas/home/carrusel/${id}`, { method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : '' } })
    if (!resp.ok) { showToast('Error eliminando imagen', 'error'); return }
    await fetchCarousel()
    showToast('Imagen eliminada', 'success')
  } catch (e) {
    console.error('deleteCarouselItem error', e)
    showToast('Error eliminando imagen', 'error')
  }
}

const resetConfig = () => {
  if (hasUnsavedChanges.value) {
    if (confirm('¿Estás seguro de descartar todos los cambios?')) {
      Object.assign(config, JSON.parse(JSON.stringify(originalConfig)))
      showToast('Cambios descartados', 'info', 'Restaurado')
    }
  }
}

const previewSite = () => {
  // Guardar temporalmente y abrir vista previa
  localStorage.setItem('site_config_preview', JSON.stringify(config))
  window.open('/', '_blank')
  showToast('Vista previa abierta en nueva pestaña', 'info', 'Vista Previa')
}

const showToast = (message: string, type: ToastType = 'info', title: string = '') => {
  toastMessage.value = message
  toastTitle.value = title
  toastType.value = type
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 4000)
}

// Cargar configuración guardada
const loadConfig = () => {
  const saved = localStorage.getItem('site_config')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      // Fusionar con la configuración por defecto para asegurar todas las propiedades
      const merged = JSON.parse(JSON.stringify(defaultConfig))

      // Función recursiva para fusionar objetos
      const deepMerge = (target: any, source: any) => {
        for (const key in source) {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {}
            deepMerge(target[key], source[key])
          } else {
            target[key] = source[key]
          }
        }
      }

      deepMerge(merged, parsed)
      Object.assign(config, merged)
      Object.assign(originalConfig, JSON.parse(JSON.stringify(merged)))
    } catch (e) {
      console.error('Error al cargar configuración:', e)
    }
  }
}

// Detectar scroll para actualizar sección activa
const handleScroll = () => {
  const scrollPosition = window.scrollY + 200

  const sectionsMap = [
    { id: 'home', ref: sectionHome },
    { id: 'servicios', ref: sectionServicios },
    { id: 'nosotros', ref: sectionNosotros },
    { id: 'blog', ref: sectionBlog },
    { id: 'eventos', ref: sectionEventos },
    { id: 'acreditaciones', ref: sectionAcreditaciones },
    { id: 'contacto', ref: sectionContacto }
  ]

  for (const section of sectionsMap) {
    const element = section.ref?.value
    if (element) {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementBottom = elementTop + rect.height

      if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
        activeSection.value = section.id
        break
      }
    }
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  loadConfig()
  window.addEventListener('scroll', handleScroll, { passive: true })
})
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
}

/* ============================================================
   BASE
   ============================================================ */
.admin-config-page {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
  padding-bottom: 100px;
}

[data-bs-theme="dark"] .admin-config-page {
  background: #0c0f0a;
  color: #e8ede3;
}

/* ============================================================
   HEADER
   ============================================================ */
.page-header {
  background: #ffffff;
  border-bottom: 1px solid var(--sena-border);
  padding: 2rem 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

[data-bs-theme="dark"] .page-header {
  background: #0e1509;
  border-bottom-color: rgba(122,171,61,0.12);
}

.breadcrumb-nav { margin-bottom: 1rem; }

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 0.82rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--sena-muted);
}

.breadcrumb-item.active {
  color: var(--sena-green);
  font-weight: 600;
}

.breadcrumb-link {
  color: var(--sena-muted);
  text-decoration: none;
  transition: var(--transition);
}

.breadcrumb-link:hover { color: var(--sena-green); }

.breadcrumb-separator {
  color: #c0c8b8;
  font-size: 0.65rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  background: var(--sena-green-pale);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .section-eyebrow {
  background: rgba(93,138,47,0.18);
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--sena-text);
  margin: 0.25rem 0 0.35rem;
}

[data-bs-theme="dark"] .page-title { color: #f0f5ea; }

.page-subtitle {
  color: var(--sena-muted);
  font-size: 0.9rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 1.5px solid transparent;
  font-family: var(--font-body);
  white-space: nowrap;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(93,138,47,0.25);
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(93,138,47,0.35);
}

.action-btn.secondary {
  background: #fcfdfb;
  border-color: #e0e5da;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .action-btn.secondary {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #c8d8be;
}

.action-btn.secondary:hover {
  background: var(--sena-green-pale);
  border-color: var(--sena-green);
}

/* ============================================================
   SECTIONS NAV
   ============================================================ */
.sections-nav {
  background: #ffffff;
  border-bottom: 1px solid var(--sena-border);
  padding: 1rem 0;
  position: sticky;
  top: 112px;
  z-index: 99;
}

[data-bs-theme="dark"] .sections-nav {
  background: #0e1509;
  border-bottom-color: rgba(122,171,61,0.12);
}

.nav-card {
  overflow-x: auto;
}

.nav-scroll {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border: 1.5px solid #e0e5da;
  border-radius: 50px;
  background: #fcfdfb;
  color: var(--sena-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  font-family: var(--font-body);
  position: relative;
}

[data-bs-theme="dark"] .nav-btn {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #8a9e7c;
}

.nav-btn:hover {
  border-color: var(--sena-green-light);
  color: var(--sena-text);
  background: #f8faf7;
}

.nav-btn.active {
  background: var(--sena-green);
  border-color: var(--sena-green);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(93,138,47,0.25);
}

.nav-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: #e6a817;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: #ffffff;
}

/* ============================================================
   CONFIG CONTENT
   ============================================================ */
.config-content {
  padding: 2rem 0;
}

.config-section {
  margin-bottom: 1.25rem;
  scroll-margin-top: 200px;
}

.section-card {
  background: #ffffff;
  border-radius: var(--radius-xl);
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: var(--transition);
}

[data-bs-theme="dark"] .section-card {
  background: #0e1509;
  border-color: rgba(122,171,61,0.12);
}

.section-card:hover {
  box-shadow: var(--shadow-md);
}

.section-header {
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
  user-select: none;
}

.section-header:hover {
  background: #f8faf7;
}

[data-bs-theme="dark"] .section-header:hover {
  background: rgba(122,171,61,0.04);
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.section-icon.home { background: linear-gradient(135deg, #5d8a2f, #7aab3d); }
.section-icon.servicios { background: linear-gradient(135deg, #4a6b22, #5d8a2f); }
.section-icon.nosotros { background: linear-gradient(135deg, #6b8a4a, #8a9e7c); }
.section-icon.blog { background: linear-gradient(135deg, #e6a817, #f0c040); }
.section-icon.eventos { background: linear-gradient(135deg, #1a56db, #4a9eff); }
.section-icon.acreditaciones { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
.section-icon.contacto { background: linear-gradient(135deg, #059669, #34d399); }

.section-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--sena-text);
  margin: 0 0 0.2rem;
}

[data-bs-theme="dark"] .section-title { color: #e0ecd6; }

.section-desc {
  font-size: 0.8rem;
  color: var(--sena-muted);
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.72rem;
  font-weight: 600;
}

.status-badge.saved {
  background: #e6f4ea;
  color: #137333;
}

.status-badge.modified {
  background: #fef7e0;
  color: #b06000;
}

[data-bs-theme="dark"] .status-badge.saved {
  background: rgba(19,115,51,0.2);
  color: #81c995;
}

[data-bs-theme="dark"] .status-badge.modified {
  background: rgba(176,96,0,0.2);
  color: #f5c26b;
}

.toggle-icon {
  color: var(--sena-muted);
  font-size: 1.2rem;
}

/* ============================================================
   SECTION BODY
   ============================================================ */
.section-body {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid var(--sena-border);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.config-group {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #f8faf7;
  border-radius: var(--radius-md);
  border: 1px solid var(--sena-border);
}

[data-bs-theme="dark"] .config-group {
  background: rgba(122,171,61,0.04);
}

.group-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--sena-green);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

[data-bs-theme="dark"] .group-title { color: var(--sena-green-light); }

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.config-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--sena-text);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

[data-bs-theme="dark"] .field-label { color: #e0ecd6; }

.field-input,
.field-select {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e0e5da;
  border-radius: var(--radius-sm);
  background: #ffffff;
  color: var(--sena-text);
  font-size: 0.88rem;
  font-family: var(--font-body);
  transition: var(--transition);
}

[data-bs-theme="dark"] .field-input,
[data-bs-theme="dark"] .field-select {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #e0ecd6;
}

.field-input:focus,
.field-select:focus {
  outline: none;
  border-color: var(--sena-green);
  box-shadow: 0 0 0 3px rgba(93,138,47,0.1);
}

.field-textarea {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e0e5da;
  border-radius: var(--radius-sm);
  background: #ffffff;
  color: var(--sena-text);
  font-size: 0.88rem;
  font-family: var(--font-body);
  resize: vertical;
  transition: var(--transition);
}

[data-bs-theme="dark"] .field-textarea {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #e0ecd6;
}

.field-textarea:focus {
  outline: none;
  border-color: var(--sena-green);
  box-shadow: 0 0 0 3px rgba(93,138,47,0.1);
}

.field-hint {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f0f4ea;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--sena-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

[data-bs-theme="dark"] .field-hint {
  background: rgba(93,138,47,0.1);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  display: none;
}

.toggle-switch label {
  width: 100%;
  height: 100%;
  background: #d0d8c8;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
  display: block;
  position: relative;
}

.toggle-switch label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  transition: var(--transition);
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.toggle-switch input:checked + label {
  background: var(--sena-green);
}

.toggle-switch input:checked + label::after {
  left: 22px;
}

/* Features Editor */
.features-editor {
  margin-top: 0.75rem;
}

.feature-item {
  background: #ffffff;
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 0.75rem;
}

[data-bs-theme="dark"] .feature-item {
  background: #131a0e;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.feature-number {
  width: 24px;
  height: 24px;
  background: var(--sena-green);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1.5px solid #e0e5da;
  background: #fcfdfb;
  color: var(--sena-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.icon-btn.danger:hover {
  background: #fff0f0;
  border-color: #dc3545;
  color: #dc3545;
}

/* Values Editor */
.values-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.value-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drag-handle {
  color: var(--sena-muted);
  cursor: grab;
  font-size: 1.1rem;
}

.drag-handle:active { cursor: grabbing; }

/* Add Button */
.add-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border: 1.5px dashed var(--sena-green);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--sena-green);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
  margin-top: 0.75rem;
  width: 100%;
  justify-content: center;
}

.add-btn:hover {
  background: var(--sena-green-pale);
  border-style: solid;
}

/* ============================================================
   FLOATING BAR
   ============================================================ */
.floating-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 2px solid var(--sena-green);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  z-index: 999;
  padding: 1rem 0;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

[data-bs-theme="dark"] .floating-bar {
  background: #1a2412;
  border-top-color: var(--sena-green-light);
}

.floating-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.floating-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b06000;
  font-weight: 500;
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .floating-info { color: #f5c26b; }

.floating-actions {
  display: flex;
  gap: 0.5rem;
}

.floating-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.25rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 1.5px solid transparent;
  font-family: var(--font-body);
}

.floating-btn.primary {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
}

.floating-btn.primary:hover {
  box-shadow: 0 4px 16px rgba(93,138,47,0.3);
}

.floating-btn.secondary {
  background: #fcfdfb;
  border-color: #e0e5da;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .floating-btn.secondary {
  background: #131a0e;
  border-color: rgba(122,171,61,0.16);
  color: #c8d8be;
}

/* ============================================================
   TOAST
   ============================================================ */
.toast-notification {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10000;
  max-width: 400px;
  animation: slideInRight 0.3s ease;
  border-left: 4px solid var(--sena-green);
}

[data-bs-theme="dark"] .toast-notification {
  background: #1a2412;
}

.toast-notification.success { border-left-color: var(--sena-green); }
.toast-notification.error { border-left-color: #dc3545; }
.toast-notification.warning { border-left-color: #e6a817; }

.toast-notification > i { font-size: 1.2rem; flex-shrink: 0; }
.toast-notification.success > i { color: var(--sena-green); }
.toast-notification.error > i { color: #dc3545; }
.toast-notification.warning > i { color: #e6a817; }

.toast-content { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
.toast-content strong { font-size: 0.85rem; color: var(--sena-text); }
.toast-content span { font-size: 0.8rem; color: var(--sena-muted); }

[data-bs-theme="dark"] .toast-content strong { color: #e0ecd6; }

.toast-close {
  background: none;
  border: none;
  color: var(--sena-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: var(--transition);
}

.toast-close:hover { color: var(--sena-text); background: var(--sena-green-pale); }

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1200px) {
  .header-content { flex-direction: column; align-items: flex-start; }
  .header-actions { width: 100%; }
}

@media (max-width: 992px) {
  .config-grid { grid-template-columns: 1fr; }
  .section-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .section-actions { width: 100%; justify-content: space-between; }
}

@media (max-width: 768px) {
  .section-body { padding: 0 1rem 1rem; }
  .config-group { padding: 1rem; }
  .floating-content { flex-direction: column; text-align: center; }
  .floating-actions { width: 100%; justify-content: center; }
}

@media (max-width: 480px) {
  .page-header { padding: 1rem 0; }
  .nav-btn { padding: 0.5rem 1rem; font-size: 0.8rem; }
  .action-btn { flex: 1; min-width: 120px; justify-content: center; }
}
</style>
