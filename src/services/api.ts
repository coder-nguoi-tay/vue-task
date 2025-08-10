import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any custom logic before sending the request
    // For example, adding an authorization token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data // Return only the data from the response
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error)
    return Promise.reject(error)
  },
)

// Base service class
class ApiService {
  static get(endpoint: string) {
    return apiClient.get(endpoint)
  }

  static post(endpoint: string, data: any) {
    return apiClient.post(endpoint, data)
  }

  static put(endpoint: string, data: any) {
    return apiClient.put(endpoint, data)
  }

  static delete(endpoint: string) {
    return apiClient.delete(endpoint)
  }
}

export default ApiService
