import * as React from 'react'
import { cn } from '../../utils/cn'

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref): React.JSX.Element => (
    <div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'
