import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AliasPermissions } from '../types/alias.types'

export interface UsePermissionsDraftReturn {
  saved: AliasPermissions | null
  draft: AliasPermissions
  isDirty: boolean
  toggle: (key: keyof AliasPermissions, value?: boolean) => void
  reset: () => void
  setSaved: (newPermissions: AliasPermissions) => void
}

const EMPTY_PERMISSIONS: AliasPermissions = {
  visitorCode: false,
  forum: false,
  bills: false,
}

export function usePermissionsDraft(
  initialPermissions?: AliasPermissions,
): UsePermissionsDraftReturn {
  const [saved, setSavedState] = useState<AliasPermissions | null>(
    initialPermissions ? { ...initialPermissions } : null,
  )
  const [draft, setDraft] = useState<AliasPermissions>(
    initialPermissions ? { ...initialPermissions } : EMPTY_PERMISSIONS,
  )

  // Sync when initialPermissions is loaded or changes
  useEffect(() => {
    if (initialPermissions) {
      setSavedState({ ...initialPermissions })
      setDraft({ ...initialPermissions })
    }
  }, [initialPermissions?.visitorCode, initialPermissions?.forum, initialPermissions?.bills])

  const isDirty = useMemo(() => {
    if (!saved) return false
    return (
      draft.visitorCode !== saved.visitorCode ||
      draft.forum !== saved.forum ||
      draft.bills !== saved.bills
    )
  }, [draft, saved])

  const toggle = useCallback((key: keyof AliasPermissions, value?: boolean): void => {
    setDraft((prev) => ({
      ...prev,
      [key]: typeof value === 'boolean' ? value : !prev[key],
    }))
  }, [])

  const reset = useCallback((): void => {
    if (saved) {
      setDraft({ ...saved })
    }
  }, [saved])

  const setSaved = useCallback((newPermissions: AliasPermissions): void => {
    setSavedState({ ...newPermissions })
    setDraft({ ...newPermissions })
  }, [])

  return {
    saved,
    draft,
    isDirty,
    toggle,
    reset,
    setSaved,
  }
}
