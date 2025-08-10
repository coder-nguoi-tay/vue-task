import ApiService from '@/services/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface AuthUser {
  provider: 'basesic' | 'google' | 'oauth2'
  token?: string
  email?: string
  password?: string
}

interface AuthResponse {
  status: string
  user: AuthUser
  token?: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<AuthUser | null>(null)

  async function login(userData: AuthUser): Promise<AuthResponse> {
    // Validate required fields
    if (!userData.provider) {
      throw new Error('Provider là bắt buộc')
    }

    if (userData.provider === 'google' && !userData.token) {
      throw new Error('Token là bắt buộc khi đăng nhập bằng Google')
    }

    if (userData.provider === 'basesic') {
      if (!userData.email || !userData.password) {
        throw new Error('Email và password là bắt buộc khi đăng nhập bằng basesic')
      }
    }

    // Gọi API đăng nhập
    try {
      const response = (await ApiService.post('auth/user/login', {
        provider: userData.provider,
        email: userData.email,
        password: userData.password,
        token: userData.token,
      })) as AuthResponse

      if (!response || !response.user) {
        throw new Error('Đăng nhập không thành công')
      }

      isAuthenticated.value = true
      user.value = response.user
      if (response.token) {
        localStorage.setItem('token', response.token)
      }

      return response
    } catch (error) {
      isAuthenticated.value = false
      user.value = null
      throw error
    }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
  }
})
