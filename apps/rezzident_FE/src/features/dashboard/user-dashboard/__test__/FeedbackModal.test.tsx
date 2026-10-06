// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FeedbackModal } from '#/features/dashboard/user-dashboard/components/FeedbackModal'
import * as homeQueries from '#/features/dashboard/user-dashboard/api/homeQueries'

describe('FeedbackModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders nothing when open is false', () => {
    const { container } = render(<FeedbackModal open={false} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders title, question, 5 faces radiogroup, Skip and disabled Submit on open', () => {
    render(<FeedbackModal open={true} onClose={vi.fn()} />)

    expect(screen.getByText('User Feedback')).toBeDefined()
    expect(screen.getByText('How are you enjoying the app so far?')).toBeDefined()

    const radiogroup = screen.getByRole('radiogroup', {
      name: /how are you enjoying the app so far\?/i,
    })
    expect(radiogroup).toBeDefined()

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(5)

    const skipBtn = screen.getByRole('button', { name: /^skip$/i })
    const submitBtn = screen.getByRole('button', { name: /^submit$/i })

    expect(skipBtn.hasAttribute('disabled')).toBe(false)
    expect(submitBtn.hasAttribute('disabled')).toBe(true)
  })

  it('enables Submit when a face is selected and updates visual state', () => {
    render(<FeedbackModal open={true} onClose={vi.fn()} />)

    const radios = screen.getAllByRole('radio')
    const satisfiedRadio = screen.getByRole('radio', { name: /^satisfied$/i })

    fireEvent.click(satisfiedRadio)

    expect(satisfiedRadio.getAttribute('aria-checked')).toBe('true')
    const submitBtn = screen.getByRole('button', { name: /^submit$/i })
    expect(submitBtn.hasAttribute('disabled')).toBe(false)

    // Others should have aria-checked="false"
    radios.forEach((radio) => {
      if (radio !== satisfiedRadio) {
        expect(radio.getAttribute('aria-checked')).toBe('false')
      }
    })
  })

  it('supports roving tabindex and arrow keys to navigate rating faces', () => {
    render(<FeedbackModal open={true} onClose={vi.fn()} />)

    const radios = screen.getAllByRole('radio')
    expect(radios[0].getAttribute('tabIndex')).toBe('0')
    expect(radios[1].getAttribute('tabIndex')).toBe('-1')

    fireEvent.keyDown(radios[0], { key: 'ArrowRight' })
    expect(radios[1].getAttribute('aria-checked')).toBe('true')

    fireEvent.keyDown(radios[1], { key: 'ArrowLeft' })
    expect(radios[0].getAttribute('aria-checked')).toBe('true')
  })

  it('calls onClose and does not submit when Skip is clicked', () => {
    const handleClose = vi.fn()
    const submitSpy = vi.spyOn(homeQueries, 'submitFeedback')

    render(<FeedbackModal open={true} onClose={handleClose} />)

    const skipBtn = screen.getByRole('button', { name: /^skip$/i })
    fireEvent.click(skipBtn)

    expect(handleClose).toHaveBeenCalledTimes(1)
    expect(submitSpy).not.toHaveBeenCalled()
  })

  it('calls onClose and does not submit when Close X is clicked', () => {
    const handleClose = vi.fn()
    const submitSpy = vi.spyOn(homeQueries, 'submitFeedback')

    render(<FeedbackModal open={true} onClose={handleClose} />)

    const closeBtn = screen.getByRole('button', { name: /close feedback modal/i })
    fireEvent.click(closeBtn)

    expect(handleClose).toHaveBeenCalledTimes(1)
    expect(submitSpy).not.toHaveBeenCalled()
  })

  it('closes on Escape key press without submitting', () => {
    const handleClose = vi.fn()
    const submitSpy = vi.spyOn(homeQueries, 'submitFeedback')

    render(<FeedbackModal open={true} onClose={handleClose} />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(handleClose).toHaveBeenCalledTimes(1)
    expect(submitSpy).not.toHaveBeenCalled()
  })

  it('submits rating once even if clicked rapidly and calls onFeedbackSubmitted on success', async () => {
    const handleClose = vi.fn()
    const handleFeedbackSubmitted = vi.fn()
    const submitSpy = vi
      .spyOn(homeQueries, 'submitFeedback')
      .mockImplementation(() => new Promise((res) => setTimeout(() => res({ success: true }), 100)))

    render(
      <FeedbackModal
        open={true}
        onClose={handleClose}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />,
    )

    const satisfiedRadio = screen.getByRole('radio', { name: /^satisfied$/i })
    fireEvent.click(satisfiedRadio)

    const submitBtn = screen.getByRole('button', { name: /^submit$/i })
    fireEvent.click(submitBtn)
    fireEvent.click(submitBtn) // Rapid double click

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy).toHaveBeenCalledWith('satisfied')

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1)
      expect(handleFeedbackSubmitted).toHaveBeenCalledTimes(1)
    })
  })

  it('displays error alert on failure, retains selection, and allows retry', async () => {
    const submitSpy = vi
      .spyOn(homeQueries, 'submitFeedback')
      .mockRejectedValueOnce(new Error('Network error. Please try again.'))
      .mockResolvedValueOnce({ success: true })

    const handleClose = vi.fn()

    render(<FeedbackModal open={true} onClose={handleClose} />)

    const neutralRadio = screen.getByRole('radio', { name: /neutral/i })
    fireEvent.click(neutralRadio)

    const submitBtn = screen.getByRole('button', { name: /^submit$/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('Submission Error')).toBeDefined()
      expect(screen.getByText('Network error. Please try again.')).toBeDefined()
    })

    // Selection retained
    expect(neutralRadio.getAttribute('aria-checked')).toBe('true')
    expect(submitBtn.hasAttribute('disabled')).toBe(false)

    // Retry
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(2)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })
})
