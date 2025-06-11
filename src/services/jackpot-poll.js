import { api } from './api'

export const jackpotPollService = {
  /**
   * Kiểm tra xem người dùng có jackpot đang chờ hiển thị không
   * Nếu có, cập nhật trạng thái thành đã hiển thị và trả về thông tin
   */
  checkJackpot: async () => {
    try {
      // Chỉ gọi API nếu người dùng đã đăng nhập
      if (!localStorage.getItem('token')) {
        return { success: false, data: null }
      }
      
      const response = await api.get('/jackpot-poll')
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
      const response = await api.get(`/jackpot-poll/history?limit=${limit}`)
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