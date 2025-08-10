<template>
  <div v-if="showCreatePopup" class="popup-overlay" @click.self="closeCreatePopup">
    <div class="popup">
      <h2 class="text-xl font-semibold mb-4">Tạo dự án mới</h2>
      <form @submit.prevent="submitCreateProject">
        <div class="mb-3">
          <label class="block mb-1 font-medium"
            >Tên dự án <span class="text-red-500">*</span></label
          >
          <input
            v-model="form.name"
            type="text"
            class="input"
            :class="{ 'input-error': errors.name }"
          />
          <div v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</div>
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium">Mô tả</label>
          <textarea v-model="form.description" class="input"></textarea>
        </div>
        <div class="flex gap-2 mt-4">
          <button type="submit" class="btn btn-create">Tạo</button>
          <button type="button" class="btn btn-cancel" @click="closeCreatePopup">Huỷ</button>
        </div>
      </form>
    </div>
  </div>
  <div class="work-page">
    <h1 class="text-2xl font-bold mb-4">Tất cả dự án</h1>
    <div v-if="workStore.works.data && workStore.works.data.length > 0" class="project-list">
      <div v-for="project in workStore.works.data" :key="project.id" class="project-card">
        <h2 class="font-semibold">{{ project.name }}</h2>
        <p>{{ project.description }}</p>
        <router-link :to="`/manage/task/${project.id}`" class="btn">Xem chi tiết</router-link>
      </div>
    </div>
    <Paginate
      v-if="workStore.works.data && workStore.works.data.length > 0"
      :currentPage="currentPage"
      :totalItems="workStore.works.total"
      :pageSize="pageSize"
      @update:currentPage="(val) => (currentPage.value = val)"
    />
    <div v-else class="no-projects">
      <div class="text-center py-12">
        <h2 class="text-xl font-semibold mb-2">Chưa có dự án nào</h2>
        <p class="mb-4">Bạn chưa có dự án nào, hãy tạo mới để bắt đầu quản lý công việc.</p>
        <button class="btn btn-create" @click="showCreatePopup = true">Tạo dự án mới</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
const showCreatePopup = ref(false)
const form = reactive({ name: '', description: '' })
const errors = reactive<{ name?: string }>({})

function closeCreatePopup() {
  showCreatePopup.value = false
  form.name = ''
  form.description = ''
  errors.name = undefined
}

function validateForm() {
  errors.name = !form.name.trim() ? 'Tên dự án không được để trống' : undefined
  return !errors.name
}

async function submitCreateProject() {
  if (!validateForm()) return
  try {
    await workStore.addWork({ name: form.name, description: form.description })
    closeCreatePopup()
    // Sau khi tạo thành công, reload lại danh sách
    location.reload()
  } catch (e) {
    errors.name = 'Có lỗi xảy ra khi tạo dự án'
  }
}
import { onMounted, ref } from 'vue'
import { useWorkStore } from '@/stores/work'
import Paginate from '@/components/common/Paginate.vue'

const workStore = useWorkStore()
const projects = workStore.works

const currentPage = ref(1)
const pageSize = ref(6)

onMounted(() => {
  workStore.fetchWorks()
})
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup {
  background: #fff;
  border-radius: 10px;
  padding: 32px 28px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(79, 140, 255, 0.15);
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

.input:focus {
  border-color: #4f8cff;
}

.input-error {
  border-color: #e53e3e;
}

.work-page {
  padding: 32px;
}

.project-list {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.project-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 20px;
  min-width: 220px;
  max-width: 300px;
}

.btn {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  background: #4f8cff;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.btn:hover {
  background: #38b2ac;
}

.no-projects {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.btn-create {
  background: #38b2ac;
  color: #fff;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 500;
  transition: background 0.2s;
  border: none !important;
  cursor: pointer;
}

.btn-cancel {
  background: #e53e3e;
  color: #fff;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 500;
  transition: background 0.2s;
  border: none !important;
  cursor: pointer;
}

.btn-create:hover {
  background: #4f8cff;
}
</style>
