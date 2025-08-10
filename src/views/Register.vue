<template>
  <div class="register">
    <h1>Register</h1>
    <RegisterForm />
  </div>
</template>

<script lang="ts" setup>
import RegisterForm from '@/components/Auth/RegisterForm.vue'
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>
