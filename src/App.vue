<template>
  <div class="min-h-screen bg-white mx-auto max-w-md">
    <router-view />
  </div>
</template>

<script>
import { authService } from './services/auth'

export default {
  name: 'App',
  created() {
    // Kiểm tra xác thực khi ứng dụng khởi động
    this.checkAuth()
    
    // Thêm sự kiện lắng nghe khi token thay đổi
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    // Xóa sự kiện lắng nghe khi component bị hủy
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    async checkAuth() {
      // Kiểm tra xem có token không
      const isAuthenticated = authService.isAuthenticated()
      
      if (isAuthenticated) {
        // Nếu có token, kiểm tra tính hợp lệ của token
        try {
          await authService.checkTokenValidity()
        } catch (error) {
          console.error('Token validation error:', error)
        }
      }
      
      // Kiểm tra lại sau khi đã validate token
      const stillAuthenticated = authService.isAuthenticated()
      const currentRoute = this.$router.currentRoute.value
      
      // Nếu route yêu cầu xác thực và người dùng chưa đăng nhập
      if (currentRoute.meta && currentRoute.meta.requiresAuth && !stillAuthenticated) {
        this.$router.push({
          path: '/login',
          query: { redirect: currentRoute.fullPath }
        })
      }
    },
    handleStorageChange(event) {
      // Nếu token bị thay đổi (ví dụ: bị xóa trong tab khác)
      if (event.key === 'token' && !event.newValue) {
        this.checkAuth()
      }
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: white;
}

/* Exact styles from develop-vn.net */
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(1px);
}
</style>