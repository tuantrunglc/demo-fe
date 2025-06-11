import axios from 'axios'

// API base URL from environment variables
// Trong môi trường development, sử dụng VITE_API_URL từ .env
// Trong môi trường production, sử dụng VITE_API_URL từ .env.production
const API_URL = import.meta.env.VITE_API_URL || '/api'

console.log('Random Service - API URL:', API_URL)

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL
})

export const randomService = {
  /**
   * Get the latest random number for a specific level
   * @param {number} level - The level (1, 3, or 5)
   * @param {string} generate - Optional parameter to generate a new number ('generate' or 'not_generate')
   * @returns {Promise} - Promise with the response data
   */
  getLatest(level, generate = null) {
    let params = { level }
    if (generate) {
      params.generate = generate
    }
    
    return apiClient.get('/random/latest', { params })
      .then(response => response.data)
  },
  
  /**
   * Get history of random numbers for a specific level
   * @param {number} level - The level (1, 3, or 5)
   * @param {number} limit - Optional limit of records to return
   * @returns {Promise} - Promise with the response data
   */
  getHistory(level, limit = 10) {
    return apiClient.get('/random/history', { 
      params: { level, limit } 
    })
      .then(response => response.data)
  }
}