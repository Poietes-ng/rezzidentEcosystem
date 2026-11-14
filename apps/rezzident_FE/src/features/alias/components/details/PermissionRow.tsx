import type { ReactNode } from 'react'
import type { PermissionRowProps } from '../../types/alias.types'
import { Switch } from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export function PermissionRow({
  id,
  icon,
  label,
  checked,
  onCheckedChange,
  disabled = false,
}: PermissionRowProps): ReactNode {
  function handleCheckedChange(newChecked: boolean): void {
    if (disabled) return
    onCheckedChange(newChecked)
  }

  const iconElement =
    typeof icon === 'string' ? (
      <span
        className="material-symbols-outlined text-actionDark shrink-0 text-[20px]"
        aria-hidden="true"
      >
        {icon}
      </span>
    ) : (
      <span
        className="text-actionDark flex h-5 w-5 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        {icon}
      </span>
    )

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-3 py-2',
        disabled && 'pointer-events-none select-none',
      )}
    >
      <label
        htmlFor={disabled ? undefined : id}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
          }
        }}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-3 select-none',
          disabled ? 'cursor-default' : 'cursor-pointer',
        )}
      >
        {iconElement}
        <span className="font-dmsans text-actionDark truncate text-[15px] leading-normal font-semibold">
          {label}
        </span>
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        aria-label={label}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(disabled && 'pointer-events-none cursor-default')}
      />
    </div>
  )
}
