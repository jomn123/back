<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEmployeeStore } from '../stores/employee'
import { useAuthStore } from '../stores/auth'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()
const route = useRoute()
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const errorMessage = ref('')
const showDeleteConfirm = ref(false)

// Get employee ID from route params
const employeeId = route.params.id

// Computed properties
const employee = computed(() => employeeStore.currentEmployee)

// Check user permissions
const canEdit = computed(() => {
  return ['admin', 'hr', 'manager'].includes(authStore.user?.role)
})

const canDelete = computed(() => {
  return ['admin', 'hr'].includes(authStore.user?.role)
})

// Methods
const editEmployee = () => {
  router.push({ name: 'edit-employee', params: { id: employeeId } })
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteEmployee = async () => {
  try {
    await employeeStore.deleteEmployee(employeeId)
    router.push({ name: 'employees' })
  } catch (error) {
    errorMessage.value = 'Failed to delete employee'
    console.error(error)
  }
}

const goBack = () => {
  router.push({ name: 'employees' })
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  isLoading.value = true
  try {
    await employeeStore.fetchEmployee(employeeId)
  } catch (error) {
    errorMessage.value = 'Failed to load employee data'
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container">
    <div class="page-header">
      <button @click="goBack" class="btn btn-back">
        &larr; Back to Employees
      </button>
    </div>
    
    <div v-if="isLoading" class="loading-indicator">
      Loading employee data...
    </div>
    
    <div v-else-if="errorMessage" class="error-container">
      <div class="alert alert-danger">{{ errorMessage }}</div>
    </div>
    
    <div v-else-if="employee" class="employee-detail-container">
      <div class="employee-header">
        <div class="employee-title">
          <h1>{{ employee.firstName }} {{ employee.lastName }}</h1>
          <span 
            class="employee-status" 
            :class="employee.isActive ? 'status-active' : 'status-inactive'"
          >
            {{ employee.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
        
        <div class="employee-actions" v-if="canEdit || canDelete">
          <button v-if="canEdit" @click="editEmployee" class="btn">
            Edit
          </button>
          <button v-if="canDelete" @click="confirmDelete" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
      
      <div class="employee-card">
        <div class="card-section">
          <h2>Personal Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">{{ employee.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone</span>
              <span class="info-value">{{ employee.phone || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Address</span>
              <span class="info-value">{{ employee.address || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Birth</span>
              <span class="info-value">{{ formatDate(employee.dateOfBirth) }}</span>
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h2>Employment Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Department</span>
              <span class="info-value">{{ employee.department }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Position</span>
              <span class="info-value">{{ employee.position }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Hire</span>
              <span class="info-value">{{ formatDate(employee.dateOfHire) }}</span>
            </div>
            <div class="info-item" v-if="canEdit">
              <span class="info-label">Salary</span>
              <span class="info-value">{{ employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Confirm Delete"
      message="Are you sure you want to delete this employee? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="deleteEmployee"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.btn-back {
  background-color: transparent;
  color: #007bff;
  padding: 0;
  border: none;
}

.btn-back:hover {
  background-color: transparent;
  color: #0056b3;
  text-decoration: underline;
}

.loading-indicator {
  text-align: center;
  padding: 30px;
  color: #6c757d;
}

.error-container {
  max-width: 600px;
  margin: 30px auto;
}

.employee-detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.employee-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.employee-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.employee-title h1 {
  margin: 0;
  font-size: 1.8rem;
}

.employee-status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.employee-actions {
  display: flex;
  gap: 10px;
}

.employee-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-section {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.card-section:last-child {
  border-bottom: none;
}

.card-section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 4px;
}

.info-value {
  font-weight: 500;
}

@media (max-width: 600px) {
  .employee-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>