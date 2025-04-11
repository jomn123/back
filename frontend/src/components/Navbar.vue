<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
}

const isAdmin = computed(() => user.value?.role === 'admin')
const isHR = computed(() => user.value?.role === 'hr')
const isManager = computed(() => ['admin', 'hr', 'manager'].includes(user.value?.role))
</script>

<template>
  <header class="navbar">
    <div class="container navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-logo">Bank EMS</router-link>
      </div>
      
      <nav class="navbar-menu">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/employees" class="nav-link">Employees</router-link>
          </li>
          <li class="nav-item" v-if="isManager">
            <router-link to="/employees/new" class="nav-link">Add Employee</router-link>
          </li>
        </ul>
      </nav>
      
      <div class="navbar-user">
        <span class="user-info" v-if="user">
          {{ user.username }} ({{ user.role }})
        </span>
        <button @click="logout" class="btn btn-sm">Logout</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: #343a40;
  color: white;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  color: white;
  font-size: 1.4rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar-nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-right: 15px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 5px;
  transition: color 0.2s;
}

.nav-link:hover, .router-link-active {
  color: white;
}

.navbar-user {
  display: flex;
  align-items: center;
}

.user-info {
  margin-right: 15px;
  font-size: 0.9rem;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.8rem;
}
</style>