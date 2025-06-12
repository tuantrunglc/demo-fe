<template>
  <div>
    <!-- Component này không có giao diện, chỉ lắng nghe sự kiện qua AJAX polling -->
    <JackpotPopupPoll v-if="showJackpot" :jackpot-data="jackpotData" @close="closeJackpot" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { jackpotPollService } from '../services/jackpot-poll'
import JackpotPopupPoll from './JackpotPopupPoll.vue'

const showJackpot = ref(false)
const jackpotData = ref(null)
let pollingInterval = null
let isPolling = ref(true) // Biến để kiểm soát việc polling

// Đóng popup nổ hũ
const closeJackpot = () => {
  showJackpot.value = false
  
  // Khởi động lại polling sau khi đóng popup
  if (!pollingInterval && isPolling.value) {
    startPolling()
  }
}

// Kiểm tra xem có sự kiện nổ hũ nào đang chờ hiển thị không
const checkJackpot = async (skipCache = false) => {
  try {
    // Nếu đang hiển thị popup, không cần kiểm tra
    if (showJackpot.value) return
    
    console.log(`[JackpotPolling] Kiểm tra jackpot (${new Date().toLocaleTimeString()})${skipCache ? ' - bỏ qua cache' : ''}`)
    const response = await jackpotPollService.checkJackpot(skipCache)
    
    if (response.success && response.data) {
      console.log('[JackpotPolling] Jackpot found:', response.data)
      jackpotData.value = response.data
      showJackpot.value = true
      
      // Tạm dừng polling khi đã tìm thấy jackpot
      stopPolling()
    }
  } catch (error) {
    console.error('[JackpotPolling] Error checking jackpot:', error)
  }
}

// Bắt đầu polling
// Sử dụng chiến lược polling thông minh để vượt qua cache
const startPolling = () => {
  if (!pollingInterval) {
    // Cấu hình polling
    const pollTime = 5000 // Cố định 5 giây
    let pollCount = 0 // Đếm số lần poll
    
    const poll = async () => {
      if (!isPolling.value) return
      
      try {
        pollCount++
        
        // Mỗi 3 lần poll, bỏ qua cache để đảm bảo nhận được dữ liệu mới nhất
        // Điều này giúp vượt qua cache 60 giây trên server
        const skipCache = pollCount % 3 === 0
        await checkJackpot(skipCache)
      } catch (error) {
        console.error('[JackpotPolling] Polling error:', error)
      }
      
      // Đặt lịch cho lần poll tiếp theo nếu vẫn đang polling
      if (isPolling.value) {
        pollingInterval = setTimeout(poll, pollTime)
      }
    }
    
    // Bắt đầu polling ngay lập tức
    poll()
    isPolling.value = true
    console.log(`[JackpotPolling] Bắt đầu polling mỗi ${pollTime}ms`)
  }
}

// Dừng polling
const stopPolling = () => {
  if (pollingInterval) {
    clearTimeout(pollingInterval)
    pollingInterval = null
  }
}

onMounted(() => {
  console.log('[JackpotPolling] Component mounted')
  
  // Kiểm tra ngay khi component được mount - bỏ qua cache
  checkJackpot(true)
  
  // Thiết lập polling để kiểm tra sự kiện nổ hũ mới
  startPolling()
})

onUnmounted(() => {
  console.log('[JackpotPolling] Component unmounted')
  
  // Clear polling interval khi component unmount
  stopPolling()
  isPolling.value = false
})
</script>