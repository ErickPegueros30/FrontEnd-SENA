<template>
  <div
    class="service-card"
    :class="viewMode"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="service-card-grid">
      <!-- certification removed -->

      <!-- Icono -->
      <div class="service-icon" :style="{ background: iconGradient }">
        <i :class="service.icon"></i>
      </div>

      <!-- Contenido -->
      <div class="service-content">
        <h4 class="service-title">{{ service.name }}</h4>
        <p class="service-description">{{ service.description }}</p>

        <!-- Características -->
        <div class="service-features">
          <span v-for="(feature, index) in service.features.slice(0, 2)" :key="index" class="feature-tag">
            {{ feature }}
          </span>
          <span v-if="service.features.length > 2" class="feature-more">
            +{{ service.features.length - 2 }} más
          </span>
        </div>

        <!-- Información (simplified) -->
        <div class="service-info">
          <!-- no additional meta to display -->
        </div>

        <!-- Hover Content -->
        <div class="service-hover" :class="{ 'active': hover }">
          <div class="hover-content">
            <h5>Características completas</h5>
            <ul class="hover-features">
              <li v-for="(feature, index) in service.features" :key="index">
                <i class="bi bi-check-circle-fill"></i> {{ feature }}
              </li>
            </ul>
            <div class="hover-actions">
              <button class="btn btn-sm btn-primary" @click="requestQuote">
                <i class="bi bi-chat-dots me-1"></i>Solicitar
              </button>
              <button class="btn btn-sm btn-outline-light" @click="showDetails">
                <i class="bi bi-info-circle me-1"></i>Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="service-card-list">
      <div class="list-header">
        <div class="service-icon-sm" :style="{ background: iconGradient }">
          <i :class="service.icon"></i>
        </div>
            <div class="list-title">
          <h4 class="service-title">{{ service.name }}</h4>
            <div class="service-tags">
              <!-- certification and popularity removed -->
            </div>
        </div>
        <!-- price removed -->
      </div>

      <div class="list-content">
        <p class="service-description">{{ service.description }}</p>

        <div class="service-features-list">
          <span v-for="(feature, index) in service.features" :key="index" class="feature-tag">
            {{ feature }}
          </span>
        </div>

        <div class="list-actions">
          <button class="btn btn-sm btn-primary" @click="requestQuote">
            <i class="bi bi-chat-dots me-1"></i>Solicitar cotización
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Service {
  id: number
  categoryId: number
  name: string
  description: string
  icon: string
  industries: number[]
  standards: number[]
  features: string[]
  // popularity and certification removed
}

interface Props {
  service: Service
  currentTheme: 'light' | 'dark'
  viewMode: 'grid' | 'list'
}

const props = defineProps<Props>()
const hover = ref(false)

const iconGradient = computed(() => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ]
  const index = props.service.id % gradients.length
  return gradients[index]
})

// price removed from UI and data model

const requestQuote = () => {
  console.log(`Solicitar cotización para: ${props.service.name}`)
  // Aquí iría la lógica para solicitar cotización
}

const showDetails = () => {
  console.log(`Ver detalles de: ${props.service.name}`)
  // Aquí iría la lógica para mostrar detalles
}
</script>

<style scoped>
.service-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  height: 100%;
}

[data-bs-theme="dark"] .service-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.service-card-grid {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.service-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.service-content {
  padding: 0 1.5rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-title {
  color: var(--color-dark, #212529);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-align: center;
  line-height: 1.3;
}

[data-bs-theme="dark"] .service-title {
  color: var(--color-dark, #F8F9FA);
}

.service-description {
  color: var(--color-gray, #6C757D);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: center;
  flex: 1;
}

.service-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.feature-tag {
  background: var(--gradient-accent, linear-gradient(135deg, rgba(166, 184, 40, 0.1) 0%, rgba(166, 184, 40, 0.05) 100%));
  color: var(--color-primary, #a6b828);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(166, 184, 40, 0.2);
}

[data-bs-theme="dark"] .feature-tag {
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.15) 0%, rgba(166, 184, 40, 0.1) 100%);
  color: var(--color-primary-light, #a6b828);
}

.feature-more {
  background: var(--color-gray-light, #E9ECEF);
  color: var(--color-gray, #6C757D);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.service-info {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.info-item i {
  color: var(--color-primary, #a6b828);
  font-size: 1rem;
}

.info-item span {
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
  font-weight: 500;
}

/* Hover Content */
.service-hover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(166, 184, 40, 0.95) 0%, rgba(166, 184, 40, 0.9) 100%);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.service-hover.active {
  opacity: 1;
  transform: translateY(0);
}

.hover-content {
  color: white;
  text-align: center;
}

.hover-content h5 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
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
  font-size: 0.85rem;
}

.hover-features li i {
  color: #FFD700;
  font-size: 0.9rem;
}

.hover-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* List View */
.service-card-list {
  padding: 1.5rem;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.service-icon-sm {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.list-title {
  flex: 1;
}


.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.tag.certified {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333;
}

/* price/duration styles removed */

.tag.popularity {
  display: none;
}

.list-content {
  padding-left: 66px; /* icon width + gap */
}

.service-description {
  text-align: left;
  margin-bottom: 1rem;
}

.service-features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.list-actions {
  display: flex;
  gap: 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .list-content {
    padding-left: 0;
  }

  .service-tags {
    margin-top: 0.25rem;
  }

  .list-actions {
    flex-direction: column;
  }

  .list-actions .btn {
    width: 100%;
  }
}
</style>
