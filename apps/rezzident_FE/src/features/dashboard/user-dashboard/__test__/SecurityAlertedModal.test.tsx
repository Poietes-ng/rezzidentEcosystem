// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SecurityAlertedModal } from '#/features/dashboard/user-dashboard/components/SecurityAlertedModal'

describe('SecurityAlertedModal', () => {
  const mockData = {
    securityContact: '+234 803 456 7890',
    timestamp: '3:24AM',
    date: '9 Jul, 2026',
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders nothing when open is false', () => {
    const { container } = render(
      <SecurityAlertedModal open={false} data={mockData} onClose={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders modal content correctly when open is true', () => {
    render(<SecurityAlertedModal open={true} data={mockData} onClose={vi.fn()} />)

    expect(screen.getByText('Security Alerted !')).toBeDefined()
    expect(screen.getByText('Help is on the way to your residence')).toBeDefined()
    expect(screen.getByText('+234 803 456 7890')).toBeDefined()
    expect(screen.getByText('3:24AM')).toBeDefined()
    expect(screen.getByText('9 Jul, 2026')).toBeDefined()
    expect(screen.getByRole('link', { name: /call estate security/i })).toBeDefined()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(<SecurityAlertedModal open={true} data={mockData} onClose={handleClose} />)

    const closeBtn = screen.getByRole('button', {
      name: /close security alert modal/i,
    })
    fireEvent.click(closeBtn)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('closes on Escape key press', () => {
    const handleClose = vi.fn()
    render(<SecurityAlertedModal open={true} data={mockData} onClose={handleClose} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('copies contact to clipboard and shows Copied feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(<SecurityAlertedModal open={true} data={mockData} onClose={vi.fn()} />)

    const copyBtn = screen.getByRole('button', {
      name: /copy security contact number/i,
    })
    fireEvent.click(copyBtn)

    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeDefined()
    })
  })
})
