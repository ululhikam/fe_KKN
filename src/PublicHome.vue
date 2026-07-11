<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import ProfilDesa from './components/ProfilDesa.vue'
import ProfilKelompok from './components/ProfilKelompok.vue'
import ProgramKerja from './components/ProgramKerja.vue'
import BeritaAcara from './components/BeritaAcara.vue'
import Galeri from './components/Galeri.vue'
import Kontak from './components/Kontak.vue'
import Footer from './components/Footer.vue'

const activeSection = ref('home')
const showBackToTop = ref(false)

const sections = ['home', 'profil-desa', 'profil-kelompok', 'program-kerja', 'berita-acara', 'galeri', 'kontak']

const handleScroll = () => { showBackToTop.value = window.scrollY > 500 }
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

let observer = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()

  const observerOptions = { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) activeSection.value = entry.target.id })
  }, observerOptions)

  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.unobserve(el)
    })
  }
})
</script>

<template>
  <div class="app-layout">
    <Navbar :active-section="activeSection" />

    <main>
      <Hero />
      <ProfilDesa />
      <ProfilKelompok />
      <ProgramKerja />
      <BeritaAcara />
      <Galeri />
      <Kontak />
    </main>

    <Footer />

    <transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="back-to-top-btn glass"
        aria-label="Back to top"
      >
        ↑
      </button>
    </transition>
  </div>
</template>

<style>
.app-layout { display: flex; flex-direction: column; min-height: 100vh; }
main { flex-grow: 1; }
.back-to-top-btn { position: fixed; bottom: 2rem; left: 2rem; width: 48px; height: 48px; border-radius: 50%; color: var(--text-main); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: var(--shadow-md); z-index: 1000; transition: all 0.3s ease; }
.back-to-top-btn:hover { background-color: var(--primary); color: white; border-color: transparent; transform: translateY(-4px); }
@media (max-width: 576px) { .back-to-top-btn { left: 1rem; bottom: 5.5rem; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
