import type { EstateFormData, FieldErrors } from './admin-signin.types'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  return /^\d{7,11}$/.test(phone.replace(/\s/g, ''))
}

function isValidAccountNumber(acct: string): boolean {
  return /^\d{10}$/.test(acct)
}

/** Maps a sub-step to its position in the 4-step progress bar. */
export function subStepToLogical(sub: number): number {
  if (sub <= 3) return 1
  if (sub <= 5) return 2
  if (sub <= 7) return 3
  return 4
}

/** Validate the current step, returning per-field errors. Empty object = all valid. */
export function validateStep(subStep: number, form: EstateFormData): FieldErrors {
  const errors: FieldErrors = {}

  switch (subStep) {
    case 1: {
      if (!form.email.trim()) errors.email = 'Email is required.'
      else if (!isValidEmail(form.email.trim())) errors.email = 'Invalid email address.'

      if (!form.password.trim()) errors.password = 'Password is required.'
      else if (form.password.trim().length < 5)
        errors.password = 'Password must be at least 5 characters.'

      break
    }

    // Step 2
    default:
      break
  }

  return errors
}
