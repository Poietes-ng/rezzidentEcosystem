// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AliasListPage } from '../components/AliasListPage'
import { CreateAliasPage } from '../components/create/CreateAliasPage'
import { CreateAliasPermissionsStep } from '../components/create/CreateAliasPermissionsStep'
import { CreateAliasSuccessStep } from '../components/create/CreateAliasSuccessStep'
import { aliasKeys } from '../api/aliasKeys'
import { getAllAliases, resetAliasStore } from '../api/aliasQueries'
import { resetAliasMocks, setActiveAliasListState } from '../mocks/alias.mocks'
import * as copyModule from '../utils/copyToClipboard'
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

describe('CreateAliasPage — Phase 3 (Step 3 of 3 & Success)', () => {
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
    vi.restoreAllMocks()
  })

  it('renders Step 3 permissions with all three switches ON by default and focuses heading', () => {
    const onPermissionChange = vi.fn()
    const onSubmit = vi.fn()

    render(
      <CreateAliasPermissionsStep
        permissions={{ visitorCode: true, forum: true, bills: true }}
        isSubmitting={false}
        onPermissionChange={onPermissionChange}
        onSubmit={onSubmit}
      />,
    )

    const heading = screen.getByRole('heading', {
      name: 'Set alias permissions',
    })
    expect(document.activeElement).toBe(heading)
    expect(
      screen.getByText('Control which features this alias can access within the app.'),
    ).toBeDefined()

    const visitorSwitch = screen.getByRole('switch', {
      name: 'Generate visitor code',
    })
    const forumSwitch = screen.getByRole('switch', { name: 'Estate forum' })
    const billsSwitch = screen.getByRole('switch', { name: 'Pay bills' })

    expect(visitorSwitch.getAttribute('aria-checked')).toBe('true')
    expect(forumSwitch.getAttribute('aria-checked')).toBe('true')
    expect(billsSwitch.getAttribute('aria-checked')).toBe('true')

    fireEvent.click(billsSwitch)
    expect(onPermissionChange).toHaveBeenCalledWith('bills', false)

    const createBtn = screen.getByRole('button', { name: 'Create Alias' })
    fireEvent.click(createBtn)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('creates a pending alias at the start of the store, invalidates list queries, protects against double submit, and prevents browser back from recreating', async () => {
    const wrapper = createTestQueryWrapper(queryClient)

    // Pre-populate View All list query so we can verify invalidation without a page reload
    queryClient.setQueryData(aliasKeys.list(true), {
      primaryAccount: {
        name: 'Valentine Obumneme',
        tier: 'Tier 1',
        unit: 'Block A • Unit 2',
      },
      members: [],
    })

    render(<CreateAliasPage />, { wrapper })

    // Step 1
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Chidinma' },
    })
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Okafor' },
    })
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '8051234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    // Step 2
    await screen.findByText('FREQUENTLY USED')
    fireEvent.click(screen.getByRole('button', { name: 'Sister' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    // Step 3
    await screen.findByText('Set alias permissions')
    expect(screen.getByText('Step 3 of 3')).toBeDefined()

    // Toggle "Pay bills" off
    fireEvent.click(screen.getByRole('switch', { name: 'Pay bills' }))

    const createBtn = screen.getByRole('button', { name: 'Create Alias' })
    fireEvent.click(createBtn)
    fireEvent.click(createBtn)

    // Transition to Success screen
    const successHeading = await screen.findByRole('heading', {
      name: 'Alias created successfully',
    })
    expect(document.activeElement).toBe(successHeading)
    expect(
      screen.getByText('Share the link below with your alias to complete their account setup.'),
    ).toBeDefined()
    expect(screen.getByText('Link expires in 24 hours')).toBeDefined()

    // Verify new pending member is at the start of the store with 24h expiry and chosen permissions
    const allMembers = await getAllAliases()
    const newest = allMembers[0]
    expect(newest.firstName).toBe('Chidinma')
    expect(newest.lastName).toBe('Okafor')
    expect(newest.relationship).toBe('Sister')
    expect(newest.status).toBe('pending')
    expect(newest.permissions).toEqual({
      visitorCode: true,
      forum: true,
      bills: false,
    })
    expect(newest.invite?.code).toMatch(/^ali\d{4}$/)
    const expiryMs = new Date(newest.invite?.expiresAt ?? '').getTime()
    expect(expiryMs - Date.now()).toBeGreaterThan(23 * 3600 * 1000)

    // Verify list queries were invalidated / refetched with new member at index 0
    const allListQueryState = queryClient.getQueryState(aliasKeys.list(true))
    expect(allListQueryState?.isInvalidated).toBe(true)

    await waitFor(() => {
      const previewCache = queryClient.getQueryData<{
        members: Array<{ firstName: string }>
      }>(aliasKeys.list(false))
      expect(previewCache?.members[0]?.firstName).toBe('Chidinma')
    })

    // Browser popstate (back button) on success screen navigates to /alias with replace: true
    fireEvent.popState(window)
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/alias', replace: true })
  })

  it('handles Copy ("Copied" state + "Link Copied" toast), Share Code (Web Share API + AbortError + clipboard fallback), and Done button on Success screen', async () => {
    const copySpy = vi.spyOn(copyModule, 'copyToClipboard').mockResolvedValue(true)
    const onDone = vi.fn()

    render(<CreateAliasSuccessStep inviteCode="ali7829" onDone={onDone} />)

    expect(screen.getByText('rezzident.app/alias/ali7829')).toBeDefined()
    expect(screen.getByText('Link expires in 24 hours')).toBeDefined()

    // Copy button switches to Copied and shows Link Copied toast
    const copyBtn = screen.getByRole('button', { name: /Copy/i })
    fireEvent.click(copyBtn)

    await waitFor(() => {
      expect(copySpy).toHaveBeenCalledWith('https://rezzident.app/alias/ali7829')
      expect(screen.getByText('Copied')).toBeDefined()
      expect(screen.getByRole('status').textContent).toContain('Link Copied')
    })

    // Share Code fallback when navigator.share is undefined
    const shareBtn = screen.getByRole('button', { name: 'Share Code' })
    fireEvent.click(shareBtn)
    await waitFor(() => {
      expect(copySpy).toHaveBeenCalledTimes(2)
    })

    // Share Code with Web Share API and AbortError ignored
    const shareMock = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('AbortError'), { name: 'AbortError' }))
      .mockResolvedValueOnce(undefined)
    Object.defineProperty(navigator, 'share', {
      value: shareMock,
      configurable: true,
      writable: true,
    })

    fireEvent.click(shareBtn)
    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledTimes(1)
    })
    // AbortError did not trigger clipboard fallback
    expect(copySpy).toHaveBeenCalledTimes(2)

    // Done navigates to /alias
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('redirects /alias/create to /alias when the user already has 10 aliases, and Create New Alias card navigates to /alias/create when under limit', async () => {
    const wrapper = createTestQueryWrapper(queryClient)

    // 1. Populated list: clicking Create New Alias navigates to /alias/create
    const { unmount } = render(<AliasListPage />, { wrapper })
    await screen.findByText('Valentine Obumneme')
    fireEvent.click(screen.getByRole('button', { name: 'Create New Alias' }))
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/alias/create' })
    unmount()
    mockNavigate.mockClear()

    // 2. Max state (10 aliases): opening /alias/create redirects to /alias
    queryClient.clear()
    setActiveAliasListState('max')
    render(<CreateAliasPage />, { wrapper })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/alias',
        replace: true,
      })
    })
  })
})
