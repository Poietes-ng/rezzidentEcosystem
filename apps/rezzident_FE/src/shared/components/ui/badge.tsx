import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'

export type BadgeVariant = 'yellow' | 'neutral' | 'deactivated' | 'alias' | 'active' | 'pending'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
}

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...props
}: BadgeProps): ReactNode {
  return (
    <span
      className={cn(
        'font-dmsans inline-flex items-center',
        variant === 'yellow' &&
          'bg-actionYellow text-actionDark inline-flex h-7 items-center justify-center rounded-[6px] px-2.5 text-xs font-bold tracking-normal',
        variant === 'alias' &&
          'text-actionDark inline-flex h-7 items-center justify-center rounded-[6px] bg-blue-100 px-2.5 text-xs font-bold tracking-normal',
        variant === 'neutral' && 'text-warmGray text-sm font-normal',
        variant === 'active' &&
          'text-successGreen inline-flex items-center gap-1.5 text-xs font-medium',
        variant === 'deactivated' &&
          'text-errorRed inline-flex items-center gap-1.5 text-xs font-medium',
        variant === 'pending' &&
          'text-warningGold inline-flex items-center gap-1.5 text-xs font-medium',
        className,
      )}
      {...props}
    >
      {variant === 'active' && (
        <span className="bg-successGreen h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
      )}
      {variant === 'deactivated' && (
        <span className="bg-errorRed h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
      )}
      {variant === 'pending' && (
        <span className="bg-warningGold h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
      )}
      {children}
    </span>
  )
}
