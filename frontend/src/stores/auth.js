import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  
  // Check if user has specific role
  const hasRole = (role) => {
    if (!user.value) return false
    if (Array.isArray(role)) {
      return role.includes(user.value.role)
    }
    return user.value.role === role
  }

  // Actions
  // Login the user
  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      setAuth(response.data)
      router.push('/')
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Check if user is already authenticated
  function checkAuth() {
    if (token.value) {
      // Set the authorization header for all subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      return true
    }
    return false
  }

  // Logout the user
  function logout() {
    // Clear authentication data
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Remove authorization header
    delete api.defaults.headers.common['Authorization']
    
    // Redirect to login
    router.push('/login')
  }

  // Set authentication data after successful login
  function setAuth(data) {
    token.value = data.accessToken
    user.value = data.user
    
    // Store in localStorage
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    // Set the authorization header for all subsequent requests
    api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    hasRole,
    login,
    logout,
    checkAuth,
  }
})