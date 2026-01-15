<template>
  <div class="program-card" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="card-header">
      <div class="program-icon" :style="{ background: iconGradient }">
        <i :class="program.icon"></i>
      </div>
      <h4 class="program-title">{{ program.title }}</h4>
    </div>

    <div class="card-body">
      <p class="program-description">{{ program.description }}</p>

      <div class="program-features">
        <h6 class="features-title">Parámetros comunes:</h6>
        <div class="features-list">
          <span v-for="(feature, index) in program.features" :key="index" class="feature-tag">
            {{ feature }}
          </span>
        </div>
      </div>

      <div class="program-details">
        <div class="detail-item">
          <i class="bi bi-file-earmark-text"></i>
          <span>{{ program.norma }}</span>
        </div>
        <div class="detail-item">
          <i class="bi bi-calendar-event"></i>
          <span>Frecuencia: {{ program.frecuencia }}</span>
        </div>
      </div>
    </div>

    <div class="card-hover-content" :class="{ 'active': hover }">
      <div class="hover-overlay"></div>
      <div class="hover-content">
        <h5>Beneficios específicos:</h5>
        <ul class="hover-features">
          <li v-for="(feature, index) in program.features" :key="index">
            <i class="bi bi-check-circle-fill"></i> {{ feature }}
          </li>
        </ul>
        <button class="btn btn-outline-light btn-sm" @click="requestInfo(program)">
          <i class="bi bi-info-circle me-1"></i>Más información
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Program {
  id: number
  title: string
  description: string
  icon: string
  features: string[]
  norma: string
  frecuencia: string
}

interface Props {
  program: Program
  currentTheme: 'light' | 'dark'
}

const props = defineProps<Props>()
const hover = ref(false)

const emit = defineEmits<{
  'request-info': [program: Program]
}>()

const iconGradient = computed(() => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ]
  const index = props.program.id % gradients.length
  return gradients[index]
})

const requestInfo = (program: Program) => {
  emit('request-info', program)
}
</script>

<style scoped>
.program-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-bs-theme="dark"] .program-card {
  background: var(--card-bg, #2d2d2d);
  border: 1px solid var(--color-gray-light, #2d2d2d);
}

.program-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.program-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.program-title {
  color: var(--color-dark, #212529);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

[data-bs-theme="dark"] .program-title {
  color: var(--color-dark, #F8F9FA);
}

.card-body {
  flex: 1;
}

.program-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.program-features {
  margin-bottom: 1.5rem;
}

.features-title {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

[data-bs-theme="dark"] .features-title {
  color: var(--color-dark, #F8F9FA);
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%));
  color: var(--color-primary, #1E9E4A);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(30, 158, 74, 0.2);
}

[data-bs-theme="dark"] .feature-tag {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%);
  color: var(--color-primary-light, #34B565);
}

.program-details {
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  padding-top: 1.5rem;
  margin-top: auto;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item i {
  color: var(--color-primary, #1E9E4A);
  font-size: 1rem;
}

.detail-item span {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
}

/* Hover Content */
.card-hover-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(30, 158, 74, 0.95) 0%, rgba(52, 181, 101, 0.9) 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.card-hover-content.active {
  opacity: 1;
  transform: translateY(0);
}

.hover-content {
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;
}

.hover-content h5 {
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.hover-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  text-align: left;
}

.hover-features li {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.hover-features li i {
  color: #FFD700;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .program-card {
    padding: 1.5rem;
  }

  .program-icon {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
  }

  .program-title {
    font-size: 1.1rem;
  }
}
</style>
