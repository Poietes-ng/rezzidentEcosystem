import type { AliasMember, AliasListState, PrimaryAccount } from '../types/alias.types'

/*
 * Mock data for the Household Alias feature.
 *
 * The backend does not exist yet, so everything the Alias screens show comes from
 * this file. Only `api/aliasQueries.ts` imports it; components and hooks never do.
 * When the real API arrives, only the function bodies in `aliasQueries.ts` change.
 *
 * How to preview the different screens:
 *   - List states      -> change ACTIVE_ALIAS_LIST_STATE (populated | empty | max)
 *   - Failure states   -> set one of the MOCK_*_ERROR switches below to true
 *   - Details states   -> open /alias/<member id> (see the ids in MOCK_ALIAS_MEMBERS)
 *
 * Leave every switch at its default value when committing.
 */

/**
 * The signed-in primary account holder, shown in the "Primary account" card.
 * `unit` is displayed under the page title on every Alias screen.
 */
export const MOCK_PRIMARY_ACCOUNT: PrimaryAccount = {
  name: 'Valentine Obumneme',
  tier: 'Tier 1',
  unit: 'Block A • Unit 2',
}

/**
 * Phone numbers (10-digit local format without leading 0) treated as already registered
 * during the Create Alias step 1 phone check.
 */
export const MOCK_REGISTERED_ALIAS_PHONES: readonly string[] = ['8012345678']

/**
 * Every household member the primary account holder has created.
 *
 * Reading guide:
 *   - alias-1 ... alias-10  regular members shown on the list (the Figma "10 of 10" case)
 *   - alias-4               the deactivated example (locked switches, Reactivate button)
 *   - alias-pending-1       a pending invite that is still valid
 *   - alias-expired-1       a pending invite whose link has already expired
 *
 * `permissions` maps to the three switches on the details page:
 *   visitorCode = "Generate visitor code", forum = "Estate forum", bills = "Pay bills".
 */
export const MOCK_ALIAS_MEMBERS: AliasMember[] = [
  {
    id: 'alias-1',
    firstName: 'Mamah',
    lastName: 'Ifeoma Clara',
    relationship: 'Daughter',
    status: 'active',
    tier: 'Tier 1',
    permissions: { visitorCode: true, forum: true, bills: true },
  },
  {
    id: 'alias-2',
    firstName: 'Ugochi',
    lastName: 'Nneoma',
    relationship: 'Wife',
    status: 'active',
    // One permission off, so the "saved vs changed" button logic can be tested.
    permissions: { visitorCode: true, forum: true, bills: false },
  },
  {
    id: 'alias-3',
    firstName: 'Emeka',
    lastName: 'Njoku',
    relationship: 'Driver',
    status: 'active',
    permissions: { visitorCode: true, forum: false, bills: false },
  },
  {
    id: 'alias-4',
    firstName: 'Chijioke',
    lastName: 'Obinna',
    relationship: 'Cleaner',
    // Deactivated: shows the red "Deactivated" tag on the list and locks the
    // switches on the details page. The permissions are kept as they were.
    status: 'deactivated',
    permissions: { visitorCode: true, forum: true, bills: true },
  },
  {
    id: 'alias-5',
    firstName: 'Adaobi',
    lastName: 'Nwankwo',
    relationship: 'Sister',
    status: 'active',
    permissions: { visitorCode: true, forum: true, bills: false },
  },
  {
    id: 'alias-6',
    firstName: 'Emeka',
    lastName: 'Ibe',
    relationship: 'Cousin',
    status: 'active',
    permissions: { visitorCode: true, forum: false, bills: false },
  },
  {
    id: 'alias-7',
    firstName: 'Ify',
    lastName: 'Nnaji',
    relationship: 'Friend',
    status: 'active',
    permissions: { visitorCode: false, forum: true, bills: false },
  },
  {
    id: 'alias-8',
    firstName: 'Obinna',
    lastName: 'Ugo',
    relationship: 'Colleague',
    status: 'active',
    // Everything off: the "no permissions granted" case.
    permissions: { visitorCode: false, forum: false, bills: false },
  },
  {
    id: 'alias-9',
    firstName: 'Chijioke',
    lastName: 'Eze',
    relationship: 'Brother',
    status: 'active',
    permissions: { visitorCode: true, forum: false, bills: false },
  },
  {
    id: 'alias-10',
    firstName: 'Ijeoma',
    lastName: 'Onwuka',
    relationship: 'Aunt',
    status: 'active',
    permissions: { visitorCode: true, forum: true, bills: false },
  },
  {
    id: 'alias-pending-1',
    firstName: 'Ifeoma',
    lastName: 'Clara',
    relationship: 'Daughter',
    // Pending members have no photo yet (the profile card shows a placeholder)
    // and all permissions are off until the invite is accepted.
    status: 'pending',
    permissions: { visitorCode: false, forum: false, bills: false },
    invite: {
      code: 'ali7829',
      // Lazily computed offset: +23h 45m from read time
      expiresAt: '',
    },
  },
  {
    id: 'alias-expired-1',
    firstName: 'Ifeoma',
    lastName: 'Clara',
    relationship: 'Daughter',
    // The status stays 'pending'. "Expired" is worked out from the timestamp,
    // not stored, so it flips on its own when the time passes.
    status: 'pending',
    permissions: { visitorCode: false, forum: false, bills: false },
    invite: {
      code: 'ali5512',
      // Lazily computed offset: -1h from read time (already expired)
      expiresAt: '',
    },
  },
]

/*
 * Preview switches. They are `let` (not `const`) so the setter functions below can
 * change them at runtime, which is how the tests flip between states.
 * Edit the defaults here to preview a state in the browser.
 */

/** Which list screen to show: 'populated' (default), 'empty' (no members) or 'max' (10 of 10). */
export let ACTIVE_ALIAS_LIST_STATE: AliasListState = 'populated'

/** true = the list request fails, so the red error alert with Retry shows. */
export let MOCK_ALIAS_LIST_ERROR = false

/** true = "Update Permissions" fails: the switches revert and the red error toast shows. */
export let MOCK_PERMISSIONS_ERROR = false

/** true = deactivate, reactivate and delete fail: the modal closes and the red error toast shows. */
export let MOCK_ALIAS_STATUS_ERROR = false

/** true = "Re-generate Link" and "Cancel Process" fail with the red error toast. */
export let MOCK_INVITE_ERROR = false

/** true = "Create Alias" on Step 3 fails. */
export let MOCK_ALIAS_CREATE_ERROR = false

/* Setters for the switches above. Used by the tests; production code never calls them. */

export function setActiveAliasListState(state: AliasListState): void {
  ACTIVE_ALIAS_LIST_STATE = state
}

export function setMockAliasListError(error: boolean): void {
  MOCK_ALIAS_LIST_ERROR = error
}

export function setMockPermissionsError(error: boolean): void {
  MOCK_PERMISSIONS_ERROR = error
}

export function setMockAliasStatusError(error: boolean): void {
  MOCK_ALIAS_STATUS_ERROR = error
}

export function setMockInviteError(error: boolean): void {
  MOCK_INVITE_ERROR = error
}

export function setMockAliasCreateError(error: boolean): void {
  MOCK_ALIAS_CREATE_ERROR = error
}

/** Puts every switch back to its default. Call it in a test's cleanup so one test cannot leak into the next. */
export function resetAliasMocks(): void {
  ACTIVE_ALIAS_LIST_STATE = 'populated'
  MOCK_ALIAS_LIST_ERROR = false
  MOCK_PERMISSIONS_ERROR = false
  MOCK_ALIAS_STATUS_ERROR = false
  MOCK_INVITE_ERROR = false
  MOCK_ALIAS_CREATE_ERROR = false
}
