import type { ReactNode } from 'react'
import type { PhotoPlaceholderProps } from '../../types/alias.types'
import { cn } from '#/shared/utils/cn'

export function PhotoPlaceholder({
  text = 'Alias photo will appear here',
  className,
}: PhotoPlaceholderProps): ReactNode {
  return (
    <div
      role="img"
      aria-label={text}
      className={cn(
        'bg-offWhite flex h-[160px] w-[120px] shrink-0 items-center justify-center rounded-2xl p-3 text-center',
        className,
      )}
    >
      <span className="font-dmsans text-warmGray text-[14px] leading-snug font-normal">{text}</span>
    </div>
  )
}
