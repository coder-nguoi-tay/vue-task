import { defineStore } from 'pinia'
import { ref } from 'vue'
import ApiService from '../services/api'

export interface Work {
  id: number
  name: string
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export const useWorkStore = defineStore('work', () => {
  const works = ref<Work[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWorks() {
    loading.value = true
    error.value = null
    try {
      const res = await ApiService.get('/works/list')
      works.value = res.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Lỗi khi lấy danh sách công việc'
    } finally {
      loading.value = false
    }
  }

  async function addWork(work: Partial<Work>) {
    loading.value = true
    error.value = null
    try {
      const res = await ApiService.post('/works/create', work)
      works.value.push(res.data)
    } catch (err: any) {
      error.value = err.message || 'Lỗi khi thêm công việc'
    } finally {
      loading.value = false
    }
  }

  async function updateWork(id: number, data: Partial<Work>) {
    loading.value = true
    error.value = null
    try {
      const res = await ApiService.put(`/works/${id}`, data)
      const idx = works.value.findIndex((w) => w.id === id)
      if (idx !== -1) works.value[idx] = res.data
    } catch (err: any) {
      error.value = err.message || 'Lỗi khi cập nhật công việc'
    } finally {
      loading.value = false
    }
  }

  async function deleteWork(id: number) {
    loading.value = true
    error.value = null
    try {
      await ApiService.delete(`/works/${id}`)
      works.value = works.value.filter((w) => w.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Lỗi khi xoá công việc'
    } finally {
      loading.value = false
    }
  }
  async function updateStatus(worksId: number, statusId: number) {
    loading.value = true
    error.value = null
    try {
      const response = await ApiService.delete(`/works/update-status/${worksId}/${statusId}`)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Lỗi khi đổi tên trạng thái công việc'
    } finally {
      loading.value = false
    }
  }

  return {
    works,
    loading,
    error,
    fetchWorks,
    addWork,
    updateWork,
    deleteWork,
    updateStatus,
  }
})
