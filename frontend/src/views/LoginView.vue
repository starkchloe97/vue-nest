<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function login() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form)
    router.replace(typeof route.query.redirect === 'string' ? route.query.redirect : '/admin')
  } catch (err) {
    error.value = err.response?.data?.message || 'Unable to sign in. Check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="auth-card">
      <RouterLink class="brand" to="/">Lead<span>Desk</span></RouterLink>
      <p class="eyebrow">ADMINISTRATION</p>
      <h1>Welcome back</h1>
      <p class="muted">Sign in to manage submitted enquiries.</p>
      <form class="stack-form" @submit.prevent="login">
        <label>Email address<input v-model.trim="form.email" type="email" required autocomplete="username" /></label>
        <label>Password<input v-model="form.password" type="password" required autocomplete="current-password" /></label>
        <p v-if="error" class="notice error" role="alert">{{ error }}</p>
        <button class="button button-primary" :disabled="loading">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
      </form>
      <RouterLink class="back-link" to="/">← Back to website</RouterLink>
    </section>
  </main>
</template>
