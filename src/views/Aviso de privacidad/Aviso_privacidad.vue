<template>
	<div class="page-container">
		<div class="container py-5">
			<h1 class="section-title">Aviso de Privacidad</h1>
			<p class="mb-4">Consulte nuestro aviso de privacidad completo.</p>

			<button class="contact-btn" @click="show = true">Ver aviso de privacidad</button>
		</div>

		<PrivacyModal v-model:modelValue="show" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PrivacyModal from '@/components/PrivacyModal.vue'

const show = ref(false)
</script>

<style scoped>
.page-container { min-height: 60vh; }
.section-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; margin-bottom: 0.5rem; }
</style>
