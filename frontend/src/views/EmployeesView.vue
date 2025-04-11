<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import EmployeeList from '../components/EmployeeList.vue'

const router = useRouter()
const authStore = useAuthStore()

const addNewEmployee = () => {
  router.push({ name: 'new-employee' })
}

const canAddEmployee = ['admin', 'hr', 'manager'].includes(authStore.user?.role)
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1>Employees</h1>
      <button v-if="canAddEmployee" @click="addNewEmployee" class="btn btn-success">
        Add New Employee
      </button>
    </div>
    
    <EmployeeList />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 1.8rem;
}
</style>