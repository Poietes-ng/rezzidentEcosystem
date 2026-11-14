import { useMutation } from '@tanstack/react-query'
import { checkAliasPhone } from '../api/aliasQueries'

export interface UseCheckAliasPhoneReturn {
  checkPhone: (phone: string) => Promise<{ exists: boolean }>
  isCheckingPhone: boolean
}

export function useCheckAliasPhone(): UseCheckAliasPhoneReturn {
  const mutation = useMutation({
    mutationFn: (phone: string) => checkAliasPhone(phone),
  })

  return {
    checkPhone: mutation.mutateAsync,
    isCheckingPhone: mutation.isPending,
  }
}
