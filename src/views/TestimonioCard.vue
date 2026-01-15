<template>
  <div class="testimonial-card">
    <!-- Rating -->
    <div class="testimonial-rating">
      <i
        v-for="star in 5"
        :key="star"
        class="bi"
        :class="star <= testimonial.rating ? 'bi-star-fill' : 'bi-star'"
      ></i>
    </div>

    <!-- Content -->
    <div class="testimonial-content">
      <i class="bi bi-quote"></i>
      <p class="testimonial-text">{{ testimonial.content }}</p>
    </div>

    <!-- Author -->
    <div class="testimonial-author">
      <div class="author-avatar">
        {{ getInitials(testimonial.name) }}
      </div>
      <div class="author-info">
        <h6 class="author-name">{{ testimonial.name }}</h6>
        <p class="author-position">{{ testimonial.position }}</p>
        <p class="author-company">{{ testimonial.company }}</p>
        <div class="author-service">
          <i class="bi bi-gear"></i>
          <span>{{ testimonial.service }}</span>
        </div>
      </div>
    </div>

    <!-- Date -->
    <div class="testimonial-date">
      <i class="bi bi-calendar"></i>
      <span>{{ formatDate(testimonial.date) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Testimonial {
  id: number
  name: string
  position: string
  company: string
  service: string
  content: string
  rating: number
  date: string
}

interface Props {
  testimonial: Testimonial
  currentTheme: 'light' | 'dark'
}

const props = defineProps<Props>()

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.testimonial-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--color-gray-light, #E9ECEF);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

[data-bs-theme="dark"] .testimonial-card {
  background: var(--card-bg, #2d2d2d);
  border-color: var(--color-gray-light, #2d2d2d);
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary, #1E9E4A);
}

.testimonial-rating {
  margin-bottom: 1rem;
}

.testimonial-rating i {
  color: #FFD700;
  font-size: 1rem;
  margin-right: 0.25rem;
}

.testimonial-content {
  position: relative;
  margin-bottom: 1.5rem;
  flex: 1;
}

.testimonial-content i {
  position: absolute;
  top: -10px;
  left: -10px;
  font-size: 3rem;
  color: var(--color-primary, #1E9E4A);
  opacity: 0.2;
}

.testimonial-text {
  color: var(--color-gray-dark, #495057);
  font-style: italic;
  line-height: 1.6;
  margin: 0;
}

[data-bs-theme="dark"] .testimonial-text {
  color: var(--color-gray-dark, #ADB5BD);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1E9E4A 0%, #34B565 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
}

.author-name {
  color: var(--color-dark, #212529);
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

[data-bs-theme="dark"] .author-name {
  color: var(--color-dark, #F8F9FA);
}

.author-position,
.author-company {
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.3;
}

.author-service {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-primary, #1E9E4A);
}

.author-service i {
  font-size: 0.9rem;
}

.testimonial-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray, #6C757D);
  font-size: 0.85rem;
  border-top: 1px solid var(--color-gray-light, #E9ECEF);
  padding-top: 1rem;
}

.testimonial-date i {
  font-size: 0.9rem;
}
</style>
