<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import logoUrl from '../assets/logo.jpg'

const props = defineProps({
  activeSection: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['toggle-theme'])

const isDark = ref(false)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navLinks = [
  { id: 'home', label: 'Beranda' },
  { id: 'profil-desa', label: 'Profil Desa' },
  { id: 'profil-kelompok', label: 'Profil Kelompok' },
  { id: 'program-kerja', label: 'Program Kerja' },
  { id: 'berita-acara', label: 'Berita Acara' },
  { id: 'galeri', label: 'Galeri KKN' },
  { id: 'kontak', label: 'Kontak' }
]

const checkScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  emit('toggle-theme', theme)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
  checkScroll()
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <header 
    class="navbar" 
    :class="{ 'navbar-scrolled': isScrolled || isMobileMenuOpen }"
  >
    <div class="container nav-container">
      <a href="#home" class="nav-logo" @click="closeMobileMenu">
        <img :src="logoUrl" class="logo-image" alt="Logo KKN Padepokan 4" />
        <div class="logo-text">
          <span class="logo-title">KKN MENGGAH 4</span>
          <span class="logo-subtitle">Desa Katekan</span>
        </div>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="desktop-nav">
        <a 
          v-for="link in navLinks" 
          :key="link.id" 
          :href="`#${link.id}`"
          class="nav-link"
          :class="{ 'active': activeSection === link.id }"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Action Area -->
      <div class="nav-actions">
        <button 
          @click="toggleTheme" 
          class="theme-toggle-btn" 
          aria-label="Toggle dark mode"
        >
          <span class="mode-indicator-dot" :class="{ 'dark-mode': isDark }"></span>
          <span class="mode-text">{{ isDark ? 'Gelap' : 'Terang' }}</span>
        </button>

        <button 
          @click="toggleMobileMenu" 
          class="mobile-menu-text-btn" 
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle menu"
        >
          {{ isMobileMenuOpen ? 'Tutup' : 'Menu' }}
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <transition name="slide-down">
      <div v-if="isMobileMenuOpen" class="mobile-nav-drawer glass">
        <div class="container mobile-nav-links">
          <a 
            v-for="link in navLinks" 
            :key="link.id" 
            :href="`#${link.id}`"
            class="mobile-link"
            :class="{ 'active': activeSection === link.id }"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.navbar-scrolled {
  height: 70px;
  background: var(--bg-surface-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-glow);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.nav-logo:hover .logo-image {
  transform: rotate(10deg) scale(1.1);
}

.logo-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.logo-title {
  font-weight: 850;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  color: var(--text-main);
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
}

.desktop-nav {
  display: flex;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .desktop-nav {
    display: none;
  }
}

.nav-link {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-muted);
  position: relative;
  padding: 0.5rem 0;
}

.nav-link:hover {
  color: var(--primary-light);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-light);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-link.active {
  color: var(--primary);
}

.nav-link.active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-toggle-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--sans);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  background-color: var(--primary-glow);
  color: var(--primary-light);
  transform: translateY(-1px);
}

.mode-indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--brand-gold);
  display: inline-block;
  transition: all 0.2s ease;
}

.mode-indicator-dot.dark-mode {
  background-color: var(--primary-light);
}

.mobile-menu-text-btn {
  display: none;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--sans);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mobile-menu-text-btn:hover {
  background-color: var(--primary-glow);
  color: var(--primary-light);
}

@media (max-width: 900px) {
  .mobile-menu-text-btn {
    display: flex;
  }
}

/* Mobile Drawer */
.mobile-nav-drawer {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  z-index: 999;
  padding: 1.5rem 1.5rem;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-link {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-muted);
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  text-align: left;
}

.mobile-link.active {
  color: var(--primary-light);
  padding-left: 0.5rem;
  border-left: 3px solid var(--primary-light);
}

/* Drawer Animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: scaleY(0);
  opacity: 0;
}
@media (max-width: 480px) {
  .logo-title {
    font-size: 0.92rem;
  }
  .logo-subtitle {
    display: none;
  }
  .theme-toggle-btn .mode-text {
    display: none;
  }
  .theme-toggle-btn {
    padding: 0.45rem;
    width: 36px;
    height: 36px;
    justify-content: center;
  }
  .logo-image {
    width: 36px;
    height: 36px;
  }
}
</style>
