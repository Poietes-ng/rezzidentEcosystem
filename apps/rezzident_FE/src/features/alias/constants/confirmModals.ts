export type ActiveModalType = 'deactivate' | 'reactivate' | 'delete' | 'cancel-invite'

export interface ConfirmModalConfig {
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  tone: 'destructive' | 'success'
}

export const CONFIRM_MODAL_CONFIGS: Record<ActiveModalType, ConfirmModalConfig> = {
  deactivate: {
    title: 'Deactivate Account?',
    message:
      'Are you sure you want to deactivate this alias account? They will lose access to all estate features until reactivated.',
    confirmLabel: 'Deactivate',
    tone: 'destructive',
  },
  reactivate: {
    title: 'Reactivate Account?',
    message:
      'Are you sure you want to reactivate this alias account? They will regain access to authorized estate features.',
    confirmLabel: 'Reactivate',
    tone: 'success',
  },
  delete: {
    title: 'Delete Account?',
    message: 'Are you sure you want to delete this alias account? This action cannot be undone.',
    confirmLabel: 'Delete',
    tone: 'destructive',
  },
  'cancel-invite': {
    title: 'Cancel Alias Invite?',
    message:
      "Are you sure you want to cancel this alias invite? The registration link will be revoked and they won't be able to complete their setup.",
    confirmLabel: 'Cancel Invite',
    cancelLabel: 'Go Back',
    tone: 'destructive',
  },
}
