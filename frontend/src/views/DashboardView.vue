<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../stores/employee'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const departments = ref([])
const activeDepartment = ref(null)

// Computed properties
const user = computed(() => authStore.user)
const canManageEmployees = computed(() => ['admin', 'hr', 'manager'].includes(user.value?.role))

// Methods
const fetchDepartmentStats = async () => {
  isLoading.value = true
  try {
    // Fetch all employees
    await employeeStore.fetchEmployees()
    
    // Group employees by department
    const deptMap = new Map()
    
    employeeStore.employees.forEach(emp => {
      if (!deptMap.has(emp.department)) {
        deptMap.set(emp.department, {
          name: emp.department,
          count: 0,
          active: 0,
          inactive: 0
        })
      }
      
      const deptData = deptMap.get(emp.department)
      deptData.count++
      
      if (emp.isActive) {
        deptData.active++
      } else {
        deptData.inactive++
      }
    })
    
    // Convert to array and sort by count
    departments.value = Array.from(deptMap.values())
      .sort((a, b) => b.count - a.count)
    
  } catch (error) {
    console.error('Failed to fetch department statistics:', error)
  } finally {
    isLoading.value = false
  }
}

const viewDepartment = (dept) => {
  activeDepartment.value = dept.name
  router.push({ 
    name: 'employees', 
    query: { department: dept.name } 
  })
}

const addNewEmployee = () => {
  router.push({ name: 'new-employee' })
}

const viewAllEmployees = () => {
  router.push({ name: 'employees' })
}

// Lifecycle
onMounted(() => {
  fetchDepartmentStats()
})
</script>

<template>
  <div class="container">
    <h1 class="dashboard-title">Dashboard</h1>
    
    <div class="dashboard-welcome">
      <h2>Welcome, {{ user.username }}!</h2>
      <p>Here's an overview of the bank's employee distribution.</p>
    </div>
    
    <div class="dashboard-actions" v-if="canManageEmployees">
      <button @click="addNewEmployee" class="btn btn-success">
        Add New Employee
      </button>
      <button @click="viewAllEmployees" class="btn">
        View All Employees
      </button>
    </div>
    
    <div v-if="isLoading" class="loading-indicator">
      Loading department statistics...
    </div>
    
    <div v-else class="dashboard-grid">
      <div class="dashboard-card stats-card">
        <h3>Employee Statistics</h3>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{ employeeStore.employees.length }}</span>
            <span class="stat-label">Total Employees</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ employeeStore.employees.filter(e => e.isActive).length }}</span>
            <span class="stat-label">Active Employees</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ departments.length }}</span>
            <span class="stat-label">Departments</span>
          </div>
        </div>
      </div>
      
      <div class="dashboard-card">
        <h3>Departments</h3>
        <div class="departments-list">
          <div 
            v-for="dept in departments" 
            :key="dept.name" 
            class="department-item"
            @click="viewDepartment(dept)"
          >
            <div class="department-info">
              <h4 class="department-name">{{ dept.name }}</h4>
              <span class="department-count">{{ dept.count }} employees</span>
            </div>
            <div class="department-stats">
              <div class="stat-bar">
                <div 
                  class="stat-bar-active" 
                  :style="`width: ${(dept.active / dept.count) * 100}%`"
                ></div>
              </div>
              <div class="stat-numbers">
                <span class="active-count">{{ dept.active }} active</span>
                <span v-if="dept.inactive > 0" class="inactive-count">{{ dept.inactive }} inactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-title {
  margin-bottom: 20px;
}

.dashboard-welcome {
  margin-bottom: 30px;
}

.dashboard-welcome h2 {
  margin-bottom: 5px;
  font-size: 1.5rem;
}

.dashboard-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.loading-indicator {
  text-align: center;
  padding: 30px;
  color: #6c757d;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.dashboard-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.dashboard-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #007bff;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 5px;
}

.departments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.department-item {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.department-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.department-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.department-name {
  margin: 0;
  font-size: 1rem;
}

.department-count {
  font-size: 0.8rem;
  color: #6c757d;
}

.stat-bar {
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 5px;
}

.stat-bar-active {
  height: 100%;
  background-color: #28a745;
}

.stat-numbers {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.active-count {
  color: #28a745;
}

.inactive-count {
  color: #dc3545;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>