<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { anggotaStore, Anggota } from '../store'

const items = ref<Anggota[]>([])
const isLoading = ref(false)
const search = ref('')
const selectedGroup = ref('all')

const colors = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b', 
  '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', 
  '#06b6d4', '#84cc16', '#a855f7', '#ef4444'
]

const getInit = (name: string) => {
  return (name || 'A').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function formatDivision(div?: string) {
  const map: Record<string, string> = {
    ketua: 'Ketua Kelompok',
    wakil_ketua: 'Wakil Ketua',
    sekretaris: 'Sekretaris',
    bendahara: 'Bendahara',
    humas: 'Divisi Humas',
    acara: 'Divisi Acara',
    pdd: 'Divisi PDD (Publikasi, Dokumentasi, Desain)'
  }
  return map[div || ''] || 'Anggota'
}

async function load() {
  isLoading.value = true
  try {
    items.value = await anggotaStore.getAll()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const filtered = computed(() => {
  return items.value.filter(a => {
    const matchSearch = !search.value || 
      a.name.toLowerCase().includes(search.value.toLowerCase()) ||
      (a.nim || '').toLowerCase().includes(search.value.toLowerCase()) ||
      (a.prodi || '').toLowerCase().includes(search.value.toLowerCase())
    return matchSearch
  })
})

// Classify/Group members by their division category
const groupedMembers = computed(() => {
  const groupsMap: Record<string, Anggota[]> = {
    'Badan Pengurus Harian (BPH)': [],
    'Divisi Hubungan Masyarakat (Humas)': [],
    'Divisi Acara': [],
    'Divisi Publikasi, Dokumentasi & Desain (PDD)': [],
    'Lainnya': []
  }

  filtered.value.forEach(a => {
    const div = a.division || ''
    if (['ketua', 'wakil_ketua', 'sekretaris', 'bendahara'].includes(div)) {
      groupsMap['Badan Pengurus Harian (BPH)'].push(a)
    } else if (div === 'humas') {
      groupsMap['Divisi Hubungan Masyarakat (Humas)'].push(a)
    } else if (div === 'acara') {
      groupsMap['Divisi Acara'].push(a)
    } else if (div === 'pdd') {
      groupsMap['Divisi Publikasi, Dokumentasi & Desain (PDD)'].push(a)
    } else {
      groupsMap['Lainnya'].push(a)
    }
  })

  return Object.entries(groupsMap)
    .filter(([_, list]) => list.length > 0)
    .map(([name, list]) => ({ name, list }))
})

onMounted(load)
</script>

<template>
  <div class="anggota-page">
    <div class="page-header">
      <div>
        <h2>Anggota Kelompok</h2>
        <p>Kelola dan lihat klasifikasi anggota KKN berdasarkan divisi kerja masing-masing</p>
      </div>
    </div>

    <!-- Toolbar Filters -->
    <div class="filter-bar">
      <input 
        v-model="search" 
        type="search" 
        placeholder="Cari nama, NIM, atau program studi..." 
        class="input-field" 
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loader-spinner"></div>
      <p>Memuat data anggota kelompok...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filtered.length === 0" class="empty-state">
      <p>Tidak ada anggota kelompok yang cocok dengan pencarian.</p>
    </div>

    <!-- Grouped Classifications -->
    <div v-else class="groups-container">
      <div v-for="group in groupedMembers" :key="group.name" class="group-section">
        <h3 class="group-title">{{ group.name }}</h3>
        
        <div class="anggota-grid">
          <div v-for="(a, i) in group.list" :key="a.id" class="anggota-card">
            <div 
              class="card-avatar" 
              :style="{ background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 4) % colors.length]})` }"
            >
              {{ getInit(a.name) }}
            </div>
            <div class="card-jabatan">{{ formatDivision(a.division) }}</div>
            <div class="card-name">{{ a.name }}</div>
            <div class="card-prodi">{{ a.prodi || '–' }}</div>
            <div class="card-nim">{{ a.nim || '–' }}</div>
            <span class="card-badge" :class="a.role === 'admin' ? 'badge-admin' : 'badge-member'">
              {{ a.role === 'admin' ? 'Admin' : 'Anggota' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.anggota-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header h2 { 
  font-size: 1.65rem; 
  font-weight: 800; 
  color: #0f172a; 
  letter-spacing: -0.02em; 
}
.page-header p { 
  font-size: 0.875rem; 
  color: #64748b; 
  margin-top: 0.25rem; 
}

.filter-bar {
  display: flex;
  gap: 0.75rem;
  max-width: 480px;
}

.input-field { 
  background: #ffffff; 
  border: 1px solid #cbd5e1; 
  border-radius: 10px; 
  padding: 0.65rem 1rem; 
  color: #0f172a; 
  font-size: 0.875rem; 
  font-family: inherit; 
  width: 100%; 
  transition: all 0.2s ease; 
}
.input-field:focus { 
  outline: none; 
  border-color: #7c3aed; 
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15); 
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  font-size: 0.875rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loader-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(124, 58, 237, 0.1);
  border-radius: 50%;
  border-top-color: #7c3aed;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.group-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.group-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.anggota-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
  gap: 1.25rem; 
}

.anggota-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.anggota-card:hover {
  transform: translateY(-4px);
  border-color: #cbd5e1;
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.card-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-jabatan { 
  font-size: 0.7rem; 
  font-weight: 800; 
  color: #7c3aed; 
  text-transform: uppercase; 
  letter-spacing: 0.06em; 
}

.card-name { 
  font-size: 0.95rem; 
  font-weight: 800; 
  color: #0f172a; 
  margin-top: 0.15rem; 
}

.card-prodi { 
  font-size: 0.78rem; 
  color: #64748b; 
  font-weight: 500; 
}

.card-nim { 
  font-size: 0.72rem; 
  color: #94a3b8; 
  font-family: monospace; 
}

.card-badge {
  margin-top: 0.5rem;
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge-admin { 
  background: rgba(124, 58, 237, 0.06); 
  color: #7c3aed; 
  border: 1px solid rgba(124, 58, 237, 0.15); 
}
.badge-member { 
  background: #f1f5f9; 
  color: #64748b; 
  border: 1px solid #e2e8f0; 
}

@media (max-width: 480px) { 
  .anggota-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 0.75rem; 
  } 
}
</style>
