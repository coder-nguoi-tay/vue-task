<template>
  <nav class="pagination" v-if="totalPages > 1">
    <button
      class="page-btn"
      :disabled="currentPage === 1"
      @click="$emit('update:currentPage', currentPage - 1)"
    >
      «
    </button>
    <button
      v-for="page in pages"
      :key="page"
      class="page-btn"
      :class="{ active: page === currentPage }"
      @click="$emit('update:currentPage', page)"
    >
      {{ page }}
    </button>
    <button
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('update:currentPage', currentPage + 1)"
    >
      »
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
const props = defineProps<{
  currentPage: number
  totalItems: number
  pageSize: number
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))
const pages = computed(() => {
  const arr = []
  for (let i = 1; i <= totalPages.value; i++) arr.push(i)
  return arr
})
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 6px;
  margin-top: 24px;
  justify-content: center;
}
.page-btn {
  background: #fff;
  border: 1px solid #4f8cff;
  color: #4f8cff;
  border-radius: 4px;
  padding: 4px 10px;
  min-width: 32px;
  cursor: pointer;
  font-weight: 500;
  transition:
    background 0.2s,
    color 0.2s;
}
.page-btn.active {
  background: #4f8cff;
  color: #fff;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
