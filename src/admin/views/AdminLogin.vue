<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email dan password wajib diisi'; return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 600)) // simulasi delay
  const result = await login(email.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/admin/dashboard')
  } else {
    error.value = result.message
  }
}
</script>

<template>
  <div class="admin-login-page">
    <div class="login-bg">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
      <div class="blob b3"></div>
    </div>

    <div class="login-card">
      <div class="login-logo">
        <div class="logo-text">P4</div>
        <h1>KKN Padepokan 4</h1>
        <p>Admin Panel · Desa Katekan, Gantiwarno</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="ulul@kkn-padepokan.ac.id"
            autocomplete="email"
            required
          />
        </div>

        <div class="field">
          <label>Password</label>
          <div class="pass-wrap">
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <button type="button" class="pass-eye" @click="showPass = !showPass">
              {{ showPass ? 'Sembunyikan' : 'Lihat' }}
            </button>
          </div>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="!loading">Masuk ke Panel Admin</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <div class="login-hint">
        <span>DPL: Dr. Oktaviani Windra Puspita, M.Pd.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1rem;
}

.login-bg { position: fixed; inset: 0; pointer-events: none; }
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.12;
}
.b1 { width: 500px; height: 500px; background: #7c3aed; top: -120px; left: -120px; }
.b2 { width: 400px; height: 400px; background: #0ea5e9; bottom: -100px; right: -80px; }
.b3 { width: 300px; height: 300px; background: #10b981; top: 40%; left: 40%; }

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  padding: 3rem 2.25rem;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
}

.login-logo {
  text-align: center;
  margin-bottom: 2.25rem;
}
.logo-text {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.1em;
  width: 68px; height: 68px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #7c3aed, #0ea5e9);
  border-radius: 16px;
  margin: 0 auto 1.25rem;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.25);
}
.login-logo h1 { font-size: 1.5rem; font-weight: 850; color: #0f172a; margin-bottom: 0.35rem; letter-spacing: -0.01em; }
.login-logo p { font-size: 0.8rem; color: #64748b; font-weight: 500; }

.login-form { display: flex; flex-direction: column; gap: 1.25rem; }

.field { display: flex; flex-direction: column; gap: 0.45rem; }
.field label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
.field input {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #0f172a;
  font-size: 0.9rem;
  font-family: inherit;
  width: 100%;
  transition: all 0.2s ease;
}
.field input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}
.field input::placeholder { color: #94a3b8; }

.pass-wrap { position: relative; }
.pass-wrap input { padding-right: 5rem; }
.pass-eye {
  position: absolute; right: 1rem; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  font-size: 0.72rem; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.05em;
  transition: color 0.15s ease;
}
.pass-eye:hover { color: #7c3aed; }

.error-msg {
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #dc2626;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 600;
}

.btn-login {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.85rem;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%;
  margin-top: 0.25rem;
}
.btn-login:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
}
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

.login-hint { text-align: center; margin-top: 1.5rem; font-size: 0.72rem; color: #64748b; font-weight: 500; }
</style>
