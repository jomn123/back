<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useEmployeeStore } from '../stores/employee'

const props = defineProps({
  employee: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const employeeStore = useEmployeeStore()

// Define form fields
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  managerId: '',
  address: '',
  dateOfBirth: '',
  dateOfHire: '',
  isActive: true,
  salary: null
})

// Define validation errors
const errors = ref({})

// Constants
const departments = [
  'Retail Banking',
  'Corporate Banking',
  'Investment Banking',
  'Wealth Management',
  'Operations',
  'Information Technology',
  'Administration',
  'Human Resources',
  'Finance',
  'Risk Management',
  'Compliance',
  'Legal'
]

const positions = [
  'Associate',
  'Analyst',
  'Manager',
  'Senior Manager',
  'Director',
  'Vice President',
  'Senior Vice President',
  'Executive Vice President',
  'C-Suite Executive'
]

// Computed properties
const formTitle = computed(() => {
  return props.isEdit ? 'Edit Employee' : 'Add New Employee'
})

const submitButtonText = computed(() => {
  return props.isEdit ? 'Update Employee' : 'Create Employee'
})

const isSubmitting = computed(() => employeeStore.loading)

// Methods
const validate = () => {
  const newErrors = {}
  
  if (!form.value.firstName) {
    newErrors.firstName = 'First name is required'
  }
  
  if (!form.value.lastName) {
    newErrors.lastName = 'Last name is required'
  }
  
  if (!form.value.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    newErrors.email = 'Email is invalid'
  }
  
  if (!form.value.department) {
    newErrors.department = 'Department is required'
  }
  
  if (!form.value.position) {
    newErrors.position = 'Position is required'
  }
  
  if (form.value.salary && isNaN(Number(form.value.salary))) {
    newErrors.salary = 'Salary must be a number'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const submitForm = () => {
  if (!validate()) return
  
  // Create a copy of the form data
  const formData = { ...form.value }
  
  // Convert empty strings to null
  Object.keys(formData).forEach(key => {
    if (formData[key] === '') {
      formData[key] = null
    }
  })
  
  // Emit the submit event with the form data
  emit('submit', formData)
}

const cancelForm = () => {
  emit('cancel')
}

// Initialize form with employee data if in edit mode
const initForm = () => {
  if (props.employee) {
    form.value = {
      firstName: props.employee.firstName || '',
      lastName: props.employee.lastName || '',
      email: props.employee.email || '',
      phone: props.employee.phone || '',
      department: props.employee.department || '',
      position: props.employee.position || '',
      managerId: props.employee.managerId || '',
      address: props.employee.address || '',
      dateOfBirth: props.employee.dateOfBirth ? new Date(props.employee.dateOfBirth).toISOString().split('T')[0] : '',
      dateOfHire: props.employee.dateOfHire ? new Date(props.employee.dateOfHire).toISOString().split('T')[0] : '',
      isActive: props.employee.isActive ?? true,
      salary: props.employee.salary || ''
    }
  }
}

// Lifecycle
onMounted(() => {
  initForm()
})

// Watch for changes in employee prop
watch(() => props.employee, () => {
  initForm()
}, { deep: true })
</script>

<template>
  <div class="employee-form-wrapper">
    <h2 class="form-title">{{ formTitle }}</h2>
    
    <form @submit.prevent="submitForm" class="employee-form">
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            v-model="form.firstName"
            class="form-control"
            :class="{ 'is-invalid': errors.firstName }"
            required
          />
          <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
        </div>
        
        <div class="form-group">
          <label for="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            v-model="form.lastName"
            class="form-control"
            :class="{ 'is-invalid': errors.lastName }"
            required
          />
          <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            required
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>
        
        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            v-model="form.phone"
            class="form-control"
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="department">Department *</label>
          <select
            id="department"
            v-model="form.department"
            class="form-control"
            :class="{ 'is-invalid': errors.department }"
            required
          >
            <option value="" disabled>Select a department</option>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
          <div v-if="errors.department" class="error-message">{{ errors.department }}</div>
        </div>
        
        <div class="form-group">
          <label for="position">Position *</label>
          <select
            id="position"
            v-model="form.position"
            class="form-control"
            :class="{ 'is-invalid': errors.position }"
            required
          >
            <option value="" disabled>Select a position</option>
            <option v-for="pos in positions" :key="pos" :value="pos">
              {{ pos }}
            </option>
          </select>
          <div v-if="errors.position" class="error-message">{{ errors.position }}</div>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="dateOfHire">Date of Hire</label>
          <input
            type="date"
            id="dateOfHire"
            v-model="form.dateOfHire"
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="salary">Salary</label>
          <input
            type="number"
            id="salary"
            v-model="form.salary"
            class="form-control"
            :class="{ 'is-invalid': errors.salary }"
            min="0"
            step="0.01"
          />
          <div v-if="errors.salary" class="error-message">{{ errors.salary }}</div>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            v-model="form.dateOfBirth"
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            v-model="form.address"
            class="form-control"
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group status-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.isActive" />
            <span>Active Employee</span>
          </label>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="cancelForm" class="btn btn-cancel">
          Cancel
        </button>
        <button type="submit" class="btn btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : submitButtonText }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.employee-form-wrapper {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 20px;
}

.form-title {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.employee-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-group {
  margin-top: 5px;
}

label {
  margin-bottom: 5px;
  font-weight: 500;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn-cancel {
  background-color: #6c757d;
}

.btn-submit {
  background-color: #28a745;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
}
</style>