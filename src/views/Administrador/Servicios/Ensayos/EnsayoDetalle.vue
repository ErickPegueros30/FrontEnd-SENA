<template>
  <div :data-bs-theme="currentTheme" class="ensayo-detalle-page">
    <!-- ============================================================
         Header
         ============================================================ -->
    <header class="detalle-header">
      <div class="container">
        <nav class="breadcrumb-nav" aria-label="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/Admin" class="breadcrumb-link">
                <i class="bi bi-house-door"></i> Dashboard
              </router-link>
            </li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item">
              <router-link to="/AdminEnsayos" class="breadcrumb-link">
                <i class="bi bi-clipboard-data"></i> Ensayos
              </router-link>
            </li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item active" aria-current="page">
              <i class="bi bi-file-earmark-text"></i> {{ ensayo?.codigo || '' }}
            </li>
          </ol>
        </nav>

        <button class="back-btn" @click="goBack">
          <i class="bi bi-arrow-left"></i> Volver a ensayos
        </button>

        <!-- Skeleton mientras carga -->
        <div v-if="loading" class="hero-skeleton" aria-hidden="true">
          <div class="sk sk-title"></div>
          <div class="sk sk-sub"></div>
          <div class="sk sk-chips"></div>
        </div>

        <!-- Hero -->
        <div v-else-if="ensayo" class="hero">
          <div class="hero-main">
            <span class="section-eyebrow">Ensayo de aptitud</span>
            <div class="hero-code-row">
              <h1 class="hero-code">{{ ensayo.codigo }}</h1>
              <span class="status-pill" :class="ensayo.disponible ? 'abierto' : 'cerrado'">
                <i :class="ensayo.disponible ? 'bi bi-unlock-fill' : 'bi bi-lock-fill'"></i>
                {{ ensayo.disponible ? 'Inscripción abierta' : 'Inscripción cerrada' }}
              </span>
            </div>
            <p class="hero-desc">{{ ensayo.descripcion }}</p>
            <div class="hero-chips">
              <span v-if="ensayo.ciclo" class="ciclo-badge">{{ ensayo.ciclo }}</span>
              <span v-if="ensayo.area" class="area-badge">{{ ensayo.area }}</span>
              <span v-if="ensayo.rama" class="rama-badge">{{ ensayo.rama }}</span>
              <span v-if="ensayo.subarea" class="subarea-badge">{{ ensayo.subarea }}</span>
              <span v-if="ensayo.subrama" class="subrama-badge">{{ ensayo.subrama }}</span>
              <span class="flag-chip">
                <img :src="getFlagUrl(ensayo.nacionalidad)" :alt="ensayo.nacionalidad || 'mexico'" />
                {{ ensayo.nacionalidad || 'mexico' }}
              </span>
              <span class="date-chip">
                <i class="bi bi-calendar-range"></i>
                Inscripción: {{ formatDate(ensayo.inscripcionInicio) || '—' }} → {{ formatDate(ensayo.inscripcionFin) || '—' }}
              </span>
            </div>
          </div>

          <aside class="hero-aside">
            <!-- Código de acceso -->
            <div class="access-card" :class="{ 'is-missing': !ensayo.codigo_acceso }">
              <div class="access-card-top">
                <span class="access-label"><i class="bi bi-key"></i> Código de acceso</span>
                <button
                  v-if="ensayo.codigo_acceso"
                  type="button"
                  class="copy-btn"
                  :class="{ copied: codeCopied }"
                  :aria-label="codeCopied ? 'Código copiado' : 'Copiar código de acceso'"
                  @click="copyAccessCode"
                >
                  <i :class="codeCopied ? 'bi bi-check2' : 'bi bi-copy'"></i>
                  {{ codeCopied ? 'Copiado' : 'Copiar' }}
                </button>
              </div>
              <div v-if="ensayo.codigo_acceso" class="access-code">{{ ensayo.codigo_acceso }}</div>
              <div v-else class="access-code-missing">Sin código asignado</div>
              <small class="access-hint">
                Compártelo con los laboratorios para que se inscriban. Distingue mayúsculas y minúsculas.
              </small>
            </div>

            <div class="hero-actions">
              <button class="action-btn" @click="openDocsModal">
                <i class="bi bi-cloud-arrow-up"></i><span>Documentos</span>
              </button>
              <button class="action-btn" :disabled="updatingEstado" @click="toggleEstado">
                <span v-if="updatingEstado" class="ed-spinner"></span>
                <i v-else :class="ensayo.disponible ? 'bi bi-lock' : 'bi bi-unlock'"></i>
                <span>{{ ensayo.disponible ? 'Cerrar inscripción' : 'Abrir inscripción' }}</span>
              </button>
              <button class="action-btn primary" @click="openEditModal">
                <i class="bi bi-pencil"></i><span>Editar</span>
              </button>
            </div>
          </aside>
        </div>

        <div v-else class="hero-error">
          <i class="bi bi-exclamation-circle"></i>
          <span>No se encontró el ensayo solicitado.</span>
        </div>
      </div>
    </header>

    <main v-if="ensayo" class="detalle-main">
      <div class="container">
        <!-- Aviso de datos de demostración -->
        <div v-if="demoSources.length" class="demo-banner" role="status">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <div>
            <strong>Mostrando datos de demostración</strong>
            <span>El servidor no respondió para: {{ demoSources.join(', ') }}. Lo que ves no son datos reales.</span>

      <Teleport to="body">
        <Transition name="ed-modal">
          <div v-if="showLabDocsModal" class="ed-overlay" @click.self="showLabDocsModal = false">
            <div class="ed-modal size-lg">
              <div class="ed-modal-header">
                <div class="ed-modal-icon"><i class="bi bi-folder2-open"></i></div>
                <div class="ed-modal-heading">
                  <h5 class="ed-modal-title">Archivos de {{ currentLabName || 'laboratorio' }}</h5>
                </div>
                <button class="ed-modal-close icon-btn" @click="showLabDocsModal = false"><i class="bi bi-x-lg"></i></button>
              </div>
              <div class="ed-modal-body">
                        <div v-if="labDocs.length === 0" class="empty-mini pad">
                  <i class="bi bi-file-earmark-x"></i>
                  <span>No se encontraron archivos para este laboratorio.</span>
                </div>
                <div v-else class="docs-grid" style="padding:1rem;">
                  <button v-for="d in labDocs" :key="d.id" class="doc-card" @click="openPdf(d)">
                    <div class="doc-icon" :class="docIconClass(d)"><i :class="docIcon(d)"></i></div>
                    <div class="doc-meta">
                      <span class="doc-name">{{ d.nombre }}</span>
                      <span class="doc-sub">{{ d.tipo || '' }} <template v-if="d.fecha"> · {{ formatDate(d.fecha) }}</template></span>
                    </div>
                    <i class="bi bi-eye doc-open"></i>
                  </button>
                </div>
                <div style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.8rem;">
                  <h6 style="margin:0 0 0.6rem 0; font-size:0.85rem;">Integrantes del laboratorio</h6>
                  <div v-if="labIntegrantes.length === 0" class="empty-mini pad" style="padding:0.6rem;">
                    <i class="bi bi-person-x"></i>
                    <span>No hay integrantes registrados para este laboratorio.</span>
                  </div>
                  <div v-else class="list" style="display:flex;flex-direction:column;gap:0.5rem;">
                    <div v-for="p in labIntegrantes" :key="p.id" style="display:flex;align-items:center;justify-content:space-between;gap:0.6rem;">
                      <div>
                        <strong>{{ p.nombre }}</strong>
                        <div class="cell-muted">{{ p.correo || p.telefono || p.laboratorio }}</div>
                      </div>
                      <div>
                        <button class="btn btn-sm" @click="goIntegrante(p, currentLabId)">Ver integrante</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
          </div>
        </div>

        <!-- Métricas rápidas -->
        <section class="metrics-row">
          <div class="metric-card">
            <div class="metric-icon i-people"><i class="bi bi-people-fill"></i></div>
            <div class="metric-info">
              <span class="metric-number">{{ integrantes.length }}</span>
              <span class="metric-label">Integrantes</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon i-docs"><i class="bi bi-file-earmark-pdf-fill"></i></div>
            <div class="metric-info">
              <span class="metric-number">{{ documentos.length }}</span>
              <span class="metric-label">Documentos</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon i-progress"><i class="bi bi-graph-up-arrow"></i></div>
            <div class="metric-info">
              <span class="metric-number">{{ progresoPromedio }}%</span>
              <span class="metric-label">Progreso promedio</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon i-cal"><i class="bi bi-calendar-event-fill"></i></div>
            <div class="metric-info">
              <span class="metric-number">{{ formatDate(ensayo.fechaInicio) || '—' }}</span>
              <span class="metric-label">Inicio del ensayo</span>
            </div>
          </div>
        </section>

        <div class="detalle-grid">
          <!-- Columna izquierda -->
          <div class="col-left">
            <!-- Información general -->
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title"><i class="bi bi-info-circle"></i> Información general</h3>
                <button class="panel-link" @click="openEditModal">
                  <i class="bi bi-pencil"></i> Editar
                </button>
              </div>
              <div class="panel-body">
                <div class="data-grid">
                  <div class="data-item">
                    <span class="data-label">Ciclo</span>
                    <span class="data-value">{{ ensayo.ciclo || '—' }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">Nacionalidad</span>
                    <span class="data-value flag-value">
                      <img :src="getFlagUrl(ensayo.nacionalidad)" :alt="ensayo.nacionalidad || 'mexico'" />
                      {{ ensayo.nacionalidad || 'mexico' }}
                    </span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">Inscripción</span>
                    <span class="data-value">
                      {{ formatDate(ensayo.inscripcionInicio) || '—' }} → {{ formatDate(ensayo.inscripcionFin) || '—' }}
                    </span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">Inicio del ensayo</span>
                    <span class="data-value">{{ formatDate(ensayo.fechaInicio) || '—' }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">Tipo</span>
                    <span class="data-value text-capitalize">{{ ensayo.tipo || 'principal' }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">Detalle de fechas</span>
                    <span class="data-value">{{ ensayo.fechaDetalle || '—' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Laboratorios inscritos -->
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title"><i class="bi bi-building"></i> Laboratorios inscritos</h3>
                <div class="panel-tools">
                  <span class="panel-count">{{ labInscripciones.length }}</span>
                </div>
              </div>
              <div class="panel-body">
                <div v-if="labInscripciones.length === 0" class="empty-mini">
                  <i class="bi bi-building"></i>
                  <span>No hay laboratorios inscritos.</span>
                </div>
                <div v-else class="list">
                  <div v-for="lab in labInscripciones" :key="lab.laboratorioId" class="data-item" style="display:flex;justify-content:space-between;align-items:center;gap:0.6rem;">
                    <div>
                      <strong>{{ lab.laboratorioNombre || 'Sin nombre' }}</strong>
                      <div class="cell-muted">Inscrito: {{ formatDate(lab.creadoEn) || '' }}</div>
                    </div>
                    <div>
                      <button class="btn btn-sm" @click="goToLabFirstIntegrante(lab.laboratorioId)">Ver archivos</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Documentos -->
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title"><i class="bi bi-folder2-open"></i> Documentos del ensayo</h3>
                <div class="panel-tools">
                  <span class="panel-count">{{ documentos.length }}</span>
                  <button class="panel-link" @click="openDocsModal">
                    <i class="bi bi-cloud-arrow-up"></i> Subir
                  </button>
                </div>
              </div>
              <div class="panel-body">
                <div v-if="documentos.length === 0" class="empty-mini">
                  <i class="bi bi-file-earmark-x"></i>
                  <span>Aún no hay documentos cargados para este ensayo.</span>
                  <button class="btn btn-secondary btn-sm" @click="openDocsModal">
                    <i class="bi bi-cloud-arrow-up"></i> Subir documentos
                  </button>
                </div>
                <div v-else class="docs-grid">
                  <button v-for="doc in documentos" :key="doc.id" class="doc-card" @click="openPdf(doc)">
                    <div class="doc-icon" :class="docIconClass(doc)"><i :class="docIcon(doc)"></i></div>
                    <div class="doc-meta">
                      <span class="doc-name">{{ doc.nombre }}</span>
                      <span class="doc-sub">
                        {{ doc.tipo || 'PDF' }}<template v-if="doc.fecha"> · {{ formatDate(doc.fecha) || doc.fecha }}</template>
                      </span>
                    </div>
                    <i class="bi bi-eye doc-open"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha: integrantes -->
          <div class="col-right">
            <div class="panel">
              <div class="panel-header">
                <h3 class="panel-title"><i class="bi bi-people"></i> Integrantes</h3>
                <div class="panel-tools">
                  <div class="mini-search">
                    <i class="bi bi-search"></i>
                    <input
                      v-model="searchIntegrante"
                      type="text"
                      placeholder="Buscar integrante..."
                      aria-label="Buscar integrante"
                    />
                  </div>
                  <span class="panel-count">{{ filteredLabs.length }}</span>
                </div>
              </div>

                <div class="panel-body no-pad">
                  <div v-if="labInscripciones.length === 0" class="empty-mini pad">
                    <i class="bi bi-building"></i>
                    <span>No hay laboratorios inscritos en este ensayo todavía.</span>
                  </div>

                  <div v-else class="table-responsive">
                    <table class="integrantes-table">
                      <thead>
                        <tr>
                          <th>Laboratorio</th>
                          <th>Inscripción</th>
                          <th>Fecha</th>
                          <th class="col-act"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="lab in filteredLabs"
                          :key="lab.laboratorioId"
                          class="clickable-row"
                        >
                          <td>
                            <div class="person-cell">
                              <span class="avatar">{{ getInitials(lab.laboratorioNombre || '') }}</span>
                              <span class="person-name">{{ lab.laboratorioNombre || 'Sin nombre' }}</span>
                            </div>
                          </td>
                          <td><span class="cell-muted">{{ lab.inscripcionId }}</span></td>
                          <td><span class="cell-muted">{{ formatDate(lab.creadoEn) || '' }}</span></td>
                          <td class="col-act">
                            <button class="row-btn" title="Ver archivos" @click.stop="goToLabFirstIntegrante(lab.laboratorioId)">
                              <i class="bi bi-folder2-open"></i>
                            </button>
                          </td>
                        </tr>
                        <tr v-if="filteredLabs.length === 0">
                          <td colspan="4" class="empty-inline">No hay laboratorios que coincidan con la búsqueda.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ============================================================
         Modal: visor de PDF
         ============================================================ -->
    <Teleport to="body">
      <Transition name="ed-modal">
        <div
          v-if="showPdfModal"
          class="ed-overlay"
          :data-bs-theme="currentTheme"
          @click.self="closePdf"
        >
          <div class="ed-modal size-xl" role="dialog" aria-modal="true" aria-labelledby="pdf-modal-title">
            <div class="ed-modal-header">
              <div class="ed-modal-icon is-danger"><i class="bi bi-file-earmark-pdf-fill"></i></div>
              <div class="ed-modal-heading">
                <h5 id="pdf-modal-title" class="ed-modal-title">{{ currentDocName || 'Documento' }}</h5>
                <p class="ed-modal-subtitle">{{ ensayo?.codigo }}</p>
              </div>
              <a
                v-if="originalPdfUrl"
                :href="originalPdfUrl"
                class="btn btn-secondary btn-sm"
                target="_blank"
                rel="noopener"
              >
                <i class="bi bi-box-arrow-up-right"></i> Nueva pestaña
              </a>
              <button class="ed-modal-close" aria-label="Cerrar" @click="closePdf">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="ed-modal-body pdf-body">
              <div v-if="pdfLoading" class="pdf-state">
                <span class="ed-spinner lg"></span>
                <span>Cargando documento...</span>
              </div>
              <iframe
                v-else-if="pdfSrc"
                :src="pdfSrc + '#view=FitH'"
                class="pdf-iframe"
                :title="currentDocName || 'Documento'"
              ></iframe>
              <div v-else class="pdf-state">
                <i class="bi bi-file-earmark-x"></i>
                <strong>No se pudo mostrar el documento</strong>
                <span v-if="pdfFetchError">{{ pdfFetchError }}</span>
                <a
                  v-if="originalPdfUrl"
                  :href="originalPdfUrl"
                  class="btn btn-primary btn-sm"
                  target="_blank"
                  rel="noopener"
                >
                  <i class="bi bi-box-arrow-up-right"></i> Intentar abrir en nueva pestaña
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================================
         Modal: editar ensayo
         ============================================================ -->
    <Teleport to="body">
      <Transition name="ed-modal">
        <div
          v-if="showEditModal"
          class="ed-overlay"
          :data-bs-theme="currentTheme"
          @click.self="closeEditModal"
        >
          <form
            class="ed-modal size-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            novalidate
            @submit.prevent="submitEdit"
          >
            <div class="ed-modal-header">
              <div class="ed-modal-icon"><i class="bi bi-pencil-square"></i></div>
              <div class="ed-modal-heading">
                <h5 id="edit-modal-title" class="ed-modal-title">Editar ensayo</h5>
                <p class="ed-modal-subtitle">{{ ensayo?.codigo }}</p>
              </div>
              <button type="button" class="ed-modal-close" aria-label="Cerrar" :disabled="editSaving" @click="closeEditModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="ed-modal-body">
              <div v-if="editError" class="alert-inline is-error" role="alert">
                <i class="bi bi-exclamation-circle-fill"></i>
                <span>{{ editError }}</span>
              </div>

              <!-- Identificación -->
              <section class="form-section">
                <h6 class="form-section-title">Identificación</h6>
                <div class="form-grid">
                  <div class="field">
                    <label class="field-label" for="ed-codigo">Código del programa <span class="req">*</span></label>
                    <input
                      id="ed-codigo"
                      ref="firstEditInput"
                      v-model.trim="form.codigo"
                      type="text"
                      class="field-input mono"
                      :class="{ 'is-invalid': formErrors.codigo }"
                      placeholder="SENA-DIMENSIONAL-17-2026-CCM"
                    />
                    <span v-if="formErrors.codigo" class="field-error">{{ formErrors.codigo }}</span>
                  </div>
                  <div class="field">
                    <label class="field-label" for="ed-ciclo">Ciclo <span class="req">*</span></label>
                    <input
                      id="ed-ciclo"
                      v-model.trim="form.ciclo"
                      type="text"
                      class="field-input"
                      :class="{ 'is-invalid': formErrors.ciclo }"
                      placeholder="Ej. 1"
                    />
                    <span v-if="formErrors.ciclo" class="field-error">{{ formErrors.ciclo }}</span>
                  </div>
                  <div class="field span-2">
                    <label class="field-label" for="ed-descripcion">Descripción <span class="req">*</span></label>
                    <textarea
                      id="ed-descripcion"
                      v-model.trim="form.descripcion"
                      rows="2"
                      class="field-input"
                      :class="{ 'is-invalid': formErrors.descripcion }"
                      placeholder="Calibración de una cinta métrica..."
                    ></textarea>
                    <span v-if="formErrors.descripcion" class="field-error">{{ formErrors.descripcion }}</span>
                  </div>
                </div>
              </section>

              <!-- Fechas -->
              <section class="form-section">
                <h6 class="form-section-title">Fechas</h6>
                <div class="form-grid cols-3">
                  <div class="field">
                    <label class="field-label" for="ed-ins-ini">Inicio de inscripción</label>
                    <input id="ed-ins-ini" v-model="form.inscripcionInicio" type="date" class="field-input" />
                  </div>
                  <div class="field">
                    <label class="field-label" for="ed-ins-fin">Cierre de inscripción</label>
                    <input
                      id="ed-ins-fin"
                      v-model="form.inscripcionFin"
                      type="date"
                      class="field-input"
                      :min="form.inscripcionInicio || undefined"
                      :class="{ 'is-invalid': formErrors.inscripcionFin }"
                    />
                    <span v-if="formErrors.inscripcionFin" class="field-error">{{ formErrors.inscripcionFin }}</span>
                  </div>
                  <div class="field">
                    <label class="field-label" for="ed-fecha-ini">Inicio del ensayo</label>
                    <input id="ed-fecha-ini" v-model="form.fechaInicio" type="date" class="field-input" />
                  </div>
                  <div class="field span-3">
                    <label class="field-label" for="ed-fecha-det">Detalle de fechas</label>
                    <input
                      id="ed-fecha-det"
                      v-model.trim="form.fechaDetalle"
                      type="text"
                      class="field-input"
                      placeholder="Ej. Duración: 30 días"
                    />
                  </div>
                </div>
              </section>

              <!-- Configuración -->
              <section class="form-section">
                <h6 class="form-section-title">Configuración</h6>
                <div class="form-grid">
                  <div class="field">
                    <span class="field-label">Nacionalidad</span>
                    <div class="segmented" role="radiogroup" aria-label="Nacionalidad">
                      <button
                        v-for="n in NACIONALIDADES"
                        :key="n.value"
                        type="button"
                        role="radio"
                        :aria-checked="form.nacionalidad === n.value"
                        :class="{ active: form.nacionalidad === n.value }"
                        @click="form.nacionalidad = n.value"
                      >
                        <img :src="getFlagUrl(n.value)" :alt="''" /> {{ n.label }}
                      </button>
                    </div>
                  </div>
                  <div class="field">
                    <label class="field-label" for="ed-tipo">Tipo</label>
                    <select id="ed-tipo" v-model="form.tipo" class="field-input">
                      <option value="principal">Principal</option>
                      <option value="secundario">Secundario</option>
                    </select>
                  </div>

                  <div class="field">
                    <label class="field-label" for="ed-acceso">Código de acceso</label>
                    <div class="input-with-action">
                      <input
                        id="ed-acceso"
                        :value="form.codigoAcceso"
                        type="text"
                        class="field-input mono code-input"
                        :class="{ 'is-invalid': formErrors.codigoAcceso }"
                        maxlength="6"
                        autocapitalize="off"
                        autocorrect="off"
                        spellcheck="false"
                        placeholder="aB3x9Z"
                        @input="onAccessCodeInput"
                      />
                      <button type="button" class="btn btn-secondary btn-sm" title="Generar un código nuevo" @click="regenerateAccessCode">
                        <i class="bi bi-arrow-repeat"></i> Generar
                      </button>
                    </div>
                    <span v-if="formErrors.codigoAcceso" class="field-error">{{ formErrors.codigoAcceso }}</span>
                    <span v-else-if="accessCodeChanged" class="field-hint is-warning">
                      <i class="bi bi-exclamation-triangle"></i> El código anterior dejará de funcionar para nuevas inscripciones.
                    </span>
                    <span v-else class="field-hint">6 caracteres, letras y números. Distingue mayúsculas.</span>
                  </div>

                  <div class="field">
                    <span class="field-label">Inscripción</span>
                    <label class="switch-row">
                      <input v-model="form.disponible" type="checkbox" class="switch-input" />
                      <span class="switch" aria-hidden="true"></span>
                      <span>{{ form.disponible ? 'Abierta: acepta inscripciones' : 'Cerrada: no acepta inscripciones' }}</span>
                    </label>
                  </div>
                </div>
              </section>

              <!-- Generalidades -->
              <section class="form-section">
                <h6 class="form-section-title">PDF de generalidades</h6>

                <div v-if="existingPdfUrl && !genFile" class="current-file">
                  <div class="file-icon"><i class="bi bi-file-earmark-pdf-fill"></i></div>
                  <div class="file-meta">
                    <span class="file-name">Generalidades actuales</span>
                    <span class="file-sub">Se reemplazarán si subes un archivo nuevo</span>
                  </div>
                  <a :href="existingPdfUrl" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
                    <i class="bi bi-eye"></i> Ver
                  </a>
                </div>

                <div v-if="genFile" class="current-file is-new">
                  <div class="file-icon"><i class="bi bi-file-earmark-arrow-up-fill"></i></div>
                  <div class="file-meta">
                    <span class="file-name">{{ genFile.name }}</span>
                    <span class="file-sub">{{ formatBytes(genFile.size) }} · se subirá al guardar</span>
                  </div>
                  <button type="button" class="btn btn-ghost btn-sm" aria-label="Quitar archivo" @click="genFile = null">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>

                <label
                  v-else
                  class="dropzone"
                  :class="{ 'is-dragging': genDragging, 'is-invalid': genError }"
                  @dragover.prevent="genDragging = true"
                  @dragleave.prevent="genDragging = false"
                  @drop.prevent="onGenDrop"
                >
                  <input type="file" accept="application/pdf,.pdf" class="visually-hidden" @change="onGenChange" />
                  <i class="bi bi-cloud-arrow-up dropzone-icon"></i>
                  <span class="dropzone-title">
                    Arrastra el PDF aquí o <span class="link-like">selecciónalo</span>
                  </span>
                  <span class="dropzone-hint">Solo PDF · máximo 15 MB</span>
                </label>
                <span v-if="genError" class="field-error">{{ genError }}</span>
              </section>
            </div>

            <div class="ed-modal-footer">
              <span class="footer-note"><span class="req">*</span> Campos obligatorios</span>
              <div class="footer-actions">
                <button type="button" class="btn btn-secondary" :disabled="editSaving" @click="closeEditModal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="editSaving">
                  <span v-if="editSaving" class="ed-spinner"></span>
                  <i v-else class="bi bi-check2"></i>
                  {{ editSaving ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================================
         Modal: subir documentos (entrega / protocolo / resultados)
         ============================================================ -->
    <Teleport to="body">
      <Transition name="ed-modal">
        <div
          v-if="showDocsModal"
          class="ed-overlay"
          :data-bs-theme="currentTheme"
          @click.self="closeDocsModal"
        >
          <div class="ed-modal size-lg" role="dialog" aria-modal="true" aria-labelledby="docs-modal-title">
            <div class="ed-modal-header">
              <div class="ed-modal-icon"><i class="bi bi-cloud-arrow-up"></i></div>
              <div class="ed-modal-heading">
                <h5 id="docs-modal-title" class="ed-modal-title">Subir documentos</h5>
                <p class="ed-modal-subtitle">Los integrantes del ensayo podrán consultarlos</p>
              </div>
              <button class="ed-modal-close" aria-label="Cerrar" :disabled="anyDocUploading" @click="closeDocsModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="ed-modal-body">
              <div class="doc-slots">
                <div
                  v-for="slot in DOC_SLOTS"
                  :key="slot.key"
                  class="slot-card"
                  :class="`is-${docState[slot.key].status}`"
                >
                  <div class="slot-head">
                    <div class="slot-icon"><i :class="slot.icon"></i></div>
                    <div class="slot-meta">
                      <span class="slot-title">{{ slot.label }}</span>
                      <span class="slot-desc">{{ slot.description }}</span>
                    </div>
                    <span v-if="docState[slot.key].status === 'done'" class="slot-badge is-done">
                      <i class="bi bi-check-circle-fill"></i> Subido
                    </span>
                  </div>

                  <!-- Archivo seleccionado -->
                  <div v-if="docState[slot.key].file" class="current-file compact is-new">
                    <div class="file-icon"><i :class="fileIcon(docState[slot.key].file!)"></i></div>
                    <div class="file-meta">
                      <span class="file-name">{{ docState[slot.key].file!.name }}</span>
                      <span class="file-sub">{{ formatBytes(docState[slot.key].file!.size) }}</span>
                    </div>
                    <button
                      type="button"
                      class="btn btn-ghost btn-sm"
                      aria-label="Quitar archivo"
                      :disabled="docState[slot.key].status === 'uploading'"
                      @click="clearSlot(slot.key)"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>

                  <!-- Zona para soltar -->
                  <label
                    v-else
                    class="dropzone compact"
                    :class="{ 'is-dragging': docState[slot.key].dragging }"
                    @dragover.prevent="docState[slot.key].dragging = true"
                    @dragleave.prevent="docState[slot.key].dragging = false"
                    @drop.prevent="onSlotDrop(slot.key, $event)"
                  >
                    <input
                      type="file"
                      :accept="slot.accept"
                      class="visually-hidden"
                      @change="onSlotChange(slot.key, $event)"
                    />
                    <i class="bi bi-cloud-arrow-up dropzone-icon"></i>
                    <span class="dropzone-title">Arrastra o <span class="link-like">selecciona</span></span>
                    <span class="dropzone-hint">{{ slot.hint }}</span>
                  </label>

                  <span v-if="docState[slot.key].error" class="field-error">
                    <i class="bi bi-exclamation-circle"></i> {{ docState[slot.key].error }}
                  </span>

                  <button
                    type="button"
                    class="btn btn-primary btn-sm btn-block"
                    :disabled="!docState[slot.key].file || docState[slot.key].status === 'uploading'"
                    @click="uploadDoc(slot.key)"
                  >
                    <span v-if="docState[slot.key].status === 'uploading'" class="ed-spinner"></span>
                    <i v-else class="bi bi-upload"></i>
                    {{ docState[slot.key].status === 'uploading' ? 'Subiendo...' : `Subir ${slot.label.toLowerCase()}` }}
                  </button>
                </div>
              </div>
            </div>

            <div class="ed-modal-footer">
              <span class="footer-note">Puedes subir cada documento por separado.</span>
              <div class="footer-actions">
                <button type="button" class="btn btn-secondary" :disabled="anyDocUploading" @click="closeDocsModal">
                  Cerrar
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="pendingSlots.length < 2 || anyDocUploading"
                  :title="pendingSlots.length < 2 ? 'Selecciona al menos dos archivos' : ''"
                  @click="uploadAllPending"
                >
                  <i class="bi bi-upload"></i>
                  Subir todos ({{ pendingSlots.length }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <BaseToast ref="toastRef" toast-id="ensayoDetalleToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, reactive, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import BaseToast from '@/components/UI/BaseToast.vue'
import { API_BASE } from '@/config/api'

/* ============================================================
   Tipos
   ============================================================ */
interface Ensayo {
  id: number | string
  backendId?: number | string
  ciclo: string
  descripcion: string
  codigo: string
  codigo_acceso?: string
  area: string
  subarea: string
  rama?: string
  subrama?: string
  inscripcionInicio: string
  inscripcionFin: string
  fechaInicio: string
  fechaDetalle: string
  disponible: boolean
  tipo?: string
  nacionalidad?: string
  generalidades?: string | null
  generalidadesUrl?: string | null
}

interface Documento {
  id: number | string
  nombre: string
  tipo?: string
  fecha?: string
  url?: string
  ensayoId?: number | string
}

interface Integrante {
  id: number | string
  nombre: string
  correo: string
  laboratorio?: string
  laboratorioId?: number | string
  telefono?: string
  progreso: number
  docsSubidos: number
  docsTotal: number
}

type DocSlotKey = 'entrega' | 'protocolo' | 'resultados'
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

interface DocSlot {
  key: DocSlotKey
  label: string
  description: string
  icon: string
  accept: string
  extensions: string[]
  hint: string
}

interface SlotState {
  file: File | null
  status: UploadStatus
  error: string
  dragging: boolean
}

/* ============================================================
   Configuración
   ============================================================ */
const CODIGO_ACCESO_RE = /^[A-Za-z0-9]{6}$/
const CODIGO_ACCESO_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
// Mismo límite que uploadGeneralidades en el backend
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

const NACIONALIDADES = [
  { value: 'mexico', label: 'México' },
  { value: 'colombia', label: 'Colombia' }
] as const

const DOC_SLOTS: DocSlot[] = [
  {
    key: 'entrega',
    label: 'Entrega',
    description: 'Documento de entrega del ítem de ensayo',
    icon: 'bi bi-box-seam',
    accept: 'application/pdf,.pdf',
    extensions: ['pdf'],
    hint: 'PDF · máx. 15 MB'
  },
  {
    key: 'protocolo',
    label: 'Protocolo',
    description: 'Protocolo técnico del ensayo',
    icon: 'bi bi-journal-text',
    accept: 'application/pdf,.pdf',
    extensions: ['pdf'],
    hint: 'PDF · máx. 15 MB'
  },
  {
    key: 'resultados',
    label: 'Resultados',
    description: 'Hoja de resultados del ensayo',
    icon: 'bi bi-table',
    accept: '.xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: ['xlsx', 'xls', 'csv'],
    hint: 'Excel o CSV · máx. 15 MB'
  }
]

/* ============================================================
   Estado general
   ============================================================ */
const route = useRoute()
const router = useRouter()
const { currentTheme } = useTheme()
const { toastRef, showToast } = useToast()

const ensayoId = computed(() => route.params.id as string)
const loading = ref(true)
const ensayo = ref<Ensayo | null>(null)
const documentos = ref<Documento[]>([])
const labInscripciones = ref<any[]>([])
const labDocs = ref<Documento[]>([])
const showLabDocsModal = ref(false)
const currentLabName = ref('')
const currentLabId = ref<number | string | null>(null)
const integrantes = ref<Integrante[]>([])
const updatingEstado = ref(false)
const searchIntegrante = ref('')

// Qué secciones están usando datos de demostración (para avisar al admin)
const demoFlags = reactive({ ensayo: false, documentos: false, integrantes: false })
const demoSources = computed(() => {
  const out: string[] = []
  if (demoFlags.ensayo) out.push('ensayo')
  if (demoFlags.documentos) out.push('documentos')
  if (demoFlags.integrantes) out.push('integrantes')
  return out
})

/* ============================================================
   Utilidades
   ============================================================ */
const getAuthToken = (): string | null =>
  localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null

const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err)

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const fileExt = (name: string) => (name.split('.').pop() || '').toLowerCase()

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Devuelve un mensaje si el archivo no es válido
const validateFile = (file: File, extensions: string[]): string => {
  if (!extensions.includes(fileExt(file.name))) {
    return `Formato no permitido. Usa: ${extensions.map(e => `.${e}`).join(', ')}`
  }
  if (file.size > MAX_UPLOAD_BYTES) return 'El archivo supera 15 MB'
  return ''
}

const DATE_FMT = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

// 'YYYY-MM-DD' se construye en hora local (new Date('2026-12-20') es UTC y en México sale 19 dic)
const formatDate = (value?: string | null): string => {
  if (!value) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value)
  return Number.isNaN(d.getTime()) ? '' : DATE_FMT.format(d)
}

const getFlagUrl = (code?: string | null) => {
  if (!code) return 'https://flagcdn.com/w20/mx.png'
  const c = String(code).toLowerCase()
  if (c === 'colombia' || c === 'co') return 'https://flagcdn.com/w20/co.png'
  return 'https://flagcdn.com/w20/mx.png'
}

const getInitials = (name: string) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
}

const progresoClass = (v: number) => (v >= 100 ? 'complete' : v >= 50 ? 'mid' : 'low')

const isSpreadsheet = (name = '') => ['xlsx', 'xls', 'csv'].includes(fileExt(name))

const docIcon = (doc: Documento) =>
  isSpreadsheet(doc.url || doc.nombre) ? 'bi bi-file-earmark-spreadsheet-fill' : 'bi bi-file-earmark-pdf-fill'

const docIconClass = (doc: Documento) => (isSpreadsheet(doc.url || doc.nombre) ? 'is-sheet' : '')

const fileIcon = (file: File) =>
  isSpreadsheet(file.name) ? 'bi bi-file-earmark-spreadsheet-fill' : 'bi bi-file-earmark-pdf-fill'

/* ============================================================
   Listas derivadas
   ============================================================ */
const filteredLabs = computed(() => {
  const q = searchIntegrante.value.toLowerCase().trim()
  if (!q) return labInscripciones.value
  return labInscripciones.value.filter((l) => (String(l.laboratorioNombre || '')).toLowerCase().includes(q))
})

const progresoPromedio = computed(() => {
  if (integrantes.value.length === 0) return 0
  const sum = integrantes.value.reduce((a, p) => a + (p.progreso || 0), 0)
  return Math.round(sum / integrantes.value.length)
})

/* ============================================================
   Carga del ensayo
   ============================================================ */
const mapEnsayo = (r: any): Ensayo => ({
  id: r.id_ensayo || r.id,
  backendId: r.id_ensayo || r.id,
  ciclo: r.ciclo || '',
  descripcion: r.descripcion || '',
  codigo: r.codigo || '',
  // Solo el código de acceso real: antes caía al código del programa, que no sirve para inscribirse
  codigo_acceso: r.codigo_acceso || '',
  area: r.area || '',
  subarea: r.subarea || '',
  rama: r.rama || '',
  subrama: r.subrama || '',
  inscripcionInicio: r.inscripcionInicio || r.inscripcion_inicio || '',
  inscripcionFin: r.inscripcionFin || r.inscripcion_fin || '',
  fechaInicio: r.fechaInicio || r.fecha_inicio || r.fechaInicioEnsayo || r.fecha_inicio_ensayo || '',
  fechaDetalle: r.fechaDetalle || r.fecha_detalle || '',
  disponible: r.disponible !== undefined ? !!r.disponible : true,
  tipo: r.tipo || 'principal',
  nacionalidad: r.nacionalidad || 'mexico',
  generalidades: r.generalidades || null,
  generalidadesUrl: r.generalidadesUrl || null
})

const demoEnsayo = (): Ensayo => ({
  id: ensayoId.value,
  backendId: ensayoId.value,
  ciclo: 'Micro 01',
  descripcion: 'Micropipeta de volumen fijo',
  codigo: 'VOL-PIP-MIC-001',
  codigo_acceso: 'A1b2C3',
  area: 'Volumen',
  subarea: 'Micropipetas',
  rama: '',
  subrama: '',
  inscripcionInicio: '2026-01-10',
  inscripcionFin: '2026-02-10',
  fechaInicio: '2026-03-01',
  fechaDetalle: 'Duración: 30 días',
  disponible: true,
  tipo: 'principal',
  nacionalidad: 'mexico',
  generalidades: 'generalidades.pdf',
  generalidadesUrl: null
})

const fetchEnsayo = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (resp.ok) {
        const body = await resp.json()
        ensayo.value = mapEnsayo(body.data || body)
        demoFlags.ensayo = false
        return
      }
    }
  } catch (err) {
    console.error('Error fetching ensayo', err)
  }
  // Fallback demo para poder ver la interfaz sin backend (se avisa en pantalla)
  ensayo.value = demoEnsayo()
  demoFlags.ensayo = true
}

/* ============================================================
   Documentos del ensayo
   ============================================================ */
const generalidadesUrl = () => `${API_BASE}/api/ensayos/${ensayoId.value}/generalidades.pdf`

const prependGeneralidades = () => {
  if (!ensayo.value) return
  if (ensayo.value.generalidades || ensayo.value.generalidadesUrl) {
    const exists = documentos.value.some((d) => d.id === 'gen')
    if (!exists) {
      documentos.value.unshift({
        id: 'gen',
        nombre: 'Generalidades del ensayo',
        tipo: 'Generalidades',
        fecha: '',
        url: generalidadesUrl()
      })
    }
  }
}

const fetchDocumentos = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/documentos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (resp.ok) {
        const body = await resp.json()
        const rows = Array.isArray(body) ? body : body.data || []
        documentos.value = rows.map((d: any, i: number) => ({
          id: d.id || d.id_documento || i,
          nombre: d.nombre || d.name || `Documento ${i + 1}`,
          tipo: d.tipo || 'PDF',
          fecha: d.fecha || d.createdAt || '',
          url: d.url || d.pdfUrl || (d.id ? `${API_BASE}/api/ensayos/${ensayoId.value}/documentos/${d.id}.pdf` : '')
        }))
        prependGeneralidades()
        demoFlags.documentos = false
        return
      }
    }
  } catch (err) {
    console.error('Error fetching documentos', err)
  }
  // Fallback: al menos generalidades; si no hay, demo
  documentos.value = []
  prependGeneralidades()
  demoFlags.documentos = documentos.value.length === 0
  if (demoFlags.documentos) {
    documentos.value = [
      { id: 'gen', nombre: 'Generalidades del ensayo', tipo: 'Generalidades', fecha: '2026-01-05', url: '' },
      { id: 'inst', nombre: 'Instrucciones técnicas', tipo: 'Instructivo', fecha: '2026-01-06', url: '' }
    ]
  }
}

const fetchLabInscripciones = async () => {
  const token = getAuthToken()
  try {
    if (!token) return
    const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/laboratorios`, { headers: { Authorization: `Bearer ${token}` } })
    if (!resp.ok) return
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : body.data || []
    labInscripciones.value = rows.map((r: any) => ({ inscripcionId: r.id_inscripcion, laboratorioId: r.laboratorio_id, laboratorioNombre: r.laboratorio_nombre, creadoEn: r.created_at }))
  } catch (err) {
    console.error('fetchLabInscripciones error', err)
    labInscripciones.value = []
  }
}

const fetchLabDocuments = async (labId: number | string, labName = '') => {
  const token = getAuthToken()
  try {
    if (!token) return
    const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/laboratorios/${labId}/documentos`, { headers: { Authorization: `Bearer ${token}` } })
    if (!resp.ok) return
    const body = await resp.json()
    const rows = Array.isArray(body) ? body : body.data || []
    labDocs.value = rows.map((d: any, i: number) => ({ id: d.id || d.id_documento || i, nombre: d.nombre || d.name || `Documento ${i + 1}`, tipo: d.tipo || fileExt(d.nombre || d.url || '')?.toUpperCase(), fecha: d.createdAt || d.created_at || d.fecha || '', url: d.url || d.ruta || '' }))
    currentLabId.value = labId
    currentLabName.value = labName || ''
    showLabDocsModal.value = true
  } catch (err) {
    console.error('fetchLabDocuments error', err)
    labDocs.value = []
  }
}

const viewLabDocs = (labId: number | string) => {
  const lab = labInscripciones.value.find(l => String(l.laboratorioId) === String(labId))
  fetchLabDocuments(labId, lab ? lab.laboratorioNombre : '')
}

// Navega al detalle del primer integrante del laboratorio (si existe).
const goToLabFirstIntegrante = async (labId: number | string | null | undefined) => {
  const labEntry = labInscripciones.value.find(l => String(l.laboratorioId) === String(labId) || String(l.inscripcionId) === String(labId))
  const labName = labEntry ? (labEntry.laboratorioNombre || '').toString().trim() : ''

  // Si no se recibió un labId válido, intentar usar la inscripcionId
  if (!labId && labEntry) {
    labId = labEntry.laboratorioId ?? labEntry.inscripcionId ?? null
  }

  // Logging temporal para depuración
  console.debug('[goToLabFirstIntegrante] entrada', { labId, labName, labEntry, labInscripcionesLen: labInscripciones.value.length, integrantesLen: integrantes.value.length })

  // Asegurarnos de tener la lista de integrantes cargada antes de buscar
  if (!integrantes.value || integrantes.value.length === 0) {
    await fetchIntegrantes()
    console.debug('[goToLabFirstIntegrante] after fetchIntegrantes', { integrantesSample: integrantes.value.slice(0, 8) })
  }

  // Intentar encontrar por laboratorio_id primero (más fiable), luego por nombre
  let matches = integrantes.value.filter(i => String(i.laboratorioId ?? '').toLowerCase() === String(labId ?? '').toLowerCase())
  if (matches.length === 0 && labName) {
    matches = integrantes.value.filter(i => (String(i.laboratorio || '')).toLowerCase().includes(labName.toLowerCase()))
  }

  // Si encontramos, navegamos al integrante y pasamos labId en query
  if (matches.length > 0) {
    console.debug('[goToLabFirstIntegrante] matches', matches)
    goIntegrante(matches[0], labId ?? null)
    return
  }

  console.debug('[goToLabFirstIntegrante] no matches found', { matches, integrantesSample: integrantes.value.slice(0, 8) })

  // Si sigue sin haber integrantes, abrir modal de archivos del laboratorio
  fetchLabDocuments(labId ?? '', labName)
}

const labIntegrantes = computed(() => {
  const name = (currentLabName.value || '').toString().trim().toLowerCase()
  if (!name) return []
  return integrantes.value.filter(i => (String(i.laboratorio || '')).toLowerCase() === name)
})

/* ============================================================
   Integrantes
   ============================================================ */
const demoIntegrantes = (): Integrante[] => [
  { id: 1, nombre: 'María González Ruiz', correo: 'maria.gonzalez@lab.mx', laboratorio: 'Lab Metrología Norte', telefono: '+52 442 123 4567', progreso: 100, docsSubidos: 5, docsTotal: 5 },
  { id: 2, nombre: 'Carlos Hernández', correo: 'c.hernandez@calibra.mx', laboratorio: 'Calibra S.A.', telefono: '+52 55 8899 2211', progreso: 60, docsSubidos: 3, docsTotal: 5 },
  { id: 3, nombre: 'Ana Torres Vega', correo: 'ana.torres@precision.co', laboratorio: 'Precisión Andina', telefono: '+57 1 456 7890', progreso: 20, docsSubidos: 1, docsTotal: 5 },
  { id: 4, nombre: 'Luis Martínez', correo: 'lmartinez@ensayoslab.mx', laboratorio: 'Ensayos Lab', telefono: '+52 33 2211 5566', progreso: 80, docsSubidos: 4, docsTotal: 5 }
]

const fetchIntegrantes = async () => {
  const token = getAuthToken()
  try {
    if (token) {
      const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/integrantes`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (resp.ok) {
        const body = await resp.json()
        const rows = Array.isArray(body) ? body : body.data || []
        integrantes.value = rows.map((p: any, i: number) => {
          const total = p.docsTotal ?? p.documentosRequeridos ?? 0
          const subidos = p.docsSubidos ?? p.documentosSubidos ?? 0
          const prog = p.progreso != null
            ? Math.round(p.progreso)
            : total > 0 ? Math.round((subidos / total) * 100) : 0
          return {
            id: p.id || p.id_cliente || p.id_integrante || i,
            nombre: p.nombre || `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Sin nombre',
            correo: p.correo || p.email || '',
            laboratorio: p.laboratorio || p.lab || '',
            laboratorioId: p.laboratorio_id ?? p.laboratorioId ?? p.labId ?? null,
            telefono: p.telefono || p.phone || '',
            progreso: prog,
            docsSubidos: subidos,
            docsTotal: total
          }
        })
        console.debug('[fetchIntegrantes] mapped integrantes sample', integrantes.value.slice(0, 6))
        demoFlags.integrantes = false
        return
      }
    }
  } catch (err) {
    console.error('Error fetching integrantes', err)
  }
  integrantes.value = demoIntegrantes()
  demoFlags.integrantes = true
}

/* ============================================================
   Acciones del hero
   ============================================================ */
const codeCopied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

const copyAccessCode = async () => {
  const code = ensayo.value?.codigo_acceso
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
  } catch {
    // Respaldo para navegadores sin Clipboard API (o sin HTTPS)
    const ta = document.createElement('textarea')
    ta.value = code
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  codeCopied.value = true
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => { codeCopied.value = false }, 1800)
}

const toggleEstado = async () => {
  if (!ensayo.value || updatingEstado.value) return
  const token = getAuthToken()
  if (!token) {
    showToast('Tu sesión expiró. Vuelve a iniciar sesión.', 'warning', 'Sin sesión')
    return
  }
  updatingEstado.value = true
  const next = !ensayo.value.disponible
  try {
    const idToUse = ensayo.value.backendId || ensayo.value.id
    const resp = await fetch(`${API_BASE}/api/ensayos/${idToUse}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ disponible: next })
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) throw new Error(body.message || `HTTP ${resp.status}`)
    ensayo.value.disponible = next
    showToast(next ? 'Inscripción abierta' : 'Inscripción cerrada', 'success', 'Estado actualizado')
  } catch (err) {
    showToast(`No se pudo cambiar el estado: ${errorMessage(err)}`, 'error', 'Error')
  } finally {
    updatingEstado.value = false
  }
}

const goBack = () => router.push('/AdminEnsayos')
const goIntegrante = (p: Integrante, labId?: number | string | null) => {
  const path = `/admin/ensayos/${ensayoId.value}/integrantes/${p.id}`
  if (labId != null) return router.push({ path, query: { labId: String(labId) } })
  return router.push(path)
}

/* ============================================================
   Modal: editar
   ============================================================ */
const showEditModal = ref(false)
const editingEnsayoId = ref<number | string | null>(null)
const editSaving = ref(false)
const editError = ref('')
const firstEditInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  ciclo: '',
  descripcion: '',
  codigo: '',
  inscripcionInicio: '',
  inscripcionFin: '',
  fechaInicio: '',
  fechaDetalle: '',
  disponible: true,
  tipo: 'principal',
  nacionalidad: 'mexico' as string,
  codigoAcceso: ''
})

const formErrors = reactive<Record<string, string>>({})
const clearFormErrors = () => { Object.keys(formErrors).forEach(k => delete formErrors[k]) }

const existingPdfUrl = ref<string | null>(null)
const genFile = ref<File | null>(null)
const genDragging = ref(false)
const genError = ref('')

const accessCodeChanged = computed(() =>
  !!ensayo.value?.codigo_acceso && !!form.codigoAcceso && form.codigoAcceso !== ensayo.value.codigo_acceso
)

const openEditModal = () => {
  if (!ensayo.value) return
  const e = ensayo.value
  form.ciclo = e.ciclo || ''
  form.descripcion = e.descripcion || ''
  form.codigo = e.codigo || ''
  form.inscripcionInicio = e.inscripcionInicio || ''
  form.inscripcionFin = e.inscripcionFin || ''
  form.fechaInicio = e.fechaInicio || ''
  form.fechaDetalle = e.fechaDetalle || ''
  form.disponible = e.disponible !== undefined ? !!e.disponible : true
  form.tipo = e.tipo || 'principal'
  form.nacionalidad = e.nacionalidad || 'mexico'
  form.codigoAcceso = e.codigo_acceso || ''
  existingPdfUrl.value = e.generalidadesUrl || null
  editingEnsayoId.value = e.backendId || e.id
  genFile.value = null
  genError.value = ''
  editError.value = ''
  clearFormErrors()
  showEditModal.value = true
  nextTick(() => firstEditInput.value?.focus())
}

const closeEditModal = () => {
  if (editSaving.value) return
  showEditModal.value = false
  editingEnsayoId.value = null
  genFile.value = null
}

// Solo letras y números, sin cambiar mayúsculas (el código las distingue)
const onAccessCodeInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  const clean = el.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 6)
  if (el.value !== clean) el.value = clean
  form.codigoAcceso = clean
  delete formErrors.codigoAcceso
}

const regenerateAccessCode = () => {
  const bytes = new Uint32Array(6)
  crypto.getRandomValues(bytes)
  form.codigoAcceso = Array.from(bytes, b => CODIGO_ACCESO_ALPHABET[b % CODIGO_ACCESO_ALPHABET.length]).join('')
  delete formErrors.codigoAcceso
}

const setGenFile = (file: File | null | undefined) => {
  genError.value = ''
  if (!file) return
  const err = validateFile(file, ['pdf'])
  if (err) { genError.value = err; return }
  genFile.value = file
}

const onGenChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  setGenFile(input.files?.[0])
  input.value = ''
}

const onGenDrop = (e: DragEvent) => {
  genDragging.value = false
  setGenFile(e.dataTransfer?.files?.[0])
}

const validateEditForm = (): boolean => {
  clearFormErrors()
  if (!form.codigo) formErrors.codigo = 'El código es obligatorio'
  if (!form.ciclo) formErrors.ciclo = 'El ciclo es obligatorio'
  if (!form.descripcion) formErrors.descripcion = 'La descripción es obligatoria'
  if (form.inscripcionInicio && form.inscripcionFin && form.inscripcionFin < form.inscripcionInicio) {
    formErrors.inscripcionFin = 'Debe ser igual o posterior al inicio'
  }
  if (form.codigoAcceso && !CODIGO_ACCESO_RE.test(form.codigoAcceso)) {
    formErrors.codigoAcceso = 'Deben ser exactamente 6 letras o números'
  }
  return Object.keys(formErrors).length === 0
}

const submitEdit = async () => {
  if (editSaving.value || !editingEnsayoId.value) return
  if (!validateEditForm()) return

  const token = getAuthToken()
  if (!token) {
    editError.value = 'Tu sesión expiró. Vuelve a iniciar sesión para guardar.'
    return
  }

  editSaving.value = true
  editError.value = ''
  const id = editingEnsayoId.value

  try {
    // Claves que espera updateEnsayo en el backend (antes se enviaba `fechaInicio`,
    // que el backend no lee, y la fecha de inicio nunca se guardaba)
    const payload: Record<string, unknown> = {
      codigo: form.codigo,
      ciclo: form.ciclo,
      descripcion: form.descripcion,
      inscripcionInicio: form.inscripcionInicio || null,
      inscripcionFin: form.inscripcionFin || null,
      fechaInicioEnsayo: form.fechaInicio || null,
      fechaDetalle: form.fechaDetalle || null,
      disponible: form.disponible,
      tipo: form.tipo,
      nacionalidad: form.nacionalidad
    }
    if (form.codigoAcceso && form.codigoAcceso !== ensayo.value?.codigo_acceso) {
      payload.codigo_acceso = form.codigoAcceso
    }

    const resp = await fetch(`${API_BASE}/api/ensayos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) throw new Error(body.message || `No se pudo guardar (HTTP ${resp.status})`)

    // PDF de generalidades (opcional)
    if (genFile.value) {
      const pdfDataUrl = await readAsDataURL(genFile.value)
      const up = await fetch(`${API_BASE}/api/ensayos/${id}/generalidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pdfDataUrl })
      })
      const upBody = await up.json().catch(() => ({}))
      if (!up.ok) {
        // Los datos sí se guardaron: se avisa y se deja el modal abierto para reintentar el PDF
        await fetchEnsayo()
        editError.value = `Los datos se guardaron, pero el PDF no se pudo subir: ${upBody.message || `HTTP ${up.status}`}`
        return
      }
    }

    await fetchEnsayo()
    await fetchDocumentos()
    editSaving.value = false
    closeEditModal()
    showToast('Los cambios del ensayo se guardaron correctamente', 'success', 'Ensayo actualizado')
  } catch (err) {
    console.error('submitEdit error', err)
    editError.value = errorMessage(err)
  } finally {
    editSaving.value = false
  }
}

/* ============================================================
   Modal: documentos
   ============================================================ */
const showDocsModal = ref(false)

const newSlotState = (): SlotState => ({ file: null, status: 'idle', error: '', dragging: false })
const docState = reactive<Record<DocSlotKey, SlotState>>({
  entrega: newSlotState(),
  protocolo: newSlotState(),
  resultados: newSlotState()
})

const anyDocUploading = computed(() => DOC_SLOTS.some(s => docState[s.key].status === 'uploading'))
const pendingSlots = computed(() => DOC_SLOTS.filter(s => docState[s.key].file && docState[s.key].status !== 'uploading'))

const resetDocState = () => {
  DOC_SLOTS.forEach(s => Object.assign(docState[s.key], newSlotState()))
}

const openDocsModal = async () => {
  resetDocState()
  showDocsModal.value = true
  await fetchDocumentos()
}

const closeDocsModal = () => {
  if (anyDocUploading.value) return
  showDocsModal.value = false
  resetDocState()
}

const setSlotFile = (key: DocSlotKey, file: File | null | undefined) => {
  const state = docState[key]
  const slot = DOC_SLOTS.find(s => s.key === key)
  state.error = ''
  if (!file || !slot) return
  const err = validateFile(file, slot.extensions)
  if (err) { state.error = err; return }
  state.file = file
  state.status = 'idle'
}

const onSlotChange = (key: DocSlotKey, e: Event) => {
  const input = e.target as HTMLInputElement
  setSlotFile(key, input.files?.[0])
  input.value = ''
}

const onSlotDrop = (key: DocSlotKey, e: DragEvent) => {
  docState[key].dragging = false
  setSlotFile(key, e.dataTransfer?.files?.[0])
}

const clearSlot = (key: DocSlotKey) => {
  Object.assign(docState[key], newSlotState())
}

const uploadDoc = async (key: DocSlotKey, { silent = false } = {}): Promise<boolean> => {
  const state = docState[key]
  const slot = DOC_SLOTS.find(s => s.key === key)
  if (!state.file || state.status === 'uploading' || !slot) return false

  const token = getAuthToken()
  if (!token) {
    state.status = 'error'
    state.error = 'Tu sesión expiró. Vuelve a iniciar sesión.'
    return false
  }

  state.status = 'uploading'
  state.error = ''
  try {
    const dataUrl = await readAsDataURL(state.file)
    // Mismo contrato que antes: { pdfDataUrl } (también para Excel/CSV)
    const resp = await fetch(`${API_BASE}/api/ensayos/${ensayoId.value}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pdfDataUrl: dataUrl })
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) throw new Error(body.message || `HTTP ${resp.status}`)

    state.status = 'done'
    state.file = null
    if (!silent) {
      await fetchDocumentos()
      showToast(`${slot.label} subido correctamente`, 'success', 'Documento subido')
    }
    return true
  } catch (err) {
    console.error('uploadDoc error', err)
    state.status = 'error'
    state.error = `No se pudo subir: ${errorMessage(err)}`
    return false
  }
}

const uploadAllPending = async () => {
  const keys = pendingSlots.value.map(s => s.key)
  const results = await Promise.all(keys.map(k => uploadDoc(k, { silent: true })))
  await fetchDocumentos()
  const ok = results.filter(Boolean).length
  if (ok === keys.length) showToast(`${ok} documentos subidos`, 'success', 'Documentos subidos')
  else showToast(`Se subieron ${ok} de ${keys.length}. Revisa los que marcan error.`, 'warning', 'Subida parcial')
}

/* ============================================================
   Modal: visor de PDF
   ============================================================ */
const showPdfModal = ref(false)
const currentPdfUrl = ref<string | null>(null)
const originalPdfUrl = ref<string | null>(null)
const currentPdfBlobUrl = ref<string | null>(null)
const pdfFetchError = ref<string | null>(null)
const pdfLoading = ref(false)
const currentDocName = ref('')
const pdfSrc = computed(() => currentPdfBlobUrl.value || currentPdfUrl.value || '')

const revokePdfBlob = () => {
  if (currentPdfBlobUrl.value) {
    try { URL.revokeObjectURL(currentPdfBlobUrl.value) } catch { /* ignorar */ }
  }
  currentPdfBlobUrl.value = null
}

const openPdf = async (doc: Documento) => {
  const url = doc.url || (doc.id === 'gen' ? generalidadesUrl() : '')
  revokePdfBlob()
  currentDocName.value = doc.nombre
  currentPdfUrl.value = null
  pdfFetchError.value = null
  originalPdfUrl.value = url || null
  showPdfModal.value = true

  if (!url) {
    pdfFetchError.value = 'Este documento no tiene un archivo disponible.'
    return
  }

  pdfLoading.value = true
  try {
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const ct = resp.headers.get('content-type') || ''
    if (!ct.includes('pdf')) {
      currentPdfUrl.value = url
      return
    }
    currentPdfBlobUrl.value = URL.createObjectURL(await resp.blob())
  } catch (err) {
    pdfFetchError.value = `No se pudo cargar (${errorMessage(err)}).`
  } finally {
    pdfLoading.value = false
  }
}

const closePdf = () => {
  showPdfModal.value = false
  revokePdfBlob()
  currentPdfUrl.value = null
  originalPdfUrl.value = null
  pdfFetchError.value = null
  currentDocName.value = ''
}

/* ============================================================
   Comportamiento común de los modales
   ============================================================ */
const anyModalOpen = computed(() => showEditModal.value || showDocsModal.value || showPdfModal.value)

// Bloquear el scroll de la página mientras haya un modal abierto
watch(anyModalOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
// Mostrar modal con archivos de laboratorio
watch(showLabDocsModal, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

// Escape cierra el modal abierto
const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  if (showPdfModal.value) closePdf()
  else if (showDocsModal.value) closeDocsModal()
  else if (showEditModal.value) closeEditModal()
}

/* ============================================================
   Ciclo de vida
   ============================================================ */
onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  window.addEventListener('keydown', onKeydown)
  loading.value = true
  await fetchEnsayo()
  await Promise.all([fetchDocumentos(), fetchLabInscripciones()])
  loading.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  revokePdfBlob()
  if (copiedTimer) clearTimeout(copiedTimer)
})

watch(currentTheme, (t) => {
  document.documentElement.setAttribute('data-bs-theme', t)
})
</script>

<style>
/* Tokens globales (sin cambios respecto al original) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
:root {
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --bg: #f5f7f2;
  --surface: #ffffff;
  --surface-sunken: #fafbf9;
  --border: #e6e8e2;
  --border-strong: #c4cbba;
  --text: #1b201a;
  --text-secondary: #556052;
  --text-tertiary: #8a9382;
  --brand: #3f7a2a;
  --brand-hover: #356822;
  --brand-soft: rgba(63, 122, 42, 0.1);
  --brand-soft-border: rgba(63, 122, 42, 0.28);
  --danger: #d64545;
  --danger-soft: rgba(214, 69, 69, 0.1);
  --warning: #c98a1e;
  --warning-soft: rgba(201, 138, 30, 0.12);
  --neutral-soft: rgba(0, 0, 0, 0.04);
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --shadow-sm: 0 1px 3px rgba(20, 24, 16, 0.06), 0 1px 2px rgba(20, 24, 16, 0.04);
  --shadow-md: 0 6px 20px rgba(20, 24, 16, 0.08);
  --shadow-lg: 0 16px 40px rgba(20, 24, 16, 0.14);
  --transition: all 0.15s ease;
}
[data-bs-theme='dark'] {
  --bg: #0e100d;
  --surface: #161a13;
  --surface-sunken: #12150f;
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.14);
  --text: #eaeee4;
  --text-secondary: #99a38e;
  --text-tertiary: #6c7563;
  --brand: #7cbb55;
  --brand-hover: #8fc96b;
  --brand-soft: rgba(124, 187, 85, 0.14);
  --brand-soft-border: rgba(124, 187, 85, 0.3);
  --danger: #e2696a;
  --danger-soft: rgba(226, 105, 106, 0.12);
  --warning: #dcaa4c;
  --warning-soft: rgba(220, 170, 76, 0.12);
  --neutral-soft: rgba(255, 255, 255, 0.05);
}
</style>

<style scoped>
.ensayo-detalle-page {
  font-family: var(--font-body);
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
.ensayo-detalle-page .container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.75rem;
}
.text-capitalize { text-transform: capitalize; }
.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ============================================================
   BOTONES (página y modales)
   ============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.58rem 1.05rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.2;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--transition);
}
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.btn:focus-visible { outline: 3px solid var(--brand-soft-border); outline-offset: 2px; }
.btn-primary { background: var(--brand); border-color: var(--brand); color: #fff; }
.btn-primary:hover:not(:disabled) { background: var(--brand-hover); border-color: var(--brand-hover); }
.btn-secondary { background: var(--surface); border-color: var(--border); color: var(--text); }
.btn-secondary:hover:not(:disabled) { background: var(--surface-sunken); border-color: var(--border-strong); }
.btn-ghost { background: transparent; color: var(--text-secondary); }
.btn-ghost:hover:not(:disabled) { background: var(--neutral-soft); color: var(--text); }
.btn-sm { padding: 0.4rem 0.75rem; font-size: 0.76rem; }
.btn-block { width: 100%; }

.ed-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: ed-spin 0.7s linear infinite;
  flex-shrink: 0;
}
.ed-spinner.lg { width: 28px; height: 28px; border-width: 3px; color: var(--brand); }
@keyframes ed-spin { to { transform: rotate(360deg); } }

/* ============================================================
   HEADER
   ============================================================ */
.detalle-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1.5rem 0 1.75rem;
  position: relative;
  overflow: hidden;
}
.detalle-header::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -6%;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, var(--brand-soft) 0%, transparent 68%);
  pointer-events: none;
}
.breadcrumb-nav { margin-bottom: 1rem; position: relative; z-index: 1; }
.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 0.78rem;
  flex-wrap: wrap;
}
.breadcrumb-item { display: flex; align-items: center; gap: 0.3rem; color: var(--text-tertiary); }
.breadcrumb-item.active { color: var(--text-secondary); font-weight: 600; }
.breadcrumb-link {
  color: var(--text-tertiary);
  text-decoration: none;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.breadcrumb-link:hover { color: var(--brand); }
.breadcrumb-separator { color: var(--border-strong); font-size: 0.6rem; }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 1;
}
.back-btn:hover { color: var(--brand); border-color: var(--brand-soft-border); transform: translateX(-2px); }

/* Hero: info a la izquierda, código de acceso + acciones a la derecha */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2rem;
  align-items: start;
  position: relative;
  z-index: 1;
}
.hero-main { min-width: 0; }
.section-eyebrow {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 0.5rem;
}
.hero-code-row { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
.hero-code {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0;
  font-family: 'SF Mono', 'Courier New', monospace;
  word-break: break-word;
}
.hero-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0.5rem 0 0.9rem;
  line-height: 1.5;
  max-width: 68ch;
}
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.status-pill.abierto { background: var(--brand-soft); color: var(--brand); border: 1px solid var(--brand-soft-border); }
.status-pill.cerrado { background: var(--neutral-soft); color: var(--text-tertiary); border: 1px solid var(--border); }

.hero-chips { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.ciclo-badge {
  padding: 0.2rem 0.65rem;
  background: var(--brand);
  color: #fff;
  border-radius: var(--radius-xs);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.area-badge { padding: 0.18rem 0.6rem; background: var(--brand-soft); color: var(--brand); border-radius: var(--radius-xs); font-size: 0.72rem; font-weight: 600; }
.rama-badge { padding: 0.16rem 0.55rem; border: 1px solid var(--brand-soft-border); color: var(--brand); border-radius: var(--radius-xs); font-size: 0.7rem; font-weight: 600; }
.subarea-badge { padding: 0.18rem 0.6rem; background: var(--neutral-soft); color: var(--text-secondary); border-radius: var(--radius-xs); font-size: 0.72rem; font-weight: 500; }
.subrama-badge { padding: 0.16rem 0.55rem; border: 1px solid var(--border-strong); color: var(--text-secondary); border-radius: var(--radius-xs); font-size: 0.7rem; font-weight: 600; }
.flag-chip,
.date-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.16rem 0.55rem;
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-secondary);
}
.flag-chip { text-transform: capitalize; }
.flag-chip img { width: 18px; height: 12px; object-fit: cover; border-radius: 2px; }

.hero-aside {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 320px;
}

.access-card {
  padding: 0.85rem 1rem;
  background: var(--surface-sunken);
  border: 1px solid var(--brand-soft-border);
  border-radius: var(--radius-lg);
}
.access-card.is-missing { border-color: var(--warning); border-style: dashed; }
.access-card-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.access-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
}
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.22rem 0.55rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.copy-btn:hover { color: var(--brand); border-color: var(--brand-soft-border); }
.copy-btn.copied { color: var(--brand); background: var(--brand-soft); border-color: var(--brand-soft-border); }
.access-code {
  margin: 0.35rem 0 0.3rem;
  font-family: 'SF Mono', 'Cascadia Mono', Consolas, 'Courier New', monospace;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--text);
}
.access-code-missing { margin: 0.45rem 0 0.35rem; font-weight: 600; color: var(--warning); }
.access-hint { display: block; font-size: 0.7rem; line-height: 1.4; color: var(--text-tertiary); }

.hero-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.hero-actions .action-btn { flex: 1 1 auto; justify-content: center; }
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border);
  font-family: var(--font-body);
  background: var(--surface);
  color: var(--text);
  white-space: nowrap;
}
.action-btn:hover:not(:disabled) { background: var(--surface-sunken); border-color: var(--border-strong); transform: translateY(-1px); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn.primary { background: var(--brand); color: #fff; border-color: var(--brand); }
.action-btn.primary:hover:not(:disabled) { background: var(--brand-hover); }

.hero-error { display: flex; align-items: center; gap: 0.6rem; color: var(--danger); font-weight: 600; position: relative; z-index: 1; }

/* Skeleton */
.hero-skeleton { position: relative; z-index: 1; }
.sk {
  background: linear-gradient(90deg, var(--surface-sunken) 25%, var(--neutral-soft) 37%, var(--surface-sunken) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: var(--radius-sm);
}
.sk-title { width: 280px; height: 34px; margin-bottom: 0.75rem; }
.sk-sub { width: 420px; max-width: 80%; height: 18px; margin-bottom: 0.9rem; }
.sk-chips { width: 340px; height: 26px; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

/* ============================================================
   MAIN
   ============================================================ */
.detalle-main { padding: 1.5rem 0 3rem; }

.demo-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--warning-soft);
  border: 1px solid var(--warning);
  color: var(--warning);
}
.demo-banner > i { font-size: 1.1rem; margin-top: 0.1rem; }
.demo-banner div { display: flex; flex-direction: column; gap: 0.1rem; }
.demo-banner span { color: var(--text-secondary); font-size: 0.8rem; }

.metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.85rem; margin-bottom: 1.25rem; }
.metric-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: var(--transition);
}
.metric-card:hover { border-color: var(--border-strong); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.metric-icon { width: 42px; height: 42px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.metric-icon.i-people { background: var(--brand-soft); color: var(--brand); }
.metric-icon.i-docs { background: var(--danger-soft); color: var(--danger); }
.metric-icon.i-progress { background: var(--warning-soft); color: var(--warning); }
.metric-icon.i-cal { background: var(--neutral-soft); color: var(--text-secondary); }
.metric-info { display: flex; flex-direction: column; min-width: 0; }
.metric-number { font-size: 1.15rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.metric-label { font-size: 0.7rem; color: var(--text-secondary); }

.detalle-grid { display: grid; grid-template-columns: 1fr 1.35fr; gap: 1.25rem; align-items: start; }
.col-left,
.col-right { display: flex; flex-direction: column; gap: 1.25rem; min-width: 0; }

.panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1.15rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface-sunken);
  flex-wrap: wrap;
}
.panel-title { font-size: 0.86rem; font-weight: 700; color: var(--text); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.panel-title i { color: var(--brand); }
.panel-count {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--brand);
  background: var(--brand-soft);
  border: 1px solid var(--brand-soft-border);
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}
.panel-tools { display: flex; align-items: center; gap: 0.6rem; }
.panel-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.55rem;
  border: none;
  border-radius: var(--radius-xs);
  background: transparent;
  color: var(--brand);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.panel-link:hover { background: var(--brand-soft); }
.panel-body { padding: 1.15rem; }
.panel-body.no-pad { padding: 0; }

.data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem 1.25rem; }
.data-item { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.data-label { font-size: 0.66rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-tertiary); }
.data-value { font-size: 0.85rem; color: var(--text); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.data-value.flag-value { text-transform: capitalize; }
.data-value.flag-value img { width: 18px; height: 12px; object-fit: cover; border-radius: 2px; }

.empty-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1.5rem 1rem;
  color: var(--text-secondary);
  text-align: center;
  font-size: 0.82rem;
}
.empty-mini.pad { padding: 2rem 1rem; }
.empty-mini > i { font-size: 1.6rem; color: var(--border-strong); }

.docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; }
.doc-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 0.85rem;
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  font-family: var(--font-body);
  color: var(--text);
}
.doc-card:hover { border-color: var(--brand-soft-border); background: var(--surface); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.doc-icon { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--danger-soft); color: var(--danger); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.doc-icon.is-sheet { background: var(--brand-soft); color: var(--brand); }
.doc-meta { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; flex: 1; }
.doc-name { font-size: 0.8rem; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-sub { font-size: 0.68rem; color: var(--text-tertiary); }
.doc-open { color: var(--text-tertiary); font-size: 0.85rem; flex-shrink: 0; }
.doc-card:hover .doc-open { color: var(--brand); }

.mini-search { position: relative; display: flex; align-items: center; }
.mini-search i { position: absolute; left: 0.6rem; color: var(--text-tertiary); font-size: 0.78rem; }
.mini-search input {
  padding: 0.4rem 0.6rem 0.4rem 1.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font-size: 0.78rem;
  font-family: var(--font-body);
  width: 190px;
  transition: var(--transition);
}
.mini-search input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-soft); }

.table-responsive { overflow-x: auto; }
.integrantes-table { width: 100%; border-collapse: collapse; min-width: 720px; }
.integrantes-table thead th {
  padding: 0.7rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.integrantes-table tbody td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
.integrantes-table tbody tr:last-child td { border-bottom: none; }
.clickable-row { cursor: pointer; transition: var(--transition); }
.clickable-row:hover,
.clickable-row:focus-visible { background: var(--surface-sunken); outline: none; }
.col-prog { min-width: 160px; }
.col-act { width: 46px; text-align: right; }
.person-cell { display: flex; align-items: center; gap: 0.6rem; }
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--brand-soft);
  color: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid var(--brand-soft-border);
}
.person-name { font-size: 0.83rem; font-weight: 600; color: var(--text); }
.cell-muted { font-size: 0.8rem; color: var(--text-secondary); }
.lab-badge { display: inline-block; padding: 0.15rem 0.55rem; background: var(--neutral-soft); color: var(--text-secondary); border-radius: var(--radius-xs); font-size: 0.72rem; font-weight: 500; }
.progress-cell { display: flex; align-items: center; gap: 0.5rem; }
.progress-track { flex: 1; height: 7px; border-radius: 999px; background: var(--neutral-soft); overflow: hidden; min-width: 70px; }
.progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
.progress-fill.low { background: var(--danger); }
.progress-fill.mid { background: var(--warning); }
.progress-fill.complete { background: var(--brand); }
.progress-pct { font-size: 0.74rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; min-width: 34px; text-align: right; }
.progress-docs { display: block; font-size: 0.66rem; color: var(--text-tertiary); margin-top: 0.2rem; }
.row-btn {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.78rem;
}
.row-btn:hover { color: var(--brand); border-color: var(--brand-soft-border); background: var(--brand-soft); }
.empty-inline { text-align: center; color: var(--text-secondary); padding: 1.5rem !important; font-size: 0.82rem; }

/* ============================================================
   MODALES (sistema único para los tres)
   ============================================================ */
.ed-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(12, 15, 10, 0.55);
  backdrop-filter: blur(4px);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text);
}

.ed-modal {
  width: 100%;
  max-height: calc(100vh - 2.5rem);
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  margin: 0;
}
.ed-modal.size-lg { max-width: 820px; }
.ed-modal.size-xl { max-width: 1040px; height: calc(100vh - 2.5rem); }

.ed-modal-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.1rem 1.35rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}
.ed-modal-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  background: var(--brand-soft);
  color: var(--brand);
  border: 1px solid var(--brand-soft-border);
}
.ed-modal-icon.is-danger { background: var(--danger-soft); color: var(--danger); border-color: transparent; }
.ed-modal-heading { flex: 1; min-width: 0; }
.ed-modal-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ed-modal-subtitle {
  margin: 0.1rem 0 0;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-family: 'SF Mono', 'Courier New', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ed-modal-close {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}
.ed-modal-close:hover:not(:disabled) { background: var(--surface-sunken); color: var(--text); }
.ed-modal-close:disabled { opacity: 0.5; cursor: not-allowed; }

.ed-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.35rem;
}

.ed-modal-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.35rem;
  border-top: 1px solid var(--border);
  background: var(--surface-sunken);
  flex-shrink: 0;
  flex-wrap: wrap;
}
.footer-note { font-size: 0.74rem; color: var(--text-tertiary); }
.footer-actions { display: flex; gap: 0.5rem; margin-left: auto; }

/* Transición de entrada/salida */
.ed-modal-enter-active,
.ed-modal-leave-active { transition: opacity 0.18s ease; }
.ed-modal-enter-active .ed-modal,
.ed-modal-leave-active .ed-modal { transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.18s ease; }
.ed-modal-enter-from,
.ed-modal-leave-to { opacity: 0; }
.ed-modal-enter-from .ed-modal,
.ed-modal-leave-to .ed-modal { transform: translateY(14px) scale(0.98); opacity: 0; }

/* Alertas dentro del modal */
.alert-inline {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.7rem 0.85rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  line-height: 1.45;
}
.alert-inline.is-error { background: var(--danger-soft); color: var(--danger); border: 1px solid var(--danger); }
.alert-inline i { margin-top: 0.1rem; }

/* ============================================================
   FORMULARIO (modal de edición)
   ============================================================ */
.form-section + .form-section {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px dashed var(--border);
}
.form-section-title {
  margin: 0 0 0.8rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-tertiary);
}
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem 1rem; }
.form-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.span-2 { grid-column: span 2; }
.span-3 { grid-column: 1 / -1; }

.field { display: flex; flex-direction: column; gap: 0.35rem; min-width: 0; }
.field-label { font-size: 0.78rem; font-weight: 600; color: var(--text); }
.req { color: var(--danger); }
.field-input {
  width: 100%;
  padding: 0.58rem 0.75rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.85rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  resize: vertical;
}
.field-input::placeholder { color: var(--text-tertiary); }
.field-input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-soft); }
.field-input.is-invalid { border-color: var(--danger); box-shadow: 0 0 0 3px var(--danger-soft); }
.field-input.mono { font-family: 'SF Mono', 'Cascadia Mono', Consolas, 'Courier New', monospace; }
.code-input { letter-spacing: 0.2em; font-weight: 700; }
[data-bs-theme='dark'] .field-input { color-scheme: dark; }
.field-hint { font-size: 0.72rem; color: var(--text-tertiary); display: flex; align-items: center; gap: 0.3rem; }
.field-hint.is-warning { color: var(--warning); }
.field-error { font-size: 0.72rem; font-weight: 500; color: var(--danger); display: flex; align-items: center; gap: 0.3rem; }

.input-with-action { display: flex; gap: 0.5rem; }
.input-with-action .field-input { flex: 1; }

/* Selector segmentado (nacionalidad) */
.segmented {
  display: inline-flex;
  padding: 3px;
  gap: 3px;
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.segmented button {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.42rem 0.8rem;
  border: none;
  border-radius: var(--radius-xs);
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.segmented button img { width: 18px; height: 12px; object-fit: cover; border-radius: 2px; }
.segmented button.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }

/* Interruptor (disponible) */
.switch-row {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 38px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
}
.switch-input { position: absolute; opacity: 0; pointer-events: none; }
.switch {
  position: relative;
  width: 38px;
  height: 22px;
  border-radius: 999px;
  background: var(--border-strong);
  transition: background 0.15s ease;
  flex-shrink: 0;
}
.switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
}
.switch-input:checked + .switch { background: var(--brand); }
.switch-input:checked + .switch::after { transform: translateX(16px); }
.switch-input:focus-visible + .switch { outline: 3px solid var(--brand-soft-border); outline-offset: 2px; }

/* ============================================================
   ARCHIVOS: zona para soltar y archivo seleccionado
   ============================================================ */
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 1.35rem 1rem;
  border: 2px dashed var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}
.dropzone:hover,
.dropzone.is-dragging { border-color: var(--brand); background: var(--brand-soft); }
.dropzone.is-invalid { border-color: var(--danger); }
.dropzone:focus-within { outline: 3px solid var(--brand-soft-border); outline-offset: 2px; }
.dropzone.compact { padding: 1rem 0.75rem; }
.dropzone-icon { font-size: 1.5rem; color: var(--brand); }
.dropzone-title { font-size: 0.8rem; font-weight: 600; color: var(--text); }
.dropzone-hint { font-size: 0.7rem; color: var(--text-tertiary); }
.link-like { color: var(--brand); text-decoration: underline; text-underline-offset: 2px; }

.current-file {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
}
.current-file + .dropzone { margin-top: 0.6rem; }
.current-file.is-new { border-color: var(--brand-soft-border); background: var(--brand-soft); }
.current-file.compact { padding: 0.55rem 0.6rem; }
.file-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--danger-soft);
  color: var(--danger);
  flex-shrink: 0;
}
.current-file.is-new .file-icon { background: var(--surface); color: var(--brand); }
.file-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1rem; }
.file-name { font-size: 0.8rem; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-sub { font-size: 0.7rem; color: var(--text-tertiary); }

/* ============================================================
   MODAL DE DOCUMENTOS
   ============================================================ */
.doc-slots { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; }
.slot-card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  transition: border-color 0.15s ease;
}
.slot-card.is-done { border-color: var(--brand-soft-border); }
.slot-card.is-error { border-color: var(--danger); }
.slot-head { display: flex; align-items: flex-start; gap: 0.6rem; }
.slot-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: var(--brand-soft);
  color: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.slot-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1rem; }
.slot-title { font-size: 0.85rem; font-weight: 700; color: var(--text); }
.slot-desc { font-size: 0.7rem; color: var(--text-tertiary); line-height: 1.35; }
.slot-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 700;
  white-space: nowrap;
}
.slot-badge.is-done { background: var(--brand-soft); color: var(--brand); }
.slot-card .btn-block { margin-top: auto; }

/* ============================================================
   VISOR DE PDF
   ============================================================ */
.pdf-body { padding: 0; display: flex; background: var(--surface-sunken); }
.pdf-iframe { flex: 1; width: 100%; height: 100%; min-height: 60vh; border: none; background: #525659; }
.pdf-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
}
.pdf-state > i { font-size: 2.2rem; color: var(--border-strong); }
.pdf-state strong { color: var(--text); }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1100px) {
  .detalle-grid { grid-template-columns: 1fr; }
  .metrics-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; gap: 1.25rem; }
  .hero-aside { width: 100%; flex-direction: row; flex-wrap: wrap; align-items: stretch; }
  .access-card { flex: 1 1 260px; }
  .hero-actions { flex: 1 1 260px; align-content: flex-start; }
  .doc-slots { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .hero-code { font-size: 1.55rem; }
  .data-grid { grid-template-columns: 1fr; }
  .mini-search input { width: 140px; }
  .form-grid,
  .form-grid.cols-3 { grid-template-columns: 1fr; }
  .span-2,
  .span-3 { grid-column: auto; }
}
@media (max-width: 576px) {
  .ed-overlay { padding: 0; align-items: flex-end; }
  .ed-modal,
  .ed-modal.size-xl {
    max-height: 94vh;
    height: auto;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
  .ed-modal.size-xl { height: 94vh; }
  .footer-note { display: none; }
  .footer-actions { width: 100%; }
  .footer-actions .btn { flex: 1; }
}
@media (max-width: 480px) {
  .metrics-row { grid-template-columns: 1fr; }
  .ensayo-detalle-page .container { padding: 0 1rem; }
}
@media (prefers-reduced-motion: reduce) {
  .sk,
  .ed-spinner { animation: none; }
  * { transition-duration: 0.01ms !important; }
}
</style>
