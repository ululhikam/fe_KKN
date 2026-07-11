import { kegiatanApi, beritaAcaraApi, galeriApi, authApi } from '../services/api.js'

export interface Anggota {
  id: string
  email: string
  name: string
  role: 'admin' | 'member'
  division?: string
  nim?: string
  prodi?: string
  avatar_url?: string
}

export interface Galeri {
  id: string
  title: string
  category: string
  date: string
  description?: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Kegiatan {
  id: string
  nama_kegiatan: string
  deskripsi: string
  tanggal_kegiatan: string
  waktu_mulai: string
  waktu_selesai: string
  lokasi: string
  kategori: 'sosial' | 'pendidikan' | 'kesehatan' | 'ekonomi' | 'lingkungan' | 'budaya' | 'infrastruktur' | 'umum'
  target_peserta: string
  anggaran: string
  status: 'direncanakan' | 'berjalan' | 'selesai' | 'dibatalkan'
  bulan: number
  tahun: number
  created_at: string
  updated_at: string
}

export interface BeritaAcara {
  id: string
  nomor_ba: string
  judul: string
  kegiatan_id: string
  isi_kegiatan: string
  tanggal_ba: string
  status: 'draft' | 'diajukan' | 'disetujui' | 'ditolak'
  dibuat_oleh: {
    name: string
    jabatan: string
  }
  jabatan_pembuat?: string
  disetujui_oleh?: string
  disetujui_at?: string
  catatan_persetujuan?: string
  peserta_hadir?: Array<{
    nim: string
    nama: string
    jabatan?: string
    prodi?: string
  }>
  jumlah_peserta?: number
  created_at: string
  updated_at: string
}

// ── KEGIATAN STORE (ASYNC BACKEND CALLS) ──────────────────────────────────────
export const kegiatanStore = {
  async getAll(): Promise<Kegiatan[]> {
    try {
      const res = await kegiatanApi.getAll({ limit: 100 })
      return res.data || []
    } catch (err) {
      console.error('Failed to fetch kegiatan:', err)
      return []
    }
  },
  
  async create(data: Omit<Kegiatan, 'id' | 'status' | 'bulan' | 'tahun' | 'created_at' | 'updated_at'>): Promise<Kegiatan> {
    const res = await kegiatanApi.create(data)
    return res.data
  },
  
  async update(id: string, data: Partial<Kegiatan>): Promise<Kegiatan | null> {
    const res = await kegiatanApi.update(id, data)
    return res.data
  },
  
  async delete(id: string): Promise<void> {
    await kegiatanApi.delete(id)
  },
  
  async getById(id: string): Promise<Kegiatan | null> {
    try {
      const res = await kegiatanApi.getById(id)
      return res.data || null
    } catch {
      return null
    }
  },
  
  async getStats(): Promise<{ total: number; byStatus: Record<string, number> }> {
    try {
      const res = await kegiatanApi.getStats()
      return res.data || { total: 0, byStatus: {} }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      return { total: 0, byStatus: {} }
    }
  }
}

// ── BERITA ACARA STORE (ASYNC BACKEND CALLS) ──────────────────────────────────
export const beritaAcaraStore = {
  async getAll(): Promise<BeritaAcara[]> {
    try {
      const res = await beritaAcaraApi.getAll()
      return res.data || []
    } catch (err) {
      console.error('Failed to fetch berita acara:', err)
      return []
    }
  },
  
  async create(data: Omit<BeritaAcara, 'id' | 'nomor_ba' | 'status' | 'dibuat_oleh' | 'created_at' | 'updated_at'>, user?: any): Promise<BeritaAcara> {
    const res = await beritaAcaraApi.create(data)
    return res.data
  },
  
  async update(id: string, data: Partial<BeritaAcara>): Promise<BeritaAcara | null> {
    const res = await beritaAcaraApi.update(id, data)
    return res.data
  },
  
  async submit(id: string): Promise<BeritaAcara | null> {
    const res = await beritaAcaraApi.submit(id)
    return res.data
  },
  
  async approve(id: string, user: any, catatan?: string): Promise<BeritaAcara | null> {
    const res = await beritaAcaraApi.approve(id, catatan || 'Disetujui')
    return res.data
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      await beritaAcaraApi.delete(id)
      return true
    } catch {
      return false
    }
  },
  
  async getById(id: string): Promise<BeritaAcara | null> {
    try {
      const res = await beritaAcaraApi.getById(id)
      return res.data || null
    } catch {
      return null
    }
  },
  
  async getByKegiatan(kegiatanId: string): Promise<BeritaAcara[]> {
    try {
      const res = await beritaAcaraApi.getAll({ kegiatan_id: kegiatanId })
      return res.data || []
    } catch {
      return []
    }
  }
}

export const galeriStore = {
  async getAll(params?: any): Promise<Galeri[]> {
    try {
      const res = await galeriApi.getAll(params)
      return res.data || []
    } catch (err) {
      console.error('Failed to fetch galeri:', err)
      return []
    }
  },
  async getById(id: string): Promise<Galeri | null> {
    try {
      const res = await galeriApi.getById(id)
      return res.data || null
    } catch {
      return null
    }
  },
  async create(data: Omit<Galeri, 'id' | 'created_at' | 'updated_at'>): Promise<Galeri> {
    const res = await galeriApi.create(data)
    return res.data
  },
  async update(id: string, data: Partial<Galeri>): Promise<Galeri | null> {
    const res = await galeriApi.update(id, data)
    return res.data
  },
  async delete(id: string): Promise<boolean> {
    try {
      await galeriApi.delete(id)
      return true
    } catch {
      return false
    }
  }
}

export const anggotaStore = {
  async getAll(): Promise<Anggota[]> {
    try {
      const res = await authApi.getMembers()
      return res.data || []
    } catch (err) {
      console.error('Failed to fetch members:', err)
      return []
    }
  }
}
