import { api } from './api'

export const jackpotService = {
  /**
   * Lấy sự kiện nổ hũ mới nhất đang chờ hiển thị
   */
  getLatestPending: async () => {
    try {
      const response = await api.get('/jackpot/latest')
      return response.data
    } catch (error) {
      console.error('Error fetching latest jackpot:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin nổ hũ mới nhất'
      }
    }
  },

  /**
   * Lấy lịch sử nổ hũ
   */
  getJackpotHistory: async (limit = 10) => {
    try {
      const response = await api.get(`/jackpot/history?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching jackpot history:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải lịch sử nổ hũ'
      }
    }
  },

  /**
   * Lấy danh sách phần thưởng nổ hũ của người dùng
   */
  getUserWinnings: async () => {
    try {
      const response = await api.get('/jackpot/winnings')
      return response.data
    } catch (error) {
      console.error('Error fetching user jackpot winnings:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin phần thưởng nổ hũ'
      }
    }
  },

  /**
   * Đánh dấu sự kiện nổ hũ đã được hiển thị
   */
  markAsDisplayed: async (jackpotId) => {
    try {
      const response = await api.post(`/jackpot/${jackpotId}/mark-displayed`)
      return response.data
    } catch (error) {
      console.error('Error marking jackpot as displayed:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật trạng thái nổ hũ'
      }
    }
  },

  /**
   * Kích hoạt nổ hũ (Admin only)
   */
  triggerJackpot: async (data) => {
    try {
      const response = await api.post('/jackpot/trigger', data)
      return response.data
    } catch (error) {
      console.error('Error triggering jackpot:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể kích hoạt nổ hũ'
      }
    }
  },

  /**
   * Gán người thắng cho sự kiện nổ hũ (Admin only)
   */
  assignWinners: async (jackpotId, userIds) => {
    try {
      const response = await api.post(`/jackpot/${jackpotId}/assign-winners`, { user_ids: userIds })
      return response.data
    } catch (error) {
      console.error('Error assigning jackpot winners:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể gán người thắng nổ hũ'
      }
    }
  }
}