// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateAvailableModal } from '#/features/dashboard/user-dashboard/components/UpdateAvailableModal'
import * as homeQueries from '#/features/dashboard/user-dashboard/api/homeQueries'

describe('UpdateAvailableModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders nothing when open is false', () => {
    const { container } = render(<UpdateAvailableModal open={false} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders title, description, Later and Update Now buttons on open', () => {
    render(<UpdateAvailableModal open={true} onClose={vi.fn()} />)

    expect(screen.getByText('New Update Available')).toBeDefined()
    expect(screen.getByText('A new version is ready to install.')).toBeDefined()
    expect(screen.getByRole('button', { name: /later/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /update now/i })).toBeDefined()
  })

  it('calls onClose when Later is clicked', () => {
    const handleClose = vi.fn()
    render(<UpdateAvailableModal open={true} onClose={handleClose} />)

    const laterBtn = screen.getByRole('button', { name: /later/i })
    fireEvent.click(laterBtn)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('executes update on Update Now click and closes on success', async () => {
    const handleClose = vi.fn()
    const handleUpdateComplete = vi.fn()
    const updateSpy = vi
      .spyOn(homeQueries, 'startAppUpdate')
      .mockImplementation(() => new Promise((res) => setTimeout(() => res({ success: true }), 100)))

    render(
      <UpdateAvailableModal
        open={true}
        onClose={handleClose}
        onUpdateComplete={handleUpdateComplete}
      />,
    )

    const updateBtn = screen.getByRole('button', { name: /update now/i })
    fireEvent.click(updateBtn)
    fireEvent.click(updateBtn) // Rapid double click

    expect(updateSpy).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1)
      expect(handleUpdateComplete).toHaveBeenCalledTimes(1)
    })
  })

  it('shows error state with Retry button on failure and allows retrying', async () => {
    const updateSpy = vi
      .spyOn(homeQueries, 'startAppUpdate')
      .mockRejectedValueOnce(new Error('Connection failed'))
      .mockResolvedValueOnce({ success: true })

    const handleClose = vi.fn()

    render(<UpdateAvailableModal open={true} onClose={handleClose} />)

    const updateBtn = screen.getByRole('button', { name: /update now/i })
    fireEvent.click(updateBtn)

    await waitFor(() => {
      expect(screen.getByText('Connection failed')).toBeDefined()
      expect(screen.getByRole('button', { name: /retry/i })).toBeDefined()
    })

    const retryBtn = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryBtn)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(2)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })
})
