import axios from 'axios'

// Create an Axios instance with baseURL and interceptors
const api = axios.create({
  baseURL: 'http://localhost:5001/api' // Set the base URL for all requests
})

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle global errors like 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.log('Unauthorized access, redirecting to login...')
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('isLoggedIn')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
