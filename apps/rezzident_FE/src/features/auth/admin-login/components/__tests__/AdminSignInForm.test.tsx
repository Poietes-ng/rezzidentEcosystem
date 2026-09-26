import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AdminLogin } from '../AdminSignInForm'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }: any) => <a>{children}</a>,
  useRouter: () => ({}),
}))

describe('AdminLogin', () => {
  it('should render the sign in form', () => {
    render(<AdminLogin />)
    expect(screen.getByText(/Sign In to Your Account/i)).toBeTruthy()
    expect(screen.getByText(/Estate ID/i)).toBeTruthy()
    expect(screen.getByText(/Password/i)).toBeTruthy()
  })
})
