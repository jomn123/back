<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEmployeeStore } from '../stores/employee'
import EmployeeForm from '../components/EmployeeForm.vue'

const router = useRouter()
const route = useRoute()
const employeeStore = useEmployeeStore()

const employee = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const isEdit = ref(false)

// Get employee ID from route params
const employeeId = route.params.id

onMounted(async () => {
  // Check if we're in edit mode
  isEdit.value = !!employeeId
  
  // If editing, fetch the employee data
  if (isEdit.value) {
    isLoading.value = true
    try {
      await employeeStore.fetchEmployee(employeeId)
      employee.value = employeeStore.currentEmployee
    } catch (error) {
      errorMessage.value = 'Failed to load employee data'
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
})

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      await employeeStore.updateEmployee(employeeId, formData)
    } else {
      await employeeStore.createEmployee(formData)
    }
    router.push({ name: 'employees' })
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to save employee'
  }
}

const handleCancel = () => {
  router.push({ name: 'employees' })
}
</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading-indicator">
      Loading employee data...
    </div>
    
    <div v-else-if="errorMessage" class="error-container">
      <div class="alert alert-danger">{{ errorMessage }}</div>
      <button @click="router.push({ name: 'employees' })" class="btn">
        Back to Employees
      </button>
    </div>
    
    <div v-else>
      <EmployeeForm
        :employee="employee"
        :isEdit="isEdit"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<style scoped>
.loading-indicator {
  text-align: center;
  padding: 30px;
  color: #6c757d;
}

.error-container {
  max-width: 600px;
  margin: 30px auto;
  text-align: center;
}
</style>