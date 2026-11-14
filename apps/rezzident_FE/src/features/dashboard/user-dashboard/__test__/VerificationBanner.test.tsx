// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { VerificationBanner } from '#/features/dashboard/user-dashboard/components/VerificationBanner'

describe('VerificationBanner', () => {
  it('renders correct copy for unverified state', () => {
    render(<VerificationBanner verificationState="unverified" />)

    expect(screen.getByText('Become Rezzident verified')).toBeDefined()
    expect(screen.getByRole('button', { name: /verify now/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /dismiss banner/i })).toBeDefined()
  })

  it('renders correct copy for tier2 state', () => {
    render(<VerificationBanner verificationState="tier2" />)

    expect(screen.getByText(/Upgrade account to Tier2/i)).toBeDefined()
    expect(screen.getByText(/to vouch/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /verify now/i })).toBeDefined()
  })

  it('renders nothing for verified state', () => {
    const { container } = render(<VerificationBanner verificationState="verified" />)

    expect(container.firstChild).toBeNull()
  })

  it('hides after clicking the close button', () => {
    render(<VerificationBanner verificationState="unverified" />)

    expect(screen.getByText('Become Rezzident verified')).toBeDefined()

    const closeButton = screen.getByRole('button', { name: /dismiss banner/i })
    fireEvent.click(closeButton)

    expect(screen.queryByText('Become Rezzident verified')).toBeNull()
  })
})
