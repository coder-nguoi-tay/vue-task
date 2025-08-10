<template>
  <div class="input-field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', String(modelValue))"
      :class="{ 'is-invalid': error }"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Props {
  modelValue: string | unknown
  label: string
  type?: string
  placeholder?: string
  error?: string
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { modelValue } = props
</script>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1.2rem;
}

.input-field label {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 2px;
  font-size: 1rem;
}

.input-field input {
  padding: 10px 12px;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background: #f7fafc;
  color: #2d3748;
}
.input-field input:focus {
  border-color: #4f8cff;
  box-shadow: 0 0 0 2px rgba(79, 140, 255, 0.15);
}
.input-field input.is-invalid {
  border-color: #e53e3e;
  background: #fff5f5;
}

.error-message {
  color: #e53e3e;
  font-size: 0.92rem;
  margin-top: 2px;
}
</style>
