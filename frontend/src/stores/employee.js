import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'

export const useEmployeeStore = defineStore('employee', () => {
  // State
  const employees = ref([])
  const currentEmployee = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getEmployeeById = (id) => {
    return employees.value.find(employee => employee.id === id)
  }

  const departments = computed(() => {
    const depts = new Set(employees.value.map(emp => emp.department))
    return Array.from(depts)
  })

  // Actions
  // Fetch all employees
  async function fetchEmployees(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams()
      
      // Add query parameters
      if (params.department) queryParams.append('department', params.department)
      if (params.managerId) queryParams.append('managerId', params.managerId)
      if (params.active !== undefined) queryParams.append('active', params.active)
      
      const queryString = queryParams.toString()
      const url = queryString ? `/employees?${queryString}` : '/employees'
      
      const response = await api.get(url)
      employees.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch employees'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch a single employee by ID
  async function fetchEmployee(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/employees/${id}`)
      currentEmployee.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || `Failed to fetch employee with ID ${id}`
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create a new employee
  async function createEmployee(employeeData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/employees', employeeData)
      employees.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create employee'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update an existing employee
  async function updateEmployee(id, employeeData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.patch(`/employees/${id}`, employeeData)
      
      // Update the employee in the list
      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        employees.value[index] = response.data
      }
      
      // Update current employee if it's the one being edited
      if (currentEmployee.value && currentEmployee.value.id === id) {
        currentEmployee.value = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || `Failed to update employee with ID ${id}`
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete an employee
  async function deleteEmployee(id) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/employees/${id}`)
      
      // Remove the employee from the list
      employees.value = employees.value.filter(emp => emp.id !== id)
      
      // Clear current employee if it's the one being deleted
      if (currentEmployee.value && currentEmployee.value.id === id) {
        currentEmployee.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || `Failed to delete employee with ID ${id}`
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    employees,
    currentEmployee,
    loading,
    error,
    getEmployeeById,
    departments,
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
})