<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import kknTeam from '../assets/kkn_team.jpg'
import avatarMale from '../assets/avatar_male.png'
import avatarFemale from '../assets/avatar_female.png'

// Import member photos from assets folder
import imgHikam from '../assets/hikam.jpg'
import imgDaffa from '../assets/daffa.jpg'
import imgAzka from '../assets/azka.jpg'
import imgRiska from '../assets/riska.jpg'
import imgHelvy from '../assets/helvy.jpg'
import imgIntan from '../assets/intan.jpg'
import imgPandu from '../assets/pandu.jpg'
import imgDea from '../assets/dea.jpg'
import imgYuyun from '../assets/yuyun.jpg'
import imgRosita from '../assets/rosita.jpg'
import imgLunetta from '../assets/lunetta.jpg'

// Data resmi anggota KKN Padepokan 4 – Desa Katekan, Gantiwarno, Klaten
const members = [
  {
    name: 'Ulul Hikam',
    role: 'Ketua',
    nim: '2023018037',
    major: 'Informatika',
    gender: 'L',
    instagram: 'https://instagram.com/hikkammm_',
    linkedin: '#',
    photo: imgHikam
  },
  {
    name: 'Daffa Sandy Orvala',
    role: 'Wakil Ketua',
    nim: '2023013048',
    major: 'Teknik Sipil',
    gender: 'L',
    instagram: 'https://instagram.com/dapaorvala',
    linkedin: '#',
    photo: imgDaffa
  },
  {
    name: 'Adithya Rifansyah',
    role: 'Sekretaris 1',
    nim: '2023012043',
    major: 'Teknik Industri',
    gender: 'L',
    instagram: '#',
    linkedin: '#',
    photo: avatarMale
  },
  {
    name: 'Azka Aprilia Ananta',
    role: 'Sekretaris 2',
    nim: '2023017006',
    major: 'Akuntansi',
    gender: 'P',
    instagram: 'https://instagram.com/april.iaananta',
    linkedin: '#',
    photo: imgAzka
  },
  {
    name: 'Fariska Aprilia Windari',
    role: 'Bendahara 1',
    nim: '2023004006',
    major: 'Pendidikan Matematika',
    gender: 'P',
    instagram: 'https://instagram.com/_aprrlyaf',
    linkedin: '#',
    photo: imgRiska
  },
  {
    name: 'Helvy Teana Rossa',
    role: 'Bendahara 2',
    nim: '2023001016',
    major: 'Pendidikan Bahasa & Sastra Indonesia',
    gender: 'P',
    instagram: 'https://instagram.com/helvyteana_',
    linkedin: '#',
    photo: imgHelvy
  },
  {
    name: 'Intan Diah Mufadhe',
    role: 'Humas 1',
    nim: '2023010043',
    major: 'Agribisnis',
    gender: 'P',
    instagram: 'https://instagram.com/intaan.dm',
    linkedin: '#',
    photo: imgIntan
  },
  {
    name: 'Pandu Wiranata',
    role: 'Humas 2',
    nim: '2023008231',
    major: 'Manajemen',
    gender: 'L',
    instagram: '#',
    linkedin: '#',
    photo: imgPandu
  },
  {
    name: 'Dea Jane Anastacia Purba',
    role: 'Acara 1',
    nim: '2025007078',
    major: 'Pendidikan Vokasional Kesejahteraan',
    gender: 'P',
    instagram: 'https://instagram.com/Deanstc_',
    linkedin: '#',
    photo: imgDea
  },
  {
    name: 'Paula Yuyun Sukmawan',
    role: 'Acara 2',
    nim: '2023008141',
    major: 'Manajemen',
    gender: 'P',
    instagram: 'https://instagram.com/Paulayuyunsukmawan_',
    linkedin: '#',
    photo: imgYuyun
  },
  {
    name: 'Rosita Purnamasari',
    role: 'PDD 1',
    nim: '2023017076',
    major: 'Akuntansi',
    gender: 'P',
    instagram: 'https://instagram.com/rossprnm',
    linkedin: '#',
    photo: imgRosita
  },
  {
    name: 'Lunetta Wimala Anargya',
    role: 'PDD 2',
    nim: '2023008235',
    major: 'Manajemen',
    gender: 'P',
    instagram: 'https://instagram.com/lvntta_',
    linkedin: '#',
    photo: imgLunetta
  },
]

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

function next() {
  currentIndex.value = (currentIndex.value + 1) % members.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + members.length) % members.length
}

const startX = ref(0)
const isDragging = ref(false)
const dragDistance = ref(0)

function startDrag(event) {
  if (event.target.closest('button') || event.target.closest('a')) {
    return
  }
  isDragging.value = true
  const clientX = event.type.startsWith('touch') 
    ? event.touches[0].clientX 
    : event.clientX
  startX.value = clientX
  dragDistance.value = 0
}

function onDrag(event) {
  if (!isDragging.value) return
  const clientX = event.type.startsWith('touch') 
    ? event.touches[0].clientX 
    : event.clientX
  dragDistance.value = startX.value - clientX
  
  if (event.cancelable) {
    event.preventDefault()
  }
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  
  const threshold = 50
  if (dragDistance.value > threshold) {
    next()
  } else if (dragDistance.value < -threshold) {
    prev()
  }
}

function handleCardClick(index) {
  if (Math.abs(dragDistance.value) < 10) {
    currentIndex.value = index
  }
}

function getCardStyle(index) {
  const len = members.length
  let diff = index - currentIndex.value

  // Handle circular layout
  if (diff < -len / 2) diff += len
  if (diff > len / 2) diff -= len

  const absDiff = Math.abs(diff)

  // Hide slides beyond left/right reach
  if (absDiff > 2) {
    return {
      opacity: 0,
      pointerEvents: 'none',
      transform: `translateX(${diff > 0 ? 160 : -160}px) scale(0.5) translateZ(-300px)`,
      zIndex: 0
    }
  }

  // Coverflow parameters
  let scale = 1 - absDiff * 0.15
  let zIndex = 10 - absDiff
  let opacity = 1 - absDiff * 0.4
  
  let translateX = diff * 200 // Default spacing
  let rotateY = diff * -25 // 3D Angling

  if (windowWidth.value < 768) {
    translateX = diff * 120
    scale = 1 - absDiff * 0.2
    rotateY = diff * -15
  }

  return {
    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
    zIndex: zIndex,
    opacity: opacity,
    pointerEvents: diff === 0 ? 'auto' : 'none'
  }
}

const divisiLabel = {
  'Ketua': 'Ketua',
  'Wakil Ketua': 'Wakil Ketua',
  'Sekretaris 1': 'Sekretaris 1',
  'Sekretaris 2': 'Sekretaris 2',
  'Bendahara 1': 'Bendahara 1',
  'Bendahara 2': 'Bendahara 2',
  'Humas 1': 'Humas 1',
  'Humas 2': 'Humas 2',
  'Acara 1': 'Acara 1',
  'Acara 2': 'Acara 2',
  'PDD 1': 'PDD 1',
  'PDD 2': 'PDD 2',
}
</script>

<template>
  <section id="profil-kelompok" class="kelompok-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="tag">Pengabdi Desa</span>
        <h2>Profil Kelompok KKN</h2>
        <p>
          Kenali lebih dekat Kelompok 4 KKN Dusun Menggah Desa Katekan. 
          Sinergi mahasiswa lintas disiplin ilmu untuk pengabdian masyarakat terbaik.
        </p>
      </div>

      <!-- Leader Greeting Address -->
      <div class="greeting-card glass animate-fade-up">
        <div class="greeting-quote-mark">“</div>
        <div class="greeting-content">
          <p class="greeting-text">
            "Assalamu'alaikum Wr. Wb. Selamat datang di portal resmi KKN Kelompok 4 Dusun Menggah Desa Katekan. 
            Melalui program KKN ini, kami berkomitmen untuk berkolaborasi secara aktif bersama warga, perangkat desa, serta tokoh masyarakat guna menggali dan memaksimalkan potensi lokal, baik dari sektor pertanian, UMKM, pendidikan, maupun pelestarian lingkungan. Kami berharap rekam jejak digital ini dapat menginspirasi dan memberikan manfaat yang berkelanjutan."
          </p>
          <div class="greeting-author">
            <div class="author-avatar-wrapper">
              <img :src="imgHikam" alt="Ulul Hikam" class="author-avatar-img" />
            </div>
            <div class="author-info">
              <span class="author-name">Ulul Hikam</span>
              <span class="author-role">Ketua KKN Padepokan 4</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Large Group Photo Presentation -->
      <div class="team-photo-showcase">
        <div class="photo-wrapper glass">
          <img :src="kknTeam" alt="Foto Bersama KKN Kelompok 4" class="team-img" />
          <div class="photo-overlay">
            <div class="overlay-text">
              <h3>KKN Kelompok 4 Dusun Menggah</h3>
              <p>Membawa Perubahan Melalui Sinergi & Aksi Nyata</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Member Carousel Section -->
      <div class="member-header">
        <h3>Daftar Anggota Kelompok</h3>
        <p>Struktur organisasi dan pelaksana program KKN Kelompok 4</p>
      </div>

      <!-- Coverflow Carousel Wrapper -->
      <div 
        class="carousel-outer-container"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
      >
        <!-- Navigation Arrows -->
        <button class="nav-arrow prev-arrow" @click.stop="prev" aria-label="Previous member">
          ‹
        </button>

        <div class="carousel-container">
          <div 
            v-for="(member, index) in members" 
            :key="index"
            class="carousel-card-wrapper"
            :style="getCardStyle(index)"
            @click="handleCardClick(index)"
          >
            <div class="member-card glass">
              <!-- Avatar Photo -->
              <div class="member-avatar-wrapper">
                <img 
                  :src="member.photo" 
                  :alt="member.name" 
                  class="member-avatar-img" 
                />
              </div>
              <div class="member-content">
                <span class="member-role">{{ divisiLabel[member.role] || member.role }}</span>
                <h4 class="member-name">{{ member.name }}</h4>
                <span class="member-major">{{ member.major }}</span>
                <span class="member-nim">NIM: {{ member.nim }}</span>
                <div class="member-socials">
                  <a :href="member.instagram" class="social-text-badge" aria-label="Instagram">IG</a>
                  <a :href="member.linkedin" class="social-text-badge" aria-label="LinkedIn">LN</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="nav-arrow next-arrow" @click.stop="next" aria-label="Next member">
          ›
        </button>
      </div>

      <!-- Pagination Indicators -->
      <div class="carousel-indicators">
        <span 
          v-for="(_, index) in members" 
          :key="index"
          class="indicator-dot"
          :class="{ active: index === currentIndex }"
          @click="currentIndex = index"
        ></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.kelompok-section {
  background-color: var(--bg-base);
  position: relative;
  overflow: hidden;
}

/* Greeting card */
.greeting-card {
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 5rem;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border-left: 6px solid var(--primary);
  background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(34, 197, 94, 0.02) 100%);
}

@media (max-width: 768px) {
  .greeting-card {
    padding: 2rem 1.5rem;
  }
}

.greeting-quote-mark {
  position: absolute;
  top: -1rem;
  right: 1.5rem;
  color: var(--primary-glow);
  font-size: 10rem;
  font-family: var(--display);
  font-weight: 900;
  line-height: 1;
  opacity: 0.75;
  pointer-events: none;
}

.greeting-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.greeting-text {
  font-family: var(--sans);
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--text-main);
  font-style: italic;
  font-weight: 500;
}

@media (max-width: 768px) {
  .greeting-text {
    font-size: 1.05rem;
  }
}

.greeting-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--primary-light);
}

.author-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.author-name {
  font-weight: 750;
  font-size: 1.05rem;
  color: var(--text-main);
}

.author-role {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 600;
}

@media (min-width: 1024px) {
  .greeting-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 4rem;
  }
  .greeting-text {
    flex: 1;
    margin-bottom: 0;
  }
  .greeting-author {
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex-shrink: 0;
    width: 220px;
    gap: 0.75rem;
  }
  .author-avatar-wrapper {
    width: 110px;
    height: 110px;
    border-radius: 16px;
    border-width: 3px;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s ease;
  }
  .greeting-author:hover .author-avatar-wrapper {
    transform: scale(1.05);
  }
  .author-info {
    align-items: center;
    text-align: center;
  }
  .author-name {
    font-size: 1.15rem;
  }
  .author-role {
    font-size: 0.85rem;
  }
}

/* Photo showcase */
.team-photo-showcase {
  margin-bottom: 5rem;
}

.photo-wrapper {
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  box-shadow: var(--shadow-lg);
  aspect-ratio: 16 / 9;
  border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .photo-wrapper {
    aspect-ratio: 4 / 3;
  }
}

.team-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.photo-wrapper:hover .team-img {
  transform: scale(1.03);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
  padding: 3rem;
  color: white;
  display: flex;
  align-items: flex-end;
  text-align: left;
}

@media (max-width: 576px) {
  .photo-overlay {
    padding: 1.5rem;
  }
}

.overlay-text h3 {
  font-size: 1.85rem;
  color: #ffffff;
  font-weight: 900;
  margin-bottom: 0.25rem;
}

.overlay-text p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  font-weight: 600;
}

@media (max-width: 576px) {
  .overlay-text h3 {
    font-size: 1.25rem;
  }
  .overlay-text p {
    font-size: 0.85rem;
  }
}

/* Member Carousel Area */
.member-header {
  text-align: center;
  margin-bottom: 2rem;
}

.member-header h3 {
  font-size: 1.75rem;
  font-weight: 850;
  margin-bottom: 0.5rem;
}

.carousel-outer-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  overflow: visible;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.carousel-outer-container:active {
  cursor: grabbing;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.carousel-card-wrapper {
  position: absolute;
  width: 290px;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease, z-index 0.6s ease;
  transform-style: preserve-3d;
}

.carousel-card-wrapper .member-card {
  width: 100%;
  margin: 0;
  box-shadow: var(--shadow-sm);
  background-color: var(--bg-surface);
  border-radius: 24px;
  padding: 0;
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.carousel-card-wrapper:hover .member-card {
  border-color: var(--primary);
}

.member-avatar-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid var(--border-color);
}

.member-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-card-wrapper:hover .member-avatar-img {
  transform: scale(1.08);
}

.member-content {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.member-role {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--primary);
  background-color: var(--primary-glow);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  margin-bottom: 0.75rem;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.member-name {
  font-size: 1.1rem;
  font-weight: 850;
  color: var(--text-main);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.member-major {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.member-nim {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 1.25rem;
  display: block;
}

.member-socials {
  display: flex;
  gap: 0.5rem;
}

.social-text-badge {
  font-family: var(--sans);
  font-size: 0.68rem;
  font-weight: 800;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--bg-base);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.social-text-badge:hover {
  background-color: var(--primary-light);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
}

/* Nav arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-surface-glass);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--text-main);
  font-size: 2.25rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  user-select: none;
}

.nav-arrow:hover {
  background: var(--primary);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.prev-arrow {
  left: -40px;
}

.next-arrow {
  right: -40px;
}

@media (max-width: 1080px) {
  .prev-arrow { left: -10px; }
  .next-arrow { right: -10px; }
}

@media (max-width: 820px) {
  .prev-arrow { left: 10px; }
  .next-arrow { right: 10px; }
}

@media (max-width: 768px) {
  .carousel-outer-container {
    height: 440px;
  }
  .carousel-card-wrapper {
    width: 230px;
  }
  .member-avatar-wrapper {
    height: 190px;
  }
  .nav-arrow {
    width: 44px;
    height: 44px;
    font-size: 1.75rem;
  }
}

/* Indicators */
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background-color: var(--primary);
  width: 24px;
  border-radius: 4px;
}
</style>
