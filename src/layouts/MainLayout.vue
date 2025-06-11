<template>
  <div class="relative bg-[#08224C] h-screen max-w-[430px] mx-auto font-sans font-medium text-base flex flex-col overflow-hidden">
    <!-- Main Content -->
    <div class="flex flex-col flex-grow overflow-hidden">
      <slot></slot>
    </div>
    
    <!-- Footer Account Component -->
    <div class="fixed bottom-0 left-0 right-0 flex justify-center z-10">
      <FooterAccount class="w-full max-w-[430px] bg-white rounded-t-[20px] shadow-md pb-1" />
    </div>
    <!-- Spacer to prevent content from being hidden behind the footer -->
    <div class="h-[100px]"></div>
    
    <!-- Jackpot Polling Component -->
    <JackpotPolling v-if="isAuthenticated" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FooterAccount from '../components/FooterAccount.vue'
import JackpotPolling from '../components/JackpotPolling.vue'

// Kiểm tra xác thực dựa trên token trong localStorage
const isAuthenticated = ref(false)

onMounted(() => {
  // Kiểm tra xem có token không
  const token = localStorage.getItem('token')
  isAuthenticated.value = !!token
  
  // Lắng nghe sự kiện storage để cập nhật trạng thái xác thực
  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      isAuthenticated.value = !!event.newValue
    }
  })
})
</script>