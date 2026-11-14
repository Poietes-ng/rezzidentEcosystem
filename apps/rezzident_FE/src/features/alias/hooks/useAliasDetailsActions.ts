import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useRef, useState } from 'react'
import { aliasKeys } from '../api/aliasKeys'
import { cancelInvite, regenerateInvite } from '../api/aliasQueries'
import { useAliasLifecycle } from './useAliasLifecycle'
import { useToastState } from './useToastState'
import type { ActiveModalType } from '../constants/confirmModals'
import type { AliasDetailsData, AliasPermissions } from '../types/alias.types'
import type { UseToastStateReturn } from './useToastState'

export interface UseAliasDetailsActionsParams {
  aliasId: string
  draft: AliasPermissions
  setSaved: (permissions: AliasPermissions) => void
  resetDraft: () => void
}

export interface UseAliasDetailsActionsReturn {
  activeModal: ActiveModalType | null
  openModal: (type: ActiveModalType) => void
  closeModal: () => void
  toast: UseToastStateReturn
  isSubmitting: boolean
  handleUpdatePermissions: () => Promise<void>
  handleConfirmModal: () => Promise<void>
  handleRegenerateInvite: () => Promise<void>
}

export function useAliasDetailsActions({
  aliasId,
  draft,
  setSaved,
  resetDraft,
}: UseAliasDetailsActionsParams): UseAliasDetailsActionsReturn {
  const navigate = useNavigate()
  const toast = useToastState()
  const queryClient = useQueryClient()
  const [activeModal, setActiveModal] = useState<ActiveModalType | null>(null)
  const isInvitingRef = useRef(false)

  const {
    isSubmitting: isLifecycleSubmitting,
    deactivate,
    reactivate,
    remove,
    update,
  } = useAliasLifecycle()

  const regenerateMutation = useMutation({
    mutationFn: (id: string) => regenerateInvite(id),
    onSuccess: (updatedMember, id) => {
      queryClient.setQueryData<AliasDetailsData | null>(aliasKeys.detail(id), (old) => {
        if (!old) return old
        return {
          ...old,
          member: {
            ...old.member,
            status: 'pending',
            invite: updatedMember.invite ? { ...updatedMember.invite } : undefined,
          },
        }
      })
      void queryClient.invalidateQueries({ queryKey: aliasKeys.lists() })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelInvite(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(aliasKeys.detail(id), null)
      void queryClient.invalidateQueries({ queryKey: aliasKeys.lists() })
    },
  })

  const isSubmitting =
    isLifecycleSubmitting || regenerateMutation.isPending || cancelMutation.isPending

  const closeModal = useCallback((): void => {
    if (isSubmitting) return
    setActiveModal(null)
  }, [isSubmitting])

  const openModal = useCallback(
    (type: ActiveModalType): void => {
      if (isSubmitting) return
      setActiveModal(type)
    },
    [isSubmitting],
  )

  const runLifecycleAction = useCallback(
    async (
      actionFn: () => Promise<void>,
      options?: {
        onSuccess?: () => void
        onFailure?: () => void
        successToast?: string
      },
    ): Promise<void> => {
      if (isSubmitting || !aliasId) return

      try {
        await actionFn()
        setActiveModal(null)
        options?.onSuccess?.()
        if (options?.successToast) {
          toast.show(options.successToast, 'success')
        }
      } catch {
        setActiveModal(null)
        options?.onFailure?.()
        toast.show("Couldn't complete the action. Please try again.", 'error')
      }
    },
    [aliasId, isSubmitting, toast],
  )

  const handleUpdatePermissions = useCallback(async (): Promise<void> => {
    await runLifecycleAction(
      async () => {
        const updated = await update(aliasId, draft)
        setSaved(updated.permissions)
      },
      {
        onFailure: () => resetDraft(),
        successToast: 'Permissions updated',
      },
    )
  }, [aliasId, draft, resetDraft, runLifecycleAction, setSaved, update])

  const handleDeactivate = useCallback(async (): Promise<void> => {
    await runLifecycleAction(async () => {
      await deactivate(aliasId)
    })
  }, [aliasId, deactivate, runLifecycleAction])

  const handleReactivate = useCallback(async (): Promise<void> => {
    await runLifecycleAction(async () => {
      await reactivate(aliasId)
    })
  }, [aliasId, reactivate, runLifecycleAction])

  const handleDelete = useCallback(async (): Promise<void> => {
    await runLifecycleAction(async () => {
      await remove(aliasId)
      void navigate({ to: '/alias' })
    })
  }, [aliasId, navigate, remove, runLifecycleAction])

  const handleCancelInvite = useCallback(async (): Promise<void> => {
    await runLifecycleAction(async () => {
      if (isInvitingRef.current) return
      isInvitingRef.current = true
      try {
        await cancelMutation.mutateAsync(aliasId)
        void navigate({ to: '/alias' })
      } finally {
        isInvitingRef.current = false
      }
    })
  }, [aliasId, cancelMutation, navigate, runLifecycleAction])

  const handleRegenerateInvite = useCallback(async (): Promise<void> => {
    await runLifecycleAction(
      async () => {
        if (isInvitingRef.current) return
        isInvitingRef.current = true
        try {
          await regenerateMutation.mutateAsync(aliasId)
        } finally {
          isInvitingRef.current = false
        }
      },
      {
        successToast: 'New invite link generated',
      },
    )
  }, [aliasId, regenerateMutation, runLifecycleAction])

  const handleConfirmModal = useCallback(async (): Promise<void> => {
    if (activeModal === 'deactivate') {
      await handleDeactivate()
    } else if (activeModal === 'reactivate') {
      await handleReactivate()
    } else if (activeModal === 'delete') {
      await handleDelete()
    } else if (activeModal === 'cancel-invite') {
      await handleCancelInvite()
    }
  }, [activeModal, handleCancelInvite, handleDeactivate, handleDelete, handleReactivate])

  return {
    activeModal,
    openModal,
    closeModal,
    toast,
    isSubmitting,
    handleUpdatePermissions,
    handleConfirmModal,
    handleRegenerateInvite,
  }
}
