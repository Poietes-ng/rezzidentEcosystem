import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles false/undefined', () => {
    const isHidden = false as boolean
    expect(cn('base', isHidden && 'hidden')).toBe('base')
  })

  it('last Tailwind class wins', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })
})
