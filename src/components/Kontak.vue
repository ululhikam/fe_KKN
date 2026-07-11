<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const showToast = ref(false)
const toastMsg = ref('')

const socialLinks = [
  {
    name: 'Instagram',
    label: '@frommenggah',
    url: 'https://instagram.com/frommenggah',
    tag: 'IG'
  },
  {
    name: 'TikTok',
    label: '@padepokan4journey',
    url: 'https://www.tiktok.com/@padepokan4journey',
    tag: 'TT'
  },
  {
    name: 'YouTube',
    label: 'KKN UST Katekan Kelompok 4',
    url: 'https://youtube.com',
    tag: 'YT'
  }
]

const submitForm = () => {
  if (!name.value || !message.value) {
    alert('Nama dan pesan wajib diisi!')
    return
  }

  // Create entry
  const entry = {
    name: name.value,
    email: email.value,
    message: message.value,
    date: new Date().toISOString()
  }

  // Store locally
  const currentFeedback = JSON.parse(localStorage.getItem('kkn_feedback') || '[]')
  currentFeedback.push(entry)
  localStorage.setItem('kkn_feedback', JSON.stringify(currentFeedback))

  // Toast feedback
  toastMsg.value = `Terima kasih Dewantara ${name.value}, aspirasi Anda telah kami terima!`
  showToast.value = true
  
  // Reset
  name.value = ''
  email.value = ''
  message.value = ''

  setTimeout(() => {
    showToast.value = false
  }, 4000)
}
</script>

<template>
  <section id="kontak" class="kontak-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header animate-fade-up">
        <span class="tag">HUBUNGI KAMI</span>
        <h2>KONTAK & ASPIRASI</h2>
        <p>
          Ada pertanyaan, saran program kerja, atau ingin berkolaborasi? Kirimkan aspirasi Anda atau hubungi sekretariat kami di Dusun Menggah.
        </p>
      </div>

      <!-- Main Layout Grid -->
      <div class="kontak-grid">
        <!-- Left Panel: Info & Socials -->
        <div class="kontak-info glass">
          <h3>INFORMASI POSKO KKN</h3>
          <p class="posko-desc">
            Silakan berkunjung ke posko kami untuk sekadar berdiskusi, memberikan masukan program, atau berkonsultasi mengenai pembangunan dusun.
          </p>

          <div class="info-details">
            <div class="detail-row">
              <div class="detail-label-tag">ALAMAT</div>
              <div class="row-text">
                <strong>Sekretariat Posko</strong>
                <span>Rumah Bapak Kepala Dusun, Dusun Menggah RT 02 / RW 04, Desa Katekan, Kec. Ngadirejo, Kab. Temanggung, Jawa Tengah.</span>
                
                <!-- Google Maps Link Button -->
                <a 
                  href="https://maps.app.goo.gl/QDKo24KCpWTh5R48A" 
                  target="_blank" 
                  rel="noopener" 
                  class="maps-action-link"
                >
                  <span>Buka di Google Maps</span> <span class="arrow-indicator">→</span>
                </a>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-label-tag">EMAIL</div>
              <div class="row-text">
                <strong>Surat Elektronik Resmi</strong>
                <span>kkn.ust.menggah4@gmail.com</span>
              </div>
            </div>
          </div>

          <!-- Social media widgets -->
          <div class="social-widget-area">
            <h4>IKUTI MEDIA SOSIAL KAMI</h4>
            <div class="social-list">
              <a 
                v-for="social in socialLinks" 
                :key="social.name"
                :href="social.url"
                target="_blank"
                class="social-bar glass"
              >
                <div class="social-left">
                  <div class="social-text-badge-icon">{{ social.tag }}</div>
                  <span class="social-name">{{ social.name }}</span>
                </div>
                <span class="social-handle">{{ social.label }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Right Panel: Message Form -->
        <div class="kontak-form-card glass">
          <h3>KOTAK SARAN & ASPIRASI</h3>
          <p>Tinggalkan kritik, saran, atau saran program secara anonim maupun dengan menyertakan identitas Anda.</p>

          <form @submit.prevent="submitForm" class="feedback-form">
            <div class="form-group">
              <label for="username">NAMA LENGKAP / INSTANSI <span class="required">*</span></label>
              <input 
                id="username"
                v-model="name" 
                type="text" 
                placeholder="Masukkan nama lengkap Anda" 
                required 
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="useremail">ALAMAT EMAIL (OPSIONAL)</label>
              <input 
                id="useremail"
                v-model="email" 
                type="email" 
                placeholder="nama@email.com" 
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="usermsg">PESAN / SARAN / KRITIK <span class="required">*</span></label>
              <textarea 
                id="usermsg"
                v-model="message" 
                rows="5" 
                placeholder="Tuliskan pesan Anda di sini..." 
                required 
                class="form-textarea"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary submit-btn">
              Kirim Aspirasi <span class="btn-arrow-right">→</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Map Showcase -->
      <div class="map-showcase animate-fade-up">
        <h3>Lokasi Dusun Menggah, Desa Katekan</h3>
        <p class="map-subtitle">Akses peta digital penunjuk arah menuju Posko KKN Kelompok 4</p>
        <div class="map-frame-wrapper glass">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15819.349079148383!2d110.0519398!3d-7.2140417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a95055b41ff1d%3A0xa64fa85c8f85f81!2sKatekan%2C%20Ngadirejo%2C%20Temanggung%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1719830000000!5m2!1sen!2sid" 
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            title="Lokasi Desa Katekan"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast-slide">
      <div v-if="showToast" class="toast-card glass">
        <div class="toast-status-badge">SUKSES</div>
        <div class="toast-body">
          <strong>Pesan Terkirim</strong>
          <span>{{ toastMsg }}</span>
        </div>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.kontak-section {
  background-color: var(--bg-base);
  position: relative;
}

.kontak-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 5rem;
}

@media (max-width: 1024px) {
  .kontak-grid {
    grid-template-columns: 1fr;
  }
}

.kontak-info {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
}

@media (max-width: 640px) {
  .kontak-info {
    padding: 1.5rem;
  }
}

.kontak-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.posko-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.detail-label-tag {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--primary);
  background-color: var(--primary-glow);
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
  min-width: 70px;
  text-align: center;
}

.row-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.row-text strong {
  font-size: 0.95rem;
  color: var(--text-main);
  font-family: var(--display);
}

.row-text span {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.maps-action-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--primary);
  font-weight: 700;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  text-decoration: underline;
  align-self: flex-start;
}

.maps-action-link:hover {
  color: var(--primary-light);
}

.arrow-indicator {
  transition: transform 0.2s ease;
  display: inline-block;
}

.maps-action-link:hover .arrow-indicator {
  transform: translateX(3px);
}

/* Social Media Widget Area */
.social-widget-area h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: left;
}

.social-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.25rem;
  border-radius: 16px !important;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
}

.social-bar:hover {
  border-color: var(--primary);
  transform: translateX(4px);
}

.social-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.social-text-badge-icon {
  font-family: var(--display);
  font-weight: 900;
  font-size: 0.7rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--primary-glow);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-name {
  font-weight: 800;
  font-size: 0.85rem;
  color: var(--text-main);
  font-family: var(--display);
}

.social-handle {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.social-bar:hover .social-handle {
  color: var(--primary-light);
}

/* Form panel */
.kontak-form-card {
  padding: 2.5rem;
}

@media (max-width: 640px) {
  .kontak-form-card {
    padding: 1.5rem;
  }
}

.kontak-form-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  text-align: left;
}

.kontak-form-card p {
  font-size: 0.95rem;
  margin-bottom: 1.75rem;
  text-align: left;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.form-group label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: 0.02em;
}

.required {
  color: #ef4444;
}

.form-input, .form-textarea {
  font-family: var(--sans);
  font-size: 0.9rem;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus, .form-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.submit-btn {
  align-self: flex-start;
  gap: 0.5rem;
  margin-top: 0.25rem;
  display: inline-flex;
  align-items: center;
}

@media (max-width: 640px) {
  .submit-btn {
    width: 100%;
  }
}

.btn-arrow-right {
  transition: transform 0.2s ease;
}

.submit-btn:hover .btn-arrow-right {
  transform: translateX(4px);
}

/* Map Section */
.map-showcase {
  text-align: left;
  margin-top: 4rem;
}

.map-showcase h3 {
  font-size: 1.75rem;
  margin-bottom: 0.35rem;
}

.map-subtitle {
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.map-frame-wrapper {
  overflow: hidden;
  border-radius: 24px;
}

/* Toast styling */
.toast-card {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 16px !important;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.85rem;
  z-index: 3000;
  max-width: 380px;
  border: 1px solid var(--primary) !important;
  background-color: var(--bg-surface);
}

@media (max-width: 576px) {
  .toast-card {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
}

.toast-status-badge {
  font-family: var(--display);
  font-size: 0.65rem;
  font-weight: 900;
  color: #ffffff;
  background-color: var(--primary-light);
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.toast-body {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.toast-body strong {
  font-family: var(--display);
  font-weight: 850;
  font-size: 0.9rem;
  color: var(--text-main);
  text-transform: uppercase;
}

.toast-body span {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Toast Animation */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
