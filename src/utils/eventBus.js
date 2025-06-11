import { ref } from 'vue'

// Tạo một đối tượng để lưu trữ các sự kiện và callback
const listeners = {}

// Tạo một ref để theo dõi số dư ví
export const walletBalance = ref(0)

export const eventBus = {
  // Đăng ký một callback cho một sự kiện
  on(event, callback) {
    if (!listeners[event]) {
      listeners[event] = []
    }
    listeners[event].push(callback)
  },

  // Hủy đăng ký một callback cho một sự kiện
  off(event, callback) {
    if (!listeners[event]) return
    if (!callback) {
      listeners[event] = []
      return
    }
    listeners[event] = listeners[event].filter(cb => cb !== callback)
  },

  // Kích hoạt một sự kiện với dữ liệu
  emit(event, data) {
    if (!listeners[event]) return
    listeners[event].forEach(callback => callback(data))
  },

  // Cập nhật số dư ví
  updateWalletBalance(balance) {
    walletBalance.value = balance
    this.emit('wallet-updated', balance)
  }
}