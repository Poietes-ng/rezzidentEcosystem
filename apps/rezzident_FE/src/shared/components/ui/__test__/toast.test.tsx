import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Toast } from '../toast'

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders message and check icon when open is true', () => {
    render(<Toast open={true} onClose={vi.fn()} message="Feedback Submitted" />)

    const toast = screen.getByRole('status')
    expect(toast).toBeDefined()
    expect(toast.textContent).toContain('Feedback Submitted')
    expect(toast.textContent).toContain('check_circle')
  })

  it('does not render when open is false', () => {
    render(<Toast open={false} onClose={vi.fn()} message="Feedback Submitted" />)

    expect(screen.queryByRole('status')).toBeNull()
  })

  it('automatically calls onClose after duration', () => {
    const handleClose = vi.fn()
    render(<Toast open={true} onClose={handleClose} message="Feedback Submitted" duration={3500} />)

    expect(handleClose).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3500)
    })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('clears timer on unmount', () => {
    const handleClose = vi.fn()
    const { unmount } = render(
      <Toast open={true} onClose={handleClose} message="Feedback Submitted" duration={3500} />,
    )

    unmount()

    act(() => {
      vi.advanceTimersByTime(3500)
    })

    expect(handleClose).not.toHaveBeenCalled()
  })
})
