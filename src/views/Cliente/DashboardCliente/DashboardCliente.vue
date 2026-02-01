<template>
	<div class="dashboard">
		<header class="header">
			<h1>Bienvenido, {{ userName }}</h1>
			<p class="subtitle">Panel de cliente</p>
		</header>

		<div class="content">
			<aside class="profile-card">
				<img :src="userAvatar" alt="Avatar" class="avatar"/>
				<h2>{{ userName }}</h2>
				<p>{{ userEmail }}</p>
				<button @click="goToProfile">Ver perfil</button>
			</aside>

			<main class="main">
				<section class="quick-actions">
					<h3>Acciones rápidas</h3>
					<div class="actions">
						<button @click="goToEventos">Eventos</button>
						<button @click="createRegistro">Registrarme</button>
						<button @click="openServicios">Servicios</button>
					</div>
				</section>

				<section class="upcoming">
					<h3>Próximos eventos</h3>
					<ul>
						<li v-for="(e, i) in events" :key="i">
							<strong>{{ e.title }}</strong> — {{ e.date }}
						</li>
						<li v-if="events.length===0">No hay eventos próximos.</li>
					</ul>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('Cliente')
const userEmail = ref('cliente@example.com')
const userAvatar = ref('/image/default-avatar.png')
const events = ref([] as Array<{title:string; date:string}>)

try {
	const u = JSON.parse(localStorage.getItem('user') || 'null')
	if (u) {
		userName.value = u.nombre || u.name || userName.value
		userEmail.value = u.email || userEmail.value
		if (u.avatar) userAvatar.value = u.avatar
	}
} catch (e) { }

function goToProfile(){ router.push('/perfil') }
function goToEventos(){ router.push('/eventos') }
function createRegistro(){ router.push('/eventos/registro') }
function openServicios(){ router.push('/servicios') }
</script>

<style scoped>
.dashboard{ padding:16px; font-family:inherit; color:var(--text,#222); }
.header{ margin-bottom:16px; }
.header h1{ margin:0; font-size:1.5rem; }
.subtitle{ color:#666; margin:4px 0 0; }

.content{ display:flex; gap:16px; align-items:flex-start; }
.profile-card{ width:220px; background:#fff; border:1px solid #e6e6e6; padding:12px; border-radius:8px; text-align:center; }
.avatar{ width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:8px; }
.profile-card button{ margin-top:8px; padding:8px 12px; border:none; background:#1976d2; color:#fff; border-radius:6px; cursor:pointer; }

.main{ flex:1; }
.quick-actions .actions{ display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
.quick-actions button{ padding:8px 12px; border-radius:6px; border:1px solid #ccc; background:#fafafa; cursor:pointer; }
.upcoming ul{ margin:8px 0 0; padding-left:16px; }
</style>

