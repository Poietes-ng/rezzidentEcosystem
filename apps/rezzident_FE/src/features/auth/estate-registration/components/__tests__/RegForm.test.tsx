import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RegistrationForm } from '../RegForm'
import { AuthProvider } from '../../context/AuthContext'
import * as api from '../../api/estate'

// Fix for Radix UI select in JSDOM
Element.prototype.scrollIntoView = vi.fn()

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }: any) => <a>{children}</a>,
  useRouter: () => ({}),
}))

// Mock the API calls
vi.mock('../../api/estate', () => ({
  registerEstate: vi.fn(),
  fetchStructureTemplates: vi.fn(),
}))

describe('RegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.fetchStructureTemplates).mockResolvedValue({
      status: true,
      status_code: 200,
      message: 'Success',
      data: [],
    })
  })

  const renderWithProviders = (component: React.ReactNode) => {
    return render(<AuthProvider>{component}</AuthProvider>)
  }

  it('should render the first step (Estate Details)', () => {
    renderWithProviders(<RegistrationForm />)
    expect(screen.getByText(/Estate Name/i)).toBeTruthy()
    expect(screen.getByText(/Estate Address/i)).toBeTruthy()
  })

  it('should show validation errors if required fields are empty on step 1', async () => {
    renderWithProviders(<RegistrationForm />)

    // Click continue without filling anything
    const continueButton = screen.getByRole('button', { name: /Continue/i })
    fireEvent.click(continueButton)

    // Wait for errors to appear
    await waitFor(() => {
      expect(screen.getByText(/Estate name is required/i)).toBeTruthy()
      expect(screen.getByText(/Address is required/i)).toBeTruthy()
    })
  })

  it('should proceed to next step when valid data is entered', async () => {
    renderWithProviders(<RegistrationForm />)

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Enter your estate name/i), {
      target: { value: 'Test Estate' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Enter your estate address/i), {
      target: { value: '123 Main St' },
    })

    // Select state
    const stateSelect = screen.getByText('Select state')
    fireEvent.click(stateSelect)

    // Radix UI renders options in a portal, wait for it
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /Lagos/i })).toBeTruthy()
    })
    fireEvent.click(screen.getByRole('option', { name: /Lagos/i }))

    // Select LGA
    const lgaSelect = screen.getByText('Select LGA')
    fireEvent.click(lgaSelect)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /Ikeja/i })).toBeTruthy()
    })
    fireEvent.click(screen.getByRole('option', { name: /Ikeja/i }))

    // Click continue
    const continueButton = screen.getByRole('button', { name: /Continue/i })
    fireEvent.click(continueButton)

    // Wait for step 2 (Structure Examples) to appear
    await waitFor(() => {
      // The button text changes on step 2
      expect(screen.getByText(/Proceed to Create Structure/i)).toBeTruthy()
    })
  })
})
