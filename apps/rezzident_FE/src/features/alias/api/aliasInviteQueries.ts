import { MOCK_ALIAS_CREATE_ERROR, MOCK_INVITE_ERROR } from '../mocks/alias.mocks'
import { INVITE_LIFETIME_MS } from '../constants/inviteLink'
import { sanitizeAliasPhoneDigits } from '../utils/aliasPhone'
import { resolveAliasStatus } from '../utils/aliasUiState'
import { cloneAliasMember, delay, getAliasStore, revokedInviteCodes } from './aliasStore'
import type { AliasMember, CreateAliasInput } from '../types/alias.types'

function generateUniqueInviteCode(): string {
  const store = getAliasStore()
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = `ali${Math.floor(1000 + Math.random() * 9000)}`
    const inUse = store.some((m) => m.invite?.code === candidate)
    if (!inUse && !revokedInviteCodes.has(candidate)) {
      return candidate
    }
  }
  return `ali${Date.now().toString().slice(-4)}`
}

export async function createAlias(input: CreateAliasInput): Promise<AliasMember> {
  await delay()
  if (MOCK_ALIAS_CREATE_ERROR) {
    throw new Error('Failed to create alias account.')
  }
  const store = getAliasStore()
  const code = generateUniqueInviteCode()
  const expiresAt = new Date(Date.now() + INVITE_LIFETIME_MS).toISOString()
  const newMember: AliasMember = {
    id: `alias-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phoneNumber: sanitizeAliasPhoneDigits(input.phoneNumber),
    relationship: input.relationship.trim(),
    status: 'pending',
    permissions: { ...input.permissions },
    invite: {
      code,
      expiresAt,
    },
  }
  store.unshift(cloneAliasMember(newMember))
  return cloneAliasMember(newMember)
}

export async function regenerateInvite(id: string): Promise<AliasMember> {
  await delay()
  if (MOCK_INVITE_ERROR) {
    throw new Error('Failed to regenerate invite link.')
  }
  const store = getAliasStore()
  const index = store.findIndex((m) => m.id === id)
  if (index === -1) {
    throw new Error(`Alias member with id ${id} not found.`)
  }
  const member = store[index]
  if (member.invite?.code) {
    revokedInviteCodes.add(member.invite.code)
  }
  const newCode = `ali${Math.floor(1000 + Math.random() * 9000)}`
  const newExpiry = new Date(Date.now() + INVITE_LIFETIME_MS).toISOString()
  const updated: AliasMember = {
    ...member,
    status: 'pending',
    invite: { code: newCode, expiresAt: newExpiry },
  }
  store[index] = updated
  return { ...updated }
}

export async function cancelInvite(id: string): Promise<{ success: boolean }> {
  await delay()
  if (MOCK_INVITE_ERROR) {
    throw new Error('Failed to cancel alias invite.')
  }
  const store = getAliasStore()
  const index = store.findIndex((m) => m.id === id)
  if (index === -1) {
    throw new Error(`Alias member with id ${id} not found.`)
  }
  const member = store[index]
  if (member.invite?.code) {
    revokedInviteCodes.add(member.invite.code)
  }
  store.splice(index, 1)
  return { success: true }
}

export function isInviteCodeValid(code: string): boolean {
  if (revokedInviteCodes.has(code)) {
    return false
  }
  const store = getAliasStore()
  const activeMember = store.find((m) => m.invite?.code === code)
  if (!activeMember) {
    return false
  }
  return resolveAliasStatus(activeMember) === 'pending'
}
