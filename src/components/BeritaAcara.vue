<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { beritaAcaraStore } from '../admin/store'
import { beritaAcaraApi } from '../services/api.js'

const isLoading = ref(false)
const items = ref([])

const gridRef = ref(null)
const currentIndex = ref(0)
const windowWidth = ref(window.innerWidth)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const visibleCards = computed(() => {
  if (windowWidth.value < 640) return 1
  if (windowWidth.value < 1024) return 2
  return 3
})

const maxIndex = computed(() => {
  return Math.max(0, items.value.length - visibleCards.value)
})

function next() {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = maxIndex.value
  }
}

const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const dragOffset = ref(0)

function startDrag(e) {
  if (e.target.closest('a')) return
  isDragging.value = true
  startX.value = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
  currentX.value = startX.value
  dragOffset.value = 0
}

function onDrag(e) {
  if (!isDragging.value) return
  currentX.value = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
  dragOffset.value = currentX.value - startX.value
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  
  const threshold = 100
  if (dragOffset.value < -threshold && currentIndex.value < maxIndex.value) {
    currentIndex.value++
  } else if (dragOffset.value > threshold && currentIndex.value > 0) {
    currentIndex.value--
  }
  dragOffset.value = 0
}

const trackStyle = computed(() => {
  const baseOffset = -currentIndex.value * (100 / visibleCards.value)
  const dragPercent = gridRef.value ? (dragOffset.value / gridRef.value.clientWidth) * 100 : 0
  return {
    transform: `translateX(${baseOffset + dragPercent}%)`,
    transition: isDragging.value ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
})

async function load() {
  isLoading.value = true
  try {
    const res = await beritaAcaraApi.getAll()
    if (res.data && res.data.length > 0) {
      items.value = res.data.filter(b => b.status === 'disetujui')
      isLoading.value = false
      return
    }
  } catch (e) {
    // API offline
  }

  // Fallback to local storage store (seeded automatically)
  items.value = (await beritaAcaraStore.getAll()).filter(b => b.status === 'disetujui')
  isLoading.value = false
}

function formatDate(d) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function truncateText(str, len = 120) {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '...' : str
}

onMounted(load)
</script>

<template>
  <section id="berita-acara" class="ba-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header animate-fade-up">
        <span class="tag">DOKUMENTASI KKN</span>
        <h2>BERITA ACARA RESMI</h2>
        <p>
          Catatan resmi jalannya kegiatan, hasil capaian, dan daftar kehadiran anggota kelompok KKN UST di setiap program kerja yang telah diselesaikan.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state glass">
        <p>Memuat dokumen berita acara...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!items.length" class="empty-state glass">
        <p>Belum ada berita acara resmi yang dipublikasikan.</p>
      </div>

      <!-- Carousel Slider container -->
      <div v-else class="ba-carousel-outer">
        <button class="nav-arrow prev-arrow" @click.stop="prev" aria-label="Previous slide">
          ‹
        </button>

        <div class="ba-carousel-viewport">
          <div 
            ref="gridRef"
            class="ba-carousel-track"
            :style="trackStyle"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @touchstart="startDrag"
            @touchmove="onDrag"
            @touchend="endDrag"
          >
            <div 
              v-for="ba in items" 
              :key="ba.id" 
              class="ba-carousel-card-wrapper"
            >
              <div class="ba-card glass">
                <div v-if="ba.foto_urls && ba.foto_urls.length" class="ba-card-cover">
                  <img :src="ba.foto_urls[0]" :alt="ba.judul" loading="lazy" />
                  <span v-if="ba.foto_urls.length > 1" class="ba-photo-count">+{{ ba.foto_urls.length - 1 }} foto</span>
                </div>

                <div class="ba-card-header">
                  <span class="ba-number-tag">{{ ba.nomor_ba }}</span>
                  <span class="ba-date-tag">{{ formatDate(ba.tanggal_ba) }}</span>
                </div>

                <div class="ba-card-body">
                  <h3 class="ba-title">{{ ba.judul }}</h3>
                  <p class="ba-excerpt">{{ truncateText(ba.isi_kegiatan) }}</p>
                </div>

                <div class="ba-card-footer">
                  <router-link :to="`/berita-acara/${ba.id}`" class="btn-read-more">
                    Baca Laporan Lengkap <span class="arrow-indicator">→</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="nav-arrow next-arrow" @click.stop="next" aria-label="Next slide">
          ›
        </button>

        <!-- Pagination indicators -->
        <div class="ba-pagination">
          <span 
            v-for="idx in maxIndex + 1" 
            :key="idx" 
            class="ba-dot" 
            :class="{ active: currentIndex === idx - 1 }"
            @click="currentIndex = idx - 1"
          ></span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ba-section {
  background-color: var(--bg-base);
  position: relative;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 24px;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.95rem;
}

.ba-carousel-outer {
  position: relative;
  width: 100%;
  margin-top: 2rem;
}

.ba-carousel-viewport {
  width: 100%;
  overflow: hidden;
  padding: 1rem 0;
}

.ba-carousel-track {
  display: flex;
  width: 100%;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.ba-carousel-track:active {
  cursor: grabbing;
}

.ba-carousel-card-wrapper {
  flex: 0 0 33.333%;
  padding: 0 0.75rem;
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .ba-carousel-card-wrapper {
    flex: 0 0 50%;
  }
}

@media (max-width: 640px) {
  .ba-carousel-card-wrapper {
    flex: 0 0 100%;
  }
}

.ba-card {
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, border-color 0.3s ease;
  background-color: var(--bg-surface);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ba-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
}

.ba-card-cover {
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.ba-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.ba-card:hover .ba-card-cover img {
  transform: scale(1.05);
}

.ba-photo-count {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
}

/* Nav arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-surface-glass);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  font-size: 1.5rem;
  line-height: 1;
}

.nav-arrow:hover {
  background: var(--primary);
  color: white;
  border-color: transparent;
  transform: translateY(-50%) scale(1.08);
}

.prev-arrow {
  left: -22px;
}

.next-arrow {
  right: -22px;
}

@media (max-width: 768px) {
  .nav-arrow {
    display: none;
  }
}

/* Pagination */
.ba-pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.ba-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  cursor: pointer;
  transition: all 0.2s;
}

.ba-dot.active {
  background: var(--primary);
  width: 24px;
  border-radius: 4px;
}

.ba-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.ba-number-tag {
  font-family: var(--display);
  font-size: 0.72rem;
  font-weight: 850;
  color: var(--primary);
  background-color: var(--primary-glow);
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
}

.ba-date-tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}

.ba-card-body {
  flex-grow: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.ba-title {
  font-size: 1.15rem;
  font-weight: 850;
  line-height: 1.35;
  color: var(--text-main);
}

.ba-excerpt {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.ba-card-footer {
  text-align: left;
}

.btn-read-more {
  background: transparent;
  border: none;
  padding: 0;
  color: var(--primary);
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.btn-read-more:hover {
  color: var(--primary-light);
}

.arrow-indicator {
  transition: transform 0.2s ease;
}

.btn-read-more:hover .arrow-indicator {
  transform: translateX(4px);
}
</style>
