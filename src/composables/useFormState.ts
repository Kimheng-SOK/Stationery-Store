import { ref, reactive, computed } from 'vue'

export interface FormValidationRule {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormField {
  value: any
  error?: string
  rules?: FormValidationRule
}

export function useFormState<T extends Record<string, any>>(initialData: T) {
  const formData = reactive<T>(JSON.parse(JSON.stringify(initialData)))
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const isSubmitting = ref(false)
  const submitMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

  const validateField = (
    fieldName: keyof T,
    value: any,
    rules?: FormValidationRule
  ): string | null => {
    if (!rules) return null

    // Required validation
    if (rules.required && (value === '' || value === null || value === undefined)) {
      return 'This field is required'
    }

    // String length validation
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Minimum length is ${rules.minLength} characters`
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Maximum length is ${rules.maxLength} characters`
      }
    }

    // Number validation
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `Minimum value is ${rules.min}`
      }
      if (rules.max !== undefined && value > rules.max) {
        return `Maximum value is ${rules.max}`
      }
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format'
    }

    // Custom validation
    if (rules.custom) {
      const result = rules.custom(value)
      if (typeof result === 'string') {
        return result
      }
      if (result === false) {
        return 'Validation failed'
      }
    }

    return null
  }

  const validateForm = (validationRules: Partial<Record<keyof T, FormValidationRule>>) => {
    const newErrors: Partial<Record<keyof T, string>> = {}

    for (const fieldName in validationRules) {
      const error = validateField(
        fieldName,
        formData[fieldName],
        validationRules[fieldName as keyof T]
      )
      if (error) {
        newErrors[fieldName as keyof T] = error
      }
    }

    Object.assign(errors, newErrors)
    return Object.keys(newErrors).length === 0
  }

  const setFieldError = (fieldName: keyof T, error: string) => {
    errors[fieldName] = error
  }

  const clearFieldError = (fieldName: keyof T) => {
    delete errors[fieldName]
  }

  const clearErrors = () => {
    Object.keys(errors).forEach((key) => {
      delete errors[key as keyof T]
    })
  }

  const setFormData = (data: Partial<T>) => {
    Object.assign(formData, data)
  }

  const resetForm = () => {
    Object.assign(formData, JSON.parse(JSON.stringify(initialData)))
    clearErrors()
    submitMessage.value = null
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)

  const showSuccess = (message: string) => {
    submitMessage.value = { type: 'success', text: message }
    setTimeout(() => {
      submitMessage.value = null
    }, 3000)
  }

  const showError = (message: string) => {
    submitMessage.value = { type: 'error', text: message }
    setTimeout(() => {
      submitMessage.value = null
    }, 3000)
  }

  return {
    formData,
    errors,
    isSubmitting,
    submitMessage,
    hasErrors,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    clearErrors,
    setFormData,
    resetForm,
    showSuccess,
    showError,
  }
}
