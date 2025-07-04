<template>
  <main class="flex flex-col bg-[#08224C] min-h-screen">
    <!-- Back button -->
    <button 
      @click="goBack" 
      class="absolute top-4 left-4 text-white"
      type="button"
    >
      <svg class="w-6 h-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z" fill="currentColor"></path>
      </svg>
    </button>
    
    <!-- Thông báo xác nhận đăng xuất khi đã đăng nhập -->
    <div v-if="showLogoutConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4 text-blue-600">Bạn đã đăng nhập</h3>
        <p class="mb-4">
          Bạn đang đăng nhập với tài khoản <strong>{{ currentUser?.name }}</strong>.
          Bạn cần đăng xuất trước khi đăng ký tài khoản mới.
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showLogoutConfirm = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button 
            @click="handleLogoutAndRegister" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Đăng xuất và tiếp tục
          </button>
        </div>
      </div>
    </div>
    
    <!-- Header section with logo, title and image -->
    <div class="h-[140px] flex flex-col justify-center items-center w-full relative mt-[40px]">
      <!-- Logo and develop-vn text -->
      <div class="flex justify-center items-center space-x-2">
        <div class="text-white font-[Lemonada] flex items-center justify-center rounded-full w-[44px] h-[44px] text-[40px]">d</div>
        <span class="font-[Lemonada] text-[28px] text-white">develop-vn</span>
      </div>
      <!-- Register text -->
      <div class="text-[24px] text-white">Đăng ký</div>
      <!-- Image positioned absolutely -->
      <img src="/images/Auth.Register.1e833f7f9fd3e45635a7.png" alt="register-icon"
           class="absolute top-[-10px] right-[20px] w-[120px]" />
    </div>

    <!-- Form section -->
    <div class="flex flex-col space-y-10 bg-white rounded-[24px] px-[24px] py-[36px] mx-auto w-[90%] max-w-[700px]">
      <!-- Username input -->
      <div class="w-full">
        <label class="block text-blue-600 text-sm font-medium mb-1" for="username">Tài khoản</label>
        <div class="relative border-b border-gray-300 focus-within:border-blue-500 transition-colors">
          <input 
            id="username" 
            name="username" 
            type="text" 
            v-model="username"
            class="w-full py-2 outline-none text-gray-800" 
          />
        </div>
      </div>

      <!-- Password input -->
      <div class="w-full">
        <label class="block text-blue-600 text-sm font-medium mb-1" for="password">Mật khẩu</label>
        <div class="relative border-b border-gray-300 focus-within:border-blue-500 transition-colors">
          <input 
            id="password" 
            name="password" 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password"
            class="w-full py-2 pr-10 outline-none text-gray-800" 
          />
          <button 
            type="button" 
            @click="togglePasswordVisibility"
            class="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Confirm Password input -->
      <div class="w-full">
        <label class="block text-blue-600 text-sm font-medium mb-1" for="confirmPassword">Xác nhận mật khẩu</label>
        <div class="relative border-b border-gray-300 focus-within:border-blue-500 transition-colors">
          <input 
            id="confirmPassword" 
            name="confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="confirmPassword"
            class="w-full py-2 pr-10 outline-none text-gray-800" 
          />
          <button 
            type="button" 
            @click="toggleConfirmPasswordVisibility"
            class="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-center text-red-600 text-sm">
        {{ errorMessage }}
      </div>

      <!-- Register button -->
      <button 
        type="button" 
        @click="handleRegister"
        class="w-[80%] mx-auto py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-md"
      >
        Đăng ký
      </button>

      <!-- Login link -->
      <div class="flex justify-center mt-[-20px]">
        <a class="font-bold text-blue-600 hover:text-blue-800" href="/login">Đăng nhập</a>
      </div>
    </div>
  </main>
</template>

<script>
import { authService } from '../services/auth'

export default {
  name: 'RegisterView',
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      username: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      isLoggedIn: false,
      currentUser: null,
      showLogoutConfirm: false
    }
  },
  created() {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    this.checkLoginStatus();
  },
  methods: {
    goBack() {
      this.$router.go(-1); // Quay lại trang trước đó
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async checkLoginStatus() {
      try {
        this.isLoggedIn = authService.isAuthenticated();
        
        if (this.isLoggedIn) {
          // Lấy thông tin người dùng hiện tại
          const userData = await authService.getCurrentUser();
          this.currentUser = userData;
          
          // Hiển thị thông báo xác nhận
          this.showLogoutConfirm = true;
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    },
    async handleLogoutAndRegister() {
      try {
        // Lưu thông tin đăng ký hiện tại
        const registerData = {
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword
        };
        
        // Đăng xuất
        await authService.logout();
        
        // Khôi phục thông tin đăng ký
        this.username = registerData.username;
        this.password = registerData.password;
        this.confirmPassword = registerData.confirmPassword;
        
        // Cập nhật trạng thái
        this.isLoggedIn = false;
        this.currentUser = null;
        this.showLogoutConfirm = false;
        
        // Thông báo cho người dùng
        alert('Đã đăng xuất khỏi tài khoản hiện tại. Bạn có thể tiếp tục đăng ký tài khoản mới.');
      } catch (error) {
        console.error('Error during logout:', error);
        this.errorMessage = 'Không thể đăng xuất. Vui lòng thử lại.';
      }
    },
    async handleRegister() {
      try {
        this.errorMessage = '';
        
        // Kiểm tra nếu người dùng đã đăng nhập và chưa xác nhận đăng xuất
        if (this.isLoggedIn && this.showLogoutConfirm) {
          this.errorMessage = 'Bạn cần đăng xuất trước khi đăng ký tài khoản mới.';
          return;
        }
        
        // Check if passwords match
        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Mật khẩu không khớp';
          return;
        }
        
        const response = await authService.register({
          username: this.username,
          password: this.password
        });
        
        // Nếu đăng ký thành công
        if (response) {
          // Nếu có token, lưu token và đăng nhập luôn
          if (response.token) {
            localStorage.setItem('token', response.token);
            
            // Hiển thị thông báo thành công
            alert('Đăng ký thành công! Bạn đã được đăng nhập tự động.');
            
            // Chuyển hướng đến trang chính
            this.$router.push('/');
          } else {
            // Trường hợp không có token (hiếm gặp)
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            this.$router.push('/login');
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Đăng ký không thành công';
        }
      }
    }
  }
}
</script>