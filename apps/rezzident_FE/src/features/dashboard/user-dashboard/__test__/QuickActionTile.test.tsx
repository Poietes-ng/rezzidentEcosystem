// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuickActionTile } from '#/features/dashboard/user-dashboard/components/QuickActionTile'

describe('QuickActionTile', () => {
  it('fires onClick when pressed in default interactive state', () => {
    const handleClick = vi.fn()
    render(<QuickActionTile id="id" label="ID" icon={<span>icon</span>} onClick={handleClick} />)

    const button = screen.getByRole('button', { name: 'ID' })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', () => {
    const handleClick = vi.fn()
    render(
      <QuickActionTile
        id="id"
        label="ID"
        icon={<span>icon</span>}
        disabled={true}
        onClick={handleClick}
      />,
    )

    const button = screen.getByRole('button', { name: 'ID' })
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('is non-interactive but not visually dimmed when ariaDisabled is true', () => {
    const handleClick = vi.fn()
    render(
      <QuickActionTile
        id="id"
        label="ID"
        icon={<span>icon</span>}
        ariaDisabled={true}
        onClick={handleClick}
      />,
    )

    const button = screen.getByRole('button', { name: 'ID' })
    expect(button.getAttribute('aria-disabled')).toBe('true')
    expect(button.className).not.toContain('opacity-35')
    expect(button.className).toContain('cursor-default')

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('shows loading spinner and ignores clicks when loading', () => {
    const handleClick = vi.fn()
    render(
      <QuickActionTile
        id="panic"
        label="Panic"
        icon={<span>panic-icon</span>}
        loading={true}
        tone="danger"
        onClick={handleClick}
      />,
    )

    const button = screen.getByRole('button', { name: 'Panic' })
    expect(screen.getByTestId('loading-spinner')).toBeDefined()
    expect(screen.queryByText('panic-icon')).toBeNull()

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders danger tone styling when tone is danger', () => {
    render(
      <QuickActionTile id="panic" label="Panic" icon={<span>panic-icon</span>} tone="danger" />,
    )

    const button = screen.getByRole('button', { name: 'Panic' })
    expect(button.className).toContain('text-errorRed')
  })
})
