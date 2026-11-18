<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../lib/api'

const auth = useAuthStore()
const router = useRouter()
const leads = ref([])
const stats = ref({ total: 0, byStatus: {} })
const pagination = ref({ page: 1, limit: 20, total: 0, lastPage: 1 })
const search = ref('')
const status = ref('')
const loading = ref(false)
const error = ref('')

const statuses = ['new', 'contacted', 'qualified', 'converted', 'rejected']
const date = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

async function loadLeads() {
  loading.value = true
  error.value = ''
  try {
    const params = { page: pagination.value.page, limit: pagination.value.limit }
    if (search.value.trim()) params.search = search.value.trim()
    if (status.value) params.status = status.value
    const [list, summary] = await Promise.all([
      api.get('/api/v1/leads', { params }),
      api.get('/api/v1/leads/stats'),
    ])
    leads.value = list.data.data
    pagination.value = list.data.pagination
    stats.value = summary.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load leads.'
  } finally {
    loading.value = false
  }
}

function searchLeads() {
  pagination.value.page = 1
  loadLeads()
}

async function logout() {
  await auth.logout()
  router.replace('/admin/login')
}

onMounted(loadLeads)
</script>

<template>
  <main class="admin-shell">
    <header class="admin-header">
      <RouterLink class="brand" to="/">Lead<span>Desk</span></RouterLink>
      <div class="admin-user"><span>{{ auth.admin?.name }}</span><button class="button button-quiet" @click="logout">Sign out</button></div>
    </header>

    <section class="admin-content">
      <div class="page-heading">
        <div><p class="eyebrow">OVERVIEW</p><h1>Enquiries</h1><p class="muted">Review and manage incoming enquiries.</p></div>
      </div>

      <div class="stats-grid">
        <article class="stat-card"><span>Total enquiries</span><strong>{{ stats.total }}</strong></article>
        <article v-for="item in statuses" :key="item" class="stat-card"><span>{{ item }}</span><strong>{{ stats.byStatus[item] || 0 }}</strong></article>
      </div>

      <section class="table-panel">
        <div class="panel-heading"><div><h2>All enquiries</h2><p class="muted">{{ pagination.total }} records</p></div></div>
        <form class="filters" @submit.prevent="searchLeads">
          <input v-model="search" placeholder="Search name, email, phone..." aria-label="Search enquiries" />
          <select v-model="status" aria-label="Filter by status"><option value="">All statuses</option><option v-for="item in statuses" :key="item" :value="item">{{ item }}</option></select>
          <button class="button button-primary">Apply filters</button>
        </form>
        <p v-if="error" class="notice error">{{ error }}</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Contact</th><th>Phone</th><th>Company</th><th>Status</th><th>Submitted</th><th></th></tr></thead>
            <tbody>
              <tr v-if="loading"><td colspan="6" class="empty-cell">Loading enquiries...</td></tr>
              <tr v-else-if="!leads.length"><td colspan="6" class="empty-cell">No enquiries found.</td></tr>
              <tr v-for="lead in leads" :key="lead.id">
                <td><strong>{{ lead.name }}</strong><small>{{ lead.email }}</small></td>
                <td>{{ lead.phone }}</td><td>{{ lead.company || '—' }}</td>
                <td><span class="status-pill" :class="'status-' + lead.status">{{ lead.status }}</span></td>
                <td>{{ date(lead.createdAt) }}</td>
                <td><RouterLink class="view-link" :to="'/admin/leads/' + lead.id">View →</RouterLink></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <span>Page {{ pagination.page }} of {{ pagination.lastPage }}</span>
          <div><button class="button button-quiet" :disabled="pagination.page <= 1 || loading" @click="pagination.page--; loadLeads()">Previous</button><button class="button button-quiet" :disabled="pagination.page >= pagination.lastPage || loading" @click="pagination.page++; loadLeads()">Next</button></div>
        </div>
      </section>
    </section>
  </main>
</template>
