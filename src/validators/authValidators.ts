import { required, minLength, email } from '@vuelidate/validators'

export const authValidators = {
  login: {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  },
  register: {
    username: { required, minLength: minLength(3) },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, minLength: minLength(6) },
  },
}

// Hàm validateRegistration cho RegisterForm.vue
export function validateRegistration(data: {
  username: string
  email: string
  password: string
  confirmPassword: string
}) {
  const errors: Record<string, string> = {}
  if (!data.username || data.username.length < 3) {
    errors.username = 'Username phải có ít nhất 3 ký tự'
  }
  if (!data.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
    errors.email = 'Email không hợp lệ'
  }
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password phải có ít nhất 6 ký tự'
  }
  if (!data.confirmPassword || data.confirmPassword.length < 6) {
    errors.confirmPassword = 'Confirm Password phải có ít nhất 6 ký tự'
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
  }
  return errors
}
