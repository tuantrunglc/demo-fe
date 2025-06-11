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
const checkJackpot = async () => {
  try {
    // Nếu đang hiển thị popup, không cần kiểm tra
    if (showJackpot.value) return
    
    const response = await jackpotPollService.checkJackpot()
    
    if (response.success && response.data) {
      console.log('Jackpot found:', response.data)
      jackpotData.value = response.data
      showJackpot.value = true
      
      // Tạm dừng polling khi đã tìm thấy jackpot
      stopPolling()
    }
  } catch (error) {
    console.error('Error checking jackpot:', error)
  }
}

// Bắt đầu polling
// Sử dụng Exponential Backoff để giảm tải server
const startPolling = () => {
  if (!pollingInterval) {
    // Bắt đầu với 5 giây, sau đó tăng dần nếu không có kết quả
    let pollTime = 5000
    const maxPollTime = 30000 // Tối đa 30 giây
    
    const poll = async () => {
      try {
        const result = await checkJackpot()
        
        // Nếu không có jackpot, tăng thời gian chờ
        if (!result.success || !result.data) {
          pollTime = Math.min(pollTime * 1.5, maxPollTime)
        } else {
          // Nếu có jackpot, reset về 5 giây
          pollTime = 5000
        }
      } catch (error) {
        console.error('Polling error:', error)
        // Nếu có lỗi, tăng thời gian chờ
        pollTime = Math.min(pollTime * 1.5, maxPollTime)
      }
      
      // Đặt lịch cho lần poll tiếp theo
      pollingInterval = setTimeout(poll, pollTime)
    }
    
    // Bắt đầu polling
    poll()
    isPolling.value = true
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
  // Kiểm tra ngay khi component được mount
  checkJackpot()
  
  // Thiết lập polling để kiểm tra sự kiện nổ hũ mới mỗi 5 giây
  startPolling()
})

onUnmounted(() => {
  // Clear polling interval khi component unmount
  stopPolling()
  isPolling.value = false
})
</script>