import { useCallback, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aliasKeys } from '../api/aliasKeys'
import { createAlias } from '../api/aliasQueries'
import type { AliasMember, CreateAliasInput } from '../types/alias.types'

export interface UseCreateAliasReturn {
  createAliasAccount: (input: CreateAliasInput) => Promise<AliasMember>
  isCreatingAlias: boolean
  isCreateAliasError: boolean
  resetCreateAliasError: () => void
}

export function useCreateAlias(): UseCreateAliasReturn {
  const queryClient = useQueryClient()
  const isSubmittingRef = useRef(false)

  const mutation = useMutation({
    mutationFn: (input: CreateAliasInput) => createAlias(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aliasKeys.lists() })
    },
  })

  const createAliasAccount = useCallback(
    async (input: CreateAliasInput): Promise<AliasMember> => {
      if (isSubmittingRef.current || mutation.isPending) {
        throw new Error('Alias creation already in progress')
      }
      isSubmittingRef.current = true
      try {
        return await mutation.mutateAsync(input)
      } finally {
        isSubmittingRef.current = false
      }
    },
    [mutation],
  )

  return {
    createAliasAccount,
    isCreatingAlias: mutation.isPending,
    isCreateAliasError: mutation.isError,
    resetCreateAliasError: mutation.reset,
  }
}
