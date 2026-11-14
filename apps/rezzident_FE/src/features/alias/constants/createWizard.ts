import type { AliasMember, AliasPermissions } from '../types/alias.types'

export type CreateWizardSubStep =
  'name' | 'relationship' | 'custom-relationship' | 'permissions' | 'success'

export interface UseCreateAliasWizardReturn {
  subStep: CreateWizardSubStep
  logicalStep: 1 | 2 | 3
  firstName: string
  lastName: string
  phoneDigits: string
  relationship: string
  customRelationship: string
  permissions: AliasPermissions
  createdMember: AliasMember | null
  firstNameError: string | null
  lastNameError: string | null
  phoneError: string | null
  isCheckingPhone: boolean
  isCreatingAlias: boolean
  setRelationship: (value: string) => void
  setCustomRelationship: (value: string) => void
  handlePermissionChange: (key: keyof AliasPermissions, value: boolean) => void
  handleBack: () => void
  handleDone: () => void
  handleFirstNameChange: (value: string) => void
  handleLastNameChange: (value: string) => void
  handlePhoneChange: (rawValue: string) => void
  handleStep1Submit: () => Promise<void>
  handleOpenCustomRelationship: () => void
  handleRelationshipContinue: () => void
  handleCustomRelationshipContinue: () => void
  handleCreateAliasSubmit: () => Promise<void>
}

export const NAME_ERROR_MESSAGE = 'Please enter your full name.'
export const PHONE_INVALID_MESSAGE = 'Please enter a valid phone number.'
export const PHONE_REGISTERED_MESSAGE = 'This phone number is already registered.'
export const MAX_ALIAS_LIMIT = 10

export const DEFAULT_CREATE_PERMISSIONS: AliasPermissions = {
  visitorCode: true,
  forum: true,
  bills: true,
}

export function getLogicalStep(subStep: CreateWizardSubStep): 1 | 2 | 3 {
  if (subStep === 'name') return 1
  if (subStep === 'relationship' || subStep === 'custom-relationship') return 2
  return 3
}
