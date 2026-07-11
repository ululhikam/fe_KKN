// Central API service — connects Vue frontend to Express backend
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE = (import.meta.env.VITE_API_URL as string) || 
  (isLocal ? 'http://localhost:3001/api' : 'https://be-kkn.vercel.app/api');

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('kkn_token')
  const headers = { 'Content-Type': 'application/json', ...options.headers } as Record<string, string>
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const json = await res.json()

  if (res.status === 401) {
    localStorage.removeItem('kkn_token')
    localStorage.removeItem('kkn_user')
  }
  if (!res.ok) throw new Error(json.message || 'Request gagal')
  return json
}

// ── AUTH ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
  refresh: (refreshToken: string) =>
    request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  getMembers: () => request('/auth/members'),
}

// ── KEGIATAN ─────────────────────────────────────────────────────────────
export const kegiatanApi = {
  getAll: (params: Record<string, any> = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/kegiatan?${q}`)
  },
  getById: (id: string) => request(`/kegiatan/${id}`),
  getStats: () => request('/kegiatan/stats/summary'),
  create: (data: any) =>
    request('/kegiatan', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`/kegiatan/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    request(`/kegiatan/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: string) =>
    request(`/kegiatan/${id}`, { method: 'DELETE' }),
}

// ── BERITA ACARA ─────────────────────────────────────────────────────────
export const beritaAcaraApi = {
  getAll: (params: Record<string, any> = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/berita-acara?${q}`)
  },
  getById: (id: string) => request(`/berita-acara/${id}`),
  create: (data: any) =>
    request('/berita-acara', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`/berita-acara/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  submit: (id: string) =>
    request(`/berita-acara/${id}/submit`, { method: 'PATCH' }),
  approve: (id: string, catatanPersetujuan: string) =>
    request(`/berita-acara/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ catatan_persetujuan: catatanPersetujuan }) }),
  delete: (id: string) =>
    request(`/berita-acara/${id}`, { method: 'DELETE' }),
}

// ── GALERI ───────────────────────────────────────────────────────────────
export const galeriApi = {
  getAll: (params: Record<string, any> = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/galeri?${q}`)
  },
  getById: (id: string) => request(`/galeri/${id}`),
  create: (data: any) =>
    request('/galeri', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`/galeri/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/galeri/${id}`, { method: 'DELETE' }),
}

export default { authApi, kegiatanApi, beritaAcaraApi, galeriApi }
