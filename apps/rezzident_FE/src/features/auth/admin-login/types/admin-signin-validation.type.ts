import type { EstateFormData, FieldErrors } from './admin-signin.type'

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
      if (!form.email.trim()) errors.email = 'Estate name is required.'
      else if (form.email.trim().length < 2)
        errors.estateName = 'Estate name must be at least 2 characters.'

      if (!form.password.trim()) errors.password = 'Estate address is required.'
      else if (form.password.trim().length < 5)
        errors.estateAddress = 'Address must be at least 5 characters.'

      if (!form.estate_id) errors.stateLocated = 'Please select a state.'
      if (!form.estate_id) errors.lgaLocated = 'Please select a Local Government Area.'
      break
    }

    // Step 2
    default:
      break
  }

  return errors
}
