import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AliasAvatarProps } from '../types/alias.types'
import { cn } from '#/shared/utils/cn'

export function AliasAvatar({
  firstName,
  lastName,
  fullName,
  photoUrl,
  size = 'sm',
  className,
  alt,
}: AliasAvatarProps): ReactNode {
  const [currentSrc, setCurrentSrc] = useState(photoUrl)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setCurrentSrc(photoUrl)
    setHasError(false)
  }, [photoUrl])

  function handleImageError(): void {
    setHasError(true)
  }

  const displayName = fullName || [firstName, lastName].filter(Boolean).join(' ') || 'Alias Member'

  const computedAlt = alt || displayName

  const initials = (
    (firstName?.[0] || '') + (lastName?.[0] || '') ||
    displayName
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('') ||
    'A'
  ).toUpperCase()

  const sizeClasses = {
    sm: 'w-12 h-12 rounded-xl text-body-small',
    md: 'w-14 h-14 rounded-xl text-body-base',
    lg: 'w-[120px] h-[160px] rounded-2xl text-heading-2',
  }[size]

  if (currentSrc && !hasError) {
    return (
      <img
        src={currentSrc}
        alt={computedAlt}
        onError={handleImageError}
        className={cn('shrink-0 object-cover', sizeClasses, className)}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={computedAlt}
      className={cn(
        'bg-stoneEdge/30 text-actionDark flex shrink-0 items-center justify-center font-semibold select-none',
        sizeClasses,
        className,
      )}
    >
      {initials}
    </div>
  )
}
