import axios from 'axios'

// API base URL from environment variables
// Trong môi trường development, sử dụng VITE_API_URL từ .env
// Trong môi trường production, sử dụng VITE_API_URL từ .env.production
const API_URL = import.meta.env.VITE_API_URL || '/api'

console.log('Bet Service - API URL:', API_URL)

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL
})

// Set up axios interceptors for authentication
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export const betService = {
  /**
   * Tạo một bet mới
   * @param {Object} betData - Dữ liệu bet
   * @param {number} betData.random_number - Số ngẫu nhiên liên quan đến lượt đặt cược
   * @param {number} betData.target - Vị trí mục tiêu (luôn là 1)
   * @param {string} betData.bet_type - Loại cược: lên (up) hoặc xuống (down)
   * @param {number} betData.value - Số tiền đặt cược
   * @param {string} [betData.level] - Cấp độ đặt cược (tùy chọn)
   * @param {number} [betData.number_of_periods] - Số kỳ đặt cược (tùy chọn)
   * @returns {Promise} - Promise với dữ liệu phản hồi
   */
  createBet(betData) {
    return apiClient.post('/bets/createBet', betData)
      .then(response => response.data)
      .catch(error => {
        console.error('Error creating bet:', error.response ? error.response.data : error.message)
        throw error
      })
  },

  /**
   * Lấy danh sách bet của người dùng hiện tại
   * @returns {Promise} - Promise với dữ liệu phản hồi
   */
  getUserBets() {
    return apiClient.get('/bets')
      .then(response => response.data)
  },
  
  /**
   * Lấy lịch sử bet chi tiết của người dùng hiện tại
   * @returns {Promise} - Promise với dữ liệu phản hồi
   */
  getUserBetHistory() {
    return apiClient.get('/bets/history-bet')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching bet history:', error.response ? error.response.data : error.message)
        throw error
      })
  },

  /**
   * Lấy thông tin chi tiết của một bet
   * @param {number} id - ID của bet
   * @returns {Promise} - Promise với dữ liệu phản hồi
   */
  getBetDetails(id) {
    return apiClient.get(`/bets/${id}`)
      .then(response => response.data)
  }
}