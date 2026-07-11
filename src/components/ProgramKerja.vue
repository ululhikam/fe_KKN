<script setup>
import { ref, computed, onMounted } from 'vue'
import { kegiatanApi } from '../services/api.js'

const selectedCategory = ref('all')
const isLoading = ref(false)
const apiData = ref([])

const categories = [
  { id: 'all', label: 'Semua Program' },
  { id: 'ekonomi', label: 'Ekonomi & UMKM' },
  { id: 'pendidikan', label: 'Pendidikan & IT' },
  { id: 'kesehatan', label: 'Kesehatan & Sanitasi' },
  { id: 'lingkungan', label: 'Lingkungan & Sosial' },
  { id: 'sosial', label: 'Sosial Kemasyarakatan' },
]

// Status label mapping dari backend enum
const statusMap = {
  direncanakan: 'Direncanakan',
  berjalan: 'Berlangsung',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
}

const gridRef = ref(null)
const isGridDragging = ref(false)
const gridStartX = ref(0)
const gridScrollLeft = ref(0)

function startGridDrag(e) {
  if (window.innerWidth > 768) return
  isGridDragging.value = true
  gridStartX.value = e.pageX - gridRef.value.offsetLeft
  gridScrollLeft.value = gridRef.value.scrollLeft
}

function onGridDrag(e) {
  if (!isGridDragging.value) return
  e.preventDefault()
  const x = e.pageX - gridRef.value.offsetLeft
  const walk = (x - gridStartX.value) * 1.5
  gridRef.value.scrollLeft = gridScrollLeft.value - walk
}

function endGridDrag() {
  isGridDragging.value = false
}

const programs = computed(() => {
  return apiData.value.map(k => ({
    title: k.nama_kegiatan,
    category: k.kategori || 'umum',
    status: statusMap[k.status] || k.status,
    target: k.lokasi,
    desc: k.deskripsi || '',
  }))
})

const filteredPrograms = computed(() => {
  if (selectedCategory.value === 'all') return programs.value
  return programs.value.filter(p => p.category === selectedCategory.value)
})

function formatCategory(cat) {
  const map = {
    ekonomi: 'Ekonomi & UMKM',
    pendidikan: 'Pendidikan & IT',
    kesehatan: 'Kesehatan & Sanitasi',
    lingkungan: 'Lingkungan',
    sosial: 'Sosial',
    budaya: 'Budaya',
    infrastruktur: 'Infrastruktur',
    umum: 'Umum'
  }
  return map[cat] || cat.toUpperCase()
}

onMounted(async () => {
  isLoading.value = true
  try {
    const res = await kegiatanApi.getAll({ limit: 100, sort: 'tanggal_kegiatan', order: 'asc' })
    if (res && res.data) {
      apiData.value = res.data
    }
  } catch (e) {
    console.error('Error loading kegiatan:', e)
  } finally {
    isLoading.value = false
  }
})
</script>


<template>
  <section id="program-kerja" class="program-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="tag">Program Pengabdian</span>
        <h2>Program Kerja Unggulan</h2>
        <p>
          Rancangan program kerja nyata Kelompok 4 KKN yang terfokus pada kemajuan berkelanjutan Dusun Menggah, Desa Katekan.
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

      <!-- Loading & Empty States -->
      <div v-if="isLoading" class="state-container">
        <div class="loader-spinner"></div>
        <p class="state-text">Memuat data program kerja...</p>
      </div>

      <div v-else-if="filteredPrograms.length === 0" class="state-container">
        <p class="state-text">Tidak ada program kerja untuk kategori ini.</p>
      </div>

      <!-- Programs Grid -->
      <div 
        v-else
        ref="gridRef"
        class="grid grid-3 program-grid"
        @mousedown="startGridDrag"
        @mousemove="onGridDrag"
        @mouseup="endGridDrag"
        @mouseleave="endGridDrag"
      >
        <transition-group name="list" mode="out-in">
          <div 
            v-for="prog in filteredPrograms" 
            :key="prog.title"
            class="program-card glass"
          >
            <!-- Card Header -->
            <div class="prog-card-header">
              <span class="prog-category-badge">{{ formatCategory(prog.category) }}</span>
              <span 
                class="prog-status"
                :class="{
                  'status-done': prog.status === 'Selesai',
                  'status-active': prog.status === 'Berlangsung',
                  'status-planned': prog.status === 'Direncanakan'
                }"
              >
                {{ prog.status }}
              </span>
            </div>

            <!-- Card Body -->
            <div class="prog-card-body">
              <h3 class="prog-title">{{ prog.title }}</h3>
              <div class="prog-target-row">
                <span class="target-label">Sasaran:</span>
                <span class="target-val">{{ prog.target }}</span>
              </div>
              <p class="prog-desc">{{ prog.desc }}</p>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </section>
</template>

<style scoped>
.program-section {
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
  scrollbar-width: none;
}

.filter-list::-webkit-scrollbar {
  display: none;
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

/* Program Cards */
.program-card {
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: var(--bg-surface);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.prog-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.prog-category-badge {
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--primary);
  background-color: var(--primary-glow);
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.prog-status {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
}

.status-done {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-active {
  background-color: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-planned {
  background-color: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.prog-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
  text-align: left;
}

.prog-title {
  font-size: 1.2rem;
  font-weight: 850;
  line-height: 1.3;
  color: var(--text-main);
}

.prog-target-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.target-label {
  color: var(--primary-light);
}

.target-val {
  color: var(--text-main);
}

.prog-desc {
  font-size: 0.88rem;
  line-height: 1.6;
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

@media (max-width: 768px) {
  .program-grid {
    display: flex !important;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: 1.25rem;
    padding: 1rem 0.5rem;
    width: 100%;
    scrollbar-width: none;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
  }
  .program-grid::-webkit-scrollbar {
    display: none;
  }
  .program-grid:active {
    cursor: grabbing;
  }
  .program-card {
    flex: 0 0 285px;
    scroll-snap-align: start;
    height: auto;
  }
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  width: 100%;
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
