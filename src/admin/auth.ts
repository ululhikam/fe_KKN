import { authApi } from '../services/api.js'

export interface AdminUser {
  email: string
  name: string
  role: 'admin' | 'member'
  nim: string
  jabatan: string
  prodi: string
}

const USER_KEY = 'kkn_admin_user'

export async function login(email: string, password: string): Promise<{ success: boolean; message?: string; user?: AdminUser }> {
  try {
    const res = await authApi.login(email, password)
    if (res.success && res.data) {
      localStorage.setItem('kkn_token', res.data.accessToken)
      if (res.data.refreshToken) {
        localStorage.setItem('kkn_refresh_token', res.data.refreshToken)
      }
      
      const safeUser: AdminUser = {
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role,
        nim: res.data.user.nim || '',
        jabatan: res.data.user.division || '',
        prodi: res.data.user.prodi || ''
      }
      
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
      return { success: true, user: safeUser }
    }
    return { success: false, message: res.message || 'Login gagal' }
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi ke server gagal' }
  }
}

export function logout(): void {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem('kkn_token')
  localStorage.removeItem('kkn_refresh_token')
}

export function getUser(): AdminUser | null {
  try {
    const val = localStorage.getItem(USER_KEY)
    return val ? JSON.parse(val) : null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return !!getUser()
}

export function isAdmin(): boolean {
  return getUser()?.role === 'admin'
}
