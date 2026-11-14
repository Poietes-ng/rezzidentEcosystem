import {
  ACTIVE_ALIAS_LIST_STATE,
  MOCK_ALIAS_LIST_ERROR,
  MOCK_ALIAS_STATUS_ERROR,
  MOCK_PERMISSIONS_ERROR,
  MOCK_PRIMARY_ACCOUNT,
  MOCK_REGISTERED_ALIAS_PHONES,
} from '../mocks/alias.mocks'
import { sanitizeAliasPhoneDigits } from '../utils/aliasPhone'
import {
  cloneAliasMember,
  delay,
  getAliasStore,
  resetAliasStore,
  setAliasInStore,
} from './aliasStore'
import {
  cancelInvite,
  createAlias,
  isInviteCodeValid,
  regenerateInvite,
} from './aliasInviteQueries'
import type {
  AliasDetailsData,
  AliasMember,
  AliasPermissions,
  PrimaryAccount,
} from '../types/alias.types'

export {
  resetAliasStore,
  setAliasInStore,
  createAlias,
  regenerateInvite,
  cancelInvite,
  isInviteCodeValid,
}

export async function getPrimaryAccount(): Promise<PrimaryAccount> {
  await delay()
  if (MOCK_ALIAS_LIST_ERROR) {
    throw new Error('Failed to load primary account details.')
  }
  return { ...MOCK_PRIMARY_ACCOUNT }
}

export async function getAliases(): Promise<AliasMember[]> {
  await delay()
  if (MOCK_ALIAS_LIST_ERROR) {
    throw new Error('Failed to load alias accounts.')
  }
  if (ACTIVE_ALIAS_LIST_STATE === 'empty') {
    return []
  }
  const store = getAliasStore()
  if (ACTIVE_ALIAS_LIST_STATE === 'max') {
    return store.slice(0, 10).map(cloneAliasMember)
  }
  return store.slice(0, 4).map(cloneAliasMember)
}

export async function getAllAliases(): Promise<AliasMember[]> {
  await delay()
  if (MOCK_ALIAS_LIST_ERROR) {
    throw new Error('Failed to load alias accounts.')
  }
  if (ACTIVE_ALIAS_LIST_STATE === 'empty') {
    return []
  }
  return getAliasStore().map(cloneAliasMember)
}

export async function getAlias(id: string): Promise<AliasDetailsData | null> {
  await delay()
  if (MOCK_ALIAS_LIST_ERROR) {
    throw new Error('Failed to load alias details.')
  }
  const found = getAliasStore().find((m) => m.id === id)
  if (!found) {
    return null
  }
  return {
    member: cloneAliasMember(found),
    primaryAccount: { ...MOCK_PRIMARY_ACCOUNT },
  }
}

export async function updatePermissions(
  id: string,
  permissions: AliasPermissions,
): Promise<AliasMember> {
  await delay()
  if (MOCK_PERMISSIONS_ERROR) {
    throw new Error('Failed to update permissions.')
  }
  const store = getAliasStore()
  const index = store.findIndex((m) => m.id === id)
  if (index === -1) {
    throw new Error(`Alias member with id ${id} not found.`)
  }
  store[index] = { ...store[index], permissions: { ...permissions } }
  return { ...store[index] }
}

export async function deactivateAlias(id: string): Promise<AliasMember> {
  await delay()
  if (MOCK_ALIAS_STATUS_ERROR) {
    throw new Error('Failed to deactivate alias account.')
  }
  const store = getAliasStore()
  const index = store.findIndex((m) => m.id === id)
  if (index === -1) {
    throw new Error(`Alias member with id ${id} not found.`)
  }
  store[index] = { ...store[index], status: 'deactivated' }
  return { ...store[index] }
}

export async function reactivateAlias(id: string): Promise<AliasMember> {
  await delay()
  if (MOCK_ALIAS_STATUS_ERROR) {
    throw new Error('Failed to reactivate alias account.')
  }
  const store = getAliasStore()
  const index = store.findIndex((m) => m.id === id)
  if (index === -1) {
    throw new Error(`Alias member with id ${id} not found.`)
  }
  store[index] = { ...store[index], status: 'active' }
  return { ...store[index] }
}

export async function deleteAlias(id: string): Promise<{ success: boolean }> {
  await delay()
  if (MOCK_ALIAS_STATUS_ERROR) {
    throw new Error('Failed to delete alias account.')
  }
  const store = getAliasStore()
  const index = store.findIndex((m) => m.id === id)
  if (index === -1) {
    throw new Error(`Alias member with id ${id} not found.`)
  }
  store.splice(index, 1)
  return { success: true }
}

export async function checkAliasPhone(phone: string): Promise<{ exists: boolean }> {
  await delay()
  const normalized = sanitizeAliasPhoneDigits(phone)
  const inMockRegistered = MOCK_REGISTERED_ALIAS_PHONES.includes(normalized)
  const inStore = getAliasStore().some(
    (member) => member.phoneNumber && sanitizeAliasPhoneDigits(member.phoneNumber) === normalized,
  )
  return { exists: inMockRegistered || inStore }
}
