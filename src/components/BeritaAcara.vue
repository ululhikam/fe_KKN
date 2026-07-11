<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { beritaAcaraStore } from '../admin/store'
import { beritaAcaraApi } from '../services/api.js'

const isLoading = ref(false)
const items = ref([])
const activeBA = ref(null)
const showModal = ref(false)

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
  if (e.target.closest('button')) return
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
  items.value = beritaAcaraStore.getAll().filter(b => b.status === 'disetujui')
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

function openDetail(ba) {
  activeBA.value = ba
  showModal.value = true
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
                <div class="ba-card-header">
                  <span class="ba-number-tag">{{ ba.nomor_ba }}</span>
                  <span class="ba-date-tag">{{ formatDate(ba.tanggal_ba) }}</span>
                </div>

                <div class="ba-card-body">
                  <h3 class="ba-title">{{ ba.judul }}</h3>
                  <p class="ba-excerpt">{{ truncateText(ba.isi_kegiatan) }}</p>
                </div>

                <div class="ba-card-footer">
                  <button class="btn btn-secondary-text" @click="openDetail(ba)">
                    Baca Laporan Lengkap <span class="arrow-indicator">→</span>
                  </button>
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

    <!-- Lightbox Modal Detail -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showModal && activeBA" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-box glass">
            <!-- Header -->
            <div class="modal-header">
              <div>
                <span class="modal-number">{{ activeBA.nomor_ba }}</span>
                <h2>{{ activeBA.judul }}</h2>
                <div class="modal-meta-row">
                  <div class="meta-item">
                    <span class="meta-label">TANGGAL:</span>
                    <span class="meta-val">{{ formatDate(activeBA.tanggal_ba) }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">PELAPOR:</span>
                    <span class="meta-val">{{ activeBA.dibuat_oleh?.name || 'Sekretaris' }} ({{ activeBA.dibuat_oleh?.jabatan || 'Anggota' }})</span>
                  </div>
                </div>
              </div>
              <button class="close-btn" @click="showModal = false">✕</button>
            </div>

            <!-- Content -->
            <div class="modal-body">
              <!-- Section: Kronologi -->
              <div class="content-block">
                <h3>I. Jalannya Kegiatan & Kronologi</h3>
                <p class="content-text">{{ activeBA.isi_kegiatan }}</p>
              </div>

              <!-- Section: Hasil -->
              <div v-if="activeBA.hasil_kegiatan" class="content-block">
                <h3>II. Hasil & Output Kegiatan</h3>
                <p class="content-text">{{ activeBA.hasil_kegiatan }}</p>
              </div>

              <!-- Section: Catatan -->
              <div v-if="activeBA.catatan" class="content-block">
                <h3>III. Catatan Tambahan / Kendala</h3>
                <p class="content-text">{{ activeBA.catatan }}</p>
              </div>

              <!-- Section: Kehadiran Anggota -->
              <div v-if="activeBA.peserta_hadir && activeBA.peserta_hadir.length" class="content-block">
                <h3>IV. Daftar Hadir Anggota Kelompok</h3>
                <div class="attendance-badge-grid">
                  <div 
                    v-for="p in activeBA.peserta_hadir" 
                    :key="p.nim"
                    class="attendance-badge"
                  >
                    <span class="att-role">{{ p.jabatan }}</span>
                    <span class="att-name">{{ p.nama }}</span>
                  </div>
                </div>
              </div>

              <!-- Section: Pengesahan -->
              <div class="sign-block glass">
                <div class="sign-status-tag">TELAH DISAHKAN & DISETUJUI</div>
                <div class="sign-details">
                  <div class="sign-row">
                    <span class="sign-label">Disetujui Oleh:</span>
                    <strong class="sign-val">{{ activeBA.disetujui_oleh || 'Dr. Oktaviani Windra Puspita, M.Pd.' }}</strong>
                  </div>
                  <div class="sign-row">
                    <span class="sign-label">Jabatan:</span>
                    <span class="sign-val">Dosen Pembimbing Lapangan (DPL)</span>
                  </div>
                  <div class="sign-row">
                    <span class="sign-label">Tanggal Pengesahan:</span>
                    <span class="sign-val">{{ formatDate(activeBA.disetujui_at || activeBA.updated_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button class="btn btn-close-modal" @click="showModal = false">Tutup Laporan</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
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

.btn-secondary-text {
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
}

.btn-secondary-text:hover {
  color: var(--primary-light);
}

.arrow-indicator {
  transition: transform 0.2s ease;
}

.btn-secondary-text:hover .arrow-indicator {
  transform: translateX(4px);
}

/* Lightbox Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-box {
  width: 100%;
  max-width: 760px;
  max-height: 85vh;
  border-radius: 28px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popIn {
  from { transform: scale(0.95) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.modal-header {
  padding: 2rem 2.5rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  text-align: left;
}

.modal-number {
  font-family: var(--display);
  font-size: 0.75rem;
  font-weight: 850;
  color: var(--primary);
  background-color: var(--primary-glow);
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 850;
  line-height: 1.25;
  color: var(--text-main);
  margin-bottom: 0.75rem;
}

.modal-meta-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.meta-label {
  color: var(--primary-light);
}

.meta-val {
  color: var(--text-main);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
}

.close-btn:hover {
  color: #ef4444;
}

.modal-body {
  padding: 2.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: left;
}

@media (max-width: 640px) {
  .modal-header { padding: 1.5rem 1.5rem 1rem; }
  .modal-body { padding: 1.5rem; }
}

.content-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.content-block h3 {
  font-size: 1rem;
  font-weight: 850;
  color: var(--text-main);
  letter-spacing: 0.02em;
}

.content-text {
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--text-muted);
  white-space: pre-line;
}

/* Attendance Badge Grid */
.attendance-badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.6rem;
  margin-top: 0.25rem;
}

.attendance-badge {
  padding: 0.6rem 0.85rem;
  background-color: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.att-role {
  font-size: 0.62rem;
  font-weight: 850;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.att-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
  margin-top: 0.15rem;
}

/* Sign / Verification Block */
.sign-block {
  border-radius: 20px;
  padding: 1.5rem;
  background-color: rgba(34, 197, 94, 0.04) !important;
  border: 1px solid rgba(34, 197, 94, 0.25) !important;
}

.sign-status-tag {
  font-size: 0.68rem;
  font-weight: 850;
  color: #16a34a;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.sign-details {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sign-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

@media (max-width: 480px) {
  .sign-row {
    flex-direction: column;
    gap: 0.1rem;
  }
}

.sign-label {
  color: var(--text-muted);
  font-weight: 600;
}

.sign-val {
  color: var(--text-main);
  font-weight: 700;
}

.modal-footer {
  padding: 1.25rem 2.5rem 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .modal-footer { padding: 1rem 1.5rem 1.5rem; }
}

.btn-close-modal {
  background-color: var(--bg-base);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  font-weight: 750;
  font-size: 0.88rem;
  padding: 0.65rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-modal:hover {
  background-color: var(--border-color);
}

/* Modal Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
