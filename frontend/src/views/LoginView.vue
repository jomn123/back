<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const redirectPath = route.query.redirect || '/'

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h1 class="login-title">Bank Employee Management System</h1>
        <p class="login-subtitle">Please sign in to continue</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="alert alert-danger" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Enter your email"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Enter your password"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="btn btn-login" :disabled="isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 25px;
}

.login-title {
  font-size: 1.6rem;
  color: #333;
  margin-bottom: 5px;
}

.login-subtitle {
  color: #777;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

.btn-login {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background-color: #28a745;
}

.btn-login:hover {
  background-color: #218838;
}
</style>