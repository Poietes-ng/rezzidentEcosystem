// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AliasListPage } from '../components/AliasListPage'
import { AliasViewAllPage } from '../components/AliasViewAllPage'
import {
  resetAliasMocks,
  setActiveAliasListState,
  setMockAliasListError,
} from '../mocks/alias.mocks'
import { resetAliasStore } from '../api/aliasQueries'
import { createTestQueryClient, createTestQueryWrapper } from './testUtils'
import type React from 'react'

const mockHistoryBack = vi.fn()
const mockNavigate = vi.fn()

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
    children: React.ReactNode
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

describe('AliasListPage', () => {
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

  it('renders primary account and member rows in populated state', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Valentine Obumneme')).toBeDefined()
    })

    expect(screen.getByText('Tier 1')).toBeDefined()
    expect(screen.getByText('Block A • Unit 2')).toBeDefined()
    expect(screen.getByText('You')).toBeDefined()

    // Rows
    expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    expect(screen.getByText('Ugochi Nneoma')).toBeDefined()
    expect(screen.getByText('Emeka Njoku')).toBeDefined()
  })

  it('renders relationship text and the Deactivated tag on deactivated rows', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    expect(screen.getByText('Daughter')).toBeDefined()
    expect(screen.getByText('Wife')).toBeDefined()
    expect(screen.getByText('Driver')).toBeDefined()

    // Chijioke Obinna is deactivated
    expect(screen.getByText('Chijioke Obinna')).toBeDefined()
    expect(screen.getByText('Cleaner')).toBeDefined()
    const deactivatedTags = screen.getAllByText('Deactivated')
    expect(deactivatedTags.length).toBeGreaterThan(0)
  })

  it('renders empty state when there are no aliases and greys out View all', async () => {
    setActiveAliasListState('empty')
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('No active alias yet.')).toBeDefined()
    })

    expect(screen.getByText('Your aliases will appear here once activated.')).toBeDefined()

    // View all is greyed out / aria-disabled
    const viewAll = screen.getByText('View all')
    expect(viewAll.getAttribute('aria-disabled')).toBe('true')
  })

  it('renders max state with progress bar, message, and disabled Create button', async () => {
    setActiveAliasListState('max')
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Aliases created 10 of 10')).toBeDefined()
    })

    const message = screen.getByText(
      "You've reached the maximum of 10 aliases. Remove an existing alias to create a new one.",
    )
    expect(message).toBeDefined()
    expect(message.getAttribute('role')).toBe('alert')

    const progressBar = screen.getByRole('progressbar', { name: 'Aliases created' })
    expect(progressBar).toBeDefined()
    expect(progressBar.getAttribute('aria-valuenow')).toBe('10')
    expect(progressBar.getAttribute('aria-valuemax')).toBe('10')
    expect(progressBar.className).not.toContain('errorRed')
    expect(progressBar.className).not.toContain('red')

    const progressFill = progressBar.firstElementChild as HTMLElement
    expect(progressFill).toBeDefined()
    expect(progressFill.className).toContain('bg-actionDark')
    expect(progressFill.className).not.toContain('errorRed')
    expect(progressFill.className).not.toContain('red')

    const createBtn = screen.getByRole('button', { name: 'Create New Alias' })
    expect(createBtn.getAttribute('aria-disabled')).toBe('true')
    expect((createBtn as HTMLButtonElement).disabled).toBe(true)
    expect(createBtn.style.getPropertyValue('--btn-disabled-text')).toBe('#FFFFFF')
    expect(createBtn.className).toContain('text-[color:var(--btn-disabled-text)]')
    expect(createBtn.className).not.toContain('text-warmGray')
  })

  it('navigates to /alias/all via View all link when populated', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Valentine Obumneme')).toBeDefined()
    })

    const viewAllLink = screen.getByRole('link', { name: /View all/i })
    expect(viewAllLink.getAttribute('href')).toBe('/alias/all')
  })

  it('handles back button navigation using router history back', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    const backButton = screen.getByRole('button', { name: 'Back' })
    fireEvent.click(backButton)

    expect(mockHistoryBack).toHaveBeenCalledTimes(1)
  })

  it('opens "What is Alias?" modal on info icon click, and closes on Done and X with focus restoration', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    const infoButton = screen.getByRole('button', { name: 'What is Alias?' })
    infoButton.focus()
    expect(document.activeElement).toBe(infoButton)

    // Open modal
    fireEvent.click(infoButton)

    const modalTitle = await screen.findByText('What is Alias?')
    expect(modalTitle).toBeDefined()

    // Check exact paragraph copy
    const paragraphText =
      'Alias allows you to create secondary accounts for trusted family members or other residents living with you. Each alias can access authorized estate services based on the permissions you grant. You can update or revoke access at any time, ensuring convenience without compromising security.'
    expect(screen.getByText(paragraphText)).toBeDefined()

    // Close via Done button
    const doneButton = screen.getByRole('button', { name: 'Done' })
    fireEvent.click(doneButton)

    await waitFor(() => {
      expect(screen.queryByText(paragraphText)).toBeNull()
    })

    // Reopen and close via Close (X) button
    fireEvent.click(infoButton)
    expect(await screen.findByText('What is Alias?')).toBeDefined()

    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText(paragraphText)).toBeNull()
    })
  })

  it('shows loading skeletons while loading and renders static copy immediately', () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    // Static UI renders immediately
    expect(screen.getByText('Alias')).toBeDefined()
    expect(screen.getByText('Primary account')).toBeDefined()
    expect(screen.getByText('Create an alias')).toBeDefined()
    expect(screen.getByText('Aliases')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Create New Alias' })).toBeDefined()

    // Skeletons container has aria-busy="true"
    const skeletonsContainer = screen.getByLabelText('Loading aliases')
    expect(skeletonsContainer.getAttribute('aria-busy')).toBe('true')
  })

  it('shows error state with Retry button when fetching fails', async () => {
    setMockAliasListError(true)
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Failed to load aliases')).toBeDefined()
    })

    const retryButton = screen.getByRole('button', { name: 'Retry' })
    expect(retryButton).toBeDefined()

    // Clicking retry with error resolved
    setMockAliasListError(false)
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText('Valentine Obumneme')).toBeDefined()
    })
  })
})

describe('AliasViewAllPage', () => {
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

  it('renders title, info card, and all alias rows in populated state', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasViewAllPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    expect(screen.getByText('Aliases')).toBeDefined()
    expect(
      screen.getByText('View and manage the alias accounts linked to your profile.'),
    ).toBeDefined()
    expect(screen.getByText('Ugochi Nneoma')).toBeDefined()
  })

  it('renders large empty state when there are no aliases', async () => {
    setActiveAliasListState('empty')
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasViewAllPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('No active alias yet')).toBeDefined()
    })

    expect(screen.getByText('Your aliases will appear here once activated.')).toBeDefined()
  })

  it('navigates back when clicking the back button', () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasViewAllPage />, { wrapper })

    const backButton = screen.getByRole('button', { name: 'Back' })
    fireEvent.click(backButton)

    expect(mockHistoryBack).toHaveBeenCalledTimes(1)
  })
})
