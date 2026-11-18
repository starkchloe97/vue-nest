<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../lib/api'

const form = reactive({ name: '', email: '', phone: '', company: '', message: '' })
const loading = ref(false)
const success = ref('')
const error = ref('')

async function submitLead() {
  loading.value = true
  success.value = ''
  error.value = ''
  try {
    await api.post('/api/v1/leads', form)
    success.value = 'Your enquiry has been submitted. We will contact you soon.'
    Object.assign(form, { name: '', email: '', phone: '', company: '', message: '' })
  } catch (err) {
    const errors = err.response?.data?.errors
    error.value = errors
      ? Object.values(errors).flat().join(' ')
      : (err.response?.data?.message || 'Unable to submit your enquiry. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="public-shell">
    <header class="site-header">
      <a class="brand" href="/">Lead<span>Desk</span></a>
      <RouterLink class="button button-quiet" to="/admin/login">Admin login</RouterLink>
    </header>

    <section class="hero-section">
      <div class="hero-copy">
        <p class="eyebrow">LET'S WORK TOGETHER</p>
        <h1>Tell us what<br />you <span>need.</span></h1>
        <p class="hero-description">Share a few details about your project or enquiry. Our team will review your request and get back to you.</p>
        <div class="trust-note"><span class="trust-dot"></span> Every enquiry is reviewed by our team</div>
      </div>

      <form class="lead-form" @submit.prevent="submitLead">
        <div class="form-heading">
          <p class="eyebrow">CONTACT FORM</p>
          <h2>Send an enquiry</h2>
          <p>Fields marked with * are required.</p>
        </div>
        <div class="field-grid">
          <label>Full name *<input v-model.trim="form.name" required minlength="2" maxlength="120" placeholder="Your name" /></label>
          <label>Email address *<input v-model.trim="form.email" required type="email" maxlength="190" placeholder="you@example.com" /></label>
          <label>Phone number *<input v-model.trim="form.phone" required minlength="6" maxlength="40" placeholder="+1 555 000 0000" /></label>
          <label>Company <span class="optional">Optional</span><input v-model.trim="form.company" maxlength="160" placeholder="Company name" /></label>
        </div>
        <label>How can we help? *<textarea v-model.trim="form.message" required minlength="5" maxlength="5000" rows="5" placeholder="Tell us a little about what you need..."></textarea></label>
        <p v-if="success" class="notice success" role="status">{{ success }}</p>
        <p v-if="error" class="notice error" role="alert">{{ error }}</p>
        <button class="button button-primary submit-button" :disabled="loading">
          {{ loading ? 'Submitting...' : 'Submit enquiry' }} <span aria-hidden="true">→</span>
        </button>
        <p class="form-footnote">Your information is only used to respond to this enquiry.</p>
      </form>
    </section>
    <footer class="site-footer"><span>© {{ new Date().getFullYear() }} LeadDesk</span><span>We’ll be in touch.</span></footer>
  </main>
</template>
