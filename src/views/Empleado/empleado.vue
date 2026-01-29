<template>
	<section class="empleado-dashboard page-container">
		<header class="page-header">
			<div>
				<h1>Dashboard - Empleado</h1>
				<p class="muted">Resumen rápido de pagos y gestión</p>
			</div>
			<div class="actions">
				<button class="btn primary" @click="createPayment">Registrar Pago</button>
				<button class="btn outline" @click="goToPayments">Ver todos</button>
			</div>
		</header>

		<section class="stats-grid">
			<div class="card stat">
				<div class="stat-title">Pagos hoy</div>
				<div class="stat-value">{{ stats.todayPayments }}</div>
				<div class="stat-sub">Total: {{ formatCurrency(stats.todayAmount) }}</div>
			</div>
			<div class="card stat">
				<div class="stat-title">Pendientes</div>
				<div class="stat-value">{{ stats.pendingCount }}</div>
				<div class="stat-sub">Importe: {{ formatCurrency(stats.pendingAmount) }}</div>
			</div>
			<div class="card stat">
				<div class="stat-title">Mensajes</div>
				<div class="stat-value">{{ stats.unreadMessages }}</div>
				<div class="stat-sub">Sin leer</div>
			</div>
			<div class="card stat">
				<div class="stat-title">Último cierre</div>
				<div class="stat-value">{{ stats.lastClose }}</div>
				<div class="stat-sub">Estado: {{ stats.lastStatus }}</div>
			</div>
		</section>

		<section class="content-grid">
			<div class="card table-card">
				<h3>Pagos recientes</h3>
				<table class="table">
					<thead>
						<tr>
							<th>Fecha</th>
							<th>Cliente</th>
							<th>Concepto</th>
							<th>Monto</th>
							<th>Estado</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="p in recentPayments" :key="p.id">
							<td>{{ p.date }}</td>
							<td>{{ p.client }}</td>
							<td>{{ p.concept }}</td>
							<td>{{ formatCurrency(p.amount) }}</td>
							<td><span :class="['badge', p.status === 'Pagado' ? 'paid' : 'pending']">{{ p.status }}</span></td>
							<td><button class="btn small" @click="openPayment(p)">Abrir</button></td>
						</tr>
					</tbody>
				</table>
			</div>

			<aside class="card quick-card">
				<h4>Acciones rápidas</h4>
				<ul class="quick-list">
					<li v-for="a in quickActions" :key="a.id">
						<button class="btn block" @click="a.handler()">{{ a.title }}</button>
					</li>
				</ul>
			</aside>
		</section>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({
	todayPayments: 6,
	todayAmount: 1240.5,
	pendingCount: 3,
	pendingAmount: 760.0,
	unreadMessages: 2,
	lastClose: '2026-01-25',
	lastStatus: 'OK'
})

const recentPayments = ref([
	{ id: 1, date: '2026-01-26', client: 'Juan Perez', concept: 'Mensualidad', amount: 200.0, status: 'Pagado' },
	{ id: 2, date: '2026-01-26', client: 'María Gomez', concept: 'Inscripción', amount: 150.0, status: 'Pendiente' },
	{ id: 3, date: '2026-01-25', client: 'Carlos Ruiz', concept: 'Reinscripción', amount: 300.0, status: 'Pagado' },
	{ id: 4, date: '2026-01-24', client: 'Ana López', concept: 'Mensualidad', amount: 200.0, status: 'Pendiente' }
])

const quickActions = [
	{ id: 'new', title: 'Nuevo Pago', handler: () => router.push('/Empleado/NuevoPago') },
	{ id: 'buscar', title: 'Buscar Cliente', handler: () => router.push('/Empleado/Buscar') },
	{ id: 'reportes', title: 'Generar Reporte', handler: () => router.push('/Empleado/Reportes') }
]

function formatCurrency(v: number) {
	return v.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}

function openPayment(p: any) {
	router.push({ path: `/Empleado/Pago/${p.id}` })
}

function createPayment() {
	router.push('/Empleado/NuevoPago')
}

function goToPayments() {
	router.push('/Empleado/Pagos')
}
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px }
.page-header h1 { margin:0; font-size:1.25rem }
.muted { color:var(--color-gray,#6C757D) }
.actions { display:flex; gap:8px }
.btn { padding:8px 12px; border-radius:8px; border:1px solid transparent; cursor:pointer }
.btn.primary { background:var(--color-primary,#1E9E4A); color:white }
.btn.outline { background:transparent; border:1px solid var(--color-gray-light,#E9ECEF) }

.stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin-bottom:16px }
.card { background:var(--card-bg,#fff); border:1px solid var(--color-gray-light,#E9ECEF); padding:12px; border-radius:10px }
.stat { text-align:left }
.stat-title { font-size:0.85rem; color:var(--color-gray,#6C757D) }
.stat-value { font-size:1.6rem; font-weight:700; margin-top:6px }
.stat-sub { font-size:0.85rem; color:var(--color-gray,#6C757D); margin-top:6px }

.content-grid { display:grid; grid-template-columns: 1fr 320px; gap:16px }
.table-card { overflow:auto }
.table { width:100%; border-collapse:collapse }
.table th, .table td { padding:10px 8px; text-align:left; border-bottom:1px solid var(--color-gray-light,#E9ECEF) }
.badge { padding:4px 8px; border-radius:999px; font-weight:600; font-size:0.85rem }
.badge.paid { background:#e6ffef; color:#007a3d }
.badge.pending { background:#fff4e6; color:#b96b00 }
.quick-card h4 { margin-top:0 }
.quick-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px }
.btn.block { width:100%; text-align:left }
.btn.small { padding:6px 8px; font-size:0.85rem }

@media (max-width: 900px) {
	.content-grid { grid-template-columns: 1fr }
}
</style>

