import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { authService } from '../services/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/trends',
    name: 'Trends',
    component: () => import('../views/Trends.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('../views/Member.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/Chat.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('../views/ChangePassword.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bank-cards',
    name: 'BankCards',
    component: () => import('../views/BankCards.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: () => import('../views/Withdraw.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated() // Check if user is authenticated
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If route requires auth and user is not authenticated, redirect to login
    if (!isAuthenticated) {
      // Lưu lại trang mà người dùng đang cố gắng truy cập
      const redirectPath = to.fullPath;
      next({ path: '/login', query: { redirect: redirectPath } })
    } else {
      next()
    }
  } else {
    // If route doesn't require auth or user is authenticated
    if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      // If user is authenticated and tries to access login or register, redirect to home
      next('/')
    } else {
      next()
    }
  }
})

export default router