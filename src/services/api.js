import axios from 'axios'

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance with base URL
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // This enables sending cookies with cross-origin requests
})

// Set up axios interceptors for authentication
api.interceptors.request.use(
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
api.interceptors.response.use(
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