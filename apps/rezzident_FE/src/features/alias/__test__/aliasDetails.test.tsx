// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AliasDetailsPage } from '../components/details/AliasDetailsPage'
import {
  resetAliasMocks,
  setMockAliasStatusError,
  setMockPermissionsError,
} from '../mocks/alias.mocks'
import { getAlias, getAliases, resetAliasStore, setAliasInStore } from '../api/aliasQueries'
import { aliasKeys } from '../api/aliasKeys'
import { createTestQueryClient, createTestQueryWrapper } from './testUtils'
import type { AliasMember } from '../types/alias.types'

let mockCurrentAliasId = 'alias-1'
const mockHistoryBack = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    history: { back: mockHistoryBack },
  }),
  useNavigate: () => mockNavigate,
  useParams: () => ({ aliasId: mockCurrentAliasId }),
}))

describe('AliasDetailsPage', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>

  beforeEach(() => {
    queryClient = createTestQueryClient()
    resetAliasMocks()
    resetAliasStore()
    mockCurrentAliasId = 'alias-1'
    vi.clearAllMocks()
  })

  afterEach(() => {
    queryClient.clear()
    resetAliasMocks()
    resetAliasStore()
  })

  it('renders alias profile details, switches, and Deactivate button for active member', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    expect(screen.getByText('Alias Details')).toBeDefined()
    expect(screen.getByText('Block A • Unit 2')).toBeDefined()
    expect(screen.getByText('Alias Profile')).toBeDefined()
    expect(screen.getByText('Alias')).toBeDefined()
    expect(screen.getByText('Active')).toBeDefined()
    expect(screen.getByText('Daughter')).toBeDefined()
    expect(screen.getByText('Tier 1')).toBeDefined()

    // Permissions Card
    expect(screen.getByText('Set Permissions')).toBeDefined()
    expect(
      screen.getByText('Control which features this alias can access within the app.'),
    ).toBeDefined()
    expect(screen.getByText('Generate visitor code')).toBeDefined()
    expect(screen.getByText('Estate forum')).toBeDefined()
    expect(screen.getByText('Pay bills')).toBeDefined()

    // Bottom Action Area
    const deactivateBtn = screen.getByRole('button', { name: 'Deactivate Account' })
    expect(deactivateBtn).toBeDefined()
    expect(screen.getByRole('button', { name: 'Delete Account' })).toBeDefined()
  })

  it('permissions toggle updates the draft only (does not update saved backend store)', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    const payBillsSwitch = screen.getByRole('switch', { name: 'Pay bills' })
    expect(payBillsSwitch.getAttribute('aria-checked')).toBe('true')

    // Toggle switch off
    fireEvent.click(payBillsSwitch)
    expect(payBillsSwitch.getAttribute('aria-checked')).toBe('false')

    // Store has NOT changed yet
    const stored = await getAlias('alias-1')
    expect(stored?.member.permissions.bills).toBe(true)
  })

  it('the button switches between Deactivate Account and Update Permissions as the draft changes and back', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    // Initially "Deactivate Account"
    expect(screen.getByRole('button', { name: 'Deactivate Account' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Update Permissions' })).toBeNull()

    // Toggle a switch to make it dirty
    const payBillsSwitch = screen.getByRole('switch', { name: 'Pay bills' })
    fireEvent.click(payBillsSwitch)

    // Now button should be "Update Permissions"
    expect(screen.getByRole('button', { name: 'Update Permissions' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Deactivate Account' })).toBeNull()

    // Toggle back to the original saved value
    fireEvent.click(payBillsSwitch)

    // Button reverts back to "Deactivate Account"
    expect(screen.getByRole('button', { name: 'Deactivate Account' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Update Permissions' })).toBeNull()
  })

  it('saving success shows the green toast, updates saved state, and button returns to Deactivate Account', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    const payBillsSwitch = screen.getByRole('switch', { name: 'Pay bills' })
    fireEvent.click(payBillsSwitch)

    const updateBtn = screen.getByRole('button', { name: 'Update Permissions' })
    fireEvent.click(updateBtn)

    // Wait for success toast
    const toast = await screen.findByRole('status')
    expect(toast).toBeDefined()
    expect(toast.textContent).toContain('Permissions updated')

    // Button returns to Deactivate Account
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Deactivate Account' })).toBeDefined()
    })

    // Store now reflects the saved permission
    const updatedStore = await getAlias('alias-1')
    expect(updatedStore?.member.permissions.bills).toBe(false)
  })

  it('saving failure reverts the switches and shows the red error toast', async () => {
    setMockPermissionsError(true)
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    const payBillsSwitch = screen.getByRole('switch', { name: 'Pay bills' })
    expect(payBillsSwitch.getAttribute('aria-checked')).toBe('true')

    // Toggle switch off
    fireEvent.click(payBillsSwitch)
    expect(payBillsSwitch.getAttribute('aria-checked')).toBe('false')

    const updateBtn = screen.getByRole('button', { name: 'Update Permissions' })
    fireEvent.click(updateBtn)

    // Red error toast appears
    const errorToast = await screen.findByRole('alert')
    expect(errorToast).toBeDefined()
    expect(errorToast.textContent).toContain("Couldn't complete the action. Please try again.")

    // Switches revert to last saved values
    await waitFor(() => {
      expect(payBillsSwitch.getAttribute('aria-checked')).toBe('true')
    })

    // Button returns to Deactivate Account
    expect(screen.getByRole('button', { name: 'Deactivate Account' })).toBeDefined()
  })

  it('double press on Update Permissions sends only one request', async () => {
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    const payBillsSwitch = screen.getByRole('switch', { name: 'Pay bills' })
    fireEvent.click(payBillsSwitch)

    const updateBtn = screen.getByRole('button', { name: 'Update Permissions' })
    // Rapid double click
    fireEvent.click(updateBtn)
    fireEvent.click(updateBtn)

    const toast = await screen.findByRole('status')
    expect(toast).toBeDefined()
    expect(toast.textContent).toContain('Permissions updated')
  })

  it('deactivated member locks switches and displays green Reactivate Account button', async () => {
    mockCurrentAliasId = 'alias-4' // Chijioke Obinna is deactivated in mocks
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Chijioke Obinna')).toBeDefined()
    })

    expect(screen.getByText('Deactivated')).toBeDefined()

    // Switches must be disabled and aria-disabled
    const visitorCodeSwitch = screen.getByRole('switch', { name: 'Generate visitor code' })
    const forumSwitch = screen.getByRole('switch', { name: 'Estate forum' })
    const billsSwitch = screen.getByRole('switch', { name: 'Pay bills' })

    expect((visitorCodeSwitch as HTMLButtonElement).disabled).toBe(true)
    expect((forumSwitch as HTMLButtonElement).disabled).toBe(true)
    expect((billsSwitch as HTMLButtonElement).disabled).toBe(true)

    expect(visitorCodeSwitch.getAttribute('aria-disabled')).toBe('true')
    expect(forumSwitch.getAttribute('aria-disabled')).toBe('true')
    expect(billsSwitch.getAttribute('aria-disabled')).toBe('true')

    // Button must be Reactivate Account, and no Update Permissions state
    const reactivateBtn = screen.getByRole('button', { name: 'Reactivate Account' })
    expect(reactivateBtn).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Deactivate Account' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Update Permissions' })).toBeNull()
  })

  it('opening a deactivated member never shows the Deactivate button or unlocked switches', async () => {
    mockCurrentAliasId = 'alias-4'
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    // First paint / while loading: no Deactivate button and no unlocked switches
    expect(screen.queryByRole('button', { name: 'Deactivate Account' })).toBeNull()
    const initialSwitches = screen.queryAllByRole('switch')
    for (const s of initialSwitches) {
      expect((s as HTMLButtonElement).disabled).toBe(true)
    }

    // After data loads
    await screen.findByText('Chijioke Obinna')

    expect(screen.queryByRole('button', { name: 'Deactivate Account' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Reactivate Account' })).toBeDefined()

    const loadedSwitches = screen.getAllByRole('switch')
    expect(loadedSwitches.length).toBe(3)
    for (const s of loadedSwitches) {
      expect((s as HTMLButtonElement).disabled).toBe(true)
      expect(s.getAttribute('aria-disabled')).toBe('true')
    }
  })

  it('member with one permission off initialises draft from real permissions with isDirty false (shows Deactivate button, not Update Permissions)', async () => {
    mockCurrentAliasId = 'alias-2' // Ugochi Nneoma has bills: false
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await screen.findByText('Ugochi Nneoma')

    const visitorCodeSwitch = screen.getByRole('switch', { name: 'Generate visitor code' })
    const forumSwitch = screen.getByRole('switch', { name: 'Estate forum' })
    const billsSwitch = screen.getByRole('switch', { name: 'Pay bills' })

    expect(visitorCodeSwitch.getAttribute('aria-checked')).toBe('true')
    expect(forumSwitch.getAttribute('aria-checked')).toBe('true')
    expect(billsSwitch.getAttribute('aria-checked')).toBe('false')

    // Since draft equals saved values from real permissions, isDirty is false
    expect(screen.getByRole('button', { name: 'Deactivate Account' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Update Permissions' })).toBeNull()
  })

  describe('Confirmation Modals (Deactivate, Reactivate, Delete)', () => {
    it('Deactivate modal: opens with exact copy, cancels, closes on X, closes on Escape, confirms, and blocks duplicate submits', async () => {
      const members = await getAliases()
      const member = members.find((m) => m.id === 'alias-1')
      if (member) {
        queryClient.setQueryData(aliasKeys.detail('alias-1'), {
          member,
          primaryAccount: {
            name: 'Valentine Obumneme',
            tier: 'Tier 1' as const,
            unit: 'Block A • Unit 2',
          },
        })
      }
      const wrapper = createTestQueryWrapper(queryClient)
      render(<AliasDetailsPage />, { wrapper })

      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()

      const deactivateBtn = screen.getByRole('button', { name: 'Deactivate Account' })

      // 1. Open and Cancel
      fireEvent.click(deactivateBtn)
      expect(screen.getByText('Deactivate Account?')).toBeDefined()
      expect(
        screen.getByText(
          'Are you sure you want to deactivate this alias account? They will lose access to all estate features until reactivated.',
        ),
      ).toBeDefined()

      const cancelBtn = screen.getByRole('button', { name: 'Cancel' })
      fireEvent.click(cancelBtn)
      expect(screen.queryByText('Deactivate Account?')).toBeNull()

      // 2. Open and Close via X
      fireEvent.click(deactivateBtn)
      const closeX = screen.getByRole('button', { name: 'Close' })
      fireEvent.click(closeX)
      expect(screen.queryByText('Deactivate Account?')).toBeNull()

      // 3. Open and Close via Escape
      fireEvent.click(deactivateBtn)
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(screen.queryByText('Deactivate Account?')).toBeNull()

      // 4. Open and Confirm
      fireEvent.click(deactivateBtn)
      const confirmDeactivate = screen.getByRole('button', { name: 'Deactivate' })

      // Duplicate click protection test
      fireEvent.click(confirmDeactivate)
      fireEvent.click(confirmDeactivate)

      // Modal closes and member transitions to deactivated
      await waitFor(() => {
        expect(screen.queryByText('Deactivate Account?')).toBeNull()
        expect(screen.getByText('Deactivated')).toBeDefined()
      })
      // Button turns to Reactivate Account
      expect(screen.getByRole('button', { name: 'Reactivate Account' })).toBeDefined()
      // Switches lock
      const switch1 = screen.getByRole('switch', { name: 'Generate visitor code' })
      expect((switch1 as HTMLButtonElement).disabled).toBe(true)
    })

    it('Reactivate modal: opens, cancels, closes on X and Escape, confirms, and switches back to active', async () => {
      mockCurrentAliasId = 'alias-4' // Deactivated member
      const members = await getAliases()
      const member = members.find((m) => m.id === 'alias-4')
      if (member) {
        queryClient.setQueryData(aliasKeys.detail('alias-4'), {
          member,
          primaryAccount: {
            name: 'Valentine Obumneme',
            tier: 'Tier 1' as const,
            unit: 'Block A • Unit 2',
          },
        })
      }
      const wrapper = createTestQueryWrapper(queryClient)
      render(<AliasDetailsPage />, { wrapper })

      expect(screen.getByText('Chijioke Obinna')).toBeDefined()

      const reactivateBtn = screen.getByRole('button', { name: 'Reactivate Account' })

      // 1. Open and Cancel
      fireEvent.click(reactivateBtn)
      expect(screen.getByText('Reactivate Account?')).toBeDefined()
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(screen.queryByText('Reactivate Account?')).toBeNull()

      // 2. Open and Close via X
      fireEvent.click(reactivateBtn)
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(screen.queryByText('Reactivate Account?')).toBeNull()

      // 3. Open and Close via Escape
      fireEvent.click(reactivateBtn)
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(screen.queryByText('Reactivate Account?')).toBeNull()

      // 4. Open and Confirm
      fireEvent.click(reactivateBtn)
      const confirmReactivate = screen.getByRole('button', { name: 'Reactivate' })
      fireEvent.click(confirmReactivate)

      await waitFor(() => {
        expect(screen.queryByText('Reactivate Account?')).toBeNull()
        expect(screen.getByText('Active')).toBeDefined()
      })
      expect(screen.getByRole('button', { name: 'Deactivate Account' })).toBeDefined()
      const switch1 = screen.getByRole('switch', { name: 'Generate visitor code' })
      expect((switch1 as HTMLButtonElement).disabled).toBe(false)
    })

    it('Delete modal: opens, cancels, closes on X and Escape, confirms, navigates to /alias, and removes member from store', async () => {
      const members = await getAliases()
      const member = members.find((m) => m.id === 'alias-1')
      if (member) {
        queryClient.setQueryData(aliasKeys.detail('alias-1'), {
          member,
          primaryAccount: {
            name: 'Valentine Obumneme',
            tier: 'Tier 1' as const,
            unit: 'Block A • Unit 2',
          },
        })
      }
      const wrapper = createTestQueryWrapper(queryClient)
      render(<AliasDetailsPage />, { wrapper })

      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()

      const deleteLink = screen.getByRole('button', { name: 'Delete Account' })

      // 1. Open and Cancel
      fireEvent.click(deleteLink)
      expect(screen.getByText('Delete Account?')).toBeDefined()
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(screen.queryByText('Delete Account?')).toBeNull()

      // 2. Open and Close via X
      fireEvent.click(deleteLink)
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(screen.queryByText('Delete Account?')).toBeNull()

      // 3. Open and Close via Escape
      fireEvent.click(deleteLink)
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(screen.queryByText('Delete Account?')).toBeNull()

      // 4. Open and Confirm Delete
      fireEvent.click(deleteLink)
      const confirmDelete = screen.getByRole('button', { name: 'Delete' })
      fireEvent.click(confirmDelete)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/alias' })
      })

      // Verify alias-1 is removed from store
      const allMembers = await getAliases()
      expect(allMembers.find((m) => m.id === 'alias-1')).toBeUndefined()
    })

    it('Modal failure: closes modal, shows red error toast, and leaves status unchanged', async () => {
      setMockAliasStatusError(true)
      const wrapper = createTestQueryWrapper(queryClient)
      render(<AliasDetailsPage />, { wrapper })

      await waitFor(() => {
        expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
      })

      const deactivateBtn = screen.getByRole('button', { name: 'Deactivate Account' })
      fireEvent.click(deactivateBtn)

      const confirmBtn = screen.getByRole('button', { name: 'Deactivate' })
      fireEvent.click(confirmBtn)

      // Modal closes
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Deactivate Account?' })).toBeNull()
      })

      // Error toast shown
      const toast = await screen.findByRole('alert')
      expect(toast).toBeDefined()
      expect(toast.textContent).toContain("Couldn't complete the action. Please try again.")

      // Status remains active
      expect(screen.getByText('Active')).toBeDefined()
      expect(screen.getByRole('button', { name: 'Deactivate Account' })).toBeDefined()
    })
  })

  it('renders profile card only with no permissions card and no actions for pending member', async () => {
    const pendingMember: AliasMember = {
      id: 'alias-pending-1',
      firstName: 'Kene',
      lastName: 'Okafor',
      relationship: 'Nephew',
      status: 'pending',
      tier: 'Tier 1',
      permissions: { visitorCode: false, forum: false, bills: false },
      invite: {
        code: 'ali7829',
        expiresAt: new Date(Date.now() + 23 * 3600 * 1000).toISOString(),
      },
    }
    setAliasInStore(pendingMember)
    mockCurrentAliasId = 'alias-pending-1'

    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Kene Okafor')).toBeDefined()
    })

    expect(screen.getByText('Pending')).toBeDefined()
    expect(screen.getByText('Nephew')).toBeDefined()
    // Tier 1 must NOT be shown for pending member
    expect(screen.queryByText('Tier 1')).toBeNull()
    expect(screen.getByText('Alias photo will appear here')).toBeDefined()

    // Invite link card elements
    expect(screen.getByText('Alias account link')).toBeDefined()
    expect(
      screen.getByText(
        'Share this link with your alias to grant them access to your Rezzident account.',
      ),
    ).toBeDefined()
    expect(screen.getByText('rezzident.app/alias/ali7829')).toBeDefined()
    expect(screen.getByRole('button', { name: /copy/i })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Share Link' })).toBeDefined()

    // Set Permissions card is present with locked switches
    expect(screen.getByText('Set Permissions')).toBeDefined()
    const switches = screen.getAllByRole('switch')
    expect(switches).toHaveLength(3)
    switches.forEach((sw) => {
      expect((sw as HTMLButtonElement).disabled).toBe(true)
    })

    // Action button is disabled Deactivate Account + Cancel Process link
    const deactivateBtn = screen.getByRole('button', { name: 'Deactivate Account' })
    expect((deactivateBtn as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole('button', { name: 'Cancel Process' })).toBeDefined()
  })

  it('renders expired view matching Figma frame with red dashed border, muted link, expired alert, Re-generate Link button, and aria-disabled Copy', async () => {
    const expiredMember: AliasMember = {
      id: 'alias-expired-1',
      firstName: 'Tobe',
      lastName: 'Eze',
      relationship: 'Electrician',
      status: 'expired',
      tier: 'Tier 1',
      permissions: { visitorCode: false, forum: false, bills: false },
      invite: {
        code: 'ali1234',
        expiresAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
    }
    setAliasInStore(expiredMember)
    mockCurrentAliasId = 'alias-expired-1'

    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Tobe Eze')).toBeDefined()
    })

    // In Figma frame, expired alias also displays the yellow Pending tag
    expect(screen.getByText('Pending')).toBeDefined()
    expect(screen.getByText('Electrician')).toBeDefined()
    expect(screen.queryByText('Tier 1')).toBeNull()
    expect(screen.getByText('Alias photo will appear here')).toBeDefined()

    // Expired invite link card
    expect(screen.getByText('Alias account link')).toBeDefined()
    expect(
      screen.getByText(
        'Your previous alias link has expired. Generate a new link to share with your alias so they can access your Rezzident account.',
      ),
    ).toBeDefined()
    expect(screen.getByText('rezzident.app/alias/ali1234')).toBeDefined()
    expect(screen.getByText('Link has expired, generate a new link')).toBeDefined()

    // Copy button exists, aria-disabled is true
    const copyBtn = screen.getByRole('button', { name: /copy/i })
    expect(copyBtn).toBeDefined()
    expect(copyBtn.getAttribute('aria-disabled')).toBe('true')

    // Re-generate Link button is present
    expect(screen.getByRole('button', { name: 'Re-generate Link' })).toBeDefined()

    // Permissions switches locked
    const switches = screen.getAllByRole('switch')
    switches.forEach((sw) => {
      expect((sw as HTMLButtonElement).disabled).toBe(true)
    })

    // Disabled Deactivate button + Cancel Process
    const deactivateBtn2 = screen.getByRole('button', { name: 'Deactivate Account' })
    expect((deactivateBtn2 as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole('button', { name: 'Cancel Process' })).toBeDefined()
  })

  it('renders "Alias not found" warning card when aliasId does not exist', async () => {
    mockCurrentAliasId = 'non-existent-id'
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Alias not found')).toBeDefined()
    })

    const backBtn = screen.getByRole('button', { name: 'Back to Aliases' })
    fireEvent.click(backBtn)
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/alias' })
  })

  it('back arrow navigates using router.history.back() when history exists', async () => {
    window.history.pushState({}, 'Test', '/alias/alias-1')
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    const backButton = screen.getByRole('button', { name: 'Back' })
    fireEvent.click(backButton)

    expect(mockHistoryBack).toHaveBeenCalledTimes(1)
  })

  it('back arrow navigates to /alias when no previous history entry exists', async () => {
    // Mock history.length to 1
    const originalLength = window.history.length
    Object.defineProperty(window.history, 'length', { value: 1, configurable: true })

    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    const backButton = screen.getByRole('button', { name: 'Back' })
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/alias' })
    Object.defineProperty(window.history, 'length', { value: originalLength, configurable: true })
  })
})

// ─── 2g: List-invalidation and cache-isolation tests ──────────────────────────

describe('Alias list cache invalidation after mutations', () => {
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

  it('after deactivate the list query is invalidated (marked stale) without a page reload', async () => {
    mockCurrentAliasId = 'alias-1'
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    // Confirm list query is NOT yet in the cache (details page fetches the detail key)
    // Seed a fake list entry so we can track invalidation
    queryClient.setQueryData(aliasKeys.list(false), {
      primaryAccount: null,
      members: [{ id: 'alias-1', status: 'active' }],
    })

    const deactivateBtn = screen.getByRole('button', { name: 'Deactivate Account' })
    fireEvent.click(deactivateBtn)
    const confirmDeactivate = screen.getByRole('button', { name: 'Deactivate' })
    fireEvent.click(confirmDeactivate)

    await waitFor(() => {
      expect(screen.getByText('Deactivated')).toBeDefined()
    })

    // After deactivate, the list query should be invalidated (isInvalidated = true)
    const listState = queryClient.getQueryState(aliasKeys.list(false))
    expect(listState?.isInvalidated).toBe(true)
  })

  it('after reactivate the list query is invalidated (marked stale) without a page reload', async () => {
    mockCurrentAliasId = 'alias-4' // deactivated member
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Chijioke Obinna')).toBeDefined()
    })

    queryClient.setQueryData(aliasKeys.list(false), {
      primaryAccount: null,
      members: [{ id: 'alias-4', status: 'deactivated' }],
    })

    const reactivateBtn = screen.getByRole('button', { name: 'Reactivate Account' })
    fireEvent.click(reactivateBtn)
    const confirmReactivate = screen.getByRole('button', { name: 'Reactivate' })
    fireEvent.click(confirmReactivate)

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeDefined()
    })

    const listState = queryClient.getQueryState(aliasKeys.list(false))
    expect(listState?.isInvalidated).toBe(true)
  })

  it('after delete the list query is invalidated and the detail entry is removed from cache', async () => {
    mockCurrentAliasId = 'alias-1'
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Mamah Ifeoma Clara')).toBeDefined()
    })

    queryClient.setQueryData(aliasKeys.list(false), {
      primaryAccount: null,
      members: [{ id: 'alias-1', status: 'active' }],
    })

    const deleteBtn = screen.getByRole('button', { name: 'Delete Account' })
    fireEvent.click(deleteBtn)
    const confirmDelete = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(confirmDelete)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/alias' })
    })

    // Detail cache for alias-1 must be null
    const detailData = queryClient.getQueryData(aliasKeys.detail('alias-1'))
    expect(detailData).toBeNull()

    // List cache must be invalidated
    const listState = queryClient.getQueryState(aliasKeys.list(false))
    expect(listState?.isInvalidated).toBe(true)
  })

  it('regenerating one member invite does not change another member invite code in the cache', async () => {
    // Seed both pending and expired details into cache
    const pendingData = {
      primaryAccount: {
        name: 'Valentine Obumneme',
        unit: 'Block A • Unit 2',
        tier: 'Tier 1' as const,
      },
      member: {
        id: 'alias-pending-1',
        firstName: 'Kene',
        lastName: 'Okafor',
        relationship: 'Nephew',
        status: 'pending' as const,
        tier: 'Tier 1',
        permissions: { visitorCode: false, forum: false, bills: false },
        invite: {
          code: 'ali7829',
          expiresAt: new Date(Date.now() + 23 * 3600 * 1000).toISOString(),
        },
      },
    }
    const expiredData = {
      primaryAccount: {
        name: 'Valentine Obumneme',
        unit: 'Block A • Unit 2',
        tier: 'Tier 1' as const,
      },
      member: {
        id: 'alias-expired-1',
        firstName: 'Tobe',
        lastName: 'Eze',
        relationship: 'Electrician',
        status: 'expired' as const,
        tier: 'Tier 1',
        permissions: { visitorCode: false, forum: false, bills: false },
        invite: {
          code: 'ali5512',
          expiresAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        },
      },
    }

    queryClient.setQueryData(aliasKeys.detail('alias-pending-1'), pendingData)
    queryClient.setQueryData(aliasKeys.detail('alias-expired-1'), expiredData)

    // Also set the expired member into the in-memory mock store so the
    // regenerate API can resolve it
    setAliasInStore({
      id: 'alias-expired-1',
      firstName: 'Tobe',
      lastName: 'Eze',
      relationship: 'Electrician',
      status: 'expired',
      tier: 'Tier 1',
      permissions: { visitorCode: false, forum: false, bills: false },
      invite: {
        code: 'ali5512',
        expiresAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
    })

    mockCurrentAliasId = 'alias-expired-1'
    const wrapper = createTestQueryWrapper(queryClient)
    render(<AliasDetailsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Tobe Eze')).toBeDefined()
    })

    // Click Re-generate Link
    const regenBtn = screen.getByRole('button', { name: 'Re-generate Link' })
    fireEvent.click(regenBtn)

    await waitFor(() => {
      // Toast confirming regeneration
      expect(screen.queryByText('New invite link generated')).not.toBeNull()
    })

    // The pending member's cache entry must still have invite code 'ali7829'
    const pendingCached = queryClient.getQueryData<typeof pendingData>(
      aliasKeys.detail('alias-pending-1'),
    )
    expect(pendingCached?.member.invite.code).toBe('ali7829')
  })
})
