// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuickActions } from '#/features/dashboard/user-dashboard/components/QuickActions'

describe('QuickActions', () => {
  it('renders all four tiles in active state', () => {
    render(<QuickActions accountStatus="active" />)

    expect(screen.getByRole('button', { name: /id/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /alias/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /vouch/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /panic/i })).toBeDefined()

    expect(screen.getByRole('button', { name: /id/i }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: /alias/i }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: /vouch/i }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: /panic/i }).hasAttribute('disabled')).toBe(false)
  })

  it('disables ID, Alias, and Vouch when accountStatus is deactivated, but keeps Panic enabled', () => {
    const handlePanic = vi.fn()
    render(<QuickActions accountStatus="deactivated" onPanicClick={handlePanic} />)

    expect(screen.getByRole('button', { name: /id/i }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: /alias/i }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: /vouch/i }).hasAttribute('disabled')).toBe(true)

    const panicButton = screen.getByRole('button', { name: /panic/i })
    expect(panicButton.hasAttribute('disabled')).toBe(false)

    // Panic still works when accountStatus is deactivated
    fireEvent.click(panicButton)
    expect(handlePanic).toHaveBeenCalledTimes(1)
  })

  it('triggers onPanicClick when Panic tile is clicked', () => {
    const handlePanic = vi.fn()
    render(<QuickActions onPanicClick={handlePanic} />)

    const panicButton = screen.getByRole('button', { name: /panic/i })
    fireEvent.click(panicButton)

    expect(handlePanic).toHaveBeenCalledTimes(1)
  })

  it('triggers onActionClick when ID/Alias/Vouch are clicked', () => {
    const handleAction = vi.fn()
    render(<QuickActions onActionClick={handleAction} />)

    fireEvent.click(screen.getByRole('button', { name: /id/i }))
    expect(handleAction).toHaveBeenCalledWith('id')

    fireEvent.click(screen.getByRole('button', { name: /alias/i }))
    expect(handleAction).toHaveBeenCalledWith('alias')

    fireEvent.click(screen.getByRole('button', { name: /vouch/i }))
    expect(handleAction).toHaveBeenCalledWith('vouch')
  })
})
