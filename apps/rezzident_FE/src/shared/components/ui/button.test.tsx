// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button').textContent).toBe('Click me')
  })

  it('renders as a button element by default', () => {
    render(<Button>Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn.tagName).toBe('BUTTON')
  })

  it('applies base classes for all variants', () => {
    render(<Button>Styled</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('inline-flex')
    expect(btn.className).toContain('items-center')
    expect(btn.className).toContain('justify-center')
  })

  it('applies different classes for secondary variant', () => {
    const { container: defaultContainer } = render(<Button>Default</Button>)
    const { container: secondaryContainer } = render(
      <Button variant="secondary">Secondary</Button>,
    )
    const defaultBtn = defaultContainer.querySelector('button')!
    const secondaryBtn = secondaryContainer.querySelector('button')!
    // Secondary should have different styling than default
    expect(defaultBtn.className).not.toBe(secondaryBtn.className)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    const btn = screen.getByRole('button')
    expect(btn.disabled).toBe(true)
  })
})
