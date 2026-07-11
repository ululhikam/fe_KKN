<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { beritaAcaraStore, kegiatanStore, BeritaAcara, Kegiatan } from '../store'
import { getUser, isAdmin } from '../auth'

const user = getUser()
const items = ref<BeritaAcara[]>([])
const kegiatanList = ref<Kegiatan[]>([])
const search = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editId = ref<string | null>(null)

interface Member {
  nama: string
  nim: string
  jabatan: string
  prodi: string
}

const ANGGOTA: Member[] = [
  { nama: 'Ulul Hikam', nim: '2023018037', jabatan: 'Ketua', prodi: 'Informatika' },
  { nama: 'Daffa Sandy Orvala', nim: '2023013048', jabatan: 'Wakil Ketua', prodi: 'Teknik Sipil' },
  { nama: 'Adithya Rifansyah', nim: '2023012043', jabatan: 'Sekretaris 1', prodi: 'Teknik Industri' },
  { nama: 'Azka Aprilia Ananta', nim: '2023017006', jabatan: 'Sekretaris 2', prodi: 'Akuntansi' },
  { nama: 'Fariska Aprilia Windari', nim: '2023004006', jabatan: 'Bendahara 1', prodi: 'Pendidikan Matematika' },
  { nama: 'Helvy Teana Rossa', nim: '2023001016', jabatan: 'Bendahara 2', prodi: 'Pend. Bahasa & Sastra Indonesia' },
  { nama: 'Intan Diah Mufadhe', nim: '2023010043', jabatan: 'Humas 1', prodi: 'Agribisnis' },
  { nama: 'Pandu Wiranata', nim: '2023008231', jabatan: 'Humas 2', prodi: 'Manajemen' },
  { nama: 'Dea Jane Anastacia Purba', nim: '2025007078', jabatan: 'Acara 1', prodi: 'Pend. Vokasional Kesejahteraan' },
  { nama: 'Paula Yuyun Sukmawan', nim: '2023008141', jabatan: 'Acara 2', prodi: 'Manajemen' },
  { nama: 'Rosita Purnamasari', nim: '2023017076', jabatan: 'PDD 1', prodi: 'Akuntansi' },
  { nama: 'Lunetta Wimala Anargya', nim: '2023008235', jabatan: 'PDD 2', prodi: 'Manajemen' },
]

const hadirChecked = ref<string[]>([])
const form = ref(emptyForm())

function emptyForm() {
  return { kegiatan_id: '', judul: '', tanggal_ba: new Date().toISOString().split('T')[0], isi_kegiatan: '', hasil_kegiatan: '', jumlah_peserta: '' as string | number, catatan: '' }
}

const statusLabel: Record<string, string> = { draft: 'Draft', diajukan: 'Diajukan', disetujui: 'Disetujui', ditolak: 'Ditolak' }
const statusClass: Record<string, string> = { draft: 'badge-muted', diajukan: 'badge-warning', disetujui: 'badge-success', ditolak: 'badge-danger' }

async function load() {
  items.value = await beritaAcaraStore.getAll()
  kegiatanList.value = await kegiatanStore.getAll()
}

const filtered = computed(() => {
  return items.value.filter(b => {
    const matchSearch = !search.value || b.nomor_ba?.includes(search.value) || b.judul?.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filterStatus.value || b.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function getKegiatanName(id: string) {
  return kegiatanList.value.find(k => k.id === id)?.nama_kegiatan || '–'
}

function openAdd() {
  editId.value = null; form.value = emptyForm(); hadirChecked.value = []; showModal.value = true
}

function openEdit(item: BeritaAcara) {
  editId.value = item.id
  form.value = { kegiatan_id: item.kegiatan_id, judul: item.judul, tanggal_ba: item.tanggal_ba, isi_kegiatan: item.isi_kegiatan, hasil_kegiatan: item.hasil_kegiatan || '', jumlah_peserta: item.jumlah_peserta || '', catatan: item.catatan || '' }
  hadirChecked.value = (item.peserta_hadir || []).map((p: any) => p.nim)
  showModal.value = true
}

async function save() {
  const peserta = ANGGOTA.filter(a => hadirChecked.value.includes(a.nim))
  const data = {
    ...form.value,
    jumlah_peserta: Number(form.value.jumlah_peserta) || peserta.length,
    peserta_hadir: peserta,
  }
  try {
    if (editId.value) await beritaAcaraStore.update(editId.value, data)
    else await beritaAcaraStore.create(data, user)
    showModal.value = false; await load()
  } catch (err: any) {
    alert(err.message || 'Gagal menyimpan berita acara')
  }
}

async function submitBA(id: string) {
  if (!confirm('Ajukan berita acara ini untuk persetujuan Ketua?')) return
  try {
    await beritaAcaraStore.submit(id); await load()
  } catch (err: any) {
    alert(err.message || 'Gagal mengajukan berita acara')
  }
}

async function approveBA(id: string) {
  const catatan = prompt('Catatan persetujuan (opsional):') || 'Disetujui'
  try {
    await beritaAcaraStore.approve(id, user, catatan); await load()
  } catch (err: any) {
    alert(err.message || 'Gagal menyetujui berita acara')
  }
}

async function deleteBA(id: string) {
  if (!confirm('Hapus draft berita acara ini?')) return
  try {
    const success = await beritaAcaraStore.delete(id)
    if (!success) alert('Hanya draft yang bisa dihapus')
    else await load()
  } catch (err: any) {
    alert(err.message || 'Gagal menghapus berita acara')
  }
}

function formatDate(d: string | Date) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(load)
</script>

<template>
  <div class="berita-acara-page">
    <div class="page-header">
      <div>
        <h2>Berita Acara Kegiatan</h2>
        <p>Dokumentasi resmi setiap kegiatan KKN Padepokan 4</p>
      </div>
      <button class="btn-primary" @click="openAdd">Buat Berita Acara</button>
    </div>

    <div class="filter-bar">
      <input v-model="search" type="search" placeholder="Cari nomor BA atau judul..." class="input-field" />
      <select v-model="filterStatus" class="input-field select-sm">
        <option value="">Semua Status</option>
        <option value="draft">Draft</option>
        <option value="diajukan">Diajukan</option>
        <option value="disetujui">Disetujui</option>
      </select>
    </div>

    <div class="table-card">
      <div v-if="!filtered.length" class="empty">
        <p>Belum ada berita acara terdaftar.</p>
      </div>
      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr><th>No. BA</th><th>Judul</th><th>Kegiatan</th><th>Tanggal</th><th>Peserta</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr v-for="b in filtered" :key="b.id">
              <td><strong style="color:#7c3aed;font-family:monospace;font-size:0.8rem">{{ b.nomor_ba }}</strong></td>
              <td style="max-width:220px"><span style="color:#0f172a;font-weight:700">{{ b.judul }}</span></td>
              <td style="font-size:0.8rem;color:#64748b">{{ getKegiatanName(b.kegiatan_id) }}</td>
              <td style="font-size:0.82rem">{{ formatDate(b.tanggal_ba) }}</td>
              <td>{{ b.jumlah_peserta || 0 }} orang</td>
              <td>
                <span class="badge" :class="statusClass[b.status]">
                  <span class="badge-dot"></span>
                  {{ statusLabel[b.status] }}
                </span>
              </td>
              <td>
                <div class="action-row">
                  <button v-if="b.status === 'draft'" class="btn-action btn-action-edit" title="Edit" @click="openEdit(b)">Edit</button>
                  <button v-if="b.status === 'draft'" class="btn-action btn-action-submit" title="Ajukan" @click="submitBA(b.id)">Ajukan</button>
                  <button v-if="b.status === 'diajukan' && isAdmin()" class="btn-action btn-action-approve" title="Setujui" @click="approveBA(b.id)">Setujui</button>
                  <button v-if="b.status === 'draft'" class="btn-action btn-action-danger" title="Hapus" @click="deleteBA(b.id)">Hapus</button>
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
            <h3>{{ editId ? 'Edit Berita Acara' : 'Buat Berita Acara' }}</h3>
            <button class="modal-close" @click="showModal = false">✕</button>
          </div>
          <form @submit.prevent="save" class="modal-form">
            <div class="form-row">
              <div class="field" style="flex:2">
                <label>Kegiatan Terkait *</label>
                <select v-model="form.kegiatan_id" required>
                  <option value="">– Pilih Kegiatan –</option>
                  <option v-for="k in kegiatanList" :key="k.id" :value="k.id">{{ k.nama_kegiatan }} ({{ k.tanggal_kegiatan }})</option>
                </select>
              </div>
              <div class="field">
                <label>Tanggal BA</label>
                <input v-model="form.tanggal_ba" type="date" />
              </div>
            </div>
            <div class="field">
              <label>Judul Berita Acara *</label>
              <input v-model="form.judul" type="text" placeholder="Berita Acara Kegiatan..." required />
            </div>
            <div class="field">
              <label>Isi / Jalannya Kegiatan *</label>
              <textarea v-model="form.isi_kegiatan" rows="5" placeholder="Deskripsikan jalannya kegiatan secara kronologis dan detail..." required></textarea>
            </div>
            <div class="field">
              <label>Hasil Kegiatan</label>
              <textarea v-model="form.hasil_kegiatan" rows="3" placeholder="Hasil, capaian, dan output dari kegiatan ini..."></textarea>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Jumlah Peserta Total</label>
                <input v-model="form.jumlah_peserta" type="number" placeholder="(auto dari checklist)" min="0" />
              </div>
            </div>
            <div class="field">
              <label>Catatan / Kendala</label>
              <textarea v-model="form.catatan" rows="2" placeholder="Catatan tambahan atau kendala selama kegiatan..."></textarea>
            </div>

            <!-- Daftar hadir anggota KKN -->
            <div class="divider"><span>Daftar Hadir Anggota KKN</span></div>
            <div class="checklist-grid">
              <label v-for="a in ANGGOTA" :key="a.nim" class="check-item">
                <input type="checkbox" :value="a.nim" v-model="hadirChecked" />
                <div>
                  <span class="check-jabatan">{{ a.jabatan }}</span>
                  <span class="check-nama">{{ a.nama }}</span>
                </div>
              </label>
            </div>
            <p style="font-size:0.75rem;color:#64748b;font-weight:700">{{ hadirChecked.length }} anggota dipilih</p>

            <div class="modal-footer">
              <button type="button" class="btn-ghost" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary">Simpan Draft</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.berita-acara-page { display: flex; flex-direction: column; gap: 1.5rem; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.page-header h2 { font-size: 1.65rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
.page-header p { font-size: 0.875rem; color: #64748b; margin-top: 0.25rem; }

.filter-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.input-field { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.65rem 1rem; color: #0f172a; font-size: 0.875rem; font-family: inherit; flex: 1; min-width: 150px; transition: all 0.2s ease; }
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
.badge-muted { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
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
.btn-action-edit {
  color: #4f46e5;
}
.btn-action-edit:hover {
  background: #f5f3ff;
  border-color: #c084fc;
}
.btn-action-submit {
  color: #d97706;
}
.btn-action-submit:hover {
  background: #fffbeb;
  border-color: #fde047;
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
.modal-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; animation: popIn 0.2s ease; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
@keyframes popIn { from { transform: scale(0.96) translateY(12px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
.modal-head h3 { font-size: 1.05rem; font-weight: 850; color: #0f172a; }
.modal-close { background: none; border: none; color: #64748b; cursor: pointer; font-size: 1.15rem; }
.modal-close:hover { color: #dc2626; }
.modal-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.form-row .field { flex: 1; min-width: 0; }
.field { display: flex; flex-direction: column; gap: 0.45rem; }
.field label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
.field input, .field select, .field textarea { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.65rem 0.9rem; color: #0f172a; font-size: 0.9rem; font-family: inherit; width: 100%; transition: all 0.2s ease; }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15); }
.field textarea { resize: vertical; min-height: 80px; }

.divider { display: flex; align-items: center; gap: 0.75rem; font-size: 0.78rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
.checklist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem; }
.check-item { display: flex; align-items: flex-start; gap: 0.65rem; padding: 0.6rem 0.85rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; }
.check-item:hover { border-color: #c084fc; background: #f5f3ff; }
.check-item input[type="checkbox"] { accent-color: #7c3aed; margin-top: 3px; flex-shrink: 0; }
.check-jabatan { display: block; font-size: 0.65rem; color: #7c3aed; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; }
.check-nama { display: block; font-size: 0.8rem; color: #1e293b; font-weight: 700; margin-top: 0.05rem; }
</style>
