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
  },

  // ── ADMIN ──
  {
    path: '/admin/login',
    component: AdminLogin,
    meta: { public: true },
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
      { path: 'dashboard', component: AdminDashboard },
      { path: 'kegiatan', component: AdminKegiatan },
      { path: 'berita-acara', component: AdminBeritaAcara },
      { path: 'anggota', component: AdminAnggota },
      { path: 'galeri', component: AdminGaleri },
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

export default router
