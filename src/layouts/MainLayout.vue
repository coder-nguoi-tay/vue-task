<template>
  <div class="main-layout">
    <header class="header">
      <div class="logo">Task Manager</div>
      <nav class="nav">
        <router-link to="/manage/work" class="nav-link">Dự án</router-link>
        <router-link to="/manage/task/1" class="nav-link">Đầu việc</router-link>
      </nav>
      <div class="user-info">
        <!-- Thông tin user, logout ... -->
        <span>Xin chào, User</span>
      </div>
    </header>
    <div class="tabbar">
      <router-link to="/manage/work" class="tab">Tất cả dự án</router-link>
      <router-link to="/manage/task/1" class="tab">Chi tiết đầu việc</router-link>
    </div>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Có thể import store để lấy thông tin user, logout
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #f7fafc;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  background: #4f8cff;
  color: #fff;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
}
.nav {
  display: flex;
  gap: 24px;
}
.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-link:hover {
  color: #38b2ac;
}
.user-info {
  font-size: 1rem;
}
.tabbar {
  display: flex;
  gap: 16px;
  background: #fff;
  padding: 10px 32px;
  border-bottom: 1px solid #e2e8f0;
}
.tab {
  color: #4f8cff;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 18px;
  border-radius: 6px;
  transition: background 0.2s;
}
.tab:hover {
  background: #e2e8f0;
}
.main-content {
  padding: 32px;
}
</style>
