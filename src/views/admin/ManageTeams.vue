<template>
  <div class="container-fluid py-2 py-md-0">
    <div style="max-width: 1175px; margin: 0 auto; padding: 0 20px">
      <!-- Header Section -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
        <h1 class="text-design-dark mb-0" style="font-size: 1.3rem; font-weight: 600">
          Team Members
        </h1>
        <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3">
          <a href="#" class="text-danger fw-bold text-decoration-none" style="font-size: 0.875rem">
            Member Rights
          </a>
          <button
            @click="openAddDialog"
            class="btn btn-design-red fw-bold d-flex align-items-center gap-2"
            style="font-size: 0.875rem"
          >
            <i class="bi bi-plus"></i>
            Add New
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div style="height: 1px; background-color: #dadada; margin-bottom: 2rem"></div>

      <!-- Team Members Grid -->
      <div class="row g-4">
        <div
          v-for="member in members"
          :key="member.id"
          class="col-12 col-sm-6 col-lg-4 col-xl-3"
        >
          <div class="card card-design h-100">
            <!-- Avatar Section -->
            <div class="d-flex justify-content-center pt-5 pb-3">
              <div class="avatar-circle">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M39.5833 43.75V39.5833C39.5833 37.3732 38.7053 35.2536 37.1425 33.6908C35.5797 32.128 33.4601 31.25 31.25 31.25H18.75C16.5398 31.25 14.4202 32.128 12.8574 33.6908C11.2946 35.2536 10.4166 37.3732 10.4166 39.5833V43.75"
                    stroke="black"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M25 22.9167C29.6023 22.9167 33.3333 19.1857 33.3333 14.5833C33.3333 9.98096 29.6023 6.25 25 6.25C20.3976 6.25 16.6666 9.98096 16.6666 14.5833C16.6666 19.1857 20.3976 22.9167 25 22.9167Z"
                    stroke="black"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <!-- Member Info -->
            <div class="text-center px-3 pb-3">
              <h5 class="text-dark-heavy mb-1">{{ member.name }}</h5>
              <p class="text-muted-design mb-0" style="font-size: 0.875rem">{{ member.role }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2 px-3 pb-3">
              <button
                @click="openEditDialog(member)"
                class="btn btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                style="font-size: 0.875rem; color: #9b9b9b; border-color: #dadada"
              >
                <i class="bi bi-pencil"></i>
                Edit
              </button>
              <button
                @click="handleDelete(member.id)"
                class="btn btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                style="font-size: 0.875rem; color: #9b9b9b; border-color: #dadada"
              >
                <i class="bi bi-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="members.length === 0" class="text-center py-5">
        <p class="text-design-gray mb-4">No team members yet.</p>
        <button @click="openAddDialog" class="btn btn-design-red d-inline-flex align-items-center gap-2">
          <i class="bi bi-plus"></i>
          Add First Member
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="isDialogOpen"
      class="modal fade show d-block"
      style="background-color: rgba(0, 0, 0, 0.4)"
      tabindex="-1"
      @click.self="closeDialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title text-design-dark fw-bold">
              {{ isEditMode ? 'Edit Team Member' : 'Add Team Member' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDialog"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label fw-bold text-design-dark">Name</label>
              <input
                v-model="formData.name"
                id="name"
                type="text"
                class="form-control border-design"
                placeholder="Enter member name"
              />
            </div>
            <div class="mb-3">
              <label for="role" class="form-label fw-bold text-design-dark">Role</label>
              <input
                v-model="formData.role"
                id="role"
                type="text"
                class="form-control border-design"
                placeholder="Enter member role"
              />
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-outline-secondary" @click="closeDialog">
              Cancel
            </button>
            <button type="button" class="btn btn-design-red" @click="handleSave">
              {{ isEditMode ? 'Update' : 'Add' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { members as initialMembers } from '@/data/teamMembers'
import { ref } from 'vue'
import type { TeamMember } from '@/types/teamMember'
const members = ref([...initialMembers])

const isDialogOpen = ref(false)
const isEditMode = ref(false)
const editingId = ref<string | null>(null)
const formData = ref({ name: '', role: '' })

const openAddDialog = () => {
  isEditMode.value = false
  editingId.value = null
  formData.value = { name: '', role: '' }
  isDialogOpen.value = true
}

const openEditDialog = (member: TeamMember) => {
  isEditMode.value = true
  editingId.value = member.id
  formData.value = { name: member.name, role: member.role }
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  formData.value = { name: '', role: '' }
}

const handleSave = () => {
  if (!formData.value.name.trim() || !formData.value.role.trim()) {
    alert('Please fill in all fields')
    return
  }

  if (isEditMode.value && editingId.value) {
    const index = members.value.findIndex((m: TeamMember) => m.id === editingId.value)
    if (index !== -1) {
      members.value[index] = {
        id: editingId.value,
        name: formData.value.name,
        role: formData.value.role,
      }
    }
  } else {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: formData.value.name,
      role: formData.value.role,
    }
    members.value.push(newMember)
  }

  closeDialog()
}

const handleDelete = (id: string) => {
  if (confirm('Are you sure you want to delete this member?')) {
    members.value = members.value.filter((m: TeamMember) => m.id !== id)
  }
}
</script>

<style scoped>
.container-fluid {
  background-color: #ffffff;
}

.form-control:focus {
  border-color: #ff4f5a;
  box-shadow: 0 0 0 0.2rem rgba(255, 79, 90, 0.25);
}

.btn-outline-secondary:hover {
  background-color: #f0f0f0;
}

.modal.show {
  display: block;
}
.btn-design-red {
  background-color: #FF4F5A;
  color: white;
  border: none;
}
.btn-design-red:hover {
  background-color: #d9363e;
}

</style>
