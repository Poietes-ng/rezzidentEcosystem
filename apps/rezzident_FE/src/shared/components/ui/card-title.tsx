import * as React from 'react'
import { cn } from '../../utils/cn'

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref): React.JSX.Element => (
    <h3
      ref={ref}
      className={cn('font-dmsans text-[16px] font-bold text-actionDark', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'
