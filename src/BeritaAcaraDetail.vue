<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { beritaAcaraApi } from './services/api.js'
import { beritaAcaraStore } from './admin/store'

const route = useRoute()
const router = useRouter()

const ba = ref(null)
const isLoading = ref(true)
const hasError = ref(false)

const activeSection = ref('')

function formatDate(d) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDay(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { weekday: 'long' })
}

const readingTime = computed(() => {
  if (!ba.value) return '1 menit'
  const text = [ba.value.isi_kegiatan, ba.value.hasil_kegiatan, ba.value.catatan].filter(Boolean).join(' ')
  const words = text.split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} menit`
})

const truncatedTitle = computed(() => {
  if (!ba.value) return ''
  return ba.value.judul.length > 40 ? ba.value.judul.substring(0, 40) + '…' : ba.value.judul
})

async function loadDetail() {
  isLoading.value = true
  hasError.value = false
  const id = route.params.id

  try {
    const res = await beritaAcaraApi.getById(id)
    if (res.data) {
      ba.value = res.data
      isLoading.value = false
      return
    }
  } catch (e) {
    // API offline, try local store
  }

  try {
    const allItems = await beritaAcaraStore.getAll()
    const found = allItems.find(item => item.id === id)
    if (found) {
      ba.value = found
    } else {
      hasError.value = true
    }
  } catch {
    hasError.value = true
  }

  isLoading.value = false
}

const showLightbox = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index) {
  lightboxIndex.value = index
  showLightbox.value = true
}

function nextLightbox() {
  if (ba.value?.foto_urls) {
    lightboxIndex.value = (lightboxIndex.value + 1) % ba.value.foto_urls.length
  }
}

function prevLightbox() {
  if (ba.value?.foto_urls) {
    lightboxIndex.value = (lightboxIndex.value - 1 + ba.value.foto_urls.length) % ba.value.foto_urls.length
  }
}

function goBack() {
  router.push('/#berita-acara')
}

function printBA() {
  window.print()
}

onMounted(loadDetail)
</script>

<template>
  <div class="detail-page-layout">
    <Navbar :active-section="activeSection" />

    <!-- Loading State -->
    <div v-if="isLoading" class="detail-loading-screen">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">Memuat dokumen berita acara…</p>
      </div>
    </div>

    <!-- Error / Not Found -->
    <div v-else-if="hasError || !ba" class="detail-error-screen">
      <div class="error-content glass">
        <div class="error-icon"></div>
        <h2>Dokumen Tidak Ditemukan</h2>
        <p>Berita acara yang Anda cari tidak tersedia atau telah dihapus.</p>
        <button class="btn btn-primary" @click="goBack">
          ← Kembali ke Beranda
        </button>
      </div>
    </div>

    <!-- Detail Content -->
    <template v-else>
      <!-- Hero Header -->
      <section class="detail-hero" :class="{ 'has-cover': ba.foto_urls && ba.foto_urls.length }">
        <div class="hero-bg-pattern"></div>
        <div class="container hero-grid">
          <div class="hero-left-content">
            <!-- Breadcrumb -->
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <router-link to="/" class="breadcrumb-link">Beranda</router-link>
              <span class="breadcrumb-sep">›</span>
              <router-link to="/#berita-acara" class="breadcrumb-link">Berita Acara</router-link>
              <span class="breadcrumb-sep">›</span>
              <span class="breadcrumb-current">{{ truncatedTitle }}</span>
            </nav>

            <!-- Hero Content -->
            <div class="hero-meta-tags">
              <span class="hero-tag hero-tag-number">{{ ba.nomor_ba }}</span>
              <span class="hero-tag hero-tag-status">
                <span class="status-dot"></span>
                DISAHKAN
              </span>
            </div>

            <h1 class="hero-title">{{ ba.judul }}</h1>

            <div class="hero-meta-bar">
              <div class="meta-chip">
                <span class="meta-chip-icon"></span>
                <span>{{ formatDay(ba.tanggal_ba) }}, {{ formatDate(ba.tanggal_ba) }}</span>
              </div>
              <div class="meta-chip">
                <span class="meta-chip-icon"></span>
                <span>{{ ba.dibuat_oleh?.name || 'Sekretaris' }}</span>
              </div>
              <div class="meta-chip">
                <span class="meta-chip-icon"></span>
                <span>{{ readingTime }} baca</span>
              </div>
            </div>
          </div>

          <div v-if="ba.foto_urls && ba.foto_urls.length" class="hero-right-cover animate-fade-up">
            <div class="hero-cover-wrapper glass">
              <img :src="ba.foto_urls[0]" :alt="ba.judul" />
              <div class="hero-cover-badge">Dokumentasi Utama</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Area -->
      <section class="detail-body">
        <div class="container detail-grid">
          <!-- Article Content -->
          <article class="detail-article">
            <!-- Section I -->
            <div class="article-section animate-fade-up">
              <div class="section-number-badge">I</div>
              <h2 class="article-section-title">Jalannya Kegiatan & Kronologi</h2>
              <div class="article-divider"></div>
              <p class="article-text">{{ ba.isi_kegiatan }}</p>
            </div>

            <!-- Section II -->
            <div v-if="ba.hasil_kegiatan" class="article-section animate-fade-up">
              <div class="section-number-badge">II</div>
              <h2 class="article-section-title">Hasil & Output Kegiatan</h2>
              <div class="article-divider"></div>
              <p class="article-text">{{ ba.hasil_kegiatan }}</p>
            </div>

            <!-- Section III -->
            <div v-if="ba.catatan" class="article-section animate-fade-up">
              <div class="section-number-badge">III</div>
              <h2 class="article-section-title">Catatan Tambahan / Kendala</h2>
              <div class="article-divider"></div>
              <p class="article-text">{{ ba.catatan }}</p>
            </div>

            <!-- Section: Foto Dokumentasi Kegiatan -->
            <div v-if="ba.foto_urls && ba.foto_urls.length" class="article-section animate-fade-up">
              <div class="section-number-badge"></div>
              <h2 class="article-section-title">Dokumentasi Kegiatan</h2>
              <div class="article-divider"></div>
              <div class="detail-gallery-grid">
                <div 
                  v-for="(url, idx) in ba.foto_urls" 
                  :key="idx"
                  class="detail-gallery-card glass"
                  @click="openLightbox(idx)"
                >
                  <img :src="url" :alt="`Dokumentasi ${idx + 1}`" loading="lazy" />
                  <div class="detail-gallery-overlay">
                    <span class="zoom-icon"></span>
                    <span class="zoom-text">Perbesar</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section IV: Attendance -->
            <div v-if="ba.peserta_hadir && ba.peserta_hadir.length" class="article-section animate-fade-up">
              <div class="section-number-badge">IV</div>
              <h2 class="article-section-title">Daftar Hadir Anggota Kelompok</h2>
              <div class="article-divider"></div>
              <div class="attendance-grid">
                <div 
                  v-for="(p, idx) in ba.peserta_hadir" 
                  :key="p.nim"
                  class="attendance-card glass"
                  :style="{ animationDelay: `${idx * 0.05}s` }"
                >
                  <div class="att-avatar">{{ p.nama?.charAt(0)?.toUpperCase() || '?' }}</div>
                  <div class="att-info">
                    <span class="att-card-name">{{ p.nama }}</span>
                    <span class="att-card-role">{{ p.jabatan || 'Anggota' }}</span>
                  </div>
                  <span class="att-check">✓</span>
                </div>
              </div>
              <div class="attendance-summary">
                <span class="att-sum-count">{{ ba.peserta_hadir.length }}</span>
                <span class="att-sum-label">anggota hadir</span>
              </div>
            </div>

            <!-- Section V: Approval Block -->
            <div class="article-section animate-fade-up">
              <div class="approval-block">
                <div class="approval-header">
                  <div class="approval-stamp">
                    <span class="stamp-icon">✓</span>
                  </div>
                  <div>
                    <h3 class="approval-title">TELAH DISAHKAN & DISETUJUI</h3>
                    <p class="approval-subtitle">Dokumen ini telah diverifikasi dan disahkan secara resmi</p>
                  </div>
                </div>
                <div class="approval-details">
                  <div class="approval-row">
                    <span class="approval-label">Disetujui Oleh</span>
                    <strong class="approval-value">{{ ba.disetujui_oleh || 'Dr. Oktaviani Windra Puspita, M.Pd.' }}</strong>
                  </div>
                  <div class="approval-row">
                    <span class="approval-label">Jabatan</span>
                    <span class="approval-value">Dosen Pembimbing Lapangan (DPL)</span>
                  </div>
                  <div class="approval-row">
                    <span class="approval-label">Tanggal Pengesahan</span>
                    <span class="approval-value">{{ formatDate(ba.disetujui_at || ba.updated_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Back Button -->
            <div class="article-back-row">
              <button class="btn btn-secondary btn-back" @click="goBack">
                ← Kembali ke Halaman Utama
              </button>
            </div>
          </article>

          <!-- Sidebar -->
          <aside class="detail-sidebar">
            <div class="sidebar-card glass">
              <h4 class="sidebar-card-title">Info Dokumen</h4>
              <div class="sidebar-info-list">
                <div class="sidebar-info-item">
                  <span class="sidebar-info-label">Nomor BA</span>
                  <span class="sidebar-info-value">{{ ba.nomor_ba }}</span>
                </div>
                <div class="sidebar-info-item">
                  <span class="sidebar-info-label">Tanggal</span>
                  <span class="sidebar-info-value">{{ formatDate(ba.tanggal_ba) }}</span>
                </div>
                <div class="sidebar-info-item">
                  <span class="sidebar-info-label">Pelapor</span>
                  <span class="sidebar-info-value">{{ ba.dibuat_oleh?.name || 'Sekretaris' }}</span>
                </div>
                <div class="sidebar-info-item">
                  <span class="sidebar-info-label">Jabatan</span>
                  <span class="sidebar-info-value">{{ ba.dibuat_oleh?.jabatan || 'Anggota' }}</span>
                </div>
                <div class="sidebar-info-item">
                  <span class="sidebar-info-label">Jumlah Hadir</span>
                  <span class="sidebar-info-value">{{ ba.peserta_hadir?.length || ba.jumlah_peserta || '–' }} orang</span>
                </div>
                <div class="sidebar-info-item">
                  <span class="sidebar-info-label">Status</span>
                  <span class="sidebar-info-value sidebar-status-approved">Disetujui</span>
                </div>
                <div class="sidebar-info-item">
                  <span class="sidebar-info-label">Waktu Baca</span>
                  <span class="sidebar-info-value">± {{ readingTime }}</span>
                </div>
              </div>
            </div>

            <!-- Action Card -->
            <div class="sidebar-card glass sidebar-actions-card">
              <h4 class="sidebar-card-title">Aksi Laporan</h4>
              <button class="btn btn-primary btn-full-width" @click="printBA">
                <span class="btn-icon"></span>
                Cetak Berita Acara
              </button>
              <p class="sidebar-action-note">Cetak dokumen berita acara resmi ini sebagai arsip atau dokumen fisik KKN.</p>
            </div>

            <!-- Quick Nav -->
            <div class="sidebar-card glass sidebar-nav-card">
              <h4 class="sidebar-card-title">Navigasi Cepat</h4>
              <div class="sidebar-nav-links">
                <a href="#" @click.prevent="goBack" class="sidebar-nav-link">
                  <span class="sidebar-nav-icon">←</span>
                  Kembali ke Beranda
                </a>
                <router-link to="/#program-kerja" class="sidebar-nav-link">
                  <span class="sidebar-nav-icon"></span>
                  Program Kerja
                </router-link>
                <router-link to="/#galeri" class="sidebar-nav-link">
                  <span class="sidebar-nav-icon"></span>
                  Galeri KKN
                </router-link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </template>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showLightbox && ba && ba.foto_urls" class="lightbox-overlay" @click.self="showLightbox = false">
          <button class="lightbox-close" @click="showLightbox = false">✕</button>
          
          <button v-if="ba.foto_urls.length > 1" class="lightbox-arrow lightbox-arrow-prev" @click="prevLightbox">‹</button>
          
          <div class="lightbox-content">
            <img :src="ba.foto_urls[lightboxIndex]" alt="Dokumentasi Full" />
            <p class="lightbox-caption">Foto {{ lightboxIndex + 1 }} dari {{ ba.foto_urls.length }}</p>
          </div>
          
          <button v-if="ba.foto_urls.length > 1" class="lightbox-arrow lightbox-arrow-next" @click="nextLightbox">›</button>
        </div>
      </transition>
    </Teleport>

    <Footer />
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════
   DETAIL PAGE LAYOUT
   ═══════════════════════════════════════════════════════════════ */
.detail-page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ── LOADING STATE ─────────────────────────────────────────── */
.detail-loading-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding-top: 80px;
}

.loading-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* ── ERROR STATE ───────────────────────────────────────────── */
.detail-error-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  padding-top: 80px;
}

.error-content {
  text-align: center;
  padding: 4rem 3rem;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 3.5rem;
  opacity: 0.6;
}

.error-content h2 {
  font-size: 1.5rem;
  font-weight: 850;
}

.error-content p {
  font-size: 0.95rem;
  line-height: 1.6;
}

/* ═══════════════════════════════════════════════════════════════
   HERO HEADER
   ═══════════════════════════════════════════════════════════════ */
.detail-hero {
  position: relative;
  padding: 9rem 0 5rem;
  background: linear-gradient(
    160deg,
    var(--bg-base) 0%,
    rgba(21, 128, 61, 0.05) 30%,
    rgba(34, 197, 94, 0.08) 60%,
    var(--bg-base) 100%
  );
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
}

[data-theme="dark"] .detail-hero {
  background: linear-gradient(
    160deg,
    var(--bg-base) 0%,
    rgba(21, 128, 61, 0.08) 30%,
    rgba(34, 197, 94, 0.04) 60%,
    var(--bg-base) 100%
  );
}

.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 10% 90%, rgba(21, 128, 61, 0.05) 0%, transparent 60%),
    radial-gradient(circle at 90% 10%, rgba(34, 197, 94, 0.07) 0%, transparent 60%);
  pointer-events: none;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 992px) {
  .hero-grid {
    grid-template-columns: 1.2fr 0.8fr;
  }
}

.hero-left-content {
  position: relative;
  z-index: 2;
  text-align: left;
}

.hero-right-cover {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-cover-wrapper {
  position: relative;
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  aspect-ratio: 4/3;
  box-shadow: var(--shadow-lg), 0 20px 40px rgba(21, 128, 61, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-theme="dark"] .hero-cover-wrapper {
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: var(--shadow-lg), 0 20px 40px rgba(0, 0, 0, 0.4);
}

.hero-cover-wrapper:hover {
  transform: translateY(-6px) scale(1.02);
}

.hero-cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-cover-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 10px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.82rem;
  font-weight: 600;
  flex-wrap: wrap;
}

.breadcrumb-link {
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--primary);
}

.breadcrumb-sep {
  color: var(--border-color);
  font-size: 1rem;
}

.breadcrumb-current {
  color: var(--primary);
  font-weight: 700;
}

/* Hero Tags */
.hero-meta-tags {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.hero-tag {
  font-family: var(--display);
  font-size: 0.72rem;
  font-weight: 850;
  padding: 0.4rem 0.85rem;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  letter-spacing: 0.03em;
}

.hero-tag-number {
  color: var(--primary);
  background: var(--primary-glow);
  border: 1px solid rgba(21, 128, 61, 0.15);
}

.hero-tag-status {
  color: #16a34a;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #16a34a;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

/* Hero Title */
.hero-title {
  font-size: 2.75rem;
  font-weight: 850;
  line-height: 1.15;
  margin-bottom: 1.75rem;
  letter-spacing: -0.02em;
  max-width: 800px;
}

/* Hero Meta Bar */
.hero-meta-bar {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.meta-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
}

.meta-chip-icon {
  font-size: 0.9rem;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CONTENT BODY
   ═══════════════════════════════════════════════════════════════ */
.detail-body {
  padding: 4rem 0 6rem;
  background: var(--bg-base);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 3rem;
  align-items: start;
}

/* ── ARTICLE ───────────────────────────────────────────────── */
.detail-article {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.article-section {
  position: relative;
  padding: 2.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  transition: all 0.3s ease;
}

.article-section:hover {
  border-color: rgba(21, 128, 61, 0.2);
  box-shadow: 0 8px 32px rgba(21, 128, 61, 0.06);
}

.section-number-badge {
  position: absolute;
  top: -14px;
  left: 2rem;
  width: 28px;
  height: 28px;
  background: var(--primary);
  color: white;
  font-family: var(--display);
  font-size: 0.72rem;
  font-weight: 850;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25);
}

.article-section-title {
  font-size: 1.25rem;
  font-weight: 850;
  color: var(--text-main);
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.article-divider {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
  border-radius: 99px;
  margin-bottom: 1.25rem;
}

.article-text {
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--text-muted);
  white-space: pre-line;
}

/* ── ATTENDANCE GRID ───────────────────────────────────────── */
.attendance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}

.attendance-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  opacity: 0;
}

.att-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  font-family: var(--display);
  font-weight: 850;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.att-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.att-card-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.att-card-role {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.att-check {
  font-size: 0.72rem;
  font-weight: 850;
  color: #16a34a;
  background: rgba(34, 197, 94, 0.1);
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.attendance-summary {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.att-sum-count {
  font-family: var(--display);
  font-size: 1.75rem;
  font-weight: 850;
  color: var(--primary);
}

.att-sum-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* ── APPROVAL BLOCK ────────────────────────────────────────── */
.approval-block {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.04), rgba(21, 128, 61, 0.06));
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.approval-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.approval-stamp {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3);
}

.stamp-icon {
  font-size: 1.25rem;
  font-weight: 850;
}

.approval-title {
  font-size: 0.82rem;
  font-weight: 850;
  color: #16a34a;
  letter-spacing: 0.06em;
  margin-bottom: 0.15rem;
}

.approval-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
}

.approval-details {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.approval-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(34, 197, 94, 0.1);
  font-size: 0.85rem;
}

.approval-row:last-child {
  border-bottom: none;
}

.approval-label {
  color: var(--text-muted);
  font-weight: 600;
}

.approval-value {
  color: var(--text-main);
  font-weight: 700;
  text-align: right;
}

/* ── BACK BUTTON ROW ──────────────────────────────────────── */
.article-back-row {
  display: flex;
}

.btn-back {
  border-radius: 14px;
  font-weight: 750;
  gap: 0.5rem;
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════════════ */
.detail-sidebar {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  padding: 1.75rem;
  border-radius: 20px;
}

.sidebar-card-title {
  font-size: 0.82rem;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  margin-bottom: 1.25rem;
}

.sidebar-info-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.sidebar-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sidebar-info-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.sidebar-info-value {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
}

.sidebar-status-approved {
  color: #16a34a;
  background: rgba(34, 197, 94, 0.1);
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  font-size: 0.75rem;
  display: inline-block;
  width: fit-content;
}

/* Sidebar Nav */
.sidebar-nav-card {
  background: var(--bg-surface) !important;
}

.sidebar-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.sidebar-nav-link:hover {
  background: var(--primary-glow);
  color: var(--primary);
  transform: translateX(4px);
}

.sidebar-nav-icon {
  font-size: 0.9rem;
  width: 20px;
  text-align: center;
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .sidebar-card {
    flex: 1;
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .detail-hero {
    padding: 7rem 0 3rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .article-section {
    padding: 1.75rem;
  }

  .detail-body {
    padding: 2.5rem 0 4rem;
  }

  .detail-sidebar {
    flex-direction: column;
  }

  .sidebar-card {
    min-width: unset;
  }

  .approval-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
  }

  .approval-value {
    text-align: left;
  }

  .attendance-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.65rem;
  }

  .hero-meta-bar {
    flex-direction: column;
    gap: 0.5rem;
  }

  .meta-chip {
    width: fit-content;
  }

  .article-section {
    padding: 1.25rem;
    border-radius: 18px;
  }

  .section-number-badge {
    left: 1.25rem;
  }
}

/* ── GALLERY ────────────────────────────────────────────────── */
.detail-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.detail-gallery-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.detail-gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.detail-gallery-card:hover img {
  transform: scale(1.06);
}

.detail-gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detail-gallery-card:hover .detail-gallery-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 1.5rem;
}

.zoom-text {
  font-size: 0.72rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── LIGHTBOX ───────────────────────────────────────────────── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 13, 0.95);
  backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s;
}

.lightbox-close:hover {
  transform: scale(1.1);
}

.lightbox-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: all 0.2s;
}

.lightbox-arrow:hover {
  background: var(--primary);
  border-color: transparent;
  transform: translateY(-50%) scale(1.05);
}

.lightbox-arrow-prev {
  left: 2rem;
}

.lightbox-arrow-next {
  right: 2rem;
}

.lightbox-content {
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.lightbox-caption {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .lightbox-arrow {
    width: 44px;
    height: 44px;
    font-size: 1.5rem;
  }
  .lightbox-arrow-prev {
    left: 1rem;
  }
  .lightbox-arrow-next {
    right: 1rem;
  }
  .detail-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

/* Sidebar actions card */
.sidebar-actions-card {
  background: var(--bg-surface) !important;
}

.btn-full-width {
  width: 100%;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(21, 128, 61, 0.15);
}

.sidebar-action-note {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: 0.75rem;
  line-height: 1.4;
}

/* Print Styles */
@media print {
  body {
    background: white !important;
    color: black !important;
  }
  .navbar,
  .main-footer,
  .detail-sidebar,
  .breadcrumb,
  .hero-meta-tags,
  .hero-meta-bar,
  .article-back-row,
  .hero-right-cover,
  .section-number-badge {
    display: none !important;
  }
  .detail-page-layout {
    display: block !important;
    min-height: auto !important;
  }
  .detail-grid {
    grid-template-columns: 1fr !important;
    gap: 0 !important;
  }
  .detail-body {
    padding: 0 !important;
    background: white !important;
  }
  .article-section {
    box-shadow: none !important;
    border: none !important;
    padding: 1.5rem 0 !important;
    background: transparent !important;
    page-break-inside: avoid;
  }
  .detail-hero {
    padding: 2rem 0 !important;
    background: transparent !important;
    border-bottom: 2px solid #e2e8f0;
  }
  .hero-title {
    color: black !important;
    font-size: 2rem !important;
  }
  .approval-block {
    background: transparent !important;
    border: 2px solid #16a34a !important;
    color: black !important;
  }
}
</style>
