import { describe, expect, it } from 'vitest'
import { formatActivityDate } from '#/shared/utils/date'

describe('formatActivityDate', () => {
  it('formats an ISO date string to "DD MMM, H:MM AM/PM" format', () => {
    // 2026-07-27 at 14:34 UTC or local
    const date = new Date(2026, 6, 27, 14, 34) // Month is 0-indexed, so 6 is July
    expect(formatActivityDate(date)).toBe('27 Jul, 2:34PM')
  })

  it('formats AM hours properly', () => {
    const date = new Date(2026, 0, 5, 9, 5)
    expect(formatActivityDate(date)).toBe('5 Jan, 9:05AM')
  })

  it('handles invalid date input gracefully', () => {
    expect(formatActivityDate('invalid-date')).toBe('invalid-date')
  })
})
