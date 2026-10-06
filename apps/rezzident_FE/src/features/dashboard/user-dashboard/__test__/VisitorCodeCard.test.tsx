// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { VisitorCodeCard } from '#/features/dashboard/user-dashboard/components/VisitorCodeCard'

describe('VisitorCodeCard', () => {
  it('renders static copy correctly immediately while loading with no visual dimming', () => {
    const handleGenerate = vi.fn()
    render(<VisitorCodeCard isLoading={true} onGenerateCode={handleGenerate} />)

    // Static text rendered immediately
    expect(screen.getByText('Having a visitor?')).toBeDefined()
    expect(screen.getByText('Generate a code for them.')).toBeDefined()
    expect(screen.getByText('View history')).toBeDefined()

    const button = screen.getByRole('button', { name: 'Generate Visitor Code' })
    expect(button).toBeDefined()
    expect(button.getAttribute('aria-disabled')).toBe('true')
    expect(button.className).not.toContain('opacity-40')

    // Click is ignored while loading
    fireEvent.click(button)
    expect(handleGenerate).not.toHaveBeenCalled()
  })

  it('fires onGenerateCode when button is clicked in active loaded state', () => {
    const handleGenerate = vi.fn()
    render(
      <VisitorCodeCard accountStatus="active" isLoading={false} onGenerateCode={handleGenerate} />,
    )

    const button = screen.getByRole('button', { name: 'Generate Visitor Code' })
    expect(button.hasAttribute('disabled')).toBe(false)
    expect(button.getAttribute('aria-disabled')).toBe('false')

    fireEvent.click(button)
    expect(handleGenerate).toHaveBeenCalledTimes(1)
  })

  it('fires onViewHistory when View history is clicked', () => {
    const handleViewHistory = vi.fn()
    render(<VisitorCodeCard accountStatus="active" onViewHistory={handleViewHistory} />)

    const link = screen.getByRole('button', { name: 'View visitation history' })
    fireEvent.click(link)

    expect(handleViewHistory).toHaveBeenCalledTimes(1)
  })

  it('disables and dims Generate Visitor Code button only after loading finishes when accountStatus is deactivated', () => {
    const handleGenerate = vi.fn()
    render(
      <VisitorCodeCard
        accountStatus="deactivated"
        isLoading={false}
        onGenerateCode={handleGenerate}
      />,
    )

    const button = screen.getByRole('button', { name: 'Generate Visitor Code' })
    expect(button.hasAttribute('disabled')).toBe(true)
    expect(button.className).toContain('opacity-40')

    fireEvent.click(button)
    expect(handleGenerate).not.toHaveBeenCalled()
  })
})
