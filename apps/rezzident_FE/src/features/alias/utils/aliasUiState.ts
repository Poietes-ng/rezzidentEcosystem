import type { AliasMember, AliasStatus } from '../types/alias.types'

export type ActionButtonType = 'deactivate' | 'reactivate' | 'updatePermissions'

export interface AliasUiState {
  statusTag: {
    variant: 'active' | 'deactivated' | 'pending'
    label: string
  }
  isSwitchesLocked: boolean
  actionButton: {
    variant: 'destructive' | 'success' | 'primary'
    label: string
    action: ActionButtonType
    disabled?: boolean
  } | null
  showDeleteLink: boolean
  showCancelProcessLink: boolean
  showInviteCard: boolean
  isReadOnly: boolean
}

/**
 * Resolves the effective status of an alias member.
 * If status is 'pending' and expiresAt is in the past, returns 'expired'.
 */
export function resolveAliasStatus(
  member: Pick<AliasMember, 'status' | 'invite'>,
  now: number = Date.now(),
): AliasStatus {
  if (member.status === 'pending') {
    if (member.invite) {
      const expiryTime = new Date(member.invite.expiresAt).getTime()
      if (!Number.isNaN(expiryTime) && expiryTime <= now) {
        return 'expired'
      }
    }
    return 'pending'
  }
  return member.status
}

export function getAliasUiState(status: AliasStatus, isDirty: boolean): AliasUiState {
  if (status === 'pending' || status === 'expired') {
    return {
      statusTag: {
        variant: 'pending',
        label: 'Pending',
      },
      isSwitchesLocked: true,
      actionButton: {
        variant: 'primary',
        label: 'Deactivate Account',
        action: 'deactivate',
        disabled: true,
      },
      showDeleteLink: false,
      showCancelProcessLink: true,
      showInviteCard: true,
      isReadOnly: false,
    }
  }

  if (status === 'deactivated') {
    return {
      statusTag: {
        variant: 'deactivated',
        label: 'Deactivated',
      },
      isSwitchesLocked: true,
      actionButton: {
        variant: 'success',
        label: 'Reactivate Account',
        action: 'reactivate',
      },
      showDeleteLink: true,
      showCancelProcessLink: false,
      showInviteCard: false,
      isReadOnly: false,
    }
  }

  // Active status
  if (isDirty) {
    return {
      statusTag: {
        variant: 'active',
        label: 'Active',
      },
      isSwitchesLocked: false,
      actionButton: {
        variant: 'primary',
        label: 'Update Permissions',
        action: 'updatePermissions',
      },
      showDeleteLink: true,
      showCancelProcessLink: false,
      showInviteCard: false,
      isReadOnly: false,
    }
  }

  return {
    statusTag: {
      variant: 'active',
      label: 'Active',
    },
    isSwitchesLocked: false,
    actionButton: {
      variant: 'destructive',
      label: 'Deactivate Account',
      action: 'deactivate',
    },
    showDeleteLink: true,
    showCancelProcessLink: false,
    showInviteCard: false,
    isReadOnly: false,
  }
}
