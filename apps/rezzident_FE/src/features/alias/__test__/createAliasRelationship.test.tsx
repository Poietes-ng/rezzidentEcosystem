// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateAliasCustomRelationshipStep } from '../components/create/CreateAliasCustomRelationshipStep'
import { CreateAliasPage } from '../components/create/CreateAliasPage'
import { CreateAliasRelationshipStep } from '../components/create/CreateAliasRelationshipStep'
import { resetAliasStore } from '../api/aliasQueries'
import { resetAliasMocks } from '../mocks/alias.mocks'
import { createTestQueryClient, createTestQueryWrapper } from './testUtils'
import type { ReactNode } from 'react'

// Fix for Radix UI Select in JSDOM
Element.prototype.scrollIntoView = vi.fn()
Element.prototype.hasPointerCapture = vi.fn(() => false)
Element.prototype.setPointerCapture = vi.fn()
Element.prototype.releasePointerCapture = vi.fn()

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

describe('CreateAliasPage — Phase 2 (Step 2 of 3: Relationship)', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>

  beforeEach(() => {
    queryClient = createTestQueryClient()
    resetAliasMocks()
    resetAliasStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    queryClient.clear()
    resetAliasMocks()
    resetAliasStore()
  })

  async function advanceToStep2(): Promise<void> {
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Adaeze' },
    })
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Okonkwo' },
    })
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '8031234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await screen.findByText('FREQUENTLY USED')
  }

  it('renders Step 2 of 3 with Select placeholder, all 9 frequently used chips, focus on heading, and no Continue button initially', () => {
    const onRelationshipChange = vi.fn()
    const onSelectOthers = vi.fn()
    const onContinue = vi.fn()

    render(
      <CreateAliasRelationshipStep
        relationship=""
        onRelationshipChange={onRelationshipChange}
        onSelectOthers={onSelectOthers}
        onContinue={onContinue}
      />,
    )

    const heading = screen.getByRole('heading', {
      name: 'What\u2019s your relationship with the alias?',
    })
    expect(document.activeElement).toBe(heading)
    expect(screen.getByText("We'll use this to personalize their experience")).toBeDefined()

    const selectTrigger = screen.getByRole('combobox', {
      name: 'Relationship',
    })
    expect(selectTrigger.textContent).toContain('Select relationship')

    expect(screen.getByText('FREQUENTLY USED')).toBeDefined()
    const expectedChips = [
      'Wife',
      'Husband',
      'Daughter',
      'Son',
      'Brother',
      'Sister',
      'Friend',
      'Driver',
      'Cleaner',
    ]
    for (const label of expectedChips) {
      const chip = screen.getByRole('button', { name: label })
      expect(chip.getAttribute('aria-pressed')).toBe('false')
    }

    expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull()
  })

  it('synchronizes chip clicks with Select trigger value (including Driver/Cleaner) and shows Continue button', () => {
    const onRelationshipChange = vi.fn()
    const onSelectOthers = vi.fn()
    const onContinue = vi.fn()

    const { rerender } = render(
      <CreateAliasRelationshipStep
        relationship=""
        onRelationshipChange={onRelationshipChange}
        onSelectOthers={onSelectOthers}
        onContinue={onContinue}
      />,
    )

    const wifeChip = screen.getByRole('button', { name: 'Wife' })
    fireEvent.click(wifeChip)
    expect(onRelationshipChange).toHaveBeenCalledWith('Wife')

    rerender(
      <CreateAliasRelationshipStep
        relationship="Wife"
        onRelationshipChange={onRelationshipChange}
        onSelectOthers={onSelectOthers}
        onContinue={onContinue}
      />,
    )

    expect(wifeChip.getAttribute('aria-pressed')).toBe('true')
    const selectTrigger = screen.getByRole('combobox', {
      name: 'Relationship',
    })
    expect(selectTrigger.textContent).toContain('Wife')

    const continueBtn = screen.getByRole('button', { name: 'Continue' })
    expect(continueBtn.hasAttribute('disabled')).toBe(false)

    // Clicking Driver chip updates select trigger and unselects Wife chip
    const driverChip = screen.getByRole('button', { name: 'Driver' })
    fireEvent.click(driverChip)
    expect(onRelationshipChange).toHaveBeenCalledWith('Driver')

    rerender(
      <CreateAliasRelationshipStep
        relationship="Driver"
        onRelationshipChange={onRelationshipChange}
        onSelectOthers={onSelectOthers}
        onContinue={onContinue}
      />,
    )
    expect(driverChip.getAttribute('aria-pressed')).toBe('true')
    expect(wifeChip.getAttribute('aria-pressed')).toBe('false')
    expect(selectTrigger.textContent).toContain('Driver')
  })

  it('renders exact 8 Select options and calls onSelectOthers when Others is chosen', async () => {
    const onRelationshipChange = vi.fn()
    const onSelectOthers = vi.fn()
    const onContinue = vi.fn()

    render(
      <CreateAliasRelationshipStep
        relationship=""
        onRelationshipChange={onRelationshipChange}
        onSelectOthers={onSelectOthers}
        onContinue={onContinue}
      />,
    )

    const selectTrigger = screen.getByRole('combobox')
    fireEvent.click(selectTrigger)

    const expectedOptions = [
      'Wife',
      'Husband',
      'Daughter',
      'Son',
      'Brother',
      'Sister',
      'Friend',
      'Others',
    ]
    const options = screen.getAllByRole('option')
    expect(options.map((o) => o.textContent)).toEqual(expectedOptions)

    fireEvent.click(options[2])
    expect(onRelationshipChange).toHaveBeenCalledWith('Daughter')

    fireEvent.click(selectTrigger)
    const optionsAfterReopen = screen.getAllByRole('option')
    fireEvent.click(optionsAfterReopen[7])
    expect(onSelectOthers).toHaveBeenCalledTimes(1)
  })

  it('validates custom relationship input (trimmed, max 40 chars) and enables Continue', () => {
    const onCustomChange = vi.fn()
    const onCustomContinue = vi.fn()

    const { rerender } = render(
      <CreateAliasCustomRelationshipStep
        customRelationship="   "
        onCustomRelationshipChange={onCustomChange}
        onContinue={onCustomContinue}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Enter custom relationship' })).toBeDefined()
    expect(screen.getByText('Describe how this alias is related to you')).toBeDefined()
    expect(screen.getByPlaceholderText('e.g. Driver, Nanny, Guardian')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Continue' }).hasAttribute('disabled')).toBe(true)

    rerender(
      <CreateAliasCustomRelationshipStep
        customRelationship="Guardian"
        onCustomRelationshipChange={onCustomChange}
        onContinue={onCustomContinue}
      />,
    )
    const enabledBtn = screen.getByRole('button', { name: 'Continue' })
    expect(enabledBtn.hasAttribute('disabled')).toBe(false)
    fireEvent.click(enabledBtn)
    expect(onCustomContinue).toHaveBeenCalledTimes(1)
  })

  it('navigates through Step 1 -> Step 2 (Others) -> Custom Relationship -> Step 3', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<CreateAliasPage />, { wrapper })

    await advanceToStep2()
    expect(screen.getByText('Step 2 of 3')).toBeDefined()

    fireEvent.click(screen.getByRole('combobox'))
    const options = screen.getAllByRole('option')
    fireEvent.click(options[7])

    await screen.findByText('Describe how this alias is related to you')
    expect(screen.getByText('Step 2 of 3')).toBeDefined()

    fireEvent.change(screen.getByLabelText('Relationship'), {
      target: { value: 'Guardian' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByText('Set alias permissions')).toBeDefined()
    expect(screen.getByText('Step 3 of 3')).toBeDefined()
  })
})
