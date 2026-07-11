<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { galeriApi } from '../services/api.js'

const selectedCategory = ref('all')
const activeIndex = ref(null)
const isLightboxOpen = ref(false)
const zoomLevel = ref(1)

const categories = [
  { id: 'all', label: 'Semua Kegiatan' },
  { id: 'pendidikan', label: 'Pendidikan & Anak' },
  { id: 'lingkungan', label: 'Sosial & Lingkungan' },
  { id: 'umkm', label: 'Ekonomi & UMKM' },
  { id: 'keagamaan', label: 'Keagamaan & Budaya' }
]

const galleryItems = ref([])
const isLoading = ref(false)

const items = computed(() => {
  return galleryItems.value.map(g => ({
    title: g.title,
    category: g.category,
    date: g.date,
    desc: g.description || '',
    image: g.image_url
  }))
})

const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') return items.value
  return items.value.filter(item => item.category === selectedCategory.value)
})

const featuredIndex = ref(0)

const featuredItem = computed(() => {
  if (filteredItems.value.length === 0) return null
  if (featuredIndex.value >= filteredItems.value.length) {
    featuredIndex.value = 0
  }
  return filteredItems.value[featuredIndex.value]
})

const thumbScrollRef = ref(null)
const isThumbDragging = ref(false)
const thumbStartX = ref(0)
const thumbScrollLeft = ref(0)

function startThumbDrag(e) {
  isThumbDragging.value = true
  thumbStartX.value = e.pageX - thumbScrollRef.value.offsetLeft
  thumbScrollLeft.value = thumbScrollRef.value.scrollLeft
}

function onThumbDrag(e) {
  if (!isThumbDragging.value) return
  e.preventDefault()
  const x = e.pageX - thumbScrollRef.value.offsetLeft
  const walk = (x - thumbStartX.value) * 1.5
  thumbScrollRef.value.scrollLeft = thumbScrollLeft.value - walk
}

function endThumbDrag() {
  isThumbDragging.value = false
}

function prevThumb() {
  if (featuredIndex.value > 0) {
    featuredIndex.value--
  } else {
    featuredIndex.value = filteredItems.value.length - 1
  }
  scrollToActiveThumb()
}

function nextThumb() {
  if (featuredIndex.value < filteredItems.value.length - 1) {
    featuredIndex.value++
  } else {
    featuredIndex.value = 0
  }
  scrollToActiveThumb()
}

function selectFeatured(item) {
  const idx = filteredItems.value.findIndex(i => i.title === item.title)
  if (idx !== -1) {
    featuredIndex.value = idx
  }
}

function activeThumbnailIndex(item) {
  return featuredItem.value && featuredItem.value.title === item.title
}

function scrollToActiveThumb() {
  setTimeout(() => {
    if (!thumbScrollRef.value) return
    const activeEl = thumbScrollRef.value.querySelector('.thumbnail-card.active')
    if (activeEl) {
      const containerWidth = thumbScrollRef.value.clientWidth
      const elOffset = activeEl.offsetLeft
      const elWidth = activeEl.clientWidth
      thumbScrollRef.value.scrollTo({
        left: elOffset - containerWidth / 2 + elWidth / 2,
        behavior: 'smooth'
      })
    }
  }, 50)
}

const openLightbox = (index) => {
  const currentItem = filteredItems.value[index]
  activeIndex.value = items.value.findIndex(item => item.title === currentItem.title)
  isLightboxOpen.value = true
  zoomLevel.value = 1
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  activeIndex.value = null
  document.body.style.overflow = ''
}

const activeItem = computed(() => {
  if (activeIndex.value === null) return null
  return items.value[activeIndex.value]
})

const nextImage = () => {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + 1) % items.value.length
  zoomLevel.value = 1
}

const prevImage = () => {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length
  zoomLevel.value = 1
}

const zoomIn = () => {
  if (zoomLevel.value < 2.5) zoomLevel.value += 0.25
}

const zoomOut = () => {
  if (zoomLevel.value > 0.75) zoomLevel.value -= 0.25
}

const handleKeyDown = (e) => {
  if (!isLightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
  isLoading.value = true
  try {
    const res = await galeriApi.getAll()
    if (res && res.data) {
      galleryItems.value = res.data
    }
  } catch (e) {
    console.error('Error loading galeri:', e)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <section id="galeri" class="galeri-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="tag">Galeri Foto</span>
        <h2>Kilas Kegiatan KKN</h2>
        <p>
          Rekam jejak visual dari berbagai momen, pengabdian, tawa, dan kolaborasi kami bersama warga Dusun Menggah.
        </p>
      </div>

      <!-- Filters -->
      <div class="filter-wrapper">
        <div class="filter-list glass">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="filter-btn"
            :class="{ 'active': selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="gallery-loading-state glass">
        <div class="loader-spinner"></div>
        <p class="state-text">Memuat galeri foto...</p>
      </div>

      <!-- Empty state if no items -->
      <div v-else-if="filteredItems.length === 0" class="gallery-empty-state glass">
        <p>Tidak ada foto untuk kategori ini.</p>
      </div>

      <div v-else class="gallery-carousel-concept">
        <!-- Featured Gallery Stage -->
        <div class="featured-gallery-stage glass animate-fade-up">
          <div class="stage-image-container" @click="openLightbox(featuredIndex)">
            <img :src="featuredItem.image" :alt="featuredItem.title" class="stage-img" />
            <div class="stage-overlay">
              <div class="stage-meta">
                <span class="stage-tag">{{ featuredItem.category.toUpperCase() }}</span>
                <span class="stage-dot">•</span>
                <span class="stage-date">{{ featuredItem.date }}</span>
              </div>
              <h3 class="stage-title">{{ featuredItem.title }}</h3>
              <p class="stage-desc">{{ featuredItem.desc }}</p>
              <span class="stage-zoom-hint">Klik untuk perbesar laporan 🔍</span>
            </div>
          </div>
        </div>

        <!-- Thumbnail Slider Strip -->
        <div class="thumbnail-slider-wrapper">
          <button class="thumb-nav-btn prev" @click="prevThumb" aria-label="Sebelumnya">‹</button>
          <div 
            ref="thumbScrollRef" 
            class="thumbnail-scroll-container"
            @mousedown="startThumbDrag"
            @mousemove="onThumbDrag"
            @mouseup="endThumbDrag"
            @mouseleave="endThumbDrag"
          >
            <div 
              v-for="item in filteredItems" 
              :key="item.title"
              class="thumbnail-card"
              :class="{ active: activeThumbnailIndex(item) }"
              @click="selectFeatured(item)"
            >
              <img :src="item.image" :alt="item.title" class="thumb-img" />
              <div class="thumb-card-overlay">
                <span class="thumb-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
          <button class="thumb-nav-btn next" @click="nextThumb" aria-label="Selanjutnya">›</button>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <transition name="fade">
      <div v-if="isLightboxOpen && activeItem" class="lightbox-overlay" @click.self="closeLightbox">
        <!-- Close Button -->
        <button class="control-btn close-btn" @click="closeLightbox" aria-label="Close Lightbox">
          ✕
        </button>

        <!-- Left Navigation Arrow -->
        <button class="control-btn nav-btn prev-btn" @click="prevImage" aria-label="Previous Image">
          ←
        </button>

        <!-- Image Wrapper -->
        <div class="lightbox-content">
          <div class="lightbox-img-wrapper">
            <img 
              :src="activeItem.image" 
              :alt="activeItem.title" 
              class="lightbox-img" 
              :style="{ transform: `scale(${zoomLevel})` }"
            />
          </div>
          
          <!-- Image details -->
          <div class="lightbox-details glass">
            <div class="details-top">
              <span class="detail-category">{{ activeItem.category }}</span>
              <span class="detail-date">{{ activeItem.date }}</span>
            </div>
            <h3 class="detail-title">{{ activeItem.title }}</h3>
            <p class="detail-desc">{{ activeItem.desc }}</p>
            
            <!-- Zoom Controls -->
            <div class="zoom-controls">
              <button @click="zoomOut" class="zoom-btn" aria-label="Zoom Out" :disabled="zoomLevel <= 0.75">
                -
              </button>
              <span class="zoom-factor">{{ Math.round(zoomLevel * 100) }}%</span>
              <button @click="zoomIn" class="zoom-btn" aria-label="Zoom In" :disabled="zoomLevel >= 2.5">
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Right Navigation Arrow -->
        <button class="control-btn nav-btn next-btn" @click="nextImage" aria-label="Next Image">
          →
        </button>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.galeri-section {
  background-color: var(--bg-base);
  position: relative;
}

/* Filters */
.filter-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 3.5rem;
}

.filter-list {
  display: flex;
  padding: 0.35rem;
  border-radius: 14px;
  overflow-x: auto;
  max-width: 100%;
  gap: 0.25rem;
}

.filter-btn {
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.6rem 1.25rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  color: var(--primary-light);
}

.filter-btn.active {
  background-color: var(--primary);
  color: white;
}

/* Gallery Empty State */
.gallery-empty-state {
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 24px;
  color: var(--text-muted);
  font-weight: 600;
}

/* Featured Stage Layout */
.gallery-carousel-concept {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 960px;
  margin: 0 auto;
}

.featured-gallery-stage {
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
}

.stage-image-container {
  width: 100%;
  height: 480px;
  position: relative;
  cursor: zoom-in;
  overflow: hidden;
}

@media (max-width: 768px) {
  .stage-image-container {
    height: 320px;
  }
}

@media (max-width: 480px) {
  .stage-image-container {
    height: 240px;
  }
}

.stage-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.stage-image-container:hover .stage-img {
  transform: scale(1.03);
}

.stage-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2.5rem;
  color: white;
  text-align: left;
  transition: all 0.3s ease;
}

@media (max-width: 640px) {
  .stage-overlay {
    padding: 1.5rem;
  }
}

.stage-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.72rem;
  font-weight: 850;
  margin-bottom: 0.75rem;
  color: var(--primary-light);
  letter-spacing: 0.05em;
}

.stage-dot {
  color: rgba(255, 255, 255, 0.3);
}

.stage-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.25;
}

@media (max-width: 640px) {
  .stage-title {
    font-size: 1.25rem;
  }
}

.stage-desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  max-width: 720px;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .stage-desc {
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.stage-zoom-hint {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
}

/* Thumbnail Strip Slider */
.thumbnail-slider-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  width: 100%;
}

.thumbnail-scroll-container {
  display: flex;
  gap: 0.85rem;
  overflow-x: auto;
  padding: 0.5rem 0.25rem;
  scrollbar-width: none;
  width: 100%;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  scroll-behavior: smooth;
}

.thumbnail-scroll-container::-webkit-scrollbar {
  display: none;
}

.thumbnail-scroll-container:active {
  cursor: grabbing;
}

.thumbnail-card {
  flex: 0 0 140px;
  height: 90px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--shadow-sm);
  background-color: var(--bg-surface);
}

@media (max-width: 480px) {
  .thumbnail-card {
    flex: 0 0 100px;
    height: 70px;
  }
}

.thumbnail-card:hover {
  transform: translateY(-3px);
}

.thumbnail-card.active {
  border-color: var(--primary);
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 0 12px var(--primary-glow);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.thumbnail-card:hover .thumb-img {
  transform: scale(1.05);
}

.thumb-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
  opacity: 0.85;
}

.thumb-title {
  font-size: 0.65rem;
  font-weight: 750;
  color: white;
  text-align: left;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.thumb-nav-btn {
  background: var(--bg-surface-glass);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.thumb-nav-btn:hover {
  background: var(--primary);
  color: white;
  border-color: transparent;
  transform: scale(1.08);
}

/* Lightbox Modal */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(9, 13, 20, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .lightbox-overlay {
    padding: 1rem;
  }
}

.control-btn {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2002;
  font-family: var(--sans);
  font-size: 1.2rem;
  font-weight: 700;
}

.control-btn:hover {
  background: var(--primary);
  border-color: transparent;
  transform: scale(1.05);
}

.close-btn {
  top: 1.5rem;
  right: 1.5rem;
}

.nav-btn {
  top: 50%;
  transform: translateY(-50%);
}

.prev-btn {
  left: 1.5rem;
}

.next-btn {
  right: 1.5rem;
}

@media (max-width: 900px) {
  .nav-btn {
    display: none;
  }
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 850px;
  width: 100%;
  gap: 1.5rem;
  z-index: 2001;
}

.lightbox-img-wrapper {
  width: 100%;
  max-height: 60vh;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.lightbox-img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.lightbox-details {
  width: 100%;
  padding: 1.5rem;
  border-radius: 16px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(18, 24, 38, 0.7);
  text-align: left;
}

.details-top {
  display: flex;
  gap: 1rem;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary-light);
  margin-bottom: 0.5rem;
}

.detail-title {
  font-size: 1.4rem;
  font-weight: 850;
  color: white;
  margin-bottom: 0.5rem;
}

.detail-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

/* Zoom controls */
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.zoom-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: var(--sans);
}

.zoom-btn:hover:not(:disabled) {
  background-color: var(--primary);
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-factor {
  font-size: 0.85rem;
  font-weight: 700;
  min-width: 45px;
  text-align: center;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.gallery-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
  border-radius: 24px;
}

.state-text {
  font-size: 1rem;
  color: var(--text-muted);
  margin-top: 1rem;
  font-weight: 600;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(124, 58, 237, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-light);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
