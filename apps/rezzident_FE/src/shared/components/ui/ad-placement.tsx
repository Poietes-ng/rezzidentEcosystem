import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'

export interface AdPlacementProps {
  variant?: 'top-banner' | 'mid-feed' | 'top-strip' | 'mid-banner'
  imageUrl?: string
  altText?: string
  href?: string
  onClick?: () => void
  onDismiss?: () => void
  className?: string
  showAdBadge?: boolean
  width?: number
  height?: number
}

export function AdPlacement({
  variant = 'top-banner',
  imageUrl,
  altText = 'Advertisement',
  href,
  onClick,
  onDismiss,
  className,
  showAdBadge = false,
  width,
  height,
}: AdPlacementProps): ReactNode {
  const [hasError, setHasError] = useState<boolean>(false)

  const isTop = variant === 'top-banner' || variant === 'top-strip'
  const isTopStrip = variant === 'top-strip'

  const containerClasses = cn(
    'relative overflow-hidden w-full select-none',
    isTopStrip
      ? 'aspect-[393/60] rounded-none bg-gray-100'
      : isTop
        ? 'h-[60px] rounded-[12px] bg-gray-100'
        : 'aspect-[345/100] rounded-[16px] bg-gray-100',
    className,
  )

  const hasImage = Boolean(imageUrl) && !hasError

  const content = (
    <div className="h-full w-full">
      {hasImage ? (
        <img
          src={imageUrl}
          alt={altText}
          width={width}
          height={height}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              ad_group
            </span>
            <span className="font-dmsans text-caption font-medium">Ad Space</span>
          </div>
        </div>
      )}

      {/* Optional Ad label */}
      {showAdBadge && (
        <div className="absolute bottom-1 left-2 rounded-xs bg-black/40 px-1.5 py-0.5">
          <span className="text-[10px] font-medium text-white">Ad</span>
        </div>
      )}
    </div>
  )

  return (
    <div className={containerClasses}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className="block h-full w-full transition-transform active:scale-[0.99]"
          aria-label={altText}
        >
          {content}
        </a>
      ) : onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="block h-full w-full text-left transition-transform active:scale-[0.99]"
          aria-label={altText}
        >
          {content}
        </button>
      ) : (
        content
      )}

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss advertisement"
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 active:scale-95"
        >
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
            close
          </span>
        </button>
      )}
    </div>
  )
}
