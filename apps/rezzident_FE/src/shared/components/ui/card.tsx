import * as React from 'react'
import { cn } from '../../utils/cn'

export type CardVariant = 'default' | 'dashed-yellow' | 'outlined' | 'flat'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

const cardVariants: Record<CardVariant, string> = {
  default: 'bg-white border border-stoneEdge/40 rounded-2xl shadow-sm',
  'dashed-yellow': 'bg-white border border-dashed border-actionYellow rounded-2xl',
  outlined: 'bg-white border border-stoneEdge rounded-2xl',
  flat: 'bg-offWhite rounded-2xl',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref): React.JSX.Element => {
    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-200',
          cardVariants[variant],
          className,
        )}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'
