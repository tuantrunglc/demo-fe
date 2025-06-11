<template>
  <MainLayout>
    <!-- Header Title -->
    <div class="bg-[#08224C] text-white flex-shrink-0">
      <div class="text-center py-4">
        <h1 class="text-2xl font-bold">Tài khoản</h1>
      </div>
    </div>

    <!-- Main Content with White Background -->
    <div class="bg-white rounded-t-[20px] flex-grow overflow-y-auto p-4 flex flex-col gap-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <span class="block sm:inline">{{ error }}</span>
        <button @click="fetchUserProfile" class="text-blue-500 underline ml-2">Thử lại</button>
      </div>
      <!-- Account Balance Card -->
      <div v-if="!isLoading && !error" class="bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-4 text-white shadow-lg">
        <!-- ID Number -->
        <div class="text-xs text-white/80 mb-2">
          ID: {{ userProfile?.user?.id || 'Loading...' }}
        </div>
        
        <!-- Account Balance Label -->
        <div class="text-center text-white/90 mb-1">
          Số dư tài khoản
        </div>
        
        <!-- Balance Amount -->
        <div class="text-center text-4xl font-bold">
          {{ formatBalance(userProfile?.wallet_info?.balance) }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="!isLoading && !error" class="flex justify-between gap-4">
        <!-- Deposit Button -->
        <button @click="showDepositModal = true" class="flex-1 bg-[#F87171] text-white py-3 rounded-lg font-medium shadow-md hover:bg-[#f65e5e] transition-colors">
          + Nạp tiền
        </button>
        
        <!-- Withdraw Button -->
        <router-link to="/withdraw" class="flex-1">
          <button class="w-full bg-[#08224C] text-white py-3 rounded-lg font-medium shadow-md hover:bg-[#0a2d5e] transition-colors">
            – Rút tiền
          </button>
        </router-link>
      </div>

      <!-- Action List -->
      <div v-if="!isLoading && !error" class="bg-white rounded-lg shadow-sm border border-gray-100">
        <!-- Bank Card Management -->
        <router-link to="/bank-cards" class="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="text-[#08224C] text-xl">
              🏦
            </div>
            <span class="text-[#08224C] font-medium">Quản lý thẻ ngân hàng</span>
          </div>
          <div class="text-gray-400">
            &gt;
          </div>
        </router-link>
        
        <!-- Change Password -->
        <router-link to="/change-password" class="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="text-[#08224C] text-xl">
              🔑
            </div>
            <span class="text-[#08224C] font-medium">Đổi mật khẩu</span>
          </div>
          <div class="text-gray-400">
            &gt;
          </div>
        </router-link>
        
        <!-- Logout -->
        <button 
          @click="handleLogout" 
          class="flex items-center justify-between p-4 w-full text-left cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none"
        >
          <div class="flex items-center gap-3">
            <div class="text-[#08224C] text-xl">
              🚪
            </div>
            <span class="text-[#08224C] font-medium">Đăng xuất</span>
          </div>
          <div class="text-gray-400">
            &gt;
          </div>
        </button>
      </div>
    </div>

    <!-- Footer is handled by MainLayout component -->
  </MainLayout>
  
  <!-- Deposit Modal -->
  <div v-if="showDepositModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
      <div class="text-center mb-4">
        <h3 class="text-lg font-medium text-[#08224C]">Thông báo</h3>
      </div>
      <p class="text-gray-700 mb-6 text-center">
        Vui lòng liên hệ CSKH để được hướng dẫn nạp tiền.
      </p>
      <div class="flex justify-center">
        <button 
          @click="showDepositModal = false" 
          class="bg-[#F87171] text-white px-4 py-2 rounded-lg hover:bg-[#f65e5e] transition-colors focus:outline-none"
        >
          Đồng ý
        </button>
      </div>
    </div>
  </div>
  
  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
      <div class="text-center mb-4">
        <h3 class="text-lg font-medium text-[#08224C]">Xác nhận đăng xuất</h3>
      </div>
      <p class="text-gray-700 mb-6 text-center">
        Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
      </p>
      <div class="flex justify-center space-x-4">
        <button 
          @click="cancelLogout" 
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors focus:outline-none"
        >
          Hủy
        </button>
        <button 
          @click="confirmLogout" 
          class="bg-[#F87171] text-white px-4 py-2 rounded-lg hover:bg-[#f65e5e] transition-colors focus:outline-none"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import { ref, onMounted } from 'vue'
import { authService } from '../services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDepositModal = ref(false)
const showLogoutConfirmModal = ref(false)
const userProfile = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Hàm lấy thông tin người dùng
const fetchUserProfile = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await authService.getUserProfile()
    userProfile.value = response.data
    
    console.log('User profile:', userProfile.value)
  } catch (err) {
    console.error('Error fetching user profile:', err)
    error.value = 'Không thể lấy thông tin người dùng. Vui lòng thử lại sau.'
    
    // Nếu lỗi 401 (Unauthorized), chuyển hướng về trang đăng nhập
    if (err.response && err.response.status === 401) {
      router.push('/login')
    }
  } finally {
    isLoading.value = false
  }
}

// Hàm xử lý đăng xuất
const handleLogout = () => {
  // Hiển thị modal xác nhận đăng xuất
  showLogoutConfirmModal.value = true
}

// Hàm xác nhận đăng xuất
const confirmLogout = async () => {
  try {
    // Gọi API logout
    await authService.logout()
    
    // Chuyển hướng về trang đăng nhập
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    
    // Nếu có lỗi, vẫn xóa token và chuyển hướng về trang đăng nhập
    localStorage.removeItem('token')
    router.push('/login')
  } finally {
    // Đóng modal xác nhận
    showLogoutConfirmModal.value = false
  }
}

// Hàm hủy đăng xuất
const cancelLogout = () => {
  showLogoutConfirmModal.value = false
}

// Format balance to remove decimal places if they are .00
const formatBalance = (balance) => {
  if (!balance) return '0'
  
  // Convert to number if it's a string
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
  
  // Check if the number has no decimal places or only zeros after decimal
  if (Number.isInteger(numBalance) || numBalance.toFixed(2).endsWith('.00')) {
    return Math.floor(numBalance).toString()
  }
  
  return numBalance.toString()
}

// Lấy thông tin người dùng khi component được tạo
onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>