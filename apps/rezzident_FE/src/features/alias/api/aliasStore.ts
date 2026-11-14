import { MOCK_ALIAS_MEMBERS } from '../mocks/alias.mocks'
import type { AliasMember } from '../types/alias.types'

export const MOCK_API_DELAY_MS = 600
let mockApiDelayOverride: number | null = null

export function setMockApiDelayMs(ms: number | null): void {
  mockApiDelayOverride = ms
}

export function delay(ms: number = mockApiDelayOverride ?? MOCK_API_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function resolveMemberWithExpiry(member: AliasMember): AliasMember {
  const invite = member.invite ? { ...member.invite } : undefined
  if (invite && !invite.expiresAt) {
    if (member.id === 'alias-pending-1') {
      invite.expiresAt = new Date(Date.now() + 23 * 3600 * 1000 + 45 * 60 * 1000).toISOString()
    } else if (member.id === 'alias-expired-1') {
      invite.expiresAt = new Date(Date.now() - 3600 * 1000).toISOString()
    }
  }
  return {
    ...member,
    permissions: { ...member.permissions },
    invite,
  }
}

function initStore(): AliasMember[] {
  return MOCK_ALIAS_MEMBERS.map(resolveMemberWithExpiry)
}

let aliasStore: AliasMember[] = initStore()

export const revokedInviteCodes = new Set<string>()

export function getAliasStore(): AliasMember[] {
  return aliasStore
}

export function cloneAliasMember(member: AliasMember): AliasMember {
  return {
    ...member,
    permissions: { ...member.permissions },
    invite: member.invite ? { ...member.invite } : undefined,
  }
}

export function resetAliasStore(): void {
  aliasStore = initStore()
  revokedInviteCodes.clear()
}

export function setAliasInStore(member: AliasMember): void {
  const index = aliasStore.findIndex((m) => m.id === member.id)
  if (index >= 0) {
    aliasStore[index] = cloneAliasMember(member)
  } else {
    aliasStore.push(cloneAliasMember(member))
  }
}
