<template>
  <div class="register-form">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="formData.username"
        label="Username"
        type="text"
        :error="errors.username"
      />
      <InputField
        v-model="formData.email"
        label="Email"
        type="email"
        :error="errors.email"
      />
      <InputField
        v-model="formData.password"
        label="Password"
        type="password"
        :error="errors.password"
      />
      <InputField
        v-model="formData.confirmPassword"
        label="Confirm Password"
        type="password"
        :error="errors.confirmPassword"
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { validateRegistration } from '@/validators/authValidators';

const authStore = useAuthStore();
const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const errors = ref({});

const handleSubmit = async () => {
  errors.value = {};
  const validationErrors = validateRegistration(formData.value);

  if (Object.keys(validationErrors).length) {
    errors.value = validationErrors;
    return;
  }

  await authStore.register(formData.value);
};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: auto;
}
</style>
