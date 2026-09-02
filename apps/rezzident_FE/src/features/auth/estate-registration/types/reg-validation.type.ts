import type { EstateFormData, FieldErrors } from './reg-form.types'

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
      if (!form.estateName.trim()) errors.estateName = 'Estate name is required.'
      else if (form.estateName.trim().length < 2)
        errors.estateName = 'Estate name must be at least 2 characters.'

      if (!form.estateAddress.trim()) errors.estateAddress = 'Estate address is required.'
      else if (form.estateAddress.trim().length < 5)
        errors.estateAddress = 'Address must be at least 5 characters.'

      if (!form.stateLocated) errors.stateLocated = 'Please select a state.'
      if (!form.lgaLocated) errors.lgaLocated = 'Please select a Local Government Area.'
      break
    }
    case 3: {
      if (!form.levelStructure) errors.levelStructure = 'Please select a level structure.'
      if (!form.estateStructure) errors.estateStructure = 'Please select an estate structure type.'
      break
    }
    case 4: {
      if (!form.numberOfUnits) errors.numberOfUnits = 'Please select number of units.'
      if (form.numberOfUnits === 'Custom') {
        const customNum = parseInt(form.customNumberOfUnits, 10)
        if (!form.customNumberOfUnits.trim() || isNaN(customNum) || customNum < 1) {
          errors.customNumberOfUnits = 'Please enter a valid number of units (at least 1).'
        }
      }
      break
    }
    case 5: {
      if (!form.bankAccountNumber.trim()) errors.bankAccountNumber = 'Account number is required.'
      else if (!isValidAccountNumber(form.bankAccountNumber.trim()))
        errors.bankAccountNumber = 'Account number must be exactly 10 digits.'

      if (!form.bankName) errors.bankName = 'Please select a bank.'
      if (!form.bankAccountName.trim()) errors.bankAccountName = 'Account name is required.'
      break
    }
    case 6: {
      if (!form.stakeholder1Name.trim()) errors.stakeholder1Name = 'Full name is required.'
      if (!form.stakeholder1Phone.trim()) errors.stakeholder1Phone = 'Phone number is required.'
      else if (!isValidPhone(form.stakeholder1Phone))
        errors.stakeholder1Phone = 'Enter a valid phone number (7-11 digits).'
      if (!form.stakeholder1Email.trim()) errors.stakeholder1Email = 'Email address is required.'
      else if (!isValidEmail(form.stakeholder1Email))
        errors.stakeholder1Email = 'Please enter a valid email address.'
      break
    }
    case 7: {
      if (!form.stakeholder2Name.trim()) errors.stakeholder2Name = 'Full name is required.'
      if (!form.stakeholder2Phone.trim()) errors.stakeholder2Phone = 'Phone number is required.'
      else if (!isValidPhone(form.stakeholder2Phone))
        errors.stakeholder2Phone = 'Enter a valid phone number (7-11 digits).'
      if (!form.stakeholder2Email.trim()) errors.stakeholder2Email = 'Email address is required.'
      else if (!isValidEmail(form.stakeholder2Email))
        errors.stakeholder2Email = 'Please enter a valid email address.'
      break
    }
    // Step 2 (structure carousel) and step 8 (CSV upload) have no required fields
    default:
      break
  }

  return errors
}
