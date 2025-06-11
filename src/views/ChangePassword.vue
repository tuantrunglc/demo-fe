<template>
  <MainLayout>
    <!-- Header Title -->
    <div class="bg-[#08224C] text-white flex-shrink-0">
      <div class="flex items-center py-4 px-4">
        <button @click="$router.go(-1)" class="mr-4 focus:outline-none">
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-2xl font-bold flex-grow text-center pr-8">Đổi mật khẩu</h1>
      </div>
    </div>

    <!-- Main Content with White Background -->
    <div class="bg-white rounded-t-[20px] flex-grow overflow-y-auto p-6 flex flex-col gap-6">
      <form @submit.prevent="changePassword" class="flex flex-col gap-6">
        <!-- Current Password -->
        <div class="flex flex-col gap-2">
          <label for="currentPassword" class="text-[#08224C] font-medium">Mật khẩu hiện tại</label>
          <div class="relative">
            <input 
              :type="showCurrentPassword ? 'text' : 'password'" 
              id="currentPassword" 
              v-model="currentPassword" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#08224C]"
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
            <button 
              type="button" 
              @click="showCurrentPassword = !showCurrentPassword" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              <span v-if="showCurrentPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div class="flex flex-col gap-2">
          <label for="newPassword" class="text-[#08224C] font-medium">Mật khẩu mới</label>
          <div class="relative">
            <input 
              :type="showNewPassword ? 'text' : 'password'" 
              id="newPassword" 
              v-model="newPassword" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#08224C]"
              placeholder="Nhập mật khẩu mới"
              required
            />
            <button 
              type="button" 
              @click="showNewPassword = !showNewPassword" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              <span v-if="showNewPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
          <p class="text-xs text-gray-500">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số</p>
        </div>

        <!-- Confirm New Password -->
        <div class="flex flex-col gap-2">
          <label for="confirmPassword" class="text-[#08224C] font-medium">Xác nhận mật khẩu mới</label>
          <div class="relative">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#08224C]"
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            <button 
              type="button" 
              @click="showConfirmPassword = !showConfirmPassword" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              <span v-if="showConfirmPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="bg-[#F87171] text-white py-3 rounded-lg font-medium shadow-md hover:bg-[#f65e5e] transition-colors mt-4"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Đang xử lý...</span>
          <span v-else>Xác nhận</span>
        </button>
      </form>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div class="text-center mb-4">
          <div class="text-green-500 text-5xl mb-4">✓</div>
          <h3 class="text-lg font-medium text-[#08224C]">Thành công</h3>
        </div>
        <p class="text-gray-700 mb-6 text-center">
          Mật khẩu của bạn đã được thay đổi thành công.
        </p>
        <div class="flex justify-center">
          <button 
            @click="closeSuccessModal" 
            class="bg-[#F87171] text-white px-4 py-2 rounded-lg hover:bg-[#f65e5e] transition-colors focus:outline-none"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div class="text-center mb-4">
          <div class="text-red-500 text-5xl mb-4">✗</div>
          <h3 class="text-lg font-medium text-[#08224C]">Lỗi</h3>
        </div>
        <p class="text-gray-700 mb-6 text-center">
          {{ errorMessage }}
        </p>
        <div class="flex justify-center">
          <button 
            @click="showErrorModal = false" 
            class="bg-[#F87171] text-white px-4 py-2 rounded-lg hover:bg-[#f65e5e] transition-colors focus:outline-none"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import axios from 'axios'

const router = useRouter()

// Form fields
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// UI state
const isLoading = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Change password function
const changePassword = async () => {
  // Reset error state
  showErrorModal.value = false
  errorMessage.value = ''
  
  // Validate passwords
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu mới và xác nhận mật khẩu không khớp.'
    showErrorModal.value = true
    return
  }
  
  if (newPassword.value.length < 8) {
    errorMessage.value = 'Mật khẩu mới phải có ít nhất 8 ký tự.'
    showErrorModal.value = true
    return
  }
  
  // Check password strength (contains uppercase, lowercase, and number)
  const hasUpperCase = /[A-Z]/.test(newPassword.value)
  const hasLowerCase = /[a-z]/.test(newPassword.value)
  const hasNumber = /[0-9]/.test(newPassword.value)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    errorMessage.value = 'Mật khẩu mới phải bao gồm chữ hoa, chữ thường và số.'
    showErrorModal.value = true
    return
  }
  
  // Submit password change
  isLoading.value = true
  
  try {
    // In a real app, you would call your API here
    // const response = await axios.post('/api/change-password', {
    //   currentPassword: currentPassword.value,
    //   newPassword: newPassword.value
    // })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success modal
    showSuccessModal.value = true
    
    // Reset form
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    // Handle error
    errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

// Close success modal and navigate back
const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.go(-1)
}
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