<template>
  <div>
    <!-- Component này không có giao diện, chỉ lắng nghe sự kiện -->
    <JackpotPopup v-if="showJackpot" :jackpot-event="jackpotEvent" @close="closeJackpot" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { jackpotService } from '../services/jackpot'
import JackpotPopup from './JackpotPopup.vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

const showJackpot = ref(false)
const jackpotEvent = ref(null)
let echo = null

// Khởi tạo Echo để lắng nghe sự kiện từ Laravel
const initEcho = () => {
  window.Pusher = Pusher
  
  echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
  })
  
  // Lắng nghe sự kiện nổ hũ
  echo.channel('jackpot')
    .listen('jackpot.triggered', (e) => {
      console.log('Jackpot triggered event received:', e)
      jackpotEvent.value = e
      showJackpot.value = true
    })
}

// Đóng popup nổ hũ
const closeJackpot = () => {
  showJackpot.value = false
}

// Kiểm tra xem có sự kiện nổ hũ nào đang chờ hiển thị không
const checkPendingJackpot = async () => {
  try {
    const response = await jackpotService.getLatestPending()
    if (response.success && response.data) {
      jackpotEvent.value = response.data
      showJackpot.value = true
    }
  } catch (error) {
    console.error('Error checking pending jackpot:', error)
  }
}

onMounted(() => {
  // Khởi tạo Echo
  initEcho()
  
  // Kiểm tra xem có sự kiện nổ hũ nào đang chờ hiển thị không
  checkPendingJackpot()
  
  // Thiết lập polling để kiểm tra sự kiện nổ hũ mới mỗi 30 giây
  // Đây là phương án dự phòng trong trường hợp WebSocket không hoạt động
  const pollingInterval = setInterval(checkPendingJackpot, 30000)
  
  // Lưu interval để có thể clear khi component unmount
  window.jackpotPollingInterval = pollingInterval
})

onUnmounted(() => {
  // Hủy kết nối Echo
  if (echo) {
    echo.disconnect()
  }
  
  // Clear polling interval
  if (window.jackpotPollingInterval) {
    clearInterval(window.jackpotPollingInterval)
  }
})
</script>