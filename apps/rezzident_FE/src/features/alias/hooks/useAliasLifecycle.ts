import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { aliasKeys } from '../api/aliasKeys'
import {
  deactivateAlias,
  deleteAlias,
  reactivateAlias,
  updatePermissions,
} from '../api/aliasQueries'
import type { AliasDetailsData, AliasMember, AliasPermissions } from '../types/alias.types'

export type LifecycleAction = 'deactivate' | 'reactivate' | 'delete' | 'updatePermissions'

export interface UseAliasLifecycleReturn {
  isSubmitting: boolean
  deactivate: (id: string) => Promise<AliasMember>
  reactivate: (id: string) => Promise<AliasMember>
  remove: (id: string) => Promise<void>
  update: (id: string, permissions: AliasPermissions) => Promise<AliasMember>
}

export function useAliasLifecycle(): UseAliasLifecycleReturn {
  const queryClient = useQueryClient()
  const isMutatingRef = useRef(false)

  const updateMutation = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: AliasPermissions }) =>
      updatePermissions(id, permissions),
    onSuccess: (updatedMember, variables) => {
      queryClient.setQueryData<AliasDetailsData | null>(aliasKeys.detail(variables.id), (old) => {
        if (!old) return old
        return {
          ...old,
          member: { ...old.member, permissions: { ...updatedMember.permissions } },
        }
      })
      void queryClient.invalidateQueries({ queryKey: aliasKeys.lists() })
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateAlias(id),
    onSuccess: (updatedMember, id) => {
      queryClient.setQueryData<AliasDetailsData | null>(aliasKeys.detail(id), (old) => {
        if (!old) return old
        return {
          ...old,
          member: { ...old.member, status: updatedMember.status },
        }
      })
      void queryClient.invalidateQueries({ queryKey: aliasKeys.lists() })
    },
  })

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => reactivateAlias(id),
    onSuccess: (updatedMember, id) => {
      queryClient.setQueryData<AliasDetailsData | null>(aliasKeys.detail(id), (old) => {
        if (!old) return old
        return {
          ...old,
          member: { ...old.member, status: updatedMember.status },
        }
      })
      void queryClient.invalidateQueries({ queryKey: aliasKeys.lists() })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAlias(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(aliasKeys.detail(id), null)
      void queryClient.invalidateQueries({ queryKey: aliasKeys.lists() })
    },
  })

  const isSubmitting =
    updateMutation.isPending ||
    deactivateMutation.isPending ||
    reactivateMutation.isPending ||
    deleteMutation.isPending

  const deactivate = useCallback(
    async (id: string): Promise<AliasMember> => {
      if (isMutatingRef.current || isSubmitting) {
        throw new Error('Action already in progress')
      }
      isMutatingRef.current = true
      try {
        return await deactivateMutation.mutateAsync(id)
      } finally {
        isMutatingRef.current = false
      }
    },
    [deactivateMutation, isSubmitting],
  )

  const reactivate = useCallback(
    async (id: string): Promise<AliasMember> => {
      if (isMutatingRef.current || isSubmitting) {
        throw new Error('Action already in progress')
      }
      isMutatingRef.current = true
      try {
        return await reactivateMutation.mutateAsync(id)
      } finally {
        isMutatingRef.current = false
      }
    },
    [isSubmitting, reactivateMutation],
  )

  const remove = useCallback(
    async (id: string): Promise<void> => {
      if (isMutatingRef.current || isSubmitting) {
        throw new Error('Action already in progress')
      }
      isMutatingRef.current = true
      try {
        await deleteMutation.mutateAsync(id)
      } finally {
        isMutatingRef.current = false
      }
    },
    [deleteMutation, isSubmitting],
  )

  const update = useCallback(
    async (id: string, permissions: AliasPermissions): Promise<AliasMember> => {
      if (isMutatingRef.current || isSubmitting) {
        throw new Error('Action already in progress')
      }
      isMutatingRef.current = true
      try {
        return await updateMutation.mutateAsync({ id, permissions })
      } finally {
        isMutatingRef.current = false
      }
    },
    [isSubmitting, updateMutation],
  )

  return {
    isSubmitting,
    deactivate,
    reactivate,
    remove,
    update,
  }
}
