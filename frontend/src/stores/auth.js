import { defineStore } from 'pinia'
import api from '../lib/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({ admin: null, initialized: false }),
  getters: { isAuthenticated: (state) => Boolean(state.admin) },
  actions: {
    async fetchMe() {
      try {
        const { data } = await api.get('/api/v1/auth/me')
        this.admin = data.admin
        return true
      } catch {
        this.admin = null
        return false
      } finally {
        this.initialized = true
      }
    },
    async login(credentials) {
      const { data } = await api.post('/api/v1/auth/login', credentials)
      this.admin = data.admin
      this.initialized = true
    },
    async logout() {
      try {
        await api.post('/api/v1/auth/logout')
      } finally {
        this.admin = null
        this.initialized = true
      }
    },
  },
})
