// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { VisitorCodeCard } from '#/features/dashboard/user-dashboard/components/VisitorCodeCard'

describe('VisitorCodeCard', () => {
  it('renders copy correctly in active state', () => {
    render(<VisitorCodeCard accountStatus="active" />)

    expect(screen.getByText('Having a visitor?')).toBeDefined()
    expect(screen.getByText('Generate a code for them.')).toBeDefined()
    expect(screen.getByText('View history')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Generate Visitor Code' })).toBeDefined()

    const button = screen.getByRole('button', { name: 'Generate Visitor Code' })
    expect(button.hasAttribute('disabled')).toBe(false)
  })

  it('fires onGenerateCode when button is clicked in active state', () => {
    const handleGenerate = vi.fn()
    render(<VisitorCodeCard accountStatus="active" onGenerateCode={handleGenerate} />)

    const button = screen.getByRole('button', { name: 'Generate Visitor Code' })
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

  it('disables Generate Visitor Code button when accountStatus is deactivated', () => {
    const handleGenerate = vi.fn()
    render(<VisitorCodeCard accountStatus="deactivated" onGenerateCode={handleGenerate} />)

    const button = screen.getByRole('button', { name: 'Generate Visitor Code' })
    expect(button.hasAttribute('disabled')).toBe(true)

    fireEvent.click(button)
    expect(handleGenerate).not.toHaveBeenCalled()
  })
})
