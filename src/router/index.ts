import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { isLoggedIn } from '../admin/auth'

// Public website
import PublicHome from '../PublicHome.vue'

// Admin
import AdminLogin from '../admin/views/AdminLogin.vue'
import AdminLayout from '../admin/AdminLayout.vue'
import AdminDashboard from '../admin/views/AdminDashboard.vue'
import AdminKegiatan from '../admin/views/AdminKegiatan.vue'
import AdminBeritaAcara from '../admin/views/AdminBeritaAcara.vue'
import AdminAnggota from '../admin/views/AdminAnggota.vue'
import AdminGaleri from '../admin/views/AdminGaleri.vue'

const routes: Array<RouteRecordRaw> = [
  // ── PUBLIC WEBSITE ──
  {
    path: '/',
    component: PublicHome,
    meta: {
      title: 'Website Resmi KKN Kelompok 4 Dusun Menggah Desa Katekan',
      description: 'Portal digital KKN Kelompok 4 Dusun Menggah Desa Katekan, Temanggung. Rekam jejak pengabdian, profil desa, program kerja unggulan, dan dokumentasi kegiatan.'
    }
  },

  // ── ADMIN ──
  {
    path: '/admin/login',
    component: AdminLogin,
    meta: { 
      public: true,
      title: 'Login Admin - KKN Padepokan 4',
      description: 'Halaman login administrator untuk mengelola data kegiatan KKN, berita acara, galeri, dan anggota kelompok.'
    },
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) next('/admin/dashboard')
      else next()
    }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (!isLoggedIn()) next('/admin/login')
      else next()
    },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { 
        path: 'dashboard', 
        component: AdminDashboard,
        meta: { title: 'Dashboard Admin - KKN Padepokan 4' }
      },
      { 
        path: 'kegiatan', 
        component: AdminKegiatan,
        meta: { title: 'Kelola Kegiatan - KKN Padepokan 4' }
      },
      { 
        path: 'berita-acara', 
        component: AdminBeritaAcara,
        meta: { title: 'Kelola Berita Acara - KKN Padepokan 4' }
      },
      { 
        path: 'anggota', 
        component: AdminAnggota,
        meta: { title: 'Kelola Anggota - KKN Padepokan 4' }
      },
      { 
        path: 'galeri', 
        component: AdminGaleri,
        meta: { title: 'Kelola Galeri - KKN Padepokan 4' }
      },
    ]
  },

  // Redirect fallback
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

// Dynamic SEO and Meta Tags Updater Guard
router.beforeEach((to, from, next) => {
  // 1. Dynamic Title
  const baseTitle = 'KKN Kelompok 4 Desa Katekan'
  const routeTitle = to.meta.title as string | undefined
  document.title = routeTitle ? `${routeTitle}` : baseTitle

  // 2. Dynamic Meta Description
  const defaultDescription = 'Portal digital KKN Kelompok 4 Dusun Menggah Desa Katekan, Temanggung. Rekam jejak pengabdian, profil desa, program kerja unggulan, dan dokumentasi kegiatan.'
  const routeDescription = to.meta.description as string | undefined
  const description = routeDescription || defaultDescription
  
  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', description)
  }

  // 3. Dynamic Open Graph & Twitter Tags (For Social Media Share Previews)
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', routeTitle || baseTitle)

  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription) ogDescription.setAttribute('content', description)

  const twitterTitle = document.querySelector('meta[property="twitter:title"]')
  if (twitterTitle) twitterTitle.setAttribute('content', routeTitle || baseTitle)

  const twitterDescription = document.querySelector('meta[property="twitter:description"]')
  if (twitterDescription) twitterDescription.setAttribute('content', description)

  next()
})

export default router
