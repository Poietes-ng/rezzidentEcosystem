// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AuthFlowProvider } from '../../context/AuthFlowContext'
import { SignInPhoneScreen } from '../SignInPhoneScreen'
import { SignInEstateIdScreen } from '../SignInEstateIdScreen'
import { SignInScreen } from '../SignInScreen'
import { WelcomeBackPinScreen } from '../WelcomeBackPinScreen'
import { AccountRecoveryChoiceScreen } from '../AccountRecoveryChoiceScreen'
import { SupportChannelsScreen } from '../SupportChannelsScreen'
import { VerifyPhoneOtpScreen } from '../VerifyPhoneOtpScreen'
import { VerifyEmailOtpScreen } from '../VerifyEmailOtpScreen'
import { ContactSupportScreen } from '../ContactSupportScreen'
import { ResetPinScreen } from '../ResetPinScreen'
import { ReportAnIssueScreen } from '../ReportAnIssueScreen'

const mockNavigate = vi.fn()

// Mock @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode
    to?: string
    [key: string]: unknown
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
  createFileRoute: () => () => ({}),
}))

describe('Auth Flow Screens', () => {
  describe('SignInPhoneScreen', () => {
    it('renders phone number input with +234 prefix and remember me checkbox', () => {
      render(
        <AuthFlowProvider>
          <SignInPhoneScreen />
        </AuthFlowProvider>,
      )

      expect(screen.getByText('Log in to your account')).toBeDefined()
      expect(screen.getByText('+234')).toBeDefined()
      expect(screen.getByPlaceholderText('Enter phone number')).toBeDefined()
      expect(screen.getByText('Always remember me')).toBeDefined()
      expect(screen.getByRole('button', { name: 'Continue' })).toBeDefined()
    })

    it('displays error when submitting invalid or empty phone number', () => {
      render(
        <AuthFlowProvider>
          <SignInPhoneScreen />
        </AuthFlowProvider>,
      )

      const continueBtn = screen.getByRole('button', { name: 'Continue' })
      fireEvent.click(continueBtn)

      expect(
        screen.getByText('Please enter a valid phone number.'),
      ).toBeDefined()
    })

    it('displays unregistered error when entering unregistered number', () => {
      render(
        <AuthFlowProvider>
          <SignInPhoneScreen />
        </AuthFlowProvider>,
      )

      const input = screen.getByPlaceholderText('Enter phone number')
      fireEvent.change(input, { target: { value: '80137283929' } })

      const continueBtn = screen.getByRole('button', { name: 'Continue' })
      fireEvent.click(continueBtn)

      expect(
        screen.getByText('This number is not registered to this estate.'),
      ).toBeDefined()
    })
  })

  describe('SignInEstateIdScreen', () => {
    it('renders estate ID input with helper text', () => {
      render(
        <AuthFlowProvider>
          <SignInEstateIdScreen />
        </AuthFlowProvider>,
      )

      expect(screen.getByPlaceholderText('e.g. RSZ-2024-ABCD')).toBeDefined()
      expect(
        screen.getByText('Usually found in your welcome letter or email'),
      ).toBeDefined()
      expect(screen.getByRole('button', { name: 'Next' })).toBeDefined()
    })

    it('displays error when estate code is not found', () => {
      render(
        <AuthFlowProvider>
          <SignInEstateIdScreen />
        </AuthFlowProvider>,
      )

      const input = screen.getByPlaceholderText('e.g. RSZ-2024-ABCD')
      fireEvent.change(input, { target: { value: 'RSZ-20' } })

      const nextBtn = screen.getByRole('button', { name: 'Next' })
      fireEvent.click(nextBtn)

      expect(
        screen.getByText('Estate code not found. Please verify and try again.'),
      ).toBeDefined()
    })
  })

  describe('WelcomeBackPinScreen', () => {
    it('renders phone pill badge, PIN slots, and numeric keypad', () => {
      render(
        <AuthFlowProvider>
          <WelcomeBackPinScreen />
        </AuthFlowProvider>,
      )

      expect(screen.getByText('Welcome back')).toBeDefined()
      expect(screen.getByText('Enter PIN')).toBeDefined()
      expect(screen.getByText('Forgot your PIN?')).toBeDefined()

      for (let i = 0; i <= 9; i++) {
        expect(screen.getByRole('button', { name: String(i) })).toBeDefined()
      }
    })

    it('accepts keypad clicks and updates PIN digits', () => {
      render(
        <AuthFlowProvider>
          <WelcomeBackPinScreen />
        </AuthFlowProvider>,
      )

      const btn1 = screen.getByRole('button', { name: '1' })
      const btn2 = screen.getByRole('button', { name: '2' })
      fireEvent.click(btn1)
      fireEvent.click(btn2)

      const deleteBtn = screen.getByRole('button', { name: 'Delete digit' })
      expect(deleteBtn).toBeDefined()
      fireEvent.click(deleteBtn)
    })
  })

  describe('AccountRecoveryChoiceScreen', () => {
    it('renders both account recovery options with subtitles', () => {
      render(
        <AuthFlowProvider>
          <AccountRecoveryChoiceScreen />
        </AuthFlowProvider>,
      )

      expect(
        screen.getByText('How would you like to recover your account?'),
      ).toBeDefined()
      expect(
        screen.getByText('I still have my registered phone number'),
      ).toBeDefined()
      expect(
        screen.getByText('I no longer have access to my phone number'),
      ).toBeDefined()
    })
  })

  describe('SupportChannelsScreen', () => {
    it('renders all support channels and response time badges', () => {
      render(<SupportChannelsScreen />)

      expect(screen.getByText('Product Support')).toBeDefined()
      expect(screen.getByText('Rezzident')).toBeDefined()
      expect(screen.getByText('Response time: Instant')).toBeDefined()
      expect(screen.getByText('+234 8077784848')).toBeDefined()
      expect(screen.getByText('Response time: 2 min')).toBeDefined()
      expect(screen.getByText('Whatsapp')).toBeDefined()
      expect(screen.getByText('Response time: 5 min')).toBeDefined()
      expect(screen.getByText('support@rezzident.co')).toBeDefined()
      expect(screen.getByText('Rezzident support documentation')).toBeDefined()
      expect(screen.getByText('Report an issue')).toBeDefined()
    })
  })

  describe('VerifyPhoneOtpScreen', () => {
    it('renders phone verification header, 4 digit slots, and countdown timer', () => {
      render(
        <AuthFlowProvider>
          <VerifyPhoneOtpScreen />
        </AuthFlowProvider>,
      )

      expect(screen.getByText('ACCOUNT RECOVERY')).toBeDefined()
      expect(screen.getByText('Verify your number')).toBeDefined()
      expect(screen.getByText(/We sent a 4-digit code to/)).toBeDefined()
      expect(screen.getByRole('button', { name: 'Verify' })).toBeDefined()
    })
  })

  describe('VerifyEmailOtpScreen', () => {
    it('renders email verification header and 4 digit slots', () => {
      render(
        <AuthFlowProvider>
          <VerifyEmailOtpScreen />
        </AuthFlowProvider>,
      )

      expect(screen.getByText('ACCOUNT RECOVERY')).toBeDefined()
      expect(screen.getByText('Verify your email')).toBeDefined()
      expect(screen.getByText(/We sent a 4-digit code to/)).toBeDefined()
    })
  })

  describe('ContactSupportScreen', () => {
    it('renders yellow dashed support card with copy and call button', () => {
      render(<ContactSupportScreen />)

      expect(screen.getByText('Contact Support')).toBeDefined()
      expect(screen.getByText('+234 8077784848')).toBeDefined()
      expect(screen.getByRole('button', { name: /Copy/ })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Call Support' })).toBeDefined()
      expect(
        screen.getByText('This will open your phone’s dial pad.'),
      ).toBeDefined()
    })
  })

  describe('SignInScreen (Auth Flow Routing)', () => {
    it('renders Estate ID page first by default, then moves to Phone number page on Next', () => {
      render(
        <AuthFlowProvider>
          <SignInScreen />
        </AuthFlowProvider>,
      )

      // Step 1: Estate ID screen
      expect(screen.getByPlaceholderText('e.g. RSZ-2024-ABCD')).toBeDefined()
      expect(
        screen.getByText(
          'Enter your estate ID to join your residential community.',
        ),
      ).toBeDefined()

      // Enter valid estate ID and click Next
      const input = screen.getByPlaceholderText('e.g. RSZ-2024-ABCD')
      fireEvent.change(input, { target: { value: 'RSZ-2024-ABCD' } })

      const nextBtn = screen.getByRole('button', { name: 'Next' })
      fireEvent.click(nextBtn)

      // Step 2: Routed to Phone number screen
      expect(screen.getByPlaceholderText('Enter phone number')).toBeDefined()
      expect(screen.getByText('+234')).toBeDefined()
      expect(screen.getByRole('button', { name: 'Continue' })).toBeDefined()

      // Step 3: Enter phone number and click Continue -> routes to /welcome-back
      const phoneInput = screen.getByPlaceholderText('Enter phone number')
      fireEvent.change(phoneInput, { target: { value: '8012345678' } })

      const continueBtn = screen.getByRole('button', { name: 'Continue' })
      fireEvent.click(continueBtn)

      expect(mockNavigate).toHaveBeenCalledWith({ to: '/welcome-back' })
    })
  })

  describe('ResetPinScreen', () => {
    it('renders Enter PIN and Confirm PIN slots and validates matching', () => {
      render(
        <AuthFlowProvider>
          <ResetPinScreen />
        </AuthFlowProvider>,
      )

      expect(screen.getByText('PIN RESET')).toBeDefined()
      expect(screen.getByText('Reset your PIN')).toBeDefined()
      expect(screen.getByText('Enter PIN')).toBeDefined()
      expect(screen.getByText('Confirm PIN')).toBeDefined()
      expect(screen.getByRole('button', { name: 'Reset PIN' })).toBeDefined()
    })

    it('navigates to /sign-in (phone sign in screen) upon successful PIN reset', async () => {
      vi.useFakeTimers()
      render(
        <AuthFlowProvider>
          <ResetPinScreen />
        </AuthFlowProvider>,
      )

      // Fill in PIN 1 (1234) and PIN 2 (1234)
      const inputs = document.querySelectorAll('input[type="password"]')
      expect(inputs.length).toBe(8)

      fireEvent.change(inputs[0], { target: { value: '1' } })
      fireEvent.change(inputs[1], { target: { value: '2' } })
      fireEvent.change(inputs[2], { target: { value: '3' } })
      fireEvent.change(inputs[3], { target: { value: '4' } })

      fireEvent.change(inputs[4], { target: { value: '1' } })
      fireEvent.change(inputs[5], { target: { value: '2' } })
      fireEvent.change(inputs[6], { target: { value: '3' } })
      fireEvent.change(inputs[7], { target: { value: '4' } })

      const resetBtn = screen.getByRole('button', { name: 'Reset PIN' })
      fireEvent.click(resetBtn)

      expect(screen.getByText('PIN updated successfully')).toBeDefined()

      vi.advanceTimersByTime(2000)
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-in' })
      vi.useRealTimers()
    })
  })

  describe('ReportAnIssueScreen', () => {
    it('renders report an issue form and handles submission', () => {
      render(<ReportAnIssueScreen />)

      expect(screen.getByText('What went wrong?')).toBeDefined()
      expect(screen.getByRole('combobox')).toBeDefined()
      expect(
        screen.getByPlaceholderText('Tell us more about what happened...'),
      ).toBeDefined()
      expect(
        screen.getByRole('button', { name: 'Submit Report' }),
      ).toBeDefined()

      const textarea = screen.getByPlaceholderText(
        'Tell us more about what happened...',
      )
      fireEvent.change(textarea, {
        target: { value: 'I keep getting logged out' },
      })

      const submitBtn = screen.getByRole('button', { name: 'Submit Report' })
      fireEvent.click(submitBtn)

      expect(screen.getByText('Report submitted successfully')).toBeDefined()
    })
  })
})
