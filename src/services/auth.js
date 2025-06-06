import axios from 'axios'

// Set up axios interceptors for authentication
axios.interceptors.request.use(
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
axios.interceptors.response.use(
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

export const authService = {
  login(credentials) {
    return axios.post('/api/login', credentials)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        return response.data
      })
  },
  
  register(user) {
    return axios.post('/api/register', user)
  },
  
  logout() {
    localStorage.removeItem('token')
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}