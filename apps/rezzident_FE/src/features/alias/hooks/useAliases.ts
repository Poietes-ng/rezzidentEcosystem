import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { aliasKeys } from '../api/aliasKeys'
import { getAllAliases, getAliases, getPrimaryAccount } from '../api/aliasQueries'
import type { AliasMember, PrimaryAccount } from '../types/alias.types'

export interface AliasData {
  primaryAccount: PrimaryAccount | null
  members: AliasMember[]
}

export interface UseAliasesReturn {
  data: AliasData | null
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<void>
}

export function useAliases(fetchAll = false): UseAliasesReturn {
  const { data, isLoading, isError, refetch } = useQuery<AliasData>({
    queryKey: aliasKeys.list(fetchAll),
    queryFn: async (): Promise<AliasData> => {
      const fetchMembers = fetchAll ? getAllAliases : getAliases
      const [primaryAccount, members] = await Promise.all([getPrimaryAccount(), fetchMembers()])
      return { primaryAccount, members }
    },
  })

  const handleRefetch = useCallback(async (): Promise<void> => {
    await refetch()
  }, [refetch])

  return {
    data: data ?? null,
    isLoading,
    isError,
    refetch: handleRefetch,
  }
}
