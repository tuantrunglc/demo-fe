import axios from 'axios'

// API base URL from environment variables
// Trong môi trường development, sử dụng VITE_API_URL từ .env
// Trong môi trường production, sử dụng VITE_API_URL từ .env.production
const API_URL = import.meta.env.VITE_API_URL || '/api'

console.log('Current API URL:', API_URL)

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

// Handle 401 responses
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Hàm xóa cache
const clearCache = () => {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
};

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

export const authService = {
  async login(credentials) {
    // Get CSRF token first
    await getCsrfToken();
    
    return apiClient.post('/login', credentials)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          clearCache();
        }
        return response.data
      })
  },
  
  async register(user) {
    // Get CSRF token first
    await getCsrfToken();
    
    return apiClient.post('/register', user)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          clearCache();
        }
        return response.data
      })
  },
  
  async logout() {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // Get CSRF token first
        await getCsrfToken();
        
        // Gọi API logout
        await apiClient.post('/logout')
        
        // Xóa token và cache
        localStorage.removeItem('token')
        clearCache()
        
        return true
      } catch (error) {
        console.error('Logout error:', error)
        
        // Nếu có lỗi, vẫn xóa token và cache
        localStorage.removeItem('token')
        clearCache()
        
        throw error
      }
    } else {
      // Nếu không có token, chỉ cần xóa cache
      clearCache()
      return true
    }
  },
  
  isAuthenticated() {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    // Kiểm tra token có hợp lệ không (có thể thêm logic kiểm tra JWT expiration)
    return true
  },
  
  checkTokenValidity() {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    // Gọi API để kiểm tra token
    return apiClient.get('/user')
      .then(() => true)
      .catch(error => {
        // Nếu token không hợp lệ, xóa token và cache
        if (error.response && error.response.status === 401) {
          this.logout()
        }
        return false
      })
  },
  
  getCurrentUser() {
    return apiClient.get('/user')
      .then(response => {
        // Kiểm tra cấu trúc response và trả về dữ liệu người dùng
        if (response.data && response.data.data) {
          return response.data.data;
        }
        return response.data;
      })
  },
  
  getUserProfile() {
    return apiClient.get('/user/profile')
      .then(response => response.data)
  },
  
  async updateBankInfo(bankInfo) {
    // Get CSRF token first
    await getCsrfToken();
    
    return apiClient.post('/user/bank-info', bankInfo)
      .then(response => response.data)
  },
  
  // Phương thức xóa cache
  clearCache
}