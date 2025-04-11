<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../stores/employee'
import { useAuthStore } from '../stores/auth'
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps({
  filter: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const selectedDepartment = ref('')
const showOnlyActive = ref(true)
const showDeleteConfirm = ref(false)
const employeeToDelete = ref(null)

// Get filtered employees
const filteredEmployees = computed(() => {
  return employeeStore.employees.filter(employee => {
    // Filter by search query
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filter by department
    const matchesDepartment = !selectedDepartment.value || employee.department === selectedDepartment.value
    
    // Filter by active status
    const matchesActive = !showOnlyActive.value || employee.isActive
    
    return matchesSearch && matchesDepartment && matchesActive
  })
})

// Check user permissions
const canEdit = computed(() => {
  return ['admin', 'hr', 'manager'].includes(authStore.user?.role)
})

const canDelete = computed(() => {
  return ['admin', 'hr'].includes(authStore.user?.role)
})

// Methods
const viewEmployee = (id) => {
  router.push({ name: 'employee-detail', params: { id } })
}

const editEmployee = (id) => {
  router.push({ name: 'edit-employee', params: { id } })
}

const confirmDelete = (employee) => {
  employeeToDelete.value = employee
  showDeleteConfirm.value = true
}

const deleteEmployee = async () => {
  if (!employeeToDelete.value) return
  
  try {
    await employeeStore.deleteEmployee(employeeToDelete.value.id)
    showDeleteConfirm.value = false
    employeeToDelete.value = null
  } catch (error) {
    console.error('Failed to delete employee:', error)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDepartment.value = ''
  showOnlyActive.value = true
}

// Lifecycle
onMounted(async () => {
  try {
    await employeeStore.fetchEmployees(props.filter)
  } catch (error) {
    console.error('Failed to fetch employees:', error)
  }
})
</script>

<template>
  <div class="employee-list">
    <div class="filters-container">
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search employees..."
          class="form-control search-input"
        />
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label for="department-filter">Department:</label>
          <select id="department-filter" v-model="selectedDepartment" class="form-control">
            <option value="">All Departments</option>
            <option v-for="dept in employeeStore.departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="showOnlyActive" />
            Show only active employees
          </label>
        </div>
        
        <button @click="resetFilters" class="btn btn-sm">Reset Filters</button>
      </div>
    </div>
    
    <div v-if="employeeStore.loading" class="loading-indicator">
      Loading employees...
    </div>
    
    <div v-else-if="filteredEmployees.length === 0" class="no-results">
      No employees found matching your criteria.
    </div>
    
    <table v-else class="table employee-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>Department</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in filteredEmployees" :key="employee.id" :class="{ 'inactive': !employee.isActive }">
          <td>{{ employee.firstName }} {{ employee.lastName }}</td>
          <td>{{ employee.position }}</td>
          <td>{{ employee.department }}</td>
          <td>{{ employee.email }}</td>
          <td>
            <span class="status-badge" :class="employee.isActive ? 'active' : 'inactive'">
              {{ employee.isActive ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="actions">
            <button @click="viewEmployee(employee.id)" class="btn btn-sm">View</button>
            <button 
              v-if="canEdit" 
              @click="editEmployee(employee.id)" 
              class="btn btn-sm"
            >
              Edit
            </button>
            <button 
              v-if="canDelete" 
              @click="confirmDelete(employee)" 
              class="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
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
.employee-list {
  margin-top: 20px;
}

.filters-container {
  margin-bottom: 20px;
}

.search-container {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.employee-table th,
.employee-table td {
  vertical-align: middle;
}

.actions {
  display: flex;
  gap: 5px;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

tr.inactive {
  background-color: #f8f9fa;
  color: #6c757d;
}

.loading-indicator, .no-results {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}
</style>