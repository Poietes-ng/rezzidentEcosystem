import { useState, useCallback } from 'react'

interface FormErrors {
  [field: string]: string
}

interface UseAuthFormOptions {
  /** Which form variant to validate for */
  mode: 'sign-in' | 'sign-up'
}

/**
 * Reusable form state and validation hook for sign-in and sign-up forms.
 * Encapsulates email, password, name state + validation + error handling.
 */
export function useAuthForm({ mode }: UseAuthFormOptions) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [email, password, mode])

  const reset = useCallback(() => {
    setEmail('')
    setPassword('')
    setErrors({})
    setIsSubmitting(false)
  }, [])

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  return {
    // State
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isSubmitting,
    setIsSubmitting,

    // Actions
    validate,
    reset,
    clearError,
  }
}
