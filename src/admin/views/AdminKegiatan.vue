<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { kegiatanStore, Kegiatan } from '../store'
import { getUser } from '../auth'

const user = getUser()
const items = ref<Kegiatan[]>([])
const search = ref('')
const filterStatus = ref('')
const filterKategori = ref('')
const showModal = ref(false)
const editId = ref<string | null>(null)

const form = ref(emptyForm())
function emptyForm() {
  return { nama_kegiatan: '', deskripsi: '', tanggal_kegiatan: '', waktu_mulai: '', waktu_selesai: '', lokasi: '', kategori: 'umum' as any, target_peserta: '', anggaran: '' }
}

const statusLabel: Record<string, string> = { direncanakan: 'Direncanakan', berjalan: 'Berjalan', selesai: 'Selesai', dibatalkan: 'Dibatalkan' }
const statusClass: Record<string, string> = { direncanakan: 'badge-info', berjalan: 'badge-warning', selesai: 'badge-success', dibatalkan: 'badge-danger' }
const nextStatus: Record<string, 'direncanakan' | 'berjalan' | 'selesai' | 'dibatalkan'> = { direncanakan: 'berjalan', berjalan: 'selesai', selesai: 'selesai', dibatalkan: 'dibatalkan' }

async function load() { items.value = await kegiatanStore.getAll() }

const filtered = computed(() => {
  return items.value.filter(k => {
    const matchSearch = !search.value || k.nama_kegiatan.toLowerCase().includes(search.value.toLowerCase()) || k.lokasi?.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filterStatus.value || k.status === filterStatus.value
    const matchKat = !filterKategori.value || k.kategori === filterKategori.value
    return matchSearch && matchStatus && matchKat
  })
})

function openAdd() { editId.value = null; form.value = emptyForm(); showModal.value = true }
function openEdit(item: Kegiatan) {
  editId.value = item.id
  form.value = { nama_kegiatan: item.nama_kegiatan, deskripsi: item.deskripsi || '', tanggal_kegiatan: item.tanggal_kegiatan, waktu_mulai: item.waktu_mulai || '', waktu_selesai: item.waktu_selesai || '', lokasi: item.lokasi, kategori: item.kategori || 'umum', target_peserta: item.target_peserta || '', anggaran: item.anggaran || '' }
  showModal.value = true
}

async function save() {
  try {
    if (editId.value) await kegiatanStore.update(editId.value, { ...form.value })
    else await kegiatanStore.create({ ...form.value })
    showModal.value = false; await load()
  } catch (err: any) {
    alert(err.message || 'Gagal menyimpan kegiatan')
  }
}

async function advanceStatus(item: Kegiatan) {
  const ns = nextStatus[item.status]
  if (ns === item.status) return
  if (!confirm(`Ubah status ke "${statusLabel[ns]}"?`)) return
  try {
    await kegiatanStore.update(item.id, { status: ns }); await load()
  } catch (err: any) {
    alert(err.message || 'Gagal merubah status')
  }
}

async function del(id: string) {
  if (!confirm('Hapus kegiatan ini?')) return
  try {
    await kegiatanStore.delete(id); await load()
  } catch (err: any) {
    alert(err.message || 'Gagal menghapus kegiatan')
  }
}

function formatDate(d: string | Date) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatRp(n: any) {
  if (!n) return '–'
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

onMounted(load)
</script>

<template>
  <div class="kegiatan-page">
    <div class="page-header">
      <div>
        <h2>Manajemen Kegiatan</h2>
        <p>Kelola seluruh program kerja KKN Padepokan 4</p>
      </div>
      <button class="btn-primary" @click="openAdd">Tambah Kegiatan</button>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <input v-model="search" type="search" placeholder="Cari kegiatan atau lokasi..." class="input-field" />
      <select v-model="filterStatus" class="input-field select-sm">
        <option value="">Semua Status</option>
        <option value="direncanakan">Direncanakan</option>
        <option value="berjalan">Berjalan</option>
        <option value="selesai">Selesai</option>
        <option value="dibatalkan">Dibatalkan</option>
      </select>
      <select v-model="filterKategori" class="input-field select-sm">
        <option value="">Semua Kategori</option>
        <option value="sosial">Sosial</option>
        <option value="pendidikan">Pendidikan</option>
        <option value="kesehatan">Kesehatan</option>
        <option value="ekonomi">Ekonomi</option>
        <option value="lingkungan">Lingkungan</option>
        <option value="budaya">Budaya</option>
        <option value="infrastruktur">Infrastruktur</option>
        <option value="umum">Umum</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="!filtered.length" class="empty">
        <p>{{ search || filterStatus ? 'Tidak ada hasil ditemukan' : 'Belum ada kegiatan' }}</p>
      </div>
      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr><th>Kegiatan</th><th>Tanggal</th><th>Kategori</th><th>Target</th><th>Anggaran</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr v-for="k in filtered" :key="k.id">
              <td>
                <strong style="color:#0f172a">{{ k.nama_kegiatan }}</strong>
                <div style="font-size:0.75rem;color:#64748b;margin-top:2px">{{ k.lokasi }}</div>
              </td>
              <td>{{ formatDate(k.tanggal_kegiatan) }}
                <div v-if="k.waktu_mulai" style="font-size:0.75rem;color:#64748b">{{ k.waktu_mulai }}{{ k.waktu_selesai ? ' – ' + k.waktu_selesai : '' }}</div>
              </td>
              <td><span class="badge badge-cat">{{ k.kategori || 'Umum' }}</span></td>
              <td>{{ k.target_peserta ? k.target_peserta + ' orang' : '–' }}</td>
              <td>{{ formatRp(k.anggaran) }}</td>
              <td>
                <span class="badge" :class="statusClass[k.status]">
                  <span class="badge-dot"></span>
                  {{ statusLabel[k.status] }}
                </span>
              </td>
              <td>
                <div class="action-row">
                  <button class="btn-action btn-action-edit" title="Edit" @click="openEdit(k)">Edit</button>
                  <button class="btn-action btn-action-approve" title="Lanjut Status" @click="advanceStatus(k)" :disabled="k.status === 'selesai' || k.status === 'dibatalkan'">Lanjut</button>
                  <button class="btn-action btn-action-danger" title="Hapus" @click="del(k.id)">Hapus</button>
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
            <h3>{{ editId ? 'Edit Kegiatan' : 'Tambah Kegiatan' }}</h3>
            <button class="modal-close" @click="showModal = false">✕</button>
          </div>
          <form @submit.prevent="save" class="modal-form">
            <div class="form-row">
              <div class="field">
                <label>Nama Kegiatan *</label>
                <input v-model="form.nama_kegiatan" type="text" placeholder="Sosialisasi PHBS" required />
              </div>
              <div class="field">
                <label>Kategori</label>
                <select v-model="form.kategori">
                  <option value="umum">Umum</option>
                  <option value="sosial">Sosial</option>
                  <option value="pendidikan">Pendidikan</option>
                  <option value="kesehatan">Kesehatan</option>
                  <option value="ekonomi">Ekonomi</option>
                  <option value="lingkungan">Lingkungan</option>
                  <option value="budaya">Budaya</option>
                  <option value="infrastruktur">Infrastruktur</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Deskripsi</label>
              <textarea v-model="form.deskripsi" rows="3" placeholder="Deskripsi kegiatan..."></textarea>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Tanggal *</label>
                <input v-model="form.tanggal_kegiatan" type="date" required />
              </div>
              <div class="field">
                <label>Waktu Mulai</label>
                <input v-model="form.waktu_mulai" type="time" />
              </div>
              <div class="field">
                <label>Waktu Selesai</label>
                <input v-model="form.waktu_selesai" type="time" />
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Lokasi *</label>
                <input v-model="form.lokasi" type="text" placeholder="Balai Desa Katekan" required />
              </div>
              <div class="field">
                <label>Target Peserta</label>
                <input v-model="form.target_peserta" type="number" placeholder="50" min="0" />
              </div>
            </div>
            <div class="field">
              <label>Anggaran (Rp)</label>
              <input v-model="form.anggaran" type="number" placeholder="500000" min="0" />
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
.kegiatan-page { display: flex; flex-direction: column; gap: 1.5rem; }
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
td { padding: 1.1rem 1.25rem; border-bottom: 1px solid #f1f5f9; color: #475569; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f8fafc; }

.badge { display: inline-flex; align-items: center; padding: 0.25rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.badge-dot { width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; display: inline-block; background-color: currentColor; }
.badge-cat { background: rgba(124,58,237,0.06); color: #7c3aed; border: 1px solid rgba(124,58,237,0.15); }
.badge-info { background: rgba(59, 130, 246, 0.08); color: #2563eb; }
.badge-warning { background: rgba(245, 158, 11, 0.08); color: #d97706; }
.badge-success { background: rgba(16, 185, 129, 0.08); color: #059669; }
.badge-danger { background: rgba(239, 68, 68, 0.08); color: #dc2626; }

.action-row { display: flex; gap: 0.4rem; }
.btn-action {
  font-size: 0.75rem;
  font-weight: 750;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  background: #ffffff;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.btn-action:disabled {
  opacity: 0.25;
  cursor: not-allowed;
  pointer-events: none;
}
.btn-action-edit {
  color: #4f46e5;
}
.btn-action-edit:hover {
  background: #f5f3ff;
  border-color: #c084fc;
}
.btn-action-approve {
  color: #059669;
}
.btn-action-approve:hover {
  background: #f0fdf4;
  border-color: #86efac;
}
.btn-action-danger {
  color: #dc2626;
}
.btn-action-danger:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

/* Buttons */
.btn-primary { background: #7c3aed; color: #fff; border: none; border-radius: 10px; padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 700; font-family: inherit; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
.btn-primary:hover { background: #6d28d9; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25); }
.btn-ghost { background: transparent; color: #64748b; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 700; font-family: inherit; cursor: pointer; transition: all 0.2s ease; }
.btn-ghost:hover { background: #f1f5f9; color: #0f172a; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(4px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto; }
.modal-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: popIn 0.2s ease; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
@keyframes popIn { from { transform: scale(0.96) translateY(12px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
.modal-head h3 { font-size: 1.05rem; font-weight: 850; color: #0f172a; }
.modal-close { background: none; border: none; color: #64748b; cursor: pointer; font-size: 1.15rem; transition: color 0.15s; }
.modal-close:hover { color: #dc2626; }
.modal-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.form-row .field { flex: 1; min-width: 0; }
.field { display: flex; flex-direction: column; gap: 0.45rem; }
.field label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
.field input, .field select, .field textarea { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.65rem 0.9rem; color: #0f172a; font-size: 0.9rem; font-family: inherit; width: 100%; transition: all 0.2s ease; }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15); }
.field textarea { resize: vertical; min-height: 80px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }

@media (max-width: 640px) {
  .form-row { flex-direction: column; }
  th:nth-child(3), td:nth-child(3),
  th:nth-child(4), td:nth-child(4),
  th:nth-child(5), td:nth-child(5) { display: none; }
}
</style>
