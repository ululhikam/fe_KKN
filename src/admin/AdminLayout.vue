<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { logout, getUser, isAdmin } from './auth'

const router = useRouter()
const route = useRoute()
const user = getUser()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/kegiatan', label: 'Kegiatan' },
  { to: '/admin/berita-acara', label: 'Berita Acara' },
  { to: '/admin/anggota', label: 'Anggota' },
  { to: '/admin/galeri', label: 'Galeri' },
]

const pageTitle = computed(() => {
  const map: Record<string, string> = { 
    '/admin/dashboard': 'Dashboard', 
    '/admin/kegiatan': 'Manajemen Kegiatan', 
    '/admin/berita-acara': 'Berita Acara', 
    '/admin/anggota': 'Anggota Kelompok',
    '/admin/galeri': 'Manajemen Galeri'
  }
  return map[route.path] || 'Admin Panel'
})

function handleLogout() {
  logout()
  router.push('/admin/login')
}

function getInitials(name?: string) { return (name || 'A').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() }
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar overlay (mobile) -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-top">
        <div class="sidebar-brand">
          <span class="brand-name">PADEPOKAN 4</span>
          <span class="brand-sub">Desa Katekan Admin</span>
        </div>
        <button class="close-btn" @click="sidebarOpen = false">✕</button>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: route.path === item.to }"
          @click="sidebarOpen = false"
        >
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ getInitials(user?.name) }}</div>
          <div class="user-meta">
            <span class="user-name">{{ user?.name }}</span>
            <span class="user-jabatan">{{ user?.jabatan }}</span>
          </div>
        </div>
        <button class="logout-link-btn" @click="handleLogout">Keluar</button>
        <a href="/" class="back-site-link">Kembali ke Website</a>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="admin-main">
      <!-- Topbar -->
      <header class="topbar">
        <button class="hamburger" @click="sidebarOpen = !sidebarOpen">Menu</button>
        <span class="topbar-title">{{ pageTitle }}</span>
        <div class="topbar-right">
          <span v-if="isAdmin()" class="admin-badge">Admin</span>
          <span class="topbar-name">{{ user?.name?.split(' ')[0] }}</span>
        </div>
      </header>

      <!-- Content -->
      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1e293b;
}

/* ── SIDEBAR ── */
.sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0; top: 0; bottom: 0;
  z-index: 200;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}
.sidebar-brand { display: flex; flex-direction: column; gap: 0.15rem; }
.brand-name { font-size: 0.95rem; font-weight: 800; color: #1e293b; letter-spacing: 0.1em; }
.brand-sub { font-size: 0.72rem; color: #64748b; font-weight: 600; }
.close-btn { display: none; background: none; border: none; color: #64748b; cursor: pointer; font-size: 1.15rem; padding: 0.25rem; }

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  text-decoration: none;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.2s ease;
}
.nav-link:hover {
  background: #f8fafc;
  color: #0f172a;
}
.nav-link.active {
  background: #7c3aed;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  padding: 0.75rem;
}
.user-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  color: #fff; font-size: 0.85rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-meta { flex: 1; min-width: 0; }
.user-name { display: block; font-size: 0.82rem; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-jabatan { display: block; font-size: 0.68rem; color: #64748b; font-weight: 600; margin-top: 0.05rem; }

.logout-link-btn {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #dc2626;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.6rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
}
.logout-link-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.back-site-link {
  display: block;
  text-align: center;
  font-size: 0.75rem;
  color: #64748b;
  text-decoration: none;
  padding: 0.25rem;
  transition: color 0.15s;
  font-weight: 700;
}
.back-site-link:hover { color: #7c3aed; }

/* ── MAIN ── */
.admin-main {
  margin-left: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}
.hamburger {
  display: none;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  cursor: pointer;
}
.hamburger:hover { background: #f1f5f9; color: #0f172a; }
.topbar-title { font-weight: 850; font-size: 1.15rem; color: #0f172a; flex: 1; letter-spacing: -0.01em; }
.topbar-right { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; }
.admin-badge { background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.15); color: #7c3aed; padding: 0.25rem 0.65rem; border-radius: 8px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.topbar-name { color: #475569; font-weight: 700; }

.admin-content { flex: 1; padding: 2rem; overflow-x: hidden; background: #f0f2f5; }

/* ── RESPONSIVE ── */
.sidebar-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(4px); z-index: 199; }

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(15, 23, 42, 0.15); }
  .close-btn { display: block; }
  .hamburger { display: flex; }
  .admin-main { margin-left: 0; }
  .admin-content { padding: 1.25rem; }
}
</style>
