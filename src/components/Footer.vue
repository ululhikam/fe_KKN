<script setup>
// Footer component for KKN Padepokan
</script>

<template>
  <footer class="main-footer">
    <div class="container footer-container">
      <div class="footer-brand">
        <span class="footer-title">KKN KELOMPOK 4 DESA KATEKAN</span>
        <span class="footer-subtitle">Kuliah Kerja Nyata Universitas Sarjanawiyata Tamansiswa Yogyakarta Kelompok 4 • 2026</span>
      </div>

      <nav class="footer-nav">
        <a href="#home">Beranda</a>
        <a href="#profil-desa">Profil Desa</a>
        <a href="#profil-kelompok">Profil Kelompok</a>
        <a href="#program-kerja">Program Kerja</a>
        <a href="#berita-acara">Berita Acara</a>
        <a href="#galeri">Galeri</a>
        <a href="#kontak">Kontak</a>
      </nav>

      <div class="footer-credit">
        <span>&copy; 2026 KKN Kelompok 4 Desa Katekan. Hak Cipta Dilindungi.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.main-footer { 
  background-color: var(--bg-surface); 
  border-top: 1px solid var(--border-color); 
  padding: 4rem 0 2rem; 
  color: var(--text-main); 
  transition: background-color var(--transition-normal); 
}
.footer-container { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 2rem; 
}
.footer-brand { 
  text-align: center; 
  display: flex; 
  flex-direction: column; 
  gap: 0.25rem; 
}
.footer-title { 
  font-size: 1.25rem; 
  font-weight: 850; 
  letter-spacing: 0.05em; 
  color: var(--primary); 
}
.footer-subtitle { 
  font-size: 0.85rem; 
  color: var(--text-muted); 
  font-weight: 500; 
}
.footer-nav { 
  display: flex; 
  gap: 2rem; 
  flex-wrap: wrap; 
  justify-content: center; 
}
.footer-nav a { 
  font-size: 0.9rem; 
  font-weight: 600; 
  color: var(--text-muted); 
}
.footer-nav a:hover { 
  color: var(--primary-light); 
}
.footer-credit { 
  width: 100%; 
  border-top: 1px solid var(--border-color); 
  padding-top: 2rem; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-size: 0.8rem; 
  color: var(--text-muted); 
  font-weight: 500; 
}
@media (max-width: 768px) { 
  .footer-credit { 
    flex-direction: column; 
    gap: 1rem; 
    text-align: center; 
  } 
}
.maker { 
  display: inline-flex; 
  align-items: center; 
  gap: 0.35rem; 
}
.heart-text { 
  font-size: 0.95rem; 
  color: #ef4444; 
  display: inline-block; 
  animation: heartbeat 1.5s infinite alternate; 
}
@keyframes heartbeat { 
  from { transform: scale(1); } 
  to { transform: scale(1.15); } 
}
</style>
