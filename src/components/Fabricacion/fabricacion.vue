<template>
  <div class="dev-placeholder">
	<div class="card">
	  <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden>
		<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
	  </svg>
	  <h2>Sitio en desarrollo</h2>
	  <p class="lead">Pronto estará disponible.</p>
	  <p class="hint">Gracias por tu paciencia — estamos trabajando en ello.</p>
	</div>
  </div>
</template>

<script setup lang="ts">
// Placeholder estático — sin lógica adicional
</script>

<style scoped>
.dev-placeholder { display:flex; align-items:center; justify-content:center; padding:48px }
.card { text-align:center; background:var(--card-bg,#ffffff); border:1px solid rgba(0,0,0,0.06); padding:36px; border-radius:12px; width:480px; box-shadow:0 8px 24px rgba(16,24,40,0.06) }
.icon { width:48px; height:48px; color:var(--primary,#2b6cb0); margin-bottom:12px }
h2 { margin:0 0 8px 0; font-size:1.5rem; color:var(--text,#0f172a) }
.lead { margin:0 0 6px 0; color:var(--muted,#475569) }
.hint { margin:0; font-size:0.9rem; color:var(--muted,#6b7280) }

@media (max-width:520px) {
  .card { width:92%; padding:24px }
}
</style>

