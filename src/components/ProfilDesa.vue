<script setup>
import { ref } from 'vue'
import umkmPotensi from '../assets/umkm_potensi.png'

const activeTab = ref('sejarah')

const tabs = [
  { id: 'sejarah', label: 'Sejarah Singkat' },
  { id: 'geografi', label: 'Geografi & Wilayah' },
  { id: 'demografi', label: 'Demografi & Penduduk' }
]

const potentials = [
  {
    title: 'UMKM Kopi Robusta & Arabika',
    desc: 'Desa Katekan terkenal sebagai salah satu produsen kopi berkualitas di Temanggung. Biji kopi diproses secara tradisional dan modern oleh kelompok tani setempat.',
    tag: 'UMKM',
    image: umkmPotensi
  },
  {
    title: 'Pertanian & Hortikultura',
    desc: 'Dengan tanah vulkanis subur di lereng gunung, komoditas utama berupa padi, jagung, cabai, sayuran segar, serta tanaman tembakau musiman berkualitas tinggi.',
    tag: 'Pertanian',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Kesenian Tradisional Jaran Kepang',
    desc: 'Melestarikan warisan budaya leluhur melalui sanggar seni tari tradisional kuda lumping/jaran kepang yang sering tampil di acara bersih dusun dan festival daerah.',
    tag: 'Kebudayaan',
    image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=600&q=80'
  }
]
</script>

<template>
  <section id="profil-desa" class="desa-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="tag">Mengenal Desa</span>
        <h2>Profil Desa Katekan</h2>
        <p>
          Menelusuri sejarah, letak geografis, serta kearifan lokal Dusun Menggah, Desa Katekan yang kaya akan potensi alam dan budaya.
        </p>
      </div>

      <!-- Main Profile Grid -->
      <div class="profile-main-grid">
        <!-- Left: Interactive Tab Content -->
        <div class="profile-info-panel glass">
          <!-- Tab Headers -->
          <div class="tab-headers">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab-btn"
              :class="{ 'active': activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- Tab Body -->
          <div class="tab-content">
            <transition name="fade" mode="out-in">
              <!-- Sejarah -->
              <div v-if="activeTab === 'sejarah'" key="sejarah" class="content-pane">
                <h3>Asal Usul & Sejarah Desa</h3>
                <p>
                  Nama <strong>Desa Katekan</strong> dipercaya berasal dari kata bahasa Jawa kuno yang berarti "datangnya kemakmuran" (ketekan/katekan). 
                  Sejak masa kolonial Belanda, wilayah ini dikenal subur dan dihuni oleh masyarakat agraris yang rukun dan gotong royong.
                </p>
                <p>
                  Dusun Menggah sendiri merupakan salah satu dusun tertua di Desa Katekan yang memegang teguh tradisi leluhur seperti "Nyadran" dan "Merti Dusun" sebagai simbol rasa syukur atas hasil bumi yang melimpah.
                </p>
                <ul class="bullet-list">
                  <li><span class="custom-bullet"></span> Berdiri sebagai pemukiman mandiri sejak awal abad ke-19</li>
                  <li><span class="custom-bullet"></span> Terkenal dengan nilai-nilai kerukunan antarumat beragama yang erat</li>
                  <li><span class="custom-bullet"></span> Mempertahankan kearifan lokal pengolahan air bersih dari mata air alami</li>
                </ul>
              </div>

              <!-- Geografi -->
              <div v-else-if="activeTab === 'geografi'" key="geografi" class="content-pane">
                <h3>Letak Geografis & Batas Wilayah</h3>
                <p>
                  Desa Katekan terletak di kaki perbukitan dengan ketinggian rata-rata <strong>700 - 900 meter di atas permukaan laut (mdpl)</strong>. 
                  Suhu udara berkisar antara 18°C hingga 26°C, menjadikannya kawasan yang sejuk dan sangat mendukung sektor hortikultura.
                </p>
                <div class="geo-stats">
                  <div class="geo-stat-card">
                    <span class="geo-label">Utara</span>
                    <span class="geo-val">Kecamatan Tretep</span>
                  </div>
                  <div class="geo-stat-card">
                    <span class="geo-label">Selatan</span>
                    <span class="geo-val">Desa Candimulyo</span>
                  </div>
                  <div class="geo-stat-card">
                    <span class="geo-label">Timur</span>
                    <span class="geo-val">Kecamatan Bejen</span>
                  </div>
                  <div class="geo-stat-card">
                    <span class="geo-label">Barat</span>
                    <span class="geo-val">Kabupaten Wonosobo</span>
                  </div>
                </div>
              </div>

              <!-- Demografi -->
              <div v-else-if="activeTab === 'demografi'" key="demografi" class="content-pane">
                <h3>Demografi & Mata Pencaharian</h3>
                <p>
                  Sebagian besar penduduk Dusun Menggah dan Desa Katekan secara umum bermata pencaharian sebagai petani dan buruh tani. 
                  Generasi muda mulai merambah ke sektor wirausaha digital dan UMKM mandiri.
                </p>
                <div class="demographic-stats">
                  <div class="dem-item">
                    <span class="dem-percent">72%</span>
                    <span class="dem-label">Petani / Pekebun</span>
                  </div>
                  <div class="dem-item">
                    <span class="dem-percent">15%</span>
                    <span class="dem-label">Wirausaha / UMKM</span>
                  </div>
                  <div class="dem-item">
                    <span class="dem-percent">13%</span>
                    <span class="dem-label">Pekerja Jasa / Lainnya</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Right: Decorative Info Card -->
        <div class="village-summary-card glass">
          <div class="summary-top">
            <span class="summary-badge">Ringkasan Wilayah</span>
            <h3>Dusun Menggah</h3>
            <span class="region-location">Desa Katekan, Temanggung</span>
          </div>
          <div class="summary-body">
            <div class="info-row">
              <span class="info-label">Jumlah Kepala Keluarga</span>
              <span class="info-value">~180 KK</span>
            </div>
            <div class="info-row">
              <span class="info-label">Komoditas Unggulan</span>
              <span class="info-value">Kopi & Tembakau</span>
            </div>
            <div class="info-row">
              <span class="info-label">Karakteristik Sosial</span>
              <span class="info-value">Gotong Royong Mandiri</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Potensi Desa Sub-section -->
      <div class="potensi-header">
        <h3>Potensi Dusun & Desa</h3>
        <p>Pilar-pilar perekonomian dan daya tarik lokal Desa Katekan</p>
      </div>

      <div class="grid grid-3 potensi-grid">
        <div 
          v-for="(pot, index) in potentials" 
          :key="index"
          class="potensi-card glass"
        >
          <div class="potensi-img-wrapper">
            <img :src="pot.image" :alt="pot.title" class="potensi-image" />
            <span class="pot-tag">{{ pot.tag }}</span>
          </div>
          <div class="potensi-content">
            <div class="pot-title-row">
              <h4>{{ pot.title }}</h4>
            </div>
            <p>{{ pot.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.desa-section {
  background-color: var(--bg-base);
  position: relative;
}

.profile-main-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 2rem;
  margin-bottom: 5rem;
}

@media (max-width: 1024px) {
  .profile-main-grid {
    grid-template-columns: 1fr;
  }
}

.profile-info-panel {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
}

.tab-headers {
  display: flex;
  background-color: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem 1rem;
  background: transparent;
  border: none;
  font-family: var(--sans);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--primary-light);
  background-color: rgba(34, 197, 94, 0.02);
}

.tab-btn.active {
  color: var(--primary);
  background-color: var(--bg-surface);
  border-bottom: 3px solid var(--primary);
}

.tab-content {
  padding: 2.5rem;
  flex-grow: 1;
  background-color: var(--bg-surface);
}

@media (max-width: 576px) {
  .tab-content {
    padding: 1.5rem;
  }
}

.content-pane h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-main);
  font-weight: 850;
}

.content-pane p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.bullet-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bullet-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.95rem;
}

.custom-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--primary-light);
  flex-shrink: 0;
  display: inline-block;
}

/* Geo stats */
.geo-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 576px) {
  .geo-stats {
    grid-template-columns: 1fr;
  }
}

.geo-stat-card {
  padding: 1rem;
  border-radius: 12px;
  background-color: var(--bg-base);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.geo-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary-light);
  letter-spacing: 0.05em;
}

.geo-val {
  font-size: 0.95rem;
  font-weight: 750;
  color: var(--text-main);
}

/* Demographics */
.demographic-stats {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.dem-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-base);
  border-radius: 12px;
  border-left: 4px solid var(--primary-light);
}

.dem-percent {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary);
  width: 60px;
  flex-shrink: 0;
}

.dem-label {
  font-size: 0.95rem;
  font-weight: 750;
  color: var(--text-main);
}

/* Village Summary Card */
.village-summary-card {
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow-md);
  height: 100%;
  background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(34, 197, 94, 0.03) 100%);
}

@media (max-width: 1024px) {
  .village-summary-card {
    height: auto;
  }
}

.summary-badge {
  font-size: 0.72rem;
  font-weight: 750;
  color: var(--primary-light);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.village-summary-card h3 {
  font-size: 1.75rem;
  font-weight: 850;
  margin-bottom: 0.25rem;
}

.region-location {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.summary-body {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 600;
}

.info-value {
  font-size: 1.05rem;
  font-weight: 750;
  color: var(--text-main);
}

/* Potensi Section */
.potensi-header {
  text-align: center;
  margin-bottom: 3rem;
  margin-top: 2rem;
}

.potensi-header h3 {
  font-size: 1.75rem;
  font-weight: 850;
  margin-bottom: 0.5rem;
}

.potensi-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.potensi-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.potensi-img-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.potensi-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pot-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--bg-surface-glass);
  backdrop-filter: blur(8px);
  color: var(--primary);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.35rem 0.85rem;
  border-radius: 50px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.potensi-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--bg-surface);
  flex-grow: 1;
}

.pot-title-row h4 {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.3;
}

.potensi-content p {
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
