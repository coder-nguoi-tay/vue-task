<template>
  <div class="login-form">
    <form @submit.prevent="onSubmit">
      <InputField
        label="Email"
        v-model="emailValue"
        :error="emailMeta.touched || formSubmitted ? emailError : ''"
        placeholder="Nhập email"
      />
      <InputField
        label="Mật khẩu"
        type="password"
        v-model="passwordValue"
        :error="passwordMeta.touched || formSubmitted ? passwordError : ''"
        placeholder="Nhập mật khẩu"
      />
      <button type="submit" :disabled="loading">
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else>Đăng nhập</span>
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useField } from 'vee-validate'
import * as yup from 'yup'
import InputField from '../common/InputField.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const formSubmitted = ref(false)
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const emailSchema = yup.string().required('Email bắt buộc').email('Email không hợp lệ')
const passwordSchema = yup.string().required('Mật khẩu bắt buộc').min(6, 'Tối thiểu 6 ký tự')

const {
  value: emailValue,
  errorMessage: emailError,
  meta: emailMeta,
  validate: emailValidate,
} = useField('email', emailSchema)

const {
  value: passwordValue,
  errorMessage: passwordError,
  meta: passwordMeta,
  validate: passwordValidate,
} = useField('password', passwordSchema)

async function onSubmit() {
  formSubmitted.value = true
  loading.value = true
  await emailValidate()
  await passwordValidate()
  emailMeta.touched = true
  passwordMeta.touched = true

  if (!emailError.value && !passwordError.value) {
    try {
      await authStore.login({
        provider: 'basesic',
        email: String(emailValue.value),
        password: String(passwordValue.value),
      })
      router.push('/manage/work')
    } catch (error) {
      // Xử lý lỗi đăng nhập
      console.error(error)
    }
  }
  loading.value = false
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 40px auto;
  padding: 32px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 18px;
  font-size: 2rem;
  color: #2d3748;
}

.login-form form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-form button[type='submit'] {
  padding: 10px 0;
  background: linear-gradient(90deg, #4f8cff 0%, #38b2ac 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-form button[type='submit']:hover {
  background: linear-gradient(90deg, #38b2ac 0%, #4f8cff 100%);
}

.error {
  color: #e53e3e;
  font-size: 0.95rem;
  margin-top: 4px;
}
</style>
