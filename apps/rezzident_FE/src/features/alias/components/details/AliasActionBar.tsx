import { getAliasUiState } from '../../utils/aliasUiState'
import type { ReactNode } from 'react'
import type { AliasActionBarProps } from '../../types/alias.types'
import { Button } from '#/shared/components/ui'

export function AliasActionBar({
  status,
  isDirty,
  isUpdating,
  onUpdatePermissions,
  onDeactivate,
  onReactivate,
  onDelete,
  onCancelProcess,
  disabled = false,
}: AliasActionBarProps): ReactNode {
  const uiState = getAliasUiState(status, isDirty)

  if (uiState.isReadOnly || !uiState.actionButton) {
    return null
  }

  function handleMainAction(): void {
    if (disabled || isUpdating || uiState.actionButton?.disabled) return

    if (uiState.actionButton?.action === 'updatePermissions') {
      onUpdatePermissions()
    } else if (uiState.actionButton?.action === 'deactivate') {
      onDeactivate()
    } else if (uiState.actionButton?.action === 'reactivate') {
      onReactivate()
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 pt-4">
      <Button
        variant={uiState.actionButton.variant}
        loading={isUpdating}
        loadingText="Updating permissions..."
        disabled={disabled || isUpdating || Boolean(uiState.actionButton.disabled)}
        onClick={handleMainAction}
        className="h-[52px] w-full rounded-2xl text-[16px] font-bold"
      >
        {uiState.actionButton.label}
      </Button>

      {uiState.showDeleteLink && (
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled || isUpdating}
          className="font-dmsans text-errorRed focus-visible:ring-actionDark text-[15px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete Account
        </button>
      )}

      {uiState.showCancelProcessLink && onCancelProcess && (
        <button
          type="button"
          onClick={onCancelProcess}
          disabled={disabled || isUpdating}
          className="font-dmsans text-actionDark focus-visible:ring-actionDark text-[15px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel Process
        </button>
      )}
    </div>
  )
}
