<template>
  <div :data-bs-theme="currentTheme" class="cliente-dashboard">

    <!-- ============================================================
         Encabezado del panel + indicadores
         ============================================================ -->
    <header class="dash-header">
      <div class="container">
        <div class="dash-header-row">
          <div class="dash-header-text">
            <span class="section-eyebrow">Portal del cliente</span>
            <h1 class="dash-title">Mi panel</h1>
            <p class="dash-subtitle">Consulta tus ensayos y próximas sesiones en un solo lugar.</p>
          </div>
          <button type="button" class="btn-sena" @click="openEnrollModal">
            <i class="bi bi-plus-lg"></i>
            Inscribirme a un ensayo
          </button>
        </div>

        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.key" class="kpi-card">
            <div class="kpi-icon"><i :class="kpi.icon"></i></div>
            <div class="kpi-body">
              <span class="kpi-label">{{ kpi.label }}</span>
              <strong class="kpi-value">
                <span v-if="loadingEnrollments && kpi.dependsOnEnrollments" class="skeleton skeleton-kpi"></span>
                <template v-else>{{ kpi.value }}</template>
              </strong>
              <span v-if="kpi.hint" class="kpi-hint">{{ kpi.hint }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ============================================================
         Programas disponibles (carrusel)
         ============================================================ -->
    <section v-if="loadingPrograms || programs.length" class="dash-section">
      <div class="container">
        <div class="section-head" data-aos="fade-up">
          <div>
            <span class="section-eyebrow">Catálogo</span>
            <h2 class="section-title">Programas disponibles</h2>
            <p class="section-subtitle">Descarga el programa y, si ya tienes tu código, inscríbete al instante.</p>
          </div>
        </div>

        <div
          class="featured-card"
          aria-roledescription="carrusel"
          aria-label="Programas disponibles"
          @mouseenter="carouselPaused = true"
          @mouseleave="carouselPaused = false"
          @focusin="carouselPaused = true"
          @focusout="carouselPaused = false"
          @touchstart.passive="onTouchStart"
          @touchend="onTouchEnd"
        >
          <!-- Cargando -->
          <div v-if="loadingPrograms && !programs.length" class="featured-slide" aria-hidden="true">
            <div class="featured-content">
              <div class="skeleton skeleton-line w-25"></div>
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-line"></div>
              <div class="skeleton skeleton-line w-75"></div>
              <div class="skeleton skeleton-btn"></div>
            </div>
            <div class="featured-preview"><div class="skeleton skeleton-page"></div></div>
          </div>

          <transition v-else name="slide-fade" mode="out-in">
            <div
              v-if="currentFeatured"
              :key="currentFeatured.id"
              class="featured-slide"
              role="group"
              aria-roledescription="diapositiva"
              :aria-label="`${featuredIndex + 1} de ${programs.length}`"
            >
              <div class="featured-content">
                <span class="section-eyebrow">{{ currentFeatured.type || 'Programa' }}</span>
                <h3 class="featured-title">{{ currentFeatured.title }}</h3>
                <p class="featured-description">{{ currentFeatured.description }}</p>

                <div class="featured-meta">
                  <span v-if="currentFeatured.year"><i class="bi bi-calendar-check"></i>Año {{ currentFeatured.year }}</span>
                  <span v-if="currentFeatured.fileName"><i class="bi bi-file-earmark-pdf"></i>{{ currentFeatured.fileName }}</span>
                </div>

                <div class="featured-actions">
                  <button
                    type="button"
                    class="btn-sena"
                    :disabled="!currentFeatured.fileUrl"
                    :title="currentFeatured.fileUrl ? 'Abrir el programa en PDF' : 'Este programa aún no tiene archivo'"
                    @click="downloadFeaturedPdf"
                  >
                    <i class="bi bi-download"></i>
                    Descargar programa
                  </button>
                  <button type="button" class="btn-sena-outline" @click="openEnrollModal">
                    <i class="bi bi-ticket-perforated"></i>
                    Tengo un código
                  </button>
                </div>
              </div>

              <div class="featured-preview">
                <img
                  v-if="thumbnails[currentFeatured.id]"
                  :src="thumbnails[currentFeatured.id]"
                  :alt="`Primera página de ${currentFeatured.title}`"
                  class="preview-thumb"
                >
                <div v-else-if="!currentFeatured.fileUrl" class="pdf-preview muted">
                  <i class="bi bi-file-earmark-slides"></i>
                  <span>Sin archivo disponible</span>
                </div>
                <div v-else-if="thumbnailFailed[currentFeatured.id]" class="pdf-preview muted">
                  <i class="bi bi-file-earmark-pdf"></i>
                  <span>Vista previa no disponible</span>
                  <small>Puedes descargar el programa igualmente</small>
                </div>
                <div v-else class="pdf-preview loading">
                  <i class="bi bi-file-earmark-pdf-fill"></i>
                  <span>Generando vista previa...</span>
                </div>
              </div>
            </div>
          </transition>

          <div v-if="programs.length > 1" class="carousel-nav">
            <button type="button" class="carousel-control" aria-label="Programa anterior" @click="prevFeatured">
              <i class="bi bi-chevron-left"></i>
            </button>
            <div class="carousel-indicators">
              <button
                v-for="(p, i) in programs"
                :key="p.id"
                type="button"
                :class="{ active: i === featuredIndex }"
                :aria-label="`Ir al programa ${i + 1}: ${p.title}`"
                :aria-current="i === featuredIndex ? 'true' : undefined"
                @click="goToFeatured(i)"
              ></button>
            </div>
            <button type="button" class="carousel-control" aria-label="Programa siguiente" @click="nextFeatured">
              <i class="bi bi-chevron-right"></i>
            </button>
            <span class="carousel-counter">{{ featuredIndex + 1 }} / {{ programs.length }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         Mis ensayos (desde el backend)
         ============================================================ -->
    <section id="mis-programas" class="dash-section">
      <div class="container">
        <div class="section-head" data-aos="fade-up">
          <div>
            <span class="section-eyebrow">Mis ensayos</span>
            <h2 class="section-title">Ensayos inscritos</h2>
            <p class="section-subtitle">Accede a la documentación de cada ensayo de aptitud</p>
          </div>
          <button type="button" class="btn-sena-outline" @click="openEnrollModal">
            <i class="bi bi-plus-lg"></i>
            Agregar con código
          </button>
        </div>

        <!-- Error al cargar -->
        <div v-if="enrollmentsError && !loadingEnrollments" class="error-banner" role="alert">
          <i class="bi bi-cloud-slash"></i>
          <div class="error-banner-text">
            <strong>No pudimos cargar tus ensayos</strong>
            <span>{{ enrollmentsError }}</span>
          </div>
          <button type="button" class="btn-sena-outline btn-sm" @click="fetchMyEnsayos">
            <i class="bi bi-arrow-clockwise"></i>
            Reintentar
          </button>
        </div>

        <div class="programs-grid">
          <!-- Cargando -->
          <template v-if="loadingEnrollments">
            <div v-for="n in 2" :key="`sk-${n}`" class="program-card is-skeleton" aria-hidden="true">
              <div class="program-card-top">
                <div class="skeleton skeleton-icon"></div>
                <div class="skeleton skeleton-pill"></div>
              </div>
              <div class="skeleton skeleton-line w-75"></div>
              <div class="skeleton skeleton-line w-50"></div>
              <div class="skeleton skeleton-block"></div>
              <div class="skeleton skeleton-btn w-100"></div>
            </div>
          </template>

          <template v-else>
            <article
              v-for="(program, idx) in enrolledPrograms"
              :key="program.id"
              class="program-card"
              :class="{ 'is-new': program.id === highlightedProgramId }"
              data-aos="fade-up"
              :data-aos-delay="idx * 80"
              role="link"
              tabindex="0"
              :aria-label="`Ver documentos de ${program.title}`"
              @click="openProgramDetail(program.id)"
              @keydown.enter.self="openProgramDetail(program.id)"
            >
              <div class="program-card-top">
                <div class="program-icon-wrap"><i :class="program.icon"></i></div>
                <span class="status-pill" :class="`status-${program.status}`">
                  <i :class="programStatus(program.status).icon"></i>
                  {{ programStatus(program.status).label }}
                </span>
              </div>

              <h3 class="program-title">{{ program.title }}</h3>
              <p v-if="program.programCode" class="program-code">
                <i class="bi bi-upc"></i>{{ program.programCode }}
              </p>
              <p class="program-description">{{ program.description }}</p>

              <div class="program-dates">
                <div class="date-item">
                  <span class="date-label">Inicio del ensayo</span>
                  <span class="date-value">
                    <i class="bi bi-calendar3"></i>{{ formatDate(program.startDate) || 'Por definir' }}
                  </span>
                </div>
                <div class="date-item">
                  <span class="date-label">Inscrito el</span>
                  <span class="date-value">
                    <i class="bi bi-calendar-check"></i>{{ formatDate(program.enrolledAt) || '—' }}
                  </span>
                </div>
              </div>

              <!-- Solo si el backend llega a enviar progreso -->
              <div v-if="typeof program.progress === 'number'" class="program-progress">
                <div class="progress-info">
                  <span>Progreso</span>
                  <strong>{{ program.progress }}%</strong>
                </div>
                <div
                  class="progress-track"
                  role="progressbar"
                  :aria-valuenow="program.progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`Progreso de ${program.title}`"
                >
                  <div class="progress-fill" :style="{ width: program.progress + '%' }"></div>
                </div>
              </div>

              <div class="program-actions">
                <button
                  type="button"
                  class="btn-sena-outline"
                  tabindex="-1"
                  @click.stop="openProgramDetail(program.id)"
                >
                  Ver documentos
                  <i class="bi bi-arrow-right"></i>
                </button>
                <button
                  v-if="program.docsUrl"
                  type="button"
                  class="btn-sena-ghost btn-icon"
                  title="Abrir generalidades (PDF)"
                  :aria-label="`Abrir generalidades de ${program.title}`"
                  @click.stop="openUrl(program.docsUrl)"
                >
                  <i class="bi bi-file-earmark-pdf"></i>
                </button>
              </div>
            </article>

            <!-- Tarjeta "+" para inscribirse con código -->
            <button
              type="button"
              class="add-card"
              :class="{ 'is-empty': !enrolledPrograms.length }"
              data-aos="fade-up"
              :data-aos-delay="enrolledPrograms.length * 80"
              @click="openEnrollModal"
            >
              <span class="add-icon"><i class="bi bi-plus-lg"></i></span>
              <span class="add-title">
                {{ enrolledPrograms.length ? 'Inscribirme a otro ensayo' : 'Inscríbete a tu primer ensayo' }}
              </span>
              <span class="add-text">Usa el código de acceso de 6 caracteres que te compartió SENA.</span>
            </button>
          </template>
        </div>
      </div>
    </section>

    <!-- ============================================================
         Sesiones programadas
         ============================================================ -->
    <section class="dash-section dash-section-last">
      <div class="container">
        <div class="section-head" data-aos="fade-up">
          <div>
            <span class="section-eyebrow">Agenda</span>
            <h2 class="section-title">Sesiones programadas</h2>
            <p class="section-subtitle">Próximas videollamadas y reuniones técnicas</p>
          </div>
        </div>

        <div class="sessions-list">
          <div
            v-for="(session, idx) in upcomingSessions"
            :key="session.id"
            class="session-card"
            :class="{ 'is-next': idx === 0 }"
            data-aos="fade-up"
            :data-aos-delay="idx * 80"
          >
            <div class="session-date">
              <span class="session-day">{{ session.day }}</span>
              <span class="session-month">{{ session.month }}</span>
            </div>

            <div class="session-content">
              <div class="session-header">
                <h4>
                  {{ session.title }}
                  <span v-if="idx === 0" class="next-badge">Próxima</span>
                </h4>
                <span class="status-pill" :class="`status-${session.type}`">
                  <i :class="sessionType(session.type).icon"></i>
                  {{ sessionType(session.type).label }}
                </span>
              </div>
              <p class="session-description">{{ session.description }}</p>
              <div class="session-meta">
                <span><i class="bi bi-clock"></i>{{ session.time }}</span>
                <span><i class="bi bi-person"></i>{{ session.host }}</span>
              </div>
              <div class="session-actions">
                <button
                  v-if="session.type === 'video'"
                  type="button"
                  class="btn-sena btn-sm"
                  @click="joinSession(session.link)"
                >
                  <i class="bi bi-box-arrow-in-right"></i>
                  Unirse
                </button>
                <button type="button" class="btn-sena-outline btn-sm">
                  <i class="bi bi-info-circle"></i>
                  Detalles
                </button>
              </div>
            </div>
          </div>

          <div v-if="upcomingSessions.length === 0" class="empty-state" data-aos="fade-up">
            <i class="bi bi-calendar-x"></i>
            <h4>No hay sesiones programadas</h4>
            <p>No tienes sesiones programadas próximamente. Te notificaremos cuando se agenden nuevas reuniones.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         Modal: inscripción con código de acceso
         ============================================================ -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="enrollOpen"
          class="enroll-overlay"
          :data-bs-theme="currentTheme"
          @click.self="closeEnrollModal"
          @keydown="onDialogKeydown"
        >
          <div
            ref="enrollDialog"
            class="enroll-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enroll-title"
            aria-describedby="enroll-desc"
          >
            <button
              type="button"
              class="enroll-close"
              aria-label="Cerrar"
              :disabled="enrollState === 'submitting'"
              @click="closeEnrollModal"
            >
              <i class="bi bi-x-lg"></i>
            </button>

            <!-- Paso 1: capturar código -->
            <template v-if="enrollState !== 'success'">
              <div class="enroll-icon"><i class="bi bi-ticket-perforated"></i></div>
              <h3 id="enroll-title" class="enroll-title">Inscribirme a un ensayo</h3>
              <p id="enroll-desc" class="enroll-desc">
                Ingresa el código de acceso del ensayo de aptitud al que deseas inscribirte.
              </p>

              <form class="enroll-form" novalidate @submit.prevent="submitEnrollment">
                <label for="enroll-code" class="enroll-label">Código de acceso</label>
                <div class="enroll-input-wrap" :class="{ 'is-invalid': enrollError, 'is-complete': isCodeComplete }">
                  <i class="bi bi-key"></i>
                  <input
                    id="enroll-code"
                    ref="enrollInput"
                    :value="enrollCode"
                    type="text"
                    class="enroll-input"
                    placeholder="aB3x9Z"
                    inputmode="text"
                    autocomplete="one-time-code"
                    autocapitalize="off"
                    autocorrect="off"
                    spellcheck="false"
                    :disabled="enrollState === 'submitting'"
                    :aria-invalid="!!enrollError"
                    :aria-describedby="enrollError ? 'enroll-error' : 'enroll-help'"
                    @input="onCodeInput"
                  >
                  <span class="enroll-count" :class="{ 'is-complete': isCodeComplete }" aria-hidden="true">
                    {{ enrollCode.length }}/{{ CODE_LENGTH }}
                  </span>
                </div>

                <p v-if="enrollError" id="enroll-error" class="enroll-feedback is-error" role="alert">
                  <i class="bi bi-exclamation-circle-fill"></i>{{ enrollError }}
                </p>
                <p v-else id="enroll-help" class="enroll-feedback">
                  <i class="bi bi-info-circle"></i>
                  <span>
                    Son <strong>6 caracteres</strong> (letras y números).
                    <strong>Distingue mayúsculas y minúsculas</strong>: escríbelo tal como lo recibiste.
                  </span>
                </p>

                <div class="enroll-actions">
                  <button
                    type="button"
                    class="btn-sena-ghost"
                    :disabled="enrollState === 'submitting'"
                    @click="closeEnrollModal"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="btn-sena"
                    :disabled="!isCodeComplete || enrollState === 'submitting'"
                  >
                    <span v-if="enrollState === 'submitting'" class="spinner-border spinner-border-sm"></span>
                    <i v-else class="bi bi-check2-circle"></i>
                    {{ enrollState === 'submitting' ? 'Verificando...' : 'Inscribirme' }}
                  </button>
                </div>
              </form>
            </template>

            <!-- Paso 2: confirmación -->
            <template v-else>
              <div class="enroll-icon is-success"><i class="bi bi-check-lg"></i></div>
              <h3 id="enroll-title" class="enroll-title">¡Inscripción registrada!</h3>
              <p id="enroll-desc" class="enroll-desc">Ya aparece en tus ensayos inscritos.</p>

              <div v-if="lastEnrolled" class="enroll-summary">
                <strong class="enroll-summary-title">{{ lastEnrolled.title }}</strong>
                <span v-if="lastEnrolled.programCode" class="enroll-summary-code">
                  <i class="bi bi-upc"></i>{{ lastEnrolled.programCode }}
                </span>
                <span class="enroll-summary-date">
                  <i class="bi bi-calendar3"></i>
                  Inicio: {{ formatDate(lastEnrolled.startDate) || 'Por definir' }}
                </span>
              </div>

              <div class="enroll-actions">
                <button type="button" class="btn-sena-ghost" @click="resetEnrollForm">
                  Inscribir otro código
                </button>
                <button ref="enrollSuccessBtn" type="button" class="btn-sena" @click="goToMyPrograms">
                  Ver mis ensayos
                  <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE, getAuthHeaders } from '@/config/api'
import { useTheme } from '@/composables/useTheme'

/* ============================================================
   Tipos
   ============================================================ */
type ProgramStatus = 'active' | 'completed' | 'pending'
type SessionType = 'video' | 'meeting'
type EnrollState = 'idle' | 'submitting' | 'success'

interface FeaturedProgram {
  id: number
  title: string
  description?: string
  type?: string
  year?: string | number
  fileName?: string
  fileUrl?: string
}

/** Ensayo tal como lo devuelve toClient() en controllers/ensayos.js */
interface EnsayoDTO {
  id: number
  codigo: string | null
  codigo_acceso: string | null
  descripcion: string | null
  ciclo: number | null
  anio: number | null
  inscripcionInicio: string | null
  inscripcionFin: string | null
  fechaInicioEnsayo: string | null
  fechaDetalle: string | null
  disponible: boolean | null
  generalidadesUrl: string | null
}

/** Respuesta de GET/POST /api/inscripciones/mis-ensayos */
interface MiEnsayoDTO {
  inscripcionId: number
  inscritoEn: string | null
  ensayo: EnsayoDTO
}

interface EnrolledProgram {
  id: number                // id del ensayo
  inscripcionId: number | null
  title: string
  programCode: string       // código del programa (p. ej. SENA-DIMENSIONAL-17-2026-CCM)
  accessCode: string        // código de acceso de 6 caracteres
  description: string
  icon: string
  startDate: string | null  // YYYY-MM-DD
  enrolledAt: string | null // ISO
  status: ProgramStatus
  docsUrl: string | null
  progress?: number
}

interface Session {
  id: number
  title: string
  description: string
  day: string
  month: string
  time: string
  host: string
  type: SessionType
  link: string | null
}

interface StatusMeta { label: string; icon: string }

/* ============================================================
   Configuración
   ============================================================ */
const PROGRAM_STATUS: Record<ProgramStatus, StatusMeta> = {
  active:    { label: 'En curso',    icon: 'bi bi-play-circle-fill' },
  completed: { label: 'Completado',  icon: 'bi bi-check-circle-fill' },
  pending:   { label: 'Por iniciar', icon: 'bi bi-hourglass-split' }
}

const SESSION_TYPE: Record<SessionType, StatusMeta> = {
  video:   { label: 'Videollamada', icon: 'bi bi-camera-video-fill' },
  meeting: { label: 'Reunión',      icon: 'bi bi-chat-dots-fill' }
}

const programStatus = (s: string) => PROGRAM_STATUS[s as ProgramStatus] ?? PROGRAM_STATUS.pending
const sessionType = (s: string) => SESSION_TYPE[s as SessionType] ?? SESSION_TYPE.meeting

const AUTOPLAY_MS = 6000
const THUMB_HEIGHT = 320
const SWIPE_THRESHOLD = 50

// Endpoints del portal (requieren sesión): ver routes/inscripciones.js
const MY_ENSAYOS_ENDPOINT = `${API_BASE}/api/inscripciones/mis-ensayos`

// codigo_acceso: 6 caracteres [A-Za-z0-9]. Distingue mayúsculas y minúsculas.
const CODE_LENGTH = 6
const CODE_PATTERN = /^[A-Za-z0-9]{6}$/

const ENSAYO_ICON = 'bi bi-clipboard2-check'

const MOCK_PROGRAMS: FeaturedProgram[] = [
  {
    id: 1,
    title: 'Análisis de Agua Potable',
    description: 'Programa de ensayos de aptitud para análisis fisicoquímicos y microbiológicos en agua potable.',
    type: 'Programa',
    year: '2026',
    fileName: 'programa-agua-2026.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 2,
    title: 'Calibración de Instrumentos',
    description: 'Programa de comparación interlaboratorio para calibración de equipos de medición.',
    type: 'Programa',
    year: '2026',
    fileName: 'programa-calibracion-2026.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 3,
    title: 'Análisis de Alimentos',
    description: 'Ensayos de aptitud para análisis microbiológicos y químicos en alimentos procesados.',
    type: 'Programa',
    year: '2026',
    fileName: 'programa-alimentos-2026.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
]

/* ============================================================
   Composables
   ============================================================ */
const router = useRouter()
const { currentTheme } = useTheme()

/* ============================================================
   Fechas
   ============================================================ */
const DATE_FMT = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

const pad2 = (n: number) => String(n).padStart(2, '0')
const todayYmd = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/**
 * Acepta 'YYYY-MM-DD' o ISO completo.
 * Las fechas sin hora se construyen en hora local: new Date('2026-01-15')
 * es medianoche UTC y en México se mostraría como 14 de enero.
 */
const formatDate = (value?: string | null): string => {
  if (!value) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value)
  return Number.isNaN(d.getTime()) ? '' : DATE_FMT.format(d)
}

/* ============================================================
   URLs de archivos
   ============================================================ */
const API_ORIGIN = (API_BASE || '').replace(/\/api\/?$/, '')
const uploadsOrigin = () => API_ORIGIN || window.location.origin

const resolveUploadUrl = (fileUrlOrPath: string): string => {
  if (!fileUrlOrPath) return ''
  const s = String(fileUrlOrPath).trim()
  if (!s) return ''
  if (s.startsWith('data:') || s.startsWith('blob:')) return s

  if (/^https?:\/\//i.test(s)) {
    try {
      const parsed = new URL(s)
      // Si apunta a /uploads/, servirlo desde el backend
      return parsed.pathname.includes('/uploads/') ? uploadsOrigin() + parsed.pathname : s
    } catch {
      return s
    }
  }

  if (s.startsWith('/')) return uploadsOrigin() + s
  return s
}

// Misma ruta pero servida por el backend (reintento si el frontend no la tiene)
const alternateUploadsUrl = (src: string): string | null => {
  const origin = window.location.origin
  if (!API_ORIGIN || API_ORIGIN === origin || !src.startsWith(origin)) return null
  return API_ORIGIN + src.slice(origin.length)
}

const openUrl = (url: string | null) => {
  if (url) window.open(url, '_blank', 'noopener')
}

/* ============================================================
   Miniaturas de PDF
   ============================================================ */
const thumbnails = ref<Record<number, string>>({})
const thumbnailFailed = ref<Record<number, boolean>>({})
const thumbnailsInFlight = new Set<number>()

type PdfJs = typeof import('pdfjs-dist')
let pdfjsPromise: Promise<PdfJs> | null = null

// pdf.js y su worker se cargan una sola vez
const loadPdfjs = (): Promise<PdfJs> => {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjsLib = await import('pdfjs-dist')
      try {
        // @ts-ignore - URL del worker resuelta por Vite
        const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
        pdfjsLib.GlobalWorkerOptions.workerSrc = worker
      } catch {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js'
      }
      return pdfjsLib
    })().catch((e) => {
      pdfjsPromise = null
      throw e
    })
  }
  return pdfjsPromise
}

const isPdfBuffer = (buf: ArrayBuffer): boolean => {
  const b = new Uint8Array(buf, 0, Math.min(4, buf.byteLength))
  return b.length === 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 // %PDF
}

const fetchPdfBuffer = async (url: string): Promise<ArrayBuffer | null> => {
  try {
    const resp = await fetch(url)
    if (!resp.ok) return null
    const buf = await resp.arrayBuffer()
    return isPdfBuffer(buf) ? buf : null
  } catch {
    return null
  }
}

// Intenta: URL directa → misma ruta en el backend → pdf.js cargando por URL
const openPdf = async (pdfjsLib: PdfJs, src: string) => {
  const candidates = [src, alternateUploadsUrl(src)].filter((u): u is string => !!u)
  for (const url of candidates) {
    const data = await fetchPdfBuffer(url)
    if (data) return pdfjsLib.getDocument({ data }).promise
  }
  return pdfjsLib.getDocument({ url: src }).promise
}

const generateThumbnail = async (id: number, fileUrl?: string) => {
  if (!fileUrl || thumbnails.value[id] || thumbnailFailed.value[id] || thumbnailsInFlight.has(id)) return
  const src = resolveUploadUrl(fileUrl)
  if (!src) return

  thumbnailsInFlight.add(id)
  try {
    const pdfjsLib = await loadPdfjs()
    const pdf = await openPdf(pdfjsLib, src)
    const page = await pdf.getPage(1)

    // Resolución acorde a la pantalla (nitidez en retina), con tope en 2x
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const scale = (THUMB_HEIGHT * dpr) / page.getViewport({ scale: 1 }).height
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D no disponible')
    canvas.width = Math.round(viewport.width)
    canvas.height = Math.round(viewport.height)

    await page.render({ canvasContext: ctx, viewport }).promise
    thumbnails.value[id] = canvas.toDataURL('image/jpeg', 0.85)
  } catch (err) {
    console.warn('No se pudo generar miniatura para', fileUrl, err)
    thumbnailFailed.value[id] = true
  } finally {
    thumbnailsInFlight.delete(id)
  }
}

// Primero la miniatura visible; el resto en segundo plano, una a la vez
const generateAllThumbnails = async () => {
  const current = currentFeatured.value
  const ordered = current ? [current, ...programs.value.filter(p => p.id !== current.id)] : programs.value
  for (const p of ordered) {
    await generateThumbnail(p.id, p.fileUrl)
  }
}

/* ============================================================
   Programas disponibles (carrusel)
   ============================================================ */
const programs = ref<FeaturedProgram[]>([])
const loadingPrograms = ref(true)
const featuredIndex = ref(0)
const carouselPaused = ref(false)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const currentFeatured = computed<FeaturedProgram | null>(() => programs.value[featuredIndex.value] ?? null)

const fetchPrograms = async () => {
  loadingPrograms.value = true
  try {
    const resp = await fetch(`${API_BASE}/api/programas`)
    if (!resp.ok) {
      console.warn('Error al cargar programas, usando datos de prueba')
      programs.value = MOCK_PROGRAMS.map(p => ({ ...p }))
      return
    }
    const body = await resp.json()
    const list: FeaturedProgram[] = Array.isArray(body) ? body : (body.data || [])
    programs.value = (list || []).map(p => ({
      ...p,
      fileUrl: p.fileUrl ? resolveUploadUrl(p.fileUrl) : p.fileUrl
    }))
  } catch (e) {
    console.error('Error fetching programas', e)
    programs.value = MOCK_PROGRAMS.map(p => ({ ...p }))
  } finally {
    featuredIndex.value = 0
    loadingPrograms.value = false
    // No bloquea la vista: las miniaturas llegan cuando estén listas
    void generateAllThumbnails()
  }
}

const setFeatured = (i: number) => {
  if (i < 0 || i >= programs.value.length) return
  featuredIndex.value = i
  const program = programs.value[i]
  if (program) void generateThumbnail(program.id, program.fileUrl)
}

const nextFeatured = () => {
  if (!programs.value.length) return
  setFeatured((featuredIndex.value + 1) % programs.value.length)
  restartAutoplay()
}

const prevFeatured = () => {
  if (!programs.value.length) return
  setFeatured((featuredIndex.value - 1 + programs.value.length) % programs.value.length)
  restartAutoplay()
}

const goToFeatured = (i: number) => {
  setFeatured(i)
  restartAutoplay()
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const startAutoplay = () => {
  stopAutoplay()
  if (prefersReducedMotion() || programs.value.length < 2) return
  autoplayTimer = setInterval(() => {
    // Pausa: puntero/foco en el carrusel, modal abierto o pestaña oculta
    if (carouselPaused.value || enrollOpen.value || document.hidden) return
    setFeatured((featuredIndex.value + 1) % programs.value.length)
  }, AUTOPLAY_MS)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// La navegación manual reinicia el conteo para no saltar justo después de un clic
const restartAutoplay = () => { if (autoplayTimer) startAutoplay() }

// Swipe en pantallas táctiles
let touchStartX = 0
const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0]?.clientX ?? 0 }
const onTouchEnd = (e: TouchEvent) => {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX
  if (Math.abs(dx) < SWIPE_THRESHOLD || programs.value.length < 2) return
  if (dx < 0) nextFeatured()
  else prevFeatured()
}

/* ============================================================
   Mis ensayos (backend)
   ============================================================ */
const enrolledPrograms = ref<EnrolledProgram[]>([])
const loadingEnrollments = ref(true)
const enrollmentsError = ref('')

const buildDescription = (e: EnsayoDTO): string => {
  if (e.fechaDetalle) return e.fechaDetalle
  const parts = [e.ciclo ? `Ciclo ${e.ciclo}` : '', e.anio ? `Año ${e.anio}` : ''].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Ensayo de aptitud'
}

const deriveStatus = (e: EnsayoDTO): ProgramStatus => {
  if (!e.fechaInicioEnsayo) return 'pending'
  return e.fechaInicioEnsayo > todayYmd() ? 'pending' : 'active'
}

// Único punto donde la respuesta del backend se convierte en tarjeta
const toEnrolledProgram = (item: MiEnsayoDTO): EnrolledProgram => {
  const e = item.ensayo
  return {
    id: e.id,
    inscripcionId: item.inscripcionId ?? null,
    title: e.descripcion || e.codigo || 'Ensayo de aptitud',
    programCode: e.codigo || '',
    accessCode: e.codigo_acceso || '',
    description: buildDescription(e),
    icon: ENSAYO_ICON,
    startDate: e.fechaInicioEnsayo,
    enrolledAt: item.inscritoEn,
    status: deriveStatus(e),
    docsUrl: e.generalidadesUrl ? resolveUploadUrl(e.generalidadesUrl) : null
  }
}

// Agrega o reemplaza (por id de ensayo) y lo deja primero
const upsertEnrolled = (program: EnrolledProgram) => {
  enrolledPrograms.value = [program, ...enrolledPrograms.value.filter(p => p.id !== program.id)]
}

const sessionErrorMessage = 'Tu sesión expiró. Vuelve a iniciar sesión.'

const fetchMyEnsayos = async () => {
  loadingEnrollments.value = true
  enrollmentsError.value = ''
  try {
    const resp = await fetch(MY_ENSAYOS_ENDPOINT, { headers: { ...getAuthHeaders() } })
    const json = await resp.json().catch(() => null)

    if (!resp.ok || !json?.ok) {
      enrollmentsError.value = resp.status === 401 || resp.status === 403
        ? sessionErrorMessage
        : (json?.message || 'Inténtalo de nuevo en unos minutos.')
      return
    }

    const list: MiEnsayoDTO[] = Array.isArray(json.data) ? json.data : []
    enrolledPrograms.value = list.filter(i => i?.ensayo).map(toEnrolledProgram)
  } catch (err) {
    console.error('fetchMyEnsayos error', err)
    enrollmentsError.value = 'No pudimos conectar con el servidor. Revisa tu conexión.'
  } finally {
    loadingEnrollments.value = false
  }
}

/* ============================================================
   Sesiones (demo / local)
   ============================================================ */
const upcomingSessions = ref<Session[]>([
  {
    id: 1,
    title: 'Revisión de Resultados - Agua Potable',
    description: 'Sesión de retroalimentación sobre los resultados del primer trimestre.',
    day: '15',
    month: 'Abr',
    time: '10:00 - 11:30 AM',
    host: 'Ing. María García',
    type: 'video',
    link: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 2,
    title: 'Asesoría Técnica - Calibración',
    description: 'Reunión para resolver dudas sobre el protocolo de calibración.',
    day: '22',
    month: 'Abr',
    time: '15:00 - 16:00 PM',
    host: 'Dr. Carlos Mendoza',
    type: 'meeting',
    link: null
  },
  {
    id: 3,
    title: 'Capacitación - Nuevas Normativas',
    description: 'Sesión informativa sobre actualizaciones en ISO/IEC 17043:2023.',
    day: '05',
    month: 'May',
    time: '11:00 - 12:30 PM',
    host: 'Lic. Ana Torres',
    type: 'video',
    link: 'https://meet.google.com/xyz-uvwx-yza'
  }
])

/* ============================================================
   Indicadores
   ============================================================ */
const activeCount = computed(() => enrolledPrograms.value.filter(p => p.status === 'active').length)
const upcomingCount = computed(() => enrolledPrograms.value.filter(p => p.status === 'pending').length)

// Ensayo inscrito con fecha de inicio más próxima (hoy o después)
const nextEnsayo = computed(() => {
  const today = todayYmd()
  return enrolledPrograms.value
    .filter(p => p.startDate && p.startDate >= today)
    .sort((a, b) => (a.startDate as string).localeCompare(b.startDate as string))[0] ?? null
})

const nextSession = computed(() => upcomingSessions.value[0] ?? null)

const kpis = computed(() => [
  {
    key: 'enrolled',
    icon: 'bi bi-clipboard2-pulse',
    label: 'Ensayos inscritos',
    value: String(enrolledPrograms.value.length),
    hint: enrolledPrograms.value.length
      ? `${activeCount.value} en curso · ${upcomingCount.value} por iniciar`
      : 'Inscríbete con tu código',
    dependsOnEnrollments: true
  },
  {
    key: 'next-ensayo',
    icon: 'bi bi-calendar-event',
    label: 'Próximo ensayo',
    value: nextEnsayo.value ? formatDate(nextEnsayo.value.startDate) : 'Sin fecha próxima',
    hint: nextEnsayo.value?.title ?? '',
    dependsOnEnrollments: true
  },
  {
    key: 'next-session',
    icon: 'bi bi-camera-video',
    label: 'Próxima sesión',
    value: nextSession.value ? `${nextSession.value.day} ${nextSession.value.month}` : 'Sin sesiones',
    hint: nextSession.value?.title ?? 'Te avisaremos cuando se agende una',
    dependsOnEnrollments: false
  }
])

/* ============================================================
   Acciones
   ============================================================ */
const downloadFeaturedPdf = () => openUrl(currentFeatured.value?.fileUrl ?? null)

const openProgramDetail = (programId: number) => {
  router.push(`/cliente/programa/${programId}`)
}

const joinSession = (link: string | null) => openUrl(link)

/* ============================================================
   Inscripción con código de acceso
   ============================================================ */
const enrollOpen = ref(false)
const enrollCode = ref('')
const enrollError = ref('')
const enrollState = ref<EnrollState>('idle')
const lastEnrolled = ref<EnrolledProgram | null>(null)
const highlightedProgramId = ref<number | null>(null)

const enrollDialog = ref<HTMLElement | null>(null)
const enrollInput = ref<HTMLInputElement | null>(null)
const enrollSuccessBtn = ref<HTMLButtonElement | null>(null)

let lastFocusedElement: HTMLElement | null = null
let previousBodyOverflow = ''
let highlightTimer: ReturnType<typeof setTimeout> | null = null

const isCodeComplete = computed(() => CODE_PATTERN.test(enrollCode.value))

/**
 * Deja solo letras y números SIN cambiar mayúsculas/minúsculas
 * (el código las distingue). Quita espacios y guiones al pegar:
 * " aB3 x9Z " → "aB3x9Z"
 */
const normalizeCode = (raw: string): string =>
  raw.replace(/[^A-Za-z0-9]/g, '').slice(0, CODE_LENGTH)

const onCodeInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  const clean = normalizeCode(el.value)
  // Solo se reescribe si cambió, para no mover el cursor al escribir normal
  if (el.value !== clean) el.value = clean
  enrollCode.value = clean
  enrollError.value = ''
}

const focusEnrollInput = () => nextTick(() => enrollInput.value?.focus())

const resetEnrollForm = () => {
  enrollCode.value = ''
  enrollError.value = ''
  enrollState.value = 'idle'
  lastEnrolled.value = null
  focusEnrollInput()
}

const openEnrollModal = () => {
  lastFocusedElement = document.activeElement as HTMLElement | null
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  enrollOpen.value = true
  resetEnrollForm()
}

const closeEnrollModal = () => {
  if (enrollState.value === 'submitting') return
  enrollOpen.value = false
  document.body.style.overflow = previousBodyOverflow
  nextTick(() => lastFocusedElement?.focus?.())
}

const enrollErrorMessage = (status: number, json: any): string => {
  if (status === 401 || status === 403) return sessionErrorMessage
  if (typeof json?.message === 'string' && json.message.trim()) return json.message
  switch (status) {
    case 400: return 'El código debe tener 6 caracteres: letras y números.'
    case 404: return 'No encontramos un ensayo con ese código. Revisa mayúsculas y minúsculas.'
    case 409: return 'Ya estás inscrito en este ensayo.'
    case 410: return 'Las inscripciones para este ensayo ya cerraron.'
    default:  return 'No pudimos completar la inscripción. Inténtalo de nuevo en unos minutos.'
  }
}

const highlightProgram = (id: number) => {
  highlightedProgramId.value = id
  if (highlightTimer) clearTimeout(highlightTimer)
  highlightTimer = setTimeout(() => { highlightedProgramId.value = null }, 4000)
}

const submitEnrollment = async () => {
  if (enrollState.value === 'submitting') return

  const code = normalizeCode(enrollCode.value)
  enrollCode.value = code

  if (!CODE_PATTERN.test(code)) {
    enrollError.value = `El código debe tener ${CODE_LENGTH} caracteres: letras y números.`
    focusEnrollInput()
    return
  }
  // Comparación exacta: 'aB3x9Z' y 'AB3X9Z' son códigos distintos
  if (enrolledPrograms.value.some(p => p.accessCode === code)) {
    enrollError.value = 'Ya estás inscrito en este ensayo.'
    focusEnrollInput()
    return
  }

  enrollState.value = 'submitting'
  enrollError.value = ''

  try {
    const resp = await fetch(MY_ENSAYOS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ codigo: code })
    })
    const json = await resp.json().catch(() => ({}))

    if (!resp.ok || json?.ok === false) {
      // Ya estaba inscrito: si el backend manda el ensayo, asegurar que se vea en la lista
      if (resp.status === 409 && json?.data?.ensayo) {
        const existing = toEnrolledProgram(json.data as MiEnsayoDTO)
        upsertEnrolled(existing)
        highlightProgram(existing.id)
      }
      enrollError.value = enrollErrorMessage(resp.status, json)
      enrollState.value = 'idle'
      focusEnrollInput()
      return
    }

    const program = toEnrolledProgram(json.data as MiEnsayoDTO)
    upsertEnrolled(program)
    lastEnrolled.value = program
    enrollState.value = 'success'
    highlightProgram(program.id)

    nextTick(() => enrollSuccessBtn.value?.focus())
  } catch (err) {
    console.error('Error en inscripción', err)
    enrollError.value = 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
    enrollState.value = 'idle'
    focusEnrollInput()
  }
}

const goToMyPrograms = () => {
  closeEnrollModal()
  nextTick(() => {
    document.getElementById('mis-programas')?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start'
    })
  })
}

// Escape cierra; Tab no sale del modal
const onDialogKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeEnrollModal()
    return
  }
  if (e.key !== 'Tab' || !enrollDialog.value) return

  const focusables = Array.from(
    enrollDialog.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )
  )
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (!first || !last) return

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

/* ============================================================
   Ciclo de vida
   ============================================================ */
onMounted(async () => {
  // En paralelo: los ensayos del usuario no esperan al catálogo
  void fetchMyEnsayos()
  await fetchPrograms()
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
  if (highlightTimer) clearTimeout(highlightTimer)
  if (enrollOpen.value) document.body.style.overflow = previousBodyOverflow
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ============================================================
   TOKENS
   Se aplican a la vista y al modal (que se teletransporta a <body>).
   ============================================================ */
.cliente-dashboard,
.enroll-overlay {
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-text: #1c2b14;
  --sena-muted: #5a6a52;
  --sena-border: rgba(93, 138, 47, 0.14);

  --page-bg: #fafaf8;
  --surface: #ffffff;
  --surface-alt: #f6f9f2;

  --tone-ok: #1e7a3c;      --tone-ok-bg: rgba(25, 135, 84, 0.12);
  --tone-warn: #9a5b00;    --tone-warn-bg: rgba(255, 170, 0, 0.16);
  --tone-danger: #b42318;  --tone-danger-bg: rgba(220, 53, 69, 0.11);
  --tone-info: #0b5ed7;    --tone-info-bg: rgba(13, 110, 253, 0.1);
  --tone-neutral: #55616a; --tone-neutral-bg: rgba(108, 117, 125, 0.14);

  --radius-card: 20px;
  --radius-md: 14px;
  --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.10);
  --shadow-green: 0 8px 28px rgba(93, 138, 47, 0.22);
  --transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, 'SFMono-Regular', 'Cascadia Mono', Menlo, Consolas, monospace;
}

.cliente-dashboard[data-bs-theme="dark"],
.enroll-overlay[data-bs-theme="dark"] {
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122, 171, 61, 0.16);
  --sena-green-pale: rgba(93, 138, 47, 0.14);

  --page-bg: #0c0f0a;
  --surface: #131a0e;
  --surface-alt: #0f150b;

  --tone-ok: #5fd08a;
  --tone-warn: #f0b429;
  --tone-danger: #ff7b72;
  --tone-info: #6ea8fe;
  --tone-neutral: #a3adb5;

  --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.cliente-dashboard {
  font-family: var(--font-body);
  background: var(--page-bg);
  min-height: 100vh;
  color: var(--sena-text);
}

/* ============================================================
   BOTONES
   ============================================================ */
.btn-sena,
.btn-sena-outline,
.btn-sena-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  border-radius: 50px;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.btn-sena {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  border: none;
  box-shadow: var(--shadow-green);
}
.btn-sena:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(93, 138, 47, 0.32);
}

.btn-sena-outline {
  background: transparent;
  color: var(--sena-green);
  border: 1.5px solid var(--sena-green);
}
[data-bs-theme="dark"] .btn-sena-outline,
.enroll-overlay[data-bs-theme="dark"] .btn-sena-outline {
  color: var(--sena-green-light);
  border-color: var(--sena-green-light);
}
.btn-sena-outline:hover:not(:disabled) {
  background: var(--sena-green);
  border-color: var(--sena-green);
  color: #ffffff;
}

.btn-sena-ghost {
  background: transparent;
  color: var(--sena-muted);
  border: 1.5px solid transparent;
}
.btn-sena-ghost:hover:not(:disabled) {
  background: var(--sena-green-pale);
  color: var(--sena-text);
}

.btn-sena:disabled,
.btn-sena-outline:disabled,
.btn-sena-ghost:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-sena:focus-visible,
.btn-sena-outline:focus-visible,
.btn-sena-ghost:focus-visible {
  outline: 3px solid rgba(122, 171, 61, 0.45);
  outline-offset: 2px;
}

.btn-sm { padding: 0.45rem 1.1rem; font-size: 0.8rem; }
.btn-icon { padding: 0.6rem; width: 42px; height: 42px; font-size: 1.05rem; }

/* ============================================================
   PILLS DE ESTADO
   ============================================================ */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}
.status-active    { background: var(--tone-ok-bg);      color: var(--tone-ok); }
.status-pending   { background: var(--tone-warn-bg);    color: var(--tone-warn); }
.status-completed,
.status-meeting   { background: var(--tone-neutral-bg); color: var(--tone-neutral); }
.status-video     { background: var(--tone-info-bg);    color: var(--tone-info); }

/* ============================================================
   COMPARTIDOS
   ============================================================ */
.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  margin-bottom: 0.4rem;
}

.dash-section {
  padding: 2.75rem 0;
}
.dash-section-last {
  padding-bottom: 4rem;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--sena-text);
  margin: 0;
}
.section-subtitle {
  color: var(--sena-muted);
  font-size: 0.9rem;
  margin: 0.35rem 0 0;
}

.progress-track {
  height: 6px;
  background: var(--sena-green-pale);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 3px;
  transition: width 0.6s ease;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  border-radius: var(--radius-md);
  background: var(--tone-danger-bg);
  border: 1px solid rgba(220, 53, 69, 0.25);
  color: var(--tone-danger);
}
.error-banner > i { font-size: 1.35rem; }
.error-banner-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 200px;
}
.error-banner-text span { color: var(--sena-text); font-size: 0.88rem; }

/* ============================================================
   ENCABEZADO DEL PANEL + KPIs
   ============================================================ */
.dash-header {
  padding: 2.5rem 0 1rem;
  background: linear-gradient(180deg, var(--sena-green-pale) 0%, transparent 100%);
}

.dash-header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
}

.dash-title {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3vw, 2.5rem);
  font-weight: 700;
  margin: 0;
  color: var(--sena-text);
}
.dash-subtitle {
  color: var(--sena-muted);
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.kpi-card {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 1.15rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  min-width: 0;
}

.kpi-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  background: var(--sena-green-pale);
  color: var(--sena-green);
}

.kpi-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.kpi-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sena-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.kpi-value {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--sena-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kpi-hint {
  font-size: 0.78rem;
  color: var(--sena-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============================================================
   MIS ENSAYOS
   ============================================================ */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

.program-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-radius: var(--radius-card);
  padding: 1.5rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  cursor: pointer;
}
.program-card:not(.is-skeleton):hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(93, 138, 47, 0.12);
  border-color: var(--sena-green-light);
}
.program-card:focus-visible {
  outline: 3px solid rgba(122, 171, 61, 0.45);
  outline-offset: 3px;
}
.program-card.is-skeleton {
  cursor: default;
  gap: 0.25rem;
}

.program-card.is-new {
  animation: new-glow 1.6s ease-in-out 2;
  border-color: var(--sena-green-light);
}
@keyframes new-glow {
  0%, 100% { box-shadow: var(--shadow-sm); }
  50%      { box-shadow: 0 0 0 6px rgba(122, 171, 61, 0.25); }
}

.program-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.program-icon-wrap {
  width: 48px;
  height: 48px;
  background: var(--sena-green-pale);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--sena-green);
}

.program-title {
  font-size: 1.08rem;
  font-weight: 600;
  margin: 0 0 0.35rem;
  color: var(--sena-text);
}

.program-code {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--sena-muted);
  margin: 0 0 0.5rem;
  word-break: break-all;
}

.program-description {
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--sena-muted);
  margin: 0 0 1.1rem;
}

.program-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 1.1rem;
  background: var(--surface-alt);
  border-radius: 10px;
}
.date-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.date-label {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--sena-muted);
}
.date-value {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 500;
}
.date-value i { color: var(--sena-green); }

.program-progress {
  margin-bottom: 1.25rem;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--sena-muted);
  margin-bottom: 0.4rem;
}
.progress-info strong { color: var(--sena-text); }

.program-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}
.program-actions > .btn-sena-outline { flex: 1; }

/* Tarjeta "+" */
.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 280px;
  padding: 2rem 1.5rem;
  text-align: center;
  background: transparent;
  border: 2px dashed rgba(93, 138, 47, 0.35);
  border-radius: var(--radius-card);
  color: var(--sena-text);
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
}
.add-card:hover,
.add-card:focus-visible {
  border-style: solid;
  border-color: var(--sena-green-light);
  background: var(--sena-green-pale);
  outline: none;
}
.add-card:focus-visible {
  box-shadow: 0 0 0 4px rgba(122, 171, 61, 0.3);
}
/* Sin ensayos: la tarjeta ocupa todo el ancho como estado vacío */
.add-card.is-empty {
  grid-column: 1 / -1;
  min-height: 240px;
}

.add-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #ffffff;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  box-shadow: var(--shadow-green);
  transition: transform 0.25s ease;
}
.add-card:hover .add-icon { transform: scale(1.08) rotate(90deg); }

.add-title {
  font-size: 1.02rem;
  font-weight: 700;
}
.add-text {
  max-width: 280px;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--sena-muted);
}

/* ============================================================
   CARRUSEL DE PROGRAMAS DISPONIBLES
   ============================================================ */
.featured-card {
  position: relative;
  background: var(--surface);
  border-radius: 24px;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-md);
  padding: 2rem 2rem 1.25rem;
  overflow: hidden;
}

.featured-slide {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
  min-height: 340px;
}

.featured-content { min-width: 0; }

.featured-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  color: var(--sena-text);
  margin: 0.25rem 0 0.75rem;
}
.featured-description {
  color: var(--sena-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
}
.featured-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.82rem;
  color: var(--sena-muted);
}
.featured-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.featured-meta i { color: var(--sena-green); }

.featured-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.featured-preview {
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--sena-green-pale), rgba(122, 171, 61, 0.04));
  border: 1px solid var(--sena-border);
  overflow: hidden;
}
.preview-thumb {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
}

.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
  color: var(--sena-green);
}
.pdf-preview i { font-size: 3.5rem; }
.pdf-preview span { font-size: 0.9rem; font-weight: 500; }
.pdf-preview small { font-size: 0.78rem; color: var(--sena-muted); }
.pdf-preview.loading i { animation: pulse 1.5s ease-in-out infinite; }
.pdf-preview.muted { color: var(--sena-muted); }

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(0.95); }
}

.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  position: relative;
}
.carousel-control {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  color: var(--sena-green);
  cursor: pointer;
  transition: var(--transition);
}
.carousel-control:hover {
  background: var(--sena-green);
  border-color: var(--sena-green);
  color: #ffffff;
}
.carousel-control:focus-visible {
  outline: 3px solid rgba(122, 171, 61, 0.45);
  outline-offset: 2px;
}

.carousel-indicators {
  display: flex;
  gap: 8px;
}
.carousel-indicators button {
  width: 10px;
  height: 10px;
  padding: 0;
  border-radius: 999px;
  background: rgba(93, 138, 47, 0.25);
  border: none;
  cursor: pointer;
  transition: var(--transition);
}
.carousel-indicators button.active {
  width: 28px;
  background: var(--sena-green);
}

.carousel-counter {
  position: absolute;
  right: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--sena-muted);
  font-variant-numeric: tabular-nums;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.slide-fade-enter-from { opacity: 0; transform: translateX(16px); }
.slide-fade-leave-to   { opacity: 0; transform: translateX(-16px); }

/* ============================================================
   SKELETONS
   ============================================================ */
.skeleton {
  display: block;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(93,138,47,0.08) 25%, rgba(93,138,47,0.16) 37%, rgba(93,138,47,0.08) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
.skeleton-line  { height: 12px; margin-bottom: 0.75rem; }
.skeleton-title { height: 30px; width: 70%; margin: 0.5rem 0 1rem; }
.skeleton-btn   { height: 42px; width: 200px; border-radius: 50px; margin-top: 1.25rem; }
.skeleton-page  { width: 55%; height: 100%; }
.skeleton-icon  { width: 48px; height: 48px; border-radius: 14px; }
.skeleton-pill  { width: 84px; height: 22px; border-radius: 999px; }
.skeleton-block { height: 58px; border-radius: 10px; margin: 0.5rem 0 0.25rem; }
.skeleton-kpi   { display: inline-block; width: 90px; height: 1.2rem; vertical-align: middle; }
@keyframes shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* ============================================================
   SESIONES
   ============================================================ */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-card {
  display: flex;
  gap: 1.25rem;
  background: var(--surface);
  border-radius: var(--radius-card);
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.session-card:hover { box-shadow: var(--shadow-md); }
.session-card.is-next {
  border-color: var(--sena-green-light);
  box-shadow: 0 0 0 1px var(--sena-green-light), var(--shadow-sm);
}

.session-date {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--sena-green-pale);
}
.session-card.is-next .session-date {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
}
.session-day   { font-size: 1.5rem; font-weight: 700; color: var(--sena-green); line-height: 1; }
.session-month { font-size: 0.7rem; color: var(--sena-muted); text-transform: uppercase; letter-spacing: 1px; }
.session-card.is-next .session-day,
.session-card.is-next .session-month { color: #ffffff; }

.session-content { flex: 1; min-width: 0; }

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}
.session-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.next-badge {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  vertical-align: middle;
  background: var(--sena-green-pale);
  color: var(--sena-green);
}

.session-description {
  font-size: 0.84rem;
  color: var(--sena-muted);
  margin-bottom: 0.7rem;
}
.session-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.25rem;
  font-size: 0.8rem;
  color: var(--sena-muted);
  margin-bottom: 0.9rem;
}
.session-meta span { display: inline-flex; align-items: center; gap: 0.35rem; }
.session-meta i { color: var(--sena-green); }

.session-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--surface);
  border: 2px dashed var(--sena-border);
  border-radius: var(--radius-card);
}
.empty-state i { font-size: 2.8rem; color: var(--sena-muted); display: block; margin-bottom: 0.75rem; }
.empty-state h4 { font-weight: 600; margin-bottom: 0.4rem; }
.empty-state p { color: var(--sena-muted); font-size: 0.9rem; margin: 0 auto; max-width: 440px; }

/* ============================================================
   MODAL DE INSCRIPCIÓN
   ============================================================ */
.enroll-overlay {
  position: fixed;
  inset: 0;
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(8, 14, 5, 0.55);
  backdrop-filter: blur(4px);
  font-family: var(--font-body);
  color: var(--sena-text);
}

.enroll-dialog {
  position: relative;
  width: min(460px, 100%);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 2rem;
  border-radius: 22px;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.enroll-close {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--sena-muted);
  cursor: pointer;
  transition: var(--transition);
}
.enroll-close:hover:not(:disabled) {
  background: var(--sena-green-pale);
  color: var(--sena-text);
}
.enroll-close:focus-visible {
  outline: 3px solid rgba(122, 171, 61, 0.45);
}

.enroll-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--sena-green);
  background: var(--sena-green-pale);
}
.enroll-icon.is-success {
  border-radius: 50%;
  color: #ffffff;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  box-shadow: var(--shadow-green);
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes pop {
  from { transform: scale(0.6); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.enroll-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
}
.enroll-desc {
  color: var(--sena-muted);
  font-size: 0.92rem;
  line-height: 1.55;
  margin: 0 0 1.5rem;
}

.enroll-form { text-align: left; }

.enroll-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.45rem;
}

.enroll-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0 1rem;
  border: 2px solid var(--sena-border);
  border-radius: 14px;
  background: var(--surface-alt);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.enroll-input-wrap:focus-within {
  border-color: var(--sena-green-light);
  box-shadow: 0 0 0 4px rgba(122, 171, 61, 0.2);
}
.enroll-input-wrap.is-complete {
  border-color: var(--sena-green);
}
.enroll-input-wrap.is-invalid {
  border-color: var(--tone-danger);
  box-shadow: 0 0 0 4px var(--tone-danger-bg);
}
.enroll-input-wrap > i {
  font-size: 1.15rem;
  color: var(--sena-muted);
}

/*
 * Sin text-transform: el código distingue mayúsculas y minúsculas,
 * así que se muestra EXACTAMENTE lo que se enviará.
 * Monoespaciada y con espaciado para distinguir 0/O, 1/l/I.
 */
.enroll-input {
  flex: 1;
  min-width: 0;
  padding: 0.9rem 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--sena-text);
  font-family: var(--font-mono);
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: 0.4em;
  text-align: center;
}
.enroll-input::placeholder {
  color: var(--sena-muted);
  opacity: 0.4;
  font-weight: 400;
}

.enroll-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sena-muted);
  font-variant-numeric: tabular-nums;
  min-width: 2.2rem;
  text-align: right;
}
.enroll-count.is-complete {
  color: var(--sena-green);
}

.enroll-feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  margin: 0.55rem 0 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--sena-muted);
}
.enroll-feedback i { margin-top: 0.1rem; }
.enroll-feedback strong { color: var(--sena-text); font-weight: 600; }
.enroll-feedback.is-error {
  color: var(--tone-danger);
  font-weight: 500;
}

.enroll-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1rem;
  margin: 0 0 0.5rem;
  border-radius: 14px;
  background: var(--surface-alt);
  border: 1px solid var(--sena-border);
}
.enroll-summary-title {
  font-size: 1rem;
  color: var(--sena-text);
}
.enroll-summary-code,
.enroll-summary-date {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--sena-muted);
}
.enroll-summary-code { font-family: var(--font-mono); }

.enroll-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}
.modal-fade-enter-active .enroll-dialog,
.modal-fade-leave-active .enroll-dialog {
  transition: transform 0.25s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.22s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .enroll-dialog,
.modal-fade-leave-to .enroll-dialog {
  transform: translateY(12px) scale(0.97);
  opacity: 0;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .featured-slide {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    min-height: 0;
  }
  .featured-preview {
    order: -1;
    height: 260px;
  }
}

@media (max-width: 768px) {
  .dash-header { padding-top: 1.75rem; }
  .dash-header-row .btn-sena { width: 100%; }
  .dash-section { padding: 2rem 0; }
  .section-title { font-size: 1.45rem; }
  .featured-card { padding: 1.25rem 1.25rem 1rem; }
  .featured-actions > * { flex: 1 1 auto; }
  .carousel-counter { display: none; }

  .session-card { padding: 1.1rem; gap: 1rem; }
  .session-date { width: 52px; height: 52px; }
  .session-day { font-size: 1.25rem; }
  .session-header { flex-direction: column; }
}

@media (max-width: 576px) {
  .kpi-grid { grid-template-columns: 1fr; gap: 0.75rem; }

  .programs-grid { grid-template-columns: 1fr; }
  .add-card { min-height: 200px; }

  .enroll-dialog { padding: 1.75rem 1.25rem 1.25rem; }
  .enroll-input { font-size: 1.25rem; letter-spacing: 0.3em; }
  .enroll-actions { flex-direction: column-reverse; }
  .enroll-actions > * { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton,
  .pdf-preview.loading i,
  .program-card.is-new,
  .enroll-icon.is-success { animation: none; }
  .slide-fade-enter-active,
  .slide-fade-leave-active,
  .modal-fade-enter-active .enroll-dialog,
  .modal-fade-leave-active .enroll-dialog { transition: opacity 0.15s ease; }
  .slide-fade-enter-from,
  .slide-fade-leave-to,
  .modal-fade-enter-from .enroll-dialog,
  .modal-fade-leave-to .enroll-dialog { transform: none; }
  .program-card:hover,
  .btn-sena:hover:not(:disabled) { transform: none; }
  .add-card:hover .add-icon { transform: none; }
}
</style>
