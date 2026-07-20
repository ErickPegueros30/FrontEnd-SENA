<template>
  <div v-if="showSidebar" class="admin-sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- Menú Principal -->
    <nav class="sidebar-nav">
      <ul class="nav-menu">
        <li
          v-for="item in menuItems"
          :key="item.id"
          class="nav-item"
          :class="{ 'active': activeMenu === item.id, 'has-submenu': item.children }"
        >
          <router-link
            v-if="!item.children"
            :to="item.path"
            class="nav-link"
            @click="setActiveMenu(item.id)"
          >
            <i class="bi" :class="item.icon"></i>
            <span class="nav-text" v-if="!isCollapsed">{{ item.title }}</span>
            <span v-if="item.badge && !isCollapsed" class="nav-badge">{{ item.badge }}</span>
          </router-link>

          <div
            v-else
            class="nav-link submenu-toggle"
            @click="toggleSubmenu(item.id)"
          >
            <div class="submenu-header">
              <i class="bi" :class="item.icon"></i>
              <span class="nav-text" v-if="!isCollapsed">{{ item.title }}</span>
              <span v-if="item.badge && !isCollapsed" class="nav-badge">{{ item.badge }}</span>
            </div>
            <i
              class="bi submenu-arrow"
              :class="expandedSubmenus.includes(item.id) ? 'bi-chevron-down' : 'bi-chevron-right'"
              v-if="!isCollapsed"
            ></i>
          </div>

          <ul
            v-if="item.children && expandedSubmenus.includes(item.id) && !isCollapsed"
            class="submenu"
          >
            <li
              v-for="child in item.children"
              :key="child.id"
              class="submenu-item"
              :class="{ 'active': activeMenu === child.id }"
            >
              <router-link
                :to="child.path"
                class="submenu-link"
                @click="setActiveMenu(child.id)"
              >
                <i class="bi" :class="child.icon"></i>
                <span>{{ child.title }}</span>
                <span v-if="child.badge" class="submenu-badge">{{ child.badge }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Footer del Sidebar -->
    <div class="sidebar-footer" v-if="!isCollapsed">
      <div class="system-info">
        <div class="info-item">
          <i class="bi bi-circle-fill online-dot"></i>
          <span>Online</span>
        </div>
        <div class="info-item">
          <i class="bi bi-clock"></i>
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import useAuthStore from '@/compasable/useAuthStore'
import useUiStore from '@/compasable/useUiStore'
import useSidebarAcademia from './sidebar'

const ui = useUiStore()
const auth = useAuthStore()
const isCollapsed = computed(() => ui.state.sidebarCollapsed)
const showSidebar = computed(() => ui.state.sidebarVisible && auth.isAuthenticated.value)
const expandedSubmenus: Ref<string[]> = ref([])
const currentTime: Ref<string> = ref('')

const sidebarApi = useSidebarAcademia()
const menuItems = sidebarApi.menuItems
const activeMenu = sidebarApi.active

const setActiveMenu = (menuId: string) => {
  try { sidebarApi.setActive(menuId) } catch (e) { /* fallback */ }
}

const toggleSubmenu = (menuId: string) => {
  const index = expandedSubmenus.value.indexOf(menuId)
  if (index === -1) {
    expandedSubmenus.value.push(menuId)
  } else {
    expandedSubmenus.value.splice(index, 1)
  }
}

const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  updateCurrentTime()
  const timer = setInterval(updateCurrentTime, 60000)

  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>

<style scoped>

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --radius-sm: 10px;
  --radius-card: 16px;
  --shadow-sm: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
}

/* ============================================================
   SIDEBAR BASE
   ============================================================ */
.admin-sidebar {
  width: 260px;
  height: calc(100vh - var(--app-header-height, 64px));
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  position: fixed;
  left: 0;
  top: var(--app-header-height, 64px);
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: var(--font-body);
}

.admin-sidebar.collapsed {
  width: 64px;
}

/* ============================================================
   MODO CLARO - ESTILOS BASE
   ============================================================ */
.admin-sidebar {
  background: #ffffff;
  border-right: 1px solid #e8ece4;
  box-shadow: 2px 0 24px rgba(0, 0, 0, 0.04);
}

/* ============================================================
   NAVIGATION MENU
   ============================================================ */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-menu {
  list-style: none;
  padding: 0 0.75rem;
  margin: 0;
}

.nav-item {
  margin-bottom: 3px;
  border-radius: var(--radius-sm);
}

/* Estilo base del enlace */
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  color: #3a4a30;
  text-decoration: none;
  transition: var(--transition);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.88rem;
  border: 1px solid transparent;
}

/* Hover state */
.nav-link:hover {
  background: #f5f8f2;
  color: #1a2612;
  border-color: #e0e5da;
}

.nav-link i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  color: #6b7a60;
  transition: var(--transition);
  flex-shrink: 0;
}

.nav-link:hover i {
  color: #5d8a2f;
}

/* ============================================================
   ACTIVE STATE - MODO CLARO
   ============================================================ */
.nav-item.active .nav-link {
  background: #f8faf5;
  color: #2a3a20;
  font-weight: 600;
  border: 1px solid #d0d8c8;
  box-shadow: 0 4px 16px rgba(93, 138, 47, 0.08);
  position: relative;
}

.nav-item.active .nav-link i {
  color: #5d8a2f;
}

/* Indicador lateral en item activo */
.nav-item.active .nav-link::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: linear-gradient(180deg, #5d8a2f 0%, #7aab3d 100%);
  border-radius: 3px;
}

.nav-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============================================================
   BADGE
   ============================================================ */
.nav-badge {
  background: #edf4e3;
  color: #5d8a2f;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(93, 138, 47, 0.1);
}

/* ============================================================
   SUBMENU
   ============================================================ */
.submenu-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.submenu-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.submenu-arrow {
  font-size: 0.7rem;
  color: #8a9a7e;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.submenu {
  list-style: none;
  padding: 0.4rem 0;
  margin: 4px 0 4px 1.5rem;
  background: #fafbf8;
  border-radius: var(--radius-sm);
  border: 1px solid #e8ece4;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem 0.85rem;
  color: #5a6a52;
  text-decoration: none;
  transition: var(--transition);
  border-radius: 6px;
  font-size: 0.84rem;
  font-weight: 500;
}

.submenu-link:hover {
  background: #f0f4ea;
  color: #2a3a20;
}

.submenu-link i {
  font-size: 0.9rem;
  width: 18px;
  text-align: center;
  color: #8a9a7e;
  flex-shrink: 0;
}

.submenu-link:hover i {
  color: #5d8a2f;
}

.submenu-item.active .submenu-link {
  color: #5d8a2f;
  font-weight: 600;
  background: #f0f4ea;
  border-radius: 6px;
}

.submenu-item.active .submenu-link i {
  color: #5d8a2f;
}

.submenu-badge {
  background: #edf4e3;
  color: #5d8a2f;
  padding: 0.1rem 0.4rem;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 600;
  margin-left: auto;
}

/* ============================================================
   COLLAPSED STATE
   ============================================================ */
.admin-sidebar.collapsed .nav-text,
.admin-sidebar.collapsed .nav-badge,
.admin-sidebar.collapsed .submenu-arrow,
.admin-sidebar.collapsed .submenu {
  display: none;
}

.admin-sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 0.7rem;
  gap: 0;
}

.admin-sidebar.collapsed .nav-link i {
  margin: 0;
  font-size: 1.3rem;
}

.admin-sidebar.collapsed .nav-menu {
  padding: 0 0.5rem;
}

.admin-sidebar.collapsed .nav-item.active .nav-link::before {
  left: 50%;
  top: auto;
  bottom: 6px;
  transform: translateX(-50%);
  width: 16px;
  height: 3px;
  border-radius: 2px;
}

/* ============================================================
   SIDEBAR FOOTER
   ============================================================ */
.sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #e8ece4;
  background: #fafbf8;
}

.system-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: #8a9a7e;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
}

.info-item i {
  font-size: 0.65rem;
  color: #6b7a60;
}

.online-dot {
  color: #5d8a2f !important;
  font-size: 0.5rem !important;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ============================================================
   MODO OSCURO
   ============================================================ */
[data-bs-theme="dark"] .admin-sidebar {
  background: #0c1008;
  border-right: 1px solid rgba(122, 171, 61, 0.08);
  box-shadow: 2px 0 24px rgba(0, 0, 0, 0.2);
}

[data-bs-theme="dark"] .nav-link {
  color: #8a9e7c;
}

[data-bs-theme="dark"] .nav-link:hover {
  background: rgba(122, 171, 61, 0.06);
  color: #c8d8be;
  border-color: rgba(122, 171, 61, 0.1);
}

[data-bs-theme="dark"] .nav-link i {
  color: #6b7a60;
}

[data-bs-theme="dark"] .nav-link:hover i {
  color: #7aab3d;
}

[data-bs-theme="dark"] .nav-item.active .nav-link {
  background: rgba(93, 138, 47, 0.12);
  border-color: rgba(122, 171, 61, 0.18);
  color: #c8d8be;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

[data-bs-theme="dark"] .nav-item.active .nav-link i {
  color: #7aab3d;
}

[data-bs-theme="dark"] .nav-item.active .nav-link::before {
  background: linear-gradient(180deg, #5d8a2f 0%, #7aab3d 100%);
}

[data-bs-theme="dark"] .nav-badge {
  background: rgba(122, 171, 61, 0.12);
  color: #7aab3d;
  border-color: rgba(122, 171, 61, 0.15);
}

[data-bs-theme="dark"] .submenu {
  background: #0e1509;
  border-color: rgba(122, 171, 61, 0.08);
}

[data-bs-theme="dark"] .submenu-link {
  color: #8a9e7c;
}

[data-bs-theme="dark"] .submenu-link:hover {
  background: rgba(122, 171, 61, 0.06);
  color: #c8d8be;
}

[data-bs-theme="dark"] .submenu-link i {
  color: #6b7a60;
}

[data-bs-theme="dark"] .submenu-link:hover i {
  color: #7aab3d;
}

[data-bs-theme="dark"] .submenu-item.active .submenu-link {
  color: #7aab3d;
  background: rgba(122, 171, 61, 0.1);
}

[data-bs-theme="dark"] .submenu-item.active .submenu-link i {
  color: #7aab3d;
}

[data-bs-theme="dark"] .submenu-badge {
  background: rgba(122, 171, 61, 0.12);
  color: #7aab3d;
}

[data-bs-theme="dark"] .sidebar-footer {
  border-top-color: rgba(122, 171, 61, 0.08);
  background: #0a0e06;
}

[data-bs-theme="dark"] .system-info {
  color: #6b7a60;
}

[data-bs-theme="dark"] .online-dot {
  color: #7aab3d !important;
}

/* ============================================================
   SCROLLBAR STYLING
   ============================================================ */
.admin-sidebar::-webkit-scrollbar {
  width: 4px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: #d0d8c8;
  border-radius: 4px;
}

[data-bs-theme="dark"] .admin-sidebar::-webkit-scrollbar-thumb {
  background: rgba(122, 171, 61, 0.2);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 260px;
    box-shadow: 4px 0 32px rgba(0, 0, 0, 0.1);
  }

  .admin-sidebar.collapsed {
    width: 56px;
  }

  .nav-link {
    padding: 0.6rem 0.8rem;
    font-size: 0.84rem;
  }

  .nav-link i {
    font-size: 1.1rem;
    width: 22px;
  }
}
</style>
