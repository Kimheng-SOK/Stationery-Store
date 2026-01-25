<template>
  <div class="form-field-wrapper">
    <label v-if="label" :for="fieldId" class="form-label" :class="{ 'fw-semibold': semibold }">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <!-- Text Input -->
    <input
      v-if="type === 'text' || type === 'email' || type === 'number' || type === 'password' || type === 'url'"
      :id="fieldId"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :class="['form-control', { 'is-invalid': !!error }]"
      :required="required"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      @input="if ($event.target) $emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    />

    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="fieldId"
      :value="props.modelValue as string"
      :placeholder="placeholder"
      :class="['form-control', { 'is-invalid': !!error }]"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      @input="if ($event.target) $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur')"
    ></textarea>

    <!-- Select -->
    <select
      v-else-if="type === 'select'"
      :id="fieldId"
      :value="modelValue"
      :class="['form-select', { 'is-invalid': !!error }]"
      :required="required"
      :disabled="disabled"
      @change="if ($event.target) $emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @blur="$emit('blur')"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <!-- Checkbox -->
    <div v-else-if="type === 'checkbox'" class="form-check">
      <input
        :id="fieldId"
        type="checkbox"
        :checked="!!modelValue"
        :class="['form-check-input', { 'is-invalid': !!error }]"
        :required="required"
        :disabled="disabled"
        @change="if ($event.target) $emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <label :for="fieldId" class="form-check-label">{{ label }}</label>
    </div>

    <!-- Date Input -->
    <input
      v-else-if="type === 'date'"
      :id="fieldId"
      :value="modelValue"
      type="date"
      :class="['form-control', { 'is-invalid': !!error }]"
      :required="required"
      :disabled="disabled"
      @input="if ($event.target) $emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    />

    <!-- Error Message -->
    <small v-if="error" class="text-danger d-block mt-1">
      <i class="bi bi-exclamation-circle me-1"></i>
      {{ error }}
    </small>

    <!-- Help Text -->
    <small v-if="helpText && !error" class="text-muted d-block mt-1">{{ helpText }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue: unknown
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'textarea' | 'select' | 'checkbox' | 'date'
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  semibold?: boolean
  helpText?: string
  fieldId?: string
  rows?: number
  min?: number | string
  max?: number | string
  step?: number | string
  options?: SelectOption[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  placeholder: '',
  error: '',
  required: false,
  disabled: false,
  semibold: false,
  helpText: '',
  rows: 3,
})

defineEmits<{
  'update:modelValue': [value: unknown]
  blur: []
}>()

const fieldId = computed(() => props.fieldId || `field-${Math.random().toString(36).substr(2, 9)}`)
</script>

<style scoped>
.form-field-wrapper {
  margin-bottom: 1rem;
}

.form-label {
  margin-bottom: 0.5rem;
  color: #212529;
  font-size: 0.9375rem;
}

.form-control,
.form-select {
  font-size: 0.9375rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus,
.form-select.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.text-danger {
  color: #dc3545;
}

.text-muted {
  color: #6c757d;
}

.d-block {
  display: block;
}

.mt-1 {
  margin-top: 0.25rem;
}
</style>
