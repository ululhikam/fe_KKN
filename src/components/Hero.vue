<script setup>
import desaLandscape from '../assets/desa_landscape.png'
</script>

<template>
  <section id="home" class="hero-section">
    <div class="container hero-container">
      <!-- Left: Content -->
      <div class="hero-content animate-fade-up">
        <!-- Floating Accent Tag -->
        <!-- <div class="badge-wrapper">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span class="badge-text">KKN UST KELOMPOK 4 • 2026</span>
          </div>
        </div> -->
        
        <h1 class="hero-title">
          Mengabdi dengan Hati, <br />
          Membangun <span class="gradient-text">Dusun Menggah</span>
        </h1>
        
        <p class="hero-description">
          Portal Dokumentasi & Informasi Kuliah Kerja Nyata (KKN) Universitas Sarjanawiyata Tamansiswa Yogyakarta Kelompok 4. 
          Bersama warga Katekan mendorong pertanian berkelanjutan, pengembangan UMKM kopi lokal, serta digitalisasi pedesaan.
        </p>
        
        <div class="hero-actions">
          <a href="#program-kerja" class="btn btn-primary hero-btn-main">
            Lihat Program Kerja <span class="btn-arrow">→</span>
          </a>
          <a href="#profil-desa" class="btn btn-secondary hero-btn-sub">
            Profil Desa
          </a>
        </div>
        
        <!-- Stats list -->
        <div class="hero-stats">
          <div class="stat-item glass">
            <div class="stat-top">
              <span class="stat-indicator-dot green"></span>
              <span class="stat-number">12+</span>
            </div>
            <span class="stat-label">Program</span>
          </div>
          
          <div class="stat-item glass">
            <div class="stat-top">
              <span class="stat-indicator-dot gold"></span>
              <span class="stat-number">30 HARI</span>
            </div>
            <span class="stat-label">Pengabdian</span>
          </div>
          
          <div class="stat-item glass">
            <div class="stat-top">
              <span class="stat-indicator-dot blue"></span>
              <span class="stat-number">POSKO 4</span>
            </div>
            <span class="stat-label">Dusun Menggah</span>
          </div>
        </div>
      </div>
      
      <!-- Right: Premium Image Showcase -->
      <div class="hero-visual">
        <div class="visual-wrapper">
          <div class="image-card glass">
            <img :src="desaLandscape" alt="Desa Katekan Landscape" class="main-img" />
            <div class="image-overlay"></div>
          </div>
          
          <!-- Floating Glass Info Badge -->
          <div class="floating-glass-card glass">
            <span class="glowing-accent-dot"></span>
            <div class="floating-details">
              <span class="floating-title">KKN UST YOGYAKARTA</span>
              <span class="floating-text">Dusun Menggah, Katekan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding-top: 120px;
  padding-bottom: 60px;
  overflow: hidden;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
}

.badge-wrapper {
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .badge-wrapper {
    display: flex;
    justify-content: center;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 99px;
  box-shadow: var(--shadow-sm);
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary);
  animation: pulse 2s infinite;
}

.badge-text {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: 0.1em;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.5; }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  text-transform: none;
}

.gradient-text {
  color: var(--primary);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.25rem;
  }
}

.hero-description {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 620px;
  margin-bottom: 2.5rem;
}

@media (max-width: 1024px) {
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3.5rem;
}

@media (max-width: 1024px) {
  .hero-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}

.hero-btn-main {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-arrow {
  transition: transform 0.2s ease;
}

.hero-btn-main:hover .btn-arrow {
  transform: translateX(4px);
}

.hero-stats {
  display: flex;
  gap: 1.25rem;
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}

@media (max-width: 1024px) {
  .hero-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-stats {
    display: none;
  }
}

.stat-item {
  flex: 1;
  padding: 1.5rem;
  border-radius: 20px !important;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  text-align: left;
}

@media (max-width: 1024px) {
  .stat-item {
    align-items: center;
    text-align: center;
  }
}

.stat-top {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.stat-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.stat-indicator-dot.green { background-color: var(--primary-light); }
.stat-indicator-dot.gold { background-color: var(--brand-gold); }
.stat-indicator-dot.blue { background-color: #3b82f6; }

.stat-number {
  font-family: var(--display);
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--text-main);
  line-height: 1;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 750;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Visual Panel */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-wrapper {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.image-card {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  aspect-ratio: 4 / 3.2;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.image-card:hover .main-img {
  transform: scale(1.04);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.25) 0%, transparent 100%);
  pointer-events: none;
}

.floating-glass-card {
  position: absolute;
  bottom: -20px;
  right: -20px;
  padding: 1rem 1.25rem;
  border-radius: 20px !important;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-surface-glass);
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}

.glowing-accent-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--primary-light);
  box-shadow: 0 0 10px var(--primary-light);
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

.floating-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.floating-title {
  font-family: var(--display);
  font-weight: 800;
  font-size: 0.7rem;
  color: var(--primary);
  letter-spacing: 0.05em;
}

.floating-text {
  font-size: 0.78rem;
  color: var(--text-main);
  font-weight: 750;
}

@media (max-width: 1024px) {
  .floating-glass-card {
    bottom: -15px;
    right: 50%;
    transform: translateX(50%) !important;
    animation: float-mobile 5s ease-in-out infinite;
  }
  
  @keyframes float-mobile {
    0% { transform: translateX(50%) translateY(0); }
    50% { transform: translateX(50%) translateY(-5px); }
    100% { transform: translateX(50%) translateY(0); }
  }
}
</style>
