// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders yellow variant with correct text and classes', () => {
    render(<Badge variant="yellow">You</Badge>)
    const badge = screen.getByText('You')
    expect(badge).toBeDefined()
    expect(badge.className).toContain('bg-actionYellow')
    expect(badge.className).toContain('text-actionDark')
  })

  it('renders neutral variant with text', () => {
    render(<Badge variant="neutral">Tier 1</Badge>)
    const badge = screen.getByText('Tier 1')
    expect(badge).toBeDefined()
    expect(badge.className).toContain('text-warmGray')
  })

  it('renders deactivated variant with dot and text', () => {
    const { container } = render(<Badge variant="deactivated">Deactivated</Badge>)
    const badge = screen.getByText('Deactivated')
    expect(badge).toBeDefined()
    expect(badge.className).toContain('text-errorRed')
    const dot = container.querySelector('.bg-errorRed')
    expect(dot).toBeDefined()
    expect(dot).not.toBeNull()
  })

  it('renders alias variant with blue styling and dark text', () => {
    render(<Badge variant="alias">Alias</Badge>)
    const badge = screen.getByText('Alias')
    expect(badge).toBeDefined()
    expect(badge.className).toContain('bg-blue-100')
    expect(badge.className).toContain('text-actionDark')
  })

  it('renders active variant with green dot and text', () => {
    const { container } = render(<Badge variant="active">Active</Badge>)
    const badge = screen.getByText('Active')
    expect(badge).toBeDefined()
    expect(badge.className).toContain('text-successGreen')
    const dot = container.querySelector('.bg-successGreen')
    expect(dot).toBeDefined()
    expect(dot).not.toBeNull()
  })

  it('renders pending variant with warningGold dot and text', () => {
    const { container } = render(<Badge variant="pending">Pending</Badge>)
    const badge = screen.getByText('Pending')
    expect(badge).toBeDefined()
    expect(badge.className).toContain('text-warningGold')
    const dot = container.querySelector('.bg-warningGold')
    expect(dot).toBeDefined()
    expect(dot).not.toBeNull()
  })

  it('merges custom className', () => {
    render(
      <Badge variant="yellow" className="custom-test-class">
        Custom
      </Badge>,
    )
    const badge = screen.getByText('Custom')
    expect(badge.className).toContain('custom-test-class')
  })
})
