<template>
  <div class="file-upload-container">
    <!-- Upload Tabs -->
    <div class="upload-tabs">
      <button
        :class="['tab-btn', { active: uploadMode === 'url' }]"
        @click="uploadMode = 'url'"
      >
        <i class="bi bi-link-45deg"></i>
        <span>From URL</span>
      </button>
      <button
        :class="['tab-btn', { active: uploadMode === 'device' }]"
        @click="uploadMode = 'device'"
      >
        <i class="bi bi-upload"></i>
        <span>From Device</span>
      </button>
    </div>

    <!-- URL Upload Mode -->
    <div v-if="uploadMode === 'url'" class="upload-section">
      <label class="form-label fw-semibold">Image URL</label>
      <div class="url-input-group">
        <input
          v-model="urlInput"
          type="url"
          placeholder="https://example.com/image.jpg"
          class="form-control"
          @keyup.enter="addFromUrl"
        />
        <button
          @click="addFromUrl"
          class="btn btn-primary"
          :disabled="!urlInput || isLoading"
          type="button"
        >
          <i v-if="isLoading" class="bi bi-hourglass-split spinner"></i>
          <i v-else class="bi bi-plus"></i>
          <span>{{ isLoading ? 'Loading...' : 'Add' }}</span>
        </button>
      </div>
      <small class="text-muted d-block mt-2">
        Enter a valid image URL. Supported formats: JPG, PNG, GIF, WebP
      </small>
    </div>

    <!-- Device Upload Mode -->
    <div v-else class="upload-section">
      <label class="form-label fw-semibold">Choose File</label>
      <div
        :class="['file-drop-zone', { 'drag-over': isDragging }]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="file-input-hidden"
          @change="handleFileSelect"
        />
        <div class="drop-zone-content">
          <i class="bi bi-cloud-upload drop-icon"></i>
          <p class="drop-text">
            Drag and drop your image here or
            <button
              @click="fileInput?.click()"
              class="link-primary text-decoration-none fw-semibold"
              type="button"
            >
              click to browse
            </button>
          </p>
          <small class="text-muted">Max file size: 5MB</small>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div v-if="imagePreview" class="preview-section">
      <label class="form-label fw-semibold">Preview</label>
      <div class="preview-wrapper">
        <img :src="imagePreview" :alt="altText" class="preview-image" />
        <button
          @click="clearImage"
          class="btn btn-sm btn-outline-danger clear-btn"
          type="button"
          title="Remove image"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-danger alert-sm mt-3 mb-0">
      <i class="bi bi-exclamation-circle"></i>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string
  altText?: string
  maxSizeMb?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  altText: 'Uploaded image',
  maxSizeMb: 5,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uploadMode = ref<'url' | 'device'>('device')
const urlInput = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isLoading = ref(false)
const imagePreview = ref(props.modelValue)
const errorMessage = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    imagePreview.value = newValue
  }
)

const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const contentType = response.headers.get('content-type')
    return contentType?.startsWith('image/') ?? false
  } catch {
    return false
  }
}

const addFromUrl = async () => {
  if (!urlInput.value) {
    errorMessage.value = 'Please enter a URL'
    return
  }

  try {
    errorMessage.value = ''
    isLoading.value = true

    const isValid = await validateImageUrl(urlInput.value)
    if (!isValid) {
      errorMessage.value = 'Invalid image URL or image is not accessible'
      return
    }

    imagePreview.value = urlInput.value
    emit('update:modelValue', urlInput.value)
    urlInput.value = ''
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    errorMessage.value = 'Failed to load image from URL'
  } finally {
    isLoading.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  errorMessage.value = ''

  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Please select an image file'
    return
  }

  // Validate file size
  const maxSize = props.maxSizeMb * 1024 * 1024
  if (file.size > maxSize) {
    errorMessage.value = `File size must be less than ${props.maxSizeMb}MB`
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    imagePreview.value = dataUrl
    emit('update:modelValue', dataUrl)
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imagePreview.value = ''
  emit('update:modelValue', '')
  urlInput.value = ''
  errorMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.file-upload-container {
  width: 100%;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
}

.upload-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  background: #fff;
  border-radius: 0.375rem;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  border-color: #0d6efd;
  color: #0d6efd;
}

.tab-btn.active {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}

.upload-section {
  margin-bottom: 1.5rem;
}

.form-label {
  margin-bottom: 0.75rem;
  color: #212529;
  font-size: 0.9375rem;
}

.url-input-group {
  display: flex;
  gap: 0.75rem;
}

.url-input-group .form-control {
  flex: 1;
}

.url-input-group .btn {
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.file-drop-zone {
  border: 2px dashed #dee2e6;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  background: #fff;
  transition: all 0.2s;
  cursor: pointer;
}

.file-drop-zone:hover {
  border-color: #0d6efd;
  background: #f0f7ff;
}

.file-drop-zone.drag-over {
  border-color: #0d6efd;
  background: #e7f1ff;
}

.file-input-hidden {
  display: none;
}

.drop-icon {
  font-size: 2.5rem;
  color: #0d6efd;
  margin-bottom: 0.5rem;
}

.drop-text {
  margin: 0.5rem 0;
  color: #495057;
  font-size: 0.9375rem;
}

.preview-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.preview-wrapper {
  position: relative;
  display: inline-block;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f8f9fa;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  display: block;
  border-radius: 0.5rem;
}

.clear-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-wrapper:hover .clear-btn {
  opacity: 1;
}

.alert-sm {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.alert-sm i {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .file-upload-container {
    padding: 1rem;
  }

  .upload-tabs {
    flex-direction: column;
  }

  .url-input-group {
    flex-direction: column;
  }

  .file-drop-zone {
    padding: 1.5rem 1rem;
  }

  .preview-image {
    max-width: 150px;
    max-height: 150px;
  }
}
</style>
