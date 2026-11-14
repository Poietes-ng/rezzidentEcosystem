import { validatePhoneNG } from '@rezzident/utils'

const MAX_LOCAL_DIGITS = 10

/**
 * Strips all non-digits, removes a single leading '0' if present,
 * and caps the result at 10 digits.
 */
export function sanitizeAliasPhoneDigits(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, '')
  const withoutLeadingZero = digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly
  return withoutLeadingZero.slice(0, MAX_LOCAL_DIGITS)
}

/**
 * Formats a raw or sanitized phone string into 3-3-4 grouping (e.g. "801 234 5678").
 */
export function formatAliasPhoneDisplay(raw: string): string {
  const digits = sanitizeAliasPhoneDigits(raw)
  if (digits.length <= 3) {
    return digits
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`
  }
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, MAX_LOCAL_DIGITS)}`
}

/**
 * Validates a 10-digit Nigerian local phone number using @rezzident/utils validatePhoneNG.
 */
export function isValidAliasPhone(raw: string): boolean {
  const digits = sanitizeAliasPhoneDigits(raw)
  if (digits.length !== MAX_LOCAL_DIGITS) {
    return false
  }
  return validatePhoneNG(`+234${digits}`)
}
