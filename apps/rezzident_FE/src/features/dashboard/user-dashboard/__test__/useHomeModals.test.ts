import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useHomeModals } from '#/features/dashboard/user-dashboard/hooks/useHomeModals'

describe('useHomeModals', () => {
  it('initializes with provided modal or null', () => {
    const { result } = renderHook(() => useHomeModals())
    expect(result.current.activeModal).toBeNull()

    const { result: initializedResult } = renderHook(() => useHomeModals('update'))
    expect(initializedResult.current.activeModal).toBe('update')
    expect(initializedResult.current.isModalOpen('update')).toBe(true)
    expect(initializedResult.current.isModalOpen('feedback')).toBe(false)
  })

  it('allows only one modal to be open at a time and opening another replaces the current one', () => {
    const { result } = renderHook(() => useHomeModals('how-it-works'))

    expect(result.current.activeModal).toBe('how-it-works')

    act(() => {
      result.current.openModal('feedback')
    })

    expect(result.current.activeModal).toBe('feedback')
    expect(result.current.isModalOpen('feedback')).toBe(true)
    expect(result.current.isModalOpen('how-it-works')).toBe(false)

    act(() => {
      result.current.openModal('update')
    })

    expect(result.current.activeModal).toBe('update')
    expect(result.current.isModalOpen('update')).toBe(true)
    expect(result.current.isModalOpen('feedback')).toBe(false)

    act(() => {
      result.current.closeModal()
    })

    expect(result.current.activeModal).toBeNull()
    expect(result.current.isModalOpen('update')).toBe(false)
  })
})
