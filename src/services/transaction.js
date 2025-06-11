import axios from 'axios'

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true // This enables sending cookies with cross-origin requests
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

// Function to get CSRF token
const getCsrfToken = async () => {
  try {
    // This endpoint sets the CSRF cookie
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    return true;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return false;
  }
};

export const transactionService = {
  // Gửi yêu cầu rút tiền
  async requestWithdrawal(amount) {
    // Get CSRF token first
    await getCsrfToken();
    
    return apiClient.post('/transactions/withdraw', { amount })
      .then(response => {
        console.log('Withdrawal response:', response.data);
        return response.data;
      })
  },
  
  // Lấy lịch sử giao dịch của người dùng
  async getTransactionHistory(limit = 10) {
    return apiClient.get(`/transactions/history?limit=${limit}`)
      .then(response => response.data)
  },
  
  // Lấy thông tin ví của người dùng
  async getWalletInfo() {
    return apiClient.get('/user')
      .then(response => {
        // Kiểm tra cấu trúc response
        let userData = response.data;
        
        // Nếu dữ liệu nằm trong trường data
        if (response.data && response.data.data) {
          userData = response.data.data;
        }
        
        if (userData && userData.wallet !== undefined) {
          return {
            balance: userData.wallet,
            formattedBalance: new Intl.NumberFormat('vi-VN').format(userData.wallet) + ' VNĐ'
          }
        }
        throw new Error('Không thể lấy thông tin ví')
      })
  }
}