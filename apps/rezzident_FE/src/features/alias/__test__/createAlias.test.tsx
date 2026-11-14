// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateAliasPage } from '../components/create/CreateAliasPage'
import * as aliasQueries from '../api/aliasQueries'
import { resetAliasMocks } from '../mocks/alias.mocks'
import { createTestQueryClient, createTestQueryWrapper } from './testUtils'
import type { ReactNode } from 'react'

const mockHistoryBack = vi.fn()
const mockNavigate = vi.fn()

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    useReducedMotion: () => true,
  }
})

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    history: { back: mockHistoryBack },
  }),
  useNavigate: () => mockNavigate,
  Link: ({
    children,
    to,
    onClick,
    className,
    ...props
  }: {
    children: ReactNode
    to: string
    onClick?: () => void
    className?: string
    [key: string]: unknown
  }) => (
    <a href={to} onClick={onClick} className={className} {...props}>
      {children}
    </a>
  ),
}))

describe('CreateAliasPage — Phase 1 (Step 1 of 3)', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>

  beforeEach(() => {
    queryClient = createTestQueryClient()
    resetAliasMocks()
    aliasQueries.resetAliasStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    queryClient.clear()
    resetAliasMocks()
    aliasQueries.resetAliasStore()
    vi.restoreAllMocks()
  })

  it('renders Step 1 of 3 with exact copy, progress bar, fields, helper text, terms footer, and disabled Continue', () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<CreateAliasPage />, { wrapper })

    expect(screen.getByRole('heading', { name: 'Create Alias' })).toBeDefined()

    const progressbar = screen.getByRole('progressbar', {
      name: 'Step 1 of 3',
    })
    expect(progressbar.getAttribute('aria-valuenow')).toBe('1')
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1')
    expect(progressbar.getAttribute('aria-valuemax')).toBe('3')
    expect(screen.getByText('Step 1 of 3')).toBeDefined()

    const stepHeading = screen.getByRole('heading', {
      name: 'What\u2019s the alias name?',
    })
    expect(stepHeading).toBeDefined()
    expect(document.activeElement).toBe(stepHeading)

    expect(screen.getByText("We'll use this to personalize their experience")).toBeDefined()

    expect(screen.getByLabelText('First Name')).toBeDefined()
    expect(screen.getByPlaceholderText('Enter alias\u2019s first name')).toBeDefined()

    expect(screen.getByLabelText('Last Name')).toBeDefined()
    expect(screen.getByPlaceholderText('Enter alias\u2019s last name')).toBeDefined()

    expect(screen.getByLabelText('Phone Number')).toBeDefined()
    expect(screen.getByText('+234')).toBeDefined()
    expect(screen.getByPlaceholderText('Enter phone number')).toBeDefined()

    expect(
      screen.getByText("We'll send a verification code to this number during the alias sign in."),
    ).toBeDefined()
    expect(screen.getByText(/By continuing, you agree to our/i)).toBeDefined()
    expect(screen.getByText('Terms')).toBeDefined()
    expect(screen.getByText('Privacy Policy')).toBeDefined()

    const continueBtn = screen.getByRole('button', { name: 'Continue' })
    expect(continueBtn.hasAttribute('disabled')).toBe(true)
    expect(continueBtn.getAttribute('aria-disabled')).toBe('true')
  })

  it('keeps Continue disabled until both names and phone are non-empty, then enables it', () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<CreateAliasPage />, { wrapper })

    const firstNameInput = screen.getByLabelText('First Name')
    const lastNameInput = screen.getByLabelText('Last Name')
    const phoneInput = screen.getByLabelText('Phone Number')
    const continueBtn = screen.getByRole('button', { name: 'Continue' })

    fireEvent.change(firstNameInput, { target: { value: 'Adaeze' } })
    expect(continueBtn.hasAttribute('disabled')).toBe(true)

    fireEvent.change(lastNameInput, { target: { value: 'Okonkwo' } })
    expect(continueBtn.hasAttribute('disabled')).toBe(true)

    fireEvent.change(phoneInput, { target: { value: '801' } })
    expect(continueBtn.hasAttribute('disabled')).toBe(false)
    expect(continueBtn.getAttribute('aria-disabled')).toBe('false')
  })

  it('formats phone input: digits only, strips leading 0, max 10 digits, grouped 3-3-4', () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<CreateAliasPage />, { wrapper })

    const phoneInput = screen.getByLabelText<HTMLInputElement>('Phone Number')

    // Non-digits stripped and leading 0 removed, grouped 3-3-4
    fireEvent.change(phoneInput, {
      target: { value: '0801-234-5678999' },
    })
    expect(phoneInput.value).toBe('801 234 5678')

    // Partial typing 3-3
    fireEvent.change(phoneInput, { target: { value: '80345' } })
    expect(phoneInput.value).toBe('803 45')
  })

  it('shows inline validation errors for short names and invalid phone, linked via aria-describedby', () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<CreateAliasPage />, { wrapper })

    const firstNameInput = screen.getByLabelText('First Name')
    const lastNameInput = screen.getByLabelText('Last Name')
    const phoneInput = screen.getByLabelText('Phone Number')

    fireEvent.change(firstNameInput, { target: { value: 'A' } })
    fireEvent.change(lastNameInput, { target: { value: 'B' } })
    fireEvent.change(phoneInput, { target: { value: '801' } })

    const continueBtn = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(continueBtn)

    const nameErrors = screen.getAllByText('Please enter your full name.')
    expect(nameErrors.length).toBe(2)
    expect(firstNameInput.getAttribute('aria-describedby')).toBe('alias-first-name-error')
    expect(lastNameInput.getAttribute('aria-describedby')).toBe('alias-last-name-error')

    const phoneErr = screen.getByText('Please enter a valid phone number.')
    expect(phoneErr.getAttribute('role')).toBe('alert')
    expect(phoneInput.getAttribute('aria-describedby')).toBe('alias-phone-number-msg')
    expect(continueBtn.hasAttribute('disabled')).toBe(false)
  })

  it('shows already-registered phone error after Continue from mock server check (not on keystrokes) and can show both name and phone errors together', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<CreateAliasPage />, { wrapper })

    const firstNameInput = screen.getByLabelText('First Name')
    const lastNameInput = screen.getByLabelText('Last Name')
    const phoneInput = screen.getByLabelText('Phone Number')

    fireEvent.change(firstNameInput, { target: { value: 'A' } })
    fireEvent.change(lastNameInput, { target: { value: 'Okonkwo' } })
    fireEvent.change(phoneInput, { target: { value: '8012345678' } })

    // Not shown on keystrokes before Continue
    expect(screen.queryByText('This phone number is already registered.')).toBeNull()

    const continueBtn = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(continueBtn)

    // Both field errors show together (matching the Error frame)
    expect(await screen.findByText('Please enter your full name.')).toBeDefined()
    expect(await screen.findByText('This phone number is already registered.')).toBeDefined()

    // Continue stays enabled while an error shows
    expect(continueBtn.hasAttribute('disabled')).toBe(false)
  })

  it('protects against double submit while phone check is pending and advances to Step 2 when valid', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<CreateAliasPage />, { wrapper })

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Adaeze' },
    })
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Okonkwo' },
    })
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '8031234567' },
    })

    const continueBtn = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(continueBtn)
    fireEvent.click(continueBtn)

    // Only one mutation is dispatched despite rapid double press
    expect(queryClient.getMutationCache().getAll().length).toBe(1)
    await waitFor(() => {
      expect(continueBtn.getAttribute('aria-busy')).toBe('true')
    })

    // Advances to Step 2 after check completes
    expect(
      await screen.findByRole('heading', {
        name: 'What\u2019s your relationship with the alias?',
      }),
    ).toBeDefined()
    expect(screen.getByText('Step 2 of 3')).toBeDefined()
    expect(queryClient.getMutationCache().getAll().length).toBe(1)

    // Back button on Step 2 returns to Step 1
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(
      await screen.findByRole('heading', { name: 'What\u2019s the alias name?' }),
    ).toBeDefined()

    // Back button on Step 1 navigates to /alias
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/alias' })
    })
  })
})
