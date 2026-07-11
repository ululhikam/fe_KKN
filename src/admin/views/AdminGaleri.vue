<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { galeriStore, Galeri } from '../store'

const items = ref<Galeri[]>([])
const search = ref('')
const filterCategory = ref('')
const showModal = ref(false)
const editId = ref<string | null>(null)

const categories = [
  { id: 'pendidikan', label: 'Pendidikan & Anak' },
  { id: 'lingkungan', label: 'Sosial & Lingkungan' },
  { id: 'umkm', label: 'Ekonomi & UMKM' },
  { id: 'keagamaan', label: 'Keagamaan & Budaya' }
]

const form = ref(emptyForm())

function emptyForm() {
  return {
    title: '',
    category: 'pendidikan',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    description: '',
    image_url: ''
  }
}

async function load() {
  items.value = await galeriStore.getAll()
}

const filtered = computed(() => {
  return items.value.filter(g => {
    const matchSearch = !search.value || g.title.toLowerCase().includes(search.value.toLowerCase()) || g.description?.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !filterCategory.value || g.category === filterCategory.value
    return matchSearch && matchCat
  })
})

function openAdd() {
  editId.value = null
  form.value = emptyForm()
  showModal.value = true
}

function openEdit(item: Galeri) {
  editId.value = item.id
  form.value = {
    title: item.title,
    category: item.category,
    date: item.date,
    description: item.description || '',
    image_url: item.image_url
  }
  showModal.value = true
}

async function save() {
  try {
    if (editId.value) {
      await galeriStore.update(editId.value, { ...form.value })
    } else {
      await galeriStore.create({ ...form.value })
    }
    showModal.value = false
    await load()
  } catch (err: any) {
    alert(err.message || 'Gagal menyimpan foto galeri')
  }
}

async function del(id: string) {
  if (!confirm('Hapus foto galeri ini?')) return
  try {
    const success = await galeriStore.delete(id)
    if (success) {
      await load()
    } else {
      alert('Gagal menghapus foto galeri')
    }
  } catch (err: any) {
    alert(err.message || 'Gagal menghapus foto galeri')
  }
}

function getCategoryLabel(catId: string) {
  return categories.find(c => c.id === catId)?.label || catId
}

onMounted(load)
</script>

<template>
  <div class="galeri-page">
    <div class="page-header">
      <div>
        <h2>Manajemen Galeri</h2>
        <p>Kelola dokumentasi visual kegiatan KKN Padepokan 4</p>
      </div>
      <button class="btn-primary" @click="openAdd">Tambah Foto</button>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <input v-model="search" type="search" placeholder="Cari judul atau deskripsi..." class="input-field" />
      <select v-model="filterCategory" class="input-field select-sm">
        <option value="">Semua Kategori</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.label }}
        </option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="!filtered.length" class="empty">
        <p>{{ search || filterCategory ? 'Tidak ada hasil ditemukan' : 'Belum ada foto galeri' }}</p>
      </div>
      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th style="width: 120px">Foto</th>
              <th>Judul / Deskripsi</th>
              <th>Kategori</th>
              <th>Tanggal Kegiatan</th>
              <th style="width: 150px">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in filtered" :key="g.id">
              <td>
                <div class="thumb-container">
                  <img :src="g.image_url" :alt="g.title" class="table-thumb" />
                </div>
              </td>
              <td>
                <strong style="color:#0f172a; font-size: 0.95rem;">{{ g.title }}</strong>
                <p class="desc-preview">{{ g.description || '–' }}</p>
              </td>
              <td>
                <span class="badge badge-cat">{{ getCategoryLabel(g.category) }}</span>
              </td>
              <td>{{ g.date }}</td>
              <td>
                <div class="action-row">
                  <button class="btn-action btn-action-edit" title="Edit" @click="openEdit(g)">Edit</button>
                  <button class="btn-action btn-action-danger" title="Hapus" @click="del(g.id)">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-head">
            <h3>{{ editId ? 'Edit Foto Galeri' : 'Tambah Foto Galeri' }}</h3>
            <button class="modal-close" @click="showModal = false">✕</button>
          </div>
          <form @submit.prevent="save" class="modal-form">
            <div class="field">
              <label>Judul *</label>
              <input v-model="form.title" type="text" placeholder="Bimbingan Belajar Ceria" required />
            </div>
            
            <div class="form-row">
              <div class="field">
                <label>Kategori *</label>
                <select v-model="form.category" required>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.label }}
                  </option>
                </select>
              </div>
              <div class="field">
                <label>Tanggal Teks *</label>
                <input v-model="form.date" type="text" placeholder="e.g., 12 Juni 2026" required />
              </div>
            </div>

            <div class="field">
              <label>URL Gambar *</label>
              <input v-model="form.image_url" type="url" placeholder="https://images.unsplash.com/..." required />
              <div v-if="form.image_url" class="preview-container">
                <img :src="form.image_url" alt="Pratinjau gambar" class="form-preview-img" />
              </div>
            </div>

            <div class="field">
              <label>Deskripsi / Keterangan</label>
              <textarea v-model="form.description" rows="3" placeholder="Suasana saat kegiatan berlangsung..."></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-ghost" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.galeri-page { display: flex; flex-direction: column; gap: 1.5rem; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.page-header h2 { font-size: 1.65rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
.page-header p { font-size: 0.875rem; color: #64748b; margin-top: 0.25rem; }

.filter-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.input-field { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.65rem 1rem; color: #0f172a; font-size: 0.875rem; font-family: inherit; min-width: 160px; flex: 1; transition: all 0.2s ease; }
.select-sm { flex: 0; min-width: 180px; }
.input-field:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15); }

.table-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); }
.empty { text-align: center; padding: 4rem 2rem; color: #64748b; font-size: 0.875rem; }

.table-responsive { width: 100%; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
thead { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
th { padding: 1rem 1.25rem; text-align: left; font-size: 0.72rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
td { padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; color: #475569; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f8fafc; }

.thumb-container { width: 90px; height: 60px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; background: #f1f5f9; }
.table-thumb { width: 100%; height: 100%; object-fit: cover; }
.desc-preview { font-size: 0.8rem; color: #64748b; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.4; }

.badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
.badge-cat { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

.action-row { display: flex; align-items: center; gap: 0.5rem; }
.btn-action { padding: 0.4rem 0.75rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: 1px solid transparent; cursor: pointer; transition: all 0.15s ease; }
.btn-action-edit { background: rgba(124, 58, 237, 0.08); border-color: rgba(124, 58, 237, 0.15); color: #7c3aed; }
.btn-action-edit:hover { background: #7c3aed; color: #ffffff; }
.btn-action-danger { background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.15); color: #dc2626; }
.btn-action-danger:hover { background: #dc2626; color: #ffffff; }

/* Buttons */
.btn-primary { background: #7c3aed; color: #ffffff; border: none; border-radius: 10px; padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15); }
.btn-primary:hover { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(124, 58, 237, 0.25); }

/* Modal overlay & box */
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1.5rem; }
.modal-box { background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; width: 100%; max-width: 540px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow: hidden; display: flex; flex-direction: column; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #f1f5f9; }
.modal-head h3 { font-size: 1.15rem; font-weight: 800; color: #0f172a; }
.modal-close { background: none; border: none; color: #64748b; font-size: 1.1rem; cursor: pointer; padding: 0.25rem; }

.modal-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; overflow-y: auto; max-height: calc(100vh - 12rem); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field label { font-size: 0.75rem; font-weight: 750; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
.field input, .field select, .field textarea { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.65rem 0.85rem; color: #0f172a; font-size: 0.875rem; font-family: inherit; transition: all 0.2s; }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15); }

.preview-container { margin-top: 0.5rem; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; height: 160px; background: #f8fafc; display: flex; align-items: center; justify-content: center; }
.form-preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }

.modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; padding: 1.25rem 1.5rem 1.5rem; border-top: 1px solid #f1f5f9; margin-top: 0.5rem; }
.btn-ghost { background: transparent; border: 1px solid #cbd5e1; color: #475569; border-radius: 10px; padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.15s; }
.btn-ghost:hover { background: #f8fafc; color: #0f172a; border-color: #94a3b8; }
</style>
