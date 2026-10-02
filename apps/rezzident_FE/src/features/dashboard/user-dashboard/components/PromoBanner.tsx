import type { ReactNode } from 'react'
import type { PromoAd } from '#/features/dashboard/user-dashboard/types/home.types'
import { AdPlacement } from '#/shared/components/ui/ad-placement'

export interface PromoBannerProps {
  variant?: 'top-strip' | 'mid-promo'
  ad?: PromoAd
  className?: string
}

export function PromoBanner({ variant = 'mid-promo', ad, className }: PromoBannerProps): ReactNode {
  const isTopStrip = variant === 'top-strip'

  return (
    <AdPlacement
      variant={isTopStrip ? 'top-strip' : 'mid-feed'}
      imageUrl={ad?.imageSrc}
      altText={ad?.alt ?? (isTopStrip ? 'Top promotional banner' : 'Featured promotion')}
      href={ad?.href}
      width={ad?.width}
      height={ad?.height}
      className={className}
    />
  )
}
