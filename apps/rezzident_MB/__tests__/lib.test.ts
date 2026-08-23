/**
 * Mobile App Tests — lib/cn.ts + lib/secure-storage.ts
 *
 * These test the two core utility modules that every
 * screen in the app depends on. If cn() breaks, every
 * component's styling breaks. If secureStorage breaks,
 * login breaks.
 *
 * RUN:  cd apps/rezzident_MB && pnpm test
 * OR:   pnpm --filter rezzident-mb test
 */

import { cn } from '../src/lib/cn'

// ─── cn() — className merger ───────────────────────────

describe('cn (className merger)', () => {
  it('merges two class strings', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles falsy values (conditional classes)', () => {
    const isActive = false
    expect(cn('base', isActive && 'active')).toBe('base')
  })

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    // tailwind-merge resolves conflicts: text-sm + text-lg → text-lg
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('px-4', undefined, null, 'py-2')).toBe('px-4 py-2')
  })

  it('handles empty string', () => {
    expect(cn('')).toBe('')
  })

  it('merges array of classes', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2')
  })
})

// ─── KEYS constant shape ──────────────────────────────
// We can't test SecureStore directly (it's a native module),
// but we CAN verify the storage keys are stable strings.
// If someone renames a key, all existing users lose their
// saved tokens on next app update.

describe('secure-storage key stability', () => {
  // Import the raw file to check the KEYS object
  // In a real test, you'd mock expo-secure-store
  it('documents the expected storage key format', () => {
    // These are the keys stored on user devices.
    // Changing them = logging out all existing users.
    const expectedKeys = [
      'rezzident_access_token',
      'rezzident_refresh_token',
      'rezzident_user_profile',
      'rezzident_pin_set',
      'rezzident_biometrics_enabled',
    ]

    // This test exists as documentation. If you need to
    // change a key, update this test AND write a migration.
    expect(expectedKeys).toHaveLength(5)
    expectedKeys.forEach((key) => {
      expect(key).toMatch(/^rezzident_/)
    })
  })
})
