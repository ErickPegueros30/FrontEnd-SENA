<template>
  <div :data-bs-theme="currentTheme" class="integrante-detalle-page">
    <!-- ============================================================
         Header
         ============================================================ -->
    <header class="detalle-header">
      <div class="container">
        <nav class="breadcrumb-nav" aria-label="breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/admin" class="breadcrumb-link"><i class="bi bi-house-door"></i> Dashboard</router-link>
            </li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item">
              <router-link to="/admin/ensayos" class="breadcrumb-link"><i class="bi bi-clipboard-data"></i> Ensayos</router-link>
            </li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item">
              <router-link :to="`/admin/ensayos/${ensayoId}`" class="breadcrumb-link">{{ ensayoCodigo || 'Ensayo' }}</router-link>
            </li>
            <li class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></li>
            <li class="breadcrumb-item active" aria-current="page">
              <i class="bi bi-building"></i> {{ laboratorioNombre || 'Laboratorio' }}
            </li>
          </ol>
        </nav>

        <button class="back-btn" @click="goBack"><i class="bi bi-arrow-left"></i> Volver al ensayo</button>

        <!-- Cargando -->
        <div v-if="loading" class="hero-skeleton" aria-hidden="true">
          <div class="sk sk-title"></div>
          <div class="sk sk-sub"></div>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="hero-error">
          <i class="bi bi-exclamation-circle"></i>
          <span>{{ loadError }}</span>
          <button class="btn btn-secondary btn-sm" @click="cargarTodo"><i class="bi bi-arrow-clockwise"></i> Reintentar</button>
        </div>

        <!-- Hero -->
        <div v-else-if="inscripcion" class="hero">
          <div class="hero-id">
            <span class="avatar-lg">{{ getInitials(laboratorioNombre) }}</span>
            <div class="hero-id-text">
              <span class="section-eyebrow">Laboratorio inscrito</span>
              <h1 class="hero-name">{{ laboratorioNombre || 'Sin laboratorio' }}</h1>
              <div class="hero-contact">
                <a v-if="inscripcion.correo" :href="`mailto:${inscripcion.correo}`" class="contact-item">
                  <i class="bi bi-envelope"></i> {{ inscripcion.correo }}
                </a>
                <span v-if="inscripcion.telefono" class="contact-item"><i class="bi bi-telephone"></i> {{ inscripcion.telefono }}</span>
                <span v-if="inscripcion.contacto" class="contact-item"><i class="bi bi-person"></i> {{ inscripcion.contacto }}</span>
                <span v-if="inscripcion.inscritoEn" class="contact-item">
                  <i class="bi bi-calendar-check"></i> Inscrito el {{ formatDate(inscripcion.inscritoEn) }}
                </span>
              </div>
            </div>
          </div>

          <div class="hero-progress-card">
            <svg class="ring" viewBox="0 0 80 80" aria-hidden="true">
              <circle class="ring-bg" cx="40" cy="40" r="34" />
              <circle
                class="ring-fill"
                :class="progresoClass(progresoGeneral)"
                cx="40" cy="40" r="34"
                :stroke-dasharray="ringCircumference"
                :stroke-dashoffset="ringOffset"
              />
            </svg>
            <div class="ring-center">
              <span class="ring-pct">{{ progresoGeneral }}%</span>
              <span class="ring-label">completado</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main v-if="!loading && !loadError && inscripcion" class="detalle-main">
      <div class="container">
        <!-- Resumen -->
        <section class="summary-row">
          <button
            v-for="card in resumen"
            :key="card.estado ?? 'total'"
            class="summary-card"
            :class="{ active: estadoFiltro === card.estado }"
            type="button"
            @click="estadoFiltro = card.estado"
          >
            <span class="summary-dot" :class="card.dot"></span>
            <div class="summary-info">
              <span class="summary-number">{{ card.valor }}</span>
              <span class="summary-label">{{ card.label }}</span>
            </div>
          </button>
        </section>

        <!-- ============================================================
             Expediente que envía el laboratorio
             ============================================================ -->
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="bi bi-folder2-open"></i> Expediente del laboratorio</h3>
            <div class="panel-tools">
              <span class="panel-count">{{ filteredDocumentos.length }}</span>
              <button class="btn btn-secondary btn-sm" :disabled="refreshing" @click="cargarDocumentos">
                <span v-if="refreshing" class="spinner"></span>
                <i v-else class="bi bi-arrow-clockwise"></i>
                Actualizar
              </button>
            </div>
          </div>

          <div class="panel-body no-pad">
            <div v-if="documentosExpediente.length === 0" class="empty-mini pad">
              <i class="bi bi-inbox"></i>
              <strong>Sin documentos todavía</strong>
              <span>Cuando el laboratorio envíe su expediente, aparecerá aquí para revisarlo.</span>
            </div>

            <div v-else class="table-responsive">
              <table class="docs-table">
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th class="col-act">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doc in filteredDocumentos" :key="doc.id">
                    <td>
                      <div class="doc-cell">
                        <span class="doc-mini-icon" :class="{ muted: doc.estado === 'pendiente' }">
                          <i :class="docIcon(doc)"></i>
                        </span>
                        <div class="doc-text">
                          <span class="doc-name">{{ doc.nombre || 'Documento sin nombre' }}</span>
                          <span v-if="doc.motivo" class="doc-motivo">
                            <i class="bi bi-exclamation-circle-fill"></i>{{ doc.motivo }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><span class="cell-muted">{{ doc.tipo || '—' }}</span></td>
                    <td>
                      <span class="estado-badge" :class="'e-' + doc.estado">
                        <i :class="estadoIcon(doc.estado)"></i>{{ estadoLabel(doc.estado) }}
                      </span>
                    </td>
                    <td><span class="cell-muted">{{ formatDate(doc.fecha) || '—' }}</span></td>
                    <td class="col-act">
                      <div v-if="doc.url || doc.estado !== 'pendiente'" class="row-actions">
                        <button class="row-btn" title="Ver documento" :disabled="!doc.url" @click="openPdf(doc)">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button
                          class="row-btn ok"
                          title="Aprobar"
                          :disabled="acting === doc.id || doc.estado === 'revisado'"
                          @click="aprobar(doc)"
                        >
                          <span v-if="acting === doc.id" class="spinner"></span>
                          <i v-else class="bi bi-check-lg"></i>
                        </button>
                        <button class="row-btn danger" title="Rechazar" :disabled="acting === doc.id" @click="openRevision(doc, 'rechazado')">
                          <i class="bi bi-x-lg"></i>
                        </button>
                        <button class="row-btn" title="Cambiar estado" :disabled="acting === doc.id" @click="openRevision(doc)">
                          <i class="bi bi-pencil"></i>
                        </button>
                      </div>
                      <span v-else class="waiting-label">En espera</span>
                    </td>
                  </tr>
                  <tr v-if="filteredDocumentos.length === 0">
                    <td colspan="5" class="empty-inline">No hay documentos con ese estado.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============================================================
             Documentos individuales de SENA para este laboratorio
             ============================================================ -->
        <section class="individuales">
          <div class="section-head">
            <div>
              <h3 class="section-title"><i class="bi bi-person-badge"></i> Documentos individuales</h3>
              <p class="section-sub">
                Hasta {{ SLOTS.length }} archivos que SENA entrega solo a este laboratorio dentro de este ensayo.
                Subir uno nuevo reemplaza el anterior.
              </p>
            </div>
            <span class="panel-count">{{ individualesSubidos }}/{{ SLOTS.length }}</span>
          </div>

          <div class="slots-grid">
            <article
              v-for="slot in SLOTS"
              :key="slot.n"
              class="slot-card"
              :class="{ 'is-filled': !!slotDocs[slot.n] }"
            >
              <header class="slot-head">
                <span class="slot-badge">{{ slot.n }}</span>
                <div class="slot-meta">
                  <h4 class="slot-title">
                    {{ slotDocs[slot.n]?.nombre || `Documento ${slot.n}` }}
                  </h4>
                  <p class="slot-desc">
                    {{ slotDocs[slot.n]?.descripcion || (slotDocs[slot.n] ? '' : 'Sin asignar. El nombre se define al subir el archivo.') }}
                  </p>
                </div>
                <span class="slot-state" :class="slotDocs[slot.n] ? 'ok' : 'empty'">
                  <i :class="slotDocs[slot.n] ? 'bi bi-check-circle-fill' : 'bi bi-dash-circle'"></i>
                  {{ slotDocs[slot.n] ? 'Cargado' : 'Vacío' }}
                </span>
              </header>

              <!-- Archivo ya cargado -->
              <div v-if="slotDocs[slot.n]" class="slot-file">
                <span class="file-icon"><i :class="docIcon(slotDocs[slot.n]!)"></i></span>
                <div class="file-text">
                  <span class="file-name">{{ nombreArchivo(slotDocs[slot.n]!) }}</span>
                  <span class="file-sub">{{ formatDate(slotDocs[slot.n]!.fecha) || 'Sin fecha' }}</span>
                </div>
              </div>

              <!-- Vacío -->
              <button
                v-else
                type="button"
                class="slot-empty"
                :disabled="!inscripcion"
                @click="openUploadModal(slot.n)"
              >
                <i class="bi bi-cloud-arrow-up"></i>
                <span>Subir archivo</span>
                <small>PDF, Excel, CSV o imagen</small>
              </button>

              <div v-if="slotDocs[slot.n]" class="slot-actions">
                <button class="btn btn-secondary btn-sm btn-grow" :disabled="!slotDocs[slot.n]!.url" @click="openPdf(slotDocs[slot.n]!)">
                  <i class="bi bi-eye"></i> Ver
                </button>
                <a
                  v-if="slotDocs[slot.n]!.url"
                  :href="slotDocs[slot.n]!.url"
                  class="btn btn-secondary btn-sm"
                  target="_blank"
                  rel="noopener"
                  title="Descargar"
                >
                  <i class="bi bi-download"></i>
                </a>
                <button class="btn btn-primary btn-sm btn-grow" @click="openUploadModal(slot.n, slotDocs[slot.n]!)">
                  <i class="bi bi-arrow-repeat"></i> Reemplazar
                </button>
              </div>
            </article>
          </div>
        </section>

        <p class="admin-note">
          <i class="bi bi-info-circle"></i>
          El laboratorio sube su expediente desde su portal; aquí se aprueba o se rechaza indicando qué debe corregir.
        </p>
      </div>
    </main>

    <!-- ============================================================
         Modal: visor de documento
         ============================================================ -->
    <Teleport to="body">
      <Transition name="ed-modal">
        <div v-if="showPdfModal" class="ed-overlay" :data-bs-theme="currentTheme" @click.self="closePdf">
          <div class="ed-modal size-xl" role="dialog" aria-modal="true" aria-labelledby="pdf-title">
            <div class="ed-modal-header">
              <div class="ed-modal-icon is-danger"><i class="bi bi-file-earmark-pdf-fill"></i></div>
              <div class="ed-modal-heading">
                <h5 id="pdf-title" class="ed-modal-title">{{ currentDoc?.nombre || 'Documento' }}</h5>
                <p class="ed-modal-subtitle">{{ laboratorioNombre }} · {{ ensayoCodigo }}</p>
              </div>
              <a v-if="originalPdfUrl" :href="originalPdfUrl" class="btn btn-secondary btn-sm" target="_blank" rel="noopener">
                <i class="bi bi-box-arrow-up-right"></i> Nueva pestaña
              </a>
              <button class="ed-modal-close" aria-label="Cerrar" @click="closePdf"><i class="bi bi-x-lg"></i></button>
            </div>

            <div class="ed-modal-body pdf-body">
              <div v-if="pdfLoading" class="pdf-state">
                <span class="spinner lg"></span><span>Cargando documento...</span>
              </div>
              <iframe v-else-if="pdfSrc" :src="pdfSrc" class="pdf-iframe" :title="currentDoc?.nombre || 'Documento'"></iframe>
              <div v-else class="pdf-state">
                <i class="bi bi-file-earmark-x"></i>
                <strong>No se pudo mostrar el documento</strong>
                <span v-if="pdfError">{{ pdfError }}</span>
                <a v-if="originalPdfUrl" :href="originalPdfUrl" class="btn btn-primary btn-sm" target="_blank" rel="noopener">
                  <i class="bi bi-box-arrow-up-right"></i> Abrirlo en una pestaña
                </a>
              </div>
            </div>

            <div class="ed-modal-footer">
              <span class="footer-note">
                <span v-if="currentDoc && !currentDoc.slot" class="estado-badge" :class="'e-' + currentDoc.estado">
                  <i :class="estadoIcon(currentDoc.estado)"></i>{{ estadoLabel(currentDoc.estado) }}
                </span>
                <span v-else-if="currentDoc" class="estado-badge e-revisado">
                  <i class="bi bi-person-badge"></i>Documento individual {{ currentDoc.slot }}
                </span>
              </span>
              <div class="footer-actions">
                <template v-if="currentDoc && currentDoc.slot">
                  <button class="btn btn-primary" @click="openUploadModal(currentDoc.slot!, currentDoc)">
                    <i class="bi bi-arrow-repeat"></i> Reemplazar
                  </button>
                </template>
                <template v-else-if="currentDoc">
                  <button class="btn btn-danger" @click="openRevision(currentDoc, 'rechazado')">
                    <i class="bi bi-x-lg"></i> Rechazar
                  </button>
                  <button class="btn btn-primary" :disabled="acting === currentDoc.id" @click="aprobar(currentDoc)">
                    <span v-if="acting === currentDoc.id" class="spinner"></span>
                    <i v-else class="bi bi-check-lg"></i> Aprobar
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================================
         Modal: revisar documento del expediente
         ============================================================ -->
    <Teleport to="body">
      <Transition name="ed-modal">
        <div v-if="revisandoDoc" class="ed-overlay" :data-bs-theme="currentTheme" @click.self="closeRevision">
          <form class="ed-modal size-md" role="dialog" aria-modal="true" aria-labelledby="rev-title" @submit.prevent="guardarRevision">
            <div class="ed-modal-header">
              <div class="ed-modal-icon"><i class="bi bi-clipboard-check"></i></div>
              <div class="ed-modal-heading">
                <h5 id="rev-title" class="ed-modal-title">Revisar documento</h5>
                <p class="ed-modal-subtitle">{{ revisandoDoc.nombre || 'Documento sin nombre' }}</p>
              </div>
              <button type="button" class="ed-modal-close" aria-label="Cerrar" :disabled="savingRevision" @click="closeRevision">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="ed-modal-body">
              <div v-if="revisionError" class="alert-inline" role="alert">
                <i class="bi bi-exclamation-circle-fill"></i><span>{{ revisionError }}</span>
              </div>

              <div class="field">
                <span class="field-label">Estado</span>
                <div class="estado-options" role="radiogroup" aria-label="Estado del documento">
                  <button
                    v-for="op in ESTADO_OPCIONES"
                    :key="op.value"
                    type="button"
                    role="radio"
                    class="estado-option"
                    :class="[`o-${op.value}`, { active: revEstado === op.value }]"
                    :aria-checked="revEstado === op.value"
                    @click="revEstado = op.value"
                  >
                    <i :class="op.icon"></i>
                    <span>{{ op.label }}</span>
                  </button>
                </div>
              </div>

              <div class="field">
                <label class="field-label" for="rev-motivo">
                  Motivo u observación
                  <span v-if="revEstado === 'rechazado'" class="req">*</span>
                </label>
                <textarea
                  id="rev-motivo"
                  ref="motivoInput"
                  v-model.trim="revMotivo"
                  rows="3"
                  class="field-input"
                  :class="{ 'is-invalid': revisionError && revEstado === 'rechazado' && !revMotivo }"
                  :placeholder="revEstado === 'rechazado' ? 'Ej. El formato no está firmado en la última hoja' : 'Opcional'"
                ></textarea>
                <span class="field-hint">
                  {{ revEstado === 'rechazado'
                    ? 'El laboratorio verá este texto para saber qué corregir.'
                    : 'Queda registrado junto al documento.' }}
                </span>
              </div>
            </div>

            <div class="ed-modal-footer">
              <span class="footer-note">{{ laboratorioNombre }}</span>
              <div class="footer-actions">
                <button type="button" class="btn btn-secondary" :disabled="savingRevision" @click="closeRevision">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="savingRevision">
                  <span v-if="savingRevision" class="spinner"></span>
                  <i v-else class="bi bi-check2"></i>
                  {{ savingRevision ? 'Guardando...' : 'Guardar revisión' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================================
         Modal: subir documento individual
         ============================================================ -->
    <Teleport to="body">
      <Transition name="ed-modal">
        <div v-if="showUploadModal" class="ed-overlay" :data-bs-theme="currentTheme" @click.self="closeUploadModal">
          <form class="ed-modal size-md" role="dialog" aria-modal="true" aria-labelledby="up-title" @submit.prevent="confirmUpload">
            <div class="ed-modal-header">
              <div class="ed-modal-icon"><i class="bi bi-cloud-arrow-up-fill"></i></div>
              <div class="ed-modal-heading">
                <h5 id="up-title" class="ed-modal-title">
                  {{ uploadSlotTieneArchivo ? 'Reemplazar documento' : 'Subir documento' }} {{ selectedSlot }}
                </h5>
                <p class="ed-modal-subtitle">{{ laboratorioNombre }} · {{ ensayoCodigo }}</p>
              </div>
              <button type="button" class="ed-modal-close" aria-label="Cerrar" :disabled="uploadingDoc" @click="closeUploadModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="ed-modal-body">
              <div v-if="uploadError" class="alert-inline" role="alert">
                <i class="bi bi-exclamation-circle-fill"></i><span>{{ uploadError }}</span>
              </div>

              <p v-if="uploadSlotTieneArchivo" class="replace-note">
                <i class="bi bi-info-circle"></i>
                Se sustituirá <strong>{{ slotDocs[selectedSlot]?.nombre }}</strong>.
              </p>

              <div class="field">
                <span class="field-label">Archivo <span class="req">*</span></span>
                <label
                  class="dropzone"
                  :class="{ 'is-dragging': dragging, 'is-filled': !!selectedFile }"
                  @dragover.prevent="dragging = true"
                  @dragleave.prevent="dragging = false"
                  @drop.prevent="onDrop"
                >
                  <input
                    ref="docFileInput"
                    type="file"
                    class="visually-hidden"
                    :accept="ACCEPT"
                    :disabled="uploadingDoc"
                    @change="onFileSelected"
                  />
                  <template v-if="selectedFile">
                    <span class="file-icon"><i :class="docIcon({ nombre: selectedFile.name } as DocIntegrante)"></i></span>
                    <span class="dz-name">{{ selectedFile.name }}</span>
                    <small class="dz-hint">{{ formatBytes(selectedFile.size) }} · clic para cambiarlo</small>
                  </template>
                  <template v-else>
                    <i class="bi bi-cloud-arrow-up dz-icon"></i>
                    <span class="dz-name">Arrastra el archivo o <span class="link-like">búscalo</span></span>
                    <small class="dz-hint">PDF, Excel, CSV o imagen · máx. 15 MB</small>
                  </template>
                </label>
              </div>

              <div class="field">
                <span class="field-label">Posición</span>
                <div class="estado-options" role="radiogroup" aria-label="Posición del documento">
                  <button
                    v-for="slot in SLOTS"
                    :key="slot.n"
                    type="button"
                    role="radio"
                    class="estado-option"
                    :class="{ active: selectedSlot === slot.n }"
                    :aria-checked="selectedSlot === slot.n"
                    :disabled="uploadingDoc"
                    @click="selectedSlot = slot.n"
                  >
                    <span class="slot-badge sm">{{ slot.n }}</span>
                    <span>{{ slotDocs[slot.n]?.nombre || `Documento ${slot.n}` }}</span>
                  </button>
                </div>
                <span class="field-hint">Si la posición ya tiene archivo, el nuevo lo reemplaza.</span>
              </div>

              <div class="field">
                <label class="field-label" for="up-title-input">
                  Nombre del documento <span class="req">*</span>
                </label>
                <input
                  id="up-title-input"
                  v-model.trim="docTitle"
                  class="field-input"
                  :class="{ 'is-invalid': uploadError && !docTitle }"
                  :disabled="uploadingDoc"
                  placeholder="Ej. Informe de resultados ronda 1"
                />
                <span class="field-hint">Así lo verá el laboratorio en su portal.</span>
              </div> 
            </div>

            <div class="ed-modal-footer">
              <span class="footer-note">{{ laboratorioNombre }}</span>
              <div class="footer-actions">
                <button type="button" class="btn btn-secondary" :disabled="uploadingDoc" @click="closeUploadModal">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="uploadingDoc || !selectedFile">
                  <span v-if="uploadingDoc" class="spinner"></span>
                  <i v-else class="bi bi-cloud-upload"></i>
                  {{ uploadingDoc ? 'Subiendo...' : (uploadSlotTieneArchivo ? 'Reemplazar' : 'Subir documento') }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Transition>
    </Teleport>

    <BaseToast ref="toastRef" toast-id="integranteDetalleToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import BaseToast from '@/components/UI/BaseToast.vue'
import { API_BASE } from '@/config/api'

const props = defineProps({
  ensayoId: { type: [String, Number], required: false },
  integranteId: { type: [String, Number], required: false }
})

/* ============================================================
   Tipos
   ============================================================ */
type EstadoDoc = 'pendiente' | 'subido' | 'revisado' | 'rechazado'

interface DocIntegrante {
  id: number | string
  /** Nombre que escribió quien lo subió (los individuales no traen uno por defecto) */
  nombre: string
  descripcion?: string
  tipo?: string
  estado: EstadoDoc
  motivo?: string
  fecha?: string
  url?: string
  /** 1, 2 o 3 cuando es uno de los documentos individuales de SENA */
  slot?: number
}

interface Inscripcion {
  inscripcionId: number | string
  laboratorioId: number | string | null
  equipoId: number | string | null
  laboratorio: string
  contacto: string
  correo: string
  telefono: string
  inscritoEn: string
}

/* ============================================================
   Configuración
   ============================================================ */
const ESTADO_META: Record<EstadoDoc, { label: string; icon: string }> = {
  pendiente: { label: 'Pendiente', icon: 'bi bi-hourglass-split' },
  subido: { label: 'Subido', icon: 'bi bi-cloud-arrow-up-fill' },
  revisado: { label: 'Aprobado', icon: 'bi bi-check-circle-fill' },
  rechazado: { label: 'Rechazado', icon: 'bi bi-x-circle-fill' }
}

const ESTADO_OPCIONES = [
  { value: 'subido' as EstadoDoc, label: 'Pendiente de revisión', icon: 'bi bi-cloud-arrow-up-fill' },
  { value: 'revisado' as EstadoDoc, label: 'Aprobado', icon: 'bi bi-check-circle-fill' },
  { value: 'rechazado' as EstadoDoc, label: 'Rechazado', icon: 'bi bi-x-circle-fill' }
]

/**
 * Las 3 posiciones de documentos individuales.
 * No llevan nombre ni descripción fijos: el nombre es el que escribe
 * quien sube el archivo, y la descripción es opcional.
 */
const SLOTS = [{ n: 1 }, { n: 2 }, { n: 3 }]

const ACCEPT = 'application/pdf,.pdf,.xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*'
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

const estadoLabel = (e: EstadoDoc) => ESTADO_META[e]?.label ?? e
const estadoIcon = (e: EstadoDoc) => ESTADO_META[e]?.icon ?? 'bi bi-file-earmark'

// La API usa 'enviado' / 'recibido'; la interfaz usa 'subido' / 'revisado'
const mapEstadoServidor = (s?: string | null): EstadoDoc => {
  const v = String(s || '').toLowerCase()
  if (v === 'enviado' || v === 'subido') return 'subido'
  if (v === 'recibido' || v === 'revisado') return 'revisado'
  if (v === 'rechazado') return 'rechazado'
  return 'pendiente'
}
const mapEstadoServidorInverso = (e: EstadoDoc) =>
  e === 'subido' ? 'enviado' : e === 'revisado' ? 'recibido' : e

/* ============================================================
   Estado
   ============================================================ */
const route = useRoute()
const router = useRouter()
const { currentTheme } = useTheme()
const { toastRef, showToast } = useToast()

const ensayoId = computed(() => String(props.ensayoId ?? route.params.ensayoId ?? ''))
const integranteId = computed(() => String(props.integranteId ?? route.params.integranteId ?? ''))
const labIdFromQuery = computed(() => (route.query.labId ? String(route.query.labId) : null))

const loading = ref(true)
const refreshing = ref(false)
const loadError = ref('')
const acting = ref<number | string | null>(null)

const ensayoCodigo = ref('')
const inscripcion = ref<Inscripcion | null>(null)
const documentos = ref<DocIntegrante[]>([])
const estadoFiltro = ref<EstadoDoc | null>(null)

const laboratorioNombre = computed(() => inscripcion.value?.laboratorio || '')
const laboratorioId = computed(() => inscripcion.value?.laboratorioId ?? labIdFromQuery.value)

/* ============================================================
   Utilidades
   ============================================================ */
const getAuthToken = (): string | null =>
  localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null

const authHeaders = () => {
  const t = getAuthToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

const requestJson = async (url: string, init: RequestInit = {}) => {
  const headers: Record<string,string> = { ...(init.headers || {}) as Record<string,string> }
  const t = getAuthToken()
  if (t) headers.Authorization = `Bearer ${t}`
  const resp = await fetch(url, { ...init, headers })
  const body = await resp.json().catch(() => ({}))
  if (resp.status === 401 || resp.status === 403) throw new Error('Tu sesión expiró o no tienes permiso para esta acción.')
  if (!resp.ok) throw new Error(body?.message || `No se pudo completar la operación (HTTP ${resp.status})`)
  return body
}

const getInitials = (name?: string) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

const DATE_FMT = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
const formatDate = (value?: string | null) => {
  if (!value) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value)
  return Number.isNaN(d.getTime()) ? '' : DATE_FMT.format(d)
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const fileExt = (s = '') => (String(s).split('?')[0].split('.').pop() || '').toLowerCase()

const docIcon = (d: DocIntegrante) => {
  const ext = fileExt(d.url || d.nombre)
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'bi bi-file-earmark-spreadsheet-fill'
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'bi bi-file-earmark-image-fill'
  return 'bi bi-file-earmark-pdf-fill'
}

/** Nombre del archivo tal como está guardado, para distinguirlo del título */
const nombreArchivo = (d: DocIntegrante) => {
  const desdeUrl = decodeURIComponent(String(d.url || '').split('?')[0].split('/').pop() || '')
  return desdeUrl || d.nombre || 'archivo'
}

const progresoClass = (v: number) => (v >= 100 ? 'complete' : v >= 50 ? 'mid' : 'low')

const resolveUrl = (url?: string | null) => {
  if (!url) return ''
  const s = String(url).trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s) || s.startsWith('data:') || s.startsWith('blob:')) return s
  const origin = (API_BASE || '').replace(/\/api\/?$/, '') || window.location.origin
  return origin + (s.startsWith('/') ? s : `/${s}`)
}

/* ============================================================
   Derivados
   ============================================================ */
// Los individuales salen de la tabla y se muestran en sus tarjetas
const documentosExpediente = computed(() => documentos.value.filter(d => !d.slot))

const slotDocs = computed<Record<number, DocIntegrante | null>>(() => {
  const out: Record<number, DocIntegrante | null> = { 1: null, 2: null, 3: null }
  for (const d of documentos.value) {
    if (d.slot && out[d.slot] === null) out[d.slot] = d
  }
  return out
})

const individualesSubidos = computed(() => SLOTS.filter(s => !!slotDocs.value[s.n]).length)

const countByEstado = (e: EstadoDoc) => documentosExpediente.value.filter(d => d.estado === e).length

const progresoGeneral = computed(() => {
  const total = documentosExpediente.value.length
  if (total === 0) return 0
  const done = documentosExpediente.value.filter(d => d.estado === 'subido' || d.estado === 'revisado').length
  return Math.round((done / total) * 100)
})

const ringCircumference = 2 * Math.PI * 34
const ringOffset = computed(() => ringCircumference - (progresoGeneral.value / 100) * ringCircumference)

const resumen = computed(() => [
  { estado: null, label: 'Total', valor: documentosExpediente.value.length, dot: 'd-total' },
  { estado: 'revisado' as EstadoDoc, label: 'Aprobados', valor: countByEstado('revisado'), dot: 'd-ok' },
  { estado: 'subido' as EstadoDoc, label: 'Por revisar', valor: countByEstado('subido'), dot: 'd-up' },
  { estado: 'pendiente' as EstadoDoc, label: 'Pendientes', valor: countByEstado('pendiente'), dot: 'd-pend' },
  { estado: 'rechazado' as EstadoDoc, label: 'Rechazados', valor: countByEstado('rechazado'), dot: 'd-rej' }
])

const filteredDocumentos = computed(() =>
  estadoFiltro.value
    ? documentosExpediente.value.filter(d => d.estado === estadoFiltro.value)
    : documentosExpediente.value
)

/* ============================================================
   Carga de datos
   ============================================================ */

/**
 * Detecta si una fila corresponde a uno de los 3 documentos individuales.
 * Acepta las formas que puede devolver el backend: columna `slot`,
 * tipo 'individual-2' / 'documento-2', o la clave url_doc2 / ruta_doc2.
 */
const detectarSlot = (d: any): number | undefined => {
  const directo = Number(d?.slot ?? d?.posicion ?? d?.numero)
  if (directo >= 1 && directo <= 3) return directo

  // Detect slot from ID patterns like 'ind-123-s2' or 'doc-45-s1'
  try {
    const idStr = String(d?.id || d?.documento_id || d?.id_documento || '')
    const idMatch = /-s([1-3])(?:$|\D)/i.exec(idStr)
    if (idMatch) return Number(idMatch[1])
  } catch (e) { /* ignore */ }

  const tipo = String(d?.tipo || '')
  const porTipo = /(?:individual|documento|doc)[\s_-]*([123])\b/i.exec(tipo)
  if (porTipo) return Number(porTipo[1])

  for (const k of Object.keys(d || {})) {
    if (!d[k]) continue
    const m = /^(?:url|ruta|archivo|file)[\s_-]*(?:doc[\s_-]*)?([123])$/i.exec(k)
    if (m) return Number(m[1])
  }
  return undefined
}

const mapDocumento = (d: any, i: number): DocIntegrante => ({
  id: d.id ?? d.documento_id ?? d.id_documento ?? `doc-${i}`,
  // Los individuales no tienen nombre hasta que alguien se lo pone al subirlos
  nombre: d.nombre || d.titulo || d.title || d.name || '',
  descripcion: d.descripcion || d.description || '',
  tipo: d.tipo || '',
  estado: mapEstadoServidor(d.estado ?? d.estatus),
  motivo: d.motivo || d.observaciones || '',
  fecha: d.fecha || d.updated_at || d.createdAt || d.created_at || '',
  url: resolveUrl(d.url || d.ruta || d.ruta_relativa || ''),
  slot: detectarSlot(d)
})

const fetchEnsayoCodigo = async () => {
  try {
    const body = await requestJson(`${API_BASE}/api/ensayos/${ensayoId.value}`)
    const r = body.data || body
    ensayoCodigo.value = r.codigo || ''
  } catch (err) {
    console.error('fetchEnsayoCodigo error', err)
  }
}

const fetchInscripcion = async () => {
  const body = await requestJson(`${API_BASE}/api/inscripciones/${integranteId.value}`)
  const p = body.data || body
  inscripcion.value = {
    inscripcionId: p.id_inscripcion ?? p.id ?? integranteId.value,
    laboratorioId: p.laboratorio_id ?? p.laboratorioId ?? labIdFromQuery.value ?? null,
    equipoId: p.equipo_id ?? p.equipoId ?? null,
    laboratorio: p.laboratorio_nombre || p.laboratorio || p.empresa || '',
    contacto: [p.nombre, p.primer_apellido].filter(Boolean).join(' '),
    correo: p.correo || p.email || '',
    telefono: p.telefono || '',
    inscritoEn: p.created_at || p.inscrito_en || ''
  }
  if (!inscripcion.value.laboratorio && laboratorioId.value) await completarLaboratorio()
}

const completarLaboratorio = async () => {
  try {
    const body = await requestJson(`${API_BASE}/api/ensayos/${ensayoId.value}/laboratorios`)
    const rows = Array.isArray(body) ? body : body.data || []
    const entry = rows.find((r: any) =>
      String(r.laboratorio_id ?? r.laboratorioId) === String(laboratorioId.value) ||
      String(r.id_inscripcion ?? r.inscripcionId) === String(integranteId.value)
    )
    if (entry && inscripcion.value) {
      inscripcion.value.laboratorio = entry.laboratorio_nombre ?? entry.laboratorioNombre ?? entry.laboratorio ?? inscripcion.value.laboratorio
      inscripcion.value.laboratorioId = entry.laboratorio_id ?? entry.laboratorioId ?? inscripcion.value.laboratorioId
      inscripcion.value.equipoId = entry.equipo_id ?? entry.equipoId ?? inscripcion.value.equipoId
    }
  } catch (err) {
    console.error('completarLaboratorio error', err)
  }
}

const cargarDocumentos = async () => {
  if (!laboratorioId.value) {
    documentos.value = []
    return
  }
  refreshing.value = true
  try {
    const body = await requestJson(
      `${API_BASE}/api/ensayos/${ensayoId.value}/laboratorios/${laboratorioId.value}/documentos`
    )
    const rows = Array.isArray(body) ? body : body.data || []
    documentos.value = rows
      .map(mapDocumento)
      .filter((d: DocIntegrante) => String(d.tipo).toLowerCase() !== 'protocolo-firmado')
  } catch (err) {
    console.error('cargarDocumentos error', err)
    showToast(errorMessage(err), 'error', 'No se pudieron cargar los documentos')
  } finally {
    refreshing.value = false
  }
}

const cargarTodo = async () => {
  loading.value = true
  loadError.value = ''
  try {
    await fetchInscripcion()
    await Promise.all([fetchEnsayoCodigo(), cargarDocumentos()])
  } catch (err) {
    console.error('cargarTodo error', err)
    loadError.value = errorMessage(err)
  } finally {
    loading.value = false
  }
}

/* ============================================================
   Documentos individuales: subir y reemplazar
   ============================================================ */
const showUploadModal = ref(false)
const selectedSlot = ref(1)
const selectedFile = ref<File | null>(null)
const docTitle = ref('')
const docDescripcion = ref('')
const uploadingDoc = ref(false)
const uploadError = ref('')
const dragging = ref(false)
const docFileInput = ref<HTMLInputElement | null>(null)

const uploadSlotTieneArchivo = computed(() => !!slotDocs.value[selectedSlot.value])

const openUploadModal = (slot: number, doc?: DocIntegrante) => {
  selectedSlot.value = slot
  selectedFile.value = null
  docTitle.value = doc?.nombre || ''
  docDescripcion.value = doc?.descripcion || ''
  uploadError.value = ''
  dragging.value = false
  showUploadModal.value = true
  nextTick(() => { if (docFileInput.value) docFileInput.value.value = '' })
}

const closeUploadModal = () => {
  if (uploadingDoc.value) return
  showUploadModal.value = false
  selectedFile.value = null
  docTitle.value = ''
  docDescripcion.value = ''
  uploadError.value = ''
}

const setFile = (file?: File | null) => {
  if (!file) return
  if (file.size > MAX_UPLOAD_BYTES) {
    uploadError.value = 'El archivo supera 15 MB.'
    return
  }
  uploadError.value = ''
  selectedFile.value = file
}

const onFileSelected = (e: Event) => {
  setFile((e.target as HTMLInputElement).files?.[0])
}

const onDrop = (e: DragEvent) => {
  dragging.value = false
  setFile(e.dataTransfer?.files?.[0])
}

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })

const confirmUpload = async () => {
  if (!selectedFile.value || uploadingDoc.value) return
  if (!inscripcion.value) {
    uploadError.value = 'No hay inscripción cargada.'
    return
  }
  // no title/description required for individual documents (UI hides them)
  uploadingDoc.value = true
  uploadError.value = ''
  try {
    const fileDataUrl = await readAsDataURL(selectedFile.value)
    // El servidor resuelve el equipo cuando no se conoce; se le manda el laboratorio
    const equipoParam = inscripcion.value.equipoId ?? 'null'

    const resp = await requestJson(`${API_BASE}/api/ensayos/${ensayoId.value}/documentos-individuales/${equipoParam}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileDataUrl,
        slot: selectedSlot.value,
        title: '',
        description: null,
        fileName: selectedFile.value.name,
        laboratorioId: laboratorioId.value,
        inscripcionId: inscripcion.value.inscripcionId
      })
    })

    // Refresh server-side list; it may still not include the file if DB failed
    try { await cargarDocumentos() } catch (_) {}

    // If server uploaded file but DB failed to persist, show a temporary entry in UI
    if (resp && resp.data && resp.data.uploadedOnly && resp.data.url) {
      const tmpDoc = {
        id: `tmp-upload-${Date.now()}`,
        nombre: '',
        tipo: 'file',
        estado: 'subido',
        motivo: '',
        fecha: new Date().toISOString(),
        url: resp.data.url,
        slot: selectedSlot.value
      }
      // Remove any previous tmp for this slot and add the new one
      documentos.value = documentos.value.filter(d => !(d.slot === selectedSlot.value && String(d.id).startsWith('tmp-upload-')))
      documentos.value.push(tmpDoc as any)
      estadoFiltro.value = null
      showToast(`Archivo subido pero no confirmado en la base de datos. Se muestra temporalmente.`, 'warning', 'Archivo subido')
    } else {
      estadoFiltro.value = null
      showToast(
        `Documento ${selectedSlot.value} disponible para ${laboratorioNombre.value}`,
        'success',
        uploadSlotTieneArchivo.value ? 'Documento reemplazado' : 'Documento subido'
      )
    }

    uploadingDoc.value = false
    closeUploadModal()
  } catch (err) {
    console.error('confirmUpload error', err)
    uploadError.value = errorMessage(err)
  } finally {
    uploadingDoc.value = false
  }
}

/* ============================================================
   Revisión del expediente (aprobar / rechazar / cambiar estado)
   ============================================================ */
const revisandoDoc = ref<DocIntegrante | null>(null)
const revEstado = ref<EstadoDoc>('revisado')
const revMotivo = ref('')
const revisionError = ref('')
const savingRevision = ref(false)
const motivoInput = ref<HTMLTextAreaElement | null>(null)

const openRevision = (doc: DocIntegrante, estado?: EstadoDoc) => {
  revisandoDoc.value = doc
  revEstado.value = estado ?? (doc.estado === 'pendiente' ? 'subido' : doc.estado)
  revMotivo.value = doc.motivo || ''
  revisionError.value = ''
  nextTick(() => motivoInput.value?.focus())
}

const closeRevision = () => {
  if (savingRevision.value) return
  revisandoDoc.value = null
  revMotivo.value = ''
  revisionError.value = ''
}

const enviarRevision = async (doc: DocIntegrante, estado: EstadoDoc, motivo: string) => {
  if (!laboratorioId.value) throw new Error('No se pudo identificar el laboratorio de esta inscripción.')
  const body = await requestJson(
    `${API_BASE}/api/ensayos/${ensayoId.value}/laboratorios/${laboratorioId.value}/documentos/${doc.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: mapEstadoServidorInverso(estado), motivo })
    }
  )
  const updated = body.data || body
  const idx = documentos.value.findIndex(d => String(d.id) === String(doc.id))
  if (idx >= 0) {
    documentos.value[idx] = {
      ...documentos.value[idx],
      estado: mapEstadoServidor(updated.estado ?? estado),
      motivo: updated.motivo ?? motivo
    }
    if (currentDoc.value && String(currentDoc.value.id) === String(doc.id)) {
      currentDoc.value = documentos.value[idx]
    }
  }
}

const aprobar = async (doc: DocIntegrante) => {
  if (!doc || acting.value) return
  acting.value = doc.id
  try {
    await enviarRevision(doc, 'revisado', '')
    showToast(`${doc.nombre} quedó aprobado`, 'success', 'Documento aprobado')
  } catch (err) {
    showToast(errorMessage(err), 'error', 'No se pudo aprobar')
  } finally {
    acting.value = null
  }
}

const guardarRevision = async () => {
  const doc = revisandoDoc.value
  if (!doc || savingRevision.value) return

  if (revEstado.value === 'rechazado' && !revMotivo.value) {
    revisionError.value = 'Escribe el motivo del rechazo para que el laboratorio sepa qué corregir.'
    motivoInput.value?.focus()
    return
  }

  savingRevision.value = true
  revisionError.value = ''
  try {
    await enviarRevision(doc, revEstado.value, revMotivo.value)
    savingRevision.value = false
    closeRevision()
    showToast(
      revEstado.value === 'rechazado' ? 'Se notificará el motivo al laboratorio' : 'Estado actualizado',
      'success',
      doc.nombre
    )
  } catch (err) {
    revisionError.value = errorMessage(err)
  } finally {
    savingRevision.value = false
  }
}

/* ============================================================
   Visor de documento
   ============================================================ */
const showPdfModal = ref(false)
const currentDoc = ref<DocIntegrante | null>(null)
const originalPdfUrl = ref('')
const blobUrl = ref('')
const pdfLoading = ref(false)
const pdfError = ref('')
const pdfSrc = computed(() => (blobUrl.value ? `${blobUrl.value}#view=FitH` : ''))

const revokeBlob = () => {
  if (blobUrl.value) {
    try { URL.revokeObjectURL(blobUrl.value) } catch { /* ignorar */ }
  }
  blobUrl.value = ''
}

const isPdfBuffer = (buf: ArrayBuffer) => {
  const b = new Uint8Array(buf, 0, Math.min(4, buf.byteLength))
  return b.length === 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46
}

/**
 * Se descarga con la cabecera de sesión y se muestra desde un blob:
 * así funciona aunque el archivo esté protegido o el servidor mande
 * `Content-Disposition: attachment` o `X-Frame-Options`.
 */
const openPdf = async (doc: DocIntegrante) => {
  const url = resolveUrl(doc.url)
  const ext = fileExt(doc.nombre) || fileExt(url)

  if (url && ext && ext !== 'pdf') {
    window.open(url, '_blank', 'noopener')
    return
  }

  revokeBlob()
  currentDoc.value = doc
  originalPdfUrl.value = url
  pdfError.value = ''
  showPdfModal.value = true

  if (!url) {
    pdfError.value = 'Este documento no tiene archivo disponible.'
    return
  }

  pdfLoading.value = true
  try {
    const h: Record<string,string> = {}
    const t = getAuthToken()
    if (t) h.Authorization = `Bearer ${t}`
    const resp = await fetch(url, { headers: h })
    if (!resp.ok) throw new Error(`El servidor respondió ${resp.status}`)
    const buf = await resp.arrayBuffer()
    if (!isPdfBuffer(buf)) throw new Error('El archivo descargado no es un PDF válido.')
    blobUrl.value = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }))
  } catch (err) {
    console.error('openPdf error', err)
    pdfError.value = `${errorMessage(err)} Puedes abrirlo en una pestaña nueva.`
  } finally {
    pdfLoading.value = false
  }
}

const closePdf = () => {
  showPdfModal.value = false
  currentDoc.value = null
  originalPdfUrl.value = ''
  pdfError.value = ''
  pdfLoading.value = false
  revokeBlob()
}

/* ============================================================
   Comportamiento de los modales
   ============================================================ */
const anyModalOpen = computed(() => showPdfModal.value || !!revisandoDoc.value || showUploadModal.value)

watch(anyModalOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  if (showUploadModal.value) closeUploadModal()
  else if (revisandoDoc.value) closeRevision()
  else if (showPdfModal.value) closePdf()
}

const goBack = () => router.push(`/admin/ensayos/${ensayoId.value}`)

/* ============================================================
   Ciclo de vida
   ============================================================ */
onMounted(async () => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  window.addEventListener('keydown', onKeydown)
  await cargarTodo()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  revokeBlob()
})

watch(currentTheme, (t) => { document.documentElement.setAttribute('data-bs-theme', t) })
</script>

<style>
/* Tokens globales (sin cambios) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
:root {
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --bg: #f5f7f2; --surface: #ffffff; --surface-sunken: #fafbf9; --border: #e6e8e2; --border-strong: #c4cbba;
  --text: #1b201a; --text-secondary: #556052; --text-tertiary: #8a9382;
  --brand: #3f7a2a; --brand-hover: #356822; --brand-soft: rgba(63,122,42,0.10); --brand-soft-border: rgba(63,122,42,0.28);
  --danger: #d64545; --danger-soft: rgba(214,69,69,0.10); --warning: #c98a1e; --warning-soft: rgba(201,138,30,0.12); --neutral-soft: rgba(0,0,0,0.04);
  --info: #3a7ab8; --info-soft: rgba(58,122,184,0.12);
  --radius-xs: 6px; --radius-sm: 8px; --radius-md: 10px; --radius-lg: 12px; --radius-xl: 16px;
  --shadow-sm: 0 1px 3px rgba(20,24,16,0.06), 0 1px 2px rgba(20,24,16,0.04); --shadow-md: 0 6px 20px rgba(20,24,16,0.08); --shadow-lg: 0 16px 40px rgba(20,24,16,0.14);
  --transition: all 0.15s ease;
}
[data-bs-theme="dark"] {
  --bg: #0e100d; --surface: #161a13; --surface-sunken: #12150f; --border: rgba(255,255,255,0.08); --border-strong: rgba(255,255,255,0.14);
  --text: #eaeee4; --text-secondary: #99a38e; --text-tertiary: #6c7563;
  --brand: #7cbb55; --brand-hover: #8fc96b; --brand-soft: rgba(124,187,85,0.14); --brand-soft-border: rgba(124,187,85,0.3);
  --danger: #e2696a; --danger-soft: rgba(226,105,106,0.12); --warning: #dcaa4c; --warning-soft: rgba(220,170,76,0.12); --neutral-soft: rgba(255,255,255,0.05);
  --info: #6aa9db; --info-soft: rgba(106,169,219,0.14);
}
</style>

<style scoped>
.integrante-detalle-page { font-family: var(--font-body); background: var(--bg); min-height: 100vh; color: var(--text); font-size: 14px; -webkit-font-smoothing: antialiased; }
.integrante-detalle-page .container { max-width: 1200px; margin: 0 auto; padding: 0 1.75rem; }

.visually-hidden { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* ============================================================
   BOTONES (compartidos con los modales)
   ============================================================ */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;
  padding: 0.55rem 1.05rem; border-radius: var(--radius-sm);
  font-family: var(--font-body); font-size: 0.82rem; font-weight: 600; line-height: 1.2;
  border: 1px solid transparent; cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: var(--transition);
}
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.btn:focus-visible { outline: 3px solid var(--brand-soft-border); outline-offset: 2px; }
.btn-primary { background: var(--brand); border-color: var(--brand); color: #fff; }
.btn-primary:hover:not(:disabled) { background: var(--brand-hover); border-color: var(--brand-hover); }
.btn-secondary { background: var(--surface); border-color: var(--border); color: var(--text); }
.btn-secondary:hover:not(:disabled) { background: var(--surface-sunken); border-color: var(--border-strong); }
.btn-danger { background: transparent; border-color: var(--danger); color: var(--danger); }
.btn-danger:hover:not(:disabled) { background: var(--danger); color: #fff; }
.btn-sm { padding: 0.4rem 0.75rem; font-size: 0.76rem; }
.btn-grow { flex: 1; }

.spinner {
  width: 14px; height: 14px; border: 2px solid currentColor; border-right-color: transparent;
  border-radius: 50%; display: inline-block; animation: spin 0.7s linear infinite; flex-shrink: 0;
}
.spinner.lg { width: 28px; height: 28px; border-width: 3px; color: var(--brand); }
@keyframes spin { to { transform: rotate(360deg); } }

/* ============================================================
   HEADER
   ============================================================ */
.detalle-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1.5rem 0 1.75rem; position: relative; overflow: hidden; }
.detalle-header::after { content: ''; position: absolute; top: -45%; right: -6%; width: 360px; height: 360px; background: radial-gradient(circle, var(--brand-soft) 0%, transparent 68%); pointer-events: none; }
.breadcrumb-nav { margin-bottom: 1rem; position: relative; z-index: 1; }
.breadcrumb-list { display: flex; align-items: center; gap: 0.4rem; padding: 0; margin: 0; list-style: none; font-size: 0.78rem; flex-wrap: wrap; }
.breadcrumb-item { display: flex; align-items: center; gap: 0.3rem; color: var(--text-tertiary); }
.breadcrumb-item.active { color: var(--text-secondary); font-weight: 600; }
.breadcrumb-link { color: var(--text-tertiary); text-decoration: none; transition: var(--transition); display: flex; align-items: center; gap: 0.3rem; }
.breadcrumb-link:hover { color: var(--brand); }
.breadcrumb-separator { color: var(--border-strong); font-size: 0.6rem; }

.back-btn { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--surface-sunken); border: 1px solid var(--border); color: var(--text-secondary); padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: var(--transition); margin-bottom: 1.25rem; position: relative; z-index: 1; }
.back-btn:hover { color: var(--brand); border-color: var(--brand-soft-border); transform: translateX(-2px); }

.hero { display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; position: relative; z-index: 1; }
.hero-id { display: flex; align-items: center; gap: 1.1rem; min-width: 0; }
.avatar-lg { width: 64px; height: 64px; border-radius: 18px; background: var(--brand-soft); color: var(--brand); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800; flex-shrink: 0; border: 1px solid var(--brand-soft-border); }
.hero-id-text { min-width: 0; }
.section-eyebrow { display: inline-block; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brand); margin-bottom: 0.3rem; }
.hero-name { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); margin: 0 0 0.5rem; }
.hero-contact { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.contact-item { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--text-secondary); text-decoration: none; transition: var(--transition); }
a.contact-item:hover { color: var(--brand); }
.contact-item i { color: var(--text-tertiary); }

.hero-progress-card { position: relative; width: 92px; height: 92px; flex-shrink: 0; }
.ring { width: 92px; height: 92px; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: var(--neutral-soft); stroke-width: 8; }
.ring-fill { fill: none; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
.ring-fill.low { stroke: var(--danger); }
.ring-fill.mid { stroke: var(--warning); }
.ring-fill.complete { stroke: var(--brand); }
.ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-pct { font-size: 1.15rem; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; line-height: 1; }
.ring-label { font-size: 0.58rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 0.15rem; }

.hero-error { display: flex; align-items: center; gap: 0.75rem; color: var(--danger); font-weight: 600; position: relative; z-index: 1; flex-wrap: wrap; }

.hero-skeleton { position: relative; z-index: 1; }
.sk { background: linear-gradient(90deg, var(--surface-sunken) 25%, var(--neutral-soft) 37%, var(--surface-sunken) 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; border-radius: var(--radius-sm); }
.sk-title { width: 280px; height: 30px; margin-bottom: 0.7rem; }
.sk-sub { width: 380px; max-width: 80%; height: 16px; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

/* ============================================================
   MAIN
   ============================================================ */
.detalle-main { padding: 1.5rem 0 3rem; }

.summary-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
.summary-card {
  display: flex; align-items: center; gap: 0.7rem; padding: 0.85rem 1rem;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
  transition: var(--transition); cursor: pointer; text-align: left; font-family: var(--font-body);
}
.summary-card:hover { border-color: var(--border-strong); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.summary-card.active { border-color: var(--brand); background: var(--brand-soft); }
.summary-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.summary-dot.d-total { background: var(--text-tertiary); }
.summary-dot.d-ok { background: var(--brand); }
.summary-dot.d-up { background: var(--info); }
.summary-dot.d-pend { background: var(--warning); }
.summary-dot.d-rej { background: var(--danger); }
.summary-info { display: flex; flex-direction: column; }
.summary-number { font-size: 1.15rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; line-height: 1.1; }
.summary-label { font-size: 0.68rem; color: var(--text-secondary); }

.panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.9rem 1.15rem; border-bottom: 1px solid var(--border); background: var(--surface-sunken); flex-wrap: wrap; }
.panel-title { font-size: 0.86rem; font-weight: 700; color: var(--text); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.panel-title i { color: var(--brand); }
.panel-tools { display: flex; align-items: center; gap: 0.6rem; }
.panel-count { font-size: 0.72rem; font-weight: 700; color: var(--brand); background: var(--brand-soft); border: 1px solid var(--brand-soft-border); padding: 0.1rem 0.5rem; border-radius: 999px; font-variant-numeric: tabular-nums; }
.panel-body { padding: 1.15rem; }
.panel-body.no-pad { padding: 0; }

.empty-mini { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem 1rem; color: var(--text-secondary); text-align: center; font-size: 0.82rem; }
.empty-mini.pad { padding: 3rem 1rem; }
.empty-mini > i { font-size: 1.9rem; color: var(--border-strong); }
.empty-mini strong { color: var(--text); font-size: 0.95rem; }

.table-responsive { overflow-x: auto; }
.docs-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.docs-table thead th { padding: 0.7rem 1.15rem; text-align: left; font-weight: 600; font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); background: var(--surface-sunken); border-bottom: 1px solid var(--border); white-space: nowrap; }
.docs-table tbody td { padding: 0.8rem 1.15rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
.docs-table tbody tr:last-child td { border-bottom: none; }
.docs-table tbody tr { transition: var(--transition); }
.docs-table tbody tr:hover { background: var(--surface-sunken); }
.col-act { width: 150px; text-align: right; }
.row-actions { display: inline-flex; gap: 0.3rem; }

.doc-cell { display: flex; align-items: flex-start; gap: 0.65rem; }
.doc-mini-icon { width: 30px; height: 30px; border-radius: var(--radius-sm); background: var(--danger-soft); color: var(--danger); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
.doc-mini-icon.muted { background: var(--neutral-soft); color: var(--text-tertiary); }
.doc-text { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
.doc-name { font-size: 0.83rem; font-weight: 600; color: var(--text); }
.doc-motivo { display: inline-flex; align-items: flex-start; gap: 0.3rem; font-size: 0.72rem; color: var(--danger); }
.cell-muted { font-size: 0.8rem; color: var(--text-secondary); }

.estado-badge { display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.22rem 0.6rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
.estado-badge.e-pendiente { background: var(--warning-soft); color: var(--warning); }
.estado-badge.e-subido { background: var(--info-soft); color: var(--info); }
.estado-badge.e-revisado { background: var(--brand-soft); color: var(--brand); }
.estado-badge.e-rechazado { background: var(--danger-soft); color: var(--danger); }

.row-btn { width: 30px; height: 30px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); font-size: 0.78rem; }
.row-btn:hover:not(:disabled) { color: var(--brand); border-color: var(--brand-soft-border); background: var(--brand-soft); }
.row-btn.danger:hover:not(:disabled) { color: var(--danger); border-color: var(--danger); background: var(--danger-soft); }
.row-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.waiting-label { font-size: 0.72rem; color: var(--text-tertiary); font-style: italic; }
.empty-inline { text-align: center; color: var(--text-secondary); padding: 1.5rem !important; font-size: 0.82rem; }

/* ============================================================
   DOCUMENTOS INDIVIDUALES
   ============================================================ */
.individuales { margin-top: 1.5rem; }

.section-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap; margin-bottom: 0.85rem;
}
.section-title { font-size: 0.95rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.section-title i { color: var(--brand); }
.section-sub { margin: 0.25rem 0 0; font-size: 0.78rem; color: var(--text-secondary); max-width: 70ch; }

.slots-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; }

.slot-card {
  display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem;
  background: var(--surface); border: 1px solid var(--border);
  border-top: 3px solid var(--border-strong);
  border-radius: var(--radius-lg); transition: var(--transition);
}
.slot-card:hover { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }
.slot-card.is-filled { border-top-color: var(--brand); }

.slot-head { display: flex; align-items: flex-start; gap: 0.65rem; }
.slot-badge {
  width: 28px; height: 28px; border-radius: var(--radius-sm); flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--brand-soft); color: var(--brand); border: 1px solid var(--brand-soft-border);
  font-size: 0.78rem; font-weight: 800; font-variant-numeric: tabular-nums;
}
.slot-badge.sm { width: 22px; height: 22px; font-size: 0.7rem; }
.slot-meta { flex: 1; min-width: 0; }
.slot-title { font-size: 0.85rem; font-weight: 700; margin: 0; color: var(--text); }
.slot-desc { font-size: 0.72rem; line-height: 1.4; color: var(--text-secondary); margin: 0.15rem 0 0; }
.slot-state {
  display: inline-flex; align-items: center; gap: 0.3rem; flex-shrink: 0;
  padding: 0.18rem 0.5rem; border-radius: 999px; font-size: 0.66rem; font-weight: 700;
}
.slot-state.ok { background: var(--brand-soft); color: var(--brand); }
.slot-state.empty { background: var(--neutral-soft); color: var(--text-tertiary); }

.slot-file {
  display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.7rem;
  background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-md);
}
.file-icon {
  width: 32px; height: 32px; border-radius: var(--radius-sm); flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--danger-soft); color: var(--danger); font-size: 0.95rem;
}
.file-text { display: flex; flex-direction: column; min-width: 0; }
.file-name { font-size: 0.78rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-sub { font-size: 0.68rem; color: var(--text-tertiary); }

.slot-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2rem;
  padding: 1.1rem 0.75rem; border: 2px dashed var(--border-strong); border-radius: var(--radius-md);
  background: var(--surface-sunken); color: var(--text-secondary);
  font-family: var(--font-body); font-size: 0.8rem; font-weight: 600; cursor: pointer;
  transition: var(--transition);
}
.slot-empty:hover:not(:disabled) { border-color: var(--brand); color: var(--brand); background: var(--brand-soft); }
.slot-empty:disabled { opacity: 0.55; cursor: not-allowed; }
.slot-empty i { font-size: 1.3rem; }
.slot-empty small { font-weight: 500; font-size: 0.68rem; color: var(--text-tertiary); }

.slot-actions { display: flex; gap: 0.4rem; margin-top: auto; }

.admin-note { display: flex; align-items: center; gap: 0.5rem; margin: 1.25rem 0 0; padding: 0.75rem 1rem; background: var(--info-soft); border: 1px solid var(--info); border-radius: var(--radius-md); color: var(--info); font-size: 0.8rem; }

/* ============================================================
   MODALES
   ============================================================ */
.ed-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center; padding: 1.25rem;
  background: rgba(12, 15, 10, 0.55); backdrop-filter: blur(4px);
  font-family: var(--font-body); font-size: 14px; color: var(--text);
}
.ed-modal {
  width: 100%; max-height: calc(100vh - 2.5rem);
  display: flex; flex-direction: column;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden;
}
.ed-modal.size-md { max-width: 560px; }
.ed-modal.size-xl { max-width: 1040px; height: calc(100vh - 2.5rem); }

.ed-modal-header { display: flex; align-items: center; gap: 0.85rem; padding: 1.1rem 1.35rem; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.ed-modal-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; background: var(--brand-soft); color: var(--brand); border: 1px solid var(--brand-soft-border); }
.ed-modal-icon.is-danger { background: var(--danger-soft); color: var(--danger); border-color: transparent; }
.ed-modal-heading { flex: 1; min-width: 0; }
.ed-modal-title { margin: 0; font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ed-modal-subtitle { margin: 0.1rem 0 0; font-size: 0.75rem; color: var(--text-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ed-modal-close { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); flex-shrink: 0; }
.ed-modal-close:hover:not(:disabled) { background: var(--surface-sunken); color: var(--text); }
.ed-modal-close:disabled { opacity: 0.5; cursor: not-allowed; }

.ed-modal-body { flex: 1; overflow-y: auto; padding: 1.25rem 1.35rem; display: flex; flex-direction: column; gap: 1.1rem; }
.ed-modal-footer { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.35rem; border-top: 1px solid var(--border); background: var(--surface-sunken); flex-shrink: 0; flex-wrap: wrap; }
.footer-note { font-size: 0.74rem; color: var(--text-tertiary); }
.footer-actions { display: flex; gap: 0.5rem; margin-left: auto; }

.ed-modal-enter-active, .ed-modal-leave-active { transition: opacity 0.18s ease; }
.ed-modal-enter-active .ed-modal, .ed-modal-leave-active .ed-modal { transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.18s ease; }
.ed-modal-enter-from, .ed-modal-leave-to { opacity: 0; }
.ed-modal-enter-from .ed-modal, .ed-modal-leave-to .ed-modal { transform: translateY(14px) scale(0.98); opacity: 0; }

/* Visor */
.pdf-body { padding: 0; background: var(--surface-sunken); gap: 0; }
.pdf-iframe { flex: 1; width: 100%; height: 100%; min-height: 60vh; border: none; background: #525659; }
.pdf-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.6rem; padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.85rem; }
.pdf-state > i { font-size: 2.2rem; color: var(--border-strong); }
.pdf-state strong { color: var(--text); }

/* Formularios de los modales */
.alert-inline { display: flex; align-items: flex-start; gap: 0.55rem; padding: 0.7rem 0.85rem; border-radius: var(--radius-md); background: var(--danger-soft); border: 1px solid var(--danger); color: var(--danger); font-size: 0.8rem; line-height: 1.45; }
.replace-note { display: flex; align-items: flex-start; gap: 0.5rem; margin: 0; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); background: var(--info-soft); color: var(--info); font-size: 0.78rem; }
.replace-note strong { color: var(--text); }

.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field-label { font-size: 0.8rem; font-weight: 600; color: var(--text); }
.req { color: var(--danger); }
.field-input {
  width: 100%; padding: 0.6rem 0.8rem; border: 1px solid var(--border-strong); border-radius: var(--radius-sm);
  background: var(--surface); color: var(--text); font-family: var(--font-body); font-size: 0.85rem; resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.field-input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-soft); }
.field-input.is-invalid { border-color: var(--danger); box-shadow: 0 0 0 3px var(--danger-soft); }
.field-hint { font-size: 0.72rem; color: var(--text-tertiary); }

.dropzone {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem;
  padding: 1.5rem 1rem; border: 2px dashed var(--border-strong); border-radius: var(--radius-md);
  background: var(--surface-sunken); text-align: center; cursor: pointer; transition: var(--transition);
}
.dropzone:hover, .dropzone.is-dragging { border-color: var(--brand); background: var(--brand-soft); }
.dropzone.is-filled { border-style: solid; border-color: var(--brand-soft-border); }
.dropzone:focus-within { outline: 3px solid var(--brand-soft-border); outline-offset: 2px; }
.dz-icon { font-size: 1.5rem; color: var(--brand); }
.dz-name { font-size: 0.82rem; font-weight: 600; word-break: break-all; }
.dz-hint { font-size: 0.7rem; color: var(--text-tertiary); }
.link-like { color: var(--brand); text-decoration: underline; text-underline-offset: 2px; }

.estado-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
.estado-option {
  display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
  padding: 0.75rem 0.5rem; border: 1.5px solid var(--border); border-radius: var(--radius-md);
  background: var(--surface); color: var(--text-secondary); font-family: var(--font-body);
  font-size: 0.74rem; font-weight: 600; cursor: pointer; transition: var(--transition); text-align: center;
}
.estado-option i { font-size: 1.1rem; }
.estado-option:hover:not(:disabled) { border-color: var(--border-strong); color: var(--text); }
.estado-option:disabled { opacity: 0.6; cursor: not-allowed; }
.estado-option.active { border-color: var(--brand); background: var(--brand-soft); color: var(--brand); }
.estado-option.active.o-subido { border-color: var(--info); background: var(--info-soft); color: var(--info); }
.estado-option.active.o-revisado { border-color: var(--brand); background: var(--brand-soft); color: var(--brand); }
.estado-option.active.o-rechazado { border-color: var(--danger); background: var(--danger-soft); color: var(--danger); }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 900px) {
  .summary-row { grid-template-columns: repeat(3, 1fr); }
  .slots-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .hero { flex-direction: column; align-items: flex-start; }
  .hero-name { font-size: 1.35rem; }
  .panel-header { flex-direction: column; align-items: stretch; }
  .estado-options { grid-template-columns: 1fr; }
  .estado-option { flex-direction: row; justify-content: flex-start; gap: 0.6rem; }
}
@media (max-width: 576px) {
  .summary-row { grid-template-columns: repeat(2, 1fr); }
  .slots-grid { grid-template-columns: 1fr; }
  .integrante-detalle-page .container { padding: 0 1rem; }
  .ed-overlay { padding: 0; align-items: flex-end; }
  .ed-modal, .ed-modal.size-xl { max-height: 94vh; height: auto; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
  .ed-modal.size-xl { height: 94vh; }
  .footer-note { display: none; }
  .footer-actions { width: 100%; }
  .footer-actions .btn { flex: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .sk, .spinner { animation: none; }
  .ring-fill { transition: none; }
  .summary-card:hover { transform: none; }
}
</style>
