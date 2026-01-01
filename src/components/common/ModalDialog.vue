<template>
  <div v-if="isOpen" class="modal d-block" :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }">
    <div :class="['modal-dialog', sizeClass]">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header" :class="headerClass">
          <h3 class="modal-title">{{ title }}</h3>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
            :disabled="isDisabled"
          ></button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Success/Error Message -->
          <div v-if="message" :class="['alert', `alert-${message.type}`]">
            <i
              :class="`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`"
            ></i>
            {{ message.text }}
          </div>

          <!-- Slot for content -->
          <slot></slot>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <slot name="footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
              :disabled="isDisabled"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="submitModal"
              :disabled="isDisabled"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ submitText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type MessageType = 'success' | 'error'
type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalMessage {
  type: MessageType
  text: string
}

interface Props {
  isOpen: boolean
  title: string
  size?: ModalSize
  headerClass?: string
  isSubmitting?: boolean
  message?: ModalMessage | null
  submitText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  headerClass: '',
  isSubmitting: false,
  submitText: 'Save',
  cancelText: 'Cancel',
})

const emit = defineEmits<{
  close: []
  submit: []
}>()

const sizeClass = computed(() => {
  const sizes: Record<ModalSize, string> = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl',
  }
  return sizes[props.size || 'lg']
})

const isDisabled = computed(() => props.isSubmitting)

const closeModal = () => {
  emit('close')
}

const submitModal = () => {
  emit('submit')
}
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 1050;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
}

.modal-dialog.modal-sm {
  max-width: 300px;
}

.modal-dialog.modal-lg {
  max-width: 800px;
}

.modal-dialog.modal-xl {
  max-width: 1140px;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  outline: 0;
}

.modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-header.bg-light {
  background-color: #f8f9fa;
}

.modal-title {
  margin: 0;
  line-height: 1.5;
  color: inherit;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  gap: 0.75rem;
}

.btn-close {
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  padding: 0.25em 0.25em;
  color: #000;
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%23000' d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center / 1em auto no-repeat;
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;
  cursor: pointer;
}

.btn-close:hover {
  color: #000;
  text-decoration: none;
  opacity: 0.75;
}

.btn-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alert {
  position: relative;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-error {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert i {
  margin-right: 0.5rem;
}

.btn {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  color: #fff;
  background-color: #5a6268;
  border-color: #545b62;
}

.btn-primary {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover:not(:disabled) {
  color: #fff;
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.2em;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

.me-2 {
  margin-right: 0.5rem;
}

@media (max-width: 576px) {
  .modal-dialog {
    margin: 0.5rem;
  }

  .modal-dialog.modal-lg {
    max-width: 100%;
  }
}
</style>
