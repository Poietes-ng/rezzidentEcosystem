import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuickActions } from '#/features/dashboard/user-dashboard/components/QuickActions'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

describe('QuickActions', () => {
  it('renders all four tiles in active state with real static labels', () => {
    render(<QuickActions accountStatus="active" isLoading={false} />)

    expect(screen.getByRole('button', { name: /id/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /alias/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /vouch/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /panic/i })).toBeDefined()

    expect(screen.getByRole('button', { name: /id/i }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: /alias/i }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: /vouch/i }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: /panic/i }).hasAttribute('disabled')).toBe(false)
  })

  it('keeps ID, Alias, Vouch non-interactive and NOT dimmed while loading, with Panic active', () => {
    const handleAction = vi.fn()
    const handlePanic = vi.fn()
    render(
      <QuickActions
        isLoading={true}
        accountStatus="deactivated"
        onActionClick={handleAction}
        onPanicClick={handlePanic}
      />,
    )

    const idBtn = screen.getByRole('button', { name: /id/i })
    const aliasBtn = screen.getByRole('button', { name: /alias/i })
    const vouchBtn = screen.getByRole('button', { name: /vouch/i })
    const panicBtn = screen.getByRole('button', { name: /panic/i })

    // Non-interactive via aria-disabled, but not visually dimmed
    expect(idBtn.getAttribute('aria-disabled')).toBe('true')
    expect(aliasBtn.getAttribute('aria-disabled')).toBe('true')
    expect(vouchBtn.getAttribute('aria-disabled')).toBe('true')
    expect(idBtn.className).not.toContain('opacity-35')
    expect(aliasBtn.className).not.toContain('opacity-35')
    expect(vouchBtn.className).not.toContain('opacity-35')

    // Clicks on ID/Alias/Vouch are ignored while loading
    fireEvent.click(idBtn)
    fireEvent.click(aliasBtn)
    fireEvent.click(vouchBtn)
    expect(handleAction).not.toHaveBeenCalled()

    // Panic remains interactive while loading
    expect(panicBtn.getAttribute('aria-disabled')).toBe('false')
    fireEvent.click(panicBtn)
    expect(handlePanic).toHaveBeenCalledTimes(1)
  })

  it('disables and dims ID, Alias, and Vouch only after loading finishes when accountStatus is deactivated', () => {
    const handlePanic = vi.fn()
    const handleAction = vi.fn()
    render(
      <QuickActions
        accountStatus="deactivated"
        isLoading={false}
        onPanicClick={handlePanic}
        onActionClick={handleAction}
      />,
    )

    const idBtn = screen.getByRole('button', { name: /id/i })
    const aliasBtn = screen.getByRole('button', { name: /alias/i })
    const vouchBtn = screen.getByRole('button', { name: /vouch/i })

    expect(idBtn.hasAttribute('disabled')).toBe(true)
    expect(aliasBtn.hasAttribute('disabled')).toBe(true)
    expect(vouchBtn.hasAttribute('disabled')).toBe(true)
    expect(idBtn.className).toContain('opacity-35')

    fireEvent.click(idBtn)
    expect(handleAction).not.toHaveBeenCalled()

    const panicButton = screen.getByRole('button', { name: /panic/i })
    expect(panicButton.hasAttribute('disabled')).toBe(false)

    fireEvent.click(panicButton)
    expect(handlePanic).toHaveBeenCalledTimes(1)
  })

  it('triggers onActionClick when ID/Alias/Vouch are clicked in active loaded state', () => {
    const handleAction = vi.fn()
    render(<QuickActions accountStatus="active" isLoading={false} onActionClick={handleAction} />)

    fireEvent.click(screen.getByRole('button', { name: /id/i }))
    expect(handleAction).toHaveBeenCalledWith('id')

    fireEvent.click(screen.getByRole('button', { name: /alias/i }))
    expect(handleAction).toHaveBeenCalledWith('alias')

    fireEvent.click(screen.getByRole('button', { name: /vouch/i }))
    expect(handleAction).toHaveBeenCalledWith('vouch')
  })
})
