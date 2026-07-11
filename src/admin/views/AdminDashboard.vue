<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { kegiatanStore, beritaAcaraStore } from '../store'

const stats = ref({ total: 0, byStatus: {} })
const recent = ref([])
const recentBA = ref([])

const statusLabel = { direncanakan: 'Direncanakan', berjalan: 'Berjalan', selesai: 'Selesai', dibatalkan: 'Dibatalkan' }
const statusClass = { direncanakan: 'badge-info', berjalan: 'badge-warning', selesai: 'badge-success', dibatalkan: 'badge-danger' }

function formatDate(d) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  stats.value = await kegiatanStore.getStats()
  const baList = await beritaAcaraStore.getAll()
  stats.value.totalBA = baList.length
  stats.value.baDisetujui = baList.filter(b => b.status === 'disetujui').length
  recent.value = (await kegiatanStore.getAll()).slice(0, 5)
  recentBA.value = baList.slice(0, 4)
})
</script>

<template>
  <div class="dashboard-page">
    <!-- Top Stats (Mockup 6-card design) -->
    <div class="stats-grid">
      <!-- Green Card (Total Kegiatan) -->
      <div class="stat-card stat-green">
        <div class="stat-meta">
          <span class="stat-label">Total Kegiatan</span>
          <span class="stat-icon-dot"></span>
        </div>
        <div class="stat-num">{{ stats.total }}</div>
        <div class="stat-action-row">
          <span class="stat-action-btn">+</span>
          <router-link to="/admin/kegiatan" class="stat-link">Lihat Semua</router-link>
        </div>
      </div>

      <!-- Purple Card (Selesai) -->
      <div class="stat-card stat-purple">
        <div class="stat-meta">
          <span class="stat-label">Selesai</span>
          <span class="stat-icon-dot"></span>
        </div>
        <div class="stat-num">{{ stats.byStatus?.selesai || 0 }}</div>
        <div class="stat-action-row">
          <span class="stat-action-btn">+</span>
          <router-link to="/admin/kegiatan" class="stat-link">Lihat Semua</router-link>
        </div>
      </div>

      <!-- Orange Card (Sedang Berjalan) -->
      <div class="stat-card stat-orange">
        <div class="stat-meta">
          <span class="stat-label">Sedang Berjalan</span>
          <span class="stat-icon-dot"></span>
        </div>
        <div class="stat-num">{{ stats.byStatus?.berjalan || 0 }}</div>
        <div class="stat-action-row">
          <span class="stat-action-btn">+</span>
          <router-link to="/admin/kegiatan" class="stat-link">Lihat Semua</router-link>
        </div>
      </div>

      <!-- Blue Card (Berita Acara) -->
      <div class="stat-card stat-blue">
        <div class="stat-meta">
          <span class="stat-label">Berita Acara</span>
          <span class="stat-icon-dot"></span>
        </div>
        <div class="stat-num">{{ stats.totalBA || 0 }}</div>
        <div class="stat-action-row">
          <span class="stat-action-btn">+</span>
          <router-link to="/admin/berita-acara" class="stat-link">Lihat Semua</router-link>
        </div>
      </div>

      <!-- Dark Card (Anggota Kelompok) -->
      <div class="stat-card stat-dark">
        <div class="stat-meta">
          <span class="stat-label">Anggota Kelompok</span>
          <span class="stat-icon-dot"></span>
        </div>
        <div class="stat-num">12</div>
        <div class="stat-action-row">
          <span class="stat-action-btn">+</span>
          <router-link to="/admin/anggota" class="stat-link">Lihat Semua</router-link>
        </div>
      </div>

      <!-- White Card (Direncanakan) -->
      <div class="stat-card stat-white">
        <div class="stat-meta">
          <span class="stat-label">Direncanakan</span>
          <span class="stat-icon-dot"></span>
        </div>
        <div class="stat-num">{{ stats.byStatus?.direncanakan || 0 }}</div>
        <div class="stat-action-row">
          <span class="stat-action-btn">+</span>
          <router-link to="/admin/kegiatan" class="stat-link">Lihat Semua</router-link>
        </div>
      </div>
    </div>

    <!-- Main Content Split Layout -->
    <div class="dashboard-split">
      <!-- Left Column: Kegiatan Table -->
      <div class="section-card left-column">
        <div class="section-header">
          <h3>Kegiatan Terbaru</h3>
          <router-link to="/admin/kegiatan" class="view-all-text-link">Lihat Semua</router-link>
        </div>

        <div v-if="!recent.length" class="empty">
          <p>Belum ada kegiatan terdaftar.</p>
          <router-link to="/admin/kegiatan" class="empty-link">Tambah sekarang</router-link>
        </div>
        <div v-else class="table-responsive">
          <table>
            <thead>
              <tr><th>Kegiatan</th><th>Tanggal</th><th>Lokasi</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="k in recent" :key="k.id">
                <td><strong class="text-slate-800">{{ k.nama_kegiatan }}</strong></td>
                <td>{{ formatDate(k.tanggal_kegiatan) }}</td>
                <td>{{ k.lokasi }}</td>
                <td>
                  <span class="badge" :class="statusClass[k.status]">
                    <span class="badge-dot"></span>
                    {{ statusLabel[k.status] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Latest Events timeline -->
      <div class="section-card right-column">
        <div class="section-header">
          <h3>Log Berita Acara</h3>
          <router-link to="/admin/berita-acara" class="view-all-text-link">Buka</router-link>
        </div>

        <div v-if="!recentBA.length" class="empty">
          <p>Belum ada berita acara.</p>
        </div>
        <div v-else class="timeline">
          <div v-for="ba in recentBA" :key="ba.id" class="timeline-item">
            <div class="timeline-marker" :class="`marker-${ba.status}`"></div>
            <div class="timeline-content">
              <span class="timeline-time">{{ formatDate(ba.tanggal_ba) }}</span>
              <p class="timeline-title">{{ ba.judul }}</p>
              <div class="timeline-meta">
                <span class="timeline-user">{{ ba.dibuat_oleh?.name || 'Anggota' }}</span>
                <span class="timeline-status">{{ ba.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page { display: flex; flex-direction: column; gap: 2rem; }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; }
.stat-card {
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.15);
}

/* Card Themes */
.stat-green { background: #22c55e; color: #ffffff; }
.stat-purple { background: #8b5cf6; color: #ffffff; }
.stat-orange { background: #f97316; color: #ffffff; }
.stat-blue { background: #0ea5e9; color: #ffffff; }
.stat-dark { background: #1e293b; color: #ffffff; }
.stat-white { background: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; }

.stat-meta { display: flex; align-items: center; justify-content: space-between; }
.stat-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85; }
.stat-white .stat-label { opacity: 0.65; }
.stat-icon-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); }
.stat-white .stat-icon-dot { background: #7c3aed; }

.stat-num { font-size: 2.5rem; font-weight: 850; line-height: 1; letter-spacing: -0.02em; }

.stat-action-row { display: flex; align-items: center; gap: 0.5rem; }
.stat-action-btn {
  width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;
}
.stat-white .stat-action-btn { background: #f1f5f9; color: #475569; }
.stat-link { font-size: 0.78rem; font-weight: 700; color: #ffffff; text-decoration: none; opacity: 0.9; }
.stat-link:hover { opacity: 1; text-decoration: underline; }
.stat-white .stat-link { color: #475569; }

/* Layout Split */
.dashboard-split { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
@media (max-width: 1024px) {
  .dashboard-split { grid-template-columns: 1fr; }
}

.section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}
.section-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-header h3 { font-size: 0.95rem; font-weight: 850; color: #0f172a; letter-spacing: -0.01em; }
.view-all-text-link { font-size: 0.8rem; font-weight: 700; color: #7c3aed; text-decoration: none; }
.view-all-text-link:hover { text-decoration: underline; }

.empty { text-align: center; padding: 3rem 1.5rem; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.empty p { font-size: 0.875rem; }
.empty-link {
  color: #7c3aed;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  padding: 0.4rem 1rem;
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 8px;
  transition: all 0.2s ease;
}
.empty-link:hover { background: rgba(124, 58, 237, 0.12); }

/* Table styles */
.table-responsive { width: 100%; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
thead { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
th { padding: 0.85rem 1.5rem; text-align: left; font-size: 0.72rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; color: #475569; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f8fafc; }
.text-slate-800 { color: #0f172a; }

/* Timeline Events on the Right */
.timeline { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.timeline-item { display: flex; gap: 1rem; position: relative; }
.timeline-item::after {
  content: ''; position: absolute; left: 6px; top: 16px; bottom: -20px;
  width: 2px; background: #f1f5f9;
}
.timeline-item:last-child::after { display: none; }
.timeline-marker {
  width: 14px; height: 14px; border-radius: 50%;
  border: 3px solid #ffffff; background: #cbd5e1;
  position: relative; z-index: 2; margin-top: 3px;
  box-shadow: 0 0 0 1px #e2e8f0;
}
.marker-draft { background: #94a3b8; }
.marker-diajukan { background: #f59e0b; }
.marker-disetujui { background: #10b981; }
.marker-ditolak { background: #ef4444; }

.timeline-content { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
.timeline-time { font-size: 0.7rem; color: #94a3b8; font-weight: 700; }
.timeline-title { font-size: 0.82rem; font-weight: 750; color: #1e293b; margin: 0; line-height: 1.3; }
.timeline-meta { display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; margin-top: 0.15rem; }
.timeline-user { color: #64748b; font-weight: 600; }
.timeline-status { text-transform: uppercase; font-size: 0.65rem; font-weight: 800; color: #7c3aed; }

/* Badges */
.badge { display: inline-flex; align-items: center; padding: 0.25rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.badge-dot { width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; display: inline-block; background-color: currentColor; }
.badge-info { background: rgba(59, 130, 246, 0.08); color: #2563eb; }
.badge-warning { background: rgba(245, 158, 11, 0.08); color: #d97706; }
.badge-success { background: rgba(16, 185, 129, 0.08); color: #059669; }
.badge-danger { background: rgba(239, 68, 68, 0.08); color: #dc2626; }
</style>
