// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { colors } from '@rezzident/design-tokens'
import { Button } from '../button'

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

  it('applies different styles for secondary variant', () => {
    const { container: defaultContainer } = render(<Button>Default</Button>)
    const { container: secondaryContainer } = render(<Button variant="secondary">Secondary</Button>)
    const defaultBtn = defaultContainer.querySelector('button')!
    const secondaryBtn = secondaryContainer.querySelector('button')!
    // Secondary should have different styling than default
    expect(defaultBtn.style.getPropertyValue('--btn-bg')).not.toBe(
      secondaryBtn.style.getPropertyValue('--btn-bg'),
    )
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    const btn = screen.getByRole<HTMLButtonElement>('button')
    expect(btn.disabled).toBe(true)
  })

  it('applies destructive and success variant styling', () => {
    const { container: destContainer } = render(<Button variant="destructive">Deactivate</Button>)
    const { container: succContainer } = render(<Button variant="success">Reactivate</Button>)
    const destBtn = destContainer.querySelector('button')!
    const succBtn = succContainer.querySelector('button')!
    expect(destBtn.style.getPropertyValue('--btn-bg')).toBe(colors.errorRed)
    expect(succBtn.style.getPropertyValue('--btn-bg')).toBe(colors.successGreen)
  })

  it('applies compact dimensions when size="sm" is passed', () => {
    const { container } = render(<Button size="sm">Compact</Button>)
    const btn = container.querySelector('button')!
    expect(btn.style.height).toBe('32px')
    expect(btn.style.minHeight).toBe('32px')
  })

  it('retains variant text colour and white text variable when given a font-size className', () => {
    const variants = ['primary', 'destructive', 'success'] as const
    for (const variant of variants) {
      const { container, unmount } = render(
        <Button variant={variant} className="text-[16px]">
          {variant}
        </Button>,
      )
      const btn = container.querySelector('button')!
      expect(btn.className).toContain('text-[color:var(--btn-text)]')
      expect(btn.className).toContain('text-[16px]')
      expect(btn.style.getPropertyValue('--btn-text')).toBe('#FFFFFF')
      unmount()
    }
  })
})
