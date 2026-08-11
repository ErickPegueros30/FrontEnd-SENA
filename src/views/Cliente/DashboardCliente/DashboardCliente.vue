<template>
  <div :data-bs-theme="currentTheme" class="cliente-dashboard">


    <!-- Documento Destacado (PDF Promocional) -->
    <section class="featured-document">
      <div class="container">
        <div class="featured-card" data-aos="fade-up">
          <div class="row align-items-center">
            <div class="col-lg-7">
              <div class="featured-content">
                <span class="section-eyebrow">Nuevo</span>
                <h2 class="featured-title">Programa Nacional SENA 2026</h2>
                <p class="featured-description">
                  Descarga el programa completo con todas las actividades, fechas y lineamientos para este año.
                  Mantente actualizado con las últimas novedades en ensayos de aptitud.
                </p>
                <div class="featured-meta">
                  <span><i class="bi bi-calendar-check"></i> Actualizado: Enero 2026</span>
                  <span><i class="bi bi-file-earmark-pdf"></i> PDF · 2.4 MB</span>
                  <span><i class="bi bi-book"></i> 24 páginas</span>
                </div>
                <button class="download-btn" @click="downloadFeaturedPdf">
                  <i class="bi bi-download"></i>
                  Descargar programa
                  <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="featured-preview">
                <div class="pdf-preview">
                  <i class="bi bi-file-earmark-pdf-fill"></i>
                  <span>Vista previa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Programas Inscritos -->
    <section class="programs-section">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-eyebrow">Mis Programas</span>
          <h2 class="section-title">Programas Inscritos</h2>
          <div class="title-underline"></div>
          <p class="section-subtitle">Accede a la documentación detallada de cada programa</p>
        </div>

        <div class="programs-grid">
          <div
            v-for="(program, idx) in enrolledPrograms"
            :key="program.id"
            class="program-card"
            data-aos="fade-up"
            :data-aos-delay="idx * 100"
            @click="openProgramDetail(program.id)"
          >
            <div class="program-status" :class="program.status">
              {{ program.status === 'active' ? 'Activo' : program.status === 'completed' ? 'Completado' : 'Pendiente' }}
            </div>
            <div class="program-icon-wrap">
              <i :class="program.icon"></i>
            </div>
            <h4 class="program-title">{{ program.title }}</h4>
            <p class="program-description">{{ program.description }}</p>
            <div class="program-dates">
              <div class="date-item">
                <i class="bi bi-calendar3"></i>
                <span>Inicio: {{ program.startDate }}</span>
              </div>
              <div class="date-item">
                <i class="bi bi-calendar-check"></i>
                <span>Fin: {{ program.endDate }}</span>
              </div>
            </div>
            <div class="program-progress">
              <div class="progress-info">
                <span>Progreso</span>
                <span>{{ program.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: program.progress + '%' }"></div>
              </div>
            </div>
            <button class="view-program-btn">
              Ver documentos
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Pagos y Facturación -->
    <section class="payments-section">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-eyebrow">Finanzas</span>
          <h2 class="section-title">Pagos y Facturación</h2>
          <div class="title-underline"></div>
          <p class="section-subtitle">Consulta el estado de tus pagos y descarga tus facturas</p>
        </div>

        <div class="payments-grid">
          <div class="payments-card" data-aos="fade-right">
            <div class="card-header-section">
              <i class="bi bi-wallet2"></i>
              <h3>Estado de Pagos</h3>
            </div>
            <div class="payments-list">
              <div v-for="(payment, idx) in payments" :key="idx" class="payment-item">
                <div class="payment-info">
                  <span class="payment-concept">{{ payment.concept }}</span>
                  <span class="payment-date">{{ payment.date }}</span>
                </div>
                <div class="payment-amount">${{ payment.amount.toLocaleString() }} MXN</div>
                <div class="payment-status" :class="payment.status">
                  <i :class="payment.status === 'paid' ? 'bi bi-check-circle-fill' : payment.status === 'pending' ? 'bi bi-clock-fill' : 'bi bi-exclamation-circle-fill'"></i>
                  {{ payment.status === 'paid' ? 'Pagado' : payment.status === 'pending' ? 'Pendiente' : 'Vencido' }}
                </div>
                <button v-if="payment.invoiceUrl" class="invoice-btn" @click="downloadInvoice(payment.invoiceUrl)">
                  <i class="bi bi-file-earmark-text"></i>
                  Factura
                </button>
              </div>
            </div>
            <div class="total-section">
              <span>Total pendiente:</span>
              <strong>${{ totalPending.toLocaleString() }} MXN</strong>
            </div>
          </div>

          <div class="summary-card" data-aos="fade-left">
            <div class="card-header-section">
              <i class="bi bi-graph-up"></i>
              <h3>Resumen Financiero</h3>
            </div>
            <div class="summary-stats">
              <div class="stat-row">
                <span>Programas activos</span>
                <strong>{{ activeProgramsCount }}</strong>
              </div>
              <div class="stat-row">
                <span>Total invertido</span>
                <strong>${{ totalInvested.toLocaleString() }} MXN</strong>
              </div>
              <div class="stat-row">
                <span>Próximo pago</span>
                <strong>{{ nextPayment }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sesiones Programadas -->
    <section class="sessions-section">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-eyebrow">Agenda</span>
          <h2 class="section-title">Sesiones Programadas</h2>
          <div class="title-underline"></div>
          <p class="section-subtitle">Próximas videollamadas y reuniones técnicas</p>
        </div>

        <div class="sessions-grid">
          <div v-for="(session, idx) in upcomingSessions" :key="session.id" class="session-card" data-aos="fade-up" :data-aos-delay="idx * 100">
            <div class="session-date">
              <span class="session-day">{{ session.day }}</span>
              <span class="session-month">{{ session.month }}</span>
            </div>
            <div class="session-content">
              <div class="session-header">
                <h4>{{ session.title }}</h4>
                <span class="session-type" :class="session.type">
                  <i :class="session.type === 'video' ? 'bi bi-camera-video-fill' : 'bi bi-chat-dots-fill'"></i>
                  {{ session.type === 'video' ? 'Videollamada' : 'Reunión' }}
                </span>
              </div>
              <p class="session-description">{{ session.description }}</p>
              <div class="session-meta">
                <span><i class="bi bi-clock"></i> {{ session.time }}</span>
                <span><i class="bi bi-person"></i> {{ session.host }}</span>
              </div>
              <div class="session-actions">
                <button v-if="session.type === 'video'" class="join-btn" @click="joinSession(session.link)">
                  <i class="bi bi-box-arrow-in-right"></i>
                  Unirse
                </button>
                <button class="details-btn">
                  <i class="bi bi-info-circle"></i>
                  Detalles
                </button>
              </div>
            </div>
          </div>

          <div v-if="upcomingSessions.length === 0" class="no-sessions" data-aos="fade-up">
            <div class="empty-state">
              <i class="bi bi-calendar-x"></i>
              <h4>No hay sesiones programadas</h4>
              <p>No tienes sesiones programadas próximamente. Te notificaremos cuando se agenden nuevas reuniones.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterComponent :current-theme="currentTheme" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTheme = ref((localStorage.getItem('theme') as 'light' | 'dark') || 'light')

// Programas inscritos
const enrolledPrograms = ref([
  {
    id: 1,
    title: 'Análisis de Agua Potable',
    description: 'Programa de ensayos de aptitud para análisis fisicoquímicos y microbiológicos en agua.',
    icon: 'bi bi-droplet-fill',
    startDate: '15 Ene 2026',
    endDate: '15 Dic 2026',
    progress: 65,
    status: 'active'
  },
  {
    id: 2,
    title: 'Calibración de Instrumentos',
    description: 'Programa de comparación interlaboratorio para calibración de equipos de medición.',
    icon: 'bi bi-speedometer2',
    startDate: '01 Mar 2026',
    endDate: '30 Nov 2026',
    progress: 40,
    status: 'active'
  },
  {
    id: 3,
    title: 'Análisis de Alimentos',
    description: 'Ensayos de aptitud para análisis microbiológicos y químicos en alimentos procesados.',
    icon: 'bi bi-egg-fill',
    startDate: '01 Feb 2026',
    endDate: '20 Oct 2026',
    progress: 100,
    status: 'completed'
  }
])

// Pagos
const payments = ref([
  {
    concept: 'Inscripción - Análisis de Agua Potable',
    date: '10 Ene 2026',
    amount: 12500,
    status: 'paid',
    invoiceUrl: '/facturas/factura-001.pdf'
  },
  {
    concept: 'Primer pago - Calibración de Instrumentos',
    date: '15 Feb 2026',
    amount: 8500,
    status: 'paid',
    invoiceUrl: '/facturas/factura-002.pdf'
  },
  {
    concept: 'Segundo pago - Calibración de Instrumentos',
    date: '15 May 2026',
    amount: 8500,
    status: 'pending',
    invoiceUrl: null
  },
  {
    concept: 'Mantenimiento - Análisis de Agua Potable',
    date: '01 Abr 2026',
    amount: 3200,
    status: 'overdue',
    invoiceUrl: '/facturas/factura-003.pdf'
  }
])

// Sesiones
const upcomingSessions = ref([
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

// Computed
const totalPending = computed(() => {
  return payments.value
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)
})

const activeProgramsCount = computed(() => {
  return enrolledPrograms.value.filter(p => p.status === 'active').length
})

const totalInvested = computed(() => {
  return payments.value
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)
})

const nextPayment = computed(() => {
  const pending = payments.value.find(p => p.status === 'pending')
  return pending ? `${pending.date}` : 'Sin pagos pendientes'
})

// Methods
const downloadFeaturedPdf = () => {
  // Lógica para descargar el PDF promocional
  window.open('/src/pdf/PROGRAMA NACIONAL MEXICO SENA 2026.pdf', '_blank')
}

const downloadInvoice = (url: string) => {
  window.open(url, '_blank')
}

const openProgramDetail = (programId: number) => {
  router.push(`/cliente/programa/${programId}`)
}

const joinSession = (link: string | null) => {
  if (link) {
    window.open(link, '_blank')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-text: #1c2b14;
  --sena-muted: #5a6a52;
  --sena-border: rgba(93, 138, 47, 0.14);
  --radius-card: 20px;
  --shadow-sm: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  --shadow-green: 0 8px 28px rgba(93,138,47,0.22);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
}

.cliente-dashboard {
  font-family: var(--font-body);
  background: #fafaf8;
  min-height: 100vh;
  color: var(--sena-text);
}

[data-bs-theme="dark"] .cliente-dashboard {
  background: #0c0f0a;
  color: #e8ede3;
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122,171,61,0.16);
  --sena-green-pale: rgba(93,138,47,0.12);
}

/* Shared */
.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  margin-bottom: 0.6rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--sena-text);
  margin-bottom: 0.5rem;
}
.section-subtitle { color: var(--sena-muted); font-size: 0.9rem; margin-top: 0.5rem; }
.title-underline {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  border-radius: 2px;
}

/* Dashboard Hero */
.dashboard-hero {
  background: linear-gradient(140deg, #1a3d0c 0%, #0d2208 60%, #061604 100%);
  padding: 4rem 0;
  text-align: center;
}
.hero-content .section-eyebrow {
  color: rgba(122,171,61,0.85);
  background: rgba(122,171,61,0.15);
  padding: 0.28rem 0.9rem;
  border-radius: 20px;
}
.hero-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin: 1rem 0;
}
.hero-subtitle { color: rgba(255,255,255,0.75); font-size: 1.1rem; }

/* Featured Document */
.featured-document {
  padding: 3rem 0;
}
.featured-card {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
[data-bs-theme="dark"] .featured-card { background: #131a0e; }
.featured-content { padding: 3rem; }
.featured-title {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--sena-text);
  margin: 1rem 0;
}
.featured-description {
  color: var(--sena-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}
.featured-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.82rem;
  color: var(--sena-muted);
}
.featured-meta i { color: var(--sena-green); margin-right: 0.4rem; }
.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #ffffff;
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-green);
  transition: var(--transition);
}
.download-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(93,138,47,0.32); }
.btn-arrow { width: 16px; height: 16px; transition: transform 0.22s ease; }
.download-btn:hover .btn-arrow { transform: translateX(3px); }

.featured-preview {
  height: 100%;
  min-height: 300px;
  background: linear-gradient(135deg, var(--sena-green-pale), rgba(122,171,61,0.05));
  display: flex;
  align-items: center;
  justify-content: center;
}
.pdf-preview {
  text-align: center;
  color: var(--sena-green);
}
.pdf-preview i { font-size: 5rem; display: block; margin-bottom: 0.5rem; }
.pdf-preview span { font-size: 0.9rem; font-weight: 500; }

/* Programs */
.programs-section {
  padding: 4rem 0;
  background: #fafaf8;
}
[data-bs-theme="dark"] .programs-section { background: #0c0f0a; }
.section-header { text-align: center; margin-bottom: 3rem; }
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}
.program-card {
  background: #ffffff;
  border-radius: var(--radius-card);
  padding: 2rem;
  border: 1px solid var(--sena-border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
}
[data-bs-theme="dark"] .program-card { background: #131a0e; }
.program-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(93,138,47,0.1);
  border-color: var(--sena-green-light);
}
.program-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}
.program-status.active { background: rgba(93,138,47,0.15); color: var(--sena-green); }
.program-status.completed { background: rgba(108,117,125,0.15); color: #6c757d; }
.program-icon-wrap {
  width: 52px;
  height: 52px;
  background: var(--sena-green-pale);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--sena-green);
  margin-bottom: 1rem;
}
.program-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
.program-description { font-size: 0.82rem; color: var(--sena-muted); margin-bottom: 1rem; }
.program-dates { margin-bottom: 1rem; }
.date-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--sena-muted); margin-bottom: 0.3rem; }
.date-item i { color: var(--sena-green); }
.program-progress { margin-bottom: 1rem; }
.progress-info { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--sena-muted); margin-bottom: 0.4rem; }
.progress-bar {
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
.view-program-btn {
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: 1.5px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--transition);
}
.view-program-btn:hover {
  background: var(--sena-green);
  color: #ffffff;
}

/* Payments */
.payments-section {
  padding: 4rem 0;
  background: #ffffff;
}
[data-bs-theme="dark"] .payments-section { background: #0e1509; }
.payments-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 768px) {
  .payments-grid { grid-template-columns: 1fr; }
}
.payments-card, .summary-card {
  background: #fcfdfb;
  border-radius: var(--radius-card);
  padding: 2rem;
  border: 1px solid var(--sena-border);
}
[data-bs-theme="dark"] .payments-card, [data-bs-theme="dark"] .summary-card { background: #131a0e; }
.card-header-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--sena-border);
}
.card-header-section i { font-size: 1.5rem; color: var(--sena-green); }
.card-header-section h3 { font-size: 1.1rem; font-weight: 600; margin: 0; }
.payments-list { display: flex; flex-direction: column; gap: 1rem; }
.payment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid var(--sena-border);
}
[data-bs-theme="dark"] .payment-item { background: #0e1509; }
.payment-info { flex: 1; }
.payment-concept { display: block; font-weight: 500; font-size: 0.85rem; }
.payment-date { font-size: 0.75rem; color: var(--sena-muted); }
.payment-amount { font-weight: 700; font-size: 0.95rem; }
.payment-status { font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.3rem; }
.payment-status.paid { color: #198754; }
.payment-status.pending { color: #ffc107; }
.payment-status.overdue { color: #dc3545; }
.invoice-btn {
  padding: 0.3rem 0.75rem;
  background: transparent;
  border: 1px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: var(--transition);
}
.invoice-btn:hover { background: var(--sena-green); color: #fff; }
.total-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--sena-border);
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}
.summary-stats { display: flex; flex-direction: column; gap: 1rem; }
.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--sena-border);
  font-size: 0.85rem;
}
.stat-row:last-child { border-bottom: none; }

/* Sessions */
.sessions-section {
  padding: 4rem 0;
  background: #fafaf8;
}
[data-bs-theme="dark"] .sessions-section { background: #0c0f0a; }
.sessions-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}
.session-card {
  display: flex;
  gap: 1.5rem;
  background: #ffffff;
  border-radius: var(--radius-card);
  padding: 1.5rem;
  border: 1px solid var(--sena-border);
  transition: var(--transition);
}
[data-bs-theme="dark"] .session-card { background: #131a0e; }
.session-card:hover { box-shadow: var(--shadow-md); }
.session-date {
  width: 60px;
  height: 60px;
  background: var(--sena-green-pale);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.session-day { font-size: 1.5rem; font-weight: 700; color: var(--sena-green); line-height: 1; }
.session-month { font-size: 0.7rem; color: var(--sena-muted); text-transform: uppercase; }
.session-content { flex: 1; }
.session-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.session-header h4 { font-size: 1rem; font-weight: 600; margin: 0; }
.session-type {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-weight: 600;
}
.session-type.video { background: rgba(13,110,253,0.1); color: #0d6efd; }
.session-type.meeting { background: rgba(108,117,125,0.1); color: #6c757d; }
.session-description { font-size: 0.82rem; color: var(--sena-muted); margin-bottom: 0.75rem; }
.session-meta { display: flex; gap: 1.5rem; font-size: 0.78rem; color: var(--sena-muted); margin-bottom: 1rem; }
.session-actions { display: flex; gap: 0.75rem; }
.join-btn {
  padding: 0.45rem 1.25rem;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.details-btn {
  padding: 0.45rem 1.25rem;
  background: transparent;
  border: 1.5px solid var(--sena-green);
  color: var(--sena-green);
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: var(--transition);
}
.details-btn:hover { background: var(--sena-green-pale); }

.no-sessions {
  text-align: center;
  padding: 3rem;
}
.empty-state i { font-size: 3rem; color: var(--sena-muted); display: block; margin-bottom: 1rem; }
.empty-state h4 { font-weight: 600; margin-bottom: 0.5rem; }
.empty-state p { color: var(--sena-muted); font-size: 0.9rem; }

@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .section-title { font-size: 1.8rem; }
  .featured-content { padding: 2rem 1.5rem; }
  .programs-grid { grid-template-columns: 1fr; }
}
</style>
