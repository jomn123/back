import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layout components
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import EmployeeDetailView from '../views/EmployeeDetailView.vue'
import EmployeeFormView from '../views/EmployeeFormView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/employees/:id',
      name: 'employee-detail',
      component: EmployeeDetailView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/employees/new',
      name: 'new-employee',
      component: EmployeeFormView,
      meta: { requiresAuth: true, roles: ['admin', 'hr', 'manager'] }
    },
    {
      path: '/employees/:id/edit',
      name: 'edit-employee',
      component: EmployeeFormView,
      props: true,
      meta: { requiresAuth: true, roles: ['admin', 'hr', 'manager'] }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRoles = to.meta.roles

  // Check if route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Check if route requires specific roles
  else if (requiresAuth && requiredRoles && !requiredRoles.includes(authStore.user?.role)) {
    next({ name: 'dashboard' }) // Redirect to dashboard if user doesn't have required role
  } 
  // Redirect to dashboard if authenticated user tries to access login
  else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } 
  // Allow navigation
  else {
    next()
  }
})

export default router