<template>
  <div class="login">
    <h1>Login</h1>
    <LoginForm />
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/Auth/LoginForm.vue';
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>