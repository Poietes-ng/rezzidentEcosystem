import type { ReactNode } from 'react'

export type AliasStatus = 'active' | 'deactivated' | 'pending' | 'expired'

export interface AliasPermissions {
  visitorCode: boolean
  forum: boolean
  bills: boolean
}

export interface AliasInvite {
  code: string
  expiresAt: string
}

export interface AliasMember {
  id: string
  firstName: string
  lastName: string
  phoneNumber?: string
  relationship: string
  status: AliasStatus
  photoUrl?: string
  tier?: string
  permissions: AliasPermissions
  invite?: AliasInvite
}

export interface PrimaryAccount {
  name: string
  tier: string
  unit: string
  photoUrl?: string
}

export type AliasListState = 'empty' | 'populated' | 'max'

export interface PrimaryAccountCardProps {
  account: PrimaryAccount | null
  isLoading?: boolean
}

export interface CreateAliasCardProps {
  memberCount: number
  maxLimit?: number
  onOpenWhatIsAliasModal: () => void
  isLoading?: boolean
  to?: string
}

export interface AliasMemberRowProps {
  member: AliasMember
  to?: string
}

export interface AliasEmptyStateProps {
  variant?: 'card' | 'large'
}

export interface WhatIsAliasModalProps {
  open: boolean
  onClose: () => void
}

export interface AliasAvatarProps {
  firstName?: string
  lastName?: string
  fullName?: string
  photoUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  alt?: string
}

export interface AliasDetailsData {
  member: AliasMember
  primaryAccount: PrimaryAccount
}

export interface AliasProfileCardProps {
  member: AliasMember | null
  isLoading?: boolean
}

export interface PermissionRowProps {
  id: string
  icon: ReactNode
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export interface PermissionsCardProps {
  permissions: AliasPermissions
  onChange: (key: keyof AliasPermissions, value: boolean) => void
  disabled?: boolean
  isLoading?: boolean
}

export interface AliasActionBarProps {
  status: AliasStatus
  isDirty: boolean
  isUpdating: boolean
  onUpdatePermissions: () => void
  onDeactivate: () => void
  onReactivate: () => void
  onDelete: () => void
  onCancelProcess?: () => void
  disabled?: boolean
}

export interface ConfirmActionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  tone?: 'destructive' | 'success'
  isLoading?: boolean
}

export interface PhotoPlaceholderProps {
  text?: string
  className?: string
}

export interface InviteLinkFieldProps {
  code: string
  isExpired: boolean
  copied: boolean
  onCopy: () => void
}

export interface InviteExpiryTextProps {
  expiresAt: string
  onExpire?: () => void
}

export interface InviteLinkCardProps {
  code: string
  expiresAt: string
  isExpired: boolean
  copied: boolean
  isSharing?: boolean
  isRegenerating?: boolean
  onCopy: () => void
  onShare: () => void
  onRegenerate: () => void
  onExpire?: () => void
}

export interface CreateAliasNameStepProps {
  firstName: string
  lastName: string
  phoneDigits: string
  firstNameError: string | null
  lastNameError: string | null
  phoneError: string | null
  isCheckingPhone: boolean
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onPhoneChange: (rawValue: string) => void
  onSubmit: () => void
}

export interface CreateAliasRelationshipStepProps {
  relationship: string
  onRelationshipChange: (value: string) => void
  onSelectOthers: () => void
  onContinue: () => void
}

export interface CreateAliasCustomRelationshipStepProps {
  customRelationship: string
  onCustomRelationshipChange: (value: string) => void
  onContinue: () => void
}

export interface CreateAliasInput {
  firstName: string
  lastName: string
  phoneNumber: string
  relationship: string
  permissions: AliasPermissions
}

export interface CreateAliasPermissionsStepProps {
  permissions: AliasPermissions
  isSubmitting: boolean
  onPermissionChange: (key: keyof AliasPermissions, value: boolean) => void
  onSubmit: () => void
}

export interface CreateAliasSuccessStepProps {
  inviteCode: string
  onDone: () => void
}
