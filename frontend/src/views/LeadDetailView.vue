<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '../lib/api'

const route = useRoute()
const lead = ref(null)
const status = ref('')
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const statuses = ['new', 'contacted', 'qualified', 'converted', 'rejected']

async function load() {
  try {
    const { data } = await api.get('/api/v1/leads/' + route.params.id)
    lead.value = data
    status.value = data.status
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load this enquiry.'
  } finally {
    loading.value = false
  }
}

async function saveStatus() {
  saving.value = true
  error.value = ''
  try {
    const { data } = await api.patch('/api/v1/leads/' + route.params.id + '/status', { status: status.value })
    lead.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not update status.'
  } finally {
    saving.value = false
  }
}

const date = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value))
onMounted(load)
</script>

<template>
  <main class="admin-shell">
    <header class="admin-header"><RouterLink class="brand" to="/">Lead<span>Desk</span></RouterLink><RouterLink class="button button-quiet" to="/admin">← All enquiries</RouterLink></header>
    <section class="detail-content">
      <p class="eyebrow">ENQUIRY DETAILS</p>
      <h1>Enquiry #{{ route.params.id }}</h1>
      <p v-if="loading" class="muted">Loading enquiry...</p>
      <p v-if="error" class="notice error">{{ error }}</p>
      <article v-if="lead" class="detail-card">
        <div class="detail-top"><div><h2>{{ lead.name }}</h2><p class="muted">Submitted {{ date(lead.createdAt) }}</p></div><span class="status-pill" :class="'status-' + lead.status">{{ lead.status }}</span></div>
        <div class="detail-grid"><div><span>Email</span><a :href="'mailto:' + lead.email">{{ lead.email }}</a></div><div><span>Phone</span><a :href="'tel:' + lead.phone">{{ lead.phone }}</a></div><div><span>Company</span><strong>{{ lead.company || '—' }}</strong></div></div>
        <div class="message-block"><span>Message</span><p>{{ lead.message }}</p></div>
        <form class="status-form" @submit.prevent="saveStatus"><label>Update status<select v-model="status"><option v-for="item in statuses" :key="item" :value="item">{{ item }}</option></select></label><button class="button button-primary" :disabled="saving || status === lead.status">{{ saving ? 'Saving...' : 'Save status' }}</button></form>
      </article>
    </section>
  </main>
</template>
