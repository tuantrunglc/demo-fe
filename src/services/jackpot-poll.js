import { api } from './api'

export const jackpotPollService = {
  /**
   * Kiểm tra xem người dùng có jackpot đang chờ hiển thị không
   * Nếu có, cập nhật trạng thái thành đã hiển thị và trả về thông tin
   */
  checkJackpot: async (skipCache = false) => {
    try {
      // Chỉ gọi API nếu người dùng đã đăng nhập
      if (!localStorage.getItem('token')) {
        return { success: false, data: null }
      }
      
      // Thêm timestamp và tham số skip_cache để tránh cache
      const timestamp = new Date().getTime()
      const url = `/jackpot-poll?_t=${timestamp}${skipCache ? '&skip_cache=1' : ''}`
      
      const response = await api.get(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error checking jackpot:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể kiểm tra jackpot'
      }
    }
  },

  /**
   * Lấy lịch sử jackpot của người dùng
   */
  getUserJackpotHistory: async (limit = 10) => {
    try {
      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime()
      const response = await api.get(`/jackpot-poll/history?limit=${limit}&_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching jackpot history:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải lịch sử jackpot'
      }
    }
  }
}