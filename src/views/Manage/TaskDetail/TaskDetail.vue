<template>
  <div class="task-detail-page">
    <h1 class="text-2xl font-bold mb-4">Quản lý các đầu việc</h1>
    <div class="task-board">
      <div
        v-for="(status, idx) in statuses"
        :key="status"
        class="task-column"
        v-bind="columnDragProps(idx)"
        :class="{
          'drag-over': dragOverColumnIdx === idx,
          'column-dragging': draggingColumnIdx === idx,
        }"
      >
        <h2
          class="column-title"
          v-if="editingStatusIdx !== idx"
          @click="startEditStatus(idx, status)"
        >
          {{ status }}
        </h2>
        <input
          v-else
          class="column-title-edit"
          v-model="editingStatusName"
          @keyup.enter="saveEditStatus(idx)"
          @blur="saveEditStatus(idx)"
          :autofocus="true"
        />
        <div
          class="task-list"
          @dragover.prevent="onDragOver(status)"
          @drop="onDrop(status)"
          @dragenter="onDragEnter(status)"
          @dragleave="onDragLeave"
        >
          <div
            v-for="task in tasksByStatus(status)"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="onDragStart(task)"
            :class="{ dragging: draggingTask && draggingTask.id === task.id }"
            @click="showTaskDetail(task)"
          >
            <div class="task-title">{{ task.title }}</div>
            <div class="task-desc">{{ task.description }}</div>
          </div>
          <div v-if="showPopup" class="task-popup-overlay" @click.self="closePopup">
            <div class="task-popup">
              <h2>{{ selectedTask?.title }}</h2>
              <p><strong>Mô tả:</strong> {{ selectedTask?.description }}</p>
              <p><strong>Thời gian:</strong> {{ selectedTask?.time || 'Chưa cập nhật' }}</p>
              <button @click="closePopup" class="close-btn">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
// Sửa tên trạng thái
const editingStatusIdx = ref<number | null>(null)
const editingStatusName = ref('')

function startEditStatus(idx: number, name: string) {
  editingStatusIdx.value = idx
  editingStatusName.value = name
  nextTick(() => {
    const input = document.querySelector('.column-title-edit') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

async function saveEditStatus(idx: number) {
  const newName = editingStatusName.value.trim()
  if (newName && statuses.value[idx] !== newName) {
    // Gọi API cập nhật tên trạng thái
    await updateStatusNameApi(idx, newName)
    statuses.value[idx] = newName
  }
  editingStatusIdx.value = null
  editingStatusName.value = ''
}

// Hàm giả lập gọi API
async function updateStatusNameApi(idx: number, newName: string) {
  // Thay bằng gọi API thực tế
  return new Promise((resolve) => setTimeout(resolve, 500))
}
// Tách props kéo cột và kéo task
function columnDragProps(idx: number) {
  return {
    draggable: true,
    ondragstart: (e: DragEvent) => onColumnDragStart(idx, e),
    ondragover: (e: DragEvent) => onColumnDragOver(idx, e),
    ondrop: (e: DragEvent) => onColumnDrop(idx, e),
    ondragenter: (e: DragEvent) => onColumnDragEnter(idx, e),
    ondragleave: (e: DragEvent) => onColumnDragLeave(e),
  }
}
import { ref } from 'vue'
const statuses = ref(['Backlog', 'Selected', 'In Progress', 'Review', 'Done'])
// Drag column logic
const draggingColumnIdx = ref<number | null>(null)
const dragOverColumnIdx = ref<number | null>(null)

function onColumnDragStart(idx: number, e: DragEvent) {
  // Chỉ kéo cột khi không kéo task
  if (!draggingTask.value) {
    draggingColumnIdx.value = idx
    e.dataTransfer?.setData('type', 'column')
  }
}
function onColumnDragOver(idx: number, e: DragEvent) {
  if (
    draggingColumnIdx.value !== null &&
    draggingColumnIdx.value !== idx &&
    e.dataTransfer?.getData('type') === 'column'
  ) {
    dragOverColumnIdx.value = idx
  }
}
function onColumnDragEnter(idx: number, e: DragEvent) {
  if (
    draggingColumnIdx.value !== null &&
    draggingColumnIdx.value !== idx &&
    e.dataTransfer?.getData('type') === 'column'
  ) {
    dragOverColumnIdx.value = idx
  }
}
function onColumnDragLeave(e: DragEvent) {
  if (e.dataTransfer?.getData('type') === 'column') {
    dragOverColumnIdx.value = null
  }
}
function onColumnDrop(idx: number, e: DragEvent) {
  if (
    draggingColumnIdx.value !== null &&
    draggingColumnIdx.value !== idx &&
    e.dataTransfer?.getData('type') === 'column'
  ) {
    const col = statuses.value[draggingColumnIdx.value]
    statuses.value.splice(draggingColumnIdx.value, 1)
    statuses.value.splice(idx, 0, col)
  }
  draggingColumnIdx.value = null
  dragOverColumnIdx.value = null
}
interface Task {
  id: number
  title: string
  description: string
  status: string
  time?: string
}
const tasks = ref<Task[]>([
  {
    id: 1,
    title: 'Task 1',
    description: 'Mô tả task 1',
    status: 'Backlog',
    time: '2025-08-09 09:00',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Mô tả task 2',
    status: 'Selected',
    time: '2025-08-09 10:00',
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Mô tả task 3',
    status: 'In Progress',
    time: '2025-08-09 11:00',
  },
  {
    id: 4,
    title: 'Task 4',
    description: 'Mô tả task 4',
    status: 'Review',
    time: '2025-08-09 12:00',
  },
  {
    id: 5,
    title: 'Task 5',
    description: 'Mô tả task 5',
    status: 'Done',
    time: '2025-08-09 13:00',
  },
])
const showPopup = ref(false)
const selectedTask = ref<Task | null>(null)

function showTaskDetail(task: Task) {
  selectedTask.value = task
  showPopup.value = true
}
function closePopup() {
  showPopup.value = false
  selectedTask.value = null
}
const draggingTask = ref<Task | null>(null)
const dragOverStatus = ref<string | null>(null)

function tasksByStatus(status: string) {
  return tasks.value.filter((t) => t.status === status)
}
function onDragStart(task: Task) {
  draggingTask.value = task
}
function onDrop(newStatus: string) {
  if (draggingTask.value) {
    const idx = tasks.value.findIndex((t) => t.id === draggingTask.value!.id)
    if (idx !== -1) {
      tasks.value[idx].status = newStatus
    }
    draggingTask.value = null
    dragOverStatus.value = null
  }
}
function onDragEnter(status: string) {
  dragOverStatus.value = status
}
function onDragLeave() {
  dragOverStatus.value = null
}
</script>

<style scoped>
.task-detail-page {
  padding: 24px 0;
  background: #fff;
}
.task-board {
  display: flex;
  gap: 24px;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 500px;
  padding: 0 16px;
}
/* ...existing code... */
.task-column {
  background: #f8f8f8;
  border-radius: 12px;
  min-width: 260px;
  flex: 1;
  padding: 18px 12px 24px 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition:
    background 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.task-column.drag-over {
  background: #e6f7ff;
  box-shadow: 0 6px 24px rgba(79, 140, 255, 0.18);
}
.task-column.column-dragging {
  opacity: 0.7;
  box-shadow: 0 8px 32px rgba(79, 140, 255, 0.15);
  z-index: 3;
}
.column-title {
  font-weight: 600;
  margin-bottom: 18px;
  font-size: 1.08rem;
  color: #5a5a5a;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.2s;
}
.column-title:hover {
  background: #e6f7ff;
}
.column-title-edit {
  font-weight: 600;
  margin-bottom: 18px;
  font-size: 1.08rem;
  color: #2d3748;
  letter-spacing: 0.5px;
  border: 1.5px solid #4f8cff;
  border-radius: 6px;
  padding: 4px 10px;
  outline: none;
}
.task-list {
  min-height: 320px;
  width: 100%;
}
.task-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 16px 14px;
  margin-bottom: 16px;
  cursor: grab;
  transition:
    box-shadow 0.2s,
    transform 0.3s cubic-bezier(0.4, 2, 0.3, 1);
  border: 1.5px solid #f3f3f3;
  position: relative;
}
.task-card.dragging {
  opacity: 0.6;
  box-shadow: 0 6px 24px rgba(79, 140, 255, 0.18);
  transform: scale(1.05) rotate(-2deg);
  z-index: 2;
  border-color: #4f8cff;
}
.task-title {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 6px;
  color: #2d3748;
}
.task-desc {
  font-size: 0.95rem;
  color: #4a5568;
  margin-bottom: 4px;
}
.task-popup-overlay {
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
.task-popup {
  background: #fff;
  border-radius: 10px;
  padding: 32px 28px;
  min-width: 320px;
  max-width: 90vw;
  animation: popupIn 0.3s cubic-bezier(0.4, 2, 0.3, 1);
  box-shadow: 0 8px 32px rgba(79, 140, 255, 0.15);
}
@keyframes popupIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.close-btn {
  margin-top: 18px;
  padding: 8px 18px;
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:hover {
  background: #38b2ac;
}

.task-popup-overlay {
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
.task-popup {
  background: #fff;
  border-radius: 10px;
  padding: 32px 28px;
  min-width: 320px;
  max-width: 90vw;
  animation: popupIn 0.3s cubic-bezier(0.4, 2, 0.3, 1);
}
@keyframes popupIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.close-btn {
  margin-top: 18px;
  padding: 8px 18px;
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:hover {
  background: #38b2ac;
}
</style>
